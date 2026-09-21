const API_BASE = import.meta.env.VITE_API_URL || 'https://soma-hub-backend.onrender.com/api';

export const api = {
  // Authentication & Account Switching
  async login({ username, password, demoRole }) {
    try {
      const res = await fetch(`${API_BASE}/auth/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          password,
          demo_role: demoRole
        })
      });
      if (!res.ok) throw new Error('Login failed');
      const data = await res.json();
      return data.user;
    } catch (e) {
      console.warn('API login fallback:', e);
      const mockUsers = {
        parent: {
          id: 1, username: 'steve_parent', name: 'Steve Kariuki (Mama Liam)',
          role: 'parent', phone_number: '+254712345678', estate: 'Kilimani, Nairobi',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
          children: [
            { id: 1, name: 'Liam Kariuki', grade: 'Grade 4', curriculum: 'CBC' },
            { id: 2, name: 'Maya Kariuki', grade: 'Year 5', curriculum: 'CAMBRIDGE' }
          ]
        },
        creator: {
          id: 5, username: 'mamateaches_creator', name: 'Mama Liam (@MamaTeachesKenya)',
          role: 'creator', phone_number: '+254712345678', estate: 'Kilimani, Nairobi',
          avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150'
        },
        student: {
          id: 2, username: 'liam_student', name: 'Liam Kariuki',
          role: 'student', phone_number: '+254712345679', estate: 'Kilimani, Nairobi',
          avatar: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150',
          student_detail: { id: 1, name: 'Liam Kariuki', grade: 'Grade 4', curriculum: 'CBC' }
        },
        tutor: {
          id: 3, username: 'mercy_tutor', name: 'Teacher Mercy Wanjiku',
          role: 'tutor', phone_number: '+254722889900', estate: 'Lavington, Nairobi',
          avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150'
        },
        admin: {
          id: 4, username: 'admin_hq', name: 'SomaHome Operations HQ',
          role: 'admin', phone_number: '+254700000000', estate: 'Westlands HQ',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'
        }
      };
      return mockUsers[demoRole || 'parent'];
    }
  },

  // Self-Registration API
  async register(payload) {
    try {
      const res = await fetch(`${API_BASE}/auth/register/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Registration failed');
      const data = await res.json();
      return data.user;
    } catch (e) {
      console.warn('API register fallback:', e);
      return {
        id: Date.now(),
        username: payload.phone || payload.fullName,
        name: payload.fullName,
        role: payload.role || 'parent',
        phone_number: payload.phone,
        estate: payload.estate,
        avatar: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150'
      };
    }
  },

  // Creator Templates API
  async getCreatorTemplates() {
    try {
      const res = await fetch(`${API_BASE}/creators/templates/`);
      if (!res.ok) throw new Error('API error');
      return await res.json();
    } catch (e) {
      return null;
    }
  },

  async createCreatorTemplate(templateData) {
    try {
      const res = await fetch(`${API_BASE}/creators/templates/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(templateData)
      });
      if (!res.ok) throw new Error('API error');
      return await res.json();
    } catch (e) {
      return null;
    }
  },

  // Teacher Schedule Slots API
  async getTeacherSlots() {
    try {
      const res = await fetch(`${API_BASE}/tutors/schedule-slots/`);
      if (!res.ok) throw new Error('API error');
      return await res.json();
    } catch (e) {
      return null;
    }
  },

  async createTeacherSlot(slotData) {
    try {
      const res = await fetch(`${API_BASE}/tutors/schedule-slots/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(slotData)
      });
      if (!res.ok) throw new Error('API error');
      return await res.json();
    } catch (e) {
      return null;
    }
  },

  async deleteTeacherSlot(slotId) {
    try {
      const numId = String(slotId).replace('slot_', '');
      await fetch(`${API_BASE}/tutors/schedule-slots/${numId}/`, {
        method: 'DELETE'
      });
    } catch (e) {}
  },

  // Term Packages (Homeschool-in-a-Box)
  async getPackages() {
    try {
      const res = await fetch(`${API_BASE}/curriculum/packages/`);
      if (!res.ok) throw new Error('API error');
      return await res.json();
    } catch (e) {
      return [
        {
          id: 1,
          title: "Grade 4 Term 1 CBC Box",
          subtitle: "Complete Zero-Prep Parent Facilitation Pack",
          price_kes: "6500.00",
          grade_level: "Grade 4",
          badge: "Bestseller in Nairobi",
          features: [
            "Weekly step-by-step printed lesson guides",
            "Full access to digital reading room & science labs",
            "Continuous assessment & official CBC report card generator",
            "Direct mentor hotline with verified TSC teachers"
          ]
        },
        {
          id: 2,
          title: "Cambridge Primary Year 5 Box",
          subtitle: "Rigorous UK National Curriculum Pack",
          price_kes: "8500.00",
          grade_level: "Year 5",
          badge: "International Benchmark",
          features: [
            "Weekly diagnostic checkpoint quizzes",
            "Hands-on STEM and investigative science guides",
            "Comprehensive reading comprehension anthologies",
            "Official Cambridge transcript builder"
          ]
        }
      ];
    }
  },

  // Today's Homeschool OS Schedule
  async getTodaySchedule(packageId = 1, day = 3) {
    try {
      const res = await fetch(`${API_BASE}/daily/today/?package_id=${packageId}&day=${day}`);
      if (!res.ok) throw new Error('API error');
      return await res.json();
    } catch (e) {
      return {
        package: { id: 1, title: "Grade 4 Term 1 CBC Box", grade_level: "Grade 4", curriculum: "CBC" },
        week: {
          number: 3,
          theme_title: "Environmental Cleanliness, Fractions & Matter",
          printable_pack_title: "Grade 4 Term 1 - Week 3 Complete Printable Pack (PDF)",
          page_count: 14
        },
        day: 3,
        lessons: [
          {
            id: 1,
            subject: "Mathematics Activities",
            time_slot: "08:30 AM - 09:15 AM",
            duration_minutes: 35,
            topic: "Fractions: Halves, Quarters & Eighths",
            parent_script: "Greet your child and say: 'Today we are dividing a delicious chapati among our family members! If we have one whole round chapati and slice it straight down the middle, how many equal slices do we have? That is 1/2.'",
            learning_objective: "Learners should identify and represent proper fractions using concrete everyday objects.",
            local_materials: ["Round cardboard or paper plate", "Pair of safety scissors", "Ruler and pencil"],
            step_by_step_activity: "1. Have child fold plate in half (1/2).\n2. Fold into quarters and label each slice 1/4.\n3. Complete Worksheet #1.",
            worksheet_name: "Math_G4_W3_Fractions_Plate.pdf",
            is_lab_practical: false
          },
          {
            id: 3,
            subject: "Science & Technology (Home Lab)",
            time_slot: "09:30 AM - 10:30 AM",
            duration_minutes: 45,
            topic: "Water Purification with Local Materials",
            parent_script: "Say: 'When it rains heavily and our rivers turn brown with mud, how can communities make water clear again? Today, you are an environmental engineer! We are going to build our very own filter using things from our kitchen and compound.'",
            learning_objective: "Construct a working mechanical water filtration apparatus demonstrating how sediment and charcoal filter muddy water.",
            local_materials: [
              "1 empty plastic soda bottle (e.g. Dasani or Quencher)",
              "Charcoal pieces crushed from the jiko",
              "Clean fine sand from the compound",
              "Small clean pebbles / gravel",
              "Cotton wool or a piece of clean cotton cloth",
              "A cup of muddy/dirty water"
            ],
            step_by_step_activity: "1. Cut the bottom third off the bottle.\n2. Invert top neck-down into a glass.\n3. Layer cotton, charcoal from jiko, sand, then pebbles.\n4. Pour muddy water slowly.\n5. Take a photo and upload to portfolio!",
            worksheet_name: "Science_G4_W3_Water_Filter_Lab.pdf",
            is_lab_practical: true,
            has_photo_submission: true
          }
        ]
      };
    }
  },

  // Report Cards
  async getReportCard(studentId = 1) {
    try {
      const res = await fetch(`${API_BASE}/reports/card/${studentId}/`);
      if (!res.ok) throw new Error('API error');
      return await res.json();
    } catch (e) {
      return {
        student: { name: "Liam Kariuki", grade: "Grade 4", curriculum: "CBC", term: "Term 1", academic_year: "2026" },
        school_identity: {
          system_name: "SomaHome Kenya Alternative & Homeschooling Network",
          registration_badge: "CBC Alignment Reference: KICD 2026 Guidelines",
          mentor: "Teacher Mercy Wanjiku (TSC Reg No: 582914)"
        },
        rubric_summary: { EE: 3, ME: 3, AE: 0, BE: 0, overall_status: "EXCEEDING EXPECTATIONS" },
        competencies: [
          { subject: "Mathematics Activities", rating: "EE", score: "Level 4", remark: "Demonstrates exceptional grasp of fractions and practical measurement." },
          { subject: "Science & Technology", rating: "EE", score: "Level 4", remark: "Built working home water filtration model with locally sourced materials." },
          { subject: "English Language & Literacy", rating: "ME", score: "Level 3", remark: "Speaks fluently, writes creative 4-paragraph descriptive essays." },
          { subject: "Kiswahili Lugha na Kusoma", rating: "ME", score: "Level 3", remark: "Anaelewa ngeli za Kiswahili vizuri na anashiriki katika mazungumzo." },
          { subject: "Agriculture & Nutrition", rating: "EE", score: "Level 4", remark: "Identifies indigenous Kenyan soil types and kitchen gardening practices." },
          { subject: "Creative Arts & Music", rating: "ME", score: "Level 3", remark: "Expresses rhythm and creates patterned collage art from local fabric." }
        ]
      };
    }
  },

  // Marketplace: Tutors & Pods
  async getTutors() {
    try {
      const res = await fetch(`${API_BASE}/marketplace/tutors/`);
      if (!res.ok) throw new Error('API error');
      return await res.json();
    } catch (e) {
      return [
        {
          id: 1,
          full_name: "Teacher Mercy Wanjiku",
          title: "Lead CBC Facilitator & Primary STEM Specialist",
          bio: "Over 9 years experience coaching homeschooling families across Kilimani, Lavington, and Karen.",
          avatar_url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300",
          hourly_rate_kes: "1500.00",
          rating: "4.96",
          reviews_count: 42,
          has_police_clearance: true,
          has_tsc_accreditation: true,
          estates_covered: ["Kilimani", "Kileleshwa", "Lavington", "Karen"],
          phone_contact: "+254722889900"
        }
      ];
    }
  },

  async getPods() {
    try {
      const res = await fetch(`${API_BASE}/marketplace/pods/`);
      if (!res.ok) throw new Error('API error');
      return await res.json();
    } catch (e) {
      return [
        {
          id: 1,
          name: "Syokimau Grade 4 CBC Explorers Pod",
          estate: "Syokimau (Mwananchi Road)",
          host_parent: "Mama Liam (Court 4)",
          curriculum_code: "CBC",
          grade_target: "Grade 4",
          max_children: 6,
          current_enrolled: 4,
          meeting_days: "Mon, Wed, Fri (09:00 AM - 01:00 PM)",
          monthly_share_kes: "4500.00",
          description: "A secure neighborhood homeschool pod sharing a vetted CBC science & math tutor.",
          focus_areas: ["Hands-on Science Labs", "Mental Math Challenges"]
        }
      ];
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
        success: true,
        checkout_request_id: `ws_DEMO_${Date.now()}`,
        amount: 6500,
        phone: phone || "254712345678",
        customer_message: `Success. STK Push prompt sent to ${phone || '254712345678'}.`
      };
    }
  },

  async confirmMpesaPin(checkoutRequestId, creatorHandle = '@mamateaches_ke') {
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
        success: true,
        status: 'SUCCESS',
        mpesa_receipt_number: `SKM${Math.floor(Math.random() * 900000 + 100000)}`,
        message: "Confirmed! KES 6,500 paid via M-Pesa. Homeschool-in-a-Box unlocked!"
      };
    }
  }
};
