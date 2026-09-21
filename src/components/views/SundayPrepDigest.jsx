import React, { useState } from 'react';
import { 
  Send, MessageCircle, Mail, Printer, Download, CheckCircle2, 
  Circle, Sparkles, Calendar, BookOpen, Clock, AlertCircle, 
  Copy, Check, Share2, FileText, ShoppingCart, HelpCircle
} from 'lucide-react';

export default function SundayPrepDigest() {
  const [selectedTerm, setSelectedTerm] = useState(1);
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [copiedType, setCopiedType] = useState(null);
  const [customNote, setCustomNote] = useState('');
  
  // Interactive material checklist state
  const [checkedMaterials, setCheckedMaterials] = useState({
    'Clear plastic 1L bottle': true,
    'Kitchen salt & food coloring': true,
  });

  const toggleMaterial = (item) => {
    setCheckedMaterials(prev => ({
      ...prev,
      [item]: !prev[item]
    }));
  };

  // 12 Weeks Plan Data
  const weeklyData = {
    1: {
      theme: "Living Water, Numbers & Story Beginnings",
      pdfPackUrl: "/downloads/Term_1_Kenya_CBC_Grade_4_CBC_printable_pack.pdf",
      dailyThemes: [
        { day: "Monday", title: "Water Filtration Engineering", subject: "Science & Tech", duration: "45 mins", desc: "Build a multi-layer sand and charcoal gravity filter to understand purification." },
        { day: "Tuesday", title: "Place Value to 100,000 & Supermarket Math", subject: "Mathematics", duration: "45 mins", desc: "Use Kenya Shillings receipts to compose and decompose 5-digit numbers." },
        { day: "Wednesday", title: "Creative Narrative: The Great Rift Valley Journey", subject: "English Language", duration: "40 mins", desc: "Drafting descriptive opening paragraphs using sensory adjectives." },
        { day: "Thursday", title: "Mashairi na Tashbihi (Swahili Poetry & Metaphors)", subject: "Kiswahili", duration: "40 mins", desc: "Kusoma na kutunga mashairi mepesi kuhusu mazingira ya nyumbani." },
        { day: "Friday", title: "Compost Bin Construction & Kitchen Gardening", subject: "Agriculture & Nutrition", duration: "50 mins", desc: "Layering dry leaves, vegetable peels, and soil in the backyard box." }
      ],
      materials: [
        { category: "🏺 Kitchen & Science Lab", items: [
          "1x Clear plastic bottle (1.5L or 2L, empty)",
          "1x Cup of washed sand & fine pebbles",
          "Small piece of jiko charcoal (crushed)",
          "1x Cotton wool or clean cloth piece",
          "Sample of muddy water in a jar"
        ]},
        { category: "🎨 Stationery & Math Tools", items: [
          "1x Ruler (30cm) & Pencil 2B",
          "A4 Squared Graph book or ruled notebook",
          "3x Supermarket grocery receipts with totals > KES 1,000",
          "Crayons or colored pencils for nature sketching"
        ]},
        { category: "🌿 Outdoor & Nature Items", items: [
          "Handful of kitchen vegetable peels & dry brown leaves",
          "Small tub or garden corner for compost pit",
          "1x Empty egg carton or milk packet for seedling nursery"
        ]}
      ]
    },
    2: {
      theme: "Fractions, Ecosystems & Historical Narratives",
      pdfPackUrl: "/downloads/Term_1_Kenya_CBC_Grade_4_CBC_printable_pack.pdf",
      dailyThemes: [
        { day: "Monday", title: "Fraction Pizza & Equal Part Division", subject: "Mathematics", duration: "45 mins", desc: "Cutting paper plates into halves, quarters, and eighths to model equivalent fractions." },
        { day: "Tuesday", title: "Living Organisms in the Garden Soil", subject: "Science & Tech", duration: "45 mins", desc: "Using a magnifying glass to observe earthworms, ants, and roots." },
        { day: "Wednesday", title: "Informational Report on Local Wildlife", subject: "English Language", duration: "40 mins", desc: "Writing factual animal profiles with headings, subheadings, and captions." },
        { day: "Thursday", title: "Nomino za Makundi (Collective Nouns in Swahili)", subject: "Kiswahili", duration: "40 mins", desc: "Kutambua nomino kama mkate wa nyuki, kundi la ng'ombe." },
        { day: "Friday", title: "Soil Erosion Model with Spray Bottle", subject: "Social Studies & Agro", duration: "50 mins", desc: "Demonstrating splash erosion on bare soil vs grass-covered turf." }
      ],
      materials: [
        { category: "🏺 Kitchen & Science Lab", items: [
          "3x Plain round paper plates",
          "1x Water spray bottle",
          "1x Hand magnifying glass"
        ]},
        { category: "🎨 Stationery & Math Tools", items: [
          "Scissors (safety rounded)",
          "Glue stick & colored markers",
          "Ruler & protractor"
        ]},
        { category: "🌿 Outdoor & Nature Items", items: [
          "Two shallow trays with loose soil and grass patch",
          "Bean seeds (5 seeds soaked in water overnight)"
        ]}
      ]
    },
    3: {
      theme: "Measurement, Matter States & Storytelling",
      pdfPackUrl: "/downloads/Term_1_Kenya_CBC_Grade_4_CBC_printable_pack.pdf",
      dailyThemes: [
        { day: "Monday", title: "Liquid Volume & Litres Exploration", subject: "Mathematics", duration: "45 mins", desc: "Calibrating 500ml and 1L containers with colored water." },
        { day: "Tuesday", title: "Solids, Liquids, and Gases Kitchen Lab", subject: "Science & Tech", duration: "45 mins", desc: "Melting ice cubes, boiling kettle steam, and baking soda balloon inflation." },
        { day: "Wednesday", title: "Dialogue Writing & Quotation Marks", subject: "English Language", duration: "40 mins", desc: "Crafting lively conversation between two cartoon animal characters." },
        { day: "Thursday", title: "Vitenzi na Nyakati (Verbs and Tenses)", subject: "Kiswahili", duration: "40 mins", desc: "Kutumia wakati uliopita, uliopo na ujao katika sentensi kamili." },
        { day: "Friday", title: "Healthy Snack Prep & Fruit Salad Math", subject: "Nutrition & Health", duration: "50 mins", desc: "Washing, peeling, slicing bananas and watermelon into fractions." }
      ],
      materials: [
        { category: "🏺 Kitchen & Science Lab", items: [
          "1x Measuring cup (ml/litres markings)",
          "1x Balloon & 1x sachet baking soda + vinegar (30ml)",
          "3x Ice cubes in a small bowl"
        ]},
        { category: "🎨 Stationery & Math Tools", items: [
          "Sticky notes for labelling kitchen items",
          "Printable SomaHome Week 3 Assessment worksheet"
        ]},
        { category: "🌿 Outdoor & Nature Items", items: [
          "2x Bananas, 1x slice watermelon, chopping board & plastic butter knife"
        ]}
      ]
    }
  };

  const currentWeekInfo = weeklyData[selectedWeek] || weeklyData[1];
  const allItemsList = currentWeekInfo.materials.flatMap(m => m.items);
  const checkedCount = allItemsList.filter(item => checkedMaterials[item]).length;

  // Generate WhatsApp text format
  const generateWhatsAppDigest = () => {
    let text = `🌟 *SOMAHOME HOMESCHOOL PREP DIGEST* 🌟\n`;
    text += `📅 *Term ${selectedTerm} • Week ${selectedWeek} Overview*\n`;
    text += `🎯 *Weekly Focus:* ${currentWeekInfo.theme}\n\n`;
    
    text += `📋 *5-DAY LEARNING THEMES:*\n`;
    currentWeekInfo.dailyThemes.forEach((d) => {
      text += `• *${d.day}* (${d.subject}): ${d.title} [${d.duration}]\n  _${d.desc}_\n`;
    });
    
    text += `\n🛒 *HOUSEHOLD MATERIALS CHECKLIST:*\n`;
    currentWeekInfo.materials.forEach((cat) => {
      text += `*${cat.category}*\n`;
      cat.items.forEach((it) => {
        const isDone = checkedMaterials[it] ? '✅' : '⬜';
        text += `  ${isDone} ${it}\n`;
      });
    });

    if (customNote.trim()) {
      text += `\n📌 *PARENT/TUTOR SPECIAL NOTE:*\n${customNote.trim()}\n`;
    }

    text += `\n📥 *Download Printable Worksheets PDF:*\nhttps://somahome.ke${currentWeekInfo.pdfPackUrl}\n`;
    text += `\n_“Elimu Bila Stress • Turnkey Homeschooling across Kenya”_`;
    return text;
  };

  // Copy helpers
  const handleCopyWhatsApp = () => {
    const text = generateWhatsAppDigest();
    navigator.clipboard.writeText(text);
    setCopiedType('whatsapp');
    setTimeout(() => setCopiedType(null), 2500);
  };

  const handleOpenWhatsApp = () => {
    const text = encodeURIComponent(generateWhatsAppDigest());
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleCopyEmail = () => {
    const text = generateWhatsAppDigest();
    navigator.clipboard.writeText(text);
    setCopiedType('email');
    setTimeout(() => setCopiedType(null), 2500);
  };

  const handlePrintPlacard = () => {
    window.print();
  };

  return (
    <div className="fade-in" style={{ paddingBottom: '60px' }}>
      
      {/* Top Hero Banner */}
      <div className="glass-panel" style={{
        padding: '24px',
        marginBottom: '24px',
        background: 'linear-gradient(135deg, rgba(0,166,81,0.18) 0%, rgba(30,58,138,0.2) 100%)',
        border: '1px solid rgba(0,166,81,0.3)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span className="glass-pill" style={{ background: '#00A651', color: '#FFF', fontWeight: 800 }}>
              📱 SUNDAY DISPATCHER
            </span>
            <span className="glass-pill" style={{ color: '#38BDF8', borderColor: 'rgba(56,189,248,0.3)' }}>
              1-Click Prep Generator
            </span>
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 900, margin: '0 0 6px 0', color: '#F8FAFC' }}>
            Sunday Evening Family Digest
          </h1>
          <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '620px' }}>
            Never scramble on Monday morning! Review the 5 daily themes, gather everyday household items into your homeschool learning bin, and send a formatted WhatsApp briefing to family & tutors in one tap.
          </p>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            onClick={handleOpenWhatsApp}
            className="btn-primary"
            style={{
              background: '#25D366',
              borderColor: '#25D366',
              color: '#FFFFFF',
              fontWeight: 800,
              padding: '10px 18px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 15px rgba(37,211,102,0.3)'
            }}
          >
            <MessageCircle size={18} />
            <span>Send to WhatsApp</span>
          </button>

          <button
            onClick={handleCopyWhatsApp}
            className="btn-secondary"
            style={{
              padding: '10px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontWeight: 700
            }}
          >
            {copiedType === 'whatsapp' ? <Check size={16} color="#10B981" /> : <Copy size={16} />}
            <span>{copiedType === 'whatsapp' ? 'Copied WhatsApp Text!' : 'Copy Formatted Text'}</span>
          </button>

          <button
            onClick={handlePrintPlacard}
            className="btn-secondary"
            style={{
              padding: '10px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              borderColor: 'rgba(245,158,11,0.4)',
              color: '#FBBF24'
            }}
            title="Print a clean weekly placard to tape to the kitchen fridge"
          >
            <Printer size={16} />
            <span>Print Fridge Placard</span>
          </button>
        </div>
      </div>

      {/* Week Selector Bar */}
      <div className="glass-panel" style={{ padding: '16px 20px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <div>
            <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
              Academic Term:
            </label>
            <select
              className="custom-select"
              value={selectedTerm}
              onChange={(e) => setSelectedTerm(Number(e.target.value))}
              style={{ minWidth: '130px' }}
            >
              <option value={1}>Term 1 (Jan - Apr)</option>
              <option value={2}>Term 2 (May - Aug)</option>
              <option value={3}>Term 3 (Sep - Nov)</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
              Target Prep Week:
            </label>
            <select
              className="custom-select"
              value={selectedWeek}
              onChange={(e) => setSelectedWeek(Number(e.target.value))}
              style={{ minWidth: '180px' }}
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(w => (
                <option key={w} value={w}>
                  Week {w}: {weeklyData[w]?.theme || `Curriculum Week ${w}`}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Bin Readiness Status */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          background: 'rgba(255,255,255,0.03)',
          padding: '8px 16px',
          borderRadius: '12px',
          border: '1px solid var(--border-subtle)'
        }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700 }}>
              HOMESCHOOL BIN PREPARATION:
            </div>
            <div style={{ fontSize: '0.9rem', fontWeight: 800, color: checkedCount === allItemsList.length ? '#34D399' : '#F59E0B' }}>
              {checkedCount} / {allItemsList.length} Materials Ready
            </div>
          </div>
          <div style={{
            width: '36px', height: '36px', borderRadius: '50%',
            background: checkedCount === allItemsList.length ? 'rgba(16,185,129,0.2)' : 'rgba(245,158,11,0.15)',
            border: checkedCount === allItemsList.length ? '2px solid #10B981' : '2px solid #F59E0B',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.8rem', fontWeight: 900,
            color: checkedCount === allItemsList.length ? '#10B981' : '#F59E0B'
          }}>
            {Math.round((checkedCount / Math.max(allItemsList.length, 1)) * 100)}%
          </div>
        </div>
      </div>

      {/* Main Two Column Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
        
        {/* LEFT COLUMN: 5 Daily Themes */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Calendar size={18} color="#00A651" />
              <span>5 Daily Learning Missions</span>
            </h2>
            <span className="glass-pill" style={{ fontSize: '0.72rem' }}>
              ~3 Hours Daily
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {currentWeekInfo.dailyThemes.map((dayPlan, idx) => (
              <div
                key={idx}
                className="glass-panel"
                style={{
                  padding: '16px 18px',
                  borderLeft: '4px solid #00A651',
                  transition: 'transform 0.2s ease',
                  background: 'rgba(255,255,255,0.02)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ fontWeight: 800, fontSize: '0.82rem', color: '#38BDF8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    {dayPlan.day} • {dayPlan.subject}
                  </span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={12} /> {dayPlan.duration}
                  </span>
                </div>

                <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: '0 0 6px 0', color: '#F8FAFC' }}>
                  {dayPlan.title}
                </h3>

                <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>
                  {dayPlan.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Printable Worksheet Direct Link */}
          <div
            className="glass-panel"
            style={{
              marginTop: '20px',
              padding: '18px',
              background: 'linear-gradient(135deg, rgba(56,189,248,0.08) 0%, rgba(30,58,138,0.12) 100%)',
              border: '1px solid rgba(56,189,248,0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '14px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '42px', height: '42px', borderRadius: '10px',
                background: 'rgba(56,189,248,0.15)', color: '#38BDF8',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <FileText size={22} />
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: '0.92rem', fontWeight: 800, color: '#F8FAFC' }}>
                  Weekly Activity Worksheet Pack
                </h4>
                <p style={{ margin: '2px 0 0 0', fontSize: '0.76rem', color: 'var(--text-secondary)' }}>
                  12 Pages of Kenya CBC & KICD aligned hands-on worksheets
                </p>
              </div>
            </div>

            <a
              href={currentWeekInfo.pdfPackUrl}
              download
              className="btn-primary"
              style={{
                fontSize: '0.8rem',
                padding: '8px 14px',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Download size={14} />
              <span>Download PDF</span>
            </a>
          </div>
        </div>

        {/* RIGHT COLUMN: Interactive Materials Checklist & WhatsApp Preview */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShoppingCart size={18} color="#F59E0B" />
              <span>Household Materials Checklist</span>
            </h2>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Click items as you pack the bin
            </span>
          </div>

          {/* Categories */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {currentWeekInfo.materials.map((cat, cIdx) => (
              <div key={cIdx} className="glass-panel" style={{ padding: '16px 18px' }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#FBBF24', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {cat.category}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {cat.items.map((item, iIdx) => {
                    const isChecked = !!checkedMaterials[item];
                    return (
                      <div
                        key={iIdx}
                        onClick={() => toggleMaterial(item)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          cursor: 'pointer',
                          padding: '6px 8px',
                          borderRadius: '8px',
                          background: isChecked ? 'rgba(0,166,81,0.08)' : 'transparent',
                          transition: 'background 0.15s ease'
                        }}
                      >
                        {isChecked ? (
                          <CheckCircle2 size={18} color="#10B981" />
                        ) : (
                          <Circle size={18} color="#64748B" />
                        )}
                        <span style={{
                          fontSize: '0.88rem',
                          color: isChecked ? 'var(--text-secondary)' : 'var(--text-primary)',
                          textDecoration: isChecked ? 'line-through' : 'none',
                          fontWeight: isChecked ? 400 : 600
                        }}>
                          {item}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Custom Note input for parents/tutors */}
          <div className="glass-panel" style={{ marginTop: '20px', padding: '16px 18px' }}>
            <label style={{ fontSize: '0.78rem', fontWeight: 800, color: '#38BDF8', display: 'block', marginBottom: '8px' }}>
              📝 Add Custom Family / Pod Instruction (Appended to WhatsApp):
            </label>
            <textarea
              className="custom-input"
              rows={2}
              placeholder="e.g. Grandma is visiting Tuesday afternoon. Please wear outdoor mud boots on Friday for soil sampling!"
              value={customNote}
              onChange={(e) => setCustomNote(e.target.value)}
              style={{ width: '100%', fontSize: '0.85rem', resize: 'vertical' }}
            />
          </div>

          {/* WhatsApp Live Preview Box */}
          <div
            className="glass-panel"
            style={{
              marginTop: '20px',
              padding: '18px',
              background: 'rgba(17, 24, 39, 0.7)',
              border: '1px dashed rgba(37,211,102,0.5)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#25D366', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MessageCircle size={14} /> WhatsApp Message Format Live Preview
              </span>
              <button
                onClick={handleCopyWhatsApp}
                className="glass-pill"
                style={{ fontSize: '0.7rem', color: '#34D399', cursor: 'pointer', padding: '3px 8px' }}
              >
                {copiedType === 'whatsapp' ? '✓ Copied' : 'Copy Text'}
              </button>
            </div>

            <pre style={{
              margin: 0,
              fontSize: '0.76rem',
              color: '#CBD5E1',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              fontFamily: 'monospace',
              maxHeight: '180px',
              overflowY: 'auto',
              background: 'rgba(0,0,0,0.3)',
              padding: '12px',
              borderRadius: '8px'
            }}>
              {generateWhatsAppDigest()}
            </pre>
          </div>

        </div>

      </div>

    </div>
  );
}
