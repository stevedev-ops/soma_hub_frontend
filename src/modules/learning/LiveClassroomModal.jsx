import React, { useState, useRef, useEffect } from 'react';
import { 
  X, Mic, MicOff, Video, VideoOff, Hand, MessageSquare, 
  PenTool, Eraser, Trash2, Users, Maximize2, Minimize2, 
  Send, Sparkles, ShieldCheck, Clock, Share2, Volume2, PhoneOff
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function LiveClassroomModal({ 
  isOpen, 
  onClose, 
  session, 
  sessionTitle, 
  teacherName, 
  tutorAvatar, 
  studentName 
}) {
  if (!isOpen) return null;

  const { currentUser } = useAuth();
  const effectiveTeacherName = teacherName || session?.tutorName || 'Teacher Specialist';
  const effectiveTeacherAvatar = tutorAvatar || session?.tutorAvatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80';
  const effectiveStudentName = studentName || session?.studentName || currentUser?.name || 'Learner';
  const effectiveTitle = sessionTitle || session?.focusSubject || 'Live Specialist Masterclass';

  const [activeTab, setActiveTab] = useState('whiteboard'); // 'whiteboard' | 'chat'
  const [micOn, setMicOn] = useState(true);
  const [videoOn, setVideoOn] = useState(true);
  const [handRaised, setHandRaised] = useState(false);
  const [activeColor, setActiveColor] = useState('#10b981');
  const [brushSize, setBrushSize] = useState(3);
  const [isDrawing, setIsDrawing] = useState(false);

  // Dynamic Classroom Chat State
  const [chatMessages, setChatMessages] = useState(() => [
    { 
      id: 1, 
      sender: effectiveTeacherName, 
      text: `Karibu ${effectiveStudentName.split(' ')[0]}! Welcome to our 1-on-1 virtual studio. I have opened our shared canvas.`, 
      time: 'Just now', 
      isTeacher: true 
    }
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

      context.fillStyle = '#10B981';
      context.font = '14px Outfit, sans-serif';
      context.textAlign = 'center';
      context.fillText('Interactive Lesson Space', canvas.width / 2, 165);
    }
  }, []);

  const startDrawing = (e) => {
    if (!ctx) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.strokeStyle = activeColor;
    ctx.lineWidth = brushSize;
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
    if (!ctx) return;
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

    const msg = {
      id: Date.now(),
      sender: `${effectiveStudentName.split(' ')[0]} (You)`,
      text: newMessage.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isTeacher: false
    };

    setChatMessages((prev) => [...prev, msg]);
    setNewMessage('');
  };

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(5, 10, 15, 0.95)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 99999,
        padding: '16px'
      }}
    >
      <div 
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '1240px',
          height: '92vh',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: '24px',
          border: '1.5px solid rgba(16, 185, 129, 0.3)',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.9)',
          background: '#0B111E',
          overflow: 'hidden'
        }}
      >
        {/* Top Header Bar */}
        <div style={{
          padding: '14px 24px',
          background: 'rgba(10, 14, 23, 0.9)',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexShrink: 0
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <span className="glass-pill" style={{ color: '#EF4444', border: '1px solid rgba(239, 68, 68, 0.4)', fontSize: '0.75rem', fontWeight: 800 }}>
              🔴 LIVE CLASSROOM
            </span>
            <div>
              <h2 style={{ fontSize: '1.15rem', margin: 0, fontWeight: 700, color: '#F8FAFC' }}>
                {effectiveTitle}
              </h2>
              <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)' }}>
                Lead Facilitator: <strong style={{ color: '#34D399' }}>{effectiveTeacherName}</strong> • Learner: <strong style={{ color: '#38BDF8' }}>{effectiveStudentName}</strong>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: '#10B981', background: 'rgba(16, 185, 129, 0.1)', padding: '6px 12px', borderRadius: '8px' }}>
              <Clock size={14} />
              <span>Live Session Active</span>
            </div>

            <button
              onClick={onClose}
              className="btn-danger"
              style={{ fontSize: '0.78rem', padding: '6px 14px', gap: '6px' }}
            >
              <PhoneOff size={14} />
              <span>Leave Class</span>
            </button>
          </div>
        </div>

        {/* Main Studio Area */}
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          
          {/* Left Canvas / Whiteboard Studio */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '16px', overflow: 'hidden' }}>
            
            {/* Whiteboard Controls Toolbar */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: 'rgba(15, 23, 42, 0.8)',
              padding: '8px 16px',
              borderRadius: '12px',
              border: '1px solid var(--border-subtle)',
              marginBottom: '12px',
              flexShrink: 0
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#34D399', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <PenTool size={14} />
                  <span>Shared Interactive Whiteboard</span>
                </span>
              </div>

              {/* Palette & Tools */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {['#10b981', '#38bdf8', '#f59e0b', '#ef4444', '#ffffff'].map((color) => (
                  <button
                    key={color}
                    onClick={() => setActiveColor(color)}
                    style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      backgroundColor: color,
                      border: activeColor === color ? '2px solid white' : '1px solid rgba(0,0,0,0.5)',
                      cursor: 'pointer',
                      transform: activeColor === color ? 'scale(1.2)' : 'scale(1)',
                      transition: 'all 0.15s ease'
                    }}
                  />
                ))}

                <div style={{ width: '1px', height: '18px', background: 'var(--border-subtle)', margin: '0 4px' }} />

                <button
                  onClick={clearCanvas}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                  title="Clear Canvas"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>

            {/* Drawing Canvas */}
            <div style={{
              flex: 1,
              background: '#070C15',
              borderRadius: '16px',
              border: '1.5px solid rgba(255,255,255,0.06)',
              overflow: 'hidden',
              position: 'relative',
              cursor: 'crosshair',
              display: 'flex'
            }}>
              <canvas
                ref={canvasRef}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                style={{ width: '100%', height: '100%' }}
              />
              <div style={{
                position: 'absolute',
                bottom: '12px',
                left: '14px',
                pointerEvents: 'none',
                fontSize: '0.72rem',
                color: 'var(--text-muted)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
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
                  src={effectiveTeacherAvatar} 
                  alt={effectiveTeacherName} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{
                  position: 'absolute', bottom: '6px', left: '6px',
                  background: 'rgba(0,0,0,0.8)', borderRadius: '6px', padding: '2px 8px',
                  fontSize: '0.68rem', color: '#10B981', fontWeight: 700
                }}>
                  {effectiveTeacherName}
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
                    {effectiveStudentName.split(' ')[0]} (Camera Live)
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
                  {effectiveStudentName.split(' ')[0]} (You)
                </div>
              </div>

            </div>

            {/* Chat Header */}
            <div style={{ padding: '8px 12px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              <span style={{ fontWeight: 700, color: '#F8FAFC', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <MessageSquare size={13} color="#10B981" />
                <span>Live Discussion</span>
              </span>
              <span>1-on-1 Studio</span>
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
