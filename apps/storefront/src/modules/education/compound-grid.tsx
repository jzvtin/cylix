"use client"

import React, { useMemo, useState } from "react"
import Image from "next/image"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { CompoundReference } from "./data"

type Props = {
  compounds: CompoundReference[]
}

/** Searchable + category-filterable grid of compound reference cards. */
const CompoundGrid = ({ compounds }: Props) => {
  const [query, setQuery] = useState("")
  const [category, setCategory] = useState<string>("All")

  const categories = useMemo(() => {
    const set = new Set(compounds.map((c) => c.category))
    return ["All", ...Array.from(set)]
  }, [compounds])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return compounds.filter((c) => {
      const matchesCat = category === "All" || c.category === category
      const matchesQuery =
        !q ||
        c.code.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q) ||
        c.researchSummary.toLowerCase().includes(q)
      return matchesCat && matchesQuery
    })
  }, [compounds, query, category])

  return (
    <div>
      {/* Controls */}
      <div className="mb-8 flex flex-col gap-4">
        <div className="relative">
          <label htmlFor="cx-edu-search" className="sr-only">
            Search reference standards
          </label>
          <input
            id="cx-edu-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by code or class…"
            className="w-full rounded-full border border-cream bg-white/70 px-5 py-3.5 pl-11 font-display text-[14px] font-semibold text-ink outline-none transition-colors placeholder:font-medium placeholder:text-ink/35 focus:border-gold-400 focus:ring-2 focus:ring-gold-200"
          />
          <span
            aria-hidden
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink/35"
          >
            ⌕
          </span>
        </div>

        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              aria-pressed={category === cat}
              className={`rounded-full border px-3.5 py-1.5 font-display text-[11.5px] font-bold transition-colors ${
                category === cat
                  ? "border-ink bg-ink text-cream"
                  : "border-cream bg-white/60 text-ink/60 hover:border-gold-300 hover:text-ink"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <p className="py-16 text-center text-[14px] text-ink/50">
          No reference standards match “{query}”.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((c) => (
            <LocalizedClientLink
              key={c.slug}
              href={`/education/${c.slug}`}
              className="cx-glass group flex flex-col rounded-[22px] p-5 transition-transform duration-200 hover:-translate-y-1 focus-visible:-translate-y-1 motion-reduce:transform-none motion-reduce:transition-none"
            >
              <div className="mb-4 flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  {c.image ? (
                    <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl border border-cream bg-white/80">
                      <Image
                        src={`/products/web/${c.image}.jpg`}
                        alt=""
                        width={48}
                        height={48}
                        className="h-full w-full object-cover"
                      />
                    </span>
                  ) : (
                    <span
                      aria-hidden
                      className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl border border-gold-200 bg-gold-50 font-display text-[15px] font-black text-gold-700"
                    >
                      {c.code.replace(/[^A-Za-z0-9+]/g, "").slice(0, 3)}
                    </span>
                  )}
                  <div>
                    <div className="font-display text-[20px] font-black leading-none tracking-[-0.4px] text-ink">
                      {c.code}
                    </div>
                    <div className="mt-1.5 text-[10.5px] font-semibold uppercase tracking-[0.5px] text-gold-700">
                      {c.category}
                    </div>
                  </div>
                </div>
              </div>

              <p className="flex-1 text-[13px] leading-[1.65] text-ink/60">
                {c.researchSummary.split(". ")[0]}.
              </p>

              <span className="mt-4 inline-flex items-center gap-1.5 font-display text-[12.5px] font-bold text-ink">
                View reference
                <span className="text-gold-600 transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transition-none">
                  →
                </span>
              </span>
            </LocalizedClientLink>
          ))}
        </div>
      )}
    </div>
  )
}

export default CompoundGrid
