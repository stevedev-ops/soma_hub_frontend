import React, { useState } from 'react';
import { 
  ShieldCheck, UserCheck, Bot, User, CheckCircle, X, Sparkles, 
  Calendar, Video, FileText, Award, Sliders, ChevronRight, Check
} from 'lucide-react';
import { planningAuthorityStore, REGISTERED_TEACHERS } from '../../services/planningAuthorityStore';

export default function PlanningDelegationModal({
  isOpen,
  onClose,
  childName = 'Liam Kariuki',
  childId = 'liam'
}) {
  const [currentConfig, setCurrentConfig] = useState(() => planningAuthorityStore.getForChild(childId));
  const [selectedMode, setSelectedMode] = useState(currentConfig.authorityMode || 'teacher');
  const [selectedTeacherId, setSelectedTeacherId] = useState(currentConfig.assignedTeacherId || 'mercy');
  const [permissions, setPermissions] = useState(currentConfig.permissions || {
    canScheduleLiveLessons: true,
    canAssignHomework: true,
    canGradeRubrics: true,
    canEditDailySchedule: true
  });
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    const targetTeacher = REGISTERED_TEACHERS.find(t => t.id === selectedTeacherId) || REGISTERED_TEACHERS[0];
    
    planningAuthorityStore.setAuthority(childId, {
      authorityMode: selectedMode,
      assignedTeacherId: selectedTeacherId,
      teacherName: targetTeacher.name,
      teacherTsc: targetTeacher.tscNumber,
      permissions
    });

    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 1200);
  };

  const togglePermission = (permKey) => {
    setPermissions(prev => ({
      ...prev,
      [permKey]: !prev[permKey]
    }));
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 9999,
      background: 'rgba(5, 10, 20, 0.85)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        background: '#0F172A',
        border: '1.5px solid rgba(0, 166, 81, 0.4)',
        borderRadius: '18px',
        maxWidth: '620px',
        width: '100%',
        padding: '30px',
        boxShadow: '0 25px 60px rgba(0,0,0,0.7)',
        position: 'relative'
      }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span className="glass-pill" style={{ background: '#00A651', color: '#FFF', fontWeight: 800 }}>
                📋 PLANNING AUTHORITY
              </span>
              <span className="glass-pill" style={{ color: '#38BDF8' }}>
                {childName}
              </span>
            </div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0, color: '#F8FAFC' }}>
              Who Plans {childName.split(' ')[0]}'s Daily Schedule?
            </h2>
          </div>

          <button
            onClick={onClose}
            style={{ background: 'rgba(255,255,255,0.06)', border: 'none', color: '#94A3B8', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <X size={16} />
          </button>
        </div>

        {/* 3 Authority Mode Choices */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '22px' }}>
          
          {/* Mode 1: Auto-Pilot */}
          <div
            onClick={() => setSelectedMode('system')}
            style={{
              padding: '14px',
              borderRadius: '12px',
              cursor: 'pointer',
              background: selectedMode === 'system' ? 'rgba(59,130,246,0.18)' : 'rgba(255,255,255,0.02)',
              border: selectedMode === 'system' ? '2px solid #3B82F6' : '1px solid var(--border-subtle)',
              transition: 'all 0.2s ease',
              textAlign: 'center'
            }}
          >
            <Bot size={24} color={selectedMode === 'system' ? '#60A5FA' : '#64748B'} style={{ margin: '0 auto 6px' }} />
            <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#F8FAFC' }}>🤖 Auto-Pilot</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              System auto-generates official 12-week KICD syllabus
            </div>
          </div>

          {/* Mode 2: Parent-Led */}
          <div
            onClick={() => setSelectedMode('parent')}
            style={{
              padding: '14px',
              borderRadius: '12px',
              cursor: 'pointer',
              background: selectedMode === 'parent' ? 'rgba(245,158,11,0.18)' : 'rgba(255,255,255,0.02)',
              border: selectedMode === 'parent' ? '2px solid #F59E0B' : '1px solid var(--border-subtle)',
              transition: 'all 0.2s ease',
              textAlign: 'center'
            }}
          >
            <User size={24} color={selectedMode === 'parent' ? '#FBBF24' : '#64748B'} style={{ margin: '0 auto 6px' }} />
            <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#F8FAFC' }}>👨‍👩‍👧 Parent-Led</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Parent customizes electives, holidays, and daily hours
            </div>
          </div>

          {/* Mode 3: Dedicated Teacher */}
          <div
            onClick={() => setSelectedMode('teacher')}
            style={{
              padding: '14px',
              borderRadius: '12px',
              cursor: 'pointer',
              background: selectedMode === 'teacher' ? 'rgba(0,166,81,0.22)' : 'rgba(255,255,255,0.02)',
              border: selectedMode === 'teacher' ? '2px solid #00A651' : '1px solid var(--border-subtle)',
              transition: 'all 0.2s ease',
              textAlign: 'center'
            }}
          >
            <UserCheck size={24} color={selectedMode === 'teacher' ? '#34D399' : '#64748B'} style={{ margin: '0 auto 6px' }} />
            <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#F8FAFC' }}>👩‍🏫 Teacher-Led</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Assigned teacher plans, schedules live classes & grades
            </div>
          </div>

        </div>

        {/* When Teacher-Led: Teacher Selector & Permissions */}
        {selectedMode === 'teacher' && (
          <div style={{
            background: 'rgba(0,166,81,0.06)',
            border: '1px solid rgba(0,166,81,0.3)',
            borderRadius: '12px',
            padding: '18px',
            marginBottom: '20px'
          }}>
            <h4 style={{ fontSize: '0.88rem', fontWeight: 800, color: '#34D399', margin: '0 0 10px 0' }}>
              Select Assigned Teacher &amp; Permissions:
            </h4>

            {/* Teacher Select */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '14px' }}>
              {REGISTERED_TEACHERS.map((t) => (
                <div
                  key={t.id}
                  onClick={() => setSelectedTeacherId(t.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    background: selectedTeacherId === t.id ? 'rgba(0,166,81,0.18)' : 'rgba(255,255,255,0.03)',
                    border: selectedTeacherId === t.id ? '1.5px solid #00A651' : '1px solid var(--border-subtle)',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <img src={t.avatar} alt={t.name} style={{ width: '34px', height: '34px', borderRadius: '50%', objectFit: 'cover' }} />
                    <div>
                      <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#F8FAFC' }}>{t.name}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{t.role} • {t.tscNumber}</div>
                    </div>
                  </div>
                  {selectedTeacherId === t.id && (
                    <span style={{ fontSize: '0.75rem', color: '#34D399', fontWeight: 800 }}>✓ Assigned</span>
                  )}
                </div>
              ))}
            </div>

            {/* Delegated Permissions Checkboxes */}
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#CBD5E1', marginBottom: '6px' }}>
              Permissions Granted to Teacher:
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.78rem' }}>
              {[
                { key: 'canEditDailySchedule', label: 'Schedule Daily Lesson Guides' },
                { key: 'canScheduleLiveLessons', label: 'Host Live Pod Video Classes' },
                { key: 'canAssignHomework', label: 'Assign & Collect Homework' },
                { key: 'canGradeRubrics', label: 'Grade KNEC CBA Rubrics' }
              ].map(perm => (
                <div
                  key={perm.key}
                  onClick={() => togglePermission(perm.key)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    cursor: 'pointer',
                    color: permissions[perm.key] ? '#F8FAFC' : 'var(--text-muted)'
                  }}
                >
                  <div style={{
                    width: '16px', height: '16px', borderRadius: '4px',
                    background: permissions[perm.key] ? '#00A651' : 'rgba(255,255,255,0.1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.65rem', color: '#FFF'
                  }}>
                    {permissions[perm.key] ? '✓' : ''}
                  </div>
                  <span>{perm.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Submit & Save */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Schedule priority: Teacher &gt; Parent &gt; System Auto-Pilot
          </span>

          <button
            onClick={handleSave}
            className="btn-primary"
            style={{ fontSize: '0.88rem', padding: '10px 22px', background: '#00A651', borderColor: '#00A651' }}
          >
            {saveSuccess ? <Check size={16} /> : <CheckCircle size={16} />}
            <span>{saveSuccess ? 'Saved & Applied!' : 'Save Planning Settings'}</span>
          </button>
        </div>

      </div>
    </div>
  );
}
