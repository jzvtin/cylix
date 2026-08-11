import Reveal from "@modules/common/components/reveal"

const lineProps = {
  width: 26,
  height: 26,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
}

const Cart = () => (
  <svg {...lineProps}><circle cx="9" cy="20" r="1.4" /><circle cx="17" cy="20" r="1.4" /><path d="M2 3h3l2.4 12.2a1.5 1.5 0 0 0 1.5 1.2h8a1.5 1.5 0 0 0 1.5-1.2L21 7H6" /></svg>
)
const Vial = () => (
  <svg {...lineProps}><path d="M9 2h6M10 2v6l-3.6 8A2 2 0 0 0 8.2 19h7.6a2 2 0 0 0 1.8-3L14 8V2" /><path d="M8 13h8" /></svg>
)
const Inbox = () => (
  <svg {...lineProps}><path d="M4 13l2.5-8a2 2 0 0 1 1.9-1.4h7.2A2 2 0 0 1 17.5 5L20 13v5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-5z" /><path d="M4 13h4l1.5 2.5h5L16 13h4" /></svg>
)

const STEPS = [
  { n: "01", Icon: Cart, title: "Order", body: "Choose your compound and check out. Free shipping, always — no threshold, no fine print." },
  { n: "02", Icon: Vial, title: "Tested lot", body: "Your specific lot is HPLC-tested by Janoshik Analytical for identity and purity before it dispatches." },
  { n: "03", Icon: Inbox, title: "CoA in your inbox", body: "The Certificate of Analysis for your lot lands in your inbox — the document, not a promise." },
]

const HowItWorks = () => {
  return (
    <section className="border-t border-cream bg-sand px-[clamp(18px,5vw,32px)] py-[clamp(44px,8vw,76px)]">
      <div className="mx-auto max-w-[1200px]">
        <Reveal>
          <div className="mb-11 text-center">
            <div className="mb-[10px] font-display text-[10px] font-extrabold uppercase tracking-[1.4px] text-gold-600">
              How it works
            </div>
            <h2 className="font-display text-[clamp(22px,3.5vw,32px)] font-extrabold tracking-[-0.7px] text-ink">
              From order to document in three steps.
            </h2>
          </div>
        </Reveal>

        <div className="relative grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* connecting line on desktop */}
          <div className="pointer-events-none absolute left-[16%] right-[16%] top-[46px] hidden h-px bg-gradient-to-r from-transparent via-gold-500/40 to-transparent md:block" />
          {STEPS.map(({ n, Icon, title, body }, i) => (
            <Reveal key={n} delay={i * 110}>
              <div className="relative h-full rounded-[16px] border border-cream bg-white p-7 text-center">
                <div className="mx-auto mb-4 flex h-[52px] w-[52px] items-center justify-center rounded-full border border-gold-500/40 bg-sand text-gold-600">
                  <Icon />
                </div>
                <div className="mb-2 font-display text-[11px] font-extrabold tracking-[1.5px] text-gold-500">
                  {n}
                </div>
                <div className="mb-2 font-display text-[15px] font-extrabold text-ink">{title}</div>
                <p className="m-0 text-xs leading-[1.75] text-ink/55">{body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HowItWorks
