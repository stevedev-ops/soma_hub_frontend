import { api } from './api';

const CREATOR_TEMPLATES_KEY = 'somahome_creator_templates_v1';
const CREATOR_AFFILIATE_KEY = 'somahome_creator_affiliate_v1';

export const INITIAL_CREATOR_TEMPLATES = [
  {
    id: 'mama_teaches_cbc4',
    creatorId: 'creator_mercy_mama',
    creatorName: 'Mama Liam (@MamaTeachesKenya)',
    creatorHandle: '@mamateaches_ke',
    socialPlatform: 'TikTok & Instagram (42K Followers)',
    creatorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200',
    creatorBio: 'Homeschool mom of 2 in Nairobi. Simplifying Grade 4 CBC with zero-prep, 3-hour morning blocks and kitchen labs.',
    title: 'Grade 4 CBC Nature & Practical Science Starter Pack',
    badge: 'TikTok Trending #HomeschoolKenya',
    curriculum: 'CBC',
    grade: 'Grade 4 (CBC)',
    tagline: 'The exact 5-day daily schedule I use with Liam at home in Kilimani',
    rating: 4.96,
    reviewsCount: 184,
    importsCount: 1420,
    affiliateCommissionKes: 1500,
    highlights: [
      '3-Hour Morning Mastery Block (Done by 12:30 PM)',
      'Zero-Prep local kitchen lab materials (Charcoal, plastic bottles, sand)',
      'Built-in Kiswahili Lugha conversation scripts for parents',
      'Direct KICD Competency Alignment without heavy textbooks'
    ],
    sampleWeekTheme: 'Environmental Cleanliness, Fractions & Matter',
    sampleLessons: [
      {
        day: 'Monday',
        time: '08:30 AM - 09:30 AM',
        subject: 'Mathematics Activities',
        topic: 'Hands-on Chapati & Paper Plate Fractions (1/2, 1/4, 1/8)',
        script: 'Greet your child: "Today we are slicing our favorite chapati into fair shares!" Fold paper plate in half, label 1/2, then quarters.',
        materials: ['Paper plate or round cardboard', 'Safety scissors', 'Ruler'],
        activity: 'Cut and match fractions to real household recipe portions.'
      },
      {
        day: 'Tuesday',
        time: '09:00 AM - 10:15 AM',
        subject: 'Science & Technology',
        topic: 'Kitchen Jiko Water Filter Apparatus',
        script: 'Say: "When river water turns brown after rain, how do communities clean it? Today you are an environmental engineer!"',
        materials: ['Plastic bottle', 'Crushed charcoal from jiko', 'Clean fine sand', 'Cotton cloth'],
        activity: 'Build 4-layer gravity filtration column and observe sediment capture.'
      },
      {
        day: 'Wednesday',
        time: '08:30 AM - 09:30 AM',
        subject: 'English Literacy & Creative Writing',
        topic: '4-Paragraph Descriptive Animal Safari Essay',
        script: 'Read passage aloud with expressive voices, then guide child using the 5-sense sensory chart.',
        materials: ['Notebook', 'Colored pens'],
        activity: 'Draft essay describing a Kenyan national park game drive.'
      },
      {
        day: 'Thursday',
        time: '09:00 AM - 10:00 AM',
        subject: 'Kiswahili Lugha na Mazungumzo',
        topic: 'Ngeli za Nomino (A-WA & KI-VI) katika Mazingira ya Nyumbani',
        script: 'Tumia vitu halisi vya nyumbani: "Kiti - Viti", "Mtoto - Watoto". Fanya mchezo wa kutambua vitu.',
        materials: ['Flashcards', 'Vitu vya jikoni na sebuleni'],
        activity: 'Mchezo wa kuoanisha ngeli kwa kutumia vitu vilivyoko nyumbani.'
      },
      {
        day: 'Friday',
        time: '09:30 AM - 11:00 AM',
        subject: 'Agriculture & Community Project',
        topic: 'Sack Gardening & Seed Germination in Recycled Tins',
        script: 'Step outside to the balcony/compound: "Let us plant our own sukuma wiki nursery!"',
        materials: ['Recycled milk packet or tin', 'Soil & compost', 'Sukuma wiki / tomato seeds'],
        activity: 'Plant seeds, document date and watering schedule in learner portfolio.'
      }
    ]
  },
  {
    id: 'afro_cambridge_stem',
    creatorId: 'creator_stem_dad',
    creatorName: 'The AfroHomeschooler (@AfroHomeschooling)',
    creatorHandle: '@afro_homeschool',
    socialPlatform: 'Instagram & YouTube (28K Followers)',
    creatorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
    creatorBio: 'Engineer dad homeschooling 3 kids. Blending British Cambridge Primary with African History & Coding.',
    title: 'Cambridge Primary Year 5 STEM & Heritage Framework',
    badge: 'Creator Pick 2026',
    curriculum: 'Cambridge',
    grade: 'Year 5 (Cambridge)',
    tagline: 'Inquiry-based Cambridge Science + Python logic for independent learners',
    rating: 4.98,
    reviewsCount: 92,
    importsCount: 890,
    affiliateCommissionKes: 1800,
    highlights: [
      'Inquiry-based investigative experiments',
      'Weekly diagnostic checkpoint quizzes',
      'Integrated African historical science figures',
      'Official Cambridge transcript preparation'
    ],
    sampleWeekTheme: 'Forces, Friction and Algorithmic Thinking',
    sampleLessons: [
      {
        day: 'Monday',
        time: '09:00 AM - 10:00 AM',
        subject: 'Cambridge Science (Physics)',
        topic: 'Investigating Air Resistance with DIY Parachutes',
        script: 'Explore gravity and surface drag by testing plastic bag canopies of varying diameters.',
        materials: ['Plastic shopping bags', 'String', 'Small plastic toy / pebble', 'Stopwatch'],
        activity: 'Time descents from standard height and plot results on scatter graph.'
      },
      {
        day: 'Wednesday',
        time: '10:00 AM - 11:15 AM',
        subject: 'Cambridge Mathematics',
        topic: 'Data Analysis, Frequency Tables & Mean Averages',
        script: 'Transform real parachute timing experiments into mathematical standard deviation charts.',
        materials: ['Grid paper', 'Calculators'],
        activity: 'Calculate mean, median and mode of descent rates.'
      }
    ]
  }
];

export const creatorStore = {
  getTemplates: () => {
    try {
      const saved = localStorage.getItem(CREATOR_TEMPLATES_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_CREATOR_TEMPLATES;
  },

  getTemplateById: (id) => {
    const all = creatorStore.getTemplates();
    return all.find(t => t.id === id) || all[0];
  },

  createTemplate: async (templateData) => {
    const all = creatorStore.getTemplates();
    const newTemplate = {
      id: `template_${Date.now()}`,
      importsCount: 0,
      rating: 5.0,
      reviewsCount: 1,
      affiliateCommissionKes: 1500,
      ...templateData
    };
    const updated = [newTemplate, ...all];
    localStorage.setItem(CREATOR_TEMPLATES_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('creator_templates_updated', { detail: newTemplate }));

    // Background sync to Django backend
    api.createCreatorTemplate(newTemplate).catch(() => {});
    return newTemplate;
  },

  recordImport: (templateId) => {
    try {
      const all = creatorStore.getTemplates();
      const idx = all.findIndex(t => t.id === templateId);
      if (idx !== -1) {
        all[idx].importsCount = (all[idx].importsCount || 0) + 1;
        localStorage.setItem(CREATOR_TEMPLATES_KEY, JSON.stringify(all));
      }
      
      const aff = creatorStore.getAffiliateStats();
      aff.totalImports = (aff.totalImports || 0) + 1;
      aff.totalEarningsKes = (aff.totalEarningsKes || 0) + 1500;
      aff.recentConversions = aff.recentConversions || [];
      aff.recentConversions.unshift({
        id: `conv_${Date.now()}`,
        templateId,
        date: new Date().toLocaleDateString('en-GB'),
        commissionKes: 1500,
        status: 'Credited'
      });
      localStorage.setItem(CREATOR_AFFILIATE_KEY, JSON.stringify(aff));
      window.dispatchEvent(new CustomEvent('creator_affiliate_updated', { detail: aff }));
    } catch (e) {}
  },

  getAffiliateStats: () => {
    try {
      const saved = localStorage.getItem(CREATOR_AFFILIATE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      creatorHandle: '@mamateaches_ke',
      referralLink: 'https://somahome.ke/?ref=mamateaches',
      totalClicks: 3420,
      totalImports: 1420,
      payingConversions: 38,
      totalEarningsKes: 57000,
      pendingPayoutKes: 24500,
      mpesaPhone: '+254712345678',
      recentConversions: [
        { id: 'c1', parentName: 'Wambui M.', grade: 'Grade 4 CBC', date: 'Today, 10:14 AM', commissionKes: 1500, status: 'Credited' },
        { id: 'c2', parentName: 'Otieno D.', grade: 'Grade 4 CBC', date: 'Yesterday, 4:30 PM', commissionKes: 1500, status: 'Credited' },
        { id: 'c3', parentName: 'Fatma A.', grade: 'Year 5 Cambridge', date: '19-Sep-2026', commissionKes: 1800, status: 'Paid Out' }
      ]
    };
  },

  applyTemplateToChild: (template, childId = 'liam') => {
    const key = `somahome_active_template_${childId}`;
    localStorage.setItem(key, JSON.stringify(template));
    creatorStore.recordImport(template.id);
    window.dispatchEvent(new CustomEvent('child_template_applied', { detail: { childId, template } }));
    return true;
  }
};
