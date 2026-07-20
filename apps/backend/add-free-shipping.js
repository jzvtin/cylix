/**
 * Adds a US service zone + a $0 "Free Shipping" option so US checkout has a
 * shipping method to select. Safe to re-run: it reuses anything already there.
 *
 * Usage: node add-free-shipping.js
 */
const http = require("http")

async function req(method, path, body, token) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : ""
    const options = {
      hostname: "127.0.0.1",
      port: 9000,
      path,
      method,
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(data),
      },
    }
    if (token) options.headers["Authorization"] = "Bearer " + token
    const r = http.request(options, (res) => {
      let d = ""
      res.on("data", (c) => (d += c))
      res.on("end", () => {
        try {
          resolve(JSON.parse(d))
        } catch (e) {
          resolve(d)
        }
      })
    })
    r.on("error", reject)
    if (data) r.write(data)
    r.end()
  })
}

;(async () => {
  const auth = await req("POST", "/auth/user/emailpass", {
    email: "admin@cylix.com",
    password: "avlona123",
  })
  const token = auth.token
  if (!token) return console.log("Login failed:", JSON.stringify(auth))

  const { regions } = await req("GET", "/admin/regions", null, token)
  const us = regions.find((r) => (r.countries || []).some((c) => c.iso_2 === "us"))
  if (!us) return console.log("No US region found.")

  const { shipping_profiles } = await req(
    "GET",
    "/admin/shipping-profiles",
    null,
    token
  )
  const profile = shipping_profiles[0]
  if (!profile) return console.log("No shipping profile found.")

  const { stock_locations } = await req(
    "GET",
    "/admin/stock-locations?fields=id,name,*fulfillment_sets,*fulfillment_sets.service_zones",
    null,
    token
  )

  let fulfillmentSet = null
  for (const loc of stock_locations) {
    const set = (loc.fulfillment_sets || []).find((f) => f.type === "shipping")
    if (set) {
      fulfillmentSet = set
      break
    }
  }
  if (!fulfillmentSet) return console.log("No shipping fulfillment set found.")

  // Reuse a US zone if one already exists, otherwise create it.
  let zone = (fulfillmentSet.service_zones || []).find(
    (z) => z.name === "United States"
  )

  if (!zone) {
    const created = await req(
      "POST",
      `/admin/fulfillment-sets/${fulfillmentSet.id}/service-zones`,
      {
        name: "United States",
        geo_zones: [{ country_code: "us", type: "country" }],
      },
      token
    )
    const set = created.fulfillment_set
    zone = (set?.service_zones || []).find((z) => z.name === "United States")
    if (!zone) return console.log("Zone create failed:", JSON.stringify(created))
    console.log("Created service zone:", zone.id)
  } else {
    console.log("Reusing service zone:", zone.id)
  }

  const existing = await req(
    "GET",
    `/admin/shipping-options?service_zone_id=${zone.id}`,
    null,
    token
  )
  if ((existing.shipping_options || []).some((o) => o.name === "Free Shipping")) {
    return console.log("Free Shipping option already exists. Nothing to do.")
  }

  const result = await req(
    "POST",
    "/admin/shipping-options",
    {
      name: "Free Shipping",
      service_zone_id: zone.id,
      shipping_profile_id: profile.id,
      provider_id: "manual_manual",
      price_type: "flat",
      type: {
        label: "Free Shipping",
        description: "Free standard shipping",
        code: "free-shipping",
      },
      prices: [{ currency_code: "usd", amount: 0 }],
      rules: [
        {
          attribute: "enabled_in_store",
          value: "true",
          operator: "eq",
        },
        {
          attribute: "is_return",
          value: "false",
          operator: "eq",
        },
      ],
    },
    token
  )

  if (result.shipping_option) {
    console.log("Created Free Shipping option:", result.shipping_option.id)
  } else {
    console.log("Create failed:", JSON.stringify(result))
  }
})()
