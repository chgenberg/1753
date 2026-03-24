// Fortnox API Client – 1753 SKINCARE
//
// Bokföring, fakturor, kunder och artiklar.
// Alla anrop går via backend-proxyn (server.js).
//
// Fortnox API v3: https://apps.fortnox.se/apidocs
// Auth: OAuth 2.0 Bearer token (hanteras server-side)

const FortnoxClient = {

  _baseUrl: (typeof INTEGRATION_CONFIG !== "undefined"
    ? INTEGRATION_CONFIG.backendUrl
    : "http://localhost:3001/api"),

  async _request(endpoint, method, body) {
    const url = this._baseUrl + endpoint;
    const opts = {
      method: method || "GET",
      headers: { "Content-Type": "application/json" }
    };
    if (body) opts.body = JSON.stringify(body);

    const res = await fetch(url, opts);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `Fortnox-fel: ${res.status}`);
    }
    return res.json();
  },

  // ---- KUNDER ----

  async createCustomer(customerData) {
    // customerData: { Name, Email, Phone, Address1, ZipCode, City, CountryCode }
    return this._request("/fortnox/customers", "POST", {
      Customer: {
        Name: customerData.name,
        Email: customerData.email,
        Phone: customerData.phone || "",
        Address1: customerData.address,
        ZipCode: customerData.zip,
        City: customerData.city,
        CountryCode: customerData.country || "SE",
        Type: "PRIVATE",
        VATType: "SEVAT"
      }
    });
  },

  async getCustomer(customerNumber) {
    return this._request(`/fortnox/customers/${customerNumber}`);
  },

  async findCustomerByEmail(email) {
    return this._request(`/fortnox/customers?filter=email&email=${encodeURIComponent(email)}`);
  },

  // ---- ORDRAR ----

  async createOrder(orderData) {
    // orderData: { customerNumber, items: [{ articleNumber, quantity, price }], deliveryAddress }
    const orderRows = orderData.items.map(item => ({
      ArticleNumber: item.articleNumber,
      OrderedQuantity: item.quantity,
      DeliveredQuantity: 0,
      Price: item.price
    }));

    return this._request("/fortnox/orders", "POST", {
      Order: {
        CustomerNumber: orderData.customerNumber,
        OrderDate: new Date().toISOString().split("T")[0],
        DeliveryAddress1: orderData.deliveryAddress?.address || "",
        DeliveryZipCode: orderData.deliveryAddress?.zip || "",
        DeliveryCity: orderData.deliveryAddress?.city || "",
        DeliveryCountry: orderData.deliveryAddress?.country || "SE",
        Currency: "SEK",
        OrderRows: orderRows
      }
    });
  },

  async getOrder(orderNumber) {
    return this._request(`/fortnox/orders/${orderNumber}`);
  },

  // ---- FAKTUROR ----

  async createInvoiceFromOrder(orderNumber) {
    return this._request(`/fortnox/orders/${orderNumber}/createinvoice`, "PUT");
  },

  async getInvoice(invoiceNumber) {
    return this._request(`/fortnox/invoices/${invoiceNumber}`);
  },

  async bookkeepInvoice(invoiceNumber) {
    return this._request(`/fortnox/invoices/${invoiceNumber}/bookkeep`, "PUT");
  },

  // ---- ARTIKLAR ----

  async syncArticles(products) {
    // Synkar PRODUCTS-arrayen till Fortnox-artiklar
    const articles = products.map(p => ({
      ArticleNumber: p.id,
      Description: p.name,
      SalesPrice: p.price,
      PurchasePrice: 0,
      Unit: "st",
      VAT: 25,
      Active: true
    }));

    return this._request("/fortnox/articles/sync", "POST", { articles });
  },

  async getArticle(articleNumber) {
    return this._request(`/fortnox/articles/${articleNumber}`);
  },

  // ---- BETALNINGAR ----

  async registerPayment(invoiceNumber, amount, paymentDate) {
    return this._request("/fortnox/invoicepayments", "POST", {
      InvoicePayment: {
        InvoiceNumber: invoiceNumber,
        Amount: amount,
        AmountCurrency: amount,
        CurrencyCode: "SEK",
        PaymentDate: paymentDate || new Date().toISOString().split("T")[0]
      }
    });
  }
};

if (typeof module !== "undefined") {
  module.exports = FortnoxClient;
}
