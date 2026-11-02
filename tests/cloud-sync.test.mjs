import assert from 'node:assert/strict';
import { after, test } from 'node:test';
import { createServer } from 'vite';

process.env.VITE_SUPABASE_URL = 'https://mock.supabase.co';
process.env.VITE_SUPABASE_ANON_KEY = 'mock-anon-key';

const vite = await createServer({
  configFile: './vite.config.ts',
  server: { middlewareMode: true },
  appType: 'custom'
});
after(() => vite.close());

class MockStorage {
  values = new Map();
  getItem(key) { return this.values.get(key) ?? null; }
  setItem(key, value) { this.values.set(key, String(value)); }
  removeItem(key) { this.values.delete(key); }
  clear() { this.values.clear(); }
}

globalThis.localStorage = new MockStorage();
globalThis.window = new EventTarget();

const cloud = await vite.ssrLoadModule('/src/lib/cloud.ts');
const ROLE_KEYS = ['sms_class_teachers', 'sms_teaching_assignments'];
let rows;
let requests;
let failNextWriteKey;
let emptyPostResponseKey;

function response(data, status = 200) {
  return new Response(data === null ? null : JSON.stringify(data), {
    status,
    headers: data === null ? undefined : { 'Content-Type': 'application/json' }
  });
}

function setMockCloud(initialRows = []) {
  rows = new Map(initialRows.map(row => [row.key, { ...row }]));
  requests = [];
  failNextWriteKey = null;
  emptyPostResponseKey = null;
  globalThis.fetch = async (input, init = {}) => {
    const url = new URL(String(input));
    const method = init.method || 'GET';
    const body = init.body ? JSON.parse(init.body) : null;
    const keyFilter = url.searchParams.get('key') || '';
    const query = {
      keys: keyFilter.startsWith('eq.')
        ? [decodeURIComponent(keyFilter.slice(3))]
        : keyFilter.startsWith('in.(')
          ? keyFilter.slice(4, -1).split(',').map(decodeURIComponent)
          : [],
      updatedAt: url.searchParams.get('updated_at') || '',
      select: url.searchParams.get('select') || ''
    };
    const request = { method, keys: query.keys, body, prefer: new Headers(init.headers).get('Prefer'), select: query.select };
    requests.push(request);

    if (method === 'GET') {
      const selected = query.keys.map(key => rows.get(key)).filter(Boolean);
      return response(selected.map(row => query.select === 'key,updated_at'
        ? { key: row.key, updated_at: row.updated_at }
        : { ...row }));
    }

    const targetKey = body?.key || query.keys[0];
    if (failNextWriteKey === targetKey) {
      failNextWriteKey = null;
      return response('mock server failure', 500);
    }

    if (method === 'POST') {
      if (emptyPostResponseKey === body.key) return response([]);
      rows.set(body.key, { ...body });
      return request.prefer?.includes('return=representation')
        ? response([{ ...body }])
        : response(null);
    }

    if (method === 'PATCH') {
      const existing = rows.get(targetKey);
      if (!existing || (query.updatedAt && existing.updated_at !== decodeURIComponent(query.updatedAt.slice(3)))) {
        return response([]);
      }
      const updated = { ...existing, ...body };
      rows.set(targetKey, updated);
      return request.prefer?.includes('return=representation')
        ? response([{ key: updated.key, value: updated.value, updated_at: updated.updated_at }])
        : response(null);
    }

    throw new Error(`Unexpected mock request ${method} ${url.pathname}`);
  };
}

function setSession(role = 'admin') {
  localStorage.clear();
  localStorage.setItem('sms_current_user', JSON.stringify({ id: `${role}-1`, role }));
}

function valueFor(key) {
  return JSON.parse(rows.get(key)?.value || '{}');
}

test('role assignment edits upload both changed keys and preserve cloud-only teachers', async () => {
  setSession();
  const timestamp = '2026-10-30T07:57:19.000Z';
  setMockCloud([
    { key: 'sms_teaching_assignments', value: JSON.stringify({
      't-X': [{ cls: 'Form 3', sub: 'Mathematics' }],
      't-other': [{ cls: 'Form 4', sub: 'Biology' }]
    }), updated_at: timestamp },
    { key: 'sms_class_teachers', value: JSON.stringify({ 'Form 3': 't-old', 'Form 4': 't-other' }), updated_at: timestamp }
  ]);
  const assignments = {
    't-X': [
      { cls: 'Form 3', sub: 'Chemistry' },
      { cls: 'Form 3', sub: 'Physics' }
    ]
  };
  const classTeachers = { 'Form 3': 't-X' };

  await cloud.syncRoleAssignmentsToCloud(classTeachers, assignments, ROLE_KEYS);

  assert.deepEqual(valueFor('sms_teaching_assignments'), {
    't-X': assignments['t-X'],
    't-other': [{ cls: 'Form 4', sub: 'Biology' }]
  });
  assert.deepEqual(valueFor('sms_class_teachers'), { 'Form 3': 't-X', 'Form 4': 't-other' });
  for (const key of ROLE_KEYS) {
    assert.ok(requests.some(request => request.method === 'PATCH' && request.keys[0] === key));
    assert.ok(requests.some(request => request.method === 'PATCH' && request.keys[0] === key && request.prefer === 'return=representation'));
    assert.equal(localStorage.getItem(`${key}_cloud_pending`), null);
  }
});

test('failed role write stays dirty, reports an error, and succeeds on retry', async () => {
  setSession();
  const timestamp = '2026-10-30T07:57:19.000Z';
  setMockCloud([{
    key: 'sms_teaching_assignments',
    value: JSON.stringify({ 't-X': [{ cls: 'Form 3', sub: 'Mathematics' }] }),
    updated_at: timestamp
  }]);
  const statuses = [];
  const onStatus = event => statuses.push(event.detail);
  window.addEventListener('app-data-sync-status', onStatus);
  failNextWriteKey = 'sms_teaching_assignments';
  const assignments = { 't-X': [{ cls: 'Form 3', sub: 'Chemistry' }] };

  await assert.rejects(
    cloud.syncRoleAssignmentsToCloud({}, assignments, ['sms_teaching_assignments']),
    /mock server failure/
  );
  assert.ok(localStorage.getItem('sms_teaching_assignments_cloud_pending'));
  assert.ok(statuses.some(status => status.key === 'sms_teaching_assignments' && status.status === 'error'));

  await cloud.syncToCloud();
  assert.equal(valueFor('sms_teaching_assignments')['t-X'][0].sub, 'Chemistry');
  assert.equal(localStorage.getItem('sms_teaching_assignments_cloud_pending'), null);
  assert.ok(statuses.some(status => status.key === 'sms_teaching_assignments' && status.status === 'saved'));
  window.removeEventListener('app-data-sync-status', onStatus);
});

test('admin recovery uploads an unmarked newer local assignment and preserves other teachers', async () => {
  setSession();
  const cloudTimestamp = '2026-10-30T07:57:19.000Z';
  const cloudAssignments = {
    't-X': [{ cls: 'Form 3', sub: 'Mathematics' }],
    't-other': [{ cls: 'Form 4', sub: 'Biology' }]
  };
  setMockCloud([{
    key: 'sms_teaching_assignments',
    value: JSON.stringify(cloudAssignments),
    updated_at: cloudTimestamp
  }]);
  const localAssignments = {
    't-X': [
      { cls: 'Form 3', sub: 'Chemistry' },
      { cls: 'Form 3', sub: 'Physics' }
    ]
  };
  localStorage.setItem('sms_teaching_assignments', JSON.stringify(localAssignments));
  localStorage.setItem('sms_teaching_assignments_ts', String(Date.parse('2026-11-02T09:00:00.000Z')));
  localStorage.setItem('sms_teaching_assignments_cloud_updated_at', cloudTimestamp);

  await cloud.syncFromCloud(true);

  assert.deepEqual(valueFor('sms_teaching_assignments'), {
    ...cloudAssignments,
    't-X': localAssignments['t-X']
  });
  assert.equal(localStorage.getItem('sms_teaching_assignments_cloud_pending'), null);
  assert.ok(requests.some(request => request.method === 'PATCH' && request.keys[0] === 'sms_teaching_assignments'));
});

test('a dirty local edit survives a cloud pull and is uploaded first', async () => {
  setSession();
  setMockCloud([{
    key: 'sms_class_teachers',
    value: JSON.stringify({ 'Form 3': 'teacher-old', 'Form 4': 'teacher-other' }),
    updated_at: '2026-11-02T09:00:00.000Z'
  }]);
  const localValue = JSON.stringify({ 'Form 3': 'teacher-new' });
  cloud.markAppDataKeyDirty('sms_class_teachers', localValue);

  await cloud.syncFromCloud(true);

  assert.deepEqual(valueFor('sms_class_teachers'), { 'Form 3': 'teacher-new', 'Form 4': 'teacher-other' });
  assert.deepEqual(JSON.parse(localStorage.getItem('sms_class_teachers')), { 'Form 3': 'teacher-new', 'Form 4': 'teacher-other' });
  assert.equal(localStorage.getItem('sms_class_teachers_cloud_pending'), null);
});

test('a successful HTTP response with zero written rows does not clear a pending save', async () => {
  setSession();
  setMockCloud();
  const students = JSON.stringify({ 'Form 3': [{ id: 'student-1', name: 'Student One' }] });
  cloud.markAppDataKeyDirty('sms_students', students);
  emptyPostResponseKey = 'sms_students';

  await assert.rejects(cloud.syncToCloud(), /did not confirm saving the student list/);
  assert.ok(localStorage.getItem('sms_students_cloud_pending'));
  assert.equal(rows.has('sms_students'), false);

  emptyPostResponseKey = null;
  await cloud.syncToCloud();
  assert.equal(localStorage.getItem('sms_students_cloud_pending'), null);
  assert.deepEqual(JSON.parse(rows.get('sms_students').value), JSON.parse(students));
});

test('teacher refresh applies newer cloud assignments without an upload and visibility stays metadata-only', async t => {
  setSession('teacher');
  const timestamp = '2026-11-02T09:00:00.000Z';
  const assignments = { 't-X': [{ cls: 'Form 3', sub: 'Chemistry' }, { cls: 'Form 3', sub: 'Physics' }] };
  setMockCloud([{
    key: 'sms_teaching_assignments',
    value: JSON.stringify(assignments),
    updated_at: timestamp
  }]);
  localStorage.setItem('sms_teaching_assignments', JSON.stringify({
    't-X': [{ cls: 'Form 3', sub: 'Mathematics' }]
  }));
  let appliedEvents = 0;
  const onSync = () => { appliedEvents += 1; };
  window.addEventListener('cloud-sync-complete', onSync);

  await cloud.syncFromCloud(true);

  assert.deepEqual(JSON.parse(localStorage.getItem('sms_teaching_assignments')), assignments);
  assert.equal(appliedEvents, 1);
  assert.equal(requests.some(request => request.method === 'POST' || request.method === 'PATCH'), false);

  setSession('admin');
  setMockCloud([{
    key: 'sms_teaching_assignments',
    value: JSON.stringify(assignments),
    updated_at: timestamp
  }]);
  localStorage.setItem('sms_teaching_assignments', JSON.stringify(assignments));
  localStorage.setItem('sms_teaching_assignments_cloud_updated_at', timestamp);
  localStorage.setItem('sms_teaching_assignments_cloud_confirmed_value', JSON.stringify(assignments));
  localStorage.setItem('sms_teaching_assignments_ts', String(Date.parse(timestamp)));

  for (let i = 0; i < 3; i++) await cloud.syncFromCloud(true);
  assert.equal(requests.filter(request => request.method === 'GET').length, 3);
  assert.equal(requests.some(request => request.method === 'POST' || request.method === 'PATCH'), false);
  assert.equal(requests.some(request => request.method === 'GET' && request.select !== 'key,updated_at'), false);
  t.diagnostic(`Three unchanged visibility syncs: ${JSON.stringify(requests.map(request => ({ method: request.method, table: 'app_data', keys: request.keys.length, select: request.select })))}`);
  window.removeEventListener('cloud-sync-complete', onSync);
});
