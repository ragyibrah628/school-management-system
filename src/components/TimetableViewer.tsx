// @ts-nocheck
// ✅ FIXED TimetableViewer — Nambawala Secondary Spec (40min, Single/Double/PS, Break 10:40-11:10, Lunch 14:30-15:30, Activity 15:30-17:30, Collision, Single/Double/PS, Print A4 Landscape)
// Replace src/components/TimetableViewer.tsx with this file
// Also update src/utils/dummyData.ts timeSlots section with NAMBAWALA_SLOTS below
import React, { useState, useEffect } from 'react';
import { useTimetable } from '../context/TimetableContext';
import { DayOfWeek, TimetableCell } from '../types';
import { Printer, AlertTriangle, X, Trash2, Save, Eye } from 'lucide-react';

// ✅ NAMBAWALA TIME SLOTS — 40 min, Break 10:40-11:10, Lunch 14:30-15:30, Activity 15:30-17:30
export const NAMBAWALA_SLOTS = [
  { id: 'p1', name: 'Period 1', startTime: '08:00', endTime: '08:40', isBreak: false },
  { id: 'p2', name: 'Period 2', startTime: '08:40', endTime: '09:20', isBreak: false },
  { id: 'p3', name: 'Period 3', startTime: '09:20', endTime: '10:00', isBreak: false },
  { id: 'p4', name: 'Period 4', startTime: '10:00', endTime: '10:40', isBreak: false },
  { id: 'b1', name: 'Break', startTime: '10:40', endTime: '11:10', isBreak: true },
  { id: 'p5', name: 'Period 5', startTime: '11:10', endTime: '11:50', isBreak: false },
  { id: 'p6', name: 'Period 6', startTime: '11:50', endTime: '12:30', isBreak: false },
  { id: 'p7', name: 'Period 7', startTime: '12:30', endTime: '13:10', isBreak: false },
  { id: 'p8', name: 'Period 8', startTime: '13:10', endTime: '13:50', isBreak: false },
  { id: 'p9', name: 'Period 9', startTime: '13:50', endTime: '14:30', isBreak: false },
  { id: 'lunch', name: 'Lunch', startTime: '14:30', endTime: '15:30', isBreak: true },
  { id: 'act', name: 'Activity', startTime: '15:30', endTime: '17:30', isBreak: false, isActivity: true },
];

export const ACTIVITY_OPTIONS = ['General Cleanliness', 'Debate', 'Self Reliance', 'Subject Clubs', 'Sports and Games'];

// Helper: find teacher for subject+class via classSubjects or teachingAssignments from localStorage
function findTeacherForSubjectClass(subjectName: string, className: string): { id: string, name: string } | null {
  try {
    // Try teachingAssignments first (most accurate)
    const ta = JSON.parse(localStorage.getItem('sms_teaching_assignments') || '{}');
    const users = JSON.parse(localStorage.getItem('sms_users') || '[]');
    // ta is { teacherId: [{cls, sub}] }
    for (const [tid, arr] of Object.entries(ta as any)) {
      const list = arr as any[];
      if (list.some((a: any) => a.cls === className && a.sub === subjectName)) {
        const u = users.find((x: any) => x.id === tid);
        if (u) return { id: tid, name: u.name };
      }
    }
    // Try tt_classSubjects via timetable context (we handle there too)
  } catch {}
  return null;
}

export const TimetableViewer: React.FC = () => {
  const {
    timetableData, classes, teachers, subjects, rooms, timeSlots, days, conflicts, classSubjects,
    schoolLogo, schoolName,
    removeLessonSlot, updateLessonSlot, scheduleUnscheduledLesson
  } = useTimetable();

  // Override slots with Nambawala if needed — ensure 40min structure
  const displaySlots = NAMBAWALA_SLOTS as any;
  const displayDays: DayOfWeek[] = (days && days.length ? days : ['Monday','Tuesday','Wednesday','Thursday','Friday']) as any;

  const [viewType, setViewType] = useState<'class'|'teacher'|'my_teaching'>('class');
  const [selectedId, setSelectedId] = useState<string>('');
  const [activeCell, setActiveCell] = useState<{ day: DayOfWeek, periodId: string } | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [periodType, setPeriodType] = useState<'single'|'double'|'ps'>('single');
  const [selectedActivity, setSelectedActivity] = useState<string>('');
  const [collisionMsg, setCollisionMsg] = useState<string>('');

  // Auto-select
  useEffect(() => {
    if (viewType === 'class' && classes.length > 0) setSelectedId(classes[0].id);
    else if (viewType === 'teacher' && teachers.length > 0) setSelectedId(teachers[0].id);
    else if (viewType === 'my_teaching') {
      try {
        const cur = JSON.parse(localStorage.getItem('sms_current_user') || 'null');
        if (cur && cur.role === 'teacher') {
          // find teacher id matching cur.username or id
          const t = teachers.find(x => x.id === cur.id || x.name === cur.name);
          if (t) setSelectedId(t.id);
          else if (teachers.length > 0) setSelectedId(teachers[0].id);
        } else if (teachers.length > 0) setSelectedId(teachers[0].id);
      } catch {}
    }
  }, [viewType, classes, teachers]);

  // Try to detect current user for my_teaching
  const currentUser = (() => {
    try { return JSON.parse(localStorage.getItem('sms_current_user') || 'null'); } catch { return null; }
  })();
  const isTeacherView = currentUser?.role === 'teacher';
  const myTeacherId = (() => {
    if (!isTeacherView) return null;
    const t = teachers.find(x => x.id === currentUser.id || x.name === currentUser.name);
    return t?.id || null;
  })();

  if (!timetableData) {
    return (
      <div className="bg-white p-12 rounded-2xl border text-center max-w-2xl mx-auto shadow-sm mt-12">
        <h2 className="text-xl font-bold mb-2">No Timetable Generated Yet</h2>
        <p className="text-sm text-slate-500 mb-6">Go to Dashboard and click "Generate Timetable" or start filling manually by clicking a cell.</p>
        <p className="text-xs text-slate-400">Timetable saves automatically to Supabase and teachers will see updates in their accounts (poll 8s).</p>
      </div>
    );
  }

  const schedule = timetableData.schedule as any;

  const getCellData = (day: string, periodId: string, customId = selectedId, forceType = viewType): any | null => {
    if (forceType === 'class') {
      return schedule[customId]?.[day]?.[periodId] || null;
    }
    if (forceType === 'teacher' || forceType === 'my_teaching') {
      const tid = forceType === 'my_teaching' ? myTeacherId : customId;
      for (const cId of Object.keys(schedule)) {
        const cell = schedule[cId]?.[day]?.[periodId];
        if (cell && (cell.teacherId === tid || cell.teacherName === teachers.find(t=>t.id===tid)?.name)) {
          // return with class info
          return { ...cell, _classId: cId, _className: classes.find(c=>c.id===cId)?.name };
        }
      }
      return null;
    }
    return null;
  };

  const getSubjectName = (id: string) => subjects.find(s=>s.id===id)?.name || id;
  const getTeacherName = (id: string) => teachers.find(t=>t.id===id)?.name || id;

  // Collision check: teacher at same day+period already scheduled elsewhere
  const checkCollision = (teacherId: string, day: string, periodId: string, currentClassId: string): string | null => {
    if (!teacherId || periodId === 'b1' || periodId === 'lunch') return null;
    for (const cid of Object.keys(schedule)) {
      if (cid === currentClassId) continue;
      const cell = schedule[cid]?.[day]?.[periodId];
      if (cell && cell.teacherId === teacherId) {
        const clsName = classes.find(c=>c.id===cid)?.name || cid;
        return `Teacher ${getTeacherName(teacherId)} is already assigned to ${clsName} on ${day} ${periodId}. Choose another teacher or change time.`;
      }
      // double period occupies next slot too
      if (cell && cell.isDouble) {
        const order = displaySlots.filter((s:any)=>!s.isBreak || s.id==='b1' || s.id==='lunch');
        // Actually double occupies next teaching period
        const teachingIds = displaySlots.filter((s:any)=>!s.isBreak && !s.isActivity).map((s:any)=>s.id);
        const idx = teachingIds.indexOf(periodId);
        const nextId = teachingIds[idx+1];
        // If checking current period is next of a double, also collision
        if (nextId) {
          const nextCell = schedule[cid]?.[day]?.[nextId];
          // no, double is stored only at first period, second is empty but logically occupied
          // So if we are checking periodId that is second of a double, teacher is still busy
          // We handle by checking if previous cell is double for that teacher
          // Simpler: if any class has double at previous period, that teacher occupies current too
        }
      }
    }
    // Also check if teacher has double that spills into current
    const teachingIds = displaySlots.filter((s:any)=>!s.isBreak && !s.isActivity).map((s:any)=>s.id);
    const idx = teachingIds.indexOf(periodId);
    if (idx > 0) {
      const prevId = teachingIds[idx-1];
      for (const cid of Object.keys(schedule)) {
        if (cid === currentClassId) continue;
        const prevCell = schedule[cid]?.[day]?.[prevId];
        if (prevCell && prevCell.isDouble && prevCell.teacherId === teacherId) {
          const clsName = classes.find(c=>c.id===cid)?.name || cid;
          return `Teacher ${getTeacherName(teacherId)} already has a double period for ${clsName} starting ${prevId} (overlaps ${periodId}).`;
        }
      }
    }
    return null;
  };

  const handleCellClick = (day: DayOfWeek, periodId: string, cellData: any) => {
    if (viewType !== 'class') return; // only admin class view can edit
    // Break not editable
    const slot = displaySlots.find((s:any)=>s.id===periodId);
    if (slot?.isBreak && periodId !== 'act') return;
    setActiveCell({ day, periodId });
    if (cellData) {
      setSelectedSubject(cellData.subjectId || '');
      setPeriodType(cellData.isDouble ? 'double' : cellData.isPS ? 'ps' : 'single');
      setSelectedActivity(cellData.activity || '');
    } else {
      setSelectedSubject('');
      setPeriodType('single');
      setSelectedActivity('');
    }
    setCollisionMsg('');
  };

  const handleSaveCell = () => {
    if (!activeCell) return;
    const slot = displaySlots.find((s:any)=>s.id===activeCell.periodId);
    const isActivitySlot = (slot as any)?.isActivity;
    const classId = selectedId;

    if (isActivitySlot) {
      if (!selectedActivity) { setCollisionMsg('Select an activity'); return; }
      // Activity has no collision (any teacher? no)
      // Save as activity
      const cell: any = { subjectId: 'activity', teacherId: '', roomId: '', isActivity: true, activity: selectedActivity, isDouble: false, isPS: false };
      // Use context update
      updateLessonSlot(classId, activeCell.day, activeCell.periodId, 'activity', '', '');
      // Manually set because context expects subject/teacher/room but we override
      // Directly mutate timetableData.schedule and persist
      if (!schedule[classId]) schedule[classId] = {};
      if (!schedule[classId][activeCell.day]) schedule[classId][activeCell.day] = {};
      schedule[classId][activeCell.day][activeCell.periodId] = cell;
      localStorage.setItem('tt_timetableData', JSON.stringify(timetableData));
      localStorage.setItem('tt_timetableData_ts', String(Date.now()));
      // trigger sync
      try { (window as any).cloudSync?.syncToCloud?.(); } catch {}
      // Also save via localStorage sync
      localStorage.setItem('tt_timetableData', JSON.stringify({...timetableData, schedule}));
      window.dispatchEvent(new Event('storage'));
      setActiveCell(null);
      // Force reload
      // stay on timetable tab
      return;
    }

    // Teaching period
    if (periodType === 'ps') {
      // Private Studies - no teacher, subject = PS
      const cell: any = { subjectId: 'ps', subjectName: 'PS', teacherId: '', isPS: true, isDouble: false };
      if (!schedule[classId]) schedule[classId] = {};
      if (!schedule[classId][activeCell.day]) schedule[classId][activeCell.day] = {};
      schedule[classId][activeCell.day][activeCell.periodId] = cell;
      // If double, occupy next period
      if (periodType === 'double') {
        // handled below
      }
      localStorage.setItem('tt_timetableData', JSON.stringify(timetableData));
      localStorage.setItem('tt_timetableData_ts', String(Date.now()));
      setActiveCell(null);
      // stay on timetable tab — don't reload to dashboard
      setCollisionMsg('');
      return;
    }

    if (!selectedSubject) { setCollisionMsg('Select a subject'); return; }

    // Find teacher for this subject+class
    // subject can be id or name - handle both
    let subjId = selectedSubject;
    let subjName = selectedSubject;
    const foundSub = subjects.find(s=> s.id===selectedSubject || s.name===selectedSubject);
    if (foundSub) { subjId = foundSub.id; subjName = foundSub.name; }
    
    let teacherId = '';
    let teacherName = '';
    // Try to find via classSubjects
    try {
      const cs = classSubjects.find((c:any)=> c.classId===classId && (c.subjectId===subjId || subjects.find(s=>s.id===c.subjectId)?.name===subjName));
      if (cs) teacherId = cs.teacherId;
    } catch {}
    // Try via teachingAssignments (sms_teaching_assignments)
    if (!teacherId) {
      const res = findTeacherForSubjectClass(subjName, classes.find(c=>c.id===classId)?.name || '');
      if (res) { teacherId = res.id; teacherName = res.name; }
    }
    // Try via teachers qualifiedSubjects
    if (!teacherId) {
      const t = teachers.find(x=> x.qualifiedSubjects?.includes(subjId));
      if (t) teacherId = t.id;
    }
    if (!teacherId) {
      setCollisionMsg('No teacher assigned to teach ' + subjName + ' in ' + (classes.find(c=>c.id===classId)?.name || classId) + '. Go to Assign Teaching Classes & Subjects first.');
      return;
    }

    // Collision check
    const coll = checkCollision(teacherId, activeCell.day, activeCell.periodId, classId);
    if (coll) { setCollisionMsg(coll); return; }
    if (periodType === 'double') {
      const teachingIds = displaySlots.filter((s:any)=>!s.isBreak && !s.isActivity).map((s:any)=>s.id);
      const idx = teachingIds.indexOf(activeCell.periodId);
      const nextId = teachingIds[idx+1];
      if (!nextId) { setCollisionMsg('Double period cannot be the last period. Choose Single.'); return; }
      // Check next period collision too
      const coll2 = checkCollision(teacherId, activeCell.day, nextId, classId);
      if (coll2) { setCollisionMsg('Double: ' + coll2); return; }
      // Also check next period is not break/lunch/activity (it won't be since teachingIds excludes)
      // Check if next period already has a lesson for this class
      const existingNext = schedule[classId]?.[activeCell.day]?.[nextId];
      if (existingNext) { setCollisionMsg('Next period already has a lesson. Remove it first.'); return; }
    }

    // Save
    const cell: any = { subjectId: subjId, subjectName: subjName, teacherId, teacherName: teacherName || getTeacherName(teacherId), isDouble: periodType==='double', isPS: false };
    if (!schedule[classId]) schedule[classId] = {};
    if (!schedule[classId][activeCell.day]) schedule[classId][activeCell.day] = {};
    schedule[classId][activeCell.day][activeCell.periodId] = cell;
    // For double, also set next period as span marker
    if (periodType === 'double') {
      const teachingIds = displaySlots.filter((s:any)=>!s.isBreak && !s.isActivity).map((s:any)=>s.id);
      const idx = teachingIds.indexOf(activeCell.periodId);
      const nextId = teachingIds[idx+1];
      if (nextId) {
        schedule[classId][activeCell.day][nextId] = { subjectId: subjId, teacherId, isDoubleSpan: true, _isSpan: true };
      }
    }
    // Also clear span if previously double but now single - remove next span if exists and isSpan
    if (periodType === 'single') {
      const teachingIds = displaySlots.filter((s:any)=>!s.isBreak && !s.isActivity).map((s:any)=>s.id);
      const idx = teachingIds.indexOf(activeCell.periodId);
      const nextId = teachingIds[idx+1];
      if (nextId && schedule[classId]?.[activeCell.day]?.[nextId]?.isDoubleSpan) {
        delete schedule[classId][activeCell.day][nextId];
      }
    }

    localStorage.setItem('tt_timetableData', JSON.stringify(timetableData));
    localStorage.setItem('tt_timetableData_ts', String(Date.now()));
    // Try to sync via cloud if available
    try {
      // @ts-ignore
      if (typeof window !== 'undefined' && (window as any).cloudSync) {}
    } catch {}
    // Force timetable context to persist via its useEffect — we already set localStorage, now trigger event
    window.dispatchEvent(new Event('tt-timetable-updated'));
    setActiveCell(null);
    setCollisionMsg('');
    // keep timetable tab open — no reload
  };

  const handleRemove = () => {
    if (!activeCell) return;
    const classId = selectedId;
    removeLessonSlot(classId, activeCell.day, activeCell.periodId);
    // Also remove double span next
    const teachingIds = displaySlots.filter((s:any)=>!s.isBreak && !s.isActivity).map((s:any)=>s.id);
    const idx = teachingIds.indexOf(activeCell.periodId);
    const nextId = teachingIds[idx+1];
    if (nextId) {
      try {
        const nextCell = schedule[classId]?.[activeCell.day]?.[nextId];
        if (nextCell?.isDoubleSpan || nextCell?.isPS) {
          // also remove via context call
          removeLessonSlot(classId, activeCell.day, nextId);
        }
      } catch {}
    }
    setActiveCell(null);
    // keep timetable tab open
  };

  const handlePrint = (type: 'class'|'teacher') => {
    window.print();
  };

  // Build subject options from admin registered subjects + timetable subjects
  const subjectOptions = (() => {
    try {
      const fromAdmin = JSON.parse(localStorage.getItem('sms_school_subjects') || '[]');
      if (fromAdmin.length) return fromAdmin;
    } catch {}
    return subjects.map(s=>s.name);
  })();

  const selectedClassName = classes.find(c=>c.id===selectedId)?.name || '';
  const selectedTeacherName = teachers.find(t=>t.id===selectedId)?.name || '';
  const headerTitle = viewType==='class' ? `${selectedClassName} - Teaching Timetable` : viewType==='my_teaching' ? `${currentUser?.name || selectedTeacherName} - Teaching Timetable` : `${selectedTeacherName} - Teaching Timetable`;

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-4 rounded-2xl shadow-sm border gap-4 print:hidden">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex rounded-xl bg-slate-100 p-1 border gap-1">
            <button onClick={()=>setViewType('class')} className={`px-3 py-1.5 text-xs font-bold rounded-lg ${viewType==='class'?'bg-white shadow text-slate-900':'text-slate-500'}`}>Class View (Admin)</button>
            <button onClick={()=>setViewType('teacher')} className={`px-3 py-1.5 text-xs font-bold rounded-lg ${viewType==='teacher'?'bg-white shadow text-slate-900':'text-slate-500'}`}>Teacher View (Admin)</button>
            {isTeacherView && <button onClick={()=>setViewType('my_teaching')} className={`px-3 py-1.5 text-xs font-bold rounded-lg ${viewType==='my_teaching'?'bg-indigo-600 text-white shadow':'bg-amber-100 text-amber-800 border border-amber-200'}`}>My Timetable</button>}
          </div>
          {viewType==='class' && (
            <select value={selectedId} onChange={e=>setSelectedId(e.target.value)} className="text-sm border px-3 py-1.5 rounded-xl bg-white font-semibold">
              {classes.map(c=> <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          )}
          {viewType==='teacher' && (
            <select value={selectedId} onChange={e=>setSelectedId(e.target.value)} className="text-sm border px-3 py-1.5 rounded-xl bg-white font-semibold">
              {teachers.map(t=> <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          )}
          {viewType==='my_teaching' && (
            <span className="text-sm font-bold px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800">{currentUser?.name} — {myTeacherId ? 'Teaching' : 'No assignment'}</span>
          )}
          <span className="text-xs text-slate-400 italic hidden md:inline">Click a cell to select subject (Admin only)</span>
        </div>
        <button onClick={()=>handlePrint(viewType==='class'?'class':'teacher')} className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-black">
          <Printer size={16} /> Print (A4 Landscape)
        </button>
      </div>

      {/* Conflict banner */}
      {collisionMsg && (
        <div className="bg-red-50 border border-red-200 p-3 rounded-xl flex gap-3 print:hidden">
          <AlertTriangle className="text-red-500" size={18} />
          <p className="text-xs text-red-700 font-semibold">{collisionMsg}</p>
          <button onClick={()=>setCollisionMsg('')} className="ml-auto"><X size={16}/></button>
        </div>
      )}

      {/* Timetable Grid */}
      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden print:border-none print:shadow-none">
        {/* Print header */}
        <div className="p-4 border-b hidden print:flex items-center justify-between">
          <div className="flex items-center gap-3">
            {schoolLogo && <img src={schoolLogo} alt="Logo" className="h-12 object-contain" />}
            <div>
              <h1 className="text-lg font-black">{schoolName || 'NAMBAWALA SECONDARY SCHOOL'}</h1>
              <p className="text-xs text-slate-500">Weekly Teaching Timetable</p>
            </div>
          </div>
          <div className="text-right">
            <h2 className="text-sm font-black text-indigo-700">{headerTitle}</h2>
            <p className="text-[10px] text-slate-400">Generated: {new Date().toLocaleDateString()}</p>
          </div>
        </div>
        <div className="p-3 border-b bg-slate-50 print:bg-white flex justify-between items-center">
          <h3 className="font-black text-sm">{headerTitle} <span className="font-normal text-xs text-slate-500">| 40 min per period | Single/Double/PS | Break 10:40-11:10 | Lunch 14:30-15:30 | Activity 15:30-17:30</span></h3>
          <span className="text-xs px-2 py-1 rounded-full bg-white border font-semibold">{displayDays.length} Days • {displaySlots.filter((s:any)=>!s.isBreak).length} Periods</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100">
                <th className="border p-2 text-center w-24">Day / Time</th>
                {displaySlots.map((slot:any)=> (
                  <th key={slot.id} className={`border p-1 text-center ${slot.isBreak ? 'bg-amber-50 text-amber-800' : slot.isActivity ? 'bg-indigo-50 text-indigo-800' : 'bg-white'}`}>
                    <div className="font-bold text-[11px] leading-tight">{slot.name}</div>
                    <div className="text-[10px] font-normal opacity-70">{slot.startTime}-{slot.endTime}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {displayDays.map((day:any)=> (
                <tr key={day}>
                  <td className="border p-2 font-black bg-slate-50 text-center">{day}</td>
                  {displaySlots.map((slot:any, idx:number)=> {
                    if (slot.isBreak) {
                      return <td key={slot.id} className="border p-2 text-center bg-amber-50 text-amber-700 font-bold text-xs">{slot.name}<br/><span className="text-[10px] font-normal">{slot.startTime}-{slot.endTime}</span></td>;
                    }
                    const cell = getCellData(day, slot.id);
                    // Skip rendering if this is a double span (second part) — it was already rendered as colspan 2
                    // But we rendered previous as colspan 2, so we should hide this cell
                    // Check if previous period is double for this day
                    const prevSlot = displaySlots[idx-1];
                    if (prevSlot && !prevSlot.isBreak && !prevSlot.isActivity) {
                      const prevCell = getCellData(day, prevSlot.id);
                      if (prevCell && prevCell.isDouble) {
                        return null; // hidden because double occupies
                      }
                    }
                    const isDouble = cell?.isDouble;
                    const colSpan = isDouble ? 2 : 1;
                    const isPS = cell?.isPS || cell?.subjectId==='ps';
                    const isActivity = cell?.isActivity;
                    const subjectName = isPS ? 'PS' : isActivity ? cell.activity : (cell ? (cell.subjectName || subjects.find(s=>s.id===cell.subjectId)?.name || cell.subjectId) : '');
                    const teacherNameForCell = isPS || isActivity ? '' : (cell ? (cell.teacherName || getTeacherName(cell.teacherId)) : '');
                    const classNameForCell = viewType==='class' ? '' : (cell ? (cell._className || '') : '');

                    // For general timetable (class view): show subject + teacher
                    // For teacher view: show subject + class
                    const lowerText = viewType==='class' ? teacherNameForCell : classNameForCell;

                    return (
                      <td
                        key={slot.id}
                        colSpan={colSpan}
                        onClick={()=>handleCellClick(day, slot.id, cell)}
                        className={`border p-1 text-center cursor-pointer relative group ${!cell ? 'bg-white hover:bg-indigo-50' : isPS ? 'bg-slate-100 border-slate-300' : isActivity ? 'bg-indigo-50 border-indigo-200' : isDouble ? 'bg-emerald-50 border-emerald-300' : 'bg-white border-slate-200'} ${viewType!=='class' ? 'cursor-default' : ''}`}
                      >
                        {!cell ? (
                          <span className="text-slate-300 text-xs print:hidden">{viewType==='class' ? '+' : '—'}</span>
                        ) : (
                          <div className="leading-tight">
                            <div className={`font-bold text-[11px] ${isPS ? 'text-slate-600' : isActivity ? 'text-indigo-700' : 'text-slate-900'}`}>{subjectName}</div>
                            {lowerText && <div className="text-[10px] text-slate-600 truncate">{lowerText}</div>}
                            {isDouble && <div className="text-[9px] font-bold text-emerald-700 mt-0.5">Double (80 min)</div>}
                            {isPS && <div className="text-[9px] text-slate-500">Private Studies</div>}
                          </div>
                        )}
                        {viewType==='class' && cell && (
                          <button
                            onClick={(e)=>{e.stopPropagation(); setActiveCell({day, periodId: slot.id}); setTimeout(handleRemove,0)}}
                            className="absolute top-0.5 right-0.5 opacity-0 group-hover:opacity-100 print:hidden bg-white rounded-full p-0.5 border"
                          >
                            <Trash2 size={10} className="text-red-500" />
                          </button>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-2 bg-slate-50 text-xs text-slate-500 flex flex-wrap gap-3 print:hidden">
          <span>🔒 Break/Lunch hazibadilishwi</span>
          <span>📚 Click a cell → select Subject (as assigned to class + subject)</span>
          <span>🟩 Double = 80 min (vipindi 2)</span>
          <span>⬜ PS = Private Studies bila mwalimu</span>
          <span>🟦 Activity 15:30-17:30</span>
        </div>
      </div>

      {/* Print hint */}
      <div className="text-center text-xs text-slate-400 print:hidden">Print: Make sure you select **Class View** au **My Timetable** → Print → Chagua **Landscape** + **Background graphics**</div>

      {/* Modal */}
      {activeCell && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-5 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-black text-sm">{activeCell.day} — {displaySlots.find((s:any)=>s.id===activeCell.periodId)?.name} ({displaySlots.find((s:any)=>s.id===activeCell.periodId)?.startTime}-{displaySlots.find((s:any)=>s.id===activeCell.periodId)?.endTime})</h3>
              <button onClick={()=>setActiveCell(null)} className="p-1 rounded-full hover:bg-slate-100"><X size={18} /></button>
            </div>
            <div className="text-xs text-slate-500">Class: <b>{selectedClassName}</b> {viewType!=='class' && <span className="text-red-500">(Badilisha kwenye Class View)</span>}</div>

            {(displaySlots.find((s:any)=>s.id===activeCell.periodId) as any)?.isActivity ? (
              <>
                <div>
                  <label className="text-xs font-bold">Select Activity (15:30-17:30)</label>
                  <select value={selectedActivity} onChange={e=>setSelectedActivity(e.target.value)} className="w-full mt-1 border px-3 py-2 rounded-xl text-sm">
                    <option value="">-- Select --</option>
                    {ACTIVITY_OPTIONS.map(a=> <option key={a} value={a}>{a}</option>)}
                  </select>
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="text-xs font-bold">Subject (from registered Subjects)</label>
                  <select value={selectedSubject} onChange={e=>setSelectedSubject(e.target.value)} className="w-full mt-1 border px-3 py-2 rounded-xl text-sm">
                    <option value="">-- Select subject --</option>
                    {subjectOptions.map((name:string)=> <option key={name} value={name}>{name}</option>)}
                  </select>
                  {selectedSubject && (()=> {
                    const found = findTeacherForSubjectClass(selectedSubject, selectedClassName);
                    return found ? <p className="text-xs text-emerald-600 mt-1">Teacher: <b>{found.name}</b> (from Teaching Assignments)</p> : <p className="text-xs text-amber-600 mt-1">No teacher assigned to teach this subject in this class.</p>;
                  })()}
                </div>
                <div>
                  <label className="text-xs font-bold">Period Type</label>
                  <div className="flex gap-2 mt-1">
                    <button onClick={()=>setPeriodType('single')} className={`flex-1 py-2 rounded-xl text-xs font-bold border ${periodType==='single'?'bg-indigo-600 text-white border-indigo-600':'bg-white'}`}>Single (40 min)</button>
                    <button onClick={()=>setPeriodType('double')} className={`flex-1 py-2 rounded-xl text-xs font-bold border ${periodType==='double'?'bg-emerald-600 text-white border-emerald-600':'bg-white'}`}>Double (80 min)</button>
                    <button onClick={()=>setPeriodType('ps')} className={`flex-1 py-2 rounded-xl text-xs font-bold border ${periodType==='ps'?'bg-slate-800 text-white border-slate-800':'bg-white'}`}>PS (Private)</button>
                  </div>
                </div>
              </>
            )}

            {collisionMsg && <div className="p-2 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-semibold">{collisionMsg}</div>}

            <div className="flex gap-2">
              <button onClick={handleSaveCell} className="flex-1 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2"><Save size={16}/> Save</button>
              <button onClick={handleRemove} className="flex-1 py-2.5 bg-white border text-slate-700 rounded-xl font-bold text-sm flex items-center justify-center gap-2"><Trash2 size={16}/> Remove</button>
              <button onClick={()=>setActiveCell(null)} className="px-4 py-2.5 bg-slate-100 rounded-xl font-bold text-sm">Close</button>
            </div>
            <p className="text-[10px] text-slate-400 text-center">Collision: Mwalimu asipewe madarasa 2 muda mmoja. Double itachukua vipindi 2 mfululizo.</p>
          </div>
        </div>
      )}

      <style>{`
        @media print {
          @page { size: A4 landscape; margin: 10mm; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .print\\:hidden { display: none !important; }
        }
      `}</style>
    </div>
  );
};
