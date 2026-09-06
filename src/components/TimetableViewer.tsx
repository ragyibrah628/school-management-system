import React, { useState } from 'react';
import { useTimetable } from '../context/TimetableContext';
import { DayOfWeek, TimetableCell } from '../types';
import { 
  Printer, Grid, 
  AlertTriangle, X, Trash2, Plus 
} from 'lucide-react';

const NAMBAWALA_SLOTS: any[] = [
  { id: 'p1', name: 'Period 1', startTime: '08:00', endTime: '08:40', isBreak: false },
  { id: 'p2', name: 'Period 2', startTime: '08:40', endTime: '09:20', isBreak: false },
  { id: 'p3', name: 'Period 3', startTime: '09:20', endTime: '10:00', isBreak: false },
  { id: 'p4', name: 'Period 4', startTime: '10:00', endTime: '10:40', isBreak: false },
  { id: 'b1', name: 'Morning Break', startTime: '10:40', endTime: '11:10', isBreak: true },
  { id: 'p5', name: 'Period 5', startTime: '11:10', endTime: '11:50', isBreak: false },
  { id: 'p6', name: 'Period 6', startTime: '11:50', endTime: '12:30', isBreak: false },
  { id: 'p7', name: 'Period 7', startTime: '12:30', endTime: '13:10', isBreak: false },
  { id: 'p8', name: 'Period 8', startTime: '13:10', endTime: '13:50', isBreak: false },
  { id: 'p9', name: 'Period 9', startTime: '13:50', endTime: '14:30', isBreak: false },
  { id: 'lunch', name: 'Lunch', startTime: '14:30', endTime: '15:30', isBreak: true },
  { id: 'act', name: 'Activity', startTime: '15:30', endTime: '17:30', isBreak: false, isActivity: true },
];
const ACTIVITY_OPTIONS = ['Debate', 'Self Reliance', 'General Cleanness', 'Sports & Games', 'Subject Clubs'];
const isActivitySlot = (slot: any) => Boolean(slot?.isActivity || slot?.id === 'act' || slot?.name?.trim().toLowerCase() === 'activity');
const getConfiguredSchoolName = (fallback: string) => localStorage.getItem('sms_school_name_setting') || fallback || 'NAMBAWALA SECONDARY SCHOOL';
const getConfiguredDistrict = () => localStorage.getItem('sms_district_name') || 'RUANGWA DISTRICT COUNCIL';
const getConfiguredLogo = (fallback: string | null) => localStorage.getItem('sms_school_logo') || fallback || '';
const getSubjectCode = (subject: any) => {
  if (!subject) return '';
  try {
    const configuredCodes = JSON.parse(localStorage.getItem('sms_subject_codes') || '{}');
    if (configuredCodes[subject.name]) return configuredCodes[subject.name];
  } catch {}
  return subject.code || subject.name?.substring(0, 4).toUpperCase() || '';
};
const getCellSubjectDisplay = (cell: any, subjects: any[]) => {
  const first = subjects.find(s => s.id === cell?.subjectId || s.name === cell?.subjectName);
  const second = subjects.find(s => s.id === cell?.secondSubjectId || s.name === cell?.secondSubjectName);
  const firstCode = cell?.subjectId === 'ps' ? 'PS' : getSubjectCode(first) || getSubjectCode({ name: cell?.subjectName });
  const secondCode = cell?.secondSubjectId === 'ps' ? 'PS' : getSubjectCode(second) || getSubjectCode({ name: cell?.secondSubjectName });
  return cell?.isCombined && secondCode ? `${firstCode}/${secondCode}` : firstCode;
};
const getCellSubjectTeacherLines = (cell: any, subjects: any[], teachers: any[], viewType: string, classes: any[]) => {
  const first = subjects.find(s => s.id === cell?.subjectId || s.name === cell?.subjectName);
  const second = subjects.find(s => s.id === cell?.secondSubjectId || s.name === cell?.secondSubjectName);
  const firstCode = cell?.subjectId === 'ps' ? 'PS' : getSubjectCode(first) || getSubjectCode({ name: cell?.subjectName });
  const secondCode = cell?.secondSubjectId === 'ps' ? 'PS' : getSubjectCode(second) || getSubjectCode({ name: cell?.secondSubjectName });
  const className = classes.find(c => c.id === cell?.classId)?.name || '';
  if (viewType === 'teacher') return [{ code: firstCode, teacher: className }];
  const firstTeacher = teachers.find(t => t.id === cell?.teacherId)?.name || '';
  const secondTeacher = teachers.find(t => t.id === cell?.secondTeacherId)?.name || '';
  if (cell?.isCombined && secondCode) {
    return [{ code: firstCode, teacher: firstTeacher }, { code: secondCode, teacher: secondTeacher }];
  }
  return [{ code: firstCode, teacher: firstTeacher }];
};
const getSubjectCodeTT = (name: string) => { try { const m=JSON.parse(localStorage.getItem('sms_subject_codes')||'{}'); if(m && m[name]) return m[name]; } catch{} return name.substring(0,4).toUpperCase().replace(' ',''); }
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
  
  // Cell click editing state
  const [activeCell, setActiveCell] = useState<{ day: DayOfWeek; periodId: string } | null>(null);
  const [selectedUnscheduledId, setSelectedUnscheduledId] = useState<string>('');
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [selectedSecondSubject, setSelectedSecondSubject] = useState<string>('');
  const [periodType, setPeriodType] = useState<'single'|'double'|'ps'>('single');
  const [selectedActivity, setSelectedActivity] = useState<string>('');
  const [collisionMsg, setCollisionMsg] = useState<string>('');

  const activePeriods = (timeSlots.length > 0 ? timeSlots : NAMBAWALA_SLOTS).map((slot: any) =>
    slot.id === 'act' || slot.isActivity || slot.name?.trim().toLowerCase() === 'activity'
      ? { ...slot, isActivity: true, isBreak: false }
      : slot
  ) as any;
  const configuredSchoolName = getConfiguredSchoolName(schoolName);
  const configuredDistrict = getConfiguredDistrict();
  const configuredLogo = getConfiguredLogo(schoolLogo);

  const isActivityCell = (cell: any, period: any) => Boolean(cell && (cell.isActivity || isActivitySlot(period)));

  // Auto-select first item when view type changes
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

  // Print function - English, A4 Landscape class / Portrait teacher, fonts 13px CODE, no links, double merged, no blank - V10
  const handlePrint = () => {
    try {
      const isClass = (viewType as any) === 'class' || (viewType as any) === 'all_classes';
      const targetId = selectedId;
      const targetName = isClass ? (classes.find((c:any)=>c.id===targetId)?.name || '') : (teachers.find((t:any)=>t.id===targetId)?.name || '');
      let finalName: string = targetName;
      if ((viewType as any)==='my_teaching') { try{ const cur=JSON.parse(localStorage.getItem('sms_current_user')||'null'); if(cur) finalName=cur.name; }catch{} }
      const title = finalName ? `${finalName} Teaching Timetable` : (isClass ? 'Class Teaching Timetable' : 'Teacher Teaching Timetable');
      const orientation = isClass ? 'landscape' : 'portrait';
      const logo = getConfiguredLogo(schoolLogo);
      const sName = getConfiguredSchoolName(schoolName);
      const district = getConfiguredDistrict();
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
        .subject { font-weight:800; font-size:13px; color:#0f172a; line-height:1.2; }
        .subteacher { font-weight:600; font-size:11px; color:#334155; margin-top:2px; }
        .breakCell { background:#fff7ed; color:#9a3412; font-weight:800; font-size:10px; }
        .dayCol { background:#f8fafc; font-weight:900; font-size:12px; }
        @media print { body { -webkit-print-color-adjust:exact; print-color-adjust:exact; } a { text-decoration:none !important; color:inherit !important; } }
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
      for (const day of (days as any)) {
        html += `<tr><td class="dayCol">${day}</td>`;
        let skipNextPrint = false;
        for (let pi=0; pi<activePeriods.length; pi++) {
          const p = activePeriods[pi] as any;
          if (skipNextPrint) { skipNextPrint=false; continue; }
          if (p.isBreak) {
            html += `<td class="breakCell">${p.name}<br><span style="font-size:8px; font-weight:400;">${p.startTime}-${p.endTime}</span></td>`;
            continue;
          }
          if (p.isActivity) {
            let cellAct: any = null;
            if (isClass) cellAct = (timetableData as any).schedule[targetId]?.[day]?.[p.id] || null;
            else {
              for (const cid of Object.keys((timetableData as any).schedule||{})) {
                const c = (timetableData as any).schedule[cid]?.[day]?.[p.id];
                if (c && c.isActivity) { cellAct = c; break; }
                if (c && c.teacherId===targetId) { cellAct = {...c, _className: classes.find((x:any)=>x.id===cid)?.name||cid}; break; }
              }
            }
            if (!cellAct || !isActivityCell(cellAct, p)) html += `<td></td>`;
            else html += `<td style="background:#eef2ff;"><div class="subject">${cellAct.activity || 'Activity'}</div></td>`;
            continue;
          }
          let cell: any = null;
          if (isClass) cell = (timetableData as any).schedule[targetId]?.[day]?.[p.id] || null;
          else {
            for (const cid of Object.keys((timetableData as any).schedule||{})) {
              const c = (timetableData as any).schedule[cid]?.[day]?.[p.id];
              if (c && c.teacherId===targetId) { cell = {...c, _className: classes.find((x:any)=>x.id===cid)?.name||cid}; break; }
            }
          }
          if (!cell) {
            html += `<td></td>`;
          } else {
            const isPS = cell.isPS || cell.subjectId==='ps';
            const isAct = isActivityCell(cell, p);
            let subj=''; let sub='';
            if (isPS) { subj='PS'; sub='Private Studies'; }
            else if (isAct) { subj=cell.activity || 'Activity'; sub=''; }
            else {
              const s = subjects.find((x:any)=>x.id===cell.subjectId);
              subj = getCellSubjectDisplay(cell, subjects) || (cell as any).subjectName || s?.name || cell.subjectId || '';
              const teacherLines = getCellSubjectTeacherLines(cell, subjects, teachers, isClass ? 'class' : 'teacher', classes);
              sub = teacherLines.map(line => `${line.code}: ${line.teacher}`).join('<br>');
            }
            if (cell.isDouble) {
              skipNextPrint = true;
              html += `<td colspan="2"><div class="subject">${subj}</div>${sub ? `<div class="subteacher">${sub}</div>` : ''}</td>`;
            } else {
              html += `<td><div class="subject">${subj}</div>${sub ? `<div class="subteacher">${sub}</div>` : ''}</td>`;
            }
          }
        }
        html += `</tr>`;
      }
      html += `</tbody></table>`;
      html += `</body></html>`;
      pw.document.write(html);
      pw.document.close();
      setTimeout(()=>{ pw.focus(); pw.print(); }, 400);
    } catch(e:any){ console.error(e); window.print(); }
  };

  // --------------------------------------------------------
  // Schedule Retrieval Helpers based on viewType
  // --------------------------------------------------------
  const getCellData = (day: string, periodId: string, customId = selectedId, forceType = viewType): TimetableCell | null => {
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

  const getTeacherForSubject = (subjectValue: string): string => {
    if (!subjectValue || subjectValue === 'ps') return '';
    const classId = selectedId;
    const subject = subjects.find((item: any) => item.id === subjectValue || item.name === subjectValue);
    const assignment = classSubjects.find((item: any) => item.classId === classId && (
      item.subjectId === subjectValue || item.subjectId === subject?.id || subjects.find((s: any) => s.id === item.subjectId)?.name === subjectValue
    ));
    if (assignment?.teacherId) return assignment.teacherId;
    const className = classes.find((item: any) => item.id === classId)?.name || '';
    return findTeacherForSubjectClass(subject?.name || subjectValue, className)?.id || '';
  };

  const getTeacherConflictClass = (day: string, periodId: string, teacherId: string): string => {
    if (!teacherId) return '';
    const periodIndex = activePeriods.findIndex((period: any) => period.id === periodId);
    for (const classId of Object.keys(schedule)) {
      if (classId === selectedId) continue;
      const cell: any = schedule[classId]?.[day]?.[periodId];
      if (cell && (cell.teacherId === teacherId || cell.secondTeacherId === teacherId)) {
        return classes.find((item: any) => item.id === classId)?.name || classId;
      }
      if (periodIndex > 0) {
        const previousPeriod = activePeriods[periodIndex - 1];
        const previousCell: any = schedule[classId]?.[day]?.[previousPeriod.id];
        if (previousCell?.isDouble && (previousCell.teacherId === teacherId || previousCell.secondTeacherId === teacherId)) {
          return classes.find((item: any) => item.id === classId)?.name || classId;
        }
      }
    }
    return '';
  };

  const currentConflicts = conflicts.filter(c => {
    if (!c.slot || !c.slot.day) return false;
    if (viewType === 'class' || viewType === 'all_classes') return c.entityIds.includes(selectedId);
    if (viewType === 'teacher' || viewType === 'all_teachers') return c.entityIds.includes(selectedId);
    if (viewType === 'room') return c.entityIds.includes(selectedId);
    return false;
  });

  // --------------------------------------------------------
  // Editing Logic
  // --------------------------------------------------------
  const handleCellClick = (day: DayOfWeek, periodId: string, isBreak: boolean) => {
    if (isBreak || viewType !== 'class') return; // For now, only edit from Class View for simpler UX
    setActiveCell({ day, periodId });
    setSelectedUnscheduledId('');
  };

  const handlePlaceUnscheduled = () => {
    if (!activeCell || !selectedUnscheduledId) return;
    
    const un = timetableData.unscheduled.find(u => u.id === selectedUnscheduledId);
    if (!un) return;

    // To place it, we need a room. Let's find a room of the correct type
    const sub = subjects.find(s => s.id === un.subjectId);
    const roomTypeNeeded = sub?.requiresRoomType || 'regular';
    
    // Find all rooms of this type that are NOT occupied in this slot
    const occupiedRoomIds = Object.keys(schedule).map(cid => schedule[cid]?.[activeCell.day]?.[activeCell.periodId]?.roomId).filter(Boolean);
    const availRooms = rooms.filter(r => r.type === roomTypeNeeded && !occupiedRoomIds.includes(r.id));
    
    const selectedRoomId = availRooms.length > 0 
      ? availRooms[0].id 
      : (rooms.find(r => r.type === roomTypeNeeded)?.id || rooms[0]?.id || '');

    scheduleUnscheduledLesson(selectedUnscheduledId, un.classId, activeCell.day, activeCell.periodId, selectedRoomId);
    setActiveCell(null);
  };

  const handleRemoveCell = () => {
    if (!activeCell) return;
    removeLessonSlot(selectedId, activeCell.day, activeCell.periodId);
    setActiveCell(null);
  };

  return (
    <div className="space-y-6">
      {/* View Selector & Controls (HIDES ON PRINT) */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-4 rounded-2xl shadow-sm border border-slate-100 gap-4 print:hidden">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex flex-wrap rounded-xl bg-slate-100 p-1 border border-slate-200 gap-y-1">
            {(['class', 'teacher', 'room', 'master'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setViewType(type)}
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
                onClick={() => setViewType(type)}
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
              {viewType === 'class' && classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              {viewType === 'teacher' && teachers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              {viewType === 'room' && rooms.map(r => <option key={r.id} value={r.id}>{r.name} ({r.type})</option>)}
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

      {/* Conflicts Banner (HIDES ON PRINT) */}
      {viewType !== 'master' && currentConflicts.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex items-start space-x-3 print:hidden">
          <AlertTriangle className="text-amber-500 flex-shrink-0" size={20} />
          <div>
            <h3 className="font-semibold text-amber-800 text-sm">Schedule Issues for this {viewType}</h3>
            <ul className="list-disc ml-4 text-xs text-amber-700 mt-1 space-y-0.5">
              {currentConflicts.map(c => (
                <li key={c.id}>
                  <b>{c.slot.day} {timeSlots.find(s=>s.id===c.slot.periodId)?.name}:</b> {c.description}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* TIMETABLE GRID */}
      {!['master', 'all_classes', 'all_teachers'].includes(viewType) ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden print:border-none print:shadow-none">
          {/* Header identifying the schedule (GOOD FOR PRINTING) */}
          <div className="p-4 border-b border-slate-100 hidden print:flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {configuredLogo && (
                <img src={configuredLogo} alt="Logo" className="h-12 w-auto max-h-12 object-contain" />
              )}
              <div className="text-left">
                <p className="text-xs font-bold text-slate-500">{configuredDistrict}</p>
                <h1 className="text-xl font-bold text-slate-900 leading-tight">{configuredSchoolName}</h1>
                <p className="text-slate-400 text-xs font-semibold">Weekly Timetable Schedule</p>
              </div>
            </div>
            <div className="text-right border-l border-slate-200 pl-4">
              <h2 className="text-lg font-extrabold text-indigo-700">
                {viewType === 'class' && `Class: ${classes.find(c=>c.id===selectedId)?.name}`}
                {viewType === 'teacher' && `Teacher: ${teachers.find(t=>t.id===selectedId)?.name}`}
                {viewType === 'room' && `Room: ${rooms.find(r=>r.id===selectedId)?.name}`}
              </h2>
              <p className="text-[10px] text-slate-400 font-medium">Generated by TimeTable Pro</p>
            </div>
          </div>

          <div className="overflow-x-auto print:overflow-visible">
            <table className="w-full border-collapse table-fixed min-w-[700px] print:min-w-0 print:w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold text-xs uppercase tracking-wider">
                  <th className="p-3 border-r border-slate-200 w-28 text-center bg-slate-50 sticky left-0 z-10 print:static print:z-0">Day / Time</th>
                  {activePeriods.map((p:any) => (
                    <th key={p.id} className={`p-2 border-r border-slate-100 text-center ${p.isBreak ? 'bg-amber-50 text-amber-700' : (p as any).isActivity ? 'bg-indigo-50 text-indigo-700' : ''}`}>
                      <div className="font-bold text-[11px] leading-tight">{p.name}</div>
                      <div className="text-[10px] font-normal opacity-70">{p.startTime}-{p.endTime}</div>
                    </th>
                  ))}
                </tr>
              </thead>
                            <tbody>
                {days.map((d:any) => (
                  <tr key={d} className="border-b border-slate-200">
                    <td className="p-2 border-r border-slate-200 font-black bg-slate-50 text-center text-xs sticky left-0 z-10 print:static print:z-0">{d}</td>
                    {(() => {
                      const rowCells: any[] = [];
                      let skipNext = false;
                      for (let pIdx=0; pIdx<activePeriods.length; pIdx++) {
                        const p:any = activePeriods[pIdx];
                        if (skipNext) { skipNext = false; continue; }
                        if (p.isBreak) {
                          rowCells.push(
                            <td key={p.id} className="p-2 border-r border-slate-100 text-center bg-amber-50 text-amber-700 font-bold text-xs">
                              {p.name}<br/><span className="text-[10px] font-normal">{p.startTime}-{p.endTime}</span>
                            </td>
                          );
                          continue;
                        }
                        if ((p as any).isActivity) {
                          const cellAct = getCellData(d, p.id);
                          if (!cellAct || !isActivityCell(cellAct, p)) {
                            rowCells.push(
                              <td key={p.id} onClick={() => handleCellClick(d, p.id, false)} className={`p-2 border-r border-slate-100 text-center text-xs italic align-middle ${viewType==='class'?'hover:bg-indigo-50 cursor-pointer':''}`}>
                                <span className="text-slate-300">{viewType==='class' ? '+' : '—'}</span>
                              </td>
                            );
                          } else {
                            rowCells.push(
                              <td key={p.id} onClick={() => handleCellClick(d, p.id, false)} className="p-2 border-r border-slate-100 text-center bg-indigo-50 border-indigo-200">
                                <div className="font-bold text-[11px] text-indigo-700" style={{fontFamily:'Arial, sans-serif'}}>{(cellAct as any).activity || 'Activity'}</div>
                              </td>
                            );
                          }
                          continue;
                        }
                        const cell = getCellData(d, p.id);
                        const hasConflict = currentConflicts.some((c:any) => c.slot.day === d && c.slot.periodId === p.id);
                        const selectedTeacherId = getTeacherForSubject(selectedSubject);
                        const occupiedByClass = selectedTeacherId ? getTeacherConflictClass(d, p.id, selectedTeacherId) : '';
                        if (!cell) {
                          rowCells.push(
                            <td 
                              key={p.id} 
                              onClick={() => { if (!occupiedByClass) handleCellClick(d, p.id, false); }}
                              title={occupiedByClass ? `Teacher is teaching ${occupiedByClass} at this time` : undefined}
                              className={`p-2 border-r border-slate-100 text-center text-xs text-slate-300 italic align-middle group ${occupiedByClass ? 'bg-rose-100 border-rose-300 cursor-not-allowed' : viewType === 'class' ? 'hover:bg-indigo-50/40 cursor-pointer' : ''}`}
                            >
                              <span className={occupiedByClass ? 'font-semibold text-rose-700 text-[10px] flex items-center justify-center' : 'opacity-0 group-hover:opacity-100 font-semibold text-indigo-500 text-xs flex items-center justify-center'}>
                                {occupiedByClass ? `Occupied: ${occupiedByClass}` : <>{viewType === 'class' ? <Plus size={12} className="mr-0.5" /> : ''}{viewType === 'class' ? 'Place Lesson' : 'Free'}</>}
                              </span>
                            </td>
                          );
                        } else {
                          const sub = subjects.find((s:any) => s.id === cell.subjectId);
                          const isPS = (cell as any).isPS || cell.subjectId==='ps';
                          const isAct = isActivityCell(cell, p);
                          const displaySubRaw = isAct ? (cell as any).activity || 'Activity' : getCellSubjectDisplay(cell, subjects) || (cell as any).subjectName || sub?.name || (cell.subjectId==='ps' ? 'PS' : 'SUB');
                          let displaySub = displaySubRaw;
                          try { const m=JSON.parse(localStorage.getItem('sms_subject_codes')||'{}'); if(displaySubRaw && m[displaySubRaw]) displaySub=m[displaySubRaw]; else if(sub && m[sub.name]) displaySub=m[sub.name]; } catch{}
                          if (!isPS && !isAct && displaySubRaw && displaySub===displaySubRaw) { try{ displaySub=displaySubRaw.substring(0,4).toUpperCase(); }catch{} }
                          const tchr = teachers.find((teach:any) => teach.id === cell.teacherId);
                          const subjectTeacherLines = getCellSubjectTeacherLines(cell, subjects, teachers, viewType, classes);
                          const isDouble = (cell as any).isDouble;
                          if (isDouble) {
                            skipNext = true;
                            rowCells.push(
                              <td 
                                key={p.id} 
                                colSpan={2}
                                onClick={() => handleCellClick(d, p.id, false)}
                                className={`p-2 border-r border-slate-100 align-middle text-center relative group ${viewType === 'class' ? 'cursor-pointer' : ''}`}
                              >
                                <div className={`w-full h-full p-2 rounded-xl border flex flex-col justify-center ${sub?.color || 'bg-emerald-50 border-emerald-300'} ${hasConflict ? 'ring-2 ring-red-500 animate-pulse' : 'shadow-sm'}`}>
                                  {isPS || isAct ? <div className="font-bold text-slate-900 text-[13px] leading-tight">{displaySub}</div> : subjectTeacherLines.map((line:any) => (
                                    <div key={line.code} className="leading-tight mb-0.5">
                                      <div className="font-bold text-slate-900 text-[13px]" style={{fontFamily:'Arial, sans-serif'}}>{line.code}</div>
                                      <div className="font-semibold text-slate-700 text-[10px] truncate" style={{fontFamily:'Arial, sans-serif'}}>{line.teacher}</div>
                                    </div>
                                  ))}
                                </div>
                              </td>
                            );
                          } else {
                            rowCells.push(
                              <td 
                                key={p.id} 
                                onClick={() => handleCellClick(d, p.id, false)}
                                className={`p-2 border-r border-slate-100 align-middle text-center relative group ${viewType === 'class' ? 'cursor-pointer' : ''}`}
                              >
                                <div className={`w-full h-full p-2 rounded-xl border flex flex-col justify-center ${sub?.color || (isPS ? 'bg-slate-100 border-slate-300' : isAct ? 'bg-indigo-50 border-indigo-200' : 'bg-white border-slate-200')} ${hasConflict ? 'ring-2 ring-red-500 animate-pulse' : 'shadow-sm'}`}>
                                  {isPS || isAct ? <div className="font-bold text-slate-900 text-[13px] leading-tight">{isPS ? 'PS' : displaySub}</div> : subjectTeacherLines.map((line:any) => (
                                    <div key={line.code} className="leading-tight mb-0.5">
                                      <div className="font-bold text-slate-900 text-[13px]" style={{fontFamily:'Arial, sans-serif'}}>{line.code}</div>
                                      <div className="font-semibold text-slate-700 text-[10px] truncate" style={{fontFamily:'Arial, sans-serif'}}>{line.teacher}</div>
                                    </div>
                                  ))}
                                  {hasConflict && (
                                    <div className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 shadow-md">
                                      <AlertTriangle size={10} />
                                    </div>
                                  )}
                                </div>
                              </td>
                            );
                          }
                        }
                      }
                      return rowCells;
                    })()}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : viewType === 'master' || viewType === 'all_classes' ? (
        /* BATCH CLASSES / MASTER VIEW GRID */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6 print:p-0 print:border-none print:shadow-none">
          <h2 className="text-lg font-bold text-slate-800 mb-4 print:hidden">
            {viewType === 'master' ? 'General School Timetable' : 'Print All Class Timetables'}
          </h2>
          <div className="space-y-8 print:space-y-12">
            {classes.map((cls) => {
              const clsSubs = classSubjects.filter(cs => cs.classId === cls.id);
              const totalP = clsSubs.reduce((acc, s) => acc + s.periodsPerWeek, 0);
              
              return (
                <div key={cls.id} className="break-after-page print:break-after-page border border-slate-200 rounded-xl p-4 bg-white print:border-slate-300 print:p-6 print:mb-8">
                  {/* Print-only School Header */}
                  <div className="p-3 border-b border-slate-200 hidden print:flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      {configuredLogo && <img src={configuredLogo} alt="Logo" className="h-10 w-auto object-contain" />}
                      <div className="text-left">
                        <p className="text-[9px] font-bold text-slate-500">{configuredDistrict}</p>
                        <h1 className="text-lg font-bold text-slate-900 leading-tight">{configuredSchoolName}</h1>
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
                          {days.map(d => <th key={d} className="p-1.5 border-r border-slate-200 text-center">{d.substring(0,3)}</th>)}
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
                          if (isActivitySlot(p)) {
                            return (
                              <tr key={p.id} className="bg-indigo-50/60 border-b border-indigo-200 text-indigo-700 text-3xs">
                                <td className="p-1 font-bold text-center border-r bg-indigo-50 whitespace-nowrap">Activity ({p.startTime})</td>
                                <td colSpan={days.length} className="p-1 text-center font-bold text-[10px] uppercase tracking-wider bg-indigo-50/30">
                                  {days.map((d:any) => {
                                    const activity = schedule[cls.id]?.[d]?.[p.id];
                                    return <span key={d} className="inline-block mx-1">{activity?.activity || 'Activity'}</span>;
                                  })}
                                </td>
                              </tr>
                            );
                          }
                          return (
                            <tr key={p.id} className="border-b border-slate-100">
                              <td className="p-1 font-bold text-center border-r bg-slate-50 text-slate-400 text-3xs whitespace-nowrap">{p.name.split(' ')[1] || p.name} ({p.startTime})</td>
                              {days.map(d => {
                                const cell = schedule[cls.id]?.[d]?.[p.id];
                                if (!cell) return <td key={d} className="p-1 border-r border-slate-100 bg-slate-50"></td>;
                                const sub = subjects.find(s => s.id === cell.subjectId);
                                const displaySubject = getCellSubjectDisplay(cell, subjects);
                                const subjectTeacherLines = getCellSubjectTeacherLines(cell, subjects, teachers, 'class', classes);
                                return (
                                  <td key={d} className={`p-1 border-r border-slate-100 font-medium ${sub?.color.split(' ')[0] || 'bg-slate-100'}`}>
                                    {subjectTeacherLines.map((line:any) => (
                                      <div key={line.code} className="leading-tight mb-0.5">
                                        <div className="font-bold text-slate-800">{line.code}</div>
                                        <div className="text-[10px] text-slate-500 truncate">{line.teacher}</div>
                                      </div>
                                    ))}
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
              );
            })}
          </div>
        </div>
      ) : (
        /* BATCH TEACHERS VIEW GRID */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6 print:p-0 print:border-none print:shadow-none">
          <h2 className="text-lg font-bold text-slate-800 mb-4 print:hidden">Print All Teacher Timetables</h2>
          <div className="space-y-8 print:space-y-12">
            {teachers.map((t) => {
              const tSubs = classSubjects.filter(cs => cs.teacherId === t.id);
              return (
                <div key={t.id} className="break-after-page print:break-after-page border border-slate-200 rounded-xl p-4 bg-white print:border-slate-300 print:p-6 print:mb-8">
                  {/* Print-only School Header */}
                  <div className="p-3 border-b border-slate-200 hidden print:flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      {configuredLogo && <img src={configuredLogo} alt="Logo" className="h-10 w-auto object-contain" />}
                      <div className="text-left">
                        <p className="text-[9px] font-bold text-slate-500">{configuredDistrict}</p>
                        <h1 className="text-lg font-bold text-slate-900 leading-tight">{configuredSchoolName}</h1>
                        <p className="text-slate-400 text-2xs font-semibold">Official Faculty Schedule</p>
                      </div>
                    </div>
                    <div className="text-right border-l border-slate-200 pl-3">
                      <h2 className="text-base font-extrabold text-indigo-700">Teacher: {t.name}</h2>
                      <p className="text-[9px] text-slate-400 font-medium">Generated by TimeTable Pro</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-3 print:hidden">
                    <h3 className="text-base font-bold text-slate-800">{t.name} — Weekly Schedule</h3>
                    <div className="text-xs text-slate-400 font-medium">{tSubs.length} Active Courses</div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse table-fixed text-xs border border-slate-200">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                          <th className="p-1.5 border-r border-slate-200 w-20 text-center">Slot</th>
                          {days.map(d => <th key={d} className="p-1.5 border-r border-slate-200 text-center">{d.substring(0,3)}</th>)}
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
                          if (isActivitySlot(p)) {
                            return (
                              <tr key={p.id} className="bg-indigo-50/60 border-b border-indigo-200 text-indigo-700 text-3xs">
                                <td className="p-1 font-bold text-center border-r bg-indigo-50 whitespace-nowrap">Activity ({p.startTime})</td>
                                <td colSpan={days.length} className="p-1 text-center font-bold text-[10px] uppercase tracking-wider bg-indigo-50/30">
                                  Activity
                                </td>
                              </tr>
                            );
                          }
                          return (
                            <tr key={p.id} className="border-b border-slate-100">
                              <td className="p-1 font-bold text-center border-r bg-slate-50 text-slate-400 text-3xs whitespace-nowrap">{p.name.split(' ')[1] || p.name} ({p.startTime})</td>
                              {days.map(d => {
                                const cell = getCellData(d, p.id, t.id, 'all_teachers');
                                if (!cell) return <td key={d} className="p-1 border-r border-slate-100 bg-slate-50"></td>;
                                const sub = subjects.find(s => s.id === cell.subjectId);
                                const cls = classes.find(c => c.id === cell.classId);
                                const displaySubject = getCellSubjectDisplay(cell, subjects);
                                const subjectTeacherLines = getCellSubjectTeacherLines(cell, subjects, teachers, 'teacher', classes);
                                return (
                                  <td key={d} className={`p-1 border-r border-slate-100 font-medium ${sub?.color.split(' ')[0] || 'bg-slate-100'}`}>
                                    {subjectTeacherLines.map((line:any) => (
                                      <div key={line.code} className="leading-tight mb-0.5">
                                        <div className="font-bold text-slate-800">{line.code}</div>
                                        <div className="text-[10px] text-slate-500 truncate">{line.teacher}</div>
                                      </div>
                                    ))}
                                    <div className="text-[10px] text-slate-500 truncate">{cls?.name || 'Class'}</div>
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
              );
            })}
          </div>
        </div>
      )}

      {/* CELL EDIT MODAL - Nambawala Spec: Select Subject/Add Subject + Single/Double/PS + Activity 5 */}
      {activeCell && (() => {
        const slot: any = activePeriods.find((s:any)=>s.id===activeCell.periodId);
        const isActSlot = slot?.isActivity;
        const existing = getCellData(activeCell.day, activeCell.periodId);
        const isActivitySlot = isActSlot;
        const subjectOptions: string[] = (() => {
          try { const fromAdmin = JSON.parse(localStorage.getItem('sms_school_subjects')||'[]'); if (fromAdmin.length) return fromAdmin; } catch {}
          return subjects.map((s:any)=>s.name);
        })();
        return (
        <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4 print:hidden">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 border border-slate-100 animate-fadeIn space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-lg text-slate-800">Edit Schedule Slot</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Class: <b>{classes.find((c:any)=>c.id===selectedId)?.name}</b> • Slot: <b>{activeCell.day}, {activePeriods.find((p:any)=>p.id===activeCell.periodId)?.name}</b> <span className="text-[10px]">({activePeriods.find((p:any)=>p.id===activeCell.periodId)?.startTime}-{(activePeriods.find((p:any)=>p.id===activeCell.periodId) as any)?.endTime})</span>
                </p>
              </div>
              <button onClick={() => setActiveCell(null)} className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg">
                <X size={18} />
              </button>
            </div>

            {existing ? (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div className="text-xs">
                  <div className="font-bold text-slate-800">{existing.isActivity ? (existing as any).activity : (existing.subjectId==='ps' ? 'PS - Private Studies' : (subjects.find((s:any)=>s.id===existing.subjectId)?.name || existing.subjectId))} {(existing as any).isDouble ? '(Double 80min)' : (existing as any).isPS ? '(PS)' : ''}</div>
                  {!existing.isActivity && !(existing as any).isPS && <div className="text-slate-500">Teacher: {teachers.find((t:any)=>t.id===existing.teacherId)?.name || ''}</div>}
                </div>
                <button onClick={() => { try{ handleRemoveCell(); }catch(e:any){ setCollisionMsg(String(e)); } }} className="p-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 border border-red-200 flex flex-col items-center font-bold text-xs"><Trash2 size={14} /><span>Remove</span></button>
              </div>
            ) : (
              <div className="p-3 bg-slate-50 rounded-xl border border-dashed border-slate-300 text-center text-xs text-slate-500">
                This slot is currently empty. Choose options below to fill it.
              </div>
            )}

            {isActivitySlot ? (
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-slate-700">Select Activity (15:30-17:30)</label>
                  <select value={selectedActivity} onChange={e=>setSelectedActivity(e.target.value)} className="w-full mt-1 border px-3 py-2.5 rounded-xl text-sm bg-white">
                    <option value="">-- Select activity --</option>
                    {ACTIVITY_OPTIONS.map((a:any)=> <option key={a} value={a}>{a}</option>)}
                  </select>
                  <p className="text-[10px] text-slate-500 mt-1">General Cleanliness, Debate, Self Reliance, Subject Clubs, Sports and Games</p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-slate-700">Select Subject</label>
                  <select value={selectedSubject} onChange={e=>setSelectedSubject(e.target.value)} className="w-full mt-1 border px-3 py-2.5 rounded-xl text-sm bg-white">
                    <option value="">-- Select subject --</option>
                    {subjectOptions.map((name:string)=> <option key={name} value={name}>{name} ({getSubjectCodeTT(name)})</option>)}
                    <option value="ps">PS - Private Studies (no teacher)</option>
                  </select>
                  {selectedSubject && (()=> {
                    const found = findTeacherForSubjectClass(selectedSubject, classes.find((c:any)=>c.id===selectedId)?.name || '');
                    return found ? <p className="text-xs text-emerald-600 mt-1">Teacher: <b>{found.name}</b> (Teaching Assignments)</p> : <p className="text-xs text-amber-600 mt-1">No teacher assigned to teach {selectedSubject} in this class. Go to Assign Teaching Classes & Subjects.</p>;
                  })()}
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700">Add Subject (Second Subject in Same Cell)</label>
                  <select value={selectedSecondSubject} onChange={e=>setSelectedSecondSubject(e.target.value)} className="w-full mt-1 border px-3 py-2.5 rounded-xl text-sm bg-white">
                    <option value="">None (single subject)</option>
                    {subjectOptions.map((name:string)=> <option key={name+'-2'} value={name}>{name} ({getSubjectCodeTT(name)})</option>)}
                    <option value="ps">PS - Private Studies</option>
                  </select>
                  <p className="text-[10px] text-slate-500 mt-1">Example: Select MATH above + HIST here = cell shows <b>MATH/HIST</b> (two subjects in one period). Leave as None for single subject.</p>
                  <div className="mt-2 flex gap-2">
                    <button onClick={()=>{
                      const name = prompt('Or create NEW subject (name):');
                      if (!name || !name.trim()) return;
                      const code = prompt('Subject code (e.g., AGRI, 2-6 letters):', name.trim().substring(0,4).toUpperCase());
                      if (!code || !code.trim()) return;
                      const c = code.trim().toUpperCase().replace(/\s+/g,'');
                      if (c.length<2||c.length>6) { alert('Code must be 2-6 letters'); return; }
                      try {
                        const subs = JSON.parse(localStorage.getItem('sms_school_subjects')||'[]');
                        if (subs.includes(name.trim())) { alert('Subject already exists'); return; }
                        const codes = JSON.parse(localStorage.getItem('sms_subject_codes')||'{}');
                        if (Object.values(codes).includes(c)) { alert('Code already exists'); return; }
                        const nextSubs = [...subs, name.trim()].sort();
                        localStorage.setItem('sms_school_subjects', JSON.stringify(nextSubs));
                        const nextCodes = {...codes, [name.trim()]: c};
                        localStorage.setItem('sms_subject_codes', JSON.stringify(nextCodes));
                        // Also set as second subject if first already chosen
                        if (selectedSubject && !selectedSecondSubject) setSelectedSecondSubject(name.trim());
                        else setSelectedSubject(name.trim());
                        alert('Subject added: '+name.trim()+' ('+c+')');
                      } catch(e:any){ alert('Failed: '+String(e)); }
                    }} className="flex-1 py-1.5 rounded-xl border border-dashed border-indigo-200 text-indigo-600 font-bold text-[11px] hover:bg-indigo-50">+ Create New Subject (Name + CODE)</button>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700">Choose Period Type</label>
                  <div className="flex gap-2 mt-1">
                    <button onClick={()=>setPeriodType('single')} className={`flex-1 py-2 rounded-xl text-xs font-bold border ${periodType==='single'?'bg-indigo-600 text-white border-indigo-600':'bg-white'}`}>Single (40 min)</button>
                    <button onClick={()=>setPeriodType('double')} className={`flex-1 py-2 rounded-xl text-xs font-bold border ${periodType==='double'?'bg-emerald-600 text-white border-emerald-600':'bg-white'}`}>Double (80 min)</button>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">Double merges 2 periods (80 min). PS can be Single or Double — no teacher will be assigned.</p>
                </div>
              </div>
            )}

            {collisionMsg && <div className="p-2 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-semibold">{collisionMsg}</div>}

            <div className="flex gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => {
                  try {
                    const slot: any = activePeriods.find((s:any)=>s.id===activeCell.periodId);
                    const isAct = slot?.isActivity;
                    if (isAct) {
                      if (!selectedActivity) { setCollisionMsg('Select an activity'); return; }
                      // FIX: activity must be visible - store correctly and force refresh
                      const cell: any = { subjectId: 'activity', teacherId: '', roomId: '', isActivity: true, activity: selectedActivity, isDouble: false, isPS: false, subjectName: selectedActivity };
                      // Use direct localStorage mutation with refresh
                      try {
                        const rawAct = localStorage.getItem('tt_timetableData');
                        if (rawAct) {
                          const dataAct = JSON.parse(rawAct);
                          if (!dataAct.schedule[selectedId]) dataAct.schedule[selectedId] = {};
                          if (!dataAct.schedule[selectedId][activeCell.day]) dataAct.schedule[selectedId][activeCell.day] = {};
                          dataAct.schedule[selectedId][activeCell.day][activeCell.periodId] = cell;
                          localStorage.setItem('tt_timetableData', JSON.stringify(dataAct));
                          localStorage.setItem('tt_timetableData_ts', String(Date.now()));
                          // Also try context update for in-memory
                          try { (updateLessonSlot as any)(selectedId, activeCell.day, activeCell.periodId, 'activity', '', '', cell); } catch {}
                          // Patch the in-memory too if activity
                          setTimeout(()=>{
                            try {
                              const raw2 = localStorage.getItem('tt_timetableData');
                              if (raw2) {
                                const d2 = JSON.parse(raw2);
                                if (d2?.schedule?.[selectedId]?.[activeCell.day]?.[activeCell.periodId]) {
                                  d2.schedule[selectedId][activeCell.day][activeCell.periodId].activity = selectedActivity;
                                  d2.schedule[selectedId][activeCell.day][activeCell.periodId].isActivity = true;
                                  d2.schedule[selectedId][activeCell.day][activeCell.periodId].subjectName = selectedActivity;
                                  localStorage.setItem('tt_timetableData', JSON.stringify(d2));
                                }
                              }
                            } catch {}
                            setRefreshKey((k:number)=>k+1);
                          }, 150);
                        } else {
                          (updateLessonSlot as any)(selectedId, activeCell.day, activeCell.periodId, 'activity', '', '', cell);
                        }
                      } catch(e:any){ setCollisionMsg('Activity save failed: '+String(e)); return; }
                      setActiveCell(null);
                      setCollisionMsg('');
                      setRefreshKey((k:number)=>k+1);
                      return;
                    }
                    // Determine if PS selected as subject (can be single or double)
                    const isPS_selected = selectedSubject==='ps' || selectedSubject==='PS - Private Studies' || selectedSubject?.toLowerCase().startsWith('ps');
                    if (isPS_selected) {
                      const cell: any = { subjectId: 'ps', subjectName: 'PS', teacherId: '', isPS: true, isDouble: false };
                      const raw = localStorage.getItem('tt_timetableData');
                      if (raw) {
                        const data = JSON.parse(raw);
                        if (!data.schedule[selectedId]) data.schedule[selectedId] = {};
                        if (!data.schedule[selectedId][activeCell.day]) data.schedule[selectedId][activeCell.day] = {};
                        data.schedule[selectedId][activeCell.day][activeCell.periodId] = cell;
                        localStorage.setItem('tt_timetableData', JSON.stringify(data));
                        localStorage.setItem('tt_timetableData_ts', String(Date.now()));
                      } else {
                        (updateLessonSlot as any)(selectedId, activeCell.day, activeCell.periodId, 'ps', '', '', cell);
                      }
                      setActiveCell(null);
                      setCollisionMsg('');
                      return;
                    }
                    if (!selectedSubject || selectedSubject==='ps') { setCollisionMsg('Select a subject (PS handled separately)'); return; }
                    // Handle combined subjects: e.g., MATH/HIST
                    let subjId = selectedSubject;
                    let subjName = selectedSubject;
                    const foundSub = subjects.find((s:any)=> s.id===selectedSubject || s.name===selectedSubject);
                    if (foundSub) { subjId = foundSub.id; subjName = foundSub.name; }
                    // Second subject optional
                    let secondSubjId: string | null = null;
                    let secondSubjName: string | null = null;
                    let secondTeacherId: string | null = null;
                    let secondTeacherName = '';
                    if (selectedSecondSubject && selectedSecondSubject !== '' && selectedSecondSubject !== 'none') {
                      secondSubjName = selectedSecondSubject;
                      secondSubjId = selectedSecondSubject;
                      const foundSub2 = subjects.find((s:any)=> s.id===selectedSecondSubject || s.name===selectedSecondSubject);
                      if (foundSub2) { secondSubjId = foundSub2.id; secondSubjName = foundSub2.name; }
                      else if (selectedSecondSubject==='ps') { secondSubjId='ps'; secondSubjName='PS'; }
                      // Find teacher for second subject
                      try {
                        const cs2 = classSubjects.find((c:any)=> c.classId===selectedId && (c.subjectId===secondSubjId || subjects.find((s:any)=>s.id===c.subjectId)?.name===secondSubjName));
                        if (cs2) secondTeacherId = cs2.teacherId;
                      } catch {}
                      if (!secondTeacherId && secondSubjName) {
                        const res2 = findTeacherForSubjectClass(secondSubjName!, classes.find((c:any)=>c.id===selectedId)?.name || '');
                        if (res2) { secondTeacherId = res2.id; secondTeacherName = res2.name; }
                      }
                      if (!secondTeacherId && secondSubjId) {
                        const t2 = teachers.find((x:any)=> x.qualifiedSubjects?.includes(secondSubjId!));
                        if (t2) secondTeacherId = t2.id;
                      }
                      if (secondSubjName && secondSubjName!=='PS' && !secondTeacherId) {
                        setCollisionMsg('No teacher for second subject ' + secondSubjName + ' in ' + (classes.find((c:any)=>c.id===selectedId)?.name || selectedId) + '.');
                        return;
                      }
                    }
                    let teacherId = '';
                    let teacherName = '';
                    try {
                      const cs = classSubjects.find((c:any)=> c.classId===selectedId && (c.subjectId===subjId || subjects.find((s:any)=>s.id===c.subjectId)?.name===subjName));
                      if (cs) teacherId = cs.teacherId;
                    } catch {}
                    if (!teacherId) {
                      const res = findTeacherForSubjectClass(subjName, classes.find((c:any)=>c.id===selectedId)?.name || '');
                      if (res) { teacherId = res.id; teacherName = res.name; }
                    }
                    if (!teacherId) {
                      const t = teachers.find((x:any)=> x.qualifiedSubjects?.includes(subjId));
                      if (t) teacherId = t.id;
                    }
                    if (!teacherId) {
                      setCollisionMsg('No teacher assigned to teach ' + subjName + ' in ' + (classes.find((c:any)=>c.id===selectedId)?.name || selectedId) + '. Go to Assign Teaching Classes & Subjects first.');
                      return;
                    }
                    const teachingIds = activePeriods.filter((s:any)=>!s.isBreak && !(s as any).isActivity).map((s:any)=>s.id);
                    const activeIndex = teachingIds.indexOf(activeCell.periodId);
                    const nextId = teachingIds[activeIndex + 1];
                    if (periodType==='double') {
                      if (!nextId) { setCollisionMsg('Double cannot be last period. Choose Single.'); return; }
                      const existingNext = (timetableData as any).schedule[selectedId]?.[activeCell.day]?.[nextId];
                      if (existingNext) { setCollisionMsg('Next period already has a lesson. Remove it first.'); return; }
                    }
                    const targetPeriodIds = periodType === 'double' ? [activeCell.periodId, nextId] : [activeCell.periodId];
                    const teacherMatches = (cell: any, id: string) => Boolean(cell && (cell.teacherId === id || cell.secondTeacherId === id));
                    const getOccupiedCell = (classId: string, periodId: string) => {
                      const classSchedule = (timetableData as any).schedule[classId]?.[activeCell.day] || {};
                      const directCell = classSchedule[periodId];
                      if (directCell) return directCell;
                      const periodIndex = teachingIds.indexOf(periodId);
                      if (periodIndex > 0) {
                        const previousCell = classSchedule[teachingIds[periodIndex - 1]];
                        if (previousCell?.isDouble) return previousCell;
                      }
                      return null;
                    };
                    for (const cid of Object.keys(((timetableData as any)?.schedule||{}))) {
                      if (cid === selectedId) continue;
                      for (const periodId of targetPeriodIds) {
                        const cell = getOccupiedCell(cid, periodId);
                        const matchedTeacher = teacherMatches(cell, teacherId) ? teacherId : (secondTeacherId && teacherMatches(cell, secondTeacherId) ? secondTeacherId : '');
                        if (matchedTeacher) {
                          const clsName = classes.find((c:any)=>c.id===cid)?.name || cid;
                          const teacherName = teachers.find((t:any)=>t.id===matchedTeacher)?.name || matchedTeacher;
                          setCollisionMsg('Teacher ' + teacherName + ' is already assigned to ' + clsName + ' on ' + activeCell.day + ' ' + periodId + '.');
                          return;
                        }
                      }
                    }
                    const subForRoom = subjects.find((s:any)=>s.id===subjId);
                    const roomType = (subForRoom as any)?.requiresRoomType || 'regular';
                    const schoolClass = classes.find((c:any)=>c.id===selectedId);
                    let roomId = '';
                    if (roomType === 'regular' && (schoolClass as any)?.assignedRoomId) {
                      const occupied = targetPeriodIds.some(periodId => Object.keys((timetableData as any).schedule||{}).some(cid => getOccupiedCell(cid, periodId)?.roomId === (schoolClass as any).assignedRoomId));
                      if (!occupied) roomId = (schoolClass as any).assignedRoomId;
                    }
                    if (!roomId) {
                      const avail = rooms.filter((r:any)=> r.type===roomType && !targetPeriodIds.some(periodId => Object.keys((timetableData as any).schedule||{}).some(cid => getOccupiedCell(cid, periodId)?.roomId === r.id)));
                      roomId = avail[0]?.id || rooms.find((r:any)=>r.type===roomType)?.id || rooms[0]?.id || '';
                    }
                    // If combined, store second subject info too
                    const isCombined = !!(secondSubjId && secondSubjName);
                    const cellToSave: any = { subjectId: subjId, subjectName: subjName, teacherId, roomId, classId: selectedId, isCombined, secondSubjectId: secondSubjId || undefined, secondSubjectName: secondSubjName || undefined, secondTeacherId: secondTeacherId || undefined, isDouble: periodType==='double', isPS: false, isActivity: false };
                    // Try context update first, then patch localStorage for combined
                    (updateLessonSlot as any)(selectedId, activeCell.day, activeCell.periodId, subjId, teacherId, roomId, cellToSave);
                    setTimeout(()=>{
                      try {
                        const raw = localStorage.getItem('tt_timetableData');
                        if (raw) {
                          const data = JSON.parse(raw);
                          const cell = data?.schedule?.[selectedId]?.[activeCell.day]?.[activeCell.periodId];
                          if (cell) {
                            cell.subjectName = subjName;
                            cell.isCombined = isCombined;
                            if (isCombined) {
                              cell.secondSubjectName = secondSubjName;
                              cell.secondSubjectId = secondSubjId;
                              cell.secondTeacherId = secondTeacherId;
                            }
                            cell.isDouble = periodType==='double';
                            cell.isPS = false;
                            cell.isActivity = false;
                            if (periodType==='double') {
                              const teachingIds = activePeriods.filter((s:any)=>!s.isBreak && !(s as any).isActivity).map((s:any)=>s.id);
                              const idx = teachingIds.indexOf(activeCell.periodId);
                              const nextId = teachingIds[idx+1];
                              if (nextId) {
                                if (!data.schedule[selectedId][activeCell.day][nextId]) {
                                  data.schedule[selectedId][activeCell.day][nextId] = { subjectId: subjId, subjectName: subjName, teacherId, roomId, classId: selectedId, isDouble: true, isDoubleSpan: true, isCombined, secondSubjectName, secondSubjectId, secondTeacherId };
                                } else {
                                  // If next exists, still mark as double span for combined
                                  data.schedule[selectedId][activeCell.day][nextId].isDoubleSpan = true;
                                }
                              }
                            }
                            localStorage.setItem('tt_timetableData', JSON.stringify(data));
                            localStorage.setItem('tt_timetableData_ts', String(Date.now()));
                            setRefreshKey((k:number)=>k+1);
                          }
                        }
                      } catch {}
                    }, 150);
                    setActiveCell(null);
                    setCollisionMsg('');
                  } catch(e:any){ setCollisionMsg('Save failed: '+(e?.message||String(e))); }
                }}
                className="flex-1 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-sm"
              >
                Save
              </button>
              <button
                onClick={() => {
                  try { (removeLessonSlot as any)(selectedId, activeCell.day, activeCell.periodId); } catch(e:any){ setCollisionMsg(String(e)); return; }
                  setActiveCell(null);
                }}
                className="flex-1 py-2.5 bg-white border text-slate-700 rounded-xl font-bold text-sm"
              >
                Remove
              </button>
              <button onClick={()=>setActiveCell(null)} className="px-4 py-2.5 bg-slate-100 rounded-xl font-bold text-sm">Close</button>
            </div>
            <p className="text-[10px] text-slate-400 text-center">Collision prevents double-booking. Double merges 2 periods (80 min). PS has no teacher.</p>
          </div>
        </div>
      )})()}
    </div>
  );
};
