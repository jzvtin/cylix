import { Metadata } from "next"
import SupportForm from "@modules/common/components/support-form"

export const metadata: Metadata = {
  title: "Support | Cylix Research",
  description: "Contact Cylix Research support for order inquiries, documentation requests, and technical questions.",
}

const channels = [
  {
    icon: "✉️",
    label: "Email Support",
    value: "support@cylixlab.com",
    detail: "For order inquiries, CoA requests, and general questions.",
  },
  {
    icon: "⏰",
    label: "Support Hours",
    value: "Mon–Fri, 9am–6pm EST",
    detail: "Saturday–Sunday: 10am–4pm EST. Response within 12–24 hours.",
  },
  {
    icon: "🧪",
    label: "Technical Support",
    value: "Reconstitution & Storage",
    detail: "Include your compound name and lot number for fastest response.",
  },
  {
    icon: "📄",
    label: "Documentation",
    value: "Certificates of Analysis",
    detail: "Request the CoA for your lot — include your order and lot number.",
  },
]

const trust = ["12–24h response", "Third-party tested", "US-based support"]

export default function SupportPage() {
  return (
    <div className="relative">
      {/* HEADER */}
      <div className="content-container pt-14 pb-6 text-center sm:pt-20">
        <span className="cx-eyebrow">Get Help</span>
        <h1 className="cx-h mx-auto mt-5 max-w-[14ch] text-[clamp(32px,6vw,56px)]">
          We&apos;re here to <em>help.</em>
        </h1>
        <p className="mx-auto mt-4 max-w-[440px] text-[15px] leading-relaxed text-ink/55">
          For order support, documentation requests, or technical inquiries —
          our team responds within 12–24 hours.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2.5">
          {trust.map((t) => (
            <span
              key={t}
              className="inline-flex items-center gap-2 rounded-full border border-gold-200 bg-gold-50 px-3.5 py-1.5 font-display text-[11px] font-bold uppercase tracking-[0.6px] text-gold-700"
            >
              <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-gold-500" />
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* BODY */}
      <div className="mx-auto grid max-w-[980px] grid-cols-1 gap-6 px-5 pb-24 pt-8 sm:px-8 lg:grid-cols-[1fr_1.15fr] lg:gap-8">
        {/* CONTACT METHODS */}
        <div className="flex flex-col gap-3.5">
          {channels.map((card) => (
            <div key={card.label} className="cx-glass rounded-2xl px-5 py-5">
              <div className="mb-2.5 flex h-10 w-10 items-center justify-center rounded-xl bg-gold-50 text-[19px]">
                <span aria-hidden>{card.icon}</span>
              </div>
              <div className="font-display text-[10px] font-bold uppercase tracking-[0.8px] text-ink/45">
                {card.label}
              </div>
              <div className="mt-0.5 font-display text-[14.5px] font-extrabold text-ink">
                {card.value}
              </div>
              <div className="mt-1 text-[12.5px] leading-[1.6] text-ink/55">
                {card.detail}
              </div>
            </div>
          ))}
        </div>

        {/* FORM */}
        <div className="cx-glass rounded-[22px] px-6 py-7 sm:px-8">
          <h2 className="cx-h mb-1 text-[22px]">Send a Message</h2>
          <p className="mb-6 text-[13px] leading-relaxed text-ink/55">
            Tell us what you need and we&apos;ll get back to you within one
            business day.
          </p>
          <SupportForm />
        </div>
      </div>
    </div>
  )
}
