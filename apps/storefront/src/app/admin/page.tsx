import { redirect } from "next/navigation"

import { isAdminAuthenticated } from "@lib/admin-auth"
import {
  AdminOrder,
  isAdminApiConfigured,
  listOrders,
  summarize,
} from "@lib/data/admin"
import OrdersTable from "./orders-table"

export const dynamic = "force-dynamic"

// Amounts are stored in minor units (5500 = $55.00), matching `convertToLocale`.
const money = (amount: number, currency: string) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format((amount ?? 0) / 100)

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div
      className="bg-white rounded-xl p-5 flex-1 min-w-[150px]"
      style={{ border: "1px solid #E8E4DE" }}
    >
      <p
        className="text-xs uppercase mb-2"
        style={{ fontWeight: 700, letterSpacing: "1px", color: "#8A8A8A" }}
      >
        {label}
      </p>
      <p
        className="text-3xl"
        style={{ fontWeight: 800, color: "#111", letterSpacing: "-1px" }}
      >
        {value}
      </p>
    </div>
  )
}

export default async function AdminDashboard() {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login")
  }

  let orders: AdminOrder[] = []
  let loadError: string | null = null

  if (!isAdminApiConfigured()) {
    loadError =
      "Not connected to the store backend yet. Your developer needs to set MEDUSA_ADMIN_API_KEY and NEXT_PUBLIC_MEDUSA_BACKEND_URL."
  } else {
    try {
      orders = await listOrders()
    } catch (err) {
      console.error("[admin] failed to load orders", err)
      loadError =
        "Could not reach the store backend. It may be starting up — refresh in a minute."
    }
  }

  const stats = summarize(orders)

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <header className="flex items-center justify-between mb-8 gap-4">
        <div>
          <p
            className="text-xs uppercase mb-1"
            style={{
              fontWeight: 800,
              letterSpacing: "1.2px",
              color: "#C9963A",
            }}
          >
            Cylix Research
          </p>
          <h1
            className="text-2xl sm:text-3xl"
            style={{ fontWeight: 800, color: "#111", letterSpacing: "-0.8px" }}
          >
            Store admin
          </h1>
        </div>
        <form action="/api/admin/logout" method="post">
          <button
            className="text-sm px-4 py-2 rounded-lg bg-white"
            style={{ border: "1px solid #E8E4DE", color: "#555", fontWeight: 600 }}
          >
            Log out
          </button>
        </form>
      </header>

      {loadError && (
        <div
          className="rounded-xl p-4 mb-6 text-sm"
          style={{
            background: "#FDF6E9",
            border: "1px solid #E8D5AE",
            color: "#7A5B1E",
          }}
        >
          {loadError}
        </div>
      )}

      <div className="flex flex-wrap gap-3 mb-8">
        <Stat label="Revenue" value={money(stats.revenue, stats.currency)} />
        <Stat label="Orders" value={String(stats.orderCount)} />
        <Stat label="Not shipped" value={String(stats.unshippedCount)} />
      </div>

      <h2
        className="text-lg mb-3"
        style={{ fontWeight: 800, color: "#111", letterSpacing: "-0.3px" }}
      >
        Orders
      </h2>
      <OrdersTable orders={orders} />
    </div>
  )
}
