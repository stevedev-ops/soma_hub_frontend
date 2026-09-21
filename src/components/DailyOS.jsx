import React, { useState, useEffect } from 'react';
import { MessageCircle, Play, Pause, RotateCcw, CheckCircle, Clock, Volume2, Sparkles, FileText, Package, MessageSquare, Star, AlertTriangle, FileCheck, Send, CheckCircle2, Award, ShieldCheck, Check, Plus, UserCheck, Bot, User, Sliders } from 'lucide-react';
import WorksheetMarkerModal from '../modules/learning/WorksheetMarkerModal';
import FlexibleScheduleModal, { getSavedScheduleConfig } from '../modules/parent/FlexibleScheduleModal';
import CustomElectiveModal from '../modules/parent/CustomElectiveModal';
import PlanningDelegationModal from '../modules/parent/PlanningDelegationModal';
import { cbaRubricStore, CBA_LEVELS } from '../services/cbaRubricStore';
import { customElectivesStore } from '../services/customElectivesStore';
import { planningAuthorityStore } from '../services/planningAuthorityStore';
import VoicePlayerPill from './VoicePlayerPill';
import { frameworkRegistry } from '../services/frameworkRegistry';

export default function DailyOS({ schedule, onOpenPrintable, onOpenLab }) {
  const [selectedDay, setSelectedDay] = useState(3);
  const [activeWeekNum, setActiveWeekNum] = useState(3);
  const [isHolidaySprint, setIsHolidaySprint] = useState(false); // Wednesday default
  const [activeLessonId, setActiveLessonId] = useState(3);
  const [completedLessons, setCompletedLessons] = useState({ 1: true });
  const [isMarkerOpen, setIsMarkerOpen] = useState(false);
  const [isScheduleConfigOpen, setIsScheduleConfigOpen] = useState(false);
  const [isElectiveModalOpen, setIsElectiveModalOpen] = useState(false);
  const [isDelegationModalOpen, setIsDelegationModalOpen] = useState(false);
  const [scheduleConfig, setScheduleConfig] = useState(getSavedScheduleConfig);
  
  // 3-Tier Planning Authority State
  const [planningAuthority, setPlanningAuthority] = useState(() => planningAuthorityStore.getForChild('liam'));

  // Custom electives state
  const [customElectives, setCustomElectives] = useState(() => customElectivesStore.getForStudentAndDay('liam', 3));

  // 25-minute timer
  const [timerSeconds, setTimerSeconds] = useState(25 * 60);
  const [timerRunning, setTimerRunning] = useState(false);

  // Household checklist
  const [checkedMaterials, setCheckedMaterials] = useState({});

  // Lesson Review & Re-evaluation state
  const [lessonRatings, setLessonRatings] = useState({ 1: 5, 2: 4 });
  const [reEvalModalOpen, setReEvalModalOpen] = useState(false);
  const [reEvalReason, setReEvalReason] = useState('');
  const [reEvalSuccess, setReEvalSuccess] = useState(false);
  const [reEvalTickets, setReEvalTickets] = useState([]);

  // Formative CBA Rubric state
  const [currentRubric, setCurrentRubric] = useState('EE');
  const [rubricRemark, setRubricRemark] = useState('');
  const [rubricSavedToast, setRubricSavedToast] = useState(false);

  useEffect(() => {
    const handleElectivesUpdate = () => {
      setCustomElectives(customElectivesStore.getForStudentAndDay('liam', selectedDay));
    };
    const handlePlanningUpdate = (e) => {
      setPlanningAuthority(e.detail || planningAuthorityStore.getForChild('liam'));
    };

    window.addEventListener('custom_electives_updated', handleElectivesUpdate);
    window.addEventListener('planning_authority_updated', handlePlanningUpdate);

    return () => {
      window.removeEventListener('custom_electives_updated', handleElectivesUpdate);
      window.removeEventListener('planning_authority_updated', handlePlanningUpdate);
    };
  }, [selectedDay]);

  useEffect(() => {
    setCustomElectives(customElectivesStore.getForStudentAndDay('liam', selectedDay));
  }, [selectedDay]);

  useEffect(() => {
    let interval = null;
    if (timerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0) {
      setTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [timerRunning, timerSeconds]);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const fallbackLessons = [
    {
      id: 1,
      subject: "Mathematics Activities",
      time_slot: "08:30 AM - 09:15 AM",
      duration_minutes: 35,
      topic: "Fractions: Halves, Quarters & Eighths",
      parent_script: "Greet your child and say: 'Today we are dividing a delicious chapati among our family members! If we have one whole round chapati and slice it straight down the middle, how many equal slices do we have? That is 1/2.'",
      learning_objective: "Learners should identify and represent proper fractions using concrete everyday objects.",
      local_materials: ["Round cardboard or paper plate", "Pair of safety scissors", "Ruler and pencil"],
      step_by_step_activity: "1. Have child fold plate in half (1/2).\n2. Fold into quarters and label each slice 1/4.\n3. Complete Worksheet #1.",
      worksheet_name: "Math_G4_W3_Fractions_Plate.pdf",
      is_lab_practical: false
    },
    {
      id: 3,
      subject: "Science & Technology (Home Lab)",
      time_slot: "09:30 AM - 10:30 AM",
      duration_minutes: 45,
      topic: "Water Purification with Local Materials",
      parent_script: "Say: 'When it rains heavily and our rivers turn brown with mud, how can communities make water clear again? Today, you are an environmental engineer! We are going to build our very own filter using things from our kitchen and compound.'",
      learning_objective: "Construct a working mechanical water filtration apparatus demonstrating how sediment and charcoal filter muddy water.",
      local_materials: [
        "1 empty plastic soda bottle (e.g. Dasani or Quencher)",
        "Charcoal pieces crushed from the jiko",
        "Clean fine sand from the compound",
        "Small clean pebbles / gravel",
        "Cotton wool or a piece of clean cotton cloth",
        "A cup of muddy/dirty water"
      ],
      step_by_step_activity: "1. Cut the bottom third off the bottle.\n2. Invert top neck-down into a glass.\n3. Layer cotton, charcoal from jiko, sand, then pebbles.\n4. Pour muddy water slowly.\n5. Take a photo and upload to portfolio!",
      worksheet_name: "Science_G4_W3_Water_Filter_Lab.pdf",
      is_lab_practical: true,
      has_photo_submission: true
    },
    {
      id: 2,
      subject: "English Language & Creative Writing",
      time_slot: "11:00 AM - 11:45 AM",
      duration_minutes: 40,
      topic: "Descriptive Writing: My Neighborhood Compound",
      parent_script: "Ask: 'Look outside our window or compound. What are three colorful things you see and hear? Let us write an imaginative 3-paragraph story about an adventurous bird that visited our balcony today.'",
      learning_objective: "Write coherent descriptive sentences utilizing sensory adjectives and proper punctuation.",
      local_materials: ["Lined notebook", "Color pencils or pens"],
      step_by_step_activity: "1. Brainstorm 5 adjectives.\n2. Write introductory sentence.\n3. Complete drafting prompt.",
      worksheet_name: "English_G4_W3_Descriptive_Writing.pdf",
      is_lab_practical: false
    }
  ];

  const rawLessons = schedule?.lessons || schedule?.days?.find((d) => d.day_of_week === selectedDay)?.lessons || schedule?.days?.[0]?.lessons || [];
  const lessonsList = (rawLessons && rawLessons.length > 0) ? rawLessons : fallbackLessons;
  const activeLesson = lessonsList.find((l) => l.id === activeLessonId) || lessonsList[0];

  
  const handleSendToWhatsApp = () => {
    const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const currentDayName = dayNames[selectedDay - 1] || 'Today';
    const materialsList = activeLesson?.local_materials?.length 
      ? activeLesson.local_materials.map(m => `• ${m}`).join('\n')
      : '• Standard household writing materials';

    const msg = `🇰🇪 *SomaHome Kenya • Homeschool Daily Guide*
📚 *${schedule?.package?.curriculum || 'CBC'} ${schedule?.package?.grade_level || 'Grade 4'}* • ${currentDayName}
🎯 *Lesson:* ${activeLesson?.subject || 'Mathematics'} - ${activeLesson?.topic || 'Daily Topic'}
⏱️ *Time Slot:* ${activeLesson?.time_slot || '08:30 AM'} (${activeLesson?.duration_minutes || 35} mins)

🗣️ *Parent Verbatim Script (Read Aloud):*
"${activeLesson?.parent_script || 'Read through the worksheet together.'}"

🧺 *Everyday Household Materials:*
${materialsList}

🎯 *Step-by-Step Practical Activity:*
${activeLesson?.step_by_step_activity || 'Complete daily exercises.'}

📄 *Download Week Printable Pack (PDF):*
https://somahome.ke/worksheets/printable_pack.pdf`;

    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const handleRating = (rating) => {
    setLessonRatings((prev) => ({ ...prev, [activeLesson?.id]: rating }));
    if (rating <= 3) {
      setReEvalModalOpen(true);
    }
  };

  const handleSelectCbaLevel = (levelCode) => {
    setCurrentRubric(levelCode);
    const sub = activeLesson?.subject || 'Mathematics';
    cbaRubricStore.saveEvaluation('liam', sub, levelCode, rubricRemark);
    setRubricSavedToast(true);
    setTimeout(() => setRubricSavedToast(false), 2000);
  };

  const handleSaveRemark = (e) => {
    e.preventDefault();
    const sub = activeLesson?.subject || 'Mathematics';
    cbaRubricStore.saveEvaluation('liam', sub, currentRubric, rubricRemark);
    setRubricSavedToast(true);
    setTimeout(() => setRubricSavedToast(false), 2000);
  };

  const handleSubmitReEval = (e) => {
    e.preventDefault();
    const ticket = {
      id: Date.now(),
      lessonTitle: activeLesson?.topic || 'Daily Lesson',
      subject: activeLesson?.subject || 'Subject',
      rating: lessonRatings[activeLesson?.id] || 3,
      reason: reEvalReason,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'Escalated to Lead Educator'
    };
    setReEvalTickets((prev) => [ticket, ...prev]);
    setReEvalSuccess(true);
    setTimeout(() => {
      setReEvalSuccess(false);
      setReEvalModalOpen(false);
      setReEvalReason('');
    }, 1600);
  };

  // Fallback safe: activeLesson is always guaranteed by fallbackLessons

  const authorityMode = planningAuthority?.authorityMode || 'teacher';

  return (
    <div>
      {/* 3-Tier Planning Authority Control Bar */}
      <div className="glass-panel" style={{
        padding: '14px 20px',
        marginBottom: '16px',
        borderRadius: '14px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px',
        background: authorityMode === 'teacher' 
          ? 'linear-gradient(135deg, rgba(37,99,235,0.15) 0%, rgba(14,165,233,0.08) 100%)' 
          : authorityMode === 'parent'
            ? 'linear-gradient(135deg, rgba(245,158,11,0.15) 0%, rgba(217,119,6,0.08) 100%)'
            : 'linear-gradient(135deg, rgba(16,185,129,0.15) 0%, rgba(5,150,105,0.08) 100%)',
        border: authorityMode === 'teacher'
          ? '1px solid rgba(56,189,248,0.35)'
          : authorityMode === 'parent'
            ? '1px solid rgba(251,191,36,0.35)'
            : '1px solid rgba(52,211,153,0.35)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            background: authorityMode === 'teacher' ? '#2563EB' : authorityMode === 'parent' ? '#D97706' : '#059669',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF'
          }}>
            {authorityMode === 'teacher' && <UserCheck size={20} />}
            {authorityMode === 'parent' && <User size={20} />}
            {authorityMode === 'system' && <Bot size={20} />}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.74rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: authorityMode === 'teacher' ? '#38BDF8' : authorityMode === 'parent' ? '#FBBF24' : '#34D399' }}>
                Planning Authority: {authorityMode.toUpperCase()}
              </span>
              <span style={{ fontSize: '0.72rem', background: 'rgba(255,255,255,0.1)', padding: '2px 6px', borderRadius: '4px', color: '#CBD5E1' }}>
                Active Plan Driver
              </span>
            </div>
            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#FFFFFF' }}>
              {authorityMode === 'teacher' && `Delegated to ${planningAuthority.teacherName || 'Teacher Mercy Wanjiku'} (${planningAuthority.teacherTsc || 'TSC 582914'})`}
              {authorityMode === 'parent' && 'Parent-Led Custom Schedule & Weakness Target Plan'}
              {authorityMode === 'system' && 'KICD Standard Auto-Pilot Syllabus (12-Week Term)'}
            </div>
          </div>
        </div>

        <button
          onClick={() => setIsDelegationModalOpen(true)}
          className="btn-secondary"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.82rem',
            padding: '7px 14px',
            background: 'rgba(255,255,255,0.08)',
            borderColor: 'rgba(255,255,255,0.2)'
          }}
        >
          <Sliders size={14} />
          <span>Switch Planning Authority</span>
        </button>
      </div>

      {/* Top Banner: Day / Week Status */}
      <div className="glass-panel" style={{ padding: '20px 28px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px', flexWrap: 'wrap' }}>
            <span className="glass-pill badge-cbc">
              {schedule?.package?.curriculum || 'CBC'} · {schedule?.package?.grade_level || 'Grade 4'}
            </span>
            
            {/* Week 1..12 Dropdown Selector (Consolidating TermWeeksNavigator) */}
            <select
              className="custom-select"
              value={activeWeekNum}
              onChange={(e) => setActiveWeekNum(Number(e.target.value))}
              style={{ fontSize: '0.78rem', padding: '3px 8px', background: 'rgba(0,0,0,0.3)', color: '#34D399', border: '1px solid rgba(0,166,81,0.4)', borderRadius: '8px' }}
            >
              {[1,2,3,4,5,6,7,8,9,10,11,12].map(w => (
                <option key={w} value={w}>Week {w} of 12</option>
              ))}
            </select>

            {/* Holiday Catch-up Sprint Toggle (Consolidating HolidayTuitionSprint) */}
            <button
              onClick={() => setIsHolidaySprint(!isHolidaySprint)}
              style={{
                fontSize: '0.72rem', padding: '3px 8px', borderRadius: '8px', cursor: 'pointer',
                background: isHolidaySprint ? 'rgba(245,158,11,0.2)' : 'rgba(255,255,255,0.04)',
                color: isHolidaySprint ? '#F59E0B' : 'var(--text-muted)',
                border: isHolidaySprint ? '1px solid #F59E0B' : '1px solid var(--border-subtle)',
                fontWeight: 700
              }}
              title="Toggle Accelerated Catch-up / Holiday Bootcamp Pace"
            >
              ⚡ {isHolidaySprint ? 'Holiday Sprint Pace Active' : 'Regular 3h Pace'}
            </button>
          </div>
          <h2 style={{ margin: 0, fontSize: '1.45rem', fontWeight: 800 }}>
            {schedule?.week?.theme_title || 'Numbers & Living Things'}
          </h2>
        </div>

        {/* Days of Week Tab Buttons */}
        <div style={{ display: 'flex', gap: '8px', background: 'rgba(0,0,0,0.25)', padding: '4px', borderRadius: '12px' }}>
          {[
            { day: 1, label: 'Mon' },
            { day: 2, label: 'Tue' },
            { day: 3, label: 'Wed' },
            { day: 4, label: 'Thu' },
            { day: 5, label: 'Fri' }
          ].map((d) => (
            <button
              key={d.day}
              onClick={() => {
                setSelectedDay(d.day);
                setActiveLessonId(d.day);
              }}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: 'none',
                background: selectedDay === d.day ? 'var(--primary-color)' : 'transparent',
                color: selectedDay === d.day ? '#FFFFFF' : 'var(--text-muted)',
                fontWeight: selectedDay === d.day ? 800 : 600,
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 1fr) minmax(500px, 2fr)', gap: '24px', alignItems: 'start' }}>
        
        {/* Left Column: Lessons & Timer */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Focus Timer Widget */}
          <div className="glass-panel" style={{ padding: '20px', borderRadius: '16px', textAlign: 'center' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
              Pomodoro Focus Timer (25m Sprints)
            </div>
            <div style={{ fontSize: '2.4rem', fontWeight: 900, color: '#34D399', letterSpacing: '-0.02em', marginBottom: '12px' }}>
              {formatTime(timerSeconds)}
            </div>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button
                onClick={() => setTimerRunning(!timerRunning)}
                className="btn-primary"
                style={{ padding: '8px 18px', fontSize: '0.85rem' }}
              >
                {timerRunning ? <Pause size={15} /> : <Play size={15} />}
                <span>{timerRunning ? 'Pause Sprint' : 'Start Sprint'}</span>
              </button>
              <button
                onClick={() => {
                  setTimerRunning(false);
                  setTimerSeconds(25 * 60);
                }}
                className="btn-secondary"
                style={{ padding: '8px 12px' }}
                title="Reset Timer"
              >
                <RotateCcw size={15} />
              </button>
            </div>
          </div>

          {/* Daily Lesson Slots List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Today's Core Lessons
              </div>
              <button
                onClick={() => setIsElectiveModalOpen(true)}
                className="btn-secondary"
                style={{ fontSize: '0.74rem', padding: '3px 8px', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                <Plus size={12} /> Add Elective
              </button>
            </div>

            {lessonsList.map((l) => {
              const isSelected = activeLesson.id === l.id;
              const isDone = !!completedLessons[l.id];

              return (
                <div
                  key={l.id}
                  onClick={() => setActiveLessonId(l.id)}
                  className="glass-card"
                  style={{
                    padding: '14px 16px',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    borderColor: isSelected ? 'var(--primary-color)' : 'var(--border-subtle)',
                    background: isSelected ? 'rgba(0, 166, 81, 0.12)' : 'rgba(255,255,255,0.02)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setCompletedLessons((prev) => ({ ...prev, [l.id]: !prev[l.id] }));
                      }}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        padding: 0,
                        color: isDone ? '#34D399' : 'var(--text-muted)'
                      }}
                    >
                      <CheckCircle size={20} />
                    </button>
                    <div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700 }}>
                        {l.time_slot} · {l.subject}
                      </div>
                      <div style={{ fontSize: '0.92rem', fontWeight: 700, color: isDone ? 'var(--text-muted)' : '#FFFFFF', textDecoration: isDone ? 'line-through' : 'none' }}>
                        {l.topic}
                      </div>
                    </div>
                  </div>

                  {l.is_lab_practical && (
                    <span style={{ fontSize: '0.7rem', background: 'rgba(245, 158, 11, 0.2)', color: '#FBBF24', padding: '3px 8px', borderRadius: '6px', fontWeight: 700 }}>
                      🧪 Lab
                    </span>
                  )}
                </div>
              );
            })}

            {/* Custom Electives for the Day */}
            {customElectives.map((elec) => (
              <div
                key={elec.id}
                className="glass-card"
                style={{
                  padding: '12px 16px',
                  borderRadius: '12px',
                  borderLeft: `4px solid ${elec.color || '#F59E0B'}`,
                  background: 'rgba(245, 158, 11, 0.04)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#FBBF24', fontWeight: 800, textTransform: 'uppercase' }}>
                    {elec.icon} Custom Elective · {elec.timeSlot}
                  </div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#FFFFFF' }}>
                    {elec.title}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    {elec.notes}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Detailed Lesson Plan & CBA Marking */}
        <div className="glass-panel" style={{ padding: '28px', borderRadius: '18px' }}>
          
          {/* Header of Active Lesson */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px', flexWrap: 'wrap', gap: '14px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <span className="glass-pill" style={{ background: 'rgba(56, 189, 248, 0.2)', color: '#38BDF8', fontWeight: 800, fontSize: '0.75rem' }}>
                  {activeLesson.subject}
                </span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Clock size={13} /> {activeLesson.duration_minutes || 30} mins
                </span>
              </div>
              <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 900, color: '#FFFFFF' }}>
                {activeLesson.topic}
              </h1>
            </div>

            {/* Voice Narration Pill */}
            <VoicePlayerPill
              text={`Today's lesson for ${activeLesson.subject} is on ${activeLesson.topic}. Objectives: ${activeLesson.learning_objectives?.join('. ')}. Step 1: ${activeLesson.parent_step_by_step?.[0] || 'Begin with introductory review'}`}
              label="Audio Guide"
            />
          </div>

          {/* Learning Objectives Box */}
          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '12px', borderLeft: '4px solid var(--primary-color)', marginBottom: '20px' }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#34D399', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '8px' }}>
              🎯 Specific Learning Outcomes (CBC)
            </div>
            <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '0.86rem', color: '#E2E8F0', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {activeLesson.learning_objectives?.map((obj, i) => (
                <li key={i}>{obj}</li>
              )) || <li>Understand core fundamental concepts and demonstrate mastery through hands-on practice.</li>}
            </ul>
          </div>

          {/* Step-by-Step Teaching Script */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>📖 Step-by-Step Parent / Facilitator Script</span>
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {activeLesson.parent_step_by_step?.map((step, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    gap: '12px',
                    padding: '12px 14px',
                    background: 'rgba(255,255,255,0.02)',
                    borderRadius: '10px',
                    border: '1px solid var(--border-subtle)'
                  }}
                >
                  <div style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: 'var(--primary-color)',
                    color: '#FFFFFF',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    {idx + 1}
                  </div>
                  <div style={{ fontSize: '0.86rem', color: '#CBD5E1', lineHeight: '1.45' }}>
                    {step}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CBA Formative Rubric Evaluation Desk */}
          <div style={{ background: 'rgba(0, 166, 81, 0.05)', border: '1px solid rgba(0, 166, 81, 0.25)', borderRadius: '16px', padding: '20px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Award size={18} color="#34D399" />
                <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  KNEC CBA Formative Evaluation (Level 1–4)
                </span>
              </div>
              {rubricSavedToast && (
                <span style={{ fontSize: '0.74rem', background: 'rgba(0,166,81,0.2)', color: '#34D399', padding: '3px 8px', borderRadius: '6px', fontWeight: 700 }}>
                  ✓ Evaluation Synced to Official Transcript!
                </span>
              )}
            </div>

            <p style={{ margin: '0 0 14px 0', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Evaluate your learner's practical mastery for <strong>{activeLesson.subject}</strong> today. Ratings update the statutory report card in real-time.
            </p>

            {/* 4-Tier Rubric Level Buttons */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '10px', marginBottom: '16px' }}>
              {Object.keys(CBA_LEVELS).map((key) => {
                const lvl = CBA_LEVELS[key];
                const isSelected = currentRubric === key;

                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handleSelectCbaLevel(key)}
                    style={{
                      padding: '10px 12px',
                      borderRadius: '12px',
                      border: isSelected ? `2px solid ${lvl.borderColor}` : '1px solid var(--border-subtle)',
                      background: isSelected ? lvl.bgColor : 'rgba(255,255,255,0.02)',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 900, color: lvl.color }}>
                        {lvl.code}
                      </span>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                        Level {lvl.level}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.74rem', fontWeight: 700, color: isSelected ? '#FFFFFF' : '#CBD5E1', lineHeight: 1.2 }}>
                      {lvl.label}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Active Level Description Tooltip */}
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px 14px', borderRadius: '10px', fontSize: '0.8rem', color: '#94A3B8', borderLeft: `3px solid ${CBA_LEVELS[currentRubric]?.borderColor || '#00A651'}`, marginBottom: '12px' }}>
              <strong>Standard:</strong> {CBA_LEVELS[currentRubric]?.description}
            </div>

            {/* Teacher / Parent Remark Field */}
            <form onSubmit={handleSaveRemark} style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                value={rubricRemark}
                onChange={(e) => setRubricRemark(e.target.value)}
                placeholder="Add optional evaluator note (e.g. Mastered fractions with paper plates)"
                className="custom-select"
                style={{ flex: 1, fontSize: '0.82rem', padding: '6px 12px' }}
              />
              <button
                type="submit"
                className="btn-secondary"
                style={{ padding: '6px 12px', fontSize: '0.8rem' }}
              >
                Save Remark
              </button>
            </form>
          </div>

          {/* Action Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button
                onClick={onOpenPrintable}
                className="btn-secondary"
                style={{ fontSize: '0.84rem' }}
              >
                <FileText size={15} color="#38BDF8" />
                <span>Download Worksheet Pack PDF</span>
              </button>
              <button
                onClick={handleSendToWhatsApp}
                className="btn-secondary"
                style={{ fontSize: '0.84rem', color: '#25D366', borderColor: 'rgba(37, 211, 102, 0.4)', gap: '6px' }}
                title="Send formatted lesson guide and reading script to your WhatsApp"
              >
                <MessageCircle size={15} color="#25D366" />
                <span>Send to WhatsApp</span>
              </button>


              <button
                onClick={() => setIsMarkerOpen(true)}
                className="btn-primary"
                style={{ fontSize: '0.84rem', background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)', border: 'none' }}
              >
                <FileCheck size={15} />
                <span>Auto-Mark Worksheet 📝</span>
              </button>

              {activeLesson.is_lab_practical && (
                <button
                  onClick={onOpenLab}
                  className="btn-secondary"
                  style={{ fontSize: '0.84rem', color: '#FBBF24', borderColor: 'rgba(245, 158, 11, 0.4)' }}
                >
                  <Sparkles size={15} />
                  <span>Open Science Lab 🧪</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Planning Authority Delegation Modal */}
      <PlanningDelegationModal
        isOpen={isDelegationModalOpen}
        onClose={() => setIsDelegationModalOpen(false)}
        studentId="liam"
        studentName="Liam Kariuki"
        onAuthorityChanged={(newAuth) => setPlanningAuthority(newAuth)}
      />

      {/* Custom Elective Modal */}
      <CustomElectiveModal
        isOpen={isElectiveModalOpen}
        onClose={() => setIsElectiveModalOpen(false)}
        activeStudent="liam"
        onElectiveAdded={() => setCustomElectives(customElectivesStore.getForStudentAndDay('liam', selectedDay))}
      />

      {/* Re-Evaluation Escalation Modal */}
      {reEvalModalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px'
        }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '480px', padding: '24px', borderRadius: '18px' }}>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '1.2rem', fontWeight: 800 }}>Lesson Support / Re-Teaching Request</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
              Tell our lead educators what went wrong so we can customize alternative learning materials.
            </p>

            {reEvalSuccess ? (
              <div style={{ textAlign: 'center', padding: '20px 0', color: '#34D399', fontWeight: 700 }}>
                ✓ Support Ticket Logged! A tutor review note has been scheduled.
              </div>
            ) : (
              <form onSubmit={handleSubmitReEval}>
                <textarea
                  value={reEvalReason}
                  onChange={(e) => setReEvalReason(e.target.value)}
                  placeholder="e.g. Learner struggled with fraction divisions or found instructions unclear..."
                  rows={4}
                  className="custom-select"
                  style={{ width: '100%', marginBottom: '16px', padding: '10px' }}
                  required
                />
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                  <button type="button" onClick={() => setReEvalModalOpen(false)} className="btn-secondary">
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    <Send size={15} />
                    <span>Submit to Educator</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Auto-Marker Modal */}
      <WorksheetMarkerModal
        isOpen={isMarkerOpen}
        onClose={() => setIsMarkerOpen(false)}
        worksheetName={activeLesson.worksheet_name}
        subject={activeLesson.subject}
      />
    </div>
  );
}
