import React, { useState, useEffect } from 'react';
import { 
  Video, Calendar, Clock, PlayCircle, ShieldCheck, Users, MapPin, 
  Sparkles, AlertCircle, BookOpen, ArrowRight, Gamepad2, Compass, Award
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { bookingsService } from '../../services/homeworkTelemetryStore';
import LiveClassroomModal from '../../modules/learning/LiveClassroomModal';

export default function LiveSessions({ onGoToHome, onGoToReading, onGoToQuiz }) {
  const { currentUser } = useAuth();
  const [subjectFilter, setSubjectFilter] = useState('ALL');
  const [selectedLiveSession, setSelectedLiveSession] = useState(null);

  const isStudent = currentUser?.role === 'student';
  const isTeacher = currentUser?.role === 'tutor' || currentUser?.role === 'teacher';
  const studentName = currentUser?.name || '';
  const displayName = currentUser?.name ? currentUser.name.split(' ')[0] : 'Learner';

  // Load real sessions from reactive bookings store
    const [formatFilter, setFormatFilter] = useState('ALL'); // 'ALL' | 'virtual' | 'in_person'

  // Load real sessions from reactive bookings store
  const [bookings, setBookings] = useState(() => {
    if (isStudent) {
      return bookingsService.getForStudent(studentName, currentUser?.id || currentUser?.student_id);
    } else if (isTeacher) {
      const tBookings = bookingsService.getForTeacher(currentUser?.name || '', currentUser?.id);
      return tBookings.length > 0 ? tBookings : bookingsService.getAll().filter(b => b.status !== 'Cancelled');
    }
    return bookingsService.getAll();
  });

  useEffect(() => {
    const handleUpdate = () => {
      if (isStudent) {
        setBookings(bookingsService.getForStudent(currentUser?.name || '', currentUser?.id || currentUser?.student_id));
      } else if (isTeacher) {
        setBookings(bookingsService.getForTeacher(currentUser?.name || '', currentUser?.id));
      } else {
        setBookings(bookingsService.getAll());
      }
    };

    window.addEventListener('somahome_bookings_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('somahome_bookings_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, [currentUser?.name, currentUser?.id, isStudent, isTeacher]);

  // Format filter (shows all sessions: virtual and in_person)
  const formatFiltered = bookings.filter(b => {
    if (formatFilter === 'virtual') return b.sessionType === 'virtual' || !b.sessionType;
    if (formatFilter === 'in_person') return b.sessionType === 'in_person';
    return true;
  });

  const filteredSessions = subjectFilter === 'ALL'
    ? formatFiltered
    : formatFiltered.filter((s) => (s.focusSubject || s.tutorSubject || '').toLowerCase().includes(subjectFilter.toLowerCase()));

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '28px', flexWrap: 'wrap', gap: '20px' }}>
        <div>
          <span className="glass-pill" style={{ color: '#EF4444', border: '1px solid rgba(239,68,68,0.3)', marginBottom: '8px', display: 'inline-block', fontSize: '0.74rem' }}>
            🔴 Live Video Classroom
          </span>
          <h2 style={{ fontSize: '1.6rem', margin: 0, fontWeight: 800, color: '#F8FAFC' }}>
            {isStudent ? '🎒 Live Classrooms & Study Pods' : 'Live Teacher Masterclasses & Pod Sessions'}
          </h2>
          <p style={{ color: 'var(--text-secondary)', margin: '4px 0 0 0', fontSize: '0.92rem' }}>
            {isStudent 
              ? 'Join live video lessons with your teacher, draw on the interactive whiteboard, and learn together!'
              : 'Fully integrated live virtual studio: interactive collaborative whiteboard, encrypted video tiles, student hand-raising & live chat.'}
          </p>
        </div>

        {/* Dropdown Filter */}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-subtle)', borderRadius: '10px', padding: '3px' }}>
            {[
              { id: 'ALL', label: `All (${bookings.length})` },
              { id: 'virtual', label: '💻 Virtual' },
              { id: 'in_person', label: '🏡 Home Visits' }
            ].map((fmt) => (
              <button
                key={fmt.id}
                onClick={() => setFormatFilter(fmt.id)}
                style={{
                  padding: '6px 10px',
                  borderRadius: '8px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                  background: formatFilter === fmt.id ? '#00A651' : 'transparent',
                  color: formatFilter === fmt.id ? '#FFF' : 'var(--text-muted)',
                  transition: 'all 0.15s ease'
                }}
              >
                {fmt.label}
              </button>
            ))}
          </div>

          <div>
            <select
              className="custom-select"
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
              style={{ minWidth: '150px', fontSize: '0.78rem' }}
            >
              <option value="ALL">All Subjects ({formatFiltered.length})</option>
              <option value="math">Mathematics</option>
              <option value="science">Science & Lab</option>
              <option value="languages">Languages & Phonics</option>
            </select>
          </div>
        </div>
      </div>

      {/* Sessions Grid or Live Connected Empty State */}
      {filteredSessions.length === 0 ? (
        <div
          className="glass-panel"
          style={{
            padding: '44px 28px',
            textAlign: 'center',
            borderRadius: '24px',
            border: '1.5px dashed rgba(255,255,255,0.12)',
            background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.6) 0%, rgba(11, 17, 30, 0.8) 100%)',
            maxWidth: '660px',
            margin: '20px auto'
          }}
        >
          <div
            style={{
              width: '68px',
              height: '68px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.2) 0%, rgba(16, 185, 129, 0.2) 100%)',
              border: '1.5px solid rgba(56, 189, 248, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 18px',
              fontSize: '1.8rem',
              boxShadow: '0 8px 24px rgba(56, 189, 248, 0.2)'
            }}
          >
            🎒
          </div>

          <h3 style={{ fontSize: '1.35rem', margin: '0 0 10px 0', color: '#F8FAFC', fontWeight: 800 }}>
            {isStudent 
              ? `No Live Classes Right Now, ${displayName}! 🌟` 
              : `No Live Classes Scheduled for ${displayName} Yet`}
          </h3>

          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.65, maxWidth: '520px', margin: '0 auto 24px' }}>
            {isStudent 
              ? `You don't have any live video lessons scheduled at this moment. When your teacher or parent schedules a live class, your join button and interactive whiteboard will appear right here!`
              : `When a parent books a verified specialist tutor in the Marketplace or a facilitator schedules a pod masterclass, your interactive virtual classroom link and whiteboard will appear here in real-time.`}
          </p>

          {/* Child-Friendly Exploration Shortcuts */}
          {isStudent && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center', marginTop: '12px' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#38BDF8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                While you wait, try these fun activities:
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
                {onGoToHome && (
                  <button
                    onClick={onGoToHome}
                    className="btn-primary"
                    style={{ fontSize: '0.82rem', padding: '9px 16px', gap: '6px', background: '#00A651', fontWeight: 700 }}
                  >
                    <Compass size={15} />
                    <span>Explore Today's Quests</span>
                  </button>
                )}

                {onGoToQuiz && (
                  <button
                    onClick={onGoToQuiz}
                    className="btn-secondary"
                    style={{ fontSize: '0.82rem', padding: '9px 16px', gap: '6px', color: '#F59E0B', borderColor: 'rgba(245, 158, 11, 0.4)' }}
                  >
                    <Gamepad2 size={15} />
                    <span>Play Quiz Arcade</span>
                  </button>
                )}

                {onGoToReading && (
                  <button
                    onClick={onGoToReading}
                    className="btn-secondary"
                    style={{ fontSize: '0.82rem', padding: '9px 16px', gap: '6px', color: '#38BDF8', borderColor: 'rgba(56, 189, 248, 0.4)' }}
                  >
                    <BookOpen size={15} />
                    <span>Story Reading Room</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {!isStudent && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <span className="glass-pill" style={{ fontSize: '0.76rem', color: '#10B981', border: '1px solid rgba(16,185,129,0.3)', padding: '6px 12px' }}>
                <ShieldCheck size={14} style={{ display: 'inline', marginRight: '4px' }} />
                TSC & DCI Verified Facilitators
              </span>
              <span className="glass-pill" style={{ fontSize: '0.76rem', color: '#F59E0B', border: '1px solid rgba(245,158,11,0.3)', padding: '6px 12px' }}>
                <Sparkles size={14} style={{ display: 'inline', marginRight: '4px' }} />
                1-on-1 & Small Pods
              </span>
            </div>
          )}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
          {filteredSessions.map((session) => (
            <div
              key={session.id}
              className="glass-panel"
              style={{
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                border: '1.5px solid #00A651',
                borderRadius: '18px',
                position: 'relative'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span
                    className="glass-pill"
                    style={{
                      fontSize: '0.75rem',
                      color: '#00A651',
                      border: '1px solid rgba(0,166,81,0.4)',
                      fontWeight: 700
                    }}
                  >
                    🔴 {session.status || 'CONFIRMED'}
                  </span>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    In-App Virtual Room (1-on-1 / Pod)
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '12px' }}>
                  <img
                    src={session.tutorAvatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80'}
                    alt={session.tutorName}
                    style={{ width: '48px', height: '48px', borderRadius: '12px', objectFit: 'cover', border: '1.5px solid rgba(16,185,129,0.4)' }}
                  />
                  <div>
                    <h3 style={{ fontSize: '1.15rem', margin: '0 0 2px 0', color: '#F8FAFC', fontWeight: 700 }}>
                      {session.focusSubject || 'Specialist Masterclass'}
                    </h3>
                    <div style={{ fontSize: '0.84rem', color: '#34D399', fontWeight: 600 }}>
                      Facilitator: {session.tutorName}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Calendar size={14} color="#F59E0B" />
                    <span>{session.date}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Clock size={14} color="#38BDF8" />
                    <span>{session.timeSlot}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                    <span>Learner: <strong>{session.studentName || displayName}</strong></span>
                    <span>• Receipt: {session.receipt || 'SKM-CONFIRMED'}</span>
                  </div>
                </div>
              </div>

                            <div style={{ paddingTop: '14px', borderTop: '1px solid var(--border-subtle)' }}>
                {session.sessionType === 'in_person' ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ background: 'rgba(0,166,81,0.08)', border: '1px solid rgba(0,166,81,0.25)', borderRadius: '8px', padding: '8px 10px', fontSize: '0.78rem', color: '#34D399' }}>
                      🏡 <strong>Home Visit Location:</strong> {session.estateAddress || 'Kilimani, Nairobi'}
                    </div>
                    <button
                      onClick={() => alert(`🏡 Confirmed Home Visit\n\nLearner: ${session.studentName || displayName}\nEducator: ${session.tutorName}\nDate & Time: ${session.date} • ${session.timeSlot}\nLocation: ${session.estateAddress || 'Home Address'}\nTopic: ${session.focusSubject}\nStatus: Confirmed & Paid via M-Pesa (${session.receipt || 'SKM-CONFIRMED'})`)}
                      className="btn-secondary"
                      style={{ width: '100%', justifyContent: 'center', gap: '6px', fontSize: '0.82rem', borderColor: 'rgba(0,166,81,0.4)', color: '#34D399' }}
                    >
                      <MapPin size={14} />
                      <span>View Home Visit Details</span>
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setSelectedLiveSession(session)}
                    className="btn-primary"
                    style={{ width: '100%', justifyContent: 'center', gap: '8px', background: '#10B981', color: '#022c22', fontWeight: 800 }}
                  >
                    <Video size={16} />
                    <span>Enter In-App Live Classroom Now</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Embedded Live Classroom Modal */}
      {selectedLiveSession && (
        <LiveClassroomModal
          isOpen={!!selectedLiveSession}
          onClose={() => setSelectedLiveSession(null)}
          session={selectedLiveSession}
          sessionTitle={selectedLiveSession.focusSubject || 'Live Masterclass'}
          teacherName={selectedLiveSession.tutorName}
          tutorAvatar={selectedLiveSession.tutorAvatar}
          studentName={selectedLiveSession.studentName || displayName}
        />
      )}
    </div>
  );
}
