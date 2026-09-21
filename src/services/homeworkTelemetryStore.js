// homeworkTelemetryStore.js - Real Live Store for SomaHome (Clean 0-Mock State)
const HOMEWORK_STORAGE_KEY = 'somahome_homework_store_v2';
const TELEMETRY_STORAGE_KEY = 'somahome_telemetry_store_v2';
const BOOKINGS_STORAGE_KEY = 'somahome_client_bookings_v2';

const INITIAL_HOMEWORK = [];

const INITIAL_TELEMETRY = {
  studentName: '',
  grade: '',
  date: 'Today',
  totalActiveMinutes: 0,
  targetStatutoryMinutes: 180,
  focusEfficiency: 0,
  idleMinutes: 0,
  subjectBreakdown: [],
  timeline: [],
  weeklySummary: [
    { day: 'Mon', minutes: 0, target: 180 },
    { day: 'Tue', minutes: 0, target: 180 },
    { day: 'Wed', minutes: 0, target: 180 },
    { day: 'Thu', minutes: 0, target: 180 },
    { day: 'Fri', minutes: 0, target: 180 }
  ]
};

export const homeworkService = {
  getAll: () => {
    try {
      const saved = localStorage.getItem(HOMEWORK_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
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
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('somahome_homework_updated', { detail: updated }));
    }
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
            attachmentName: attachmentName || 'student_solution.jpg'
          }
        };
      }
      return item;
    });
    localStorage.setItem(HOMEWORK_STORAGE_KEY, JSON.stringify(updated));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('somahome_homework_updated', { detail: updated }));
    }
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
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('somahome_homework_updated', { detail: updated }));
    }
    return updated;
  }
};

export const telemetryService = {
  getTelemetry: (studentName = '') => {
    try {
      const saved = localStorage.getItem(TELEMETRY_STORAGE_KEY);
      return saved ? JSON.parse(saved) : { ...INITIAL_TELEMETRY, studentName };
    } catch {
      return { ...INITIAL_TELEMETRY, studentName };
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
      totalActiveMinutes: (current.totalActiveMinutes || 0) + minutes,
      timeline: [newEntry, ...(current.timeline || [])]
    };

    localStorage.setItem(TELEMETRY_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  }
};

export const bookingsService = {
  getAll: () => {
    try {
      const saved = localStorage.getItem(BOOKINGS_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return [];
  },

  addBooking: (booking) => {
    try {
      const current = bookingsService.getAll();
      const next = [booking, ...current.filter(b => b.id !== booking.id)];
      localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(next));
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('somahome_bookings_updated', { detail: next }));
      }
      return next;
    } catch {
      return [];
    }
  },

  getForStudent: (studentName = '') => {
    try {
      const all = bookingsService.getAll();
      if (!studentName) return all.filter(b => b.status !== 'Cancelled');
      const studentLower = studentName.toLowerCase().split(' ')[0];
      return all.filter(b => 
        b.studentName?.toLowerCase().includes(studentLower) && b.status !== 'Cancelled'
      );
    } catch {
      return [];
    }
  },

  getForTeacher: (teacherName = '') => {
    try {
      const all = bookingsService.getAll();
      if (!teacherName) return all.filter(b => b.status !== 'Cancelled');
      const teacherLower = teacherName.toLowerCase();
      return all.filter(b => 
        (b.tutorName?.toLowerCase().includes(teacherLower) || !b.tutorName) && b.status !== 'Cancelled'
      );
    } catch {
      return [];
    }
  }
};
