import { useState, useEffect } from 'react';
import { TimetableSubsystem } from './components/TimetableSubsystem';

// Simple localStorage helper
function load(key: string, fallback: any) {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
}

function save(key: string, data: any) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {
    // Storage full or unavailable
  }
}

export default function App() {
  const [screen, setScreen] = useState('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [user, setUser] = useState<any>(null);
  const defaultAdmin = { id: 'admin-1', name: 'Academic Admin', username: 'admin', password: 'admin123', role: 'admin', subjects: [] };

  const [users, setUsers] = useState<any[]>(() => load('sms_users', [defaultAdmin]));
  const [scores, setScores] = useState<any[]>(() => load('sms_scores', []));
  const [duties, setDuties] = useState<any[]>(() => load('sms_duties', []));
  const [released, setReleased] = useState<string[]>(() => load('sms_released', []));

  useEffect(() => { save('sms_users', users); }, [users]);
  useEffect(() => { save('sms_scores', scores); }, [scores]);
  useEffect(() => { save('sms_duties', duties); }, [duties]);
  useEffect(() => { save('sms_released', released); }, [released]);

  // Ensure admin always exists
  useEffect(() => {
    if (!users.some((u: any) => u.role === 'admin')) {
      setUsers(prev => [defaultAdmin, ...prev]);
    }
  }, []);

  const [newTeacher, setNewTeacher] = useState({ name: '', username: '', password: '', subjects: '' });
  const [newScore, setNewScore] = useState({ student: '', subject: '', className: 'Grade 9A', score: '', maxScore: '100', term: 'Term 1' });
  const [newDuty, setNewDuty] = useState({ date: '', present: '', absent: '', events: '', dayEnd: '' });

  const login = () => {
    const found = users.find((u: any) => u.username === username && u.password === password);
    if (found) {
      setUser(found);
      setScreen(found.role === 'admin' ? 'admin' : 'teacher');
      setError('');
    } else {
      setError('Wrong credentials. Admin: admin / admin123');
    }
  };

  const logout = () => {
    setUser(null);
    setScreen('login');
    setUsername('');
    setPassword('');
  };

  const createTeacher = () => {
    if (!newTeacher.name || !newTeacher.username || !newTeacher.password) return;
    if (users.some((u: any) => u.username === newTeacher.username)) {
      alert('Username already taken!');
      return;
    }
    setUsers([...users, {
      id: 't-' + Date.now(),
      name: newTeacher.name,
      username: newTeacher.username,
      password: newTeacher.password,
      role: 'teacher',
      subjects: newTeacher.subjects.split(',').map((s: string) => s.trim()).filter(Boolean)
    }]);
    setNewTeacher({ name: '', username: '', password: '', subjects: '' });
    alert('Teacher created!');
  };

  const deleteTeacher = (id: string) => {
    setUsers(users.filter((u: any) => u.id !== id));
  };

  const saveScore = () => {
    if (!user || !newScore.student || !newScore.subject || !newScore.score) return;
    setScores([...scores, {
      id: 'sc-' + Date.now(),
      teacher_name: user.name,
      student_name: newScore.student,
      subject: newScore.subject,
      class_name: newScore.className,
      score: Number(newScore.score),
      max_score: Number(newScore.maxScore),
      term: newScore.term
    }]);
    setNewScore({ ...newScore, student: '', score: '' });
    alert('Score saved!');
  };

  const saveDuty = () => {
    if (!user || !newDuty.date || !newDuty.events || !newDuty.dayEnd) return;
    setDuties([...duties, {
      id: 'dr-' + Date.now(),
      teacher_name: user.name,
      date: newDuty.date,
      present_count: Number(newDuty.present),
      absent_count: Number(newDuty.absent),
      events_summary: newDuty.events,
      day_end_summary: newDuty.dayEnd
    }]);
    setNewDuty({ date: '', present: '', absent: '', events: '', dayEnd: '' });
    alert('Duty report submitted!');
  };

  const releaseResults = (term: string) => {
    if (!released.includes(term)) {
      setReleased([...released, term]);
    }
  };

  const teachers = users.filter((u: any) => u.role === 'teacher');
  const classes = ['Grade 9A', 'Grade 9B', 'Grade 10A', 'Grade 10B', 'Grade 11A', 'Grade 11B'];
  const terms = ['Term 1', 'Term 2', 'Term 3'];

  // ===================== LOGIN =====================
  if (screen === 'login') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-slate-100 flex items-center justify-center px-4">
        <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md border border-slate-200">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <span className="text-3xl">🏫</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900">School Management System</h1>
            <p className="text-sm text-slate-500 mt-1">Nambawala Secondary School</p>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase mb-1 block">Username</label>
              <input type="text" placeholder="Enter username" value={username} onChange={e => setUsername(e.target.value)} className="w-full border border-slate-200 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase mb-1 block">Password</label>
              <input type="password" placeholder="Enter password" value={password} onChange={e => setPassword(e.target.value)} className="w-full border border-slate-200 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            {error && <p className="text-red-500 text-sm bg-red-50 p-2 rounded-lg">{error}</p>}
            <button onClick={login} className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700">Sign In</button>
            <p className="text-center text-xs text-gray-400">Admin: admin / admin123 | Teacher: use created accounts</p>
          </div>
        </div>
      </div>
    );
  }

  // ===================== TIMETABLE =====================
  if (screen === 'timetable') {
    return (
      <div className="relative">
        <button onClick={() => setScreen('admin')} className="fixed top-4 right-4 z-50 px-5 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-semibold shadow-lg hover:bg-slate-800">← Back to Dashboard</button>
        <TimetableSubsystem />
      </div>
    );
  }

  // ===================== ADMIN =====================
  if (screen === 'admin') {
    return (
      <div className="min-h-screen bg-slate-100">
        <div className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="font-bold text-xl text-slate-900">Nambawala Secondary School</h1>
            <p className="text-xs text-slate-500">Admin Panel</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-600">Welcome, <strong>{user?.name}</strong></span>
            <button onClick={logout} className="px-4 py-2 bg-red-500 text-white rounded-xl text-sm font-semibold hover:bg-red-600">Logout</button>
          </div>
        </div>

        <div className="p-6 max-w-6xl mx-auto space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 hover:shadow-md transition-all">
              <p className="text-xs uppercase text-slate-500 font-semibold">Teachers</p>
              <p className="text-3xl font-bold text-slate-900 mt-1">{teachers.length}</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 hover:shadow-md transition-all">
              <p className="text-xs uppercase text-slate-500 font-semibold">Score Records</p>
              <p className="text-3xl font-bold text-slate-900 mt-1">{scores.length}</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 hover:shadow-md transition-all">
              <p className="text-xs uppercase text-slate-500 font-semibold">Duty Reports</p>
              <p className="text-3xl font-bold text-slate-900 mt-1">{duties.length}</p>
            </div>
            <div onClick={() => setScreen('timetable')} className="bg-indigo-600 text-white p-5 rounded-2xl cursor-pointer hover:bg-indigo-700 transition-all flex flex-col justify-center items-center shadow-lg shadow-indigo-600/20">
              <span className="text-2xl mb-1">📅</span>
              <span className="font-bold">Open Timetable</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200">
            <h2 className="font-bold text-lg text-slate-900 mb-4">Create Teacher Account</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <input placeholder="Full Name" value={newTeacher.name} onChange={e => setNewTeacher({...newTeacher, name: e.target.value})} className="border border-slate-200 px-3 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              <input placeholder="Username" value={newTeacher.username} onChange={e => setNewTeacher({...newTeacher, username: e.target.value})} className="border border-slate-200 px-3 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              <input type="password" placeholder="Password" value={newTeacher.password} onChange={e => setNewTeacher({...newTeacher, password: e.target.value})} className="border border-slate-200 px-3 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              <input placeholder="Subjects (comma separated)" value={newTeacher.subjects} onChange={e => setNewTeacher({...newTeacher, subjects: e.target.value})} className="border border-slate-200 px-3 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <button onClick={createTeacher} className="mt-4 bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-indigo-700">Create Teacher</button>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200">
            <h2 className="font-bold text-lg text-slate-900 mb-3">Teachers ({teachers.length})</h2>
            {teachers.length === 0 ? <p className="text-sm text-slate-500">No teachers yet.</p> : 
              teachers.map((t: any) => (
                <div key={t.id} className="flex justify-between items-center border-b border-slate-100 py-3">
                  <div>
                    <p className="font-semibold text-slate-900">{t.name}</p>
                    <p className="text-xs text-slate-500">Username: {t.username} | Subjects: {(t.subjects || []).join(', ') || 'None'}</p>
                  </div>
                  <button onClick={() => deleteTeacher(t.id)} className="px-3 py-1 bg-red-50 text-red-600 rounded-lg text-xs font-semibold border border-red-200 hover:bg-red-100">Remove</button>
                </div>
              ))
            }
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200">
            <h2 className="font-bold text-lg text-slate-900 mb-3">Result Approval & Release</h2>
            <div className="flex gap-3 flex-wrap mb-4">
              {terms.map(term => (
                <div key={term} className="flex items-center gap-2">
                  <span className="text-sm font-medium">{term}:</span>
                  {released.includes(term) ? (
                    <span className="text-xs bg-emerald-100 text-emerald-700 px-3 py-1 rounded-lg font-semibold">✅ Released</span>
                  ) : (
                    <button onClick={() => releaseResults(term)} className="text-xs bg-emerald-600 text-white px-3 py-1.5 rounded-lg font-semibold hover:bg-emerald-700">Approve & Release</button>
                  )}
                </div>
              ))}
            </div>
            {scores.length === 0 ? <p className="text-sm text-slate-500">No scores submitted yet.</p> : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="border-b text-slate-500 text-left"><th className="py-2">Student</th><th>Class</th><th>Subject</th><th>Score</th><th>Term</th><th>Teacher</th></tr></thead>
                  <tbody>
                    {scores.map((s: any) => (
                      <tr key={s.id} className="border-b border-slate-100">
                        <td className="py-2">{s.student_name}</td><td>{s.class_name}</td><td>{s.subject}</td><td>{s.score}/{s.max_score}</td><td>{s.term}</td><td>{s.teacher_name}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200">
            <h2 className="font-bold text-lg text-slate-900 mb-3">Teacher Duty Reports ({duties.length})</h2>
            {duties.length === 0 ? <p className="text-sm text-slate-500">No duty reports yet.</p> :
              duties.map((d: any) => (
                <div key={d.id} className="border-b border-slate-100 py-3">
                  <p className="font-semibold text-slate-900">{d.date} — {d.teacher_name}</p>
                  <p className="text-sm text-slate-600">Present: {d.present_count} | Absent: {d.absent_count}</p>
                  <p className="text-sm text-slate-700 mt-1"><strong>Events:</strong> {d.events_summary}</p>
                  <p className="text-sm text-slate-700"><strong>Day end:</strong> {d.day_end_summary}</p>
                </div>
              ))
            }
          </div>
        </div>
      </div>
    );
  }

  // ===================== TEACHER =====================
  if (screen === 'teacher') {
    return (
      <div className="min-h-screen bg-slate-100">
        <div className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="font-bold text-xl text-slate-900">Teacher Panel</h1>
            <p className="text-xs text-slate-500">Welcome, {user?.name}</p>
          </div>
          <button onClick={logout} className="px-4 py-2 bg-red-500 text-white rounded-xl text-sm font-semibold hover:bg-red-600">Logout</button>
        </div>

        <div className="p-6 max-w-4xl mx-auto space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200">
            <h2 className="font-bold text-lg text-slate-900 mb-4">Enter Student Score</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase mb-1 block">Class</label>
                <select value={newScore.className} onChange={e => setNewScore({...newScore, className: e.target.value})} className="w-full border border-slate-200 px-3 py-2.5 rounded-xl">
                  {classes.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase mb-1 block">Subject</label>
                <select value={newScore.subject} onChange={e => setNewScore({...newScore, subject: e.target.value})} className="w-full border border-slate-200 px-3 py-2.5 rounded-xl">
                  <option value="">-- Select Subject --</option>
                  {(user?.subjects || []).map((s: string) => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase mb-1 block">Term</label>
                <select value={newScore.term} onChange={e => setNewScore({...newScore, term: e.target.value})} className="w-full border border-slate-200 px-3 py-2.5 rounded-xl">
                  {terms.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase mb-1 block">Student Name</label>
                <input placeholder="Student Name" value={newScore.student} onChange={e => setNewScore({...newScore, student: e.target.value})} className="w-full border border-slate-200 px-3 py-2.5 rounded-xl" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase mb-1 block">Score</label>
                <input type="number" placeholder="Score" value={newScore.score} onChange={e => setNewScore({...newScore, score: e.target.value})} className="w-full border border-slate-200 px-3 py-2.5 rounded-xl" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase mb-1 block">Max Score</label>
                <input type="number" placeholder="100" value={newScore.maxScore} onChange={e => setNewScore({...newScore, maxScore: e.target.value})} className="w-full border border-slate-200 px-3 py-2.5 rounded-xl" />
              </div>
            </div>
            <button onClick={saveScore} className="mt-4 bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-indigo-700">Save Score</button>

            <div className="mt-6 border-t pt-4">
              <h3 className="font-bold text-slate-900 mb-2">My Submitted Scores</h3>
              {scores.filter((s: any) => s.teacher_name === user?.name).length === 0 ? <p className="text-sm text-slate-500">No scores yet.</p> : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead><tr className="border-b text-slate-500 text-left"><th className="py-2">Student</th><th>Class</th><th>Subject</th><th>Score</th><th>Term</th></tr></thead>
                    <tbody>
                      {scores.filter((s: any) => s.teacher_name === user?.name).map((s: any) => (
                        <tr key={s.id} className="border-b border-slate-100">
                          <td className="py-2">{s.student_name}</td><td>{s.class_name}</td><td>{s.subject}</td><td>{s.score}/{s.max_score}</td><td>{s.term}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200">
            <h2 className="font-bold text-lg text-slate-900 mb-4">Teacher On Duty — Daily Report</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase mb-1 block">Date</label>
                <input type="date" value={newDuty.date} onChange={e => setNewDuty({...newDuty, date: e.target.value})} className="w-full border border-slate-200 px-3 py-2.5 rounded-xl" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase mb-1 block">Students Present</label>
                <input type="number" placeholder="0" value={newDuty.present} onChange={e => setNewDuty({...newDuty, present: e.target.value})} className="w-full border border-slate-200 px-3 py-2.5 rounded-xl" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase mb-1 block">Students Absent</label>
                <input type="number" placeholder="0" value={newDuty.absent} onChange={e => setNewDuty({...newDuty, absent: e.target.value})} className="w-full border border-slate-200 px-3 py-2.5 rounded-xl" />
              </div>
            </div>
            <div className="mt-3">
              <label className="text-xs font-semibold text-slate-500 uppercase mb-1 block">Events & Activities</label>
              <textarea placeholder="Describe events..." value={newDuty.events} onChange={e => setNewDuty({...newDuty, events: e.target.value})} className="w-full border border-slate-200 px-3 py-2.5 rounded-xl" rows={4} />
            </div>
            <div className="mt-3">
              <label className="text-xs font-semibold text-slate-500 uppercase mb-1 block">How The Day Ended</label>
              <textarea placeholder="Summary..." value={newDuty.dayEnd} onChange={e => setNewDuty({...newDuty, dayEnd: e.target.value})} className="w-full border border-slate-200 px-3 py-2.5 rounded-xl" rows={3} />
            </div>
            <button onClick={saveDuty} className="mt-4 bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-indigo-700">Submit Duty Report</button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
