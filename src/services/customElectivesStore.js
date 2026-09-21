// Custom Electives & Personalized Lesson Store
// Enables parents and teachers to add custom subjects into any learner's homeschool schedule

const STORAGE_KEY = 'somahome_custom_electives_v1';

export const ELECTIVE_PRESETS = [
  {
    name: 'Scratch Coding & Robotics',
    category: 'STEM & Tech',
    timeSlot: '02:00 PM - 02:45 PM',
    duration: 45,
    icon: '💻',
    topic: 'Building an Interactive Maze Game in Scratch 3.0',
    parentScript: 'Today we become software engineers! Open Scratch and let us create a sprite that navigates a colorful maze using arrow key events.',
    learningObjective: 'Understand coordinate positions (X, Y) and program event listeners for keyboard arrow inputs.',
    materials: ['Laptop / Tablet with Scratch 3.0', 'Graph paper maze sketch'],
    activity: '1. Sketch maze on graph paper.\n2. Create Player sprite and Goal sprite.\n3. Add script: When Green Flag Clicked -> Forever If Key Pressed -> Change X/Y.',
    worksheet: 'Scratch Coding Quest #1',
    isLab: true,
    hasPhoto: true
  },
  {
    name: 'Conversational French (DELF Prim A1)',
    category: 'Foreign Languages',
    timeSlot: '01:30 PM - 02:15 PM',
    duration: 45,
    icon: '🇫🇷',
    topic: 'Les Salutations et Les Animaux Domestiques',
    parentScript: 'Bonjour! Let us practice greeting each other in French and naming our favourite pets: le chien, le chat, et le lapin.',
    learningObjective: 'Pronounce French greetings (Bonjour, Bonsoir, Au revoir) and identify 5 common domestic animals.',
    materials: ['French picture flashcards', 'Audio pronunciation player'],
    activity: '1. Listen and repeat French greeting dialogue.\n2. Match animal cards with French names.\n3. Sing the Bonjour Song together.',
    worksheet: 'French Discovery Sheet #1',
    isLab: false,
    hasPhoto: false
  },
  {
    name: 'Piano & Music Theory (ABRSM)',
    category: 'Creative Arts',
    timeSlot: '03:00 PM - 03:45 PM',
    duration: 45,
    icon: '🎹',
    topic: 'Treble Clef Notes & Middle C Fingering',
    parentScript: 'Place your right thumb curved gently on Middle C like holding an egg. Let us play C-D-E in steady 4/4 beats.',
    learningObjective: 'Locate Middle C on keyboard, identify treble clef lines/spaces (E-G-B-D-F), and play steady quarter notes.',
    materials: ['Keyboard / Piano or Piano app', 'Music manuscript book'],
    activity: '1. Finger warm-up exercises on 5 keys.\n2. Sight-read 4-measure melody on sheet music.\n3. Clap and count rhythm in 4/4 time.',
    worksheet: 'Treble Clef Note Speller #1',
    isLab: false,
    hasPhoto: false
  },
  {
    name: 'Taekwondo & Physical Fitness',
    category: 'Sports & Movement',
    timeSlot: '04:00 PM - 04:45 PM',
    duration: 45,
    icon: '🥋',
    topic: 'Front Snap Kick (Ap Chagi) & Horse Riding Stance',
    parentScript: 'Breathe deeply and bow respectfully (Charyeot, Gyeongnye). Let us build balance, core strength, and discipline!',
    learningObjective: 'Demonstrate balance in walking stance and execute 10 controlled front snap kicks with proper chambering.',
    materials: ['Workout mat / carpet', 'Focus target pad / soft cushion'],
    activity: '1. 5-minute dynamic joint warm-up.\n2. Practice chambering knee for Ap Chagi.\n3. 3 sets of 10 target kicks on cushion.',
    worksheet: 'Martial Arts Discipline Log',
    isLab: true,
    hasPhoto: true
  },
  {
    name: 'Chess & Strategic Thinking',
    category: 'Logic & Mind Sports',
    timeSlot: '03:30 PM - 04:15 PM',
    duration: 45,
    icon: '♟️',
    topic: 'Knight Forks & Controlling the Center 4 Squares',
    parentScript: 'In chess, control of the 4 central squares (e4, d4, e5, d5) determines the battle. Let us discover the tricky L-shape Knight fork!',
    learningObjective: 'Explain relative piece values and identify 2-piece Knight fork opportunities on the board.',
    materials: ['Chess set (board and 32 pieces)', 'Chess puzzle sheet'],
    activity: '1. Setup standard board correctly (White on right).\n2. Solve 3 tactical Knight fork puzzles.\n3. Play a 15-minute friendly game with focus on center control.',
    worksheet: 'Chess Tactics Puzzle Sheet #1',
    isLab: false,
    hasPhoto: false
  }
];

export const customElectivesStore = {
  getAll() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) return JSON.parse(data);
    } catch (e) {}

    // Default pre-seeded custom electives
    return [
      {
        id: 'elec_1',
        studentId: 'liam',
        dayNumber: 3, // Wednesday
        name: 'Scratch Coding & Robotics',
        category: 'STEM & Tech',
        timeSlot: '02:00 PM - 02:45 PM',
        duration: 45,
        topic: 'Building an Interactive Maze Game in Scratch 3.0',
        parentScript: 'Today we become software engineers! Open Scratch and let us create a sprite that navigates a colorful maze using arrow keys.',
        learningObjective: 'Understand coordinate positions (X, Y) and program event listeners for keyboard arrow inputs.',
        materials: ['Laptop / Tablet with Scratch', 'Graph paper maze sketch'],
        activity: '1. Sketch maze on graph paper.\n2. Create Player sprite and Goal sprite.\n3. Program arrow key movement blocks.',
        worksheet: 'Scratch Coding Quest #1',
        isLab: true,
        hasPhoto: true
      },
      {
        id: 'elec_2',
        studentId: 'liam',
        dayNumber: 5, // Friday
        name: 'Taekwondo & Physical Fitness',
        category: 'Sports & Movement',
        timeSlot: '04:00 PM - 04:45 PM',
        duration: 45,
        topic: 'Front Snap Kick & Balance Posture',
        parentScript: 'Breathe deeply and bow respectfully. Let us build core agility, balance, and focus!',
        learningObjective: 'Execute 10 controlled front snap kicks with proper knee chambering.',
        materials: ['Workout mat', 'Soft cushion for target practice'],
        activity: '1. 5-min dynamic warm-up.\n2. Practice balance stance.\n3. 3 sets of 10 target kicks on cushion.',
        worksheet: 'Fitness Discipline Log',
        isLab: true,
        hasPhoto: true
      }
    ];
  },

  getForStudentAndDay(studentId = 'liam', dayNumber = 3) {
    return this.getAll().filter(e => e.studentId === studentId && Number(e.dayNumber) === Number(dayNumber));
  },

  addElective(electiveData) {
    const all = this.getAll();
    const newElective = {
      ...electiveData,
      id: 'elec_' + Date.now().toString()
    };
    all.push(newElective);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
      window.dispatchEvent(new CustomEvent('custom_electives_updated', { detail: newElective }));
    } catch (e) {}
    return newElective;
  },

  deleteElective(electiveId) {
    let all = this.getAll();
    all = all.filter(e => e.id !== electiveId);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
      window.dispatchEvent(new CustomEvent('custom_electives_updated'));
    } catch (e) {}
    return all;
  }
};
