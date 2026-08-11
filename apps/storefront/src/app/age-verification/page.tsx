import type { Metadata } from "next"
import Image from "next/image"

import { ORG_TYPES } from "@lib/age-gate"

export const metadata: Metadata = {
  title: "Age Verification | Cylix Research",
  description:
    "Confirm you are 21 or older and a qualified researcher to enter Cylix Research.",
  robots: { index: false, follow: false },
}

/**
 * Gate imagery. hero-web.jpg is the safe default (photoreal warm-marble shot of
 * gold-cap Cylix vials, in public/). Swap to /hero/photo/age-gate-web.jpg here
 * if a moodier dedicated shot is dropped in later.
 */
const GATE_IMAGE = "/hero/photo/hero-web.jpg"

type SearchParams = Promise<{ returnTo?: string; error?: string }>

export default async function AgeVerificationPage(props: {
  searchParams: SearchParams
}) {
  const { returnTo, error } = await props.searchParams
  const safeReturnTo =
    returnTo && returnTo.startsWith("/") && !returnTo.startsWith("//")
      ? returnTo
      : "/"

  return (
    <div className="relative flex min-h-screen items-stretch bg-[#0C0C0D] font-sans">
      {/* Ambient vial imagery — fills the whole gate on mobile, becomes the
          left panel on large screens. Dark scrim keeps the card legible. */}
      <div className="pointer-events-none absolute inset-0 lg:right-[clamp(440px,42%,560px)]">
        <Image
          src={GATE_IMAGE}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        {/* scrim: darker on mobile (card floats over image), lighter on lg */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0C0C0D] via-[#0C0C0D]/80 to-[#0C0C0D]/55 lg:bg-gradient-to-r lg:from-transparent lg:via-[#0C0C0D]/20 lg:to-[#0C0C0D]" />
      </div>

      {/* Brand mark + tagline overlaid on the imagery (lg only) */}
      <div className="pointer-events-none absolute left-10 top-10 z-10 hidden max-w-sm lg:block">
        <div className="font-display text-[15px] font-black tracking-[-0.3px] text-white">
          CYLIX RESEARCH
        </div>
        <p className="mt-3 font-display text-[clamp(26px,3vw,38px)] font-black leading-[1.05] tracking-[-0.03em] text-white">
          Analytical-grade reference standards for{" "}
          <span className="text-gold-500">qualified researchers.</span>
        </p>
      </div>

      {/* CONFIRMATION CARD */}
      <div className="relative z-10 ml-auto flex w-full items-center justify-center px-5 py-14 sm:px-8 lg:w-[clamp(440px,42%,560px)]">
        <div className="w-full max-w-[460px] rounded-[22px] border border-white/60 bg-white/95 p-8 shadow-[0_40px_90px_-40px_rgba(0,0,0,0.8)] backdrop-blur-xl sm:p-10">
          <span className="cx-eyebrow">For research use only</span>

          <h1 className="cx-h mt-5 text-[clamp(26px,4vw,32px)] leading-[1.08]">
            You must be <em>21+</em> to enter
          </h1>

          <p className="mt-3 text-[13.5px] leading-[1.7] text-ink/60">
            Cylix Research supplies analytical-grade biochemical reference
            standards to qualified researchers. All products are for in-vitro
            laboratory research only — not for human or animal consumption.
            Please confirm the following to continue.
          </p>

          {error && (
            <div
              role="alert"
              className="mt-6 rounded-[10px] border border-[#E9C4C4] bg-[#FCECEC] px-3.5 py-3 text-[13px] text-[#9A3B3B]"
            >
              Please tick the confirmation box and select a research category to
              enter.
            </div>
          )}

          <form action="/api/age-verification" method="POST" className="mt-7">
            <input type="hidden" name="returnTo" value={safeReturnTo} />

            <label className="mb-2 block font-display text-[11px] font-bold uppercase tracking-[0.4px] text-ink/55">
              I am purchasing as
            </label>
            <select
              name="org_type"
              defaultValue=""
              required
              className="mb-5 w-full rounded-[10px] border border-cream bg-sand/70 px-3.5 py-3 text-[14px] text-ink outline-none transition-colors focus:border-gold-500 focus:bg-white"
            >
              <option value="" disabled>
                Select research category…
              </option>
              {ORG_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>

            <label className="mb-6 flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                name="confirm"
                required
                className="mt-0.5 h-[17px] w-[17px] flex-shrink-0 accent-ink"
              />
              <span className="text-[13px] leading-[1.6] text-ink/75">
                I am at least <strong className="text-ink">21 years of age</strong>{" "}
                and confirm I am a qualified researcher purchasing solely for
                in-vitro / laboratory research use.
              </span>
            </label>

            <button
              type="submit"
              className="cx-btn cx-btn-primary w-full !py-4 !text-[15px] uppercase tracking-[0.3px]"
            >
              Enter Cylix Research →
            </button>
          </form>

          <a
            href="https://www.google.com"
            className="mt-3.5 block text-center text-[13px] font-semibold text-ink/45 transition-colors hover:text-ink/70"
          >
            No, exit site
          </a>

          <p className="mt-6 text-center text-[10.5px] leading-[1.6] text-ink/35">
            These statements have not been evaluated by the FDA. Products are not
            drugs and are not intended to diagnose, treat, cure, or prevent any
            disease.
          </p>
        </div>
      </div>
    </div>
  )
}
