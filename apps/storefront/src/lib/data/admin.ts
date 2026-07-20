import "server-only"

const MEDUSA_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL
const ADMIN_API_KEY = process.env.MEDUSA_ADMIN_API_KEY

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

async function adminFetch(path: string, init?: RequestInit) {
  if (!isAdminApiConfigured()) {
    throw new AdminNotConfiguredError()
  }

  const res = await fetch(`${MEDUSA_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      "x-medusa-access-token": ADMIN_API_KEY!,
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  })

  if (!res.ok) {
    throw new Error(`Medusa admin ${path} failed (${res.status})`)
  }

  return res.json()
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
