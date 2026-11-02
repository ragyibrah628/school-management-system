export type ExamSubjectSubmission = {
  exam_id: string;
  class_name: string;
  subject: string;
  teacher_id?: string;
  submitted_at?: string;
};

export const CLASS_SUBMISSION_TRACKING_START = Date.parse('2026-11-02T09:57:13.177Z');

export function submittedSubjectsForClass(
  examId: string,
  className: string,
  scores: any[],
  submissions: ExamSubjectSubmission[],
  legacyCutoff = CLASS_SUBMISSION_TRACKING_START
): string[] {
  const submitted = new Set(
    submissions
      .filter(item => item.exam_id === examId && item.class_name === className)
      .map(item => item.subject)
  );

  for (const score of scores) {
    if (score.exam_id !== examId || score.class_name !== className || !score.subject || submitted.has(score.subject)) continue;
    const createdAt = score.created_at ? Date.parse(score.created_at) : Number.NaN;
    if (!Number.isFinite(createdAt) || createdAt < legacyCutoff) submitted.add(score.subject);
  }

  return [...submitted].sort((a, b) => a.localeCompare(b));
}

export function offeredSubjectsForClass(
  className: string,
  assignments: Record<string, { cls: string; sub: string }[]>
): string[] {
  return [...new Set(
    Object.values(assignments)
      .flat()
      .filter(assignment => assignment.cls === className)
      .map(assignment => assignment.sub)
      .filter(Boolean)
  )].sort((a, b) => a.localeCompare(b));
}

export function upsertClassSubjectSubmission(
  submissions: ExamSubjectSubmission[],
  next: ExamSubjectSubmission
): ExamSubjectSubmission[] {
  const found = submissions.some(item =>
    item.exam_id === next.exam_id &&
    item.class_name === next.class_name &&
    item.subject === next.subject
  );
  return found ? submissions : [...submissions, next];
}
