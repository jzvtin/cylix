"use client"

import { ArrowRightOnRectangle } from "@medusajs/icons"
import { clx } from "@modules/common/components/ui"
import { useParams, usePathname } from "next/navigation"

import { signout } from "@lib/data/customer"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ChevronDown from "@modules/common/icons/chevron-down"
import MapPin from "@modules/common/icons/map-pin"
import Package from "@modules/common/icons/package"
import User from "@modules/common/icons/user"

const OverviewIcon = ({ size = 20 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.7"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="3" width="7" height="9" rx="1.5" />
    <rect x="14" y="3" width="7" height="5" rx="1.5" />
    <rect x="14" y="12" width="7" height="9" rx="1.5" />
    <rect x="3" y="16" width="7" height="5" rx="1.5" />
  </svg>
)

const AccountNav = ({
  customer,
}: {
  customer: HttpTypes.StoreCustomer | null
}) => {
  const route = usePathname()
  const { countryCode } = useParams() as { countryCode: string }

  const handleLogout = async () => {
    await signout(countryCode)
  }

  const initials = `${customer?.first_name?.[0] ?? ""}${
    customer?.last_name?.[0] ?? ""
  }`.toUpperCase()

  return (
    <div>
      {/* ── Mobile ─────────────────────────────────────────────── */}
      <div className="small:hidden" data-testid="mobile-account-nav">
        {route !== `/${countryCode}/account` ? (
          <LocalizedClientLink
            href="/account"
            className="flex items-center gap-x-2 text-sm font-display font-bold text-ink py-2"
            data-testid="account-main-link"
          >
            <ChevronDown className="transform rotate-90" />
            <span>Back to account</span>
          </LocalizedClientLink>
        ) : (
          <div className="cx-glass rounded-[24px] p-5">
            <div className="flex items-center gap-3 pb-5 mb-2 border-b cx-hairline">
              <div className="h-12 w-12 rounded-full bg-ink text-sand flex items-center justify-center font-display font-black">
                {initials || <User size={20} />}
              </div>
              <div className="min-w-0">
                <div className="font-display font-extrabold text-ink leading-tight">
                  Hello {customer?.first_name}
                </div>
                <div className="text-xs text-ink/50 truncate">
                  {customer?.email}
                </div>
              </div>
            </div>
            <ul className="flex flex-col">
              <MobileRow
                href="/account/profile"
                icon={<User size={18} />}
                label="Profile"
                testid="profile-link"
              />
              <MobileRow
                href="/account/addresses"
                icon={<MapPin size={18} />}
                label="Addresses"
                testid="addresses-link"
              />
              <MobileRow
                href="/account/orders"
                icon={<Package size={18} />}
                label="Orders"
                testid="orders-link"
              />
              <li>
                <button
                  type="button"
                  className="flex items-center justify-between py-4 w-full text-ink/80"
                  onClick={handleLogout}
                  data-testid="logout-button"
                >
                  <div className="flex items-center gap-x-3">
                    <ArrowRightOnRectangle />
                    <span>Log out</span>
                  </div>
                  <ChevronDown className="transform -rotate-90 text-ink/30" />
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>

      {/* ── Desktop ────────────────────────────────────────────── */}
      <div className="hidden small:block" data-testid="account-nav">
        <div className="cx-glass rounded-[24px] p-5">
          <div className="flex items-center gap-3 pb-5 mb-4 border-b cx-hairline">
            <div className="h-12 w-12 rounded-full bg-ink text-sand flex items-center justify-center font-display font-black shrink-0">
              {initials || <User size={20} />}
            </div>
            <div className="min-w-0">
              <div className="font-display font-extrabold text-ink leading-tight truncate">
                {customer?.first_name} {customer?.last_name}
              </div>
              <div className="text-xs text-ink/50 truncate">
                {customer?.email}
              </div>
            </div>
          </div>

          <nav>
            <ul className="flex flex-col gap-y-1">
              <li>
                <AccountNavLink
                  href="/account"
                  route={route!}
                  icon={<OverviewIcon size={18} />}
                  data-testid="overview-link"
                >
                  Overview
                </AccountNavLink>
              </li>
              <li>
                <AccountNavLink
                  href="/account/orders"
                  route={route!}
                  icon={<Package size={18} />}
                  data-testid="orders-link"
                >
                  Orders
                </AccountNavLink>
              </li>
              <li>
                <AccountNavLink
                  href="/account/addresses"
                  route={route!}
                  icon={<MapPin size={18} />}
                  data-testid="addresses-link"
                >
                  Addresses
                </AccountNavLink>
              </li>
              <li>
                <AccountNavLink
                  href="/account/profile"
                  route={route!}
                  icon={<User size={18} />}
                  data-testid="profile-link"
                >
                  Profile
                </AccountNavLink>
              </li>
            </ul>
          </nav>

          <div className="mt-3 pt-3 border-t cx-hairline">
            <button
              type="button"
              onClick={handleLogout}
              data-testid="logout-button"
              className="flex items-center gap-x-3 rounded-full px-4 py-3 w-full text-sm font-medium text-ink/60 hover:text-ink hover:bg-ink/5 transition-colors"
            >
              <ArrowRightOnRectangle />
              <span>Log out</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

const MobileRow = ({
  href,
  icon,
  label,
  testid,
}: {
  href: string
  icon: React.ReactNode
  label: string
  testid: string
}) => (
  <li>
    <LocalizedClientLink
      href={href}
      className="flex items-center justify-between py-4 border-b cx-hairline text-ink/85"
      data-testid={testid}
    >
      <div className="flex items-center gap-x-3">
        {icon}
        <span>{label}</span>
      </div>
      <ChevronDown className="transform -rotate-90 text-ink/30" />
    </LocalizedClientLink>
  </li>
)

type AccountNavLinkProps = {
  href: string
  route: string
  icon: React.ReactNode
  children: React.ReactNode
  "data-testid"?: string
}

const AccountNavLink = ({
  href,
  route,
  icon,
  children,
  "data-testid": dataTestId,
}: AccountNavLinkProps) => {
  const { countryCode }: { countryCode: string } = useParams()

  const active = route.split(countryCode)[1] === href
  return (
    <LocalizedClientLink
      href={href}
      className={clx(
        "flex items-center gap-x-3 rounded-full px-4 py-3 text-sm font-medium transition-colors",
        {
          "bg-ink text-sand shadow-sm": active,
          "text-ink/70 hover:text-ink hover:bg-ink/5": !active,
        }
      )}
      data-testid={dataTestId}
    >
      <span className={clx({ "text-gold-400": active })}>{icon}</span>
      {children}
    </LocalizedClientLink>
  )
}

export default AccountNav
