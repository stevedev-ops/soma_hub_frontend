import React, { useState, useEffect } from 'react';
import { 
  Award, CheckCircle, XCircle, RotateCcw, ArrowRight, Zap, 
  Sparkles, Trophy, Flame, Volume2, VolumeX, ShieldCheck, 
  Star, ChevronRight, HelpCircle, Users, BookOpen, Layers
} from 'lucide-react';
import { telemetryService } from '../../services/homeworkTelemetryStore';
import { cbaRubricStore } from '../../services/cbaRubricStore';

// Web Audio sound synthesizer (zero external dependencies)
function playSound(type) {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);

    if (type === 'correct') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25, audioCtx.currentTime); // C5
      osc.frequency.exponentialRampToValueAtTime(659.25, audioCtx.currentTime + 0.1); // E5
      osc.frequency.exponentialRampToValueAtTime(783.99, audioCtx.currentTime + 0.2); // G5
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.35);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.35);
    } else if (type === 'wrong') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, audioCtx.currentTime); // A3
      osc.frequency.exponentialRampToValueAtTime(164.81, audioCtx.currentTime + 0.25); // E3
      gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.3);
    } else if (type === 'fanfare') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, audioCtx.currentTime);
      osc.frequency.setValueAtTime(554.37, audioCtx.currentTime + 0.1);
      osc.frequency.setValueAtTime(659.25, audioCtx.currentTime + 0.2);
      osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.3);
      gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.6);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.6);
    }
  } catch (e) {
    // Audio context may be restricted before user interaction
  }
}

export default function RevisionTests() {
  const [selectedSubject, setSelectedSubject] = useState('ALL');
  const [currentAnswers, setCurrentAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [streak, setStreak] = useState(0);
  const [earnedXp, setEarnedXp] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showBadgeUnlock, setShowBadgeUnlock] = useState(null);

  // Student Gamification Stats (persisted in local storage)
  const [userXp, setUserXp] = useState(() => {
    return parseInt(localStorage.getItem('somahome_student_xp_total') || '1450', 10);
  });

  const [unlockedBadges, setUnlockedBadges] = useState(() => {
    const saved = localStorage.getItem('somahome_unlocked_badges');
    return saved ? JSON.parse(saved) : ['🌱 First Step Scholar'];
  });

  // Question Bank
  const allQuestions = [
    {
      id: 1,
      subject: 'Mathematics',
      question: 'Which of the following fractions is equivalent to 2/4 (two quarters)?',
      options: ['1/3', '1/2', '3/4', '2/8'],
      correct: 1,
      explanation: 'Dividing numerator and denominator by 2 gives 1/2. Two quarters of a paper plate is equal to one half.',
      curriculumCode: 'CBC-G4-MAT-01'
    },
    {
      id: 2,
      subject: 'Science & Tech',
      question: 'In your household gravity water filter, why is crushed charcoal placed in the filter layers?',
      options: [
        'To make the water change color into black',
        'To absorb odors, impurities, and tiny chemical contaminants',
        'To heat the water up to boiling point',
        'To stop the water from flowing down'
      ],
      correct: 1,
      explanation: 'Activated charcoal has microscopic pores that trap organic chemicals, odors, and fine impurities.',
      curriculumCode: 'CBC-G4-SCI-03'
    },
    {
      id: 3,
      subject: 'Mathematics',
      question: 'Liam has three KES 500 notes, two KES 200 notes, and five KES 50 notes. What is his total amount?',
      options: ['KES 1,950', 'KES 2,150', 'KES 2,050', 'KES 1,850'],
      correct: 1,
      explanation: '(3 × 500) + (2 × 200) + (5 × 50) = 1500 + 400 + 250 = KES 2,150.',
      curriculumCode: 'CBC-G4-MAT-04'
    },
    {
      id: 4,
      subject: 'English Language',
      question: 'Choose the most descriptive sensory adjective to complete: "The ______ mud squelched beneath Liam\'s gumboots as he explored the garden."',
      options: ['happy', 'slimy and cold', 'quick', 'loud'],
      correct: 1,
      explanation: '"Slimy and cold" appeals directly to the sense of touch and texture.',
      curriculumCode: 'CBC-G4-ENG-02'
    },
    {
      id: 5,
      subject: 'Kiswahili',
      question: 'Nomino ya kundi kwa mkusanyiko mkubwa wa nyuki wanaoishi pamoja kwenye mzinga ni:',
      options: ['Kikosi cha nyuki', 'Bumba au mkate wa nyuki', 'Chane ya nyuki', 'Kipeto cha nyuki'],
      correct: 1,
      explanation: 'Katika sarufi ya Kiswahili, mkusanyiko wa nyuki huitwa "mkate wa nyuki" au "bumba la nyuki".',
      curriculumCode: 'CBC-G4-KIS-01'
    },
    {
      id: 6,
      subject: 'Agriculture & Nutrition',
      question: 'Which of the following organic materials is BEST suited for the "Green Layer" in your compost pit?',
      options: ['Dry maize stalks', 'Fresh vegetable peelings and green grass cuttings', 'Plastic wrapper bags', 'Crushed stones'],
      correct: 1,
      explanation: 'Fresh vegetable peels and green grass provide nitrogen-rich moisture that activates composting bacteria.',
      curriculumCode: 'CBC-G4-AGR-02'
    }
  ];

  const questions = selectedSubject === 'ALL'
    ? allQuestions
    : allQuestions.filter(q => q.subject === selectedSubject);

  const handleSelectOption = (qId, optionIdx) => {
    if (submitted) return;
    
    const targetQ = allQuestions.find(q => q.id === qId);
    const isCorrect = targetQ.correct === optionIdx;

    if (soundEnabled) {
      playSound(isCorrect ? 'correct' : 'wrong');
    }

    if (isCorrect) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      const streakBonus = newStreak >= 3 ? 25 : 0;
      const roundXp = 50 + streakBonus;
      setEarnedXp(prev => prev + roundXp);

      // Check for Streak Wizard Badge
      if (newStreak >= 4 && !unlockedBadges.includes('⚡ Streak Wizard (4 in a row)')) {
        const updatedBadges = [...unlockedBadges, '⚡ Streak Wizard (4 in a row)'];
        setUnlockedBadges(updatedBadges);
        localStorage.setItem('somahome_unlocked_badges', JSON.stringify(updatedBadges));
        setShowBadgeUnlock('⚡ Streak Wizard');
        if (soundEnabled) playSound('fanfare');
        setTimeout(() => setShowBadgeUnlock(null), 4000);
      }
    } else {
      setStreak(0);
    }

    setCurrentAnswers(prev => ({
      ...prev,
      [qId]: optionIdx
    }));
  };

  const calculateScore = () => {
    let score = 0;
    questions.forEach(q => {
      if (currentAnswers[q.id] === q.correct) {
        score += 1;
      }
    });
    return score;
  };

  const handleSubmitQuiz = () => {
    setSubmitted(true);
    const score = calculateScore();
    const pct = Math.round((score / questions.length) * 100);

    // Persist XP
    const finalBonus = pct === 100 ? 150 : (pct >= 80 ? 75 : 25);
    const totalGained = earnedXp + finalBonus;
    const newTotalXp = userXp + totalGained;
    setUserXp(newTotalXp);
    localStorage.setItem('somahome_student_xp_total', newTotalXp.toString());

    // Map to CBA Formative Evaluation Rubric
    let cbaLevel = 'ME';
    let cbaDesc = 'Meets Curriculum Standards';
    if (pct >= 85) { cbaLevel = 'EE'; cbaDesc = 'Exceeds Expectations with Conceptual Distinction'; }
    else if (pct >= 60) { cbaLevel = 'ME'; cbaDesc = 'Meets Expectations Independently'; }
    else if (pct >= 45) { cbaLevel = 'AE'; cbaDesc = 'Approaching Expectations with Guidance'; }
    else { cbaLevel = 'BE'; cbaDesc = 'Below Expectations - Requires Targeted Review'; }

    // Save into CBA Rubric Store for official transcripts
    cbaRubricStore.saveEvaluation({
      taskTitle: `Weekly Checkpoint Quiz (${selectedSubject})`,
      subject: selectedSubject === 'ALL' ? 'Mathematics & Science' : selectedSubject,
      strand: 'Formative Diagnostic Assessment',
      subStrand: 'Concept Mastery & Applied Inquiry',
      rating: cbaLevel,
      rubricLevelDesc: cbaDesc,
      evaluator: 'Quiz Arcade Engine',
      notes: `Learner scored ${score}/${questions.length} (${pct}%). Gained +${totalGained} XP.`
    });

    // Check Badges Unlocked
    let newBadgeName = null;
    if (pct === 100 && selectedSubject === 'Mathematics' && !unlockedBadges.includes('🔢 Fraction Pioneer')) {
      newBadgeName = '🔢 Fraction Pioneer';
    } else if (pct === 100 && selectedSubject === 'Science & Tech' && !unlockedBadges.includes('🧪 Water Lab Master')) {
      newBadgeName = '🧪 Water Lab Master';
    } else if (pct === 100 && selectedSubject === 'ALL' && !unlockedBadges.includes('👑 Grand Arcade Master')) {
      newBadgeName = '👑 Grand Arcade Master';
    }

    if (newBadgeName) {
      const updated = [...unlockedBadges, newBadgeName];
      setUnlockedBadges(updated);
      localStorage.setItem('somahome_unlocked_badges', JSON.stringify(updated));
      setShowBadgeUnlock(newBadgeName);
    }

    if (soundEnabled) playSound('fanfare');

    // Telemetry log
    telemetryService.logActiveSession(
      `Weekly Quiz Completed: ${score}/${questions.length} (${pct}%) +${totalGained} XP`,
      'Quiz Arcade Engine',
      25,
      '🎮'
    );
  };

  const handleReset = () => {
    setCurrentAnswers({});
    setSubmitted(false);
    setStreak(0);
    setEarnedXp(0);
  };

  const score = calculateScore();
  const percentage = Math.round((score / questions.length) * 100);

  // Leaderboard mock data with reactive Liam XP
  const podLeaderboard = [
    { rank: 1, name: 'Syokimau Explorers Pod', region: 'Nairobi East', members: 6, xp: 3450, avatar: '🚀' },
    { rank: 2, name: 'Karen Nature & Agro Pod', region: 'Nairobi West', members: 4, xp: 3120, avatar: '🌿' },
    { rank: 3, name: 'Liam Kariuki (Your Learner)', region: 'Syokimau Estate', members: 1, xp: userXp, isUser: true, avatar: '👦' },
    { rank: 4, name: 'Kilimani STEM Innovators', region: 'Nairobi Central', members: 5, xp: 2600, avatar: '⚡' },
    { rank: 5, name: 'Mombasa Coast Scholars', region: 'Nyali Coast', members: 4, xp: 2340, avatar: '🌊' }
  ].sort((a, b) => b.xp - a.xp).map((item, idx) => ({ ...item, rank: idx + 1 }));

  return (
    <div className="fade-in" style={{ paddingBottom: '60px' }}>
      
      {/* Badge Unlock Celebration Banner */}
      {showBadgeUnlock && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 9999,
          background: 'linear-gradient(135deg, #10B981, #047857)',
          color: '#FFF',
          padding: '16px 24px',
          borderRadius: '16px',
          boxShadow: '0 10px 30px rgba(16,185,129,0.5)',
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          animation: 'bounce 0.6s ease'
        }}>
          <Trophy size={32} color="#FBBF24" />
          <div>
            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 800, opacity: 0.9 }}>
              New Badge Unlocked!
            </div>
            <div style={{ fontSize: '1.1rem', fontWeight: 900 }}>
              {showBadgeUnlock}
            </div>
          </div>
        </div>
      )}

      {/* Hero Banner */}
      <div className="glass-panel" style={{
        padding: '24px',
        marginBottom: '24px',
        background: 'linear-gradient(135deg, rgba(16,185,129,0.15) 0%, rgba(99,102,241,0.2) 100%)',
        border: '1px solid rgba(16,185,129,0.3)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span className="glass-pill" style={{ background: '#10B981', color: '#FFF', fontWeight: 800 }}>
              🎮 QUIZ ARCADE ARENA
            </span>
            <span className="glass-pill" style={{ color: '#38BDF8', borderColor: 'rgba(56,189,248,0.3)' }}>
              KNEC CBC Aligned
            </span>
          </div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 900, margin: '0 0 6px 0', color: '#F8FAFC' }}>
            Weekly Checkpoint & Gamified Arcade
          </h1>
          <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '640px' }}>
            Test conceptual mastery, build daily question streaks, earn neighborhood XP, and automatically evaluate Kenya CBC formative grade levels!
          </p>
        </div>

        {/* Live Gamer Stats Bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
          {/* XP Pill */}
          <div style={{
            background: 'rgba(0,0,0,0.4)',
            border: '1px solid rgba(245,158,11,0.4)',
            padding: '10px 16px',
            borderRadius: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <Sparkles size={20} color="#FBBF24" />
            <div>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 800 }}>TOTAL XP</div>
              <div style={{ fontSize: '1.15rem', fontWeight: 900, color: '#FBBF24' }}>{userXp} XP</div>
            </div>
          </div>

          {/* Streak Combo Pill */}
          <div style={{
            background: streak >= 3 ? 'rgba(239,68,68,0.2)' : 'rgba(0,0,0,0.4)',
            border: streak >= 3 ? '1px solid #EF4444' : '1px solid var(--border-subtle)',
            padding: '10px 16px',
            borderRadius: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <Flame size={20} color={streak >= 3 ? '#EF4444' : '#64748B'} />
            <div>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 800 }}>STREAK</div>
              <div style={{ fontSize: '1.15rem', fontWeight: 900, color: streak >= 3 ? '#EF4444' : '#F8FAFC' }}>
                {streak}x {streak >= 3 ? '🔥 (1.5x XP)' : ''}
              </div>
            </div>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="glass-pill"
            style={{
              padding: '10px 12px',
              cursor: 'pointer',
              color: soundEnabled ? '#34D399' : '#64748B'
            }}
            title={soundEnabled ? 'Mute Game SFX' : 'Enable SFX'}
          >
            {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </button>
        </div>
      </div>

      {/* Filter & Subject Selection */}
      <div className="glass-panel" style={{ padding: '16px 20px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Choose Arena:
          </span>
          {['ALL', 'Mathematics', 'Science & Tech', 'English Language', 'Kiswahili', 'Agriculture & Nutrition'].map(subj => (
            <button
              key={subj}
              onClick={() => {
                setSelectedSubject(subj);
                handleReset();
              }}
              className={selectedSubject === subj ? 'btn-primary' : 'btn-secondary'}
              style={{
                fontSize: '0.78rem',
                padding: '6px 14px',
                borderRadius: '20px'
              }}
            >
              {subj === 'ALL' ? '🌟 All Subjects Combined' : subj}
            </button>
          ))}
        </div>

        <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
          {questions.length} Questions Available
        </div>
      </div>

      {/* 2 Column Layout: Quiz Questions vs Pod Leaderboard & Badges */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
        
        {/* LEFT COLUMN: Questions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {questions.map((q, idx) => {
            const isSelected = currentAnswers[q.id] !== undefined;
            const isCorrect = currentAnswers[q.id] === q.correct;

            return (
              <div
                key={q.id}
                className="glass-panel"
                style={{
                  padding: '20px',
                  border: submitted
                    ? isCorrect ? '1.5px solid #10B981' : '1.5px solid #EF4444'
                    : '1px solid var(--border-card)',
                  background: 'rgba(255,255,200,0.01)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span className="glass-pill" style={{ fontSize: '0.72rem', background: 'rgba(255,255,255,0.05)', color: '#38BDF8' }}>
                    Q{idx + 1} • {q.subject}
                  </span>

                  {submitted && (
                    <span style={{
                      fontSize: '0.8rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '4px',
                      color: isCorrect ? '#10B981' : '#EF4444'
                    }}>
                      {isCorrect ? <CheckCircle size={16} /> : <XCircle size={16} />}
                      {isCorrect ? 'Correct (+50 XP)' : 'Review Concept'}
                    </span>
                  )}
                </div>

                <h3 style={{ fontSize: '1.02rem', fontWeight: 700, margin: '0 0 16px 0', lineHeight: 1.5, color: '#F8FAFC' }}>
                  {q.question}
                </h3>

                {/* Option Buttons */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {q.options.map((opt, optIdx) => {
                    const isThisSelected = currentAnswers[q.id] === optIdx;
                    let optBg = isThisSelected ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.03)';
                    let optBorder = isThisSelected ? '1.5px solid #10B981' : '1px solid var(--border-subtle)';

                    if (submitted) {
                      if (optIdx === q.correct) {
                        optBg = 'rgba(16,185,129,0.25)';
                        optBorder = '1.5px solid #10B981';
                      } else if (isThisSelected && !isCorrect) {
                        optBg = 'rgba(239,68,68,0.25)';
                        optBorder = '1.5px solid #EF4444';
                      }
                    }

                    return (
                      <div
                        key={optIdx}
                        onClick={() => handleSelectOption(q.id, optIdx)}
                        style={{
                          background: optBg,
                          border: optBorder,
                          borderRadius: '12px',
                          padding: '12px 16px',
                          cursor: submitted ? 'default' : 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          fontSize: '0.9rem',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <span style={{
                            width: '26px', height: '26px', borderRadius: '50%',
                            background: isThisSelected ? '#10B981' : 'rgba(255,255,255,0.08)',
                            color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '0.78rem', fontWeight: 800
                          }}>
                            {String.fromCharCode(65 + optIdx)}
                          </span>
                          <span style={{ color: 'var(--text-primary)' }}>{opt}</span>
                        </div>
                        {submitted && optIdx === q.correct && (
                          <span style={{ fontSize: '0.74rem', color: '#34D399', fontWeight: 800 }}>✓ Correct</span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Explanation */}
                {submitted && (
                  <div style={{ marginTop: '14px', background: 'rgba(255,255,255,0.02)', padding: '12px 14px', borderRadius: '10px', borderLeft: '3px solid #F59E0B', fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
                    <strong style={{ color: '#FBBF24' }}>KICD Master Guide:</strong> {q.explanation}
                  </div>
                )}
              </div>
            );
          })}

          {/* Submit Action Bar */}
          <div className="glass-panel" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            {!submitted ? (
              <>
                <div>
                  <div style={{ fontSize: '0.92rem', fontWeight: 800 }}>
                    {Object.keys(currentAnswers).length} of {questions.length} Answered
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Finish to submit to KNEC CBA Formative Evaluation Store
                  </div>
                </div>

                <button
                  onClick={handleSubmitQuiz}
                  disabled={Object.keys(currentAnswers).length < questions.length}
                  className="btn-primary"
                  style={{
                    fontSize: '0.92rem',
                    padding: '10px 24px',
                    opacity: Object.keys(currentAnswers).length < questions.length ? 0.5 : 1,
                    cursor: Object.keys(currentAnswers).length < questions.length ? 'not-allowed' : 'pointer'
                  }}
                >
                  <span>Submit & Collect XP</span>
                  <ArrowRight size={16} />
                </button>
              </>
            ) : (
              <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span className="glass-pill" style={{
                      background: percentage >= 80 ? 'rgba(16,185,129,0.2)' : 'rgba(245,158,11,0.2)',
                      color: percentage >= 80 ? '#34D399' : '#FBBF24',
                      fontWeight: 800,
                      border: percentage >= 80 ? '1px solid #10B981' : '1px solid #F59E0B'
                    }}>
                      {percentage >= 85 ? 'EE - Exceeding Expectations' : percentage >= 60 ? 'ME - Meeting Expectations' : 'AE - Approaching Expectations'}
                    </span>
                    <span style={{ fontSize: '1.2rem', fontWeight: 900, color: '#F8FAFC' }}>
                      Score: {score}/{questions.length} ({percentage}%)
                    </span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    Saved to Official CBA Formative Records. Total XP updated.
                  </div>
                </div>

                <button
                  onClick={handleReset}
                  className="btn-secondary"
                  style={{ fontSize: '0.86rem', padding: '9px 18px', gap: '8px' }}
                >
                  <RotateCcw size={16} />
                  <span>Retake Arena Quiz</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Neighborhood Pod Leaderboard & Badges */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Pod Leaderboard */}
          <div className="glass-panel" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Trophy size={18} color="#FBBF24" />
                <span>Neighborhood Pod Leaderboard</span>
              </h3>
              <span className="glass-pill" style={{ fontSize: '0.7rem' }}>
                Kenya Live
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {podLeaderboard.map((item) => (
                <div
                  key={item.rank}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    borderRadius: '12px',
                    background: item.isUser ? 'rgba(16,185,129,0.18)' : 'rgba(255,255,255,0.02)',
                    border: item.isUser ? '1.5px solid #10B981' : '1px solid var(--border-subtle)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{
                      width: '24px', height: '24px', borderRadius: '50%',
                      background: item.rank === 1 ? '#F59E0B' : item.rank === 2 ? '#94A3B8' : item.rank === 3 ? '#B45309' : 'rgba(255,255,255,0.08)',
                      color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.72rem', fontWeight: 900
                    }}>
                      {item.rank}
                    </span>
                    <div>
                      <div style={{ fontSize: '0.86rem', fontWeight: item.isUser ? 800 : 600, color: item.isUser ? '#34D399' : '#F8FAFC' }}>
                        {item.avatar} {item.name}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                        {item.region} • {item.members} {item.members === 1 ? 'Learner' : 'Homeschoolers'}
                      </div>
                    </div>
                  </div>

                  <span style={{ fontSize: '0.9rem', fontWeight: 900, color: '#FBBF24' }}>
                    {item.xp} XP
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Badges Cabinet */}
          <div className="glass-panel" style={{ padding: '20px' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: '0 0 14px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Award size={18} color="#38BDF8" />
              <span>Unlocked Mastery Badges</span>
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '10px' }}>
              {unlockedBadges.map((badge, bIdx) => (
                <div
                  key={bIdx}
                  style={{
                    background: 'rgba(56,189,248,0.08)',
                    border: '1px solid rgba(56,189,248,0.3)',
                    borderRadius: '12px',
                    padding: '12px 10px',
                    textAlign: 'center',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    color: '#E0F2FE'
                  }}
                >
                  <div style={{ fontSize: '1.5rem', marginBottom: '4px' }}>
                    {badge.split(' ')[0]}
                  </div>
                  <div>
                    {badge.substring(badge.indexOf(' ') + 1)}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
