import React, { useState, useEffect } from 'react';
import { 
  Flame, Award, Star, Gamepad2, CheckCircle, ArrowRight, BookOpen, 
  Sparkles, Trophy, ExternalLink, Video, Compass, CheckCircle2, 
  FileText, Send, PhoneCall, Phone, PhoneOff, MessageSquare, Clock, MapPin, ShieldCheck, Zap, Users, UserCheck
} from 'lucide-react';
import StudentShowcaseModal from '../../modules/student/StudentShowcaseModal';
import LiveClassroomModal from '../../modules/learning/LiveClassroomModal';
import SubmitHomeworkModal from '../../modules/student/SubmitHomeworkModal';
import StudentTeacherCallModal from '../../modules/learning/StudentTeacherCallModal';
import { homeworkService, bookingsService, telemetryService } from '../../services/homeworkTelemetryStore';
import { planningAuthorityStore } from '../../services/planningAuthorityStore';

export default function StudentDashboard({ onGoToReading, onGoToQuiz, onGoToChat }) {
  const [streak, setStreak] = useState(15);
  const [xp, setXp] = useState(1450);
  const [isShowcaseOpen, setIsShowcaseOpen] = useState(false);
  const [isLiveClassOpen, setIsLiveClassOpen] = useState(false);
  
  // 1-on-1 Teacher Call state
  const [isTeacherCallOpen, setIsTeacherCallOpen] = useState(false);
  const [incomingCallDismissed, setIncomingCallDismissed] = useState(false);

  // Twinkl-inspired 3-Star Differentiated Tiers & Quest Arcade PIN
  const [activeStarTier, setActiveStarTier] = useState('2_star');
  const [worksheetPin, setWorksheetPin] = useState('');
  const [unlockedArcadeQuest, setUnlockedArcadeQuest] = useState(null);
  const [isTeacherChatOpen, setIsTeacherChatOpen] = useState(false);

  // Planning authority & Pod state
  const [planningAuthority, setPlanningAuthority] = useState(() => planningAuthorityStore.getForChild('liam'));
  const [pods, setPods] = useState(() => planningAuthorityStore.getTeacherPods());

  // Active Holiday Sprint Quests from Parent
  const [activeHolidaySprint, setActiveHolidaySprint] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('somahome_active_holiday_sprint'));
    } catch (e) {
      return null;
    }
  });

  // Homework submission state
  const [homeworkList, setHomeworkList] = useState(() => homeworkService.getAll());
  const [activeHwModal, setActiveHwModal] = useState(null);

  // Booked sessions for Liam (Live Reactive)
  const [bookedSessions, setBookedSessions] = useState(() => bookingsService.getForStudent('Liam'));

  useEffect(() => {
    const handleBookingsUpdate = () => {
      setBookedSessions(bookingsService.getForStudent('Liam'));
    };
    const handlePlanningUpdate = (e) => {
      setPlanningAuthority(e.detail || planningAuthorityStore.getForChild('liam'));
    };
    const handleSprintUpdate = (e) => {
      setActiveHolidaySprint(e.detail || JSON.parse(localStorage.getItem('somahome_active_holiday_sprint')));
    };

    window.addEventListener('somahome_bookings_updated', handleBookingsUpdate);
    window.addEventListener('planning_authority_updated', handlePlanningUpdate);
    window.addEventListener('somahome_holiday_sprint_updated', handleSprintUpdate);

    return () => {
      window.removeEventListener('somahome_bookings_updated', handleBookingsUpdate);
      window.removeEventListener('planning_authority_updated', handlePlanningUpdate);
      window.removeEventListener('somahome_holiday_sprint_updated', handleSprintUpdate);
    };
  }, []);

  const upcomingSession = bookedSessions[0] || {
    tutorName: planningAuthority?.teacherName || 'Teacher Mercy Wanjiku',
    focusSubject: 'Grade 4 CBC Mathematics: Fractions & Decimals',
    timeSlot: '09:00 AM - 10:30 AM',
    date: 'Today',
    sessionType: 'virtual',
    tutorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300'
  };

  const [missions, setMissions] = useState([
    { id: 1, title: 'Math Fraction Chapati Puzzle', subject: 'Math', xp: 50, isDone: true, time: '30m' },
    { id: 2, title: 'Charcoal Water Filter Experiment', subject: 'Science', xp: 100, isDone: true, time: '45m' },
    { id: 3, title: 'Read Honeyguide Bird & Boy Story', subject: 'English', xp: 40, isDone: false, time: '20m' },
    { id: 4, title: 'Recycled Seedling Potting', subject: 'Agri', xp: 60, isDone: false, time: '25m' }
  ]);

  const [holidayMissions, setHolidayMissions] = useState([
    { id: 'h1', title: 'Equivalent Fractions: Paper Plate Folding', subject: 'Math (Weakness Focus)', xp: 80, isDone: false, time: '25m' },
    { id: 'h2', title: 'Kiswahili Sarufi: Nyakati za Vitenzi (li-, na-, ta-)', subject: 'Kiswahili (Parent Pick)', xp: 70, isDone: false, time: '20m' }
  ]);

  const toggleMission = (id, points) => {
    setMissions(prev => prev.map(m => {
      if (m.id === id) {
        const nextDone = !m.isDone;
        if (nextDone) {
          setXp(x => x + points);
          const minutes = parseInt(m.time) || 25;
          telemetryService.logActiveSession(m.title, m.subject, minutes, '⭐');
        } else {
          setXp(x => Math.max(0, x - points));
        }
        return { ...m, isDone: nextDone };
      }
      return m;
    }));
  };

  const toggleHolidayMission = (id, points) => {
    setHolidayMissions(prev => prev.map(m => {
      if (m.id === id) {
        const nextDone = !m.isDone;
        if (nextDone) {
          setXp(x => x + points);
          telemetryService.logActiveSession(`Holiday Sprint: ${m.title}`, m.subject, 25, '⚡');
        } else {
          setXp(x => Math.max(0, x - points));
        }
        return { ...m, isDone: nextDone };
      }
      return m;
    }));
  };

  const handleHomeworkSubmitted = (hwId) => {
    const allHw = homeworkService.getAll();
    setHomeworkList(allHw);
    setXp(x => x + 50);
    const hw = allHw.find(h => h.id === hwId);
    telemetryService.logActiveSession(
      `Submitted Homework: ${hw ? hw.title : hwId}`,
      hw ? hw.subject : 'Homework Desk',
      20,
      '📝'
    );
  };

  const handleOpenTeacherCall = () => {
    setIsTeacherCallOpen(true);
    if (upcomingSession) {
      telemetryService.logActiveSession(
        `1-on-1 Class with ${upcomingSession.tutorName}: ${upcomingSession.focusSubject}`,
        'Specialist Tutoring',
        30,
        '📹'
      );
    }
  };

  const handleOpenGroupLiveClass = () => {
    setIsLiveClassOpen(true);
    telemetryService.logActiveSession(
      'Live Pod Class: Syokimau CBC Pod Alpha',
      'Syokimau Pod',
      45,
      '🧪'
    );
  };

  const badges = [
    { title: 'Water Engineer', icon: '💧', desc: 'Built a 4-layer mechanical water purifier', unlocked: true },
    { title: 'Fraction Ninja', icon: '🍕', desc: 'Solved 10 fraction word puzzles', unlocked: true },
    { title: 'Safari Naturalist', icon: '🦁', desc: 'Described 5 Kenyan wildlife animals', unlocked: true },
    { title: 'Green Thumb', icon: '🌱', desc: 'Planted balcony kitchen sukuma wiki', unlocked: true },
    { title: 'Public Speaker', icon: '🎙️', desc: 'Recited original Kiswahili Shairi', unlocked: true },
    { title: 'Code Architect', icon: '💻', desc: 'Crafted geometric angles in Turtle', unlocked: false }
  ];

  const liamPod = pods?.find(p => p.memberStudentIds?.includes('liam')) || pods?.[0];

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
      
      {/* ACTIVE POD & DEDICATED TEACHER LIVE BANNER */}
      <div style={{
        marginBottom: '20px',
        background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.25) 0%, rgba(16, 185, 129, 0.25) 100%)',
        border: '1.5px solid rgba(56, 189, 248, 0.4)',
        borderRadius: '18px',
        padding: '16px 22px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '14px',
        boxShadow: '0 8px 24px rgba(37, 99, 235, 0.25)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '12px',
            background: '#2563EB',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF'
          }}>
            <Users size={22} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1rem', fontWeight: 800, color: '#F8FAFC' }}>
                🎓 {liamPod?.name || 'Syokimau CBC Pod Alpha'}
              </span>
              <span className="glass-pill" style={{ background: '#38BDF8', color: '#0F172A', fontWeight: 800, fontSize: '0.68rem' }}>
                4 POD MATES
              </span>
            </div>
            <div style={{ fontSize: '0.82rem', color: '#CBD5E1', marginTop: '2px' }}>
              Lead Educator: <strong>{planningAuthority?.teacherName || 'Teacher Mercy Wanjiku'}</strong> ({planningAuthority?.teacherTsc || 'TSC 582914'}) · {liamPod?.meetingSchedule || 'Mon-Thu 9:00 AM - 12:00 PM'}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={handleOpenGroupLiveClass}
            className="btn-primary"
            style={{
              fontSize: '0.86rem',
              padding: '9px 18px',
              background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
              border: 'none',
              fontWeight: 800,
              boxShadow: '0 4px 14px rgba(37, 99, 235, 0.4)',
              cursor: 'pointer'
            }}
          >
            <Video size={16} />
            <span>Join Pod Live Class 🚀</span>
          </button>

          <button
            onClick={() => setIsTeacherChatOpen(true)}
            className="btn-secondary"
            style={{ fontSize: '0.84rem', padding: '9px 14px' }}
          >
            <MessageSquare size={15} />
            <span>Teacher Chat</span>
          </button>
        </div>
      </div>

      {/* Gamified Kid Banner */}
      <div className="glass-panel" style={{
        padding: '26px 30px', marginBottom: '24px',
        background: 'linear-gradient(135deg, rgba(16,185,129,0.18) 0%, rgba(59,130,246,0.12) 100%)',
        border: '1.5px solid rgba(16,185,129,0.4)', position: 'relative'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '68px', height: '68px', borderRadius: '50%', background: '#00A651', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.4rem', boxShadow: '0 4px 15px rgba(0,166,81,0.4)' }}>
              👦
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h2 style={{ fontSize: '1.6rem', margin: 0 }}>Jambo Liam!</h2>
                <span className="glass-pill" style={{ background: '#F59E0B', color: '#0F172A', fontWeight: 800 }}>
                  LEVEL 5 EXPLORER
                </span>
              </div>
              <p style={{ color: 'var(--text-secondary)', margin: '4px 0 0 0', fontSize: '0.88rem' }}>
                Grade 4 CBC • Syokimau CBC Pod Alpha • Term 1, 2026
              </p>
            </div>
          </div>

          {/* Gamified Stats Counters */}
          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
            <div style={{ background: 'rgba(0,0,0,0.35)', border: '1px solid var(--border-card)', borderRadius: '12px', padding: '10px 16px', textAlign: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', color: '#EF4444', fontWeight: 800, fontSize: '1.25rem' }}>
                <Flame size={20} fill="#EF4444" /> {streak}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Day Streak 🔥</div>
            </div>

            <div style={{ background: 'rgba(0,0,0,0.35)', border: '1px solid var(--border-card)', borderRadius: '12px', padding: '10px 16px', textAlign: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', color: '#F59E0B', fontWeight: 800, fontSize: '1.25rem' }}>
                <Star size={20} fill="#F59E0B" /> {xp}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Total XP ⭐</div>
            </div>
          </div>

        </div>
      </div>

      {/* HOLIDAY SPRINT BONUS QUESTS (Injected when parent activates a sprint) */}
      {activeHolidaySprint && (
        <div className="glass-panel" style={{
          padding: '20px 24px',
          marginBottom: '24px',
          borderRadius: '16px',
          background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.12) 0%, rgba(217, 119, 6, 0.06) 100%)',
          border: '1.5px solid rgba(245, 158, 11, 0.35)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Zap size={20} color="#F59E0B" />
              <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#FBBF24' }}>
                ⚡ Active Holiday Weakness Catch-Up Quests (Parent Assigned)
              </h3>
            </div>
            <span style={{ fontSize: '0.75rem', background: '#F59E0B', color: '#000', padding: '3px 8px', borderRadius: '6px', fontWeight: 800 }}>
              +80 BONUS XP
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {holidayMissions.map((m) => (
              <div
                key={m.id}
                style={{
                  padding: '12px 16px',
                  borderRadius: '10px',
                  background: m.isDone ? 'rgba(16,185,129,0.08)' : 'rgba(0,0,0,0.3)',
                  border: m.isDone ? '1px solid #10B981' : '1px solid rgba(245, 158, 11, 0.25)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '12px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <button
                    onClick={() => toggleHolidayMission(m.id, m.xp)}
                    style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: m.isDone ? '#34D399' : 'var(--text-muted)', padding: 0 }}
                  >
                    <CheckCircle size={20} />
                  </button>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: '#FBBF24', fontWeight: 800, textTransform: 'uppercase' }}>
                      {m.subject} · {m.time}
                    </div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 700, color: m.isDone ? 'var(--text-muted)' : '#FFF', textDecoration: m.isDone ? 'line-through' : 'none' }}>
                      {m.title}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => toggleHolidayMission(m.id, m.xp)}
                  className={m.isDone ? 'glass-pill' : 'btn-primary'}
                  style={{ fontSize: '0.78rem', padding: '6px 14px', background: m.isDone ? 'transparent' : '#F59E0B', color: m.isDone ? '#34D399' : '#000', border: 'none', fontWeight: 800 }}
                >
                  {m.isDone ? `+${m.xp} XP Done ✓` : `Complete (+${m.xp} XP)`}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Quests & Trophies Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(350px, 1.5fr) minmax(300px, 1fr)', gap: '24px', alignItems: 'start' }}>
        
        {/* Daily Questline */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.2rem', margin: 0 }}>Today's Questline</h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>4 Quests</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {missions.map((m) => (
              <div 
                key={m.id} 
                style={{
                  background: m.isDone ? 'rgba(16, 185, 129, 0.05)' : 'rgba(255,255,255,0.02)',
                  border: m.isDone ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid var(--border-subtle)',
                  borderRadius: '12px', padding: '14px 16px', display: 'flex',
                  alignItems: 'center', justifyContent: 'space-between', gap: '14px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <button 
                    onClick={() => toggleMission(m.id, m.xp)}
                    style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: m.isDone ? '#10B981' : 'var(--text-muted)', padding: 0 }}
                  >
                    <CheckCircle size={20} />
                  </button>
                  <div>
                    <div style={{ fontSize: '0.92rem', fontWeight: 700, textDecoration: m.isDone ? 'line-through' : 'none', color: m.isDone ? 'var(--text-muted)' : 'var(--text-primary)' }}>
                      {m.title}
                    </div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                      {m.subject} • {m.time} • +{m.xp} XP
                    </div>
                  </div>
                </div>

                {!m.isDone ? (
                  <button
                    onClick={() => toggleMission(m.id, m.xp)}
                    className="btn-primary"
                    style={{ fontSize: '0.78rem', padding: '6px 12px' }}
                  >
                    <span>Mark Done</span>
                  </button>
                ) : (
                  <span className="glass-pill" style={{ fontSize: '0.74rem', color: '#10B981', fontWeight: 700 }}>
                    +{m.xp} XP ✓
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Teacher Homework List */}
          <div style={{ marginTop: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: '#38BDF8' }}>
                📝 Teacher-Assigned Homework
              </h4>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{homeworkList.length} Tasks</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {homeworkList.map((hw) => (
                <div
                  key={hw.id}
                  style={{
                    padding: '12px 14px',
                    borderRadius: '10px',
                    background: 'rgba(56, 189, 248, 0.05)',
                    border: '1px solid rgba(56, 189, 248, 0.25)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '10px'
                  }}
                >
                  <div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#FFF' }}>
                      {hw.title}
                    </div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                      Due: {hw.dueTime || 'Today 5:00 PM'} · {hw.subject}
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveHwModal(hw)}
                    className="btn-secondary"
                    style={{ fontSize: '0.76rem', padding: '5px 10px', borderColor: '#38BDF8', color: '#38BDF8' }}
                  >
                    <Send size={12} />
                    <span>Submit</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Trophies & Badges Showcase */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.2rem', margin: 0 }}>Trophy Showcase</h3>
            <span style={{ fontSize: '0.75rem', color: '#F59E0B', fontWeight: 700 }}>5 Unlocked</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            {badges.map((b, i) => (
              <div 
                key={i} 
                style={{
                  background: b.unlocked ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.3)', 
                  border: b.unlocked ? '1px solid var(--border-subtle)' : '1px dashed rgba(255,255,255,0.1)',
                  borderRadius: '12px', padding: '14px', textAlign: 'center',
                  opacity: b.unlocked ? 1 : 0.5
                }}
              >
                <div style={{ fontSize: '2rem', marginBottom: '6px', filter: b.unlocked ? 'none' : 'grayscale(100%)' }}>
                  {b.icon}
                </div>
                <div style={{ fontSize: '0.88rem', fontWeight: 700, color: b.unlocked ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                  {b.title}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px', lineHeight: 1.3 }}>
                  {b.desc}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 1-on-1 Student-Teacher Video Call Modal */}
      {isTeacherCallOpen && (
        <StudentTeacherCallModal
          isOpen={isTeacherCallOpen}
          onClose={() => setIsTeacherCallOpen(false)}
          tutorName={upcomingSession.tutorName}
          subject={upcomingSession.focusSubject}
          tutorAvatar={upcomingSession.tutorAvatar}
        />
      )}

      {/* Group Live Virtual Classroom Modal */}
      {isLiveClassOpen && (
        <LiveClassroomModal
          isOpen={isLiveClassOpen}
          onClose={() => setIsLiveClassOpen(false)}
          sessionTitle="Syokimau CBC Pod Alpha: Practical Science & Fractions Lab"
          teacherName={planningAuthority?.teacherName || "Teacher Mercy Wanjiku"}
        />
      )}

      {/* Submit Homework Modal */}
      {activeHwModal && (
        <SubmitHomeworkModal
          isOpen={!!activeHwModal}
          onClose={() => setActiveHwModal(null)}
          homework={activeHwModal}
          onSubmitted={handleHomeworkSubmitted}
        />
      )}

    </div>
  );
}
