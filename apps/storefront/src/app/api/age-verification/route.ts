import { NextRequest, NextResponse } from "next/server"

import { AGE_COOKIE, AGE_COOKIE_MAX_AGE } from "@lib/age-gate"

export const runtime = "nodejs"

/**
 * Records an age/qualification confirmation. Posted from the plain <form> on
 * /age-verification, so we redirect rather than return JSON. The confirmation is
 * stored in an httpOnly cookie the middleware checks on every request — the gate
 * is enforced server-side and cannot be skipped by disabling JavaScript.
 */
export async function POST(req: NextRequest) {
  const form = await req.formData().catch(() => null)
  const confirmed = form?.get("confirm") === "on"
  const orgType = (form?.get("org_type") as string) || ""
  const rawReturnTo = (form?.get("returnTo") as string) || "/"

  // Only allow internal redirects (a single leading slash, no protocol / host)
  // so the returnTo value can never be turned into an open redirect.
  const returnTo =
    rawReturnTo.startsWith("/") && !rawReturnTo.startsWith("//")
      ? rawReturnTo
      : "/"

  const origin = req.nextUrl.origin

  // Both the 21+ affirmation and a research-use selection are required to enter.
  if (!confirmed || !orgType) {
    const back = new URL("/age-verification", origin)
    back.searchParams.set("error", "1")
    if (returnTo !== "/") back.searchParams.set("returnTo", returnTo)
    return NextResponse.redirect(back, 303)
  }

  const res = NextResponse.redirect(new URL(returnTo, origin), 303)
  res.cookies.set(AGE_COOKIE, "true", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: AGE_COOKIE_MAX_AGE,
  })
  return res
}
