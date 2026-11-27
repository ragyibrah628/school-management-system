import React, { useMemo, useState } from 'react';
import { Play, X, RefreshCw, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useTimetable } from '../context/TimetableContext';
import * as cloud from '../lib/cloud';
import { displayClass, levelOfClass, sortClasses } from '../utils/promotion';
import { setAllLocked, countLocked } from '../utils/timetableSwap';
import { generateAutoTimetable, defaultPeriodsPerWeek, weeklyCapacity, AutoRequirement, PS_FROM, PS_MAX_PER_DAY, PS_MAX_PER_WEEK } from '../utils/autoTimetable';

export const CLASS_SUBJECTS_KEY = 'sms_tt_class_subjects';
export type ClassSubjectConfig = Record<string, Record<string, number>>;

export function readClassSubjectConfig(): ClassSubjectConfig {
  try { return JSON.parse(localStorage.getItem(CLASS_SUBJECTS_KEY) || '{}') || {}; } catch { return {}; }
}
export function saveClassSubjectConfig(value: ClassSubjectConfig) {
  const text = JSON.stringify(value);
  try {
    localStorage.setItem(CLASS_SUBJECTS_KEY, text);
    cloud.markAppDataKeyDirty(CLASS_SUBJECTS_KEY, text);
    void cloud.syncToCloud().catch(() => {});
  } catch {}
}

export const COMBINED_KEY = 'sms_tt_class_combined';
export type CombinedConfig = Record<string, [string, string][]>;
export function readCombined(): CombinedConfig {
  try { return JSON.parse(localStorage.getItem(COMBINED_KEY) || '{}') || {}; } catch { return {}; }
}
export function saveCombined(value: CombinedConfig) {
  const text = JSON.stringify(value);
  try {
    localStorage.setItem(COMBINED_KEY, text);
    cloud.markAppDataKeyDirty(COMBINED_KEY, text);
    void cloud.syncToCloud().catch(() => {});
  } catch {}
}

const norm = (v: any) => String(v || '').trim().toLowerCase();

export function findAssignedTeacher(subjectName: string, className: string): { id: string; name: string } | null {
  try {
    const ta = JSON.parse(localStorage.getItem('sms_teaching_assignments') || '{}');
    const users = JSON.parse(localStorage.getItem('sms_users') || '[]');
    for (const [tid, arr] of Object.entries(ta as any)) {
      if ((arr as any[]).some(a => displayClass(a.cls) === displayClass(className) && norm(a.sub) === norm(subjectName))) {
        const u = users.find((x: any) => x.id === tid);
        return { id: tid, name: u?.name || tid };
      }
    }
  } catch {}
  return null;
}

interface Props { slots: any[]; onClose: () => void }

export const TimetableAutoPanel: React.FC<Props> = ({ slots, onClose }) => {
  const { classes, subjects, days, timetableData, replaceTimetable } = useTimetable() as any;
  const lockedCount = timetableData ? countLocked(timetableData.schedule) : 0;
  const [config, setConfig] = useState<ClassSubjectConfig>(readClassSubjectConfig);
  const [combined, setCombinedState] = useState<CombinedConfig>(readCombined);
  const [pick, setPick] = useState<Record<string, [string, string]>>({});
  const [busy, setBusy] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [report, setReport] = useState<any>(null);

  const classList = useMemo(() => {
    const names = sortClasses(classes.map((c: any) => displayClass(c.name)));
    return names.map(n => classes.find((c: any) => displayClass(c.name) === n)).filter(Boolean);
  }, [classes]);
  const subjectList = useMemo(() => {
    const seen = new Set<string>();
    return (subjects as any[]).filter(s => { const k = norm(s.name); if (!k || seen.has(k)) return false; seen.add(k); return true; });
  }, [subjects]);

  const setCombined = (next: CombinedConfig) => { setCombinedState(next); saveCombined(next); setReport(null); };
  const addPair = (cn: string) => {
    const [a, b] = pick[cn] || ['', ''];
    if (!a || !b || a === b) return;
    const list = (combined[cn] || []).filter(p => !p.includes(a) && !p.includes(b));
    setCombined({ ...combined, [cn]: [...list, [a, b]] });
    setPick({ ...pick, [cn]: ['', ''] });
  };
  const removePair = (cn: string, i: number) => setCombined({ ...combined, [cn]: (combined[cn] || []).filter((_, k) => k !== i) });
  const update = (next: ClassSubjectConfig) => { setConfig(next); saveClassSubjectConfig(next); setReport(null); };
  const setCell = (cls: string, sub: string, periods: number | null) => {
    const row = { ...(config[cls] || {}) };
    if (periods === null) delete row[sub]; else row[sub] = periods;
    update({ ...config, [cls]: row });
  };
  const tickAssigned = () => {
    const next: ClassSubjectConfig = { ...config };
    classList.forEach((c: any) => {
      const cn = displayClass(c.name);
      const row = { ...(next[cn] || {}) };
      subjectList.forEach(s => { if (findAssignedTeacher(s.name, cn) && row[s.name] === undefined) row[s.name] = defaultPeriodsPerWeek(s.name, levelOfClass(cn)); });
      next[cn] = row;
    });
    update(next);
  };

  const capacity = weeklyCapacity(days, slots);
  const rows = classList.map((c: any) => {
    const cn = displayClass(c.name);
    const chosen = Object.entries(config[cn] || {});
    const livePairs = (combined[cn] || []).filter(([a, b]) => config[cn]?.[a] !== undefined && config[cn]?.[b] !== undefined);
    const pairSecond = new Set(livePairs.map(([, b]) => b));
    const biggest = (n: string) => { const p = livePairs.find(([a]) => a === n); return p ? Math.max(Number(config[cn][n]) || 0, Number(config[cn][p[1]]) || 0) : Number(config[cn][n]) || 0; };
    const total = chosen.filter(([n]) => !pairSecond.has(n)).reduce((a, [n]) => a + biggest(n), 0);
    const noTeacher = chosen.filter(([s]) => !findAssignedTeacher(s, cn)).map(([s]) => s);
    const pairs = (combined[cn] || []).filter(([a, b]) => config[cn]?.[a] !== undefined && config[cn]?.[b] !== undefined);
    return { c, cn, chosen, total, noTeacher, pairs };
  });
  const missing = rows.flatMap(r => r.noTeacher.map(s => `${r.cn}: ${s}`));
  const over = rows.filter(r => r.total > capacity);
  const empty = rows.filter(r => r.chosen.length === 0);
  const canGenerate = rows.length > 0 && missing.length === 0 && over.length === 0 && empty.length === 0;

  const run = () => {
    setBusy(true); setConfirm(false);
    setTimeout(() => {
      try {
        const requirements: Record<string, AutoRequirement[]> = {};
        rows.forEach(r => {
          const secondOf = new Map<string, string>(r.pairs.map(([a, b]) => [a, b] as [string, string]));
          const hidden = new Set(r.pairs.map(([, b]) => b));
          const make = (name: string, periods: number) => {
            const t = findAssignedTeacher(name, r.cn)!;
            const sub = subjectList.find(s => norm(s.name) === norm(name));
            return { subjectId: sub?.id || name, subjectName: sub?.name || name, teacherId: t.id, periods: Number(periods) || 0 } as AutoRequirement;
          };
          requirements[r.c.id] = r.chosen.filter(([name]) => !hidden.has(name)).map(([name, periods]) => {
            const req = make(name, periods);
            const other = secondOf.get(name);
            if (other) {
              // the subject with more periods decides: both go together for that many periods
              const otherPeriods = Number(r.chosen.find(([n]) => n === other)?.[1]) || 0;
              const most = Math.max(Number(periods) || 0, otherPeriods);
              req.periods = most;
              const o = make(other, most); req.second = { subjectId: o.subjectId, subjectName: o.subjectName, teacherId: o.teacherId }; }
            return req;
          });
        });
        const keep: any = {};
        rows.forEach(r => { keep[r.c.id] = (timetableData?.schedule || {})[r.c.id] || {}; });
        const res = generateAutoTimetable({
          classes: rows.map(r => ({ id: r.c.id, name: r.cn, level: levelOfClass(r.cn), roomId: r.c.roomId })),
          requirements, days, slots, keepCells: keep
        });
        replaceTimetable(res.schedule);
        setReport({ ...res, names: Object.fromEntries(rows.map(r => [r.c.id, r.cn])) });
      } catch (e) { console.error(e); setReport({ error: true }); }
      setBusy(false);
    }, 300);
  };

  return (
    <div className="bg-white rounded-2xl border border-indigo-200 shadow-sm p-4 space-y-4 print:hidden">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-slate-800">Generate Timetable (Automatic)</h3>
          <p className="text-xs text-slate-500 mt-1">1) Tick subjects each class studies and set periods per week. 2) Every ticked subject must have a teacher (Teaching Assignments). 3) Press Generate.</p>
        </div>
        <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500" aria-label="Close"><X size={18} /></button>
      </div>

      <div className="flex flex-wrap gap-2">
        <button onClick={tickAssigned} className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 bg-white hover:bg-slate-50">Tick all subjects that already have a teacher</button>
        <button onClick={() => update({})} className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 bg-white hover:bg-slate-50">Clear all ticks</button>
      </div>

      <div className="overflow-x-auto border border-slate-200 rounded-xl">
        <table className="min-w-full text-xs">
          <thead className="bg-slate-50">
            <tr>
              <th className="p-2 text-left font-bold text-slate-600 sticky left-0 bg-slate-50">Subject</th>
              {rows.map(r => <th key={r.c.id} className="p-2 text-center font-bold text-slate-600 whitespace-nowrap">{r.cn}</th>)}
            </tr>
          </thead>
          <tbody>
            {subjectList.map(s => (
              <tr key={s.id} className="border-t border-slate-100">
                <td className="p-2 font-semibold text-slate-700 sticky left-0 bg-white whitespace-nowrap">{s.name}</td>
                {rows.map(r => {
                  const value = (config[r.cn] || {})[s.name];
                  const on = value !== undefined;
                  const teacher = on ? findAssignedTeacher(s.name, r.cn) : null;
                  return (
                    <td key={r.c.id} className={`p-1.5 text-center align-top ${on && !teacher ? 'bg-rose-50' : ''}`}>
                      <div className="flex items-center justify-center gap-1">
                        <input type="checkbox" checked={on} onChange={e => setCell(r.cn, s.name, e.target.checked ? defaultPeriodsPerWeek(s.name, levelOfClass(r.cn)) : null)} />
                        {on && <input type="number" min={1} max={10} value={value} onChange={e => setCell(r.cn, s.name, Math.max(1, Math.min(10, Number(e.target.value) || 1)))} className="w-10 border border-slate-300 rounded px-1 py-0.5 text-center" />}
                      </div>
                      {on && <div className={`mt-0.5 text-[10px] leading-tight max-w-[90px] mx-auto truncate ${teacher ? 'text-slate-500' : 'text-rose-600 font-bold'}`}>{teacher ? teacher.name : 'No teacher'}</div>}
                    </td>
                  );
                })}
              </tr>
            ))}
            <tr className="border-t-2 border-slate-200 bg-slate-50 font-bold">
              <td className="p-2 sticky left-0 bg-slate-50">Total / {capacity}</td>
              {rows.map(r => <td key={r.c.id} className={`p-2 text-center ${r.total > capacity ? 'text-rose-600' : 'text-slate-700'}`}>{r.total}</td>)}
            </tr>
          </tbody>
        </table>
      </div>

      <div className="border border-slate-200 rounded-xl p-3 space-y-2">
        <h4 className="text-sm font-bold text-slate-800">Subjects that go together (optional)</h4>
        <p className="text-[11px] text-slate-500">Example: Physics + History. All their periods are placed at the same time (two teachers, same class time). If they have different periods per week, the subject with more periods decides (e.g. PHY 4 + HST 3 = both get 4). Classes with nothing chosen: every subject is independent.</p>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {rows.map(r => {
            const ticked = r.chosen.map(([n]) => n);
            const used = new Set((combined[r.cn] || []).flat());
            const free = ticked.filter(n => !used.has(n));
            const [a, b] = pick[r.cn] || ['', ''];
            return (
              <div key={r.c.id} className="bg-slate-50 rounded-lg p-2 text-xs space-y-1">
                <div className="font-bold text-slate-700">{r.cn}</div>
                {(combined[r.cn] || []).map(([x, y], i) => (
                  <div key={i} className="flex items-center justify-between bg-white border border-slate-200 rounded px-2 py-1">
                    <span className="font-semibold">{x} / {y}</span>
                    <button onClick={() => removePair(r.cn, i)} className="text-rose-600 font-bold px-1" aria-label="Remove">×</button>
                  </div>
                ))}
                <div className="flex gap-1">
                  <select value={a} onChange={e => setPick({ ...pick, [r.cn]: [e.target.value, b] })} className="flex-1 min-w-0 border border-slate-300 rounded px-1 py-0.5">
                    <option value="">Subject 1</option>{free.map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                  <select value={b} onChange={e => setPick({ ...pick, [r.cn]: [a, e.target.value] })} className="flex-1 min-w-0 border border-slate-300 rounded px-1 py-0.5">
                    <option value="">Subject 2</option>{free.filter(n => n !== a).map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                  <button onClick={() => addPair(r.cn)} disabled={!a || !b} className="px-2 rounded bg-indigo-600 text-white font-bold disabled:bg-slate-300">+</button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {(missing.length > 0 || over.length > 0 || empty.length > 0) && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800 space-y-1">
          <div className="flex items-center gap-2 font-bold"><AlertTriangle size={14} /> Fix these before generating</div>
          {empty.length > 0 && <div>No subject ticked for: {empty.map(r => r.cn).join(', ')}</div>}
          {missing.length > 0 && <div>Subjects without a teacher: {missing.join('; ')}</div>}
          {over.length > 0 && <div>Too many periods (more than {capacity} per week; Friday after the break is Religion): {over.map(r => `${r.cn} (${r.total})`).join(', ')}</div>}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3">
        {!confirm ? (
          <button disabled={!canGenerate || busy} onClick={() => timetableData ? setConfirm(true) : run()} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold disabled:bg-slate-200 disabled:text-slate-400">
            {busy ? <RefreshCw size={16} className="animate-spin" /> : <Play size={16} fill="currentColor" />}
            {busy ? 'Generating...' : 'Generate Timetable'}
          </button>
        ) : (
          <div className="flex flex-wrap items-center gap-2 bg-rose-50 border border-rose-200 rounded-xl px-3 py-2 text-xs text-rose-800">
            <span className="font-semibold">The current timetable will be re-planned. Locked periods and evening activities are kept. Continue?</span>
            <button onClick={run} className="px-3 py-1.5 rounded-lg bg-rose-600 text-white font-semibold">Yes, generate</button>
            <button onClick={() => setConfirm(false)} className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 font-semibold">Cancel</button>
          </div>
        )}
      </div>

      {timetableData && (
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
          <span>🔒 Locked periods: <b>{lockedCount}</b> (kept exactly as they are when you generate again).</span>
          <button onClick={() => replaceTimetable(setAllLocked(timetableData.schedule, true))} className="px-2.5 py-1 rounded-lg border border-slate-300 bg-white font-semibold hover:bg-slate-50">Lock all</button>
          <button onClick={() => replaceTimetable(setAllLocked(timetableData.schedule, false))} disabled={lockedCount === 0} className="px-2.5 py-1 rounded-lg border border-slate-300 bg-white font-semibold hover:bg-slate-50 disabled:opacity-40">Unlock all</button>
        </div>
      )}

      {report && !report.error && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-900 space-y-1">
          <div className="flex items-center gap-2 font-bold"><CheckCircle2 size={14} /> Timetable generated: {report.placedPeriods} lessons placed.</div>
          {report.splitDoubles > 0 && <div>{report.splitDoubles} double period(s) could not fit and were split into single periods.</div>}
          {report.unplaced.length > 0 && <div className="text-rose-700 font-semibold">Not placed: {report.unplaced.map((u: any) => `${u.className} ${u.subjectName} (${u.periods})`).join('; ')}</div>}
          <div>PS (12:30–14:30, max 1 per day, 4 per week): {Object.entries(report.psPeriods).map(([id, n]) => `${report.names[id]} ${n}`).join(', ')}.</div>
          {report.extraPeriods > 0 && <div>{report.extraPeriods} extra lesson period(s) were given to teachers with the lightest week.</div>}
          {Object.values(report.emptyPeriods).some((n: any) => n > 0) && <div>Empty periods left: {Object.entries(report.emptyPeriods).filter(([, n]: any) => n > 0).map(([id, n]) => `${report.names[id]} ${n}`).join(', ')} (click a cell to fill it).</div>}
          <div>Friday after the break is Religion. You can change any cell by clicking it.</div>
        </div>
      )}
      {report?.error && <div className="text-xs text-rose-700 font-semibold">Generation failed. Please try again.</div>}
    </div>
  );
};


// ---------- side panel: periods per week for the class on screen ----------
export const PeriodsSidePanel: React.FC<{ classId: string; slots: any[] }> = ({ classId, slots }) => {
  const { classes, subjects, days, timetableData, updateLessonSlot, removeLessonSlot } = useTimetable() as any;
  const [, bump] = useState(0);
  const [msg, setMsg] = useState('');
  const cls = classes.find((c: any) => c.id === classId);
  if (!cls || !timetableData) return null;
  const cn = displayClass(cls.name);
  const lessonSlots = slots.filter((s: any) => !s.isBreak && !s.isActivity);
  const schedule = timetableData.schedule || {};
  const counts: Record<string, number> = {};
  let religion = 0;
  let psCount = 0;
  let emptyCount = 0;
  const combinedNames = new Set<string>();
  days.forEach((d: string) => lessonSlots.forEach((sl: any) => {
    const cell = schedule[classId]?.[d]?.[sl.id];
    if (!cell) { emptyCount++; return; }
    if (cell.isReligion) { religion++; return; }
    if (cell.isPS || cell.subjectId === 'ps') { psCount++; return; }
    const name = cell.subjectName || subjects.find((x: any) => x.id === cell.subjectId)?.name || '';
    if (name) counts[name] = (counts[name] || 0) + 1;
    if (cell.isCombined && cell.secondSubjectName) {
      counts[cell.secondSubjectName] = (counts[cell.secondSubjectName] || 0) + 1;
      combinedNames.add(name); combinedNames.add(cell.secondSubjectName);
    }
  }));
  const config = readClassSubjectConfig();
  const required = config[cn] || {};
  const names = Array.from(new Set([...Object.keys(required), ...Object.keys(counts)])).sort();
  const save = (next: ClassSubjectConfig) => { saveClassSubjectConfig(next); bump(x => x + 1); };
  const setRequired = (sub: string, n: number) => save({ ...config, [cn]: { ...(config[cn] || {}), [sub]: Math.max(0, n) } });

  const teacherBusy = (tid: string, d: string, pid: string) =>
    Object.keys(schedule).some(cid => { const c = schedule[cid]?.[d]?.[pid]; return c && (c.teacherId === tid || c.secondTeacherId === tid); });

  const addPeriod = (sub: string) => {
    const t = findAssignedTeacher(sub, cn);
    if (!t) { setMsg(`${sub}: no teacher assigned in Teaching Assignments.`); return; }
    const subj = subjects.find((x: any) => norm(x.name) === norm(sub));
    const perDay = (d: string) => lessonSlots.filter((sl: any) => schedule[classId]?.[d]?.[sl.id]?.subjectName === sub).length;
    const breakAt = slots.findIndex((x: any) => x.isBreak);
    const afterBreak = (id: string) => breakAt < 0 || slots.findIndex((x: any) => x.id === id) > breakAt;
    for (const sl of [...lessonSlots].reverse()) for (const d of days) {
      if (!afterBreak(sl.id)) continue;   // no single period before the break
      const cell = schedule[classId]?.[d]?.[sl.id];
      if ((!cell || cell.isPS || cell.subjectId === 'ps') && !teacherBusy(t.id, d, sl.id) && perDay(d) < 2) {
        updateLessonSlot(classId, d, sl.id, subj?.id || sub, t.id, '', { subjectName: sub, isDouble: false, isDoubleSpan: false });
        setRequired(sub, (required[sub] ?? counts[sub] ?? 0) + 1);
        setMsg(`${sub}: +1 period (${d}, ${sl.name || sl.id}).`);
        return;
      }
    }
    setMsg(`${sub}: no free (PS or empty) period after the break where ${t.name} is free.`);
  };
  const psCell = { subjectId: 'ps', subjectName: 'PS', isPS: true, isReligion: false, isDouble: false, isDoubleSpan: false };
  const removePeriod = (sub: string) => {
    let single: [string, string] | null = null; let span: [string, string] | null = null;
    for (const d of days) for (const sl of [...lessonSlots].reverse()) {
      const cell = schedule[classId]?.[d]?.[sl.id];
      if (!cell || cell.isReligion || cell.isPS || cell.isCombined || cell.subjectName !== sub) continue;
      if (!cell.isDouble && !cell.isDoubleSpan) { if (!single) single = [d, sl.id]; }
      else if (cell.isDoubleSpan && !span) span = [d, sl.id];
    }
    const psAllowed = (d: string, pid: string) => {
      const start = slots.find((x: any) => x.id === pid)?.startTime || '';
      if (start < PS_FROM) return false;
      const inDay = lessonSlots.filter((x: any) => schedule[classId]?.[d]?.[x.id]?.isPS).length;
      const inWeek = days.reduce((a: number, dd: string) => a + lessonSlots.filter((x: any) => schedule[classId]?.[dd]?.[x.id]?.isPS).length, 0);
      return inDay < PS_MAX_PER_DAY && inWeek < PS_MAX_PER_WEEK;
    };
    const free = (d: string, pid: string) => psAllowed(d, pid) ? updateLessonSlot(classId, d, pid, 'ps', '', '', psCell) : removeLessonSlot(classId, d, pid);
    if (single) free(single[0], single[1]);
    else if (span) {
      const [d, pid] = span;
      const idx = lessonSlots.findIndex((x: any) => x.id === pid);
      const head = schedule[classId]?.[d]?.[lessonSlots[idx - 1]?.id];
      if (head) updateLessonSlot(classId, d, head ? lessonSlots[idx - 1].id : pid, head.subjectId, head.teacherId, head.roomId || '', { ...head, isDouble: false, isDoubleSpan: false });
      free(d, pid);
    } else { setMsg(`${sub}: nothing to remove.`); return; }
    setRequired(sub, (required[sub] ?? counts[sub] ?? 0) - 1);
    setMsg(`${sub}: -1 period.`);
  };

  return (
    <aside className="bg-white rounded-2xl border border-slate-200 shadow-sm p-3 w-full xl:w-72 shrink-0 print:hidden">
      <h4 className="text-sm font-bold text-slate-800 mb-0.5">Periods per week</h4>
      <p className="text-[11px] text-slate-500 mb-2">{cn} — placed / syllabus</p>
      <table className="w-full text-xs">
        <tbody>
          {names.map(n => {
            const have = counts[n] || 0; const need = defaultPeriodsPerWeek(n, levelOfClass(cn));
            const ok = have >= need;
            return (
              <tr key={n} className="border-t border-slate-100">
                <td className="py-1 pr-1 font-semibold text-slate-700 truncate max-w-[110px]">{n}</td>
                <td className={`py-1 text-center font-bold ${ok ? 'text-emerald-700' : 'text-rose-600'}`}>{have}/{need}</td>
                <td className="py-1 text-right whitespace-nowrap">
                  {!combinedNames.has(n) && <>
                    <button onClick={() => removePeriod(n)} className="w-6 h-6 rounded border border-slate-300 hover:bg-slate-50 font-bold" title="Remove one period">−</button>{' '}
                    <button onClick={() => addPeriod(n)} className="w-6 h-6 rounded border border-slate-300 hover:bg-slate-50 font-bold" title="Add one period">+</button>
                  </>}
                </td>
              </tr>
            );
          })}
          <tr className="border-t border-slate-200"><td className="py-1 font-semibold text-slate-500">PS (free)</td><td className="py-1 text-center font-bold text-slate-500">{psCount}</td><td /></tr>
          <tr><td className="py-1 font-semibold text-slate-500">Empty</td><td className="py-1 text-center font-bold text-slate-500">{emptyCount}</td><td /></tr>
          <tr><td className="py-1 font-semibold text-slate-500">Religion</td><td className="py-1 text-center font-bold text-slate-500">{religion}</td><td /></tr>
        </tbody>
      </table>
      {msg && <p className="text-[11px] text-slate-600 mt-2">{msg}</p>}
      <p className="text-[10px] text-slate-400 mt-2">Green = syllabus met or more, red = fewer than syllabus. Click any cell in the timetable to change a subject or its time. + takes a free (PS or empty) period after the break, − frees a period. Combined subjects are edited by clicking their cell.</p>
    </aside>
  );
};

export default TimetableAutoPanel;
