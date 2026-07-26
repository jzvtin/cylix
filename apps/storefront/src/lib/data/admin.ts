import "server-only"

const MEDUSA_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL
const ADMIN_API_KEY = process.env.MEDUSA_ADMIN_API_KEY

// Medusa v2 authenticates admin secret API keys via HTTP Basic auth — the key is
// the username, password empty (`Authorization: Basic base64("sk_xxx:")`). The
// old `x-medusa-access-token` header is Medusa v1 and is ignored by v2, so every
// admin call 401'd and surfaced to the owner as "could not reach the backend".
const adminAuthHeader = () =>
  `Basic ${Buffer.from(`${ADMIN_API_KEY}:`).toString("base64")}`

export type AdminOrder = {
  id: string
  display_id: number
  email: string | null
  created_at: string
  total: number
  currency_code: string
  fulfillment_status?: string | null
  payment_status?: string | null
  items?: Array<{ id: string; title: string; quantity: number }>
}

export class AdminNotConfiguredError extends Error {
  constructor() {
    super(
      "Medusa admin API is not configured. Set NEXT_PUBLIC_MEDUSA_BACKEND_URL and MEDUSA_ADMIN_API_KEY."
    )
  }
}

export const isAdminApiConfigured = () => Boolean(MEDUSA_URL && ADMIN_API_KEY)

// The backend can be momentarily unreachable — a cold container waking, a brief
// Railway edge blip — and the admin dashboard is run by a non-technical owner, so
// a single transient miss must not surface as an error. Retry a few times with a
// short backoff and a per-attempt timeout before giving up.
const ADMIN_FETCH_TIMEOUT_MS = 10_000
const ADMIN_FETCH_RETRIES = 3
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

// 5xx and 429 are transient (backend starting up / rate limited); retry those.
// 4xx (bad key, not found) are permanent — fail fast, retrying won't help.
const isRetryableStatus = (status: number) => status >= 500 || status === 429

async function adminFetch(path: string, init?: RequestInit) {
  if (!isAdminApiConfigured()) {
    throw new AdminNotConfiguredError()
  }

  let lastError: unknown

  for (let attempt = 1; attempt <= ADMIN_FETCH_RETRIES; attempt++) {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), ADMIN_FETCH_TIMEOUT_MS)

    let res: Response
    try {
      res = await fetch(`${MEDUSA_URL}${path}`, {
        ...init,
        headers: {
          "Content-Type": "application/json",
          Authorization: adminAuthHeader(),
          ...(init?.headers ?? {}),
        },
        cache: "no-store",
        signal: controller.signal,
      })
    } catch (err) {
      // Network error or timeout (AbortError) — retryable.
      lastError = err
      if (attempt < ADMIN_FETCH_RETRIES) await sleep(500 * attempt)
      continue
    } finally {
      clearTimeout(timer)
    }

    if (res.ok) {
      return res.json()
    }

    // Permanent errors (bad key, not found) won't fix on retry — fail fast.
    if (!isRetryableStatus(res.status)) {
      throw new Error(`Medusa admin ${path} failed (${res.status})`)
    }

    // Retryable server error (backend starting up / rate limited).
    lastError = new Error(`Medusa admin ${path} failed (${res.status})`)
    if (attempt < ADMIN_FETCH_RETRIES) await sleep(500 * attempt) // 500ms, then 1000ms
  }

  throw lastError instanceof Error
    ? lastError
    : new Error(`Medusa admin ${path} failed`)
}

export async function listOrders(limit = 50): Promise<AdminOrder[]> {
  const data = await adminFetch(
    `/admin/orders?limit=${limit}&order=-created_at&fields=id,display_id,email,created_at,total,currency_code,fulfillment_status,payment_status,*items`
  )
  return data.orders ?? []
}

export type DashboardStats = {
  revenue: number
  currency: string
  orderCount: number
  unshippedCount: number
}

export function summarize(orders: AdminOrder[]): DashboardStats {
  const paid = orders.filter((o) => o.payment_status !== "not_paid")

  return {
    revenue: paid.reduce((sum, o) => sum + (o.total ?? 0), 0),
    currency: orders[0]?.currency_code ?? "usd",
    orderCount: orders.length,
    unshippedCount: orders.filter(
      (o) =>
        o.fulfillment_status !== "fulfilled" &&
        o.fulfillment_status !== "shipped" &&
        o.fulfillment_status !== "delivered"
    ).length,
  }
}

/** Creates a fulfillment for every item on the order, marking it shipped. */
export async function markOrderShipped(orderId: string) {
  const { order } = await adminFetch(`/admin/orders/${orderId}?fields=*items`)

  const items = (order?.items ?? []).map(
    (item: { id: string; quantity: number }) => ({
      id: item.id,
      quantity: item.quantity,
    })
  )

  if (!items.length) {
    throw new Error(`Order ${orderId} has no items to fulfill`)
  }

  return adminFetch(`/admin/orders/${orderId}/fulfillments`, {
    method: "POST",
    body: JSON.stringify({ items }),
  })
}
