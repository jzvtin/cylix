import Image from "next/image"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Reveal from "@modules/common/components/reveal"

// Single, easily-swappable hero image. A photoreal render will be dropped in at
// this same src later — keep it ONE full-bleed image (no floating cutouts).
const HERO_IMAGE = "/hero/photo/hero-web.jpg"

// The 3-stat row under the CTA.
const STATS = [
  { big: "99%+", label: "Tested Purity" },
  { big: "100%", label: "Third-Party Verified" },
  { big: "12–24h", label: "Dispatch" },
]

// Full-width trust marquee below the hero.
const MARQUEE = [
  "Third-Party Tested",
  "2–3 Day Shipping",
  "Secure Checkout",
  "Free Shipping",
  "99%+ Purity · COA-Verified",
]

const Hero = () => {
  return (
    <section className="relative w-full overflow-hidden bg-cream">
      {/* keyframes for the trust marquee — RSC-safe inline style, reduced-motion aware */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
@keyframes cylix-marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
.cylix-marquee-track { animation: cylix-marquee 32s linear infinite; }
@media (prefers-reduced-motion: reduce) { .cylix-marquee-track { animation: none; } }
`,
        }}
      />

      {/* SPLIT HERO */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr]">
        {/* LEFT — statement */}
        <div className="relative z-[1] flex flex-col justify-center bg-cream px-[clamp(22px,6vw,72px)] py-[clamp(48px,8vw,104px)]">
          {/* faint gold glow bleeding from the seam */}
          <div
            aria-hidden
            className="pointer-events-none absolute right-[-120px] top-1/2 hidden h-[520px] w-[520px] -translate-y-1/2 rounded-full lg:block"
            style={{
              background:
                "radial-gradient(circle, rgba(201,150,58,0.18) 0%, rgba(201,150,58,0) 68%)",
            }}
          />

          <Reveal>
            <div className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-gold-500/35 bg-gold-50 px-4 py-[7px] font-display text-[11px] font-extrabold uppercase tracking-[1.6px] text-gold-700">
              <span className="inline-block h-[6px] w-[6px] rounded-full bg-gold-500" />
              Research-Grade Compounds
            </div>
          </Reveal>

          <Reveal delay={80}>
            <h1 className="mb-6 max-w-[13ch] font-display text-[clamp(44px,8vw,92px)] font-black leading-[0.94] tracking-[-2.5px] text-ink">
              Compounds you
              <br />
              can <span className="text-gold-500">verify.</span>
            </h1>
          </Reveal>

          <Reveal delay={160}>
            <p className="mb-9 max-w-[440px] text-[clamp(15px,1.4vw,18px)] leading-[1.65] text-ink/60">
              Every lot is HPLC-tested by an independent lab. A Certificate of
              Analysis ships with your order — the document, not a promise.
            </p>
          </Reveal>

          <Reveal delay={240}>
            <div className="mb-12 flex flex-wrap items-center gap-3">
              <LocalizedClientLink
                href="/store"
                className="inline-flex items-center gap-2 rounded-full bg-ink px-8 py-[15px] font-display text-[15px] font-bold text-sand shadow-[0_18px_36px_-16px_rgba(13,13,13,0.6)] transition-transform duration-200 hover:-translate-y-0.5"
              >
                Browse Catalog
                <span aria-hidden>→</span>
              </LocalizedClientLink>
              <LocalizedClientLink
                href="/store"
                className="inline-flex items-center gap-2 rounded-full border border-ink/15 bg-white px-8 py-[15px] font-display text-[15px] font-bold text-ink transition-colors duration-200 hover:border-gold-500 hover:text-gold-700"
              >
                See a live CoA
              </LocalizedClientLink>
            </div>
          </Reveal>

          {/* 3-STAT ROW */}
          <Reveal delay={320}>
            <div className="grid max-w-[560px] grid-cols-3 gap-[clamp(8px,2vw,28px)] border-t border-cream pt-8">
              {STATS.map((s) => (
                <div key={s.label}>
                  <div className="font-display text-[clamp(26px,3.4vw,40px)] font-black leading-none tracking-[-1px] text-gold-600">
                    {s.big}
                  </div>
                  <div className="mt-2 text-[clamp(10px,1vw,13px)] font-semibold leading-tight text-ink/55">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        {/* RIGHT — full-bleed photographic panel */}
        <div className="relative min-h-[clamp(360px,58vw,680px)] overflow-hidden bg-ink">
          {/* gold glow behind the subject */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-[1]"
            style={{
              background:
                "radial-gradient(120% 90% at 50% 42%, rgba(201,150,58,0.34) 0%, rgba(201,150,58,0.08) 45%, rgba(13,13,13,0) 72%)",
            }}
          />
          <Image
            src={HERO_IMAGE}
            alt="Cylix Research compound vials"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 48vw"
            className="z-[2] object-cover"
          />
          {/* seam gradient so the image blends into the cream panel on desktop */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-0 z-[3] hidden w-[22%] lg:block"
            style={{
              background:
                "linear-gradient(to right, rgba(232,228,222,0.9) 0%, rgba(232,228,222,0) 100%)",
            }}
          />
          {/* bottom vignette for depth */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 z-[3] h-1/3"
            style={{
              background:
                "linear-gradient(to top, rgba(13,13,13,0.28) 0%, rgba(13,13,13,0) 100%)",
            }}
          />
        </div>
      </div>

      {/* FULL-WIDTH TRUST MARQUEE */}
      <div className="relative overflow-hidden border-y border-cream bg-ink py-[14px]">
        <div className="cylix-marquee-track flex w-max items-center whitespace-nowrap">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex items-center" aria-hidden={copy === 1}>
              {MARQUEE.map((item) => (
                <span
                  key={`${copy}-${item}`}
                  className="flex items-center gap-4 px-7 font-display text-[13px] font-bold uppercase tracking-[1.4px] text-sand/85"
                >
                  {item}
                  <span className="text-gold-500">◆</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Hero
