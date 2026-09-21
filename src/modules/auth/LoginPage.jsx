import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { 
  Lock, Smartphone, UserCheck, Users, ShieldCheck, X, Sparkles, 
  GraduationCap, UserPlus, LogIn, CheckCircle, KeyRound, ArrowRight, ArrowLeft 
} from 'lucide-react';

export default function LoginPage({ onClose }) {
  const { loginWithCredentials, loginWithStudentPin } = useAuth();
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'learner_pin' | 'register'
  const [registerRole, setRegisterRole] = useState('parent'); // 'parent' | 'tutor' | 'creator'

  // Credentials State
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Learner PIN State
  const [parentLookupQuery, setParentLookupQuery] = useState('');
  const [lookupResult, setLookupResult] = useState(null); // { parent_name, estate, learners }
  const [selectedLearner, setSelectedLearner] = useState(null);
  const [enteredPin, setEnteredPin] = useState('');

  // Self-Registration Form State
  const [regForm, setRegForm] = useState({
    fullName: '',
    phone: '',
    estate: 'Kilimani, Nairobi',
    password: '',
    childName: '',
    childGrade: 'Grade 4 (CBC)',
    childCurriculum: 'CBC',
    tscNumber: '',
    hourlyRateKes: '1500',
    subjects: 'Mathematics & Science',
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

  const handleParentLookup = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const data = await api.lookupLearners(parentLookupQuery);
      setLookupResult(data);
      if (data.learners && data.learners.length === 1) {
        setSelectedLearner(data.learners[0]);
      }
    } catch (err) {
      setError(err?.message || 'No family found for this phone number.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStudentPinSubmit = async (e) => {
    e.preventDefault();
    if (!selectedLearner) return;
    setIsLoading(true);
    setError('');
    try {
      await loginWithStudentPin(selectedLearner.id, enteredPin || '1234');
      if (onClose) onClose();
    } catch (err) {
      setError(err?.message || 'Incorrect PIN code.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelfRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
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

        {/* 3-WAY TAB SWITCHER */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1.2fr 1fr', gap: '4px', background: 'rgba(255,255,255,0.04)',
          padding: '4px', borderRadius: '12px', marginBottom: '20px'
        }}>
          <button
            type="button"
            onClick={() => { setAuthMode('login'); setError(''); }}
            style={{
              padding: '9px 4px', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 800, cursor: 'pointer',
              background: authMode === 'login' ? '#00A651' : 'transparent',
              color: authMode === 'login' ? '#FFFFFF' : 'var(--text-muted)',
              border: 'none', transition: 'all 0.15s ease', textAlign: 'center'
            }}
          >
            <LogIn size={13} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
            Sign In
          </button>

          <button
            type="button"
            onClick={() => { setAuthMode('learner_pin'); setError(''); }}
            style={{
              padding: '9px 4px', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 800, cursor: 'pointer',
              background: authMode === 'learner_pin' ? '#38BDF8' : 'transparent',
              color: authMode === 'learner_pin' ? '#0F172A' : '#38BDF8',
              border: 'none', transition: 'all 0.15s ease', textAlign: 'center'
            }}
          >
            <KeyRound size={13} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
            👶 Learner PIN
          </button>

          <button
            type="button"
            onClick={() => { setAuthMode('register'); setError(''); }}
            style={{
              padding: '9px 4px', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 800, cursor: 'pointer',
              background: authMode === 'register' ? '#00A651' : 'transparent',
              color: authMode === 'register' ? '#FFFFFF' : 'var(--text-muted)',
              border: 'none', transition: 'all 0.15s ease', textAlign: 'center'
            }}
          >
            <UserPlus size={13} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
            Register
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
                  placeholder="e.g. 0712345678 or student username"
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
                <div style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid #EF4444', color: '#F87171', padding: '10px 12px', borderRadius: '8px', fontSize: '0.82rem' }}>
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary"
                style={{ width: '100%', padding: '12px', justifyContent: 'center', fontSize: '0.95rem', fontWeight: 800, marginTop: '4px' }}
              >
                {isLoading ? 'Signing In...' : 'Sign In to SomaHome'}
              </button>
            </form>
          </div>
        )}

        {/* VIEW 2: 👶 LEARNER TABLET / 4-DIGIT PIN LOGIN */}
        {authMode === 'learner_pin' && (
          <div>
            {!lookupResult ? (
              <form onSubmit={handleParentLookup} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ background: 'rgba(56, 189, 248, 0.1)', border: '1px solid rgba(56, 189, 248, 0.3)', borderRadius: '12px', padding: '12px 14px', fontSize: '0.82rem', color: '#38BDF8', lineHeight: 1.4 }}>
                  📱 <strong>Tablet Learner Login</strong>: Enter your parent's phone number to find your child profile and enter your 4-digit PIN!
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '5px', fontWeight: 600 }}>
                    Parent Phone Number:
                  </label>
                  <input
                    type="text"
                    required
                    value={parentLookupQuery}
                    onChange={(e) => setParentLookupQuery(e.target.value)}
                    placeholder="e.g. 0711223344"
                    style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-card)', borderRadius: '10px', padding: '10px 14px', color: '#fff', fontSize: '0.95rem' }}
                  />
                </div>

                {error && (
                  <div style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid #EF4444', color: '#F87171', padding: '10px 12px', borderRadius: '8px', fontSize: '0.82rem' }}>
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-primary"
                  style={{ width: '100%', padding: '12px', justifyContent: 'center', fontSize: '0.95rem', fontWeight: 800, background: '#0284C7' }}
                >
                  {isLoading ? 'Searching...' : 'Find My Family Learners 🔍'}
                </button>
              </form>
            ) : (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
                    🏡 Family: <strong>{lookupResult.parent_name}</strong>
                  </div>
                  <button
                    type="button"
                    onClick={() => { setLookupResult(null); setSelectedLearner(null); }}
                    style={{ background: 'transparent', border: 'none', color: '#38BDF8', fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '3px' }}
                  >
                    <ArrowLeft size={12} />
                    <span>Change Phone</span>
                  </button>
                </div>

                {/* Learner Avatar Selector */}
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700, marginBottom: '8px', textTransform: 'uppercase' }}>
                  Tap Your Name:
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px', marginBottom: '16px' }}>
                  {lookupResult.learners.map((learner) => {
                    const isSelected = selectedLearner?.id === learner.id;
                    return (
                      <div
                        key={learner.id}
                        onClick={() => setSelectedLearner(learner)}
                        style={{
                          background: isSelected ? 'rgba(56, 189, 248, 0.2)' : 'rgba(255,255,255,0.03)',
                          border: isSelected ? '2px solid #38BDF8' : '1px solid var(--border-subtle)',
                          borderRadius: '14px',
                          padding: '12px',
                          textAlign: 'center',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <img
                          src={learner.avatar}
                          alt={learner.name}
                          style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', margin: '0 auto 6px', border: isSelected ? '2px solid #38BDF8' : '2px solid transparent' }}
                        />
                        <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#F8FAFC' }}>
                          {learner.first_name || learner.name}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                          {learner.grade}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* 4-Digit PIN Input Form */}
                {selectedLearner && (
                  <form onSubmit={handleStudentPinSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '5px', fontWeight: 600 }}>
                        Enter 4-Digit PIN for {selectedLearner.first_name || selectedLearner.name}:
                      </label>
                      <input
                        type="password"
                        maxLength={6}
                        required
                        autoFocus
                        value={enteredPin}
                        onChange={(e) => setEnteredPin(e.target.value)}
                        placeholder="Default PIN: 1234"
                        style={{ width: '100%', textAlign: 'center', letterSpacing: '8px', fontSize: '1.4rem', fontWeight: 900, background: 'rgba(255,255,255,0.08)', border: '1px solid #38BDF8', borderRadius: '12px', padding: '10px 14px', color: '#fff' }}
                      />
                    </div>

                    {error && (
                      <div style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid #EF4444', color: '#F87171', padding: '10px 12px', borderRadius: '8px', fontSize: '0.82rem' }}>
                        {error}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="btn-primary"
                      style={{ width: '100%', padding: '12px', justifyContent: 'center', fontSize: '0.95rem', fontWeight: 800, background: 'linear-gradient(135deg, #0284C7 0%, #00A651 100%)' }}
                    >
                      {isLoading ? 'Unlocking Student OS...' : `🚀 Launch ${selectedLearner.first_name || selectedLearner.name}'s Dashboard`}
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>
        )}

        {/* VIEW 3: SELF-REGISTRATION FORM */}
        {authMode === 'register' && (
          <div>
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '0.74rem', color: 'var(--text-muted)', marginBottom: '6px', fontWeight: 700, textTransform: 'uppercase' }}>
                Select Your Role:
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
                {[
                  { id: 'parent', label: '🏡 Parent' },
                  { id: 'tutor', label: '👨‍🏫 Teacher' },
                  { id: 'creator', label: '🎨 Creator' }
                ].map((r) => (
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
                    type="tel"
                    required
                    placeholder="0712 345 678"
                    value={regForm.phone}
                    onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })}
                    style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-card)', borderRadius: '8px', padding: '8px 12px', color: '#fff', fontSize: '0.85rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.74rem', color: 'var(--text-muted)', marginBottom: '3px' }}>
                    Neighborhood / Estate:
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

              {/* Parent Specific Fields */}
              {registerRole === 'parent' && (
                <div style={{ background: 'rgba(0,166,81,0.08)', border: '1px solid rgba(0,166,81,0.25)', borderRadius: '10px', padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#34D399' }}>
                    👶 First Learner Profile (You can add more later)
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '2px' }}>Child Full Name:</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ethan Kariuki"
                      value={regForm.childName}
                      onChange={(e) => setRegForm({ ...regForm, childName: e.target.value })}
                      style={{ width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-card)', borderRadius: '6px', padding: '7px 10px', color: '#fff', fontSize: '0.82rem' }}
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '2px' }}>Curriculum:</label>
                      <select
                        value={regForm.childCurriculum}
                        onChange={(e) => setRegForm({ ...regForm, childCurriculum: e.target.value })}
                        className="custom-select"
                        style={{ width: '100%', padding: '6px 8px', fontSize: '0.78rem' }}
                      >
                        <option value="CBC">CBC (Kenya)</option>
                        <option value="Cambridge">Cambridge Primary</option>
                        <option value="ACE">A.C.E. Accelerated</option>
                        <option value="US_COMMON_CORE">US Common Core</option>
                        <option value="MONTESSORI">Montessori</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '2px' }}>Grade / Stage:</label>
                      <input
                        type="text"
                        placeholder="e.g. Grade 4"
                        value={regForm.childGrade}
                        onChange={(e) => setRegForm({ ...regForm, childGrade: e.target.value })}
                        style={{ width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-card)', borderRadius: '6px', padding: '7px 10px', color: '#fff', fontSize: '0.82rem' }}
                      />
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label style={{ display: 'block', fontSize: '0.74rem', color: 'var(--text-muted)', marginBottom: '3px' }}>
                  Create Account Password:
                </label>
                <input
                  type="password"
                  required
                  placeholder="At least 6 characters"
                  value={regForm.password}
                  onChange={(e) => setRegForm({ ...regForm, password: e.target.value })}
                  style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-card)', borderRadius: '8px', padding: '8px 12px', color: '#fff', fontSize: '0.85rem' }}
                />
              </div>

              {error && (
                <div style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid #EF4444', color: '#F87171', padding: '8px 10px', borderRadius: '8px', fontSize: '0.8rem' }}>
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary"
                style={{ width: '100%', padding: '11px', justifyContent: 'center', fontSize: '0.9rem', fontWeight: 800, marginTop: '4px' }}
              >
                {isLoading ? 'Creating Account...' : 'Complete Self-Registration 🚀'}
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
