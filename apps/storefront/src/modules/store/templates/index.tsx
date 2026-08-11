import { Suspense } from "react"
import { OptionValueIds } from "@lib/util/product-option-filters"
import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import PaginatedProducts from "./paginated-products"

const StoreTemplate = ({
  sortBy,
  page,
  countryCode,
  optionValueIds,
}: {
  sortBy?: SortOptions
  page?: string
  countryCode: string
  optionValueIds?: OptionValueIds
}) => {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"

  return (
    <div className="mx-auto max-w-[1200px] px-4 pb-14 pt-6 md:px-8 md:pb-20 md:pt-10">
      {/* HEADER — origin-labs light catalog header */}
      <div className="mb-6 flex flex-col items-start justify-between gap-5 min-[480px]:flex-row min-[480px]:items-end md:mb-8">
        <div className="flex flex-col gap-2">
          <p className="font-display text-xs font-semibold uppercase tracking-widest text-gold-700">
            Catalog
          </p>
          <h1 className="text-2xl font-extrabold leading-[1.2] tracking-tight text-[#0a0a0a] md:text-3xl">
            Research Compounds for Sale
          </h1>
          <p className="text-xs text-[#71717a]">
            Lyophilized research compounds with per-batch Certificates of
            Analysis, for in-vitro laboratory use only.
          </p>
        </div>
        {/* Sort control */}
        <div className="w-full min-[480px]:w-auto">
          <RefinementList sortBy={sort} />
        </div>
      </div>

      {/* GRID */}
      <Suspense fallback={<SkeletonProductGrid />}>
        <PaginatedProducts
          sortBy={sort}
          page={pageNumber}
          countryCode={countryCode}
          optionValueIds={optionValueIds}
        />
      </Suspense>

      {/* COMPLIANCE */}
      <div className="mt-16 flex flex-col items-center gap-4 border-t border-[#e4e4e7] pt-12 text-center md:mt-20">
        <p className="max-w-2xl text-sm text-[#71717a]">
          All Cylix Research products are sold strictly for laboratory research
          use only. They are not for human or animal consumption and are not
          intended to diagnose, treat, cure, or prevent any condition. Must be
          21 or older to purchase.
        </p>
      </div>
    </div>
  )
}

export default StoreTemplate
