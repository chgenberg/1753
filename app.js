/** Lokala produktbilder: public/Products/ (server.js servar projektroten) */
const PRODUCTS = [
  {
    id: "duo-ta-da",
    articleNumber: "4004",
    category: "kit",
    name: "DUO-kit + TA-DA Serum",
    price: 1495,
    originalPrice: 1798,
    reviews: 173,
    image: "public/Products/DUOTADA.webp",
    shopifyImage: "https://www.1753skincare.com/cdn/shop/files/IMG_1034.jpg?width=600",
    shortDesc: "Hela rutinen i ett. Tre produkter som stärker huden på djupet – inte bara förbättrar ytan.",
    description: `<p>Det här är inte ytterligare en hudvårdsrutin. Det här är den enda du behöver.</p>
<p>Tre produkter. Ett syfte: en hud som fungerar bättre på egen hand. Lugnare, starkare, mer motståndskraftig.</p>
<h3>Varför den här rutinen funkar</h3>
<p>Produkterna är utvecklade för att samverka med hudens egna system – särskilt endocannabinoidsystemet och den mikrobiella balansen.</p>
<h3>Produkterna i kitet</h3>
<p><strong>The ONE Facial Oil</strong> – Din dagliga olja. 10% CBD och 0,2% CBG som skyddar, återfuktar och stärker hudbarriären.</p>
<p><strong>I LOVE Facial Oil</strong> – Kvällens återhämtning. 10% CBD och 5% CBG som lugnar, reparerar och djupåterfuktar.</p>
<p><strong>TA-DA Serum</strong> – Boosten som förstärker allt. 3% CBG i ekologisk jojobaolja som appliceras efter oljan.</p>
<h3>Så använder du rutinen</h3>
<p><strong>Morgon:</strong> Skölj ansiktet med ljummet vatten. 3–4 droppar The ONE Facial Oil. 1–2 pump TA-DA Serum.</p>
<p><strong>Kväll:</strong> Rengör huden varsamt. 3–4 droppar I LOVE Facial Oil. 1–2 pump TA-DA Serum.</p>
<p><em>Serumet appliceras efter oljan – inte före.</em></p>`,
    ingredients: null,
    size: null,
    guarantee: "Fri frakt. 14 dagars öppet köp."
  },
  {
    id: "ta-da-serum",
    articleNumber: "1005",
    category: "serum",
    name: "TA-DA Serum",
    price: 699,
    originalPrice: null,
    reviews: 20,
    image: "public/Products/TA-DA.webp",
    shopifyImage: "https://www.1753skincare.com/cdn/shop/files/1-Ta-Daserummforpackning.png?width=600",
    shortDesc: "CBG-berikat serum som låser in fukt och ger lyster. Din huds bästa kompis – oavsett årstid.",
    description: `<p>Torr hud? Det behöver inte vara så. TA-DA Serum låser in fukt som faktiskt stannar kvar.</p>
<h3>Kraften i CBG</h3>
<p>CBG (Cannabigerol) samarbetar med hudens eget endocannabinoidsystem. Resultatet? Bättre fuktbalans, mindre fuktförlust och en hud som trivs även i tuffa förhållanden.</p>
<h3>Det här får du</h3>
<ul>
<li>Fukt som stannar – inte avdunstar</li>
<li>Mindre inflammation och rodnad</li>
<li>Förbättrad elasticitet och fasthet</li>
<li>Synlig lyster redan efter första veckorna</li>
</ul>`,
    ingredients: "Simmondsia chinensis (Jojoba) Seed Oil (ekologisk), Cannabigerol (CBG, 3% / 1500 mg)",
    size: "Glasflaska med pump – 50 ml",
    guarantee: "Fri frakt. 14 dagars öppet köp."
  },
  {
    id: "duo-kit",
    articleNumber: "1003",
    category: "kit",
    name: "DUO-kit",
    price: 1099,
    originalPrice: null,
    reviews: 136,
    image: "public/Products/DUO-kit.webp",
    shopifyImage: "https://www.1753skincare.com/cdn/shop/files/2-facialoilduomedforpackning.png?width=600",
    shortDesc: "Två ansiktsoljor. En för morgonen, en för kvällen. Komplett hudvård som fungerar med din hud – inte mot den.",
    description: `<p>En olja för dagen. En för natten. Mer behöver det inte vara.</p>
<h3>The ONE Facial Oil – morgonen</h3>
<p>10% CBD och 0,2% CBG. Skyddar hudbarriären, återfuktar på djupet och ger ett jämnt, friskt uttryck.</p>
<h3>I LOVE Facial Oil – kvällen</h3>
<p>10% CBD och 5% CBG. Lugnar, reparerar och djupåterfuktar medan du sover. Extra kraftfull för stressad eller känslig hud.</p>
<h3>Så använder du kitet</h3>
<p><strong>Morgon:</strong> 3–4 droppar The ONE Facial Oil på ren hud.</p>
<p><strong>Kväll:</strong> 3–4 droppar I LOVE Facial Oil på ren hud.</p>
<p><em>Tänk "The ONE I LOVE" för att komma ihåg ordningen.</em></p>`,
    ingredients: null,
    size: "2 x 10 ml glasflaskor med pipett",
    guarantee: "Fri frakt. 14 dagars öppet köp."
  },
  {
    id: "au-naturel-makeup-remover",
    articleNumber: "1004",
    category: "cleanser",
    name: "Au Naturel Makeup Remover",
    price: 399,
    originalPrice: null,
    reviews: 83,
    image: "public/Products/Makeup Remover.webp",
    shopifyImage: "https://www.1753skincare.com/cdn/shop/files/6-Makeup-remover.png?width=600",
    shortDesc: "Rengöringsolja med MCT och CBD. Tar bort allt – utan att röra hudens naturliga balans.",
    description: `<p>De flesta rengöringsprodukter tar bort smuts men skadar huden i processen. Det här är inte en av dem.</p>
<p>Au Naturel löser upp makeup, smuts och luftföroreningar – utan att störa hudens mikrobiom.</p>
<h3>Det här får du</h3>
<ul>
<li>Ren hud utan den strama känslan</li>
<li>Djup återfuktning redan vid rengöring</li>
<li>Ökad elasticitet och fasthet</li>
<li>Bevarad mikrobiell mångfald</li>
</ul>
<h3>Så använder du den</h3>
<p>Applicera några droppar på ansiktet. Massera in. Avlägsna med en varm, fuktig handduk eller bomullspad.</p>`,
    ingredients: "Caprylic/Capric Triglyceride (MCT), Cannabidiol (CBD, 0,2%)",
    size: "Glasflaska med pump – 100 ml",
    sizes: ["100 ml"],
    guarantee: "Fri frakt. 14 dagars öppet köp."
  },
  {
    id: "fungtastic-mushroom-extract",
    articleNumber: "4001",
    category: "supplement",
    name: "Fungtastic Mushroom Extract",
    price: 399,
    originalPrice: null,
    reviews: 63,
    image: "public/Products/Fungtastic.webp",
    shopifyImage: "https://www.1753skincare.com/cdn/shop/files/8-Fungtastic.png?width=600",
    shortDesc: "Fyra medicinska svampar i perfekt balans. Stöd för immunförsvar, fokus, energi och sömn – inifrån.",
    description: `<p>Bra hud börjar inifrån. Fyra av naturens mest kraftfulla medicinska svampar – i perfekt balans.</p>
<h3>Fyra svampar – fyra superkrafter</h3>
<ul>
<li><strong>Chaga (25%)</strong> – Immunförsvarets bästa vän. Fullpackad med antioxidanter och Betulinic Acid.</li>
<li><strong>Lion's Mane (25%)</strong> – Boostar fokus, minne och mental klarhet.</li>
<li><strong>Cordyceps (25%)</strong> – Höjer uthållighet och fysisk prestation.</li>
<li><strong>Reishi (25%)</strong> – Främjar avslappning och djupare sömn.</li>
</ul>
<p>2 kapslar dagligen. De flesta känner skillnad efter 2–4 veckor.</p>`,
    ingredients: "Chaga (25%), Lion's Mane (25%), Cordyceps (25%), Reishi (25%) – 400 mg per kapsel (15:1 extrakt). Betaglukaner: minst 20%.",
    size: "60 kapslar",
    sizes: ["60 kapslar"],
    guarantee: null
  },
];

// ---- CART ----

function getCart() {
  try {
    return JSON.parse(localStorage.getItem("cart1753") || "[]");
  } catch {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem("cart1753", JSON.stringify(cart));
  updateCartUI();
}

function addToCart(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;
  const cart = getCart();
  const existing = cart.find(item => item.id === productId);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ id: productId, qty: 1 });
  }
  saveCart(cart);
  showNotification(product.name + " tillagd i varukorgen");
  document.querySelectorAll(".cart-count").forEach(el => {
    el.classList.remove("cart-count--bounce");
    void el.offsetWidth;
    el.classList.add("cart-count--bounce");
  });
}

function removeFromCart(productId) {
  const cart = getCart().filter(item => item.id !== productId);
  saveCart(cart);
}

function updateQty(productId, delta) {
  const cart = getCart();
  const item = cart.find(i => i.id === productId);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    removeFromCart(productId);
    return;
  }
  saveCart(cart);
}

function getCartTotal() {
  const cart = getCart();
  return cart.reduce((sum, item) => {
    const product = PRODUCTS.find(p => p.id === item.id);
    return sum + (product ? product.price * item.qty : 0);
  }, 0);
}

function getCartCount() {
  return getCart().reduce((sum, item) => sum + item.qty, 0);
}

const FREE_SHIPPING_THRESHOLD = 700;

/** Samma bas-URL som i index.html OG/canonical – ändra vid annan produktionsdomän. */
const SITE_ORIGIN = "https://1753skincare.com";

// ---- UI ----

function updateCartUI() {
  const countEls = document.querySelectorAll(".cart-count");
  const count = getCartCount();
  countEls.forEach(el => {
    el.textContent = count > 0 ? count : "";
  });
  renderCartDrawer();
}

function renderCartDrawer() {
  const itemsEl = document.querySelector(".cart-items");
  const totalEl = document.querySelector(".cart-total-amount");
  const footerEl = document.querySelector(".cart-footer");
  if (!itemsEl) return;

  const cart = getCart();
  if (cart.length === 0) {
    itemsEl.innerHTML = '<p class="cart-empty">Varukorgen är tom</p>';
    if (footerEl) footerEl.style.display = "none";
    return;
  }

  if (footerEl) footerEl.style.display = "";

  const total = getCartTotal();
  const shipRemaining = Math.max(0, FREE_SHIPPING_THRESHOLD - total);
  let shipHint = "";
  if (shipRemaining > 0) {
    shipHint =
      `<p class="cart-shipping-hint" role="status">Handla för <strong>${shipRemaining.toLocaleString("sv-SE")} kr</strong> till för fri frakt (vid ${FREE_SHIPPING_THRESHOLD.toLocaleString("sv-SE")} kr).</p>`;
  } else {
    shipHint = `<p class="cart-shipping-hint cart-shipping-hint--ok" role="status">Du har fri frakt på denna order.</p>`;
  }

  itemsEl.innerHTML =
    shipHint +
    cart
      .map(item => {
        const product = PRODUCTS.find(p => p.id === item.id);
        if (!product) return "";
        return `
      <div class="cart-item">
        <div class="cart-item-img" style="background-image: url('${product.image}'); background-size: cover; background-position: center;"></div>
        <div class="cart-item-details">
          <h4>${product.name}</h4>
          <div class="cart-item-price">${product.price} kr</div>
          <div class="cart-item-qty">
            <button type="button" onclick="updateQty('${product.id}', -1)">-</button>
            <span>${item.qty}</span>
            <button type="button" onclick="updateQty('${product.id}', 1)">+</button>
          </div>
          <button type="button" class="cart-item-remove" onclick="removeFromCart('${product.id}')">Ta bort</button>
        </div>
      </div>
    `;
      })
      .join("");

  if (totalEl) {
    totalEl.textContent = getCartTotal().toLocaleString("sv-SE") + " kr";
  }
}

function toggleCart() {
  const overlay = document.querySelector(".cart-overlay");
  const drawer = document.querySelector(".cart-drawer");
  if (!overlay || !drawer) return;
  const isOpen = drawer.classList.contains("open");
  if (isOpen) {
    overlay.classList.remove("open");
    drawer.classList.remove("open");
  } else {
    overlay.classList.add("open");
    drawer.classList.add("open");
    renderCartDrawer();
  }
}

function showNotification(msg) {
  let el = document.querySelector(".notification");
  if (!el) {
    el = document.createElement("div");
    el.className = "notification";
    document.body.appendChild(el);
  }
  el.textContent = msg;
  el.classList.add("show");
  setTimeout(() => el.classList.remove("show"), 2200);
}

function toggleMobileMenu() {
  const overlay = document.getElementById("mobile-nav-overlay");
  if (overlay) overlay.classList.toggle("open");
}

// ---- PRODUCTS GRID ----

function getFilteredSortedProducts(sortKey, categoryFilter) {
  let list = PRODUCTS.slice();
  if (categoryFilter && categoryFilter !== "all") {
    list = list.filter(p => p.category === categoryFilter);
  }
  if (sortKey === "price-asc") list.sort((a, b) => a.price - b.price);
  else if (sortKey === "price-desc") list.sort((a, b) => b.price - a.price);
  else list.sort((a, b) => b.reviews - a.reviews);
  return list;
}

function renderProductsGrid(containerId, productIds, options) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const opts = options || {};
  const products = productIds
    ? PRODUCTS.filter(p => productIds.includes(p.id))
    : getFilteredSortedProducts(opts.sort || "reviews-desc", opts.category || "all");

  container.innerHTML = products.map((p, i) => `
    <a class="product-card stagger-card" href="product.html?id=${p.id}" style="--stagger:${i}">
      <div class="product-card-img">
        <img src="${p.image}" alt="${p.name}" loading="lazy">
        ${p.originalPrice ? `<span class="price-badge" aria-label="Rabatt">%</span>` : ""}
        <div class="product-card-overlay">
          <div class="product-card-overlay-name">${p.name}</div>
          <div class="product-card-overlay-price">${p.price.toLocaleString("sv-SE")} kr</div>
        </div>
      </div>
      <div class="product-card-text">
        <h3>${p.name}</h3>
        <div class="price">
          ${p.price.toLocaleString("sv-SE")} kr${p.originalPrice ? `<span class="original">${p.originalPrice.toLocaleString("sv-SE")} kr</span>` : ""}
        </div>
        <div class="reviews-count">${p.reviews} omdömen</div>
      </div>
    </a>
  `).join("");

  if (typeof window.initStaggerCards === "function") {
    window.initStaggerCards(container);
  }
}

function initShopGrid(containerId) {
  let sortValue = "reviews-desc";
  let catValue = "all";

  const sortWrap = document.getElementById("shop-sort-wrap");
  const catWrap = document.getElementById("shop-filter-wrap");

  const refresh = () => {
    renderProductsGrid(containerId, null, { sort: sortValue, category: catValue });
  };

  if (sortWrap) {
    sortWrap.addEventListener("change", (e) => {
      sortValue = e.detail.value;
      refresh();
    });
  }
  if (catWrap) {
    catWrap.addEventListener("change", (e) => {
      catValue = e.detail.value;
      refresh();
    });
  }

  refresh();
}

function getRelatedProductIds(currentId, limit) {
  const current = PRODUCTS.find(p => p.id === currentId);
  const others = PRODUCTS.filter(p => p.id !== currentId);
  if (!current) return others.slice(0, limit).map(p => p.id);
  const same = others.filter(p => p.category === current.category);
  const rest = others.filter(p => p.category !== current.category);
  const merged = [...same, ...rest];
  return merged.slice(0, limit).map(p => p.id);
}

// ---- PRODUCT DETAIL ----

function upsertMetaByName(name, content) {
  let el = document.querySelector(`meta[name="${name}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute("name", name);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function upsertMetaByProperty(property, content) {
  let el = document.querySelector(`meta[property="${property}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute("property", property);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setProductPageMeta(product) {
  const desc = (product.shortDesc || "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 160);
  const pageUrl = `${SITE_ORIGIN}/product.html?id=${encodeURIComponent(product.id)}`;
  const absImage = `${SITE_ORIGIN}/${product.image.replace(/^\//, "")}`;

  document.title = `${product.name} – 1753 SKINCARE`;
  upsertMetaByName("description", desc);
  upsertMetaByProperty("og:type", "website");
  upsertMetaByProperty("og:locale", "sv_SE");
  upsertMetaByProperty("og:title", `${product.name} – 1753 SKINCARE`);
  upsertMetaByProperty("og:description", desc);
  upsertMetaByProperty("og:url", pageUrl);
  upsertMetaByProperty("og:image", absImage);
  upsertMetaByProperty("og:image:alt", product.name);
  upsertMetaByName("twitter:card", "summary_large_image");
  upsertMetaByName("twitter:title", product.name);
  upsertMetaByName("twitter:description", desc);

  let canon = document.querySelector('link[rel="canonical"]');
  if (!canon) {
    canon = document.createElement("link");
    canon.setAttribute("rel", "canonical");
    document.head.appendChild(canon);
  }
  canon.setAttribute("href", pageUrl);
}

function renderProductDetail() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  const product = PRODUCTS.find(p => p.id === id);

  if (!product) {
    document.querySelector(".product-detail").innerHTML =
      '<p style="padding:40px;text-align:center;color:#766a62;">Produkten hittades inte.</p>';
    return;
  }

  setProductPageMeta(product);

  const el = document.querySelector(".product-detail");
  el.innerHTML = `
    <div class="product-detail-grid">
      <div class="product-detail-img">
        ${product.originalPrice ? `<span class="price-badge price-badge--detail" aria-label="Rabatt">Rabatt</span>` : ""}
        <img src="${product.image}" alt="${product.name}" loading="eager">
      </div>
      <div class="product-detail-info">
        <h1>${product.name}</h1>
        <div class="reviews-summary">
          <span class="product-stars" aria-hidden="true">★★★★★</span>
          <span>${product.reviews.toLocaleString("sv-SE")} omdömen</span>
        </div>
        <div class="price-row">
          ${product.price.toLocaleString("sv-SE")} kr${product.originalPrice ? `<span class="original">${product.originalPrice.toLocaleString("sv-SE")} kr</span>` : ""}
        </div>
        <ul class="product-sell-points" aria-label="Varför kunder handlar hos oss">
          <li>Fri frakt när du handlar för ${FREE_SHIPPING_THRESHOLD.toLocaleString("sv-SE")} kr eller mer</li>
          <li>CBD/CBG och noggrant utvalda ingredienser – utvecklat för nordisk hud</li>
          <li>14 dagars öppet köp – trygg handel med personlig rådgivning</li>
        </ul>
        ${product.sizes ? `
          <div class="size-select">
            <label>Storlek</label>
            <select>${product.sizes.map(s => `<option>${s}</option>`).join("")}</select>
          </div>
        ` : ""}
        <button type="button" class="btn btn-primary btn-add-cart" onclick="addToCart('${product.id}')">Lägg i varukorg</button>

        <div class="description" style="margin-top:32px;">
          ${product.description}
        </div>

        <div class="product-meta">
          ${product.ingredients ? `
            <details>
              <summary>Ingredienser</summary>
              <div class="meta-content">${product.ingredients}</div>
            </details>
          ` : ""}
          ${product.size ? `
            <details>
              <summary>Förpackning</summary>
              <div class="meta-content">${product.size}</div>
            </details>
          ` : ""}
          ${product.guarantee ? `
            <details>
              <summary>Köpvillkor</summary>
              <div class="meta-content">${product.guarantee}</div>
            </details>
          ` : ""}
        </div>
      </div>
    </div>
    <section class="related-products-wrap section reveal" aria-labelledby="related-heading">
      <h2 id="related-heading" class="section-title">Du kanske också gillar</h2>
      <p class="section-lede section-lede--related">Utvalt utifrån kategori och vad kunder ofta kombinerar i samma rutin.</p>
      <div class="products-grid" id="related-products"></div>
    </section>
  `;

  renderProductsGrid("related-products", getRelatedProductIds(product.id, 3));
  renderReviewsSection(product);
}

// ---- REVIEWS MOCKUP ----

const REVIEW_MOCKUPS = [
  { name: "Anna L.", date: "2026-03-10", stars: 5, text: "Huden har aldrig känts bättre. Jag märkte skillnad redan efter en vecka. Lugn, återfuktad och full av lyster." },
  { name: "Erik S.", date: "2026-02-28", stars: 5, text: "Skeptisk till CBD i hudvård först, men det här var något helt annat. Minimala ingredienser, maximal effekt." },
  { name: "Maria K.", date: "2026-02-15", stars: 5, text: "Min rosacea har blivit så mycket bättre. För första gången på flera år känner jag mig bekväm utan makeup." },
  { name: "Johan B.", date: "2026-01-22", stars: 4, text: "Riktigt bra olja. Tar tid att vänjas vid, men resultatet talar för sig självt. Huden är mjukare och friskare." },
  { name: "Sofia H.", date: "2026-01-10", stars: 5, text: "Jag har provat allt. Dyra märken, billiga märken. Inget har gett min hud den här känslan av balans." },
  { name: "Oscar M.", date: "2025-12-18", stars: 5, text: "Enkel rutin, tydliga resultat. Jag behöver ingenting annat. Min hud tackar mig varje morgon." },
  { name: "Linnea R.", date: "2025-12-05", stars: 5, text: "Beställde först till mig själv, sedan till mamma, sedan till min syster. Alla är lika imponerade." },
  { name: "Karl-Johan A.", date: "2025-11-20", stars: 4, text: "Bra produkter och fantastisk kundservice. Christopher svarade personligen på mina frågor. Det känns äkta." },
  { name: "Emma W.", date: "2025-11-08", stars: 5, text: "TA-DA Serum är magiskt. Min torra vinterhud är förfluten. Fukt som faktiskt stannar kvar." },
  { name: "Alexander P.", date: "2025-10-15", stars: 5, text: "Som man var jag osäker på ansiktsolja. Nu är det det enda jag använder. Enkel, effektiv, ingen konstig doft." }
];

function renderReviewsSection(product) {
  const container = document.getElementById("reviews-section");
  if (!container) return;

  const totalReviews = product.reviews || 936;
  const avgRating = 4.9;
  const starsStr = "★".repeat(5);

  container.innerHTML = `
    <div class="reviews-summary-bar">
      <span class="reviews-score">${avgRating}</span>
      <span class="reviews-stars">${starsStr}</span>
      <span class="reviews-count-label">${totalReviews.toLocaleString("sv-SE")} omdömen</span>
    </div>
    <div class="reviews-carousel-wrap">
      <button type="button" class="reviews-scroll-btn reviews-scroll-btn--prev" aria-label="Föregående omdömen">
        <svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg>
      </button>
      <div class="reviews-carousel" id="reviews-carousel">
        ${REVIEW_MOCKUPS.map(r => `
          <div class="review-card">
            <div class="review-card-stars">${"★".repeat(r.stars)}${"☆".repeat(5 - r.stars)}</div>
            <p class="review-card-text">"${r.text}"</p>
            <div class="review-card-author">${r.name} · ${r.date}</div>
          </div>
        `).join("")}
      </div>
      <button type="button" class="reviews-scroll-btn reviews-scroll-btn--next" aria-label="Nästa omdömen">
        <svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
      </button>
    </div>
  `;

  const carousel = document.getElementById("reviews-carousel");
  const prev = container.querySelector(".reviews-scroll-btn--prev");
  const next = container.querySelector(".reviews-scroll-btn--next");
  if (carousel && prev && next) {
    prev.addEventListener("click", () => carousel.scrollBy({ left: -320, behavior: "smooth" }));
    next.addEventListener("click", () => carousel.scrollBy({ left: 320, behavior: "smooth" }));
  }
}

// ---- INIT ----

document.addEventListener("DOMContentLoaded", () => {
  updateCartUI();
});
