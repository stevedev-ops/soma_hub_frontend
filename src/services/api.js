const API_BASE = typeof window !== 'undefined' && import.meta.env.VITE_API_URL 
  ? import.meta.env.VITE_API_URL 
  : 'https://soma-hub-backend.onrender.com/api';

export const api = {
  async lookupLearners(phoneOrUsername) {
    const res = await fetch(`${API_BASE}/auth/learner-lookup/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: phoneOrUsername })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'No family found for this phone number.');
    }
    return await res.json();
  },

  async studentPinLogin(studentId, pin) {
    const res = await fetch(`${API_BASE}/auth/student-pin-login/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentId, pin })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Incorrect PIN code.');
    }
    const data = await res.json();
    return data.user;
  },

  async addChild(childData) {
    try {
      const res = await fetch(`${API_BASE}/parent/add-child/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(childData)
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Failed to add child.');
      }
      const data = await res.json();
      return data.child;
    } catch (e) {
      console.warn('Backend addChild error, using local fallback:', e);
      return {
        id: childData.name ? childData.name.toLowerCase().replace(/\s+/g, '_') + '_' + Date.now().toString().slice(-4) : `child_${Date.now()}`,
        name: childData.name,
        grade: childData.grade || 'Grade 4 (CBC)',
        curriculum: childData.curriculum || 'CBC',
        avatar: childData.avatar || 'https://images.unsplash.com/photo-1543332164-6e82f355badc?w=120'
      };
    }
  },

  // Authentication & Account Switching (Strict Backend Auth)
  async login({ username, password, demoRole }) {
    const res = await fetch(`${API_BASE}/auth/login/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username,
        password,
        demo_role: demoRole
      })
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || 'Invalid credentials. Please check your phone/username and password.');
    }
    const data = await res.json();
    return data.user;
  },

  async register(formData) {
    const res = await fetch(`${API_BASE}/auth/register/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || 'Registration failed. Please check your details and try again.');
    }
    const data = await res.json();
    return data.user;
  },

  // Creator Templates
  async getCreatorTemplates() {
    try {
      const res = await fetch(`${API_BASE}/creators/templates/`);
      if (!res.ok) return [];
      return await res.json();
    } catch (e) {
      return [];
    }
  },

  async createCreatorTemplate(templateData) {
    try {
      const res = await fetch(`${API_BASE}/creators/templates/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(templateData)
      });
      if (!res.ok) throw new Error('Failed to create template');
      return await res.json();
    } catch (e) {
      throw e;
    }
  },

  // Teacher Schedule Slots
  async getTeacherScheduleSlots() {
    try {
      const res = await fetch(`${API_BASE}/tutors/schedule-slots/`);
      if (!res.ok) return [];
      return await res.json();
    } catch (e) {
      return [];
    }
  },

  async createTeacherScheduleSlot(slotData) {
    try {
      const res = await fetch(`${API_BASE}/tutors/schedule-slots/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(slotData)
      });
      if (!res.ok) throw new Error('Failed to save slot');
      return await res.json();
    } catch (e) {
      throw e;
    }
  },

  async deleteTeacherScheduleSlot(slotId) {
    try {
      const numId = parseInt(slotId, 10) || 1;
      await fetch(`${API_BASE}/tutors/schedule-slots/${numId}/`, {
        method: 'DELETE'
      });
    } catch (e) {}
  },

  // Packages & Curricula Catalog
  async getPackages() {
    try {
      const res = await fetch(`${API_BASE}/curriculum/packages/`);
      if (!res.ok) return [];
      return await res.json();
    } catch (e) {
      return [];
    }
  },

  // Today's Homeschool OS Schedule
  async getTodaySchedule(packageId = 1, day = 3) {
    try {
      const res = await fetch(`${API_BASE}/daily/today/?package_id=${packageId}&day=${day}`);
      if (!res.ok) throw new Error('API error');
      return await res.json();
    } catch (e) {
      return null;
    }
  },

  // Report Cards
  async getReportCard(studentId = 1) {
    try {
      const res = await fetch(`${API_BASE}/reports/card/${studentId}/`);
      if (!res.ok) throw new Error('API error');
      return await res.json();
    } catch (e) {
      return null;
    }
  },

  // Marketplace: Tutors & Pods
  async getTutors() {
    try {
      const res = await fetch(`${API_BASE}/marketplace/tutors/`);
      if (!res.ok) return [];
      return await res.json();
    } catch (e) {
      return [];
    }
  },

  async getPods() {
    try {
      const res = await fetch(`${API_BASE}/marketplace/pods/`);
      if (!res.ok) return [];
      return await res.json();
    } catch (e) {
      return [];
    }
  },

  // M-Pesa STK Push
  async initiateMpesa(phone, packageId) {
    try {
      const res = await fetch(`${API_BASE}/payments/stk-push/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone_number: phone, package_id: packageId })
      });
      return await res.json();
    } catch (e) {
      return {
        success: false,
        error: 'Payment initiation failed. Please check connection.'
      };
    }
  },

  async confirmMpesaPin(checkoutRequestId, creatorHandle = '') {
    try {
      const res = await fetch(`${API_BASE}/payments/confirm-pin/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          checkout_request_id: checkoutRequestId,
          creator_handle: creatorHandle
        })
      });
      return await res.json();
    } catch (e) {
      return {
        success: false,
        error: 'Confirmation failed.'
      };
    }
  }
};

export default api;
