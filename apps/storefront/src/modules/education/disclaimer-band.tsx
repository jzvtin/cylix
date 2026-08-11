import React from "react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

/** Prominent research-use-only disclaimer callout for education pages. */
const DisclaimerBand = () => {
  return (
    <div className="flex gap-4 rounded-2xl border border-gold-200 bg-gradient-to-br from-gold-50 to-[#FDF6E9] px-5 py-5 sm:px-6">
      <div
        aria-hidden
        className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-gold-100 text-[18px]"
      >
        ⚠️
      </div>
      <div>
        <div className="mb-1.5 font-display text-[10px] font-extrabold uppercase tracking-[1.2px] text-gold-700">
          For research use only
        </div>
        <p className="m-0 text-[13.5px] font-semibold leading-[1.7] text-gold-800">
          This library is analytical reference information about in-vitro
          laboratory reference standards. It is not dosing guidance, a protocol,
          or an instruction for use. Nothing sold or described by Cylix Research
          is for human or animal consumption, injection, or administration of any
          kind. See our{" "}
          <LocalizedClientLink
            href="/disclaimer"
            className="underline decoration-gold-400 underline-offset-2 hover:text-gold-900"
          >
            Research Use Only disclaimer
          </LocalizedClientLink>
          .
        </p>
      </div>
    </div>
  )
}

export default DisclaimerBand
