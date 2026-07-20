import { Heading } from "@modules/common/components/ui"
import { cookies as nextCookies } from "next/headers"

import CartTotals from "@modules/common/components/cart-totals"
import Help from "@modules/order/components/help"
import Items from "@modules/order/components/items"
import OrderDetails from "@modules/order/components/order-details"
import ShippingDetails from "@modules/order/components/shipping-details"
import PaymentDetails from "@modules/order/components/payment-details"
import { HttpTypes } from "@medusajs/types"

type OrderCompletedTemplateProps = {
  order: HttpTypes.StoreOrder
}

export default async function OrderCompletedTemplate({
  order,
}: OrderCompletedTemplateProps) {
  return (
    <div className="py-6 min-h-[calc(100vh-64px)]">
      <div className="content-container flex flex-col justify-center items-center gap-y-10 max-w-4xl h-full w-full">
        <div
          className="flex flex-col gap-4 max-w-4xl h-full bg-white w-full py-10"
          data-testid="order-complete-container"
        >
          <Heading
            level="h1"
            className="flex flex-col gap-y-3 text-ui-fg-base text-3xl mb-4"
            style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800 }}
          >
            <span>Thank you!</span>
            <span>Your order was placed successfully.</span>
          </Heading>
          <OrderDetails order={order} />

          <div
            className="rounded-xl p-6 my-2"
            style={{ background: "#F9F7F4", border: "1px solid #E8E4DE" }}
            data-testid="what-happens-next"
          >
            <p
              className="text-xs uppercase mb-3"
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontWeight: 800,
                letterSpacing: "1.2px",
                color: "#C9963A",
              }}
            >
              What happens next
            </p>
            <p className="text-sm mb-4" style={{ color: "#555" }}>
              Your order number is{" "}
              <span style={{ fontWeight: 700, color: "#111" }}>
                #{order.display_id}
              </span>
              . Keep it handy — quote it in any email about this order.
            </p>
            <ol
              className="text-sm flex flex-col gap-y-2"
              style={{ color: "#555", lineHeight: 1.6 }}
            >
              <li>
                <strong style={{ color: "#111" }}>1. Confirmation.</strong> A
                receipt is on its way to {order.email}.
              </li>
              <li>
                <strong style={{ color: "#111" }}>2. Processing.</strong> Orders
                are dispatched within 12–24 hours.
              </li>
              <li>
                <strong style={{ color: "#111" }}>3. Shipping.</strong> You will
                get a tracking link by email as soon as it ships.
              </li>
            </ol>
            <p className="text-sm mt-4" style={{ color: "#555" }}>
              Questions? Email{" "}
              <a
                href="mailto:support@cylixresearch.com"
                style={{ color: "#C9963A", fontWeight: 700 }}
              >
                support@cylixresearch.com
              </a>
              .
            </p>
          </div>

          <Heading level="h2" className="flex flex-row text-3xl-regular">
            Summary
          </Heading>
          <Items order={order} />
          <CartTotals totals={order} />
          <ShippingDetails order={order} />
          <PaymentDetails order={order} />
          <Help />
        </div>
      </div>
    </div>
  )
}
