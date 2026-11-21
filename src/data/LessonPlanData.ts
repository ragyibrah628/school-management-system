// src/data/lessonPlanData.ts
// Lesson Plan data for Computer Science Form I and Form II (TIE 2023 syllabus + Student's Books).
// Source of truth for the Lesson Plan form. Nothing here is stored in the database.
// TODO (Mr. Kijida): fill REFERENCES from the copyright page of each Student's Book.

export type MethodKey =
  | 'brainstorming'
  | 'tips'
  | 'qa'
  | 'smallGroups'
  | 'groupDiscussion'
  | 'demonstration'
  | 'practical'
  | 'caseStudy'
  | 'jigsaw'
  | 'visual'
  | 'problemSolving'
  | 'scenario'
  | 'guestSpeaker'
  | 'projectActivity'
  | 'skillsLab'
  | 'fieldTrip'
  | 'rolePlay';

// Mbinu za ziada zinazotumika kwenye masomo ya Kiswahili (Utafiti mdogo, Matembezi ya galari, Mdahalo, Tafakuri).
export type SwMethodKey = MethodKey | 'research' | 'gallery' | 'debate' | 'reflection';

export const METHOD_LABELS: Record<MethodKey, string> = {
  brainstorming: 'Brainstorming',
  tips: 'Think-Ink-Pair-Share (TIPS)',
  qa: 'Question and answer',
  smallGroups: 'Small groups',
  groupDiscussion: 'Group discussion',
  demonstration: 'Demonstration',
  practical: 'Practical work',
  caseStudy: 'Case study',
  jigsaw: 'Jigsaw',
  visual: 'Observation / visual aids',
  problemSolving: 'Problem solving',
  scenario: 'Scenario',
  guestSpeaker: 'Guest speaker (resourceful person)',
  projectActivity: 'Project activity',
  skillsLab: 'Skills lab',
  fieldTrip: 'Field trip',
  rolePlay: 'Role play / simulation',
};

export interface SyllabusUnit {
  mainCompetence: string;
  specificCompetence: string;
  mainActivity: string;
  methods: SwMethodKey[];
  resources: string[];
}

export const COMMON_RESOURCES = [
  'Computer',
  'Projector',
  'Smart board',
  'Chalkboard / whiteboard',
  'Markers and chalk',
  'Handouts',
  "Student's book (Computer Science, Form One/Two as applicable)",
  'Flip chart',
  'Charts and pictures',
  'Smart phone',
  'Tablet',
  'Internet connectivity',
  'Printer',
  'Scanner',
  'Flash disk',
  'Syllabus',
  'Simulated steps videos',
];

const MC1 = 'Demonstrate mastery of the basic concepts of Computer Science';
const MC2 = 'Demonstrate mastery of the basic principles of Computer Science';

// Keys = syllabus numbering. Where the syllabus has no explicit activity for a book section
// (Form I Ch.6 and Ch.7), the closest unit (1.3) is used and the mainActivity is derived from the book.
export const UNITS: Record<string, SyllabusUnit> = {
  // ---------- FORM I ----------
  'F1-1.1a': { mainCompetence: MC1, specificCompetence: 'Demonstrate an understanding of the concept of Computer Science', mainActivity: 'Describe the concept of Computer Science (meaning, importance, application)', methods: ['brainstorming', 'tips'], resources: ['Handouts with contents of Computer Science concepts'] },
  'F1-1.1b': { mainCompetence: MC1, specificCompetence: 'Demonstrate an understanding of the concept of Computer Science', mainActivity: 'Describe fields related to Computer Science (IT, ICT, IS, Computer Engineering)', methods: ['qa', 'caseStudy'], resources: ['Handouts with contents of Computer Science concepts'] },
  'F1-1.2a': { mainCompetence: MC1, specificCompetence: 'Demonstrate an understanding of computer systems', mainActivity: 'Describe computer systems (meaning, types, functions and significance)', methods: ['qa'], resources: ['Computer', 'Handout', 'Flip board', 'Digital podium', 'Electronic blackboard'] },
  'F1-1.2b': { mainCompetence: MC1, specificCompetence: 'Demonstrate an understanding of computer systems', mainActivity: 'Describe computer hardware (meaning, components, functions, computer generations)', methods: ['smallGroups', 'demonstration', 'practical'], resources: ['Computer', 'Printer', 'Scanner', 'Camera', 'Projector', 'Flash disk', 'Hard disk', 'Memory card', 'Smart phone', 'Tablet', 'Motherboard'] },
  'F1-1.2c': { mainCompetence: MC1, specificCompetence: 'Demonstrate an understanding of computer systems', mainActivity: 'Describe computer software (meaning, types, functions)', methods: ['tips', 'demonstration'], resources: ['Computer', 'Handout', 'Digital podium'] },
  'F1-1.2d': { mainCompetence: MC1, specificCompetence: 'Demonstrate an understanding of computer systems', mainActivity: 'Describe and observe principles of computer system handling (safety measures, management, cleanliness, data backup and utilities)', methods: ['groupDiscussion', 'demonstration', 'practical'], resources: ['Computer', 'Printer', 'Scanner', 'Projector', 'Flash disk', 'Memory card', 'Smart phone', 'Tablet', 'Hard disk'] },
  'F1-1.3a': { mainCompetence: MC1, specificCompetence: 'Demonstrate mastery of maintenance and troubleshooting of computer systems', mainActivity: 'Install simple computer software', methods: ['demonstration', 'practical'], resources: ['Computer', 'CDs with different software', 'Handout', 'Hard disk'] },
  'F1-1.3m': { mainCompetence: MC1, specificCompetence: 'Demonstrate mastery of maintenance and troubleshooting of computer systems', mainActivity: 'Describe and perform computer system maintenance', methods: ['groupDiscussion', 'demonstration', 'practical'], resources: ['Computer', 'Handout', 'Cleaning tools', 'Simulated steps videos'] },
  'F1-1.3t': { mainCompetence: MC1, specificCompetence: 'Demonstrate mastery of maintenance and troubleshooting of computer systems', mainActivity: 'Describe and perform computer system troubleshooting', methods: ['caseStudy', 'demonstration', 'practical'], resources: ['Computer', 'Handout', 'Simulated steps videos', 'Smart phone'] },
  'F1-2.1a': { mainCompetence: MC2, specificCompetence: 'Demonstrate mastery of the basic principles in problem solving using computers', mainActivity: 'Describe the steps in solving a problem using computers (concept of problem solving, steps of problem solving)', methods: ['brainstorming'], resources: ['Computer', 'Smart phone', 'Handouts on basic principles in problem solving', 'Tablet'] },
  'F1-2.1b': { mainCompetence: MC2, specificCompetence: 'Demonstrate mastery of the basic principles in problem solving using computers', mainActivity: 'Demonstrate an understanding of basic principles of algorithms', methods: ['brainstorming', 'demonstration'], resources: ['Computer', 'Smart phone', 'Handouts on basic principles in problem solving', 'Tablet'] },
  'F1-2.1c': { mainCompetence: MC2, specificCompetence: 'Demonstrate mastery of the basic principles in problem solving using computers', mainActivity: 'Design and present a single algorithm using flow charts and pseudocode', methods: ['demonstration'], resources: ['Computer', 'Smart phone', 'Handouts on basic principles in problem solving', 'Tablet'] },

  // ---------- FORM II ----------
  'F2-1.5a': { mainCompetence: MC1, specificCompetence: 'Demonstrate mastery of the Internet and basics of cyber security', mainActivity: 'Describe the concept of the Internet and cyber security (ethics, security and privacy)', methods: ['groupDiscussion', 'caseStudy'], resources: ['Projector', 'Computer', 'Handout', 'TV', 'Smart board', 'Digital podium', 'Internet connectivity'] },
  'F2-1.5b': { mainCompetence: MC1, specificCompetence: 'Demonstrate mastery of the Internet and basics of cyber security', mainActivity: 'Use Internet services (searching information, www, electronic mail)', methods: ['practical'], resources: ['Computer with Internet connectivity'] },
  'F2-1.5c': { mainCompetence: MC1, specificCompetence: 'Demonstrate mastery of the Internet and basics of cyber security', mainActivity: 'Understand cyber security threats and related counter measures', methods: ['tips', 'caseStudy'], resources: ['Projector', 'Computer', 'Handout', 'Internet connectivity'] },
  'F2-1.5d': { mainCompetence: MC1, specificCompetence: 'Demonstrate mastery of the Internet and basics of cyber security', mainActivity: 'Evaluate ethical issues, related principles and practices of cyber security', methods: ['caseStudy'], resources: ['Projector', 'Computer', 'Handout', 'Internet connectivity'] },
  'F2-1.5e': { mainCompetence: MC1, specificCompetence: 'Demonstrate mastery of the Internet and basics of cyber security', mainActivity: 'Apply basic cyber security measures (passwords, safe browsing, netiquette)', methods: ['caseStudy', 'practical'], resources: ['Projector', 'Computer', 'Internet connectivity'] },
  'F2-2.2a': { mainCompetence: MC2, specificCompetence: 'Demonstrate an understanding of basic principles of computer programming', mainActivity: 'Describe the concept of programming language (categories, paradigm, generic structures)', methods: ['tips', 'qa', 'groupDiscussion'], resources: ['Computer installed with appropriate programming tools', 'Handout'] },
  'F2-2.2b': { mainCompetence: MC2, specificCompetence: 'Demonstrate an understanding of basic principles of computer programming', mainActivity: 'Describe programming tools (compiler/interpreter, text editor, IDE, debugger)', methods: ['groupDiscussion'], resources: ['Computer installed with appropriate programming tools', 'Handout'] },
  'F2-2.2c': { mainCompetence: MC2, specificCompetence: 'Demonstrate an understanding of basic principles of computer programming', mainActivity: 'Install and configure the selected programming language tools', methods: ['demonstration', 'practical'], resources: ['Computer installed with appropriate programming tools', 'Installation files'] },
  'F2-2.2d': { mainCompetence: MC2, specificCompetence: 'Demonstrate an understanding of basic principles of computer programming', mainActivity: 'Use programming tools of the selected language to write a program (compile/run and debug a simple program)', methods: ['practical'], resources: ['Computer installed with appropriate programming tools'] },
  'F2-2.2e': { mainCompetence: MC2, specificCompetence: 'Demonstrate an understanding of basic principles of computer programming', mainActivity: 'Use variables, constants and data types of the selected programming language in a program (operators and expressions)', methods: ['practical'], resources: ['Computer installed with appropriate programming tools'] },
  'F2-2.2f': { mainCompetence: MC2, specificCompetence: 'Demonstrate an understanding of basic principles of computer programming', mainActivity: 'Use syntax and constructs of the selected programming language to write programs (branching and loops)', methods: ['practical'], resources: ['Computer installed with appropriate programming tools'] },
  'F2-2.2g': { mainCompetence: MC2, specificCompetence: 'Demonstrate an understanding of basic principles of computer programming', mainActivity: 'Debug computer programs', methods: ['demonstration', 'practical'], resources: ['Computer installed with appropriate programming tools'] },
};

export interface LessonPart {
  id: string;
  subject: 'Computer Science' | 'Mathematics' | 'Business Studies' | 'English Language' | 'Geography' | 'History' | 'Physics' | 'Chemistry' | 'Biology' | 'Historia ya Tanzania na Maadili' | 'Kiswahili';
  form: 1 | 2 | 3 | 4;
  topic: string;      // Chapter title from the Student's Book
  subtopic: string;   // Section title from the Student's Book
  part: string;       // Lesson-sized part (one 40-minute period). PROPOSED, editable.
  unit: keyof typeof UNITS;
  specificActivities: string[]; // 2 short learner-outcome statements
}

export const buildRemarkOptions = (part: LessonPart): string[] => {
  const skill = part.specificActivities[0] ?? '';
  const lowercaseSkill = skill ? `${skill[0].toLowerCase()}${skill.slice(1)}` : '';

  return [
    `The lesson was successful. Most learners were able to ${lowercaseSkill}.`,
    `The lesson was partially successful. Some learners need more practice on "${part.part}"; a short revision will be done in the next lesson.`,
    `The lesson was not completed as planned because of limited time or resources. "${part.part}" will be continued in the next lesson.`,
    'No remark (leave blank lines)',
  ];
};

let _n = 0;
const P = (form: 1 | 2 | 3 | 4, topic: string, subtopic: string, part: string, unit: string, ...specificActivities: string[]): LessonPart =>
  ({ id: `f${form}-${++_n}`, subject: 'Computer Science', form, topic, subtopic, part, unit, specificActivities });

const T1 = 'Introduction to Computer Science';
const T2 = 'Computer systems';
const T3 = 'Computer hardware';
const T4 = 'Computer software';
const T5 = 'Computer system handling and care';
const T6 = 'Computer system maintenance';
const T7 = 'Computer system troubleshooting';
const T8 = 'Problem solving';

export const LESSON_PARTS: LessonPart[] = [
  // ===== FORM I =====
  P(1, T1, 'Concept of Computer Science', 'Meaning of Computer Science', 'F1-1.1a', 'Define Computer Science', 'Explain what Computer Science studies'),
  P(1, T1, 'Concept of Computer Science', 'Importance of Computer Science', 'F1-1.1a', 'State the importance of Computer Science', 'Give examples of how Computer Science helps in daily life'),
  P(1, T1, 'Applications of Computer Science', 'Applications in education, health and business', 'F1-1.1a', 'Identify applications of Computer Science in education, health and business', 'Explain how computers are used in each area'),
  P(1, T1, 'Applications of Computer Science', 'Applications in other areas (agriculture, transport, security, entertainment)', 'F1-1.1a', 'Identify other areas where Computer Science is applied', 'Explain how computers are used in each area'),
  P(1, T1, 'Fields related to Computer Science', 'IT, ICT, Information Systems and Computer Engineering', 'F1-1.1b', 'Name fields related to Computer Science', 'Differentiate IT, ICT, IS and Computer Engineering'),

  P(1, T2, 'Concept of computer systems', 'Meaning, components and functions of a computer system', 'F1-1.2a', 'Define a computer system', 'Identify components of a computer system and state their functions'),
  P(1, T2, 'Computer generations', 'First to second generation computers', 'F1-1.2b', 'Describe the first and second generation computers', 'State the technology used in each generation'),
  P(1, T2, 'Computer generations', 'Third to fifth generation computers', 'F1-1.2b', 'Describe the third, fourth and fifth generation computers', 'Compare the generations of computers'),
  P(1, T2, 'Classification of computers', 'Classification by size and processing power', 'F1-1.2a', 'Classify computers by size', 'Give examples of each class of computer'),
  P(1, T2, 'Classification of computers', 'Classification by purpose and type of data handled', 'F1-1.2a', 'Classify computers by purpose and by data handled', 'Differentiate analog, digital and hybrid computers'),

  P(1, T3, 'Concept of computer hardware', 'Meaning and components of computer hardware', 'F1-1.2b', 'Define computer hardware', 'Identify the main hardware components'),
  P(1, T3, 'Input devices', 'Keyboard and pointing devices', 'F1-1.2b', 'Identify the keyboard and pointing devices', 'State the function of each device'),
  P(1, T3, 'Input devices', 'Scanners, cameras, microphones and other input devices', 'F1-1.2b', 'Identify scanners, cameras, microphones and other input devices', 'State the function of each device'),
  P(1, T3, 'Processing', 'The CPU and its functions', 'F1-1.2b', 'Identify parts of the CPU', 'State the functions of the control unit and the ALU'),
  P(1, T3, 'Processing', 'The motherboard and memory (RAM and ROM)', 'F1-1.2b', 'Identify the motherboard and memory types', 'Differentiate RAM from ROM'),
  P(1, T3, 'Storage devices', 'Primary and secondary storage devices', 'F1-1.2b', 'Differentiate primary from secondary storage', 'Give examples of storage devices'),
  P(1, T3, 'Output devices', 'Monitors and projectors', 'F1-1.2b', 'Identify monitors and projectors', 'State their functions and uses'),
  P(1, T3, 'Output devices', 'Printers, speakers and other output devices', 'F1-1.2b', 'Identify printers, speakers and other output devices', 'State their functions and uses'),

  P(1, T4, 'Concept of computer software', 'Meaning and types of computer software', 'F1-1.2c', 'Define computer software', 'Name the types of software'),
  P(1, T4, 'System software', 'Operating systems', 'F1-1.2c', 'Define an operating system', 'State the functions of an operating system'),
  P(1, T4, 'System software', 'Utility programs, device drivers and language translators', 'F1-1.2c', 'Identify utility programs, device drivers and language translators', 'State the function of each'),
  P(1, T4, 'Application software', 'Types and examples of application software', 'F1-1.2c', 'Differentiate general-purpose from specific-purpose application software', 'Give examples of each'),
  P(1, T4, 'Software installation', 'Installing simple software', 'F1-1.3a', 'List the steps of installing software', 'Install a simple program on a computer'),

  P(1, T5, 'Concept of computer handling and care', 'Meaning and importance of computer handling and care', 'F1-1.2d', 'Define computer handling and care', 'Explain why computers should be handled with care'),
  P(1, T5, 'Hardware care', 'Cleanliness and a suitable working environment', 'F1-1.2d', 'Describe how to keep hardware clean', 'Identify environmental factors that harm computers (dust, heat, humidity)'),
  P(1, T5, 'Hardware care', 'Power protection and handling of peripherals', 'F1-1.2d', 'Describe correct power connection and shutdown', 'Handle peripheral devices correctly'),
  P(1, T5, 'Software care', 'Protecting and caring for software', 'F1-1.2d', 'Describe ways of caring for software (updates, antivirus, backups)', 'Perform a simple data backup'),
  P(1, T5, 'Safe handling practices', 'Safety measures in the computer laboratory', 'F1-1.2d', 'State safety rules in the computer laboratory', 'Apply safe handling practices'),

  P(1, T6, 'Concept of computer system maintenance', 'Meaning and importance of computer maintenance', 'F1-1.3m', 'Define computer maintenance', 'Explain why computers need maintenance'),
  P(1, T6, 'Preventive maintenance', 'Preventive maintenance', 'F1-1.3m', 'Describe preventive maintenance activities', 'Perform a simple preventive maintenance task'),
  P(1, T6, 'Corrective maintenance', 'Corrective maintenance', 'F1-1.3m', 'Describe corrective maintenance', 'Give examples of corrective maintenance tasks'),
  P(1, T6, 'Routine maintenance', 'Routine maintenance', 'F1-1.3m', 'Describe routine maintenance', 'Prepare a routine maintenance schedule'),

  P(1, T7, 'Concept of computer troubleshooting', 'Meaning and steps of troubleshooting', 'F1-1.3t', 'Define troubleshooting', 'List the steps of troubleshooting'),
  P(1, T7, 'Hardware troubleshooting', 'Hardware troubleshooting', 'F1-1.3t', 'Identify common hardware problems', 'Suggest solutions to hardware problems'),
  P(1, T7, 'Software troubleshooting', 'Software troubleshooting', 'F1-1.3t', 'Identify common software problems', 'Suggest solutions to software problems'),
  P(1, T7, 'Performance troubleshooting', 'Performance troubleshooting', 'F1-1.3t', 'Identify causes of poor computer performance', 'Suggest ways of improving performance'),
  P(1, T7, 'Electrical troubleshooting', 'Electrical troubleshooting', 'F1-1.3t', 'Identify common electrical problems', 'Apply electrical safety when troubleshooting'),

  P(1, T8, 'Concept of problem solving', 'Meaning of problem solving', 'F1-2.1a', 'Define problem solving', 'Give examples of problems solved using computers'),
  P(1, T8, 'Steps of problem solving', 'Steps of problem solving', 'F1-2.1a', 'List the steps of problem solving', 'Apply the steps to a simple problem'),
  P(1, T8, 'Algorithms', 'Concept of an algorithm', 'F1-2.1b', 'Define an algorithm', 'State the characteristics of a good algorithm'),
  P(1, T8, 'Construction of algorithms', 'Constructing algorithms', 'F1-2.1b', 'Construct a simple algorithm', 'Test the algorithm with sample data'),
  P(1, T8, 'Representation of algorithms', 'Representing algorithms using flowcharts', 'F1-2.1c', 'Identify flowchart symbols', 'Draw a flowchart for a simple algorithm'),
  P(1, T8, 'Representation of algorithms using pseudocode', 'Representing algorithms using pseudocode', 'F1-2.1c', 'Write pseudocode for a simple algorithm', 'Convert an algorithm to pseudocode'),
  P(1, T8, 'Iteration control structure in flowcharts', 'Iteration (looping) in flowcharts', 'F1-2.1c', 'Explain iteration in algorithms', 'Draw a flowchart that uses iteration'),

  // ===== FORM II =====
  ...(() => {
    const A = 'The Internet', B = 'Cybersecurity', C = 'Introduction to computer programming', D = 'Computer programming with C', E = 'Computer programming with Python';
    return [
      P(2, A, 'The concept of the Internet', 'Meaning and history of the Internet', 'F2-1.5a', 'Define the Internet', 'Describe how the Internet developed'),
      P(2, A, 'Basic Internet related concepts', 'Basic Internet concepts (WWW, URL, browser, search engine, ISP)', 'F2-1.5a', 'Explain basic Internet terms', 'Differentiate the Internet from the World Wide Web'),
      P(2, A, 'Internet connectivity', 'Ways of connecting to the Internet', 'F2-1.5a', 'Identify requirements for Internet connection', 'Compare types of Internet connection'),
      P(2, A, 'The Internet services and applications', 'Searching for information and the World Wide Web', 'F2-1.5b', 'Search for information using a search engine', 'Evaluate search results'),
      P(2, A, 'The Internet services and applications', 'Electronic mail (email) and other Internet services', 'F2-1.5b', 'Create an email account and send an email', 'Identify other Internet services'),
      P(2, A, 'Ethical and responsible use of the Internet', 'Ethical and responsible use of the Internet', 'F2-1.5d', 'Explain ethical use of the Internet', 'Practise responsible online behaviour'),

      P(2, B, 'Concept of cybersecurity', 'Meaning and importance of cybersecurity', 'F2-1.5a', 'Define cybersecurity', 'Explain why cybersecurity is important'),
      P(2, B, 'Cyber threats and attacks', 'Types of cyber threats (malware, viruses)', 'F2-1.5c', 'Identify types of cyber threats', 'Describe how malware spreads'),
      P(2, B, 'Cyber threats and attacks', 'Cyber attacks and counter measures (phishing, hacking)', 'F2-1.5c', 'Describe common cyber attacks', 'Suggest counter measures for each attack'),
      P(2, B, 'Cybercrimes', 'Cybercrimes and their effects', 'F2-1.5c', 'Identify types of cybercrimes', 'Explain the effects of cybercrimes'),
      P(2, B, 'Ethical issues and related principles', 'Ethical issues and principles in cyberspace', 'F2-1.5d', 'Explain ethical issues in cyberspace', 'Evaluate cases against ethical principles'),
      P(2, B, 'Practices of cybersecurity', 'Passwords, safe browsing and netiquette', 'F2-1.5e', 'Create a strong password', 'Apply safe browsing and netiquette'),
      P(2, B, 'Practices of cybersecurity', 'Other cybersecurity practices (antivirus, updates, backups)', 'F2-1.5e', 'Apply protective practices on a computer', 'Explain why each practice is important'),
      P(2, B, 'Cloud security', 'Cloud computing and cloud security', 'F2-1.5c', 'Explain cloud computing', 'Describe ways of keeping data safe in the cloud'),

      P(2, C, 'The concept of programming', 'Meaning of programming and programs', 'F2-2.2a', 'Define programming and a program', 'Explain why programs are needed'),
      P(2, C, 'Understanding computers and programming: from hardware to code', 'From hardware to code', 'F2-2.2a', 'Explain how a computer executes a program', 'Relate machine language to high-level languages'),
      P(2, C, 'Important terms in programming', 'Important terms in programming', 'F2-2.2a', 'Define key programming terms', 'Use the terms correctly'),
      P(2, C, 'Introduction to programming languages', 'Categories and paradigms of programming languages', 'F2-2.2a', 'Describe categories of programming languages', 'Differentiate programming paradigms'),
      P(2, C, 'Introduction to programming languages', 'Programming tools (compiler, interpreter, editor, IDE, debugger)', 'F2-2.2b', 'Describe programming tools', 'Differentiate a compiler from an interpreter'),
      P(2, C, 'Algorithms in programming', 'Algorithms in programming', 'F2-2.2a', 'Write an algorithm for a programming task', 'Convert an algorithm into program steps'),
      P(2, C, 'Data types and data structures', 'Data types and data structures', 'F2-2.2e', 'Identify basic data types', 'Identify simple data structures'),
      P(2, C, 'Thinking like a programmer: problem-solving skills', 'Problem-solving skills of a programmer', 'F2-2.2a', 'Break a problem into smaller parts', 'Plan a solution before coding'),
      P(2, C, 'Debugging: Identifying and fixing errors in code', 'Types of errors and debugging', 'F2-2.2g', 'Identify types of programming errors', 'Fix errors in a simple program'),

      P(2, D, 'The concept of C programming', 'Introduction to the C language and installing a C compiler', 'F2-2.2c', 'Describe the C language', 'Install and configure a C compiler or IDE'),
      P(2, D, 'Basic syntax and structure of a C program', 'Structure of a C program and writing the first program', 'F2-2.2d', 'Identify parts of a C program', 'Write, compile and run a simple C program'),
      P(2, D, 'Variables, data types, and constants', 'Variables, data types and constants in C', 'F2-2.2e', 'Declare variables and constants in C', 'Use data types correctly'),
      P(2, D, 'Operators and expressions', 'Operators and expressions in C', 'F2-2.2e', 'Use arithmetic, relational and logical operators', 'Evaluate expressions'),
      P(2, D, 'Control flow in C', 'Branching in C (if, if-else, switch)', 'F2-2.2f', 'Write programs using branching', 'Trace the program output'),
      P(2, D, 'Control flow in C', 'Loops in C (for, while, do-while)', 'F2-2.2f', 'Write programs using loops', 'Trace the program output'),
      P(2, D, 'Functions in C programming', 'Functions in C', 'F2-2.2f', 'Define and call functions', 'Use parameters and return values'),
      P(2, D, 'Arrays and strings', 'Arrays and strings in C', 'F2-2.2f', 'Declare and use arrays and strings', 'Process array elements using loops'),
      P(2, D, 'File handling', 'File handling in C', 'F2-2.2f', 'Open, read and write a file', 'Close a file correctly'),
      P(2, D, 'Debugging and error handling', 'Debugging and error handling in C', 'F2-2.2g', 'Identify errors in C programs', 'Debug a C program'),

      P(2, E, 'The concept of Python programming', 'Introduction to Python and installing Python', 'F2-2.2c', 'Describe the Python language', 'Install and configure Python and an editor/IDE'),
      P(2, E, 'Python basics – syntax and structure', 'Python syntax and writing the first program', 'F2-2.2d', 'Explain Python syntax rules (indentation, comments)', 'Write and run a simple Python program'),
      P(2, E, 'Variables, data types, and operators', 'Variables, data types and operators in Python', 'F2-2.2e', 'Declare variables and use data types', 'Use operators in expressions'),
      P(2, E, 'Conditional statements control flow in Python', 'Conditional statements in Python', 'F2-2.2f', 'Write programs using if, elif and else', 'Trace the program output'),
      P(2, E, 'Loops and iterations control flow in Python', 'Loops in Python', 'F2-2.2f', 'Write programs using for and while loops', 'Trace the program output'),
      P(2, E, 'Functions in Python', 'Functions in Python', 'F2-2.2f', 'Define and call functions', 'Use parameters and return values'),
      P(2, E, 'Python lists', 'Python lists', 'F2-2.2f', 'Create and modify lists', 'Process list items using loops'),
      P(2, E, 'Strings and string manipulation in Python', 'Strings and string manipulation', 'F2-2.2f', 'Use string operations and methods', 'Manipulate text in a program'),
      P(2, E, 'File handling basics in Python', 'File handling in Python', 'F2-2.2f', 'Open, read and write files', 'Close a file correctly'),
      P(2, E, 'Error handling in Python', 'Error handling in Python (try/except)', 'F2-2.2g', 'Identify types of errors in Python', 'Handle errors using try and except'),
      P(2, E, 'Python libraries (basic modules)', 'Python libraries (basic modules)', 'F2-2.2f', 'Import and use basic modules', 'Explain the benefits of libraries'),
    ];
  })(),
];

// =====================================================================================
// MATHEMATICS (TIE 2023 syllabus + Student's Book Form One). Kept separate from Computer Science.
// Lesson-sized parts are PROPOSED (one 40-minute period each) and can be edited.
// =====================================================================================

export const MATH_COMMON_RESOURCES = [
  'Chalkboard / whiteboard',
  'Markers and chalk',
  "Student's book (Mathematics, Form One/Two/Three as applicable)",
  'Calculator',
  'Ruler',
  'Mathematical set',
  'Graph paper',
  'Charts',
  'Handouts',
  'Flip chart',
  'Real objects',
  'Smart board',
  'Projector',
  'Computer',
  'Smart phone',
  'Syllabus',
];

const MM1 = 'Demonstrate mastery of mathematical language';
const MM2 = 'Demonstrate mastery of basic concepts in geometry and algebra';
const MM3 = 'Demonstrate mastery of basic concepts in coordinate geometry, trigonometry, circles, vectors, probability and statistics';

const NUMBER_RESOURCES = ['Calculator', 'Charts of real numbers', 'Ruler', 'Tape measure', 'Graph paper', 'Number line chart'];
const APPROX_RESOURCES = ['Calculator', 'Charts of a number line', 'Estimation jars', 'Estimation games'];
const RATIO_RESOURCES = ['Money', 'Charts of real-life scenarios', 'Calculator', 'Real objects', 'Bank statements'];
const ALGEBRA_RESOURCES = ['Beam balance', 'Real objects', 'Algebra animations', 'Number line chart', 'Graphing calculator'];
const COORD_RESOURCES = ['Graph paper', 'Ruler', 'Mathematical software (GeoGebra)', 'Calculator', 'Charts'];

Object.assign(UNITS, {
  'M1-1.1a': { mainCompetence: MM1, specificCompetence: 'Use numerical skills in different contexts', mainActivity: 'Explain the basic concepts of Mathematics (meaning of Mathematics, branches of Mathematics, relationship between Mathematics and other subjects, importance of Mathematics)', methods: ['groupDiscussion', 'brainstorming', 'jigsaw'], resources: ['Charts of relationships between Mathematics and other fields', 'Real objects', 'Math games and apps', 'Educational channels'] },
  'M1-1.1b': { mainCompetence: MM1, specificCompetence: 'Use numerical skills in different contexts', mainActivity: 'Explain the concept of rational, irrational and real numbers', methods: ['visual', 'problemSolving'], resources: NUMBER_RESOURCES },
  'M1-1.1c': { mainCompetence: MM1, specificCompetence: 'Use numerical skills in different contexts', mainActivity: 'Convert repeating/recurring decimals into fractions and vice versa', methods: ['problemSolving'], resources: ['Calculator', 'Charts of real numbers', 'Ruler', 'Graph paper'] },
  'M1-1.1d': { mainCompetence: MM1, specificCompetence: 'Use numerical skills in different contexts', mainActivity: 'Represent rational numbers on a number line', methods: ['groupDiscussion', 'problemSolving'], resources: NUMBER_RESOURCES },
  'M1-1.1e': { mainCompetence: MM1, specificCompetence: 'Use numerical skills in different contexts', mainActivity: 'Explain the concept of inequalities and absolute values of real numbers', methods: ['visual', 'qa'], resources: ['Number line chart', 'Graphing calculator', 'Calculator', 'Real objects'] },
  'M1-1.1f': { mainCompetence: MM1, specificCompetence: 'Use numerical skills in different contexts', mainActivity: 'Describe the importance of numbers in real-life situations', methods: ['brainstorming'], resources: ['Money', 'Real objects', 'Charts', 'Calculator'] },
  'M1-1.2a': { mainCompetence: MM1, specificCompetence: 'Use ratios and proportions in daily life', mainActivity: 'Explain the concept of ratios and proportions', methods: ['groupDiscussion', 'jigsaw'], resources: RATIO_RESOURCES },
  'M1-1.2b': { mainCompetence: MM1, specificCompetence: 'Use ratios and proportions in daily life', mainActivity: 'Solve ratio and proportion problems', methods: ['tips', 'problemSolving'], resources: RATIO_RESOURCES },
  'M1-2.1a': { mainCompetence: MM2, specificCompetence: 'Use geometry, approximations, relations and functions in various contexts', mainActivity: 'Explain the concept of approximations (rounding off, significant figures and decimal places)', methods: ['brainstorming', 'tips'], resources: APPROX_RESOURCES },
  'M1-2.1b': { mainCompetence: MM2, specificCompetence: 'Use geometry, approximations, relations and functions in various contexts', mainActivity: 'Round off numbers and estimate values of expressions', methods: ['groupDiscussion', 'problemSolving'], resources: APPROX_RESOURCES },
  'M1-2.1c': { mainCompetence: MM2, specificCompetence: 'Use geometry, approximations, relations and functions in various contexts', mainActivity: 'Approximate numbers to the required significant figures and decimal places', methods: ['jigsaw', 'problemSolving'], resources: APPROX_RESOURCES },
  'M1-2.1d': { mainCompetence: MM2, specificCompetence: 'Use geometry, approximations, relations and functions in various contexts', mainActivity: 'Use approximations in computations and measurements of quantities in various contexts', methods: ['jigsaw', 'problemSolving'], resources: [...APPROX_RESOURCES, 'Tape measure'] },
  'M1-2.2a': { mainCompetence: MM2, specificCompetence: 'Use algebra and matrices in problem solving', mainActivity: 'Explore the basic tenets of algebra (algebraic expressions and equations, linear simultaneous equations of two unknowns, inequalities in one unknown)', methods: ['groupDiscussion', 'visual'], resources: ALGEBRA_RESOURCES },
  'M1-2.2b': { mainCompetence: MM2, specificCompetence: 'Use algebra and matrices in problem solving', mainActivity: 'Use algebraic expressions to model situations (word problems into algebraic expressions and equations)', methods: ['problemSolving', 'groupDiscussion'], resources: ALGEBRA_RESOURCES },
  'M1-2.2c': { mainCompetence: MM2, specificCompetence: 'Use algebra and matrices in problem solving', mainActivity: 'Solve simultaneous equations using substitution and elimination methods', methods: ['tips', 'problemSolving'], resources: ALGEBRA_RESOURCES },
  'M1-2.2d': { mainCompetence: MM2, specificCompetence: 'Use algebra and matrices in problem solving', mainActivity: 'Solve inequalities in one unknown', methods: ['groupDiscussion', 'problemSolving'], resources: ALGEBRA_RESOURCES },
  'M1-3.1a': { mainCompetence: MM3, specificCompetence: 'Use basic coordinate geometry, trigonometry and vectors skills in daily life', mainActivity: 'Explore the basic tenets of coordinate geometry (gradient and equations of a straight line, graphs of linear equations)', methods: ['visual', 'groupDiscussion'], resources: COORD_RESOURCES },
  'M1-3.1b': { mainCompetence: MM3, specificCompetence: 'Use basic coordinate geometry, trigonometry and vectors skills in daily life', mainActivity: 'Find the gradient/slope of a line', methods: ['problemSolving', 'groupDiscussion'], resources: COORD_RESOURCES },
  'M1-3.1c': { mainCompetence: MM3, specificCompetence: 'Use basic coordinate geometry, trigonometry and vectors skills in daily life', mainActivity: 'Determine the equation of a straight line and draw its graph', methods: ['visual', 'problemSolving'], resources: COORD_RESOURCES },
  'M1-3.1d': { mainCompetence: MM3, specificCompetence: 'Use basic coordinate geometry, trigonometry and vectors skills in daily life', mainActivity: 'Solve linear simultaneous equations graphically', methods: ['visual', 'groupDiscussion'], resources: COORD_RESOURCES },
  'M1-3.1e': { mainCompetence: MM3, specificCompetence: 'Use basic coordinate geometry, trigonometry and vectors skills in daily life', mainActivity: 'Use mathematical software to solve and draw graphs of simultaneous equations', methods: ['practical', 'problemSolving'], resources: ['Computer', 'Mathematical software (GeoGebra)', 'Smart phone', 'Projector'] },
});

const PM = (topic: string, subtopic: string, part: string, unit: string, ...specificActivities: string[]): LessonPart =>
  ({ id: `m1-${++_n}`, subject: 'Mathematics', form: 1, topic, subtopic, part, unit, specificActivities });

const M1 = 'Concept of Mathematics';
const M2 = 'Numbers';
const M3 = 'Approximations';
const M4 = 'Ratios and proportions';
const M5 = 'Algebra';
const M6 = 'Coordinate geometry';

LESSON_PARTS.push(
  // ===== MATHEMATICS FORM I =====
  PM(M1, 'Meaning of Mathematics', 'Meaning of Mathematics', 'M1-1.1a', 'Define Mathematics in their own words', 'Give examples of where Mathematics is used'),
  PM(M1, 'Branches of Mathematics', 'Branches of Mathematics', 'M1-1.1a', 'Name the branches of Mathematics', 'Explain what each branch studies'),
  PM(M1, 'Relationship between Mathematics and other subjects', 'Relationship between Mathematics and other subjects', 'M1-1.1a', 'Show how Mathematics is related to other subjects', 'Give examples of Mathematics used in other subjects'),
  PM(M1, 'Importance of Mathematics', 'Importance of Mathematics', 'M1-1.1a', 'State the importance of Mathematics in daily life', 'Give examples of everyday activities that need Mathematics'),

  PM(M2, 'Concept of numbers', 'Meaning and types of numbers', 'M1-1.1b', 'Define a number and name the types of numbers', 'Classify given numbers into their types'),
  PM(M2, 'Concept of numbers', 'Importance of numbers in real life', 'M1-1.1f', 'Describe how numbers are used in real life', 'Give examples of numbers in money, measurement and time'),
  PM(M2, 'Rational numbers', 'Meaning of rational numbers', 'M1-1.1b', 'Define a rational number', 'Identify rational numbers from a given list'),
  PM(M2, 'Rational numbers', 'Fractions', 'M1-1.1b', 'Perform operations on fractions', 'Solve simple problems involving fractions'),
  PM(M2, 'Rational numbers', 'Decimals', 'M1-1.1b', 'Perform operations on decimals', 'Convert fractions to decimals and decimals to fractions'),
  PM(M2, 'Rational numbers', 'Percentages', 'M1-1.1b', 'Convert fractions and decimals to percentages', 'Solve simple problems involving percentages'),
  PM(M2, 'Rational numbers', 'Recurring decimals and fractions', 'M1-1.1c', 'Identify repeating (recurring) decimals', 'Convert recurring decimals into fractions and vice versa'),
  PM(M2, 'Rational numbers', 'Representing rational numbers on a number line', 'M1-1.1d', 'Draw a number line and locate rational numbers on it', 'Compare rational numbers using the number line'),
  PM(M2, 'Irrational numbers', 'Meaning and examples of irrational numbers', 'M1-1.1b', 'Define an irrational number', 'Differentiate rational from irrational numbers'),
  PM(M2, 'Real numbers', 'The real number system', 'M1-1.1b', 'Describe the real number system', 'Classify numbers as natural, whole, integer, rational, irrational or real'),
  PM(M2, 'Inequalities in real numbers', 'Meaning and symbols of inequalities', 'M1-1.1e', 'Explain the meaning of an inequality', 'Use the symbols <, >, ≤ and ≥ correctly'),
  PM(M2, 'Inequalities in real numbers', 'Inequalities on a number line', 'M1-1.1e', 'Represent inequalities on a number line', 'Read an inequality from a number line'),
  PM(M2, 'Absolute value of a real number', 'Absolute value of a real number', 'M1-1.1e', 'Explain the meaning of absolute value', 'Find the absolute value of given real numbers'),

  PM(M3, 'Meaning of approximations', 'Meaning of approximations', 'M1-2.1a', 'Explain the meaning of approximation', 'Give examples of where approximations are used'),
  PM(M3, 'Rounding off numbers', 'Rounding off to whole numbers, tens and hundreds', 'M1-2.1b', 'Round off numbers to the nearest whole number, ten and hundred', 'Solve simple problems using rounded numbers'),
  PM(M3, 'Rounding off numbers', 'Rounding off to decimal places', 'M1-2.1b', 'Round off numbers to a given number of decimal places', 'Explain the rules for rounding off'),
  PM(M3, 'Significant figures', 'Meaning of significant figures', 'M1-2.1c', 'Identify the significant figures in a number', 'Explain the rules for counting significant figures'),
  PM(M3, 'Significant figures', 'Rounding off to significant figures', 'M1-2.1c', 'Round off numbers to a given number of significant figures', 'Solve problems involving significant figures'),
  PM(M3, 'Approximations in calculations', 'Estimating values of expressions', 'M1-2.1b', 'Estimate the value of an expression by rounding', 'Compare the estimate with the exact answer'),
  PM(M3, 'Approximations in calculations', 'Approximations in measurements', 'M1-2.1d', 'Use approximations in measurements of length, mass and capacity', 'Solve real-life problems using approximations'),

  PM(M4, 'Ratios', 'Meaning and simplification of ratios', 'M1-1.2a', 'Explain the meaning of a ratio', 'Simplify ratios to their lowest terms'),
  PM(M4, 'Ratios', 'Dividing a quantity in a given ratio', 'M1-1.2b', 'Divide a quantity in a given ratio', 'Solve sharing problems using ratios'),
  PM(M4, 'Ratios', 'Solving problems on ratios', 'M1-1.2b', 'Solve real-life problems involving ratios', 'Compare quantities using ratios'),
  PM(M4, 'Proportions', 'Meaning of proportions', 'M1-1.2a', 'Explain the meaning of a proportion', 'Identify proportional quantities'),
  PM(M4, 'Proportions', 'Solving problems on proportions', 'M1-1.2b', 'Solve problems on direct proportion', 'Solve problems on inverse proportion'),

  PM(M5, 'Algebraic expressions', 'Meaning of algebraic expressions', 'M1-2.2a', 'Define terms, coefficients, variables and constants', 'Identify algebraic expressions'),
  PM(M5, 'Algebraic expressions', 'Operations on algebraic expressions', 'M1-2.2a', 'Add and subtract algebraic expressions', 'Multiply and simplify algebraic expressions'),
  PM(M5, 'Algebraic expressions', 'Forming algebraic expressions from word problems', 'M1-2.2b', 'Translate word statements into algebraic expressions', 'Evaluate algebraic expressions by substitution'),
  PM(M5, 'Algebraic equations', 'Meaning of algebraic equations', 'M1-2.2a', 'Explain the meaning of an algebraic equation', 'Differentiate an equation from an expression'),
  PM(M5, 'Algebraic equations', 'Solving linear equations', 'M1-2.2a', 'Solve linear equations in one unknown', 'Check the solution of an equation'),
  PM(M5, 'Algebraic equations', 'Forming and solving equations from word problems', 'M1-2.2b', 'Form equations from word problems', 'Solve the equations and interpret the answers'),
  PM(M5, 'Linear simultaneous equations', 'Solving simultaneous equations by substitution', 'M1-2.2c', 'Solve simultaneous equations using the substitution method', 'Check the solutions obtained'),
  PM(M5, 'Linear simultaneous equations', 'Solving simultaneous equations by elimination', 'M1-2.2c', 'Solve simultaneous equations using the elimination method', 'Choose a suitable method for a given problem'),
  PM(M5, 'Linear simultaneous equations', 'Word problems on simultaneous equations', 'M1-2.2b', 'Form simultaneous equations from word problems', 'Solve the equations and interpret the answers'),
  PM(M5, 'Solution of inequalities with one unknown', 'Meaning of inequalities in one unknown', 'M1-2.2d', 'Explain linear inequalities in one unknown', 'Form inequalities from given statements'),
  PM(M5, 'Solution of inequalities with one unknown', 'Solving linear inequalities', 'M1-2.2d', 'Solve linear inequalities in one unknown', 'Represent the solution on a number line'),

  PM(M6, 'Basic concepts of coordinate geometry', 'The Cartesian plane and plotting points', 'M1-3.1a', 'Draw the Cartesian plane and label the axes', 'Plot and read the coordinates of points'),
  PM(M6, 'Gradient of a straight line', 'Meaning of gradient', 'M1-3.1b', 'Explain the meaning of the gradient of a line', 'Identify positive, negative, zero and undefined gradients'),
  PM(M6, 'Gradient of a straight line', 'Calculating the gradient from two points', 'M1-3.1b', 'Calculate the gradient of a line from two points', 'Solve problems involving gradient'),
  PM(M6, 'Equation of a straight line', 'Equation of a line given the gradient and a point', 'M1-3.1c', 'Find the equation of a line given the gradient and a point', 'Write the equation in simplest form'),
  PM(M6, 'Equation of a straight line', 'Equation of a line given two points', 'M1-3.1c', 'Find the equation of a line passing through two points', 'Check the equation using the given points'),
  PM(M6, 'General equation of a straight line', 'Gradient and intercepts from the equation of a line', 'M1-3.1c', 'Write the equation of a line in the form y = mx + c', 'Find the gradient and intercepts from the equation'),
  PM(M6, 'General equation of a straight line', 'The general form ax + by + c = 0', 'M1-3.1c', 'Express the equation of a line in the general form', 'Convert between the general form and y = mx + c'),
  PM(M6, 'Graphing linear equations', 'Graphing using a table of values', 'M1-3.1c', 'Make a table of values for a linear equation', 'Draw the graph of the equation'),
  PM(M6, 'Graphing linear equations', 'Graphing using the gradient and intercepts', 'M1-3.1c', 'Draw a line using its gradient and intercepts', 'Read values from a graph'),
  PM(M6, 'Solving linear simultaneous equations graphically', 'Solving simultaneous equations graphically', 'M1-3.1d', 'Draw two lines on the same axes', 'Read the point of intersection as the solution'),
  PM(M6, 'Solving linear simultaneous equations graphically', 'Using mathematical software to draw graphs', 'M1-3.1e', 'Use mathematical software to draw graphs of equations', 'Solve simultaneous equations using the software'),
);

// ---------- MATHEMATICS FORM II ----------
const RATE_RESOURCES = ['Mathematical set', 'Marker pens', 'Calculator', 'Charts of real-life scenarios', 'Graph paper', 'Rates and variation animations'];
const GEOM_RESOURCES = ['Mathematical set', 'Marker pens', 'Calculator', 'Graph paper', 'Geometrical figures', 'Congruence and similarity simulations', 'Pattern blocks / tangrams'];
const ALG2_RESOURCES = ['Mathematical set', 'Marker pens', 'Calculator', 'Mathematical software (GeoGebra)', 'Graphing calculator'];
const EXP_RESOURCES = ['Calculator', 'Number charts', 'Exponent games and puzzles', 'Exponent rule posters', 'Visual aids'];
const SET_RESOURCES = ['Real objects', 'Set simulations', 'Charts of different sets', 'Playing cards', 'Coloured chalks'];
const TRIG_RESOURCES = ['Geometry animations', 'Mathematical software (GeoGebra)', 'Graph paper', 'Mathematical set', 'Calculator', 'Clinometer'];

Object.assign(UNITS, {
  'M2-1.1a': { mainCompetence: MM1, specificCompetence: 'Use rates and variations in different contexts', mainActivity: 'Describe the concepts of rates and variations', methods: ['brainstorming', 'groupDiscussion'], resources: RATE_RESOURCES },
  'M2-1.1b': { mainCompetence: MM1, specificCompetence: 'Use rates and variations in different contexts', mainActivity: 'Solve problems on rates and variations', methods: ['groupDiscussion', 'problemSolving'], resources: RATE_RESOURCES },
  'M2-2.1a': { mainCompetence: MM2, specificCompetence: 'Use geometry, approximations, relations and functions in various contexts', mainActivity: 'Describe the concepts of geometry (similarity and congruence)', methods: ['brainstorming', 'groupDiscussion'], resources: GEOM_RESOURCES },
  'M2-2.1b': { mainCompetence: MM2, specificCompetence: 'Use geometry, approximations, relations and functions in various contexts', mainActivity: 'Recognise properties of similar triangles', methods: ['visual', 'jigsaw'], resources: GEOM_RESOURCES },
  'M2-2.1c': { mainCompetence: MM2, specificCompetence: 'Use geometry, approximations, relations and functions in various contexts', mainActivity: 'Explain postulates, proofs and theorems of congruent triangles', methods: ['groupDiscussion', 'problemSolving'], resources: GEOM_RESOURCES },
  'M2-2.2a': { mainCompetence: MM2, specificCompetence: 'Use algebra and matrices in problem solving', mainActivity: 'Explore the basic tenets of algebra (binary operations, quadratic expressions and equations, radicals, exponents and logarithms)', methods: ['jigsaw', 'problemSolving'], resources: ALG2_RESOURCES },
  'M2-2.2b': { mainCompetence: MM2, specificCompetence: 'Use algebra and matrices in problem solving', mainActivity: 'Solve quadratic equations by using different methods (factorisation, completing the square and quadratic formula)', methods: ['groupDiscussion', 'problemSolving'], resources: ALG2_RESOURCES },
  'M2-2.2c': { mainCompetence: MM2, specificCompetence: 'Use algebra and matrices in problem solving', mainActivity: 'Identify and use laws of exponents involving positive, negative and zero exponents', methods: ['groupDiscussion', 'problemSolving'], resources: EXP_RESOURCES },
  'M2-2.2d': { mainCompetence: MM2, specificCompetence: 'Use algebra and matrices in problem solving', mainActivity: 'Write numbers in standard form', methods: ['groupDiscussion'], resources: EXP_RESOURCES },
  'M2-2.2e': { mainCompetence: MM2, specificCompetence: 'Use algebra and matrices in problem solving', mainActivity: 'Use laws of logarithms to solve problems', methods: ['qa', 'problemSolving'], resources: ['Calculator', 'Number charts', 'Logarithm charts', 'Mathematical software (GeoGebra)'] },
  'M2-2.2f': { mainCompetence: MM2, specificCompetence: 'Use algebra and matrices in problem solving', mainActivity: 'Perform operations on radicals and rationalise the denominators', methods: ['problemSolving'], resources: EXP_RESOURCES },
  'M2-2.3a': { mainCompetence: MM2, specificCompetence: 'Use sets, sequences and series in problem solving', mainActivity: 'Explore the basic tenets of sets (types of sets, subsets, operations with sets and Venn diagrams of two sets)', methods: ['brainstorming', 'jigsaw'], resources: SET_RESOURCES },
  'M2-2.3b': { mainCompetence: MM2, specificCompetence: 'Use sets, sequences and series in problem solving', mainActivity: 'Distinguish among different types of sets (universal, equal, empty/null, finite, infinite, equivalent and disjoint sets)', methods: ['groupDiscussion'], resources: SET_RESOURCES },
  'M2-2.3c': { mainCompetence: MM2, specificCompetence: 'Use sets, sequences and series in problem solving', mainActivity: 'Compare sets (subsets and universal sets)', methods: ['groupDiscussion'], resources: SET_RESOURCES },
  'M2-2.3d': { mainCompetence: MM2, specificCompetence: 'Use sets, sequences and series in problem solving', mainActivity: 'Perform operations with sets (union, intersection and complement of a set)', methods: ['groupDiscussion', 'problemSolving'], resources: SET_RESOURCES },
  'M2-2.3e': { mainCompetence: MM2, specificCompetence: 'Use sets, sequences and series in problem solving', mainActivity: 'Represent two sets in a Venn diagram', methods: ['visual'], resources: SET_RESOURCES },
  'M2-2.3f': { mainCompetence: MM2, specificCompetence: 'Use sets, sequences and series in problem solving', mainActivity: 'Find the number of elements in a set', methods: ['groupDiscussion', 'problemSolving'], resources: SET_RESOURCES },
  'M2-3.1a': { mainCompetence: MM3, specificCompetence: 'Use basic coordinate geometry, trigonometry and vectors skills in daily life', mainActivity: 'Explore the basic tenets of trigonometry (trigonometric ratios, angles of elevation and depression)', methods: ['brainstorming', 'visual'], resources: TRIG_RESOURCES },
  'M2-3.1b': { mainCompetence: MM3, specificCompetence: 'Use basic coordinate geometry, trigonometry and vectors skills in daily life', mainActivity: 'Determine trigonometric ratios of angles and special angles', methods: ['groupDiscussion', 'problemSolving'], resources: TRIG_RESOURCES },
  'M2-3.1c': { mainCompetence: MM3, specificCompetence: 'Use basic coordinate geometry, trigonometry and vectors skills in daily life', mainActivity: 'Calculate angles of elevation and depression', methods: ['jigsaw', 'problemSolving'], resources: TRIG_RESOURCES },
});

// ---------- MATHEMATICS FORM III ----------
const FUNC_RESOURCES = ['Function animations', 'Graph boards and papers', 'Calculator', 'Charts of real-life scenarios', 'Mathematical software (GeoGebra)'];
const SEQ_RESOURCES = ['Pattern puzzles', 'Pattern blocks', 'Visual aids', 'Sequence and series games', 'Calculator'];
const CIRCLE_RESOURCES = ['Charts of circle theorems', 'Circle simulations', 'Mathematical set', 'Visual aids', 'Mathematical software (GeoGebra)', 'Calculator'];

Object.assign(UNITS, {
  'M3-1.1a': { mainCompetence: MM2, specificCompetence: 'Use geometry, approximations, relations and functions in various contexts', mainActivity: 'Describe the concepts of relations and functions (types of relations, domain and range, graphs, inverses)', methods: ['groupDiscussion', 'brainstorming'], resources: FUNC_RESOURCES },
  'M3-1.1b': { mainCompetence: MM2, specificCompetence: 'Use geometry, approximations, relations and functions in various contexts', mainActivity: 'Find the domain and range of relations and functions', methods: ['jigsaw', 'problemSolving'], resources: FUNC_RESOURCES },
  'M3-1.1c': { mainCompetence: MM2, specificCompetence: 'Use geometry, approximations, relations and functions in various contexts', mainActivity: 'Find the inverses of relations and functions', methods: ['problemSolving'], resources: FUNC_RESOURCES },
  'M3-1.1d': { mainCompetence: MM2, specificCompetence: 'Use geometry, approximations, relations and functions in various contexts', mainActivity: 'Draw graphs of relations and functions', methods: ['visual', 'practical'], resources: FUNC_RESOURCES },
  'M3-1.2': { mainCompetence: MM2, specificCompetence: 'Use algebra and matrices in problem solving', mainActivity: 'Explore the basic tenets of linear programming (constraints, objective function and optimal solution)', methods: ['jigsaw', 'problemSolving', 'visual'], resources: FUNC_RESOURCES },
  'M3-1.3a': { mainCompetence: MM2, specificCompetence: 'Use sets, sequences and series in problem solving', mainActivity: 'Explore the basic tenets of sequences and series (Arithmetic Progression and Geometric Progression)', methods: ['brainstorming', 'visual'], resources: SEQ_RESOURCES },
  'M3-1.3b': { mainCompetence: MM2, specificCompetence: 'Use sets, sequences and series in problem solving', mainActivity: 'Find the general term of AP and GP and use it to derive formulae for the sums of APs and GPs', methods: ['brainstorming', 'groupDiscussion'], resources: SEQ_RESOURCES },
  'M3-1.3c': { mainCompetence: MM2, specificCompetence: 'Use sets, sequences and series in problem solving', mainActivity: 'Calculate arithmetic mean, geometric mean and compound interest', methods: ['brainstorming', 'tips'], resources: [...SEQ_RESOURCES, 'Bank statements'] },
  'M3-2.1': { mainCompetence: MM3, specificCompetence: 'Use basic skills of circles in daily life', mainActivity: 'Explore the basic tenets of a circle (angle properties, theorems, tangents, chords and radians)', methods: ['tips', 'visual'], resources: CIRCLE_RESOURCES },
});

const PMF = (form: 2 | 3) => (topic: string, subtopic: string, part: string, unit: string, ...specificActivities: string[]): LessonPart =>
  ({ id: `m${form}-${++_n}`, subject: 'Mathematics', form, topic, subtopic, part, unit, specificActivities });
const PM2 = PMF(2);
const PM3 = PMF(3);

LESSON_PARTS.push(
  // ===== MATHEMATICS FORM II =====
  PM2('Rates and variations', 'Rates', 'Meaning and types of rates', 'M2-1.1a', 'Explain the meaning of a rate', 'Give examples of rates such as speed, price per unit and rate of work'),
  PM2('Rates and variations', 'Rates', 'Calculating and converting rates', 'M2-1.1b', 'Calculate rates from given information', 'Convert from one unit of rate to another'),
  PM2('Rates and variations', 'Variations', 'Direct variation', 'M2-1.1a', 'Explain the meaning of direct variation', 'Find the constant of variation and write the equation'),
  PM2('Rates and variations', 'Variations', 'Inverse variation', 'M2-1.1a', 'Explain the meaning of inverse variation', 'Solve simple problems on inverse variation'),
  PM2('Rates and variations', 'Variations', 'Joint and partial variations', 'M2-1.1b', 'Explain joint and partial variations', 'Solve problems on joint and partial variations'),
  PM2('Rates and variations', 'Variations', 'Solving real-life problems on variations', 'M2-1.1b', 'Form variation equations from word problems', 'Solve real-life problems on variations'),

  PM2('Congruence', 'The concept of congruence', 'Meaning of congruent figures', 'M2-2.1a', 'Explain the meaning of congruence', 'Identify congruent figures'),
  PM2('Congruence', 'Postulates, theorems and proofs', 'Postulates and theorems', 'M2-2.1c', 'Define a postulate, a theorem and a proof', 'State basic geometric theorems about lines and angles'),
  PM2('Congruence', 'Postulates, theorems and proofs', 'Proving geometric statements', 'M2-2.1c', 'Write a simple logical proof', 'Give reasons for each step of a proof'),
  PM2('Congruence', 'Congruence of triangles', 'Conditions for congruent triangles (SSS and SAS)', 'M2-2.1c', 'State the SSS and SAS conditions', 'Show that two triangles are congruent using SSS or SAS'),
  PM2('Congruence', 'Congruence of triangles', 'Conditions for congruent triangles (ASA, AAS and RHS)', 'M2-2.1c', 'State the ASA, AAS and RHS conditions', 'Show that two triangles are congruent using these conditions'),
  PM2('Congruence', 'Congruence of triangles', 'Applying congruence of triangles', 'M2-2.1c', 'Use congruent triangles to prove properties of shapes', 'Solve problems on congruent triangles'),

  PM2('Similarity', 'Similar figures', 'Meaning and properties of similar figures', 'M2-2.1a', 'Explain the meaning of similar figures', 'Differentiate similar figures from congruent figures'),
  PM2('Similarity', 'Similar figures', 'Scale factor, areas and volumes of similar figures', 'M2-2.1a', 'Find the scale factor of similar figures', 'Relate scale factor to lengths, areas and volumes'),
  PM2('Similarity', 'Similar triangles', 'Properties of similar triangles', 'M2-2.1b', 'State the properties of similar triangles', 'Identify similar triangles'),
  PM2('Similarity', 'Similar triangles', 'Conditions for similar triangles', 'M2-2.1b', 'State the conditions for similar triangles (AAA, SSS, SAS)', 'Show that two triangles are similar'),
  PM2('Similarity', 'Similarity theorems', 'Similarity theorems', 'M2-2.1b', 'State the similarity theorems', 'Use the theorems to find unknown sides'),
  PM2('Similarity', 'Similarity theorems', 'Applications of similar triangles', 'M2-2.1b', 'Use similar triangles to find heights and distances', 'Solve real-life problems on similarity'),

  PM2('Algebra', 'Binary operations', 'Meaning of binary operations', 'M2-2.2a', 'Explain the meaning of a binary operation', 'Perform binary operations on given numbers'),
  PM2('Algebra', 'Binary operations', 'Properties of binary operations', 'M2-2.2a', 'Test closure, commutativity and associativity', 'Find the identity and inverse elements'),
  PM2('Algebra', 'Transposition of formulae', 'Changing the subject of a formula', 'M2-2.2a', 'Explain the meaning of the subject of a formula', 'Change the subject of simple formulae'),
  PM2('Algebra', 'Transposition of formulae', 'Transposing formulae with powers and roots', 'M2-2.2a', 'Change the subject of formulae involving powers and roots', 'Substitute values into transposed formulae'),
  PM2('Algebra', 'Quadratic expressions', 'Meaning and expansion of quadratic expressions', 'M2-2.2a', 'Explain the meaning of a quadratic expression', 'Expand products of two binomials'),
  PM2('Algebra', 'Factorisation of quadratic expressions', 'Factorising using common factors and grouping', 'M2-2.2a', 'Factorise by taking out a common factor', 'Factorise by grouping'),
  PM2('Algebra', 'Factorisation of quadratic expressions', 'Factorising trinomials and the difference of two squares', 'M2-2.2a', 'Factorise quadratic trinomials', 'Factorise the difference of two squares'),
  PM2('Algebra', 'Quadratic equations', 'Solving quadratic equations by factorisation', 'M2-2.2b', 'Explain the meaning of a quadratic equation', 'Solve quadratic equations by factorisation'),
  PM2('Algebra', 'Quadratic equations', 'Solving quadratic equations by completing the square', 'M2-2.2b', 'Complete the square for a quadratic expression', 'Solve quadratic equations by completing the square'),
  PM2('Algebra', 'Quadratic equations', 'Solving quadratic equations by the quadratic formula', 'M2-2.2b', 'State and use the quadratic formula', 'Choose a suitable method for a given equation'),
  PM2('Algebra', 'Quadratic equations', 'Forming and solving quadratic equations from word problems', 'M2-2.2b', 'Form quadratic equations from word problems', 'Solve the equations and interpret the answers'),

  PM2('Exponents and radicals', 'Exponents', 'Meaning of exponents', 'M2-2.2c', 'Explain the meaning of exponents (index notation)', 'Evaluate numbers in index form'),
  PM2('Exponents and radicals', 'Laws of exponents', 'Multiplication and division laws', 'M2-2.2c', 'State the multiplication and division laws of exponents', 'Simplify expressions using the two laws'),
  PM2('Exponents and radicals', 'Laws of exponents', 'Power law, zero and negative exponents', 'M2-2.2c', 'State the power law and the zero index law', 'Simplify expressions with zero and negative exponents'),
  PM2('Exponents and radicals', 'Exponential equations', 'Solving exponential equations', 'M2-2.2c', 'Explain the meaning of an exponential equation', 'Solve exponential equations'),
  PM2('Exponents and radicals', 'Fractional exponents', 'Fractional exponents', 'M2-2.2c', 'Explain the meaning of fractional exponents', 'Simplify expressions with fractional exponents'),
  PM2('Exponents and radicals', 'Radicals', 'Meaning and operations on radicals', 'M2-2.2f', 'Explain the meaning of radicals (surds)', 'Simplify, add, subtract and multiply radicals'),
  PM2('Exponents and radicals', 'Rationalisation of denominators', 'Rationalising denominators', 'M2-2.2f', 'Explain why denominators are rationalised', 'Rationalise denominators with one or two terms'),
  PM2('Exponents and radicals', 'Finding roots of numbers by calculators', 'Finding roots of numbers using a calculator', 'M2-2.2f', 'Find square roots and other roots using a calculator', 'Round the answers to a required accuracy'),

  PM2('Logarithms', 'Standard form of numbers', 'Writing numbers in standard form', 'M2-2.2d', 'Write large and small numbers in standard form', 'Convert numbers from standard form to ordinary form'),
  PM2('Logarithms', 'Concept of logarithms', 'Concept of logarithms (index and logarithmic forms)', 'M2-2.2e', 'Explain the meaning of a logarithm', 'Change between index form and logarithmic form'),
  PM2('Logarithms', 'Laws of logarithm', 'Product, quotient and power laws of logarithms', 'M2-2.2e', 'State the product, quotient and power laws', 'Use the laws to simplify logarithmic expressions'),
  PM2('Logarithms', 'Laws of logarithm', 'Solving logarithmic equations', 'M2-2.2e', 'Use the laws of logarithms to solve equations', 'Check the solutions obtained'),
  PM2('Logarithms', 'Logarithms of numbers', 'Finding logarithms of numbers', 'M2-2.2e', 'Find logarithms of numbers using tables or a calculator', 'Use logarithms to simplify calculations'),
  PM2('Logarithms', 'Antilogarithms', 'Finding antilogarithms', 'M2-2.2e', 'Explain the meaning of an antilogarithm', 'Find antilogarithms and use them in calculations'),
  PM2('Logarithms', 'Applications of logarithms', 'Applications of logarithms', 'M2-2.2e', 'Use logarithms to solve real-life problems', 'Solve problems such as growth and compound quantities'),

  PM2('Sets', 'Concept of a set', 'Meaning, notation and elements of a set', 'M2-2.3a', 'Explain the meaning of a set and its elements', 'Describe sets by listing and by description'),
  PM2('Sets', 'Types of sets', 'Types of sets', 'M2-2.3b', 'Distinguish universal, equal, empty, finite and infinite sets', 'Distinguish equivalent and disjoint sets'),
  PM2('Sets', 'Types of sets', 'Subsets and universal sets', 'M2-2.3c', 'Identify subsets of a given set', 'Compare a set with the universal set'),
  PM2('Sets', 'Operation on sets', 'Union and intersection of sets', 'M2-2.3d', 'Find the union of sets', 'Find the intersection of sets'),
  PM2('Sets', 'Operation on sets', 'Complement of a set', 'M2-2.3d', 'Explain the meaning of the complement of a set', 'Find the complement of a set'),
  PM2('Sets', 'Venn diagrams', 'Representing two sets in a Venn diagram', 'M2-2.3e', 'Draw a Venn diagram for two sets', 'Shade regions for union, intersection and complement'),
  PM2('Sets', 'Venn diagrams', 'Finding the number of elements in sets', 'M2-2.3f', 'Use a Venn diagram to find the number of elements in a set', 'Solve real-life problems on two sets'),

  PM2('Trigonometry', 'Trigonometric ratios', 'Sine, cosine and tangent of acute angles', 'M2-3.1a', 'Name the sides of a right-angled triangle', 'Define and find sine, cosine and tangent of an angle'),
  PM2('Trigonometry', 'Trigonometric ratios of special angles', 'Trigonometric ratios of 30°, 45° and 60°', 'M2-3.1b', 'Find the ratios of 30°, 45° and 60° using triangles', 'Use the special angle ratios in calculations'),
  PM2('Trigonometry', 'Trigonometric ratios of any angle', 'Trigonometric ratios of any angle (quadrants)', 'M2-3.1b', 'Find the signs of the ratios in the four quadrants', 'Find the ratios of angles greater than 90°'),
  PM2('Trigonometry', 'Relationship between trigonometrical ratios', 'Relationship between trigonometric ratios', 'M2-3.1b', 'State the relationships between sine, cosine and tangent', 'Use the relationships to find unknown ratios'),
  PM2('Trigonometry', 'Calculating trigonometric ratios with a calculator', 'Using a calculator for trigonometric ratios', 'M2-3.1b', 'Find trigonometric ratios using a calculator', 'Solve right-angled triangle problems'),
  PM2('Trigonometry', 'Inverse of trigonometric ratios', 'Finding angles from trigonometric ratios', 'M2-3.1b', 'Find an angle from a given ratio', 'Use inverse sine, cosine and tangent'),
  PM2('Trigonometry', 'The angle of elevation and depression', 'Angles of elevation and depression', 'M2-3.1c', 'Explain angles of elevation and depression', 'Draw diagrams for given situations'),
  PM2('Trigonometry', 'The angle of elevation and depression', 'Solving problems on elevation and depression', 'M2-3.1c', 'Calculate heights and distances using trigonometry', 'Solve real-life problems on elevation and depression'),

  // ===== MATHEMATICS FORM III =====
  PM3('Relations', 'Meaning of a relation', 'Meaning of a relation', 'M3-1.1a', 'Explain the meaning of a relation', 'Show a relation by an arrow diagram and ordered pairs'),
  PM3('Relations', 'Types of relations', 'Types of relations', 'M3-1.1a', 'Distinguish one-to-one, one-to-many, many-to-one and many-to-many relations', 'Give examples of each type of relation'),
  PM3('Relations', 'Domain and range of a relation', 'Domain and range of a relation', 'M3-1.1b', 'Define the domain and range of a relation', 'Find the domain and range from a table or a diagram'),
  PM3('Relations', 'Graphs of relations', 'Graphs of relations', 'M3-1.1d', 'Plot the graph of a relation', 'Read information from the graph of a relation'),
  PM3('Relations', 'Domain and range of a relation expressed in equation form', 'Domain and range from an equation', 'M3-1.1b', 'Find the domain and range of a relation given as an equation', 'Describe the domain and range using inequalities'),
  PM3('Relations', 'Inverse of a relation', 'Inverse of a relation', 'M3-1.1c', 'Explain the meaning of the inverse of a relation', 'Find the inverse of a relation'),

  PM3('Functions', 'Concept of a function', 'Concept of a function', 'M3-1.1a', 'Explain the meaning of a function', 'Differentiate a function from a relation'),
  PM3('Functions', 'Function notation', 'Function notation', 'M3-1.1a', 'Use function notation f(x)', 'Find the value of a function for given inputs'),
  PM3('Functions', 'Domain and range of a function', 'Domain and range of a function', 'M3-1.1b', 'Find the domain and range of a function', 'Read the domain and range from a graph'),
  PM3('Functions', 'Graphs of linear functions', 'Graphs of linear functions', 'M3-1.1d', 'Draw the graph of a linear function', 'Find the gradient and intercepts from the graph'),
  PM3('Functions', 'Graphs of quadratic functions', 'Drawing graphs of quadratic functions', 'M3-1.1d', 'Make a table of values for a quadratic function', 'Draw the graph of a quadratic function'),
  PM3('Functions', 'Graphs of quadratic functions', 'Properties of the graphs of quadratic functions', 'M3-1.1d', 'Find the turning point, axis of symmetry and roots from a graph', 'Solve quadratic equations from the graph'),
  PM3('Functions', 'Step functions', 'Step functions', 'M3-1.1d', 'Explain the meaning of a step function', 'Draw and interpret the graph of a step function'),
  PM3('Functions', 'Absolute value functions', 'Absolute value functions', 'M3-1.1d', 'Explain the meaning of an absolute value function', 'Draw the graph of an absolute value function'),
  PM3('Functions', 'Inverse of a function', 'Inverse of a function', 'M3-1.1c', 'Find the inverse of a function', 'Show that two functions are inverses of each other'),

  PM3('Linear programming', 'Formulation of linear programming problems', 'Forming constraints and the objective function', 'M3-1.2', 'Define constraints and an objective function', 'Form inequalities from a word problem'),
  PM3('Linear programming', 'Graphical solutions', 'Graphing constraints and the feasible region', 'M3-1.2', 'Draw the graphs of the constraints', 'Identify the feasible region'),
  PM3('Linear programming', 'Graphical solutions', 'Finding the optimal solution', 'M3-1.2', 'Find the optimal solution from the feasible region', 'Solve real-life linear programming problems'),

  PM3('Sequences and series', 'Sequences', 'Meaning and types of sequences', 'M3-1.3a', 'Explain the meaning of a sequence', 'Find the next terms of a given sequence'),
  PM3('Sequences and series', 'Series', 'Meaning of series and sigma notation', 'M3-1.3a', 'Explain the meaning of a series', 'Differentiate a sequence from a series'),
  PM3('Sequences and series', 'Arithmetic Progression (AP)', 'Arithmetic progression and its nth term', 'M3-1.3b', 'Explain an arithmetic progression and its common difference', 'Find the nth term of an AP'),
  PM3('Sequences and series', 'Arithmetic Progression (AP)', 'Sum of an arithmetic progression', 'M3-1.3b', 'Derive the formula for the sum of an AP', 'Solve problems on the sum of an AP'),
  PM3('Sequences and series', 'Arithmetic mean', 'Arithmetic mean', 'M3-1.3c', 'Explain the meaning of arithmetic means', 'Insert arithmetic means between two numbers'),
  PM3('Sequences and series', 'Geometric Progression (GP)', 'Geometric progression and its nth term', 'M3-1.3b', 'Explain a geometric progression and its common ratio', 'Find the nth term of a GP'),
  PM3('Sequences and series', 'Geometric Progression (GP)', 'Sum of a geometric progression', 'M3-1.3b', 'Derive the formula for the sum of a GP', 'Solve problems on the sum of a GP'),
  PM3('Sequences and series', 'Geometric Mean', 'Geometric mean', 'M3-1.3c', 'Explain the meaning of geometric means', 'Insert geometric means between two numbers'),
  PM3('Sequences and series', 'Compound interest', 'Meaning and calculation of compound interest', 'M3-1.3c', 'Explain compound interest', 'Calculate compound interest and the final amount'),
  PM3('Sequences and series', 'Compound interest', 'Applications of compound interest', 'M3-1.3c', 'Compare simple and compound interest', 'Solve real-life problems on loans, savings and investments'),

  PM3('Circles', 'Concept of a circle', 'Concept of a circle and its parts', 'M3-2.1', 'Name the parts of a circle', 'Explain the meaning of each part'),
  PM3('Circles', 'Central angles', 'Central angles', 'M3-2.1', 'Explain the meaning of a central angle', 'Find central angles and relate them to arcs'),
  PM3('Circles', 'Arc length of a circle', 'Arc length of a circle', 'M3-2.1', 'State the formula for the length of an arc', 'Calculate arc lengths'),
  PM3('Circles', 'Radian measure', 'Radian measure', 'M3-2.1', 'Explain the meaning of a radian', 'Convert between degrees and radians'),
  PM3('Circles', 'Radian measure', 'Arc length and sector area using radians', 'M3-2.1', 'Use radians to find arc lengths', 'Use radians to find the area of a sector'),
  PM3('Circles', 'Angle properties of circles', 'Angle at the centre and at the circumference', 'M3-2.1', 'State the angle at the centre theorem', 'Use it to find unknown angles'),
  PM3('Circles', 'Angle properties of circles', 'Angles in the same segment and in a semicircle', 'M3-2.1', 'State the properties of angles in the same segment and in a semicircle', 'Find unknown angles using these properties'),
  PM3('Circles', 'Angle properties of circles', 'Cyclic quadrilaterals', 'M3-2.1', 'State the properties of a cyclic quadrilateral', 'Find unknown angles in cyclic quadrilaterals'),
  PM3('Circles', 'Chord properties of circles', 'Chord properties of circles', 'M3-2.1', 'State the properties of chords of a circle', 'Find lengths using the perpendicular from the centre to a chord'),
  PM3('Circles', 'Chord properties of circles', 'Intersecting chords', 'M3-2.1', 'State the intersecting chords theorem', 'Solve problems on intersecting chords'),
  PM3('Circles', 'Tangent properties of circles', 'Tangent properties of circles', 'M3-2.1', 'State the properties of a tangent to a circle', 'Find lengths and angles involving tangents'),
  PM3('Circles', 'Tangent properties of circles', 'Tangents from an external point and the alternate segment theorem', 'M3-2.1', 'State the tangent-secant and alternate segment theorems', 'Solve problems using these theorems'),
);

// =====================================================================================
// BUSINESS STUDIES (TIE 2023 syllabus + Student's Books Form One/Two/Three). Kept separate from other subjects.
// Lesson-sized parts are PROPOSED (one 40-minute period each) and can be edited.
// =====================================================================================

export const BUSINESS_COMMON_RESOURCES = [
  'Chalkboard / whiteboard',
  'Markers and chalk',
  "Student's book (Business Studies, Form One/Two/Three as applicable)",
  'Handouts',
  'Flip chart',
  'Charts and pictures',
  'Real objects',
  'Calculator',
  'Smart board',
  'Projector',
  'Computer',
  'Smart phone',
  'Syllabus',
];

const MB1 = 'Demonstrate mastery of business knowledge';
const MB2 = 'Solve social challenges using business skills';
const MB3 = 'Apply business knowledge in various contexts';
const SB11 = 'Demonstrate mastery of the concepts, theories and principles of Business Education';
const SB21 = 'Demonstrate mastery of the basic skills of operating a small-scale business';
const SB31 = 'Apply business theories into practice';
const SB32 = 'Demonstrate mastery of basic business ethics';

const BUS_SOURCES = ['Online/offline sources', 'Video clips showing various business activities', 'Business club guidelines'];
const CAPITAL_RESOURCES = ['Online/offline sources', 'Charts of sources of capital', 'Video clips of small businesses', 'Loan application forms'];
const MGMT_RESOURCES = ['Calculator', 'Business documents (receipts, invoices, cash book)', 'Sample records of a small business', 'Charts of budgets', 'Spreadsheet software'];
const STOCK_RESOURCES = ['Stock cards', 'Goods received and delivery notes', 'Calculator', 'Charts of warehouse layouts', 'Video clips of warehouses'];
const MARKET_RESOURCES = ['Product samples', 'Advertisements and posters', 'Smart phone', 'Social media platforms', 'Online/offline sources'];
const REG_RESOURCES = ['Business registration guide (BRELA)', 'Sample licences and certificates', 'Online/offline sources', 'Guest speaker from a government agency'];
const PLAN_RESOURCES = ['Sample business plans', 'Business plan templates', 'Calculator', 'Online/offline sources'];
const ETHICS_RESOURCES = ['Case studies', 'Video clips on business ethics', 'Charts of norms and values', 'Online/offline sources'];

Object.assign(UNITS, {
  'B1-1.1a': { mainCompetence: MB1, specificCompetence: SB11, mainActivity: 'Describe the concept and scope of Business Studies and its relationship with other disciplines (including the school business club)', methods: ['scenario', 'jigsaw', 'brainstorming'], resources: BUS_SOURCES },
  'B1-1.1b': { mainCompetence: MB1, specificCompetence: SB11, mainActivity: 'Describe the concept and theories of entrepreneurship (meaning, characteristics, skills and importance)', methods: ['brainstorming', 'fieldTrip', 'rolePlay'], resources: BUS_SOURCES },
  'B1-1.1c': { mainCompetence: MB1, specificCompetence: SB11, mainActivity: 'Describe sole proprietorship (meaning, features, advantages and disadvantages and start-up)', methods: ['brainstorming', 'guestSpeaker', 'caseStudy'], resources: ['Online/offline sources', 'Business Registration and Licensing Agency (BRELA) guides', 'Video clips of small businesses'] },
  'B2-1.1a': { mainCompetence: MB1, specificCompetence: SB11, mainActivity: 'Explain the concept of production (meaning, types, factors and importance)', methods: ['visual', 'groupDiscussion'], resources: ['Real objects (bottles, shoes, books, furniture)', 'Charts of factors of production', 'Video clips of production activities'] },
  'B2-1.1b': { mainCompetence: MB1, specificCompetence: SB11, mainActivity: 'Describe sources of capital for small businesses (loans, savings, deferred payments, funds from family and friends)', methods: ['tips', 'caseStudy'], resources: CAPITAL_RESOURCES },
  'B2-1.1c': { mainCompetence: MB1, specificCompetence: SB11, mainActivity: 'Describe the role of microfinancing and cooperatives in facilitating business formation and operations', methods: ['brainstorming', 'guestSpeaker'], resources: CAPITAL_RESOURCES },
  'B2-2.1a': { mainCompetence: MB2, specificCompetence: SB21, mainActivity: 'Describe the basic aspects of management for small businesses (meaning, financial and other records keeping, calculation of profit and loss, budgeting, control and administration)', methods: ['groupDiscussion', 'problemSolving'], resources: MGMT_RESOURCES },
  'B2-2.1b': { mainCompetence: MB2, specificCompetence: SB21, mainActivity: 'Describe the basic aspects of warehousing and inventorying for small businesses (meaning, functions, documents and methods)', methods: ['groupDiscussion', 'visual'], resources: STOCK_RESOURCES },
  'B2-3.1a': { mainCompetence: MB3, specificCompetence: SB31, mainActivity: 'Identify business opportunities available in the local environment', methods: ['brainstorming', 'fieldTrip'], resources: ['Online/offline sources', 'Charts of economic sectors', 'Maps of the local area', 'Smart phone'] },
  'B3-1.1a': { mainCompetence: MB1, specificCompetence: SB11, mainActivity: 'Describe the basic aspects of marketing for small businesses (meaning and importance, product, price, place/distribution, promotion)', methods: ['groupDiscussion', 'caseStudy'], resources: MARKET_RESOURCES },
  'B3-1.1b': { mainCompetence: MB1, specificCompetence: SB11, mainActivity: 'Describe the basic aspects of e-marketing for small businesses (uploading a business biography in social media)', methods: ['practical', 'groupDiscussion'], resources: MARKET_RESOURCES },
  'B3-2.1a': { mainCompetence: MB2, specificCompetence: SB21, mainActivity: 'Explore the basic aspects of the policy and regulatory environment governing small businesses in Tanzania (roles of government agencies, policies, laws and by-laws)', methods: ['groupDiscussion', 'guestSpeaker', 'projectActivity'], resources: REG_RESOURCES },
  'B3-2.1b': { mainCompetence: MB2, specificCompetence: SB21, mainActivity: 'Describe procedures for registering small businesses in Tanzania (types of licences, importance of registration and sanctions for non-compliance)', methods: ['groupDiscussion', 'skillsLab'], resources: REG_RESOURCES },
  'B3-3.1a': { mainCompetence: MB3, specificCompetence: SB31, mainActivity: 'Develop a plan for a small business (identification, financing, production and distribution, and marketing)', methods: ['brainstorming', 'projectActivity'], resources: PLAN_RESOURCES },
  'B3-3.2a': { mainCompetence: MB3, specificCompetence: SB32, mainActivity: 'Describe the basic tenets of ethics for small businesses (meaning, norms and values)', methods: ['brainstorming', 'caseStudy'], resources: ETHICS_RESOURCES },
});

const PBF = (form: 1 | 2 | 3) => (topic: string, subtopic: string, part: string, unit: string, ...specificActivities: string[]): LessonPart =>
  ({ id: `b${form}-${++_n}`, subject: 'Business Studies', form, topic, subtopic, part, unit, specificActivities });
const PB1 = PBF(1);
const PB2 = PBF(2);
const PB3 = PBF(3);

LESSON_PARTS.push(
  // ===== BUSINESS STUDIES FORM I =====
  PB1('Introduction to Business Studies', 'The concept of a business', 'Meaning and importance of business', 'B1-1.1a', 'Explain the meaning of a business', 'State why business is important to individuals and the community'),
  PB1('Introduction to Business Studies', 'The concept of a business', 'Business activities: production, distribution and consumption', 'B1-1.1a', 'Describe production, distribution and consumption activities', 'Give examples of business activities in the community'),
  PB1('Introduction to Business Studies', 'Terminologies used in Business Studies', 'Basic business terms (capital, profit, loss, income and expenses)', 'B1-1.1a', 'Define common business terms', 'Use the terms correctly in simple examples'),
  PB1('Introduction to Business Studies', 'Terminologies used in Business Studies', 'Other business terms (goods, services, customer, supplier and market)', 'B1-1.1a', 'Define terms such as goods, services, customer, supplier and market', 'Give examples of each term from their surroundings'),
  PB1('Introduction to Business Studies', 'The concept of Business Studies', 'Meaning and scope of Business Studies', 'B1-1.1a', 'Explain the meaning of Business Studies', 'Describe the scope of Business Studies'),
  PB1('Introduction to Business Studies', 'The concept of Business Studies', 'Relationship between Business Studies and other subjects', 'B1-1.1a', 'Show how Business Studies is related to other subjects', 'Give examples of the link with Mathematics, Geography and Civics'),
  PB1('Introduction to Business Studies', 'The concept of Business Studies', 'Importance of Business Studies', 'B1-1.1a', 'State the importance of Business Studies in the community', 'Explain how it helps learners to become self-employed'),
  PB1('Introduction to Business Studies', 'The concept of Business Studies', 'The school business club', 'B1-1.1a', 'Explain the meaning and importance of a school business club', 'Outline the components of a simple club constitution'),

  PB1('Entrepreneurship', 'The concept of entrepreneurship', 'Meaning and characteristics of an entrepreneur', 'B1-1.1b', 'Explain the meaning of entrepreneurship and an entrepreneur', 'State the characteristics of a good entrepreneur'),
  PB1('Entrepreneurship', 'The concept of entrepreneurship', 'Skills of an entrepreneur', 'B1-1.1b', 'Identify skills needed by an entrepreneur', 'Explain how the skills help a business to succeed'),
  PB1('Entrepreneurship', 'The concept of entrepreneurship', 'Importance of entrepreneurship', 'B1-1.1b', 'State the importance of entrepreneurship to the individual and the nation', 'Give examples of local entrepreneurs and their contribution'),
  PB1('Entrepreneurship', 'Theories of entrepreneurship', 'Innovation and economic theories', 'B1-1.1b', 'Explain the innovation theory of entrepreneurship', 'Explain the economic theory of entrepreneurship'),
  PB1('Entrepreneurship', 'Theories of entrepreneurship', 'Sociological, opportunity and resource-based theories', 'B1-1.1b', 'Explain the sociological theory of entrepreneurship', 'Explain the opportunity and resource-based theories'),

  PB1('Sole proprietorship', 'The concept of sole proprietorship', 'Meaning and features of a sole proprietorship', 'B1-1.1c', 'Explain the meaning of a sole proprietorship', 'State the features of a sole proprietorship'),
  PB1('Sole proprietorship', 'The concept of sole proprietorship', 'Advantages and disadvantages of a sole proprietorship', 'B1-1.1c', 'State the advantages of a sole proprietorship', 'State the disadvantages of a sole proprietorship'),
  PB1('Sole proprietorship', 'Formation of a sole proprietorship', 'Start-up and registration of a sole proprietorship', 'B1-1.1c', 'Outline the steps of starting a sole proprietorship', 'Describe how to register a sole proprietorship in Tanzania'),
  PB1('Sole proprietorship', 'Ways of solving challenges facing sole proprietorship', 'Challenges facing sole proprietors', 'B1-1.1c', 'Identify challenges facing sole proprietors', 'Explain the effects of the challenges on the business'),
  PB1('Sole proprietorship', 'Ways of solving challenges facing sole proprietorship', 'Ways of solving the challenges', 'B1-1.1c', 'Suggest ways of solving challenges facing sole proprietors', 'Apply the suggestions to a given case'),

  // ===== BUSINESS STUDIES FORM II =====
  PB2('Production', 'The concept of production', 'Meaning and types of production', 'B2-1.1a', 'Explain the meaning of production', 'Distinguish primary, secondary and tertiary production'),
  PB2('Production', 'The concept of production', 'Importance of production', 'B2-1.1a', 'State the importance of production', 'Give examples of production activities in the community'),
  PB2('Production', 'Factors of production', 'Land and labour', 'B2-1.1a', 'Explain land and labour as factors of production', 'State the rewards of land and labour'),
  PB2('Production', 'Factors of production', 'Capital and entrepreneurship', 'B2-1.1a', 'Explain capital and entrepreneurship as factors of production', 'State the rewards of capital and entrepreneurship'),

  PB2('Financing small-sized businesses', 'The concept of small-sized businesses', 'Meaning and characteristics of small-sized businesses', 'B2-1.1b', 'Explain the meaning of a small-sized business', 'State the characteristics of small-sized businesses'),
  PB2('Financing small-sized businesses', 'The concept of small-sized businesses', 'Importance of small-sized businesses', 'B2-1.1b', 'State the importance of small-sized businesses', 'Give examples of small businesses in the community'),
  PB2('Financing small-sized businesses', 'The sources of funds for small businesses', 'Loans', 'B2-1.1b', 'Explain loans as a source of capital', 'State the advantages and disadvantages of loans'),
  PB2('Financing small-sized businesses', 'The sources of funds for small businesses', 'Savings and deferred payments', 'B2-1.1b', 'Explain savings and deferred payments as sources of capital', 'State their advantages and disadvantages'),
  PB2('Financing small-sized businesses', 'The sources of funds for small businesses', 'Funds from family and friends', 'B2-1.1b', 'Explain funds from family and friends as a source of capital', 'Choose a suitable source of capital for a given business'),
  PB2('Financing small-sized businesses', 'Microfinancing and cooperatives in facilitating business formation and operations', 'Microfinancing', 'B2-1.1c', 'Explain the meaning of microfinancing', 'Describe how microfinance institutions help small businesses'),
  PB2('Financing small-sized businesses', 'Microfinancing and cooperatives in facilitating business formation and operations', 'Cooperatives', 'B2-1.1c', 'Explain the meaning of a cooperative society', 'Describe how cooperatives help small businesses'),

  PB2('Small business management', 'The concept of small business management', 'Meaning and functions of small business management', 'B2-2.1a', 'Explain the meaning of small business management', 'State the functions of management in a small business'),
  PB2('Small business management', 'Financial and other record-keeping for a small business', 'Importance of record-keeping', 'B2-2.1a', 'Explain the importance of keeping business records', 'List the records kept in a small business'),
  PB2('Small business management', 'Financial and other record-keeping for a small business', 'Keeping simple financial records', 'B2-2.1a', 'Record sales and purchases in a simple cash book', 'Balance a simple cash book'),
  PB2('Small business management', 'Profit and loss calculation for a small business', 'Calculating profit and loss', 'B2-2.1a', 'Calculate profit and loss from given figures', 'Explain the meaning of revenue, cost and profit'),
  PB2('Small business management', 'Profit and loss calculation for a small business', 'Profit and loss problems for a small business', 'B2-2.1a', 'Calculate profit and loss percentages', 'Solve simple profit and loss problems for a small business'),
  PB2('Small business management', 'Budgeting, control and administration', 'Budgeting for a small business', 'B2-2.1a', 'Explain the meaning and importance of a budget', 'Prepare a simple budget'),
  PB2('Small business management', 'Budgeting, control and administration', 'Control and administration', 'B2-2.1a', 'Explain how a small business is controlled', 'Describe the administrative duties of a small business owner'),

  PB2('Warehousing and inventorying for small businesses', 'The concept of warehousing', 'Meaning and functions of warehousing', 'B2-2.1b', 'Explain the meaning of warehousing', 'State the functions of a warehouse'),
  PB2('Warehousing and inventorying for small businesses', 'The concept of inventorying', 'Meaning and functions of inventorying', 'B2-2.1b', 'Explain the meaning of inventory', 'State the functions of inventorying'),
  PB2('Warehousing and inventorying for small businesses', 'Essential documents for warehouse and inventory management', 'Documents for warehouse and inventory management', 'B2-2.1b', 'Identify documents used in warehouses and inventory management', 'Explain the use of each document'),
  PB2('Warehousing and inventorying for small businesses', 'Methods for inventory management', 'Methods of inventory management', 'B2-2.1b', 'Describe methods of inventory management such as FIFO and LIFO', 'Choose a suitable method for a given business'),

  PB2('Business opportunity identification', 'The concept of business opportunity', 'Meaning of a business opportunity', 'B2-3.1a', 'Explain the meaning of a business opportunity', 'Differentiate a business idea from a business opportunity'),
  PB2('Business opportunity identification', 'Ways of identifying business opportunities', 'Ways of identifying business opportunities', 'B2-3.1a', 'Describe ways of identifying business opportunities', 'Explain how a need in the community can become an opportunity'),
  PB2('Business opportunity identification', 'Ways of identifying business opportunities', 'Identifying opportunities in the local environment', 'B2-3.1a', 'Identify business opportunities in different economic sectors', 'Choose a viable business opportunity from the local environment'),

  // ===== BUSINESS STUDIES FORM III =====
  PB3('Marketing', 'The concept of marketing', 'Meaning and importance of marketing', 'B3-1.1a', 'Explain the meaning of marketing', 'State the importance of marketing for small businesses'),
  PB3('Marketing', 'The concept of marketing mix', 'Product', 'B3-1.1a', 'Explain the product element of the marketing mix', 'Describe product features, branding and packaging'),
  PB3('Marketing', 'The concept of marketing mix', 'Price', 'B3-1.1a', 'Explain the price element of the marketing mix', 'State factors that affect the price of a product'),
  PB3('Marketing', 'The concept of marketing mix', 'Place (distribution)', 'B3-1.1a', 'Explain the place element of the marketing mix', 'Describe channels of distribution for small businesses'),
  PB3('Marketing', 'The concept of marketing mix', 'Promotion', 'B3-1.1a', 'Explain the promotion element of the marketing mix', 'Describe methods of promoting a product'),
  PB3('Marketing', 'E-marketing for small businesses', 'Meaning and importance of e-marketing', 'B3-1.1b', 'Explain the meaning of e-marketing', 'State the importance of e-marketing for small businesses'),
  PB3('Marketing', 'E-marketing for small businesses', 'Using social media to market a business', 'B3-1.1b', 'Write a business biography for social media', 'Upload a business biography on a social media platform'),

  PB3('The policy and regulatory environment governing small businesses in Tanzania', 'Roles of government and non-government agencies in governing small businesses in Tanzania', 'Government agencies and their roles', 'B3-2.1a', 'Identify government agencies that deal with businesses', 'Explain the roles of each agency'),
  PB3('The policy and regulatory environment governing small businesses in Tanzania', 'Roles of government and non-government agencies in governing small businesses in Tanzania', 'Non-government agencies and their roles', 'B3-2.1a', 'Identify non-government agencies that support small businesses', 'Explain the roles of each agency'),
  PB3('The policy and regulatory environment governing small businesses in Tanzania', 'Policies that promote small businesses', 'Policies that promote small businesses', 'B3-2.1a', 'Describe policies that promote small businesses in Tanzania', 'Explain how the policies help small businesses'),
  PB3('The policy and regulatory environment governing small businesses in Tanzania', 'Laws and by-laws guiding small businesses', 'Laws and by-laws guiding small businesses', 'B3-2.1a', 'Describe laws and by-laws that guide small businesses', 'Explain the importance of complying with business regulations'),

  PB3('Small business registration in Tanzania', 'The concept of business registration', 'Meaning and importance of business registration', 'B3-2.1b', 'Explain the meaning of business registration', 'State the importance of registering a business'),
  PB3('Small business registration in Tanzania', 'Types of licences and certificates for small businesses', 'Types of licences', 'B3-2.1b', 'Identify types of business licences', 'Explain the purpose of each licence'),
  PB3('Small business registration in Tanzania', 'Types of licences and certificates for small businesses', 'Certificates for small businesses', 'B3-2.1b', 'Identify certificates needed by small businesses', 'Explain how each certificate is obtained'),
  PB3('Small business registration in Tanzania', 'Procedures for registering a small business', 'Procedures for registering a small business', 'B3-2.1b', 'Outline the steps of registering a small business', 'Prepare an action plan for registering a business'),
  PB3('Small business registration in Tanzania', 'Sanctions for non-compliance', 'Sanctions for non-compliance', 'B3-2.1b', 'State the sanctions for not complying with registration rules', 'Explain the effects of the sanctions on a business'),

  PB3('Business planning', 'The concept of business planning', 'Meaning and importance of business planning', 'B3-3.1a', 'Explain the meaning of business planning', 'State the importance of a business plan'),
  PB3('Business planning', 'Components of a business plan', 'Business idea, identification and executive summary', 'B3-3.1a', 'Describe the business idea and the executive summary', 'Write the business identification part of a plan'),
  PB3('Business planning', 'Components of a business plan', 'Production and marketing plans', 'B3-3.1a', 'Prepare the production and distribution plan', 'Prepare the marketing plan'),
  PB3('Business planning', 'Components of a business plan', 'Financial plan', 'B3-3.1a', 'Prepare a financial plan with start-up costs', 'Estimate expected income and expenses'),
  PB3('Business planning', 'Components of a business plan', 'Preparing a simple business plan', 'B3-3.1a', 'Put the components together into a simple business plan', 'Present the business plan to the class'),

  PB3('Business ethics', 'The concept of business ethics', 'Meaning of business ethics', 'B3-3.2a', 'Explain the meaning of business ethics', 'Differentiate ethical from unethical business practices'),
  PB3('Business ethics', 'The concept of business ethics', 'Norms and values in business', 'B3-3.2a', 'Describe norms and values that guide a business', 'Give examples of norms and values in the community'),
  PB3('Business ethics', 'The concept of business ethics', 'Importance of business ethics', 'B3-3.2a', 'State the importance of ethics in running a business', 'Analyse a case of a business that kept or broke ethics'),
);

// ===================== ENGLISH LANGUAGE (Form I-III) =====================
// Source: TIE English Language syllabus (Form I-IV) + Student's Books (Form I 2023, Form II 2024, Form III 2025).
// Form I and Form III books list chapter titles only, so subtopics/parts below follow the syllabus learning activities (proposed, editable).
export const ENGLISH_COMMON_RESOURCES = [
  'Chalkboard / whiteboard',
  'Markers and chalk',
  'Handouts',
  'Manila cards / flash cards',
  'Dictionary',
  "Student's book (English, as applicable)",
  'Charts',
  'Audio / video recordings',
  'Radio / smartphone / speaker',
  'Reading texts',
];

const EN1 = 'Manage information search from different sources';
const EN2 = 'Demonstrate mastery of English language skills';
const EN3 = 'Comprehend oral and written information';
const EN4 = 'Communicate effectively in different contexts';
const EN5 = 'Provide basic English language services to the community';
const EN6 = 'Appreciate and create literary works';

const LISTEN_RES = ['Audio recordings', 'Radio / smartphone / speaker', 'Video clips', 'Scripts of oral texts'];
const SPEAK_RES = ['Audio / video recordings', 'Pronunciation charts', 'Dictionary', 'Flash cards'];
const VOCAB_RES = ['Dictionary', 'Flash cards', 'Word charts', 'Vocabulary games', 'Reading texts'];
const GRAM_RES = ['Charts of grammar rules', 'Reading texts', 'Flash cards', 'Dictionary', 'Pictures and maps'];
const READ_RES = ['Reading texts (stories, articles)', 'Dictionary', 'Newspapers and magazines', 'Charts'];
const WRITE_RES = ['Samples of letters, e-mails and reports', 'Writing frames / templates', 'Dictionary', 'Manila cards'];
const LIT_RES = ['Selected poems and plays', 'Audio / video recordings of performances', 'Dictionary', 'Charts of literary devices'];
const SERVICE_RES = ['Short texts for practice', 'Dictionary (English-Kiswahili)', 'Samples of edited texts', 'Charts'];

Object.assign(UNITS, {
  // ---- Form I ----
  'E1-1.1': { mainCompetence: EN1, specificCompetence: 'Use ICT tools to search for information', mainActivity: 'Use search engines and ICT search tools to find information', methods: ['demonstration', 'practical', 'brainstorming'], resources: ['Computer / smartphone / tablet with internet', 'Search engines', 'Projector', 'Online/offline sources'] },
  'E1-2.1': { mainCompetence: EN2, specificCompetence: 'Develop listening skills', mainActivity: 'Listen to presentations and audio, answer questions, write words heard and reproduce oral messages', methods: ['qa', 'groupDiscussion', 'practical'], resources: LISTEN_RES },
  'E1-2.2': { mainCompetence: EN2, specificCompetence: 'Produce short and coherent oral messages', mainActivity: 'Practise pronunciation, word stress and vowel sounds', methods: ['demonstration', 'practical', 'groupDiscussion'], resources: SPEAK_RES },
  'E1-2.3': { mainCompetence: EN2, specificCompetence: 'Develop vocabulary from conversations and written texts', mainActivity: 'Write new vocabulary, construct sentences and play vocabulary games', methods: ['brainstorming', 'tips', 'smallGroups'], resources: VOCAB_RES },
  'E1-2.4': { mainCompetence: EN2, specificCompetence: 'Use appropriate grammar and vocabulary in oral and written contexts', mainActivity: 'Express ideas using correct grammar, construct sentences and take part in debates', methods: ['groupDiscussion', 'qa', 'smallGroups'], resources: GRAM_RES },
  'E1-3.1': { mainCompetence: EN3, specificCompetence: 'Read texts for comprehension', mainActivity: 'Read texts, sequence events, summarise and retell', methods: ['tips', 'groupDiscussion', 'qa'], resources: READ_RES },
  'E1-3.2': { mainCompetence: EN3, specificCompetence: 'Comprehend oral messages', mainActivity: 'Paraphrase and respond to oral messages and questions', methods: ['qa', 'rolePlay', 'groupDiscussion'], resources: LISTEN_RES },
  'E1-3.3': { mainCompetence: EN3, specificCompetence: 'Respond appropriately in oral and written communication', mainActivity: 'Express ideas, use non-verbal cues and suitable language for different audiences', methods: ['rolePlay', 'groupDiscussion', 'scenario'], resources: SPEAK_RES },
  'E1-4.1': { mainCompetence: EN4, specificCompetence: 'Use appropriate grammar and vocabulary for oral communication', mainActivity: 'Describe routines, ongoing activities, family, ownership and give directions', methods: ['rolePlay', 'practical', 'qa'], resources: GRAM_RES },
  'E1-4.2': { mainCompetence: EN4, specificCompetence: 'Create a variety of texts using appropriate tone and register', mainActivity: 'Write using the stages of writing: friendly letters, invitations, dialogues and timetables', methods: ['practical', 'tips', 'smallGroups'], resources: WRITE_RES },
  // ---- Form II ----
  'E2-1.1a': { mainCompetence: EN2, specificCompetence: 'Develop listening skills', mainActivity: 'Participate in various conversations', methods: ['rolePlay', 'groupDiscussion'], resources: LISTEN_RES },
  'E2-1.1b': { mainCompetence: EN2, specificCompetence: 'Develop listening skills', mainActivity: 'Summarise information from oral presentations', methods: ['tips', 'qa'], resources: LISTEN_RES },
  'E2-1.1c': { mainCompetence: EN2, specificCompetence: 'Develop listening skills', mainActivity: 'Paraphrase information presented orally', methods: ['tips', 'smallGroups'], resources: LISTEN_RES },
  'E2-1.2a': { mainCompetence: EN2, specificCompetence: 'Produce short and coherent oral messages', mainActivity: 'Construct sentences with proper intonation', methods: ['demonstration', 'practical'], resources: SPEAK_RES },
  'E2-1.2b': { mainCompetence: EN2, specificCompetence: 'Produce short and coherent oral messages', mainActivity: 'Use cohesive devices to deliver oral presentations', methods: ['demonstration', 'smallGroups'], resources: SPEAK_RES },
  'E2-1.3a': { mainCompetence: EN2, specificCompetence: 'Develop vocabulary from conversations and written texts', mainActivity: 'Recognise words with opposite meanings', methods: ['brainstorming', 'smallGroups'], resources: VOCAB_RES },
  'E2-1.3b': { mainCompetence: EN2, specificCompetence: 'Develop vocabulary from conversations and written texts', mainActivity: 'Produce new words using prefixes and suffixes', methods: ['demonstration', 'smallGroups'], resources: VOCAB_RES },
  'E2-1.4a': { mainCompetence: EN2, specificCompetence: 'Use appropriate grammar and vocabulary in oral and written contexts', mainActivity: 'Produce contextualised oral and written descriptions of personal experiences', methods: ['tips', 'groupDiscussion'], resources: GRAM_RES },
  'E2-1.4b': { mainCompetence: EN2, specificCompetence: 'Use appropriate grammar and vocabulary in oral and written contexts', mainActivity: 'Compose passages on specific contexts', methods: ['practical', 'tips'], resources: GRAM_RES },
  'E2-1.4c': { mainCompetence: EN2, specificCompetence: 'Use appropriate grammar and vocabulary in oral and written contexts', mainActivity: 'Present messages in formal and informal settings using correct grammar and vocabulary', methods: ['rolePlay', 'groupDiscussion'], resources: GRAM_RES },
  'E2-2.1a': { mainCompetence: EN3, specificCompetence: 'Read texts for comprehension', mainActivity: 'Express the main ideas from a text', methods: ['groupDiscussion', 'qa'], resources: READ_RES },
  'E2-2.1b': { mainCompetence: EN3, specificCompetence: 'Read texts for comprehension', mainActivity: 'Infer meanings of unfamiliar words and idiomatic expressions', methods: ['brainstorming', 'smallGroups'], resources: READ_RES },
  'E2-2.1c': { mainCompetence: EN3, specificCompetence: 'Read texts for comprehension', mainActivity: 'Relate the core messages of a text to real life', methods: ['tips', 'groupDiscussion'], resources: READ_RES },
  'E2-2.2a': { mainCompetence: EN3, specificCompetence: 'Comprehend oral messages', mainActivity: 'Synthesise ideas from a variety of oral sources', methods: ['groupDiscussion', 'jigsaw'], resources: LISTEN_RES },
  'E2-2.2b': { mainCompetence: EN3, specificCompetence: 'Comprehend oral messages', mainActivity: 'Summarise information from a variety of oral sources', methods: ['tips', 'qa'], resources: LISTEN_RES },
  'E2-2.2c': { mainCompetence: EN3, specificCompetence: 'Comprehend oral messages', mainActivity: 'Participate in contextualised oral conversations', methods: ['rolePlay', 'scenario'], resources: LISTEN_RES },
  'E2-2.3a': { mainCompetence: EN3, specificCompetence: 'Respond appropriately in oral and written communication', mainActivity: 'Express ideas and opinions in different group settings', methods: ['groupDiscussion', 'rolePlay'], resources: SPEAK_RES },
  'E2-2.3b': { mainCompetence: EN3, specificCompetence: 'Respond appropriately in oral and written communication', mainActivity: 'Use appropriate non-verbal cues in group communication', methods: ['rolePlay', 'visual'], resources: SPEAK_RES },
  'E2-2.3c': { mainCompetence: EN3, specificCompetence: 'Respond appropriately in oral and written communication', mainActivity: 'Use appropriate language to respond to oral communication in a variety of contexts', methods: ['scenario', 'rolePlay'], resources: SPEAK_RES },
  'E2-3.2': { mainCompetence: EN4, specificCompetence: 'Create a variety of texts for different communicative purposes', mainActivity: 'Write claim and request letters, e-mails and short stories using appropriate tone and register', methods: ['practical', 'tips', 'smallGroups'], resources: WRITE_RES },
  // ---- Form III ----
  'E3-1.1': { mainCompetence: EN1, specificCompetence: 'Organise information obtained from different sources', mainActivity: 'Identify strategies for organising information, sort, categorise and compile it', methods: ['groupDiscussion', 'practical', 'smallGroups'], resources: ['Computer / smartphone with internet', 'Reference books', 'Manila cards', 'Online/offline sources'] },
  'E3-2.1': { mainCompetence: EN2, specificCompetence: 'Use appropriate grammar and vocabulary', mainActivity: 'Hold conversations, compose stories and describe events using proper grammar and vocabulary', methods: ['rolePlay', 'tips', 'groupDiscussion'], resources: GRAM_RES },
  'E3-3.1': { mainCompetence: EN3, specificCompetence: 'Read texts for comprehension', mainActivity: 'Distinguish facts from opinions, express connotative meanings and paraphrase texts', methods: ['brainstorming', 'groupDiscussion', 'tips'], resources: READ_RES },
  'E3-3.2': { mainCompetence: EN3, specificCompetence: 'Comprehend oral messages with increasing complexity', mainActivity: 'Discuss, respond to and comment on information from oral sources', methods: ['rolePlay', 'groupDiscussion', 'qa'], resources: LISTEN_RES },
  'E3-3.3': { mainCompetence: EN3, specificCompetence: 'Respond appropriately in a variety of communicative situations', mainActivity: 'Express ideas, use non-verbal cues and evaluate information in mass and public communication', methods: ['rolePlay', 'groupDiscussion', 'scenario'], resources: SPEAK_RES },
  'E3-3.4': { mainCompetence: EN3, specificCompetence: 'Construct meaning from a variety of texts', mainActivity: 'Read, generate meanings and paraphrase textual information from multiple sources', methods: ['jigsaw', 'groupDiscussion', 'tips'], resources: READ_RES },
  'E3-4.1': { mainCompetence: EN4, specificCompetence: 'Use appropriate grammar and vocabulary in oral communication', mainActivity: 'Hold debates, dialogues and interviews and present facts logically', methods: ['rolePlay', 'groupDiscussion', 'scenario'], resources: SPEAK_RES },
  'E3-4.2': { mainCompetence: EN4, specificCompetence: 'Create a variety of texts for different purposes', mainActivity: 'Write formal texts such as reports and biographies', methods: ['practical', 'tips', 'smallGroups'], resources: WRITE_RES },
  'E3-5.1': { mainCompetence: EN5, specificCompetence: 'Apply principles of editing and proofreading', mainActivity: 'Describe and apply the steps of editing and proofreading', methods: ['demonstration', 'practical', 'smallGroups'], resources: SERVICE_RES },
  'E3-5.2': { mainCompetence: EN5, specificCompetence: 'Apply principles of interpretation', mainActivity: 'Explain interpretation and interpret a short simple text in a school context', methods: ['brainstorming', 'rolePlay', 'practical'], resources: SERVICE_RES },
  'E3-5.3': { mainCompetence: EN5, specificCompetence: 'Apply principles of translation', mainActivity: 'Explain translation and translate a simple short text in a school context', methods: ['brainstorming', 'practical', 'smallGroups'], resources: SERVICE_RES },
  'E3-6.1': { mainCompetence: EN6, specificCompetence: 'Appreciate the aesthetics and value of literature', mainActivity: 'Assess the language used in selected poems and plays and compare own values with those implied', methods: ['groupDiscussion', 'tips', 'qa'], resources: LIT_RES },
  'E3-6.2': { mainCompetence: EN6, specificCompetence: 'Evaluate the context in which literary texts are produced', mainActivity: 'Assess the socio-political and cultural contexts of selected poems and plays', methods: ['groupDiscussion', 'caseStudy', 'jigsaw'], resources: LIT_RES },
  'E3-6.3': { mainCompetence: EN6, specificCompetence: 'Analyse genres of literature and appreciate their features', mainActivity: 'Describe genres of written literature and critique selected poems and plays', methods: ['groupDiscussion', 'jigsaw', 'qa'], resources: LIT_RES },
  'E3-6.4': { mainCompetence: EN6, specificCompetence: 'Create simple literary works', mainActivity: 'Compose free verse poems and publish them on various platforms', methods: ['practical', 'projectActivity', 'tips'], resources: LIT_RES },
});

const PEF = (form: 1 | 2 | 3) => (topic: string, subtopic: string, part: string, unit: string, ...specificActivities: string[]): LessonPart =>
  ({ id: `e${form}-${++_n}`, subject: 'English Language', form, topic, subtopic, part, unit, specificActivities });
const PE1 = PEF(1);
const PE2 = PEF(2);
const PE3 = PEF(3);

LESSON_PARTS.push(
  // ===== ENGLISH FORM I =====
  PE1('Using ICT tools to search for information', 'Search engines', 'Meaning and examples of search engines', 'E1-1.1', 'Explain what a search engine is', 'Name common search engines'),
  PE1('Using ICT tools to search for information', 'Search engines', 'Searching for information using a search engine', 'E1-1.1', 'Search for information using keywords', 'Record the information found'),
  PE1('Using ICT tools to search for information', 'ICT search tools', 'Other ICT tools for searching (e-libraries, dictionaries and apps)', 'E1-1.1', 'Identify ICT tools used to search for information', 'Use one tool to find the meaning of words'),
  PE1('Using ICT tools to search for information', 'ICT search tools', 'Evaluating information found online', 'E1-1.1', 'Check whether online information is reliable', 'Report the findings to the class'),

  PE1('Listening to various types of information', 'Listening to presentations', 'Listening to a presentation and answering questions', 'E1-2.1', 'Listen attentively to a short presentation', 'Answer questions about what was heard'),
  PE1('Listening to various types of information', 'Listening to audio', 'Listening to audio to identify pronunciation', 'E1-2.1', 'Identify the pronunciation of words from audio', 'Repeat the words correctly'),
  PE1('Listening to various types of information', 'Dictation', 'Writing words heard (dictation)', 'E1-2.1', 'Write words correctly as they are heard', 'Correct spelling mistakes'),
  PE1('Listening to various types of information', 'Oral messages', 'Reproducing oral messages', 'E1-2.1', 'Listen to a short oral message', 'Reproduce the message in own words'),

  PE1('Producing short and coherent oral messages', 'Pronunciation', 'Minimal pairs', 'E1-2.2', 'Pronounce minimal pairs correctly', 'Differentiate words that sound similar'),
  PE1('Producing short and coherent oral messages', 'Pronunciation', 'Word stress', 'E1-2.2', 'Identify the stressed syllable in words', 'Pronounce words with correct stress'),
  PE1('Producing short and coherent oral messages', 'Pronunciation', 'Short and long vowel sounds', 'E1-2.2', 'Distinguish short and long vowel sounds', 'Pronounce words with short and long vowels'),
  PE1('Producing short and coherent oral messages', 'Pronunciation', 'Unfamiliar sounds and similar sounds with different spellings', 'E1-2.2', 'Pronounce unfamiliar English sounds', 'Pronounce words that sound alike but are spelt differently'),

  PE1('Developing vocabulary from conversations and written texts', 'New vocabulary', 'Writing new vocabulary from conversations and texts', 'E1-2.3', 'Identify new words from a conversation or text', 'Write the meanings of the new words'),
  PE1('Developing vocabulary from conversations and written texts', 'Using vocabulary in sentences', 'Constructing sentences using new vocabulary', 'E1-2.3', 'Construct correct sentences using new words', 'Use the new words in short passages'),
  PE1('Developing vocabulary from conversations and written texts', 'Vocabulary games', 'Playing vocabulary games', 'E1-2.3', 'Take part in vocabulary games', 'Recall and use new words correctly'),

  PE1('Using appropriate grammar and vocabulary in oral and written contexts', 'Expressing ideas', 'Expressing ideas using correct grammar', 'E1-2.4', 'Express ideas using correct sentences', 'Correct grammar mistakes in own sentences'),
  PE1('Using appropriate grammar and vocabulary in oral and written contexts', 'Constructing sentences', 'Constructing sentences in different contexts', 'E1-2.4', 'Construct sentences suitable for a given context', 'Use appropriate vocabulary in the sentences'),
  PE1('Using appropriate grammar and vocabulary in oral and written contexts', 'Debate', 'Debating on a simple topic', 'E1-2.4', 'Present points in a simple debate', 'Respond politely to opposing views'),

  PE1('Reading texts for comprehension', 'Sequencing events', 'Reading a text and sequencing events', 'E1-3.1', 'Read a text and identify the events', 'Arrange the events in the correct order'),
  PE1('Reading texts for comprehension', 'Summarising', 'Summarising a text', 'E1-3.1', 'Identify the main points in a text', 'Write a short summary'),
  PE1('Reading texts for comprehension', 'Retelling', 'Retelling a text', 'E1-3.1', 'Retell a text in own words', 'Keep the main ideas of the text'),

  PE1('Comprehending oral messages', 'Paraphrasing oral messages', 'Paraphrasing oral messages', 'E1-3.2', 'Listen to an oral message', 'Paraphrase the message in own words'),
  PE1('Comprehending oral messages', 'Responding to oral messages', 'Responding to oral messages', 'E1-3.2', 'Respond appropriately to an oral message', 'Ask for clarification where needed'),
  PE1('Comprehending oral messages', 'Responding to questions', 'Responding to questions', 'E1-3.2', 'Answer oral questions correctly', 'Ask relevant questions'),

  PE1('Responding through oral and written communication', 'Expressing ideas', 'Expressing ideas in interpersonal communication', 'E1-3.3', 'Express ideas clearly to another person', 'Use polite expressions'),
  PE1('Responding through oral and written communication', 'Non-verbal cues', 'Using non-verbal cues', 'E1-3.3', 'Identify common non-verbal cues', 'Use gestures and facial expressions appropriately'),
  PE1('Responding through oral and written communication', 'Grammar and vocabulary in context', 'Using grammar and vocabulary in different contexts', 'E1-3.3', 'Use suitable grammar for a given situation', 'Choose vocabulary appropriate to the context'),
  PE1('Responding through oral and written communication', 'Language for different audiences', 'Using language suitable for different age groups', 'E1-3.3', 'Adjust language for different age groups', 'Give examples of formal and informal language'),

  PE1('Using appropriate grammar and vocabulary for oral communication', 'Daily routines', 'Describing daily routines (present simple tense)', 'E1-4.1', 'Describe daily routines using the present simple tense', 'Ask and answer questions about routines'),
  PE1('Using appropriate grammar and vocabulary for oral communication', 'Ongoing activities', 'Describing ongoing activities (present progressive tense)', 'E1-4.1', 'Describe ongoing activities using the present progressive tense', 'Ask and answer questions about what is happening'),
  PE1('Using appropriate grammar and vocabulary for oral communication', 'Family and occupations', 'Talking about family relationships and occupations', 'E1-4.1', 'Name family members and occupations', 'Talk about own family'),
  PE1('Using appropriate grammar and vocabulary for oral communication', 'Ownership', 'Expressing ownership and possession', 'E1-4.1', 'Express ownership using possessive forms', 'Ask and answer questions about possession'),
  PE1('Using appropriate grammar and vocabulary for oral communication', 'Giving directions', 'Giving directions', 'E1-4.1', 'Give directions using prepositions and landmarks', 'Follow directions given by others'),

  PE1('Creating a variety of texts using appropriate tone and register', 'Stages of writing', 'Stages of writing (planning, drafting, revising, editing and publishing)', 'E1-4.2', 'Describe the stages of writing', 'Apply the stages to a short text'),
  PE1('Creating a variety of texts using appropriate tone and register', 'Friendly letters and invitations', 'Writing a friendly letter', 'E1-4.2', 'State the format of a friendly letter', 'Write a friendly letter'),
  PE1('Creating a variety of texts using appropriate tone and register', 'Friendly letters and invitations', 'Writing an invitation', 'E1-4.2', 'State the parts of an invitation', 'Write an invitation'),
  PE1('Creating a variety of texts using appropriate tone and register', 'Dialogues', 'Writing dialogues', 'E1-4.2', 'Write a short dialogue using correct punctuation', 'Perform the dialogue in pairs'),
  PE1('Creating a variety of texts using appropriate tone and register', 'Timetables for routines', 'Writing a timetable of daily routines', 'E1-4.2', 'Prepare a timetable of own routines', 'Describe the timetable in sentences'),

  // ===== ENGLISH FORM II =====
  PE2('Listening', 'Act 1: Participating in different conversations', 'Participating in different conversations', 'E2-1.1a', 'Listen and take turns in conversation', 'Respond appropriately to what others say'),
  PE2('Listening', 'Act 2: Summarising information from oral presentations', 'Summarising information from oral presentations', 'E2-1.1b', 'Note main points from an oral presentation', 'Summarise the presentation orally or in writing'),
  PE2('Listening', 'Act 3: Paraphrasing oral information', 'Paraphrasing oral information', 'E2-1.1c', 'Listen to oral information', 'Paraphrase it using own words'),

  PE2('Producing oral messages', 'Act 1: Constructing sentences with proper intonation', 'Intonation in statements, questions and commands', 'E2-1.2a', 'Identify rising and falling intonation', 'Construct sentences with proper intonation'),
  PE2('Producing oral messages', 'Act 2: Using cohesive devices in oral presentations', 'Cohesive devices in oral presentations', 'E2-1.2b', 'Identify cohesive devices (e.g. firstly, however, finally)', 'Use cohesive devices in a short oral presentation'),

  PE2('Vocabulary', 'Act 1: Recognising words with opposite meanings', 'Words with opposite meanings (antonyms)', 'E2-1.3a', 'Identify words with opposite meanings', 'Use antonyms in sentences'),
  PE2('Vocabulary', 'Act 2: Producing new vocabulary by attaching prefixes and suffixes', 'Prefixes', 'E2-1.3b', 'Form new words by adding prefixes', 'Use the new words in sentences'),
  PE2('Vocabulary', 'Act 2: Producing new vocabulary by attaching prefixes and suffixes', 'Suffixes', 'E2-1.3b', 'Form new words by adding suffixes', 'Use the new words in sentences'),

  PE2('Grammar and vocabulary', 'Act 1: Producing contextualised descriptions of personal experiences', 'Describing personal experiences (past tenses)', 'E2-1.4a', 'Describe personal experiences using past tenses', 'Share an experience orally and in writing'),
  PE2('Grammar and vocabulary', 'Act 2: Composing a passage from a specific context', 'Composing a passage on a given context', 'E2-1.4b', 'Plan a passage on a given context', 'Write a passage with correct grammar and vocabulary'),
  PE2('Grammar and vocabulary', 'Act 3: Presenting messages using correct grammar and vocabulary', 'Presenting messages in formal and informal situations', 'E2-1.4c', 'Present a message using suitable grammar and vocabulary', 'Distinguish formal from informal language'),

  PE2('Reading for comprehension', 'Act 1: Expressing the main ideas from texts', 'Identifying the main ideas in a text', 'E2-2.1a', 'Read a text and identify its main ideas', 'Express the main ideas in own words'),
  PE2('Reading for comprehension', 'Act 2: Inferring meanings', 'Inferring meanings of unfamiliar words and idiomatic expressions', 'E2-2.1b', 'Infer the meaning of words from context', 'Explain common idiomatic expressions'),
  PE2('Reading for comprehension', 'Act 3: Relating messages from the text to real-life experiences', 'Relating text messages to real life', 'E2-2.1c', 'Identify the core message of a text', 'Relate the message to real-life experiences'),

  PE2('Comprehending oral messages', 'Act 1: Synthesising ideas from a variety of oral sources', 'Synthesising ideas from oral sources', 'E2-2.2a', 'Listen to different oral sources', 'Combine ideas from the sources'),
  PE2('Comprehending oral messages', 'Act 2: Summarising information from oral sources', 'Summarising information from oral sources', 'E2-2.2b', 'Identify key information from oral sources', 'Summarise the information'),
  PE2('Comprehending oral messages', 'Act 3: Participating in contextualised oral conversation', 'Participating in contextualised oral conversations', 'E2-2.2c', 'Take part in a conversation on a given context', 'Respond appropriately to other speakers'),

  PE2('Responding to oral and written communication', 'Act 1: Expressing ideas and opinions in communicative settings', 'Expressing ideas and opinions in group settings', 'E2-2.3a', 'Express ideas and opinions clearly', 'Respect other people\'s opinions'),
  PE2('Responding to oral and written communication', 'Act 2: Using appropriate non-verbal cues in group communication', 'Non-verbal cues in group communication', 'E2-2.3b', 'Identify non-verbal cues used in groups', 'Use non-verbal cues appropriately'),
  PE2('Responding to oral and written communication', 'Act 3: Using appropriate grammar and vocabulary for oral communication in a variety of contexts', 'Using suitable grammar and vocabulary in different contexts', 'E2-2.3c', 'Use suitable language for different contexts', 'Respond to oral messages appropriately'),
  PE2('Responding to oral and written communication', 'Act 4: Creating a variety of texts for different communicative purposes', 'Writing claim and request letters', 'E2-3.2', 'State the format of claim and request letters', 'Write a claim or request letter'),
  PE2('Responding to oral and written communication', 'Act 4: Creating a variety of texts for different communicative purposes', 'Writing e-mails', 'E2-3.2', 'State the parts of an e-mail', 'Write an e-mail using appropriate tone'),
  PE2('Responding to oral and written communication', 'Act 4: Creating a variety of texts for different communicative purposes', 'Writing short stories', 'E2-3.2', 'Identify the structure of a short story', 'Write a short story on a given topic'),

  // ===== ENGLISH FORM III =====
  PE3('Organising information', 'Strategies for organising information', 'Ways of organising information', 'E3-1.1', 'Identify ways of organising information', 'Choose a suitable way for a given task'),
  PE3('Organising information', 'Sorting and categorising information', 'Sorting and categorising information from various sources', 'E3-1.1', 'Sort information into categories', 'Label the categories correctly'),
  PE3('Organising information', 'Compiling information', 'Compiling information searched from various sources', 'E3-1.1', 'Compile information from different sources', 'Present the compiled information'),

  PE3('Using grammar and vocabulary in communication', 'Conversations', 'Holding conversations on various contexts', 'E3-2.1', 'Hold a conversation using suitable grammar', 'Use vocabulary appropriate to the context'),
  PE3('Using grammar and vocabulary in communication', 'Composing stories', 'Composing stories using proper grammar', 'E3-2.1', 'Plan a story', 'Write a story using proper grammar'),
  PE3('Using grammar and vocabulary in communication', 'Describing events', 'Describing events (e.g. elections, sports, ceremonies)', 'E3-2.1', 'Describe an event in correct sequence', 'Use descriptive vocabulary'),

  PE3('Reading for comprehension', 'Facts and opinions', 'Distinguishing facts from opinions', 'E3-3.1', 'Differentiate facts from opinions in a text', 'Give reasons for the choice'),
  PE3('Reading for comprehension', 'Connotative meanings', 'Expressing connotative meanings of words', 'E3-3.1', 'Differentiate denotative from connotative meaning', 'Explain connotative meanings in a text'),
  PE3('Reading for comprehension', 'Paraphrasing', 'Paraphrasing a given text', 'E3-3.1', 'Identify the key ideas of a text', 'Paraphrase the text in own words'),

  PE3('Listening for comprehension', 'Discussing oral information', 'Discussing information from oral sources', 'E3-3.2', 'Listen to an oral source', 'Discuss the information in groups'),
  PE3('Listening for comprehension', 'Responding to oral messages', 'Responding to oral messages', 'E3-3.2', 'Respond appropriately to oral messages', 'Role-play a response to a message'),
  PE3('Listening for comprehension', 'Commenting on oral messages', 'Commenting on oral messages', 'E3-3.2', 'Give relevant comments on an oral message', 'Support comments with reasons'),

  PE3('Responding to messages appropriately', 'Mass communication', 'Expressing ideas, opinions and facts in mass communication', 'E3-3.3', 'Identify forms of mass communication', 'Express ideas and facts suitable for mass media'),
  PE3('Responding to messages appropriately', 'Non-verbal cues', 'Using and interpreting non-verbal cues in mass communication', 'E3-3.3', 'Interpret non-verbal cues', 'Use them appropriately'),
  PE3('Responding to messages appropriately', 'Public communication', 'Using appropriate language in public communication', 'E3-3.3', 'Use suitable language in public speaking', 'Appreciate other people\'s ideas'),
  PE3('Responding to messages appropriately', 'Evaluating information', 'Evaluating information from mass communication', 'E3-3.3', 'Evaluate the accuracy of information received', 'Give reasons for the evaluation'),

  PE3('Constructing meanings', 'Generating meanings', 'Reading and generating meanings from a variety of texts', 'E3-3.4', 'Read different types of texts', 'Generate meanings from the texts'),
  PE3('Constructing meanings', 'Paraphrasing multiple sources', 'Paraphrasing textual information from multiple sources', 'E3-3.4', 'Compare information from different sources', 'Paraphrase the information'),

  PE3('Communicating orally', 'Debates and dialogues', 'Expressing opinions through debates and dialogues', 'E3-4.1', 'Present arguments in a debate', 'Hold a dialogue on a given topic'),
  PE3('Communicating orally', 'Presenting facts', 'Presenting facts logically', 'E3-4.1', 'Present facts in a logical order', 'Use appropriate linking words'),
  PE3('Communicating orally', 'Conditions and situations', 'Describing conditions about various situations (conditional sentences)', 'E3-4.1', 'Use conditional sentences to describe situations', 'Give examples from daily life'),
  PE3('Communicating orally', 'Interviews', 'Asking and responding to questions in interviews', 'E3-4.1', 'Ask relevant interview questions', 'Respond appropriately in an interview'),
  PE3('Communicating orally', 'Social and cultural events', 'Describing activities and events of a social or cultural nature', 'E3-4.1', 'Describe a social or cultural event', 'Use appropriate tenses and vocabulary'),

  PE3('Writing formal texts', 'Reports', 'Writing reports on various events', 'E3-4.2', 'State the format of a report', 'Write a report on an event'),
  PE3('Writing formal texts', 'Biographies', 'Writing biographies', 'E3-4.2', 'Identify the features of a biography', 'Write a short biography using correct tenses'),

  PE3('Editing and proofreading', 'Principles of editing and proofreading', 'Basic principles of editing and proofreading', 'E3-5.1', 'Recognise the basic principles of editing and proofreading', 'Differentiate editing from proofreading'),
  PE3('Editing and proofreading', 'Steps of editing and proofreading', 'Main steps of editing and proofreading', 'E3-5.1', 'Describe the main steps of editing and proofreading', 'Use proofreading marks'),
  PE3('Editing and proofreading', 'Applying editing and proofreading', 'Editing and proofreading a given text', 'E3-5.1', 'Edit a text for grammar and spelling', 'Proofread the text and produce a clean copy'),

  PE3('Interpreting oral texts', 'Concept of interpretation', 'Meaning of interpretation', 'E3-5.2', 'Explain the concept of interpretation', 'Give situations where interpretation is needed'),
  PE3('Interpreting oral texts', 'Principles of interpretation', 'Principles of interpretation', 'E3-5.2', 'Explain the principles of interpretation', 'Give examples of good interpretation practice'),
  PE3('Interpreting oral texts', 'Practising interpretation', 'Interpreting a short simple text in a school context', 'E3-5.2', 'Interpret a short oral text', 'Evaluate each other\'s interpretation'),

  PE3('Translating written texts', 'Concept of translation', 'Meaning of translation', 'E3-5.3', 'Explain the concept of translation', 'Differentiate translation from interpretation'),
  PE3('Translating written texts', 'Principles of translation', 'Principles of translation', 'E3-5.3', 'Explain the principles of translation', 'Give examples of common translation challenges'),
  PE3('Translating written texts', 'Practising translation', 'Translating a simple short text in a school context', 'E3-5.3', 'Translate a short written text', 'Check the translation for accuracy'),

  PE3('Genres of written literature', 'Genres of literature', 'Genres of written literature and their features', 'E3-6.3', 'Name the genres of written literature', 'Describe the features of each genre'),
  PE3('Genres of written literature', 'Critiquing poems and plays', 'Techniques of critiquing poems and plays', 'E3-6.3', 'Describe techniques of critiquing', 'Apply them to a short extract'),
  PE3('Genres of written literature', 'Critiquing poems and plays', 'Critiquing selected poems and plays based on form and content', 'E3-6.3', 'Critique a poem based on form and content', 'Critique a play extract based on form and content'),

  PE3('Aesthetics and values in literature', 'Language in literary works', 'Assessing the language used in selected poems and plays', 'E3-6.1', 'Identify literary language in a poem or play', 'Explain its effect on the reader'),
  PE3('Aesthetics and values in literature', 'Values in literary works', 'Comparing own values with those implied in literary works', 'E3-6.1', 'Identify values implied in a literary work', 'Compare them with own values'),

  PE3('Contexts in literature', 'Socio-political and cultural contexts', 'Socio-political and cultural contexts of selected poems and plays', 'E3-6.2', 'Describe the context of a literary work', 'Explain how context shapes the work'),
  PE3('Contexts in literature', 'Issues in literary works', 'Socio-political, economic and cultural issues in literary works', 'E3-6.2', 'Identify issues raised in a literary work', 'Discuss the issues in groups'),
  PE3('Contexts in literature', 'Relating context to real life', 'Relating the context of selected poems and plays to real life', 'E3-6.2', 'Relate the context of a literary work to real life', 'Give examples from the community'),

  PE3('Creating simple literary works', 'Composing free verse poems', 'Composing free verse poems on various topics', 'E3-6.4', 'Identify the features of free verse', 'Compose a free verse poem using literary devices'),
  PE3('Creating simple literary works', 'Publishing poems', 'Publishing poems on various platforms (notice boards, school magazine)', 'E3-6.4', 'Select and polish a poem for publishing', 'Publish the poem on a suitable platform'),
);

export const ENGLISH_REFERENCES: Partial<Record<1 | 2 | 3 | 4, string>> = {
  1: "Tanzania Institute of Education. (2023). English for secondary schools student's book, form one. Tanzania Institute of Education.",
  2: "Tanzania Institute of Education. (2024). English for secondary schools student's book, form two. Tanzania Institute of Education.",
  3: "Tanzania Institute of Education. (2025). English for secondary schools student's book, form three. Tanzania Institute of Education.",
};

// ===================== GEOGRAPHY (Form I-II) =====================
// Source: TIE Geography O-Level syllabus + Student's Books (Form I 2023, Form II 2025). Form III-IV not yet given.
export const GEOGRAPHY_COMMON_RESOURCES = [
  'Chalkboard / whiteboard',
  'Markers and chalk',
  'Handouts',
  'Globe',
  'Wall maps and charts',
  'Atlas',
  'Pictures and photographs',
  'Projector / smartphone (videos and simulations)',
  "Student's book (Geography, as applicable)",
];

const GM1 = 'Demonstrate mastery of the structure of the Earth';
const GM2 = 'Demonstrate mastery of basic skills and techniques in Geography';
const GS11 = 'Demonstrate an understanding of the origin and the structure of the Earth and Earth systems';
const GS12 = 'Demonstrate an understanding of the major features of the Earth surface';
const GS21 = 'Demonstrate an understanding of the basic techniques of map and photograph interpretation';

const GEO_BASIC = ['Relevant books', 'Charts', 'Pictures of landforms', 'ICT simulation tools'];
const EARTH_RES = ['Globe', 'Pictures of the solar system', 'Models of planets', 'ICT simulation tools', 'Relevant books'];
const FEATURE_RES = ['World map', 'Atlas', 'Globe', 'Pictures of landforms and water bodies', 'Charts of vegetation zones', 'Video clips'];
const INTERNAL_RES = ['Charts of the Earth\'s interior', 'Models (clay, plasticine)', 'Rock samples', 'Video clips of volcanoes and earthquakes', 'ICT simulation tools'];
const EXTERNAL_RES = ['Rock samples', 'Pictures of weathering and mass wasting', 'Charts and diagrams of rivers and coasts', 'Video clips', 'Models'];
const MAP_RES = ['Topographical maps', 'Atlas', 'Ruler and pencils', 'Tracing paper', 'Graph paper', 'Models of landforms'];
const PHOTO_RES = ['Ground photographs', 'Aerial photographs', 'Satellite images', 'Topographical maps', 'Smartphone / projector'];

Object.assign(UNITS, {
  // ---- Form I ----
  'G1-1.1a': { mainCompetence: GM1, specificCompetence: GS11, mainActivity: 'Explain the concept and scope of Geography (branches, importance and relationship with other disciplines)', methods: ['brainstorming', 'fieldTrip', 'groupDiscussion'], resources: GEO_BASIC },
  'G1-1.1b': { mainCompetence: GM1, specificCompetence: GS11, mainActivity: 'Describe the Earth (origin, shape, size, position and movements in the solar system, parallels and meridians)', methods: ['brainstorming', 'projectActivity', 'visual'], resources: EARTH_RES },
  'G1-1.2a': { mainCompetence: GM1, specificCompetence: GS12, mainActivity: 'Describe major features of the Earth\'s surface (continents, oceans, relief features, inland water bodies and vegetation zones)', methods: ['qa', 'fieldTrip', 'groupDiscussion'], resources: FEATURE_RES },
  // ---- Form II ----
  'G2-1.1a': { mainCompetence: GM1, specificCompetence: GS11, mainActivity: 'Describe the internal structure of the Earth (crust, mantle, core) and their characteristics', methods: ['brainstorming', 'projectActivity', 'visual'], resources: INTERNAL_RES },
  'G2-1.1b': { mainCompetence: GM1, specificCompetence: GS11, mainActivity: 'Explain the internal forces of the Earth, vulcanicity and earthquakes', methods: ['groupDiscussion', 'caseStudy', 'visual'], resources: INTERNAL_RES },
  'G2-1.1c': { mainCompetence: GM1, specificCompetence: GS11, mainActivity: 'Describe the external structure of the Earth and the external forces that shape the Earth\'s surface (weathering, mass wasting, running water, waves)', methods: ['qa', 'fieldTrip', 'groupDiscussion'], resources: EXTERNAL_RES },
  'G2-2.1a': { mainCompetence: GM2, specificCompetence: GS21, mainActivity: 'Describe the basic principles of reading and interpreting maps (key, symbols, direction, margin, title, scale)', methods: ['demonstration', 'practical', 'brainstorming'], resources: MAP_RES },
  'G2-2.1b': { mainCompetence: GM2, specificCompetence: GS21, mainActivity: 'Read and interpret maps: represent relief by contours, draw cross-sections and interpret topographical maps', methods: ['practical', 'demonstration', 'groupDiscussion'], resources: MAP_RES },
  'G2-2.1c': { mainCompetence: GM2, specificCompetence: GS21, mainActivity: 'Describe the basic concept of photographs in Geography (meaning, types, satellite images and uses)', methods: ['brainstorming', 'groupDiscussion', 'visual'], resources: PHOTO_RES },
  'G2-2.1d': { mainCompetence: GM2, specificCompetence: GS21, mainActivity: 'Interpret photographs (foreground, middle ground, background) and compare photographs with maps', methods: ['qa', 'practical', 'groupDiscussion'], resources: PHOTO_RES },
});

const PGF = (form: 1 | 2) => (topic: string, subtopic: string, part: string, unit: string, ...specificActivities: string[]): LessonPart =>
  ({ id: `g${form}-${++_n}`, subject: 'Geography', form, topic, subtopic, part, unit, specificActivities });
const PG1 = PGF(1);
const PG2 = PGF(2);

LESSON_PARTS.push(
  // ===== GEOGRAPHY FORM I =====
  PG1('Introduction to Geography', 'Concept of Geography', 'Meaning of Geography', 'G1-1.1a', 'Explain the meaning of Geography', 'Give examples of geographical features in the surroundings'),
  PG1('Introduction to Geography', 'Concept of Geography', 'Scope of Geography (physical and human)', 'G1-1.1a', 'Describe the scope of Geography', 'Differentiate physical from human geography'),
  PG1('Introduction to Geography', 'Branches of Geography', 'Physical Geography and its sub-branches', 'G1-1.1a', 'Name the branches of physical geography', 'Describe what each branch studies'),
  PG1('Introduction to Geography', 'Branches of Geography', 'Human Geography and its sub-branches', 'G1-1.1a', 'Name the branches of human geography', 'Describe what each branch studies'),
  PG1('Introduction to Geography', 'Importance of studying Geography', 'Importance of studying Geography', 'G1-1.1a', 'State the importance of studying Geography', 'Explain how Geography helps in daily life and careers'),
  PG1('Introduction to Geography', 'The relationship between Geography and other disciplines', 'Relationship between Geography and other subjects', 'G1-1.1a', 'Show how Geography is related to other subjects', 'Give examples from Biology, History, Mathematics and Economics'),

  PG1('The planet Earth', 'Origin of the Earth', 'Theories of the origin of the Earth', 'G1-1.1b', 'Describe theories of the origin of the Earth', 'Compare the theories'),
  PG1('The planet Earth', 'Position of the Earth in the Solar system', 'The Solar system and the planets', 'G1-1.1b', 'Name the components of the Solar system', 'Describe the position of the Earth among the planets'),
  PG1('The planet Earth', 'Position of the Earth in the Solar system', 'Making a model of the Solar system', 'G1-1.1b', 'Design a simple model of the Solar system', 'Present the model to the class'),
  PG1('The planet Earth', 'Shape and size of the Earth', 'Shape of the Earth and evidence', 'G1-1.1b', 'Describe the shape of the Earth', 'Give evidence that the Earth is spherical'),
  PG1('The planet Earth', 'Shape and size of the Earth', 'Size of the Earth', 'G1-1.1b', 'State the size of the Earth (diameter and circumference)', 'Explain why the Earth is slightly flattened at the poles'),
  PG1('The planet Earth', 'Earth\'s curved horizon', 'The Earth\'s curved horizon', 'G1-1.1b', 'Explain what the curved horizon is', 'Show how it proves the Earth is curved'),

  PG1('Movements of the Earth in the Solar system', 'Rotation of the Earth', 'Rotation of the Earth', 'G1-1.1b', 'Explain what rotation is', 'State the direction and period of rotation'),
  PG1('Movements of the Earth in the Solar system', 'Evidences of the earth\'s rotation', 'Evidences of the Earth\'s rotation', 'G1-1.1b', 'Give evidence of the Earth\'s rotation', 'Explain each evidence'),
  PG1('Movements of the Earth in the Solar system', 'The effects of rotation', 'Effects of rotation (day and night, time, tides and deflection of winds)', 'G1-1.1b', 'Describe the effects of rotation', 'Explain how rotation causes day and night'),
  PG1('Movements of the Earth in the Solar system', 'Revolution of the Earth', 'Revolution of the Earth', 'G1-1.1b', 'Explain what revolution is', 'State the period of revolution and the inclination of the axis'),
  PG1('Movements of the Earth in the Solar system', 'Revolution of the Earth', 'Effects of revolution (seasons and length of day)', 'G1-1.1b', 'Describe the effects of revolution', 'Explain how seasons occur'),
  PG1('Movements of the Earth in the Solar system', 'Parallels and meridians', 'Parallels of latitude', 'G1-1.1b', 'Define parallels of latitude and name the major ones', 'Locate places using latitude'),
  PG1('Movements of the Earth in the Solar system', 'Parallels and meridians', 'Meridians of longitude and time', 'G1-1.1b', 'Define meridians of longitude and the Prime Meridian', 'Calculate local time differences using longitude'),

  PG1('Major features of the Earth\'s surface', 'Earth\'s surface', 'Land and water on the Earth\'s surface', 'G1-1.2a', 'Describe the distribution of land and water', 'Explain why the Earth is called the water planet'),
  PG1('Major features of the Earth\'s surface', 'Continents and oceans of the world', 'Continents and oceans of the world', 'G1-1.2a', 'Name and locate the continents and oceans', 'Describe their size and distribution'),
  PG1('Major features of the Earth\'s surface', 'Interaction between continental landmasses and water bodies', 'Interaction between landmasses and water bodies', 'G1-1.2a', 'Describe the interaction between land and water bodies', 'Explain its effect on climate and human activities'),
  PG1('Major features of the Earth\'s surface', 'Major relief features of the continents', 'Mountains and plateaus', 'G1-1.2a', 'Describe mountains and plateaus', 'Give examples from Tanzania and the world'),
  PG1('Major features of the Earth\'s surface', 'Major relief features of the continents', 'Plains and valleys', 'G1-1.2a', 'Describe plains and valleys', 'Give examples from Tanzania and the world'),
  PG1('Major features of the Earth\'s surface', 'Water bodies on the earth\'s surface', 'Large inland water bodies (lakes and rivers)', 'G1-1.2a', 'Describe major inland water bodies', 'Locate the main lakes and rivers on a map'),
  PG1('Major features of the Earth\'s surface', 'The ocean floor and its features', 'Features of the ocean floor', 'G1-1.2a', 'Describe the ocean floor features (continental shelf, slope, ridges and trenches)', 'Draw a simple diagram of the ocean floor'),
  PG1('Major features of the Earth\'s surface', 'Vegetation', 'Vegetation zones of the world', 'G1-1.2a', 'Name the major vegetation zones', 'Locate them on a world map'),
  PG1('Major features of the Earth\'s surface', 'Vegetation', 'Characteristics and importance of vegetation', 'G1-1.2a', 'Describe the characteristics of each vegetation type', 'State the importance of vegetation'),

  // ===== GEOGRAPHY FORM II =====
  PG2('The internal structure of the Earth', 'The concept of the internal structure of the Earth', 'Meaning of the internal structure of the Earth', 'G2-1.1a', 'Explain the internal structure of the Earth', 'List its layers'),
  PG2('The internal structure of the Earth', 'Crust', 'The crust', 'G2-1.1a', 'Describe the crust (location, thickness, density and composition)', 'Differentiate continental from oceanic crust'),
  PG2('The internal structure of the Earth', 'Mantle', 'The mantle', 'G2-1.1a', 'Describe the mantle (location, thickness, density and composition)', 'Explain its importance'),
  PG2('The internal structure of the Earth', 'Core', 'The core', 'G2-1.1a', 'Describe the outer and inner core', 'Compare the core with the mantle and crust'),
  PG2('The internal structure of the Earth', 'The role of Earth\'s internal structure in rock formation', 'Rock formation (igneous, sedimentary and metamorphic)', 'G2-1.1a', 'Describe how the three rock types form', 'Link the internal structure to rock formation'),
  PG2('The internal structure of the Earth', 'The internal forces of the Earth', 'Internal forces: folding', 'G2-1.1b', 'Describe how folding occurs', 'Name fold mountains and their features'),
  PG2('The internal structure of the Earth', 'The internal forces of the Earth', 'Internal forces: faulting', 'G2-1.1b', 'Describe how faulting occurs', 'Describe fault features (rift valleys and block mountains)'),
  PG2('The internal structure of the Earth', 'Vulcanicity', 'Vulcanicity: intrusive features', 'G2-1.1b', 'Describe intrusive volcanic features', 'Draw and label them'),
  PG2('The internal structure of the Earth', 'Vulcanicity', 'Vulcanicity: extrusive features and types of volcanoes', 'G2-1.1b', 'Describe extrusive volcanic features and types of volcanoes', 'Give examples of volcanoes in Tanzania and the world'),
  PG2('The internal structure of the Earth', 'The economic importance of volcanic activities', 'Economic importance of volcanic activities', 'G2-1.1b', 'State the economic importance of volcanic activities', 'Give local examples'),
  PG2('The internal structure of the Earth', 'Negative effects of volcanic eruptions', 'Negative effects of volcanic eruptions', 'G2-1.1b', 'Describe the negative effects of volcanic eruptions', 'Suggest ways of reducing the effects'),
  PG2('The internal structure of the Earth', 'Earthquakes', 'Earthquakes: meaning and distribution', 'G2-1.1b', 'Explain what an earthquake is', 'Describe where earthquakes occur most'),
  PG2('The internal structure of the Earth', 'Causes of the earthquake', 'Causes of earthquakes', 'G2-1.1b', 'Explain the causes of earthquakes', 'Differentiate natural from human-induced causes'),
  PG2('The internal structure of the Earth', 'Effects of earthquakes', 'Effects of earthquakes', 'G2-1.1b', 'Describe the effects of earthquakes', 'Give examples of past earthquakes'),
  PG2('The internal structure of the Earth', 'Minimising risks caused by earthquake incidents', 'Minimising risks caused by earthquakes', 'G2-1.1b', 'Suggest ways of minimising earthquake risks', 'Explain safety measures before, during and after an earthquake'),

  PG2('The external structure of the Earth', 'Concept of the external structure of the Earth', 'External structure of the Earth (hydrosphere, atmosphere and biosphere)', 'G2-1.1c', 'Describe the external structure of the Earth', 'Explain how the external systems interact'),
  PG2('The external structure of the Earth', 'External forces affecting the Earth\'s surface', 'External forces and their agents', 'G2-1.1c', 'Identify external forces and their agents', 'Explain how they change the Earth\'s surface'),
  PG2('The external structure of the Earth', 'Weathering', 'Physical weathering', 'G2-1.1c', 'Describe types of physical weathering', 'Give local examples'),
  PG2('The external structure of the Earth', 'Weathering', 'Chemical and biological weathering', 'G2-1.1c', 'Describe chemical and biological weathering', 'Give local examples'),
  PG2('The external structure of the Earth', 'Significance of weathering', 'Significance of weathering', 'G2-1.1c', 'State the significance of weathering', 'Explain how weathering forms soil'),
  PG2('The external structure of the Earth', 'Mass wasting', 'Types and causes of mass wasting', 'G2-1.1c', 'Describe types of mass wasting (creep, landslide, mudflow)', 'Explain the causes'),
  PG2('The external structure of the Earth', 'Effects of mass wasting on the environment', 'Effects of mass wasting on the environment', 'G2-1.1c', 'Describe the effects of mass wasting', 'Suggest ways of controlling it'),
  PG2('The external structure of the Earth', 'The action of running water on the Earth\'s surface', 'Work of running water: erosion, transportation and deposition', 'G2-1.1c', 'Describe the work of running water', 'Name features formed by erosion and deposition'),
  PG2('The external structure of the Earth', 'The action of running water on the Earth\'s surface', 'River landforms (valleys, waterfalls, meanders, deltas and flood plains)', 'G2-1.1c', 'Describe river landforms', 'Draw and label river landforms'),
  PG2('The external structure of the Earth', 'Wave action and coastal features', 'Wave action and coastal erosion features', 'G2-1.1c', 'Describe wave action', 'Describe features of coastal erosion (cliffs, caves and arches)'),
  PG2('The external structure of the Earth', 'Wave action and coastal features', 'Coastal deposition features', 'G2-1.1c', 'Describe features of coastal deposition (beaches, spits and bars)', 'Give examples along the Tanzanian coast'),

  PG2('Map reading and interpretation', 'Concept of map reading and interpretation', 'Meaning of map reading and interpretation', 'G2-2.1a', 'Explain map reading and interpretation', 'State why it is a useful skill'),
  PG2('Map reading and interpretation', 'Essential elements of a map', 'Essential elements of a map (title, key, scale, direction, frame)', 'G2-2.1a', 'Identify the essential elements of a map', 'Explain the use of each element'),
  PG2('Map reading and interpretation', 'Characteristics of good maps', 'Characteristics of good maps', 'G2-2.1a', 'Describe the characteristics of a good map', 'Evaluate a given map'),
  PG2('Map reading and interpretation', 'Importance of maps', 'Importance of maps', 'G2-2.1a', 'State the importance of maps', 'Give examples of the use of maps in daily life'),
  PG2('Map reading and interpretation', 'Representing relief features on maps', 'Methods of representing relief on maps', 'G2-2.1b', 'Describe methods of showing relief on maps', 'Compare the methods'),
  PG2('Map reading and interpretation', 'Contours', 'Contours and contour patterns', 'G2-2.1b', 'Define contours and contour interval', 'Identify contour patterns'),
  PG2('Map reading and interpretation', 'Contours and associated landforms', 'Highland landforms on contour maps', 'G2-2.1b', 'Identify highland landforms from contours', 'Describe their features'),
  PG2('Map reading and interpretation', 'Contours and associated landforms', 'Lowland landforms on contour maps', 'G2-2.1b', 'Identify lowland landforms from contours', 'Describe their features'),
  PG2('Map reading and interpretation', 'Contours and associated landforms', 'Coastline landforms on contour maps', 'G2-2.1b', 'Identify coastline landforms from contours', 'Describe their features'),
  PG2('Map reading and interpretation', 'Cross-section', 'Drawing a cross-section', 'G2-2.1b', 'Draw a cross-section from a contour map', 'Label the main features'),
  PG2('Map reading and interpretation', 'Vertical exaggeration', 'Vertical exaggeration', 'G2-2.1b', 'Calculate vertical exaggeration', 'Explain its effect on a cross-section'),
  PG2('Map reading and interpretation', 'Map interpretation', 'Interpreting a topographical map', 'G2-2.1b', 'Describe relief, drainage and settlement on a map', 'Suggest human activities from the map evidence'),

  PG2('Photograph reading and interpretation', 'Concept of photograph reading and interpretation', 'Meaning of photograph reading and interpretation', 'G2-2.1c', 'Explain photograph reading and interpretation', 'State why photographs are used in Geography'),
  PG2('Photograph reading and interpretation', 'Types of photographs', 'Types of photographs (ground and aerial)', 'G2-2.1c', 'Describe ground and aerial photographs', 'Differentiate vertical from oblique photographs'),
  PG2('Photograph reading and interpretation', 'Satellite images', 'Satellite images', 'G2-2.1c', 'Explain what satellite images are', 'Describe how they are obtained'),
  PG2('Photograph reading and interpretation', 'Uses of satellite images', 'Uses of satellite images', 'G2-2.1c', 'State the uses of satellite images', 'Give examples (weather forecasting, mapping and environmental monitoring)'),
  PG2('Photograph reading and interpretation', 'Similarities and differences between photographs and maps', 'Photographs and maps: similarities and differences', 'G2-2.1d', 'State similarities between photographs and maps', 'State differences between photographs and maps'),
  PG2('Photograph reading and interpretation', 'Uses of photographs', 'Uses of photographs', 'G2-2.1d', 'State the uses of photographs', 'Give examples from different fields'),
  PG2('Photograph reading and interpretation', 'Photograph reading and interpretation', 'Foreground, middle ground and background', 'G2-2.1d', 'Identify foreground, middle ground and background', 'Describe features in each part'),
  PG2('Photograph reading and interpretation', 'Photograph reading and interpretation', 'Interpreting a photograph', 'G2-2.1d', 'Interpret geographical features and activities in a photograph', 'Draw a labelled sketch of the photograph'),
  PG2('Photograph reading and interpretation', 'Importance of photograph reading and interpretation', 'Importance of photograph reading and interpretation', 'G2-2.1d', 'State the importance of reading photographs', 'Apply the skill to a new photograph'),
);

export const GEOGRAPHY_REFERENCES: Partial<Record<1 | 2 | 3 | 4, string>> = {
  1: "Tanzania Institute of Education. (2023). Geography for secondary schools student's book, form one. Tanzania Institute of Education.",
  2: "Tanzania Institute of Education. (2025). Geography for secondary schools student's book, form two. Tanzania Institute of Education.",
};

// ===================== HISTORY (Form I-II) =====================
// Source: TIE History Form I-IV syllabus + Student's Books (Form I 2023, Form II 2025). Form III-IV not yet given.
export const HISTORY_COMMON_RESOURCES = [
  'Chalkboard / whiteboard',
  'Markers and chalk',
  'Handouts',
  'Maps of Africa and the world',
  'Charts and time lines',
  'Pictures and photographs',
  'Projector / smartphone (videos and documentaries)',
  "Student's book (History, as applicable)",
];

const HM1 = 'Demonstrate mastery of African history before colonialism';
const HS11 = 'Demonstrate an understanding of the concept of History and sources of historical information';
const HS12 = 'Demonstrate an understanding of theories of the origin of human beings';
const HS13 = 'Demonstrate an understanding of the economic, political, social and technological development of pre-colonial Africa';
const HS14 = 'Demonstrate an understanding of interactions among African societies during the pre-colonial era';
const HS15 = 'Demonstrate an understanding of the early contacts among the people of Africa, the Middle East, the Far East and Europe from the 1st Century to the 19th Century';

const HIST_BASIC = ['Relevant books', 'Charts and time lines', 'Pictures of historical sources', 'Museum / historical site visit', 'Resource person (elder or historian)'];
const ORIGIN_RES = ['Pictures of human ancestors and tools', 'Charts of human evolution', 'Replicas of stone tools', 'Video clips', 'Resource person (religious leader, archaeologist)'];
const ECON_RES = ['Pictures of farming, crafts and mining', 'Samples of crafts (pottery, baskets, iron tools)', 'Charts of modes of production', 'Video clips', 'Resource person (elder, craftsman)'];
const STATE_RES = ['Maps of pre-colonial African states', 'Charts of state organisation', 'Pictures of historical sites', 'Video clips', 'Resource person (elder)'];
const CONTACT_RES = ['Maps of trade routes', 'Pictures of commodities and ships', 'Charts and time lines', 'Video clips', 'Relevant books'];

Object.assign(UNITS, {
  // ---- Form I ----
  'H1-1.1': { mainCompetence: HM1, specificCompetence: HS11, mainActivity: 'Explain the concept of History, dating of events and sources of historical information', methods: ['brainstorming', 'fieldTrip', 'groupDiscussion'], resources: HIST_BASIC },
  'H1-1.2a': { mainCompetence: HM1, specificCompetence: HS12, mainActivity: 'Describe the theories of the origin of human beings', methods: ['guestSpeaker', 'groupDiscussion', 'brainstorming'], resources: ORIGIN_RES },
  'H1-1.2b': { mainCompetence: HM1, specificCompetence: HS12, mainActivity: 'Describe the stages of human evolution and their technological ages', methods: ['rolePlay', 'visual', 'groupDiscussion'], resources: ORIGIN_RES },
  'H1-1.3a': { mainCompetence: HM1, specificCompetence: HS13, mainActivity: 'Describe pre-colonial modes of production and social organisation in Africa', methods: ['fieldTrip', 'groupDiscussion', 'qa'], resources: ECON_RES },
  'H1-1.3b': { mainCompetence: HM1, specificCompetence: HS13, mainActivity: 'Explain economic activities (agriculture, handcraft and mining) and their impact on pre-colonial African societies', methods: ['groupDiscussion', 'fieldTrip', 'visual'], resources: ECON_RES },
  'H1-1.3c': { mainCompetence: HM1, specificCompetence: HS13, mainActivity: 'Describe social, political and education systems in pre-colonial African societies', methods: ['groupDiscussion', 'caseStudy', 'guestSpeaker'], resources: STATE_RES },
  'H1-1.3d': { mainCompetence: HM1, specificCompetence: HS13, mainActivity: 'Describe the organisation of centralised states in pre-colonial Africa', methods: ['jigsaw', 'groupDiscussion', 'visual'], resources: STATE_RES },
  // ---- Form II ----
  'H2-1.4a': { mainCompetence: HM1, specificCompetence: HS14, mainActivity: 'Explain the meaning of interaction and interactions among African societies in different regions', methods: ['jigsaw', 'groupDiscussion', 'visual'], resources: CONTACT_RES },
  'H2-1.4b': { mainCompetence: HM1, specificCompetence: HS14, mainActivity: 'Assess the effects of interactions among African societies', methods: ['groupDiscussion', 'caseStudy', 'qa'], resources: CONTACT_RES },
  'H2-1.5a': { mainCompetence: HM1, specificCompetence: HS15, mainActivity: 'Describe the early contacts between African societies, the Middle East and the Far East (motives, conditions, commodities and effects)', methods: ['brainstorming', 'groupDiscussion', 'visual'], resources: CONTACT_RES },
  'H2-1.5b': { mainCompetence: HM1, specificCompetence: HS15, mainActivity: 'Explain the early contacts between African societies and Europeans (the Portuguese)', methods: ['caseStudy', 'groupDiscussion', 'qa'], resources: CONTACT_RES },
});

const PHF = (form: 1 | 2) => (topic: string, subtopic: string, part: string, unit: string, ...specificActivities: string[]): LessonPart =>
  ({ id: `h${form}-${++_n}`, subject: 'History', form, topic, subtopic, part, unit, specificActivities });
const PH1 = PHF(1);
const PH2 = PHF(2);

LESSON_PARTS.push(
  // ===== HISTORY FORM I =====
  PH1('Introduction to History', 'Meaning of History', 'Meaning of History', 'H1-1.1', 'Explain the meaning of History', 'Give examples of historical events'),
  PH1('Introduction to History', 'Qualities of historical events', 'Qualities of historical events', 'H1-1.1', 'Describe the qualities of historical events', 'Differentiate historical from non-historical events'),
  PH1('Introduction to History', 'Ways of dating historical events', 'Ways of dating historical events', 'H1-1.1', 'Describe the ways of dating historical events', 'Date given events using the time line'),
  PH1('Introduction to History', 'Importance of studying History', 'Importance of studying History', 'H1-1.1', 'State the importance of studying History', 'Explain how History helps in understanding the present'),
  PH1('Introduction to History', 'Relationship between History and other related subjects', 'Relationship between History and other subjects', 'H1-1.1', 'Show how History is related to other subjects', 'Give examples (Geography, Civics, Archaeology)'),
  PH1('Introduction to History', 'Concept of sources of historical information', 'Sources of historical information: meaning and types', 'H1-1.1', 'Explain the meaning of sources of historical information', 'Name the types of sources'),
  PH1('Introduction to History', 'Concept of sources of historical information', 'Oral and written sources', 'H1-1.1', 'Describe oral and written sources', 'State their advantages and limitations'),
  PH1('Introduction to History', 'Concept of sources of historical information', 'Archaeological, anthropological and other sources', 'H1-1.1', 'Describe archaeological and other sources', 'State their advantages and limitations'),

  PH1('Origin of human beings', 'Theories of the origin of human beings', 'Religious theories of the origin of human beings', 'H1-1.2a', 'Describe religious theories of human origin', 'Discuss them respectfully'),
  PH1('Origin of human beings', 'Theories of the origin of human beings', 'Scientific theory (evolution)', 'H1-1.2a', 'Describe the scientific theory of human origin', 'Compare it with religious theories'),
  PH1('Origin of human beings', 'Major groups of human ancestors', 'Major groups of human ancestors', 'H1-1.2b', 'Name the major groups of human ancestors', 'Describe their characteristics'),
  PH1('Origin of human beings', 'Human technology', 'Stone Age technology', 'H1-1.2b', 'Describe Early, Middle and Late Stone Age technology', 'Explain the tools and way of life of each age'),
  PH1('Origin of human beings', 'Human technology', 'Iron Age technology', 'H1-1.2b', 'Describe Iron Age technology', 'Explain its impact on societies'),

  PH1('Production and social organisation in pre-colonial Africa', 'Concepts of social organisation and economic production', 'Social organisation and economic production', 'H1-1.3a', 'Explain social organisation and economic production', 'Give examples from pre-colonial societies'),
  PH1('Production and social organisation in pre-colonial Africa', 'Pre-colonial modes of production', 'Communal mode of production', 'H1-1.3a', 'Describe the communal mode of production', 'State its characteristics'),
  PH1('Production and social organisation in pre-colonial Africa', 'Pre-colonial modes of production', 'Slave and feudal modes of production', 'H1-1.3a', 'Describe slave and feudal modes of production', 'Compare them with the communal mode'),

  PH1('Development of agriculture in pre-colonial African societies', 'Agriculture', 'Meaning, origin and importance of agriculture', 'H1-1.3b', 'Explain the origin and importance of agriculture', 'Describe its effect on societies'),
  PH1('Development of agriculture in pre-colonial African societies', 'Types of agricultural practices in pre-colonial Africa', 'Types of agricultural practices', 'H1-1.3b', 'Describe types of agricultural practices (shifting cultivation, pastoralism and irrigation)', 'Give examples of societies that practised them'),

  PH1('Handcraft and mining industries in pre-colonial Africa', 'Handcraft industries', 'Handcraft industries', 'H1-1.3b', 'Describe handcraft industries (pottery, weaving and carving)', 'Explain their importance'),
  PH1('Handcraft and mining industries in pre-colonial Africa', 'Mining industry', 'Mining and iron working', 'H1-1.3b', 'Describe mining and iron working', 'Explain the importance of mining industries'),

  PH1('Social, political and education systems in pre-colonial Africa', 'Concepts of social, political and education systems', 'Concepts of social, political and education systems', 'H1-1.3c', 'Explain social, political and education systems', 'Give examples from the community'),
  PH1('Social, political and education systems in pre-colonial Africa', 'Non-centralised political system', 'Non-centralised (stateless) political systems', 'H1-1.3c', 'Describe non-centralised political systems', 'Give examples of societies that used them'),
  PH1('Social, political and education systems in pre-colonial Africa', 'Education system in pre-colonial African societies', 'Education in pre-colonial African societies', 'H1-1.3c', 'Describe the content and methods of education', 'Compare it with education today'),

  PH1('State organisation in pre-colonial Africa', 'Meaning of a state', 'Meaning and features of a state', 'H1-1.3d', 'Explain the meaning of a state', 'State the features of a state'),
  PH1('State organisation in pre-colonial Africa', 'Centralised states in East Africa', 'Centralised states in East Africa', 'H1-1.3d', 'Describe centralised states in East Africa (e.g. Buganda and Bunyoro)', 'Explain their political and economic organisation'),
  PH1('State organisation in pre-colonial Africa', 'Western Sudanic states', 'Western Sudanic states', 'H1-1.3d', 'Describe Ghana, Mali and Songhai', 'Explain their rise and decline'),
  PH1('State organisation in pre-colonial Africa', 'Forest states of West Africa', 'Forest states of West Africa', 'H1-1.3d', 'Describe forest states such as Asante and Benin', 'Explain their organisation'),
  PH1('State organisation in pre-colonial Africa', 'Central African kingdoms', 'Central African kingdoms', 'H1-1.3d', 'Describe Central African kingdoms such as Kongo and Luba', 'Explain their organisation'),
  PH1('State organisation in pre-colonial Africa', 'Southern African kingdoms', 'Southern African kingdoms', 'H1-1.3d', 'Describe Southern African kingdoms such as Zulu and Great Zimbabwe', 'Explain their organisation'),

  // ===== HISTORY FORM II =====
  PH2('Interactions in pre-colonial Africa', 'Meaning of interaction', 'Meaning of interaction', 'H2-1.4a', 'Explain the meaning of interaction', 'Give examples of interaction among societies'),
  PH2('Interactions in pre-colonial Africa', 'Interactions in different regions', 'Interactions in different regions: overview', 'H2-1.4a', 'Describe how African societies interacted in different regions', 'Identify the forms of interaction (trade, migration and wars)'),
  PH2('Interactions in pre-colonial Africa', 'Interactions on the Indian Ocean islands', 'Interactions on the Indian Ocean islands', 'H2-1.4a', 'Describe interactions on the Indian Ocean islands', 'Locate the islands on a map'),
  PH2('Interactions in pre-colonial Africa', 'Interactions in Southern Africa', 'Interactions in Southern Africa', 'H2-1.4a', 'Describe interactions in Southern Africa', 'Explain their causes'),
  PH2('Interactions in pre-colonial Africa', 'Interactions in Eastern Africa', 'Interactions in Eastern Africa', 'H2-1.4a', 'Describe interactions in Eastern Africa', 'Explain their causes'),
  PH2('Interactions in pre-colonial Africa', 'Interactions in Western Africa', 'Interactions in Western Africa', 'H2-1.4a', 'Describe interactions in Western Africa', 'Explain their causes'),
  PH2('Interactions in pre-colonial Africa', 'Interactions in Northern Africa', 'Interactions in Northern Africa', 'H2-1.4a', 'Describe interactions in Northern Africa', 'Explain their causes'),
  PH2('Interactions in pre-colonial Africa', 'Effects of the interactions', 'Effects of the interactions', 'H2-1.4b', 'Describe the effects of interactions among African societies', 'Assess positive and negative effects'),

  PH2('Early contacts between Africa, the Middle East and the Far East', 'Early contacts between Africans and people of the Middle and Far East', 'Early contacts with the Middle and Far East', 'H2-1.5a', 'Describe early contacts between Africa, the Middle East and the Far East', 'Locate the trade routes on a map'),
  PH2('Early contacts between Africa, the Middle East and the Far East', 'Motives for the early contacts', 'Motives for the early contacts', 'H2-1.5a', 'Explain the motives for early contacts', 'Differentiate economic from other motives'),
  PH2('Early contacts between Africa, the Middle East and the Far East', 'Conditions that facilitated the early contacts', 'Conditions that facilitated the early contacts', 'H2-1.5a', 'Describe the conditions that facilitated contacts', 'Explain the role of monsoon winds and navigation'),
  PH2('Early contacts between Africa, the Middle East and the Far East', 'Major commodities exchanged', 'Major commodities exchanged', 'H2-1.5a', 'Name the major commodities exchanged', 'Explain the importance of each commodity'),
  PH2('Early contacts between Africa, the Middle East and the Far East', 'Effects of the early contacts', 'Effects of the early contacts', 'H2-1.5a', 'Describe the effects of early contacts', 'Assess positive and negative effects'),

  PH2('Early contacts between Africa and Europe', 'Background to the contacts between Africa and Europe', 'Background to the contacts between Africa and Europe', 'H2-1.5b', 'Explain the background to contacts between Africa and Europe', 'Describe the factors that led Europeans to explore Africa'),
  PH2('Early contacts between Africa and Europe', 'Early contacts between Africans and the Portuguese', 'Early contacts between Africans and the Portuguese', 'H2-1.5b', 'Describe early contacts between Africans and the Portuguese', 'Explain the results of the contacts'),
);

export const HISTORY_REFERENCES: Partial<Record<1 | 2 | 3 | 4, string>> = {
  1: "Tanzania Institute of Education. (2023). History for secondary schools student's book, form one. Tanzania Institute of Education.",
  2: "Tanzania Institute of Education. (2025). History for secondary schools student's book, form two. Tanzania Institute of Education.",
};

// ===================== PHYSICS (Form I-II) =====================
// Source: TIE Physics O-Level syllabus + Student's Books (Form I 2023, Form II 2025). Form III-IV not yet given.
export const PHYSICS_COMMON_RESOURCES = [
  'Chalkboard / whiteboard',
  'Markers and chalk',
  'Handouts',
  'Charts and diagrams',
  'Laboratory apparatus',
  'Calculator',
  'Projector / smartphone (simulations and videos)',
  "Student's book (Physics, as applicable)",
];

const PM1 = 'Apply knowledge of Physics in various contexts';
const PS11 = 'Demonstrate mastery of basic concepts, theories and principles of Physics';
const PS12 = 'Demonstrate mastery of basic terminologies, measurements and symbols in Physics';

const PHY_BASIC = ['Charts and pictures', 'Video clips of physical phenomena', 'Relevant books', 'Simple apparatus'];
const MEASURE_RES = ['Metre rule', 'Vernier calipers', 'Micrometer screw gauge', 'Stopwatch', 'Beam balance', 'Measuring cylinder', 'Thermometer'];
const FORCE_RES = ['Spring balance', 'Masses', 'Trolley and ramp', 'Magnets', 'Charts of forces', 'Elastic bands'];
const DENS_RES = ['Beam balance', 'Measuring cylinder', 'Eureka can', 'Regular and irregular solids', 'Liquids of different densities', 'Hydrometer'];
const FLOAT_RES = ['Eureka can', 'Spring balance', 'Water trough', 'Objects that sink and float', 'Hydrometer', 'Charts of ships and submarines'];
const MATTER_RES = ['Springs and elastic bands', 'Capillary tubes', 'Water and detergent', 'Needle and razor blade', 'Charts of molecular forces'];
const PRESS_RES = ['Wooden blocks', 'Sand tray', 'U-tube manometer', 'Barometer', 'Syringe', 'Water can with holes'];
const MOTION_RES = ['Ticker timer / stopwatch', 'Trolley and ramp', 'Metre rule', 'Charts of motion graphs', 'Ball and measuring tape', 'Simulations'];
const WORK_RES = ['Spring balance', 'Masses', 'Pulleys', 'Inclined plane', 'Stairs / measuring tape', 'Stopwatch'];
const STATIC_RES = ['Ebonite and glass rods', 'Silk and fur cloths', 'Gold-leaf electroscope', 'Capacitors', 'Charts of lightning conductors'];
const CURRENT_RES = ['Cells and batteries', 'Ammeter and voltmeter', 'Connecting wires', 'Resistors', 'Switches and bulbs', 'Rheostat'];
const MAGNET_RES = ['Bar magnets', 'Iron filings', 'Compass needles', 'Soft iron and steel bars', 'Coils of wire', 'Charts of magnetic fields'];
const LIGHT_RES = ['Plane mirror', 'Curved mirrors', 'Ray box', 'Pins and paper', 'Protractor', 'Light sources'];
const REFRACT_RES = ['Glass block and prism', 'Lenses', 'Ray box', 'Screen', 'Pins and paper', 'Colour filters'];
const OPTIC_RES = ['Microscope', 'Telescope / binoculars', 'Lenses', 'Camera / pin-hole camera', 'Model or chart of the human eye'];

Object.assign(UNITS, {
  // ---- Form I ----
  'P1-1.1a': { mainCompetence: PM1, specificCompetence: PS11, mainActivity: 'Explain the concept of Physics (meaning and branches), its theories and principles', methods: ['brainstorming', 'groupDiscussion', 'qa'], resources: PHY_BASIC },
  'P1-1.1b': { mainCompetence: PM1, specificCompetence: PS11, mainActivity: 'Discuss the contribution of Physics to the development of modern society', methods: ['brainstorming', 'groupDiscussion', 'projectActivity'], resources: PHY_BASIC },
  'P1-1.1c': { mainCompetence: PM1, specificCompetence: PS11, mainActivity: 'Explain physical quantities (fundamental and derived quantities)', methods: ['brainstorming', 'qa', 'tips'], resources: MEASURE_RES },
  'P1-1.2a': { mainCompetence: PM1, specificCompetence: PS12, mainActivity: 'Describe and use instruments for measuring physical quantities', methods: ['practical', 'demonstration', 'smallGroups'], resources: MEASURE_RES },
  'P1-1.1d': { mainCompetence: PM1, specificCompetence: PS11, mainActivity: 'Describe linear motion (distance, displacement, speed, velocity and acceleration)', methods: ['practical', 'problemSolving', 'groupDiscussion'], resources: MOTION_RES },
  'P1-1.1e1': { mainCompetence: PM1, specificCompetence: PS11, mainActivity: 'Explain the concept, effects and types of force', methods: ['practical', 'brainstorming', 'groupDiscussion'], resources: FORCE_RES },
  'P1-1.1e2': { mainCompetence: PM1, specificCompetence: PS11, mainActivity: 'Explain density and relative density and determine them by experiment', methods: ['practical', 'problemSolving', 'smallGroups'], resources: DENS_RES },
  'P1-1.1f': { mainCompetence: PM1, specificCompetence: PS11, mainActivity: 'Deduce the relationship between density, sinking and floating (upthrust, Archimedes\' principle, law of floatation)', methods: ['practical', 'problemSolving', 'groupDiscussion'], resources: FLOAT_RES },
  'P1-1.1g': { mainCompetence: PM1, specificCompetence: PS11, mainActivity: 'Describe the mechanical properties of matter in relation to force and energy', methods: ['tips', 'practical', 'groupDiscussion'], resources: MATTER_RES },
  'P1-1.1e3': { mainCompetence: PM1, specificCompetence: PS11, mainActivity: 'Explain pressure in solids, liquids and the atmosphere', methods: ['practical', 'problemSolving', 'groupDiscussion'], resources: PRESS_RES },
  'P1-1.1e4': { mainCompetence: PM1, specificCompetence: PS11, mainActivity: 'Explain work, energy and power and solve related problems', methods: ['practical', 'problemSolving', 'qa'], resources: WORK_RES },
  // ---- Form II ----
  'P2-1.1c': { mainCompetence: PM1, specificCompetence: PS11, mainActivity: 'Explain the concept and principles of static electricity (detection of charges, conductors and insulators, capacitors, charge distribution and lightning conductors)', methods: ['practical', 'demonstration', 'groupDiscussion'], resources: STATIC_RES },
  'P2-1.1d': { mainCompetence: PM1, specificCompetence: PS11, mainActivity: 'Describe the concept and laws of current electricity (e.m.f., potential difference, resistance, heating effect, domestic installation and cells)', methods: ['practical', 'problemSolving', 'smallGroups'], resources: CURRENT_RES },
  'P2-1.1b': { mainCompetence: PM1, specificCompetence: PS11, mainActivity: 'Describe the concept and principles of magnetism (magnetisation, demagnetisation and magnetic fields)', methods: ['practical', 'demonstration', 'groupDiscussion'], resources: MAGNET_RES },
  'P2-1.1a1': { mainCompetence: PM1, specificCompetence: PS11, mainActivity: 'Describe the concept and principles of light (sources, propagation and reflection)', methods: ['practical', 'demonstration', 'groupDiscussion'], resources: LIGHT_RES },
  'P2-1.1a2': { mainCompetence: PM1, specificCompetence: PS11, mainActivity: 'Describe refraction and dispersion of light (prisms, colours and lenses)', methods: ['practical', 'demonstration', 'problemSolving'], resources: REFRACT_RES },
  'P2-1.1a3': { mainCompetence: PM1, specificCompetence: PS11, mainActivity: 'Describe the structure and use of optical instruments', methods: ['demonstration', 'practical', 'groupDiscussion'], resources: OPTIC_RES },
});

const PPF = (form: 1 | 2) => (topic: string, subtopic: string, part: string, unit: string, ...specificActivities: string[]): LessonPart =>
  ({ id: `p${form}-${++_n}`, subject: 'Physics', form, topic, subtopic, part, unit, specificActivities });
const PP1 = PPF(1);
const PP2 = PPF(2);

LESSON_PARTS.push(
  // ===== PHYSICS FORM I =====
  PP1('Introduction to Physics', 'Concept of Physics', 'Meaning of Physics', 'P1-1.1a', 'Explain the meaning of Physics', 'Give examples of physical phenomena around us'),
  PP1('Introduction to Physics', 'Concept of Physics', 'Branches of Physics', 'P1-1.1a', 'Name the branches of Physics', 'Describe what each branch studies'),
  PP1('Introduction to Physics', 'Contribution of Physics to the development of modern society', 'Contribution of Physics to modern society', 'P1-1.1b', 'Describe the contribution of Physics to technology, medicine and communication', 'Give examples from the community'),
  PP1('Introduction to Physics', 'Theories and principles of Physics', 'Theories and principles of Physics', 'P1-1.1a', 'Explain what a theory and a principle are', 'Give examples of physical principles'),
  PP1('Introduction to Physics', 'Theories and principles of Physics', 'Scientific method and laboratory safety', 'P1-1.1a', 'Describe the steps of the scientific method', 'State laboratory safety rules'),

  PP1('Measurement', 'Concept of measurement', 'Meaning and importance of measurement', 'P1-1.1c', 'Explain the meaning of measurement', 'State why measurement is important'),
  PP1('Measurement', 'Physical quantity', 'Fundamental and derived quantities', 'P1-1.1c', 'Differentiate fundamental from derived quantities', 'State the SI units of common quantities'),
  PP1('Measurement', 'Basic equipment/apparatus and their uses', 'Measuring length (metre rule, vernier calipers and micrometer)', 'P1-1.2a', 'Measure length using suitable instruments', 'Read the scales correctly'),
  PP1('Measurement', 'Basic equipment/apparatus and their uses', 'Measuring mass and weight', 'P1-1.2a', 'Measure mass using a beam balance', 'Measure weight using a spring balance'),
  PP1('Measurement', 'Basic equipment/apparatus and their uses', 'Measuring time and volume', 'P1-1.2a', 'Measure time using a stopwatch', 'Measure volume using a measuring cylinder'),
  PP1('Measurement', 'Basic equipment/apparatus and their uses', 'Measuring temperature', 'P1-1.2a', 'Measure temperature using a thermometer', 'Read the scale correctly'),

  PP1('Introduction to force', 'Concept of force', 'Meaning and unit of force', 'P1-1.1e1', 'Explain the meaning of force', 'State the SI unit of force'),
  PP1('Introduction to force', 'Effects of forces', 'Effects of forces', 'P1-1.1e1', 'Describe the effects of forces on objects', 'Demonstrate the effects using simple apparatus'),
  PP1('Introduction to force', 'Types of forces', 'Contact forces (friction, tension and normal reaction)', 'P1-1.1e1', 'Describe contact forces', 'Give examples of each'),
  PP1('Introduction to force', 'Types of forces', 'Non-contact forces (weight, magnetic and electrostatic)', 'P1-1.1e1', 'Describe non-contact forces', 'Differentiate mass from weight'),

  PP1('Density and relative density', 'Concept of density', 'Meaning and calculation of density', 'P1-1.1e2', 'Explain the meaning of density', 'Calculate density using the formula'),
  PP1('Density and relative density', 'Concept of density', 'Determining density by experiment', 'P1-1.1e2', 'Determine the density of regular and irregular solids', 'Determine the density of a liquid'),
  PP1('Density and relative density', 'Relative density of a substance', 'Relative density', 'P1-1.1e2', 'Explain relative density', 'Calculate relative density of solids and liquids'),

  PP1('Sinking and floating', 'Concept of sinking and floating', 'Sinking and floating', 'P1-1.1f', 'Explain why objects sink or float', 'Relate sinking and floating to density'),
  PP1('Sinking and floating', 'Concept of upthrust', 'Upthrust', 'P1-1.1f', 'Explain the concept of upthrust', 'Demonstrate upthrust using a spring balance'),
  PP1('Sinking and floating', 'Archimedes\' Principle', 'Archimedes\' Principle', 'P1-1.1f', 'State Archimedes\' Principle', 'Verify the principle by experiment'),
  PP1('Sinking and floating', 'Law of floatation', 'Law of floatation and its applications', 'P1-1.1f', 'State the law of floatation', 'Explain applications (ships, submarines and hydrometers)'),

  PP1('Mechanical properties of matter', 'Concept of elasticity', 'Elasticity and Hooke\'s law', 'P1-1.1g', 'Explain elasticity', 'Verify Hooke\'s law'),
  PP1('Mechanical properties of matter', 'Adhesion and cohesion', 'Adhesion and cohesion', 'P1-1.1g', 'Differentiate adhesion from cohesion', 'Give examples from daily life'),
  PP1('Mechanical properties of matter', 'Surface tension', 'Surface tension', 'P1-1.1g', 'Explain surface tension', 'Demonstrate it using simple experiments'),
  PP1('Mechanical properties of matter', 'Capillarity', 'Capillarity', 'P1-1.1g', 'Explain capillarity', 'Give examples of capillarity in nature'),

  PP1('Pressure', 'Concept of pressure', 'Meaning and unit of pressure', 'P1-1.1e3', 'Explain the meaning of pressure', 'Calculate pressure using the formula'),
  PP1('Pressure', 'Pressure due to solids', 'Pressure due to solids', 'P1-1.1e3', 'Describe pressure due to solids', 'Explain applications in daily life'),
  PP1('Pressure', 'Pressure in liquids', 'Pressure in liquids', 'P1-1.1e3', 'Describe pressure in liquids', 'Calculate liquid pressure using P = hρg'),
  PP1('Pressure', 'Atmospheric Pressure', 'Atmospheric pressure and its measurement', 'P1-1.1e3', 'Explain atmospheric pressure', 'Describe how a barometer measures it'),

  PP1('Linear motion', 'Concept of motion', 'Concept of motion', 'P1-1.1d', 'Explain the concept of motion', 'Give examples of types of motion'),
  PP1('Linear motion', 'Distance and displacement', 'Distance and displacement', 'P1-1.1d', 'Differentiate distance from displacement', 'Solve simple problems'),
  PP1('Linear motion', 'Speed and velocity', 'Speed and velocity', 'P1-1.1d', 'Differentiate speed from velocity', 'Calculate speed and velocity'),
  PP1('Linear motion', 'Acceleration', 'Acceleration', 'P1-1.1d', 'Explain acceleration and retardation', 'Calculate acceleration'),
  PP1('Linear motion', 'Equation of linear motion', 'Equations of linear motion', 'P1-1.1d', 'State the equations of linear motion', 'Apply the equations to solve problems'),
  PP1('Linear motion', 'Motion under gravity', 'Motion under gravity', 'P1-1.1d', 'Describe free fall and the acceleration due to gravity', 'Solve problems on motion under gravity'),

  PP1('Work, energy, and power', 'Concept of work', 'Work', 'P1-1.1e4', 'Explain the concept of work', 'Calculate work done'),
  PP1('Work, energy, and power', 'Concept of energy', 'Forms and sources of energy', 'P1-1.1e4', 'Describe forms and sources of energy', 'State the law of conservation of energy'),
  PP1('Work, energy, and power', 'Concept of energy', 'Kinetic and potential energy', 'P1-1.1e4', 'Calculate kinetic and potential energy', 'Show energy transformation in examples'),
  PP1('Work, energy, and power', 'Concept of power', 'Power', 'P1-1.1e4', 'Explain the concept of power', 'Calculate power and efficiency'),

  // ===== PHYSICS FORM II =====
  PP2('Static electricity', 'Concept of static electricity', 'Charging by friction and detecting charges', 'P2-1.1c', 'Explain static electricity', 'Detect charges using an electroscope'),
  PP2('Static electricity', 'Conductors and insulators', 'Conductors and insulators', 'P2-1.1c', 'Differentiate conductors from insulators', 'Charge objects by contact and induction'),
  PP2('Static electricity', 'Capacitors', 'Capacitors and capacitance', 'P2-1.1c', 'Explain how a capacitor stores charge', 'Calculate capacitance'),
  PP2('Static electricity', 'Capacitors', 'Combination of capacitors', 'P2-1.1c', 'Calculate the effective capacitance in series and parallel', 'State uses of capacitors'),
  PP2('Static electricity', 'Charge distribution on a conductor', 'Charge distribution on a conductor', 'P2-1.1c', 'Describe how charge is distributed on a conductor', 'Explain the action of points'),
  PP2('Static electricity', 'Lightning and thunderstorms', 'Lightning and lightning conductors', 'P2-1.1c', 'Explain how lightning occurs', 'Describe how a lightning conductor protects buildings'),

  PP2('Current electricity', 'Concept of current electricity', 'Electric current, potential difference and e.m.f.', 'P2-1.1d', 'Explain current, potential difference and e.m.f.', 'Measure current and voltage in a circuit'),
  PP2('Current electricity', 'Resistance to an electric current', 'Resistance and Ohm\'s law', 'P2-1.1d', 'State and verify Ohm\'s law', 'Calculate resistance'),
  PP2('Current electricity', 'Resistance to an electric current', 'Resistors in series and parallel', 'P2-1.1d', 'Calculate effective resistance in series and parallel', 'Solve circuit problems'),
  PP2('Current electricity', 'Heating effect of an electric current', 'Heating effect of an electric current', 'P2-1.1d', 'Explain the heating effect of current', 'Calculate electrical energy and power'),
  PP2('Current electricity', 'Electrical installations', 'Domestic electrical installations', 'P2-1.1d', 'Describe a domestic wiring system', 'State safety measures (fuses and earthing)'),
  PP2('Current electricity', 'Cells', 'Cells and batteries', 'P2-1.1d', 'Describe primary and secondary cells', 'Explain internal resistance and cell arrangements'),

  PP2('Magnetism', 'Concept of magnetism', 'Magnets and magnetic materials', 'P2-1.1b', 'Explain the concept of magnetism', 'Identify magnetic and non-magnetic materials'),
  PP2('Magnetism', 'Magnetisation and demagnetisation', 'Magnetisation and demagnetisation', 'P2-1.1b', 'Describe methods of magnetising materials', 'Describe methods of demagnetising materials'),
  PP2('Magnetism', 'Magnetic field of a magnet', 'Magnetic field of a magnet', 'P2-1.1b', 'Plot the magnetic field of a bar magnet', 'Describe the properties of field lines'),
  PP2('Magnetism', 'Earth\'s magnetic field', 'Earth\'s magnetic field', 'P2-1.1b', 'Describe the Earth\'s magnetic field', 'Explain magnetic declination and dip'),

  PP2('Nature and reflection of light', 'Concept of light', 'Concept and sources of light', 'P2-1.1a1', 'Explain the concept of light', 'Name natural and artificial sources of light'),
  PP2('Nature and reflection of light', 'Propagation and transmission of light', 'Propagation and transmission of light', 'P2-1.1a1', 'Describe rectilinear propagation of light', 'Explain shadows, eclipses and the pin-hole camera'),
  PP2('Nature and reflection of light', 'Reflection of light through the plane mirror', 'Laws of reflection and images in plane mirrors', 'P2-1.1a1', 'State the laws of reflection', 'Locate images formed by plane mirrors'),
  PP2('Nature and reflection of light', 'Reflection of light from curved mirrors', 'Concave and convex mirrors', 'P2-1.1a1', 'Describe images formed by curved mirrors', 'Draw ray diagrams'),
  PP2('Nature and reflection of light', 'Reflection of light from curved mirrors', 'Mirror formula and applications of curved mirrors', 'P2-1.1a1', 'Apply the mirror formula to solve problems', 'State the uses of curved mirrors'),

  PP2('Refraction and dispersion of light', 'Concept of refraction of light', 'Refraction of light and refractive index', 'P2-1.1a2', 'Explain refraction of light', 'Calculate the refractive index'),
  PP2('Refraction and dispersion of light', 'Concept of refraction of light', 'Total internal reflection', 'P2-1.1a2', 'Explain total internal reflection', 'Describe its applications (optical fibres)'),
  PP2('Refraction and dispersion of light', 'Refraction of light by a glass prism', 'Refraction of light by a glass prism', 'P2-1.1a2', 'Trace a ray of light through a prism', 'Explain the angle of deviation'),
  PP2('Refraction and dispersion of light', 'Colours of light', 'Dispersion and colours of light', 'P2-1.1a2', 'Explain the dispersion of white light', 'Describe primary and secondary colours'),
  PP2('Refraction and dispersion of light', 'Refraction of light by lenses', 'Converging and diverging lenses', 'P2-1.1a2', 'Describe images formed by lenses', 'Draw ray diagrams for lenses'),
  PP2('Refraction and dispersion of light', 'Refraction of light by lenses', 'Lens formula and magnification', 'P2-1.1a2', 'Apply the lens formula to solve problems', 'Calculate magnification and power of a lens'),

  PP2('Optical instruments', 'Simple microscope', 'Simple microscope', 'P2-1.1a3', 'Describe how a simple microscope works', 'Calculate its magnifying power'),
  PP2('Optical instruments', 'Compound microscope', 'Compound microscope', 'P2-1.1a3', 'Describe how a compound microscope works', 'Draw its ray diagram'),
  PP2('Optical instruments', 'Astronomical telescope', 'Astronomical telescope', 'P2-1.1a3', 'Describe how an astronomical telescope works', 'Calculate its magnifying power'),
  PP2('Optical instruments', 'Binoculars', 'Binoculars', 'P2-1.1a3', 'Describe how binoculars work', 'State their uses'),
  PP2('Optical instruments', 'Lens camera', 'Lens camera', 'P2-1.1a3', 'Describe the parts of a lens camera', 'Compare the camera with the human eye'),
  PP2('Optical instruments', 'The human eye', 'The human eye and defects of vision', 'P2-1.1a3', 'Describe the structure of the human eye', 'Explain defects of vision and their correction'),
);

export const PHYSICS_REFERENCES: Partial<Record<1 | 2 | 3 | 4, string>> = {
  1: "Tanzania Institute of Education. (2023). Physics for secondary schools student's book, form one. Tanzania Institute of Education.",
  2: "Tanzania Institute of Education. (2025). Physics for secondary schools student's book, form two. Tanzania Institute of Education.",
};

// ===================== CHEMISTRY (Form I-II) =====================
// Source: TIE Chemistry O-Level syllabus + Student's Books (Form I 2023, Form II 2025). Form III-IV not yet given.
export const CHEMISTRY_COMMON_RESOURCES = [
  'Chalkboard / whiteboard',
  'Markers and chalk',
  'Handouts',
  'Charts and diagrams',
  'Laboratory apparatus and chemicals',
  'Periodic table chart',
  'Projector / smartphone (simulations and videos)',
  "Student's book (Chemistry, as applicable)",
];

const CM1 = 'Demonstrate mastery of basic concepts, theories and principles in Chemistry';
const CM2 = 'Demonstrate mastery of basic terminologies in Chemistry';
const CM3 = 'Conduct experiments in Chemistry';
const CS11 = 'Demonstrate mastery of concepts, theories and principles in Chemistry';
const CS12 = 'Demonstrate an understanding of the physical and chemical properties of elements on the basis of their arrangements in the periodic table';
const CS21 = 'Use the IUPAC nomenclature to name chemical species';
const CS22 = 'Use chemical symbols, formulae and equations to represent chemical reactions';

const CHEM_BASIC = ['Charts and pictures', 'Video clips', 'Relevant books', 'Samples of chemical products'];
const LAB_RES = ['Laboratory apparatus', 'Charts of apparatus and safety signs', 'First aid kit', 'Fire extinguisher / sand bucket', 'Video clips'];
const FIRE_RES = ['Candle, matches and Bunsen burner', 'Fire extinguisher', 'Sand and water buckets', 'Charts of the fire triangle', 'Video clips'];
const CHEM_MATTER_RES = ['Ice, water and steam setup', 'Heat source', 'Beakers and thermometer', 'Charts of states of matter', 'Samples of substances'];
const ELEMENT_RES = ['Periodic table chart', 'Samples of elements', 'Charts of chemical symbols', 'Flash cards of elements'];
const SEPARATE_RES = ['Filter paper and funnel', 'Evaporating dish', 'Distillation set', 'Chromatography paper', 'Magnet', 'Mixtures (sand and salt, ink, iron filings)'];
const ATOM_RES = ['Models of atoms', 'Charts of atomic structure', 'Periodic table chart', 'Simulations'];
const PERIODIC_RES = ['Periodic table chart', 'Samples of elements', 'Charts of trends', 'Simulations'];
const BOND_RES = ['Models of molecules and ionic lattices', 'Charts of bonding', 'Periodic table chart', 'Simulations'];
const REACT_RES = ['Test tubes and chemicals', 'Heat source', 'Balances', 'Charts of equations', 'Samples of everyday reactions'];
const ACID_RES = ['Dilute acids and bases', 'Indicators and litmus paper', 'pH chart', 'Test tubes and beakers', 'Locally available materials (flowers, fruits)'];

Object.assign(UNITS, {
  // ---- Form I ----
  'C1-1.1a': { mainCompetence: CM1, specificCompetence: CS11, mainActivity: 'Describe the concept of Chemistry (meaning, branches, applications and relationships with other disciplines)', methods: ['brainstorming', 'groupDiscussion', 'qa'], resources: CHEM_BASIC },
  'C1-1.1b': { mainCompetence: CM1, specificCompetence: CS11, mainActivity: 'Discuss the contribution of Chemistry in the development of modern society', methods: ['fieldTrip', 'groupDiscussion', 'projectActivity'], resources: CHEM_BASIC },
  'C1-3.1a': { mainCompetence: CM3, specificCompetence: CM3, mainActivity: 'Describe basic Chemistry laboratory skills (rules, safety measures, first aid and apparatus)', methods: ['demonstration', 'practical', 'groupDiscussion'], resources: LAB_RES },
  'C1-3.1d': { mainCompetence: CM3, specificCompetence: CM3, mainActivity: 'Describe fire, firefighting and flames', methods: ['demonstration', 'practical', 'groupDiscussion'], resources: FIRE_RES },
  'C1-1.1c': { mainCompetence: CM1, specificCompetence: CS11, mainActivity: 'Describe the concept of matter (states of matter, physical and chemical changes)', methods: ['practical', 'demonstration', 'groupDiscussion'], resources: CHEM_MATTER_RES },
  'C1-1.1d': { mainCompetence: CM1, specificCompetence: CS11, mainActivity: 'Describe chemical elements and the criteria for assigning chemical symbols', methods: ['qa', 'smallGroups', 'visual'], resources: ELEMENT_RES },
  'C1-1.1e': { mainCompetence: CM1, specificCompetence: CS11, mainActivity: 'Compare the properties of compounds and mixtures with those of their constituent elements', methods: ['practical', 'groupDiscussion', 'qa'], resources: ELEMENT_RES },
  'C1-3.1c': { mainCompetence: CM3, specificCompetence: CM3, mainActivity: 'Perform experiments on the separation of mixtures using different methods', methods: ['practical', 'projectActivity', 'smallGroups'], resources: SEPARATE_RES },
  // ---- Form II ----
  'C2-1.1a': { mainCompetence: CM1, specificCompetence: CS11, mainActivity: 'Describe the modern concept of atomic structure (Dalton\'s theory and sub-atomic particles)', methods: ['brainstorming', 'visual', 'groupDiscussion'], resources: ATOM_RES },
  'C2-1.1b': { mainCompetence: CM1, specificCompetence: CS11, mainActivity: 'Describe electronic arrangements of atoms', methods: ['demonstration', 'problemSolving', 'smallGroups'], resources: ATOM_RES },
  'C2-1.1c': { mainCompetence: CM1, specificCompetence: CS11, mainActivity: 'Use the concept of atomic structure to determine atomic and mass numbers', methods: ['problemSolving', 'groupDiscussion', 'qa'], resources: ATOM_RES },
  'C2-1.2a': { mainCompetence: CM1, specificCompetence: CS12, mainActivity: 'Explain the development and arrangement of the periodic table and the trends in properties across periods and down groups', methods: ['groupDiscussion', 'visual', 'problemSolving'], resources: PERIODIC_RES },
  'C2-1.1d': { mainCompetence: CM2, specificCompetence: CS21, mainActivity: 'Explain chemical formulae and nomenclature (valency, radicals, oxidation state and naming binary compounds)', methods: ['problemSolving', 'smallGroups', 'qa'], resources: BOND_RES },
  'C2-1.1f': { mainCompetence: CM1, specificCompetence: CS11, mainActivity: 'Describe chemical bonding (electrovalent and covalent bonding)', methods: ['demonstration', 'groupDiscussion', 'visual'], resources: BOND_RES },
  'C2-1.1g': { mainCompetence: CM2, specificCompetence: CS22, mainActivity: 'Describe chemical reactions, write and balance chemical equations and identify types of reactions', methods: ['practical', 'problemSolving', 'groupDiscussion'], resources: REACT_RES },
  'C2-1.1i': { mainCompetence: CM1, specificCompetence: CS11, mainActivity: 'Describe acids, bases and salts and their reactions', methods: ['practical', 'groupDiscussion', 'qa'], resources: ACID_RES },
  'C2-3.1a': { mainCompetence: CM3, specificCompetence: CM3, mainActivity: 'Prepare and use acid-base indicators and test acidity and alkalinity of local substances', methods: ['practical', 'projectActivity', 'smallGroups'], resources: ACID_RES },
});

const PCF = (form: 1 | 2) => (topic: string, subtopic: string, part: string, unit: string, ...specificActivities: string[]): LessonPart =>
  ({ id: `c${form}-${++_n}`, subject: 'Chemistry', form, topic, subtopic, part, unit, specificActivities });
const PC1 = PCF(1);
const PC2 = PCF(2);

LESSON_PARTS.push(
  // ===== CHEMISTRY FORM I =====
  PC1('Introduction to Chemistry', 'Concept of chemistry', 'Meaning of Chemistry', 'C1-1.1a', 'Explain the meaning of Chemistry', 'Give examples of chemical processes around us'),
  PC1('Introduction to Chemistry', 'Concept of chemistry', 'Branches of Chemistry', 'C1-1.1a', 'Name the branches of Chemistry', 'Describe what each branch studies'),
  PC1('Introduction to Chemistry', 'Relationships of chemistry with other related disciplines', 'Relationship between Chemistry and other subjects', 'C1-1.1a', 'Show how Chemistry is related to other subjects', 'Give examples (Biology, Physics, Agriculture, Geography)'),
  PC1('Introduction to Chemistry', 'Applications of chemistry in the development of a modern society', 'Applications of Chemistry in everyday life and industry', 'C1-1.1b', 'Describe the applications of Chemistry in agriculture, medicine and industry', 'Give examples from the community'),
  PC1('Introduction to Chemistry', 'Applications of chemistry in the development of a modern society', 'Careers and contribution of Chemistry to society', 'C1-1.1b', 'Identify careers related to Chemistry', 'Discuss the contribution of Chemistry to development'),

  PC1('Laboratory techniques and safety', 'Laboratory safety measures', 'Laboratory rules and safety measures', 'C1-3.1a', 'State laboratory rules', 'Explain safety measures when working in a laboratory'),
  PC1('Laboratory techniques and safety', 'Laboratory safety measures', 'Hazard signs and handling of chemicals', 'C1-3.1a', 'Identify hazard warning signs', 'Describe safe handling and disposal of chemicals'),
  PC1('Laboratory techniques and safety', 'First Aid', 'First aid for common laboratory accidents', 'C1-3.1a', 'Describe first aid for burns, cuts and chemical spills', 'Demonstrate basic first aid procedures'),
  PC1('Laboratory techniques and safety', 'Basic chemistry laboratory apparatus', 'Apparatus for measuring and holding', 'C1-3.1a', 'Identify apparatus for measuring and holding', 'State the use of each apparatus'),
  PC1('Laboratory techniques and safety', 'Basic chemistry laboratory apparatus', 'Apparatus for heating and other uses', 'C1-3.1a', 'Identify apparatus for heating and other uses', 'Handle apparatus correctly, including the Bunsen burner'),

  PC1('Fire, firefighting and flames', 'Fire', 'Meaning and causes of fire (fire triangle)', 'C1-3.1d', 'Explain the conditions necessary for fire', 'Describe the causes of fire'),
  PC1('Fire, firefighting and flames', 'Firefighting', 'Classes of fire and firefighting methods', 'C1-3.1d', 'Describe classes of fire', 'Describe methods of fighting fire'),
  PC1('Fire, firefighting and flames', 'Firefighting', 'Fire extinguishers and fire safety', 'C1-3.1d', 'Identify types of fire extinguishers and their uses', 'State fire safety measures at school and home'),
  PC1('Fire, firefighting and flames', 'Flames', 'Luminous and non-luminous flames', 'C1-3.1d', 'Differentiate luminous from non-luminous flames', 'Describe the structure of a Bunsen burner flame'),

  PC1('Matter', 'States of matter', 'States of matter and the particle theory', 'C1-1.1c', 'Describe the states of matter', 'Explain the particle theory of matter'),
  PC1('Matter', 'States of matter', 'Changes of state', 'C1-1.1c', 'Describe changes of state (melting, boiling, condensation, sublimation)', 'Perform an experiment on changes of state'),
  PC1('Matter', 'States of matter', 'Diffusion, Brownian motion and gas properties', 'C1-1.1c', 'Explain diffusion and Brownian motion', 'Give examples of diffusion in daily life'),
  PC1('Matter', 'Physical and chemical changes', 'Physical changes', 'C1-1.1c', 'Describe physical changes', 'Give examples of physical changes'),
  PC1('Matter', 'Physical and chemical changes', 'Chemical changes', 'C1-1.1c', 'Describe chemical changes', 'Differentiate chemical from physical changes by experiment'),

  PC1('Elements, compounds and mixtures', 'Elements and chemical symbols', 'Elements and their classification (metals and non-metals)', 'C1-1.1d', 'Define an element', 'Classify elements as metals or non-metals'),
  PC1('Elements, compounds and mixtures', 'Elements and chemical symbols', 'Chemical symbols and the first 20 elements', 'C1-1.1d', 'State the criteria for assigning chemical symbols', 'Write the symbols of the first 20 elements'),
  PC1('Elements, compounds and mixtures', 'Compounds and mixtures', 'Compounds', 'C1-1.1e', 'Define a compound', 'Compare compounds with their constituent elements'),
  PC1('Elements, compounds and mixtures', 'Compounds and mixtures', 'Mixtures', 'C1-1.1e', 'Define a mixture', 'Differentiate mixtures from compounds'),
  PC1('Elements, compounds and mixtures', 'Separation of mixtures', 'Filtration, decantation and evaporation', 'C1-3.1c', 'Separate mixtures by filtration, decantation and evaporation', 'Choose a suitable method for a given mixture'),
  PC1('Elements, compounds and mixtures', 'Separation of mixtures', 'Distillation and crystallisation', 'C1-3.1c', 'Separate mixtures by distillation and crystallisation', 'Describe applications of the methods'),
  PC1('Elements, compounds and mixtures', 'Separation of mixtures', 'Chromatography, magnetism and other methods', 'C1-3.1c', 'Separate mixtures by chromatography and magnetism', 'Explain the principle of each method'),

  // ===== CHEMISTRY FORM II =====
  PC2('Atomic structure', 'Concept of atomic structure', 'Concept of atomic structure', 'C2-1.1a', 'Explain the concept of atomic structure', 'Describe how ideas about the atom developed'),
  PC2('Atomic structure', 'Dalton atomic theory', 'Dalton\'s atomic theory', 'C2-1.1a', 'State Dalton\'s atomic theory', 'Explain its limitations'),
  PC2('Atomic structure', 'Sub-atomic particles', 'Sub-atomic particles (protons, neutrons and electrons)', 'C2-1.1a', 'Describe the sub-atomic particles', 'State their relative charge and mass'),
  PC2('Atomic structure', 'Electronic arrangement', 'Electronic arrangement of atoms', 'C2-1.1b', 'Describe how electrons are arranged in shells', 'Write the electronic arrangement of the first 20 elements'),
  PC2('Atomic structure', 'Determination of atomic number and mass number', 'Atomic number', 'C2-1.1c', 'Define atomic number', 'Determine the atomic number of elements'),
  PC2('Atomic structure', 'Determination of atomic number and mass number', 'Mass number', 'C2-1.1c', 'Define mass number', 'Calculate the number of protons, neutrons and electrons'),

  PC2('Periodic classification', 'Development of the periodic table', 'Development of the periodic table', 'C2-1.2a', 'Describe how the periodic table developed', 'State the contributions of Dobereiner, Newlands and Mendeleev'),
  PC2('Periodic classification', 'Modern periodic table', 'The modern periodic table', 'C2-1.2a', 'Describe the arrangement of the modern periodic table', 'Identify groups and periods'),
  PC2('Periodic classification', 'Electronic configuration and element positioning in the periodic table', 'Locating elements using electronic configuration', 'C2-1.2a', 'Use electronic configuration to locate an element', 'Relate group and period to electronic arrangement'),
  PC2('Periodic classification', 'Trends in physical and chemical properties across periods and down groups', 'Trends across periods', 'C2-1.2a', 'Describe trends in physical and chemical properties across a period', 'Explain the trends'),
  PC2('Periodic classification', 'Trends in physical and chemical properties across periods and down groups', 'Trends down a group', 'C2-1.2a', 'Describe trends in physical and chemical properties down a group', 'Explain the trends'),
  PC2('Periodic classification', 'Trends in selected groups', 'Trends in selected groups (alkali metals, halogens and noble gases)', 'C2-1.2a', 'Describe the properties of alkali metals, halogens and noble gases', 'State their uses'),

  PC2('Chemical bonding, formula and nomenclature', 'Concept of chemical bonding', 'Concept of chemical bonding and formation of ions', 'C2-1.1f', 'Explain why atoms form bonds', 'Describe the formation of positive and negative ions'),
  PC2('Chemical bonding, formula and nomenclature', 'Electrovalent bonding', 'Electrovalent (ionic) bonding', 'C2-1.1f', 'Describe the formation of ionic bonds', 'Draw dot-and-cross diagrams of ionic compounds'),
  PC2('Chemical bonding, formula and nomenclature', 'Covalent bonding', 'Covalent bonding', 'C2-1.1f', 'Describe the formation of covalent bonds', 'Draw dot-and-cross diagrams of covalent molecules'),
  PC2('Chemical bonding, formula and nomenclature', 'Valency', 'Valency', 'C2-1.1d', 'Define valency', 'Determine the valency of elements'),
  PC2('Chemical bonding, formula and nomenclature', 'Radicals', 'Radicals', 'C2-1.1d', 'Define a radical', 'State the formulae and charges of common radicals'),
  PC2('Chemical bonding, formula and nomenclature', 'Oxidation state', 'Oxidation state', 'C2-1.1d', 'Define oxidation state', 'Determine oxidation states in compounds'),
  PC2('Chemical bonding, formula and nomenclature', 'Concept of chemical formulas', 'Writing chemical formulae', 'C2-1.1d', 'Explain the concept of chemical formulae', 'Write formulae of compounds using valency'),
  PC2('Chemical bonding, formula and nomenclature', 'Types of chemical formulas', 'Empirical and molecular formulae', 'C2-1.1d', 'Differentiate empirical from molecular formulae', 'Determine empirical and molecular formulae'),
  PC2('Chemical bonding, formula and nomenclature', 'Formula calculations', 'Formula calculations', 'C2-1.1d', 'Calculate relative molecular mass and percentage composition', 'Solve problems on formulae'),
  PC2('Chemical bonding, formula and nomenclature', 'Nomenclature of binary inorganic compounds', 'Naming binary inorganic compounds (IUPAC)', 'C2-1.1d', 'Name binary inorganic compounds using IUPAC rules', 'Write formulae from given names'),

  PC2('Chemical reactions', 'Concept of chemical reactions', 'Concept of chemical reactions', 'C2-1.1g', 'Explain the concept of a chemical reaction', 'Identify evidence that a reaction has occurred'),
  PC2('Chemical reactions', 'Chemical equations', 'Writing and balancing chemical equations', 'C2-1.1g', 'Write word and chemical equations', 'Balance chemical equations'),
  PC2('Chemical reactions', 'Types of chemical reactions', 'Types of chemical reactions', 'C2-1.1g', 'Describe types of chemical reactions (combination, decomposition, displacement and double decomposition)', 'Relate them to processes in daily life'),

  PC2('Acids, bases, and salts', 'Acids', 'Acids and their properties', 'C2-1.1i', 'Define acids and describe their properties', 'Name common laboratory and natural acids'),
  PC2('Acids, bases, and salts', 'Acids', 'Strengths and basicity of acids', 'C2-1.1i', 'Differentiate strong from weak acids', 'Determine the basicity of an acid'),
  PC2('Acids, bases, and salts', 'Bases', 'Bases and their properties', 'C2-1.1i', 'Define bases and alkalis and describe their properties', 'Name common bases'),
  PC2('Acids, bases, and salts', 'Bases', 'Strengths of bases and acidity of a base', 'C2-1.1i', 'Differentiate strong from weak bases', 'Determine the acidity of a base'),
  PC2('Acids, bases, and salts', 'Neutralisation reaction', 'Neutralisation reaction', 'C2-1.1i', 'Describe neutralisation', 'Write equations for neutralisation reactions'),
  PC2('Acids, bases, and salts', 'Uses of acids and bases', 'Uses of acids and bases', 'C2-1.1i', 'State the uses of acids and bases', 'Give examples from daily life and industry'),
  PC2('Acids, bases, and salts', 'Acid-base indicators', 'Acid-base indicators', 'C2-3.1a', 'Prepare indicators from local materials', 'Use indicators to test acidity and alkalinity'),
  PC2('Acids, bases, and salts', 'pH scale', 'The pH scale', 'C2-3.1a', 'Explain the pH scale', 'Determine the pH of common substances'),
  PC2('Acids, bases, and salts', 'Uses of pH indicators', 'Occurrence and uses of pH indicators', 'C2-3.1a', 'Identify natural pH indicators', 'State the uses of pH indicators'),
  PC2('Acids, bases, and salts', 'Salts', 'Types of salts', 'C2-1.1i', 'Describe types of salts', 'Give examples of each type'),
  PC2('Acids, bases, and salts', 'Salts', 'Preparation of salts', 'C2-1.1i', 'Describe methods of preparing salts', 'Prepare a salt in the laboratory'),
  PC2('Acids, bases, and salts', 'Salts', 'Properties and uses of salts', 'C2-1.1i', 'Describe the properties of salts', 'State the uses of salts'),
);

export const CHEMISTRY_REFERENCES: Partial<Record<1 | 2 | 3 | 4, string>> = {
  1: "Tanzania Institute of Education. (2023). Chemistry for secondary schools student's book, form one. Tanzania Institute of Education.",
  2: "Tanzania Institute of Education. (2025). Chemistry for secondary schools student's book, form two. Tanzania Institute of Education.",
};

// ===================== BIOLOGY (Form I-III) =====================
// Source: TIE Biology O-Level syllabus + Student's Books (Form I 2023, Form II 2024, Form III 2025). Form IV not yet given.
export const BIOLOGY_COMMON_RESOURCES = [
  'Chalkboard / whiteboard',
  'Markers and chalk',
  'Handouts',
  'Charts and diagrams',
  'Models and specimens',
  'Microscope and slides',
  'Laboratory apparatus and chemicals',
  'Projector / smartphone (simulations and videos)',
  "Student's book (Biology, as applicable)",
];

const BIM1 = 'Demonstrate mastery of the concepts, principles and processes of Biology';
const BIM2 = 'Communicate using scientific biological terminologies';
const BIM3 = 'Conduct biological investigations';
const BIS11 = 'Describe the physiological, anatomical and ecological processes of living organisms';
const BIS21 = 'Demonstrate mastery of scientific biological terminologies';
const BIS31 = 'Demonstrate mastery of basic skills for conducting biological investigations';

const BIO_BASIC = ['Charts and pictures', 'Video clips', 'Relevant books', 'Specimens of living things'];
const BIO_LAB = ['Laboratory apparatus', 'Charts of apparatus', 'Microscope', 'Specimens', 'Safety charts'];
const BIO_CELL = ['Microscope and slides', 'Onion peel and iodine', 'Models of plant and animal cells', 'Charts of cells', 'Video clips'];
const BIO_CLASS = ['Specimens of plants and animals', 'Hand lens', 'Charts of classification', 'Identification keys', 'Pictures of organisms'];
const BIO_PLANT = ['Potted plants and leaves', 'Iodine solution', 'Test tubes and heat source', 'Charts of the leaf', 'Light source'];
const BIO_NUTR = ['Food samples', 'Food test reagents (iodine, Benedict\'s, biuret)', 'Test tubes and heat source', 'Charts of balanced diet', 'Charts of the digestive system'];
const BIO_TRANS = ['Charts of the vascular system', 'Potometer', 'Plants with dye', 'Models of the heart', 'Charts of blood vessels and blood'];
const BIO_GAS = ['Models of the lungs', 'Charts of gas exchange', 'Lime water', 'Yeast and sugar', 'Test tubes and delivery tubes'];
const BIO_COORD = ['Charts of the nervous system', 'Models of the brain and eye', 'Seedlings and clinostat', 'Charts of the endocrine glands', 'Video clips'];
const BIO_EXCR = ['Charts of the urinary system', 'Model of the kidney', 'Charts of the skin', 'Video clips', 'Thermometer'];

Object.assign(UNITS, {
  // ---- Form I ----
  'BI1-1a': { mainCompetence: BIM1, specificCompetence: BIS11, mainActivity: 'Explain the basic concepts of Biology (meaning, branches, terminologies, importance and relationship with other disciplines)', methods: ['brainstorming', 'groupDiscussion', 'qa'], resources: BIO_BASIC },
  'BI1-2a': { mainCompetence: BIM2, specificCompetence: BIS21, mainActivity: 'Identify and use laboratory apparatus, equipment and other resources in Biology', methods: ['demonstration', 'practical', 'smallGroups'], resources: BIO_LAB },
  'BI1-3a': { mainCompetence: BIM3, specificCompetence: BIS31, mainActivity: 'Describe basic skills for conducting biological experiments (observation, measurement and experimentation) and apply the scientific method', methods: ['practical', 'groupDiscussion', 'problemSolving'], resources: BIO_LAB },
  'BI1-1b': { mainCompetence: BIM1, specificCompetence: BIS11, mainActivity: 'Describe a cell (meaning, types, structures and functions)', methods: ['practical', 'visual', 'groupDiscussion'], resources: BIO_CELL },
  'BI1-1c': { mainCompetence: BIM1, specificCompetence: BIS11, mainActivity: 'Explain the concept and systems of classification', methods: ['practical', 'groupDiscussion', 'visual'], resources: BIO_CLASS },
  'BI1-1d': { mainCompetence: BIM1, specificCompetence: BIS11, mainActivity: 'Describe the major groups of organisms (viruses, Monera, Protoctista, Fungi, Plantae and Animalia)', methods: ['jigsaw', 'visual', 'groupDiscussion'], resources: BIO_CLASS },
  'BI1-1e': { mainCompetence: BIM1, specificCompetence: BIS11, mainActivity: 'Describe nutrition in plants (photosynthesis, leaf structure and mineral requirements)', methods: ['practical', 'demonstration', 'groupDiscussion'], resources: BIO_PLANT },
  // ---- Form II ----
  'BI2-1a': { mainCompetence: BIM1, specificCompetence: BIS11, mainActivity: 'Describe nutrition in humans (nutrients, balanced diet, deficiencies and food tests)', methods: ['practical', 'groupDiscussion', 'qa'], resources: BIO_NUTR },
  'BI2-1b': { mainCompetence: BIM1, specificCompetence: BIS11, mainActivity: 'Describe the digestive system and the digestion process in humans and ruminants', methods: ['visual', 'groupDiscussion', 'qa'], resources: BIO_NUTR },
  'BI2-1c': { mainCompetence: BIM1, specificCompetence: BIS11, mainActivity: 'Explain the concept and ways of transport of materials in living organisms', methods: ['practical', 'brainstorming', 'groupDiscussion'], resources: BIO_TRANS },
  'BI2-1d': { mainCompetence: BIM1, specificCompetence: BIS11, mainActivity: 'Describe transport of materials in flowering plants (vascular system, absorption, transpiration and guttation)', methods: ['practical', 'demonstration', 'groupDiscussion'], resources: BIO_TRANS },
  'BI2-1e': { mainCompetence: BIM1, specificCompetence: BIS11, mainActivity: 'Describe transport of materials in mammals (the heart, blood vessels, blood, blood groups and circulation)', methods: ['visual', 'practical', 'groupDiscussion'], resources: BIO_TRANS },
  'BI2-1f': { mainCompetence: BIM1, specificCompetence: BIS11, mainActivity: 'Describe gaseous exchange and respiration in mammals and plants', methods: ['practical', 'demonstration', 'groupDiscussion'], resources: BIO_GAS },
  // ---- Form III ----
  'BI3-1a': { mainCompetence: BIM1, specificCompetence: BIS11, mainActivity: 'Describe coordination in plants (hormones and tropic responses) and investigate tropisms', methods: ['practical', 'projectActivity', 'groupDiscussion'], resources: BIO_COORD },
  'BI3-1b': { mainCompetence: BIM1, specificCompetence: BIS11, mainActivity: 'Describe coordination in mammals (nervous system, sense organs and effects of drugs)', methods: ['visual', 'practical', 'groupDiscussion'], resources: BIO_COORD },
  'BI3-1c': { mainCompetence: BIM1, specificCompetence: BIS11, mainActivity: 'Describe the endocrine system and its relationship with the nervous system', methods: ['groupDiscussion', 'visual', 'qa'], resources: BIO_COORD },
  'BI3-1d': { mainCompetence: BIM1, specificCompetence: BIS11, mainActivity: 'Describe the mechanism of excretion in the human body (organs, products, complications)', methods: ['visual', 'groupDiscussion', 'qa'], resources: BIO_EXCR },
  'BI3-1e': { mainCompetence: BIM1, specificCompetence: BIS11, mainActivity: 'Describe regulation in the human body (homeostasis, temperature, osmoregulation and blood sugar)', methods: ['groupDiscussion', 'visual', 'problemSolving'], resources: BIO_EXCR },
});

const PBIF = (form: 1 | 2 | 3) => (topic: string, subtopic: string, part: string, unit: string, ...specificActivities: string[]): LessonPart =>
  ({ id: `bi${form}-${++_n}`, subject: 'Biology', form, topic, subtopic, part, unit, specificActivities });
const PBI1 = PBIF(1);
const PBI2 = PBIF(2);
const PBI3 = PBIF(3);

LESSON_PARTS.push(
  // ===== BIOLOGY FORM I =====
  PBI1('Introduction to Biology', 'Basic concepts and terminologies in Biology', 'Meaning and branches of Biology', 'BI1-1a', 'Explain the meaning of Biology', 'Name the branches of Biology'),
  PBI1('Introduction to Biology', 'Basic concepts and terminologies in Biology', 'Basic terminologies in Biology', 'BI1-1a', 'Define basic biological terms', 'Use the terms correctly in sentences'),
  PBI1('Introduction to Biology', 'Importance of studying Biology', 'Importance of studying Biology', 'BI1-1a', 'State the importance of studying Biology', 'Identify careers related to Biology'),
  PBI1('Introduction to Biology', 'Relationship between Biology and other scientific fields', 'Relationship between Biology and other subjects', 'BI1-1a', 'Show how Biology is related to other sciences', 'Give examples (Chemistry, Physics, Geography, Agriculture)'),

  PBI1('Scientific processes in Biology', 'Common Biology laboratory apparati, equipment and other resources', 'Laboratory apparatus and equipment', 'BI1-2a', 'Identify common biology laboratory apparatus', 'State the use of each apparatus'),
  PBI1('Scientific processes in Biology', 'Common Biology laboratory apparati, equipment and other resources', 'Laboratory rules and safety', 'BI1-2a', 'State laboratory rules and safety measures', 'Handle apparatus and specimens safely'),
  PBI1('Scientific processes in Biology', 'Basic skills in scientific studies', 'Observation, measurement and recording', 'BI1-3a', 'Observe and record biological specimens', 'Measure and record data accurately'),
  PBI1('Scientific processes in Biology', 'Basic skills in scientific studies', 'Drawing and labelling biological diagrams', 'BI1-3a', 'Draw biological diagrams correctly', 'Label and title the diagrams'),
  PBI1('Scientific processes in Biology', 'Scientific methods', 'Steps of the scientific method', 'BI1-3a', 'Describe the steps of the scientific method', 'Apply the steps to a simple problem'),
  PBI1('Scientific processes in Biology', 'Simple biological experiments', 'Carrying out simple biological experiments', 'BI1-3a', 'Plan and carry out a simple experiment', 'Present the results and conclusion'),

  PBI1('Cell structure and organization', 'The cell', 'Meaning of the cell and the cell theory', 'BI1-1b', 'Explain what a cell is', 'State the cell theory'),
  PBI1('Cell structure and organization', 'The cell', 'Using the microscope', 'BI1-1b', 'Identify the parts of a microscope', 'Use the microscope to observe a cell'),
  PBI1('Cell structure and organization', 'Types of cells', 'Prokaryotic and eukaryotic cells', 'BI1-1b', 'Describe types of cells', 'Differentiate prokaryotic from eukaryotic cells'),
  PBI1('Cell structure and organization', 'Animal and plant cells', 'Structure and functions of cell organelles', 'BI1-1b', 'Describe cell organelles and their functions', 'Draw and label a plant and an animal cell'),
  PBI1('Cell structure and organization', 'Animal and plant cells', 'Differences between plant and animal cells', 'BI1-1b', 'Compare plant and animal cells', 'Observe onion cells and cheek cells'),
  PBI1('Cell structure and organization', 'Cell differentiation', 'Cell differentiation, tissues, organs and systems', 'BI1-1b', 'Explain cell differentiation', 'Describe levels of cell organisation'),

  PBI1('Classification of living things', 'Concept of classification', 'Meaning and importance of classification', 'BI1-1c', 'Explain the concept of classification', 'State the importance of classification'),
  PBI1('Classification of living things', 'Classification systems', 'Classification systems (artificial and natural)', 'BI1-1c', 'Describe classification systems', 'Identify the levels of classification'),
  PBI1('Classification of living things', 'Major groups of living things', 'Five kingdoms and viruses: overview', 'BI1-1c', 'Name the major groups of living things', 'State the characteristics of each kingdom'),
  PBI1('Classification of living things', 'Binomial nomenclature', 'Binomial nomenclature', 'BI1-1c', 'Explain binomial nomenclature', 'Write scientific names correctly'),

  PBI1('Viruses and major groups of living things', 'Viruses', 'Viruses: structure and importance', 'BI1-1d', 'Describe the structure of viruses', 'State the importance of viruses and diseases they cause'),
  PBI1('Viruses and major groups of living things', 'Kingdom Monera', 'Kingdom Monera', 'BI1-1d', 'Describe the characteristics of Monera', 'Give examples and their importance'),
  PBI1('Viruses and major groups of living things', 'Kingdom Protoctista', 'Kingdom Protoctista', 'BI1-1d', 'Describe the characteristics of Protoctista', 'Give examples and their importance'),
  PBI1('Viruses and major groups of living things', 'Kingdom Fungi', 'Kingdom Fungi', 'BI1-1d', 'Describe the characteristics of Fungi', 'Give examples and their importance'),
  PBI1('Viruses and major groups of living things', 'Kingdom Plantae', 'Kingdom Plantae: major divisions', 'BI1-1d', 'Describe the divisions of Plantae', 'Give examples of each division'),
  PBI1('Viruses and major groups of living things', 'Classes of the division Angiospermophyta', 'Classes of Angiospermophyta (monocots and dicots)', 'BI1-1d', 'Differentiate monocots from dicots', 'Classify given plants'),
  PBI1('Viruses and major groups of living things', 'Kingdom Animalia', 'Kingdom Animalia: invertebrates', 'BI1-1d', 'Describe the major phyla of invertebrates', 'Give examples of each'),
  PBI1('Viruses and major groups of living things', 'Kingdom Animalia', 'Kingdom Animalia: vertebrates', 'BI1-1d', 'Describe the classes of vertebrates', 'Give examples of each'),

  PBI1('Nutrition in plants', 'Concept of nutrition', 'Concept and types of nutrition', 'BI1-1e', 'Explain the concept of nutrition', 'Differentiate autotrophic from heterotrophic nutrition'),
  PBI1('Nutrition in plants', 'Photosynthesis', 'Process of photosynthesis', 'BI1-1e', 'Describe the process of photosynthesis', 'Write the word and chemical equations'),
  PBI1('Nutrition in plants', 'Photosynthesis', 'Investigating conditions necessary for photosynthesis', 'BI1-1e', 'Investigate the conditions necessary for photosynthesis', 'Report the results'),
  PBI1('Nutrition in plants', 'Structure of the leaf in relation to photosynthesis', 'Structure of the leaf', 'BI1-1e', 'Describe the structure of a leaf', 'Relate leaf structure to photosynthesis'),
  PBI1('Nutrition in plants', 'Importance of photosynthesis', 'Importance of photosynthesis', 'BI1-1e', 'State the importance of photosynthesis', 'Explain its role in the food chain and the atmosphere'),
  PBI1('Nutrition in plants', 'Essential and non-essential elements in plants', 'Essential and non-essential elements in plants', 'BI1-1e', 'Name the essential mineral elements for plants', 'Describe the deficiency symptoms'),

  // ===== BIOLOGY FORM II =====
  PBI2('Nutrition in animals', 'Concept of nutrition in animals', 'Concept and modes of nutrition in animals', 'BI2-1a', 'Explain nutrition in animals', 'Name the modes of nutrition'),
  PBI2('Nutrition in animals', 'Nutrients', 'Carbohydrates and lipids', 'BI2-1a', 'Describe carbohydrates and lipids', 'State their sources and functions'),
  PBI2('Nutrition in animals', 'Nutrients', 'Proteins, vitamins, minerals, water and fibre', 'BI2-1a', 'Describe proteins, vitamins, minerals, water and fibre', 'State their sources and functions'),
  PBI2('Nutrition in animals', 'Balanced diet', 'Balanced diet', 'BI2-1a', 'Explain a balanced diet', 'Plan a balanced meal from local foods'),
  PBI2('Nutrition in animals', 'Nutritional requirements for different groups of people', 'Nutritional requirements for different groups of people', 'BI2-1a', 'Describe the nutritional needs of different groups', 'Explain why the needs differ'),
  PBI2('Nutrition in animals', 'Nutritional deficiencies and disorders', 'Nutritional deficiencies and disorders', 'BI2-1a', 'Describe nutritional deficiencies and disorders', 'Suggest ways of preventing them'),
  PBI2('Nutrition in animals', 'Properties of food nutrients', 'Food tests (starch, reducing sugar, protein and fat)', 'BI2-1a', 'Test food samples for nutrients', 'Record and interpret the results'),

  PBI2('Digestive system', 'The digestion process', 'Parts of the human digestive system', 'BI2-1b', 'Identify the parts of the digestive system', 'State the function of each part'),
  PBI2('Digestive system', 'The digestion process', 'Digestion, absorption and assimilation', 'BI2-1b', 'Describe digestion in the alimentary canal', 'Explain absorption and assimilation'),
  PBI2('Digestive system', 'The digestive system of ruminants', 'The digestive system of ruminants', 'BI2-1b', 'Describe the digestive system of a ruminant', 'Compare it with the human system'),
  PBI2('Digestive system', 'Disorders and diseases of human digestive system', 'Disorders and diseases of the digestive system', 'BI2-1b', 'Describe disorders of the digestive system', 'Suggest prevention methods'),

  PBI2('Transport of materials in living organisms', 'Concept of transportation of materials', 'Concept of transportation of materials', 'BI2-1c', 'Explain the need for transport in living organisms', 'Give examples of materials transported'),
  PBI2('Transport of materials in living organisms', 'Ways of transportation of materials', 'Diffusion and osmosis', 'BI2-1c', 'Describe diffusion and osmosis', 'Carry out a simple experiment on osmosis'),
  PBI2('Transport of materials in living organisms', 'Ways of transportation of materials', 'Active transport', 'BI2-1c', 'Describe active transport', 'Differentiate it from passive transport'),

  PBI2('Transport of materials in flowering plants', 'The vascular system', 'The vascular system (xylem and phloem)', 'BI2-1d', 'Describe xylem and phloem', 'State their functions'),
  PBI2('Transport of materials in flowering plants', 'Absorption and movement of water and mineral salts', 'Absorption and movement of water and mineral salts', 'BI2-1d', 'Describe how roots absorb water', 'Explain the movement of water up the stem'),
  PBI2('Transport of materials in flowering plants', 'Transpiration', 'Transpiration', 'BI2-1d', 'Explain transpiration', 'Investigate factors affecting transpiration'),
  PBI2('Transport of materials in flowering plants', 'Guttation', 'Guttation', 'BI2-1d', 'Explain guttation', 'Differentiate guttation from transpiration'),

  PBI2('Transport of materials in mammals', 'The mammalian heart', 'Structure and function of the mammalian heart', 'BI2-1e', 'Describe the structure of the heart', 'Explain how the heart pumps blood'),
  PBI2('Transport of materials in mammals', 'Blood vessels', 'Blood vessels (arteries, veins and capillaries)', 'BI2-1e', 'Describe the types of blood vessels', 'Compare their structure and function'),
  PBI2('Transport of materials in mammals', 'The blood', 'Components and functions of blood', 'BI2-1e', 'Describe the components of blood', 'State the function of each component'),
  PBI2('Transport of materials in mammals', 'Blood groups', 'Blood groups', 'BI2-1e', 'Describe the ABO blood groups', 'Explain the Rhesus factor'),
  PBI2('Transport of materials in mammals', 'Blood transfusion', 'Blood transfusion', 'BI2-1e', 'Explain blood transfusion', 'Determine compatible donors and recipients'),
  PBI2('Transport of materials in mammals', 'Blood circulation in human beings', 'Blood circulation in human beings', 'BI2-1e', 'Describe the double circulation', 'Measure the pulse rate'),

  PBI2('Gas exchange and respiration', 'Concept of gas exchange', 'Concept of gas exchange', 'BI2-1f', 'Explain the concept of gas exchange', 'State the features of gas exchange surfaces'),
  PBI2('Gas exchange and respiration', 'Gas exchange in mammals', 'Gas exchange in mammals', 'BI2-1f', 'Describe the human respiratory system', 'Explain breathing and gas exchange in the alveoli'),
  PBI2('Gas exchange and respiration', 'Gas exchange in plants', 'Gas exchange in plants', 'BI2-1f', 'Describe gas exchange in plants', 'Identify the parts responsible (stomata and lenticels)'),
  PBI2('Gas exchange and respiration', 'Respiration in mammals', 'Aerobic respiration', 'BI2-1f', 'Describe aerobic respiration', 'Write the word and chemical equations'),
  PBI2('Gas exchange and respiration', 'Respiration in mammals', 'Anaerobic respiration', 'BI2-1f', 'Describe anaerobic respiration', 'Investigate fermentation using yeast'),
  PBI2('Gas exchange and respiration', 'Infections and diseases of the respiratory system in humans', 'Infections and diseases of the respiratory system', 'BI2-1f', 'Describe respiratory infections and diseases', 'Suggest prevention methods'),

  // ===== BIOLOGY FORM III =====
  PBI3('Coordination in plants', 'Concept of coordination in plants', 'Concept of coordination in plants', 'BI3-1a', 'Explain coordination in plants', 'Give examples of plant responses'),
  PBI3('Coordination in plants', 'Plant hormones', 'Plant hormones', 'BI3-1a', 'Describe plant hormones (auxins, gibberellins and others)', 'State their functions'),
  PBI3('Coordination in plants', 'Concept of paratonic movement', 'Paratonic movements (tropic and nastic)', 'BI3-1a', 'Explain paratonic movements', 'Differentiate tropisms from nastic movements'),
  PBI3('Coordination in plants', 'Investigation of tropisms in plants', 'Investigating tropisms in plants', 'BI3-1a', 'Investigate phototropism and geotropism', 'Report the findings'),

  PBI3('Coordination in mammals', 'Concept of coordination in animals', 'Concept of coordination in animals', 'BI3-1b', 'Explain coordination in animals', 'Differentiate nervous from hormonal coordination'),
  PBI3('Coordination in mammals', 'Nervous coordination in humans', 'Nervous coordination in humans', 'BI3-1b', 'Describe nervous coordination', 'Name the main parts of the nervous system'),
  PBI3('Coordination in mammals', 'Structure of neurones', 'Structure of neurones', 'BI3-1b', 'Describe the structure of neurones', 'Differentiate types of neurones'),
  PBI3('Coordination in mammals', 'Nerve impulse', 'Nerve impulse', 'BI3-1b', 'Explain how a nerve impulse is transmitted', 'Describe the synapse'),
  PBI3('Coordination in mammals', 'Central nervous system', 'Central nervous system (brain and spinal cord)', 'BI3-1b', 'Describe the structure and functions of the brain and spinal cord', 'Draw and label the brain'),
  PBI3('Coordination in mammals', 'Peripheral nervous system', 'Peripheral nervous system', 'BI3-1b', 'Describe the somatic and autonomic nervous systems', 'Compare voluntary and involuntary actions'),
  PBI3('Coordination in mammals', 'Investigation of the nervous coordination process', 'Reflex arc and the knee jerk', 'BI3-1b', 'Describe a reflex arc', 'Investigate the knee jerk reflex'),
  PBI3('Coordination in mammals', 'Sense organs', 'The eye', 'BI3-1b', 'Describe the structure and functions of the eye', 'Explain eye defects and their correction'),
  PBI3('Coordination in mammals', 'Sense organs', 'The ear, nose, tongue and skin', 'BI3-1b', 'Describe the structure and functions of the ear, nose, tongue and skin', 'Explain how each detects stimuli'),
  PBI3('Coordination in mammals', 'Drugs and drug abuse in relation to nervous coordination', 'Drugs and drug abuse', 'BI3-1b', 'Describe the effects of drugs on the nervous system', 'Suggest ways of preventing drug abuse'),

  PBI3('Endocrine system', 'Concept of endocrine system', 'Concept of the endocrine system', 'BI3-1c', 'Explain the endocrine system', 'Differentiate endocrine from exocrine glands'),
  PBI3('Endocrine system', 'Interaction between endocrine and nervous system', 'Interaction between the endocrine and nervous systems', 'BI3-1c', 'Compare the endocrine and nervous systems', 'Explain how they work together'),
  PBI3('Endocrine system', 'Hormones produced by endocrine glands', 'Endocrine glands and their hormones', 'BI3-1c', 'Name the endocrine glands and their hormones', 'State the function of each hormone'),
  PBI3('Endocrine system', 'Complications and disorders of the endocrine system', 'Disorders of the endocrine system', 'BI3-1c', 'Describe disorders caused by hormone imbalance', 'Suggest management or prevention'),

  PBI3('Excretion in animals', 'Concept of excretion', 'Concept of excretion', 'BI3-1d', 'Explain excretion', 'Differentiate excretion from egestion'),
  PBI3('Excretion in animals', 'Excretion in humans', 'Excretory organs and products in humans', 'BI3-1d', 'Identify excretory organs and their products', 'Describe the role of each organ'),
  PBI3('Excretion in animals', 'Urinary system', 'The urinary system and the kidney', 'BI3-1d', 'Describe the structure of the urinary system and kidney', 'Draw and label the kidney'),
  PBI3('Excretion in animals', 'Urinary system', 'Urine formation', 'BI3-1d', 'Describe the formation of urine', 'Explain ultrafiltration and reabsorption'),
  PBI3('Excretion in animals', 'Other excretory organs in humans', 'Other excretory organs (skin, lungs and liver)', 'BI3-1d', 'Describe the excretory roles of the skin, lungs and liver', 'Draw and label the skin'),
  PBI3('Excretion in animals', 'Common complications and disorders of the excretory system', 'Disorders of the excretory system', 'BI3-1d', 'Describe common disorders (kidney stones and kidney failure)', 'Suggest prevention methods'),

  PBI3('Regulation', 'Concept of regulation', 'Concept of regulation and homeostasis', 'BI3-1e', 'Explain regulation and homeostasis', 'Describe feedback mechanisms'),
  PBI3('Regulation', 'Homeostatic mechanisms', 'Homeostatic mechanisms', 'BI3-1e', 'Describe homeostatic mechanisms', 'Give examples in the human body'),
  PBI3('Regulation', 'Types of regulation', 'Types of regulation', 'BI3-1e', 'Describe types of regulation', 'Differentiate them with examples'),
  PBI3('Regulation', 'Thermoregulation', 'Thermoregulation: endotherms and ectotherms', 'BI3-1e', 'Differentiate endotherms from ectotherms', 'Describe thermoregulation in humans'),
  PBI3('Regulation', 'Osmoregulation', 'Osmoregulation', 'BI3-1e', 'Explain osmoregulation', 'Describe the role of ADH'),
  PBI3('Regulation', 'Blood sugar regulation', 'Blood sugar regulation', 'BI3-1e', 'Describe how blood sugar is regulated', 'Explain the roles of insulin and glucagon'),
);

export const BIOLOGY_REFERENCES: Partial<Record<1 | 2 | 3 | 4, string>> = {
  1: "Tanzania Institute of Education. (2023). Biology for secondary schools student's book, form one. Tanzania Institute of Education.",
  2: "Tanzania Institute of Education. (2024). Biology for secondary schools student's book, form two. Tanzania Institute of Education.",
  3: "Tanzania Institute of Education. (2025). Biology for secondary schools student's book, form three. Tanzania Institute of Education.",
};

// ===================== HISTORIA YA TANZANIA NA MAADILI (Kidato cha I-III) - KISWAHILI =====================
// Chanzo: Muhtasari wa Historia ya Tanzania na Maadili, Elimu ya Sekondari Kidato cha I-IV (TIE 2023) + vitabu vya mwanafunzi
// (Kidato cha I 2023, cha II 2024, cha III 2025). Lugha ya andalio la somo hili ni Kiswahili; mfumo ni uleule wa masomo mengine.
// Kidato cha IV bado hakijatolewa. Sura za utafiti (3.x Kidato cha III) hazipo kwenye kitabu cha mwanafunzi, kwa hiyo hazimo hapa.

export const HTM_COMMON_RESOURCES = [
  'Ubao wa chaki / ubao mweupe',
  'Chaki na kalamu za ubao',
  'Vijarida vya maelezo',
  'Ramani ya Tanzania na Afrika',
  'Chati na mfuatano wa matukio (time line)',
  'Picha na mabango',
  'Projekta / simu janja (video na makala)',
  'Kitabu cha mwanafunzi (Historia ya Tanzania na Maadili)',
  'Muhtasari wa somo',
];

const HT_MC1 = 'Kulinda historia, urithi na maadili ya Taifa';
const HT_MC2 = 'Kumudu historia ya jamii za Kitanzania na maadili yake kabla ya ukoloni';
const HT_MC3 = 'Kumudu historia ya Tanzania na maadili wakati wa ukoloni, 1890 – 1960';
const HT_MC4 = 'Kumudu historia ya ujenzi wa Taifa la Tanzania na maadili katika kipindi cha 1961 – 1966';
const HT_MC5 = 'Kutathmini ujenzi wa Taifa na maadili wakati wa Azimio la Arusha, 1967 – 1985';

const HT_S11 = 'Kuelezea chimbuko la jamii za Kitanzania na maadili yake';
const HT_S12 = 'Kumudu maarifa na ujuzi wa maadili na urithi wa jamii za Kitanzania';
const HT_S13 = 'Kutumia maarifa na ujuzi wa historia na urithi kubuni fursa mbalimbali zilizopo katika jamii za Kitanzania';
const HT_S14 = 'Kubaini fursa mbalimbali za kujenga ushirikiano na kukuza uchumi wa kitaifa';
const HT_S21 = 'Kuchambua mifumo ya kijamii (elimu, afya, utamaduni, uchumi) iliyokuza na kuendeleza maadili ya jamii za Kitanzania kabla ya ukoloni';
const HT_S22 = 'Kuchambua mifumo iliyokuza na kuendeleza uchumi na siasa katika jamii za Kitanzania kabla ya ukoloni';
const HT_S23 = 'Kutathmini vichocheo vya mabadiliko ya sayansi na teknolojia katika jamii za Kitanzania kabla ya ukoloni';
const HT_F2_S31 = 'Kutumia maarifa na ujuzi wa chimbuko na ukuaji wa mfumo wa ukoloni kuelewa uhusiano wa kihistoria kati ya Tanzania na mataifa yaliyoitawala';
const HT_F2_S32 = 'Kutathmini athari za mfumo wa ukoloni kwenye maadili ya jamii za Kitanzania';
const HT_F2_S33 = 'Kuchambua jitihada za jamii za Kitanzania kupinga ukoloni na maadili ya kikoloni';
const HT_F2_S41 = 'Kuchambua mifumo ya uchumi, siasa, utamaduni, jamii na maadili iliyojengwa 1961 – 1966';
const HT_F2_S42 = 'Kumudu historia ya Mapinduzi Matukufu ya Zanzibar';
const HT_F3_S43 = 'Kumudu historia ya Muungano wa Tanganyika na Zanzibar';
const HT_F3_S51 = 'Kuchambua chimbuko la Azimio la Arusha na matokeo yake kiuchumi, kisiasa, kiutamaduni na kimaadili';
const HT_F3_S52 = 'Kueleza nafasi ya Tanzania katika kujenga uhusiano wa kikanda';

const HT_BASIC = ['Matini kuhusu historia ya Tanzania na maadili', 'Chati na picha', 'Ramani ya Tanzania', 'Mtaalamu mwalikwa (mzee au mwanahistoria)'];
const HT_ORIGIN = ['Matini zenye kuonesha asili ya jamii za Kitanzania', 'Ramani kuonesha mtawanyiko wa jamii za asili', 'Vitu halisi vilivyotumiwa na watu wa jamii za asili'];
const HT_HERITAGE = ['Ramani kuonesha maeneo yenye urithi wa Tanzania', 'Vitu halisi vilivyotumiwa na watu wa jamii za asili', 'Matini kuhusu maadili na urithi wa jamii za Kitanzania'];
const HT_OPPORT = ['Matini kuhusu fursa kwenye urithi wa jamii za Kitanzania', 'Ramani kuonesha maeneo yenye urithi wa Tanzania', 'Vitu halisi vilivyotumiwa na watu wa jamii za asili', 'Picha za vivutio vya urithi'];
const HT_NATION = ['Matini kuhusu fursa mbalimbali za kujenga ushirikiano na kukuza uchumi wa kitaifa', 'Picha kuonesha shughuli mbalimbali', 'Ramani kuonesha maeneo yenye fursa mbalimbali'];
const HT_SOCIAL = ['Picha kuonesha miundombinu ya elimu, afya na utamaduni kabla ya ukoloni', 'Ramani kuonesha mtawanyiko wa miundombinu ya elimu, afya na utamaduni kabla ya ukoloni', 'Vitu halisi vilivyotumika kabla ya ukoloni'];
const HT_POLECON = ['Matini kuhusu mifumo ya kiuchumi na kisiasa kabla ya ukoloni', 'Ramani kuonesha maeneo mbalimbali ya jamii za asili za Kitanzania', 'Picha za shughuli za kiuchumi na kisiasa'];
const HT_SCI = ['Matini kuhusu vichocheo vya mabadiliko ya sayansi na teknolojia katika jamii za Kitanzania kabla ya ukoloni', 'Picha za bidhaa zilizozalishwa na jamii za Kitanzania kabla ya ukoloni', 'Ramani kuonesha maeneo yaliyokuwa ya uzalishaji wa bidhaa kabla ya ukoloni'];
const HT_COLONY = ['Matini kuhusu chimbuko la mfumo wa ukoloni', 'Picha mbalimbali kuonesha wataalamu na shughuli za wakoloni', 'Ramani ya Tanzania wakati wa ukoloni', 'Chati ya mfuatano wa matukio (time line)'];
const HT_ETHICS_COL = ['Matini kuhusu athari za mfumo wa ukoloni kwenye maadili ya jamii za Kitanzania', 'Picha za matukio ya kipindi cha ukoloni', 'Chati na picha'];
const HT_RESIST = ['Picha kuonesha matendo ya kupinga ukoloni', 'Matini kuhusu harakati za jamii za Kitanzania kupinga ukoloni na maadili ya kikoloni', 'Ramani kuonesha maeneo ya upinzani', 'Chati ya mfuatano wa matukio (time line)'];
const HT_NATIONB = ['Matini kuhusu mifumo ya uchumi, siasa, utamaduni, jamii na maadili iliyojengwa 1961 – 1966', 'Picha za matukio ya mwanzo wa uhuru', 'Chati na picha'];
const HT_ZNZ = ['Matini kuhusu Mapinduzi Matukufu ya Zanzibar', 'Picha kuonesha watu walioshiriki katika Mapinduzi Matukufu ya Zanzibar', 'Ramani ya Zanzibar'];
const HT_UNION = ['Matini kuhusu historia ya ujenzi wa Taifa na maadili 1961 – 1966', 'Kielelezo kuonesha muundo wa Muungano wa Tanganyika na Zanzibar', 'Katiba ya Jamhuri ya Muungano wa Tanzania', 'Picha za viongozi na matukio ya Muungano'];
const HT_ARUSHA = ['Matini kuhusu Azimio la Arusha', 'Picha za viongozi na matukio ya kipindi cha Azimio la Arusha', 'Chati ya mfuatano wa matukio (time line)'];
const HT_REGION = ['Matini kuhusu nafasi ya Tanzania katika kujenga uhusiano wa kikanda', 'Ramani ya Afrika Mashariki na Kusini mwa Afrika', 'Picha za viongozi na vikao vya jumuiya za kikanda', 'Mtaalamu mwalikwa'];

Object.assign(UNITS, {
  // ---- Kidato cha I ----
  'HT1-0': { mainCompetence: HT_MC1, specificCompetence: HT_S11, mainActivity: 'Kueleza dhana ya Historia ya Tanzania na Maadili, umuhimu wake na uhusiano wake na masomo mengine', methods: ['brainstorming', 'qa', 'groupDiscussion'], resources: HT_BASIC },
  'HT1-1.1a': { mainCompetence: HT_MC1, specificCompetence: HT_S11, mainActivity: 'Kueleza asili ya jamii za Kitanzania (Wabantu, Wanilo, Wakushito, Wakichembe)', methods: ['brainstorming', 'guestSpeaker', 'groupDiscussion'], resources: HT_ORIGIN },
  'HT1-1.1b': { mainCompetence: HT_MC1, specificCompetence: HT_S11, mainActivity: 'Kubaini shughuli mbalimbali za makundi ya asili ya jamii za Kitanzania', methods: ['tips', 'groupDiscussion'], resources: HT_ORIGIN },
  'HT1-1.1c': { mainCompetence: HT_MC1, specificCompetence: HT_S11, mainActivity: 'Kueleza maadili ya jamii za asili ya Kitanzania', methods: ['brainstorming', 'caseStudy', 'groupDiscussion'], resources: HT_ORIGIN },
  'HT1-1.2a': { mainCompetence: HT_MC1, specificCompetence: HT_S12, mainActivity: 'Kuchambua maadili na urithi wa jamii za Kitanzania', methods: ['jigsaw', 'groupDiscussion'], resources: HT_HERITAGE },
  'HT1-1.2b': { mainCompetence: HT_MC1, specificCompetence: HT_S12, mainActivity: 'Kueleza matendo ya msingi yanayokuza na kulinda maadili na urithi wa jamii za Kitanzania', methods: ['groupDiscussion', 'qa'], resources: HT_HERITAGE },
  'HT1-1.3a': { mainCompetence: HT_MC1, specificCompetence: HT_S13, mainActivity: 'Kubaini fursa mbalimbali zilizopo kwenye urithi wa jamii za Kitanzania', methods: ['research', 'gallery'], resources: HT_OPPORT },
  'HT1-1.3b': { mainCompetence: HT_MC1, specificCompetence: HT_S13, mainActivity: 'Kueleza namna fursa zilizopo kwenye urithi wa jamii za Kitanzania zinavyoweza kutumika kukuza uchumi binafsi na jamii', methods: ['caseStudy', 'guestSpeaker'], resources: HT_OPPORT },
  'HT1-1.3c': { mainCompetence: HT_MC1, specificCompetence: HT_S13, mainActivity: 'Kueleza njia mbalimbali za kutunza urithi wa jamii za Kitanzania', methods: ['tips', 'groupDiscussion'], resources: HT_OPPORT },
  'HT1-1.4a': { mainCompetence: HT_MC1, specificCompetence: HT_S14, mainActivity: 'Kuainisha shughuli mbalimbali za kujenga ushirikiano na kukuza uchumi wa Taifa', methods: ['research', 'gallery'], resources: HT_NATION },
  'HT1-1.4b': { mainCompetence: HT_MC1, specificCompetence: HT_S14, mainActivity: 'Kufafanua namna shughuli mbalimbali zinavyochangia kujenga ushirikiano na kukuza uchumi wa Taifa', methods: ['guestSpeaker', 'groupDiscussion'], resources: HT_NATION },
  'HT1-2.1a': { mainCompetence: HT_MC2, specificCompetence: HT_S21, mainActivity: 'Kubaini mifumo ya kijamii ya Tanzania kabla ya ukoloni', methods: ['research', 'groupDiscussion'], resources: HT_SOCIAL },
  'HT1-2.1b': { mainCompetence: HT_MC2, specificCompetence: HT_S21, mainActivity: 'Kueleza mifumo ya kijamii ya Tanzania ilivyokuza maadili kabla ya ukoloni', methods: ['guestSpeaker', 'groupDiscussion'], resources: HT_SOCIAL },
  'HT1-2.2a': { mainCompetence: HT_MC2, specificCompetence: HT_S22, mainActivity: 'Kubaini mifumo ya kiuchumi na kisiasa katika jamii za Kitanzania kabla ya ukoloni', methods: ['research', 'groupDiscussion'], resources: HT_POLECON },
  'HT1-2.2b': { mainCompetence: HT_MC2, specificCompetence: HT_S22, mainActivity: 'Kueleza jinsi mifumo ya kisiasa na kiuchumi ilivyokuza na kuendeleza shughuli za kiuchumi na kisiasa kabla ya ukoloni', methods: ['research', 'groupDiscussion'], resources: HT_POLECON },
  'HT1-2.2c': { mainCompetence: HT_MC2, specificCompetence: HT_S22, mainActivity: 'Kufafanua uhusiano kati ya jamii za Kitanzania na za Mashariki ya Kati, Mashariki ya Mbali na Ulaya katika kuendeleza shughuli za kiuchumi na kisiasa kabla ya ukoloni', methods: ['jigsaw', 'groupDiscussion'], resources: HT_POLECON },
  'HT1-2.2d': { mainCompetence: HT_MC2, specificCompetence: HT_S22, mainActivity: 'Kutathmini mchango wa mifumo ya kisiasa na kiuchumi katika kukuza maadili ya jamii za Kitanzania kabla ya ukoloni', methods: ['caseStudy', 'groupDiscussion'], resources: HT_POLECON },
  'HT1-2.3a': { mainCompetence: HT_MC2, specificCompetence: HT_S23, mainActivity: 'Kueleza hali ya sayansi na teknolojia katika jamii za Kitanzania kabla ya ukoloni', methods: ['research', 'groupDiscussion'], resources: HT_SCI },
  'HT1-2.3b': { mainCompetence: HT_MC2, specificCompetence: HT_S23, mainActivity: 'Kubaini vichocheo vya mabadiliko ya sayansi na teknolojia katika jamii za Kitanzania kabla ya ukoloni', methods: ['caseStudy', 'qa'], resources: HT_SCI },
  // ---- Kidato cha II ----
  'HT2-1.1a': { mainCompetence: HT_MC3, specificCompetence: HT_F2_S31, mainActivity: 'Kuchambua chimbuko la ukoloni', methods: ['research', 'groupDiscussion'], resources: HT_COLONY },
  'HT2-1.1b': { mainCompetence: HT_MC3, specificCompetence: HT_F2_S31, mainActivity: 'Kubainisha mataifa yaliyoitawala Tanzania na mifumo yake ya kikoloni katika uchumi, utawala na utamaduni', methods: ['groupDiscussion', 'research'], resources: HT_COLONY },
  'HT2-1.1c': { mainCompetence: HT_MC3, specificCompetence: HT_F2_S31, mainActivity: 'Kujadili mchango wa mifumo ya kikoloni katika uhusiano wa Tanzania na mataifa yaliyoitawala', methods: ['tips', 'groupDiscussion'], resources: HT_COLONY },
  'HT2-1.2a': { mainCompetence: HT_MC3, specificCompetence: HT_F2_S32, mainActivity: 'Kueleza hali ya maadili ya jamii za Kitanzania kipindi ukoloni unaingia', methods: ['jigsaw', 'groupDiscussion'], resources: HT_ETHICS_COL },
  'HT2-1.2b': { mainCompetence: HT_MC3, specificCompetence: HT_F2_S32, mainActivity: 'Kuchambua athari za mfumo wa ukoloni katika maadili ya jamii za Kitanzania', methods: ['research', 'groupDiscussion'], resources: HT_ETHICS_COL },
  'HT2-1.2c': { mainCompetence: HT_MC3, specificCompetence: HT_F2_S32, mainActivity: 'Kubaini maadili yaliyodumishwa na jamii za Kitanzania wakati wa ukoloni', methods: ['groupDiscussion', 'caseStudy', 'qa'], resources: HT_ETHICS_COL },
  'HT2-1.3a': { mainCompetence: HT_MC3, specificCompetence: HT_F2_S33, mainActivity: 'Kubaini sababu za jamii za Kitanzania kupinga uvamizi wa kikoloni, ukoloni na maadili yake', methods: ['research', 'qa'], resources: HT_RESIST },
  'HT2-1.3b': { mainCompetence: HT_MC3, specificCompetence: HT_F2_S33, mainActivity: 'Kujadili njia mbalimbali zilizotumika na jamii za Kitanzania kupinga uvamizi wa kikoloni, ukoloni na maadili yake', methods: ['caseStudy', 'groupDiscussion'], resources: HT_RESIST },
  'HT2-1.3c': { mainCompetence: HT_MC3, specificCompetence: HT_F2_S33, mainActivity: 'Kufafanua misingi na mbinu zilizotumika kupigania uhuru wa Tanganyika na Zanzibar', methods: ['guestSpeaker', 'groupDiscussion'], resources: HT_RESIST },
  'HT2-1.3d': { mainCompetence: HT_MC3, specificCompetence: HT_F2_S33, mainActivity: 'Kutathmini mchango wa harakati za kupinga uvamizi na ukoloni katika kutunza maadili ya Kitanzania na kujenga uzalendo', methods: ['reflection', 'qa'], resources: HT_RESIST },
  'HT2-2.1a': { mainCompetence: HT_MC4, specificCompetence: HT_F2_S41, mainActivity: 'Kueleza hali ya uchumi, siasa, utamaduni, jamii na maadili mara baada ya uhuru', methods: ['research', 'groupDiscussion'], resources: HT_NATIONB },
  'HT2-2.1b': { mainCompetence: HT_MC4, specificCompetence: HT_F2_S41, mainActivity: 'Kutathmini mikakati na changamoto za ujenzi wa Taifa kiuchumi, kisiasa, kiutamaduni, kijamii na kimaadili kipindi cha 1961 – 1966', methods: ['reflection', 'groupDiscussion'], resources: HT_NATIONB },
  'HT2-2.2a': { mainCompetence: HT_MC4, specificCompetence: HT_F2_S42, mainActivity: 'Kueleza chimbuko la Mapinduzi Matukufu ya Zanzibar', methods: ['research', 'groupDiscussion'], resources: HT_ZNZ },
  'HT2-2.2b': { mainCompetence: HT_MC4, specificCompetence: HT_F2_S42, mainActivity: 'Kubaini mchango wa Mapinduzi Matukufu ya Zanzibar katika kujenga umoja, mshikamano na maadili miongoni mwa Wazanzibari', methods: ['research', 'qa'], resources: HT_ZNZ },
  // ---- Kidato cha III ----
  'HT3-1.1a': { mainCompetence: HT_MC4, specificCompetence: HT_F3_S43, mainActivity: 'Kufafanua chimbuko la Muungano wa Tanganyika na Zanzibar', methods: ['research', 'groupDiscussion'], resources: HT_UNION },
  'HT3-1.1b': { mainCompetence: HT_MC4, specificCompetence: HT_F3_S43, mainActivity: 'Kueleza muundo na misingi ya Muungano wa Tanganyika na Zanzibar', methods: ['research', 'groupDiscussion'], resources: HT_UNION },
  'HT3-1.1c': { mainCompetence: HT_MC4, specificCompetence: HT_F3_S43, mainActivity: 'Kutathmini Muungano wa Tanganyika na Zanzibar katika kujenga umoja na maadili ya Kitaifa', methods: ['research', 'reflection'], resources: HT_UNION },
  'HT3-2.1a': { mainCompetence: HT_MC5, specificCompetence: HT_F3_S51, mainActivity: 'Kujadili chimbuko la Azimio la Arusha', methods: ['research', 'groupDiscussion'], resources: HT_ARUSHA },
  'HT3-2.1b': { mainCompetence: HT_MC5, specificCompetence: HT_F3_S51, mainActivity: 'Kufafanua misingi na mchango wa Azimio la Arusha katika ujenzi wa Taifa kiuchumi, kisiasa, kijamii na kimaadili', methods: ['jigsaw', 'groupDiscussion'], resources: HT_ARUSHA },
  'HT3-2.1c': { mainCompetence: HT_MC5, specificCompetence: HT_F3_S51, mainActivity: 'Kutathmini changamoto za Azimio la Arusha kiuchumi, kisiasa, kijamii na kimaadili', methods: ['research', 'reflection'], resources: HT_ARUSHA },
  'HT3-2.2a': { mainCompetence: HT_MC5, specificCompetence: HT_F3_S52, mainActivity: 'Kufafanua dhana ya uhusiano wa kikanda na ujenzi wa Taifa', methods: ['guestSpeaker', 'qa'], resources: HT_REGION },
  'HT3-2.2b': { mainCompetence: HT_MC5, specificCompetence: HT_F3_S52, mainActivity: 'Kueleza mchango wa Tanzania katika kukuza uhusiano wa kikanda na kujenga utaifa (EAC na SADC)', methods: ['research', 'debate'], resources: HT_REGION },
  'HT3-2.2c': { mainCompetence: HT_MC5, specificCompetence: HT_F3_S52, mainActivity: 'Kubaini changamoto za uhusiano wa kikanda katika ujenzi wa Taifa', methods: ['caseStudy', 'qa'], resources: HT_REGION },
});

const PHTF = (form: 1 | 2 | 3) => (topic: string, subtopic: string, part: string, unit: string, ...specificActivities: string[]): LessonPart =>
  ({ id: `ht${form}-${++_n}`, subject: 'Historia ya Tanzania na Maadili', form, topic, subtopic, part, unit, specificActivities });
const HT1 = PHTF(1);
const HT2 = PHTF(2);
const HT3 = PHTF(3);

LESSON_PARTS.push(
  // ===== KIDATO CHA I =====
  HT1('Dhana ya Historia ya Tanzania na Maadili', 'Historia ya Tanzania na Maadili', 'Maana ya Historia ya Tanzania na Maadili', 'HT1-0', 'Kueleza maana ya Historia ya Tanzania na Maadili', 'Kutoa mifano ya matukio ya historia ya Tanzania'),
  HT1('Dhana ya Historia ya Tanzania na Maadili', 'Dhana ya maadili', 'Dhana ya maadili', 'HT1-0', 'Kueleza maana ya maadili', 'Kutoa mifano ya maadili mema ya Kitanzania'),
  HT1('Dhana ya Historia ya Tanzania na Maadili', 'Umuhimu wa somo la Historia ya Tanzania na Maadili', 'Umuhimu wa somo la Historia ya Tanzania na Maadili', 'HT1-0', 'Kueleza umuhimu wa kujifunza somo hili', 'Kuhusisha somo hili na maisha ya kila siku'),
  HT1('Dhana ya Historia ya Tanzania na Maadili', 'Uhusiano kati ya somo la Historia ya Tanzania na Maadili na masomo mengine', 'Uhusiano wa somo hili na masomo mengine', 'HT1-0', 'Kubainisha masomo yanayohusiana na Historia ya Tanzania na Maadili', 'Kutoa mifano ya uhusiano huo'),

  HT1('Chimbuko la jamii za Kitanzania na maadili yake', 'Dhana ya jamii', 'Dhana ya jamii', 'HT1-1.1a', 'Kueleza dhana ya jamii', 'Kutoa mifano ya jamii za Kitanzania'),
  HT1('Chimbuko la jamii za Kitanzania na maadili yake', 'Asili ya jamii za Kitanzania', 'Asili ya Wabantu na Wanilo', 'HT1-1.1a', 'Kueleza asili ya Wabantu na Wanilo', 'Kutaja mifano ya jamii za makundi hayo'),
  HT1('Chimbuko la jamii za Kitanzania na maadili yake', 'Asili ya jamii za Kitanzania', 'Asili ya Wakushito na Wakichembe', 'HT1-1.1a', 'Kueleza asili ya Wakushito na Wakichembe', 'Kutaja mifano ya jamii za makundi hayo'),
  HT1('Chimbuko la jamii za Kitanzania na maadili yake', 'Mtawanyiko wa jamii za Tanzania kabla ya ukoloni', 'Mtawanyiko wa jamii za Tanzania kabla ya ukoloni', 'HT1-1.1a', 'Kueleza mtawanyiko wa jamii za Tanzania kabla ya ukoloni', 'Kuonesha njia za uhamaji kwenye ramani'),
  HT1('Chimbuko la jamii za Kitanzania na maadili yake', 'Matokeo ya uhamaji', 'Matokeo ya uhamaji', 'HT1-1.1a', 'Kubainisha matokeo ya uhamaji wa jamii', 'Kueleza athari za uhamaji kwa jamii za Kitanzania'),
  HT1('Chimbuko la jamii za Kitanzania na maadili yake', 'Shughuli za makundi ya asili ya jamii za Kitanzania', 'Shughuli za makundi ya asili ya jamii za Kitanzania', 'HT1-1.1b', 'Kubaini shughuli za makundi ya asili ya jamii za Kitanzania', 'Kulinganisha shughuli za makundi hayo'),
  HT1('Chimbuko la jamii za Kitanzania na maadili yake', 'Maadili ya jamii za asili ya Kitanzania', 'Maadili ya jamii za asili ya Kitanzania', 'HT1-1.1c', 'Kueleza maadili ya jamii za asili ya Kitanzania', 'Kutoa mifano ya maadili hayo'),

  HT1('Maadili na urithi wa jamii za Kitanzania', 'Dhana ya urithi wa Tanzania', 'Dhana ya urithi wa Tanzania', 'HT1-1.2a', 'Kueleza dhana ya urithi', 'Kutaja aina za urithi wa Tanzania'),
  HT1('Maadili na urithi wa jamii za Kitanzania', 'Maadili kama sehemu ya urithi wa kiutamaduni', 'Maadili kama sehemu ya urithi wa kiutamaduni', 'HT1-1.2a', 'Kueleza maadili kama sehemu ya urithi wa kiutamaduni', 'Kutoa mifano kutoka katika jamii'),
  HT1('Maadili na urithi wa jamii za Kitanzania', 'Kazi za binadamu kama sehemu ya urithi wa kiutamaduni', 'Kazi za binadamu kama sehemu ya urithi wa kiutamaduni', 'HT1-1.2a', 'Kubainisha kazi za binadamu zilizo urithi wa kiutamaduni', 'Kueleza umuhimu wa kazi hizo'),
  HT1('Maadili na urithi wa jamii za Kitanzania', 'Urithi wa asili', 'Urithi wa asili', 'HT1-1.2a', 'Kueleza maana ya urithi wa asili', 'Kutaja mifano ya urithi wa asili wa Tanzania'),
  HT1('Maadili na urithi wa jamii za Kitanzania', 'Matendo yanayokuza na kulinda maadili na urithi wa Tanzania', 'Matendo yanayokuza na kulinda maadili na urithi wa Tanzania', 'HT1-1.2b', 'Kueleza matendo yanayokuza na kulinda maadili na urithi', 'Kuainisha wajibu wa mwanafunzi katika kulinda urithi'),

  HT1('Fursa zinazotokana na urithi wa jamii za Kitanzania', 'Urithi wa kihistoria', 'Urithi wa kihistoria', 'HT1-1.3a', 'Kueleza maana ya urithi wa kihistoria', 'Kutaja mifano ya urithi wa kihistoria wa Tanzania'),
  HT1('Fursa zinazotokana na urithi wa jamii za Kitanzania', 'Fursa za urithi wa kihistoria', 'Fursa za urithi wa kihistoria', 'HT1-1.3a', 'Kubaini fursa zinazotokana na urithi wa kihistoria', 'Kuorodhesha fursa hizo kwa mifano'),
  HT1('Fursa zinazotokana na urithi wa jamii za Kitanzania', 'Matumizi ya fursa za urithi wa kihistoria', 'Matumizi ya fursa za urithi wa kihistoria', 'HT1-1.3b', 'Kueleza jinsi fursa za urithi wa kihistoria zinavyotumika', 'Kueleza manufaa yake kwa uchumi binafsi na jamii'),
  HT1('Fursa zinazotokana na urithi wa jamii za Kitanzania', 'Urithi wa asili', 'Urithi wa asili', 'HT1-1.3a', 'Kueleza maana ya urithi wa asili', 'Kutaja mifano ya urithi wa asili wa Tanzania'),
  HT1('Fursa zinazotokana na urithi wa jamii za Kitanzania', 'Fursa za urithi wa asili', 'Fursa za urithi wa asili', 'HT1-1.3a', 'Kubaini fursa zinazotokana na urithi wa asili', 'Kuorodhesha fursa hizo kwa mifano'),
  HT1('Fursa zinazotokana na urithi wa jamii za Kitanzania', 'Matumizi ya fursa za urithi wa asili', 'Matumizi ya fursa za urithi wa asili', 'HT1-1.3b', 'Kueleza jinsi fursa za urithi wa asili zinavyotumika', 'Kueleza manufaa yake kwa uchumi binafsi na jamii'),
  HT1('Fursa zinazotokana na urithi wa jamii za Kitanzania', 'Njia za kutunza urithi wa jamii za Kitanzania', 'Njia za kutunza urithi wa jamii za Kitanzania', 'HT1-1.3c', 'Kueleza njia za kutunza urithi wa jamii za Kitanzania', 'Kupendekeza hatua za kutunza urithi wa mazingira yao'),
  HT1('Fursa zinazotokana na urithi wa jamii za Kitanzania', 'Fursa za kukuza uchumi na ushirikiano wa kitaifa', 'Shughuli za kujenga ushirikiano na kukuza uchumi wa kitaifa', 'HT1-1.4a', 'Kuainisha shughuli za kujenga ushirikiano na kukuza uchumi wa Taifa', 'Kutoa mifano ya shughuli hizo'),
  HT1('Fursa zinazotokana na urithi wa jamii za Kitanzania', 'Fursa za kukuza uchumi na ushirikiano wa kitaifa', 'Mchango wa shughuli hizo katika ushirikiano na uchumi wa Taifa', 'HT1-1.4b', 'Kufafanua mchango wa shughuli hizo katika ushirikiano wa kitaifa', 'Kufafanua mchango wake katika kukuza uchumi wa Taifa'),

  HT1('Mifumo katika jamii za Kitanzania kabla ya ukoloni', 'Mifumo ya kijamii', 'Mifumo ya kijamii', 'HT1-2.1a', 'Kubaini mifumo ya kijamii (elimu, afya, utamaduni)', 'Kueleza kazi ya kila mfumo'),
  HT1('Mifumo katika jamii za Kitanzania kabla ya ukoloni', 'Utamaduni wa jamii za asili ya Tanzania kabla ya ukoloni', 'Utamaduni wa jamii za asili ya Tanzania kabla ya ukoloni', 'HT1-2.1a', 'Kueleza utamaduni wa jamii za asili kabla ya ukoloni', 'Kutoa mifano ya mila na desturi'),
  HT1('Mifumo katika jamii za Kitanzania kabla ya ukoloni', 'Mifumo ya kijamii ilivyokuza ujenzi wa maadili', 'Mifumo ya kijamii ilivyokuza ujenzi wa maadili', 'HT1-2.1b', 'Kueleza jinsi mifumo ya kijamii ilivyokuza maadili', 'Kutoa mifano ya maadili yaliyojengwa na mifumo hiyo'),
  HT1('Mifumo katika jamii za Kitanzania kabla ya ukoloni', 'Mifumo ya kiuchumi kabla ya ukoloni', 'Mifumo ya kiuchumi kabla ya ukoloni', 'HT1-2.2a', 'Kubaini mifumo ya kiuchumi kabla ya ukoloni', 'Kueleza sifa za kila mfumo'),
  HT1('Mifumo katika jamii za Kitanzania kabla ya ukoloni', 'Maendeleo ya viwanda', 'Maendeleo ya viwanda', 'HT1-2.2a', 'Kueleza maendeleo ya viwanda kabla ya ukoloni', 'Kutaja mifano ya viwanda vya jamii za asili'),
  HT1('Mifumo katika jamii za Kitanzania kabla ya ukoloni', 'Shughuli za kilimo katika jamii za asili', 'Shughuli za kilimo katika jamii za asili', 'HT1-2.2a', 'Kueleza shughuli za kilimo katika jamii za asili', 'Kulinganisha aina za kilimo zilizofanyika'),
  HT1('Mifumo katika jamii za Kitanzania kabla ya ukoloni', 'Mifumo ya kisiasa ya jamii za Kitanzania kabla ya ukoloni', 'Mifumo ya kisiasa ya jamii za Kitanzania kabla ya ukoloni', 'HT1-2.2a', 'Kubaini mifumo ya kisiasa kabla ya ukoloni', 'Kutoa mifano ya jamii zilizotumia mifumo hiyo'),
  HT1('Mifumo katika jamii za Kitanzania kabla ya ukoloni', 'Jinsi mifumo ya kisiasa na kiuchumi ilivyokuza shughuli za siasa', 'Jinsi mifumo ya kisiasa na kiuchumi ilivyokuza shughuli za siasa', 'HT1-2.2b', 'Kueleza jinsi mifumo ya kisiasa na kiuchumi ilivyokuza shughuli za siasa', 'Kutoa mifano kutoka jamii za Kitanzania'),
  HT1('Mifumo katika jamii za Kitanzania kabla ya ukoloni', 'Mchango wa mifumo ya kisiasa na kiuchumi katika kukuza maadili', 'Mchango wa mifumo ya kisiasa na kiuchumi katika kukuza maadili', 'HT1-2.2d', 'Kutathmini mchango wa mifumo ya kisiasa na kiuchumi katika kukuza maadili', 'Kutoa mifano ya maadili yaliyokuzwa'),
  HT1('Mifumo katika jamii za Kitanzania kabla ya ukoloni', 'Changamoto zilizojitokeza katika ujenzi wa maadili', 'Changamoto zilizojitokeza katika ujenzi wa maadili', 'HT1-2.2d', 'Kubainisha changamoto zilizojitokeza katika ujenzi wa maadili', 'Kupendekeza namna ya kukabiliana nazo'),

  HT1('Uhusiano kati ya jamii za Kitanzania na jamii nyingine', 'Uhusiano kati ya jamii za Kitanzania', 'Uhusiano kati ya jamii za Kitanzania', 'HT1-2.2c', 'Kueleza uhusiano uliokuwepo kati ya jamii za Kitanzania', 'Kutoa mifano ya uhusiano huo'),
  HT1('Uhusiano kati ya jamii za Kitanzania na jamii nyingine', 'Uhusiano kati ya jamii za Kitanzania na za Mashariki ya Kati na Mbali', 'Uhusiano na jamii za Mashariki ya Kati na Mbali', 'HT1-2.2c', 'Kueleza uhusiano kati ya jamii za Kitanzania na za Mashariki ya Kati na Mbali', 'Kutaja bidhaa zilizobadilishana'),
  HT1('Uhusiano kati ya jamii za Kitanzania na jamii nyingine', 'Uhusiano wa jamii za Kitanzania na jamii za Ulaya', 'Uhusiano na jamii za Ulaya', 'HT1-2.2c', 'Kueleza uhusiano kati ya jamii za Kitanzania na za Ulaya', 'Kubainisha sababu za uhusiano huo'),
  HT1('Uhusiano kati ya jamii za Kitanzania na jamii nyingine', 'Athari za uhusiano kati ya jamii za Kitanzania na jamii za Mashariki ya Kati na Mbali', 'Athari za uhusiano na jamii za Mashariki ya Kati na Mbali', 'HT1-2.2c', 'Kubainisha athari chanya na hasi za uhusiano huo', 'Kujadili athari hizo kwa jamii za Kitanzania'),
  HT1('Uhusiano kati ya jamii za Kitanzania na jamii nyingine', 'Athari zilizotokana na uhusiano kati ya bara la Ulaya na jamii za Kitanzania', 'Athari za uhusiano kati ya bara la Ulaya na jamii za Kitanzania', 'HT1-2.2c', 'Kubainisha athari za uhusiano na bara la Ulaya', 'Kujadili athari hizo kwa jamii za Kitanzania'),

  HT1('Sayansi na teknolojia kabla ya ukoloni', 'Dhana ya sayansi na teknolojia', 'Dhana ya sayansi na teknolojia', 'HT1-2.3a', 'Kueleza dhana ya sayansi na teknolojia', 'Kutoa mifano ya teknolojia ya jamii za asili'),
  HT1('Sayansi na teknolojia kabla ya ukoloni', 'Teknolojia wakati wa Zama za Mawe za Kale', 'Teknolojia wakati wa Zama za Mawe za Kale', 'HT1-2.3a', 'Kueleza teknolojia ya Zama za Mawe za Kale', 'Kutaja zana zilizotumika'),
  HT1('Sayansi na teknolojia kabla ya ukoloni', 'Teknolojia wakati wa Zama za Chuma', 'Teknolojia wakati wa Zama za Chuma', 'HT1-2.3a', 'Kueleza teknolojia ya Zama za Chuma', 'Kutaja zana na bidhaa zilizotengenezwa'),
  HT1('Sayansi na teknolojia kabla ya ukoloni', 'Tofauti ya teknolojia kati ya Zama za Mawe na Zama za Chuma', 'Tofauti ya teknolojia kati ya Zama za Mawe na Zama za Chuma', 'HT1-2.3a', 'Kulinganisha teknolojia ya Zama za Mawe na Zama za Chuma', 'Kueleza tofauti kuu kati ya zama hizo'),
  HT1('Sayansi na teknolojia kabla ya ukoloni', 'Mambo ya kujifunza kutokana na maendeleo ya Zama za Chuma', 'Mambo ya kujifunza kutokana na maendeleo ya Zama za Chuma', 'HT1-2.3b', 'Kubainisha mambo ya kujifunza kutokana na Zama za Chuma', 'Kueleza jinsi yanavyoweza kutumika leo'),
  HT1('Sayansi na teknolojia kabla ya ukoloni', 'Vichocheo vya mabadiliko ya sayansi na teknolojia kabla ya ukoloni', 'Vichocheo vya mabadiliko ya sayansi na teknolojia kabla ya ukoloni', 'HT1-2.3b', 'Kubaini vichocheo vya mabadiliko ya sayansi na teknolojia', 'Kutoa mifano ya vichocheo hivyo'),

  // ===== KIDATO CHA II =====
  HT2('Ukoloni katika jamii za Kitanzania', 'Chimbuko na ukuaji wa ukoloni', 'Chimbuko na ukuaji wa ukoloni', 'HT2-1.1a', 'Kuchambua chimbuko la ukoloni', 'Kueleza hatua za ukuaji wa ukoloni'),
  HT2('Ukoloni katika jamii za Kitanzania', 'Mifumo ya kikoloni ya mataifa yaliyozitawala jamii za Kitanzania', 'Mifumo ya kikoloni ya mataifa yaliyozitawala jamii za Kitanzania', 'HT2-1.1b', 'Kubainisha mataifa yaliyozitawala jamii za Kitanzania', 'Kueleza mifumo yao ya kikoloni'),
  HT2('Ukoloni katika jamii za Kitanzania', 'Utawala wa Waarabu', 'Utawala wa Waarabu', 'HT2-1.1b', 'Kueleza utawala wa Waarabu katika jamii za Kitanzania', 'Kueleza mifumo yao ya uchumi, utawala na utamaduni'),
  HT2('Ukoloni katika jamii za Kitanzania', 'Utawala wa Wajerumani', 'Utawala wa Wajerumani', 'HT2-1.1b', 'Kueleza utawala wa Wajerumani katika Tanganyika', 'Kueleza mifumo yao ya uchumi, utawala na utamaduni'),
  HT2('Ukoloni katika jamii za Kitanzania', 'Utawala wa Waingereza Tanganyika na Zanzibar', 'Utawala wa Waingereza Tanganyika na Zanzibar', 'HT2-1.1b', 'Kueleza utawala wa Waingereza Tanganyika na Zanzibar', 'Kueleza mifumo yao ya uchumi, utawala na utamaduni'),
  HT2('Ukoloni katika jamii za Kitanzania', 'Mchango wa ukoloni katika uhusiano wa Tanzania na mataifa yaliyoitawala', 'Mchango wa ukoloni katika uhusiano wa Tanzania na mataifa yaliyoitawala', 'HT2-1.1c', 'Kujadili mchango wa ukoloni katika uhusiano wa Tanzania na mataifa yaliyoitawala', 'Kubainisha manufaa na hasara za uhusiano huo'),

  HT2('Athari za ukoloni katika maadili ya Kitanzania', 'Dhana ya maadili wakati wa ukoloni', 'Dhana ya maadili wakati wa ukoloni', 'HT2-1.2a', 'Kueleza dhana ya maadili wakati wa ukoloni', 'Kutoa mifano ya maadili ya kikoloni'),
  HT2('Athari za ukoloni katika maadili ya Kitanzania', 'Maadili ya jamii za Kitanzania wakati ukoloni unaingia', 'Maadili ya jamii za Kitanzania wakati ukoloni unaingia', 'HT2-1.2a', 'Kueleza hali ya maadili ya jamii za Kitanzania kipindi ukoloni unaingia', 'Kutoa mifano ya maadili ya jamii hizo'),
  HT2('Athari za ukoloni katika maadili ya Kitanzania', 'Athari za mfumo wa ukoloni katika maadili ya Kitanzania', 'Athari za mfumo wa ukoloni katika maadili ya Kitanzania', 'HT2-1.2b', 'Kuchambua athari za mfumo wa ukoloni katika maadili ya Kitanzania', 'Kutofautisha athari chanya na hasi'),
  HT2('Athari za ukoloni katika maadili ya Kitanzania', 'Maadili ya Kitanzania yaliyodumishwa wakati wa ukoloni', 'Maadili ya Kitanzania yaliyodumishwa wakati wa ukoloni', 'HT2-1.2c', 'Kubaini maadili yaliyodumishwa wakati wa ukoloni', 'Kueleza jinsi jamii zilivyoyadumisha'),

  HT2('Mapambano ya awali dhidi ya uvamizi wa kikoloni', 'Dhana ya uvamizi wa kikoloni', 'Dhana ya uvamizi wa kikoloni', 'HT2-1.3a', 'Kueleza dhana ya uvamizi wa kikoloni', 'Kutoa mifano ya uvamizi katika Tanzania'),
  HT2('Mapambano ya awali dhidi ya uvamizi wa kikoloni', 'Sababu za kuupinga uvamizi wa kikoloni na maadili yake', 'Sababu za kuupinga uvamizi wa kikoloni na maadili yake', 'HT2-1.3a', 'Kubaini sababu za kupinga uvamizi wa kikoloni', 'Kueleza sababu za kupinga maadili ya kikoloni'),
  HT2('Mapambano ya awali dhidi ya uvamizi wa kikoloni', 'Upinzani dhidi ya uvamizi wa kikoloni katika jamii za Kitanzania', 'Upinzani dhidi ya uvamizi wa kikoloni katika jamii za Kitanzania', 'HT2-1.3b', 'Kujadili upinzani dhidi ya uvamizi wa kikoloni katika jamii za Kitanzania', 'Kutaja viongozi na jamii zilizopinga'),
  HT2('Mapambano ya awali dhidi ya uvamizi wa kikoloni', 'Changamoto zilizokabili mapambano dhidi ya uvamizi wa kikoloni', 'Changamoto zilizokabili mapambano dhidi ya uvamizi wa kikoloni', 'HT2-1.3b', 'Kubainisha changamoto zilizokabili mapambano', 'Kueleza chanzo cha changamoto hizo'),
  HT2('Mapambano ya awali dhidi ya uvamizi wa kikoloni', 'Matokeo ya kupinga uvamizi wa kikoloni', 'Matokeo ya kupinga uvamizi wa kikoloni', 'HT2-1.3b', 'Kueleza matokeo ya kupinga uvamizi wa kikoloni', 'Kutofautisha matokeo chanya na hasi'),

  HT2('Harakati za kudai uhuru wa Tanganyika na Zanzibar', 'Dhana ya uhuru na harakati za kudai uhuru', 'Dhana ya uhuru na harakati za kudai uhuru', 'HT2-1.3c', 'Kueleza dhana ya uhuru na harakati za kudai uhuru', 'Kutoa mifano ya harakati hizo'),
  HT2('Harakati za kudai uhuru wa Tanganyika na Zanzibar', 'Misingi ya kudai uhuru wa Tanganyika na Zanzibar', 'Misingi ya kudai uhuru wa Tanganyika na Zanzibar', 'HT2-1.3c', 'Kufafanua misingi ya kudai uhuru wa Tanganyika na Zanzibar', 'Kutaja vyama na viongozi waliodai uhuru'),
  HT2('Harakati za kudai uhuru wa Tanganyika na Zanzibar', 'Mbinu zilizotumika kudai uhuru wa Tanganyika na Zanzibar', 'Mbinu zilizotumika kudai uhuru wa Tanganyika na Zanzibar', 'HT2-1.3c', 'Kufafanua mbinu zilizotumika kudai uhuru', 'Kueleza mafanikio ya mbinu hizo'),
  HT2('Harakati za kudai uhuru wa Tanganyika na Zanzibar', 'Mchango wa harakati za kupinga uvamizi na ukoloni', 'Mchango wa harakati za kupinga uvamizi na ukoloni', 'HT2-1.3d', 'Kutathmini mchango wa harakati za kupinga uvamizi na ukoloni', 'Kueleza jinsi zilivyokuza uzalendo na maadili'),

  HT2('Ujenzi wa taifa baada ya ukoloni', 'Dhana ya ujenzi wa taifa', 'Dhana ya ujenzi wa taifa', 'HT2-2.1a', 'Kueleza dhana ya ujenzi wa taifa', 'Kutoa mifano ya ujenzi wa taifa'),
  HT2('Ujenzi wa taifa baada ya ukoloni', 'Mifumo iliyojengwa kati ya mwaka 1961 hadi 1966', 'Mifumo iliyojengwa kati ya mwaka 1961 hadi 1966', 'HT2-2.1a', 'Kueleza hali ya uchumi, siasa, utamaduni, jamii na maadili baada ya uhuru', 'Kubainisha mifumo iliyojengwa 1961 – 1966'),
  HT2('Ujenzi wa taifa baada ya ukoloni', 'Mikakati ya ujenzi wa taifa', 'Mikakati ya ujenzi wa taifa', 'HT2-2.1b', 'Kubainisha mikakati ya ujenzi wa taifa', 'Kutathmini mafanikio ya mikakati hiyo'),
  HT2('Ujenzi wa taifa baada ya ukoloni', 'Changamoto za ujenzi wa taifa', 'Changamoto za ujenzi wa taifa', 'HT2-2.1b', 'Kubainisha changamoto za ujenzi wa taifa', 'Kupendekeza namna ya kukabiliana nazo'),

  HT2('Mapinduzi Matukufu ya Zanzibar', 'Dhana ya mapinduzi', 'Dhana ya mapinduzi', 'HT2-2.2a', 'Kueleza dhana ya mapinduzi', 'Kutofautisha mapinduzi na mabadiliko mengine'),
  HT2('Mapinduzi Matukufu ya Zanzibar', 'Chimbuko la Mapinduzi Matukufu ya Zanzibar', 'Chimbuko la Mapinduzi Matukufu ya Zanzibar', 'HT2-2.2a', 'Kueleza chimbuko la Mapinduzi Matukufu ya Zanzibar', 'Kueleza hali ya Zanzibar kabla ya mapinduzi'),
  HT2('Mapinduzi Matukufu ya Zanzibar', 'Sababu za Mapinduzi Matukufu ya Zanzibar', 'Sababu za Mapinduzi Matukufu ya Zanzibar', 'HT2-2.2a', 'Kubainisha sababu za Mapinduzi Matukufu ya Zanzibar', 'Kupanga sababu hizo kwa makundi (kisiasa, kiuchumi, kijamii)'),
  HT2('Mapinduzi Matukufu ya Zanzibar', 'Mchango wa Mapinduzi Matukufu ya Zanzibar', 'Mchango wa Mapinduzi Matukufu ya Zanzibar', 'HT2-2.2b', 'Kubaini mchango wa Mapinduzi Matukufu ya Zanzibar', 'Kueleza mchango wake katika umoja, mshikamano na maadili'),

  // ===== KIDATO CHA III =====
  HT3('Muungano wa Tanganyika na Zanzibar', 'Chimbuko la Muungano wa Tanganyika na Zanzibar', 'Chimbuko la Muungano wa Tanganyika na Zanzibar', 'HT3-1.1a', 'Kufafanua chimbuko la Muungano wa Tanganyika na Zanzibar', 'Kueleza matukio yaliyosababisha Muungano'),
  HT3('Muungano wa Tanganyika na Zanzibar', 'Misingi ya Muungano wa Tanganyika na Zanzibar', 'Misingi ya Muungano wa Tanganyika na Zanzibar', 'HT3-1.1b', 'Kueleza misingi ya Muungano wa Tanganyika na Zanzibar', 'Kutaja Hati za Muungano'),
  HT3('Muungano wa Tanganyika na Zanzibar', 'Muundo wa Muungano', 'Muundo wa Muungano', 'HT3-1.1b', 'Kueleza muundo wa Muungano', 'Kuchora kielelezo cha muundo wa Muungano'),
  HT3('Muungano wa Tanganyika na Zanzibar', 'Mambo ya Muungano', 'Mambo ya Muungano', 'HT3-1.1b', 'Kutaja mambo ya Muungano', 'Kutofautisha mambo ya Muungano na yasiyo ya Muungano'),

  HT3('Mchango wa Muungano wa Tanganyika na Zanzibar', 'Dhana ya umoja wa kitaifa', 'Dhana ya umoja wa kitaifa', 'HT3-1.1c', 'Kueleza dhana ya umoja wa kitaifa', 'Kutoa mifano ya umoja wa kitaifa'),
  HT3('Mchango wa Muungano wa Tanganyika na Zanzibar', 'Mchango wa Muungano katika kujenga umoja wa kitaifa', 'Mchango wa Muungano katika kujenga umoja wa kitaifa', 'HT3-1.1c', 'Kueleza mchango wa Muungano katika kujenga umoja wa kitaifa', 'Kutoa mifano ya mchango huo'),
  HT3('Mchango wa Muungano wa Tanganyika na Zanzibar', 'Mchango wa Muungano katika kujenga maadili mengine ya kitaifa', 'Mchango wa Muungano katika kujenga maadili mengine ya kitaifa', 'HT3-1.1c', 'Kubainisha maadili ya kitaifa yaliyojengwa na Muungano', 'Kueleza jinsi Muungano ulivyoyajenga'),
  HT3('Mchango wa Muungano wa Tanganyika na Zanzibar', 'Hoja za Muungano', 'Hoja za Muungano', 'HT3-1.1c', 'Kubainisha hoja za Muungano', 'Kujadili hoja hizo kwa kuzingatia ukweli wa kihistoria'),
  HT3('Mchango wa Muungano wa Tanganyika na Zanzibar', 'Mikakati ya kudumisha Muungano wa Tanganyika na Zanzibar', 'Mikakati ya kudumisha Muungano wa Tanganyika na Zanzibar', 'HT3-1.1c', 'Kubainisha mikakati ya kudumisha Muungano', 'Kueleza wajibu wa raia katika kudumisha Muungano'),

  HT3('Chimbuko na misingi ya Azimio la Arusha', 'Dhana ya Azimio la Arusha', 'Dhana ya Azimio la Arusha', 'HT3-2.1a', 'Kueleza dhana ya Azimio la Arusha', 'Kueleza lengo la Azimio la Arusha'),
  HT3('Chimbuko na misingi ya Azimio la Arusha', 'Chimbuko la Azimio la Arusha', 'Chimbuko la Azimio la Arusha', 'HT3-2.1a', 'Kujadili chimbuko la Azimio la Arusha', 'Kubainisha sababu za kutangazwa kwa Azimio'),
  HT3('Chimbuko na misingi ya Azimio la Arusha', 'Misingi ya Azimio la Arusha', 'Misingi ya Azimio la Arusha', 'HT3-2.1b', 'Kufafanua misingi ya Azimio la Arusha', 'Kutoa mifano ya utekelezaji wa misingi hiyo'),
  HT3('Chimbuko na misingi ya Azimio la Arusha', 'Sehemu za Azimio la Arusha', 'Sehemu za Azimio la Arusha', 'HT3-2.1b', 'Kutaja sehemu za Azimio la Arusha', 'Kueleza kila sehemu kwa ufupi'),

  HT3('Ujenzi wa taifa wakati wa Azimio la Arusha', 'Dhana ya ujenzi wa taifa', 'Dhana ya ujenzi wa taifa wakati wa Azimio la Arusha', 'HT3-2.1b', 'Kueleza dhana ya ujenzi wa taifa', 'Kuhusisha ujenzi wa taifa na Azimio la Arusha'),
  HT3('Ujenzi wa taifa wakati wa Azimio la Arusha', 'Mchango wa Azimio la Arusha kwenye uchumi', 'Mchango wa Azimio la Arusha kwenye uchumi', 'HT3-2.1b', 'Kueleza mchango wa Azimio la Arusha kwenye uchumi', 'Kutoa mifano ya mafanikio'),
  HT3('Ujenzi wa taifa wakati wa Azimio la Arusha', 'Mchango wa Azimio la Arusha kwenye maendeleo ya jamii', 'Mchango wa Azimio la Arusha kwenye maendeleo ya jamii', 'HT3-2.1b', 'Kueleza mchango wa Azimio la Arusha kwenye maendeleo ya jamii', 'Kutoa mifano ya elimu na afya'),
  HT3('Ujenzi wa taifa wakati wa Azimio la Arusha', 'Mchango wa Azimio la Arusha katika sekta ya maji na umeme', 'Mchango wa Azimio la Arusha katika sekta ya maji na umeme', 'HT3-2.1b', 'Kueleza mchango wa Azimio la Arusha katika sekta ya maji na umeme', 'Kutoa mifano ya miradi iliyotekelezwa'),
  HT3('Ujenzi wa taifa wakati wa Azimio la Arusha', 'Mchango wa Azimio la Arusha kwenye usawa wa kijinsia', 'Mchango wa Azimio la Arusha kwenye usawa wa kijinsia', 'HT3-2.1b', 'Kueleza mchango wa Azimio la Arusha kwenye usawa wa kijinsia', 'Kutoa mifano ya mabadiliko yaliyotokea'),
  HT3('Ujenzi wa taifa wakati wa Azimio la Arusha', 'Mchango wa Azimio la Arusha kwenye siasa', 'Mchango wa Azimio la Arusha kwenye siasa', 'HT3-2.1b', 'Kueleza mchango wa Azimio la Arusha kwenye siasa', 'Kutoa mifano ya mabadiliko ya kisiasa'),
  HT3('Ujenzi wa taifa wakati wa Azimio la Arusha', 'Mchango wa Azimio la Arusha kwenye utamaduni', 'Mchango wa Azimio la Arusha kwenye utamaduni', 'HT3-2.1b', 'Kueleza mchango wa Azimio la Arusha kwenye utamaduni', 'Kutaja mfano wa lugha ya Kiswahili na michezo'),
  HT3('Ujenzi wa taifa wakati wa Azimio la Arusha', 'Changamoto zilizokabili Azimio la Arusha katika ujenzi wa taifa', 'Changamoto zilizokabili Azimio la Arusha katika ujenzi wa taifa', 'HT3-2.1c', 'Kutathmini changamoto zilizokabili Azimio la Arusha', 'Kupendekeza suluhisho la kila changamoto'),

  HT3('Ujenzi wa maadili wakati wa Azimio la Arusha', 'Dhana ya maadili ya taifa', 'Dhana ya maadili ya taifa', 'HT3-2.1b', 'Kueleza dhana ya maadili ya taifa', 'Kutoa mifano ya maadili ya taifa'),
  HT3('Ujenzi wa maadili wakati wa Azimio la Arusha', 'Mchango wa Azimio la Arusha kwenye ujenzi wa maadili ya taifa', 'Mchango wa Azimio la Arusha kwenye ujenzi wa maadili ya taifa', 'HT3-2.1b', 'Kueleza mchango wa Azimio la Arusha kwenye ujenzi wa maadili ya taifa', 'Kutoa mifano ya maadili yaliyojengwa'),
  HT3('Ujenzi wa maadili wakati wa Azimio la Arusha', 'Mikakati iliyotumika katika ujenzi wa maadili', 'Mikakati iliyotumika katika ujenzi wa maadili', 'HT3-2.1b', 'Kubainisha mikakati iliyotumika kujenga maadili', 'Kutathmini mafanikio ya mikakati hiyo'),

  HT3('Tanzania katika uhusiano wa kikanda', 'Dhana ya uhusiano wa kikanda', 'Dhana ya uhusiano wa kikanda', 'HT3-2.2a', 'Kufafanua dhana ya uhusiano wa kikanda', 'Kueleza umuhimu wa uhusiano wa kikanda'),
  HT3('Tanzania katika uhusiano wa kikanda', 'Uhusiano wa kikanda katika ujenzi wa taifa', 'Uhusiano wa kikanda katika ujenzi wa taifa', 'HT3-2.2a', 'Kueleza uhusiano wa kikanda katika ujenzi wa taifa', 'Kutoa mifano ya uhusiano huo'),
  HT3('Tanzania katika uhusiano wa kikanda', 'Jumuiya ya Afrika Mashariki - awamu ya kwanza, 1967-1977', 'Jumuiya ya Afrika Mashariki: awamu ya kwanza, 1967 – 1977', 'HT3-2.2b', 'Kueleza malengo na mafanikio ya Jumuiya ya Afrika Mashariki ya kwanza', 'Kubainisha sababu za kuvunjika kwake'),
  HT3('Tanzania katika uhusiano wa kikanda', 'Jumuiya ya Afrika Mashariki - awamu ya pili, kuanzia 2000', 'Jumuiya ya Afrika Mashariki: awamu ya pili, kuanzia 2000', 'HT3-2.2b', 'Kueleza malengo na mafanikio ya Jumuiya ya Afrika Mashariki ya pili', 'Kulinganisha awamu ya kwanza na ya pili'),
  HT3('Tanzania katika uhusiano wa kikanda', 'Jumuiya ya Maendeleo Kusini mwa Afrika', 'Jumuiya ya Maendeleo Kusini mwa Afrika (SADC)', 'HT3-2.2b', 'Kueleza malengo na mafanikio ya SADC', 'Kueleza nafasi ya Tanzania katika SADC'),
  HT3('Tanzania katika uhusiano wa kikanda', 'Mikakati ya kuendeleza uhusiano wa kikanda', 'Mikakati ya kuendeleza uhusiano wa kikanda', 'HT3-2.2b', 'Kubainisha mikakati ya kuendeleza uhusiano wa kikanda', 'Kupendekeza hatua za kuimarisha uhusiano huo'),

  HT3('Mchango wa uhusiano wa kikanda', 'Mchango wa Tanzania katika kukuza uhusiano wa kikanda', 'Mchango wa Tanzania katika kukuza uhusiano wa kikanda', 'HT3-2.2b', 'Kueleza mchango wa Tanzania katika kukuza uhusiano wa kikanda', 'Kutoa mifano ya mchango huo'),
  HT3('Mchango wa uhusiano wa kikanda', 'Mchango wa Tanzania katika harakati za ukombozi', 'Mchango wa Tanzania katika harakati za ukombozi', 'HT3-2.2b', 'Kueleza mchango wa Tanzania katika harakati za ukombozi wa nchi za Afrika', 'Kutaja nchi zilizonufaika'),
  HT3('Mchango wa uhusiano wa kikanda', 'Mchango wa uhusiano wa kikanda katika ujenzi wa taifa', 'Mchango wa uhusiano wa kikanda katika ujenzi wa taifa', 'HT3-2.2b', 'Kueleza mchango wa uhusiano wa kikanda katika ujenzi wa taifa', 'Kujenga hoja kwa kutumia mdahalo'),

  HT3('Changamoto za uhusiano wa kikanda', 'Changamoto katika kukuza uhusiano wa kikanda', 'Changamoto katika kukuza uhusiano wa kikanda', 'HT3-2.2c', 'Kubaini changamoto katika kukuza uhusiano wa kikanda', 'Kutoa mifano ya changamoto hizo'),
  HT3('Changamoto za uhusiano wa kikanda', 'Changamoto za uhusiano wa kikanda katika ujenzi wa taifa', 'Changamoto za uhusiano wa kikanda katika ujenzi wa taifa', 'HT3-2.2c', 'Kubaini changamoto za uhusiano wa kikanda katika ujenzi wa taifa', 'Kueleza athari za changamoto hizo'),
  HT3('Changamoto za uhusiano wa kikanda', 'Mikakati ya kukabiliana na changamoto za uhusiano wa kikanda', 'Mikakati ya kukabiliana na changamoto za uhusiano wa kikanda', 'HT3-2.2c', 'Kubainisha mikakati ya kukabiliana na changamoto za uhusiano wa kikanda', 'Kupendekeza suluhisho la kila changamoto'),
);

// Taarifa za kitabu (rejea): TIE, mwaka wa kitabu cha kila kidato.
export const HTM_REFERENCES: Partial<Record<1 | 2 | 3 | 4, string>> = {
  1: 'Taasisi ya Elimu Tanzania. (2023). Historia Ya Tanzania na Maadili kitabu cha mwanafunzi kwa shule za sekondari kidato cha kwanza. Taasisi ya Elimu Tanzania.',
  2: 'Taasisi ya Elimu Tanzania. (2024). Historia Ya Tanzania na Maadili kitabu cha mwanafunzi kwa shule za sekondari kidato cha pili. Taasisi ya Elimu Tanzania.',
  3: 'Taasisi ya Elimu Tanzania. (2025). Historia Ya Tanzania na Maadili kitabu cha mwanafunzi kwa shule za sekondari kidato cha tatu. Taasisi ya Elimu Tanzania.',
};

// ===================== KISWAHILI (bado hakijaongezwa: muhtasari na orodha ya mada hazijatolewa) =====================

// References: fill from the copyright page of each book.
export const REFERENCES: Record<1 | 2, string> = {
  1: "Tanzania Institute of Education. (2023). Computer Science for secondary schools student's book, form one. Tanzania Institute of Education.",
  2: "Tanzania Institute of Education. (2025). Computer Science for secondary schools student's book, form two. Tanzania Institute of Education.",
};

// TODO (Mr. Kijida): check the exact book title and year on the copyright page of the Mathematics book.
export const MATH_REFERENCES: Partial<Record<1 | 2 | 3 | 4, string>> = {
  1: "Tanzania Institute of Education. (2023). Mathematics for secondary schools student's book, form one. Tanzania Institute of Education.",
  2: "Tanzania Institute of Education. (2024). Mathematics for secondary schools student's book, form two. Tanzania Institute of Education.",
  3: "Tanzania Institute of Education. (2025). Mathematics for secondary schools student's book, form three. Tanzania Institute of Education.",
};

// TODO (Mr. Kijida): check the exact book titles on the copyright page of the Business Studies books.
export const BUSINESS_REFERENCES: Partial<Record<1 | 2 | 3 | 4, string>> = {
  1: "Tanzania Institute of Education. (2023). Business Studies for secondary schools student's book, form one. Tanzania Institute of Education.",
  2: "Tanzania Institute of Education. (2024). Business Studies for secondary schools student's book, form two. Tanzania Institute of Education.",
  3: "Tanzania Institute of Education. (2025). Business Studies for secondary schools student's book, form three. Tanzania Institute of Education.",
};

export const getReference = (subject: LessonPart['subject'], form: number): string => {
  if (subject === 'Mathematics') return MATH_REFERENCES[form as 1 | 2 | 3 | 4] ?? '';
  if (subject === 'Business Studies') return BUSINESS_REFERENCES[form as 1 | 2 | 3 | 4] ?? '';
  if (subject === 'English Language') return ENGLISH_REFERENCES[form as 1 | 2 | 3 | 4] ?? '';
  if (subject === 'Geography') return GEOGRAPHY_REFERENCES[form as 1 | 2 | 3 | 4] ?? '';
  if (subject === 'History') return HISTORY_REFERENCES[form as 1 | 2 | 3 | 4] ?? '';
  if (subject === 'Physics') return PHYSICS_REFERENCES[form as 1 | 2 | 3 | 4] ?? '';
  if (subject === 'Chemistry') return CHEMISTRY_REFERENCES[form as 1 | 2 | 3 | 4] ?? '';
  if (subject === 'Biology') return BIOLOGY_REFERENCES[form as 1 | 2 | 3 | 4] ?? '';
  if (subject === 'Historia ya Tanzania na Maadili') return HTM_REFERENCES[form as 1 | 2 | 3 | 4] ?? '';
  if (subject === 'Kiswahili') return '';
  return REFERENCES[form as 1 | 2] ?? '';
};

// Maps the subject name used in the timetable to the subject of the lesson-plan data.
export const resolveLessonSubject = (name: string): LessonPart['subject'] | null => {
  const value = name.toLowerCase();
  if (value.includes('computer')) return 'Computer Science';
  if (/math/.test(value)) return 'Mathematics';
  if (/business/.test(value)) return 'Business Studies';
  if (/english/.test(value)) return 'English Language';
  if (/geograph/.test(value)) return 'Geography';
  // Historia ya Tanzania na Maadili lazima ichunguzwe kabla ya 'History' (jina lina "histor").
  if (/historia\s+ya\s+tanzania|maadili/.test(value)) return 'Historia ya Tanzania na Maadili';
  if (/kiswahili|swahili/.test(value)) return 'Kiswahili';
  if (/histor/.test(value)) return 'History';
  if (/physic/.test(value)) return 'Physics';
  if (/chem/.test(value)) return 'Chemistry';
  if (/biolog/.test(value)) return 'Biology';
  return null;
};

// Forms that already have lesson-plan data for each subject.
export const supportedFormsFor = (subject: LessonPart['subject']): number[] => {
  const forms = new Set(LESSON_PARTS.filter(part => part.subject === subject).map(part => part.form));
  return [...forms];
};

export const getCommonResources = (subject: LessonPart['subject']): string[] =>
  subject === 'Mathematics' ? MATH_COMMON_RESOURCES
    : subject === 'Business Studies' ? BUSINESS_COMMON_RESOURCES
      : subject === 'English Language' ? ENGLISH_COMMON_RESOURCES
        : subject === 'Geography' ? GEOGRAPHY_COMMON_RESOURCES
          : subject === 'History' ? HISTORY_COMMON_RESOURCES
            : subject === 'Physics' ? PHYSICS_COMMON_RESOURCES
              : subject === 'Chemistry' ? CHEMISTRY_COMMON_RESOURCES
                : subject === 'Biology' ? BIOLOGY_COMMON_RESOURCES
                  : subject === 'Historia ya Tanzania na Maadili' ? HTM_COMMON_RESOURCES
                    : subject === 'Kiswahili' ? HTM_COMMON_RESOURCES
      : COMMON_RESOURCES;

// Stage text templates per method. {part} is replaced with LessonPart.part.
export interface StageText { teacher: string; learners: string }
export interface MethodTemplate { development: StageText; design: StageText; realization: StageText }

export const METHOD_TEMPLATES: Record<MethodKey, MethodTemplate> = {
  brainstorming: {
    development: { teacher: 'Guides learners to brainstorm ideas on "{part}"', learners: 'Learners share ideas and note key points' },
    design: { teacher: 'Organises learners to group and explain the ideas', learners: 'Learners organise the ideas on "{part}"' },
    realization: { teacher: 'Summarises the lesson and asks learners to conclude', learners: 'Learners state the main points of "{part}"' },
  },
  tips: {
    development: { teacher: 'Gives a question on "{part}" for learners to think and write', learners: 'Learners think and write their answers individually' },
    design: { teacher: 'Guides learners to pair and share', learners: 'Learners discuss their answers in pairs' },
    realization: { teacher: 'Invites pairs to share and summarises the lesson', learners: 'Learners share and record the summary' },
  },
  qa: {
    development: { teacher: 'Asks guiding questions on "{part}"', learners: 'Learners answer and ask questions' },
    design: { teacher: 'Gives more probing questions and explains the main points', learners: 'Learners respond and take notes' },
    realization: { teacher: 'Summarises the lesson and gives a short exercise', learners: 'Learners do the exercise and state the main points' },
  },
  smallGroups: {
    development: { teacher: 'Explains the task on "{part}" and forms small groups', learners: 'Learners join their groups and read the task' },
    design: { teacher: 'Guides groups as they work', learners: 'Learners work in groups to complete the task' },
    realization: { teacher: 'Invites groups to present and summarises the lesson', learners: 'Groups present and summarise' },
  },
  groupDiscussion: {
    development: { teacher: 'Introduces "{part}" and gives discussion questions', learners: 'Learners listen and read the questions' },
    design: { teacher: 'Moves among groups guiding the discussion', learners: 'Learners discuss in groups and record points' },
    realization: { teacher: 'Invites groups to report and summarises the lesson', learners: 'Groups report their findings' },
  },
  demonstration: {
    development: { teacher: 'Demonstrates "{part}" step by step', learners: 'Learners observe and take notes' },
    design: { teacher: 'Invites learners to repeat the demonstration', learners: 'Learners try the steps under guidance' },
    realization: { teacher: 'Summarises the lesson and corrects mistakes', learners: 'Learners state the steps and the main points' },
  },
  practical: {
    development: { teacher: 'Explains the practical task on "{part}" and shows the steps', learners: 'Learners listen and observe' },
    design: { teacher: 'Guides learners as they do the practical work', learners: 'Learners perform the practical task' },
    realization: { teacher: 'Checks learners\' work and summarises the lesson', learners: 'Learners present their work and state what they learned' },
  },
  caseStudy: {
    development: { teacher: 'Presents a case related to "{part}"', learners: 'Learners read and analyse the case' },
    design: { teacher: 'Guides learners to answer the case questions', learners: 'Learners discuss and answer the questions' },
    realization: { teacher: 'Summarises the lesson and links the case to the topic', learners: 'Learners present conclusions from the case' },
  },
  jigsaw: {
    development: { teacher: 'Divides "{part}" into sub-tasks and gives each expert group one sub-task', learners: 'Learners join expert groups and study their sub-task' },
    design: { teacher: 'Forms mixed groups and guides learners to teach each other', learners: 'Learners return to mixed groups and explain their sub-task' },
    realization: { teacher: 'Summarises the lesson and gives a short exercise', learners: 'Learners solve the exercise and state the main points' },
  },
  visual: {
    development: { teacher: 'Shows charts or drawings on "{part}" and guides learners to observe', learners: 'Learners observe and describe what they see' },
    design: { teacher: 'Guides learners to work out examples step by step', learners: 'Learners work out the examples and record the steps' },
    realization: { teacher: 'Summarises the lesson and gives an exercise', learners: 'Learners do the exercise and state the main points' },
  },
  problemSolving: {
    development: { teacher: 'Works out a model example on "{part}" and gives learners problems to solve', learners: 'Learners follow the example and note the steps' },
    design: { teacher: 'Guides learners to solve the problems in pairs or groups', learners: 'Learners solve the problems and compare answers' },
    realization: { teacher: 'Discusses the solutions, corrects mistakes and summarises the lesson', learners: 'Learners present solutions and state the main points' },
  },
  scenario: {
    development: { teacher: 'Presents a short scenario related to "{part}" and gives guiding questions', learners: 'Learners read the scenario and discuss the questions in groups' },
    design: { teacher: 'Guides groups to relate the scenario to the concepts in "{part}"', learners: 'Learners link the scenario to the concepts and record their findings' },
    realization: { teacher: 'Invites groups to share and summarises the lesson', learners: 'Groups share what they learned and note the main points' },
  },
  guestSpeaker: {
    development: { teacher: 'Introduces the guest speaker (or a recorded talk) on "{part}" and guides learners to prepare questions', learners: 'Learners listen and note key points' },
    design: { teacher: 'Guides learners to ask questions and discuss what they heard', learners: 'Learners ask questions and discuss the answers' },
    realization: { teacher: 'Guides learners to summarise the talk and links it to the topic', learners: 'Learners summarise what they learned' },
  },
  projectActivity: {
    development: { teacher: 'Explains the project task on "{part}" and forms groups', learners: 'Learners join groups and plan the project' },
    design: { teacher: 'Guides groups as they work on the project', learners: 'Learners work on the project and prepare a short report' },
    realization: { teacher: 'Invites groups to present and gives feedback', learners: 'Groups present their work and reflect on what they learned' },
  },
  skillsLab: {
    development: { teacher: 'Gives the guide and the task on "{part}" and organises groups', learners: 'Learners read the guide and share the work in groups' },
    design: { teacher: 'Guides groups as they complete the task step by step', learners: 'Learners complete their part of the task' },
    realization: { teacher: 'Invites groups to share and summarises the lesson', learners: 'Groups share their work and state the main points' },
  },
  fieldTrip: {
    development: { teacher: 'Assigns groups a place to visit (or observe) related to "{part}" and gives guiding questions', learners: 'Learners prepare their questions and observation sheets' },
    design: { teacher: 'Guides learners to record findings from the visit', learners: 'Learners record what they observe and discuss it' },
    realization: { teacher: 'Invites groups to present their findings and summarises the lesson', learners: 'Groups present findings and relate them to "{part}"' },
  },
  rolePlay: {
    development: { teacher: 'Explains the situation on "{part}" and assigns roles', learners: 'Learners prepare their roles in groups' },
    design: { teacher: 'Guides groups as they act out the situation', learners: 'Learners act out the situation' },
    realization: { teacher: 'Leads a discussion of what was learned and summarises the lesson', learners: 'Learners discuss lessons learned and state the main points' },
  },
};

// Introduction (same for every lesson)
export const INTRODUCTION: StageText = {
  teacher: 'Greets learners, checks attendance, reviews the previous lesson and introduces "{part}"',
  learners: 'Learners greet, respond to the review questions and listen to the new lesson',
};

// Stage minutes
export const STAGE_MINUTES_SINGLE = { introduction: 5, development: 15, design: 10, realization: 10 }; // 40 min
export const STAGE_MINUTES_DOUBLE = { introduction: 10, development: 40, design: 15, realization: 15 }; // 80 min

// =====================================================================================
// LUGHA YA KISWAHILI (Historia ya Tanzania na Maadili na Kiswahili).
// Masomo haya mawili tu huchapishwa kwa Kiswahili; mfumo wa andalio ni uleule. Masomo mengine yote yanabaki Kiingereza.
// =====================================================================================
export type LessonLanguage = 'en' | 'sw';

export const getLessonLanguage = (subject: LessonPart['subject'] | null | undefined): LessonLanguage =>
  subject === 'Historia ya Tanzania na Maadili' || subject === 'Kiswahili' ? 'sw' : 'en';

// Mbinu za Kiswahili zinazotumia kiolezo kimoja kimoja (ziada ya zile 17 za kawaida).
export const METHOD_TEMPLATES_SW: Record<SwMethodKey, MethodTemplate> = {
  brainstorming: {
    development: { teacher: 'Huongoza wanafunzi kubungua bongo kuhusu "{part}"', learners: 'Wanafunzi hutoa mawazo na kuandika hoja muhimu' },
    design: { teacher: 'Huwaelekeza wanafunzi kupanga na kuelezea mawazo yao', learners: 'Wanafunzi hupanga mawazo kuhusu "{part}"' },
    realization: { teacher: 'Hufanya muhtasari wa kipindi na kuwaongoza wanafunzi kutoa hitimisho', learners: 'Wanafunzi hueleza hoja kuu za "{part}"' },
  },
  tips: {
    development: { teacher: 'Hutoa swali kuhusu "{part}" ili wanafunzi wafikiri na kuandika', learners: 'Wanafunzi hufikiri na kuandika majibu yao binafsi' },
    design: { teacher: 'Huwaongoza wanafunzi kukaa katika jozi na kushirikishana majibu', learners: 'Wanafunzi hujadili majibu yao katika jozi' },
    realization: { teacher: 'Huwaalika wanafunzi kushirikisha darasa na kufanya muhtasari wa kipindi', learners: 'Wanafunzi hushirikisha darasa na kuandika muhtasari' },
  },
  qa: {
    development: { teacher: 'Huuliza maswali elekezi kuhusu "{part}"', learners: 'Wanafunzi hujibu na kuuliza maswali' },
    design: { teacher: 'Huuliza maswali ya kuchochea fikra na kufafanua hoja kuu', learners: 'Wanafunzi hujibu na kuandika madokezo' },
    realization: { teacher: 'Hufanya muhtasari wa kipindi na kutoa zoezi fupi', learners: 'Wanafunzi hufanya zoezi na kueleza hoja kuu' },
  },
  smallGroups: {
    development: { teacher: 'Hueleza kazi kuhusu "{part}" na kuunda vikundi vidogovidogo', learners: 'Wanafunzi hujiunga na vikundi vyao na kusoma kazi' },
    design: { teacher: 'Huwaongoza wanafunzi wanapofanya kazi kwenye vikundi', learners: 'Wanafunzi hufanya kazi kwenye vikundi kukamilisha kazi' },
    realization: { teacher: 'Huwaalika vikundi kuwasilisha na kufanya muhtasari wa kipindi', learners: 'Vikundi huwasilisha na kutoa muhtasari' },
  },
  groupDiscussion: {
    development: { teacher: 'Hutambulisha "{part}" na kutoa maswali ya majadiliano', learners: 'Wanafunzi husikiliza na kusoma maswali' },
    design: { teacher: 'Hupita kwenye vikundi kuongoza majadiliano', learners: 'Wanafunzi hujadili kwenye vikundi na kuandika hoja' },
    realization: { teacher: 'Huwaalika vikundi kutoa taarifa na kufanya muhtasari wa kipindi', learners: 'Vikundi huwasilisha matokeo ya majadiliano' },
  },
  demonstration: {
    development: { teacher: 'Huonesha "{part}" hatua kwa hatua', learners: 'Wanafunzi huangalia na kuandika madokezo' },
    design: { teacher: 'Huwaalika wanafunzi kurudia ulichoonesha', learners: 'Wanafunzi hujaribu hatua chini ya uongozi' },
    realization: { teacher: 'Hufanya muhtasari wa kipindi na kusahihisha makosa', learners: 'Wanafunzi hueleza hatua na hoja kuu' },
  },
  practical: {
    development: { teacher: 'Hueleza kazi ya vitendo kuhusu "{part}" na kuonesha hatua', learners: 'Wanafunzi husikiliza na kuangalia' },
    design: { teacher: 'Huwaongoza wanafunzi wanapofanya kazi ya vitendo', learners: 'Wanafunzi hufanya kazi ya vitendo' },
    realization: { teacher: 'Hukagua kazi za wanafunzi na kufanya muhtasari wa kipindi', learners: 'Wanafunzi huwasilisha kazi zao na kueleza walichojifunza' },
  },
  caseStudy: {
    development: { teacher: 'Huwasilisha kisa mafunzo kinachohusiana na "{part}"', learners: 'Wanafunzi husoma na kuchambua kisa mafunzo' },
    design: { teacher: 'Huwaongoza wanafunzi kujibu maswali ya kisa mafunzo', learners: 'Wanafunzi hujadili na kujibu maswali' },
    realization: { teacher: 'Hufanya muhtasari wa kipindi na kuhusisha kisa na mada', learners: 'Wanafunzi huwasilisha hitimisho kutokana na kisa' },
  },
  jigsaw: {
    development: { teacher: 'Hugawa "{part}" katika sehemu ndogo na kukipa kila kikundi cha wataalamu sehemu moja', learners: 'Wanafunzi hujiunga na vikundi vya wataalamu na kusoma sehemu yao' },
    design: { teacher: 'Huunda vikundi vilivyochanganywa na kuwaongoza wanafunzi kufundishana', learners: 'Wanafunzi hurudi kwenye vikundi vilivyochanganywa na kufundisha wenzao walichojifunza' },
    realization: { teacher: 'Hufanya muhtasari wa kipindi na kutoa zoezi fupi', learners: 'Wanafunzi hufanya zoezi na kueleza hoja kuu' },
  },
  visual: {
    development: { teacher: 'Huonesha chati au picha kuhusu "{part}" na kuwaongoza wanafunzi kuangalia', learners: 'Wanafunzi huangalia na kueleza wanachokiona' },
    design: { teacher: 'Huwaongoza wanafunzi kuchambua mifano hatua kwa hatua', learners: 'Wanafunzi huchambua mifano na kuandika hatua' },
    realization: { teacher: 'Hufanya muhtasari wa kipindi na kutoa zoezi', learners: 'Wanafunzi hufanya zoezi na kueleza hoja kuu' },
  },
  problemSolving: {
    development: { teacher: 'Hufanya mfano elekezi kuhusu "{part}" na kutoa matatizo ya kutatua', learners: 'Wanafunzi hufuata mfano na kuandika hatua' },
    design: { teacher: 'Huwaongoza wanafunzi kutatua matatizo kwa jozi au vikundi', learners: 'Wanafunzi hutatua matatizo na kulinganisha majibu' },
    realization: { teacher: 'Hujadili majibu, husahihisha makosa na kufanya muhtasari wa kipindi', learners: 'Wanafunzi huwasilisha majibu na kueleza hoja kuu' },
  },
  scenario: {
    development: { teacher: 'Huwasilisha mazingira mafupi yanayohusiana na "{part}" na kutoa maswali elekezi', learners: 'Wanafunzi husoma mazingira na kujadili maswali kwenye vikundi' },
    design: { teacher: 'Huwaongoza vikundi kuhusisha mazingira hayo na dhana za "{part}"', learners: 'Wanafunzi huhusisha mazingira na dhana na kuandika waliyoyabaini' },
    realization: { teacher: 'Huwaalika vikundi kushirikisha na kufanya muhtasari wa kipindi', learners: 'Vikundi hushirikisha walichojifunza na kuandika hoja kuu' },
  },
  guestSpeaker: {
    development: { teacher: 'Humtambulisha mtaalamu mwalikwa (au mada iliyorekodiwa) kuhusu "{part}" na kuwaongoza wanafunzi kuandaa maswali', learners: 'Wanafunzi husikiliza na kuandika hoja muhimu' },
    design: { teacher: 'Huwaongoza wanafunzi kuuliza maswali na kujadili walichosikia', learners: 'Wanafunzi huuliza maswali na kujadili majibu' },
    realization: { teacher: 'Huwaongoza wanafunzi kufanya muhtasari wa mada na kuihusisha na mada ya kipindi', learners: 'Wanafunzi hufanya muhtasari wa walichojifunza' },
  },
  projectActivity: {
    development: { teacher: 'Hueleza kazi ya mradi kuhusu "{part}" na kuunda vikundi', learners: 'Wanafunzi hujiunga na vikundi na kupanga mradi' },
    design: { teacher: 'Huwaongoza vikundi wanapofanya mradi', learners: 'Wanafunzi hufanya mradi na kuandaa taarifa fupi' },
    realization: { teacher: 'Huwaalika vikundi kuwasilisha na kutoa mrejesho', learners: 'Vikundi huwasilisha kazi zao na kutafakari walichojifunza' },
  },
  skillsLab: {
    development: { teacher: 'Hutoa mwongozo na kazi kuhusu "{part}" na kuunda vikundi', learners: 'Wanafunzi husoma mwongozo na kugawana kazi kwenye vikundi' },
    design: { teacher: 'Huwaongoza vikundi kukamilisha kazi hatua kwa hatua', learners: 'Wanafunzi hukamilisha sehemu yao ya kazi' },
    realization: { teacher: 'Huwaalika vikundi kushirikisha na kufanya muhtasari wa kipindi', learners: 'Vikundi hushirikisha kazi zao na kueleza hoja kuu' },
  },
  fieldTrip: {
    development: { teacher: 'Hugawa vikundi mahali pa kutembelea (au kuchunguza) kuhusiana na "{part}" na kutoa maswali elekezi', learners: 'Wanafunzi huandaa maswali na fomu za uchunguzi' },
    design: { teacher: 'Huwaongoza wanafunzi kuandika matokeo ya ziara', learners: 'Wanafunzi huandika wanachokiona na kujadili' },
    realization: { teacher: 'Huwaalika vikundi kuwasilisha matokeo na kufanya muhtasari wa kipindi', learners: 'Vikundi huwasilisha matokeo na kuyahusisha na "{part}"' },
  },
  rolePlay: {
    development: { teacher: 'Hueleza hali husika kuhusu "{part}" na kugawa majukumu', learners: 'Wanafunzi hujiandaa na majukumu yao kwenye vikundi' },
    design: { teacher: 'Huwaongoza vikundi wanapoigiza hali hiyo', learners: 'Wanafunzi huigiza hali hiyo' },
    realization: { teacher: 'Huongoza mjadala wa yaliyojifunzwa na kufanya muhtasari wa kipindi', learners: 'Wanafunzi hujadili mafunzo na kueleza hoja kuu' },
  },
  research: {
    development: { teacher: 'Huelekeza wanafunzi kusoma matini kutoka vyanzo mbalimbali kuhusu "{part}"', learners: 'Wanafunzi husoma matini na kuandika maelezo mafupi' },
    design: { teacher: 'Huwaongoza wanafunzi kujadili walichokipata kwenye vikundi', learners: 'Wanafunzi hujadili na kulinganisha maelezo yao' },
    realization: { teacher: 'Huwaalika vikundi kuwasilisha matokeo na kufanya muhtasari wa kipindi', learners: 'Wanafunzi huwasilisha matokeo na kueleza hoja kuu' },
  },
  gallery: {
    development: { teacher: 'Huelekeza wanafunzi kuandaa na kubandika kazi zao kuhusu "{part}" kwenye kuta za darasa', learners: 'Wanafunzi huandaa na kubandika kazi zao' },
    design: { teacher: 'Huwaongoza wanafunzi kufanya matembezi na kuuliza maswali kwenye vikundi', learners: 'Wanafunzi hutembelea kazi za vikundi vingine, huuliza maswali na kuandika maoni' },
    realization: { teacher: 'Huongoza majadiliano ya darasa na kufanya muhtasari wa kipindi', learners: 'Wanafunzi hurekebisha kazi zao na kueleza walichojifunza' },
  },
  debate: {
    development: { teacher: 'Hugawa darasa katika makundi mawili na kutoa hoja ya mdahalo kuhusu "{part}"', learners: 'Wanafunzi hujiandaa kutetea au kupinga hoja' },
    design: { teacher: 'Husimamia mdahalo na kuhakikisha kila upande unapata nafasi', learners: 'Wanafunzi hutoa hoja na kujibu hoja za upande wa pili' },
    realization: { teacher: 'Hufanya muhtasari wa hoja zilizotolewa na kutoa hitimisho', learners: 'Wanafunzi hueleza walichojifunza kutokana na mdahalo' },
  },
  reflection: {
    development: { teacher: 'Huuliza maswali ya kuwafanya wanafunzi kutafakari kuhusu "{part}"', learners: 'Wanafunzi hutafakari na kuandika mawazo yao' },
    design: { teacher: 'Huwaongoza wanafunzi kushirikishana mawazo na kutoa maoni', learners: 'Wanafunzi hushirikishana mawazo na kutoa maoni yao' },
    realization: { teacher: 'Hufanya muhtasari na kuwaongoza wanafunzi kupendekeza suluhisho', learners: 'Wanafunzi hueleza hitimisho na mapendekezo yao' },
  },
};

export const INTRODUCTION_SW: StageText = {
  teacher: 'Huwasalimia wanafunzi, huhakiki mahudhurio, hupitia kipindi kilichopita na kutambulisha "{part}"',
  learners: 'Wanafunzi huitikia salamu, hujibu maswali ya marudio na kusikiliza mada mpya',
};

export const STAGE_NAMES_SW = {
  introduction: 'UTANGULIZI',
  development: 'KUENDELEZA UJENZI WA UMAHIRI',
  design: 'KUBUNI',
  realization: 'TATHMINI',
};

// Kiolezo cha hatua kulingana na lugha ya somo.
export const getMethodTemplate = (language: LessonLanguage, method: SwMethodKey): MethodTemplate =>
  language === 'sw' ? METHOD_TEMPLATES_SW[method] : METHOD_TEMPLATES[method as MethodKey];

export const NO_REMARK_OPTIONS = ['No remark (leave blank lines)', 'Hakuna maoni (acha mistari tupu)'];

export const buildRemarkOptionsSw = (part: LessonPart): string[] => {
  const skill = part.specificActivities[0] ?? '';
  const lowercaseSkill = skill ? `${skill[0].toLowerCase()}${skill.slice(1)}` : '';

  return [
    `Kipindi kilifanikiwa. Wanafunzi wengi waliweza ${lowercaseSkill}.`,
    `Kipindi kilifanikiwa kwa kiasi. Baadhi ya wanafunzi wanahitaji mazoezi zaidi kuhusu "${part.part}"; marudio mafupi yatafanyika katika kipindi kijacho.`,
    `Kipindi hakikukamilika kama kilivyopangwa kwa sababu ya muda au zana kutotosha. "${part.part}" utaendelezwa katika kipindi kijacho.`,
    NO_REMARK_OPTIONS[1],
  ];
};

export const getRemarkOptions = (language: LessonLanguage, part: LessonPart): string[] =>
  language === 'sw' ? buildRemarkOptionsSw(part) : buildRemarkOptions(part);
