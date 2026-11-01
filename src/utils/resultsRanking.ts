export type RankedResultRow<T> = T & {
  student: string;
  cls: string;
  avg: number;
  hasResults: boolean;
  rank: number | '-';
  rankedClassTotal: number;
};

function roundedAverage(value: number, decimals: number): number {
  return Number(value.toFixed(decimals));
}

export function rankResultsByAverage<T extends {
  student: string;
  cls: string;
  avg: number;
  hasResults: boolean;
}>(rows: T[], decimals = 1): RankedResultRow<T>[] {
  const sorted = [...rows].sort((left, right) =>
    left.cls.localeCompare(right.cls, undefined, { sensitivity: 'base' }) ||
    Number(right.hasResults) - Number(left.hasResults) ||
    (left.hasResults && right.hasResults
      ? roundedAverage(right.avg, decimals) - roundedAverage(left.avg, decimals)
      : 0) ||
    left.student.normalize('NFKC').trim().replace(/\s+/g, ' ').localeCompare(
      right.student.normalize('NFKC').trim().replace(/\s+/g, ' '),
      undefined,
      { sensitivity: 'base', usage: 'sort' }
    )
  );

  const ranked: RankedResultRow<T>[] = [];
  const classRows = new Map<string, RankedResultRow<T>[]>();
  for (const row of sorted) {
    const rankedRow = { ...row, rank: '-' as number | '-', rankedClassTotal: 0 };
    ranked.push(rankedRow);
    const key = row.cls.toLowerCase();
    const group = classRows.get(key) || [];
    group.push(rankedRow);
    classRows.set(key, group);
  }

  for (const group of classRows.values()) {
    const eligibleCount = group.filter(row => row.hasResults).length;
    let previousAverage: number | null = null;
    let currentRank = 0;
    let seen = 0;
    for (const row of group) {
      if (!row.hasResults) continue;
      seen += 1;
      const average = roundedAverage(row.avg, decimals);
      if (previousAverage === null || average !== previousAverage) currentRank = seen;
      row.rank = currentRank;
      previousAverage = average;
    }
    for (const row of group) {
      row.rankedClassTotal = eligibleCount;
    }
  }
  return ranked;
}
