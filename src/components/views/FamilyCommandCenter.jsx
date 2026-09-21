import React, { useState, useEffect } from 'react';
import { 
  Users, Calendar, Award, BookOpen, Clock, Video, MapPin, Plus, 
  ArrowRight, ShieldCheck, CheckCircle2, AlertCircle, Sparkles, DollarSign, 
  Activity, FileText, Compass, Eye, CheckCircle, ExternalLink 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { homeworkService, telemetryService } from '../../services/homeworkTelemetryStore';
import StudentActivityTelemetryModal from '../../modules/parent/StudentActivityTelemetryModal';
import UpcomingSessionsModal from '../../modules/parent/UpcomingSessionsModal';
import TutorHomeworkOverviewModal from '../../modules/parent/TutorHomeworkOverviewModal';

const DEFAULT_PARENT_BOOKINGS = [
  {
    id: 'BKG-9102',
    tutorName: 'Teacher Mercy Cherono',
    tutorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200',
    studentName: 'Liam Kiprop (Grade 4 CBC)',
    date: '2026-09-17',
    timeSlot: '10:00 AM - 11:30 AM',
    sessionType: 'virtual',
    focusSubject: 'Grade 4 CBC Mathematics: Fractions & Decimals',
    amount: 3500,
    receipt: 'SKM849201',
    status: 'Confirmed'
  },
  {
    id: 'BKG-9103',
    tutorName: 'Teacher Sarah Wambui',
    tutorAvatar: 'https://images.unsplash.com/photo-1580894732488-b223d6a2a095?w=200',
    studentName: 'Liam Kiprop (Grade 4 CBC)',
    date: '2026-09-19',
    timeSlot: '02:00 PM - 03:30 PM',
    sessionType: 'in_person',
    estateAddress: 'Kilimani Court 5',
    focusSubject: 'Science Lab: Solar Filtration & Water Purification',
    amount: 4000,
    receipt: 'SKM918234',
    status: 'Confirmed'
  },
  {
    id: 'BKG-9104',
    tutorName: 'Mwalimu Kevin Mwangi',
    tutorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
    studentName: 'Liam Kiprop (Grade 4 CBC)',
    date: '2026-09-22',
    timeSlot: '11:00 AM - 12:30 PM',
    sessionType: 'virtual',
    focusSubject: 'Kiswahili: Utunzi wa Mashairi na Ngeli za Nomino',
    amount: 3000,
    receipt: 'SKM772910',
    status: 'Confirmed'
  }
];

export default function FamilyCommandCenter({
  childrenList = [],
  onSelectChild,
  onOpenAddChild,
  onOpenBookTutor,
  onNavigateTab
}) {
  const { currentUser } = useAuth();
  const [isTelemetryOpen, setIsTelemetryOpen] = useState(false);
  const [isUpcomingModalOpen, setIsUpcomingModalOpen] = useState(false);
  const [isHomeworkOverviewOpen, setIsHomeworkOverviewOpen] = useState(false);
  const [inspectingHw, setInspectingHw] = useState(null);

  // Load telemetry and homework with live reactive sync
  const [telemetry, setTelemetry] = useState(() => telemetryService.getTelemetry('Liam Kiprop'));
  const [homeworkList, setHomeworkList] = useState(() => homeworkService.getAll());

  useEffect(() => {
    const handleSync = () => {
      setTelemetry(telemetryService.getTelemetry('Liam Kiprop'));
      setHomeworkList(homeworkService.getAll());
    };
    window.addEventListener('storage', handleSync);
    const interval = setInterval(handleSync, 2000);
    return () => {
      window.removeEventListener('storage', handleSync);
      clearInterval(interval);
    };
  }, []);

  // Load booked sessions from persistent store with rich realistic defaults
  const [bookingsList, setBookingsList] = useState(() => {
    try {
      const b = localStorage.getItem('somahome_client_bookings_v2');
      const parsed = b ? JSON.parse(b) : [];
      return parsed && parsed.length >= 3 ? parsed : DEFAULT_PARENT_BOOKINGS;
    } catch {
      return DEFAULT_PARENT_BOOKINGS;
    }
  });

  const activeBookings = bookingsList.filter(b => b.status !== 'Cancelled');
  const activeHours = Math.floor(telemetry.totalActiveMinutes / 60);
  const activeMins = telemetry.totalActiveMinutes % 60;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* Super Dashboard Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <span className="glass-pill" style={{ color: '#00A651', border: '1px solid rgba(0,166,81,0.3)', marginBottom: '8px', display: 'inline-block', fontSize: '0.74rem' }}>
            🏡 Homeschool Family Command Center
          </span>
          <h2 style={{ fontSize: '1.8rem', margin: 0, fontWeight: 800 }}>
            {currentUser?.name ? `${currentUser.name.split(' ')[0]}'s Family Super Dashboard` : "Parent's Family Super Dashboard"}
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', margin: '4px 0 0 0' }}>
            Household overview: enrolled learners, specialist tutor homework oversight & real-time study telemetry
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => setIsTelemetryOpen(true)}
            className="btn-gold"
            style={{ padding: '10px 16px', fontSize: '0.86rem', gap: '8px' }}
          >
            <Activity size={16} />
            <span>Active Study Telemetry</span>
          </button>

          <button
            onClick={onOpenAddChild}
            className="btn-primary"
            style={{ padding: '10px 18px', fontSize: '0.86rem', gap: '8px' }}
          >
            <Plus size={16} />
            <span>Enroll Another Child</span>
          </button>
        </div>
      </div>

      {/* Household High-Level KPI Summary Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        
        {/* Active Study Telemetry KPI Card */}
        <div 
          onClick={() => setIsTelemetryOpen(true)}
          className="glass-panel" 
          style={{ padding: '22px', borderTop: '3px solid #10B981', cursor: 'pointer', transition: 'transform 0.2s' }}
          title="Click to view detailed activity logs"
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase' }}>
              TODAY'S ACTIVE STUDY
            </span>
            <Activity size={20} color="#10B981" />
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#10B981', marginTop: '6px', fontFamily: 'monospace' }}>
            {activeHours}h {activeMins}m
          </div>
          <div style={{ fontSize: '0.75rem', color: '#34D399', marginTop: '4px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span>{telemetry.focusEfficiency}% Focus Efficiency</span>
            <span style={{ textDecoration: 'underline' }}>View Log →</span>
          </div>
        </div>

        {/* Enrolled Children */}
        <div className="glass-panel" style={{ padding: '22px', borderTop: '3px solid #00A651' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase' }}>
              ENROLLED CHILDREN
            </span>
            <Users size={20} color="#34D399" />
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#F8FAFC', marginTop: '6px' }}>
            {childrenList.length} Learners
          </div>
          <div style={{ fontSize: '0.75rem', color: '#10B981', marginTop: '4px' }}>
            {childrenList.map(c => c.name.split(' ')[0]).join(' & ')}
          </div>
        </div>

        {/* Upcoming Tutor Sessions */}
        <div 
          className="glass-panel" 
          onClick={() => setIsUpcomingModalOpen(true)}
          style={{ 
            padding: '22px', 
            borderTop: '3px solid #F59E0B',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.borderColor = 'rgba(245, 158, 11, 0.6)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.borderColor = 'var(--border-card)';
          }}
          title="Click to view scheduled sessions popup"
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase' }}>
              UPCOMING SESSIONS
            </span>
            <Calendar size={20} color="#F59E0B" />
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#F8FAFC', marginTop: '6px' }}>
            {activeBookings.length} Booked
          </div>
          <div style={{ fontSize: '0.75rem', color: '#F59E0B', marginTop: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>{activeBookings.length > 0 ? `Next: ${activeBookings[0].date} @ ${activeBookings[0].timeSlot?.split('-')[0]?.trim() || '10:00 AM'}` : 'No sessions pending'}</span>
            <span style={{ textDecoration: 'underline' }}>View Details →</span>
          </div>
        </div>

        {/* Assigned Homework Pending */}
        <div 
          className="glass-panel" 
          onClick={() => setIsHomeworkOverviewOpen(true)}
          style={{ 
            padding: '22px', 
            borderTop: '3px solid #818CF8',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.borderColor = 'rgba(129, 140, 248, 0.6)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.borderColor = 'var(--border-card)';
          }}
          title="Click to view homework breakdown popup"
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase' }}>
              TUTOR HOMEWORK
            </span>
            <FileText size={20} color="#818CF8" />
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#F8FAFC', marginTop: '6px' }}>
            {homeworkList.length} Total
          </div>
          <div style={{ fontSize: '0.75rem', color: '#818CF8', marginTop: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>{homeworkList.filter(h => h.status === 'graded').length} Marked • {homeworkList.filter(h => h.status !== 'graded').length} Active</span>
            <span style={{ textDecoration: 'underline' }}>View Breakdown →</span>
          </div>
        </div>

      </div>

      {/* SPECIALIST TUTOR HOMEWORK OVERSIGHT PANEL */}
      <div className="glass-panel" style={{ padding: '26px', marginBottom: '36px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <span className="glass-pill" style={{ color: '#818CF8', border: '1px solid rgba(129, 140, 248, 0.3)', fontSize: '0.7rem', marginBottom: '4px', display: 'inline-block' }}>
              👨‍🏫 Specialist Tutor Assignment Oversight
            </span>
            <h3 style={{ fontSize: '1.25rem', margin: 0, fontWeight: 800 }}>
              Assigned Homework & Teacher Feedback
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: '2px 0 0 0' }}>
              Specialist teachers give homework, students complete & submit it, and teachers review and grade it with certified feedback.
            </p>
          </div>

          <span className="glass-pill" style={{ fontSize: '0.75rem', color: '#10B981' }}>
            Parent Read-Only Oversight Loop
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '16px' }}>
          {homeworkList.map(hw => {
            const isGraded = hw.status === 'graded';
            const isSubmitted = hw.status === 'submitted';

            return (
              <div 
                key={hw.id}
                style={{
                  background: 'rgba(0,0,0,0.35)',
                  border: isGraded ? '1px solid rgba(16, 185, 129, 0.35)' : (isSubmitted ? '1px solid rgba(56, 189, 248, 0.35)' : '1px solid var(--border-subtle)'),
                  borderRadius: '16px',
                  padding: '18px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <span className="glass-pill" style={{ fontSize: '0.68rem', color: '#38BDF8' }}>
                      {hw.subject} • {hw.curriculum}
                    </span>
                    <span className={`glass-pill ${isGraded ? 'badge-cbc' : ''}`} style={{ fontSize: '0.68rem', color: isGraded ? '#10B981' : (isSubmitted ? '#38BDF8' : '#F59E0B') }}>
                      {isGraded ? `Certified: ${hw.grade}` : (isSubmitted ? '⏳ Submitted for Marking' : '📅 Assigned')}
                    </span>
                  </div>

                  <h4 style={{ fontSize: '1rem', fontWeight: 700, margin: '4px 0 6px 0', color: '#F8FAFC' }}>
                    {hw.title}
                  </h4>

                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '10px' }}>
                    Assigned by: <strong style={{ color: '#E2E8F0' }}>{hw.teacherName}</strong> • For: {hw.studentName}
                  </div>

                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.4, margin: '0 0 12px 0' }}>
                    {hw.instructions}
                  </p>

                  {/* Teacher Feedback snippet if graded */}
                  {isGraded && hw.feedback && (
                    <div style={{ background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.25)', borderRadius: '10px', padding: '10px 12px', fontSize: '0.78rem', marginBottom: '10px' }}>
                      <div style={{ color: '#10B981', fontWeight: 700, marginBottom: '2px' }}>
                        ⭐ Teacher Remarks ({hw.rubricLevel}):
                      </div>
                      <div style={{ color: '#E2E8F0', fontStyle: 'italic' }}>
                        "{hw.feedback}"
                      </div>
                    </div>
                  )}

                  {/* Student Submitted Answer snippet if submitted */}
                  {isSubmitted && hw.studentSubmission && (
                    <div style={{ background: 'rgba(56, 189, 248, 0.06)', border: '1px solid rgba(56, 189, 248, 0.2)', borderRadius: '10px', padding: '8px 12px', fontSize: '0.78rem', marginBottom: '10px' }}>
                      <div style={{ color: '#38BDF8', fontWeight: 600 }}>
                        📝 Liam's Submitted Solution ({hw.studentSubmission.submittedAt}):
                      </div>
                      <div style={{ color: 'var(--text-muted)', fontStyle: 'italic', marginTop: '2px' }}>
                        "{hw.studentSubmission.text.substring(0, 100)}..."
                      </div>
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid var(--border-subtle)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  <span>Due: {hw.dueDate}</span>
                  <button
                    onClick={() => setInspectingHw(hw)}
                    className="glass-pill"
                    style={{ color: '#38BDF8', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    <Eye size={12} />
                    <span>View Submission</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* CHILDREN PROFILE CARDS & CURRENT BOOKINGS */}
      <div style={{ marginBottom: '36px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <h3 style={{ fontSize: '1.25rem', margin: 0, fontWeight: 800 }}>
            Family Learner Status & Scheduled Classes
          </h3>
          <span className="glass-pill" style={{ fontSize: '0.75rem' }}>
            Tap child to switch dashboard context
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
          {childrenList.map((child) => {
            const childBookings = activeBookings.filter(b =>
              b.studentName?.toLowerCase().includes(child.name.toLowerCase().split(' ')[0])
            );
            const isCbc = child.curriculum === 'CBC';

            return (
              <div
                key={child.id}
                className="glass-panel"
                style={{
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  borderRadius: '18px',
                  border: isCbc ? '1.5px solid rgba(0, 166, 81, 0.35)' : '1.5px solid rgba(56, 189, 248, 0.35)'
                }}
              >
                <div>
                  {/* Top Header: Avatar, Name & Curriculum Badge */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
                    <img
                      src={child.avatar}
                      alt={child.name}
                      style={{
                        width: '58px',
                        height: '58px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        border: isCbc ? '2px solid #00A651' : '2px solid #38BDF8'
                      }}
                    />
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <h4 style={{ fontSize: '1.2rem', margin: 0, fontWeight: 800 }}>{child.name}</h4>
                        <span className={`glass-pill ${isCbc ? 'badge-cbc' : 'badge-cambridge'}`} style={{ fontSize: '0.68rem', padding: '2px 8px' }}>
                          {isCbc ? '🇰🇪 CBC' : '🇬🇧 Cambridge'}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                        {child.grade} • Born {child.dob || '2016'}
                      </div>
                    </div>
                  </div>

                  {/* Today's Learning Status */}
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '12px',
                    padding: '12px 14px',
                    marginBottom: '16px',
                    fontSize: '0.85rem'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase' }}>
                        TODAY'S PROGRESS
                      </span>
                      <span style={{ color: '#10B981', fontWeight: 700, fontSize: '0.8rem' }}>
                        {activeHours}h {activeMins}m Active
                      </span>
                    </div>
                    <div style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                      ✅ Lesson 3 Complete • Lab Evaporation Practical
                    </div>
                  </div>

                  {/* Scheduled Specialist Tutors */}
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', marginBottom: '8px' }}>
                      BOOKED TUTOR SESSIONS ({childBookings.length})
                    </div>

                    {childBookings.length > 0 ? (
                      childBookings.map((b) => (
                        <div
                          key={b.id}
                          style={{
                            background: 'rgba(245, 158, 11, 0.08)',
                            border: '1px solid rgba(245, 158, 11, 0.3)',
                            borderRadius: '10px',
                            padding: '10px 12px',
                            marginBottom: '8px',
                            fontSize: '0.82rem'
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                            <span style={{ fontWeight: 700, color: '#F59E0B' }}>
                              👨‍🏫 {b.tutorName}
                            </span>
                            <span className="glass-pill" style={{ fontSize: '0.65rem', color: '#10B981' }}>
                              Confirmed ✅
                            </span>
                          </div>
                          <div style={{ color: 'var(--text-secondary)' }}>
                            📅 <strong>{b.date} • {b.timeSlot}</strong>
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                            {b.sessionType === 'in_person' ? `📍 Home Visit: ${b.estateAddress}` : '💻 Live Virtual Classroom'} • {b.focusSubject}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div style={{
                        background: 'rgba(255, 255, 255, 0.02)',
                        borderRadius: '10px',
                        padding: '12px',
                        fontSize: '0.8rem',
                        color: 'var(--text-muted)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <span>No tutor sessions booked currently.</span>
                        <button
                          onClick={onOpenBookTutor}
                          className="glass-pill"
                          style={{ color: '#38BDF8', cursor: 'pointer', border: '1px solid rgba(56, 189, 248, 0.3)' }}
                        >
                          Book Session +
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Bottom Quick Actions */}
                <div style={{ paddingTop: '16px', borderTop: '1px solid var(--border-subtle)', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  <button
                    onClick={() => {
                      onSelectChild(child.id);
                      onNavigateTab('daily');
                    }}
                    className="btn-primary"
                    style={{ flex: '1 1 140px', justifyContent: 'center', fontSize: '0.82rem', padding: '8px 12px' }}
                  >
                    <span>Launch Daily OS</span>
                    <ArrowRight size={14} />
                  </button>

                  <button
                    onClick={() => {
                      onSelectChild(child.id);
                      onNavigateTab('attendance');
                    }}
                    className="btn-secondary"
                    style={{ fontSize: '0.82rem', padding: '8px 12px', gap: '5px' }}
                    title="Statutory 180-Day / 900-Hour MoE Legal Attendance Clock"
                  >
                    <Clock size={14} color="#10B981" />
                    <span>MoE Hours</span>
                  </button>

                  <button
                    onClick={() => {
                      onSelectChild(child.id);
                      onNavigateTab('placement');
                    }}
                    className="btn-secondary"
                    style={{ fontSize: '0.82rem', padding: '8px 12px', gap: '5px' }}
                    title="Adaptive Diagnostic Baseline Assessment"
                  >
                    <Compass size={14} color="#38BDF8" />
                    <span>Diagnostic ILP</span>
                  </button>

                  <button
                    onClick={() => {
                      onSelectChild(child.id);
                      onNavigateTab('report');
                    }}
                    className="btn-secondary"
                    style={{ fontSize: '0.82rem', padding: '8px 12px', gap: '5px' }}
                  >
                    <Award size={14} />
                    <span>Report</span>
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      </div>

      {/* ALL BOOKINGS CHRONOLOGICAL TIMELINE */}
      <div className="glass-panel" style={{ padding: '26px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', margin: 0, fontWeight: 800 }}>Master Session Schedule</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: '2px 0 0 0' }}>
              All upcoming scheduled teacher visits and virtual masterclasses across your household
            </p>
          </div>
          <button
            onClick={onOpenBookTutor}
            className="btn-gold"
            style={{ fontSize: '0.82rem', padding: '8px 16px' }}
          >
            <span>Book Another Specialist</span>
          </button>
        </div>

        {activeBookings.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {activeBookings.map((booking) => (
              <div
                key={booking.id}
                style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '14px',
                  padding: '16px 20px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '12px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '12px',
                    background: 'rgba(0, 166, 81, 0.12)',
                    border: '1px solid rgba(0, 166, 81, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    {booking.sessionType === 'in_person' ? <MapPin size={22} color="#00A651" /> : <Video size={22} color="#38BDF8" />}
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#F8FAFC' }}>
                        {booking.studentName}
                      </span>
                      <span className="glass-pill" style={{ fontSize: '0.7rem', color: '#38BDF8' }}>
                        {booking.focusSubject}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                      Tutor: <strong>{booking.tutorName}</strong> • {booking.sessionType === 'in_person' ? `Home Visit (${booking.estateAddress})` : 'Virtual Live Classroom'}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#F59E0B' }}>
                      {booking.date} • {booking.timeSlot}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#10B981' }}>
                      M-Pesa: {booking.receipt} (Paid KES {booking.amount?.toLocaleString()})
                    </div>
                  </div>

                  <button
                    onClick={() => onNavigateTab('chat')}
                    className="btn-secondary"
                    style={{ padding: '8px 14px', fontSize: '0.8rem' }}
                    title="Send message to tutor"
                  >
                    Message 💬
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            No sessions currently scheduled. Tap "Book Another Specialist" to arrange a lesson.
          </div>
        )}
      </div>

      {/* Telemetry Modal */}
      {isTelemetryOpen && (
        <StudentActivityTelemetryModal
          isOpen={isTelemetryOpen}
          onClose={() => setIsTelemetryOpen(false)}
          studentName="Liam Kiprop"
        />
      )}

      {/* Upcoming Sessions Modal */}
      {isUpcomingModalOpen && (
        <UpcomingSessionsModal
          isOpen={isUpcomingModalOpen}
          onClose={() => setIsUpcomingModalOpen(false)}
          bookings={activeBookings}
          onOpenBookTutor={onOpenBookTutor}
          onJoinSession={(session) => {
            setIsUpcomingModalOpen(false);
            if (onNavigateTab) onNavigateTab('marketplace');
          }}
        />
      )}

      {/* Tutor Homework Overview Modal */}
      {isHomeworkOverviewOpen && (
        <TutorHomeworkOverviewModal
          isOpen={isHomeworkOverviewOpen}
          onClose={() => setIsHomeworkOverviewOpen(false)}
          homeworkList={homeworkList}
          onInspectHomework={(hw) => setInspectingHw(hw)}
        />
      )}

      {/* Quick Inspection Modal for Parent */}
      {inspectingHw && (
        <div 
          onClick={(e) => { if (e.target === e.currentTarget) setInspectingHw(null); }}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(5, 10, 15, 0.88)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px'
          }}
        >
          <div className="glass-panel" style={{
            width: '100%',
            maxWidth: '520px',
            padding: '28px',
            border: '1.5px solid rgba(16, 185, 129, 0.4)',
            boxShadow: '0 20px 50px rgba(0,0,0,0.8)',
            background: '#0E1524'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '14px', marginBottom: '16px' }}>
              <div>
                <span className="glass-pill" style={{ color: '#10B981', fontSize: '0.72rem', marginBottom: '6px' }}>{inspectingHw.subject}</span>
                <h3 style={{ margin: '4px 0 0 0', fontSize: '1.1rem', color: '#F8FAFC', fontWeight: 700 }}>{inspectingHw.title}</h3>
              </div>
              <button 
                onClick={() => setInspectingHw(null)} 
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '1.2rem', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>
            
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
              Assigned by: <strong style={{ color: '#E2E8F0' }}>{inspectingHw.teacherName}</strong> • Due: <strong style={{ color: '#F59E0B' }}>{inspectingHw.dueDate}</strong>
            </div>

            <div style={{ background: 'rgba(0, 0, 0, 0.35)', borderRadius: '12px', border: '1px solid var(--border-card)', padding: '14px', fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '16px' }}>
              <strong style={{ color: '#F8FAFC' }}>Instructions:</strong> {inspectingHw.instructions}
            </div>

            {inspectingHw.studentSubmission ? (
              <div style={{ background: 'rgba(16, 185, 129, 0.08)', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.25)', padding: '14px', fontSize: '0.84rem', marginBottom: '16px' }}>
                <div style={{ color: '#10B981', fontWeight: 700, marginBottom: '6px' }}>
                  Liam's Submission ({inspectingHw.studentSubmission.submittedAt}):
                </div>
                <div style={{ color: '#F8FAFC', whiteSpace: 'pre-wrap', lineHeight: 1.4, fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>
                  {inspectingHw.studentSubmission.text}
                </div>
              </div>
            ) : (
              <div style={{ fontSize: '0.82rem', color: '#F59E0B', fontStyle: 'italic', marginBottom: '16px' }}>
                ⏳ Work not yet submitted by student.
              </div>
            )}

            {inspectingHw.grade && (
              <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.4)', borderRadius: '12px', padding: '14px', fontSize: '0.84rem', color: '#6EE7B7', marginBottom: '16px' }}>
                <div style={{ fontWeight: 800, color: '#10B981', marginBottom: '4px' }}>
                  Certified Grade: {inspectingHw.grade} ({inspectingHw.rubricLevel})
                </div>
                <div style={{ fontStyle: 'italic', color: '#E2E8F0', fontSize: '0.82rem' }}>
                  "{inspectingHw.feedback}"
                </div>
              </div>
            )}

            <button 
              onClick={() => setInspectingHw(null)} 
              className="btn-secondary"
              style={{ width: '100%', padding: '10px 0', fontSize: '0.88rem' }}
            >
              Close Overview
            </button>
          </div>
        </div>
      )}

    </div>
  );
}