import { Suspense } from "react"
import { listLocales } from "@lib/data/locales"
import { getLocale } from "@lib/data/locale-actions"
import { listRegions } from "@lib/data/regions"
import { StoreRegion } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import SideMenu from "@modules/layout/components/side-menu"

export default async function Nav() {
  const [regions, locales, currentLocale] = await Promise.all([
    listRegions().then((regions: StoreRegion[]) => regions),
    listLocales(),
    getLocale(),
  ])

  return (
    <div style={{position:"sticky",top:0,insetInline:0,zIndex:50,background:"#fff",borderBottom:"1px solid #E8E4DE"}}>
      <header style={{height:"58px",maxWidth:"1200px",margin:"0 auto",padding:"0 32px",display:"flex",alignItems:"center",justifyContent:"space-between",gap:"20px"}}>
        
        {/* LEFT — mobile menu + nav links */}
        <div style={{display:"flex",alignItems:"center",gap:"24px",flex:1}}>
          <SideMenu regions={regions} locales={locales} currentLocale={currentLocale} />
          <div style={{display:"flex",gap:"24px",alignItems:"center"}}>
            <LocalizedClientLink href="/store" style={{fontFamily:"'Outfit',sans-serif",fontSize:"13px",fontWeight:500,color:"#444",textDecoration:"none"}}>
              Products
            </LocalizedClientLink>
            <LocalizedClientLink href="/faq" style={{fontFamily:"'Outfit',sans-serif",fontSize:"13px",fontWeight:500,color:"#444",textDecoration:"none"}}>
              FAQ
            </LocalizedClientLink>
            <LocalizedClientLink href="/support" style={{fontFamily:"'Outfit',sans-serif",fontSize:"13px",fontWeight:500,color:"#444",textDecoration:"none"}}>
              Support
            </LocalizedClientLink>
          </div>
        </div>

        {/* CENTER — brand */}
        <LocalizedClientLink href="/" style={{fontFamily:"'Outfit',sans-serif",fontSize:"15px",fontWeight:900,color:"#111",textDecoration:"none",textTransform:"uppercase",letterSpacing:"-0.2px",display:"flex",alignItems:"center",gap:"4px",whiteSpace:"nowrap"}}>
          Cylix Research
          <span style={{width:"5px",height:"5px",background:"#C9963A",borderRadius:"50%",display:"inline-block",marginLeft:"1px"}}></span>
        </LocalizedClientLink>

        {/* RIGHT — account + cart */}
        <div style={{display:"flex",alignItems:"center",gap:"8px",flex:1,justifyContent:"flex-end"}}>
          <LocalizedClientLink href="/account" style={{fontFamily:"'Outfit',sans-serif",fontSize:"12px",fontWeight:600,color:"#666",textDecoration:"none",padding:"6px 12px",border:"1px solid #E8E4DE",borderRadius:"20px",transition:"all .15s"}}>
            Account
          </LocalizedClientLink>
          <Suspense fallback={
            <LocalizedClientLink href="/cart" style={{fontFamily:"'Outfit',sans-serif",fontSize:"12px",fontWeight:700,color:"#fff",background:"#111",textDecoration:"none",padding:"7px 16px",borderRadius:"20px",display:"inline-flex",alignItems:"center",gap:"6px"}}>
              Cart (0)
            </LocalizedClientLink>
          }>
            <CartButton />
          </Suspense>
        </div>
      </header>
    </div>
  )
}