import React, { useRef, useState, useEffect } from 'react';
import { Award, Printer, ShieldCheck, Download, CheckCircle2, Sparkles, FileText, Users, Scale, ExternalLink, HelpCircle } from 'lucide-react';
import { cbaRubricStore, CBA_LEVELS } from '../services/cbaRubricStore';
import TermReportBatchExporter from './TermReportBatchExporter';

export default function ReportCard({ reportData, studentName = 'Liam Kariuki', gradeLevel = 'Grade 4 (CBC)' }) {
  const printRef = useRef();
  const [rubricSummary, setRubricSummary] = useState(() => cbaRubricStore.calculateSummary('liam'));
  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);
  const [showRecognitionGuide, setShowRecognitionGuide] = useState(false);

  useEffect(() => {
    const handleUpdate = () => {
      setRubricSummary(cbaRubricStore.calculateSummary('liam'));
    };
    window.addEventListener('cba_rubric_updated', handleUpdate);
    return () => window.removeEventListener('cba_rubric_updated', handleUpdate);
  }, []);

  const overallObj = CBA_LEVELS[rubricSummary.overall] || CBA_LEVELS.EE;

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', padding: '10px 0' }}>
      
      {/* Action Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span className="glass-pill badge-cbc">CBC Formative Assessment Portfolio</span>
            <span style={{ fontSize: '0.8rem', color: '#34D399', fontWeight: 700 }}>● Formative Evidence Synced</span>
          </div>
          <h2 style={{ fontSize: '1.35rem', margin: 0, fontWeight: 900 }}>
            CBC-Aligned Learner Portfolio & Progress Reports
          </h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: '2px 0 0 0' }}>
            Mapped to KICD Curriculum Designs & Formative Competency Rubrics
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setShowRecognitionGuide(!showRecognitionGuide)}
            className="btn-secondary"
            style={{ fontSize: '0.82rem', padding: '8px 14px', gap: '6px', color: '#93C5FD', borderColor: 'rgba(59, 130, 246, 0.3)' }}
          >
            <Scale size={15} color="#60A5FA" />
            <span>Official Recognition Pathway</span>
          </button>

          {/* Batch Multi-Child & Multi-Page PDF Exporter */}
          <button
            onClick={() => setIsBatchModalOpen(true)}
            className="btn-primary"
            style={{
              fontSize: '0.84rem',
              padding: '8px 14px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 4px 15px rgba(0,166,81,0.3)'
            }}
          >
            <FileText size={15} />
            <span>Export Portfolio PDF</span>
          </button>
        </div>
      </div>

      {/* DEDICATED OFFICIAL RECOGNITION PATHWAY SECTION */}
      {showRecognitionGuide && (
        <div style={{
          background: 'linear-gradient(135deg, rgba(30, 58, 138, 0.2) 0%, rgba(15, 23, 42, 0.95) 100%)',
          border: '1px solid rgba(59, 130, 246, 0.4)', borderRadius: '20px', padding: '24px', marginBottom: '24px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <Scale size={22} color="#60A5FA" />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 900, margin: 0, color: '#FFFFFF' }}>
              Official Recognition & National Examination Pathway (Kenya)
            </h3>
          </div>
          <p style={{ fontSize: '0.85rem', color: '#CBD5E1', lineHeight: 1.5, margin: '0 0 16px 0' }}>
            SomaHome helps homeschool families maintain rigorous continuous assessment portfolios that align with Kenyan National Qualifications Authority (KNQA) frameworks and KICD curriculum competencies.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontWeight: 800, fontSize: '0.85rem', color: '#93C5FD', marginBottom: '4px' }}>
                1. KPSEA & KCSE Candidate Registration
              </div>
              <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                Homeschool students can register as Private Candidates at their local Sub-County Director of Education (SCDE) office.
              </p>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontWeight: 800, fontSize: '0.85rem', color: '#34D399', marginBottom: '4px' }}>
                2. Formative Portfolio Evidence
              </div>
              <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                Exported term portfolios provide timestamped proof of competency mastery when transferring back into formal schools.
              </p>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontWeight: 800, fontSize: '0.85rem', color: '#F59E0B', marginBottom: '4px' }}>
                3. Cambridge & International Tracks
              </div>
              <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                Cambridge Primary/Lower Secondary learners register for Checkpoint exams directly via British Council Kenya exam centers.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Printable Transcript Document */}
      <div className="report-card-container" ref={printRef} style={{ background: '#0F172A', border: '1px solid var(--border-card)', borderRadius: '20px', padding: '32px' }}>
        
        {/* Document Official Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          borderBottom: '2px solid rgba(0, 166, 81, 0.4)',
          paddingBottom: '20px',
          marginBottom: '24px'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span style={{ fontSize: '1.4rem' }}>🇰🇪</span>
              <span style={{ fontWeight: 900, letterSpacing: '0.05em', color: '#00A651', fontSize: '0.9rem', textTransform: 'uppercase' }}>
                SomaHome Kenya • Homeschooling & Micro-Pod Network
              </span>
            </div>
            <h1 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#F8FAFC', margin: '0 0 4px 0' }}>
              CBC Continuous Assessment & Portfolio Report
            </h1>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              Mapped to KICD Competency-Based Curriculum Designs • Academic Year 2026
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{
              background: overallObj.bg,
              border: `1px solid ${overallObj.color}`,
              padding: '6px 14px',
              borderRadius: '8px',
              display: 'inline-block'
            }}>
              <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: overallObj.color, fontWeight: 800 }}>Overall Assessment</div>
              <div style={{ fontSize: '1rem', fontWeight: 900, color: overallObj.color }}>Level 4 · {overallObj.code}</div>
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Formative Rubric Average
            </div>
          </div>
        </div>

        {/* Student Meta Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '12px',
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '12px',
          padding: '14px 18px',
          marginBottom: '24px'
        }}>
          <div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Learner Name</div>
            <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#F8FAFC' }}>{studentName}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Grade Level & Syllabi</div>
            <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#34D399' }}>{gradeLevel}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Assigned Mentor</div>
            <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#F8FAFC' }}>Teacher Mercy (TSC Reg: 582914)</div>
          </div>
          <div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Evaluation Period</div>
            <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#F8FAFC' }}>Term 1 Formative (Weeks 1 - 4)</div>
          </div>
        </div>

        {/* Competencies Table */}
        <div style={{ marginBottom: '24px', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-card)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '10px 12px' }}>Learning Area / Subject</th>
                <th style={{ padding: '10px 12px' }}>Rating</th>
                <th style={{ padding: '10px 12px' }}>Level</th>
                <th style={{ padding: '10px 12px' }}>Formative Competency Remarks</th>
              </tr>
            </thead>
            <tbody>
              {[
                { subject: 'Mathematics Activities', rating: 'EE', score: 'Level 4', remark: 'Demonstrates exceptional grasp of fractions and practical measurement.' },
                { subject: 'Science & Technology', rating: 'EE', score: 'Level 4', remark: 'Built working home water filtration model with locally sourced materials.' },
                { subject: 'English Language & Literacy', rating: 'ME', score: 'Level 3', remark: 'Speaks fluently, writes creative 4-paragraph descriptive essays.' },
                { subject: 'Kiswahili Lugha na Kusoma', rating: 'ME', score: 'Level 3', remark: 'Anaelewa ngeli za Kiswahili vizuri na anashiriki katika mazungumzo.' },
                { subject: 'Agriculture & Nutrition', rating: 'EE', score: 'Level 4', remark: 'Identifies indigenous Kenyan soil types and kitchen gardening practices.' },
                { subject: 'Creative Arts & Music', rating: 'ME', score: 'Level 3', remark: 'Expresses rhythm and creates patterned collage art from local fabric.' }
              ].map((comp, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                  <td style={{ padding: '12px', fontWeight: 700, color: '#FFFFFF' }}>{comp.subject}</td>
                  <td style={{ padding: '12px' }}>
                    <span style={{
                      background: comp.rating === 'EE' ? 'rgba(0,166,81,0.2)' : 'rgba(59,130,246,0.2)',
                      color: comp.rating === 'EE' ? '#34D399' : '#60A5FA',
                      padding: '2px 8px', borderRadius: '6px', fontWeight: 800, fontSize: '0.75rem'
                    }}>
                      {comp.rating}
                    </span>
                  </td>
                  <td style={{ padding: '12px', color: 'var(--text-secondary)' }}>{comp.score}</td>
                  <td style={{ padding: '12px', color: '#CBD5E1', fontSize: '0.82rem' }}>{comp.remark}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer Remarks */}
        <div style={{ borderTop: '1px solid var(--border-card)', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
          <div>Generated by SomaHome Kenya Assessment Engine</div>
          <div>CBA Rubric Key: EE (Exceeding), ME (Meeting), AE (Approaching), BE (Below)</div>
        </div>
      </div>

      {/* Batch Exporter Modal */}
      {isBatchModalOpen && (
        <TermReportBatchExporter
          isOpen={isBatchModalOpen}
          onClose={() => setIsBatchModalOpen(false)}
          studentName={studentName}
          gradeLevel={gradeLevel}
        />
      )}
    </div>
  );
}
