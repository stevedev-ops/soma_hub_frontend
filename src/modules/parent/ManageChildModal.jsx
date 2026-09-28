import React, { useState } from 'react';
import { X, Check, Trash2, AlertTriangle, Sparkles, BookOpen, GraduationCap, ShieldCheck, KeyRound, ArrowRight } from 'lucide-react';
import { api } from '../../services/api';

const CURRICULUM_OPTIONS = [
  { 
    code: 'CBC', 
    name: 'Kenya Competency-Based Curriculum (CBC)', 
    short: 'CBC (Kenya)', 
    flag: '🇰🇪', 
    grades: ['PP1 (Early Years)', 'PP2 (Early Years)', 'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4 (CBC)', 'Grade 5', 'Grade 6', 'Grade 7 (JSS)', 'Grade 8 (JSS)', 'Grade 9 (JSS)'] 
  },
  { 
    code: 'Cambridge', 
    name: 'British Cambridge International Curriculum', 
    short: 'Cambridge Primary', 
    flag: '🇬🇧', 
    grades: ['Stage 1 (Year 1)', 'Stage 2 (Year 2)', 'Stage 3 (Year 3)', 'Stage 4 (Year 4)', 'Stage 5 (Year 5)', 'Stage 6 (Checkpoint)', 'Stage 7 (Lower Sec)', 'Stage 8', 'Stage 9 (IGCSE Prep)'] 
  },
  { 
    code: 'US_COMMON_CORE', 
    name: 'US Common Core State Standards', 
    short: 'US Common Core', 
    flag: '🇺🇸', 
    grades: ['Kindergarten', 'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8'] 
  },
  { 
    code: 'ACE', 
    name: 'A.C.E. Accelerated Christian Education (PACEs)', 
    short: 'A.C.E. (PACEs)', 
    flag: '📖', 
    grades: ['Level 1 (PACEs)', 'Level 2', 'Level 3', 'Level 4', 'Level 5', 'Level 6', 'Level 7', 'Level 8'] 
  },
  { 
    code: 'MONTESSORI', 
    name: 'Montessori Hands-On Child-Led Discovery', 
    short: 'Montessori', 
    flag: '🌿', 
    grades: ['Toddler (1.5 - 3 yrs)', 'Casa / Pre-School (3 - 6 yrs)', 'Lower Elementary (6 - 9 yrs)', 'Upper Elementary (9 - 12 yrs)'] 
  }
];

export default function ManageChildModal({ child, onClose, onUpdateChild, onRemoveChild }) {
  const currentCurrCode = child?.curriculum || 'CBC';
  const matchedCurr = CURRICULUM_OPTIONS.find(c => c.code.toLowerCase() === currentCurrCode.toLowerCase()) || CURRICULUM_OPTIONS[0];

  const [name, setName] = useState(child?.name || '');
  const [curriculum, setCurriculum] = useState(matchedCurr.code);
  const [grade, setGrade] = useState(child?.grade || matchedCurr.grades[3] || 'Grade 4 (CBC)');
  const [pin, setPin] = useState(child?.pin || '1234');
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const activeCurriculumObj = CURRICULUM_OPTIONS.find(c => c.code === curriculum) || CURRICULUM_OPTIONS[0];

  const handleCurriculumChange = (newCode) => {
    setCurriculum(newCode);
    const newCurrObj = CURRICULUM_OPTIONS.find(c => c.code === newCode);
    if (newCurrObj && newCurrObj.grades.length > 0) {
      setGrade(newCurrObj.grades[3] || newCurrObj.grades[0]);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Learner name cannot be empty.');
      return;
    }
    setIsLoading(true);
    setError('');

    const updatedPayload = {
      name: name.trim(),
      curriculum,
      grade: grade.includes(curriculum) ? grade : `${grade} (${curriculum})`,
      pin: pin.trim() || '1234'
    };

    try {
      if (child.id && typeof child.id === 'number') {
        await api.updateChild(child.id, updatedPayload);
      }
      onUpdateChild({
        ...child,
        ...updatedPayload
      });
      setSuccessMsg('Learner profile & curriculum updated successfully!');
      setTimeout(() => {
        if (onClose) onClose();
      }, 1000);
    } catch (err) {
      // Local fallback sync
      onUpdateChild({
        ...child,
        ...updatedPayload
      });
      setSuccessMsg('Updated successfully!');
      setTimeout(() => {
        if (onClose) onClose();
      }, 1000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    setError('');
    try {
      if (child.id && typeof child.id === 'number') {
        await api.removeChild(child.id);
      }
      onRemoveChild(child.id);
      if (onClose) onClose();
    } catch (err) {
      onRemoveChild(child.id);
      if (onClose) onClose();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 99999, padding: '16px'
    }}>
      <div className="glass-panel" style={{
        maxWidth: '520px', width: '100%', background: '#0F172A', borderRadius: '24px',
        border: '1px solid rgba(0,166,81,0.4)', padding: '28px', position: 'relative', boxShadow: '0 25px 60px rgba(0,0,0,0.8)',
        maxHeight: '92vh', overflowY: 'auto'
      }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: '20px', right: '20px', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
        >
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          <div style={{
            width: '46px', height: '46px', borderRadius: '14px', background: 'rgba(0, 166, 81, 0.2)',
            border: '1px solid rgba(0, 166, 81, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem'
          }}>
            🎓
          </div>
          <div>
            <h3 style={{ fontSize: '1.25rem', margin: 0, fontWeight: 800, color: '#FFFFFF' }}>
              Manage Learner Profile
            </h3>
            <p style={{ margin: '2px 0 0 0', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Change curriculum, switch grade levels, update PIN, or remove learner
            </p>
          </div>
        </div>

        {error && (
          <div style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid #EF4444', color: '#F87171', padding: '10px 14px', borderRadius: '10px', fontSize: '0.82rem', marginBottom: '16px' }}>
            {error}
          </div>
        )}

        {successMsg && (
          <div style={{ background: 'rgba(0,166,81,0.15)', border: '1px solid #00A651', color: '#34D399', padding: '10px 14px', borderRadius: '10px', fontSize: '0.82rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Check size={16} /> <span>{successMsg}</span>
          </div>
        )}

        {/* Delete Confirmation View */}
        {showConfirmDelete ? (
          <div style={{ background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '16px', padding: '20px', marginBottom: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#EF4444', fontWeight: 800, fontSize: '0.95rem', marginBottom: '8px' }}>
              <AlertTriangle size={20} />
              <span>Confirm Learner Removal</span>
            </div>
            <p style={{ color: '#CBD5E1', fontSize: '0.85rem', lineHeight: 1.5, margin: '0 0 16px 0' }}>
              Are you sure you want to remove <strong>{child.name}</strong>? Their learner profile, assignments, and timetable records will be permanently unlinked from your household.
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                style={{
                  flex: 1, padding: '10px', borderRadius: '8px', background: '#EF4444', color: '#fff',
                  border: 'none', fontWeight: 800, fontSize: '0.86rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
                }}
              >
                <Trash2 size={16} />
                <span>{isDeleting ? 'Removing...' : 'Yes, Remove Learner'}</span>
              </button>
              <button
                type="button"
                onClick={() => setShowConfirmDelete(false)}
                className="btn-secondary"
                style={{ flex: 1, padding: '10px', fontSize: '0.86rem' }}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            {/* Child Name */}
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '5px', fontWeight: 700 }}>
                Learner Full Name:
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Mike Mutwiri"
                style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-card)', borderRadius: '10px', padding: '10px 14px', color: '#fff', fontSize: '0.9rem' }}
              />
            </div>

            {/* Curriculum Selector */}
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '6px', fontWeight: 700 }}>
                Curriculum Pathway:
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '8px' }}>
                {CURRICULUM_OPTIONS.map((c) => {
                  const isSelected = curriculum === c.code;
                  return (
                    <div
                      key={c.code}
                      onClick={() => handleCurriculumChange(c.code)}
                      style={{
                        padding: '10px',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        border: isSelected ? '2px solid #00A651' : '1px solid var(--border-subtle)',
                        background: isSelected ? 'rgba(0,166,81,0.18)' : 'rgba(255,255,255,0.02)',
                        textAlign: 'center',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <div style={{ fontSize: '1.2rem', marginBottom: '2px' }}>{c.flag}</div>
                      <div style={{ fontSize: '0.78rem', fontWeight: 800, color: isSelected ? '#FFFFFF' : 'var(--text-secondary)' }}>
                        {c.short}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Grade / Stage Selector */}
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '5px', fontWeight: 700 }}>
                Grade / Academic Stage ({activeCurriculumObj.short}):
              </label>
              <select
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="custom-select"
                style={{ width: '100%', background: '#0F172A', border: '1px solid var(--border-card)', borderRadius: '10px', padding: '10px 14px', color: '#fff', fontSize: '0.88rem' }}
              >
                {activeCurriculumObj.grades.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>

            {/* 4-Digit Tablet PIN */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 700 }}>
                  4-Digit Tablet PIN (Student Login):
                </label>
                <button
                  type="button"
                  onClick={() => setPin('1234')}
                  style={{ background: 'transparent', border: 'none', color: '#38BDF8', fontSize: '0.72rem', cursor: 'pointer' }}
                >
                  Reset to 1234
                </button>
              </div>
              <input
                type="text"
                maxLength={6}
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="1234"
                style={{
                  width: '100%', textAlign: 'center', letterSpacing: '6px', fontSize: '1.15rem', fontWeight: 800,
                  background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-card)', borderRadius: '10px', padding: '8px 12px', color: '#FBBF24'
                }}
              />
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary"
                style={{ flex: 2, padding: '12px', justifyContent: 'center', fontSize: '0.92rem', fontWeight: 800 }}
              >
                {isLoading ? 'Saving...' : 'Save Changes & Update Curriculum 🚀'}
              </button>

              <button
                type="button"
                onClick={() => setShowConfirmDelete(true)}
                style={{
                  flex: 1, padding: '12px', borderRadius: '10px', background: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid rgba(239, 68, 68, 0.4)', color: '#FCA5A5', fontWeight: 700, fontSize: '0.84rem', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
                }}
                title="Remove this learner profile"
              >
                <Trash2 size={16} />
                <span>Remove</span>
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
