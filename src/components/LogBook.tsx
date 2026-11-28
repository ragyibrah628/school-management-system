import { useEffect, useMemo, useState } from 'react';
import { BookOpen, Plus, Printer, RefreshCw, Save, Trash2 } from 'lucide-react';
import * as cloud from '../lib/cloud';
import { LESSON_PARTS, resolveLessonSubject, supportedFormsFor } from '../data/LessonPlanData';
import { getDistrictLogo, getSchoolLogo } from '../utils/letterhead';
import { displayClass, levelOfClass } from '../utils/promotion';
import { LogRow, LogUnit, MONTH_NAMES, buildUnits, formatDisplayDate, toIso } from '../utils/logbookSchedule';
import { AutoPlan, LogCalendar, PublicHoliday, RemovedDay, SchoolHoliday, emptyCalendar, patternFromStart, planAuto, publicHolidaysOf } from '../utils/logbookAuto';
import { createLogbookHtml } from '../utils/logbookPrint';

interface LogBookProps {
  teacherId: string;
  teacherName: string;
  assignments: { cls: string; sub: string }[];
  schoolName: string;
  districtName: string;
  schoolLogo: string;
}

type Book = { key: string; cls: string; sub: string; form: number; lessonSubject: string };
interface BookRecord { startDate: string; upTo?: string; rows?: LogRow[]; savedAt?: string }
interface Store {
  version: 2;
  books: Record<string, BookRecord>;      // key: <book>|<year>
  calendars: Record<string, LogCalendar>; // key: year
  legacy: Record<string, LogRow[]>;       // log books saved with the older method
}

const storageKey = (teacherId: string) => `sms_logbook_${teacherId}`;
const norm = (value: unknown) => String(value ?? '').trim().toLowerCase();
const newId = () => `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;

// Syllabus periods per week (40 minutes). The log book follows the syllabus, not the timetable.
const syllabusPeriodsPerWeek = (subject: string, form: number): number => {
  const upper = form >= 3;
  switch (subject) {
    case 'Computer Science': return 2;
    case 'Mathematics': return 5;
    case 'Business Studies': return upper ? 4 : 2;
    case 'English Language': return 5;
    case 'Geography': return 3;
    case 'History': return upper ? 3 : 2;
    case 'Physics': case 'Chemistry': case 'Biology': return upper ? 4 : 3;
    case 'Historia ya Tanzania na Maadili': return 2;
    case 'Kiswahili': return 4;
    default: return 2;
  }
};

const emptyStore = (): Store => ({ version: 2, books: {}, calendars: {}, legacy: {} });

const readStore = (teacherId: string): Store => {
  try {
    const parsed = JSON.parse(localStorage.getItem(storageKey(teacherId)) || 'null');
    if (!parsed || typeof parsed !== 'object') return emptyStore();
    if (parsed.version === 2) {
      return { version: 2, books: parsed.books || {}, calendars: parsed.calendars || {}, legacy: parsed.legacy || {} };
    }
    const legacy: Record<string, LogRow[]> = {};
    Object.entries(parsed.books || {}).forEach(([key, value]) => { if (Array.isArray(value) && value.length) legacy[key] = value as LogRow[]; });
    return { ...emptyStore(), legacy };
  } catch {
    return emptyStore();
  }
};

const signature = (rows: LogRow[], upTo: string, startDate: string) =>
  JSON.stringify([startDate, upTo, rows.map(r => [r.unitIndex, r.from, r.to, r.partial ? 1 : 0])]);

export function LogBook({ teacherId, teacherName, assignments, schoolName, districtName, schoolLogo }: LogBookProps) {
  const books: Book[] = useMemo(() => {
    const seen = new Set<string>();
    const result: Book[] = [];
    (assignments || []).forEach(a => {
      const lessonSubject = resolveLessonSubject(a.sub || '');
      const form = levelOfClass(a.cls || '');
      if (!lessonSubject || !form || !supportedFormsFor(lessonSubject as any).includes(form)) return;
      const key = `${norm(displayClass(a.cls))}|${norm(a.sub)}`;
      if (seen.has(key)) return;
      seen.add(key);
      result.push({ key, cls: displayClass(a.cls), sub: a.sub, form, lessonSubject });
    });
    return result;
  }, [assignments]);

  const now = new Date();
  const thisYear = now.getFullYear();
  const [bookKey, setBookKey] = useState('');
  const [store, setStore] = useState<Store>(() => readStore(teacherId));
  const [year, setYear] = useState(thisYear);
  const [upTo, setUpTo] = useState('');
  const [message, setMessage] = useState('');
  const [calMessage, setCalMessage] = useState('');
  const [holidayDraft, setHolidayDraft] = useState({ from: '', to: '', reason: '' });
  const [removedDraft, setRemovedDraft] = useState({ date: '', reason: '' });

  useEffect(() => {
    if (!books.some(b => b.key === bookKey)) setBookKey(books[0]?.key || '');
  }, [books, bookKey]);

  useEffect(() => {
    const reload = () => setStore(readStore(teacherId));
    window.addEventListener('cloud-sync-complete', reload);
    return () => window.removeEventListener('cloud-sync-complete', reload);
  }, [teacherId]);

  const book = books.find(b => b.key === bookKey) || null;
  const recordKey = book ? `${book.key}|${year}` : '';
  const record: BookRecord | undefined = recordKey ? store.books[recordKey] : undefined;
  const calendar: LogCalendar = store.calendars[String(year)] || emptyCalendar(year);
  const legacyRows: LogRow[] = (book && (store.legacy[book.key] || [])) || [];

  // Log books never go beyond today. A past year can be completed up to its last date.
  const todayIso = year < thisYear ? `${year}-12-31` : toIso(now);
  const startDate = record?.startDate || '';

  useEffect(() => { setUpTo(record?.upTo || todayIso); setMessage(''); /* eslint-disable-next-line */ }, [bookKey, year]);

  const units: LogUnit[] = useMemo(() => {
    if (!book) return [];
    return buildUnits(LESSON_PARTS.filter(p => p.subject === book.lessonSubject && p.form === book.form));
  }, [book]);

  const perWeek = book ? syllabusPeriodsPerWeek(book.lessonSubject, book.form) : 2;
  const pattern = useMemo(() => patternFromStart(perWeek, startDate), [perWeek, startDate]);

  const plan: AutoPlan = useMemo(() => planAuto({
    units, start: startDate, upTo: upTo || todayIso, today: todayIso, pattern, calendar, batch: 'auto'
  }), [units, startDate, upTo, todayIso, pattern, calendar]);

  const publicList = useMemo(() => publicHolidaysOf(year), [year]);
  const saved = !!record?.rows;
  const dirty = !saved || signature(plan.rows, plan.until, startDate) !== signature(record?.rows || [], record?.upTo || '', record?.startDate || '');

  const persist = (next: Store) => {
    const value = JSON.stringify(next);
    try {
      cloud.markAppDataKeyDirty(storageKey(teacherId), value);
      void cloud.syncToCloud().catch(() => undefined);
    } catch {
      try { localStorage.setItem(storageKey(teacherId), value); } catch {}
    }
    setStore(next);
  };

  const updateRecord = (patch: Partial<BookRecord>) => {
    if (!recordKey) return;
    persist({ ...store, books: { ...store.books, [recordKey]: { startDate: '', ...(record || {}), ...patch } } });
  };
  const updateCalendar = (patch: Partial<LogCalendar>) =>
    persist({ ...store, calendars: { ...store.calendars, [String(year)]: { ...calendar, ...patch } } });

  const setStart = (value: string) => { setMessage(''); updateRecord({ startDate: value }); };

  const addHoliday = () => {
    const { from, to, reason } = holidayDraft;
    if (!from || !to) { setCalMessage('Choose the first and last date of the holiday.'); return; }
    if (from > to) { setCalMessage('The holiday cannot end before it starts.'); return; }
    updateCalendar({ holidays: [...calendar.holidays, { id: newId(), from, to, reason: reason.trim() || 'School holiday' }] });
    setHolidayDraft({ from: '', to: '', reason: '' });
    setCalMessage('');
  };
  const addRemoved = () => {
    if (!removedDraft.date) { setCalMessage('Choose the date to remove.'); return; }
    if (calendar.removedDays.some((r: RemovedDay) => r.date === removedDraft.date)) { setCalMessage('That date is already removed.'); return; }
    updateCalendar({ removedDays: [...calendar.removedDays, { id: newId(), date: removedDraft.date, reason: removedDraft.reason.trim() || 'Day removed' }] });
    setRemovedDraft({ date: '', reason: '' });
    setCalMessage('');
  };

  const save = () => {
    if (!book || plan.rows.length === 0) return;
    if (legacyRows.length && !window.confirm('This class has a log book saved with the old method. Saving the new automatic log book will replace it. Continue?')) return;
    const legacy = { ...store.legacy };
    delete legacy[book.key];
    persist({
      ...store,
      legacy,
      books: { ...store.books, [recordKey]: { startDate, upTo: plan.until, rows: plan.rows, savedAt: new Date().toISOString() } }
    });
    setMessage(`Log book saved up to ${formatDisplayDate(plan.until)}.`);
  };

  const removeSaved = () => {
    if (!book || !saved) return;
    if (!window.confirm('Delete the saved log book of this class and year? Your dates and holidays stay.')) return;
    persist({ ...store, books: { ...store.books, [recordKey]: { startDate } } });
    setMessage('Saved log book deleted.');
  };

  const print = (rows: LogRow[]) => {
    if (!book || rows.length === 0) return;
    const html = createLogbookHtml({
      rows, subject: book.sub, className: book.cls, teacherName, year,
      schoolName, districtName, schoolLogo: schoolLogo || getSchoolLogo(), districtLogo: getDistrictLogo()
    });
    const win = window.open('', '_blank');
    if (!win) { alert('Please allow pop-ups to print the log book.'); return; }
    win.document.write(html);
    win.document.close();
    win.focus();
    setTimeout(() => { try { win.print(); } catch {} }, 700);
  };

  if (books.length === 0) {
    return (
      <div className="bg-white rounded-2xl border p-6 text-sm text-slate-600">
        <h2 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2"><BookOpen size={20} /> Log Book</h2>
        No class and subject with a syllabus is assigned to you yet. Ask the admin to assign your teaching classes and subjects
        (the log book follows the same syllabus topics as the Lesson Plan).
      </div>
    );
  }

  const field = 'w-full mt-1 border px-3 py-2.5 rounded-xl text-sm bg-white';
  const label = 'text-xs font-bold text-slate-700';
  const smallBtn = 'px-3 py-2 rounded-xl border text-xs font-semibold flex items-center gap-1';

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-2xl border p-5">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2"><BookOpen size={20} /> Subject Log Book</h2>
        <p className="text-xs text-slate-500 mt-1">
          Enter the date of your first lesson. The system builds the log book from that date up to the day you choose,
          following the syllabus periods and skipping weekends, holidays and the days you remove.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 text-sm">
          <div className="col-span-2">
            <label className={label}>Class and subject</label>
            <select className={field} value={bookKey} onChange={e => setBookKey(e.target.value)}>
              {books.map(b => <option key={b.key} value={b.key}>{b.cls} - {b.sub}</option>)}
            </select>
          </div>
          <div>
            <label className={label}>Teacher</label>
            <div className="mt-1 border px-3 py-2.5 rounded-xl bg-slate-50 truncate">{teacherName}</div>
          </div>
          <div>
            <label className={label}>Year</label>
            <select className={field} value={year} onChange={e => setYear(Number(e.target.value))}>
              {[thisYear - 1, thisYear].map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
        </div>
        {legacyRows.length > 0 && !saved && (
          <div className="mt-4 rounded-xl border border-amber-300 bg-amber-50 p-3 text-xs text-amber-900 flex flex-wrap items-center justify-between gap-2">
            <span>An older log book of {legacyRows.length} subtopics exists for this class. It is replaced when you save the new automatic log book.</span>
            <button onClick={() => print(legacyRows)} className={smallBtn + ' bg-white'}><Printer size={14} /> Print old log book</button>
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl border p-5">
        <h3 className="font-bold text-slate-900 text-sm mb-3">1. Dates of the year</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <div>
            <label className={label}>Date of your first lesson of {year}</label>
            <input type="date" className={field} value={startDate} min={`${year}-01-01`} max={`${year}-12-31`} onChange={e => setStart(e.target.value)} />
          </div>
          <div>
            <label className={label}>Date of your last lesson of the year</label>
            <input type="date" className={field} value={calendar.endDate} min={`${year}-01-01`} max={`${year}-12-31`}
              onChange={e => updateCalendar({ endDate: e.target.value })} />
          </div>
        </div>
        <p className="text-xs text-slate-500 mt-2">
          The syllabus gives {book?.sub} {perWeek} periods per week for {book?.cls}. The last lesson date is used to spread all subtopics over the whole year
          (it starts as 22 November; change it if your school closes on another date).
        </p>
      </div>

      <div className="bg-white rounded-2xl border p-5">
        <h3 className="font-bold text-slate-900 text-sm mb-1">2. Days that are not counted</h3>
        <p className="text-xs text-slate-500 mb-3">Weekends are never counted. Add school holidays and any other day without lessons. These apply to all your classes for {year}.</p>

        <div className="text-xs font-bold text-slate-700 mb-1">School holidays</div>
        <div className="grid grid-cols-2 sm:grid-cols-[1fr_1fr_1.4fr_auto] gap-2 text-sm items-end">
          <div><label className={label}>From</label><input type="date" className={field} value={holidayDraft.from} min={`${year}-01-01`} max={`${year}-12-31`} onChange={e => setHolidayDraft({ ...holidayDraft, from: e.target.value })} /></div>
          <div><label className={label}>To</label><input type="date" className={field} value={holidayDraft.to} min={holidayDraft.from || `${year}-01-01`} max={`${year}-12-31`} onChange={e => setHolidayDraft({ ...holidayDraft, to: e.target.value })} /></div>
          <div className="col-span-2 sm:col-span-1"><label className={label}>Reason (optional)</label><input className={field} placeholder="e.g. Term holiday" value={holidayDraft.reason} onChange={e => setHolidayDraft({ ...holidayDraft, reason: e.target.value })} /></div>
          <button onClick={addHoliday} className="col-span-2 sm:col-span-1 px-4 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-semibold flex items-center justify-center gap-1"><Plus size={14} /> Add</button>
        </div>
        {calendar.holidays.length > 0 && (
          <ul className="mt-2 space-y-1 text-xs">
            {[...calendar.holidays].sort((a, b) => a.from.localeCompare(b.from)).map(h => (
              <li key={h.id} className="flex items-center justify-between gap-2 border rounded-lg px-3 py-2 bg-slate-50">
                <span>{formatDisplayDate(h.from)} - {formatDisplayDate(h.to)} &bull; {h.reason}</span>
                <button aria-label="Remove holiday" onClick={() => updateCalendar({ holidays: calendar.holidays.filter((x: SchoolHoliday) => x.id !== h.id) })} className="text-rose-600"><Trash2 size={14} /></button>
              </li>
            ))}
          </ul>
        )}

        <div className="text-xs font-bold text-slate-700 mt-4 mb-1">Remove a single day (Eid, sports day, school event...)</div>
        <div className="grid grid-cols-2 sm:grid-cols-[1fr_1.8fr_auto] gap-2 text-sm items-end">
          <div><label className={label}>Date</label><input type="date" className={field} value={removedDraft.date} min={`${year}-01-01`} max={`${year}-12-31`} onChange={e => setRemovedDraft({ ...removedDraft, date: e.target.value })} /></div>
          <div className="col-span-2 sm:col-span-1"><label className={label}>What was it?</label><input className={field} placeholder="e.g. Eid celebration" value={removedDraft.reason} onChange={e => setRemovedDraft({ ...removedDraft, reason: e.target.value })} /></div>
          <button onClick={addRemoved} className="col-span-2 sm:col-span-1 px-4 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-semibold flex items-center justify-center gap-1"><Plus size={14} /> Remove day</button>
        </div>
        {calendar.removedDays.length > 0 && (
          <ul className="mt-2 space-y-1 text-xs">
            {[...calendar.removedDays].sort((a, b) => a.date.localeCompare(b.date)).map(r => (
              <li key={r.id} className="flex items-center justify-between gap-2 border rounded-lg px-3 py-2 bg-slate-50">
                <span>{formatDisplayDate(r.date)} &bull; {r.reason}</span>
                <button aria-label="Put the day back" onClick={() => updateCalendar({ removedDays: calendar.removedDays.filter((x: RemovedDay) => x.id !== r.id) })} className="text-rose-600"><Trash2 size={14} /></button>
              </li>
            ))}
          </ul>
        )}

        {calMessage && <p className="mt-2 text-xs text-rose-600">{calMessage}</p>}

        <details className="mt-4 text-xs">
          <summary className="cursor-pointer font-bold text-slate-700">Public holidays skipped automatically (tap to check)</summary>
          <p className="text-slate-500 mt-2">Untick a holiday if lessons were held that day. Eid and Maulid change every year, add them under "Remove a single day".</p>
          <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-1">
            {publicList.map((p: PublicHoliday) => {
              const on = calendar.publicOn[p.key] !== undefined ? calendar.publicOn[p.key] : p.defaultOn;
              return (
                <label key={p.key} className="flex items-center gap-2 border rounded-lg px-3 py-2 bg-slate-50">
                  <input type="checkbox" checked={on} onChange={e => updateCalendar({ publicOn: { ...calendar.publicOn, [p.key]: e.target.checked } })} />
                  <span>{formatDisplayDate(p.date)} &bull; {p.name}</span>
                </label>
              );
            })}
          </div>
        </details>
      </div>

      <div className="bg-white rounded-2xl border p-5">
        <h3 className="font-bold text-slate-900 text-sm mb-3">3. Log book</h3>
        {!startDate ? (
          <p className="text-sm text-amber-700">Enter the date of your first lesson above to create the log book.</p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-3 items-end text-sm">
              <div>
                <label className={label}>Make the log book up to (not later than today)</label>
                <input type="date" className={field} value={plan.until} min={startDate} max={todayIso <= calendar.endDate ? todayIso : calendar.endDate}
                  onChange={e => { setMessage(''); setUpTo(e.target.value); }} />
              </div>
              <button onClick={() => { setMessage(''); setUpTo(todayIso); }} className="px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-semibold flex items-center justify-center gap-1">
                <RefreshCw size={14} /> Update Log Book to today
              </button>
            </div>

            <div className="mt-3 text-xs text-slate-600 space-y-1">
              <div>
                {plan.totalSlots} teaching periods in the year ({perWeek} per week, after removing weekends and holidays) &bull; {plan.usedSlots} used up to {formatDisplayDate(plan.until)}
                &bull; {plan.unitsStarted} of {plan.unitsTotal} subtopics reached ({plan.coveredPercent}% of the syllabus)
              </div>
              {saved && record?.upTo && <div>Saved log book is up to {formatDisplayDate(record.upTo)}{record.upTo < todayIso ? '. Press "Update Log Book to today" to bring it forward.' : '.'}</div>}
              {plan.warnings.map((w: string) => <div key={w} className="text-amber-700">{w}</div>)}
            </div>

            <div className="flex flex-wrap gap-2 mt-4">
              <button onClick={save} disabled={plan.rows.length === 0 || (!dirty && saved)}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-semibold flex items-center gap-1 disabled:opacity-40">
                <Save size={14} /> {saved ? (dirty ? 'Save changes' : 'Saved') : 'Save Log Book'}
              </button>
              <button onClick={() => print(plan.rows)} disabled={plan.rows.length === 0} className="px-4 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-semibold flex items-center gap-1 disabled:opacity-40">
                <Printer size={14} /> Print (A4 landscape)
              </button>
              {saved && <button onClick={removeSaved} className={smallBtn + ' text-rose-700'}><Trash2 size={14} /> Delete saved log book</button>}
            </div>
            {message && <p className="mt-3 text-sm text-emerald-700">{message}</p>}

            {plan.rows.length === 0 ? (
              <p className="text-sm text-slate-500 mt-4">No lessons yet up to this date.</p>
            ) : (
              <div className="overflow-x-auto border rounded-xl mt-4">
                <table className="w-full text-xs">
                  <thead className="bg-slate-100"><tr>
                    <th className="p-2 text-left">Month</th><th className="p-2">Wk</th><th className="p-2 text-left">Main topic</th><th className="p-2 text-left">Sub topic</th>
                    <th className="p-2">From</th><th className="p-2">To</th>
                  </tr></thead>
                  <tbody>{plan.rows.map((r: LogRow) => (
                    <tr key={r.id} className="border-t align-top">
                      <td className="p-2">{MONTH_NAMES[r.month]}</td><td className="p-2 text-center">{r.week}</td>
                      <td className="p-2">{r.topic}</td>
                      <td className="p-2">{r.subtopic}{r.partial && <span className="ml-1 text-[10px] text-amber-700">(in progress)</span>}</td>
                      <td className="p-2 text-center whitespace-nowrap">{formatDisplayDate(r.from)}</td>
                      <td className="p-2 text-center whitespace-nowrap">{formatDisplayDate(r.to)}</td>
                    </tr>))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
