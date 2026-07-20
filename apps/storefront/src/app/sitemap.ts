import { MetadataRoute } from "next"
import { getBaseURL } from "@lib/util/env"
import { listProducts } from "@lib/data/products"

export const revalidate = 3600

const COUNTRY = process.env.NEXT_PUBLIC_DEFAULT_REGION || "us"

const STATIC_PATHS = [
  { path: "", priority: 1.0, changeFrequency: "weekly" as const },
  { path: "/store", priority: 0.9, changeFrequency: "daily" as const },
  { path: "/faq", priority: 0.6, changeFrequency: "monthly" as const },
  { path: "/support", priority: 0.6, changeFrequency: "monthly" as const },
  { path: "/coa", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/disclaimer", priority: 0.5, changeFrequency: "yearly" as const },
  { path: "/shipping", priority: 0.5, changeFrequency: "yearly" as const },
  { path: "/returns", priority: 0.5, changeFrequency: "yearly" as const },
  { path: "/terms", priority: 0.3, changeFrequency: "yearly" as const },
  { path: "/privacy", priority: 0.3, changeFrequency: "yearly" as const },
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getBaseURL()
  const now = new Date()

  const staticEntries = STATIC_PATHS.map((entry) => ({
    url: `${base}/${COUNTRY}${entry.path}`,
    lastModified: now,
    changeFrequency: entry.changeFrequency,
    priority: entry.priority,
  }))

  // A backend outage must not fail the build — degrade to the static routes.
  let productEntries: MetadataRoute.Sitemap = []
  try {
    const { response } = await listProducts({
      countryCode: COUNTRY,
      queryParams: { limit: 100, fields: "handle,updated_at" },
    })

    productEntries = response.products
      .filter((product) => Boolean(product.handle))
      .map((product) => ({
        url: `${base}/${COUNTRY}/products/${product.handle}`,
        lastModified: product.updated_at ? new Date(product.updated_at) : now,
        changeFrequency: "weekly" as const,
        priority: 0.8,
      }))
  } catch (err) {
    console.error("[sitemap] could not list products", err)
  }

  return [...staticEntries, ...productEntries]
}
