import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Newsletter from "@modules/marketing/newsletter"

const LINK_COLUMNS: { heading: string; links: { l: string; h: string }[] }[] = [
  {
    heading: "Shop",
    links: [
      { l: "All products", h: "/store" },
      { l: "Certificates of Analysis", h: "/coa" },
      { l: "Research library", h: "/education" },
      { l: "Shipping", h: "/shipping" },
    ],
  },
  {
    heading: "Support",
    links: [
      { l: "Contact", h: "/support" },
      { l: "FAQ", h: "/faq" },
      { l: "Returns", h: "/returns" },
      { l: "Track order", h: "/account/orders" },
    ],
  },
  {
    heading: "Account",
    links: [
      { l: "Sign in", h: "/account" },
      { l: "Create account", h: "/account" },
      { l: "My orders", h: "/account/orders" },
      { l: "Affiliate program", h: "/affiliate" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { l: "Terms of Service", h: "/terms" },
      { l: "Privacy Policy", h: "/privacy" },
      { l: "Disclaimer", h: "/disclaimer" },
      { l: "Shipping Policy", h: "/shipping" },
    ],
  },
]

const TRUST_CHIPS = [
  { l: "Free priority U.S. shipping over $100", path: "M3 7h11v8H3z M14 10h4l3 3v2h-7z M7.5 18a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z M17.5 18a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" },
  { l: "Third-party tested", path: "M12 3l7 4v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V7l7-4z M9 12l2 2 4-4" },
  { l: "Certificate of Analysis available", path: "M7 3h7l5 5v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z M14 3v5h5 M9 13h6 M9 17h6" },
]

const PAYMENTS = [
  { l: "Card", path: "M3 6h18v12H3z M3 10h18" },
  { l: "Venmo", path: "M7 4h10a2 2 0 0 1 2 2c0 5-4 12-7 14H8L5 8l4-.5 1 8c1.5-2 3-5 3-7 0-1-.5-1.5-1.5-1.5H7z" },
  { l: "Cash App", path: "M14 7c-1-.8-2.2-1.2-3.3-1-1.2.2-1.9 1-1.7 1.9.2.8 1 1.1 2.5 1.5 1.8.4 3 1 3.2 2.3.2 1.3-.9 2.4-2.4 2.6-1.3.2-2.7-.2-3.6-1 M11 5V4 M12 18v-1.2" },
  { l: "Crypto", path: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z M9.5 8.5h3.2a2 2 0 1 1 0 4H9.5m0 0h3.4a2 2 0 1 1 0 4H9.5m0-8V7m0 9.5V18m2-11.5V7m0 9.5V18" },
]

const Footer = () => {
  return (
    <footer className="bg-[#171717] px-6 pb-8 pt-14 text-sand md:px-8">
      <div className="mx-auto max-w-[1200px]">
        {/* Newsletter band */}
        <div className="mb-12 flex flex-col gap-6 border-b border-white/10 pb-12 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="font-display text-[22px] font-extrabold tracking-[-0.02em] text-white">
              Join the list
            </h3>
            <p className="mt-1 text-[14px] text-sand/55">
              Get 10% off your first order — plus lot drops and Certificate-of-Analysis alerts.
            </p>
          </div>
          <Newsletter
            className="w-full md:max-w-[400px]"
            heading=""
            subheading=""
          />
        </div>

        {/* Link columns — Brand + Shop / Support / Account / Legal */}
        <div className="cx-footer-grid mb-12 grid grid-cols-2 gap-x-8 gap-y-10 small:grid-cols-[1.6fr_1fr_1fr_1fr_1fr] small:gap-10">
          <div className="col-span-2 small:col-span-1">
            <div className="mb-2.5 font-ui text-[18px] font-black tracking-[-0.02em] text-white">
              Cylix<span className="text-gold-500">.</span>
              <span className="ml-1.5 align-middle font-ui text-[10px] font-bold tracking-[2.5px] text-sand/45">
                RESEARCH
              </span>
            </div>
            <p className="max-w-[240px] text-[12px] leading-relaxed text-sand/40">
              High-purity research materials for qualified researchers.
              Third-party tested, clearly documented, USA based.
            </p>
          </div>

          {LINK_COLUMNS.map((col) => (
            <div key={col.heading}>
              <div className="mb-3.5 font-ui text-[11px] font-bold uppercase tracking-[1.5px] text-sand/40">
                {col.heading}
              </div>
              <div className="flex flex-col gap-2.5">
                {col.links.map((i) => (
                  <LocalizedClientLink
                    key={i.l}
                    href={i.h}
                    className="w-fit text-[13px] text-sand/55 transition-colors duration-200 hover:text-gold-400"
                  >
                    {i.l}
                  </LocalizedClientLink>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Trust chips */}
        <div className="mb-6 flex flex-wrap gap-2.5">
          {TRUST_CHIPS.map((c) => (
            <span
              key={c.l}
              className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.04] px-3.5 py-2 text-[12px] font-medium text-sand/70"
            >
              <svg aria-hidden viewBox="0 0 24 24" className="h-4 w-4 text-gold-500" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d={c.path} />
              </svg>
              {c.l}
            </span>
          ))}
        </div>

        {/* Payment methods */}
        <div className="mb-10 border-t border-white/10 pt-6">
          <div className="mb-3 font-ui text-[10px] font-bold uppercase tracking-[2px] text-sand/35">
            Accepted payment methods
          </div>
          <div className="flex flex-wrap gap-2.5">
            {PAYMENTS.map((p) => (
              <span
                key={p.l}
                className="inline-flex items-center gap-2 rounded-lg border border-white/12 bg-white/[0.04] px-3 py-2 text-[12px] font-medium text-sand/70"
              >
                <svg aria-hidden viewBox="0 0 24 24" className="h-4 w-4 text-sand/55" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d={p.path} />
                </svg>
                {p.l}
              </span>
            ))}
          </div>
        </div>

        {/* Research-use box */}
        <div className="mb-6 rounded-2xl border border-gold-500/20 bg-gold-500/[0.05] px-5 py-4">
          <div className="mb-1.5 font-ui text-[11px] font-bold uppercase tracking-[1.5px] text-gold-400">
            For Research Use Only
          </div>
          <p className="m-0 text-[12px] leading-[1.7] text-sand/45">
            All products sold on this website are intended for research and
            identification purposes only. These products are not intended for
            human administration, injection, or ingestion. Not for human or
            animal consumption. Not a drug, food, cosmetic, or dietary supplement.{" "}
            <LocalizedClientLink href="/disclaimer" className="text-gold-400 underline-offset-2 hover:underline">
              Read the full policy
            </LocalizedClientLink>
          </p>
        </div>

        {/* Copyright */}
        <div className="flex flex-col gap-1.5 border-t border-white/10 pt-6 small:flex-row small:items-center small:justify-between">
          <p className="text-[11px] text-sand/30">
            © {new Date().getFullYear()} Cylix Research. All rights reserved.
          </p>
          <p className="text-[11px] text-sand/30">
            Questions?{" "}
            <a href="mailto:support@cylixlab.com" className="hover:text-sand/60">
              support@cylixlab.com
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
