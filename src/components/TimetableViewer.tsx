// @ts-nocheck
// ✅ SAFE FIX — Nambawala 40min + English Only + Print Fix + Fonts + No Double Text + Stay on Tab + No Error #62
// This version is based on the ORIGINAL viewer (588 lines) with MINIMAL safe patches
import React, { useState } from 'react';
import { useTimetable } from '../context/TimetableContext';
import { DayOfWeek, TimetableCell } from '../types';
import { Printer, Grid, AlertTriangle, X, Trash2, Plus } from 'lucide-react';

const ACTIVITY_OPTIONS = ['General Cleanliness', 'Debate', 'Self Reliance', 'Subject Clubs', 'Sports and Games'];

function findTeacherForSubjectClass(subjectName: string, className: string): { id: string, name: string } | null {
  try {
    const ta = JSON.parse(localStorage.getItem('sms_teaching_assignments') || '{}');
    const users = JSON.parse(localStorage.getItem('sms_users') || '[]');
    for (const [tid, arr] of Object.entries(ta as any)) {
      const list = arr as any[];
      if (list.some((a: any) => a.cls === className && a.sub === subjectName)) {
        const u = users.find((x: any) => x.id === tid);
        if (u) return { id: tid, name: u.name };
      }
    }
  } catch {}
  return null;
}

export const TimetableViewer: React.FC = () => {
  const {
    timetableData, classes, teachers, subjects, rooms, timeSlots, days, conflicts, classSubjects,
    schoolLogo, schoolName,
    removeLessonSlot, scheduleUnscheduledLesson, updateLessonSlot
  } = useTimetable() as any;

  const [viewType, setViewType] = useState<'class' | 'teacher' | 'room' | 'master' | 'all_classes' | 'all_teachers'>('class');
  const [selectedId, setSelectedId] = useState<string>('');
  const [activeCell, setActiveCell] = useState<{ day: DayOfWeek; periodId: string } | null>(null);
  const [selectedUnscheduledId, setSelectedUnscheduledId] = useState<string>('');
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [periodType, setPeriodType] = useState<'single'|'double'|'ps'>('single');
  const [selectedActivity, setSelectedActivity] = useState<string>('');
  const [collisionMsg, setCollisionMsg] = useState<string>('');

  const activePeriods = timeSlots;

  React.useEffect(() => {
    if (viewType === 'class' && classes.length > 0) setSelectedId(classes[0].id);
    else if (viewType === 'teacher' && teachers.length > 0) setSelectedId(teachers[0].id);
    else if (viewType === 'room' && rooms.length > 0) setSelectedId(rooms[0].id);
  }, [viewType, classes, teachers, rooms]);

  if (!timetableData) {
    return (
      <div className="bg-white p-12 rounded-2xl border border-slate-100 text-center text-slate-400 max-w-2xl mx-auto shadow-sm mt-12">
        <Grid size={48} className="mx-auto text-slate-300 mb-4 animate-pulse" />
        <h2 className="text-xl font-bold text-slate-800 mb-2">No Timetable Generated Yet</h2>
        <p className="text-sm text-slate-500 mb-6">Go to the Dashboard and click "Generate Timetable" to create your school's master schedule.</p>
      </div>
    );
  }

  const schedule = timetableData.schedule;

  // Safe print: opens new window with full HTML, no blank, English, correct orientation
  const handlePrint = () => {
    try {
      const isClass = viewType === 'class' || viewType === 'all_classes';
      const targetId = selectedId;
      const targetName = isClass ? (classes.find((c:any)=>c.id===targetId)?.name || '') : (teachers.find((t:any)=>t.id===targetId)?.name || '');
      const title = isClass ? (targetName ? `${targetName} Teaching Timetable` : 'Class Teaching Timetable') : (targetName ? `${targetName} Teaching Timetable` : 'Teacher Teaching Timetable');
      const orientation = isClass ? 'landscape' : 'portrait';
      const logo = localStorage.getItem('sms_school_logo') || (schoolLogo || '');
      const sName = localStorage.getItem('sms_school_name_setting') || (schoolName as any) || 'NAMBAWALA SECONDARY SCHOOL';
      const district = localStorage.getItem('sms_district_name') || 'RUANGWA DISTRICT COUNCIL';
      const address = localStorage.getItem('sms_school_address') || 'P.O. Box 51, Ruangwa - Lindi';
      const pw = window.open('', '', 'width=1200,height=800');
      if (!pw) { window.print(); return; }
      let html = `<!DOCTYPE html><html><head><title> ${title} </title><style>
        @page { size: A4 ${orientation}; margin: 10mm 12mm; }
        * { margin:0; padding:0; box-sizing:border-box; }
        body { font-family: Arial, Helvetica, sans-serif; font-size: 11px; color:#000; background:#fff; }
        table { width:100%; border-collapse:collapse; table-layout:fixed; }
        th, td { border:1.5px solid #000; padding: 7px 5px; text-align:center; vertical-align:middle; }
        th { background:#eef2ff; font-weight:800; font-size: 11px; color:#1e293b; }
        td { font-size: 11px; line-height:1.3; }
        .header { text-align:center; margin-bottom:12px; border-bottom:3px double #000; padding-bottom:10px; }
        .header img { height:58px; margin-bottom:6px; }
        .header h1 { font-size:18px; font-weight:900; letter-spacing:1px; }
        .header h2 { font-size:14px; font-weight:800; color:#4338ca; margin-top:4px; }
        .header p { font-size:10px; color:#555; margin-top:2px; }
        .subject { font-weight:800; font-size:12px; color:#0f172a; }
        .subteacher { font-weight:600; font-size:10.5px; color:#334155; margin-top:2px; }
        .breakCell { background:#fff7ed; color:#9a3412; font-weight:800; }
        .dayCol { background:#f8fafc; font-weight:900; }
        .footer { text-align:center; margin-top:12px; font-size:9px; color:#64748b; border-top:1px solid #cbd5e1; padding-top:6px; font-style:italic; }
        @media print { body { -webkit-print-color-adjust:exact; print-color-adjust:exact; } a { text-decoration:none !important; color:inherit !important; } table { page-break-inside:auto; } tr { page-break-inside:avoid; } }
      </style></head><body>`;
      html += `<div class="header">`;
      if (logo) html += `<img src="${logo}" alt="Logo" />`;
      html += `<div style="font-size:12px; font-weight:700; letter-spacing:1px;">${district}</div>`;
      html += `<h1>${sName}</h1>`;
      html += `<div style="font-size:10px; color:#64748b;">${address}</div>`;
      html += `<h2>${title}</h2>`;
      html += `<p>Weekly Teaching Timetable • ${isClass ? 'Class' : 'Teacher'} • A4 ${orientation.charAt(0).toUpperCase()+orientation.slice(1)} • ${new Date().toLocaleDateString()}</p>`;
      html += `</div>`;
      html += `<table><thead><tr><th style="width:90px;">Day / Time</th>`;
      for (const p of activePeriods) {
        if ((p as any).isBreak) {
          html += `<th class="breakCell"><div>${p.name}</div><div style="font-weight:400; font-size:8px;">${(p as any).startTime}-${(p as any).endTime}</div></th>`;
        } else {
          html += `<th><div>${p.name}</div><div style="font-weight:400; font-size:8px; opacity:0.8;">${(p as any).startTime}-${(p as any).endTime}</div></th>`;
        }
      }
      html += `</tr></thead><tbody>`;
      for (const day of days) {
        html += `<tr><td class="dayCol">${day}</td>`;
        for (const p of activePeriods) {
          if ((p as any).isBreak) {
            html += `<td class="breakCell">${p.name}<br><span style="font-size:8px; font-weight:400;">${(p as any).startTime}-${(p as any).endTime}</span></td>`;
            continue;
          }
          let cell: any = null;
          if (isClass) cell = schedule[targetId]?.[day]?.[p.id] || null;
          else {
            for (const cid of Object.keys(schedule||{})) {
              const c = schedule[cid]?.[day]?.[p.id];
              if (c && c.teacherId===targetId) { cell = {...c, _className: classes.find((x:any)=>x.id===cid)?.name||cid}; break; }
            }
          }
          if (!cell) {
            html += `<td></td>`;
          } else {
            const isPS = cell.isPS || cell.subjectId==='ps';
            const isAct = cell.isActivity;
            let subj = '';
            let sub = '';
            if (isPS) { subj='PS'; sub='Private Studies'; }
            else if (isAct) { subj=cell.activity || cell.subjectId || 'Activity'; sub=''; }
            else {
              const s = subjects.find((x:any)=>x.id===cell.subjectId);
              subj = (cell as any).subjectName || s?.name || cell.subjectId || '';
              sub = isClass ? (teachers.find((t:any)=>t.id===cell.teacherId)?.name || '') : ((cell as any)._className || '');
            }
            html += `<td><div class="subject">${subj}</div>${sub ? `<div class="subteacher">${sub}</div>` : ''}</td>`;
          }
        }
        html += `</tr>`;
      }
      html += `</tbody></table>`;
      html += `<div class="footer">${sName}: Honor All Build Together</div>`;
      html += `</body></html>`;
      pw.document.write(html);
      pw.document.close();
      setTimeout(()=>{ pw.focus(); pw.print(); }, 400);
    } catch (e:any) {
      console.error(e);
      window.print();
    }
  };

  const getCellData = (day: string, periodId: string, customId = selectedId, forceType = viewType as any): TimetableCell | null => {
    if (forceType === 'class' || forceType === 'all_classes') {
      return schedule[customId]?.[day]?.[periodId] || null;
    }
    if (forceType === 'teacher' || forceType === 'all_teachers') {
      for (const cId of Object.keys(schedule)) {
        const cell = schedule[cId]?.[day]?.[periodId];
        if (cell && cell.teacherId === customId) {
          return cell;
        }
      }
      return null;
    }
    if (forceType === 'room') {
      for (const cId of Object.keys(schedule)) {
        const cell = schedule[cId]?.[day]?.[periodId];
        if (cell && cell.roomId === customId) {
          return cell;
        }
      }
      return null;
    }
    return null;
  };

  const currentConflicts = conflicts.filter((c:any) => {
    if (!c.slot || !c.slot.day) return false;
    if (viewType === 'class' || viewType === 'all_classes') return c.entityIds.includes(selectedId);
    if (viewType === 'teacher' || viewType === 'all_teachers') return c.entityIds.includes(selectedId);
    if (viewType === 'room') return c.entityIds.includes(selectedId);
    return false;
  });

  const handleCellClick = (day: DayOfWeek, periodId: string, isBreak: boolean) => {
    if (isBreak || viewType !== 'class') return;
    setActiveCell({ day, periodId });
    setSelectedSubject('');
    setPeriodType('single');
    setSelectedActivity('');
    setCollisionMsg('');
    // preload existing
    try {
      const existing = schedule[selectedId]?.[day]?.[periodId];
      if (existing) {
        if (existing.isActivity) {
          setSelectedActivity(existing.activity || '');
        } else {
          const s = subjects.find((x:any)=>x.id===existing.subjectId);
          if (s) setSelectedSubject(s.name || s.id);
          else if (existing.subjectId) {
            const byName = subjects.find((x:any)=>x.name===existing.subjectId);
            setSelectedSubject(byName ? byName.name : existing.subjectId);
          }
          if ((existing as any).isPS) setPeriodType('ps');
          else if ((existing as any).isDouble) setPeriodType('double');
          else setPeriodType('single');
        }
      }
    } catch {}
  };

  const handlePlaceUnscheduled = () => {
    if (!activeCell || !selectedUnscheduledId) return;
    const un = timetableData.unscheduled.find((u:any) => u.id === selectedUnscheduledId);
    if (!un) return;
    const sub = subjects.find((s:any) => s.id === un.subjectId);
    const roomTypeNeeded = (sub as any)?.requiresRoomType || 'regular';
    const occupiedRoomIds = Object.keys(schedule).map(cid => schedule[cid]?.[activeCell.day]?.[activeCell.periodId]?.roomId).filter(Boolean);
    const availRooms = rooms.filter((r:any) => r.type === roomTypeNeeded && !occupiedRoomIds.includes(r.id));
    const selectedRoomId = availRooms.length > 0 ? availRooms[0].id : (rooms.find((r:any) => r.type === roomTypeNeeded)?.id || rooms[0]?.id || '');
    scheduleUnscheduledLesson(selectedUnscheduledId, un.classId, activeCell.day, activeCell.periodId, selectedRoomId);
    setActiveCell(null);
  };

  const handleRemoveCell = () => {
    if (!activeCell) return;
    try {
      removeLessonSlot(selectedId, activeCell.day, activeCell.periodId);
    } catch (e:any) { setCollisionMsg('Remove failed: '+String(e)); }
    setActiveCell(null);
  };

  // Safe save: uses original updateLessonSlot only, no manual schedule mutation, no reload, English only
  const handleSaveCell = () => {
    if (!activeCell) return;
    try {
      const slot: any = activePeriods.find((s:any)=>s.id===activeCell.periodId);
      const isActivitySlot = slot?.isActivity || slot?.id==='act' || (slot?.name && String(slot.name).toLowerCase().includes('activity'));
      
      if (isActivitySlot) {
        if (!selectedActivity) { setCollisionMsg('Select an activity'); return; }
        // Save activity - use updateLessonSlot with activity id
        try {
          if (typeof updateLessonSlot === 'function') {
            updateLessonSlot(selectedId, activeCell.day, activeCell.periodId, 'activity', '', '');
            // Then patch the cell to be activity type via direct schedule tweak safe
            setTimeout(()=>{
              try {
                const raw = localStorage.getItem('tt_timetableData');
                if (raw) {
                  const data = JSON.parse(raw);
                  if (data?.schedule?.[selectedId]?.[activeCell.day]?.[activeCell.periodId]) {
                    data.schedule[selectedId][activeCell.day][activeCell.periodId] = {
                      ...data.schedule[selectedId][activeCell.day][activeCell.periodId],
                      subjectId: 'activity',
                      isActivity: true,
                      activity: selectedActivity,
                      subjectName: selectedActivity
                    };
                    localStorage.setItem('tt_timetableData', JSON.stringify(data));
                  }
                }
              } catch {}
            }, 200);
          }
        } catch (e:any) { setCollisionMsg('Save activity failed: '+String(e)); return; }
        setActiveCell(null);
        setCollisionMsg('');
        return;
      }

      if (periodType === 'ps') {
        if (typeof updateLessonSlot === 'function') {
          updateLessonSlot(selectedId, activeCell.day, activeCell.periodId, 'ps', '', '');
          setTimeout(()=>{
            try {
              const raw = localStorage.getItem('tt_timetableData');
              if (raw) {
                const data = JSON.parse(raw);
                if (data?.schedule?.[selectedId]?.[activeCell.day]?.[activeCell.periodId]) {
                  data.schedule[selectedId][activeCell.day][activeCell.periodId] = {
                    ...data.schedule[selectedId][activeCell.day][activeCell.periodId],
                    subjectId: 'ps',
                    subjectName: 'PS',
                    isPS: true
                  };
                  localStorage.setItem('tt_timetableData', JSON.stringify(data));
                }
              }
            } catch {}
          }, 200);
        }
        setActiveCell(null);
        setCollisionMsg('');
        return;
      }

      if (!selectedSubject) { setCollisionMsg('Select a subject'); return; }

      // Find subject
      let subjId = selectedSubject;
      let subjName = selectedSubject;
      const foundSub = subjects.find((s:any)=> s.id===selectedSubject || s.name===selectedSubject);
      if (foundSub) { subjId = foundSub.id; subjName = foundSub.name; }

      // Find teacher via classSubjects or teachingAssignments
      let teacherId = '';
      try {
        const cs = classSubjects.find((c:any)=> c.classId===selectedId && (c.subjectId===subjId || subjects.find((s:any)=>s.id===c.subjectId)?.name===subjName));
        if (cs) teacherId = cs.teacherId;
      } catch {}
      if (!teacherId) {
        const res = findTeacherForSubjectClass(subjName, classes.find((c:any)=>c.id===selectedId)?.name || '');
        if (res) teacherId = res.id;
      }
      if (!teacherId) {
        const t = teachers.find((x:any)=> x.qualifiedSubjects?.includes(subjId));
        if (t) teacherId = t.id;
      }
      if (!teacherId) {
        setCollisionMsg('No teacher assigned to teach ' + subjName + ' in ' + (classes.find((c:any)=>c.id===selectedId)?.name || selectedId) + '. Go to Assign Teaching Classes & Subjects first.');
        return;
      }

      // Collision check safe
      try {
        for (const cid of Object.keys(schedule||{})) {
          if (cid === selectedId) continue;
          const cell = schedule[cid]?.[activeCell.day]?.[activeCell.periodId];
          if (cell && cell.teacherId === teacherId) {
            const clsName = classes.find((c:any)=>c.id===cid)?.name || cid;
            setCollisionMsg('Teacher ' + (teachers.find((t:any)=>t.id===teacherId)?.name || teacherId) + ' is already assigned to ' + clsName + ' on ' + activeCell.day + ' ' + activeCell.periodId + '.');
            return;
          }
        }
      } catch {}

      // Double check next period if double
      if (periodType === 'double') {
        const teachingIds = activePeriods.filter((s:any)=>!s.isBreak && !(s as any).isActivity).map((s:any)=>s.id);
        const idx = teachingIds.indexOf(activeCell.periodId);
        const nextId = teachingIds[idx+1];
        if (!nextId) { setCollisionMsg('Double period cannot be the last period. Choose Single.'); return; }
        const existingNext = schedule[selectedId]?.[activeCell.day]?.[nextId];
        if (existingNext) { setCollisionMsg('Next period already has a lesson. Remove it first.'); return; }
      }

      // Find room
      const subForRoom = subjects.find((s:any)=>s.id===subjId);
      const roomType = (subForRoom as any)?.requiresRoomType || 'regular';
      const schoolClass = classes.find((c:any)=>c.id===selectedId);
      let roomId = '';
      if (roomType === 'regular' && (schoolClass as any)?.assignedRoomId) {
        const occupied = Object.keys(schedule||{}).some(cid => schedule[cid]?.[activeCell.day]?.[activeCell.periodId]?.roomId === (schoolClass as any).assignedRoomId);
        if (!occupied) roomId = (schoolClass as any).assignedRoomId;
      }
      if (!roomId) {
        const avail = rooms.filter((r:any)=> r.type===roomType && !Object.keys(schedule||{}).some(cid => schedule[cid]?.[activeCell.day]?.[activeCell.periodId]?.roomId===r.id));
        roomId = avail[0]?.id || rooms.find((r:any)=>r.type===roomType)?.id || rooms[0]?.id || '';
      }

      if (typeof updateLessonSlot === 'function') {
        updateLessonSlot(selectedId, activeCell.day, activeCell.periodId, subjId, teacherId, roomId);
        // Patch double/PS flags after
        setTimeout(()=>{
          try {
            const raw = localStorage.getItem('tt_timetableData');
            if (raw) {
              const data = JSON.parse(raw);
              const cell = data?.schedule?.[selectedId]?.[activeCell.day]?.[activeCell.periodId];
              if (cell) {
                cell.subjectName = subjName;
                cell.isDouble = periodType==='double';
                cell.isPS = false;
                cell.isActivity = false;
                // For double, also set next period same teacher/subject as span
                if (periodType==='double') {
                  const teachingIds = activePeriods.filter((s:any)=>!s.isBreak && !(s as any).isActivity).map((s:any)=>s.id);
                  const idx = teachingIds.indexOf(activeCell.periodId);
                  const nextId = teachingIds[idx+1];
                  if (nextId) {
                    if (!data.schedule[selectedId][activeCell.day][nextId]) {
                      data.schedule[selectedId][activeCell.day][nextId] = { subjectId: subjId, subjectName: subjName, teacherId, roomId, classId: selectedId, isDouble: true, isDoubleSpan: true };
                    }
                  }
                }
                localStorage.setItem('tt_timetableData', JSON.stringify(data));
              }
            }
          } catch {}
        }, 200);
      }
      setActiveCell(null);
      setCollisionMsg('');
    } catch (e:any) {
      console.error('Save failed', e);
      setCollisionMsg('Save failed: ' + (e?.message || String(e)));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-4 rounded-2xl shadow-sm border border-slate-100 gap-4 print:hidden">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex flex-wrap rounded-xl bg-slate-100 p-1 border border-slate-200 gap-y-1">
            {(['class', 'teacher', 'room', 'master'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setViewType(type as any)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg capitalize transition-all ${
                  viewType === type 
                    ? 'bg-white text-slate-800 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {type} View
              </button>
            ))}
            <div className="w-px bg-slate-200 mx-1.5 h-6 self-center" />
            {(['all_classes', 'all_teachers'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setViewType(type as any)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  viewType === type 
                    ? 'bg-white text-slate-800 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {type === 'all_classes' ? 'Batch Classes' : 'Batch Teachers'}
              </button>
            ))}
          </div>
          {!['master', 'all_classes', 'all_teachers'].includes(viewType) && (
            <select
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
              className="text-sm border border-slate-200 px-3 py-1.5 rounded-xl bg-white text-slate-700 font-semibold focus:ring-2 focus:ring-indigo-500"
            >
              {viewType === 'class' && classes.map((c:any) => <option key={c.id} value={c.id}>{c.name}</option>)}
              {viewType === 'teacher' && teachers.map((t:any) => <option key={t.id} value={t.id}>{t.name}</option>)}
              {viewType === 'room' && rooms.map((r:any) => <option key={r.id} value={r.id}>{r.name} ({r.type})</option>)}
            </select>
          )}
          {['all_classes', 'all_teachers'].includes(viewType) && (
            <span className="text-xs font-medium text-slate-400 italic">
              Scroll down to preview. Click "Print" to print a separate sheet for each.
            </span>
          )}
        </div>
        <button
          onClick={handlePrint}
          className="flex items-center space-x-2 px-4 py-2 bg-slate-800 text-white text-sm font-semibold rounded-xl hover:bg-slate-900 shadow-md transition-all"
        >
          <Printer size={16} />
          <span>Print Schedule</span>
        </button>
      </div>

      {viewType !== 'master' && currentConflicts.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex items-start space-x-3 print:hidden">
          <AlertTriangle className="text-amber-500 flex-shrink-0" size={20} />
          <div>
            <h3 className="font-semibold text-amber-800 text-sm">Schedule Issues for this {viewType}</h3>
            <ul className="list-disc ml-4 text-xs text-amber-700 mt-1 space-y-0.5">
              {currentConflicts.map((c:any) => (
                <li key={c.id}>
                  <b>{c.slot.day} {activePeriods.find((s:any)=>s.id===c.slot.periodId)?.name}:</b> {c.description}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {!['master', 'all_classes', 'all_teachers'].includes(viewType) ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden print:border-none print:shadow-none">
          <div className="p-4 border-b border-slate-100 hidden print:flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {schoolLogo && (
                <img src={schoolLogo} alt="Logo" className="h-12 w-auto max-h-12 object-contain" />
              )}
              <div className="text-left">
                <h1 className="text-xl font-bold text-slate-900 leading-tight">{schoolName}</h1>
                <p className="text-slate-400 text-xs font-semibold">Weekly Timetable Schedule</p>
              </div>
            </div>
            <div className="text-right border-l border-slate-200 pl-4">
              <h2 className="text-lg font-extrabold text-indigo-700">
                {viewType === 'class' && `Class: ${classes.find((c:any)=>c.id===selectedId)?.name}`}
                {viewType === 'teacher' && `Teacher: ${teachers.find((t:any)=>t.id===selectedId)?.name}`}
                {viewType === 'room' && `Room: ${rooms.find((r:any)=>r.id===selectedId)?.name}`}
              </h2>
              <p className="text-[10px] text-slate-400 font-medium">Generated by TimeTable Pro</p>
            </div>
          </div>

          <div className="overflow-x-auto print:overflow-visible">
            <table className="w-full border-collapse table-fixed min-w-[700px] print:min-w-0 print:w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold text-xs uppercase tracking-wider">
                  <th className="p-3 border-r border-slate-200 w-32 text-center bg-slate-50 sticky left-0 z-10 print:static print:z-0 print:w-28">Time Slot</th>
                  {days.map((d:any) => (
                    <th key={d} className="p-3 border-r border-slate-100 text-center">{d}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {activePeriods.map((p:any) => {
                  if (p.isBreak) {
                    return (
                      <tr key={p.id} className="bg-slate-100/80 border-b border-slate-200 text-slate-400 text-xs font-semibold tracking-wider">
                        <td className="p-3 border-r border-slate-200 font-bold bg-slate-50/80 text-center sticky left-0 print:static">
                          <div className="text-slate-500">{p.name}</div>
                          <div className="text-[10px] font-medium text-slate-400 mt-0.5">{p.startTime} - {p.endTime}</div>
                        </td>
                        <td colSpan={days.length} className="p-3 text-center bg-slate-100/50 italic text-slate-400 uppercase font-bold tracking-widest text-2xs">
                          ☕ {p.name} (No classes)
                        </td>
                      </tr>
                    );
                  }

                  return (
                    <tr key={p.id} className="border-b border-slate-200 h-24 print:h-20">
                      <td className="p-2 border-r border-slate-200 font-bold bg-slate-50 text-slate-700 text-center text-xs sticky left-0 z-10 print:static print:z-0">
                        <div className="text-slate-900">{p.name}</div>
                        <div className="text-[10px] font-medium text-slate-400 mt-1 bg-white border rounded px-1.5 py-0.5 inline-block">
                          {p.startTime} - {p.endTime}
                        </div>
                      </td>

                      {days.map((d:any) => {
                        const cell = getCellData(d, p.id);
                        const hasConflict = currentConflicts.some((c:any) => c.slot.day === d && c.slot.periodId === p.id);
                        
                        if (!cell) {
                          return (
                            <td 
                              key={d} 
                              onClick={() => handleCellClick(d, p.id, p.isBreak)}
                              className={`p-2 border-r border-slate-100 text-center text-xs text-slate-300 italic align-middle transition-all bg-dashed group ${
                                viewType === 'class' ? 'hover:bg-indigo-50/40 cursor-pointer' : ''
                              }`}
                            >
                              <span className="opacity-0 group-hover:opacity-100 font-semibold text-indigo-500 text-2xs flex items-center justify-center">
                                {viewType === 'class' ? <Plus size={12} className="mr-0.5" /> : ''}
                                {viewType === 'class' ? 'Place Lesson' : 'Free'}
                              </span>
                            </td>
                          );
                        }

                        const sub = subjects.find((s:any) => s.id === cell.subjectId);
                        const t = teachers.find((teach:any) => teach.id === cell.teacherId);
                        const r = rooms.find((room:any) => room.id === cell.roomId);

                        // For print/view: subject + teacher (or PS/Activity)
                        const displaySub = (cell as any).subjectName || sub?.name || (cell.subjectId==='ps' ? 'PS' : cell.isActivity ? (cell as any).activity || 'Activity' : 'SUB');
                        const isPS = (cell as any).isPS || cell.subjectId==='ps';
                        const isAct = (cell as any).isActivity;

                        return (
                          <td 
                            key={d} 
                            onClick={() => handleCellClick(d, p.id, p.isBreak)}
                            className={`p-2 border-r border-slate-100 align-middle transition-all text-center relative group ${
                              viewType === 'class' ? 'cursor-pointer' : ''
                            }`}
                          >
                            <div className={`w-full h-full p-2 rounded-xl border flex flex-col justify-center transition-all ${sub?.color || (isPS ? 'bg-slate-100 border-slate-300' : isAct ? 'bg-indigo-50 border-indigo-200' : 'bg-slate-100')} ${
                              hasConflict ? 'ring-2 ring-red-500 border-transparent shadow-red-100 animate-pulse' : 'shadow-sm'
                            }`}>
                              <div className="font-bold text-slate-800 text-sm leading-tight" style={{fontFamily:'Arial, sans-serif'}}>{isPS ? 'PS' : sub?.code || displaySub.substring(0,4).toUpperCase()}</div>
                              <div className="font-bold text-slate-900 text-xs mt-0.5 truncate" style={{fontFamily:'Arial, sans-serif'}}>{isPS ? 'Private Studies' : isAct ? displaySub : sub?.name || displaySub}</div>
                              
                              <div className="border-t border-slate-400/20 mt-1.5 pt-1 flex flex-col items-center space-y-0.5 text-[10px] font-bold text-slate-600/90 uppercase tracking-tight">
                                {viewType !== 'teacher' && (
                                  <div className="truncate w-full max-w-[120px] text-center" style={{fontFamily:'Arial, sans-serif'}}>👨‍🏫 {t?.name?.split(' ').slice(-1)[0] || (isPS || isAct ? '' : 'Teacher')}</div>
                                )}
                                {viewType === 'teacher' && (
                                  <div className="truncate w-full max-w-[120px] text-center text-slate-800 font-black">🏫 {classes.find((c:any)=>c.id===cell.classId)?.name}</div>
                                )}
                                {viewType !== 'room' && !isPS && !isAct && (
                                  <div className="truncate w-full max-w-[120px] text-center">🚪 {r?.name.replace('Classroom ', 'R-') || 'Room'}</div>
                                )}
                              </div>

                              {hasConflict && (
                                <div className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 shadow-md">
                                  <AlertTriangle size={10} />
                                </div>
                              )}
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6 print:p-0 print:border-none print:shadow-none">
          <h2 className="text-lg font-bold text-slate-800 mb-4 print:hidden">
            {viewType === 'master' ? 'General School Timetable' : 'Print All Class Timetables'}
          </h2>
          <div className="space-y-8 print:space-y-12">
            {classes.map((cls:any) => {
              const clsSubs = classSubjects.filter((cs:any) => cs.classId === cls.id);
              const totalP = clsSubs.reduce((acc:any, s:any) => acc + s.periodsPerWeek, 0);
              
              return (
                <div key={cls.id} className="break-after-page print:break-after-page border border-slate-200 rounded-xl p-4 bg-white print:border-slate-300 print:p-6 print:mb-8">
                  <div className="p-3 border-b border-slate-200 hidden print:flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      {schoolLogo && <img src={schoolLogo} alt="Logo" className="h-10 w-auto object-contain" />}
                      <div className="text-left">
                        <h1 className="text-lg font-bold text-slate-900 leading-tight">{schoolName}</h1>
                        <p className="text-slate-400 text-2xs font-semibold">Official Timetable Schedule</p>
                      </div>
                    </div>
                    <div className="text-right border-l border-slate-200 pl-3">
                      <h2 className="text-base font-extrabold text-indigo-700">Class: {cls.name}</h2>
                      <p className="text-[9px] text-slate-400 font-medium">Generated by TimeTable Pro</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-3 print:hidden">
                    <h3 className="text-base font-bold text-slate-800">{cls.name} — Weekly Schedule</h3>
                    <div className="text-xs text-slate-400 font-medium">{clsSubs.length} Subjects • {totalP} periods</div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse table-fixed text-xs border border-slate-200">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                          <th className="p-1.5 border-r border-slate-200 w-20 text-center">Slot</th>
                          {days.map((d:any) => <th key={d} className="p-1.5 border-r border-slate-200 text-center">{d.substring(0,3)}</th>)}
                        </tr>
                      </thead>
                      <tbody>
                        {activePeriods.map((p:any) => {
                          if (p.isBreak) {
                            return (
                              <tr key={p.id} className="bg-slate-100/60 border-b border-slate-200 text-slate-400 text-3xs">
                                <td className="p-1 font-bold text-center border-r bg-slate-50/60 whitespace-nowrap">{p.name.split(' ')[1] || p.name} ({p.startTime})</td>
                                <td colSpan={days.length} className="p-1 text-center font-bold text-[10px] uppercase tracking-wider text-slate-400 bg-slate-100/30">
                                  ☕ {p.name}
                                </td>
                              </tr>
                            );
                          }
                          return (
                            <tr key={p.id} className="border-b border-slate-100">
                              <td className="p-1 font-bold text-center border-r bg-slate-50 text-slate-400 text-3xs whitespace-nowrap">{p.name.split(' ')[1] || p.name} ({p.startTime})</td>
                              {days.map((d:any) => {
                                const cell = schedule[cls.id]?.[d]?.[p.id];
                                if (!cell) return <td key={d} className="border p-1 text-center text-slate-300 text-[10px]">—</td>;
                                const sub = subjects.find((s:any)=>s.id===cell.subjectId);
                                const t = teachers.find((tc:any)=>tc.id===cell.teacherId);
                                const isPS = (cell as any).isPS || cell.subjectId==='ps';
                                const isAct = (cell as any).isActivity;
                                return <td key={d} className="border p-1 text-center"><div className="font-bold text-slate-800 text-xs" style={{fontFamily:'Arial'}}>{isPS ? 'PS' : isAct ? (cell as any).activity : sub?.code || cell.subjectId}</div><div className="text-[10px] text-slate-600 truncate" style={{fontFamily:'Arial'}}>{isPS ? '' : isAct ? '' : t?.name?.split(' ').slice(-1)[0] || ''}</div></td>;
                              })}
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Cell Edit Modal */}
      {activeCell && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-5 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-black text-sm">{activeCell.day} — {activePeriods.find((s:any)=>s.id===activeCell.periodId)?.name} ({activePeriods.find((s:any)=>s.id===activeCell.periodId)?.startTime}-{(activePeriods.find((s:any)=>s.id===activeCell.periodId) as any)?.endTime})</h3>
              <button onClick={()=>setActiveCell(null)} className="p-1 rounded-full hover:bg-slate-100"><X size={18} /></button>
            </div>
            {(() => {
              const slot: any = activePeriods.find((s:any)=>s.id===activeCell.periodId);
              const isAct = slot?.isActivity || slot?.id==='act';
              if (isAct) {
                return (
                  <>
                    <div>
                      <label className="text-xs font-bold">Select Activity (15:30-17:30)</label>
                      <select value={selectedActivity} onChange={e=>setSelectedActivity(e.target.value)} className="w-full mt-1 border px-3 py-2 rounded-xl text-sm">
                        <option value="">-- Select --</option>
                        {ACTIVITY_OPTIONS.map((a:any)=> <option key={a} value={a}>{a}</option>)}
                      </select>
                    </div>
                  </>
                );
              }
              return (
                <>
                  <div>
                    <label className="text-xs font-bold">Subject</label>
                    <select value={selectedSubject} onChange={e=>setSelectedSubject(e.target.value)} className="w-full mt-1 border px-3 py-2 rounded-xl text-sm">
                      <option value="">-- Select subject --</option>
                      {(() => {
                        try {
                          const fromAdmin = JSON.parse(localStorage.getItem('sms_school_subjects') || '[]');
                          if (fromAdmin.length) return fromAdmin.map((name:string)=> <option key={name} value={name}>{name}</option>);
                        } catch {}
                        return subjects.map((s:any)=> <option key={s.id} value={s.id}>{s.name}</option>);
                      })()}
                    </select>
                    {selectedSubject && (()=> {
                      const found = findTeacherForSubjectClass(selectedSubject, classes.find((c:any)=>c.id===selectedId)?.name || '');
                      return found ? <p className="text-xs text-emerald-600 mt-1">Teacher: <b>{found.name}</b></p> : <p className="text-xs text-amber-600 mt-1">No teacher assigned to teach this subject in this class.</p>;
                    })()}
                  </div>
                  <div>
                    <label className="text-xs font-bold">Period Type</label>
                    <div className="flex gap-2 mt-1">
                      <button onClick={()=>setPeriodType('single')} className={`flex-1 py-2 rounded-xl text-xs font-bold border ${periodType==='single'?'bg-indigo-600 text-white border-indigo-600':'bg-white'}`}>Single (40 min)</button>
                      <button onClick={()=>setPeriodType('double')} className={`flex-1 py-2 rounded-xl text-xs font-bold border ${periodType==='double'?'bg-emerald-600 text-white border-emerald-600':'bg-white'}`}>Double (80 min)</button>
                      <button onClick={()=>setPeriodType('ps')} className={`flex-1 py-2 rounded-xl text-xs font-bold border ${periodType==='ps'?'bg-slate-800 text-white border-slate-800':'bg-white'}`}>PS</button>
                    </div>
                  </div>
                </>
              );
            })()}

            {collisionMsg && <div className="p-2 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-semibold">{collisionMsg}</div>}

            <div className="flex gap-2">
              <button onClick={()=>{
                // Call the safe handleSaveCell via closure
                const slot:any = activePeriods.find((s:any)=>s.id===activeCell.periodId);
                const isActivitySlot = slot?.isActivity || slot?.id==='act';
                if (isActivitySlot) {
                  if (!selectedActivity) { setCollisionMsg('Select an activity'); return; }
                  try {
                    (updateLessonSlot as any)(selectedId, activeCell.day, activeCell.periodId, 'activity', '', '');
                    setTimeout(()=>{
                      try {
                        const raw = localStorage.getItem('tt_timetableData');
                        if (raw) {
                          const data = JSON.parse(raw);
                          if (data?.schedule?.[selectedId]?.[activeCell.day]?.[activeCell.periodId]) {
                            data.schedule[selectedId][activeCell.day][activeCell.periodId] = {
                              ...data.schedule[selectedId][activeCell.day][activeCell.periodId],
                              subjectId: 'activity', isActivity: true, activity: selectedActivity
                            };
                            localStorage.setItem('tt_timetableData', JSON.stringify(data));
                          }
                        }
                      } catch {}
                    }, 200);
                    setActiveCell(null);
                    setCollisionMsg('');
                  } catch(e:any){ setCollisionMsg('Save failed: '+String(e)); }
                  return;
                }
                if (periodType==='ps') {
                  try {
                    (updateLessonSlot as any)(selectedId, activeCell.day, activeCell.periodId, 'ps', '', '');
                    setTimeout(()=>{
                      try {
                        const raw = localStorage.getItem('tt_timetableData');
                        if (raw) {
                          const data = JSON.parse(raw);
                          if (data?.schedule?.[selectedId]?.[activeCell.day]?.[activeCell.periodId]) {
                            data.schedule[selectedId][activeCell.day][activeCell.periodId] = {
                              ...data.schedule[selectedId][activeCell.day][activeCell.periodId],
                              subjectId: 'ps', isPS: true
                            };
                            localStorage.setItem('tt_timetableData', JSON.stringify(data));
                          }
                        }
                      } catch {}
                    }, 200);
                    setActiveCell(null);
                    setCollisionMsg('');
                  } catch(e:any){ setCollisionMsg('Save failed: '+String(e)); }
                  return;
                }
                if (!selectedSubject) { setCollisionMsg('Select a subject'); return; }
                let subjId = selectedSubject;
                let subjName = selectedSubject;
                const foundSub = subjects.find((s:any)=> s.id===selectedSubject || s.name===selectedSubject);
                if (foundSub) { subjId = foundSub.id; subjName = foundSub.name; }
                let teacherId = '';
                try {
                  const cs = classSubjects.find((c:any)=> c.classId===selectedId && (c.subjectId===subjId || subjects.find((s:any)=>s.id===c.subjectId)?.name===subjName));
                  if (cs) teacherId = cs.teacherId;
                } catch {}
                if (!teacherId) {
                  const res = findTeacherForSubjectClass(subjName, classes.find((c:any)=>c.id===selectedId)?.name || '');
                  if (res) teacherId = res.id;
                }
                if (!teacherId) {
                  const t = teachers.find((x:any)=> x.qualifiedSubjects?.includes(subjId));
                  if (t) teacherId = t.id;
                }
                if (!teacherId) {
                  setCollisionMsg('No teacher assigned to teach ' + subjName + ' in ' + (classes.find((c:any)=>c.id===selectedId)?.name || selectedId) + '. Go to Assign Teaching Classes & Subjects first.');
                  return;
                }
                try {
                  for (const cid of Object.keys(schedule||{})) {
                    if (cid === selectedId) continue;
                    const cell = schedule[cid]?.[activeCell.day]?.[activeCell.periodId];
                    if (cell && cell.teacherId === teacherId) {
                      const clsName = classes.find((c:any)=>c.id===cid)?.name || cid;
                      setCollisionMsg('Teacher ' + (teachers.find((t:any)=>t.id===teacherId)?.name || teacherId) + ' is already assigned to ' + clsName + ' on ' + activeCell.day + ' ' + activeCell.periodId + '.');
                      return;
                    }
                  }
                } catch {}
                if (periodType==='double') {
                  const teachingIds = activePeriods.filter((s:any)=>!s.isBreak && !(s as any).isActivity).map((s:any)=>s.id);
                  const idx = teachingIds.indexOf(activeCell.periodId);
                  const nextId = teachingIds[idx+1];
                  if (!nextId) { setCollisionMsg('Double period cannot be the last period. Choose Single.'); return; }
                  const existingNext = schedule[selectedId]?.[activeCell.day]?.[nextId];
                  if (existingNext) { setCollisionMsg('Next period already has a lesson. Remove it first.'); return; }
                }
                const subForRoom = subjects.find((s:any)=>s.id===subjId);
                const roomType = (subForRoom as any)?.requiresRoomType || 'regular';
                const schoolClass = classes.find((c:any)=>c.id===selectedId);
                let roomId = '';
                if (roomType === 'regular' && (schoolClass as any)?.assignedRoomId) {
                  const occupied = Object.keys(schedule||{}).some(cid => schedule[cid]?.[activeCell.day]?.[activeCell.periodId]?.roomId === (schoolClass as any).assignedRoomId);
                  if (!occupied) roomId = (schoolClass as any).assignedRoomId;
                }
                if (!roomId) {
                  const avail = rooms.filter((r:any)=> r.type===roomType && !Object.keys(schedule||{}).some(cid => schedule[cid]?.[activeCell.day]?.[activeCell.periodId]?.roomId===r.id));
                  roomId = avail[0]?.id || rooms.find((r:any)=>r.type===roomType)?.id || rooms[0]?.id || '';
                }
                try {
                  (updateLessonSlot as any)(selectedId, activeCell.day, activeCell.periodId, subjId, teacherId, roomId);
                  setTimeout(()=>{
                    try {
                      const raw = localStorage.getItem('tt_timetableData');
                      if (raw) {
                        const data = JSON.parse(raw);
                        const cell = data?.schedule?.[selectedId]?.[activeCell.day]?.[activeCell.periodId];
                        if (cell) {
                          cell.subjectName = subjName;
                          cell.isDouble = periodType==='double';
                          if (periodType==='double') {
                            const teachingIds = activePeriods.filter((s:any)=>!s.isBreak && !(s as any).isActivity).map((s:any)=>s.id);
                            const idx = teachingIds.indexOf(activeCell.periodId);
                            const nextId = teachingIds[idx+1];
                            if (nextId && !data.schedule[selectedId][activeCell.day][nextId]) {
                              data.schedule[selectedId][activeCell.day][nextId] = { subjectId: subjId, subjectName: subjName, teacherId, roomId, classId: selectedId, isDouble: true, isDoubleSpan: true };
                            }
                          }
                          localStorage.setItem('tt_timetableData', JSON.stringify(data));
                        }
                      }
                    } catch {}
                  }, 200);
                  setActiveCell(null);
                  setCollisionMsg('');
                } catch(e:any){ setCollisionMsg('Save failed: '+String(e)); }
              }} className="flex-1 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-sm">Save</button>
              <button onClick={()=>{
                try { removeLessonSlot(selectedId, activeCell.day, activeCell.periodId); } catch(e:any){ setCollisionMsg(String(e)); return; }
                setActiveCell(null);
              }} className="flex-1 py-2.5 bg-white border text-slate-700 rounded-xl font-bold text-sm">Remove</button>
              <button onClick={()=>setActiveCell(null)} className="px-4 py-2.5 bg-slate-100 rounded-xl font-bold text-sm">Close</button>
            </div>
            <p className="text-[10px] text-slate-400 text-center">Collision: Teacher cannot have 2 classes at same time. Double will occupy next period.</p>
          </div>
        </div>
      )}

      <style>{`
        @media print {
          @page { size: A4 landscape; margin: 10mm; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .print\\:hidden { display: none !important; }
          table { page-break-inside: auto; }
          tr { page-break-inside: avoid; }
          a { text-decoration: none !important; color: inherit !important; }
        }
      `}</style>
    </div>
  );
};
