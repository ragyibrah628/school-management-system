import { useMemo, useState } from 'react';
import { GraduationCap } from 'lucide-react';
import {
  PromotionPlan, Roster, buildPromotionPlan, displayClass
} from '../utils/promotion';

interface PromoteStudentsProps {
  students: Roster;
  schoolClasses: string[];
  scores: any[];
  exams: any[];
  behavior: Record<string, Record<string, string>>;
  schoolName: string;
  districtName: string;
  schoolLogo: string;
  onApply: (plan: PromotionPlan) => void;
}

type Step = 0 | 1 | 2 | 3 | 4;

export function PromoteStudents({ students, schoolClasses, scores, exams, behavior, schoolName, districtName, schoolLogo, onApply }: PromoteStudentsProps) {
  const [step, setStep] = useState<Step>(0);
  const [summary, setSummary] = useState('');
  const plan = useMemo(() => buildPromotionPlan(students, schoolClasses), [students, schoolClasses, step]);
  const graduateCount = plan.graduates.reduce((sum, g) => sum + g.students.length, 0);
  const movedCount = plan.moves.reduce((sum, m) => sum + m.count, 0);

  const close = () => setStep(0);

  const run = () => {
    if (plan.missingTargets.length > 0) return;
    onApply(plan);
    setSummary(`${movedCount} students promoted, ${graduateCount} Form IV students removed. New Form I classes are empty.`);
    setStep(4);
  };

  const overlay = 'fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4';
  const card = 'bg-white rounded-2xl p-6 w-full max-w-md shadow-xl';

  return (
    <div className="bg-white p-6 rounded-2xl border mt-4">
      <h2 className="font-bold text-lg mb-1 flex items-center gap-2"><GraduationCap size={20} /> Promote Students</h2>
      <p className="text-xs text-slate-500 mb-3">
        Form I move to Form II, Form II to Form III, Form III to Form IV, and Form IV leave the system. New Form I classes stay empty
        until the class teachers register the new students. Exam results are not changed.
      </p>
      {plan.missingTargets.length > 0 && (
        <p className="text-xs text-red-600 mb-3">Add these classes first: {plan.missingTargets.join(', ')}</p>
      )}
      {summary && <p className="text-sm text-emerald-700 mb-3">{summary}</p>}
      <button
        onClick={() => { setSummary(''); setStep(1); }}
        disabled={plan.missingTargets.length > 0}
        className="bg-amber-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-40"
      >
        Promote Students
      </button>

      {step === 1 && (
        <div className={overlay}><div className={card}>
          <h3 className="font-bold text-lg mb-2">Are you sure you want to promote students?</h3>
          <p className="text-sm text-slate-600 mb-4">{movedCount} students will move up one class and {graduateCount} Form IV students will leave the system.</p>
          <div className="flex gap-2 justify-end">
            <button onClick={close} className="px-4 py-2 rounded-xl border text-sm">No</button>
            <button onClick={() => setStep(3)} className="px-4 py-2 rounded-xl bg-amber-600 text-white text-sm font-semibold">Yes</button>
          </div>
        </div></div>
      )}

      {step === 3 && (
        <div className={overlay}><div className={card}>
          <h3 className="font-bold text-lg mb-2">You are about to promote students</h3>
          <ul className="text-sm text-slate-600 mb-4 list-disc pl-5 space-y-1">
            {plan.moves.filter(m => m.count > 0).map(m => <li key={m.from}>{displayClass(m.from)} &rarr; {displayClass(m.to)} ({m.count})</li>)}
            <li>Form IV leave the system ({graduateCount}). Their exam results stay in the system.</li>
          </ul>
          <div className="flex gap-2 justify-end">
            <button onClick={close} className="px-4 py-2 rounded-xl border text-sm">Cancel</button>
            <button onClick={run} className="px-4 py-2 rounded-xl bg-red-600 text-white text-sm font-semibold">Confirm and promote</button>
          </div>
        </div></div>
      )}
    </div>
  );
}
