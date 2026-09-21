// Persistent Homeschool Tutoring Job Vacancies & Gigs Store (Clean 0-Mock State)
const VACANCIES_STORAGE_KEY = 'somahome_job_vacancies_v2';

export const jobVacanciesService = {
  getAll: () => {
    try {
      const saved = localStorage.getItem(VACANCIES_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
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
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('somahome_vacancies_updated', { detail: updated }));
    }
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
            name: teacher.name || 'Certified Educator',
            role: teacher.role || 'Educator',
            avatar: teacher.avatar || '',
            tsc_number: teacher.tsc_number || ''
          },
          claimedDate: 'Just now'
        };
      }
      return job;
    });
    localStorage.setItem(VACANCIES_STORAGE_KEY, JSON.stringify(updated));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('somahome_vacancies_updated', { detail: updated }));
    }
    return updated;
  }
};
