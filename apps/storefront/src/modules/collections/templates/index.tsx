import { Suspense } from "react"

import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import PaginatedProducts from "@modules/store/templates/paginated-products"
import { HttpTypes } from "@medusajs/types"
import { OptionValueIds } from "@lib/util/product-option-filters"

export default function CollectionTemplate({
  sortBy,
  collection,
  page,
  countryCode,
  optionValueIds,
}: {
  sortBy?: SortOptions
  collection: HttpTypes.StoreCollection
  page?: string
  countryCode: string
  optionValueIds?: OptionValueIds
}) {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"

  return (
    <div className="mx-auto max-w-[1200px] px-4 pb-14 pt-6 md:px-8 md:pb-20 md:pt-10">
      {/* HEADER — origin-labs light catalog header */}
      <div className="mb-6 flex flex-col items-start justify-between gap-5 min-[480px]:flex-row min-[480px]:items-end md:mb-8">
        <div className="flex flex-col gap-2">
          <p className="font-display text-xs font-semibold uppercase tracking-widest text-gold-700">
            Collection
          </p>
          <h1 className="text-2xl font-extrabold leading-[1.2] tracking-tight text-[#0a0a0a] md:text-3xl">
            {collection.title}
          </h1>
          <p className="text-xs text-[#71717a]">
            Lyophilized research compounds with per-batch Certificates of
            Analysis, for in-vitro laboratory use only.
          </p>
        </div>
        {/* Sort control */}
        <div className="w-full min-[480px]:w-auto">
          <RefinementList sortBy={sort} hideOptionsPicker />
        </div>
      </div>

      {/* GRID */}
      <Suspense
        fallback={
          <SkeletonProductGrid numberOfProducts={collection.products?.length} />
        }
      >
        <PaginatedProducts
          sortBy={sort}
          page={pageNumber}
          collectionId={collection.id}
          countryCode={countryCode}
          optionValueIds={optionValueIds}
        />
      </Suspense>
    </div>
  )
}
