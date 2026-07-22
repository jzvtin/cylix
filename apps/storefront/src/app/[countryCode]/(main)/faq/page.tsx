import { Metadata } from "next"

export const metadata: Metadata = {
  title: "FAQ | Cylix Research",
  description: "Frequently asked questions about Cylix Research compounds, ordering, and shipping.",
}

const faqs = [
  {
    category: "Compounds & Quality",
    items: [
      { q: "Are your compounds tested for purity?", a: "Yes. All Cylix Research compounds undergo third-party testing through Janoshik Analytical. Each batch is tested using HPLC-MS/MS to verify purity, identity, and concentration. Certificates of Analysis are available for all current batches. Our purity standards consistently exceed 99%." },
      { q: "What is a Certificate of Analysis (CoA)?", a: "A CoA is a lot-specific analytical document confirming the identity, purity, and quality of a reference material. Each CoA includes identity verification by HPLC or mass spectrometry, purity percentage, lot number, testing laboratory name, and test date. Request a CoA by emailing support@cylixresearch.com with your order number." },
      { q: "How should I store research compounds?", a: "Lyophilized powder: Store at −20°C in a desiccated environment. Reconstituted solution: Store at 2–8°C and use within 30 days. Avoid repeated freeze-thaw cycles, light exposure, and high humidity." },
    ]
  },
  {
    category: "Ordering & Payment",
    items: [
      { q: "What payment methods do you accept?", a: "We accept credit cards, cryptocurrency (BTC, ETH, USDC), Zelle, Venmo, and bank wire for institutional orders. All transactions are processed through secure, encrypted payment gateways." },
      { q: "How do I track my order?", a: "Tracking information is emailed as soon as your order ships. You can also view order history and tracking in your account dashboard. If tracking is not received within 48 hours, contact support@cylixresearch.com." },
      { q: "Do you offer institutional pricing?", a: "Yes. We offer discounted pricing for qualified research institutions, universities, and laboratories. Contact support@cylixresearch.com with your institution name, credentials, and expected order volume." },
    ]
  },
  {
    category: "Shipping & Handling",
    items: [
      { q: "What are your shipping policies?", a: "Free shipping on all orders. Processing takes 12–24 hours on business days. Domestic delivery is typically 2–5 business days via USPS Priority or UPS Ground. All packages are labeled as laboratory research materials." },
      { q: "What is your return policy?", a: "Given the nature of laboratory reference materials, we do not accept returns of opened or used materials. We will issue a replacement or full refund for materials arriving damaged, incorrect items shipped due to our error, or orders lost in transit. Contact us within 7 days of expected delivery." },
    ]
  },
]

export default function FAQPage() {
  return (
    <>
      {/* HEADER */}
      <div style={{background:"#111",padding:"clamp(36px, 8vw, 56px) clamp(18px, 5vw, 32px) 48px",textAlign:"center"}}>
        <div style={{fontFamily:"'Outfit',sans-serif",fontSize:"10px",fontWeight:800,letterSpacing:"1.4px",textTransform:"uppercase",color:"#C9963A",marginBottom:"10px"}}>Help Center</div>
        <h1 style={{fontFamily:"'Outfit',sans-serif",fontSize:"clamp(28px,5vw,44px)",fontWeight:900,color:"#fff",letterSpacing:"-1.2px",marginBottom:"10px"}}>
          Frequently Asked <em style={{fontStyle:"normal",color:"#C9963A"}}>Questions</em>
        </h1>
        <p style={{fontSize:"14px",color:"rgba(255,255,255,0.45)",maxWidth:"440px",margin:"0 auto",lineHeight:1.65}}>
          Answers to common questions about our research compounds, ordering, and protocols.
        </p>
      </div>

      {/* FAQ BODY */}
      <div style={{maxWidth:"720px",margin:"0 auto",padding:"52px clamp(18px, 5vw, 32px) 80px"}}>
        {faqs.map((group) => (
          <div key={group.category} style={{marginBottom:"40px"}}>
            <div style={{fontFamily:"'Outfit',sans-serif",fontSize:"10px",fontWeight:800,letterSpacing:"1.4px",textTransform:"uppercase",color:"#C9963A",marginBottom:"16px",display:"flex",alignItems:"center",gap:"10px"}}>
              {group.category}
              <span style={{flex:1,height:"1px",background:"rgba(201,150,58,0.3)",display:"block"}}></span>
            </div>
            {group.items.map((item) => (
              <details key={item.q} style={{background:"#fff",border:"1px solid #E8E4DE",borderRadius:"8px",marginBottom:"8px",overflow:"hidden"}}>
                <summary style={{padding:"16px 18px",cursor:"pointer",fontFamily:"'Outfit',sans-serif",fontSize:"14px",fontWeight:700,color:"#111",listStyle:"none",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  {item.q}
                  <span style={{color:"#C9963A",fontSize:"18px",fontWeight:300,flexShrink:0,marginLeft:"12px"}}>+</span>
                </summary>
                <div style={{padding:"0 18px 16px",fontSize:"13px",color:"#888",lineHeight:1.75,borderTop:"1px solid #E8E4DE",paddingTop:"14px"}}>
                  {item.a}
                </div>
              </details>
            ))}
          </div>
        ))}

        {/* CTA */}
        <div style={{background:"#F9F7F4",border:"1px solid #E8E4DE",borderRadius:"12px",padding:"28px",textAlign:"center",marginTop:"16px"}}>
          <div style={{fontFamily:"'Outfit',sans-serif",fontSize:"15px",fontWeight:800,color:"#111",marginBottom:"6px"}}>Still have questions?</div>
          <p style={{fontSize:"13px",color:"#999",marginBottom:"16px"}}>Our support team responds within 12–24 hours.</p>
          <a href="/support" style={{display:"inline-flex",alignItems:"center",gap:"8px",background:"#111",color:"#fff",padding:"11px 22px",borderRadius:"20px",fontFamily:"'Outfit',sans-serif",fontSize:"13px",fontWeight:700,textDecoration:"none"}}>
            Contact Support →
          </a>
        </div>
      </div>
    </>
  )
}