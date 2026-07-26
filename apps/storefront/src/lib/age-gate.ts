// Shared constants for the age / research-use gate. The confirmation is kept in
// an httpOnly cookie that the middleware checks on every storefront request, so
// the gate is enforced on the server and cannot be bypassed by disabling JS.
export const AGE_COOKIE = "cx_age_verified"

// How long a confirmation lasts before the visitor is asked again (30 days).
export const AGE_COOKIE_MAX_AGE = 60 * 60 * 24 * 30

// Research-use categories a visitor must self-identify as. Kept here so the page
// and the API handler validate against the same list.
export const ORG_TYPES = [
  "Academic / Institutional Laboratory",
  "Private / Independent Research",
  "Commercial / Industry Laboratory",
] as const
