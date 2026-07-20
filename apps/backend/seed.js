const http = require("http")

async function req(method, path, body, token) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : ""
    const options = {
    hostname: "127.0.0.1",      
    port: 9000,
      path: path,
      method: method,
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(data),
      }
    }
    if (token) options.headers["Authorization"] = "Bearer " + token
    const r = http.request(options, (res) => {
      let d = ""
      res.on("data", (c) => { d += c })
      res.on("end", () => {
        try { resolve(JSON.parse(d)) } catch(e) { resolve(d) }
      })
    })
    r.on("error", reject)
    if (data) r.write(data)
    r.end()
  })
}

const PRODUCTS = [
  { title: "RT3", description: "Retatrutide — GLP-1/GIP/Glucagon triple receptor agonist reference standard.", amount: 5500, variant: "10mg" },
  { title: "TZ2", description: "Tirzepatide — GLP-1/GIP dual receptor agonist reference standard.", amount: 5500, variant: "10mg" },
  { title: "GHK-Cu", description: "Copper-binding tripeptide for cellular regeneration research.", amount: 3500, variant: "50mg" },
  { title: "Tesamorelin", description: "GHRH analogue for GH-axis and metabolic signaling research.", amount: 6700, variant: "10mg" },
  { title: "NAD+", description: "Nicotinamide adenine dinucleotide for mitochondrial function research.", amount: 10000, variant: "1000mg" },
  { title: "Glow Stack", description: "GHK-Cu based blend for cellular regeneration research.", amount: 8400, variant: "70mg" },
  { title: "Klow", description: "Premium research compound for laboratory research.", amount: 11000, variant: "80mg" },
]

async function seed() {
  console.log("Logging in...")
  const auth = await req("POST", "/auth/user/emailpass", {
    email: "admin@cylix.com",
    password: "avlona123"
  })
  const token = auth.token
  if (!token) {
    console.log("Login failed:", JSON.stringify(auth))
    return
  }
  console.log("Logged in!")
  for (const p of PRODUCTS) {
    process.stdout.write("Creating " + p.title + "... ")
    const res = await req("POST", "/admin/products", {
      title: p.title,
      description: p.description,
      status: "published",
      options: [{ title: "Size", values: [p.variant] }],
      variants: [{
        title: p.variant,
        options: { Size: p.variant },
        prices: [{ amount: p.amount, currency_code: "usd" }],
        manage_inventory: false
      }]
    }, token)
    console.log(res.product ? "done" : "FAILED: " + JSON.stringify(res).slice(0, 150))
  }
  console.log("All done!")
}

seed().catch(console.error)