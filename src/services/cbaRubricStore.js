// Formative Assessment & KNEC CBA Rubrics Store
// Manages Level 1-4 competency evaluations for lessons and syncs with official transcripts

const RUBRIC_STORAGE_KEY = 'somahome_cba_rubrics_v1';

export const CBA_LEVELS = {
  EE: {
    code: 'EE',
    level: 4,
    label: 'Exceeding Expectations',
    badgeClass: 'badge-cbc',
    color: '#34D399',
    bgColor: 'rgba(0, 166, 81, 0.15)',
    borderColor: '#00A651',
    description: 'Learner consistently and independently applies concepts, demonstrates critical thinking, and innovates beyond the prompt.'
  },
  ME: {
    code: 'ME',
    level: 3,
    label: 'Meeting Expectations',
    badgeClass: 'badge-cambridge',
    color: '#38BDF8',
    bgColor: 'rgba(2, 132, 199, 0.15)',
    borderColor: '#0284C7',
    description: 'Learner accurately demonstrates all required core competencies and procedures with minimal assistance.'
  },
  AE: {
    code: 'AE',
    level: 2,
    label: 'Approaching Expectations',
    badgeClass: 'badge-ace',
    color: '#FBBF24',
    bgColor: 'rgba(217, 119, 6, 0.15)',
    borderColor: '#D97706',
    description: 'Learner understands the primary concept with guided assistance and occasional prompting from parent/facilitator.'
  },
  BE: {
    code: 'BE',
    level: 1,
    label: 'Below Expectations',
    badgeClass: 'badge-warning',
    color: '#F87171',
    bgColor: 'rgba(239, 68, 68, 0.15)',
    borderColor: '#EF4444',
    description: 'Learner requires step-by-step reinforcement and foundational practice.'
  }
};

export const cbaRubricStore = {
  getAll() {
    try {
      const data = localStorage.getItem(RUBRIC_STORAGE_KEY);
      if (data) return JSON.parse(data);
    } catch (e) {}

    // Default seeded baseline evaluations
    return {
      'liam_Mathematics': { rating: 'EE', level: 4, subject: 'Mathematics Activities', remark: 'Outstanding grasp of fractions, place value and spatial reasoning.', date: '2026-09-15' },
      'liam_Science': { rating: 'EE', level: 4, subject: 'Science & Technology', remark: 'Constructed 4-tier jiko charcoal & sand water filter independently.', date: '2026-09-16' },
      'liam_English': { rating: 'ME', level: 3, subject: 'English Language & Literacy', remark: 'Composes vivid descriptive safari essays with strong vocabulary.', date: '2026-09-14' },
      'liam_Kiswahili': { rating: 'ME', level: 3, subject: 'Kiswahili Lugha na Kusoma', remark: 'Anaelewa ngeli za A-WA vizuri na anashiriki kwa ufasaha.', date: '2026-09-15' },
      'liam_Agriculture': { rating: 'EE', level: 4, subject: 'Agriculture & Nutrition', remark: 'Demonstrates container gardening and organic soil composting.', date: '2026-09-16' },
      'liam_Creative': { rating: 'ME', level: 3, subject: 'Creative Arts & Music', remark: 'Creates patterned Kitenge collage and rhythmic percussion.', date: '2026-09-13' }
    };
  },

  getForStudent(studentId = 'liam') {
    const all = this.getAll();
    const result = {};
    Object.keys(all).forEach(key => {
      if (key.startsWith(studentId + '_')) {
        const subjectKey = key.replace(studentId + '_', '');
        result[subjectKey] = all[key];
      }
    });
    return result;
  },

  saveEvaluation(studentId, subject, ratingCode, remark = '') {
    const all = this.getAll();
    const key = `${studentId}_${subject}`;
    const levelObj = CBA_LEVELS[ratingCode] || CBA_LEVELS.ME;

    all[key] = {
      rating: ratingCode,
      level: levelObj.level,
      subject,
      remark: remark || levelObj.description,
      date: new Date().toISOString().split('T')[0]
    };

    try {
      localStorage.setItem(RUBRIC_STORAGE_KEY, JSON.stringify(all));
      window.dispatchEvent(new CustomEvent('cba_rubric_updated', { detail: all[key] }));
    } catch (e) {}

    return all[key];
  },

  calculateSummary(studentId = 'liam') {
    const studentEvals = Object.values(this.getForStudent(studentId));
    if (studentEvals.length === 0) return { overall: 'ME', avgLevel: 3.0, total: 0 };

    const totalLevel = studentEvals.reduce((acc, curr) => acc + (curr.level || 3), 0);
    const avg = totalLevel / studentEvals.length;
    let overall = 'ME';
    if (avg >= 3.5) overall = 'EE';
    else if (avg >= 2.5) overall = 'ME';
    else if (avg >= 1.5) overall = 'AE';
    else overall = 'BE';

    return {
      overall,
      avgLevel: avg.toFixed(1),
      total: studentEvals.length,
      evaluations: studentEvals
    };
  }
};
