// Integration Configuration – 1753 SKINCARE
//
// Alla API-nycklar och credentials hanteras via environment variables
// i backend-proxyn (server.js). Frontend anropar ALDRIG tredjepartens
// API:er direkt (utom Viva Wallet Smart Checkout redirect).
//
// .env-fil (skapa i projektroten, COMMITTA ALDRIG):
//
//   FORTNOX_CLIENT_ID=
//   FORTNOX_CLIENT_SECRET=
//   FORTNOX_ACCESS_TOKEN=
//   FORTNOX_REFRESH_TOKEN=
//
//   ONGOING_BASE_URL=https://api.ongoingwarehouse.com/v1/{goodsOwnerId}
//   ONGOING_GOODS_OWNER_ID=
//   ONGOING_USERNAME=
//   ONGOING_PASSWORD=
//
//   VIVA_MERCHANT_ID=
//   VIVA_API_KEY=
//   VIVA_CLIENT_ID=
//   VIVA_CLIENT_SECRET=
//   VIVA_SOURCE_CODE=
//   VIVA_ENVIRONMENT=demo  # "demo" eller "production"
//
//   BACKEND_PORT=3001

const INTEGRATION_CONFIG = {

  // Backend proxy – dynamisk baserad på nuvarande domän (fungerar lokalt och på Railway)
  backendUrl: (typeof window !== "undefined" ? window.location.origin : "http://localhost:3001") + "/api",

  fortnox: {
    // OAuth 2.0 – tokens hanteras server-side
    apiBase: "https://api.fortnox.se/3",
    authUrl: "https://apps.fortnox.se/oauth-v1/auth",
    tokenUrl: "https://apps.fortnox.se/oauth-v1/token",
    scopes: ["bookkeeping", "invoice", "customer", "article", "order"],

    // Proxy-endpoints (frontend anropar dessa)
    endpoints: {
      createInvoice: "/fortnox/invoices",
      getInvoice: "/fortnox/invoices/:id",
      createCustomer: "/fortnox/customers",
      getCustomer: "/fortnox/customers/:id",
      createOrder: "/fortnox/orders",
      getOrder: "/fortnox/orders/:id",
      syncArticles: "/fortnox/articles/sync"
    }
  },

  ongoing: {
    // Basic Auth – credentials hanteras server-side
    // Goods Owner REST API
    apiDocs: "https://developer.ongoingwarehouse.com/REST/v1/index.html",

    // Proxy-endpoints
    endpoints: {
      getStock: "/ongoing/stock",
      getArticle: "/ongoing/articles/:id",
      syncArticles: "/ongoing/articles/sync",
      createOrder: "/ongoing/orders",
      getOrder: "/ongoing/orders/:id",
      getShippingMethods: "/ongoing/shipping-methods",
      getInventory: "/ongoing/inventory"
    }
  },

  vivawallet: {
    // Smart Checkout – delvis klient-side (redirect)
    demoUrl: "https://demo-api.vivapayments.com",
    productionUrl: "https://api.vivapayments.com",
    checkoutDemoUrl: "https://demo.vivapayments.com/web/checkout",
    checkoutProductionUrl: "https://www.vivapayments.com/web/checkout",

    // Proxy-endpoints
    endpoints: {
      createPaymentOrder: "/vivawallet/payment-order",
      verifyPayment: "/vivawallet/verify/:transactionId",
      getTransaction: "/vivawallet/transactions/:id"
    },

    // Webhook events att lyssna på
    webhooks: [
      "Transaction Payment Created",
      "Transaction Failed",
      "Transaction Reversed"
    ]
  }
};

if (typeof module !== "undefined") {
  module.exports = INTEGRATION_CONFIG;
}
