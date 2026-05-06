import React, { useState } from 'react';
import { useTimetable } from '../context/TimetableContext';
import { DayOfWeek, TimetableCell } from '../types';
import { 
  Printer, Grid, 
  AlertTriangle, X, Trash2, Plus 
} from 'lucide-react';

export const TimetableViewer: React.FC = () => {
  const { 
    timetableData, classes, teachers, subjects, rooms, timeSlots, days, conflicts, classSubjects,
    schoolLogo, schoolName,
    removeLessonSlot, scheduleUnscheduledLesson 
  } = useTimetable();

  const [viewType, setViewType] = useState<'class' | 'teacher' | 'room' | 'master' | 'all_classes' | 'all_teachers'>('class');
  const [selectedId, setSelectedId] = useState<string>('');
  
  // Cell click editing state
  const [activeCell, setActiveCell] = useState<{ day: DayOfWeek; periodId: string } | null>(null);
  const [selectedUnscheduledId, setSelectedUnscheduledId] = useState<string>('');

  const activePeriods = timeSlots; // Show breaks too!

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

  // Print function
  const handlePrint = () => {
    window.print();
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
                  <th className="p-3 border-r border-slate-200 w-32 text-center bg-slate-50 sticky left-0 z-10 print:static print:z-0 print:w-28">Time Slot</th>
                  {days.map(d => (
                    <th key={d} className="p-3 border-r border-slate-100 text-center">{d}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {activePeriods.map((p) => {
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
                      {/* Period Header */}
                      <td className="p-2 border-r border-slate-200 font-bold bg-slate-50 text-slate-700 text-center text-xs sticky left-0 z-10 print:static print:z-0">
                        <div className="text-slate-900">{p.name}</div>
                        <div className="text-[10px] font-medium text-slate-400 mt-1 bg-white border rounded px-1.5 py-0.5 inline-block">
                          {p.startTime} - {p.endTime}
                        </div>
                      </td>

                      {/* Day cells */}
                      {days.map((d) => {
                        const cell = getCellData(d, p.id);
                        const hasConflict = currentConflicts.some(c => c.slot.day === d && c.slot.periodId === p.id);
                        
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

                        const sub = subjects.find(s => s.id === cell.subjectId);
                        const t = teachers.find(teach => teach.id === cell.teacherId);
                        const r = rooms.find(room => room.id === cell.roomId);

                        return (
                          <td 
                            key={d} 
                            onClick={() => handleCellClick(d, p.id, p.isBreak)}
                            className={`p-2 border-r border-slate-100 align-middle transition-all text-center relative group ${
                              viewType === 'class' ? 'cursor-pointer' : ''
                            }`}
                          >
                            <div className={`w-full h-full p-2 rounded-xl border flex flex-col justify-center transition-all ${sub?.color || 'bg-slate-100'} ${
                              hasConflict ? 'ring-2 ring-red-500 border-transparent shadow-red-100 animate-pulse' : 'shadow-sm'
                            }`}>
                              <div className="font-bold text-slate-800 text-sm leading-tight font-mono">{sub?.code || 'SUB'}</div>
                              <div className="font-semibold text-slate-900 text-2xs mt-0.5 truncate">{sub?.name}</div>
                              
                              <div className="border-t border-slate-400/20 mt-1.5 pt-1 flex flex-col items-center space-y-0.5 text-3xs font-bold text-slate-600/90 uppercase tracking-tight">
                                {viewType !== 'teacher' && (
                                  <div className="truncate w-full max-w-[120px] text-center">👨‍🏫 {t?.name.split(' ').slice(-1)[0] || 'Teacher'}</div>
                                )}
                                {viewType === 'teacher' && (
                                  <div className="truncate w-full max-w-[120px] text-center text-slate-800 font-black">🏫 {classes.find(c=>c.id===cell.classId)?.name}</div>
                                )}
                                {viewType !== 'room' && (
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
                          {days.map(d => <th key={d} className="p-1.5 border-r border-slate-200 text-center">{d.substring(0,3)}</th>)}
                        </tr>
                      </thead>
                      <tbody>
                        {timeSlots.map(p => {
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
                              {days.map(d => {
                                const cell = schedule[cls.id]?.[d]?.[p.id];
                                if (!cell) return <td key={d} className="p-1 border-r border-slate-100 bg-slate-50"></td>;
                                const sub = subjects.find(s => s.id === cell.subjectId);
                                const t = teachers.find(teach => teach.id === cell.teacherId);
                                return (
                                  <td key={d} className={`p-1 border-r border-slate-100 font-medium ${sub?.color.split(' ')[0] || 'bg-slate-100'}`}>
                                    <div className="font-bold text-slate-800">{sub?.code}</div>
                                    <div className="text-[10px] text-slate-500 truncate">{t?.name.split(' ').slice(-1)[0]}</div>
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
                      {schoolLogo && <img src={schoolLogo} alt="Logo" className="h-10 w-auto object-contain" />}
                      <div className="text-left">
                        <h1 className="text-lg font-bold text-slate-900 leading-tight">{schoolName}</h1>
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
                        {timeSlots.map(p => {
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
                              {days.map(d => {
                                const cell = getCellData(d, p.id, t.id, 'all_teachers');
                                if (!cell) return <td key={d} className="p-1 border-r border-slate-100 bg-slate-50"></td>;
                                const sub = subjects.find(s => s.id === cell.subjectId);
                                const cls = classes.find(c => c.id === cell.classId);
                                return (
                                  <td key={d} className={`p-1 border-r border-slate-100 font-medium ${sub?.color.split(' ')[0] || 'bg-slate-100'}`}>
                                    <div className="font-bold text-slate-800">{sub?.code}</div>
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

      {/* CELL EDIT MODAL (HIDES ON PRINT) */}
      {activeCell && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4 print:hidden">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 border border-slate-100 animate-fadeIn space-y-4">
            <div className="flex justify-between items-start border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-lg text-slate-800">Edit Schedule Slot</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Class: <b>{classes.find(c=>c.id===selectedId)?.name}</b> • Slot: <b>{activeCell.day}, {timeSlots.find(p=>p.id===activeCell.periodId)?.name}</b>
                </p>
              </div>
              <button onClick={() => setActiveCell(null)} className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg">
                <X size={18} />
              </button>
            </div>

            {/* Current Lesson in this cell */}
            {getCellData(activeCell.day, activeCell.periodId) ? (
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="text-2xs font-bold text-indigo-500 uppercase tracking-wider">Scheduled Lesson:</div>
                  <div className="font-bold text-slate-800 mt-0.5">
                    {subjects.find(s=>s.id===getCellData(activeCell.day, activeCell.periodId)?.subjectId)?.name}
                  </div>
                  <div className="text-xs text-slate-500">
                    Taught by: {teachers.find(t=>t.id===getCellData(activeCell.day, activeCell.periodId)?.teacherId)?.name}
                  </div>
                  <div className="text-xs text-slate-500">
                    Location: {rooms.find(r=>r.id===getCellData(activeCell.day, activeCell.periodId)?.roomId)?.name}
                  </div>
                </div>
                <button
                  onClick={handleRemoveCell}
                  className="p-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 border border-red-200 flex flex-col items-center justify-center text-center font-bold text-xs"
                >
                  <Trash2 size={16} className="mb-0.5" />
                  <span>Remove</span>
                </button>
              </div>
            ) : (
              <div className="p-4 bg-slate-50 rounded-xl border border-dashed border-slate-300 text-center text-xs text-slate-500">
                This slot is currently empty.
              </div>
            )}

            {/* Unscheduled pool */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Place an Unscheduled Lesson</label>
              
              {timetableData.unscheduled.filter(u => u.classId === selectedId).length === 0 ? (
                <p className="text-xs text-slate-400 italic bg-white border border-slate-100 p-4 rounded-xl text-center">No unscheduled lessons available for this class!</p>
              ) : (
                <div className="space-y-1 max-h-40 overflow-y-auto pr-1">
                  {timetableData.unscheduled.filter(u => u.classId === selectedId).map((u) => {
                    const sub = subjects.find(s=>s.id===u.subjectId);
                    const t = teachers.find(teach=>teach.id===u.teacherId);
                    const isSelected = selectedUnscheduledId === u.id;

                    return (
                      <div 
                        key={u.id}
                        onClick={() => setSelectedUnscheduledId(u.id)}
                        className={`p-2.5 rounded-xl border flex items-center justify-between text-xs cursor-pointer hover:border-indigo-300 transition-all ${
                          isSelected ? 'border-indigo-600 bg-indigo-50/40 font-bold' : 'bg-white border-slate-200'
                        }`}
                      >
                        <div>
                          <span className={`px-1.5 py-0.5 rounded text-3xs font-bold font-mono mr-2 border ${sub?.color.split(' ')[0]}`}>{sub?.code}</span>
                          <span className="text-slate-700">{sub?.name} ({t?.name.split(' ').slice(-1)[0]})</span>
                        </div>
                        <span className="text-2xs bg-slate-100 text-slate-600 font-bold px-1.5 py-0.5 rounded border">
                          {u.periodsLeft} left
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="flex space-x-2 pt-2 border-t border-slate-100">
              <button
                onClick={handlePlaceUnscheduled}
                disabled={!selectedUnscheduledId}
                className="flex-1 flex items-center justify-center space-x-1 px-4 py-2 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 disabled:opacity-40"
              >
                <Plus size={16} />
                <span>Place Lesson</span>
              </button>
              <button
                onClick={() => setActiveCell(null)}
                className="flex-1 flex items-center justify-center px-4 py-2 border border-slate-200 text-slate-600 rounded-xl font-medium hover:bg-slate-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
