"use client"

import Script from "next/script"

import { pixels } from "@lib/marketing-config"

/**
 * Marketing / analytics pixels.
 *
 * Each pixel is gated on its env-driven ID. When an ID is unset the script
 * renders nothing — no network calls, no console errors. All scripts load
 * `afterInteractive` so they never block first paint / hurt Core Web Vitals.
 *
 * A typed `track()` helper is exported for future AddToCart / Purchase events;
 * it safely no-ops when the relevant pixel is absent.
 */

/* ── Minimal ambient typings so we can call the pixels without `any`. ───────── */
type Fbq = (...args: unknown[]) => void
type Ttq = {
  track: (event: string, params?: Record<string, unknown>) => void
  page: () => void
  [key: string]: unknown
}
type Gtag = (...args: unknown[]) => void

declare global {
  interface Window {
    fbq?: Fbq
    ttq?: Ttq
    gtag?: Gtag
    dataLayer?: unknown[]
  }
}

/** A marketing event we may want to forward to any configured pixel. */
export type MarketingEvent =
  | "AddToCart"
  | "InitiateCheckout"
  | "Purchase"
  | "Lead"
  | "ViewContent"
  | "Search"

/**
 * Safely forward an event to whichever pixels are present on the page.
 * Never throws — guarded for SSR and for missing pixels.
 */
export function track(
  event: MarketingEvent,
  params?: Record<string, unknown>
): void {
  if (typeof window === "undefined") return
  try {
    if (typeof window.fbq === "function") {
      window.fbq("track", event, params)
    }
    if (window.ttq && typeof window.ttq.track === "function") {
      window.ttq.track(event, params)
    }
    if (typeof window.gtag === "function") {
      window.gtag("event", event, params ?? {})
    }
  } catch {
    /* Analytics must never break the app. */
  }
}

function MetaPixel({ id }: { id: string }) {
  return (
    <>
      <Script id="cx-meta-pixel" strategy="afterInteractive">
        {`!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window,document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${id}');
fbq('track', 'PageView');`}
      </Script>
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          alt=""
          src={`https://www.facebook.com/tr?id=${id}&ev=PageView&noscript=1`}
        />
      </noscript>
    </>
  )
}

function TikTokPixel({ id }: { id: string }) {
  return (
    <Script id="cx-tiktok-pixel" strategy="afterInteractive">
      {`!function (w, d, t) {
  w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];
  ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"];
  ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};
  for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);
  ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e};
  ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.partner;ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};n=document.createElement("script");n.type="text/javascript",n.async=!0,n.src=r+"?sdkid="+e+"&lib="+t;e=document.getElementsByTagName("script")[0];e.parentNode.insertBefore(n,e)};
  ttq.load('${id}');
  ttq.page();
}(window, document, 'ttq');`}
    </Script>
  )
}

function GoogleAnalytics({ id }: { id: string }) {
  return (
    <>
      <Script
        id="cx-ga-loader"
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${id}`}
      />
      <Script id="cx-ga-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${id}');`}
      </Script>
    </>
  )
}

/**
 * Renders whichever pixels are configured. Renders `null` when none are set,
 * so it is completely inert in local/dev and any environment missing the IDs.
 */
export default function MarketingPixels() {
  const { metaPixelId, tiktokPixelId, gaId } = pixels
  if (!metaPixelId && !tiktokPixelId && !gaId) return null

  return (
    <>
      {metaPixelId ? <MetaPixel id={metaPixelId} /> : null}
      {tiktokPixelId ? <TikTokPixel id={tiktokPixelId} /> : null}
      {gaId ? <GoogleAnalytics id={gaId} /> : null}
    </>
  )
}
