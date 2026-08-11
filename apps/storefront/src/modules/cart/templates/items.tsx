import repeat from "@lib/util/repeat"
import { HttpTypes } from "@medusajs/types"

import Item from "@modules/cart/components/item"
import SkeletonLineItem from "@modules/skeletons/components/skeleton-line-item"

type ItemsTemplateProps = {
  cart?: HttpTypes.StoreCart
}

const ItemsTemplate = ({ cart }: ItemsTemplateProps) => {
  const items = cart?.items
  const count = items?.reduce((n, i) => n + i.quantity, 0) ?? 0

  return (
    <div>
      <div className="mb-5 flex items-baseline justify-between">
        <h1 className="cx-h text-[clamp(28px,4vw,40px)]" data-testid="cart-heading">
          Your <em>cart.</em>
        </h1>
        {count > 0 && (
          <span className="font-display text-[13px] font-bold text-ink/50">
            {count} {count === 1 ? "item" : "items"}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-3">
        {items
          ? items
              .slice()
              .sort((a, b) => ((a.created_at ?? "") > (b.created_at ?? "") ? -1 : 1))
              .map((item) => (
                <Item
                  key={item.id}
                  item={item}
                  currencyCode={cart?.currency_code || "usd"}
                />
              ))
          : repeat(3).map((i) => <SkeletonLineItem key={i} />)}
      </div>
    </div>
  )
}

export default ItemsTemplate
