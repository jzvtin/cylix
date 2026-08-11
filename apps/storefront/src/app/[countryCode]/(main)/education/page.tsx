import { Metadata } from "next"
import Reveal from "@modules/common/components/reveal"
import { COMPOUNDS } from "@modules/education/data"
import CompoundGrid from "@modules/education/compound-grid"
import ReconstitutionCalculator from "@modules/education/reconstitution-calculator"
import DisclaimerBand from "@modules/education/disclaimer-band"

export const metadata: Metadata = {
  title: "Research Library | Cylix Research",
  description:
    "Reference standards, explained. Molecular weight, appearance, solubility, storage and handling context for Cylix Research in-vitro reference materials. Research use only.",
}

const HANDLING = [
  {
    t: "Lyophilized on arrival",
    d: "Reference standards ship as a dry, freeze-dried powder. Kept dry and cold, the lyophilized form is stable and travel-tolerant.",
  },
  {
    t: "Cold, dark, dry storage",
    d: "Hold unopened powder at −20 °C, protected from light and moisture. A desiccated freezer environment preserves long-term integrity.",
  },
  {
    t: "Reconstituted stability",
    d: "Once dissolved, hold solutions at 2–8 °C and minimise freeze–thaw cycles. Prepare only what a given experiment requires.",
  },
  {
    t: "Third-party verified",
    d: "Every lot is characterised by an independent laboratory for identity and purity. The Certificate of Analysis is the source of truth for a vial.",
  },
]

export default function EducationPage() {
  return (
    <div className="relative">
      {/* HERO */}
      <div className="content-container pt-14 pb-8 text-center sm:pt-20">
        <span className="cx-eyebrow">Research Library</span>
        <h1 className="cx-h mx-auto mt-5 max-w-[16ch] text-[clamp(34px,6.5vw,60px)]">
          Know your <em>reference standards</em>.
        </h1>
        <p className="mx-auto mt-4 max-w-[520px] text-[15px] leading-relaxed text-ink/55">
          Molecular characteristics, appearance, solubility and handling for
          every Cylix reference material — written for the laboratory, framed for
          in-vitro research only.
        </p>
      </div>

      <div className="mx-auto max-w-[1120px] px-5 pb-24 sm:px-8">
        {/* DISCLAIMER (prominent, above the fold of content) */}
        <Reveal>
          <div className="mb-12">
            <DisclaimerBand />
          </div>
        </Reveal>

        {/* GRID */}
        <Reveal>
          <div className="mb-4 flex items-center gap-3">
            <span className="font-display text-[11px] font-extrabold uppercase tracking-[1.4px] text-gold-700">
              Reference index
            </span>
            <span className="h-px flex-1 bg-gold-300/40" />
            <span className="font-display text-[11px] font-bold text-ink/35">
              {COMPOUNDS.length} standards
            </span>
          </div>
          <CompoundGrid compounds={COMPOUNDS} />
        </Reveal>

        {/* HANDLING & STORAGE STRIP */}
        <Reveal>
          <section className="mt-20">
            <div className="mb-6 text-center">
              <span className="cx-eyebrow">Handling &amp; storage</span>
              <h2 className="cx-h mt-3 text-[clamp(24px,4vw,38px)]">
                Treat it like <em>lab-grade material</em>.
              </h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {HANDLING.map((h) => (
                <div key={h.t} className="cx-card rounded-2xl p-5">
                  <div className="mb-2 font-display text-[14px] font-extrabold tracking-[-0.2px] text-ink">
                    {h.t}
                  </div>
                  <p className="m-0 text-[12.5px] leading-[1.7] text-ink/55">
                    {h.d}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </Reveal>

        {/* RECONSTITUTION CALCULATOR */}
        <Reveal>
          <section id="calculator" className="mt-20 scroll-mt-24">
            <div className="mb-6 text-center">
              <span className="cx-eyebrow">Lab tools</span>
              <h2 className="cx-h mt-3 text-[clamp(24px,4vw,38px)]">
                Do the <em>reconstitution math</em>.
              </h2>
              <p className="mx-auto mt-3 max-w-[480px] text-[13.5px] leading-relaxed text-ink/55">
                A neutral unit-to-volume converter for preparing reference
                solutions. Math only — never a dose or a recommendation.
              </p>
            </div>
            <div className="mx-auto max-w-[640px]">
              <ReconstitutionCalculator />
            </div>
          </section>
        </Reveal>

        {/* CLOSING DISCLAIMER */}
        <Reveal>
          <div className="mt-20">
            <DisclaimerBand />
          </div>
        </Reveal>
      </div>
    </div>
  )
}
