import { retrieveCart } from "@lib/data/cart"
import { listCartShippingMethods } from "@lib/data/fulfillment"
import CylixCheckout from "@modules/checkout/templates/cylix-checkout"
import { Metadata } from "next"
import { notFound } from "next/navigation"

export const metadata: Metadata = {
  title: "Checkout",
}

export default async function Checkout() {
  const cart = await retrieveCart()

  if (!cart) {
    return notFound()
  }

  const shippingOptions = await listCartShippingMethods(cart.id)

  return <CylixCheckout cart={cart} shippingOptions={shippingOptions} />
}
