import React, { useState } from 'react';
import { 
  X, FileText, CheckCircle2, Clock, Calendar, User, 
  Award, Eye, AlertCircle, Sparkles, Filter 
} from 'lucide-react';

export default function TutorHomeworkOverviewModal({ 
  isOpen, 
  onClose, 
  homeworkList = [], 
  onInspectHomework 
}) {
  if (!isOpen) return null;

  const [filter, setFilter] = useState('all'); // 'all' | 'marked' | 'active'

  const markedCount = homeworkList.filter(h => h.status === 'graded').length;
  const activeCount = homeworkList.filter(h => h.status !== 'graded').length;

  const filtered = homeworkList.filter(h => {
    if (filter === 'marked') return h.status === 'graded';
    if (filter === 'active') return h.status !== 'graded';
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
          maxWidth: '840px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: '24px',
          border: '1.5px solid rgba(129, 140, 248, 0.4)',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.9)',
          background: '#0E1524',
          overflow: 'hidden'
        }}
      >
        {/* Modal Header */}
        <div style={{
          padding: '24px 28px',
          background: 'linear-gradient(135deg, rgba(129, 140, 248, 0.18) 0%, rgba(14, 21, 36, 0.95) 100%)',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <div className="glass-pill" style={{ color: '#818CF8', border: '1px solid rgba(129, 140, 248, 0.3)', marginBottom: '6px', fontSize: '0.72rem' }}>
              <FileText size={13} style={{ display: 'inline', marginRight: '4px' }} />
              <span>Specialist Tutor Assignment Desk</span>
            </div>
            <h2 style={{ fontSize: '1.4rem', margin: 0, fontWeight: 800, color: '#F8FAFC' }}>
              Tutor Homework Overview ({homeworkList.length} Total)
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.84rem', margin: '3px 0 0 0' }}>
              Parent oversight loop: <strong>{markedCount} Marked & Certified</strong> • <strong>{activeCount} Active / In Progress</strong>
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

        {/* Filter Tabs */}
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
                background: filter === 'all' ? 'rgba(129, 140, 248, 0.2)' : 'transparent',
                border: filter === 'all' ? '1px solid #818CF8' : '1px solid transparent',
                color: filter === 'all' ? '#818CF8' : 'var(--text-secondary)',
                borderRadius: '8px', padding: '6px 12px', fontSize: '0.78rem', cursor: 'pointer', fontWeight: 600
              }}
            >
              All Homework ({homeworkList.length})
            </button>
            <button
              onClick={() => setFilter('active')}
              style={{
                background: filter === 'active' ? 'rgba(56, 189, 248, 0.2)' : 'transparent',
                border: filter === 'active' ? '1px solid #38BDF8' : '1px solid transparent',
                color: filter === 'active' ? '#38BDF8' : 'var(--text-secondary)',
                borderRadius: '8px', padding: '6px 12px', fontSize: '0.78rem', cursor: 'pointer', fontWeight: 600
              }}
            >
              ⏳ Active / In Progress ({activeCount})
            </button>
            <button
              onClick={() => setFilter('marked')}
              style={{
                background: filter === 'marked' ? 'rgba(16, 185, 129, 0.2)' : 'transparent',
                border: filter === 'marked' ? '1px solid #10B981' : '1px solid transparent',
                color: filter === 'marked' ? '#10B981' : 'var(--text-secondary)',
                borderRadius: '8px', padding: '6px 12px', fontSize: '0.78rem', cursor: 'pointer', fontWeight: 600
              }}
            >
              ✅ Marked & Certified ({markedCount})
            </button>
          </div>

          <span style={{ fontSize: '0.75rem', color: '#818CF8', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Award size={14} />
            <span>CBC Rubric Verified</span>
          </span>
        </div>

        {/* Homework Items List */}
        <div style={{ padding: '24px 28px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filtered.map(hw => {
            const isGraded = hw.status === 'graded';
            const isSubmitted = hw.status === 'submitted';

            return (
              <div
                key={hw.id}
                style={{
                  background: 'rgba(0,0,0,0.35)',
                  border: isGraded 
                    ? '1px solid rgba(16, 185, 129, 0.4)' 
                    : (isSubmitted ? '1px solid rgba(56, 189, 248, 0.4)' : '1px solid var(--border-subtle)'),
                  borderRadius: '16px',
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span className="glass-pill" style={{ fontSize: '0.7rem', color: '#818CF8' }}>
                        {hw.subject} • {hw.curriculum}
                      </span>
                      <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                        ID: {hw.id}
                      </span>
                    </div>

                    <h3 style={{ margin: '2px 0 0 0', fontSize: '1.1rem', color: '#F8FAFC', fontWeight: 700 }}>
                      {hw.title}
                    </h3>
                  </div>

                  {/* Status Badge */}
                  <div>
                    {isGraded ? (
                      <span className="glass-pill badge-cbc" style={{ color: '#10B981', border: '1px solid rgba(16,185,129,0.4)', background: 'rgba(16,185,129,0.15)', fontWeight: 800, fontSize: '0.78rem' }}>
                        <CheckCircle2 size={13} style={{ display: 'inline', marginRight: '4px' }} />
                        Certified: {hw.grade} ({hw.rubricLevel?.split('-')[0]?.trim() || 'Level 4'})
                      </span>
                    ) : isSubmitted ? (
                      <span className="glass-pill" style={{ color: '#38BDF8', border: '1px solid rgba(56,189,248,0.4)', background: 'rgba(56,189,248,0.15)', fontWeight: 700, fontSize: '0.78rem' }}>
                        <Clock size={13} style={{ display: 'inline', marginRight: '4px' }} />
                        Submitted • Awaiting Teacher Marking
                      </span>
                    ) : (
                      <span className="glass-pill" style={{ color: '#F59E0B', border: '1px solid rgba(245,158,11,0.4)', background: 'rgba(245,158,11,0.15)', fontWeight: 700, fontSize: '0.78rem' }}>
                        <Calendar size={13} style={{ display: 'inline', marginRight: '4px' }} />
                        Assigned • Due: {hw.dueDate}
                      </span>
                    )}
                  </div>
                </div>

                {/* Teacher Info & Instructions */}
                <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid var(--border-card)', padding: '14px', fontSize: '0.82rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    <img src={hw.teacherAvatar} alt={hw.teacherName} style={{ width: '22px', height: '22px', borderRadius: '50%', objectFit: 'cover' }} />
                    <span>Assigned by: <strong style={{ color: '#F8FAFC' }}>{hw.teacherName}</strong></span>
                    <span>•</span>
                    <span>Learner: <strong style={{ color: '#38BDF8' }}>{hw.studentName}</strong></span>
                    <span>•</span>
                    <span>Due: <strong style={{ color: '#F59E0B' }}>{hw.dueDate}</strong></span>
                  </div>

                  <div style={{ color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                    <strong style={{ color: '#E2E8F0' }}>Prompt:</strong> {hw.instructions}
                  </div>
                </div>

                {/* Submission or Teacher Feedback Card */}
                {isGraded && (
                  <div style={{ background: 'rgba(16, 185, 129, 0.08)', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '14px' }}>
                    <div style={{ fontSize: '0.76rem', color: '#10B981', fontWeight: 800, marginBottom: '4px' }}>
                      Certified Feedback from {hw.teacherName} ({hw.markedAt}):
                    </div>
                    <div style={{ fontSize: '0.82rem', color: '#E2E8F0', fontStyle: 'italic', lineHeight: 1.4 }}>
                      "{hw.feedback}"
                    </div>
                  </div>
                )}

                {isSubmitted && !isGraded && (
                  <div style={{ background: 'rgba(56, 189, 248, 0.08)', borderRadius: '12px', border: '1px solid rgba(56, 189, 248, 0.25)', padding: '12px', fontSize: '0.8rem', color: '#38BDF8' }}>
                    <strong>Student Solution Submitted ({hw.studentSubmission?.submittedAt}):</strong> {hw.studentSubmission?.text?.slice(0, 110)}...
                  </div>
                )}

                {/* Footer Action */}
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button
                    onClick={() => {
                      onClose();
                      if (onInspectHomework) onInspectHomework(hw);
                    }}
                    className="btn-secondary"
                    style={{ fontSize: '0.78rem', padding: '6px 14px', gap: '6px' }}
                  >
                    <Eye size={13} />
                    <span>{isGraded ? 'Inspect Graded Solution & Rubric' : (isSubmitted ? 'Inspect Pending Submission' : 'View Instructions')}</span>
                  </button>
                </div>

              </div>
            );
          })}
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
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            All certified homework grades automatically sync with the Official Kenya MoE CBC Report Card.
          </span>

          <button
            onClick={onClose}
            className="btn-secondary"
            style={{ fontSize: '0.82rem', padding: '8px 20px' }}
          >
            Close Overview
          </button>
        </div>

      </div>
    </div>
  );
}
