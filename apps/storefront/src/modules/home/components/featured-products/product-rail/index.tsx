import { listProducts } from "@lib/data/products"
import { HttpTypes } from "@medusajs/types"

import ProductPreview from "@modules/products/components/product-preview"

/**
 * Just the product grid — the section header (eyebrow + heading + "View all")
 * is rendered once by the home page's Featured section that wraps this, so the
 * rail intentionally renders no header/padding of its own.
 */
export default async function ProductRail({
  collection,
  region,
}: {
  collection: HttpTypes.StoreCollection
  region: HttpTypes.StoreRegion
}) {
  const {
    response: { products: pricedProducts },
  } = await listProducts({
    regionId: region.id,
    queryParams: {
      collection_id: collection.id,
      fields: "*variants.calculated_price",
    },
  })

  if (!pricedProducts || pricedProducts.length === 0) {
    return null
  }

  return (
    <ul className="grid grid-cols-2 gap-x-5 gap-y-8 small:grid-cols-3 medium:grid-cols-4">
      {pricedProducts.slice(0, 8).map((product) => (
        <li key={product.id}>
          <ProductPreview product={product} region={region} />
        </li>
      ))}
    </ul>
  )
}
