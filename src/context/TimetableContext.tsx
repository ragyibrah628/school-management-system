import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Subject, Teacher, Room, SchoolClass, ClassSubject, TimeSlot, DayOfWeek, TimetableData, Conflict } from '../types';
import { DEFAULT_DAYS, DEFAULT_TIME_SLOTS, DEFAULT_SUBJECTS, DEFAULT_ROOMS, DEFAULT_TEACHERS, DEFAULT_CLASSES, DEFAULT_CLASS_SUBJECTS } from '../utils/dummyData';
import { generateSchoolTimetable, validateSchedule } from '../utils/scheduler';
import * as cloud from '../lib/cloud';

interface TimetableContextType {
  teachers: Teacher[];
  subjects: Subject[];
  rooms: Room[];
  classes: SchoolClass[];
  classSubjects: ClassSubject[];
  timeSlots: TimeSlot[];
  days: DayOfWeek[];
  timetableData: TimetableData | null;
  conflicts: Conflict[];
  isGenerating: boolean;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  
  // CRUD operations
  addTeacher: (teacher: Teacher) => void;
  updateTeacher: (teacher: Teacher) => void;
  deleteTeacher: (id: string) => void;
  
  addSubject: (subject: Subject) => void;
  updateSubject: (subject: Subject) => void;
  deleteSubject: (id: string) => void;
  
  addRoom: (room: Room) => void;
  updateRoom: (room: Room) => void;
  deleteRoom: (id: string) => void;
  
  addClass: (cls: SchoolClass) => void;
  updateClass: (cls: SchoolClass) => void;
  deleteClass: (id: string) => void;
  
  addClassSubject: (cs: ClassSubject) => void;
  updateClassSubject: (cs: ClassSubject) => void;
  deleteClassSubject: (id: string) => void;

  setTimeSlots: (slots: TimeSlot[]) => void;
  setDays: (days: DayOfWeek[]) => void;
  
  schoolLogo: string | null;
  setSchoolLogo: (logo: string | null) => void;
  schoolName: string;
  setSchoolName: (name: string) => void;
  
  // Generation and Manual Adjustments
  triggerGeneration: () => void;
  updateLessonSlot: (classId: string, day: string, periodId: string, subjectId: string, teacherId: string, roomId: string, metadata?: Record<string, any>) => void;
  removeLessonSlot: (classId: string, day: string, periodId: string) => void;
  scheduleUnscheduledLesson: (unscheduledId: string, classId: string, day: string, periodId: string, roomId: string) => void;
  
  loadDummyData: () => void;
  clearAllData: () => void;
}

const TimetableContext = createContext<TimetableContextType | undefined>(undefined);

export const useTimetable = () => {
  const context = useContext(TimetableContext);
  if (!context) throw new Error('useTimetable must be used within a TimetableProvider');
  return context;
};

export const TimetableProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // ALWAYS sync from admin's School Management System
  const colors = ['bg-blue-100 border-blue-400 text-blue-800 hover:bg-blue-200','bg-emerald-100 border-emerald-400 text-emerald-800 hover:bg-emerald-200','bg-green-100 border-green-400 text-green-800 hover:bg-green-200','bg-teal-100 border-teal-400 text-teal-800 hover:bg-teal-200','bg-purple-100 border-purple-400 text-purple-800 hover:bg-purple-200','bg-orange-100 border-orange-400 text-orange-800 hover:bg-orange-200','bg-amber-100 border-amber-400 text-amber-800 hover:bg-amber-200','bg-rose-100 border-rose-400 text-rose-800 hover:bg-rose-200','bg-pink-100 border-pink-400 text-pink-800 hover:bg-pink-200','bg-cyan-100 border-cyan-400 text-cyan-800 hover:bg-cyan-200','bg-indigo-100 border-indigo-400 text-indigo-800 hover:bg-indigo-200','bg-violet-100 border-violet-400 text-violet-800 hover:bg-violet-200'];

  const getSubjectsFromAdmin = (): Subject[] => {
    try {
      const shared = JSON.parse(localStorage.getItem('tt_shared_subjects') || '[]');
      if (shared.length > 0) {
        return shared.map((name: string, i: number) => {
          // Preserve existing subject data if available
          const existing = JSON.parse(localStorage.getItem('tt_subjects') || '[]');
          const found = existing.find((s: any) => s.name === name);
          return found || {
            id: `s_shared_${i}`,
            name,
            code: name.substring(0, 4).toUpperCase(),
            color: colors[i % colors.length],
            requiresRoomType: 'regular' as const
          };
        });
      }
    } catch {}
    const saved = localStorage.getItem('tt_subjects');
    return saved ? JSON.parse(saved) : DEFAULT_SUBJECTS;
  };

  const getTeachersFromAdmin = (): Teacher[] => {
    try {
      const shared = JSON.parse(localStorage.getItem('tt_shared_teachers') || '[]');
      if (shared.length > 0) {
        return shared.map((t: any) => {
          // Preserve existing teacher data if available
          const existing = JSON.parse(localStorage.getItem('tt_teachers') || '[]');
          const found = existing.find((e: any) => e.id === t.id || e.name === t.name);
          return found || {
            id: t.id,
            name: t.name,
            email: '',
            maxPeriodsPerWeek: 25,
            qualifiedSubjects: [],
            unavailableSlots: []
          };
        });
      }
    } catch {}
    const saved = localStorage.getItem('tt_teachers');
    return saved ? JSON.parse(saved) : DEFAULT_TEACHERS;
  };

  const [teachers, setTeachers] = useState<Teacher[]>(getTeachersFromAdmin);
  const [subjects, setSubjects] = useState<Subject[]>(getSubjectsFromAdmin);

  // Auto-sync when timetable opens
  useEffect(() => {
    setTeachers(getTeachersFromAdmin());
    setSubjects(getSubjectsFromAdmin());
  }, []);

  const [rooms, setRooms] = useState<Room[]>(() => {
    const saved = localStorage.getItem('tt_rooms');
    return saved ? JSON.parse(saved) : DEFAULT_ROOMS;
  });

  const getClassesFromAdmin = (): SchoolClass[] => {
    try {
      const sharedValue = localStorage.getItem('tt_shared_classes');
      if (sharedValue !== null) {
        const shared = JSON.parse(sharedValue);
        if (!Array.isArray(shared)) throw new Error('Invalid shared classes');
        return shared.map((name: string, i: number) => {
          const existing = JSON.parse(localStorage.getItem('tt_classes') || '[]');
          const found = existing.find((c: any) => c.name === name);
          return found || {
            id: `c_shared_${i}`,
            name,
            grade: parseInt(name.replace(/[^IViv]/g, '').length.toString()) || 1,
            roomType: 'regular' as const
          };
        });
      }
    } catch {}
    const saved = localStorage.getItem('tt_classes');
    return saved ? JSON.parse(saved) : DEFAULT_CLASSES;
  };

  const [classes, setClasses] = useState<SchoolClass[]>(getClassesFromAdmin);

  // Also sync classes on mount
  useEffect(() => {
    setClasses(getClassesFromAdmin());
  }, []);

  const [classSubjects, setClassSubjects] = useState<ClassSubject[]>(() => {
    const saved = localStorage.getItem('tt_classSubjects');
    return saved ? JSON.parse(saved) : DEFAULT_CLASS_SUBJECTS;
  });

  const [timeSlots, setTimeSlotsState] = useState<TimeSlot[]>(() => {
    const saved = localStorage.getItem('tt_timeSlots');
    const storedSlots = saved ? JSON.parse(saved) : DEFAULT_TIME_SLOTS;
    const slots = Array.isArray(storedSlots) ? storedSlots : DEFAULT_TIME_SLOTS;
    const normalizedSlots = slots.map((slot: any) => {
      if (slot.id === 'b1') return { ...slot, name: 'Morning Break', startTime: '10:40', endTime: '11:10', isBreak: true, isActivity: false };
      if (slot.id === 'lunch') return { ...slot, name: 'Lunch', startTime: '14:30', endTime: '15:30', isBreak: true, isActivity: false };
      if (slot.id === 'act' || slot.isActivity || slot.name?.toLowerCase() === 'activity') {
        return { ...slot, name: 'Activity', startTime: '15:30', endTime: '17:30', isActivity: true, isBreak: false };
      }
      return slot;
    });
    if (!normalizedSlots.some((slot: any) => slot.isActivity)) {
      normalizedSlots.push(DEFAULT_TIME_SLOTS.find(slot => slot.id === 'act')!);
      normalizedSlots.sort((a: any, b: any) => a.startTime.localeCompare(b.startTime));
    }
    return normalizedSlots;
  });

  const [days, setDaysState] = useState<DayOfWeek[]>(() => {
    const saved = localStorage.getItem('tt_days');
    return saved ? JSON.parse(saved) : DEFAULT_DAYS;
  });

  const [timetableData, setTimetableData] = useState<TimetableData | null>(() => {
    const saved = localStorage.getItem('tt_timetableData');
    return saved ? JSON.parse(saved) : null;
  });

  const [conflicts, setConflicts] = useState<Conflict[]>(() => {
    const saved = localStorage.getItem('tt_conflicts');
    return saved ? JSON.parse(saved) : [];
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  const [schoolLogo, setSchoolLogoState] = useState<string | null>(() => {
    return localStorage.getItem('tt_schoolLogo');
  });
  
  const [schoolName, setSchoolNameState] = useState<string>(() => {
    return localStorage.getItem('sms_school_name_setting') || localStorage.getItem('tt_schoolName') || 'Springfield Secondary School';
  });

  const setSchoolLogo = (logo: string | null) => {
    setSchoolLogoState(logo);
    if (logo) {
      localStorage.setItem('tt_schoolLogo', logo);
    } else {
      localStorage.removeItem('tt_schoolLogo');
    }
  };

  const setSchoolName = (name: string) => {
    setSchoolNameState(name);
    localStorage.setItem('tt_schoolName', name);
    localStorage.setItem('sms_school_name_setting', name);
  };

  // Persistence
  useEffect(() => { localStorage.setItem('tt_teachers', JSON.stringify(teachers)); }, [teachers]);
  useEffect(() => { localStorage.setItem('tt_subjects', JSON.stringify(subjects)); }, [subjects]);
  useEffect(() => { localStorage.setItem('tt_rooms', JSON.stringify(rooms)); }, [rooms]);
  useEffect(() => { localStorage.setItem('tt_classes', JSON.stringify(classes)); }, [classes]);
  useEffect(() => { localStorage.setItem('tt_classSubjects', JSON.stringify(classSubjects)); }, [classSubjects]);
  useEffect(() => { localStorage.setItem('tt_timeSlots', JSON.stringify(timeSlots)); }, [timeSlots]);
  useEffect(() => { localStorage.setItem('tt_days', JSON.stringify(days)); }, [days]);
  useEffect(() => {
    localStorage.setItem('tt_timetableData', JSON.stringify(timetableData));
    localStorage.setItem('tt_timetableData_ts', String(Date.now()));
    if (cloud.isCloudMode() && timetableData) cloud.syncToCloud().catch(() => {});
    if (timetableData?.schedule) {
      const result = validateSchedule(timetableData.schedule, days, timeSlots, teachers);
      setConflicts(result.conflicts);
      localStorage.setItem('tt_conflicts', JSON.stringify(result.conflicts));
    }
  }, [timetableData, days, timeSlots, teachers]);

  useEffect(() => {
    const reloadTimetable = () => {
      try {
        const saved = localStorage.getItem('tt_timetableData');
        if (saved) setTimetableData(JSON.parse(saved));
      } catch {}
    };
    window.addEventListener('cloud-sync-complete', reloadTimetable);
    window.addEventListener('storage', reloadTimetable);
    return () => {
      window.removeEventListener('cloud-sync-complete', reloadTimetable);
      window.removeEventListener('storage', reloadTimetable);
    };
  }, []);

  // CRUD Implementations
  const addTeacher = (t: Teacher) => setTeachers([...teachers, t]);
  const updateTeacher = (t: Teacher) => setTeachers(teachers.map(x => x.id === t.id ? t : x));
  const deleteTeacher = (id: string) => {
    setTeachers(teachers.filter(x => x.id !== id));
    setClassSubjects(classSubjects.filter(cs => cs.teacherId !== id)); // Cascade delete assignments
  };

  const addSubject = (s: Subject) => setSubjects([...subjects, s]);
  const updateSubject = (s: Subject) => setSubjects(subjects.map(x => x.id === s.id ? s : x));
  const deleteSubject = (id: string) => {
    setSubjects(subjects.filter(x => x.id !== id));
    setClassSubjects(classSubjects.filter(cs => cs.subjectId !== id)); // Cascade
  };

  const addRoom = (r: Room) => setRooms([...rooms, r]);
  const updateRoom = (r: Room) => setRooms(rooms.map(x => x.id === r.id ? r : x));
  const deleteRoom = (id: string) => setRooms(rooms.filter(x => x.id !== id));

  const addClass = (c: SchoolClass) => setClasses([...classes, c]);
  const updateClass = (c: SchoolClass) => setClasses(classes.map(x => x.id === c.id ? c : x));
  const deleteClass = (id: string) => {
    setClasses(classes.filter(x => x.id !== id));
    setClassSubjects(classSubjects.filter(cs => cs.classId !== id)); // Cascade
  };

  const addClassSubject = (cs: ClassSubject) => setClassSubjects([...classSubjects, cs]);
  const updateClassSubject = (cs: ClassSubject) => setClassSubjects(classSubjects.map(x => x.id === cs.id ? cs : x));
  const deleteClassSubject = (id: string) => setClassSubjects(classSubjects.filter(x => x.id !== id));

  const setTimeSlots = (slots: TimeSlot[]) => setTimeSlotsState(slots.map(slot => (
    slot.id === 'act' || slot.isActivity || slot.name.trim().toLowerCase() === 'activity'
      ? { ...slot, isActivity: true, isBreak: false }
      : slot
  )));
  const setDays = (d: DayOfWeek[]) => setDaysState(d);

  // Load / Clear
  const loadDummyData = () => {
    setTeachers(DEFAULT_TEACHERS);
    setSubjects(DEFAULT_SUBJECTS);
    setRooms(DEFAULT_ROOMS);
    setClasses(DEFAULT_CLASSES);
    setClassSubjects(DEFAULT_CLASS_SUBJECTS);
    setTimeSlotsState(DEFAULT_TIME_SLOTS);
    setDaysState(DEFAULT_DAYS);
    setTimetableData(null);
    setConflicts([]);
  };

  const clearAllData = () => {
    setTeachers([]);
    setSubjects([]);
    setRooms([]);
    setClasses([]);
    setClassSubjects([]);
    setTimeSlotsState([]);
    setDaysState([]);
    setTimetableData(null);
    setConflicts([]);
  };

  // Generation
  const triggerGeneration = () => {
    setIsGenerating(true);
    setTimeout(() => {
      try {
        const result = generateSchoolTimetable({
          days,
          timeSlots,
          teachers,
          subjects,
          rooms,
          classes,
          classSubjects
        });
        
        // Validate to get conflicts
        const validation = validateSchedule(result.schedule, days, timeSlots, teachers);
        
        setTimetableData({
          ...result,
          generationStats: {
            ...result.generationStats!,
            conflictsCount: validation.stats.conflictsCount
          }
        });
      } catch (error) {
        console.error('Generation failed:', error);
      } finally {
        setIsGenerating(false);
      }
    }, 800); // Small delay to show generating animation
  };

  // Manual Adjustments
  const updateLessonSlot = (classId: string, day: string, periodId: string, subjectId: string, teacherId: string, roomId: string, metadata: Record<string, any> = {}) => {
    if (!timetableData) return;

    setTimetableData(prev => {
      if (!prev) return null;
      
      const newSchedule = { ...prev.schedule };
      newSchedule[classId] = { ...(newSchedule[classId] || {}) };
      newSchedule[classId][day] = { ...(newSchedule[classId][day] || {}) };
      
      newSchedule[classId][day][periodId] = {
        subjectId,
        teacherId,
        roomId,
        classId,
        ...metadata
      };

      return {
        ...prev,
        schedule: newSchedule
      };
    });
  };

  const removeLessonSlot = (classId: string, day: string, periodId: string) => {
    if (!timetableData) return;

    const cell = timetableData.schedule[classId]?.[day]?.[periodId];
    if (!cell) return;

    setTimetableData(prev => {
      if (!prev) return null;
      const newSchedule = { ...prev.schedule };
      
      delete newSchedule[classId][day][periodId];

      // Add back to unscheduled list
      const unscheduled = [...prev.unscheduled];
      const existing = unscheduled.find(u => u.classId === classId && u.subjectId === cell.subjectId && u.teacherId === cell.teacherId);
      
      if (existing) {
        existing.periodsLeft++;
      } else {
        unscheduled.push({
          id: `un_${classId}_${cell.subjectId}_${Date.now()}`,
          classId,
          subjectId: cell.subjectId,
          teacherId: cell.teacherId,
          periodsLeft: 1
        });
      }

      return {
        ...prev,
        schedule: newSchedule,
        unscheduled
      };
    });
  };

  const scheduleUnscheduledLesson = (unscheduledId: string, classId: string, day: string, periodId: string, roomId: string) => {
    if (!timetableData) return;

    const un = timetableData.unscheduled.find(u => u.id === unscheduledId);
    if (!un) return;

    setTimetableData(prev => {
      if (!prev) return null;
      
      const newSchedule = { ...prev.schedule };
      if (!newSchedule[classId]) newSchedule[classId] = {};
      if (!newSchedule[classId][day]) newSchedule[classId][day] = {};
      
      newSchedule[classId][day][periodId] = {
        subjectId: un.subjectId,
        teacherId: un.teacherId,
        roomId,
        classId
      };

      // Reduce periodsLeft in unscheduled
      const newUnscheduled = prev.unscheduled.map(u => {
        if (u.id === unscheduledId) {
          return { ...u, periodsLeft: u.periodsLeft - 1 };
        }
        return u;
      }).filter(u => u.periodsLeft > 0);

      return {
        ...prev,
        schedule: newSchedule,
        unscheduled: newUnscheduled
      };
    });
  };

  return (
    <TimetableContext.Provider value={{
      teachers, subjects, rooms, classes, classSubjects, timeSlots, days, timetableData, conflicts, isGenerating, activeTab, setActiveTab,
      schoolLogo, setSchoolLogo, schoolName, setSchoolName,
      addTeacher, updateTeacher, deleteTeacher,
      addSubject, updateSubject, deleteSubject,
      addRoom, updateRoom, deleteRoom,
      addClass, updateClass, deleteClass,
      addClassSubject, updateClassSubject, deleteClassSubject,
      setTimeSlots, setDays,
      triggerGeneration, updateLessonSlot, removeLessonSlot, scheduleUnscheduledLesson,
      loadDummyData, clearAllData
    }}>
      {children}
    </TimetableContext.Provider>
  );
};
