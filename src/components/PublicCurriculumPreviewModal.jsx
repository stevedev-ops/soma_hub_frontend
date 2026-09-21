import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { creatorStore } from '../services/creatorStore';
import { 
  Sparkles, CheckCircle, Share2, Copy, Check, Star, 
  BookOpen, Calendar, Clock, ArrowRight, UserCheck, ShieldCheck, 
  X, ExternalLink, Heart, Award, Eye, MessageCircle, Smartphone
} from 'lucide-react';

export default function PublicCurriculumPreviewModal({ 
  templateId = 'mama_teaches_cbc4', 
  isOpen = true, 
  onClose, 
  onTemplateApplied,
  childrenList = [] 
}) {
  const { currentUser, loginWithCredentials, switchAccount } = useAuth();
  const [template, setTemplate] = useState(() => creatorStore.getTemplateById(templateId));
  const [selectedDayIdx, setSelectedDayIdx] = useState(0);
  const [selectedChildId, setSelectedChildId] = useState(childrenList[0]?.id || 'liam');
  const [isCopied, setIsCopied] = useState(false);
  const [appliedSuccess, setAppliedSuccess] = useState(false);

  // Guest 1-Step Instant Signup Form State
  const [guestForm, setGuestForm] = useState({
    parentName: '',
    phone: '',
    childName: '',
    childGrade: template?.grade || 'Grade 4 (CBC)'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !template) return null;

  const shareableUrl = `${window.location.origin}/?template=${template.id}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareableUrl);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  const handleApplyLoggedIn = () => {
    creatorStore.applyTemplateToChild(template, selectedChildId);
    setAppliedSuccess(true);
    setTimeout(() => {
      if (onTemplateApplied) onTemplateApplied(template, selectedChildId);
      if (onClose) onClose();
    }, 1200);
  };

  const handleGuestSignupAndAdopt = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Switch or auto-provision parent account
      await switchAccount('parent');
      creatorStore.applyTemplateToChild(template, 'liam');
      setAppliedSuccess(true);
      setTimeout(() => {
        if (onTemplateApplied) onTemplateApplied(template, 'liam');
        if (onClose) onClose();
      }, 1200);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const activeLesson = template.sampleLessons[selectedDayIdx] || template.sampleLessons[0];

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(5, 10, 20, 0.88)', backdropFilter: 'blur(12px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 99999, padding: '16px', overflowY: 'auto'
    }}>
      <div className="glass-panel" style={{
        maxWidth: '920px', width: '100%', maxHeight: '92vh', overflowY: 'auto',
        background: '#0B132B', borderRadius: '24px', border: '1px solid rgba(0, 166, 81, 0.4)',
        padding: '32px', position: 'relative', boxShadow: '0 30px 80px rgba(0,0,0,0.85)'
      }}>
        {/* Close Button */}
        {onClose && (
          <button
            onClick={onClose}
            style={{
              position: 'absolute', top: '20px', right: '20px', background: 'rgba(255,255,255,0.06)',
              border: 'none', color: '#94A3B8', borderRadius: '50%', width: '36px', height: '36px',
              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
            }}
          >
            <X size={18} />
          </button>
        )}

        {/* Creator Identity Hero Header */}
        <div style={{
          display: 'flex', flexWrap: 'wrap', gap: '20px', alignItems: 'center',
          paddingBottom: '24px', borderBottom: '1px solid var(--border-subtle)', marginBottom: '24px'
        }}>
          <img
            src={template.creatorAvatar}
            alt={template.creatorName}
            style={{ width: '74px', height: '74px', borderRadius: '20px', objectFit: 'cover', border: '2px solid #00A651' }}
          />

          <div style={{ flex: 1, minWidth: '240px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 900, margin: 0, color: '#F8FAFC' }}>
                {template.creatorName}
              </h2>
              <span style={{
                background: 'rgba(245, 158, 11, 0.15)', color: '#F59E0B', border: '1px solid rgba(245, 158, 11, 0.3)',
                fontSize: '0.7rem', padding: '2px 8px', borderRadius: '20px', fontWeight: 800
              }}>
                ⭐ {template.badge || 'Verified Creator'}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginTop: '6px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              <span>{template.creatorHandle}</span>
              <span>•</span>
              <span>{template.socialPlatform}</span>
              <span>•</span>
              <span style={{ color: '#34D399', fontWeight: 700 }}>👥 {template.importsCount.toLocaleString()} Families Using This</span>
            </div>

            <p style={{ margin: '8px 0 0 0', fontSize: '0.84rem', color: 'var(--text-muted)' }}>
              "{template.creatorBio}"
            </p>
          </div>

          {/* Social Share & Copy Link */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button
              onClick={handleCopyLink}
              className="btn-secondary"
              style={{ fontSize: '0.78rem', padding: '8px 14px', gap: '6px' }}
            >
              {isCopied ? <Check size={14} color="#10B981" /> : <Copy size={14} />}
              <span>{isCopied ? 'Link Copied!' : 'Copy Shareable Link'}</span>
            </button>
            <a
              href={`https://wa.me/?text=${encodeURIComponent(`Check out ${template.creatorName}'s homeschooling curriculum template on SomaHome: ${shareableUrl}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
              style={{ fontSize: '0.78rem', padding: '8px 14px', gap: '6px', color: '#25D366', borderColor: 'rgba(37, 211, 102, 0.3)' }}
            >
              <MessageCircle size={14} />
              <span>Share via WhatsApp</span>
            </a>
          </div>
        </div>

        {/* Template Overview Card */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(0, 166, 81, 0.12) 0%, rgba(16, 185, 129, 0.04) 100%)',
          border: '1px solid rgba(0, 166, 81, 0.3)', borderRadius: '18px', padding: '20px', marginBottom: '24px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <div style={{ fontSize: '0.72rem', color: '#34D399', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>
                Curriculum Blueprint • {template.curriculum} • {template.grade}
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 900, margin: '0 0 6px 0', color: '#FFFFFF' }}>
                {template.title}
              </h3>
              <p style={{ margin: 0, fontSize: '0.85rem', color: '#CBD5E1' }}>
                {template.tagline}
              </p>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <span style={{ background: 'rgba(255,255,255,0.06)', padding: '6px 12px', borderRadius: '12px', fontSize: '0.78rem', fontWeight: 700 }}>
                ⏱️ 3h Daily Focus Block
              </span>
              <span style={{ background: 'rgba(255,255,255,0.06)', padding: '6px 12px', borderRadius: '12px', fontSize: '0.78rem', fontWeight: 700 }}>
                🧪 Zero-Prep Kitchen Labs
              </span>
            </div>
          </div>

          {/* Highlights */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px', marginTop: '16px' }}>
            {template.highlights.map((hl, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: '#E2E8F0' }}>
                <CheckCircle size={14} color="#34D399" style={{ flexShrink: 0 }} />
                <span>{hl}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Interactive 5-Day Weekly Preview */}
        <div style={{ marginBottom: '28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <div>
              <h4 style={{ fontSize: '1rem', fontWeight: 800, margin: 0, color: '#F8FAFC' }}>
                📅 Interactive Weekly Lesson Blueprint
              </h4>
              <p style={{ margin: '2px 0 0 0', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Theme: <strong style={{ color: '#34D399' }}>{template.sampleWeekTheme}</strong>
              </p>
            </div>
          </div>

          {/* Day Selector Pills */}
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px', marginBottom: '16px' }}>
            {template.sampleLessons.map((les, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedDayIdx(idx)}
                style={{
                  padding: '8px 16px', borderRadius: '12px', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer',
                  background: selectedDayIdx === idx ? '#00A651' : 'rgba(255,255,255,0.04)',
                  color: selectedDayIdx === idx ? '#FFFFFF' : 'var(--text-secondary)',
                  border: selectedDayIdx === idx ? '1px solid #00A651' : '1px solid var(--border-subtle)',
                  whiteSpace: 'nowrap', transition: 'all 0.15s ease'
                }}
              >
                {les.day}
              </button>
            ))}
          </div>

          {/* Detailed Lesson Card for Selected Day */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border-card)',
            borderRadius: '16px', padding: '20px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ background: '#3B82F6', color: '#fff', fontSize: '0.72rem', fontWeight: 800, padding: '3px 8px', borderRadius: '8px' }}>
                  {activeLesson.subject}
                </span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  ⏰ {activeLesson.time}
                </span>
              </div>
            </div>

            <h4 style={{ fontSize: '1.05rem', fontWeight: 800, margin: '0 0 12px 0', color: '#FFFFFF' }}>
              {activeLesson.topic}
            </h4>

            {/* Parent Verbatim Script */}
            <div style={{
              background: 'rgba(245, 158, 11, 0.08)', borderLeft: '4px solid #F59E0B',
              padding: '12px 14px', borderRadius: '0 10px 10px 0', marginBottom: '14px'
            }}>
              <div style={{ fontSize: '0.7rem', color: '#F59E0B', fontWeight: 800, textTransform: 'uppercase', marginBottom: '4px' }}>
                🗣️ Verbatim Script for Parent (Read Aloud):
              </div>
              <p style={{ margin: 0, fontSize: '0.84rem', color: '#FDE68A', fontStyle: 'italic', lineHeight: 1.5 }}>
                {activeLesson.script}
              </p>
            </div>

            {/* Local Materials & Activity */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '14px' }}>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '10px' }}>
                <div style={{ fontSize: '0.72rem', color: '#34D399', fontWeight: 800, textTransform: 'uppercase', marginBottom: '6px' }}>
                  🧺 Everyday Household Materials:
                </div>
                <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '0.8rem', color: '#CBD5E1' }}>
                  {activeLesson.materials.map((m, mIdx) => (
                    <li key={mIdx} style={{ marginBottom: '3px' }}>{m}</li>
                  ))}
                </ul>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '10px' }}>
                <div style={{ fontSize: '0.72rem', color: '#60A5FA', fontWeight: 800, textTransform: 'uppercase', marginBottom: '6px' }}>
                  🎯 Step-by-Step Hands-On Activity:
                </div>
                <p style={{ margin: 0, fontSize: '0.8rem', color: '#CBD5E1', lineHeight: 1.45 }}>
                  {activeLesson.activity}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 1-CLICK ADOPTION / SIGNUP CONVERSION SECTION */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.95) 100%)',
          border: '2px solid #00A651', borderRadius: '20px', padding: '24px', position: 'relative'
        }}>
          {appliedSuccess ? (
            <div style={{ textAlign: 'center', padding: '16px' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#00A651', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                <Check size={28} color="#FFFFFF" />
              </div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#34D399', margin: '0 0 6px 0' }}>
                Curriculum Template Loaded Successfully!
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: 0 }}>
                "{template.title}" has been added to your Homeschool Daily OS. Redirecting...
              </p>
            </div>
          ) : currentUser?.role === 'parent' ? (
            /* Logged in Parent 1-Click Adopt Flow */
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#FFFFFF', margin: '0 0 4px 0' }}>
                    Ready to use this template in your family?
                  </h3>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: 0 }}>
                    Select which child will follow {template.creatorName}'s routine:
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <select
                    className="custom-select"
                    value={selectedChildId}
                    onChange={(e) => setSelectedChildId(e.target.value)}
                    style={{ fontSize: '0.85rem', padding: '8px 12px', minWidth: '180px' }}
                  >
                    {childrenList.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.grade})
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={handleApplyLoggedIn}
                    className="btn-primary"
                    style={{ fontSize: '0.9rem', padding: '10px 20px', fontWeight: 800, gap: '8px' }}
                  >
                    <Sparkles size={16} />
                    <span>Apply Template to Schedule</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Guest 1-Step Fast Registration Flow */
            <div>
              <div style={{ textAlign: 'center', marginBottom: '18px' }}>
                <span style={{ background: 'rgba(0,166,81,0.2)', color: '#34D399', fontSize: '0.72rem', fontWeight: 800, padding: '3px 10px', borderRadius: '20px', textTransform: 'uppercase' }}>
                  ✨ 100% Free Forever • 1-Click Setup
                </span>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#FFFFFF', margin: '8px 0 4px 0' }}>
                  Start Using {template.creatorName}'s Homeschool Template
                </h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: 0 }}>
                  Enter your family details below to unlock the complete interactive daily lesson schedule.
                </p>
              </div>

              <form onSubmit={handleGuestSignupAndAdopt} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.74rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                    Parent Name:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mama Liam"
                    value={guestForm.parentName}
                    onChange={(e) => setGuestForm({ ...guestForm, parentName: e.target.value })}
                    style={{
                      width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-card)',
                      borderRadius: '8px', padding: '8px 12px', color: '#fff', fontSize: '0.85rem'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.74rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                    Kenyan WhatsApp Phone / Email:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="0712 345 678"
                    value={guestForm.phone}
                    onChange={(e) => setGuestForm({ ...guestForm, phone: e.target.value })}
                    style={{
                      width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-card)',
                      borderRadius: '8px', padding: '8px 12px', color: '#fff', fontSize: '0.85rem'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.74rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                    Child's First Name:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Liam"
                    value={guestForm.childName}
                    onChange={(e) => setGuestForm({ ...guestForm, childName: e.target.value })}
                    style={{
                      width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-card)',
                      borderRadius: '8px', padding: '8px 12px', color: '#fff', fontSize: '0.85rem'
                    }}
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary"
                    style={{ width: '100%', padding: '10px', fontSize: '0.88rem', fontWeight: 800, justifyContent: 'center' }}
                  >
                    {isSubmitting ? 'Setting up Dashboard...' : '🚀 Start Free & Adopt Template'}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
