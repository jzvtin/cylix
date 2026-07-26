import Link from "next/link"

const Hero = () => {
  return (
    <div className="relative w-full overflow-hidden" style={{background: "#fff"}}>
      {/* SPLIT HERO */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(min(340px, 100%), 1fr))",
        minHeight: "560px",
      }}>
        {/* LEFT — text */}
        <div style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "clamp(40px, 8vw, 72px) clamp(20px, 6vw, 56px)",
          background: "#fff",
        }}>
          <div style={{
            fontSize: "10px",
            fontWeight: 800,
            letterSpacing: "1.5px",
            textTransform: "uppercase",
            color: "#999",
            marginBottom: "20px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}>
            <span style={{width: "20px", height: "1px", background: "#999", display: "inline-block"}}></span>
            Research Materials
          </div>

          <h1 style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: "clamp(34px, 5vw, 58px)",
            fontWeight: 900,
            color: "#111",
            lineHeight: 1.07,
            letterSpacing: "-1.5px",
            marginBottom: "18px",
          }}>
            Research Peptides<br />
            You Can{" "}
            <em style={{fontStyle: "normal", color: "#C9963A"}}>Trust.</em>
          </h1>

          <p style={{
            fontSize: "14px",
            color: "#999",
            lineHeight: 1.8,
            maxWidth: "380px",
            marginBottom: "32px",
          }}>
            Research-grade peptides with Certificate of Analysis on every batch. 99%+ identity purity, third-party tested.
          </p>

          <div style={{display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "48px"}}>
            <Link href="/store" style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "7px",
              background: "#111",
              color: "#fff",
              padding: "12px 22px",
              borderRadius: "20px",
              fontFamily: "'Outfit', sans-serif",
              fontSize: "13px",
              fontWeight: 700,
              textDecoration: "none",
            }}>
              Browse Catalog →
            </Link>
            <Link href="/store" style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "7px",
              background: "#F9F7F4",
              color: "#111",
              padding: "12px 22px",
              borderRadius: "20px",
              fontFamily: "'Outfit', sans-serif",
              fontSize: "13px",
              fontWeight: 700,
              textDecoration: "none",
              border: "1px solid #E8E4DE",
            }}>
              View Products
            </Link>
          </div>

          {/* Guarantee items */}
          <div style={{display: "flex", flexDirection: "column", gap: "12px"}}>
            {[
              {color: "#4CAF6E", label: "99% Purity Guaranteed", sub: "Every batch verified"},
              {color: "#5B8FD6", label: "Shipment Protection", sub: "Every order fully covered"},
              {color: "#C9963A", label: "CoA with Every Batch", sub: "Third-party tested in America"},
            ].map((item) => (
              <div key={item.label} style={{display: "flex", alignItems: "center", gap: "10px"}}>
                <div style={{
                  width: "22px", height: "22px",
                  borderRadius: "50%",
                  background: item.color,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                }}>
                  <span style={{color: "#fff", fontSize: "10px"}}>✓</span>
                </div>
                <div>
                  <div style={{fontFamily: "'Outfit', sans-serif", fontSize: "12px", fontWeight: 700, color: "#111"}}>{item.label}</div>
                  <div style={{fontSize: "11px", color: "#999"}}>{item.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT — pastel + floating vials */}
        <div style={{
          background: "#EBF0F8",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "clamp(280px, 50vw, 480px)",
          position: "relative",
          overflow: "hidden",
        }}>
          <div style={{
            position: "absolute", inset: 0,
            background: "radial-gradient(ellipse 80% 80% at 60% 40%, rgba(255,255,255,0.6) 0%, transparent 70%)",
          }} />
          {/* Real product vials, fanned out. Images are hosted from the
              storefront's own /public so they stay in sync with the catalog. */}
          <div style={{
            position: "relative",
            zIndex: 1,
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            gap: "10px",
            padding: "40px",
          }}>
            {[
              {img: "/products/bpc-157.png", h: "180px", rotate: "-8deg", translate: "4px"},
              {img: "/products/nad.png", h: "230px", rotate: "0deg", translate: "-10px"},
              {img: "/products/ghk-cu.png", h: "170px", rotate: "8deg", translate: "-4px"},
              {img: "/products/tesamorelin.png", h: "150px", rotate: "14deg", translate: "-8px"},
            ].map((v, i) => (
              <div key={i} style={{
                width: "92px",
                height: v.h,
                backgroundImage: `url(${v.img})`,
                backgroundSize: "cover",
                backgroundPosition: "center top",
                backgroundColor: "#fff",
                borderRadius: "10px",
                boxShadow: "0 20px 48px rgba(0,0,0,0.16)",
                transform: `rotate(${v.rotate}) translateY(${v.translate})`,
              }} />
            ))}
          </div>
        </div>
      </div>

      {/* TRUST BAR */}
      <div style={{
        background: "#fff",
        borderTop: "1px solid #E8E4DE",
        borderBottom: "1px solid #E8E4DE",
        display: "flex",
        overflowX: "auto",
        padding: "0 32px",
      }}>
        {[
          {icon: "🧪", text: "99%+ Purity Verified"},
          {icon: "🚚", text: "Free Shipping Always"},
          {icon: "📋", text: "CoA on Every Lot"},
          {icon: "⚡", text: "12–24hr Dispatch"},
          {icon: "🛡️", text: "USA Based"},
        ].map((item) => (
          <div key={item.text} style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "13px 24px",
            borderRight: "1px solid #E8E4DE",
            fontFamily: "'Outfit', sans-serif",
            fontSize: "11px",
            fontWeight: 700,
            color: "#444",
            whiteSpace: "nowrap",
          }}>
            <span>{item.icon}</span> {item.text}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Hero