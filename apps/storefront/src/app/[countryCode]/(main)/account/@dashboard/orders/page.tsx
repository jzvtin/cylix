import { Metadata } from "next"

import OrderOverview from "@modules/account/components/order-overview"
import { notFound } from "next/navigation"
import { listOrders } from "@lib/data/orders"
import Divider from "@modules/common/components/divider"
import TransferRequestForm from "@modules/account/components/transfer-request-form"

export const metadata: Metadata = {
  title: "Orders",
  description: "Overview of your previous orders.",
}

export default async function Orders() {
  const orders = await listOrders()

  if (!orders) {
    notFound()
  }

  return (
    <div className="w-full" data-testid="orders-page-wrapper">
      <div className="mb-8 flex flex-col">
        <span className="cx-eyebrow mb-4">Order history</span>
        <h1 className="cx-h text-4xl small:text-5xl mt-4">Orders</h1>
        <p className="text-ink/55 mt-3 max-w-xl">
          View your previous orders and their status, and connect an order to
          your account.
        </p>
      </div>
      <div>
        <OrderOverview orders={orders} />
        <Divider className="mb-8 mt-10 cx-hairline" />
        <TransferRequestForm />
      </div>
    </div>
  )
}
