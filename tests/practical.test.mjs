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
const markEntry = await vite.ssrLoadModule('/src/utils/markEntry.ts');
const assignments = await vite.ssrLoadModule('/src/utils/teachingAssignments.ts');
const { assignedSubjectTeacherName, buildScoreSheetData, createScoreSheetHtml, createScoreSheetsHtml } = await vite.ssrLoadModule('/src/utils/scoreSheet.ts');
const resultSubmissions = await vite.ssrLoadModule('/src/utils/resultSubmissions.ts');

test('assigned subjects include multiple subjects for a class without mixing classes', () => {
  const teacherAssignments = [
    { cls: 'Form 3', sub: 'Mathematics' },
    { cls: 'Form 3', sub: 'Computer Science' },
    { cls: 'Form 4', sub: 'Biology' },
    { cls: 'Form 3', sub: 'Mathematics' }
  ];

  assert.deepEqual(assignments.subjectsForClass(teacherAssignments, 'Form 3'), ['Mathematics', 'Computer Science']);
  assert.deepEqual(assignments.subjectsForClass(teacherAssignments, 'Form 4'), ['Biology']);
});

test('unsaved score detection is scoped to the currently selected exam, class and subject', () => {
  const saved = [
    { exam_id: 'exam-1', class_name: 'Form 3', subject: 'Mathematics', student_name: 'A', score: 70 },
    { exam_id: 'exam-1', class_name: 'Form 3', subject: 'Computer Science', student_name: 'A', score: 80, theory_score: 80, practical_score: 40 }
  ];

  assert.equal(assignments.hasUnsavedExamScoreChanges(saved, 'exam-1', 'Form 3', 'Mathematics', { A: '70' }, {}), false);
  assert.equal(assignments.hasUnsavedExamScoreChanges(saved, 'exam-1', 'Form 3', 'Mathematics', { A: '71' }, {}), true);
  assert.equal(assignments.hasUnsavedExamScoreChanges(saved, 'exam-1', 'Form 3', 'Computer Science', {}, { A: { theory: '81', practical: '40' } }), true);
  assert.equal(assignments.hasUnsavedExamScoreChanges(saved, 'exam-1', 'Form 3', 'Computer Science', { A: '70' }, {}), true);
});

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

test('teacher and admin score sheets share data mapping and identical single-sheet markup', () => {
  const details = {
    schoolName: 'Test School',
    councilName: 'Test Council',
    schoolLogo: '',
    className: 'Form 3A',
    subject: 'Biology',
    examName: 'Mock Exam',
    term: 'Term 1',
    academicYear: '2026',
    teacherName: 'Biology Teacher',
    printedAt: '2026-11-02',
    practicalMode: true
  };
  const roster = [{ name: 'Amina' }, { name: 'Baraka' }];
  const savedRows = [
    { student_name: 'Amina', score: 75.3, max_score: 100, theory_score: 75, practical_score: 38 },
    { student_name: 'Baraka', score: 82.7, max_score: 100, theory_score: 85, practical_score: 39 }
  ];
  const teacherData = buildScoreSheetData(details, roster, savedRows);
  const adminData = buildScoreSheetData({ ...details }, [...roster], [...savedRows]);

  assert.deepEqual(adminData, teacherData);
  assert.equal(createScoreSheetHtml(adminData), createScoreSheetHtml(teacherData));
  assert.match(createScoreSheetHtml(adminData), /Theory \(\/100\).*Practical \(\/50\).*Final \(%\)/s);
});

test('admin score sheets resolve the currently assigned subject teacher', () => {
  const assignments = {
    'teacher-bio': [{ cls: 'Form 3', sub: 'Biology' }],
    'teacher-chem': [{ cls: 'Form 3', sub: 'Chemistry' }]
  };
  const teachers = [
    { id: 'admin', name: 'Admin User' },
    { id: 'teacher-bio', name: 'Biology Teacher' },
    { id: 'teacher-chem', name: 'Chemistry Teacher' }
  ];

  assert.equal(assignedSubjectTeacherName('Form 3', 'Chemistry', assignments, teachers, []), 'Chemistry Teacher');
  assert.equal(assignedSubjectTeacherName('Form 3', 'Chemistry', assignments, [], [
    { student_name: 'Student', score: 80, teacher_id: 'teacher-chem', teacher_name: 'Chemistry Teacher' }
  ]), 'Chemistry Teacher');
  assert.equal(assignedSubjectTeacherName('Form 3', 'Mathematics', assignments, teachers, []), 'Unassigned');
});

test('score sheet order is girls first, with alphabetical order within each group', () => {
  const roster = markEntry.sortStudentsForMarkEntry([
    { name: 'Adam Boy', gender: 'male' },
    { name: 'Zara Girl', gender: 'female' },
    { name: 'Brian Boy', gender: 'male' },
    { name: 'Amina Girl', gender: 'female' }
  ]);
  const data = buildScoreSheetData({
    schoolName: 'Test School',
    councilName: 'Test Council',
    schoolLogo: '',
    className: 'Form 3',
    subject: 'Biology',
    examName: 'Mock Exam',
    term: 'Term I',
    academicYear: '2026',
    teacherName: 'Biology Teacher',
    printedAt: '2026-11-02'
  }, roster, []);
  const html = createScoreSheetHtml(data);

  assert.deepEqual(roster.map(student => student.name), ['Amina Girl', 'Zara Girl', 'Adam Boy', 'Brian Boy']);
  assert.ok(html.indexOf('Amina Girl') < html.indexOf('Zara Girl'));
  assert.ok(html.indexOf('Zara Girl') < html.indexOf('Adam Boy'));
  assert.ok(html.indexOf('Adam Boy') < html.indexOf('Brian Boy'));
});

test('print-all score sheets share the A4 layout and insert one page break per subject', () => {
  const base = buildScoreSheetData({
    schoolName: 'Test School',
    councilName: 'Test Council',
    schoolLogo: '',
    className: 'Form 3A',
    subject: 'Chemistry',
    examName: 'Mock Exam',
    term: 'Term 1',
    academicYear: '2026',
    teacherName: 'Chemistry Teacher',
    printedAt: '2026-11-02',
    practicalMode: true
  }, Array.from({ length: 46 }, (_, index) => ({ name: `Student ${index + 1}` })), []);
  const second = { ...base, subject: 'Mathematics', practicalMode: false };
  const html = createScoreSheetsHtml([base, second]);
  const pages = html.match(/<main class="score-sheet">[\s\S]*?<\/main>/g) || [];

  assert.equal(pages.length, 2);
  assert.match(html, /size: A4 portrait/);
  assert.match(html, /break-after: page/);
  assert.match(pages[0], /Theory \(\/100\)/);
  assert.match(pages[0], /Student 46/);
  assert.doesNotMatch(pages[1], /Theory \(\/100\)|Practical \(\/50\)|Final \(%\)/);
  assert.match(pages[1], /Mathematics Score Sheet/);
});

test('legacy submissions are inferred only for classes with pre-cutoff score rows', () => {
  const legacySubjects = ['Biology', 'English', 'Geography', 'History', 'Kiswahili'];
  const scores = legacySubjects.map((subject, index) => ({
    exam_id: 'exam-E',
    class_name: 'Form 1',
    subject,
    student_name: `Student ${index}`,
    score: 60,
    created_at: '2026-10-30T07:57:19.000Z'
  }));
  const submissionRecords = [];

  assert.deepEqual(
    resultSubmissions.submittedSubjectsForClass('exam-E', 'Form 1', scores, submissionRecords),
    legacySubjects.sort()
  );
  assert.deepEqual(
    resultSubmissions.submittedSubjectsForClass('exam-E', 'Form 3', scores, submissionRecords),
    []
  );
});

test('new marks need an explicit class submission and same subjects remain independent by class', () => {
  const postCutoffScore = {
    exam_id: 'exam-E',
    class_name: 'Form 3',
    subject: 'Mathematics',
    student_name: 'Student Three',
    score: 75,
    created_at: '2026-11-02T10:00:00.000Z'
  };
  const legacyMath = {
    exam_id: 'exam-E',
    class_name: 'Form 1',
    subject: 'Mathematics',
    student_name: 'Student One',
    score: 65,
    created_at: '2026-10-30T07:57:19.000Z'
  };
  const records = [{
    exam_id: 'exam-E',
    class_name: 'Form 3',
    subject: 'Mathematics',
    teacher_id: 'teacher-3',
    submitted_at: '2026-11-02T10:00:00.000Z'
  }];
  const allScores = [legacyMath, postCutoffScore];

  assert.deepEqual(
    resultSubmissions.submittedSubjectsForClass('exam-E', 'Form 3', allScores, records),
    ['Mathematics']
  );
  assert.deepEqual(
    resultSubmissions.submittedSubjectsForClass('exam-E', 'Form 1', allScores, records),
    ['Mathematics']
  );
  assert.deepEqual(
    resultSubmissions.submittedSubjectsForClass('exam-E', 'Form 3', [{ ...postCutoffScore, subject: 'Biology' }], []),
    []
  );
});

test('offered subjects are counted per class and submission upserts preserve other classes', () => {
  const assignments = {
    teacher1: [{ cls: 'Form 1', sub: 'Mathematics' }, { cls: 'Form 3', sub: 'Mathematics' }],
    teacher2: [{ cls: 'Form 3', sub: 'Biology' }]
  };
  const existing = [{
    exam_id: 'exam-E',
    class_name: 'Form 1',
    subject: 'Mathematics',
    teacher_id: 'teacher1'
  }];
  const next = {
    exam_id: 'exam-E',
    class_name: 'Form 3',
    subject: 'Mathematics',
    teacher_id: 'teacher3'
  };

  assert.deepEqual(resultSubmissions.offeredSubjectsForClass('Form 3', assignments), ['Biology', 'Mathematics']);
  assert.deepEqual(resultSubmissions.offeredSubjectsForClass('Form 1', assignments), ['Mathematics']);
  assert.deepEqual(resultSubmissions.upsertClassSubjectSubmission(existing, next), [existing[0], next]);
});
