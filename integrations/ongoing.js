// Ongoing WMS API Client – 1753 SKINCARE
//
// 3PL-lager: artiklar, ordrar, lagersaldo, frakt.
// Goods Owner REST API: https://developer.ongoingwarehouse.com/REST/v1/index.html
// Auth: Basic Auth (hanteras server-side)
//
// Alla anrop går via backend-proxyn (server.js).

const OngoingClient = {

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
      throw new Error(err.message || `Ongoing-fel: ${res.status}`);
    }
    return res.json();
  },

  // ---- ARTIKLAR ----

  async syncArticles(products) {
    // Synkar PRODUCTS-arrayen till Ongoing WMS
    const articles = products.map(p => ({
      articleNumber: p.id,
      articleName: p.name,
      weight: 0,
      barCode: "",
      unitCode: "st",
      articleGroup: p.id.includes("paketet") ? "bundle" : "single"
    }));

    return this._request("/ongoing/articles/sync", "POST", { articles });
  },

  async getArticle(articleNumber) {
    return this._request(`/ongoing/articles/${encodeURIComponent(articleNumber)}`);
  },

  // ---- LAGERSALDO ----

  async getStock() {
    // Hämtar aktuellt lagersaldo för alla artiklar
    return this._request("/ongoing/stock");
  },

  async getStockForArticle(articleNumber) {
    return this._request(`/ongoing/stock/${encodeURIComponent(articleNumber)}`);
  },

  async getInventoryAdjustments(fromDate) {
    const params = fromDate ? `?from=${fromDate}` : "";
    return this._request(`/ongoing/inventory${params}`);
  },

  // ---- ORDRAR ----

  async createOrder(orderData) {
    // orderData: { orderNumber, customer, items, deliveryAddress, shippingMethod }
    return this._request("/ongoing/orders", "POST", {
      orderNumber: orderData.orderNumber,
      goodsOwnerOrderId: orderData.orderNumber,
      orderRemark: orderData.remark || "",
      deliveryDate: orderData.deliveryDate || null,
      consignee: {
        name: orderData.customer.name,
        address1: orderData.deliveryAddress.address,
        postCode: orderData.deliveryAddress.zip,
        city: orderData.deliveryAddress.city,
        countryCode: orderData.deliveryAddress.country || "SE",
        mobilePhone: orderData.customer.phone || "",
        email: orderData.customer.email
      },
      orderLines: orderData.items.map((item, i) => ({
        rowNumber: i + 1,
        articleNumber: item.articleNumber,
        numberOfItems: item.quantity,
        comment: ""
      })),
      transporter: orderData.shippingMethod || null
    });
  },

  async getOrder(orderNumber) {
    return this._request(`/ongoing/orders/${encodeURIComponent(orderNumber)}`);
  },

  async getOrdersByStatus(status) {
    // status: "open", "shipped", "cancelled"
    return this._request(`/ongoing/orders?status=${status}`);
  },

  // ---- FRAKT ----

  async getShippingMethods() {
    return this._request("/ongoing/shipping-methods");
  },

  // ---- SYNK-HJÄLPARE ----

  // Kontrollera om en produkt finns i lager
  async isInStock(articleNumber, requiredQty) {
    try {
      const stock = await this.getStockForArticle(articleNumber);
      return (stock.availableQuantity || 0) >= (requiredQty || 1);
    } catch {
      return false;
    }
  },

  // Hämta lagersaldo för alla produkter och returnera som {articleNumber: quantity}
  async getStockMap() {
    const stock = await this.getStock();
    const map = {};
    if (Array.isArray(stock)) {
      stock.forEach(item => {
        map[item.articleNumber] = item.availableQuantity || 0;
      });
    }
    return map;
  }
};

if (typeof module !== "undefined") {
  module.exports = OngoingClient;
}
