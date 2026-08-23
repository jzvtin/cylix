import LocalizedClientLink from "@modules/common/components/localized-client-link"
import React from "react"

const Help = () => {
  return (
    <div className="mt-6">
      <h2 className="font-display text-[13px] font-bold text-ink">Need help?</h2>
      <div className="my-2 text-[14px] text-ink/60">
        <ul className="flex flex-col gap-y-2">
          <li>
            <LocalizedClientLink
              href="/contact"
              className="transition-colors hover:text-gold-700"
            >
              Contact
            </LocalizedClientLink>
          </li>
          <li>
            <LocalizedClientLink
              href="/contact"
              className="transition-colors hover:text-gold-700"
            >
              Returns & Exchanges
            </LocalizedClientLink>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default Help
