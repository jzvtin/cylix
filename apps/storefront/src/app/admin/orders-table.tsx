"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

import type { AdminOrder } from "@lib/data/admin"

// Amounts are stored in minor units (5500 = $55.00), matching `convertToLocale`.
const money = (amount: number, currency: string) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: (currency || "usd").toUpperCase(),
  }).format((amount ?? 0) / 100)

const isShipped = (o: AdminOrder) =>
  ["fulfilled", "shipped", "delivered"].includes(o.fulfillment_status ?? "")

export default function OrdersTable({ orders }: { orders: AdminOrder[] }) {
  const router = useRouter()
  const [busyId, setBusyId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function markShipped(id: string) {
    setBusyId(id)
    setError(null)

    const res = await fetch(`/api/admin/orders/${id}/ship`, { method: "POST" })

    setBusyId(null)

    if (!res.ok) {
      setError("Could not mark that order shipped. Try again in a moment.")
      return
    }

    router.refresh()
  }

  if (!orders.length) {
    return (
      <div
        className="bg-white rounded-xl p-8 text-center text-sm"
        style={{ border: "1px solid #E8E4DE", color: "#8A8A8A" }}
      >
        No orders yet. New orders will show up here automatically.
      </div>
    )
  }

  return (
    <>
      {error && (
        <p className="text-sm mb-3" style={{ color: "#B4342B" }} role="alert">
          {error}
        </p>
      )}

      {/* Cards on phones, table on desktop — the client checks orders on mobile. */}
      <div className="flex flex-col gap-3 sm:hidden">
        {orders.map((o) => (
          <div
            key={o.id}
            className="bg-white rounded-xl p-4"
            style={{ border: "1px solid #E8E4DE" }}
          >
            <div className="flex justify-between items-start mb-2">
              <span style={{ fontWeight: 800, color: "#111" }}>
                #{o.display_id}
              </span>
              <span style={{ fontWeight: 700, color: "#111" }}>
                {money(o.total, o.currency_code)}
              </span>
            </div>
            <p className="text-sm mb-1" style={{ color: "#555" }}>
              {o.email ?? "—"}
            </p>
            <p className="text-xs mb-3" style={{ color: "#8A8A8A" }}>
              {(o.items ?? [])
                .map((i) => `${i.quantity}× ${i.title}`)
                .join(", ") || "—"}
            </p>
            {isShipped(o) ? (
              <span className="text-xs" style={{ color: "#3F7D58", fontWeight: 700 }}>
                Shipped
              </span>
            ) : (
              <button
                onClick={() => markShipped(o.id)}
                disabled={busyId === o.id}
                className="w-full rounded-lg py-2 text-sm disabled:opacity-50"
                style={{ background: "#111", color: "#C9963A", fontWeight: 700 }}
              >
                {busyId === o.id ? "Working…" : "Mark shipped"}
              </button>
            )}
          </div>
        ))}
      </div>

      <div
        className="hidden sm:block bg-white rounded-xl overflow-x-auto"
        style={{ border: "1px solid #E8E4DE" }}
      >
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: "1px solid #E8E4DE" }}>
              {["Order", "Customer", "Items", "Total", "Status", ""].map((h) => (
                <th
                  key={h}
                  className="text-left px-4 py-3 text-xs uppercase"
                  style={{
                    fontWeight: 700,
                    letterSpacing: "0.8px",
                    color: "#8A8A8A",
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} style={{ borderTop: "1px solid #F1EEE9" }}>
                <td className="px-4 py-3" style={{ fontWeight: 700, color: "#111" }}>
                  #{o.display_id}
                </td>
                <td className="px-4 py-3" style={{ color: "#555" }}>
                  {o.email ?? "—"}
                </td>
                <td className="px-4 py-3" style={{ color: "#555" }}>
                  {(o.items ?? [])
                    .map((i) => `${i.quantity}× ${i.title}`)
                    .join(", ") || "—"}
                </td>
                <td className="px-4 py-3" style={{ fontWeight: 700, color: "#111" }}>
                  {money(o.total, o.currency_code)}
                </td>
                <td className="px-4 py-3">
                  {isShipped(o) ? (
                    <span style={{ color: "#3F7D58", fontWeight: 700 }}>
                      Shipped
                    </span>
                  ) : (
                    <span style={{ color: "#B07D2B", fontWeight: 700 }}>
                      Not shipped
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  {!isShipped(o) && (
                    <button
                      onClick={() => markShipped(o.id)}
                      disabled={busyId === o.id}
                      className="rounded-lg px-3 py-2 text-xs disabled:opacity-50 whitespace-nowrap"
                      style={{
                        background: "#111",
                        color: "#C9963A",
                        fontWeight: 700,
                      }}
                    >
                      {busyId === o.id ? "Working…" : "Mark shipped"}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
