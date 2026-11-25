// Pure scheduling helpers for the Subject Log Book (no React, no browser APIs).
// Working days are Monday-Friday only; weekends are never counted.

export interface LogUnit {
  index: number;
  topic: string;
  subtopic: string;
  periods: number;     // number of 40-minute periods the syllabus gives this subtopic
  concepts: string[];  // lesson parts of the subtopic (used as "Concept covered")
}

export interface LogRow {
  id: string;
  unitIndex: number;
  topic: string;
  subtopic: string;
  from: string;        // YYYY-MM-DD
  to: string;          // YYYY-MM-DD
  month: number;       // 0-11 (month of the FROM date)
  year: number;
  week: number;        // 1-4 (week of the month of the FROM date)
  concept: string;
  batch: string;       // rows saved together can be undone together
}

export type Pattern = number[]; // periods on Monday..Friday

export const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export const toIso = (d: Date): string => {
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
};
export const fromIso = (s: string): Date => {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d, 12, 0, 0);
};
export const addDays = (d: Date, n: number): Date => {
  const r = new Date(d.getFullYear(), d.getMonth(), d.getDate() + n, 12, 0, 0);
  return r;
};
const isWeekday = (d: Date) => d.getDay() >= 1 && d.getDay() <= 5;
export const mondayOf = (d: Date): Date => {
  const dow = d.getDay() === 0 ? 7 : d.getDay();
  return addDays(d, 1 - dow);
};
export const formatDisplayDate = (iso: string): string => {
  const d = fromIso(iso);
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
};

// First working day of a month.
export const firstWeekday = (year: number, month: number): Date => {
  let d = new Date(year, month, 1, 12, 0, 0);
  while (!isWeekday(d)) d = addDays(d, 1);
  return d;
};
// Monday of week 1 of a month (the week that contains the first working day).
const weekOneMonday = (year: number, month: number): Date => mondayOf(firstWeekday(year, month));

export const weekMonday = (year: number, month: number, week: number): Date =>
  addDays(weekOneMonday(year, month), (week - 1) * 7);

// Week number (1-4) inside the month of the given date. A fifth week counts as week 4.
export const weekOfMonth = (d: Date): number => {
  const base = weekOneMonday(d.getFullYear(), d.getMonth());
  const diff = Math.round((mondayOf(d).getTime() - base.getTime()) / (7 * 86400000));
  return Math.min(4, Math.max(1, diff + 1));
};

// Weeks (1-4) of a month in which teaching can still start, i.e. that end after the last recorded date.
export const availableWeeks = (year: number, month: number, lastEnd: string | null): number[] => {
  const result: number[] = [];
  for (let week = 1; week <= 4; week++) {
    const friday = addDays(weekMonday(year, month, week), 4);
    if (!lastEnd || friday.getTime() > fromIso(lastEnd).getTime()) result.push(week);
  }
  return result;
};

// First working day on/after the selected week (week 1 starts at the first working day of the month).
export const weekStartDay = (year: number, month: number, week: number): Date => {
  let d = weekMonday(year, month, week);
  const first = firstWeekday(year, month);
  if (week === 1 && d.getTime() < first.getTime()) d = first;
  return d;
};

const periodsOn = (d: Date, pattern: Pattern): number => (isWeekday(d) ? (pattern[d.getDay() - 1] || 0) : 0);

// Dates of the next `count` periods, starting on or after `start`.
export function slotsForward(start: Date, count: number, pattern: Pattern): Date[] {
  const slots: Date[] = [];
  let d = start;
  let guard = 0;
  while (slots.length < count && guard++ < 4000) {
    const n = periodsOn(d, pattern);
    for (let i = 0; i < n && slots.length < count; i++) slots.push(d);
    d = addDays(d, 1);
  }
  return slots;
}

// Dates of the `count` periods that come before `beforeDay` (exclusive), oldest first.
export function slotsBackward(beforeDay: Date, count: number, pattern: Pattern): Date[] {
  const slots: Date[] = [];
  let d = addDays(beforeDay, -1);
  let guard = 0;
  while (slots.length < count && guard++ < 4000) {
    const n = periodsOn(d, pattern);
    for (let i = 0; i < n && slots.length < count; i++) slots.unshift(d);
    d = addDays(d, -1);
  }
  return slots;
}

export function patternFromWeekly(perWeek: number): Pattern {
  const base: Record<number, Pattern> = {
    1: [1, 0, 0, 0, 0], 2: [1, 0, 0, 1, 0], 3: [1, 0, 1, 0, 1], 4: [1, 1, 0, 1, 1], 5: [1, 1, 1, 1, 1]
  };
  if (perWeek <= 0) return base[2];
  if (perWeek <= 5) return base[perWeek];
  const extra = perWeek - 5;
  return [1, 1, 1, 1, 1].map((v, i) => v + (i < extra ? 1 : 0));
}

// Group lesson parts (one part = one period) into subtopics, keeping syllabus order.
export function buildUnits(parts: { topic: string; subtopic: string; part: string }[]): LogUnit[] {
  const map = new Map<string, LogUnit>();
  parts.forEach(p => {
    const key = `${p.topic}\u0000${p.subtopic}`;
    let unit = map.get(key);
    if (!unit) {
      unit = { index: map.size, topic: p.topic, subtopic: p.subtopic, periods: 0, concepts: [] };
      map.set(key, unit);
    }
    unit.periods += 1;
    unit.concepts.push(p.part);
  });
  return [...map.values()];
}

export interface PlanInput {
  units: LogUnit[];
  lastIndex: number;          // index of the last recorded subtopic (-1 = nothing recorded yet)
  lastEnd: string | null;     // date the last recorded subtopic ended
  anchorIndex: number;        // subtopic the teacher selected
  year: number;
  month: number;
  week: number;
  pattern: Pattern;
  batch: string;
}

// The selected subtopic starts in the selected week. Subtopics skipped since the last entry are filled in
// right before it (or right after the last recorded date when there is not enough room before).
export function planFill(input: PlanInput): LogRow[] {
  const { units, lastIndex, lastEnd, anchorIndex, year, month, week, pattern, batch } = input;
  if (anchorIndex <= lastIndex || anchorIndex >= units.length) return [];

  const rows: LogRow[] = [];
  const addRow = (unit: LogUnit, dates: Date[]) => {
    const from = dates[0];
    const to = dates[dates.length - 1];
    rows.push({
      id: `${batch}-${unit.index}`,
      unitIndex: unit.index,
      topic: unit.topic,
      subtopic: unit.subtopic,
      from: toIso(from),
      to: toIso(to),
      month: from.getMonth(),
      year: from.getFullYear(),
      week: weekOfMonth(from),
      concept: unit.concepts.join('; '),
      batch
    });
  };

  const missing = units.slice(lastIndex + 1, anchorIndex);
  const missingPeriods = missing.reduce((sum, unit) => sum + unit.periods, 0);
  const prevEndDate = lastEnd ? fromIso(lastEnd) : null;

  let anchorStart = weekStartDay(year, month, week);
  if (prevEndDate && anchorStart.getTime() <= prevEndDate.getTime()) anchorStart = addDays(prevEndDate, 1);
  // anchor starts on a working day with lessons
  anchorStart = slotsForward(anchorStart, 1, pattern)[0] || anchorStart;

  let backfill: Date[] = missingPeriods > 0 ? slotsBackward(anchorStart, missingPeriods, pattern) : [];
  if (missingPeriods > 0 && prevEndDate && backfill.length && backfill[0].getTime() <= prevEndDate.getTime()) {
    backfill = slotsForward(addDays(prevEndDate, 1), missingPeriods, pattern);
    const lastBackfill = backfill[backfill.length - 1];
    if (lastBackfill.getTime() >= anchorStart.getTime()) {
      anchorStart = slotsForward(addDays(lastBackfill, 1), 1, pattern)[0] || anchorStart;
    }
  }

  let cursor = 0;
  missing.forEach(unit => {
    const dates = backfill.slice(cursor, cursor + unit.periods);
    cursor += unit.periods;
    if (dates.length) addRow(unit, dates);
  });

  const anchorUnit = units[anchorIndex];
  const anchorDates = slotsForward(anchorStart, anchorUnit.periods, pattern);
  if (anchorDates.length) addRow(anchorUnit, anchorDates);
  return rows;
}

// Months of a year in which at least one week is still available.
export const availableMonths = (year: number, lastEnd: string | null): number[] =>
  Array.from({ length: 12 }, (_, m) => m).filter(m => availableWeeks(year, m, lastEnd).length > 0);
