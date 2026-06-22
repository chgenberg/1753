// outreach/test-send.js
//
// Kontrollerat skarptest: skickar EXAKT ett första-mejl till en angiven adress
// och pausar sedan agenten igen. Manipulerar bara flaggor + ordning i delad
// prod-DB; själva utskicket görs av den deployade serverns interna tick.
//
// Körning:  node outreach/test-send.js "<DATABASE_URL>" <email>

const args = process.argv.slice(2);
const conn = args.find((a) => a.startsWith("postgres"));
if (conn) process.env.DATABASE_URL = conn;
const email = (args.find((a) => !a.startsWith("postgres") && a.includes("@")) || "").toLowerCase().trim();

const db = require("../db");

(async () => {
  if (!email) { console.error("Ange e-postadress."); process.exit(1); }
  const s0 = await db.getOutreachSettings();
  const camp = s0.campaign || "sparre";
  const prevCap = s0.daily_cap || 15;

  const found = await db.pool.query(
    "SELECT * FROM outreach_contacts WHERE LOWER(email) = $1 AND campaign = $2 LIMIT 1",
    [email, camp]
  );
  if (!found.rows.length) {
    console.error(`Kontakten ${email} finns inte i kön för kampanj "${camp}".`);
    await db.pool.end(); process.exit(1);
  }
  const c = found.rows[0];

  // Baslinje: högsta befintliga outbound-id (så vi bara reagerar på ETT NYTT mejl).
  const baseline = await db.pool.query(
    "SELECT COALESCE(MAX(id),0) AS maxid FROM outreach_messages WHERE contact_id=$1 AND direction='outbound'",
    [c.id]
  );
  const sinceId = parseInt(baseline.rows[0].maxid, 10) || 0;

  // Gör testkontakten till äldsta queued så cap=1 garanterat plockar just den.
  await db.pool.query(
    "UPDATE outreach_contacts SET status='queued', created_at='2000-01-01', auto_replies=0, last_error='' WHERE id=$1",
    [c.id]
  );
  // Dagskvoten räknar första-mejl senaste 24h. Sätt cap = sent24 + 1 så att
  // EXAKT ett nytt mejl får gå (till äldsta queued = testkontakten), aldrig fler.
  const sent24 = await db.countOutreachFirstTouchLast24h();
  const testCap = sent24 + 1;
  console.log(`Testkontakt #${c.id} (${email}), segment=${c.segment}, kampanj=${camp} (baslinje msg-id=${sinceId}, sent24=${sent24})`);

  await db.updateOutreachSettings({ daily_cap: testCap, paused: false });
  console.log(`Agenten LIVE med cap=${testCap} (=> 1 nytt mejl). Väntar på NYTT utskick (intern tick var ~60s)...`);

  let msg = null;
  const start = Date.now();
  while (Date.now() - start < 175000) {
    const r = await db.pool.query(
      "SELECT * FROM outreach_messages WHERE contact_id=$1 AND direction='outbound' AND id>$2 ORDER BY id DESC LIMIT 1",
      [c.id, sinceId]
    );
    if (r.rows.length) { msg = r.rows[0]; break; }
    await new Promise((res) => setTimeout(res, 5000));
    process.stdout.write(".");
  }
  console.log("");

  // Återställ ALLTID: pausa + sätt tillbaka kvoten.
  await db.updateOutreachSettings({ paused: true, daily_cap: prevCap });
  console.log(`Agenten pausad igen, dagskvot återställd till ${prevCap}.`);

  if (msg) {
    console.log("\n===== SKICKAT =====");
    console.log("Ämne:    ", msg.subject);
    console.log("Status:  ", msg.status, "| provider_id:", msg.provider_id || "(TOMT – ev. Resend-fel!)");
    console.log("first_touch:", msg.first_touch);
    console.log("\n--- Brödtext ---\n" + msg.body);
  } else {
    const cc = await db.pool.query("SELECT status, last_error FROM outreach_contacts WHERE id=$1", [c.id]);
    console.log("\nInget utskick inom timeouten. Kontaktstatus:", JSON.stringify(cc.rows[0]));
    console.log("Kontrollera Railway-loggar (kör tick:en?) och att Resend-env är laddade i prod.");
  }

  await db.pool.end();
  process.exit(0);
})().catch(async (e) => {
  try { await db.updateOutreachSettings({ paused: true }); } catch (_) {}
  console.error("FEL:", e.message);
  try { await db.pool.end(); } catch (_) {}
  process.exit(1);
});
