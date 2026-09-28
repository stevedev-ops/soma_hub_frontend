import React, { useState, useRef, useEffect } from 'react';
import { 
  X, Video, VideoOff, Mic, MicOff, PenTool, Eraser, 
  RotateCcw, Download, Sparkles, MessageSquare, BookOpen, 
  CheckCircle2, Share2, Shield
} from 'lucide-react';

export default function VirtualClassroomModal({ 
  session = { tutorName: "Teacher Grace", subject: "Mathematics - Fractions", studentName: "Learner" }, 
  onClose 
}) {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#38BDF8');
  const [lineWidth, setLineWidth] = useState(3);
  const [tool, setTool] = useState('pen'); // pen | highlighter | eraser
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [notes, setNotes] = useState('Lesson Notes:\n- Reviewing proper vs improper fractions\n- Converting mixed numbers to decimals\n- Homework practice #3 & #4');
  const [activeTab, setActiveTab] = useState('whiteboard'); // whiteboard | notes

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Canvas background
    ctx.fillStyle = '#0F172A';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Grid lines for math/science feel
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let x = 0; x < canvas.width; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }
  }, []);

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (tool === 'eraser') {
      ctx.strokeStyle = '#0F172A';
      ctx.lineWidth = 24;
    } else if (tool === 'highlighter') {
      ctx.strokeStyle = 'rgba(250, 204, 21, 0.35)';
      ctx.lineWidth = 18;
    } else {
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
    }

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#0F172A';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const downloadCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `SomaHome_Whiteboard_${Date.now()}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(10, 15, 29, 0.95)',
      backdropFilter: 'blur(16px)',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      color: '#FFFFFF'
    }}>
      {/* Top Bar */}
      <div style={{
        padding: '14px 24px',
        background: 'rgba(15, 23, 42, 0.8)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10B981', boxShadow: '0 0 10px #10B981', animation: 'pulse 2s infinite' }} />
          <div>
            <h2 style={{ fontSize: '1.1rem', margin: 0, fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>Live Virtual Classroom</span>
              <span style={{ fontSize: '0.72rem', background: 'rgba(0,166,81,0.2)', color: '#34D399', padding: '2px 8px', borderRadius: '6px', border: '1px solid rgba(0,166,81,0.3)' }}>
                HD WebRTC Connected
              </span>
            </h2>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              {session.subject || 'One-on-One Session'} • {session.tutorName} with {session.studentName}
            </div>
          </div>
        </div>

        {/* Audio / Video Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            type="button"
            onClick={() => setIsAudioOn(!isAudioOn)}
            style={{
              padding: '8px 14px',
              borderRadius: '10px',
              background: isAudioOn ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
              color: isAudioOn ? '#34D399' : '#F87171',
              border: `1px solid ${isAudioOn ? 'rgba(16, 185, 129, 0.4)' : 'rgba(239, 68, 68, 0.4)'}`,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              fontSize: '0.82rem',
              fontWeight: 600
            }}
          >
            {isAudioOn ? <Mic size={15} /> : <MicOff size={15} />}
            <span>{isAudioOn ? 'Mic Active' : 'Muted'}</span>
          </button>

          <button
            type="button"
            onClick={() => setIsVideoOn(!isVideoOn)}
            style={{
              padding: '8px 14px',
              borderRadius: '10px',
              background: isVideoOn ? 'rgba(56, 189, 248, 0.2)' : 'rgba(239, 68, 68, 0.2)',
              color: isVideoOn ? '#38BDF8' : '#F87171',
              border: `1px solid ${isVideoOn ? 'rgba(56, 189, 248, 0.4)' : 'rgba(239, 68, 68, 0.4)'}`,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              fontSize: '0.82rem',
              fontWeight: 600
            }}
          >
            {isVideoOn ? <Video size={15} /> : <VideoOff size={15} />}
            <span>{isVideoOn ? 'Camera Active' : 'Camera Off'}</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '8px 16px',
              borderRadius: '10px',
              background: '#EF4444',
              color: '#FFFFFF',
              border: 'none',
              fontWeight: 700,
              cursor: 'pointer',
              fontSize: '0.82rem'
            }}
          >
            End Call
          </button>
        </div>
      </div>

      {/* Main Workspace */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Left Interactive Whiteboard */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#0F172A', position: 'relative' }}>
          {/* Whiteboard Toolbar */}
          <div style={{
            position: 'absolute',
            top: '14px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(15, 23, 42, 0.85)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '14px',
            padding: '6px 12px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            zIndex: 10
          }}>
            <button
              type="button"
              onClick={() => setTool('pen')}
              style={{
                background: tool === 'pen' ? 'rgba(56, 189, 248, 0.3)' : 'transparent',
                border: tool === 'pen' ? '1px solid #38BDF8' : 'none',
                color: tool === 'pen' ? '#38BDF8' : '#94A3B8',
                padding: '6px 10px',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '0.8rem'
              }}
            >
              <PenTool size={14} />
              <span>Pen</span>
            </button>

            <button
              type="button"
              onClick={() => setTool('highlighter')}
              style={{
                background: tool === 'highlighter' ? 'rgba(250, 204, 21, 0.3)' : 'transparent',
                border: tool === 'highlighter' ? '1px solid #FACC15' : 'none',
                color: tool === 'highlighter' ? '#FACC15' : '#94A3B8',
                padding: '6px 10px',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '0.8rem'
              }}
            >
              <Sparkles size={14} />
              <span>Highlight</span>
            </button>

            <button
              type="button"
              onClick={() => setTool('eraser')}
              style={{
                background: tool === 'eraser' ? 'rgba(239, 68, 68, 0.3)' : 'transparent',
                border: tool === 'eraser' ? '1px solid #EF4444' : 'none',
                color: tool === 'eraser' ? '#FCA5A5' : '#94A3B8',
                padding: '6px 10px',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '0.8rem'
              }}
            >
              <Eraser size={14} />
              <span>Eraser</span>
            </button>

            {/* Colors */}
            {tool === 'pen' && (
              <div style={{ display: 'flex', gap: '4px', marginLeft: '6px', borderLeft: '1px solid rgba(255,255,255,0.1)', paddingLeft: '6px' }}>
                {['#38BDF8', '#34D399', '#FBBF24', '#F43F5E', '#FFFFFF'].map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    style={{
                      width: '18px',
                      height: '18px',
                      borderRadius: '50%',
                      background: c,
                      border: color === c ? '2px solid #FFFFFF' : 'none',
                      cursor: 'pointer'
                    }}
                  />
                ))}
              </div>
            )}

            <button
              type="button"
              onClick={clearCanvas}
              title="Clear Whiteboard"
              style={{
                background: 'transparent',
                border: 'none',
                color: '#94A3B8',
                padding: '6px',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              <RotateCcw size={15} />
            </button>

            <button
              type="button"
              onClick={downloadCanvas}
              title="Save Whiteboard Snapshot"
              style={{
                background: 'transparent',
                border: 'none',
                color: '#94A3B8',
                padding: '6px',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              <Download size={15} />
            </button>
          </div>

          <canvas
            ref={canvasRef}
            width={1000}
            height={700}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            style={{ width: '100%', height: '100%', cursor: tool === 'eraser' ? 'cell' : 'crosshair' }}
          />
        </div>

        {/* Right Sidebar: Video Avatars & Session Lesson Plan */}
        <div style={{
          width: '320px',
          background: 'rgba(15, 23, 42, 0.95)',
          borderLeft: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          flexDirection: 'column',
          padding: '16px',
          gap: '14px'
        }}>
          {/* Tutor Video Stream Preview */}
          <div style={{
            height: '150px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #1E293B, #0F172A)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {isVideoOn ? (
              <div style={{ textAlign: 'center' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(0,166,81,0.2)', border: '2px solid #00A651', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px auto', fontSize: '1.4rem' }}>
                  👩‍🏫
                </div>
                <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>{session.tutorName}</div>
                <div style={{ fontSize: '0.7rem', color: '#10B981' }}>Speaking (Live Video)</div>
              </div>
            ) : (
              <div style={{ color: '#94A3B8', fontSize: '0.8rem' }}>Video Paused</div>
            )}
            <span style={{ position: 'absolute', bottom: '8px', left: '8px', background: 'rgba(0,0,0,0.6)', padding: '2px 6px', borderRadius: '4px', fontSize: '0.65rem' }}>
              TUTOR
            </span>
          </div>

          {/* Student Video Stream Preview */}
          <div style={{
            height: '110px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #1E293B, #0F172A)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(56,189,248,0.2)', border: '2px solid #38BDF8', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 4px auto', fontSize: '1.1rem' }}>
                👦
              </div>
              <div style={{ fontWeight: 700, fontSize: '0.78rem' }}>{session.studentName}</div>
            </div>
            <span style={{ position: 'absolute', bottom: '6px', left: '8px', background: 'rgba(0,0,0,0.6)', padding: '2px 6px', borderRadius: '4px', fontSize: '0.65rem' }}>
              LEARNER
            </span>
          </div>

          {/* Real-time Session Notes */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Live Lesson Notes
              </span>
              <BookOpen size={14} color="#94A3B8" />
            </div>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Type shared lesson objectives, formulas, or homework reminders..."
              style={{
                flex: 1,
                width: '100%',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '10px',
                padding: '10px',
                color: '#F8FAFC',
                fontSize: '0.8rem',
                fontFamily: 'inherit',
                resize: 'none',
                outline: 'none'
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
