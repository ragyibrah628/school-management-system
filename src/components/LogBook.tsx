import { useEffect, useMemo, useState } from 'react';
import { BookOpen, Printer, Save, Undo2 } from 'lucide-react';
import * as cloud from '../lib/cloud';
import { LESSON_PARTS, resolveLessonSubject, supportedFormsFor } from '../data/LessonPlanData';
import { getDistrictLogo, getSchoolLogo } from '../utils/letterhead';
import {
  LogRow, LogUnit, MONTH_NAMES, Pattern, availableMonths, availableWeeks, buildUnits,
  formatDisplayDate, patternFromWeekly, planFill
} from '../utils/logbookSchedule';
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

const storageKey = (teacherId: string) => `sms_logbook_${teacherId}`;
const norm = (value: unknown) => String(value ?? '').trim().toLowerCase();

const formFromClass = (name: string): number => {
  const digit = String(name).match(/[1-4]/);
  if (digit) return Number(digit[0]);
  const roman = String(name).toUpperCase().match(/\b(IV|III|II|I)\b/);
  return roman ? ({ I: 1, II: 2, III: 3, IV: 4 } as Record<string, number>)[roman[1]] : 0;
};

// Syllabus periods per week (40 minutes) - only used when the teacher's timetable has no lessons for the book.
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

// Teaching days/periods per weekday taken from the timetable (Monday..Friday).
const timetablePattern = (teacherId: string, cls: string, sub: string): Pattern | null => {
  try {
    const data = JSON.parse(localStorage.getItem('tt_timetableData') || 'null');
    const classes = JSON.parse(localStorage.getItem('tt_classes') || '[]');
    const subjects = JSON.parse(localStorage.getItem('tt_subjects') || '[]');
    if (!data?.schedule) return null;
    const classId = classes.find((c: any) => c.name === cls)?.id;
    if (!classId || !data.schedule[classId]) return null;
    const dayNames = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
    const pattern: Pattern = [0, 0, 0, 0, 0];
    Object.entries(data.schedule[classId]).forEach(([day, periods]: [string, any]) => {
      const dayIndex = dayNames.indexOf(norm(day));
      if (dayIndex < 0) return;
      Object.values(periods || {}).forEach((cell: any) => {
        if (!cell || cell.isActivity || cell.isPS || cell.isReligion) return;
        if (cell.teacherId !== teacherId && cell.secondTeacherId !== teacherId) return;
        const first = cell.subjectName || subjects.find((s: any) => s.id === cell.subjectId)?.name;
        const second = cell.secondSubjectName;
        const teachesSecond = cell.secondTeacherId === teacherId && cell.teacherId !== teacherId;
        const cellSubject = teachesSecond ? second : first;
        if (norm(cellSubject) === norm(sub)) pattern[dayIndex] += 1;
      });
    });
    return pattern.some(v => v > 0) ? pattern : null;
  } catch {
    return null;
  }
};

const readRows = (teacherId: string): Record<string, LogRow[]> => {
  try {
    const parsed = JSON.parse(localStorage.getItem(storageKey(teacherId)) || 'null');
    return parsed?.books && typeof parsed.books === 'object' ? parsed.books : {};
  } catch {
    return {};
  }
};

export function LogBook({ teacherId, teacherName, assignments, schoolName, districtName, schoolLogo }: LogBookProps) {
  const books: Book[] = useMemo(() => {
    const seen = new Set<string>();
    const result: Book[] = [];
    (assignments || []).forEach(a => {
      const lessonSubject = resolveLessonSubject(a.sub || '');
      const form = formFromClass(a.cls || '');
      if (!lessonSubject || !form || !supportedFormsFor(lessonSubject as any).includes(form)) return;
      const key = `${norm(a.cls)}|${norm(a.sub)}`;
      if (seen.has(key)) return;
      seen.add(key);
      result.push({ key, cls: a.cls, sub: a.sub, form, lessonSubject });
    });
    return result;
  }, [assignments]);

  const thisYear = new Date().getFullYear();
  const [bookKey, setBookKey] = useState('');
  const [stored, setStored] = useState<Record<string, LogRow[]>>(() => readRows(teacherId));
  const [year, setYear] = useState(thisYear);
  const [month, setMonth] = useState<number | ''>('');
  const [week, setWeek] = useState<number | ''>('');
  const [topic, setTopic] = useState('');
  const [subtopicIndex, setSubtopicIndex] = useState<number | ''>('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!books.some(b => b.key === bookKey)) setBookKey(books[0]?.key || '');
  }, [books, bookKey]);

  useEffect(() => {
    const reload = () => setStored(readRows(teacherId));
    window.addEventListener('cloud-sync-complete', reload);
    return () => window.removeEventListener('cloud-sync-complete', reload);
  }, [teacherId]);

  const book = books.find(b => b.key === bookKey) || null;
  const units: LogUnit[] = useMemo(() => {
    if (!book) return [];
    return buildUnits(LESSON_PARTS.filter(p => p.subject === book.lessonSubject && p.form === book.form));
  }, [book]);

  const rows: LogRow[] = (book && stored[book.key]) || [];
  const lastIndex = rows.length ? Math.max(...rows.map(r => r.unitIndex)) : -1;
  const lastEnd = rows.length ? rows[rows.length - 1].to : null;
  const remaining = units.filter(u => u.index > lastIndex);

  const months = useMemo(() => availableMonths(year, lastEnd), [year, lastEnd]);
  const weeks = month === '' ? [] : availableWeeks(year, month, lastEnd);
  const topics = useMemo(() => [...new Set(remaining.map(u => u.topic))], [remaining]);
  const subtopics = remaining.filter(u => u.topic === topic);

  useEffect(() => { setMonth(''); setWeek(''); setTopic(''); setSubtopicIndex(''); setMessage(''); }, [bookKey, year]);
  useEffect(() => { setWeek(''); }, [month]);
  useEffect(() => { setSubtopicIndex(''); }, [topic]);

  const pattern: Pattern = useMemo(() => {
    if (!book) return [1, 0, 0, 1, 0];
    return timetablePattern(teacherId, book.cls, book.sub) || patternFromWeekly(syllabusPeriodsPerWeek(book.lessonSubject, book.form));
  }, [book, teacherId, stored]);
  const usesTimetable = book ? timetablePattern(teacherId, book.cls, book.sub) !== null : false;

  const preview: LogRow[] = useMemo(() => {
    if (!book || month === '' || week === '' || subtopicIndex === '') return [];
    return planFill({
      units, lastIndex, lastEnd, anchorIndex: Number(subtopicIndex), year, month: Number(month), week: Number(week),
      pattern, batch: `b${Date.now()}`
    });
  }, [book, units, lastIndex, lastEnd, subtopicIndex, year, month, week, pattern]);

  const persist = (next: Record<string, LogRow[]>) => {
    const value = JSON.stringify({ version: 1, books: next });
    try {
      cloud.markAppDataKeyDirty(storageKey(teacherId), value);
      void cloud.syncToCloud().catch(() => undefined);
    } catch {
      try { localStorage.setItem(storageKey(teacherId), value); } catch {}
    }
    setStored(next);
  };

  const save = () => {
    if (!book || preview.length === 0) return;
    persist({ ...stored, [book.key]: [...rows, ...preview] });
    setMonth(''); setWeek(''); setTopic(''); setSubtopicIndex('');
    setMessage(`Saved ${preview.length} subtopic${preview.length > 1 ? 's' : ''} to the log book.`);
  };

  const undo = () => {
    if (!book || rows.length === 0) return;
    const lastBatch = rows[rows.length - 1].batch;
    const count = rows.filter(r => r.batch === lastBatch).length;
    if (!window.confirm(`Remove the last saved entry (${count} subtopic${count > 1 ? 's' : ''})?`)) return;
    persist({ ...stored, [book.key]: rows.filter(r => r.batch !== lastBatch) });
    setMessage('Last entry removed.');
  };

  const print = () => {
    if (!book) return;
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

  const selectClass = 'w-full mt-1 border px-3 py-2.5 rounded-xl text-sm bg-white';
  const progress = units.length ? Math.round(((lastIndex + 1) / units.length) * 100) : 0;

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-2xl border p-5">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2"><BookOpen size={20} /> Subject Log Book</h2>
        <p className="text-xs text-slate-500 mt-1">
          Choose where you have reached; the system fills every subtopic from your last entry, with dates counted on working days (Monday-Friday) only.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 text-sm">
          <div className="col-span-2">
            <label className="text-xs font-bold text-slate-700">Class and subject</label>
            <select className={selectClass} value={bookKey} onChange={e => setBookKey(e.target.value)}>
              {books.map(b => <option key={b.key} value={b.key}>{b.cls} - {b.sub}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-bold text-slate-700">Teacher</label>
            <div className="mt-1 border px-3 py-2.5 rounded-xl bg-slate-50 truncate">{teacherName}</div>
          </div>
          <div>
            <label className="text-xs font-bold text-slate-700">Year</label>
            <select className={selectClass} value={year} onChange={e => setYear(Number(e.target.value))}>
              {[thisYear - 1, thisYear, thisYear + 1].map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
        </div>

        <div className="mt-3 text-xs text-slate-500">
          Progress: {Math.min(lastIndex + 1, units.length)} of {units.length} subtopics ({progress}%)
          {lastEnd && <> &bull; last recorded date {formatDisplayDate(lastEnd)}</>}
          {' '}&bull; {usesTimetable ? 'lesson days taken from your timetable' : `lesson days follow the syllabus (${pattern.reduce((a, b) => a + b, 0)} periods per week)`}
        </div>
      </div>

      <div className="bg-white rounded-2xl border p-5">
        <h3 className="font-bold text-slate-900 text-sm mb-3">Add progress</h3>
        {remaining.length === 0 ? (
          <p className="text-sm text-emerald-700">All subtopics of this class are already in the log book.</p>
        ) : months.length === 0 ? (
          <p className="text-sm text-amber-700">All months of {year} are full. Choose another year.</p>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <label className="text-xs font-bold text-slate-700">Month (when you started the subtopic)</label>
                <select className={selectClass} value={month} onChange={e => setMonth(e.target.value === '' ? '' : Number(e.target.value))}>
                  <option value="">-- Select month --</option>
                  {months.map(m => <option key={m} value={m}>{MONTH_NAMES[m]}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700">Week</label>
                <select className={selectClass} value={week} disabled={month === ''} onChange={e => setWeek(e.target.value === '' ? '' : Number(e.target.value))}>
                  <option value="">-- Select week --</option>
                  {weeks.map(w => <option key={w} value={w}>Week {w}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700">Main topic</label>
                <select className={selectClass} value={topic} onChange={e => setTopic(e.target.value)}>
                  <option value="">-- Select topic --</option>
                  {topics.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700">Sub topic (where you have reached)</label>
                <select className={selectClass} value={subtopicIndex} disabled={!topic} onChange={e => setSubtopicIndex(e.target.value === '' ? '' : Number(e.target.value))}>
                  <option value="">-- Select subtopic --</option>
                  {subtopics.map(u => <option key={u.index} value={u.index}>{u.subtopic} ({u.periods} {u.periods === 1 ? "period" : "periods"})</option>)}
                </select>
              </div>
            </div>

            {preview.length > 0 && (
              <div className="mt-4">
                <div className="text-xs font-bold text-slate-700 mb-1">These rows will be saved:</div>
                <div className="overflow-x-auto border rounded-xl">
                  <table className="w-full text-xs">
                    <thead className="bg-slate-100"><tr>
                      <th className="p-2 text-left">Month</th><th className="p-2">Wk</th><th className="p-2 text-left">Sub topic</th>
                      <th className="p-2">From</th><th className="p-2">To</th>
                    </tr></thead>
                    <tbody>{preview.map(r => (
                      <tr key={r.id} className="border-t">
                        <td className="p-2">{MONTH_NAMES[r.month]}</td><td className="p-2 text-center">{r.week}</td>
                        <td className="p-2">{r.subtopic}</td>
                        <td className="p-2 text-center whitespace-nowrap">{formatDisplayDate(r.from)}</td>
                        <td className="p-2 text-center whitespace-nowrap">{formatDisplayDate(r.to)}</td>
                      </tr>))}
                    </tbody>
                  </table>
                </div>
                <button onClick={save} className="mt-3 w-full bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-semibold flex items-center justify-center gap-2">
                  <Save size={16} /> Save to Log Book
                </button>
              </div>
            )}
          </>
        )}
        {message && <p className="mt-3 text-sm text-emerald-700">{message}</p>}
      </div>

      <div className="bg-white rounded-2xl border p-5">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <h3 className="font-bold text-slate-900 text-sm">Saved log book ({rows.length} subtopics)</h3>
          <div className="flex gap-2">
            <button onClick={undo} disabled={rows.length === 0} className="px-3 py-2 rounded-xl border text-xs font-semibold flex items-center gap-1 disabled:opacity-40"><Undo2 size={14} /> Undo last entry</button>
            <button onClick={print} className="px-3 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold flex items-center gap-1"><Printer size={14} /> Print (A4 landscape)</button>
          </div>
        </div>
        {rows.length === 0 ? (
          <p className="text-sm text-slate-500">Nothing saved yet.</p>
        ) : (
          <div className="overflow-x-auto border rounded-xl">
            <table className="w-full text-xs">
              <thead className="bg-slate-100"><tr>
                <th className="p-2 text-left">Month</th><th className="p-2">Wk</th><th className="p-2 text-left">Main topic</th><th className="p-2 text-left">Sub topic</th>
                <th className="p-2">From</th><th className="p-2">To</th>
              </tr></thead>
              <tbody>{rows.map(r => (
                <tr key={r.id} className="border-t align-top">
                  <td className="p-2">{MONTH_NAMES[r.month]}</td><td className="p-2 text-center">{r.week}</td>
                  <td className="p-2">{r.topic}</td><td className="p-2">{r.subtopic}</td>
                  <td className="p-2 text-center whitespace-nowrap">{formatDisplayDate(r.from)}</td>
                  <td className="p-2 text-center whitespace-nowrap">{formatDisplayDate(r.to)}</td>
                </tr>))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
