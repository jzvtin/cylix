import React from "react"

type LegalPageProps = {
  eyebrow: string
  title: string
  accent?: string
  intro: string
  updated: string
  children: React.ReactNode
}

/**
 * Section — a styled block of long-form legal copy. Heavy Poppins heading with
 * a gold section marker, comfortable reading measure. Signature is unchanged
 * (heading + children) so the policy pages keep working.
 */
export const Section = ({
  heading,
  children,
}: {
  heading: string
  children: React.ReactNode
}) => (
  <section className="mb-9 scroll-mt-28">
    <h2 className="cx-h relative mb-3 flex items-center gap-3 text-[17px] leading-snug text-ink">
      <span
        aria-hidden
        className="inline-block h-4 w-[3px] flex-shrink-0 rounded-full bg-gold-500"
      />
      {heading}
    </h2>
    <div className="flex flex-col gap-3 pl-[15px] text-[14.5px] leading-[1.85] text-ink/70 [&_a]:text-gold-700 [&_a]:underline [&_a]:decoration-gold-300 [&_a]:underline-offset-2 hover:[&_a]:text-gold-600 [&_strong]:font-semibold [&_strong]:text-ink">
      {children}
    </div>
  </section>
)

const LegalPage = ({
  eyebrow,
  title,
  accent,
  intro,
  updated,
  children,
}: LegalPageProps) => {
  return (
    <div className="relative">
      {/* HEADER — on the cream atmosphere */}
      <div className="content-container pt-14 pb-8 text-center sm:pt-20">
        <span className="cx-eyebrow">{eyebrow}</span>
        <h1 className="cx-h mx-auto mt-5 max-w-[16ch] text-[clamp(32px,6vw,56px)]">
          {title}
          {accent ? (
            <>
              {" "}
              <em>{accent}</em>
            </>
          ) : null}
        </h1>
        <p className="mx-auto mt-4 max-w-[540px] text-[15px] leading-relaxed text-ink/55">
          {intro}
        </p>
      </div>

      {/* READING COLUMN */}
      <div className="mx-auto max-w-[820px] px-5 pb-24 sm:px-8">
        <div className="cx-glass rounded-[22px] px-6 py-8 sm:px-11 sm:py-10">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-gold-200 bg-gold-50 px-3.5 py-1.5 font-display text-[11px] font-bold uppercase tracking-[0.8px] text-gold-700">
            <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-gold-500" />
            Last updated {updated}
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}

export default LegalPage
