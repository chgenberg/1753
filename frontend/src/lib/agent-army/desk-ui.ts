export const AGENT_SEATS = 7;
export const AGENT_FIGURES = 16;
export const RING_BASELINE = AGENT_SEATS;

export function portraitSrc(slot: number): string {
  const n = Math.min(AGENT_FIGURES, Math.max(1, Math.round(slot) || 1));
  return `/Agenter/Agent${n}.png`;
}

export function isAgentFigure(n: number): boolean {
  return Number.isInteger(n) && n >= 1 && n <= AGENT_FIGURES;
}

export function unusedFigures(used: Iterable<number>): number[] {
  const taken = new Set(Array.from(used).filter(isAgentFigure));
  return Array.from({ length: AGENT_FIGURES }, (_, i) => i + 1).filter((n) => !taken.has(n));
}

export function hireFigures(used: Iterable<number>): number[] {
  return unusedFigures(used);
}

export function ringScale(count: number): number {
  const n = Math.max(1, count);
  if (n <= RING_BASELINE) return 1;
  return Math.max(0.52, RING_BASELINE / n);
}

export function ringRadiusPct(count: number): number {
  const n = Math.max(1, count);
  if (n <= RING_BASELINE) return 40;
  return Math.min(44, 40 + (n - RING_BASELINE) * 0.35);
}

export function seatStyle(index: number, count: number): { left: string; top: string } {
  const n = Math.max(1, count);
  const angle = (index / n) * 2 * Math.PI - Math.PI / 2;
  const r = ringRadiusPct(n);
  return { left: `${50 + r * Math.cos(angle)}%`, top: `${50 + r * Math.sin(angle)}%` };
}

export function ringBoxRem(count: number): { base: number; sm: number } {
  const s = ringScale(count);
  return { base: 6.2 * s, sm: 7.6 * s };
}

export function ringColRem(count: number): { base: number; sm: number } {
  const s = ringScale(count);
  return { base: 6.8 * s, sm: 8.2 * s };
}
