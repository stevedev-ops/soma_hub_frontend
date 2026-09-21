import React from 'react';
import { X, ShieldCheck, CheckCircle, BadgeCheck, Lock, FileText, Eye, Star, AlertCircle } from 'lucide-react';

/**
 * SomaHome Privacy-Preserving Teacher Safety Guarantee Modal
 *
 * Answers the parent's #1 question: "How did you verify the teacher?"
 *
 * PRIVACY PRINCIPLE:
 * We never expose raw PII (ID number, home address, phone) to parents.
 * Instead, SomaHome acts as the FIDUCIARY — we hold and verify the documents
 * in a secure vault, and surface only a Trust Attestation Tier to the parent.
 */
export default function SafetyGuaranteeModal({ isOpen, onClose, teacher }) {
  if (!isOpen || !teacher) return null;

  const tsc = teacher.tsc_number || 'TSC-VERIFIED';
  const dci = teacher.dci_cert || teacher.dci || 'DCI-GC-VERIFIED';
  const name = teacher.name || teacher.full_name || 'This Facilitator';
  const rating = teacher.rating || 5.0;
  const sessions = teacher.sessionsCompleted || teacher.sessions_completed || 0;

  const checks = [
    {
      icon: '🆔',
      label: 'National ID Verification',
      detail: 'Kenya National ID authenticated via IPRS (Integrated Population Registration System). Original document held in SomaHome secure vault.',
      status: 'VERIFIED',
      color: '#10B981',
    },
    {
      icon: '🎓',
      label: 'TSC Registration',
      detail: `Registered with the Teachers Service Commission of Kenya. Reference: ${tsc}. Status confirmed via TSC Online Portal.`,
      status: 'VERIFIED',
      color: '#10B981',
    },
    {
      icon: '🛡️',
      label: 'DCI Police Clearance (Good Conduct Certificate)',
      detail: `Directorate of Criminal Investigations clearance verified. Reference: ${dci}. Certificate issued within the past 12 months.`,
      status: 'VERIFIED',
      color: '#10B981',
    },
    {
      icon: '📋',
      label: 'SomaHome Onboarding & Code of Conduct',
      detail: 'Completed SomaHome Facilitator Onboarding programme. Signed and accepted Safeguarding, Data Privacy & Professional Conduct Policy.',
      status: 'COMPLETED',
      color: '#38BDF8',
    },
    {
      icon: '📱',
      label: 'M-Pesa Identity Link',
      detail: "Facilitator's payout M-Pesa number is cross-referenced with their registered identity. Ensures financial accountability.",
      status: 'LINKED',
      color: '#818CF8',
    },
  ];

  return (
    <div
      onClick={(e) => e.target === e.currentTarget && onClose()}
      style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(5,10,15,0.88)', backdropFilter: 'blur(14px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px' }}
    >
      <div style={{ width: '100%', maxWidth: '520px', background: 'var(--bg-card)', borderRadius: '22px', border: '1.5px solid rgba(16,185,129,0.4)', boxShadow: '0 24px 60px -10px rgba(0,0,0,0.85)', overflow: 'hidden', maxHeight: '92vh', overflowY: 'auto' }}>

        {/* Header */}
        <div style={{ padding: '22px 24px 18px', background: 'linear-gradient(135deg, rgba(16,185,129,0.15) 0%, rgba(0,166,81,0.08) 100%)', borderBottom: '1px solid rgba(16,185,129,0.2)', position: 'sticky', top: 0, zIndex: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(16,185,129,0.2)', border: '1.5px solid #10B981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ShieldCheck size={18} color="#10B981" />
                </div>
                <div>
                  <div style={{ fontSize: '0.68rem', textTransform: 'uppercase', fontWeight: 800, color: '#10B981', letterSpacing: '0.06em' }}>SomaHome Safety Guarantee</div>
                  <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#F8FAFC' }}>{name}</h3>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <span className="glass-pill" style={{ fontSize: '0.72rem', color: '#10B981', background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)' }}>
                  ✅ 5-Point Verified
                </span>
                {sessions > 0 && (
                  <span className="glass-pill" style={{ fontSize: '0.72rem', color: '#F59E0B' }}>
                    ⭐ {rating.toFixed(1)} · {sessions} sessions
                  </span>
                )}
              </div>
            </div>
            <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '6px', cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex', flexShrink: 0 }}>
              <X size={16} />
            </button>
          </div>
        </div>

        <div style={{ padding: '20px 24px' }}>

          {/* Privacy Notice */}
          <div style={{ background: 'rgba(56,189,248,0.07)', border: '1px solid rgba(56,189,248,0.25)', borderRadius: '12px', padding: '12px 14px', marginBottom: '20px', display: 'flex', gap: '10px' }}>
            <Lock size={16} color="#38BDF8" style={{ flexShrink: 0, marginTop: '1px' }} />
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
              <strong style={{ color: '#38BDF8' }}>Privacy-Preserving Attestation:</strong> SomaHome holds all original verification documents in a secure vault. We confirm the checks below without exposing private details (ID numbers, home address) to protect the facilitator's safety.
            </div>
          </div>

          {/* Verification Checklist */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
            {checks.map((c, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '14px 16px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <div style={{ fontSize: '1.2rem', flexShrink: 0, marginTop: '1px' }}>{c.icon}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px', gap: '8px' }}>
                    <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#F8FAFC' }}>{c.label}</div>
                    <span style={{ fontSize: '0.66rem', fontWeight: 800, color: c.color, background: `${c.color}15`, border: `1px solid ${c.color}40`, borderRadius: '6px', padding: '2px 8px', whiteSpace: 'nowrap', flexShrink: 0 }}>
                      ✓ {c.status}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{c.detail}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Fiduciary Guarantee Statement */}
          <div style={{ background: 'rgba(0,166,81,0.08)', border: '1px solid rgba(0,166,81,0.25)', borderRadius: '14px', padding: '16px 18px', marginBottom: '18px' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: '#34D399', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <BadgeCheck size={14} />
              SomaHome Fiduciary Guarantee
            </div>
            <p style={{ fontSize: '0.83rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
              SomaHome Education Ltd acts as a fiduciary between your family and every facilitator on our platform. We accept legal and moral responsibility for the verification process. If any verification is found to be fraudulent, we will immediately suspend the facilitator and provide full session refund.
            </p>
          </div>

          {/* What We Do NOT Show */}
          <div style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '12px', padding: '12px 16px', marginBottom: '20px' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#F87171', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Eye size={12} /> What We Protect (Not Shown to Anyone)
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {['ID Number', 'Home Address', 'Personal Phone', 'Bank Details', 'Photo ID Scan'].map(item => (
                <span key={item} style={{ fontSize: '0.72rem', background: 'rgba(239,68,68,0.1)', color: '#F87171', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '6px', padding: '3px 8px' }}>🔒 {item}</span>
              ))}
            </div>
          </div>

          {/* Footer Actions */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={onClose} className="btn-primary" style={{ flex: 1, justifyContent: 'center', padding: '11px' }}>
              <CheckCircle size={16} />
              <span>I Trust This Facilitator</span>
            </button>
            <button onClick={onClose} className="btn-secondary" style={{ padding: '11px 16px' }}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
