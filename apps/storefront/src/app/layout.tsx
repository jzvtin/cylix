import { getBaseURL } from "@lib/util/env"
import { Metadata } from "next"
import "styles/globals.css"

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
  title: {
    default: "Cylix Research — Analytical-Grade Research Peptides",
    template: "%s | Cylix Research",
  },
  description:
    "Analytical-grade biochemical reference standards for qualified researchers. Third-party tested, Certificate of Analysis on every lot, USA based. For in-vitro laboratory research only.",
  applicationName: "Cylix Research",
  openGraph: {
    type: "website",
    siteName: "Cylix Research",
    title: "Cylix Research — Analytical-Grade Research Peptides",
    description:
      "Third-party tested reference standards with a Certificate of Analysis on every lot. For in-vitro laboratory research only.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cylix Research — Analytical-Grade Research Peptides",
    description:
      "Third-party tested reference standards with a Certificate of Analysis on every lot. For in-vitro laboratory research only.",
  },
  icons: {
    icon: "/favicon.ico",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" data-mode="light">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        <main className="relative" style={{fontFamily: "'Plus Jakarta Sans', sans-serif"}}>
          {props.children}
        </main>
      </body>
    </html>
  )
}