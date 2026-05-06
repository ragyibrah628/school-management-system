import React, { useState } from 'react';
import { useTimetable } from '../context/TimetableContext';
import { Teacher } from '../types';
import { Plus, Trash2, Edit2, Check, X, Users, Calendar, Mail, Clock } from 'lucide-react';

export const TeacherManager: React.FC = () => {
  const { teachers, subjects, days, timeSlots, addTeacher, updateTeacher, deleteTeacher } = useTimetable();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [maxPeriods, setMaxPeriods] = useState<number>(25);
  const [qualifiedSubs, setQualifiedSubs] = useState<string[]>([]);
  const [unavailable, setUnavailable] = useState<{ day: string; periodId: string }[]>([]);

  const activePeriods = timeSlots.filter(p => !p.isBreak);

  const handleEdit = (t: Teacher) => {
    setEditingId(t.id);
    setName(t.name);
    setEmail(t.email);
    setMaxPeriods(t.maxPeriodsPerWeek);
    setQualifiedSubs(t.qualifiedSubjects);
    setUnavailable(t.unavailableSlots);
    setIsAdding(false);
  };

  const handleSubjectToggle = (subId: string) => {
    setQualifiedSubs(prev => 
      prev.includes(subId) ? prev.filter(id => id !== subId) : [...prev, subId]
    );
  };

  const handleUnavailableToggle = (day: string, periodId: string) => {
    setUnavailable(prev => {
      const exists = prev.some(u => u.day === day && u.periodId === periodId);
      if (exists) {
        return prev.filter(u => !(u.day === day && u.periodId === periodId));
      } else {
        return [...prev, { day, periodId }];
      }
    });
  };

  const handleSave = () => {
    if (!name.trim()) return;

    const teacherData: Teacher = {
      id: editingId || `t_${Date.now()}`,
      name,
      email,
      maxPeriodsPerWeek: Number(maxPeriods) || 25,
      qualifiedSubjects: qualifiedSubs,
      unavailableSlots: unavailable
    };

    if (editingId) {
      updateTeacher(teacherData);
      setEditingId(null);
    } else {
      addTeacher(teacherData);
      setIsAdding(false);
    }
    resetForm();
  };

  const resetForm = () => {
    setName('');
    setEmail('');
    setMaxPeriods(25);
    setQualifiedSubs([]);
    setUnavailable([]);
  };

  const handleCancel = () => {
    setEditingId(null);
    setIsAdding(false);
    resetForm();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Faculty Management</h1>
          <p className="text-slate-500 mt-1">Manage teachers, assign qualified courses, set weekly work limits, and block unavailable slots.</p>
        </div>
        {!isAdding && !editingId && (
          <button
            onClick={() => { setIsAdding(true); resetForm(); }}
            className="flex items-center space-x-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl font-semibold shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 transition-all"
          >
            <Plus size={18} />
            <span>Add Teacher</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form (Add / Edit) */}
        {(isAdding || editingId) && (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-fit space-y-5 sticky top-6 lg:max-h-[calc(100vh-100px)] overflow-y-auto pr-1">
            <h2 className="text-lg font-bold text-slate-900">
              {editingId ? 'Edit Faculty Member' : 'Add New Teacher'}
            </h2>
            
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Dr. John Smith"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. j.smith@school.edu"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Max Periods Per Week</label>
                <input
                  type="number"
                  value={maxPeriods}
                  onChange={(e) => setMaxPeriods(Number(e.target.value))}
                  placeholder="25"
                  min={1}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
                />
                <p className="text-[10px] text-slate-400 mt-1">Maximum teaching hours this teacher can fulfill in a week.</p>
              </div>

              {/* Qualified Subjects */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Qualified Subjects</label>
                <div className="border border-slate-200 p-3 rounded-xl max-h-40 overflow-y-auto space-y-1 bg-slate-50">
                  {subjects.length === 0 ? (
                    <p className="text-xs text-slate-400 text-center py-4">No subjects created yet.</p>
                  ) : (
                    subjects.map(s => (
                      <label key={s.id} className="flex items-center space-x-2 p-1.5 hover:bg-white rounded-lg cursor-pointer text-slate-700 font-medium text-xs">
                        <input
                          type="checkbox"
                          checked={qualifiedSubs.includes(s.id)}
                          onChange={() => handleSubjectToggle(s.id)}
                          className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                        />
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${s.color.split(' ')[0]}`}>{s.code}</span>
                        <span>{s.name}</span>
                      </label>
                    ))
                  )}
                </div>
              </div>

              {/* Availability Slots */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Schedule Availability</label>
                <p className="text-[10px] text-slate-400 mb-2">Click to BLOCK periods when the teacher is NOT available to teach.</p>
                <div className="border border-slate-200 rounded-xl overflow-hidden text-[10px]">
                  <table className="w-full border-collapse bg-white">
                    <thead>
                      <tr className="bg-slate-100">
                        <th className="p-1 border-b border-r border-slate-200 font-bold text-slate-500">Slot</th>
                        {days.map(d => (
                          <th key={d} className="p-1 border-b border-slate-200 text-center font-bold text-slate-600">{d.substring(0,3)}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {activePeriods.map(p => (
                        <tr key={p.id} className="border-b border-slate-100">
                          <td className="p-1 border-r border-slate-200 font-medium text-slate-400 bg-slate-50 text-center whitespace-nowrap">{p.name.split(' ')[1] || p.name}</td>
                          {days.map(d => {
                            const isBlocked = unavailable.some(u => u.day === d && u.periodId === p.id);
                            return (
                              <td 
                                key={d} 
                                onClick={() => handleUnavailableToggle(d, p.id)}
                                className={`p-1 text-center cursor-pointer border-r border-slate-100 transition-all ${
                                  isBlocked 
                                    ? 'bg-red-100 border-red-200 hover:bg-red-200 text-red-600 font-bold' 
                                    : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700'
                                }`}
                              >
                                {isBlocked ? 'X' : 'Free'}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="flex space-x-2 pt-2 border-t border-slate-100">
              <button
                onClick={handleSave}
                disabled={!name.trim()}
                className="flex-1 flex items-center justify-center space-x-1 px-4 py-2 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Check size={16} />
                <span>Save</span>
              </button>
              <button
                onClick={handleCancel}
                className="flex-1 flex items-center justify-center space-x-1 px-4 py-2 border border-slate-200 text-slate-600 rounded-xl font-medium hover:bg-slate-50"
              >
                <X size={16} />
                <span>Cancel</span>
              </button>
            </div>
          </div>
        )}

        {/* List */}
        <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${isAdding || editingId ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
          {teachers.length === 0 ? (
            <div className="col-span-full bg-white p-12 rounded-2xl text-center text-slate-400 border border-slate-100">
              <Users size={48} className="mx-auto text-slate-300 mb-3" />
              <p className="font-medium">No faculty members configured</p>
              <p className="text-sm text-slate-400 mt-1">Add some teachers and their qualified courses to assign classes to them.</p>
            </div>
          ) : (
            teachers.map((t) => {
              const isEditing = editingId === t.id;
              
              return (
                <div 
                  key={t.id} 
                  className={`p-4 rounded-2xl bg-white border flex flex-col justify-between shadow-sm hover:shadow-md transition-all ${
                    isEditing ? 'border-indigo-500 bg-indigo-50/10' : 'border-slate-100'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-3">
                      {/* Avatar placeholder */}
                      <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-sm">
                        {t.name.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-800">{t.name}</h3>
                        {t.email && (
                          <div className="flex items-center text-xs text-slate-400 mt-0.5">
                            <Mail size={12} className="mr-1" />
                            <span>{t.email}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => handleEdit(t)}
                        disabled={isEditing}
                        className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg disabled:opacity-50"
                      >
                        <Edit2 size={15} />
                      </button>
                      <button
                        onClick={() => deleteTeacher(t.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs border-t border-slate-100 pt-3">
                    <div className="flex items-center text-slate-500 bg-slate-50 p-1.5 rounded-lg border border-slate-100">
                      <Clock size={14} className="mr-1.5 text-slate-400" />
                      <span>Max: <b>{t.maxPeriodsPerWeek}</b> periods</span>
                    </div>
                    <div className="flex items-center text-slate-500 bg-slate-50 p-1.5 rounded-lg border border-slate-100">
                      <Calendar size={14} className="mr-1.5 text-slate-400" />
                      <span>Blocked: <b>{t.unavailableSlots.length}</b> slots</span>
                    </div>
                  </div>

                  {/* Qualified Subjects List */}
                  <div className="mt-2 text-[11px] font-medium text-slate-400">
                    <span className="block mb-1">Teaches:</span>
                    <div className="flex flex-wrap gap-1">
                      {t.qualifiedSubjects.length === 0 ? (
                        <span className="text-slate-400 text-2xs italic">No courses assigned</span>
                      ) : (
                        t.qualifiedSubjects.map(subId => {
                          const sub = subjects.find(s => s.id === subId);
                          if (!sub) return null;
                          return (
                            <span 
                              key={subId} 
                              className={`px-1.5 py-0.5 rounded border text-[10px] font-semibold ${sub.color.split(' ')[0]}`}
                            >
                              {sub.name}
                            </span>
                          );
                        })
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
