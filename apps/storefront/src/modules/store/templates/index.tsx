import { Suspense } from "react"
import { OptionValueIds } from "@lib/util/product-option-filters"
import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import PaginatedProducts from "./paginated-products"

const TRUST = [
  {
    label: "99%+ purity",
    path: "M12 3l7 4v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V7l7-4z M9 12l2 2 4-4",
  },
  {
    label: "CoA every lot",
    path: "M7 3h7l5 5v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z M14 3v5h5 M9 13h6 M9 17h6",
  },
  {
    label: "Free shipping",
    path: "M3 7h11v8H3z M14 10h4l3 3v2h-7z M7.5 18a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z M17.5 18a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z",
  },
  {
    label: "12–24h dispatch",
    path: "M12 8v4l3 2 M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z",
  },
]

const StoreTemplate = ({
  sortBy,
  page,
  countryCode,
  optionValueIds,
}: {
  sortBy?: SortOptions
  page?: string
  countryCode: string
  optionValueIds?: OptionValueIds
}) => {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"

  return (
    <>
      {/* ─── CATALOG HERO ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-ink text-white">
        {/* gold glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(70% 120% at 88% 0%, rgba(201,150,58,0.30) 0%, rgba(201,150,58,0) 55%)," +
              "radial-gradient(50% 90% at 6% 100%, rgba(201,150,58,0.12) 0%, rgba(201,150,58,0) 60%)",
          }}
        />
        {/* chromatogram accent */}
        <svg
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[70%] w-full"
          viewBox="0 0 1440 240"
          preserveAspectRatio="none"
          fill="none"
          style={{ opacity: 0.14 }}
        >
          <path
            d="M0 230 H520 C560 230 566 60 596 60 C626 60 632 230 672 230 H980 C1030 230 1034 130 1060 130 C1086 130 1090 230 1140 230 H1440"
            stroke="#C9963A"
            strokeWidth="2"
          />
        </svg>

        <div className="relative mx-auto max-w-[1200px] px-[clamp(16px,4vw,32px)] py-[clamp(40px,7vw,72px)]">
          <div className="cx-eyebrow cx-eyebrow--light mb-5">Full Catalog</div>
          <h1 className="cx-h max-w-[16ch] text-[clamp(32px,6vw,60px)] !text-white">
            Research <em>Compounds.</em>
          </h1>
          <p className="mt-4 max-w-[460px] text-[clamp(14px,1.4vw,16px)] leading-[1.7] text-white/55">
            Analytical-grade reference standards, third-party verified to 99%+
            purity — each with a Certificate of Analysis. Free shipping, every
            order.
          </p>

          {/* trust chips */}
          <div className="mt-8 flex flex-wrap gap-2.5">
            {TRUST.map((t) => (
              <span
                key={t.label}
                className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.06] px-3.5 py-2 font-display text-[12px] font-bold text-white/85 backdrop-blur-sm"
              >
                <svg
                  aria-hidden
                  viewBox="0 0 24 24"
                  className="h-3.5 w-3.5 text-gold-400"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.9"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d={t.path} />
                </svg>
                {t.label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CATALOG BODY (transparent → atmosphere shows through) ─────── */}
      <div className="relative min-h-[60vh]">
        <div className="catalog-layout">
          {/* SIDEBAR */}
          <aside className="catalog-sidebar flex flex-col gap-4">
            <div className="cx-glass rounded-2xl p-5">
              <div className="mb-4 font-display text-[10px] font-extrabold uppercase tracking-[1.2px] text-ink/45">
                Sort &amp; Filter
              </div>
              <RefinementList sortBy={sort} />
            </div>

            <div className="cx-glass rounded-2xl p-5">
              <div className="mb-3 font-display text-[10px] font-extrabold uppercase tracking-[1.2px] text-gold-700">
                Every Order
              </div>
              <ul className="flex flex-col">
                {TRUST.map((t, i) => (
                  <li
                    key={t.label}
                    className={
                      "flex items-center gap-2.5 py-2.5 text-[12.5px] font-semibold text-ink/70" +
                      (i < TRUST.length - 1 ? " border-b border-ink/[0.06]" : "")
                    }
                  >
                    <span className="flex h-6 w-6 items-center justify-center rounded-md bg-gold-50 text-gold-700">
                      <svg
                        aria-hidden
                        viewBox="0 0 24 24"
                        className="h-3.5 w-3.5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.9"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d={t.path} />
                      </svg>
                    </span>
                    {t.label}
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* GRID */}
          <div className="catalog-main">
            <Suspense fallback={<SkeletonProductGrid />}>
              <PaginatedProducts
                sortBy={sort}
                page={pageNumber}
                countryCode={countryCode}
                optionValueIds={optionValueIds}
              />
            </Suspense>
          </div>
        </div>
      </div>

      {/* ─── COMPLIANCE STRIP ─────────────────────────────────────────── */}
      <div className="border-t border-ink/[0.07] bg-white/40 px-8 py-8 text-center backdrop-blur-sm">
        <p className="mx-auto max-w-[620px] font-display text-[11px] leading-[1.8] text-ink/45">
          All products are for in-vitro laboratory research only. Not for human
          or animal consumption. Must be 21 or older to purchase.
        </p>
      </div>
    </>
  )
}

export default StoreTemplate
