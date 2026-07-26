import { loadEnv, defineConfig } from '@medusajs/framework/utils'

loadEnv(process.env.NODE_ENV || 'development', process.cwd())

// Only register the Stripe payment provider when a key is actually configured.
// Registering it with an undefined apiKey makes the provider throw on boot,
// which would take the entire backend (and therefore the store) offline. When
// STRIPE_API_KEY is absent the store runs without Stripe, unchanged.
const stripeModules = process.env.STRIPE_API_KEY
  ? [
      {
        // Provider id `stripe` => Medusa provider id `pp_stripe_stripe`, which
        // the storefront checkout looks for (see lib/constants isStripeLike).
        resolve: '@medusajs/medusa/payment',
        options: {
          providers: [
            {
              resolve: '@medusajs/payment-stripe',
              id: 'stripe',
              options: {
                apiKey: process.env.STRIPE_API_KEY,
                // Signing secret from the Stripe webhook endpoint pointed at
                // /hooks/payment/stripe_stripe. Without it, webhook signature
                // verification fails and charges never reconcile to orders.
                webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
                // Capture funds immediately on authorization (charge now),
                // rather than authorize-only. Right default for a retail store.
                capture: true,
              },
            },
          ],
        },
      },
    ]
  : []

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: process.env.JWT_SECRET,
      cookieSecret: process.env.COOKIE_SECRET,
    }
  },
  modules: [...stripeModules],
})
