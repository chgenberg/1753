export type BriefingBlocks = {
  jag: string;
  gor: string;
  vet: string;
  saknas: string;
  lardom: string[];
  klart: boolean;
};

function section(raw: string, name: string): string {
  const re = new RegExp(
    `(?:^|\\n)${name}:\\s*([\\s\\S]*?)(?=\\n(?:JAG|GÖR|GOR|VET|SAKNAS|LÄRDOM|LARDOM|KLART):|$)`,
    "i",
  );
  const m = raw.match(re);
  return m?.[1]?.trim() ?? "";
}

export function parseBriefing(raw: string | null | undefined): BriefingBlocks {
  const t = raw?.trim() ?? "";
  if (!t) {
    return { jag: "", gor: "", vet: "", saknas: "", lardom: [], klart: false };
  }
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
