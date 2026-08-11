import { Metadata } from "next"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export const metadata: Metadata = {
  title: "FAQ | Cylix Research",
  description: "Frequently asked questions about Cylix Research compounds, ordering, and shipping.",
}

const faqs = [
  {
    category: "Compounds & Quality",
    items: [
      { q: "Are your compounds tested for purity?", a: "Yes. All Cylix Research compounds undergo third-party testing through Janoshik Analytical. Each batch is tested using HPLC-MS/MS to verify purity, identity, and concentration. Certificates of Analysis are available for all current batches. Our purity standards consistently exceed 99%." },
      { q: "What is a Certificate of Analysis (CoA)?", a: "A CoA is a lot-specific analytical document confirming the identity, purity, and quality of a reference material. Each CoA includes identity verification by HPLC or mass spectrometry, purity percentage, lot number, testing laboratory name, and test date. Request a CoA by emailing support@cylixlab.com with your order number." },
      { q: "How should I store research compounds?", a: "Lyophilized powder: Store at −20°C in a desiccated environment. Reconstituted solution: Store at 2–8°C and use within 30 days. Avoid repeated freeze-thaw cycles, light exposure, and high humidity." },
    ]
  },
  {
    category: "Ordering & Payment",
    items: [
      { q: "What payment methods do you accept?", a: "We accept major credit and debit cards at checkout. All transactions are processed through a secure, encrypted payment gateway." },
      { q: "How do I track my order?", a: "You can view your order history and tracking in your account dashboard once your order ships. If you have any questions about your order status, contact support@cylixlab.com with your order number." },
      { q: "Do you offer institutional pricing?", a: "Yes. We offer discounted pricing for qualified research institutions, universities, and laboratories. Contact support@cylixlab.com with your institution name, credentials, and expected order volume." },
    ]
  },
  {
    category: "Shipping & Handling",
    items: [
      { q: "What are your shipping policies?", a: "Free shipping on all orders. Processing takes 12–24 hours on business days. Domestic delivery is typically 2–5 business days via USPS Priority or UPS Ground. All packages are labeled as laboratory research materials." },
      { q: "What is your return policy?", a: "Given the nature of laboratory reference materials, we cannot accept returns of opened or used materials. Unopened material in its original packaging may be returned within 14 days of delivery — email support@cylixlab.com first for a return authorisation. For materials arriving damaged, incorrect items shipped due to our error, or orders lost in transit, we will issue a replacement or full refund; contact us within 7 days of expected delivery." },
    ]
  },
]

export default function FAQPage() {
  return (
    <div className="relative">
      {/* HEADER */}
      <div className="content-container pt-14 pb-6 text-center sm:pt-20">
        <span className="cx-eyebrow">Help Center</span>
        <h1 className="cx-h mx-auto mt-5 max-w-[15ch] text-[clamp(32px,6vw,56px)]">
          Frequently Asked <em>Questions</em>
        </h1>
        <p className="mx-auto mt-4 max-w-[460px] text-[15px] leading-relaxed text-ink/55">
          Answers to common questions about our research compounds, ordering,
          and protocols.
        </p>
      </div>

      {/* BODY */}
      <div className="mx-auto max-w-[760px] px-5 pb-24 pt-8 sm:px-8">
        {faqs.map((group) => (
          <div key={group.category} className="mb-10">
            <div className="mb-4 flex items-center gap-3">
              <span className="font-display text-[11px] font-extrabold uppercase tracking-[1.4px] text-gold-700">
                {group.category}
              </span>
              <span className="h-px flex-1 bg-gold-300/40" />
            </div>

            <div className="flex flex-col gap-3">
              {group.items.map((item) => (
                <details
                  key={item.q}
                  className="group cx-glass overflow-hidden rounded-2xl transition-shadow"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 [&::-webkit-details-marker]:hidden">
                    <span className="font-display text-[14.5px] font-bold text-ink">
                      {item.q}
                    </span>
                    {/* +/− affordance */}
                    <span
                      aria-hidden
                      className="relative flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border border-gold-300/60 bg-gold-50"
                    >
                      <span className="absolute h-[2px] w-3 rounded-full bg-gold-600" />
                      <span className="absolute h-3 w-[2px] rounded-full bg-gold-600 transition-transform duration-200 group-open:scale-y-0 motion-reduce:transition-none" />
                    </span>
                  </summary>
                  <div className="border-t border-cream/70 px-5 pb-5 pt-4 text-[13.5px] leading-[1.8] text-ink/65">
                    {item.a}
                  </div>
                </details>
              ))}
            </div>
          </div>
        ))}

        {/* CTA */}
        <div className="cx-card mt-4 rounded-[22px] px-7 py-9 text-center">
          <div className="font-display text-[18px] font-extrabold tracking-[-0.3px] text-ink">
            Still have questions?
          </div>
          <p className="mx-auto mt-2 max-w-[360px] text-[13.5px] leading-relaxed text-ink/55">
            Our support team responds within 12–24 hours. Reach out and we&apos;ll
            get you the documentation or answers you need.
          </p>
          <LocalizedClientLink
            href="/support"
            className="cx-btn cx-btn-primary mt-6 !text-[13px]"
          >
            Contact Support →
          </LocalizedClientLink>
        </div>
      </div>
    </div>
  )
}
