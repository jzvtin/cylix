import { getBaseURL } from "@lib/util/env"
import { Metadata } from "next"
import MarketingPixels from "@modules/marketing/pixels"
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
    // Social share image comes from the file-based src/app/opengraph-image.jpg
    // (Next.js auto-generates the og:image tag from it and it takes precedence
    // over any images set here).
  },
  twitter: {
    card: "summary_large_image",
    title: "Cylix Research — Analytical-Grade Research Peptides",
    description:
      "Third-party tested reference standards with a Certificate of Analysis on every lot. For in-vitro laboratory research only.",
    // Share image comes from the file-based src/app/twitter-image.jpg.
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", type: "image/png", sizes: "16x16" },
      { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
      // Google Search needs an icon that is at least 48x48 (a multiple of 48)
      // before it will show a favicon next to the result.
      { url: "/favicon-48x48.png", type: "image/png", sizes: "48x48" },
      { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
      { url: "/icon-512.png", type: "image/png", sizes: "512x512" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
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
        <link href="https://fonts.googleapis.com/css2?family=Anek+Latin:wght@400;500;600;700;800&family=Poppins:wght@400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        <MarketingPixels />
        <main className="relative" style={{fontFamily: "'Plus Jakarta Sans', sans-serif"}}>
          {props.children}
        </main>
      </body>
    </html>
  )
}