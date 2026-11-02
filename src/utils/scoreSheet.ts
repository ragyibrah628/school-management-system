import { englishRemarkForPercentage, evaluateMark } from './markEntry';

export interface ScoreSheetStudent {
  name: string;
  score: number | null;
  maxScore: number;
  theoryScore?: number | null;
  practicalScore?: number | null;
}

export interface ScoreSheetData {
  schoolName: string;
  councilName: string;
  schoolLogo: string;
  className: string;
  subject: string;
  examName: string;
  term: string;
  academicYear: string;
  teacherName: string;
  printedAt: string;
  practicalMode?: boolean;
  students: ScoreSheetStudent[];
}

export interface ScoreSheetRosterStudent {
  name: string;
}

export interface ScoreSheetSavedRow {
  student_name: string;
  score: number | string | null;
  max_score?: number | string | null;
  theory_score?: number | string | null;
  practical_score?: number | string | null;
  teacher_id?: string;
  teacher_name?: string;
}

export function assignedSubjectTeacherName(
  className: string,
  subject: string,
  assignments: Record<string, { cls: string; sub: string }[]>,
  teachers: { id: string; name: string }[],
  savedRows: ScoreSheetSavedRow[]
): string {
  const assignedTeacherId = Object.entries(assignments).find(([, entries]) =>
    entries.some(assignment => assignment.cls === className && assignment.sub === subject)
  )?.[0];
  if (!assignedTeacherId) return 'Unassigned';
  return teachers.find(teacher => teacher.id === assignedTeacherId)?.name
    || savedRows.find(score => score.teacher_id === assignedTeacherId)?.teacher_name
    || 'Assigned teacher';
}

export function buildScoreSheetData(
  details: Omit<ScoreSheetData, 'students'>,
  roster: ScoreSheetRosterStudent[],
  savedRows: ScoreSheetSavedRow[]
): ScoreSheetData {
  return {
    ...details,
    students: roster.map(student => {
      const saved = savedRows.find(score => score.student_name === student.name);
      const numericScore = saved && Number.isFinite(Number(saved.score)) ? Number(saved.score) : null;
      return {
        name: student.name,
        score: numericScore,
        maxScore: Number(saved?.max_score) || 100,
        theoryScore: saved?.theory_score == null ? null : Number(saved.theory_score),
        practicalScore: saved?.practical_score == null ? null : Number(saved.practical_score)
      };
    })
  };
}

const escapeHtml = (value: string): string => value
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;');

const scoreSheetStyles = `
  @page {
    size: A4 portrait;
    margin: 0 0 8mm;
    @bottom-center {
      content: "Page " counter(page) " of " counter(pages);
      font: 7pt Arial, Helvetica, sans-serif;
    }
  }
  * { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; color: #111; font-family: Arial, Helvetica, sans-serif; }
  body { font-size: 8pt; line-height: 1.1; }
  .score-sheet { position: relative; width: 100%; padding: 8mm 12mm 10mm; break-after: page; page-break-after: always; }
  .score-sheet:last-child { break-after: auto; page-break-after: auto; }
  .sheet-header { display: grid; grid-template-columns: 19mm minmax(0, 1fr) 19mm; align-items: center; border-bottom: 1px solid #222; padding-bottom: 2mm; margin-bottom: 2mm; text-align: center; }
  .school-logo { width: 18mm; height: 18mm; object-fit: contain; justify-self: start; }
  .header-spacer { width: 19mm; }
  .council { font-size: 8pt; margin: 0 0 1mm; }
  .school-name { font-size: 13pt; font-weight: 700; text-transform: uppercase; margin: 0 0 1mm; }
  h1 { font-size: 12pt; margin: 1mm 0; }
  .exam-line { font-size: 8pt; margin: 0; }
  .details { display: flex; justify-content: space-between; gap: 3mm; flex-wrap: wrap; margin: 2mm 0; font-size: 7.5pt; }
  table { width: 100%; border-collapse: collapse; table-layout: fixed; }
  thead { display: table-header-group; }
  tr { break-inside: avoid; page-break-inside: avoid; }
  th, td { border: 0.5pt solid #333; padding: 0.8mm 1mm; text-align: left; vertical-align: middle; overflow-wrap: anywhere; }
  th { font-size: 7.5pt; background: #eee; }
  .number { text-align: center; }
  .summary-signature { break-inside: avoid; page-break-inside: avoid; margin-top: 2mm; }
  .summary { border: 1px solid #333; padding: 1.5mm; }
  .summary-title { font-weight: 700; margin-bottom: 1mm; }
  .summary-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1mm 4mm; }
  .grade-distribution { margin-top: 1.5mm; }
  .signature { margin-top: 3mm; display: flex; justify-content: space-between; gap: 4mm; }
  @media screen {
    body { background: #e5e7eb; }
    .score-sheet { width: 210mm; min-height: 297mm; margin: 12px auto; background: white; }
    .score-sheet + .score-sheet { margin-top: 24px; }
  }
  @media print {
    .score-sheet { padding: 5mm 10mm 4mm; }
    .sheet-header { padding-bottom: 1mm; margin-bottom: 1mm; }
    .school-logo { width: 15mm; height: 15mm; }
    .school-name { font-size: 11pt; }
    h1 { font-size: 10pt; }
    .details { gap: 2mm; margin: 1mm 0; font-size: 7pt; }
    th, td { padding: 0.25mm 0.8mm; font-size: 7pt; line-height: 1; }
    th { font-size: 7pt; }
    .summary-signature { margin-top: 1mm; }
    .summary { padding: 1mm; }
    .grade-distribution { margin-top: 1mm; }
    .signature { margin-top: 1.5mm; font-size: 7pt; }
  }
`;

function renderScoreSheetMarkup(data: ScoreSheetData): string {
  const grades = { A: 0, B: 0, C: 0, D: 0, F: 0 };
  const markedStudents = data.students.filter(student => student.score !== null && Number.isFinite(student.score));
  const average = markedStudents.length
    ? markedStudents.reduce((total, student) => total + student.score!, 0) / markedStudents.length
    : null;
  const highest = markedStudents.reduce<ScoreSheetStudent | null>((best, student) =>
    !best || student.score! / student.maxScore > best.score! / best.maxScore ? student : best, null);
  const lowest = markedStudents.reduce<ScoreSheetStudent | null>((best, student) =>
    !best || student.score! / student.maxScore < best.score! / best.maxScore ? student : best, null);
  const columns = data.practicalMode ? [
    { key: 'number', label: 'No.', width: '6%', numeric: true },
    { key: 'name', label: 'Student name', width: '28%', numeric: false },
    { key: 'theory', label: 'Theory (/100)', width: '14%', numeric: true },
    { key: 'practical', label: 'Practical (/50)', width: '14%', numeric: true },
    { key: 'marks', label: 'Final (%)', width: '12%', numeric: true },
    { key: 'grade', label: 'Grade', width: '9%', numeric: true },
    { key: 'remarks', label: 'Remarks', width: '17%', numeric: false }
  ] : [
    { key: 'number', label: 'No.', width: '9%', numeric: true },
    { key: 'name', label: 'Student name', width: '43%', numeric: false },
    { key: 'marks', label: 'Marks', width: '17%', numeric: true },
    { key: 'grade', label: 'Grade', width: '10%', numeric: true },
    { key: 'remarks', label: 'Remarks', width: '21%', numeric: false }
  ];

  for (const student of markedStudents) {
    const grade = evaluateMark(String(student.score), student.maxScore).grade as keyof typeof grades;
    grades[grade] += 1;
  }

  const logo = data.schoolLogo
    ? `<img class="school-logo" src="${escapeHtml(data.schoolLogo)}" alt="School logo">`
    : '<span class="header-spacer" aria-hidden="true"></span>';
  const rows = data.students.map((student, index) => {
    const hasMark = student.score !== null && Number.isFinite(student.score);
    const mark = hasMark
      ? data.practicalMode ? `${student.score!.toFixed(1)}%` : `${student.score} / ${student.maxScore}`
      : '-';
    const percentage = hasMark ? student.score! / student.maxScore * 100 : null;
    const details = percentage === null ? { grade: '-', remark: '-' } : {
      grade: evaluateMark(String(student.score), student.maxScore).grade,
      remark: englishRemarkForPercentage(percentage)
    };
    const values: Record<string, string> = {
      number: String(index + 1),
      name: escapeHtml(student.name.trim().replace(/\s+/g, ' ')),
      theory: student.theoryScore == null ? '-' : String(student.theoryScore),
      practical: student.practicalScore == null ? '-' : String(student.practicalScore),
      marks: mark,
      grade: details.grade,
      remarks: details.remark
    };
    return `<tr>${columns.map(column => `<td class="${column.numeric ? 'number' : ''}">${values[column.key]}</td>`).join('')}</tr>`;
  }).join('');

  const formatMark = (student: ScoreSheetStudent | null) =>
    student
      ? data.practicalMode ? `${student.score!.toFixed(1)}%` : `${student.score} / ${student.maxScore}`
      : '-';

  return `<main class="score-sheet">
  <header class="sheet-header">
    ${logo}
    <div><p class="council">${escapeHtml(data.councilName)}</p><p class="school-name">${escapeHtml(data.schoolName)}</p><h1>${escapeHtml(data.className)} ${escapeHtml(data.subject)} Score Sheet</h1><p class="exam-line">${escapeHtml(data.examName)} | ${escapeHtml(data.term)} | ${escapeHtml(data.academicYear)}</p></div>
    <span class="header-spacer" aria-hidden="true"></span>
  </header>
  <div class="details"><span>Subject teacher: ${escapeHtml(data.teacherName)}</span><span>Date printed: ${escapeHtml(data.printedAt)}</span><span>Students: ${data.students.length}</span></div>
  <table>
    <colgroup>${columns.map(column => `<col style="width: ${column.width}">`).join('')}</colgroup>
    <thead><tr>${columns.map(column => `<th class="${column.numeric ? 'number' : ''}">${column.label}</th>`).join('')}</tr></thead>
    <tbody>${rows}</tbody>
  </table>
  <section class="summary-signature">
    <div class="summary">
      <div class="summary-title">Summary</div>
      <div class="summary-grid">
        <span>Students with marks: ${markedStudents.length}</span>
        <span>Class average: ${average === null ? '-' : average.toFixed(1)}</span>
        <span>Highest: ${formatMark(highest)}</span>
        <span>Lowest: ${formatMark(lowest)}</span>
      </div>
      <div class="grade-distribution">Grade distribution: A ${grades.A} | B ${grades.B} | C ${grades.C} | D ${grades.D} | F ${grades.F}</div>
    </div>
    <div class="signature"><span>Subject teacher: ____________________</span><span>Signature: ____________________</span><span>Date: __________</span></div>
  </section>
</main>
`;
}

export function createScoreSheetsHtml(sheets: ScoreSheetData[]): string {
  const contents = sheets.map(renderScoreSheetMarkup).join('\n');
  const title = sheets.length === 1
    ? `${escapeHtml(sheets[0].className)} ${escapeHtml(sheets[0].subject)} Score Sheet`
    : 'Subject Score Sheets';
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>${title}</title>
<style>${scoreSheetStyles}</style>
</head>
<body>
${contents}
</body>
</html>`;
}

export function createScoreSheetHtml(data: ScoreSheetData): string {
  return createScoreSheetsHtml([data]);
}
