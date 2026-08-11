/**
 * Central marketing / growth config.
 *
 * Everything here is env-driven and SAFE: when an ID or key is unset, the
 * corresponding feature renders nothing / no-ops. No values are hardcoded that
 * would break production when the env vars are absent (they ARE absent locally).
 *
 * No PII, no secrets committed. Server-only keys (ESP) are read in the API
 * route, never exposed to the client bundle.
 */

/** Client-visible pixel IDs (must be NEXT_PUBLIC_* to reach the browser). */
export const pixels = {
  metaPixelId: process.env.NEXT_PUBLIC_META_PIXEL_ID?.trim() || "",
  tiktokPixelId: process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID?.trim() || "",
  gaId: process.env.NEXT_PUBLIC_GA_ID?.trim() || "",
} as const

/** True when at least one analytics/ads pixel is configured. */
export const hasAnyPixel = Boolean(
  pixels.metaPixelId || pixels.tiktokPixelId || pixels.gaId
)

/** Email-capture popup behaviour. */
export const popup = {
  /** Delay before the timed trigger fires (ms). */
  delayMs: 12_000,
  /** localStorage key used to show the popup only once per visitor. */
  storageKey: "cx_email_popup",
  headline: "Get 10% off your first order",
  subhead:
    "Join the list for early lot drops, Certificates of Analysis, and a one-time welcome code.",
  microcopy: "No spam. CoAs and lot drops.",
} as const

/** Promo code returned to a new subscriber (also shown in the popup success state). */
export const promoCode =
  process.env.NEXT_PUBLIC_WELCOME_CODE?.trim() || "WELCOME10"

/** Rotating announcement-bar messages. Compliance-safe copy only. */
export const announcements: readonly string[] = [
  "FREE PRIORITY U.S. SHIPPING OVER $100",
  "THIRD-PARTY TESTED · CERTIFICATE OF ANALYSIS ON EVERY LOT",
  "FOR IN-VITRO RESEARCH USE ONLY",
]

/**
 * ESP (email service provider) selection — server-side only.
 * Set exactly one key. If none is set, the subscribe route accepts the email
 * and returns success without forwarding anywhere.
 */
export type EspProvider = "omnisend" | "klaviyo" | "none"

export function resolveEsp(): EspProvider {
  if (process.env.OMNISEND_API_KEY) return "omnisend"
  if (process.env.KLAVIYO_API_KEY) return "klaviyo"
  return "none"
}
