export function gradeForPercentage(score: number): string {
  return score >= 75 ? 'A' : score >= 65 ? 'B' : score >= 45 ? 'C' : score >= 30 ? 'D' : 'F';
}

export function remarkForPercentage(score: number): string {
  return score >= 75 ? 'Bora Sana' : score >= 65 ? 'Vizuri Sana' : score >= 45 ? 'Vizuri' : score >= 30 ? 'Wastani' : 'Inahitaji Jitihada';
}

export function compareStudentNames(left: string, right: string): number {
  return left.normalize('NFKC').trim().replace(/\s+/g, ' ').localeCompare(
    right.normalize('NFKC').trim().replace(/\s+/g, ' '),
    undefined,
    { sensitivity: 'base', usage: 'sort' }
  );
}

export function sortStudentsForMarkEntry<T extends { name: string; gender?: string }>(students: T[]): T[] {
  const genderRank = (gender?: string) => gender === 'female' ? 0 : gender === 'male' ? 1 : 2;
  return [...students].sort((left, right) =>
    genderRank(left.gender) - genderRank(right.gender) ||
    compareStudentNames(left.name, right.name)
  );
}

export function evaluateMark(value: string, maxScore: number): {
  invalid: boolean;
  grade: string;
  remark: string;
} {
  if (value === '') return { invalid: false, grade: '-', remark: '-' };
  const score = Number(value);
  if (!Number.isFinite(score) || score < 0 || score > maxScore || maxScore <= 0) {
    return { invalid: true, grade: '-', remark: '-' };
  }
  const percentage = score / maxScore * 100;
  return {
    invalid: false,
    grade: gradeForPercentage(percentage),
    remark: remarkForPercentage(percentage)
  };
}
