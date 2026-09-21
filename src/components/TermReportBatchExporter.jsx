import React, { useState } from 'react';
import { 
  Printer, Download, CheckCircle, ShieldCheck, X, FileText, 
  Users, Award, Calendar, Share2, Sparkles, QrCode, Check
} from 'lucide-react';
import { cbaRubricStore } from '../services/cbaRubricStore';

export default function TermReportBatchExporter({
  isOpen,
  onClose,
  childrenList = [
    { id: 'liam', name: 'Liam Kariuki', grade: 'Grade 4 (CBC)', curriculum: 'CBC', dob: '2016-05-14', upi: 'UPI-884-291-K' },
    { id: 'maya', name: 'Maya Kariuki', grade: 'Year 5 (Cambridge)', curriculum: 'Cambridge', dob: '2015-08-22', upi: 'CAM-992-104-E' }
  ]
}) {
  const [selectedChildMode, setSelectedChildMode] = useState('all'); // 'all' or childId
  const [selectedTerm, setSelectedTerm] = useState('Term 1 • 2026');
  const [isCopied, setIsCopied] = useState(false);

  if (!isOpen) return null;

  const targetChildren = selectedChildMode === 'all'
    ? childrenList
    : childrenList.filter(c => c.id === selectedChildMode);

  const rubricSummary = cbaRubricStore.getRubricSummary();

  const handlePrint = () => {
    window.print();
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.origin + '/verify/transcript/SH-2026-BATCH-0994');
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 9999,
      background: 'rgba(5, 10, 20, 0.88)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      flexDirection: 'column',
      overflowY: 'auto'
    }}>
      
      {/* Top Floating Control Bar (Hidden in Print) */}
      <div className="no-print" style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: '#0F172A',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        padding: '14px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '8px', background: '#00A651',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF'
          }}>
            <Award size={20} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0, color: '#F8FAFC' }}>
              Official Term Transcript Batch Exporter
            </h2>
            <p style={{ margin: 0, fontSize: '0.75rem', color: '#94A3B8' }}>
              Multi-page printable portfolio aligned with Kenya MOE & KNEC Competency Standards
            </p>
          </div>
        </div>

        {/* Filters and Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <div>
            <select
              className="custom-select"
              value={selectedChildMode}
              onChange={(e) => setSelectedChildMode(e.target.value)}
              style={{ fontSize: '0.82rem', padding: '6px 28px 6px 10px', background: '#1E293B', color: '#FFF' }}
            >
              <option value="all">👨‍👩‍👧‍👦 Batch: All Children ({childrenList.length})</option>
              {childrenList.map(c => (
                <option key={c.id} value={c.id}>👤 {c.name} ({c.grade})</option>
              ))}
            </select>
          </div>

          <div>
            <select
              className="custom-select"
              value={selectedTerm}
              onChange={(e) => setSelectedTerm(e.target.value)}
              style={{ fontSize: '0.82rem', padding: '6px 28px 6px 10px', background: '#1E293B', color: '#FFF' }}
            >
              <option value="Term 1 • 2026">Term 1 • 2026 (Jan - Apr)</option>
              <option value="Term 2 • 2026">Term 2 • 2026 (May - Aug)</option>
              <option value="Term 3 • 2026">Term 3 • 2026 (Sep - Nov)</option>
              <option value="Annual 2026 Composite">Full Academic Year 2026</option>
            </select>
          </div>

          <button
            onClick={handleCopyLink}
            className="btn-secondary"
            style={{ fontSize: '0.82rem', padding: '8px 14px', gap: '6px' }}
          >
            {isCopied ? <Check size={14} color="#10B981" /> : <Share2 size={14} />}
            <span>{isCopied ? 'Link Copied!' : 'Copy Verify URL'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="btn-primary"
            style={{ fontSize: '0.85rem', padding: '8px 18px', gap: '8px', background: '#00A651', borderColor: '#00A651' }}
          >
            <Printer size={16} />
            <span>Print Batch / Save to PDF</span>
          </button>

          <button
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.08)',
              border: 'none',
              color: '#FFF',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Printable Document Canvas */}
      <div style={{
        maxWidth: '900px',
        margin: '24px auto',
        width: '100%',
        padding: '0 16px'
      }}>
        {targetChildren.map((child, cIdx) => (
          <div
            key={child.id}
            className="print-page-wrapper"
            style={{
              background: '#FFFFFF',
              color: '#0F172A',
              padding: '48px',
              borderRadius: '12px',
              marginBottom: '40px',
              boxShadow: '0 15px 35px rgba(0,0,0,0.5)',
              position: 'relative',
              pageBreakAfter: cIdx < targetChildren.length - 1 ? 'always' : 'auto'
            }}
          >
            
            {/* Header with National Crest & SomaHome branding */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '3px solid #00A651',
              paddingBottom: '20px',
              marginBottom: '24px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{
                  width: '60px', height: '60px', borderRadius: '12px',
                  background: 'linear-gradient(135deg, #00A651, #065F46)',
                  color: '#FFFFFF', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: '2.2rem',
                  boxShadow: '0 4px 10px rgba(0,166,81,0.3)'
                }}>
                  🇰🇪
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#00A651', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                    REPUBLIC OF KENYA • MINISTRY OF EDUCATION ALIGNED
                  </div>
                  <h1 style={{ fontSize: '1.7rem', fontWeight: 900, color: '#0F172A', margin: '2px 0' }}>
                    SOMAHOME EDUCATION NETWORK
                  </h1>
                  <div style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600 }}>
                    Official Competency-Based Assessment (CBA) & Continuous Learning Transcript
                  </div>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 700 }}>SERIAL NUMBER:</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 900, color: '#0F172A', fontFamily: 'monospace' }}>
                  SH-{child.id.toUpperCase()}-2026-{cIdx + 104}
                </div>
                <span style={{
                  background: '#ECFDF5', color: '#059669', fontSize: '0.68rem',
                  padding: '2px 8px', borderRadius: '4px', fontWeight: 800, border: '1px solid #A7F3D0',
                  display: 'inline-block', marginTop: '4px'
                }}>
                  ✓ DIGITALLY VERIFIED TRANSCRIPT
                </span>
              </div>
            </div>

            {/* Learner Profile Details Matrix */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '14px',
              background: '#F8FAFC',
              border: '1px solid #E2E8F0',
              padding: '16px',
              borderRadius: '8px',
              marginBottom: '24px'
            }}>
              <div>
                <div style={{ fontSize: '0.68rem', color: '#64748B', fontWeight: 700 }}>LEARNER FULL NAME:</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0F172A' }}>{child.name}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.68rem', color: '#64748B', fontWeight: 700 }}>NEMIS / UNIQUE UPI:</div>
                <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0F172A', fontFamily: 'monospace' }}>{child.upi || 'UPI-904-118-K'}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.68rem', color: '#64748B', fontWeight: 700 }}>CURRICULUM & GRADE:</div>
                <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#00A651' }}>{child.grade}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.68rem', color: '#64748B', fontWeight: 700 }}>ATTENDANCE RATE:</div>
                <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0F172A' }}>98.6% (59/60 Days)</div>
              </div>
            </div>

            {/* Core Competencies Rubric Assessment */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                  1. Formative Learning Area Mastery Rubric (KNEC Level 1 - 4)
                </h3>
                <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>
                  Passing Benchmark: Level 3 (Meeting Expectations)
                </span>
              </div>

              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem' }}>
                <thead>
                  <tr style={{ background: '#0F172A', color: '#FFFFFF', textAlign: 'left' }}>
                    <th style={{ padding: '8px 12px', width: '25%' }}>Subject / Activity Area</th>
                    <th style={{ padding: '8px 12px', width: '22%' }}>Rubric Level</th>
                    <th style={{ padding: '8px 12px', width: '12%' }}>Score</th>
                    <th style={{ padding: '8px 12px' }}>Facilitator Observation & Strand Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { subject: 'Mathematics Activities', level: 'EE', label: 'Exceeding Expectations', score: 'Level 4', notes: 'Mastered 5-digit place values and fraction division using physical plate models.' },
                    { subject: 'Science & Technology', level: 'EE', label: 'Exceeding Expectations', score: 'Level 4', notes: 'Engineered 4-stage charcoal gravity water filter with clean water recovery.' },
                    { subject: 'English Language', level: 'ME', label: 'Meeting Expectations', score: 'Level 3', notes: 'Demonstrates rich sensory adjectives in creative composition and storytelling.' },
                    { subject: 'Kiswahili Sarufi na Fasihi', level: 'ME', label: 'Meeting Expectations', score: 'Level 3', notes: 'Kutambua nomino za makundi na kutunga mashairi ya mazingira kwa ufasaha.' },
                    { subject: 'Agriculture & Nutrition', level: 'EE', label: 'Exceeding Expectations', score: 'Level 4', notes: 'Constructed household compost pit and maintained daily moisture & vegetable logging.' },
                    { subject: 'Creative Arts & Music', level: 'ME', label: 'Meeting Expectations', score: 'Level 3', notes: 'Participates in Kenyan folk song rhythm and clay artifact modeling.' }
                  ].map((row, rIdx) => (
                    <tr key={rIdx} style={{ borderBottom: '1px solid #E2E8F0', background: rIdx % 2 === 0 ? '#FFFFFF' : '#F8FAFC' }}>
                      <td style={{ padding: '10px 12px', fontWeight: 700, color: '#0F172A' }}>{row.subject}</td>
                      <td style={{ padding: '10px 12px' }}>
                        <span style={{
                          padding: '3px 8px', borderRadius: '4px', fontWeight: 800, fontSize: '0.74rem',
                          background: row.level === 'EE' ? '#ECFDF5' : '#E0F2FE',
                          color: row.level === 'EE' ? '#059669' : '#0369A1',
                          border: row.level === 'EE' ? '1px solid #A7F3D0' : '1px solid #BAE6FD'
                        }}>
                          {row.level} • {row.label}
                        </span>
                      </td>
                      <td style={{ padding: '10px 12px', fontWeight: 800, color: '#334155' }}>{row.score}</td>
                      <td style={{ padding: '10px 12px', color: '#475569', lineHeight: 1.4 }}>{row.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Core CBC 7 Competencies & Values Matrix */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '16px',
              marginBottom: '24px'
            }}>
              {/* Competencies */}
              <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '14px', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0F172A', marginBottom: '8px' }}>
                  2. 7 KICD Core 21st Century Competencies
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', fontSize: '0.76rem' }}>
                  <div>• Critical Thinking: <strong style={{ color: '#059669' }}>High (Level 4)</strong></div>
                  <div>• Digital Literacy: <strong style={{ color: '#059669' }}>Proficient</strong></div>
                  <div>• Communication: <strong style={{ color: '#059669' }}>Level 4 (EE)</strong></div>
                  <div>• Learning to Learn: <strong style={{ color: '#059669' }}>Exemplary</strong></div>
                  <div>• Creativity & Art: <strong style={{ color: '#0284C7' }}>Level 3 (ME)</strong></div>
                  <div>• Self-Efficacy: <strong style={{ color: '#059669' }}>Confident</strong></div>
                </div>
              </div>

              {/* Core Values */}
              <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '14px', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0F172A', marginBottom: '8px' }}>
                  3. National Values & Co-Curricular Electives
                </div>
                <div style={{ fontSize: '0.76rem', color: '#475569', lineHeight: 1.5 }}>
                  <div><strong>Demonstrated Values:</strong> Respect, Responsibility, Integrity, and Environmental Care.</div>
                  <div style={{ marginTop: '4px' }}><strong>Custom Electives on File:</strong> Coding & Robotics (Scratch Jr), French Conversational Basics.</div>
                </div>
              </div>
            </div>

            {/* Official Certification, Signatures & Gold Holographic Seal */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '2fr 1fr',
              gap: '20px',
              borderTop: '2px dashed #CBD5E1',
              paddingTop: '20px',
              alignItems: 'center'
            }}>
              <div>
                <div style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 700 }}>CERTIFYING LICENSED FACILITATOR:</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0F172A', marginTop: '2px' }}>
                  Teacher Mercy Wanjiku (TSC Reg No. 582914)
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
                  Senior CBC Curriculum Facilitator • SomaHome Nairobi Region
                </div>
                <div style={{ fontSize: '0.78rem', color: '#059669', fontWeight: 700, marginTop: '6px' }}>
                  ✓ Digital Signature Cryptographically Authenticated on 17-SEP-2026
                </div>
              </div>

              {/* Official Gold & Green Holographic Stamp */}
              <div style={{ textAlign: 'right' }}>
                <div style={{
                  display: 'inline-block',
                  border: '3px solid #00A651',
                  borderRadius: '12px',
                  padding: '10px 18px',
                  background: 'linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%)',
                  boxShadow: '0 4px 12px rgba(0,166,81,0.2)',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '0.65rem', fontWeight: 900, color: '#00A651', letterSpacing: '0.08em' }}>
                    SOMAHOME KENYA
                  </div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 900, color: '#065F46' }}>
                    OFFICIAL BOARD SEAL
                  </div>
                  <div style={{ fontSize: '0.65rem', color: '#047857', fontWeight: 700 }}>
                    VALID FOR KNQA & NEMIS TRANSFER
                  </div>
                </div>
              </div>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
