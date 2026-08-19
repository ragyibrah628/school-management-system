import { Subject, Teacher, Room, SchoolClass, ClassSubject, TimeSlot, DayOfWeek } from '../types';

export const DEFAULT_DAYS: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

export const DEFAULT_TIME_SLOTS: TimeSlot[] = [
  // ✅ NAMBWALA SECONDARY - 40 min per period, Break 10:40-11:10, Lunch 14:30-15:30, Activity 15:30-17:30
  { id: 'p1', name: 'Kipindi 1', startTime: '08:00', endTime: '08:40', isBreak: false },
  { id: 'p2', name: 'Kipindi 2', startTime: '08:40', endTime: '09:20', isBreak: false },
  { id: 'p3', name: 'Kipindi 3', startTime: '09:20', endTime: '10:00', isBreak: false },
  { id: 'p4', name: 'Kipindi 4', startTime: '10:00', endTime: '10:40', isBreak: false },
  { id: 'b1', name: 'Mapumziko', startTime: '10:40', endTime: '11:10', isBreak: true },
  { id: 'p5', name: 'Kipindi 5', startTime: '11:10', endTime: '11:50', isBreak: false },
  { id: 'p6', name: 'Kipindi 6', startTime: '11:50', endTime: '12:30', isBreak: false },
  { id: 'p7', name: 'Kipindi 7', startTime: '12:30', endTime: '13:10', isBreak: false },
  { id: 'p8', name: 'Kipindi 8', startTime: '13:10', endTime: '13:50', isBreak: false },
  { id: 'p9', name: 'Kipindi 9', startTime: '13:50', endTime: '14:30', isBreak: false },
  { id: 'lunch', name: 'Chakula cha Mchana', startTime: '14:30', endTime: '15:30', isBreak: true },
  { id: 'act', name: 'Shughuli', startTime: '15:30', endTime: '17:30', isBreak: false },
];

export const DEFAULT_SUBJECTS: Subject[] = [
  { id: 's1', name: 'Mathematics', code: 'MATH', color: 'bg-blue-100 border-blue-400 text-blue-800 hover:bg-blue-200', requiresRoomType: 'regular' },
  { id: 's2', name: 'English Language', code: 'ENG', color: 'bg-emerald-100 border-emerald-400 text-emerald-800 hover:bg-emerald-200', requiresRoomType: 'regular' },
  { id: 's3', name: 'Biology', code: 'BIO', color: 'bg-green-100 border-green-400 text-green-800 hover:bg-green-200', requiresRoomType: 'lab' },
  { id: 's4', name: 'Chemistry', code: 'CHEM', color: 'bg-teal-100 border-teal-400 text-teal-800 hover:bg-teal-200', requiresRoomType: 'lab' },
  { id: 's5', name: 'Physics', code: 'PHYS', color: 'bg-purple-100 border-purple-400 text-purple-800 hover:bg-purple-200', requiresRoomType: 'lab' },
  { id: 's6', name: 'World History', code: 'HIST', color: 'bg-orange-100 border-orange-400 text-orange-800 hover:bg-orange-200', requiresRoomType: 'regular' },
  { id: 's7', name: 'Geography', code: 'GEO', color: 'bg-amber-100 border-amber-400 text-amber-800 hover:bg-amber-200', requiresRoomType: 'regular' },
  { id: 's8', name: 'Physical Education', code: 'PE', color: 'bg-rose-100 border-rose-400 text-rose-800 hover:bg-rose-200', requiresRoomType: 'gym' },
  { id: 's9', name: 'Fine Arts', code: 'ART', color: 'bg-pink-100 border-pink-400 text-pink-800 hover:bg-pink-200', requiresRoomType: 'art_studio' },
  { id: 's10', name: 'Computer Science', code: 'CS', color: 'bg-cyan-100 border-cyan-400 text-cyan-800 hover:bg-cyan-200', requiresRoomType: 'computer_lab' },
  { id: 's11', name: 'Literature', code: 'LIT', color: 'bg-indigo-100 border-indigo-400 text-indigo-800 hover:bg-indigo-200', requiresRoomType: 'regular' },
  { id: 's12', name: 'Music', code: 'MUS', color: 'bg-violet-100 border-violet-400 text-violet-800 hover:bg-violet-200', requiresRoomType: 'music_room' }
];

export const DEFAULT_ROOMS: Room[] = [
  { id: 'r1', name: 'Classroom 101', type: 'regular', capacity: 30 },
  { id: 'r2', name: 'Classroom 102', type: 'regular', capacity: 30 },
  { id: 'r3', name: 'Classroom 201', type: 'regular', capacity: 32 },
  { id: 'r4', name: 'Classroom 202', type: 'regular', capacity: 32 },
  { id: 'r5', name: 'Classroom 301', type: 'regular', capacity: 28 },
  { id: 'r6', name: 'Classroom 302', type: 'regular', capacity: 28 },
  { id: 'r7', name: 'Science Lab A', type: 'lab', capacity: 24 },
  { id: 'r8', name: 'Science Lab B', type: 'lab', capacity: 24 },
  { id: 'r13', name: 'Biology Lab 1', type: 'biology_lab', capacity: 24 },
  { id: 'r14', name: 'Physics Lab 1', type: 'physics_lab', capacity: 24 },
  { id: 'r15', name: 'Chemistry Lab 1', type: 'chemistry_lab', capacity: 24 },
  { id: 'r9', name: 'Main Gymnasium', type: 'gym', capacity: 50 },
  { id: 'r10', name: 'Computer Lab 1', type: 'computer_lab', capacity: 30 },
  { id: 'r11', name: 'Art Studio', type: 'art_studio', capacity: 20 },
  { id: 'r12', name: 'Music Room', type: 'music_room', capacity: 25 },
];

export const DEFAULT_TEACHERS: Teacher[] = [
  { id: 't1', name: 'Dr. John Smith', email: 'j.smith@school.edu', maxPeriodsPerWeek: 25, qualifiedSubjects: ['s1', 's10'], unavailableSlots: [{ day: 'Wednesday', periodId: 'p7' }, { day: 'Wednesday', periodId: 'p8' }] },
  { id: 't2', name: 'Ms. Sarah Jones', email: 's.jones@school.edu', maxPeriodsPerWeek: 22, qualifiedSubjects: ['s2', 's11'], unavailableSlots: [{ day: 'Monday', periodId: 'p1' }] },
  { id: 't3', name: 'Mr. Robert Brown', email: 'r.brown@school.edu', maxPeriodsPerWeek: 25, qualifiedSubjects: ['s3', 's4', 's5'], unavailableSlots: [] },
  { id: 't4', name: 'Mrs. Emily Davis', email: 'e.davis@school.edu', maxPeriodsPerWeek: 20, qualifiedSubjects: ['s6', 's7'], unavailableSlots: [{ day: 'Friday', periodId: 'p5' }, { day: 'Friday', periodId: 'p6' }, { day: 'Friday', periodId: 'p7' }, { day: 'Friday', periodId: 'p8' }] },
  { id: 't5', name: 'Coach Mike Wilson', email: 'm.wilson@school.edu', maxPeriodsPerWeek: 28, qualifiedSubjects: ['s8'], unavailableSlots: [] },
  { id: 't6', name: 'Ms. Jessica Taylor', email: 'j.taylor@school.edu', maxPeriodsPerWeek: 20, qualifiedSubjects: ['s9', 's12'], unavailableSlots: [] },
  { id: 't7', name: 'Mr. David Miller', email: 'd.miller@school.edu', maxPeriodsPerWeek: 25, qualifiedSubjects: ['s1', 's5'], unavailableSlots: [] },
  { id: 't8', name: 'Mrs. Lisa Anderson', email: 'l.anderson@school.edu', maxPeriodsPerWeek: 24, qualifiedSubjects: ['s2', 's6'], unavailableSlots: [] },
  { id: 't9', name: 'Dr. Richard Thomas', email: 'r.thomas@school.edu', maxPeriodsPerWeek: 25, qualifiedSubjects: ['s3', 's4'], unavailableSlots: [] },
  { id: 't10', name: 'Ms. Karen White', email: 'k.white@school.edu', maxPeriodsPerWeek: 22, qualifiedSubjects: ['s7', 's10', 's11'], unavailableSlots: [] },
];

export const DEFAULT_CLASSES: SchoolClass[] = [
  { id: 'c1', name: 'Grade 9A', grade: 9, roomType: 'regular', assignedRoomId: 'r1' },
  { id: 'c2', name: 'Grade 9B', grade: 9, roomType: 'regular', assignedRoomId: 'r2' },
  { id: 'c3', name: 'Grade 10A', grade: 10, roomType: 'regular', assignedRoomId: 'r3' },
  { id: 'c4', name: 'Grade 10B', grade: 10, roomType: 'regular', assignedRoomId: 'r4' },
  { id: 'c5', name: 'Grade 11A', grade: 11, roomType: 'regular', assignedRoomId: 'r5' },
  { id: 'c6', name: 'Grade 11B', grade: 11, roomType: 'regular', assignedRoomId: 'r6' },
];

// Helper to generate class subject links
export const generateDefaultClassSubjects = (): ClassSubject[] => {
  const classSubjects: ClassSubject[] = [];
  let idCounter = 1;

  // Configuration for subjects and required weekly periods
  const subjectConfigs = [
    { subjectId: 's1', periods: 5, teacherIds: ['t1', 't7'] }, // Math: 5 periods
    { subjectId: 's2', periods: 5, teacherIds: ['t2', 't8'] }, // English: 5 periods
    { subjectId: 's3', periods: 3, teacherIds: ['t3', 't9'] }, // Biology: 3 periods
    { subjectId: 's4', periods: 3, teacherIds: ['t3', 't9'] }, // Chemistry: 3 periods
    { subjectId: 's5', periods: 3, teacherIds: ['t7', 't3'] }, // Physics: 3 periods
    { subjectId: 's6', periods: 3, teacherIds: ['t4', 't8'] }, // History: 3 periods
    { subjectId: 's7', periods: 2, teacherIds: ['t4', 't10'] }, // Geography: 2 periods
    { subjectId: 's8', periods: 3, teacherIds: ['t5'] },       // PE: 3 periods
    { subjectId: 's9', periods: 2, teacherIds: ['t6'] },       // Art: 2 periods
    { subjectId: 's10', periods: 2, teacherIds: ['t1', 't10'] }, // CS: 2 periods
    { subjectId: 's11', periods: 2, teacherIds: ['t2', 't10'] }, // Literature: 2 periods
    { subjectId: 's12', periods: 2, teacherIds: ['t6'] }        // Music: 2 periods
  ];

  // Total periods: 5+5+3+3+3+3+2+3+2+2+2+2 = 35 periods per week.
  // With 8 periods per day, 5 days = 40 total slots. So each class will have 35 active periods, and 5 free periods (or study halls).
  // Wait, or we can make it a dense 40 periods! Let's increase some periods or leave 5 study halls. Let's add 2 periods of Study Hall or something, or just increase Core subjects.
  // Let's do: Math (5), English (5), Bio (4), Chem (4), Phys (4), Hist (4), Geo (3), PE (3), Art (2), CS (3), Lit (2), Mus (1). Total: 5+5+4+4+4+4+3+3+2+3+2+1 = 40.

  DEFAULT_CLASSES.forEach((cls, classIndex) => {
    subjectConfigs.forEach((config, subjectIndex) => {
      // Rotate teachers among classes to distribute load
      const teacherIndex = (classIndex + subjectIndex) % config.teacherIds.length;
      const teacherId = config.teacherIds[teacherIndex];
      
      let periods = config.periods;
      // Adjust some periods slightly so it varies a bit
      if (cls.grade === 11 && config.subjectId === 's3') periods = 4; // Grade 11 gets more Science
      if (cls.grade === 9 && config.subjectId === 's12') periods = 2; // Grade 9 gets more Music

      classSubjects.push({
        id: `cs_${idCounter++}`,
        classId: cls.id,
        subjectId: config.subjectId,
        teacherId: teacherId,
        periodsPerWeek: periods,
        isDoublePeriod: config.subjectId === 's3' || config.subjectId === 's4' || config.subjectId === 's5' || config.subjectId === 's8'
      });
    });
  });

  return classSubjects;
};

export const DEFAULT_CLASS_SUBJECTS = generateDefaultClassSubjects();
