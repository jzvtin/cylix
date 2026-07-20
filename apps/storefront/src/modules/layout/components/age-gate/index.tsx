"use client"
import { useState, useEffect } from "react"

export default function AgeGate() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const verified = localStorage.getItem("cx_age_verified")
    if (!verified) setShow(true)
  }, [])

  function verify() {
    localStorage.setItem("cx_age_verified", "true")
    setShow(false)
  }

  function deny() {
    window.location.href = "https://www.google.com"
  }

  if (!show) return null

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.92)",zIndex:9999,display:"flex",alignItems:"center",justifyContent:"center",padding:"20px"}}>
      <div style={{background:"#fff",borderRadius:"16px",padding:"40px 36px",maxWidth:"440px",width:"100%",textAlign:"center"}}>
        <div style={{fontFamily:"'Outfit',sans-serif",fontSize:"13px",fontWeight:800,letterSpacing:"1.2px",textTransform:"uppercase",color:"#C9963A",marginBottom:"16px"}}>
          Age Verification Required
        </div>
        <div style={{fontFamily:"'Outfit',sans-serif",fontSize:"28px",fontWeight:900,color:"#111",letterSpacing:"-0.8px",marginBottom:"8px",lineHeight:1.1}}>
          Are you 21 or older?
        </div>
        <p style={{fontSize:"13px",color:"#999",lineHeight:1.7,marginBottom:"28px"}}>
          Cylix Research sells analytical-grade research compounds for qualified researchers only. You must be 21 or older to enter this site.
        </p>
        <div style={{display:"flex",gap:"10px",justifyContent:"center"}}>
          <button onClick={verify} style={{flex:1,padding:"14px",background:"#111",color:"#fff",border:"none",borderRadius:"10px",fontFamily:"'Outfit',sans-serif",fontSize:"14px",fontWeight:800,cursor:"pointer",letterSpacing:"0.3px"}}>
            Yes, I am 21+
          </button>
          <button onClick={deny} style={{flex:1,padding:"14px",background:"#F9F7F4",color:"#999",border:"1px solid #E8E4DE",borderRadius:"10px",fontFamily:"'Outfit',sans-serif",fontSize:"14px",fontWeight:700,cursor:"pointer"}}>
            No, Exit
          </button>
        </div>
        <p style={{fontSize:"10px",color:"#ccc",marginTop:"16px",lineHeight:1.6}}>
          All products are for in-vitro laboratory research only. Not for human or animal consumption.
        </p>
      </div>
    </div>
  )
}