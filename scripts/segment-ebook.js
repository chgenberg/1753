#!/usr/bin/env node
/**
 * segment-ebook.js
 *
 * Reads "weed your glow complete 2025.pdf", splits it into chapter-level
 * segments, generates AI summaries via OpenAI GPT-5.4, and writes
 * data/ebook-segments.json for the newsletter generator.
 *
 * Usage:  OPENAI_API_KEY=sk-... node scripts/segment-ebook.js
 */

require("dotenv").config();
const fs = require("fs");
const path = require("path");
const pdfParse = require("pdf-parse");

const EBOOK_PATH = path.join(__dirname, "..", "public", "weed your glow complete 2025.pdf");
const OUTPUT_PATH = path.join(__dirname, "..", "data", "ebook-segments.json");

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
if (!OPENAI_API_KEY) {
  console.error("OPENAI_API_KEY krävs. Ange i .env eller som env-variabel.");
  process.exit(1);
}

async function callOpenAI(messages, retries = 2) {
  const fetch = (await import("node-fetch")).default;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-5.4",
          messages,
          temperature: 0.3,
          max_completion_tokens: 600,
        }),
      });
      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`OpenAI ${res.status}: ${errText}`);
      }
      const data = await res.json();
      return data.choices[0].message.content.trim();
    } catch (err) {
      if (attempt < retries) {
        console.log(`  Retry ${attempt + 1}/${retries}...`);
        await new Promise((r) => setTimeout(r, 2000 * (attempt + 1)));
      } else {
        throw err;
      }
    }
  }
}

/**
 * Parse the table of contents to extract chapter titles and page ranges,
 * then join the corresponding PDF pages for each chapter.
 *
 * TOC format (one entry per two lines):
 *   "1. Huden: En anatomisk resa ..."
 *   "7 – 14"
 */
function parseTOCAndExtract(fullText, pageTexts, totalPages) {
  const lines = fullText.split("\n");
  const tocEntries = [];

  // Scan the first ~150 lines for TOC entries
  const chapterPattern = /^(\d{1,2})\.\s+(.+)/;
  const pageRangePattern = /^(\d{1,3})\s*[–-]\s*(\d{1,3})$/;

  for (let i = 0; i < Math.min(lines.length, 150); i++) {
    const line = lines[i].trim();
    const chMatch = chapterPattern.exec(line);
    if (chMatch) {
      const num = parseInt(chMatch[1], 10);
      const nextLine = (lines[i + 1] || "").trim();
      const rangeMatch = pageRangePattern.exec(nextLine);
      if (rangeMatch) {
        tocEntries.push({
          num,
          title: line.slice(0, 120),
          startPage: parseInt(rangeMatch[1], 10),
          endPage: parseInt(rangeMatch[2], 10),
        });
      }
    }
  }

  if (tocEntries.length < 5) {
    console.log(`  Bara ${tocEntries.length} TOC-poster hittades, faller tillbaka på ordbaserad delning...`);
    return splitByWordCount(fullText);
  }

  const chapters = [];
  for (const entry of tocEntries) {
    // PDF page indices are 0-based, book pages are 1-based
    const startIdx = entry.startPage - 1;
    const endIdx = Math.min(entry.endPage - 1, totalPages - 1);
    let content = "";
    for (let p = startIdx; p <= endIdx; p++) {
      if (pageTexts[p]) content += pageTexts[p] + "\n";
    }
    content = content.trim();
    if (content.length > 200) {
      chapters.push({ title: entry.title, content });
    }
  }
  return chapters;
}

function splitByWordCount(text) {
  const words = text.split(/\s+/);
  const chunkWords = 3000;
  const chapters = [];
  for (let i = 0; i < words.length; i += chunkWords) {
    const chunk = words.slice(i, i + chunkWords).join(" ");
    if (chunk.length > 200) {
      chapters.push({
        title: `Avsnitt ${chapters.length + 1}`,
        content: chunk,
      });
    }
  }
  return chapters;
}

async function main() {
  console.log("=== E-boks-segmentering ===\n");

  if (!fs.existsSync(EBOOK_PATH)) {
    console.error(`PDF hittades inte: ${EBOOK_PATH}`);
    process.exit(1);
  }

  console.log("Läser PDF (sida för sida)...");
  const pdfBuffer = fs.readFileSync(EBOOK_PATH);
  const pageTexts = {};
  const pdfOptions = {
    pagerender: function (pageData) {
      return pageData.getTextContent().then(function (tc) {
        let text = "";
        for (const item of tc.items) {
          text += item.str;
          if (item.hasEOL) text += "\n";
        }
        pageTexts[pageData.pageIndex] = text;
        return text;
      });
    },
  };
  const pdf = await pdfParse(pdfBuffer, pdfOptions);
  console.log(`  ${pdf.numpages} sidor, ${Object.keys(pageTexts).length} sidtexter, ${pdf.text.length} tecken\n`);

  console.log("Delar upp i kapitel via innehållsförteckning...");
  const chapters = parseTOCAndExtract(pdf.text, pageTexts, pdf.numpages);
  console.log(`  Hittade ${chapters.length} segment\n`);

  const segments = [];
  for (let i = 0; i < chapters.length; i++) {
    const ch = chapters[i];
    console.log(`[${i + 1}/${chapters.length}] Sammanfattar: ${ch.title.slice(0, 60)}...`);

    const contentPreview = ch.content.slice(0, 6000);
    const summary = await callOpenAI([
      {
        role: "system",
        content:
          "Du är en expert på holistisk hudvård och endocannabinoid-systemet. " +
          "Sammanfatta följande kapitel från e-boken 'Weed Your Glow' på svenska " +
          "i max 200 ord. Fokusera på nyckelinsikter, forskningsrön och praktiska råd. " +
          "Skriv i en varm men saklig ton.",
      },
      {
        role: "user",
        content: `Kapitel: "${ch.title}"\n\n${contentPreview}`,
      },
    ]);

    segments.push({
      chapterId: i + 1,
      title: ch.title,
      summary,
      contentLength: ch.content.length,
      usedCount: 0,
      tags: [],
    });

    if (i < chapters.length - 1) {
      await new Promise((r) => setTimeout(r, 500));
    }
  }

  console.log("\nGenererar ämnestaggar...");
  for (const seg of segments) {
    try {
      const tagsRaw = await callOpenAI([
        {
          role: "system",
          content:
            "Returnera 3-5 ämnestaggar (enstaka ord eller korta fraser) på svenska " +
            "som beskriver detta kapitel. Separera med komma. Inget annat.",
        },
        {
          role: "user",
          content: `Titel: ${seg.title}\nSammanfattning: ${seg.summary}`,
        },
      ]);
      seg.tags = tagsRaw
        .split(",")
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean);
    } catch (err) {
      console.log(`  Kunde inte generera taggar för "${seg.title}": ${err.message}`);
    }
    await new Promise((r) => setTimeout(r, 300));
  }

  const outputDir = path.dirname(OUTPUT_PATH);
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(segments, null, 2), "utf-8");
  console.log(`\nKlart! ${segments.length} segment sparade i ${OUTPUT_PATH}`);
}

main().catch((err) => {
  console.error("Fel:", err);
  process.exit(1);
});
