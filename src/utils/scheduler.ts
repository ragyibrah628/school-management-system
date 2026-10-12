import { Subject, Teacher, Room, SchoolClass, ClassSubject, TimeSlot, TimetableData, DayOfWeek } from '../types';

export function getTeacherOccupiedSlots(cell: any, periodId: string, timeSlots: TimeSlot[]): string[] {
  const slotIndex = timeSlots.findIndex(slot => slot.id === periodId);
  const currentSlot = timeSlots[slotIndex];
  const isActivitySlot = (slot: TimeSlot | undefined) => Boolean(
    slot?.isActivity || slot?.id === 'act' || slot?.name?.trim().toLowerCase() === 'activity'
  );
  if (!currentSlot || currentSlot.isBreak || isActivitySlot(currentSlot)) return [];
  if (!cell?.isDouble || cell.isDoubleSpan) return [periodId];

  const nextSlot = timeSlots[slotIndex + 1];
  if (!nextSlot || nextSlot.isBreak || isActivitySlot(nextSlot)) return [periodId];
  return [periodId, nextSlot.id];
}

export interface SchedulerOptions {
  days: DayOfWeek[];
  timeSlots: TimeSlot[];
  teachers: Teacher[];
  subjects: Subject[];
  rooms: Room[];
  classes: SchoolClass[];
  classSubjects: ClassSubject[];
}

export function generateSchoolTimetable({
  days,
  timeSlots,
  teachers,
  subjects,
  rooms,
  classes,
  classSubjects
}: SchedulerOptions): TimetableData {
  const startTime = performance.now();

  // 1. Setup schedule data structure
  const schedule: TimetableData['schedule'] = {};
  classes.forEach(cls => {
    schedule[cls.id] = {};
    days.forEach(day => {
      schedule[cls.id][day] = {};
    });
  });

  const activePeriods = timeSlots.filter(s => !s.isBreak && !(s as any).isActivity);
  const periodIds = activePeriods.map(p => p.id);

  // 2. Occupancy trackers
  const occupiedClasses: { [classId: string]: { [day: string]: { [periodId: string]: boolean } } } = {};
  const occupiedTeachers: { [teacherId: string]: { [day: string]: { [periodId: string]: boolean } } } = {};
  const occupiedRooms: { [roomId: string]: { [day: string]: { [periodId: string]: boolean } } } = {};
  
  classes.forEach(c => {
    occupiedClasses[c.id] = {};
    days.forEach(d => {
      occupiedClasses[c.id][d] = {};
    });
  });

  teachers.forEach(t => {
    occupiedTeachers[t.id] = {};
    days.forEach(d => {
      occupiedTeachers[t.id][d] = {};
      // Mark unavailable slots
      t.unavailableSlots.forEach(slot => {
        if (slot.day === d) {
          occupiedTeachers[t.id][d][slot.periodId] = true;
        }
      });
    });
  });

  rooms.forEach(r => {
    occupiedRooms[r.id] = {};
    days.forEach(d => {
      occupiedRooms[r.id][d] = {};
    });
  });

  // Track teacher weekly workload
  const teacherLoad: { [teacherId: string]: number } = {};
  teachers.forEach(t => {
    teacherLoad[t.id] = 0;
  });

  // Track how many times a subject occurs for a class on a given day
  const classSubjectDayCount: { [classId: string]: { [subjectId: string]: { [day: string]: number } } } = {};
  classes.forEach(c => {
    classSubjectDayCount[c.id] = {};
    subjects.forEach(s => {
      classSubjectDayCount[c.id][s.id] = {};
      days.forEach(d => {
        classSubjectDayCount[c.id][s.id][d] = 0;
      });
    });
  });

  // Track teacher periods per day for balancing
  const teacherDayLoad: { [teacherId: string]: { [day: string]: number } } = {};
  teachers.forEach(t => {
    teacherDayLoad[t.id] = {};
    days.forEach(d => {
      teacherDayLoad[t.id][d] = 0;
    });
  });

  // Calculate ideal periods per day for each teacher
  const teacherIdealPerDay: { [teacherId: string]: number } = {};
  teachers.forEach(t => {
    const totalPeriods = classSubjects.filter(cs => cs.teacherId === t.id).reduce((sum, cs) => sum + cs.periodsPerWeek, 0);
    teacherIdealPerDay[t.id] = totalPeriods / days.length;
  });

  // 3. Define valid consecutive periods using the same occupied-slot rule as validation.
  const consecutivePeriods: { period1: string; period2: string }[] = [];
  for (const slot of timeSlots) {
    const occupiedSlots = getTeacherOccupiedSlots({ isDouble: true }, slot.id, timeSlots);
    if (occupiedSlots.length === 2) {
      consecutivePeriods.push({ period1: occupiedSlots[0], period2: occupiedSlots[1] });
    }
  }

  // 4. Create the pool of lessons to schedule
  interface LessonItem {
    id: string;
    classSubjectId: string;
    classId: string;
    subjectId: string;
    teacherId: string;
    isDoublePreferred: boolean;
    requiresRoomType: string;
    priorityScore: number;
  }

  const lessonPool: LessonItem[] = [];

  classSubjects.forEach(cs => {
    const subject = subjects.find(s => s.id === cs.subjectId);
    const teacher = teachers.find(t => t.id === cs.teacherId);
    
    if (!subject || !teacher) return; // Invalid reference

    // Calculate a heuristic priority score
    // Higher score means harder to schedule, so schedule it FIRST
    let priorityScore = 0;
    
    // Subjects requiring special rooms have higher priority
    if (subject.requiresRoomType !== 'regular') {
      priorityScore += 30;
    }
    
    // Teachers with limited availability or high load have higher priority
    const unavailableCount = teacher.unavailableSlots.length;
    priorityScore += unavailableCount * 2;
    
    // Teachers with high total hours
    priorityScore += cs.periodsPerWeek;
    
    // If double period preferred
    if (cs.isDoublePeriod) {
      priorityScore += 10;
    }

    const totalPeriods = cs.periodsPerWeek;
    let periodsCreated = 0;

    // Create double periods first
    if (cs.isDoublePeriod) {
      const doubleCount = Math.floor(totalPeriods / 2);
      for (let k = 0; k < doubleCount; k++) {
        lessonPool.push({
          id: `${cs.id}_d_${k}`,
          classSubjectId: cs.id,
          classId: cs.classId,
          subjectId: cs.subjectId,
          teacherId: cs.teacherId,
          isDoublePreferred: true,
          requiresRoomType: subject.requiresRoomType,
          priorityScore: priorityScore + 5 // slightly higher priority for double periods
        });
        periodsCreated += 2;
      }
    }

    // Single periods for the rest
    const singlesCount = totalPeriods - periodsCreated;
    for (let k = 0; k < singlesCount; k++) {
      lessonPool.push({
        id: `${cs.id}_s_${k}`,
        classSubjectId: cs.id,
        classId: cs.classId,
        subjectId: cs.subjectId,
        teacherId: cs.teacherId,
        isDoublePreferred: false,
        requiresRoomType: subject.requiresRoomType,
        priorityScore: priorityScore
      });
    }
  });

  // Sort lesson pool: highest priority score first
  lessonPool.sort((a, b) => b.priorityScore - a.priorityScore);

  const unscheduled: TimetableData['unscheduled'] = [];
  let scheduledCount = 0;
  const totalLessonsCount = lessonPool.reduce((acc, l) => acc + (l.isDoublePreferred ? 2 : 1), 0);

  // Helper to find available rooms of a specific type
  const getAvailableRooms = (type: string, d: string, pId: string): Room[] => {
    return rooms.filter(r => r.type === type && !occupiedRooms[r.id][d][pId]);
  };

  const getAvailableRoomsDouble = (type: string, d: string, p1: string, p2: string): Room[] => {
    return rooms.filter(r => r.type === type && !occupiedRooms[r.id][d][p1] && !occupiedRooms[r.id][d][p2]);
  };

  // Helper to place a single lesson
  const placeSingleLesson = (lesson: LessonItem): boolean => {
    let bestSlot: { day: string; periodId: string; roomId: string; score: number } | null = null;

    // Iterate through all slots to find the best one
    for (const d of days) {
      for (const pId of periodIds) {
        // 1. Check if class, teacher, and room type are available
        if (occupiedClasses[lesson.classId][d][pId]) continue;
        if (occupiedTeachers[lesson.teacherId][d][pId]) continue;
        if (teacherLoad[lesson.teacherId] >= (teachers.find(t => t.id === lesson.teacherId)?.maxPeriodsPerWeek || 40)) continue;

        // Check if there is an available room
        const schoolClass = classes.find(c => c.id === lesson.classId);
        let selectedRoomId = '';

        if (lesson.requiresRoomType === 'regular') {
          // Try to use assigned classroom first
          if (schoolClass?.assignedRoomId && occupiedRooms[schoolClass.assignedRoomId] && !occupiedRooms[schoolClass.assignedRoomId][d][pId]) {
            selectedRoomId = schoolClass.assignedRoomId;
          } else {
            // Find any regular room
            const availRegular = getAvailableRooms('regular', d, pId);
            if (availRegular.length > 0) {
              selectedRoomId = availRegular[0].id;
            }
          }
        } else {
          // Find specific room type
          const availSpecial = getAvailableRooms(lesson.requiresRoomType, d, pId);
          if (availSpecial.length > 0) {
            selectedRoomId = availSpecial[0].id;
          }
        }

        if (!selectedRoomId) continue; // No room available

        // 2. Calculate slot score (Heuristics)
        let score = 100;

        // HEURISTIC A: Spread subjects across days. Penalize if class has this subject already on this day
        const dayCount = classSubjectDayCount[lesson.classId][lesson.subjectId][d];
        if (dayCount > 0) {
          score -= dayCount * 40; // Heavy penalty
        }

        // HEURISTIC B: BALANCE TEACHER LOAD ACROSS DAYS
        // Strongly prefer days where teacher has fewer periods
        const teacherPeriodsToday = teacherDayLoad[lesson.teacherId]?.[d] || 0;
        const idealPerDay = teacherIdealPerDay[lesson.teacherId] || 4;
        
        // Find teacher's minimum load day
        const teacherMinLoad = Math.min(...days.map(day => teacherDayLoad[lesson.teacherId]?.[day] || 0));
        
        // Heavy penalty if this day already has more than minimum
        if (teacherPeriodsToday > teacherMinLoad) {
          score -= (teacherPeriodsToday - teacherMinLoad) * 30; // Strong balancing force
        }
        
        // Extra penalty if this day exceeds ideal
        if (teacherPeriodsToday >= idealPerDay + 1) {
          score -= 50; // Very heavy penalty for overloaded days
        }
        
        // Bonus for days with zero periods (spread teacher across all days)
        if (teacherPeriodsToday === 0) {
          score += 25; // Bonus to fill empty days first
        }

        // HEURISTIC C: Prefer earlier periods for tidier timetable
        const periodIndex = periodIds.indexOf(pId);
        score += (activePeriods.length - periodIndex); // Earlier is slightly better

        if (bestSlot === null || score > bestSlot.score) {
          bestSlot = { day: d, periodId: pId, roomId: selectedRoomId, score: score };
        }
      }
    }

    if (bestSlot) {
      // Record in schedule
      const { day, periodId, roomId } = bestSlot;
      schedule[lesson.classId][day][periodId] = {
        subjectId: lesson.subjectId,
        teacherId: lesson.teacherId,
        roomId: roomId,
        classId: lesson.classId,
        isDouble: false
      };

      // Mark occupied
      occupiedClasses[lesson.classId][day][periodId] = true;
      getTeacherOccupiedSlots(schedule[lesson.classId][day][periodId], periodId, timeSlots)
        .forEach(occupiedPeriodId => { occupiedTeachers[lesson.teacherId][day][occupiedPeriodId] = true; });
      occupiedRooms[roomId][day][periodId] = true;

      // Update counters
      teacherLoad[lesson.teacherId]++;
      classSubjectDayCount[lesson.classId][lesson.subjectId][day]++;
      if (teacherDayLoad[lesson.teacherId]) teacherDayLoad[lesson.teacherId][day]++;
      scheduledCount++;

      return true;
    }

    return false;
  };

  // Helper to place a double lesson
  const placeDoubleLesson = (lesson: LessonItem): boolean => {
    let bestSlot: { day: string; p1: string; p2: string; roomId: string; score: number } | null = null;

    for (const d of days) {
      for (const pair of consecutivePeriods) {
        const occupiedSlots = getTeacherOccupiedSlots({ isDouble: true }, pair.period1, timeSlots);
        if (occupiedSlots.length !== 2 || occupiedSlots[1] !== pair.period2) continue;
        const [p1, p2] = occupiedSlots;

        // Check availability for BOTH periods
        if (occupiedClasses[lesson.classId][d][p1] || occupiedClasses[lesson.classId][d][p2]) continue;
        if (occupiedTeachers[lesson.teacherId][d][p1] || occupiedTeachers[lesson.teacherId][d][p2]) continue;
        if (teacherLoad[lesson.teacherId] + 2 > (teachers.find(t => t.id === lesson.teacherId)?.maxPeriodsPerWeek || 40)) continue;

        const schoolClass = classes.find(c => c.id === lesson.classId);
        let selectedRoomId = '';

        if (lesson.requiresRoomType === 'regular') {
          if (schoolClass?.assignedRoomId && occupiedRooms[schoolClass.assignedRoomId] && !occupiedRooms[schoolClass.assignedRoomId][d][p1] && !occupiedRooms[schoolClass.assignedRoomId][d][p2]) {
            selectedRoomId = schoolClass.assignedRoomId;
          } else {
            const availRegular = getAvailableRoomsDouble('regular', d, p1, p2);
            if (availRegular.length > 0) selectedRoomId = availRegular[0].id;
          }
        } else {
          const availSpecial = getAvailableRoomsDouble(lesson.requiresRoomType, d, p1, p2);
          if (availSpecial.length > 0) selectedRoomId = availSpecial[0].id;
        }

        if (!selectedRoomId) continue;

        // Heuristics for double periods
        let score = 100;
        const dayCount = classSubjectDayCount[lesson.classId][lesson.subjectId][d];
        if (dayCount > 0) score -= dayCount * 40;

        // Balance teacher load for double periods too
        const tLoadToday = teacherDayLoad[lesson.teacherId]?.[d] || 0;
        const tMinLoad = Math.min(...days.map(day => teacherDayLoad[lesson.teacherId]?.[day] || 0));
        if (tLoadToday > tMinLoad) score -= (tLoadToday - tMinLoad) * 25;
        if (tLoadToday === 0) score += 20;

        if (bestSlot === null || score > bestSlot.score) {
          bestSlot = { day: d, p1: p1, p2: p2, roomId: selectedRoomId, score: score };
        }
      }
    }

    if (bestSlot) {
      const { day, p1, p2, roomId } = bestSlot;

      // Schedule Period 1
      schedule[lesson.classId][day][p1] = {
        subjectId: lesson.subjectId,
        teacherId: lesson.teacherId,
        roomId: roomId,
        classId: lesson.classId,
        isDouble: true
      };
      occupiedClasses[lesson.classId][day][p1] = true;
      occupiedRooms[roomId][day][p1] = true;

      // Schedule Period 2
      schedule[lesson.classId][day][p2] = {
        subjectId: lesson.subjectId,
        teacherId: lesson.teacherId,
        roomId: roomId,
        classId: lesson.classId,
        isDouble: true,
        isDoubleSpan: true
      };
      occupiedClasses[lesson.classId][day][p2] = true;
      occupiedRooms[roomId][day][p2] = true;
      getTeacherOccupiedSlots(schedule[lesson.classId][day][p1], p1, timeSlots)
        .forEach(occupiedPeriodId => { occupiedTeachers[lesson.teacherId][day][occupiedPeriodId] = true; });

      // Update counters
      teacherLoad[lesson.teacherId] += 2;
      classSubjectDayCount[lesson.classId][lesson.subjectId][day] += 2;
      if (teacherDayLoad[lesson.teacherId]) teacherDayLoad[lesson.teacherId][day] += 2;
      scheduledCount += 2;

      return true;
    }

      return false;
  };

  // 5. Main scheduling loop
  for (const lesson of lessonPool) {
    if (lesson.isDoublePreferred) {
      const success = placeDoubleLesson(lesson);
      if (!success) {
        // Double period failed, let's try to schedule as TWO separate singles
        // If that also fails, add to unscheduled list
        const s1Placed = placeSingleLesson({ ...lesson, isDoublePreferred: false, id: `${lesson.id}_split_1` });
        const s2Placed = placeSingleLesson({ ...lesson, isDoublePreferred: false, id: `${lesson.id}_split_2` });

        if (!s1Placed) {
          addUnscheduled(lesson.classId, lesson.subjectId, lesson.teacherId, 1);
        }
        if (!s2Placed) {
          addUnscheduled(lesson.classId, lesson.subjectId, lesson.teacherId, 1);
        }
      }
    } else {
      const success = placeSingleLesson(lesson);
      if (!success) {
        addUnscheduled(lesson.classId, lesson.subjectId, lesson.teacherId, 1);
      }
    }
  }

  function addUnscheduled(classId: string, subjectId: string, teacherId: string, count: number) {
    const existing = unscheduled.find(u => u.classId === classId && u.subjectId === subjectId && u.teacherId === teacherId);
    if (existing) {
      existing.periodsLeft += count;
    } else {
      unscheduled.push({
        id: `un_${classId}_${subjectId}_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        classId,
        subjectId,
        teacherId,
        periodsLeft: count
      });
    }
  }

  const endTime = performance.now();
  const executionTime = Math.round(endTime - startTime);

  // 6. Return TimetableData
  return {
    schedule,
    unscheduled,
    generationStats: {
      totalLessons: totalLessonsCount,
      scheduledLessons: scheduledCount,
      unplacedLessons: totalLessonsCount - scheduledCount,
      executionTime,
      conflictsCount: 0 // Will compute conflicts after if we allow manual modifications
    }
  };
}

// Function to find all conflicts in the current schedule
export function validateSchedule(
  schedule: TimetableData['schedule'],
  days: DayOfWeek[],
  timeSlots: TimeSlot[],
  teachers: Teacher[]
): { conflicts: any[]; stats: any } {
  const activePeriods = timeSlots.filter(s => !s.isBreak && !(s as any).isActivity);
  const conflicts: any[] = [];
  
  // Trackers to find double bookings
  // map: [day][periodId][teacherId] -> classId
  const teacherBookings: { [day: string]: { [periodId: string]: { [teacherId: string]: string } } } = {};
  // map: [day][periodId][roomId] -> classId
  const roomBookings: { [day: string]: { [periodId: string]: { [roomId: string]: string } } } = {};

  days.forEach(d => {
    teacherBookings[d] = {};
    roomBookings[d] = {};
    activePeriods.forEach(p => {
      teacherBookings[d][p.id] = {};
      roomBookings[d][p.id] = {};
    });
  });

  // Track teacher hours
  const teacherHours: { [teacherId: string]: number } = {};
  teachers.forEach(t => { teacherHours[t.id] = 0; });
  const recordedTeacherConflicts = new Set<string>();
  const recordedUnavailableSlots = new Set<string>();

  let scheduledCount = 0;

  Object.keys(schedule).forEach(classId => {
    days.forEach(day => {
      activePeriods.forEach(p => {
        const cell: any = schedule[classId]?.[day]?.[p.id];
        if (cell && cell.subjectId) {
          scheduledCount++;
          const { teacherId, roomId } = cell;
          const occupiedSlots = getTeacherOccupiedSlots(cell, p.id, timeSlots);

          if (cell.isDouble && !cell.isDoubleSpan && occupiedSlots.length !== 2) {
            conflicts.push({
              id: `c_d_${classId}_${day}_${p.id}`,
              type: 'invalid_double_period',
              description: `Double period in Class ${classId} cannot cross a break, lunch, activity, or the end of the day.`,
              severity: 'error',
              entityIds: [classId, ...(teacherId ? [teacherId] : [])],
              slot: { day, periodId: p.id }
            });
          }

          // 1. Teacher double booking; teacherless subjects (PS/Religion) are valid.
          const cellTeacherIds = [...new Set([teacherId, cell.secondTeacherId].filter(Boolean))] as string[];
          cellTeacherIds.forEach(cellTeacherId => {
            teacherHours[cellTeacherId] = teacherHours[cellTeacherId] || 0;
            if (!cell.isDoubleSpan) teacherHours[cellTeacherId] += occupiedSlots.length || 1;
            occupiedSlots.forEach(occupiedPeriodId => {
              if (!teacherBookings[day][occupiedPeriodId]) return;
              const existingClassId = teacherBookings[day][occupiedPeriodId][cellTeacherId];
              if (existingClassId && existingClassId !== classId) {
                const conflictKey = `${cellTeacherId}_${day}_${occupiedPeriodId}_${classId}`;
                if (!recordedTeacherConflicts.has(conflictKey)) {
                  recordedTeacherConflicts.add(conflictKey);
                  conflicts.push({
                    id: `c_t_${classId}_${day}_${occupiedPeriodId}`,
                    type: 'teacher_double_booking',
                    description: `Teacher is double booked for Class ${classId} and Class ${existingClassId} at the same time.`,
                    severity: 'error',
                    entityIds: [cellTeacherId, classId, existingClassId],
                    slot: { day, periodId: occupiedPeriodId }
                  });
                }
              } else {
                teacherBookings[day][occupiedPeriodId][cellTeacherId] = classId;
              }
            });

            const teacher = teachers.find(t => t.id === cellTeacherId);
            if (teacher) {
              const unavailableSlots = occupiedSlots.length > 0 ? occupiedSlots : [p.id];
              unavailableSlots.forEach(occupiedPeriodId => {
                const isUnavailable = teacher.unavailableSlots.some(us => us.day === day && us.periodId === occupiedPeriodId);
                const warningKey = `${cellTeacherId}_${day}_${occupiedPeriodId}`;
                if (isUnavailable && !recordedUnavailableSlots.has(warningKey)) {
                  recordedUnavailableSlots.add(warningKey);
                  conflicts.push({
                    id: `c_u_${cellTeacherId}_${day}_${occupiedPeriodId}`,
                    type: 'teacher_unavailable',
                    description: `Teacher ${teacher.name} is scheduled during their specified unavailable time.`,
                    severity: 'warning',
                    entityIds: [cellTeacherId],
                    slot: { day, periodId: occupiedPeriodId }
                  });
                }
              });
            }
          });

          // 2. Room double booking; teacherless subjects do not require a room.
          if (roomId) {
            if (roomBookings[day][p.id][roomId]) {
              conflicts.push({
                id: `c_r_${classId}_${day}_${p.id}`,
                type: 'room_double_booking',
                description: `Room is double booked for Class ${classId} and Class ${roomBookings[day][p.id][roomId]} at the same time.`,
                severity: 'error',
                entityIds: [roomId, classId, roomBookings[day][p.id][roomId]],
                slot: { day, periodId: p.id }
              });
            } else {
              roomBookings[day][p.id][roomId] = classId;
            }
          }

        }
      });
    });
  });

  // 4. Max hours exceeded
  teachers.forEach(t => {
    if (teacherHours[t.id] > t.maxPeriodsPerWeek) {
      conflicts.push({
        id: `c_h_${t.id}`,
        type: 'max_hours_exceeded',
        description: `Teacher ${t.name} exceeds maximum workload: scheduled for ${teacherHours[t.id]}/${t.maxPeriodsPerWeek} periods.`,
        severity: 'warning',
        entityIds: [t.id],
        slot: { day: '', periodId: '' }
      });
    }
  });

  return {
    conflicts,
    stats: {
      scheduledCount,
      conflictsCount: conflicts.length
    }
  };
}
