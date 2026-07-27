/**
 * Single source of truth for the legal/contact details rendered on the policy
 * pages. The values marked TODO must be replaced with the real registered
 * details before launch — they appear verbatim in the Terms, Privacy Policy,
 * Shipping and Returns pages.
 */
export const COMPANY = {
  /** Trading name shown throughout the storefront. */
  brand: "Cylix Research",

  /**
   * INTERIM honest defaults so the legal pages don't show raw TODO tokens.
   * REPLACE before real launch with the registered details, and have a lawyer
   * review the policy pages:
   *  - legalName: the registered entity, e.g. "Cylix Research LLC"
   *  - address: the registered business address for legal notices
   *  - governingState: the specific US state whose law governs the Terms
   */
  legalName: "Cylix Research",
  address: "the United States",
  governingState: "the United States",

  supportEmail: "support@cylixlab.com",
  privacyEmail: "support@cylixlab.com",

  /** Business days/hours quoted on the support and shipping pages. */
  supportHours: "Mon–Fri, 9am–6pm EST",
} as const

/** True when any TODO placeholder is still present. */
export const COMPANY_DETAILS_INCOMPLETE = Object.values(COMPANY).some((v) =>
  v.startsWith("TODO_")
)
