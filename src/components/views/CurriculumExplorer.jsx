import React, { useState, useEffect } from 'react';
import { 
  BookOpen, Layers, CheckCircle2, Download, Upload, Plus, 
  Sparkles, ExternalLink, Globe, Scale, ArrowRight, X, FileText, Check, ShieldCheck, Star, Users
} from 'lucide-react';
import { frameworkRegistry } from '../../services/frameworkRegistry';

export default function CurriculumExplorer({ currentStudent, onSelectCurriculumForStudent, onOpenPrintable }) {
  const [frameworks, setFrameworks] = useState(() => frameworkRegistry.getFrameworks());
  const [selectedFrameworkId, setSelectedFrameworkId] = useState('kicd_cbc');
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importJsonText, setImportJsonText] = useState('');
  const [importError, setImportError] = useState('');
  const [importSuccess, setImportSuccess] = useState(false);
  const [appliedSuccessMsg, setAppliedSuccessMsg] = useState('');

  useEffect(() => {
    const handleUpdate = () => {
      setFrameworks(frameworkRegistry.getFrameworks());
    };
    window.addEventListener('framework_registry_updated', handleUpdate);
    return () => window.removeEventListener('framework_registry_updated', handleUpdate);
  }, []);

  const activeFw = frameworkRegistry.getFrameworkById(selectedFrameworkId) || frameworks[0];

  const handleApplyToChild = (fw) => {
    if (onSelectCurriculumForStudent && currentStudent) {
      onSelectCurriculumForStudent(currentStudent.id, {
        curriculum_code: fw.name.includes('CBC') ? 'CBC' : fw.name.includes('Cambridge') ? 'Cambridge' : fw.name.includes('IB') ? 'IB PYP' : fw.name.includes('Montessori') ? 'Montessori' : 'Custom',
        grade_level: currentStudent.grade || 'Grade 4'
      });
    }
    setAppliedSuccessMsg(`✓ Switched ${currentStudent?.name || 'Child'} to ${fw.name}!`);
    setTimeout(() => setAppliedSuccessMsg(''), 3000);
  };

  const handleImportSubmit = (e) => {
    e.preventDefault();
    setImportError('');
    try {
      const parsed = JSON.parse(importJsonText);
      const res = frameworkRegistry.registerFramework(parsed);
      if (res) {
        setImportSuccess(true);
        setTimeout(() => {
          setIsImportModalOpen(false);
          setImportSuccess(false);
          setSelectedFrameworkId(res.frameworkId);
        }, 1200);
      } else {
        setImportError('Failed to register framework. Ensure frameworkId and name exist.');
      }
    } catch (err) {
      setImportError('Invalid JSON format. Please check syntax.');
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', paddingBottom: '60px' }}>
      
      {/* Hero Header */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(0, 166, 81, 0.15) 0%, rgba(15, 23, 42, 0.95) 100%)',
        border: '1px solid rgba(0, 166, 81, 0.35)', borderRadius: '24px', padding: '26px', marginBottom: '24px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span style={{ background: 'rgba(0,166,81,0.2)', color: '#34D399', fontSize: '0.72rem', fontWeight: 800, padding: '2px 8px', borderRadius: '12px' }}>
              Universal Pluggable Architecture
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Open Schema Adapter Engine
            </span>
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 900, margin: '0 0 4px 0', color: '#FFFFFF' }}>
            Curriculum Frameworks & Syllabi Hub
          </h1>
          <p style={{ margin: 0, fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
            Plug in any national or alternative philosophy: KICD CBC, British Cambridge, IB PYP, Montessori, Charlotte Mason, or Custom Creator JSON Packs.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setIsImportModalOpen(true)}
            className="btn-secondary"
            style={{ fontSize: '0.82rem', padding: '8px 14px', gap: '6px' }}
          >
            <Upload size={14} />
            <span>Import Framework (JSON)</span>
          </button>

          <button
            onClick={() => frameworkRegistry.exportFramework(activeFw.frameworkId)}
            className="btn-secondary"
            style={{ fontSize: '0.82rem', padding: '8px 14px', gap: '6px' }}
          >
            <Download size={14} />
            <span>Export JSON Pack</span>
          </button>
        </div>
      </div>

      {appliedSuccessMsg && (
        <div style={{ background: 'rgba(0,166,81,0.2)', border: '1px solid #00A651', color: '#34D399', padding: '12px', borderRadius: '12px', marginBottom: '18px', fontWeight: 800, textAlign: 'center' }}>
          {appliedSuccessMsg}
        </div>
      )}

      {/* PLUGGABLE FRAMEWORK SELECTOR CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px', marginBottom: '24px' }}>
        {frameworks.map((fw) => {
          const isSelected = selectedFrameworkId === fw.frameworkId;
          return (
            <div
              key={fw.frameworkId}
              onClick={() => setSelectedFrameworkId(fw.frameworkId)}
              className="glass-panel"
              style={{
                padding: '16px', borderRadius: '16px', cursor: 'pointer',
                border: isSelected ? '2px solid #00A651' : '1px solid var(--border-card)',
                background: isSelected ? 'linear-gradient(135deg, rgba(0, 166, 81, 0.15) 0%, rgba(15, 23, 42, 0.9) 100%)' : 'rgba(255,255,255,0.02)',
                transition: 'all 0.15s ease'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ fontSize: '0.68rem', background: 'rgba(255,255,255,0.06)', color: '#F8FAFC', padding: '2px 6px', borderRadius: '6px', fontWeight: 800 }}>
                  {fw.region || 'Global'}
                </span>
                {isSelected && <Check size={16} color="#34D399" />}
              </div>

              <h3 style={{ fontSize: '0.95rem', fontWeight: 800, margin: '0 0 4px 0', color: '#FFFFFF' }}>
                {fw.name}
              </h3>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                {fw.badge}
              </div>
            </div>
          );
        })}
      </div>

      {/* DETAILED FRAMEWORK SCHEMA INSPECTOR */}
      <div className="glass-panel" style={{ padding: '28px', borderRadius: '22px' }}>
        
        {/* Top Header for Selected Framework */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '20px', marginBottom: '20px' }}>
          <div>
            <div style={{ fontSize: '0.72rem', color: '#34D399', fontWeight: 800, textTransform: 'uppercase', marginBottom: '4px' }}>
              Active Specification Schema: {activeFw.frameworkId}
            </div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 900, margin: '0 0 6px 0', color: '#FFFFFF' }}>
              {activeFw.name}
            </h2>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              {activeFw.philosophy}
            </p>
          </div>

          <button
            onClick={() => handleApplyToChild(activeFw)}
            className="btn-primary"
            style={{ fontSize: '0.85rem', padding: '10px 18px', gap: '8px' }}
          >
            <Sparkles size={16} />
            <span>Apply to {currentStudent?.name || 'Active Student'}</span>
          </button>
        </div>

        {/* 4 Schema Pillar Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '24px' }}>
          
          {/* 1. Pedagogy & Daily Pacing */}
          <div style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '14px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.72rem', color: '#F59E0B', fontWeight: 800, textTransform: 'uppercase', marginBottom: '6px' }}>
              ⏱️ Pedagogical Model & Pacing:
            </div>
            <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '4px' }}>
              {activeFw.pedagogyModel?.sessionFormat?.replace(/_/g, ' ').toUpperCase()}
            </div>
            <p style={{ margin: 0, fontSize: '0.8rem', color: '#CBD5E1', lineHeight: 1.45 }}>
              {activeFw.pedagogyModel?.deliveryStyle}
            </p>
            <div style={{ marginTop: '10px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Typical Day: <strong>{activeFw.structure?.typicalDailyHours}h focus block</strong> • {activeFw.structure?.termsPerYear} terms/yr
            </div>
          </div>

          {/* 2. Assessment & Rubric Scale */}
          <div style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '14px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.72rem', color: '#60A5FA', fontWeight: 800, textTransform: 'uppercase', marginBottom: '6px' }}>
              📊 Assessment & Rubric Scale:
            </div>
            <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '6px' }}>
              Type: {activeFw.assessmentScale?.type?.replace(/_/g, ' ').toUpperCase()}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {activeFw.assessmentScale?.levels?.map((lvl, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.76rem', background: 'rgba(255,255,255,0.03)', padding: '4px 8px', borderRadius: '6px' }}>
                  <span style={{ color: lvl.color, fontWeight: 800 }}>{lvl.code}</span>
                  <span style={{ color: '#E2E8F0' }}>{lvl.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Official Recognition Pathway */}
          <div style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '14px', border: '1px solid var(--border-subtle)', gridColumn: 'span 1' }}>
            <div style={{ fontSize: '0.72rem', color: '#34D399', fontWeight: 800, textTransform: 'uppercase', marginBottom: '6px' }}>
              ⚖️ Official Recognition Pathway:
            </div>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '4px' }}>
              {activeFw.recognitionPathway?.pathwayName}
            </div>
            <p style={{ margin: '0 0 6px 0', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              Authority: <strong style={{ color: '#F8FAFC' }}>{activeFw.recognitionPathway?.authority}</strong>
            </p>
            <p style={{ margin: 0, fontSize: '0.78rem', color: '#94A3B8', lineHeight: 1.4 }}>
              {activeFw.recognitionPathway?.guidelines}
            </p>
          </div>

        </div>

        {/* Learning Areas & Subjects Grid */}
        <div>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: '0 0 12px 0', color: '#FFFFFF' }}>
            📚 Core Learning Areas & Practical Strands ({activeFw.learningAreas?.length})
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px' }}>
            {activeFw.learningAreas?.map((sub, sIdx) => (
              <div key={sIdx} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-card)', borderRadius: '10px', padding: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '1.2rem' }}>{sub.icon || '📖'}</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.84rem', color: '#FFFFFF' }}>{sub.title}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{sub.strandType}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* MODAL: IMPORT FRAMEWORK PACK */}
      {isImportModalOpen && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 99999, padding: '16px'
        }}>
          <div className="glass-panel" style={{
            maxWidth: '600px', width: '100%', background: '#0F172A', borderRadius: '24px',
            border: '1px solid #00A651', padding: '28px', maxHeight: '90vh', overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 900, margin: 0, color: '#FFFFFF' }}>
                📥 Import Pluggable Framework Pack
              </h3>
              <button onClick={() => setIsImportModalOpen(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: '0 0 14px 0' }}>
              Paste your custom curriculum schema JSON below (e.g. Waldorf, Singapore Math, or Custom Creator Hybrid).
            </p>

            <form onSubmit={handleImportSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <textarea
                rows={10}
                required
                placeholder='{
  "frameworkId": "waldorf_primary",
  "name": "Waldorf Steiner Experiential Framework",
  ...
}'
                value={importJsonText}
                onChange={(e) => setImportJsonText(e.target.value)}
                style={{
                  width: '100%', background: 'rgba(0,0,0,0.4)', border: '1px solid var(--border-card)',
                  borderRadius: '10px', padding: '12px', color: '#34D399', fontFamily: 'monospace', fontSize: '0.8rem'
                }}
              />

              {importSuccess && <div style={{ color: '#34D399', fontWeight: 800, fontSize: '0.85rem' }}>✓ Framework Loaded & Registered!</div>}
              {importError && <div style={{ color: '#EF4444', fontSize: '0.78rem' }}>{importError}</div>}

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setIsImportModalOpen(false)}
                  className="btn-secondary"
                  style={{ flex: 1, padding: '10px', justifyContent: 'center' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  style={{ flex: 1, padding: '10px', justifyContent: 'center' }}
                >
                  Register Framework Pack
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
