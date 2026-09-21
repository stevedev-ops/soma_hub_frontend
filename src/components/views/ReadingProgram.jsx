import React, { useState } from 'react';
import { BookOpen, Volume2, Star, CheckCircle, Clock, Sparkles, Award } from 'lucide-react';
import { readingStore, xpStore } from '../../services/portfolioStore';
import VoicePlayerPill from '../VoicePlayerPill';

export default function ReadingProgram() {
  const [activeStory, setActiveStory] = useState('simba');

  const [booksRead, setBooksRead] = useState(() => {
    const stored = readingStore.getAll();
    if (stored.length === 0) return [
      { id: 1, bookTitle: 'The Red Elephants of Tsavo', minutes: 25, comprehensionStars: 5, date: '15 Sep', loggedAt: new Date().toISOString() },
      { id: 2, bookTitle: 'Sungura Mjanja na Fisi', minutes: 30, comprehensionStars: 5, date: '13 Sep', loggedAt: new Date().toISOString() },
      { id: 3, bookTitle: 'Wangari Maathai: Mother of Trees', minutes: 35, comprehensionStars: 5, date: '10 Sep', loggedAt: new Date().toISOString() },
    ];
    return stored;
  });
  const [logSuccess, setLogSuccess] = useState(false);
  const [totalMinutes, setTotalMinutes] = useState(() => readingStore.totalMinutes() || 90);

  const [newBookTitle, setNewBookTitle] = useState('');
  const [newBookMinutes, setNewBookMinutes] = useState(20);

  const stories = {
    simba: {
      title: 'The Honeyguide Bird and the Boy of the Mara',
      level: 'Grade 4 Reader • Level 4.2',
      language: 'en-KE',
      passage: `In the golden savannah near the Mara River, a small brown bird named Ndege flew swiftly from tree to tree. She made a sharp chattering sound: "Chirr-chirr-chatter!" 
      
Liam knew this was no ordinary bird. In Kenya, elders have known the Greater Honeyguide for hundreds of years. The bird calls out when it finds a wild beehive hidden inside a hollow baobab tree, but it cannot open the thick wood itself. It needs a human partner.

Liam followed the bird quietly under the acacia thorns. The bird dipped its wings, pointing directly at a tall hollow branch. High above, bees were humming softly, and golden wild honey glistened in the morning light. After taking a small piece of honeycomb, Liam left a large portion of beeswax and larvae on a flat rock—a sacred reward for the bird. "Asante sana, rafiki yangu," whispered Liam with a smile.`
    },
    sungura: {
      title: 'Hekaya za Abunuwasi na Sungura Mjanja',
      level: 'Kiswahili Grade 4 • Kusoma kwa Ufahamu',
      language: 'sw-KE',
      passage: `Hapo zamani za kale katika kijiji cha Kilifi, palitokea ukame mkubwa. Wanyama wote walikubaliana kuchimba kisima kirefu ili kupata maji safi ya kunywa.

Sungura, akiwa mvivu sana, alikataa kushika jembe akisema: "Mimi mikono yangu ni laini sana, siwezi kuchimba udongo mkavu!" Wanyama wengine kama Tembo, Simba, na Twiga walifanya kazi kwa bidii mchana kutwa chini ya jua kali.

Jioni ilipofika na maji safi yakabubujika, Sungura alikuja kisiri na kibuyu chake kikubwa kunywa maji bila idhini. Lakini Kobe mwerevu na Fisi walikuwa wameweka mtego imara wa gundi kwenye ukingo wa kisima. Sungura alipokanyaga, akaganda papo hapo! Wanyama wote walicheka na kumfunza Sungura kuwa kazi ya pamoja ndiyo msingi wa maisha.`
    },
    shairi: {
      title: 'Shairi la Mazingira Yetu (Ushairi wa Watoto)',
      level: 'Kiswahili Fasihi • Ushairi na Melodi',
      language: 'sw-KE',
      passage: `Miti tupande kwa bidii, hewa safi tuipate,
Mito yetu tulinde jamani, maji mema yatiririke,
Tusitupe plastiki ovyo, ardhi yetu ibarikiwe,
Elimu ya mazingira nyumbani, ni urithi wa vizazi vyote!`
    }
  };

  const handleAddBook = (e) => {
    e.preventDefault();
    if (!newBookTitle) return;
    readingStore.add({ bookTitle: newBookTitle, minutes: parseInt(newBookMinutes) || 20, comprehensionStars: 5 });
    xpStore.add(10);
    setBooksRead(readingStore.getAll());
    setTotalMinutes(readingStore.totalMinutes());
    setNewBookTitle('');
    setNewBookMinutes(20);
  };

  const handleMark20Mins = () => {
    readingStore.add({ bookTitle: stories[activeStory].title, minutes: 20, comprehensionStars: 5, notes: 'In-app guided reading session' });
    xpStore.add(20);
    setBooksRead(readingStore.getAll());
    setTotalMinutes(readingStore.totalMinutes());
    setLogSuccess(true);
    setTimeout(() => setLogSuccess(false), 4000);
  };

  const cur = stories[activeStory];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '26px' }}>
      
      {/* LEFT: Reader Passage & Audio Narration */}
      <div className="glass-panel" style={{ padding: '28px' }}>
        
        {/* Story Selector Dropdown */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <span className="glass-pill" style={{ color: '#10B981', border: '1px solid rgba(16,185,129,0.3)', marginBottom: '6px', display: 'inline-block' }}>
              📚 Kenyan Reading Anthology
            </span>
            <h2 style={{ fontSize: '1.4rem', margin: 0 }}>Guided Reading Room</h2>
          </div>

          <select
            className="custom-select"
            value={activeStory}
            onChange={(e) => setActiveStory(e.target.value)}
            style={{ minWidth: '220px' }}
          >
            <option value="simba">🦅 Honeyguide Bird (English)</option>
            <option value="sungura">🐰 Sungura Mjanja (Kiswahili)</option>
            <option value="shairi">🌿 Shairi la Mazingira (Ushairi)</option>
          </select>
        </div>

        {/* Story Title & Voice AI Controls */}
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)', borderRadius: '14px', padding: '18px 20px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', margin: 0, color: '#F8FAFC' }}>{cur.title}</h3>
              <div style={{ fontSize: '0.78rem', color: '#F59E0B', fontWeight: 600, marginTop: '2px' }}>
                {cur.level}
              </div>
            </div>

            {/* Voice AI Read Aloud Pill */}
            <VoicePlayerPill
              textToRead={cur.passage}
              label="Listen Aloud"
              swahiliLabel="Sikiliza Hadithi"
              preferredLang={activeStory === 'simba' ? 'en' : 'sw'}
            />
          </div>
        </div>

        {/* Passage Display */}
        <div style={{
          background: 'rgba(255,255,255,0.01)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '14px',
          padding: '24px',
          fontSize: '1.05rem',
          lineHeight: 1.8,
          color: '#E2E8F0',
          whiteSpace: 'pre-line',
          minHeight: '260px'
        }}>
          {cur.passage}
        </div>

        {/* Action Button */}
        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <button
            onClick={handleMark20Mins}
            className="btn-primary"
            style={{ fontSize: '0.9rem', padding: '10px 20px' }}
          >
            <CheckCircle size={16} />
            <span>Mark 20 Mins Read (+20 XP)</span>
          </button>

          {logSuccess && (
            <span style={{ fontSize: '0.85rem', color: '#34D399', fontWeight: 700 }}>
              ✓ Logged to Reading Portfolio!
            </span>
          )}
        </div>
      </div>

      {/* RIGHT: Reading Log & Progress */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* Total Time Banner */}
        <div className="glass-panel" style={{ padding: '24px', background: 'linear-gradient(135deg, rgba(0,166,81,0.15) 0%, rgba(59,130,246,0.15) 100%)', border: '1px solid rgba(0,166,81,0.3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '50px', height: '50px', borderRadius: '14px', background: '#00A651',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF'
            }}>
              <Clock size={24} />
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 800 }}>TOTAL READING TIME</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#F8FAFC' }}>{totalMinutes} Minutes</div>
              <div style={{ fontSize: '0.78rem', color: '#34D399' }}>🎯 Exceeds National Homeschool Benchmark</div>
            </div>
          </div>
        </div>

        {/* Add External Book Log Form */}
        <div className="glass-panel" style={{ padding: '22px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 800, margin: '0 0 14px 0', color: '#F8FAFC' }}>
            📖 Log an Offline Storybook
          </h3>
          <form onSubmit={handleAddBook} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Book Title:</label>
              <input
                type="text"
                className="custom-input"
                placeholder="e.g. Moses and the Kidnappers"
                value={newBookTitle}
                onChange={(e) => setNewBookTitle(e.target.value)}
                style={{ width: '100%', fontSize: '0.85rem' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Minutes:</label>
                <input
                  type="number"
                  className="custom-input"
                  min="5"
                  max="120"
                  value={newBookMinutes}
                  onChange={(e) => setNewBookMinutes(e.target.value)}
                  style={{ width: '100%', fontSize: '0.85rem' }}
                />
              </div>

              <button type="submit" className="btn-secondary" style={{ padding: '9px 18px', fontSize: '0.85rem' }}>
                <span>Log Book</span>
              </button>
            </div>
          </form>
        </div>

        {/* Recent Books List */}
        <div className="glass-panel" style={{ padding: '22px', flex: 1 }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 800, margin: '0 0 14px 0', color: '#F8FAFC' }}>
            Recent Books Read
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {booksRead.slice(0, 5).map((b, idx) => (
              <div key={idx} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '10px 12px', background: 'rgba(255,255,255,0.02)', borderRadius: '10px',
                border: '1px solid var(--border-subtle)', fontSize: '0.86rem'
              }}>
                <div>
                  <div style={{ fontWeight: 700, color: '#F8FAFC' }}>{b.bookTitle}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{b.date || 'Recent'} • {b.minutes} mins</div>
                </div>
                <div style={{ display: 'flex', gap: '2px' }}>
                  {[...Array(5)].map((_, s) => (
                    <Star key={s} size={12} fill="#F59E0B" color="#F59E0B" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
