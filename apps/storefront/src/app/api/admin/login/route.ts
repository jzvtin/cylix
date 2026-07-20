import { NextRequest, NextResponse } from "next/server"

import {
  ADMIN_COOKIE,
  adminCookieOptions,
  createSessionToken,
  isAdminAuthConfigured,
  isValidPassword,
} from "@lib/admin-auth"

export const runtime = "nodejs"

const WINDOW_MS = 15 * 60 * 1000 // 15 minutes
const MAX_ATTEMPTS = 8

/**
 * Per-IP attempt counter. This lives in module memory, so on a serverless
 * platform it is per-instance and resets on cold start — it raises the cost of
 * a brute-force attempt substantially but is not a hard guarantee. Move to
 * Redis (or the platform's rate limiter) if the admin panel is ever exposed to
 * meaningful traffic.
 */
const attempts = new Map<string, { count: number; resetAt: number }>()

function clientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for")
  if (forwarded) return forwarded.split(",")[0].trim()
  return req.headers.get("x-real-ip") ?? "unknown"
}

/** Returns null when allowed, or the seconds remaining when locked out. */
function checkRateLimit(ip: string, now: number): number | null {
  const record = attempts.get(ip)

  if (!record || now > record.resetAt) return null
  if (record.count < MAX_ATTEMPTS) return null

  return Math.ceil((record.resetAt - now) / 1000)
}

function recordFailure(ip: string, now: number) {
  const record = attempts.get(ip)

  if (!record || now > record.resetAt) {
    attempts.set(ip, { count: 1, resetAt: now + WINDOW_MS })
    return
  }

  record.count += 1
}

/** Drop expired entries so the map cannot grow without bound. */
function sweep(now: number) {
  if (attempts.size < 1000) return
  Array.from(attempts.entries()).forEach(([ip, record]) => {
    if (now > record.resetAt) attempts.delete(ip)
  })
}

export async function POST(req: NextRequest) {
  // Both the password AND the session secret are required — without the secret
  // no session can be signed, and issuing one would be a security hole.
  if (!isAdminAuthConfigured()) {
    return NextResponse.json({ error: "not_configured" }, { status: 503 })
  }

  const now = Date.now()
  const ip = clientIp(req)
  sweep(now)

  const lockedFor = checkRateLimit(ip, now)
  if (lockedFor !== null) {
    return NextResponse.json(
      { error: "too_many_attempts", retry_after: lockedFor },
      { status: 429, headers: { "Retry-After": String(lockedFor) } }
    )
  }

  const { password } = (await req.json().catch(() => ({}))) as {
    password?: string
  }

  if (!password || !isValidPassword(password)) {
    recordFailure(ip, now)
    console.warn("[admin] failed login attempt from", ip)
    // Delay still blunts fast sequential guessing within the allowance.
    await new Promise((r) => setTimeout(r, 400))
    return NextResponse.json({ error: "invalid_password" }, { status: 401 })
  }

  // Successful login clears the counter for that IP.
  attempts.delete(ip)

  const res = NextResponse.json({ ok: true })
  res.cookies.set(ADMIN_COOKIE, createSessionToken(now), adminCookieOptions)
  return res
}
