import { Metadata } from "next"
import { notFound } from "next/navigation"
import Image from "next/image"
import { listRegions } from "@lib/data/regions"
import Reveal from "@modules/common/components/reveal"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ReconstitutionCalculator from "@modules/education/reconstitution-calculator"
import DisclaimerBand from "@modules/education/disclaimer-band"
import {
  COMPOUNDS,
  getCompound,
  relatedCompounds,
} from "@modules/education/data"

type Props = {
  params: Promise<{ countryCode: string; slug: string }>
}

export async function generateStaticParams() {
  try {
    const countryCodes = await listRegions().then((regions) =>
      regions?.map((r) => r.countries?.map((c) => c.iso_2)).flat()
    )

    if (!countryCodes || countryCodes.length === 0) {
      // Fall back to slug-only params; Next fills country codes on demand.
      return COMPOUNDS.map((c) => ({ slug: c.slug }))
    }

    return countryCodes
      .filter((code): code is string => Boolean(code))
      .flatMap((countryCode) =>
        COMPOUNDS.map((c) => ({ countryCode, slug: c.slug }))
      )
  } catch {
    return COMPOUNDS.map((c) => ({ slug: c.slug }))
  }
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { slug } = await props.params
  const compound = getCompound(slug)

  if (!compound) {
    return { title: "Reference | Cylix Research" }
  }

  return {
    title: `${compound.code} Reference Standard | Cylix Research`,
    description: `${compound.code} — ${compound.category}. Molecular weight, appearance, solubility and storage reference for in-vitro laboratory research. Research use only.`,
  }
}

const SpecRow = ({ label, value }: { label: string; value?: string }) => {
  if (!value) {
    return null
  }
  return (
    <div className="flex flex-col gap-1 border-b border-cream py-4 last:border-b-0 sm:flex-row sm:items-start sm:gap-6">
      <dt className="w-full flex-shrink-0 font-display text-[11px] font-extrabold uppercase tracking-[1px] text-gold-700 sm:w-[180px]">
        {label}
      </dt>
      <dd className="m-0 text-[14px] leading-[1.65] text-ink/70">{value}</dd>
    </div>
  )
}

export default async function CompoundDetailPage(props: Props) {
  const { slug } = await props.params
  const compound = getCompound(slug)

  if (!compound) {
    notFound()
  }

  const related = relatedCompounds(slug)

  return (
    <div className="relative">
      <div className="mx-auto max-w-[900px] px-5 pb-24 pt-10 sm:px-8 sm:pt-14">
        {/* Breadcrumb */}
        <Reveal>
          <div className="mb-8 flex items-center gap-2 text-[12px] font-semibold text-ink/45">
            <LocalizedClientLink href="/education" className="hover:text-ink">
              Research Library
            </LocalizedClientLink>
            <span aria-hidden>/</span>
            <span className="text-ink/70">{compound.code}</span>
          </div>
        </Reveal>

        {/* HEADER */}
        <Reveal>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            {compound.image ? (
              <span className="flex h-24 w-24 flex-shrink-0 items-center justify-center overflow-hidden rounded-3xl border border-cream bg-white/80">
                <Image
                  src={`/products/web/${compound.image}.jpg`}
                  alt={`${compound.code} reference standard vial`}
                  width={96}
                  height={96}
                  className="h-full w-full object-cover"
                />
              </span>
            ) : (
              <span
                aria-hidden
                className="flex h-24 w-24 flex-shrink-0 items-center justify-center rounded-3xl border border-gold-200 bg-gold-50 font-display text-[26px] font-black text-gold-700"
              >
                {compound.code.replace(/[^A-Za-z0-9+]/g, "").slice(0, 3)}
              </span>
            )}
            <div>
              <span className="inline-flex items-center rounded-full border border-gold-200 bg-gold-50 px-3 py-1 font-display text-[10.5px] font-bold uppercase tracking-[0.5px] text-gold-700">
                {compound.category}
              </span>
              <h1 className="cx-h mt-3 text-[clamp(36px,7vw,64px)] leading-[0.95]">
                {compound.code}
              </h1>
            </div>
          </div>
        </Reveal>

        {/* RESEARCH SUMMARY */}
        <Reveal>
          <div className="cx-glass mt-8 rounded-[22px] p-6 sm:p-8">
            <span className="cx-eyebrow">Research background</span>
            <p className="mt-4 text-[15px] leading-[1.8] text-ink/70">
              {compound.researchSummary}
            </p>
          </div>
        </Reveal>

        {/* SPEC TABLE */}
        <Reveal>
          <section className="mt-8">
            <div className="mb-4 flex items-center gap-3">
              <span className="font-display text-[11px] font-extrabold uppercase tracking-[1.4px] text-gold-700">
                Reference specifications
              </span>
              <span className="h-px flex-1 bg-gold-300/40" />
            </div>
            <dl className="cx-card rounded-[22px] px-6 py-2 sm:px-8">
              <SpecRow label="Molecular weight" value={compound.molecularWeight} />
              <SpecRow label="Molecular formula" value={compound.formula} />
              <SpecRow label="Appearance" value={compound.appearance} />
              <SpecRow label="Solubility" value={compound.solubility} />
              <SpecRow label="Storage & handling" value={compound.storage} />
            </dl>
          </section>
        </Reveal>

        {/* CTAs */}
        <Reveal>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="cx-card flex flex-col rounded-[22px] p-6">
              <div className="font-display text-[16px] font-extrabold text-ink">
                Verify the purity
              </div>
              <p className="mt-2 flex-1 text-[13px] leading-relaxed text-ink/55">
                Every lot is characterised by an independent laboratory. Browse
                third-party HPLC and mass-spec reports by lot.
              </p>
              <LocalizedClientLink
                href="/coa"
                className="cx-btn cx-btn-ghost mt-5 !text-[13px]"
              >
                View Certificates of Analysis →
              </LocalizedClientLink>
            </div>
            <div className="cx-card flex flex-col rounded-[22px] p-6">
              <div className="font-display text-[16px] font-extrabold text-ink">
                Source this reference
              </div>
              <p className="mt-2 flex-1 text-[13px] leading-relaxed text-ink/55">
                Analytical-grade reference material, 99%+ purity, with a
                Certificate of Analysis on every lot.
              </p>
              <LocalizedClientLink
                href="/store"
                className="cx-btn cx-btn-gold mt-5 !text-[13px]"
              >
                Shop the catalog →
              </LocalizedClientLink>
            </div>
          </div>
        </Reveal>

        {/* RECONSTITUTION CALCULATOR (prefilled reference defaults) */}
        <Reveal>
          <section className="mt-10">
            <ReconstitutionCalculator
              code={compound.code}
              defaultVialMg={compound.reconstitution.vialMg}
              defaultBacWaterMl={compound.reconstitution.bacWaterMl}
            />
          </section>
        </Reveal>

        {/* DISCLAIMER */}
        <Reveal>
          <div className="mt-10">
            <DisclaimerBand />
          </div>
        </Reveal>

        {/* RELATED */}
        {related.length > 0 && (
          <Reveal>
            <section className="mt-16">
              <div className="mb-5 flex items-center gap-3">
                <span className="font-display text-[11px] font-extrabold uppercase tracking-[1.4px] text-gold-700">
                  Related references
                </span>
                <span className="h-px flex-1 bg-gold-300/40" />
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                {related.map((r) => (
                  <LocalizedClientLink
                    key={r.slug}
                    href={`/education/${r.slug}`}
                    className="cx-glass group rounded-[20px] p-5 transition-transform duration-200 hover:-translate-y-1 motion-reduce:transform-none motion-reduce:transition-none"
                  >
                    <div className="font-display text-[18px] font-black tracking-[-0.4px] text-ink">
                      {r.code}
                    </div>
                    <div className="mt-1.5 text-[10.5px] font-semibold uppercase tracking-[0.5px] text-gold-700">
                      {r.category}
                    </div>
                    <span className="mt-3 inline-flex items-center gap-1.5 font-display text-[12px] font-bold text-ink">
                      View reference
                      <span className="text-gold-600 transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transition-none">
                        →
                      </span>
                    </span>
                  </LocalizedClientLink>
                ))}
              </div>
            </section>
          </Reveal>
        )}
      </div>
    </div>
  )
}
