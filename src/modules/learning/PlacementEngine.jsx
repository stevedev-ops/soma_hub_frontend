import React, { useState } from 'react';
import { 
  Compass, CheckCircle2, AlertTriangle, Sparkles, BookOpen, Brain, 
  ArrowRight, ArrowLeft, RotateCcw, Target, ShieldCheck, Download, Share2, Award, Zap
} from 'lucide-react';

const DIAGNOSTIC_QUESTIONS = [
  {
    id: 1,
    domain: 'Mathematics & Numeracy',
    difficulty: 'Intermediate',
    gradeLevel: 'Grade 4 - 5',
    question: 'A farmer in Eldoret harvested 480 bags of maize. He sold 3/8 of them in the market and stored the rest. How many bags did he store?',
    options: [
      { text: '180 bags', correct: false, insight: 'Calculated the sold amount instead of remaining stored' },
      { text: '300 bags', correct: true, insight: 'Correct fraction of remaining bags (5/8 of 480)' },
      { text: '240 bags', correct: false, insight: 'Assumed half was stored' },
      { text: '320 bags', correct: false, insight: 'Calculation error on 5/8 multiplication' }
    ]
  },
  {
    id: 2,
    domain: 'Mathematics & Numeracy',
    difficulty: 'Advanced',
    gradeLevel: 'Grade 5 - 6',
    question: 'What is the perimeter of a rectangular kitchen garden measuring 14.5 meters long and 8.2 meters wide?',
    options: [
      { text: '22.7 m', correct: false, insight: 'Forgot to multiply length and width by 2' },
      { text: '45.4 m', correct: true, insight: 'Accurately applied 2(L + W) perimeter formula' },
      { text: '118.9 m²', correct: false, insight: 'Calculated area instead of perimeter' },
      { text: '46.4 m', correct: false, insight: 'Slight addition error in decimals' }
    ]
  },
  {
    id: 3,
    domain: 'Science & Technology',
    difficulty: 'Foundation',
    gradeLevel: 'Grade 4',
    question: 'During a home science experiment on matter, which method is best for separating salt dissolved in a glass of water from Lake Bogoria?',
    options: [
      { text: 'Filtration with paper filter', correct: false, insight: 'Salt particles are dissolved in solution' },
      { text: 'Evaporation / boiling', correct: true, insight: 'Understands phase change to leave solute crystals' },
      { text: 'Decantation', correct: false, insight: 'Only separates insoluble heavy sediments' },
      { text: 'Sieving', correct: false, insight: 'Only separates dry solid particles of different sizes' }
    ]
  },
  {
    id: 4,
    domain: 'Science & Technology',
    difficulty: 'Intermediate',
    gradeLevel: 'Grade 5',
    question: 'Why do acacia trees in Tsavo drop their leaves during the dry hot season?',
    options: [
      { text: 'To collect more sunlight', correct: false, insight: 'Incorrect adaptation mechanism' },
      { text: 'To reduce water loss through transpiration', correct: true, insight: 'Understands plant xerophytic adaptations' },
      { text: 'Because they are diseased', correct: false, insight: 'Confuses seasonal adaptation with pathogen' },
      { text: 'To encourage herbivores to feed', correct: false, insight: 'Opposite of survival adaptation' }
    ]
  },
  {
    id: 5,
    domain: 'English Literacy & Syntax',
    difficulty: 'Intermediate',
    gradeLevel: 'Grade 4 - 5',
    question: 'Identify the sentence with the correct punctuation and direct speech capitalization:',
    options: [
      { text: '"Look at that eagle!" shouted Amani, "it is soaring so high."', correct: false, insight: 'Second clause in split sentence must follow lowercase if continuation' },
      { text: '"Look at that eagle!" shouted Amani. "It is soaring so high."', correct: true, insight: 'Accurate terminal punctuation and capitalized new quote' },
      { text: 'Look at that eagle shouted Amani "it is soaring so high"', correct: false, insight: 'Missing introductory quotes and commas' },
      { text: '"Look at that eagle", shouted Amani! "it is soaring so high."', correct: false, insight: 'Misplaced comma outside quotation marks' }
    ]
  },
  {
    id: 6,
    domain: 'English Literacy & Syntax',
    difficulty: 'Advanced',
    gradeLevel: 'Grade 5 - 6',
    question: 'Select the synonym that best completes the sentence: "The brave ranger remained __________ despite the sudden storm."',
    options: [
      { text: 'trepidatious', correct: false, insight: 'Means fearful or apprehensive' },
      { text: 'undaunted', correct: true, insight: 'Understands advanced vocabulary indicating fearlessness' },
      { text: 'hesitant', correct: false, insight: 'Means unsure or pausing' },
      { text: 'fragile', correct: false, insight: 'Means delicate or easily broken' }
    ]
  },
  {
    id: 7,
    domain: 'Kiswahili Mufti',
    difficulty: 'Foundation',
    gradeLevel: 'Grade 4',
    question: 'Tunga sentensi sahihi ukitumia nomino "Wanafunzi" katika ngeli ya A-WA:',
    options: [
      { text: 'Wanafunzi hii imefika mapema shuleni.', correct: false, insight: 'Kosa la upatanisho wa kisarufi (ngeli ya I-ZI)' },
      { text: 'Wanafunzi hawa wamefika mapema shuleni.', correct: true, insight: 'Upatanisho sahihi wa kisarufi wa ngeli ya A-WA' },
      { text: 'Wanafunzi hizi zimefika mapema shuleni.', correct: false, insight: 'Kosa la viambishi awali vya ngeli ya I-ZI' },
      { text: 'Wanafunzi hao limefika mapema shuleni.', correct: false, insight: 'Kosa la kiambishi cha ngeli ya LI-YA' }
    ]
  },
  {
    id: 8,
    domain: 'Kiswahili Mufti',
    difficulty: 'Intermediate',
    gradeLevel: 'Grade 5',
    question: 'Kiteuzi kipi kina maana sawa na methali: "Mcheza kwao hutuzwa"?',
    options: [
      { text: 'Mtu anayejituma katika jamii yake hutambuliwa na kupongezwa', correct: true, insight: 'Ufahamu mzuri wa mafunzo ya methali za Kiswahili' },
      { text: 'Watu wengi hupenda kucheza nyumbani pekee', correct: false, insight: 'Kutafsiri methali kijuujuu bila kuingia ndani' },
      { text: 'Zawadi hutolewa kwa watoto tu', correct: false, insight: 'Tafsiri potofu' },
      { text: 'Haupaswi kusafiri mbali na nyumbani', correct: false, insight: 'Kukosa maana halisi ya methali' }
    ]
  }
];

export default function PlacementEngine({ activeChild = 'Liam Kiprop', onApplyILP }) {
  const [stage, setStage] = useState('intro'); // 'intro' | 'testing' | 'results'
  const [selectedCurriculum, setSelectedCurriculum] = useState('CBC');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [selectedOption, setSelectedOption] = useState(null);
  const [appliedSuccess, setAppliedSuccess] = useState(false);

  const currentQ = DIAGNOSTIC_QUESTIONS[currentIndex];
  const totalQ = DIAGNOSTIC_QUESTIONS.length;
  const progressPercent = Math.round(((currentIndex) / totalQ) * 100);

  const handleSelectOption = (idx) => {
    setSelectedOption(idx);
  };

  const handleNext = () => {
    if (selectedOption === null) return;
    const isCorrect = currentQ.options[selectedOption].correct;
    const insight = currentQ.options[selectedOption].insight;
    
    const updatedAnswers = {
      ...answers,
      [currentQ.id]: {
        selected: selectedOption,
        correct: isCorrect,
        domain: currentQ.domain,
        insight
      }
    };
    setAnswers(updatedAnswers);
    setSelectedOption(null);

    if (currentIndex + 1 < totalQ) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setStage('results');
    }
  };

  const handleRestart = () => {
    setAnswers({});
    setCurrentIndex(0);
    setSelectedOption(null);
    setAppliedSuccess(false);
    setStage('intro');
  };

  // Evaluation calculations
  const domainBreakdown = () => {
    const domains = {};
    DIAGNOSTIC_QUESTIONS.forEach(q => {
      if (!domains[q.domain]) {
        domains[q.domain] = { total: 0, correct: 0 };
      }
      domains[q.domain].total += 1;
      if (answers[q.id]?.correct) {
        domains[q.domain].correct += 1;
      }
    });
    return Object.keys(domains).map(dom => ({
      domain: dom,
      score: Math.round((domains[dom].correct / domains[dom].total) * 100),
      status: (domains[dom].correct / domains[dom].total) >= 0.75 ? 'Mastery' : ((domains[dom].correct / domains[dom].total) >= 0.5 ? 'On Track' : 'Needs Scaffolding')
    }));
  };

  const overallCorrect = Object.values(answers).filter(a => a.correct).length;
  const overallScore = Math.round((overallCorrect / totalQ) * 100);

  const getPlacementLevel = () => {
    if (overallScore >= 85) return { grade: 'Grade 5 Advanced / Accelerated', pace: 'Fast Track (4 hrs/day)', badge: 'Exceeding Expectations' };
    if (overallScore >= 60) return { grade: 'Grade 4 Ready / Grade 5 Emerging', pace: 'Standard Pacing (3.5 hrs/day)', badge: 'Meeting Expectations' };
    return { grade: 'Grade 4 Foundation / Target Review', pace: 'Deep Guided Focus (3 hrs/day)', badge: 'Approaching Expectations' };
  };

  const placement = getPlacementLevel();

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', paddingBottom: '40px' }}>
      
      {/* Header Banner */}
      <div className="glass-panel" style={{
        padding: '28px 32px', marginBottom: '28px',
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(14, 21, 36, 0.95) 100%)',
        border: '1.5px solid rgba(16, 185, 129, 0.35)', position: 'relative'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <div className="glass-pill" style={{ color: '#10B981', border: '1px solid rgba(16,185,129,0.3)', marginBottom: '8px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <Compass size={14} />
              <span>US-Style Adaptive Diagnostic Placement Engine</span>
            </div>
            <h1 style={{ fontSize: '1.8rem', margin: '4px 0', fontWeight: 800 }}>
              Diagnostic Assessment & Individualized Learning Plan
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0, maxWidth: '680px' }}>
              Like US microschool pioneers (Prenda & Primer), determine <strong style={{ color: '#10B981' }}>{activeChild}</strong>'s exact baseline across core competencies, uncover hidden gaps, and automatically configure an adaptive syllabus.
            </p>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', marginBottom: '4px' }}>
              Target Curriculum:
            </label>
            <select 
              value={selectedCurriculum}
              onChange={(e) => setSelectedCurriculum(e.target.value)}
              className="custom-select"
              style={{ minWidth: '220px' }}
            >
              <option value="CBC">Kenya CBC (Grade 4-6)</option>
              <option value="Cambridge">British Cambridge (Stage 4-5)</option>
              <option value="ACE">American ACE / Homeschool</option>
            </select>
          </div>
        </div>
      </div>

      {/* STAGE: INTRO */}
      {stage === 'intro' && (
        <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
          <div style={{
            width: '72px', height: '72px', borderRadius: '20px',
            background: 'rgba(16, 185, 129, 0.15)', border: '1.5px solid rgba(16, 185, 129, 0.4)',
            color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 20px', boxShadow: '0 8px 24px rgba(16, 185, 129, 0.2)'
          }}>
            <Brain size={36} />
          </div>

          <h2 style={{ fontSize: '1.6rem', marginBottom: '10px' }}>Ready to Discover {activeChild}'s True Baseline?</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', maxWidth: '560px', margin: '0 auto 28px' }}>
            This quick 8-question adaptive assessment takes roughly 10 minutes. It adapts across Numeracy, Science, English, and Kiswahili to map skill frontiers without pressure.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', textAlign: 'left', marginBottom: '32px' }}>
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)', borderRadius: '14px', padding: '18px' }}>
              <Target size={20} color="#10B981" style={{ marginBottom: '8px' }} />
              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#F8FAFC' }}>No Grade Bias</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                Evaluates true conceptual grasp rather than traditional age-based pigeonholing.
              </div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)', borderRadius: '14px', padding: '18px' }}>
              <Sparkles size={20} color="#818CF8" style={{ marginBottom: '8px' }} />
              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#F8FAFC' }}>Instant ILP</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                Generates customized pacing, strengths report, and targeted gap interventions.
              </div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)', borderRadius: '14px', padding: '18px' }}>
              <ShieldCheck size={20} color="#F59E0B" style={{ marginBottom: '8px' }} />
              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#F8FAFC' }}>Zero High-Stakes Stress</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                Friendly format designed so learners can think comfortably and independently.
              </div>
            </div>
          </div>

          <button
            onClick={() => setStage('testing')}
            className="btn-primary"
            style={{ fontSize: '1rem', padding: '14px 36px', gap: '10px' }}
          >
            <span>Start Diagnostic Assessment</span>
            <ArrowRight size={18} />
          </button>
        </div>
      )}

      {/* STAGE: TESTING (THE CORE QUESTION SCREEN) */}
      {stage === 'testing' && currentQ && (
        <div style={{ maxWidth: '840px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Progress Tracker Card */}
          <div className="glass-panel" style={{ padding: '18px 24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.82rem', marginBottom: '10px' }}>
              <span style={{ fontWeight: 800, color: '#10B981' }}>
                Question {currentIndex + 1} of {totalQ}
              </span>
              <span style={{ color: 'var(--text-secondary)' }}>
                {currentQ.domain} • <strong style={{ color: '#E2E8F0' }}>{currentQ.difficulty}</strong>
              </span>
              <span style={{ color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                {Math.round(((currentIndex) / totalQ) * 100)}% Completed
              </span>
            </div>

            {/* Progress Bar Track */}
            <div style={{ width: '100%', height: '10px', background: 'rgba(0,0,0,0.4)', borderRadius: '999px', overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                width: `${((currentIndex + 1) / totalQ) * 100}%`,
                background: 'linear-gradient(90deg, #10B981 0%, #38BDF8 100%)',
                borderRadius: '999px',
                transition: 'width 0.3s ease'
              }} />
            </div>
          </div>

          {/* Question & Options Card */}
          <div className="glass-panel" style={{ padding: '36px', border: '1.5px solid rgba(255,255,255,0.1)' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <span className="glass-pill" style={{ color: '#38BDF8', fontSize: '0.75rem', padding: '4px 10px' }}>
                {currentQ.gradeLevel} Benchmark
              </span>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Standard: {selectedCurriculum}
              </span>
            </div>

            {/* Question Text */}
            <h3 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#F8FAFC', lineHeight: 1.5, marginBottom: '24px' }}>
              {currentQ.question}
            </h3>

            {/* Option Buttons (Stacked vertically with letters A, B, C, D) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '28px' }}>
              {currentQ.options.map((opt, idx) => {
                const isSelected = selectedOption === idx;
                const letter = String.fromCharCode(65 + idx);

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectOption(idx)}
                    style={{
                      width: '100%',
                      padding: '18px 20px',
                      borderRadius: '14px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                      textAlign: 'left',
                      cursor: 'pointer',
                      fontSize: '1rem',
                      fontFamily: 'var(--font-body)',
                      fontWeight: isSelected ? 700 : 500,
                      background: isSelected ? 'rgba(16, 185, 129, 0.16)' : 'rgba(255, 255, 255, 0.03)',
                      border: isSelected ? '2px solid #10B981' : '1px solid var(--border-card)',
                      color: isSelected ? '#F8FAFC' : '#E2E8F0',
                      boxShadow: isSelected ? '0 4px 20px rgba(16, 185, 129, 0.25)' : 'none',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.25)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                        e.currentTarget.style.borderColor = 'var(--border-card)';
                      }
                    }}
                  >
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      background: isSelected ? '#10B981' : 'rgba(255, 255, 255, 0.08)',
                      color: isSelected ? '#022c22' : '#94A3B8',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '0.9rem',
                      flexShrink: 0
                    }}>
                      {letter}
                    </div>
                    <span style={{ flex: 1, lineHeight: 1.4 }}>{opt.text}</span>
                  </button>
                );
              })}
            </div>

            {/* Bottom Actions Bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '20px', borderTop: '1px solid var(--border-subtle)' }}>
              <button
                type="button"
                onClick={handleRestart}
                className="btn-secondary"
                style={{ fontSize: '0.82rem', padding: '8px 16px', gap: '6px' }}
              >
                <RotateCcw size={14} />
                <span>Exit Assessment</span>
              </button>

              <button
                type="button"
                onClick={handleNext}
                disabled={selectedOption === null}
                className="btn-primary"
                style={{
                  fontSize: '0.92rem',
                  padding: '10px 24px',
                  opacity: selectedOption !== null ? 1 : 0.45,
                  cursor: selectedOption !== null ? 'pointer' : 'not-allowed',
                  gap: '8px'
                }}
              >
                <span>{currentIndex + 1 === totalQ ? 'Finalize Assessment' : 'Next Question'}</span>
                <ArrowRight size={16} />
              </button>
            </div>

          </div>

        </div>
      )}

      {/* STAGE: RESULTS & ILP GENERATION */}
      {stage === 'results' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Top Score Banner */}
          <div className="glass-panel" style={{
            padding: '36px',
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(14, 21, 36, 0.95) 100%)',
            border: '2px solid rgba(16, 185, 129, 0.4)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '24px' }}>
              <div style={{ maxWidth: '600px' }}>
                <span className="glass-pill" style={{ color: '#10B981', border: '1px solid rgba(16,185,129,0.3)', marginBottom: '10px' }}>
                  <Award size={14} />
                  <span>Assessment Complete • {placement.badge}</span>
                </span>
                <h2 style={{ fontSize: '2rem', margin: '4px 0 10px 0' }}>
                  Diagnostic Report for {activeChild}
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.5, margin: '0 0 16px 0' }}>
                  Evaluated against {selectedCurriculum} standards. {activeChild} demonstrated mastery in <strong>{overallCorrect} of {totalQ}</strong> diagnostic milestones ({overallScore}% overall).
                </p>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <span className="glass-pill" style={{ color: '#10B981', background: 'rgba(16,185,129,0.1)' }}>
                    🎯 Recommended: <strong>{placement.grade}</strong>
                  </span>
                  <span className="glass-pill" style={{ color: '#38BDF8', background: 'rgba(56,189,248,0.1)' }}>
                    ⏱️ Target Cadence: <strong>{placement.pace}</strong>
                  </span>
                </div>
              </div>

              {/* Radial Score Gauge */}
              <div style={{
                width: '150px', height: '150px', borderRadius: '50%',
                background: 'rgba(0,0,0,0.5)', border: '4px solid #10B981',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 0 30px rgba(16, 185, 129, 0.3)', flexShrink: 0
              }}>
                <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#10B981', fontFamily: 'monospace' }}>
                  {overallScore}%
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                  Mastery Score
                </div>
              </div>
            </div>
          </div>

          {/* Domain Breakdown Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
            {domainBreakdown().map((item, i) => (
              <div key={i} className="glass-panel" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#F8FAFC' }}>{item.domain}</span>
                  <span className="glass-pill" style={{
                    fontSize: '0.7rem',
                    color: item.status === 'Mastery' ? '#10B981' : (item.status === 'On Track' ? '#38BDF8' : '#F59E0B')
                  }}>
                    {item.status}
                  </span>
                </div>
                <div style={{ width: '100%', height: '8px', background: 'rgba(0,0,0,0.4)', borderRadius: '999px', overflow: 'hidden', marginBottom: '8px' }}>
                  <div style={{
                    height: '100%',
                    width: `${item.score}%`,
                    background: item.status === 'Mastery' ? '#10B981' : (item.status === 'On Track' ? '#38BDF8' : '#F59E0B')
                  }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  <span>Score: {item.score}%</span>
                  <span>{item.score >= 70 ? 'Ready for acceleration' : 'Needs scaffolding'}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Generated ILP Roadmap Card */}
          <div className="glass-panel" style={{ padding: '30px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Sparkles size={22} color="#10B981" />
                <h3 style={{ fontSize: '1.25rem', margin: 0 }}>Personalized ILP Action Roadmap</h3>
              </div>
              <span className="glass-pill" style={{ fontSize: '0.72rem' }}>Term 1, 2026</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '28px' }}>
              <div style={{ background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.25)', borderRadius: '14px', padding: '18px' }}>
                <div style={{ color: '#10B981', fontWeight: 800, fontSize: '0.85rem', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle2 size={16} />
                  <span>Key Strengths</span>
                </div>
                <ul style={{ fontSize: '0.82rem', color: '#E2E8F0', paddingLeft: '18px', lineHeight: 1.6 }}>
                  <li>Practical fraction problem solving in real contexts</li>
                  <li>Good understanding of ecological science and plant adaptations</li>
                  <li>Fluent conversational syntax & vocabulary</li>
                </ul>
              </div>

              <div style={{ background: 'rgba(245, 158, 11, 0.05)', border: '1px solid rgba(245, 158, 11, 0.25)', borderRadius: '14px', padding: '18px' }}>
                <div style={{ color: '#F59E0B', fontWeight: 800, fontSize: '0.85rem', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <AlertTriangle size={16} />
                  <span>Priority Focus Gaps</span>
                </div>
                <ul style={{ fontSize: '0.82rem', color: '#E2E8F0', paddingLeft: '18px', lineHeight: 1.6 }}>
                  <li>Kiswahili ngeli agreement (A-WA & I-ZI prefixes)</li>
                  <li>Direct speech quote punctuation in creative writing</li>
                  <li>Geometric perimeter formulas with decimal measurements</li>
                </ul>
              </div>

              <div style={{ background: 'rgba(56, 189, 248, 0.05)', border: '1px solid rgba(56, 189, 248, 0.25)', borderRadius: '14px', padding: '18px' }}>
                <div style={{ color: '#38BDF8', fontWeight: 800, fontSize: '0.85rem', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Zap size={16} />
                  <span>Recommended Support</span>
                </div>
                <ul style={{ fontSize: '0.82rem', color: '#E2E8F0', paddingLeft: '18px', lineHeight: 1.6 }}>
                  <li>🧑‍🏫 <strong>Teacher Mercy Cherono</strong> (Math Specialist)</li>
                  <li>👥 <strong>Kilimani STEM Pod</strong> (Science practicals)</li>
                  <li>📚 <strong>Reading Ladder Level 4B</strong> (30 mins daily)</li>
                </ul>
              </div>
            </div>

            {/* Bottom ILP Action Buttons */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', paddingTop: '18px', borderTop: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ShieldCheck size={16} color="#10B981" />
                <span>Aligned with Kenya Basic Education Act & Cambridge Stage 4</span>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  type="button"
                  onClick={handleRestart}
                  className="btn-secondary"
                  style={{ fontSize: '0.86rem', padding: '10px 18px' }}
                >
                  Retake Assessment
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setAppliedSuccess(true);
                    if (onApplyILP) onApplyILP({ child: activeChild, placement });
                  }}
                  className="btn-primary"
                  style={{ fontSize: '0.86rem', padding: '10px 22px', gap: '8px' }}
                >
                  {appliedSuccess ? (
                    <>
                      <CheckCircle2 size={16} />
                      <span>Applied to {activeChild}'s Dashboard!</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={16} />
                      <span>Apply ILP to Student Dashboard</span>
                    </>
                  )}
                </button>
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}