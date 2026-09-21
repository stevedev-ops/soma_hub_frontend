import React, { useState } from 'react';
import { Video, Calendar, Clock, PlayCircle, ShieldCheck, Users, Sparkles } from 'lucide-react';
import LiveClassroomModal from '../../modules/learning/LiveClassroomModal';

export default function LiveSessions() {
  const [subjectFilter, setSubjectFilter] = useState('ALL');
  const [selectedLiveSession, setSelectedLiveSession] = useState(null);

  const sessions = [
    {
      id: 1,
      title: 'CBC Grade 4 Math Masterclass: Conquering Fraction Word Problems',
      teacher: 'Teacher Mercy Wanjiku (Lead Facilitator)',
      day: 'Wednesday (Today)',
      time: '11:00 AM - 11:45 AM EAT',
      subject: 'math',
      status: 'LIVE IN 20 MINS',
      isLiveSoon: true,
      description: 'Interactive problem-solving using practical kitchen fractions and visual shape models. In-app whiteboard & collaborative student chat.'
    },
    {
      id: 2,
      title: 'Cambridge Checkpoint Science: Chemical Reactions & Matter',
      teacher: 'Mwalimu David Otieno',
      day: 'Thursday',
      time: '02:00 PM - 02:50 PM EAT',
      subject: 'science',
      status: 'Scheduled',
      isLiveSoon: false,
      description: 'Demonstrating acids, bases, and indicator reactions live on camera with student interactive whiteboard Q&A.'
    },
    {
      id: 3,
      title: 'French Phonics & Conversational Circle for Beginners',
      teacher: 'Madame Cecile Uwimana',
      day: 'Friday',
      time: '10:00 AM - 10:40 AM EAT',
      subject: 'languages',
      status: 'Scheduled',
      isLiveSoon: false,
      description: 'Songs, greetings, and basic dialogue to cultivate French pronunciation and conversational confidence from home.'
    }
  ];

  const filteredSessions = subjectFilter === 'ALL'
    ? sessions
    : sessions.filter((s) => s.subject === subjectFilter);

  return (
    <div>
      {/* Header & Filter */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '28px', flexWrap: 'wrap', gap: '20px' }}>
        <div>
          <span className="glass-pill" style={{ color: '#EF4444', border: '1px solid rgba(239,68,68,0.3)', marginBottom: '8px', display: 'inline-block' }}>
            🔴 Outschool-Style Embedded Live Virtual Classroom
          </span>
          <h2 style={{ fontSize: '1.6rem', margin: 0, fontWeight: 800 }}>
            Live Teacher Masterclasses & Pod Sessions
          </h2>
          <p style={{ color: 'var(--text-secondary)', margin: '4px 0 0 0', fontSize: '0.92rem' }}>
            Fully integrated live virtual studio: interactive collaborative whiteboard, encrypted video tiles, student hand-raising & live chat.
          </p>
        </div>

        {/* Dropdown Filter */}
        <div>
          <label style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>
            Filter Subject:
          </label>
          <select
            className="custom-select"
            value={subjectFilter}
            onChange={(e) => setSubjectFilter(e.target.value)}
            style={{ minWidth: '180px' }}
          >
            <option value="ALL">All Subjects ({sessions.length})</option>
            <option value="math">Mathematics</option>
            <option value="science">Science & Lab</option>
            <option value="languages">Foreign Languages</option>
          </select>
        </div>
      </div>

      {/* Sessions Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
        {filteredSessions.map((session) => (
          <div
            key={session.id}
            className="glass-panel"
            style={{
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              border: session.isLiveSoon ? '1.5px solid #00A651' : '1px solid var(--border-subtle)',
              position: 'relative'
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span
                  className="glass-pill"
                  style={{
                    fontSize: '0.75rem',
                    color: session.isLiveSoon ? '#00A651' : '#F59E0B',
                    border: session.isLiveSoon ? '1px solid rgba(0,166,81,0.4)' : '1px solid rgba(245,158,11,0.3)'
                  }}
                >
                  {session.status}
                </span>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  In-App Virtual Room (Max 15 Kids)
                </span>
              </div>

              <h3 style={{ fontSize: '1.2rem', margin: '0 0 8px 0', lineHeight: 1.4 }}>{session.title}</h3>
              <div style={{ fontSize: '0.85rem', color: '#34D399', fontWeight: 600, marginBottom: '12px' }}>
                Facilitator: {session.teacher}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Calendar size={14} color="#F59E0B" />
                  <span>{session.day}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Clock size={14} color="#38BDF8" />
                  <span>{session.time}</span>
                </div>
              </div>

              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '20px' }}>
                {session.description}
              </p>
            </div>

            <div style={{ paddingTop: '16px', borderTop: '1px solid var(--border-subtle)' }}>
              <button
                onClick={() => setSelectedLiveSession(session)}
                className={session.isLiveSoon ? 'btn-primary' : 'btn-secondary'}
                style={{ width: '100%', justifyContent: 'center', gap: '8px' }}
              >
                <Video size={16} />
                <span>{session.isLiveSoon ? 'Enter In-App Live Classroom Now' : 'Open Virtual Classroom Preview'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Embedded Live Classroom Modal */}
      {selectedLiveSession && (
        <LiveClassroomModal
          isOpen={!!selectedLiveSession}
          onClose={() => setSelectedLiveSession(null)}
          sessionTitle={selectedLiveSession.title}
          teacherName={selectedLiveSession.teacher}
        />
      )}

    </div>
  );
}