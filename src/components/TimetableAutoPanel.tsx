import React, { useMemo, useState } from 'react';
import { Play, X, RefreshCw, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useTimetable } from '../context/TimetableContext';
import * as cloud from '../lib/cloud';
import { displayClass, levelOfClass, sortClasses } from '../utils/promotion';
import { generateAutoTimetable, defaultPeriodsPerWeek, weeklyCapacity, AutoRequirement } from '../utils/autoTimetable';

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
  const [config, setConfig] = useState<ClassSubjectConfig>(readClassSubjectConfig);
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
    const total = chosen.reduce((a, [, n]) => a + (Number(n) || 0), 0);
    const noTeacher = chosen.filter(([s]) => !findAssignedTeacher(s, cn)).map(([s]) => s);
    return { c, cn, chosen, total, noTeacher };
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
          requirements[r.c.id] = r.chosen.map(([name, periods]) => {
            const t = findAssignedTeacher(name, r.cn)!;
            const sub = subjectList.find(s => norm(s.name) === norm(name));
            return { subjectId: sub?.id || name, subjectName: sub?.name || name, teacherId: t.id, periods: Number(periods) || 0 };
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

      {(missing.length > 0 || over.length > 0 || empty.length > 0) && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800 space-y-1">
          <div className="flex items-center gap-2 font-bold"><AlertTriangle size={14} /> Fix these before generating</div>
          {empty.length > 0 && <div>No subject ticked for: {empty.map(r => r.cn).join(', ')}</div>}
          {missing.length > 0 && <div>Subjects without a teacher: {missing.join('; ')}</div>}
          {over.length > 0 && <div>Too many periods (more than {capacity} per week): {over.map(r => `${r.cn} (${r.total})`).join(', ')}</div>}
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
            <span className="font-semibold">The current timetable (lessons) will be replaced. Evening activities are kept. Continue?</span>
            <button onClick={run} className="px-3 py-1.5 rounded-lg bg-rose-600 text-white font-semibold">Yes, generate</button>
            <button onClick={() => setConfirm(false)} className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 font-semibold">Cancel</button>
          </div>
        )}
      </div>

      {report && !report.error && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-900 space-y-1">
          <div className="flex items-center gap-2 font-bold"><CheckCircle2 size={14} /> Timetable generated: {report.placedPeriods} lessons placed.</div>
          {report.splitDoubles > 0 && <div>{report.splitDoubles} double period(s) could not fit and were split into single periods.</div>}
          {report.unplaced.length > 0 && <div className="text-rose-700 font-semibold">Not placed: {report.unplaced.map((u: any) => `${u.className} ${u.subjectName} (${u.periods})`).join('; ')}</div>}
          <div>Remaining periods were filled with Religion: {Object.entries(report.religionPeriods).map(([id, n]) => `${report.names[id]} ${n}`).join(', ')}. You can change any cell by clicking it.</div>
        </div>
      )}
      {report?.error && <div className="text-xs text-rose-700 font-semibold">Generation failed. Please try again.</div>}
    </div>
  );
};


// ---------- side panel: periods per week for the class on screen ----------
export const PeriodsSidePanel: React.FC<{ classId: string; slots: any[] }> = ({ classId, slots }) => {
  const { classes, subjects, days, timetableData, updateLessonSlot } = useTimetable() as any;
  const [, bump] = useState(0);
  const [msg, setMsg] = useState('');
  const cls = classes.find((c: any) => c.id === classId);
  if (!cls || !timetableData) return null;
  const cn = displayClass(cls.name);
  const lessonSlots = slots.filter((s: any) => !s.isBreak && !s.isActivity);
  const schedule = timetableData.schedule || {};
  const counts: Record<string, number> = {};
  let religion = 0;
  days.forEach((d: string) => lessonSlots.forEach((sl: any) => {
    const cell = schedule[classId]?.[d]?.[sl.id];
    if (!cell) return;
    if (cell.isReligion) { religion++; return; }
    const name = cell.subjectId === 'ps' ? 'PS' : (cell.subjectName || subjects.find((x: any) => x.id === cell.subjectId)?.name || '');
    if (name) counts[name] = (counts[name] || 0) + 1;
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
    for (const sl of [...lessonSlots].reverse()) for (const d of days) {
      const cell = schedule[classId]?.[d]?.[sl.id];
      if (cell?.isReligion && !teacherBusy(t.id, d, sl.id) && perDay(d) < 2) {
        updateLessonSlot(classId, d, sl.id, subj?.id || sub, t.id, '', { subjectName: sub, isDouble: false, isDoubleSpan: false });
        setRequired(sub, (required[sub] ?? counts[sub] ?? 0) + 1);
        setMsg(`${sub}: +1 period (${d}, ${sl.name || sl.id}).`);
        return;
      }
    }
    setMsg(`${sub}: no free Religion period where ${t.name} is free.`);
  };
  const religionCell = { subjectId: 'religion', subjectName: 'Religion', isReligion: true, isDouble: false, isDoubleSpan: false };
  const removePeriod = (sub: string) => {
    let single: [string, string] | null = null; let span: [string, string] | null = null;
    for (const d of days) for (const sl of [...lessonSlots].reverse()) {
      const cell = schedule[classId]?.[d]?.[sl.id];
      if (!cell || cell.isReligion || cell.subjectName !== sub) continue;
      if (!cell.isDouble && !cell.isDoubleSpan) { if (!single) single = [d, sl.id]; }
      else if (cell.isDoubleSpan && !span) span = [d, sl.id];
    }
    if (single) updateLessonSlot(classId, single[0], single[1], 'religion', '', '', religionCell);
    else if (span) {
      const [d, pid] = span;
      const idx = lessonSlots.findIndex((x: any) => x.id === pid);
      const head = schedule[classId]?.[d]?.[lessonSlots[idx - 1]?.id];
      if (head) updateLessonSlot(classId, d, head ? lessonSlots[idx - 1].id : pid, head.subjectId, head.teacherId, head.roomId || '', { ...head, isDouble: false, isDoubleSpan: false });
      updateLessonSlot(classId, d, pid, 'religion', '', '', religionCell);
    } else { setMsg(`${sub}: nothing to remove.`); return; }
    setRequired(sub, (required[sub] ?? counts[sub] ?? 0) - 1);
    setMsg(`${sub}: -1 period (now Religion).`);
  };

  return (
    <aside className="bg-white rounded-2xl border border-slate-200 shadow-sm p-3 w-full xl:w-72 shrink-0 print:hidden">
      <h4 className="text-sm font-bold text-slate-800 mb-0.5">Periods per week</h4>
      <p className="text-[11px] text-slate-500 mb-2">{cn} — placed / required</p>
      <table className="w-full text-xs">
        <tbody>
          {names.map(n => {
            const have = counts[n] || 0; const need = required[n];
            const ok = need === undefined || have === need;
            return (
              <tr key={n} className="border-t border-slate-100">
                <td className="py-1 pr-1 font-semibold text-slate-700 truncate max-w-[110px]">{n}</td>
                <td className={`py-1 text-center font-bold ${ok ? 'text-emerald-700' : 'text-rose-600'}`}>{have}/{need ?? '—'}</td>
                <td className="py-1 text-right whitespace-nowrap">
                  {n !== 'PS' && <>
                    <button onClick={() => removePeriod(n)} className="w-6 h-6 rounded border border-slate-300 hover:bg-slate-50 font-bold" title="Remove one period">−</button>{' '}
                    <button onClick={() => addPeriod(n)} className="w-6 h-6 rounded border border-slate-300 hover:bg-slate-50 font-bold" title="Add one period">+</button>
                  </>}
                </td>
              </tr>
            );
          })}
          <tr className="border-t border-slate-200"><td className="py-1 font-semibold text-slate-500">Religion</td><td className="py-1 text-center font-bold text-slate-500">{religion}</td><td /></tr>
        </tbody>
      </table>
      {msg && <p className="text-[11px] text-slate-600 mt-2">{msg}</p>}
      <p className="text-[10px] text-slate-400 mt-2">Click any cell in the timetable to change a subject or its time. + takes a Religion period, − turns a period into Religion.</p>
    </aside>
  );
};

export default TimetableAutoPanel;
