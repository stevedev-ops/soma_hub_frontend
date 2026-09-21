import React, { useState } from 'react';
import { Check, ShieldCheck, Smartphone, Filter } from 'lucide-react';

export default function BoxCatalog({ packages, onBuyPackage }) {
  const [curriculumFilter, setCurriculumFilter] = useState('ALL');

  const filteredPackages = curriculumFilter === 'ALL'
    ? packages
    : packages.filter((p) => p.curriculum_code === curriculumFilter);

  return (
    <div>
      {/* Hero Header & Filter */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px', flexWrap: 'wrap', gap: '20px' }}>
        <div>
          <span className="glass-pill" style={{ color: '#F59E0B', border: '1px solid rgba(245,158,11,0.3)', marginBottom: '10px', display: 'inline-block' }}>
            🇰🇪 Term 1 • 2026 Academic Season
          </span>
          <h2 style={{ fontSize: '1.8rem', margin: 0, fontWeight: 800 }}>
            Homeschool-in-a-Box Packages
          </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '650px', fontSize: '0.95rem', margin: '4px 0 0 0' }}>
            Turnkey 12-week curriculum boxes with zero parent prep, household science practicals, and official report cards.
          </p>
        </div>

        {/* CURRICULUM DROPDOWN FILTER */}
        <div>
          <label style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>
            Filter by Curriculum:
          </label>
          <select
            className="custom-select"
            value={curriculumFilter}
            onChange={(e) => setCurriculumFilter(e.target.value)}
            style={{ minWidth: '240px' }}
          >
            <option value="ALL">📚 All Curricula (CBC & Cambridge)</option>
            <option value="CBC">🇰🇪 CBC (Kenya Competency Based)</option>
            <option value="CAMBRIDGE">🇬🇧 Cambridge Primary (UK)</option>
          </select>
        </div>
      </div>

      {/* Package Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '30px' }}>
        {filteredPackages.map((pkg) => {
          const isCBC = pkg.curriculum_code === 'CBC';
          return (
            <div
              key={pkg.id}
              className="glass-panel"
              style={{
                padding: '32px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                border: isCBC ? '1.5px solid rgba(0,166,81,0.5)' : '1px solid var(--border-card)',
                boxShadow: isCBC ? '0 15px 35px -5px rgba(0,166,81,0.15)' : 'var(--shadow-card)'
              }}
            >
              {/* Badge */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <span className={isCBC ? 'glass-pill badge-cbc' : 'glass-pill badge-cambridge'}>
                  {pkg.curriculum_code} • {pkg.grade_level}
                </span>
                <span style={{ fontSize: '0.78rem', background: 'rgba(245,158,11,0.15)', color: '#F59E0B', padding: '3px 10px', borderRadius: '12px', fontWeight: 700 }}>
                  {pkg.badge}
                </span>
              </div>

              {/* Title & Subtitle */}
              <div>
                <h3 style={{ fontSize: '1.45rem', marginBottom: '8px' }}>{pkg.title}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.5, marginBottom: '24px' }}>
                  {pkg.subtitle}
                </p>

                {/* Price Display */}
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '24px', paddingBottom: '20px', borderBottom: '1px solid var(--border-subtle)' }}>
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>KES</span>
                  <span style={{ fontSize: '2.5rem', fontWeight: 800, color: '#F8FAFC', letterSpacing: '-0.03em' }}>
                    {parseInt(pkg.price_kes).toLocaleString()}
                  </span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>/ Term (12 Weeks)</span>
                </div>

                {/* Features Checklist */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase' }}>
                    What's in the Box:
                  </div>
                  {pkg.features?.map((feat, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                      <div style={{
                        minWidth: '18px', height: '18px', borderRadius: '50%',
                        background: 'rgba(0,166,81,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#34D399', marginTop: '2px'
                      }}>
                        <Check size={12} strokeWidth={3} />
                      </div>
                      <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                        {feat}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Buy CTA with M-Pesa */}
              <div>
                <button
                  onClick={() => onBuyPackage(pkg)}
                  className="btn-primary"
                  style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: '1rem' }}
                >
                  <Smartphone size={18} />
                  <span>Instant Enroll with M-Pesa</span>
                </button>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px', marginTop: '10px' }}>
                  <ShieldCheck size={14} color="#10B981" />
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Daraja STK Push • Instant 12-Week PDF & Portal Unlock
                  </span>
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}