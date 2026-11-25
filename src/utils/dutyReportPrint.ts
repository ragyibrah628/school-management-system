// Printable Teacher's Duty Report (A4 portrait, fills the whole page, one page).
import { letterheadOpen, letterheadClose } from './letterhead';

export interface DutyPrintOptions {
  districtName: string;
  schoolName: string;
  motto: string;
  schoolLogo: string;
  districtLogo: string;
  sections: { id: string; label: string }[];
}

const esc = (v: unknown): string => String(v ?? '')
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const DOTS = '.........................................................................................';

// Base font size (px) by number of classes so the report always fits one page and uses the space well.
const baseFontPx = (classCount: number): number =>
  classCount <= 4 ? 15 : classCount <= 6 ? 14.5 : classCount <= 8 ? 13.5 : classCount <= 10 ? 12.5 : classCount <= 12 ? 12 : classCount <= 15 ? 11 : 10;

export function dutyReportTotals(att: any[]) {
  const t = att.reduce((acc, r) => ({
    regB: acc.regB + (r.regB || 0), regG: acc.regG + (r.regG || 0),
    presB: acc.presB + (r.presB || 0), presG: acc.presG + (r.presG || 0),
    absB: acc.absB + (r.absB || 0), absG: acc.absG + (r.absG || 0),
    sickB: acc.sickB + (r.sickB || 0), sickG: acc.sickG + (r.sickG || 0),
    permB: acc.permB + (r.permB || 0), permG: acc.permG + (r.permG || 0),
  }), { regB: 0, regG: 0, presB: 0, presG: 0, absB: 0, absG: 0, sickB: 0, sickG: 0, permB: 0, permG: 0 });
  const registered = t.regB + t.regG;
  const present = t.presB + t.presG;
  // PERCENTAGE OF ATTENDANCE = Present / Registered x 100
  const pct = registered > 0 ? ((present / registered) * 100).toFixed(1) : '0.0';
  return { ...t, registered, present, pct };
}

export function createDutyReportHtml(report: any, o: DutyPrintOptions): string {
  const att: any[] = report.attendance || [];
  const sections = report.sections || {};
  const t = dutyReportTotals(att);
  const fs = baseFontPx(att.length);

  const sectionRows = o.sections.map(s =>
    `<div class="sec"><div class="sec-label">${esc(s.label)}</div><div class="sec-text">${esc(sections[s.id] || DOTS)}</div></div>`
  ).join('');

  const attRows = att.map(r => `<tr>
      <td class="cls">${esc(r.className)}</td>
      <td>${r.regB}</td><td>${r.regG}</td><td class="b">${r.regB + r.regG}</td>
      <td>${r.presB}</td><td>${r.presG}</td><td class="b">${r.presB + r.presG}</td>
      <td class="abs">${r.absB}</td><td class="abs">${r.absG}</td><td class="abs b">${r.absB + r.absG}</td>
      <td>${r.sickB}</td><td>${r.sickG}</td><td class="b">${r.sickB + r.sickG}</td>
      <td>${r.permB}</td><td>${r.permG}</td><td class="b">${r.permB + r.permG}</td>
      <td class="b tot">${r.regB + r.regG}</td></tr>`).join('');

  const subHead = ['B', 'G', 'T', 'B', 'G', 'T', 'B', 'G', 'T', 'B', 'G', 'T', 'B', 'G', 'T'].map(h => `<th class="sub">${h}</th>`).join('');

  return `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=816"><title> </title>
<style>
  @page { size: A4 portrait; margin: 0; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html { font-size: ${fs}px; }
  html, body { background: #fff; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  body { font-family: 'Times New Roman', Times, serif; color: #111; line-height: 1.35; }
  .page { display: flex; flex-direction: column; padding: 9mm 12mm 8mm; gap: 0.55em; }
  .header { text-align: center; padding-bottom: 0.45em; border-bottom: 3px double #000; }
  .header .council { font-size: 1.1em; font-weight: bold; letter-spacing: 0.08em; color: #111; }
  .header .school { font-size: 1.55em; font-weight: bold; letter-spacing: 0.06em; color: #000; margin-top: 0.1em; }
  /* larger logos for this document only (they scale with the page font) */
  .header .lh-side { width: 6.8em; height: 5.8em; }
  .header .lh-side img { max-width: 6.8em !important; max-height: 5.8em !important; }
  .title-bar { background: #000; color: #fff; text-align: center; font-weight: bold; font-size: 1.25em; letter-spacing: 0.14em; padding: 0.3em 0.5em; border-radius: 0.2em; }
  .meta { display: flex; justify-content: space-between; align-items: center; font-size: 1.05em; background: #e0e0e0; border-left: 0.3em solid #000; padding: 0.4em 0.7em; }
  .sections { display: flex; flex-direction: column; border: 1px solid #222; }
  .sec { display: flex; align-items: center; min-height: 2em; }
  .sec:nth-child(even) { background: #f5f5f5; }
  .sec-label { flex: 0 0 31%; align-self: stretch; display: flex; align-items: center; font-weight: bold; font-size: 1.02em; padding: 0 0.7em; background: #e0e0e0; border-right: 1px solid #666; color: #000; }
  .sec-label, .sec-text { border-bottom: 1px solid #666; }
  .sec:last-child .sec-label, .sec:last-child .sec-text { border-bottom: 0; }
  .sec-text { flex: 1; align-self: stretch; display: flex; align-items: center; font-size: 1.05em; padding: 0 0.7em; }
  .att-title { text-align: center; font-weight: bold; font-size: 1.1em; letter-spacing: 0.04em; color: #000; }
  table { width: 100%; border-collapse: collapse; }
  th, td { border: 1px solid #222; text-align: center; padding: 0.28em 0.1em; font-size: 0.95em; }
  th { background: #000; color: #fff; font-size: 0.8em; letter-spacing: 0.03em; }
  th.sub { background: #cfcfcf; color: #000; font-size: 0.8em; }
  td.cls { font-weight: bold; background: #e0e0e0; font-size: 0.85em; }
  td.b { font-weight: bold; }
  td.abs { color: #000; font-weight: 700; text-decoration: underline; }
  td.tot { background: #e0e0e0; }
  tbody tr:nth-child(even) td { background-color: #fff; }
  tbody tr:nth-child(even) td.cls, tbody tr:nth-child(even) td.tot { background-color: #e0e0e0; }
  tr.total-row td { background: #888 !important; font-weight: bold; border-top: 2px solid #000; border-bottom: 2px solid #000; }
  .pct-box { display: flex; align-items: center; justify-content: space-between; gap: 0.8em; border: 1.5px solid #000; border-radius: 0.3em; padding: 0.4em 0.8em; background: #f0f0f0; }
  .pct-label { font-weight: bold; font-size: 1.05em; color: #000; }
  .pct-formula { font-size: 0.88em; color: #222; margin-top: 0.1em; }
  .pct-value { font-size: 1.9em; font-weight: bold; color: #fff; background: #000; padding: 0.02em 0.5em; border-radius: 0.25em; }
  .comments { display: flex; flex-direction: column; gap: 0.5em; }
  .card { border: 1px solid #222; border-radius: 0.25em; overflow: hidden; }
  .card-title { background: #cfcfcf; color: #000; font-weight: bold; font-size: 1em; letter-spacing: 0.04em; padding: 0.22em 0.7em; border-bottom: 1px solid #222; }
  .card-text { font-size: 1.02em; padding: 0.35em 0.7em 0.2em; min-height: 2.4em; line-height: 1.4; }
  .sig-row { display: flex; justify-content: space-between; align-items: flex-end; gap: 1em; padding: 0.2em 0.7em 0.45em; font-size: 1em; }
  .sig-name { font-weight: bold; border-bottom: 1px dotted #000; padding: 0 0.5em 0.05em; }
  .sig-line { display: inline-block; width: 11em; border-bottom: 1px solid #000; }
  .footer { text-align: center; font-size: 0.9em; color: #222; font-style: italic; border-top: 1px solid #666; padding-top: 0.35em; }
</style></head><body><div class="page">
  <div class="header">${letterheadOpen(o.districtLogo)}<div class="council">${esc(o.districtName)}</div><div class="school">${esc(o.schoolName)}</div>${letterheadClose(o.schoolLogo)}</div>
  <div class="title-bar">TEACHER'S DUTY REPORT</div>
  <div class="meta"><span>TEACHER ON DUTY: <strong>${esc(report.teacher_name)}</strong></span><span>DATE: <strong>${esc(report.date)}</strong></span></div>
  <div class="sections">${sectionRows}</div>
  <div class="att-title">STUDENTS ATTENDANCE ON ${esc(report.date)}</div>
  <table><thead>
    <tr><th rowspan="2">CLASS</th><th colspan="3">REGISTERED</th><th colspan="3">PRESENTS</th><th colspan="3">ABSENTS</th><th colspan="3">SICK</th><th colspan="3">PERMITTED</th><th rowspan="2">TOTAL</th></tr>
    <tr>${subHead}</tr></thead>
    <tbody>${attRows}
    <tr class="total-row"><td>TOTAL</td>
      <td>${t.regB}</td><td>${t.regG}</td><td>${t.registered}</td>
      <td>${t.presB}</td><td>${t.presG}</td><td>${t.present}</td>
      <td>${t.absB}</td><td>${t.absG}</td><td>${t.absB + t.absG}</td>
      <td>${t.sickB}</td><td>${t.sickG}</td><td>${t.sickB + t.sickG}</td>
      <td>${t.permB}</td><td>${t.permG}</td><td>${t.permB + t.permG}</td>
      <td>${t.registered}</td></tr></tbody></table>
  <div class="pct-box"><div><div class="pct-label">PERCENTAGE OF ATTENDANCE</div><div class="pct-formula">PRESENT ÷ REGISTERED × 100 = ${t.present} ÷ ${t.registered} × 100</div></div><div class="pct-value">${t.pct}%</div></div>
  <div class="comments">
    <div class="card"><div class="card-title">T.O.D'S COMMENT(S)</div><div class="card-text">${esc(report.tod_comment || DOTS)}</div>
      <div class="sig-row"><span>NAME: <span class="sig-name">${esc(report.tod_name)}</span></span><span>SIGNATURE: <span class="sig-line"></span></span></div></div>
    <div class="card"><div class="card-title">HEADMASTER'S COMMENT(S)</div><div class="card-text">${esc(report.headmaster_comment || DOTS)}</div>
      <div class="sig-row"><span>NAME: <span class="sig-name">${esc(report.headmaster_name)}</span></span><span>SIGNATURE: <span class="sig-line"></span></span></div></div>
  </div>
  <div class="footer">${esc(o.schoolName)}: ${esc(o.motto)}</div>
</div>
<script>
// Fit the report to ONE page on any device/paper: pick the largest font size whose content still fits
// (Letter is the shortest common paper, so it also fits A4). Runs on load, after fonts load and before printing.
(function () {
  var TARGET_MM = 273;
  function mmToPx(mm) {
    var d = document.createElement('div');
    d.style.cssText = 'position:absolute;visibility:hidden;width:1px;height:' + mm + 'mm';
    document.body.appendChild(d);
    var h = d.getBoundingClientRect().height;
    document.body.removeChild(d);
    return h;
  }
  function fit() {
    var page = document.querySelector('.page');
    if (!page) return;
    var root = document.documentElement;
    var target = mmToPx(TARGET_MM);
    var lo = 8, hi = 18, best = lo;
    for (var i = 0; i < 16; i++) {
      var mid = (lo + hi) / 2;
      root.style.fontSize = mid + 'px';
      if (page.scrollHeight <= target) { best = mid; lo = mid; } else { hi = mid; }
    }
    root.style.fontSize = best + 'px';
  }
  fit();
  window.addEventListener('load', fit);
  window.addEventListener('beforeprint', fit);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);
})();
</script></body></html>`;
}
