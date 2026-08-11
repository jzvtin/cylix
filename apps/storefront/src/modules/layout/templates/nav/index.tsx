import { Suspense } from "react"
import { listLocales } from "@lib/data/locales"
import { getLocale } from "@lib/data/locale-actions"
import { listRegions } from "@lib/data/regions"
import { StoreRegion } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import SideMenu from "@modules/layout/components/side-menu"
import NavShell from "@modules/layout/components/nav-shell"

const NAV_LINKS = [
  { label: "Catalog", href: "/store" },
  { label: "Education", href: "/education" },
  { label: "Partners", href: "/affiliate" },
  { label: "FAQ", href: "/faq" },
  { label: "Support", href: "/support" },
]

export default async function Nav() {
  const [regions, locales, currentLocale] = await Promise.all([
    listRegions().then((regions: StoreRegion[]) => regions),
    listLocales(),
    getLocale(),
  ])

  return (
    <NavShell>
      <header className="nav-header mx-auto flex h-[60px] max-w-[1200px] items-center justify-between gap-5 px-6 md:px-8">
        {/* LEFT — mobile menu + desktop nav links */}
        <div className="nav-side flex flex-1 items-center gap-6">
          <div className="flex items-center text-[13px] font-medium text-ink/70 transition-colors hover:text-ink">
            <SideMenu
              regions={regions}
              locales={locales}
              currentLocale={currentLocale}
            />
          </div>
          <div className="nav-desktop-links hidden items-center gap-7 small:flex">
            {NAV_LINKS.map((link) => (
              <LocalizedClientLink
                key={link.href}
                href={link.href}
                className="group relative text-[13px] font-medium tracking-tight text-ink/70 transition-colors duration-200 hover:text-ink"
              >
                {link.label}
                <span className="pointer-events-none absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-gold-500 transition-transform duration-300 ease-out group-hover:scale-x-100 motion-reduce:transition-none" />
              </LocalizedClientLink>
            ))}
          </div>
        </div>

        {/* CENTER — brand wordmark */}
        <LocalizedClientLink
          href="/"
          className="nav-brand flex shrink-0 items-center gap-1 whitespace-nowrap font-display text-[15px] font-extrabold uppercase tracking-tight text-ink transition-opacity hover:opacity-80"
        >
          Cylix Research
          <span className="ml-px inline-block h-[5px] w-[5px] rounded-full bg-gold-500" />
        </LocalizedClientLink>

        {/* RIGHT — account + cart */}
        <div className="nav-side flex flex-1 items-center justify-end gap-2">
          <LocalizedClientLink
            href="/account"
            className="hidden rounded-full border border-cream px-3.5 py-1.5 text-[12px] font-semibold text-ink/60 transition-colors duration-200 hover:border-gold-500 hover:text-ink xsmall:inline-flex"
          >
            Account
          </LocalizedClientLink>
          <Suspense
            fallback={
              <LocalizedClientLink
                href="/cart"
                className="inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-[7px] text-[12px] font-bold text-sand transition-colors hover:bg-gold-600"
              >
                Cart (0)
              </LocalizedClientLink>
            }
          >
            <CartButton />
          </Suspense>
        </div>
      </header>
    </NavShell>
  )
}
