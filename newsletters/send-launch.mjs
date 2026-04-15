/**
 * Skickar launch-nyhetsbrevet till alla prenumeranter.
 *
 * Användning:
 *   node newsletters/send-launch.mjs
 *
 * Env-variabler (eller .env):
 *   API_URL      – Backend-URL (default: https://api.1753skin.com)
 *   ADMIN_KEY    – Admin API-nyckel
 */

import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const html = readFileSync(join(__dirname, "launch-newsletter.html"), "utf-8");

const API_URL = process.env.API_URL || "https://api.1753skin.com";
const ADMIN_KEY = process.env.ADMIN_KEY || process.env.ADMIN_API_KEY;

if (!ADMIN_KEY) {
  console.error("ADMIN_KEY krävs. Sätt den som env-variabel.");
  process.exit(1);
}

const subject = "Vår nya hemsida är live – och den analyserar din hud";

async function send() {
  console.log(`Skickar "${subject}" via ${API_URL}/api/newsletter/broadcast ...`);

  const res = await fetch(`${API_URL}/api/newsletter/broadcast`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ subject, html, adminKey: ADMIN_KEY }),
  });

  const data = await res.json();

  if (data.ok) {
    console.log(`Klart! Skickat till ${data.sent}/${data.total} prenumeranter.`);
  } else {
    console.error("Misslyckades:", data.message || data);
  }
}

send().catch((err) => {
  console.error("Fel:", err.message);
  process.exit(1);
});
