import React, { useState } from 'react';
import { 
  X, Send, CheckCircle2, Clock, Award, Star, FileText, 
  Upload, Sparkles, ShieldCheck, MessageSquare, AlertCircle 
} from 'lucide-react';
import { homeworkService } from '../../services/homeworkTelemetryStore';

export default function SubmitHomeworkModal({ isOpen, onClose, homework, onSubmitted }) {
  if (!isOpen || !homework) return null;

  const [solutionText, setSolutionText] = useState('');
  const [attachmentName, setAttachmentName] = useState('liam_handwritten_solution.jpg');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!solutionText.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      homeworkService.submit(homework.id, solutionText, attachmentName);
      setIsSubmitting(false);
      setSuccess(true);
      if (onSubmitted) onSubmitted(homework.id);
    }, 1200);
  };

  const isGraded = homework.status === 'graded';
  const isSubmitted = homework.status === 'submitted' || success;

  return (
    <div 
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
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
      <div style={{
        width: '100%',
        maxWidth: '680px',
        maxHeight: '90vh',
        overflowY: 'auto',
        borderRadius: '22px',
        background: '#0E1524',
        border: '1.5px solid rgba(16, 185, 129, 0.4)',
        boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.9)',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative'
      }}>
        {/* Header */}
        <div style={{
          padding: '24px',
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(14, 21, 36, 0.95) 100%)',
          borderBottom: '1px solid var(--border-subtle)',
          position: 'relative'
        }}>
          <button
            onClick={onClose}
            type="button"
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              background: 'rgba(255,255,255,0.08)',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              color: 'var(--text-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <X size={16} />
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span className="glass-pill" style={{ color: '#818CF8', fontSize: '0.7rem' }}>
              {homework.subject}
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>• Due: {homework.dueDate}</span>
          </div>

          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '2px 0 6px 0', color: '#F8FAFC' }}>
            {homework.title}
          </h2>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Assigned by: <strong style={{ color: '#34D399' }}>{homework.teacherName}</strong>
          </div>
        </div>

        {/* Content Body */}
        <div style={{ padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Instructions Box */}
          <div style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-subtle)', borderRadius: '14px', padding: '16px' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <FileText size={14} color="#10B981" />
              <span>Teacher's Instructions</span>
            </div>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#F8FAFC', lineHeight: 1.5 }}>
              {homework.instructions}
            </p>
          </div>

          {/* Graded View */}
          {isGraded && (
            <div style={{
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(14, 21, 36, 0.8) 100%)',
              border: '1.5px solid rgba(16, 185, 129, 0.4)',
              borderRadius: '16px',
              padding: '18px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#10B981', fontWeight: 800, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Award size={18} />
                  <span>Certified Teacher Score</span>
                </span>
                <span className="glass-pill" style={{ background: '#10B981', color: '#022c22', fontWeight: 800, fontSize: '0.85rem', padding: '4px 12px' }}>
                  {homework.grade}
                </span>
              </div>

              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                CBC Competency: <strong style={{ color: '#34D399' }}>{homework.rubricLevel}</strong>
              </div>

              <div style={{ background: 'rgba(0,0,0,0.4)', borderRadius: '10px', padding: '12px' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, marginBottom: '4px' }}>
                  Teacher Feedback from {homework.teacherName}:
                </div>
                <div style={{ fontSize: '0.82rem', color: '#F8FAFC', fontStyle: 'italic', lineHeight: 1.4 }}>
                  "{homework.feedback}"
                </div>
              </div>
            </div>
          )}

          {/* Submitted View Banner */}
          {isSubmitted && !isGraded && (
            <div style={{
              background: 'rgba(56, 189, 248, 0.1)',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              borderRadius: '14px',
              padding: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <CheckCircle2 size={24} color="#38BDF8" style={{ flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#38BDF8' }}>
                  Submitted to {homework.teacherName}!
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  Your answers have been dispatched to the teacher's grading desk.
                </div>
              </div>
            </div>
          )}

          {/* Previous Submission Text Display */}
          {(isSubmitted || isGraded) && homework.studentSubmission && (
            <div style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-subtle)', borderRadius: '14px', padding: '14px' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', marginBottom: '6px' }}>
                Your Submitted Solution:
              </div>
              <p style={{ margin: 0, fontSize: '0.84rem', color: '#F8FAFC', fontStyle: 'italic', lineHeight: 1.5, background: 'rgba(0,0,0,0.4)', padding: '10px 14px', borderRadius: '10px' }}>
                "{homework.studentSubmission.text}"
              </p>
            </div>
          )}

          {/* Active Submission Form */}
          {!isSubmitted && !isGraded && (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Your Solution & Calculations:
                </label>
                <textarea
                  value={solutionText}
                  onChange={(e) => setSolutionText(e.target.value)}
                  placeholder="Type your working steps, formulas, and final answers..."
                  rows={5}
                  required
                  style={{
                    width: '100%', background: 'rgba(0,0,0,0.5)', border: '1px solid var(--border-card)',
                    borderRadius: '12px', padding: '14px', color: '#F8FAFC', fontSize: '0.85rem',
                    fontFamily: 'var(--font-mono)', lineHeight: 1.5
                  }}
                />
              </div>

              {/* Upload Attachment Bar */}
              <div style={{
                padding: '10px 14px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-subtle)',
                borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem'
              }}>
                <span style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Upload size={14} color="#10B981" />
                  <span>Attach Handwritten Photo / Worksheet:</span>
                </span>
                <span className="glass-pill" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem' }}>
                  {attachmentName}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px' }}>
                <span style={{ fontSize: '0.75rem', color: '#F59E0B', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Sparkles size={14} />
                  <span>Earn <strong>+30 XP</strong> on submission</span>
                </span>

                <button
                  type="submit"
                  disabled={isSubmitting || !solutionText.trim()}
                  className="btn-primary"
                  style={{ fontSize: '0.85rem', padding: '10px 22px', gap: '8px' }}
                >
                  {isSubmitting ? (
                    <span>Submitting Work...</span>
                  ) : (
                    <>
                      <span>Submit to Teacher</span>
                      <Send size={14} />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

        </div>

        {/* Footer */}
        <div style={{
          padding: '14px 24px', background: 'rgba(8, 12, 20, 0.95)', borderTop: '1px solid var(--border-subtle)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem'
        }}>
          <span style={{ color: 'var(--text-muted)' }}>Submission ID: {homework.id}</span>
          <button
            onClick={onClose}
            className="btn-secondary"
            style={{ fontSize: '0.78rem', padding: '6px 16px' }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}