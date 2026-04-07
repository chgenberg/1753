/**
 * 1753 SKINCARE – Automated Persona QA Testing
 *
 * 10 fictional personas navigate the site in Chromium, collecting:
 *   - Console errors, network errors (404/500)
 *   - Broken images
 *   - Accessibility violations (axe-core WCAG 2.1 AA)
 *   - Page load times
 *   - Screenshots (desktop + mobile)
 *   - Link validation
 *
 * Runs in a continuous loop against both localhost and production.
 * Press Ctrl+C to stop.
 *
 * Usage:  node tests/persona-test.mjs
 */

import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ─── Configuration ──────────────────────────────────────────────────────────

const TARGETS = [
  { name: "localhost", url: "http://localhost:3002" },
  { name: "produktion", url: "https://1753-frontend-production.up.railway.app" },
];

const VIEWPORTS = {
  desktop: { width: 1440, height: 900 },
  mobile: { width: 390, height: 844 },
};

const SLOW_PAGE_MS = 2000;
const PAGE_TIMEOUT = 15000;
const WAIT_BETWEEN_PAGES = 800;
const WAIT_BETWEEN_ROUNDS = 60000;

// ─── Personas ───────────────────────────────────────────────────────────────

const PERSONAS = [
  {
    name: "Anna, 28",
    profile: "Instagramvan, impulsköpare",
    viewport: "both",
    journey: [
      { action: "goto", path: "/" },
      { action: "goto", path: "/produkter" },
      { action: "goto", path: "/produkter/ta-da-serum" },
      { action: "click", selector: 'button:has-text("Lägg i varukorg")', optional: true },
      { action: "click", selector: 'button:has-text("+")', optional: true },
      { action: "goto", path: "/kassa" },
    ],
  },
  {
    name: "Erik, 52",
    profile: "Skeptisk, läser allt",
    viewport: "desktop",
    journey: [
      { action: "goto", path: "/" },
      { action: "scroll", amount: 3000 },
      { action: "goto", path: "/om-oss" },
      { action: "scroll", amount: 2000 },
      { action: "goto", path: "/produkter" },
      { action: "goto", path: "/produkter/the-one-facial-oil" },
      { action: "scroll", amount: 1500 },
      { action: "goto", path: "/kontakt" },
    ],
  },
  {
    name: "Maja, 19",
    profile: "Mobil-first, snabb",
    viewport: "mobile",
    journey: [
      { action: "goto", path: "/produkter" },
      { action: "goto", path: "/produkter/duo-kit" },
      { action: "click", selector: 'button:has-text("Lägg i varukorg")', optional: true },
      { action: "goto", path: "/kassa" },
      { action: "fillForm", fields: { name: "", email: "invalid" }, expectError: true },
    ],
  },
  {
    name: "Lars, 67",
    profile: "Senior, tillgänglighetsfokus",
    viewport: "desktop",
    journey: [
      { action: "goto", path: "/" },
      { action: "tabNavigation", count: 15 },
      { action: "goto", path: "/produkter" },
      { action: "tabNavigation", count: 10 },
      { action: "goto", path: "/produkter/the-one-facial-oil" },
      { action: "goto", path: "/logga-in" },
      { action: "tabNavigation", count: 8 },
    ],
  },
  {
    name: "Sofia, 35",
    profile: "Hudanalys-nyfiken mamma",
    viewport: "both",
    journey: [
      { action: "goto", path: "/" },
      { action: "scroll", amount: 2000 },
      { action: "goto", path: "/hudanalys" },
      { action: "scroll", amount: 1000 },
      { action: "goto", path: "/produkter" },
      { action: "goto", path: "/produkter/i-love-facial-oil" },
    ],
  },
  {
    name: "Omar, 41",
    profile: "Teknikintresserad, testar auth",
    viewport: "desktop",
    journey: [
      { action: "goto", path: "/registrera" },
      { action: "fillForm", fields: { name: "", email: "", password: "" }, expectError: true },
      { action: "goto", path: "/logga-in" },
      { action: "fillForm", fields: { email: "test@test.com", password: "wrong" }, expectError: true },
      { action: "goto", path: "/mitt-konto" },
      { action: "goto", path: "/logga-in" },
    ],
  },
  {
    name: "Linnea, 24",
    profile: "Student, prismedveten",
    viewport: "mobile",
    journey: [
      { action: "goto", path: "/produkter" },
      { action: "goto", path: "/produkter/au-naturel-makeup-remover" },
      { action: "click", selector: 'button:has-text("Lägg i varukorg")', optional: true },
      { action: "goto", path: "/produkter/ta-da-serum" },
      { action: "click", selector: 'button:has-text("Lägg i varukorg")', optional: true },
      { action: "goto", path: "/kassa" },
    ],
  },
  {
    name: "Karin, 55",
    profile: "Lojal kund, återkommande",
    viewport: "desktop",
    journey: [
      { action: "goto", path: "/logga-in" },
      { action: "goto", path: "/mitt-konto" },
      { action: "goto", path: "/produkter/duo-ta-da" },
      { action: "scroll", amount: 1500 },
      { action: "goto", path: "/villkor" },
      { action: "goto", path: "/integritetspolicy" },
    ],
  },
  {
    name: "Felix, 31",
    profile: "Förstagångsbesökare, googlade CBD",
    viewport: "both",
    journey: [
      { action: "goto", path: "/" },
      { action: "scroll", amount: 5000 },
      { action: "goto", path: "/produkter" },
      { action: "scroll", amount: 2000 },
      { action: "goto", path: "/produkter/fungtastic-mushroom-extract" },
      { action: "goto", path: "/om-oss" },
      { action: "scroll", amount: 1500 },
    ],
  },
  {
    name: "Astrid, 45",
    profile: "Random-klickare, testar allt",
    viewport: "both",
    journey: [
      { action: "goto", path: "/" },
      { action: "goto", path: "/produkter" },
      { action: "goto", path: "/produkter/duo-kit" },
      { action: "goto", path: "/om-oss" },
      { action: "goto", path: "/kontakt" },
      { action: "goto", path: "/hudanalys" },
      { action: "goto", path: "/logga-in" },
      { action: "goto", path: "/registrera" },
      { action: "goto", path: "/kassa" },
      { action: "goto", path: "/en-sida-som-inte-finns" },
      { action: "goto", path: "/villkor" },
      { action: "goto", path: "/integritetspolicy" },
    ],
  },
];

// ─── Helpers ────────────────────────────────────────────────────────────────

function ts() {
  return new Date().toISOString().replace("T", " ").slice(0, 19);
}

function log(msg) {
  const line = `[${ts()}] ${msg}`;
  console.log(line);
  return line;
}

function slug(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+$/, "");
}

// ─── Page Analyzer ──────────────────────────────────────────────────────────

async function analyzePage(page, pageUrl, personaName, viewportName) {
  const findings = {
    url: pageUrl,
    persona: personaName,
    viewport: viewportName,
    consoleErrors: [],
    networkErrors: [],
    brokenImages: [],
    a11yViolations: [],
    loadTimeMs: 0,
    linkCount: 0,
    deadLinks: [],
  };

  try {
    const perf = await page.evaluate(() => {
      const nav = performance.getEntriesByType("navigation")[0];
      return nav ? Math.round(nav.loadEventEnd - nav.startTime) : 0;
    });
    findings.loadTimeMs = perf;
  } catch { /* ignore */ }

  // Broken images
  try {
    const brokenImgs = await page.evaluate(() => {
      return Array.from(document.querySelectorAll("img"))
        .filter((img) => img.complete && img.naturalWidth === 0 && img.src)
        .map((img) => img.src);
    });
    findings.brokenImages = brokenImgs;
  } catch { /* ignore */ }

  // A11y with axe-core
  try {
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    findings.a11yViolations = results.violations.map((v) => ({
      id: v.id,
      impact: v.impact,
      description: v.description,
      nodes: v.nodes.length,
    }));
  } catch { /* ignore if axe fails */ }

  // Validate links on page
  try {
    const links = await page.evaluate(() => {
      return Array.from(document.querySelectorAll("a[href]"))
        .map((a) => a.href)
        .filter((h) => h.startsWith("http"));
    });
    findings.linkCount = links.length;

    const uniqueInternal = [...new Set(
      links.filter((l) => {
        try {
          const u = new URL(l);
          return u.origin === new URL(document.location.href).origin;
        } catch { return false; }
      })
    )];

    // Only test a sample of internal links (max 5 per page for speed)
    for (const link of uniqueInternal.slice(0, 5)) {
      try {
        const res = await page.request.get(link, { timeout: 5000 });
        if (res.status() >= 400) {
          findings.deadLinks.push({ url: link, status: res.status() });
        }
      } catch {
        findings.deadLinks.push({ url: link, status: "timeout" });
      }
    }
  } catch { /* ignore */ }

  return findings;
}

// ─── Journey Runner ─────────────────────────────────────────────────────────

async function runJourney(context, page, persona, baseUrl, viewportName, roundDir) {
  const findings = [];
  const consoleErrors = [];
  const networkErrors = [];

  const IGNORED_CONSOLE = [
    "Access to fetch",
    "net::ERR_FAILED",
    "CORS",
  ];

  page.on("console", (msg) => {
    if (msg.type() === "error") {
      const text = msg.text();
      if (IGNORED_CONSOLE.some((p) => text.includes(p))) return;
      consoleErrors.push({ url: page.url(), message: text });
    }
  });

  page.on("pageerror", (err) => {
    consoleErrors.push({ url: page.url(), message: err.message });
  });

  page.on("response", (res) => {
    const url = res.url();
    if (res.status() >= 400 && !url.includes("favicon") && !url.includes("/api/auth")) {
      networkErrors.push({ url, status: res.status() });
    }
  });

  for (const step of persona.journey) {
    try {
      switch (step.action) {
        case "goto": {
          const url = `${baseUrl}${step.path}`;
          log(`  ${persona.name} → ${step.path} [${viewportName}]`);
          await page.goto(url, { waitUntil: "domcontentloaded", timeout: PAGE_TIMEOUT });
          await page.waitForTimeout(WAIT_BETWEEN_PAGES);

          // Screenshot
          const ssName = `${slug(persona.name)}-${viewportName}-${slug(step.path || "home")}.png`;
          await page.screenshot({
            path: path.join(roundDir, ssName),
            fullPage: false,
          });

          // Analyze
          const f = await analyzePage(page, url, persona.name, viewportName);
          f.consoleErrors = [...consoleErrors];
          f.networkErrors = [...networkErrors];
          consoleErrors.length = 0;
          networkErrors.length = 0;
          findings.push(f);
          break;
        }

        case "click": {
          try {
            const el = await page.waitForSelector(step.selector, { timeout: 3000 });
            if (el) {
              await el.click();
              log(`  ${persona.name} klickade: ${step.selector}`);
              await page.waitForTimeout(500);
            }
          } catch {
            if (!step.optional) {
              findings.push({
                url: page.url(),
                persona: persona.name,
                viewport: viewportName,
                clickFailed: step.selector,
              });
            }
          }
          break;
        }

        case "scroll": {
          await page.evaluate((amount) => window.scrollBy(0, amount), step.amount);
          await page.waitForTimeout(600);
          break;
        }

        case "tabNavigation": {
          for (let i = 0; i < (step.count || 5); i++) {
            await page.keyboard.press("Tab");
            await page.waitForTimeout(150);
          }

          // Check if any focused element has visible focus ring
          const hasFocusVisible = await page.evaluate(() => {
            const el = document.activeElement;
            if (!el || el === document.body) return true;
            const styles = getComputedStyle(el);
            return styles.outlineStyle !== "none" || styles.boxShadow !== "none";
          });
          if (!hasFocusVisible) {
            findings.push({
              url: page.url(),
              persona: persona.name,
              viewport: viewportName,
              a11yViolations: [{ id: "focus-visible", impact: "serious", description: "Inget synligt fokus vid tab-navigering", nodes: 1 }],
            });
          }
          break;
        }

        case "fillForm": {
          if (step.fields.name !== undefined) {
            const nameInput = await page.$('input[type="text"], input[autocomplete="name"]');
            if (nameInput) await nameInput.fill(step.fields.name);
          }
          if (step.fields.email !== undefined) {
            const emailInput = await page.$('input[type="email"]');
            if (emailInput) await emailInput.fill(step.fields.email);
          }
          if (step.fields.password !== undefined) {
            const pwInput = await page.$('input[type="password"]');
            if (pwInput) await pwInput.fill(step.fields.password);
          }
          const submitBtn = await page.$('button[type="submit"]');
          if (submitBtn) {
            await submitBtn.click();
            await page.waitForTimeout(1500);
          }
          break;
        }
      }
    } catch (err) {
      log(`  [FEL] ${persona.name}: ${err.message?.slice(0, 100)}`);
    }
  }

  return findings;
}

// ─── Report Generator ───────────────────────────────────────────────────────

function generateReport(roundNum, allResults, startTime) {
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(0);
  const lines = [];
  lines.push(`# Persona-test omgång ${roundNum} – ${ts()}`);
  lines.push("");
  lines.push(`Körtid: ${elapsed}s`);
  lines.push("");

  // Aggregate
  let totalConsole = 0;
  let totalNetwork = 0;
  let totalA11y = 0;
  let totalBrokenImg = 0;
  let totalDeadLinks = 0;
  let totalPages = 0;
  let totalLoadTime = 0;
  const bugs = [];
  const a11yIssues = [];
  const perfIssues = [];
  const differences = [];

  for (const [targetName, personaResults] of Object.entries(allResults)) {
    for (const pResult of personaResults) {
      for (const f of pResult.findings) {
        totalPages++;
        if (f.consoleErrors?.length) {
          totalConsole += f.consoleErrors.length;
          for (const e of f.consoleErrors) {
            bugs.push(`[KONSOLFEL] ${targetName} – ${f.persona} – ${e.url}: ${e.message?.slice(0, 120)}`);
          }
        }
        if (f.networkErrors?.length) {
          totalNetwork += f.networkErrors.length;
          for (const e of f.networkErrors) {
            bugs.push(`[NÄTVERKSFEL ${e.status}] ${targetName} – ${f.persona} – ${e.url}`);
          }
        }
        if (f.brokenImages?.length) {
          totalBrokenImg += f.brokenImages.length;
          for (const img of f.brokenImages) {
            bugs.push(`[TRASIG BILD] ${targetName} – ${f.persona} – ${f.url}: ${img}`);
          }
        }
        if (f.deadLinks?.length) {
          totalDeadLinks += f.deadLinks.length;
          for (const l of f.deadLinks) {
            bugs.push(`[DÖD LÄNK ${l.status}] ${targetName} – ${f.persona} – ${l.url}`);
          }
        }
        if (f.a11yViolations?.length) {
          totalA11y += f.a11yViolations.length;
          for (const v of f.a11yViolations) {
            a11yIssues.push(`[${v.impact?.toUpperCase()}] ${targetName} – ${f.persona} – ${f.url}: ${v.description} (${v.nodes} element)`);
          }
        }
        if (f.loadTimeMs > SLOW_PAGE_MS) {
          perfIssues.push(`[LÅNGSAM ${f.loadTimeMs}ms] ${targetName} – ${f.persona} – ${f.url}`);
        }
        if (f.loadTimeMs > 0) totalLoadTime += f.loadTimeMs;
        if (f.clickFailed) {
          bugs.push(`[KLICK MISSLYCKADES] ${targetName} – ${f.persona} – ${f.url}: ${f.clickFailed}`);
        }
      }
    }
  }

  // Compare localhost vs production
  const targetNames = Object.keys(allResults);
  if (targetNames.length === 2) {
    const [a, b] = targetNames;
    const errorsA = allResults[a].reduce((s, p) => s + p.findings.reduce((s2, f) => s2 + (f.consoleErrors?.length || 0) + (f.networkErrors?.length || 0), 0), 0);
    const errorsB = allResults[b].reduce((s, p) => s + p.findings.reduce((s2, f) => s2 + (f.consoleErrors?.length || 0) + (f.networkErrors?.length || 0), 0), 0);
    if (errorsA !== errorsB) {
      differences.push(`Antal fel skiljer sig: ${a} har ${errorsA}, ${b} har ${errorsB}`);
    }
    const a11yA = allResults[a].reduce((s, p) => s + p.findings.reduce((s2, f) => s2 + (f.a11yViolations?.length || 0), 0), 0);
    const a11yB = allResults[b].reduce((s, p) => s + p.findings.reduce((s2, f) => s2 + (f.a11yViolations?.length || 0), 0), 0);
    if (a11yA !== a11yB) {
      differences.push(`A11y-problem skiljer sig: ${a} har ${a11yA}, ${b} har ${a11yB}`);
    }
  }

  const avgLoad = totalPages > 0 ? Math.round(totalLoadTime / totalPages) : 0;

  lines.push("## Sammanfattning");
  lines.push("");
  lines.push(`- **${PERSONAS.length} personas**, desktop + mobil`);
  lines.push(`- **${totalPages} sidor** analyserade`);
  lines.push(`- **${totalConsole} konsolfel**, **${totalNetwork} nätverksfel**`);
  lines.push(`- **${totalBrokenImg} trasiga bilder**, **${totalDeadLinks} döda länkar**`);
  lines.push(`- **${totalA11y} tillgänglighetsproblem**`);
  lines.push(`- Genomsnittlig laddningstid: **${avgLoad}ms**`);
  lines.push("");

  if (bugs.length > 0) {
    lines.push("## Buggar");
    lines.push("");
    const unique = [...new Set(bugs)];
    unique.forEach((b, i) => lines.push(`${i + 1}. ${b}`));
    lines.push("");
  }

  if (a11yIssues.length > 0) {
    lines.push("## Tillgänglighetsproblem");
    lines.push("");
    const unique = [...new Set(a11yIssues)];
    unique.forEach((a, i) => lines.push(`${i + 1}. ${a}`));
    lines.push("");
  }

  if (perfIssues.length > 0) {
    lines.push("## Prestandaproblem");
    lines.push("");
    const unique = [...new Set(perfIssues)];
    unique.forEach((p, i) => lines.push(`${i + 1}. ${p}`));
    lines.push("");
  }

  if (differences.length > 0) {
    lines.push("## Skillnader localhost vs produktion");
    lines.push("");
    differences.forEach((d, i) => lines.push(`${i + 1}. ${d}`));
    lines.push("");
  }

  if (bugs.length === 0 && a11yIssues.length === 0 && perfIssues.length === 0) {
    lines.push("## Resultat");
    lines.push("");
    lines.push("Inga buggar, a11y-problem eller prestandaproblem hittades i denna omgång.");
    lines.push("");
  }

  return lines.join("\n");
}

// ─── Main Loop ──────────────────────────────────────────────────────────────

async function runRound(roundNum) {
  const startTime = Date.now();
  const roundTs = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
  const roundDir = path.join(__dirname, "screenshots", `round-${roundNum}-${roundTs}`);
  fs.mkdirSync(roundDir, { recursive: true });

  log(`════════════════════════════════════════════════════`);
  log(`  OMGÅNG ${roundNum} startar`);
  log(`════════════════════════════════════════════════════`);

  const allResults = {};

  for (const target of TARGETS) {
    log(`\n── ${target.name.toUpperCase()} (${target.url}) ──`);

    // Quick health check
    let reachable = false;
    try {
      const res = await fetch(target.url, { signal: AbortSignal.timeout(5000) });
      reachable = res.ok;
    } catch { /* not reachable */ }

    if (!reachable) {
      log(`  ⛔ ${target.name} nås inte – hoppar över`);
      continue;
    }

    const browser = await chromium.launch({ headless: true });
    const personaResults = [];

    for (const persona of PERSONAS) {
      const viewports = persona.viewport === "both"
        ? ["desktop", "mobile"]
        : persona.viewport === "mobile"
          ? ["mobile"]
          : ["desktop"];

      for (const vp of viewports) {
        log(`\n▸ ${persona.name} (${persona.profile}) – ${vp}`);
        const context = await browser.newContext({
          viewport: VIEWPORTS[vp],
          userAgent: vp === "mobile"
            ? "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1"
            : undefined,
        });
        const page = await context.newPage();
        page.setDefaultTimeout(PAGE_TIMEOUT);

        const findings = await runJourney(context, page, persona, target.url, vp, roundDir);
        personaResults.push({ persona: persona.name, viewport: vp, findings });

        await context.close();
      }
    }

    await browser.close();
    allResults[target.name] = personaResults;
  }

  // Generate report
  const report = generateReport(roundNum, allResults, startTime);

  // Save to file
  const reportFile = path.join(__dirname, "reports", `round-${roundNum}-${roundTs}.md`);
  fs.writeFileSync(reportFile, report, "utf-8");

  // Print to terminal
  console.log("\n" + report);
  log(`Rapport sparad: ${reportFile}`);

  return report;
}

async function main() {
  log("1753 SKINCARE – Persona QA Testsvit");
  log(`${PERSONAS.length} personas, ${TARGETS.length} mål`);
  log("Tryck Ctrl+C för att avsluta\n");

  let round = 1;
  while (true) {
    try {
      await runRound(round);
    } catch (err) {
      log(`[KRITISKT FEL] Omgång ${round}: ${err.message}`);
    }
    round++;
    log(`\nVäntar ${WAIT_BETWEEN_ROUNDS / 1000}s innan nästa omgång...\n`);
    await new Promise((r) => setTimeout(r, WAIT_BETWEEN_ROUNDS));
  }
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
