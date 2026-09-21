import React, { useState } from 'react';
import { 
  X, Users, ShieldCheck, CheckCircle2, AlertCircle, Phone, 
  ArrowRight, Lock, Copy, Share2, Sparkles, Building, Check, Clock
} from 'lucide-react';

export default function PodEscrowModal({ isOpen, onClose, pod = null }) {
  if (!isOpen) return null;

  const defaultPod = {
    id: 'pod-kilimani-4',
    name: 'Kilimani Grade 4 STEM Micro-Pod',
    estate: 'Kilimani / Dennis Pritt Rd',
    tutor: 'Teacher Sarah Wambui (Ex-Braeburn STEM Lead)',
    totalMonthlyFee: 25000,
    perFamilyFee: 5000,
    targetCapacity: 5,
    members: [
      { id: 1, parent: 'Steve Kiprop', child: 'Liam Kiprop', status: 'Paid', date: 'March 14, 2026', ref: 'QH72KL91X' },
      { id: 2, parent: 'Dr. Grace Mwangi', child: 'Wanjiku Mwangi', status: 'Paid', date: 'March 13, 2026', ref: 'QH69OP32B' },
      { id: 3, parent: 'Eng. Brian Ochieng', child: 'Amani Ochieng', status: 'Paid', date: 'March 15, 2026', ref: 'QH81MN44C' },
      { id: 4, parent: 'Sarah Kamau', child: 'Ethan Kamau', status: 'Pending', date: 'Due in 2 days', ref: null },
      { id: 5, parent: 'Vacant Slot', child: 'Reserve for Estate Neighbor', status: 'Available', date: null, ref: null }
    ]
  };

  const activePod = pod || defaultPod;

  const [members, setMembers] = useState(activePod.members || defaultPod.members);
  const [phone, setPhone] = useState('0712345678');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [copiedInvite, setCopiedInvite] = useState(false);

  const paidCount = members.filter(m => m.status === 'Paid').length;
  const fundedAmount = paidCount * (activePod.perFamilyFee || 5000);
  const totalFee = activePod.totalMonthlyFee || 25000;
  const percentFunded = Math.round((fundedAmount / totalFee) * 100);

  const handlePayEscrow = (e) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setPaymentSuccess(true);
      setMembers(prev => prev.map(m => m.id === 4 ? { ...m, status: 'Paid', date: 'Just now', ref: 'QH99XX88M' } : m));
    }, 1800);
  };

  const handleCopyInvite = () => {
    const inviteText = `Join our estate microschool pod on SomaHome: "${activePod.name}" in ${activePod.estate}. Co-op tutor fee split is KES ${(activePod.perFamilyFee || 5000).toLocaleString()}/month per child. Learn more: https://somahome.co.ke/pods/${activePod.id}`;
    navigator.clipboard.writeText(inviteText);
    setCopiedInvite(true);
    setTimeout(() => setCopiedInvite(false), 2500);
  };

  return (
    <div 
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(5, 10, 15, 0.88)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '20px'
      }}
    >
      <div style={{
        width: '100%',
        maxWidth: '820px',
        maxHeight: '90vh',
        overflowY: 'auto',
        borderRadius: '24px',
        background: '#0E1524',
        border: '1.5px solid rgba(16, 185, 129, 0.4)',
        boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.9)',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative'
      }}>
        
        {/* Header */}
        <div style={{
          padding: '24px 30px',
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(14, 21, 36, 0.95) 100%)',
          borderBottom: '1px solid var(--border-subtle)',
          position: 'relative'
        }}>
          <button
            onClick={onClose}
            type="button"
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              background: 'rgba(255,255,255,0.08)',
              border: 'none',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              color: 'var(--text-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <X size={18} />
          </button>

          <span className="glass-pill" style={{ color: '#10B981', border: '1px solid rgba(16,185,129,0.3)', marginBottom: '8px', fontSize: '0.72rem' }}>
            <Lock size={13} />
            <span>US-Style Pod Co-op Shared Escrow Vault (KaiPod Model)</span>
          </span>

          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, margin: '4px 0', color: '#F8FAFC' }}>
            {activePod.name}
          </h2>
          <div style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', display: 'flex', gap: '16px', marginTop: '4px' }}>
            <span>📍 {activePod.estate}</span>
            <span>Tutor: <strong style={{ color: '#34D399' }}>{activePod.tutor}</strong></span>
          </div>
        </div>

        {/* Content Body */}
        <div style={{ padding: '26px 30px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '22px' }}>
          
          {/* Escrow Pool Summary Card */}
          <div style={{ background: 'rgba(0,0,0,0.35)', border: '1px solid var(--border-card)', borderRadius: '18px', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', marginBottom: '14px' }}>
              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase' }}>
                  Total Monthly Escrow Pool
                </div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#F8FAFC', fontFamily: 'var(--font-mono)' }}>
                  KES {fundedAmount.toLocaleString()} <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 400 }}>/ KES {totalFee.toLocaleString()}</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '8px 14px', textAlign: 'right' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Split Share / Family</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#10B981' }}>KES {(activePod.perFamilyFee || 5000).toLocaleString()}/mo</div>
                </div>

                <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '12px', padding: '8px 14px', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Funding</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#10B981' }}>{percentFunded}%</div>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div style={{ width: '100%', height: '10px', background: 'rgba(0,0,0,0.5)', borderRadius: '999px', overflow: 'hidden', marginBottom: '10px' }}>
              <div style={{
                height: '100%',
                width: `${percentFunded}%`,
                background: 'linear-gradient(90deg, #10B981 0%, #38BDF8 100%)',
                borderRadius: '999px',
                transition: 'width 0.4s ease'
              }} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              <span>👥 {paidCount} of 5 Families Funded</span>
              <span>Next Payout: End of Month Upon Parent Verification</span>
            </div>
          </div>

          {/* Members Table */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h3 style={{ fontSize: '1rem', margin: 0, fontWeight: 700 }}>Pod Parent Ledger (5-Way Equal Split)</h3>
              <button
                onClick={handleCopyInvite}
                style={{
                  background: 'transparent', border: 'none', color: '#10B981',
                  cursor: 'pointer', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600
                }}
              >
                {copiedInvite ? <Check size={14} /> : <Copy size={14} />}
                <span>{copiedInvite ? 'Invite Copied!' : 'Invite Neighbor Family'}</span>
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {members.map(m => (
                <div 
                  key={m.id}
                  style={{
                    padding: '12px 16px',
                    borderRadius: '12px',
                    background: m.status === 'Paid' ? 'rgba(0,0,0,0.3)' : (m.status === 'Pending' ? 'rgba(245, 158, 11, 0.05)' : 'rgba(255,255,255,0.01)'),
                    border: m.status === 'Paid' ? '1px solid var(--border-subtle)' : (m.status === 'Pending' ? '1px solid rgba(245, 158, 11, 0.3)' : '1px dashed var(--border-subtle)'),
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '32px', height: '32px', borderRadius: '50%',
                      background: m.status === 'Paid' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255,255,255,0.06)',
                      color: m.status === 'Paid' ? '#10B981' : 'var(--text-muted)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 800, fontSize: '0.8rem'
                    }}>
                      {m.id}
                    </div>
                    <div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#F8FAFC' }}>{m.parent}</div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Child: {m.child}</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#F8FAFC', fontFamily: 'var(--font-mono)' }}>
                        KES {(activePod.perFamilyFee || 5000).toLocaleString()}
                      </div>
                      {m.date && <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{m.date}</div>}
                    </div>

                    <span className="glass-pill" style={{
                      fontSize: '0.7rem',
                      color: m.status === 'Paid' ? '#10B981' : (m.status === 'Pending' ? '#F59E0B' : 'var(--text-muted)'),
                      background: m.status === 'Paid' ? 'rgba(16, 185, 129, 0.1)' : 'transparent'
                    }}>
                      {m.status === 'Paid' && <CheckCircle2 size={12} />}
                      <span>{m.status}</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Card */}
          {!paymentSuccess ? (
            <div style={{
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(14, 21, 36, 0.8) 100%)',
              border: '1.5px solid rgba(16, 185, 129, 0.35)',
              borderRadius: '16px',
              padding: '20px'
            }}>
              <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#F8FAFC', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ShieldCheck size={18} color="#10B981" />
                <span>Complete Your Pod Escrow Share (KES {(activePod.perFamilyFee || 5000).toLocaleString()})</span>
              </div>
              <p style={{ margin: '0 0 14px 0', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Funds are held safely in SomaHome Escrow until sessions are verified by pod parents at month end.
              </p>

              <form onSubmit={handlePayEscrow} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="07XX XXX XXX"
                  required
                  style={{
                    flex: '1 1 200px', background: 'rgba(0,0,0,0.5)', border: '1px solid var(--border-card)',
                    borderRadius: '10px', padding: '10px 14px', color: '#F8FAFC', fontSize: '0.85rem',
                    fontFamily: 'var(--font-mono)'
                  }}
                />

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="btn-primary"
                  style={{ fontSize: '0.85rem', padding: '10px 22px', gap: '8px' }}
                >
                  {isProcessing ? (
                    <span>Sending M-Pesa STK Push...</span>
                  ) : (
                    <>
                      <span>Pay KES {(activePod.perFamilyFee || 5000).toLocaleString()} via M-Pesa</span>
                      <ArrowRight size={14} />
                    </>
                  )}
                </button>
              </form>
            </div>
          ) : (
            <div style={{
              background: 'rgba(16, 185, 129, 0.12)', border: '1.5px solid #10B981',
              borderRadius: '14px', padding: '16px', display: 'flex', alignItems: 'center', gap: '12px'
            }}>
              <CheckCircle2 size={28} color="#10B981" style={{ flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#10B981' }}>Escrow Contribution Confirmed!</div>
                <div style={{ fontSize: '0.8rem', color: '#E2E8F0', marginTop: '2px' }}>
                  M-Pesa STK Push confirmed (Ref: <strong>QH99XX88M</strong>). Funds held securely in the pod vault.
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div style={{
          padding: '14px 30px', background: 'rgba(8, 12, 20, 0.95)', borderTop: '1px solid var(--border-subtle)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem'
        }}>
          <span style={{ color: 'var(--text-muted)' }}>Pod Ref: {activePod.id}</span>
          <button
            onClick={onClose}
            className="btn-secondary"
            style={{ fontSize: '0.78rem', padding: '6px 16px' }}
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}