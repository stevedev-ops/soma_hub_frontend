import React, { useState } from 'react';
import { 
  X, Clock, Activity, Zap, CheckCircle2, AlertCircle, BarChart3, 
  Calendar, Award, Sparkles, ShieldCheck, Download, ArrowUpRight
} from 'lucide-react';
import { telemetryService } from '../../services/homeworkTelemetryStore';

export default function StudentActivityTelemetryModal({ isOpen, onClose, studentName = 'Liam Kiprop' }) {
  if (!isOpen) return null;

  const [telemetry, setTelemetry] = useState(() => telemetryService.getTelemetry(studentName));

  const hours = Math.floor(telemetry.totalActiveMinutes / 60);
  const minutes = telemetry.totalActiveMinutes % 60;
  const statutoryMet = telemetry.totalActiveMinutes >= telemetry.targetStatutoryMinutes;

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
        
        {/* Top Header */}
        <div style={{
          padding: '26px 30px',
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
            <Activity size={13} className="animate-pulse" />
            <span>Live Student Active Time Telemetry & Focus Analytics</span>
          </span>

          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, margin: '4px 0', color: '#F8FAFC' }}>
            {studentName}'s Active Learning Telemetry
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.86rem', margin: 0 }}>
            Real-time tracking of active study, hands-on lab experiments, reading, and masterclass participation.
          </p>
        </div>

        {/* Content Body */}
        <div style={{ padding: '26px 30px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '22px' }}>
          
          {/* 3 Metric Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            
            <div style={{ background: 'rgba(0,0,0,0.35)', border: '1px solid rgba(16, 185, 129, 0.35)', borderRadius: '16px', padding: '18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase' }}>
                <span>Active Time Today</span>
                <Clock size={16} color="#10B981" />
              </div>
              <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#F8FAFC', fontFamily: 'var(--font-mono)', margin: '8px 0' }}>
                {hours}h {minutes}m
              </div>
              <div style={{ fontSize: '0.75rem', color: '#10B981', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <CheckCircle2 size={14} />
                <span>{statutoryMet ? 'Statutory 3.0h Quota Exceeded!' : 'In progress toward 3.0h'}</span>
              </div>
            </div>

            <div style={{ background: 'rgba(0,0,0,0.35)', border: '1px solid var(--border-card)', borderRadius: '16px', padding: '18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase' }}>
                <span>Focus Efficiency</span>
                <Zap size={16} color="#F59E0B" />
              </div>
              <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#F59E0B', fontFamily: 'var(--font-mono)', margin: '8px 0' }}>
                {telemetry.focusEfficiency}%
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Only {telemetry.idleMinutes}m idle pauses detected
              </div>
            </div>

            <div style={{ background: 'rgba(0,0,0,0.35)', border: '1px solid var(--border-card)', borderRadius: '16px', padding: '18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase' }}>
                <span>Active Modules</span>
                <Sparkles size={16} color="#818CF8" />
              </div>
              <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#818CF8', fontFamily: 'var(--font-mono)', margin: '8px 0' }}>
                {telemetry.subjectBreakdown.length}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Math, Science, English, Live, Kiswahili
              </div>
            </div>

          </div>

          {/* Subject Distribution Bar */}
          <div style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-subtle)', borderRadius: '16px', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '10px' }}>
              <span style={{ fontWeight: 700, color: '#F8FAFC', textTransform: 'uppercase' }}>Subject Time Distribution</span>
              <span style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>100% of today's learning logged</span>
            </div>

            <div style={{ width: '100%', height: '12px', background: 'rgba(0,0,0,0.5)', borderRadius: '999px', overflow: 'hidden', display: 'flex', marginBottom: '14px' }}>
              {telemetry.subjectBreakdown.map((item, i) => (
                <div 
                  key={i}
                  style={{ width: `${item.percentage}%`, backgroundColor: item.color }}
                  title={`${item.subject}: ${item.minutes}m (${item.percentage}%)`}
                />
              ))}
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', fontSize: '0.78rem' }}>
              {telemetry.subjectBreakdown.map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: item.color }} />
                  <span style={{ color: '#E2E8F0', fontWeight: 600 }}>{item.subject}:</span>
                  <span style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{item.minutes}m ({item.percentage}%)</span>
                </div>
              ))}
            </div>
          </div>

          {/* Chronological Activity Feed */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h3 style={{ fontSize: '1rem', margin: 0, fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Calendar size={16} color="#10B981" />
                <span>Chronological Study Log (Today)</span>
              </h3>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Auto-recorded via browser telemetry</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {telemetry.timeline.map((item, i) => (
                <div 
                  key={i}
                  style={{
                    padding: '12px 16px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-subtle)',
                    borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '1.4rem' }}>{item.icon}</span>
                    <div>
                      <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#F8FAFC' }}>{item.activity}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        <strong style={{ color: '#10B981' }}>{item.subject}</strong> • {item.time}
                      </div>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#F8FAFC', fontFamily: 'var(--font-mono)' }}>+{item.duration}</div>
                    <span className="glass-pill" style={{ fontSize: '0.65rem', color: '#10B981' }}>{item.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* MoE Compliance Note */}
          <div style={{
            background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: '12px', padding: '12px 16px', fontSize: '0.8rem', color: '#E2E8F0',
            display: 'flex', alignItems: 'center', gap: '10px'
          }}>
            <ShieldCheck size={20} color="#10B981" style={{ flexShrink: 0 }} />
            <div>
              <strong>Kenya Ministry of Education Compliance:</strong> This activity telemetry automatically feeds into your official 180-Day / 900-Hour attendance register for County QASO audits.
            </div>
          </div>

        </div>

        {/* Footer */}
        <div style={{
          padding: '16px 30px', background: 'rgba(8, 12, 20, 0.95)', borderTop: '1px solid var(--border-subtle)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center'
        }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Telemetry Source: Live Browser Focus Activity</span>
          <button
            onClick={onClose}
            className="btn-primary"
            style={{ fontSize: '0.8rem', padding: '8px 20px' }}
          >
            Close Telemetry
          </button>
        </div>

      </div>
    </div>
  );
}