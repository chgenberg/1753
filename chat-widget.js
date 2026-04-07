// 1753 SKINCARE – Chat Widget
// Minimalistisk chattfunktion med OpenAI-integration och varukorgsatgarder

(function () {
  "use strict";

  const API_BASE =
    typeof INTEGRATION_CONFIG !== "undefined" && INTEGRATION_CONFIG.backendUrl
      ? INTEGRATION_CONFIG.backendUrl
      : "http://localhost:3001/api";

  let responseId = null;
  let isOpen = false;
  let tipsOpen = false;
  let messageCount = 0;
  const MAX_MESSAGES = 40;

  const TIPS = [
    "Vilken produkt passar bäst för torr hud?",
    "Lägg The ONE Facial Oil i min varukorg",
    "Vad är skillnaden mellan The ONE och I LOVE?",
    "Förklara hur CBD påverkar huden",
    "Jag har rosacea – vad rekommenderar ni?",
    "Hur fungerar hudens endocannabinoidsystem?",
    "Ge mig en komplett morgonrutin",
    "Vad är CBG och varför är det bra för huden?",
    "Vilka ingredienser bör jag undvika i hudvård?",
    "Hur påverkar stress min hud?",
    "Vad är hudens mikrobiom?",
    "Rekommendera något för anti-aging",
    "Hur använder jag TA-DA Serum?",
    "Vad innehåller Fungtastic och varför svamp?",
    "Ge mig tips för bättre sömn och hudhälsa",
    "Vilken kost är bäst för huden?",
    "Lägg DUO-kit + TA-DA i varukorgen",
    "Är era produkter veganska?",
    "Vad är gut-skin axis?",
    "Hjälp mig välja rätt ansiktsolja"
  ];

  function injectHTML() {
    const widget = document.createElement("div");
    widget.id = "cw";
    widget.innerHTML = `
      <button class="cw-trigger" id="cw-trigger" aria-label="Öppna chatt">
        <svg class="cw-trigger-icon cw-trigger-icon--chat" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
        <svg class="cw-trigger-icon cw-trigger-icon--close" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
      <div class="cw-backdrop" id="cw-backdrop"></div>
      <div class="cw-modal" id="cw-modal" role="dialog" aria-label="Chatt med 1753 SKINCARE">
        <div class="cw-modal-inner">
          <div class="cw-header">
            <div class="cw-header-left">
              <div class="cw-avatar">1753</div>
              <div>
                <div class="cw-header-title">1753 SKINCARE</div>
                <div class="cw-header-sub">Hudvårdsrådgivare</div>
              </div>
            </div>
            <button class="cw-close" id="cw-close" aria-label="Stäng">&times;</button>
          </div>
          <div class="cw-messages" id="cw-messages"></div>
          <div class="cw-tips-overlay" id="cw-tips-overlay">
            <div class="cw-tips-header">
              <span class="cw-tips-title">Vad kan jag hjälpa dig med?</span>
              <button class="cw-tips-close" id="cw-tips-close" aria-label="Stäng tips">&times;</button>
            </div>
            <div class="cw-tips-grid" id="cw-tips-grid"></div>
          </div>
          <form class="cw-form" id="cw-form" autocomplete="off">
            <button type="button" class="cw-tips-btn" id="cw-tips-btn" aria-label="Visa tips">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            </button>
            <input type="text" class="cw-input" id="cw-input" placeholder="Ställ en fråga..." maxlength="500" aria-label="Skriv ett meddelande">
            <button type="submit" class="cw-send" aria-label="Skicka">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
            </button>
          </form>
        </div>
      </div>`;
    document.body.appendChild(widget);
  }

  function $(id) { return document.getElementById(id); }

  function open() {
    isOpen = true;
    const modal = $("cw-modal");
    const backdrop = $("cw-backdrop");
    const trigger = $("cw-trigger");
    modal.classList.add("cw-modal--open");
    backdrop.classList.add("cw-backdrop--open");
    trigger.classList.add("cw-trigger--open");

    if ($("cw-messages").children.length === 0) {
      appendMessage("assistant", "Hej! Välkomna till 1753 SKINCARE. Vad kan jag hjälpa dig med idag? Jag kan svara på frågor om våra produkter, hudvård, livsstil – eller lägga något direkt i din varukorg.");
    }

    setTimeout(() => $("cw-input")?.focus(), 300);
  }

  function close() {
    isOpen = false;
    $("cw-modal").classList.remove("cw-modal--open");
    $("cw-backdrop").classList.remove("cw-backdrop--open");
    $("cw-trigger").classList.remove("cw-trigger--open");
  }

  function toggle() {
    isOpen ? close() : open();
  }

  function appendMessage(role, text) {
    const messages = $("cw-messages");
    if (!messages) return;

    const bubble = document.createElement("div");
    bubble.className = "cw-bubble cw-bubble--" + role;

    if (role === "assistant") {
      bubble.innerHTML = formatMarkdown(text);
    } else {
      bubble.textContent = text;
    }

    messages.appendChild(bubble);
    messages.scrollTop = messages.scrollHeight;
    messageCount++;
  }

  function appendProductCard(productId) {
    if (typeof PRODUCTS === "undefined") return;
    const p = PRODUCTS.find(pr => pr.id === productId);
    if (!p) return;

    const messages = $("cw-messages");
    const card = document.createElement("div");
    card.className = "cw-product-card";
    card.innerHTML = `
      <img src="${p.image}" alt="${p.name}" loading="lazy">
      <div class="cw-product-info">
        <div class="cw-product-name">${p.name}</div>
        <div class="cw-product-price">${p.price.toLocaleString("sv-SE")} kr</div>
      </div>
      <a href="product.html?id=${p.id}" class="cw-product-link">Visa</a>`;
    messages.appendChild(card);
    messages.scrollTop = messages.scrollHeight;
  }

  function showTyping() {
    const messages = $("cw-messages");
    const typing = document.createElement("div");
    typing.className = "cw-typing";
    typing.id = "cw-typing";
    typing.innerHTML = "<span></span><span></span><span></span>";
    messages.appendChild(typing);
    messages.scrollTop = messages.scrollHeight;
  }

  function hideTyping() {
    const el = $("cw-typing");
    if (el) el.remove();
  }

  function formatMarkdown(text) {
    return text
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/^- (.+)$/gm, "<li>$1</li>")
      .replace(/(<li>[\s\S]*?<\/li>)/g, m => m.startsWith("<ul>") ? m : "<ul>" + m + "</ul>")
      .replace(/\n\n/g, "</p><p>")
      .replace(/\n/g, "<br>")
      .replace(/^/, "<p>")
      .replace(/$/, "</p>");
  }

  async function sendMessage(text) {
    if (!text.trim()) return;
    if (messageCount >= MAX_MESSAGES) {
      appendMessage("assistant", "Vi har pratat ett tag nu! För fler frågor, kontakta oss på christopher@1753skincare.com eller ring 0732-30 55 21.");
      return;
    }

    appendMessage("user", text.trim());
    showTyping();

    const input = $("cw-input");
    if (input) { input.value = ""; input.focus(); }

    try {
      const res = await fetch(API_BASE + "/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text.trim(),
          previousResponseId: responseId
        })
      });

      hideTyping();

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Nagonting gick fel.");
      }

      const data = await res.json();
      if (data.responseId) responseId = data.responseId;

      if (data.actions && data.actions.length > 0) {
        for (const action of data.actions) {
          if (action.type === "add_to_cart" && action.productId) {
            if (typeof addToCart === "function") {
              addToCart(action.productId);
            }
            appendProductCard(action.productId);
          }
        }
      }

      if (data.content) {
        appendMessage("assistant", data.content);
      }

    } catch (err) {
      hideTyping();
      appendMessage("assistant", "Oj, något gick fel. Försök igen eller kontakta oss på christopher@1753skincare.com.");
    }
  }

  function openTips() {
    const overlay = $("cw-tips-overlay");
    const grid = $("cw-tips-grid");
    if (!overlay || !grid) return;

    if (grid.children.length === 0) {
      grid.innerHTML = TIPS.map(tip =>
        `<button class="cw-tip" type="button">${tip}</button>`
      ).join("");

      grid.addEventListener("click", (e) => {
        if (e.target.classList.contains("cw-tip")) {
          closeTips();
          sendMessage(e.target.textContent);
        }
      });
    }

    tipsOpen = true;
    overlay.classList.add("cw-tips-overlay--open");
  }

  function closeTips() {
    tipsOpen = false;
    $("cw-tips-overlay")?.classList.remove("cw-tips-overlay--open");
  }

  function bindEvents() {
    $("cw-trigger")?.addEventListener("click", toggle);
    $("cw-backdrop")?.addEventListener("click", close);
    $("cw-close")?.addEventListener("click", close);

    $("cw-tips-btn")?.addEventListener("click", () => {
      tipsOpen ? closeTips() : openTips();
    });
    $("cw-tips-close")?.addEventListener("click", closeTips);

    $("cw-form")?.addEventListener("submit", (e) => {
      e.preventDefault();
      const input = $("cw-input");
      if (input) sendMessage(input.value);
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && isOpen) {
        if (tipsOpen) { closeTips(); return; }
        close();
      }
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    injectHTML();
    bindEvents();
  });
})();
