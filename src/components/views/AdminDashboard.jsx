import React, { useState, useEffect } from 'react';
import { ShieldCheck, TrendingUp, Users, DollarSign, Check, X, Smartphone, UserX, UserCheck, AlertTriangle, Search, Filter, BookOpen, Upload, Download, CheckCircle2, Sparkles, FileCode } from 'lucide-react';

export default function AdminDashboard() {
  const [tutorApplicants, setTutorApplicants] = useState([
    { id: 101, name: 'Kevin Mutua', subjects: 'CBC Junior Secondary Coding', estate: 'Westlands / Ruaka', dci_cert: 'DCI-GC-2026-9921', status: 'Pending Review' }
  ]);

  const [teachers, setTeachers] = useState([
    {
      id: 1,
      name: 'Teacher Mercy Cherono',
      role: 'Grade 4 CBC Specialist & Curriculum Lead',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      estates: 'Kilimani, Lavington, Kileleshwa',
      rating: 5.0,
      reviewsCount: 14,
      sessionsCompleted: 42,
      status: 'active', // 'active' | 'suspended'
      tsc_number: 'TSC-881294',
      cancellationReason: null
    },
    {
      id: 2,
      name: 'Brian Kimani',
      role: 'Robotics & Cambridge Physics Specialist',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      estates: 'Westlands, Ruaka, Gigiri',
      rating: 4.8,
      reviewsCount: 9,
      sessionsCompleted: 28,
      status: 'active',
      tsc_number: 'TSC-772190',
      cancellationReason: null
    },
    {
      id: 3,
      name: 'Sarah Mwangi',
      role: 'Early Years & Phonics Specialist',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      estates: 'Karen, Langata, Rongai',
      rating: 4.9,
      reviewsCount: 11,
      sessionsCompleted: 35,
      status: 'active',
      tsc_number: 'TSC-994120',
      cancellationReason: null
    },
    {
      id: 4,
      name: 'Juma Omondi',
      role: 'Creative Arts & Kiswahili Lugha',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      estates: 'Syokimau, South C, Imara Daima',
      rating: 4.2,
      reviewsCount: 6,
      sessionsCompleted: 18,
      status: 'suspended',
      tsc_number: 'TSC-661902',
      cancellationReason: 'Complaints received regarding persistent unpunctuality.'
    }
  ]);

  const [teacherFilter, setTeacherFilter] = useState('all'); // all, active, suspended
  const [selectedTeacherForCancel, setSelectedTeacherForCancel] = useState(null);
  const [cancelReasonInput, setCancelReasonInput] = useState('');

  // Curriculum Ingestion Engine State
  const [curriculaCatalog, setCurriculaCatalog] = useState([
    {
      code: 'CBC',
      name: 'Kenya Competency-Based Curriculum (CBC)',
      tagline: 'KICD approved practical learning for Kenyan homeschoolers',
      total_weeks: 12,
      total_lessons: 65,
      activePackage: 'Grade 4 Term 1 Master Homeschool Box',
      status: 'Active & Complete'
    },
    {
      code: 'CAMBRIDGE',
      name: 'Cambridge International Primary (CAIE)',
      tagline: 'British curriculum Stage 1-6 preparing learners for IGCSE',
      total_weeks: 12,
      total_lessons: 60,
      activePackage: 'Stage 4 Cambridge Primary - Term 1',
      status: 'Active & Complete'
    },
    {
      code: 'ACE',
      name: 'Accelerated Christian Education (A.C.E.)',
      tagline: 'PACE individualized workbook curriculum framework',
      total_weeks: 0,
      total_lessons: 0,
      activePackage: 'PACE 1037-1048 (Grade 4)',
      status: 'Schema Ready'
    }
  ]);

  const [isCurriculumModalOpen, setIsCurriculumModalOpen] = useState(false);
  const [adminSection, setAdminSection] = useState('overview');
  const [builderForm, setBuilderForm] = useState({
    curriculum: 'CBC',
    week: '1',
    subject: 'Mathematics',
    title: '',
    duration: '45 mins',
    strand: ''
  });
  const [builderEntries, setBuilderEntries] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('soma_manual_lessons') || '[]');
    } catch {
      return [];
    }
  });
  const [builderSuccess, setBuilderSuccess] = useState('');
  const [catalogSummary, setCatalogSummary] = useState([]);
  const [selectedPreset, setSelectedPreset] = useState('cbc');
  const [customJsonInput, setCustomJsonInput] = useState('');
  const [ingestStatus, setIngestStatus] = useState(null);
  const [isIngesting, setIsIngesting] = useState(false);

  // Fetch catalog from backend API if available
  const fetchCurriculumCatalog = () => {
    fetch(`${import.meta.env.VITE_API_URL || 'https://soma-hub-backend.onrender.com/api'}/curriculum/catalog-summary/`)
      .then(res => res.json())
      .then(data => {
        if (data && data.curricula) {
          setCurriculaCatalog(data.curricula.map(c => ({
            code: c.code,
            name: c.name,
            tagline: c.tagline,
            total_weeks: c.total_weeks,
            total_lessons: c.total_lessons,
            activePackage: c.packages.length > 0 ? c.packages[0].title : 'No Active Term',
            status: c.total_lessons > 0 ? 'Active & Complete' : 'Schema Ready'
          })));
          const pkgs = [];
          data.curricula.forEach(c => {
            if (c.packages) {
              c.packages.forEach(p => pkgs.push({ ...p, curriculum_code: c.code }));
            }
          });
          setCatalogSummary(pkgs);
        }
      })
      .catch(() => null);
  };

  useEffect(() => {
    fetchCurriculumCatalog();
  }, []);

  const handleIngestCurriculum = async (e) => {
    e.preventDefault();
    setIsIngesting(true);
    setIngestStatus(null);

    try {
      let payload = null;
      if (selectedPreset === 'cbc') {
        payload = {
          curriculum: { code: 'CBC', name: 'Kenya Competency-Based Curriculum (CBC)', tagline: 'KICD Aligned' },
          term_package: { grade_level: 'Grade 4', term: 1, academic_year: 2026, title: 'Grade 4 CBC Term 1 Master Homeschool Box', price_kes: 6500.00 },
          weeks: Array.from({ length: 12 }, (_, i) => ({
            week_number: i + 1,
            theme_title: `KICD Module ${i + 1}`,
            printable_pack_title: `Week ${i + 1} Printable Pack (PDF)`,
            page_count: 12,
            lessons: [
              { day_number: 1, subject: 'Mathematics & Numeracy', topic: 'Operations and Numbers', duration_minutes: 45 },
              { day_number: 2, subject: 'Science & Technology', topic: 'Investigation and Matter', duration_minutes: 45 },
              { day_number: 3, subject: 'English Literacy', topic: 'Reading and Syntax', duration_minutes: 45 },
              { day_number: 4, subject: 'Kiswahili Mufti', topic: 'Sarufi na Ngeli', duration_minutes: 45 },
              { day_number: 5, subject: 'Agriculture & Nutrition', topic: 'Practical Kitchen Lab', duration_minutes: 60 }
            ]
          }))
        };
      } else if (selectedPreset === 'cambridge') {
        payload = {
          curriculum: { code: 'CAMBRIDGE', name: 'Cambridge International Primary (UK)', tagline: 'CAIE Aligned' },
          term_package: { grade_level: 'Stage 4 / Year 5', term: 1, academic_year: 2026, title: 'Stage 4 Cambridge Primary - Term 1', price_kes: 8500.00 },
          weeks: Array.from({ length: 12 }, (_, i) => ({
            week_number: i + 1,
            theme_title: `Cambridge Stage 4 Unit ${i + 1}`,
            printable_pack_title: `Stage 4 Week ${i + 1} Cambridge Pack (PDF)`,
            page_count: 12,
            lessons: [
              { day_number: 1, subject: 'Cambridge Mathematics (0096)', topic: 'Stage 4 Problem Solving', duration_minutes: 45 },
              { day_number: 2, subject: 'Cambridge Science (0097)', topic: 'Scientific Inquiry & Forces', duration_minutes: 45 },
              { day_number: 3, subject: 'Cambridge English (0058)', topic: 'Grammar and Reading Comprehension', duration_minutes: 45 },
              { day_number: 4, subject: 'Global Perspectives', topic: 'Community Challenges', duration_minutes: 45 },
              { day_number: 5, subject: 'STEM Practical Lab', topic: 'Hands-on Investigation', duration_minutes: 60 }
            ]
          }))
        };
      } else {
        if (!customJsonInput.trim()) {
          throw new Error('Please paste valid curriculum JSON or select a preset template.');
        }
        payload = JSON.parse(customJsonInput);
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://soma-hub-backend.onrender.com/api'}/curriculum/import-json/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const resData = await response.json();
      if (!response.ok) {
        throw new Error(resData.error || 'Failed to ingest curriculum JSON');
      }

      setIngestStatus({ success: true, message: `Successfully ingested ${resData.curriculum} (${resData.package_title})! ${resData.weeks_count} weeks & ${resData.lessons_count} daily guides loaded.` });
      fetchCurriculumCatalog();
      setTimeout(() => {
        setIsCurriculumModalOpen(false);
        setIngestStatus(null);
      }, 2500);

    } catch (err) {
      setIngestStatus({ success: false, message: err.message });
    } finally {
      setIsIngesting(false);
    }
  };

  const transactions = [
    { id: 'TX-9102', phone: '254712***678', item: 'Grade 4 CBC Term 1 Box', amount: 6500, time: '12 mins ago', receipt: 'SKM918274' },
    { id: 'TX-9101', phone: '254722***432', item: 'Year 5 Cambridge Box', amount: 8500, time: '45 mins ago', receipt: 'SKM918112' },
    { id: 'TX-9100', phone: '254733***889', item: 'Karura Ecology Walk RSVP', amount: 1200, time: '2 hours ago', receipt: 'SKM917990' }
  ];

  const handleApprove = (id) => {
    const applicant = tutorApplicants.find((a) => a.id === id);
    if (applicant) {
      const newTeacher = {
        id: Date.now(),
        name: applicant.name,
        role: applicant.subjects,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        estates: applicant.estate,
        rating: 5.0,
        reviewsCount: 0,
        sessionsCompleted: 0,
        status: 'active',
        tsc_number: applicant.dci_cert,
        cancellationReason: null
      };
      setTeachers((prev) => [newTeacher, ...prev]);
    }
    setTutorApplicants((prev) => prev.filter((a) => a.id !== id));
  };

  const handleConfirmCancelTeacher = (e) => {
    e.preventDefault();
    if (!selectedTeacherForCancel) return;

    setTeachers((prev) =>
      prev.map((t) =>
        t.id === selectedTeacherForCancel.id
          ? {
              ...t,
              status: 'suspended',
              cancellationReason: cancelReasonInput || 'Suspended by admin governance review.'
            }
          : t
      )
    );

    setSelectedTeacherForCancel(null);
    setCancelReasonInput('');
  };

  const handleReactivateTeacher = (id) => {
    setTeachers((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, status: 'active', cancellationReason: null }
          : t
      )
    );
  };

  const filteredTeachers = teachers.filter((t) => {
    if (teacherFilter === 'active') return t.status === 'active';
    if (teacherFilter === 'suspended') return t.status === 'suspended';
    return true;
  });

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <span className="glass-pill" style={{ color: '#818CF8', border: '1px solid rgba(129,140,248,0.3)', marginBottom: '8px', display: 'inline-block' }}>
          📊 Operations & Governance HQ
        </span>
        <h2 style={{ fontSize: '1.6rem', margin: 0, fontWeight: 800 }}>SomaHome Kenya Operations HQ</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: '4px 0 0 0' }}>
          Platform metrics, teacher cancellation & accreditation governance, and Safaricom Daraja ledger
        </p>
      </div>

      {/* Admin Top-Level Navigation Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0', flexWrap: 'wrap' }}>
        {[
          { id: 'overview', icon: '📊', label: 'Overview' },
          { id: 'registry', icon: '👨‍🏫', label: 'Teacher Governance' },
          { id: 'applicants', icon: '📋', label: 'Vetting & Daraja Feed' },
          { id: 'curriculum', icon: '📚', label: 'Curriculum Engine' },
        ].map(tab => {
          const isActive = adminSection === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setAdminSection(tab.id)}
              style={{
                background: isActive ? 'rgba(129,140,248,0.15)' : 'transparent',
                border: 'none',
                borderBottom: isActive ? '3px solid #818CF8' : '3px solid transparent',
                color: isActive ? '#818CF8' : 'var(--text-muted)',
                padding: '10px 18px',
                fontSize: '0.85rem',
                fontWeight: isActive ? 800 : 500,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.15s ease',
                borderRadius: '8px 8px 0 0'
              }}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* KPI Cards Grid (Overview Tab) */}
      {adminSection === 'overview' && (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '28px' }}>
      <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700 }}>ACTIVE STUDENTS</span>
            <Users size={18} color="#34D399" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#F8FAFC', marginTop: '6px' }}>184</div>
          <div style={{ fontSize: '0.75rem', color: '#10B981', marginTop: '4px' }}>+28 families this month</div>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700 }}>M-PESA VOLUME (TERM 1)</span>
            <DollarSign size={18} color="#F59E0B" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#F8FAFC', marginTop: '6px' }}>KES 1,196,000</div>
          <div style={{ fontSize: '0.75rem', color: '#10B981', marginTop: '4px' }}>100% Daraja STK Push</div>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700 }}>ESTATE LEARNING PODS</span>
            <TrendingUp size={18} color="#38BDF8" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#F8FAFC', marginTop: '6px' }}>22 Active</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>Across 8 Nairobi estates</div>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700 }}>VERIFIED TEACHERS</span>
            <ShieldCheck size={18} color="#A78BFA" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#F8FAFC', marginTop: '6px' }}>
            {teachers.filter((t) => t.status === 'active').length} Active
          </div>
          <div style={{ fontSize: '0.75rem', color: teachers.some((t) => t.status === 'suspended') ? '#F87171' : '#10B981', marginTop: '4px' }}>
            {teachers.filter((t) => t.status === 'suspended').length} Suspended/Cancelled
          </div>
        </div>

      </div>
      )}

      {/* TEACHER MANAGEMENT & CANCELLATION PANEL */}
      {(adminSection === 'overview' || adminSection === 'registry') && (
      <div className="glass-panel" style={{ padding: '24px', marginBottom: '28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '14px' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', margin: 0, fontWeight: 800 }}>Teacher Governance & Accreditation Management</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: '4px 0 0 0' }}>
              Cancel underperforming teachers, revoke verified badges, or reinstate cleared facilitators
            </p>
          </div>

          {/* Filter Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700 }}>
              Status Filter:
            </label>
            <select
              className="custom-select"
              value={teacherFilter}
              onChange={(e) => setTeacherFilter(e.target.value)}
              style={{ minWidth: '160px', padding: '6px 12px' }}
            >
              <option value="all">👥 All Teachers ({teachers.length})</option>
              <option value="active">✅ Active Only ({teachers.filter((t) => t.status === 'active').length})</option>
              <option value="suspended">🚫 Suspended Only ({teachers.filter((t) => t.status === 'suspended').length})</option>
            </select>
          </div>
        </div>

        {/* Teachers Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '12px 14px' }}>Teacher / Tutor</th>
                <th style={{ padding: '12px 14px' }}>Curriculum & Role</th>
                <th style={{ padding: '12px 14px' }}>Estates Covered</th>
                <th style={{ padding: '12px 14px' }}>Rating / Reviews</th>
                <th style={{ padding: '12px 14px' }}>Status</th>
                <th style={{ padding: '12px 14px', textAlign: 'right' }}>Admin Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTeachers.map((teacher) => {
                const isActive = teacher.status === 'active';
                return (
                  <tr key={teacher.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                    {/* Name & Avatar */}
                    <td style={{ padding: '14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img
                          src={teacher.avatar}
                          alt={teacher.name}
                          style={{
                            width: '42px',
                            height: '42px',
                            borderRadius: '50%',
                            objectFit: 'cover',
                            border: isActive ? '2px solid #00A651' : '2px solid #EF4444',
                            filter: isActive ? 'none' : 'grayscale(80%)'
                          }}
                        />
                        <div>
                          <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{teacher.name}</div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{teacher.tsc_number}</div>
                        </div>
                      </div>
                    </td>

                    {/* Role */}
                    <td style={{ padding: '14px', color: 'var(--text-secondary)' }}>
                      {teacher.role}
                    </td>

                    {/* Estates */}
                    <td style={{ padding: '14px', color: 'var(--text-secondary)', fontSize: '0.82rem' }}>
                      {teacher.estates}
                    </td>

                    {/* Rating */}
                    <td style={{ padding: '14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 700, color: '#F59E0B' }}>
                        ★ {teacher.rating}
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 400 }}>
                          ({teacher.reviewsCount} reviews)
                        </span>
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#10B981' }}>{teacher.sessionsCompleted} completed sessions</div>
                    </td>

                    {/* Status Badge */}
                    <td style={{ padding: '14px' }}>
                      {isActive ? (
                        <span className="glass-pill" style={{ background: 'rgba(16,185,129,0.15)', color: '#10B981', border: '1px solid rgba(16,185,129,0.3)', fontSize: '0.72rem' }}>
                          ✅ Active & Verified
                        </span>
                      ) : (
                        <div>
                          <span className="glass-pill" style={{ background: 'rgba(239,68,68,0.15)', color: '#F87171', border: '1px solid rgba(239,68,68,0.3)', fontSize: '0.72rem' }}>
                            🚫 Cancelled / Suspended
                          </span>
                          {teacher.cancellationReason && (
                            <div style={{ fontSize: '0.7rem', color: '#FCA5A5', marginTop: '4px', maxWidth: '200px' }}>
                              "{teacher.cancellationReason}"
                            </div>
                          )}
                        </div>
                      )}
                    </td>

                    {/* Actions */}
                    <td style={{ padding: '14px', textAlign: 'right' }}>
                      {isActive ? (
                        <button
                          onClick={() => {
                            setSelectedTeacherForCancel(teacher);
                            setCancelReasonInput('');
                          }}
                          className="btn-secondary"
                          style={{
                            fontSize: '0.78rem',
                            color: '#F87171',
                            borderColor: 'rgba(239,68,68,0.4)',
                            padding: '6px 12px'
                          }}
                          title="Cancel teacher accreditation and suspend booking"
                        >
                          <UserX size={14} />
                          <span>Cancel Teacher</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleReactivateTeacher(teacher.id)}
                          className="btn-primary"
                          style={{ fontSize: '0.78rem', padding: '6px 12px' }}
                          title="Reactivate teacher badge"
                        >
                          <UserCheck size={14} />
                          <span>Reactivate Badge</span>
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      )}

      {/* TUTOR VETTING QUEUE & SAFARICOM DARAJA STREAM */}
      {(adminSection === 'overview' || adminSection === 'applicants') && (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '26px', marginBottom: '28px' }}>
        
        {/* Tutor Vetting Queue */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.1rem', margin: 0 }}>Tutor Accreditation Queue</h3>
            <span className="glass-pill" style={{ fontSize: '0.72rem', color: '#F59E0B' }}>
              {tutorApplicants.length} Pending DCI Verification
            </span>
          </div>

          {tutorApplicants.length > 0 ? (
            tutorApplicants.map((a) => (
              <div key={a.id} style={{
                background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)',
                borderRadius: '12px', padding: '16px'
              }}>
                <div style={{ fontSize: '1rem', fontWeight: 700 }}>{a.name}</div>
                <div style={{ fontSize: '0.8rem', color: '#38BDF8', marginTop: '2px' }}>{a.subjects}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Coverage: {a.estate} • Clearance: <strong style={{ color: '#F59E0B' }}>{a.dci_cert}</strong>
                </div>

                <div style={{ display: 'flex', gap: '10px', marginTop: '14px' }}>
                  <button onClick={() => handleApprove(a.id)} className="btn-primary" style={{ flex: 1, justifyContent: 'center', padding: '8px', fontSize: '0.8rem' }}>
                    <Check size={14} />
                    <span>Verify & Issue Badge</span>
                  </button>
                  <button onClick={() => setTutorApplicants([])} className="btn-secondary" style={{ padding: '8px', fontSize: '0.8rem' }}>
                    <X size={14} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div style={{ textAlign: 'center', padding: '30px', color: '#10B981', fontSize: '0.9rem' }}>
              ✓ All tutor background checks are up to date!
            </div>
          )}
        </div>

        {/* Real-time M-Pesa Transaction Stream */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.1rem', margin: 0 }}>Live Safaricom Daraja Feed</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: '#10B981' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981', boxShadow: '0 0 8px #10B981' }} />
              Live Webhook Active
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {transactions.map((t) => (
              <div key={t.id} style={{
                background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)',
                borderRadius: '10px', padding: '12px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
              }}>
                <div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)' }}>{t.item}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Phone: {t.phone} • Receipt: <strong style={{ color: '#34D399' }}>{t.receipt}</strong>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#34D399' }}>
                    +KES {t.amount.toLocaleString()}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{t.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
      )}

      {/* CANCEL TEACHER CONFIRMATION MODAL */}
      {selectedTeacherForCancel && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(5, 10, 8, 0.85)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div className="glass-panel" style={{
            width: '100%',
            maxWidth: '480px',
            padding: '28px',
            borderRadius: '20px',
            border: '1px solid rgba(239, 68, 68, 0.4)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#F87171', marginBottom: '12px' }}>
              <AlertTriangle size={24} />
              <h3 style={{ margin: 0, fontSize: '1.25rem' }}>Cancel Teacher Accreditation</h3>
            </div>

            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.6, marginBottom: '16px' }}>
              You are about to cancel and suspend <strong>{selectedTeacherForCancel.name}</strong>. Their profile will be hidden from public booking and their verified badge will be revoked.
            </p>

            <form onSubmit={handleConfirmCancelTeacher}>
              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, marginBottom: '6px' }}>
                  Reason for Cancellation:
                </label>
                <select
                  value={cancelReasonInput}
                  onChange={(e) => setCancelReasonInput(e.target.value)}
                  className="custom-select"
                  style={{ width: '100%', marginBottom: '8px' }}
                >
                  <option value="">Select official reason...</option>
                  <option value="Parent complaints regarding lesson quality">Parent complaints regarding lesson quality</option>
                  <option value="Persistent unpunctuality or missed sessions">Persistent unpunctuality or missed sessions</option>
                  <option value="DCI Police Clearance Certificate expired">DCI Police Clearance Certificate expired</option>
                  <option value="Safeguarding or conduct violation">Safeguarding or conduct violation</option>
                  <option value="Facilitator requested temporary hiatus">Facilitator requested temporary hiatus</option>
                </select>

                <textarea
                  placeholder="Or type specific notes for audit trail..."
                  value={cancelReasonInput}
                  onChange={(e) => setCancelReasonInput(e.target.value)}
                  className="custom-select"
                  rows={2}
                  style={{ width: '100%', resize: 'none', height: '60px' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => setSelectedTeacherForCancel(null)}
                  className="btn-secondary"
                  style={{ flex: 1, justifyContent: 'center' }}
                >
                  Keep Active
                </button>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    background: '#EF4444',
                    color: '#FFF',
                    border: 'none',
                    borderRadius: '10px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    padding: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <UserX size={16} />
                  <span>Confirm Suspension</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* === CURRICULUM ENGINE TAB === */}
      {adminSection === 'curriculum' && (
        <div>
          <div style={{ marginBottom: '22px' }}>
            <h3 style={{ fontSize: '1.2rem', margin: '0 0 6px' }}>📚 Curriculum Ingestion Engine</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', margin: 0 }}>
              Import full curriculum JSON packages OR manually add individual lesson entries directly below.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '22px' }}>

            {/* Manual Lesson Builder */}
            <div className="glass-panel" style={{ padding: '22px' }}>
              <h4 style={{ fontSize: '0.95rem', margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>✏️</span> Manual Lesson Entry
              </h4>
              <form onSubmit={(e) => {
                e.preventDefault();
                if (!builderForm.title) return;
                const entry = { ...builderForm, id: Date.now(), createdAt: new Date().toLocaleDateString() };
                const next = [entry, ...builderEntries];
                setBuilderEntries(next);
                localStorage.setItem('soma_manual_lessons', JSON.stringify(next));
                setBuilderForm(p => ({ ...p, title: '', strand: '' }));
                setBuilderSuccess(`✅ Lesson "${entry.title}" added to ${entry.curriculum} Week ${entry.week}!`);
                setTimeout(() => setBuilderSuccess(''), 3000);
              }} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '5px' }}>Curriculum</label>
                    <select value={builderForm.curriculum} onChange={e => setBuilderForm(p => ({ ...p, curriculum: e.target.value }))} className="custom-select" style={{ width: '100%', fontSize: '0.82rem' }}>
                      <option value="CBC">Kenya CBC</option>
                      <option value="CAMBRIDGE">Cambridge</option>
                      <option value="HYBRID">CBC + Cambridge</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '5px' }}>Week No.</label>
                    <input type="number" min="1" max="40" value={builderForm.week} onChange={e => setBuilderForm(p => ({ ...p, week: e.target.value }))} style={{ width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-card)', borderRadius: '8px', padding: '8px 10px', color: '#F8FAFC', fontSize: '0.85rem', boxSizing: 'border-box' }} />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '5px' }}>Subject *</label>
                  <select value={builderForm.subject} onChange={e => setBuilderForm(p => ({ ...p, subject: e.target.value }))} className="custom-select" style={{ width: '100%', fontSize: '0.82rem' }}>
                    {['Mathematics', 'English', 'Kiswahili', 'Science & Technology', 'Social Studies', 'Creative Arts', 'Agriculture', 'Physical Education', 'Religious Education', 'French', 'German', 'Computing'].map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '5px' }}>Lesson Title *</label>
                  <input required value={builderForm.title} onChange={e => setBuilderForm(p => ({ ...p, title: e.target.value }))} placeholder="e.g. Fraction Word Problems — Kitchen Context" style={{ width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-card)', borderRadius: '8px', padding: '8px 10px', color: '#F8FAFC', fontSize: '0.85rem', boxSizing: 'border-box' }} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '5px' }}>Duration</label>
                    <select value={builderForm.duration} onChange={e => setBuilderForm(p => ({ ...p, duration: e.target.value }))} className="custom-select" style={{ width: '100%', fontSize: '0.82rem' }}>
                      {['30 mins', '45 mins', '60 mins', '90 mins'].map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '5px' }}>Competency Strand</label>
                    <input value={builderForm.strand} onChange={e => setBuilderForm(p => ({ ...p, strand: e.target.value }))} placeholder="e.g. Numeracy & Number" style={{ width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-card)', borderRadius: '8px', padding: '8px 10px', color: '#F8FAFC', fontSize: '0.82rem', boxSizing: 'border-box' }} />
                  </div>
                </div>

                {builderSuccess && <div style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '8px', padding: '10px 14px', fontSize: '0.82rem', color: '#10B981' }}>{builderSuccess}</div>}

                <button type="submit" className="btn-primary" style={{ justifyContent: 'center', padding: '10px' }}>
                  ➕ Add Lesson to Curriculum
                </button>
              </form>
            </div>

            {/* JSON Import (existing engine) */}
            <div className="glass-panel" style={{ padding: '22px' }}>
              <h4 style={{ fontSize: '0.95rem', margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>📦</span> JSON Bulk Import
              </h4>
              <button onClick={() => setIsCurriculumModalOpen(true)} className="btn-secondary" style={{ width: '100%', justifyContent: 'center', marginBottom: '14px' }}>
                📂 Open JSON Import / Export Tool
              </button>
              <button onClick={fetchCurriculumCatalog} className="btn-secondary" style={{ width: '100%', justifyContent: 'center', marginBottom: '14px' }}>
                🔄 Reload Catalog from Django API
              </button>
              {catalogSummary.length > 0 && (
                <div>
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>Loaded Curriculum Catalog ({catalogSummary.length})</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '280px', overflowY: 'auto' }}>
                    {catalogSummary.map((pkg, i) => (
                      <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)', borderRadius: '10px', padding: '10px 14px' }}>
                        <div style={{ fontSize: '0.86rem', fontWeight: 700 }}>{pkg.title}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                          {pkg.curriculum_code} · {pkg.weeks_count || '—'} weeks · {pkg.lessons_count || '—'} lessons
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Manual Entries Table */}
          {builderEntries.length > 0 && (
            <div className="glass-panel" style={{ padding: '20px', marginTop: '20px' }}>
              <h4 style={{ fontSize: '0.95rem', margin: '0 0 14px' }}>📝 Manually Added Lessons ({builderEntries.length})</h4>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                  <thead>
                    <tr style={{ background: 'rgba(255,255,255,0.04)', borderBottom: '1px solid var(--border-subtle)' }}>
                      {['Curriculum', 'Week', 'Subject', 'Lesson Title', 'Duration', 'Date Added'].map(h => (
                        <th key={h} style={{ padding: '9px 12px', textAlign: 'left', fontWeight: 700, color: 'var(--text-muted)', fontSize: '0.72rem', textTransform: 'uppercase' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {builderEntries.map((e, i) => (
                      <tr key={e.id} style={{ borderBottom: '1px solid var(--border-subtle)', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)' }}>
                        <td style={{ padding: '9px 12px' }}><span style={{ fontSize: '0.72rem', background: 'rgba(129,140,248,0.1)', color: '#818CF8', borderRadius: '6px', padding: '2px 8px' }}>{e.curriculum}</span></td>
                        <td style={{ padding: '9px 12px', color: 'var(--text-secondary)' }}>Wk {e.week}</td>
                        <td style={{ padding: '9px 12px', color: '#F59E0B' }}>{e.subject}</td>
                        <td style={{ padding: '9px 12px', color: '#F8FAFC', fontWeight: 600 }}>{e.title}</td>
                        <td style={{ padding: '9px 12px', color: 'var(--text-secondary)' }}>{e.duration}</td>
                        <td style={{ padding: '9px 12px', color: 'var(--text-muted)' }}>{e.createdAt}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
}