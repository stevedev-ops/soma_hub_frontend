import React, { useState } from 'react';
import { X, Eye, Type, Clock, Zap, Check, AlertCircle } from 'lucide-react';
import { senStore } from '../../services/portfolioStore';

export function applySENSettings(settings) {
  const root = document.documentElement;
  // Dyslexia font
  if (settings.dyslexiaFont) {
    root.style.setProperty('--font-body', "'OpenDyslexic', 'Lexie Readable', sans-serif");
    if (!document.getElementById('dyslexia-font-link')) {
      const link = document.createElement('link');
      link.id = 'dyslexia-font-link';
      link.rel = 'stylesheet';
      link.href = 'https://fonts.cdnfonts.com/css/opendyslexic';
      document.head.appendChild(link);
    }
  } else {
    root.style.setProperty('--font-body', "'Inter', 'Outfit', sans-serif");
  }

  // High contrast
  if (settings.highContrast) {
    document.body.classList.add('sen-high-contrast');
  } else {
    document.body.classList.remove('sen-high-contrast');
  }

  // Large fonts
  if (settings.largeFonts) {
    root.style.setProperty('--base-font-size', '18px');
    document.body.classList.add('sen-large-font');
  } else {
    root.style.setProperty('--base-font-size', '15px');
    document.body.classList.remove('sen-large-font');
  }
}

export default function SENSettingsModal({ isOpen, onClose }) {
  const [settings, setSettings] = useState(() => senStore.get());
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  const toggle = (key) => setSettings(p => ({ ...p, [key]: !p[key] }));

  const handleSave = () => {
    senStore.save(settings);
    applySENSettings(settings);
    setSaved(true);
    setTimeout(() => { setSaved(false); onClose(); }, 1200);
  };

  const options = [
    {
      key: 'dyslexiaFont',
      icon: <Type size={20} color="#818CF8" />,
      label: 'Dyslexia-Friendly Font (OpenDyslexic)',
      desc: 'Replaces the default font with OpenDyslexic — designed to reduce letter-reversal confusion for learners with dyslexia.',
      color: '#818CF8',
    },
    {
      key: 'highContrast',
      icon: <Eye size={20} color="#F59E0B" />,
      label: 'High Contrast Mode',
      desc: 'Increases text contrast ratio to 7:1 (WCAG AAA standard). Helpful for learners with low vision or visual processing difficulties.',
      color: '#F59E0B',
    },
    {
      key: 'largeFonts',
      icon: <Zap size={20} color="#10B981" />,
      label: 'Large Text Mode',
      desc: 'Increases base font size from 15px to 18px across the whole platform. Reduces eye strain for young readers.',
      color: '#10B981',
    },
    {
      key: 'extendedTime',
      icon: <Clock size={20} color="#38BDF8" />,
      label: 'Extended Time Mode (+50%)',
      desc: 'Adds 50% extra time to all timed activities (revision tests, homework countdowns). Aligns with KNEC accommodations policy for learners with SEN.',
      color: '#38BDF8',
    },
  ];

  return (
    <div onClick={(e) => e.target === e.currentTarget && onClose()} style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(5,10,15,0.88)', backdropFilter: 'blur(14px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px' }}>
      <div style={{ width: '100%', maxWidth: '480px', background: 'var(--bg-card)', borderRadius: '22px', border: '1px solid var(--border-card)', boxShadow: '0 24px 60px -10px rgba(0,0,0,0.85)', overflow: 'hidden' }}>

        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(129,140,248,0.06)' }}>
          <div>
            <div style={{ fontSize: '0.68rem', textTransform: 'uppercase', fontWeight: 800, color: '#818CF8', marginBottom: '4px' }}>Accessibility & SEN Support</div>
            <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Learning Accommodation Settings</h3>
          </div>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '6px', cursor: 'pointer', display: 'flex', color: 'var(--text-secondary)' }}>
            <X size={16} />
          </button>
        </div>

        <div style={{ padding: '22px 24px' }}>
          <div style={{ background: 'rgba(129,140,248,0.07)', border: '1px solid rgba(129,140,248,0.2)', borderRadius: '10px', padding: '10px 14px', marginBottom: '18px', fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
            <strong style={{ color: '#818CF8' }}>SEN Accommodations</strong> are aligned with Kenya's <em>Basic Education Act 2013</em> and KNEC accommodation guidelines for learners with Special Educational Needs.
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '22px' }}>
            {options.map(opt => (
              <div
                key={opt.key}
                onClick={() => toggle(opt.key)}
                style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', background: settings[opt.key] ? `rgba(${opt.color === '#818CF8' ? '129,140,248' : opt.color === '#F59E0B' ? '245,158,11' : opt.color === '#10B981' ? '16,185,129' : '56,189,248'},0.08)` : 'rgba(255,255,255,0.03)', border: `1.5px solid ${settings[opt.key] ? opt.color + '50' : 'var(--border-subtle)'}`, borderRadius: '12px', padding: '14px 16px', cursor: 'pointer', transition: 'all 0.2s' }}
              >
                <div style={{ flexShrink: 0, marginTop: '1px' }}>{opt.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.88rem', fontWeight: 700, color: settings[opt.key] ? opt.color : '#F8FAFC', marginBottom: '3px' }}>{opt.label}</div>
                  <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>{opt.desc}</div>
                </div>
                <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: settings[opt.key] ? opt.color : 'transparent', border: `2px solid ${settings[opt.key] ? opt.color : 'var(--border-card)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {settings[opt.key] && <Check size={12} color="#fff" />}
                </div>
              </div>
            ))}
          </div>

          <button onClick={handleSave} className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '12px', fontSize: '0.95rem' }}>
            {saved ? '✅ Settings Applied!' : '💾 Save Accommodation Settings'}
          </button>
        </div>
      </div>
    </div>
  );
}
