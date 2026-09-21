import React, { useState } from 'react';
import { 
  Printer, Download, X, FileText, CheckCircle, Sparkles, 
  ShieldCheck, Star, Zap, Eye, Check, Gamepad2, Award 
} from 'lucide-react';

export default function SundayPrintableModal({ onClose }) {
  // Twinkl-inspired features
  const [printMode, setPrintMode] = useState('eco_bw'); // 'full_color' | 'eco_color' | 'eco_bw'
  const [difficultyTier, setDifficultyTier] = useState('2_star'); // '1_star' | '2_star' | '3_star'
  const [includeAnswerKey, setIncludeAnswerKey] = useState(true);
  const [questPinCopied, setQuestPinCopied] = useState(false);

  const questPin = '8492';

  const pages = [
    { page: 1, title: 'Weekly Overview & Household Materials Checklist', type: 'Parent Planning Guide' },
    { 
      page: 2, 
      title: difficultyTier === '1_star' 
        ? 'Mathematics: Slicing Fractions (Visual Halves & Circles with Scaffolding ⭐)' 
        : (difficultyTier === '3_star' 
            ? 'Mathematics: Advanced Compound Fraction Word Puzzles & Algebra ⭐⭐⭐' 
            : 'Mathematics: Slicing Fractions (Halves & Quarters Activity ⭐⭐)'), 
      type: 'Worksheet' 
    },
    { page: 3, title: 'Mathematics: Proper Fractions Coloring & Word Problems', type: 'Worksheet' },
    { page: 4, title: 'English Literacy: The Red Elephants of Tsavo National Park', type: 'Reading Passage' },
    { page: 5, title: 'English: Dynamic Adjectives & Descriptive Composition', type: 'Exercise' },
    { page: 6, title: 'Science & Tech: Charcoal Water Filter Lab Observation Sheet', type: 'Practical Guide' },
    { page: 7, title: 'Science: Draw Your 4 Filtration Layers & Water Clarity Log', type: 'Hands-on Lab' },
    { page: 8, title: 'Kiswahili: Nomino katika Ngeli ya A-WA (Wanyama na Watu)', type: 'Kazi ya Nyumbani' },
    { page: 9, title: 'Kiswahili: Methali ya Wiki na Hadithi Fupi', type: 'Kusoma' },
    { page: 10, title: 'Agriculture: Balcony Potting Soil Mixture Log', type: 'Project Record' },
    { page: 11, title: 'Creative Arts: Recycled Collage Patterns', type: 'Art Activity' },
    { 
      page: 12, 
      title: includeAnswerKey 
        ? 'Parent 30-Second Quick Marking Key & Common Misconceptions Guide' 
        : 'Weekly Revision Diagnostic & Parent Sign-Off Rubric', 
      type: includeAnswerKey ? 'Answer Key (Zero-Stress)' : 'Assessment' 
    }
  ];

  const handleCopyPin = () => {
    navigator.clipboard.writeText(questPin);
    setQuestPinCopied(true);
    setTimeout(() => setQuestPinCopied(false), 2000);
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(12px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px'
    }}>
      <div className="glass-panel" style={{
        maxWidth: '820px', width: '100%', maxHeight: '92vh', overflowY: 'auto',
        background: '#0B1120', borderRadius: '24px', border: '1.5px solid rgba(245, 158, 11, 0.4)', padding: '28px', position: 'relative'
      }}>
        
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: '22px', right: '22px', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1.2rem' }}
        >
          ✕
        </button>

        {/* Header Banner */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '8px' }}>
          <div style={{ width: '46px', height: '46px', borderRadius: '14px', background: 'linear-gradient(135deg, rgba(245,158,11,0.25) 0%, rgba(217,119,6,0.1) 100%)', border: '1px solid rgba(245,158,11,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F59E0B' }}>
            <Printer size={24} />
          </div>
          <div>
            <div className="glass-pill" style={{ color: '#F59E0B', border: '1px solid rgba(245,158,11,0.3)', marginBottom: '3px', fontSize: '0.7rem' }}>
              <span>Batch Sunday Printing Engine</span>
            </div>
            <h3 style={{ fontSize: '1.35rem', margin: 0, fontWeight: 800, color: '#F8FAFC' }}>
              Sunday Batch Printable Pack (12 Pages)
            </h3>
            <span style={{ fontSize: '0.8rem', color: '#10B981', fontWeight: 600 }}>
              Grade 4 CBC • Week 3 Consolidated Bundle (ReportLab Binary PDF)
            </span>
          </div>
        </div>

        <p style={{ color: 'var(--text-secondary)', fontSize: '0.86rem', lineHeight: 1.4, margin: '8px 0 18px 0' }}>
          Print all weekly activity sheets at home or your neighborhood cyber in 1 click. Your child gets tactile paper learning with zero screen fatigue!
        </p>

        {/* TWINKL MECHANIC 1: INK-SAVER PRINT MODE SELECTOR */}
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-card)', borderRadius: '14px', padding: '16px', marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.78rem', color: '#F8FAFC', fontWeight: 700, textTransform: 'uppercase' }}>
              🖨️ Ink-Saver Printing Mode:
            </span>
            <span style={{ fontSize: '0.72rem', color: printMode === 'eco_bw' ? '#10B981' : 'var(--text-muted)' }}>
              {printMode === 'eco_bw' ? '💰 Saves up to KES 800 in home printer ink' : 'Standard printing'}
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
            <button
              type="button"
              onClick={() => setPrintMode('eco_bw')}
              style={{
                padding: '10px',
                borderRadius: '10px',
                border: printMode === 'eco_bw' ? '2px solid #10B981' : '1px solid var(--border-subtle)',
                background: printMode === 'eco_bw' ? 'rgba(16,185,129,0.18)' : 'rgba(0,0,0,0.3)',
                color: printMode === 'eco_bw' ? '#10B981' : 'var(--text-secondary)',
                fontWeight: 700,
                fontSize: '0.78rem',
                cursor: 'pointer',
                textAlign: 'center'
              }}
            >
              <div>🖨️ Super Eco B&W</div>
              <div style={{ fontSize: '0.68rem', fontWeight: 400, marginTop: '2px', opacity: 0.8 }}>Outline / 100% Ink-Saver</div>
            </button>

            <button
              type="button"
              onClick={() => setPrintMode('eco_color')}
              style={{
                padding: '10px',
                borderRadius: '10px',
                border: printMode === 'eco_color' ? '2px solid #38BDF8' : '1px solid var(--border-subtle)',
                background: printMode === 'eco_color' ? 'rgba(56,189,248,0.18)' : 'rgba(0,0,0,0.3)',
                color: printMode === 'eco_color' ? '#38BDF8' : 'var(--text-secondary)',
                fontWeight: 700,
                fontSize: '0.78rem',
                cursor: 'pointer',
                textAlign: 'center'
              }}
            >
              <div>🌿 Eco-Color</div>
              <div style={{ fontSize: '0.68rem', fontWeight: 400, marginTop: '2px', opacity: 0.8 }}>Low saturation (40% less ink)</div>
            </button>

            <button
              type="button"
              onClick={() => setPrintMode('full_color')}
              style={{
                padding: '10px',
                borderRadius: '10px',
                border: printMode === 'full_color' ? '2px solid #F59E0B' : '1px solid var(--border-subtle)',
                background: printMode === 'full_color' ? 'rgba(245,158,11,0.18)' : 'rgba(0,0,0,0.3)',
                color: printMode === 'full_color' ? '#F59E0B' : 'var(--text-secondary)',
                fontWeight: 700,
                fontSize: '0.78rem',
                cursor: 'pointer',
                textAlign: 'center'
              }}
            >
              <div>🌈 Full Vibrant Color</div>
              <div style={{ fontSize: '0.68rem', fontWeight: 400, marginTop: '2px', opacity: 0.8 }}>High gloss / cyber printing</div>
            </button>
          </div>
        </div>

        {/* TWINKL MECHANIC 2: 3-STAR DIFFERENTIATED DIFFICULTY TIERS */}
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-card)', borderRadius: '14px', padding: '16px', marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.78rem', color: '#F8FAFC', fontWeight: 700, textTransform: 'uppercase' }}>
              ⭐⭐⭐ Differentiated Learning Tier (KNEC CBA):
            </span>
            <span style={{ fontSize: '0.72rem', color: '#F59E0B', fontWeight: 700 }}>
              {difficultyTier === '1_star' ? '⭐ 1-Star: Support & Scaffolding' : (difficultyTier === '3_star' ? '⭐⭐⭐ 3-Star: Extension & Challenge' : '⭐⭐ 2-Star: Core Grade 4')}
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
            <button
              type="button"
              onClick={() => setDifficultyTier('1_star')}
              style={{
                padding: '10px',
                borderRadius: '10px',
                border: difficultyTier === '1_star' ? '2px solid #10B981' : '1px solid var(--border-subtle)',
                background: difficultyTier === '1_star' ? 'rgba(16,185,129,0.15)' : 'rgba(0,0,0,0.3)',
                color: difficultyTier === '1_star' ? '#10B981' : 'var(--text-secondary)',
                fontWeight: 700,
                fontSize: '0.78rem',
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              <div style={{ color: '#F59E0B', fontSize: '0.85rem' }}>⭐ Level 1</div>
              <div style={{ color: '#F8FAFC', marginTop: '2px' }}>Approaching / Support</div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '2px' }}>Visual hints & guided steps</div>
            </button>

            <button
              type="button"
              onClick={() => setDifficultyTier('2_star')}
              style={{
                padding: '10px',
                borderRadius: '10px',
                border: difficultyTier === '2_star' ? '2px solid #38BDF8' : '1px solid var(--border-subtle)',
                background: difficultyTier === '2_star' ? 'rgba(56,189,248,0.15)' : 'rgba(0,0,0,0.3)',
                color: difficultyTier === '2_star' ? '#38BDF8' : 'var(--text-secondary)',
                fontWeight: 700,
                fontSize: '0.78rem',
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              <div style={{ color: '#F59E0B', fontSize: '0.85rem' }}>⭐⭐ Level 2</div>
              <div style={{ color: '#F8FAFC', marginTop: '2px' }}>Meeting Expectations</div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '2px' }}>Standard KICD CBC syllabus</div>
            </button>

            <button
              type="button"
              onClick={() => setDifficultyTier('3_star')}
              style={{
                padding: '10px',
                borderRadius: '10px',
                border: difficultyTier === '3_star' ? '2px solid #A855F7' : '1px solid var(--border-subtle)',
                background: difficultyTier === '3_star' ? 'rgba(168,85,247,0.15)' : 'rgba(0,0,0,0.3)',
                color: difficultyTier === '3_star' ? '#A855F7' : 'var(--text-secondary)',
                fontWeight: 700,
                fontSize: '0.78rem',
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              <div style={{ color: '#F59E0B', fontSize: '0.85rem' }}>⭐⭐⭐ Level 3</div>
              <div style={{ color: '#F8FAFC', marginTop: '2px' }}>Exceeding / Olympiad</div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '2px' }}>High-order STEM challenges</div>
            </button>
          </div>
        </div>

        {/* TWINKL MECHANIC 3: ZERO-GUILT PARENT MARKING KEY & TWINKL GO! PIN */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '12px', marginBottom: '20px' }}>
          
          {/* Answer Key Option */}
          <div 
            onClick={() => setIncludeAnswerKey(!includeAnswerKey)}
            style={{
              background: includeAnswerKey ? 'rgba(16,185,129,0.1)' : 'rgba(255,255,255,0.02)',
              border: includeAnswerKey ? '1px solid rgba(16,185,129,0.35)' : '1px solid var(--border-subtle)',
              borderRadius: '12px', padding: '12px 14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px'
            }}
          >
            <CheckCircle size={18} color={includeAnswerKey ? '#10B981' : '#64748B'} />
            <div>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#F8FAFC' }}>
                Include Parent 30-Sec Marking Key (Pg 12)
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                Shows worked answers & common misconceptions explained.
              </div>
            </div>
          </div>

          {/* Twinkl Go! Worksheet Arcade PIN */}
          <div style={{
            background: 'rgba(56,189,248,0.1)',
            border: '1px solid rgba(56,189,248,0.3)',
            borderRadius: '12px', padding: '12px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
          }}>
            <div>
              <div style={{ fontSize: '0.72rem', color: '#38BDF8', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Gamepad2 size={13} />
                <span>Student Quest Arcade PIN:</span>
              </div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#F8FAFC', letterSpacing: '2px', fontFamily: 'var(--font-mono)' }}>
                {questPin}
              </div>
            </div>

            <button
              onClick={handleCopyPin}
              className="btn-secondary"
              style={{ fontSize: '0.72rem', padding: '4px 10px' }}
            >
              {questPinCopied ? 'Copied!' : 'Copy PIN'}
            </button>
          </div>

        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '22px' }}>
          <a
            href="http://localhost:8000/api/curriculum/download-printable-pack/"
            target="_blank"
            rel="noreferrer"
            className="btn-primary"
            style={{ flex: 1.2, justifyContent: 'center', textDecoration: 'none', fontSize: '0.9rem', padding: '12px', background: '#00A651' }}
          >
            <Download size={18} />
            <span>Download 12-Page Batch PDF ({printMode === 'eco_bw' ? 'Super Eco B&W' : (printMode === 'eco_color' ? 'Eco-Color' : 'Full Color')})</span>
          </a>

          <button 
            onClick={() => window.print()} 
            className="btn-secondary" 
            style={{ flex: 0.8, justifyContent: 'center', padding: '12px' }}
          >
            <Printer size={18} />
            <span>Print Current View</span>
          </button>
        </div>

        {/* Pages Breakdown List */}
        <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Pages Included in this Sunday Pack:
            </span>
            <span className="glass-pill" style={{ color: '#10B981', fontSize: '0.7rem' }}>
              KNEC CBA Level 1-4 Performance Criteria Included
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
            {pages.map((p) => (
              <div key={p.page} style={{
                background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)',
                borderRadius: '8px', padding: '8px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{
                    width: '24px', height: '24px', borderRadius: '6px', background: 'rgba(255,255,255,0.06)',
                    fontSize: '0.75rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94A3B8'
                  }}>
                    {p.page}
                  </span>
                  <span style={{ fontSize: '0.86rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {p.title}
                  </span>
                </div>
                <span className="glass-pill" style={{ fontSize: '0.7rem', color: p.page === 12 && includeAnswerKey ? '#10B981' : '#38BDF8' }}>
                  {p.type}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
