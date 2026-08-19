// @ts-nocheck
// Replace src/utils/dummyData.ts timeSlots part with NAMBAWALA slots

import { DayOfWeek } from '../types';

export const NAMBAWALA_DAYS: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

export const NAMBAWALA_TIME_SLOTS = [
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
  { id: 'act', name: 'Shughuli', startTime: '15:30', endTime: '17:30', isBreak: false, isActivity: true },
];
