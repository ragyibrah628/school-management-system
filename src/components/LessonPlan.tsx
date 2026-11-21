import {
  type Dispatch,
  type RefObject,
  type SetStateAction,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  getCommonResources,
  getLessonLanguage,
  getMethodTemplate,
  getReference,
  getRemarkOptions,
  resolveLessonSubject,
  supportedFormsFor,
  INTRODUCTION,
  INTRODUCTION_SW,
  LESSON_PARTS,
  NO_REMARK_OPTIONS,
  STAGE_MINUTES_DOUBLE,
  STAGE_MINUTES_SINGLE,
  STAGE_NAMES_SW,
  UNITS,
  type LessonLanguage,
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

// A lesson plan must print on ONE page. Letter (279 mm) is the shortest paper we print on, and some
// browsers/printers shrink the printable area, so the sheet is fitted to PRINT_TARGET_MM (a safe margin).
// The fit is measured on screen with the same width/padding as the printout, so it does not depend on
// the browser reporting the "print" media state correctly.
const PRINT_TARGET_MM = 268;
const PRINT_HIDE_ATTR = 'data-lp-print-hide';
const PRINT_PATH_ATTR = 'data-lp-print-path';

function clearPrintTree() {
  document.querySelectorAll(`[${PRINT_HIDE_ATTR}], [${PRINT_PATH_ATTR}]`).forEach(element => {
    element.removeAttribute(PRINT_HIDE_ATTR);
    element.removeAttribute(PRINT_PATH_ATTR);
  });
}

// When printing, everything in the app except the lesson plan sheet must not take any space.
// Elements that only had "visibility: hidden" still made the document longer than one page, which
// printed a second, duplicate page. The marked elements are hidden/neutralised by CSS in @media print only.
function markPrintTree(sheet: HTMLElement) {
  clearPrintTree();
  let node: HTMLElement = sheet;
  while (node.parentElement) {
    const parent: HTMLElement = node.parentElement;
    Array.from(parent.children).forEach(child => {
      if (child !== node) child.setAttribute(PRINT_HIDE_ATTR, '');
    });
    if (parent === document.body || parent === document.documentElement) break;
    parent.setAttribute(PRINT_PATH_ATTR, '');
    node = parent;
  }
}

function useFitToPage(
  sheetRef: RefObject<HTMLElement | null>,
  dependencies: readonly unknown[],
) {
  const fitToPage = useCallback(() => {
    const sheet = sheetRef.current;
    if (!sheet) return;

    const limit = PRINT_TARGET_MM * 96 / 25.4;
    // offsetHeight is the real layout height (the on-screen preview is scaled with a transform).
    const fits = () => sheet.offsetHeight <= limit;

    const fit = () => {
      sheet.style.removeProperty('--cell-padding-y');
      sheet.style.removeProperty('--block-gap');
      sheet.style.removeProperty('--process-row-padding-y');
      // Use the page: one smooth "size" knob t (-1 = very compact, 0 = normal, 1 = roomy) that scales the text
      // and the spacing together. Take the largest t that still fits on one page, so short lessons fill the
      // page and long ones are squeezed just enough.
      for (let step = 50; step >= -50; step -= 1) {
        const t = step / 50;
        const roomy = Math.max(t, 0);
        const tight = Math.min(t, 0);
        sheet.style.setProperty('--fs', `${(10.5 + 2.5 * roomy).toFixed(2)}pt`);
        sheet.style.setProperty('--cell-padding-y', `${(1 + 2.5 * roomy + 0.5 * tight).toFixed(2)}mm`);
        sheet.style.setProperty('--block-gap', `${(3 + 5 * roomy + 1 * tight).toFixed(2)}mm`);
        sheet.style.setProperty('--process-row-padding-y', `${(1 + 3 * roomy + 0.5 * tight).toFixed(2)}mm`);
        if (fits()) return;
      }
      sheet.style.removeProperty('--cell-padding-y');
      sheet.style.removeProperty('--block-gap');
      sheet.style.removeProperty('--process-row-padding-y');

      const compactSpacing = [[1, 3], [0.75, 2.5], [0.5, 2]];
      for (const [padding, gap] of compactSpacing) {
        sheet.style.setProperty('--cell-padding-y', `${padding}mm`);
        sheet.style.setProperty('--process-row-padding-y', `${padding}mm`);
        sheet.style.setProperty('--block-gap', `${gap}mm`);
        if (fits()) return;
      }

      for (let fontSize = 10.25; fontSize >= 8; fontSize -= 0.25) {
        sheet.style.setProperty('--fs', `${fontSize}pt`);
        if (fits()) return;
      }
    };

    fit();
    markPrintTree(sheet);
  }, [sheetRef]);

  useLayoutEffect(() => {
    let active = true;
    fitToPage();
    void document.fonts.ready.then(() => {
      if (active) fitToPage();
    });
    window.addEventListener('beforeprint', fitToPage);
    return () => {
      active = false;
      window.removeEventListener('beforeprint', fitToPage);
    };
  }, [fitToPage, ...dependencies]);

  useEffect(() => clearPrintTree, []);

  return fitToPage;
}

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

// Words printed on the lesson-plan sheet. Only Historia ya Tanzania na Maadili and Kiswahili use Swahili ('sw');
// every other subject keeps the English sheet exactly as before. The layout is the same in both languages.
interface SheetText {
  title: string;
  teacher: string;
  subject: string;
  className: string;
  date: string;
  time: string;
  periodType: string;
  single: string;
  double: string;
  students: string;
  registration: string;
  girls: string;
  boys: string;
  total: string;
  registered: string;
  present: string;
  absent: string;
  mainCompetence: string;
  specificCompetence: string;
  mainActivity: string;
  focus: string;
  specificActivities: string;
  resources: string;
  references: string;
  process: string;
  stage: string;
  minutes: string;
  teaching: string;
  learning: string;
  remarks: string;
  stages: [string, string, string, string];
}

const SHEET_TEXT: Record<LessonLanguage, SheetText> = {
  en: {
    title: 'LESSON PLAN',
    teacher: 'TEACHER',
    subject: 'SUBJECT',
    className: 'CLASS',
    date: 'DATE',
    time: 'TIME',
    periodType: 'PERIOD TYPE',
    single: 'Single (40 min)',
    double: 'Double (80 min)',
    students: 'NUMBER OF STUDENTS',
    registration: 'REGISTRATION',
    girls: 'GIRLS',
    boys: 'BOYS',
    total: 'TOTAL',
    registered: 'REGISTERED',
    present: 'PRESENT',
    absent: 'ABSENT',
    mainCompetence: 'MAIN COMPETENCE',
    specificCompetence: 'SPECIFIC COMPETENCE',
    mainActivity: 'MAIN ACTIVITY',
    focus: 'focus',
    specificActivities: 'SPECIFIC ACTIVITIES',
    resources: 'TEACHING & LEARNING RESOURCES',
    references: 'REFERENCES',
    process: 'TEACHING AND LEARNING PROCESS',
    stage: 'STAGE',
    minutes: 'TIME (MIN)',
    teaching: 'TEACHING ACTIVITIES',
    learning: 'LEARNING ACTIVITIES',
    remarks: 'REMARKS:',
    stages: ['Introduction', 'Competence development', 'Design', 'Realization'],
  },
  sw: {
    title: 'ANDALIO LA SOMO',
    teacher: 'JINA LA MWALIMU',
    subject: 'SOMO',
    className: 'DARASA',
    date: 'TAREHE',
    time: 'MUDA',
    periodType: 'AINA YA KIPINDI',
    single: 'Kipindi kimoja (dakika 40)',
    double: 'Vipindi viwili (dakika 80)',
    students: 'IDADI',
    registration: 'USAJILI',
    girls: 'WASICHANA',
    boys: 'WAVULANA',
    total: 'JUMLA',
    registered: 'WALIO ANDIKISHWA',
    present: 'WALIO HUDHURIA',
    absent: 'WASIOHUDHURIA',
    mainCompetence: 'UMAHIRI MKUU',
    specificCompetence: 'UMAHIRI MAHUSUSI',
    mainActivity: 'SHUGHULI KUU',
    focus: 'mkazo',
    specificActivities: 'SHUGHULI MAHUSUSI',
    resources: 'ZANA ZA KUFUNDISHIA',
    references: 'REJEA',
    process: 'MCHAKATO WA UFUNDISHAJI NA UJIFUNZAJI',
    stage: 'HATUA',
    minutes: 'MUDA (DAK)',
    teaching: 'SHUGHULI ZA UFUNDISHAJI',
    learning: 'SHUGHULI ZA UJIFUNZAJI',
    remarks: 'MAONI:',
    stages: [STAGE_NAMES_SW.introduction, STAGE_NAMES_SW.development, STAGE_NAMES_SW.design, STAGE_NAMES_SW.realization],
  },
};

// "08:00" or "8:00 AM" -> "08 : 00 ASUBUHI" (Swahili sheet). Anything that cannot be read is printed unchanged.
const swahiliClock = (value: string): string => {
  const match = value.trim().match(/^(\d{1,2})[:.](\d{2})\s*(am|pm)?$/i);
  if (!match) return value;
  let hour = Number(match[1]);
  const minutes = match[2];
  const meridiem = match[3]?.toLowerCase();
  if (meridiem === 'pm' && hour < 12) hour += 12;
  if (meridiem === 'am' && hour === 12) hour = 0;
  if (hour > 23) return value;
  const suffix = hour < 12 ? 'ASUBUHI' : 'ALASIRI';
  const twelveHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${String(twelveHour).padStart(2, '0')} : ${minutes} ${suffix}`;
};

// "Ruangwa District Council" -> "Halmashauri ya Wilaya ya Ruangwa"; "Nambawala Secondary School" -> "Shule ya Sekondari Nambawala".
// Names that do not match these patterns are printed unchanged.
const swahiliCouncilName = (name: string): string => {
  const match = name.trim().match(/^(.+?)\s+(District|Town|Municipal|City)\s+Council$/i);
  if (!match) return name;
  const kind = match[2].toLowerCase();
  const label = kind === 'district' ? 'Halmashauri ya Wilaya ya' : kind === 'town' ? 'Halmashauri ya Mji wa' : kind === 'municipal' ? 'Halmashauri ya Manispaa ya' : 'Halmashauri ya Jiji la';
  return `${label} ${match[1]}`;
};

const swahiliSchoolName = (name: string): string => {
  const match = name.trim().match(/^(.+?)\s+Secondary\s+School$/i);
  return match ? `Shule ya Sekondari ${match[1]}` : name;
};

const SWAHILI_FORM_NAMES: Record<number, string> = { 1: 'KWANZA', 2: 'PILI', 3: 'TATU', 4: 'NNE' };

// "Form 1A" / "FORM 2 B" -> "KIDATO CHA KWANZA A" (Swahili sheet).
const swahiliClassName = (className: string): string => {
  const form = normalizeForm(className);
  if (!form) return className.toUpperCase();
  const match = className.trim().toUpperCase().match(/^(?:FORM\s*|F\s*)(IV|III|II|I|[1-4]|ONE|TWO|THREE|FOUR)/);
  const stream = match ? className.trim().toUpperCase().slice(match[0].length).trim() : '';
  return `KIDATO CHA ${SWAHILI_FORM_NAMES[form]}${stream ? ` ${stream}` : ''}`;
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
  const [registeredGirlsValue, setRegisteredGirlsValue] = useState('');
  const [registeredBoysValue, setRegisteredBoysValue] = useState('');
  const [registeredGirlsError, setRegisteredGirlsError] = useState('');
  const [registeredBoysError, setRegisteredBoysError] = useState('');
  const [presentGirls, setPresentGirls] = useState('');
  const [presentBoys, setPresentBoys] = useState('');
  const [previewScale, setPreviewScale] = useState(1);
  const [selectedResources, setSelectedResources] = useState<string[]>([]);
  const [selectedRemark, setSelectedRemark] = useState('');
  const printSheetRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const printStyle = document.createElement('style');
    printStyle.dataset.lessonPlanPrint = 'true';
    printStyle.textContent = '@media print { @page { margin: 0; } }';
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
  const lessonSubject = resolveLessonSubject(subject);
  const lang: LessonLanguage = getLessonLanguage(lessonSubject);
  const text = SHEET_TEXT[lang];
  // Forms that already have lesson-plan data for this subject.
  const supportedForms: number[] = lessonSubject ? supportedFormsFor(lessonSubject) : [];
  const isSupportedClass = !!lessonSubject && !!selectedForm && supportedForms.includes(selectedForm);
  const unsupportedSubject = subject && !lessonSubject
    ? subject
    : subject && selectedForm && !isSupportedClass
      ? `${lessonSubject} (Form ${selectedForm})`
      : subject && className && !isSupportedClass
        ? `${lessonSubject} (${className})`
        : '';

  const formParts = isSupportedClass
    ? LESSON_PARTS.filter(lessonPart => lessonPart.subject === lessonSubject && lessonPart.form === selectedForm)
    : [];
  const topics = [...new Set(formParts.map(lessonPart => lessonPart.topic))];
  const subtopics = [...new Set(formParts.filter(lessonPart => lessonPart.topic === topic).map(lessonPart => lessonPart.subtopic))];
  const matchingParts = formParts.filter(lessonPart =>
    lessonPart.topic === topic && lessonPart.subtopic === subtopic,
  );
  const selectedPart = matchingParts.find(lessonPart => lessonPart.id === partId);
  const unit = selectedPart ? UNITS[selectedPart.unit] : undefined;
  const availableResources = selectedPart
    ? [...new Set([...(unit?.resources ?? []), ...(lessonSubject ? getCommonResources(lessonSubject) : [])])]
    : [];
  const availableMethods = unit?.methods ?? [];
  const selectedMethod = availableMethods[0];
  const remarkOptions = selectedPart ? getRemarkOptions(lang, selectedPart) : [];

  const registered = registeredStudents[className];
  const adminRegisteredGirls = readCount(registered?.regG);
  const adminRegisteredBoys = readCount(registered?.regB);
  const registeredGirlsValid = /^\d+$/.test(registeredGirlsValue) &&
    Number(registeredGirlsValue) <= adminRegisteredGirls;
  const registeredBoysValid = /^\d+$/.test(registeredBoysValue) &&
    Number(registeredBoysValue) <= adminRegisteredBoys;
  const registeredGirls = registeredGirlsValid ? Number(registeredGirlsValue) : 0;
  const registeredBoys = registeredBoysValid ? Number(registeredBoysValue) : 0;
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
    if (!nextSlot || nextSlot.isBreak || nextSlot.isActivity || typeof nextSlot.endTime !== 'string') return false;
    // Double periods are fixed blocks that never overlap: within each run of lessons (between breaks)
    // they are Period 1+2, 3+4, ... so only the 1st, 3rd, 5th... lesson of a run can start one.
    let positionInRun = 0;
    for (let i = slotIndex - 1; i >= 0; i -= 1) {
      const previous = storedTimeSlots[i];
      if (previous.isBreak || previous.isActivity) break;
      positionInRun += 1;
    }
    return positionInRun % 2 === 0;
  };
  const printedStart = selectedSlot ? (lang === 'sw' ? swahiliClock(selectedSlot.startTime) : selectedSlot.startTime) : '';
  const printedEndRaw = selectedSlot ? (periodType === 'double' && secondSlot ? secondSlot.endTime : selectedSlot.endTime) : '';
  const printedEnd = lang === 'sw' ? swahiliClock(printedEndRaw) : printedEndRaw;
  const printedTime = selectedSlot && periodType ? `${printedStart} - ${printedEnd}` : '';
  const printedClassName = lang === 'sw' ? swahiliClassName(className) : className;
  const attendanceIsValid = girlsValueValid && boysValueValid;
  const complete = !!subject && !!className && !!date && !!periodType &&
    !!topic && !!subtopic && !!selectedPart && registeredGirlsValid && registeredBoysValid &&
    registeredGirlsValue !== '' && registeredBoysValue !== '' && attendanceIsValid &&
    selectedResources.length > 0 &&
    (timeSlots.length === 0 || !!selectedSlot);

  const processRows = selectedPart && selectedMethod
    ? [
        {
          stage: text.stages[0],
          minutes: periodType === 'double' ? STAGE_MINUTES_DOUBLE.introduction : STAGE_MINUTES_SINGLE.introduction,
          text: lang === 'sw' ? INTRODUCTION_SW : INTRODUCTION,
        },
        {
          stage: text.stages[1],
          minutes: periodType === 'double' ? STAGE_MINUTES_DOUBLE.development : STAGE_MINUTES_SINGLE.development,
          text: getMethodTemplate(lang, selectedMethod).development,
        },
        {
          stage: text.stages[2],
          minutes: periodType === 'double' ? STAGE_MINUTES_DOUBLE.design : STAGE_MINUTES_SINGLE.design,
          text: getMethodTemplate(lang, selectedMethod).design,
        },
        {
          stage: text.stages[3],
          minutes: periodType === 'double' ? STAGE_MINUTES_DOUBLE.realization : STAGE_MINUTES_SINGLE.realization,
          text: getMethodTemplate(lang, selectedMethod).realization,
        },
      ]
    : [];
  const replacePart = (text: string) => text.split('{part}').join(selectedPart?.part ?? '');
  const printedRemark = selectedRemark && !NO_REMARK_OPTIONS.includes(selectedRemark)
    ? selectedRemark
    : '';
  const fitToPage = useFitToPage(printSheetRef, [
    className,
    date,
    districtName,
    periodType,
    printedTime,
    processRows,
    schoolName,
    selectedPart,
    selectedRemark,
    selectedResources,
    selectedSlotId,
    subject,
    teacherName,
    registeredGirls,
    registeredBoys,
    presentGirls,
    presentBoys,
  ]);

  const resetTopicAndBelow = () => {
    setTopic('');
    setSubtopic('');
    setPartId('');
    setSelectedResources([]);
    setSelectedRemark('');
  };

  const handleClassChange = (nextClassName: string) => {
    const nextRegistered = registeredStudents[nextClassName];
    setClassName(nextClassName);
    setRegisteredGirlsValue(String(readCount(nextRegistered?.regG)));
    setRegisteredBoysValue(String(readCount(nextRegistered?.regB)));
    setRegisteredGirlsError('');
    setRegisteredBoysError('');
    setPresentGirls('');
    setPresentBoys('');
    resetTopicAndBelow();
  };

  const updateRegisteredCount = (
    value: string,
    adminMaximum: number,
    setValue: (next: string) => void,
    setError: (next: string) => void,
    setPresentValue: Dispatch<SetStateAction<string>>,
  ) => {
    if (value === '') {
      setValue('');
      setError('');
      setPresentValue('');
      return;
    }
    if (!/^\d+$/.test(value)) {
      setError('Enter a whole number greater than or equal to 0.');
      return;
    }

    const requestedCount = Number(value);
    const count = Math.min(requestedCount, adminMaximum);
    setValue(String(count));
    setError(requestedCount > adminMaximum
      ? `Cannot be more than the registered number set by admin (${adminMaximum})`
      : '');
    setPresentValue(current => {
      if (!/^\d+$/.test(current)) return current;
      return Number(current) > count ? String(count) : current;
    });
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
                setRegisteredGirlsValue('');
                setRegisteredBoysValue('');
                setRegisteredGirlsError('');
                setRegisteredBoysError('');
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
                onChange={event => handleClassChange(event.target.value)}
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
                      const nextName = periodType === 'double' ? storedTimeSlots[slotIndex + 1]?.name : '';
                      const label = nextName ? `${slot.name} + ${nextName}` : slot.name;
                      return <option key={slot.id} value={slot.id}>{label}: {slot.startTime} - {end}</option>;
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
                  <th className="border border-slate-300 p-2">Registration</th>
                  {['Girls', 'Boys', 'Total'].map(label => <th key={label} className="border border-slate-300 p-2">{label}</th>)}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th className="border border-slate-300 p-2 text-left">Registered</th>
                  <td className="border border-slate-300 p-2">
                    <input
                      type="number"
                      min="0"
                      max={adminRegisteredGirls}
                      step="1"
                      inputMode="numeric"
                      aria-label="Registered girls"
                      value={registeredGirlsValue}
                      onChange={event => updateRegisteredCount(
                        event.target.value,
                        adminRegisteredGirls,
                        setRegisteredGirlsValue,
                        setRegisteredGirlsError,
                        setPresentGirls,
                      )}
                      className="w-full rounded border border-slate-300 px-2 py-1 text-sm"
                    />
                    <p className="mt-1 text-[11px] text-slate-500">max {adminRegisteredGirls}</p>
                    {registeredGirlsError && <p className="mt-1 text-[11px] text-red-600">{registeredGirlsError}</p>}
                  </td>
                  <td className="border border-slate-300 p-2">
                    <input
                      type="number"
                      min="0"
                      max={adminRegisteredBoys}
                      step="1"
                      inputMode="numeric"
                      aria-label="Registered boys"
                      value={registeredBoysValue}
                      onChange={event => updateRegisteredCount(
                        event.target.value,
                        adminRegisteredBoys,
                        setRegisteredBoysValue,
                        setRegisteredBoysError,
                        setPresentBoys,
                      )}
                      className="w-full rounded border border-slate-300 px-2 py-1 text-sm"
                    />
                    <p className="mt-1 text-[11px] text-slate-500">max {adminRegisteredBoys}</p>
                    {registeredBoysError && <p className="mt-1 text-[11px] text-red-600">{registeredBoysError}</p>}
                  </td>
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
            onClick={() => {
              window.print();
            }}
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
          <article ref={printSheetRef} className="lesson-plan-print">
            <header className="lesson-plan-header">
              <div className="lesson-plan-header-logo">
                {schoolLogo && <img src={schoolLogo} alt="School logo" />}
              </div>
              <div className="lesson-plan-header-copy">
                <h1>{text.title}</h1>
                <p className="lesson-plan-council">{lang === 'sw' ? swahiliCouncilName(districtName) : districtName}</p>
                <p className="lesson-plan-school-name">{lang === 'sw' ? swahiliSchoolName(schoolName) : schoolName}</p>
              </div>
              <div className="lesson-plan-header-spacer" aria-hidden="true" />
            </header>

            <table className="lesson-plan-meta">
              <tbody>
                <tr>
                  <th>{text.teacher}</th><td>{teacherName}</td>
                  <th>{text.subject}</th><td>{lang === 'sw' ? subject.toUpperCase() : subject}</td>
                </tr>
                <tr>
                  <th>{text.className}</th><td>{printedClassName}</td>
                  <th>{text.date}</th><td>{date ? formatDate(date) : ''}</td>
                </tr>
                <tr>
                  <th>{text.time}</th><td>{printedTime}</td>
                  <th>{text.periodType}</th><td>{periodType === 'double' ? text.double : periodType === 'single' ? text.single : ''}</td>
                </tr>
              </tbody>
            </table>

            <section className="lesson-plan-block lesson-plan-students-block">
              <h2 className="lesson-plan-block-title">{text.students}</h2>
              <table className="lesson-plan-students">
                <thead>
                  <tr><th>{text.registration}</th><th>{text.girls}</th><th>{text.boys}</th><th>{text.total}</th></tr>
                </thead>
                <tbody>
                  <tr><th>{text.registered}</th><td>{registeredGirls}</td><td>{registeredBoys}</td><td>{registeredTotal}</td></tr>
                  <tr><th>{text.present}</th><td>{presentGirlsCount}</td><td>{presentBoysCount}</td><td>{presentTotal}</td></tr>
                  <tr><th>{text.absent}</th><td>{absentGirls}</td><td>{absentBoys}</td><td>{absentTotal}</td></tr>
                </tbody>
              </table>
            </section>

            <section className="lesson-plan-block lesson-plan-details-block">
              <table className="lesson-plan-details">
                <tbody>
                  <tr><th>{text.mainCompetence}</th><td>{unit?.mainCompetence}</td></tr>
                  <tr><th>{text.specificCompetence}</th><td>{unit?.specificCompetence}</td></tr>
                  <tr><th>{text.mainActivity}</th><td>{unit && selectedPart ? `${unit.mainActivity} – ${text.focus}: ${selectedPart.part}` : unit?.mainActivity}</td></tr>
                  <tr>
                    <th>{text.specificActivities}</th>
                    <td>{selectedPart && <ol>{selectedPart.specificActivities.map(activity => <li key={activity}>{activity}</li>)}</ol>}</td>
                  </tr>
                  <tr><th>{text.resources}</th><td>{selectedResources.join(', ')}</td></tr>
                  <tr><th>{text.references}</th><td>{selectedForm && lessonSubject ? getReference(lessonSubject, selectedForm) : ''}</td></tr>
                </tbody>
              </table>
            </section>

            <section className="lesson-plan-block lesson-plan-process-section">
              <h2 className="lesson-plan-block-title">{text.process}</h2>
              <table className="lesson-plan-process">
                <thead>
                  <tr><th>{text.stage}</th><th>{text.minutes}</th><th>{text.teaching}</th><th>{text.learning}</th></tr>
                </thead>
                <tbody>
                  {processRows.map(row => (
                    <tr key={row.stage}>
                      <th>{row.stage.toUpperCase()}</