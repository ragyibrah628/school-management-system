import { useState, useRef } from 'react';

function getSchoolLogo(): string {
  return localStorage.getItem('sms_school_logo') || '';
}
function getSchoolName(): string {
  return localStorage.getItem('sms_school_name_setting') || 'NAMBAWALA SECONDARY SCHOOL';
}
function getDistrictName(): string {
  return localStorage.getItem('sms_district_name') || 'RUANGWA DISTRICT COUNCIL';
}
function getHeadmasterNameSetting(): string {
  return localStorage.getItem('sms_headmaster_name') || 'Saidi Mpambika';
}

function getSchoolClasses(): string[] {
  try {
    const saved = JSON.parse(localStorage.getItem('sms_school_classes') || '[]');
    return saved.length > 0 ? saved : ['Form IA', 'Form IB', 'Form IC', 'Form IIA', 'Form IIB', 'Form IIC', 'Form IIIA', 'Form IIIB', 'Form IIIC', 'Form IVA', 'Form IVB', 'Form IVC'];
  } catch { return ['Form IA', 'Form IB', 'Form IC', 'Form IIA', 'Form IIB', 'Form IIC', 'Form IIIA', 'Form IIIB', 'Form IIIC', 'Form IVA', 'Form IVB', 'Form IVC']; }
}

const SECTION_OPTIONS: Record<string, string[]> = {
  punctuality: [
    'All students arrived on time',
    'Most students arrived on time with few latecomers',
    'Many students arrived late'
  ],
  cleanliness: [
    'School compound and classrooms are clean',
    'Classrooms clean but compound needs attention',
    'General cleanliness needs improvement'
  ],
  academics: [
    'All lessons conducted as per timetable',
    'Most lessons conducted, few teachers absent',
    'Several lessons not conducted due to teacher absence'
  ],
  discipline: [
    'Students were well disciplined throughout the day',
    'Minor disciplinary issues handled by class teachers',
    'Major disciplinary cases reported and addressed'
  ],
  breakfast_meal: [
    'Breakfast and meals served on time, students satisfied',
    'Meals served on time but quality needs improvement',
    'Delays in meal service observed'
  ],
  health: [
    'No health issues reported',
    'Minor health cases attended at school dispensary',
    'Students referred to hospital for treatment'
  ],
  visitors: [
    'No visitors today',
    'Official visitors received and attended',
    'Parents visited for student-related matters'
  ],
  security: [
    'School security is good, no incidents',
    'Minor security concerns observed and reported',
    'Security breach reported to administration'
  ],
  sports_games: [
    'Sports and games activities conducted as planned',
    'Evening games conducted normally',
    'No sports activities today'
  ],
};

const SPECIAL_EVENT_OPTIONS = [
  'School assembly conducted',
  'Parents meeting held',
  'Examination in progress',
  'Sports competition conducted',
  'Guest speaker/seminar held',
  'National holiday celebration',
  'School inspection by officials',
  'Inter-school competition',
  'Community service/cleanup',
  'No special events today'
];

const REPORT_SECTIONS = [
  { id: 'punctuality', label: '1. PUNCTUALITY' },
  { id: 'cleanliness', label: '2. CLEANLINESS' },
  { id: 'academics', label: '3. ACADEMICS' },
  { id: 'discipline', label: '4. DISCIPLINE' },
  { id: 'breakfast_meal', label: '5. BREAKFAST & MEAL' },
  { id: 'health', label: '6. HEALTH' },
  { id: 'visitors', label: '7. VISITORS' },
  { id: 'special_events', label: '8. SPECIAL EVENT(S)' },
  { id: 'security', label: '9. SECURITY' },
  { id: 'sports_games', label: '10. SPORT AND GAMES' },
];

interface ClassRow {
  className: string;
  regB: number; regG: number;
  presB: number; presG: number;
  sickB: number; sickG: number;
  permB: number; permG: number;
}

const emptyRow = (cls: string): ClassRow => ({
  className: cls, regB: 0, regG: 0, presB: 0, presG: 0, sickB: 0, sickG: 0, permB: 0, permG: 0
});

function generateHeadmasterComment(attendance: ClassRow[], sections: Record<string, string>): string {
  const totals = attendance.reduce((acc, r) => {
    const reg = r.regB + r.regG;
    const pres = r.presB + r.presG;
    const abs = reg - pres;
    return {
      reg: acc.reg + reg,
      pres: acc.pres + pres,
      abs: acc.abs + abs,
      sick: acc.sick + r.sickB + r.sickG,
      perm: acc.perm + r.permB + r.permG,
    };
  }, { reg: 0, pres: 0, abs: 0, sick: 0, perm: 0 });

  const pct = totals.reg > 0 ? ((totals.pres / totals.reg) * 100) : 0;
  let comment = '';

  if (pct >= 90) {
    comment += `Attendance is excellent at ${pct.toFixed(1)}%. `;
  } else if (pct >= 75) {
    comment += `Attendance is good at ${pct.toFixed(1)}%. `;
  } else if (pct >= 60) {
    comment += `Attendance needs improvement at ${pct.toFixed(1)}%. Class teachers should follow up on absent students. `;
  } else if (totals.reg > 0) {
    comment += `Attendance is critically low at ${pct.toFixed(1)}%. Urgent action required to address absenteeism. `;
  }

  if (totals.sick > 0) {
    comment += `${totals.sick} student(s) reported sick. `;
  }
  if (totals.abs > 5) {
    comment += `${totals.abs} student(s) absent requires follow-up. `;
  }

  const events = sections['special_events'] || '';
  if (events && events !== 'No special events today' && events.trim()) {
    comment += `Special events noted. `;
  }

  const discipline = sections['discipline'] || '';
  if (discipline.toLowerCase().includes('major')) {
    comment += `Disciplinary matters should be addressed by the discipline committee. `;
  }

  if (comment) {
    comment += 'The TOD report is acknowledged.';
  } else {
    comment = 'No data entered yet.';
  }

  return comment;
}

// Get registered students set by admin
function getRegistered(): Record<string, { regB: number; regG: number }> {
  try {
    const saved = localStorage.getItem('sms_registered_students');
    return saved ? JSON.parse(saved) : {};
  } catch {
    return {};
  }
}

function saveRegistered(data: Record<string, { regB: number; regG: number }>) {
  localStorage.setItem('sms_registered_students', JSON.stringify(data));
}

// Admin component to set registered students per class
export function AdminRegisteredStudents() {
  const [data, setData] = useState<Record<string, { regB: number; regG: number }>>(() => getRegistered());

  const update = (cls: string, field: 'regB' | 'regG', val: number) => {
    const newData = { ...data, [cls]: { ...(data[cls] || { regB: 0, regG: 0 }), [field]: val } };
    setData(newData);
    saveRegistered(newData);
  };

  return (
    <div className="bg-white p-6 rounded-2xl border">
      <h2 className="font-bold text-lg mb-2">Set Registered Students Per Class</h2>
      <p className="text-xs text-slate-500 mb-4">These numbers are used in the Teacher Duty Report. Only admin can change them.</p>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse border border-slate-300">
          <thead>
            <tr className="bg-slate-100">
              <th className="border border-slate-300 p-2">Class</th>
              <th className="border border-slate-300 p-2">Boys (B)</th>
              <th className="border border-slate-300 p-2">Girls (G)</th>
              <th className="border border-slate-300 p-2">Total</th>
            </tr>
          </thead>
          <tbody>
            {getSchoolClasses().map(cls => {
              const row = data[cls] || { regB: 0, regG: 0 };
              return (
                <tr key={cls}>
                  <td className="border border-slate-300 p-2 font-bold text-center bg-slate-50">{cls}</td>
                  <td className="border border-slate-300 p-0">
                    <input type="number" value={row.regB || ''} onChange={e => update(cls, 'regB', Number(e.target.value))} className="w-full p-2 text-center" min={0} />
                  </td>
                  <td className="border border-slate-300 p-0">
                    <input type="number" value={row.regG || ''} onChange={e => update(cls, 'regG', Number(e.target.value))} className="w-full p-2 text-center" min={0} />
                  </td>
                  <td className="border border-slate-300 p-2 text-center font-semibold bg-slate-50">{row.regB + row.regG}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-emerald-600 mt-2 font-semibold">✅ Changes are saved automatically</p>
    </div>
  );
}

export function TeacherDutyForm({ teacherName, onSubmit, loading }: { teacherName: string; onSubmit: (data: any) => void; loading: boolean }) {
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [sections, setSections] = useState<Record<string, string>>(() => {
    const s: Record<string, string> = {};
    REPORT_SECTIONS.forEach(r => { s[r.id] = ''; });
    return s;
  });
  const [specialEventManual, setSpecialEventManual] = useState('');
  const [visitorDetails, setVisitorDetails] = useState('');

  // Get registered from admin settings
  const registered = getRegistered();

  const [attendance, setAttendance] = useState<ClassRow[]>(
    getSchoolClasses().map(cls => ({
      ...emptyRow(cls),
      regB: registered[cls]?.regB || 0,
      regG: registered[cls]?.regG || 0,
    }))
  );

  const [todComment, setTodComment] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submittedReport, setSubmittedReport] = useState<any>(null);

  const updateSection = (id: string, val: string) => setSections({ ...sections, [id]: val });

  const updateRow = (idx: number, field: 'presB' | 'presG' | 'sickB' | 'sickG' | 'permB' | 'permG', val: number) => {
    const rows = [...attendance];
    const row = { ...rows[idx] };
    (row as any)[field] = val;

    // Validate sick + permitted don't exceed absents
    const reg = row.regB + row.regG;
    const pres = row.presB + row.presG;
    const abs = Math.max(0, reg - pres);
    const totalSickPerm = row.sickB + row.sickG + row.permB + row.permG;

    if (totalSickPerm > abs) {
      alert(`Sick + Permitted (${totalSickPerm}) cannot exceed Absent students (${abs}) for class ${row.className}`);
      return;
    }

    // Validate presents don't exceed registered
    if (row.presB > row.regB) { alert(`Present Boys cannot exceed Registered Boys for ${row.className}`); return; }
    if (row.presG > row.regG) { alert(`Present Girls cannot exceed Registered Girls for ${row.className}`); return; }

    rows[idx] = row;
    setAttendance(rows);
  };

  const totals = attendance.reduce((acc, r) => {
    const absB = Math.max(0, r.regB - r.presB);
    const absG = Math.max(0, r.regG - r.presG);
    return {
      regB: acc.regB + r.regB, regG: acc.regG + r.regG,
      presB: acc.presB + r.presB, presG: acc.presG + r.presG,
      absB: acc.absB + absB, absG: acc.absG + absG,
      sickB: acc.sickB + r.sickB, sickG: acc.sickG + r.sickG,
      permB: acc.permB + r.permB, permG: acc.permG + r.permG,
    };
  }, { regB: 0, regG: 0, presB: 0, presG: 0, absB: 0, absG: 0, sickB: 0, sickG: 0, permB: 0, permG: 0 });

  const totalReg = totals.regB + totals.regG;
  const totalPres = totals.presB + totals.presG;
  const percentage = totalReg > 0 ? ((totalPres / totalReg) * 100).toFixed(1) : '0.0';

  const finalSections = { ...sections };
  if (specialEventManual.trim()) {
    finalSections['special_events'] = (finalSections['special_events'] ? finalSections['special_events'] + '. ' : '') + specialEventManual;
  }
  if (visitorDetails.trim() && sections['visitors']?.includes('Official')) {
    finalSections['visitors'] = finalSections['visitors'] + '. Details: ' + visitorDetails;
  }

  // Generate positive TOD comment options
  const generateTodComments = (): string[] => {
    const pct = totalReg > 0 ? Number(percentage) : 0;
    const issues: string[] = [];
    if (sections['punctuality']?.toLowerCase().includes('late')) issues.push('punctuality');
    if (sections['cleanliness']?.toLowerCase().includes('improvement') || sections['cleanliness']?.toLowerCase().includes('attention')) issues.push('cleanliness');
    if (sections['academics']?.toLowerCase().includes('absent') || sections['academics']?.toLowerCase().includes('not conducted')) issues.push('academic delivery');
    if (sections['discipline']?.toLowerCase().includes('major') || sections['discipline']?.toLowerCase().includes('minor')) issues.push('discipline');
    if (sections['breakfast_meal']?.toLowerCase().includes('improvement') || sections['breakfast_meal']?.toLowerCase().includes('delays')) issues.push('meal services');
    if (sections['health']?.toLowerCase().includes('referred') || sections['health']?.toLowerCase().includes('cases')) issues.push('health matters');
    if (sections['security']?.toLowerCase().includes('concern') || sections['security']?.toLowerCase().includes('breach')) issues.push('security');

    const improvePart = issues.length > 0
      ? ` We are committed to improving ${issues.join(', ')} in the coming days to ensure a better learning environment for all students.`
      : '';

    const comments: string[] = [];

    if (pct >= 85) {
      comments.push(`Alhamdulillah, the day was productive with a good attendance of ${percentage}%. School activities were conducted well and the environment was conducive for learning.${improvePart} We look forward to an even better day tomorrow.`);
      comments.push(`Today was a successful school day with ${percentage}% attendance. The students and staff cooperated well in maintaining school standards.${improvePart} We remain optimistic and committed to continuous improvement in all areas.`);
    } else if (pct >= 60) {
      comments.push(`The school day was generally positive. Although attendance was at ${percentage}%, we appreciate the effort of students who attended. We will continue to encourage more students to attend regularly.${improvePart} Together, we will achieve better results in the days ahead.`);
      comments.push(`Today we recorded ${percentage}% attendance. While there is room for improvement, the school activities were conducted in an orderly manner.${improvePart} We are confident that with continued effort, attendance and overall performance will improve.`);
    } else {
      comments.push(`Despite lower attendance of ${percentage}% today, the school day was conducted peacefully. We acknowledge the challenges and remain committed to working with parents and students to improve attendance.${improvePart} Every day is an opportunity to do better, and we will strive for improvement.`);
      comments.push(`Today's attendance stood at ${percentage}%. We appreciate all students who made it to school and the staff who ensured smooth operations.${improvePart} We are dedicated to finding solutions to improve attendance and will continue working towards a better school experience for everyone.`);
    }

    return comments;
  };

  const todCommentOptions = generateTodComments();

  const autoHmComment = generateHeadmasterComment(attendance, finalSections);

  const HEADMASTER_NAME = getHeadmasterNameSetting();

  const handleSubmit = () => {
    if (!date || !todComment) { alert('Please fill the date and select a TOD comment'); return; }
    const fullAttendance = attendance.map(r => ({
      ...r,
      absB: Math.max(0, r.regB - r.presB),
      absG: Math.max(0, r.regG - r.presG),
    }));
    const reportData = {
      id: 'dr-' + Date.now(),
      teacher_name: teacherName,
      date,
      sections: finalSections,
      attendance: fullAttendance,
      tod_comment: todComment,
      tod_name: teacherName,
      headmaster_comment: autoHmComment,
      headmaster_name: HEADMASTER_NAME,
      present_count: totalPres,
      absent_count: totals.absB + totals.absG,
    };
    onSubmit(reportData);
    setSubmitted(true);
    setSubmittedReport(reportData);
  };

  const logo = getSchoolLogo();

  return (
    <div className="space-y-6">
      {/* FORM 1: Daily Report */}
      <div className="bg-white p-6 rounded-2xl border">
        <div className="text-center mb-4 border-b pb-4">
          {logo && <img src={logo} alt="Logo" className="h-14 mx-auto mb-2" />}
          <p className="text-xs text-slate-500 uppercase font-semibold">{getDistrictName()}</p>
          <h2 className="font-bold text-lg">{getSchoolName()}</h2>
          <h3 className="font-bold">TEACHER'S DUTY REPORT</h3>
        </div>
        <div className="flex justify-between items-center mb-4">
          <div className="text-sm"><span className="font-semibold">TEACHER ON DUTY:</span> {teacherName}</div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold">DATE:</span>
            <input type="date" value={date} onChange={e => setDate(e.target.value)} className="border px-2 py-1 rounded-lg text-sm" />
          </div>
        </div>

        <div className="space-y-4">
          {REPORT_SECTIONS.map(section => (
            <div key={section.id}>
              <label className="font-bold text-sm text-slate-800 block mb-1">{section.label}</label>
              {section.id === 'special_events' ? (
                <div className="space-y-2">
                  <select value={sections[section.id]} onChange={e => updateSection(section.id, e.target.value)} className="w-full border px-3 py-2 rounded-xl text-sm">
                    <option value="">-- Select event --</option>
                    {SPECIAL_EVENT_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                  <textarea value={specialEventManual} onChange={e => setSpecialEventManual(e.target.value)} placeholder="Write additional details here..." className="w-full border px-3 py-2 rounded-xl text-sm" rows={2} />
                </div>
              ) : section.id === 'visitors' ? (
                <div className="space-y-2">
                  <select value={sections[section.id]} onChange={e => updateSection(section.id, e.target.value)} className="w-full border px-3 py-2 rounded-xl text-sm">
                    <option value="">-- Select --</option>
                    {(SECTION_OPTIONS[section.id] || []).map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                  {sections[section.id]?.includes('Official') && (
                    <textarea value={visitorDetails} onChange={e => setVisitorDetails(e.target.value)} placeholder="Specify: Who visited? From where? Which organization/company? Purpose of visit..." className="w-full border px-3 py-2 rounded-xl text-sm border-indigo-200 bg-indigo-50" rows={2} />
                  )}
                </div>
              ) : (
                <select value={sections[section.id]} onChange={e => updateSection(section.id, e.target.value)} className="w-full border px-3 py-2 rounded-xl text-sm">
                  <option value="">-- Select --</option>
                  {(SECTION_OPTIONS[section.id] || []).map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* FORM 2: Attendance Table */}
      <div className="bg-white p-6 rounded-2xl border">
        <div className="text-center mb-4 border-b pb-4">
          {logo && <img src={logo} alt="Logo" className="h-14 mx-auto mb-2" />}
          <p className="text-xs text-slate-500 uppercase font-semibold">{getDistrictName()}</p>
          <h2 className="font-bold text-lg">{getSchoolName()}</h2>
          <h3 className="font-bold">TEACHER'S DUTY REPORT</h3>
          <p className="text-sm mt-1">STUDENTS ATTENDANCE ON <strong>{date}</strong></p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse border border-slate-300">
            <thead>
              <tr className="bg-slate-100">
                <th rowSpan={2} className="border border-slate-300 p-1 text-center">CLASS</th>
                <th colSpan={3} className="border border-slate-300 p-1 text-center">REGISTERED</th>
                <th colSpan={3} className="border border-slate-300 p-1 text-center">PRESENTS</th>
                <th colSpan={3} className="border border-slate-300 p-1 text-center">ABSENTS</th>
                <th colSpan={3} className="border border-slate-300 p-1 text-center">SICK</th>
                <th colSpan={3} className="border border-slate-300 p-1 text-center">PERMITTED</th>
                <th rowSpan={2} className="border border-slate-300 p-1 text-center">TOTAL</th>
              </tr>
              <tr className="bg-slate-50">
                {['B','G','T','B','G','T','B','G','T','B','G','T','B','G','T'].map((h,i) => (
                  <th key={i} className="border border-slate-300 p-0.5 text-center">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {attendance.map((row, idx) => {
                const absB = Math.max(0, row.regB - row.presB);
                const absG = Math.max(0, row.regG - row.presG);
                return (
                  <tr key={idx}>
                    <td className="border border-slate-300 p-1 font-bold text-center bg-slate-50">{row.className}</td>
                    {/* REGISTERED - Read only (set by admin) */}
                    <td className="border border-slate-300 p-1 text-center bg-gray-100 font-semibold">{row.regB}</td>
                    <td className="border border-slate-300 p-1 text-center bg-gray-100 font-semibold">{row.regG}</td>
                    <td className="border border-slate-300 p-1 text-center bg-gray-100 font-bold">{row.regB + row.regG}</td>
                    {/* PRESENTS - Teacher enters */}
                    <td className="border border-slate-300 p-0"><input type="number" value={row.presB||''} onChange={e => updateRow(idx, 'presB', Number(e.target.value))} className="w-full p-1 text-center text-xs" min={0} max={row.regB} /></td>
                    <td className="border border-slate-300 p-0"><input type="number" value={row.presG||''} onChange={e => updateRow(idx, 'presG', Number(e.target.value))} className="w-full p-1 text-center text-xs" min={0} max={row.regG} /></td>
                    <td className="border border-slate-300 p-1 text-center bg-slate-50 font-semibold">{row.presB + row.presG}</td>
                    {/* ABSENTS - Auto calculated */}
                    <td className="border border-slate-300 p-1 text-center bg-red-50 font-semibold text-red-700">{absB}</td>
                    <td className="border border-slate-300 p-1 text-center bg-red-50 font-semibold text-red-700">{absG}</td>
                    <td className="border border-slate-300 p-1 text-center bg-red-50 font-bold text-red-700">{absB + absG}</td>
                    {/* SICK - Teacher enters */}
                    <td className="border border-slate-300 p-0"><input type="number" value={row.sickB||''} onChange={e => updateRow(idx, 'sickB', Number(e.target.value))} className="w-full p-1 text-center text-xs" min={0} /></td>
                    <td className="border border-slate-300 p-0"><input type="number" value={row.sickG||''} onChange={e => updateRow(idx, 'sickG', Number(e.target.value))} className="w-full p-1 text-center text-xs" min={0} /></td>
                    <td className="border border-slate-300 p-1 text-center bg-slate-50 font-semibold">{row.sickB + row.sickG}</td>
                    {/* PERMITTED - Teacher enters */}
                    <td className="border border-slate-300 p-0"><input type="number" value={row.permB||''} onChange={e => updateRow(idx, 'permB', Number(e.target.value))} className="w-full p-1 text-center text-xs" min={0} /></td>
                    <td className="border border-slate-300 p-0"><input type="number" value={row.permG||''} onChange={e => updateRow(idx, 'permG', Number(e.target.value))} className="w-full p-1 text-center text-xs" min={0} /></td>
                    <td className="border border-slate-300 p-1 text-center bg-slate-50 font-semibold">{row.permB + row.permG}</td>
                    <td className="border border-slate-300 p-1 text-center bg-indigo-50 font-bold">{row.regB + row.regG}</td>
                  </tr>
                );
              })}
              <tr className="bg-slate-200 font-bold">
                <td className="border border-slate-300 p-1 text-center">TOTAL</td>
                <td className="border border-slate-300 p-1 text-center">{totals.regB}</td>
                <td className="border border-slate-300 p-1 text-center">{totals.regG}</td>
                <td className="border border-slate-300 p-1 text-center">{totalReg}</td>
                <td className="border border-slate-300 p-1 text-center">{totals.presB}</td>
                <td className="border border-slate-300 p-1 text-center">{totals.presG}</td>
                <td className="border border-slate-300 p-1 text-center">{totalPres}</td>
                <td className="border border-slate-300 p-1 text-center text-red-700">{totals.absB}</td>
                <td className="border border-slate-300 p-1 text-center text-red-700">{totals.absG}</td>
                <td className="border border-slate-300 p-1 text-center text-red-700">{totals.absB + totals.absG}</td>
                <td className="border border-slate-300 p-1 text-center">{totals.sickB}</td>
                <td className="border border-slate-300 p-1 text-center">{totals.sickG}</td>
                <td className="border border-slate-300 p-1 text-center">{totals.sickB + totals.sickG}</td>
                <td className="border border-slate-300 p-1 text-center">{totals.permB}</td>
                <td className="border border-slate-300 p-1 text-center">{totals.permG}</td>
                <td className="border border-slate-300 p-1 text-center">{totals.permB + totals.permG}</td>
                <td className="border border-slate-300 p-1 text-center bg-indigo-100">{totalReg}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-2 text-xs text-slate-500 space-y-0.5">
          <p>🔒 <strong>Registered</strong> = Set by Admin only</p>
          <p>✏️ <strong>Presents, Sick, Permitted</strong> = Entered by Teacher</p>
          <p>🔄 <strong>Absents</strong> = Auto-calculated (Registered - Presents)</p>
        </div>

        {/* Percentage */}
        <div className="mt-4 p-3 bg-indigo-50 border border-indigo-200 rounded-xl">
          <p className="font-bold text-sm">PERCENTAGE OF ATTENDANCE: <span className="text-indigo-700 text-lg">{percentage}%</span></p>
          <p className="text-xs text-slate-500">(Present / Total) × 100 = ({totalPres} / {totalReg}) × 100</p>
        </div>

        {/* TOD Comment */}
        <div className="mt-4 space-y-2">
          <label className="font-bold text-sm">T.O.D'S COMMENT(S): <span className="text-xs text-indigo-600 font-normal">(Select auto-generated comment)</span></label>
          <div className="space-y-2">
            {todCommentOptions.map((opt, i) => (
              <label key={i} className={`flex items-start gap-2 p-3 rounded-xl border cursor-pointer text-sm transition-all ${todComment === opt ? 'bg-indigo-50 border-indigo-400 font-medium' : 'bg-white border-slate-200 hover:bg-slate-50'}`}>
                <input type="radio" name="todComment" value={opt} checked={todComment === opt} onChange={() => setTodComment(opt)} className="mt-1 accent-indigo-600" />
                <span>{opt}</span>
              </label>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-xs font-semibold text-slate-500">NAME:</label><div className="border px-3 py-2 rounded-xl text-sm bg-gray-100 font-semibold">{teacherName}</div></div>
            <div><label className="text-xs font-semibold text-slate-500">SIGNATURE:</label><div className="border px-3 py-6 rounded-xl text-sm text-slate-300 bg-white text-center italic">Sign manually on printed copy</div></div>
          </div>
        </div>

        {/* Headmaster Comment */}
        <div className="mt-4 space-y-2 border-t pt-4">
          <label className="font-bold text-sm">HEADMASTER'S COMMENT(S): <span className="text-xs text-indigo-600 font-normal">(Auto-generated)</span></label>
          <div className="w-full border px-3 py-2 rounded-xl text-sm bg-amber-50 border-amber-200 min-h-[60px]">{autoHmComment}</div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-xs font-semibold text-slate-500">NAME:</label><div className="border px-3 py-2 rounded-xl text-sm bg-gray-100 font-semibold">{HEADMASTER_NAME}</div></div>
            <div><label className="text-xs font-semibold text-slate-500">SIGNATURE:</label><div className="border px-3 py-6 rounded-xl text-sm text-slate-300 bg-white text-center italic"></div></div>
          </div>
        </div>

        {!submitted ? (
          <button onClick={handleSubmit} disabled={loading} className="mt-6 w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold disabled:opacity-50">
            {loading ? 'Submitting...' : 'Submit Duty Report'}
          </button>
        ) : (
          <div className="mt-6 space-y-3">
            <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl text-emerald-700 font-semibold text-center">✅ Report Submitted Successfully!</div>
            <button onClick={() => setSubmittedReport(submittedReport)} className="w-full bg-slate-900 text-white py-3 rounded-xl font-semibold">🖨️ Print Duty Report (PDF)</button>
          </div>
        )}
        {submittedReport && submitted && (
          <DutyReportPrint report={submittedReport} onClose={() => { setSubmitted(false); setSubmittedReport(null); }} />
        )}
      </div>
    </div>
  );
}

// Opens a NEW clean window with ONLY the document for printing
export function DutyReportPrint({ report, onClose }: { report: any; onClose: () => void }) {
  const printRef = useRef<HTMLDivElement>(null);

  const att = report.attendance || [];
  const sections = report.sections || {};
  const logo = getSchoolLogo();

  const totals = att.reduce((acc: any, r: any) => ({
    regB: acc.regB + (r.regB||0), regG: acc.regG + (r.regG||0),
    presB: acc.presB + (r.presB||0), presG: acc.presG + (r.presG||0),
    absB: acc.absB + (r.absB||0), absG: acc.absG + (r.absG||0),
    sickB: acc.sickB + (r.sickB||0), sickG: acc.sickG + (r.sickG||0),
    permB: acc.permB + (r.permB||0), permG: acc.permG + (r.permG||0),
  }), { regB: 0, regG: 0, presB: 0, presG: 0, absB: 0, absG: 0, sickB: 0, sickG: 0, permB: 0, permG: 0 });

  const totalReg = totals.regB + totals.regG;
  const totalPres = totals.presB + totals.presG;
  const pct = totalReg > 0 ? ((totalPres / totalReg) * 100).toFixed(1) : '0.0';

  const handlePrint = () => {
    const printWindow = window.open('', '', 'width=800,height=1000');
    if (!printWindow) { window.print(); return; }

    printWindow.document.write(`<!DOCTYPE html><html><head><title> </title>
<style>
  @page { size: A4 portrait; margin: 10mm 12mm 6mm 12mm; }
  @page { @top-left { content: ''; } @top-right { content: ''; } @bottom-left { content: ''; } @bottom-right { content: ''; } }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Times New Roman', Times, serif; color: #000; background: #fff; font-size: 12px; line-height: 1.4; }
  table { width: 100%; border-collapse: collapse; }
  th, td { border: 1px solid #000; padding: 3px 2px; text-align: center; font-size: 11px; }
  .total-row td { border: 2px solid #000; font-weight: bold; font-size: 11px; }
  .header { text-align: center; margin-bottom: 6px; }
  .header img { height: 60px; margin-bottom: 3px; }
  .header .council { font-size: 14px; font-weight: bold; letter-spacing: 1px; }
  .header .school { font-size: 17px; font-weight: bold; letter-spacing: 1px; margin: 2px 0; }
  .header .title { font-size: 15px; font-weight: bold; text-decoration: underline; }
  .meta { display: flex; justify-content: space-between; font-size: 12px; border-bottom: 1.5px solid #000; padding-bottom: 5px; margin-bottom: 8px; }
  .section { margin-bottom: 6px; display: flex; gap: 6px; align-items: baseline; }
  .section-title { font-size: 12px; font-weight: bold; white-space: nowrap; min-width: 180px; }
  .section-text { font-size: 12px; border-bottom: 1px dotted #666; flex: 1; padding-bottom: 2px; line-height: 1.5; }
  .att-title { font-size: 12px; font-weight: bold; text-align: center; margin: 10px 0 6px; text-decoration: underline; }
  .pct-box { border: 1.5px solid #000; padding: 5px 10px; margin: 8px 0; font-size: 12px; font-weight: bold; }
  .pct-value { font-size: 15px; }
  .comment-block { margin-bottom: 10px; }
  .comment-title { font-size: 12px; font-weight: bold; margin-bottom: 3px; }
  .comment-text { font-size: 12px; border-bottom: 1px dotted #444; padding-bottom: 4px; min-height: 24px; line-height: 1.5; }
  .sig-row { display: flex; justify-content: space-between; margin-top: 8px; font-size: 12px; }
  .sig-name { font-weight: bold; border-bottom: 1px dotted #000; padding: 0 8px 2px; }
  .divider { border-top: 1.5px solid #aaa; padding-top: 8px; margin-top: 4px; }
  @media print {
    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    @page { margin-top: 5mm; margin-bottom: 5mm; }
  }
</style></head><body>`);

    // SINGLE PAGE - Header
    printWindow.document.write(`<div class="header">`);
    if (logo) printWindow.document.write(`<img src="${logo}" alt="Logo" />`);
    printWindow.document.write(`<div class="council">${getDistrictName()}</div>
      <div class="school">${getSchoolName()}</div>
      <div class="title">TEACHER'S DUTY REPORT</div></div>
      <div class="meta"><span>TEACHER ON DUTY: <strong>${report.teacher_name}</strong></span>
      <span>DATE: <strong>${report.date}</strong></span></div>`);

    // 10 Sections - compact inline layout
    REPORT_SECTIONS.forEach(s => {
      const val = sections[s.id] || '.............................................................................................';
      printWindow.document.write(`<div class="section"><div class="section-title">${s.label}</div><div class="section-text">${val}</div></div>`);
    });

    // Attendance subtitle
    printWindow.document.write(`<div class="att-title">STUDENTS ATTENDANCE ON ${report.date}</div>`);

    // Table
    printWindow.document.write(`<table><thead><tr>
      <th rowspan="2" style="font-size:9px;padding:3px">CLASS</th><th colspan="3" style="font-size:9px">REGISTERED</th><th colspan="3" style="font-size:9px">PRESENTS</th>
      <th colspan="3" style="font-size:9px">ABSENTS</th><th colspan="3" style="font-size:9px">SICK</th><th colspan="3" style="font-size:9px">PERMITTED</th><th rowspan="2" style="font-size:9px">TOTAL</th></tr>
      <tr>${['B','G','T','B','G','T','B','G','T','B','G','T','B','G','T'].map(h => `<th style="font-size:9px">${h}</th>`).join('')}</tr></thead><tbody>`);

    att.forEach((r: any) => {
      printWindow.document.write(`<tr>
        <td style="font-weight:bold;font-size:9px">${r.className}</td>
        <td>${r.regB}</td><td>${r.regG}</td><td style="font-weight:bold">${r.regB+r.regG}</td>
        <td>${r.presB}</td><td>${r.presG}</td><td style="font-weight:bold">${r.presB+r.presG}</td>
        <td>${r.absB}</td><td>${r.absG}</td><td style="font-weight:bold">${r.absB+r.absG}</td>
        <td>${r.sickB}</td><td>${r.sickG}</td><td style="font-weight:bold">${r.sickB+r.sickG}</td>
        <td>${r.permB}</td><td>${r.permG}</td><td style="font-weight:bold">${r.permB+r.permG}</td>
        <td style="font-weight:bold">${r.regB+r.regG}</td></tr>`);
    });

    printWindow.document.write(`<tr class="total-row">
      <td>TOTAL</td>
      <td>${totals.regB}</td><td>${totals.regG}</td><td>${totalReg}</td>
      <td>${totals.presB}</td><td>${totals.presG}</td><td>${totalPres}</td>
      <td>${totals.absB}</td><td>${totals.absG}</td><td>${totals.absB+totals.absG}</td>
      <td>${totals.sickB}</td><td>${totals.sickG}</td><td>${totals.sickB+totals.sickG}</td>
      <td>${totals.permB}</td><td>${totals.permG}</td><td>${totals.permB+totals.permG}</td>
      <td>${totalReg}</td></tr></tbody></table>`);

    printWindow.document.write(`<div class="pct-box">PERCENTAGE OF ATTENDANCE: PRESENT / TOTAL × 100 = <span class="pct-value">${pct}%</span></div>`);

    printWindow.document.write(`<div class="comment-block">
      <div class="comment-title">T.O.D'S COMMENT(S):</div>
      <div class="comment-text">${report.tod_comment || '.....................................................................................................................'}</div>
      <div class="sig-row"><span>NAME: <span class="sig-name">${report.tod_name || ''}</span></span><span>SIGNATURE: ____________________________</span></div></div>`);

    printWindow.document.write(`<div class="comment-block divider">
      <div class="comment-title">HEADMASTER'S COMMENT(S):</div>
      <div class="comment-text">${report.headmaster_comment || '.....................................................................................................................'}</div>
      <div class="sig-row"><span>NAME: <span class="sig-name">${report.headmaster_name || ''}</span></span><span>SIGNATURE: ____________________________</span></div></div>`);

    printWindow.document.write(`<div style="text-align:center;margin-top:15px;font-size:10px;color:#555;font-style:italic;border-top:1px solid #ccc;padding-top:6px">${getSchoolName()}: ${localStorage.getItem('sms_school_motto') || 'Honor All Build Together'}</div></body></html>`);
    printWindow.document.close();

    setTimeout(() => {
      printWindow.focus();
      printWindow.print();
    }, 500);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 text-center space-y-4" style={{ fontFamily: 'sans-serif' }}>
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
          <span className="text-3xl">📄</span>
        </div>
        <h2 className="text-xl font-bold text-slate-900">Duty Report Ready</h2>
        <p className="text-sm text-slate-600">Teacher: <strong>{report.teacher_name}</strong> | Date: <strong>{report.date}</strong></p>
        <p className="text-xs text-slate-500">The report will open in a new window. Select "Save as PDF" or print directly.</p>
        <div className="flex gap-3" ref={printRef}>
          <button onClick={handlePrint} className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700">
            🖨️ Print / Save as PDF
          </button>
          <button onClick={onClose} className="flex-1 py-3 bg-slate-200 text-slate-700 rounded-xl font-bold text-sm hover:bg-slate-300">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
