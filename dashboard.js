/* ---- 1753 SKINCARE – Dashboard ---- */

const Dashboard = (() => {

  // ---- AUTH ----

  const AUTH_KEY = "1753_user";

  function getUser() {
    if (typeof AuthClient !== "undefined" && AuthClient.getUser) {
      return AuthClient.getUser();
    }
    try {
      return JSON.parse(localStorage.getItem(AUTH_KEY));
    } catch {
      return null;
    }
  }

  function checkAuth() {
    const user = getUser();
    if (!user) {
      window.location.href = "login.html";
      return null;
    }
    return user;
  }

  function logout() {
    if (typeof AuthClient !== "undefined" && AuthClient.logout) {
      AuthClient.logout();
    }
    localStorage.removeItem(AUTH_KEY);
    window.location.href = "login.html";
  }

  // ---- NAVIGATION ----

  let currentView = "overview";

  function initNavigation() {
    const links = document.querySelectorAll("[data-view]");
    links.forEach(link => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        switchView(link.dataset.view);
      });
    });

    const logoutLink = document.getElementById("logout-link");
    if (logoutLink) {
      logoutLink.addEventListener("click", (e) => {
        e.preventDefault();
        logout();
      });
    }

    const hash = window.location.hash.replace("#", "");
    if (hash && document.getElementById("view-" + hash)) {
      switchView(hash);
    }
  }

  function switchView(view) {
    currentView = view;

    document.querySelectorAll(".dashboard-view").forEach(el => {
      el.classList.remove("active");
    });
    const target = document.getElementById("view-" + view);
    if (target) target.classList.add("active");

    document.querySelectorAll("[data-view]").forEach(el => {
      el.classList.remove("active");
    });
    const navLink = document.querySelector(`[data-view="${view}"]`);
    if (navLink) navLink.classList.add("active");

    window.location.hash = view;

    const sidebarNav = document.querySelector(".sidebar-nav");
    if (sidebarNav) sidebarNav.classList.remove("open");
  }

  // ---- USER DATA ----

  function populateUserInfo(user) {
    const greeting = document.getElementById("sidebar-greeting");
    const email = document.getElementById("sidebar-email");
    const welcome = document.getElementById("welcome-header");

    if (greeting) greeting.textContent = "Hej, " + (user.name || user.email || "").split(" ")[0];
    if (email) email.textContent = user.email || "";
    if (welcome) welcome.textContent = "Valkomna tillbaka" + (user.name ? ", " + user.name.split(" ")[0] : "");
  }

  // ---- STATS ----

  function loadStats() {
    const analyses = getSkinHistory();
    const orders = getOrders();
    const wishlist = getWishlist();
    const points = calculatePoints(orders);
    const tier = calculateTier(points);

    const skinScore = document.getElementById("stat-skin-score");
    const ordersEl = document.getElementById("stat-orders");
    const wishlistEl = document.getElementById("stat-wishlist");
    const pointsEl = document.getElementById("stat-points");
    const tierEl = document.getElementById("stat-tier");

    if (skinScore) skinScore.textContent = analyses.length > 0 ? analyses[0].score || "--" : "--";
    if (ordersEl) ordersEl.textContent = orders.length;
    if (wishlistEl) wishlistEl.textContent = wishlist.length;
    if (pointsEl) pointsEl.textContent = points.toLocaleString("sv-SE");
    if (tierEl) tierEl.textContent = tier;
  }

  // ---- ORDERS ----

  const ORDERS_KEY = "1753_orders";

  function getOrders() {
    try {
      const stored = JSON.parse(localStorage.getItem(ORDERS_KEY));
      if (stored && stored.length) return stored;
    } catch { /* fall through to mock */ }
    return getMockOrders();
  }

  function getMockOrders() {
    const cart = typeof getCart === "function" ? getCart() : [];
    const orders = [];

    if (cart.length > 0) {
      const items = cart.map(c => {
        const p = PRODUCTS.find(pr => pr.id === c.id);
        return p ? { id: p.id, name: p.name, qty: c.qty, price: p.price } : null;
      }).filter(Boolean);

      if (items.length) {
        orders.push({
          id: "ORD-2026-001",
          date: "2026-03-22",
          status: "processing",
          items: items,
          total: items.reduce((s, i) => s + i.price * i.qty, 0),
          tracking: null
        });
      }
    }

    orders.push(
      {
        id: "ORD-2026-002",
        date: "2026-03-15",
        status: "shipped",
        items: [
          { id: "duo-kit", name: "DUO-kit (The ONE + I LOVE Facial Oil)", qty: 1, price: 1099 },
          { id: "ta-da-serum", name: "TA-DA Serum", qty: 1, price: 699 }
        ],
        total: 1798,
        tracking: "SE123456789"
      },
      {
        id: "ORD-2026-003",
        date: "2026-02-28",
        status: "delivered",
        items: [
          { id: "the-one-facial-oil", name: "The ONE Facial Oil", qty: 2, price: 649 }
        ],
        total: 1298,
        tracking: "SE987654321"
      }
    );

    return orders;
  }

  function renderOrders(containerId, limit) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const orders = getOrders();
    const list = limit ? orders.slice(0, limit) : orders;

    if (list.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
          <h3>Du har inga ordrar annu</h3>
          <p>Nar du gor din forsta bestallning visas den har.</p>
          <a href="index.html" class="btn btn-primary">Utforska produkter</a>
        </div>`;
      return;
    }

    const statusMap = {
      processing: { label: "Behandlas", class: "status-processing" },
      shipped: { label: "Skickad", class: "status-shipped" },
      delivered: { label: "Levererad", class: "status-delivered" }
    };

    container.innerHTML = list.map(order => {
      const status = statusMap[order.status] || statusMap.processing;
      const itemNames = order.items.map(i => i.qty > 1 ? i.qty + "x " + i.name : i.name).join(", ");
      return `
        <div class="order-card">
          <div class="order-info">
            <h4>${order.id}</h4>
            <div class="order-meta">${formatDate(order.date)}</div>
            <div class="order-items-list">${itemNames}</div>
          </div>
          <div class="order-right">
            <div class="order-total">${order.total.toLocaleString("sv-SE")} kr</div>
            <span class="status-badge ${status.class}">${status.label}</span>
            ${order.tracking ? `<div style="margin-top:6px;font-size:0.75rem;color:var(--brown);">Sparing: ${order.tracking}</div>` : ""}
          </div>
        </div>`;
    }).join("");
  }

  // ---- SKIN JOURNEY ----

  const SKIN_KEY = "1753_skin_history";

  function getSkinHistory() {
    try {
      const stored = JSON.parse(localStorage.getItem(SKIN_KEY));
      if (stored && stored.length) return stored;
    } catch { /* fall through */ }

    const analysisResult = localStorage.getItem("1753_analysis_result");
    if (analysisResult) {
      return [{
        date: new Date().toISOString().split("T")[0],
        score: 72,
        summary: "Huden visar tecken pa uttorkning men god grundstruktur.",
        tips: ["Oka vattenintag", "Anvand ansiktsolja morgon och kvall", "Undvik starka rengoring"]
      }];
    }

    return getMockSkinHistory();
  }

  function getMockSkinHistory() {
    return [
      {
        date: "2026-03-20",
        score: 78,
        summary: "Forbattrad fuktbalans. Huden ar lugnare och jamnnare.",
        tips: ["Fortsatt med nuvarande rutin", "Lagg till serum for extra fukt", "Se over somn och stressniva"]
      },
      {
        date: "2026-02-15",
        score: 65,
        summary: "Nagot torr hud med tendenser till rodnad. Hudbarriar behover starkas.",
        tips: ["Borja med CBD-baserad ansiktsolja", "Undvik produkter med starka tensider", "Oka intag av omega-3"]
      },
      {
        date: "2026-01-10",
        score: 58,
        summary: "Forsta analysen. Torr och kanslig hud med nedsatt barriarfunktion.",
        tips: ["Paborja en enkel hudvardsrutin", "Fokusera pa ateruppbyggnad av hudbarriar", "Minska stress"]
      }
    ];
  }

  function renderTimeline() {
    const container = document.getElementById("skin-timeline");
    if (!container) return;

    const history = getSkinHistory();

    if (history.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><circle cx="9" cy="10" r="1"/><circle cx="15" cy="10" r="1"/></svg>
          <h3>Ingen analys gjord annu</h3>
          <p>Gor din forsta hudanalys for att borja folja din hudresa.</p>
          <a href="analysis.html" class="btn btn-primary">Starta hudanalys</a>
        </div>`;
      return;
    }

    container.innerHTML = '<div class="timeline">' + history.map(entry => `
      <div class="timeline-entry">
        <div class="timeline-dot"></div>
        <div class="timeline-date">${formatDate(entry.date)}</div>
        <div class="timeline-title">${entry.summary}</div>
        ${entry.score ? `<span class="timeline-score">Hudpoang: ${entry.score}/100</span>` : ""}
      </div>
    `).join("") + '</div>';

    const latest = history[0];
    const tipsEl = document.getElementById("skin-tips");
    if (tipsEl && latest.tips && latest.tips.length) {
      tipsEl.innerHTML = '<ul style="padding-left:18px;">' +
        latest.tips.map(t => `<li style="font-size:0.88rem;color:var(--dark-light);line-height:1.7;margin-bottom:4px;">${t}</li>`).join("") +
        '</ul>';
    }
  }

  // ---- ROUTINE ----

  const ROUTINE_KEY = "1753_routine";
  const STREAK_KEY = "1753_routine_streak";

  function getDefaultRoutine() {
    return {
      morning: [
        { id: "m1", text: "Skolj ansiktet med ljummet vatten", product: null, done: false },
        { id: "m2", text: "Applicera 3-4 droppar The ONE Facial Oil", product: "the-one-facial-oil", done: false },
        { id: "m3", text: "Avsluta med 1-2 pump TA-DA Serum", product: "ta-da-serum", done: false }
      ],
      evening: [
        { id: "e1", text: "Rengoring med Au Naturel Makeup Remover", product: "au-naturel-makeup-remover", done: false },
        { id: "e2", text: "Applicera 3-4 droppar I LOVE Facial Oil", product: "i-love-facial-oil", done: false },
        { id: "e3", text: "Avsluta med 1-2 pump TA-DA Serum", product: "ta-da-serum", done: false },
        { id: "e4", text: "Ta 2 kapslar Fungtastic Mushroom Extract", product: "fungtastic-mushroom-extract", done: false }
      ]
    };
  }

  function getRoutine() {
    try {
      const stored = JSON.parse(localStorage.getItem(ROUTINE_KEY));
      if (stored && stored.morning) {
        const today = new Date().toISOString().split("T")[0];
        if (stored.date !== today) {
          checkStreakUpdate(stored);
          stored.morning.forEach(s => s.done = false);
          stored.evening.forEach(s => s.done = false);
          stored.date = today;
          localStorage.setItem(ROUTINE_KEY, JSON.stringify(stored));
        }
        return stored;
      }
    } catch { /* fall through */ }

    const routine = getDefaultRoutine();
    routine.date = new Date().toISOString().split("T")[0];
    localStorage.setItem(ROUTINE_KEY, JSON.stringify(routine));
    return routine;
  }

  function checkStreakUpdate(routine) {
    const allDone = routine.morning.every(s => s.done) && routine.evening.every(s => s.done);
    const streak = getStreak();
    if (allDone) {
      saveStreak(streak.count + 1);
    } else {
      saveStreak(0);
    }
  }

  function getStreak() {
    try {
      return JSON.parse(localStorage.getItem(STREAK_KEY)) || { count: 0 };
    } catch {
      return { count: 0 };
    }
  }

  function saveStreak(count) {
    localStorage.setItem(STREAK_KEY, JSON.stringify({ count, date: new Date().toISOString().split("T")[0] }));
  }

  function completeRoutineStep(stepId) {
    const routine = getRoutine();
    const step = [...routine.morning, ...routine.evening].find(s => s.id === stepId);
    if (step) {
      step.done = !step.done;
      localStorage.setItem(ROUTINE_KEY, JSON.stringify(routine));
      renderRoutine();

      const allDone = routine.morning.every(s => s.done) && routine.evening.every(s => s.done);
      if (allDone) {
        showNotification("Alla steg klara. Bra jobbat!");
      }
    }
  }

  function renderRoutine() {
    const routine = getRoutine();
    const streak = getStreak();

    const streakEl = document.getElementById("streak-count");
    if (streakEl) streakEl.textContent = streak.count;

    renderRoutineBlock("morning-routine", routine.morning);
    renderRoutineBlock("evening-routine", routine.evening);
  }

  function renderRoutineBlock(containerId, steps) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = steps.map((step, i) => {
      const product = step.product ? PRODUCTS.find(p => p.id === step.product) : null;
      return `
        <div class="routine-step">
          <button class="routine-check ${step.done ? "done" : ""}" onclick="Dashboard.completeRoutineStep('${step.id}')" aria-label="Markera steg som klart">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
          </button>
          <span class="routine-step-num">${i + 1}</span>
          <div class="routine-step-content">
            <h4 style="${step.done ? 'text-decoration:line-through;opacity:0.5;' : ''}">${step.text}</h4>
            ${product ? `<p>${product.name} – ${product.price} kr</p>` : ""}
          </div>
        </div>`;
    }).join("");
  }

  function resetRoutine() {
    const routine = getRoutine();
    routine.morning.forEach(s => s.done = false);
    routine.evening.forEach(s => s.done = false);
    localStorage.setItem(ROUTINE_KEY, JSON.stringify(routine));
    renderRoutine();
    showNotification("Dagens rutin aterstalls.");
  }

  // ---- LOYALTY ----

  function calculatePoints(orders) {
    if (!orders) orders = getOrders();
    return orders.reduce((sum, order) => sum + (order.total || 0), 0);
  }

  function calculateTier(points) {
    if (points >= 4000) return "Platina";
    if (points >= 1500) return "Guld";
    if (points >= 500) return "Silver";
    return "Brons";
  }

  function getTierThresholds() {
    return [
      { name: "Brons", min: 0, max: 499 },
      { name: "Silver", min: 500, max: 1499 },
      { name: "Guld", min: 1500, max: 3999 },
      { name: "Platina", min: 4000, max: Infinity }
    ];
  }

  function renderLoyalty() {
    const orders = getOrders();
    const points = calculatePoints(orders);
    const tier = calculateTier(points);
    const tiers = getTierThresholds();
    const currentTier = tiers.find(t => t.name === tier);
    const nextTier = tiers[tiers.indexOf(currentTier) + 1];

    const headerEl = document.getElementById("loyalty-header");
    if (headerEl) {
      const tierClass = "tier-" + tier.toLowerCase();
      headerEl.innerHTML = `
        <div class="loyalty-tier-badge ${tierClass}">${tier}</div>
        <div class="loyalty-info">
          <h3>${tier}-medlem</h3>
          <p>${points.toLocaleString("sv-SE")} poang samlade</p>
        </div>`;
    }

    const progressEl = document.getElementById("loyalty-progress");
    if (progressEl && nextTier) {
      const progress = Math.min(100, ((points - currentTier.min) / (nextTier.min - currentTier.min)) * 100);
      const remaining = nextTier.min - points;
      progressEl.innerHTML = `
        <div class="progress-bar-bg">
          <div class="progress-bar-fill" style="width: ${progress}%"></div>
        </div>
        <div class="progress-labels">
          <span>${currentTier.name}</span>
          <span>${remaining > 0 ? remaining.toLocaleString("sv-SE") + " poang till " + nextTier.name : nextTier.name + " uppnatt!"}</span>
        </div>`;
    } else if (progressEl) {
      progressEl.innerHTML = `
        <div class="progress-bar-bg">
          <div class="progress-bar-fill" style="width: 100%"></div>
        </div>
        <div class="progress-labels">
          <span>Platina</span>
          <span>Hogsta nivaen uppnadd</span>
        </div>`;
    }

    renderRewards(points);

    const codeEl = document.getElementById("referral-code");
    if (codeEl) {
      const user = getUser();
      const code = user && user.name ? "1753-" + user.name.split(" ")[0].toUpperCase().slice(0, 4) + Math.floor(Math.random() * 900 + 100) : "1753-VARD" + Math.floor(Math.random() * 900 + 100);
      codeEl.textContent = code;
    }
  }

  function renderRewards(points) {
    const container = document.getElementById("rewards-list");
    if (!container) return;

    const rewards = [
      { name: "Gratis frakt pa nasta order", cost: 200, id: "free-shipping" },
      { name: "10% rabatt pa valfri produkt", cost: 500, id: "discount-10" },
      { name: "Gratis TA-DA Serum (50 ml)", cost: 1500, id: "free-serum" },
      { name: "Gratis DUO-kit", cost: 3000, id: "free-duo" },
      { name: "Privat hudvardsradgivning", cost: 5000, id: "consultation" }
    ];

    container.innerHTML = rewards.map(r => `
      <div class="reward-card">
        <div>
          <div class="reward-name">${r.name}</div>
          <div class="reward-cost">${r.cost.toLocaleString("sv-SE")} poang</div>
        </div>
        <button class="btn-sm ${points >= r.cost ? "btn-sm-primary" : "btn-sm-outline"}"
          ${points < r.cost ? "disabled style=\"opacity:0.4;cursor:not-allowed;\"" : ""}
          onclick="Dashboard.redeemReward('${r.id}')">
          ${points >= r.cost ? "Los in" : "Otillrackliga poang"}
        </button>
      </div>`).join("");
  }

  function redeemReward(rewardId) {
    showNotification("Forman inlost! Du far en bekraftelse via e-post.");
  }

  // ---- WISHLIST ----

  const WISHLIST_KEY = "1753_wishlist";

  function getWishlist() {
    try {
      return JSON.parse(localStorage.getItem(WISHLIST_KEY)) || [];
    } catch {
      return [];
    }
  }

  function addToWishlist(productId) {
    const list = getWishlist();
    if (!list.includes(productId)) {
      list.push(productId);
      localStorage.setItem(WISHLIST_KEY, JSON.stringify(list));
      showNotification("Tillagd i onskelistan");
    }
    if (currentView === "wishlist") renderWishlist();
    loadStats();
  }

  function removeFromWishlist(productId) {
    const list = getWishlist().filter(id => id !== productId);
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(list));
    if (currentView === "wishlist") renderWishlist();
    loadStats();
    showNotification("Borttagen fran onskelistan");
  }

  function renderWishlist() {
    const container = document.getElementById("wishlist-grid");
    if (!container) return;

    const wishlist = getWishlist();

    if (wishlist.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
          <h3>Din onskelista ar tom</h3>
          <p>Spara produkter du ar intresserad av for att hitta dem snabbt.</p>
          <a href="index.html" class="btn btn-primary">Utforska produkter</a>
        </div>`;
      return;
    }

    const products = wishlist.map(id => PRODUCTS.find(p => p.id === id)).filter(Boolean);

    container.innerHTML = '<div class="dash-products-grid">' + products.map(p => `
      <div class="dash-product-card">
        <a href="product.html?id=${p.id}" class="dash-product-img">
          <img src="${p.image}" alt="${p.name}" loading="lazy">
        </a>
        <div class="dash-product-name">${p.name}</div>
        <div class="dash-product-price">${p.price.toLocaleString("sv-SE")} kr</div>
        <div class="dash-product-actions">
          <button class="btn-sm btn-sm-primary" onclick="addToCart('${p.id}')">Lagg i varukorg</button>
          <button class="btn-sm btn-sm-outline" onclick="Dashboard.removeFromWishlist('${p.id}')">Ta bort</button>
        </div>
      </div>
    `).join("") + '</div>';
  }

  // ---- SUBSCRIPTIONS ----

  const SUBS_KEY = "1753_subscriptions";

  function getSubscriptions() {
    try {
      const stored = JSON.parse(localStorage.getItem(SUBS_KEY));
      if (stored && stored.length) return stored;
    } catch { /* fall through */ }
    return [];
  }

  function renderSubscriptions() {
    const container = document.getElementById("subscriptions-list");
    if (!container) return;

    const subs = getSubscriptions();

    if (subs.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 014-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 01-4 4H3"/></svg>
          <h3>Inga aktiva prenumerationer</h3>
          <p>Med en prenumeration far du dina favoritprodukter levererade automatiskt och sparar pengar.</p>
          <a href="index.html" class="btn btn-primary">Utforska produkter</a>
        </div>
        <div class="sub-savings">
          <h4>Visste du?</h4>
          <p>Med en prenumeration sparar du upp till <strong>15%</strong> pa varje leverans, plus gratis frakt.</p>
        </div>`;
      return;
    }

    container.innerHTML = subs.map(sub => {
      const product = PRODUCTS.find(p => p.id === sub.productId);
      if (!product) return "";
      return `
        <div class="sub-card">
          <div class="sub-header">
            <div>
              <div class="sub-product">${product.name}</div>
              <div class="sub-frequency">Var ${sub.intervalWeeks}:e vecka</div>
            </div>
            <span class="status-badge status-delivered">Aktiv</span>
          </div>
          <div class="sub-next">Nasta leverans: ${formatDate(sub.nextDelivery)}</div>
          <div class="sub-actions">
            <button class="btn-sm btn-sm-outline" onclick="Dashboard.pauseSubscription('${sub.id}')">Pausa</button>
            <button class="btn-sm btn-sm-outline" onclick="Dashboard.changeFrequency('${sub.id}')">Andra frekvens</button>
            <button class="btn-sm btn-sm-outline" style="color:var(--alert);border-color:var(--alert);" onclick="Dashboard.cancelSubscription('${sub.id}')">Avsluta</button>
          </div>
        </div>`;
    }).join("");

    const totalSaved = subs.reduce((sum, sub) => {
      const product = PRODUCTS.find(p => p.id === sub.productId);
      return sum + (product ? Math.round(product.price * 0.15 * (52 / sub.intervalWeeks)) : 0);
    }, 0);

    if (totalSaved > 0) {
      container.innerHTML += `
        <div class="sub-savings">
          <h4>Du sparar med prenumeration</h4>
          <div class="savings-amount">${totalSaved.toLocaleString("sv-SE")} kr/ar</div>
          <p>Jamfort med att kopa engangskop till ordinarie pris.</p>
        </div>`;
    }
  }

  function pauseSubscription(id) {
    showNotification("Prenumerationen ar pausad.");
  }

  function changeFrequency(id) {
    showNotification("Kontakta oss for att andra leveransfrekvens.");
  }

  function cancelSubscription(id) {
    if (confirm("Ar du saker pa att du vill avsluta prenumerationen?")) {
      const subs = getSubscriptions().filter(s => s.id !== id);
      localStorage.setItem(SUBS_KEY, JSON.stringify(subs));
      renderSubscriptions();
      showNotification("Prenumerationen ar avslutad.");
    }
  }

  // ---- RECOMMENDATIONS ----

  function getRecommendations() {
    const orders = getOrders();
    const purchasedIds = new Set();
    orders.forEach(o => o.items.forEach(i => purchasedIds.add(i.id)));

    const history = getSkinHistory();
    const latestTips = history.length > 0 ? (history[0].tips || []).join(" ").toLowerCase() : "";

    const scored = PRODUCTS.map(p => {
      let score = 0;
      if (!purchasedIds.has(p.id)) score += 2;

      if (latestTips.includes("fukt") && (p.shortDesc.toLowerCase().includes("fukt") || p.shortDesc.toLowerCase().includes("serum"))) {
        score += 3;
      }
      if (latestTips.includes("olja") && p.shortDesc.toLowerCase().includes("olja")) {
        score += 2;
      }
      if (latestTips.includes("lugn") && (p.shortDesc.toLowerCase().includes("lugn") || p.shortDesc.toLowerCase().includes("cbg"))) {
        score += 2;
      }
      if (latestTips.includes("rengoring") && p.shortDesc.toLowerCase().includes("rengoring")) {
        score += 2;
      }
      if (latestTips.includes("tarm") && p.shortDesc.toLowerCase().includes("svamp")) {
        score += 2;
      }

      if (p.reviews > 100) score += 1;

      return { product: p, score };
    });

    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, 3).map(s => s.product);
  }

  function renderRecommendations() {
    const container = document.getElementById("recommended-products");
    if (!container) return;

    const products = getRecommendations();

    container.innerHTML = products.map(p => `
      <a class="dash-product-card" href="product.html?id=${p.id}">
        <div class="dash-product-img">
          <img src="${p.image}" alt="${p.name}" loading="lazy">
        </div>
        <div class="dash-product-name">${p.name}</div>
        <div class="dash-product-price">${p.price.toLocaleString("sv-SE")} kr</div>
      </a>
    `).join("");
  }

  // ---- REORDER ----

  function getLastOrder() {
    const orders = getOrders();
    return orders.length > 0 ? orders[0] : null;
  }

  function reorder() {
    const order = getLastOrder();
    if (!order) {
      showNotification("Ingen tidigare order att bestalla om.");
      return;
    }
    order.items.forEach(item => {
      for (let i = 0; i < item.qty; i++) {
        if (typeof addToCart === "function") addToCart(item.id);
      }
    });
  }

  // ---- SETTINGS ----

  function loadProfile() {
    const user = getUser();
    if (!user) return;

    setVal("settings-name", user.name);
    setVal("settings-email", user.email);
    setVal("settings-phone", user.phone);
    setVal("settings-address", user.address);
    setVal("settings-zip", user.zip);
    setVal("settings-city", user.city);
  }

  function setVal(id, value) {
    const el = document.getElementById(id);
    if (el && value) el.value = value;
  }

  function handleSettingsForm() {
    const form = document.getElementById("settings-form");
    if (!form) return;

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const user = getUser() || {};

      user.name = form.name.value;
      user.email = form.email.value;
      user.phone = form.phone.value;
      user.address = form.address.value;
      user.zip = form.zip.value;
      user.city = form.city.value;

      localStorage.setItem(AUTH_KEY, JSON.stringify(user));
      populateUserInfo(user);
      showNotification("Profilen ar uppdaterad.");
    });
  }

  function handlePasswordChange() {
    const currentPw = document.getElementById("settings-current-pw");
    const newPw = document.getElementById("settings-new-pw");
    if (!currentPw || !newPw) return;

    newPw.addEventListener("change", () => {
      if (newPw.value.length > 0 && newPw.value.length < 8) {
        newPw.style.borderColor = "var(--alert)";
      } else {
        newPw.style.borderColor = "";
      }
    });
  }

  function handleDeleteAccount() {
    const btn = document.getElementById("delete-account-btn");
    if (!btn) return;

    btn.addEventListener("click", () => {
      if (confirm("Ar du helt saker? All data raderas permanent.")) {
        localStorage.removeItem(AUTH_KEY);
        localStorage.removeItem(ORDERS_KEY);
        localStorage.removeItem(SKIN_KEY);
        localStorage.removeItem(ROUTINE_KEY);
        localStorage.removeItem(STREAK_KEY);
        localStorage.removeItem(WISHLIST_KEY);
        localStorage.removeItem(SUBS_KEY);
        window.location.href = "index.html";
      }
    });
  }

  // ---- HELPERS ----

  function formatDate(dateStr) {
    if (!dateStr) return "";
    const months = ["jan", "feb", "mar", "apr", "maj", "jun", "jul", "aug", "sep", "okt", "nov", "dec"];
    const d = new Date(dateStr);
    return d.getDate() + " " + months[d.getMonth()] + " " + d.getFullYear();
  }

  // ---- INIT ----

  function init() {
    const user = checkAuth();
    if (!user) return;

    populateUserInfo(user);
    initNavigation();
    loadStats();
    renderOrders("recent-orders", 2);
    renderRecommendations();
    renderTimeline();
    renderRoutine();
    renderLoyalty();
    renderSubscriptions();
    renderWishlist();
    loadProfile();
    handleSettingsForm();
    handlePasswordChange();
    handleDeleteAccount();

    const reorderBtn = document.getElementById("reorder-btn");
    if (reorderBtn) {
      reorderBtn.addEventListener("click", (e) => {
        e.preventDefault();
        reorder();
      });
    }

    renderOrders("orders-list");
  }

  document.addEventListener("DOMContentLoaded", init);

  return {
    completeRoutineStep,
    resetRoutine,
    removeFromWishlist,
    addToWishlist,
    redeemReward,
    pauseSubscription,
    changeFrequency,
    cancelSubscription,
    reorder
  };

})();
