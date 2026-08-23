import { notFound } from "next/navigation"
import { Suspense } from "react"

import InteractiveLink from "@modules/common/components/interactive-link"
import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import PaginatedProducts from "@modules/store/templates/paginated-products"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"
import { OptionValueIds } from "@lib/util/product-option-filters"

export default function CategoryTemplate({
  category,
  sortBy,
  page,
  countryCode,
  optionValueIds,
}: {
  category: HttpTypes.StoreProductCategory
  sortBy?: SortOptions
  page?: string
  countryCode: string
  optionValueIds?: OptionValueIds
}) {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"

  if (!category || !countryCode) notFound()

  const parents = [] as HttpTypes.StoreProductCategory[]

  const getParents = (category: HttpTypes.StoreProductCategory) => {
    if (category.parent_category) {
      parents.push(category.parent_category)
      getParents(category.parent_category)
    }
  }

  getParents(category)

  return (
    <div
      className="mx-auto max-w-[1200px] px-4 pb-14 pt-6 md:px-8 md:pb-20 md:pt-10"
      data-testid="category-container"
    >
      {/* HEADER — origin-labs light catalog header */}
      <div className="mb-6 flex flex-col items-start justify-between gap-5 min-[480px]:flex-row min-[480px]:items-end md:mb-8">
        <div className="flex flex-col gap-2">
          <p className="font-display text-xs font-semibold uppercase tracking-widest text-gold-700">
            {parents && parents.length > 0 ? (
              <span className="flex flex-wrap items-center gap-x-2">
                {parents.map((parent) => (
                  <span key={parent.id} className="flex items-center gap-x-2">
                    <LocalizedClientLink
                      className="transition-colors hover:text-gold-600"
                      href={`/categories/${parent.handle}`}
                      data-testid="sort-by-link"
                    >
                      {parent.name}
                    </LocalizedClientLink>
                    <span className="text-ink/30">/</span>
                  </span>
                ))}
              </span>
            ) : (
              "Category"
            )}
          </p>
          <h1
            className="text-2xl font-extrabold leading-[1.2] tracking-tight text-[#0a0a0a] md:text-3xl"
            data-testid="category-page-title"
          >
            {category.name}
          </h1>
          {category.description ? (
            <p className="max-w-2xl text-xs text-[#71717a]">
              {category.description}
            </p>
          ) : (
            <p className="text-xs text-[#71717a]">
              Lyophilized research compounds with per-batch Certificates of
              Analysis, for in-vitro laboratory use only.
            </p>
          )}
        </div>
        {/* Sort control */}
        <div className="w-full min-[480px]:w-auto">
          <RefinementList
            sortBy={sort}
            data-testid="sort-by-container"
            hideOptionsPicker
          />
        </div>
      </div>

      {/* SUBCATEGORIES */}
      {category.category_children && category.category_children.length > 0 && (
        <div className="mb-8 flex flex-wrap gap-x-6 gap-y-2 border-b border-ink/[0.08] pb-6">
          {category.category_children?.map((c) => (
            <InteractiveLink key={c.id} href={`/categories/${c.handle}`}>
              {c.name}
            </InteractiveLink>
          ))}
        </div>
      )}

      {/* GRID */}
      <Suspense
        fallback={
          <SkeletonProductGrid
            numberOfProducts={category.products?.length ?? 8}
          />
        }
      >
        <PaginatedProducts
          sortBy={sort}
          page={pageNumber}
          categoryId={category.id}
          countryCode={countryCode}
          optionValueIds={optionValueIds}
        />
      </Suspense>
    </div>
  )
}
