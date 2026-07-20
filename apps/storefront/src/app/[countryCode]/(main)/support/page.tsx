import { Metadata } from "next"
import SupportForm from "@modules/common/components/support-form"

export const metadata: Metadata = {
  title: "Support | Cylix Research",
  description: "Contact Cylix Research support for order inquiries, documentation requests, and technical questions.",
}

export default function SupportPage() {
  return (
    <>
      <div style={{background:"#111",padding:"56px 32px 48px",textAlign:"center"}}>
        <div style={{fontFamily:"'Outfit',sans-serif",fontSize:"10px",fontWeight:800,letterSpacing:"1.4px",textTransform:"uppercase",color:"#C9963A",marginBottom:"10px"}}>Get Help</div>
        <h1 style={{fontFamily:"'Outfit',sans-serif",fontSize:"clamp(28px,5vw,44px)",fontWeight:900,color:"#fff",letterSpacing:"-1.2px",marginBottom:"10px"}}>
          We&apos;re here to <em style={{fontStyle:"normal",color:"#C9963A"}}>help.</em>
        </h1>
        <p style={{fontSize:"14px",color:"rgba(255,255,255,0.45)",maxWidth:"400px",margin:"0 auto",lineHeight:1.65}}>
          For order support, documentation requests, or technical inquiries — our team responds within 12–24 hours.
        </p>
      </div>

      <div style={{maxWidth:"960px",margin:"0 auto",padding:"52px 32px 80px",display:"grid",gridTemplateColumns:"1fr 1.5fr",gap:"48px"}}>
        
        {/* INFO CARDS */}
        <div style={{display:"flex",flexDirection:"column",gap:"14px"}}>
          {[
            {icon:"✉️", label:"Email Support", value:"support@cylixresearch.com", detail:"For order inquiries, CoA requests, and general questions."},
            {icon:"⏰", label:"Support Hours", value:"Mon–Fri, 9am–6pm EST", detail:"Saturday–Sunday: 10am–4pm EST. Response within 12–24 hours."},
            {icon:"🧪", label:"Technical Support", value:"Reconstitution & Storage", detail:"Include your compound name and lot number for fastest response."},
            {icon:"📄", label:"Documentation", value:"Certificates of Analysis", detail:"Request the CoA for your lot — include your order and lot number."},
          ].map((card) => (
            <div key={card.label} style={{background:"#fff",border:"1px solid #E8E4DE",borderRadius:"10px",padding:"18px 20px"}}>
              <div style={{fontSize:"20px",marginBottom:"10px"}}>{card.icon}</div>
              <div style={{fontFamily:"'Outfit',sans-serif",fontSize:"10px",fontWeight:700,letterSpacing:"0.8px",textTransform:"uppercase",color:"#999",marginBottom:"3px"}}>{card.label}</div>
              <div style={{fontFamily:"'Outfit',sans-serif",fontSize:"14px",fontWeight:800,color:"#111",marginBottom:"4px"}}>{card.value}</div>
              <div style={{fontSize:"12px",color:"#999",lineHeight:1.6}}>{card.detail}</div>
            </div>
          ))}
        </div>

        {/* CONTACT FORM */}
        <div style={{background:"#fff",border:"1px solid #E8E4DE",borderRadius:"12px",padding:"28px"}}>
          <h2 style={{fontFamily:"'Outfit',sans-serif",fontSize:"18px",fontWeight:800,color:"#111",marginBottom:"20px",letterSpacing:"-0.3px"}}>Send a Message</h2>
          <SupportForm />
        </div>
      </div>
    </>
  )
}