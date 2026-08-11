import { NextRequest, NextResponse } from "next/server"

import { REF_COOKIE, REF_COOKIE_MAX_AGE } from "@modules/affiliate/data"

export const runtime = "nodejs"

/**
 * Referral link landing: `/api/affiliate/track?ref=CODE`. Stamps an httpOnly
 * `cx_ref` attribution cookie and redirects to the homepage (or an internal
 * `to` path). The checkout hook later copies this cookie onto the order's
 * metadata so the stats API can attribute the sale (see INTEGRATION NOTES).
 */
export async function GET(req: NextRequest) {
  const raw = req.nextUrl.searchParams.get("ref")?.trim() ?? ""
  // Sanitise to the code alphabet so it can never carry a payload.
  const ref = raw.toUpperCase().replace(/[^A-Z0-9-]/g, "").slice(0, 40)

  const origin = req.nextUrl.origin
  const rawTo = req.nextUrl.searchParams.get("to") ?? "/"
  // Internal redirects only — no open redirect.
  const to =
    rawTo.startsWith("/") && !rawTo.startsWith("//") ? rawTo : "/"

  const res = NextResponse.redirect(new URL(to, origin), 302)

  if (ref) {
    res.cookies.set(REF_COOKIE, ref, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: REF_COOKIE_MAX_AGE,
    })
  }

  return res
}
