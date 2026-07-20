import { NextRequest, NextResponse } from "next/server"

import { isAdminAuthenticated } from "@lib/admin-auth"
import { markOrderShipped } from "@lib/data/admin"

export const runtime = "nodejs"

export async function POST(
  _req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 })
  }

  const { id } = await ctx.params

  try {
    await markOrderShipped(id)
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("[admin] mark shipped failed", err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "failed" },
      { status: 500 }
    )
  }
}
