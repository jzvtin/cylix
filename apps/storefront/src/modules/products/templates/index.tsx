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
  { label: "Free priority shipping", path: "M3 7h11v8H3z M14 10h4l3 3v2h-7z M7.5 18a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z M17.5 18a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" },
  { label: "Third-party tested", path: "M12 3l7 4v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V7l7-4z M9 12l2 2 4-4" },
  { label: "Certificate of Analysis", path: "M7 3h7l5 5v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z M14 3v5h5 M9 13h6 M9 17h6" },
  { label: "Secure checkout", path: "M6 10V8a6 6 0 1 1 12 0v2 M5 10h14v10H5z M12 14v3" },
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
      <div className="bg-[#fcfaf6]">
        <div className="mx-auto flex max-w-[1120px] items-center gap-2 px-[clamp(16px,4vw,32px)] py-4 font-ui text-[13px] font-medium">
          <LocalizedClientLink href="/" className="text-ink/45 transition-colors hover:text-ink">
            Home
          </LocalizedClientLink>
          <span className="text-ink/25">/</span>
          <LocalizedClientLink href="/store" className="text-ink/45 transition-colors hover:text-ink">
            Shop
          </LocalizedClientLink>
          <span className="text-ink/25">/</span>
          <span className="text-ink-800">{product.title}</span>
        </div>
      </div>

      {/* PRODUCT LAYOUT */}
      <div className="bg-[#fcfaf6] px-[clamp(16px,4vw,32px)] pb-16 pt-2 md:pt-4">
        <div
          className="cx-product-grid mx-auto max-w-[1120px]"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "clamp(28px,4vw,56px)",
            alignItems: "start",
          }}
        >
          {/* LEFT — square image card */}
          <div style={{ position: "sticky", top: "96px" }}>
            <div className="overflow-hidden rounded-2xl border border-[#e4e4e7] bg-[#fafafa]">
              <ImageGallery images={galleryImages} />
            </div>
          </div>

          {/* RIGHT — info + actions */}
          <div className="flex flex-col gap-6">
            <ProductInfo product={product} />

            {/* Buy box: price + strength + qty + add to cart + CoA button */}
            <div>
              <Suspense
                fallback={<ProductActions disabled={true} product={product} region={region} />}
              >
                <ProductActionsWrapper id={product.id} region={region} />
              </Suspense>
            </div>

            {/* Trust icon row */}
            <div className="grid grid-cols-2 gap-x-5 gap-y-3 border-y border-[#e4e4e7] py-4 sm:grid-cols-4">
              {TRUST.map((b) => (
                <div key={b.label} className="flex items-center gap-2 text-[12px] font-medium text-ink/60">
                  <svg aria-hidden viewBox="0 0 24 24" className="h-4 w-4 shrink-0 text-gold-500" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                    <path d={b.path} />
                  </svg>
                  {b.label}
                </div>
              ))}
            </div>

            {/* Certificate of Analysis — visual proof */}
            <div id="cx-coa" className="scroll-mt-24">
              <CoaPanel product={product} />
            </div>

            {/* Storage — static informational */}
            <div>
              <div className="mb-2 font-ui text-[11px] font-bold uppercase tracking-[1.5px] text-ink/45">
                Storage
              </div>
              <p className="m-0 text-[13px] leading-[1.7] text-ink/55">
                Supplied as a lyophilized (freeze-dried) powder. Refrigerate the
                sealed vial at 2&ndash;8&deg;C on arrival; for long-term storage keep at
                &minus;20&deg;C, protected from light and moisture. Keep any
                reconstituted material refrigerated.
              </p>
            </div>

            {/* Research-use disclaimer */}
            <div>
              <div className="mb-2 font-ui text-[11px] font-bold uppercase tracking-[1.5px] text-ink/45">
                For Research Use Only
              </div>
              <p className="m-0 text-[13px] leading-[1.7] text-ink/55">
                All products listed on this site are for laboratory research use
                only. Not for human or animal consumption. Intended strictly for
                qualified laboratories performing controlled in-vitro or analytical
                research. No medical, diagnostic, or therapeutic claims are made for
                any product. Must be 21 or older to purchase.
              </p>
            </div>

            {/* Product tabs */}
            <ProductTabs product={product} />
          </div>
        </div>
      </div>

      {/* RELATED PRODUCTS */}
      <div className="border-t border-[#ece4d8] bg-[#fcfaf6] px-[clamp(16px,4vw,32px)] py-14">
        <div className="mx-auto max-w-[1120px]">
          <h2 className="mb-8 font-display text-[clamp(24px,3.5vw,30px)] font-extrabold tracking-[-0.02em] text-ink-900">
            Popular right now
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
