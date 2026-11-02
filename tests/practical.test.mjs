import assert from 'node:assert/strict';
import { after, test } from 'node:test';
import { createServer } from 'vite';

const vite = await createServer({
  configFile: './vite.config.ts',
  server: { middlewareMode: true },
  appType: 'custom'
});
after(() => vite.close());

const practical = await vite.ssrLoadModule('/src/utils/practical.ts');
const { createScoreSheetHtml } = await vite.ssrLoadModule('/src/utils/scoreSheet.ts');

test('practical eligibility helpers recognize only Forms 3/4 and the four practical subjects', () => {
  assert.equal(practical.classLevel('Form IIIA'), 3);
  assert.equal(practical.classLevel('Form 4'), 4);
  assert.equal(practical.classLevel('Form II'), 2);
  assert.equal(practical.classLevel('Standard 3'), null);

  for (const subject of ['Physics', 'Chemistry', 'Biology', 'Computer Science']) {
    assert.equal(practical.isPracticalSubject(subject), true);
  }
  assert.equal(practical.isPracticalSubject('Mathematics'), false);
  assert.equal(practical.isPracticalSubject('Computer Science and IT'), false);
});

test('practical marks produce the expected final percentage and saved mode', () => {
  assert.equal(practical.practicalFinalPercentage(75, 38), 75.3);
  assert.equal(practical.practicalModeFromScores([{ score: 75.3, practical_score: 38 }]), true);
  assert.equal(practical.practicalModeFromScores([{ score: 75, practical_score: null }]), false);
  assert.equal(practical.practicalModeFromScores([]), null);
});

test('practical score sheets contain component columns and English result details', () => {
  const html = createScoreSheetHtml({
    schoolName: 'Test School',
    councilName: 'Test Council',
    schoolLogo: '',
    className: 'Form 3A',
    subject: 'Physics',
    examName: 'Mock Exam',
    term: 'Term 1',
    academicYear: '2026',
    teacherName: 'Test Teacher',
    printedAt: '2026-11-02',
    practicalMode: true,
    students: [{
      name: 'Student One',
      score: 75.3,
      maxScore: 100,
      theoryScore: 75,
      practicalScore: 38
    }]
  });

  for (const label of ['No.', 'Student name', 'Theory (/100)', 'Practical (/50)', 'Final (%)', 'Grade', 'Remarks']) {
    assert.ok(html.includes(`<th class="${label === 'Student name' || label === 'Remarks' ? '' : 'number'}">${label}</th>`), `missing ${label} column`);
  }
  assert.match(html, /75\.3%/);
  assert.match(html, />75<\/td>/);
  assert.match(html, />38<\/td>/);
  assert.match(html, />A<\/td>/);
  assert.match(html, />Excellent<\/td>/);
});
