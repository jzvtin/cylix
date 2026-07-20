"use client"

import { HttpTypes } from "@medusajs/types"
import { useEffect, useState } from "react"

const MERCHANT_ID = process.env.NEXT_PUBLIC_SELLABROAD_MERCHANT_ID
const SCRIPT_URL =
  process.env.NEXT_PUBLIC_SELLABROAD_SCRIPT_URL ||
  "https://app.sellabroad.com/api/widget?variant=container"

/**
 * This store seeds prices already in minor units — a $55.00 product is stored
 * as 5500, which is why `convertToLocale` divides by 100 when displaying.
 * SellAbroad also wants minor units, so amounts pass through unchanged.
 *
 * If prices are ever re-seeded as true decimals (55.00), this must become
 * `Math.round(amount * 100)` and `convertToLocale` must drop its /100.
 */
const cents = (amount: number | undefined | null) =>
  amount ? Math.round(amount) : 0

export const buildSellAbroadAmounts = (cart: HttpTypes.StoreCart) => {
  const subtotal = cents(cart.subtotal)
  const discount = cents(cart.discount_total)
  const shipping = cents(cart.shipping_total)
  let tax = cents(cart.tax_total)
  const total = cents(cart.total)

  /**
   * SellAbroad rejects the container unless
   * `subtotal - discount + shipping + tax === total` (±1¢). Medusa's own
   * figures should already satisfy this; if rounding puts them out by a cent
   * or two we absorb the difference into tax so the charged `total` always
   * stays equal to what the customer was shown.
   */
  const derived = subtotal - discount + shipping + tax
  if (derived !== total) {
    tax += total - derived
  }

  return { subtotal, discount, shipping, tax, total }
}

const SellAbroadContainer = ({ cart }: { cart: HttpTypes.StoreCart }) => {
  const [scriptFailed, setScriptFailed] = useState(false)
  const amounts = buildSellAbroadAmounts(cart)

  const apiPayload = JSON.stringify({
    external_cart_id: cart.id,
    items: (cart.items ?? []).map((item) => ({
      id: item.id,
      variant_id: item.variant_id,
      name: item.product_title || item.title,
      quantity: item.quantity,
      unit_price_cents: cents(item.unit_price),
      total_cents: cents(item.total),
    })),
  })

  useEffect(() => {
    if (!MERCHANT_ID) return

    // The widget scans the DOM for [data-sellabroad-payment-container], so the
    // container must already be rendered — hence loading here, not in <head>.
    if (document.querySelector(`script[src="${SCRIPT_URL}"]`)) return

    const script = document.createElement("script")
    script.src = SCRIPT_URL
    script.async = true
    script.addEventListener("error", () => setScriptFailed(true))
    document.body.appendChild(script)
  }, [])

  if (!MERCHANT_ID || scriptFailed) {
    return (
      <div
        className="rounded-lg p-4 text-sm"
        style={{
          background: "#FDF6E9",
          border: "1px solid #E8D5AE",
          color: "#7A5B1E",
        }}
        data-testid="sellabroad-unconfigured"
      >
        <p style={{ fontWeight: 700, marginBottom: 4 }}>
          Card payment is unavailable right now
        </p>
        <p style={{ lineHeight: 1.6 }}>
          {scriptFailed
            ? "The payment provider could not be reached. Please refresh, or try again shortly."
            : "Set NEXT_PUBLIC_SELLABROAD_MERCHANT_ID in the environment to enable this payment method."}
        </p>
      </div>
    )
  }

  return (
    <div
      data-sellabroad-payment-container
      data-platform="api"
      data-merchant-id={MERCHANT_ID}
      data-currency={(cart.currency_code || "usd").toUpperCase()}
      data-subtotal-cents={amounts.subtotal}
      data-discount-cents={amounts.discount}
      data-shipping-cents={amounts.shipping}
      data-tax-cents={amounts.tax}
      data-total-cents={amounts.total}
      data-from-api-payload={apiPayload}
      data-testid="sellabroad-container"
      className="min-h-[220px] w-full"
    />
  )
}

export default SellAbroadContainer
