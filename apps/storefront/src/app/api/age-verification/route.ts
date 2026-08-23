import { NextRequest, NextResponse } from "next/server"

import { AGE_COOKIE, AGE_COOKIE_MAX_AGE } from "@lib/age-gate"

export const runtime = "nodejs"

/**
 * Records an age/qualification confirmation. Posted from the plain <form> on
 * /age-verification (the no-JS fallback), so we redirect rather than return JSON.
 *
 * The cookie is deliberately NOT httpOnly: the primary gate is the client overlay
 * which reads this same cookie via document.cookie. An httpOnly cookie here would
 * be invisible to (and un-overwritable by) that overlay, making the gate re-show
 * on every refresh. Keeping it readable keeps both entry paths consistent.
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
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: AGE_COOKIE_MAX_AGE,
  })
  return res
}
