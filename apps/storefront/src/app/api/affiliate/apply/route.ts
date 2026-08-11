import { NextRequest, NextResponse } from "next/server"

import {
  PARTNER_COOKIE,
  REF_COOKIE_MAX_AGE,
  createAffiliate,
  type AffiliateApplication,
} from "@modules/affiliate/data"

export const runtime = "nodejs"

const clean = (v: unknown, max = 500): string =>
  typeof v === "string" ? v.trim().slice(0, max) : ""

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/**
 * Accepts a partner application. Always returns 200 with an actionable state —
 * a live code when the backend is configured, or a provisional "pending review"
 * code otherwise. Never throws to the client.
 */
export async function POST(req: NextRequest) {
  const payload = (await req.json().catch(() => ({}))) as Record<string, unknown>

  const application: AffiliateApplication = {
    name: clean(payload.name, 120),
    email: clean(payload.email, 160),
    channel: clean(payload.channel, 80),
    audience: clean(payload.audience, 120),
    notes: clean(payload.notes, 1000),
  }

  if (!application.name || !EMAIL_RE.test(application.email)) {
    return NextResponse.json(
      { ok: false, error: "invalid_input" },
      { status: 400 }
    )
  }

  try {
    const record = await createAffiliate(application)

    const res = NextResponse.json({
      ok: true,
      code: record.code,
      tier: record.tier,
      status: record.promotionCreated ? "active" : "pending_review",
      message: record.promotionCreated
        ? "Your partner code is live. Welcome aboard."
        : "Application received. Your provisional code is reserved while we review.",
    })

    // Remember the partner on this device so the dashboard auto-loads.
    res.cookies.set(PARTNER_COOKIE, record.code, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: REF_COOKIE_MAX_AGE,
    })

    return res
  } catch {
    // Absolute backstop — the applicant still gets a usable outcome.
    return NextResponse.json({
      ok: true,
      code: null,
      status: "pending_review",
      message:
        "Application received. We'll email your partner code after a quick review.",
    })
  }
}
