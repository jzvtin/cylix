"use client"

import OrderCard from "../order-card"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Package from "@modules/common/icons/package"
import { HttpTypes } from "@medusajs/types"

const OrderOverview = ({ orders }: { orders: HttpTypes.StoreOrder[] }) => {
  if (orders?.length) {
    return (
      <div className="flex flex-col gap-y-5 w-full">
        {orders.map((o) => (
          <OrderCard key={o.id} order={o} />
        ))}
      </div>
    )
  }

  return (
    <div
      className="w-full cx-glass rounded-[24px] flex flex-col items-center text-center gap-y-4 py-16 px-6"
      data-testid="no-orders-container"
    >
      <span className="h-16 w-16 rounded-full bg-ink/5 text-ink/50 flex items-center justify-center">
        <Package size={28} />
      </span>
      <h2 className="cx-h text-2xl">Nothing here yet</h2>
      <p className="text-ink/55 max-w-sm">
        You don&apos;t have any orders yet. Explore the catalog and your orders
        will appear here.
      </p>
      <LocalizedClientLink
        href="/store"
        passHref
        className="cx-btn cx-btn-primary mt-2"
        data-testid="continue-shopping-button"
      >
        Continue shopping
      </LocalizedClientLink>
    </div>
  )
}

export default OrderOverview
