// Yearly promotion: Form 1 -> 2 -> 3 -> 4, Form 4 graduate and leave the system.
// Pure helpers (no React). Exam scores are never touched here.
import { letterheadOpen, letterheadClose } from './letterhead';

export interface RosterStudent { id?: string; name: string; [key: string]: any }
export type Roster = Record<string, RosterStudent[]>;

const ROMAN = ['', 'I', 'II', 'III', 'IV'];

// "Form IA" -> level 1, prefix "Form ", token "I", suffix "A"; "Form 2" -> level 2 digit style.
export function parseClass(name: string): { level: number; prefix: string; suffix: string; roman: boolean } | null {
  const match = String(name).match(/^(.*?)(IV|III|II|I|[1-4])(?![A-Za-z]{2,}|\d)([A-Za-z]{0,3}(?:\s.*)?)?$/i);
  if (!match) return null;
  const token = match[2].toUpperCase();
  const roman = /^[IV]+$/.test(token);
  const level = roman ? ROMAN.indexOf(token) : Number(token);
  if (level < 1 || level > 4) return null;
  // the character before the token must not be a letter ("Mixed1")
  if (/[A-Za-z]$/.test(match[1])) return null;
  return { level, prefix: match[1], suffix: match[3] || '', roman };
}

export function nextClassName(name: string): string | null {
  const parsed = parseClass(name);
  if (!parsed || parsed.level >= 4) return null;
  const nextLevel = parsed.level + 1;
  return `${parsed.prefix}${parsed.roman ? ROMAN[nextLevel] : nextLevel}${parsed.suffix}`;
}

export const levelOfClass = (name: string): number => parseClass(name)?.level || 0;

export interface PromotionPlan {
  next: Roster;
  moves: { from: string; to: string; count: number }[];
  graduates: { cls: string; students: RosterStudent[] }[];
  deleted: { cls: string; id?: string; name: string }[];
  untouched: string[];       // classes whose name has no Form level
  missingTargets: string[];  // classes that would be needed but do not exist
  registeredTo: Record<string, string | null>; // class -> class its registered counts move to (null = removed)
}

export function buildPromotionPlan(students: Roster, schoolClasses: string[], now = Date.now()): PromotionPlan {
  const allClasses = [...new Set([...schoolClasses, ...Object.keys(students)])];
  const plan: PromotionPlan = { next: {}, moves: [], graduates: [], deleted: [], untouched: [], missingTargets: [], registeredTo: {} };
  allClasses.forEach(cls => { plan.next[cls] = []; });
  let counter = 0;

  allClasses.forEach(cls => {
    const rows = students[cls] || [];
    const parsed = parseClass(cls);
    if (!parsed) {
      plan.untouched.push(cls);
      plan.next[cls] = rows;
      plan.registeredTo[cls] = cls;
      return;
    }
    if (parsed.level === 4) {
      plan.graduates.push({ cls, students: rows });
      rows.forEach(s => plan.deleted.push({ cls, id: s.id, name: s.name }));
      plan.registeredTo[cls] = null;
      return;
    }
    const target = nextClassName(cls)!;
    if (!allClasses.includes(target) && rows.length > 0) plan.missingTargets.push(`${cls} -> ${target}`);
    // promoted students get new ids so the old class record can be deleted without removing them from the new class
    plan.next[target] = [
      ...(plan.next[target] || []),
      ...rows.map(s => ({ ...s, id: `pr-${now.toString(36)}-${(counter++).toString(36)}`, updatedAt: new Date(now).toISOString() }))
    ];
    rows.forEach(s => plan.deleted.push({ cls, id: s.id, name: s.name }));
    plan.moves.push({ from: cls, to: target, count: rows.length });
    plan.registeredTo[cls] = target;
  });
  return plan;
}

// Names of students that remain after promotion (to know whose behavior must be removed).
export const remainingNames = (next: Roster): Set<string> => new Set(Object.values(next).flat().map(s => s.name));

// ----- backup (download) -----
const BACKUP_KEYS = [
  'sms_students', 'sms_scores', 'sms_behavior', 'sms_exams', 'sms_exam_submissions', 'sms_registered_students',
  'sms_school_classes', 'sms_class_teachers', 'sms_teaching_assignments', 'sms_school_subjects'
];
export function createBackupJson(): string {
  const data: Record<string, unknown> = {};
  BACKUP_KEYS.forEach(key => {
    try { const raw = localStorage.getItem(key); data[key] = raw === null ? null : JSON.parse(raw); } catch { data[key] = null; }
  });
  return JSON.stringify({ type: 'school-backup', createdAt: new Date().toISOString(), data }, null, 1);
}

// ----- print of Form IV data -----
const esc = (v: unknown) => String(v ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export interface GraduatePrintOptions {
  graduates: { cls: string; students: RosterStudent[] }[];
  scores: any[];
  exams: any[];
  behavior: Record<string, Record<string, string>>;
  schoolName: string;
  districtName: string;
  schoolLogo: string;
  districtLogo: string;
}

export function createGraduatesHtml(o: GraduatePrintOptions): string {
  const sections: string[] = [];
  o.graduates.forEach(({ cls, students }) => {
    const names = students.map(s => s.name).sort((a, b) => a.localeCompare(b));
    const classScores = o.scores.filter(s => s.class_name === cls);
    const examIds = [...new Set(classScores.map(s => s.exam_id))];
    let body = '';
    if (examIds.length === 0) body = '<p class="note">No exam results saved for this class.</p>';
    examIds.forEach(examId => {
      const examScores = classScores.filter(s => s.exam_id === examId);
      const examName = o.exams.find(e => e.id === examId)?.name || examScores[0]?.exam_name || examId;
      const subjects = [...new Set(examScores.map(s => s.subject))].sort();
      const rows = names.map((name, i) => {
        const cells = subjects.map(sub => {
          const sc = examScores.find(s => s.student_name === name && s.subject === sub);
          return sc && sc.score !== undefined && sc.score !== null && sc.score !== '' ? Number(sc.score) : null;
        });
        const nums = cells.filter((v): v is number => v !== null);
        const total = nums.reduce((a, b) => a + b, 0);
        const avg = nums.length ? (total / nums.length).toFixed(1) : '-';
        return `<tr><td class="c">${i + 1}</td><td class="n">${esc(name)}</td>${cells.map(v => `<td class="c">${v === null ? '-' : v}</td>`).join('')}<td class="c b">${nums.length ? total : '-'}</td><td class="c b">${avg}</td></tr>`;
      }).join('');
      body += `<h3>${esc(examName)}</h3><table><thead><tr><th>#</th><th>Student</th>${subjects.map(s => `<th>${esc(s)}</th>`).join('')}<th>Total</th><th>Avg</th></tr></thead><tbody>${rows}</tbody></table>`;
    });
    sections.push(`<section class="page"><h2>${esc(cls)} &mdash; ${names.length} students</h2>${body}</section>`);
  });
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Form IV data</title><style>
@page { size: A4 landscape; margin: 0; }
*{box-sizing:border-box} body{font-family:Arial,sans-serif;color:#000;margin:0;padding:8mm 10mm}
.header{text-align:center;border-bottom:2px solid #000;padding-bottom:3mm;margin-bottom:3mm}
.council{font-size:11pt;font-weight:700}.school{font-size:16pt;font-weight:900}.title{font-size:11pt;font-weight:800;letter-spacing:1.5px;margin-top:2px}
.page{page-break-after:always;break-after:page}.page:last-child{page-break-after:auto}
h2{font-size:12pt;margin:3mm 0}h3{font-size:10pt;margin:4mm 0 1mm;background:#e0e0e0;padding:1mm 2mm}
table{width:100%;border-collapse:collapse;font-size:8pt;margin-bottom:3mm}
th,td{border:1px solid #000;padding:1mm 1.5mm}th{background:#d9d9d9}td.c{text-align:center}td.b{font-weight:700}td.n{white-space:nowrap}
.note{font-size:9pt}
</style></head><body><div class="header">${letterheadOpen(o.districtLogo)}<div class="council">${esc(o.districtName)}</div><div class="school">${esc(o.schoolName)}</div><div class="title">FORM FOUR LEAVERS &mdash; STUDENTS AND RESULTS</div>${letterheadClose(o.schoolLogo)}</div>${sections.join('') || '<p>No Form IV students.</p>'}</body></html>`;
}
