import React, { useState, useEffect } from 'react';
import { 
  X, Calendar, Clock, CheckCircle2, ShieldCheck, Sparkles, 
  ArrowRight, Sun, Sunset, Moon, Coffee, Award, AlertCircle, RotateCcw 
} from 'lucide-react';

const SCHEDULE_STORAGE_KEY = 'somahome_schedule_settings_v1';

export const DEFAULT_SCHEDULE_CONFIG = {
  pacingModel: '5_day', // '5_day' | '4_day' | 'weekend_shifted'
  routinePreset: 'standard', // 'early_bird' | 'standard' | 'afternoon' | 'evening' | 'custom'
  startTime: '08:45',
  endTime: '12:00',
  blockDuration: 35, // minutes per subject
  breakDuration: 15, // minutes break
  focusSubjectOrder: 'math_first', // 'math_first' | 'science_first' | 'balanced'
  daysActive: ['mon', 'tue', 'wed', 'thu', 'fri'],
  statutoryHoursWeekly: 15
};

export const getSavedScheduleConfig = () => {
  try {
    const saved = localStorage.getItem(SCHEDULE_STORAGE_KEY);
    return saved ? JSON.parse(saved) : DEFAULT_SCHEDULE_CONFIG;
  } catch {
    return DEFAULT_SCHEDULE_CONFIG;
  }
};

export default function FlexibleScheduleModal({ isOpen, onClose, onScheduleUpdated }) {
  if (!isOpen) return null;

  const [config, setConfig] = useState(getSavedScheduleConfig);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Calculate daily instructional minutes
  const activeDaysCount = config.daysActive.length;
  const blocksPerDay = 4; // 4 core subjects
  const dailyInstructionalMinutes = blocksPerDay * config.blockDuration;
  const weeklyHours = ((dailyInstructionalMinutes * activeDaysCount) / 60).toFixed(1);
  const isMoECompliant = parseFloat(weeklyHours) >= 14.0;

  const handlePacingChange = (model) => {
    let days = ['mon', 'tue', 'wed', 'thu', 'fri'];
    let blockDur = 35;

    if (model === '4_day') {
      days = ['mon', 'tue', 'wed', 'thu']; // Friday free for pod / nature
      blockDur = 45; // 45 mins to maintain 15h weekly
    } else if (model === 'weekend_shifted') {
      days = ['tue', 'wed', 'thu', 'fri', 'sat'];
      blockDur = 35;
    }

    setConfig(prev => ({
      ...prev,
      pacingModel: model,
      daysActive: days,
      blockDuration: blockDur
    }));
  };

  const handleRoutinePresetChange = (preset) => {
    let start = '08:45';
    let end = '12:00';

    if (preset === 'early_bird') {
      start = '07:45';
      end = '11:00';
    } else if (preset === 'afternoon') {
      start = '01:30';
      end = '04:45';
    } else if (preset === 'evening') {
      start = '04:30';
      end = '07:45';
    }

    setConfig(prev => ({
      ...prev,
      routinePreset: preset,
      startTime: start,
      endTime: end
    }));
  };

  const toggleDay = (dayKey) => {
    const exists = config.daysActive.includes(dayKey);
    let newDays = exists 
      ? config.daysActive.filter(d => d !== dayKey)
      : [...config.daysActive, dayKey];
    
    if (newDays.length === 0) newDays = ['mon']; // prevent 0 days
    setConfig(prev => ({ ...prev, daysActive: newDays, pacingModel: 'custom' }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    localStorage.setItem(SCHEDULE_STORAGE_KEY, JSON.stringify(config));
    setSaveSuccess(true);
    if (onScheduleUpdated) onScheduleUpdated(config);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 1200);
  };

  const handleResetDefault = () => {
    setConfig(DEFAULT_SCHEDULE_CONFIG);
    localStorage.setItem(SCHEDULE_STORAGE_KEY, JSON.stringify(DEFAULT_SCHEDULE_CONFIG));
    if (onScheduleUpdated) onScheduleUpdated(DEFAULT_SCHEDULE_CONFIG);
  };

  return (
    <div 
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(5, 10, 15, 0.9)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '20px'
      }}
    >
      <div 
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '740px',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: '24px',
          border: '1.5px solid rgba(16, 185, 129, 0.4)',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.9)',
          background: '#0E1524',
          overflow: 'hidden'
        }}
      >
        {/* Header */}
        <div style={{
          padding: '24px 28px',
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.18) 0%, rgba(14, 21, 36, 0.95) 100%)',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <div className="glass-pill" style={{ color: '#10B981', border: '1px solid rgba(16,185,129,0.3)', marginBottom: '6px', fontSize: '0.72rem' }}>
              <Sparkles size={13} style={{ display: 'inline', marginRight: '4px' }} />
              <span>Family Routine & Flexibility Engine</span>
            </div>
            <h2 style={{ fontSize: '1.4rem', margin: 0, fontWeight: 800, color: '#F8FAFC' }}>
              Flexible Homeschool Schedule Planner
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.84rem', margin: '3px 0 0 0' }}>
              Tailor daily hours, 4-day vs 5-day week, and lesson pacing to match your household lifestyle.
            </p>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: 'none',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              fontSize: '1.1rem'
            }}
          >
            ✕
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSave} style={{ padding: '24px 28px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* 1. WEEKLY PACING MODEL */}
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', color: '#F8FAFC', fontWeight: 700, marginBottom: '8px' }}>
              1. Choose Weekly Pacing Cadence:
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
              
              <div 
                onClick={() => handlePacingChange('5_day')}
                style={{
                  padding: '14px',
                  borderRadius: '12px',
                  border: config.pacingModel === '5_day' ? '2px solid #10B981' : '1px solid var(--border-card)',
                  background: config.pacingModel === '5_day' ? 'rgba(16,185,129,0.15)' : 'rgba(0,0,0,0.3)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#F8FAFC' }}>5-Day Standard</div>
                <div style={{ fontSize: '0.74rem', color: '#10B981', marginTop: '2px' }}>Mon — Fri • 3h/Day</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '6px' }}>
                  Traditional balanced rhythm matching Kenyan school terms.
                </div>
              </div>

              <div 
                onClick={() => handlePacingChange('4_day')}
                style={{
                  padding: '14px',
                  borderRadius: '12px',
                  border: config.pacingModel === '4_day' ? '2px solid #38BDF8' : '1px solid var(--border-card)',
                  background: config.pacingModel === '4_day' ? 'rgba(56,189,248,0.15)' : 'rgba(0,0,0,0.3)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#F8FAFC' }}>4-Day Power Week</div>
                <div style={{ fontSize: '0.74rem', color: '#38BDF8', marginTop: '2px' }}>Mon — Thu • 3.75h/Day</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '6px' }}>
                  Fridays reserved for Karura nature walks, pod meetups & sports!
                </div>
              </div>

              <div 
                onClick={() => handlePacingChange('weekend_shifted')}
                style={{
                  padding: '14px',
                  borderRadius: '12px',
                  border: config.pacingModel === 'weekend_shifted' ? '2px solid #F59E0B' : '1px solid var(--border-card)',
                  background: config.pacingModel === 'weekend_shifted' ? 'rgba(245,158,11,0.15)' : 'rgba(0,0,0,0.3)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#F8FAFC' }}>Weekend-Shifted</div>
                <div style={{ fontSize: '0.74rem', color: '#F59E0B', marginTop: '2px' }}>Tue — Sat • 3h/Day</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '6px' }}>
                  Ideal for parents working Mondays or off on Saturdays.
                </div>
              </div>

            </div>
          </div>

          {/* Active Days Toggle Pills */}
          <div>
            <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', marginBottom: '6px', fontWeight: 600 }}>
              Active Learning Days this Week:
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {[
                { k: 'mon', label: 'Mon' },
                { k: 'tue', label: 'Tue' },
                { k: 'wed', label: 'Wed' },
                { k: 'thu', label: 'Thu' },
                { k: 'fri', label: 'Fri' },
                { k: 'sat', label: 'Sat' },
                { k: 'sun', label: 'Sun' }
              ].map(d => {
                const active = config.daysActive.includes(d.k);
                return (
                  <button
                    key={d.k}
                    type="button"
                    onClick={() => toggleDay(d.k)}
                    style={{
                      padding: '6px 14px',
                      borderRadius: '8px',
                      border: active ? '1.5px solid #10B981' : '1px solid var(--border-subtle)',
                      background: active ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.03)',
                      color: active ? '#10B981' : 'var(--text-muted)',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    {d.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. DAILY TIME WINDOW PRESETS */}
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', color: '#F8FAFC', fontWeight: 700, marginBottom: '8px' }}>
              2. Select Daily Instructional Rhythm:
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              
              <div
                onClick={() => handleRoutinePresetChange('early_bird')}
                style={{
                  padding: '12px 14px',
                  borderRadius: '12px',
                  border: config.routinePreset === 'early_bird' ? '1.5px solid #10B981' : '1px solid var(--border-card)',
                  background: config.routinePreset === 'early_bird' ? 'rgba(16,185,129,0.12)' : 'rgba(0,0,0,0.25)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}
              >
                <Sun size={22} color="#F59E0B" />
                <div>
                  <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#F8FAFC' }}>🌅 Early Bird Morning</div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>07:45 AM — 11:00 AM</div>
                </div>
              </div>

              <div
                onClick={() => handleRoutinePresetChange('standard')}
                style={{
                  padding: '12px 14px',
                  borderRadius: '12px',
                  border: config.routinePreset === 'standard' ? '1.5px solid #10B981' : '1px solid var(--border-card)',
                  background: config.routinePreset === 'standard' ? 'rgba(16,185,129,0.12)' : 'rgba(0,0,0,0.25)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}
              >
                <Clock size={22} color="#10B981" />
                <div>
                  <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#F8FAFC' }}>☀️ Standard Daytime</div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>08:45 AM — 12:00 PM</div>
                </div>
              </div>

              <div
                onClick={() => handleRoutinePresetChange('afternoon')}
                style={{
                  padding: '12px 14px',
                  borderRadius: '12px',
                  border: config.routinePreset === 'afternoon' ? '1.5px solid #10B981' : '1px solid var(--border-card)',
                  background: config.routinePreset === 'afternoon' ? 'rgba(16,185,129,0.12)' : 'rgba(0,0,0,0.25)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}
              >
                <Sunset size={22} color="#38BDF8" />
                <div>
                  <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#F8FAFC' }}>🌤️ Afternoon Rhythm</div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>01:30 PM — 04:45 PM</div>
                </div>
              </div>

              <div
                onClick={() => handleRoutinePresetChange('evening')}
                style={{
                  padding: '12px 14px',
                  borderRadius: '12px',
                  border: config.routinePreset === 'evening' ? '1.5px solid #10B981' : '1px solid var(--border-card)',
                  background: config.routinePreset === 'evening' ? 'rgba(16,185,129,0.12)' : 'rgba(0,0,0,0.25)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}
              >
                <Moon size={22} color="#818CF8" />
                <div>
                  <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#F8FAFC' }}>🌙 Working Parent Evening</div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>04:30 PM — 07:45 PM</div>
                </div>
              </div>

            </div>
          </div>

          {/* 3. BLOCK DURATION & POMODORO */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '6px' }}>
                Subject Block Duration:
              </label>
              <select
                className="custom-select"
                value={config.blockDuration}
                onChange={(e) => setConfig({ ...config, blockDuration: parseInt(e.target.value) })}
                style={{ width: '100%' }}
              >
                <option value={25}>25 Mins (Pomodoro • Best for Grade 1-4)</option>
                <option value={35}>35 Mins (Standard CBC Period)</option>
                <option value={45}>45 Mins (Deep Focus / Cambridge)</option>
                <option value={60}>60 Mins (Intensive STEM Labs)</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '6px' }}>
                Priority Subject Ordering:
              </label>
              <select
                className="custom-select"
                value={config.focusSubjectOrder}
                onChange={(e) => setConfig({ ...config, focusSubjectOrder: e.target.value })}
                style={{ width: '100%' }}
              >
                <option value="math_first">📐 Mathematics First (Fresh Mind)</option>
                <option value="science_first">🔬 Science & Labs First</option>
                <option value="balanced">📖 Reading & Literacy First</option>
              </select>
            </div>
          </div>

          {/* 4. STATUTORY MOE COMPLIANCE GUARANTEE CARD */}
          <div style={{
            background: isMoECompliant ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
            border: isMoECompliant ? '1px solid rgba(16,185,129,0.35)' : '1px solid rgba(239,68,68,0.35)',
            borderRadius: '14px',
            padding: '16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <ShieldCheck size={28} color={isMoECompliant ? '#10B981' : '#EF4444'} />
              <div>
                <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#F8FAFC' }}>
                  {isMoECompliant ? '✅ 100% Kenya MoE Statutory Compliant' : '⚠️ Below Statutory Minimum'}
                </div>
                <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  Your schedule logs <strong style={{ color: '#F8FAFC' }}>{weeklyHours} Hours/Week</strong> ({activeDaysCount} days × {((dailyInstructionalMinutes)/60).toFixed(1)}h).
                  Target: 14 – 18 Hours/Week.
                </div>
              </div>
            </div>

            <span className="glass-pill" style={{ color: isMoECompliant ? '#10B981' : '#EF4444', fontWeight: 800, fontSize: '0.74rem' }}>
              {weeklyHours}h / 15h Target
            </span>
          </div>

          {saveSuccess && (
            <div style={{ padding: '12px', background: 'rgba(16,185,129,0.2)', border: '1px solid #10B981', borderRadius: '10px', color: '#34D399', textAlign: 'center', fontSize: '0.84rem' }}>
              ✓ Homeschool routine updated! Today's Homeschool OS and Liam's Dashboard synced.
            </div>
          )}

          {/* Action Buttons */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid var(--border-subtle)' }}>
            <button
              type="button"
              onClick={handleResetDefault}
              className="btn-secondary"
              style={{ fontSize: '0.78rem', padding: '6px 14px', gap: '6px' }}
            >
              <RotateCcw size={12} />
              <span>Reset to KICD Default</span>
            </button>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary"
                style={{ padding: '8px 18px', fontSize: '0.84rem' }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary"
                style={{ padding: '8px 24px', fontSize: '0.84rem', gap: '6px' }}
              >
                <span>Save Family Routine</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
}
