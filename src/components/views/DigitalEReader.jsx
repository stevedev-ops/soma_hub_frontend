import React, { useState, useEffect, useRef } from 'react';
import { 
  BookOpen, ChevronLeft, ChevronRight, Bookmark, Sparkles, 
  Volume2, Sun, Moon, Coffee, ZoomIn, ZoomOut, Upload, 
  FileText, Search, Download, Check, Star, Maximize2, X
} from 'lucide-react';
import VoicePlayerPill from '../VoicePlayerPill';

export default function DigitalEReader() {
  const [selectedBookId, setSelectedBookId] = useState('sci_g4');
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [theme, setTheme] = useState('dark'); // 'dark' | 'sepia' | 'light'
  const [fontSize, setFontSize] = useState(18);
  const [isTocOpen, setIsTocOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [customBooks, setCustomBooks] = useState(() => {
    const saved = localStorage.getItem('somahome_custom_ebooks_v1');
    return saved ? JSON.parse(saved) : [];
  });
  const [highlights, setHighlights] = useState(() => {
    const saved = localStorage.getItem('somahome_reader_highlights_v1');
    return saved ? JSON.parse(saved) : {};
  });

  const fileInputRef = useRef(null);

  // Built-in Complete KICD & International Aligned E-Books
  const standardLibrary = [
    {
      id: 'sci_g4',
      title: 'SomaHome Science & Technology Grade 4',
      subtitle: 'KICD Aligned Complete Course Reader & Lab Manual',
      curriculum: 'CBC Grade 4',
      publisher: 'SomaHome Kenya & KICD Framework',
      coverColor: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
      pages: [
        {
          chapter: 'Chapter 1: Water Filtration and Household Hygiene',
          title: 'Section 1.1: Why Filter Water?',
          content: `Clean water is the foundation of life and health in every Kenyan community. Natural water sources such as seasonal streams, rain runoff, and boreholes often contain suspended mud, organic leaf matter, and invisible microbes.

In this chapter, we explore mechanical filtration principles used in rural Kenyan households and modern water purification plants.

Key Concepts:
1. Physical Sedimentation: Allowing heavy soil particles to settle to the bottom of the container.
2. Layered Filtration: Passing water through decreasing particle sizes (gravel -> coarse sand -> fine river sand).
3. Activated Charcoal Adsorption: Tiny microscopic pores in charcoal attract and trap chlorine, organic smells, and chemical discoloration.

Home Discovery Inquiry:
Observe water gathered from a backyard puddle before and after gravity filtration. Record clarity, odor, and sedimentation rate.`
        },
        {
          chapter: 'Chapter 1: Water Filtration and Household Hygiene',
          title: 'Section 1.2: Building Your 4-Stage Gravity Filter',
          content: `To build your working laboratory filter at home:

Materials Required:
• 1x Empty 1.5L clear plastic bottle (cut into two halves)
• Cotton wool or clean muslin cloth (placed in bottle neck)
• Crushed charcoal from the jiko (washed with clean water)
• Clean fine sand from riverbed or builder's yard
• Small pebbles and gravel (approx 1 cup)

Assembly Steps:
Step 1: Turn the inverted top half of the bottle upside down to act as the funnel.
Step 2: Place cotton wool at the bottom neck to prevent fine powder from falling through.
Step 3: Add 3 cm of crushed clean charcoal.
Step 4: Add 5 cm of clean fine sand.
Step 5: Add 3 cm of gravel at the top to break the impact of poured water.

Pour 250ml of muddy water slowly and observe the filtration rate.`
        },
        {
          chapter: 'Chapter 2: States of Matter in the Kitchen',
          title: 'Section 2.1: Solids, Liquids, and Gases',
          content: `Every physical substance in our home exists in one of three primary states:

1. Solids: Definite shape and definite volume.
Examples in the kitchen: Sufuria, wooden spoon, maize grains, ice cubes.

2. Liquids: Definite volume, but takes the shape of the container.
Examples: Fresh milk, cooking oil, tap water, fruit juice.

3. Gases: No fixed shape and no fixed volume. Spreads out to fill all available space.
Examples: Steam from a boiling kettle of tea (chai), carbon dioxide gas in soda bubbles, air inside a bicycle tire.

Temperature Change and Phase Transitions:
When ice (solid) is heated, it absorbs thermal energy and melts into liquid water at 0°C. Further heating to 100°C turns liquid water into steam (gas).`
        }
      ]
    },
    {
      id: 'kisw_g4',
      title: 'Hekaya na Mashairi ya Kiswahili Gredi 4',
      subtitle: 'Kusoma kwa Ufahamu, Ushairi na Sarufi ya Kiswahili',
      curriculum: 'CBC Grade 4 Kiswahili',
      publisher: 'Idara ya Kiswahili • SomaHome Kenya',
      coverColor: 'linear-gradient(135deg, #D97706 0%, #B45309 100%)',
      pages: [
        {
          chapter: 'Sura ya 1: Hadithi za Wanyama wa Pori',
          title: 'Hadithi: Sungura Mjanja na Kisima cha Maji',
          content: `Hapo zamani za kale katika kijiji cha Kilifi, palitokea ukame mkubwa sana. Mito yote ilikauka na jua liliwaka kwa ukali. Wanyama wote wa mwituni walikusanyika chini ya mbuyu mkubwa ili kutafuta suluhisho la kupata maji.

Simba, akiwa mfalme wa mwitu, alitangaza: "Kila mnyama mkubwa na mdogo lazima ashiriki katika kuchimba kisima kipya!"

Wanyama wote kama Tembo, Twiga, Fisi, na Swala walianza kazi kwa bidii. Lakini Sungura, akiwa mwenye uvivu na hila, alikataa kushika jembe akisema: "Mimi mikono yangu ni mifupi na laini mno, siwezi kufanya kazi ya sulubu!"

Jioni ilipofika na maji safi yakabubujika kisimani, Sungura alikuja kisiri usiku wa manane na kibuyu chake kikubwa kunywa maji bila idhini. Kobe mwerevu alikuwa ametega mtego wa gundi kwenye ukingo wa kisima. Sungura alipokanyaga, akaganda papo hapo!`
        },
        {
          chapter: 'Sura ya 2: Ushairi na Taswira ya Mazingira',
          title: 'Shairi: Miti na Mazingira Yetu',
          content: `Miti tupande kwa bidii, hewa safi tuipate,
Mito yetu tulinde jamani, maji mema yatiririke,
Tusitupe plastiki ovyo, ardhi yetu ibarikiwe,
Elimu ya mazingira nyumbani, ni urithi wa vizazi vyote!

Tazama milima yetu, kijani kibichi kinameremeta,
Ndege wanaimba kwa furaha, kwenye matawi ya miharubaini,
Uhifadhi wa mazingira ni wajibu wetu sote,
Kuanzia nyumbani hadi shuleni, Kenya yetu ing'ae daima.`
        }
      ]
    },
    {
      id: 'math_g4',
      title: 'Kenya CBC Mathematics Mastery Grade 4',
      subtitle: 'Numbers, Fractions, Money & Geometry Applications',
      curriculum: 'CBC Grade 4 Mathematics',
      publisher: 'SomaHome Kenya STEM Press',
      coverColor: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
      pages: [
        {
          chapter: 'Unit 1: Place Value up to 100,000',
          title: 'Lesson 1.1: Reading and Writing Large Numbers',
          content: `In Kenyan commercial daily life, numbers above 10,000 are used every day when purchasing family groceries, farm fertilizer, or paying solar power tokens via M-Pesa.

Understanding Place Value Columns:
• Ten Thousands (T.Th)
• Thousands (Th)
• Hundreds (H)
• Tens (T)
• Ones (O)

Example:
Number: 74,520
7 Ten Thousands = 70,000
4 Thousands = 4,000
5 Hundreds = 500
2 Tens = 20
0 Ones = 0

Read in words: "Seventy-four thousand, five hundred and twenty."`
        },
        {
          chapter: 'Unit 2: Fractions and Real-World Division',
          title: 'Lesson 2.1: Equivalent Fractions and Pizza Slices',
          content: `A fraction represents an equal part of a whole quantity.

Fraction Anatomy:
• Numerator (Top number): How many parts we have.
• Denominator (Bottom number): Total number of equal parts.

Modeling Equivalent Fractions:
Take a circular paper plate:
1. Fold in half: Each slice is 1/2.
2. Fold in half again: Now we have 4 slices. Two slices (2/4) take up the EXACT same area as 1/2!
3. Therefore: 1/2 = 2/4 = 4/8.

Kenya Supermarket Application:
If a 1kg packet of maize unga is divided equally into 4 small containers, each container holds 1/4 kg (250 grams).`
        }
      ]
    }
  ];

  const allBooks = [...standardLibrary, ...customBooks];
  const activeBook = allBooks.find(b => b.id === selectedBookId) || standardLibrary[0];
  const totalPages = activeBook.pages.length;
  const activePage = activeBook.pages[currentPageIndex] || activeBook.pages[0];

  // Upload Custom PDF / Text e-book handler
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const textContent = e.target.result;
      
      // Split into chapters or pages
      const paragraphs = typeof textContent === 'string' ? textContent.split('\n\n') : ['Uploaded Book Content'];
      const generatedPages = [];
      
      for (let i = 0; i < paragraphs.length; i += 3) {
        generatedPages.push({
          chapter: `Chapter ${Math.floor(i / 3) + 1}`,
          title: `Section ${Math.floor(i / 3) + 1}.${(i % 3) + 1}`,
          content: paragraphs.slice(i, i + 3).join('\n\n') || 'Content text page'
        });
      }

      const newBook = {
        id: `custom_${Date.now()}`,
        title: file.name.replace(/\.[^/.]+$/, ''),
        subtitle: 'Custom Uploaded PDF / E-Reader File',
        curriculum: 'Parent Library',
        publisher: 'User Uploaded',
        coverColor: 'linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)',
        pages: generatedPages.length > 0 ? generatedPages : [
          {
            chapter: 'Chapter 1: Uploaded Book Content',
            title: file.name,
            content: typeof textContent === 'string' ? textContent.slice(0, 3000) : 'E-Book text loaded successfully.'
          }
        ]
      };

      const updatedCustom = [newBook, ...customBooks];
      setCustomBooks(updatedCustom);
      localStorage.setItem('somahome_custom_ebooks_v1', JSON.stringify(updatedCustom));
      setSelectedBookId(newBook.id);
      setCurrentPageIndex(0);
    };

    reader.readAsText(file);
  };

  const handleNextPage = () => {
    if (currentPageIndex < totalPages - 1) {
      setCurrentPageIndex(prev => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPageIndex > 0) {
      setCurrentPageIndex(prev => prev - 1);
    }
  };

  // Color styles based on reader theme
  const themeStyles = {
    dark: {
      bg: '#0B132B',
      cardBg: '#1C2541',
      text: '#E2E8F0',
      heading: '#F8FAFC',
      border: 'rgba(255,255,255,0.08)',
      accent: '#00A651'
    },
    sepia: {
      bg: '#FBF0D9',
      cardBg: '#F4ECD8',
      text: '#433422',
      heading: '#2C1D11',
      border: '#E6D7BD',
      accent: '#B45309'
    },
    light: {
      bg: '#F8FAFC',
      cardBg: '#FFFFFF',
      text: '#1E293B',
      heading: '#0F172A',
      border: '#E2E8F0',
      accent: '#0284C7'
    }
  };

  const curTheme = themeStyles[theme];

  return (
    <div className="fade-in" style={{ paddingBottom: '60px' }}>
      
      {/* Top Header Bar */}
      <div className="glass-panel" style={{
        padding: '20px 24px',
        marginBottom: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px',
        background: 'linear-gradient(135deg, rgba(0,166,81,0.15) 0%, rgba(59,130,246,0.15) 100%)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '46px', height: '46px', borderRadius: '12px',
            background: 'linear-gradient(135deg, #00A651, #059669)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF'
          }}>
            <BookOpen size={24} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="glass-pill" style={{ background: '#00A651', color: '#FFF', fontWeight: 800, fontSize: '0.68rem' }}>
                📖 DIGITAL E-READER
              </span>
              <span className="glass-pill" style={{ fontSize: '0.68rem', color: '#38BDF8', borderColor: 'rgba(56,189,248,0.3)' }}>
                KICD & Universal Library
              </span>
            </div>
            <h1 style={{ fontSize: '1.45rem', fontWeight: 900, margin: '2px 0', color: '#F8FAFC' }}>
              SomaHome Curriculum E-Book Reader & Library
            </h1>
          </div>
        </div>

        {/* Action Buttons & Custom Uploader */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".txt,.pdf,.epub"
            style={{ display: 'none' }}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="btn-secondary"
            style={{ fontSize: '0.82rem', padding: '8px 14px', gap: '6px' }}
            title="Upload your own Longhorn, KLB, or Cambridge PDF/EPUB to read in-app"
          >
            <Upload size={15} />
            <span>Upload E-Book (PDF/Text)</span>
          </button>
        </div>
      </div>

      {/* Book Shelf Carousel Selector */}
      <div style={{
        display: 'flex',
        gap: '14px',
        overflowX: 'auto',
        paddingBottom: '12px',
        marginBottom: '20px'
      }}>
        {allBooks.map((b) => {
          const isSelected = b.id === selectedBookId;
          return (
            <div
              key={b.id}
              onClick={() => {
                setSelectedBookId(b.id);
                setCurrentPageIndex(0);
              }}
              style={{
                minWidth: '220px',
                maxWidth: '220px',
                padding: '14px',
                borderRadius: '12px',
                background: isSelected ? 'rgba(0,166,81,0.2)' : 'rgba(255,255,255,0.03)',
                border: isSelected ? '2px solid #00A651' : '1px solid var(--border-subtle)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                height: '110px'
              }}
            >
              <div>
                <div style={{ fontSize: '0.65rem', color: '#34D399', fontWeight: 800, textTransform: 'uppercase' }}>
                  {b.curriculum}
                </div>
                <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#F8FAFC', marginTop: '4px', lineHeight: 1.3, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {b.title}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                <span>{b.pages.length} Pages</span>
                {isSelected && <span style={{ color: '#34D399', fontWeight: 800 }}>Reading ●</span>}
              </div>
            </div>
          );
        })}
      </div>

      {/* Reader Viewport & Controls */}
      <div style={{
        background: curTheme.bg,
        border: `1px solid ${curTheme.border}`,
        borderRadius: '16px',
        padding: '24px',
        boxShadow: '0 15px 35px rgba(0,0,0,0.4)',
        transition: 'background 0.3s ease'
      }}>
        
        {/* Top Reader Tools Bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: `1px solid ${curTheme.border}`,
          paddingBottom: '16px',
          marginBottom: '20px',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          {/* Chapter / Book Title */}
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: curTheme.accent, textTransform: 'uppercase' }}>
              {activePage.chapter}
            </div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 900, color: curTheme.heading, margin: '2px 0 0 0' }}>
              {activePage.title}
            </h2>
          </div>

          {/* Controls: Voice AI, Themes, Font Size */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            
            {/* Voice AI Read-Aloud */}
            <VoicePlayerPill
              textToRead={`${activePage.chapter}. ${activePage.title}. ${activePage.content}`}
              label="Read Page Aloud"
              swahiliLabel="Soma Ukurasa"
            />

            {/* Font Size Adjusters */}
            <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.1)', borderRadius: '8px', border: `1px solid ${curTheme.border}` }}>
              <button
                onClick={() => setFontSize(prev => Math.max(14, prev - 2))}
                style={{ background: 'transparent', border: 'none', padding: '6px 8px', color: curTheme.text, cursor: 'pointer' }}
                title="Decrease font size"
              >
                <ZoomOut size={15} />
              </button>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, padding: '0 4px', color: curTheme.text }}>
                {fontSize}px
              </span>
              <button
                onClick={() => setFontSize(prev => Math.min(26, prev + 2))}
                style={{ background: 'transparent', border: 'none', padding: '6px 8px', color: curTheme.text, cursor: 'pointer' }}
                title="Increase font size"
              >
                <ZoomIn size={15} />
              </button>
            </div>

            {/* Themes: Dark, Sepia, Light */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <button
                onClick={() => setTheme('dark')}
                style={{
                  width: '28px', height: '28px', borderRadius: '50%',
                  background: '#0B132B', border: theme === 'dark' ? '2px solid #00A651' : '1px solid #475569',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF'
                }}
                title="Onyx Night Theme"
              >
                <Moon size={13} />
              </button>
              <button
                onClick={() => setTheme('sepia')}
                style={{
                  width: '28px', height: '28px', borderRadius: '50%',
                  background: '#FBF0D9', border: theme === 'sepia' ? '2px solid #B45309' : '1px solid #D1D5DB',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#433422'
                }}
                title="Warm Sepia Theme"
              >
                <Coffee size={13} />
              </button>
              <button
                onClick={() => setTheme('light')}
                style={{
                  width: '28px', height: '28px', borderRadius: '50%',
                  background: '#FFFFFF', border: theme === 'light' ? '2px solid #0284C7' : '1px solid #CBD5E1',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0F172A'
                }}
                title="Day Paper Theme"
              >
                <Sun size={13} />
              </button>
            </div>

          </div>
        </div>

        {/* Main Reading Page Content */}
        <div style={{
          background: curTheme.cardBg,
          border: `1px solid ${curTheme.border}`,
          borderRadius: '12px',
          padding: '36px',
          minHeight: '380px',
          fontSize: `${fontSize}px`,
          lineHeight: 1.8,
          color: curTheme.text,
          whiteSpace: 'pre-line',
          boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.05)',
          userSelect: 'text'
        }}>
          {activePage.content}
        </div>

        {/* Bottom Pagination & Navigation */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '20px',
          paddingTop: '16px',
          borderTop: `1px solid ${curTheme.border}`
        }}>
          <button
            onClick={handlePrevPage}
            disabled={currentPageIndex === 0}
            className="btn-secondary"
            style={{
              padding: '8px 18px',
              fontSize: '0.85rem',
              opacity: currentPageIndex === 0 ? 0.4 : 1,
              cursor: currentPageIndex === 0 ? 'not-allowed' : 'pointer'
            }}
          >
            <ChevronLeft size={16} />
            <span>Previous Page</span>
          </button>

          <div style={{ fontSize: '0.85rem', fontWeight: 800, color: curTheme.heading }}>
            Page {currentPageIndex + 1} of {totalPages}
          </div>

          <button
            onClick={handleNextPage}
            disabled={currentPageIndex === totalPages - 1}
            className="btn-primary"
            style={{
              padding: '8px 18px',
              fontSize: '0.85rem',
              opacity: currentPageIndex === totalPages - 1 ? 0.4 : 1,
              cursor: currentPageIndex === totalPages - 1 ? 'not-allowed' : 'pointer'
            }}
          >
            <span>Next Page</span>
            <ChevronRight size={16} />
          </button>
        </div>

      </div>

    </div>
  );
}
