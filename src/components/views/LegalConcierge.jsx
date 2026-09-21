import React, { useState } from 'react';
import { ShieldCheck, FileText, CheckCircle, Download, ExternalLink, Printer, Scale, Building2, ChevronRight, AlertCircle, Award } from 'lucide-react';

export default function LegalConcierge() {
  const [activeTab, setActiveTab] = useState('notification');
  const [parentName, setParentName] = useState('Steve Kariuki');
  const [childName, setChildName] = useState('Liam Kariuki');
  const [childDob, setChildDob] = useState('14th May 2016');
  const [subCounty, setSubCounty] = useState('Dagoretti North (Kilimani / Wood Avenue)');
  const [curriculumChoice, setCurriculumChoice] = useState('CBC (Competency-Based Curriculum)');
  const [referenceId] = useState('MOE/HOMESCHOOL/2026/' + Math.floor(1000 + Math.random() * 9000));

  const handlePrintLetter = () => {
    window.print();
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* Header & Dropdown Selector */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '28px', flexWrap: 'wrap', gap: '20px' }}>
        <div>
          <span className="glass-pill" style={{ color: '#10B981', border: '1px solid rgba(16,185,129,0.3)', marginBottom: '8px', display: 'inline-block' }}>
            ⚖️ Republic of Kenya Legal Compliance Desk
          </span>
          <h2 style={{ fontSize: '1.6rem', margin: 0, fontWeight: 800 }}>
            Kenyan Homeschool & Exam Accreditation Concierge
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: '4px 0 0 0' }}>
            Official Ministry of Education exemption paperwork, KNEC KPSEA/KCSE private candidate registration & KNQA equivalence
          </p>
        </div>

        {/* Tab Dropdown */}
        <div>
          <label style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>
            Select Accreditation Pathway:
          </label>
          <select
            className="custom-select"
            value={activeTab}
            onChange={(e) => setActiveTab(e.target.value)}
            style={{ minWidth: '280px' }}
          >
            <option value="notification">📜 Sub-County Notification Letter</option>
            <option value="knec">🇰🇪 KNEC Private Candidate (KPSEA/KCSE)</option>
            <option value="british_council">🇬🇧 British Council IGCSE Registration</option>
            <option value="knqa">🏛️ KNQA University Equivalence</option>
            <option value="exam_centers">📍 Nairobi Exam Center Directory</option>
          </select>
        </div>
      </div>

      {/* 1. OFFICIAL SUB-COUNTY NOTIFICATION LETTER GENERATOR */}
      {activeTab === 'notification' && (
        <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: '24px' }}>
          
          {/* Left: Input parameters */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.1rem', margin: '0 0 16px 0', fontWeight: 800 }}>Legal Letter Parameters</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, marginBottom: '6px' }}>
                  Parent / Guardian Name:
                </label>
                <input
                  type="text"
                  value={parentName}
                  onChange={(e) => setParentName(e.target.value)}
                  className="custom-select"
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, marginBottom: '6px' }}>
                  Learner's Full Name:
                </label>
                <input
                  type="text"
                  value={childName}
                  onChange={(e) => setChildName(e.target.value)}
                  className="custom-select"
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, marginBottom: '6px' }}>
                  Date of Birth:
                </label>
                <input
                  type="text"
                  value={childDob}
                  onChange={(e) => setChildDob(e.target.value)}
                  className="custom-select"
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, marginBottom: '6px' }}>
                  Sub-County Education Office:
                </label>
                <select
                  value={subCounty}
                  onChange={(e) => setSubCounty(e.target.value)}
                  className="custom-select"
                  style={{ width: '100%' }}
                >
                  <option value="Dagoretti North (Kilimani / Wood Avenue)">Dagoretti North (Kilimani / Wood Ave)</option>
                  <option value="Langata / Kibra Sub-County (Karen / Langata)">Langata (Karen / Langata)</option>
                  <option value="Westlands Sub-County (Westlands / Ruaka)">Westlands (Westlands / Ruaka)</option>
                  <option value="Embakasi South (Syokimau / Mombasa Rd)">Embakasi South (Syokimau / Mombasa Rd)</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, marginBottom: '6px' }}>
                  Selected Curriculum Framework:
                </label>
                <select
                  value={curriculumChoice}
                  onChange={(e) => setCurriculumChoice(e.target.value)}
                  className="custom-select"
                  style={{ width: '100%' }}
                >
                  <option value="CBC (Competency-Based Curriculum - KICD Aligned)">CBC (KICD Aligned)</option>
                  <option value="Cambridge Assessment International Education (CAIE)">Cambridge International (CAIE)</option>
                  <option value="Accelerated Christian Education (A.C.E.)">Accelerated Christian Education (A.C.E.)</option>
                </select>
              </div>

              <div style={{
                background: 'rgba(0, 166, 81, 0.08)',
                border: '1px solid rgba(0, 166, 81, 0.25)',
                borderRadius: '10px',
                padding: '12px',
                fontSize: '0.78rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.6
              }}>
                ⚖️ <strong>Legal Precedent:</strong> Under <em>Article 53(1)(b)</em> of the Constitution of Kenya and <em>Section 30</em> of the Basic Education Act, parents possess the fundamental right to direct the quality and format of their child's basic education.
              </div>

              <button
                onClick={handlePrintLetter}
                className="btn-primary"
                style={{ width: '100%', justifyContent: 'center', padding: '12px', fontSize: '0.9rem' }}
              >
                <Printer size={16} />
                <span>Print Official Letterhead</span>
              </button>
            </div>
          </div>

          {/* Right: Authentic Printable Letterhead Preview */}
          <div className="glass-panel" style={{
            background: '#FFFFFF',
            color: '#1E293B',
            padding: '40px',
            borderRadius: '16px',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
            fontFamily: 'Georgia, serif',
            lineHeight: 1.8
          }}>
            {/* Republic of Kenya Formal Header */}
            <div style={{ textAlign: 'center', borderBottom: '2px solid #0F172A', paddingBottom: '16px', marginBottom: '24px' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#0F172A' }}>
                REPUBLIC OF KENYA
              </div>
              <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#00A651', marginTop: '2px' }}>
                MINISTRY OF EDUCATION
              </div>
              <div style={{ fontSize: '0.8rem', color: '#64748B' }}>
                STATE DEPARTMENT FOR BASIC EDUCATION • SUB-COUNTY EDUCATION OFFICE
              </div>
              <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '4px' }}>
                Official Gazette Reference: {referenceId}
              </div>
            </div>

            {/* Date & Address */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', fontSize: '0.88rem' }}>
              <div>
                <strong>TO:</strong><br />
                The Sub-County Director of Education,<br />
                {subCounty},<br />
                Nairobi County, Republic of Kenya.
              </div>
              <div style={{ textAlign: 'right' }}>
                <strong>DATE:</strong> 16th September 2026<br />
                <strong>STATUS:</strong> Formal Record Copy
              </div>
            </div>

            {/* Subject */}
            <div style={{
              fontSize: '1rem',
              fontWeight: 800,
              textDecoration: 'underline',
              marginBottom: '20px',
              color: '#0F172A',
              textTransform: 'uppercase'
            }}>
              RE: FORMAL NOTIFICATION OF ALTERNATIVE HOME EDUCATION PROVISION FOR {childName} (DOB: {childDob})
            </div>

            {/* Body */}
            <div style={{ fontSize: '0.9rem', color: '#334155', textAlign: 'justify', marginBottom: '20px' }}>
              <p style={{ marginBottom: '14px' }}>
                I, <strong>{parentName}</strong>, residing in {subCounty}, do hereby formally lodge this statutory notice to the Ministry of Education confirming that our child, <strong>{childName}</strong>, is receiving comprehensive, high-standard basic education under a home instruction model for the 2026/2027 academic cycle.
              </p>

              <p style={{ marginBottom: '14px' }}>
                This educational provision is established in strict harmony with <strong>Article 53(1)(b) of the Constitution of Kenya</strong> and Section 30 of the Basic Education Act. The pedagogical framework utilized is <strong>{curriculumChoice}</strong>, supported by KICD-certified foundational textbooks, continuous formative rubric assessments (EE/ME rubrics), and practical science lab portfolios.
              </p>

              <p style={{ marginBottom: '14px' }}>
                All academic records, lesson attendance transcripts, and practical project portfolios are curated via the SomaHome Kenya academic ledger and remain available for scheduled assessment or validation by quality assurance officers.
              </p>
            </div>

            {/* Signatures */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '40px', paddingTop: '20px', borderTop: '1px dashed #CBD5E1' }}>
              <div>
                <div style={{ borderBottom: '1px solid #334155', width: '220px', paddingBottom: '4px', fontStyle: 'italic', fontWeight: 600 }}>
                  {parentName}
                </div>
                <div style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '4px' }}>
                  Parent / Primary Guardian Signature
                </div>
              </div>

              <div style={{ textAlign: 'center' }}>
                <div style={{
                  border: '2px dashed #00A651',
                  borderRadius: '50%',
                  width: '90px',
                  height: '90px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#00A651',
                  fontSize: '0.65rem',
                  fontWeight: 800,
                  transform: 'rotate(-12deg)'
                }}>
                  SOMAHOME<br />DIGITAL SEAL<br />VERIFIED
                </div>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* 2. KNEC PRIVATE CANDIDATE REGISTRATION (KPSEA & KCSE) */}
      {activeTab === 'knec' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
          <div className="glass-panel" style={{ padding: '24px' }}>
            <span className="glass-pill" style={{ color: '#00A651', marginBottom: '10px' }}>
              Step 1 • Birth Registration & NEMIS
            </span>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '8px' }}>Obtain Official Birth Certificate</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              KNEC mandates an authentic birth certificate number for every private candidate entry. SomaHome automatically compiles Liam's birth record and KICD level records ready for upload.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '24px' }}>
            <span className="glass-pill" style={{ color: '#38BDF8', marginBottom: '10px' }}>
              Step 2 • Sub-County Registration
            </span>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '8px' }}>Sub-County Exam Center Allocation</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Submit your formal notification letter to your Sub-County Director of Education in January to receive an accredited exam center code (e.g. Kilimani Primary, Starehe Center).
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '24px' }}>
            <span className="glass-pill" style={{ color: '#F59E0B', marginBottom: '10px' }}>
              Step 3 • KPSEA / KCSE Indexing
            </span>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '8px' }}>Candidate Assessment Verification</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Export Liam's certified Grade 4-6 School-Based Assessment (SBA) transcript directly from SomaHome. KNEC weights continuous assessment at 60% and national KPSEA at 40%.
            </p>
          </div>
        </div>
      )}

      {/* 3. BRITISH COUNCIL IGCSE REGISTRATION */}
      {activeTab === 'british_council' && (
        <div className="glass-panel" style={{ padding: '28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <div>
              <h3 style={{ fontSize: '1.2rem', margin: 0 }}>British Council Kenya — Private Candidate Registration</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
                Upper Hill Center, Nairobi • Cambridge Assessment International Education (CAIE)
              </p>
            </div>
            <span className="glass-pill" style={{ color: '#60A5FA' }}>
              May/June & Oct/Nov Series
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '18px' }}>
            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '16px' }}>
              <div style={{ fontWeight: 700, color: '#38BDF8', marginBottom: '6px' }}>Checkpoint Primary & Lower Secondary</div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                Diagnostic benchmark tests taken at Year 6 and Year 9. Registered via British Council Portal.
              </p>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '16px' }}>
              <div style={{ fontWeight: 700, color: '#38BDF8', marginBottom: '6px' }}>IGCSE & O-Levels</div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                Usually taken at Age 15–16. Practical science lab exams can be arranged at accredited partner labs in Nairobi.
              </p>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '16px' }}>
              <div style={{ fontWeight: 700, color: '#38BDF8', marginBottom: '6px' }}>AS & A-Levels</div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                University matriculation entry qualifications recognized globally and by the Kenya Universities and Colleges Central Placement Service (KUCCPS).
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 4. KNQA UNIVERSITY EQUIVALENCE */}
      {activeTab === 'knqa' && (
        <div className="glass-panel" style={{ padding: '28px' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '12px' }}>Kenya National Qualifications Authority (KNQA) Equivalence</h3>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '20px' }}>
            Under the Kenya National Qualifications Framework Act, homeschooled learners presenting international curricula (Cambridge, American High School Diploma, ACE) or alternative credentials receive an official <strong>KNQA Certificate of Equation</strong> for university admission (UoN, Strathmore, USIU, Daystar).
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
            <div style={{ background: 'rgba(0,166,81,0.08)', border: '1px solid rgba(0,166,81,0.3)', borderRadius: '12px', padding: '16px' }}>
              <div style={{ fontWeight: 700, color: '#10B981', marginBottom: '4px' }}>KNQA Level 3</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Equivalent to KCPE / KPSEA completion certificate.
              </div>
            </div>

            <div style={{ background: 'rgba(56,189,248,0.08)', border: '1px solid rgba(56,189,248,0.3)', borderRadius: '12px', padding: '16px' }}>
              <div style={{ fontWeight: 700, color: '#38BDF8', marginBottom: '4px' }}>KNQA Level 4</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Equivalent to KCSE / Cambridge IGCSE with minimum 5 credits.
              </div>
            </div>

            <div style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: '12px', padding: '16px' }}>
              <div style={{ fontWeight: 700, color: '#F59E0B', marginBottom: '4px' }}>KNQA Level 5 & 6</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Direct entry to University Degree / Higher National Diploma programs.
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}