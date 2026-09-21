// SomaHome Universal Pluggable Curriculum Framework Registry
// Powers KICD CBC, British Cambridge, IB PYP, Montessori, Charlotte Mason & Custom JSON Framework Packs

const FRAMEWORKS_STORAGE_KEY = 'somahome_curriculum_frameworks_v1';

export const BUNDLED_FRAMEWORKS = [
  {
    frameworkId: 'kicd_cbc',
    name: 'KICD Competency-Based Curriculum',
    region: 'Kenya (National)',
    organization: 'Kenya Institute of Curriculum Development (KICD)',
    version: '2026.1',
    badge: 'National Standard',
    philosophy: 'Competency-Based & Hands-on Community Practical Application',
    structure: {
      stages: ['Foundational (PP1-Grade 3)', 'Middle School (Grade 4-6)', 'Junior School (Grade 7-9)'],
      termsPerYear: 3,
      weeksPerTerm: 12,
      typicalDailyHours: 3.0
    },
    learningAreas: [
      { id: 'math', title: 'Mathematics Activities', strandType: 'Core Numeracy', icon: '📐' },
      { id: 'science', title: 'Science & Technology', strandType: 'Kitchen Lab', icon: '🧪' },
      { id: 'english', title: 'English Language & Literacy', strandType: 'Communication', icon: '📖' },
      { id: 'kiswahili', title: 'Kiswahili Lugha na Kusoma', strandType: 'Language', icon: '🗣️' },
      { id: 'agri', title: 'Agriculture & Nutrition', strandType: 'Applied Project', icon: '🌱' },
      { id: 'creative', title: 'Creative Arts & Music', strandType: 'Expression', icon: '🎨' }
    ],
    pedagogyModel: {
      sessionFormat: 'script_and_practical',
      deliveryStyle: 'Parent-guided 35-minute micro-blocks with verbatim reading scripts',
      requiresHouseholdMaterials: true
    },
    assessmentScale: {
      type: 'competency_rubric',
      levels: [
        { code: 'EE', label: 'Exceeding Expectations', score: 4, color: '#10B981', bg: 'rgba(16, 185, 129, 0.15)' },
        { code: 'ME', label: 'Meeting Expectations', score: 3, color: '#3B82F6', bg: 'rgba(59, 130, 246, 0.15)' },
        { code: 'AE', label: 'Approaching Expectations', score: 2, color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.15)' },
        { code: 'BE', label: 'Below Expectations', score: 1, color: '#EF4444', bg: 'rgba(239, 68, 68, 0.15)' }
      ]
    },
    recognitionPathway: {
      authority: 'KNQA & Ministry of Education (Kenya)',
      pathwayName: 'CBC Learner Portfolio & SCDE Private Candidate Registration',
      nationalExam: 'KPSEA (Grade 6) / KCSE via Sub-County Education Offices',
      guidelines: 'Continuous formative evidence portfolio with community values and practical projects.'
    }
  },
  {
    frameworkId: 'cambridge_primary',
    name: 'Cambridge Assessment International Education (CAIE)',
    region: 'United Kingdom / International',
    organization: 'University of Cambridge',
    version: '2026.0',
    badge: 'International Benchmark',
    philosophy: 'Inquiry-Driven, Diagnostic Rigor & Global Benchmarking',
    structure: {
      stages: ['Primary Stage 1-6', 'Lower Secondary Stage 7-9', 'IGCSE Stage 10-11'],
      termsPerYear: 3,
      weeksPerTerm: 11,
      typicalDailyHours: 3.5
    },
    learningAreas: [
      { id: 'cam_math', title: 'Cambridge Primary Mathematics', strandType: 'Algebraic & Spatial Logic', icon: '🔢' },
      { id: 'cam_science', title: 'Cambridge Primary Science', strandType: 'Investigative Physics & Chemistry', icon: '🔬' },
      { id: 'cam_english', title: 'Cambridge First Language English', strandType: 'Rhetoric & Literary Analysis', icon: '📚' },
      { id: 'cam_global', title: 'Global Perspectives & Coding', strandType: 'Research & Algorithms', icon: '🌍' }
    ],
    pedagogyModel: {
      sessionFormat: 'checkpoint_progression',
      deliveryStyle: 'Diagnostic inquiry experiments with hypothesis testing and mathematical graphing',
      requiresHouseholdMaterials: true
    },
    assessmentScale: {
      type: 'stage_mastery',
      levels: [
        { code: 'Gold', label: 'Stage Mastery (85-100%)', score: 4, color: '#10B981', bg: 'rgba(16, 185, 129, 0.15)' },
        { code: 'Silver', label: 'Solid Competence (65-84%)', score: 3, color: '#3B82F6', bg: 'rgba(59, 130, 246, 0.15)' },
        { code: 'Bronze', label: 'Foundational (40-64%)', score: 2, color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.15)' }
      ]
    },
    recognitionPathway: {
      authority: 'Cambridge International / British Council Kenya',
      pathwayName: 'Cambridge Primary Checkpoint Examination Track',
      nationalExam: 'Primary Checkpoint (Stage 6) / IGCSE via British Council Nairobi Center',
      guidelines: 'Standardized checkpoint tests mapped directly to UK National Curriculum equivalents.'
    }
  },
  {
    frameworkId: 'ib_pyp',
    name: 'International Baccalaureate (IB Primary Years - PYP)',
    region: 'Global / International',
    organization: 'International Baccalaureate Organization (IBO)',
    version: 'PYP 2026',
    badge: 'Transdisciplinary Inquiry',
    philosophy: 'Student Agency, Inquiry Cycles & Transdisciplinary Units of Inquiry',
    structure: {
      stages: ['Early Years (Ages 3-5)', 'Primary Years (Ages 6-12)'],
      termsPerYear: 3,
      weeksPerTerm: 12,
      typicalDailyHours: 3.5
    },
    learningAreas: [
      { id: 'ib_inquiry', title: 'Unit of Inquiry: Who We Are', strandType: 'Transdisciplinary Core', icon: '🌐' },
      { id: 'ib_math', title: 'Mathematical Investigations', strandType: 'Inquiry Numeracy', icon: '📐' },
      { id: 'ib_languages', title: 'Language Arts & Multilingualism', strandType: 'Discourse', icon: '✍️' },
      { id: 'ib_action', title: 'Community Action & Exhibition', strandType: 'Agency Project', icon: '🤝' }
    ],
    pedagogyModel: {
      sessionFormat: 'inquiry_cycles',
      deliveryStyle: 'Provocation, guided questioning, self-directed research and reflective journaling',
      requiresHouseholdMaterials: true
    },
    assessmentScale: {
      type: 'criterion_rubric',
      levels: [
        { code: 'Extending', label: 'Extending (Independent Agency)', score: 4, color: '#10B981', bg: 'rgba(16, 185, 129, 0.15)' },
        { code: 'Consolidating', label: 'Consolidating (Fluent Application)', score: 3, color: '#3B82F6', bg: 'rgba(59, 130, 246, 0.15)' },
        { code: 'Developing', label: 'Developing (Guided Execution)', score: 2, color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.15)' },
        { code: 'Beginning', label: 'Beginning (Foundational Awareness)', score: 1, color: '#EF4444', bg: 'rgba(239, 68, 68, 0.15)' }
      ]
    },
    recognitionPathway: {
      authority: 'IB World Schools Network & Global Transfer Protocol',
      pathwayName: 'IB Learner Profile & Exhibition Portfolio',
      nationalExam: 'PYP Exhibition Portfolio Assessment',
      guidelines: 'Recognized globally across 150+ countries for seamless international school transfer.'
    }
  },
  {
    frameworkId: 'montessori_primary',
    name: 'Montessori Hands-On 3-Period Work Cycle',
    region: 'Global Alternative',
    organization: 'Association Montessori Internationale (AMI)',
    version: 'Classic Primary',
    badge: 'Self-Directed & Sensorial',
    philosophy: 'Prepared Environment, Sensorial Exploration & Uninterrupted Work Periods',
    structure: {
      stages: ['Primary Children House (Ages 3-6)', 'Elementary Lower (Ages 6-9)', 'Elementary Upper (Ages 9-12)'],
      termsPerYear: 3,
      weeksPerTerm: 12,
      typicalDailyHours: 3.0
    },
    learningAreas: [
      { id: 'mont_practical', title: 'Practical Life & Household Independence', strandType: 'Motor & Executive', icon: '🧹' },
      { id: 'mont_sensorial', title: 'Sensorial Geometry & Bead Math', strandType: 'Concrete to Abstract', icon: '🧮' },
      { id: 'mont_language', title: 'Phonetic Sandpaper & Storytelling', strandType: 'Sensory Literacy', icon: '🔤' },
      { id: 'mont_cultural', title: 'Cosmic Education & Botany Labs', strandType: 'Nature Study', icon: '🌿' }
    ],
    pedagogyModel: {
      sessionFormat: 'sensorial_observation',
      deliveryStyle: '3-Period Lesson (Naming, Recognition, Recall) with uninterrupted 2-hour self-chosen work cycle',
      requiresHouseholdMaterials: true
    },
    assessmentScale: {
      type: 'observational_mastery',
      levels: [
        { code: 'Mastered', label: 'Mastered (Independent Work)', score: 3, color: '#10B981', bg: 'rgba(16, 185, 129, 0.15)' },
        { code: 'Practicing', label: 'Practicing (With Guidance)', score: 2, color: '#3B82F6', bg: 'rgba(59, 130, 246, 0.15)' },
        { code: 'Introduced', label: 'Introduced (Initial Presentation)', score: 1, color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.15)' }
      ]
    },
    recognitionPathway: {
      authority: 'AMI Alternative Education Registry',
      pathwayName: 'Montessori Cosmic Work Portfolio',
      nationalExam: 'Comprehensive Developmental Observation Transcript',
      guidelines: 'Supported through portfolio transition assessments for primary and secondary entry.'
    }
  },
  {
    frameworkId: 'charlotte_mason',
    name: 'Charlotte Mason Living Books & Nature Study',
    region: 'Classical Alternative',
    organization: 'Ambleside Heritage Guild',
    version: 'Living Curriculum 2026',
    badge: 'Living Books & Narration',
    philosophy: 'Education is an Atmosphere, a Discipline, a Life. Short focused lessons & living literature.',
    structure: {
      stages: ['Form 1 (Grades 1-3)', 'Form 2 (Grades 4-6)', 'Form 3 (Grades 7-9)'],
      termsPerYear: 3,
      weeksPerTerm: 12,
      typicalDailyHours: 2.5
    },
    learningAreas: [
      { id: 'cm_books', title: 'Living Literature & Narration', strandType: 'Oral Recall', icon: '📖' },
      { id: 'cm_nature', title: 'Outdoor Nature Study & Journaling', strandType: 'Field Biology', icon: '🦋' },
      { id: 'cm_math', title: 'Concrete Arithmetic & Oral Math', strandType: 'Logic', icon: '📐' },
      { id: 'cm_copywork', title: 'Poetry, Hymns & Masterpiece Copywork', strandType: 'Penmanship', icon: '✒️' }
    ],
    pedagogyModel: {
      sessionFormat: 'living_narration',
      deliveryStyle: 'Short 20-minute lessons with immediate oral narration and weekly nature walks',
      requiresHouseholdMaterials: true
    },
    assessmentScale: {
      type: 'narration_fluency',
      levels: [
        { code: 'Eloquent', label: 'Eloquent Narration (Full Detail)', score: 4, color: '#10B981', bg: 'rgba(16, 185, 129, 0.15)' },
        { code: 'Coherent', label: 'Coherent (Main Ideas Grasped)', score: 3, color: '#3B82F6', bg: 'rgba(59, 130, 246, 0.15)' },
        { code: 'Developing', label: 'Developing (Prompting Needed)', score: 2, color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.15)' }
      ]
    },
    recognitionPathway: {
      authority: 'Classical Homeschool Association & KNQA Portfolio Track',
      pathwayName: 'Living Books & Narration Portfolio Transcript',
      nationalExam: 'Private Candidate SCDE Exam Track',
      guidelines: 'Complete reading logs, nature journals, and narration recordings satisfy homeschool portfolio standards.'
    }
  }
];

export const frameworkRegistry = {
  // Get all registered frameworks
  getFrameworks: () => {
    try {
      const custom = JSON.parse(localStorage.getItem(FRAMEWORKS_STORAGE_KEY) || '[]');
      return [...BUNDLED_FRAMEWORKS, ...custom];
    } catch (e) {
      return BUNDLED_FRAMEWORKS;
    }
  },

  // Get framework by ID
  getFrameworkById: (frameworkId = 'kicd_cbc') => {
    const all = frameworkRegistry.getFrameworks();
    return all.find(f => f.frameworkId === frameworkId || f.frameworkId.toLowerCase() === frameworkId.toLowerCase()) 
      || all.find(f => f.frameworkId === 'kicd_cbc') 
      || BUNDLED_FRAMEWORKS[0];
  },

  // Register / Import new Framework JSON
  registerFramework: (frameworkJson) => {
    try {
      const parsed = typeof frameworkJson === 'string' ? JSON.parse(frameworkJson) : frameworkJson;
      if (!parsed.frameworkId || !parsed.name) {
        throw new Error('Invalid framework schema: frameworkId and name are required.');
      }
      const custom = JSON.parse(localStorage.getItem(FRAMEWORKS_STORAGE_KEY) || '[]');
      const filtered = custom.filter(f => f.frameworkId !== parsed.frameworkId);
      filtered.unshift(parsed);
      localStorage.setItem(FRAMEWORKS_STORAGE_KEY, JSON.stringify(filtered));
      window.dispatchEvent(new CustomEvent('framework_registry_updated', { detail: parsed }));
      return parsed;
    } catch (e) {
      console.error('Framework registration error:', e);
      return null;
    }
  },

  // Export framework schema as clean JSON
  exportFramework: (frameworkId) => {
    const fw = frameworkRegistry.getFrameworkById(frameworkId);
    const blob = new Blob([JSON.stringify(fw, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fw.frameworkId}_framework_pack.json`;
    a.click();
    URL.revokeObjectURL(url);
  },

  // Get active framework for student
  getActiveFrameworkForStudent: (student = {}) => {
    const code = student.curriculum || 'CBC';
    if (code.toLowerCase().includes('cambridge')) return frameworkRegistry.getFrameworkById('cambridge_primary');
    if (code.toLowerCase().includes('ib') || code.toLowerCase().includes('pyp')) return frameworkRegistry.getFrameworkById('ib_pyp');
    if (code.toLowerCase().includes('montessori')) return frameworkRegistry.getFrameworkById('montessori_primary');
    if (code.toLowerCase().includes('mason') || code.toLowerCase().includes('charlotte')) return frameworkRegistry.getFrameworkById('charlotte_mason');
    return frameworkRegistry.getFrameworkById('kicd_cbc');
  }
};
