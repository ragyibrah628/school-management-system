import React from 'react';
import { TimetableProvider, useTimetable } from '../context/TimetableContext';
import { TimetableViewer } from './TimetableViewer';

const TimetableContent: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-800 antialiased p-6 print:p-0">
      <main className="max-w-7xl mx-auto print:max-w-none">
        <TimetableViewer />
      </main>
    </div>
  );
};

export const TimetableSubsystem: React.FC = () => {
  return (
    <TimetableProvider>
      <TimetableContent />
    </TimetableProvider>
  );
};
