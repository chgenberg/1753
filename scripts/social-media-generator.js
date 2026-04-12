/**
 * Social Media Post Generator – 1753 SKINCARE
 *
 * Image generation: fal.ai Nano Banana Pro (superior label preservation)
 * Caption generation: Google Gemini
 * Content themes drawn from "Weed Your Skin" (e-book) and Valyu research.
 *
 * Usage:
 *   node scripts/social-media-generator.js [--type product|lifestyle|mood|education] [--product DUO]
 *
 * Env:  FAL_KEY (images), GEMINI_API_KEY (captions),
 *       VALYU_API_KEY (optional – enriches captions with research)
 */

const fs = require("fs");
const path = require("path");
const https = require("https");

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const FAL_KEY = process.env.FAL_KEY;
const GEMINI_IMAGE_MODEL = process.env.GEMINI_IMAGE_MODEL || "gemini-3-pro-image-preview";
const GEMINI_TEXT_MODEL = process.env.GEMINI_TEXT_MODEL || "gemini-2.5-flash";
const API_BASE = "https://generativelanguage.googleapis.com/v1beta";
const BASE_URL = process.env.BASE_URL || "https://api.1753skin.com";

const REF_DIR = path.join(__dirname, "..", "public", "Referensbilder");
const EBOOK_PATH = path.join(__dirname, "..", "data", "ebook-segments.json");

const PRODUCTS = {
  "TheONE":     { name: "The ONE Facial Oil",       ref: "TheONE.jpg",    woman: "TheONEWoman.jpg", desc: "CBD-ansiktsolja med fullspektrum cannabinoider", shape: "small amber glass dropper bottle with black dropper cap", label: '\"1753\" (large serif, square border) | \"SKINCARE\" (small caps) | \"The ONE\" (italic) | \"Facial Oil\" (bold) | \"CBD+CBG\" (pink band) | \"15 ml / 0.5 fl.oz\"' },
  "ILOVE":      { name: "I LOVE Facial Oil",        ref: "ILOVE.jpg",     woman: "ILOVEWoman.jpg", desc: "Ansiktsolja med CBD och CBG for djup naring", shape: "small amber glass dropper bottle with black dropper cap", label: '\"1753\" (large serif, square border) | \"SKINCARE\" (small caps) | \"I LOVE\" (italic) | \"Facial Oil\" (bold) | \"CBG+CBD\" (yellow/gold band) | \"15 ml / 0.5 fl.oz\"' },
  "TA-DA":      { name: "TA-DA Serum",              ref: "TA-DA.jpg",     woman: "TA-DAWoman.jpg", desc: "Aktivt serum med cannabinoider och hyaluronsyra", shape: "small amber glass dropper bottle with black dropper cap", label: '\"1753\" (large serif, square border) | \"SKINCARE\" (small caps) | \"TA-DA\" (italic) | \"Serum\" (bold) | \"CBD+CBG\" (teal/green band) | \"15 ml / 0.5 fl.oz\"' },
  "MR":         { name: "Au Naturel Makeup Remover", ref: "MR.jpg",        woman: "MRwoman.jpg", desc: "Mild CBD-rengorning i sprayflaska som respekterar hudens mikrobiom", shape: "amber glass spray bottle with black pump cap (NOT a dropper)", label: '\"1753\" (large serif, square border) | \"SKINCARE\" (small caps) | \"Au Naturel\" (italic) | \"Makeup Remover\" (bold) | \"MCT || CBD\" (beige/tan band) | \"100ml / 3.38 fl oz\"' },
  "Fungtastic": { name: "Fungtastic",               ref: "Fungtastic.jpg",woman: "Fungtasticwoman.jpg", desc: "Kosttillskott med medicinska svampar (Chaga, Reishi, Lions Mane, Cordyceps) – 60 kapslar i morkt glasburk", shape: "dark glass wide-mouth JAR with black screw cap (NOT a dropper bottle – this is a supplement jar with capsules inside)", label: '\"1753\" (large serif, square border) | \"LIFESTYLE\" (small caps, NOTE: not SKINCARE) | \"FUNGTASTIC\" (bold) | \"Chaga | Reishi | Lions Mane | Cordyceps\" | brown/copper band | \"60 KAPSLAR\"' },
  "DUO":        { name: "DUO-kit",                  ref: "DUO.jpg",       woman: "DUOwoman.jpg", desc: "The ONE Facial Oil + I LOVE Facial Oil – komplett duo", shape: "two small amber glass dropper bottles side by side", label: 'Two bottles side by side. Left: \"1753 SKINCARE\" | \"I LOVE\" | \"Facial Oil\" | yellow band. Right: \"1753 SKINCARE\" | \"The ONE\" | \"Facial Oil\" | pink band.' },
  "DUO+TA-DA":  { name: "DUO + TA-DA bundle",      ref: "DUO+TA-DA.jpg", woman: "DUO+TA-DAWoman.jpg", desc: "Komplett rutin med tre produkter: The ONE Facial Oil, I LOVE Facial Oil och TA-DA Serum", shape: "three small amber glass dropper bottles", label: 'Three bottles. \"1753 SKINCARE\" on each. \"I LOVE\" (yellow), \"The ONE\" (pink), \"TA-DA\" (teal). All say \"Facial Oil\" or \"Serum\".' },
};

const MOOD_IMAGES = ["Bild-1.jpg","Bild-2.jpg","Bild-3.jpg","Bild-4.jpg","Bild-5.jpg","Bild-6.jpg","Bild-7.jpg","Bild-8.jpg","1.jpg","2.jpg","3.jpg","4.jpg","5.jpg"];

// ---- CONTENT THEMES from "Weed Your Skin" ----

const EDUCATION_THEMES = [
  { topic: "Hudens mikrobiom", angle: "Din hud är hem till miljarder mikroorganismer. De flesta är dina vänner. Aggressiv rengöring slår ut de goda och ger patogenerna fritt spelrum. Less is more.", tags: ["mikrobiom", "hudbarriär", "balans"] },
  { topic: "Endocannabinoidsystemet", angle: "Visste du att din kropp har ett eget cannabinoidsystem? ECS reglerar inflammation, talgproduktion och cellmognad i huden. Våra CBD/CBG-produkter arbetar med detta system, inte mot det.", tags: ["ECS", "CBD", "inflammation"] },
  { topic: "Tarm-hud-axeln", angle: "Tarmen och huden pratar med varandra. Stress, dålig kost och antibiotika kan störa tarmfloran och synas direkt i huden. Helhet, inte snabbfix.", tags: ["tarmhälsa", "holistisk", "inflammation"] },
  { topic: "pH och syramanteln", angle: "Frisk hud har pH runt 4,5-5,5. Den svaga surheten skyddar mot patogener och håller mikrobiomets ekosystem i balans. Alkaliska tvålar saboterar detta.", tags: ["pH", "hudbarriär", "rengöring"] },
  { topic: "Sebum som superolja", angle: "Talg är inte fienden. Det är din huds egen skyddsolja, utvecklad under miljoner år av evolution. Att tvätta bort allt talg tvingar huden att överkompensera.", tags: ["sebum", "evolution", "balans"] },
  { topic: "Yellowstone-metaforen", angle: "När vargen återintroducerades i Yellowstone förändrades hela ekosystemet. Samma sak gäller huden – ta bort en nyckelaktör och hela balansen rubbas.", tags: ["ekosystem", "balans", "natur"] },
  { topic: "Sömn och hud", angle: "Skönhetssömn är inte en myt. Under sömnen reparerar huden sin barriär, kollagenproduktionen ökar och mikrobiomet återhämtar sig. Kronisk sömnbrist syns.", tags: ["sömn", "återhämtning", "kollagen"] },
  { topic: "Cannabimimetika", angle: "Du behöver inte cannabis för att stödja ditt ECS. Svartpeppar, kanel, Echinacea och broccoli innehåller ämnen som interagerar med samma receptorer.", tags: ["cannabimimetika", "kost", "ECS"] },
  { topic: "Stress och kortisol", angle: "Stress syns i huden. Kortisol bryter ner kollagen, ökar talgproduktionen och kan trigga allt från akne till eksem. Andning, natur och sömn är hudvård.", tags: ["stress", "kortisol", "holistisk"] },
  { topic: "Skogsbad (shinrin-yoku)", angle: "Japanska forskare har visat att tid i skogen sänker kortisol, stärker immunförsvaret och förbättrar sömn. Kalla det hudvård om du vill – det är det.", tags: ["shinrinyoku", "natur", "stress"] },
  { topic: "Hayflick-gränsen", angle: "Dina celler har ett begränsat antal delningar. Ändlös exfoliering och 'cellförnyelse' kan verka lockande men biologin sätter gränser. Respektera dem.", tags: ["åldrande", "cellförnyelse", "evidens"] },
  { topic: "Medicinala svampar", angle: "Reishi, Lion's Mane och Cordyceps har använts i tusentals år. Modern forskning undersöker deras immunmodulerande och adaptogena egenskaper.", tags: ["svampar", "adaptogener", "immunförsvar"] },
  { topic: "Kallduschar", angle: "Kall exponering ökar noradrenalin, kan dämpa inflammation och förbättrar cirkulation. Börja gradvis. Din hud kommer att tacka dig.", tags: ["kalldusch", "biohacking", "inflammation"] },
  { topic: "Varför CBD-hudvård ofta misslyckas", angle: "Marknaden är vilda västern. Många produkter har för låg halt, fel formulering eller byter ut CBD mot billig hampfröolja. Läs INCI. Kräv dokumenterade halter.", tags: ["CBD", "kvalitet", "transparens"] },
  { topic: "Andning och hud", angle: "Box breathing, 4-7-8 – enkla andningstekniker sänker stresshormoner på minuter. Gratis, inga biverkningar, och din hud märker skillnad.", tags: ["andning", "stress", "biohacking"] },
];

const LIFESTYLE_ANGLES = [
  "Morgonritual: kallt vatten, djup andning, solljus. Ingen produkt i världen ersätter att ge kroppen det den utvecklats för att behöva.",
  "Det enklaste du kan göra för din hud idag? Gå ut. Titta på träd. Andas. Forskning visar att 20 minuter i naturen sänker kortisolnivåerna mätbart.",
  "Vi lever i en tid där vi tvättar bort det naturliga och lägger tillbaka det syntetiska. Kanske är det dags att vända på ekvationen.",
  "Fermenterad mat, omega-3, bär, grönsaker. Det som är bra för tarmen är bra för huden. Inget serum kompenserar för en tarm i obalans.",
  "Skratt minskar kortisol. Inte lite, utan mätbart. Boka in en rolig middag med vänner. Din hud-dermatolog behöver inte veta.",
  "Din farmors hudvårdsrutin hade troligen två steg. Det fungerade för att hon också sov åtta timmar, åt riktig mat och inte scrollade telefonen klockan tre på natten.",
  "Det kallas inte 'skönhetssömn' av en slump. Under natten repareras din hudbarriär, kollagenet byggs upp och mikrobiomet återställs. Stäng av, sov.",
  "Stillhet är underskattat. Fem minuter av medveten andning förändrar din biokemi. Kortisol sjunker, blodflödet ökar, huden får vila.",
  "Evolution formade din hud för utomhuslivet. Sol, vind, kallt vatten, mikrober från jord. Vi har skapat en steril bubbla och undrar varför huden klagar.",
  "Bästa hudvårdsprodukten du aldrig köpt? En promenad i skogen. Forskning om shinrin-yoku visar att naturvistelse stärker immunförsvaret och sänker stress.",
];

const PRODUCT_LABEL_LOCK = `CRITICAL PRODUCT PRESERVATION RULES (HIGHEST PRIORITY):
- The product in the reference image has a specific shape and printed label. You MUST preserve BOTH exactly as they appear in the reference photo.
- DO NOT change the product shape, size, or type. A jar must remain a jar. A spray bottle must remain a spray bottle. A dropper bottle must remain a dropper bottle.
- DO NOT invent, guess, or hallucinate any text on the label.
- DO NOT add ANY other text anywhere in the image – no watermarks, no titles, no captions.
- The product proportions and label design must match the reference EXACTLY.
- If you cannot render the text perfectly, angle the product slightly so the label is partially hidden rather than showing wrong text.`;

function getProductLabelLock(productKey) {
  const product = PRODUCTS[productKey];
  let extra = "";
  if (product?.shape) extra += `\nPRODUCT SHAPE (CRITICAL – do NOT change): ${product.shape}`;
  if (product?.label) extra += `\nEXACT LABEL TEXT (reproduce if visible): ${product.label}`;
  return `${PRODUCT_LABEL_LOCK}${extra}`;
}

const PRODUCT_PROMPT_TEMPLATES = [
  `${PRODUCT_LABEL_LOCK}\n\nPlace the EXACT product from the reference image into this scene: Minimalist bathroom combining light oak wood and soft stone. Wooden countertop with natural grain. Soft beige wall in background. Lighting: Warm natural light, late afternoon tone. Composition: Product placed on wooden surface next to a folded linen towel. Style: Natural, grounded, Scandinavian-Japanese (Japandi) aesthetic. Maintain realistic shadows and reflections. No text anywhere in the image. Aspect ratio: square 1:1.`,
  `${PRODUCT_LABEL_LOCK}\n\nPlace the EXACT product from the reference image into this scene: Minimalist Nordic bathroom shelf. Clean white marble surface. Single green plant (eucalyptus sprig) beside product. Soft morning light from left side. Steam or mist very subtly in background. Premium editorial skincare campaign feel. Hyper-realistic, cinematic composition. No text anywhere. Square format.`,
  `${PRODUCT_LABEL_LOCK}\n\nPlace the EXACT product from the reference image into this scene: Product resting on a smooth river stone beside a small pool of still water. Surrounded by soft moss and fern leaves. Natural forest floor setting. Lighting: Dappled sunlight through canopy above. Warm golden tone. Style: Nature meets luxury skincare. Scandinavian organic aesthetic. Sharp product focus, softly blurred natural background. No text anywhere. Square.`,
  `${PRODUCT_LABEL_LOCK}\n\nPlace the EXACT product from the reference image into this scene: Clean concrete shelf in a high-end spa. Soft white towels rolled nearby. Single dried flower stem in a ceramic vase. Background: frosted glass with soft diffused light. Style: Luxury minimalism. Premium spa campaign. Neutral palette: white, beige, soft grey. Warm but clean lighting. No text anywhere. 1:1 aspect ratio.`,
  `${PRODUCT_LABEL_LOCK}\n\nPlace the EXACT product from the reference image into this scene: Outdoor morning table setting. Weathered wooden table with a linen runner. A ceramic cup of herbal tea beside the product. Fresh rosemary sprigs scattered naturally. Background: soft-focus garden with morning dew. Lighting: Early golden hour, warm and honest. Style: Organic Nordic breakfast editorial. No text anywhere. Calm, grounded, authentic.`,
  `${PRODUCT_LABEL_LOCK}\n\nPlace the EXACT product from the reference image into this scene: Minimalist floating shelf against raw plaster wall. Product centered on shelf. A single candle (unlit) beside it. Small ceramic dish with dried botanicals below. Lighting: Soft directional light from window, gentle shadows. Style: Wabi-sabi meets Scandinavian. Imperfect textures, perfect simplicity. No text anywhere. Premium but approachable.`,
];

const LIFESTYLE_PROMPT_TEMPLATES = [
  `Use the provided image as the exact reference for the woman. STRICT: Keep the same woman, same face, same skin texture, same natural appearance. Do not change identity, facial features, proportions, or skin tone. No beautification, no retouching, no artificial smoothing. Scene: A sunlit Mediterranean-style courtyard with natural materials. She is sitting relaxed with a peaceful expression. Styling: Oversized linen shirt, loose linen trousers, tonal beige, barefoot. Environment: Warm natural stone, olive trees, terracotta pots with herbs. Lighting: Golden hour. Style: Editorial lifestyle photography. Mood: Contemplative, grounded, calm, timeless. No text, no logos, no products visible.`,
  `Use the provided image as the exact reference for the woman. STRICT: Keep same person, same face, same skin. Scene: She is standing by a large open window in a minimalist Scandinavian apartment. Morning light streaming in. She holds a white ceramic cup with both hands, looking out the window with a gentle smile. Wearing a soft cashmere sweater in oatmeal tone. Hair natural and effortless. Environment: Clean lines, light wood floor, single plant. Style: Scandinavian hygge lifestyle. Warm, intimate, editorial. No text, no logos, no products visible.`,
  `Use the provided image as the exact reference for the woman. STRICT: Preserve identity exactly. Scene: Outdoor setting, she is walking barefoot on a wooden boardwalk near the sea. Wind gently blowing her hair. Wearing flowing white linen dress. Expression: serene, confident. Background: Nordic coastline, grey-blue sea, cloudy sky with breaks of warm light. Style: Scandinavian coastal lifestyle. Calm and powerful. No text, no logos, no products visible.`,
  `Use the provided image as the exact reference for the woman. STRICT: Same woman, same face, zero changes to identity. Scene: She is in a bright modern kitchen, preparing a smoothie bowl with berries and seeds. Relaxed morning energy. Wearing soft knit top in sage green. Natural hair. Kitchen: white, wood details, green herbs on windowsill. Lighting: Bright, clean Nordic morning light. Style: Healthy lifestyle editorial. Warm, authentic, unpretentious. No text, no logos.`,
  `Use the provided image as the exact reference for the woman. STRICT: Preserve identity exactly. Scene: Forest path, she is walking among tall pine trees. Dappled light through canopy. Wearing earth-tone linen layers. Expression: peaceful, present. Atmosphere: Slight mist, deep green tones, wildflowers along path. Style: Nordic nature editorial. Shinrin-yoku feeling. Grounded, alive, connected to nature. No products, no text.`,
];

const MOOD_PROMPT_TEMPLATES = [
  `Create a still life: Raw honey in a ceramic bowl, fresh herbs, a slice of lemon, and a small wooden spoon on a textured linen cloth. Warm natural light from the side. Scandinavian food photography style. Earthy, honest, grounded. Color palette: warm sand, honey gold, sage green. No products, no text, no logos. Square format.`,
  `Create: An aerial view of a calm Nordic forest lake at golden hour. Still water reflecting pine trees. A single wooden dock extending into the water. Mist rising gently from the surface. Feeling: serenity, nature, purity. Style: landscape photography, cinematic. No people, no products, no text. 1:1 format.`,
  `Create: Close-up of hands cupping clear water from a forest stream. Soft natural light. Focus on the water droplets and skin texture. Background softly blurred with green foliage. Feeling: purity, simplicity, connection to nature. Style: intimate macro photography. No products, no text, no logos.`,
  `Create: A flat lay of natural ingredients on a marble surface – fresh turmeric root, dried chamomile flowers, a sprig of lavender, raw cacao beans, and hemp seeds. Arranged with breathing space between items. Overhead lighting, soft shadows. Style: clean editorial ingredient photography. Warm neutral palette. No branding, no text.`,
  `Create: Morning light streaming through a linen curtain into a minimalist bedroom. Focus on the interplay of light and shadow on white bedsheets. A single ceramic mug on the bedside table. Feeling: rest, stillness, renewal. Style: architectural interior photography. Soft, warm, quiet. No people, no products, no text.`,
  `Create: Macro shot of morning dew on a green leaf. Extreme close-up showing individual water droplets. Soft bokeh background with forest tones. Feeling: freshness, microscopic beauty, nature's precision. Style: nature macro photography. Vivid but calm. No text.`,
  `Create: A minimalist wooden tray with a ceramic teapot, a single cup of green tea, and a small bowl of dried adaptogenic mushrooms (reishi/lion's mane slices). Warm wooden surface. Side lighting creating long shadows. Style: Japanese-Scandinavian fusion still life. Wabi-sabi. No branding.`,
];

function readImageAsBase64(filename) {
  const filePath = path.join(REF_DIR, filename);
  if (!fs.existsSync(filePath)) return null;
  return fs.readFileSync(filePath).toString("base64");
}

function getMimeType(filename) {
  const ext = path.extname(filename).toLowerCase();
  if (ext === ".png") return "image/png";
  if (ext === ".webp") return "image/webp";
  return "image/jpeg";
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function loadEbookSegments() {
  try {
    if (fs.existsSync(EBOOK_PATH)) return JSON.parse(fs.readFileSync(EBOOK_PATH, "utf-8"));
  } catch {}
  return [];
}

async function searchValyu(query) {
  try {
    const Valyu = require("valyu-js");
    const apiKey = process.env.VALYU_API_KEY;
    if (!apiKey) return null;
    const client = new Valyu({ apiKey });
    const results = await client.search({ query, searchType: "all", maxNumResults: 3 });
    if (results?.results?.length) {
      return results.results.map(r => `${r.title || ""}: ${(r.content || "").slice(0, 200)}`).join("\n");
    }
  } catch {}
  return null;
}

async function geminiRequest(body, model) {
  const url = `${API_BASE}/models/${model || GEMINI_TEXT_MODEL}:generateContent?key=${GEMINI_API_KEY}`;
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const req = https.request(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Content-Length": Buffer.byteLength(data) },
    }, (res) => {
      let chunks = [];
      res.on("data", (c) => chunks.push(c));
      res.on("end", () => {
        const raw = Buffer.concat(chunks).toString();
        try { resolve(JSON.parse(raw)); } catch { reject(new Error(raw.slice(0, 500))); }
      });
    });
    req.on("error", reject);
    req.write(data);
    req.end();
  });
}

async function falUploadRef(filename) {
  const filePath = path.join(REF_DIR, filename);
  if (!fs.existsSync(filePath)) return null;
  const { fal } = await import("@fal-ai/client");
  fal.config({ credentials: FAL_KEY });
  const fileBuffer = fs.readFileSync(filePath);
  const blob = new Blob([fileBuffer], { type: getMimeType(filename) });
  return fal.storage.upload(blob);
}

async function falGenerate(prompt, imageUrls, aspectRatio = "1:1") {
  const { fal } = await import("@fal-ai/client");
  fal.config({ credentials: FAL_KEY });
  const result = await fal.subscribe("fal-ai/nano-banana-pro/edit", {
    input: {
      prompt,
      image_urls: imageUrls,
      aspect_ratio: aspectRatio,
      resolution: "2K",
      output_format: "jpeg",
    },
  });
  return result;
}

async function downloadImage(url) {
  return new Promise((resolve, reject) => {
    const proto = url.startsWith("https") ? https : require("http");
    proto.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return downloadImage(res.headers.location).then(resolve).catch(reject);
      }
      const chunks = [];
      res.on("data", (c) => chunks.push(c));
      res.on("end", () => resolve(Buffer.concat(chunks)));
    }).on("error", reject);
  });
}

async function generateImage({ type, productKey, customPrompt }) {
  let prompt, refImageNames = [], refFilename = null;

  if (type === "product" && productKey && PRODUCTS[productKey]) {
    const product = PRODUCTS[productKey];
    prompt = customPrompt || pick(PRODUCT_PROMPT_TEMPLATES);
    if (!customPrompt && product.label) {
      prompt = prompt.replace(PRODUCT_LABEL_LOCK, getProductLabelLock(productKey));
    }
    refFilename = product.ref;
    refImageNames.push(product.ref);
  } else if (type === "lifestyle" && productKey && PRODUCTS[productKey]) {
    const product = PRODUCTS[productKey];
    prompt = customPrompt || pick(LIFESTYLE_PROMPT_TEMPLATES);
    refFilename = product.woman;
    refImageNames.push(product.woman);
  } else {
    prompt = customPrompt || pick(MOOD_PROMPT_TEMPLATES);
    const moodFile = pick(MOOD_IMAGES);
    refFilename = moodFile;
    refImageNames.push(moodFile);
  }

  // Use fal.ai Nano Banana Pro for image generation (superior label preservation)
  if (FAL_KEY) {
    console.log(`[SocialGen] Generating ${type} image with fal.ai Nano Banana Pro...`);
    console.log(`[SocialGen] Reference: ${refImageNames.join(", ")}`);

    const refUrl = await falUploadRef(refFilename);
    console.log(`[SocialGen] Uploaded ref to fal storage: ${refUrl}`);

    const t0 = Date.now();
    const result = await falGenerate(prompt, [refUrl]);
    const secs = ((Date.now() - t0) / 1000).toFixed(1);
    console.log(`[SocialGen] fal.ai generation complete (${secs}s)`);

    const imgUrl = result.data.images[0].url;
    const imageBuffer = await downloadImage(imgUrl);
    const imageData = {
      data: imageBuffer.toString("base64"),
      mimeType: "image/jpeg",
    };

    return { imageData, textResponse: "", prompt, refImages: refImageNames };
  }

  // Fallback: Gemini
  console.log(`[SocialGen] Generating ${type} image with Gemini (${GEMINI_IMAGE_MODEL})...`);
  console.log(`[SocialGen] Reference: ${refImageNames.join(", ") || "none"}`);

  const parts = [];
  if (refFilename) {
    const b64 = readImageAsBase64(refFilename);
    if (b64) parts.push({ inlineData: { mimeType: getMimeType(refFilename), data: b64 } });
  }
  parts.push({ text: prompt });

  const body = {
    contents: [{ role: "user", parts }],
    generationConfig: { responseModalities: ["TEXT", "IMAGE"], temperature: 1.0 },
  };

  const gemResponse = await geminiRequest(body, GEMINI_IMAGE_MODEL);
  if (gemResponse.error) throw new Error(`Gemini error: ${gemResponse.error.message}`);

  let imageData = null, textResponse = "";
  const candidate = gemResponse.candidates?.[0];
  if (candidate?.content?.parts) {
    for (const part of candidate.content.parts) {
      if (part.inlineData) imageData = part.inlineData;
      if (part.text) textResponse += part.text;
    }
  }
  if (!imageData) throw new Error("No image returned from Gemini");

  return { imageData, textResponse, prompt, refImages: refImageNames };
}

async function generateCaption({ type, productKey, imageDescription, theme }) {
  const product = productKey ? PRODUCTS[productKey] : null;
  const productName = product?.name || "";
  const productDesc = product?.desc || "";

  let themeContext = "";
  if (theme) {
    themeContext = `\nTEMA FÖR INLÄGGET: ${theme.topic}\nVINKEL: ${theme.angle}`;
  } else if (type === "lifestyle" || type === "mood") {
    const angle = pick(LIFESTYLE_ANGLES);
    themeContext = `\nINSPIRATION: ${angle}`;
  } else if (type === "education") {
    const edu = pick(EDUCATION_THEMES);
    themeContext = `\nTEMA: ${edu.topic}\nVINKEL: ${edu.angle}`;
  }

  let valyuContext = "";
  if (type === "education" && theme?.topic) {
    const research = await searchValyu(`${theme.topic} skin health CBD CBG`);
    if (research) valyuContext = `\nVETENSKAPLIG KONTEXT (använd subtilt, inte som fotnot):\n${research}`;
  }

  const ebookSegments = loadEbookSegments();
  let ebookHint = "";
  if (ebookSegments.length > 0) {
    const seg = pick(ebookSegments);
    ebookHint = `\nFRÅN BOKEN "Weed Your Skin" (valfritt att anknyta till): ${seg.summary?.slice(0, 300) || seg.title}`;
  }

  const captionPrompt = `Du är social media-ansvarig för 1753 SKINCARE, ett svenskt hudvårdsmärke grundat av Christopher Genberg. Produkterna är CBD/CBG-baserade. Filosofin bygger på boken "Weed Your Skin" – huden är ett levande ekosystem, inte en yta att tvinga. Holistisk syn: livsstil (sömn, stress, kost, tarm, rörelse) och topikal vård hör ihop.

TONEN:
- Ärlig, varm, lite rebellisk – aldrig klinisk eller korporativ
- Som en klok vän som delar med sig, inte en säljare
- Ifrågasätt konventionell "köp mer produkter"-logik
- Humor och värme, inte predikande
- Värdehöjande och inspirerande – folk ska vilja spara inlägget
- INGA emojis. Aldrig.
${themeContext}${valyuContext}${ebookHint}

${productName ? `Produkten "${productName}" (${productDesc}) kan nämnas naturligt men inlägget ska INTE vara säljigt. Max en mening om produkten, resten ska vara värde.` : "Nämn INGA specifika produkter. Fokusera på kunskap, filosofi eller livsstil."}

${imageDescription ? `Bilden visar: ${imageDescription}` : ""}

Skriv FYRA versioner:

1. Instagram/Facebook (svenska, max 120 ord). Börja med en mening som stoppar scrollandet – provocerande, tankeväckande eller oväntat. Avsluta med en fråga som bjuder in till samtal.

2. LinkedIn (svenska, 150-250 ord). Professionell men personlig. Dela en insikt, kopplad till vetenskap, entreprenörskap eller innovation inom hudvård/wellness. Skriv som en grundare som delar kunskap med sitt nätverk – inte som ett varumärke som säljer. Styckebrytningar för läsbarhet. Avsluta med en tankeväckande fråga som inbjuder till diskussion.

3. Engelska versioner av båda.

FORMAT (skriv exakt så här):
CAPTION:
[Instagram/Facebook caption här]

LINKEDIN:
[LinkedIn caption här]

HASHTAGS:
[5-8 relevanta hashtags]

EN:
[Instagram/Facebook caption på engelska]

LINKEDIN_EN:
[LinkedIn caption på engelska]`;

  const body = {
    contents: [{ role: "user", parts: [{ text: captionPrompt }] }],
    generationConfig: { temperature: 0.85, maxOutputTokens: 4096 },
  };

  const response = await geminiRequest(body);
  const text = response.candidates?.[0]?.content?.parts?.[0]?.text || "";

  let captionSv = "", captionEn = "", hashtags = "", linkedinSv = "", linkedinEn = "";

  const captionMatch = text.match(/CAPTION:\s*\n([\s\S]*?)(?=\n(?:LINKEDIN:|HASHTAGS:))/i);
  const linkedinMatch = text.match(/LINKEDIN:\s*\n([\s\S]*?)(?=\nHASHTAGS:)/i);
  const hashMatch = text.match(/HASHTAGS:\s*\n(.*?)(?=\n(?:EN:|$))/is);
  const enMatch = text.match(/EN:\s*\n([\s\S]*?)(?=\n(?:LINKEDIN_EN:|$))/i);
  const linkedinEnMatch = text.match(/LINKEDIN_EN:\s*\n([\s\S]*?)$/i);

  captionSv = captionMatch?.[1]?.trim() || text.split("HASHTAGS:")[0]?.replace("CAPTION:", "").trim() || text.trim();
  linkedinSv = linkedinMatch?.[1]?.trim() || "";
  hashtags = hashMatch?.[1]?.trim() || "";
  captionEn = enMatch?.[1]?.trim() || "";
  linkedinEn = linkedinEnMatch?.[1]?.trim() || "";

  return { captionSv, captionEn, hashtags, linkedinSv, linkedinEn };
}

async function generatePost({ type = "product", productKey, customPrompt } = {}) {
  if (!GEMINI_API_KEY) throw new Error("GEMINI_API_KEY not set");

  if (type === "education") {
    type = "mood";
  }

  if ((type === "product" || type === "lifestyle") && !productKey) {
    const keys = Object.keys(PRODUCTS);
    productKey = pick(keys);
  }

  const theme = pick(EDUCATION_THEMES);

  const { imageData, textResponse, prompt, refImages } = await generateImage({ type, productKey, customPrompt });

  const timestamp = Date.now();
  const outputDir = path.join(__dirname, "..", "public", "social-media");
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
  const ext = imageData.mimeType?.includes("png") ? "png" : "jpg";
  const filename = `${type}-${productKey || "mood"}-${timestamp}.${ext}`;
  const filepath = path.join(outputDir, filename);
  fs.writeFileSync(filepath, Buffer.from(imageData.data, "base64"));
  console.log(`[SocialGen] Image saved: ${filepath}`);

  const captionType = type === "mood" ? pick(["mood", "education", "lifestyle"]) : type;
  const { captionSv, captionEn, hashtags, linkedinSv, linkedinEn } = await generateCaption({
    type: captionType, productKey, imageDescription: textResponse, theme,
  });

  return {
    type,
    productKey,
    imagePath: `/social-media/${filename}`,
    captionSv,
    captionEn,
    hashtags,
    linkedinSv,
    linkedinEn,
    promptUsed: prompt,
    referenceImages: refImages,
    productIds: productKey ? [productKey] : [],
  };
}

if (require.main === module) {
  const args = process.argv.slice(2);
  let type = "product", productKey = null, customPrompt = null;
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--type" && args[i+1]) type = args[++i];
    if (args[i] === "--product" && args[i+1]) productKey = args[++i];
    if (args[i] === "--prompt" && args[i+1]) customPrompt = args[++i];
  }
  generatePost({ type, productKey, customPrompt })
    .then(result => {
      console.log("\n=== Generated Post ===");
      console.log(`Type: ${result.type}`);
      console.log(`Product: ${result.productKey || "N/A"}`);
      console.log(`Image: ${result.imagePath}`);
      console.log(`\nCaption (SV):\n${result.captionSv}`);
      console.log(`\nLinkedIn (SV):\n${result.linkedinSv}`);
      console.log(`\nCaption (EN):\n${result.captionEn}`);
      console.log(`\nLinkedIn (EN):\n${result.linkedinEn}`);
      console.log(`\nHashtags: ${result.hashtags}`);
    })
    .catch(err => {
      console.error("Error:", err.message);
      process.exit(1);
    });
}

module.exports = { generatePost, generateImage, generateCaption, PRODUCTS, MOOD_IMAGES, EDUCATION_THEMES };
