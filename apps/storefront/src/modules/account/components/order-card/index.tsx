import { useMemo } from "react"

import Thumbnail from "@modules/products/components/thumbnail"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"

type OrderCardProps = {
  order: HttpTypes.StoreOrder
}

const statusStyles: Record<string, string> = {
  fulfilled: "bg-emerald-50 text-emerald-700 border-emerald-200",
  shipped: "bg-sky-50 text-sky-700 border-sky-200",
  delivered: "bg-emerald-50 text-emerald-700 border-emerald-200",
  partially_fulfilled: "bg-amber-50 text-amber-700 border-amber-200",
  partially_shipped: "bg-amber-50 text-amber-700 border-amber-200",
  not_fulfilled: "bg-ink/5 text-ink/60 border-ink/10",
  canceled: "bg-rose-50 text-rose-700 border-rose-200",
}

const formatStatus = (status?: string) =>
  (status || "processing")
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ")

const OrderCard = ({ order }: OrderCardProps) => {
  const numberOfLines = useMemo(() => {
    return (
      order.items?.reduce((acc, item) => {
        return acc + item.quantity
      }, 0) ?? 0
    )
  }, [order])

  const numberOfProducts = useMemo(() => {
    return order.items?.length ?? 0
  }, [order])

  const status = order.fulfillment_status
  const pillClass = statusStyles[status] ?? "bg-ink/5 text-ink/60 border-ink/10"

  return (
    <div
      className="cx-glass rounded-[24px] p-6 flex flex-col"
      data-testid="order-card"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="font-display font-black text-xl text-ink">
            #<span data-testid="order-display-id">{order.display_id}</span>
          </div>
          <div className="flex items-center gap-x-2 text-sm text-ink/55 mt-1">
            <span data-testid="order-created-at">
              {new Date(order.created_at).toDateString()}
            </span>
            <span className="text-ink/25">•</span>
            <span>{`${numberOfLines} ${
              numberOfLines > 1 ? "items" : "item"
            }`}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span
            className={`text-xs font-semibold px-3 py-1.5 rounded-full border ${pillClass}`}
          >
            {formatStatus(status)}
          </span>
          <span
            className="font-display font-bold text-lg text-ink"
            data-testid="order-amount"
          >
            {convertToLocale({
              amount: order.total,
              currency_code: order.currency_code,
            })}
          </span>
        </div>
      </div>

      {/* Thumbnails */}
      <div className="grid grid-cols-3 small:grid-cols-4 gap-3 my-5">
        {order.items?.slice(0, 3).map((i) => {
          return (
            <div
              key={i.id}
              className="flex flex-col gap-y-2"
              data-testid="order-item"
            >
              <Thumbnail
                thumbnail={i.thumbnail}
                images={[]}
                size="square"
                title={i.product_title || i.title}
              />
              <div className="flex items-center text-xs text-ink/70">
                <span
                  className="text-ink/80 font-semibold truncate"
                  data-testid="item-title"
                >
                  {i.title}
                </span>
                <span className="ml-1.5 text-ink/40">
                  ×<span data-testid="item-quantity">{i.quantity}</span>
                </span>
              </div>
            </div>
          )
        })}
        {numberOfProducts > 3 && (
          <div className="rounded-2xl bg-white/50 border border-ink/5 flex flex-col items-center justify-center text-ink/55 text-sm aspect-square">
            <span className="font-display font-bold text-lg">
              +{numberOfProducts - 3}
            </span>
            <span className="text-xs">more</span>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex justify-end pt-1">
        <LocalizedClientLink
          href={`/account/orders/details/${order.id}`}
          className="cx-btn cx-btn-ghost !py-2.5 !px-5 !text-sm"
          data-testid="order-details-link"
        >
          View order
        </LocalizedClientLink>
      </div>
    </div>
  )
}

export default OrderCard
