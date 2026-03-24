// 1753 SKINCARE – Holistisk Hudanalys med OpenAI Vision

const ANALYSIS_SYSTEM_PROMPT = `Du är en holistisk hudvårdsrådgivare för 1753 SKINCARE, ett svenskt hudvårdsmärke som specialiserar sig på CBD- och CBG-baserade produkter. Du analyserar foton av ansikten och ger personliga rekommendationer.

DIN FILOSOFI:
- Du ser huden som ett intelligent organ format av 1,9 miljoner år av evolution
- Du fokuserar på hudens endocannabinoidsystem (ECS) som nyckel till hudhälsa
- Du tror på att stödja hudens EGNA funktioner istället för att ersätta dem med kemikalier
- Du är försiktigt skeptisk till konventionell hudvård (syror, retinol, starka kemikalier) som ofta stör hudens naturliga balans
- Du föredrar en holistisk syn där livsstil, kost, sömn, stress och natur spelar lika stor roll som produkter
- Du rekommenderar ALDRIG fler produkter än nödvändigt – enkelhet är nyckeln

NÄR DU ANALYSERAR ETT FOTO:
1. Observera synliga hudtillstånd (torrhet, rodnad, ojämn hudton, akne, rosacea, fina linjer, etc.)
2. Bedöm hudens generella balans och lyster
3. Gör försiktiga antaganden om livsstilsfaktorer som kan påverka huden

DINA REKOMMENDATIONER SKA INNEHÅLLA:
1. **Hudanalys** – Kort, ärlig bedömning av vad du ser. Var empatisk men ärlig.
2. **Livsstilsrekommendationer** – Holistiska tips kring:
   - Sömn och återhämtning
   - Kost (antiinflammatorisk, omega-3, fermenterade livsmedel)
   - Stresshantering och nervssystemreglering
   - Rörelse och tid utomhus
   - Vattenintag
   - Tarmhälsa (kopplingen mellan tarmen och huden)
3. **Produktrekommendationer** – Rekommendera SPECIFIKA produkter från 1753 SKINCARE:

TILLGÄNGLIGA PRODUKTER:
- "The ONE Facial Oil" (649 kr) – Daglig ansiktsolja med 10% CBD, 0.2% CBG. För skydd och återfuktning.
- "I LOVE Facial Oil" (849 kr) – Nattolja med 5% CBG, 10% CBD. För reparation och djup återfuktning.
- "TA-DA Serum" (699 kr) – CBG-serum (3%). Boostar fukt och elasticitet.
- "Au Naturel Makeup Remover" (399 kr) – Rengöringsolja med MCT + CBD. Skonsam rengöring.
- "Fungtastic Mushroom Extract" (399 kr) – Chaga, Lion's Mane, Cordyceps, Reishi. Stödjer huden inifrån.
- "DUO-kit" (1 099 kr) – The ONE + I LOVE tillsammans.
- "DUO-kit + TA-DA Serum" (1 495 kr) – Komplett rutin.

4. **Vad du bör UNDVIKA** – Nämn vanliga misstag i modern hudvård/livsstil som kan förvärra situationen.

FORMAT:
Svara på svenska. Använd ALDRIG emojis. Strukturera med tydliga rubriker.
Var personlig och varm i tonen – som att en kunnig vän ger råd. Inte kliniskt.
Håll dig under 600 ord. Kvalitet framför kvantitet.

VIKTIGT:
- Ge ALDRIG medicinsk diagnos
- Rekommendera att kontakta dermatolog vid allvarliga tillstånd
- Var ärlig men uppmuntrande
- Rekommendera max 2-3 produkter, inte hela sortimentet`;

let uploadedImageBase64 = null;
let analysisFactInterval = null;

const ANALYSIS_API_URL = "http://localhost:3001/api/analysis";
const ANALYSIS_HISTORY_KEY = "analysis_history_1753";

const SKIN_FACTS = [
  "Huden förnyar övre lagret ungefär var 28:e dag.",
  "Endocannabinoidsystemet finns också i huden och påverkar balans och barriär.",
  "Sömn och stress påverkar cortisol – vilket syns i huden.",
  "Vatten och mat med omega-3 stödjer en lugnare inflammationsprofil.",
  "Tarm och hud delar immunologiska signaler – därför är helheten viktig.",
  "Varsam rengöring bevarar hudens mikrobiom bättre än aggressiva rutiner."
];

function clearAnalysisFactRotation() {
  if (analysisFactInterval) {
    clearInterval(analysisFactInterval);
    analysisFactInterval = null;
  }
}

function saveAnalysisHistory(fullText) {
  try {
    const excerpt = fullText.replace(/\s+/g, " ").trim().slice(0, 280);
    const entry = { at: new Date().toISOString(), excerpt };
    const raw = localStorage.getItem(ANALYSIS_HISTORY_KEY);
    const list = raw ? JSON.parse(raw) : [];
    list.unshift(entry);
    localStorage.setItem(ANALYSIS_HISTORY_KEY, JSON.stringify(list.slice(0, 12)));
  } catch (_) {
    /* ignore */
  }
}

// ---- UPLOAD ----

function setupUploadZone() {
  const zone = document.getElementById("upload-zone");
  const input = document.getElementById("photo-input");
  if (!zone || !input) return;

  zone.addEventListener("click", (e) => {
    if (e.target.tagName !== "BUTTON") input.click();
  });

  zone.addEventListener("dragover", (e) => {
    e.preventDefault();
    zone.classList.add("drag-over");
  });

  zone.addEventListener("dragleave", () => {
    zone.classList.remove("drag-over");
  });

  zone.addEventListener("drop", (e) => {
    e.preventDefault();
    zone.classList.remove("drag-over");
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      handleFile(file);
    }
  });

  input.addEventListener("change", () => {
    if (input.files[0]) handleFile(input.files[0]);
  });
}

function handleFile(file) {
  const reader = new FileReader();
  reader.onload = (e) => {
    uploadedImageBase64 = e.target.result;
    const preview = document.getElementById("upload-preview");
    const previewImg = document.getElementById("preview-img");
    const uploadZone = document.getElementById("upload-zone");

    previewImg.src = uploadedImageBase64;
    uploadZone.style.display = "none";
    preview.style.display = "block";
  };
  reader.readAsDataURL(file);
}

function resetUpload() {
  uploadedImageBase64 = null;
  clearAnalysisFactRotation();
  const preview = document.getElementById("upload-preview");
  const uploadZone = document.getElementById("upload-zone");
  const loading = document.getElementById("analysis-loading");
  const results = document.getElementById("analysis-results");
  const input = document.getElementById("photo-input");
  const factEl = document.getElementById("loading-fact");
  if (factEl) factEl.textContent = "";

  if (preview) preview.style.display = "none";
  if (uploadZone) uploadZone.style.display = "";
  if (loading) loading.style.display = "none";
  if (results) results.style.display = "none";
  if (input) input.value = "";
}

// ---- ANALYSIS ----

async function startAnalysis() {
  if (!uploadedImageBase64) {
    showNotification("Ladda upp ett foto först");
    return;
  }

  const upload = document.getElementById("analysis-upload");
  const loading = document.getElementById("analysis-loading");
  const results = document.getElementById("analysis-results");

  upload.style.display = "none";
  loading.style.display = "flex";
  results.style.display = "none";

  const factEl = document.getElementById("loading-fact");
  clearAnalysisFactRotation();
  if (factEl) {
    let fi = 0;
    factEl.textContent = SKIN_FACTS[0];
    analysisFactInterval = setInterval(() => {
      fi = (fi + 1) % SKIN_FACTS.length;
      factEl.textContent = SKIN_FACTS[fi];
    }, 3200);
  }

  try {
    const response = await fetch(ANALYSIS_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        imageBase64: uploadedImageBase64,
        systemPrompt: ANALYSIS_SYSTEM_PROMPT,
        prompt: "Analysera min hud baserat på detta foto. Ge mig personliga rekommendationer kring hudvård och livsstil enligt din holistiska filosofi."
      })
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || `API-fel: ${response.status}`);
    }

    const data = await response.json();
    clearAnalysisFactRotation();
    displayResults(data.content);

  } catch (error) {
    clearAnalysisFactRotation();
    loading.style.display = "none";
    upload.style.display = "";
    showNotification("Fel: " + error.message);
  }
}

function displayResults(text) {
  const loading = document.getElementById("analysis-loading");
  const results = document.getElementById("analysis-results");
  const content = document.getElementById("results-content");

  loading.style.display = "none";
  results.style.display = "block";

  saveAnalysisHistory(text);

  const html = formatAnalysisText(text);
  content.innerHTML = html;

  recommendProducts(text);

  results.scrollIntoView({ behavior: "smooth", block: "start" });
}

function formatAnalysisText(text) {
  let html = text
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="analysis-heading">$1</h2>')
    .replace(/^# (.+)$/gm, '<h2 class="analysis-heading">$1</h2>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br>');

  html = html.replace(/(<li>.*?<\/li>)/gs, (match) => {
    if (!match.startsWith('<ul>')) {
      return '<ul>' + match + '</ul>';
    }
    return match;
  });

  html = '<div class="analysis-text"><p>' + html + '</p></div>';

  return html;
}

function recommendProducts(analysisText) {
  const container = document.getElementById("recommended-products");
  if (!container) return;

  const lower = analysisText.toLowerCase();
  const recommended = [];

  if (lower.includes("the one") || lower.includes("daglig") || lower.includes("morgon")) {
    recommended.push("the-one-facial-oil");
  }
  if (lower.includes("i love") || lower.includes("natt") || lower.includes("kväll") || lower.includes("reparera")) {
    recommended.push("i-love-facial-oil");
  }
  if (lower.includes("ta-da") || lower.includes("serum") || lower.includes("fukt")) {
    recommended.push("ta-da-serum");
  }
  if (lower.includes("rengör") || lower.includes("makeup") || lower.includes("au naturel")) {
    recommended.push("au-naturel-makeup-remover");
  }
  if (lower.includes("fungtastic") || lower.includes("svamp") || lower.includes("inifrån") || lower.includes("tarm")) {
    recommended.push("fungtastic-mushroom-extract");
  }
  if (lower.includes("duo-kit") || lower.includes("duo kit") || lower.includes("komplett rutin")) {
    recommended.push("duo-ta-da");
  }

  if (recommended.length === 0) {
    recommended.push("the-one-facial-oil", "ta-da-serum");
  }

  const unique = [...new Set(recommended)].slice(0, 3);

  container.innerHTML = unique.map(id => {
    const p = PRODUCTS.find(pr => pr.id === id);
    if (!p) return "";
    return `
      <a class="product-card" href="product.html?id=${p.id}">
        <div class="product-card-img">
          <img src="${p.image}" alt="${p.name}" loading="lazy">
        </div>
        <h3>${p.name}</h3>
        <div class="price">${p.price.toLocaleString("sv-SE")} kr</div>
      </a>
    `;
  }).join("");
}

// ---- INIT ----

document.addEventListener("DOMContentLoaded", () => {
  setupUploadZone();
});
