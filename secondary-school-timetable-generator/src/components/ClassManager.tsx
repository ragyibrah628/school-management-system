import React, { useState } from 'react';
import { useTimetable } from '../context/TimetableContext';
import { SchoolClass, ClassSubject } from '../types';
import { 
  Plus, Trash2, Edit2, Check, X, GraduationCap, 
  BookOpen, Clock, User, ChevronDown, ChevronUp, AlertCircle 
} from 'lucide-react';

export const ClassManager: React.FC = () => {
  const { 
    classes, subjects, teachers, rooms, classSubjects, 
    addClass, updateClass, deleteClass, 
    addClassSubject, updateClassSubject, deleteClassSubject 
  } = useTimetable();

  const [isAddingClass, setIsAddingClass] = useState(false);
  const [editingClassId, setEditingClassId] = useState<string | null>(null);
  const [expandedClassId, setExpandedClassId] = useState<string | null>(null);

  // Class Form State
  const [className, setClassName] = useState('');
  const [grade, setGrade] = useState<number>(9);
  const [assignedRoomId, setAssignedRoomId] = useState<string>('');

  // ClassSubject Form State (Adding a subject to a class)
  const [selectedSubId, setSelectedSubId] = useState('');
  const [selectedTeachId, setSelectedTeachId] = useState('');
  const [periodsPerWeek, setPeriodsPerWeek] = useState<number>(4);
  const [isDouble, setIsDouble] = useState(false);
  const [isAddingSubject, setIsAddingSubject] = useState<string | null>(null);
  const [editingCSId, setEditingCSId] = useState<string | null>(null);

  const handleEditClass = (c: SchoolClass) => {
    setEditingClassId(c.id);
    setClassName(c.name);
    setGrade(c.grade);
    setAssignedRoomId(c.assignedRoomId || '');
    setIsAddingClass(false);
  };

  const handleSaveClass = () => {
    if (!className.trim()) return;

    const classData: SchoolClass = {
      id: editingClassId || `c_${Date.now()}`,
      name: className,
      grade: Number(grade),
      roomType: 'regular',
      assignedRoomId: assignedRoomId || undefined
    };

    if (editingClassId) {
      updateClass(classData);
      setEditingClassId(null);
    } else {
      addClass(classData);
      setIsAddingClass(false);
    }
    resetClassForm();
  };

  const resetClassForm = () => {
    setClassName('');
    setGrade(9);
    setAssignedRoomId('');
  };

  const resetCSForm = () => {
    setSelectedSubId('');
    setSelectedTeachId('');
    setPeriodsPerWeek(4);
    setIsDouble(false);
    setEditingCSId(null);
    setIsAddingSubject(null);
  };

  // --- ClassSubject Assignment Handlers ---
  const handleAddSubjectToClass = (classId: string) => {
    if (!selectedSubId || !selectedTeachId) return;

    const data: ClassSubject = {
      id: editingCSId || `cs_${Date.now()}`,
      classId,
      subjectId: selectedSubId,
      teacherId: selectedTeachId,
      periodsPerWeek: Number(periodsPerWeek),
      isDoublePeriod: isDouble
    };

    if (editingCSId) {
      updateClassSubject(data);
    } else {
      addClassSubject(data);
    }
    resetCSForm();
  };

  const handleEditCS = (cs: ClassSubject) => {
    setEditingCSId(cs.id);
    setSelectedSubId(cs.subjectId);
    setSelectedTeachId(cs.teacherId);
    setPeriodsPerWeek(cs.periodsPerWeek);
    setIsDouble(!!cs.isDoublePeriod);
    setIsAddingSubject(cs.classId);
  };

  // Filter teachers by qualified subject
  const filteredTeachers = selectedSubId 
    ? teachers.filter(t => t.qualifiedSubjects.includes(selectedSubId))
    : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Classes & Curriculum</h1>
          <p className="text-slate-500 mt-1">Create student cohorts, assign dedicated homerooms, and construct their weekly subject credits.</p>
        </div>
        {!isAddingClass && !editingClassId && (
          <button
            onClick={() => { setIsAddingClass(true); resetClassForm(); }}
            className="flex items-center space-x-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl font-semibold shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 transition-all"
          >
            <Plus size={18} />
            <span>Add Class</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Class Form (Add / Edit) */}
        {(isAddingClass || editingClassId) && (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-fit space-y-4 sticky top-6">
            <h2 className="text-lg font-bold text-slate-900">
              {editingClassId ? 'Edit Cohort' : 'Create Cohort'}
            </h2>
            
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Class/Section Name</label>
                <input
                  type="text"
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  placeholder="e.g. Grade 9A or Form 5-Red"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Grade Level</label>
                <input
                  type="number"
                  value={grade}
                  onChange={(e) => setGrade(Number(e.target.value))}
                  placeholder="9"
                  min={1}
                  max={13}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Assigned Classroom (Optional)</label>
                <select
                  value={assignedRoomId}
                  onChange={(e) => setAssignedRoomId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 bg-white"
                >
                  <option value="">-- No Dedicated Room --</option>
                  {rooms.filter(r => r.type === 'regular').map((r) => (
                    <option key={r.id} value={r.id}>{r.name} (Cap: {r.capacity})</option>
                  ))}
                </select>
                <p className="text-[10px] text-slate-400 mt-1">If set, standard subjects will always be scheduled in this room when available.</p>
              </div>
            </div>

            <div className="flex space-x-2 pt-4 border-t border-slate-100">
              <button
                onClick={handleSaveClass}
                disabled={!className.trim()}
                className="flex-1 flex items-center justify-center space-x-1 px-4 py-2 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Check size={16} />
                <span>Save</span>
              </button>
              <button
                onClick={() => { setIsAddingClass(false); setEditingClassId(null); resetClassForm(); }}
                className="flex-1 flex items-center justify-center space-x-1 px-4 py-2 border border-slate-200 text-slate-600 rounded-xl font-medium hover:bg-slate-50"
              >
                <X size={16} />
                <span>Cancel</span>
              </button>
            </div>
          </div>
        )}

        {/* Classes List */}
        <div className={`space-y-4 ${isAddingClass || editingClassId ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
          {classes.length === 0 ? (
            <div className="bg-white p-12 rounded-2xl text-center text-slate-400 border border-slate-100">
              <GraduationCap size={48} className="mx-auto text-slate-300 mb-3" />
              <p className="font-medium">No classes configured</p>
              <p className="text-sm text-slate-400 mt-1">Create your first class/section and assign their curriculum.</p>
            </div>
          ) : (
            classes.map((cls) => {
const assignedRoom = rooms.find(r => r.id === cls.assignedRoomId);
const isExpanded = expandedClassId === cls.id;
              
              // Find subjects assigned to this class
              const clsSubs = classSubjects.filter(cs => cs.classId === cls.id);
              const totalPeriods = clsSubs.reduce((acc, s) => acc + s.periodsPerWeek, 0);

              return (
                <div 
                  key={cls.id} 
                  className={`rounded-2xl bg-white border shadow-sm transition-all overflow-hidden ${
                    isExpanded ? 'ring-2 ring-indigo-500/30 border-indigo-500' : 'border-slate-100 hover:shadow-md'
                  }`}
                >
                  {/* Class Header row */}
                  <div 
                    className={`p-4 flex items-center justify-between cursor-pointer ${isExpanded ? 'bg-indigo-50/20' : ''}`}
                    onClick={() => setExpandedClassId(isExpanded ? null : cls.id)}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-700 flex flex-col items-center justify-center border font-bold">
                        <span className="text-xs text-slate-400 font-semibold leading-none">GR</span>
                        <span className="text-base font-bold text-slate-800 leading-tight">{cls.grade}</span>
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-800 flex items-center">
                          {cls.name}
                          {assignedRoom && (
                            <span className="ml-2 text-[10px] font-semibold bg-slate-100 border text-slate-500 px-1.5 py-0.5 rounded">
                              Room: {assignedRoom.name}
                            </span>
                          )}
                        </h3>
                        <div className="flex items-center space-x-3 mt-0.5 text-xs text-slate-400 font-medium">
                          <span className="flex items-center"><BookOpen size={13} className="mr-1" /> {clsSubs.length} Subjects</span>
                          <span className="h-1 w-1 bg-slate-300 rounded-full" />
                          <span className="flex items-center"><Clock size={13} className="mr-1" /> {totalPeriods} periods/week</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-1" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => handleEditClass(cls)}
                        className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => deleteClass(cls.id)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 size={16} />
                      </button>
                      <button
                        onClick={() => setExpandedClassId(isExpanded ? null : cls.id)}
                        className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg"
                      >
                        {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                      </button>
                    </div>
                  </div>

                  {/* Expanded Curriculum Section */}
                  {isExpanded && (
                    <div className="border-t border-slate-100 p-4 bg-slate-50/50 space-y-3 animate-fadeIn">
                      <div className="flex justify-between items-center">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center">
                          <BookOpen size={14} className="mr-1.5" /> Course Assignments & Load
                        </h4>
                        
                        {isAddingSubject !== cls.id && (
                          <button
                            onClick={() => { resetCSForm(); setIsAddingSubject(cls.id); }}
                            className="text-xs flex items-center space-x-1 px-2.5 py-1.5 bg-indigo-50 border border-indigo-200 text-indigo-600 font-semibold rounded-lg hover:bg-indigo-100"
                          >
                            <Plus size={14} />
                            <span>Assign Course</span>
                          </button>
                        )}
                      </div>

                      {/* Add/Edit Course Form inside Expandable */}
                      {isAddingSubject === cls.id && (
                        <div className="bg-white p-4 rounded-xl border border-indigo-100 shadow-sm space-y-3 animate-fadeIn">
                          <div className="font-bold text-xs text-slate-700">
                            {editingCSId ? 'Edit Course Credit' : 'Assign New Course Credit'}
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                            <div>
                              <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-1">Subject</label>
                              <select
                                value={selectedSubId}
                                onChange={(e) => { setSelectedSubId(e.target.value); setSelectedTeachId(''); }}
                                className="w-full text-xs px-2.5 py-1.5 border border-slate-200 rounded-lg bg-white"
                              >
                                <option value="">-- Select Subject --</option>
                                {subjects.map(s => {
                                  // Don't show subject if already added to class (unless editing)
                                  const alreadyAdded = clsSubs.some(cs => cs.subjectId === s.id && cs.id !== editingCSId);
                                  if (alreadyAdded) return null;
                                  return <option key={s.id} value={s.id}>{s.name} ({s.code})</option>;
                                })}
                              </select>
                            </div>

                            <div>
                              <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-1">Teacher</label>
                              <select
                                value={selectedTeachId}
                                disabled={!selectedSubId}
                                onChange={(e) => setSelectedTeachId(e.target.value)}
                                className="w-full text-xs px-2.5 py-1.5 border border-slate-200 rounded-lg bg-white disabled:bg-slate-50"
                              >
                                <option value="">-- Select Teacher --</option>
                                {filteredTeachers.map(t => (
                                  <option key={t.id} value={t.id}>{t.name} (Max: {t.maxPeriodsPerWeek}h)</option>
                                ))}
                              </select>
                              {selectedSubId && filteredTeachers.length === 0 && (
                                <p className="text-[9px] text-red-400 font-medium mt-1 flex items-center">
                                  <AlertCircle size={10} className="mr-0.5" /> No qualified teachers found!
                                </p>
                              )}
                            </div>

                            <div>
                              <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-1">Periods / Week</label>
                              <input
                                type="number"
                                value={periodsPerWeek}
                                min={1}
                                max={20}
                                onChange={(e) => setPeriodsPerWeek(Number(e.target.value))}
                                className="w-full text-xs px-2.5 py-1.5 border border-slate-200 rounded-lg"
                              />
                            </div>

                            <div className="flex items-end pb-1.5">
                              <label className="flex items-center space-x-2 text-xs font-medium text-slate-600 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={isDouble}
                                  onChange={(e) => setIsDouble(e.target.checked)}
                                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                                />
                                <span>Prefer Double Periods</span>
                              </label>
                            </div>
                          </div>

                          <div className="flex justify-end space-x-1.5 border-t border-slate-100 pt-2 text-xs">
                            <button
                              onClick={() => handleAddSubjectToClass(cls.id)}
                              disabled={!selectedSubId || !selectedTeachId}
                              className="px-3 py-1.5 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                            >
                              {editingCSId ? 'Save Changes' : 'Assign Course'}
                            </button>
                            <button
                              onClick={resetCSForm}
                              className="px-3 py-1.5 border border-slate-200 text-slate-500 font-medium rounded-lg hover:bg-slate-50"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Course list for this class */}
                      <div className="space-y-1 max-h-60 overflow-y-auto pr-1">
                        {clsSubs.length === 0 ? (
                          <div className="p-6 bg-white border border-slate-100 rounded-xl text-center text-xs text-slate-400">
                            No courses assigned. Add the subjects this class needs to study.
                          </div>
                        ) : (
                          clsSubs.map((cs) => {
                            const sub = subjects.find(s => s.id === cs.subjectId);
                            const t = teachers.find(teach => teach.id === cs.teacherId);
                            
                            return (
                              <div key={cs.id} className="bg-white p-2.5 rounded-xl border border-slate-200 hover:border-slate-300 transition-all flex items-center justify-between text-xs font-medium text-slate-700">
                                <div className="flex items-center space-x-3">
                                  <span className={`px-2 py-0.5 rounded border font-mono font-bold text-[10px] ${sub?.color.split(' ')[0] || 'bg-slate-100'}`}>
                                    {sub?.code || 'SUB'}
                                  </span>
                                  <span className="font-bold text-slate-800 min-w-32">{sub?.name}</span>
                                  
                                  <div className="hidden md:flex items-center text-slate-400 text-2xs">
                                    <User size={12} className="mr-1" />
                                    <span>{t?.name || 'Unassigned'}</span>
                                  </div>
                                </div>

                                <div className="flex items-center space-x-4">
                                  <span className="bg-slate-100 px-2 py-0.5 rounded text-2xs font-bold border border-slate-200 text-slate-600">
                                    {cs.periodsPerWeek} p/wk {cs.isDoublePeriod && '🧬'}
                                  </span>

                                  <div className="flex items-center space-x-1">
                                    <button
                                      onClick={() => handleEditCS(cs)}
                                      className="p-1 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md"
                                    >
                                      <Edit2 size={13} />
                                    </button>
                                    <button
                                      onClick={() => deleteClassSubject(cs.id)}
                                      className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md"
                                    >
                                      <Trash2 size={13} />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
