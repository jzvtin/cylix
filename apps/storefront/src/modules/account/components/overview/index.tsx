import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"
import MapPin from "@modules/common/icons/map-pin"
import Package from "@modules/common/icons/package"
import User from "@modules/common/icons/user"

type OverviewProps = {
  customer: HttpTypes.StoreCustomer | null
  orders: HttpTypes.StoreOrder[] | null
}

const Overview = ({ customer, orders }: OverviewProps) => {
  const profileCompletion = getProfileCompletion(customer)
  const addressCount = customer?.addresses?.length || 0
  const orderCount = orders?.length || 0
  const memberSince = customer?.created_at
    ? new Date(customer.created_at).getFullYear()
    : "—"

  return (
    <div data-testid="overview-page-wrapper" className="flex flex-col gap-8">
      {/* Welcome header */}
      <div>
        <span className="cx-eyebrow mb-4">Member dashboard</span>
        <h1 className="cx-h text-4xl small:text-5xl mt-4">
          Welcome back,{" "}
          <em
            data-testid="welcome-message"
            data-value={customer?.first_name}
          >
            {customer?.first_name}
          </em>
        </h1>
        <p className="text-ink/55 mt-3">
          Signed in as{" "}
          <span
            className="font-semibold text-ink/80"
            data-testid="customer-email"
            data-value={customer?.email}
          >
            {customer?.email}
          </span>
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total orders" value={`${orderCount}`} suffix="placed" />
        <StatCard
          label="Profile"
          value={`${profileCompletion}%`}
          suffix="complete"
          testid="customer-profile-completion"
          dataValue={profileCompletion}
        />
        <StatCard
          label="Addresses"
          value={`${addressCount}`}
          suffix="saved"
          testid="addresses-count"
          dataValue={addressCount}
        />
        <StatCard label="Member since" value={`${memberSince}`} suffix="est." />
      </div>

      {/* Recent orders */}
      <div className="cx-glass rounded-[24px] p-6 small:p-8">
        <div className="flex items-center justify-between mb-5">
          <h3 className="cx-h text-xl">Recent orders</h3>
          <LocalizedClientLink
            href="/account/orders"
            className="text-sm font-semibold text-gold-700 hover:text-gold-600"
          >
            View all
          </LocalizedClientLink>
        </div>
        <ul className="flex flex-col gap-y-3" data-testid="orders-wrapper">
          {orders && orders.length > 0 ? (
            orders.slice(0, 4).map((order) => (
              <li
                key={order.id}
                data-testid="order-wrapper"
                data-value={order.id}
              >
                <LocalizedClientLink
                  href={`/account/orders/details/${order.id}`}
                  className="group flex items-center justify-between gap-4 rounded-2xl bg-white/60 hover:bg-white border border-ink/5 hover:border-gold-200 px-5 py-4 transition-colors"
                >
                  <div className="grid grid-cols-3 gap-x-4 flex-1 min-w-0">
                    <div className="flex flex-col">
                      <span className="text-[11px] uppercase tracking-wide text-ink/40 font-semibold">
                        Date
                      </span>
                      <span
                        className="text-sm text-ink/80"
                        data-testid="order-created-date"
                      >
                        {new Date(order.created_at).toDateString()}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[11px] uppercase tracking-wide text-ink/40 font-semibold">
                        Order
                      </span>
                      <span
                        className="text-sm text-ink/80 font-semibold"
                        data-testid="order-id"
                        data-value={order.display_id}
                      >
                        #{order.display_id}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[11px] uppercase tracking-wide text-ink/40 font-semibold">
                        Total
                      </span>
                      <span
                        className="text-sm text-ink/80 font-display font-bold"
                        data-testid="order-amount"
                      >
                        {convertToLocale({
                          amount: order.total,
                          currency_code: order.currency_code,
                        })}
                      </span>
                    </div>
                  </div>
                  <span
                    className="shrink-0 h-9 w-9 rounded-full bg-ink/5 group-hover:bg-ink group-hover:text-sand text-ink flex items-center justify-center transition-colors"
                    data-testid="open-order-button"
                  >
                    <span className="sr-only">
                      Go to order #{order.display_id}
                    </span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 6l6 6-6 6" />
                    </svg>
                  </span>
                </LocalizedClientLink>
              </li>
            ))
          ) : (
            <li className="rounded-2xl bg-white/50 border border-ink/5 px-5 py-8 text-center">
              <p className="text-ink/60" data-testid="no-orders-message">
                No recent orders yet.
              </p>
              <LocalizedClientLink
                href="/store"
                className="cx-btn cx-btn-primary mt-4 inline-flex"
              >
                Browse catalog
              </LocalizedClientLink>
            </li>
          )}
        </ul>
      </div>

      {/* Quick links */}
      <div>
        <h3 className="cx-h text-xl mb-4">Quick links</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <QuickLink
            href="/account/orders"
            icon={<Package size={22} />}
            title="Orders"
            desc="Track & review"
          />
          <QuickLink
            href="/account/addresses"
            icon={<MapPin size={22} />}
            title="Addresses"
            desc="Manage shipping"
          />
          <QuickLink
            href="/account/profile"
            icon={<User size={22} />}
            title="Profile"
            desc="Details & security"
          />
          <QuickLink
            href="/store"
            icon={<CoaIcon />}
            title="CoA Library"
            desc="Products & lot data"
          />
        </div>
      </div>
    </div>
  )
}

const StatCard = ({
  label,
  value,
  suffix,
  testid,
  dataValue,
}: {
  label: string
  value: string
  suffix: string
  testid?: string
  dataValue?: string | number
}) => (
  <div className="cx-glass rounded-[20px] p-5">
    <div className="text-[11px] uppercase tracking-wider text-ink/45 font-semibold">
      {label}
    </div>
    <div className="mt-2 flex items-end gap-1.5">
      <span
        className="font-display font-black text-3xl small:text-4xl text-gold-500 leading-none"
        data-testid={testid}
        data-value={dataValue}
      >
        {value}
      </span>
      <span className="text-xs text-ink/40 mb-1">{suffix}</span>
    </div>
  </div>
)

const QuickLink = ({
  href,
  icon,
  title,
  desc,
}: {
  href: string
  icon: React.ReactNode
  title: string
  desc: string
}) => (
  <LocalizedClientLink
    href={href}
    className="group cx-glass rounded-[20px] p-5 flex flex-col gap-3 hover:border-gold-200 transition-colors"
  >
    <span className="h-11 w-11 rounded-full bg-ink/5 text-ink group-hover:bg-gold-500 group-hover:text-ink flex items-center justify-center transition-colors">
      {icon}
    </span>
    <div>
      <div className="font-display font-bold text-ink">{title}</div>
      <div className="text-xs text-ink/50">{desc}</div>
    </div>
  </LocalizedClientLink>
)

const CoaIcon = ({ size = 22 }: { size?: number }) => (
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
    <path d="M6 2h9l5 5v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" />
    <path d="M14 2v5h5" />
    <path d="M9 13l2 2 4-4" />
  </svg>
)

const getProfileCompletion = (customer: HttpTypes.StoreCustomer | null) => {
  let count = 0

  if (!customer) {
    return 0
  }

  if (customer.email) {
    count++
  }

  if (customer.first_name && customer.last_name) {
    count++
  }

  if (customer.phone) {
    count++
  }

  const billingAddress = customer.addresses?.find(
    (addr) => addr.is_default_billing
  )

  if (billingAddress) {
    count++
  }

  return (count / 4) * 100
}

export default Overview
