import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Subject, Teacher, Room, SchoolClass, ClassSubject, TimeSlot, DayOfWeek, TimetableData, Conflict } from '../types';
import { DEFAULT_DAYS, DEFAULT_TIME_SLOTS, DEFAULT_SUBJECTS, DEFAULT_ROOMS, DEFAULT_TEACHERS, DEFAULT_CLASSES, DEFAULT_CLASS_SUBJECTS } from '../utils/dummyData';
import { generateSchoolTimetable, validateSchedule } from '../utils/scheduler';

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
  updateLessonSlot: (classId: string, day: string, periodId: string, subjectId: string, teacherId: string, roomId: string) => void;
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
  const [teachers, setTeachers] = useState<Teacher[]>(() => {
    const saved = localStorage.getItem('tt_teachers');
    return saved ? JSON.parse(saved) : DEFAULT_TEACHERS;
  });

  const [subjects, setSubjects] = useState<Subject[]>(() => {
    const saved = localStorage.getItem('tt_subjects');
    return saved ? JSON.parse(saved) : DEFAULT_SUBJECTS;
  });

  const [rooms, setRooms] = useState<Room[]>(() => {
    const saved = localStorage.getItem('tt_rooms');
    return saved ? JSON.parse(saved) : DEFAULT_ROOMS;
  });

  const [classes, setClasses] = useState<SchoolClass[]>(() => {
    const saved = localStorage.getItem('tt_classes');
    return saved ? JSON.parse(saved) : DEFAULT_CLASSES;
  });

  const [classSubjects, setClassSubjects] = useState<ClassSubject[]>(() => {
    const saved = localStorage.getItem('tt_classSubjects');
    return saved ? JSON.parse(saved) : DEFAULT_CLASS_SUBJECTS;
  });

  const [timeSlots, setTimeSlotsState] = useState<TimeSlot[]>(() => {
    const saved = localStorage.getItem('tt_timeSlots');
    return saved ? JSON.parse(saved) : DEFAULT_TIME_SLOTS;
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
    return localStorage.getItem('tt_schoolName') || 'Springfield Secondary School';
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
    if (timetableData?.schedule) {
      const result = validateSchedule(timetableData.schedule, days, timeSlots, teachers);
      setConflicts(result.conflicts);
      localStorage.setItem('tt_conflicts', JSON.stringify(result.conflicts));
    }
  }, [timetableData, days, timeSlots, teachers]);

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

  const setTimeSlots = (slots: TimeSlot[]) => setTimeSlotsState(slots);
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
  const updateLessonSlot = (classId: string, day: string, periodId: string, subjectId: string, teacherId: string, roomId: string) => {
    if (!timetableData) return;

    setTimetableData(prev => {
      if (!prev) return null;
      
      const newSchedule = { ...prev.schedule };
      if (!newSchedule[classId]) newSchedule[classId] = {};
      if (!newSchedule[classId][day]) newSchedule[classId][day] = {};
      
      newSchedule[classId][day][periodId] = {
        subjectId,
        teacherId,
        roomId,
        classId
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
