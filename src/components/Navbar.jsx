import React from 'react';
import { BookOpen, Calendar, Award, Users, ShoppingBag, Printer, Sparkles, Smartphone } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, activeStudent, setActiveStudent, onOpenPrintable }) {
  return (
    <header className="glass-panel" style={{ margin: '16px auto', maxWidth: '1280px', padding: '12px 24px', borderRadius: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '42px', height: '42px', borderRadius: '12px',
            background: 'linear-gradient(135deg, #00A651 0%, #059669 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.4rem', boxShadow: '0 4px 12px rgba(0,166,81,0.4)'
          }}>
            🇰🇪
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ fontSize: '1.35rem', margin: 0, fontWeight: 800 }}>SomaHome</h1>
              <span className="glass-pill" style={{ fontSize: '0.72rem', color: '#10B981', border: '1px solid rgba(16,185,129,0.3)' }}>
                Kenya
              </span>
            </div>
            <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              Elimu Bila Stress • Turnkey Homeschool-in-a-Box
            </p>
          </div>
        </div>

        {/* Student Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,0.04)', padding: '6px 14px', borderRadius: '30px', border: '1px solid var(--border-subtle)' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Child:</span>
          <button 
            onClick={() => setActiveStudent('liam')}
            style={{
              background: activeStudent === 'liam' ? 'rgba(0, 166, 81, 0.25)' : 'transparent',
              color: activeStudent === 'liam' ? '#34D399' : 'var(--text-secondary)',
              border: activeStudent === 'liam' ? '1px solid #00A651' : 'none',
              borderRadius: '20px', padding: '4px 12px', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '6px'
            }}
          >
            <span>👦</span> Liam (G4 CBC)
          </button>
          <button 
            onClick={() => setActiveStudent('maya')}
            style={{
              background: activeStudent === 'maya' ? 'rgba(59, 130, 246, 0.25)' : 'transparent',
              color: activeStudent === 'maya' ? '#60A5FA' : 'var(--text-secondary)',
              border: activeStudent === 'maya' ? '1px solid #3B82F6' : 'none',
              borderRadius: '20px', padding: '4px 12px', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '6px'
            }}
          >
            <span>👧</span> Maya (Yr 5 Camb.)
          </button>
        </div>

        {/* Action Button: Sunday Batch Print */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button 
            onClick={onOpenPrintable}
            className="btn-secondary"
            style={{ fontSize: '0.85rem', padding: '8px 14px' }}
          >
            <Printer size={16} color="#F59E0B" />
            <span>Sunday Print Pack</span>
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(0,166,81,0.1)', border: '1px solid rgba(0,166,81,0.3)', padding: '6px 12px', borderRadius: '8px' }}>
            <span style={{ fontSize: '0.75rem', color: '#34D399', fontWeight: 600 }}>M-PESA ACTIVE</span>
          </div>
        </div>

      </div>

      {/* Main Tabs Navigation */}
      <nav style={{ display: 'flex', gap: '8px', marginTop: '16px', borderTop: '1px solid var(--border-subtle)', paddingTop: '12px', overflowX: 'auto' }}>
        {[
          { id: 'daily', label: "Today's Homeschool OS", icon: Calendar, badge: '3 Hrs/Day' },
          { id: 'catalog', label: 'Homeschool-in-a-Box Catalog', icon: ShoppingBag },
          { id: 'science', label: 'Local Materials Science Lab', icon: Sparkles, badge: 'Kitchen Science' },
          { id: 'report', label: 'Official CBC Report Card', icon: Award, badge: 'KICD Rubric' },
          { id: 'marketplace', label: 'Estate Pods & Vetted Tutors', icon: Users, badge: 'Nairobi' },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                background: isActive ? 'linear-gradient(135deg, rgba(0,166,81,0.2) 0%, rgba(5,150,105,0.15) 100%)' : 'transparent',
                color: isActive ? '#34D399' : 'var(--text-secondary)',
                border: isActive ? '1px solid rgba(0,166,81,0.4)' : '1px solid transparent',
                borderRadius: '10px',
                padding: '8px 16px',
                fontSize: '0.88rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease'
              }}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
              {tab.badge && (
                <span style={{
                  fontSize: '0.68rem',
                  background: isActive ? 'rgba(0,166,81,0.3)' : 'rgba(255,255,255,0.06)',
                  color: isActive ? '#FFFFFF' : 'var(--text-muted)',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  fontWeight: 700
                }}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </header>
  );
}