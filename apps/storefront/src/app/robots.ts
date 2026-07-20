import { MetadataRoute } from "next"
import { getBaseURL } from "@lib/util/env"

/**
 * Replaces the `next-sitemap` config, which never ran: it had no `postbuild`
 * script, the package was not installed, and its `exclude` array was being
 * string-coerced into a single meaningless glob.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api/", "/checkout", "/account", "/cart", "/order/"],
    },
    sitemap: `${getBaseURL()}/sitemap.xml`,
  }
}
