import { placeOrder } from "@lib/data/cart"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

/**
 * Landing page Square redirects the buyer to after a hosted-checkout payment
 * (the bridge success_url points here with ?cart=<cartId>).
 *
 * The order is normally completed server-side by the bridge webhook. This page
 * is the buyer-facing confirmation hop: completing the cart is idempotent, so
 * calling placeOrder here finalizes the order (if the webhook has not landed
 * yet) and redirects to /{cc}/order/{orderId}/confirmed.
 *
 * If the cart has ALREADY been completed by the webhook, `complete` throws
 * instead of returning an order — in that case we must NOT dump a paying buyer
 * on the homepage. We show a reassuring "payment received" screen (their
 * confirmation email is already on its way) with clear next steps.
 */
export default async function SquareReturn({
  searchParams,
}: {
  params: Promise<{ countryCode: string }>
  searchParams: Promise<{ cart?: string }>
}) {
  const { cart } = await searchParams

  if (cart) {
    try {
      // On success this throws a redirect to the order confirmed page.
      await placeOrder(cart)
    } catch (e: any) {
      // NEXT_REDIRECT must propagate; everything else (e.g. the cart was
      // already completed by the webhook) falls through to the screen below.
      if (e?.digest?.startsWith?.("NEXT_REDIRECT")) throw e
    }
  }

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-[560px] flex-col items-center justify-center px-[clamp(16px,4vw,32px)] py-[clamp(48px,10vw,96px)] text-center">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-gold-500/30 bg-gold-50 text-[26px]">
        ✓
      </div>
      <h1 className="cx-h text-[clamp(26px,4.5vw,38px)]">
        Payment <em>received.</em>
      </h1>
      <p className="mt-3 max-w-[42ch] text-[14px] leading-relaxed text-ink/60">
        Thank you — your payment went through and your order is being confirmed.
        A confirmation email with your order details is on its way. It can take a
        moment to finalize; you don&apos;t need to pay again.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <LocalizedClientLink
          href="/account/orders"
          className="inline-flex h-[50px] items-center justify-center rounded-full bg-ink px-7 font-display text-[14px] font-bold text-sand transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#1a1a1a] motion-reduce:hover:translate-y-0"
        >
          View my orders
        </LocalizedClientLink>
        <LocalizedClientLink
          href="/support"
          className="inline-flex h-[50px] items-center justify-center rounded-full border border-ink/15 bg-white px-7 font-display text-[14px] font-bold text-ink transition-colors hover:border-gold-500 hover:text-gold-700"
        >
          Contact support
        </LocalizedClientLink>
      </div>
    </div>
  )
}
