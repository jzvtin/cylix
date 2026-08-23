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
  // receptor-class phrasing that embeds the banned class name. The combined
  // forms are dropped entirely (the surrounding copy already says "dual/triple
  // receptor agonist"), leaving a clean sentence after the space tidy below.
  [/glp-?1\s*\/\s*gip\s*/gi, ""],
  [/gip\s*\/\s*glp-?1\s*/gi, ""],
  [/glp-?1/gi, "receptor"],
  [/\bglp\b/gi, "receptor"],
  // Category-language scrub: drop "metabolic" and "tissue" wholesale (with any
  // trailing hyphen/space so "metabolic-receptor" → "receptor" and
  // "tissue-repair" → "repair"), and swap the flagged word "peptide" for the
  // neutral "compound". Case-specific entries preserve the original casing.
  [/metabolic[-\s]?/gi, ""],
  [/metabolism/gi, "activity"],
  [/tissues?[-\s]?/gi, ""],
  [/Peptides/g, "Compounds"],
  [/peptides/g, "compounds"],
  [/Peptide/g, "Compound"],
  [/peptide/g, "compound"],
  [/PEPTIDE/g, "COMPOUND"],
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
