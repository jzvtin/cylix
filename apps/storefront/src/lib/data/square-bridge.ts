"use server"

import { sdk } from "@lib/config"
import { getAuthHeaders } from "./cookies"

/**
 * Ask the backend for a Square hosted-checkout URL (via the dynaradigital
 * payment bridge). The backend holds the bridge secret and picks Cylix's Square
 * merchant; the browser only ever receives the final square.link URL.
 */
export async function getSquareCheckoutUrl(cartId: string): Promise<
  { success: true; checkout_url: string; amount: number } | { success: false; error: string }
> {
  try {
    const res = await sdk.client.fetch<{
      success: boolean
      checkout_url?: string
      amount?: number
      error?: string
    }>(`/store/square-bridge/checkout`, {
      method: "POST",
      headers: { ...(await getAuthHeaders()) },
      body: { cart_id: cartId },
    })
    if (!res?.success || !res.checkout_url) {
      return { success: false, error: res?.error || "Could not start Square checkout" }
    }
    return { success: true, checkout_url: res.checkout_url, amount: res.amount ?? 0 }
  } catch (e: any) {
    return { success: false, error: e?.message || "Square checkout unavailable" }
  }
}
