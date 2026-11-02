import assert from 'node:assert/strict';
import { after, test } from 'node:test';
import { createServer } from 'vite';

const vite = await createServer({
  configFile: './vite.config.ts',
  server: { middlewareMode: true },
  appType: 'custom'
});
after(() => vite.close());

const { createReportCardPrintDocument } = await vite.ssrLoadModule('/src/utils/reportCardPrint.ts');

const reportCardBody = `<section class="report-card">
  <h1>RIPOTI YA MAENDELEO YA MWANAFUNZI</h1>
  <div>Jina la Mwanafunzi: <strong>Amina Student</strong></div>
  <div>Darasa: <strong>Form 3</strong></div>
  <div>Position: <strong>Position 2 out of 45</strong></div>
  <div>Daraja: <strong>I</strong> | Pointi: <strong>7</strong></div>
  <table class="subjects-table"><thead><tr><th>SOMO</th><th>ALAMA</th><th>GREDI</th><th>POINTI</th><th>MAELEZO</th></tr></thead>
    <tbody><tr><td>Biology</td><td>85</td><td>A</td><td>1</td><td>Bora Sana</td></tr>
    <tr><td>JUMLA (Masomo 1)</td><td>85</td><td>A</td><td>7</td><td>Bora Sana</td></tr></tbody>
  </table>
  <div>Wastani: 85.0% | Gredi: A | Pointi: 7 | Daraja: I | Position 2 out of 45</div>
  <table class="behavior-table"><thead><tr><th>TATHMINI YA TABIA — Mwalimu wa Darasa: Teacher One</th></tr></thead>
    <tbody><tr><td>Nidhamu: Vizuri Sana</td></tr></tbody></table>
  <div>MAONI YA MWALIMU WA TAALUMA: Comment one</div><div>Jina: Teacher One</div>
  <div>MAONI YA MKUU WA SHULE: Comment two</div><div>Jina: Head One</div>
  <footer>School Name: Motto</footer>
</section>`;

function visibleText(html) {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();
}

test('print styling preserves the report card text and values verbatim', () => {
  const document = createReportCardPrintDocument(reportCardBody);
  const bodyMarkup = document.match(/<body>([\s\S]*)<\/body>/)?.[1];

  assert.equal(bodyMarkup, reportCardBody);
  assert.equal(visibleText(bodyMarkup), visibleText(reportCardBody));
});

test('report cards use full-width zero-margin pages and consistent page-break layout', () => {
  const document = createReportCardPrintDocument(reportCardBody);

  assert.match(document, /@page\s*\{\s*size:\s*A4 portrait;\s*margin:\s*0;/);
  assert.match(document, /font-family:\s*Arial,\s*"Segoe UI",\s*Helvetica,\s*sans-serif/);
  assert.match(document, /table-layout:\s*fixed/);
  assert.match(document, /width:\s*100%/);
  assert.match(document, /print-color-adjust:\s*exact/);
  assert.match(document, /mix-blend-mode:\s*multiply/);
  assert.match(document, /font-size:\s*9pt !important/);
  assert.doesNotMatch(document, /font-size:\s*8(?:\.5)?pt/);
  assert.match(document, /\.sig-row > span \{[^}]*gap:\s*1mm/);
  assert.match(document, /break-after:\s*page/);
  assert.match(document, /\.report-card--compact/);
  assert.match(document, /\.report-card--long-comments/);
});
