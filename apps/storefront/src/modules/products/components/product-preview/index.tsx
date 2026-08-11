import Image from "next/image"
import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { getProductImage } from "@lib/product-imagery"
import QuickAdd from "./quick-add"

/**
 * Origin-labs product card, reskinned for Cylix: white rounded-2xl card, image
 * on a light plinth, hover-lift, hover quick-add overlay, title + scientific
 * subtitle + "From $X". Uses real Medusa data (no fabricated stock/variants).
 */
export default async function ProductPreview({
  product,
  region: _region,
}: {
  product: HttpTypes.StoreProduct
  isFeatured?: boolean
  region: HttpTypes.StoreRegion
}) {
  const { cheapestPrice } = getProductPrice({ product })
  const subtitle = product.subtitle || product.collection?.title || ""
  const image = getProductImage(product)
  const multiVariant = (product.variants?.length ?? 0) > 1
  const defaultVariantId = product.variants?.[0]?.id

  return (
    <article className="group relative h-full overflow-hidden rounded-2xl border border-[#e4e4e7] bg-white shadow-sm transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1.5 hover:border-[#d4d4d8] hover:shadow-[0_18px_32px_-14px_rgba(23,23,23,0.22),0_4px_10px_-6px_rgba(201,150,58,0.14)] focus-within:-translate-y-1.5 motion-reduce:hover:translate-y-0">
      {/* IMAGE */}
      <div className="relative overflow-hidden">
        <div className="relative aspect-[4/5] bg-[#fafafa] md:aspect-square">
          {image ? (
            <Image
              src={image}
              alt={`${product.title} — research material, for research use only`}
              fill
              quality={70}
              sizes="(max-width:768px) 45vw, 300px"
              className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-105 motion-reduce:group-hover:scale-100"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center p-4 text-center font-display text-sm font-bold text-ink/70">
              {product.title}
            </div>
          )}
        </div>

        {/* hover overlay — quick add (desktop) */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] hidden translate-y-[10px] p-3 opacity-0 [background-image:linear-gradient(to_top,rgba(0,0,0,0.64),rgba(0,0,0,0.16)_55%,transparent)] transition-[opacity,transform] duration-200 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:translate-y-0 group-focus-within:opacity-100 md:block">
          {multiVariant ? (
            <LocalizedClientLink
              href={`/products/${product.handle}`}
              className="relative z-[3] inline-flex h-10 w-full items-center justify-center rounded-xl bg-ink px-5 font-display text-sm font-semibold text-white shadow-md transition-colors hover:bg-gold-600"
            >
              Choose strength
            </LocalizedClientLink>
          ) : (
            <QuickAdd variantId={defaultVariantId} />
          )}
        </div>
      </div>

      {/* CONTENT — whole card links to PDP via the ::before overlay */}
      <div className="p-2.5 md:p-4">
        <LocalizedClientLink
          href={`/products/${product.handle}`}
          className="before:absolute before:inset-0 before:z-0 before:content-['']"
        >
          <p
            className="line-clamp-1 font-display text-xs font-semibold text-[#0a0a0a] md:text-sm"
            data-testid="product-title"
          >
            {product.title}
          </p>
        </LocalizedClientLink>
        {subtitle && (
          <p className="mt-0.5 line-clamp-1 text-[10px] text-[#71717a] md:text-xs">
            {subtitle}
          </p>
        )}
        <div className="mt-1 flex items-baseline gap-1.5 md:mt-1.5">
          <p className="font-display text-xs font-bold text-[#0a0a0a] md:text-sm">
            {multiVariant && (
              <span className="text-[10px] font-medium text-[#71717a] md:text-xs">
                From{" "}
              </span>
            )}
            {cheapestPrice?.calculated_price}
          </p>
        </div>
      </div>
    </article>
  )
}
