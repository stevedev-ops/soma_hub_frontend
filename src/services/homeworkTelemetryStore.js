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

  deleteBooking: (bookingId) => {
    try {
      const current = bookingsService.getAll();
      const next = current.filter(b => b.id !== bookingId);
      localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(next));
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('somahome_bookings_updated', { detail: next }));
      }
      return next;
    } catch {
      return [];
    }
  },

  clearAll: () => {
    try {
      localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify([]));
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('somahome_bookings_updated', { detail: [] }));
      }
      return [];
    } catch {
      return [];
    }
  },

  cancelBooking: (bookingId) => {
    try {
      const current = bookingsService.getAll();
      const next = current.map(b => b.id === bookingId ? { ...b, status: 'Cancelled' } : b);
      localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(next));
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('somahome_bookings_updated', { detail: next }));
      }
      return next;
    } catch {
      return [];
    }
  },

  getForStudent: (studentName = '', studentId = null) => {
    try {
      const all = bookingsService.getAll();
      const active = all.filter(b => b.status !== 'Cancelled');
      if (!studentName && !studentId) return active;
      
      const cleanName = (studentName || '').trim().toLowerCase();
      const tokens = cleanName.split(/\s+/).filter(Boolean);
      const firstToken = tokens[0] || '';

      const matched = active.filter(b => {
        if (studentId && b.studentId && String(b.studentId) === String(studentId)) return true;
        
        const bStudent = (b.studentName || '').trim().toLowerCase();
        if (!bStudent || bStudent === 'learner') return true;
        
        if (firstToken && bStudent.includes(firstToken)) return true;
        if (tokens.some(t => bStudent.includes(t))) return true;
        if (bStudent.includes(cleanName) || cleanName.includes(bStudent)) return true;
        
        return false;
      });

      return matched.length > 0 ? matched : active;
    } catch {
      return [];
    }
  },

  getForTeacher: (teacherName = '', tutorId = null) => {
    try {
      const all = bookingsService.getAll();
      const active = all.filter(b => b.status !== 'Cancelled');
      if (!teacherName && !tutorId) return active;
      
      const cleanTeacher = (teacherName || '').trim().toLowerCase();
      const strippedTeacher = cleanTeacher
        .replace(/^(teacher|tr\.|dr\.|mr\.|mrs\.|ms\.)\s+/i, '')
        .replace(/\(tutor\)/gi, '')
        .trim();
      const teacherTokens = strippedTeacher.split(/\s+/).filter(Boolean);
      const firstToken = teacherTokens[0] || '';

      const matched = active.filter(b => {
        if (tutorId && b.tutorId && String(b.tutorId) === String(tutorId)) return true;
        
        const bTutor = (b.tutorName || '').trim().toLowerCase();
        if (!bTutor) return true;
        
        if (cleanTeacher && bTutor.includes(cleanTeacher)) return true;
        if (strippedTeacher && bTutor.includes(strippedTeacher)) return true;
        if (firstToken && bTutor.includes(firstToken)) return true;
        if (teacherTokens.some(t => bTutor.includes(t))) return true;
        
        return false;
      });

      // Crucial: If specific match found return it, otherwise return all active bookings so any educator view can see parent bookings
      return matched.length > 0 ? matched : active;
    } catch {
      return [];
    }
  }
};
