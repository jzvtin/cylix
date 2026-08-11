import Image from "next/image"
import { Text } from "@modules/common/components/ui"
import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { getProductImage } from "@lib/product-imagery"
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
  const { cheapestPrice } = getProductPrice({ product })

  const eyebrow =
    product.subtitle || product.collection?.title || "Research compound"

  const image = getProductImage(product)
  const multiVariant = (product.variants?.length ?? 0) > 1

  return (
    <LocalizedClientLink
      href={`/products/${product.handle}`}
      className="group block"
    >
      <article
        data-testid="product-wrapper"
        className="relative flex h-full flex-col overflow-hidden rounded-[22px] border border-ink/[0.07] bg-gradient-to-b from-white to-[#FBF9F5] shadow-[0_22px_50px_-34px_rgba(13,13,13,0.4)] transition-all duration-300 ease-out will-change-transform group-hover:-translate-y-1.5 group-hover:border-gold-500/30 group-hover:shadow-[0_40px_70px_-40px_rgba(13,13,13,0.5)] motion-reduce:transition-none motion-reduce:group-hover:translate-y-0"
      >
        {/* IMAGE PANEL */}
        <div className="relative aspect-[4/5] w-full overflow-hidden">
          {/* warm studio gradient behind the vial */}
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(120% 85% at 50% 16%, #FBF7EF 0%, #F3EEE4 55%, #EBE5D9 100%)",
            }}
          />
          {/* gold plinth glow */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_70%_at_50%_20%,theme(colors.gold.50)_0%,transparent_58%)]"
          />
          {/* soft contact shadow ellipse */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-10 bottom-5 h-9 rounded-[100%] bg-ink/10 blur-xl"
          />

          {image ? (
            <Image
              src={image}
              alt={product.title || "Cylix Research vial"}
              fill
              quality={70}
              sizes="(max-width:576px) 88vw, (max-width:1024px) 44vw, 300px"
              draggable={false}
              className="relative object-contain p-6 transition-transform duration-500 ease-out group-hover:scale-[1.06] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center p-6">
              <span className="text-center font-display text-lg font-bold tracking-tight text-ink/70">
                {product.title}
              </span>
            </div>
          )}

          {/* purity badge — top left */}
          <span className="absolute left-3.5 top-3.5 inline-flex items-center gap-1.5 rounded-full bg-gold-500/15 px-2.5 py-1 font-display text-[11px] font-bold uppercase tracking-wide text-gold-700 backdrop-blur-[2px]">
            <span className="h-1.5 w-1.5 rounded-full bg-gold-500" />
            99%+ purity
          </span>

          {/* CoA badge — top right */}
          <span className="absolute right-3.5 top-3.5 inline-flex items-center gap-1 rounded-full border border-ink/10 bg-white/80 px-2.5 py-1 text-[11px] font-semibold text-ink/75 backdrop-blur-[2px]">
            <svg aria-hidden viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 12l2 2 4-4" />
              <path d="M12 3l7 4v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V7l7-4z" />
            </svg>
            CoA
          </span>
        </div>

        {/* CONTENT */}
        <div className="flex flex-1 flex-col border-t border-ink/[0.06] px-4 pb-4 pt-3.5">
          <div className="mb-1 font-display text-[10px] font-bold uppercase tracking-[1.3px] text-ink/40 line-clamp-1">
            {eyebrow}
          </div>
          <div className="flex items-baseline justify-between gap-x-3">
            <Text
              className="min-w-0 break-words font-display text-[17px] font-bold leading-snug tracking-tight text-ink transition-colors group-hover:text-gold-600"
              data-testid="product-title"
            >
              {product.title}
            </Text>
          </div>

          <div className="mt-auto flex items-end justify-between gap-x-3 pt-3">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-ink/55">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500/80" />
              In stock · ships 12–24h
            </span>
            {cheapestPrice && (
              <span className="flex items-baseline gap-1 font-display text-ink">
                {multiVariant && (
                  <span className="text-[11px] font-semibold text-ink/45">From</span>
                )}
                <span className="text-[16px] font-extrabold tracking-tight">
                  <PreviewPrice price={cheapestPrice} />
                </span>
              </span>
            )}
          </div>
        </div>
      </article>
    </LocalizedClientLink>
  )
}
