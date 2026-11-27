// Manual helpers for the class timetable: swap two periods and lock/unlock a period.
// Pure functions: they return a NEW schedule (or an error message) and never touch the original.

export interface PeriodRef { day: string; pid: string }

const copy = <T,>(v: T): T => JSON.parse(JSON.stringify(v));
const teachersOf = (cell: any): string[] => [cell?.teacherId, cell?.secondTeacherId].filter(Boolean);
const isBlank = (cell: any) => !cell || cell.isPS || cell.subjectId === 'ps' || cell.isReligion;

function nextLessonSlot(slots: any[], pid: string): string | null {
  const i = slots.findIndex(s => s.id === pid);
  const n = slots[i + 1];
  return n && !n.isBreak && !n.isActivity ? n.id : null;
}

// the first period of the block that contains this cell (a double is two cells)
function headOf(schedule: any, classId: string, day: string, pid: string, slots: any[]): string {
  const cell = schedule?.[classId]?.[day]?.[pid];
  if (cell?.isDoubleSpan) {
    const i = slots.findIndex(s => s.id === pid);
    const prev = slots[i - 1];
    if (prev) return prev.id;
  }
  return pid;
}

export function swapPeriods(
  schedule: any, classId: string, from: PeriodRef, to: PeriodRef, slots: any[],
  classNameOf?: (id: string) => string
): { schedule?: any; error?: string } {
  const a = { day: from.day, pid: headOf(schedule, classId, from.day, from.pid, slots) };
  const b = { day: to.day, pid: headOf(schedule, classId, to.day, to.pid, slots) };
  if (a.day === b.day && a.pid === b.pid) return { error: 'Choose a different period.' };
  const get = (r: PeriodRef) => schedule?.[classId]?.[r.day]?.[r.pid];
  const ca = get(a), cb = get(b);
  if (!ca) return { error: 'The first period is empty.' };
  if (ca.isActivity || cb?.isActivity) return { error: 'Evening activities cannot be swapped.' };
  const slotOf = (id: string) => slots.find(s => s.id === id);
  if (slotOf(b.pid)?.isBreak || slotOf(b.pid)?.isActivity) return { error: 'You cannot place a lesson there.' };

  const sizeA = ca.isDouble ? 2 : 1;
  const sizeB = cb?.isDouble ? 2 : 1;
  if (cb && !isBlank(cb) && sizeA !== sizeB) return { error: 'A double (80 min) can only be swapped with another double, and a single with a single.' };
  if (cb && isBlank(cb) && sizeB === 2) return { error: 'The target period is a double. Choose a single period.' };
  const size = sizeA;

  const idsOf = (r: PeriodRef): string[] | null => {
    if (size === 1) return [r.pid];
    const n = nextLessonSlot(slots, r.pid);
    return n ? [r.pid, n] : null;
  };
  const idsA = idsOf(a), idsB = idsOf(b);
  if (!idsA || !idsB) return { error: 'A double needs two lesson periods next to each other (not across a break).' };
  if (a.day === b.day && idsA.some(x => idsB.includes(x))) return { error: 'The two periods overlap.' };

  // target block must not cut through another double and must only hold a swappable lesson
  for (const id of idsB) {
    const c = schedule?.[classId]?.[b.day]?.[id];
    if (c?.isActivity) return { error: 'You cannot place a lesson there.' };
    if (size === 2 && c && !isBlank(c) && !c.isDouble && !c.isDoubleSpan) return { error: 'The target holds single lessons; swap a double with a double.' };
    if (size === 2 && c && (c.isDoubleSpan || c.isDouble) && id === idsB[0] && c.isDoubleSpan) return { error: 'The target cuts through another double.' };
  }
  if (size === 2) {
    const c2 = schedule?.[classId]?.[b.day]?.[idsB[1]];
    if (c2?.isDoubleSpan && !cb?.isDouble) return { error: 'The target cuts through another double.' };
  }

  const blockCells = (day: string, ids: string[]) => ids.map(id => schedule?.[classId]?.[day]?.[id] || null);
  const contentA = blockCells(a.day, idsA), contentB = blockCells(b.day, idsB);

  // collision: the teachers who move must be free in every OTHER class at the new time
  const busy = (teachers: string[], day: string, ids: string[]) => {
    for (const cid of Object.keys(schedule)) {
      if (cid === classId) continue;
      for (const id of ids) {
        const other = schedule[cid]?.[day]?.[id];
        if (other && teachersOf(other).some(t => teachers.includes(t))) return classNameOf ? classNameOf(cid) : cid;
      }
    }
    return null;
  };
  const clashA = busy(contentA.flatMap(teachersOf), b.day, idsB);
  if (clashA) return { error: `Collision: the teacher is already teaching ${clashA} at that time.` };
  const clashB = busy(contentB.flatMap(teachersOf), a.day, idsA);
  if (clashB) return { error: `Collision: the teacher of the other period is already teaching ${clashB} at the other time.` };

  const next = copy(schedule);
  const row = (day: string) => { if (!next[classId]) next[classId] = {}; if (!next[classId][day]) next[classId][day] = {}; return next[classId][day]; };
  const put = (day: string, ids: string[], content: any[]) => ids.forEach((id, i) => { if (content[i]) row(day)[id] = content[i]; else delete row(day)[id]; });
  put(b.day, idsB, copy(contentA));
  put(a.day, idsA, copy(contentB));
  return { schedule: next };
}

export function setLocked(schedule: any, classId: string, day: string, pid: string, slots: any[], value: boolean): any {
  const next = copy(schedule);
  const head = headOf(next, classId, day, pid, slots);
  const ids = [head];
  if (next?.[classId]?.[day]?.[head]?.isDouble) { const n = nextLessonSlot(slots, head); if (n) ids.push(n); }
  ids.forEach(id => { const c = next?.[classId]?.[day]?.[id]; if (c) { if (value) c.locked = true; else delete c.locked; } });
  return next;
}

export function setAllLocked(schedule: any, value: boolean): any {
  const next = copy(schedule);
  Object.values(next || {}).forEach((byDay: any) => Object.values(byDay || {}).forEach((row: any) => Object.values(row || {}).forEach((c: any) => {
    if (!c || c.isActivity) return;
    if (value) c.locked = true; else delete c.locked;
  })));
  return next;
}

export function countLocked(schedule: any): number {
  let n = 0;
  Object.values(schedule || {}).forEach((byDay: any) => Object.values(byDay || {}).forEach((row: any) => Object.values(row || {}).forEach((c: any) => { if (c?.locked) n++; })));
  return n;
}
