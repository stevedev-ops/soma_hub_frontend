import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Camera, X, Check, Upload, User, MapPin, Phone, Sparkles, GraduationCap, CheckCircle2 } from 'lucide-react';

export default function ProfileEditModal({ onClose }) {
  const { currentUser, updateProfile } = useAuth();

  const [name, setName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.phone_number || '');
  const [estate, setEstate] = useState(currentUser?.estate || 'Kilimani, Nairobi');
  const [bio, setBio] = useState(currentUser?.bio || '');
  const [avatar, setAvatar] = useState(currentUser?.avatar || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150');
  const [customAvatarUrl, setCustomAvatarUrl] = useState('');

  // Dual-Identity State
  const [isDualIdentity, setIsDualIdentity] = useState(
    !!currentUser?.is_dual_identity || (!!currentUser?.is_also_teacher && !!currentUser?.is_also_creator)
  );
  const [tscNumber, setTscNumber] = useState(currentUser?.tscNumber || 'TSC Reg No. 582914');
  const [socialHandle, setSocialHandle] = useState(currentUser?.socialHandle || '@mamateaches_ke');
  const [hourlyRateKes, setHourlyRateKes] = useState(currentUser?.hourlyRateKes || '1500');

  // Preset curated avatars for Parents, Tutors, and Students
  const presetAvatars = [
    { label: 'Lady Teacher / Creator', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150' },
    { label: 'Male Teacher / Coach', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150' },
    { label: 'Boy Student (Liam)', url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150' },
    { label: 'Girl Student (Maya)', url: 'https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?w=150' },
    { label: 'Executive / Admin', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150' },
    { label: 'Early Years Specialist', url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150' }
  ];

  const handleSave = (e) => {
    e.preventDefault();
    updateProfile({
      name,
      phone_number: phone,
      estate,
      bio,
      avatar,
      is_dual_identity: isDualIdentity,
      is_also_teacher: isDualIdentity,
      is_also_creator: isDualIdentity,
      tscNumber: isDualIdentity ? tscNumber : currentUser?.tscNumber,
      socialHandle: isDualIdentity ? socialHandle : currentUser?.socialHandle,
      hourlyRateKes: isDualIdentity ? hourlyRateKes : currentUser?.hourlyRateKes
    });
    if (onClose) onClose();
  };

  const handleApplyCustomUrl = () => {
    if (customAvatarUrl.trim()) {
      setAvatar(customAvatarUrl.trim());
      setCustomAvatarUrl('');
    }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 99999, padding: '16px'
    }}>
      <div className="glass-panel" style={{
        maxWidth: '560px', width: '100%', maxHeight: '90vh', overflowY: 'auto',
        background: '#0F172A', borderRadius: '24px', border: '1px solid rgba(0,166,81,0.5)',
        padding: '32px', position: 'relative', boxShadow: '0 25px 60px rgba(0,0,0,0.8)'
      }}>
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: '20px', right: '20px', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
        >
          <X size={20} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(0,166,81,0.2)', color: '#34D399', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <User size={20} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.3rem', margin: 0 }}>Edit Profile & Identity</h3>
            <span style={{ fontSize: '0.78rem', color: '#10B981', textTransform: 'uppercase', fontWeight: 700 }}>
              {currentUser?.role} Account Settings
            </span>
          </div>
        </div>

        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Avatar Selector */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
              Profile Photo
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
              <img
                src={avatar}
                alt="Selected Avatar"
                style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #00A651', boxShadow: '0 4px 12px rgba(0,166,81,0.3)' }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                  Choose a preset or paste any image URL below:
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    placeholder="https://example.com/photo.jpg"
                    value={customAvatarUrl}
                    onChange={(e) => setCustomAvatarUrl(e.target.value)}
                    style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '6px 10px', color: '#fff', fontSize: '0.8rem' }}
                  />
                  <button
                    type="button"
                    onClick={handleApplyCustomUrl}
                    className="btn-secondary"
                    style={{ fontSize: '0.75rem', padding: '6px 12px' }}
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>

            {/* Presets Gallery */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '8px' }}>
              {presetAvatars.map((p, idx) => (
                <div
                  key={idx}
                  onClick={() => setAvatar(p.url)}
                  title={p.label}
                  style={{
                    cursor: 'pointer', borderRadius: '50%', overflow: 'hidden',
                    border: avatar === p.url ? '2px solid #00A651' : '2px solid transparent',
                    padding: '2px', transition: 'all 0.15s ease'
                  }}
                >
                  <img src={p.url} alt={p.label} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover', display: 'block' }} />
                </div>
              ))}
            </div>
          </div>

          {/* DUAL-IDENTITY TOGGLE (CREATOR ↔ EDUCATOR) */}
          {(currentUser?.role === 'creator' || currentUser?.role === 'tutor' || currentUser?.role === 'parent') && (
            <div style={{
              background: isDualIdentity ? 'linear-gradient(135deg, rgba(236,72,153,0.12) 0%, rgba(245,158,11,0.12) 100%)' : 'rgba(255,255,255,0.02)',
              border: isDualIdentity ? '1.5px solid rgba(236,72,153,0.4)' : '1px solid var(--border-subtle)',
              borderRadius: '14px',
              padding: '16px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{
                    width: '28px', height: '28px', borderRadius: '8px',
                    background: isDualIdentity ? 'linear-gradient(135deg, #EC4899 0%, #F59E0B 100%)' : 'rgba(255,255,255,0.1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF'
                  }}>
                    🪪
                  </div>
                  <div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#F8FAFC' }}>
                      Dual-Identity: Content Creator + Estate Pod Teacher
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      Enable both Creator monetization (bio links & affiliate sales) and Physical Estate Pod teaching.
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsDualIdentity(!isDualIdentity)}
                  style={{
                    background: isDualIdentity ? '#00A651' : 'rgba(255,255,255,0.1)',
                    border: 'none',
                    borderRadius: '20px',
                    padding: '4px 12px',
                    color: '#FFF',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    cursor: 'pointer'
                  }}
                >
                  {isDualIdentity ? '✓ Enabled' : '+ Enable Dual'}
                </button>
              </div>

              {isDualIdentity && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '12px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.72rem', color: '#F472B6', fontWeight: 700, marginBottom: '2px' }}>
                        TikTok / Instagram Handle:
                      </label>
                      <input
                        type="text"
                        value={socialHandle}
                        onChange={(e) => setSocialHandle(e.target.value)}
                        placeholder="@mamateaches_ke"
                        style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '6px 10px', color: '#fff', fontSize: '0.8rem' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.72rem', color: '#F59E0B', fontWeight: 700, marginBottom: '2px' }}>
                        TSC Reg No. (or Specialty):
                      </label>
                      <input
                        type="text"
                        value={tscNumber}
                        onChange={(e) => setTscNumber(e.target.value)}
                        placeholder="TSC Reg No. 582914"
                        style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '6px 10px', color: '#fff', fontSize: '0.8rem' }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Standard Inputs */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
              Full Name / Display Title
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-subtle)', borderRadius: '10px', padding: '10px 14px', color: '#fff', fontSize: '0.9rem' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                Phone Number (WhatsApp)
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-subtle)', borderRadius: '10px', padding: '10px 14px', color: '#fff', fontSize: '0.9rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                Estate / Suburb (Nairobi)
              </label>
              <input
                type="text"
                value={estate}
                onChange={(e) => setEstate(e.target.value)}
                required
                style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-subtle)', borderRadius: '10px', padding: '10px 14px', color: '#fff', fontSize: '0.9rem' }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
              Bio / Focus Statement
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell other homeschool parents or tutors about your routine and focus areas..."
              style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-subtle)', borderRadius: '10px', padding: '10px 14px', color: '#fff', fontSize: '0.85rem', resize: 'vertical' }}
            />
          </div>

          <button
            type="submit"
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '12px', fontSize: '0.95rem' }}
          >
            <Check size={18} />
            <span>Save Profile &amp; Settings</span>
          </button>
        </form>
      </div>
    </div>
  );
}
