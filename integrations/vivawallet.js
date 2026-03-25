// Viva Wallet Payment Client – 1753 SKINCARE
//
// Flöde (via /api/orders/create):
//   1. Frontend skickar kunddata + varukorg till POST /api/orders/create
//   2. Backend skapar order i DB + Viva payment order, returnerar checkoutUrl
//   3. Frontend redirectar till Viva Smart Checkout
//   4. Kund betalar → Viva webhook → backend skapar Fortnox + Ongoing ordrar
//   5. Kund redirectas till success-sida → backup-verifiering
//
// Denna klient behålls för eventuell direkt Viva-kommunikation (verify etc.)

const VivaWalletClient = {

  _baseUrl: (typeof INTEGRATION_CONFIG !== "undefined"
    ? INTEGRATION_CONFIG.backendUrl
    : (typeof window !== "undefined" ? window.location.origin + "/api" : "http://localhost:3001/api")),

  async verifyPayment(transactionId) {
    const response = await fetch(
      this._baseUrl + `/vivawallet/verify/${transactionId}`
    );
    if (!response.ok) {
      throw new Error("Kunde inte verifiera betalningen");
    }
    return response.json();
  }
};

if (typeof module !== "undefined") {
  module.exports = VivaWalletClient;
}
