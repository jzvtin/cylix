import { Text } from "@modules/common/components/ui"
import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "../thumbnail"
import PreviewPrice from "./price"

export default async function ProductPreview({
  product,
  isFeatured,
  region: _region,
}: {
  product: HttpTypes.StoreProduct
  isFeatured?: boolean
  region: HttpTypes.StoreRegion
}) {
  const { cheapestPrice } = getProductPrice({
    product,
  })

  // Optional editorial descriptor: subtitle or collection title if present.
  const eyebrow =
    product.subtitle || product.collection?.title || "Research compound"

  return (
    <LocalizedClientLink
      href={`/products/${product.handle}`}
      className="group block"
    >
      <div data-testid="product-wrapper" className="flex flex-col">
        <Thumbnail
          thumbnail={product.thumbnail}
          images={product.images}
          size="full"
          isFeatured={isFeatured}
          title={product.title}
        />

        {/* Trust chips */}
        <div className="flex flex-wrap items-center gap-1.5 mt-3">
          <span className="inline-flex items-center rounded-full bg-gold-500/12 px-2 py-0.5 text-[11px] font-semibold tracking-wide text-gold-500">
            99%+ purity
          </span>
          <span className="inline-flex items-center gap-1 rounded-full border border-ink/10 px-2 py-0.5 text-[11px] font-medium text-ink/70">
            <svg
              aria-hidden
              viewBox="0 0 24 24"
              className="h-3 w-3"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 12l2 2 4-4" />
              <path d="M12 3l7 4v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V7l7-4z" />
            </svg>
            CoA
          </span>
        </div>

        {/* Title + price */}
        <div className="mt-2 flex items-baseline justify-between gap-x-3">
          <Text
            className="font-display font-semibold text-ink leading-snug tracking-tight min-w-0 break-words text-base transition-colors group-hover:text-gold-500"
            data-testid="product-title"
          >
            {product.title}
          </Text>
          <div className="flex items-center gap-x-2 shrink-0 font-display font-bold text-ink text-[15px]">
            {cheapestPrice && <PreviewPrice price={cheapestPrice} />}
          </div>
        </div>

        {/* Eyebrow + availability */}
        <Text className="mt-0.5 text-xs text-ink/45 line-clamp-1">
          {eyebrow}
        </Text>
        <div className="mt-1 flex items-center gap-1.5 text-[11px] font-medium text-ink/55">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500/80" />
          In stock · ships 12–24h
        </div>
      </div>
    </LocalizedClientLink>
  )
}
