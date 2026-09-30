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
  const isTeacher = currentUser?.role === 'tutor' || currentUser?.role === 'teacher';
  const effectiveTeacherName = teacherName || session?.tutorName || 'Teacher Specialist';
  const effectiveTeacherAvatar = tutorAvatar || session?.tutorAvatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80';
  const effectiveStudentName = studentName || session?.studentName || currentUser?.name || 'Learner';
  const effectiveTitle = sessionTitle || session?.focusSubject || 'Live Specialist Masterclass';
  const roomId = session?.id || 'somahome_default_live_room';

  const [activeTab, setActiveTab] = useState('whiteboard'); // 'whiteboard' | 'chat'
  const [micOn, setMicOn] = useState(true);
  const [videoOn, setVideoOn] = useState(true);
  const [handRaised, setHandRaised] = useState(false);
  const [activeColor, setActiveColor] = useState('#10b981');
  const [brushSize, setBrushSize] = useState(3);
  const [isDrawing, setIsDrawing] = useState(false);
  const [activeTool, setActiveTool] = useState('pen'); // 'pen' | 'eraser'
  const lastPosRef = useRef({ x: 0, y: 0 });

  // Dynamic Classroom Chat State
  const [chatMessages, setChatMessages] = useState(() => [
    { 
      id: 1, 
      sender: effectiveTeacherName, 
      text: `Karibu ${effectiveStudentName.split(' ')[0]}! Welcome to our 1-on-1 virtual classroom. Our interactive whiteboard and audio sync are live!`, 
      time: 'Just now', 
      isTeacher: true 
    }
  ]);
  const [newMessage, setNewMessage] = useState('');

  // Canvas Ref for Whiteboard
  const canvasRef = useRef(null);
  const [ctx, setCtx] = useState(null);
  const channelRef = useRef(null);

  // Setup BroadcastChannel for Real-Time Cross-Window Synchronization
  useEffect(() => {
    let bc;
    try {
      bc = new BroadcastChannel(`somahome_room_${roomId}`);
      channelRef.current = bc;
      bc.onmessage = (event) => {
        const data = event.data;
        if (!data) return;

        if (data.type === 'draw_stroke' && canvasRef.current) {
          const c = canvasRef.current.getContext('2d');
          c.save();
          c.strokeStyle = data.color;
          c.lineWidth = data.width;
          c.lineCap = 'round';
          c.lineJoin = 'round';
          c.beginPath();
          c.moveTo(data.x0, data.y0);
          c.lineTo(data.x1, data.y1);
          c.stroke();
          c.restore();
        } else if (data.type === 'clear_canvas' && canvasRef.current) {
          const c = canvasRef.current.getContext('2d');
          c.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        } else if (data.type === 'chat_message') {
          setChatMessages((prev) => [...prev, data.message]);
        }
      };
    } catch (e) {
      console.warn('BroadcastChannel not supported in environment', e);
    }

    return () => {
      if (bc) bc.close();
    };
  }, [roomId]);

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

    lastPosRef.current = { x, y };
    ctx.strokeStyle = activeTool === 'eraser' ? '#0F172A' : activeColor;
    ctx.lineWidth = activeTool === 'eraser' ? 18 : brushSize;
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing || !ctx) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const strokeColor = activeTool === 'eraser' ? '#0F172A' : activeColor;
    const strokeWidth = activeTool === 'eraser' ? 18 : brushSize;

    ctx.lineTo(x, y);
    ctx.stroke();

    // Broadcast stroke in real-time
    if (channelRef.current) {
      channelRef.current.postMessage({
        type: 'draw_stroke',
        x0: lastPosRef.current.x,
        y0: lastPosRef.current.y,
        x1: x,
        y1: y,
        color: strokeColor,
        width: strokeWidth
      });
    }

    lastPosRef.current = { x, y };
  };

  const stopDrawing = () => {
    if (!ctx) return;
    ctx.closePath();
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    if (!ctx || !canvasRef.current) return;
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    if (channelRef.current) {
      channelRef.current.postMessage({ type: 'clear_canvas' });
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const msg = {
      id: Date.now(),
      sender: isTeacher ? effectiveTeacherName : `${effectiveStudentName.split(' ')[0]} (Student)`,
      text: newMessage.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isTeacher: isTeacher
    };

    setChatMessages((prev) => [...prev, msg]);
    if (channelRef.current) {
      channelRef.current.postMessage({ type: 'chat_message', message: msg });
    }
    setNewMessage('');
  };

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(5, 10, 15, 0.94)',
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
          maxWidth: '1100px',
          height: '92vh',
          maxHeight: '780px',
          background: 'linear-gradient(180deg, #0B111E 0%, #060911 100%)',
          border: '1.5px solid rgba(0, 166, 81, 0.4)',
          borderRadius: '24px',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8), 0 0 40px rgba(0, 166, 81, 0.15)',
          overflow: 'hidden'
        }}
      >
        {/* Classroom Header Bar */}
        <div style={{
          padding: '16px 24px',
          background: 'rgba(255, 255, 255, 0.02)',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(239, 68, 68, 0.2)',
              border: '1px solid rgba(239, 68, 68, 0.5)',
              color: '#EF4444',
              fontSize: '0.72rem',
              fontWeight: 800,
              padding: '4px 10px',
              borderRadius: '999px',
              animation: 'pulse 2s infinite'
            }}>
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#EF4444' }} />
              LIVE CLASSROOM
            </span>

            <div>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                {effectiveTitle}
              </h2>
              <div style={{ fontSize: '0.76rem', color: '#34D399', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>👨‍🏫 Lead: <strong>{effectiveTeacherName}</strong></span>
                <span>•</span>
                <span>👤 Student: <strong>{effectiveStudentName}</strong></span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span className="glass-pill" style={{ fontSize: '0.75rem', color: '#38BDF8', gap: '5px' }}>
              <ShieldCheck size={14} />
              <span>MoE Syllabus Verified</span>
            </span>

            <button
              onClick={onClose}
              className="btn-secondary"
              style={{ padding: '8px 14px', gap: '6px', color: '#F87171', borderColor: 'rgba(239, 68, 68, 0.3)' }}
            >
              <PhoneOff size={15} />
              <span>Leave Studio</span>
            </button>
          </div>
        </div>

        {/* Main Stage Grid (Video Feeds + Whiteboard / Chat) */}
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 340px', overflow: 'hidden' }}>
          
          {/* Left Canvas Area */}
          <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', overflow: 'hidden' }}>
            
            {/* Whiteboard Toolbar */}
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-subtle)',
              borderRadius: '14px', padding: '8px 16px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700 }}>Color:</span>
                {['#10b981', '#38bdf8', '#f59e0b', '#ef4444', '#ffffff'].map(col => (
                  <button
                    key={col}
                    onClick={() => { setActiveColor(col); setActiveTool('pen'); }}
                    style={{
                      width: '20px', height: '20px', borderRadius: '50%', background: col,
                      border: activeColor === col && activeTool === 'pen' ? '2px solid #fff' : '1px solid rgba(0,0,0,0.5)',
                      cursor: 'pointer', transform: activeColor === col && activeTool === 'pen' ? 'scale(1.2)' : 'scale(1)',
                      transition: 'transform 0.15s'
                    }}
                  />
                ))}

                <div style={{ width: '1px', height: '20px', background: 'var(--border-subtle)', margin: '0 4px' }} />

                <button
                  onClick={() => setActiveTool('pen')}
                  className={activeTool === 'pen' ? 'btn-primary' : 'btn-secondary'}
                  style={{ fontSize: '0.74rem', padding: '5px 10px', gap: '4px' }}
                >
                  <PenTool size={13} />
                  <span>Pen</span>
                </button>

                <button
                  onClick={() => setActiveTool('eraser')}
                  className={activeTool === 'eraser' ? 'btn-primary' : 'btn-secondary'}
                  style={{ fontSize: '0.74rem', padding: '5px 10px', gap: '4px' }}
                >
                  <Eraser size={13} />
                  <span>Eraser</span>
                </button>
              </div>

              <button
                onClick={clearCanvas}
                className="btn-secondary"
                style={{ fontSize: '0.74rem', padding: '5px 10px', gap: '4px', color: '#EF4444' }}
              >
                <Trash2 size={13} />
                <span>Clear Canvas</span>
              </button>
            </div>

            {/* Interactive Canvas */}
            <div 
              style={{
                flex: 1,
                background: '#0F172A',
                border: '1.5px dashed rgba(255, 255, 255, 0.12)',
                borderRadius: '16px',
                position: 'relative',
                overflow: 'hidden',
                cursor: activeTool === 'eraser' ? 'cell' : 'crosshair'
              }}
            >
              <canvas
                ref={canvasRef}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                style={{ display: 'block', width: '100%', height: '100%' }}
              />
            </div>

            {/* Bottom Audio/Video Control Bar */}
            <div style={{
              display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '14px',
              padding: '6px'
            }}>
              <button
                onClick={() => setMicOn(!micOn)}
                style={{
                  background: micOn ? 'rgba(0, 166, 81, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                  border: `1px solid ${micOn ? 'rgba(0, 166, 81, 0.4)' : 'rgba(239, 68, 68, 0.4)'}`,
                  color: micOn ? '#34D399' : '#F87171',
                  borderRadius: '12px', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '6px',
                  fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer'
                }}
              >
                {micOn ? <Mic size={16} /> : <MicOff size={16} />}
                <span>{micOn ? 'Mic On' : 'Muted'}</span>
              </button>

              <button
                onClick={() => setVideoOn(!videoOn)}
                style={{
                  background: videoOn ? 'rgba(0, 166, 81, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                  border: `1px solid ${videoOn ? 'rgba(0, 166, 81, 0.4)' : 'rgba(239, 68, 68, 0.4)'}`,
                  color: videoOn ? '#34D399' : '#F87171',
                  borderRadius: '12px', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '6px',
                  fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer'
                }}
              >
                {videoOn ? <Video size={16} /> : <VideoOff size={16} />}
                <span>{videoOn ? 'Cam On' : 'Cam Off'}</span>
              </button>

              <button
                onClick={() => setHandRaised(!handRaised)}
                style={{
                  background: handRaised ? 'rgba(245, 158, 11, 0.25)' : 'rgba(255, 255, 255, 0.05)',
                  border: `1px solid ${handRaised ? '#F59E0B' : 'var(--border-subtle)'}`,
                  color: handRaised ? '#F59E0B' : 'var(--text-secondary)',
                  borderRadius: '12px', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '6px',
                  fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer'
                }}
              >
                <Hand size={16} />
                <span>{handRaised ? 'Hand Raised ✋' : 'Raise Hand'}</span>
              </button>
            </div>

          </div>

          {/* Right Sidebar: Video Feeds & Live Chat */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.02)',
            borderLeft: '1px solid var(--border-subtle)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}>
            
            {/* Top Video Stage (Teacher & Student) */}
            <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px', borderBottom: '1px solid var(--border-subtle)' }}>
              
              {/* Teacher Video Card */}
              <div style={{
                position: 'relative', height: '125px', borderRadius: '14px', overflow: 'hidden',
                background: '#0F172A', border: '1px solid rgba(0, 166, 81, 0.3)'
              }}>
                <img
                  src={effectiveTeacherAvatar}
                  alt={effectiveTeacherName}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{
                  position: 'absolute', bottom: '6px', left: '8px',
                  background: 'rgba(0,0,0,0.6)', padding: '2px 8px', borderRadius: '6px',
                  fontSize: '0.72rem', color: '#fff', fontWeight: 700
                }}>
                  👨‍🏫 {effectiveTeacherName} (Lead)
                </div>
              </div>

              {/* Student Video Card */}
              <div style={{
                position: 'relative', height: '125px', borderRadius: '14px', overflow: 'hidden',
                background: '#0F172A', border: '1px solid rgba(56, 189, 248, 0.3)'
              }}>
                <img
                  src="https://images.unsplash.com/photo-1543332164-6e82f355badc?w=400"
                  alt={effectiveStudentName}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{
                  position: 'absolute', bottom: '6px', left: '8px',
                  background: 'rgba(0,0,0,0.6)', padding: '2px 8px', borderRadius: '6px',
                  fontSize: '0.72rem', color: '#fff', fontWeight: 700
                }}>
                  👦 {effectiveStudentName} (Learner)
                </div>
              </div>

            </div>

            {/* In-Session Live Chat Stream */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--border-subtle)', fontSize: '0.76rem', color: '#34D399', fontWeight: 800, textTransform: 'uppercase' }}>
                💬 Live Lesson Chat (Real-Time Sync)
              </div>

              <div style={{ flex: 1, overflowY: 'auto', padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {chatMessages.map((msg) => (
                  <div
                    key={msg.id}
                    style={{
                      background: msg.isTeacher ? 'rgba(0, 166, 81, 0.12)' : 'rgba(56, 189, 248, 0.12)',
                      border: `1px solid ${msg.isTeacher ? 'rgba(0, 166, 81, 0.3)' : 'rgba(56, 189, 248, 0.3)'}`,
                      borderRadius: '10px',
                      padding: '8px 10px',
                      fontSize: '0.78rem'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px', fontSize: '0.7rem' }}>
                      <strong style={{ color: msg.isTeacher ? '#34D399' : '#38BDF8' }}>{msg.sender}</strong>
                      <span style={{ color: 'var(--text-muted)' }}>{msg.time}</span>
                    </div>
                    <div style={{ color: '#F8FAFC' }}>{msg.text}</div>
                  </div>
                ))}
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSendMessage} style={{ padding: '10px', borderTop: '1px solid var(--border-subtle)', display: 'flex', gap: '6px' }}>
                <input
                  type="text"
                  placeholder="Ask a question or type math formula..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  style={{
                    flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-card)',
                    borderRadius: '8px', padding: '8px 10px', color: '#fff', fontSize: '0.8rem'
                  }}
                />
                <button type="submit" className="btn-primary" style={{ padding: '8px 12px' }}>
                  <Send size={14} />
                </button>
              </form>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
