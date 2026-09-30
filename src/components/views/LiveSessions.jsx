import React, { useState, useEffect } from 'react';
import { Video, Calendar, Clock, PlayCircle, ShieldCheck, Users, Sparkles, AlertCircle, BookOpen, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { bookingsService } from '../../services/homeworkTelemetryStore';
import LiveClassroomModal from '../../modules/learning/LiveClassroomModal';

export default function LiveSessions({ onGoToHome }) {
  const { currentUser } = useAuth();
  const [subjectFilter, setSubjectFilter] = useState('ALL');
  const [selectedLiveSession, setSelectedLiveSession] = useState(null);

  const isStudent = currentUser?.role === 'student';
  const isTeacher = currentUser?.role === 'tutor' || currentUser?.role === 'teacher';
  const studentName = currentUser?.name || '';

  // Load real sessions from reactive bookings store
  const [bookings, setBookings] = useState(() => {
    if (isStudent) {
      return bookingsService.getForStudent(studentName);
    } else if (isTeacher) {
      return bookingsService.getForTeacher(currentUser?.name || '');
    }
    return bookingsService.getAll();
  });

  useEffect(() => {
    const handleUpdate = () => {
      if (isStudent) {
        setBookings(bookingsService.getForStudent(currentUser?.name || ''));
      } else if (isTeacher) {
        setBookings(bookingsService.getForTeacher(currentUser?.name || ''));
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
  }, [currentUser?.name, isStudent, isTeacher]);

  // Filter for virtual video classroom sessions
  const virtualSessions = bookings.filter(b => b.sessionType === 'virtual' || !b.sessionType);

  const filteredSessions = subjectFilter === 'ALL'
    ? virtualSessions
    : virtualSessions.filter((s) => (s.focusSubject || s.tutorSubject || '').toLowerCase().includes(subjectFilter.toLowerCase()));

  const displayName = currentUser?.name ? currentUser.name.split(' ')[0] : 'Learner';

  return (
    <div>
      {/* Header & Filter */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '28px', flexWrap: 'wrap', gap: '20px' }}>
        <div>
          <span className="glass-pill" style={{ color: '#EF4444', border: '1px solid rgba(239,68,68,0.3)', marginBottom: '8px', display: 'inline-block' }}>
            🔴 Outschool-Style Embedded Live Virtual Classroom
          </span>
          <h2 style={{ fontSize: '1.6rem', margin: 0, fontWeight: 800 }}>
            Live Teacher Masterclasses & Pod Sessions
          </h2>
          <p style={{ color: 'var(--text-secondary)', margin: '4px 0 0 0', fontSize: '0.92rem' }}>
            Fully integrated live virtual studio: interactive collaborative whiteboard, encrypted video tiles, student hand-raising & live chat.
          </p>
        </div>

        {/* Dropdown Filter */}
        {virtualSessions.length > 0 && (
          <div>
            <label style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>
              Filter Subject:
            </label>
            <select
              className="custom-select"
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
              style={{ minWidth: '180px' }}
            >
              <option value="ALL">All Subjects ({virtualSessions.length})</option>
              <option value="math">Mathematics</option>
              <option value="science">Science & Lab</option>
              <option value="languages">Languages & Phonics</option>
            </select>
          </div>
        )}
      </div>

      {/* Sessions Grid or Live Connected Empty State */}
      {filteredSessions.length === 0 ? (
        <div
          className="glass-panel"
          style={{
            padding: '48px 24px',
            textAlign: 'center',
            borderRadius: '20px',
            border: '1.5px dashed rgba(255,255,255,0.12)',
            background: 'rgba(15, 23, 42, 0.4)',
            maxWidth: '680px',
            margin: '20px auto'
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'rgba(56, 189, 248, 0.12)',
              border: '1.5px solid rgba(56, 189, 248, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 18px',
              color: '#38BDF8'
            }}
          >
            <Video size={28} />
          </div>

          <h3 style={{ fontSize: '1.3rem', margin: '0 0 8px 0', color: '#F8FAFC', fontWeight: 700 }}>
            No Live Classes Scheduled for {displayName} Yet
          </h3>

          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6, maxWidth: '520px', margin: '0 auto 24px' }}>
            When a parent books a verified specialist tutor in the Marketplace or a facilitator schedules a pod masterclass, your interactive virtual classroom link and whiteboard will appear here in real-time.
          </p>

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

              <div style={{ paddingTop: '16px', borderTop: '1px solid var(--border-subtle)' }}>
                <button
                  onClick={() => setSelectedLiveSession(session)}
                  className="btn-primary"
                  style={{ width: '100%', justifyContent: 'center', gap: '8px', background: '#10B981', color: '#022c22', fontWeight: 800 }}
                >
                  <Video size={16} />
                  <span>Enter In-App Live Classroom Now</span>
                </button>
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
