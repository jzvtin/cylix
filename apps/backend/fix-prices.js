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
      }
    }
    if (token) options.headers["Authorization"] = "Bearer " + token
    const r = http.request(options, (res) => {
      let d = ""
      res.on("data", (c) => { d += c })
      res.on("end", () => { try { resolve(JSON.parse(d)) } catch(e) { resolve(d) } })
    })
    r.on("error", reject)
    if (data) r.write(data)
    r.end()
  })
}

const PRICES = {
  "RT3": 5500,
  "TZ2": 5500,
  "GHK-Cu": 3500,
  "Tesamorelin": 6700,
  "NAD+": 10000,
  "Glow Stack": 8400,
  "Klow": 11000,
}

async function fixPrices() {
  console.log("Logging in...")
  const auth = await req("POST", "/auth/user/emailpass", {
    email: "admin@cylix.com",
    password: "avlona123"
  })
  const token = auth.token
  if (!token) { console.log("Login failed:", JSON.stringify(auth)); return }
  console.log("Logged in!")

  const prods = await req("GET", "/admin/products?limit=20&fields=id,title,variants.id,variants.title", null, token)
  const products = prods.products || []
  console.log(`Found ${products.length} products`)

  for (const p of products) {
    const price = PRICES[p.title]
    if (!price) { console.log(`Skipping ${p.title} — no price mapping`); continue }
    const variant = p.variants?.[0]
    if (!variant) { console.log(`No variant for ${p.title}`); continue }
    
    process.stdout.write(`Setting $${price/100} on ${p.title} (${variant.id})... `)
    const res = await req("POST", `/admin/products/${p.id}/variants/${variant.id}/prices/batch`, {
      create: [{ amount: price, currency_code: "usd" }]
    }, token)
    console.log(res.variant ? "done" : JSON.stringify(res).slice(0, 100))
  }
  console.log("All done!")
}

fixPrices().catch(console.error)