import { NextRequest, NextResponse } from "next/server"

import { promoCode, resolveEsp } from "@lib/marketing-config"

export const runtime = "nodejs"

/**
 * Email capture endpoint for the popup + inline newsletter.
 *
 * - Validates the email shape.
 * - Forwards to an ESP if one is configured (Omnisend or Klaviyo via env keys).
 * - When no ESP is configured, it simply accepts and returns success so the UI
 *   works end-to-end in every environment.
 * - Never throws to the client; ESP failures are swallowed and still return
 *   success (the lead UX should never show an error for a transient ESP issue).
 * - No PII in logs.
 */

// Light in-memory rate limit (best-effort; resets on cold start / per instance).
const WINDOW_MS = 60_000
const MAX_PER_WINDOW = 5
const hits = new Map<string, { count: number; ts: number }>()

function rateLimited(ip: string): boolean {
  const now = Date.now()
  const entry = hits.get(ip)
  if (!entry || now - entry.ts > WINDOW_MS) {
    hits.set(ip, { count: 1, ts: now })
    return false
  }
  entry.count += 1
  return entry.count > MAX_PER_WINDOW
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function clientIp(req: NextRequest): string {
  const fwd = req.headers.get("x-forwarded-for")
  if (fwd) return fwd.split(",")[0]!.trim()
  return req.headers.get("x-real-ip") || "unknown"
}

async function forwardToEsp(email: string): Promise<void> {
  const provider = resolveEsp()
  try {
    if (provider === "omnisend") {
      const key = process.env.OMNISEND_API_KEY
      if (!key) return
      await fetch("https://api.omnisend.com/v3/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-API-KEY": key },
        body: JSON.stringify({
          identifiers: [
            { type: "email", id: email, channels: { email: { status: "subscribed" } } },
          ],
          tags: ["storefront-popup"],
        }),
      })
    } else if (provider === "klaviyo") {
      const key = process.env.KLAVIYO_API_KEY
      if (!key) return
      await fetch("https://a.klaviyo.com/api/profiles/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          revision: "2024-10-15",
          Authorization: `Klaviyo-API-Key ${key}`,
        },
        body: JSON.stringify({
          data: { type: "profile", attributes: { email } },
        }),
      })
    }
  } catch {
    // Swallow — the visitor is captured client-side regardless; do not surface.
  }
}

export async function POST(req: NextRequest) {
  if (rateLimited(clientIp(req))) {
    return NextResponse.json(
      { ok: false, error: "rate_limited" },
      { status: 429 }
    )
  }

  const body = await req.json().catch(() => null)
  const email =
    body && typeof body.email === "string" ? body.email.trim().toLowerCase() : ""

  if (!email || email.length > 254 || !EMAIL_RE.test(email)) {
    return NextResponse.json(
      { ok: false, error: "invalid_email" },
      { status: 400 }
    )
  }

  await forwardToEsp(email)

  return NextResponse.json({ ok: true, code: promoCode })
}
