import { useState, useEffect, useCallback } from 'react';
import { TimetableSubsystem } from './components/TimetableSubsystem';
import * as cloud from './lib/cloud';

export default function App() {
  const [screen, setScreen] = useState('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const [users, setUsers] = useState<any[]>([]);
  const [scores, setScores] = useState<any[]>([]);
  const [duties, setDuties] = useState<any[]>([]);
  const [released, setReleased] = useState<string[]>([]);

  const [newTeacher, setNewTeacher] = useState({ name: '', username: '', password: '', subjects: '' });
  const [newScore, setNewScore] = useState({ student: '', subject: '', className: 'Grade 9A', score: '', maxScore: '100', term: 'Term 1' });
  const [newDuty, setNewDuty] = useState({ date: '', present: '', absent: '', events: '', dayEnd: '' });

  const loadData = useCallback(async () => {
    const [u, s, d, r] = await Promise.all([
      cloud.getUsers(),
      cloud.getScores(),
      cloud.getDutyReports(),
      cloud.getReleased()
    ]);
    setUsers(u);
    setScores(s);
    setDuties(d);
    setReleased(r);
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const login = async () => {
    setLoading(true);
    setError('');
    const allUsers = await cloud.getUsers();
    const found = allUsers.find((u: any) => u.username === username && u.password === password);
    if (found) {
      setUser(found);
      setScreen(found.role === 'admin' ? 'admin' : 'teacher');
      await loadData();
    } else {
      setError('Wrong credentials. Admin: admin / admin123');
    }
    setLoading(false);
  };

  const logout = () => { setUser(null); setScreen('login'); setUsername(''); setPassword(''); };

  const createTeacher = async () => {
    if (!newTeacher.name || !newTeacher.username || !newTeacher.password) return;
    const allUsers = await cloud.getUsers();
    if (allUsers.some((u: any) => u.username === newTeacher.username)) { alert('Username taken!'); return; }
    setLoading(true);
    await cloud.createUser({
      id: 't-' + Date.now(),
      name: newTeacher.name,
      username: newTeacher.username,
      password: newTeacher.password,
      role: 'teacher',
      subjects: newTeacher.subjects.split(',').map((s: string) => s.trim()).filter(Boolean)
    });
    setNewTeacher({ name: '', username: '', password: '', subjects: '' });
    await loadData();
    setLoading(false);
    alert('Teacher created!');
  };

  const deleteTeacher = async (id: string) => {
    setLoading(true);
    await cloud.deleteUser(id);
    await loadData();
    setLoading(false);
  };

  const saveScore = async () => {
    if (!user || !newScore.student || !newScore.subject || !newScore.score) return;
    setLoading(true);
    await cloud.addScore({
      id: 'sc-' + Date.now(),
      teacher_name: user.name,
      student_name: newScore.student,
      subject: newScore.subject,
      class_name: newScore.className,
      score: Number(newScore.score),
      max_score: Number(newScore.maxScore),
      term: newScore.term
    });
    setNewScore({ ...newScore, student: '', score: '' });
    await loadData();
    setLoading(false);
    alert('Score saved!');
  };

  const saveDuty = async () => {
    if (!user || !newDuty.date || !newDuty.events || !newDuty.dayEnd) return;
    setLoading(true);
    await cloud.addDutyReport({
      id: 'dr-' + Date.now(),
      teacher_name: user.name,
      date: newDuty.date,
      present_count: Number(newDuty.present),
      absent_count: Number(newDuty.absent),
      events_summary: newDuty.events,
      day_end_summary: newDuty.dayEnd
    });
    setNewDuty({ date: '', present: '', absent: '', events: '', dayEnd: '' });
    await loadData();
    setLoading(false);
    alert('Duty report submitted!');
  };

  const releaseResults = async (term: string) => {
    setLoading(true);
    await cloud.releaseTerm(term, user?.name || 'Admin');
    await loadData();
    setLoading(false);
  };

  const teachers = users.filter((u: any) => u.role === 'teacher');
  const classes = ['Grade 9A', 'Grade 9B', 'Grade 10A', 'Grade 10B', 'Grade 11A', 'Grade 11B'];
  const terms = ['Term 1', 'Term 2', 'Term 3'];
  const mode = cloud.isCloudMode() ? '🟢 Cloud Database' : '🟡 Local Storage';

  if (screen === 'login') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-slate-100 flex items-center justify-center px-4">
        <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md border">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-3"><span className="text-3xl">🏫</span></div>
            <h1 className="text-2xl font-bold">School Management System</h1>
            <p className="text-sm text-slate-500 mt-1">Nambawala Secondary School</p>
            <p className="text-xs mt-2 px-3 py-1 rounded-lg inline-block bg-slate-50 border text-slate-600">{mode}</p>
          </div>
          <div className="space-y-4">
            <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} className="w-full border px-4 py-3 rounded-xl" />
            <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="w-full border px-4 py-3 rounded-xl" />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button onClick={login} disabled={loading} className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold disabled:opacity-50">
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
            <p className="text-center text-xs text-gray-400">Admin: admin / admin123</p>
          </div>
        </div>
      </div>
    );
  }

  if (screen === 'timetable') {
    return (<div className="relative"><button onClick={() => setScreen('admin')} className="fixed top-4 right-4 z-50 px-5 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-semibold shadow-lg">← Back</button><TimetableSubsystem /></div>);
  }

  if (screen === 'admin') {
    return (
      <div className="min-h-screen bg-slate-100">
        <div className="bg-white border-b px-6 py-4 flex justify-between items-center">
          <div><h1 className="font-bold text-xl">Nambawala Secondary School</h1><p className="text-xs text-slate-500">Admin — {mode}</p></div>
          <div className="flex items-center gap-3"><span className="text-sm">Welcome, {user?.name}</span><button onClick={logout} className="px-4 py-2 bg-red-500 text-white rounded-xl text-sm font-semibold">Logout</button></div>
        </div>
        <div className="p-6 max-w-6xl mx-auto space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border"><p className="text-xs uppercase text-slate-500">Teachers</p><p className="text-3xl font-bold">{teachers.length}</p></div>
            <div className="bg-white p-5 rounded-2xl border"><p className="text-xs uppercase text-slate-500">Scores</p><p className="text-3xl font-bold">{scores.length}</p></div>
            <div className="bg-white p-5 rounded-2xl border"><p className="text-xs uppercase text-slate-500">Duty Reports</p><p className="text-3xl font-bold">{duties.length}</p></div>
            <div onClick={() => setScreen('timetable')} className="bg-indigo-600 text-white p-5 rounded-2xl cursor-pointer hover:bg-indigo-700 flex flex-col justify-center items-center shadow-lg"><span className="text-2xl mb-1">📅</span><span className="font-bold">Open Timetable</span></div>
          </div>
          <div className="bg-white p-6 rounded-2xl border">
            <h2 className="font-bold text-lg mb-4">Create Teacher Account</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <input placeholder="Full Name" value={newTeacher.name} onChange={e => setNewTeacher({...newTeacher, name: e.target.value})} className="border px-3 py-2.5 rounded-xl" />
              <input placeholder="Username" value={newTeacher.username} onChange={e => setNewTeacher({...newTeacher, username: e.target.value})} className="border px-3 py-2.5 rounded-xl" />
              <input type="password" placeholder="Password" value={newTeacher.password} onChange={e => setNewTeacher({...newTeacher, password: e.target.value})} className="border px-3 py-2.5 rounded-xl" />
              <input placeholder="Subjects (comma separated)" value={newTeacher.subjects} onChange={e => setNewTeacher({...newTeacher, subjects: e.target.value})} className="border px-3 py-2.5 rounded-xl" />
            </div>
            <button onClick={createTeacher} disabled={loading} className="mt-4 bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-semibold disabled:opacity-50">{loading ? 'Creating...' : 'Create Teacher'}</button>
          </div>
          <div className="bg-white p-6 rounded-2xl border">
            <h2 className="font-bold text-lg mb-3">Teachers ({teachers.length})</h2>
            {teachers.length === 0 ? <p className="text-sm text-slate-500">No teachers yet.</p> : teachers.map((t: any) => (<div key={t.id} className="flex justify-between items-center border-b py-3"><div><p className="font-semibold">{t.name}</p><p className="text-xs text-slate-500">Username: {t.username} | Subjects: {(t.subjects||[]).join(', ')||'None'}</p></div><button onClick={() => deleteTeacher(t.id)} className="px-3 py-1 bg-red-50 text-red-600 rounded-lg text-xs font-semibold border border-red-200">Remove</button></div>))}
          </div>
          <div className="bg-white p-6 rounded-2xl border">
            <h2 className="font-bold text-lg mb-3">Result Approval</h2>
            <div className="flex gap-3 flex-wrap mb-4">{terms.map(term => (<div key={term} className="flex items-center gap-2"><span className="text-sm font-medium">{term}:</span>{released.includes(term) ? <span className="text-xs bg-emerald-100 text-emerald-700 px-3 py-1 rounded-lg font-semibold">✅ Released</span> : <button onClick={() => releaseResults(term)} disabled={loading} className="text-xs bg-emerald-600 text-white px-3 py-1.5 rounded-lg font-semibold disabled:opacity-50">Approve</button>}</div>))}</div>
            {scores.length === 0 ? <p className="text-sm text-slate-500">No scores yet.</p> : <div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="border-b text-slate-500 text-left"><th className="py-2">Student</th><th>Class</th><th>Subject</th><th>Score</th><th>Term</th><th>Teacher</th></tr></thead><tbody>{scores.map((s: any) => (<tr key={s.id} className="border-b border-slate-100"><td className="py-2">{s.student_name}</td><td>{s.class_name}</td><td>{s.subject}</td><td>{s.score}/{s.max_score}</td><td>{s.term}</td><td>{s.teacher_name}</td></tr>))}</tbody></table></div>}
          </div>
          <div className="bg-white p-6 rounded-2xl border">
            <h2 className="font-bold text-lg mb-3">Duty Reports ({duties.length})</h2>
            {duties.length === 0 ? <p className="text-sm text-slate-500">No reports yet.</p> : duties.map((d: any) => (<div key={d.id} className="border-b py-3"><p className="font-semibold">{d.date} — {d.teacher_name}</p><p className="text-sm">Present: {d.present_count} | Absent: {d.absent_count}</p><p className="text-sm mt-1"><strong>Events:</strong> {d.events_summary}</p><p className="text-sm"><strong>Day end:</strong> {d.day_end_summary}</p></div>))}
          </div>
        </div>
      </div>
    );
  }

  if (screen === 'teacher') {
    return (
      <div className="min-h-screen bg-slate-100">
        <div className="bg-white border-b px-6 py-4 flex justify-between items-center">
          <div><h1 className="font-bold text-xl">Teacher Panel</h1><p className="text-xs text-slate-500">Welcome, {user?.name} — {mode}</p></div>
          <button onClick={logout} className="px-4 py-2 bg-red-500 text-white rounded-xl text-sm font-semibold">Logout</button>
        </div>
        <div className="p-6 max-w-4xl mx-auto space-y-6">
          <div className="bg-white p-6 rounded-2xl border">
            <h2 className="font-bold text-lg mb-4">Enter Student Score</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <select value={newScore.className} onChange={e => setNewScore({...newScore, className: e.target.value})} className="border px-3 py-2.5 rounded-xl">{classes.map(c => <option key={c}>{c}</option>)}</select>
              <select value={newScore.subject} onChange={e => setNewScore({...newScore, subject: e.target.value})} className="border px-3 py-2.5 rounded-xl"><option value="">-- Select Subject --</option>{(user?.subjects||[]).map((s: string) => <option key={s}>{s}</option>)}</select>
              <select value={newScore.term} onChange={e => setNewScore({...newScore, term: e.target.value})} className="border px-3 py-2.5 rounded-xl">{terms.map(t => <option key={t}>{t}</option>)}</select>
              <input placeholder="Student Name" value={newScore.student} onChange={e => setNewScore({...newScore, student: e.target.value})} className="border px-3 py-2.5 rounded-xl" />
              <input type="number" placeholder="Score" value={newScore.score} onChange={e => setNewScore({...newScore, score: e.target.value})} className="border px-3 py-2.5 rounded-xl" />
              <input type="number" placeholder="Max Score" value={newScore.maxScore} onChange={e => setNewScore({...newScore, maxScore: e.target.value})} className="border px-3 py-2.5 rounded-xl" />
            </div>
            <button onClick={saveScore} disabled={loading} className="mt-4 bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-semibold disabled:opacity-50">{loading ? 'Saving...' : 'Save Score'}</button>
            <div className="mt-6 border-t pt-4">
              <h3 className="font-bold mb-2">My Scores</h3>
              {scores.filter((s: any) => s.teacher_name === user?.name).length === 0 ? <p className="text-sm text-slate-500">No scores yet.</p> : <div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="border-b text-slate-500 text-left"><th className="py-2">Student</th><th>Class</th><th>Subject</th><th>Score</th><th>Term</th></tr></thead><tbody>{scores.filter((s: any) => s.teacher_name === user?.name).map((s: any) => (<tr key={s.id} className="border-b border-slate-100"><td className="py-2">{s.student_name}</td><td>{s.class_name}</td><td>{s.subject}</td><td>{s.score}/{s.max_score}</td><td>{s.term}</td></tr>))}</tbody></table></div>}
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border">
            <h2 className="font-bold text-lg mb-4">Teacher Duty Report</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input type="date" value={newDuty.date} onChange={e => setNewDuty({...newDuty, date: e.target.value})} className="border px-3 py-2.5 rounded-xl" />
              <input type="number" placeholder="Students Present" value={newDuty.present} onChange={e => setNewDuty({...newDuty, present: e.target.value})} className="border px-3 py-2.5 rounded-xl" />
              <input type="number" placeholder="Students Absent" value={newDuty.absent} onChange={e => setNewDuty({...newDuty, absent: e.target.value})} className="border px-3 py-2.5 rounded-xl" />
            </div>
            <textarea placeholder="Events during the day" value={newDuty.events} onChange={e => setNewDuty({...newDuty, events: e.target.value})} className="border px-3 py-2.5 rounded-xl w-full mt-3" rows={3} />
            <textarea placeholder="How the day ended" value={newDuty.dayEnd} onChange={e => setNewDuty({...newDuty, dayEnd: e.target.value})} className="border px-3 py-2.5 rounded-xl w-full mt-3" rows={3} />
            <button onClick={saveDuty} disabled={loading} className="mt-4 bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-semibold disabled:opacity-50">{loading ? 'Submitting...' : 'Submit Report'}</button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
