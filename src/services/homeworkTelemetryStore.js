// SomaHome Homework & Student Activity Telemetry Store

const HOMEWORK_STORAGE_KEY = 'somahome_homework_store_v1';
const TELEMETRY_STORAGE_KEY = 'somahome_telemetry_store_v1';

const INITIAL_HOMEWORK = [
  {
    id: 'HW-101',
    title: 'CBC Math: Calculating Irregular Kitchen Garden Perimeters',
    subject: 'Mathematics',
    curriculum: 'CBC Grade 4',
    teacherName: 'Teacher Mercy Wanjiku',
    teacherAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200',
    studentName: 'Liam Kiprop',
    assignedDate: 'March 15, 2026',
    dueDate: 'Today at 5:00 PM',
    status: 'submitted', // 'assigned' | 'submitted' | 'graded'
    instructions: 'Measure the irregular rectangular garden plot shown in Week 3 Worksheet. Calculate compound perimeters and show work step-by-step.',
    maxPoints: 100,
    studentSubmission: {
      text: 'Calculated using perimeter formula 2(L + W). For compound section: Plot A (14.5m x 8.2m) = 45.4m. Extension section (4m x 3m) = 14m. Total outer boundary minus joined wall = 53.4 meters.',
      submittedAt: 'Today, 10:15 AM',
      attachmentName: 'liam_garden_perimeter_calc.jpg'
    },
    grade: null,
    rubricLevel: null,
    feedback: null,
    markedAt: null
  },
  {
    id: 'HW-102',
    title: 'Science Lab: Multi-Layer Charcoal & Sand Water Purifier Report',
    subject: 'Science & Technology',
    curriculum: 'CBC Grade 4',
    teacherName: 'Teacher Mercy Wanjiku',
    teacherAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200',
    studentName: 'Liam Kiprop',
    assignedDate: 'March 13, 2026',
    dueDate: 'March 14, 2026',
    status: 'graded',
    instructions: 'Build the 4-layer mechanical water purifier from your kitchen lab kit. Record the water clarity before and after filtration.',
    maxPoints: 100,
    studentSubmission: {
      text: 'Layered gravel at top, fine river sand, crushed charcoal in middle, and sterile cotton at spout. Murky mud water from the balcony became visually clear within 3 minutes.',
      submittedAt: 'March 14, 2:30 PM',
      attachmentName: 'water_filtration_layers.png'
    },
    grade: '96%',
    rubricLevel: 'Level 4 - Exceeding Expectations (EE)',
    feedback: 'Exceptional scientific method Liam! Your explanation of how porous activated charcoal adsorbs organic particles was spot-on. Officially certified for your CBC transcript.',
    markedAt: 'March 14, 4:45 PM'
  },
  {
    id: 'HW-103',
    title: 'Kiswahili Mufti: Kutunga Sentensi za Ngeli ya A-WA na Upatanisho',
    subject: 'Kiswahili',
    curriculum: 'CBC Grade 4',
    teacherName: 'Mwalimu Kevin M.',
    teacherAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
    studentName: 'Liam Kiprop',
    assignedDate: 'March 16, 2026',
    dueDate: 'Tomorrow at 4:00 PM',
    status: 'assigned',
    instructions: 'Tunga sentensi tano (5) ukitumia nomino katika ngeli ya A-WA (mfano: Mwanafunzi, Walimu, Wageni) ukizingatia upatanisho sahihi wa viambishi katika wakati uliopita na wakati uliopo.',
    maxPoints: 50,
    studentSubmission: null,
    grade: null,
    rubricLevel: null,
    feedback: null,
    markedAt: null
  }
];

const INITIAL_TELEMETRY = {
  studentName: 'Liam Kiprop',
  grade: 'Grade 4 CBC',
  date: 'Today (Wednesday, March 16, 2026)',
  totalActiveMinutes: 195, // 3h 15m
  targetStatutoryMinutes: 180, // 3h statutory
  focusEfficiency: 94, // 94% active focus
  idleMinutes: 12,
  subjectBreakdown: [
    { subject: 'Science & Lab', minutes: 55, color: '#10B981', percentage: 28 },
    { subject: 'Mathematics', minutes: 50, color: '#38BDF8', percentage: 26 },
    { subject: 'English Reading Room', minutes: 35, color: '#F59E0B', percentage: 18 },
    { subject: 'Live Classroom Whiteboard', minutes: 30, color: '#A855F7', percentage: 15 },
    { subject: 'Kiswahili Mufti', minutes: 25, color: '#EC4899', percentage: 13 }
  ],
  timeline: [
    { time: '08:30 AM - 09:10 AM', activity: 'Math Fraction Chapati Puzzle Quest', subject: 'Mathematics', duration: '40 mins', icon: '📐', status: 'Completed' },
    { time: '09:20 AM - 09:55 AM', activity: 'Read Honeyguide Bird & Boy Story with Audio', subject: 'English Reading Room', duration: '35 mins', icon: '📖', status: 'Completed' },
    { time: '10:00 AM - 10:30 AM', activity: 'Live Classroom: Whiteboard on Separation of Matter', subject: 'Live Classroom', duration: '30 mins', icon: '📹', status: 'Attended' },
    { time: '10:45 AM - 11:40 AM', activity: 'Kitchen Science Evaporation & Salinity Experiment', subject: 'Science & Lab', duration: '55 mins', icon: '🔬', status: 'Completed' },
    { time: '11:45 AM - 12:10 PM', activity: 'Kiswahili Ngeli Upatanisho Quiz Arcade', subject: 'Kiswahili', duration: '25 mins', icon: '🎮', status: 'Completed' },
    { time: '12:15 PM - 12:25 PM', activity: 'Submitted Homework HW-101 to Teacher Mercy', subject: 'Homework Portal', duration: '10 mins', icon: '📝', status: 'Submitted' }
  ],
  weeklySummary: [
    { day: 'Mon', minutes: 185, target: 180 },
    { day: 'Tue', minutes: 190, target: 180 },
    { day: 'Wed (Today)', minutes: 195, target: 180 },
    { day: 'Thu', minutes: 0, target: 180 },
    { day: 'Fri', minutes: 0, target: 180 }
  ]
};

export const homeworkService = {
  getAll: () => {
    try {
      const saved = localStorage.getItem(HOMEWORK_STORAGE_KEY);
      return saved ? JSON.parse(saved) : INITIAL_HOMEWORK;
    } catch {
      return INITIAL_HOMEWORK;
    }
  },

  create: (newHw) => {
    const list = homeworkService.getAll();
    const created = {
      ...newHw,
      id: `HW-${Math.floor(100 + Math.random() * 900)}`,
      assignedDate: 'Today',
      status: 'assigned',
      studentSubmission: null,
      grade: null,
      rubricLevel: null,
      feedback: null,
      markedAt: null
    };
    const updated = [created, ...list];
    localStorage.setItem(HOMEWORK_STORAGE_KEY, JSON.stringify(updated));
    return created;
  },

  submit: (id, submissionText, attachmentName = null) => {
    const list = homeworkService.getAll();
    const updated = list.map(item => {
      if (item.id === id) {
        return {
          ...item,
          status: 'submitted',
          studentSubmission: {
            text: submissionText,
            submittedAt: 'Just now',
            attachmentName: attachmentName || 'student_handwritten_solution.jpg'
          }
        };
      }
      return item;
    });
    localStorage.setItem(HOMEWORK_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  },

  mark: (id, grade, rubricLevel, feedback) => {
    const list = homeworkService.getAll();
    const updated = list.map(item => {
      if (item.id === id) {
        return {
          ...item,
          status: 'graded',
          grade,
          rubricLevel,
          feedback,
          markedAt: 'Just now'
        };
      }
      return item;
    });
    localStorage.setItem(HOMEWORK_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  }
};

export const telemetryService = {
  getTelemetry: (studentName = 'Liam Kiprop') => {
    try {
      const saved = localStorage.getItem(TELEMETRY_STORAGE_KEY);
      return saved ? JSON.parse(saved) : INITIAL_TELEMETRY;
    } catch {
      return INITIAL_TELEMETRY;
    }
  },

  logActiveSession: (activity, subject, minutes, icon = '⚡') => {
    const current = telemetryService.getTelemetry();
    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newEntry = {
      time: `${nowStr}`,
      activity,
      subject,
      duration: `${minutes} mins`,
      icon,
      status: 'Completed'
    };

    const updated = {
      ...current,
      totalActiveMinutes: current.totalActiveMinutes + minutes,
      timeline: [newEntry, ...current.timeline]
    };

    localStorage.setItem(TELEMETRY_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  }
};
export const bookingsService = {
  getAll: () => {
    try {
      const saved = localStorage.getItem('somahome_client_bookings_v2');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      {
        id: 'BKG-9102',
        tutorName: 'Teacher Mercy Cherono',
        studentName: 'Liam Kariuki (Grade 4 CBC)',
        date: 'Today',
        timeSlot: '10:00 AM - 11:30 AM',
        sessionType: 'virtual',
        focusSubject: 'Grade 4 CBC Mathematics: Fractions & Decimals',
        status: 'Confirmed',
        amount: 3000,
        isLiveNow: true,
        tutorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200'
      }
    ];
  },

  addBooking: (booking) => {
    try {
      const current = bookingsService.getAll();
      const next = [booking, ...current.filter(b => b.id !== booking.id)];
      localStorage.setItem('somahome_client_bookings_v2', JSON.stringify(next));
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('somahome_bookings_updated', { detail: next }));
      }
      return next;
    } catch {
      return [];
    }
  },

  getForStudent: (studentName = 'Liam') => {
    try {
      const all = bookingsService.getAll();
      const studentLower = studentName.toLowerCase().split(' ')[0];
      const matched = all.filter(b => 
        b.studentName?.toLowerCase().includes(studentLower) && b.status !== 'Cancelled'
      );
      if (matched.length > 0) {
        return matched.map(b => ({
          ...b,
          isLiveNow: true,
          tutorAvatar: b.tutorAvatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200'
        }));
      }
    } catch {}
    
    return [
      {
        id: 'BKG-9102',
        tutorName: 'Teacher Mercy Cherono',
        studentName: 'Liam Kariuki (Grade 4 CBC)',
        date: 'Today',
        timeSlot: '10:00 AM - 11:30 AM',
        sessionType: 'virtual',
        focusSubject: 'Grade 4 CBC Mathematics: Fractions & Decimals',
        status: 'Confirmed',
        amount: 3000,
        isLiveNow: true,
        tutorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200'
      }
    ];
  },

  getForTeacher: (teacherName = 'Mercy') => {
    try {
      const all = bookingsService.getAll();
      const teacherLower = teacherName.toLowerCase();
      const matched = all.filter(b => 
        (b.tutorName?.toLowerCase().includes(teacherLower) || !b.tutorName) && b.status !== 'Cancelled'
      );
      if (matched.length > 0) return matched;
      return all.filter(b => b.status !== 'Cancelled');
    } catch {
      return [];
    }
  }
};