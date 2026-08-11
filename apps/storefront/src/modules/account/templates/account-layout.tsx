import React from "react"

import LocalizedClientLink from "@modules/common/components/localized-client-link"

import AccountNav from "../components/account-nav"
import { HttpTypes } from "@medusajs/types"

interface AccountLayoutProps {
  customer: HttpTypes.StoreCustomer | null
  children: React.ReactNode
}

const AccountLayout: React.FC<AccountLayoutProps> = ({
  customer,
  children,
}) => {
  // Signed-out (login / register): a full-bleed, centered auth experience that
  // lets the site atmosphere read through behind the glass card.
  if (!customer) {
    return (
      <div
        className="w-full min-h-[78vh] flex items-center justify-center px-4 py-16 small:py-24"
        data-testid="account-page"
      >
        {children}
      </div>
    )
  }

  // Signed-in: the dashboard shell — sticky glass sidebar + content column.
  return (
    <div className="flex-1 w-full py-10 small:py-16" data-testid="account-page">
      <div className="content-container">
        <div className="grid grid-cols-1 gap-8 small:grid-cols-[280px_1fr] small:gap-10">
          <aside className="small:sticky small:top-24 h-fit">
            <AccountNav customer={customer} />
          </aside>
          <main className="min-w-0">{children}</main>
        </div>

        {/* Support band */}
        <div className="mt-12 small:mt-16 cx-glass rounded-[24px] p-8 flex flex-col small:flex-row items-start small:items-center justify-between gap-6">
          <div>
            <span className="cx-eyebrow mb-3">Support</span>
            <h3 className="cx-h text-2xl mt-3 mb-1">Got questions?</h3>
            <p className="text-ink/60 max-w-md">
              Find frequently asked questions and answers on our customer
              service page — our team is here to help.
            </p>
          </div>
          <LocalizedClientLink
            href="/customer-service"
            className="cx-btn cx-btn-ghost whitespace-nowrap"
          >
            Customer Service
          </LocalizedClientLink>
        </div>
      </div>
    </div>
  )
}

export default AccountLayout
