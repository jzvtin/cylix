"use client"

import { Text } from "@modules/common/components/ui"
import { updateLineItem } from "@lib/data/cart"
import { HttpTypes } from "@medusajs/types"
import ErrorMessage from "@modules/checkout/components/error-message"
import DeleteButton from "@modules/common/components/delete-button"
import LineItemOptions from "@modules/common/components/line-item-options"
import LineItemPrice from "@modules/common/components/line-item-price"
import LineItemUnitPrice from "@modules/common/components/line-item-unit-price"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Spinner from "@modules/common/icons/spinner"
import Thumbnail from "@modules/products/components/thumbnail"
import { useState } from "react"

type ItemProps = {
  item: HttpTypes.StoreCartLineItem
  type?: "full" | "preview"
  currencyCode: string
}

const MAX_QTY = 10

const Item = ({ item, type = "full", currencyCode }: ItemProps) => {
  const [updating, setUpdating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const changeQuantity = async (quantity: number) => {
    const next = Math.max(1, Math.min(MAX_QTY, quantity))
    if (next === item.quantity) return
    setError(null)
    setUpdating(true)
    await updateLineItem({ lineId: item.id, quantity: next })
      .catch((err) => setError(err.message))
      .finally(() => setUpdating(false))
  }

  return (
    <div
      className="flex items-center gap-4 rounded-2xl border border-ink/[0.07] bg-white/70 p-3 backdrop-blur-sm transition-colors sm:gap-5 sm:p-4"
      data-testid="product-row"
    >
      {/* Thumbnail */}
      <LocalizedClientLink
        href={`/products/${item.product_handle}`}
        className="shrink-0"
      >
        <div className="w-[76px] sm:w-[92px]">
          <Thumbnail
            thumbnail={item.thumbnail}
            images={item.variant?.product?.images}
            size="square"
            title={item.product_title || item.title}
          />
        </div>
      </LocalizedClientLink>

      {/* Title + variant + unit price */}
      <div className="min-w-0 flex-1">
        <LocalizedClientLink href={`/products/${item.product_handle}`}>
          <Text
            className="truncate font-display text-[15px] font-bold text-ink transition-colors hover:text-gold-700"
            data-testid="product-title"
          >
            {item.product_title}
          </Text>
        </LocalizedClientLink>
        <div className="mt-0.5 text-[12px] text-ink/50">
          <LineItemOptions variant={item.variant} data-testid="product-variant" />
        </div>
        <div className="mt-1 text-[12px] text-ink/45">
          <LineItemUnitPrice item={item} style="tight" currencyCode={currencyCode} />
          <span className="text-ink/30"> each</span>
        </div>

        {/* Quantity stepper */}
        {type === "full" && (
          <div className="mt-2.5 flex items-center gap-3">
            <div className="inline-flex items-center rounded-full border border-ink/15 bg-white">
              <button
                type="button"
                aria-label="Decrease quantity"
                onClick={() => changeQuantity(item.quantity - 1)}
                disabled={updating || item.quantity <= 1}
                className="flex h-8 w-8 items-center justify-center rounded-full text-[17px] leading-none text-ink/70 transition-colors hover:text-ink disabled:opacity-30"
              >
                −
              </button>
              <span className="w-8 text-center font-display text-[14px] font-bold text-ink">
                {item.quantity}
              </span>
              <button
                type="button"
                aria-label="Increase quantity"
                onClick={() => changeQuantity(item.quantity + 1)}
                disabled={updating || item.quantity >= MAX_QTY}
                className="flex h-8 w-8 items-center justify-center rounded-full text-[17px] leading-none text-ink/70 transition-colors hover:text-ink disabled:opacity-30"
              >
                +
              </button>
            </div>
            {updating && <Spinner />}
            <DeleteButton
              id={item.id}
              data-testid="product-delete-button"
              className="text-[12px] text-ink/40 hover:text-red-600"
            />
          </div>
        )}
        <ErrorMessage error={error} data-testid="product-error-message" />
      </div>

      {/* Line total */}
      <div className="shrink-0 self-start pt-1 text-right font-display font-extrabold text-ink">
        <LineItemPrice item={item} style="tight" currencyCode={currencyCode} />
      </div>
    </div>
  )
}

export default Item
