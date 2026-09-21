import React, { useState } from 'react';
import { Sparkles, Camera, Award, CheckCircle2, UploadCloud, Info } from 'lucide-react';

export default function ScienceLab() {
  const [submissions, setSubmissions] = useState([
    {
      id: 1,
      title: "Liam's Working Charcoal Water Filter",
      photo_url: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=600",
      local_materials: "Plastic bottle, jiko charcoal, compound sand, cotton fabric",
      rubric_score: "EE",
      score_text: "Exceeding Expectations (Level 4)",
      date: "16 Sep 2026",
      mentor_feedback: "Superb scientific initiative Liam! The density layering was executed accurately. Demonstrates high Level 4 competency in Environmental Hygiene."
    },
    {
      id: 2,
      title: "Balcony Sukuma Wiki Kitchen Garden",
      photo_url: "https://images.unsplash.com/photo-1592417817098-8f3d6910985c?w=600",
      local_materials: "Recycled 5L cooking oil container, compost, sukuma wiki seedlings",
      rubric_score: "EE",
      score_text: "Exceeding Expectations (Level 4)",
      date: "12 Sep 2026",
      mentor_feedback: "Remarkable application of agriculture principles and environmental conservation through reuse."
    }
  ]);

  const [newTitle, setNewTitle] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleSimulatedUpload = (e) => {
    e.preventDefault();
    if (!newTitle) return;
    setIsUploading(true);
    setTimeout(() => {
      const newSub = {
        id: Date.now(),
        title: newTitle,
        photo_url: "https://images.unsplash.com/photo-1576086213369-97a306d36557?w=600",
        local_materials: "Locally sourced materials from kitchen & compound",
        rubric_score: "EE",
        score_text: "Exceeding Expectations (Level 4)",
        date: "Just Now",
        mentor_feedback: "Teacher Mercy: Verified! Uploaded directly to Liam's official CBC Term 1 Transcript."
      };
      setSubmissions([newSub, ...submissions]);
      setIsUploading(false);
      setNewTitle('');
      setSuccessMsg('Project photo uploaded to Student Portfolio & marked for CBC Rubric grading!');
      setTimeout(() => setSuccessMsg(''), 4000);
    }, 1200);
  };

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '30px' }}>
      
      {/* LEFT: Today's Featured Lab Guide */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div className="glass-panel" style={{ padding: '28px' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <span className="glass-pill" style={{ background: 'rgba(245,158,11,0.2)', color: '#F59E0B' }}>
              🔬 Featured Kitchen Lab
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>CBC Grade 4 Strand 2</span>
          </div>

          <h2 style={{ fontSize: '1.6rem', marginBottom: '12px' }}>
            Water Purification with Everyday Kenyan Materials
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '20px' }}>
            No expensive beakers or test tubes required. Teach your child practical environmental engineering using everyday items found in any Kenyan household.
          </p>

          {/* Household items box */}
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '16px', marginBottom: '24px' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#34D399', marginBottom: '10px' }}>
              Materials Needed (Check your kitchen / compound):
            </div>
            <ul style={{ listStyle: 'none', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
              <li>✅ 1 empty plastic Dasani/Quencher bottle</li>
              <li>✅ Crushed charcoal from the jiko</li>
              <li>✅ Clean fine sand from the compound</li>
              <li>✅ Small washed pebbles/gravel</li>
              <li>✅ Clean cotton piece of kitenge or cotton wool</li>
              <li>✅ Cup of muddy garden water</li>
            </ul>
          </div>

          {/* Step-by-Step Instructions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' }}>
            <h4 style={{ fontSize: '1rem', color: 'var(--text-primary)', margin: 0 }}>Step-by-Step Procedure:</h4>
            
            {[
              { step: '1', title: 'Prepare Filter Housing', text: 'Carefully cut off the bottom third of the plastic soda bottle using kitchen scissors.' },
              { step: '2', title: 'Invert & Anchor Neck', text: 'Turn the bottle upside down so the neck points into a clean glass or cup.' },
              { step: '3', title: 'Density Layering', text: 'Stuff cotton tightly at the neck, then add 2 inches of crushed jiko charcoal, followed by fine sand, and finally small pebbles on top.' },
              { step: '4', title: 'Run the Experiment', text: 'Pour the muddy water slowly into the top. Watch the layers trap dirt, and observe clear filtered water collecting below!' }
            ].map((s) => (
              <div key={s.step} style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                <div style={{
                  width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(0,166,81,0.2)',
                  color: '#34D399', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, flexShrink: 0
                }}>
                  {s.step}
                </div>
                <div>
                  <div style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-primary)' }}>{s.title}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{s.text}</div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* RIGHT: Portfolio Upload & Verified Projects */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* Upload Card */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <Camera size={20} color="#10B981" />
            <h3 style={{ fontSize: '1.1rem', margin: 0 }}>Upload to Student Portfolio</h3>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
            Take a photo of your child's project. It is automatically logged into their official term report card.
          </p>

          <form onSubmit={handleSimulatedUpload} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <input
              type="text"
              placeholder="e.g. Liam's Water Filter Demonstration"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid var(--border-card)',
                borderRadius: '8px',
                padding: '10px 14px',
                color: '#ffffff',
                fontSize: '0.9rem'
              }}
            />

            <div style={{
              border: '2px dashed var(--border-card)',
              borderRadius: '12px',
              padding: '24px',
              textAlign: 'center',
              cursor: 'pointer',
              background: 'rgba(255,255,255,0.02)'
            }}>
              <UploadCloud size={32} color="#94A3B8" style={{ margin: '0 auto 8px' }} />
              <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: 600 }}>Click to select project photo</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>JPEG or PNG from phone or camera</div>
            </div>

            <button type="submit" disabled={isUploading || !newTitle} className="btn-primary" style={{ justifyContent: 'center' }}>
              {isUploading ? 'Uploading to CBC Portfolio...' : 'Submit Project Photo'}
            </button>
          </form>

          {successMsg && (
            <div style={{ marginTop: '12px', padding: '10px', background: 'rgba(16,185,129,0.15)', border: '1px solid #10B981', borderRadius: '8px', fontSize: '0.82rem', color: '#34D399' }}>
              {successMsg}
            </div>
          )}
        </div>

        {/* Existing Portfolio Feed */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <h3 style={{ fontSize: '1.05rem', margin: '8px 0 0 0' }}>Verified Portfolio Submissions</h3>

          {submissions.map((sub) => (
            <div key={sub.id} className="glass-panel" style={{ padding: '16px', display: 'flex', gap: '14px' }}>
              <img
                src={sub.photo_url}
                alt={sub.title}
                style={{ width: '80px', height: '80px', borderRadius: '10px', objectFit: 'cover' }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <h4 style={{ fontSize: '0.92rem', margin: 0 }}>{sub.title}</h4>
                  <span className="badge-ee" style={{ fontSize: '0.72rem', padding: '2px 8px', borderRadius: '6px' }}>
                    {sub.rubric_score}
                  </span>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  Materials: {sub.local_materials}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '6px', fontStyle: 'italic', background: 'rgba(255,255,255,0.03)', padding: '6px 10px', borderRadius: '6px' }}>
                  💬 {sub.mentor_feedback}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

    </div>
  );
}