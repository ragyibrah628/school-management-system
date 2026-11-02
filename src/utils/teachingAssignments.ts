export interface TeachingAssignment {
  cls: string;
  sub: string;
}

interface SavedExamScore {
  exam_id?: string;
  class_name?: string;
  subject?: string;
  student_name?: string;
  score?: number | string | null;
  theory_score?: number | string | null;
  practical_score?: number | string | null;
}

export function subjectsForClass(assignments: TeachingAssignment[], className: string): string[] {
  return [...new Set(assignments.filter(assignment => assignment.cls === className).map(assignment => assignment.sub))];
}

export function hasUnsavedExamScoreChanges(
  scores: SavedExamScore[],
  examId: string | undefined,
  className: string,
  subject: string,
  examScores: Record<string, string>,
  practicalScores: Record<string, { theory: string; practical: string }>
): boolean {
  if (!examId || !className || !subject) return false;
  const savedRows = scores.filter(score =>
    score.exam_id === examId &&
    score.class_name === className &&
    score.subject === subject
  );
  return Object.entries(examScores).some(([studentName, rawScore]) => {
    const saved = savedRows.find(score => score.student_name === studentName);
    return String(saved?.score ?? '') !== rawScore;
  }) || Object.entries(practicalScores).some(([studentName, values]) => {
    const saved = savedRows.find(score => score.student_name === studentName);
    return String(saved?.theory_score ?? '') !== values.theory ||
      String(saved?.practical_score ?? '') !== values.practical;
  });
}
