#!/usr/bin/env python3
"""Bygg data/book-knowledge-extended.md från data/weed-book-full-extract.txt (PDF-text)."""
from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "data" / "weed-book-full-extract.txt"
OUT = ROOT / "data" / "book-knowledge-extended.md"
CHUNK = 1800  # tecken per kapitel (öka vid behov och kör om skriptet)


def clean_book_noise(s: str) -> str:
    """Ta bort enstaka sidnummer-rader och överdriven tomrad från PDF-text."""
    s = re.sub(r"\n\s*\d{1,3}\s*\n", "\n", s)
    s = re.sub(r"\n{3,}", "\n\n", s)
    return s.strip()


def main() -> None:
    text = SRC.read_text(encoding="utf-8", errors="replace")

    # Undvik TOC-träff: första riktiga inledningen börjar med författarens öppning.
    intro_match = re.search(
        r"INLEDNING\s+Efter tretton år i hudvårdens tjänst(.*?)KAPITEL 1\s{2,}",
        text,
        flags=re.DOTALL,
    )
    intro = (
        "Efter tretton år i hudvårdens tjänst" + (intro_match.group(1) if intro_match else "")
    ).strip()
    intro = re.sub(r"\n===== PAGE \d+ =====\n", "\n\n", intro)
    intro = clean_book_noise(intro)

    slut_match = re.search(
        r"(SLUTORD:[^\n]+.*?)KÄLLFÖRTECKNING", text, flags=re.DOTALL
    )
    slut = (slut_match.group(1) if slut_match else "").strip()
    slut = re.sub(r"\n===== PAGE \d+ =====\n", "\n\n", slut)
    slut = clean_book_noise(slut)

    chap_re = re.compile(
        r"(?:^|\n)\s*(KAPITEL|Kapitel|Avsnitt)\s+(\d+)\s{2,}",
        flags=re.MULTILINE,
    )
    matches = list(chap_re.finditer(text))
    chunks: list[tuple[str, str]] = []
    for i, m in enumerate(matches):
        start = m.start()
        end = matches[i + 1].start() if i + 1 < len(matches) else len(text)
        block = text[start:end].strip()
        block = re.sub(r"\n===== PAGE \d+ =====\n", " ", block)
        block = re.sub(r"\s+", " ", block).strip()
        label = f"{m.group(1)} {m.group(2)}"
        if len(block) > CHUNK:
            block = block[:CHUNK].rsplit(" ", 1)[0] + " …"
        chunks.append((label, block))

    lines = [
        "# Bokutdrag för chatt (maskinellt från PDF)",
        "",
        "Källa: `data/weed-book-full-extract.txt` (hela boken extraherad med pypdf). "
        "PDF/OCR kan ge små fel (sammanslagna ord, sidbrytningar). "
        "Använd tillsammans med `book-knowledge.md`. För vad **1753** innehåller: endast **VERIFIERADE PRODUKTER & INCI** i huvudprompten – nämn aldrig andra råvaror som våra.",
        "",
        "## Inledning (ur boken)",
        "",
        intro,
        "",
        "## Slutord (ur boken)",
        "",
        slut,
        "",
        "## Kapitel – inledande utdrag (ca "
        + str(CHUNK)
        + " tecken vardera)",
        "",
    ]
    seen: set[tuple[str, str]] = set()
    for label, block in chunks:
        key = (label.split()[0], label.split()[1])
        if key in seen:
            continue
        seen.add(key)
        lines.append(f"### {label}")
        lines.append("")
        lines.append(block)
        lines.append("")

    OUT.write_text("\n".join(lines), encoding="utf-8")
    print(f"Wrote {OUT} ({OUT.stat().st_size} bytes), {len(seen)} kapitel-markörer")


if __name__ == "__main__":
    main()
