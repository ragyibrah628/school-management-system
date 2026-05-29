import React, { useState } from 'react';
import { useTimetable } from '../context/TimetableContext';
import { TimeSlot, DayOfWeek } from '../types';
import { 
  Settings as SettingsIcon, Calendar, Clock, Database, Trash2, 
  Plus, Check, AlertTriangle, Image, Upload
} from 'lucide-react';

const WEEKDAYS: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export const Settings: React.FC = () => {
  const { 
    timeSlots, days, setTimeSlots, setDays, loadDummyData, clearAllData, timetableData,
    schoolLogo, setSchoolLogo, schoolName, setSchoolName
  } = useTimetable();

  const [isAddingSlot, setIsAddingSlot] = useState(false);
  const [name, setName] = useState('');
  const [start, setStart] = useState('08:00');
  const [end, setEnd] = useState('08:45');
  const [isBreak, setIsBreak] = useState(false);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setSchoolLogo(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Toggle Days
  const handleDayToggle = (day: DayOfWeek) => {
    if (days.includes(day)) {
      if (days.length === 1) return; // Must have at least 1 day
      setDays(days.filter(d => d !== day));
    } else {
      // Keep sort order
      const newDays = WEEKDAYS.filter(d => d === day || days.includes(d));
      setDays(newDays);
    }
  };

  // Add Time Slot
  const handleAddSlot = () => {
    if (!name.trim()) return;
    
    const newSlot: TimeSlot = {
      id: `p_${Date.now()}`,
      name,
      startTime: start,
      endTime: end,
      isBreak
    };

    // Simple chronological sort by start time
    const updatedSlots = [...timeSlots, newSlot].sort((a, b) => a.startTime.localeCompare(b.startTime));
    setTimeSlots(updatedSlots);
    setIsAddingSlot(false);
    setName('');
    setStart('08:00');
    setEnd('08:45');
    setIsBreak(false);
  };

  const handleRemoveSlot = (id: string) => {
    setTimeSlots(timeSlots.filter(s => s.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex items-center space-x-3">
          <div className="bg-slate-100 p-2 text-slate-700 rounded-xl">
            <SettingsIcon size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">School Settings</h1>
            <p className="text-slate-500 mt-1">Configure your school's operating days, daily time blocks, and manage database resets.</p>
          </div>
        </div>
      </div>

      {timetableData && (
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex items-start space-x-3">
          <AlertTriangle className="text-amber-500 flex-shrink-0" size={20} />
          <div>
            <h3 className="font-semibold text-amber-800 text-sm">Active Timetable Present</h3>
            <p className="text-amber-700 text-xs mt-0.5">
              Modifying active days or time slots will invalidate the current schedule. 
              The schedule will remain, but some lessons might display inconsistently. We recommend <b>Regenerating</b> on the Dashboard after making changes.
            </p>
          </div>
        </div>
      )}

      {/* School Branding Section */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4">
        <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
          <Image size={18} className="text-slate-400" />
          <h2 className="text-lg font-bold text-slate-900">School Branding & Custom Logo</h2>
        </div>
        
        <p className="text-xs text-slate-500 leading-relaxed mb-2">
          Add your school's name and upload a logo. This branding will appear at the top of all printed timetables (Class, Teacher, and Master views).
        </p>

        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className="flex-1 w-full space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Official School Name</label>
              <input
                type="text"
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                placeholder="e.g. Springfield Secondary School"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 text-sm font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Upload School Logo</label>
              <div className="flex items-center space-x-2">
                <label className="flex-1 flex items-center justify-center px-4 py-2 bg-indigo-50 border border-dashed border-indigo-300 hover:bg-indigo-100 text-indigo-600 font-semibold rounded-xl text-xs cursor-pointer transition-all">
                  <Upload size={14} className="mr-1.5" />
                  <span>Choose Image File (PNG, JPEG)</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoChange}
                    className="hidden"
                  />
                </label>
                
                {schoolLogo && (
                  <button
                    onClick={() => setSchoolLogo(null)}
                    className="px-3 py-2 bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 font-semibold rounded-xl text-xs flex items-center"
                  >
                    <Trash2 size={14} className="mr-1" /> Remove Logo
                  </button>
                )}
              </div>
              <p className="text-[10px] text-slate-400 mt-1">Image size should be reasonable. It will be scaled down to 40-50px height for headers.</p>
            </div>
          </div>

          <div className="w-full md:w-48 h-32 border border-slate-200 rounded-xl bg-slate-50 flex flex-col items-center justify-center p-3 text-center self-center overflow-hidden">
            {schoolLogo ? (
              <img src={schoolLogo} alt="School Logo Preview" className="max-w-full max-h-20 object-contain mx-auto border shadow-sm rounded p-1 bg-white" />
            ) : (
              <div className="text-slate-400 flex flex-col items-center">
                <Image size={24} className="text-slate-300 mb-1" />
                <span className="text-[10px] font-medium">No Logo Uploaded</span>
              </div>
            )}
            <div className="text-[9px] font-bold text-slate-500 mt-2 truncate max-w-full">{schoolName}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Days of the Week */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-fit space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
            <Calendar size={18} className="text-slate-400" />
            <h2 className="text-lg font-bold text-slate-900">Operating Days</h2>
          </div>
          
          <p className="text-xs text-slate-500 leading-relaxed mb-4">
            Select the days of the week when classes are active. This defines the columns of your timetable schedule.
          </p>

          <div className="space-y-2">
            {WEEKDAYS.map((day) => {
              const isChecked = days.includes(day);
              return (
                <label 
                  key={day} 
                  className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                    isChecked 
                      ? 'bg-indigo-50/40 border-indigo-200 text-indigo-950 font-semibold' 
                      : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  <span className="text-sm">{day}</span>
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleDayToggle(day)}
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 h-5 w-5"
                  />
                </label>
              );
            })}
          </div>
        </div>

        {/* Time Blocks / Periods */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-2">
              <Clock size={18} className="text-slate-400" />
              <h2 className="text-lg font-bold text-slate-900">Time Slots & Periods</h2>
            </div>

            {!isAddingSlot && (
              <button
                onClick={() => setIsAddingSlot(true)}
                className="flex items-center space-x-1 px-2.5 py-1.5 bg-indigo-50 border border-indigo-200 text-indigo-600 text-xs font-semibold rounded-lg hover:bg-indigo-100"
              >
                <Plus size={14} />
                <span>Add Slot</span>
              </button>
            )}
          </div>

          <p className="text-xs text-slate-500 leading-relaxed mb-4">
            Manage your daily bell schedule. Breaks are visible but skipped during automatic lesson placement.
          </p>

          {/* Add slot inline form */}
          {isAddingSlot && (
            <div className="p-4 rounded-xl border border-indigo-100 bg-indigo-50/20 space-y-3 animate-fadeIn">
              <div className="font-bold text-xs text-indigo-900">Add Schedule Slot</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-1">Slot Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Period 9 or Afternoon Recess"
                    className="w-full text-xs px-2.5 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                  />
                </div>
                
                <div className="flex items-end pb-1.5">
                  <label className="flex items-center space-x-2 text-xs font-medium text-slate-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isBreak}
                      onChange={(e) => setIsBreak(e.target.checked)}
                      className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                    />
                    <span>This is a break (Recess, Lunch, etc.)</span>
                  </label>
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-1">Start Time</label>
                  <input
                    type="time"
                    value={start}
                    onChange={(e) => setStart(e.target.value)}
                    className="w-full text-xs px-2.5 py-1.5 border border-slate-200 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-1">End Time</label>
                  <input
                    type="time"
                    value={end}
                    onChange={(e) => setEnd(e.target.value)}
                    className="w-full text-xs px-2.5 py-1.5 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-1.5 pt-1 border-t border-indigo-100/30 text-xs">
                <button
                  onClick={handleAddSlot}
                  disabled={!name.trim()}
                  className="px-3 py-1.5 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                >
                  <Check size={14} className="inline mr-1" /> Save
                </button>
                <button
                  onClick={() => setIsAddingSlot(false)}
                  className="px-3 py-1.5 border border-slate-200 text-slate-500 font-medium rounded-lg hover:bg-slate-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Time Slot List */}
          <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
            {timeSlots.map((s) => (
              <div 
                key={s.id} 
                className={`p-3 rounded-xl border flex items-center justify-between text-xs font-medium ${
                  s.isBreak 
                    ? 'bg-slate-50 border-slate-200 text-slate-500 italic' 
                    : 'bg-white border-slate-200 text-slate-800'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${s.isBreak ? 'bg-slate-300' : 'bg-indigo-500'}`} />
                  <div>
                    <span className={s.isBreak ? 'font-medium' : 'font-bold'}>{s.name}</span>
                    {s.isBreak && <span className="ml-1.5 font-bold text-2xs bg-slate-200 text-slate-500 px-1 py-0.25 rounded">BREAK</span>}
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <span className="font-mono bg-slate-100 border px-2 py-0.5 rounded text-slate-600">
                    {s.startTime} — {s.endTime}
                  </span>
                  
                  <button
                    onClick={() => handleRemoveSlot(s.id)}
                    className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Database Resets */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4">
        <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
          <Database size={18} className="text-slate-400" />
          <h2 className="text-lg font-bold text-slate-900">Database Management</h2>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
          <div className="flex-1">
            <h4 className="text-sm font-bold text-slate-800 mb-1">Database Actions</h4>
            <p className="text-xs text-slate-500">
              Populate the database with a pre-configured, realistic secondary school setup (8 periods, 5 days, 10 teachers, 12 subjects, 6 classes, 12 rooms), or wipe everything to start from scratch.
            </p>
          </div>
          
          <div className="flex items-center space-x-2 self-center">
            <button
              onClick={() => {
                if (window.confirm('This will replace all your current data with the default demo school setup. Continue?')) {
                  loadDummyData();
                }
              }}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold rounded-xl flex items-center space-x-1.5 border border-slate-300 shadow-sm transition-all"
            >
              <Database size={14} />
              <span>Restore Demo Data</span>
            </button>

            <button
              onClick={() => {
                if (window.confirm('Are you absolutely sure you want to delete ALL data? This cannot be undone.')) {
                  clearAllData();
                }
              }}
              className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold rounded-xl flex items-center space-x-1.5 border border-red-200 shadow-sm transition-all"
            >
              <Trash2 size={14} />
              <span>Wipe Database</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
