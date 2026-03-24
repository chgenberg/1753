const PRODUCTS = [
  {
    id: "duo-ta-da",
    category: "kit",
    name: "DUO-kit + TA-DA Serum",
    price: 1495,
    originalPrice: 1798,
    reviews: 173,
    image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600&h=600&fit=crop&crop=center",
    shopifyImage: "https://www.1753skincare.com/cdn/shop/files/IMG_1034.jpg?width=600",
    shortDesc: "En komplett rutin för hud i balans. Innehåller The ONE Facial Oil, I LOVE Facial Oil och TA-DA Serum.",
    description: `<p>Det här är en hudvårdsrutin skapad för att stärka huden på djupet – inte tillfälligt förbättra ytan. DUO-kitet tillsammans med TA-DA Serum ger huden exakt det den behöver för att fungera bättre på egen hand.</p>
<p>Tre produkter. Ett tydligt syfte. Lugnare hud, bättre motståndskraft och långsiktig hudhälsa.</p>
<h3>Vad som gör rutinen unik</h3>
<p>Produkterna är utvecklade för att samverka och stödja hudens egna system – särskilt endocannabinoidsystemet och den mikrobiella mångfalden. Två avgörande faktorer för hudens förmåga att återhämta sig, skydda sig och behålla balans över tid.</p>
<h3>Produkterna i rutinen</h3>
<ul>
<li><strong>The ONE Facial Oil</strong> – En skyddande och näringsrik olja för daglig användning.</li>
<li><strong>I LOVE Facial Oil</strong> – En lugnande nattolja som hjälper huden att återhämta sig.</li>
<li><strong>TA-DA Serum</strong> – Ett unikt CBG-berikat serum som appliceras efter oljan.</li>
</ul>
<h3>Så använder du rutinen</h3>
<p><strong>Morgon:</strong> Skölj ansiktet med ljummet vatten. Applicera 3–4 droppar The ONE Facial Oil. Avsluta med 1–2 pump TA-DA Serum.</p>
<p><strong>Kväll:</strong> Rengör huden varsamt. Applicera 3–4 droppar I LOVE Facial Oil. Avsluta med 1–2 pump TA-DA Serum.</p>`,
    ingredients: null,
    size: null,
    guarantee: "100% nöjd-kund-garanti. Prova produkterna i 14 dagar. Är du inte nöjd får du pengarna tillbaka (du betalar endast returfrakten)."
  },
  {
    id: "ta-da-serum",
    category: "serum",
    name: "TA-DA Serum",
    price: 699,
    originalPrice: null,
    reviews: 20,
    image: "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=600&h=600&fit=crop&crop=center",
    shopifyImage: "https://www.1753skincare.com/cdn/shop/files/1-Ta-Daserummforpackning.png?width=600",
    shortDesc: "CBG-berikat serum som boostar hudens naturliga fukt och låser in den för en strålande och frisk hy.",
    description: `<p>Torr hud är ett vanligt problem, särskilt i kallare klimat, men det behöver inte vara så. TA-DA Serum är speciellt framtaget för att boosta din huds naturliga fukt och låsa in den, så att du får en strålande och frisk hy.</p>
<h3>Kraften i CBG</h3>
<p>I hjärtat av TA-DA Serum finns CBG (Cannabigerol), en kraftfull ingrediens från cannabisplantan. CBG samarbetar med hudens endocannabinoidsystem för att förbättra fuktbevaring och minska fuktförlust.</p>
<h3>Fördelar</h3>
<ul>
<li>Minskad risk för inflammation</li>
<li>Djupt återfuktad hud</li>
<li>Förbättrad elasticitet och fasthet</li>
</ul>`,
    ingredients: "Simmondsia chinensis (Jojoba) Seed Oil (ekologisk), Cannabigerol (CBG, 3% / 1500 mg)",
    size: "Glasflaska med pump – 50 ml",
    guarantee: "100% nöjd-kund-garanti. Testa produkten i 14 dagar – om du inte är helt nöjd kan du returnera den för full återbetalning (minus frakt)."
  },
  {
    id: "duo-kit",
    category: "kit",
    name: "DUO-kit (The ONE + I LOVE Facial Oil)",
    price: 1099,
    originalPrice: null,
    reviews: 136,
    image: "https://images.unsplash.com/photo-1570194065650-d99fb4b38b17?w=600&h=600&fit=crop&crop=center",
    shopifyImage: "https://www.1753skincare.com/cdn/shop/files/2-facialoilduomedforpackning.png?width=600",
    shortDesc: "Två ansiktsoljor i ett kit. The ONE för morgonen, I LOVE för kvällen. Enkel och effektiv rutin för alla hudtyper.",
    description: `<p>Ge din hud det bästa av två världar med vårt DUO-kit! Detta kit innehåller våra fantastiska ansiktsoljor – The ONE Facial Oil och I LOVE Facial Oil – till ett mycket förmånligt pris.</p>
<h3>Varför DUO-kitet?</h3>
<p>Med detta kit får du en komplett hudvårdsrutin som är enkel och effektiv. The ONE Facial Oil används på morgonen för att skydda och återfukta, medan I LOVE Facial Oil appliceras på kvällen för att reparera och lugna.</p>
<h3>Så använder du DUO-kitet</h3>
<p><strong>Morgon:</strong> Applicera The ONE Facial Oil på ren hud för att starta dagen med återfuktning och skydd.</p>
<p><strong>Kväll:</strong> Applicera I LOVE Facial Oil på ren hud för att låta huden återhämta sig över natten.</p>`,
    ingredients: null,
    size: "2 x 10 ml glasflaskor med pipett",
    guarantee: "100% nöjd-kund-garanti. Prova produkterna i 14 dagar, och om du inte är helt nöjd, skicka tillbaka dem – du står bara för returfrakten."
  },
  {
    id: "i-love-facial-oil",
    category: "oil",
    name: "I LOVE Facial Oil",
    price: 849,
    originalPrice: null,
    reviews: 101,
    image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=600&h=600&fit=crop&crop=center",
    shopifyImage: "https://www.1753skincare.com/cdn/shop/files/3-Facialoilmforpackning.png?width=600",
    shortDesc: "Kraftfull ansiktsolja med 5% CBG och 10% CBD. Stödjer endocannabinoidsystemet för en balanserad, återfuktad hy.",
    description: `<p>Drömmer du om en hud som strålar av hälsa och självförtroende? I LOVE Facial Oil är här för att förvandla din hudvårdsrutin med en unik kombination av 5% CBG och 10% CBD.</p>
<h3>Vad kan du förvänta dig?</h3>
<ul>
<li>Mindre inflammationer – för en lugn och klar hud</li>
<li>Mer glow – för en strålande och frisk lyster</li>
<li>Djup återfuktning – för en mjuk och smidig känsla</li>
<li>Högre elasticitet och fasthet – för en spänstig och ungdomlig hy</li>
</ul>
<h3>Användartips</h3>
<p><strong>Morgon:</strong> Använd The ONE Facial Oil för att skydda och återfukta.</p>
<p><strong>Kväll:</strong> Applicera I LOVE Facial Oil för att reparera och lugna.</p>
<p>Tänk "The ONE I LOVE" för att enkelt komma ihåg ordningen.</p>`,
    ingredients: "Caprylic/Capric Triglyceride, Cannabidiol (10% / 1000 mg), Cannabigerol (5% / 500 mg)",
    size: "Glasflaska med pipett – 10 ml",
    sizes: ["10 ml"],
    guarantee: "100% nöjd-kund-garanti. Testa produkten i 14 dagar – om du inte är nöjd, skicka tillbaka den. Du står bara för returfrakten."
  },
  {
    id: "the-one-facial-oil",
    category: "oil",
    name: "The ONE Facial Oil",
    price: 649,
    originalPrice: null,
    reviews: 202,
    image: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=600&h=600&fit=crop&crop=center",
    shopifyImage: "https://www.1753skincare.com/cdn/shop/files/4-Theonefacialoil.png?width=600",
    shortDesc: "Ansiktsolja med 10% CBD och 0,2% CBG. Mindre inflammationer, mer glow, djup återfuktning och högre elasticitet.",
    description: `<p>Drömmer du om en hy med mer elasticitet, fasthet, glow och lyster? Då är The ONE Facial Oil precis vad du behöver – oavsett hudtyp.</p>
<h3>Vad kan du förvänta dig?</h3>
<ul>
<li>Mindre inflammationer – för en lugnare och klarare hud</li>
<li>Mer glow – för en strålande och hälsosam lyster</li>
<li>Mindre känslighet – för en starkare hudbarriär</li>
<li>Djup återfuktning – för en mjuk och smidig känsla</li>
<li>Högre elasticitet och fasthet – för en spänstig och ungdomlig hy</li>
</ul>
<h3>Användartips</h3>
<p>För fet eller normal hud: Applicera 3–4 droppar på ansikte och hals.</p>
<p>För torr hud: Applicera 4–10 droppar. Anpassa mängden efter vad din hud behöver.</p>`,
    ingredients: "Caprylic/Capric Triglyceride, Cannabidiol (10% / 1000 mg), Cannabigerol (0,2% / 20 mg)",
    size: "Glasflaska med pipett – 10 ml",
    sizes: ["10 ml"],
    guarantee: "100% nöjd-kund-garanti. Prova produkten i 14 dagar – är du inte helt nöjd kan du skicka tillbaka den. Du står endast för returfrakten."
  },
  {
    id: "au-naturel-makeup-remover",
    category: "cleanser",
    name: "Au Naturel Makeup Remover",
    price: 399,
    originalPrice: null,
    reviews: 83,
    image: "https://images.unsplash.com/photo-1556228841-a3c527ebefe5?w=600&h=600&fit=crop&crop=center",
    shopifyImage: "https://www.1753skincare.com/cdn/shop/files/6-Makeup-remover.png?width=600",
    shortDesc: "Rengöringsolja med MCT och CBD som varsamt avlägsnar smuts och makeup utan att skada hudens naturliga balans.",
    description: `<p>Vill du avlägsna smuts, luftföroreningar och makeup utan att skada din huds naturliga balans? Au Naturel Makeup Remover är lösningen du har letat efter.</p>
<h3>Fördelar</h3>
<ul>
<li>Enkel avlägsning av smuts, makeup och luftföroreningar</li>
<li>Djupt återfuktad hud som känns mjuk och smidig</li>
<li>Ökad elasticitet och fasthet</li>
<li>Skadar inte hudens mikrobiella mångfald eller endocannabinoidsystem</li>
</ul>
<h3>Hur använder du den?</h3>
<p>Applicera ett par droppar på ansiktet, massera in oljan och låt den lösa upp makeup och orenheter. Avlägsna sedan försiktigt med en varm, fuktig handduk eller bomullspad.</p>`,
    ingredients: "Caprylic/Capric Triglyceride (MCT), Cannabidiol (CBD, 0,2%)",
    size: "Glasflaska med pump – 100 ml",
    sizes: ["100 ml"],
    guarantee: "100% nöjd-kund-garanti. Prova produkten i 14 dagar – om du inte är helt nöjd kan du returnera den för full återbetalning (minus frakt)."
  },
  {
    id: "fungtastic-mushroom-extract",
    category: "supplement",
    name: "Fungtastic Mushroom Extract",
    price: 399,
    originalPrice: null,
    reviews: 63,
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&h=600&fit=crop&crop=center",
    shopifyImage: "https://www.1753skincare.com/cdn/shop/files/8-Fungtastic.png?width=600",
    shortDesc: "Svampextrakt med Chaga, Lion's Mane, Cordyceps och Reishi. Stödjer hälsan inifrån och hudens endocannabinoidsystem.",
    description: `<p>Fungtastic Mushroom Extract kombinerar fyra av naturens mest potenta medicinska svampar i en perfekt balans för att stödja ditt välbefinnande inifrån.</p>
<h3>Fyra svampar – fyra fantastiska fördelar</h3>
<ul>
<li><strong>Chaga (25%)</strong> – Stärker immunförsvaret med antioxidanter och Betulinic Acid</li>
<li><strong>Lion's Mane (25%)</strong> – Boostar fokus och minne</li>
<li><strong>Cordyceps (25%)</strong> – Ökar energi och prestation</li>
<li><strong>Reishi (25%)</strong> – Främjar lugn och sömn</li>
</ul>
<p>De flesta upplever positiva effekter efter 2–4 veckors användning, även om det kan ta upp till 6 veckor för optimalt resultat.</p>`,
    ingredients: "Chaga (25%), Lion's Mane (25%), Cordyceps (25%), Reishi (25%) – 400 mg per kapsel (15:1 extrakt). Betaglukaner: minst 20%.",
    size: "60 kapslar",
    sizes: ["60 kapslar"],
    guarantee: null
  },
  {
    id: "torr-hud-paketet",
    category: "paket",
    name: "TORR-HUD-paketet",
    price: 1999,
    originalPrice: 2995,
    reviews: 3,
    image: "https://images.unsplash.com/photo-1612817288484-6f916006741a?w=600&h=600&fit=crop&crop=center",
    shopifyImage: "https://www.1753skincare.com/cdn/shop/files/BlackWeek2025.png?width=600",
    shortDesc: "Komplett paket för torr hud. Innehåller Au Naturel Makeup Remover, DUO-kit, TA-DA Serum och 2x Fungtastic.",
    description: `<p>Torr hud kan kännas stram, irriterad och sakna lyster. Vi har skapat ett särskilt paket för torr hud, fyllt med produkter som ger intensiv återfuktning.</p>
<h3>Paketet innehåller</h3>
<ul>
<li>1 st Au Naturel Makeup Remover (värde 399 kr)</li>
<li>1 st DUO-kit med The ONE och I LOVE Facial Oil (värde 1 099 kr)</li>
<li>1 st TA-DA Serum (värde 699 kr)</li>
<li>2 st Fungtastic (värde 798 kr)</li>
</ul>
<p>Räcker i ca 3 månader – och du får dessutom ett mejl med livsstilsrekommendationer för att ytterligare förbättra dina resultat.</p>`,
    ingredients: null,
    size: null,
    guarantee: null
  },
  {
    id: "rosacea-paketet",
    category: "paket",
    name: "ROSACEA-paketet",
    price: 1999,
    originalPrice: 2995,
    reviews: 2,
    image: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=600&h=600&fit=crop&crop=center",
    shopifyImage: "https://www.1753skincare.com/cdn/shop/files/BlackWeek2025.png?width=600",
    shortDesc: "Skonsam vård för känslig och reaktiv hud. Innehåller Au Naturel Makeup Remover, DUO-kit, TA-DA Serum och 2x Fungtastic.",
    description: `<p>Rosacea kan vara en utmanande hudåkomma med rodnad, känslighet och ibland synliga blodkärl. Vi har skapat ett särskilt paket som hjälper dig att balansera och stärka huden.</p>
<h3>Paketet innehåller</h3>
<ul>
<li>1 st Au Naturel Makeup Remover (värde 399 kr)</li>
<li>1 st DUO-kit med The ONE och I LOVE Facial Oil (värde 1 099 kr)</li>
<li>1 st TA-DA Serum (värde 699 kr)</li>
<li>2 st Fungtastic (värde 798 kr)</li>
</ul>
<p>Räcker i ca 3 månader – och du får dessutom ett mejl med livsstilsrekommendationer för att ytterligare förbättra dina resultat.</p>`,
    ingredients: null,
    size: null,
    guarantee: null
  }
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

  itemsEl.innerHTML = cart.map(item => {
    const product = PRODUCTS.find(p => p.id === item.id);
    if (!product) return "";
    return `
      <div class="cart-item">
        <div class="cart-item-img" style="background-image: url('${product.image}'); background-size: cover; background-position: center;"></div>
        <div class="cart-item-details">
          <h4>${product.name}</h4>
          <div class="cart-item-price">${product.price} kr</div>
          <div class="cart-item-qty">
            <button onclick="updateQty('${product.id}', -1)">-</button>
            <span>${item.qty}</span>
            <button onclick="updateQty('${product.id}', 1)">+</button>
          </div>
          <button class="cart-item-remove" onclick="removeFromCart('${product.id}')">Ta bort</button>
        </div>
      </div>
    `;
  }).join("");

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
  const links = document.querySelector(".nav-links");
  if (links) links.classList.toggle("open");
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
    <a class="product-card reveal stagger-card" href="product.html?id=${p.id}" style="--stagger:${i}">
      <div class="product-card-img">
        <img src="${p.image}" alt="${p.name}" loading="lazy">
        ${p.originalPrice ? `<span class="price-badge" aria-label="Rabatt">Rabatt</span>` : ""}
        <div class="product-card-overlay"><span>Visa produkt</span></div>
      </div>
      <h3>${p.name}</h3>
      <div class="price">
        ${p.price.toLocaleString("sv-SE")} kr${p.originalPrice ? `<span class="original">${p.originalPrice.toLocaleString("sv-SE")} kr</span>` : ""}
      </div>
      <div class="reviews-count">${p.reviews} omdömen</div>
    </a>
  `).join("");

  if (typeof window.initStaggerCards === "function") {
    window.initStaggerCards(container);
  }
}

function initShopGrid(containerId) {
  const sortEl = document.getElementById("shop-sort");
  const catEl = document.getElementById("shop-filter");
  const refresh = () => {
    renderProductsGrid(containerId, null, {
      sort: sortEl ? sortEl.value : "reviews-desc",
      category: catEl ? catEl.value : "all"
    });
  };
  if (sortEl) sortEl.addEventListener("change", refresh);
  if (catEl) catEl.addEventListener("change", refresh);
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

function renderProductDetail() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  const product = PRODUCTS.find(p => p.id === id);

  if (!product) {
    document.querySelector(".product-detail").innerHTML =
      '<p style="padding:40px;text-align:center;color:#766a62;">Produkten hittades inte.</p>';
    return;
  }

  document.title = product.name + " – 1753 SKINCARE";

  const el = document.querySelector(".product-detail");
  el.innerHTML = `
    <div class="product-detail-grid">
      <div class="product-detail-img">
        ${product.originalPrice ? `<span class="price-badge price-badge--detail" aria-label="Rabatt">Rabatt</span>` : ""}
        <img src="${product.image}" alt="${product.name}" loading="eager">
      </div>
      <div class="product-detail-info">
        <h1>${product.name}</h1>
        <div class="reviews-summary">${product.reviews} omdömen</div>
        <div class="price-row">
          ${product.price.toLocaleString("sv-SE")} kr${product.originalPrice ? `<span class="original">${product.originalPrice.toLocaleString("sv-SE")} kr</span>` : ""}
        </div>
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
              <summary>Nöjd-kund-garanti</summary>
              <div class="meta-content">${product.guarantee}</div>
            </details>
          ` : ""}
        </div>
      </div>
    </div>
    <section class="related-products-wrap section reveal" aria-labelledby="related-heading">
      <h2 id="related-heading" class="section-title">Du kanske också gillar</h2>
      <div class="products-grid" id="related-products"></div>
    </section>
  `;

  renderProductsGrid("related-products", getRelatedProductIds(product.id, 3));
}

// ---- INIT ----

document.addEventListener("DOMContentLoaded", () => {
  updateCartUI();
});
