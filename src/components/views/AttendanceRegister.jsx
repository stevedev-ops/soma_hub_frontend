import React, { useState } from 'react';
import { Clock, Calendar, CheckCircle2, Printer, ShieldCheck, Download, Award, FileText, AlertCircle, ArrowUpRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function AttendanceRegister({ onGoToDailyOS }) {
  const { currentUser } = useAuth();
  const [completedDays, setCompletedDays] = useState(54);
  const [todayClockedIn, setTodayClockedIn] = useState(true);

  const totalMandatoryDays = 180;
  const mandatoryHours = 900;
  const hoursCompleted = completedDays * 5; // 5 hours equivalent per statutory day

  const percentDays = Math.round((completedDays / totalMandatoryDays) * 100);
  const percentHours = Math.round((hoursCompleted / mandatoryHours) * 100);

  const handleClockIn = () => {
    if (!todayClockedIn) {
      setCompletedDays(prev => prev + 1);
      setTodayClockedIn(true);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <span className="glass-pill" style={{ color: '#10B981', border: '1px solid rgba(16,185,129,0.3)', marginBottom: '8px', display: 'inline-block', fontSize: '0.74rem' }}>
            🏛️ Statutory Legal Hours & Attendance Clock
          </span>
          <h2 style={{ fontSize: '1.6rem', margin: 0, fontWeight: 800 }}>
            Ministry of Education 180-Day Homeschool Attendance Register
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: '4px 0 0 0' }}>
            Compliant with Section 30 of the Basic Education Act & QASO annual audit requirements
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={handlePrint}
            className="btn-secondary"
            style={{ fontSize: '0.88rem', padding: '10px 18px' }}
          >
            <Printer size={16} />
            <span>Print Official Register</span>
          </button>

          {!todayClockedIn ? (
            <button
              onClick={handleClockIn}
              className="btn-primary"
              style={{ fontSize: '0.88rem', padding: '10px 18px' }}
            >
              <Clock size={16} />
              <span>Log Today's 5 Statutory Hours</span>
            </button>
          ) : (
            <span className="glass-pill" style={{ background: 'rgba(16,185,129,0.15)', color: '#10B981', fontSize: '0.82rem', padding: '8px 14px' }}>
              ✓ Today's 5 Hours Clocked
            </span>
          )}
        </div>
      </div>

      {/* Statutory Hour Gauge Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        
        <div className="glass-panel" style={{ padding: '22px', borderTop: '3px solid #00A651' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase' }}>
              MANDATORY INSTRUCTION DAYS
            </span>
            <Calendar size={18} color="#34D399" />
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#F8FAFC', marginTop: '6px' }}>
            {completedDays} <span style={{ fontSize: '1.1rem', color: 'var(--text-muted)', fontWeight: 500 }}>/ {totalMandatoryDays} Days</span>
          </div>
          <div style={{ marginTop: '10px' }}>
            <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '10px', height: '8px', overflow: 'hidden' }}>
              <div style={{ width: `${percentDays}%`, height: '100%', background: 'linear-gradient(90deg, #00A651 0%, #34D399 100%)' }} />
            </div>
            <div style={{ fontSize: '0.75rem', color: '#10B981', marginTop: '4px', fontWeight: 600 }}>
              {percentDays}% of Kenyan Academic Year Complete
            </div>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '22px', borderTop: '3px solid #F59E0B' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase' }}>
              ANNUAL STATUTORY HOURS
            </span>
            <Clock size={18} color="#F59E0B" />
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#F8FAFC', marginTop: '6px' }}>
            {hoursCompleted} <span style={{ fontSize: '1.1rem', color: 'var(--text-muted)', fontWeight: 500 }}>/ {mandatoryHours} Hours</span>
          </div>
          <div style={{ marginTop: '10px' }}>
            <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '10px', height: '8px', overflow: 'hidden' }}>
              <div style={{ width: `${percentHours}%`, height: '100%', background: 'linear-gradient(90deg, #F59E0B 0%, #FBBF24 100%)' }} />
            </div>
            <div style={{ fontSize: '0.75rem', color: '#F59E0B', marginTop: '4px', fontWeight: 600 }}>
              On track for 2026/2027 curriculum standards
            </div>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '22px', borderTop: '3px solid #38BDF8' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase' }}>
              TERM BREAKDOWN
            </span>
            <ShieldCheck size={18} color="#38BDF8" />
          </div>
          <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#F8FAFC', marginTop: '8px' }}>
            Term 1: <strong style={{ color: '#10B981' }}>54 / 60 Days</strong>
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Term 2: 0 / 60 Days (Starts May 2026)
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Term 3: 0 / 60 Days (Starts Sept 2026)
          </div>
        </div>

      </div>

      {/* Printable Official MoE Certified Register */}
      <div className="glass-panel" style={{
        background: '#FFFFFF',
        color: '#0F172A',
        padding: '36px',
        borderRadius: '16px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
        border: '1px solid #E2E8F0'
      }}>
        {/* Ministry of Education Official Header */}
        <div style={{ textAlign: 'center', borderBottom: '2px solid #00A651', paddingBottom: '16px', marginBottom: '20px' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            REPUBLIC OF KENYA • MINISTRY OF EDUCATION
          </div>
          <h3 style={{ fontSize: '1.25rem', color: '#00A651', margin: '4px 0 2px 0', fontWeight: 800 }}>
            STATUTORY REGISTER OF ALTERNATIVE BASIC EDUCATION HOURS
          </h3>
          <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
            Pursuant to Basic Education Act (No. 14 of 2013) & QASO Homeschool Guidelines
          </div>
        </div>

        {/* Student & Parent Info Strip */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', background: '#F8FAFC', padding: '12px 16px', borderRadius: '8px', marginBottom: '24px', border: '1px solid #E2E8F0', fontSize: '0.82rem' }}>
          <div>
            <div style={{ color: '#64748B', fontWeight: 600 }}>STUDENT NAME:</div>
            <div style={{ fontWeight: 800, color: '#0F172A' }}>Liam Kariuki</div>
          </div>
          <div>
            <div style={{ color: '#64748B', fontWeight: 600 }}>SUB-COUNTY:</div>
            <div style={{ fontWeight: 800, color: '#0F172A' }}>Dagoretti North (Kilimani)</div>
          </div>
          <div>
            <div style={{ color: '#64748B', fontWeight: 600 }}>CURRICULUM:</div>
            <div style={{ fontWeight: 800, color: '#0F172A' }}>CBC Grade 4 (KICD)</div>
          </div>
          <div>
            <div style={{ color: '#64748B', fontWeight: 600 }}>ACADEMIC YEAR:</div>
            <div style={{ fontWeight: 800, color: '#00A651' }}>2026/2027</div>
          </div>
        </div>

        {/* Monthly Log Summary Table */}
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', marginBottom: '24px' }}>
          <thead>
            <tr style={{ background: '#0F172A', color: '#FFFFFF', textAlign: 'left' }}>
              <th style={{ padding: '10px 14px' }}>Month & Term</th>
              <th style={{ padding: '10px 14px' }}>Statutory Days Logged</th>
              <th style={{ padding: '10px 14px' }}>Instruction Hours</th>
              <th style={{ padding: '10px 14px' }}>Core Subject Strands Covered</th>
              <th style={{ padding: '10px 14px' }}>Compliance Status</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
              <td style={{ padding: '10px 14px', fontWeight: 700 }}>January 2026 (Term 1)</td>
              <td style={{ padding: '10px 14px' }}>20 Days</td>
              <td style={{ padding: '10px 14px' }}>100 Hours</td>
              <td style={{ padding: '10px 14px' }}>Numbers, Living Things, Safari Literacy</td>
              <td style={{ padding: '10px 14px', color: '#059669', fontWeight: 700 }}>✓ Verified Compliant</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #E2E8F0', background: '#F8FAFC' }}>
              <td style={{ padding: '10px 14px', fontWeight: 700 }}>February 2026 (Term 1)</td>
              <td style={{ padding: '10px 14px' }}>20 Days</td>
              <td style={{ padding: '10px 14px' }}>100 Hours</td>
              <td style={{ padding: '10px 14px' }}>Water Purification Lab, Fractions, Sarufi</td>
              <td style={{ padding: '10px 14px', color: '#059669', fontWeight: 700 }}>✓ Verified Compliant</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
              <td style={{ padding: '10px 14px', fontWeight: 700 }}>March 2026 (Term 1 - In Progress)</td>
              <td style={{ padding: '10px 14px' }}>14 Days</td>
              <td style={{ padding: '10px 14px' }}>70 Hours</td>
              <td style={{ padding: '10px 14px' }}>Geometry, Agriculture Balcony Garden, Music</td>
              <td style={{ padding: '10px 14px', color: '#059669', fontWeight: 700 }}>✓ Active Session</td>
            </tr>
          </tbody>
        </table>

        {/* Sworn Declaration & Signatures */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingTop: '20px', borderTop: '1px dashed #CBD5E1' }}>
          <div>
            <div style={{ fontSize: '0.78rem', color: '#64748B', maxWidth: '380px', lineHeight: 1.5, marginBottom: '14px' }}>
              <strong>Sworn Parent Declaration:</strong> I certify under penalty of perjury that the hours recorded above represent authentic, verified instruction and supervised project activities.
            </div>
            <div style={{ borderBottom: '1px solid #334155', width: '220px', paddingBottom: '4px', fontStyle: 'italic', fontWeight: 600 }}>
              Steve Kariuki (Parent)
            </div>
          </div>

          <div style={{ textAlign: 'center' }}>
            <div style={{
              border: '2px solid #00A651',
              borderRadius: '10px',
              padding: '8px 16px',
              color: '#00A651',
              fontWeight: 800,
              fontSize: '0.75rem',
              display: 'inline-block'
            }}>
              SOMAHOME ACADEMIC LEDGER<br />
              DIGITALLY CERTIFIED COMPLIANCE
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}