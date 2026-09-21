import React, { useState } from 'react';
import { BookOpen, CheckCircle, ChevronDown, ChevronUp, Award, Play, Star } from 'lucide-react';

const MODULES = [
  {
    id: 1,
    icon: '🌱',
    title: 'Deschooling & The Transition to Homeschool',
    duration: '12 min read',
    color: '#10B981',
    lessons: [
      {
        title: 'What is Deschooling?',
        content: `Deschooling (coined by Ivan Illich) is the mental and emotional decompression period your child needs after leaving formal schooling. Research suggests 1 month of deschooling for every year spent in traditional school.\n\nDuring this period, your child may resist structured learning, seem "lazy," or only want to play. This is completely NORMAL and healthy. Their brain is healing from compliance-based learning.\n\n**What you should do:**\n• Follow your child's natural curiosity with zero pressure\n• Observe what they gravitate toward (LEGO, cooking, animals, drawing)\n• These interests become your curriculum hooks`
      },
      {
        title: 'Managing Parental Anxiety During Deschooling',
        content: `The hardest part of deschooling is often for the PARENT, not the child. We have been conditioned to equate learning with worksheets, sitting still, and assessment scores.\n\n**Reframe:** A child building a LEGO bridge is doing spatial geometry and engineering. A child cooking ugali is learning measurements, chemistry (heat + starch), and following sequential instructions.\n\n*Kenya insight:* Traditional African education was always project-based and community-embedded. SomaHome brings this back.`
      }
    ]
  },
  {
    id: 2,
    icon: '⏰',
    title: 'Pacing & Learning Rhythms',
    duration: '10 min read',
    color: '#38BDF8',
    lessons: [
      {
        title: 'The 3-Hour Rule (Nairobi Edition)',
        content: `Research by Dr. Peter Gray (Free to Learn) and the CBC design team both support the same finding: **3 focused hours of intentional learning = a full school day** for primary-age children.\n\nYoung brains have limited working memory capacity. After 3 hours of focused work, returns diminish rapidly.\n\n**Suggested SomaHome Daily Block:**\n• 8:00 – 9:30 AM: Core academics (Maths, English/Kiswahili)\n• 9:30 – 10:00 AM: Snack + outdoor break\n• 10:00 – 11:30 AM: Science, Social Studies, Creative Arts\n• Afternoon: Free exploration, reading, estate pod activities`
      },
      {
        title: 'Weekly Rhythm vs Daily Routine',
        content: `Rather than cramming all subjects every day, consider a **Weekly Rhythm**:\n\n• **Monday:** Maths deep-dive + Kiswahili\n• **Tuesday:** Science experiment + English\n• **Wednesday:** Creative Arts + life skills\n• **Thursday:** Social Studies + outdoor project\n• **Friday:** Review, portfolio documentation, free reading\n\nThis mirrors how professional creatives and researchers actually work — deep focus on fewer things produces better mastery than shallow daily rotation.`
      }
    ]
  },
  {
    id: 3,
    icon: '❤️',
    title: 'Positive Discipline in Homeschooling',
    duration: '8 min read',
    color: '#F472B6',
    lessons: [
      {
        title: 'Why Traditional Classroom Discipline Fails at Home',
        content: `Classroom management techniques (stickers, public praise charts, detention) are designed to manage 30 children with 1 adult. They often backfire 1-on-1.\n\nAt home, your child has full individual attention. Power struggles escalate because there's no peer group dynamics to moderate them.\n\n**Key Principle:** Separate the RELATIONSHIP from the LEARNING. Your child cannot learn from someone they are in conflict with. Connection must come before correction.`
      },
      {
        title: 'The CBC Competencies as a Discipline Framework',
        content: `CBC's 7 core competencies are actually a positive discipline roadmap:\n\n• **Communication & Collaboration** → Discuss, don't dictate\n• **Self-efficacy** → Let them choose HOW to demonstrate mastery\n• **Critical thinking** → Ask questions rather than giving answers\n• **Creativity & Imagination** → Never mark creative work "wrong"\n• **Citizenship** → Involve them in household responsibilities\n\n*Practical Nairobi tip:* When motivation drops, return to the **Why**. Visit Karen Blixen Museum, Nairobi National Park, or a local fundi workshop. Real-world relevance immediately reignites learning.`
      }
    ]
  },
  {
    id: 4,
    icon: '📁',
    title: 'CBC Portfolio Documentation',
    duration: '15 min read',
    color: '#F59E0B',
    lessons: [
      {
        title: 'Why the CBC Portfolio is Non-Negotiable',
        content: `Under the CBC framework, **School-Based Assessment (SBA)** contributes 60% to KPSEA results. For homeschoolers, this portfolio is your ONLY official evidence of learning.\n\nWithout a documented portfolio, your child cannot sit KPSEA/KCSE as a private candidate.\n\n**SomaHome automatically compiles:**\n• Daily lesson completion logs\n• Project photos and rubric scores (Level 1–4)\n• Attendance hours (MoE 900-hour requirement)\n• Reading logs\n• Creative arts submissions\n\nAll of this is exportable as a PDF transcript directly from your dashboard.`
      },
      {
        title: 'Physical vs Digital Portfolio',
        content: `Best practice: maintain BOTH.\n\n**Digital (SomaHome):** Attendance, assessments, reading logs, artwork uploads\n**Physical (Kraft paper folder or binder):**\n• Original drawings and craft projects\n• Science experiment write-ups in child's handwriting\n• Field trip photos printed and labelled\n• Book covers with child's reading notes\n\nKNEC has accepted photographed physical portfolios uploaded via official channels. SomaHome's export format is designed to be KNEC-compatible.`
      }
    ]
  }
];

export default function ParentAcademy() {
  const [expandedModule, setExpandedModule] = useState(null);
  const [expandedLesson, setExpandedLesson] = useState({});
  const [completed, setCompleted] = useState(() => {
    try { return JSON.parse(localStorage.getItem('soma_academy_completed') || '[]'); }
    catch { return []; }
  });

  const toggleModule = (id) => setExpandedModule(prev => prev === id ? null : id);
  const toggleLesson = (modId, lesIdx) => setExpandedLesson(prev => ({ ...prev, [`${modId}-${lesIdx}`]: !prev[`${modId}-${lesIdx}`] }));
  const markComplete = (id) => {
    const next = completed.includes(id) ? completed.filter(c => c !== id) : [...completed, id];
    setCompleted(next);
    localStorage.setItem('soma_academy_completed', JSON.stringify(next));
  };

  const doneCount = completed.length;

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <span className="glass-pill" style={{ color: '#F59E0B', border: '1px solid rgba(245,158,11,0.3)', marginBottom: '8px', display: 'inline-block' }}>
          🎓 Parent Professional Development
        </span>
        <h2 style={{ fontSize: '1.6rem', margin: 0, fontWeight: 800 }}>Homeschool Parent Academy</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: '4px 0 0 0' }}>
          Inspired by Elimu Nyumbani & CBC pedagogy — everything you need to lead learning with confidence.
        </p>
      </div>

      {/* Progress Bar */}
      <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-subtle)', borderRadius: '14px', padding: '16px 20px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <Award size={24} color="#F59E0B" />
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>Your Progress</span>
            <span style={{ fontSize: '0.82rem', color: '#F59E0B', fontWeight: 700 }}>{doneCount}/{MODULES.length} modules complete</span>
          </div>
          <div style={{ height: '6px', background: 'rgba(255,255,255,0.07)', borderRadius: '3px' }}>
            <div style={{ height: '100%', width: `${(doneCount / MODULES.length) * 100}%`, background: 'linear-gradient(90deg, #F59E0B, #FBBF24)', borderRadius: '3px', transition: 'width 0.4s ease' }} />
          </div>
        </div>
        {doneCount === MODULES.length && (
          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#10B981', background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '8px', padding: '4px 10px' }}>
            🏆 Certified!
          </span>
        )}
      </div>

      {/* Modules */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {MODULES.map(mod => {
          const isExpanded = expandedModule === mod.id;
          const isDone = completed.includes(mod.id);
          return (
            <div key={mod.id} className="glass-panel" style={{ padding: 0, overflow: 'hidden', border: isDone ? `1.5px solid ${mod.color}50` : '1px solid var(--border-subtle)' }}>
              {/* Module Header */}
              <div onClick={() => toggleModule(mod.id)} style={{ padding: '18px 22px', display: 'flex', alignItems: 'center', gap: '14px', cursor: 'pointer', background: isExpanded ? `${mod.color}08` : 'transparent', transition: 'background 0.2s' }}>
                <div style={{ fontSize: '1.6rem', flexShrink: 0 }}>{mod.icon}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: isDone ? mod.color : '#F8FAFC' }}>{mod.title}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px', display: 'flex', gap: '10px' }}>
                    <span>⏱ {mod.duration}</span>
                    <span>• {mod.lessons.length} lessons</span>
                    {isDone && <span style={{ color: mod.color, fontWeight: 700 }}>✓ Complete</span>}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {isDone && <CheckCircle size={18} color={mod.color} fill={mod.color} />}
                  {isExpanded ? <ChevronUp size={18} color="var(--text-muted)" /> : <ChevronDown size={18} color="var(--text-muted)" />}
                </div>
              </div>

              {/* Lessons */}
              {isExpanded && (
                <div style={{ borderTop: '1px solid var(--border-subtle)', padding: '16px 22px 20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {mod.lessons.map((lesson, li) => {
                    const lKey = `${mod.id}-${li}`;
                    const lExpanded = expandedLesson[lKey];
                    return (
                      <div key={li} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)', borderRadius: '10px', overflow: 'hidden' }}>
                        <div onClick={() => toggleLesson(mod.id, li)} style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <BookOpen size={15} color={mod.color} />
                            <span style={{ fontSize: '0.86rem', fontWeight: 600 }}>{lesson.title}</span>
                          </div>
                          {lExpanded ? <ChevronUp size={14} color="var(--text-muted)" /> : <ChevronDown size={14} color="var(--text-muted)" />}
                        </div>
                        {lExpanded && (
                          <div style={{ padding: '2px 16px 16px', fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.75, borderTop: '1px solid var(--border-subtle)', whiteSpace: 'pre-wrap' }}>
                            {lesson.content.split('\n').map((line, i) => {
                              if (line.startsWith('**') && line.endsWith('**')) {
                                return <div key={i} style={{ fontWeight: 800, color: mod.color, marginTop: '10px', marginBottom: '4px' }}>{line.replace(/\*\*/g, '')}</div>;
                              }
                              if (line.startsWith('•')) return <div key={i} style={{ paddingLeft: '12px' }}>{line}</div>;
                              if (line.startsWith('*') && line.endsWith('*')) return <div key={i} style={{ fontStyle: 'italic', color: 'var(--text-muted)', marginTop: '8px' }}>{line.replace(/\*/g, '')}</div>;
                              return <div key={i}>{line}</div>;
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}

                  <button onClick={() => markComplete(mod.id)} className={isDone ? "btn-secondary" : "btn-primary"} style={{ marginTop: '6px', justifyContent: 'center', fontSize: '0.85rem', background: isDone ? `${mod.color}15` : undefined, borderColor: isDone ? mod.color : undefined, color: isDone ? mod.color : undefined }}>
                    {isDone ? '✓ Module Complete — Click to Unmark' : '✅ Mark Module as Complete'}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {doneCount === MODULES.length && (
        <div style={{ marginTop: '28px', background: 'linear-gradient(135deg, rgba(245,158,11,0.15) 0%, rgba(251,191,36,0.08) 100%)', border: '1.5px solid rgba(245,158,11,0.4)', borderRadius: '16px', padding: '24px', textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>🏆</div>
          <h3 style={{ color: '#F59E0B', margin: '0 0 8px' }}>SomaHome Parent Educator Certified!</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>
            You have completed the full Homeschool Parent Academy. Your child is in excellent hands. Download your completion certificate from the Family Dashboard.
          </p>
        </div>
      )}
    </div>
  );
}
