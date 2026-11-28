// Teacher formal titles ("Mr. Kijida", "Madame Lulanje").
// The full name (all three names) is stored on the user and is used on every printed document.
// The formal title is used only on the timetable and in the welcome message. It is kept in its own synced
// key, so the users table of the database does not change.
import * as cloud from '../lib/cloud';

export const TITLES_KEY = 'sms_teacher_titles';

export type Gender = 'male' | 'female';
export interface TeacherMeta { title?: string; gender?: Gender }
export type TeacherMetaMap = Record<string, TeacherMeta>;

export function readTeacherMeta(): TeacherMetaMap {
  try {
    const parsed = JSON.parse(localStorage.getItem(TITLES_KEY) || '{}');
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
  } catch {
    return {};
  }
}

export function saveTeacherMeta(next: TeacherMetaMap): void {
  const value = JSON.stringify(next);
  try {
    cloud.markAppDataKeyDirty(TITLES_KEY, value);
    void cloud.syncToCloud().catch(() => undefined);
  } catch {
    try { localStorage.setItem(TITLES_KEY, value); } catch {}
  }
}

const capitalise = (word: string): string => word ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase() : '';

// The last name of the full name (the third name in "Rajabu Ibrahim Kijida").
export function lastNameOf(fullName: string): string {
  const words = String(fullName || '').trim().split(/\s+/).filter(Boolean);
  return words.length ? capitalise(words[words.length - 1]) : '';
}

export const nameCount = (fullName: string): number => String(fullName || '').trim().split(/\s+/).filter(Boolean).length;

// Title chosen by the system: Mr. <last name> for men, Madame <last name> for women.
export function defaultTitle(fullName: string, gender: Gender | '' | undefined): string {
  const last = lastNameOf(fullName);
  if (!last || !gender) return '';
  return `${gender === 'female' ? 'Madame' : 'Mr.'} ${last}`;
}

// Formal title of a teacher, or the full name when no title has been set yet.
export function formalTitleFor(teacherId: string, fullName: string, map?: TeacherMetaMap): string {
  const meta = (map || readTeacherMeta())[teacherId];
  const title = meta?.title && meta.title.trim();
  return title || fullName || '';
}
