import { Metadata } from "next"
import FeaturedProducts from "@modules/home/components/featured-products"
import Hero from "@modules/home/components/hero"
import Proof from "@modules/home/components/proof"
import HowItWorks from "@modules/home/components/how-it-works"
import WhyCylix from "@modules/home/components/why-cylix"
import Reviews from "@modules/home/components/reviews"
import CtaBand from "@modules/home/components/cta-band"
import Reveal from "@modules/common/components/reveal"
import { listCollections } from "@lib/data/collections"
import { getRegion } from "@lib/data/regions"

export const metadata: Metadata = {
  title: "Cylix Research | Research Peptides You Can Trust",
  description: "Research-grade peptides with Certificate of Analysis on every batch. 99%+ identity purity, third-party tested.",
}

export default async function Home(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params
  const { countryCode } = params
  const region = await getRegion(countryCode)
  const { collections } = await listCollections({ fields: "id, handle, title" })

  if (!region) return null

  return (
    <>
      <Hero />

      {/* PROOF — the claim → the document */}
      <Proof />

      {/* HOW IT WORKS */}
      <HowItWorks />

      {/* WHY CYLIX — token-based line-icon grid */}
      <WhyCylix />

      {/* FEATURED PRODUCTS */}
      <Reveal>
        <section className="border-t border-cream bg-white px-[clamp(18px,5vw,32px)] py-[clamp(40px,7vw,64px)]">
          <div className="mx-auto max-w-[1200px]">
            <div className="mb-10 flex flex-wrap items-end justify-between gap-[14px]">
              <div>
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-gold-500/35 bg-gold-50 px-4 py-[7px] font-display text-[11px] font-extrabold uppercase tracking-[1.6px] text-gold-700">
                  <span className="inline-block h-[6px] w-[6px] rounded-full bg-gold-500" />
                  Featured Products
                </div>
                <h2 className="font-display text-[clamp(28px,4.4vw,48px)] font-black leading-[1.02] tracking-[-1.4px] text-ink">
                  Research-grade <span className="text-gold-500">compounds.</span>
                </h2>
                <p className="mt-3 text-[clamp(14px,1.3vw,16px)] text-ink/55">Third-party verified, every batch.</p>
              </div>
              <a
                href="/store"
                className="rounded-full border border-cream bg-white px-5 py-[10px] font-display text-[13px] font-bold text-ink/70 transition-colors hover:border-gold-500 hover:text-gold-700"
              >
                View all →
              </a>
            </div>
            {collections && collections.length > 0 && (
              <ul className="flex flex-col gap-x-6">
                <FeaturedProducts collections={collections} region={region} />
              </ul>
            )}
          </div>
        </section>
      </Reveal>

      {/* REVIEWS / SOCIAL PROOF */}
      <Reviews />

      {/* FINAL GOLD CTA BAND */}
      <CtaBand />

      {/* COMPLIANCE */}
      <div className="border-t border-cream bg-[#F0EDE8] px-[clamp(18px,5vw,32px)] py-10">
        <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { label: "Documentation", text: "Every lot ships with a Certificate of Analysis from Janoshik Analytical. Identity and purity verified by independent third-party testing." },
            { label: "Age & Buyer Verification", text: "Purchasers must be 21 or older and a qualified researcher. By ordering you confirm qualified laboratory research use only." },
            { label: "Research Use Only", text: "All materials are for in-vitro laboratory research only. Not for human or animal consumption, injection, dosing, or administration of any kind." },
          ].map((item) => (
            <div key={item.label}>
              <div className="mb-[7px] font-display text-[9px] font-extrabold uppercase tracking-[1.2px] text-gold-600">
                {item.label}
              </div>
              <p className="m-0 text-xs leading-[1.75] text-ink/50">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
