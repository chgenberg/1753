// Viva Wallet Payment Client – 1753 SKINCARE
//
// Smart Checkout: https://developer.vivawallet.com/smart-checkout/smart-checkout-integration
// Payment API: https://developer.vivawallet.com/apis-for-payments/payment-api/
//
// Flöde:
//   1. Frontend skickar varukorg till backend → backend skapar Payment Order via Viva API
//   2. Backend returnerar orderCode → frontend redirectar till Viva Smart Checkout
//   3. Kund betalar → Viva redirectar tillbaka till vår success/fail URL
//   4. Backend tar emot webhook "Transaction Payment Created"
//   5. Backend skapar order i Fortnox + Ongoing
//
// Auth: OAuth 2.0 (hanteras server-side)

const VivaWalletClient = {

  _baseUrl: (typeof INTEGRATION_CONFIG !== "undefined"
    ? INTEGRATION_CONFIG.backendUrl
    : "http://localhost:3001/api"),

  _isDemo: true, // Sätt till false för produktion

  getCheckoutUrl() {
    return this._isDemo
      ? "https://demo.vivapayments.com/web/checkout"
      : "https://www.vivapayments.com/web/checkout";
  },

  // ---- BETALNINGSFLÖDE ----

  // Steg 1: Skapa payment order (via backend)
  async createPaymentOrder(cart, customerInfo) {
    const items = cart.map(item => {
      const product = typeof PRODUCTS !== "undefined"
        ? PRODUCTS.find(p => p.id === item.id)
        : null;
      return {
        articleNumber: item.id,
        name: product ? product.name : item.id,
        quantity: item.qty,
        unitPrice: product ? product.price : 0
      };
    });

    const totalAmount = items.reduce((sum, i) => sum + (i.unitPrice * i.quantity), 0);

    const response = await fetch(this._baseUrl + "/vivawallet/payment-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: Math.round(totalAmount * 100), // Viva vill ha belopp i cent
        currency: "SEK",
        customerEmail: customerInfo.email,
        customerName: customerInfo.name,
        customerPhone: customerInfo.phone || "",
        items: items,
        merchantTrns: `order-${Date.now()}`,
        customerTrns: "1753 SKINCARE – Beställning"
      })
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || `Betalningsfel: ${response.status}`);
    }

    return response.json(); // { orderCode: "..." }
  },

  // Steg 2: Redirecta till Viva Smart Checkout
  redirectToCheckout(orderCode) {
    const checkoutUrl = this.getCheckoutUrl();
    window.location.href = `${checkoutUrl}?ref=${orderCode}`;
  },

  // Steg 3: Verifiera betalning (anropas på success-sidan)
  async verifyPayment(transactionId) {
    const response = await fetch(
      this._baseUrl + `/vivawallet/verify/${transactionId}`
    );

    if (!response.ok) {
      throw new Error("Kunde inte verifiera betalningen");
    }

    return response.json();
  },

  // Komplett checkout-flöde: skapa order → redirecta
  async checkout(customerInfo) {
    const cart = typeof getCart === "function" ? getCart() : [];
    if (cart.length === 0) {
      throw new Error("Varukorgen är tom");
    }

    const { orderCode } = await this.createPaymentOrder(cart, customerInfo);
    this.redirectToCheckout(orderCode);
  }
};

if (typeof module !== "undefined") {
  module.exports = VivaWalletClient;
}
