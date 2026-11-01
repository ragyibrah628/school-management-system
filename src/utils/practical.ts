export const THEORY_MAX = 100;
export const PRACTICAL_MAX = 50;
export const TOTAL_MAX = 150;

export function classLevel(className: string): number | null {
  const normalized = String(className || '').normalize('NFKC').trim().toUpperCase();
  const match = normalized.match(/^FORM[\s-]*(IV|III|II|I|[1-4])(?:[\s-]*(?:STREAM[\s-]*)?[A-Z]+)?$/);
  if (!match) return null;
  const level = match[1];
  if (/^[1-4]$/.test(level)) return Number(level);
  return ({ I: 1, II: 2, III: 3, IV: 4 })[level] ?? null;
}

export function isPracticalSubject(subjectName: string): boolean {
  const normalized = String(subjectName || '').normalize('NFKC').trim().replace(/\s+/g, ' ').toLowerCase();
  return ['physics', 'chemistry', 'biology', 'computer science'].includes(normalized);
}

export function practicalModeFromScores(scores: { score?: number | string | null; practical_score?: number | string | null }[]): boolean | null {
  if (scores.some(score => score.practical_score != null)) return true;
  if (scores.some(score => score.score != null && score.score !== '')) return false;
  return null;
}

export function practicalFinalPercentage(theory: number, practical: number): number {
  return Math.round(((theory + practical) / TOTAL_MAX) * 1000) / 10;
}
