// Cloud database using Supabase REST API (no library import needed)
// Falls back to localStorage if Supabase is not configured

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
    throw new Error(text);
  }

  if (method === 'GET') {
    return res.json();
  }
  return null;
}

// ==================== USERS ====================

export async function getUsers(): Promise<any[]> {
  if (IS_CLOUD) {
    try {
      return await supabaseRequest('users', 'GET', undefined, '?order=created_at.desc');
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
      await supabaseRequest('users', 'POST', user);
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
      await supabaseRequest('duty_reports', 'POST', report);
      return;
    } catch (e) {
      console.error('Cloud addDutyReport failed:', e);
    }
  }
  const duties = JSON.parse(localStorage.getItem('sms_duties') || '[]');
  duties.push(report);
  localStorage.setItem('sms_duties', JSON.stringify(duties));
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
      // Try update first
      await supabaseRequest('release_state', 'PATCH', 
        { approved: true, approved_by: adminName, approved_at: new Date().toISOString() },
        `?term=eq.${encodeURIComponent(term)}`
      );
      return;
    } catch {
      try {
        // If update fails, insert
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
