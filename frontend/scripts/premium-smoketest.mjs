#!/usr/bin/env node
/* eslint-disable no-console */
/**
 * Smoketest för premium-hudanalysens preview + PDF.
 *
 * 1. Startar Chromium via Playwright
 * 2. Navigerar till http://localhost:3737/sv/hudanalys-premium/preview
 * 3. Tar skärmdumpar av varje sektion
 * 4. Klickar "Ladda ner PDF" och fångar PDF:en
 * 5. Renderar PDF-sidor som PNG via pdftoppm
 * 6. Skriver ut summary
 *
 * Output:
 *   docs/smoketest/page-XX.png      (UI-skärmdumpar)
 *   docs/smoketest/full-page.png    (hela sidan)
 *   docs/smoketest/report.pdf       (genererad PDF)
 *   docs/smoketest/pdf-page-XX.png  (PDF-sidor som bilder)
 */

import { chromium } from "playwright";
import { mkdir, rm } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, resolve } from "node:path";
import { spawn } from "node:child_process";

const URL = process.env.SMOKETEST_URL || "http://localhost:3737/sv/hudanalys-premium/preview";
const OUT_DIR = resolve(process.cwd(), "../docs/smoketest");
const VIEWPORT = { width: 1440, height: 900 };

async function main() {
  console.log(`[smoketest] Output dir: ${OUT_DIR}`);
  if (existsSync(OUT_DIR)) await rm(OUT_DIR, { recursive: true, force: true });
  await mkdir(OUT_DIR, { recursive: true });

  console.log(`[smoketest] Launching Chromium...`);
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({
    viewport: VIEWPORT,
    deviceScaleFactor: 2,
    acceptDownloads: true,
  });
  const page = await ctx.newPage();

  console.log(`[smoketest] Navigating to ${URL}`);
  const resp = await page.goto(URL, { waitUntil: "networkidle", timeout: 30000 });
  if (!resp || !resp.ok()) {
    console.error(`[smoketest] Failed to load page: ${resp?.status()}`);
    await browser.close();
    process.exit(1);
  }

  // Wait for radar-chart (recharts) to render
  await page.waitForTimeout(2000);

  // 1. Full-page screenshot
  console.log(`[smoketest] Taking full-page screenshot...`);
  await page.screenshot({
    path: join(OUT_DIR, "full-page.png"),
    fullPage: true,
  });

  // 2. Section-by-section screenshots (10 viewport-höga slices)
  const totalH = await page.evaluate(() => document.body.scrollHeight);
  const slices = Math.ceil(totalH / VIEWPORT.height);
  console.log(`[smoketest] Page height = ${totalH}px → ${slices} sections`);
  for (let i = 0; i < slices; i++) {
    await page.evaluate((y) => window.scrollTo(0, y), i * VIEWPORT.height);
    await page.waitForTimeout(300);
    const idx = String(i + 1).padStart(2, "0");
    await page.screenshot({
      path: join(OUT_DIR, `page-${idx}.png`),
      fullPage: false,
    });
    console.log(`[smoketest]   page-${idx}.png`);
  }

  // 3. Trigger PDF download – scroll to top first
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(400);
  console.log(`[smoketest] Clicking "Ladda ner PDF"...`);
  const downloadPromise = page.waitForEvent("download", { timeout: 30000 });
  await page.getByRole("button", { name: /Ladda ner PDF/i }).first().click();
  const download = await downloadPromise;
  const pdfPath = join(OUT_DIR, "report.pdf");
  await download.saveAs(pdfPath);
  console.log(`[smoketest] PDF saved: ${pdfPath}`);

  await browser.close();

  // 4. Render PDF pages as PNG using pdftoppm
  console.log(`[smoketest] Converting PDF pages to PNG via pdftoppm...`);
  await runCmd("pdftoppm", [
    "-png",
    "-r",
    "150",
    pdfPath,
    join(OUT_DIR, "pdf-page"),
  ]);

  // 5. Summary
  const { readdir, stat } = await import("node:fs/promises");
  const files = await readdir(OUT_DIR);
  const pdfPages = files.filter((f) => /^pdf-page-\d+\.png$/.test(f)).sort();
  const uiPages = files.filter((f) => /^page-\d+\.png$/.test(f)).sort();
  const pdfStat = await stat(pdfPath);
  console.log("\n=== SMOKETEST SUMMARY ===");
  console.log(`UI screenshots: ${uiPages.length}`);
  console.log(`PDF size:       ${(pdfStat.size / 1024).toFixed(1)} kB`);
  console.log(`PDF pages:      ${pdfPages.length}`);
  console.log(`Output dir:     ${OUT_DIR}`);
  console.log(`First UI shot:  ${join(OUT_DIR, uiPages[0])}`);
  console.log(`Full page:      ${join(OUT_DIR, "full-page.png")}`);
  console.log(`First PDF page: ${join(OUT_DIR, pdfPages[0])}`);
}

function runCmd(cmd, args) {
  return new Promise((resolveP, rejectP) => {
    const proc = spawn(cmd, args, { stdio: "inherit" });
    proc.on("exit", (code) =>
      code === 0 ? resolveP() : rejectP(new Error(`${cmd} exited ${code}`))
    );
  });
}

main().catch((err) => {
  console.error("[smoketest] failed:", err);
  process.exit(1);
});
