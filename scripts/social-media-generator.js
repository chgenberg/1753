/**
 * Social Media Post Generator – 1753 SKINCARE
 *
 * Generates AI images and captions using Google Gemini,
 * with reference images for brand consistency.
 *
 * Usage:
 *   node scripts/social-media-generator.js [--type product|lifestyle|mood] [--product DUO]
 *
 * Env:  GEMINI_API_KEY
 */

const fs = require("fs");
const path = require("path");
const https = require("https");
const http = require("http");

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const MODEL = process.env.GEMINI_IMAGE_MODEL || "gemini-2.5-flash-image";
const API_BASE = "https://generativelanguage.googleapis.com/v1beta";

const REF_DIR = path.join(__dirname, "..", "public", "Referensbilder");

const PRODUCTS = {
  "TheONE":     { name: "The ONE CBD Face Cream",  ref: "TheONE.jpg",    woman: "TheONEWoman.jpg" },
  "ILOVE":      { name: "I LOVE Facial Oil",       ref: "ILOVE.jpg",     woman: "ILOVEWoman.jpg" },
  "TA-DA":      { name: "TA-DA Serum",             ref: "TA-DA.jpg",     woman: "TA-DAWoman.jpg" },
  "MR":         { name: "Makeup Remover",           ref: "MR.jpg",        woman: "MRwoman.jpg" },
  "Fungtastic": { name: "Fungtastic Face Mask",    ref: "Fungtastic.jpg",woman: "Fungtasticwoman.jpg" },
  "DUO":        { name: "DUO-kit",                  ref: "DUO.jpg",       woman: "DUOwoman.jpg" },
  "DUO+TA-DA":  { name: "DUO + TA-DA bundle",      ref: "DUO+TA-DA.jpg", woman: "DUO+TA-DAWoman.jpg" },
};

const MOOD_IMAGES = ["Bild-1.jpg","Bild-2.jpg","Bild-3.jpg","Bild-4.jpg","Bild-5.jpg","Bild-6.jpg","Bild-7.jpg","Bild-8.jpg","1.jpg","2.jpg","3.jpg","4.jpg","5.jpg"];

const PRODUCT_PROMPT_TEMPLATES = [
  `Use the provided image as the exact product reference. STRICT: Preserve product exactly as is. No label changes. No text modifications. No logo alterations. Environment: Minimalist bathroom combining light oak wood and soft stone. Wooden countertop with natural grain. Soft beige wall in background. Lighting: Warm natural light, late afternoon tone. Composition: Product placed on wooden surface next to a folded linen towel. Style: Natural, grounded, Scandinavian-Japanese (Japandi) aesthetic. Maintain realistic shadows and reflections. Product must remain 100% untouched.`,
  `Use the provided image as the exact product reference. 🔒 STRICT PRODUCT LOCK: Products must remain 100% identical to reference. Do not change label, logo, text, typography, colors or proportions. Do not enhance, redesign or reinterpret. No new text generation. Keep exact spacing and realism. Create a scene: minimalist Nordic bathroom shelf. Clean white marble surface. Single green plant (eucalyptus sprig) beside product. Soft morning light from left side. Steam or mist very subtly in background. Premium editorial skincare campaign feel. Hyper-realistic, cinematic composition.`,
  `Use the provided image as the exact product reference. STRICT: Preserve product exactly as is. Zero modifications to labels or design. Scene: Product resting on a smooth river stone beside a small pool of still water. Surrounded by soft moss and fern leaves. Natural forest floor setting. Lighting: Dappled sunlight through canopy above. Warm golden tone. Style: Nature meets luxury skincare. Scandinavian organic aesthetic. Sharp product focus, softly blurred natural background.`,
  `Use the provided image as the exact product reference. STRICT PRODUCT LOCK: No changes to product whatsoever. Scene: Clean concrete shelf in a high-end spa. Soft white towels rolled nearby. Single dried flower stem in a ceramic vase. Background: frosted glass with soft diffused light. Style: Luxury minimalism. Premium spa campaign. Neutral palette: white, beige, soft grey. Warm but clean lighting. Editorial product photography.`,
];

const LIFESTYLE_PROMPT_TEMPLATES = [
  `Use the provided image as the exact reference for the woman. STRICT: Keep the same woman, same face, same skin texture, same natural appearance. Do not change identity, facial features, proportions, or skin tone. No beautification, no retouching, no artificial smoothing. Scene: A sunlit Mediterranean-style courtyard with natural materials. She is sitting relaxed with a peaceful expression. Styling: Oversized linen shirt, loose linen trousers, tonal beige, barefoot. Environment: Warm natural stone, olive trees, terracotta pots with herbs. Lighting: Golden hour. Style: Editorial lifestyle photography. Mood: Contemplative, grounded, calm, timeless. No text, no logos, no products visible.`,
  `Use the provided image as the exact reference for the woman. STRICT: Keep same person, same face, same skin. Scene: She is standing by a large open window in a minimalist Scandinavian apartment. Morning light streaming in. She holds a white ceramic cup with both hands, looking out the window with a gentle smile. Wearing a soft cashmere sweater in oatmeal tone. Hair natural and effortless. Environment: Clean lines, light wood floor, single plant. Style: Scandinavian hygge lifestyle. Warm, intimate, editorial. No text, no logos, no products visible.`,
  `Use the provided image as the exact reference for the woman. STRICT: Preserve identity exactly. Scene: Outdoor setting, she is walking barefoot on a wooden boardwalk near the sea. Wind gently blowing her hair. Wearing flowing white linen dress. Expression: serene, confident. Background: Nordic coastline, grey-blue sea, cloudy sky with breaks of warm light. Style: Scandinavian coastal lifestyle. Calm and powerful. No text, no logos, no products visible.`,
];

const MOOD_PROMPT_TEMPLATES = [
  `Use the provided reference for color palette and atmosphere only. Create a new scene: A minimalist still life of natural ingredients. Raw honey in a ceramic bowl, fresh herbs, a slice of lemon, and a small wooden spoon on a textured linen cloth. Warm natural light from the side. Scandinavian food photography style. Earthy, honest, grounded. Color palette: warm sand, honey gold, sage green. No products, no text, no logos.`,
  `Use the reference image for mood and color direction. Create: An aerial view of a calm Nordic forest lake at golden hour. Still water reflecting pine trees. A single wooden dock extending into the water. Mist rising gently from the surface. Feeling: serenity, nature, purity. Style: landscape photography, cinematic. No people, no products, no text.`,
  `Use the reference for tonal inspiration. Create: Close-up of hands cupping clear water from a stream. Soft natural light. Focus on the water droplets and skin texture. Background softly blurred with green foliage. Feeling: purity, simplicity, connection to nature. Style: intimate macro photography. No products, no text, no logos.`,
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

async function geminiRequest(body) {
  const url = `${API_BASE}/models/${MODEL}:generateContent?key=${GEMINI_API_KEY}`;
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

async function generateImage({ type, productKey, customPrompt }) {
  let prompt, refImages = [];

  if (type === "product" && productKey && PRODUCTS[productKey]) {
    const product = PRODUCTS[productKey];
    prompt = customPrompt || pick(PRODUCT_PROMPT_TEMPLATES);
    const b64 = readImageAsBase64(product.ref);
    if (b64) refImages.push({ data: b64, mime: getMimeType(product.ref), name: product.ref });
  } else if (type === "lifestyle" && productKey && PRODUCTS[productKey]) {
    const product = PRODUCTS[productKey];
    prompt = customPrompt || pick(LIFESTYLE_PROMPT_TEMPLATES);
    const b64 = readImageAsBase64(product.woman);
    if (b64) refImages.push({ data: b64, mime: getMimeType(product.woman), name: product.woman });
  } else {
    prompt = customPrompt || pick(MOOD_PROMPT_TEMPLATES);
    const moodFile = pick(MOOD_IMAGES);
    const b64 = readImageAsBase64(moodFile);
    if (b64) refImages.push({ data: b64, mime: getMimeType(moodFile), name: moodFile });
  }

  const parts = [];
  for (const img of refImages) {
    parts.push({ inlineData: { mimeType: img.mime, data: img.data } });
  }
  parts.push({ text: prompt });

  const body = {
    contents: [{ role: "user", parts }],
    generationConfig: {
      responseModalities: ["TEXT", "IMAGE"],
      temperature: 1.0,
    },
  };

  console.log(`[SocialGen] Generating ${type} image...`);
  console.log(`[SocialGen] Reference: ${refImages.map(r => r.name).join(", ") || "none"}`);

  const response = await geminiRequest(body);

  if (response.error) {
    throw new Error(`Gemini error: ${response.error.message || JSON.stringify(response.error)}`);
  }

  let imageData = null, textResponse = "";
  const candidate = response.candidates?.[0];
  if (candidate?.content?.parts) {
    for (const part of candidate.content.parts) {
      if (part.inlineData) {
        imageData = part.inlineData;
      }
      if (part.text) {
        textResponse += part.text;
      }
    }
  }

  if (!imageData) {
    throw new Error("No image returned from Gemini");
  }

  return { imageData, textResponse, prompt, refImages: refImages.map(r => r.name) };
}

async function generateCaption({ type, productKey, imageDescription }) {
  const product = productKey ? PRODUCTS[productKey] : null;
  const productName = product?.name || "";

  const captionPrompt = `Du är social media-ansvarig för 1753 SKINCARE, ett svenskt hudvårdsmärke med CBD/CBG-baserade produkter. Tonen är ärlig, varm och rebellisk – aldrig klinisk eller korporativ. Skriv ALDRIG med emojis.

Skriv ett Instagram-inlägg (caption) på svenska. Max 150 ord. Inlägget ska:
- Vara personligt och ärligt, som en vän som pratar
- Ha en litet rebellisk underton mot konventionell hudvård
- Fokusera på naturlig hudvård, välmående och livsstil
${productName ? `- Nämna produkten "${productName}" naturligt (inte säljigt)` : "- Inte nämna specifika produkter, utan fokusera på hudvårdsfilosofi"}
- Avsluta med en tankeväckande fråga eller uppmaning
${imageDescription ? `\nBilden visar: ${imageDescription}` : ""}

Skriv BARA captionen, inget annat. Skriv sedan på en ny rad: HASHTAGS: följt av 5-8 relevanta hashtags.

Skriv sedan på en ny rad: EN: följt av samma caption översatt till engelska.`;

  const body = {
    contents: [{ role: "user", parts: [{ text: captionPrompt }] }],
    generationConfig: { temperature: 0.8 },
  };

  const response = await geminiRequest(body);
  const text = response.candidates?.[0]?.content?.parts?.[0]?.text || "";

  let captionSv = "", captionEn = "", hashtags = "";
  const lines = text.split("\n");
  const hashIdx = lines.findIndex(l => l.trim().startsWith("HASHTAGS:"));
  const enIdx = lines.findIndex(l => l.trim().startsWith("EN:"));

  if (hashIdx >= 0) {
    captionSv = lines.slice(0, hashIdx).join("\n").trim();
    hashtags = lines[hashIdx].replace("HASHTAGS:", "").trim();
  } else {
    captionSv = text.trim();
  }

  if (enIdx >= 0) {
    captionEn = lines.slice(enIdx).join("\n").replace("EN:", "").trim();
  }

  return { captionSv, captionEn, hashtags };
}

async function generatePost({ type = "product", productKey, customPrompt } = {}) {
  if (!GEMINI_API_KEY) throw new Error("GEMINI_API_KEY not set");

  if (type === "product" && !productKey) {
    const keys = Object.keys(PRODUCTS);
    productKey = pick(keys);
  }

  const { imageData, textResponse, prompt, refImages } = await generateImage({ type, productKey, customPrompt });

  const timestamp = Date.now();
  const outputDir = path.join(__dirname, "..", "public", "social-media");
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
  const ext = imageData.mimeType?.includes("png") ? "png" : "jpg";
  const filename = `${type}-${productKey || "mood"}-${timestamp}.${ext}`;
  const filepath = path.join(outputDir, filename);
  fs.writeFileSync(filepath, Buffer.from(imageData.data, "base64"));
  console.log(`[SocialGen] Image saved: ${filepath}`);

  const { captionSv, captionEn, hashtags } = await generateCaption({
    type, productKey, imageDescription: textResponse,
  });

  return {
    type,
    productKey,
    imagePath: `/social-media/${filename}`,
    captionSv,
    captionEn,
    hashtags,
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
      console.log(`\nCaption (EN):\n${result.captionEn}`);
      console.log(`\nHashtags: ${result.hashtags}`);
    })
    .catch(err => {
      console.error("Error:", err.message);
      process.exit(1);
    });
}

module.exports = { generatePost, generateImage, generateCaption, PRODUCTS, MOOD_IMAGES };
