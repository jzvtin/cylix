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
  // Origin-labs is a clean flat canvas (no atmosphere/chromatogram). Keep just a
  // very light warm base so there's never a white flash; sections paint their
  // own backgrounds on top.
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10"
      style={{ background: "#fcfaf6" }}
    />
  )
}

export default SiteBackground
