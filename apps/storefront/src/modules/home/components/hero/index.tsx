import Image from "next/image"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Reveal from "@modules/common/components/reveal"

// Vials use the existing render PNGs in /public/products. These renders carry a
// white background, so `mixBlendMode: multiply` against the light panel dissolves
// it and leaves only the vial floating. Swap `img` for premium Higgsfield renders
// later — sizing is driven by height + aspectRatio so any render slots straight in.
const VIALS: {
  img: string
  alt: string
  aspect: number // width / height of the source render
  height: string // responsive target height (clamped so it never overflows)
  rotate: string
  drop: string
  delay: string // stagger for the float animation
}[] = [
  { img: "/products/premium/bpc-157.png", alt: "BPC-157 research vial", aspect: 120 / 210, height: "clamp(150px, 30vw, 250px)", rotate: "-9deg", drop: "10px", delay: "0s" },
  { img: "/products/premium/nad.png", alt: "NAD+ research vial", aspect: 120 / 260, height: "clamp(180px, 38vw, 320px)", rotate: "-2deg", drop: "0px", delay: "0.9s" },
  { img: "/products/premium/ghk-cu.png", alt: "GHK-Cu research vial", aspect: 120 / 230, height: "clamp(165px, 34vw, 288px)", rotate: "6deg", drop: "6px", delay: "0.45s" },
  { img: "/products/premium/tesamorelin.png", alt: "Tesamorelin research vial", aspect: 120 / 195, height: "clamp(140px, 28vw, 234px)", rotate: "13deg", drop: "16px", delay: "1.3s" },
]

const TRUST = [
  { icon: "🧪", text: "99%+ Purity Verified" },
  { icon: "🚚", text: "Free Shipping Always" },
  { icon: "📋", text: "CoA on Every Lot" },
  { icon: "⚡", text: "12–24hr Dispatch" },
  { icon: "🛡️", text: "USA Based" },
]

const Hero = () => {
  return (
    <div className="relative w-full overflow-hidden bg-sand">
      {/* SPLIT HERO */}
      <div className="grid min-h-[560px] grid-cols-1 lg:grid-cols-2">
        {/* LEFT — text */}
        <div className="flex flex-col justify-center bg-sand px-[clamp(20px,6vw,56px)] py-[clamp(40px,8vw,72px)]">
          <Reveal>
            <div className="mb-5 flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[1.5px] text-gold-600">
              <span className="inline-block h-px w-5 bg-gold-500" />
              Research Materials
            </div>
          </Reveal>

          <Reveal delay={80}>
            <h1 className="mb-[18px] font-display text-[clamp(34px,5vw,58px)] font-black leading-[1.07] tracking-[-1.5px] text-ink">
              Research Peptides
              <br />
              You Can{" "}
              <em className="not-italic text-gold-500">Trust.</em>
            </h1>
          </Reveal>

          <Reveal delay={160}>
            <p className="mb-8 max-w-[380px] text-sm leading-[1.8] text-ink/55">
              Research-grade peptides with a Certificate of Analysis on every
              batch. 99%+ identity purity, third-party tested.
            </p>
          </Reveal>

          <Reveal delay={240}>
            <div className="mb-12 flex flex-wrap gap-[10px]">
              <LocalizedClientLink
                href="/store"
                className="inline-flex items-center gap-[7px] rounded-[20px] bg-ink px-[22px] py-3 font-display text-[13px] font-bold text-sand transition-transform duration-200 hover:-translate-y-0.5"
              >
                Browse Catalog →
              </LocalizedClientLink>
              <LocalizedClientLink
                href="/store"
                className="inline-flex items-center gap-[7px] rounded-[20px] border border-cream bg-cream px-[22px] py-3 font-display text-[13px] font-bold text-ink transition-colors duration-200 hover:border-gold-500"
              >
                View Products
              </LocalizedClientLink>
            </div>
          </Reveal>

          {/* Guarantee items */}
          <Reveal delay={320}>
            <div className="flex flex-col gap-3">
              {[
                { color: "#4CAF6E", label: "99% Purity Guaranteed", sub: "Every batch verified" },
                { color: "#5B8FD6", label: "Shipment Protection", sub: "Every order fully covered" },
                { color: "#C9963A", label: "CoA with Every Batch", sub: "Third-party tested" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-[10px]">
                  <div
                    className="flex h-[22px] w-[22px] flex-shrink-0 items-center justify-center rounded-full"
                    style={{ background: item.color }}
                  >
                    <span className="text-[10px] text-white">✓</span>
                  </div>
                  <div>
                    <div className="font-display text-xs font-bold text-ink">{item.label}</div>
                    <div className="text-[11px] text-ink/45">{item.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        {/* RIGHT — the vial stage: gold glow + plinth + chromatogram motif */}
        <div className="relative flex min-h-[clamp(320px,50vw,520px)] items-center justify-center overflow-hidden bg-cream [isolation:isolate]">
          {/* faint HPLC / chromatogram trace motif */}
          <svg
            aria-hidden
            className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.5]"
            viewBox="0 0 800 400"
            preserveAspectRatio="xMidYMid slice"
          >
            {/* baseline grid */}
            {[80, 160, 240, 320].map((y) => (
              <line key={y} x1="0" y1={y} x2="800" y2={y} stroke="#0D0D0D" strokeOpacity="0.04" strokeWidth="1" />
            ))}
            {/* the trace: flat baseline with analytical peaks */}
            <path
              d="M0 300 L120 300 L150 300 Q168 118 186 300 L235 300 Q250 300 262 214 Q274 300 290 300 L380 300 Q398 300 412 96 Q426 300 442 300 L520 300 Q534 300 548 250 Q560 300 574 300 L650 300 Q666 300 680 168 Q694 300 708 300 L800 300"
              fill="none"
              stroke="#C9963A"
              strokeOpacity="0.28"
              strokeWidth="2"
              strokeLinejoin="round"
            />
          </svg>

          {/* soft gold radial glow behind the vials */}
          <div
            className="pointer-events-none absolute left-1/2 top-[46%] h-[min(520px,80%)] w-[min(520px,86%)] -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(201,150,58,0.32) 0%, rgba(201,150,58,0.12) 38%, rgba(201,150,58,0) 70%)",
            }}
          />

          {/* plinth shadow the vials rest on */}
          <div
            className="pointer-events-none absolute left-1/2 top-[76%] h-[42px] w-[min(440px,74%)] -translate-x-1/2 rounded-[50%]"
            style={{
              background:
                "radial-gradient(ellipse, rgba(13,13,13,0.16) 0%, rgba(13,13,13,0.06) 45%, rgba(13,13,13,0) 72%)",
            }}
          />

          {/* the vials */}
          <Reveal>
            <div className="relative z-[1] flex max-w-full items-end justify-center gap-[max(2px,0.6vw)] px-[clamp(16px,4vw,40px)]">
              {VIALS.map((v) => (
                // Outer wrapper holds the static fan rotation; inner element owns
                // the `.animate-float` transform so the two never clobber each
                // other (the float keyframe animates `transform`).
                <div
                  key={v.img}
                  className="flex-shrink"
                  style={{
                    height: v.height,
                    aspectRatio: String(v.aspect),
                    transform: `rotate(${v.rotate}) translateY(${v.drop})`,
                  }}
                >
                  <div
                    className="animate-float relative h-full w-full"
                    style={{ animationDelay: v.delay }}
                  >
                    <Image
                      src={v.img}
                      alt={v.alt}
                      fill
                      priority
                      sizes="(max-width: 1024px) 40vw, 20vw"
                      className="object-contain object-bottom"
                      style={{ mixBlendMode: "multiply" }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>

      {/* TRUST BAR */}
      <div className="flex overflow-x-auto border-y border-cream bg-sand px-8">
        {TRUST.map((item) => (
          <div
            key={item.text}
            className="flex items-center gap-2 whitespace-nowrap border-r border-cream px-6 py-[13px] font-display text-[11px] font-bold text-ink/70"
          >
            <span>{item.icon}</span> {item.text}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Hero
