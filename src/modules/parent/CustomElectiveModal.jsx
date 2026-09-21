import React, { useState } from 'react';
import { Plus, X, Sparkles, BookOpen, Clock, Calendar, CheckCircle2, Trash2 } from 'lucide-react';
import { customElectivesStore, ELECTIVE_PRESETS } from '../../services/customElectivesStore';

export default function CustomElectiveModal({ isOpen, onClose, activeStudent = 'liam', onElectiveAdded }) {
  if (!isOpen) return null;

  const [selectedPreset, setSelectedPreset] = useState('');
  const [dayNumber, setDayNumber] = useState(3); // Wednesday
  const [name, setName] = useState('Scratch Coding & Robotics');
  const [category, setCategory] = useState('STEM & Tech');
  const [timeSlot, setTimeSlot] = useState('02:00 PM - 02:45 PM');
  const [duration, setDuration] = useState(45);
  const [topic, setTopic] = useState('Building an Interactive Maze Game in Scratch 3.0');
  const [parentScript, setParentScript] = useState('Today we become software engineers! Let us open Scratch and create a sprite that navigates a maze using arrow keys.');
  const [learningObjective, setLearningObjective] = useState('Understand coordinate positions (X, Y) and program event listeners for keyboard arrow inputs.');
  const [materialsStr, setMaterialsStr] = useState('Laptop / Tablet with Scratch 3.0, Graph paper maze sketch');
  const [activity, setActivity] = useState('1. Sketch maze on graph paper.\n2. Create Player sprite.\n3. Program arrow key movement blocks.');
  const [isLab, setIsLab] = useState(true);
  const [hasPhoto, setHasPhoto] = useState(true);
  const [successToast, setSuccessToast] = useState(false);

  // Load existing electives for this student
  const existingElectives = customElectivesStore.getAll().filter(e => e.studentId === activeStudent);

  const handleSelectPreset = (presetName) => {
    setSelectedPreset(presetName);
    const preset = ELECTIVE_PRESETS.find(p => p.name === presetName);
    if (preset) {
      setName(preset.name);
      setCategory(preset.category);
      setTimeSlot(preset.timeSlot);
      setDuration(preset.duration);
      setTopic(preset.topic);
      setParentScript(preset.parentScript);
      setLearningObjective(preset.learningObjective);
      setMaterialsStr(preset.materials.join(', '));
      setActivity(preset.activity);
      setIsLab(preset.isLab);
      setHasPhoto(preset.hasPhoto);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const materials = materialsStr.split(',').map(m => m.trim()).filter(Boolean);

    const newElective = customElectivesStore.addElective({
      studentId: activeStudent,
      dayNumber: Number(dayNumber),
      name,
      category,
      timeSlot,
      duration: Number(duration),
      topic,
      parentScript,
      learningObjective,
      materials,
      activity,
      isLab,
      hasPhoto,
      worksheetName: `${name} Custom Activity Sheet`
    });

    setSuccessToast(true);
    if (onElectiveAdded) onElectiveAdded(newElective);
    setTimeout(() => {
      setSuccessToast(false);
      onClose();
    }, 1200);
  };

  const handleDelete = (id) => {
    customElectivesStore.deleteElective(id);
    if (onElectiveAdded) onElectiveAdded();
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px'
    }}>
      <div className="glass-panel animate-scale-up" style={{
        maxWidth: '680px', width: '100%', maxHeight: '90vh', overflowY: 'auto',
        background: '#0F172A', borderRadius: '24px', border: '1.5px solid rgba(0, 166, 81, 0.4)', padding: '28px', position: 'relative'
      }}>
        {/* Close Button */}
        <button onClick={onClose} style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
          <X size={20} />
        </button>

        {/* Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(0, 166, 81, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#00A651' }}>
            <Sparkles size={22} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 900, margin: 0, color: '#FFFFFF' }}>Custom Elective & Lesson Builder</h3>
            <p style={{ margin: '2px 0 0 0', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Add elective passions (*Coding, French, Piano, Taekwondo, Chess*) directly into your child's weekly timetable.
            </p>
          </div>
        </div>

        {/* Quick Presets Picker */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontSize: '0.75rem', color: '#38BDF8', fontWeight: 800, textTransform: 'uppercase', marginBottom: '8px' }}>
            ⚡ Instant Elective Presets:
          </label>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {ELECTIVE_PRESETS.map((p, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleSelectPreset(p.name)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '10px',
                  fontSize: '0.8rem',
                  fontWeight: selectedPreset === p.name ? 800 : 600,
                  cursor: 'pointer',
                  background: selectedPreset === p.name ? 'rgba(0,166,81,0.25)' : 'rgba(255,255,255,0.04)',
                  color: selectedPreset === p.name ? '#34D399' : '#E2E8F0',
                  border: selectedPreset === p.name ? '1px solid #00A651' : '1px solid var(--border-subtle)'
                }}
              >
                <span>{p.icon} {p.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Custom Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 700, marginBottom: '4px' }}>
                Elective Subject Name:
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="custom-select"
                style={{ width: '100%', fontSize: '0.85rem' }}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 700, marginBottom: '4px' }}>
                Day of the Week:
              </label>
              <select
                value={dayNumber}
                onChange={e => setDayNumber(e.target.value)}
                className="custom-select"
                style={{ width: '100%', fontSize: '0.85rem' }}
              >
                <option value={1}>Monday</option>
                <option value={2}>Tuesday</option>
                <option value={3}>Wednesday</option>
                <option value={4}>Thursday</option>
                <option value={5}>Friday</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 700, marginBottom: '4px' }}>
                Time Slot:
              </label>
              <input
                type="text"
                value={timeSlot}
                onChange={e => setTimeSlot(e.target.value)}
                className="custom-select"
                style={{ width: '100%', fontSize: '0.85rem' }}
                placeholder="e.g. 02:00 PM - 02:45 PM"
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 700, marginBottom: '4px' }}>
                Lesson Topic:
              </label>
              <input
                type="text"
                value={topic}
                onChange={e => setTopic(e.target.value)}
                className="custom-select"
                style={{ width: '100%', fontSize: '0.85rem' }}
                required
              />
            </div>
          </div>

          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 700, marginBottom: '4px' }}>
              🗣 Zero-Prep Parent/Facilitator Script (What to say aloud):
            </label>
            <textarea
              value={parentScript}
              onChange={e => setParentScript(e.target.value)}
              className="custom-select"
              style={{ width: '100%', fontSize: '0.84rem', padding: '8px' }}
              rows={2}
              required
            />
          </div>

          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 700, marginBottom: '4px' }}>
              🎯 Core Learning Objective:
            </label>
            <input
              type="text"
              value={learningObjective}
              onChange={e => setLearningObjective(e.target.value)}
              className="custom-select"
              style={{ width: '100%', fontSize: '0.84rem' }}
              required
            />
          </div>

          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 700, marginBottom: '4px' }}>
              🎒 Required Household Materials (Comma separated):
            </label>
            <input
              type="text"
              value={materialsStr}
              onChange={e => setMaterialsStr(e.target.value)}
              className="custom-select"
              style={{ width: '100%', fontSize: '0.84rem' }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 700, marginBottom: '4px' }}>
              📋 Hands-on Activity Instructions:
            </label>
            <textarea
              value={activity}
              onChange={e => setActivity(e.target.value)}
              className="custom-select"
              style={{ width: '100%', fontSize: '0.84rem', padding: '8px' }}
              rows={3}
            />
          </div>

          {/* Existing Custom Electives List */}
          {existingElectives.length > 0 && (
            <div style={{ marginBottom: '20px', borderTop: '1px solid var(--border-subtle)', paddingTop: '14px' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', marginBottom: '8px' }}>
                Your Active Custom Electives:
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {existingElectives.map(e => (
                  <div key={e.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.03)', padding: '6px 12px', borderRadius: '8px', fontSize: '0.82rem' }}>
                    <span><strong>{e.name}</strong> · Day {e.dayNumber} ({e.timeSlot})</span>
                    <button type="button" onClick={() => handleDelete(e.id)} style={{ background: 'none', border: 'none', color: '#F87171', cursor: 'pointer' }}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', alignItems: 'center' }}>
            {successToast && (
              <span style={{ fontSize: '0.82rem', color: '#34D399', fontWeight: 700, marginRight: 'auto' }}>
                ✓ Elective Added & Injected into Today's Timetable!
              </span>
            )}
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary" style={{ gap: '6px' }}>
              <Plus size={16} />
              <span>Add Elective to Homeschool Timetable</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
