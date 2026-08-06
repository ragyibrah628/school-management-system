// @ts-nocheck
// Cloud database using Supabase REST API (no library import needed)
// Falls back to localStorage if Supabase is not configured
// ✅ FIXED VERSION — paste this over src/lib/cloud.ts

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const IS_CLOUD = !!(SUPABASE_URL && SUPABASE_KEY && SUPABASE_URL.startsWith('https://'));

export function isCloudMode() {
  return IS_CLOUD;
}

async function supabaseRequest(table: string, method: string, body?: any, query?: string) {
  const url = `${SUPABASE_URL}/rest/v1/${table}${query || ''}`;
  const headers: any = {
    'apikey': SUPABASE_KEY,
    'Authorization': `Bearer ${SUPABASE_KEY}`,
    'Content-Type': 'application/json',
    'Prefer': method === 'POST' ? 'return=representation' : 'return=minimal'
  };

  const res = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined
  });

  if (!res.ok) {
    const text = await res.text();
    console.error(`Supabase ${method} ${table} failed:`, text);
    throw new Error(text);
  }

  if (method === 'GET') {
    return res.json();
  }
  return null;
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
      const data = await supabaseRequest('users', 'GET', undefined, '?order=created_at.desc');
      return data.map((u: any) => ({
        ...u,
        subjects: Array.isArray(u.subjects) ? u.subjects : []
      }));
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

export async function getScores(): Promise<any[]> {
  if (IS_CLOUD) {
    try {
      return await supabaseRequest('scores', 'GET', undefined, '?order=created_at.desc');
    } catch (e) {
      console.error('Cloud getScores failed:', e);
    }
  }
  const saved = localStorage.getItem('sms_scores');
  return saved ? JSON.parse(saved) : [];
}

export async function addScore(score: any) {
  if (IS_CLOUD) {
    try {
      await supabaseRequest('scores', 'POST', score);
      return;
    } catch (e) {
      console.error('Cloud addScore failed:', e);
    }
  }
  const scores = JSON.parse(localStorage.getItem('sms_scores') || '[]');
  scores.push(score);
  localStorage.setItem('sms_scores', JSON.stringify(scores));
}

// ==================== DUTY REPORTS ====================

export async function getDutyReports(): Promise<any[]> {
  if (IS_CLOUD) {
    try {
      return await supabaseRequest('duty_reports', 'GET', undefined, '?order=created_at.desc');
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
      const data = await supabaseRequest('duty_reports', 'GET', undefined, '?order=created_at.desc');
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
      const data = await supabaseRequest('release_state', 'GET', undefined, '?approved=eq.true');
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
  'sms_school_subjects', 'sms_school_classes', 'sms_class_teachers',
  'sms_students', 'sms_teaching_assignments', 'sms_exams',
  'sms_behavior', 'sms_messages', 'sms_registered_students',
  'sms_school_name_setting', 'sms_district_name', 'sms_school_address',
  'sms_school_motto', 'sms_academic_name', 'sms_headmaster_name',
  'sms_school_logo', 'sms_academic_sig', 'sms_headmaster_sig',
  'tt_timetableData', 'tt_teachers', 'tt_subjects', 'tt_rooms',
  'tt_classes', 'tt_classSubjects', 'tt_timeSlots', 'tt_days',
  'tt_shared_subjects', 'tt_shared_teachers', 'tt_shared_classes'
];

export async function syncToCloud() {
  if (!IS_CLOUD) return;
  for (const key of SYNC_KEYS) {
    const value = localStorage.getItem(key);
    if (value) {
      try {
        await supabaseRequest('app_data', 'POST', { key, value, updated_at: new Date().toISOString() });
      } catch {
        try {
          await supabaseRequest('app_data', 'PATCH', { value, updated_at: new Date().toISOString() }, `?key=eq.${encodeURIComponent(key)}`);
        } catch (e) { console.error('Sync to cloud failed for', key, e); }
      }
    }
  }
}

// ✅ FIXED — was blocking teacher updates when local already had old data
export async function syncFromCloud() {
  if (!IS_CLOUD) return;
  try {
    const data = await supabaseRequest('app_data', 'GET', undefined, '?select=key,value');
    if (Array.isArray(data)) {
      data.forEach((item: any) => {
        if (item.key && item.value) {
          // ✅ ALWAYS overwrite — cloud is source of truth for multi-device sync
          // Previous bug: only overwrote if local was empty ([]/{}), so teacher's stale cache blocked admin changes forever
          localStorage.setItem(item.key, item.value);
        }
      });
      // Notify UI to refresh
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
        if (Array.isArray(parsed) && parsed.length > 0) {
          localStorage.setItem('sms_school_classes', data[0].value);
          localStorage.setItem('tt_shared_classes', data[0].value);
          return parsed;
        }
      }
    } catch (e) { console.error('getSchoolClassesFromCloud failed', e); }
  }
  try {
    const saved = JSON.parse(localStorage.getItem('sms_school_classes') || '[]');
    if (saved.length > 0) return saved;
  } catch {}
  return ['Form IA', 'Form IB', 'Form IC', 'Form IIA', 'Form IIB', 'Form IIC', 'Form IIIA', 'Form IIIB', 'Form IIIC', 'Form IVA', 'Form IVB', 'Form IVC'];
}

export async function saveRegisteredStudents(
  data: Record<string, { regB: number; regG: number }>
) {
  const value = JSON.stringify(data);
  localStorage.setItem('sms_registered_students', value);

  if (IS_CLOUD) {
    const payload = { value, updated_at: new Date().toISOString() };
    try {
      await supabaseRequest(
        'app_data', 'PATCH', payload,
        `?key=eq.sms_registered_students`
      );
      const check = await supabaseRequest(
        'app_data', 'GET', undefined,
        `?key=eq.sms_registered_students&select=key`
      );
      if (!Array.isArray(check) || check.length === 0) {
        await supabaseRequest('app_data', 'POST', {
          key: 'sms_registered_students', value, updated_at: new Date().toISOString()
        });
      }
    } catch (e) {
      try {
        await supabaseRequest('app_data', 'POST', {
          key: 'sms_registered_students', value, updated_at: new Date().toISOString()
        });
      } catch (e2) {
        console.error('Cloud saveRegisteredStudents failed:', e2);
      }
    }
  }
}
