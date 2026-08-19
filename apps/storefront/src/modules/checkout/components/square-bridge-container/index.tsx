"use client"

import { getSquareCheckoutUrl } from "@lib/data/square-bridge"
import { Button } from "@modules/common/components/ui"
import { HttpTypes } from "@medusajs/types"
import { useState } from "react"

/**
 * Square-via-bridge payment. Like the SellAbroad container, the money is taken
 * off-site (Square hosted checkout) and the Medusa order is completed by our
 * webhook (bridge -> /square-bridge/confirm). So there is no "place order"
 * button that could mint an unpaid order — the buyer is redirected to Square,
 * and only a completed payment confirms the order.
 *
 * A pp_system_default session must already be initiated on the cart (the
 * payment step does this when the Square tab is selected), so the cart can be
 * completed once payment lands.
 */
const SquareBridgeContainer = ({ cart }: { cart: HttpTypes.StoreCart }) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleClick = async () => {
    setLoading(true)
    setError(null)
    const res = await getSquareCheckoutUrl(cart.id)
    if (!res.success) {
      setError(res.error)
      setLoading(false)
      return
    }
    // Leave to Square's hosted checkout. On success Square redirects the buyer
    // to the bridge success_url (square-return), and independently fires the
    // webhook that completes the order.
    window.location.href = res.checkout_url
  }

  return (
    <div className="flex flex-col gap-y-4">
      <Button
        size="large"
        onClick={handleClick}
        isLoading={loading}
        data-testid="square-bridge-button"
      >
        Pay with card
      </Button>
      <p className="text-xs" style={{ color: "#8A8A8A" }}>
        You&apos;ll complete payment securely on Square. Your order is confirmed
        as soon as payment completes.
      </p>
      {error && (
        <p className="text-sm" style={{ color: "#B42318" }}>
          {error}
        </p>
      )}
    </div>
  )
}

export default SquareBridgeContainer
