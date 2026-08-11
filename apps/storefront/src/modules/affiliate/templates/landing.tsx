import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Reveal from "@modules/common/components/reveal"

import FaqAccordion, {
  type FaqItem,
} from "@modules/affiliate/components/faq-accordion"
import { AFFILIATE_TIERS } from "@modules/affiliate/tiers"

const STEPS = [
  {
    n: "01",
    title: "Apply in two minutes",
    body: "Tell us about your audience. Most research partners are approved fast and get a live code the same day.",
  },
  {
    n: "02",
    title: "Share your link",
    body: "Drop your unique referral link and code anywhere — newsletter, channel, bio. Your audience gets a welcome discount.",
  },
  {
    n: "03",
    title: "Get paid",
    body: "Earn commission on every qualified referred order. Track clicks, orders, and payouts live from your dashboard.",
  },
]

const WHY = [
  {
    title: "Real documentation to stand behind",
    body: "Every batch ships with a third-party Certificate of Analysis. You refer a brand your audience can actually trust.",
  },
  {
    title: "Transparent, real-time tracking",
    body: "No black box. See clicks, referred orders, and commission the moment they land — not weeks later.",
  },
  {
    title: "Fast, dependable payouts",
    body: "Clear payout status on every dollar. No opaque holds, no surprise clawbacks on qualified orders.",
  },
  {
    title: "You move up automatically",
    body: "Consistent referrers graduate to higher commission tiers. The more you refer, the more every order is worth.",
  },
]

const FAQ: FaqItem[] = [
  {
    q: "Who can become a partner?",
    a: "Researchers, educators, and creators with an audience interested in research-grade compounds. We review every application to keep the program credible — audience quality matters more than size.",
  },
  {
    q: "How and when do I get paid?",
    a: "Commission accrues on every qualified referred order and is reflected on your dashboard in real time. Payouts are processed on a regular cycle once an order clears its return window.",
  },
  {
    q: "Are the commission rates fixed?",
    a: "The tiers shown here are illustrative defaults for the Standard, Pro, and Elite levels. Your live rate is set on your partner record and always shown in your dashboard.",
  },
  {
    q: "Is there any cost to join?",
    a: "No. The partner program is free to join. You get a unique link, a customer discount code, and a full tracking dashboard at no cost.",
  },
  {
    q: "What can I promote?",
    a: "All materials are analytical reference standards sold for in-vitro laboratory research only. Partners must represent the products accurately and never suggest human or animal use.",
  },
]

/**
 * The partner-program marketing landing. Server component — interactive pieces
 * (FAQ) are isolated client islands. All surfaces are translucent so the global
 * SiteBackground reads through, except the intentional dark hero + gold CTA.
 */
export default function AffiliateLanding() {
  return (
    <div className="relative">
      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-ink px-[clamp(18px,5vw,32px)] py-[clamp(56px,9vw,110px)] text-sand">
        {/* gold glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute -right-[10%] -top-[20%] h-[520px] w-[520px] rounded-full bg-gold-500/25 blur-[120px]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-[30%] left-[5%] h-[420px] w-[420px] rounded-full bg-gold-500/10 blur-[120px]"
        />
        {/* chromatogram motif */}
        <svg
          aria-hidden
          className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.08]"
          viewBox="0 0 800 300"
          preserveAspectRatio="xMidYMid slice"
        >
          <path
            d="M0 230 L160 230 Q180 60 200 230 L320 230 Q340 230 356 150 Q372 230 390 230 L520 230 Q540 230 556 96 Q572 230 590 230 L800 230"
            fill="none"
            stroke="#C9963A"
            strokeWidth="2"
            strokeLinejoin="round"
          />
        </svg>

        <div className="relative mx-auto grid max-w-[1200px] items-center gap-[clamp(32px,5vw,64px)] lg:grid-cols-[1.05fr_0.95fr]">
          <Reveal>
            <div>
              <span className="cx-eyebrow cx-eyebrow--light">
                Partner Program
              </span>
              <h1 className="mt-6 font-display text-[clamp(38px,6.4vw,74px)] font-black leading-[0.96] tracking-[-2.4px] text-sand">
                Earn with every
                <br />
                <span className="text-gold-500">referral.</span>
              </h1>
              <p className="mt-6 max-w-[520px] text-[clamp(15px,1.6vw,18px)] leading-[1.65] text-sand/70">
                Partner with Cylix Research and turn your audience into recurring
                income. Share a brand backed by real third-party documentation —
                and get paid on every qualified order.
              </p>
              <div className="mt-9 flex flex-wrap gap-3">
                <LocalizedClientLink href="/affiliate/join">
                  <span className="cx-btn cx-btn-gold">Become a partner</span>
                </LocalizedClientLink>
                <LocalizedClientLink href="/affiliate/dashboard">
                  <span className="cx-btn cx-btn-ghost">Partner login</span>
                </LocalizedClientLink>
              </div>
            </div>
          </Reveal>

          {/* Glass panel with floating stat chips */}
          <Reveal delay={120}>
            <div className="relative">
              <div className="cx-glass relative overflow-hidden rounded-[26px] p-7 sm:p-9">
                <div className="flex items-center justify-between">
                  <span className="cx-eyebrow">Live earnings</span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 font-display text-[11px] font-bold text-emerald-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    Tracking on
                  </span>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  {[
                    { k: "Commission", v: "$3,240", s: "this quarter" },
                    { k: "Referred orders", v: "108", s: "all time" },
                    { k: "Conversion", v: "6.4%", s: "link → order" },
                    { k: "Payout", v: "On time", s: "every cycle" },
                  ].map((c) => (
                    <div
                      key={c.k}
                      className="rounded-[16px] border border-ink/8 bg-white/70 p-4"
                    >
                      <div className="font-display text-[10px] font-extrabold uppercase tracking-[1.2px] text-ink/45">
                        {c.k}
                      </div>
                      <div className="mt-1 font-display text-[clamp(22px,3vw,30px)] font-black tracking-[-1px] text-ink">
                        {c.v}
                      </div>
                      <div className="text-[11px] text-ink/45">{c.s}</div>
                    </div>
                  ))}
                </div>

                <p className="mt-5 text-[11px] leading-relaxed text-ink/40">
                  Illustrative figures. Your real numbers appear in your
                  dashboard the moment your first referral lands.
                </p>
              </div>

              {/* floating verified chip */}
              <div className="absolute -left-3 -top-3 hidden rounded-full bg-ink px-4 py-2 font-display text-[12px] font-bold text-sand shadow-lg sm:block">
                ✓ CoA on every batch
              </div>
              <div className="absolute -bottom-3 -right-3 hidden rounded-full bg-gold-500 px-4 py-2 font-display text-[12px] font-bold text-ink shadow-lg sm:block">
                Up to 20% commission
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── COMMISSION TIERS ─────────────────────────────────────────────── */}
      <section className="px-[clamp(18px,5vw,32px)] py-[clamp(48px,8vw,88px)]">
        <div className="mx-auto max-w-[1200px]">
          <Reveal>
            <div className="mb-12 text-center">
              <span className="cx-eyebrow">Commission Tiers</span>
              <h2 className="cx-h mt-5 text-[clamp(30px,4.8vw,54px)]">
                The more you refer, <em>the more you earn.</em>
              </h2>
              <p className="mx-auto mt-4 max-w-[560px] text-[clamp(14px,1.4vw,17px)] leading-[1.6] text-ink/55">
                Start at Standard and climb automatically. Rates below are
                illustrative — your live rate is always shown in your dashboard.
              </p>
            </div>
          </Reveal>

          <div className="grid gap-5 md:grid-cols-3">
            {AFFILIATE_TIERS.map((tier, i) => (
              <Reveal key={tier.id} delay={i * 90}>
                <div
                  className={`cx-glass relative flex h-full flex-col rounded-[22px] p-7 ${
                    tier.featured
                      ? "ring-2 ring-gold-500/60"
                      : "ring-1 ring-ink/5"
                  }`}
                >
                  {tier.featured && (
                    <span className="absolute -top-3 left-7 rounded-full bg-gold-500 px-3 py-1 font-display text-[10px] font-extrabold uppercase tracking-[1.2px] text-ink">
                      Most popular
                    </span>
                  )}
                  <div className="flex items-baseline justify-between">
                    <span className="font-display text-[13px] font-black tracking-[2px] text-gold-500">
                      {tier.index}
                    </span>
                    <span className="font-display text-[12px] font-bold uppercase tracking-[1.4px] text-ink/40">
                      {tier.name}
                    </span>
                  </div>
                  <div className="mt-5 flex items-end gap-1">
                    <span className="font-display text-[clamp(44px,6vw,64px)] font-black leading-none tracking-[-2px] text-ink">
                      {tier.rate}%
                    </span>
                    <span className="mb-2 font-display text-sm font-bold text-ink/50">
                      commission
                    </span>
                  </div>
                  <div className="mt-2 text-[13px] font-semibold text-ink/45">
                    {tier.threshold}
                  </div>
                  <p className="mt-4 text-[14px] leading-[1.6] text-ink/60">
                    {tier.blurb}
                  </p>
                  <ul className="mt-5 flex flex-col gap-2.5 border-t border-ink/8 pt-5">
                    {tier.perks.map((perk) => (
                      <li
                        key={perk}
                        className="flex items-start gap-2.5 text-[13.5px] leading-snug text-ink/70"
                      >
                        <span className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full bg-gold-500 text-[10px] font-black text-ink">
                          ✓
                        </span>
                        {perk}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────────────── */}
      <section className="border-y border-cream bg-sand/50 px-[clamp(18px,5vw,32px)] py-[clamp(48px,8vw,88px)]">
        <div className="mx-auto max-w-[1200px]">
          <Reveal>
            <div className="mb-12 text-center">
              <span className="cx-eyebrow">How it works</span>
              <h2 className="cx-h mt-5 text-[clamp(30px,4.8vw,54px)]">
                Live in <em>three steps.</em>
              </h2>
            </div>
          </Reveal>
          <div className="grid gap-5 md:grid-cols-3">
            {STEPS.map((step, i) => (
              <Reveal key={step.n} delay={i * 90}>
                <div className="cx-card h-full p-7">
                  <div className="grid h-12 w-12 place-items-center rounded-full bg-ink font-display text-lg font-black text-sand">
                    {step.n}
                  </div>
                  <h3 className="mt-5 font-display text-[clamp(18px,2.2vw,22px)] font-black tracking-[-0.5px] text-ink">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-[14px] leading-[1.65] text-ink/60">
                    {step.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY PARTNER STRIP ────────────────────────────────────────────── */}
      <section className="px-[clamp(18px,5vw,32px)] py-[clamp(48px,8vw,88px)]">
        <div className="mx-auto max-w-[1200px]">
          <Reveal>
            <div className="mb-12">
              <span className="cx-eyebrow">Why partner with us</span>
              <h2 className="cx-h mt-5 max-w-[720px] text-[clamp(28px,4.4vw,50px)]">
                A program built on <em>trust and transparency.</em>
              </h2>
            </div>
          </Reveal>
          <div className="grid gap-5 sm:grid-cols-2">
            {WHY.map((item, i) => (
              <Reveal key={item.title} delay={i * 70}>
                <div className="cx-glass flex h-full gap-4 rounded-[20px] p-6">
                  <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gold-50 text-gold-600 ring-1 ring-gold-500/30">
                    <span className="h-2 w-2 rounded-full bg-gold-500" />
                  </span>
                  <div>
                    <h3 className="font-display text-[clamp(16px,2vw,19px)] font-black tracking-[-0.3px] text-ink">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-[14px] leading-[1.6] text-ink/60">
                      {item.body}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <section className="border-t border-cream bg-sand/50 px-[clamp(18px,5vw,32px)] py-[clamp(48px,8vw,88px)]">
        <div className="mx-auto max-w-[820px]">
          <Reveal>
            <div className="mb-10 text-center">
              <span className="cx-eyebrow">Questions</span>
              <h2 className="cx-h mt-5 text-[clamp(28px,4.4vw,50px)]">
                Partner <em>FAQ.</em>
              </h2>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <FaqAccordion items={FAQ} />
          </Reveal>
        </div>
      </section>

      {/* ── FINAL GOLD CTA BAND ──────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gold-500 px-[clamp(18px,5vw,32px)] py-[clamp(48px,8vw,84px)]">
        <svg
          aria-hidden
          className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.12]"
          viewBox="0 0 800 300"
          preserveAspectRatio="xMidYMid slice"
        >
          <path
            d="M0 230 L160 230 Q180 60 200 230 L320 230 Q340 230 356 150 Q372 230 390 230 L520 230 Q540 230 556 96 Q572 230 590 230 L800 230"
            fill="none"
            stroke="#0D0D0D"
            strokeWidth="2"
            strokeLinejoin="round"
          />
        </svg>
        <Reveal>
          <div className="relative mx-auto flex max-w-[720px] flex-col items-center text-center">
            <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-ink/20 bg-ink/5 px-4 py-[7px] font-display text-[11px] font-extrabold uppercase tracking-[1.6px] text-ink/70">
              <span className="inline-block h-[6px] w-[6px] rounded-full bg-ink" />
              Free to join
            </span>
            <h2 className="mb-5 font-display text-[clamp(30px,5.6vw,60px)] font-black leading-[0.98] tracking-[-2px] text-ink">
              Start earning today.
            </h2>
            <p className="mb-9 max-w-[520px] text-[clamp(15px,1.5vw,18px)] leading-[1.6] text-ink/70">
              Join the Cylix Research partner program and turn your audience into
              a revenue stream backed by real documentation.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <LocalizedClientLink href="/affiliate/join">
                <span className="inline-flex items-center gap-2 rounded-[22px] bg-ink px-7 py-[14px] font-display text-sm font-bold text-sand transition-transform duration-200 hover:-translate-y-0.5 motion-reduce:hover:translate-y-0">
                  Become a partner →
                </span>
              </LocalizedClientLink>
              <LocalizedClientLink href="/affiliate/dashboard">
                <span className="inline-flex items-center gap-2 rounded-[22px] border border-ink/25 bg-white/40 px-7 py-[14px] font-display text-sm font-bold text-ink transition-colors duration-200 hover:bg-white/70">
                  Partner login
                </span>
              </LocalizedClientLink>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  )
}
