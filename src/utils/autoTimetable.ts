// Automatic timetable generator (pure functions, no React).
// Rules (from the school):
//  - lessons are 40-minute periods, Monday-Thursday 08:00 to 14:30
//  - Friday: lessons only before the morning break; from the end of the break to 14:30 is Religion
//  - before the morning break only DOUBLE periods are allowed (no single period)
//  - Mathematics doubles are placed before the morning break (Physics is free)
//  - every single (odd) period goes to the last period of the day (after the break)
//  - subjects the admin combined (e.g. PHY/HST) always share the same periods
//  - before the morning break every period is part of a double (pairs p1-p2 and p3-p4): no single, no free period
//  - at most 2 single periods per class per day (a PS period counts as a single; one is preferred), always after the break
//  - the preferred day is 4 doubles + 1 single (D D | D D S); locked cells never move
//  - every subject with 2 or more periods gets at least one double (3 = double + single)
//  - a free period first goes to the free teacher with the lightest week: ONE extra block per subject per class (a double if a pair is free, otherwise a single)
//  - if nobody can take it it becomes PS (12:30-14:30 only, max 1 per day, 4 per week); otherwise it stays empty for the admin
//  - Friday after the break is Religion
//  - doubles first: 3 periods = double + single, 5 = 2 doubles + single, 6 = 3 doubles ...
//  - at most 2 periods of one subject per class per day
//  - a teacher is never in two places at once and the teacher's lessons are spread over the 5 days
//  - periods left over in a class are filled with Religion (the admin can change them)

export const PS_FROM = '12:30';
export const PS_MAX_PER_DAY = 1;
export const PS_MAX_PER_WEEK = 4;

export interface AutoSlot { id: string; name?: string; startTime: string; endTime: string; isBreak?: boolean; isActivity?: boolean }
export interface AutoClass { id: string; name: string; level: number; roomId?: string }
export interface AutoRequirement {
  subjectId: string; subjectName: string; teacherId: string; periods: number;
  second?: { subjectId: string; subjectName: string; teacherId: string };
}
export interface AutoInput {
  classes: AutoClass[];
  requirements: Record<string, AutoRequirement[]>;
  days: string[];
  slots: AutoSlot[];
  fridayEnd?: string;
  keepCells?: Record<string, Record<string, Record<string, any>>>;
  attempts?: number;
  seed?: number;
}
export interface AutoUnplaced { classId: string; className: string; subjectName: string; periods: number }
export interface AutoResult {
  schedule: Record<string, Record<string, Record<string, any>>>;
  unplaced: AutoUnplaced[];
  splitDoubles: number;
  religionPeriods: Record<string, number>;
  psPeriods: Record<string, number>;
  emptyPeriods: Record<string, number>;
  extraPeriods: number;
  teacherDayLoad: Record<string, number[]>;
  placedPeriods: number;
}

// ---------- syllabus defaults ----------
export function defaultPeriodsPerWeek(subjectName: string, level: number): number {
  const name = String(subjectName || '').toLowerCase();
  const upper = level >= 3;
  if (name.includes('maadili') || name.includes('historia ya tanzania')) return 2;
  if (name.includes('kiswahili')) return 4;
  if (name.includes('english')) return 5;
  if (name.includes('math') || name.includes('hisabati')) return 5;
  if (name.includes('physics') || name.includes('chemistry') || name.includes('biology') || name.includes('fizikia') || name.includes('kemia') || name.includes('baiolojia')) return upper ? 4 : 3;
  if (name.includes('geograph') || name.includes('jiografia')) return 3;
  if (name.includes('history') || name.includes('historia')) return upper ? 3 : 2;
  if (name.includes('civics') || name.includes('uraia')) return 3;
  if (name.includes('business') || name.includes('biashara')) return upper ? 4 : 2;
  if (name.includes('computer') || name.includes('tehama')) return 2;
  if (name.includes('agricult') || name.includes('kilimo')) return 3;
  return 2;
}

// ---------- helpers ----------
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const isMath = (name: string) => /math|hisabati/i.test(name);

interface Block { classIdx: number; req: AutoRequirement; size: 1 | 2; priority: number; first?: boolean }

interface DayModel { day: string; lessons: string[]; pairs: [number, number][]; morning: Set<number>; last: number; religionSlots: string[] }

function buildDays(days: string[], slots: AutoSlot[], fridayEndIn?: string): DayModel[] {
  const firstBreak = slots.find(s => s.isBreak);
  const morningEnd = firstBreak ? firstBreak.startTime : '10:40';
  const fridayEnd = fridayEndIn || morningEnd;
  return days.map(day => {
    const allowed = (slot: AutoSlot) => !slot.isBreak && !slot.isActivity && (day.toLowerCase() !== 'friday' || slot.endTime <= fridayEnd);
    const lessons = slots.filter(allowed).map(s => s.id);
    const pairs: [number, number][] = [];
    for (let i = 0; i < slots.length - 1; i++) {
      if (allowed(slots[i]) && allowed(slots[i + 1])) pairs.push([lessons.indexOf(slots[i].id), lessons.indexOf(slots[i + 1].id)]);
    }
    const morning = new Set<number>();
    slots.forEach(s => { if (allowed(s) && s.endTime <= morningEnd) morning.add(lessons.indexOf(s.id)); });
    // morning doubles tile the morning exactly: p1-p2, p3-p4 (no p2-p3)
    for (let i = pairs.length - 1; i >= 0; i--) if (morning.has(pairs[i][0]) && morning.has(pairs[i][1]) && pairs[i][0] % 2 === 1) pairs.splice(i, 1);
    // Friday: every lesson period after the morning break is Religion time
    const religionSlots = day.toLowerCase() === 'friday'
      ? slots.filter(sl => !sl.isBreak && !sl.isActivity && sl.startTime >= morningEnd && !allowed(sl)).map(sl => sl.id)
      : [];
    return { day, lessons, pairs, morning, last: lessons.length - 1, religionSlots };
  });
}

interface Attempt { schedule: AutoResult['schedule']; unplaced: AutoUnplaced[]; splitDoubles: number; score: number; teacherDayLoad: Record<string, number[]>; religion: Record<string, number>; ps: Record<string, number>; empty: Record<string, number>; extra: number; placed: number }

function runAttempt(input: AutoInput, model: DayModel[], seed: number): Attempt {
  const rand = mulberry32(seed);
  const { classes, requirements, slots } = input;
  const D = model.length;
  const classOcc: Record<string, boolean[][]> = {};
  const teacherOcc: Record<string, boolean[][]> = {};
  const teacherLoad: Record<string, number[]> = {};
  const teacherTotal: Record<string, number> = {};
  const subjDay: Record<string, number[]> = {};
  const classDayCount: Record<string, number[]> = {};
  const singleDay: Record<string, number[]> = {};
  const cells: Record<string, Record<string, Record<string, any>>> = {};

  classes.forEach(c => {
    classOcc[c.id] = model.map(m => m.lessons.map(() => false));
    classDayCount[c.id] = model.map(() => 0);
    singleDay[c.id] = model.map(() => 0);
    cells[c.id] = {};
    model.forEach(m => { cells[c.id][m.day] = {}; });
  });
  const ensureTeacher = (t: string) => {
    if (!t) return;
    if (!teacherOcc[t]) { teacherOcc[t] = model.map(m => m.lessons.map(() => false)); teacherLoad[t] = model.map(() => 0); }
  };

  // total weekly load per teacher (used to place the most constrained teachers first)
  classes.forEach(c => (requirements[c.id] || []).forEach(r => {
    teacherTotal[r.teacherId] = (teacherTotal[r.teacherId] || 0) + r.periods; ensureTeacher(r.teacherId);
    if (r.second) { teacherTotal[r.second.teacherId] = (teacherTotal[r.second.teacherId] || 0) + r.periods; ensureTeacher(r.second.teacherId); }
  }));

  const key = (classId: string, subject: string) => `${classId}|${subject}`;

  // ---- locked cells (the admin pinned them): they stay exactly where they are ----
  const lockedCount: Record<string, number> = {};
  const lockedDoubles: Record<string, number> = {};
  const keptAll = input.keepCells || {};
  classes.forEach(c => model.forEach((m, d) => m.lessons.forEach((pid, idx) => {
    const cell = keptAll[c.id]?.[m.day]?.[pid];
    if (!cell || !cell.locked || cell.isActivity) return;
    cells[c.id][m.day][pid] = cell;
    classOcc[c.id][d][idx] = true;
    if (cell.isPS || cell.subjectId === 'ps') { singleDay[c.id][d]++; return; }
    if (cell.isReligion) return;
    [cell.teacherId, cell.secondTeacherId].forEach((t: string) => { if (t) { ensureTeacher(t); teacherOcc[t][d][idx] = true; teacherLoad[t][d]++; } });
    const k1 = key(c.id, cell.subjectName);
    if (!subjDay[k1]) subjDay[k1] = model.map(() => 0);
    subjDay[k1][d]++; classDayCount[c.id][d]++;
    lockedCount[k1] = (lockedCount[k1] || 0) + 1;
    if (cell.isDouble) lockedDoubles[k1] = (lockedDoubles[k1] || 0) + 1;
    if (!cell.isDouble && !cell.isDoubleSpan) singleDay[c.id][d]++;
    if (cell.isCombined && cell.secondSubjectName) {
      const k2 = key(c.id, cell.secondSubjectName);
      if (!subjDay[k2]) subjDay[k2] = model.map(() => 0);
      subjDay[k2][d]++;
    }
  })));

  const blocks: Block[] = [];
  classes.forEach((c, classIdx) => (requirements[c.id] || []).forEach(req => {
    const periods = Math.max(0, Math.round(Number(req.periods) || 0));
    const k = key(c.id, req.subjectName);
    const lp = lockedCount[k] || 0;
    const ld = lockedDoubles[k] || 0;
    const wantDoubles = Math.max(0, Math.floor(periods / 2) - ld);   // 4 = 2 doubles, 5 = 2 doubles + 1 single, 3 = 1 double + 1 single
    const remaining = Math.max(0, periods - lp);
    const doubles = Math.min(wantDoubles, Math.floor(remaining / 2));
    const single = remaining - doubles * 2;
    for (let i = 0; i < doubles; i++) blocks.push({ classIdx, req, size: 2, priority: 0, first: ld === 0 && i === 0 });
    for (let i = 0; i < single; i++) blocks.push({ classIdx, req, size: 1, priority: 0 });
  }));
  blocks.forEach(b => { b.priority = Math.max(teacherTotal[b.req.teacherId] || 0, teacherTotal[b.req.second?.teacherId || ''] || 0) + (b.req.second ? 8 : 0) + rand() * 6; });

  const unplaced: AutoUnplaced[] = [];
  let splitDoubles = 0;
  let placedPeriods = 0;
  let score = 0;


  const place = (b: Block, d: number, idx: number, size: number) => {
    const cls = classes[b.classIdx];
    const t = b.req.teacherId;
    const t2 = b.req.second?.teacherId || '';
    ensureTeacher(t);
    ensureTeacher(t2);
    const k = key(cls.id, b.req.subjectName);
    if (!subjDay[k]) subjDay[k] = model.map(() => 0);
    for (let j = 0; j < size; j++) {
      classOcc[cls.id][d][idx + j] = true;
      teacherOcc[t][d][idx + j] = true;
      if (t2) teacherOcc[t2][d][idx + j] = true;
    }
    teacherLoad[t][d] += size;
    if (t2) teacherLoad[t2][d] += size;
    subjDay[k][d] += size;
    classDayCount[cls.id][d] += size;
    if (size === 1) singleDay[cls.id][d]++;
    const first = model[d].lessons[idx];
    const base: any = { subjectId: b.req.subjectId, subjectName: b.req.subjectName, teacherId: t, roomId: cls.roomId || '', classId: cls.id, isDouble: false, isDoubleSpan: false };
    if (b.req.second) Object.assign(base, { isCombined: true, secondSubjectId: b.req.second.subjectId, secondSubjectName: b.req.second.subjectName, secondTeacherId: t2 });
    if (size === 2) {
      cells[cls.id][model[d].day][first] = { ...base, isDouble: true };
      cells[cls.id][model[d].day][model[d].lessons[idx + 1]] = { ...base, isDoubleSpan: true };
    } else {
      cells[cls.id][model[d].day][first] = base;
    }
    placedPeriods += size;
  };

  const candidates = (b: Block, size: 1 | 2, relaxMorning: boolean) => {
    const cls = classes[b.classIdx];
    const t = b.req.teacherId;
    const t2 = b.req.second?.teacherId || '';
    ensureTeacher(t);
    ensureTeacher(t2);
    const k = key(cls.id, b.req.subjectName);
    const sd = subjDay[k] || model.map(() => 0);
    const mathPhys = isMath(b.req.subjectName) || isMath(b.req.second?.subjectName || '');
    const out: { d: number; idx: number; cost: number }[] = [];
    const avgLoad = (teacherTotal[t] || 0) / D;
    for (let d = 0; d < D; d++) {
      const m = model[d];
      if (sd[d] + size > 2) continue;
      const options: number[] = size === 1 ? m.lessons.map((_, i) => i) : m.pairs.map(p => p[0]);
      for (const idx of options) {
        let free = true;
        for (let j = 0; j < size; j++) {
          if (classOcc[cls.id][d][idx + j] || teacherOcc[t][d][idx + j] || (t2 && teacherOcc[t2][d][idx + j])) { free = false; break; }
        }
        if (!free) continue;
        let cost = 0;
        if (size === 1) {
          if (m.morning.has(idx)) continue;                   // never a single period before the break
          if (singleDay[cls.id][d] >= 2) continue;            // at most 2 singles per class per day
          if (singleDay[cls.id][d] === 1) cost += 260;        // prefer one single per day
          cost += (m.last - idx) * 60;                        // singles go to the end of the day
        } else {
          const inMorning = m.morning.has(idx) && m.morning.has(idx + 1);
          if (mathPhys) {
            if (!inMorning) { if (!relaxMorning) continue; cost += 2000; }
          } else {
            if (idx + 1 === m.last) cost += 120;              // keep the last period free for singles
            if (!inMorning) {
              cost += 140;                                    // doubles fill the morning first, the rest goes after the break
              if ((idx - m.morning.size) % 2 === 1) cost += 90;   // afternoon pairs line up as D D S
            }
          }
        }
        const load = Math.max(teacherLoad[t][d], t2 ? teacherLoad[t2][d] : 0);
        cost += load * 14;
        if (load + size > Math.ceil(avgLoad) + 1) cost += 90;
        if (sd[d] > 0) cost += 220;                            // spread the subject over different days
        cost += classDayCount[cls.id][d] * 3;
        // do not put the same subject in the period next to this one
        const a = cells[cls.id][m.day][m.lessons[idx - 1]];
        const z = cells[cls.id][m.day][m.lessons[idx + size]];
        if ((a && a.subjectName === b.req.subjectName) || (z && z.subjectName === b.req.subjectName)) cost += 150;
        cost += rand() * 8;
        out.push({ d, idx, cost });
      }
    }
    return out.sort((x, y) => x.cost - y.cost);
  };

  const attemptBlock = (b: Block) => {
    let list = candidates(b, b.size, false);
    if (list.length === 0) list = candidates(b, b.size, true);
    if (list.length > 0) { place(b, list[0].d, list[0].idx, b.size); score += list[0].cost; return true; }
    if (b.size === 2) {
      // no room for a double: two single periods instead
      const one = { ...b, size: 1 as const };
      const first = candidates(one, 1, false).concat(candidates(one, 1, true)).sort((x, y) => x.cost - y.cost);
      if (first.length > 0) {
        place(one, first[0].d, first[0].idx, 1);
        const second = candidates(one, 1, false).concat(candidates(one, 1, true)).sort((x, y) => x.cost - y.cost);
        if (second.length > 0) { place(one, second[0].d, second[0].idx, 1); splitDoubles++; score += 4000; return true; }
        unplaced.push({ classId: classes[b.classIdx].id, className: classes[b.classIdx].name, subjectName: b.req.subjectName, periods: 1 });
        score += 5000;
        return true;
      }
    }
    unplaced.push({ classId: classes[b.classIdx].id, className: classes[b.classIdx].name, subjectName: b.req.subjectName, periods: b.size });
    score += 5000 * b.size;
    return false;
  };

  const byPriority = (a: Block, b: Block) => b.priority - a.priority;
  const singles = blocks.filter(b => b.size === 1).sort(byPriority);
  const mathPhysDoubles = blocks.filter(b => b.size === 2 && isMath(b.req.subjectName)).sort(byPriority);
  const otherDoubles = blocks.filter(b => b.size === 2 && !isMath(b.req.subjectName)).sort(byPriority);
  [...mathPhysDoubles, ...otherDoubles, ...singles].forEach(attemptBlock);

  // keep activities (evening events) chosen by the admin
  const kept = input.keepCells || {};
  classes.forEach(c => Object.entries(kept[c.id] || {}).forEach(([day, row]) => {
    Object.entries(row || {}).forEach(([periodId, cell]) => {
      if (cell && (cell.isActivity || periodId === 'act')) {
        if (!cells[c.id][day]) cells[c.id][day] = {};
        cells[c.id][day][periodId] = cell;
      }
    });
  }));

  // ---- extra lessons for the lightest teachers, doubles first ----
  let extra = 0;
  const extraGiven = new Set<string>();
  const totalLoad = (t: string) => (teacherLoad[t] || []).reduce((a, n) => a + n, 0);
  const pickExtra = (size: 1 | 2) => {
    let best: { b: Block; d: number; idx: number; cost: number } | null = null;
    classes.forEach((c, classIdx) => {
      const reqs = (requirements[c.id] || []).filter(r => !r.second);
      model.forEach((m, d) => {
        const starts = size === 1 ? m.lessons.map((_, i) => i) : m.pairs.map(p => p[0]);
        starts.forEach(idx => {
          if (size === 1 && m.morning.has(idx)) return;
          if (size === 1 && singleDay[c.id][d] >= 2) return;
          for (let j = 0; j < size; j++) if (classOcc[c.id][d][idx + j]) return;
          reqs.forEach(r => {
            if (extraGiven.has(key(c.id, r.subjectName))) return;
            ensureTeacher(r.teacherId);
            for (let j = 0; j < size; j++) if (teacherOcc[r.teacherId][d][idx + j]) return;
            const sd = (subjDay[key(c.id, r.subjectName)] || [])[d] || 0;
            if (sd + size > 2) return;
            if (size === 2 && isMath(r.subjectName) && !(m.morning.has(idx) && m.morning.has(idx + 1))) return;
            let cost = totalLoad(r.teacherId) * 10 + (size === 2 && (idx - m.morning.size) % 2 === 1 ? 90 : 0) + singleDay[c.id][d] * 120 + (m.last - idx) * 2 + sd * 25 + teacherLoad[r.teacherId][d] * 6 + rand() * 4;
            const a = cells[c.id][m.day][m.lessons[idx - 1]];
            const z = cells[c.id][m.day][m.lessons[idx + size]];
            if ((a && a.subjectName === r.subjectName) || (z && z.subjectName === r.subjectName)) cost += 60;
            if (!best || cost < best.cost) best = { b: { classIdx, req: r, size, priority: 0 }, d, idx, cost };
          });
        });
      });
    });
    return best as { b: Block; d: number; idx: number; cost: number } | null;
  };
  // 1) every free pair before the break gets a double: the lightest free teacher of the class takes it
  const pickMorning = () => {
    let best: { b: Block; d: number; idx: number; cost: number } | null = null;
    classes.forEach((c, classIdx) => {
      const reqs = (requirements[c.id] || []).filter(r => !r.second);
      model.forEach((m, d) => {
        m.pairs.forEach(([i0, i1]) => {
          if (!(m.morning.has(i0) && m.morning.has(i1))) return;
          if (classOcc[c.id][d][i0] || classOcc[c.id][d][i1]) return;
          reqs.forEach(r => {
            ensureTeacher(r.teacherId);
            if (teacherOcc[r.teacherId][d][i0] || teacherOcc[r.teacherId][d][i1]) return;
            const sd = (subjDay[key(c.id, r.subjectName)] || [])[d] || 0;
            if (sd + 2 > 2) return;
            const cost = totalLoad(r.teacherId) * 10 + (extraGiven.has(key(c.id, r.subjectName)) ? 80 : 0) + sd * 25 + teacherLoad[r.teacherId][d] * 6 + rand() * 4;
            if (!best || cost < best.cost) best = { b: { classIdx, req: r, size: 2, priority: 0 }, d, idx: i0, cost };
          });
        });
      });
    });
    return best as { b: Block; d: number; idx: number; cost: number } | null;
  };
  for (let guard = 0; guard < 600; guard++) {
    const pick = pickMorning();
    if (!pick) break;
    place(pick.b, pick.d, pick.idx, 2);
    extraGiven.add(key(classes[pick.b.classIdx].id, pick.b.req.subjectName));
    extra += 2;
  }

  // 2) after the break: one extra 40-minute period per subject per class, then the subject leaves the queue
  for (const size of [2, 1] as const) {                  // doubles first, a single only when no pair is free
    for (let guard = 0; guard < 600; guard++) {
      const pick = pickExtra(size);
      if (!pick) break;
      place(pick.b, pick.d, pick.idx, size);
      extraGiven.add(key(classes[pick.b.classIdx].id, pick.b.req.subjectName));
      extra += size;
    }
  }

  // ---- PS: only 12:30-14:30, max 1 per day and 4 per week for each class ----
  const startOf: Record<string, string> = {};
  slots.forEach(sl => { startOf[sl.id] = sl.startTime; });
  const psCell = (cid: string) => ({ subjectId: 'ps', subjectName: 'PS', teacherId: '', roomId: '', classId: cid, isPS: true, isReligion: false, isDouble: false, isDoubleSpan: false });
  const ps: Record<string, number> = {};
  const isPsCell = (x: any) => !!x && (x.isPS || x.subjectId === 'ps');
  classes.forEach(c => {
    ps[c.id] = model.reduce((a, m) => a + m.lessons.filter(pid => isPsCell(cells[c.id][m.day][pid])).length, 0);
    for (let d = 0; d < D && ps[c.id] < PS_MAX_PER_WEEK; d++) {
      const m = model[d];
      let perDay = m.lessons.filter(pid => isPsCell(cells[c.id][m.day][pid])).length;
      for (let idx = m.lessons.length - 1; idx >= 0 && perDay < PS_MAX_PER_DAY; idx--) {
        if (classOcc[c.id][d][idx] || startOf[m.lessons[idx]] < PS_FROM) continue;
        if (singleDay[c.id][d] >= 2) break;                // a PS period counts as a single
        classOcc[c.id][d][idx] = true;
        cells[c.id][m.day][m.lessons[idx]] = psCell(c.id);
        singleDay[c.id][d]++;
        ps[c.id]++; perDay++;
      }
    }
  });

  // ---- Friday afternoon = Religion; count what is still empty ----
  const religion: Record<string, number> = {};
  const empty: Record<string, number> = {};
  classes.forEach(c => {
    religion[c.id] = 0; empty[c.id] = 0;
    model.forEach((m, d) => {
      m.lessons.forEach((pid, idx) => { if (!classOcc[c.id][d][idx]) empty[c.id]++; void pid; });
      m.religionSlots.forEach(pid => {
        if (cells[c.id][m.day][pid]?.locked) return;
        cells[c.id][m.day][pid] = { subjectId: 'religion', subjectName: 'Religion', teacherId: '', roomId: '', classId: c.id, isPS: false, isReligion: true, isDouble: false, isDoubleSpan: false };
        religion[c.id]++;
      });
    });
  });
  Object.values(empty).forEach(n => { score += n * 4; });
  classes.forEach(c => model.forEach((m, d) => m.lessons.forEach((_pid, idx) => { if (m.morning.has(idx) && !classOcc[c.id][d][idx]) score += 3000; })));

  // teacher spread penalty: busiest day minus lightest day
  Object.values(teacherLoad).forEach(row => { score += (Math.max(...row) - Math.min(...row)) * 25; });
  void slots;
  return { schedule: cells, unplaced, splitDoubles, score, teacherDayLoad: teacherLoad, religion, ps, empty, extra, placed: placedPeriods };
}

export function generateAutoTimetable(input: AutoInput): AutoResult {
  const model = buildDays(input.days, input.slots, input.fridayEnd);
  const attempts = input.attempts || 40;
  let best: Attempt | null = null;
  for (let i = 0; i < attempts; i++) {
    const attempt = runAttempt(input, model, (input.seed || 20260126) + i * 7919);
    if (!best || attempt.score < best.score) best = attempt;
    if (best.unplaced.length === 0 && best.splitDoubles === 0 && i >= 12) break;
  }
  const result = best as Attempt;
  return {
    schedule: result.schedule,
    unplaced: result.unplaced,
    splitDoubles: result.splitDoubles,
    religionPeriods: result.religion,
    psPeriods: result.ps,
    emptyPeriods: result.empty,
    extraPeriods: result.extra,
    teacherDayLoad: result.teacherDayLoad,
    placedPeriods: result.placed
  };
}

// ---------- checks used before generating ----------
export function weeklyCapacity(days: string[], slots: AutoSlot[], fridayEnd?: string): number {
  return buildDays(days, slots, fridayEnd).reduce((sum, m) => sum + m.lessons.length, 0);
}
