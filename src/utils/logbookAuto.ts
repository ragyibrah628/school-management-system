// Automatic Subject Log Book (no React, no browser APIs).
// The teacher gives the first lesson date, the last lesson date of the year, the school holidays and any removed days.
// The syllabus subtopics are spread over all teaching periods of the year, and the log book is cut at the chosen date.

import { LogRow, LogUnit, Pattern, addDays, fromIso, patternFromWeekly, toIso, weekOfMonth } from './logbookSchedule';

export interface SchoolHoliday { id: string; from: string; to: string; reason: string }
export interface RemovedDay { id: string; date: string; reason: string }

export interface LogCalendar {
  endDate: string;                       // last lesson of the year (YYYY-MM-DD)
  holidays: SchoolHoliday[];             // school holidays (ranges)
  removedDays: RemovedDay[];             // single days that are not counted (Eid, sports day ...)
  publicOn: Record<string, boolean>;     // overrides of the public holiday list (key -> counted as holiday or not)
}

export interface PublicHoliday { key: string; date: string; name: string; defaultOn: boolean }

const iso = (year: number, month: number, day: number): string => toIso(new Date(year, month - 1, day, 12, 0, 0));

// Easter Sunday (Gregorian calendar).
export function easterSunday(year: number): Date {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month - 1, day, 12, 0, 0);
}

// Public holidays that fall on the same date every year, plus Good Friday and Easter Monday.
// Eid and Maulid change every year, so the teacher adds them under "Remove a day".
export function publicHolidaysOf(year: number): PublicHoliday[] {
  const easter = easterSunday(year);
  const list: PublicHoliday[] = [
    { key: 'newyear', date: iso(year, 1, 1), name: "New Year's Day", defaultOn: true },
    { key: 'zanzibar', date: iso(year, 1, 12), name: 'Zanzibar Revolution Day', defaultOn: true },
    { key: 'goodfriday', date: toIso(addDays(easter, -2)), name: 'Good Friday', defaultOn: true },
    { key: 'easter', date: toIso(addDays(easter, 1)), name: 'Easter Monday', defaultOn: true },
    { key: 'karume', date: iso(year, 4, 7), name: 'Karume Day', defaultOn: true },
    { key: 'union', date: iso(year, 4, 26), name: 'Union Day', defaultOn: true },
    { key: 'labour', date: iso(year, 5, 1), name: "Workers' Day", defaultOn: true },
    { key: 'sabasaba', date: iso(year, 7, 7), name: 'Saba Saba', defaultOn: false },
    { key: 'nanenane', date: iso(year, 8, 8), name: 'Nane Nane (Farmers Day)', defaultOn: false },
    { key: 'nyerere', date: iso(year, 10, 14), name: 'Nyerere Day', defaultOn: true },
    { key: 'independence', date: iso(year, 12, 9), name: 'Independence Day', defaultOn: true },
    { key: 'christmas', date: iso(year, 12, 25), name: 'Christmas Day', defaultOn: true },
    { key: 'boxing', date: iso(year, 12, 26), name: 'Boxing Day', defaultOn: true }
  ];
  return list.sort((x, y) => x.date.localeCompare(y.date));
}

const isWeekend = (d: Date) => d.getDay() === 0 || d.getDay() === 6;

// Default last lesson of the year: 22 November (moved back to Friday when it falls on a weekend).
export function defaultEndDate(year: number): string {
  let d = new Date(year, 10, 22, 12, 0, 0);
  while (isWeekend(d)) d = addDays(d, -1);
  return toIso(d);
}

export const emptyCalendar = (year: number): LogCalendar => ({ endDate: defaultEndDate(year), holidays: [], removedDays: [], publicOn: {} });

// Reason why a date is not a teaching day, or '' when lessons can happen.
export function offReason(date: Date, cal: LogCalendar, publicList: PublicHoliday[], ignorePublic = false): string {
  if (isWeekend(date)) return 'Weekend';
  const key = toIso(date);
  const removed = cal.removedDays.find(r => r.date === key);
  if (removed) return removed.reason || 'Day removed';
  const holiday = cal.holidays.find(h => h.from && h.to && key >= h.from && key <= h.to);
  if (holiday) return holiday.reason || 'School holiday';
  const pub = ignorePublic ? undefined : publicList.find(p => p.date === key);
  if (pub) {
    const on = cal.publicOn[pub.key] !== undefined ? cal.publicOn[pub.key] : pub.defaultOn;
    if (on) return pub.name;
  }
  return '';
}

// Lesson days of the week (Monday..Friday) for a subject with `perWeek` periods, arranged so that the day of the
// first lesson entered by the teacher is one of the lesson days (e.g. 2 periods and a Wednesday start = Wednesday and Monday).
export function patternFromStart(perWeek: number, start: string): Pattern {
  const base = patternFromWeekly(perWeek);
  if (!start) return base;
  const d = fromIso(start);
  const startIndex = d.getDay() >= 1 && d.getDay() <= 5 ? d.getDay() - 1 : 0;
  const firstLesson = base.findIndex(v => v > 0);
  const shift = (startIndex - (firstLesson < 0 ? 0 : firstLesson) + 5) % 5;
  return base.map((_, i) => base[(i - shift + 5) % 5]);
}

// One entry per teaching period between the two dates (a day with 2 periods appears twice).
export function teachingSlots(start: string, end: string, pattern: Pattern, cal: LogCalendar): string[] {
  const slots: string[] = [];
  if (!start || !end || start > end) return slots;
  const publicList = [...publicHolidaysOf(fromIso(start).getFullYear()), ...publicHolidaysOf(fromIso(end).getFullYear())];
  let d = fromIso(start);
  const last = fromIso(end);
  let guard = 0;
  while (d.getTime() <= last.getTime() && guard++ < 800) {
    const dow = d.getDay();
    // the first lesson date typed by the teacher is always a lesson day, even when it is a public holiday
    if (dow >= 1 && dow <= 5 && !offReason(d, cal, publicList, toIso(d) === start)) {
      const n = pattern[dow - 1] || 0;
      for (let i = 0; i < n; i++) slots.push(toIso(d));
    }
    d = addDays(d, 1);
  }
  return slots;
}

// Number of teaching periods given to each subtopic. Every subtopic gets at least one period when there are enough periods,
// the rest is shared in proportion to the syllabus periods of each subtopic.
export function allocate(units: LogUnit[], slotCount: number): { a: number; b: number }[] {
  const U = units.length;
  if (U === 0 || slotCount <= 0) return [];
  if (slotCount < U) return units.map((_, i) => { const a = Math.floor((i * slotCount) / U); return { a, b: a + 1 }; });
  const total = units.reduce((sum, u) => sum + Math.max(1, u.periods), 0);
  const extra = slotCount - U;
  const out: { a: number; b: number }[] = [];
  let cumulative = 0;
  let given = 0;
  let cursor = 0;
  units.forEach(u => {
    cumulative += Math.max(1, u.periods);
    const target = Math.round((extra * cumulative) / total);
    const add = target - given;
    given = target;
    const count = 1 + add;
    out.push({ a: cursor, b: cursor + count });
    cursor += count;
  });
  return out;
}

export interface AutoPlanInput {
  units: LogUnit[];
  start: string;      // first lesson of the year
  upTo: string;       // log book is made up to this date
  today: string;      // the log book never goes beyond today
  pattern: Pattern;
  calendar: LogCalendar;
  batch: string;
}

export interface AutoPlan {
  rows: LogRow[];
  totalSlots: number;     // teaching periods in the whole year
  usedSlots: number;      // teaching periods up to the chosen date
  unitsStarted: number;
  unitsTotal: number;
  coveredPercent: number; // share of the syllabus expected to be covered at the chosen date
  until: string;          // the date the log book really stops at
  warnings: string[];
}

export function planAuto(input: AutoPlanInput): AutoPlan {
  const { units, start, today, pattern, calendar, batch } = input;
  const warnings: string[] = [];
  const end = calendar.endDate;
  let until = input.upTo;
  if (until > today) until = today;
  if (until > end) until = end;

  const empty: AutoPlan = { rows: [], totalSlots: 0, usedSlots: 0, unitsStarted: 0, unitsTotal: units.length, coveredPercent: 0, until, warnings };
  if (!start) return empty;
  if (!end) { warnings.push('Enter the last lesson date of the year.'); return empty; }
  if (start > end) { warnings.push('The first lesson date is after the last lesson date.'); return empty; }

  const slots = teachingSlots(start, end, pattern, calendar);
  if (slots.length === 0) { warnings.push('There are no teaching periods between the two dates.'); return empty; }
  if (slots.length < units.length) warnings.push(`The year has only ${slots.length} teaching periods but the syllabus has ${units.length} subtopics, so some subtopics share a date.`);

  const used = slots.filter(date => date <= until).length;
  const ranges = allocate(units, slots.length);
  const rows: LogRow[] = [];
  let parts = 0;
  let coveredParts = 0;
  const totalParts = units.reduce((sum, u) => sum + u.concepts.length, 0) || 1;

  units.forEach((unit, i) => {
    const range = ranges[i];
    if (!range || range.a >= used) return;
    const bEff = Math.min(range.b, used);
    const partial = bEff < range.b;
    const from = fromIso(slots[range.a]);
    const total = range.b - range.a;
    const done = bEff - range.a;
    const concepts = partial ? unit.concepts.slice(0, Math.max(1, Math.ceil((unit.concepts.length * done) / total))) : unit.concepts;
    parts += 1;
    coveredParts += concepts.length;
    rows.push({
      id: `${batch}-${unit.index}`,
      unitIndex: unit.index,
      topic: unit.topic,
      subtopic: unit.subtopic,
      from: slots[range.a],
      to: slots[bEff - 1],
      month: from.getMonth(),
      year: from.getFullYear(),
      week: weekOfMonth(from),
      concept: concepts.join('; '),
      batch,
      partial
    });
  });

  return {
    rows,
    totalSlots: slots.length,
    usedSlots: used,
    unitsStarted: parts,
    unitsTotal: units.length,
    coveredPercent: Math.round((coveredParts / totalParts) * 100),
    until,
    warnings
  };
}
