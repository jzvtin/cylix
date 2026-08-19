import { placeOrder } from "@lib/data/cart"
import { redirect } from "next/navigation"

/**
 * Landing page Square redirects the buyer to after a hosted-checkout payment
 * (the bridge success_url points here with ?cart=<cartId>).
 *
 * The order is normally completed server-side by the bridge webhook, but this
 * acts as the buyer-facing fallback + confirmation hop: completing the cart is
 * idempotent, so calling placeOrder here either finalizes the order (if the
 * webhook has not landed yet) or returns the already-created order. placeOrder
 * then redirects to /{cc}/order/{orderId}/confirmed.
 */
export default async function SquareReturn({
  params,
  searchParams,
}: {
  params: Promise<{ countryCode: string }>
  searchParams: Promise<{ cart?: string }>
}) {
  const { countryCode } = await params
  const { cart } = await searchParams

  if (cart) {
    try {
      // On success this throws a redirect to the order confirmed page.
      await placeOrder(cart)
    } catch (e: any) {
      // NEXT_REDIRECT must propagate; only swallow real completion errors.
      if (e?.digest?.startsWith?.("NEXT_REDIRECT")) throw e
    }
  }

  // Fallback if we could not resolve the order (e.g. webhook still in flight).
  redirect(`/${countryCode}`)
}
