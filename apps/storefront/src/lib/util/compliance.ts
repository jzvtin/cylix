/**
 * Customer-facing compliance sanitizer.
 *
 * The ad domain must NEVER render the banned compound names (GLP / Retatrutide
 * / Tirzepatide / Semaglutide / Cagrilintide) — not even when they still linger
 * in the live Medusa DB (e.g. a product description that predates the coded
 * rename). This is the last line of defence: run any backend-sourced text that
 * reaches the browser through `sanitizeCompliance()` so a stale DB row can never
 * leak a banned term into visible copy, metadata, or alt text.
 *
 * Order matters — longer / more specific patterns first.
 */
const REPLACEMENTS: Array<[RegExp, string]> = [
  [/retatrutide/gi, "RT"],
  [/tirzepatide/gi, "TZ"],
  [/semaglutide/gi, "SM"],
  [/cagrilintide/gi, "Cagri"],
  // receptor-class phrasing that embeds the banned class name
  [/glp-?1\s*\/\s*gip/gi, "dual receptor"],
  [/gip\s*\/\s*glp-?1/gi, "dual receptor"],
  [/glp-?1/gi, "receptor"],
  [/\bglp\b/gi, "receptor"],
]

export function sanitizeCompliance<T extends string | null | undefined>(
  input: T
): T {
  if (!input) return input
  let out = String(input)
  for (const [re, rep] of REPLACEMENTS) out = out.replace(re, rep)
  // tidy any doubled spaces / stray separators the swap may leave behind
  return out.replace(/\s{2,}/g, " ").trim() as T
}
