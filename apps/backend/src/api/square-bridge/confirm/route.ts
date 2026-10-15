import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import {
  capturePaymentWorkflow,
  completeCartWorkflow,
} from "@medusajs/core-flows"

// ── Dynaradigital bridge -> Cylix: payment confirmed, complete the order ───────
//
// The bridge POSTs here (server-to-server) once Square reports the payment
// COMPLETED. It lives OUTSIDE /store on purpose: Medusa's /store/* namespace
// demands the x-publishable-api-key header, which a backend callback does not
// send (that is the HTTP 400 seen in the bridge log during testing). We guard
// with the shared bridge secret instead.
//
// `order_id` from the bridge is the Medusa CART id (we handed it as Square's
// reference_id). Completing the cart is idempotent — if the buyer already
// returned and finalized it, completeCartWorkflow returns the existing order.
//
// Env: BRIDGE_SECRET default cylix-bridge-2026

const BRIDGE_SECRET = process.env.BRIDGE_SECRET || "cylix-bridge-2026"

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const body = (req.body as any) || {}
  const secret = body.secret as string | undefined
  const cartId = body.order_id as string | undefined

  if (secret !== BRIDGE_SECRET) {
    return res.status(401).json({ success: false, error: "Unauthorized" })
  }
  if (!cartId) {
    return res.status(400).json({ success: false, error: "order_id required" })
  }
  if (body.status && body.status !== "paid") {
    // Bridge only calls back on paid, but be defensive.
    return res.json({ success: true, skipped: `status=${body.status}` })
  }

  try {
    const { result } = await completeCartWorkflow(req.scope).run({
      input: { id: cartId },
    })
    const orderId = (result as any)?.id ?? null

    // Square already took the money, so mark the Medusa payment captured.
    // Without this the order sits at "Authorized" / paid_total 0 forever and
    // the admin shows it as awaiting capture (seen on order #1, 2026-10-11).
    let captured = false
    if (orderId) {
      try {
        const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
        const { data } = await query.graph({
          entity: "order",
          fields: ["payment_collections.payments.id", "payment_collections.payments.captured_at"],
          filters: { id: orderId },
        })
        const payments =
          (data?.[0] as any)?.payment_collections?.flatMap(
            (pc: any) => pc?.payments ?? []
          ) ?? []
        for (const p of payments) {
          if (p?.id && !p.captured_at) {
            await capturePaymentWorkflow(req.scope).run({
              input: { payment_id: p.id },
            })
            captured = true
          }
        }
      } catch (captureErr: any) {
        // Order exists either way; log and let the owner capture from admin.
        console.error("[square-bridge/confirm] capture failed", captureErr?.message)
      }
    }
    return res.json({ success: true, order_id: orderId, captured })
  } catch (e: any) {
    // Already completed carts throw — treat as success so the bridge stops retrying.
    const msg = String(e?.message || e)
    if (/already completed|completed cart|not found/i.test(msg)) {
      return res.json({ success: true, note: msg })
    }
    return res.status(500).json({ success: false, error: msg })
  }
}
