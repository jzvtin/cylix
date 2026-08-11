import { NextRequest, NextResponse } from "next/server"

import { PARTNER_COOKIE, computeStats } from "@modules/affiliate/data"

export const runtime = "nodejs"

/**
 * Returns the partner's stats. The code is taken from `?code=` or the
 * `cx_partner` cookie. Always resolves to a valid payload — an unknown code or
 * an unconfigured backend yields a clean zero/"activating" state, never a 500.
 */
export async function GET(req: NextRequest) {
  const queryCode = req.nextUrl.searchParams.get("code")?.trim() ?? ""
  const cookieCode = req.cookies.get(PARTNER_COOKIE)?.value ?? ""
  const code = (queryCode || cookieCode).slice(0, 40)

  try {
    const stats = await computeStats(code)
    return NextResponse.json(stats)
  } catch {
    return NextResponse.json({
      code: code.toUpperCase(),
      tier: "standard",
      tierName: "Standard",
      rate: 10,
      configured: false,
      clicks: 0,
      referredOrders: 0,
      grossSales: 0,
      commissionEarned: 0,
      payoutStatus: "activating",
      currency: "usd",
      orders: [],
      leaderboard: [],
    })
  }
}
