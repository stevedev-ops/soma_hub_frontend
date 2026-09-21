// Creator Template Marketplace & 30-Day Attribution Store (Clean 0-Mock State)
import api from './api';

const CREATOR_TEMPLATES_KEY = 'somahome_creator_templates_v2';
const CREATOR_AFFILIATE_KEY = 'somahome_creator_affiliate_v2';

export const INITIAL_CREATOR_TEMPLATES = [];

export const creatorStore = {
  getTemplates: () => {
    try {
      const saved = localStorage.getItem(CREATOR_TEMPLATES_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [];
  },

  getTemplateById: (id) => {
    const all = creatorStore.getTemplates();
    return all.find(t => t.id === id) || null;
  },

  createTemplate: async (templateData) => {
    const all = creatorStore.getTemplates();
    const newTemplate = {
      id: `template_${Date.now()}`,
      importsCount: 0,
      rating: 5.0,
      reviewsCount: 0,
      affiliateCommissionKes: 1500,
      ...templateData
    };
    const updated = [newTemplate, ...all];
    localStorage.setItem(CREATOR_TEMPLATES_KEY, JSON.stringify(updated));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('creator_templates_updated', { detail: newTemplate }));
    }

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
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('creator_affiliate_updated', { detail: aff }));
      }
    } catch (e) {}
  },

  getAffiliateStats: (creatorHandle = '') => {
    try {
      const saved = localStorage.getItem(CREATOR_AFFILIATE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      creatorHandle: creatorHandle || '@creator',
      referralLink: `https://soma-hub-phi.vercel.app/?ref=${creatorHandle ? creatorHandle.replace('@', '') : 'creator'}`,
      totalClicks: 0,
      totalImports: 0,
      payingConversions: 0,
      totalEarningsKes: 0,
      pendingPayoutKes: 0,
      mpesaPhone: '',
      recentConversions: []
    };
  },

  applyTemplateToChild: (template, childId = '') => {
    if (!childId || !template) return false;
    const key = `somahome_active_template_${childId}`;
    localStorage.setItem(key, JSON.stringify(template));
    creatorStore.recordImport(template.id);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('child_template_applied', { detail: { childId, template } }));
    }
    return true;
  }
};
