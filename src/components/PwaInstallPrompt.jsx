import React, { useState, useEffect } from 'react';
import { Download, Smartphone, X, CheckCircle2, Sparkles, Share2, PlusSquare } from 'lucide-react';

export default function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isInstalledToast, setIsInstalledToast] = useState(false);

  useEffect(() => {
    // Check if already in standalone / installed mode
    const isRunningStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
    setIsStandalone(isRunningStandalone);

    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIosDevice);

    // Capture standard PWA beforeinstallprompt event
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      window.somahomeDeferredPrompt = e;

      // Check if user dismissed recently (within 24h)
      const lastDismissed = localStorage.getItem('somahome_pwa_dismissed');
      if (!lastDismissed || Date.now() - parseInt(lastDismissed, 10) > 24 * 60 * 60 * 1000) {
        setIsVisible(true);
      }
    };

    // Custom event to manually trigger install prompt from Header / Menu
    const handleManualTrigger = () => {
      setIsVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('somahome_trigger_pwa_install', handleManualTrigger);

    window.addEventListener('appinstalled', () => {
      setDeferredPrompt(null);
      window.somahomeDeferredPrompt = null;
      setIsVisible(false);
      setIsStandalone(true);
      setIsInstalledToast(true);
      setTimeout(() => setIsInstalledToast(false), 4000);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('somahome_trigger_pwa_install', handleManualTrigger);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        setIsVisible(false);
        setDeferredPrompt(null);
      }
    } else if (isIOS) {
      // iOS cannot trigger programmatically, keep modal open to show step-by-step guidance
    } else {
      // Fallback for browsers that don't support beforeinstallprompt
      alert('To install SomaHome:\n1. Tap your browser menu (⋮ or Share)\n2. Select "Install App" or "Add to Home Screen"');
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    try {
      localStorage.setItem('somahome_pwa_dismissed', Date.now().toString());
    } catch (e) {}
  };

  if (isStandalone) {
    return null; // Already running in standalone PWA app!
  }

  return (
    <>
      {/* Toast when installation succeeds */}
      {isInstalledToast && (
        <div style={{
          position: 'fixed',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10000,
          background: 'linear-gradient(135deg, #00A651 0%, #059669 100%)',
          color: '#FFFFFF',
          padding: '12px 20px',
          borderRadius: '12px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontWeight: 700,
          fontSize: '0.9rem'
        }}>
          <CheckCircle2 size={20} color="#FFFFFF" />
          <span>SomaHome App successfully installed on your device! 🚀</span>
        </div>
      )}

      {/* Interactive Install Modal / Bottom Sheet */}
      {isVisible && (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 'calc(100% - 32px)',
          maxWidth: '460px',
          zIndex: 9999,
          background: 'linear-gradient(135deg, #0A192F 0%, #0F172A 100%)',
          border: '2px solid rgba(0, 166, 81, 0.6)',
          borderRadius: '20px',
          padding: '20px',
          boxShadow: '0 20px 50px rgba(0,0,0,0.8), 0 0 25px rgba(0,166,81,0.25)',
          backdropFilter: 'blur(16px)',
          animation: 'slideUp 0.3s ease-out'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <img 
                src="/pwa-192x192.png" 
                alt="SomaHome Icon" 
                style={{ width: '48px', height: '48px', borderRadius: '12px', border: '1px solid rgba(52, 211, 153, 0.4)' }} 
              />
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 900, color: '#FFFFFF' }}>Install SomaHome App</h4>
                  <span style={{ fontSize: '0.68rem', background: 'rgba(0,166,81,0.2)', color: '#34D399', padding: '2px 6px', borderRadius: '6px', fontWeight: 800 }}>PWA Official</span>
                </div>
                <p style={{ margin: '2px 0 0 0', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                  Fast homescreen access & offline lesson plans
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleDismiss}
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: 'none',
                color: 'var(--text-muted)',
                borderRadius: '50%',
                width: '28px',
                height: '28px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              title="Dismiss"
            >
              <X size={16} />
            </button>
          </div>

          {/* iOS Guidance or Standard Install Button */}
          {isIOS ? (
            <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '12px', padding: '12px', border: '1px solid var(--border-subtle)', marginBottom: '14px' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#38BDF8', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Share2 size={16} /> Follow 2 quick steps to install on iOS:
              </div>
              <div style={{ fontSize: '0.78rem', color: '#CBD5E1', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div>1. Tap the <strong>Share</strong> button ( <Share2 size={12} style={{ display: 'inline' }} /> ) at the bottom of Safari.</div>
                <div>2. Scroll down and select <strong>Add to Home Screen</strong> ( <PlusSquare size={12} style={{ display: 'inline' }} /> ).</div>
              </div>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '14px', fontSize: '0.74rem', color: '#94A3B8' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={14} color="#34D399" /> <span>No app store required</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={14} color="#34D399" /> <span>Works offline</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={14} color="#34D399" /> <span>Zero storage clutter</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={14} color="#34D399" /> <span>Instant 1-tap launch</span>
              </div>
            </div>
          )}

          <div style={{ display: 'flex', gap: '10px' }}>
            {!isIOS && (
              <button
                type="button"
                onClick={handleInstallClick}
                className="btn-primary"
                style={{
                  flex: 1,
                  padding: '12px',
                  justifyContent: 'center',
                  fontSize: '0.92rem',
                  fontWeight: 800,
                  boxShadow: '0 4px 18px rgba(0, 166, 81, 0.4)'
                }}
              >
                <Download size={18} />
                <span>Install App Now</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleDismiss}
              className="btn-secondary"
              style={{
                flex: isIOS ? 1 : 'none',
                padding: '12px 18px',
                justifyContent: 'center',
                fontSize: '0.86rem',
                color: 'var(--text-secondary)'
              }}
            >
              {isIOS ? 'Got it 👍' : 'Not Now'}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
