// @ts-nocheck
import { useState, useEffect, useCallback, ErrorInfo, Component, ReactNode } from 'react';
import { TimetableSubsystem } from './components/TimetableSubsystem';
import { TeacherDutyForm, DutyReportPrint, AdminRegisteredStudents } from './components/DutyReport';
import * as cloud from './lib/cloud';

// Safe image component that won't crash
function SafeImg({ src, alt, className }: { src: string; alt: string; className?: string }) {
  if (!src) return null;
  return <img src={src} alt={alt} className={className} onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />;
}

// Error boundary to prevent white screen
class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean; errorMsg: string }> {
  constructor(props: { children: ReactNode }) { super(props); this.state = { hasError: false, errorMsg: '' }; }
  static getDerivedStateFromError(error: Error) { return { hasError: true, errorMsg: error.message }; }
  componentDidCatch(error: Error, info: ErrorInfo) { console.error('App error:', error, info); }
  render() {
    if (this.state.hasError) {
      return <div className="p-8 text-center"><h2 className="text-xl font-bold text-red-600 mb-4">Something went wrong</h2><p className="text-sm text-slate-600 mb-4 bg-slate-100 p-3 rounded">{this.state.errorMsg}</p><button onClick={() => { Object.keys(localStorage).filter(key => key.startsWith('sms_') || key.startsWith('tt_')).forEach(key => localStorage.removeItem(key)); window.location.reload(); }} className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold">Clear App Data & Reload</button></div>;
    }
    return this.props.children;
  }
}

export default function App() {
  return <ErrorBoundary><AppInner /></ErrorBoundary>;
}

function AppInner() {
  const [screen, setScreen] = useState('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [schoolLogo, setSchoolLogo] = useState('');
  const [academicName, setAcademicName] = useState('');
  const [headmasterName, setHeadmasterName] = useState('Saidi Mpambika');
  const [academicSig, setAcademicSig] = useState('');
  const [headmasterSig, setHeadmasterSig] = useState('');
  const [schoolNameSetting, setSchoolNameSetting] = useState('NAMBAWALA SECONDARY SCHOOL');
  const [schoolAddress, setSchoolAddress] = useState('P.O. Box 51, Ruangwa - Lindi');
  const [districtName, setDistrictName] = useState('RUANGWA DISTRICT COUNCIL');
  const [schoolMotto, setSchoolMotto] = useState('Honor All Build Together');

  // Load settings AFTER mount (prevents CSP crash)
  useEffect(() => {
    const loadLogo = () => {
      try {
        setSchoolLogo(localStorage.getItem('sms_school_logo') || '');
        setAcademicName(localStorage.getItem('sms_academic_name') || '');
        setHeadmasterName(localStorage.getItem('sms_headmaster_name') || 'Saidi Mpambika');
        setAcademicSig(localStorage.getItem('sms_academic_sig') || '');
        setHeadmasterSig(localStorage.getItem('sms_headmaster_sig') || '');
        setSchoolNameSetting(localStorage.getItem('sms_school_name_setting') || 'NAMBAWALA SECONDARY SCHOOL');
        setSchoolAddress(localStorage.getItem('sms_school_address') || 'P.O. Box 51, Ruangwa - Lindi');
        setDistrictName(localStorage.getItem('sms_district_name') || 'RUANGWA DISTRICT COUNCIL');
        setSchoolMotto(localStorage.getItem('sms_school_motto') || 'Honor All Build Together');
      } catch {}
    };
    loadLogo();
    window.addEventListener('cloud-sync-complete', loadLogo);
    window.addEventListener('focus', loadLogo);
    return () => { window.removeEventListener('cloud-sync-complete', loadLogo); window.removeEventListener('focus', loadLogo); };
  }, []);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // compress: warn if > 150KB for Opera Mini
    if (file.size > 300000) alert('Logo is large (' + Math.round(file.size/1024) + 'KB). Try to use < 150KB for best display on all phones. Opera Mini may hide large logos.');
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      localStorage.setItem('sms_school_logo', base64);
      setSchoolLogo(base64);
      if (cloud.isCloudMode()) setTimeout(()=> cloud.syncToCloud().catch(()=>{}), 300);
      alert('School logo updated! It will appear on login after sync (5 sec) on all devices.');
    };
    reader.readAsDataURL(file);
  };

  const [users, setUsers] = useState<any[]>([]);
  const [scores, setScores] = useState<any[]>([]);
  const [duties, setDuties] = useState<any[]>([]);
  const [released, setReleased] = useState<string[]>([]);

  // Class teachers: { className: teacherId }
  const [classTeachers, setClassTeachers] = useState<Record<string, string>>(() => {
    try { return JSON.parse(localStorage.getItem('sms_class_teachers') || '{}'); } catch { return {}; }
  });

  // Students: { className: [{ name, subjects, phone }, ...] }
  const [students, setStudents] = useState<Record<string, { name: string; subjects: string[]; phone?: string }[]>>(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('sms_students') || '{}');
      const migrated: Record<string, { name: string; subjects: string[]; phone?: string }[]> = {};
      Object.entries(saved).forEach(([cls, list]: [string, any]) => {
        if (Array.isArray(list) && list.length > 0 && typeof list[0] === 'string') {
          migrated[cls] = list.map((name: string) => ({ name, subjects: [...ALL_SUBJECTS], phone: '' }));
        } else {
          migrated[cls] = (list || []).map((s: any) => ({ ...s, phone: s.phone || '' }));
        }
      });
      return migrated;
    } catch { return {}; }
  });

  // Teaching assignments: { teacherId: [{ cls: 'Form IA', sub: 'Mathematics' }, ...] }
  const [teachingAssignments, setTeachingAssignments] = useState<Record<string, { cls: string; sub: string }[]>>(() => {
    try { return JSON.parse(localStorage.getItem('sms_teaching_assignments') || '{}'); } catch { return {}; }
  });

  useEffect(() => {
    const classTeachersValue = JSON.stringify(classTeachers);
    const teachingAssignmentsValue = JSON.stringify(teachingAssignments);
    const previousClassTeachers = localStorage.getItem('sms_class_teachers');
    const previousTeachingAssignments = localStorage.getItem('sms_teaching_assignments');
    localStorage.setItem('sms_class_teachers', classTeachersValue);
    localStorage.setItem('sms_teaching_assignments', teachingAssignmentsValue);
    const classTeachersChanged = previousClassTeachers !== null && previousClassTeachers !== classTeachersValue;
    const teachingAssignmentsChanged = previousTeachingAssignments !== null && previousTeachingAssignments !== teachingAssignmentsValue;
    if (classTeachersChanged) localStorage.setItem('sms_class_teachers_ts', String(Date.now()));
    if (teachingAssignmentsChanged) localStorage.setItem('sms_teaching_assignments_ts', String(Date.now()));
    if (cloud.isCloudMode() && (classTeachersChanged || teachingAssignmentsChanged)) {
      const t=setTimeout(()=>cloud.syncRoleAssignmentsToCloud(classTeachers, teachingAssignments),400);
      return()=>clearTimeout(t);
    }
  }, [classTeachers, teachingAssignments]);
  useEffect(() => {
    const value = JSON.stringify(students);
    const previous = localStorage.getItem('sms_students');
    localStorage.setItem('sms_students', value);
    const changed = previous !== null && previous !== value;
    if (changed) localStorage.setItem('sms_students_ts', String(Date.now()));
    if (cloud.isCloudMode() && changed) { const t=setTimeout(()=>cloud.syncToCloud(),400); return()=>clearTimeout(t); }
  }, [students]);

  const addTeachingAssignment = (teacherId: string, cls: string, sub: string) => {
    if (!cls || !sub) return;
    setTeachingAssignments(prev => {
      const existing = prev[teacherId] || [];
      if (existing.some(a => a.cls === cls && a.sub === sub)) return prev;
      return { ...prev, [teacherId]: [...existing, { cls, sub }] };
    });
  };

  const removeTeachingAssignment = (teacherId: string, cls: string, sub: string) => {
    setTeachingAssignments(prev => ({
      ...prev,
      [teacherId]: (prev[teacherId] || []).filter(a => !(a.cls === cls && a.sub === sub))
    }));
  };

  // Get classes this teacher teaches
  const getTeacherClasses = (teacherId: string): string[] => {
    return [...new Set((teachingAssignments[teacherId] || []).map(a => a.cls))];
  };

  // Get subjects this teacher teaches in a specific class
  const getTeacherSubjectsForClass = (teacherId: string, cls: string): string[] => {
    return (teachingAssignments[teacherId] || []).filter(a => a.cls === cls).map(a => a.sub);
  };

  const assignClassTeacher = (className: string, teacherId: string) => {
    setClassTeachers(prev => ({ ...prev, [className]: teacherId }));
  };

  const refreshRoleAssignments = async () => {
    const roles = await cloud.getRoleAssignmentsFromCloud();
    if (!roles) return;
    setClassTeachers(prev => JSON.stringify(prev) === JSON.stringify(roles.classTeachers) ? prev : roles.classTeachers);
    setTeachingAssignments(prev => JSON.stringify(prev) === JSON.stringify(roles.teachingAssignments) ? prev : roles.teachingAssignments);
  };

  const [newStudentName, setNewStudentName] = useState('');
  const [selectedParentExam, setSelectedParentExam] = useState('');

  // Messaging system
  const [messages, setMessages] = useState<any[]>(() => {
    try { return JSON.parse(localStorage.getItem('sms_messages') || '[]'); } catch { return []; }
  });
  useEffect(() => { localStorage.setItem('sms_messages', JSON.stringify(messages)); }, [messages]);

  const [msgText, setMsgText] = useState('');
  const [msgSubject, setMsgSubject] = useState('');
  const [msgTarget, setMsgTarget] = useState('all'); // 'all', class name, or comma-separated classes

  const sendMessage = (senderName: string) => {
    if (!msgText.trim() || !msgSubject.trim()) { alert('Write subject and message'); return; }
    // Find target parent phones
    let targetPhones: string[] = [];
    if (msgTarget === 'all') {
      Object.values(students).forEach(list => list.forEach(s => { if (s.phone) targetPhones.push(s.phone); }));
    } else {
      const targetClasses = msgTarget.split(',').map(c => c.trim());
      targetClasses.forEach(cls => {
        // Check if it's a form level (e.g. "Form I") or specific stream (e.g. "Form IA")
        Object.entries(students).forEach(([className, list]) => {
          if (className === cls || className.startsWith(cls)) {
            list.forEach(s => { if (s.phone) targetPhones.push(s.phone); });
          }
        });
      });
    }
    targetPhones = [...new Set(targetPhones)];
    if (targetPhones.length === 0) { alert('No parents found for this selection'); return; }

    const msg = {
      id: 'msg-' + Date.now(),
      subject: msgSubject,
      text: msgText,
      sender: senderName,
      target: msgTarget,
      targetPhones,
      date: new Date().toISOString(),
      readBy: [] as string[]
    };
    setMessages(prev => [msg, ...prev]);
    setMsgText('');
    setMsgSubject('');
    alert(`Message sent to ${targetPhones.length} parent(s)!`);
  };
  const [editingTeacherId, setEditingTeacherId] = useState<string | null>(null);
  const [editSubjects, setEditSubjects] = useState<string[]>([]);
  const [editTeacherName, setEditTeacherName] = useState<string>('');

  const startEditSubjects = (teacher: any) => {
    setEditingTeacherId(teacher.id);
    setEditSubjects(teacher.subjects || []);
    setEditTeacherName(teacher.name || '');
  };

  const toggleEditSubject = (sub: string) => {
    setEditSubjects(prev => prev.includes(sub) ? prev.filter(s => s !== sub) : [...prev, sub]);
  };

  const saveEditSubjects = async () => {
    if (!editingTeacherId) return;
    if (!editTeacherName.trim()) { alert('Teacher name required'); return; }
    setLoading(true);
    // Update in cloud/localStorage — now includes name edit
    const updatedUsers = users.map((u: any) => u.id === editingTeacherId ? { ...u, name: editTeacherName.trim(), subjects: editSubjects } : u);
    // Save to cloud if available
    try {
      if (cloud.isCloudMode()) {
        await cloud.deleteUser(editingTeacherId);
        const teacher = updatedUsers.find((u: any) => u.id === editingTeacherId);
        if (teacher) await cloud.createUser(teacher);
      }
    } catch (e) { console.error('Edit subjects error:', e); }
    // Update localStorage
    localStorage.setItem('sms_users', JSON.stringify(updatedUsers));
    setUsers(updatedUsers);
    setEditingTeacherId(null);
    setEditSubjects([]);
    await loadData();
    setLoading(false);
    alert('Subjects updated!');
  };

  const removeStudent = (cls: string, name: string) => {
    setStudents(prev => ({
      ...prev,
      [cls]: (prev[cls] || []).filter(s => s.name !== name)
    }));
  };

  const toggleStudentSubject = (cls: string, studentName: string, subject: string) => {
    setStudents(prev => ({
      ...prev,
      [cls]: (prev[cls] || []).map(s => s.name === studentName ? {
        ...s,
        subjects: s.subjects.includes(subject) ? s.subjects.filter(sub => sub !== subject) : [...s.subjects, subject]
      } : s)
    }));
  };

  // Helper: get student names taking a specific subject in a class (sorted A-Z)
  const getStudentsForSubject = (cls: string, subject: string): string[] => {
    return (students[cls] || []).filter(s => s.subjects.includes(subject)).map(s => s.name).sort((a, b) => a.localeCompare(b));
  };

  // Helper: get all student names in a class (sorted A-Z)
  const getStudentNames = (cls: string): string[] => {
    return (students[cls] || []).map(s => s.name).sort((a, b) => a.localeCompare(b));
  };

  // ==================== EXAM SYSTEM ====================
  // Exam: { id, name, term, deadline, extensions: { teacherId: newDeadline }, createdAt }
  const [exams, setExams] = useState<any[]>(() => {
    try { return JSON.parse(localStorage.getItem('sms_exams') || '[]'); } catch { return []; }
  });
  useEffect(() => {
    const value = JSON.stringify(exams);
    const previous = localStorage.getItem('sms_exams');
    localStorage.setItem('sms_exams', value);
    localStorage.setItem('sms_exams_ts', String(Date.now()));
    if (cloud.isCloudMode() && previous !== null && previous !== value) {
      const t = setTimeout(() => { cloud.syncToCloud(); }, 400);
      return () => clearTimeout(t);
    }
  }, [exams]);

  const [newExam, setNewExam] = useState({ name: '', term: 'Term I', deadline: '' });

  const createExam = () => {
    if (!newExam.name || !newExam.deadline) return;
    const newEx = {
      id: 'ex-' + Date.now(),
      name: newExam.name,
      term: newExam.term,
      deadline: newExam.deadline,
      extensions: {},
      createdAt: new Date().toISOString()
    };
    setExams(prev => [...prev, newEx]);
    setNewExam({ name: '', term: 'Term I', deadline: '' });
    // instant push to Supabase so teacher sees without waiting 15s
    if (cloud.isCloudMode()) {
      // push via syncToCloud quickly + also direct
      setTimeout(() => { cloud.syncToCloud().catch(()=>{}); }, 200);
    }
    alert('Exam created! Teachers will see it in ~5 seconds (or on refresh)');
  };

  const deleteExam = (id: string) => {
    setExams(prev => prev.filter(e => e.id !== id));
  };

  const extendDeadline = (examId: string, teacherId: string, newDeadline: string) => {
    setExams(prev => prev.map(e => e.id === examId ? { ...e, extensions: { ...e.extensions, [teacherId]: newDeadline } } : e));
    alert('Deadline extended!');
  };

  // Get teacher's deadline for an exam (personal extension or global)
  const getTeacherDeadline = (exam: any, teacherId: string): string => {
    return exam.extensions?.[teacherId] || exam.deadline;
  };

  // Check if exam is still open for a teacher
  const isExamOpen = (exam: any, teacherId: string): boolean => {
    const deadline = getTeacherDeadline(exam, teacherId);
    return new Date(deadline) > new Date();
  };

  const teacherHasExamAssignment = (_exam: any, teacherId: string): boolean => {
    return (teachingAssignments[teacherId] || []).length > 0;
  };

  // Get remaining time string
  const getTimeRemaining = (deadline: string): string => {
    const diff = new Date(deadline).getTime() - Date.now();
    if (diff <= 0) return 'Expired';
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ${hours}h remaining`;
    if (hours > 0) return `${hours}h ${mins}m remaining`;
    return `${mins}m remaining`;
  };

  // Timer update + cloud sync + POLL for exams/scores — so device nyingine inaona mara moja
  const [, setTick] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setTick(t => t + 1), 60000);
    // Poll cloud for cross-device changes without repeatedly rewriting all app_data keys.
    const pollTimer = setInterval(async () => {
      if (cloud.isCloudMode()) {
        await cloud.syncFromCloud();
        await refreshRoleAssignments();
        try {
          const freshExams = JSON.parse(localStorage.getItem('sms_exams') || '[]');
          setExams(prev => {
            if (Array.isArray(freshExams) && freshExams.length === 0 && Array.isArray(prev) && prev.length > 0) return prev;
            return JSON.stringify(prev) !== JSON.stringify(freshExams) ? freshExams : prev;
          });
        } catch {}
        try {
          const freshCT = JSON.parse(localStorage.getItem('sms_class_teachers') || '{}');
          setClassTeachers((prev: any) => JSON.stringify(prev) !== JSON.stringify(freshCT) ? freshCT : prev);
        } catch {}
        try {
          const freshST = JSON.parse(localStorage.getItem('sms_students') || '{}');
          setStudents((prev: any) => JSON.stringify(prev) !== JSON.stringify(freshST) ? freshST : prev);
        } catch {}
        try {
          const freshTA = JSON.parse(localStorage.getItem('sms_teaching_assignments') || '{}');
          setTeachingAssignments((prev: any) => JSON.stringify(prev) !== JSON.stringify(freshTA) ? freshTA : prev);
        } catch {}
        try {
          const freshSubjects = JSON.parse(localStorage.getItem('sms_school_subjects') || '[]');
          if (freshSubjects.length) setSchoolSubjects(prev => JSON.stringify(prev) !== JSON.stringify(freshSubjects) ? freshSubjects : prev);
        } catch {}
        try {
          const freshClasses = JSON.parse(localStorage.getItem('sms_school_classes') || '[]');
          const ts = localStorage.getItem('sms_school_classes_ts');
          const isRecent = ts && (Date.now() - parseInt(ts, 10) < 15000);
          if (isRecent) {
            // admin just edited (add/delete), don't overwrite — let syncToCloud push local
          } else if (Array.isArray(freshClasses) && freshClasses.length) {
            setSchoolClasses((prev: any) => JSON.stringify(prev) !== JSON.stringify(freshClasses) ? freshClasses : prev);
          } else if (Array.isArray(freshClasses) && freshClasses.length === 0) {
            setSchoolClasses([]);
          }
        } catch {}
        await loadData();
      }
    }, 60000);
    const onFocus = async () => {
      if (cloud.isCloudMode()) {
        await cloud.syncFromCloud();
        await refreshRoleAssignments();
        try {
          const fe = JSON.parse(localStorage.getItem('sms_exams') || '[]');
          setExams((prev:any) => (Array.isArray(fe) && fe.length===0 && Array.isArray(prev) && prev.length>0) ? prev : fe);
        } catch {}
        try { setClassTeachers(JSON.parse(localStorage.getItem('sms_class_teachers') || '{}')); } catch {}
        try { setStudents(JSON.parse(localStorage.getItem('sms_students') || '{}')); } catch {}
        try { setTeachingAssignments(JSON.parse(localStorage.getItem('sms_teaching_assignments') || '{}')); } catch {}
        try {
          const fc = JSON.parse(localStorage.getItem('sms_school_classes') || '[]');
          const ts = localStorage.getItem('sms_school_classes_ts');
          const isRecent = ts && (Date.now() - parseInt(ts, 10) < 15000);
          if (isRecent) {
            // keep local recent edit
          } else if (Array.isArray(fc) && fc.length) setSchoolClasses((prev:any) => JSON.stringify(prev) !== JSON.stringify(fc) ? fc : prev);
          else if (Array.isArray(fc) && fc.length === 0) setSchoolClasses([]);
        } catch {}
        await loadData();
      }
    };
    window.addEventListener('focus', onFocus);
    return () => { clearInterval(timer); clearInterval(pollTimer); window.removeEventListener('focus', onFocus); };
  }, []);

  // Scores are the only cross-device data that must appear promptly for admins.
  useEffect(() => {
    if (!cloud.isCloudMode() || (user?.role !== 'admin' && user?.role !== 'teacher')) return;
    let active = true;
    const refreshScores = async () => {
      if (user?.role === 'admin') {
        const freshScores = await cloud.getScores().catch(() => null);
        if (active && Array.isArray(freshScores)) setScores(freshScores);
      }
    };
    const refreshExams = async () => {
      await cloud.refreshAppDataKey('sms_exams');
      if (!active) return;
      try {
        const freshExams = JSON.parse(localStorage.getItem('sms_exams') || '[]');
        setExams(prev => JSON.stringify(prev) !== JSON.stringify(freshExams) ? freshExams : prev);
      } catch {}
    };
    refreshScores();
    refreshExams();
    const timer = setInterval(() => { refreshScores(); refreshExams(); }, 30000);
    const unsubscribeScores = user?.role === 'admin' ? cloud.subscribeToScoreChanges(refreshScores) : () => {};
    const unsubscribeExams = cloud.subscribeToAppDataChanges('sms_exams', refreshExams);
    return () => { active = false; clearInterval(timer); unsubscribeScores(); unsubscribeExams(); };
  }, [user?.role]);

  // Score entry state for exam mode
  const [selectedExam, setSelectedExam] = useState<any>(null);
  const [examScoreClass, setExamScoreClass] = useState('');
  const [examScoreSubject, setExamScoreSubject] = useState('');
  const [examScores, setExamScores] = useState<Record<string, string>>({});

  useEffect(() => {
    const assignments = getTeacherSubjectsForClass(user?.id, examScoreClass);
    if (assignments.length === 1 && examScoreSubject !== assignments[0]) {
      setExamScoreSubject(assignments[0]);
    }
  }, [examScoreClass, examScoreSubject, user?.id, teachingAssignments]);

  // Admin result viewing
  const [viewExamId, setViewExamId] = useState('');
  const [viewClass, setViewClass] = useState('');

  // Archive filters
  const currentYear = new Date().getFullYear();
  const [filterYear, setFilterYear] = useState(String(currentYear));
  const [filterMonth, setFilterMonth] = useState('');
  const availableYears: string[] = [String(currentYear)];
  try {
    duties.forEach((d: any) => { const y = d.date?.substring(0, 4); if (y && !availableYears.includes(y)) availableYears.push(y); });
  } catch {}
  availableYears.sort().reverse();

  // Print orientation selected per-click via buttons

  const saveExamScores = async () => {
    if (!selectedExam || !examScoreClass || !examScoreSubject) return;
    const assigned = (teachingAssignments[user?.id] || []).some(a => a.cls === examScoreClass && a.sub === examScoreSubject);
    if (!assigned || !isExamOpen(selectedExam, user?.id)) {
      alert('This class/subject is not assigned to you or the deadline has passed.');
      setSelectedExam(null);
      return;
    }
    setLoading(true);
    const studentList = getStudentsForSubject(examScoreClass, examScoreSubject);
    let saved = 0;
    let failed = 0;
    let lastError = '';
    // use stable timestamp base to avoid duplicate ids in fast loop
    const base = Date.now();
    for (let i = 0; i < studentList.length; i++) {
      const student = studentList[i];
      const score = examScores[student];
      if (score !== '' && score != null && Number(score) >= 0) {
        try {
          const existing = scores.find((savedScore: any) => savedScore.exam_id === selectedExam.id && savedScore.student_name === student && savedScore.class_name === examScoreClass && savedScore.subject === examScoreSubject);
          await cloud.addScore({
            id: existing?.id || `sc-${selectedExam.id}-${user?.id}-${examScoreClass}-${examScoreSubject}-${student}`.replace(/[^a-zA-Z0-9_-]/g, '_'),
            teacher_name: user?.name,
            student_name: student,
            subject: examScoreSubject,
            class_name: examScoreClass,
            score: Number(score),
            max_score: 100,
            term: selectedExam.term,
            exam_name: selectedExam.name,
            exam_id: selectedExam.id,
            teacher_id: user?.id
          });
          saved++;
        } catch (e: any) {
          failed++;
          lastError = e?.message || String(e);
          console.error('addScore failed for', student, e);
        }
      }
    }
    await loadData();
    setLoading(false);
    setExamScores({});
    if (failed === 0) alert('✅ Scores saved! (' + saved + ' students) — sent to admin');
    else alert('⚠️ Saved ' + saved + ', failed ' + failed + ' — ' + lastError + '\nCheck: Supabase Table Editor → scores → does exam_id column exist? And Netlify env vars VITE_SUPABASE_URL/KEY correct?');
  };

  const [schoolSubjects, setSchoolSubjects] = useState<string[]>(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('sms_school_subjects') || '[]');
      return saved.length > 0 ? saved : ['Mathematics', 'English', 'Biology', 'Physics', 'Chemistry', 'History', 'Geography', 'Computer Science', 'Literature', 'Kiswahili', 'Civics', 'Book Keeping', 'Commerce', 'Bible Knowledge'];
    } catch { return ['Mathematics', 'English', 'Biology', 'Physics', 'Chemistry', 'History', 'Geography', 'Computer Science', 'Literature', 'Kiswahili', 'Civics', 'Book Keeping', 'Commerce', 'Bible Knowledge']; }
  });
  // ✅ Subject codes: admin must provide code (e.g., MATH) - stored in sms_subject_codes
  const [schoolSubjectCodes, setSchoolSubjectCodes] = useState<Record<string,string>>(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('sms_subject_codes') || '{}');
      if (Object.keys(saved).length > 0) return saved;
      // defaults from name -> code
      const def: Record<string,string> = {};
      ['Mathematics','English','Biology','Physics','Chemistry','History','Geography','Computer Science','Literature','Kiswahili','Civics','Book Keeping','Commerce','Bible Knowledge'].forEach(n=>{
        let c = n.substring(0,4).toUpperCase().replace(' ','');
        if (n==='Book Keeping') c='BK';
        if (n==='Computer Science') c='COMP';
        if (n==='Bible Knowledge') c='BKNO';
        def[n]=c;
      });
      return def;
    } catch { return {}; }
  });
  useEffect(() => { 
    const value = JSON.stringify(schoolSubjects);
    const previous = localStorage.getItem('sms_school_subjects');
    localStorage.setItem('sms_school_subjects', value);
    if (cloud.isCloudMode() && previous !== null && previous !== value) {
      const t = setTimeout(() => { cloud.syncToCloud(); }, 400);
      return () => clearTimeout(t);
    }
  }, [schoolSubjects]);
  useEffect(() => {
    const value = JSON.stringify(schoolSubjectCodes);
    const previous = localStorage.getItem('sms_subject_codes');
    localStorage.setItem('sms_subject_codes', value);
    // sync to timetable shared
    try {
      const mapped = schoolSubjects.map(name => ({ name, code: schoolSubjectCodes[name] || name.substring(0,4).toUpperCase().replace(' ','') }));
      localStorage.setItem('tt_shared_subjects_codes', JSON.stringify(mapped));
    } catch {}
    if (cloud.isCloudMode() && previous !== null && previous !== value) {
      const t = setTimeout(() => { cloud.syncToCloud(); }, 400);
      return () => clearTimeout(t);
    }
  }, [schoolSubjectCodes, schoolSubjects]);
  const getSubjectCode = (name: string) => schoolSubjectCodes[name] || name.substring(0,4).toUpperCase().replace(' ','');
  const ALL_SUBJECTS = schoolSubjects;
  const [newSubjectName, setNewSubjectName] = useState('');
  const [newSubjectCode, setNewSubjectCode] = useState('');

  const addSchoolSubject = () => {
    if (!newSubjectName.trim() || !newSubjectCode.trim()) { alert('Enter subject name and code (e.g., Mathematics / MATH)'); return; }
    const name = newSubjectName.trim();
    const code = newSubjectCode.trim().toUpperCase().replace(/\s+/g,'');
    if (schoolSubjects.includes(name)) { alert('Subject already exists'); return; }
    if (Object.values(schoolSubjectCodes).includes(code)) { alert('Code already exists'); return; }
    if (code.length < 2 || code.length > 6) { alert('Code must be 2-6 letters (e.g., MATH, BIO, KISW)'); return; }
    setSchoolSubjects(prev => [...prev, name].sort());
    setSchoolSubjectCodes(prev => ({...prev, [name]: code}));
    setNewSubjectName('');
    setNewSubjectCode('');
  };

  const removeSchoolSubject = (sub: string) => {
    setSchoolSubjects(prev => prev.filter(s => s !== sub));
    setSchoolSubjectCodes(prev => { const n={...prev}; delete n[sub]; return n; });
  };

  // Sync subjects and teachers to timetable system via localStorage
  useEffect(() => {
    // Share registered subjects with timetable
    localStorage.setItem('tt_shared_subjects', JSON.stringify(schoolSubjects));
    // Share registered teachers with timetable
    localStorage.setItem('tt_shared_teachers', JSON.stringify(users.filter((u: any) => u.role === 'teacher').map((t: any) => ({ id: t.id, name: t.name, subjects: t.subjects }))));
  }, [schoolSubjects, users]);

  const [newTeacher, setNewTeacher] = useState({ name: '', username: '', password: '', subjects: [] as string[] });

  const toggleSubject = (sub: string) => {
    setNewTeacher(prev => ({
      ...prev,
      subjects: prev.subjects.includes(sub) ? prev.subjects.filter(s => s !== sub) : [...prev.subjects, sub]
    }));
  };
  // newScore removed - using exam-based score entry now
  const [printReport, setPrintReport] = useState<any>(null);

  const loadData = useCallback(async () => {
    try {
      const [u, s, d, r] = await Promise.all([
        cloud.getUsers().catch(() => []),
        cloud.getScores().catch(() => []),
        cloud.getDutyReportsFull().catch(() => []),
        cloud.getReleased().catch(() => [])
      ]);
      // Preserve teachers if cloud temporarily empty (prevents "no teacher registered" flash)
      setUsers(prev => {
        if (Array.isArray(u) && u.length > 0) return u;
        if (Array.isArray(prev) && prev.length > 0 && Array.isArray(u) && u.length === 0) return prev;
        return Array.isArray(u) ? u : prev;
      });
      // Scores: empty is valid (no scores yet) but preserve if we had scores and cloud returned empty due to network
      setScores(prev => {
        if (Array.isArray(s) && s.length > 0) return s;
        if (Array.isArray(prev) && prev.length > 0 && Array.isArray(s) && s.length === 0) {
          // keep previous, background will retry
          return prev;
        }
        return Array.isArray(s) ? s : prev;
      });
      setDuties(Array.isArray(d) ? d : []);
      setReleased(Array.isArray(r) ? r : []);
    } catch { /* silent */ }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  // restore session on refresh - don't logout on reload
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('sms_current_user');
      const savedScreen = localStorage.getItem('sms_session_screen');
      if (savedUser && !user) {
        const parsed = JSON.parse(savedUser);
        setUser(parsed);
        if (savedScreen) setScreen(savedScreen);
        else if (parsed.role === 'admin') setScreen('admin');
        else if (parsed.role === 'parent') setScreen('parent');
        else setScreen('teacher');
      }
    } catch {}
  }, []);

  const login = async () => {
    setLoading(true);
    setError('');
    try {
      let allUsers: any[] = [];
      // Opera Mini + slow network: timeout getUsers in 4s, fallback to local cache immediately
      const getUsersWithTimeout = async (): Promise<any[]> => {
        try {
          const timeout = new Promise<any[]>((_, rej) => setTimeout(() => rej(new Error('timeout')), 4000));
          const fetchP = cloud.getUsers();
          return await Promise.race([fetchP, timeout]);
        } catch { return []; }
      };
      try {
        // if Opera Mini, prefer local cache first
        if ((cloud as any).isOperaMini && (cloud as any).isOperaMini()) {
          try { const cached = JSON.parse(localStorage.getItem('sms_users') || '[]'); if (cached.length > 0) allUsers = cached; } catch {}
          // try cloud in background but don't block
          getUsersWithTimeout().then(u => { if (u.length > allUsers.length) localStorage.setItem('sms_users', JSON.stringify(u)); }).catch(()=>{});
          if (allUsers.length === 0) { try { allUsers = await getUsersWithTimeout(); } catch {} }
        } else {
          allUsers = await getUsersWithTimeout();
        }
      } catch { allUsers = []; }
      // also check local cache if cloud empty
      if (allUsers.length === 0) {
        try { const cached = JSON.parse(localStorage.getItem('sms_users') || '[]'); if (cached.length > 0) allUsers = cached; } catch {}
      }
      const found = allUsers.find((u: any) => u.username?.trim() === username.trim() && u.password === password);
      if (found) {
        // persist immediately so refresh doesn't logout
        localStorage.setItem('sms_current_user', JSON.stringify(found));
        localStorage.setItem('sms_session_screen', found.role === 'admin' ? 'admin' : found.role === 'parent' ? 'parent' : 'teacher');
        setUser(found);
        if (found.role === 'admin') { setScreen('admin'); setActiveMenu('dashboard'); }
        else if (found.role === 'parent') { setScreen('parent'); setActiveMenu('report_cards'); }
        else { setScreen('teacher'); setActiveMenu('my_timetable'); }
        setLoading(false);
        // background sync - don't block login
        (async () => {
          try { await cloud.syncFromCloud(); } catch {}
          try { await refreshRoleAssignments(); } catch {}
          try { if ((cloud as any).syncScoresToCloud) await (cloud as any).syncScoresToCloud(); } catch {}
          try {
            const fe = JSON.parse(localStorage.getItem('sms_exams') || '[]');
            setExams((prev:any) => (Array.isArray(fe) && fe.length===0 && Array.isArray(prev) && prev.length>0) ? prev : fe);
          } catch {}
          try { setClassTeachers(JSON.parse(localStorage.getItem('sms_class_teachers') || '{}')); } catch {}
          try { setStudents(JSON.parse(localStorage.getItem('sms_students') || '{}')); } catch {}
          try { setTeachingAssignments(JSON.parse(localStorage.getItem('sms_teaching_assignments') || '{}')); } catch {}
          try {
            const fc = JSON.parse(localStorage.getItem('sms_school_classes') || '[]');
            const ts = localStorage.getItem('sms_school_classes_ts');
            const isRecent = ts && (Date.now() - parseInt(ts, 10) < 15000);
            if (isRecent) {
              // keep local recent edit
            } else if (Array.isArray(fc) && fc.length) setSchoolClasses((prev:any) => JSON.stringify(prev) !== JSON.stringify(fc) ? fc : prev);
            else if (Array.isArray(fc) && fc.length === 0) setSchoolClasses([]);
          } catch {}
          await loadData();
        })();
        return;
      } else {
        if (username.trim() === 'admin' && password === 'admin123') {
          const fallback = { id: 'admin-1', name: 'Academic Admin', username: 'admin', role: 'admin', subjects: [] };
          localStorage.setItem('sms_current_user', JSON.stringify(fallback));
          localStorage.setItem('sms_session_screen', 'admin');
          setUser(fallback);
          setScreen('admin');
          setActiveMenu('dashboard');
          setLoading(false);
          (async () => { try { await cloud.syncFromCloud(); } catch {}; try { await refreshRoleAssignments(); } catch {}; await loadData(); })();
          return;
        } else {
          setError('Wrong credentials. Admin: admin / admin123');
        }
      }
    } catch (e) {
      console.error('Login error:', e);
      if (username.trim() === 'admin' && password === 'admin123') {
        const fallback = { id: 'admin-1', name: 'Academic Admin', username: 'admin', role: 'admin', subjects: [] };
        localStorage.setItem('sms_current_user', JSON.stringify(fallback));
        setUser(fallback);
        setScreen('admin');
        setActiveMenu('dashboard');
      } else {
        setError('Connection error. Please try again.');
      }
    }
    setLoading(false);
  };

  const logout = () => {
    // instant logout - background sync, keep cache for next login
    if (cloud.isCloudMode()) { cloud.syncToCloud().catch(()=>{}); }
    localStorage.removeItem('sms_current_user');
    localStorage.removeItem('sms_session_screen');
    setUser(null);
    setScreen('login');
    setUsername('');
    setPassword('');
    setError('');
    setLoading(false);
  };

  const createTeacher = async () => {
    if (!newTeacher.name || !newTeacher.username) return;
    const allUsers = await cloud.getUsers();
    if (allUsers.some((u: any) => u.username === newTeacher.username)) { alert('Username taken!'); return; }
    setLoading(true);
    await cloud.createUser({
      id: 't-' + Date.now(),
      name: newTeacher.name,
      username: newTeacher.username,
      password: 'Teacher@123',
      role: 'teacher',
      subjects: newTeacher.subjects
    });
    setNewTeacher({ name: '', username: '', password: '', subjects: [] });
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

  // Exam mode is now the primary score entry method
  void saveExamScores;

  const saveDuty = async (data: any) => {
    setLoading(true);
    await cloud.addDutyReport(data);
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
  const [schoolClassesReady, setSchoolClassesReady] = useState(!cloud.isCloudMode());
  const [schoolClasses, setSchoolClasses] = useState<string[]>(() => {
    try {
      const savedValue = localStorage.getItem('sms_school_classes');
      if (savedValue !== null) {
        const saved = JSON.parse(savedValue);
        if (Array.isArray(saved)) return saved;
      }
    } catch {}
    return ['Form IA', 'Form IB', 'Form IC', 'Form IIA', 'Form IIB', 'Form IIC', 'Form IIIA', 'Form IIIB', 'Form IIIC', 'Form IVA', 'Form IVB', 'Form IVC'];
  });
  useEffect(() => {
    if (!cloud.isCloudMode()) return;
    cloud.getSchoolClassesFromCloud()
      .then(classes => {
        if (Array.isArray(classes)) setSchoolClasses(classes);
      })
      .catch(() => {})
      .finally(() => setSchoolClassesReady(true));
  }, []);
  useEffect(() => {
    const value = JSON.stringify(schoolClasses);
    const previous = localStorage.getItem('sms_school_classes');
    localStorage.setItem('sms_school_classes', value);
    localStorage.setItem('tt_shared_classes', value);
    // ✅ FIX: sync classes to Supabase immediately so admin changes appear for teachers
    if (cloud.isCloudMode() && schoolClassesReady && previous !== null && previous !== value) {
      // debounced very short - fire and forget
      const t = setTimeout(() => { cloud.syncToCloud(); }, 400);
      return () => clearTimeout(t);
    }
  }, [schoolClasses]);
  const CLASSES = schoolClasses;
  const [newClassName, setNewClassName] = useState('');

  // Find which class this teacher is class teacher of
  const myClass = user ? Object.entries(classTeachers).find(([_, tid]) => tid === user.id)?.[0] : null;
  const terms = ['Term I', 'Term II'];
  const mode = cloud.isCloudMode() ? '🟢 Cloud Database' : '🟡 Local Storage';

  // Show/hide password & change password & sidebar & recovery
  const [showPassword, setShowPassword] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showRecovery, setShowRecovery] = useState(false);
  const [recoveryCode, setRecoveryCode] = useState('');
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const resetAdminPassword = async () => {
    if (recoveryCode !== 'RAJABU2026') {
      alert('Wrong recovery code!');
      return;
    }
    const updatedUsers = users.map((u: any) => u.id === 'admin-1' || u.username === 'admin' ? { ...u, password: 'admin123' } : u);
    localStorage.setItem('sms_users', JSON.stringify(updatedUsers));
    try { if (cloud.isCloudMode()) { await cloud.deleteUser('admin-1'); await cloud.createUser(updatedUsers.find((u: any) => u.username === 'admin')); } } catch {}
    setRecoveryCode('');
    setShowRecovery(false);
    alert('Admin password has been reset to: admin123');
    window.location.reload();
  };
  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');

  const changePassword = async () => {
    if (!user) return;
    if (oldPass !== user.password) { alert('Current password is wrong'); return; }
    if (newPass.length < 4) { alert('New password must be at least 4 characters'); return; }
    if (newPass !== confirmPass) { alert('New passwords do not match'); return; }
    const updatedUsers = users.map((u: any) => u.id === user.id ? { ...u, password: newPass } : u);
    try {
      if (cloud.isCloudMode()) {
        await cloud.deleteUser(user.id);
        const updated = updatedUsers.find((u: any) => u.id === user.id);
        if (updated) await cloud.createUser(updated);
      }
    } catch (e) { console.error('Change password error:', e); }
    localStorage.setItem('sms_users', JSON.stringify(updatedUsers));
    setUsers(updatedUsers);
    setUser({ ...user, password: newPass });
    setOldPass(''); setNewPass(''); setConfirmPass('');
    setShowChangePassword(false);
    alert('Password changed successfully!');
  };

  // Behavior assessment hooks (must be before any return)
  const BEHAVIOR_CATEGORIES = ['Discipline', 'Punctuality', 'Attendance', 'Respectfulness', 'Responsibility', 'Class Participation', 'Cooperation', 'Neatness', 'Self-Control', 'Leadership & Initiative'];
  const BEHAVIOR_RATINGS = ['Excellent', 'Very Good', 'Good', 'Satisfactory', 'Needs Improvement'];
  const [behaviorData, setBehaviorData] = useState<Record<string, Record<string, string>>>(() => {
    try { return JSON.parse(localStorage.getItem('sms_behavior') || '{}'); } catch { return {}; }
  });
  useEffect(() => { localStorage.setItem('sms_behavior', JSON.stringify(behaviorData)); }, [behaviorData]);
  const setBehavior = (student: string, category: string, rating: string) => {
    setBehaviorData(prev => ({ ...prev, [student]: { ...(prev[student] || {}), [category]: rating } }));
  };

  if (screen === 'login') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-slate-100 flex items-center justify-center px-4">
        <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md border">
          <div className="text-center mb-6">
            {schoolLogo ? <SafeImg src={schoolLogo} alt="School Logo" className="w-20 h-20 mx-auto mb-3 object-contain" /> : <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3"><span className="text-3xl">🏫</span></div>}
            <h1 className="text-xl font-bold">{schoolNameSetting}</h1>
            <p className="text-xs text-slate-500">{districtName}</p>
            <p className="text-sm font-semibold text-slate-700 mt-1">School Management System</p>
            <p className="text-xs mt-2 px-3 py-1 rounded-lg inline-block bg-slate-50 border text-slate-600">{mode}</p>
          </div>
          <div className="space-y-4">
            <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} className="w-full border px-4 py-3 rounded-xl" />
            <div className="relative">
              <input type={showPassword ? 'text' : 'password'} placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="w-full border px-4 py-3 rounded-xl pr-12" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-sm font-semibold">
                {showPassword ? '🙈 Hide' : '👁️ Show'}
              </button>
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button onClick={login} disabled={loading} className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold disabled:opacity-50">
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
            {/* Opera Mini hint */}
            <p className="text-[10px] text-center text-slate-400 leading-tight">Best in Chrome / Opera / Firefox. Opera Mini may be slow to sign in — use "Sign In" again after 3 sec or switch to Chrome.</p>
            <p className="text-center text-xs text-gray-400">Admin: admin / admin123 | Teacher: Teacher@123 | Parent: Parent@123</p>
            <button onClick={() => setShowRecovery(!showRecovery)} className="text-xs text-indigo-500 hover:underline w-full text-center mt-2">Forgot Admin Password?</button>
            {showRecovery && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-2 mt-2">
                <p className="text-xs font-semibold text-amber-800">Enter Master Recovery Code:</p>
                <input type="password" placeholder="Recovery Code" value={recoveryCode} onChange={e => setRecoveryCode(e.target.value)} className="w-full border px-3 py-2 rounded-xl text-sm" />
                <button onClick={resetAdminPassword} className="w-full bg-amber-600 text-white py-2 rounded-xl text-sm font-semibold">Reset Admin Password</button>
                <p className="text-[10px] text-amber-600">Contact your school IT administrator for the recovery code.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Timetable now handled inside admin sidebar

  const adminMenus = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'subjects', label: 'Subjects', icon: '📚' },
    { id: 'classes', label: 'Classes & Streams', icon: '🏫' },
    { id: 'teachers', label: 'Teacher Accounts', icon: '👨‍🏫' },
    { id: 'assignments', label: 'Teaching Assignments', icon: '📋' },
    { id: 'class_teachers', label: 'Class Teachers', icon: '👥' },
    { id: 'registered', label: 'Registered Students', icon: '📝' },
    { id: 'exams', label: 'Exam Management', icon: '📝' },
    { id: 'results', label: 'Results & Approval', icon: '📈' },
    { id: 'duty', label: 'Duty Reports', icon: '📅' },
    { id: 'timetable', label: 'Timetable Schedule', icon: '🗓️' },
    { id: 'settings', label: 'School Settings', icon: '⚙️' },
  ];

  // Behavior assessment (moved here so hooks are before any return)

  const teacherMenus = [
    { id: 'my_timetable', label: 'My Timetable', icon: '🗓️' },
    ...(myClass ? [{ id: 'students', label: `Register Students (${myClass})`, icon: '📝' }] : []),
    ...(myClass ? [{ id: 'behavior', label: 'Behavior Assessment', icon: '📋' }] : []),
    { id: 'exams', label: 'Exams & Scores', icon: '📊' },
    { id: 'duty', label: 'Duty Report', icon: '📅' },
    { id: 'settings', label: 'My Account', icon: '⚙️' },
  ];

  if (screen === 'admin') {
    if (activeMenu === 'timetable') {
      return (<div className="relative"><button onClick={() => setActiveMenu('dashboard')} className="fixed top-4 right-4 z-50 px-5 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-semibold shadow-lg">← Back</button><TimetableSubsystem /></div>);
    }

    return (
      <div className="min-h-screen bg-slate-100 flex">
        {/* Sidebar */}
        <div className={`${sidebarOpen ? 'w-56' : 'w-14'} bg-slate-900 text-white min-h-screen flex flex-col transition-all duration-200 fixed left-0 top-0 z-40`}>
          <div className="p-3 border-b border-slate-700 flex items-center gap-2">
            {schoolLogo && <SafeImg src={schoolLogo} alt="Logo" className="w-8 h-8 object-contain rounded" />}
            {sidebarOpen && <div><p className="text-xs font-bold leading-tight">{schoolNameSetting.substring(0, 15)}</p><p className="text-[9px] text-slate-400">Admin Panel</p></div>}
          </div>
          <nav className="flex-1 py-2 overflow-y-auto">
            {adminMenus.map(m => (
              <button key={m.id} onClick={() => setActiveMenu(m.id)} className={`w-full flex items-center gap-2 px-3 py-2.5 text-xs font-medium transition-all ${activeMenu === m.id ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
                <span className="text-sm">{m.icon}</span>
                {sidebarOpen && <span>{m.label}</span>}
              </button>
            ))}
          </nav>
          <div className="p-2 border-t border-slate-700">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="w-full text-center text-slate-500 text-xs py-1 hover:text-white">{sidebarOpen ? '◀' : '▶'}</button>
          </div>
        </div>

        {/* Main Content */}
        <div className={`flex-1 ${sidebarOpen ? 'ml-56' : 'ml-14'} transition-all duration-200`}>
          <div className="bg-white border-b px-6 py-3 flex justify-between items-center sticky top-0 z-30">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold">{adminMenus.find(m => m.id === activeMenu)?.icon} {adminMenus.find(m => m.id === activeMenu)?.label}</span>
              <span className="text-xs text-slate-400">— {mode}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">Welcome, <strong>{user?.name}</strong></span>
              <button onClick={() => setShowChangePassword(!showChangePassword)} className="px-2 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold">🔑</button>
              <button onClick={logout} className="px-3 py-1.5 bg-red-500 text-white rounded-lg text-xs font-semibold">Logout</button>
            </div>
          </div>
        {showChangePassword && (
          <div className="bg-amber-50 border-b border-amber-200 px-6 py-4">
            <div className="max-w-md mx-auto space-y-2">
              <h3 className="font-bold text-sm">Change Password</h3>
              <input type="password" placeholder="Current password" value={oldPass} onChange={e => setOldPass(e.target.value)} className="w-full border px-3 py-2 rounded-xl text-sm" />
              <input type="password" placeholder="New password" value={newPass} onChange={e => setNewPass(e.target.value)} className="w-full border px-3 py-2 rounded-xl text-sm" />
              <input type="password" placeholder="Confirm new password" value={confirmPass} onChange={e => setConfirmPass(e.target.value)} className="w-full border px-3 py-2 rounded-xl text-sm" />
              <div className="flex gap-2">
                <button onClick={changePassword} className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-xs font-semibold">Save New Password</button>
                <button onClick={() => { setShowChangePassword(false); setOldPass(''); setNewPass(''); setConfirmPass(''); }} className="bg-slate-200 text-slate-700 px-4 py-2 rounded-xl text-xs font-semibold">Cancel</button>
              </div>
            </div>
          </div>
        )}
        <div className="p-6 max-w-6xl mx-auto space-y-6">

          {/* DASHBOARD */}
          {activeMenu === 'dashboard' && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl border">
                <h2 className="font-bold text-xl mb-2">📊 Admin Dashboard</h2>
                <p className="text-sm text-slate-500">Welcome to {schoolNameSetting} Management System</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="bg-white p-5 rounded-2xl border cursor-pointer hover:shadow-md" onClick={() => setActiveMenu('classes')}><p className="text-xs uppercase text-slate-500">Classes</p><p className="text-3xl font-bold">{schoolClasses.length}</p></div>
                <div className="bg-white p-5 rounded-2xl border cursor-pointer hover:shadow-md" onClick={() => setActiveMenu('subjects')}><p className="text-xs uppercase text-slate-500">Subjects</p><p className="text-3xl font-bold">{schoolSubjects.length}</p></div>
                <div className="bg-white p-5 rounded-2xl border cursor-pointer hover:shadow-md" onClick={() => setActiveMenu('teachers')}><p className="text-xs uppercase text-slate-500">Teachers</p><p className="text-3xl font-bold">{teachers.length}</p></div>
                <div className="bg-white p-5 rounded-2xl border cursor-pointer hover:shadow-md" onClick={() => setActiveMenu('results')}><p className="text-xs uppercase text-slate-500">Scores</p><p className="text-3xl font-bold">{scores.length}</p></div>
                <div className="bg-white p-5 rounded-2xl border cursor-pointer hover:shadow-md" onClick={() => setActiveMenu('duty')}><p className="text-xs uppercase text-slate-500">Duty Reports</p><p className="text-3xl font-bold">{duties.length}</p></div>
              </div>
            </div>
          )}

          {/* SETTINGS */}
          {activeMenu === 'settings' && (<div className="space-y-4">

          {/* School Info */}
          <div className="bg-white p-6 rounded-2xl border space-y-4">
            <h2 className="font-bold text-lg">School Information</h2>
            <p className="text-xs text-slate-500">These details appear on all printed documents (report cards, duty reports, timetables, general results).</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase mb-1 block">School Name</label>
                <input value={schoolNameSetting} onChange={e => { setSchoolNameSetting(e.target.value); localStorage.setItem('sms_school_name_setting', e.target.value); }} className="w-full border px-3 py-2 rounded-xl text-sm font-semibold" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase mb-1 block">District / Council Name</label>
                <input value={districtName} onChange={e => { setDistrictName(e.target.value); localStorage.setItem('sms_district_name', e.target.value); }} className="w-full border px-3 py-2 rounded-xl text-sm" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase mb-1 block">School Address (Report Card)</label>
                <input value={schoolAddress} onChange={e => { setSchoolAddress(e.target.value); localStorage.setItem('sms_school_address', e.target.value); }} className="w-full border px-3 py-2 rounded-xl text-sm" placeholder="e.g. P.O. Box 51, Ruangwa - Lindi" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase mb-1 block">School Motto</label>
                <input value={schoolMotto} onChange={e => { setSchoolMotto(e.target.value); localStorage.setItem('sms_school_motto', e.target.value); }} className="w-full border px-3 py-2 rounded-xl text-sm" placeholder="e.g. Honor All Build Together" />
              </div>
            </div>
          </div>

          {/* Logo */}
          <div className="bg-white p-4 rounded-2xl border flex items-center justify-between">
            <div className="flex items-center gap-4">
              {schoolLogo ? <SafeImg src={schoolLogo} alt="Logo" className="w-16 h-16 object-contain border rounded-xl p-1" /> : <div className="w-16 h-16 bg-slate-100 rounded-xl flex items-center justify-center text-2xl">🏫</div>}
              <div>
                <h3 className="font-bold text-sm">School Logo</h3>
                <p className="text-xs text-slate-500">Upload your school logo</p>
              </div>
            </div>
            <label className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-semibold cursor-pointer hover:bg-indigo-700">
              Upload Logo
              <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
            </label>
          </div>

          {/* Officials */}
          <div className="bg-white p-6 rounded-2xl border space-y-4">
            <h2 className="font-bold text-lg">School Officials</h2>
            <p className="text-xs text-slate-500">Names and signatures appear on report cards and duty reports.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3 border rounded-xl p-4">
                <h3 className="font-bold text-sm">Academic Master</h3>
                <input placeholder="Academic Master Name" value={academicName} onChange={e => { setAcademicName(e.target.value); localStorage.setItem('sms_academic_name', e.target.value); }} className="w-full border px-3 py-2 rounded-xl text-sm" />
                <div className="flex items-center gap-3">
                  {academicSig ? <SafeImg src={academicSig} alt="Signature" className="h-12 border rounded p-1" /> : <span className="text-xs text-slate-400">No signature</span>}
                  <label className="px-3 py-1.5 bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer">Upload Signature<input type="file" accept="image/*" onChange={e => { const f = e.target.files?.[0]; if (!f) return; const r = new FileReader(); r.onloadend = () => { const b = r.result as string; setAcademicSig(b); localStorage.setItem('sms_academic_sig', b); }; r.readAsDataURL(f); }} className="hidden" /></label>
                </div>
              </div>
              <div className="space-y-3 border rounded-xl p-4">
                <h3 className="font-bold text-sm">Headmaster</h3>
                <input placeholder="Headmaster Name" value={headmasterName} onChange={e => { setHeadmasterName(e.target.value); localStorage.setItem('sms_headmaster_name', e.target.value); }} className="w-full border px-3 py-2 rounded-xl text-sm" />
                <div className="flex items-center gap-3">
                  {headmasterSig ? <SafeImg src={headmasterSig} alt="Signature" className="h-12 border rounded p-1" /> : <span className="text-xs text-slate-400">No signature</span>}
                  <label className="px-3 py-1.5 bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer">Upload Signature<input type="file" accept="image/*" onChange={e => { const f = e.target.files?.[0]; if (!f) return; const r = new FileReader(); r.onloadend = () => { const b = r.result as string; setHeadmasterSig(b); localStorage.setItem('sms_headmaster_sig', b); }; r.readAsDataURL(f); }} className="hidden" /></label>
                </div>
              </div>
            </div>
          </div>
          </div>)}

          {/* Subject Management */}
          {activeMenu === 'subjects' && (<>
          <div className="bg-white p-6 rounded-2xl border">
            <h2 className="font-bold text-lg mb-2">School Subjects ({schoolSubjects.length})</h2>
            <p className="text-xs text-slate-500 mb-3">Add subjects with code (e.g., Mathematics — <b>MATH</b>). Code appears on timetable & general results instead of full name. These appear in timetable, teacher assignments, and student registration.</p>
            <div className="flex gap-2 mb-3">
              <input placeholder="Subject name (e.g. Mathematics)" value={newSubjectName} onChange={e => setNewSubjectName(e.target.value)} className="flex-1 border px-3 py-2 rounded-xl text-sm" />
              <input placeholder="Code (e.g. MATH)" value={newSubjectCode} onChange={e => setNewSubjectCode(e.target.value.toUpperCase())} className="w-28 border px-3 py-2 rounded-xl text-sm font-mono font-bold" maxLength={6} />
              <button onClick={addSchoolSubject} className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-semibold">+ Add</button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {schoolSubjects.map(sub => (
                <span key={sub} className="inline-flex items-center gap-1 px-3 py-1.5 bg-indigo-100 text-indigo-800 rounded-lg text-xs font-semibold border">
                  <span className="bg-white px-1.5 py-0.5 rounded font-mono text-[11px] border">{getSubjectCode(sub)}</span> {sub}
                  <button onClick={() => removeSchoolSubject(sub)} className="text-red-500 font-bold hover:text-red-700 ml-1">✕</button>
                </span>
              ))}
            </div>
            {schoolSubjects.length===0 && <p className="text-xs text-amber-600 mt-2">No subjects yet — add at least one with code.</p>}
          </div>
          </>)}

          {/* Class Management */}
          {activeMenu === 'classes' && (<>
          <div className="bg-white p-6 rounded-2xl border">
            <h2 className="font-bold text-lg mb-2">School Classes & Streams ({schoolClasses.length})</h2>
            <p className="text-xs text-slate-500 mb-3">Register classes with streams. Format: Form IA, Form IB, etc. These appear in timetable, teacher assignments, and student registration.</p>
            <div className="flex gap-2 mb-3">
              <input placeholder="Class name (e.g. Form VA)" value={newClassName} onChange={e => setNewClassName(e.target.value)} className="flex-1 border px-3 py-2 rounded-xl text-sm" />
              <button onClick={() => {
                if (!newClassName.trim()) return;
                if (schoolClasses.includes(newClassName.trim())) { alert('Class already exists'); return; }
                const updatedClasses = [...schoolClasses, newClassName.trim()].sort();
                localStorage.setItem('sms_school_classes', JSON.stringify(updatedClasses));
                localStorage.setItem('tt_shared_classes', JSON.stringify(updatedClasses));
                localStorage.setItem('sms_school_classes_ts', String(Date.now()));
                setSchoolClasses(updatedClasses);
                if (cloud.isCloudMode()) cloud.syncToCloud().catch(() => {});
                setNewClassName('');
              }} className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-semibold">+ Add</button>
              <button onClick={() => {
                if (schoolClasses.length === 0) { alert('No classes to clear'); return; }
                if (!confirm('Futa madarasa yote ya mwanzo (' + schoolClasses.length + ') na ubaki na yaliyoandikwa upya tu?')) return;
                localStorage.setItem('sms_school_classes', '[]');
                localStorage.setItem('tt_shared_classes', '[]');
                localStorage.setItem('sms_school_classes_ts', String(Date.now()));
                setSchoolClasses([]);
                if (cloud.isCloudMode()) cloud.syncToCloud().catch(() => {});
              }} className="bg-white border border-red-200 text-red-600 px-3 py-2 rounded-xl text-xs font-bold hover:bg-red-50" title="Futa yote ya mwanzo">🗑️ Clear All</button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {schoolClasses.map(cls => (
                <span key={cls} className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-100 text-emerald-800 rounded-lg text-xs font-semibold">
                  {cls}
                  <button onClick={() => {
                    const updatedClasses = schoolClasses.filter(c => c !== cls);
                    localStorage.setItem('sms_school_classes', JSON.stringify(updatedClasses));
                    localStorage.setItem('tt_shared_classes', JSON.stringify(updatedClasses));
                    localStorage.setItem('sms_school_classes_ts', String(Date.now()));
                    setSchoolClasses(updatedClasses);
                    if (cloud.isCloudMode()) cloud.syncToCloud().catch(() => {});
                  }} className="text-red-500 font-bold hover:text-red-700 ml-1">✕</button>
                </span>
              ))}
            </div>
          </div>
          </>)}

          {activeMenu === 'teachers' && (<>
          <div className="bg-white p-6 rounded-2xl border">
            <h2 className="font-bold text-lg mb-4">Create Teacher Account</h2>
            <p className="text-xs text-slate-500 mb-3">Default password for all new teachers: <strong className="font-mono bg-slate-100 px-2 py-0.5 rounded">Teacher@123</strong></p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input placeholder="Full Name" value={newTeacher.name} onChange={e => setNewTeacher({...newTeacher, name: e.target.value})} className="border px-3 py-2.5 rounded-xl" />
              <input placeholder="Username" value={newTeacher.username} onChange={e => setNewTeacher({...newTeacher, username: e.target.value})} className="border px-3 py-2.5 rounded-xl" />
            </div>
            <div className="mt-3">
              <p className="text-xs font-semibold text-slate-500 uppercase mb-2">Select Subjects for this Teacher:</p>
              <div className="flex flex-wrap gap-2">
                {ALL_SUBJECTS.map(sub => (
                  <button key={sub} type="button" onClick={() => toggleSubject(sub)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${newTeacher.subjects.includes(sub) ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-700 border-slate-300 hover:border-indigo-400'}`}>
                    {newTeacher.subjects.includes(sub) ? '✓ ' : ''}{sub} ({getSubjectCode(sub)})
                  </button>
                ))}
              </div>
              {newTeacher.subjects.length > 0 && <p className="text-xs text-indigo-600 mt-2 font-semibold">Selected: {newTeacher.subjects.join(', ')}</p>}
            </div>
            <button onClick={createTeacher} disabled={loading} className="mt-4 bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-semibold disabled:opacity-50">{loading ? 'Creating...' : 'Create Teacher'}</button>
          </div>
          <div className="bg-white p-6 rounded-2xl border">
            <h2 className="font-bold text-lg mb-3">Teachers ({teachers.length})</h2>
            {teachers.length === 0 ? <p className="text-sm text-slate-500">No teachers yet.</p> : teachers.map((t: any) => {
              const assignedClass = Object.entries(classTeachers).find(([_, tid]) => tid === t.id)?.[0];
              const isEditing = editingTeacherId === t.id;
              return (
                <div key={t.id} className="border-b py-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold">{t.name}</p>
                      <p className="text-xs text-slate-500">Username: {t.username}{assignedClass ? ` | Class Teacher: ${assignedClass}` : ''}</p>
                      <p className="text-xs text-slate-500">Subjects: {(t.subjects||[]).join(', ')||'None'}</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => isEditing ? setEditingTeacherId(null) : startEditSubjects(t)} className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-semibold border border-indigo-200">
                        {isEditing ? 'Cancel' : '✏️ Edit'}
                      </button>
                      <button onClick={async () => {
                        const updated = users.map((u: any) => u.id === t.id ? { ...u, password: 'Teacher@123' } : u);
                        localStorage.setItem('sms_users', JSON.stringify(updated));
                        setUsers(updated);
                        try { if (cloud.isCloudMode()) { await cloud.deleteUser(t.id); await cloud.createUser(updated.find((u: any) => u.id === t.id)); } } catch {}
                        alert(`Password reset to Teacher@123 for ${t.name}`);
                      }} className="px-3 py-1 bg-amber-50 text-amber-700 rounded-lg text-xs font-semibold border border-amber-200">🔑 Reset Password</button>
                      <button onClick={() => deleteTeacher(t.id)} className="px-3 py-1 bg-red-50 text-red-600 rounded-lg text-xs font-semibold border border-red-200">Remove</button>
                    </div>
                  </div>
                  {isEditing && (
                    <div className="mt-3 p-3 bg-indigo-50 rounded-xl border border-indigo-200 space-y-3">
                      <div>
                        <p className="text-xs font-semibold text-indigo-700 mb-1">Edit name for {t.name}:</p>
                        <input value={editTeacherName} onChange={e=>setEditTeacherName(e.target.value)} placeholder="Full Name" className="w-full border px-3 py-2 rounded-xl text-sm bg-white" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-indigo-700 mb-2">Edit subjects for {editTeacherName || t.name}:</p>
                        <div className="flex flex-wrap gap-1.5">
                          {ALL_SUBJECTS.map(sub => (
                            <button key={sub} type="button" onClick={() => toggleEditSubject(sub)} className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all ${editSubjects.includes(sub) ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-700 border-slate-300'}`}>
                              {editSubjects.includes(sub) ? '✓ ' : ''}{sub} <span className="opacity-60 text-[10px]">({getSubjectCode(sub)})</span>
                            </button>
                          ))}
                        </div>
                      </div>
                      <button onClick={saveEditSubjects} disabled={loading} className="bg-indigo-600 text-white px-4 py-1.5 rounded-lg text-xs font-semibold disabled:opacity-50">
                        {loading ? 'Saving...' : 'Save Changes'}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          </>)}

          {/* Assign Class Teachers */}
          {activeMenu === 'class_teachers' && (
          <div className="bg-white p-6 rounded-2xl border">
            <h2 className="font-bold text-lg mb-2">Assign Class Teachers</h2>
            <p className="text-xs text-slate-500 mb-4">Select a teacher for each class. Only class teachers can register students.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {CLASSES.map(cls => (
                <div key={cls} className="flex items-center gap-3 border rounded-xl p-3">
                  <span className="font-bold text-sm min-w-[80px]">{cls}</span>
                  <select value={classTeachers[cls] || ''} onChange={e => assignClassTeacher(cls, e.target.value)} className="flex-1 border px-2 py-1.5 rounded-lg text-sm">
                    <option value="">-- Not Assigned --</option>
                    {teachers.map((t: any) => <option key={t.id} value={t.id}>{t.name}</option>)}
                  </select>
                </div>
              ))}
            </div>
          </div>
          )}

          {/* Assign Teaching Classes & Subjects */}
          {activeMenu === 'assignments' && (
          <div className="bg-white p-6 rounded-2xl border">
            <h2 className="font-bold text-lg mb-2">Assign Classes & Subjects to Teachers</h2>
            <p className="text-xs text-slate-500 mb-4">Assign which class and subject each teacher teaches. Teachers will only see their assigned classes when entering scores.</p>
            {teachers.length === 0 ? <p className="text-sm text-slate-500">Create teachers first.</p> :
              teachers.map((t: any) => {
                const assignments = teachingAssignments[t.id] || [];
                return (
                  <div key={t.id} className="border rounded-xl p-4 mb-3">
                    <p className="font-bold text-sm">{t.name}</p>
                    <p className="text-xs text-slate-500 mb-2">Qualified: {(t.subjects || []).join(', ') || 'None'}</p>

                    {/* Current assignments */}
                    {assignments.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {assignments.map((a, i) => (
                          <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-100 text-indigo-800 rounded-lg text-xs font-semibold">
                            {a.cls} — {a.sub}
                            <button onClick={() => removeTeachingAssignment(t.id, a.cls, a.sub)} className="text-red-500 font-bold hover:text-red-700 ml-1">✕</button>
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Add new assignment */}
                    <div className="flex gap-2 items-end">
                      <select id={`cls-${t.id}`} className="border px-2 py-1.5 rounded-lg text-xs flex-1">
                        <option value="">Class...</option>
                        {CLASSES.map(c => <option key={c}>{c}</option>)}
                      </select>
                      <select id={`sub-${t.id}`} className="border px-2 py-1.5 rounded-lg text-xs flex-1">
                        <option value="">Subject...</option>
                        {(t.subjects || []).map((s: string) => <option key={s}>{s}</option>)}
                      </select>
                      <button onClick={() => {
                        const clsEl = document.getElementById(`cls-${t.id}`) as HTMLSelectElement;
                        const subEl = document.getElementById(`sub-${t.id}`) as HTMLSelectElement;
                        if (clsEl?.value && subEl?.value) {
                          addTeachingAssignment(t.id, clsEl.value, subEl.value);
                          clsEl.value = '';
                          subEl.value = '';
                        }
                      }} className="bg-indigo-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap">+ Add</button>
                    </div>
                  </div>
                );
              })
            }
          </div>
          )}

          {activeMenu === 'registered' && <AdminRegisteredStudents />}

          {/* Exam Management */}
          {activeMenu === 'exams' && (
          <div className="bg-white p-6 rounded-2xl border">
            <h2 className="font-bold text-lg mb-2">Exam Management</h2>
            <p className="text-xs text-slate-500 mb-4">Create exams with deadlines. Teachers will see these exams and enter scores before the deadline.</p>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
              <input placeholder="Exam name (e.g. Mid-Term Exam)" value={newExam.name} onChange={e => setNewExam({...newExam, name: e.target.value})} className="border px-3 py-2.5 rounded-xl" />
              <select value={newExam.term} onChange={e => setNewExam({...newExam, term: e.target.value})} className="border px-3 py-2.5 rounded-xl">
                {terms.map(t => <option key={t}>{t}</option>)}
              </select>
              <input type="datetime-local" value={newExam.deadline} onChange={e => setNewExam({...newExam, deadline: e.target.value})} className="border px-3 py-2.5 rounded-xl" />
              <button onClick={createExam} className="bg-indigo-600 text-white px-4 py-2.5 rounded-xl font-semibold">Create Exam</button>
            </div>

            {exams.length === 0 ? <p className="text-sm text-slate-500">No exams created yet.</p> :
              exams.map((ex: any) => {
                const timeLeft = getTimeRemaining(ex.deadline);
                const isOpen = new Date(ex.deadline) > new Date();
                // Find teachers who submitted scores for this exam
                const submittedTeachers = [...new Set(scores.filter((s: any) => s.exam_id === ex.id).map((s: any) => s.teacher_name))];
                const notSubmitted = teachers.filter((t: any) => !submittedTeachers.includes(t.name));

                return (
                  <div key={ex.id} className={`border rounded-xl p-4 mb-3 ${isOpen ? 'border-emerald-200 bg-emerald-50/30' : 'border-red-200 bg-red-50/30'}`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-bold text-slate-900">{ex.name}</p>
                        <p className="text-xs text-slate-500">{ex.term} | Deadline: {new Date(ex.deadline).toLocaleString()}</p>
                        <p className={`text-xs font-semibold mt-1 ${isOpen ? 'text-emerald-600' : 'text-red-600'}`}>
                          {isOpen ? `⏰ ${timeLeft}` : '❌ Expired'}
                        </p>
                      </div>
                      <button onClick={() => deleteExam(ex.id)} className="px-2 py-1 bg-red-50 text-red-600 rounded-lg text-xs font-semibold border border-red-200">Delete</button>
                    </div>

                    {/* Submission status */}
                    <div className="mt-3 text-xs">
                      <p className="font-semibold text-slate-700">Submitted: {submittedTeachers.length}/{teachers.length}</p>
                      {notSubmitted.length > 0 && (
                        <div className="mt-2">
                          <p className="text-slate-500 mb-1">Not submitted:</p>
                          {notSubmitted.map((t: any) => {
                            const ext = ex.extensions?.[t.id];
                            return (
                              <div key={t.id} className="flex items-center gap-2 mb-1">
                                <span className="text-red-600">{t.name}</span>
                                {ext && <span className="text-xs text-indigo-600">Extended to: {new Date(ext).toLocaleString()}</span>}
                                <input type="datetime-local" className="border px-1 py-0.5 rounded text-xs" onChange={e => { if (e.target.value) extendDeadline(ex.id, t.id, e.target.value); }} />
                                <span className="text-slate-400 text-[10px]">Extend</span>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            }
          </div>
          )}

          {activeMenu === 'results' && (
          <div className="bg-white p-6 rounded-2xl border">
            <h2 className="font-bold text-lg mb-3">Result Approval & Viewing</h2>

            {/* Select Exam and Class */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase mb-1 block">Select Exam</label>
                <select value={viewExamId} onChange={e => { setViewExamId(e.target.value); setViewClass(''); }} className="w-full border px-3 py-2.5 rounded-xl">
                  <option value="">-- Select Exam --</option>
                  {exams.map((ex: any) => <option key={ex.id} value={ex.id}>{ex.name} ({ex.term})</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase mb-1 block">View Mode</label>
                <select value={viewClass} onChange={e => setViewClass(e.target.value)} className="w-full border px-3 py-2.5 rounded-xl">
                  <option value="">-- All Classes (General) --</option>
                  {[...new Set(CLASSES.map(c => c.replace(/\s*[A-C]$/, '')))].map(form => (
                    <option key={form} value={`__${form.replace(/\s/g, '_')}`}>{form} (All Streams)</option>
                  ))}
                  {CLASSES.map(c => <option key={c} value={c}>{c} (Stream)</option>)}
                </select>
              </div>
              <div className="flex items-end">
                {/* Approval */}
                {viewExamId && (() => {
                  const ex = exams.find((e: any) => e.id === viewExamId);
                  if (!ex) return null;
                  const examScoresAll = scores.filter((s: any) => s.exam_id === viewExamId);
                  const allSubjects = [...new Set(examScoresAll.map((s: any) => s.subject))];
                  const canApprove = allSubjects.length >= 7;
                  const isReleased = released.includes(ex.term);

                  return isReleased ? (
                    <span className="text-xs bg-emerald-100 text-emerald-700 px-4 py-2.5 rounded-xl font-semibold w-full text-center block">✅ {ex.term} Released</span>
                  ) : (
                    <div className="w-full">
                      <button onClick={() => { if (canApprove) releaseResults(ex.term); else alert(`Cannot approve! Only ${allSubjects.length} subjects submitted. Minimum 7 required.`); }} disabled={loading || !canApprove} className={`w-full px-4 py-2.5 rounded-xl font-semibold text-sm ${canApprove ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-500 cursor-not-allowed'}`}>
                        {canApprove ? 'Approve & Release' : `Need ${7 - allSubjects.length} more subjects`}
                      </button>
                      <p className="text-[10px] text-slate-400 mt-1 text-center">{allSubjects.length}/7 subjects submitted</p>
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* Results Table */}
            {(() => {
              if (!viewExamId) return <p className="text-sm text-slate-500">Select an exam to view results.</p>;

              let filtered = scores.filter((s: any) => s.exam_id === viewExamId);
              const examName = exams.find((e: any) => e.id === viewExamId)?.name || '';

              // Determine which classes to show
              let classesToShow: string[] = [];
              if (viewClass === '') {
                classesToShow = CLASSES;
              } else if (viewClass.startsWith('__FORM_')) {
                const form = viewClass.replace('__', '');
                classesToShow = CLASSES.filter(c => c.startsWith(form.replace('_', ' ')));
              } else {
                classesToShow = [viewClass];
              }

              // Get all students and scores for these classes
              let allStudentRows: { student: string; cls: string; scores: Record<string, number | null>; total: number; avg: number; rank?: number }[] = [];
              const allSubjects = [...new Set(filtered.map((s: any) => s.subject))].sort();

              classesToShow.forEach(cls => {
                const studentNames = getStudentNames(cls);
                const classScores = filtered.filter((s: any) => s.class_name === cls);

                studentNames.forEach(student => {
                  const sScores: Record<string, number | null> = {};
                  allSubjects.forEach(sub => {
                    const sc = classScores.find((s: any) => s.student_name === student && s.subject === sub);
                    sScores[sub] = sc ? Number(sc.score) : null;
                  });
                  const valid = Object.values(sScores).filter(v => v !== null) as number[];
                  const total = valid.reduce((a, b) => a + b, 0);
                  const avg = valid.length > 0 ? total / (valid.length * 100) * 100 : 0;
                  allStudentRows.push({ student, cls, scores: sScores, total, avg });
                });
              });

              // Grading system
              const getGrade = (score: number): string => score >= 75 ? 'A' : score >= 65 ? 'B' : score >= 45 ? 'C' : score >= 30 ? 'D' : 'F';
              const getPoint = (score: number): number => score >= 75 ? 1 : score >= 65 ? 2 : score >= 45 ? 3 : score >= 30 ? 4 : 5;
              const getDivision = (totalPoints: number): string => {
                if (totalPoints >= 7 && totalPoints <= 17) return 'I';
                if (totalPoints >= 18 && totalPoints <= 21) return 'II';
                if (totalPoints >= 22 && totalPoints <= 25) return 'III';
                if (totalPoints >= 26 && totalPoints <= 33) return 'IV';
                return '0';
              };

              // Calculate points and division for each student
              allStudentRows.forEach(r => {
                const validScores = Object.values(r.scores).filter(v => v !== null) as number[];
                const points = validScores.map(s => getPoint(s));
                // Best 7 subjects (lowest points = best)
                const best7 = points.sort((a, b) => a - b).slice(0, 7);
                (r as any).totalPoints = best7.reduce((a, b) => a + b, 0);
                (r as any).division = validScores.length >= 7 ? getDivision((r as any).totalPoints) : '-';
                (r as any).letterGrade = getGrade(r.avg);
              });

              // Sort by total points ascending (best first), then by total score descending
              allStudentRows.sort((a, b) => {
                const pA = (a as any).totalPoints || 99;
                const pB = (b as any).totalPoints || 99;
                if (pA !== pB) return pA - pB;
                return b.total - a.total;
              });
              allStudentRows.forEach((r, i) => { r.rank = i + 1; });

              if (allStudentRows.length === 0) return <p className="text-sm text-slate-500">No students found for this selection.</p>;

              const printResults = (orientation: string) => {
                const pw = window.open('', '', 'width=1000,height=800');
                if (!pw) return;
                const logo = localStorage.getItem('sms_school_logo') || '';
                const useA3 = allSubjects.length > 8;
                const size = useA3 ? `A3 ${orientation}` : `A4 ${orientation}`;
                const fontSize = orientation === 'portrait' ? '11px' : '12px';
                const thFontSize = orientation === 'portrait' ? '10px' : '11px';
                pw.document.write(`<!DOCTYPE html><html><head><title>\u00A0</title><style>
                  @page { size: ${size}; margin: 8mm 10mm 6mm 10mm; }
                  @page { @top-left { content: ''; } @top-right { content: ''; } @bottom-left { content: ''; } @bottom-right { content: ''; } }
                  * { margin:0; padding:0; box-sizing:border-box; }
                  body { font-family: 'Arial', 'Helvetica', sans-serif; font-size: ${fontSize}; color: #000; }
                  table { width:100%; border-collapse:collapse; page-break-inside:auto; }
                  tr { page-break-inside:avoid; page-break-after:auto; }
                  thead { display:table-header-group; }
                  th,td { border:1px solid #000; padding:3px 4px; text-align:center; font-size: ${thFontSize}; }
                  .total-row td { font-weight:bold; border:2px solid #000; }
                  .header { text-align:center; margin-bottom:8px; }
                  .header img { height:50px; margin-bottom:3px; }
                  .pass { color: green; font-weight:bold; } .fail { color: red; font-weight:bold; }
                  @media print { body { -webkit-print-color-adjust:exact; print-color-adjust:exact; } }
                </style></head><body><div class="header">`);
                if (logo) pw.document.write(`<img src="${logo}" />`);
                pw.document.write(`<div style="font-size:14px;font-weight:bold;letter-spacing:1px">${districtName}</div>
                  <div style="font-size:18px;font-weight:bold;letter-spacing:1px">${schoolNameSetting}</div>
                  <div style="font-size:14px;font-weight:bold;text-decoration:underline;margin:3px 0">${examName} — GENERAL RESULTS</div>
                  <div style="font-size:12px">${viewClass.startsWith('__') ? viewClass.replace('__', '').replace(/_/g, ' ') : viewClass || 'All Classes'}</div></div>`);
                // Table header - subject columns show score AND grade
                pw.document.write(`<table><thead><tr style="background:#d4edda">`);
                pw.document.write(`<th style="font-size:${thFontSize}" rowspan="2">S/N</th>`);
                pw.document.write(`<th style="text-align:left;font-size:${thFontSize}" rowspan="2">Student Name</th>`);
                allSubjects.forEach(s => pw.document.write(`<th style="font-size:8px" colspan="2">${getSubjectCode(s)}</th>`));
                pw.document.write(`<th style="font-size:${thFontSize}" rowspan="2">Total<br/>Points</th>`);
                pw.document.write(`<th style="font-size:${thFontSize}" rowspan="2">Student<br/>Average</th>`);
                pw.document.write(`<th style="font-size:${thFontSize}" rowspan="2">Letter<br/>Grade</th>`);
                pw.document.write(`<th style="font-size:${thFontSize}" rowspan="2">Position</th>`);
                pw.document.write(`<th style="font-size:${thFontSize}" rowspan="2">Points</th>`);
                pw.document.write(`<th style="font-size:${thFontSize}" rowspan="2">Division</th>`);
                pw.document.write(`</tr><tr style="background:#d4edda">`);
                allSubjects.forEach(() => pw.document.write(`<th style="font-size:7px">100</th><th style="font-size:7px"></th>`));
                pw.document.write(`</tr></thead><tbody>`);
                allStudentRows.forEach(r => {
                  const rr = r as any;
                  pw.document.write(`<tr><td style="font-weight:bold">${r.rank}</td><td style="text-align:left;font-weight:bold;white-space:nowrap">${r.student}</td>`);
                  allSubjects.forEach(sub => {
                    const v = r.scores[sub];
                    if (v !== null) {
                      const g = getGrade(v);
                      const color = v >= 45 ? 'green' : 'red';
                      pw.document.write(`<td style="color:${color}">${v}</td><td style="font-weight:bold;color:${color}">${g}</td>`);
                    } else {
                      pw.document.write(`<td style="color:#ccc">—</td><td></td>`);
                    }
                  });
                  pw.document.write(`<td style="font-weight:bold">${r.total.toFixed(2)}</td>`);
                  pw.document.write(`<td style="font-weight:bold">${r.avg.toFixed(2)}</td>`);
                  pw.document.write(`<td style="font-weight:bold">${rr.letterGrade}</td>`);
                  pw.document.write(`<td style="font-weight:bold">${r.rank}</td>`);
                  pw.document.write(`<td style="font-weight:bold">${rr.totalPoints}</td>`);
                  pw.document.write(`<td style="font-weight:bold">${rr.division}</td>`);
                  pw.document.write(`</tr>`);
                });
                pw.document.write(`</tbody></table>`);

                // SUMMARY TABLES
                pw.document.write(`<div style="display:flex;gap:20px;margin-top:15px;page-break-inside:avoid">`);

                // SUBJECT PERFORMANCE TABLE with GPA and RANK
                const subjectStats = allSubjects.map(sub => {
                  const subScores = allStudentRows.map(r => r.scores[sub]).filter(v => v !== null) as number[];
                  const total = subScores.length;
                  const passCount = subScores.filter(s => s >= 30).length;
                  const failCount = subScores.filter(s => s < 30).length;
                  const aCount = subScores.filter(s => s >= 75).length;
                  const bCount = subScores.filter(s => s >= 65 && s < 75).length;
                  const cCount = subScores.filter(s => s >= 45 && s < 65).length;
                  const dCount = subScores.filter(s => s >= 30 && s < 45).length;
                  const fCount = subScores.filter(s => s < 30).length;
                  const gpa = total > 0 ? (subScores.reduce((a, b) => a + getPoint(b), 0) / total) : 0;
                  return { sub, total, passCount, failCount, aCount, bCount, cCount, dCount, fCount, gpa };
                }).filter(s => s.total > 0).sort((a, b) => a.gpa - b.gpa);

                pw.document.write(`<div style="display:flex;gap:15px;margin-top:12px;page-break-inside:avoid">`);
                pw.document.write(`<div style="flex:2"><table><thead><tr style="background:#d4edda"><th colspan="10" style="text-align:left;font-size:12px;font-weight:bold">SUBJECT PERFORMANCE</th></tr><tr style="background:#e8e8e8"><th style="text-align:left;font-size:10px">SUBJECT NAME</th><th style="font-size:10px">PASS</th><th style="font-size:10px">FAIL</th><th style="font-size:10px">A</th><th style="font-size:10px">B</th><th style="font-size:10px">C</th><th style="font-size:10px">D</th><th style="font-size:10px">F</th><th style="font-size:10px">GPA</th><th style="font-size:10px">RANK</th></tr></thead><tbody>`);
                subjectStats.forEach((s, idx) => {
                  const passPct = s.total > 0 ? ((s.passCount / s.total) * 100).toFixed(0) : '0';
                  const failPct = s.total > 0 ? ((s.failCount / s.total) * 100).toFixed(0) : '0';
                  pw.document.write(`<tr><td style="text-align:left;font-size:10px;font-weight:bold">${s.sub.toUpperCase()}</td><td style="font-size:10px">${passPct}%</td><td style="font-size:10px">${failPct}%</td><td style="font-size:10px;color:green">${s.aCount}</td><td style="font-size:10px;color:green">${s.bCount}</td><td style="font-size:10px">${s.cCount}</td><td style="font-size:10px;color:orange">${s.dCount}</td><td style="font-size:10px;color:red">${s.fCount}</td><td style="font-size:10px;font-weight:bold">${s.gpa.toFixed(1)}</td><td style="font-size:10px;font-weight:bold">${idx + 1}</td></tr>`);
                });
                pw.document.write(`</tbody></table></div>`);

                // DIVISION PERFORMANCE TABLE - ABS = students with 0 exams
                const divI = allStudentRows.filter(r => (r as any).division === 'I').length;
                const divII = allStudentRows.filter(r => (r as any).division === 'II').length;
                const divIII = allStudentRows.filter(r => (r as any).division === 'III').length;
                const divIV = allStudentRows.filter(r => (r as any).division === 'IV').length;
                const div0 = allStudentRows.filter(r => (r as any).division === '0').length;
                // ABS = students registered but didn't do any exam (all scores null)
                const divAbs = allStudentRows.filter(r => Object.values(r.scores).every(v => v === null)).length;
                const divTotal = allStudentRows.length;

                pw.document.write(`<div style="flex:1"><table><thead><tr style="background:#d4edda"><th colspan="8" style="text-align:left;font-size:12px;font-weight:bold">DIVISION PERFORMANCE</th></tr><tr style="background:#e8e8e8"><th style="font-size:10px">DIV I</th><th style="font-size:10px">DIV II</th><th style="font-size:10px">DIV III</th><th style="font-size:10px">DIV IV</th><th style="font-size:10px">DIV 0</th><th style="font-size:10px">ABS</th><th style="font-size:10px">TOTAL</th></tr></thead><tbody>`);
                pw.document.write(`<tr><td style="font-size:12px;font-weight:bold;color:green">${divI}</td><td style="font-size:12px;font-weight:bold">${divII}</td><td style="font-size:12px;font-weight:bold">${divIII}</td><td style="font-size:12px;font-weight:bold">${divIV}</td><td style="font-size:12px;font-weight:bold;color:red">${div0}</td><td style="font-size:12px;font-weight:bold">${divAbs}</td><td style="font-size:12px;font-weight:bold">${divTotal}</td></tr>`);
                pw.document.write(`</tbody></table></div></div>`);

                pw.document.write(`<div style="text-align:center;margin-top:15px;font-size:11px;color:#555;font-style:italic;border-top:1px solid #ccc;padding-top:8px">${schoolNameSetting}: ${schoolMotto}</div></body></html>`);
                pw.document.close();
                setTimeout(() => { pw.focus(); pw.print(); }, 500);
              };

              const printReportCard = (row: typeof allStudentRows[0]) => {
                const pw = window.open('', '', 'width=800,height=1000');
                if (!pw) return;
                const logo = localStorage.getItem('sms_school_logo') || '';
                const acName = localStorage.getItem('sms_academic_name') || '';
                const hmName = localStorage.getItem('sms_headmaster_name') || 'Saidi Mpambika';
                const acSig = localStorage.getItem('sms_academic_sig') || '';
                const hmSig = localStorage.getItem('sms_headmaster_sig') || '';
                const rr = row as any;
                const grade = (score: number) => score >= 75 ? 'A' : score >= 65 ? 'B' : score >= 45 ? 'C' : score >= 30 ? 'D' : 'F';
                const point = (score: number) => score >= 75 ? 1 : score >= 65 ? 2 : score >= 45 ? 3 : score >= 30 ? 4 : 5;
                const remark = (score: number) => score >= 75 ? 'Bora Sana' : score >= 65 ? 'Vizuri Sana' : score >= 45 ? 'Vizuri' : score >= 30 ? 'Wastani' : 'Inahitaji Jitihada';
                const classTotal = allStudentRows.filter(r => r.cls === row.cls).length;

                // Auto-generate comments — KWA KISWAHILI, kulingana na Daraja na Wastani (4 comments kwa kila daraja)
                const firstName = row.student.split(' ')[0];
                const avgFix = row.avg;
                const div = rr.division;

                function getAcademicCommentSw(name: string, division: string, avg: number): string {
                  const a = avg.toFixed(1);
                  if (division === 'I') {
                    if (avg >= 80) return `Hongera sana ${name}! Umefanya vizuri sana kwa kupata Daraja la I kwa wastani wa ${a}%. Umeonyesha nidhamu, bidii na umakini mkubwa masomoni. Endelea na moyo huo huo na uwe mfano kwa wenzako.`;
                    if (avg >= 70) return `Hongera ${name} kwa Daraja la I! Wastani wa ${a}% unaonyesha juhudi zako kubwa. Bado una nafasi ya kupanda zaidi — tilia mkazo kwenye masomo uliyopata alama za chini na utafanya vizuri zaidi mtihani ujao.`;
                    if (avg >= 60) return `Vizuri sana ${name}! Daraja la I kwa wastani wa ${a}% ni mafanikio makubwa. Usibweteke, endelea kupanga muda vizuri, fanya mazoezi mengi na shauriana na walimu wako ili udumishe kiwango hiki.`;
                    return `Hongera ${name} kwa kufikia Daraja la I hata kwa wastani wa ${a}%. Umeonyesha kuwa una uwezo mkubwa. Jitahidi kuongeza bidii hasa kwenye masomo dhaifu ili wastani wako uongezeke mtihani ujao.`;
                  }
                  if (division === 'II') {
                    if (avg >= 65) return `Hongera sana ${name}! Daraja la II kwa wastani wa ${a}% ni juhudi nzuri sana. Uko karibu na Daraja la I — ongeza umakini kwenye masomo ya sayansi na hisabati na utafikia kilele.`;
                    if (avg >= 55) return `Vizuri sana ${name}! Daraja la II kwa wastani wa ${a}% linaonyesha uwezo wako. Endelea kusoma kwa mpangilio, fanya mitihani ya mazoezi na usisite kuuliza msaada kwa walimu.`;
                    if (avg >= 45) return `Hongera ${name} kwa Daraja la II! Wastani wa ${a}% ni wa kuridhisha. Kuna masomo umefanya vizuri na mengine bado — yaweke kipaumbele na utapanda hadi Daraja la I.`;
                    return `Hongera ${name} kwa Daraja la II kwa wastani wa ${a}%. Umejitahidi, lakini bado una nafasi kubwa ya kuboresha. Punguza utoro, hudhuria vipindi vyote na jifunze kwa bidii zaidi.`;
                  }
                  if (division === 'III') {
                    if (avg >= 55) return `Hongera ${name}! Daraja la III kwa wastani wa ${a}% — uko kwenye njia sahihi. Umeonyesha juhudi, na kwa kuongeza extra hours za kujisomea unaweza kupanda hadi Daraja la II.`;
                    if (avg >= 45) return `Vizuri ${name}, Daraja la III kwa wastani wa ${a}% ni hatua nzuri. Tambua masomo uliyofeli na yafanyie kazi kwa karibu na mwalimu wa somo husika.`;
                    if (avg >= 35) return `${name}, Daraja la III kwa wastani wa ${a}% linaonyesha juhudi za wastani. Usikate tamaa — weka ratiba ya kusoma kila siku, epuka kelele na zingatia darasani.`;
                    return `${name}, umepata Daraja la III kwa wastani wa ${a}%. Bado unahitaji juhudi zaidi. Anza mapema kujiandaa kwa mtihani ujao na tumia maktaba ya shule.`;
                  }
                  if (division === 'IV') {
                    if (avg >= 45) return `${name}, Daraja la IV kwa wastani wa ${a}% — umefaulu lakini kwa wastani wa chini. Una uwezo wa kupanda hadi Daraja la III kama utaongeza bidii na kushirikiana na walimu.`;
                    if (avg >= 35) return `${name}, umepata Daraja la IV kwa wastani wa ${a}%. Hii ni ishara ya kuanza kujituma zaidi. Hudhuria masomo yote, fanya kazi za nyumbani kwa wakati na omba msaada.`;
                    if (avg >= 25) return `${name}, Daraja la IV kwa wastani wa ${a}% linahitaji jitihada za ziada. Usikate tamaa — kila hatua unayopiga kuelekea mbele ni muhimu. Shauriana na wazazi na walimu.`;
                    return `${name}, Daraja la IV kwa wastani wa ${a}% linaonyesha changamoto. Lakini una nafasi ya kubadilika — anza leo, soma kwa ratiba na uamini kuwa unaweza.`;
                  }
                  // Division 0 — Fail
                  if (avg >= 30) return `Pole sana ${name}, umepata Daraja 0 kwa wastani wa ${a}%. Uko karibu kufaulu — ongeza juhudi maradufu, hudhuria darasani kila siku na fanya mazoezi ya masomo yote.`;
                  if (avg >= 20) return `${name}, Daraja 0 kwa wastani wa ${a}% ni changamoto, lakini si mwisho. Tambua udhaifu wako, weka malengo madogo ya kila wiki na yafanyie kazi na mwalimu wako.`;
                  if (avg >= 10) return `${name}, umepata Daraja 0 kwa wastani wa ${a}%. Hii ni wito wa kuamka — acha kukata tamaa, anza upya kwa nidhamu, soma kwa bidii na utaona mabadiliko.`;
                  return `${name}, Daraja 0 kwa wastani wa ${a}% linahitaji msaada wa haraka. Shule iko tayari kukusaidia — njoo mapema, shiriki darasani na fanya juhudi za ziada. Unaweza kuinuka tena.`;
                }

                function getHeadmasterCommentSw(name: string, division: string, avg: number): string {
                  const a = avg.toFixed(1);
                  if (division === 'I') {
                    if (avg >= 80) return `${name} ni fahari ya shule! Daraja la I kwa wastani wa ${a}% linaonyesha nidhamu na juhudi zisizo na kifani. Shule inakutegemea kuwa kiongozi na mfano kwa wenzako.`;
                    if (avg >= 70) return `Hongera sana ${name}! Shule inajivunia Daraja la I kwa wastani wa ${a}%. Endelea na moyo wa kujifunza na heshima kwa walimu — mafanikio makubwa yanakusubiri.`;
                    if (avg >= 60) return `${name} hongera kwa Daraja la I! Wastani wa ${a}% unaonyesha kuwa juhudi zako zinalipa. Shule inakutia moyo uzidishe bidii ili uendelee kung'ara.`;
                    return `Hongera ${name} kwa Daraja la I kwa wastani wa ${a}%. Shule inatambua juhudi zako na inakuhimiza usichoke — bado una nafasi ya kuwa bora zaidi.`;
                  }
                  if (division === 'II') {
                    if (avg >= 65) return `${name}, Daraja la II kwa wastani wa ${a}% ni hatua kubwa. Shule inakupa hongera na inakuamini unaweza kufika Daraja la I mtihani ujao kwa juhudi kidogo zaidi.`;
                    if (avg >= 55) return `Hongera ${name}! Daraja la II kwa wastani wa ${a}% linaonyesha kuwa unasonga mbele vizuri. Shule inakuhimiza uzingatie muda na nidhamu zaidi.`;
                    if (avg >= 45) return `${name}, Daraja la II kwa wastani wa ${a}% — shule inaona juhudi zako. Endelea kushirikiana na wazazi na walimu ili uboreshe zaidi.`;
                    return `${name}, Daraja la II kwa wastani wa ${a}% linaonyesha umejitahidi. Shule inakushauri kupunguza utovu wa nidhamu na kuongeza mahudhurio.`;
                  }
                  if (division === 'III') {
                    if (avg >= 55) return `${name}, Daraja la III kwa wastani wa ${a}% — shule inakupa hongera. Umeonyesha maendeleo na tuna imani ukiongeza bidii utapanda daraja.`;
                    if (avg >= 45) return `Hongera ${name} kwa Daraja la III! Wastani wa ${a}% unaonyesha juhudi za wastani. Shule inakuhimiza kutumia vizuri vipindi vya ziada na maktaba.`;
                    if (avg >= 35) return `${name}, Daraja la III kwa wastani wa ${a}% — shule inakuhimiza kujituma zaidi. Epuka marafiki wanaokupotezea muda na zingatia malengo yako.`;
                    return `${name}, Daraja la III kwa wastani wa ${a}% linahitaji mabadiliko ya mtindo wa kusoma. Shule iko tayari kukupa msaada — jitokeze.`;
                  }
                  if (division === 'IV') {
                    if (avg >= 45) return `${name}, Daraja la IV kwa wastani wa ${a}% — shule inakutia moyo. Bado una nafasi ya kupanda — zingatia masomo dhaifu na shauriana na walimu.`;
                    if (avg >= 35) return `Pole ${name} kwa Daraja la IV kwa wastani wa ${a}%. Shule inakushauri kuongeza nidhamu, mahudhurio na kufanya kazi kwa bidii zaidi.`;
                    if (avg >= 25) return `${name}, Daraja la IV kwa wastani wa ${a}% — shule inakukumbusha kuwa kila siku ni nafasi mpya ya kujifunza. Usikate tamaa.`;
                    return `${name}, Daraja la IV kwa wastani wa ${a}% linahitaji juhudi za dharura. Shule, wazazi na walimu tuko pamoja kukusaidia kuinuka.`;
                  }
                  if (avg >= 30) return `Pole sana ${name}, Daraja 0 kwa wastani wa ${a}%. Shule haijakata tamaa kwako — tunaamini ukibadilika na kujituma utafaulu mtihani ujao.`;
                  if (avg >= 20) return `${name}, Daraja 0 kwa wastani wa ${a}% — shule inakuhimiza uanze upya leo. Njoo shule kila siku, sikiliza kwa makini na fanya mazoezi.`;
                  if (avg >= 10) return `${name}, Daraja 0 kwa wastani wa ${a}% — shule inakupa pole na inakualika kwenye ushauri wa kitaaluma ili tukupangie mpango wa kuinuka.`;
                  return `${name}, Daraja 0 kwa wastani wa ${a}% — shule bado inakuamini. Elimu ni safari, si kituo. Anza hatua ndogo leo na utafika mbali.`;
                }

                let acComment = getAcademicCommentSw(firstName, div, avgFix);
                let hmComment = getHeadmasterCommentSw(firstName, div, avgFix);

                pw.document.write(`<!DOCTYPE html><html><head><title>\u00A0</title><style>
                  @page { size: A4 portrait; margin: 10mm 12mm 8mm 12mm; }
                  @page { @top-left { content: ''; } @top-right { content: ''; } @bottom-left { content: ''; } @bottom-right { content: ''; } }
                  * { margin:0; padding:0; box-sizing:border-box; }
                  body { font-family: 'Arial', 'Helvetica', sans-serif; font-size: 13px; color: #000; }
                  table { width:100%; border-collapse:collapse; margin: 8px 0; }
                  th,td { border:1px solid #000; padding:6px 8px; font-size: 13px; }
                  th { background: #d4edda; font-size: 13px; font-weight:bold; }
                  .header { text-align:center; margin-bottom:10px; border-bottom:3px double #000; padding-bottom:8px; }
                  .header img { height:60px; margin-bottom:4px; }
                  .info-grid { display:grid; grid-template-columns:1fr 1fr; gap:0; border:2px solid #000; margin-bottom:10px; font-size:13px; }
                  .info-cell { padding:7px 12px; border:1px solid #000; font-size:13px; }
                  .grade-box { border:3px solid #000; padding:10px; text-align:center; margin:10px 0; background:#d4edda; border-radius:6px; }
                  .comment-box { border:1px solid #000; padding:10px; border-radius:6px; margin-bottom:8px; }
                  .comment-title { font-size:12px; font-weight:bold; margin-bottom:4px; text-decoration:underline; }
                  .comment-text { font-size:12px; line-height:1.5; min-height:28px; }
                  .sig-row { display:flex; justify-content:space-between; margin-top:10px; font-size:12px; align-items:flex-end; min-height:60px; }
                  .sig-img { height:55px; max-width:180px; width:auto; object-fit:contain; display:block; }
                  .comment-box .sig-row span:last-child { min-width:180px; text-align:right; }
                  @media print { body { -webkit-print-color-adjust:exact; print-color-adjust:exact; } }
                </style></head><body>
                <div class="header">`);
                if (logo) pw.document.write(`<img src="${logo}" />`);
                pw.document.write(`<div style="font-size:14px;font-weight:bold;letter-spacing:1.5px">${districtName}</div>
                  <div style="font-size:22px;font-weight:bold;letter-spacing:2px;margin:3px 0">${schoolNameSetting}</div>
                  <div style="font-size:11px;margin-bottom:4px">${schoolAddress}</div>
                  <div style="font-size:16px;font-weight:bold;text-decoration:underline;margin-top:4px">RIPOTI YA MAENDELEO YA MWANAFUNZI</div>
                  <div style="font-size:13px;margin-top:3px">${examName}</div></div>`);

                // Student info grid — KISWAHILI
                pw.document.write(`<div class="info-grid">
                  <div class="info-cell">Jina la Mwanafunzi: <strong style="font-size:14px">${row.student}</strong></div>
                  <div class="info-cell">Darasa: <strong style="font-size:14px">${row.cls}</strong></div>
                  <div class="info-cell">Nafasi: <strong style="font-size:14px">${row.rank} kati ya ${classTotal}</strong></div>
                  <div class="info-cell">Daraja: <strong style="font-size:14px">${rr.division}</strong> | Pointi: <strong style="font-size:14px">${rr.totalPoints}</strong></div>
                </div>`);

                // Scores table — KISWAHILI
                pw.document.write(`<table><thead><tr><th style="text-align:left">SOMO</th><th style="width:70px">ALAMA</th><th style="width:60px">GREDI</th><th style="width:60px">POINTI</th><th>MAELEZO</th></tr></thead><tbody>`);
                allSubjects.forEach(sub => {
                  const v = row.scores[sub];
                  if (v !== null) {
                    const g = grade(v);
                    const p = point(v);
                    const r = remark(v);
                    const color = v >= 45 ? '#006600' : '#cc0000';
                    pw.document.write(`<tr><td style="text-align:left;font-weight:bold">${sub}</td><td style="text-align:center;color:${color};font-weight:bold;font-size:14px">${v}</td><td style="text-align:center;font-weight:bold;color:${color};font-size:14px">${g}</td><td style="text-align:center;font-size:13px">${p}</td><td style="text-align:center">${r}</td></tr>`);
                  }
                });
                const validCount = Object.values(row.scores).filter(v => v !== null).length;
                pw.document.write(`<tr style="font-weight:bold;background:#d4edda"><td style="text-align:left">JUMLA (Masomo ${validCount})</td><td style="text-align:center;font-size:14px">${row.total}</td><td style="text-align:center;font-size:14px">${grade(row.avg)}</td><td style="text-align:center;font-size:13px">${rr.totalPoints}</td><td style="text-align:center">${remark(row.avg)}</td></tr>`);
                pw.document.write(`</tbody></table>`);

                // Overall box — KISWAHILI
                pw.document.write(`<div class="grade-box"><strong style="font-size:14px">Wastani: ${row.avg.toFixed(1)}% &nbsp;|&nbsp; Gredi: ${grade(row.avg)} &nbsp;|&nbsp; Pointi: ${rr.totalPoints} &nbsp;|&nbsp; Daraja: ${rr.division} &nbsp;|&nbsp; Nafasi: ${row.rank} / ${classTotal}</strong></div>`);

                // Behavior Assessment
                const bData = JSON.parse(localStorage.getItem('sms_behavior') || '{}');
                const studentBehavior = bData[row.student] || {};
                const classTeacherId = Object.entries(classTeachers).find(([c]) => c === row.cls)?.[1];
                const classTeacherObj = users.find((u: any) => u.id === classTeacherId);
                const ctName = classTeacherObj?.name || '';

                const behaviorCats = ['Nidhamu', 'Kuwahi', 'Mahudhurio', 'Heshima', 'Uwajibikaji', 'Ushiriki Darasani', 'Ushirikiano', 'Usafi', 'Kujidhibiti', 'Uongozi'];
                if (Object.keys(studentBehavior).length > 0) {
                  pw.document.write(`<div style="margin:8px 0"><table><thead><tr><th colspan="10" style="text-align:left;font-size:12px;background:#fff3cd">TATHMINI YA TABIA — Mwalimu wa Darasa: <strong>${ctName}</strong></th></tr><tr style="background:#fff3cd">`);
                  behaviorCats.forEach(c => pw.document.write(`<th style="font-size:9px;padding:4px;background:#fff3cd">${c}</th>`));
                  pw.document.write(`</tr></thead><tbody><tr>`);
                  const engCats = ['Discipline', 'Punctuality', 'Attendance', 'Respectfulness', 'Responsibility', 'Class Participation', 'Cooperation', 'Neatness', 'Self-Control', 'Leadership & Initiative'];
                  const swValMap: Record<string,string> = { 'Excellent':'Bora Sana', 'Very Good':'Vizuri Sana', 'Good':'Vizuri', 'Satisfactory':'Wastani', 'Needs Improvement':'Inahitaji Kuboreshwa' };
                  behaviorCats.forEach((c, idx) => {
                    const engKey = engCats[idx];
                    const raw = studentBehavior[engKey] || studentBehavior[c] || '-';
                    const val = (swValMap as any)[raw] || raw;
                    const color = raw === 'Excellent' ? '#006600' : raw === 'Needs Improvement' ? '#cc0000' : '#333';
                    pw.document.write(`<td style="font-size:10px;text-align:center;color:${color};padding:4px;font-weight:bold">${val}</td>`);
                  });
                  pw.document.write(`</tr></tbody></table></div>`);
                }

                // Comments — KISWAHILI
                pw.document.write(`<div style="display:flex;gap:10px;margin-top:8px">`);
                pw.document.write(`<div class="comment-box" style="flex:1"><div class="comment-title">MAONI YA MWALIMU WA TAALUMA:</div><div class="comment-text">${acComment}</div><div class="sig-row"><span>Jina: <strong>${acName || '________________'}</strong></span><span>${acSig ? `<img src="${acSig}" class="sig-img" />` : 'Sahihi: ________________'}</span></div></div>`);
                pw.document.write(`<div class="comment-box" style="flex:1"><div class="comment-title">MAONI YA MKUU WA SHULE:</div><div class="comment-text">${hmComment}</div><div class="sig-row"><span>Jina: <strong>${hmName}</strong></span><span>${hmSig ? `<img src="${hmSig}" class="sig-img" />` : 'Sahihi: ________________'}</span></div></div>`);
                pw.document.write(`</div>`);

                // Footer
                pw.document.write(`<div style="text-align:center;margin-top:12px;font-size:11px;color:#555;font-style:italic;border-top:2px solid #ccc;padding-top:6px"><strong>${schoolNameSetting}</strong>: ${schoolMotto}</div>`);
                pw.document.write(`</body></html>`);
                pw.document.close();
                setTimeout(() => { pw.focus(); pw.print(); }, 500);
              };

              return (
                <div>
                  <div className="flex justify-between items-center mb-3 flex-wrap gap-2">
                    <p className="text-xs text-slate-500 font-semibold">{examName} — {allStudentRows.length} students — {allSubjects.length} subjects</p>
                    <div className="flex gap-2">
                      <button onClick={() => printResults('landscape')} className="px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-semibold">🖨️ Landscape</button>
                      <button onClick={() => printResults('portrait')} className="px-3 py-1.5 bg-slate-700 text-white rounded-lg text-xs font-semibold">🖨️ Portrait</button>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm border">
                      <thead>
                        <tr className="bg-emerald-50 border-b">
                          <th className="p-1 border text-xs">S/N</th>
                          <th className="text-left p-1 border text-xs">Student Name</th>
                          {allSubjects.map(sub => <th key={sub} className="text-center p-1 border text-[9px]">{getSubjectCode(sub)}</th>)}
                          <th className="p-1 border font-bold text-[9px]">Total Pts</th>
                          <th className="p-1 border font-bold text-[9px]">Avg</th>
                          <th className="p-1 border font-bold text-[9px]">Grade</th>
                          <th className="p-1 border font-bold text-[9px]">Pos</th>
                          <th className="p-1 border font-bold text-[9px]">Pts</th>
                          <th className="p-1 border font-bold text-[9px]">Div</th>
                          <th className="p-1 border text-[9px]">📄</th>
                        </tr>
                      </thead>
                      <tbody>
                        {allStudentRows.map((r, i) => {
                          const rr = r as any;
                          return (
                            <tr key={i} className="border-b hover:bg-slate-50">
                              <td className="p-1 border text-center font-bold text-xs">{r.rank}</td>
                              <td className="p-1 border font-medium text-xs whitespace-nowrap">{r.student}</td>
                              {allSubjects.map(sub => {
                                const v = r.scores[sub];
                                return <td key={sub} className={`p-1 border text-center text-[10px] ${v === null ? 'text-slate-300' : v >= 45 ? 'text-emerald-700' : 'text-red-600'}`}>{v !== null ? `${v} ${getGrade(v)}` : '—'}</td>;
                              })}
                              <td className="p-1 border text-center font-bold text-xs">{r.total}</td>
                              <td className="p-1 border text-center font-bold text-xs">{r.avg.toFixed(1)}</td>
                              <td className="p-1 border text-center font-bold text-xs">{rr.letterGrade}</td>
                              <td className="p-1 border text-center font-bold text-xs">{r.rank}</td>
                              <td className="p-1 border text-center font-bold text-xs">{rr.totalPoints}</td>
                              <td className={`p-1 border text-center font-bold text-xs ${rr.division === 'I' ? 'text-emerald-700' : rr.division === '0' ? 'text-red-600' : ''}`}>{rr.division}</td>
                              <td className="p-1 border text-center"><button onClick={() => printReportCard(r)} className="text-[10px] text-indigo-600 font-semibold hover:underline">📄</button></td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })()}
          </div>
          )}

          {activeMenu === 'duty' && (
          <div className="bg-white p-6 rounded-2xl border">
            <div className="flex justify-between items-center mb-3 flex-wrap gap-2">
              <h2 className="font-bold text-lg">Duty Reports Archive</h2>
              <div className="flex gap-2">
                <select value={filterYear} onChange={e => setFilterYear(e.target.value)} className="border px-2 py-1 rounded-lg text-xs">
                  {availableYears.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
                <select value={filterMonth} onChange={e => setFilterMonth(e.target.value)} className="border px-2 py-1 rounded-lg text-xs">
                  <option value="">All Months</option>
                  {['01','02','03','04','05','06','07','08','09','10','11','12'].map(m => <option key={m} value={m}>{new Date(2000, Number(m)-1).toLocaleString('default', {month:'long'})}</option>)}
                </select>
              </div>
            </div>
            {(() => {
              let filtered = duties;
              if (filterYear) filtered = filtered.filter((d: any) => d.date?.startsWith(filterYear));
              if (filterMonth) filtered = filtered.filter((d: any) => d.date?.substring(5,7) === filterMonth);
              return filtered.length === 0 ? <p className="text-sm text-slate-500">No reports for this period.</p> : filtered.map((d: any) => (
              <div key={d.id} className="border-b py-3 flex justify-between items-start">
                <div>
                  <p className="font-semibold">{d.date} — {d.teacher_name}</p>
                  <p className="text-xs text-slate-500 mt-1">
                    {d.attendance ? `${d.attendance.length} classes recorded` : 'Legacy format'}
                    {d.tod_comment && ` | TOD: ${d.tod_comment.substring(0, 50)}...`}
                  </p>
                </div>
                <button onClick={() => setPrintReport(d)} className="px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-semibold border border-indigo-200">🖨️ Print</button>
              </div>
            ));
            })()}
          </div>
          )}

          {printReport && <DutyReportPrint report={printReport} onClose={() => setPrintReport(null)} />}
        </div>
        </div>
      </div>
    );
  }

  if (screen === 'teacher') {
    return (
      <div className="min-h-screen bg-slate-100 flex">
        {/* Teacher Sidebar */}
        <div className={`${sidebarOpen ? 'w-52' : 'w-14'} bg-slate-900 text-white min-h-screen flex flex-col transition-all duration-200 fixed left-0 top-0 z-40`}>
          <div className="p-3 border-b border-slate-700 flex items-center gap-2">
            {schoolLogo && <SafeImg src={schoolLogo} alt="Logo" className="w-8 h-8 object-contain rounded" />}
            {sidebarOpen && <div><p className="text-xs font-bold leading-tight">{schoolNameSetting.substring(0, 15)}</p><p className="text-[9px] text-slate-400">Teacher Panel</p></div>}
          </div>
          <nav className="flex-1 py-2">
            {teacherMenus.map(m => (
              <button key={m.id} onClick={() => setActiveMenu(m.id)} className={`w-full flex items-center gap-2 px-3 py-2.5 text-xs font-medium transition-all ${activeMenu === m.id ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
                <span className="text-sm">{m.icon}</span>
                {sidebarOpen && <span>{m.label}</span>}
              </button>
            ))}
          </nav>
          <div className="p-2 border-t border-slate-700">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="w-full text-center text-slate-500 text-xs py-1 hover:text-white">{sidebarOpen ? '◀' : '▶'}</button>
          </div>
        </div>

        <div className={`flex-1 ${sidebarOpen ? 'ml-52' : 'ml-14'} transition-all duration-200`}>
        <div className="bg-white border-b px-6 py-3 flex justify-between items-center sticky top-0 z-30">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold">{teacherMenus.find(m => m.id === activeMenu)?.icon} {teacherMenus.find(m => m.id === activeMenu)?.label || 'Teacher Panel'}</span>
            <span className="text-xs text-slate-400">{user?.name}{myClass ? ` — Class Teacher: ${myClass}` : ''}</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setShowChangePassword(!showChangePassword)} className="px-2 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold">🔑</button>
            <button onClick={logout} className="px-3 py-1.5 bg-red-500 text-white rounded-lg text-xs font-semibold">Logout</button>
          </div>
        </div>
        {showChangePassword && (
          <div className="bg-amber-50 border-b border-amber-200 px-6 py-4">
            <div className="max-w-md mx-auto space-y-2">
              <h3 className="font-bold text-sm">Change Password</h3>
              <input type="password" placeholder="Current password" value={oldPass} onChange={e => setOldPass(e.target.value)} className="w-full border px-3 py-2 rounded-xl text-sm" />
              <input type="password" placeholder="New password" value={newPass} onChange={e => setNewPass(e.target.value)} className="w-full border px-3 py-2 rounded-xl text-sm" />
              <input type="password" placeholder="Confirm new password" value={confirmPass} onChange={e => setConfirmPass(e.target.value)} className="w-full border px-3 py-2 rounded-xl text-sm" />
              <div className="flex gap-2">
                <button onClick={changePassword} className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-xs font-semibold">Save New Password</button>
                <button onClick={() => { setShowChangePassword(false); setOldPass(''); setNewPass(''); setConfirmPass(''); }} className="bg-slate-200 text-slate-700 px-4 py-2 rounded-xl text-xs font-semibold">Cancel</button>
              </div>
            </div>
          </div>
        )}
        <div className="p-6 max-w-4xl mx-auto space-y-6">

          {/* Teacher Dashboard */}
          {activeMenu === 'my_timetable' && (<>
          {/* My Teaching Timetable */}
          {(() => {
            try {
              const ttData = JSON.parse(localStorage.getItem('tt_timetableData') || 'null');
              const ttDays = JSON.parse(localStorage.getItem('tt_days') || '["Monday","Tuesday","Wednesday","Thursday","Friday"]');
              const ttSlots = JSON.parse(localStorage.getItem('tt_timeSlots') || '[]');
              const ttSubjects = JSON.parse(localStorage.getItem('tt_subjects') || '[]');
              const ttClasses = JSON.parse(localStorage.getItem('tt_classes') || '[]');
              if (!ttData?.schedule) return null;

              // Find all periods for this teacher
              const myPeriods: { day: string; period: any; cell: any }[] = [];
              Object.keys(ttData.schedule).forEach(classId => {
                ttDays.forEach((day: string) => {
                  Object.keys(ttData.schedule[classId][day] || {}).forEach(periodId => {
                    const cell = ttData.schedule[classId][day][periodId];
                    if (cell && cell.teacherId === user?.id) {
                      myPeriods.push({ day, period: ttSlots.find((s: any) => s.id === periodId), cell: { ...cell, classId } });
                    }
                  });
                });
              });

              if (myPeriods.length === 0) return (
                <div className="bg-white p-6 rounded-2xl border">
                  <h2 className="font-bold text-lg mb-2">📅 My Teaching Timetable</h2>
                  <p className="text-sm text-slate-500">No timetable generated yet or you have no assigned periods. Contact admin.</p>
                </div>
              );

              const activePeriods = ttSlots.filter((s: any) => !s.isBreak);

              const printMyTimetable = () => {
                const pw = window.open('', '', 'width=900,height=700');
                if (!pw) return;
                const logo = localStorage.getItem('sms_school_logo') || '';
                pw.document.write(`<!DOCTYPE html><html><head><title>\u00A0</title><style>
                  @page { size: A4 landscape; margin: 10mm 10mm 6mm 10mm; }
                  @page { @top-left { content: ''; } @top-right { content: ''; } @bottom-left { content: ''; } @bottom-right { content: ''; } }
                  * { margin:0; padding:0; box-sizing:border-box; }
                  body { font-family: 'Times New Roman', serif; font-size: 12px; color: #000; }
                  table { width:100%; border-collapse:collapse; margin-top:10px; }
                  th,td { border:1px solid #000; padding:5px 4px; text-align:center; font-size:11px; }
                  th { background:#f0f0f0; font-size:12px; }
                  .header { text-align:center; margin-bottom:8px; }
                  .header img { height:50px; margin-bottom:3px; }
                  @media print { body { -webkit-print-color-adjust:exact; print-color-adjust:exact; } }
                </style></head><body><div class="header">`);
                if (logo) pw.document.write(`<img src="${logo}" />`);
                pw.document.write(`<div style="font-size:14px;font-weight:bold;letter-spacing:1px">${localStorage.getItem('sms_district_name') || 'RUANGWA DISTRICT COUNCIL'}</div>
                  <div style="font-size:18px;font-weight:bold;letter-spacing:1px">${localStorage.getItem('sms_school_name_setting') || 'NAMBAWALA SECONDARY SCHOOL'}</div>
                  <div style="font-size:14px;font-weight:bold;text-decoration:underline">TEACHER'S TIMETABLE</div>
                  <div style="font-size:13px;margin-top:4px">Teacher: <strong>${user?.name}</strong></div></div>`);
                pw.document.write(`<table><thead><tr><th>TIME</th>`);
                ttDays.forEach((d: string) => pw.document.write(`<th>${d}</th>`));
                pw.document.write(`</tr></thead><tbody>`);
                activePeriods.forEach((p: any) => {
                  pw.document.write(`<tr><td style="font-weight:bold;font-size:10px">${p.name}<br/>${p.startTime}-${p.endTime}</td>`);
                  ttDays.forEach((d: string) => {
                    const found = myPeriods.find(mp => mp.day === d && mp.period?.id === p.id);
                    if (found) {
                      const sub = ttSubjects.find((s: any) => s.id === found.cell.subjectId);
                      const secondSub = ttSubjects.find((s: any) => s.id === found.cell.secondSubjectId || s.name === found.cell.secondSubjectName);
                      const subjectDisplay = found.cell.isCombined && secondSub
                        ? `${sub?.code || sub?.name?.substring(0, 4) || ''}/${secondSub.code || secondSub.name?.substring(0, 4) || ''}`
                        : (sub?.code || sub?.name || '');
                      const cls = ttClasses.find((c: any) => c.id === found.cell.classId);
                      pw.document.write(`<td style="font-weight:bold;background:#e8f5e9"><strong>${subjectDisplay}</strong><br/><span style="font-size:9px">${cls?.name || ''}</span></td>`);
                    } else {
                      pw.document.write(`<td style="color:#ccc">—</td>`);
                    }
                  });
                  pw.document.write(`</tr>`);
                });
                pw.document.write(`</tbody></table><div style="text-align:center;margin-top:20px;font-size:11px;color:#555;font-style:italic;border-top:1px solid #ccc;padding-top:8px">${localStorage.getItem('sms_school_name_setting') || 'Nambawala Secondary School'}: ${localStorage.getItem('sms_school_motto') || 'Honor All Build Together'}</div></body></html>`);
                pw.document.close();
                setTimeout(() => { pw.focus(); pw.print(); }, 500);
              };

              return (
                <div className="bg-white p-6 rounded-2xl border">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="font-bold text-lg">📅 My Teaching Timetable</h2>
                    <button onClick={printMyTimetable} className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold">🖨️ Print My Timetable</button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs border-collapse border border-slate-300">
                      <thead>
                        <tr className="bg-slate-100">
                          <th className="border border-slate-300 p-2 text-left">Time</th>
                          {ttDays.map((d: string) => <th key={d} className="border border-slate-300 p-2">{d}</th>)}
                        </tr>
                      </thead>
                      <tbody>
                        {ttSlots.map((p: any) => {
                          if (p.isBreak) return (
                            <tr key={p.id} className="bg-slate-50">
                              <td className="border border-slate-300 p-1 text-xs font-bold">{p.name}</td>
                              <td colSpan={ttDays.length} className="border border-slate-300 p-1 text-center text-slate-400 text-xs italic">☕ {p.name}</td>
                            </tr>
                          );
                          if (p.isActivity || p.id === 'act' || p.name?.trim().toLowerCase() === 'activity') return (
                            <tr key={p.id} className="bg-indigo-50">
                              <td className="border border-slate-300 p-1 text-xs font-bold">Activity<br/><span className="text-[10px] text-slate-400">{p.startTime}-{p.endTime}</span></td>
                              <td colSpan={ttDays.length} className="border border-slate-300 p-1 text-center text-indigo-700 text-xs font-bold">Activity</td>
                            </tr>
                          );
                          return (
                            <tr key={p.id}>
                              <td className="border border-slate-300 p-1 font-bold text-xs whitespace-nowrap">{p.name}<br/><span className="text-[10px] text-slate-400">{p.startTime}-{p.endTime}</span></td>
                              {ttDays.map((d: string) => {
                                const found = myPeriods.find(mp => mp.day === d && mp.period?.id === p.id);
                                if (!found) return <td key={d} className="border border-slate-300 p-1 text-center text-slate-300">—</td>;
                                const sub = ttSubjects.find((s: any) => s.id === found.cell.subjectId);
                                const secondSub = ttSubjects.find((s: any) => s.id === found.cell.secondSubjectId || s.name === found.cell.secondSubjectName);
                                const subjectDisplay = found.cell.isCombined && secondSub
                                  ? `${sub?.code || sub?.name?.substring(0, 4) || ''}/${secondSub.code || secondSub.name?.substring(0, 4) || ''}`
                                  : (sub?.code || sub?.name?.substring(0, 4) || '');
                                const cls = ttClasses.find((c: any) => c.id === found.cell.classId);
                                return (
                                  <td key={d} className="border border-slate-300 p-1 text-center bg-indigo-50">
                                    <div className="font-bold text-indigo-800">{subjectDisplay}</div>
                                    <div className="text-[10px] text-slate-600">{cls?.name}</div>
                                  </td>
                                );
                              })}
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                  <p className="text-xs text-slate-400 mt-2">{myPeriods.length} teaching periods per week</p>
                </div>
              );
            } catch { return null; }
          })()}

          </>)}

          {/* Student Registration (only for class teachers) */}
          {activeMenu === 'students' && myClass && (
            <div className="bg-white p-6 rounded-2xl border">
              <h2 className="font-bold text-lg mb-2">Register Students — {myClass}</h2>
              <p className="text-xs text-slate-500 mb-4">Register students for this class. Student records remain here until you delete them.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                <input placeholder="Student full name" value={newStudentName} onChange={e => setNewStudentName(e.target.value)} className="border px-3 py-2.5 rounded-xl" />
                <button onClick={async () => {
                  if (!newStudentName.trim()) { alert('Enter student name'); return; }
                  setStudents(prev => ({ ...prev, [myClass]: [...(prev[myClass] || []), { name: newStudentName.trim(), subjects: [...ALL_SUBJECTS] }] }));

                  await loadData();
                  setNewStudentName('');
                  alert('Student added. The record remains until you delete it.');
                }} className="bg-indigo-600 text-white px-4 py-2.5 rounded-xl font-semibold">Add Student</button>
              </div>
              <div>
                <h3 className="font-bold text-sm mb-2">Students in {myClass} ({(students[myClass] || []).length})</h3>
                {(students[myClass] || []).length === 0 ? <p className="text-sm text-slate-500">No students registered yet.</p> :
                  <div className="space-y-2">
                    {(students[myClass] || []).map((s, i) => (
                      <div key={i} className="border rounded-xl p-3">
                        <div className="flex justify-between items-center mb-2">
                          <div>
                            <span className="font-semibold text-sm">{i + 1}. {s.name}</span>
                          </div>
                          <div className="flex gap-1">
                            <button onClick={() => removeStudent(myClass, s.name)} className="text-red-500 text-xs font-bold hover:text-red-700">✕</button>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {ALL_SUBJECTS.map(sub => (
                            <button key={sub} onClick={() => toggleStudentSubject(myClass, s.name, sub)} className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${s.subjects.includes(sub) ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-100 text-slate-400 border-slate-200 line-through'}`}>
                              {s.subjects.includes(sub) ? '✓' : '✕'} {sub}
                            </button>
                          ))}
                        </div>
                        <p className="text-[10px] text-slate-400 mt-1">{s.subjects.length} subjects</p>
                      </div>
                    ))}
                  </div>
                }
              </div>
            </div>
          )}

          {/* Behavior Assessment */}
          {activeMenu === 'behavior' && myClass && (
            <div className="bg-white p-6 rounded-2xl border">
              <h2 className="font-bold text-lg mb-2">📋 Student Behavior Assessment — {myClass}</h2>
              <p className="text-xs text-slate-500 mb-4">Assess each student's behavior. This appears on their report card.</p>
              {(students[myClass] || []).length === 0 ? <p className="text-sm text-slate-500">No students registered. Register students first.</p> :
                <div className="space-y-3">
                  {(students[myClass] || []).sort((a, b) => a.name.localeCompare(b.name)).map((s, i) => (
                    <div key={i} className="border rounded-xl p-3">
                      <p className="font-bold text-sm mb-2">{i + 1}. {s.name}</p>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-1">
                        {BEHAVIOR_CATEGORIES.map(cat => (
                          <div key={cat}>
                            <label className="text-[9px] text-slate-500 block">{cat}</label>
                            <select value={behaviorData[s.name]?.[cat] || ''} onChange={e => setBehavior(s.name, cat, e.target.value)} className="w-full border px-1 py-1 rounded text-[10px]">
                              <option value="">--</option>
                              {BEHAVIOR_RATINGS.map(r => <option key={r} value={r}>{r}</option>)}
                            </select>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              }
              <p className="text-xs text-emerald-600 mt-3 font-semibold">✅ Changes saved automatically</p>
            </div>
          )}

          {/* Exams & Score Entry */}
          {activeMenu === 'exams' && (
          <div className="bg-white p-6 rounded-2xl border">
            <h2 className="font-bold text-lg mb-4">📝 Exams & Score Entry</h2>

            {/* List of open exams */}
            {exams.filter(ex => isExamOpen(ex, user?.id) && teacherHasExamAssignment(ex, user?.id)).length === 0 ? (
              <p className="text-sm text-slate-500 italic">No active exams assigned to you.</p>
            ) : (
              <div className="space-y-3 mb-4">
                {exams.filter(ex => isExamOpen(ex, user?.id) && teacherHasExamAssignment(ex, user?.id)).map((ex: any) => {
                  const deadline = getTeacherDeadline(ex, user?.id);
                  const timeLeft = getTimeRemaining(deadline);
                  const isSelected = selectedExam?.id === ex.id;

                  return (
                    <div key={ex.id} className={`border rounded-xl p-4 cursor-pointer transition-all ${isSelected ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 hover:border-indigo-300'}`} onClick={() => { setSelectedExam(isSelected ? null : ex); setExamScoreClass(''); setExamScoreSubject(''); setExamScores({}); }}>
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-bold">{ex.name}</p>
                          <p className="text-xs text-slate-500">{ex.term}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-semibold text-amber-600">⏰ {timeLeft}</p>
                          <p className="text-[10px] text-slate-400">Deadline: {new Date(deadline).toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Score entry form when exam is selected */}
            {selectedExam && isExamOpen(selectedExam, user?.id) && teacherHasExamAssignment(selectedExam, user?.id) && (() => {
              const myAssignments = teachingAssignments[user?.id] || [];
              const myClasses = getTeacherClasses(user?.id);
              const mySubjectsForClass = examScoreClass ? getTeacherSubjectsForClass(user?.id, examScoreClass) : [];

              return (
              <div className="border-t pt-4 mt-4">
                <h3 className="font-bold mb-3">Enter Scores — {selectedExam.name}</h3>

                {myAssignments.length === 0 ? (
                  <p className="text-sm text-amber-600 bg-amber-50 p-3 rounded-xl">⚠️ No classes assigned to you yet. Contact admin to assign your teaching classes and subjects.</p>
                ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-500 uppercase mb-1 block">Class (Your assigned classes)</label>
                    <select value={examScoreClass} onChange={e => { setExamScoreClass(e.target.value); setExamScoreSubject(''); setExamScores({}); }} className="w-full border px-3 py-2.5 rounded-xl">
                      <option value="">-- Select Class --</option>
                      {myClasses.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-500 uppercase mb-1 block">Subject (Your subject in this class)</label>
                    {mySubjectsForClass.length === 1 ? (
                      <div className="border px-3 py-2.5 rounded-xl bg-slate-50 font-semibold text-sm">{mySubjectsForClass[0]}</div>
                    ) : mySubjectsForClass.length > 1 ? (
                      <select value={examScoreSubject} onChange={e => setExamScoreSubject(e.target.value)} className="w-full border px-3 py-2.5 rounded-xl">
                        <option value="">-- Select Subject --</option>
                        {mySubjectsForClass.map(s => <option key={s}>{s}</option>)}
                      </select>
                    ) : (
                      <div className="border px-3 py-2.5 rounded-xl bg-slate-50 text-slate-400 text-sm italic">Select a class first</div>
                    )}
                  </div>
                </div>
                )}

                {/* Student score table */}
                {examScoreClass && examScoreSubject && (() => {
                  const subjectStudents = getStudentsForSubject(examScoreClass, examScoreSubject);
                  return (
                  <div>
                    {subjectStudents.length === 0 ? (
                      <p className="text-sm text-slate-500">No students taking {examScoreSubject} in {examScoreClass}.</p>
                    ) : (
                      <>
                        <p className="text-xs text-slate-500 mb-2">{subjectStudents.length} students taking {examScoreSubject} in {examScoreClass}</p>
                        <table className="w-full text-sm border">
                          <thead>
                            <tr className="bg-slate-100 border-b">
                              <th className="text-left p-2 w-8">#</th>
                              <th className="text-left p-2">Student Name</th>
                              <th className="text-center p-2 w-24">Score</th>
                              <th className="text-center p-2 w-16">/100</th>
                            </tr>
                          </thead>
                          <tbody>
                            {subjectStudents.map((s, i) => {
                              const existing = scores.find((sc: any) => sc.exam_id === selectedExam.id && sc.student_name === s && sc.class_name === examScoreClass && sc.subject === examScoreSubject);
                              return (
                                <tr key={i} className="border-b">
                                  <td className="p-2 text-slate-400">{i + 1}</td>
                                  <td className="p-2 font-medium">{s}</td>
                                  <td className="p-1"><input type="number" min={0} max={100} value={examScores[s] ?? existing?.score ?? ''} onChange={e => setExamScores(prev => ({...prev, [s]: e.target.value}))} className="w-full border px-2 py-1 rounded text-center" placeholder={existing ? String(existing.score) : '—'} /></td>
                                  <td className="p-2 text-center text-slate-400">100</td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                        <button onClick={saveExamScores} disabled={loading} className="mt-4 bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-semibold disabled:opacity-50 w-full">
                          {loading ? 'Saving...' : `Save All Scores — ${selectedExam.name}`}
                        </button>
                      </>
                    )}
                  </div>
                  );
                })()}
              </div>
            );
            })()}

            {/* My submitted scores */}
            <div className="mt-6 border-t pt-4">
              <h3 className="font-bold mb-2">My Submitted Scores</h3>
              {scores.filter((s: any) => (s.teacher_id === user?.id || (!s.teacher_id && s.teacher_name === user?.name)) && exams.some((ex: any) => ex.id === s.exam_id && isExamOpen(ex, user?.id))).length === 0 ? <p className="text-sm text-slate-500">No scores yet.</p> : <div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="border-b text-slate-500 text-left"><th className="py-2">Student</th><th>Class</th><th>Subject</th><th>Score</th><th>Exam</th></tr></thead><tbody>{scores.filter((s: any) => (s.teacher_id === user?.id || (!s.teacher_id && s.teacher_name === user?.name)) && exams.some((ex: any) => ex.id === s.exam_id && isExamOpen(ex, user?.id))).map((s: any) => (<tr key={s.id} className="border-b border-slate-100"><td className="py-2">{s.student_name}</td><td>{s.class_name}</td><td>{s.subject}</td><td>{s.score}/{s.max_score}</td><td>{s.exam_name || s.term}</td></tr>))}</tbody></table></div>}
            </div>
          </div>
          )}

          {activeMenu === 'duty' && (
            <TeacherDutyForm teacherName={user?.name || ''} onSubmit={saveDuty} loading={loading} />
          )}

          {activeMenu === 'settings' && (
            <div className="bg-white p-6 rounded-2xl border">
              <h2 className="font-bold text-lg mb-4">My Account</h2>
              <p className="text-sm text-slate-600 mb-4">Name: <strong>{user?.name}</strong> | Username: <strong>{user?.username}</strong></p>
              <p className="text-sm text-slate-600 mb-4">Subjects: <strong>{(user?.subjects || []).join(', ') || 'None'}</strong></p>
              {myClass && <p className="text-sm text-slate-600 mb-4">Class Teacher of: <strong>{myClass}</strong></p>}
              <button onClick={() => setShowChangePassword(true)} className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-semibold">🔑 Change Password</button>
            </div>
          )}

          {printReport && <DutyReportPrint report={printReport} onClose={() => setPrintReport(null)} />}
        </div>
        </div>
      </div>
    );
  }

  // PARENT SCREEN
  if (screen === 'parent') {
    // Find student linked to this parent
    const parentPhone = user?.username || '';
    let parentStudentName = user?.studentName || '';
    let parentStudentClass = user?.studentClass || '';
    // Search all classes for student with this phone
    if (!parentStudentName) {
      Object.entries(students).forEach(([cls, list]) => {
        list.forEach(s => {
          if (s.phone === parentPhone) {
            parentStudentName = s.name;
            parentStudentClass = cls;
          }
        });
      });
    }

    const parentMenus = [
      { id: 'report_cards', label: 'Report Cards', icon: '📄' },
      { id: 'inbox', label: `Inbox (${messages.filter((m: any) => m.targetPhones?.includes(parentPhone)).length})`, icon: '✉️' },
      { id: 'settings', label: 'My Account', icon: '⚙️' },
    ];

    // Get available exams (only released terms)
    const parentExams = exams;

    return (
      <div className="min-h-screen bg-slate-100 flex">
        {/* Parent Sidebar */}
        <div className="w-52 bg-slate-900 text-white min-h-screen flex flex-col fixed left-0 top-0 z-40">
          <div className="p-3 border-b border-slate-700">
            <p className="text-xs font-bold">👨‍👩‍👧 Parent Portal</p>
            <p className="text-[9px] text-slate-400">{parentStudentName}</p>
          </div>
          <nav className="flex-1 py-2">
            {parentMenus.map(m => (
              <button key={m.id} onClick={() => setActiveMenu(m.id)} className={`w-full flex items-center gap-2 px-3 py-2.5 text-xs font-medium transition-all ${activeMenu === m.id ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
                <span>{m.icon}</span><span>{m.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="flex-1 ml-52">
          <div className="bg-white border-b px-6 py-3 flex justify-between items-center sticky top-0 z-30">
            <div>
              <span className="text-sm font-bold">👨‍👩‍👧 Parent: {user?.name}</span>
              <span className="text-xs text-slate-400 ml-2">Student: {parentStudentName} ({parentStudentClass})</span>
            </div>
            <button onClick={logout} className="px-3 py-1.5 bg-red-500 text-white rounded-lg text-xs font-semibold">Logout</button>
          </div>

          {showChangePassword && (
            <div className="bg-amber-50 border-b border-amber-200 px-6 py-4">
              <div className="max-w-md mx-auto space-y-2">
                <h3 className="font-bold text-sm">Change Password</h3>
                <input type="password" placeholder="Current password" value={oldPass} onChange={e => setOldPass(e.target.value)} className="w-full border px-3 py-2 rounded-xl text-sm" />
                <input type="password" placeholder="New password" value={newPass} onChange={e => setNewPass(e.target.value)} className="w-full border px-3 py-2 rounded-xl text-sm" />
                <input type="password" placeholder="Confirm new password" value={confirmPass} onChange={e => setConfirmPass(e.target.value)} className="w-full border px-3 py-2 rounded-xl text-sm" />
                <div className="flex gap-2">
                  <button onClick={changePassword} className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-xs font-semibold">Save</button>
                  <button onClick={() => { setShowChangePassword(false); setOldPass(''); setNewPass(''); setConfirmPass(''); }} className="bg-slate-200 text-slate-700 px-4 py-2 rounded-xl text-xs font-semibold">Cancel</button>
                </div>
              </div>
            </div>
          )}

          <div className="p-6 max-w-4xl mx-auto space-y-6">
            {activeMenu === 'report_cards' && (
              <div className="bg-white p-6 rounded-2xl border">
                <h2 className="font-bold text-lg mb-4">📄 Report Cards — {parentStudentName}</h2>
                <p className="text-sm text-slate-500 mb-4">Select an exam to view your child's report card.</p>

                <select value={selectedParentExam} onChange={e => setSelectedParentExam(e.target.value)} className="w-full border px-3 py-2.5 rounded-xl mb-4">
                  <option value="">-- Select Exam --</option>
                  {parentExams.map((ex: any) => {
                    const isReleased = released.includes(ex.term);
                    return isReleased ? <option key={ex.id} value={ex.id}>{ex.name} ({ex.term})</option> : null;
                  })}
                </select>

                {selectedParentExam && (() => {
                  const ex = exams.find((e: any) => e.id === selectedParentExam);
                  if (!ex) return <p className="text-sm text-slate-500">Exam not found.</p>;
                  if (!released.includes(ex.term)) return <p className="text-sm text-amber-600">Results for {ex.term} have not been released yet.</p>;

                  const examScoresAll = scores.filter((s: any) => s.exam_id === selectedParentExam && s.student_name === parentStudentName);
                  if (examScoresAll.length === 0) return <p className="text-sm text-slate-500">No results found for this exam.</p>;

                  const getGradeP = (score: number) => score >= 75 ? 'A' : score >= 65 ? 'B' : score >= 45 ? 'C' : score >= 30 ? 'D' : 'F';
                  const getPointP = (score: number) => score >= 75 ? 1 : score >= 65 ? 2 : score >= 45 ? 3 : score >= 30 ? 4 : 5;
                  const getRemarkP = (score: number) => score >= 75 ? 'Bora Sana' : score >= 65 ? 'Vizuri Sana' : score >= 45 ? 'Vizuri' : score >= 30 ? 'Wastani' : 'Inahitaji Jitihada';
                  const totalScore = examScoresAll.reduce((a: number, s: any) => a + s.score, 0);
                  const avg = examScoresAll.length > 0 ? totalScore / examScoresAll.length : 0;
                  const points = examScoresAll.map((s: any) => getPointP(s.score)).sort((a: number, b: number) => a - b).slice(0, 7);
                  const totalPts = points.reduce((a: number, b: number) => a + b, 0);
                  const div = totalPts >= 7 && totalPts <= 17 ? 'I' : totalPts >= 18 && totalPts <= 21 ? 'II' : totalPts >= 22 && totalPts <= 25 ? 'III' : totalPts >= 26 && totalPts <= 33 ? 'IV' : '0';

                  // Auto-generate comments — KISWAHILI, 4 kwa kila daraja kulingana na wastani, kila comment inataja jina
                  const firstName = parentStudentName.split(' ')[0];
                  const avgP = avg;
                  const divP = div;
                  function getAcademicCommentSwP(name: string, division: string, av: number): string {
                    const a = av.toFixed(1);
                    if (division === 'I') {
                      if (av >= 80) return `Hongera sana ${name}! Umefanya vizuri sana kwa Daraja la I wastani ${a}%. Endelea na moyo huo huo na uwe mfano kwa wenzako.`;
                      if (av >= 70) return `Hongera ${name} kwa Daraja la I! Wastani ${a}% unaonyesha juhudi kubwa. Zingatia masomo dhaifu ili upande zaidi.`;
                      if (av >= 60) return `Vizuri sana ${name}! Daraja la I wastani ${a}% ni mafanikio makubwa. Usibweteke, endelea kupanga muda vizuri.`;
                      return `Hongera ${name} kwa Daraja la I wastani ${a}%. Umeonyesha uwezo. Jitahidi kuongeza bidii ili wastani uongezeke.`;
                    }
                    if (division === 'II') {
                      if (av >= 65) return `Hongera sana ${name}! Daraja la II wastani ${a}% ni juhudi nzuri sana. Uko karibu na Daraja la I.`;
                      if (av >= 55) return `Vizuri sana ${name}! Daraja la II wastani ${a}% linaonyesha uwezo. Endelea kusoma kwa mpangilio.`;
                      if (av >= 45) return `Hongera ${name} kwa Daraja la II! Wastani ${a}% ni wa kuridhisha. Kuna masomo bado — yape kipaumbele.`;
                      return `Hongera ${name} kwa Daraja la II wastani ${a}%. Bado una nafasi kubwa ya kuboresha. Punguza utoro.`;
                    }
                    if (division === 'III') {
                      if (av >= 55) return `Hongera ${name}! Daraja la III wastani ${a}% — uko njia sahihi. Ongeza extra hours utapanda Daraja la II.`;
                      if (av >= 45) return `Vizuri ${name}, Daraja la III wastani ${a}% ni hatua nzuri. Tambua masomo uliyofeli na yafanyie kazi.`;
                      if (av >= 35) return `${name}, Daraja la III wastani ${a}% linaonyesha wastani. Usikate tamaa — weka ratiba ya kusoma kila siku.`;
                      return `${name}, Daraja la III wastani ${a}%. Bado unahitaji juhudi zaidi. Anza mapema kujiandaa.`;
                    }
                    if (division === 'IV') {
                      if (av >= 45) return `${name}, Daraja la IV wastani ${a}% — umefaulu lakini chini. Unaweza kupanda Daraja la III kama utaongeza bidii.`;
                      if (av >= 35) return `${name}, Daraja la IV wastani ${a}%. Hii ni ishara ya kujituma zaidi. Hudhuria masomo yote.`;
                      if (av >= 25) return `${name}, Daraja la IV wastani ${a}% linahitaji jitihada za ziada. Usikate tamaa — kila hatua ni muhimu.`;
                      return `${name}, Daraja la IV wastani ${a}% linaonyesha changamoto. Lakini una nafasi ya kubadilika.`;
                    }
                    if (av >= 30) return `Pole sana ${name}, Daraja 0 wastani ${a}%. Uko karibu kufaulu — ongeza juhudi maradufu.`;
                    if (av >= 20) return `${name}, Daraja 0 wastani ${a}% ni changamoto, lakini si mwisho. Weka malengo madogo ya kila wiki.`;
                    if (av >= 10) return `${name}, Daraja 0 wastani ${a}%. Hii ni wito wa kuamka — acha kukata tamaa, anza upya kwa nidhamu.`;
                    return `${name}, Daraja 0 wastani ${a}% linahitaji msaada wa haraka. Shule iko tayari kukusaidia.`;
                  }
                  function getHeadmasterCommentSwP(name: string, division: string, av: number): string {
                    const a = av.toFixed(1);
                    if (division === 'I') {
                      if (av >= 80) return `${name} ni fahari ya shule! Daraja la I wastani ${a}% linaonyesha nidhamu kubwa. Endelea kuwa kiongozi mwema.`;
                      if (av >= 70) return `Hongera sana ${name}! Shule inajivunia Daraja la I wastani ${a}%. Endelea na moyo wa kujifunza.`;
                      if (av >= 60) return `${name} hongera kwa Daraja la I! Wastani ${a}% unaonyesha juhudi zinalipa. Shule inakutia moyo.`;
                      return `Hongera ${name} kwa Daraja la I wastani ${a}%. Shule inatambua juhudi zako na inakuhimiza zaidi.`;
                    }
                    if (division === 'II') {
                      if (av >= 65) return `${name}, Daraja la II wastani ${a}% ni hatua kubwa. Shule inaamini unaweza kufika Daraja la I.`;
                      if (av >= 55) return `Hongera ${name}! Daraja la II wastani ${a}% linaonyesha unasonga mbele vizuri.`;
                      if (av >= 45) return `${name}, Daraja la II wastani ${a}% — shule inaona juhudi zako. Endelea kushirikiana na walimu.`;
                      return `${name}, Daraja la II wastani ${a}% linaonyesha umejitahidi. Shule inakushauri kupunguza utoro.`;
                    }
                    if (division === 'III') {
                      if (av >= 55) return `${name}, Daraja la III wastani ${a}% — shule inakupa hongera. Umeonyesha maendeleo.`;
                      if (av >= 45) return `Hongera ${name} kwa Daraja la III! Wastani ${a}% unaonyesha wastani. Tumia maktaba zaidi.`;
                      if (av >= 35) return `${name}, Daraja la III wastani ${a}% — shule inakuhimiza kujituma zaidi. Epuka marafiki wanaokupotezea muda.`;
                      return `${name}, Daraja la III wastani ${a}% linahitaji mabadiliko ya mtindo wa kusoma. Shule iko tayari kukusaidia.`;
                    }
                    if (division === 'IV') {
                      if (av >= 45) return `${name}, Daraja la IV wastani ${a}% — shule inakutia moyo. Bado una nafasi ya kupanda.`;
                      if (av >= 35) return `Pole ${name} kwa Daraja la IV wastani ${a}%. Shule inakushauri kuongeza nidhamu.`;
                      if (av >= 25) return `${name}, Daraja la IV wastani ${a}% — shule inakukumbusha kila siku ni nafasi mpya.`;
                      return `${name}, Daraja la IV wastani ${a}% linahitaji juhudi za dharura. Tuko pamoja kukusaidia.`;
                    }
                    if (av >= 30) return `Pole sana ${name}, Daraja 0 wastani ${a}%. Shule haijakata tamaa kwako.`;
                    if (av >= 20) return `${name}, Daraja 0 wastani ${a}% — shule inakuhimiza uanze upya leo.`;
                    if (av >= 10) return `${name}, Daraja 0 wastani ${a}% — shule inakualika kwenye ushauri wa kitaaluma.`;
                    return `${name}, Daraja 0 wastani ${a}% — shule bado inakuamini. Elimu ni safari.`;
                  }
                  let acCommentP = getAcademicCommentSwP(firstName, divP, avgP);
                  let hmCommentP = getHeadmasterCommentSwP(firstName, divP, avgP);

                  // Behavior
                  const bDataP = JSON.parse(localStorage.getItem('sms_behavior') || '{}');
                  const studentBehaviorP = bDataP[parentStudentName] || {};
                  const behaviorCatsP = ['Discipline','Punctuality','Attendance','Respectfulness','Responsibility','Class Participation','Cooperation','Neatness','Self-Control','Leadership & Initiative'];
                  const ctIdP = Object.entries(classTeachers).find(([c]) => c === parentStudentClass)?.[1];
                  const ctNameP = users.find((u: any) => u.id === ctIdP)?.name || '';
                  const acNameP = localStorage.getItem('sms_academic_name') || '';
                  const hmNameP = localStorage.getItem('sms_headmaster_name') || '';
                  const schoolNameP = localStorage.getItem('sms_school_name_setting') || '';
                  const mottoP = localStorage.getItem('sms_school_motto') || '';

                  // Print function
                  const printParentReport = () => {
                    const pw = window.open('', '', 'width=800,height=1000');
                    if (!pw) return;
                    const logo = localStorage.getItem('sms_school_logo') || '';
                    const addr = localStorage.getItem('sms_school_address') || '';
                    const dist = localStorage.getItem('sms_district_name') || '';
                    const acSigP = localStorage.getItem('sms_academic_sig') || '';
                    const hmSigP = localStorage.getItem('sms_headmaster_sig') || '';
                    pw.document.write(`<!DOCTYPE html><html><head><title>\u00A0</title><style>@page{size:A4 portrait;margin:10mm 12mm 8mm 12mm;}*{margin:0;padding:0;box-sizing:border-box;}body{font-family:Arial,sans-serif;font-size:13px;color:#000;}table{width:100%;border-collapse:collapse;margin:6px 0;}th,td{border:1px solid #000;padding:5px 8px;font-size:12px;}th{background:#d4edda;font-size:12px;}.header{text-align:center;margin-bottom:8px;border-bottom:3px double #000;padding-bottom:6px;}.header img{height:55px;margin-bottom:3px;}.info-grid{display:grid;grid-template-columns:1fr 1fr;border:2px solid #000;margin-bottom:8px;font-size:13px;}.info-cell{padding:6px 10px;border:1px solid #000;}.grade-box{border:3px solid #000;padding:8px;text-align:center;margin:8px 0;background:#d4edda;border-radius:6px;}.comment-box{border:1px solid #000;padding:8px;border-radius:6px;margin-bottom:6px;}.comment-title{font-size:11px;font-weight:bold;text-decoration:underline;margin-bottom:3px;}.comment-text{font-size:11px;line-height:1.4;}.sig-row{display:flex;justify-content:space-between;margin-top:6px;font-size:11px;}.sig-img{height:50px; max-width:170px; object-fit:contain; display:block;}@media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact;}}</style></head><body><div class="header">`);
                    if (logo) pw.document.write(`<img src="${logo}" />`);
                    pw.document.write(`<div style="font-size:14px;font-weight:bold">${dist}</div><div style="font-size:20px;font-weight:bold;margin:2px 0">${schoolNameP}</div><div style="font-size:10px">${addr}</div><div style="font-size:15px;font-weight:bold;text-decoration:underline;margin-top:4px">RIPOTI YA MAENDELEO YA MWANAFUNZI</div><div style="font-size:12px;margin-top:2px">${ex.name}</div></div>`);
                    pw.document.write(`<div class="info-grid"><div class="info-cell">Jina la Mwanafunzi: <strong>${parentStudentName}</strong></div><div class="info-cell">Darasa: <strong>${parentStudentClass}</strong></div><div class="info-cell">Daraja: <strong>${div}</strong> | Pointi: <strong>${totalPts}</strong></div><div class="info-cell">Nafasi: <strong>—</strong></div></div>`);
                    pw.document.write(`<table><thead><tr><th style="text-align:left">Somo</th><th>Alama</th><th>Gredi</th><th>Pointi</th><th>Maelezo</th></tr></thead><tbody>`);
                    examScoresAll.forEach((s: any) => {
                      const c = s.score >= 45 ? '#006600' : '#cc0000';
                      pw.document.write(`<tr><td style="text-align:left;font-weight:bold">${s.subject}</td><td style="text-align:center;color:${c};font-weight:bold">${s.score}</td><td style="text-align:center;font-weight:bold;color:${c}">${getGradeP(s.score)}</td><td style="text-align:center">${getPointP(s.score)}</td><td style="text-align:center">${getRemarkP(s.score)}</td></tr>`);
                    });
                    pw.document.write(`<tr style="font-weight:bold;background:#d4edda"><td style="text-align:left">TOTAL (${examScoresAll.length})</td><td style="text-align:center">${totalScore}</td><td style="text-align:center">${getGradeP(avg)}</td><td style="text-align:center">${totalPts}</td><td style="text-align:center">${getRemarkP(avg)}</td></tr></tbody></table>`);
                    pw.document.write(`<div class="grade-box"><strong style="font-size:13px">Wastani: ${avg.toFixed(1)}% | Gredi: ${getGradeP(avg)} | Pointi: ${totalPts} | Daraja: ${div}</strong></div>`);
                    if (Object.keys(studentBehaviorP).length > 0) {
                      pw.document.write(`<table><thead><tr><th colspan="11" style="text-align:left;font-size:11px;background:#fff3cd">TATHMINI YA TABIA — Mwalimu wa Darasa: ${ctNameP}</th></tr><tr style="background:#fff3cd">`);
                      behaviorCatsP.forEach(c => pw.document.write(`<th style="font-size:8px;padding:3px;background:#fff3cd">${c}</th>`));
                      pw.document.write(`</tr></thead><tbody><tr>`);
                      behaviorCatsP.forEach(c => { const v = studentBehaviorP[c]||'-'; pw.document.write(`<td style="font-size:9px;text-align:center;font-weight:bold;color:${v==='Excellent'?'#006600':v==='Needs Improvement'?'#cc0000':'#333'}">${v}</td>`); });
                      pw.document.write(`</tr></tbody></table>`);
                    }
                    pw.document.write(`<div style="display:flex;gap:8px;margin-top:6px"><div class="comment-box" style="flex:1"><div class="comment-title">ACADEMIC MASTER:</div><div class="comment-text">${acCommentP}</div><div class="sig-row"><span>Name: <strong>${acNameP||'____'}</strong></span><span>${acSigP?`<img src="${acSigP}" class="sig-img"/>`:' Sign:____'}</span></div></div><div class="comment-box" style="flex:1"><div class="comment-title">HEADMASTER:</div><div class="comment-text">${hmCommentP}</div><div class="sig-row"><span>Name: <strong>${hmNameP}</strong></span><span>${hmSigP?`<img src="${hmSigP}" class="sig-img"/>`:' Sign:____'}</span></div></div></div>`);
                    pw.document.write(`<div style="text-align:center;margin-top:10px;font-size:10px;color:#555;font-style:italic;border-top:2px solid #ccc;padding-top:5px"><strong>${schoolNameP}</strong>: ${mottoP}</div></body></html>`);
                    pw.document.close();
                    setTimeout(() => { pw.focus(); pw.print(); }, 500);
                  };

                  return (
                    <div className="border rounded-xl p-4">
                      <div className="text-center mb-4">
                        <h3 className="font-bold text-lg">{ex.name}</h3>
                        <p className="text-sm text-slate-500">{parentStudentName} — {parentStudentClass}</p>
                      </div>
                      <table className="w-full text-sm border mb-4">
                        <thead><tr className="bg-emerald-50"><th className="text-left p-2 border">Subject</th><th className="p-2 border">Score</th><th className="p-2 border">Grade</th><th className="p-2 border">Points</th><th className="p-2 border">Remark</th></tr></thead>
                        <tbody>
                          {examScoresAll.map((s: any) => (
                            <tr key={s.id} className="border-b">
                              <td className="p-2 border font-medium">{s.subject}</td>
                              <td className={`p-2 border text-center font-bold ${s.score >= 45 ? 'text-green-700' : 'text-red-600'}`}>{s.score}</td>
                              <td className="p-2 border text-center font-bold">{getGradeP(s.score)}</td>
                              <td className="p-2 border text-center">{getPointP(s.score)}</td>
                              <td className="p-2 border text-center text-xs">{getRemarkP(s.score)}</td>
                            </tr>
                          ))}
                          <tr className="bg-slate-100 font-bold">
                            <td className="p-2 border">TOTAL ({examScoresAll.length} subjects)</td>
                            <td className="p-2 border text-center">{totalScore}</td>
                            <td className="p-2 border text-center">{getGradeP(avg)}</td>
                            <td className="p-2 border text-center">{totalPts}</td>
                            <td className="p-2 border text-center">{getRemarkP(avg)}</td>
                          </tr>
                        </tbody>
                      </table>
                      <div className="bg-emerald-50 border-2 border-emerald-300 rounded-xl p-4 text-center mb-4">
                        <p className="font-bold text-lg">Average: {avg.toFixed(1)}% | Division: {div} | Points: {totalPts}</p>
                      </div>
                      {/* Behavior */}
                      {Object.keys(studentBehaviorP).length > 0 && (
                        <div className="mb-4 overflow-x-auto">
                          <table className="w-full text-xs border"><thead><tr><th colSpan={11} className="text-left p-2 bg-amber-50 border">Behavior — Class Teacher: {ctNameP}</th></tr><tr className="bg-amber-50">{behaviorCatsP.map(c => <th key={c} className="border p-1 text-[9px]">{c}</th>)}</tr></thead>
                          <tbody><tr>{behaviorCatsP.map(c => <td key={c} className={`border p-1 text-center text-[10px] font-bold ${studentBehaviorP[c]==='Excellent'?'text-green-700':studentBehaviorP[c]==='Needs Improvement'?'text-red-600':''}`}>{studentBehaviorP[c]||'-'}</td>)}</tr></tbody></table>
                        </div>
                      )}
                      {/* Comments */}
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="border rounded-xl p-3"><p className="text-xs font-bold mb-1">Academic Master:</p><p className="text-xs text-slate-700">{acCommentP}</p><p className="text-xs text-slate-400 mt-2">{acNameP}</p></div>
                        <div className="border rounded-xl p-3"><p className="text-xs font-bold mb-1">Headmaster:</p><p className="text-xs text-slate-700">{hmCommentP}</p><p className="text-xs text-slate-400 mt-2">{hmNameP}</p></div>
                      </div>
                      <button onClick={printParentReport} className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold">🖨️ Download / Print Report Card</button>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* Parent Inbox */}
            {activeMenu === 'inbox' && (
              <div className="bg-white p-6 rounded-2xl border">
                <h2 className="font-bold text-lg mb-4">✉️ Inbox</h2>
                {(() => {
                  const myMessages = messages.filter((m: any) => m.targetPhones?.includes(parentPhone));
                  if (myMessages.length === 0) return <p className="text-sm text-slate-500">No messages yet.</p>;
                  return myMessages.map((m: any) => (
                    <div key={m.id} className="border rounded-xl p-4 mb-3 hover:bg-slate-50">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-sm">{m.subject}</h3>
                        <span className="text-xs text-slate-400">{new Date(m.date).toLocaleDateString()}</span>
                      </div>
                      <p className="text-sm text-slate-700 leading-relaxed">{m.text}</p>
                      <p className="text-xs text-slate-400 mt-2">From: {m.sender}</p>
                    </div>
                  ));
                })()}
              </div>
            )}

            {activeMenu === 'settings' && (
              <div className="bg-white p-6 rounded-2xl border">
                <h2 className="font-bold text-lg mb-4">My Account</h2>
                <p className="text-sm text-slate-600 mb-2">Name: <strong>{user?.name}</strong></p>
                <p className="text-sm text-slate-600 mb-2">Phone (Username): <strong>{user?.username}</strong></p>
                <p className="text-sm text-slate-600 mb-4">Student: <strong>{parentStudentName}</strong> ({parentStudentClass})</p>
                <button onClick={() => setShowChangePassword(true)} className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-semibold">🔑 Change Password</button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return null;
}
