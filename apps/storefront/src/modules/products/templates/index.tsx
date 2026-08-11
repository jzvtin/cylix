import React, { Suspense } from "react"
import ImageGallery from "@modules/products/components/image-gallery"
import ProductActions from "@modules/products/components/product-actions"
import ProductTabs from "@modules/products/components/product-tabs"
import CoaPanel from "@modules/products/components/coa-panel"
import RelatedProducts from "@modules/products/components/related-products"
import ProductInfo from "@modules/products/templates/product-info"
import SkeletonRelatedProducts from "@modules/skeletons/templates/skeleton-related-products"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { notFound } from "next/navigation"
import { HttpTypes } from "@medusajs/types"
import { hasCuratedImage, getProductImage } from "@lib/product-imagery"
import ProductActionsWrapper from "./product-actions-wrapper"

type ProductTemplateProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  countryCode: string
  images: HttpTypes.StoreProductImage[]
}

const TRUST = [
  { label: "99%+ purity verified", path: "M12 3l7 4v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V7l7-4z M9 12l2 2 4-4" },
  { label: "CoA included", path: "M7 3h7l5 5v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z M14 3v5h5 M9 13h6 M9 17h6" },
  { label: "Free shipping", path: "M3 7h11v8H3z M14 10h4l3 3v2h-7z M7.5 18a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z M17.5 18a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" },
  { label: "12–24h dispatch", path: "M12 8v4l3 2 M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z" },
]

const ProductTemplate: React.FC<ProductTemplateProps> = ({
  product,
  region,
  countryCode,
  images,
}) => {
  if (!product || !product.id) return notFound()

  // Prefer the curated studio vial (own cream backdrop) as the hero image;
  // fall back to the Medusa gallery for anything without an override.
  const curated = hasCuratedImage(product) ? getProductImage(product) : undefined
  const galleryImages: HttpTypes.StoreProductImage[] = curated
    ? [{ id: "cx-curated", url: curated } as HttpTypes.StoreProductImage]
    : images

  return (
    <>
      {/* BREADCRUMB */}
      <div className="border-b border-ink/[0.06] bg-white/40 backdrop-blur-sm">
        <div className="mx-auto flex max-w-[1100px] items-center gap-2 px-[clamp(16px,4vw,32px)] py-3 font-display text-[12px] font-semibold">
          <LocalizedClientLink
            href="/store"
            className="text-ink/45 transition-colors hover:text-gold-700"
          >
            Catalog
          </LocalizedClientLink>
          <span className="text-ink/30">›</span>
          <span className="text-ink">{product.title}</span>
        </div>
      </div>

      {/* PRODUCT LAYOUT */}
      <div className="px-[clamp(16px,4vw,32px)] pb-16 pt-8 md:pt-10">
        <div
          className="cx-product-grid mx-auto max-w-[1100px]"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "clamp(28px,4vw,64px)",
            alignItems: "start",
          }}
        >
          {/* LEFT — image + trust */}
          <div style={{ position: "sticky", top: "80px" }}>
            <div className="cx-card overflow-hidden rounded-[24px] p-3">
              <ImageGallery images={galleryImages} />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2.5">
              {TRUST.map((b) => (
                <div
                  key={b.label}
                  className="cx-glass flex items-center gap-2.5 rounded-xl px-3.5 py-3 text-[12px] font-bold text-ink/75"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gold-50 text-gold-700">
                    <svg aria-hidden viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                      <path d={b.path} />
                    </svg>
                  </span>
                  {b.label}
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — info + actions */}
          <div className="flex flex-col gap-6">
            <div>
              <div className="cx-eyebrow mb-4">Research Compound</div>
              <ProductInfo product={product} />
            </div>

            {/* Buy box */}
            <div>
              <Suspense
                fallback={<ProductActions disabled={true} product={product} region={region} />}
              >
                <ProductActionsWrapper id={product.id} region={region} />
              </Suspense>
            </div>

            {/* Certificate of Analysis — visual proof */}
            <div id="cx-coa" className="scroll-mt-24">
              <CoaPanel product={product} />
            </div>

            {/* Research-use disclaimer */}
            <div className="rounded-2xl border border-gold-500/25 bg-gold-500/[0.06] px-5 py-4">
              <div className="mb-1.5 font-display text-[10px] font-extrabold uppercase tracking-[1px] text-gold-700">
                Research Use Only
              </div>
              <p className="m-0 text-[12px] leading-[1.7] text-ink/55">
                For in-vitro laboratory research and analytical method development
                only. Not for human or animal consumption. Must be 21 or older to
                purchase.
              </p>
            </div>

            {/* Product tabs */}
            <ProductTabs product={product} />
          </div>
        </div>
      </div>

      {/* RELATED PRODUCTS */}
      <div className="border-t border-ink/[0.06] bg-white/30 px-[clamp(16px,4vw,32px)] py-14 backdrop-blur-sm">
        <div className="mx-auto max-w-[1100px]">
          <div className="cx-eyebrow mb-4">You may also need</div>
          <h2 className="cx-h mb-8 text-[clamp(24px,3.5vw,34px)]">
            Related <em>compounds.</em>
          </h2>
          <Suspense fallback={<SkeletonRelatedProducts />}>
            <RelatedProducts product={product} countryCode={countryCode} />
          </Suspense>
        </div>
      </div>
    </>
  )
}

export default ProductTemplate
