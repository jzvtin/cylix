import { clx } from "@modules/common/components/ui"

import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"

export default function ProductPrice({
  product,
  variant,
}: {
  product: HttpTypes.StoreProduct
  variant?: HttpTypes.StoreProductVariant
}) {
  const { cheapestPrice, variantPrice } = getProductPrice({
    product,
    variantId: variant?.id,
  })

  const selectedPrice = variant ? variantPrice : cheapestPrice

  if (!selectedPrice) {
    return <div className="block w-32 h-9 bg-gray-100 animate-pulse" />
  }

  return (
    <div className="flex flex-col text-ink">
      <span
        className={clx("font-display text-[26px] font-extrabold leading-none text-ink", {
          "text-gold-600": selectedPrice.price_type === "sale",
        })}
      >
        {!variant && (
          <span className="font-sans text-[13px] font-medium text-ink/45">From </span>
        )}
        <span
          data-testid="product-price"
          data-value={selectedPrice.calculated_price_number}
        >
          {selectedPrice.calculated_price}
        </span>
      </span>
      {selectedPrice.price_type === "sale" && (
        <>
          <p className="mt-1.5 text-[13px] text-ink/55">
            <span className="text-ink/45">Original: </span>
            <span
              className="line-through"
              data-testid="original-product-price"
              data-value={selectedPrice.original_price_number}
            >
              {selectedPrice.original_price}
            </span>
          </p>
          <span className="font-display text-[13px] font-bold text-gold-600">
            -{selectedPrice.percentage_diff}%
          </span>
        </>
      )}
    </div>
  )
}
