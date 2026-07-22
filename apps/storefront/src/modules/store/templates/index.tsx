import { Suspense } from "react"
import { OptionValueIds } from "@lib/util/product-option-filters"
import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import PaginatedProducts from "./paginated-products"

const StoreTemplate = ({
  sortBy, page, countryCode, optionValueIds,
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
      {/* CATALOG HEADER */}
      <div style={{background:"#111",padding:"clamp(32px, 7vw, 48px) clamp(16px, 4vw, 32px) 40px"}}>
        <div style={{maxWidth:"1200px",margin:"0 auto"}}>
          <div style={{fontFamily:"'Outfit',sans-serif",fontSize:"10px",fontWeight:800,letterSpacing:"1.4px",textTransform:"uppercase" as const,color:"#C9963A",marginBottom:"10px"}}>Full Catalog</div>
          <h1 style={{fontFamily:"'Outfit',sans-serif",fontSize:"clamp(28px,5vw,44px)",fontWeight:900,color:"#fff",letterSpacing:"-1.2px",marginBottom:"8px",lineHeight:1.05}}>
            Research <em style={{fontStyle:"normal",color:"#C9963A"}}>Compounds</em>
          </h1>
          <p style={{fontSize:"14px",color:"rgba(255,255,255,0.45)",maxWidth:"440px",lineHeight:1.65}}>
            30+ analytical-grade compounds. Third-party verified to 99%+ purity. Free shipping on every order.
          </p>
        </div>
      </div>

      {/* CATALOG BODY */}
      <div style={{background:"#F9F7F4",minHeight:"60vh"}}>
        <div className="catalog-layout">

          {/* SIDEBAR */}
          <div className="catalog-sidebar">
            <div style={{background:"#fff",border:"1px solid #E8E4DE",borderRadius:"12px",padding:"20px",marginBottom:"16px"}}>
              <div style={{fontFamily:"'Outfit',sans-serif",fontSize:"10px",fontWeight:800,letterSpacing:"1px",textTransform:"uppercase" as const,color:"#999",marginBottom:"14px"}}>Sort & Filter</div>
              <RefinementList sortBy={sort} />
            </div>
            {/* Trust sidebar */}
            <div style={{background:"#fff",border:"1px solid #E8E4DE",borderRadius:"12px",padding:"16px"}}>
              <div style={{fontFamily:"'Outfit',sans-serif",fontSize:"10px",fontWeight:800,letterSpacing:"1px",textTransform:"uppercase" as const,color:"#C9963A",marginBottom:"12px"}}>Every Order</div>
              {[
                {icon:"🧪",text:"99%+ Purity"},
                {icon:"📋",text:"CoA Included"},
                {icon:"🚚",text:"Free Shipping"},
                {icon:"⚡",text:"12–24hr Dispatch"},
              ].map(b => (
                <div key={b.text} style={{display:"flex",alignItems:"center",gap:"8px",fontSize:"11px",fontFamily:"'Outfit',sans-serif",fontWeight:600,color:"#444",padding:"6px 0",borderBottom:"1px solid #F0EDE8"}}>
                  <span>{b.icon}</span>{b.text}
                </div>
              ))}
            </div>
          </div>

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

      {/* COMPLIANCE BAR */}
      <div style={{background:"#F0EDE8",borderTop:"1px solid #E8E4DE",padding:"28px 32px",textAlign:"center" as const}}>
        <p style={{fontSize:"11px",color:"#999",maxWidth:"600px",margin:"0 auto",lineHeight:1.7,fontFamily:"'Outfit',sans-serif"}}>
          All products are for in-vitro laboratory research only. Not for human or animal consumption. Must be 21+ to purchase.
        </p>
      </div>
    </>
  )
}

export default StoreTemplate