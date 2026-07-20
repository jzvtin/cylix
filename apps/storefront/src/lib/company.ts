/**
 * Single source of truth for the legal/contact details rendered on the policy
 * pages. The values marked TODO must be replaced with the real registered
 * details before launch — they appear verbatim in the Terms, Privacy Policy,
 * Shipping and Returns pages.
 */
export const COMPANY = {
  /** Trading name shown throughout the storefront. */
  brand: "Cylix Research",

  /** TODO: registered legal entity, e.g. "Cylix Research LLC". */
  legalName: "TODO_LEGAL_ENTITY_NAME",

  /** TODO: registered business address used for legal notices. */
  address: "TODO_REGISTERED_ADDRESS",

  /** TODO: US state whose law governs the Terms, e.g. "Delaware". */
  governingState: "TODO_GOVERNING_STATE",

  supportEmail: "support@cylixresearch.com",
  privacyEmail: "support@cylixresearch.com",

  /** Business days/hours quoted on the support and shipping pages. */
  supportHours: "Mon–Fri, 9am–6pm EST",
} as const

/** True when any TODO placeholder is still present. */
export const COMPANY_DETAILS_INCOMPLETE = Object.values(COMPANY).some((v) =>
  v.startsWith("TODO_")
)
