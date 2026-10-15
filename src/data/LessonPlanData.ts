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
  | 'caseStudy';

export const METHOD_LABELS: Record<MethodKey, string> = {
  brainstorming: 'Brainstorming',
  tips: 'Think-Ink-Pair-Share (TIPS)',
  qa: 'Question and answer',
  smallGroups: 'Small groups',
  groupDiscussion: 'Group discussion',
  demonstration: 'Demonstration',
  practical: 'Practical work',
  caseStudy: 'Case study',
};

export interface SyllabusUnit {
  mainCompetence: string;
  specificCompetence: string;
  mainActivity: string;
  methods: MethodKey[];
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
  form: 1 | 2;
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
const P = (form: 1 | 2, topic: string, subtopic: string, part: string, unit: string, ...specificActivities: string[]): LessonPart =>
  ({ id: `f${form}-${++_n}`, form, topic, subtopic, part, unit, specificActivities });

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

// References: fill from the copyright page of each book.
export const REFERENCES: Record<1 | 2, string> = {
  1: "Tanzania Institute of Education. (2023). Computer Science for secondary schools student's book, form one. Tanzania Institute of Education.",
  2: "Tanzania Institute of Education. (2023). Computer Science for secondary schools student's book, form two. Tanzania Institute of Education.",
};

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
};

// Introduction (same for every lesson)
export const INTRODUCTION: StageText = {
  teacher: 'Greets learners, checks attendance, reviews the previous lesson and introduces "{part}"',
  learners: 'Learners greet, respond to the review questions and listen to the new lesson',
};

// Stage minutes
export const STAGE_MINUTES_SINGLE = { introduction: 5, development: 15, design: 10, realization: 10 }; // 40 min
export const STAGE_MINUTES_DOUBLE = { introduction: 10, development: 40, design: 15, realization: 15 }; // 80 min