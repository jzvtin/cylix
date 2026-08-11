import Link from "next/link"
import Reveal from "@modules/common/components/reveal"

const CtaBand = () => {
  return (
    <section className="relative overflow-hidden bg-gold-500 px-[clamp(18px,5vw,32px)] py-[clamp(48px,8vw,84px)]">
      {/* faint chromatogram motif on the band */}
      <svg
        aria-hidden
        className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.12]"
        viewBox="0 0 800 300"
        preserveAspectRatio="xMidYMid slice"
      >
        <path
          d="M0 230 L160 230 Q180 60 200 230 L320 230 Q340 230 356 150 Q372 230 390 230 L520 230 Q540 230 556 96 Q572 230 590 230 L800 230"
          fill="none"
          stroke="#0D0D0D"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </svg>

      <Reveal>
        <div className="relative mx-auto flex max-w-[860px] flex-col items-center text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-ink/20 bg-ink/5 px-4 py-[7px] font-display text-[11px] font-extrabold uppercase tracking-[1.6px] text-ink/70">
            <span className="inline-block h-[6px] w-[6px] rounded-full bg-ink" />
            Research-grade, verified
          </div>
          <h2 className="mb-5 font-display text-[clamp(32px,6vw,68px)] font-black leading-[0.98] tracking-[-2px] text-ink">
            Know exactly what
            <br />
            you&apos;re getting.
          </h2>
          <p className="mb-9 max-w-[560px] text-[clamp(15px,1.5vw,18px)] leading-[1.65] text-ink/70">
            99%+ purity, third-party tested, with a Certificate of Analysis on
            every batch. Browse the catalog and see the documentation for
            yourself.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/store"
              className="inline-flex items-center gap-2 rounded-[22px] bg-ink px-7 py-[14px] font-display text-sm font-bold text-sand transition-transform duration-200 hover:-translate-y-0.5"
            >
              Browse Catalog →
            </Link>
            <Link
              href="/store"
              className="inline-flex items-center gap-2 rounded-[22px] border border-ink/25 bg-white/40 px-7 py-[14px] font-display text-sm font-bold text-ink transition-colors duration-200 hover:bg-white/70"
            >
              View Products
            </Link>
          </div>
        </div>
      </Reveal>
    </section>
  )
}

export default CtaBand
