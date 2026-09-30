import { useAuth } from '../../context/AuthContext';
import React, { useState, useEffect } from 'react';
import StudentTeacherCallModal from '../../modules/learning/StudentTeacherCallModal';
import { 
  Award, CheckCircle, Smartphone, Calendar, Clock, Star, 
  MessageSquare, ShieldCheck, Plus, Video, Send, CheckCircle2, 
  FileText, AlertCircle, X, Sparkles, Users, UserCheck, Layers, 
  ChevronRight, Check, Trash2, Edit3, Share2, Play, DollarSign, Globe, ToggleLeft, ToggleRight, MapPin
} from 'lucide-react';
import { homeworkService, bookingsService } from '../../services/homeworkTelemetryStore';
import { planningAuthorityStore } from '../../services/planningAuthorityStore';
import { cbaRubricStore } from '../../services/cbaRubricStore';

export default function TutorDashboard({ onNavigateToCreator }) {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('schedule_manager');
  const [bookedSessions, setBookedSessions] = useState(() => bookingsService.getForTeacher(currentUser?.name || '', currentUser?.id));

  useEffect(() => {
    const handleUpdate = () => {
      setBookedSessions(bookingsService.getForTeacher(currentUser?.name || '', currentUser?.id));
    };
    window.addEventListener('somahome_bookings_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('somahome_bookings_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, [currentUser?.name, currentUser?.id]); // 'schedule_manager' | 'pods' | 'marking' | 'schedule_live' | 'students' | 'earnings'
  
  // Teacher Pods & Students State
  const [assignedStudents, setAssignedStudents] = useState(() => planningAuthorityStore.getTeacherStudents('mercy'));
  const [podGroups, setPodGroups] = useState(() => planningAuthorityStore.getTeacherPods('mercy'));
  const [selectedPodId, setSelectedPodId] = useState('pod_alpha');

  // New Pod Creation Modal State
  const [isNewPodModalOpen, setIsNewPodModalOpen] = useState(false);
  const [newPodForm, setNewPodForm] = useState({
    name: '',
    estate: 'Kilimani, Nairobi',
    curriculum: 'CBC',
    grade: 'Grade 4 CBC',
    meetingSchedule: 'Mon, Wed, Fri (09:00 AM - 12:30 PM)',
    monthlyShareKes: 4500,
    maxChildren: 6,
    focusAreas: ['Hands-on STEM Labs', 'Mental Math Challenges']
  });

  // Teacher Weekly Schedule Slots State
  const [scheduleSlots, setScheduleSlots] = useState(() => planningAuthorityStore.getTeacherWeeklySlots('mercy'));
  const [selectedDayFilter, setSelectedDayFilter] = useState('All');
  const [isAddSlotModalOpen, setIsAddSlotModalOpen] = useState(false);
  const [isPublishedToMarketplace, setIsPublishedToMarketplace] = useState(true);

  // New Slot Form State
  const [newSlotForm, setNewSlotForm] = useState({
    day: 'Monday',
    startTime: '09:00 AM',
    endTime: '11:00 AM',
    title: 'CBC Science & Kitchen Practical Lab',
    type: 'pod',
    targetGroup: 'Syokimau CBC Pod Alpha',
    maxLearners: 6,
    hourlyRateKes: 1500,
    status: 'Available',
    location: 'Physical Pod & Virtual Stream',
    liveLink: 'https://meet.jit.si/somahome-syokimau-alpha-pod'
  });

  // Homework & Marking State
  const [homeworkList, setHomeworkList] = useState(() => homeworkService.getAll());
  const [selectedHwToMark, setSelectedHwToMark] = useState(() => {
    const list = homeworkService.getAll();
    return list.find(h => h.status === 'submitted') || list[0];
  });
  const [scoreGrade, setScoreGrade] = useState('95%');
  const [rubricLevel, setRubricLevel] = useState('EE');
  const [feedback, setFeedback] = useState('Superb problem solving Liam! Your explanation of compound rectangular perimeters was mathematically rigorous.');
  const [markSuccess, setMarkSuccess] = useState(false);

  // M-Pesa B2C Withdrawal State
  const [balanceKes, setBalanceKes] = useState(48500);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [withdrawPhone, setWithdrawPhone] = useState('0790821091');
  const [withdrawAmount, setWithdrawAmount] = useState('48500');
  const [withdrawLoading, setWithdrawLoading] = useState(false);
  const [withdrawReceipt, setWithdrawReceipt] = useState(null);

  // Live Class Scheduling Modal State
  const [liveLessonForm, setLiveLessonForm] = useState({
    targetPodId: 'pod_alpha',
    subject: 'Grade 4 CBC Mathematics',
    title: 'Fractions & Real-World Division Deep Dive',
    date: 'Tomorrow (Wednesday)',
    time: '09:00 AM - 10:30 AM',
    meetingLink: 'https://meet.jit.si/somahome-syokimau-alpha-pod',
    materialsNeeded: 'Paper plates, scissors, ruler'
  });
  const [scheduleSuccess, setScheduleSuccess] = useState(false);

  // Active call modal
  const [activeCallLearner, setActiveCallLearner] = useState(null);

  useEffect(() => {
    const handleScheduleUpdate = () => {
      setScheduleSlots(planningAuthorityStore.getTeacherWeeklySlots('mercy'));
      setPodGroups(planningAuthorityStore.getTeacherPods('mercy'));
    };
    window.addEventListener('teacher_schedule_updated', handleScheduleUpdate);
    window.addEventListener('teacher_pods_updated', handleScheduleUpdate);
    return () => {
      window.removeEventListener('teacher_schedule_updated', handleScheduleUpdate);
      window.removeEventListener('teacher_pods_updated', handleScheduleUpdate);
    };
  }, []);

  const handleCreatePodSubmit = (e) => {
    e.preventDefault();
    if (!newPodForm.name) return;
    planningAuthorityStore.createTeacherPod({
      ...newPodForm,
      hostTeacher: 'Teacher Mercy Wanjiku (TSC Reg No. 582914)'
    });
    setPodGroups(planningAuthorityStore.getTeacherPods('mercy'));
    setIsNewPodModalOpen(false);
  };

  const handleAddSlotSubmit = (e) => {
    e.preventDefault();
    planningAuthorityStore.addTeacherWeeklySlot(newSlotForm);
    setIsAddSlotModalOpen(false);
  };

  const handleDeleteSlot = (slotId) => {
    if (window.confirm('Remove this teaching schedule slot?')) {
      planningAuthorityStore.deleteTeacherWeeklySlot(slotId);
    }
  };

  const handleToggleSlotStatus = (slot) => {
    const nextStatus = slot.status === 'Available' ? 'Confirmed' : 'Available';
    planningAuthorityStore.updateTeacherWeeklySlot(slot.id, { status: nextStatus });
  };

  const handleMarkSubmission = (e) => {
    e.preventDefault();
    if (!selectedHwToMark) return;

    homeworkService.mark(selectedHwToMark.id, scoreGrade, `Level 4 - ${rubricLevel}`, feedback);
    cbaRubricStore.gradeAssessment(selectedHwToMark.id, rubricLevel, feedback);
    setHomeworkList(homeworkService.getAll());
    setMarkSuccess(true);
    setTimeout(() => setMarkSuccess(false), 3000);
  };

  const handleScheduleLiveLesson = (e) => {
    e.preventDefault();
    planningAuthorityStore.scheduleTeacherLesson(liveLessonForm.targetPodId, {
      title: liveLessonForm.title,
      subject: liveLessonForm.subject,
      timeSlot: `${liveLessonForm.date} • ${liveLessonForm.time}`,
      liveLink: liveLessonForm.meetingLink,
      materials: liveLessonForm.materialsNeeded
    });

    // Create reactive live session booking for student & parent
    const targetStudentName = liveLessonForm.targetPodId === 'student_mike' ? 'Mike Kariuki' : 'Learner';
    const targetStudentId = liveLessonForm.targetPodId === 'student_mike' ? 'mike' : null;
    const newBooking = {
      id: 'BKG-TR-' + Math.floor(1000 + Math.random() * 9000),
      tutorId: currentUser?.id || 'mercy',
      tutorName: currentUser?.name || 'Teacher Mercy Wanjiku',
      tutorAvatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200',
      studentName: targetStudentName,
      studentId: targetStudentId,
      date: liveLessonForm.date || 'Today',
      timeSlot: liveLessonForm.time || '09:00 AM - 10:30 AM',
      sessionType: 'virtual',
      estateAddress: currentUser?.estate || 'Kilimani, Nairobi',
      focusSubject: `${liveLessonForm.subject}: ${liveLessonForm.title}`,
      parentNotes: `Teacher Note: ${liveLessonForm.materialsNeeded || 'Live virtual classroom with interactive whiteboard'}`,
      amount: 0,
      receipt: 'TR-LIVE-' + Math.floor(100000 + Math.random() * 900000),
      status: 'Confirmed',
      isLiveNow: true,
      createdAt: new Date().toISOString()
    };
    bookingsService.addBooking(newBooking);

    setScheduleSuccess(true);
    setTimeout(() => setScheduleSuccess(false), 3000);
  };

  const handleDeleteBooking = (bookingId) => {
    bookingsService.deleteBooking(bookingId);
    setBookedSessions(bookingsService.getForTeacher(currentUser?.name || '', currentUser?.id));
  };

  const handleWithdrawMpesa = (e) => {
    e.preventDefault();
    setWithdrawLoading(true);
    setTimeout(() => {
      setWithdrawLoading(false);
      const receipt = `B2C${Math.floor(100000000 + Math.random() * 900000000)}`;
      setWithdrawReceipt(receipt);
      setBalanceKes(0);
    }, 1800);
  };

  const filteredSlots = selectedDayFilter === 'All' 
    ? scheduleSlots 
    : scheduleSlots.filter(s => s.day === selectedDayFilter);

  const daysOfWeek = ['All', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', paddingBottom: '60px' }}>
      
      {/* Top Educator Header */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(0, 166, 81, 0.15) 0%, rgba(15, 23, 42, 0.95) 100%)',
        border: '1px solid rgba(0, 166, 81, 0.3)', borderRadius: '24px', padding: '26px', marginBottom: '24px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
          <img
            src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200"
            alt="Teacher Mercy"
            style={{ width: '70px', height: '70px', borderRadius: '20px', objectFit: 'cover', border: '2px solid #00A651' }}
          />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h1 style={{ fontSize: '1.45rem', fontWeight: 900, margin: 0, color: '#FFFFFF' }}>
                Teacher Mercy Wanjiku
              </h1>
              <span style={{ background: 'rgba(0,166,81,0.2)', color: '#34D399', fontSize: '0.72rem', fontWeight: 800, padding: '2px 8px', borderRadius: '12px' }}>
                TSC Accredited • Lead CBC Mentor
              </span>
            </div>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
              Facilitator Operations • Create estate pods, manage teaching schedules, CBA rubrics & parent consultations
            </p>
          </div>
        </div>

        {/* Dual Role Link to Creator Studio */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.04)', border: '1px solid var(--border-card)',
          borderRadius: '16px', padding: '12px 18px', display: 'flex', alignItems: 'center', gap: '14px'
        }}>
          <div>
            <div style={{ fontSize: '0.72rem', color: '#F59E0B', fontWeight: 800, textTransform: 'uppercase' }}>
              🎨 Creator Studio Hub:
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Publish routines to TikTok / IG
            </div>
          </div>

          <button
            onClick={onNavigateToCreator}
            className="btn-secondary"
            style={{ fontSize: '0.8rem', padding: '8px 14px', gap: '6px', color: '#F59E0B', borderColor: 'rgba(245, 158, 11, 0.4)' }}
          >
            <Sparkles size={14} />
            <span>Open Creator Hub</span>
          </button>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      {/* Mobile Dropdown View */}
      <div className="mobile-nav-select" style={{ marginBottom: '18px' }}>
        <label style={{ display: 'block', fontSize: '0.74rem', color: '#34D399', fontWeight: 800, textTransform: 'uppercase', marginBottom: '6px' }}>
          Select Tutor Section:
        </label>
        <select
          value={activeTab}
          onChange={(e) => setActiveTab(e.target.value)}
          className="custom-select"
          style={{
            width: '100%',
            padding: '12px 16px',
            fontSize: '0.88rem',
            fontWeight: 700,
            background: '#0E1726',
            border: '1.5px solid #00A651',
            borderRadius: '14px',
            color: '#F8FAFC',
            boxShadow: '0 4px 14px rgba(0, 166, 81, 0.2)'
          }}
        >
          {[
            { id: 'schedule_manager', label: `📅 Weekly Schedule & Availability (${scheduleSlots.length} Slots)` },
            { id: 'pods', label: `🏘️ My Estate Pods (${podGroups.length})` },
            { id: 'marking', label: `📝 CBA Marking & Rubrics (${homeworkList.filter(h => h.status === 'submitted').length} Pending)` },
            { id: 'schedule_live', label: '🎥 Host Live Class' },
            { id: 'students', label: `👤 All Students (${assignedStudents.length})` },
            { id: 'earnings', label: `💰 Wallet & Payout (KES ${balanceKes.toLocaleString()})` }
          ].map(tab => (
            <option key={tab.id} value={tab.id}>{tab.label}</option>
          ))}
        </select>
      </div>

      {/* Desktop Pills View */}
      <div className="desktop-nav-pills glass-panel" style={{ padding: '10px 14px', marginBottom: '24px', gap: '8px', flexWrap: 'wrap' }}>
        {[
          { id: 'schedule_manager', label: `📅 Weekly Schedule & Availability (${scheduleSlots.length} Slots)` },
          { id: 'pods', label: `🏘️ My Estate Pods (${podGroups.length})` },
          { id: 'marking', label: `📝 CBA Marking & Rubrics (${homeworkList.filter(h => h.status === 'submitted').length} Pending)` },
          { id: 'schedule_live', label: '🎥 Host Live Class' },
          { id: 'students', label: `👤 All Students (${assignedStudents.length})` },
          { id: 'earnings', label: `💰 Wallet & Payout (KES ${balanceKes.toLocaleString()})` }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '10px 18px', borderRadius: '12px', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer',
              background: activeTab === tab.id ? '#00A651' : 'rgba(255,255,255,0.03)',
              color: activeTab === tab.id ? '#FFFFFF' : 'var(--text-secondary)',
              border: activeTab === tab.id ? '1px solid #00A651' : '1px solid var(--border-subtle)',
              whiteSpace: 'nowrap', transition: 'all 0.15s ease'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ================= SECTION 1: TEACHER WEEKLY SCHEDULE & AVAILABILITY ================= */}
      {activeTab === 'schedule_manager' && (
        <div>
          <div className="glass-panel" style={{ padding: '22px', borderRadius: '20px', marginBottom: '22px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
              <div>
                <div style={{ fontSize: '0.72rem', color: '#34D399', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>
                  Weekly Availability Planner
                </div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 900, margin: 0, color: '#FFFFFF' }}>
                  Manage Your Teaching Slots & Open Booking Windows
                </h2>
                <p style={{ margin: '4px 0 0 0', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                  Set your recurring availability for estate pods, 1-on-1 private tuition, and open parent diagnostic sessions.
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <button
                  onClick={() => setIsPublishedToMarketplace(!isPublishedToMarketplace)}
                  className="btn-secondary"
                  style={{
                    fontSize: '0.8rem', padding: '8px 14px', gap: '8px',
                    borderColor: isPublishedToMarketplace ? 'rgba(0,166,81,0.5)' : 'var(--border-card)',
                    color: isPublishedToMarketplace ? '#34D399' : 'var(--text-muted)'
                  }}
                >
                  <Globe size={15} color={isPublishedToMarketplace ? '#34D399' : '#94A3B8'} />
                  <span>{isPublishedToMarketplace ? '● Live on Parent Directory' : '○ Offline'}</span>
                </button>

                <button
                  onClick={() => setIsAddSlotModalOpen(true)}
                  className="btn-primary"
                  style={{ fontSize: '0.82rem', padding: '9px 18px', gap: '6px' }}
                >
                  <Plus size={16} />
                  <span>Add Time Slot</span>
                </button>
              </div>
            </div>

            {/* Day Filter Tabs */}
            {/* Mobile Day Selector Dropdown */}
            <div className="mobile-nav-select" style={{ marginTop: '14px' }}>
              <label style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, marginBottom: '4px' }}>
                Filter By Day:
              </label>
              <select
                value={selectedDayFilter}
                onChange={(e) => setSelectedDayFilter(e.target.value)}
                className="custom-select"
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  background: '#0B111E',
                  border: '1px solid rgba(0, 166, 81, 0.4)',
                  borderRadius: '10px',
                  color: '#34D399'
                }}
              >
                {daysOfWeek.map(day => (
                  <option key={day} value={day}>{day}</option>
                ))}
              </select>
            </div>

            {/* Desktop Day Pills */}
            <div className="desktop-nav-pills" style={{ gap: '8px', marginTop: '18px', flexWrap: 'wrap' }}>
              {daysOfWeek.map((day) => (
                <button
                  key={day}
                  onClick={() => setSelectedDayFilter(day)}
                  style={{
                    padding: '6px 14px', borderRadius: '10px', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer',
                    background: selectedDayFilter === day ? 'rgba(0,166,81,0.2)' : 'rgba(255,255,255,0.03)',
                    color: selectedDayFilter === day ? '#34D399' : 'var(--text-secondary)',
                    border: selectedDayFilter === day ? '1px solid #00A651' : '1px solid var(--border-subtle)'
                  }}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>

                    {/* CONFIRMED 1-ON-1 PARENT BOOKINGS & HOME VISITS */}
          <div className="glass-panel" style={{ padding: '22px', borderRadius: '20px', marginBottom: '22px', border: '1.5px solid rgba(0, 166, 81, 0.4)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <div style={{ fontSize: '0.72rem', color: '#34D399', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Live Client Bookings
                </div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 900, margin: '2px 0 0 0', color: '#FFFFFF' }}>
                  Confirmed 1-on-1 Classes & Home Visits ({bookedSessions.length})
                </h3>
              </div>
              <span className="glass-pill" style={{ background: '#00A651', color: '#FFF', fontSize: '0.74rem', fontWeight: 700 }}>
                {bookedSessions.length} Active Sessions
              </span>
            </div>

            {bookedSessions.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)', fontSize: '0.86rem' }}>
                No private bookings scheduled for you yet. Your availability is live in the Parent Marketplace.
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '14px' }}>
                {bookedSessions.map((session) => {
                  const isVirtual = session.sessionType === 'virtual' || !session.sessionType;
                  return (
                    <div
                      key={session.id}
                      style={{
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '14px',
                        padding: '16px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        gap: '12px'
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                          <span className="glass-pill" style={{ fontSize: '0.7rem', color: isVirtual ? '#60A5FA' : '#34D399', border: '1px solid rgba(255,255,255,0.1)' }}>
                            {isVirtual ? '💻 Virtual Classroom' : '🏡 Home Visit'}
                          </span>
                          <span style={{ fontSize: '0.74rem', color: '#F59E0B', fontWeight: 700 }}>
                            KES {(session.amount || 2250).toLocaleString()} Paid
                          </span>
                        </div>

                        <div style={{ fontSize: '0.98rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '4px' }}>
                          {session.focusSubject}
                        </div>

                        <div style={{ fontSize: '0.82rem', color: '#34D399', fontWeight: 700, marginBottom: '6px' }}>
                          👤 Student: <strong>{session.studentName}</strong>
                        </div>

                        <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                          <div>📅 Date & Time: {session.date} • {session.timeSlot}</div>
                          <div>📍 Location: {session.estateAddress || 'Kilimani, Nairobi'}</div>
                          {session.parentNotes && <div>📝 Parent Note: "{session.parentNotes}"</div>}
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid var(--border-subtle)', paddingTop: '10px' }}>
                        {isVirtual ? (
                          <a
                            href="https://meet.jit.si/somahome-private-tutoring"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-primary"
                            style={{ flex: 1, fontSize: '0.78rem', padding: '7px', justifyContent: 'center', gap: '6px', background: '#00A651' }}
                          >
                            <Video size={14} />
                            <span>Launch Live Classroom</span>
                          </a>
                        ) : (
                          <button
                            onClick={() => alert(`🏡 Scheduled Home Visit\n\nStudent: ${session.studentName}\nParent Contact: Paid via M-Pesa (${session.receipt})\nLocation: ${session.estateAddress}\nSubject: ${session.focusSubject}\nInstructions: ${session.parentNotes || 'None'}`)}
                            className="btn-secondary"
                            style={{ flex: 1, fontSize: '0.78rem', padding: '7px', justifyContent: 'center', gap: '6px', color: '#34D399', borderColor: 'rgba(0,166,81,0.4)' }}
                          >
                            <MapPin size={14} />
                            <span>View Address & Notes</span>
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteBooking(session.id)}
                          className="btn-secondary"
                          style={{ padding: '7px 10px', color: '#EF4444', borderColor: 'rgba(239,68,68,0.3)' }}
                          title="Remove this booking"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Schedule Slots Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '16px' }}>
            {filteredSlots.map((slot) => {
              const isPod = slot.type === 'pod';
              const isAvailable = slot.status === 'Available';

              return (
                <div
                  key={slot.id}
                  className="glass-panel"
                  style={{
                    padding: '20px', borderRadius: '18px',
                    borderLeft: `5px solid ${isPod ? '#3B82F6' : slot.type === 'one_on_one' ? '#10B981' : '#F59E0B'}`
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                    <div>
                      <span style={{
                        background: 'rgba(255,255,255,0.06)', color: '#F8FAFC', fontSize: '0.72rem',
                        fontWeight: 800, padding: '3px 8px', borderRadius: '8px'
                      }}>
                        📅 {slot.day} • {slot.startTime} - {slot.endTime}
                      </span>
                    </div>

                    <button
                      onClick={() => handleToggleSlotStatus(slot)}
                      style={{
                        background: isAvailable ? 'rgba(0,166,81,0.15)' : 'rgba(59,130,246,0.15)',
                        color: isAvailable ? '#34D399' : '#60A5FA',
                        border: `1px solid ${isAvailable ? 'rgba(0,166,81,0.3)' : 'rgba(59,130,246,0.3)'}`,
                        fontSize: '0.7rem', fontWeight: 800, padding: '2px 8px', borderRadius: '12px', cursor: 'pointer'
                      }}
                    >
                      ● {slot.status}
                    </button>
                  </div>

                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: '0 0 6px 0', color: '#FFFFFF' }}>
                    {slot.title}
                  </h3>

                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '14px' }}>
                    👥 Group: <strong style={{ color: '#F8FAFC' }}>{slot.targetGroup}</strong> ({slot.bookedLearners}/{slot.maxLearners} Enrolled)
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
                    <span>📍 {slot.location}</span>
                    <span style={{ color: '#F59E0B', fontWeight: 800 }}>KES {slot.hourlyRateKes.toLocaleString()} / hr</span>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid var(--border-subtle)', paddingTop: '12px' }}>
                    <a
                      href={slot.liveLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary"
                      style={{ flex: 1, fontSize: '0.78rem', padding: '7px', justifyContent: 'center', gap: '6px' }}
                    >
                      <Video size={14} />
                      <span>Launch Class</span>
                    </a>

                    <button
                      onClick={() => handleDeleteSlot(slot.id)}
                      className="btn-secondary"
                      style={{ padding: '7px 10px', color: '#EF4444', borderColor: 'rgba(239, 68, 68, 0.3)' }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ================= SECTION 2: ESTATE PODS & POD CREATION ================= */}
      {activeTab === 'pods' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 900, margin: 0, color: '#FFFFFF' }}>
                🏘️ My Estate Micro-Pods & Neighborhood Hubs ({podGroups.length})
              </h2>
              <p style={{ margin: '2px 0 0 0', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                Create and facilitate small neighborhood pods (4–6 learners) sharing your homeschool guidance
              </p>
            </div>

            <button
              onClick={() => setIsNewPodModalOpen(true)}
              className="btn-primary"
              style={{ fontSize: '0.84rem', padding: '9px 18px', gap: '6px' }}
            >
              <Plus size={16} />
              <span>➕ Create & Launch New Estate Pod</span>
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '18px' }}>
            {podGroups.map((pod) => (
              <div key={pod.id} className="glass-panel" style={{ padding: '22px', borderRadius: '18px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ background: '#00A651', color: '#fff', fontSize: '0.7rem', fontWeight: 800, padding: '2px 8px', borderRadius: '8px' }}>
                      {pod.curriculum} • {pod.grade}
                    </span>
                    <span style={{ fontSize: '0.78rem', color: '#34D399', fontWeight: 700 }}>
                      KES {pod.monthlyShareKes?.toLocaleString()} / family / mo
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: '0 0 6px 0', color: '#FFFFFF' }}>
                    {pod.name}
                  </h3>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                    <MapPin size={13} color="#F59E0B" />
                    <span>{pod.estate}</span>
                  </div>

                  <p style={{ margin: '0 0 14px 0', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                    ⏰ {pod.meetingSchedule}
                  </p>
                </div>

                <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '14px', display: 'flex', gap: '8px' }}>
                  <a
                    href={pod.liveLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary"
                    style={{ flex: 1, fontSize: '0.82rem', padding: '8px', justifyContent: 'center', gap: '6px' }}
                  >
                    <Video size={15} />
                    <span>Launch Virtual Pod</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= SECTION 3: CBA MARKING ================= */}
      {activeTab === 'marking' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '20px' }}>
          <div className="glass-panel" style={{ padding: '20px', borderRadius: '18px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: '0 0 14px 0', color: '#FFFFFF' }}>
              Pending Student Submissions ({homeworkList.filter(h => h.status === 'submitted').length})
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {homeworkList.map((hw) => (
                <div
                  key={hw.id}
                  onClick={() => setSelectedHwToMark(hw)}
                  style={{
                    padding: '12px 14px', borderRadius: '12px', cursor: 'pointer',
                    background: selectedHwToMark?.id === hw.id ? 'rgba(0,166,81,0.15)' : 'rgba(255,255,255,0.02)',
                    border: selectedHwToMark?.id === hw.id ? '1px solid #00A651' : '1px solid var(--border-subtle)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '4px' }}>
                    <span style={{ fontWeight: 800, color: '#34D399' }}>{hw.studentName}</span>
                    <span style={{ color: hw.status === 'submitted' ? '#F59E0B' : '#10B981' }}>● {hw.status}</span>
                  </div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#FFFFFF' }}>{hw.title}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>{hw.subject} • {hw.curriculum}</div>
                </div>
              ))}
            </div>
          </div>

          {selectedHwToMark && (
            <div className="glass-panel" style={{ padding: '24px', borderRadius: '18px' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: '0 0 12px 0', color: '#FFFFFF' }}>
                Marking Assessment: {selectedHwToMark.studentName}
              </h3>

              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '14px', borderRadius: '12px', marginBottom: '16px' }}>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Assignment Task:</div>
                <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#FFFFFF', marginTop: '2px' }}>{selectedHwToMark.title}</div>
              </div>

              <form onSubmit={handleMarkSubmission} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.76rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                    CBA Rubric Rating:
                  </label>
                  <select
                    className="custom-select"
                    value={rubricLevel}
                    onChange={(e) => setRubricLevel(e.target.value)}
                    style={{ width: '100%', fontSize: '0.85rem', padding: '8px 12px' }}
                  >
                    <option value="EE">EE - Exceeding Expectations (Level 4)</option>
                    <option value="ME">ME - Meeting Expectations (Level 3)</option>
                    <option value="AE">AE - Approaching Expectations (Level 2)</option>
                    <option value="BE">BE - Below Expectations (Level 1)</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.76rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                    Constructive Feedback for Learner & Parent:
                  </label>
                  <textarea
                    rows={4}
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    style={{
                      width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-card)',
                      borderRadius: '8px', padding: '10px 12px', color: '#fff', fontSize: '0.85rem'
                    }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  {markSuccess && <span style={{ color: '#10B981', fontSize: '0.82rem', fontWeight: 800 }}>✓ Assessment Recorded in Portfolio!</span>}
                  <button type="submit" className="btn-primary" style={{ padding: '10px 20px', marginLeft: 'auto' }}>
                    Submit CBA Evaluation
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}

      {/* ================= SECTION 4: SCHEDULE LIVE CLASS ================= */}
      {activeTab === 'schedule_live' && (
        <div className="glass-panel" style={{ padding: '28px', maxWidth: '700px', margin: '0 auto', borderRadius: '20px' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 900, margin: '0 0 6px 0', color: '#FFFFFF' }}>
            Schedule Live Masterclass / Pod Session
          </h2>
          <p style={{ margin: '0 0 20px 0', fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
            Broadcasts the session link straight to student quest mission hubs and parent WhatsApp digests.
          </p>

          <form onSubmit={handleScheduleLiveLesson} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.76rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                Target Cohort:
              </label>
              <select
                className="custom-select"
                value={liveLessonForm.targetPodId}
                onChange={(e) => setLiveLessonForm({ ...liveLessonForm, targetPodId: e.target.value })}
                style={{ width: '100%', fontSize: '0.85rem', padding: '8px 12px' }}
              >
                <option value="student_mike">👦 Mike Kariuki (1-on-1 Specialist Class)</option>
                <option value="pod_alpha">🏫 Syokimau CBC Pod Alpha (Pod Group)</option>
                {podGroups.filter(p => p.id !== 'pod_alpha').map(p => (
                  <option key={p.id} value={p.id}>👥 {p.name} ({p.curriculum})</option>
                ))}
                <option value="all_learners">🌐 All Enrolled Learners (Broadcast)</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.76rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                Lesson Title:
              </label>
              <input
                type="text"
                value={liveLessonForm.title}
                onChange={(e) => setLiveLessonForm({ ...liveLessonForm, title: e.target.value })}
                style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-card)', borderRadius: '8px', padding: '10px 12px', color: '#fff', fontSize: '0.85rem' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.76rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                  Date:
                </label>
                <input
                  type="text"
                  value={liveLessonForm.date}
                  onChange={(e) => setLiveLessonForm({ ...liveLessonForm, date: e.target.value })}
                  style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-card)', borderRadius: '8px', padding: '10px 12px', color: '#fff', fontSize: '0.85rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.76rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                  Time:
                </label>
                <input
                  type="text"
                  value={liveLessonForm.time}
                  onChange={(e) => setLiveLessonForm({ ...liveLessonForm, time: e.target.value })}
                  style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-card)', borderRadius: '8px', padding: '10px 12px', color: '#fff', fontSize: '0.85rem' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              {scheduleSuccess && <span style={{ color: '#10B981', fontSize: '0.82rem', fontWeight: 800 }}>✓ Published to Learners & Parents!</span>}
              <button type="submit" className="btn-primary" style={{ padding: '10px 20px', marginLeft: 'auto' }}>
                Publish Live Session
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ================= SECTION 5: ALL STUDENTS DIRECTORY ================= */}
      {activeTab === 'students' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
          {assignedStudents.map((st) => (
            <div key={st.id} className="glass-panel" style={{ padding: '20px', borderRadius: '18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 800, fontSize: '1rem', color: '#FFFFFF' }}>{st.name}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>{st.grade} • Parent: {st.parentName}</div>
                <span style={{ fontSize: '0.7rem', color: '#34D399', fontWeight: 700 }}>● {st.status}</span>
              </div>

              <button
                onClick={() => setActiveCallLearner(st)}
                className="btn-primary"
                style={{ fontSize: '0.75rem', padding: '6px 12px', gap: '6px' }}
              >
                <Video size={13} />
                <span>1:1 Call</span>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ================= SECTION 6: WALLET & EARNINGS ================= */}
      {activeTab === 'earnings' && (
        <div className="glass-panel" style={{ padding: '28px', maxWidth: '600px', margin: '0 auto', borderRadius: '20px', textAlign: 'center' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '18px', background: '#00A651', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
            <DollarSign size={28} color="#fff" />
          </div>

          <h2 style={{ fontSize: '1.4rem', fontWeight: 900, margin: '0 0 6px 0', color: '#FFFFFF' }}>
            Teacher Wallet & Remuneration
          </h2>
          <p style={{ margin: '0 0 20px 0', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            Direct B2C disbursement for estate pod fees & 1-on-1 sessions
          </p>

          <div style={{ background: 'rgba(0,166,81,0.1)', padding: '20px', borderRadius: '16px', marginBottom: '20px' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Withdrawable Balance:</div>
            <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#34D399' }}>
              KES {balanceKes.toLocaleString()}
            </div>
          </div>

          <form onSubmit={handleWithdrawMpesa} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <input
              type="text"
              value={withdrawPhone}
              onChange={(e) => setWithdrawPhone(e.target.value)}
              placeholder="0790 821 091"
              style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-card)', borderRadius: '8px', padding: '10px', color: '#fff', textAlign: 'center', fontSize: '0.9rem' }}
            />

            {withdrawReceipt ? (
              <div style={{ color: '#34D399', fontWeight: 800, fontSize: '0.85rem' }}>
                ✓ Disbursed! Receipt: {withdrawReceipt}
              </div>
            ) : (
              <button type="submit" disabled={withdrawLoading || balanceKes === 0} className="btn-primary" style={{ padding: '12px', justifyContent: 'center', fontSize: '0.9rem' }}>
                {withdrawLoading ? 'Disbursing...' : 'Disburse to M-Pesa'}
              </button>
            )}
          </form>
        </div>
      )}

      {/* MODAL 1: CREATE ESTATE POD */}
      {isNewPodModalOpen && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 99999, padding: '16px'
        }}>
          <div className="glass-panel" style={{
            maxWidth: '560px', width: '100%', background: '#0F172A', borderRadius: '24px',
            border: '1px solid #00A651', padding: '28px', maxHeight: '90vh', overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 900, margin: 0, color: '#FFFFFF' }}>
                🏘️ Create & Launch New Estate Pod
              </h3>
              <button onClick={() => setIsNewPodModalOpen(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreatePodSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.74rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Pod Name:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Lavington CBC Grade 4 Innovators"
                  value={newPodForm.name}
                  onChange={(e) => setNewPodForm({ ...newPodForm, name: e.target.value })}
                  style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-card)', borderRadius: '8px', padding: '9px 12px', color: '#fff', fontSize: '0.85rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.74rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Estate / Location:</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Lavington / Syokimau"
                    value={newPodForm.estate}
                    onChange={(e) => setNewPodForm({ ...newPodForm, estate: e.target.value })}
                    style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-card)', borderRadius: '8px', padding: '9px 12px', color: '#fff', fontSize: '0.85rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.74rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Monthly Share KES / Family:</label>
                  <input
                    type="number"
                    required
                    placeholder="4500"
                    value={newPodForm.monthlyShareKes}
                    onChange={(e) => setNewPodForm({ ...newPodForm, monthlyShareKes: Number(e.target.value) })}
                    style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-card)', borderRadius: '8px', padding: '9px 12px', color: '#fff', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.74rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Curriculum & Grade:</label>
                  <select
                    className="custom-select"
                    value={newPodForm.grade}
                    onChange={(e) => setNewPodForm({ ...newPodForm, grade: e.target.value })}
                    style={{ width: '100%', fontSize: '0.82rem', padding: '8px' }}
                  >
                    <option value="Grade 1 (CBC)">Grade 1 (CBC)</option>
                    <option value="Grade 2 (CBC)">Grade 2 (CBC)</option>
                    <option value="Grade 3 (CBC)">Grade 3 (CBC)</option>
                    <option value="Grade 4 (CBC)">Grade 4 (CBC)</option>
                    <option value="Grade 5 (CBC)">Grade 5 (CBC)</option>
                    <option value="Grade 6 (CBC)">Grade 6 (CBC)</option>
                    <option value="Year 5 (Cambridge)">Year 5 (Cambridge)</option>
                    <option value="Year 6 (Cambridge)">Year 6 (Cambridge)</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.74rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Max Children (Cap):</label>
                  <input
                    type="number"
                    value={newPodForm.maxChildren}
                    onChange={(e) => setNewPodForm({ ...newPodForm, maxChildren: Number(e.target.value) })}
                    style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-card)', borderRadius: '8px', padding: '9px 12px', color: '#fff', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.74rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Meeting Schedule:</label>
                <input
                  type="text"
                  placeholder="e.g. Mon, Wed, Fri (09:00 AM - 12:30 PM)"
                  value={newPodForm.meetingSchedule}
                  onChange={(e) => setNewPodForm({ ...newPodForm, meetingSchedule: e.target.value })}
                  style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-card)', borderRadius: '8px', padding: '9px 12px', color: '#fff', fontSize: '0.85rem' }}
                />
              </div>

              <button type="submit" className="btn-primary" style={{ padding: '11px', justifyContent: 'center', marginTop: '6px' }}>
                🚀 Launch Pod on Parent Directory
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: ADD TIME SLOT */}
      {isAddSlotModalOpen && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 99999, padding: '16px'
        }}>
          <div className="glass-panel" style={{
            maxWidth: '540px', width: '100%', background: '#0F172A', borderRadius: '24px',
            border: '1px solid rgba(0,166,81,0.4)', padding: '28px', maxHeight: '90vh', overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 900, margin: 0, color: '#FFFFFF' }}>
                📅 Add Teaching Time Slot
              </h3>
              <button onClick={() => setIsAddSlotModalOpen(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddSlotSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.74rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Day:</label>
                  <select
                    className="custom-select"
                    value={newSlotForm.day}
                    onChange={(e) => setNewSlotForm({ ...newSlotForm, day: e.target.value })}
                    style={{ width: '100%', fontSize: '0.82rem', padding: '8px' }}
                  >
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.74rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Start Time:</label>
                  <input
                    type="text"
                    value={newSlotForm.startTime}
                    onChange={(e) => setNewSlotForm({ ...newSlotForm, startTime: e.target.value })}
                    placeholder="09:00 AM"
                    style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-card)', borderRadius: '8px', padding: '8px', color: '#fff', fontSize: '0.82rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.74rem', color: 'var(--text-muted)', marginBottom: '4px' }}>End Time:</label>
                  <input
                    type="text"
                    value={newSlotForm.endTime}
                    onChange={(e) => setNewSlotForm({ ...newSlotForm, endTime: e.target.value })}
                    placeholder="11:00 AM"
                    style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-card)', borderRadius: '8px', padding: '8px', color: '#fff', fontSize: '0.82rem' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.74rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Session / Subject Title:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CBC Grade 4 Mathematics & STEM Lab"
                  value={newSlotForm.title}
                  onChange={(e) => setNewSlotForm({ ...newSlotForm, title: e.target.value })}
                  style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-card)', borderRadius: '8px', padding: '8px 12px', color: '#fff', fontSize: '0.85rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.74rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Session Format:</label>
                  <select
                    className="custom-select"
                    value={newSlotForm.type}
                    onChange={(e) => setNewSlotForm({ ...newSlotForm, type: e.target.value })}
                    style={{ width: '100%', fontSize: '0.82rem', padding: '8px' }}
                  >
                    <option value="pod">🏘️ Multi-Student Pod Cohort</option>
                    <option value="one_on_one">👤 1-on-1 Private Tutoring</option>
                    <option value="open_booking">📅 Open Parent Consultation Slot</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.74rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Hourly Rate (KES):</label>
                  <input
                    type="number"
                    value={newSlotForm.hourlyRateKes}
                    onChange={(e) => setNewSlotForm({ ...newSlotForm, hourlyRateKes: Number(e.target.value) })}
                    style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-card)', borderRadius: '8px', padding: '8px 12px', color: '#fff', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              <button type="submit" className="btn-primary" style={{ padding: '10px', justifyContent: 'center', marginTop: '8px' }}>
                Save & Publish Time Slot
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 1:1 Call Modal */}
      {activeCallLearner && (
        <StudentTeacherCallModal
          isOpen={!!activeCallLearner}
          studentName={activeCallLearner.name}
          subject="1-on-1 CBC & Cambridge Mentorship"
          onClose={() => setActiveCallLearner(null)}
        />
      )}

    </div>
  );
}
