import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Newsletter from "@modules/marketing/newsletter"

const LINK_COLUMNS: { heading: string; links: { l: string; h: string }[] }[] = [
  {
    heading: "Company",
    links: [
      { l: "Contact", h: "/support" },
      { l: "FAQ", h: "/faq" },
      { l: "Partner Program", h: "/affiliate" },
      { l: "Research Use Only", h: "/disclaimer" },
    ],
  },
  {
    heading: "Research",
    links: [
      { l: "Full Catalog", h: "/store" },
      { l: "Education Library", h: "/education" },
      { l: "Certificates of Analysis", h: "/coa" },
      { l: "Shipping Info", h: "/shipping" },
    ],
  },
  {
    heading: "Account",
    links: [
      { l: "Sign In", h: "/account" },
      { l: "Create Account", h: "/account" },
      { l: "Track Order", h: "/account/orders" },
    ],
  },
]

const LEGAL_LINKS = [
  { l: "Privacy Policy", h: "/privacy" },
  { l: "Terms of Service", h: "/terms" },
  { l: "Shipping Policy", h: "/shipping" },
  { l: "Returns", h: "/returns" },
  { l: "Disclaimer", h: "/disclaimer" },
]

const TRUST_POINTS = [
  "Janoshik third-party tested",
  "99%+ verified purity",
  "CoA on every batch",
]

const Footer = () => {
  return (
    <footer className="bg-ink px-6 pb-8 pt-14 text-sand md:px-8">
      <div className="mx-auto max-w-[1200px]">
        {/* Newsletter CTA band */}
        <div className="mb-12 grid grid-cols-1 items-center gap-6 rounded-[22px] border border-white/10 bg-gradient-to-b from-white to-[#FBF9F5] p-6 shadow-[0_30px_70px_-40px_rgba(0,0,0,0.6)] sm:p-8 md:grid-cols-[1.1fr_1fr]">
          <div>
            <div className="cx-eyebrow mb-3">Stay in the lab</div>
            <h3 className="font-display text-[clamp(22px,3vw,30px)] font-black leading-[1.05] tracking-[-0.8px] text-ink">
              Lot drops &amp; <span className="text-gold-500">CoAs</span>, first.
            </h3>
          </div>
          <Newsletter heading="" subheading="Get a one-time welcome code plus new-lot and Certificate-of-Analysis alerts." />
        </div>

        {/* Trust bar */}
        <div className="mb-12 flex flex-wrap items-center gap-x-8 gap-y-3 border-b border-white/10 pb-8">
          {TRUST_POINTS.map((point) => (
            <div key={point} className="flex items-center gap-2.5">
              <span className="inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-gold-500" />
              <span className="text-[12px] font-medium tracking-wide text-sand/70">
                {point}
              </span>
            </div>
          ))}
        </div>

        {/* Link columns */}
        <div className="cx-footer-grid mb-11 grid grid-cols-2 gap-x-8 gap-y-10 small:grid-cols-[2fr_1fr_1fr_1fr] small:gap-10">
          <div className="col-span-2 small:col-span-1">
            <div className="mb-2.5 font-display text-[15px] font-extrabold uppercase tracking-tight text-white">
              Cylix Research
              <span className="ml-1 inline-block h-[5px] w-[5px] rounded-full bg-gold-500 align-middle" />
            </div>
            <p className="max-w-[240px] text-[12px] leading-relaxed text-sand/40">
              Analytical-grade biochemical reference standards for qualified
              researchers. Third-party verified, USA based.
            </p>
          </div>

          {LINK_COLUMNS.map((col) => (
            <div key={col.heading}>
              <div className="mb-3.5 font-display text-[9px] font-extrabold uppercase tracking-[0.12em] text-sand/40">
                {col.heading}
              </div>
              <div className="flex flex-col gap-2.5">
                {col.links.map((i) => (
                  <LocalizedClientLink
                    key={i.l}
                    href={i.h}
                    className="w-fit text-[12px] text-sand/55 transition-colors duration-200 hover:text-gold-400"
                  >
                    {i.l}
                  </LocalizedClientLink>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Legal + compliance small print */}
        <div className="border-t border-white/10 pt-6">
          <div className="mb-4 flex flex-wrap gap-x-5 gap-y-2">
            {LEGAL_LINKS.map((i) => (
              <LocalizedClientLink
                key={i.l}
                href={i.h}
                className="text-[11px] text-sand/35 transition-colors duration-200 hover:text-sand/70"
              >
                {i.l}
              </LocalizedClientLink>
            ))}
          </div>
          <div className="flex flex-col gap-2 small:flex-row small:items-end small:justify-between">
            <p className="max-w-[620px] text-[10px] leading-relaxed text-sand/25">
              All products sold by Cylix Research are for in-vitro laboratory
              research only. Not for human or animal consumption, dosing, or
              administration. Must be 21+ to purchase.
            </p>
            <p className="shrink-0 text-[10px] text-sand/25">
              © {new Date().getFullYear()} Cylix Research
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
