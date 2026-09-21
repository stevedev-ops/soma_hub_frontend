// SomaHome 30-Day Creator Referral Cookie & Attribution Store
// Ensures creators receive M-Pesa affiliate commissions when visitors convert within 30 days

const REF_STORAGE_KEY = 'somahome_ref_attribution_v1';
const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

export const referralAttributionStore = {
  // Ingest URL params (e.g. ?ref=mamateaches or ?template=mama_teaches_cbc4)
  ingestUrlParams: () => {
    try {
      const params = new URLSearchParams(window.location.search);
      const ref = params.get('ref') || params.get('creator') || params.get('affiliate');
      const template = params.get('template') || params.get('ref_template');

      if (ref || template) {
        const payload = {
          creatorHandle: ref ? (ref.startsWith('@') ? ref : `@${ref}`) : '@mamateaches_ke',
          templateId: template || '',
          capturedAt: Date.now(),
          expiresAt: Date.now() + THIRTY_DAYS_MS
        };
        localStorage.setItem(REF_STORAGE_KEY, JSON.stringify(payload));
        // Also set persistent document cookie
        document.cookie = `somahome_ref=${encodeURIComponent(payload.creatorHandle)}; max-age=${30 * 86400}; path=/; SameSite=Lax`;
        return payload;
      }
    } catch (e) {}
    return referralAttributionStore.getAttribution();
  },

  // Retrieve valid non-expired attribution
  getAttribution: () => {
    try {
      const saved = localStorage.getItem(REF_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Date.now() < parsed.expiresAt) {
          return parsed;
        } else {
          localStorage.removeItem(REF_STORAGE_KEY);
        }
      }
    } catch (e) {}
    return {
      creatorHandle: '@mamateaches_ke',
      templateId: 'mama_teaches_cbc4',
      isDefault: true
    };
  },

  // Attribute M-Pesa conversion to creator
  recordConversionOnPayment: async (paymentDetails = {}) => {
    const attr = referralAttributionStore.getAttribution();
    try {
      // Post to Django REST API
      fetch('http://localhost:8000/api/creators/affiliates/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          creatorHandle: attr.creatorHandle,
          templateId: attr.templateId,
          parentPhone: paymentDetails.phone || '',
          parentName: paymentDetails.name || 'Parent Subscriber',
          commissionKes: 1500
        })
      }).catch(() => {});
    } catch (e) {}
    return attr;
  }
};
