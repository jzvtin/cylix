/**
 * Storefront-side imagery override.
 *
 * The live Medusa catalog ships each product with its own thumbnail, but we
 * present a uniform, art-directed set of studio vials for a cohesive premium
 * grid without touching the backend/DB. Given a product we resolve a LOCAL
 * web-optimised image (under /public/products/web) by handle or coded compound
 * name; when there's no override we fall back to the Medusa thumbnail.
 *
 * COMPLIANCE: keys and file names are CODED (rt / tz) — never full compound
 * names — so no banned term ever appears in a public asset href.
 */

// handle → local web image (all pre-compressed to ~30–42KB, next/image-friendly).
// Coded file names (rt / tz) — no banned compound term in any public asset href.
const BY_HANDLE: Record<string, string> = {
  "bpc-157": "/products/web/bpc-157.jpg",
  nad: "/products/web/nad.jpg",
  "ghk-cu": "/products/web/ghk-cu.jpg",
  tesamorelin: "/products/web/tesamorelin.jpg",
  rt3: "/products/web/rt.jpg",
  tz2: "/products/web/tz.jpg",
  klow: "/products/web/klow.jpg",
  "glow-stack": "/products/web/glow.jpg",
  "tb-500": "/products/web/tb-500.jpg",
  "igf-1": "/products/web/igf-1.jpg",
  "wolverine-blend": "/products/web/wolverine-blend.jpg",
  semax: "/products/web/semax.jpg",
  "cjc-ipamorelin": "/products/web/cjc-ipamorelin.jpg",
  "mots-c": "/products/web/mots-c.jpg",
}

type ProductLike = {
  handle?: string | null
  thumbnail?: string | null
  images?: { url?: string }[] | null
}

/** Whether a curated local override exists for this product. */
export function hasCuratedImage(product: ProductLike): boolean {
  return Boolean(product.handle && BY_HANDLE[product.handle])
}

/**
 * Best image for a product: the curated local vial when we have one, otherwise
 * the Medusa thumbnail / first gallery image. Never returns undefined-y noise.
 */
export function getProductImage(product: ProductLike): string | undefined {
  if (product.handle && BY_HANDLE[product.handle]) {
    return BY_HANDLE[product.handle]
  }
  return product.thumbnail || product.images?.[0]?.url || undefined
}
