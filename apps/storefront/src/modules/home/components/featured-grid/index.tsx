import { HttpTypes } from "@medusajs/types"
import { listProducts } from "@lib/data/products"
import ProductPreview from "@modules/products/components/product-preview"

/**
 * A single flat product grid for the homepage "Featured compounds" section —
 * origin-labs renders one 4-up grid (no per-collection rails). We pull the
 * first N priced products for the region; compliance scrubbing happens inside
 * listProducts, so nothing banned can reach the grid.
 */
export default async function FeaturedGrid({
  region,
  limit = 8,
}: {
  region: HttpTypes.StoreRegion
  limit?: number
}) {
  const {
    response: { products },
  } = await listProducts({
    regionId: region.id,
    queryParams: {
      limit,
      fields: "*variants.calculated_price",
    },
  })

  if (!products || products.length === 0) return null

  return (
    <ul className="grid grid-cols-2 gap-x-5 gap-y-8 small:grid-cols-3 medium:grid-cols-4">
      {products.slice(0, limit).map((product) => (
        <li key={product.id}>
          <ProductPreview product={product} region={region} />
        </li>
      ))}
    </ul>
  )
}
