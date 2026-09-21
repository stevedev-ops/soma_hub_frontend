import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { creatorStore } from '../../services/creatorStore';
import PublicCurriculumPreviewModal from '../PublicCurriculumPreviewModal';
import { 
  Sparkles, TrendingUp, Users, DollarSign, Share2, Copy, Check, 
  ExternalLink, Plus, BookOpen, Video, Award, Smartphone, CheckCircle,
  Eye, MessageSquare, ArrowUpRight, GraduationCap, X, Calendar, Layers
} from 'lucide-react';

export default function CreatorStudio({ onNavigateTab, onSwitchToTeacher }) {
  const { currentUser, switchAccount } = useAuth();
  const [templates, setTemplates] = useState(() => creatorStore.getTemplates());
  const [affiliateStats, setAffiliateStats] = useState(() => creatorStore.getAffiliateStats());
  
  // Link Copy states
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCaption, setCopiedCaption] = useState(false);

  // Modals
  const [previewTemplateId, setPreviewTemplateId] = useState(null);
  const [isNewTemplateModalOpen, setIsNewTemplateModalOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [withdrawPhone, setWithdrawPhone] = useState(currentUser?.phone_number || '0712345678');
  const [withdrawLoading, setWithdrawLoading] = useState(false);
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);

  // New Template Form State
  const [newTemplateForm, setNewTemplateForm] = useState({
    title: '',
    curriculum: 'CBC',
    grade: 'Grade 4 (CBC)',
    tagline: '',
    creatorBio: currentUser?.bio || 'Homeschool parent and creator sharing daily schedules.',
    sampleWeekTheme: '',
    highlights: ['3-Hour Morning Focus Block', 'Hands-on Kitchen Labs', 'Zero Textbooks Required'],
    sampleLessons: [
      {
        day: 'Monday',
        time: '08:30 AM - 09:30 AM',
        subject: 'Mathematics',
        topic: 'Hands-on Geometry & Practical Measurement',
        script: 'Say to your child: "Let us measure the perimeter of our dining table using a 30cm ruler!"',
        materials: ['30cm Ruler', 'A4 Paper', 'Pencil'],
        activity: 'Measure 3 household objects and calculate perimeter.'
      },
      {
        day: 'Tuesday',
        time: '09:00 AM - 10:15 AM',
        subject: 'Science & Technology',
        topic: 'Kitchen Soil Drainage & Permeability Test',
        script: 'Say: "Why do some soils hold puddles while others drain immediately? Let us test clay, loam and sand!"',
        materials: ['3 cups', 'Soil samples from compound', 'Water', 'Filter paper or cotton'],
        activity: 'Pour equal water and compare drainage speed.'
      }
    ]
  });

  useEffect(() => {
    const handleUpdate = () => {
      setTemplates(creatorStore.getTemplates());
      setAffiliateStats(creatorStore.getAffiliateStats());
    };
    window.addEventListener('creator_templates_updated', handleUpdate);
    window.addEventListener('creator_affiliate_updated', handleUpdate);
    return () => {
      window.removeEventListener('creator_templates_updated', handleUpdate);
      window.removeEventListener('creator_affiliate_updated', handleUpdate);
    };
  }, []);

  const activeTemplate = templates[0] || {};
  const shareableBioUrl = `${window.location.origin}/?template=${activeTemplate.id || 'mama_teaches_cbc4'}`;
  const tiktokCaption = `Want my exact 3-hour homeschool daily routine for CBC / Cambridge? I put my entire lesson plan and kitchen lab experiments into a 1-click template on SomaHome! Click the link in my bio to start free 🇰🇪📚 #HomeschoolKenya #CBCHomeschool #MamaTeaches`;

  const handleCopyBioLink = () => {
    navigator.clipboard.writeText(shareableBioUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleCopyCaption = () => {
    navigator.clipboard.writeText(tiktokCaption);
    setCopiedCaption(true);
    setTimeout(() => setCopiedCaption(false), 2500);
  };

  const handleCreateTemplateSubmit = (e) => {
    e.preventDefault();
    if (!newTemplateForm.title) return;

    creatorStore.createTemplate({
      ...newTemplateForm,
      creatorName: currentUser?.name || 'Mama Liam (@MamaTeachesKenya)',
      creatorHandle: '@mamateaches_ke',
      socialPlatform: 'TikTok & Instagram',
      creatorAvatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200',
      badge: 'New Creator Blueprint'
    });

    setIsNewTemplateModalOpen(false);
  };

  const handleWithdrawMpesa = () => {
    setWithdrawLoading(true);
    setTimeout(() => {
      setWithdrawLoading(false);
      setWithdrawSuccess(true);
      setTimeout(() => {
        setIsWithdrawModalOpen(false);
        setWithdrawSuccess(false);
      }, 2000);
    }, 1500);
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', paddingBottom: '60px' }}>
      
      {/* Top Creator Header & Dual Role Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(0, 166, 81, 0.18) 0%, rgba(15, 23, 42, 0.95) 100%)',
        border: '1px solid rgba(0, 166, 81, 0.35)', borderRadius: '24px', padding: '28px', marginBottom: '24px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
          <div style={{ position: 'relative' }}>
            <img
              src={currentUser?.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200'}
              alt="Creator Avatar"
              style={{ width: '70px', height: '70px', borderRadius: '20px', objectFit: 'cover', border: '2px solid #00A651' }}
            />
            <span style={{
              position: 'absolute', bottom: '-4px', right: '-4px', background: '#F59E0B',
              borderRadius: '50%', width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px'
            }}>
              ⭐
            </span>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 900, margin: 0, color: '#FFFFFF' }}>
                {currentUser?.name || 'Mama Liam (@MamaTeachesKenya)'}
              </h1>
              <span style={{ background: 'rgba(0,166,81,0.25)', color: '#34D399', fontSize: '0.72rem', fontWeight: 800, padding: '2px 8px', borderRadius: '12px' }}>
                Creator Partner
              </span>
            </div>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
              Social Hub • Monetize your homeschooling routines, build 1-click templates & track commissions.
            </p>
          </div>
        </div>

        {/* Dual Role Fast Switcher */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.04)', border: '1px solid var(--border-card)',
          borderRadius: '16px', padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '14px'
        }}>
          <div>
            <div style={{ fontSize: '0.72rem', color: '#93C5FD', fontWeight: 800, textTransform: 'uppercase' }}>
              👩‍🏫 Dual-Identity Access:
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Facilitate pods & 1-on-1 sessions
            </div>
          </div>

          <button
            onClick={() => {
              if (onSwitchToTeacher) onSwitchToTeacher();
              else switchAccount('tutor');
            }}
            className="btn-secondary"
            style={{ fontSize: '0.8rem', padding: '8px 14px', gap: '6px', color: '#34D399', borderColor: 'rgba(0,166,81,0.4)' }}
          >
            <GraduationCap size={15} />
            <span>Switch to Teacher Desk</span>
          </button>
        </div>
      </div>

      {/* 4 Metric Analytics Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '28px' }}>
        
        <div className="glass-panel" style={{ padding: '20px', borderRadius: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Public Link Clicks</span>
            <Eye size={18} color="#60A5FA" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#F8FAFC' }}>
            {affiliateStats.totalClicks.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#34D399', marginTop: '4px', fontWeight: 700 }}>
            ↑ +18% from TikTok & Instagram this week
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px', borderRadius: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Families Using Templates</span>
            <Users size={18} color="#34D399" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#F8FAFC' }}>
            {affiliateStats.totalImports.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Across 14 estates in Kenya
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px', borderRadius: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Total Revenue Earned</span>
            <DollarSign size={18} color="#F59E0B" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#F59E0B' }}>
            KES {affiliateStats.totalEarningsKes.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            KES 1,500 recurring commission / family
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px', borderRadius: '18px', border: '1px solid rgba(0, 166, 81, 0.4)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.76rem', color: '#34D399', fontWeight: 800, textTransform: 'uppercase' }}>Available M-Pesa Payout</span>
            <Smartphone size={18} color="#34D399" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#34D399' }}>
            KES {affiliateStats.pendingPayoutKes.toLocaleString()}
          </div>
          <button
            onClick={() => setIsWithdrawModalOpen(true)}
            className="btn-primary"
            style={{ width: '100%', fontSize: '0.78rem', padding: '6px', marginTop: '8px', justifyContent: 'center' }}
          >
            Instant M-Pesa Cashout
          </button>
        </div>

      </div>

      {/* TIKTOK & INSTAGRAM BIO LINK GENERATOR CARD */}
      <div className="glass-panel" style={{ padding: '26px', borderRadius: '20px', marginBottom: '28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '14px', marginBottom: '18px' }}>
          <div>
            <div style={{ fontSize: '0.72rem', color: '#F59E0B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>
              ⚡ 1-Click Social Link Engine
            </div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 900, margin: '0 0 4px 0', color: '#FFFFFF' }}>
              Your Custom Homeschool Template Bio Link
            </h2>
            <p style={{ margin: 0, fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
              Place this link in your TikTok bio or Instagram stories. Followers can inspect your routine with 0 login friction.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => setPreviewTemplateId(activeTemplate.id)}
              className="btn-secondary"
              style={{ fontSize: '0.82rem', padding: '8px 14px', gap: '6px' }}
            >
              <Eye size={15} />
              <span>Preview What Followers See</span>
            </button>
          </div>
        </div>

        {/* The Link Box */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(0,0,0,0.4)',
          border: '1px solid var(--border-card)', borderRadius: '12px', padding: '8px 14px', marginBottom: '18px'
        }}>
          <span style={{ fontSize: '0.85rem', color: '#34D399', fontWeight: 700, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {shareableBioUrl}
          </span>

          <button
            onClick={handleCopyBioLink}
            className="btn-primary"
            style={{ padding: '8px 18px', fontSize: '0.82rem', fontWeight: 800, flexShrink: 0, gap: '6px' }}
          >
            {copiedLink ? <Check size={14} /> : <Copy size={14} />}
            <span>{copiedLink ? 'Copied to Clipboard!' : 'Copy Bio Link'}</span>
          </button>
        </div>

        {/* Video Caption Idea Pill */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border-subtle)',
          borderRadius: '12px', padding: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px'
        }}>
          <div style={{ flex: 1, minWidth: '260px' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', marginBottom: '4px' }}>
              📱 Suggested TikTok / Reels Caption:
            </div>
            <p style={{ margin: 0, fontSize: '0.8rem', color: '#CBD5E1', fontStyle: 'italic' }}>
              "{tiktokCaption.slice(0, 110)}..."
            </p>
          </div>

          <button
            onClick={handleCopyCaption}
            className="btn-secondary"
            style={{ fontSize: '0.75rem', padding: '6px 12px', gap: '6px' }}
          >
            {copiedCaption ? <Check size={12} color="#10B981" /> : <Copy size={12} />}
            <span>{copiedCaption ? 'Caption Copied!' : 'Copy Caption'}</span>
          </button>
        </div>
      </div>

      {/* MY PUBLISHED TEMPLATES */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 900, margin: 0, color: '#FFFFFF' }}>
              📚 My Published Homeschool Curriculum Templates ({templates.length})
            </h3>
            <p style={{ margin: '2px 0 0 0', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Templates that parents can import directly into their children's daily schedules
            </p>
          </div>

          <button
            onClick={() => setIsNewTemplateModalOpen(true)}
            className="btn-primary"
            style={{ fontSize: '0.82rem', padding: '8px 16px', gap: '6px' }}
          >
            <Plus size={16} />
            <span>Publish New Template</span>
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '18px' }}>
          {templates.map((tpl) => (
            <div
              key={tpl.id}
              className="glass-panel"
              style={{ padding: '22px', borderRadius: '18px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span style={{
                    background: tpl.curriculum === 'CBC' ? 'rgba(0,166,81,0.2)' : 'rgba(59,130,246,0.2)',
                    color: tpl.curriculum === 'CBC' ? '#34D399' : '#60A5FA',
                    fontSize: '0.7rem', fontWeight: 800, padding: '2px 8px', borderRadius: '10px'
                  }}>
                    {tpl.curriculum} • {tpl.grade}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#F59E0B', fontWeight: 700 }}>
                    ⭐ {tpl.rating} ({tpl.reviewsCount} reviews)
                  </span>
                </div>

                <h4 style={{ fontSize: '1.1rem', fontWeight: 800, margin: '0 0 6px 0', color: '#FFFFFF' }}>
                  {tpl.title}
                </h4>

                <p style={{ margin: '0 0 14px 0', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                  {tpl.tagline}
                </p>

                <div style={{ display: 'flex', gap: '14px', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
                  <span>👥 <strong>{tpl.importsCount.toLocaleString()}</strong> Parent Imports</span>
                  <span>•</span>
                  <span>💰 <strong>KES {tpl.affiliateCommissionKes}</strong> Commission</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', borderTop: '1px solid var(--border-subtle)', paddingTop: '14px' }}>
                <button
                  onClick={() => setPreviewTemplateId(tpl.id)}
                  className="btn-secondary"
                  style={{ flex: 1, fontSize: '0.78rem', padding: '8px', justifyContent: 'center', gap: '6px' }}
                >
                  <Eye size={14} />
                  <span>Inspect Preview</span>
                </button>

                <button
                  onClick={() => {
                    navigator.clipboard.writeText(`${window.location.origin}/?template=${tpl.id}`);
                    alert(`Copied link for ${tpl.title}!`);
                  }}
                  className="btn-secondary"
                  style={{ fontSize: '0.78rem', padding: '8px 12px', justifyContent: 'center' }}
                  title="Copy specific template link"
                >
                  <Share2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RECENT AFFILIATE CONVERSIONS STREAM */}
      <div className="glass-panel" style={{ padding: '24px', borderRadius: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: '#FFFFFF' }}>
              💸 Recent Parent Signups & Affiliate Commissions
            </h3>
            <p style={{ margin: '2px 0 0 0', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Automatically credited when parents subscribe to full term boxes through your templates
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {affiliateStats.recentConversions.map((conv) => (
            <div
              key={conv.id}
              style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                background: 'rgba(255,255,255,0.02)', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border-subtle)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(0,166,81,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#34D399', fontWeight: 800, fontSize: '0.85rem' }}>
                  🇰🇪
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#FFFFFF' }}>
                    {conv.parentName || 'Parent Subscriber'} • {conv.grade || 'CBC Grade 4'}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    {conv.date}
                  </div>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.95rem', fontWeight: 900, color: '#34D399' }}>
                  + KES {conv.commissionKes.toLocaleString()}
                </div>
                <span style={{ fontSize: '0.68rem', color: conv.status === 'Paid Out' ? '#94A3B8' : '#F59E0B', fontWeight: 700 }}>
                  ● {conv.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL 1: Public Preview Modal */}
      {previewTemplateId && (
        <PublicCurriculumPreviewModal
          templateId={previewTemplateId}
          isOpen={!!previewTemplateId}
          onClose={() => setPreviewTemplateId(null)}
        />
      )}

      {/* MODAL 2: Create New Template Builder */}
      {isNewTemplateModalOpen && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 99999, padding: '16px'
        }}>
          <div className="glass-panel" style={{
            maxWidth: '620px', width: '100%', background: '#0F172A', borderRadius: '24px',
            border: '1px solid rgba(0,166,81,0.4)', padding: '28px', maxHeight: '90vh', overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 900, margin: 0, color: '#FFFFFF' }}>
                ✨ Publish Custom Homeschool Template
              </h3>
              <button onClick={() => setIsNewTemplateModalOpen(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateTemplateSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.76rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                  Template Title:
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 5-Day Charlotte Mason & Kenya Nature Track"
                  value={newTemplateForm.title}
                  onChange={(e) => setNewTemplateForm({ ...newTemplateForm, title: e.target.value })}
                  style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-card)', borderRadius: '8px', padding: '10px 12px', color: '#fff', fontSize: '0.85rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.76rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                    Curriculum Framework:
                  </label>
                  <select
                    className="custom-select"
                    value={newTemplateForm.curriculum}
                    onChange={(e) => setNewTemplateForm({ ...newTemplateForm, curriculum: e.target.value })}
                    style={{ width: '100%', fontSize: '0.85rem', padding: '8px 12px' }}
                  >
                    <option value="CBC">KICD CBC (Kenya)</option>
                    <option value="Cambridge">British Cambridge Primary</option>
                    <option value="Montessori">Montessori / Hands-On</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.76rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                    Target Grade / Age:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Grade 4 (Age 9-10)"
                    value={newTemplateForm.grade}
                    onChange={(e) => setNewTemplateForm({ ...newTemplateForm, grade: e.target.value })}
                    style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-card)', borderRadius: '8px', padding: '10px 12px', color: '#fff', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.76rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                  Catchy Tagline / Hook for Parents:
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. The exact 3h morning schedule I use at home in Nairobi"
                  value={newTemplateForm.tagline}
                  onChange={(e) => setNewTemplateForm({ ...newTemplateForm, tagline: e.target.value })}
                  style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-card)', borderRadius: '8px', padding: '10px 12px', color: '#fff', fontSize: '0.85rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.76rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                  Week 1 Theme:
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Backyard Botany, Fractions & Storytelling"
                  value={newTemplateForm.sampleWeekTheme}
                  onChange={(e) => setNewTemplateForm({ ...newTemplateForm, sampleWeekTheme: e.target.value })}
                  style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-card)', borderRadius: '8px', padding: '10px 12px', color: '#fff', fontSize: '0.85rem' }}
                />
              </div>

              <button type="submit" className="btn-primary" style={{ padding: '12px', justifyContent: 'center', marginTop: '10px', fontSize: '0.9rem' }}>
                🚀 Publish Template & Generate Bio Link
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: M-Pesa Withdrawal Modal */}
      {isWithdrawModalOpen && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 99999, padding: '16px'
        }}>
          <div className="glass-panel" style={{
            maxWidth: '440px', width: '100%', background: '#0F172A', borderRadius: '24px',
            border: '1px solid #00A651', padding: '28px', textAlign: 'center'
          }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '18px', background: '#00A651', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <Smartphone size={28} color="#fff" />
            </div>

            <h3 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#FFFFFF', margin: '0 0 6px 0' }}>
              M-Pesa B2C Payout
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: '0 0 18px 0' }}>
              Withdraw your affiliate commission directly to your Safaricom line
            </p>

            <div style={{ background: 'rgba(0,166,81,0.1)', padding: '14px', borderRadius: '12px', marginBottom: '16px' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Amount to Disburse:</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#34D399' }}>
                KES {affiliateStats.pendingPayoutKes.toLocaleString()}
              </div>
            </div>

            <input
              type="text"
              value={withdrawPhone}
              onChange={(e) => setWithdrawPhone(e.target.value)}
              placeholder="0712 345 678"
              style={{
                width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-card)',
                borderRadius: '8px', padding: '10px', color: '#fff', fontSize: '0.9rem', textAlign: 'center', marginBottom: '16px'
              }}
            />

            {withdrawSuccess ? (
              <div style={{ color: '#34D399', fontWeight: 800, fontSize: '0.9rem' }}>
                ✓ Disbursed! KES {affiliateStats.pendingPayoutKes.toLocaleString()} sent to {withdrawPhone}.
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => setIsWithdrawModalOpen(false)}
                  className="btn-secondary"
                  style={{ flex: 1, padding: '10px', justifyContent: 'center' }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleWithdrawMpesa}
                  disabled={withdrawLoading}
                  className="btn-primary"
                  style={{ flex: 1, padding: '10px', justifyContent: 'center' }}
                >
                  {withdrawLoading ? 'Processing...' : 'Confirm Payout'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
