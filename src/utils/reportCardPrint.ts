export function createReportCardPrintDocument(cardsHtml: string): string {
  return `<!DOCTYPE html>
<html lang="sw">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Report Cards</title>
<style>
  @page { size: A4 portrait; margin: 0; }
  * { box-sizing: border-box; }
  html, body { width: 100%; margin: 0; padding: 0; }
  body {
    color: #17231d;
    background: #e8eee9;
    font-family: Arial, "Segoe UI", Helvetica, sans-serif;
    font-size: 10pt;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  .report-card {
    width: 100%;
    max-width: 210mm;
    margin: 12px auto;
    padding: 8mm 10mm 7mm;
    background: #fff;
    border: 1px solid #d5e0d9;
    border-radius: 4mm;
    break-inside: avoid;
    page-break-inside: avoid;
  }
  .header {
    position: relative;
    width: 100%;
    margin: 0 0 3mm;
    padding: 0 0 3mm;
    text-align: center;
    border-bottom: 3px double #17633e;
  }
  .header > * { max-width: 100%; overflow-wrap: anywhere; }
  .header img {
    display: block;
    width: auto;
    height: auto;
    max-width: 22mm;
    max-height: 22mm;
    margin: 0 auto 2mm;
    object-fit: contain;
  }
  .council-name { color: #527060; font-size: 9pt !important; font-weight: 700; }
  .school-name { color: #153f2c; font-size: 18pt !important; line-height: 1.15; }
  .report-title {
    display: inline-block;
    max-width: 100%;
    margin-top: 2mm !important;
    padding: 1.5mm 4mm;
    border-radius: 2mm;
    color: #fff;
    background: #17633e;
    font-family: Arial, "Segoe UI", Helvetica, sans-serif;
    font-size: 12pt !important;
    font-weight: 700;
    letter-spacing: 0;
    text-decoration: none !important;
  }
  .exam-name { margin-top: 1.5mm !important; color: #40594a; font-size: 10pt !important; font-weight: 700; }
  .info-grid {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    width: 100%;
    margin: 0 0 3mm;
    overflow-wrap: anywhere;
    border: 1px solid #c9d8cf;
    border-radius: 2mm;
    background: #f3f7f4;
  }
  .info-cell { min-width: 0; padding: 2.2mm 3mm; border: 0.5px solid #d7e2db; font-size: 9pt; }
  .info-label { color: #557060; }
  .info-value { color: #183f2c; font-weight: 700; }
  table {
    width: 100%;
    max-width: 100%;
    margin: 2.5mm 0;
    border-collapse: collapse;
    table-layout: fixed;
  }
  th, td {
    min-width: 0;
    padding: 1.5mm 1.4mm;
    border: 1px solid #cad7cf;
    font-size: 9pt;
    line-height: 1.15;
    overflow-wrap: anywhere;
  }
  .subjects-table th { color: #fff; background: #17633e; font-weight: 700; }
  .subjects-table th:first-child, .subjects-table td:first-child { width: 38%; text-align: left !important; }
  .subjects-table th:nth-child(2), .subjects-table td:nth-child(2) { width: 14%; }
  .subjects-table th:nth-child(3), .subjects-table td:nth-child(3) { width: 12%; }
  .subjects-table th:nth-child(4), .subjects-table td:nth-child(4) { width: 13%; }
  .subjects-table th:nth-child(5), .subjects-table td:nth-child(5) { width: 23%; }
  .subjects-table th:not(:first-child), .subjects-table td:not(:first-child) { text-align: center !important; }
  .subjects-table tbody tr:nth-child(even) { background: #f3f7f4; }
  .subjects-table tbody tr:last-child { border-top: 2px solid #17633e; background: #e1efe6 !important; font-weight: 700; }
  .grade-box {
    width: 100%;
    margin: 2.5mm 0;
    padding: 2.5mm;
    border: 1px solid #a9c8b5;
    border-radius: 2mm;
    background: #e7f2eb;
    color: #173d2b;
    text-align: center;
  }
  .behavior-table { margin-top: 2mm; }
  .behavior-table th { padding: 1.2mm 0.7mm !important; color: #604d1c; background: #fff4cf !important; font-size: 9pt !important; }
  .behavior-table td { padding: 1.3mm 0.7mm !important; font-size: 9pt !important; font-weight: 700; text-align: center; }
  .comments-row { display: flex; width: 100%; gap: 3mm; margin-top: 3mm; align-items: stretch; }
  .comment-box {
    display: flex;
    flex: 1 1 0;
    flex-direction: column;
    min-width: 0;
    padding: 0 2.5mm 2mm;
    border: 1px solid #cedbd2;
    border-radius: 2mm;
    background: #fbfcfb;
    overflow-wrap: anywhere;
  }
  .comment-title {
    margin: 0 -2.5mm 2mm;
    padding: 2mm 2.5mm;
    border-radius: 2mm 2mm 0 0;
    color: #fff;
    background: #285d43;
    font-size: 9pt;
    font-weight: 700;
  }
  .comment-text { flex: 1 1 auto; min-width: 0; font-size: 9pt; line-height: 1.28; }
  .sig-row {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-end;
    justify-content: space-between;
    gap: 2mm;
    min-width: 0;
    min-height: 18mm;
    margin-top: 2mm;
    font-size: 9pt;
  }
  .sig-row > span { display: flex; min-width: 0; align-items: flex-end; gap: 1mm; }
  .sig-row > span:last-child { justify-content: flex-end; }
  .sig-img {
    display: block;
    width: auto;
    height: auto;
    max-width: 35mm;
    max-height: 18mm;
    object-fit: contain;
    object-position: bottom right;
    border: 0 !important;
    padding: 0 !important;
    background: transparent !important;
    mix-blend-mode: multiply;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  .footer {
    width: 100%;
    margin-top: 3mm;
    padding-top: 2mm;
    border-top: 1px solid #b8c9be;
    color: #53665b;
    font-size: 9pt !important;
    text-align: center;
    overflow-wrap: anywhere;
  }
  .page-break { break-after: page; page-break-after: always; }
  @media screen {
    .report-card { min-height: 297mm; box-shadow: 0 4px 18px #183f2c18; }
  }
  @media screen and (max-width: 600px) {
    .report-card { padding: 6mm; }
    .school-name { font-size: clamp(14px, 5vw, 18px) !important; }
    .report-title { font-size: clamp(10px, 3.2vw, 12px) !important; padding: 1mm 2mm; }
  }
  @media print {
    html, body { width: 100%; margin: 0; padding: 0; background: #fff; overflow: visible; }
    .report-card {
      width: 100%;
      max-width: none;
      margin: 0;
      padding: 7mm 9mm 6mm;
      border: 0;
      border-radius: 0;
      box-shadow: none;
      break-inside: avoid;
      page-break-inside: avoid;
    }
    .page-break { break-after: page; page-break-after: always; }
    .subjects-table { margin: 2mm 0; }
    .subjects-table th, .subjects-table td { padding: 1mm 1.1mm; }
    .info-cell { padding: 1.7mm 2.5mm; }
    .grade-box { margin: 1.8mm 0; padding: 1.8mm; }
    .comment-title { padding-top: 1.5mm; padding-bottom: 1.5mm; }
    .comment-text { font-size: 9pt; line-height: 1.2; }
    .sig-row { min-height: 16mm; }
    .sig-img { max-height: 16mm; }
    .footer { margin-top: 2mm; padding-top: 1.5mm; }
    .report-card--compact .header { margin-bottom: 2mm; padding-bottom: 2mm; }
    .report-card--compact .school-name { font-size: 16pt !important; }
    .report-card--compact .report-title { font-size: 11pt !important; }
    .report-card--compact table { margin: 1.5mm 0; }
    .report-card--compact th, .report-card--compact td { padding: 0.65mm 0.8mm; font-size: 9pt; line-height: 1.05; }
    .report-card--compact .info-cell { padding: 1.3mm 2mm; font-size: 9pt; }
    .report-card--compact .grade-box { margin: 1.3mm 0; padding: 1.3mm; }
    .report-card--compact .comment-box { padding-bottom: 1.5mm; }
    .report-card--compact .comment-text { font-size: 9pt; line-height: 1.15; }
    .report-card--compact .sig-row { min-height: 15mm; font-size: 9pt; }
    .report-card--compact .sig-img { max-height: 15mm; }
    .report-card--long-comments .header { margin-bottom: 1mm; padding-bottom: 1mm; }
    .report-card--long-comments .info-cell { padding: 1mm 2mm; }
    .report-card--long-comments .subjects-table { margin: 1mm 0; }
    .report-card--long-comments .subjects-table th,
    .report-card--long-comments .subjects-table td { padding: 0.6mm 0.8mm; }
    .report-card--long-comments .grade-box { margin: 1mm 0; padding: 1mm; }
    .report-card--long-comments .behavior-table { margin: 0.5mm 0 !important; }
    .report-card--long-comments .behavior-table th,
    .report-card--long-comments .behavior-table td { padding: 0.5mm 0.5mm !important; }
    .report-card--long-comments .comments-row { gap: 2mm; margin-top: 1mm; }
    .report-card--long-comments .comment-title { margin-bottom: 1mm; padding-top: 1mm; padding-bottom: 1mm; }
    .report-card--long-comments .comment-text { font-size: 9pt; line-height: 1.05; }
    .report-card--long-comments.report-card--compact .comment-text { font-size: 9pt; line-height: 1.05; }
  }
</style>
</head>
<body>${cardsHtml}</body>
</html>`;
}
