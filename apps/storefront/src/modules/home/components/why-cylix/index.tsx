import Reveal from "@modules/common/components/reveal"

// Consistent 1.6-stroke line-icon set (currentColor → inherits gold).
const iconProps = {
  width: 22,
  height: 22,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
}

const Flask = () => (
  <svg {...iconProps}><path d="M9 3h6M10 3v6l-5 8.5A2 2 0 0 0 6.7 21h10.6a2 2 0 0 0 1.7-3.5L14 9V3" /><path d="M7.5 15h9" /></svg>
)
const Shield = () => (
  <svg {...iconProps}><path d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" /><path d="M9 12l2 2 4-4" /></svg>
)
const Bolt = () => (
  <svg {...iconProps}><path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" /></svg>
)
const Truck = () => (
  <svg {...iconProps}><path d="M3 6h11v9H3zM14 9h4l3 3v3h-7" /><circle cx="7.5" cy="17.5" r="1.6" /><circle cx="17.5" cy="17.5" r="1.6" /></svg>
)
const Headset = () => (
  <svg {...iconProps}><path d="M4 13v-1a8 8 0 0 1 16 0v1" /><path d="M4 13h2v5H5a1 1 0 0 1-1-1v-4zM20 13h-2v5h1a1 1 0 0 0 1-1v-4z" /><path d="M18 18a4 4 0 0 1-4 3h-2" /></svg>
)
const Box = () => (
  <svg {...iconProps}><path d="M12 3l8 4v10l-8 4-8-4V7l8-4z" /><path d="M4 7l8 4 8-4M12 11v10" /></svg>
)

const ITEMS = [
  { Icon: Flask, title: "Independent Third-Party Testing", body: "Every batch tested by Janoshik Analytical — not us. Their HPLC results ship with your order." },
  { Icon: Shield, title: "99%+ Purity, Not “Research Grade”", body: "We specify purity by percentage on every CoA — above 99% across our entire catalog, or it doesn't ship." },
  { Icon: Bolt, title: "12–24hr Dispatch", body: "Orders before 2pm EST ship same day. We don't batch orders once a week." },
  { Icon: Truck, title: "Free Shipping, Always", body: "No threshold. No fine print. The price you see is the price you pay." },
  { Icon: Headset, title: "Real Human Support", body: "A real person responds within 12–24 hours — not a bot with canned answers." },
  { Icon: Box, title: "Discreet Packaging", body: "Plain, unmarked packaging labeled as laboratory research materials." },
]

const WhyCylix = () => {
  return (
    <section className="border-t border-cream bg-sand px-[clamp(18px,5vw,32px)] py-[clamp(40px,8vw,72px)]">
      <div className="mx-auto max-w-[1200px]">
        <Reveal>
          <div className="mb-14">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-gold-500/35 bg-gold-50 px-4 py-[7px] font-display text-[11px] font-extrabold uppercase tracking-[1.6px] text-gold-700">
              <span className="inline-block h-[6px] w-[6px] rounded-full bg-gold-500" />
              Why Cylix
            </div>
            <h2 className="mb-4 font-display text-[clamp(28px,4.6vw,50px)] font-black leading-[1.02] tracking-[-1.5px] text-ink">
              Built different, <span className="text-gold-500">for a reason.</span>
            </h2>
            <p className="max-w-[520px] text-[clamp(14px,1.3vw,17px)] leading-[1.7] text-ink/55">
              The research compound space is full of noise. We cut through it with
              one standard: you deserve to know exactly what you&apos;re getting.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ITEMS.map(({ Icon, title, body }, i) => (
            <Reveal key={title} delay={i * 70}>
              <div className="group h-full rounded-[20px] border border-cream bg-white p-8 transition-all duration-200 hover:-translate-y-1 hover:border-gold-500/60 hover:shadow-[0_22px_48px_-26px_rgba(201,150,58,0.6)]">
                <div className="mb-5 flex h-[52px] w-[52px] items-center justify-center rounded-[14px] bg-cream text-gold-600 transition-colors duration-200 group-hover:bg-gold-500 group-hover:text-white">
                  <Icon />
                </div>
                <div className="mb-2 font-display text-[clamp(15px,1.6vw,18px)] font-extrabold tracking-[-0.2px] text-ink">{title}</div>
                <p className="m-0 text-[13px] leading-[1.72] text-ink/55">{body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

export default WhyCylix
