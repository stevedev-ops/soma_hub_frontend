import React, { useState } from 'react';
import { 
  X, Share2, Copy, Check, ExternalLink, Award, Sparkles, Volume2, 
  Play, Pause, Download, Eye, ShieldCheck, Heart, MessageSquare, Calendar, Star, ArrowLeft 
} from 'lucide-react';

export default function StudentShowcaseModal({ 
  isOpen, 
  onClose, 
  studentName = 'Liam Kiprop', 
  grade = 'Grade 4 CBC',
  isPageView = false 
}) {
  if (!isOpen) return null;

  const [copied, setCopied] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'projects' | 'audio'
  const [likes, setLikes] = useState({ 1: 14, 2: 22, 3: 19 });
  const [hasLiked, setHasLiked] = useState({});

  const shareUrl = `https://somahome.co.ke/showcase/${studentName.toLowerCase().replace(/\s+/g, '-')}-2026`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleToggleLike = (id) => {
    setLikes(prev => ({
      ...prev,
      [id]: hasLiked[id] ? prev[id] - 1 : prev[id] + 1
    }));
    setHasLiked(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const SHOWCASE_ITEMS = [
    {
      id: 1,
      type: 'project',
      title: 'Solar Water Purifier Prototype',
      subject: 'Science & Environmental Tech',
      date: 'March 12, 2026',
      description: 'Built a 2-stage evaporation & condensation water purifier using recycled plastic bottles, black gravel, and clear cling film. Tested with murky pond water and achieved clear potable condensation.',
      tags: ['CBC Science', 'Renewable Energy', 'Hands-on Engineering'],
      teacherNote: 'Demonstrated exceptional scientific method: logged temperature curves hourly and explained convection cycles accurately.',
      evaluator: 'Teacher Sarah W. (Kilimani STEM Pod)',
      rubricScore: 'Level 4 - Exceeding Expectations (EE)',
      image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 2,
      type: 'audio',
      title: 'Oral Reading Fluency & Shairi Recitation',
      subject: 'Kiswahili & English Literacy',
      date: 'March 8, 2026',
      duration: '1 min 45 sec',
      description: 'Live voice recording of Liam reciting his original Kiswahili poem "Uhifadhi wa Misitu Yetu" followed by a fluent passage from Cambridge Primary Reader.',
      tags: ['Oral Fluency', 'Kiswahili Shairi', 'Public Speaking'],
      teacherNote: 'Vocal inflection, rhythm, and pacing were outstanding. Pronunciation of ngeli prefixes was spot-on.',
      evaluator: 'Mwalimu Kevin M.',
      rubricScore: 'Level 4 - Exceeding Expectations (EE)'
    },
    {
      id: 3,
      type: 'project',
      title: 'Geometric Village Model with Perimeter Ratios',
      subject: 'Mathematics & Spatial Art',
      date: 'February 27, 2026',
      description: 'Calculated exact scaling ratios (1:50) to craft a miniature cardboard Maasai Manyatta village. Used real metric scale rules to calculate compound perimeter and surface areas.',
      tags: ['Practical Math', 'Scale Ratios', 'Architecture'],
      teacherNote: 'Turned abstract 2D perimeter concepts into tangible 3D engineering with zero calculation errors.',
      evaluator: 'Coach David O.',
      rubricScore: 'Level 4 - Exceeding Expectations (EE)',
      image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=800&q=80'
    }
  ];

  const filteredItems = activeTab === 'all' 
    ? SHOWCASE_ITEMS 
    : SHOWCASE_ITEMS.filter(item => {
        if (activeTab === 'projects') return item.type === 'project';
        if (activeTab === 'audio') return item.type === 'audio';
        return true;
      });

  const content = (
    <div 
      className="glass-panel"
      style={{
        width: '100%',
        maxWidth: isPageView ? '1080px' : '960px',
        maxHeight: isPageView ? 'none' : '92vh',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '24px',
        background: '#0E1524',
        border: '1.5px solid rgba(16, 185, 129, 0.4)',
        boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.9)',
        position: 'relative',
        overflow: 'hidden',
        margin: isPageView ? '0 auto 40px auto' : '0'
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Top Decorative Header */}
      <div style={{
        padding: '28px 32px',
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(14, 21, 36, 0.95) 100%)',
        borderBottom: '1px solid var(--border-subtle)',
        position: 'relative'
      }}>
        {/* Back / Close button */}
        <button
          onClick={onClose}
          type="button"
          style={{
            position: 'absolute',
            top: '22px',
            right: '24px',
            background: 'rgba(255,255,255,0.08)',
            border: 'none',
            borderRadius: '50%',
            width: '38px',
            height: '38px',
            color: 'var(--text-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'background 0.2s',
            zIndex: 10
          }}
          title={isPageView ? 'Back to Student Dashboard' : 'Close Showcase'}
        >
          {isPageView ? <ArrowLeft size={18} /> : <X size={18} />}
        </button>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', paddingRight: '48px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '68px',
              height: '68px',
              borderRadius: '18px',
              background: 'linear-gradient(135deg, #00A651 0%, #059669 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
              boxShadow: '0 4px 18px rgba(0, 166, 81, 0.4)',
              flexShrink: 0
            }}>
              👦
            </div>
            <div>
              <div className="glass-pill" style={{ color: '#10B981', border: '1px solid rgba(16,185,129,0.3)', marginBottom: '4px', fontSize: '0.72rem' }}>
                <Sparkles size={12} style={{ display: 'inline', marginRight: '4px' }} />
                <span>Prenda/Primer-Style Exhibition of Mastery</span>
              </div>
              <h1 style={{ fontSize: '1.65rem', margin: '2px 0 0 0', fontWeight: 800, color: '#F8FAFC' }}>
                {studentName}'s Digital Showcase
              </h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.86rem', margin: '3px 0 0 0' }}>
                {grade} • Verified Microschool Learning Portfolio • Term 1, 2026
              </p>
            </div>
          </div>

          {/* Share & Copy Buttons */}
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={handleCopy}
              className="btn-secondary"
              style={{ fontSize: '0.82rem', padding: '8px 14px' }}
            >
              {copied ? <Check size={14} color="#10B981" /> : <Copy size={14} />}
              <span>{copied ? 'Link Copied!' : 'Copy Link'}</span>
            </button>

            <a
              href={`https://wa.me/?text=${encodeURIComponent(`Check out ${studentName}'s Exhibition of Mastery homeschool portfolio on SomaHome: ${shareUrl}`)}`}
              target="_blank"
              rel="noreferrer"
              className="btn-primary"
              style={{ fontSize: '0.82rem', padding: '8px 14px', textDecoration: 'none' }}
            >
              <Share2 size={14} />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>

        {/* Public Share URL Box */}
        <div style={{
          marginTop: '16px',
          background: 'rgba(0,0,0,0.45)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '10px',
          padding: '10px 16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.8rem'
        }}>
          <span style={{ color: '#34D399', fontFamily: 'var(--font-mono)' }}>{shareUrl}</span>
          <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <ShieldCheck size={14} color="#10B981" />
            <span>Public Verified Portfolio • KNQA Aligned</span>
          </span>
        </div>
      </div>

      {/* Filter Tabs Bar */}
      <div style={{
        padding: '12px 32px',
        background: 'rgba(255, 255, 255, 0.02)',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setActiveTab('all')}
            style={{
              background: activeTab === 'all' ? 'rgba(16, 185, 129, 0.2)' : 'transparent',
              border: activeTab === 'all' ? '1px solid #10B981' : '1px solid transparent',
              color: activeTab === 'all' ? '#10B981' : 'var(--text-secondary)',
              borderRadius: '8px', padding: '6px 14px', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 600
            }}
          >
            All Artifacts ({SHOWCASE_ITEMS.length})
          </button>
          <button
            onClick={() => setActiveTab('projects')}
            style={{
              background: activeTab === 'projects' ? 'rgba(16, 185, 129, 0.2)' : 'transparent',
              border: activeTab === 'projects' ? '1px solid #10B981' : '1px solid transparent',
              color: activeTab === 'projects' ? '#10B981' : 'var(--text-secondary)',
              borderRadius: '8px', padding: '6px 14px', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 600
            }}
          >
            🔬 Physical Projects & Science
          </button>
          <button
            onClick={() => setActiveTab('audio')}
            style={{
              background: activeTab === 'audio' ? 'rgba(16, 185, 129, 0.2)' : 'transparent',
              border: activeTab === 'audio' ? '1px solid #10B981' : '1px solid transparent',
              color: activeTab === 'audio' ? '#10B981' : 'var(--text-secondary)',
              borderRadius: '8px', padding: '6px 14px', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 600
            }}
          >
            🎙️ Audio Recitations
          </button>
        </div>

        <span style={{ fontSize: '0.75rem', color: '#F59E0B', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Award size={14} />
          <span>Prenda Mastery Framework</span>
        </span>
      </div>

      {/* Gallery Content Cards */}
      <div style={{
        padding: '28px 32px',
        overflowY: isPageView ? 'visible' : 'auto',
        flex: 1,
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '24px'
      }}>
        {filteredItems.map(item => (
          <div 
            key={item.id}
            style={{
              background: 'rgba(0,0,0,0.35)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '18px',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: '0 4px 18px rgba(0,0,0,0.3)'
            }}
          >
            <div>
              {/* Photo Header */}
              {item.image && (
                <div style={{ position: 'relative', width: '100%', height: '220px', overflow: 'hidden' }}>
                  <img 
                    src={item.image} 
                    alt={item.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div style={{
                    position: 'absolute', top: '12px', right: '12px',
                    background: 'rgba(10, 14, 23, 0.85)', backdropFilter: 'blur(8px)',
                    borderRadius: '8px', padding: '4px 10px', fontSize: '0.72rem',
                    color: '#10B981', border: '1px solid rgba(16, 185, 129, 0.4)', fontWeight: 700
                  }}>
                    Mastery Artifact
                  </div>
                </div>
              )}

              {/* Audio Player Header */}
              {item.type === 'audio' && (
                <div style={{
                  padding: '22px',
                  background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.15) 0%, rgba(14, 21, 36, 0.8) 100%)',
                  borderBottom: '1px solid var(--border-subtle)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#38BDF8', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Volume2 size={16} />
                      <span>AUDIO PORTFOLIO RECORD</span>
                    </span>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{item.duration}</span>
                  </div>

                  <div style={{
                    background: 'rgba(0,0,0,0.4)',
                    borderRadius: '12px',
                    padding: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px'
                  }}>
                    <button
                      onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                      style={{
                        width: '46px', height: '46px', borderRadius: '50%',
                        background: '#38BDF8', border: 'none', color: '#0F172A',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer', flexShrink: 0, boxShadow: '0 4px 12px rgba(56, 189, 248, 0.4)'
                      }}
                    >
                      {isPlayingAudio ? <Pause size={20} /> : <Play size={20} style={{ marginLeft: '2px' }} />}
                    </button>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                        <span>{isPlayingAudio ? '0:42' : '0:00'}</span>
                        <span>{item.duration}</span>
                      </div>
                      {/* Audio bars */}
                      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '3px', height: '26px' }}>
                        {[40, 75, 55, 90, 60, 30, 80, 100, 65, 45, 85, 30, 95, 70, 50, 80, 40].map((h, i) => (
                          <div
                            key={i}
                            style={{
                              flex: 1,
                              height: `${isPlayingAudio ? Math.max(25, (h * Math.random()).toFixed(0)) : h}%`,
                              background: isPlayingAudio ? '#38BDF8' : 'rgba(255,255,255,0.25)',
                              borderRadius: '2px',
                              transition: 'height 0.2s ease'
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Body Details */}
              <div style={{ padding: '22px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.76rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                  <span style={{ color: '#10B981', fontWeight: 700 }}>{item.subject}</span>
                  <span>📅 {item.date}</span>
                </div>

                <h3 style={{ fontSize: '1.2rem', margin: '4px 0 8px 0', color: '#F8FAFC', fontWeight: 700 }}>
                  {item.title}
                </h3>

                <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '14px' }}>
                  {item.description}
                </p>

                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '16px' }}>
                  {item.tags.map((t, idx) => (
                    <span key={idx} style={{
                      background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-subtle)',
                      borderRadius: '6px', padding: '3px 8px', fontSize: '0.72rem', color: 'var(--text-muted)'
                    }}>
                      #{t}
                    </span>
                  ))}
                </div>

                {/* Teacher Evaluation Rubric Box */}
                <div style={{
                  background: 'rgba(16, 185, 129, 0.08)',
                  border: '1px solid rgba(16, 185, 129, 0.25)',
                  borderRadius: '12px',
                  padding: '14px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.76rem', marginBottom: '4px' }}>
                    <span style={{ color: '#F8FAFC', fontWeight: 700 }}>👨‍🏫 {item.evaluator}</span>
                    <span style={{ color: '#10B981', fontWeight: 800 }}>{item.rubricScore}</span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontStyle: 'italic', lineHeight: 1.4 }}>
                    "{item.teacherNote}"
                  </div>
                </div>
              </div>

            </div>

            {/* Card Footer */}
            <div style={{
              padding: '14px 22px',
              background: 'rgba(0,0,0,0.25)',
              borderTop: '1px solid var(--border-subtle)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '0.76rem'
            }}>
              <button
                onClick={() => handleToggleLike(item.id)}
                style={{
                  background: 'transparent', border: 'none', color: hasLiked[item.id] ? '#F43F5E' : 'var(--text-muted)',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600
                }}
              >
                <Heart size={15} fill={hasLiked[item.id] ? '#F43F5E' : 'none'} />
                <span>{likes[item.id]} Praises</span>
              </button>

              <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Star size={13} color="#F59E0B" fill="#F59E0B" />
                <span>MoE Verifiable Portfolio</span>
              </span>
            </div>

          </div>
        ))}
      </div>

      {/* Modal Bottom Bar */}
      <div style={{
        padding: '18px 32px',
        background: 'rgba(10, 14, 23, 0.95)',
        borderTop: '1px solid var(--border-subtle)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          Official learning portfolio aligned with Kenya MoE CBC & KNQA frameworks.
        </span>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => window.print()}
            className="btn-secondary"
            style={{ fontSize: '0.82rem', padding: '8px 16px' }}
          >
            <Download size={14} />
            <span>Export PDF Transcript</span>
          </button>

          <button
            onClick={onClose}
            className="btn-primary"
            style={{ fontSize: '0.82rem', padding: '8px 20px' }}
          >
            {isPageView ? 'Back to Dashboard' : 'Close'}
          </button>
        </div>
      </div>

    </div>
  );

  if (isPageView) {
    return (
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '10px 10px 40px 10px' }}>
        {content}
      </div>
    );
  }

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
      {content}
    </div>
  );
}
