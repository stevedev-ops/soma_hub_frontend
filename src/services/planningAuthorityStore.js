import { api } from './api';

const PLANNING_STORAGE_KEY = 'somahome_planning_authority_v2';
const TEACHER_STUDENTS_KEY = 'somahome_teacher_assigned_students_v2';
const POD_GROUPS_KEY = 'somahome_teacher_pod_groups_v2';
const TEACHER_SCHEDULE_SLOTS_KEY = 'somahome_teacher_schedule_slots_v2';

export const REGISTERED_TEACHERS = [
  {
    id: 'mercy',
    name: 'Teacher Mercy Wanjiku',
    role: 'Senior CBC & Cambridge Facilitator',
    tscNumber: 'TSC Reg No. 582914',
    rating: 4.9,
    studentsCount: 5,
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200',
    specialties: ['Mathematics', 'Science & Tech', 'Kiswahili Sarufi']
  },
  {
    id: 'david',
    name: 'Teacher David Maina',
    role: 'STEM & Robotics Lead',
    tscNumber: 'TSC Reg No. 614022',
    rating: 4.8,
    studentsCount: 4,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
    specialties: ['Coding & Robotics', 'Physics', 'Cambridge Science']
  }
];

const INITIAL_TEACHER_STUDENTS = [
  { id: 'liam', name: 'Liam Kariuki', grade: 'Grade 4 (CBC)', curriculum: 'CBC', parentName: 'Sarah Kariuki', podId: 'pod_alpha', status: 'Active' },
  { id: 'kelvin', name: 'Kelvin Ochieng', grade: 'Grade 4 (CBC)', curriculum: 'CBC', parentName: 'Peter Ochieng', podId: 'pod_alpha', status: 'Active' },
  { id: 'zawadi', name: 'Zawadi Muthoni', grade: 'Grade 4 (CBC)', curriculum: 'CBC', parentName: 'Grace Muthoni', podId: 'pod_alpha', status: 'Active' },
  { id: 'brian', name: 'Brian Kiprop', grade: 'Grade 4 (CBC)', curriculum: 'CBC', parentName: 'Daniel Kiprop', podId: 'pod_alpha', status: 'Active' },
  { id: 'maya', name: 'Maya Kariuki', grade: 'Year 5 (Cambridge)', curriculum: 'Cambridge', parentName: 'Sarah Kariuki', podId: 'pod_cambridge', status: 'Active' },
  { id: 'ariana', name: 'Ariana Shah', grade: 'Grade 4 (CBC)', curriculum: 'CBC', parentName: 'Deepa Shah', podId: 'solo_track', status: '1-on-1 Remedial' }
];

const INITIAL_POD_GROUPS = [
  {
    id: 'pod_alpha',
    name: 'Syokimau CBC Pod Alpha',
    curriculum: 'CBC',
    grade: 'Grade 4 CBC',
    estate: 'Syokimau (Mwananchi Road)',
    hostTeacher: 'Teacher Mercy Wanjiku',
    memberStudentIds: ['liam', 'kelvin', 'zawadi', 'brian'],
    maxChildren: 6,
    monthlyShareKes: 4500,
    meetingSchedule: 'Mon-Thu 9:00 AM - 12:00 PM',
    liveLink: 'https://meet.jit.si/somahome-syokimau-alpha-pod',
    focusAreas: ['Hands-on Science Labs', 'Mental Math Challenges']
  },
  {
    id: 'pod_cambridge',
    name: 'Kilimani Cambridge Innovators',
    curriculum: 'Cambridge',
    grade: 'Year 5 Cambridge',
    estate: 'Kilimani (Wood Avenue)',
    hostTeacher: 'Teacher Mercy Wanjiku',
    memberStudentIds: ['maya'],
    maxChildren: 5,
    monthlyShareKes: 6000,
    meetingSchedule: 'Mon-Fri 10:00 AM - 1:00 PM',
    liveLink: 'https://meet.jit.si/somahome-kilimani-cambridge',
    focusAreas: ['Inquiry Physics', 'Python Logic']
  }
];

const INITIAL_SCHEDULE_SLOTS = [
  {
    id: 'slot_1',
    day: 'Monday',
    startTime: '09:00 AM',
    endTime: '11:00 AM',
    title: 'Syokimau CBC Pod Math & Science Practical Lab',
    type: 'pod',
    targetGroup: 'Syokimau CBC Pod Alpha',
    maxLearners: 6,
    bookedLearners: 4,
    hourlyRateKes: 1500,
    status: 'Confirmed',
    location: 'Physical Pod (Court 4) & Virtual Mirror',
    liveLink: 'https://meet.jit.si/somahome-syokimau-alpha-pod'
  },
  {
    id: 'slot_2',
    day: 'Tuesday',
    startTime: '02:00 PM',
    endTime: '03:30 PM',
    title: '1-on-1 Intensive CBC Numeracy & Fractions Remedial',
    type: 'one_on_one',
    targetGroup: 'Ariana Shah (1-on-1)',
    maxLearners: 1,
    bookedLearners: 1,
    hourlyRateKes: 1800,
    status: 'Confirmed',
    location: 'Interactive Virtual Classroom',
    liveLink: 'https://meet.jit.si/somahome-remedial-shah'
  },
  {
    id: 'slot_3',
    day: 'Wednesday',
    startTime: '10:00 AM',
    endTime: '12:00 PM',
    title: 'Cambridge Primary Year 5 Science & Physics Inquiry',
    type: 'pod',
    targetGroup: 'Kilimani Cambridge Innovators',
    maxLearners: 4,
    bookedLearners: 2,
    hourlyRateKes: 2000,
    status: 'Confirmed',
    location: 'Kilimani Pod & Hybrid Stream',
    liveLink: 'https://meet.jit.si/somahome-kilimani-cambridge'
  },
  {
    id: 'slot_4',
    day: 'Thursday',
    startTime: '02:00 PM',
    endTime: '04:00 PM',
    title: 'Open 1-on-1 Diagnostic & Weekly CBA Evaluation Slot',
    type: 'open_booking',
    targetGroup: 'Available for Parent Bookings',
    maxLearners: 1,
    bookedLearners: 0,
    hourlyRateKes: 1500,
    status: 'Available',
    location: 'Online Video Consult',
    liveLink: 'https://meet.jit.si/somahome-mercy-office-hours'
  },
  {
    id: 'slot_5',
    day: 'Friday',
    startTime: '09:30 AM',
    endTime: '11:00 AM',
    title: 'Grade 4 Kiswahili Sarufi na Mazungumzo Masterclass',
    type: 'pod',
    targetGroup: 'All Enrolled Grade 4 Learners',
    maxLearners: 8,
    bookedLearners: 5,
    hourlyRateKes: 1200,
    status: 'Confirmed',
    location: 'Community Live Studio',
    liveLink: 'https://meet.jit.si/somahome-friday-kiswahili'
  }
];

export const planningAuthorityStore = {
  getForChild: (childId = 'liam') => {
    try {
      const all = JSON.parse(localStorage.getItem(PLANNING_STORAGE_KEY) || '{}');
      if (all[childId]) return all[childId];
    } catch (e) {}

    return {
      childId,
      authorityMode: 'teacher',
      assignedTeacherId: 'mercy',
      teacherName: 'Teacher Mercy Wanjiku',
      teacherTsc: 'TSC Reg No. 582914',
      delegatedAt: '15-Sep-2026',
      permissions: {
        canScheduleLiveLessons: true,
        canAssignHomework: true,
        canGradeRubrics: true,
        canEditDailySchedule: true
      },
      teacherScheduleOverride: {
        focusSubject: 'Mathematics & Kitchen Science',
        weeklyNotes: 'Teacher Mercy is leading daily 9:00 AM estate pod sessions in Syokimau.',
        customStartTime: '09:00 AM'
      }
    };
  },

  setAuthority: (childId, newConfig) => {
    try {
      const all = JSON.parse(localStorage.getItem(PLANNING_STORAGE_KEY) || '{}');
      all[childId] = {
        ...all[childId],
        ...newConfig,
        updatedAt: new Date().toISOString()
      };
      localStorage.setItem(PLANNING_STORAGE_KEY, JSON.stringify(all));
      window.dispatchEvent(new CustomEvent('planning_authority_updated', { detail: all[childId] }));
      return all[childId];
    } catch (e) {
      return null;
    }
  },

  getTeacherStudents: (teacherId = 'mercy') => {
    try {
      const saved = localStorage.getItem(TEACHER_STUDENTS_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_TEACHER_STUDENTS;
  },

  saveTeacherStudents: (students) => {
    localStorage.setItem(TEACHER_STUDENTS_KEY, JSON.stringify(students));
    window.dispatchEvent(new CustomEvent('teacher_students_updated', { detail: students }));
  },

  getTeacherPods: (teacherId = 'mercy') => {
    try {
      const saved = localStorage.getItem(POD_GROUPS_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_POD_GROUPS;
  },

  saveTeacherPods: (pods) => {
    localStorage.setItem(POD_GROUPS_KEY, JSON.stringify(pods));
    window.dispatchEvent(new CustomEvent('teacher_pods_updated', { detail: pods }));
  },

  createTeacherPod: (podData) => {
    const pods = planningAuthorityStore.getTeacherPods();
    const newPod = {
      id: `pod_${Date.now()}`,
      memberStudentIds: [],
      liveLink: `https://meet.jit.si/somahome-${podData.estate?.toLowerCase().replace(/[^a-z0-9]/g, '') || 'pod'}-${Date.now().toString().slice(-4)}`,
      ...podData
    };
    const updated = [newPod, ...pods];
    planningAuthorityStore.saveTeacherPods(updated);
    return newPod;
  },

  scheduleTeacherLesson: (podId, lessonData) => {
    const key = `somahome_teacher_lessons_${podId}`;
    try {
      const existing = JSON.parse(localStorage.getItem(key) || '[]');
      const newLesson = {
        id: `tl_${Date.now()}`,
        podId,
        ...lessonData,
        scheduledAt: new Date().toISOString()
      };
      const updated = [newLesson, ...existing];
      localStorage.setItem(key, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('teacher_lesson_scheduled', { detail: newLesson }));
      return newLesson;
    } catch (e) {
      return null;
    }
  },

  getTeacherWeeklySlots: (teacherId = 'mercy') => {
    try {
      const saved = localStorage.getItem(TEACHER_SCHEDULE_SLOTS_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_SCHEDULE_SLOTS;
  },

  addTeacherWeeklySlot: (slotData) => {
    const slots = planningAuthorityStore.getTeacherWeeklySlots();
    const newSlot = {
      id: `slot_${Date.now()}`,
      bookedLearners: 0,
      status: slotData.status || 'Available',
      ...slotData
    };
    const updated = [...slots, newSlot];
    localStorage.setItem(TEACHER_SCHEDULE_SLOTS_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('teacher_schedule_updated', { detail: updated }));

    // Background sync to Django backend
    api.createTeacherSlot(newSlot).catch(() => {});
    return newSlot;
  },

  updateTeacherWeeklySlot: (slotId, updatedFields) => {
    const slots = planningAuthorityStore.getTeacherWeeklySlots();
    const updated = slots.map(s => s.id === slotId ? { ...s, ...updatedFields } : s);
    localStorage.setItem(TEACHER_SCHEDULE_SLOTS_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('teacher_schedule_updated', { detail: updated }));
    return updated;
  },

  deleteTeacherWeeklySlot: (slotId) => {
    const slots = planningAuthorityStore.getTeacherWeeklySlots();
    const updated = slots.filter(s => s.id !== slotId);
    localStorage.setItem(TEACHER_SCHEDULE_SLOTS_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('teacher_schedule_updated', { detail: updated }));

    // Background sync delete to Django backend
    api.deleteTeacherSlot(slotId).catch(() => {});
    return updated;
  }
};
