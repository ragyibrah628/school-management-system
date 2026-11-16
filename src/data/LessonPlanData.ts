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
  subject: 'Computer Science' | 'Mathematics' | 'Business Studies';
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

// References: fill from the copyright page of each book.
export const REFERENCES: Record<1 | 2, string> = {
  1: "Tanzania Institute of Education. (2023). Computer Science for secondary schools student's book, form one. Tanzania Institute of Education.",
  2: "Tanzania Institute of Education. (2023). Computer Science for secondary schools student's book, form two. Tanzania Institute of Education.",
};

// TODO (Mr. Kijida): check the exact book title and year on the copyright page of the Mathematics book.
export const MATH_REFERENCES: Partial<Record<1 | 2 | 3 | 4, string>> = {
  1: "Tanzania Institute of Education. (2023). Mathematics for secondary schools student's book, form one. Tanzania Institute of Education.",
  2: "Tanzania Institute of Education. (2023). Mathematics for secondary schools student's book, form two. Tanzania Institute of Education.",
  3: "Tanzania Institute of Education. (2023). Mathematics for secondary schools student's book, form three. Tanzania Institute of Education.",
};

// TODO (Mr. Kijida): check the exact book titles on the copyright page of the Business Studies books.
export const BUSINESS_REFERENCES: Partial<Record<1 | 2 | 3 | 4, string>> = {
  1: "Tanzania Institute of Education. (2023). Business studies for secondary schools student's book, form one. Tanzania Institute of Education.",
  2: "Tanzania Institute of Education. (2024). Business studies for secondary schools student's book, form two. Tanzania Institute of Education.",
  3: "Tanzania Institute of Education. (2025). Business studies for secondary schools student's book, form three. Tanzania Institute of Education.",
};

export const getReference = (subject: LessonPart['subject'], form: number): string => {
  if (subject === 'Mathematics') return MATH_REFERENCES[form as 1 | 2 | 3 | 4] ?? '';
  if (subject === 'Business Studies') return BUSINESS_REFERENCES[form as 1 | 2 | 3 | 4] ?? '';
  return REFERENCES[form as 1 | 2] ?? '';
};

// Maps the subject name used in the timetable to the subject of the lesson-plan data.
export const resolveLessonSubject = (name: string): LessonPart['subject'] | null => {
  const value = name.toLowerCase();
  if (value.includes('computer')) return 'Computer Science';
  if (/math/.test(value)) return 'Mathematics';
  if (/business/.test(value)) return 'Business Studies';
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
