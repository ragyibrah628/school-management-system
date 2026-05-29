import React, { useState } from 'react';
import { useTimetable } from '../context/TimetableContext';
import { Room } from '../types';
import { Plus, Trash2, Edit2, Check, X, DoorClosed } from 'lucide-react';

const ROOM_TYPES = [
  { value: 'regular', label: 'Standard Classroom', color: 'bg-slate-100 text-slate-800' },
  { value: 'lab', label: 'Science Laboratory', color: 'bg-purple-100 text-purple-800' },
  { value: 'biology_lab', label: 'Biology Lab', color: 'bg-green-100 text-green-800' },
  { value: 'physics_lab', label: 'Physics Lab', color: 'bg-indigo-100 text-indigo-800' },
  { value: 'chemistry_lab', label: 'Chemistry Lab', color: 'bg-teal-100 text-teal-800' },
  { value: 'gym', label: 'Gymnasium / Field', color: 'bg-emerald-100 text-emerald-800' },
  { value: 'computer_lab', label: 'Computer Lab', color: 'bg-blue-100 text-blue-800' },
  { value: 'art_studio', label: 'Art Studio', color: 'bg-pink-100 text-pink-800' },
  { value: 'music_room', label: 'Music Room', color: 'bg-indigo-100 text-indigo-800' }
];

export const RoomManager: React.FC = () => {
  const { rooms, addRoom, updateRoom, deleteRoom } = useTimetable();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [type, setType] = useState<Room['type']>('regular');
  const [capacity, setCapacity] = useState<number>(30);

  const handleEdit = (r: Room) => {
    setEditingId(r.id);
    setName(r.name);
    setType(r.type);
    setCapacity(r.capacity);
    setIsAdding(false);
  };

  const handleSave = () => {
    if (!name.trim()) return;

    if (editingId) {
      updateRoom({
        id: editingId,
        name,
        type,
        capacity: Number(capacity) || 30
      });
      setEditingId(null);
    } else {
      addRoom({
        id: `r_${Date.now()}`,
        name,
        type,
        capacity: Number(capacity) || 30
      });
      setIsAdding(false);
    }
    resetForm();
  };

  const resetForm = () => {
    setName('');
    setType('regular');
    setCapacity(30);
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
          <h1 className="text-2xl font-bold text-slate-900">Manage Rooms & Facilities</h1>
          <p className="text-slate-500 mt-1">Add classrooms and specialized facilities. Capacity limits will be factored into scheduling.</p>
        </div>
        {!isAdding && !editingId && (
          <button
            onClick={() => { setIsAdding(true); resetForm(); }}
            className="flex items-center space-x-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl font-semibold shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 transition-all"
          >
            <Plus size={18} />
            <span>Add Facility</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form (Add / Edit) */}
        {(isAdding || editingId) && (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-fit space-y-4 sticky top-6">
            <h2 className="text-lg font-bold text-slate-900">
              {editingId ? 'Edit Facility' : 'Add New Facility'}
            </h2>
            
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Facility Name / Number</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Room 101 or Science Lab A"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Facility Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as Room['type'])}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 bg-white"
                >
                  {ROOM_TYPES.map((rt) => (
                    <option key={rt.value} value={rt.value}>{rt.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Student Capacity</label>
                <input
                  type="number"
                  value={capacity}
                  onChange={(e) => setCapacity(Number(e.target.value))}
                  placeholder="30"
                  min={1}
                  max={500}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
                />
              </div>
            </div>

            <div className="flex space-x-2 pt-4 border-t border-slate-100">
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
          {rooms.length === 0 ? (
            <div className="col-span-full bg-white p-12 rounded-2xl text-center text-slate-400 border border-slate-100">
              <DoorClosed size={48} className="mx-auto text-slate-300 mb-3" />
              <p className="font-medium">No rooms or labs configured</p>
              <p className="text-sm text-slate-400 mt-1">Add some classrooms or special labs to host your subjects.</p>
            </div>
          ) : (
            rooms.map((r) => {
              const rt = ROOM_TYPES.find(t => t.value === r.type);
              const isEditing = editingId === r.id;
              
              return (
                <div 
                  key={r.id} 
                  className={`p-4 rounded-2xl bg-white border flex items-center justify-between shadow-sm hover:shadow-md transition-all ${
                    isEditing ? 'border-indigo-500 bg-indigo-50/10' : 'border-slate-100'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    {/* Room icon */}
                    <div className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center border font-mono ${rt?.color || 'bg-slate-100'}`}>
                      <DoorClosed size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800">{r.name}</h3>
                      <div className="flex items-center space-x-3 mt-1">
                        <span className="text-xs text-slate-400">
                          Type: <span className="font-medium text-slate-600">{rt?.label || r.type}</span>
                        </span>
                        <span className="h-1 w-1 bg-slate-300 rounded-full" />
                        <span className="text-xs text-slate-400">
                          Capacity: <span className="font-medium text-slate-600">{r.capacity} seats</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => handleEdit(r)}
                      disabled={isEditing}
                      className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg disabled:opacity-50"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => deleteRoom(r.id)}
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
