import { Metadata } from "next"
import Image from "next/image"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Reveal from "@modules/common/components/reveal"
import FeaturedGrid from "@modules/home/components/featured-grid"
import { getRegion } from "@lib/data/regions"

export const metadata: Metadata = {
  title: "Cylix Research | Research-Grade Materials, Third-Party Tested",
  description:
    "Cylix Research supplies high-purity research materials with a Certificate of Analysis on every batch — third-party tested, clearly documented.",
}

const CONTAINER = "mx-auto w-full max-w-[1200px] px-4 md:px-8"

/* Reusable inline icons (gold stroke) for the trust + why sections. */
const IconBeaker = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="h-full w-full">
    <path d="M9 3h6M10 3v6L5.5 17.5A2 2 0 0 0 7.2 20.5h9.6a2 2 0 0 0 1.7-3L14 9V3" />
    <path d="M8 14h8" />
  </svg>
)
const IconShield = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="h-full w-full">
    <path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3Z" />
    <path d="M9 12l2 2 4-4" />
  </svg>
)
const IconDoc = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="h-full w-full">
    <path d="M7 3h7l4 4v14a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" />
    <path d="M14 3v4h4M9 12h6M9 16h6" />
  </svg>
)

const TRUST = [
  { Icon: IconBeaker, label: "Research grade", sub: "Premium materials" },
  { Icon: IconShield, label: "Third-party tested", sub: "Every batch" },
  { Icon: IconDoc, label: "Transparent", sub: "Batch documentation" },
]

const WHY = [
  {
    Icon: IconDoc,
    title: "Documentation first",
    desc: "A Certificate of Analysis is available for our batches, with third-party testing on file.",
  },
  {
    Icon: IconBeaker,
    title: "Research-grade purity",
    desc: "High-purity compounds, independently tested for identity and concentration.",
  },
  {
    Icon: IconShield,
    title: "Dependable fulfillment",
    desc: "Free priority U.S. shipping on orders over $100, with responsive support.",
  },
]

export default async function Home(props: {
  params: Promise<{ countryCode: string }>
}) {
  const { countryCode } = await props.params
  const region = await getRegion(countryCode)
  if (!region) return null

  return (
    <>
      {/* ── a. HERO ───────────────────────────────────────────── */}
      <section className="relative isolate overflow-hidden bg-[#f6f1e9]">
        <div className="absolute inset-0 -z-10">
          <Image
            src="/hero/photo/hero-web.jpg"
            alt="Cylix Research materials"
            fill
            priority
            sizes="100vw"
            className="object-cover object-right-bottom"
          />
          {/* left legibility scrim */}
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(90deg, #f6f1e9 0%, rgba(246,241,233,0.92) 34%, rgba(246,241,233,0.45) 58%, rgba(246,241,233,0) 80%)",
            }}
          />
          {/* top + bottom scrims to blend into the canvas */}
          <div aria-hidden className="absolute inset-x-0 top-0 h-28" style={{ background: "linear-gradient(#f6f1e9, rgba(246,241,233,0))" }} />
          <div aria-hidden className="absolute inset-x-0 bottom-0 h-40" style={{ background: "linear-gradient(rgba(246,241,233,0), #f6f1e9)" }} />
        </div>

        <div className={`${CONTAINER} flex min-h-[clamp(520px,74vh,700px)] items-center py-16 md:py-24`}>
          <div className="max-w-[600px]">
            <Reveal>
              <span className="inline-flex items-center rounded-full border border-ink/25 px-3.5 py-1.5 font-ui text-[11px] font-bold uppercase tracking-[2px] text-ink/60">
                Research Materials
              </span>
            </Reveal>
            <Reveal delay={80}>
              <h1 className="mt-5 font-display text-[clamp(34px,9vw,54px)] font-extrabold leading-[1.02] tracking-[-0.02em] text-ink-800">
                Advance your
                <br />
                research with
                <br />
                confidence.
              </h1>
            </Reveal>
            <Reveal delay={160}>
              <p className="mt-5 max-w-[440px] text-[clamp(15px,1.5vw,17px)] leading-[1.6] text-ink/60">
                Cylix Research supplies high-purity research materials and
                reconstitution solutions — third-party tested, with clear
                documentation.
              </p>
            </Reveal>
            <Reveal delay={240}>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <LocalizedClientLink
                  href="/store"
                  className="inline-flex h-12 items-center gap-2 rounded-xl bg-[#171717] px-6 font-ui text-[15px] font-semibold text-white transition-transform duration-200 hover:-translate-y-0.5"
                >
                  Shop Catalog
                </LocalizedClientLink>
                <LocalizedClientLink
                  href="/coa"
                  className="inline-flex h-12 items-center gap-2 rounded-xl border border-ink/30 bg-transparent px-6 font-ui text-[15px] font-semibold text-ink transition-colors duration-200 hover:border-ink/60"
                >
                  View COAs
                </LocalizedClientLink>
              </div>
            </Reveal>
          </div>
        </div>

        {/* Floating trust chips over the product photo (desktop) — depth + proof */}
        <div className="pointer-events-none absolute right-[clamp(24px,4vw,56px)] top-[24%] z-10 hidden lg:block">
          <Reveal delay={220}>
            <div className="flex items-center gap-2.5 rounded-2xl border border-white/10 bg-ink/80 px-3.5 py-2.5 shadow-[0_20px_40px_-20px_rgba(0,0,0,0.9)] backdrop-blur-md">
              <span className="text-[15px]" aria-hidden>🔬</span>
              <div className="leading-tight">
                <div className="font-display text-[9.5px] font-extrabold uppercase tracking-[1.2px] text-gold-500">Every lot</div>
                <div className="font-display text-[13px] font-bold text-white">Signed COA</div>
              </div>
            </div>
          </Reveal>
        </div>
        <div className="pointer-events-none absolute bottom-[16%] right-[clamp(24px,7vw,110px)] z-10 hidden lg:block">
          <Reveal delay={320}>
            <div className="flex items-center gap-2.5 rounded-2xl border border-white/10 bg-ink/80 px-3.5 py-2.5 shadow-[0_20px_40px_-20px_rgba(0,0,0,0.9)] backdrop-blur-md">
              <span className="text-[15px]" aria-hidden>🧪</span>
              <div className="leading-tight">
                <div className="font-display text-[9.5px] font-extrabold uppercase tracking-[1.2px] text-gold-500">HPLC-tested</div>
                <div className="font-display text-[13px] font-bold text-white">99%+ purity</div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── b. TRUST STRIP ────────────────────────────────────── */}
      <section className="bg-[#f6f1e9]">
        <div className={`${CONTAINER} py-8 md:py-10`}>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {TRUST.map(({ Icon, label, sub }, i) => (
              <div
                key={label}
                className={`flex items-center gap-4 ${i > 0 ? "sm:border-l sm:border-ink/12 sm:pl-6" : ""}`}
              >
                <div className="h-8 w-8 shrink-0 text-gold-500">
                  <Icon />
                </div>
                <div>
                  <div className="font-display text-[15px] font-bold text-ink-800">{label}</div>
                  <div className="text-[13px] text-ink/55">{sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── c. CATALOG ────────────────────────────────────────── */}
      <section className="bg-[#fcfaf6]">
        <div className={`${CONTAINER} py-16 md:py-20`}>
          <div className="mb-9 flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="font-ui text-[11px] font-bold uppercase tracking-[2px] text-ink/45">
                The catalog
              </span>
              <h2 className="mt-2 font-display text-[clamp(28px,4.4vw,36px)] font-extrabold tracking-[-0.02em] text-ink-900">
                Featured compounds
              </h2>
            </div>
            <LocalizedClientLink
              href="/store"
              className="font-ui text-[14px] font-semibold text-gold-700 transition-colors hover:text-gold-600"
            >
              View all &rarr;
            </LocalizedClientLink>
          </div>
          <Reveal>
            <FeaturedGrid region={region} limit={8} />
          </Reveal>
        </div>
      </section>

      {/* ── d. COMMUNITY BAND ─────────────────────────────────── */}
      <section className="bg-[#fcfaf6]">
        <div className={CONTAINER}>
          <div className="relative overflow-hidden rounded-3xl bg-[#171717] px-6 py-14 text-center md:px-12 md:py-20">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(120% 90% at 50% 0%, rgba(201,150,58,0.22) 0%, rgba(201,150,58,0) 60%)",
              }}
            />
            <div className="relative">
              <div className="font-ui text-[22px] font-black tracking-[-0.02em] text-white">
                Cylix<span className="text-gold-500">.</span>
                <span className="ml-2 align-middle text-[11px] font-bold tracking-[3px] text-white/55">
                  RESEARCH
                </span>
              </div>
              <h2 className="mx-auto mt-5 max-w-[16ch] font-display text-[clamp(26px,4.4vw,34px)] font-extrabold tracking-[-0.02em] text-white">
                Join the research community
              </h2>
              <p className="mx-auto mt-4 max-w-[54ch] text-[15px] leading-[1.6] text-white/60">
                Early access to restocks and new compounds, batch Certificates of
                Analysis, and support from researchers who use these materials.
              </p>
              <div className="mt-7 flex flex-wrap justify-center gap-2.5">
                {["Early restock access", "Batch COAs", "Researcher support"].map((p) => (
                  <span
                    key={p}
                    className="rounded-full border border-white/15 bg-white/[0.06] px-4 py-1.5 font-ui text-[12px] font-semibold text-white/75"
                  >
                    {p}
                  </span>
                ))}
              </div>
              <LocalizedClientLink
                href="/affiliate"
                className="mt-8 inline-flex h-12 items-center rounded-xl bg-gold-500 px-7 font-ui text-[15px] font-semibold text-[#0a0a0a] transition-transform duration-200 hover:-translate-y-0.5"
              >
                Join the program
              </LocalizedClientLink>
            </div>
          </div>
        </div>
      </section>

      {/* ── e. WHY CYLIX ──────────────────────────────────────── */}
      <section className="bg-[#f5f1ea]">
        <div className={`${CONTAINER} py-16 md:py-20`}>
          <span className="font-ui text-[11px] font-bold uppercase tracking-[2px] text-ink/45">
            Why Cylix
          </span>
          <h2 className="mt-2 max-w-[20ch] font-display text-[clamp(28px,4.4vw,36px)] font-extrabold tracking-[-0.02em] text-ink-900">
            Built on documentation and dependable service.
          </h2>
          <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
            {WHY.map(({ Icon, title, desc }, i) => (
              <Reveal key={title} delay={i * 80}>
                <div className="relative h-full overflow-hidden rounded-2xl border border-[#e4e4e7] bg-white p-7">
                  <span
                    aria-hidden
                    className="pointer-events-none absolute -right-2 -top-4 select-none font-display text-[76px] font-black leading-none text-ink/[0.05]"
                  >
                    0{i + 1}
                  </span>
                  <div className="relative">
                    <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-gold-50 p-2.5 text-gold-500">
                      <Icon />
                    </div>
                    <h3 className="font-display text-[19px] font-bold text-ink-900">{title}</h3>
                    <p className="mt-2 text-[14px] leading-[1.6] text-ink/55">{desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── f. QUESTIONS BAND ─────────────────────────────────── */}
      <section className="bg-[#fcfaf6]">
        <div className={`${CONTAINER} pb-16 md:pb-20`}>
          <div className="relative overflow-hidden rounded-3xl bg-[#171717] px-6 py-14 text-center md:px-12 md:py-16">
            <div aria-hidden className="absolute inset-x-0 top-0 h-1 bg-gold-500" />
            <h2 className="font-display text-[clamp(24px,4vw,32px)] font-extrabold tracking-[-0.02em] text-white">
              Questions before ordering?
            </h2>
            <p className="mx-auto mt-4 max-w-[52ch] text-[15px] leading-[1.6] text-white/60">
              Read the FAQ for shipping, documentation, and payment details, or
              reach out and we&rsquo;ll help.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <LocalizedClientLink
                href="/faq"
                className="inline-flex h-12 items-center rounded-xl border border-white/25 bg-transparent px-6 font-ui text-[15px] font-semibold text-white transition-colors hover:border-white/60"
              >
                Read the FAQ
              </LocalizedClientLink>
              <LocalizedClientLink
                href="/support"
                className="inline-flex h-12 items-center rounded-xl bg-gold-500 px-6 font-ui text-[15px] font-semibold text-[#0a0a0a] transition-transform duration-200 hover:-translate-y-0.5"
              >
                Contact us
              </LocalizedClientLink>
            </div>
          </div>
        </div>
      </section>

      {/* ── g. DISCLAIMER STRIP ───────────────────────────────── */}
      <section className="border-t border-[#ece4d8] bg-[#fcfaf6]">
        <div className={`${CONTAINER} py-8`}>
          <p className="mx-auto max-w-[80ch] text-center text-[12px] leading-[1.7] text-ink/45">
            All Cylix Research products are sold strictly for laboratory research
            use only. They are not for human or animal consumption and are not
            intended to diagnose, treat, mitigate, or prevent any condition.
          </p>
        </div>
      </section>
    </>
  )
}
