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
const getCache = new Map<string, { expiresAt: number; data: any }>();
const getInFlight = new Map<string, Promise<any>>();

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

export async function refreshAppDataKey(key: string): Promise<void> {
  if (!IS_CLOUD) return;
  try {
    const data = await supabaseRequest('app_data', 'GET', undefined, `?key=eq.${encodeURIComponent(key)}&select=key,value,updated_at`);
    const item = Array.isArray(data) ? data[0] : null;
    if (item?.value) {
      localStorage.setItem(key, item.value);
      localStorage.setItem(`${key}_ts`, String(Date.parse(item.updated_at || '') || Date.now()));
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

async function supabaseRequest(table: string, method: string, body?: any, query?: string, upsert = false) {
  const url = `${SUPABASE_URL}/rest/v1/${table}${query || ''}`;
  const cacheKey = `${method}:${url}`;
  if (method === 'GET') {
    const cached = getCache.get(cacheKey);
    if (cached && cached.expiresAt > Date.now()) return cached.data;
    const pending = getInFlight.get(cacheKey);
    if (pending) return pending;
  }
  const headers: any = {
    'apikey': SUPABASE_KEY,
    'Authorization': `Bearer ${SUPABASE_KEY}`,
    'Content-Type': 'application/json',
    'Prefer': method === 'POST'
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
      throw new Error(text);
    }

    if (method === 'GET') return res.json();
    return null;
  })();
  if (method === 'GET') {
    getInFlight.set(cacheKey, request);
    request.then(data => getCache.set(cacheKey, { expiresAt: Date.now() + GET_CACHE_TTL_MS, data }), () => undefined)
      .finally(() => getInFlight.delete(cacheKey));
  } else {
    request.then(() => {
      for (const key of getCache.keys()) {
        if (key.startsWith(`GET:${SUPABASE_URL}/rest/v1/${table}`)) getCache.delete(key);
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
      try {
        data = await supabaseRequest('scores', 'GET', undefined, '?select=id,teacher_name,teacher_id,student_name,class_name,subject,term,score,max_score,exam_name,exam_id,created_at&order=created_at.desc&limit=5000');
      } catch (error: any) {
        if (!String(error?.message || error).includes('teacher_id')) throw error;
        data = await supabaseRequest('scores', 'GET', undefined, '?select=id,teacher_name,student_name,class_name,subject,term,score,max_score,exam_name,exam_id,created_at&order=created_at.desc&limit=5000');
      }
      if (Array.isArray(data)) {
        if (data.length > 0) return data;
        // Keep locally queued scores when the cloud has no rows yet.
        const saved = localStorage.getItem('sms_scores');
        if (saved) {
          try {
            const local = JSON.parse(saved);
            if (Array.isArray(local) && local.length > 0) {
              console.warn('Cloud scores empty, showing local cache (' + local.length + ' scores) — check Supabase POST error in console');
              return local;
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

export async function addScore(score: any) {
  // always keep optimistic local copy
  const localScores: any[] = JSON.parse(localStorage.getItem('sms_scores') || '[]');
  const existingIndex = localScores.findIndex((s: any) => s.id === score.id);
  if (existingIndex >= 0) localScores[existingIndex] = { ...localScores[existingIndex], ...score };
  else localScores.push(score);
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
        created_at: new Date().toISOString(),
      };
      // drop null/undefined optional fields if needed
      if (!payload.exam_name) delete payload.exam_name;
      if (!payload.exam_id) delete payload.exam_id;
      if (!payload.teacher_id) delete payload.teacher_id;
      try {
        await supabaseRequest('scores', 'POST', payload, undefined, true);
        return;
      } catch (err: any) {
        const msg = String(err?.message || err);
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
  'sms_students', 'sms_exams',
  'sms_behavior', 'sms_messages', 'sms_registered_students',
  'sms_school_name_setting', 'sms_district_name', 'sms_school_address',
  'sms_school_motto', 'sms_academic_name', 'sms_headmaster_name',
  'sms_school_logo', 'sms_academic_sig', 'sms_headmaster_sig',
  'tt_timetableData', 'tt_teachers', 'tt_subjects', 'tt_rooms',
  'tt_classes', 'tt_classSubjects', 'tt_timeSlots', 'tt_days',
  'tt_shared_subjects', 'tt_shared_teachers', 'tt_shared_classes'
];

const ROLE_SYNC_KEYS = ['sms_class_teachers', 'sms_teaching_assignments'];

export async function getRoleAssignmentsFromCloud(): Promise<{
  classTeachers: Record<string, string>;
  teachingAssignments: Record<string, { cls: string; sub: string }[]>;
} | null> {
  if (!IS_CLOUD) return null;
  try {
    const data = await supabaseRequest('app_data', 'GET', undefined, '?key=in.(sms_class_teachers,sms_teaching_assignments)&select=key,value');
    const result = {
      classTeachers: {} as Record<string, string>,
      teachingAssignments: {} as Record<string, { cls: string; sub: string }[]>
    };
    for (const item of Array.isArray(data) ? data : []) {
      const parsed = JSON.parse(item.value || '{}');
      if (item.key === 'sms_class_teachers' && parsed && typeof parsed === 'object') result.classTeachers = parsed;
      if (item.key === 'sms_teaching_assignments' && parsed && typeof parsed === 'object') result.teachingAssignments = parsed;
    }
    localStorage.setItem('sms_class_teachers', JSON.stringify(result.classTeachers));
    localStorage.setItem('sms_teaching_assignments', JSON.stringify(result.teachingAssignments));
    return result;
  } catch (e) {
    console.error('Cloud role assignments fetch failed:', e);
    return null;
  }
}

export async function syncRoleAssignmentsToCloud(classTeachers: unknown, teachingAssignments: unknown) {
  if (!IS_CLOUD) return;
  try {
    const currentUser = JSON.parse(localStorage.getItem('sms_current_user') || 'null');
    if (currentUser?.role !== 'admin') return;
  } catch { return; }

  const values: Record<string, unknown> = {
    sms_class_teachers: classTeachers,
    sms_teaching_assignments: teachingAssignments
  };
  await Promise.all(ROLE_SYNC_KEYS.map(async key => {
    const value = JSON.stringify(values[key]);
    const updatedAt = new Date().toISOString();
    try {
      await supabaseRequest('app_data', 'POST', { key, value, updated_at: updatedAt }, undefined, true);
    } catch {
      await supabaseRequest('app_data', 'PATCH', { value, updated_at: updatedAt }, `?key=eq.${encodeURIComponent(key)}`);
    }
  }));
}

let syncToCloudPromise: Promise<void> | null = null;
const lastSyncedAppDataValues = new Map<string, string>();

export function syncToCloud(): Promise<void> {
  if (!IS_CLOUD) return Promise.resolve();
  if (syncToCloudPromise) return syncToCloudPromise;
  syncToCloudPromise = (async () => {
    for (const key of SYNC_KEYS) {
      const value = localStorage.getItem(key);
      if (value && lastSyncedAppDataValues.get(key) !== value) {
        try {
          await supabaseRequest('app_data', 'POST', { key, value, updated_at: new Date().toISOString() }, undefined, true);
          lastSyncedAppDataValues.set(key, value);
        } catch {
          try {
            await supabaseRequest('app_data', 'PATCH', { value, updated_at: new Date().toISOString() }, `?key=eq.${encodeURIComponent(key)}`);
            lastSyncedAppDataValues.set(key, value);
          } catch (e) { console.error('Sync to cloud failed for', key, e); }
        }
      }
    }
  })().finally(() => { syncToCloudPromise = null; });
  return syncToCloudPromise;
}

// ✅ FIXED — handles classes deletion + addition without reverting
export async function syncFromCloud() {
  if (!IS_CLOUD) return;
  try {
    let isAdmin = false;
    try {
      const currentUser = JSON.parse(localStorage.getItem('sms_current_user') || 'null');
      isAdmin = currentUser?.role === 'admin';
    } catch {}
    const data = await supabaseRequest('app_data', 'GET', undefined, '?select=key,value,updated_at&limit=100');
    if (Array.isArray(data)) {
      data.forEach((item: any) => {
        if (item.key && item.value) {
          const localValue = localStorage.getItem(item.key);
          if (item.key === 'sms_school_classes' || item.key === 'tt_shared_classes') {
            try {
              const savedClasses = JSON.parse(localStorage.getItem('sms_school_classes') || 'null');
              const incomingClasses = JSON.parse(item.value);
              const localTimestamp = parseInt(localStorage.getItem('sms_school_classes_ts') || '0', 10);
              const cloudTimestamp = Date.parse(item.updated_at || '') || 0;
              if (Array.isArray(savedClasses) && Array.isArray(incomingClasses)) {
                const localIsCustom = JSON.stringify(savedClasses) !== JSON.stringify(LEGACY_DEFAULT_CLASSES);
                const incomingIsLegacyDefault = JSON.stringify(incomingClasses) === JSON.stringify(LEGACY_DEFAULT_CLASSES);
                if ((localIsCustom && incomingIsLegacyDefault) || (localTimestamp > 0 && localTimestamp >= cloudTimestamp)) return;
              }
            } catch {}
          }
          const isCloudEmpty = item.value === '[]' || item.value === '{}' || item.value === '' || item.value === '""';
          const isLocalNonEmpty = !!localValue && localValue !== '[]' && localValue !== '{}' && localValue !== '' && localValue !== '""';
          // FIX exams bug: if cloud is empty but local has data (admin just created, cloud not yet synced), don't delete local
          const isSharedRoleKey = item.key === 'sms_class_teachers' || item.key === 'sms_teaching_assignments';
          if (isCloudEmpty && isLocalNonEmpty && !isSharedRoleKey) {
            return;
          }
          // Keep a local edit only while it is newer than the cloud copy.
          try {
            const ts = localStorage.getItem(item.key + '_ts');
            const localTimestamp = ts ? parseInt(ts, 10) : 0;
            const cloudTimestamp = Date.parse(item.updated_at || '') || 0;
            const isSharedRoleKey = item.key === 'sms_class_teachers' || item.key === 'sms_teaching_assignments';
            if (localTimestamp > 0 && localTimestamp >= cloudTimestamp && (!isSharedRoleKey || isAdmin)) {
              return;
            }
          } catch {}
          localStorage.setItem(item.key, item.value);
        }
      });
      window.dispatchEvent(new Event('cloud-sync-complete'));
    }
  } catch (e) { console.error('Sync from cloud failed:', e); }
}

// ==================== REGISTERED STUDENTS (per class) ====================
// Reads/writes DIRECTLY to Supabase so all devices see the same numbers instantly.

export async function getRegisteredStudents(): Promise<Record<string, { regB: number; regG: number }>> {
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
    const payload = { key: 'sms_registered_students', value, updated_at: new Date().toISOString() };
    try {
      await supabaseRequest('app_data', 'POST', payload, undefined, true);
    } catch (e) {
      try {
        await supabaseRequest('app_data', 'PATCH', { value, updated_at: payload.updated_at }, '?key=eq.sms_registered_students');
      } catch (e2) {
        console.error('Cloud saveRegisteredStudents failed:', e2);
      }
    }
  }
}
