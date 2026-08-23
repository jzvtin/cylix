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
    <div className="min-h-[calc(100vh-64px)] px-[clamp(16px,4vw,32px)] py-[clamp(28px,5vw,56px)]">
      <div className="mx-auto w-full max-w-[720px]">
        <div
          className="flex flex-col gap-6"
          data-testid="order-complete-container"
        >
          {/* Confirmation header */}
          <div className="flex flex-col gap-4">
            <span className="inline-flex h-14 w-14 items-center justify-center rounded-full border border-gold-500/30 bg-gold-50 text-gold-700">
              <svg
                aria-hidden
                viewBox="0 0 24 24"
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </span>
            <h1 className="cx-h text-[clamp(26px,4vw,38px)]">
              Thank you<em>.</em>
            </h1>
            <p className="text-[15px] leading-relaxed text-ink/60">
              Your order was placed successfully.
            </p>
          </div>

          <OrderDetails order={order} />

          <div
            className="rounded-2xl border border-ink/[0.08] bg-sand p-6"
            data-testid="what-happens-next"
          >
            <p className="cx-eyebrow mb-3 text-gold-700">What happens next</p>
            <p className="mb-4 text-[14px] text-ink/60">
              Your order number is{" "}
              <span className="font-display font-bold text-ink">
                #{order.display_id}
              </span>
              . Keep it handy — quote it in any email about this order.
            </p>
            <ol className="flex flex-col gap-y-2 text-[14px] leading-relaxed text-ink/60">
              <li>
                <strong className="font-display font-bold text-ink">
                  1. Confirmation.
                </strong>{" "}
                Save your order number above — that&apos;s your confirmation of
                this order.
              </li>
              <li>
                <strong className="font-display font-bold text-ink">
                  2. Processing.
                </strong>{" "}
                Orders are dispatched within 12–24 hours.
              </li>
              <li>
                <strong className="font-display font-bold text-ink">
                  3. Shipping.
                </strong>{" "}
                For a tracking update, email{" "}
                <a
                  href="mailto:support@cylixlab.com"
                  className="font-semibold text-gold-700 underline-offset-2 hover:underline"
                >
                  support@cylixlab.com
                </a>{" "}
                with your order number.
              </li>
            </ol>
            <p className="mt-4 text-[14px] text-ink/60">
              Questions? Email{" "}
              <a
                href="mailto:support@cylixlab.com"
                className="font-semibold text-gold-700 underline-offset-2 hover:underline"
              >
                support@cylixlab.com
              </a>
              .
            </p>
          </div>

          <h2 className="cx-h text-[26px]">Summary</h2>
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
