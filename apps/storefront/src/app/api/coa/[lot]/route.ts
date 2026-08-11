import { NextResponse } from "next/server"
import coaData from "../../../../data/coas.json"

type CoaEntry = { lot: string | number; url: string }

/**
 * Nameless CoA report redirect.
 *
 * The public storefront must never expose a compliance-sensitive compound
 * name — not even inside a link href. The third-party (Janoshik) verify URLs
 * contain the full compound name in their slug, so instead of linking them
 * directly we link `/api/coa/<lot>` and 302 to the real report server-side.
 * `/api` is disallowed in robots.txt, so crawlers never follow or read it.
 */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ lot: string }> }
) {
  const { lot } = await params
  const coa = (coaData.coas as CoaEntry[]).find(
    (c) => String(c.lot) === String(lot)
  )
  if (!coa?.url) {
    return new NextResponse("Not found", { status: 404 })
  }
  return NextResponse.redirect(coa.url, 302)
}
