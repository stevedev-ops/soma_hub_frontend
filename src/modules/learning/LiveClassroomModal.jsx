import React, { useState, useRef, useEffect } from 'react';
import { 
  X, Mic, MicOff, Video, VideoOff, Hand, MessageSquare, 
  PenTool, Eraser, Trash2, Users, Maximize2, Minimize2, 
  Send, Sparkles, ShieldCheck, Clock, Share2, Volume2, PhoneOff
} from 'lucide-react';

export default function LiveClassroomModal({ isOpen, onClose, sessionTitle = 'Grade 4 Science: Separation of Matter', teacherName = 'Teacher Sarah Wambui' }) {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState('whiteboard'); // 'whiteboard' | 'chat'
  const [micOn, setMicOn] = useState(true);
  const [videoOn, setVideoOn] = useState(true);
  const [handRaised, setHandRaised] = useState(false);
  const [activeColor, setActiveColor] = useState('#10b981');
  const [brushSize, setBrushSize] = useState(3);
  const [isDrawing, setIsDrawing] = useState(false);

  // Classroom Chat State
  const [chatMessages, setChatMessages] = useState([
    { id: 1, sender: 'Teacher Sarah', text: 'Karibuni class! Today we are demonstrating how evaporation separates salt crystals from water.', time: '10:02 AM', isTeacher: true },
    { id: 2, sender: 'Amani O.', text: 'Teacher Sarah, can we use sea water from Mombasa?', time: '10:04 AM', isTeacher: false },
    { id: 3, sender: 'Teacher Sarah', text: 'Exactly Amani! That is how the salt pans in Malindi work.', time: '10:05 AM', isTeacher: true }
  ]);
  const [newMessage, setNewMessage] = useState('');

  // Canvas Ref for Whiteboard
  const canvasRef = useRef(null);
  const [ctx, setCtx] = useState(null);

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      canvas.width = canvas.parentElement.clientWidth || 700;
      canvas.height = 420;
      const context = canvas.getContext('2d');
      context.lineCap = 'round';
      context.lineJoin = 'round';
      context.strokeStyle = activeColor;
      context.lineWidth = brushSize;
      setCtx(context);

      // Draw initial welcome diagram on canvas
      context.strokeStyle = '#059669';
      context.lineWidth = 2;
      context.beginPath();
      context.arc(canvas.width / 2, 160, 60, 0, Math.PI * 2);
      context.stroke();
      context.fillStyle = '#6ee7b7';
      context.font = '14px Inter, sans-serif';
      context.fillText('Evaporation Flask', canvas.width / 2 - 55, 165);
    }
  }, [activeTab]);

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
    e.preventDefault();
    if (!newMessage.trim()) return;

    setChatMessages(prev => [
      ...prev,
      {
        id: Date.now(),
        sender: 'Liam K. (You)',
        text: newMessage,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isTeacher: false
      }
    ]);
    setNewMessage('');

    setTimeout(() => {
      setChatMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: teacherName,
          text: `Great observation Liam! Take a look at step 3 on the shared whiteboard.`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isTeacher: true
        }
      ]);
    }, 1500);
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
        padding: '10px'
      }}
    >
      <div style={{
        width: '100%',
        maxWidth: '1140px',
        height: 'calc(100vh - 20px)',
        maxHeight: '95vh',
        borderRadius: '20px',
        background: '#0E1524',
        border: '1.5px solid rgba(16, 185, 129, 0.4)',
        boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.9)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        position: 'relative'
      }}>
        
        {/* Top Classroom Bar */}
        <div style={{
          padding: '14px 24px',
          background: 'rgba(8, 12, 20, 0.95)',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexShrink: 0
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span className="glass-pill" style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#EF4444', border: '1px solid rgba(239, 68, 68, 0.35)', fontWeight: 800 }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#EF4444', display: 'inline-block' }} />
              <span>LIVE CLASSROOM</span>
            </span>
            <div>
              <h3 style={{ fontSize: '1.05rem', margin: 0, color: '#F8FAFC' }}>
                {sessionTitle}
              </h3>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Lead Facilitator: <strong style={{ color: '#34D399' }}>{teacherName}</strong>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span className="glass-pill" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem' }}>
              <Clock size={13} color="#10B981" />
              <span>34:12 elapsed</span>
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
              <span>Leave Class</span>
            </button>
          </div>
        </div>

        {/* Main Stage Grid */}
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          
          {/* Left / Center: Interactive Stage */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '16px', background: 'rgba(0,0,0,0.35)', overflow: 'hidden' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexShrink: 0 }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => setActiveTab('whiteboard')}
                  className={activeTab === 'whiteboard' ? 'btn-primary' : 'btn-secondary'}
                  style={{ fontSize: '0.78rem', padding: '6px 14px', gap: '6px' }}
                >
                  <PenTool size={13} />
                  <span>Shared Interactive Whiteboard</span>
                </button>
              </div>

              {/* Whiteboard Controls */}
              {activeTab === 'whiteboard' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(0,0,0,0.4)', padding: '4px 12px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ display: 'flex', gap: '6px', marginRight: '8px', borderRight: '1px solid var(--border-subtle)', paddingRight: '10px' }}>
                    {['#10b981', '#38bdf8', '#f59e0b', '#ef4444', '#f8fafc'].map(col => (
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
                    title="Clear Whiteboard"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              )}
            </div>

            {/* Whiteboard Canvas Area */}
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
                <span>Collaborative Canvas: Teacher & Students annotate together</span>
              </div>
            </div>

            {/* Bottom Controls Bar */}
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
                  className="btn-secondary"
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
                <span>Encrypted Class Feed</span>
              </div>
            </div>

          </div>

          {/* Right Sidebar: Video & Chat */}
          <div style={{ width: 'clamp(260px, 28vw, 320px)', flexShrink: 0, borderLeft: '1px solid var(--border-subtle)', background: 'rgba(8, 12, 20, 0.8)', display: 'flex', flexDirection: 'column' }}>
            
            {/* Camera Feeds */}
            <div style={{ padding: '12px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '10px', flexShrink: 0 }}>
              
              {/* Teacher Tile */}
              <div style={{ position: 'relative', height: '115px', borderRadius: '12px', overflow: 'hidden', border: '1.5px solid rgba(16, 185, 129, 0.4)' }}>
                <img 
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80" 
                  alt="Teacher" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{
                  position: 'absolute', bottom: '6px', left: '6px',
                  background: 'rgba(0,0,0,0.8)', borderRadius: '6px', padding: '2px 8px',
                  fontSize: '0.68rem', color: '#10B981', fontWeight: 700
                }}>
                  {teacherName}
                </div>
              </div>

              {/* Student Tile */}
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

            {/* Chat Header */}
            <div style={{ padding: '8px 12px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              <span style={{ fontWeight: 700, color: '#F8FAFC', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <MessageSquare size={13} color="#10B981" />
                <span>Live Discussion</span>
              </span>
              <span>4 Attendees</span>
            </div>

            {/* Messages */}
            <div style={{ flex: 1, padding: '12px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {chatMessages.map(msg => (
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

            {/* Input Form */}
            <form onSubmit={handleSendMessage} style={{ padding: '10px 12px', borderTop: '1px solid var(--border-subtle)', display: 'flex', gap: '8px', flexShrink: 0 }}>
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Ask teacher a question..."
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