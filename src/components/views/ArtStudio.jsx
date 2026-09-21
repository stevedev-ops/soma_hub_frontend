import React, { useState, useRef } from 'react';
import { Palette, Sparkles, UploadCloud, Camera, CheckCircle, Trash2, Star } from 'lucide-react';
import { artworkStore, xpStore } from '../../services/portfolioStore';

export default function ArtStudio() {
  const [selectedCraft, setSelectedCraft] = useState('kitenge');
  const [uploadState, setUploadState] = useState('idle'); // idle | uploading | success
  const [artworkTitle, setArtworkTitle] = useState('');
  const [previewUrl, setPreviewUrl] = useState(null);
  const [gallery, setGallery] = useState(() => artworkStore.getAll());
  const [xp, setXp] = useState(() => xpStore.get());
  const fileRef = useRef(null);

  const crafts = {
    kitenge: {
      title: 'Kitenge Fabric Scrap Wildlife Collage',
      strand: 'CBC Grade 4 Creative Arts • Strand 1 (Visual Arts)',
      materials: [
        'Small scraps of colorful Kitenge / African wax fabric (ask local estate tailor/fundi)',
        'Cardboard from an empty cereal or biscuit box',
        'Kitchen scissors',
        'PVA craft glue or flour-and-water paste'
      ],
      steps: [
        'Draw the outline of an African elephant or giraffe on the cardboard box backing.',
        'Cut the Kitenge fabric into small 1-inch geometric triangles and strips.',
        'Apply glue in sections and mosaic the fabric pieces together to fill the animal silhouette.',
        'Use black marker or leftover yarn to create the eye and tail detail.',
        'Leave to dry in the sun for 30 minutes. Upload completed artwork to your CBC portfolio!'
      ]
    },
    shaker: {
      title: 'Recycled Bottle Traditional Kayamba & Shaker',
      strand: 'CBC Grade 4 Music Activities • Strand 2 (Percussion & Rhythm)',
      materials: [
        '2 clean empty plastic soda bottles or tins',
        'Dry maize seeds or small gravel pebbles from compound',
        'Bright colored electrical tape or strips of paper to decorate'
      ],
      steps: [
        'Drop 2 tablespoons of dry maize or rice into the empty plastic bottle.',
        'Tightly secure the bottle cap with tape.',
        'Decorate the outside with colored patterns representing Kenyan cultural motifs.',
        'Practice the standard 4/4 syncopated beat along with traditional folk songs!'
      ]
    },
    weaving: {
      title: 'Sisal Basket Coil Weaving (Mini)',
      strand: 'CBC Grade 4 Creative Arts • Strand 3 (Craft & Design)',
      materials: [
        'Dry sisal strands or strips of old fabric torn into thin ribbons',
        'Cardboard circle (15cm diameter) as weaving base',
        'Large blunt needle or stick',
        'Natural dyes: beetroot (red), spinach (green), tea (brown)'
      ],
      steps: [
        'Cut 8 evenly-spaced slits around the cardboard base circle.',
        'Thread sisal strands through the slits and knot at the center.',
        'Begin coiling and weaving over-under through the radial strands.',
        'Dip sections in natural dye to create a traditional pattern.',
        'Secure the final round and trim excess. Photograph for your CBC portfolio!'
      ]
    }
  };

  const handleFileSelect = (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => setPreviewUrl(e.target.result);
    reader.readAsDataURL(file);
    setArtworkTitle(crafts[selectedCraft].title);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer?.files?.[0];
    handleFileSelect(file);
  };

  const handleUpload = () => {
    if (!previewUrl) return;
    setUploadState('uploading');
    setTimeout(() => {
      const newEntry = artworkStore.add({
        title: artworkTitle || crafts[selectedCraft].title,
        craftType: selectedCraft,
        craftLabel: crafts[selectedCraft].title,
        strand: crafts[selectedCraft].strand,
        imageDataUrl: previewUrl,
        rubric: 'EE',
      });
      const newXp = xpStore.add(30);
      setGallery(artworkStore.getAll());
      setXp(newXp);
      setUploadState('success');
    }, 1000);
  };

  const resetUpload = () => {
    setPreviewUrl(null);
    setArtworkTitle('');
    setUploadState('idle');
  };

  const removeArtwork = (id) => {
    artworkStore.remove(id);
    setGallery(artworkStore.getAll());
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1.2fr) 1fr', gap: '24px' }}>

      {/* LEFT: Craft Guide */}
      <div className="glass-panel" style={{ padding: '28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <span className="glass-pill" style={{ color: '#EC4899', border: '1px solid rgba(236,72,153,0.3)', marginBottom: '6px', display: 'inline-block' }}>
              🎨 Creative Arts & Culture Studio
            </span>
            <h2 style={{ fontSize: '1.4rem', margin: 0 }}>Kenyan Household Craft Studio</h2>
          </div>
          <select className="custom-select" value={selectedCraft} onChange={(e) => { setSelectedCraft(e.target.value); resetUpload(); }} style={{ minWidth: '220px' }}>
            <option value="kitenge">🐘 Kitenge Wildlife Collage</option>
            <option value="shaker">🪇 Recycled Kayamba & Shaker</option>
            <option value="weaving">🧺 Sisal Basket Weaving</option>
          </select>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)', borderRadius: '14px', padding: '18px 20px', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '1.1rem', margin: 0 }}>{crafts[selectedCraft].title}</h3>
          <div style={{ fontSize: '0.78rem', color: '#EC4899', fontWeight: 600, marginTop: '3px' }}>{crafts[selectedCraft].strand}</div>
        </div>

        <div style={{ marginBottom: '22px' }}>
          <h4 style={{ fontSize: '0.92rem', color: '#F59E0B', marginBottom: '10px' }}>🛒 Materials (found in typical Kenyan homes):</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
            {crafts[selectedCraft].materials.map((m, i) => <li key={i}>✅ {m}</li>)}
          </ul>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <h4 style={{ fontSize: '0.92rem', color: 'var(--text-primary)', margin: 0 }}>📋 Creative Procedure:</h4>
          {crafts[selectedCraft].steps.map((step, i) => (
            <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <span style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'rgba(236,72,153,0.2)', color: '#F472B6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800, flexShrink: 0 }}>{i + 1}</span>
              <span style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>{step}</span>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT: Upload + Gallery */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>

        {/* XP Badge */}
        {xp > 0 && (
          <div style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: '12px', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Star size={18} color="#F59E0B" fill="#F59E0B" />
            <div>
              <div style={{ fontSize: '0.75rem', color: '#F59E0B', fontWeight: 800 }}>ART XP EARNED</div>
              <div style={{ fontSize: '1rem', fontWeight: 800 }}>{xp} XP Total · {xpStore.getLevel().title}</div>
            </div>
          </div>
        )}

        {/* Upload Panel */}
        <div className="glass-panel" style={{ padding: '22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <Camera size={20} color="#EC4899" />
            <h3 style={{ fontSize: '1.05rem', margin: 0 }}>Upload Artwork to CBC Portfolio</h3>
            <span style={{ marginLeft: 'auto', fontSize: '0.72rem', color: '#EC4899', fontWeight: 700 }}>{artworkStore.count()} works saved</span>
          </div>

          {uploadState === 'success' ? (
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <CheckCircle size={40} color="#10B981" style={{ margin: '0 auto 10px' }} />
              <div style={{ fontSize: '1rem', fontWeight: 800, color: '#10B981', marginBottom: '4px' }}>Artwork Saved! +30 XP</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>Added to Liam's CBC Creative Arts portfolio transcript.</div>
              <button onClick={resetUpload} className="btn-secondary" style={{ fontSize: '0.82rem' }}>Upload Another</button>
            </div>
          ) : (
            <>
              {/* Drop Zone */}
              <div
                onClick={() => fileRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                style={{ border: `2px dashed ${previewUrl ? '#EC4899' : 'var(--border-card)'}`, borderRadius: '12px', padding: '20px', textAlign: 'center', cursor: 'pointer', background: previewUrl ? 'rgba(236,72,153,0.05)' : 'rgba(255,255,255,0.02)', marginBottom: '12px', transition: 'all 0.2s' }}
              >
                {previewUrl ? (
                  <img src={previewUrl} alt="preview" style={{ maxHeight: '140px', maxWidth: '100%', borderRadius: '8px', objectFit: 'contain' }} />
                ) : (
                  <>
                    <UploadCloud size={28} color="#EC4899" style={{ margin: '0 auto 8px' }} />
                    <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>Click or drag artwork photo here</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>JPG, PNG, WEBP — saved to CBC portfolio</div>
                  </>
                )}
              </div>
              <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => handleFileSelect(e.target.files?.[0])} />

              {previewUrl && (
                <div style={{ marginBottom: '10px' }}>
                  <input
                    value={artworkTitle}
                    onChange={(e) => setArtworkTitle(e.target.value)}
                    placeholder="Artwork title..."
                    style={{ width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-card)', borderRadius: '8px', padding: '8px 12px', color: '#F8FAFC', fontSize: '0.85rem', boxSizing: 'border-box' }}
                  />
                </div>
              )}

              <button
                onClick={previewUrl ? handleUpload : () => fileRef.current?.click()}
                disabled={uploadState === 'uploading'}
                className="btn-primary"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                {uploadState === 'uploading' ? '⏳ Saving to Portfolio...' : previewUrl ? '📤 Submit to CBC Art Portfolio (+30 XP)' : '📷 Choose Artwork Photo'}
              </button>
            </>
          )}
        </div>

        {/* Gallery */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '1rem', margin: '0 0 14px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
            🖼️ Student Art Gallery
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 400 }}>({gallery.length} works)</span>
          </h3>

          {gallery.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              No artworks uploaded yet. Complete a craft and upload to start your gallery!
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {gallery.map((art) => (
                <div key={art.id} style={{ display: 'flex', gap: '12px', alignItems: 'center', background: 'rgba(255,255,255,0.02)', padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
                  <img src={art.imageDataUrl} alt={art.title} style={{ width: '56px', height: '56px', borderRadius: '8px', objectFit: 'cover', flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '0.86rem', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{art.title}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{new Date(art.uploadedAt).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                    <div style={{ fontSize: '0.75rem', color: '#10B981', fontWeight: 600 }}>✓ Level 4 (EE) · CBC Transcript</div>
                  </div>
                  <button onClick={() => removeArtwork(art.id)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '4px', display: 'flex' }}>
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Static seed entry */}
          {gallery.length === 0 && (
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', background: 'rgba(255,255,255,0.02)', padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--border-subtle)', marginTop: '10px' }}>
              <img src="https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=300" alt="Art" style={{ width: '56px', height: '56px', borderRadius: '8px', objectFit: 'cover' }} />
              <div>
                <div style={{ fontSize: '0.86rem', fontWeight: 700 }}>Kitenge Giraffe Mosaic Collage</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Created by Liam · 14 Sep 2026</div>
                <div style={{ fontSize: '0.75rem', color: '#10B981', fontWeight: 600 }}>✓ Level 4 (EE) · CBC Transcript</div>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
