import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { Lock, Smartphone, UserCheck, Users, ShieldCheck, X, Sparkles, GraduationCap, UserPlus, LogIn, CheckCircle } from 'lucide-react';

export default function LoginPage({ onClose }) {
  const { loginWithCredentials, switchAccount, updateProfile } = useAuth();
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'
  const [registerRole, setRegisterRole] = useState('parent'); // 'parent' | 'tutor' | 'creator'

  // Credentials State
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Self-Registration Form State
  const [regForm, setRegForm] = useState({
    fullName: '',
    phone: '',
    estate: 'Kilimani, Nairobi',
    password: '',
    // Parent specific
    childName: '',
    childGrade: 'Grade 4 (CBC)',
    childCurriculum: 'CBC',
    // Tutor specific
    tscNumber: '',
    hourlyRateKes: '1500',
    subjects: 'Mathematics & Science',
    // Creator specific
    socialHandle: '@homeschoolmom_ke',
    socialPlatform: 'TikTok & Instagram',
    bio: 'Homeschool mom sharing daily practical lesson routines.'
  });

  const handleFormLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      await loginWithCredentials(username, password);
    } catch (err) {
      setError('Invalid credentials. Please try again or use the Instant Demo Switcher.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelfRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Post registration to Django backend REST endpoint
      await api.register({
        fullName: regForm.fullName,
        phone: regForm.phone,
        estate: regForm.estate,
        role: registerRole,
        password: regForm.password || 'Pass1234!',
        childName: regForm.childName,
        childGrade: regForm.childGrade,
        childCurriculum: regForm.childCurriculum,
        hourlyRateKes: regForm.hourlyRateKes,
        bio: regForm.bio
      });
      const newUser = {
        id: Date.now(),
        username: regForm.phone || regForm.fullName.toLowerCase().replace(/\s+/g, '_'),
        name: regForm.fullName || (registerRole === 'parent' ? 'Homeschool Parent' : registerRole === 'tutor' ? 'Educator' : 'Creator'),
        role: registerRole,
        phone_number: regForm.phone || '+254700000000',
        estate: regForm.estate,
        bio: regForm.bio,
        avatar: registerRole === 'tutor' 
          ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150' 
          : registerRole === 'creator'
          ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
          : 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150',
        children: registerRole === 'parent' ? [
          {
            id: `child_${Date.now()}`,
            name: regForm.childName || 'My Child',
            grade: regForm.childGrade,
            curriculum: regForm.childCurriculum
          }
        ] : []
      };

      localStorage.setItem('somahome_user', JSON.stringify(newUser));
      
      // If parent, also add child to family list
      if (registerRole === 'parent' && regForm.childName) {
        try {
          const existingChildren = JSON.parse(localStorage.getItem('somahome_parent_children_v3') || '[]');
          existingChildren.unshift({
            id: `child_${Date.now()}`,
            name: regForm.childName,
            grade: regForm.childGrade,
            curriculum: regForm.childCurriculum,
            avatar: 'https://images.unsplash.com/photo-1543332164-6e82f355badc?w=120&auto=format&fit=crop&q=80',
            dob: '2016-05-14'
          });
          localStorage.setItem('somahome_parent_children_v3', JSON.stringify(existingChildren));
        } catch (e) {}
      }

      setSuccessMsg(`Welcome to SomaHome, ${newUser.name}! Account created.`);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickSwitch = async (role) => {
    setIsLoading(true);
    await switchAccount(role);
    setIsLoading(false);
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 99999, padding: '16px'
    }}>
      <div className="glass-panel" style={{
        maxWidth: '560px', width: '100%', background: '#0F172A', borderRadius: '24px',
        border: '1px solid rgba(0,166,81,0.4)', padding: '32px', position: 'relative', boxShadow: '0 25px 60px rgba(0,0,0,0.8)',
        maxHeight: '92vh', overflowY: 'auto'
      }}>
        {onClose && (
          <button
            onClick={onClose}
            style={{ position: 'absolute', top: '20px', right: '20px', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        )}

        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div style={{
            width: '48px', height: '48px', borderRadius: '16px', background: '#00A651',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem', margin: '0 auto 10px',
            boxShadow: '0 6px 18px rgba(0,166,81,0.4)'
          }}>
            🇰🇪
          </div>
          <h2 style={{ fontSize: '1.5rem', margin: 0, fontWeight: 800 }}>SomaHome Kenya</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', margin: '4px 0 0 0' }}>
            CBC & Cambridge Turnkey Homeschooling & Micro-Pod Network
          </p>
        </div>

        {/* TAB SWITCHER: SIGN IN vs CREATE ACCOUNT */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', background: 'rgba(255,255,255,0.04)',
          padding: '4px', borderRadius: '12px', marginBottom: '20px'
        }}>
          <button
            onClick={() => { setAuthMode('login'); setError(''); }}
            style={{
              padding: '8px', borderRadius: '8px', fontSize: '0.82rem', fontWeight: 800, cursor: 'pointer',
              background: authMode === 'login' ? '#00A651' : 'transparent',
              color: authMode === 'login' ? '#FFFFFF' : 'var(--text-muted)',
              border: 'none', transition: 'all 0.15s ease'
            }}
          >
            Sign In to Existing Account
          </button>
          <button
            onClick={() => { setAuthMode('register'); setError(''); }}
            style={{
              padding: '8px', borderRadius: '8px', fontSize: '0.82rem', fontWeight: 800, cursor: 'pointer',
              background: authMode === 'register' ? '#00A651' : 'transparent',
              color: authMode === 'register' ? '#FFFFFF' : 'var(--text-muted)',
              border: 'none', transition: 'all 0.15s ease'
            }}
          >
            ✨ Self-Register (Free Signup)
          </button>
        </div>

        {/* VIEW 1: SIGN IN FORM */}
        {authMode === 'login' && (
          <div>
            {/* QUICK ROLE SWITCHER (ONE-CLICK SWITCHING) */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '0.7rem', color: '#F59E0B', fontWeight: 800, textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.05em' }}>
                ⚡ Instant Account Switcher (One-Click Demo Roles):
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <button
                  onClick={() => handleQuickSwitch('parent')}
                  className="btn-secondary"
                  style={{ padding: '8px 10px', fontSize: '0.8rem', justifyContent: 'flex-start' }}
                >
                  <span>👨‍👩‍👧</span>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontWeight: 700 }}>Parent Account</div>
                    <div style={{ fontSize: '0.66rem', color: 'var(--text-muted)' }}>Steve (Mama Liam)</div>
                  </div>
                </button>

                <button
                  onClick={() => handleQuickSwitch('creator')}
                  className="btn-secondary"
                  style={{ padding: '8px 10px', fontSize: '0.8rem', justifyContent: 'flex-start', border: '1px solid rgba(236,72,153,0.4)' }}
                >
                  <span>🎨</span>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontWeight: 700, color: '#F472B6' }}>Content Creator</div>
                    <div style={{ fontSize: '0.66rem', color: 'var(--text-muted)' }}>@MamaTeaches (TikTok)</div>
                  </div>
                </button>

                <button
                  onClick={() => handleQuickSwitch('tutor')}
                  className="btn-secondary"
                  style={{ padding: '8px 10px', fontSize: '0.8rem', justifyContent: 'flex-start' }}
                >
                  <span>👩‍🏫</span>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontWeight: 700 }}>Facilitator Desk</div>
                    <div style={{ fontSize: '0.66rem', color: 'var(--text-muted)' }}>Teacher Mercy (TSC)</div>
                  </div>
                </button>

                <button
                  onClick={() => handleQuickSwitch('student')}
                  className="btn-secondary"
                  style={{ padding: '8px 10px', fontSize: '0.8rem', justifyContent: 'flex-start' }}
                >
                  <span>👦</span>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontWeight: 700 }}>Student "Kid Mode"</div>
                    <div style={{ fontSize: '0.66rem', color: 'var(--text-muted)' }}>Liam (Grade 4 CBC)</div>
                  </div>
                </button>
              </div>
            </div>

            <div style={{ position: 'relative', textAlign: 'center', margin: '16px 0' }}>
              <hr style={{ border: 'none', borderTop: '1px solid var(--border-subtle)' }} />
              <span style={{ position: 'absolute', top: '-10px', left: '50%', transform: 'translateX(-50%)', background: '#0F172A', padding: '0 10px', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                or sign in with password
              </span>
            </div>

            {/* CREDENTIALS LOGIN FORM */}
            <form onSubmit={handleFormLogin} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.74rem', color: 'var(--text-muted)', marginBottom: '3px' }}>
                  Kenyan Phone or Username:
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. 0712345678 or steve_parent"
                  style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-card)', borderRadius: '8px', padding: '8px 12px', color: '#fff', fontSize: '0.85rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.74rem', color: 'var(--text-muted)', marginBottom: '3px' }}>
                  Password:
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-card)', borderRadius: '8px', padding: '8px 12px', color: '#fff', fontSize: '0.85rem' }}
                />
              </div>

              {error && <div style={{ color: '#EF4444', fontSize: '0.76rem' }}>{error}</div>}

              <button type="submit" disabled={isLoading} className="btn-primary" style={{ justifyContent: 'center', marginTop: '4px', padding: '10px' }}>
                {isLoading ? 'Signing in...' : 'Sign in to Account'}
              </button>
            </form>
          </div>
        )}

        {/* VIEW 2: SELF-REGISTRATION FORM */}
        {authMode === 'register' && (
          <div>
            {/* Role Picker */}
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '0.74rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                I am registering as a:
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px' }}>
                {[
                  { id: 'parent', label: '👨‍👩‍👧 Parent / Family' },
                  { id: 'tutor', label: '👩‍🏫 Tutor / Teacher' },
                  { id: 'creator', label: '🎨 Content Creator' }
                ].map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setRegisterRole(r.id)}
                    style={{
                      padding: '8px 6px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer',
                      background: registerRole === r.id ? 'rgba(0,166,81,0.2)' : 'rgba(255,255,255,0.03)',
                      color: registerRole === r.id ? '#34D399' : 'var(--text-muted)',
                      border: registerRole === r.id ? '1px solid #00A651' : '1px solid var(--border-subtle)'
                    }}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSelfRegister} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.74rem', color: 'var(--text-muted)', marginBottom: '3px' }}>
                  Full Name / Preferred Name:
                </label>
                <input
                  type="text"
                  required
                  placeholder={registerRole === 'tutor' ? 'e.g. Teacher David Maina' : registerRole === 'creator' ? 'e.g. Mama Liam (@MamaTeachesKenya)' : 'e.g. Sarah Kariuki'}
                  value={regForm.fullName}
                  onChange={(e) => setRegForm({ ...regForm, fullName: e.target.value })}
                  style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-card)', borderRadius: '8px', padding: '8px 12px', color: '#fff', fontSize: '0.85rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.74rem', color: 'var(--text-muted)', marginBottom: '3px' }}>
                    Kenyan WhatsApp Phone:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="0712 345 678"
                    value={regForm.phone}
                    onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })}
                    style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-card)', borderRadius: '8px', padding: '8px 12px', color: '#fff', fontSize: '0.85rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.74rem', color: 'var(--text-muted)', marginBottom: '3px' }}>
                    Estate / Neighborhood:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Syokimau / Kilimani"
                    value={regForm.estate}
                    onChange={(e) => setRegForm({ ...regForm, estate: e.target.value })}
                    style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-card)', borderRadius: '8px', padding: '8px 12px', color: '#fff', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              {/* PARENT SPECIFIC FIELDS */}
              {registerRole === 'parent' && (
                <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)', borderRadius: '10px', padding: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ fontSize: '0.7rem', color: '#34D399', fontWeight: 800, textTransform: 'uppercase' }}>
                    👶 Child Details:
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '8px' }}>
                    <input
                      type="text"
                      required
                      placeholder="Child's First Name (e.g. Liam)"
                      value={regForm.childName}
                      onChange={(e) => setRegForm({ ...regForm, childName: e.target.value })}
                      style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-card)', borderRadius: '8px', padding: '7px 10px', color: '#fff', fontSize: '0.82rem' }}
                    />
                    <select
                      className="custom-select"
                      value={regForm.childGrade}
                      onChange={(e) => setRegForm({ ...regForm, childGrade: e.target.value })}
                      style={{ width: '100%', fontSize: '0.82rem', padding: '7px' }}
                    >
                      <option value="Grade 1 (CBC)">Grade 1 (CBC)</option>
                      <option value="Grade 2 (CBC)">Grade 2 (CBC)</option>
                      <option value="Grade 3 (CBC)">Grade 3 (CBC)</option>
                      <option value="Grade 4 (CBC)">Grade 4 (CBC)</option>
                      <option value="Grade 5 (CBC)">Grade 5 (CBC)</option>
                      <option value="Grade 6 (CBC)">Grade 6 (CBC)</option>
                      <option value="Year 4 (Cambridge)">Year 4 (Cambridge)</option>
                      <option value="Year 5 (Cambridge)">Year 5 (Cambridge)</option>
                      <option value="Year 6 (Cambridge)">Year 6 (Cambridge)</option>
                    </select>
                  </div>
                </div>
              )}

              {/* TUTOR SPECIFIC FIELDS */}
              {registerRole === 'tutor' && (
                <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)', borderRadius: '10px', padding: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ fontSize: '0.7rem', color: '#F59E0B', fontWeight: 800, textTransform: 'uppercase' }}>
                    👩‍🏫 Educator Credentials:
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    <input
                      type="text"
                      placeholder="TSC Reg No. (Optional)"
                      value={regForm.tscNumber}
                      onChange={(e) => setRegForm({ ...regForm, tscNumber: e.target.value })}
                      style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-card)', borderRadius: '8px', padding: '7px 10px', color: '#fff', fontSize: '0.82rem' }}
                    />
                    <input
                      type="number"
                      placeholder="Hourly Rate KES (1500)"
                      value={regForm.hourlyRateKes}
                      onChange={(e) => setRegForm({ ...regForm, hourlyRateKes: e.target.value })}
                      style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-card)', borderRadius: '8px', padding: '7px 10px', color: '#fff', fontSize: '0.82rem' }}
                    />
                  </div>
                </div>
              )}

              {/* CREATOR SPECIFIC FIELDS */}
              {registerRole === 'creator' && (
                <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)', borderRadius: '10px', padding: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ fontSize: '0.7rem', color: '#F472B6', fontWeight: 800, textTransform: 'uppercase' }}>
                    🎨 Social Media Handles:
                  </div>
                  <input
                    type="text"
                    placeholder="TikTok / Instagram handle (e.g. @mamateaches_ke)"
                    value={regForm.socialHandle}
                    onChange={(e) => setRegForm({ ...regForm, socialHandle: e.target.value })}
                    style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-card)', borderRadius: '8px', padding: '7px 10px', color: '#fff', fontSize: '0.82rem' }}
                  />
                </div>
              )}

              {successMsg && (
                <div style={{ color: '#34D399', fontSize: '0.82rem', fontWeight: 800, textAlign: 'center' }}>
                  ✓ {successMsg}
                </div>
              )}
              {error && <div style={{ color: '#EF4444', fontSize: '0.76rem' }}>{error}</div>}

              <button type="submit" disabled={isLoading} className="btn-primary" style={{ justifyContent: 'center', marginTop: '4px', padding: '10px' }}>
                {isLoading ? 'Creating Account...' : '✨ Create Free Account'}
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
