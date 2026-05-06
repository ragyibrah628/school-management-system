import React from 'react';
import { useTimetable } from '../context/TimetableContext';
import { 
  LayoutDashboard, Users, BookOpen, GraduationCap, 
  DoorClosed, Calendar, Settings, AlertTriangle, RefreshCw
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, isGenerating, timetableData, conflicts } = useTimetable();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'classes', label: 'Classes & Courses', icon: GraduationCap },
    { id: 'teachers', label: 'Teachers', icon: Users },
    { id: 'subjects', label: 'Subjects', icon: BookOpen },
    { id: 'rooms', label: 'Rooms & Labs', icon: DoorClosed },
    { id: 'schedule', label: 'Timetable Schedule', icon: Calendar, highlight: !!timetableData },
    { id: 'settings', label: 'School Settings', icon: Settings },
  ];

  const errorConflicts = conflicts.filter(c => c.severity === 'error');
  const warningConflicts = conflicts.filter(c => c.severity === 'warning');

  return (
    <div className="w-64 bg-slate-900 text-slate-100 flex flex-col h-screen fixed left-0 top-0 border-r border-slate-800">
      <div className="p-5 border-b border-slate-800 flex items-center space-x-3 bg-slate-950">
        <div className="bg-indigo-500 p-2 rounded-lg text-white">
          <Calendar size={24} className="stroke-[2.5]" />
        </div>
        <div>
          <h1 className="text-lg font-bold leading-none tracking-tight">TimeTable Pro</h1>
          <p className="text-xs text-slate-400 mt-1">Secondary School Edition</p>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon size={18} className={isActive ? 'text-white' : 'text-slate-400'} />
                <span>{item.label}</span>
              </div>
              
              {item.id === 'schedule' && timetableData && (
                <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Conflicts & Alerts Summary */}
      {timetableData && (conflicts.length > 0 || timetableData.unscheduled.length > 0) && (
        <div className="m-4 p-3 rounded-xl bg-slate-800 border border-slate-700">
          <div className="flex items-center space-x-2 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <AlertTriangle size={14} />
            <span>Schedule Health</span>
          </div>
          
          <div className="space-y-1.5 text-xs text-slate-300">
            {errorConflicts.length > 0 && (
              <div className="flex justify-between items-center bg-red-950/40 text-red-400 px-2.5 py-1 rounded-md border border-red-900/30">
                <span>Critical Conflicts:</span>
                <span className="font-bold">{errorConflicts.length}</span>
              </div>
            )}
            
            {warningConflicts.length > 0 && (
              <div className="flex justify-between items-center bg-amber-950/40 text-amber-400 px-2.5 py-1 rounded-md border border-amber-900/30">
                <span>Warnings:</span>
                <span className="font-bold">{warningConflicts.length}</span>
              </div>
            )}

            {timetableData.unscheduled.length > 0 && (
              <div className="flex justify-between items-center bg-sky-950/40 text-sky-400 px-2.5 py-1 rounded-md border border-sky-900/30">
                <span>Unplaced Lessons:</span>
                <span className="font-bold">
                  {timetableData.unscheduled.reduce((acc, u) => acc + u.periodsLeft, 0)}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer Generating status */}
      <div className="p-4 border-t border-slate-800 bg-slate-950 flex flex-col space-y-3">
        {isGenerating ? (
          <div className="flex items-center justify-center space-x-2 bg-indigo-600/20 text-indigo-400 py-2.5 rounded-lg text-xs font-semibold border border-indigo-500/20">
            <RefreshCw size={14} className="animate-spin" />
            <span>Generating Schedule...</span>
          </div>
        ) : (
          <div className="text-center text-xs text-slate-500 font-medium">
            v2.1.0 • Built with React
          </div>
        )}
      </div>
    </div>
  );
};
