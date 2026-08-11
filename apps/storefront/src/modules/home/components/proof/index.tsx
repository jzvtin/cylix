import Reveal from "@modules/common/components/reveal"
import coaData from "../../../../data/coas.json"

// Pull one real Janoshik CoA to make the proof concrete (link is live-verifiable).
// Newest Retatrutide 30mg lot wins for the display sample.
type Coa = { compound: string; mg: number; lot: string; url: string }
const sample: Coa =
  (coaData.coas as Coa[]).find((c) => c.compound === "Retatrutide" && c.mg === 30) ??
  (coaData.coas as Coa[])[0]

// Analytical HPLC trace — a single dominant peak = high purity.
const Chromatogram = () => (
  <svg viewBox="0 0 320 180" className="h-full w-full" aria-label="Sample HPLC chromatogram">
    <rect x="0" y="0" width="320" height="180" rx="10" fill="#F9F7F4" />
    {[45, 90, 135].map((y) => (
      <line key={y} x1="16" y1={y} x2="304" y2={y} stroke="#0D0D0D" strokeOpacity="0.06" strokeWidth="1" />
    ))}
    {/* axes */}
    <line x1="24" y1="150" x2="304" y2="150" stroke="#0D0D0D" strokeOpacity="0.25" strokeWidth="1.2" />
    <line x1="24" y1="20" x2="24" y2="150" stroke="#0D0D0D" strokeOpacity="0.25" strokeWidth="1.2" />
    {/* the main analyte peak + a couple of tiny baseline blips */}
    <path
      d="M24 150 L120 150 Q150 150 158 40 Q166 150 196 150 L232 150 Q240 150 246 128 Q252 150 258 150 L286 150 Q292 150 296 138 Q300 150 304 150"
      fill="none"
      stroke="#C9963A"
      strokeWidth="2.2"
      strokeLinejoin="round"
    />
    <path
      d="M24 150 L120 150 Q150 150 158 40 Q166 150 196 150 Z"
      fill="#C9963A"
      fillOpacity="0.12"
    />
    <text x="158" y="34" textAnchor="middle" className="fill-ink" fontSize="9" fontWeight="700" opacity="0.6">
      99.4%
    </text>
  </svg>
)

const Proof = () => {
  return (
    <section className="border-t border-cream bg-cream px-[clamp(18px,5vw,32px)] py-[clamp(48px,8vw,80px)]">
      <div className="mx-auto grid max-w-[1200px] grid-cols-1 items-center gap-[clamp(28px,5vw,56px)] lg:grid-cols-2">
        {/* The claim */}
        <Reveal>
          <div>
            <div className="mb-[10px] font-display text-[10px] font-extrabold uppercase tracking-[1.4px] text-gold-600">
              The Proof
            </div>
            <h2 className="mb-3 font-display text-[clamp(24px,3.6vw,34px)] font-extrabold leading-[1.1] tracking-[-0.8px] text-ink">
              We don&apos;t say &ldquo;trust us.&rdquo;
              <br />
              We hand you the document.
            </h2>
            <p className="mb-7 max-w-[440px] text-sm leading-[1.75] text-ink/55">
              Every lot is sent to Janoshik Analytical — an independent lab — for
              HPLC identity and purity testing. The Certificate of Analysis lands
              in your inbox with the order. No marketing grade. A number.
            </p>
            <div className="mb-7 flex flex-wrap gap-3">
              {[
                { big: "99%+", small: "Identity purity" },
                { big: "100%", small: "Batches tested" },
                { big: "3rd-party", small: "Independent lab" },
              ].map((s) => (
                <div key={s.small} className="rounded-[14px] border border-cream bg-sand px-5 py-3">
                  <div className="font-display text-[22px] font-black leading-none text-gold-600">{s.big}</div>
                  <div className="mt-1 text-[11px] text-ink/50">{s.small}</div>
                </div>
              ))}
            </div>
            <a
              href={sample.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-[20px] bg-ink px-[22px] py-3 font-display text-[13px] font-bold text-sand transition-transform duration-200 hover:-translate-y-0.5"
            >
              Verify a live CoA →
            </a>
          </div>
        </Reveal>

        {/* The document */}
        <Reveal delay={120}>
          <div className="rounded-[20px] border border-cream bg-white p-[clamp(18px,3vw,26px)] shadow-[0_30px_70px_-40px_rgba(13,13,13,0.4)]">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gold-500 text-[11px] font-bold text-white">
                  ✓
                </span>
                <span className="font-display text-[13px] font-extrabold text-ink">
                  Janoshik Analytical
                </span>
              </div>
              <span className="rounded-full bg-cream px-3 py-1 font-display text-[10px] font-bold uppercase tracking-wide text-ink/55">
                Verified lab
              </span>
            </div>

            <div className="overflow-hidden rounded-[12px] border border-cream">
              <Chromatogram />
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
              {[
                { k: "Compound", v: sample.compound },
                { k: "Strength", v: `${sample.mg} mg` },
                { k: "Lot", v: `#${sample.lot}` },
              ].map((row) => (
                <div key={row.k} className="rounded-[10px] bg-sand px-2 py-2">
                  <div className="text-[9px] font-bold uppercase tracking-wide text-ink/40">{row.k}</div>
                  <div className="mt-[2px] font-display text-xs font-bold text-ink">{row.v}</div>
                </div>
              ))}
            </div>
            <div className="mt-3 text-center text-[10px] text-ink/40">
              Sample of a real third-party CoA. Every order ships with its own.
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export default Proof
