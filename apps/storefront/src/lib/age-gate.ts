// Shared constants for the age / research-use gate.
//
// The gate is enforced CLIENT-SIDE (see modules/common/components/age-gate): the
// overlay reads and writes this cookie via document.cookie, so it MUST be a
// non-httpOnly, first-party cookie. It is intentionally NOT named
// "cx_age_verified" — an earlier build set that name as an httpOnly cookie from
// the server /api route, and once a browser holds an httpOnly cookie of a given
// name, JavaScript can neither read nor overwrite it. That collision made the
// overlay believe the confirmation was always missing and re-show on every
// refresh. Using a distinct name sidesteps any stale httpOnly cookie so the
// confirmation persists for returning visitors.
export const AGE_COOKIE = "cx_age_ok"

// How long a confirmation lasts before the visitor is asked again (30 days).
export const AGE_COOKIE_MAX_AGE = 60 * 60 * 24 * 30

// Research-use categories a visitor must self-identify as. Kept here so the page
// and the API handler validate against the same list.
export const ORG_TYPES = [
  "Academic / Institutional Laboratory",
  "Private / Independent Research",
  "Commercial / Industry Laboratory",
] as const
