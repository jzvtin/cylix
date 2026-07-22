import { Metadata } from "next"
import FeaturedProducts from "@modules/home/components/featured-products"
import Hero from "@modules/home/components/hero"
import { listCollections } from "@lib/data/collections"
import { getRegion } from "@lib/data/regions"

export const metadata: Metadata = {
  title: "Cylix Research | Research Peptides You Can Trust",
  description: "Research-grade peptides with Certificate of Analysis on every batch. 99%+ identity purity, third-party tested.",
}

export default async function Home(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params
  const { countryCode } = params
  const region = await getRegion(countryCode)
  const { collections } = await listCollections({ fields: "id, handle, title" })

  if (!region) return null

  return (
    <>
      <Hero />

      {/* WHY CYLIX */}
      <section style={{background: "#F9F7F4", padding: "clamp(40px, 8vw, 72px) clamp(18px, 5vw, 32px)", borderTop: "1px solid #E8E4DE"}}>
        <div style={{maxWidth: "1200px", margin: "0 auto"}}>
          <div style={{marginBottom: "44px"}}>
            <div style={{fontFamily: "'Outfit', sans-serif", fontSize: "10px", fontWeight: 800, letterSpacing: "1.4px", textTransform: "uppercase" as const, color: "#C9963A", marginBottom: "10px"}}>Why Cylix</div>
            <h2 style={{fontFamily: "'Outfit', sans-serif", fontSize: "clamp(22px, 3.5vw, 30px)", fontWeight: 800, color: "#111", letterSpacing: "-0.6px", marginBottom: "8px"}}>Built different, for a reason.</h2>
            <p style={{fontSize: "14px", color: "#999", lineHeight: 1.7, maxWidth: "480px"}}>The research compound space is full of noise. We cut through it with one standard: you deserve to know exactly what you&apos;re getting.</p>
          </div>
          <div style={{display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(240px, 100%), 1fr))", gap: "1px", background: "#E8E4DE", border: "1px solid #E8E4DE", borderRadius: "14px", overflow: "hidden", marginBottom: "36px"}}>
            {[
              {color: "#4CAF6E", icon: "🧪", title: "Independent Third-Party Testing", body: "Every batch tested by Janoshik Analytical — not us. Their HPLC results ship with your order."},
              {color: "#5B8FD6", icon: "🛡️", title: "99%+ Purity, Not \"Research Grade\"", body: "We specify purity by percentage on every CoA — above 99% across our entire catalog, or it doesn't ship."},
              {color: "#C9963A", icon: "⚡", title: "12–24hr Dispatch", body: "Orders before 2pm EST ship same day. We don't batch orders once a week."},
              {color: "#E07B5C", icon: "🚚", title: "Free Shipping, Always", body: "No threshold. No fine print. The price you see is the price you pay."},
              {color: "#7B6FD6", icon: "🎧", title: "Real Human Support", body: "A real person responds within 12–24 hours — not a bot with canned answers."},
              {color: "#4BAAAA", icon: "📦", title: "Discreet Packaging", body: "Plain, unmarked packaging labeled as laboratory research materials."},
            ].map((item) => (
              <div key={item.title} style={{background: "#fff", padding: "28px 24px"}}>
                <div style={{width: "36px", height: "36px", borderRadius: "10px", background: item.color, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "14px", fontSize: "16px"}}>
                  {item.icon}
                </div>
                <div style={{fontFamily: "'Outfit', sans-serif", fontSize: "13px", fontWeight: 800, color: "#111", marginBottom: "7px"}}>{item.title}</div>
                <p style={{fontSize: "12px", color: "#999", lineHeight: 1.72, margin: 0}}>{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section style={{background: "#fff", padding: "clamp(40px, 7vw, 64px) clamp(18px, 5vw, 32px)", borderTop: "1px solid #E8E4DE"}}>
        <div style={{maxWidth: "1200px", margin: "0 auto"}}>
          <div style={{display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "28px", flexWrap: "wrap", gap: "14px"}}>
            <div>
              <div style={{fontFamily: "'Outfit', sans-serif", fontSize: "10px", fontWeight: 800, letterSpacing: "1.4px", textTransform: "uppercase" as const, color: "#C9963A", marginBottom: "6px"}}>Featured Products</div>
              <h2 style={{fontFamily: "'Outfit', sans-serif", fontSize: "clamp(20px, 3vw, 26px)", fontWeight: 800, color: "#111", letterSpacing: "-0.4px"}}>Research-grade compounds</h2>
              <p style={{fontSize: "13px", color: "#999", marginTop: "4px"}}>Third-party verified, every batch.</p>
            </div>
            <a href="/store" style={{fontFamily: "'Outfit', sans-serif", fontSize: "12px", fontWeight: 700, color: "#999", textDecoration: "none", border: "1px solid #E8E4DE", padding: "7px 14px", borderRadius: "20px"}}>View all →</a>
          </div>
{collections && collections.length > 0 && (
  <ul className="flex flex-col gap-x-6">
    <FeaturedProducts collections={collections} region={region} />
  </ul>
)}
        </div>
      </section>

      {/* COMPLIANCE */}
      <div style={{background: "#F0EDE8", borderTop: "1px solid #E8E4DE", padding: "40px clamp(18px, 5vw, 32px)"}}>
        <div style={{maxWidth: "1200px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(260px, 100%), 1fr))", gap: "28px"}}>
          {[
            {label: "Documentation", text: "Every lot ships with a Certificate of Analysis from Janoshik Analytical. Identity and purity verified by independent third-party testing."},
            {label: "Age & Buyer Verification", text: "Purchasers must be 21 or older and a qualified researcher. By ordering you confirm qualified laboratory research use only."},
            {label: "Research Use Only", text: "All materials are for in-vitro laboratory research only. Not for human or animal consumption, injection, dosing, or administration of any kind."},
          ].map((item) => (
            <div key={item.label}>
              <div style={{fontFamily: "'Outfit', sans-serif", fontSize: "9px", fontWeight: 800, letterSpacing: "1.2px", textTransform: "uppercase" as const, color: "#C9963A", marginBottom: "7px"}}>{item.label}</div>
              <p style={{fontSize: "12px", color: "#888", lineHeight: 1.75, margin: 0}}>{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
