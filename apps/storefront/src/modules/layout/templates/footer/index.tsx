import Link from "next/link"

const Footer = () => {
  return (
    <footer style={{background: "#0D0D0D", padding: "52px 32px 28px"}}>
      <div style={{maxWidth: "1200px", margin: "0 auto"}}>
        <div style={{display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: "40px", marginBottom: "44px"}}>
          <div>
            <div style={{fontFamily: "'Outfit', sans-serif", fontSize: "15px", fontWeight: 900, color: "#fff", textTransform: "uppercase", marginBottom: "10px", letterSpacing: "-0.2px"}}>
              Cylix Research<span style={{width: "5px", height: "5px", background: "#C9963A", borderRadius: "50%", display: "inline-block", marginLeft: "4px", verticalAlign: "middle"}}></span>
            </div>
            <p style={{fontSize: "12px", color: "rgba(255,255,255,0.28)", lineHeight: 1.75, maxWidth: "220px"}}>
              Analytical-grade biochemical reference standards for qualified researchers. Third-party verified, USA based.
            </p>
          </div>
          <div>
            <div style={{fontFamily: "'Outfit', sans-serif", fontSize: "9px", fontWeight: 800, letterSpacing: "1.2px", textTransform: "uppercase", color: "rgba(255,255,255,0.2)", marginBottom: "14px"}}>Company</div>
            <div style={{display: "flex", flexDirection: "column", gap: "9px"}}>
              {[{l:"Contact", h:"/support"}, {l:"FAQ", h:"/faq"}, {l:"Research Use Only", h:"/disclaimer"}].map(i => (
                <Link key={i.l} href={i.h} style={{fontSize: "12px", color: "rgba(255,255,255,0.36)", textDecoration: "none"}}>{i.l}</Link>
              ))}
            </div>
          </div>
          <div>
            <div style={{fontFamily: "'Outfit', sans-serif", fontSize: "9px", fontWeight: 800, letterSpacing: "1.2px", textTransform: "uppercase", color: "rgba(255,255,255,0.2)", marginBottom: "14px"}}>Research</div>
            <div style={{display: "flex", flexDirection: "column", gap: "9px"}}>
              {[{l:"Full Catalog", h:"/store"}, {l:"Certificates of Analysis", h:"/coa"}, {l:"Shipping Info", h:"/shipping"}].map(i => (
                <Link key={i.l} href={i.h} style={{fontSize: "12px", color: "rgba(255,255,255,0.36)", textDecoration: "none"}}>{i.l}</Link>
              ))}
            </div>
          </div>
          <div>
            <div style={{fontFamily: "'Outfit', sans-serif", fontSize: "9px", fontWeight: 800, letterSpacing: "1.2px", textTransform: "uppercase", color: "rgba(255,255,255,0.2)", marginBottom: "14px"}}>Account</div>
            <div style={{display: "flex", flexDirection: "column", gap: "9px"}}>
              {[{l:"Sign In", h:"/account"}, {l:"Create Account", h:"/account"}, {l:"Track Order", h:"/account/orders"}].map(i => (
                <Link key={i.l} href={i.h} style={{fontSize: "12px", color: "rgba(255,255,255,0.36)", textDecoration: "none"}}>{i.l}</Link>
              ))}
            </div>
          </div>
        </div>
        <div style={{borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "22px"}}>
          <div style={{display: "flex", gap: "18px", flexWrap: "wrap", marginBottom: "10px"}}>
            {[{l:"Privacy Policy", h:"/privacy"}, {l:"Terms of Service", h:"/terms"}, {l:"Shipping Policy", h:"/shipping"}, {l:"Returns", h:"/returns"}, {l:"Disclaimer", h:"/disclaimer"}].map(i => (
              <Link key={i.l} href={i.h} style={{fontSize: "11px", color: "rgba(255,255,255,0.22)", textDecoration: "none"}}>{i.l}</Link>
            ))}
          </div>
          <p style={{fontSize: "10px", color: "rgba(255,255,255,0.12)", lineHeight: 1.7, maxWidth: "600px"}}>
            All products sold by Cylix Research are for in-vitro laboratory research only. Not for human or animal consumption, dosing, or administration. Must be 21+ to purchase.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer