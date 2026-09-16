/**
 * Agentarmén – 1753-anpassad Dirigent från Billboard Bee.
 * Chatt, visuell träning och utkast. Kör aldrig kassa, Viva, Fortnox-bokföring
 * eller hudanalys-prompten. Mejl och koder går inte ut härifrån.
 */

const crypto = require("crypto");
const db = require("../db");

const AGENT_FIGURES = 16;
const PRIMARY_MODEL = process.env.OPENAI_MODEL_AGENT || process.env.OPENAI_MODEL_NEWSLETTER || "gpt-5.4";
const FALLBACK_MODEL = "gpt-5.4-mini";

const ACCENTS = ["ink", "green", "brown", "gold"];

const SEED_DESKS = [
  {
    key: "hudvard",
    name: "Hudvård",
    blurb: "Holistisk röst och rutin. Ändrar aldrig analysprompten.",
    accent: "green",
  },
  {
    key: "kundresa",
    name: "Kundresa",
    blurb: "Välkomst, post-köp och recension. Inget mejl utan godkännande.",
    accent: "ink",
  },
  {
    key: "utskick",
    name: "Utskick",
    blurb: "Nyhetsbrev och utkast. Preview först.",
    accent: "brown",
  },
  {
    key: "bokforing",
    name: "Bokföring",
    blurb: "Fortnox-utkast. Du trycker bokför.",
    accent: "ink",
  },
  {
    key: "lager",
    name: "Lager",
    blurb: "Ongoing-status. Skickar inget själv.",
    accent: "green",
  },
  {
    key: "prenumeration",
    name: "Prenumeration",
    blurb: "Inbjudan 15 %. Aldrig blast utan ja.",
    accent: "gold",
  },
  {
    key: "recension",
    name: "Recension",
    blurb: "Omdömesfrågor med tokenlänk. Inga påhittade koder.",
    accent: "brown",
  },
];

const EVENTS = {
  "analysis.completed": "En hudanalys har sparats",
  "order.paid": "En order är betald",
  "review.submitted": "Ett omdöme har skickats",
  "subscriber.joined": "Någon prenumererar på nyhetsbrevet",
  "subscription.due": "En prenumeration ska förnyas",
  "cart.abandoned": "En varukorg lämnades",
  "winback.eligible": "En kund är tyst sedan länge",
};

const ACTIONS = {
  "card.open": { gate: "none", label: "Öppna ett kort på tavlan" },
  "email.draft": { gate: "email", label: "Skriv mejlutkast (skickas inte)" },
  "copy.draft": { gate: "none", label: "Skriv copyutkast" },
};

const IDEAS = {
  hudvard: [
    "Lär dig vår holistiska röst. Max två till tre produkter.",
    "När en analys är sparad, skriv ett uppföljningsutkast efter 72 timmar.",
  ],
  kundresa: [
    "När en order är betald, skriv ett tackutkast utan rabattkod.",
    "Ta fram en recensionsfråga med tokenlänk, skicka inte.",
  ],
  utskick: [
    "Skriv ett nyhetsbrevsutkast. Preview till ch.genberg@gmail.com först.",
    "Håll tonen varm och rebellisk. Inga emojis.",
  ],
  bokforing: [
    "Påminn när en betald order saknar Fortnox-faktura. Skapa inget själv.",
    "Skriv ett utkast för efterregistrering. Jag trycker bokför.",
  ],
  lager: [
    "Visa hur du skulle flagga en order som väntar på Ongoing.",
    "Rör aldrig utleverans utan att jag sagt ja.",
  ],
  prenumeration: [
    "Skriv en inbjudan om 15 procent. Inget utskick.",
    "Hoppa över den som redan har aktiv prenumeration.",
  ],
  recension: [
    "Fråga om omdöme två veckor efter köp. Inga påhittade koder.",
    "TACK15 skapas först när omdömet är inskickat.",
  ],
  group: [
    "Hur delar ni upp en tyst kund som gjort hudanalys men inte köpt?",
    "Skriv en plan för recension och prenumeration utan att skicka något.",
  ],
  custom: [
    "Vem är du, vad gör du, och vad får du inte röra?",
    "Ladda upp en referensbild så du håller samma känsla.",
  ],
};

const SITE_BRIEF = `1753 SKINCARE är ett svenskt hudvårdsmärke. Tonen är ärlig, varm och rebellisk – aldrig klinisk.
Produkter: The ONE, I LOVE, TA-DA, DUO, Au Naturel, Fungtastic, Makeup Remover.
Gratis frakt från 600 kr. Prenumeration ger 15 % i kassan.
Hudanalysen är holistisk och rekommenderar max 2–3 produkter.
Du får ALDRIG ändra kassan, Viva, Fortnox-bokföring, Ongoing-utleverans eller analysprompten.
Du får ALDRIG lova en rabattkod som inte redan finns i discount_codes.
Mejl går inte ut härifrån. Du skriver utkast. Christopher godkänner.
Kalla dig vid namn eller jag. Skriv aldrig AI, modellnamn eller emoji.`;

function section(raw, name) {
  const re = new RegExp(
    `(?:^|\\n)${name}:\\s*([\\s\\S]*?)(?=\\n(?:JAG|GÖR|GOR|VET|SAKNAS|LÄRDOM|LARDOM|KLART):|$)`,
    "i"
  );
  const m = raw.match(re);
  return m?.[1]?.trim() ?? "";
}

function parseBriefing(raw) {
  const t = raw?.trim() ?? "";
  if (!t) return { jag: "", gor: "", vet: "", saknas: "", lardom: [], klart: false };
  const jag = section(t, "JAG");
  const gor = section(t, "GÖR") || section(t, "GOR");
  const vet = section(t, "VET");
  const saknas = section(t, "SAKNAS");
  const lardomBlock = section(t, "LÄRDOM") || section(t, "LARDOM");
  const lardom = lardomBlock
    ? lardomBlock
        .split(/\n+/)
        .map((line) => line.replace(/^\s*(?:[-*]|\d+[.)])\s*/, "").trim())
        .filter(Boolean)
        .slice(-8)
    : [];
  const hasSections = Boolean(jag || gor || vet || saknas || lardom.length);
  const klartLine = /KLART:\s*ja/i.test(t);
  const klartNej = /KLART:\s*nej/i.test(t) || Boolean(saknas);
  return {
    jag: jag || (!hasSections ? t.replace(/\nKLART:[^\n]*/gi, "").replace(/\nSAKNAS:[^\n]*/gi, "").trim() : ""),
    gor,
    vet: hasSections ? vet : "",
    saknas,
    lardom,
    klart: klartLine && !klartNej,
  };
}

function formatBriefing(b) {
  const lines = [];
  if (b.jag) lines.push(`JAG: ${b.jag}`);
  if (b.gor) lines.push(`GÖR: ${b.gor}`);
  if (b.vet) lines.push(`VET: ${b.vet}`);
  if (b.saknas && !b.klart) lines.push(`SAKNAS: ${b.saknas}`);
  if (b.lardom.length) lines.push(`LÄRDOM:\n${b.lardom.map((x) => `- ${x}`).join("\n")}`);
  lines.push(b.klart && !b.saknas ? "KLART: ja" : "KLART: nej");
  return lines.join("\n").slice(0, 2400);
}

function stampBlocks({ existing, jag, gor, vet, saknas, ready }) {
  const b = parseBriefing(existing);
  if (jag) b.jag = jag.slice(0, 400);
  if (gor) b.gor = gor.slice(0, 400);
  if (vet) b.vet = `${b.vet}\n${vet}`.trim().slice(0, 800);
  b.saknas = ready ? "" : (saknas || b.saknas || "mer om uppdraget").slice(0, 400);
  b.klart = Boolean(ready);
  return formatBriefing(b);
}

function compactHistory(history, keep = 4) {
  if (history.length <= keep) return history;
  const older = history.length - keep;
  const kept = history.slice(-keep).map((m) => ({
    role: m.role,
    text: String(m.text || "").slice(0, 280),
  }));
  return [{ role: "agent", text: `Tidigare ${older} turer komprimerade.` }, ...kept];
}

function isAgentFigure(n) {
  return Number.isInteger(n) && n >= 1 && n <= AGENT_FIGURES;
}

function unusedFigures(used) {
  const taken = new Set([...used].filter(isAgentFigure));
  return Array.from({ length: AGENT_FIGURES }, (_, i) => i + 1).filter((n) => !taken.has(n));
}

function looksLikeTraining(text) {
  const lower = String(text || "").toLowerCase();
  return /du ska |din uppgift|din roll|ta hand om|sköt |sköta |hantera |ansvar(?:ar)? för|utbilda|arbetsbeskriv|från och med nu|jag vill att du|lär dig|referens/.test(lower);
}

function looksLikeAutomation(text) {
  const lower = String(text || "").toLowerCase();
  return /när |så fort|öppna (ett )?kort|skicka (en )?mall|skriv utkast|efter en order|efter en analys/.test(lower);
}

function isConductorEvent(v) {
  return Object.prototype.hasOwnProperty.call(EVENTS, v);
}

function isConductorAction(v) {
  return Object.prototype.hasOwnProperty.call(ACTIONS, v);
}

function gateForAction(action) {
  return ACTIONS[action]?.gate || "email";
}

function scrub(text) {
  return String(text || "")
    .replace(/\bAI:n\b/gi, "jag")
    .replace(/\bAI-?\b/g, "")
    .replace(/\bgpt-[^\s,.]*/gi, "modellen")
    .replace(/[^\S\n]{2,}/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function parseJsonObject(raw) {
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start === -1 || end <= start) return null;
  try {
    return JSON.parse(raw.slice(start, end + 1));
  } catch {
    return null;
  }
}

function openaiReady() {
  return Boolean(process.env.OPENAI_API_KEY);
}

function extractOutputText(data) {
  if (!data) return "";
  if (data.output_text) return String(data.output_text);
  if (Array.isArray(data.output)) {
    for (const item of data.output) {
      if (item.type === "message" && Array.isArray(item.content)) {
        const parts = item.content
          .filter((c) => c.type === "output_text")
          .map((c) => c.text);
        if (parts.length) return parts.join("\n");
      }
    }
  }
  if (data.choices?.[0]?.message?.content) return String(data.choices[0].message.content);
  return "";
}

async function callResponses({ instructions, input, model = PRIMARY_MODEL }) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    const err = new Error("OPENAI_API_KEY saknas på servern.");
    err.code = "NO_KEY";
    throw err;
  }
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000);
  try {
    const res = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        instructions,
        input,
        max_output_tokens: 1600,
      }),
      signal: controller.signal,
    });
    if (!res.ok) {
      if ([400, 403, 404].includes(res.status) && model !== FALLBACK_MODEL) {
        clearTimeout(timeout);
        return callResponses({ instructions, input, model: FALLBACK_MODEL });
      }
      const errBody = await res.json().catch(() => ({}));
      throw new Error(errBody.error?.message || `OpenAI ${res.status}`);
    }
    const data = await res.json();
    return extractOutputText(data);
  } finally {
    clearTimeout(timeout);
  }
}

async function openaiJson({ system, user }) {
  try {
    const raw = await callResponses({
      instructions: `${system}\n\nSvara ENDAST med ett JSON-objekt. Ingen annan text.`,
      input: user,
    });
    return parseJsonObject(raw || "");
  } catch (err) {
    console.warn("[AgentArmy]", err.message);
    return null;
  }
}

async function describeFeel(mime, base64) {
  try {
    const raw = await callResponses({
      instructions:
        "Du skriver en kort bildkänsla för 1753 SKINCARE. Svenska. Kalla dig inte AI. Svara ENDAST JSON: {\"feel\":\"...\",\"prompts\":[\"...\",\"...\"]}. feel: 2–4 meningar om ljus, färg, crop och vad som inte får ändras. prompts: två exempel på nästa bild med samma känsla. Inget går ut.",
      input: [
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: "Det här är en referens. Samma känsla ska sitta i allt som görs efteråt.",
            },
            {
              type: "input_image",
              image_url: `data:${mime};base64,${base64}`,
            },
          ],
        },
      ],
    });
    const obj = parseJsonObject(raw || "") || {};
    const feel = typeof obj.feel === "string" ? obj.feel.trim() : "";
    const prompts = Array.isArray(obj.prompts)
      ? obj.prompts.filter((p) => typeof p === "string" && p.trim().length > 8).slice(0, 2)
      : [];
    if (!feel) return null;
    return [feel, ...prompts.map((p, i) => `Exempel ${i + 1}: ${p.trim()}`)].join("\n");
  } catch (err) {
    console.warn("[AgentArmy] vision:", err.message);
    return null;
  }
}

function chatInstructions(desk) {
  return `Du är ${desk.name} på 1753 SKINCARE. ${desk.blurb || ""}
Svara som den personen, i första person, på svenska. Kort och konkret. Inga emojis. Skriv aldrig AI eller modellnamn.

${SITE_BRIEF}

Din utbildning:
${desk.briefing || "(ingen briefing än — du kan ändå prata, och lära dig längs vägen)"}

Du pratar med Christopher i admin. Det här är en vanlig chatt. Svara på det som sägs.
Om hen utbildar dig eller ger ett När→gör-uppdrag får du ställa motfrågor.
Inget mejl, ingen kod och ingen bokföring går ut härifrån.`;
}

function asDraft(row) {
  if (!row || typeof row !== "object") return null;
  const title = typeof row.title === "string" ? row.title.trim().slice(0, 80) : "";
  const trigger = typeof row.trigger === "string" ? row.trigger : "";
  const action = typeof row.action === "string" ? row.action : "";
  if (!title || !isConductorEvent(trigger) || !isConductorAction(action)) return null;
  return { title, trigger, action, gate: gateForAction(action) };
}

function asQuestions(v) {
  if (!Array.isArray(v)) return [];
  return v
    .filter((row) => typeof row === "string" && row.trim().length > 6)
    .map((row) => scrub(row).replace(/\?+$/, "").slice(0, 200))
    .filter(Boolean)
    .slice(0, 6);
}

function withQuestions(reply, questions, ready) {
  if (ready || questions.length === 0) return reply;
  const marks = (reply.match(/\?/g) || []).length;
  if (marks >= Math.min(2, questions.length)) return reply;
  const lines = questions.map((q, i) => `${i + 1}. ${q}?`).join("\n");
  return `${reply}\n\n${lines}`.slice(0, 1600);
}

const TRAIN_SYSTEM = `Du utbildar en anställd på 1753 SKINCARE. Svara som den personen, på svenska.

${SITE_BRIEF}

Regler:
- Briefing i block: JAG / GÖR / VET / SAKNAS / LÄRDOM / KLART. Behåll lärdomar.
- Ett uppdrag är inte klart förrän du kan utföra det. Ställ 3–6 motfrågor. Be aldrig om API-nycklar.
- drafts bara när ready=true och chefen gav När→gör ur katalogen.
- Tillåtna händelser: ${Object.keys(EVENTS).join(", ")}.
- Tillåtna åtgärder: ${Object.keys(ACTIONS).join(", ")}.
- Inte kassa, Viva, Fortnox-bokföring, Ongoing-utleverans, deploy eller rabattkoder som inte finns.
- blurb: en rad, max 160 tecken.
- Svara ENDAST JSON: {"reply":"...","blurb":"...","briefing":"...","questions":["..."],"ready":false,"drafts":[]}`;

const TASK_SYSTEM = `Du är en anställd på 1753 SKINCARE. Svara som den personen, på svenska.

${SITE_BRIEF}

Regler:
- Följ briefing (JAG/GÖR/VET/SAKNAS/LÄRDOM). Om något saknas: fråga.
- drafts tomma tills ready. email.draft skickas aldrig.
- Svara ENDAST JSON: {"reply":"...","blurb":null,"briefing":null,"questions":["..."],"ready":false,"drafts":[]}`;

const GROUP_SYSTEM = `Du är rummet med anställda på 1753 SKINCARE. Svara som 1–3 av dem, på svenska.

${SITE_BRIEF}

Regler:
- Varje replik är en namngiven anställd ur listan.
- De delar upp. Inget går ut. Inga koder som inte finns.
- Svara ENDAST JSON: {"replies":[{"name":"...","text":"..."}],"questions":["..."],"ready":false,"drafts":[]}`;

function serializeMessage(row) {
  return {
    id: row.id,
    role: row.role,
    text: row.text,
    name: row.name || null,
    createdAt: row.created_at,
    deskId: row.desk_id,
  };
}

function serializeRule(row) {
  return {
    id: row.id,
    title: row.title,
    trigger: row.trigger,
    action: row.action,
    gate: row.gate,
    approved: row.approved,
    enabled: row.enabled,
    lastRanAt: row.last_ran_at,
  };
}

function serializeRef(row) {
  return {
    id: row.id,
    kind: row.kind,
    feel: row.feel || "",
    url: `/admin/agenter/refs/${row.id}`,
  };
}

function serializeDesk(row, extras) {
  return {
    id: row.id,
    key: row.key,
    name: row.name,
    blurb: row.blurb || "",
    briefing: row.briefing || "",
    accent: row.accent || "ink",
    portrait: row.portrait,
    seeded: Boolean(row.seeded),
    waiting: extras.waiting || 0,
    on: extras.on || 0,
    refs: extras.refs || [],
    rules: extras.rules || [],
    messages: extras.messages || [],
    ideas: IDEAS[row.key] || IDEAS.custom,
  };
}

async function ensurePortraits() {
  const desks = await db.listConductorDesks();
  const used = new Set();
  for (const desk of desks) {
    const keep = desk.portrait && isAgentFigure(desk.portrait) && !used.has(desk.portrait);
    if (keep) {
      used.add(desk.portrait);
      continue;
    }
    const next = unusedFigures(used)[0];
    if (!next) break;
    used.add(next);
    await db.updateConductorDesk(desk.id, { portrait: next });
  }
}

async function ensureSeededDesks() {
  for (const seed of SEED_DESKS) {
    const existing = await db.findConductorDeskByKey(seed.key);
    if (existing) continue;
    await db.createConductorDesk({
      key: seed.key,
      name: seed.name,
      blurb: seed.blurb,
      accent: seed.accent,
      seeded: true,
    });
  }
  await ensurePortraits();
}

async function loadArmy() {
  await ensureSeededDesks();
  const desks = await db.listConductorDesks();
  const groupMessages = (await db.listGroupConductorMessages()).map(serializeMessage);
  const packed = [];
  for (const desk of desks) {
    const [messages, rules, refs] = await Promise.all([
      db.listConductorMessages(desk.id),
      db.listConductorRules(desk.id),
      db.listConductorRefs(desk.id),
    ]);
    const waiting = rules.filter((r) => !r.approved).length;
    const on = rules.filter((r) => r.approved && r.enabled).length;
    packed.push(
      serializeDesk(desk, {
        waiting,
        on,
        messages: messages.map(serializeMessage),
        rules: rules.map(serializeRule),
        refs: refs.map(serializeRef),
      })
    );
  }
  return {
    desks: packed,
    group: { messages: groupMessages, ideas: IDEAS.group },
    figures: { available: unusedFigures(packed.map((d) => d.portrait || 0)) },
    catalog: { events: EVENTS, actions: ACTIONS },
    openai: { ready: openaiReady(), model: PRIMARY_MODEL },
  };
}

function greetingForDesk(desk) {
  const jobs =
    desk.rules.length > 0
      ? ` Jag har redan: ${desk.rules.map((r) => r.title).slice(0, 3).join(", ")}.`
      : " Jag har inga uppdrag än.";
  const wait = desk.waiting > 0 ? ` ${desk.waiting} utkast väntar på att du godkänner.` : "";
  const on = desk.on > 0 ? ` ${desk.on} är på.` : "";
  return `Jag är ${desk.name}.${jobs}${on}${wait} Säg vad jag ska göra, som till en anställd. Eller ladda upp en arbetsbeskrivning eller referensbild. Jag frågar om något saknas. Inget går ut förrän du godkänner.`;
}

function historyAsInput(messages, latest) {
  const rows = compactHistory(messages.map((m) => ({ role: m.role, text: m.text })));
  return [
    ...rows.map((m) => ({
      role: m.role === "you" ? "user" : "assistant",
      content: String(m.text || ""),
    })),
    { role: "user", content: latest },
  ];
}

async function thinkDesk({ desk, text, mode }) {
  const replyRaw = await callResponses({
    instructions: chatInstructions(desk),
    input: historyAsInput(desk.messages, text),
  });
  const reply = scrub(replyRaw || "").slice(0, 2000);
  if (!reply) {
    const err = new Error("OpenAI svarade tomt. Försök igen.");
    err.code = "EMPTY";
    throw err;
  }

  let briefing = null;
  let blurb = null;
  let drafts = [];
  let ready = false;

  if (mode === "train" || looksLikeAutomation(text)) {
    const system = mode === "train" ? TRAIN_SYSTEM : TASK_SYSTEM;
    const user = [
      `Namn: ${desk.name}`,
      `Roll: ${desk.blurb}`,
      `Briefing:\n${desk.briefing || "(tom)"}`,
      `Chef: ${text}`,
      `Ditt chatt-svar: ${reply}`,
    ].join("\n\n");
    const obj = await openaiJson({ system, user });
    if (obj) {
      const questions = asQuestions(obj.questions);
      ready = Boolean(obj.ready) && questions.length === 0;
      drafts = ready && Array.isArray(obj.drafts)
        ? obj.drafts.map(asDraft).filter(Boolean).slice(0, 3)
        : [];
      blurb = typeof obj.blurb === "string" ? obj.blurb.trim().slice(0, 160) : null;
      briefing =
        typeof obj.briefing === "string" && obj.briefing.trim()
          ? stampBlocks({
              existing: obj.briefing,
              saknas: ready ? "" : questions.join("; ") || parseBriefing(obj.briefing).saknas,
              ready,
            })
          : mode === "train"
            ? stampBlocks({
                existing: desk.briefing,
                jag: desk.briefing?.trim() ? undefined : `Uppdrag: ${text.slice(0, 200)}`,
                saknas: questions.join("; ") || "mer om uppdraget",
                ready,
              })
            : null;
    }
  }

  return {
    reply: withQuestions(reply, [], ready),
    briefing,
    blurb,
    drafts,
    ready,
  };
}

async function chatDesk(id, { text, greet }) {
  const army = await loadArmy();
  const desk = army.desks.find((d) => d.id === Number(id));
  if (!desk) return { status: 404, body: { message: "Anställd hittades inte" } };

  if (greet && desk.messages.length === 0) {
    const reply = greetingForDesk(desk);
    await db.addConductorMessage({ deskId: desk.id, role: "agent", text: reply, name: desk.name });
    return { status: 200, body: await loadArmy() };
  }

  const clean = String(text || "").trim().slice(0, 2000);
  if (clean.length < 2) return { status: 400, body: { message: "Skriv lite mer." } };
  if (!openaiReady()) {
    return { status: 503, body: { message: "OpenAI-nyckeln saknas på servern. Sätt OPENAI_API_KEY." } };
  }

  await db.addConductorMessage({ deskId: desk.id, role: "you", text: clean });
  const mode = looksLikeTraining(clean) ? "train" : "chat";
  let thought;
  try {
    thought = await thinkDesk({ desk, text: clean, mode });
  } catch (err) {
    await db.addConductorMessage({
      deskId: desk.id,
      role: "agent",
      text: `${desk.name} här. Jag kom inte fram just nu. ${err.message || "Försök igen."}`.slice(0, 400),
      name: desk.name,
    });
    return {
      status: err.code === "NO_KEY" ? 503 : 502,
      body: { message: err.message || "Chatten kunde inte svara.", ...(await loadArmy()) },
    };
  }

  const fields = {};
  if (thought.briefing) fields.briefing = thought.briefing;
  if (thought.blurb) fields.blurb = thought.blurb;
  if (Object.keys(fields).length) await db.updateConductorDesk(desk.id, fields);

  for (const draft of thought.drafts) {
    await db.createConductorRule({
      deskId: desk.id,
      title: draft.title,
      trigger: draft.trigger,
      action: draft.action,
      gate: draft.gate,
    });
  }

  await db.addConductorMessage({
    deskId: desk.id,
    role: "agent",
    text: thought.reply,
    name: desk.name,
  });

  return { status: 200, body: await loadArmy() };
}

async function chatGroup({ text, greet }) {
  const army = await loadArmy();
  if (greet && army.group.messages.length === 0) {
    const names = army.desks.slice(0, 3).map((d) => d.name).join(", ");
    const reply = `Vi är här. ${names} lyssnar först. Fråga läget eller ge ett uppdrag. Inget går ut förrän du godkänner.`;
    await db.addConductorMessage({
      thread: "group",
      role: "agent",
      text: reply,
      name: "Alla",
    });
    return { status: 200, body: await loadArmy() };
  }

  const clean = String(text || "").trim().slice(0, 2000);
  if (clean.length < 2) return { status: 400, body: { message: "Skriv lite mer." } };
  if (!openaiReady()) {
    return { status: 503, body: { message: "OpenAI-nyckeln saknas på servern. Sätt OPENAI_API_KEY." } };
  }

  await db.addConductorMessage({ thread: "group", role: "you", text: clean });

  const roster = army.desks.map((d) => `${d.name} (${d.blurb})`).join("\n");
  const history = compactHistory(
    army.group.messages.map((m) => ({ role: m.role, text: `${m.name || m.role}: ${m.text}` }))
  );
  const obj = await openaiJson({
    system: GROUP_SYSTEM,
    user: `Anställda:\n${roster}\n\nHistorik:\n${history.map((m) => m.text).join("\n")}\n\nChef: ${clean}`,
  });

  const replies = Array.isArray(obj?.replies) ? obj.replies : [];
  const used = new Set();
  let wrote = 0;
  for (const line of replies) {
    const name = typeof line?.name === "string" ? line.name.trim() : "";
    const desk = army.desks.find((d) => d.name.toLowerCase() === name.toLowerCase());
    if (!desk || used.has(desk.id)) continue;
    used.add(desk.id);
    const body = scrub(String(line.text || "")).slice(0, 800);
    if (!body) continue;
    await db.addConductorMessage({
      thread: "group",
      deskId: desk.id,
      role: "agent",
      text: body,
      name: desk.name,
    });
    wrote += 1;
    if (wrote >= 3) break;
  }

  if (!wrote) {
    const first = army.desks[0];
    let fallback = first
      ? `${first.name} här. Vi hörde dig. Säg det igen i en mening så tar vi det.`
      : "Vi är här. Säg vad som ska göras.";
    try {
      const raw = await callResponses({
        instructions: `${GROUP_SYSTEM}\nSvara som en av de namngivna anställda, i klartext. Inte JSON.`,
        input: `Anställda:\n${roster}\n\nChef: ${clean}`,
      });
      if (raw && raw.trim()) fallback = scrub(raw).slice(0, 800);
    } catch (err) {
      console.warn("[AgentArmy] group fallback:", err.message);
    }
    await db.addConductorMessage({
      thread: "group",
      deskId: first?.id || null,
      role: "agent",
      text: fallback,
      name: first?.name || "Alla",
    });
  }

  const drafts = Array.isArray(obj?.drafts) ? obj.drafts : [];
  const ready = Boolean(obj?.ready);
  if (ready) {
    for (const raw of drafts) {
      const draft = asDraft(raw);
      if (!draft) continue;
      const owner =
        army.desks.find((d) => d.name.toLowerCase() === String(raw.name || "").toLowerCase()) ||
        army.desks[0];
      if (!owner) continue;
      await db.createConductorRule({
        deskId: owner.id,
        title: draft.title,
        trigger: draft.trigger,
        action: draft.action,
        gate: draft.gate,
      });
    }
  }

  return { status: 200, body: await loadArmy() };
}

async function hireDesk({ name, portrait, accent }) {
  const army = await loadArmy();
  const clean = String(name || "").trim().slice(0, 40);
  if (clean.length < 2) return { status: 400, body: { message: "Ge den anställda ett namn." } };
  const available = unusedFigures(army.desks.map((d) => d.portrait || 0));
  if (!available.length) return { status: 400, body: { message: "Alla figurer är upptagna." } };
  const chosen = isAgentFigure(Number(portrait)) && available.includes(Number(portrait))
    ? Number(portrait)
    : available[0];
  const desk = await db.createConductorDesk({
    key: `custom:${crypto.randomUUID()}`,
    name: clean,
    blurb: "Ny anställd. Utbilda med chatt eller referensbild.",
    portrait: chosen,
    accent: ACCENTS.includes(accent) ? accent : "ink",
    seeded: false,
  });
  return { status: 200, body: { ...(await loadArmy()), hiredId: desk.id } };
}

async function renameDesk(id, name) {
  const desk = await db.getConductorDesk(id);
  if (!desk) return { status: 404, body: { message: "Anställd hittades inte" } };
  const clean = String(name || "").trim().slice(0, 40);
  if (clean.length < 2) return { status: 400, body: { message: "Namnet är för kort." } };
  await db.updateConductorDesk(id, { name: clean });
  return { status: 200, body: await loadArmy() };
}

async function fireDesk(id) {
  const ok = await db.deleteConductorDesk(id);
  if (!ok) return { status: 400, body: { message: "Grundpersonalen kan inte raderas." } };
  return { status: 200, body: await loadArmy() };
}

function isImageMime(mime) {
  return ["image/jpeg", "image/png", "image/webp", "image/gif"].includes(mime);
}

async function extractBriefText(buf, filename) {
  const name = String(filename || "").toLowerCase();
  const head = buf.subarray(0, 5).toString("latin1");
  if (head.startsWith("%PDF") || name.endsWith(".pdf")) {
    try {
      const pdf = require("pdf-parse");
      const parsed = await pdf(buf);
      return String(parsed.text || "").replace(/\0/g, "").slice(0, 4000);
    } catch (err) {
      console.warn("[AgentArmy] pdf:", err.message);
      return "";
    }
  }
  return buf.toString("utf8").replace(/\0/g, "").slice(0, 4000);
}

async function ingestBrief(id, { filename, mime, data }) {
  const deskRow = await db.getConductorDesk(id);
  if (!deskRow) return { status: 404, body: { message: "Anställd hittades inte" } };

  const raw = String(data || "").replace(/^data:[^;]+;base64,/, "");
  let buf;
  try {
    buf = Buffer.from(raw, "base64");
  } catch {
    return { status: 400, body: { message: "Kunde inte läsa filen." } };
  }
  if (!buf.length || buf.length > 4 * 1024 * 1024) {
    return { status: 400, body: { message: "Filen är tom eller större än 4 MB." } };
  }

  const type = String(mime || "").toLowerCase();
  if (isImageMime(type)) {
    const feel =
      (await describeFeel(type, raw)) ||
      "Referens sparad. Säg ljus, färg och crop så håller jag samma känsla.";
    const saved = await db.addConductorRef({
      deskId: deskRow.id,
      kind: "ref",
      mime: type,
      imageData: raw,
      feel,
    });
    const ready = parseBriefing(deskRow.briefing).klart;
    const briefing = stampBlocks({
      existing: deskRow.briefing,
      vet: feel.slice(0, 700),
      ready,
      saknas: ready ? undefined : deskRow.briefing.trim() ? undefined : "kanal, vem godkänner, hur nästa bild ska användas",
    });
    const refs = Array.isArray(deskRow.refs_json) ? deskRow.refs_json : [];
    refs.push({ id: saved.id, kind: "ref" });
    await db.updateConductorDesk(deskRow.id, {
      briefing,
      refs_json: refs.slice(-8),
    });
    await db.addConductorMessage({
      deskId: deskRow.id,
      role: "you",
      text: "Referensbild uppladdad.",
    });
    const reply = [
      `${deskRow.name} här. Jag sparade bilden som referens. Allt jag gör efteråt ska kännas likadant.`,
      feel,
      "Klistra inte in nycklar i chatten. Säg vad bilden ska användas till. Inget går ut förrän du godkänner.",
    ].join("\n\n");
    await db.addConductorMessage({
      deskId: deskRow.id,
      role: "agent",
      text: reply,
      name: deskRow.name,
    });
    return { status: 200, body: await loadArmy() };
  }

  const extracted = await extractBriefText(buf, filename);
  if (extracted.trim().length < 12) {
    return { status: 400, body: { message: "Jag kunde inte läsa någon text ur filen." } };
  }

  const briefing = stampBlocks({
    existing: deskRow.briefing,
    jag: deskRow.briefing?.trim() ? undefined : `Uppdrag från fil: ${extracted.slice(0, 200)}`,
    vet: extracted.slice(0, 700),
    ready: false,
    saknas: "kanal, takt, röst, mål, vem godkänner",
  });
  await db.updateConductorDesk(deskRow.id, { briefing });
  await db.addConductorMessage({
    deskId: deskRow.id,
    role: "you",
    text: `Arbetsbeskrivning uppladdad (${filename || "fil"}).`,
  });

  const army = await loadArmy();
  const desk = army.desks.find((d) => d.id === deskRow.id);
  try {
    const thought = await thinkDesk({
      desk,
      text: `Utbilda dig på den här arbetsbeskrivningen:\n${extracted.slice(0, 1600)}`,
      mode: "train",
    });
    if (thought.briefing) await db.updateConductorDesk(deskRow.id, { briefing: thought.briefing });
    if (thought.blurb) await db.updateConductorDesk(deskRow.id, { blurb: thought.blurb });
    await db.addConductorMessage({
      deskId: deskRow.id,
      role: "agent",
      text: thought.reply,
      name: deskRow.name,
    });
  } catch (err) {
    await db.addConductorMessage({
      deskId: deskRow.id,
      role: "agent",
      text: `${deskRow.name} här. Filen är sparad. ${err.message || "Jag kunde inte svara just nu."}`.slice(0, 400),
      name: deskRow.name,
    });
  }
  return { status: 200, body: await loadArmy() };
}

async function patchRule(id, action) {
  const rule = await db.getConductorRule(id);
  if (!rule) return { status: 404, body: { message: "Uppdraget hittades inte" } };
  if (action === "approve") {
    await db.updateConductorRule(id, { approved: true, enabled: true });
  } else if (action === "toggle") {
    if (!rule.approved) return { status: 400, body: { message: "Godkänn först. Inget körs ändå mot kassan." } };
    await db.updateConductorRule(id, { enabled: !rule.enabled });
  } else {
    return { status: 400, body: { message: "Okänd åtgärd" } };
  }
  return { status: 200, body: await loadArmy() };
}

async function removeRule(id) {
  await db.deleteConductorRule(id);
  return { status: 200, body: await loadArmy() };
}

async function readRef(id) {
  const row = await db.getConductorRef(id);
  if (!row) return null;
  return { mime: row.mime, data: row.image_data };
}

module.exports = {
  AGENT_FIGURES,
  EVENTS,
  ACTIONS,
  ensureSeededDesks,
  loadArmy,
  chatDesk,
  chatGroup,
  hireDesk,
  renameDesk,
  fireDesk,
  ingestBrief,
  patchRule,
  removeRule,
  readRef,
  looksLikeAutomation,
};
