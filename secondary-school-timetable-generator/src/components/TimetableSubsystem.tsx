import React from 'react';
import { TimetableProvider, useTimetable } from '../context/TimetableContext';
import { Sidebar } from './Sidebar';
import { Dashboard } from './Dashboard';
import { SubjectManager } from './SubjectManager';
import { RoomManager } from './RoomManager';
import { TeacherManager } from './TeacherManager';
import { ClassManager } from './ClassManager';
import { TimetableViewer } from './TimetableViewer';
import { Settings } from './Settings';

const TimetableContent: React.FC = () => {
  const { activeTab } = useTimetable();

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'classes':
        return <ClassManager />;
      case 'teachers':
        return <TeacherManager />;
      case 'subjects':
        return <SubjectManager />;
      case 'rooms':
        return <RoomManager />;
      case 'schedule':
        return <TimetableViewer />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-800 antialiased flex">
      <div className="print:hidden">
        <Sidebar />
      </div>
      <main className="flex-1 ml-64 p-8 print:p-0 print:ml-0 overflow-x-hidden min-h-screen">
        <div className="max-w-7xl mx-auto print:max-w-none">{renderTabContent()}</div>
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
