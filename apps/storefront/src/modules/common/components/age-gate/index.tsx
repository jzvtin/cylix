"use client"

import Image from "next/image"
import { useEffect, useState } from "react"

import { AGE_COOKIE, AGE_COOKIE_MAX_AGE, ORG_TYPES } from "@lib/age-gate"

/**
 * Client-side 21+ / research-use gate.
 *
 * Rendered on every page as a full-screen overlay. Because the gate lives in the
 * browser (not a server redirect), search crawlers, ad-review crawlers and human
 * visitors all receive the SAME server-rendered storefront HTML — there is no
 * per-user-agent divergence, so the site can never look like it is cloaking. The
 * overlay simply sits on top for humans until they confirm.
 *
 * The confirmation is stored in a first-party cookie the component reads on mount,
 * so a returning visitor never re-sees the gate within the retention window.
 */
const GATE_IMAGE = "/hero/photo/hero-web.jpg"

function hasAgeCookie(): boolean {
  if (typeof document === "undefined") return false
  return document.cookie
    .split("; ")
    .some((c) => c === `${AGE_COOKIE}=true`)
}

export default function AgeGate() {
  // Start hidden so the server-rendered HTML (and thus every crawler) is the real
  // store; the overlay is decided on the client after mount.
  const [open, setOpen] = useState(false)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!hasAgeCookie()) {
      setOpen(true)
    }
  }, [])

  // Lock body scroll while the gate is up.
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const confirmed = (form.elements.namedItem("confirm") as HTMLInputElement)
      ?.checked
    const orgType = (form.elements.namedItem("org_type") as HTMLSelectElement)
      ?.value
    if (!confirmed || !orgType) {
      setError(true)
      return
    }
    document.cookie = `${AGE_COOKIE}=true; max-age=${AGE_COOKIE_MAX_AGE}; path=/; samesite=lax${
      window.location.protocol === "https:" ? "; secure" : ""
    }`
    setOpen(false)
  }

  if (!open) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Age verification"
      className="fixed inset-0 z-[9999] flex items-stretch bg-[#0C0C0D] font-sans"
    >
      {/* Ambient vial imagery */}
      <div className="pointer-events-none absolute inset-0 lg:right-[clamp(440px,42%,560px)]">
        <Image
          src={GATE_IMAGE}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0C0C0D] via-[#0C0C0D]/80 to-[#0C0C0D]/55 lg:bg-gradient-to-r lg:from-transparent lg:via-[#0C0C0D]/20 lg:to-[#0C0C0D]" />
      </div>

      {/* Brand mark + tagline (lg only) */}
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
      <div className="relative z-10 ml-auto flex w-full items-center justify-center overflow-y-auto px-5 py-14 sm:px-8 lg:w-[clamp(440px,42%,560px)]">
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

          <form onSubmit={onSubmit} className="mt-7">
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
                I am at least{" "}
                <strong className="text-ink">21 years of age</strong> and confirm
                I am a qualified researcher purchasing solely for in-vitro /
                laboratory research use.
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
            drugs and are not intended to diagnose, treat, mitigate, or prevent
            any disease.
          </p>
        </div>
      </div>
    </div>
  )
}
