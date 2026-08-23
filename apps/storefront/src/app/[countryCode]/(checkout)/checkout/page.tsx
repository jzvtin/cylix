import { retrieveCart, retrieveCartFresh, setShippingMethod } from "@lib/data/cart"
import { listCartShippingMethods } from "@lib/data/fulfillment"
import CylixCheckout from "@modules/checkout/templates/cylix-checkout"
import { Metadata } from "next"
import { notFound } from "next/navigation"

export const metadata: Metadata = {
  title: "Checkout",
}

// Free U.S. shipping at $100+ (item subtotal in minor units); a flat paid
// option below it.
const FREE_SHIP_THRESHOLD = 10000

export default async function Checkout() {
  let cart = await retrieveCart()

  if (!cart) {
    return notFound()
  }

  const shippingOptions = await listCartShippingMethods(cart.id)

  // Select the correct shipping method SERVER-SIDE so the very first render has
  // accurate totals (free at $100+, else the flat paid option). Doing this here
  // — rather than only on the client — avoids a visible "FREE → $15" flip and
  // any risk of the displayed total drifting from what is charged.
  const opts = shippingOptions ?? []
  const free = opts.find((o) => (o.amount ?? 0) === 0)
  const paid = opts.find((o) => (o.amount ?? 0) > 0)
  const qualifiesForFree = (cart.item_subtotal ?? 0) >= FREE_SHIP_THRESHOLD
  const chosen = qualifiesForFree ? free ?? paid : paid ?? free
  const current = cart.shipping_methods?.[0]?.shipping_option_id

  if (chosen && current !== chosen.id) {
    await setShippingMethod({ cartId: cart.id, shippingMethodId: chosen.id })
    const fresh = await retrieveCartFresh(cart.id)
    if (fresh) {
      cart = fresh
    }
  }

  return <CylixCheckout cart={cart} shippingOptions={shippingOptions} />
}
