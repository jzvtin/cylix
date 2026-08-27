import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { Modules } from "@medusajs/framework/utils"

/**
 * Branded order-confirmation email.
 *
 * Fires on `order.placed`, which Medusa emits from completeCartWorkflow — the
 * SAME workflow both order-completion paths hit (the bridge webhook AND the
 * buyer's square-return placeOrder). Completion is idempotent, so a given order
 * only emits `order.placed` once => exactly one confirmation email per order,
 * regardless of which path lands first.
 *
 * Transport is a direct transactional send (Resend by default). It is fully
 * guarded: if no provider key is set, or the send fails, we log and return —
 * an email problem must NEVER throw here (that would fault the order event).
 *
 * Env:
 *   RESEND_API_KEY     transactional provider key (required to actually send)
 *   ORDER_FROM_EMAIL   From header (default "Cylix Research <orders@cylixlab.com>")
 *   STORE_URL          storefront base for the "view order" link (default https://cylixlab.com)
 */

const FROM = process.env.ORDER_FROM_EMAIL || "Cylix Research <orders@cylixlab.com>"
const STORE_URL = process.env.STORE_URL || "https://cylixlab.com"
const RESEND_API_KEY = process.env.RESEND_API_KEY

function money(amount: number, currency = "usd") {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(amount)
  } catch {
    return `$${Number(amount || 0).toFixed(2)}`
  }
}

function buildHtml(order: any): string {
  const items = (order.items || [])
    .map((it: any) => {
      const line = money((it.total ?? it.unit_price ?? 0), order.currency_code)
      return `<tr>
        <td style="padding:10px 0;border-bottom:1px solid #ece7dd;color:#2a2723;font-size:15px">
          ${escapeHtml(it.product_title || it.title || "Item")}
          <span style="color:#8a8377"> &times; ${it.quantity}</span>
        </td>
        <td style="padding:10px 0;border-bottom:1px solid #ece7dd;text-align:right;color:#2a2723;font-size:15px">${line}</td>
      </tr>`
    })
    .join("")

  const a = order.shipping_address || {}
  const ship = [
    [a.first_name, a.last_name].filter(Boolean).join(" "),
    a.address_1,
    [a.city, a.province, a.postal_code].filter(Boolean).join(", "),
    a.country_code ? String(a.country_code).toUpperCase() : "",
  ]
    .filter(Boolean)
    .map((l) => escapeHtml(l))
    .join("<br>")

  const total = money(order.total ?? order.summary?.current_order_total ?? 0, order.currency_code)
  const display = order.display_id ? `#${order.display_id}` : order.id

  return `<!doctype html><html><body style="margin:0;background:#f6f2ea;font-family:Georgia,'Times New Roman',serif">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f6f2ea;padding:32px 0">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#fffdf8;border:1px solid #e7e0d3;border-radius:14px;overflow:hidden">
        <tr><td style="padding:34px 40px 8px">
          <div style="font-size:26px;letter-spacing:1px;color:#1f1c18">CYLIX<span style="color:#c8a24a">.</span></div>
          <div style="font-size:11px;letter-spacing:3px;color:#9a917f;text-transform:uppercase;margin-top:4px">Purity, Refined</div>
        </td></tr>
        <tr><td style="padding:12px 40px 0">
          <h1 style="font-size:22px;color:#1f1c18;margin:16px 0 6px;font-weight:normal">Thank you for your order</h1>
          <p style="color:#6f6858;font-size:15px;margin:0 0 4px">Order ${escapeHtml(String(display))} is confirmed. We'll email tracking as soon as it ships.</p>
        </td></tr>
        <tr><td style="padding:20px 40px 0">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${items}
            <tr><td style="padding:14px 0 0;color:#1f1c18;font-size:16px;font-weight:bold">Total</td>
                <td style="padding:14px 0 0;text-align:right;color:#1f1c18;font-size:16px;font-weight:bold">${total}</td></tr>
          </table>
        </td></tr>
        ${ship ? `<tr><td style="padding:22px 40px 0">
          <div style="font-size:11px;letter-spacing:2px;color:#9a917f;text-transform:uppercase;margin-bottom:6px">Shipping to</div>
          <div style="color:#2a2723;font-size:14px;line-height:1.5">${ship}</div>
        </td></tr>` : ""}
        <tr><td style="padding:26px 40px 34px">
          <a href="${STORE_URL}/us/order/${escapeHtml(order.id)}/confirmed" style="display:inline-block;background:#1f1c18;color:#fff;text-decoration:none;padding:12px 22px;border-radius:8px;font-family:Arial,sans-serif;font-size:14px">View your order</a>
          <p style="color:#9a917f;font-size:12px;margin:22px 0 0;font-family:Arial,sans-serif;line-height:1.6">
            For in-vitro laboratory research use only. Not for human or animal consumption.<br>
            Questions? Reply to this email or contact support@cylixlab.com.
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table></body></html>`
}

function escapeHtml(s: any): string {
  return String(s ?? "").replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] as string)
  )
}

export default async function orderPlacedHandler({
  event,
  container,
}: SubscriberArgs<{ id: string }>) {
  const logger = container.resolve("logger")

  if (!RESEND_API_KEY) {
    logger.warn(
      `[order-placed] RESEND_API_KEY not set — skipping confirmation email for order ${event.data.id}`
    )
    return
  }

  try {
    const orderModuleService: any = container.resolve(Modules.ORDER)
    const order = await orderModuleService.retrieveOrder(event.data.id, {
      relations: ["items", "shipping_address", "summary"],
    })

    const to = order?.email
    if (!to) {
      logger.warn(`[order-placed] order ${event.data.id} has no email — skipping`)
      return
    }

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM,
        to,
        subject: `Your Cylix order ${order.display_id ? `#${order.display_id}` : ""} is confirmed`,
        html: buildHtml(order),
      }),
    })

    if (!res.ok) {
      const body = await res.text().catch(() => "")
      logger.error(
        `[order-placed] email send failed (${res.status}) for order ${event.data.id}: ${body.slice(0, 300)}`
      )
      return
    }
    logger.info(`[order-placed] confirmation email sent to ${to} for order ${event.data.id}`)
  } catch (e: any) {
    // Never throw from an event handler — an email failure must not fault the order.
    logger.error(`[order-placed] handler error for order ${event.data.id}: ${String(e?.message || e)}`)
  }
}

export const config: SubscriberConfig = {
  event: "order.placed",
}
