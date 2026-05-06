import React, { useState } from 'react';
import { useTimetable } from '../context/TimetableContext';
import { Subject } from '../types';
import { Plus, Trash2, Edit2, Check, X, BookOpen } from 'lucide-react';

const COLORS = [
  { class: 'bg-blue-100 border-blue-400 text-blue-800 hover:bg-blue-200', label: 'Blue' },
  { class: 'bg-emerald-100 border-emerald-400 text-emerald-800 hover:bg-emerald-200', label: 'Emerald' },
  { class: 'bg-green-100 border-green-400 text-green-800 hover:bg-green-200', label: 'Green' },
  { class: 'bg-teal-100 border-teal-400 text-teal-800 hover:bg-teal-200', label: 'Teal' },
  { class: 'bg-purple-100 border-purple-400 text-purple-800 hover:bg-purple-200', label: 'Purple' },
  { class: 'bg-orange-100 border-orange-400 text-orange-800 hover:bg-orange-200', label: 'Orange' },
  { class: 'bg-amber-100 border-amber-400 text-amber-800 hover:bg-amber-200', label: 'Amber' },
  { class: 'bg-rose-100 border-rose-400 text-rose-800 hover:bg-rose-200', label: 'Rose' },
  { class: 'bg-pink-100 border-pink-400 text-pink-800 hover:bg-pink-200', label: 'Pink' },
  { class: 'bg-cyan-100 border-cyan-400 text-cyan-800 hover:bg-cyan-200', label: 'Cyan' },
  { class: 'bg-indigo-100 border-indigo-400 text-indigo-800 hover:bg-indigo-200', label: 'Indigo' },
  { class: 'bg-violet-100 border-violet-400 text-violet-800 hover:bg-violet-200', label: 'Violet' },
];

const ROOM_TYPES: { value: Subject['requiresRoomType']; label: string }[] = [
  { value: 'regular', label: 'Standard Classroom' },
  { value: 'lab', label: 'Science Laboratory' },
  { value: 'biology_lab', label: 'Biology Lab' },
  { value: 'physics_lab', label: 'Physics Lab' },
  { value: 'chemistry_lab', label: 'Chemistry Lab' },
  { value: 'gym', label: 'Gymnasium / Field' },
  { value: 'computer_lab', label: 'Computer Lab' },
  { value: 'art_studio', label: 'Art Studio' },
  { value: 'music_room', label: 'Music Room' }
];

export const SubjectManager: React.FC = () => {
  const { subjects, addSubject, updateSubject, deleteSubject } = useTimetable();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [color, setColor] = useState(COLORS[0].class);
  const [roomType, setRoomType] = useState<Subject['requiresRoomType']>('regular');

  const handleEdit = (s: Subject) => {
    setEditingId(s.id);
    setName(s.name);
    setCode(s.code);
    setColor(s.color);
    setRoomType(s.requiresRoomType);
    setIsAdding(false);
  };

  const handleSave = () => {
    if (!name.trim() || !code.trim()) return;

    if (editingId) {
      updateSubject({
        id: editingId,
        name,
        code: code.toUpperCase(),
        color,
        requiresRoomType: roomType
      });
      setEditingId(null);
    } else {
      addSubject({
        id: `s_${Date.now()}`,
        name,
        code: code.toUpperCase(),
        color,
        requiresRoomType: roomType
      });
      setIsAdding(false);
    }
    resetForm();
  };

  const resetForm = () => {
    setName('');
    setCode('');
    setColor(COLORS[0].class);
    setRoomType('regular');
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
          <h1 className="text-2xl font-bold text-slate-900">Manage Subjects</h1>
          <p className="text-slate-500 mt-1">Add or edit school courses and specify their classroom requirements.</p>
        </div>
        {!isAdding && !editingId && (
          <button
            onClick={() => { setIsAdding(true); resetForm(); }}
            className="flex items-center space-x-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl font-semibold shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 transition-all"
          >
            <Plus size={18} />
            <span>Add Subject</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form (Add / Edit) */}
        {(isAdding || editingId) && (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-fit space-y-4 sticky top-6">
            <h2 className="text-lg font-bold text-slate-900">
              {editingId ? 'Edit Subject' : 'Add New Subject'}
            </h2>
            
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Subject Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Mathematics"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Subject Code</label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="e.g. MATH"
                  maxLength={5}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 font-mono uppercase"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Required Room Type</label>
                <select
                  value={roomType}
                  onChange={(e) => setRoomType(e.target.value as Subject['requiresRoomType'])}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 bg-white"
                >
                  {ROOM_TYPES.map((rt) => (
                    <option key={rt.value} value={rt.value}>{rt.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Display Color</label>
                <div className="grid grid-cols-4 gap-2">
                  {COLORS.map((c) => (
                    <button
                      key={c.class}
                      type="button"
                      onClick={() => setColor(c.class)}
                      className={`h-8 rounded-lg border flex items-center justify-center text-xs font-medium transition-all ${c.class} ${
                        color === c.class ? 'ring-2 ring-indigo-600 ring-offset-1 border-transparent scale-105' : 'border-slate-200'
                      }`}
                    >
                      {color === c.class && <Check size={14} />}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex space-x-2 pt-4 border-t border-slate-100">
              <button
                onClick={handleSave}
                disabled={!name.trim() || !code.trim()}
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
          {subjects.length === 0 ? (
            <div className="col-span-full bg-white p-12 rounded-2xl text-center text-slate-400 border border-slate-100">
              <BookOpen size={48} className="mx-auto text-slate-300 mb-3" />
              <p className="font-medium">No subjects configured</p>
              <p className="text-sm text-slate-400 mt-1">Add some subjects to get started with your school curriculum.</p>
            </div>
          ) : (
            subjects.map((s) => {
              const rt = ROOM_TYPES.find(t => t.value === s.requiresRoomType);
              const isEditing = editingId === s.id;
              
              return (
                <div 
                  key={s.id} 
                  className={`p-4 rounded-2xl bg-white border flex items-center justify-between shadow-sm hover:shadow-md transition-all ${
                    isEditing ? 'border-indigo-500 bg-indigo-50/10' : 'border-slate-100'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    {/* Subject badge */}
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-sm font-bold font-mono border ${s.color}`}>
                      {s.code}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800">{s.name}</h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Room: <span className="font-medium text-slate-500">{rt?.label || s.requiresRoomType}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => handleEdit(s)}
                      disabled={isEditing}
                      className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg disabled:opacity-50"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => deleteSubject(s.id)}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 size={16} />
                    </button>
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
