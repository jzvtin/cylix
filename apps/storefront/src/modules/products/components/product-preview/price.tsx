import { Text, clx } from "@modules/common/components/ui"
import { VariantPrice } from "types/global"

export default async function PreviewPrice({ price }: { price: VariantPrice }) {
  if (!price) {
    return null
  }

  const isSale = price.price_type === "sale"

  return (
    <span className="inline-flex items-baseline gap-1.5">
      {isSale && (
        <Text
          className="text-[12px] font-medium text-ink/40 line-through"
          data-testid="original-price"
        >
          {price.original_price}
        </Text>
      )}
      <Text
        className={clx("font-display font-extrabold tracking-tight", {
          "text-gold-600": isSale,
          "text-ink": !isSale,
        })}
        data-testid="price"
      >
        {price.calculated_price}
      </Text>
    </span>
  )
}
