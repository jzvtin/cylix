import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

// ── Cylix -> Dynaradigital payment bridge: request a Square checkout link ──────
//
// The storefront calls this (with its publishable key, so it lives under /store)
// after it has initiated a `pp_system_default` payment session on the cart. We
// read the cart total, round it to a WHOLE DOLLAR (business rule: charges are
// flat, 141.89 -> 142), and ask the bridge for a hosted Square payment link on
// Cylix's own Square merchant. The Square `reference_id` we hand the bridge is
// the Medusa cart id, which is how the order is later matched + completed.
//
// Env:
//   BRIDGE_URL    default https://dynaradigital.com/payment-bridge.php
//   BRIDGE_SECRET default cylix-bridge-2026  (per-storefront secret in bridge-config.php)

const BRIDGE_URL = process.env.BRIDGE_URL || "https://dynaradigital.com/payment-bridge.php"
const BRIDGE_SECRET = process.env.BRIDGE_SECRET || "cylix-bridge-2026"

/**
 * This store seeds prices in MINOR units (a $55.00 item is stored as 5500),
 * matching the storefront's convertToLocale (/100) and SellAbroad container.
 * So dollars = total / 100. Then round to a flat whole dollar for the charge.
 */
const toWholeDollars = (total: number | undefined | null) =>
  Math.round((total ?? 0) / 100)

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const cartId = (req.body as any)?.cart_id as string | undefined
  if (!cartId) {
    return res.status(400).json({ success: false, error: "cart_id required" })
  }

  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  const { data: [cart] = [] } = await query.graph({
    entity: "cart",
    filters: { id: cartId },
    fields: [
      "id",
      "email",
      "total",
      "shipping_address.address_1",
      "shipping_address.city",
      "shipping_address.province",
      "shipping_address.postal_code",
    ],
  })

  if (!cart) {
    return res.status(404).json({ success: false, error: "Cart not found" })
  }

  const amount = toWholeDollars(cart.total as number)
  if (amount <= 0) {
    return res.status(400).json({ success: false, error: "Cart total is zero" })
  }

  const addr = (cart as any).shipping_address || {}
  const payload = {
    action: "request_checkout",
    secret: BRIDGE_SECRET,
    storefront: "cylix",
    order_id: cart.id,
    amount,
    email: cart.email || "",
    address: {
      address: addr.address_1 || "",
      city: addr.city || "",
      state: addr.province || "",
      zip: addr.postal_code || "",
    },
  }

  try {
    const bridgeRes = await fetch(`${BRIDGE_URL}?action=request_checkout`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
    const data = (await bridgeRes.json()) as any
    if (!data?.success || !data?.checkout_url) {
      return res
        .status(502)
        .json({ success: false, error: data?.error || "Bridge declined" })
    }
    return res.json({ success: true, checkout_url: data.checkout_url, amount })
  } catch (e: any) {
    return res
      .status(502)
      .json({ success: false, error: `Bridge unreachable: ${e.message}` })
  }
}
