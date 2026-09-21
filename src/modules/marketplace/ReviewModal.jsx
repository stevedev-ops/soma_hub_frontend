import React, { useState } from 'react';
import { X, Star, AlertTriangle, CheckCircle, ThumbsUp, Sparkles, MessageSquare } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function ReviewModal({
  isOpen,
  onClose,
  targetType = 'tutor', // 'tutor' | 'student' | 'lesson'
  targetTitle = 'Teacher Mercy Cherono',
  targetSubtitle = 'Grade 4 CBC Specialist',
  onSubmitReview
}) {
  const { user } = useAuth();
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [selectedTags, setSelectedTags] = useState(['🌟 Patient & Encouraging', '📐 CBC Math Master']);
  const [requestRemediation, setRequestRemediation] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const tutorTags = [
    '🌟 Patient & Encouraging',
    '📐 CBC Math Master',
    '🔬 Hands-on Science',
    '⏱️ Always Punctual',
    '💡 Clear Explanations',
    '📚 Provides Worksheets',
    '⚠️ Pacing Was Too Fast',
    '⚠️ Needed More Practice'
  ];

  const studentTags = [
    '🎯 Attentive & Eager to Learn',
    '📚 Homework Completed',
    '🔬 Inquisitive in Science',
    '💡 Grasped Fractions Quickly',
    '⚠️ Distracted During Session',
    '⚠️ Needs More Drill Practice'
  ];

  const availableTags = targetType === 'student' ? studentTags : tutorTags;

  const toggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newReview = {
      id: Date.now(),
      reviewer: user?.name || (user?.role === 'parent' ? 'Parent Steve' : 'Teacher Mercy'),
      role: user?.role || 'parent',
      rating,
      comment,
      tags: selectedTags,
      requestRemediation,
      createdAt: 'Just now'
    };

    if (onSubmitReview) {
      onSubmitReview(newReview);
    }
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1800);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(5, 10, 8, 0.85)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div className="glass-panel" style={{
        width: '100%',
        maxWidth: '520px',
        padding: '28px',
        position: 'relative',
        border: '1px solid rgba(245, 158, 11, 0.3)',
        borderRadius: '20px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)'
      }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'rgba(255,255,255,0.06)',
            border: 'none',
            borderRadius: '50%',
            width: '34px',
            height: '34px',
            color: 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
        >
          <X size={18} />
        </button>

        {submitted ? (
          <div style={{ textAlign: 'center', padding: '36px 12px' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'rgba(16, 185, 129, 0.15)',
              border: '2px solid #10B981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px'
            }}>
              <CheckCircle size={36} color="#10B981" />
            </div>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '8px' }}>Review & Star Rating Published!</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              {requestRemediation
                ? 'Your feedback and request for re-evaluation have been sent to academic support!'
                : 'Thank you for strengthening the Nairobi homeschool community feedback loop.'}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {/* Header */}
            <div style={{ marginBottom: '20px' }}>
              <span className="glass-pill" style={{ color: '#F59E0B', border: '1px solid rgba(245,158,11,0.3)', marginBottom: '8px', display: 'inline-block', fontSize: '0.72rem' }}>
                ⭐ Verified Community Review & Ratings
              </span>
              <h3 style={{ fontSize: '1.3rem', margin: 0, fontWeight: 800 }}>
                {targetType === 'student' ? 'Rate Student Engagement' : 'Leave a Verified Review'}
              </h3>
              <div style={{ fontSize: '0.85rem', color: '#38BDF8', marginTop: '2px' }}>
                {targetTitle} • <span style={{ color: 'var(--text-muted)' }}>{targetSubtitle}</span>
              </div>
            </div>

            {/* Star Rating Picker */}
            <div style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '14px',
              padding: '16px',
              textAlign: 'center',
              marginBottom: '18px'
            }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px' }}>
                Tap Stars to Rate
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                {[1, 2, 3, 4, 5].map((star) => {
                  const isFilled = (hoverRating || rating) >= star;
                  return (
                    <button
                      type="button"
                      key={star}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        transform: (hoverRating || rating) === star ? 'scale(1.2)' : 'scale(1)',
                        transition: 'transform 0.15s ease'
                      }}
                    >
                      <Star
                        size={32}
                        fill={isFilled ? '#F59E0B' : 'none'}
                        color={isFilled ? '#F59E0B' : 'var(--text-muted)'}
                      />
                    </button>
                  );
                })}
              </div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#F59E0B', marginTop: '8px' }}>
                {rating === 5 && '⭐⭐⭐⭐⭐ Exceptional (Highly Recommended!)'}
                {rating === 4 && '⭐⭐⭐⭐ Very Good (Smooth Session)'}
                {rating === 3 && '⭐⭐⭐ Average (Met Basic Objectives)'}
                {rating === 2 && '⭐⭐ Below Expectations (Needs Follow-up)'}
                {rating === 1 && '⭐ Poor Experience (Lesson Went Bad)'}
              </div>
            </div>

            {/* Quick Feedback Tags */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, marginBottom: '6px' }}>
                Select Key Highlights:
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {availableTags.map((tag) => {
                  const isSelected = selectedTags.includes(tag);
                  return (
                    <button
                      type="button"
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '20px',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        border: isSelected ? '1px solid #F59E0B' : '1px solid var(--border-subtle)',
                        background: isSelected ? 'rgba(245, 158, 11, 0.15)' : 'rgba(255, 255, 255, 0.02)',
                        color: isSelected ? '#FBBF24' : 'var(--text-secondary)',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Comment Area */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, marginBottom: '6px' }}>
                Detailed Feedback:
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience to help other parents and homeschoolers..."
                rows={3}
                className="custom-select"
                style={{ width: '100%', resize: 'none', height: '70px' }}
                required
              />
            </div>

            {/* If Lesson Went Bad (Rating <= 3) or requested */}
            {rating <= 3 && (
              <div style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '12px',
                padding: '12px 14px',
                marginBottom: '18px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#F87171', fontWeight: 700, fontSize: '0.85rem' }}>
                  <AlertTriangle size={16} />
                  <span>Did the session go poorly?</span>
                </div>
                <label style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginTop: '8px', cursor: 'pointer', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                  <input
                    type="checkbox"
                    checked={requestRemediation}
                    onChange={(e) => setRequestRemediation(e.target.checked)}
                    style={{ marginTop: '2px' }}
                  />
                  <span>
                    <strong>Request Academic Re-Evaluation & Free Booster:</strong> Alert SomaHome Academic Director to investigate and arrange a complimentary make-up session.
                  </span>
                </label>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="btn-gold"
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '0.92rem',
                fontWeight: 700,
                justifyContent: 'center',
                gap: '8px',
                borderRadius: '10px'
              }}
            >
              <Star size={16} fill="#050a08" />
              <span>Publish Review & Rating</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}