// @ts-nocheck
// Cloud database using Supabase REST API (no library import needed)
// Falls back to localStorage if Supabase is not configured
// ✅ FIXED VERSION — paste this over src/lib/cloud.ts
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const IS_CLOUD = !!(SUPABASE_URL && SUPABASE_KEY && SUPABASE_URL.startsWith('https://'));
const realtimeClient = IS_CLOUD ? createClient(SUPABASE_URL, SUPABASE_KEY) : null;
const LEGACY_DEFAULT_CLASSES = ['Form IA', 'Form IB', 'Form IC', 'Form IIA', 'Form IIB', 'Form IIC', 'Form IIIA', 'Form IIIB', 'Form IIIC', 'Form IVA', 'Form IVB', 'Form IVC'];
const GET_CACHE_TTL_MS = 30000;
let scorePracticalColumnsAvailable: boolean | null = null;
const getCache = new Map<string, { expiresAt: number; data: any }>();
const getInFlight = new Map<string, Promise<any>>();
const getCacheVersions = new Map<string, number>();

export function startVisiblePolling(
  callback: () => void | Promise<void>,
  intervalMs: number,
  onResume: () => void | Promise<void> = callback
): () => void {
  let timer: ReturnType<typeof setInterval> | null = null;
  let inFlight = false;
  const run = async (task: () => void | Promise<void>) => {
    if (document.hidden || inFlight) return;
    inFlight = true;
    try { await task(); } finally { inFlight = false; }
  };
  const start = () => {
    if (!document.hidden && timer === null) timer = setInterval(() => { void run(callback); }, intervalMs);
  };
  const onVisibilityChange = () => {
    if (document.hidden) {
      if (timer !== null) clearInterval(timer);
      timer = null;
    } else {
      void run(onResume);
      start();
    }
  };
  const onFocus = () => { void run(onResume); };
  start();
  document.addEventListener('visibilitychange', onVisibilityChange);
  window.addEventListener('focus', onFocus);
  return () => {
    if (timer !== null) clearInterval(timer);
    document.removeEventListener('visibilitychange', onVisibilityChange);
    window.removeEventListener('focus', onFocus);
  };
}

export function isCloudMode() {
  return IS_CLOUD;
}

export function subscribeToScoreChanges(onChange: () => void): () => void {
  if (!realtimeClient) return () => {};
  const channel = realtimeClient
    .channel('scores-live-updates')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'scores' }, onChange)
    .subscribe();
  return () => { realtimeClient.removeChannel(channel); };
}

export function subscribeToAppDataChanges(key: string, onChange: () => void): () => void {
  if (!realtimeClient) return () => {};
  const channel = realtimeClient
    .channel(`app-data-${key}`)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'app_data', filter: `key=eq.${key}` }, onChange)
    .subscribe();
  return () => { realtimeClient.removeChannel(channel); };
}

export function subscribeToUserChanges(onChange: () => void): () => void {
  if (!realtimeClient) return () => {};
  const channel = realtimeClient
    .channel('users-live-updates')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'users' }, () => {
      for (const key of getCache.keys()) {
        if (key.startsWith(`GET:${SUPABASE_URL}/rest/v1/users`)) getCache.delete(key);
      }
      onChange();
    })
    .subscribe();
  return () => { realtimeClient.removeChannel(channel); };
}

export async function refreshAppDataKey(key: string, forceApply = false): Promise<void> {
  if (!IS_CLOUD) return;
  try {
    invalidateAppDataKeyCache(key);
    const data = await supabaseRequest(
      'app_data', 'GET', undefined,
      `?key=eq.${encodeURIComponent(key)}&select=key,value,updated_at&limit=1`,
      false,
      true
    );
    const item = Array.isArray(data) ? data[0] : null;
    if (!item) return;
    let isAdmin = false;
    try { isAdmin = JSON.parse(localStorage.getItem('sms_current_user') || 'null')?.role === 'admin'; } catch {}
    if (applyCloudAppDataItem(item, isAdmin, forceApply)) {
      window.dispatchEvent(new Event('cloud-sync-complete'));
    }
  } catch (error) {
    console.error(`Cloud refresh failed for ${key}:`, error);
  }
}
export function isOperaMini(): boolean {
  try {
    const ua = typeof navigator !== 'undefined' ? navigator.userAgent : '';
    return /Opera Mini|OPR\/.*Mini| Presto\//i.test(ua);
  } catch { return false; }
}

function appDataQueryContainsKey(requestKey: string, appDataKey: string): boolean {
  try {
    const url = new URL(requestKey.slice(requestKey.indexOf(':') + 1));
    const filter = url.searchParams.get('key') || '';
    if (filter.startsWith('eq.')) return filter.slice(3) === appDataKey;
    if (filter.startsWith('in.(') && filter.endsWith(')')) {
      return filter.slice(4, -1).split(',').includes(appDataKey);
    }
  } catch {}
  return false;
}

function invalidateAppDataKeyCache(appDataKey: string) {
  const prefix = `GET:${SUPABASE_URL}/rest/v1/app_data`;
  const requestKeys = new Set([...getCache.keys(), ...getInFlight.keys()]);
  for (const requestKey of requestKeys) {
    if (requestKey.startsWith(prefix) && appDataQueryContainsKey(requestKey, appDataKey)) {
      getCache.delete(requestKey);
      getInFlight.delete(requestKey);
      getCacheVersions.set(requestKey, (getCacheVersions.get(requestKey) || 0) + 1);
    }
  }
}

async function supabaseRequest(
  table: string,
  method: string,
  body?: any,
  query?: string,
  upsert = false,
  bypassCache = false,
  returnRepresentation = false
) {
  const url = `${SUPABASE_URL}/rest/v1/${table}${query || ''}`;
  const cacheKey = `${method}:${url}`;
  if (method === 'GET') {
    if (bypassCache) {
      getCache.delete(cacheKey);
      getInFlight.delete(cacheKey);
      getCacheVersions.set(cacheKey, (getCacheVersions.get(cacheKey) || 0) + 1);
    } else {
      const cached = getCache.get(cacheKey);
      if (cached && cached.expiresAt > Date.now()) return cached.data;
      const pending = getInFlight.get(cacheKey);
      if (pending) return pending;
    }
  }
  const headers: any = {
    'apikey': SUPABASE_KEY,
    'Authorization': `Bearer ${SUPABASE_KEY}`,
    'Content-Type': 'application/json',
    'Prefer': returnRepresentation
      ? (upsert ? 'resolution=merge-duplicates,return=representation' : 'return=representation')
      : method === 'POST'
        ? (upsert ? 'resolution=merge-duplicates,return=minimal' : 'return=representation')
        : 'return=minimal'
  };

  // Opera Mini + low-end browser fix: timeout + no-cache, skip cloud if fetch hangs
  const request = (async () => {
    const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
    const timeout = controller ? setTimeout(() => controller.abort(), 5000) : null;
    let res: any;
    try {
      res = await fetch(url, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
        signal: controller ? controller.signal : undefined,
        cache: 'no-store' as any,
      } as any);
    } catch (e: any) {
      if (e?.name === 'AbortError') throw new Error('Network timeout - using offline cache');
      throw e;
    } finally {
      if (timeout) clearTimeout(timeout);
    }

    if (!res.ok) {
      const text = await res.text();
      console.error(`Supabase ${method} ${table} failed:`, text);
      const error: any = new Error(text);
      error.status = res.status;
      throw error;
    }

    if (method === 'GET' || returnRepresentation) return res.json();
    return null;
  })();
  if (method === 'GET') {
    const cacheVersion = getCacheVersions.get(cacheKey) || 0;
    getInFlight.set(cacheKey, request);
    request.then(data => {
      if ((getCacheVersions.get(cacheKey) || 0) === cacheVersion) {
        getCache.set(cacheKey, { expiresAt: Date.now() + GET_CACHE_TTL_MS, data });
      }
    }, () => undefined)
      .finally(() => {
        if (getInFlight.get(cacheKey) === request) getInFlight.delete(cacheKey);
      });
  } else {
    request.then(() => {
      if (table === 'app_data') {
        let appDataKey = body?.key;
        if (!appDataKey && query) {
          try {
            const urlWithQuery = new URL(`${SUPABASE_URL}/rest/v1/${table}${query}`);
            const filter = urlWithQuery.searchParams.get('key') || '';
            if (filter.startsWith('eq.')) appDataKey = filter.slice(3);
          } catch {}
        }
        if (appDataKey) invalidateAppDataKeyCache(appDataKey);
      } else {
        for (const key of getCache.keys()) {
          if (key.startsWith(`GET:${SUPABASE_URL}/rest/v1/${table}`)) getCache.delete(key);
        }
      }
    }, () => undefined);
  }
  return request;
}

// Convert JS array to PostgreSQL array format
function toPgArray(arr: string[]): string {
  if (!arr || arr.length === 0) return '{}';
  return '{' + arr.map(s => '"' + s.replace(/"/g, '\\"') + '"').join(',') + '}';
}

// ==================== USERS ====================

export async function getUsers(): Promise<any[]> {
  if (IS_CLOUD) {
    try {
      const data = await supabaseRequest('users', 'GET', undefined, '?select=id,name,username,password,role,subjects,created_at&order=created_at.desc&limit=500');
      const mapped = data.map((u: any) => ({
        ...u,
        subjects: Array.isArray(u.subjects) ? u.subjects : []
      }));
      // cache successful fetch locally so teacher device doesn't lose teachers on next offline fetch
      if (Array.isArray(mapped) && mapped.length > 0) {
        localStorage.setItem('sms_users', JSON.stringify(mapped));
        return mapped;
      }
      // cloud returned empty but local has teachers — keep local (prevents "no teacher registered" flash)
      const savedEmpty = localStorage.getItem('sms_users');
      if (savedEmpty) {
        try {
          const local = JSON.parse(savedEmpty);
          if (Array.isArray(local) && local.length > 0) {
            console.warn('Cloud users empty, keeping local cache (' + local.length + ' users)');
            return local;
          }
        } catch {}
      }
      return mapped;
    } catch (e) {
      console.error('Cloud getUsers failed:', e);
    }
  }
  const saved = localStorage.getItem('sms_users');
  return saved ? JSON.parse(saved) : [
    { id: 'admin-1', name: 'Academic Admin', username: 'admin', password: 'admin123', role: 'admin', subjects: [] }
  ];
}

export async function createUser(user: any) {
  if (IS_CLOUD) {
    try {
      const pgUser = {
        ...user,
        subjects: toPgArray(user.subjects || [])
      };
      await supabaseRequest('users', 'POST', pgUser);
      return;
    } catch (e) {
      console.error('Cloud createUser failed:', e);
    }
  }
  const users = JSON.parse(localStorage.getItem('sms_users') || '[]');
  users.push(user);
  localStorage.setItem('sms_users', JSON.stringify(users));
}

export async function updateUser(id: string, user: any) {
  if (IS_CLOUD) {
    try {
      await supabaseRequest('users', 'PATCH', {
        name: user.name,
        username: user.username,
        password: user.password,
        role: user.role,
        subjects: toPgArray(user.subjects || [])
      }, `?id=eq.${encodeURIComponent(id)}`);
      return;
    } catch (e) {
      console.error('Cloud updateUser failed:', e);
    }
  }
  const users = JSON.parse(localStorage.getItem('sms_users') || '[]');
  localStorage.setItem('sms_users', JSON.stringify(users.map((item: any) => item.id === id ? { ...item, ...user, id } : item)));
}

export async function deleteUser(id: string) {
  if (IS_CLOUD) {
    try {
      await supabaseRequest('users', 'DELETE', undefined, `?id=eq.${id}`);
      return;
    } catch (e) {
      console.error('Cloud deleteUser failed:', e);
    }
  }
  const users = JSON.parse(localStorage.getItem('sms_users') || '[]');
  localStorage.setItem('sms_users', JSON.stringify(users.filter((u: any) => u.id !== id)));
}

// ==================== SCORES ====================
// ✅ FIXED V3 — scores zilikuwa zinapotea kwa sababu POST ikifail ilisave local tu, lakini GET ya cloud ikirudi [] ilizima local. Sasa inamerge + inaonyesha error.

export async function getScores(): Promise<any[]> {
  if (IS_CLOUD) {
    try {
      let data: any[];
      if (scorePracticalColumnsAvailable !== false) {
        try {
          data = await supabaseRequest('scores', 'GET', undefined, '?select=id,teacher_name,student_name,class_name,subject,term,score,max_score,theory_score,practical_score,exam_name,exam_id,created_at&order=created_at.desc&limit=5000');
          scorePracticalColumnsAvailable = true;
        } catch (error: any) {
          const message = String(error?.message || error);
          if (!message.includes('theory_score') && !message.includes('practical_score') && !message.includes('PGRST204')) throw error;
          scorePracticalColumnsAvailable = false;
          data = await supabaseRequest('scores', 'GET', undefined, '?select=id,teacher_name,student_name,class_name,subject,term,score,max_score,exam_name,exam_id,created_at&order=created_at.desc&limit=5000');
        }
      } else {
        data = await supabaseRequest('scores', 'GET', undefined, '?select=id,teacher_name,student_name,class_name,subject,term,score,max_score,exam_name,exam_id,created_at&order=created_at.desc&limit=5000');
      }
      if (Array.isArray(data)) {
        const saved = localStorage.getItem('sms_scores');
        let localScores: any[] = [];
        try { localScores = saved ? JSON.parse(saved) : []; } catch {}
        if (data.length > 0) {
          const localById = new Map(localScores.map((score: any) => [score.id, score]));
          const cloudIds = new Set(data.map((score: any) => score.id));
          const merged = [
            ...data.map((score: any) => {
              const local = localById.get(score.id) || {};
              return {
                ...local,
                ...score,
                theory_score: Object.prototype.hasOwnProperty.call(score, 'theory_score')
                  ? score.theory_score
                  : local.theory_score,
                practical_score: Object.prototype.hasOwnProperty.call(score, 'practical_score')
                  ? score.practical_score
                  : local.practical_score
              };
            }),
            ...localScores.filter((score: any) => !cloudIds.has(score.id))
          ];
          localStorage.setItem('sms_scores', JSON.stringify(merged));
          return merged;
        }
        // Keep locally queued scores when the cloud has no rows yet.
        if (saved) {
          try {
            if (Array.isArray(localScores) && localScores.length > 0) {
              console.warn('Cloud scores empty, showing local cache (' + localScores.length + ' scores) — check Supabase POST error in console');
              return localScores;
            }
          } catch {}
        }
        localStorage.setItem('sms_scores', JSON.stringify(data));
        return data;
      }
      return data;
    } catch (e) {
      console.error('Cloud getScores failed:', e);
    }
  }
  const saved = localStorage.getItem('sms_scores');
  return saved ? JSON.parse(saved) : [];
}

export async function renameStudentScoreReferences(
  className: string,
  oldName: string,
  newName: string
): Promise<any[]> {
  const saved = localStorage.getItem('sms_scores');
  let localScores: any[] = [];
  try { localScores = saved ? JSON.parse(saved) : []; } catch {}
  const renamedScores = localScores.map(score =>
    score.class_name === className && score.student_name === oldName
      ? { ...score, student_name: newName }
      : score
  );
  if (IS_CLOUD && oldName !== newName) {
    await supabaseRequest(
      'scores',
      'PATCH',
      { student_name: newName },
      studentRenameScoreFilter(className, oldName)
    );
  }
  localStorage.setItem('sms_scores', JSON.stringify(renamedScores));
  return renamedScores;
}

function postgrestQuotedEq(value: string): string {
  const quoted = `"${value.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
  return `eq.${encodeURIComponent(quoted)}`;
}

function studentRenameScoreFilter(className: string, oldName: string): string {
  return `?class_name=${postgrestQuotedEq(className)}&student_name=${postgrestQuotedEq(oldName)}`;
}

export async function addScore(score: any) {
  // always keep optimistic local copy
  const createdAt = new Date().toISOString();
  const savedScore = { ...score, created_at: createdAt };
  const localScores: any[] = JSON.parse(localStorage.getItem('sms_scores') || '[]');
  const existingIndex = localScores.findIndex((s: any) => s.id === savedScore.id);
  if (existingIndex >= 0) localScores[existingIndex] = { ...localScores[existingIndex], ...savedScore };
  else localScores.push(savedScore);
  localStorage.setItem('sms_scores', JSON.stringify(localScores));
  if (IS_CLOUD) {
    try {
      // clean payload — remove undefined, ensure numbers
      const payload: any = {
        id: String(score.id),
        teacher_name: String(score.teacher_name || ''),
        teacher_id: score.teacher_id ? String(score.teacher_id) : null,
        student_name: String(score.student_name || ''),
        class_name: String(score.class_name || ''),
        subject: String(score.subject || ''),
        term: String(score.term || ''),
        score: Number(score.score),
        max_score: Number(score.max_score || 100),
        exam_name: score.exam_name ? String(score.exam_name) : null,
        exam_id: score.exam_id ? String(score.exam_id) : null,
        created_at: createdAt,
      };
      if (Object.prototype.hasOwnProperty.call(score, 'theory_score')) {
        payload.theory_score = score.theory_score == null ? null : Number(score.theory_score);
      }
      if (Object.prototype.hasOwnProperty.call(score, 'practical_score')) {
        payload.practical_score = score.practical_score == null ? null : Number(score.practical_score);
      }
      // drop null/undefined optional fields if needed
      if (!payload.exam_name) delete payload.exam_name;
      if (!payload.exam_id) delete payload.exam_id;
      if (!payload.teacher_id) delete payload.teacher_id;
      try {
        await supabaseRequest('scores', 'POST', payload, undefined, true);
        return;
      } catch (err: any) {
        const msg = String(err?.message || err);
        if (msg.includes('teacher_id')) {
          const withoutTeacherId = { ...payload };
          delete withoutTeacherId.teacher_id;
          await supabaseRequest('scores', 'POST', withoutTeacherId, undefined, true);
          return;
        }
        // 🔧 AUTO-FIX for live DB missing exam_id / exam_name columns (PGRST204)
        if (msg.includes('exam_id') || msg.includes('exam_name') || msg.includes('PGRST204')) {
          console.warn('Retrying addScore without exam_id/exam_name (column missing in Supabase) — run ALTER TABLE SQL to fix permanently');
          const fallback: any = { ...payload };
          delete fallback.exam_id;
          delete fallback.exam_name;
          delete fallback.teacher_id;
          // keep term if exists, as fallback still useful
          await supabaseRequest('scores', 'POST', fallback, undefined, true);
          return;
        }
        throw err;
      }
    } catch (e: any) {
      console.error('Cloud addScore failed:', e);
      // keep local, but throw so UI can show error (App.tsx will catch and alert)
      throw e;
    }
  }
}

// Optional: bulk sync unsynced local scores to cloud (call on login)
export async function syncScoresToCloud() {
  if (!IS_CLOUD) return;
  try {
    const local: any[] = JSON.parse(localStorage.getItem('sms_scores') || '[]');
    if (local.length === 0) return;
    const cloudData: any[] = await supabaseRequest('scores', 'GET', undefined, '?select=id&limit=1000').catch(()=>[]);
    const cloudIds = new Set((cloudData||[]).map((r:any)=>r.id));
    const unsynced = local.filter((s:any)=> !cloudIds.has(s.id));
    for (const s of unsynced) {
      try { await supabaseRequest('scores', 'POST', s); } catch {}
    }
    if (unsynced.length) console.log('Synced ' + unsynced.length + ' scores to cloud');
  } catch {}
}

// ==================== DUTY REPORTS ====================

export async function getDutyReports(): Promise<any[]> {
  if (IS_CLOUD) {
    try {
      return await supabaseRequest('duty_reports', 'GET', undefined, '?select=id,teacher_name,date,present_count,absent_count,events_summary,day_end_summary,created_at&order=created_at.desc&limit=200');
    } catch (e) {
      console.error('Cloud getDutyReports failed:', e);
    }
  }
  const saved = localStorage.getItem('sms_duties');
  return saved ? JSON.parse(saved) : [];
}

export async function addDutyReport(report: any) {
  if (IS_CLOUD) {
    try {
      const dbReport = {
        id: report.id,
        teacher_name: report.teacher_name,
        date: report.date,
        present_count: report.present_count || 0,
        absent_count: report.absent_count || 0,
        events_summary: JSON.stringify({
          sections: report.sections,
          attendance: report.attendance,
          tod_comment: report.tod_comment,
          tod_name: report.tod_name,
          headmaster_comment: report.headmaster_comment,
          headmaster_name: report.headmaster_name,
        }),
        day_end_summary: report.tod_comment || ''
      };
      await supabaseRequest('duty_reports', 'POST', dbReport);
      return;
    } catch (e) {
      console.error('Cloud addDutyReport failed:', e);
    }
  }
  const duties = JSON.parse(localStorage.getItem('sms_duties') || '[]');
  duties.push(report);
  localStorage.setItem('sms_duties', JSON.stringify(duties));
}

export async function getDutyReportsFull(): Promise<any[]> {
  if (IS_CLOUD) {
    try {
      const data = await supabaseRequest('duty_reports', 'GET', undefined, '?select=id,teacher_name,date,present_count,absent_count,events_summary,day_end_summary,created_at&order=created_at.desc&limit=200');
      return data.map((d: any) => {
        try {
          const extra = JSON.parse(d.events_summary || '{}');
          return {
            ...d,
            sections: extra.sections || {},
            attendance: extra.attendance || [],
            tod_comment: extra.tod_comment || d.day_end_summary || '',
            tod_name: extra.tod_name || d.teacher_name,
            headmaster_comment: extra.headmaster_comment || '',
            headmaster_name: extra.headmaster_name || 'Saidi Mpambika',
          };
        } catch {
          return d;
        }
      });
    } catch (e) {
      console.error('Cloud getDutyReportsFull failed:', e);
    }
  }
  const saved = localStorage.getItem('sms_duties');
  return saved ? JSON.parse(saved) : [];
}

// ==================== RELEASE STATE ====================

export async function getReleased(): Promise<string[]> {
  if (IS_CLOUD) {
    try {
      const data = await supabaseRequest('release_state', 'GET', undefined, '?select=term&approved=eq.true&limit=10');
      return data.map((r: any) => r.term);
    } catch (e) {
      console.error('Cloud getReleased failed:', e);
    }
  }
  const saved = localStorage.getItem('sms_released');
  return saved ? JSON.parse(saved) : [];
}

export async function releaseTerm(term: string, adminName: string) {
  if (IS_CLOUD) {
    try {
      await supabaseRequest('release_state', 'PATCH',
        { approved: true, approved_by: adminName, approved_at: new Date().toISOString() },
        `?term=eq.${encodeURIComponent(term)}`
      );
      return;
    } catch {
      try {
        await supabaseRequest('release_state', 'POST', {
          term, approved: true, approved_by: adminName, approved_at: new Date().toISOString()
        });
        return;
      } catch (e) {
        console.error('Cloud releaseTerm failed:', e);
      }
    }
  }
  const released = JSON.parse(localStorage.getItem('sms_released') || '[]');
  if (!released.includes(term)) {
    released.push(term);
    localStorage.setItem('sms_released', JSON.stringify(released));
  }
}

// ==================== APP DATA SYNC (Timetable, Settings, etc.) ====================

const SYNC_KEYS = [
  'sms_school_subjects', 'sms_school_classes',
  'sms_students', 'sms_exams', 'sms_exam_submissions',
  'sms_behavior', 'sms_messages', 'sms_registered_students',
  'sms_school_name_setting', 'sms_district_name', 'sms_school_address',
  'sms_school_motto', 'sms_academic_name', 'sms_headmaster_name',
  'sms_school_logo', 'sms_academic_sig', 'sms_headmaster_sig',
  'tt_timetableData', 'tt_teachers', 'tt_subjects', 'tt_rooms',
  'tt_classes', 'tt_classSubjects', 'tt_timeSlots', 'tt_days',
  'tt_shared_subjects', 'tt_shared_teachers', 'tt_shared_classes'
];

const ROLE_SYNC_KEYS = ['sms_class_teachers', 'sms_teaching_assignments'];
const APP_DATA_SYNC_KEYS = [...new Set([...SYNC_KEYS, ...ROLE_SYNC_KEYS])];
const PENDING_SUFFIX = '_cloud_pending';
const CONFIRMED_VALUE_SUFFIX = '_cloud_confirmed_value';

type PendingAppDataWrite = { version: string; deletedStudentIds?: string[] };

function readPendingWrite(key: string): PendingAppDataWrite | null {
  try {
    const raw = localStorage.getItem(`${key}${PENDING_SUFFIX}`);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function publishAppDataSyncStatus(key: string, status: 'pending' | 'saved' | 'error') {
  window.dispatchEvent(new CustomEvent('app-data-sync-status', { detail: { key, status } }));
}

function nextCloudUpdatedAt(previous?: string): string {
  const previousTime = Date.parse(previous || '') || 0;
  const nextTime = Math.max(Date.now(), previousTime + 1) + Math.floor(Math.random() * 1000);
  return new Date(nextTime).toISOString();
}

export function markAppDataKeyDirty(key: string, value?: string): void {
  const pending = readPendingWrite(key);
  localStorage.setItem(`${key}${PENDING_SUFFIX}`, JSON.stringify({
    version: `${Date.now()}-${Math.random()}`,
    deletedStudentIds: pending?.deletedStudentIds || []
  }));
  if (value !== undefined) localStorage.setItem(key, value);
  publishAppDataSyncStatus(key, 'pending');
}

export function saveAppDataKeyLocally(key: string, value: string): void {
  const previous = localStorage.getItem(key);
  localStorage.setItem(key, value);
  if (!IS_CLOUD || previous === null || previous === value) return;
  markAppDataKeyDirty(key);
  void syncToCloud().catch(error => {
    publishAppDataSyncStatus(key, 'error');
    console.error(`Cloud sync failed for ${key}; it will retry:`, error);
  });
}

export function markStudentDeleted(className: string, student: { id?: string; name?: string }): void {
  const identity = student.id || `legacy:${className.toLocaleLowerCase()}:${(student.name || '').trim().toLocaleLowerCase()}`;
  const pending = readPendingWrite('sms_students');
  localStorage.setItem('sms_students_cloud_pending', JSON.stringify({
    version: `${Date.now()}-${Math.random()}`,
    deletedStudentIds: [...new Set([...(pending?.deletedStudentIds || []), identity])]
  }));
  publishAppDataSyncStatus('sms_students', 'pending');
}

function studentIdentity(className: string, student: any): string {
  const normalize = (value: string) => value.normalize('NFKC').trim().replace(/\s+/g, ' ').toLowerCase();
  return String(student?.id || `legacy:${encodeURIComponent(normalize(className))}:${encodeURIComponent(normalize(String(student?.name || '')))}:${student?._legacyPosition ?? 0}`);
}

function legacyDeletionIdentity(className: string, student: any): string {
  const normalize = (value: string) => value.normalize('NFKC').trim().replace(/\s+/g, ' ').toLowerCase();
  return `legacy:${normalize(className)}:${normalize(String(student?.name || ''))}`;
}

function studentNameAliases(student: any): Set<string> {
  const normalize = (value: string) => value.normalize('NFKC').trim().replace(/\s+/g, ' ').toLowerCase();
  return new Set([student?.name, ...(Array.isArray(student?.previousNames) ? student.previousNames : [])]
    .filter((name): name is string => typeof name === 'string' && name.trim().length > 0)
    .map(normalize));
}

function mergeStudentValues(localValue: string, cloudValue: string | null, deletedIds: string[] = [], teacherClass?: string): string {
  const parse = (value: string | null): Record<string, any[]> => {
    try {
      const parsed = value ? JSON.parse(value) : {};
      return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
    } catch {
      return {};
    }
  };
  const localStudents = parse(localValue);
  const cloudStudents = parse(cloudValue);
  const deleted = new Set(deletedIds);
  const merged: Record<string, any[]> = {};
  for (const className of new Set([...Object.keys(cloudStudents), ...Object.keys(localStudents)])) {
    const records: { id: string; student: any; hasExplicitId: boolean }[] = [];
    const sources = teacherClass && className !== teacherClass
      ? [cloudStudents[className]]
      : [cloudStudents[className], localStudents[className]];
    for (const rows of sources) {
      if (!Array.isArray(rows)) continue;
      for (const [position, row] of rows.entries()) {
        const student = typeof row === 'string' ? { name: row } : row;
        if (!student || typeof student !== 'object') continue;
        const studentWithPosition = { ...student, _legacyPosition: position };
        const id = studentIdentity(className, studentWithPosition);
        if (deleted.has(id) || deleted.has(legacyDeletionIdentity(className, student))) continue;
        const explicitId = typeof student.id === 'string' && student.id.length > 0;
        const aliases = studentNameAliases(student);
        let index = records.findIndex(record => record.id === id);
        if (index < 0) {
          index = records.findIndex(record => {
            if (explicitId && record.hasExplicitId) return false;
            const existingAliases = studentNameAliases(record.student);
            return [...aliases].some(alias => existingAliases.has(alias));
          });
        }
        if (index < 0) {
          records.push({ id, student: { ...student, id }, hasExplicitId: explicitId });
          continue;
        }
        const existing = records[index].student;
        const existingUpdatedAt = Date.parse(existing?.updatedAt || '') || 0;
        const studentUpdatedAt = Date.parse(student.updatedAt || '') || 0;
        if (studentUpdatedAt >= existingUpdatedAt) {
          records[index] = {
            id: explicitId ? id : records[index].id,
            student: { ...student, id: records[index].id },
            hasExplicitId: records[index].hasExplicitId || explicitId
          };
        } else if (explicitId && !records[index].hasExplicitId) {
          records[index] = { ...records[index], id, student: { ...existing, id } , hasExplicitId: true };
        }
      }
    }
    merged[className] = records.map(record => record.student);
  }
  return JSON.stringify(merged);
}

function appDataKeysFilter(keys: string[]): string {
  return `key=in.(${keys.map(key => encodeURIComponent(key)).join(',')})`;
}

function mergeRoleAssignmentValue(key: string, localValue: string, cloudValue: string | null): string {
  const parseObject = (value: string | null): Record<string, any> => {
    try {
      const parsed = value ? JSON.parse(value) : {};
      return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
    } catch {
      return {};
    }
  };
  const cloudAssignments = parseObject(cloudValue);
  const localAssignments = parseObject(localValue);
  const merged = { ...cloudAssignments, ...localAssignments };
  if (key === 'sms_teaching_assignments') {
    for (const [teacherId, assignments] of Object.entries(merged)) {
      if (!Array.isArray(assignments)) delete merged[teacherId];
    }
  }
  return JSON.stringify(merged);
}

function mergeExamSubmissionValues(localValue: string, cloudValue: string | null): string {
  const parseRecords = (value: string | null): any[] => {
    const parsed = value ? JSON.parse(value) : [];
    if (!Array.isArray(parsed)) throw new Error('Invalid exam submission data; expected a list.');
    for (const record of parsed) {
      if (!record?.exam_id || !record?.class_name || !record?.subject) {
        throw new Error('Invalid exam submission record; exam, class, and subject are required.');
      }
    }
    return parsed;
  };
  const merged = new Map<string, any>();
  for (const record of [...parseRecords(cloudValue), ...parseRecords(localValue)]) {
    const identity = JSON.stringify([record.exam_id, record.class_name, record.subject]);
    const existing = merged.get(identity);
    if (!existing || (Date.parse(record.submitted_at || '') || 0) >= (Date.parse(existing.submitted_at || '') || 0)) {
      merged.set(identity, record);
    }
  }
  return JSON.stringify([...merged.values()]);
}

function isAdminSession(): boolean {
  try { return JSON.parse(localStorage.getItem('sms_current_user') || 'null')?.role === 'admin'; } catch { return false; }
}

function applyCloudAppDataItem(item: any, isAdmin: boolean, forceApply = false): boolean {
  if (!item?.key || item.value === undefined) return false;
  if (readPendingWrite(item.key)) return false;
  const localValue = localStorage.getItem(item.key);
  const cloudTimestamp = Date.parse(item.updated_at || '') || 0;
  const isSharedRoleKey = item.key === 'sms_class_teachers' || item.key === 'sms_teaching_assignments';
  let applyValue = true;

  if (!forceApply && (item.key === 'sms_school_classes' || item.key === 'tt_shared_classes')) {
    try {
      const savedClasses = JSON.parse(localStorage.getItem('sms_school_classes') || 'null');
      const incomingClasses = JSON.parse(item.value);
      const localTimestamp = parseInt(localStorage.getItem('sms_school_classes_ts') || '0', 10);
      if (Array.isArray(savedClasses) && Array.isArray(incomingClasses)) {
        const localIsCustom = JSON.stringify(savedClasses) !== JSON.stringify(LEGACY_DEFAULT_CLASSES);
        const incomingIsLegacyDefault = JSON.stringify(incomingClasses) === JSON.stringify(LEGACY_DEFAULT_CLASSES);
        if ((localIsCustom && incomingIsLegacyDefault) || (localTimestamp > 0 && localTimestamp >= cloudTimestamp)) applyValue = false;
      }
    } catch {}
  }

  if (!forceApply) {
    const isCloudEmpty = item.value === '[]' || item.value === '{}' || item.value === '' || item.value === '""';
    const isLocalNonEmpty = !!localValue && localValue !== '[]' && localValue !== '{}' && localValue !== '' && localValue !== '""';
    if (isCloudEmpty && isLocalNonEmpty && !isSharedRoleKey) applyValue = false;
    try {
      const localTimestamp = parseInt(localStorage.getItem(`${item.key}_ts`) || '0', 10);
      if (localTimestamp > 0 && localTimestamp >= cloudTimestamp && (!isSharedRoleKey || isAdmin)) applyValue = false;
    } catch {}
  } else if (cloudTimestamp > 0) {
    localStorage.setItem(`${item.key}_ts`, String(cloudTimestamp));
  }

  const changed = applyValue && localValue !== item.value;
  if (applyValue) localStorage.setItem(item.key, item.value);
  localStorage.setItem(`${item.key}_cloud_updated_at`, item.updated_at || '');
  localStorage.setItem(`${item.key}${CONFIRMED_VALUE_SUFFIX}`, item.value);
  return changed;
}

async function syncAppDataKeys(keys: string[] = APP_DATA_SYNC_KEYS, bypassCache = false): Promise<void> {
  if (!IS_CLOUD || keys.length === 0) return;
  await syncToCloud();
  let isAdmin = false;
  try { isAdmin = JSON.parse(localStorage.getItem('sms_current_user') || 'null')?.role === 'admin'; } catch {}

  const metadata = await supabaseRequest(
    'app_data', 'GET', undefined,
    `?${appDataKeysFilter(keys)}&select=key,updated_at&limit=100`,
    false,
    bypassCache
  );
  const recoveredRoleKeys = new Set<string>();
  if (isAdminSession()) {
    const metadataByKey = new Map((Array.isArray(metadata) ? metadata : []).map((item: any) => [item.key, item]));
    for (const key of ROLE_SYNC_KEYS) {
      if (!keys.includes(key) || readPendingWrite(key)) continue;
      const localValue = localStorage.getItem(key);
      if (localValue === null) continue;
      const item = metadataByKey.get(key);
      const cloudTimestamp = Date.parse(item?.updated_at || '') || 0;
      const localTimestamp = Number(localStorage.getItem(`${key}_ts`) || 0);
      const confirmedValue = localStorage.getItem(`${key}${CONFIRMED_VALUE_SUFFIX}`);
      const confirmedTimestamp = Date.parse(localStorage.getItem(`${key}_cloud_updated_at`) || '') || 0;
      const localDiffersFromConfirmed = confirmedValue !== null && localValue !== confirmedValue;
      const cloudHasNotChangedSinceConfirmation = confirmedTimestamp > 0 && cloudTimestamp <= confirmedTimestamp;
      if (localTimestamp > cloudTimestamp || (localDiffersFromConfirmed && cloudHasNotChangedSinceConfirmation)) {
        markAppDataKeyDirty(key, localValue);
        recoveredRoleKeys.add(key);
      }
    }
    if (recoveredRoleKeys.size > 0) await syncToCloud();
  }
  const changed = (Array.isArray(metadata) ? metadata : []).filter((item: any) => {
    return item.key && !recoveredRoleKeys.has(item.key) && !readPendingWrite(item.key) &&
      localStorage.getItem(`${item.key}_cloud_updated_at`) !== (item.updated_at || '');
  });
  if (changed.length === 0) return;

  const values = await supabaseRequest(
    'app_data', 'GET', undefined,
    `?${appDataKeysFilter(changed.map((item: any) => item.key))}&select=key,value,updated_at&limit=100`,
    false,
    bypassCache
  );
  const valuesByKey = new Map((Array.isArray(values) ? values : []).map((item: any) => [item.key, item]));
  let appliedChange = false;
  for (const metadataItem of changed) {
    const item = valuesByKey.get(metadataItem.key);
    if (item) appliedChange = applyCloudAppDataItem(item, isAdmin) || appliedChange;
  }
  if (appliedChange) window.dispatchEvent(new Event('cloud-sync-complete'));
}

export async function getRoleAssignmentsFromCloud(): Promise<{
  classTeachers: Record<string, string>;
  teachingAssignments: Record<string, { cls: string; sub: string }[]>;
} | null> {
  if (!IS_CLOUD) return null;
  try {
    const result = {
      classTeachers: {} as Record<string, string>,
      teachingAssignments: {} as Record<string, { cls: string; sub: string }[]>
    };
    await syncAppDataKeys(ROLE_SYNC_KEYS);
    result.classTeachers = JSON.parse(localStorage.getItem('sms_class_teachers') || '{}');
    result.teachingAssignments = JSON.parse(localStorage.getItem('sms_teaching_assignments') || '{}');
    return result;
  } catch (e) {
    console.error('Cloud role assignments fetch failed:', e);
    return null;
  }
}

export async function syncRoleAssignmentsToCloud(
  classTeachers: unknown,
  teachingAssignments: unknown,
  changedKeys: string[] = ROLE_SYNC_KEYS
) {
  if (!IS_CLOUD) return;
  if (!isAdminSession()) return;

  const values: Record<string, unknown> = {
    sms_class_teachers: classTeachers,
    sms_teaching_assignments: teachingAssignments
  };
  for (const key of changedKeys) {
    if (!ROLE_SYNC_KEYS.includes(key)) continue;
    markAppDataKeyDirty(key, JSON.stringify(values[key]));
  }
  await syncToCloud();
}

let syncToCloudPromise: Promise<void> | null = null;

async function pushPendingAppDataKey(key: string): Promise<void> {
  const pending = readPendingWrite(key);
  if (!pending) return;
  let localValue = localStorage.getItem(key);
  if (localValue === null) return;

  if (ROLE_SYNC_KEYS.includes(key)) {
    for (let attempt = 0; attempt < 5; attempt++) {
      const latest = await supabaseRequest(
        'app_data', 'GET', undefined,
        `?key=eq.${encodeURIComponent(key)}&select=key,value,updated_at&limit=1`,
        false, true
      );
      const cloudItem = Array.isArray(latest) ? latest[0] : null;
      const mergedValue = mergeRoleAssignmentValue(key, localValue, cloudItem?.value ?? null);
      if (mergedValue !== localValue) {
        localValue = mergedValue;
        localStorage.setItem(key, localValue);
      }
      if (cloudItem && mergedValue === cloudItem.value) {
        completePendingWrite(key, pending, mergedValue, cloudItem.updated_at || '');
        return;
      }

      const updatedAt = nextCloudUpdatedAt(cloudItem?.updated_at);
      try {
        const result = cloudItem
          ? await supabaseRequest(
            'app_data', 'PATCH',
            { value: mergedValue, updated_at: updatedAt },
            `?key=eq.${encodeURIComponent(key)}&updated_at=eq.${encodeURIComponent(cloudItem.updated_at)}&select=key,value,updated_at`,
            false, false, true
          )
          : await supabaseRequest(
            'app_data', 'POST',
            { key, value: mergedValue, updated_at: updatedAt },
            undefined, false, false, true
          );
        const savedItem = Array.isArray(result)
          ? result.find((item: any) => item.key === key && item.value === mergedValue)
          : null;
        if (!savedItem) {
          if (cloudItem) continue;
          throw new Error(`Cloud did not confirm saving ${key}.`);
        }
        invalidateAppDataKeyCache(key);
        completePendingWrite(key, pending, mergedValue, savedItem.updated_at || updatedAt);
        return;
      } catch (error: any) {
        if (error?.status === 409) continue;
        throw error;
      }
    }
    throw new Error(`Role assignments changed repeatedly while saving ${key}. It will retry automatically.`);
  }

  if (key === 'sms_exam_submissions') {
    for (let attempt = 0; attempt < 5; attempt++) {
      const latest = await supabaseRequest(
        'app_data', 'GET', undefined,
        `?key=eq.${encodeURIComponent(key)}&select=key,value,updated_at&limit=1`,
        false, true
      );
      const cloudItem = Array.isArray(latest) ? latest[0] : null;
      const mergedValue = mergeExamSubmissionValues(localValue, cloudItem?.value ?? null);
      if (mergedValue !== localValue) {
        localValue = mergedValue;
        localStorage.setItem(key, localValue);
      }
      if (cloudItem && mergedValue === cloudItem.value) {
        completePendingWrite(key, pending, mergedValue, cloudItem.updated_at || '');
        return;
      }

      const updatedAt = nextCloudUpdatedAt(cloudItem?.updated_at);
      try {
        const result = cloudItem
          ? await supabaseRequest(
            'app_data', 'PATCH',
            { value: mergedValue, updated_at: updatedAt },
            `?key=eq.${encodeURIComponent(key)}&updated_at=eq.${encodeURIComponent(cloudItem.updated_at)}&select=key,value,updated_at`,
            false, false, true
          )
          : await supabaseRequest(
            'app_data', 'POST',
            { key, value: mergedValue, updated_at: updatedAt },
            undefined, false, false, true
          );
        const savedItem = Array.isArray(result)
          ? result.find((item: any) => item.key === key && item.value === mergedValue)
          : null;
        if (!savedItem) {
          if (cloudItem) continue;
          throw new Error(`Cloud did not confirm saving ${key}.`);
        }
        invalidateAppDataKeyCache(key);
        completePendingWrite(key, pending, mergedValue, savedItem.updated_at || updatedAt);
        return;
      } catch (error: any) {
        if (error?.status === 409) continue;
        throw error;
      }
    }
    throw new Error('Exam submissions changed repeatedly while saving. It will retry automatically.');
  }

  if (key === 'sms_students') {
    let teacherClass: string | undefined;
    try {
      const currentUser = JSON.parse(localStorage.getItem('sms_current_user') || 'null');
      const assignedClasses = JSON.parse(localStorage.getItem('sms_class_teachers') || '{}');
      if (currentUser?.role === 'teacher') {
        teacherClass = Object.keys(assignedClasses).find(className => assignedClasses[className] === currentUser.id);
      }
    } catch {}
    for (let attempt = 0; attempt < 5; attempt++) {
      const latest = await supabaseRequest(
        'app_data', 'GET', undefined,
        `?key=eq.${encodeURIComponent(key)}&select=key,value,updated_at&limit=1`,
        false, true
      );
      const cloudItem = Array.isArray(latest) ? latest[0] : null;
      const mergedValue = mergeStudentValues(localValue, cloudItem?.value ?? null, pending.deletedStudentIds || [], teacherClass);
      if (mergedValue !== localValue) {
        localValue = mergedValue;
        localStorage.setItem(key, localValue);
      }
      const updatedAt = nextCloudUpdatedAt();
      if (cloudItem?.updated_at) {
        const result = await supabaseRequest(
          'app_data', 'PATCH',
          { value: localValue, updated_at: updatedAt },
          `?key=eq.${encodeURIComponent(key)}&updated_at=eq.${encodeURIComponent(cloudItem.updated_at)}&select=key,value,updated_at`,
          false, false, true
        );
        if (!Array.isArray(result) || result.length === 0) continue;
        const savedItem = result.find((item: any) => item.key === key && item.value === localValue);
        if (!savedItem) throw new Error('Cloud did not confirm saving the student list.');
        completePendingWrite(key, pending, localValue, savedItem.updated_at || updatedAt);
        return;
      } else {
        try {
          const result = await supabaseRequest(
            'app_data', 'POST', { key, value: localValue, updated_at: updatedAt },
            undefined, false, false, true
          );
          const savedItem = Array.isArray(result)
            ? result.find((item: any) => item.key === key && item.value === localValue)
            : null;
          if (!savedItem) throw new Error('Cloud did not confirm saving the student list.');
          invalidateAppDataKeyCache(key);
          completePendingWrite(key, pending, localValue, savedItem.updated_at || updatedAt);
          return;
        } catch (error: any) {
          if (error?.status === 409) continue;
          throw error;
        }
      }
    }
    throw new Error('Student list changed repeatedly while saving. It will retry automatically.');
  }

  const updatedAt = nextCloudUpdatedAt(localStorage.getItem(`${key}_cloud_updated_at`) || undefined);
  const result = await supabaseRequest(
    'app_data', 'POST', { key, value: localValue, updated_at: updatedAt },
    undefined, true, false, true
  );
  const savedItem = Array.isArray(result)
    ? result.find((item: any) => item.key === key && item.value === localValue)
    : null;
  if (!savedItem) throw new Error(`Cloud did not confirm saving ${key}.`);
  invalidateAppDataKeyCache(key);
  completePendingWrite(key, pending, localValue, savedItem.updated_at || updatedAt);
}

function completePendingWrite(key: string, pending: PendingAppDataWrite, value: string, updatedAt: string) {
  if (localStorage.getItem(key) !== value) return;
  const currentPending = readPendingWrite(key);
  if (currentPending?.version !== pending.version) return;
  localStorage.setItem(`${key}_ts`, String(Date.parse(updatedAt)));
  localStorage.setItem(`${key}_cloud_updated_at`, updatedAt);
  localStorage.setItem(`${key}${CONFIRMED_VALUE_SUFFIX}`, value);
  localStorage.removeItem(`${key}${PENDING_SUFFIX}`);
  publishAppDataSyncStatus(key, 'saved');
  window.dispatchEvent(new Event('cloud-sync-complete'));
}

async function syncPendingAppDataKeys(keys: string[] = APP_DATA_SYNC_KEYS): Promise<void> {
  for (const key of keys) {
    if (!readPendingWrite(key)) continue;
    try {
      await pushPendingAppDataKey(key);
    } catch (error) {
      publishAppDataSyncStatus(key, 'error');
      throw error;
    }
  }
}

const STUDENT_RENAME_PENDING_KEY = 'sms_student_rename_pending';

type PendingStudentRename = {
  className: string;
  oldName: string;
  newName: string;
  nextStudents: string;
  nextBehavior: string;
  behaviorChanged: boolean;
  scoresUpdated: boolean;
  studentsSaved: boolean;
  behaviorSaved: boolean;
};

function readPendingStudentRename(): PendingStudentRename | null {
  try {
    const raw = localStorage.getItem(STUDENT_RENAME_PENDING_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writePendingStudentRename(rename: PendingStudentRename): void {
  localStorage.setItem(STUDENT_RENAME_PENDING_KEY, JSON.stringify(rename));
}

async function completePendingStudentRename(): Promise<void> {
  const rename = readPendingStudentRename();
  if (!rename) return;

  if (!rename.scoresUpdated) {
    await renameStudentScoreReferences(rename.className, rename.oldName, rename.newName);
    rename.scoresUpdated = true;
    writePendingStudentRename(rename);
  }

  if (!rename.studentsSaved) {
    markAppDataKeyDirty('sms_students', rename.nextStudents);
    await pushPendingAppDataKey('sms_students');
    rename.studentsSaved = true;
    writePendingStudentRename(rename);
  }

  if (!rename.behaviorSaved) {
    if (rename.behaviorChanged) {
      let latestBehavior: Record<string, any> = {};
      let intendedBehavior: Record<string, any> = {};
      try { latestBehavior = JSON.parse(localStorage.getItem('sms_behavior') || '{}'); } catch {}
      try { intendedBehavior = JSON.parse(rename.nextBehavior); } catch {}
      const mergedBehavior = {
        ...intendedBehavior,
        ...latestBehavior,
        [rename.newName]: {
          ...(intendedBehavior[rename.newName] || {}),
          ...(latestBehavior[rename.oldName] || {}),
          ...(latestBehavior[rename.newName] || {})
        }
      };
      markAppDataKeyDirty('sms_behavior', JSON.stringify(mergedBehavior));
      await pushPendingAppDataKey('sms_behavior');
    }
    rename.behaviorSaved = true;
    writePendingStudentRename(rename);
  }

  localStorage.removeItem(STUDENT_RENAME_PENDING_KEY);
  publishAppDataSyncStatus('sms_students', 'saved');
  window.dispatchEvent(new Event('cloud-sync-complete'));
}

export async function renameStudent(
  className: string,
  oldName: string,
  newName: string,
  nextStudents: string
): Promise<void> {
  if (oldName === newName) return;
  let behavior: Record<string, any> = {};
  try { behavior = JSON.parse(localStorage.getItem('sms_behavior') || '{}'); } catch {}
  const nextBehavior = { ...behavior };
  const behaviorChanged = Object.prototype.hasOwnProperty.call(behavior, oldName);
  if (behaviorChanged) {
    nextBehavior[newName] = { ...(behavior[oldName] || {}), ...(behavior[newName] || {}) };
  }
  const rename: PendingStudentRename = {
    className,
    oldName,
    newName,
    nextStudents,
    nextBehavior: JSON.stringify(nextBehavior),
    behaviorChanged,
    scoresUpdated: false,
    studentsSaved: false,
    behaviorSaved: false
  };
  writePendingStudentRename(rename);
  if (!IS_CLOUD) {
    await renameStudentScoreReferences(className, oldName, newName);
    localStorage.setItem('sms_students', nextStudents);
    localStorage.setItem('sms_behavior', rename.nextBehavior);
    return;
  }
  publishAppDataSyncStatus('sms_students', 'pending');
  try {
    if (syncToCloudPromise) await syncToCloudPromise.catch(() => undefined);
    await syncToCloud();
    if (readPendingStudentRename()) {
      throw new Error('Student rename is still pending and will retry automatically.');
    }
  } catch (error) {
    publishAppDataSyncStatus('sms_students', 'error');
    const pending = readPendingStudentRename();
    if (error && typeof error === 'object') {
      (error as any).renameStage = !pending?.scoresUpdated
        ? 'scores'
        : !pending.studentsSaved
          ? 'students'
          : 'behavior';
    }
    throw error;
  }
}

export async function syncAppDataKeyToCloud(key: string, value: string): Promise<void> {
  if (!IS_CLOUD) return;
  markAppDataKeyDirty(key, value);
  await syncToCloud();
}

export function syncToCloud(): Promise<void> {
  if (!IS_CLOUD) return Promise.resolve();
  if (syncToCloudPromise) return syncToCloudPromise;
  syncToCloudPromise = (async () => {
    await completePendingStudentRename();
    await syncPendingAppDataKeys();
  })().finally(() => { syncToCloudPromise = null; });
  return syncToCloudPromise;
}

// ✅ FIXED — handles classes deletion + addition without reverting
export async function syncFromCloud(bypassCache = false) {
  if (!IS_CLOUD) return;
  await syncAppDataKeys(APP_DATA_SYNC_KEYS, bypassCache);
}

// ==================== REGISTERED STUDENTS (per class) ====================
// Reads/writes DIRECTLY to Supabase so all devices see the same numbers instantly.

export async function getRegisteredStudents(): Promise<Record<string, { regB: number; regG: number }>> {
  if (readPendingWrite('sms_registered_students')) {
    const pending = localStorage.getItem('sms_registered_students');
    return pending ? JSON.parse(pending) : {};
  }
  if (IS_CLOUD) {
    try {
      const data = await supabaseRequest(
        'app_data', 'GET', undefined,
        `?key=eq.sms_registered_students&select=value`
      );
      if (Array.isArray(data) && data.length > 0 && data[0].value) {
        const parsed = JSON.parse(data[0].value);
        localStorage.setItem('sms_registered_students', data[0].value);
        return parsed;
      }
    } catch (e) {
      console.error('Cloud getRegisteredStudents failed:', e);
    }
  }
  const saved = localStorage.getItem('sms_registered_students');
  return saved ? JSON.parse(saved) : {};
}

export async function getSchoolClassesFromCloud(): Promise<string[]> {
  if (readPendingWrite('sms_school_classes')) {
    try { return JSON.parse(localStorage.getItem('sms_school_classes') || '[]'); } catch { return []; }
  }
  if (IS_CLOUD) {
    try {
      const data = await supabaseRequest('app_data', 'GET', undefined, '?key=eq.sms_school_classes&select=value');
      if (Array.isArray(data) && data.length > 0 && data[0].value) {
        const parsed = JSON.parse(data[0].value);
        if (Array.isArray(parsed)) {
          localStorage.setItem('sms_school_classes', data[0].value);
          localStorage.setItem('tt_shared_classes', data[0].value);
          return parsed;
        }
      }
    } catch (e) { console.error('getSchoolClassesFromCloud failed', e); }
  }
  const localValue = localStorage.getItem('sms_school_classes');
  if (localValue !== null) {
    try {
      const localClasses = JSON.parse(localValue);
      if (Array.isArray(localClasses)) return localClasses;
    } catch {}
  }
  return ['Form IA', 'Form IB', 'Form IC', 'Form IIA', 'Form IIB', 'Form IIC', 'Form IIIA', 'Form IIIB', 'Form IIIC', 'Form IVA', 'Form IVB', 'Form IVC'];
}

export async function saveRegisteredStudents(
  data: Record<string, { regB: number; regG: number }>
) {
  const value = JSON.stringify(data);
  localStorage.setItem('sms_registered_students', value);

  if (IS_CLOUD) {
    markAppDataKeyDirty('sms_registered_students', value);
    try {
      await syncToCloud();
    } catch (error) {
      publishAppDataSyncStatus('sms_registered_students', 'error');
      throw error;
    }
  }
}
