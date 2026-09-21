import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { RefreshCw, Edit3, Sparkles, GraduationCap } from 'lucide-react';
import ProfileEditModal from '../profile/ProfileEditModal';

export default function UserProfilePill() {
  const { currentUser, setIsLoginModalOpen, switchAccount } = useAuth();
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  if (!currentUser) return null;

  const roleColors = {
    parent: { bg: 'rgba(0,166,81,0.2)', text: '#34D399', label: 'Parent' },
    student: { bg: 'rgba(59,130,246,0.2)', text: '#60A5FA', label: 'Student' },
    tutor: { bg: 'rgba(245,158,11,0.2)', text: '#F59E0B', label: 'Facilitator' },
    creator: { bg: 'rgba(236,72,153,0.2)', text: '#F472B6', label: 'Creator Hub' },
    admin: { bg: 'rgba(139,92,246,0.2)', text: '#A78BFA', label: 'Admin HQ' },
  };

  const currentRole = roleColors[currentUser.role] || roleColors.parent;
  const isDualRole = !!currentUser?.is_dual_identity || (!!currentUser?.is_also_teacher && !!currentUser?.is_also_creator);

  const handleDualSwitch = () => {
    if (currentUser.role === 'creator') {
      switchAccount('tutor');
    } else {
      switchAccount('creator');
    }
  };

  return (
    <>
      <div style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '12px',
        padding: '12px 14px',
        marginBottom: '14px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div
            onClick={() => setIsEditingProfile(true)}
            title="Click to edit profile & picture"
            style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
          >
            <div style={{ position: 'relative' }}>
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover', border: `2px solid ${currentRole.text}` }}
              />
              <span style={{
                position: 'absolute', bottom: -2, right: -2, background: '#0F172A',
                borderRadius: '50%', padding: '2px', display: 'flex'
              }}>
                <Edit3 size={10} color={currentRole.text} />
              </span>
            </div>

            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.2 }}>
                {currentUser.name}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '3px' }}>
                <span style={{
                  fontSize: '0.65rem', background: currentRole.bg, color: currentRole.text,
                  padding: '1px 6px', borderRadius: '4px', fontWeight: 800, textTransform: 'uppercase'
                }}>
                  {currentRole.label}
                </span>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                  {currentUser.estate?.split(',')[0]}
                </span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '6px' }}>
            {isDualRole && (
              <button
                onClick={handleDualSwitch}
                title={currentUser.role === 'creator' ? 'Switch to Facilitator Desk' : 'Switch to Creator Studio'}
                style={{
                  background: currentUser.role === 'creator' ? 'rgba(245,158,11,0.15)' : 'rgba(236,72,153,0.15)',
                  border: `1px solid ${currentUser.role === 'creator' ? 'rgba(245,158,11,0.3)' : 'rgba(236,72,153,0.3)'}`,
                  borderRadius: '6px',
                  color: currentUser.role === 'creator' ? '#F59E0B' : '#F472B6',
                  padding: '5px 7px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '3px',
                  fontSize: '0.68rem',
                  fontWeight: 700
                }}
              >
                {currentUser.role === 'creator' ? <GraduationCap size={12} /> : <Sparkles size={12} />}
                <span>{currentUser.role === 'creator' ? 'Tutor' : 'Creator'}</span>
              </button>
            )}

            <button
              onClick={() => setIsLoginModalOpen(true)}
              title="Switch Account"
              style={{
                background: 'rgba(255,255,255,0.06)', border: 'none', borderRadius: '6px',
                color: 'var(--text-secondary)', padding: '6px 8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px'
              }}
            >
              <RefreshCw size={12} />
              <span style={{ fontSize: '0.68rem', fontWeight: 600 }}>Switch</span>
            </button>
          </div>
        </div>
      </div>

      {isEditingProfile && (
        <ProfileEditModal onClose={() => setIsEditingProfile(false)} />
      )}
    </>
  );
}
