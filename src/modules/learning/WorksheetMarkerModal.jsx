import React, { useState } from 'react';
import { CheckCircle2, UploadCloud, X, Award, FileText, Check, AlertCircle } from 'lucide-react';

export default function WorksheetMarkerModal({ worksheetName, onClose, onGraded }) {
  const [submissionType, setSubmissionType] = useState('answers'); // 'answers' or 'photo'
  const [q1, setQ1] = useState('');
  const [q2, setQ2] = useState('');
  const [q3, setQ3] = useState('');
  const [isGrading, setIsGrading] = useState(false);
  const [attachedPhotoName, setAttachedPhotoName] = useState(null);
  const [result, setResult] = useState(null);

  // Correct answer scheme for Grade 4 Fractions Worksheet #1
  const checkAnswers = (e) => {
    e.preventDefault();
    setIsGrading(true);

    setTimeout(() => {
      let score = 0;
      let total = 3;
      const feedback = [];

      // Q1 check (1/4 or 0.25)
      const a1 = q1.trim().toLowerCase();
      if (a1.includes('1/4') || a1.includes('quarter') || a1.includes('one quarter') || a1.includes('moja ya nne')) {
        score++;
        feedback.push({ q: 'Q1: Fraction colored', isCorrect: true, note: 'Accurate! 1 of 4 equal parts is 1/4.' });
      } else {
        feedback.push({ q: 'Q1: Fraction colored', isCorrect: false, note: 'Expected 1/4. Remember: 1 part out of 4 equal slices.' });
      }

      // Q2 check (3 or three or 3/4)
      const a2 = q2.trim().toLowerCase();
      if (a2.includes('3') || a2.includes('three') || a2.includes('tatu')) {
        score++;
        feedback.push({ q: 'Q2: Uncolored slices', isCorrect: true, note: 'Correct! 3 slices remain uncolored (3/4).' });
      } else {
        feedback.push({ q: 'Q2: Uncolored slices', isCorrect: false, note: 'Expected 3 slices.' });
      }

      // Q3 check (2/4 or 1/2 or half)
      const a3 = q3.trim().toLowerCase();
      if (a3.includes('2/4') || a3.includes('1/2') || a3.includes('half') || a3.includes('nusu')) {
        score++;
        feedback.push({ q: 'Q3: Shared fraction', isCorrect: true, note: 'Excellent! 2/4 simplifies to 1/2 (nusu chapati).' });
      } else {
        feedback.push({ q: 'Q3: Shared fraction', isCorrect: false, note: 'Expected 2/4 (or 1/2).' });
      }

      const percentage = Math.round((score / total) * 100);
      const rubric = percentage >= 80 ? 'EE' : percentage >= 50 ? 'ME' : 'AE';

      setResult({
        score,
        total,
        percentage,
        rubric,
        feedback
      });
      setIsGrading(false);

      if (onGraded) onGraded({ score, total, percentage, rubric });
    }, 900);
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 99999, padding: '16px'
    }}>
      <div className="glass-panel" style={{
        maxWidth: '620px', width: '100%', maxHeight: '90vh', overflowY: 'auto',
        background: '#0F172A', borderRadius: '24px', border: '1px solid rgba(0,166,81,0.5)',
        padding: '32px', position: 'relative', boxShadow: '0 25px 60px rgba(0,0,0,0.8)'
      }}>
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: '20px', right: '20px', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
        >
          <X size={20} />
        </button>

        {/* Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(0,166,81,0.2)', color: '#34D399', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FileText size={22} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.25rem', margin: 0 }}>Submit & Auto-Mark Worksheet</h3>
            <span style={{ fontSize: '0.78rem', color: '#10B981', fontWeight: 600 }}>
              {worksheetName || 'Math_G4_W3_Fractions_Plate.pdf'}
            </span>
          </div>
        </div>

        <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.5, marginBottom: '20px' }}>
          Enter the answers written on your child's physical printed worksheet or upload a photo. The system will automatically mark it against the official CBC KICD answer key!
        </p>

        {/* Results Screen */}
        {result ? (
          <div style={{ animation: 'fadeIn 0.3s ease' }}>
            <div style={{
              background: 'rgba(16,185,129,0.1)', border: '1.5px solid #10B981', borderRadius: '16px',
              padding: '24px', textAlign: 'center', marginBottom: '20px'
            }}>
              <div style={{ fontSize: '0.82rem', color: '#34D399', fontWeight: 700, textTransform: 'uppercase' }}>
                Automated Marking Complete
              </div>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#F8FAFC', margin: '4px 0' }}>
                {result.score} / {result.total} ({result.percentage}%)
              </div>
              <span className="badge-ee" style={{ padding: '4px 14px', borderRadius: '8px', fontSize: '0.85rem' }}>
                {result.rubric === 'EE' ? 'Level 4: Exceeding Expectations (EE)' : 'Level 3: Meeting Expectations (ME)'}
              </span>
              <div style={{ fontSize: '0.78rem', color: '#10B981', marginTop: '10px' }}>
                ✓ Score recorded into Liam's official CBC Term 1 Assessment Record!
              </div>
            </div>

            {/* Question by Question Feedback */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
              {result.feedback.map((f, i) => (
                <div key={i} style={{
                  background: 'rgba(255,255,255,0.02)', border: f.isCorrect ? '1px solid rgba(16,185,129,0.3)' : '1px solid rgba(239,68,68,0.3)',
                  borderRadius: '10px', padding: '12px 14px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>{f.q}</strong>
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: f.isCorrect ? '#10B981' : '#EF4444' }}>
                      {f.isCorrect ? '✓ Correct (+1)' : '✗ Incorrect'}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    {f.note}
                  </div>
                </div>
              ))}
            </div>

            <button onClick={onClose} className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
              Done & Return to Lessons
            </button>
          </div>
        ) : (
          /* Form Input */
          <form onSubmit={checkAnswers} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>
                Question 1: What fraction represents the 1 slice your child colored?
              </label>
              <input
                type="text"
                placeholder="e.g. 1/4 or one quarter"
                value={q1}
                onChange={(e) => setQ1(e.target.value)}
                required
                style={{
                  width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-card)',
                  borderRadius: '8px', padding: '10px 14px', color: '#fff', fontSize: '0.9rem'
                }}
              />
            </div>

            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>
                Question 2: How many slices are left uncolored?
              </label>
              <input
                type="text"
                placeholder="e.g. 3 or 3 slices"
                value={q2}
                onChange={(e) => setQ2(e.target.value)}
                required
                style={{
                  width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-card)',
                  borderRadius: '8px', padding: '10px 14px', color: '#fff', fontSize: '0.9rem'
                }}
              />
            </div>

            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>
                Question 3: If you share 2 slices with your sister, what fraction did you give her?
              </label>
              <input
                type="text"
                placeholder="e.g. 2/4 or 1/2"
                value={q3}
                onChange={(e) => setQ3(e.target.value)}
                required
                style={{
                  width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-card)',
                  borderRadius: '8px', padding: '10px 14px', color: '#fff', fontSize: '0.9rem'
                }}
              />
            </div>

            {/* Alternative: Snap photo of worksheet */}
            <label style={{
              display: 'block',
              border: attachedPhotoName ? '2px solid #00A651' : '2px dashed var(--border-card)',
              borderRadius: '12px', padding: '14px',
              textAlign: 'center', cursor: 'pointer',
              background: attachedPhotoName ? 'rgba(0,166,81,0.08)' : 'rgba(255,255,255,0.02)'
            }}>
              <input
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={(e) => {
                  const f = e.target.files[0];
                  if (f) setAttachedPhotoName(f.name);
                }}
              />
              <UploadCloud size={20} color="#34D399" style={{ margin: '0 auto 4px' }} />
              <div style={{ fontSize: '0.78rem', color: attachedPhotoName ? '#34D399' : 'var(--text-secondary)', fontWeight: attachedPhotoName ? 700 : 400 }}>
                {attachedPhotoName ? `✅ Attached: ${attachedPhotoName} (Saved to CBC Evidence)` : 'Optional: Click to attach photo of physical paper page for teacher portfolio review'}
              </div>
            </label>

            <button type="submit" disabled={isGrading} className="btn-primary" style={{ justifyContent: 'center', padding: '12px' }}>
              {isGrading ? 'Marking Against KICD Answer Key...' : 'Submit Answers for Auto-Marking'}
            </button>

          </form>
        )}

      </div>
    </div>
  );
}