import React, { useState } from 'react';
import { X, ArrowRight, ArrowLeft, CheckCircle, BookOpen, Calendar, Package, Users, Sparkles } from 'lucide-react';
import { onboardingStore } from '../../services/portfolioStore';

const STEPS = [
  { id: 1, icon: '👋', title: 'Welcome to SomaHome!', subtitle: "Kenya's first complete Homeschool Operating System" },
  { id: 2, icon: '📚', title: 'Choose Your Curriculum', subtitle: 'Which framework will your child follow?' },
  { id: 3, icon: '👦', title: 'Add Your First Child', subtitle: 'Tell us about your learner' },
  { id: 4, icon: '📅', title: 'Set Your Weekly Schedule', subtitle: 'How many learning days per week?' },
  { id: 5, icon: '🎁', title: "You're All Set!", subtitle: 'Explore your SomaHome dashboard' },
];

export default function OnboardingWizard({ onComplete }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    curriculum: 'CBC',
    childName: '',
    grade: 'Grade 4',
    daysPerWeek: 5,
    startKit: 'standard',
  });

  const updateForm = (key, value) => setForm(p => ({ ...p, [key]: value }));

  const handleComplete = () => {
    onboardingStore.markDone();
    if (onComplete) onComplete(form);
  };

  const progress = ((step - 1) / (STEPS.length - 1)) * 100;

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(5,10,15,0.92)', backdropFilter: 'blur(16px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000, padding: '20px' }}>
      <div style={{ width: '100%', maxWidth: '520px', background: 'var(--bg-card)', borderRadius: '24px', border: '1.5px solid rgba(0,166,81,0.3)', boxShadow: '0 30px 70px -15px rgba(0,0,0,0.9)', overflow: 'hidden' }}>

        {/* Progress Bar */}
        <div style={{ height: '4px', background: 'rgba(255,255,255,0.07)' }}>
          <div style={{ height: '100%', width: `${progress}%`, background: 'linear-gradient(90deg, #00A651, #10B981)', transition: 'width 0.4s ease' }} />
        </div>

        {/* Step Indicator */}
        <div style={{ padding: '16px 24px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '6px' }}>
            {STEPS.map(s => (
              <div key={s.id} style={{ width: '28px', height: '4px', borderRadius: '2px', background: step >= s.id ? '#00A651' : 'rgba(255,255,255,0.1)', transition: 'background 0.3s' }} />
            ))}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Step {step} of {STEPS.length}</span>
        </div>

        <div style={{ padding: '28px 32px 32px' }}>
          {/* Step Icon + Title */}
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <div style={{ fontSize: '3rem', marginBottom: '12px' }}>{STEPS[step - 1].icon}</div>
            <h2 style={{ fontSize: '1.5rem', margin: '0 0 6px', fontWeight: 800 }}>{STEPS[step - 1].title}</h2>
            <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.9rem' }}>{STEPS[step - 1].subtitle}</p>
          </div>

          {/* Step Content */}
          {step === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { icon: '🎓', text: 'Full CBC & Cambridge curriculum syllabi loaded' },
                { icon: '👨‍🏫', text: 'Verified Nairobi tutors ready to book' },
                { icon: '📊', text: 'MoE-compliant attendance & portfolio tracking' },
                { icon: '🏡', text: 'Community pods & daytime socialization events' },
              ].map(item => (
                <div key={item.text} style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(0,166,81,0.06)', border: '1px solid rgba(0,166,81,0.2)', borderRadius: '10px', padding: '11px 14px' }}>
                  <span style={{ fontSize: '1.2rem' }}>{item.icon}</span>
                  <span style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>{item.text}</span>
                </div>
              ))}
            </div>
          )}

          {step === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { value: 'CBC', label: '🇰🇪 Kenya CBC (KICD)', desc: 'Competency-Based Curriculum — national standard. Grades PP1–Grade 9.', color: '#00A651' },
                { value: 'CAMBRIDGE', label: '🇬🇧 Cambridge International', desc: 'CAIE Primary & Checkpoint — globally recognized. Stages 1–9.', color: '#38BDF8' },
                { value: 'HYBRID', label: '🔀 CBC + Cambridge Hybrid', desc: 'CBC core subjects + Cambridge English, Maths, Science enrichment.', color: '#818CF8' },
              ].map(opt => (
                <div
                  key={opt.value}
                  onClick={() => updateForm('curriculum', opt.value)}
                  style={{ border: `2px solid ${form.curriculum === opt.value ? opt.color : 'var(--border-subtle)'}`, background: form.curriculum === opt.value ? `${opt.color}10` : 'rgba(255,255,255,0.02)', borderRadius: '12px', padding: '14px 16px', cursor: 'pointer', transition: 'all 0.2s' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: '0.95rem', fontWeight: 700, color: form.curriculum === opt.value ? opt.color : '#F8FAFC' }}>{opt.label}</div>
                    {form.curriculum === opt.value && <CheckCircle size={16} color={opt.color} fill={opt.color} />}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '3px' }}>{opt.desc}</div>
                </div>
              ))}
            </div>
          )}

          {step === 3 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '6px' }}>Child's Name *</label>
                <input required value={form.childName} onChange={e => updateForm('childName', e.target.value)} placeholder="e.g. Liam Kiprop" style={{ width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-card)', borderRadius: '10px', padding: '11px 14px', color: '#F8FAFC', fontSize: '1rem', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '6px' }}>Current Grade / Level *</label>
                <select value={form.grade} onChange={e => updateForm('grade', e.target.value)} className="custom-select" style={{ width: '100%' }}>
                  {['PP1 (Pre-Primary 1)', 'PP2 (Pre-Primary 2)', 'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7 (JSS 1)', 'Grade 8 (JSS 2)', 'Grade 9 (JSS 3)'].map(g => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {step === 4 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '10px' }}>Learning Days Per Week</label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  {[3, 4, 5].map(d => (
                    <div key={d} onClick={() => updateForm('daysPerWeek', d)} style={{ flex: 1, textAlign: 'center', border: `2px solid ${form.daysPerWeek === d ? '#10B981' : 'var(--border-subtle)'}`, background: form.daysPerWeek === d ? 'rgba(16,185,129,0.1)' : 'rgba(255,255,255,0.02)', borderRadius: '12px', padding: '16px 10px', cursor: 'pointer', transition: 'all 0.2s' }}>
                      <div style={{ fontSize: '1.5rem', fontWeight: 800, color: form.daysPerWeek === d ? '#10B981' : '#F8FAFC' }}>{d}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{d === 3 ? 'Flexible' : d === 4 ? 'Standard' : 'Full Week'}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '14px 16px' }}>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                  📋 <strong style={{ color: '#F59E0B' }}>MoE Compliance:</strong> The Ministry of Education requires a minimum of <strong>900 instructional hours</strong> per year. Your schedule will be automatically calculated. You can adjust this in Flexible Schedule settings anytime.
                </div>
              </div>
            </div>
          )}

          {step === 5 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ background: 'rgba(0,166,81,0.08)', border: '1px solid rgba(0,166,81,0.25)', borderRadius: '14px', padding: '18px' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: '#34D399', marginBottom: '12px' }}>Your Setup Summary</div>
                {[
                  { label: 'Curriculum', value: form.curriculum },
                  { label: 'Learner', value: form.childName || 'My Child' },
                  { label: 'Grade', value: form.grade },
                  { label: 'Schedule', value: `${form.daysPerWeek} days/week` },
                ].map(r => (
                  <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.86rem', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    <span style={{ color: 'var(--text-muted)' }}>{r.label}</span>
                    <strong style={{ color: '#F8FAFC' }}>{r.value}</strong>
                  </div>
                ))}
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textAlign: 'center', lineHeight: 1.7 }}>
                🎉 Welcome to SomaHome! Your dashboard is ready.<br />
                <span style={{ color: '#10B981' }}>Start with today's Daily Schedule →</span>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div style={{ display: 'flex', gap: '10px', marginTop: '28px' }}>
            {step > 1 && (
              <button onClick={() => setStep(s => s - 1)} className="btn-secondary" style={{ padding: '11px 20px' }}>
                <ArrowLeft size={16} /><span>Back</span>
              </button>
            )}
            <button
              onClick={() => { if (step < STEPS.length) setStep(s => s + 1); else handleComplete(); }}
              disabled={step === 3 && !form.childName.trim()}
              className="btn-primary"
              style={{ flex: 1, justifyContent: 'center', padding: '12px', opacity: step === 3 && !form.childName.trim() ? 0.5 : 1 }}
            >
              {step < STEPS.length ? <><span>Continue</span><ArrowRight size={16} /></> : <><Sparkles size={16} /><span>Go to My Dashboard!</span></>}
            </button>
          </div>

          {step === 1 && (
            <button onClick={handleComplete} style={{ width: '100%', background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '0.78rem', cursor: 'pointer', marginTop: '10px', textDecoration: 'underline' }}>
              Skip — I'll set up later
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
