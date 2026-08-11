/**
 * SiteBackground — the one designed, cohesive atmosphere that sits behind every
 * page. Pure CSS/SVG, no JS, `fixed inset-0` so it never scrolls and never
 * costs layout. Four stacked layers:
 *   1. warm cream base gradient (never flat white)
 *   2. soft gold glow (two low-alpha radial pools, top-right + lower-left)
 *   3. a faint chromatogram / lab motif ghosted along the lower third
 *   4. an ultra-fine grain so large flat areas read as paper, not screen
 *
 * Content surfaces are translucent (`bg-white/70 backdrop-blur`) so this shows
 * through; dark contrast bands (marquee, CTA, footer) deliberately cover it.
 */
const SiteBackground = () => {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* 1 — warm cream base */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg,#F7F4EF 0%,#F4F0E9 42%,#EFEAE1 100%)",
        }}
      />

      {/* 2 — soft gold glow pools */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 45% at 84% 8%, rgba(201,150,58,0.10) 0%, rgba(201,150,58,0) 60%)," +
            "radial-gradient(55% 40% at 8% 78%, rgba(201,150,58,0.07) 0%, rgba(201,150,58,0) 62%)",
        }}
      />

      {/* 3 — chromatogram motif, ghosted along the bottom */}
      <svg
        className="absolute inset-x-0 bottom-0 h-[46vh] w-full"
        viewBox="0 0 1440 420"
        preserveAspectRatio="none"
        fill="none"
        style={{ opacity: 0.06 }}
      >
        <path
          d="M0 400 H360 C400 400 405 250 430 250 C455 250 460 400 500 400 H720 C760 400 762 90 792 90 C822 90 824 400 864 400 H1040 C1085 400 1088 300 1112 300 C1136 300 1140 400 1180 400 H1440"
          stroke="#C9963A"
          strokeWidth="2"
        />
        <path
          d="M0 400 H250 C300 400 305 340 330 340 C355 340 360 400 410 400 H980 C1030 400 1034 200 1060 200 C1086 200 1090 400 1140 400 H1440"
          stroke="#0D0D0D"
          strokeWidth="1.4"
          strokeOpacity="0.5"
        />
      </svg>

      {/* 4 — ultra-fine grain */}
      <div
        className="absolute inset-0 mix-blend-soft-light"
        style={{
          opacity: 0.5,
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E\")",
          backgroundSize: "140px 140px",
        }}
      />
    </div>
  )
}

export default SiteBackground
