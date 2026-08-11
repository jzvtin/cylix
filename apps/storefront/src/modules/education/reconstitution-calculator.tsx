"use client"

import React, { useMemo, useState } from "react"

/**
 * Reconstitution math helper — NEUTRAL LABORATORY MATH ONLY.
 *
 * Given a peptide amount (mg), a bacteriostatic-water volume (mL) and a desired
 * draw, it reports the resulting concentration and the corresponding mark on a
 * standard 100-unit ("U-100") insulin syringe. This is a units→mL conversion,
 * NOT a dosing recommendation. Outputs are labelled "for reconstitution math
 * only" throughout.
 */

type DrawMode = "mcg" | "units"

const UNITS_PER_ML = 100 // standard U-100 insulin syringe

function fmt(n: number, digits = 2): string {
  if (!isFinite(n) || isNaN(n)) {
    return "—"
  }
  return n.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: digits,
  })
}

type Props = {
  /** Optional starting values (e.g. a compound's reference defaults). */
  defaultVialMg?: number
  defaultBacWaterMl?: number
  /** Compound code, shown as context only. */
  code?: string
}

const ReconstitutionCalculator = ({
  defaultVialMg = 10,
  defaultBacWaterMl = 2,
  code,
}: Props) => {
  const [vialMg, setVialMg] = useState<string>(String(defaultVialMg))
  const [bacWaterMl, setBacWaterMl] = useState<string>(String(defaultBacWaterMl))
  const [drawMode, setDrawMode] = useState<DrawMode>("mcg")
  const [draw, setDraw] = useState<string>("250")

  const mg = parseFloat(vialMg)
  const ml = parseFloat(bacWaterMl)
  const drawVal = parseFloat(draw)

  const result = useMemo(() => {
    const validBase = mg > 0 && ml > 0
    if (!validBase) {
      return null
    }
    const mgPerMl = mg / ml // concentration (mg/mL)
    const mcgPerMl = mgPerMl * 1000
    const mcgPerUnit = mcgPerMl / UNITS_PER_ML // µg per syringe unit

    let drawMcg = NaN
    let drawUnits = NaN
    let drawMl = NaN

    if (drawVal > 0) {
      if (drawMode === "mcg") {
        drawMcg = drawVal
        drawMl = drawMcg / mcgPerMl
        drawUnits = drawMl * UNITS_PER_ML
      } else {
        drawUnits = drawVal
        drawMl = drawUnits / UNITS_PER_ML
        drawMcg = drawMl * mcgPerMl
      }
    }

    return { mgPerMl, mcgPerMl, mcgPerUnit, drawMcg, drawUnits, drawMl }
  }, [mg, ml, drawVal, drawMode])

  const inputClass =
    "w-full rounded-xl border border-cream bg-white/70 px-4 py-3 font-display text-[16px] font-bold text-ink outline-none transition-colors focus:border-gold-400 focus:ring-2 focus:ring-gold-200"

  const labelClass =
    "mb-2 block font-display text-[11px] font-extrabold uppercase tracking-[1px] text-ink/60"

  return (
    <div className="cx-glass rounded-[24px] p-6 sm:p-8">
      <div className="mb-6">
        <span className="cx-eyebrow">Reconstitution math</span>
        <h3 className="cx-h mt-3 text-[clamp(22px,3.5vw,30px)]">
          Reconstitution <em>calculator</em>
        </h3>
        <p className="mt-2 max-w-[46ch] text-[13.5px] leading-relaxed text-ink/55">
          Neutral units-to-volume math for preparing a laboratory reference
          solution{code ? ` of ${code}` : ""}. For reconstitution math only —
          this is not a dose or a usage recommendation.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="rc-mg" className={labelClass}>
            Peptide amount (mg)
          </label>
          <input
            id="rc-mg"
            type="number"
            inputMode="decimal"
            min="0"
            step="any"
            value={vialMg}
            onChange={(e) => setVialMg(e.target.value)}
            className={inputClass}
            aria-describedby="rc-mg-hint"
          />
          <span id="rc-mg-hint" className="mt-1 block text-[11px] text-ink/40">
            Total milligrams in the vial.
          </span>
        </div>

        <div>
          <label htmlFor="rc-ml" className={labelClass}>
            Bacteriostatic water (mL)
          </label>
          <input
            id="rc-ml"
            type="number"
            inputMode="decimal"
            min="0"
            step="any"
            value={bacWaterMl}
            onChange={(e) => setBacWaterMl(e.target.value)}
            className={inputClass}
            aria-describedby="rc-ml-hint"
          />
          <span id="rc-ml-hint" className="mt-1 block text-[11px] text-ink/40">
            Volume of solvent added.
          </span>
        </div>
      </div>

      {/* Concentration output */}
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-cream bg-gold-50/60 px-5 py-4">
          <div className="font-display text-[10px] font-extrabold uppercase tracking-[1px] text-gold-700">
            Concentration
          </div>
          <div className="mt-1 font-display text-[26px] font-black leading-none text-ink">
            {result ? fmt(result.mgPerMl, 3) : "—"}
            <span className="ml-1 text-[13px] font-bold text-ink/50">mg/mL</span>
          </div>
          <div className="mt-1 text-[11.5px] text-ink/45">
            {result ? `${fmt(result.mcgPerMl, 0)} µg/mL` : "—"}
          </div>
        </div>
        <div className="rounded-2xl border border-cream bg-white/70 px-5 py-4">
          <div className="font-display text-[10px] font-extrabold uppercase tracking-[1px] text-ink/55">
            Per syringe unit
          </div>
          <div className="mt-1 font-display text-[26px] font-black leading-none text-ink">
            {result ? fmt(result.mcgPerUnit, 2) : "—"}
            <span className="ml-1 text-[13px] font-bold text-ink/50">µg / unit</span>
          </div>
          <div className="mt-1 text-[11.5px] text-ink/45">
            On a 100-unit (U-100) syringe.
          </div>
        </div>
      </div>

      {/* Draw conversion */}
      <div className="mt-6 rounded-2xl border border-cream bg-white/50 p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <label htmlFor="rc-draw" className="font-display text-[12px] font-extrabold uppercase tracking-[1px] text-ink/60">
            Convert a draw
          </label>
          <div className="inline-flex rounded-full border border-cream bg-white/70 p-1" role="group" aria-label="Draw units">
            {(["mcg", "units"] as DrawMode[]).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setDrawMode(m)}
                aria-pressed={drawMode === m}
                className={`rounded-full px-3.5 py-1.5 font-display text-[11px] font-bold uppercase tracking-[0.5px] transition-colors ${
                  drawMode === m
                    ? "bg-ink text-cream"
                    : "text-ink/50 hover:text-ink"
                }`}
              >
                {m === "mcg" ? "µg" : "Units"}
              </button>
            ))}
          </div>
        </div>

        <input
          id="rc-draw"
          type="number"
          inputMode="decimal"
          min="0"
          step="any"
          value={draw}
          onChange={(e) => setDraw(e.target.value)}
          className={inputClass}
          aria-label={drawMode === "mcg" ? "Draw amount in micrograms" : "Draw amount in units"}
        />

        <div className="mt-4 grid grid-cols-3 gap-3 text-center">
          <div>
            <div className="font-display text-[19px] font-black text-ink">
              {result ? fmt(result.drawMcg, 1) : "—"}
            </div>
            <div className="text-[10.5px] uppercase tracking-[0.5px] text-ink/45">µg</div>
          </div>
          <div>
            <div className="font-display text-[19px] font-black text-gold-700">
              {result ? fmt(result.drawUnits, 1) : "—"}
            </div>
            <div className="text-[10.5px] uppercase tracking-[0.5px] text-ink/45">units</div>
          </div>
          <div>
            <div className="font-display text-[19px] font-black text-ink">
              {result ? fmt(result.drawMl, 3) : "—"}
            </div>
            <div className="text-[10.5px] uppercase tracking-[0.5px] text-ink/45">mL</div>
          </div>
        </div>
      </div>

      <p className="mt-5 text-[11.5px] leading-relaxed text-ink/45">
        For reconstitution math only. These figures are a neutral unit
        conversion for preparing laboratory reference solutions and are not a
        dose, protocol, or recommendation for use in humans or animals. All
        materials are for in-vitro research use only.
      </p>
    </div>
  )
}

export default ReconstitutionCalculator
