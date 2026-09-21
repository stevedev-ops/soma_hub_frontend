import React, { useState } from 'react';
import { Calendar, MapPin, Users, Ticket, Check, ShieldCheck, X, Phone, Star, Plus } from 'lucide-react';

/* ─── Who Organises Events? ──────────────────────────────────────────────────
   Events on SomaHome are organised by THREE types of hosts:
   1. Estate Pod Leaders (verified parent volunteers who coordinate local meetups)
   2. Verified SomaHome Facilitators (teachers who run academic lab sessions)
   3. Community Admins (SomaHome staff who curate large nature/sports events)
   
   Any verified parent can PROPOSE an event via "Suggest an Event" — the Admin
   reviews and publishes it after confirming the venue and safety.
──────────────────────────────────────────────────────────────────────────── */

// ─── M-Pesa RSVP Modal ───────────────────────────────────────────────────────
function EventRsvpModal({ event, onClose }) {
  const [step, setStep] = useState(1); // 1=confirm, 2=pin, 3=success
  const [phone, setPhone] = useState('0712 345 678');
  const [pin, setPin] = useState(['', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);

  const isFree = event.fee_kes === 0;

  const handlePinInput = (idx, val) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...pin];
    next[idx] = val;
    setPin(next);
    if (val && idx < 3) document.getElementById(`rsvp-pin-${idx + 1}`)?.focus();
  };

  const handleConfirm = () => {
    if (isFree) { setStep(3); return; }
    setIsLoading(true);
    setTimeout(() => { setIsLoading(false); setStep(2); }, 1200);
  };

  const handlePay = () => {
    if (pin.join('').length < 4) return;
    setIsLoading(true);
    setTimeout(() => { setIsLoading(false); setStep(3); }, 1800);
  };

  return (
    <div
      onClick={(e) => e.target === e.currentTarget && onClose()}
      style={{
        position: 'fixed', inset: 0, backgroundColor: 'rgba(5,10,15,0.88)',
        backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center',
        justifyContent: 'center', zIndex: 9999, padding: '20px'
      }}
    >
      <div style={{
        width: '100%', maxWidth: '460px', background: 'var(--bg-card)',
        borderRadius: '20px', border: '1px solid var(--border-card)',
        boxShadow: '0 24px 60px -10px rgba(0,0,0,0.8)', overflow: 'hidden'
      }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: isFree ? 'rgba(16,185,129,0.1)' : 'rgba(0,166,81,0.1)' }}>
          <div>
            <div style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', color: isFree ? '#10B981' : '#00A651', marginBottom: '4px' }}>
              {isFree ? '🎟️ Free Spot Reservation' : '🟢 Lipa Na M-Pesa — Event Booking'}
            </div>
            <div style={{ fontSize: '1rem', fontWeight: 800, color: '#F8FAFC', lineHeight: 1.3 }}>{event.title}</div>
          </div>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '6px', cursor: 'pointer', display: 'flex', color: 'var(--text-secondary)' }}>
            <X size={16} />
          </button>
        </div>

        <div style={{ padding: '24px' }}>
          {step === 1 && (
            <div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
                {[
                  { label: 'Date', value: event.date, color: '#F59E0B' },
                  { label: 'Venue', value: event.location, color: '#F8FAFC' },
                  { label: 'Host', value: event.host, color: '#34D399' },
                ].map(r => (
                  <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.86rem', padding: '9px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', border: '1px solid var(--border-subtle)', gap: '10px' }}>
                    <span style={{ color: 'var(--text-secondary)', flexShrink: 0 }}>{r.label}</span>
                    <strong style={{ color: r.color, textAlign: 'right' }}>{r.value}</strong>
                  </div>
                ))}
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.86rem', padding: '9px 12px', background: isFree ? 'rgba(16,185,129,0.08)' : 'rgba(0,166,81,0.08)', borderRadius: '10px', border: `1px solid ${isFree ? 'rgba(16,185,129,0.3)' : 'rgba(0,166,81,0.3)'}` }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Fee per Learner</span>
                  <strong style={{ fontSize: '1.1rem', color: isFree ? '#10B981' : '#F8FAFC' }}>
                    {isFree ? 'FREE' : `KES ${event.fee_kes.toLocaleString()}`}
                  </strong>
                </div>
              </div>

              {!isFree && (
                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>M-Pesa Phone Number</label>
                  <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
                    style={{ width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-card)', borderRadius: '10px', padding: '10px 14px', color: '#F8FAFC', fontSize: '1rem', fontWeight: 700, boxSizing: 'border-box' }} />
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>STK Push will be sent to this number.</div>
                </div>
              )}

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.73rem', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', padding: '8px 12px', marginBottom: '18px' }}>
                <ShieldCheck size={13} color="#10B981" />
                <span><strong>{event.max_capacity - event.attendees_count} spots remaining</strong> of {event.max_capacity}. Reviewed by SomaHome Admin.</span>
              </div>

              <button onClick={handleConfirm} disabled={isLoading} className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '12px', fontSize: '0.95rem', fontWeight: 800 }}>
                {isLoading ? '⏳ Sending STK Push...' : isFree ? '✅ Reserve My Spot (Free)' : `💚 Pay KES ${event.fee_kes.toLocaleString()} via M-Pesa`}
              </button>
            </div>
          )}

          {step === 2 && (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>📱</div>
              <h3 style={{ margin: '0 0 8px 0', fontSize: '1.1rem' }}>STK Push Sent!</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: '24px' }}>
                Payment prompt sent to <strong style={{ color: '#10B981' }}>{phone}</strong>. Enter your 4-digit M-Pesa PIN to confirm.
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '24px' }}>
                {pin.map((d, i) => (
                  <input key={i} id={`rsvp-pin-${i}`} type="password" maxLength={1} value={d}
                    onChange={(e) => handlePinInput(i, e.target.value)}
                    style={{ width: '52px', height: '60px', textAlign: 'center', fontSize: '1.5rem', fontWeight: 800, background: 'rgba(0,0,0,0.4)', border: `2px solid ${d ? '#00A651' : 'var(--border-card)'}`, borderRadius: '12px', color: '#F8FAFC' }} />
                ))}
              </div>
              <button onClick={handlePay} disabled={isLoading || pin.join('').length < 4} className="btn-primary"
                style={{ width: '100%', justifyContent: 'center', padding: '12px', opacity: pin.join('').length < 4 ? 0.5 : 1 }}>
                {isLoading ? '⏳ Verifying...' : '🔓 Confirm Payment'}
              </button>
            </div>
          )}

          {step === 3 && (
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: '68px', height: '68px', borderRadius: '50%', background: 'rgba(16,185,129,0.15)', border: '2px solid #10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <Check size={30} color="#10B981" />
              </div>
              <h3 style={{ margin: '0 0 8px 0', color: '#10B981', fontSize: '1.2rem' }}>
                {isFree ? 'Spot Reserved!' : 'Payment Confirmed!'}
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: '18px', lineHeight: 1.6 }}>
                {isFree ? `You're registered! Event details sent via SMS.` : `KES ${event.fee_kes.toLocaleString()} paid. Receipt sent via SMS. Your child's spot is confirmed!`}
              </p>
              <div style={{ background: 'rgba(0,166,81,0.08)', border: '1px solid rgba(0,166,81,0.25)', borderRadius: '12px', padding: '14px', marginBottom: '18px', textAlign: 'left' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#34D399', marginBottom: '8px', textTransform: 'uppercase' }}>📋 What to Bring</div>
                <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                  • SomaHome digital confirmation (screenshot this screen)<br />
                  • Sun protection &amp; full water bottle<br />
                  • Your child's CBC Portfolio notebook<br />
                  • Arrive 10 minutes early
                </div>
              </div>
              <button onClick={onClose} className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                🎉 Done — See You There!
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Suggest Event Modal ──────────────────────────────────────────────────────
function SuggestEventModal({ onClose }) {
  const [form, setForm] = useState({ title: '', location: '', date: '', type: 'nature', description: '', fee: '0' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setTimeout(() => setSubmitted(true), 800);
  };

  return (
    <div onClick={(e) => e.target === e.currentTarget && onClose()} style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(5,10,15,0.88)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px' }}>
      <div style={{ width: '100%', maxWidth: '500px', background: 'var(--bg-card)', borderRadius: '20px', border: '1px solid var(--border-card)', overflow: 'hidden', maxHeight: '92vh', overflowY: 'auto' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, background: 'var(--bg-card)', zIndex: 10 }}>
          <div>
            <div style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', color: '#818CF8', marginBottom: '4px' }}>Community Pod Leader</div>
            <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Propose a Homeschool Event</h3>
          </div>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '6px', cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex' }}>
            <X size={16} />
          </button>
        </div>
        {submitted ? (
          <div style={{ padding: '40px', textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🎉</div>
            <h3 style={{ color: '#10B981' }}>Event Submitted for Review!</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>The SomaHome Admin will review within 24 hours and notify you via SMS if approved for listing.</p>
            <button onClick={onClose} className="btn-primary" style={{ marginTop: '16px' }}>Close</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '6px' }}>Event Title *</label>
              <input required value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="e.g. Ngong Hills Morning Hike for Homeschoolers" style={{ width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-card)', borderRadius: '10px', padding: '9px 12px', color: '#F8FAFC', fontSize: '0.88rem', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '6px' }}>Venue / Location *</label>
              <input required value={form.location} onChange={e => setForm(p => ({ ...p, location: e.target.value }))} placeholder="e.g. Ngong Hills Trailhead, off Ngong Road" style={{ width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-card)', borderRadius: '10px', padding: '9px 12px', color: '#F8FAFC', fontSize: '0.88rem', boxSizing: 'border-box' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '6px' }}>Proposed Date *</label>
                <input required type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} style={{ width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-card)', borderRadius: '10px', padding: '9px 12px', color: '#F8FAFC', fontSize: '0.85rem', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '6px' }}>Event Type *</label>
                <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))} className="custom-select" style={{ width: '100%', fontSize: '0.85rem' }}>
                  <option value="nature">🌲 Nature / Outdoor</option>
                  <option value="sports">🏊 Sports / Athletics</option>
                  <option value="arts">🎭 Arts / Drama</option>
                  <option value="academic">🧪 Academic Lab</option>
                </select>
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '6px' }}>Fee per Learner (KES, 0 = Free)</label>
              <input type="number" min="0" value={form.fee} onChange={e => setForm(p => ({ ...p, fee: e.target.value }))} style={{ width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-card)', borderRadius: '10px', padding: '9px 12px', color: '#F8FAFC', fontSize: '0.88rem', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '6px' }}>Description *</label>
              <textarea required rows={3} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="What will learners do? What materials to bring?" style={{ width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-card)', borderRadius: '10px', padding: '9px 12px', color: '#F8FAFC', fontSize: '0.85rem', resize: 'vertical', boxSizing: 'border-box' }} />
            </div>
            <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '11px' }}>
              📤 Submit for Community Admin Review
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function CommunityEvents() {
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showSuggest, setShowSuggest] = useState(false);

  const events = [
    {
      id: 1,
      title: 'Karura Forest Biodiversity & Stream Ecology Walk',
      category: 'nature',
      category_label: '🌲 Nature & Science',
      date: 'Sat, 26 Sep 2026 • 09:00 AM – 12:30 PM',
      location: 'Karura Forest (Gate A, Limuru Rd)',
      host: 'Karen & Kilimani Homeschool Pods',
      host_type: 'Estate Pod Leaders',
      fee_kes: 600,
      attendees_count: 24,
      max_capacity: 30,
      description: 'Hands-on water quality testing in the Karura river, indigenous tree identification, and birdwatching with a KWS-trained guide.'
    },
    {
      id: 2,
      title: 'Kilimani Homeschoolers Daytime Swimming & Athletics Meet',
      category: 'sports',
      category_label: '🏊 Sports & Swimming',
      date: 'Wed, 30 Sep 2026 • 10:00 AM – 01:00 PM',
      location: 'Kilimani Pool & Sports Grounds',
      host: 'Teacher David Otieno',
      host_type: 'Verified SomaHome Facilitator',
      fee_kes: 1200,
      attendees_count: 18,
      max_capacity: 25,
      description: 'Daytime swimming drills scheduled during school hours so homeschoolers have the pool to themselves. Social play and peer bonding included.'
    },
    {
      id: 3,
      title: 'Nairobi Arboretum Outdoor Drama & Swahili Storytelling Picnic',
      category: 'arts',
      category_label: '🎭 Arts & Drama',
      date: 'Fri, 02 Oct 2026 • 10:30 AM – 02:00 PM',
      location: 'Nairobi Arboretum (State House Rd)',
      host: 'Mama Liam & Syokimau Pod',
      host_type: 'Estate Pod Leader',
      fee_kes: 0,
      attendees_count: 35,
      max_capacity: 50,
      description: 'Bring a picnic basket! Children recite poems, act out folk tales, and build public-speaking confidence in a relaxed garden setting.'
    },
    {
      id: 4,
      title: 'Cambridge Checkpoint & IGCSE Hands-on Chemistry Lab',
      category: 'academic',
      category_label: '🧪 Accredited Science Lab',
      date: 'Sat, 10 Oct 2026 • 08:30 AM – 01:30 PM',
      location: 'Lavington Science Center Labs',
      host: 'Teacher Laxi Calculas & British Council Proctors',
      host_type: 'Verified SomaHome Facilitator',
      fee_kes: 3500,
      attendees_count: 12,
      max_capacity: 15,
      description: 'Real laboratory bench practicals: titration, flame tests, and microscope observations for private exam candidates.'
    }
  ];

  const filteredEvents = categoryFilter === 'ALL' ? events : events.filter((e) => e.category === categoryFilter);

  const hostColor = (type) => {
    if (type === 'Verified SomaHome Facilitator') return { bg: 'rgba(16,185,129,0.1)', color: '#10B981', border: 'rgba(16,185,129,0.3)' };
    return { bg: 'rgba(56,189,248,0.1)', color: '#38BDF8', border: 'rgba(56,189,248,0.3)' };
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '18px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <span className="glass-pill" style={{ color: '#38BDF8', border: '1px solid rgba(56,189,248,0.3)', marginBottom: '8px', display: 'inline-block' }}>
            🤝 Socialization & Extracurriculars
          </span>
          <h2 style={{ fontSize: '1.6rem', margin: 0, fontWeight: 800 }}>Homeschool Daytime Events & Meetups</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', margin: '4px 0 0 0' }}>
            Organised by <strong style={{ color: '#38BDF8' }}>Estate Pod Leaders</strong>, <strong style={{ color: '#10B981' }}>Verified Facilitators</strong> & <strong style={{ color: '#818CF8' }}>SomaHome Admins</strong>
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>Filter Type:</label>
            <select className="custom-select" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} style={{ minWidth: '200px' }}>
              <option value="ALL">🌟 All Events ({events.length})</option>
              <option value="nature">🌲 Nature & Outdoor</option>
              <option value="sports">🏊 Sports & Athletics</option>
              <option value="arts">🎭 Arts & Drama</option>
              <option value="academic">🧪 Science Labs</option>
            </select>
          </div>
          <button onClick={() => setShowSuggest(true)} className="btn-secondary" style={{ fontSize: '0.78rem', padding: '8px 14px', gap: '6px' }}>
            <Plus size={14} /><span>Propose an Event</span>
          </button>
        </div>
      </div>

      {/* Who Organises Banner */}
      <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '12px 18px', marginBottom: '22px', display: 'flex', gap: '24px', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>Who Organises?</div>
        {[
          { icon: '🏘️', label: 'Estate Pod Leaders', desc: 'Verified parent volunteers', color: '#38BDF8' },
          { icon: '👨‍🏫', label: 'Verified Facilitators', desc: 'TSC-accredited teachers', color: '#10B981' },
          { icon: '🛡️', label: 'SomaHome Admin', desc: 'Platform staff for large events', color: '#818CF8' },
        ].map((h) => (
          <div key={h.label} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.1rem' }}>{h.icon}</span>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: h.color }}>{h.label}</div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{h.desc}</div>
            </div>
          </div>
        ))}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.72rem', color: '#10B981' }}>
          <ShieldCheck size={13} />
          <span>All events safety-reviewed before listing</span>
        </div>
      </div>

      {/* Events Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
        {filteredEvents.map((evt) => {
          const hc = hostColor(evt.host_type);
          const spotsLeft = evt.max_capacity - evt.attendees_count;
          return (
            <div key={evt.id} className="glass-panel" style={{ padding: '22px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span className="glass-pill" style={{ fontSize: '0.72rem', background: 'rgba(255,255,255,0.05)', color: '#38BDF8' }}>{evt.category_label}</span>
                  <span style={{ fontSize: '0.74rem', color: spotsLeft <= 5 ? '#EF4444' : '#10B981', fontWeight: 700 }}>
                    {spotsLeft <= 0 ? '🔴 Full' : `${spotsLeft} Spots Left`}
                  </span>
                </div>
                <h3 style={{ fontSize: '1.05rem', margin: '0 0 8px 0', lineHeight: 1.4 }}>{evt.title}</h3>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', background: hc.bg, border: `1px solid ${hc.border}`, borderRadius: '8px', padding: '3px 10px', marginBottom: '10px' }}>
                  <span style={{ fontSize: '0.66rem', fontWeight: 800, color: hc.color, textTransform: 'uppercase' }}>{evt.host_type}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', fontSize: '0.81rem', color: 'var(--text-secondary)', marginBottom: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Calendar size={13} color="#F59E0B" /><strong style={{ color: 'var(--text-primary)', fontSize: '0.78rem' }}>{evt.date}</strong></div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><MapPin size={13} color="#00A651" /><span>{evt.location}</span></div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Users size={13} color="#818CF8" /><span>Hosted by: <strong style={{ color: '#34D399' }}>{evt.host}</strong></span></div>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.55, marginBottom: '14px' }}>{evt.description}</p>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '14px', borderTop: '1px solid var(--border-subtle)' }}>
                <div>
                  <div style={{ fontSize: '0.66rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Fee per Learner</div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 800, color: evt.fee_kes === 0 ? '#10B981' : '#F8FAFC' }}>{evt.fee_kes === 0 ? 'FREE' : `KES ${evt.fee_kes.toLocaleString()}`}</div>
                </div>
                <button onClick={() => setSelectedEvent(evt)} disabled={spotsLeft <= 0} className="btn-primary"
                  style={{ fontSize: '0.82rem', padding: '9px 14px', opacity: spotsLeft <= 0 ? 0.5 : 1, cursor: spotsLeft <= 0 ? 'not-allowed' : 'pointer' }}>
                  <Ticket size={14} />
                  <span>{evt.fee_kes === 0 ? 'Reserve Spot' : 'Book via M-Pesa'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {selectedEvent && <EventRsvpModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />}
      {showSuggest && <SuggestEventModal onClose={() => setShowSuggest(false)} />}
    </div>
  );
}
