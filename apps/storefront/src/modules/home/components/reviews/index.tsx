import Reveal from "@modules/common/components/reveal"

// NOTE: sample social-proof data for layout. Swap for real verified reviews.
const REVIEWS = [
  { quote: "The CoA matched the lot number on the vial exactly. First supplier I've used where the paperwork actually lines up.", name: "Dr. M. Reyes", role: "Verified researcher", stars: 5 },
  { quote: "Ordered before 2pm, shipped same day, tracking within the hour. Purity came back at 99.3% on my own re-test.", name: "J. Kowalski", role: "Verified researcher", stars: 5 },
  { quote: "Discreet packaging, clean documentation, and a human answered my email in a few hours. Rare combination.", name: "A. Bennett", role: "Verified researcher", stars: 5 },
]

const Star = ({ filled }: { filled: boolean }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round">
    <path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9L12 3z" />
  </svg>
)

const Reviews = () => {
  return (
    <section className="border-t border-cream bg-cream px-[clamp(18px,5vw,32px)] py-[clamp(44px,8vw,76px)]">
      <div className="mx-auto max-w-[1200px]">
        <Reveal>
          <div className="mb-9 flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="mb-[10px] font-display text-[10px] font-extrabold uppercase tracking-[1.4px] text-gold-600">
                Trusted by researchers
              </div>
              <h2 className="font-display text-[clamp(22px,3.5vw,30px)] font-extrabold tracking-[-0.6px] text-ink">
                Documentation people actually check.
              </h2>
            </div>
            <div className="flex items-center gap-3 rounded-[14px] border border-cream bg-sand px-5 py-3">
              <div className="flex text-gold-500">
                {[0, 1, 2, 3, 4].map((s) => (
                  <Star key={s} filled />
                ))}
              </div>
              <div>
                <div className="font-display text-sm font-extrabold text-ink">4.9 / 5</div>
                <div className="text-[10px] text-ink/50">1,200+ verified orders · sample</div>
              </div>
            </div>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {REVIEWS.map((r, i) => (
            <Reveal key={r.name} delay={i * 90}>
              <figure className="flex h-full flex-col rounded-[16px] border border-cream bg-white p-6">
                <div className="mb-3 flex text-gold-500">
                  {[0, 1, 2, 3, 4].map((s) => (
                    <Star key={s} filled={s < r.stars} />
                  ))}
                </div>
                <blockquote className="m-0 flex-1 text-[13px] leading-[1.75] text-ink/75">
                  &ldquo;{r.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-4 flex items-center gap-3 border-t border-cream pt-4">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-cream font-display text-[13px] font-bold text-gold-600">
                    {r.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-display text-xs font-bold text-ink">{r.name}</div>
                    <div className="text-[10px] text-ink/50">{r.role}</div>
                  </div>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Reviews
