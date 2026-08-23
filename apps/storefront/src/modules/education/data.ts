/**
 * Compound reference data for the Cylix Research education / reference library.
 *
 * COMPLIANCE — this is in-vitro laboratory REFERENCE material, not dosing guidance.
 * Entries describe mechanism CLASS, physical characteristics, and handling only.
 * No human/animal dosing, protocols, cycles, or administration instructions.
 * Coded names only for regulated compounds (RT / TZ / SM / Cagri).
 *
 * All copy below is original reference writing.
 */

export type CompoundReference = {
  /** Display code / short name, e.g. "RT" or "BPC-157". */
  code: string
  /** URL slug, e.g. "rt". */
  slug: string
  /** Short reference category / class label. */
  category: string
  /** Approximate molecular weight as a display string (optional). */
  molecularWeight?: string
  /** Molecular formula, when it reads as a clean reference (optional). */
  formula?: string
  /** Physical appearance of the reference material. */
  appearance: string
  /** Solubility characteristics for laboratory reconstitution. */
  solubility: string
  /** Storage & handling guidance for the reference standard. */
  storage: string
  /** 2–4 original sentences, mechanism-class level. No human-use framing. */
  researchSummary: string
  /** Curated vial image basename under /products/web, if one exists. */
  image?: string
  /** Typical reconstitution reference defaults (lab math only, not a dose). */
  reconstitution: {
    /** Typical vial content in milligrams. */
    vialMg: number
    /** Suggested bacteriostatic water volume in millilitres. */
    bacWaterMl: number
  }
}

export const COMPOUNDS: CompoundReference[] = [
  {
    code: "BPC-157",
    slug: "bpc-157",
    category: "Compound reference standard",
    molecularWeight: "≈ 1419.5 g/mol",
    formula: "C62H98N16O22",
    appearance: "White to off-white lyophilized powder.",
    solubility: "Readily soluble in sterile or bacteriostatic water; also soluble in dilute acetic acid.",
    storage:
      "Store lyophilized powder at −20 °C, protected from light and moisture. Once reconstituted, hold at 2–8 °C and minimise freeze–thaw cycles.",
    researchSummary:
      "BPC-157 is a synthetic 15-amino-acid compound reference standard derived from a gastric protein fragment. In the in-vitro literature it is characterised for its stability in aqueous solution and its interaction with cytoprotective and angiogenic signalling pathways. It is supplied here purely as an analytical reference material for laboratory characterisation work.",
    image: "bpc-157",
    reconstitution: { vialMg: 5, bacWaterMl: 2 },
  },
  {
    code: "TB-500",
    slug: "tb-500",
    category: "Compound reference standard",
    molecularWeight: "≈ 4963 g/mol",
    formula: "C212H350N56O78S",
    appearance: "White lyophilized powder.",
    solubility: "Highly soluble in sterile or bacteriostatic water; hydrophilic and stable once dissolved.",
    storage:
      "Store lyophilized at −20 °C in a desiccated, light-protected environment. Reconstituted solution is held at 2–8 °C.",
    researchSummary:
      "TB-500 is a synthetic compound reference standard corresponding to the active region of a naturally occurring actin-binding protein. It is studied in vitro for its role in actin sequestration and cell-migration signalling models. Cylix supplies it strictly as a laboratory reference standard for analytical and research characterisation.",
    reconstitution: { vialMg: 5, bacWaterMl: 2 },
  },
  {
    code: "GHK-Cu",
    slug: "ghk-cu",
    category: "Copper-compound reference standard",
    molecularWeight: "≈ 403.9 g/mol",
    formula: "C14H24CuN6O4",
    appearance: "Blue to blue-violet lyophilized powder (copper complex).",
    solubility: "Soluble in sterile or bacteriostatic water; the characteristic blue colour confirms the copper complex.",
    storage:
      "Store lyophilized at −20 °C, protected from light. Keep reconstituted solution at 2–8 °C and avoid prolonged light exposure.",
    researchSummary:
      "GHK-Cu is a naturally occurring copper-binding compound complex used as a reference standard in matrix-remodelling and copper-transport research models. In vitro it is characterised for its high affinity for copper(II) and its interaction with extracellular-matrix signalling pathways. It is provided as an analytical reference material only.",
    image: "ghk-cu",
    reconstitution: { vialMg: 50, bacWaterMl: 5 },
  },
  {
    code: "NAD+",
    slug: "nad",
    category: "Coenzyme reference standard",
    molecularWeight: "≈ 663.4 g/mol",
    formula: "C21H27N7O14P2",
    appearance: "White to pale-cream lyophilized powder.",
    solubility: "Freely soluble in water; solutions are prepared fresh due to sensitivity to heat and pH.",
    storage:
      "Store lyophilized at −20 °C, desiccated and light-protected. Reconstituted solution is unstable at room temperature — hold cold and use promptly.",
    researchSummary:
      "NAD+ (nicotinamide adenine dinucleotide) is a fundamental redox coenzyme supplied as a reference standard for cellular-metabolism and enzymology research. In vitro it is central to electron-transfer chemistry and serves as a co-substrate in a broad range of oxidoreductase assays. It is offered exclusively as a laboratory reference material.",
    image: "nad",
    reconstitution: { vialMg: 100, bacWaterMl: 5 },
  },
  {
    code: "Tesamorelin",
    slug: "tesamorelin",
    category: "Releasing-factor reference standard",
    molecularWeight: "≈ 5136 g/mol",
    formula: "C221H366N72O67S",
    appearance: "White lyophilized powder.",
    solubility: "Soluble in sterile or bacteriostatic water; handle gently to preserve the compound structure.",
    storage:
      "Store lyophilized at −20 °C, protected from light and moisture. Keep reconstituted solution at 2–8 °C and limit freeze–thaw cycles.",
    researchSummary:
      "Tesamorelin is a stabilised releasing-factor compound reference standard belonging to the growth-hormone-releasing-hormone analogue class. In vitro it is characterised for its receptor-binding profile and its enhanced resistance to enzymatic degradation relative to the native sequence. Cylix supplies it as an analytical reference standard for laboratory research only.",
    image: "tesamorelin",
    reconstitution: { vialMg: 10, bacWaterMl: 2 },
  },
  {
    code: "MOTS-C",
    slug: "mots-c",
    category: "Mitochondrial compound reference standard",
    molecularWeight: "≈ 2174.6 g/mol",
    formula: "C101H152N28O22S2",
    appearance: "White lyophilized powder.",
    solubility: "Soluble in sterile or bacteriostatic water; hydrophilic and readily dissolved.",
    storage:
      "Store lyophilized at −20 °C, desiccated and light-protected. Reconstituted solution is held at 2–8 °C.",
    researchSummary:
      "MOTS-C is a mitochondrial-derived compound reference standard studied in vitro for its role in homeostasis and AMPK-related signalling models. It is characterised in the literature as a regulator of cellular energy-sensing pathways. It is supplied purely as an analytical reference material for research characterisation.",
    reconstitution: { vialMg: 10, bacWaterMl: 2 },
  },
  {
    code: "RT",
    slug: "rt",
    category: "Triple-receptor reference standard",
    molecularWeight: "≈ 4731 g/mol",
    appearance: "White to off-white lyophilized powder.",
    solubility: "Soluble in sterile or bacteriostatic water; prepare solutions gently to preserve structure.",
    storage:
      "Store lyophilized at −20 °C, protected from light and moisture. Keep reconstituted solution refrigerated at 2–8 °C and avoid repeated freeze–thaw.",
    researchSummary:
      "RT is a synthetic multi-agonist compound reference standard in the triple receptor agonist class. In vitro it is characterised as a reference material for receptor-binding and signalling assays involving three complementary receptor targets. Cylix supplies RT strictly as an analytical reference standard for in-vitro laboratory research — it is not for human or animal use.",
    image: "rt",
    reconstitution: { vialMg: 10, bacWaterMl: 2 },
  },
  {
    code: "TZ",
    slug: "tz",
    category: "Dual-receptor reference standard",
    molecularWeight: "≈ 4813.5 g/mol",
    appearance: "White to off-white lyophilized powder.",
    solubility: "Soluble in sterile or bacteriostatic water; handle gently during reconstitution.",
    storage:
      "Store lyophilized at −20 °C, desiccated and light-protected. Reconstituted solution is held at 2–8 °C with minimal freeze–thaw.",
    researchSummary:
      "TZ is a synthetic dual-agonist compound reference standard in the dual receptor agonist class. It is used in vitro as a reference material for receptor-binding characterisation and signalling research across two receptor targets. Cylix supplies TZ solely as an analytical reference standard for in-vitro laboratory research.",
    image: "tz",
    reconstitution: { vialMg: 10, bacWaterMl: 2 },
  },
  {
    code: "SM",
    slug: "sm",
    category: "Single-receptor reference standard",
    molecularWeight: "≈ 4113.6 g/mol",
    appearance: "White to off-white lyophilized powder.",
    solubility: "Soluble in sterile or bacteriostatic water; prepare fresh working solutions as needed.",
    storage:
      "Store lyophilized at −20 °C, protected from light and moisture. Keep reconstituted solution at 2–8 °C and limit freeze–thaw cycles.",
    researchSummary:
      "SM is a synthetic single-agonist compound reference standard in the receptor agonist class. In vitro it serves as a reference material for receptor-binding and signalling assays at a single receptor target. Cylix supplies SM exclusively as an analytical reference standard for in-vitro laboratory research.",
    reconstitution: { vialMg: 5, bacWaterMl: 2 },
  },
  {
    code: "Cagri",
    slug: "cagri",
    category: "Amylin-analogue reference standard",
    molecularWeight: "≈ 3752 g/mol",
    appearance: "White lyophilized powder.",
    solubility: "Soluble in sterile or bacteriostatic water; handle gently to preserve the compound.",
    storage:
      "Store lyophilized at −20 °C, desiccated and light-protected. Reconstituted solution is held at 2–8 °C.",
    researchSummary:
      "Cagri is a long-acting amylin-analogue compound reference standard studied in vitro for its receptor-binding profile within the amylin-signalling class. It is characterised as a reference material for signalling and receptor-affinity research. Cylix supplies Cagri as an analytical reference standard for in-vitro laboratory research only.",
    reconstitution: { vialMg: 5, bacWaterMl: 2 },
  },
  {
    code: "KLOW",
    slug: "klow",
    category: "Compound-blend reference standard",
    appearance: "White to off-white lyophilized powder (multi-compound blend).",
    solubility: "Soluble in sterile or bacteriostatic water; the combined compounds dissolve readily.",
    storage:
      "Store lyophilized at −20 °C, protected from light and moisture. Keep reconstituted solution at 2–8 °C and minimise freeze–thaw cycles.",
    researchSummary:
      "KLOW is a multi-compound reference blend combining several regenerative-signalling reference standards into a single characterisation matrix. It is used in vitro as a convenience reference for laboratories studying combined matrix-remodelling and repair-signalling models. It is supplied strictly as an analytical reference material.",
    image: "klow",
    reconstitution: { vialMg: 70, bacWaterMl: 5 },
  },
  {
    code: "Glow",
    slug: "glow",
    category: "Compound-blend reference standard",
    appearance: "White to off-white lyophilized powder (multi-compound blend).",
    solubility: "Soluble in sterile or bacteriostatic water; dissolves readily into a clear solution.",
    storage:
      "Store lyophilized at −20 °C, desiccated and light-protected. Reconstituted solution is held at 2–8 °C.",
    researchSummary:
      "Glow is a multi-compound reference blend pairing a copper-compound reference standard with regenerative-signalling compounds for combined in-vitro study. It is characterised as a convenience reference matrix for matrix-remodelling and extracellular-signalling research. Cylix supplies it purely as an analytical reference material.",
    image: "glow",
    reconstitution: { vialMg: 70, bacWaterMl: 5 },
  },
]

export function getCompound(slug: string): CompoundReference | undefined {
  return COMPOUNDS.find((c) => c.slug === slug)
}

/** Related references: same category first, then fill from the rest. */
export function relatedCompounds(
  slug: string,
  limit = 3
): CompoundReference[] {
  const current = getCompound(slug)
  if (!current) {
    return COMPOUNDS.slice(0, limit)
  }
  const sameCategory = COMPOUNDS.filter(
    (c) => c.slug !== slug && c.category === current.category
  )
  const rest = COMPOUNDS.filter(
    (c) => c.slug !== slug && c.category !== current.category
  )
  return [...sameCategory, ...rest].slice(0, limit)
}
