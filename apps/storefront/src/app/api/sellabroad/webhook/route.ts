import crypto from "crypto"
import { NextRequest, NextResponse } from "next/server"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const WEBHOOK_SECRET = process.env.SELLABROAD_WEBHOOK_SECRET
const MEDUSA_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL
const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY

const HANDLED_EVENT = "payment.container.succeeded"

/**
 * SellAbroad signs webhooks with the shared secret from the dashboard. The
 * exact header name is not documented, so we accept the common variants.
 */
const SIGNATURE_HEADERS = [
  "x-sellabroad-signature",
  "sellabroad-signature",
  "x-signature",
  "x-webhook-signature",
]

function verifySignature(rawBody: string, req: NextRequest): boolean {
  if (!WEBHOOK_SECRET) return false

  const provided = SIGNATURE_HEADERS.map((h) => req.headers.get(h)).find(Boolean)
  if (!provided) return false

  // Strip a `sha256=` style prefix if present.
  const signature = provided.includes("=")
    ? provided.split("=").pop()!.trim()
    : provided.trim()

  const expected = crypto
    .createHmac("sha256", WEBHOOK_SECRET)
    .update(rawBody, "utf8")
    .digest("hex")

  const a = new Uint8Array(Buffer.from(signature.toLowerCase(), "utf8"))
  const b = new Uint8Array(Buffer.from(expected, "utf8"))

  return a.length === b.length && crypto.timingSafeEqual(a, b)
}

/**
 * Amounts the container reports are rendered client-side, so the figure the
 * customer was charged can be tampered with in the browser. Before an order is
 * created we re-read the cart from Medusa and confirm the settled amount
 * matches what the cart is actually worth.
 *
 * The event's amount field name is not documented; we accept the usual aliases
 * and fail closed when none is present, because completing a cart without a
 * verified amount is exactly the hole this guards.
 */
const AMOUNT_TOLERANCE_CENTS = 1

function extractPaidAmount(data: Record<string, unknown>): number | null {
  const candidates = [
    data.total_cents,
    data.amount_cents,
    data.amount,
    data.total,
    (data.payment as Record<string, unknown> | undefined)?.amount_cents,
    (data.payment as Record<string, unknown> | undefined)?.amount,
  ]

  for (const value of candidates) {
    if (typeof value === "number" && Number.isFinite(value)) return value
    if (typeof value === "string" && value.trim() !== "") {
      const parsed = Number(value)
      if (Number.isFinite(parsed)) return parsed
    }
  }

  return null
}

async function fetchCartTotal(cartId: string): Promise<number | null> {
  const res = await fetch(`${MEDUSA_URL}/store/carts/${cartId}`, {
    headers: { "x-publishable-api-key": PUBLISHABLE_KEY! },
    cache: "no-store",
  })

  if (!res.ok) return null

  const body = await res.json().catch(() => ({}))
  const total = body?.cart?.total

  return typeof total === "number" && Number.isFinite(total)
    ? Math.round(total)
    : null
}

/**
 * SellAbroad settles the money outside Medusa, so it is not registered as a
 * Medusa payment provider. Medusa still refuses to complete a cart that has no
 * payment collection with an initialised session — it returns a bare 400 — so
 * we record the payment against the manual/system provider before completing.
 *
 * Without this the webhook can never create an order, however valid the event.
 */
const PAYMENT_PROVIDER =
  process.env.MEDUSA_MANUAL_PAYMENT_PROVIDER_ID || "pp_system_default"

async function ensurePaymentSession(cartId: string) {
  const cartRes = await fetch(`${MEDUSA_URL}/store/carts/${cartId}`, {
    headers: { "x-publishable-api-key": PUBLISHABLE_KEY! },
    cache: "no-store",
  })

  if (!cartRes.ok) {
    throw new Error(`Could not read cart ${cartId} (${cartRes.status})`)
  }

  const { cart } = await cartRes.json()

  // Already has an initialised session — nothing to do. This also makes repeat
  // deliveries of the same event safe.
  if (cart?.payment_collection?.payment_sessions?.length) return

  let collectionId = cart?.payment_collection?.id

  if (!collectionId) {
    const created = await fetch(`${MEDUSA_URL}/store/payment-collections`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-publishable-api-key": PUBLISHABLE_KEY!,
      },
      body: JSON.stringify({ cart_id: cartId }),
      cache: "no-store",
    })

    const body = await created.json().catch(() => ({}))
    collectionId = body?.payment_collection?.id

    if (!collectionId) {
      throw new Error(
        `Could not create payment collection (${created.status}): ${JSON.stringify(body).slice(0, 200)}`
      )
    }
  }

  const session = await fetch(
    `${MEDUSA_URL}/store/payment-collections/${collectionId}/payment-sessions`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-publishable-api-key": PUBLISHABLE_KEY!,
      },
      body: JSON.stringify({ provider_id: PAYMENT_PROVIDER }),
      cache: "no-store",
    }
  )

  if (!session.ok) {
    const body = await session.text().catch(() => "")
    throw new Error(
      `Could not create payment session with ${PAYMENT_PROVIDER} (${session.status}): ${body.slice(0, 200)}`
    )
  }
}

/**
 * Per SellAbroad's docs the order is created here, in the webhook — not on the
 * thank-you page. Completing the Medusa cart is what creates the order.
 */
async function completeCart(cartId: string) {
  await ensurePaymentSession(cartId)

  const res = await fetch(`${MEDUSA_URL}/store/carts/${cartId}/complete`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-publishable-api-key": PUBLISHABLE_KEY!,
    },
    body: JSON.stringify({}),
    cache: "no-store",
  })

  const body = await res.json().catch(() => ({}))

  if (body?.type === "order" && body.order?.id) {
    return { orderId: body.order.id as string, alreadyExisted: false }
  }

  /**
   * SellAbroad retries on non-2xx, so a cart that was already completed by an
   * earlier delivery must not look like a failure.
   */
  const message = String(body?.error?.message ?? body?.message ?? "")
  if (/already completed|completed cart|not found/i.test(message)) {
    return { orderId: null, alreadyExisted: true }
  }

  throw new Error(
    `Cart completion failed (${res.status}): ${JSON.stringify(body).slice(0, 400)}`
  )
}

export async function POST(req: NextRequest) {
  if (!WEBHOOK_SECRET || !MEDUSA_URL || !PUBLISHABLE_KEY) {
    console.error(
      "[sellabroad] webhook not configured: SELLABROAD_WEBHOOK_SECRET, NEXT_PUBLIC_MEDUSA_BACKEND_URL and NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY are all required"
    )
    return NextResponse.json({ error: "not_configured" }, { status: 503 })
  }

  const rawBody = await req.text()

  if (!verifySignature(rawBody, req)) {
    return NextResponse.json({ error: "invalid_signature" }, { status: 401 })
  }

  let event: { type?: string; data?: Record<string, unknown> }
  try {
    event = JSON.parse(rawBody)
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 })
  }

  if (event.type !== HANDLED_EVENT) {
    // Acknowledge so SellAbroad stops retrying events we don't act on.
    return NextResponse.json({ ignored: event.type ?? null }, { status: 200 })
  }

  // The container sends `external_cart_id`; accept the usual aliases too.
  const data = (event.data ?? {}) as Record<string, unknown>
  const cartId = (data.external_cart_id ??
    data.externalCartId ??
    data.cart_id ??
    data.reference) as string | undefined

  if (!cartId) {
    console.error("[sellabroad] event missing external_cart_id", data)
    return NextResponse.json({ error: "missing_cart_id" }, { status: 400 })
  }

  // --- Payment integrity gate -------------------------------------------
  // Never create an order until the settled amount is confirmed against the
  // cart's own total, server-side.
  const paid = extractPaidAmount(data)
  if (paid === null) {
    console.error(
      "[sellabroad] event carried no recognisable amount; refusing to complete cart",
      cartId,
      Object.keys(data)
    )
    // 200 so the provider stops retrying — this event will never be actionable
    // in its current shape and needs the field name mapped explicitly.
    return NextResponse.json({ error: "amount_missing" }, { status: 200 })
  }

  let expectedTotal: number | null
  try {
    expectedTotal = await fetchCartTotal(cartId)
  } catch (err) {
    console.error("[sellabroad] could not read cart for amount check", cartId, err)
    return NextResponse.json({ error: "cart_unreadable" }, { status: 500 })
  }

  if (expectedTotal === null) {
    console.error("[sellabroad] cart not found for amount check", cartId)
    return NextResponse.json({ error: "cart_not_found" }, { status: 200 })
  }

  if (Math.abs(paid - expectedTotal) > AMOUNT_TOLERANCE_CENTS) {
    console.error(
      "[sellabroad] amount mismatch — refusing to create order",
      { cartId, paid, expectedTotal }
    )
    // Acknowledge so this is not retried, but no order is created. This needs a
    // human to look at it: it means the charged amount did not match the cart.
    return NextResponse.json({ error: "amount_mismatch" }, { status: 200 })
  }

  try {
    const result = await completeCart(cartId)
    console.log("[sellabroad] order created from cart", cartId, result)
    return NextResponse.json({ ok: true, ...result }, { status: 200 })
  } catch (err) {
    console.error("[sellabroad] failed to create order", err)
    // 500 so SellAbroad retries rather than dropping a paid order.
    return NextResponse.json({ error: "order_creation_failed" }, { status: 500 })
  }
}
