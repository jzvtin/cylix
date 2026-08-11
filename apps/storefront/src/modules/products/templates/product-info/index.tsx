import { HttpTypes } from "@medusajs/types"
import { Text } from "@modules/common/components/ui"
import { sanitizeCompliance } from "@lib/util/compliance"

type ProductInfoProps = {
  product: HttpTypes.StoreProduct
}

const ProductInfo = ({ product }: ProductInfoProps) => {
  return (
    <div id="product-info">
      <div className="flex flex-col gap-y-4">
        {product.collection && (
          <span className="font-display text-[11px] font-bold uppercase tracking-[1.4px] text-gold-700">
            {product.collection.title}
          </span>
        )}
        <div className="flex flex-col gap-y-1.5">
          <h1
            className="font-display text-[clamp(30px,4.5vw,44px)] font-extrabold leading-[1.05] tracking-[-0.02em] text-ink-900"
            data-testid="product-title"
          >
            {product.title}
          </h1>
          {product.subtitle && (
            <p className="font-display text-[15px] font-medium text-ink/50">
              {sanitizeCompliance(product.subtitle)}
            </p>
          )}
        </div>

        <Text
          className="max-w-[52ch] whitespace-pre-line text-[15px] leading-[1.7] text-ink/60"
          data-testid="product-description"
        >
          {sanitizeCompliance(product.description)}
        </Text>
      </div>
    </div>
  )
}

export default ProductInfo
