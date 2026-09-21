/**
 * portfolioStore.js
 * Shared localStorage-backed portfolio & activity store for SomaHome.
 * Used by: ArtStudio, ReadingProgram, ScienceLab, StudentDashboard (PIN XP),
 *           PlacementEngine (ILP), and UpcomingSessions.
 */

const KEYS = {
  artworks: 'soma_portfolio_artworks',
  readingLog: 'soma_portfolio_reading_log',
  scienceProjects: 'soma_portfolio_science',
  xp: 'soma_student_xp',
  ilp: 'soma_ilp_current',
  ilpHistory: 'soma_ilp_history',
  senSettings: 'soma_sen_settings',
  onboardingDone: 'soma_onboarding_complete',
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const load = (key, fallback = []) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};
const save = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn('portfolioStore: localStorage write failed', e);
  }
};

// ─── Artwork Portfolio ────────────────────────────────────────────────────────
export const artworkStore = {
  getAll: () => load(KEYS.artworks, []),
  add: (artwork) => {
    const existing = load(KEYS.artworks, []);
    const entry = {
      id: Date.now(),
      uploadedAt: new Date().toISOString(),
      ...artwork,
    };
    save(KEYS.artworks, [entry, ...existing]);
    return entry;
  },
  remove: (id) => {
    const existing = load(KEYS.artworks, []);
    save(KEYS.artworks, existing.filter((a) => a.id !== id));
  },
  count: () => load(KEYS.artworks, []).length,
};

// ─── Reading Log ──────────────────────────────────────────────────────────────
export const readingStore = {
  getAll: () => load(KEYS.readingLog, []),
  add: ({ bookTitle, minutes, comprehensionStars = 5, notes = '' }) => {
    const existing = load(KEYS.readingLog, []);
    const entry = {
      id: Date.now(),
      bookTitle,
      minutes: Number(minutes),
      comprehensionStars,
      notes,
      loggedAt: new Date().toISOString(),
      date: new Date().toLocaleDateString('en-KE', { weekday: 'short', day: 'numeric', month: 'short' }),
    };
    save(KEYS.readingLog, [entry, ...existing]);
    return entry;
  },
  totalMinutes: () => load(KEYS.readingLog, []).reduce((sum, e) => sum + (e.minutes || 0), 0),
  todayMinutes: () => {
    const today = new Date().toDateString();
    return load(KEYS.readingLog, [])
      .filter((e) => new Date(e.loggedAt).toDateString() === today)
      .reduce((sum, e) => sum + (e.minutes || 0), 0);
  },
  sessionCount: () => load(KEYS.readingLog, []).length,
};

// ─── Science Projects ─────────────────────────────────────────────────────────
export const scienceStore = {
  getAll: () => load(KEYS.scienceProjects, []),
  add: (project) => {
    const existing = load(KEYS.scienceProjects, []);
    const entry = { id: Date.now(), submittedAt: new Date().toISOString(), ...project };
    save(KEYS.scienceProjects, [entry, ...existing]);
    return entry;
  },
  count: () => load(KEYS.scienceProjects, []).length,
};

// ─── Student XP / Arcade ──────────────────────────────────────────────────────
export const xpStore = {
  get: () => {
    try { return parseInt(localStorage.getItem(KEYS.xp) || '0', 10); }
    catch { return 0; }
  },
  add: (points) => {
    const current = xpStore.get();
    const next = current + points;
    localStorage.setItem(KEYS.xp, String(next));
    return next;
  },
  getLevel: () => {
    const xp = xpStore.get();
    if (xp >= 500) return { level: 4, title: 'Homeschool Champion 🏆', color: '#F59E0B' };
    if (xp >= 250) return { level: 3, title: 'Rising Scholar ⭐', color: '#10B981' };
    if (xp >= 100) return { level: 2, title: 'Curious Explorer 🔭', color: '#38BDF8' };
    return { level: 1, title: 'Young Learner 🌱', color: '#818CF8' };
  },
};

// ─── ILP (Individual Learning Plan) ──────────────────────────────────────────
export const ilpStore = {
  getCurrent: () => load(KEYS.ilp, null),
  apply: (ilpData) => {
    save(KEYS.ilp, { ...ilpData, appliedAt: new Date().toISOString() });
    const history = load(KEYS.ilpHistory, []);
    save(KEYS.ilpHistory, [{ ...ilpData, appliedAt: new Date().toISOString() }, ...history.slice(0, 4)]);
  },
  hasActive: () => !!load(KEYS.ilp, null),
  clear: () => { localStorage.removeItem(KEYS.ilp); },
};

// ─── SEN Settings ─────────────────────────────────────────────────────────────
export const senStore = {
  get: () => load(KEYS.senSettings, {
    dyslexiaFont: false,
    highContrast: false,
    largeFonts: false,
    extendedTime: false,
  }),
  save: (settings) => save(KEYS.senSettings, settings),
};

// ─── Onboarding ───────────────────────────────────────────────────────────────
export const onboardingStore = {
  isDone: () => localStorage.getItem(KEYS.onboardingDone) === 'true',
  markDone: () => localStorage.setItem(KEYS.onboardingDone, 'true'),
  reset: () => localStorage.removeItem(KEYS.onboardingDone),
};

export default {
  artworkStore,
  readingStore,
  scienceStore,
  xpStore,
  ilpStore,
  senStore,
  onboardingStore,
};
