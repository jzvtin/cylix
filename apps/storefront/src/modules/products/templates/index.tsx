import React, { Suspense } from "react"
import ImageGallery from "@modules/products/components/image-gallery"
import ProductActions from "@modules/products/components/product-actions"
import ProductTabs from "@modules/products/components/product-tabs"
import RelatedProducts from "@modules/products/components/related-products"
import ProductInfo from "@modules/products/templates/product-info"
import SkeletonRelatedProducts from "@modules/skeletons/templates/skeleton-related-products"
import { notFound } from "next/navigation"
import { HttpTypes } from "@medusajs/types"
import ProductActionsWrapper from "./product-actions-wrapper"

type ProductTemplateProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  countryCode: string
  images: HttpTypes.StoreProductImage[]
}

const ProductTemplate: React.FC<ProductTemplateProps> = ({
  product, region, countryCode, images,
}) => {
  if (!product || !product.id) return notFound()

  return (
    <>
      {/* BREADCRUMB */}
      <div style={{background:"#fff",borderBottom:"1px solid #E8E4DE",padding:"12px 32px"}}>
        <div style={{maxWidth:"1100px",margin:"0 auto",fontSize:"12px",color:"#999",display:"flex",gap:"6px",alignItems:"center"}}>
          <a href="/store" style={{color:"#999",textDecoration:"none",fontFamily:"'Outfit',sans-serif",fontWeight:600}}>Catalog</a>
          <span>›</span>
          <span style={{color:"#111",fontFamily:"'Outfit',sans-serif",fontWeight:700}}>{product.title}</span>
        </div>
      </div>

      {/* PRODUCT LAYOUT */}
      <div style={{background:"#fff",padding:"40px 32px 64px"}}>
        <div style={{maxWidth:"1100px",margin:"0 auto",display:"grid",gridTemplateColumns:"1fr 1fr",gap:"64px",alignItems:"start"}}>

          {/* LEFT — image */}
          <div style={{position:"sticky",top:"80px"}}>
            <div style={{background:"#EBF0F8",borderRadius:"18px",overflow:"hidden",aspectRatio:"1",display:"flex",alignItems:"center",justifyContent:"center",padding:"40px",position:"relative"}}>
              <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse 80% 80% at 50% 40%, rgba(255,255,255,0.7) 0%, transparent 70%)"}} />
              <div style={{position:"relative",zIndex:1,width:"100%"}}>
                <ImageGallery images={images} />
              </div>
            </div>
            {/* Trust badges */}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"8px",marginTop:"16px"}}>
              {[
                {icon:"🧪",text:"99%+ Purity Verified"},
                {icon:"📋",text:"CoA Included"},
                {icon:"🚚",text:"Free Shipping"},
                {icon:"⚡",text:"12–24hr Dispatch"},
              ].map(b => (
                <div key={b.text} style={{background:"#F9F7F4",border:"1px solid #E8E4DE",borderRadius:"8px",padding:"10px 12px",display:"flex",alignItems:"center",gap:"7px",fontSize:"11px",fontFamily:"'Outfit',sans-serif",fontWeight:700,color:"#444"}}>
                  <span>{b.icon}</span>{b.text}
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — info + actions */}
          <div style={{display:"flex",flexDirection:"column",gap:"24px"}}>
            <div>
              <div style={{fontFamily:"'Outfit',sans-serif",fontSize:"10px",fontWeight:800,letterSpacing:"1.2px",textTransform:"uppercase",color:"#C9963A",marginBottom:"8px"}}>
                Research Compound
              </div>
              <ProductInfo product={product} />
            </div>

            {/* Add to cart */}
            <div style={{background:"#F9F7F4",border:"1px solid #E8E4DE",borderRadius:"12px",padding:"20px"}}>
              <Suspense fallback={<ProductActions disabled={true} product={product} region={region} />}>
                <ProductActionsWrapper id={product.id} region={region} />
              </Suspense>
            </div>

            {/* Research use disclaimer */}
            <div style={{background:"rgba(201,150,58,0.06)",border:"1px solid rgba(201,150,58,0.2)",borderRadius:"10px",padding:"14px 16px"}}>
              <div style={{fontFamily:"'Outfit',sans-serif",fontSize:"10px",fontWeight:800,letterSpacing:"0.8px",textTransform:"uppercase",color:"#C9963A",marginBottom:"5px"}}>Research Use Only</div>
              <p style={{fontSize:"11px",color:"#888",lineHeight:1.65,margin:0}}>For in-vitro laboratory research and analytical method development only. Not for human or animal consumption. Must be 21+ to purchase.</p>
            </div>

            {/* Product tabs */}
            <ProductTabs product={product} />
          </div>
        </div>
      </div>

      {/* RELATED PRODUCTS */}
      <div style={{background:"#F9F7F4",borderTop:"1px solid #E8E4DE",padding:"52px 32px"}}>
        <div style={{maxWidth:"1100px",margin:"0 auto"}}>
          <div style={{fontFamily:"'Outfit',sans-serif",fontSize:"10px",fontWeight:800,letterSpacing:"1.4px",textTransform:"uppercase",color:"#C9963A",marginBottom:"8px"}}>You May Also Need</div>
          <h2 style={{fontFamily:"'Outfit',sans-serif",fontSize:"22px",fontWeight:800,color:"#111",letterSpacing:"-0.4px",marginBottom:"24px"}}>Related Compounds</h2>
          <Suspense fallback={<SkeletonRelatedProducts />}>
            <RelatedProducts product={product} countryCode={countryCode} />
          </Suspense>
        </div>
      </div>
    </>
  )
}

export default ProductTemplate