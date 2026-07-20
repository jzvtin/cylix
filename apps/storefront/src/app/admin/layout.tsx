import { Metadata } from "next"

import "styles/globals.css"

export const metadata: Metadata = {
  title: "Cylix Admin",
  robots: { index: false, follow: false },
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div
      className="min-h-screen"
      style={{ background: "#F9F7F4", fontFamily: "'Outfit', sans-serif" }}
    >
      {children}
    </div>
  )
}
