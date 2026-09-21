import React, { useState } from 'react';
import { UserPlus, X, CheckCircle, Sparkles, BookOpen } from 'lucide-react';

export default function AddChildModal({ isOpen, onClose, onChildAdded }) {
  if (!isOpen) return null;

  const [name, setName] = useState('');
  const [curriculum, setCurriculum] = useState('CBC');
  const [grade, setGrade] = useState('Grade 4 (CBC)');
  const [dob, setDob] = useState('2017-06-15');
  const [learningFocus, setLearningFocus] = useState('STEM & Hands-on Inquiry');
  const [avatar, setAvatar] = useState('https://images.unsplash.com/photo-1543332164-6e82f355badc?w=120&auto=format&fit=crop&q=80');
  const [isSuccess, setIsSuccess] = useState(false);

  const defaultAvatars = [
    { label: 'Boy 1', url: 'https://images.unsplash.com/photo-1543332164-6e82f355badc?w=120&auto=format&fit=crop&q=80' },
    { label: 'Girl 1', url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80' },
    { label: 'Boy 2', url: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=120&auto=format&fit=crop&q=80' },
    { label: 'Girl 2', url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=120&auto=format&fit=crop&q=80' },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newChild = {
      id: name.toLowerCase().replace(/\s+/g, '_') + '_' + Date.now().toString().slice(-4),
      name,
      curriculum,
      grade,
      dob,
      learningFocus,
      avatar
    };

    onChildAdded(newChild);
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '20px'
    }}>
      <div className="glass-panel animate-scale-up" style={{
        width: '100%',
        maxWidth: '520px',
        padding: '28px',
        borderRadius: '20px',
        position: 'relative',
        boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
        border: '1px solid rgba(0, 166, 81, 0.4)'
      }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '18px',
            right: '18px',
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer'
          }}
        >
          <X size={20} />
        </button>

        {isSuccess ? (
          <div style={{ textAlign: 'center', padding: '30px 0' }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: 'rgba(0, 166, 81, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px auto',
              color: '#00A651'
            }}>
              <CheckCircle size={32} />
            </div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, margin: '0 0 6px 0' }}>Learner Enrolled!</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              {name} has been enrolled in <strong>{grade}</strong>. Personalizing daily schedule...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'rgba(0, 166, 81, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <UserPlus size={20} color="#00A651" />
              </div>
              <div>
                <h3 style={{ fontSize: '1.25rem', margin: 0, fontWeight: 800 }}>Enroll New Learner</h3>
                <p style={{ margin: '2px 0 0 0', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  Add a child to switch and personalize their curriculum OS
                </p>
              </div>
            </div>

            {/* Child Avatar Selector */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, marginBottom: '8px' }}>
                Select Learner Avatar:
              </label>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                {defaultAvatars.map((item, idx) => (
                  <img
                    key={idx}
                    src={item.url}
                    alt={item.label}
                    onClick={() => setAvatar(item.url)}
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      cursor: 'pointer',
                      border: avatar === item.url ? '3px solid #00A651' : '2px solid var(--border-subtle)',
                      boxShadow: avatar === item.url ? '0 0 12px rgba(0, 166, 81, 0.4)' : 'none',
                      transform: avatar === item.url ? 'scale(1.08)' : 'scale(1)',
                      transition: 'all 0.15s ease'
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Name Input */}
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, marginBottom: '6px' }}>
                Child's Full Name:
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Ethan Kariuki or Zuri Kariuki"
                className="custom-select"
                style={{ width: '100%' }}
                required
              />
            </div>

            {/* Curriculum & Grade */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, marginBottom: '6px' }}>
                  Curriculum:
                </label>
                <select
                  value={curriculum}
                  onChange={(e) => {
                    const newCurr = e.target.value;
                    setCurriculum(newCurr);
                    if (newCurr === 'CBC') setGrade('Grade 4 (CBC)');
                    else if (newCurr === 'Cambridge') setGrade('Stage 4 (Cambridge)');
                    else if (newCurr === 'ACE') setGrade('Elementary PACEs (A.C.E.)');
                    else if (newCurr === 'US_COMMON_CORE') setGrade('Grade 5 (US Common Core)');
                    else if (newCurr === 'MONTESSORI') setGrade('Primary Casa 3-6 (Montessori)');
                  }}
                  className="custom-select"
                  style={{ width: '100%' }}
                >
                  <option value="CBC">🇰🇪 CBC (Kenya KICD)</option>
                  <option value="Cambridge">🇬🇧 Cambridge (CAIE)</option>
                  <option value="ACE">📖 A.C.E. Accelerated</option>
                  <option value="US_COMMON_CORE">🇺🇸 US Common Core & NGSS</option>
                  <option value="MONTESSORI">🌱 Montessori Casa</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, marginBottom: '6px' }}>
                  Grade / Level:
                </label>
                <select
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  className="custom-select"
                  style={{ width: '100%' }}
                >
                  {curriculum === 'CBC' && (
                    <>
                      <option value="PP1 (Pre-Primary 1)">PP1 (Pre-Primary 1)</option>
                      <option value="PP2 (Pre-Primary 2)">PP2 (Pre-Primary 2)</option>
                      <option value="Grade 1 (CBC)">Grade 1 (CBC)</option>
                      <option value="Grade 2 (CBC)">Grade 2 (CBC)</option>
                      <option value="Grade 3 (CBC)">Grade 3 (CBC)</option>
                      <option value="Grade 4 (CBC)">Grade 4 (CBC)</option>
                      <option value="Grade 5 (CBC)">Grade 5 (CBC)</option>
                      <option value="Grade 6 (CBC)">Grade 6 (CBC)</option>
                      <option value="Grade 7 (JSS)">Grade 7 (Junior Secondary JSS)</option>
                      <option value="Grade 8 (JSS)">Grade 8 (Junior Secondary JSS)</option>
                    </>
                  )}
                  {curriculum === 'Cambridge' && (
                    <>
                      <option value="Early Years (FS1/FS2)">Early Years (FS1/FS2)</option>
                      <option value="Stage 1 (Primary)">Stage 1 (Primary)</option>
                      <option value="Stage 2 (Primary)">Stage 2 (Primary)</option>
                      <option value="Stage 3 (Primary)">Stage 3 (Primary)</option>
                      <option value="Stage 4 (Primary)">Stage 4 (Primary)</option>
                      <option value="Stage 5 (Primary)">Stage 5 (Primary)</option>
                      <option value="Stage 6 (Primary)">Stage 6 (Primary)</option>
                      <option value="Stage 7 (Lower Secondary)">Stage 7 (Lower Secondary Checkpoint)</option>
                      <option value="Year 10 (IGCSE)">Year 10 (IGCSE)</option>
                    </>
                  )}
                  {curriculum === 'ACE' && (
                    <>
                      <option value="Kindergarten with Ace and Christi">Kindergarten with Ace</option>
                      <option value="Elementary PACEs (A.C.E.)">Elementary PACEs (1037-1048)</option>
                      <option value="Middle School PACEs">Middle School PACEs</option>
                    </>
                  )}
                  {curriculum === 'US_COMMON_CORE' && (
                    <>
                      <option value="Kindergarten (US)">Kindergarten (US)</option>
                      <option value="Grade 1 (US)">Grade 1 (US)</option>
                      <option value="Grade 3 (US)">Grade 3 (US)</option>
                      <option value="Grade 5 (US Common Core)">Grade 5 (US Common Core & STEM)</option>
                      <option value="Grade 8 (US Middle)">Grade 8 (US Middle)</option>
                    </>
                  )}
                  {curriculum === 'MONTESSORI' && (
                    <>
                      <option value="Toddler (Ages 18m-3y)">Toddler (Ages 18m-3y)</option>
                      <option value="Primary Casa 3-6 (Montessori)">Primary Casa 3-6 (Montessori)</option>
                      <option value="Lower Elementary (6-9y)">Lower Elementary (6-9y)</option>
                    </>
                  )}
                </select>
              </div>
            </div>

            {/* Date of Birth */}
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, marginBottom: '6px' }}>
                Date of Birth:
              </label>
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="custom-select"
                style={{ width: '100%' }}
                required
              />
            </div>

            {/* Learning Focus */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, marginBottom: '6px' }}>
                Primary Learning Strengths / Focus:
              </label>
              <input
                type="text"
                value={learningFocus}
                onChange={(e) => setLearningFocus(e.target.value)}
                placeholder="e.g. Visual Learner, Hands-on Science Lab, Storytelling"
                className="custom-select"
                style={{ width: '100%' }}
              />
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary"
                style={{ flex: 1, justifyContent: 'center' }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary"
                style={{ flex: 2, justifyContent: 'center', gap: '6px' }}
              >
                <UserPlus size={16} />
                <span>Add Learner to Homeschool</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
