import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Camera, X, Check, Upload, User, MapPin, Phone, Sparkles } from 'lucide-react';

export default function ProfileEditModal({ onClose }) {
  const { currentUser, updateProfile } = useAuth();

  const [name, setName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.phone_number || '');
  const [estate, setEstate] = useState(currentUser?.estate || 'Kilimani, Nairobi');
  const [bio, setBio] = useState(currentUser?.bio || '');
  const [avatar, setAvatar] = useState(currentUser?.avatar || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150');
  const [customAvatarUrl, setCustomAvatarUrl] = useState('');

  // Preset curated avatars for Parents, Tutors, and Students
  const presetAvatars = [
    { label: 'Mom / Lady Teacher', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150' },
    { label: 'Dad / Male Teacher', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150' },
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
      avatar
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
            <h3 style={{ fontSize: '1.3rem', margin: 0 }}>Edit Profile & Picture</h3>
            <span style={{ fontSize: '0.78rem', color: '#10B981', textTransform: 'uppercase', fontWeight: 700 }}>
              {currentUser?.role} Account Settings
            </span>
          </div>
        </div>

        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Avatar Selector Section */}
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '10px' }}>
              Profile Picture / Avatar:
            </label>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '14px' }}>
              <img
                src={avatar}
                alt="Current Avatar"
                style={{ width: '70px', height: '70px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #00A651', boxShadow: '0 4px 14px rgba(0,166,81,0.4)' }}
              />
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>Active Avatar</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Choose a preset below or paste image URL</div>
              </div>
            </div>

            {/* Presets Gallery */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '8px', marginBottom: '12px' }}>
              {presetAvatars.map((p, idx) => (
                <img
                  key={idx}
                  src={p.url}
                  alt={p.label}
                  title={p.label}
                  onClick={() => setAvatar(p.url)}
                  style={{
                    width: '100%', aspectRatio: '1', borderRadius: '50%', objectFit: 'cover',
                    cursor: 'pointer', border: avatar === p.url ? '2px solid #34D399' : '2px solid transparent',
                    opacity: avatar === p.url ? 1 : 0.6, transition: 'all 0.15s ease'
                  }}
                />
              ))}
            </div>

            {/* Custom Image URL Input */}
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="url"
                value={customAvatarUrl}
                onChange={(e) => setCustomAvatarUrl(e.target.value)}
                placeholder="Paste external image URL (e.g. https://...)..."
                style={{
                  flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-card)',
                  borderRadius: '8px', padding: '8px 12px', color: '#fff', fontSize: '0.82rem'
                }}
              />
              <button
                type="button"
                onClick={handleApplyCustomUrl}
                className="btn-secondary"
                style={{ padding: '8px 12px', fontSize: '0.78rem' }}
              >
                Apply URL
              </button>
            </div>
          </div>

          {/* Name & Role Details */}
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
              Display Name:
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={{
                width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-card)',
                borderRadius: '8px', padding: '10px 14px', color: '#fff', fontSize: '0.9rem'
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                Phone Number (M-Pesa):
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                style={{
                  width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-card)',
                  borderRadius: '8px', padding: '10px 14px', color: '#fff', fontSize: '0.9rem'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                Estate Location:
              </label>
              <select
                className="custom-select"
                value={estate}
                onChange={(e) => setEstate(e.target.value)}
                style={{ width: '100%', fontSize: '0.88rem' }}
              >
                <option value="Kilimani, Nairobi">Kilimani, Nairobi</option>
                <option value="Syokimau, Machakos">Syokimau, Machakos</option>
                <option value="Karen, Nairobi">Karen, Nairobi</option>
                <option value="Lavington, Nairobi">Lavington, Nairobi</option>
                <option value="Runda / Ruaka, Kiambu">Runda / Ruaka, Kiambu</option>
                <option value="Eldoret">Eldoret</option>
              </select>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
              Bio & Profile Summary:
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell other homeschool families and tutors about yourself..."
              style={{
                width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-card)',
                borderRadius: '8px', padding: '10px 14px', color: '#fff', fontSize: '0.88rem', fontFamily: 'inherit'
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '10px', paddingTop: '10px' }}>
            <button type="button" onClick={onClose} className="btn-secondary" style={{ flex: 1, justifyContent: 'center' }}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
              <Check size={16} />
              <span>Save Changes</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}