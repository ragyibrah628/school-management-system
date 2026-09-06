export interface Subject {
  id: string;
  name: string;
  code: string;
  color: string; // Tailwind color class for timetable visualization
  requiresRoomType:
    | 'regular'
    | 'lab'
    | 'biology_lab'
    | 'physics_lab'
    | 'chemistry_lab'
    | 'gym'
    | 'computer_lab'
    | 'art_studio'
    | 'music_room';
}

export interface Teacher {
  id: string;
  name: string;
  email: string;
  maxPeriodsPerWeek: number;
  qualifiedSubjects: string[]; // Subject IDs
  unavailableSlots: { day: string; periodId: string }[]; // Specific slots the teacher can't teach
}

export interface Room {
  id: string;
  name: string;
  type:
    | 'regular'
    | 'lab'
    | 'biology_lab'
    | 'physics_lab'
    | 'chemistry_lab'
    | 'gym'
    | 'computer_lab'
    | 'art_studio'
    | 'music_room';
  capacity: number;
}

export interface SchoolClass {
  id: string;
  name: string;
  grade: number;
  roomType: 'regular'; // Main classroom
  assignedRoomId?: string; // Optional dedicated classroom
}

export interface ClassSubject {
  id: string;
  classId: string;
  subjectId: string;
  teacherId: string; // The specific teacher assigned for this class & subject
  periodsPerWeek: number;
  isDoublePeriod?: boolean; // Prefers being scheduled as two consecutive periods
}

export interface TimeSlot {
  id: string;
  name: string; // e.g. "Period 1", "Recess", "Period 5", "Lunch"
  startTime: string; // e.g. "08:30"
  endTime: string; // e.g. "09:15"
  isBreak: boolean;
  isActivity?: boolean;
}

export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

export interface TimetableCell {
  subjectId: string;
  teacherId: string;
  roomId: string;
  classId: string;
}

export interface TimetableData {
  // Nested structure: [classId][day][periodId] -> TimetableCell
  schedule: {
    [classId: string]: {
      [day: string]: {
        [periodId: string]: TimetableCell;
      };
    };
  };
  unscheduled: {
    id: string;
    classId: string;
    subjectId: string;
    teacherId: string;
    periodsLeft: number;
  }[];
  generationStats?: {
    totalLessons: number;
    scheduledLessons: number;
    unplacedLessons: number;
    executionTime: number;
    conflictsCount: number;
  };
}

export interface Conflict {
  id: string;
  type: 'teacher_double_booking' | 'room_double_booking' | 'teacher_unavailable' | 'max_hours_exceeded' | 'class_double_booking';
  description: string;
  severity: 'error' | 'warning';
  entityIds: string[]; // IDs of teachers, rooms, classes involved
  slot: { day: string; periodId: string };
}
