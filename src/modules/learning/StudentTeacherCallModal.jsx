import React, { useState, useRef, useEffect } from 'react';
import { 
  X, Mic, MicOff, Video, VideoOff, Hand, MessageSquare, 
  PenTool, Eraser, Trash2, Send, Sparkles, ShieldCheck, 
  Clock, PhoneOff, CheckCircle2, Volume2, Smile, ThumbsUp, HelpCircle
} from 'lucide-react';

export default function StudentTeacherCallModal({ 
  isOpen, 
  onClose, 
  tutorName = 'Teacher Mercy Cherono',
  subject = 'Grade 4 CBC Mathematics: Fractions & Decimals',
  tutorAvatar = 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300'
}) {
  if (!isOpen) return null;

  const [activeView, setActiveView] = useState('whiteboard'); // 'whiteboard' | 'video_focus'
  const [micOn, setMicOn] = useState(true);
  const [videoOn, setVideoOn] = useState(true);
  const [handRaised, setHandRaised] = useState(false);
  
  // Whiteboard Canvas State
  const [activeColor, setActiveColor] = useState('#10b981');
  const [brushSize, setBrushSize] = useState(3);
  const [isDrawing, setIsDrawing] = useState(false);
  const canvasRef = useRef(null);
  const [ctx, setCtx] = useState(null);

  // In-Call Chat Messages
  const [messages, setMessages] = useState([
    { id: 1, sender: tutorName, text: 'Jambo Liam! Welcome to our 1-on-1 math session. Today we are exploring equivalent fractions with shapes.', time: '10:01 AM', isTeacher: true },
    { id: 2, sender: 'Liam (You)', text: 'Jambo Teacher Mercy! I have my notebook and ruler ready.', time: '10:02 AM', isTeacher: false },
    { id: 3, sender: tutorName, text: 'Excellent! Look at the rectangle on our shared whiteboard. Can you divide it into 4 equal quarters?', time: '10:03 AM', isTeacher: true }
  ]);
  const [inputMsg, setInputMsg] = useState('');

  // Setup Canvas
  useEffect(() => {
    if (canvasRef.current && activeView === 'whiteboard') {
      const canvas = canvasRef.current;
      canvas.width = canvas.parentElement.clientWidth || 640;
      canvas.height = 380;
      const context = canvas.getContext('2d');
      context.lineCap = 'round';
      context.lineJoin = 'round';
      context.strokeStyle = activeColor;
      context.lineWidth = brushSize;
      setCtx(context);

      // Draw initial fraction rectangle from teacher
      context.strokeStyle = '#38bdf8';
      context.lineWidth = 3;
      context.strokeRect(80, 80, 360, 140);
      context.fillStyle = '#94a3b8';
      context.font = '14px Inter, sans-serif';
      context.fillText('Teacher Mercy: "Divide this 1 Whole into 4 Equal Quarters (1/4)"', 80, 65);
    }
  }, [activeView]);

  useEffect(() => {
    if (ctx) {
      ctx.strokeStyle = activeColor;
      ctx.lineWidth = brushSize;
    }
  }, [activeColor, brushSize, ctx]);

  // Drawing Handlers
  const startDrawing = (e) => {
    if (!ctx) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing || !ctx) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing || !ctx) return;
    ctx.closePath();
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    if (!ctx || !canvasRef.current) return;
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  };

  const handleSendMessage = (e) => {
    if (e) e.preventDefault();
    if (!inputMsg.trim()) return;

    const userMsg = inputMsg;
    setMessages(prev => [
      ...prev,
      {
        id: Date.now(),
        sender: 'Liam (You)',
        text: userMsg,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isTeacher: false
      }
    ]);
    setInputMsg('');

    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: tutorName,
          text: `Well done Liam! That is exactly correct. You drew the lines with great symmetry!`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isTeacher: true
        }
      ]);
    }, 1600);
  };

  const sendQuickReply = (text) => {
    setMessages(prev => [
      ...prev,
      {
        id: Date.now(),
        sender: 'Liam (You)',
        text: text,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isTeacher: false
      }
    ]);
  };

  return (
    <div 
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(5, 10, 15, 0.92)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '20px'
      }}
    >
      <div style={{
        width: '100%',
        maxWidth: '1050px',
        height: '92vh',
        borderRadius: '24px',
        background: '#0E1524',
        border: '1.5px solid rgba(16, 185, 129, 0.4)',
        boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.9)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        position: 'relative'
      }}>
        
        {/* Top Call Header */}
        <div style={{
          padding: '14px 24px',
          background: 'rgba(8, 12, 20, 0.95)',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexShrink: 0
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <span className="glass-pill" style={{ color: '#10B981', border: '1px solid rgba(16, 185, 129, 0.4)', background: 'rgba(16, 185, 129, 0.15)', fontWeight: 800 }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981', display: 'inline-block' }} />
              <span>1-ON-1 LIVE CLASS</span>
            </span>
            <div>
              <h3 style={{ fontSize: '1.05rem', margin: 0, color: '#F8FAFC' }}>
                {subject}
              </h3>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Specialist: <strong style={{ color: '#34D399' }}>{tutorName}</strong>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span className="glass-pill" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem' }}>
              <Clock size={13} color="#10B981" />
              <span>24:18 elapsed</span>
            </span>

            <button
              onClick={onClose}
              style={{
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.35)',
                color: '#F87171',
                borderRadius: '10px',
                padding: '6px 14px',
                fontSize: '0.8rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer'
              }}
            >
              <PhoneOff size={14} />
              <span>End Lesson</span>
            </button>
          </div>
        </div>

        {/* Main Split Stage */}
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          
          {/* Left: Stage (Whiteboard or Full Video) */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '16px', background: 'rgba(0,0,0,0.35)', overflow: 'hidden' }}>
            
            {/* View Switcher & Whiteboard Tools */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexShrink: 0 }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => setActiveView('whiteboard')}
                  className={activeView === 'whiteboard' ? 'btn-primary' : 'btn-secondary'}
                  style={{ fontSize: '0.78rem', padding: '6px 14px', gap: '6px' }}
                >
                  <PenTool size={13} />
                  <span>Collaborative Whiteboard</span>
                </button>
                <button
                  onClick={() => setActiveView('video_focus')}
                  className={activeView === 'video_focus' ? 'btn-primary' : 'btn-secondary'}
                  style={{ fontSize: '0.78rem', padding: '6px 14px', gap: '6px' }}
                >
                  <Video size={13} />
                  <span>Video Focus</span>
                </button>
              </div>

              {activeView === 'whiteboard' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(0,0,0,0.4)', padding: '4px 12px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ display: 'flex', gap: '6px', marginRight: '8px', borderRight: '1px solid var(--border-subtle)', paddingRight: '10px' }}>
                    {['#10b981', '#38bdf8', '#f59e0b', '#ec4899', '#ffffff'].map(col => (
                      <button
                        key={col}
                        onClick={() => setActiveColor(col)}
                        style={{
                          width: '18px', height: '18px', borderRadius: '50%',
                          background: col, border: activeColor === col ? '2px solid #fff' : 'none',
                          cursor: 'pointer'
                        }}
                      />
                    ))}
                  </div>

                  <button
                    onClick={clearCanvas}
                    style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex' }}
                    title="Clear Board"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              )}
            </div>

            {/* Whiteboard Canvas Area */}
            {activeView === 'whiteboard' ? (
              <div style={{
                flex: 1,
                background: '#070B12',
                border: '1px solid var(--border-subtle)',
                borderRadius: '16px',
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <canvas
                  ref={canvasRef}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  style={{ width: '100%', height: '100%', cursor: 'crosshair' }}
                />
                <div style={{
                  position: 'absolute', bottom: '12px', left: '12px',
                  background: 'rgba(10, 14, 23, 0.85)', backdropFilter: 'blur(8px)',
                  borderRadius: '8px', padding: '4px 10px', fontSize: '0.72rem',
                  color: '#34D399', border: '1px solid rgba(0, 166, 81, 0.3)',
                  display: 'flex', alignItems: 'center', gap: '6px'
                }}>
                  <Sparkles size={12} color="#10B981" />
                  <span>Teacher Mercy & Liam can draw together simultaneously</span>
                </div>
              </div>
            ) : (
              /* Full Screen Video Focus */
              <div style={{
                flex: 1,
                background: '#000',
                borderRadius: '16px',
                overflow: 'hidden',
                position: 'relative'
              }}>
                <img 
                  src={tutorAvatar} 
                  alt={tutorName}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{
                  position: 'absolute', top: '16px', left: '16px',
                  background: 'rgba(0,0,0,0.7)', borderRadius: '8px',
                  padding: '6px 12px', fontSize: '0.8rem', color: '#10B981', fontWeight: 700
                }}>
                  {tutorName} (Speaking)
                </div>
              </div>
            )}

            {/* Bottom Kid Controls Bar */}
            <div style={{
              marginTop: '12px',
              padding: '10px 16px',
              background: 'rgba(8, 12, 20, 0.95)',
              borderRadius: '14px',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexShrink: 0
            }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => setMicOn(!micOn)}
                  className={micOn ? 'btn-secondary' : 'btn-secondary'}
                  style={{
                    fontSize: '0.78rem', padding: '8px 14px', gap: '6px',
                    color: micOn ? '#F8FAFC' : '#EF4444',
                    borderColor: micOn ? 'var(--border-card)' : 'rgba(239, 68, 68, 0.4)'
                  }}
                >
                  {micOn ? <Mic size={14} color="#10B981" /> : <MicOff size={14} color="#EF4444" />}
                  <span>{micOn ? 'Mic Live' : 'Muted'}</span>
                </button>

                <button
                  onClick={() => setVideoOn(!videoOn)}
                  className="btn-secondary"
                  style={{
                    fontSize: '0.78rem', padding: '8px 14px', gap: '6px',
                    color: videoOn ? '#F8FAFC' : '#EF4444',
                    borderColor: videoOn ? 'var(--border-card)' : 'rgba(239, 68, 68, 0.4)'
                  }}
                >
                  {videoOn ? <Video size={14} color="#10B981" /> : <VideoOff size={14} color="#EF4444" />}
                  <span>{videoOn ? 'Camera Live' : 'Camera Off'}</span>
                </button>

                <button
                  onClick={() => setHandRaised(!handRaised)}
                  style={{
                    background: handRaised ? '#F59E0B' : 'rgba(255,255,255,0.06)',
                    color: handRaised ? '#0F172A' : '#F8FAFC',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '10px',
                    padding: '8px 14px',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Hand size={14} />
                  <span>{handRaised ? 'Hand Raised! ✋' : 'Raise Hand'}</span>
                </button>
              </div>

              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ShieldCheck size={14} color="#10B981" />
                <span>Parent-Monitored Secure Room</span>
              </div>
            </div>

          </div>

          {/* Right Sidebar: Video Feeds & Chat */}
          <div style={{ width: '320px', borderLeft: '1px solid var(--border-subtle)', background: 'rgba(8, 12, 20, 0.8)', display: 'flex', flexDirection: 'column' }}>
            
            {/* 2 Video Feeds */}
            <div style={{ padding: '12px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '10px', flexShrink: 0 }}>
              
              {/* Teacher Camera Tile */}
              <div style={{ position: 'relative', height: '115px', borderRadius: '12px', overflow: 'hidden', border: '1.5px solid rgba(16, 185, 129, 0.4)' }}>
                <img 
                  src={tutorAvatar} 
                  alt={tutorName}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{
                  position: 'absolute', bottom: '6px', left: '6px',
                  background: 'rgba(0,0,0,0.8)', borderRadius: '6px', padding: '2px 8px',
                  fontSize: '0.68rem', color: '#10B981', fontWeight: 700
                }}>
                  {tutorName}
                </div>
              </div>

              {/* Student Camera Tile */}
              <div style={{
                position: 'relative', height: '115px', borderRadius: '12px', overflow: 'hidden',
                border: '1px solid var(--border-card)', background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                {videoOn ? (
                  <div style={{ color: '#38BDF8', fontWeight: 700, fontSize: '0.85rem' }}>
                    Liam K. (Camera Live)
                  </div>
                ) : (
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                    <VideoOff size={18} />
                    <span>Camera Off</span>
                  </div>
                )}
                <div style={{
                  position: 'absolute', bottom: '6px', left: '6px',
                  background: 'rgba(0,0,0,0.8)', borderRadius: '6px', padding: '2px 8px',
                  fontSize: '0.68rem', color: '#F8FAFC'
                }}>
                  Liam (You)
                </div>
              </div>

            </div>

            {/* Chat Messages */}
            <div style={{ flex: 1, padding: '12px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {messages.map(msg => (
                <div 
                  key={msg.id}
                  style={{
                    padding: '10px 12px',
                    borderRadius: '10px',
                    background: msg.isTeacher ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255, 255, 255, 0.04)',
                    border: msg.isTeacher ? '1px solid rgba(16, 185, 129, 0.25)' : '1px solid var(--border-subtle)',
                    fontSize: '0.78rem'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px', fontWeight: 700, color: msg.isTeacher ? '#10B981' : '#38BDF8' }}>
                    <span>{msg.sender}</span>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.68rem', fontWeight: 400 }}>{msg.time}</span>
                  </div>
                  <div style={{ color: '#F8FAFC', lineHeight: 1.4 }}>{msg.text}</div>
                </div>
              ))}
            </div>

            {/* Quick Kid Responses */}
            <div style={{ padding: '8px 12px', borderTop: '1px solid var(--border-subtle)', display: 'flex', gap: '6px', overflowX: 'auto', flexShrink: 0 }}>
              <button
                onClick={() => sendQuickReply('👍 I understand!')}
                className="glass-pill"
                style={{ fontSize: '0.68rem', cursor: 'pointer', padding: '3px 8px', whiteSpace: 'nowrap' }}
              >
                👍 Understood!
              </button>
              <button
                onClick={() => sendQuickReply('✋ I have a question')}
                className="glass-pill"
                style={{ fontSize: '0.68rem', cursor: 'pointer', padding: '3px 8px', whiteSpace: 'nowrap' }}
              >
                ✋ Question
              </button>
              <button
                onClick={() => sendQuickReply('✅ Problem solved')}
                className="glass-pill"
                style={{ fontSize: '0.68rem', cursor: 'pointer', padding: '3px 8px', whiteSpace: 'nowrap' }}
              >
                ✅ Solved!
              </button>
            </div>

            {/* Input Form */}
            <form onSubmit={handleSendMessage} style={{ padding: '10px 12px', borderTop: '1px solid var(--border-subtle)', display: 'flex', gap: '8px', flexShrink: 0 }}>
              <input
                type="text"
                value={inputMsg}
                onChange={(e) => setInputMsg(e.target.value)}
                placeholder="Message teacher..."
                style={{
                  flex: 1, background: 'rgba(0,0,0,0.5)', border: '1px solid var(--border-card)',
                  borderRadius: '10px', padding: '8px 12px', color: '#F8FAFC', fontSize: '0.78rem'
                }}
              />
              <button
                type="submit"
                className="btn-primary"
                style={{ padding: '8px 12px' }}
              >
                <Send size={13} />
              </button>
            </form>

          </div>

        </div>

      </div>
    </div>
  );
}