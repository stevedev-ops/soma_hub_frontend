import React, { useState } from 'react';
import SafetyGuaranteeModal from '../marketplace/SafetyGuaranteeModal';
import { 
  X, Calendar, Clock, Video, MapPin, ShieldCheck, User, 
  ExternalLink, Phone, ArrowRight, CheckCircle2, AlertCircle, Plus 
} from 'lucide-react';

export default function UpcomingSessionsModal({ 
  isOpen, 
  onClose, 
  bookings = [], 
  onOpenBookTutor,
  onJoinSession 
}) {
  if (!isOpen) return null;

  const [filter, setFilter] = useState('all'); // 'all' | 'virtual' | 'in_person'

  const filtered = bookings.filter(b => {
    if (filter === 'virtual') return b.sessionType === 'virtual';
    if (filter === 'in_person') return b.sessionType === 'in_person';
    return true;
  });

  return (
    <div 
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(5, 10, 15, 0.9)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '20px'
      }}
    >
      <div 
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '780px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: '24px',
          border: '1.5px solid rgba(245, 158, 11, 0.4)',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.9)',
          background: '#0E1524',
          overflow: 'hidden'
        }}
      >
        {/* Modal Header */}
        <div style={{
          padding: '24px 28px',
          background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(14, 21, 36, 0.95) 100%)',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <div className="glass-pill" style={{ color: '#F59E0B', border: '1px solid rgba(245, 158, 11, 0.3)', marginBottom: '6px', fontSize: '0.72rem' }}>
              <Calendar size={13} style={{ display: 'inline', marginRight: '4px' }} />
              <span>Verified Specialist Tutor Schedule</span>
            </div>
            <h2 style={{ fontSize: '1.4rem', margin: 0, fontWeight: 800, color: '#F8FAFC' }}>
              Upcoming Tutor Sessions ({bookings.length} Booked)
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.84rem', margin: '3px 0 0 0' }}>
              1-on-1 virtual classrooms and home visits scheduled for your learners
            </p>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: 'none',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              fontSize: '1.1rem'
            }}
          >
            ✕
          </button>
        </div>

        {/* Filter Bar */}
        <div style={{
          padding: '12px 28px',
          background: 'rgba(255,255,255,0.02)',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setFilter('all')}
              style={{
                background: filter === 'all' ? 'rgba(245, 158, 11, 0.2)' : 'transparent',
                border: filter === 'all' ? '1px solid #F59E0B' : '1px solid transparent',
                color: filter === 'all' ? '#F59E0B' : 'var(--text-secondary)',
                borderRadius: '8px', padding: '6px 12px', fontSize: '0.78rem', cursor: 'pointer', fontWeight: 600
              }}
            >
              All Sessions ({bookings.length})
            </button>
            <button
              onClick={() => setFilter('virtual')}
              style={{
                background: filter === 'virtual' ? 'rgba(245, 158, 11, 0.2)' : 'transparent',
                border: filter === 'virtual' ? '1px solid #F59E0B' : '1px solid transparent',
                color: filter === 'virtual' ? '#F59E0B' : 'var(--text-secondary)',
                borderRadius: '8px', padding: '6px 12px', fontSize: '0.78rem', cursor: 'pointer', fontWeight: 600
              }}
            >
              💻 Virtual ({bookings.filter(b => b.sessionType === 'virtual').length})
            </button>
            <button
              onClick={() => setFilter('in_person')}
              style={{
                background: filter === 'in_person' ? 'rgba(245, 158, 11, 0.2)' : 'transparent',
                border: filter === 'in_person' ? '1px solid #F59E0B' : '1px solid transparent',
                color: filter === 'in_person' ? '#F59E0B' : 'var(--text-secondary)',
                borderRadius: '8px', padding: '6px 12px', fontSize: '0.78rem', cursor: 'pointer', fontWeight: 600
              }}
            >
              🏡 Home Visits ({bookings.filter(b => b.sessionType === 'in_person').length})
            </button>
          </div>

          <span style={{ fontSize: '0.75rem', color: '#10B981', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <ShieldCheck size={14} />
            <span>M-Pesa Escrow Protected</span>
          </span>
        </div>

        {/* Sessions List */}
        <div style={{ padding: '24px 28px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
              <Calendar size={36} color="#64748B" style={{ margin: '0 auto 12px' }} />
              <div style={{ fontSize: '1rem', color: '#E2E8F0', fontWeight: 600 }}>No sessions found</div>
              <div style={{ fontSize: '0.84rem', marginTop: '4px' }}>Book a specialist tutor to get started.</div>
            </div>
          ) : (
            filtered.map((session, idx) => {
              const isVirtual = session.sessionType === 'virtual';
              const isFirst = idx === 0;

              return (
                <div
                  key={session.id || idx}
                  style={{
                    background: 'rgba(0,0,0,0.35)',
                    border: isFirst ? '1.5px solid rgba(245, 158, 11, 0.4)' : '1px solid var(--border-subtle)',
                    borderRadius: '16px',
                    padding: '20px',
                    position: 'relative',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {isFirst && (
                    <div style={{
                      position: 'absolute',
                      top: '-10px',
                      right: '20px',
                      background: 'linear-gradient(90deg, #F59E0B 0%, #D97706 100%)',
                      color: '#0F172A',
                      fontWeight: 800,
                      fontSize: '0.68rem',
                      padding: '2px 10px',
                      borderRadius: '999px',
                      boxShadow: '0 2px 8px rgba(245, 158, 11, 0.4)'
                    }}>
                      NEXT UPCOMING SESSION
                    </div>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
                    
                    {/* Tutor Profile & Info */}
                    <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                      <img
                        src={session.tutorAvatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200'}
                        alt={session.tutorName}
                        style={{
                          width: '56px',
                          height: '56px',
                          borderRadius: '14px',
                          objectFit: 'cover',
                          border: '2px solid rgba(245, 158, 11, 0.4)',
                          flexShrink: 0
                        }}
                      />
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#F8FAFC', fontWeight: 700 }}>
                            {session.tutorName}
                          </h3>
                          <span className="glass-pill" style={{ color: '#10B981', fontSize: '0.68rem', padding: '2px 8px' }}>
                            {session.status || 'Confirmed'}
                          </span>
                        </div>

                        <div style={{ fontSize: '0.88rem', color: '#38BDF8', fontWeight: 600, marginTop: '3px' }}>
                          {session.focusSubject}
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginTop: '8px', fontSize: '0.78rem', color: 'var(--text-muted)', flexWrap: 'wrap' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#F59E0B', fontWeight: 600 }}>
                            <Calendar size={13} />
                            <span>{session.date}</span>
                          </span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Clock size={13} />
                            <span>{session.timeSlot}</span>
                          </span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#E2E8F0' }}>
                            <User size={13} />
                            <span>Learner: <strong>{session.studentName?.split(' ')[0] || 'Liam'}</strong></span>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Format & Actions */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                      <span className="glass-pill" style={{
                        color: isVirtual ? '#38BDF8' : '#10B981',
                        border: isVirtual ? '1px solid rgba(56, 189, 248, 0.3)' : '1px solid rgba(16, 185, 129, 0.3)',
                        fontSize: '0.74rem'
                      }}>
                        {isVirtual ? '💻 Virtual Video Classroom' : `🏡 Home Visit (${session.estateAddress || 'Kilimani'})`}
                      </span>

                      <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                        Fee: <strong style={{ color: '#F8FAFC' }}>KES {session.amount ? Number(session.amount).toLocaleString() : '3,500'}</strong> (Receipt: {session.receipt || 'SKM849201'})
                      </div>

                      <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                        {isVirtual && onJoinSession && (
                          <button
                            onClick={() => onJoinSession(session)}
                            className="btn-primary"
                            style={{ fontSize: '0.78rem', padding: '6px 14px', background: '#10B981', color: '#022c22', fontWeight: 800 }}
                          >
                            <Video size={13} />
                            <span>Join Classroom</span>
                          </button>
                        )}
                        <button
                          onClick={() => setSelectedSessionDetail(session)}
                          title={`Confirmed with ${session.tutorName}`}
                          className="btn-secondary"
                          style={{ fontSize: '0.78rem', padding: '6px 12px' }}
                        >
                          Details & Notes
                        </button>
                      </div>
                    </div>

                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div style={{
          padding: '16px 28px',
          background: 'rgba(10, 14, 23, 0.95)',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            All bookings include certified MoE CBC syllabus alignment and secure escrow release.
          </span>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => {
                onClose();
                if (onOpenBookTutor) onOpenBookTutor();
              }}
              className="btn-primary"
              style={{ fontSize: '0.82rem', padding: '8px 18px', gap: '6px' }}
            >
              <Plus size={14} />
              <span>Book Another Specialist</span>
            </button>
            <button
              onClick={onClose}
              className="btn-secondary"
              style={{ fontSize: '0.82rem', padding: '8px 16px' }}
            >
              Close
            </button>
          </div>
        </div>

      </div>
      <SafetyGuaranteeModal isOpen={!!safetyTeacher} teacher={safetyTeacher} onClose={() => setSafetyTeacher(null)} />
    </div>
  );
}
