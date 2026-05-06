import React from 'react';
import { useTimetable } from '../context/TimetableContext';
import { 
  GraduationCap, Users, BookOpen, DoorClosed, Calendar, 
  RefreshCw, CheckCircle, AlertTriangle, Play, Database, Trash2
} from 'lucide-react';
// @ts-ignore
import confetti from 'canvas-confetti';

export const Dashboard: React.FC = () => {
  const { 
    teachers, subjects, rooms, classes, classSubjects, timetableData, conflicts, isGenerating,
    triggerGeneration, loadDummyData, clearAllData, setActiveTab 
  } = useTimetable();

  const handleGenerate = () => {
    triggerGeneration();
    setTimeout(() => {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }, 1000);
  };

  // Stats calculations
  const totalClasses = classes.length;
  const totalTeachers = teachers.length;
  const totalSubjects = subjects.length;
  const totalRooms = rooms.length;
  const totalPeriodsRequired = classSubjects.reduce((acc, cs) => acc + cs.periodsPerWeek, 0);

  const stats = [
    { label: 'Classes', value: totalClasses, icon: GraduationCap, color: 'bg-blue-500 text-white', tab: 'classes' },
    { label: 'Teachers', value: totalTeachers, icon: Users, color: 'bg-indigo-500 text-white', tab: 'teachers' },
    { label: 'Subjects', value: totalSubjects, icon: BookOpen, color: 'bg-emerald-500 text-white', tab: 'subjects' },
    { label: 'Rooms & Labs', value: totalRooms, icon: DoorClosed, color: 'bg-amber-500 text-white', tab: 'rooms' },
    { label: 'Total Weekly Lessons', value: totalPeriodsRequired, icon: Calendar, color: 'bg-rose-500 text-white', tab: 'classes' },
  ];

  const unscheduledCount = timetableData 
    ? timetableData.unscheduled.reduce((acc, u) => acc + u.periodsLeft, 0)
    : 0;

  const totalLessons = timetableData?.generationStats?.totalLessons || 0;
  const scheduledLessons = timetableData?.generationStats?.scheduledLessons || 0;
  const scheduledPercentage = totalLessons > 0 
    ? Math.round((scheduledLessons / totalLessons) * 100) 
    : 0;

  const errors = conflicts.filter(c => c.severity === 'error').length;
  const warnings = conflicts.filter(c => c.severity === 'warning').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">School Timetable Dashboard</h1>
          <p className="text-slate-500 mt-1">Configure your secondary school and generate optimal, conflict-free schedules.</p>
        </div>
        <div className="flex space-x-3">
          {teachers.length === 0 && (
            <button
              onClick={loadDummyData}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium transition-all"
            >
              <Database size={18} />
              <span>Load Demo Data</span>
            </button>
          )}
          {teachers.length > 0 && (
            <button
              onClick={clearAllData}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 font-medium transition-all"
            >
              <Trash2 size={18} />
              <span>Clear All</span>
            </button>
          )}
          
          <button
            onClick={handleGenerate}
            disabled={isGenerating || classes.length === 0 || teachers.length === 0}
            className={`flex items-center space-x-2 px-6 py-2.5 rounded-xl font-semibold shadow-lg shadow-indigo-600/20 transition-all ${
              isGenerating || classes.length === 0 || teachers.length === 0
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'
                : 'bg-indigo-600 text-white hover:bg-indigo-700'
            }`}
          >
            {isGenerating ? <RefreshCw size={18} className="animate-spin" /> : <Play size={18} fill="currentColor" />}
            <span>{timetableData ? 'Regenerate Timetable' : 'Generate Timetable'}</span>
          </button>
        </div>
      </div>

      {/* Configuration Status Warnings */}
      {classes.length === 0 && (
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex items-start space-x-3">
          <AlertTriangle className="text-amber-500 flex-shrink-0" size={20} />
          <div>
            <h3 className="font-semibold text-amber-800">No School Data Available</h3>
            <p className="text-amber-700 text-sm mt-0.5">
              To generate a timetable, you need to add subjects, rooms, teachers, classes, and assign teaching hours. 
              Click <button onClick={loadDummyData} className="font-bold underline hover:text-amber-900">Load Demo Data</button> above to quickly populate the app with a sample school setup!
            </p>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div 
              key={i} 
              onClick={() => setActiveTab(stat.tab)}
              className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center space-x-4 cursor-pointer hover:shadow-md transition-all group"
            >
              <div className={`p-3.5 rounded-xl ${stat.color} group-hover:scale-105 transition-all`}>
                <Icon size={22} />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">{stat.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Timetable Generation Results */}
      {timetableData && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Summary Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 mb-4">Generation Status</h2>
              <div className="flex items-center space-x-3 mb-6 bg-slate-50 p-4 rounded-xl border border-slate-100">
                {unscheduledCount === 0 ? (
                  <>
                    <CheckCircle className="text-emerald-500" size={32} />
                    <div>
                      <h4 className="font-bold text-slate-800">100% Placed</h4>
                      <p className="text-xs text-slate-500">All required lessons successfully scheduled.</p>
                    </div>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="text-amber-500" size={32} />
                    <div>
                      <h4 className="font-bold text-slate-800">{scheduledPercentage}% Placed</h4>
                      <p className="text-xs text-slate-500">{unscheduledCount} lessons couldn't be automatically scheduled.</p>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="space-y-3 border-t border-slate-100 pt-4 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Total Weekly Lessons:</span>
                <span className="font-semibold text-slate-900">{totalLessons}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Successfully Scheduled:</span>
                <span className="font-semibold text-emerald-600">{scheduledLessons}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Unscheduled / Deferred:</span>
                <span className={`font-semibold ${unscheduledCount > 0 ? 'text-amber-500 font-bold' : 'text-slate-400'}`}>
                  {unscheduledCount}
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Generation Time:</span>
                <span className="font-mono text-xs bg-slate-100 px-1.5 py-0.5 rounded text-slate-700">
                  {timetableData.generationStats?.executionTime} ms
                </span>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('schedule')}
              className="mt-6 w-full py-2.5 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-700 font-medium text-center transition-all text-sm"
            >
              View Generated Timetables
            </button>
          </div>

          {/* Schedule Health & Conflicts */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Schedule Health & Conflicts</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-xl border border-red-100 bg-red-50/40">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-red-500 text-white">
                    <AlertTriangle size={18} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800">Critical Conflicts</h4>
                    <p className="text-xs text-slate-500">Double bookings (must be resolved)</p>
                  </div>
                </div>
                <span className={`text-xl font-bold ${errors > 0 ? 'text-red-500' : 'text-slate-400'}`}>{errors}</span>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl border border-amber-100 bg-amber-50/40">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-amber-500 text-white">
                    <AlertTriangle size={18} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800">Schedule Warnings</h4>
                    <p className="text-xs text-slate-500">Teacher unavailability, workload exceedance</p>
                  </div>
                </div>
                <span className={`text-xl font-bold ${warnings > 0 ? 'text-amber-500' : 'text-slate-400'}`}>{warnings}</span>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-center text-sm text-slate-500 h-[88px] flex items-center justify-center">
                {conflicts.length === 0 ? (
                  <p className="text-emerald-600 font-medium">✨ Schedule is 100% collision-free!</p>
                ) : (
                  <p>
                    Found {conflicts.length} active schedule issue{conflicts.length > 1 ? 's' : ''}. 
                    <button onClick={() => setActiveTab('schedule')} className="text-indigo-600 font-semibold ml-1 hover:underline">
                      Inspect & fix
                    </button>
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Unplaced Lessons */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col">
            <h2 className="text-lg font-bold text-slate-900 mb-2">Unplaced Lessons ({unscheduledCount})</h2>
            <p className="text-xs text-slate-400 mb-4">Lessons that couldn't be placed automatically due to full schedules or room limits. You can manually drag these into the schedule.</p>
            
            <div className="flex-1 overflow-y-auto max-h-[190px] pr-1 space-y-2">
              {timetableData.unscheduled.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-slate-400 h-full">
                  <CheckCircle size={24} className="text-slate-300 mb-2" />
                  <p className="text-xs">No unscheduled lessons!</p>
                </div>
              ) : (
                timetableData.unscheduled.map((u) => {
                  const cls = classes.find(c => c.id === u.classId);
                  const sub = subjects.find(s => s.id === u.subjectId);
                  const teach = teachers.find(t => t.id === u.teacherId);
                  
                  return (
                    <div key={u.id} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs hover:border-slate-300 transition-all">
                      <div className="min-w-0">
                        <div className="font-bold text-slate-800">{cls?.name} — {sub?.name}</div>
                        <div className="text-slate-400 truncate">{teach?.name}</div>
                      </div>
                      <div className="bg-amber-100 text-amber-800 font-bold px-2 py-1 rounded-lg">
                        {u.periodsLeft} p.
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* Setup Guide (if no timetable exists) */}
      {!timetableData && (
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 mb-4">How to Generate Your School Timetable</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
            {[
              { title: '1. Subjects & Rooms', desc: 'Add subjects (e.g. Science) and specify room requirements (Labs, Gym). Create corresponding physical spaces.', tab: 'subjects' },
              { title: '2. Faculty List', desc: 'Add teachers, assign subjects they are qualified to teach, and mark their unavailable periods.', tab: 'teachers' },
              { title: '3. Classes & Credits', desc: 'Define classes (9A, 10B) and specify weekly subject requirements and assigned teachers.', tab: 'classes' },
              { title: '4. Run Generator', desc: 'Click "Generate Timetable" to run our heuristic scheduler and view the results.', tab: 'dashboard' },
            ].map((step, i) => (
              <div 
                key={i} 
                onClick={() => setActiveTab(step.tab)}
                className="p-4 bg-slate-50 border border-slate-100 rounded-xl hover:bg-indigo-50/30 hover:border-indigo-200 transition-all cursor-pointer relative group"
              >
                <div className="text-indigo-500 font-bold text-sm mb-1 group-hover:translate-x-1 transition-all">{step.title}</div>
                <p className="text-slate-500 text-xs leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
