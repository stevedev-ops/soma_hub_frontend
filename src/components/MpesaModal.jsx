import React, { useState } from 'react';
import { Smartphone, CheckCircle, X, ShieldCheck, Loader2 } from 'lucide-react';
import { api } from '../services/api';

export default function MpesaModal({ packageData, onClose, onUnlocked }) {
  const [step, setStep] = useState('phone'); // phone, sim_prompt, success
  const [phone, setPhone] = useState('0712345678');
  const [pin, setPin] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [receipt, setReceipt] = useState('');

  const handleSendStk = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const res = await api.initiateMpesa(phone, packageData?.id);
    setIsLoading(false);
    setStep('sim_prompt');
  };

  const handleEnterPin = async (e) => {
    e.preventDefault();
    if (pin.length !== 4) return;
    setIsLoading(true);
    const res = await api.confirmMpesaPin('ws_CO_DEMO');
    setIsLoading(false);
    setReceipt(res.mpesa_receipt_number || 'SKM918274');
    setStep('success');
    if (onUnlocked) onUnlocked(packageData);
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '16px'
    }}>
      <div className="glass-panel" style={{
        maxWidth: '460px', width: '100%', background: '#0F172A', borderRadius: '24px',
        border: '1px solid rgba(0,166,81,0.5)', padding: '32px', position: 'relative', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.8)'
      }}>
        
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: '20px', right: '20px', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
        >
          <X size={20} />
        </button>

        {/* STEP 1: Enter Phone Number */}
        {step === 'phone' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#00A651', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                <Smartphone size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.25rem', margin: 0 }}>Lipa na M-PESA Online</h3>
                <span style={{ fontSize: '0.75rem', color: '#10B981', fontWeight: 700 }}>Safaricom Daraja API</span>
              </div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '14px', margin: '20px 0' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>ITEM:</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>{packageData?.title}</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#34D399', marginTop: '6px' }}>
                KES {parseInt(packageData?.price_kes || 6500).toLocaleString()}
              </div>
            </div>

            <form onSubmit={handleSendStk}>
              <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                Enter your Safaricom M-Pesa Phone Number:
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0712 345 678"
                required
                style={{
                  width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-card)',
                  borderRadius: '10px', padding: '12px 16px', color: '#ffffff', fontSize: '1.1rem', fontWeight: 700,
                  marginBottom: '20px', letterSpacing: '0.05em'
                }}
              />

              <button type="submit" disabled={isLoading} className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '14px' }}>
                {isLoading ? <Loader2 className="glow-animation" size={18} /> : <span>Send STK Push Prompt</span>}
              </button>
            </form>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '16px' }}>
              <ShieldCheck size={14} color="#10B981" />
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Instant automated activation upon PIN entry</span>
            </div>
          </div>
        )}

        {/* STEP 2: Realistic Safaricom STK Push SIM Popup Simulation */}
        {step === 'sim_prompt' && (
          <div style={{ textAlign: 'center' }}>
            
            {/* Phone Screen Mockup */}
            <div style={{
              background: '#020617', border: '2px solid #334155', borderRadius: '20px',
              padding: '24px 20px', margin: '0 auto 20px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
              position: 'relative'
            }}>
              <div style={{ fontSize: '0.75rem', color: '#94A3B8', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                📲 SIM Toolkit Prompt
              </div>

              <div style={{
                background: '#FFFFFF', color: '#0F172A', borderRadius: '12px', padding: '18px 16px',
                textAlign: 'left', border: '1px solid #CBD5E1', boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
              }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#00A651', marginBottom: '8px' }}>
                  SAFARICOM M-PESA
                </div>
                <div style={{ fontSize: '0.88rem', lineHeight: 1.4, color: '#1E293B', marginBottom: '14px' }}>
                  Do you want to pay <strong>KSh {parseInt(packageData?.price_kes || 6500).toLocaleString()}.00</strong> to <strong>SOMAHOME KENYA</strong> for Account: <strong>G4-TERM1</strong>?
                </div>

                <form onSubmit={handleEnterPin}>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: '#64748B', fontWeight: 600, marginBottom: '4px' }}>
                    Enter M-Pesa PIN:
                  </label>
                  <input
                    type="password"
                    maxLength={4}
                    value={pin}
                    autoFocus
                    onChange={(e) => setPin(e.target.value)}
                    placeholder="••••"
                    style={{
                      width: '100%', background: '#F1F5F9', border: '1px solid #94A3B8',
                      borderRadius: '6px', padding: '10px', fontSize: '1.4rem', textAlign: 'center',
                      letterSpacing: '0.3em', fontWeight: 800, color: '#0F172A', marginBottom: '14px'
                    }}
                  />
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      type="button"
                      onClick={() => setStep('phone')}
                      style={{ flex: 1, padding: '8px', background: '#E2E8F0', border: 'none', borderRadius: '6px', fontSize: '0.82rem', fontWeight: 700, color: '#475569', cursor: 'pointer' }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading || pin.length !== 4}
                      style={{ flex: 1, padding: '8px', background: '#00A651', border: 'none', borderRadius: '6px', fontSize: '0.82rem', fontWeight: 700, color: '#FFFFFF', cursor: 'pointer' }}
                    >
                      {isLoading ? 'Verifying...' : 'OK / Send'}
                    </button>
                  </div>
                </form>
              </div>

              <div style={{ fontSize: '0.72rem', color: '#64748B', marginTop: '14px' }}>
                Simulating Lipa na M-Pesa STK push prompt on {phone}
              </div>
            </div>

          </div>
        )}

        {/* STEP 3: Payment Success & Instant Unlock */}
        {step === 'success' && (
          <div style={{ textAlign: 'center', padding: '10px 0' }}>
            <div style={{
              width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(16,185,129,0.2)',
              color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px',
              border: '2px solid #10B981'
            }}>
              <CheckCircle size={36} />
            </div>

            <h3 style={{ fontSize: '1.4rem', color: '#F8FAFC', marginBottom: '6px' }}>Payment Confirmed!</h3>
            <div style={{ fontSize: '0.88rem', color: '#34D399', fontWeight: 700, marginBottom: '16px' }}>
              M-Pesa Receipt: {receipt}
            </div>

            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '16px', textAlign: 'left', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '24px', lineHeight: 1.6 }}>
              <div>📦 <strong>Homeschool Box:</strong> {packageData?.title}</div>
              <div>📅 <strong>Duration:</strong> 12 Weeks (Term 1)</div>
              <div>✨ <strong>Unlocked:</strong> Daily Parent Scripts, Sunday Printable Pack, Local Materials Science Labs, Report Card & WhatsApp Mentor Desk.</div>
            </div>

            <button onClick={onClose} className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '14px' }}>
              Start Learning Now ▶
            </button>
          </div>
        )}

      </div>
    </div>
  );
}