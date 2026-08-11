import { HttpTypes } from "@medusajs/types"
import coaData from "../../../../data/coas.json"

export type Coa = {
  compound: string
  mg: number | null
  iu?: number
  lot: string
  url: string
}

type CoaFile = {
  lab: string
  verifyBase: string
  coas: Coa[]
}

const file = coaData as CoaFile

export const COA_LAB = file.lab
export const ALL_COAS: Coa[] = file.coas

/** Strip everything but a-z0-9 so "BPC-157" === "BPC157", "MOTS-C" === "motsc". */
const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "")

/** Pull every "<n>mg" figure out of a blob of text. */
const extractMg = (text: string): number[] => {
  const out: number[] = []
  const re = /(\d+(?:\.\d+)?)\s*mg\b/gi
  let m: RegExpExecArray | null
  while ((m = re.exec(text)) !== null) out.push(parseFloat(m[1]))
  return out
}

/** Newest lot wins — lot numbers are monotonic, so highest numeric value. */
const byNewestLot = (a: Coa, b: Coa) => Number(b.lot) - Number(a.lot)

export type CoaMatch = {
  tier: "exact" | "compound" | "none"
  /** The lot to feature (newest). */
  primary: Coa | null
  /** Lots that share the product's exact dose (incl. primary), newest first. */
  sameDose: Coa[]
  /** All lots for the compound at any dose (incl. sameDose), newest first. */
  allLots: Coa[]
  compound: string | null
}

/**
 * Match a Medusa product to its real Janoshik COAs.
 * Compound name is matched against the product title + description (titles can
 * be coded like "RT3", but the description always names the compound). Dose is
 * read from the variant option values / titles and the product text.
 */
export function matchCoasForProduct(product: HttpTypes.StoreProduct): CoaMatch {
  const text = [
    product.title,
    product.subtitle,
    product.description,
    ...(product.variants?.flatMap((v) => [
      v.title,
      ...(v.options?.map((o) => o.value) ?? []),
    ]) ?? []),
  ]
    .filter(Boolean)
    .join(" ")

  const haystack = normalize(text)
  const productMg = new Set(extractMg(text))

  // Compound matches: the compound name appears in the product text.
  const compoundMatches = ALL_COAS.filter((c) =>
    haystack.includes(normalize(c.compound))
  )

  if (compoundMatches.length === 0) {
    return { tier: "none", primary: null, sameDose: [], allLots: [], compound: null }
  }

  // Pick the single compound whose match is longest/most specific to avoid a
  // short name colliding (e.g. "Glow" vs "KLOW"). Group by compound name.
  const groups = new Map<string, Coa[]>()
  for (const c of compoundMatches) {
    const arr = groups.get(c.compound) ?? []
    arr.push(c)
    groups.set(c.compound, arr)
  }

  // Prefer a group that has an exact dose match; otherwise the one whose
  // normalized name is the longest substring hit.
  let bestName: string | null = null
  let bestScore = -1
  for (const [name, lots] of Array.from(groups.entries())) {
    const hasDose = lots.some((l) => l.mg != null && productMg.has(l.mg))
    const score = normalize(name).length + (hasDose ? 1000 : 0)
    if (score > bestScore) {
      bestScore = score
      bestName = name
    }
  }

  const allLots = (groups.get(bestName!) ?? []).slice().sort(byNewestLot)
  const sameDose = allLots
    .filter((l) => l.mg != null && productMg.has(l.mg))
    .sort(byNewestLot)

  if (sameDose.length > 0) {
    return {
      tier: "exact",
      primary: sameDose[0],
      sameDose,
      allLots,
      compound: bestName,
    }
  }

  return {
    tier: "compound",
    primary: allLots[0] ?? null,
    sameDose: [],
    allLots,
    compound: bestName,
  }
}

/** Group all COAs by compound for the library page, newest lot first in each. */
export function coasByCompound(): { compound: string; lots: Coa[] }[] {
  const groups = new Map<string, Coa[]>()
  for (const c of ALL_COAS) {
    const arr = groups.get(c.compound) ?? []
    arr.push(c)
    groups.set(c.compound, arr)
  }
  return Array.from(groups.entries())
    .map(([compound, lots]) => ({
      compound,
      lots: lots.slice().sort(byNewestLot),
    }))
    .sort((a, b) => a.compound.localeCompare(b.compound))
}

/** Human dose label: "10 mg" or "24 iu". */
export function doseLabel(c: Coa): string {
  if (c.mg != null) return `${c.mg} mg`
  if (c.iu != null) return `${c.iu} iu`
  return ""
}
