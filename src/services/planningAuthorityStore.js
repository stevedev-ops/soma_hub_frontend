// planningAuthorityStore.js - Clean 0-Mock State
import api from './api';

const PLANNING_STORAGE_KEY = 'somahome_planning_authority_v2';
const TEACHER_STUDENTS_KEY = 'somahome_teacher_students_v2';
const POD_GROUPS_KEY = 'somahome_pod_groups_v2';
const TEACHER_SCHEDULE_SLOTS_KEY = 'somahome_teacher_schedule_slots_v2';

export const planningAuthorityStore = {
  getForChild: (childId = '') => {
    try {
      const all = JSON.parse(localStorage.getItem(PLANNING_STORAGE_KEY) || '{}');
      if (childId && all[childId]) return all[childId];
    } catch (e) {}

    return {
      childId,
      authorityMode: 'parent',
      assignedTeacherId: null,
      teacherName: null,
      teacherTsc: null,
      delegatedAt: null,
      permissions: {
        canScheduleLiveLessons: false,
        canAssignHomework: false,
        canGradeRubrics: false,
        canEditDailySchedule: false
      },
      teacherScheduleOverride: null
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
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('planning_authority_updated', { detail: all[childId] }));
      }
      return all[childId];
    } catch (e) {
      return null;
    }
  },

  getTeacherStudents: (teacherId = '') => {
    try {
      const saved = localStorage.getItem(TEACHER_STUDENTS_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [];
  },

  saveTeacherStudents: (students) => {
    localStorage.setItem(TEACHER_STUDENTS_KEY, JSON.stringify(students));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('teacher_students_updated', { detail: students }));
    }
  },

  getTeacherPods: (teacherId = '') => {
    try {
      const saved = localStorage.getItem(POD_GROUPS_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [];
  },

  saveTeacherPods: (pods) => {
    localStorage.setItem(POD_GROUPS_KEY, JSON.stringify(pods));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('teacher_pods_updated', { detail: pods }));
    }
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
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('teacher_lesson_scheduled', { detail: newLesson }));
      }
      return newLesson;
    } catch (e) {
      return null;
    }
  },

  getTeacherWeeklySlots: (teacherId = '') => {
    try {
      const saved = localStorage.getItem(TEACHER_SCHEDULE_SLOTS_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [];
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
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('teacher_schedule_updated', { detail: updated }));
    }

    // Background sync to Django backend
    api.createTeacherSlot(newSlot).catch(() => {});
    return newSlot;
  },

  updateTeacherWeeklySlot: (slotId, updatedFields) => {
    const slots = planningAuthorityStore.getTeacherWeeklySlots();
    const updated = slots.map(s => s.id === slotId ? { ...s, ...updatedFields } : s);
    localStorage.setItem(TEACHER_SCHEDULE_SLOTS_KEY, JSON.stringify(updated));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('teacher_schedule_updated', { detail: updated }));
    }
    return updated;
  },

  deleteTeacherWeeklySlot: (slotId) => {
    const slots = planningAuthorityStore.getTeacherWeeklySlots();
    const updated = slots.filter(s => s.id !== slotId);
    localStorage.setItem(TEACHER_SCHEDULE_SLOTS_KEY, JSON.stringify(updated));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('teacher_schedule_updated', { detail: updated }));
    }

    // Background sync delete to Django backend
    api.deleteTeacherSlot(slotId).catch(() => {});
    return updated;
  }
};

export const REGISTERED_TEACHERS = [];
export default planningAuthorityStore;
