import assert from 'node:assert/strict';
import { after, test } from 'node:test';
import { createServer } from 'vite';

const vite = await createServer({
  configFile: './vite.config.ts',
  server: { middlewareMode: true },
  appType: 'custom'
});
after(() => vite.close());

const { createReportCardPrintDocument, formatReportCardPosition } = await vite.ssrLoadModule('/src/utils/reportCardPrint.ts');
const {
  getAcademicReportCardComment,
  getHeadmasterReportCardComment
} = await vite.ssrLoadModule('/src/utils/reportCardComments.ts');

const reportCardBody = `<section class="report-card">
  <h1>RIPOTI YA MAENDELEO YA MWANAFUNZI</h1>
  <div>Jina la Mwanafunzi: <strong>Amina Student</strong></div>
  <div>Darasa: <strong>Form 3</strong></div>
  <div>Nafasi: <strong>2 kati ya 45</strong></div>
  <div>Daraja: <strong>I</strong> | Pointi: <strong>7</strong></div>
  <table class="subjects-table"><thead><tr><th>SOMO</th><th>ALAMA</th><th>GREDI</th><th>POINTI</th><th>MAELEZO</th></tr></thead>
    <tbody><tr><td>Biology</td><td>85</td><td>A</td><td>1</td><td>Bora Sana</td></tr>
    <tr><td>Chemistry</td><td>40</td><td><span class="grade-low">D</span></td><td>4</td><td>Wastani</td></tr>
    <tr><td>Civics</td><td>20</td><td><span class="grade-low">F</span></td><td>5</td><td>Inahitaji Jitihada</td></tr>
    <tr><td>JUMLA (Masomo 3)</td><td>145</td><td>B</td><td>10</td><td>Vizuri</td></tr></tbody>
  </table>
  <div>Wastani: 85.0% | Gredi: A | Pointi: 7 | Daraja: I | Nafasi: 2 / 45</div>
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
  assert.doesNotMatch(document, /color:\s*#fff\b/i);
  assert.match(document, /\.subjects-table th \{[^}]*white-space:\s*nowrap/);
  assert.match(document, /\.behavior-table th \{[^}]*overflow-wrap:\s*normal;[^}]*word-break:\s*normal/);
  assert.match(document, /\.sig-row \{[^}]*flex-wrap:\s*nowrap/);
  assert.match(document, /\.sig-img \{[^}]*height:\s*15mm;[^}]*max-width:\s*48mm;[^}]*max-height:\s*15mm/);
  assert.match(document, /\.grade-low \{[^}]*text-decoration:\s*underline/);
  assert.match(document, /\.report-title \{[^}]*border:\s*2px solid #14532d;[^}]*color:\s*#14532d/);
  assert.match(document, /\.subjects-table th \{[^}]*color:\s*#14532d !important/);
  assert.match(document, /\.comment-title \{[^}]*color:\s*#14532d/);
  assert.match(document, /\.comments-row \{ flex-direction:\s*column; \}/);
  assert.match(document, /\.sig-row > span \{[^}]*gap:\s*1mm/);
  assert.match(document, /break-after:\s*page/);
  assert.match(document, /\.report-card--compact/);
  assert.match(document, /\.report-card--long-comments/);
});

test('report card positions use the Swahili info and summary formats', () => {
  assert.equal(formatReportCardPosition(5, 13), '5 kati ya 13');
  assert.match(reportCardBody, /Nafasi: <strong>2 kati ya 45<\/strong>/);
  assert.match(reportCardBody, /Nafasi: 2 \/ 45/);
  assert.doesNotMatch(reportCardBody, /Position|out of/);
});

test('missing division comments are positive for high averages and encouraging for low averages', () => {
  for (const comment of [
    getAcademicReportCardComment('Sosela', '-', 75.6),
    getHeadmasterReportCardComment('Sosela', '-', 75.6)
  ]) {
    assert.match(comment, /75\.6%/);
    assert.doesNotMatch(comment, /Daraja/);
    assert.match(comment, /Hongera|juhudi|jivunia|mzuri/i);
  }

  for (const comment of [
    getAcademicReportCardComment('Sosela', '-', 25),
    getHeadmasterReportCardComment('Sosela', '-', 25)
  ]) {
    assert.match(comment, /25\.0%/);
    assert.doesNotMatch(comment, /Daraja/);
    assert.match(comment, /changamoto|kuboresha|msaada|jituma/i);
  }
});

test('available-division comments retain their exact wording', () => {
  assert.equal(
    getAcademicReportCardComment('Amina', 'I', 75),
    'Hongera Amina kwa Daraja la I! Wastani wa 75.0% unaonyesha juhudi zako kubwa. Bado una nafasi ya kupanda zaidi — tilia mkazo kwenye masomo uliyopata alama za chini na utafanya vizuri zaidi mtihani ujao.'
  );
  assert.equal(
    getHeadmasterReportCardComment('Amina', 'I', 75),
    'Hongera sana Amina! Shule inajivunia Daraja la I kwa wastani wa 75.0%. Endelea na moyo wa kujifunza na heshima kwa walimu — mafanikio makubwa yanakusubiri.'
  );
});
