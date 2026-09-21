// Persistent Homeschool Tutoring Job Vacancies & Gigs Store
const VACANCIES_STORAGE_KEY = 'somahome_job_vacancies_v2';

const INITIAL_VACANCIES = [
  {
    id: 'JOB-201',
    title: 'Grade 4 CBC Science Experiments & Fractions Specialist',
    parentName: 'Steve Kariuki (Mama Liam)',
    parentPhone: '0712 345 678',
    studentName: 'Liam Kiprop (Grade 4 CBC)',
    estate: 'Kilimani, Wood Avenue Court 4B',
    sessionType: 'in_person',
    curriculum: 'KICD CBC Grade 4',
    subject: 'Science & Mathematics',
    schedule: '2 Days / Week • Tue & Thu 10:00 AM - 11:30 AM',
    hourlyRateKes: 2500,
    budgetTotalKes: 5000,
    status: 'open', // 'open' | 'claimed' | 'closed'
    postedDate: 'Today, 2 hours ago',
    claimedBy: null,
    claimedDate: null,
    requirements: 'Must be TSC accredited with experience in CBC Grade 4 experiential kitchen labs and fraction circles. Physical home visits in Kilimani.'
  },
  {
    id: 'JOB-202',
    title: 'Year 5 Cambridge Primary Science & Robotics Facilitator',
    parentName: 'Dr. Amina Patel',
    parentPhone: '0722 889 123',
    studentName: 'Aiden Patel (Year 5 Cambridge)',
    estate: 'Riverside / Lavington',
    sessionType: 'in_person',
    curriculum: 'Cambridge Primary Stage 5',
    subject: 'Science & Robotics',
    schedule: 'Every Saturday • 09:30 AM - 11:30 AM',
    hourlyRateKes: 3500,
    budgetTotalKes: 7000,
    status: 'open',
    postedDate: 'Yesterday',
    claimedBy: null,
    claimedDate: null,
    requirements: 'Cambridge Primary Science syllabus familiarity. Guide learner through hands-on water filtration and electrical circuits kit.'
  },
  {
    id: 'JOB-203',
    title: 'Kiswahili Mufti: Ngeli na Ushairi Booster (Virtual)',
    parentName: 'Grace Muthoni',
    parentPhone: '0733 445 566',
    studentName: 'Zawadi Muthoni (Grade 4 CBC)',
    estate: 'Virtual Live Classroom (Zoom / SomaLive)',
    sessionType: 'virtual',
    curriculum: 'KICD CBC Grade 4',
    subject: 'Kiswahili',
    schedule: 'Wednesdays & Fridays • 04:00 PM - 05:00 PM',
    hourlyRateKes: 1800,
    budgetTotalKes: 3600,
    status: 'claimed',
    postedDate: '2 days ago',
    claimedBy: {
      id: 4,
      name: 'Mwalimu Kevin Mwangi',
      role: 'Creative Arts & Kiswahili Lugha',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
      tsc_number: 'TSC-661902'
    },
    claimedDate: 'Yesterday at 3:15 PM',
    requirements: 'Focus on oral fluency, Ngeli za Nomino, and creative composition writing.'
  }
];

export const jobVacanciesService = {
  getAll: () => {
    try {
      const saved = localStorage.getItem(VACANCIES_STORAGE_KEY);
      return saved ? JSON.parse(saved) : INITIAL_VACANCIES;
    } catch {
      return INITIAL_VACANCIES;
    }
  },

  postVacancy: (newJob) => {
    const list = jobVacanciesService.getAll();
    const created = {
      ...newJob,
      id: `JOB-${Math.floor(200 + Math.random() * 800)}`,
      status: 'open',
      postedDate: 'Just now',
      claimedBy: null,
      claimedDate: null
    };
    const updated = [created, ...list];
    localStorage.setItem(VACANCIES_STORAGE_KEY, JSON.stringify(updated));
    return created;
  },

  claimJob: (jobId, teacher) => {
    const list = jobVacanciesService.getAll();
    const updated = list.map(job => {
      if (job.id === jobId) {
        return {
          ...job,
          status: 'claimed',
          claimedBy: {
            name: teacher.name || 'Teacher Mercy Cherono',
            role: teacher.role || 'Certified Educator',
            avatar: teacher.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
            tsc_number: teacher.tsc_number || 'TSC-881294'
          },
          claimedDate: 'Just now'
        };
      }
      return job;
    });
    localStorage.setItem(VACANCIES_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  }
};
