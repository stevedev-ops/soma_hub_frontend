import React, { useState } from 'react';
import { Calendar, CheckCircle2, Download, Printer, FileText, ChevronRight, Sparkles, BookOpen } from 'lucide-react';

export default function TermWeeksNavigator({ onSelectWeek }) {
  const [selectedWeek, setSelectedWeek] = useState(3);

  const weeks = [
    { num: 1, title: "Baseline Diagnostic & Place Values", outcomes: ["Whole numbers up to 10,000", "Living vs Non-Living things", "Nouns & Proper Names"], pages: 12 },
    { num: 2, title: "Addition, Subtraction & Kenyan Habitats", outcomes: ["Adding 4-digit numbers with carrying", "Herbivores vs Carnivores", "Sentence structures"], pages: 14 },
    { num: 3, title: "Environmental Cleanliness, Fractions & Matter", outcomes: ["Perform safe water purification", "Divide objects into fractional parts", "Use descriptive adverbs in storytelling"], pages: 14, isCurrent: true },
    { num: 4, title: "Multiplication, Plant Roots & Indigenous Trees", outcomes: ["Multiplication tables 6-9", "Tap roots vs fibrous roots", "Oral storytelling"], pages: 12 },
    { num: 5, title: "Geometry, 2D Shapes & Soil Erosion", outcomes: ["Perimeter of rectangles and squares", "Causes of soil erosion in farms", "Punctuation marks"], pages: 14 },
    { num: 6, title: "Measurements (Mass/Volume) & Animal Nutrition", outcomes: ["Kilograms and grams measuring", "Nutrients for farm animals", "Swahili comprehension"], pages: 12 },
    { num: 7, title: "Mid-Term Review & Karura Nature Exploration", outcomes: ["Mid-term diagnostic revision", "Stream water testing", "Public speaking practice"], pages: 16 },
    { num: 8, title: "Money, Trade & Financial Literacy", outcomes: ["Kenyan currency notes and coins", "Profit, loss and budget basics", "Market simulation dialog"], pages: 14 },
    { num: 9, title: "Time, Calendars & East African Seasons", outcomes: ["Reading analog clock and digital timetables", "Long rains vs short rains in Kenya", "Verbs in past tense"], pages: 12 },
    { num: 10, title: "Energy, Heat & Improved Jiko Efficiency", outcomes: ["Conduction and convection in cooking", "Charcoal vs firewood conservation", "Writing explanatory letters"], pages: 14 },
    { num: 11, title: "Nutrition, Balanced Diets & Indigenous Foods", outcomes: ["Traditional vegetables (Managu, Terere, Sukuma)", "Vitamins, proteins and carbohydrates", "Writing recipes"], pages: 12 },
    { num: 12, title: "End-of-Term Capstone & Portfolio Certification", outcomes: ["Term 1 comprehensive review", "Final student exhibition", "CBC Rubric certification"], pages: 18 }
  ];

  const currentWeekData = weeks.find((w) => w.num === selectedWeek) || weeks[2];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* Header & Dropdown */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '28px', flexWrap: 'wrap', gap: '20px' }}>
        <div>
          <span className="glass-pill" style={{ color: '#F59E0B', border: '1px solid rgba(245,158,11,0.3)', marginBottom: '8px', display: 'inline-block' }}>
            📅 12-Week Term Progression Roadmap
          </span>
          <h2 style={{ fontSize: '1.6rem', margin: 0, fontWeight: 800 }}>
            Term 1 Full Curriculum Syllabus Navigator
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: '4px 0 0 0' }}>
            Grade 4 CBC • Complete 12-week roadmap from diagnostic baseline to final capstone
          </p>
        </div>

        {/* WEEK DROPDOWN FILTER */}
        <div>
          <label style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>
            Jump to Week:
          </label>
          <select
            className="custom-select"
            value={selectedWeek}
            onChange={(e) => setSelectedWeek(parseInt(e.target.value))}
            style={{ minWidth: '280px' }}
          >
            {weeks.map((w) => (
              <option key={w.num} value={w.num}>
                Week {w.num}: {w.title} {w.isCurrent ? '★ (Active Now)' : ''}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Selected Week Detail Card */}
      <div className="glass-panel" style={{ padding: '28px', marginBottom: '32px', border: '1.5px solid rgba(0,166,81,0.4)', borderRadius: '18px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '16px' }}>
          <div>
            <span className="glass-pill badge-cbc">
              Week {currentWeekData.num} of 12
            </span>
            <h3 style={{ fontSize: '1.4rem', margin: '8px 0 4px 0', fontWeight: 800 }}>{currentWeekData.title}</h3>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Consolidated Printable Pack: {currentWeekData.pages} Pages
            </div>
          </div>

          {/* Direct Binary PDF Download button linking to Django backend */}
          <a
            href={`${import.meta.env.VITE_API_URL || "https://soma-hub-backend.onrender.com/api"}/curriculum/download-printable-pack/`}
            target="_blank"
            rel="noreferrer"
            className="btn-primary"
            style={{ textDecoration: 'none', padding: '10px 18px', fontSize: '0.85rem' }}
          >
            <Download size={16} />
            <span>Download Official Week {currentWeekData.num} PDF Pack</span>
          </a>
        </div>

        <div>
          <h4 style={{ fontSize: '0.92rem', color: '#34D399', marginBottom: '10px', fontWeight: 700 }}>
            Core Learning Outcomes:
          </h4>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {currentWeekData.outcomes.map((out, i) => (
              <span key={i} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '6px 12px', fontSize: '0.85rem', color: '#F1F5F9' }}>
                ✓ {out}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* All 12 Weeks Grid */}
      <div style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '14px', letterSpacing: '0.05em' }}>
        Complete 12-Week Term Overview:
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
        {weeks.map((w) => {
          const isSelected = selectedWeek === w.num;
          return (
            <div
              key={w.num}
              onClick={() => setSelectedWeek(w.num)}
              className="glass-panel"
              style={{
                padding: '20px',
                cursor: 'pointer',
                borderRadius: '14px',
                border: isSelected ? '1.5px solid #00A651' : '1px solid var(--border-subtle)',
                background: isSelected ? 'rgba(0,166,81,0.12)' : 'rgba(14, 21, 36, 0.75)',
                transition: 'all 0.15s ease'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: isSelected ? '#34D399' : '#F59E0B' }}>
                  WEEK {w.num}
                </span>
                {w.isCurrent && (
                  <span style={{ fontSize: '0.65rem', background: 'rgba(0,166,81,0.25)', color: '#34D399', padding: '2px 6px', borderRadius: '4px', fontWeight: 800 }}>
                    ACTIVE NOW
                  </span>
                )}
              </div>

              <h4 style={{ fontSize: '0.95rem', margin: '0 0 8px 0', lineHeight: 1.4 }}>{w.title}</h4>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {w.pages} Printable Pages • 5 Daily Guides
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}