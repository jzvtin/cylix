"use client"

import CartTotals from "@modules/common/components/cart-totals"
import DiscountCode from "@modules/checkout/components/discount-code"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"

type SummaryProps = {
  cart: HttpTypes.StoreCart
}

function getCheckoutStep(cart: HttpTypes.StoreCart) {
  if (!cart?.shipping_address?.address_1 || !cart.email) {
    return "address"
  } else if (cart?.shipping_methods?.length === 0) {
    return "delivery"
  } else {
    return "payment"
  }
}

const Summary = ({ cart }: SummaryProps) => {
  const step = getCheckoutStep(cart)

  return (
    <div className="flex flex-col gap-5">
      <h2 className="cx-h text-[26px]">Summary</h2>

      <DiscountCode cart={cart} />

      <div className="border-t border-ink/[0.08] pt-4">
        <CartTotals totals={cart} />
      </div>

      <LocalizedClientLink
        href={"/checkout?step=" + step}
        data-testid="checkout-button"
        className="mt-1 inline-flex h-[52px] w-full items-center justify-center gap-2 rounded-full bg-ink font-display text-[15px] font-bold text-sand shadow-[0_18px_36px_-16px_rgba(13,13,13,0.6)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#1a1a1a] motion-reduce:hover:translate-y-0"
      >
        Go to checkout
        <span aria-hidden>→</span>
      </LocalizedClientLink>

      <div className="flex items-center justify-center gap-2 text-[11.5px] font-medium text-ink/45">
        <svg aria-hidden viewBox="0 0 24 24" className="h-3.5 w-3.5 text-gold-600" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 3l7 4v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V7l7-4z" />
        </svg>
        Secure checkout · free shipping over $100
      </div>
    </div>
  )
}

export default Summary
