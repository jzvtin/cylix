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
        <h1
          className="font-display text-[clamp(30px,4.5vw,46px)] font-black leading-[1.02] tracking-[-1.4px] text-ink"
          data-testid="product-title"
        >
          {product.title}
        </h1>

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
