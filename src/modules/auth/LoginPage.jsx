import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { Lock, Smartphone, UserCheck, Users, ShieldCheck, X, Sparkles, GraduationCap, UserPlus, LogIn, CheckCircle } from 'lucide-react';

export default function LoginPage({ onClose }) {
  const { loginWithCredentials } = useAuth();
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
    socialHandle: '',
    socialPlatform: 'TikTok & Instagram',
    bio: ''
  });

  const handleFormLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      await loginWithCredentials(username, password);
      if (onClose) onClose();
    } catch (err) {
      setError(err?.message || 'Invalid credentials. Please verify your phone/username and password.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelfRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const registered = await api.register({
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

      // Automatically log the newly registered user in
      await loginWithCredentials(regForm.phone || regForm.fullName.toLowerCase().replace(/\s+/g, '_'), regForm.password || 'Pass1234!');
      if (onClose) onClose();
    } catch (err) {
      setError(err?.message || 'Registration failed. Please verify your inputs.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 99999, padding: '16px'
    }}>
      <div className="glass-panel" style={{
        maxWidth: '520px', width: '100%', background: '#0F172A', borderRadius: '24px',
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
            Turnkey Homeschool-in-a-Box &amp; Micro-Pod Network
          </p>
        </div>

        {/* TAB SWITCHER: SIGN IN vs CREATE ACCOUNT */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', background: 'rgba(255,255,255,0.04)',
          padding: '4px', borderRadius: '12px', marginBottom: '20px'
        }}>
          <button
            type="button"
            onClick={() => { setAuthMode('login'); setError(''); }}
            style={{
              padding: '10px', borderRadius: '8px', fontSize: '0.84rem', fontWeight: 800, cursor: 'pointer',
              background: authMode === 'login' ? '#00A651' : 'transparent',
              color: authMode === 'login' ? '#FFFFFF' : 'var(--text-muted)',
              border: 'none', transition: 'all 0.15s ease'
            }}
          >
            <LogIn size={14} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setAuthMode('register'); setError(''); }}
            style={{
              padding: '10px', borderRadius: '8px', fontSize: '0.84rem', fontWeight: 800, cursor: 'pointer',
              background: authMode === 'register' ? '#00A651' : 'transparent',
              color: authMode === 'register' ? '#FFFFFF' : 'var(--text-muted)',
              border: 'none', transition: 'all 0.15s ease'
            }}
          >
            <UserPlus size={14} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />
            Create Account
          </button>
        </div>

        {/* VIEW 1: SIGN IN FORM */}
        {authMode === 'login' && (
          <div>
            <form onSubmit={handleFormLogin} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '5px', fontWeight: 600 }}>
                  Phone Number or Username:
                </label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. 0712345678 or admin"
                  style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-card)', borderRadius: '10px', padding: '10px 14px', color: '#fff', fontSize: '0.9rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '5px', fontWeight: 600 }}>
                  Account Password:
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-card)', borderRadius: '10px', padding: '10px 14px', color: '#fff', fontSize: '0.9rem' }}
                />
              </div>

              {error && (
                <div style={{ color: '#EF4444', fontSize: '0.78rem', background: 'rgba(239,68,68,0.1)', padding: '8px 12px', borderRadius: '8px', border: '1px solid rgba(239,68,68,0.3)' }}>
                  ⚠️ {error}
                </div>
              )}

              <button type="submit" disabled={isLoading} className="btn-primary" style={{ justifyContent: 'center', marginTop: '6px', padding: '12px', fontSize: '0.92rem' }}>
                {isLoading ? 'Signing In...' : 'Sign In'}
              </button>

              <div style={{ textAlign: 'center', marginTop: '10px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Don't have an account yet?{' '}
                <button
                  type="button"
                  onClick={() => { setAuthMode('register'); setError(''); }}
                  style={{ background: 'none', border: 'none', color: '#34D399', fontWeight: 800, cursor: 'pointer', padding: 0 }}
                >
                  Create one here
                </button>
              </div>
            </form>
          </div>
        )}

        {/* VIEW 2: SELF-REGISTRATION FORM */}
        {authMode === 'register' && (
          <div>
            <div style={{ marginBottom: '14px' }}>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginBottom: '6px', fontWeight: 700 }}>
                Select Your Role:
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
                {[
                  { id: 'parent', label: '👨‍👩‍👧 Parent', desc: 'Homeschool My Child' },
                  { id: 'tutor', label: '👩‍🏫 Teacher', desc: 'Host Pods & Tutor' },
                  { id: 'creator', label: '🎨 Creator', desc: 'Publish Bio Links' }
                ].map(r => (
                  <button
                    type="button"
                    key={r.id}
                    onClick={() => setRegisterRole(r.id)}
                    style={{
                      padding: '8px 4px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      border: registerRole === r.id ? '2px solid #00A651' : '1px solid var(--border-subtle)',
                      background: registerRole === r.id ? 'rgba(0,166,81,0.15)' : 'rgba(255,255,255,0.02)',
                      color: registerRole === r.id ? '#FFFFFF' : 'var(--text-secondary)',
                      fontSize: '0.78rem',
                      fontWeight: 800,
                      textAlign: 'center'
                    }}
                  >
                    <div>{r.label}</div>
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSelfRegister} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.74rem', color: 'var(--text-muted)', marginBottom: '3px' }}>
                  Full Name:
                </label>
                <input
                  type="text"
                  required
                  placeholder={registerRole === 'tutor' ? 'e.g. Teacher David Maina' : registerRole === 'creator' ? 'e.g. Sarah Kariuki' : 'e.g. Grace Wanjiku'}
                  value={regForm.fullName}
                  onChange={(e) => setRegForm({ ...regForm, fullName: e.target.value })}
                  style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-card)', borderRadius: '8px', padding: '8px 12px', color: '#fff', fontSize: '0.85rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.74rem', color: 'var(--text-muted)', marginBottom: '3px' }}>
                    Kenyan Phone Number:
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
                    Estate / Location:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Kilimani, Nairobi"
                    value={regForm.estate}
                    onChange={(e) => setRegForm({ ...regForm, estate: e.target.value })}
                    style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-card)', borderRadius: '8px', padding: '8px 12px', color: '#fff', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.74rem', color: 'var(--text-muted)', marginBottom: '3px' }}>
                  Choose Password:
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={regForm.password}
                  onChange={(e) => setRegForm({ ...regForm, password: e.target.value })}
                  style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-card)', borderRadius: '8px', padding: '8px 12px', color: '#fff', fontSize: '0.85rem' }}
                />
              </div>

              {/* PARENT SPECIFIC FIELDS */}
              {registerRole === 'parent' && (
                <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)', borderRadius: '10px', padding: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ fontSize: '0.7rem', color: '#34D399', fontWeight: 800, textTransform: 'uppercase' }}>
                    👶 Your Child's Information:
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '8px' }}>
                    <input
                      type="text"
                      required
                      placeholder="Child's First Name"
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
                      <option value="Grade 7 (JSS CBC)">Grade 7 (JSS CBC)</option>
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
                    👩‍🏫 Educator Information:
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
                    🎨 Social Media Handle:
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="e.g. @mamateaches_ke"
                    value={regForm.socialHandle}
                    onChange={(e) => setRegForm({ ...regForm, socialHandle: e.target.value })}
                    style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-card)', borderRadius: '8px', padding: '7px 10px', color: '#fff', fontSize: '0.82rem' }}
                  />
                </div>
              )}

              {error && (
                <div style={{ color: '#EF4444', fontSize: '0.78rem', background: 'rgba(239,68,68,0.1)', padding: '8px 12px', borderRadius: '8px', border: '1px solid rgba(239,68,68,0.3)' }}>
                  ⚠️ {error}
                </div>
              )}

              <button type="submit" disabled={isLoading} className="btn-primary" style={{ justifyContent: 'center', marginTop: '4px', padding: '12px', fontSize: '0.92rem' }}>
                {isLoading ? 'Creating Account...' : '✨ Create Free Account'}
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
