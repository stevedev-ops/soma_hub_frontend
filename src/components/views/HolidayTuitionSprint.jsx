import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Calendar, BookOpen, CheckCircle, Clock, Trophy, 
  Download, Printer, Play, Flame, Award, Zap, ArrowRight, 
  RotateCcw, Users, Check, Plus, Trash2, Sliders, MessageCircle, FileText, Send, CheckCircle2
} from 'lucide-react';
import VoicePlayerPill from '../VoicePlayerPill';

export default function HolidayTuitionSprint() {
  const [activeTabMode, setActiveTabMode] = useState('custom_builder'); // 'custom_builder' | 'prebuilt_sprints' | 'diagnostic'
  
  // Custom Holiday Plan State (Parent-Driven)
  const [sprintDurationWeeks, setSprintDurationWeeks] = useState(3);
  const [dailyTargetMins, setDailyTargetMins] = useState(60); // 45, 60, 90, 120
  const [selectedWeaknesses, setSelectedWeaknesses] = useState({
    'math_fractions': true,
    'kisw_sarufi': true,
    'eng_adjectives': true
  });
  const [customParentNotes, setCustomParentNotes] = useState('Liam needs extra confidence in fractions and Swahili tenses before Term 2.');
  const [savedPlanToast, setSavedPlanToast] = useState(false);
  const [activatedToLearnerToast, setActivatedToLearnerToast] = useState(false);
  const [completedCustomDays, setCompletedCustomDays] = useState({ '1_0': true });
  const [showCertificate, setShowCertificate] = useState(false);

  // Pre-cataloged Weakness Topics Pool for Parents
  const topicCatalog = [
    {
      subject: '🔢 Mathematics Activities',
      color: '#3B82F6',
      topics: [
        { id: 'math_fractions', name: 'Equivalent Fractions & Paper Plate Slices', duration: '25 mins', tip: 'Focus on 1/2 = 2/4 = 4/8 with physical folding' },
        { id: 'math_placevalue', name: '5-Digit Place Values (up to 100,000)', duration: '20 mins', tip: 'Decomposing Kenyan supermarket receipt totals' },
        { id: 'math_money', name: 'Kenyan Shilling Currency & Change Calculations', duration: '25 mins', tip: 'Word problems buying items with KES 1,000 notes' },
        { id: 'math_division', name: 'Multiplication Arrays & Long Division Step-by-Step', duration: '30 mins', tip: 'Equal grouping of bottle caps and counters' },
        { id: 'math_perimeter', name: 'Perimeter and Area of Irregular Shapes', duration: '25 mins', tip: 'Measuring balcony and garden boundaries in meters' }
      ]
    },
    {
      subject: '🇰🇪 Kiswahili Sarufi na Fasihi',
      color: '#D97706',
      topics: [
        { id: 'kisw_sarufi', name: 'Nyakati za Vitenzi (Uliopita, Uliopo, Ujao)', duration: '20 mins', tip: 'Kutunga sentensi kwa kutumia li-, na-, ta-' },
        { id: 'kisw_makundi', name: 'Nomino za Makundi (Bumba la nyuki, kundi la ng\'ombe)', duration: '20 mins', tip: 'Kutambua majina ya mkusanyiko wa wanyama na vitu' },
        { id: 'kisw_ufahamu', name: 'Kusoma kwa Ufahamu na Hadithi za Sungura', duration: '25 mins', tip: 'Kujibu maswali ya ufahamu na kueleza mafunzo' },
        { id: 'kisw_shairi', name: 'Ushairi wa Watoto na Tashbihi za Mazingira', duration: '20 mins', tip: 'Kutambua mishororo, vina na beti za shairi' }
      ]
    },
    {
      subject: '📖 English Language Arts',
      color: '#8B5CF6',
      topics: [
        { id: 'eng_adjectives', name: 'Sensory Adjectives & Story Opening Hooks', duration: '20 mins', tip: 'Describing textures, sounds, and sights in narrative writing' },
        { id: 'eng_dialogue', name: 'Dialogue Writing & Quotation Marks (" ")', duration: '25 mins', tip: 'Correct punctuation for direct speech between characters' },
        { id: 'eng_verbs', name: 'Irregular Past Tense Verbs & Conjunctions', duration: '20 mins', tip: 'Practicing caught, taught, flew, although, because' },
        { id: 'eng_comprehension', name: 'Reading Comprehension & Character Inferences', duration: '25 mins', tip: 'Inferring emotions and motives from story text' }
      ]
    },
    {
      subject: '🧪 Science & Applied Technology',
      color: '#10B981',
      topics: [
        { id: 'sci_filtration', name: 'Charcoal Gravity Water Filter Engineering', duration: '30 mins', tip: 'Building 4-layer sand and crushed jiko charcoal filter' },
        { id: 'sci_matter', name: 'States of Matter Kitchen Lab (Ice, Water, Steam)', duration: '25 mins', tip: 'Melting, boiling, and condensation observations' },
        { id: 'sci_soil', name: 'Garden Soil Organisms & Compost Layers', duration: '25 mins', tip: 'Layering dry leaves and vegetable peels with moisture' }
      ]
    }
  ];

  const toggleWeakness = (topicId) => {
    setSelectedWeaknesses(prev => ({
      ...prev,
      [topicId]: !prev[topicId]
    }));
  };

  // Generate Selected Topics List
  const allTopicsFlat = topicCatalog.flatMap(cat => cat.topics.map(t => ({ ...t, subject: cat.subject, color: cat.color })));
  const activeSelectedTopics = allTopicsFlat.filter(t => selectedWeaknesses[t.id]);

  // Build Personalized Multi-Week Schedule
  const daysPerWeek = 5;
  const totalDays = sprintDurationWeeks * daysPerWeek;
  
  const generatedSchedule = Array.from({ length: totalDays }).map((_, idx) => {
    const weekNum = Math.floor(idx / 5) + 1;
    const dayNum = (idx % 5) + 1;
    const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const assignedTopic = activeSelectedTopics.length > 0 
      ? activeSelectedTopics[idx % activeSelectedTopics.length] 
      : { name: 'Comprehensive CBC Revision', subject: 'General', duration: '30 mins', tip: 'Review previous workbook worksheets' };

    return {
      id: `${weekNum}_${dayNum}`,
      weekNum,
      dayNum,
      dayName: dayNames[dayNum - 1],
      topic: assignedTopic.name,
      subject: assignedTopic.subject,
      color: assignedTopic.color || '#3B82F6',
      duration: assignedTopic.duration,
      tip: assignedTopic.tip,
      timeSlot: '09:30 AM - 10:30 AM'
    };
  });

  const handleActivateForLearner = () => {
    const sprintPayload = {
      title: 'Parent-Targeted Holiday Weakness Sprint',
      weeks: sprintDurationWeeks,
      targetMins: dailyTargetMins,
      topics: activeSelectedTopics,
      notes: customParentNotes,
      activatedAt: new Date().toISOString(),
      studentId: 'liam',
      studentName: 'Liam Kariuki'
    };
    localStorage.setItem('somahome_active_holiday_sprint', JSON.stringify(sprintPayload));
    window.dispatchEvent(new CustomEvent('somahome_holiday_sprint_updated', { detail: sprintPayload }));
    setActivatedToLearnerToast(true);
    setTimeout(() => setActivatedToLearnerToast(false), 3500);
  };

  const generateWhatsAppPlan = () => {
    let msg = `*🏡 SomaHome Kenya: Custom Holiday Tuition Plan for Liam*\n`;
    msg += `*Duration:* ${sprintDurationWeeks} Weeks (${dailyTargetMins} mins/day)\n`;
    msg += `*Parent Focus:* ${customParentNotes}\n\n`;
    msg += `*Target Weakness Modules:*\n`;
    activeSelectedTopics.forEach((t, i) => {
      msg += ` ${i + 1}. [${t.subject}] ${t.name} (${t.duration})\n`;
    });
    msg += `\n*Generated with SomaHome Parent OS* 🚀`;
    return encodeURIComponent(msg);
  };

  const handleCopyWhatsApp = () => {
    navigator.clipboard.writeText(decodeURIComponent(generateWhatsAppPlan()));
    setSavedPlanToast(true);
    setTimeout(() => setSavedPlanToast(false), 3000);
  };

  const toggleDayCompletion = (dayId) => {
    setCompletedCustomDays(prev => ({
      ...prev,
      [dayId]: !prev[dayId]
    }));
  };

  const completedCount = Object.values(completedCustomDays).filter(Boolean).length;

  return (
    <div className="fade-in" style={{ paddingBottom: '60px' }}>
      
      {/* Top Hero Banner */}
      <div className="glass-panel" style={{
        padding: '24px',
        marginBottom: '24px',
        background: 'linear-gradient(135deg, rgba(245,158,11,0.18) 0%, rgba(16,185,129,0.2) 100%)',
        border: '1px solid rgba(245,158,11,0.3)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span className="glass-pill" style={{ background: '#F59E0B', color: '#FFF', fontWeight: 800 }}>
              🛠️ PARENT-LED HOLIDAY PLANNER
            </span>
            <span className="glass-pill" style={{ color: '#34D399', borderColor: 'rgba(52,211,153,0.3)' }}>
              Target Weakness & Boost Confidence
            </span>
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 900, margin: '0 0 6px 0', color: '#F8FAFC' }}>
            Custom Holiday Catch-Up &amp; Weakness Sprint
          </h1>
          <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '640px' }}>
            Select the exact Math, Swahili, Science, or English topics your learner needs to reinforce. SomaHome will auto-sync bonus quests directly onto Liam's learner dashboard.
          </p>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            onClick={handleActivateForLearner}
            className="btn-primary"
            style={{
              padding: '10px 20px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.88rem',
              background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
              border: 'none',
              boxShadow: '0 4px 14px rgba(16,185,129,0.4)'
            }}
          >
            <Zap size={16} />
            <span>🚀 Activate Sprint for Learner</span>
          </button>

          <button
            onClick={handleCopyWhatsApp}
            className="btn-secondary"
            style={{
              padding: '10px 18px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.86rem'
            }}
          >
            <FileText size={16} color="#38BDF8" />
            <span>Copy Plan Summary</span>
          </button>
        </div>
      </div>

      {activatedToLearnerToast && (
        <div className="glass-panel" style={{
          marginBottom: '20px',
          background: 'rgba(16,185,129,0.2)',
          border: '1px solid #10B981',
          padding: '12px 20px',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          color: '#34D399',
          fontWeight: 700,
          animation: 'fadeIn 0.3s ease'
        }}>
          <CheckCircle2 size={18} />
          <span>✓ Holiday Catch-Up Sprint activated! Bonus weakness quests are now live on Liam's Learner Questboard.</span>
        </div>
      )}

      {savedPlanToast && (
        <div className="glass-panel" style={{
          marginBottom: '20px',
          background: 'rgba(56,189,248,0.2)',
          border: '1px solid #38BDF8',
          padding: '12px 20px',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          color: '#38BDF8',
          fontWeight: 700
        }}>
          <CheckCircle2 size={18} />
          <span>✓ Holiday schedule summary copied to clipboard!</span>
        </div>
      )}

      {/* Main Configuration Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 1.2fr) minmax(400px, 2fr)', gap: '24px', alignItems: 'start' }}>
        
        {/* Left Column: Weakness Topic Selector */}
        <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800 }}>
              🎯 1. Select Target Weaknesses
            </h3>
            <span style={{ fontSize: '0.78rem', color: '#F59E0B', fontWeight: 700 }}>
              {activeSelectedTopics.length} Areas Selected
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {topicCatalog.map((cat, idx) => (
              <div key={idx} style={{ background: 'rgba(255,255,255,0.02)', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 800, color: cat.color, marginBottom: '10px' }}>
                  {cat.subject}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {cat.topics.map((top) => {
                    const isChecked = !!selectedWeaknesses[top.id];
                    return (
                      <div
                        key={top.id}
                        onClick={() => toggleWeakness(top.id)}
                        style={{
                          padding: '10px 12px',
                          borderRadius: '8px',
                          background: isChecked ? 'rgba(245, 158, 11, 0.12)' : 'rgba(0,0,0,0.2)',
                          border: isChecked ? '1px solid #F59E0B' : '1px solid var(--border-subtle)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '10px',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <div style={{
                          width: '18px',
                          height: '18px',
                          borderRadius: '4px',
                          background: isChecked ? '#F59E0B' : 'transparent',
                          border: isChecked ? 'none' : '2px solid var(--text-muted)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#000',
                          marginTop: '2px',
                          flexShrink: 0
                        }}>
                          {isChecked && <Check size={13} strokeWidth={3} />}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '0.84rem', fontWeight: 700, color: isChecked ? '#FFF' : 'var(--text-secondary)' }}>
                            {top.name}
                          </div>
                          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                            💡 {top.tip}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Generated Dynamic Schedule */}
        <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800 }}>
                📅 Generated Holiday Timetable
              </h3>
              <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {sprintDurationWeeks} Weeks · {completedCount} of {generatedSchedule.length} Modules Completed
              </p>
            </div>

            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Duration:</span>
              {[2, 3, 4].map(w => (
                <button
                  key={w}
                  onClick={() => setSprintDurationWeeks(w)}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '6px',
                    border: sprintDurationWeeks === w ? '1px solid #10B981' : '1px solid var(--border-subtle)',
                    background: sprintDurationWeeks === w ? 'rgba(16,185,129,0.2)' : 'transparent',
                    color: sprintDurationWeeks === w ? '#34D399' : 'var(--text-muted)',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  {w} Wks
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {generatedSchedule.slice(0, 10).map((day) => {
              const isDone = !!completedCustomDays[day.id];
              return (
                <div
                  key={day.id}
                  style={{
                    padding: '12px 16px',
                    borderRadius: '10px',
                    background: isDone ? 'rgba(16,185,129,0.06)' : 'rgba(255,255,255,0.02)',
                    border: isDone ? '1px solid rgba(16,185,129,0.3)' : '1px solid var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <button
                      onClick={() => toggleDayCompletion(day.id)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        color: isDone ? '#34D399' : 'var(--text-muted)',
                        padding: 0
                      }}
                    >
                      <CheckCircle size={20} />
                    </button>
                    <div>
                      <div style={{ fontSize: '0.76rem', color: day.color, fontWeight: 800, textTransform: 'uppercase' }}>
                        Week {day.weekNum} · {day.dayName} · {day.timeSlot}
                      </div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 700, color: isDone ? 'var(--text-muted)' : '#FFF', textDecoration: isDone ? 'line-through' : 'none' }}>
                        {day.topic}
                      </div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                        {day.tip}
                      </div>
                    </div>
                  </div>

                  <span style={{ fontSize: '0.72rem', background: 'rgba(255,255,255,0.05)', padding: '4px 8px', borderRadius: '6px', color: 'var(--text-secondary)' }}>
                    {day.duration}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
