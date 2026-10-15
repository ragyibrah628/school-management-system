import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import {
  buildRemarkOptions,
  COMMON_RESOURCES,
  INTRODUCTION,
  LESSON_PARTS,
  METHOD_TEMPLATES,
  REFERENCES,
  STAGE_MINUTES_DOUBLE,
  STAGE_MINUTES_SINGLE,
  UNITS,
} from '../data/LessonPlanData';

interface LessonPlanProps {
  teacherName: string;
  assignments: { cls: string; sub: string }[];
  schoolName: string;
  districtName: string;
  schoolLogo: string;
}

interface TimeSlot {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  isBreak?: boolean;
  isActivity?: boolean;
}

interface RegisteredCounts {
  regB: number;
  regG: number;
}

type PeriodType = '' | 'single' | 'double';

const readStoredJson = <T,>(key: string, fallback: T): T => {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) as T : fallback;
  } catch {
    return fallback;
  }
};

const normalizeForm = (className: string): 1 | 2 | 3 | 4 | null => {
  const name = className.trim().toUpperCase();
  const match = name.match(/^(?:FORM\s*|F\s*)(IV|III|II|I|[1-4]|ONE|TWO|THREE|FOUR)(?=$|[\sA-Z])/);
  if (!match) return null;
  const value = match[1];
  if (value === 'I' || value === '1' || value === 'ONE') return 1;
  if (value === 'II' || value === '2' || value === 'TWO') return 2;
  if (value === 'III' || value === '3' || value === 'THREE') return 3;
  if (value === 'IV' || value === '4' || value === 'FOUR') return 4;
  return null;
};

const readCount = (value: unknown): number => {
  const count = Number(value);
  return Number.isInteger(count) && count >= 0 ? count : 0;
};

const formatDate = (value: string): string => {
  const [year, month, day] = value.split('-');
  return year && month && day ? `${day}/${month}/${year}` : value;
};

export function LessonPlan({
  teacherName,
  assignments,
  schoolName,
  districtName,
  schoolLogo,
}: LessonPlanProps) {
  const registeredStudents = useMemo(
    () => readStoredJson<Record<string, RegisteredCounts>>('sms_registered_students', {}),
    [],
  );
  const storedTimeSlots = useMemo(
    () => readStoredJson<TimeSlot[]>('tt_timeSlots', []),
    [],
  );
  const timeSlots = Array.isArray(storedTimeSlots)
    ? storedTimeSlots.filter(slot =>
        slot &&
        !slot.isBreak &&
        !slot.isActivity &&
        typeof slot.startTime === 'string' &&
        typeof slot.endTime === 'string',
      )
    : [];

  const subjects = [...new Set(assignments.map(assignment => assignment.sub).filter(Boolean))];
  const [subject, setSubject] = useState('');
  const [className, setClassName] = useState('');
  const [date, setDate] = useState('');
  const [selectedSlotId, setSelectedSlotId] = useState('');
  const [periodType, setPeriodType] = useState<PeriodType>('');
  const [topic, setTopic] = useState('');
  const [subtopic, setSubtopic] = useState('');
  const [partId, setPartId] = useState('');
  const [presentGirls, setPresentGirls] = useState('');
  const [presentBoys, setPresentBoys] = useState('');
  const [previewScale, setPreviewScale] = useState(1);
  const [selectedResources, setSelectedResources] = useState<string[]>([]);
  const [selectedRemark, setSelectedRemark] = useState('');
  const [printDensity, setPrintDensity] = useState(0);
  const printSheetRef = useRef<HTMLElement>(null);
  const densityPartId = useRef(partId);

  useEffect(() => {
    const printStyle = document.createElement('style');
    printStyle.dataset.lessonPlanPrint = 'true';
    printStyle.textContent = '@page { size: A4 portrait; margin: 0; }';
    document.head.appendChild(printStyle);
    document.documentElement.classList.add('lesson-plan-print-mode');
    document.body.classList.add('lesson-plan-print-mode');

    return () => {
      document.documentElement.classList.remove('lesson-plan-print-mode');
      document.body.classList.remove('lesson-plan-print-mode');
      printStyle.remove();
    };
  }, []);

  useEffect(() => {
    const updatePreviewScale = () => {
      const printableWidth = 210 * 96 / 25.4;
      setPreviewScale(Math.min(1, Math.max(0.3, (window.innerWidth - 24) / printableWidth)));
    };
    updatePreviewScale();
    window.addEventListener('resize', updatePreviewScale);
    return () => window.removeEventListener('resize', updatePreviewScale);
  }, []);

  const classes = [...new Set(
    assignments.filter(assignment => assignment.sub === subject).map(assignment => assignment.cls),
  )];
  const selectedForm = normalizeForm(className);
  const isComputerScience = subject.toLowerCase().includes('computer');
  const isSupportedClass = isComputerScience && (selectedForm === 1 || selectedForm === 2);
  const unsupportedSubject = subject && !isComputerScience
    ? subject
    : subject && selectedForm && selectedForm >= 3
      ? `Computer Science (Form ${selectedForm})`
      : subject && className && !isSupportedClass
        ? `Computer Science (${className})`
        : '';

  const formParts = selectedForm === 1 || selectedForm === 2
    ? LESSON_PARTS.filter(lessonPart => lessonPart.form === selectedForm)
    : [];
  const topics = [...new Set(formParts.map(lessonPart => lessonPart.topic))];
  const subtopics = [...new Set(formParts.filter(lessonPart => lessonPart.topic === topic).map(lessonPart => lessonPart.subtopic))];
  const matchingParts = formParts.filter(lessonPart =>
    lessonPart.topic === topic && lessonPart.subtopic === subtopic,
  );
  const selectedPart = matchingParts.find(lessonPart => lessonPart.id === partId);
  const unit = selectedPart ? UNITS[selectedPart.unit] : undefined;
  const availableResources = selectedPart
    ? [...new Set([...(unit?.resources ?? []), ...COMMON_RESOURCES])]
    : [];
  const availableMethods = unit?.methods ?? [];
  const selectedMethod = availableMethods[0];
  const remarkOptions = selectedPart ? buildRemarkOptions(selectedPart) : [];

  const registered = registeredStudents[className];
  const registeredGirls = readCount(registered?.regG);
  const registeredBoys = readCount(registered?.regB);
  const girlsValueValid = presentGirls !== '' && /^\d+$/.test(presentGirls) &&
    Number.isInteger(Number(presentGirls)) && Number(presentGirls) >= 0 &&
    Number(presentGirls) <= registeredGirls;
  const boysValueValid = presentBoys !== '' && /^\d+$/.test(presentBoys) &&
    Number.isInteger(Number(presentBoys)) && Number(presentBoys) >= 0 &&
    Number(presentBoys) <= registeredBoys;
  const presentGirlsCount = girlsValueValid ? Number(presentGirls) : 0;
  const presentBoysCount = boysValueValid ? Number(presentBoys) : 0;
  const registeredTotal = registeredGirls + registeredBoys;
  const presentTotal = presentGirlsCount + presentBoysCount;
  const absentGirls = registeredGirls - presentGirlsCount;
  const absentBoys = registeredBoys - presentBoysCount;
  const absentTotal = absentGirls + absentBoys;

  const selectedSlotIndex = storedTimeSlots.findIndex(slot => slot.id === selectedSlotId);
  const selectedSlot = timeSlots.find(slot => slot.id === selectedSlotId);
  const secondSlot = periodType === 'double' && selectedSlotIndex >= 0
    ? storedTimeSlots[selectedSlotIndex + 1]
    : undefined;
  const canSelectSlot = (slot: TimeSlot) => {
    if (periodType !== 'double') return true;
    const slotIndex = storedTimeSlots.findIndex(candidate => candidate.id === slot.id);
    const nextSlot = storedTimeSlots[slotIndex + 1];
    return !!nextSlot && !nextSlot.isBreak && !nextSlot.isActivity &&
      typeof nextSlot.endTime === 'string';
  };
  const printedTime = selectedSlot && periodType
    ? `${selectedSlot.startTime} - ${periodType === 'double' && secondSlot ? secondSlot.endTime : selectedSlot.endTime}`
    : '';
  const attendanceIsValid = girlsValueValid && boysValueValid;
  const complete = !!subject && !!className && !!date && !!periodType &&
    !!topic && !!subtopic && !!selectedPart && attendanceIsValid &&
    selectedResources.length > 0 &&
    (timeSlots.length === 0 || !!selectedSlot);

  const processRows = selectedPart && selectedMethod
    ? [
        {
          stage: 'Introduction',
          minutes: periodType === 'double' ? STAGE_MINUTES_DOUBLE.introduction : STAGE_MINUTES_SINGLE.introduction,
          text: INTRODUCTION,
        },
        {
          stage: 'Competence development',
          minutes: periodType === 'double' ? STAGE_MINUTES_DOUBLE.development : STAGE_MINUTES_SINGLE.development,
          text: METHOD_TEMPLATES[selectedMethod].development,
        },
        {
          stage: 'Design',
          minutes: periodType === 'double' ? STAGE_MINUTES_DOUBLE.design : STAGE_MINUTES_SINGLE.design,
          text: METHOD_TEMPLATES[selectedMethod].design,
        },
        {
          stage: 'Realization',
          minutes: periodType === 'double' ? STAGE_MINUTES_DOUBLE.realization : STAGE_MINUTES_SINGLE.realization,
          text: METHOD_TEMPLATES[selectedMethod].realization,
        },
      ]
    : [];
  const replacePart = (text: string) => text.split('{part}').join(selectedPart?.part ?? '');
  const densityClass = ['', 'lesson-plan-print--compact', 'lesson-plan-print--dense', 'lesson-plan-print--extra-dense'][printDensity];

  useLayoutEffect(() => {
    if (densityPartId.current !== partId) {
      densityPartId.current = partId;
      if (printDensity !== 0) {
        setPrintDensity(0);
        return;
      }
    }

    const sheet = printSheetRef.current;
    if (!sheet || printDensity >= 3) return;

    const overflowingCell = Array.from(
      sheet.querySelectorAll<HTMLElement>(
        '.lesson-plan-process th, .lesson-plan-process td, .lesson-plan-remarks-lines > div',
      ),
    ).some(element => element.scrollHeight > element.clientHeight + 1);

    if (sheet.scrollHeight > sheet.clientHeight + 1 || overflowingCell) {
      setPrintDensity(printDensity + 1);
    }
  }, [
    className,
    date,
    districtName,
    partId,
    periodType,
    printDensity,
    printedTime,
    processRows,
    schoolName,
    selectedPart,
    selectedRemark,
    selectedResources,
    subject,
    teacherName,
  ]);

  const resetTopicAndBelow = () => {
    setTopic('');
    setSubtopic('');
    setPartId('');
    setSelectedResources([]);
    setSelectedRemark('');
    setPrintDensity(0);
  };

  const numberInput = (
    value: string,
    onChange: (next: string) => void,
    registeredCount: number,
    label: string,
    valid: boolean,
  ) => (
    <div>
      <input
        type="number"
        min="0"
        max={registeredCount}
        step="1"
        inputMode="numeric"
        aria-label={label}
        value={value}
        onChange={event => onChange(event.target.value)}
        className={`w-full rounded border px-2 py-1 text-sm ${!valid && value !== '' ? 'border-red-500' : ''}`}
      />
      {!valid && value !== '' && (
        <p className="mt-1 text-[11px] text-red-600">Enter a whole number from 0 to {registeredCount}.</p>
      )}
    </div>
  );

  if (assignments.length === 0) {
    return <p className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">You have no assigned subjects yet. Please contact the administrator.</p>;
  }

  return (
    <section className="lesson-plan-page space-y-5">
      <div className="no-print rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <h2 className="mb-4 text-lg font-bold text-slate-900">Lesson Plan</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <label className="text-xs font-semibold text-slate-600">
            Subject
            <select
              value={subject}
              onChange={event => {
                setSubject(event.target.value);
                setClassName('');
                setDate('');
                setSelectedSlotId('');
                setPeriodType('');
                setPresentGirls('');
                setPresentBoys('');
                resetTopicAndBelow();
              }}
              className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm"
            >
              <option value="">Select subject</option>
              {subjects.map(value => <option key={value} value={value}>{value}</option>)}
            </select>
          </label>
          {subject && !unsupportedSubject && (
            <label className="text-xs font-semibold text-slate-600">
              Class
              <select
                value={className}
                onChange={event => {
                  setClassName(event.target.value);
                  setPresentGirls('');
                  setPresentBoys('');
                  resetTopicAndBelow();
                }}
                className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm"
              >
                <option value="">Select class</option>
                {classes.map(value => <option key={value} value={value}>{value}</option>)}
              </select>
            </label>
          )}

          {isSupportedClass && (
            <>
              <label className="text-xs font-semibold text-slate-600">
                Date
                <input
                  type="date"
                  value={date}
                  onChange={event => setDate(event.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm"
                />
              </label>
              <label className="text-xs font-semibold text-slate-600">
                Period type
                <select
                  value={periodType}
                  onChange={event => {
                    setPeriodType(event.target.value as PeriodType);
                    setSelectedSlotId('');
                  }}
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm"
                >
                  <option value="">Select period type</option>
                  <option value="single">Single (40 min)</option>
                  <option value="double">Double (80 min)</option>
                </select>
              </label>
              {timeSlots.length > 0 && (
                <label className="text-xs font-semibold text-slate-600">
                  Time / period
                  <select
                    value={selectedSlotId}
                    onChange={event => setSelectedSlotId(event.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm"
                  >
                    <option value="">Select time / period</option>
                    {timeSlots.filter(canSelectSlot).map(slot => {
                      const slotIndex = storedTimeSlots.findIndex(candidate => candidate.id === slot.id);
                      const end = periodType === 'double'
                        ? storedTimeSlots[slotIndex + 1]?.endTime
                        : slot.endTime;
                      return <option key={slot.id} value={slot.id}>{slot.name}: {slot.startTime} - {end}</option>;
                    })}
                  </select>
                </label>
              )}
              <label className="text-xs font-semibold text-slate-600">
                Topic
                <select
                  value={topic}
                  onChange={event => {
                    setTopic(event.target.value);
                    setSubtopic('');
                    setPartId('');
                  }}
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm"
                >
                  <option value="">Select topic</option>
                  {topics.map(value => <option key={value} value={value}>{value}</option>)}
                </select>
              </label>
              <label className="text-xs font-semibold text-slate-600">
                Subtopic
                <select
                  value={subtopic}
                  disabled={!topic}
                  onChange={event => {
                    setSubtopic(event.target.value);
                    setPartId('');
                  }}
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm disabled:bg-slate-100"
                >
                  <option value="">Select subtopic</option>
                  {subtopics.map(value => <option key={value} value={value}>{value}</option>)}
                </select>
              </label>
              <label className="text-xs font-semibold text-slate-600">
                Lesson part
                <select
                  value={partId}
                  disabled={!subtopic}
                  onChange={event => {
                    const nextPartId = event.target.value;
                    setPartId(nextPartId);
                    const nextPart = matchingParts.find(value => value.id === nextPartId);
                    setSelectedResources(nextPart ? [...UNITS[nextPart.unit].resources] : []);
                    setSelectedRemark('');
                    setPrintDensity(0);
                  }}
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm disabled:bg-slate-100"
                >
                  <option value="">Select lesson part</option>
                  {matchingParts.map(value => <option key={value.id} value={value.id}>{value.part}</option>)}
                </select>
              </label>
            </>
          )}
        </div>
        {unsupportedSubject && (
          <p className="mt-4 rounded-xl border border-indigo-100 bg-indigo-50 p-4 text-sm font-medium text-indigo-900">
            Lesson plan for "{unsupportedSubject}" is coming soon. Mr. Kijida is working on it.
          </p>
        )}
        {selectedPart && (
          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <fieldset className="min-w-0">
              <legend className="text-xs font-semibold text-slate-600">Teaching and learning resources</legend>
              <div className="mt-2 flex flex-wrap gap-2">
                {availableResources.map(resource => (
                  <label
                    key={resource}
                    className={`inline-flex cursor-pointer items-center gap-2 rounded-full border px-3 py-1.5 text-xs ${
                      selectedResources.includes(resource)
                        ? 'border-indigo-300 bg-indigo-50 text-indigo-900'
                        : 'border-slate-300 bg-white text-slate-700'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedResources.includes(resource)}
                      onChange={() => setSelectedResources(current =>
                        current.includes(resource)
                          ? current.filter(value => value !== resource)
                          : [...current, resource],
                      )}
                      className="accent-indigo-600"
                    />
                    {resource}
                  </label>
                ))}
              </div>
              {selectedResources.length === 0 && (
                <p className="mt-2 text-xs text-red-600">Select at least one resource to print.</p>
              )}
            </fieldset>
            <label className="text-xs font-semibold text-slate-600">
              Remarks
              <select
                value={selectedRemark}
                onChange={event => setSelectedRemark(event.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm"
              >
                <option value="">Optional — choose a suggested remark</option>
                {remarkOptions.map(remark => <option key={remark} value={remark}>{remark}</option>)}
              </select>
            </label>
          </div>
        )}
        {isSupportedClass && (
          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[360px] border-collapse text-sm">
              <caption className="p-2 text-center font-semibold">Number of students</caption>
              <thead>
                <tr>
                  <th className="border border-slate-300 p-2" />
                  {['Girls', 'Boys', 'Total'].map(label => <th key={label} className="border border-slate-300 p-2">{label}</th>)}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th className="border border-slate-300 p-2 text-left">Registered</th>
                  <td className="border border-slate-300 p-2 text-center">{registeredGirls}</td>
                  <td className="border border-slate-300 p-2 text-center">{registeredBoys}</td>
                  <td className="border border-slate-300 p-2 text-center">{registeredTotal}</td>
                </tr>
                <tr>
                  <th className="border border-slate-300 p-2 text-left">Present</th>
                  <td className="border border-slate-300 p-2">
                    {numberInput(presentGirls, setPresentGirls, registeredGirls, 'Present girls', girlsValueValid)}
                  </td>
                  <td className="border border-slate-300 p-2">
                    {numberInput(presentBoys, setPresentBoys, registeredBoys, 'Present boys', boysValueValid)}
                  </td>
                  <td className="border border-slate-300 p-2 text-center">{presentTotal}</td>
                </tr>
                <tr>
                  <th className="border border-slate-300 p-2 text-left">Absent</th>
                  <td className="border border-slate-300 p-2 text-center">{absentGirls}</td>
                  <td className="border border-slate-300 p-2 text-center">{absentBoys}</td>
                  <td className="border border-slate-300 p-2 text-center">{absentTotal}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
        <div className="no-print mt-5 flex flex-wrap items-center gap-3">
          <button
            type="button"
            disabled={!complete}
            onClick={() => window.print()}
            className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            Print Lesson Plan
          </button>
          {!complete && isSupportedClass && <span className="text-xs text-slate-500">Complete the required fields, select at least one resource, and enter valid present counts to print.</span>}
        </div>
      </div>

      {isSupportedClass && (
        <div className="lesson-plan-preview-scroll">
          <div
            className="lesson-plan-preview-frame"
            style={{
              width: `calc(210mm * ${previewScale})`,
              height: `calc(297mm * ${previewScale})`,
            }}
          >
          <div
            className="lesson-plan-preview-scaled"
            style={{ transform: `scale(${previewScale})` }}
          >
          <article ref={printSheetRef} className={`lesson-plan-print ${densityClass}`}>
            <header className="lesson-plan-header">
              <div className="lesson-plan-header-logo">
                {schoolLogo && <img src={schoolLogo} alt="School logo" />}
              </div>
              <div className="lesson-plan-header-copy">
                <h1>LESSON PLAN</h1>
                <p className="lesson-plan-council">{districtName}</p>
                <p className="lesson-plan-school-name">{schoolName}</p>
              </div>
              <div className="lesson-plan-header-spacer" aria-hidden="true" />
            </header>

            <table className="lesson-plan-meta">
              <tbody>
                <tr>
                  <th>TEACHER</th><td>{teacherName}</td>
                  <th>SUBJECT</th><td>{subject}</td>
                </tr>
                <tr>
                  <th>CLASS</th><td>{className}</td>
                  <th>DATE</th><td>{date ? formatDate(date) : ''}</td>
                </tr>
                <tr>
                  <th>TIME</th><td>{printedTime}</td>
                  <th>PERIOD TYPE</th><td>{periodType === 'double' ? 'Double (80 min)' : periodType === 'single' ? 'Single (40 min)' : ''}</td>
                </tr>
              </tbody>
            </table>

            <table className="lesson-plan-students">
              <thead>
                <tr><th colSpan={4}>NUMBER OF STUDENTS</th></tr>
                <tr><th /><th>GIRLS</th><th>BOYS</th><th>TOTAL</th></tr>
              </thead>
              <tbody>
                <tr><th>REGISTERED</th><td>{registeredGirls}</td><td>{registeredBoys}</td><td>{registeredTotal}</td></tr>
                <tr><th>PRESENT</th><td>{presentGirlsCount}</td><td>{presentBoysCount}</td><td>{presentTotal}</td></tr>
                <tr><th>ABSENT</th><td>{absentGirls}</td><td>{absentBoys}</td><td>{absentTotal}</td></tr>
              </tbody>
            </table>

            <table className="lesson-plan-details">
              <tbody>
                <tr><th>MAIN COMPETENCE</th><td>{unit?.mainCompetence}</td></tr>
                <tr><th>SPECIFIC COMPETENCE</th><td>{unit?.specificCompetence}</td></tr>
                <tr><th>MAIN ACTIVITY</th><td>{unit?.mainActivity}</td></tr>
                <tr>
                  <th>SPECIFIC ACTIVITIES</th>
                  <td>{selectedPart && <ol>{selectedPart.specificActivities.map(activity => <li key={activity}>{activity}</li>)}</ol>}</td>
                </tr>
                <tr><th>TEACHING &amp; LEARNING RESOURCES</th><td>{selectedResources.join(', ')}</td></tr>
                <tr><th>REFERENCES</th><td>{selectedForm ? REFERENCES[selectedForm as 1 | 2] : ''}</td></tr>
              </tbody>
            </table>

            <section className="lesson-plan-process-section">
              <h2 className="lesson-plan-process-title">TEACHING AND LEARNING PROCESS</h2>
              <table className="lesson-plan-process">
                <thead>
                  <tr><th>STAGE</th><th>TIME (MIN)</th><th>TEACHING ACTIVITIES</th><th>LEARNING ACTIVITIES</th></tr>
                </thead>
                <tbody>
                  {processRows.map(row => (
                    <tr key={row.stage}>
                      <th>{row.stage.toUpperCase()}</th>
                      <td>{row.minutes}</td>
                      <td>{replacePart(row.text.teacher)}</td>
                      <td>{replacePart(row.text.learners)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>

            <section className="lesson-plan-remarks">
              <h2>REMARKS</h2>
              <div className="lesson-plan-remarks-lines">
                <div>{selectedRemark && selectedRemark !== 'No remark (leave blank lines)' ? selectedRemark : ''}</div>
                <div />
                <div />
              </div>
            </section>
          </article>
          </div>
          </div>
        </div>
      )}
    </section>
  );
}
