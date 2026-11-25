import { letterheadOpen, letterheadClose } from './letterhead';
import { LogRow, MONTH_NAMES, formatDisplayDate } from './logbookSchedule';

export interface LogbookPrintOptions {
  rows: LogRow[];
  subject: string;
  className: string;
  teacherName: string;
  year: number | string;
  schoolName: string;
  districtName: string;
  schoolLogo: string;
  districtLogo: string;
}

const esc = (value: unknown): string =>
  String(value ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// Column widths in percent of the page width (sum = 100).
const COLS = [
  { key: 'month', w: 6.5 }, { key: 'week', w: 4.5 }, { key: 'topic', w: 14 }, { key: 'sub', w: 14 },
  { key: 'from', w: 6.5 }, { key: 'to', w: 6.5 }, { key: 'concept', w: 20.5 },
  { key: 'tsign', w: 8 }, { key: 'hod', w: 9.5 }, { key: 'hos', w: 10 }
];
const PAGE_WIDTH_MM = 279; // width of the narrowest paper (Letter landscape) minus margins, used to estimate wrapping
const ROW_MIN_MM = 10.5;
const LINE_MM = 3.4;
const BUDGET_MM = 133; // table body height available per page

const linesFor = (text: string, widthPct: number): number => {
  const widthMm = PAGE_WIDTH_MM * widthPct / 100 - 2.5;
  const charsPerLine = Math.max(4, Math.floor(widthMm / 1.45));
  let lines = 0;
  String(text).split('\n').forEach(part => {
    // word wrap estimate
    let current = 0;
    let count = 1;
    part.split(/\s+/).forEach(word => {
      const length = word.length;
      if (current === 0) current = length;
      else if (current + 1 + length <= charsPerLine) current += 1 + length;
      else { count += 1; current = length; }
      if (length > charsPerLine) count += Math.floor(length / charsPerLine);
    });
    lines += count;
  });
  return lines;
};

const rowHeightMm = (row: LogRow): number => {
  const l = Math.max(
    linesFor(MONTH_NAMES[row.month], COLS[0].w),
    linesFor(row.topic, COLS[2].w),
    linesFor(row.subtopic, COLS[3].w),
    linesFor(row.concept, COLS[6].w)
  );
  return Math.max(ROW_MIN_MM, l * LINE_MM + 3);
};

export function paginateRows(rows: LogRow[]): { rows: LogRow[]; blanks: number }[] {
  const pages: { rows: LogRow[]; blanks: number }[] = [];
  let current: LogRow[] = [];
  let used = 0;
  rows.forEach(row => {
    const h = rowHeightMm(row);
    if (current.length && used + h > BUDGET_MM) {
      pages.push({ rows: current, blanks: 0 });
      current = [];
      used = 0;
    }
    current.push(row);
    used += h;
  });
  pages.push({ rows: current, blanks: 0 });
  pages.forEach(page => {
    const used = page.rows.reduce((sum, row) => sum + rowHeightMm(row), 0);
    page.blanks = Math.max(0, Math.floor((BUDGET_MM - used) / ROW_MIN_MM));
  });
  return pages;
}

export function createLogbookHtml(o: LogbookPrintOptions): string {
  const pages = paginateRows(o.rows);
  const colgroup = `<colgroup>${COLS.map(c => `<col style="width:${c.w}%">`).join('')}</colgroup>`;
  const thead = `<thead>
    <tr>
      <th rowspan="2">MONTH</th><th rowspan="2">WEEK</th><th rowspan="2">MAIN TOPIC</th><th rowspan="2">SUB TOPIC</th>
      <th colspan="2">DATE</th><th rowspan="2">CONCEPT COVERED</th>
      <th rowspan="2">TEACHER'S<br>SIGNATURE</th><th rowspan="2">H.O.D REMARKS<br>AND SIGNATURE</th><th rowspan="2">H.O.S REMARKS<br>AND SIGNATURE</th>
    </tr>
    <tr><th>FROM</th><th>TO</th></tr>
  </thead>`;
  const body = (page: { rows: LogRow[]; blanks: number }) =>
    page.rows.map(r => `<tr>
      <td class="c">${esc(MONTH_NAMES[r.month])}</td><td class="c">${r.week}</td>
      <td>${esc(r.topic)}</td><td>${esc(r.subtopic)}</td>
      <td class="c">${formatDisplayDate(r.from)}</td><td class="c">${formatDisplayDate(r.to)}</td>
      <td>${esc(r.concept)}</td><td></td><td></td><td></td></tr>`).join('') +
    Array.from({ length: page.blanks }, () => '<tr class="blank">' + '<td></td>'.repeat(10) + '</tr>').join('');

  const header = `
  <div class="header">${letterheadOpen(o.districtLogo)}
    <div class="council">${esc(o.districtName)}</div>
    <div class="school">${esc(o.schoolName)}</div>
    <div class="title">SUBJECT LOG BOOK</div>
  ${letterheadClose(o.schoolLogo)}</div>
  <div class="info">
    <div><span class="lbl">SUBJECT:</span> <span class="val">${esc(o.subject)}</span></div>
    <div><span class="lbl">CLASS:</span> <span class="val">${esc(o.className)}</span></div>
    <div><span class="lbl">YEAR:</span> <span class="val">${esc(o.year)}</span></div>
    <div class="grow"><span class="lbl">TEACHER'S NAME:</span> <span class="val">${esc(o.teacherName)}</span></div>
  </div>`;

  const pageHtml = pages.map((page, i) => `
  <section class="page">
    ${header}
    <table>${colgroup}${thead}<tbody>${body(page)}</tbody></table>
    <div class="foot">${esc(o.schoolName)} &bull; Subject Log Book &bull; Page ${i + 1} of ${pages.length}</div>
  </section>`).join('');

  return `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Log Book - ${esc(o.subject)} - ${esc(o.className)}</title>
<style>
@page { size: A4 landscape; margin: 0; }
* { box-sizing: border-box; }
html, body { margin: 0; padding: 0; background: #fff; }
body { font-family: Arial, Helvetica, sans-serif; color: #000; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
.page { width: 100%; height: 203mm; padding: 6mm 9mm 4mm; page-break-after: always; break-after: page; overflow: hidden; position: relative; }
.page:last-child { page-break-after: auto; break-after: auto; }
.header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 2mm; }
.council { font-size: 10.5pt; font-weight: 700; letter-spacing: .3px; }
.school { font-size: 15pt; font-weight: 900; margin: 1px 0; }
.title { display: inline-block; font-size: 11.5pt; font-weight: 900; letter-spacing: 2px; border: 1.6px solid #000; padding: 1px 14px; margin-top: 2px; background: #e6e6e6; }
.info { display: flex; gap: 8mm; align-items: baseline; font-size: 9.5pt; margin: 2.5mm 0 2mm; }
.info .grow { flex: 1; }
.lbl { font-weight: 800; }
.val { font-weight: 700; border-bottom: 1px solid #000; padding: 0 4px; display: inline-block; min-width: 24mm; }
.info .grow .val { min-width: 60mm; }
table { width: 100%; height: ${BUDGET_MM + 12}mm; border-collapse: collapse; table-layout: fixed; font-size: 8pt; }
th, td { border: 1px solid #000; padding: 1.2mm 1.4mm; vertical-align: middle; overflow-wrap: break-word; line-height: 1.25; }
th { background: #d9d9d9; font-weight: 800; font-size: 7.4pt; text-align: center; text-transform: uppercase; }
td.c { text-align: center; }
tbody tr { height: ${ROW_MIN_MM}mm; }
tbody tr:nth-child(even) td { background: #f4f4f4; }
.foot { position: absolute; left: 9mm; right: 9mm; bottom: 3mm; text-align: center; font-size: 7pt; color: #222; }
</style></head><body>${pageHtml}</body></html>`;
}
