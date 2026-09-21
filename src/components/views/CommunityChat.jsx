import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, Users, MessageSquare, ShieldCheck, MapPin, CheckCheck, UserCheck, 
  Sparkles, AlertCircle, Lock, Plus, Compass, ChevronRight, CheckCircle2, X 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

// Available Nairobi Estate STEM & Learning Pods that parents can discover and join
const ALL_STEM_HUBS = [
  {
    id: 'kilimani',
    title: 'Kilimani STEM Hub Channel',
    subtitle: 'Wood Avenue • 5 Families • CBC & Cambridge',
    badge: 'STEM Hub',
    type: 'pod',
    estate: 'Kilimani',
    familiesCount: 5,
    leadTutor: 'Teacher Mercy Wanjiku',
    focus: 'LEGO Robotics, CBC Kitchen Science Kits & Practical Fractions',
    welcomeMsg: 'Karibu to the Kilimani STEM Hub! We meet every Thursday at Wood Avenue Court 4B for hands-on lab experiments.'
  },
  {
    id: 'karen_eco',
    title: 'Karen Eco-Explorers & Nature Lab',
    subtitle: 'Langata Road • 6 Families • Environmental Science',
    badge: 'Eco Hub',
    type: 'pod',
    estate: 'Karen',
    familiesCount: 6,
    leadTutor: 'Teacher Sarah Mwangi',
    focus: 'Permaculture Gardening, Bird Ringing & Microscopic Biology',
    welcomeMsg: 'Jambo! Welcome to Karen Eco-Explorers. Don\'t forget your gumboots for Saturday\'s soil pH testing.'
  },
  {
    id: 'westlands_code',
    title: 'Westlands Junior Coding & Robotics Pod',
    subtitle: 'Raphta Road • 4 Families • Coding & AI Basics',
    badge: 'Code Pod',
    type: 'pod',
    estate: 'Westlands',
    familiesCount: 4,
    leadTutor: 'Teacher Brian Kimani',
    focus: 'Scratch 3.0, Micro:bit Sensors & Python Turtle Quests',
    welcomeMsg: 'Welcome to Westlands Coding! Laptops are needed for Friday afternoon\'s robotics obstacle course.'
  },
  {
    id: 'syokimau',
    title: 'Syokimau CBC Permaculture Pod',
    subtitle: 'Mombasa Road • 4 Families • CBC Agriculture',
    badge: 'CBC Pod',
    type: 'pod',
    estate: 'Syokimau',
    familiesCount: 4,
    leadTutor: 'Mwalimu Kevin Mwangi',
    focus: 'Indigenous Crop Composting, Weather Instruments & Kiswahili',
    welcomeMsg: 'Habari za Syokimau! Our organic seedling nursery is flourishing. Feel free to ask questions here.'
  },
  {
    id: 'lavington_cambridge',
    title: 'Lavington Cambridge Primary Study Club',
    subtitle: 'James Gichuru • 5 Families • Stage 4/5 Checkpoint',
    badge: 'Cambridge Pod',
    type: 'pod',
    estate: 'Lavington',
    familiesCount: 5,
    leadTutor: 'Teacher Mercy Wanjiku',
    focus: 'Checkpoint Exam Strategy, Creative Writing & Mental Math',
    welcomeMsg: 'Welcome to Lavington Study Club! Revision papers for Stage 4 will be shared every Tuesday evening.'
  }
];

// Verified Teachers available for direct 1-on-1 chats
const ALL_VERIFIED_TEACHERS = [
  {
    id: 'direct_steve',
    tutorName: 'Teacher Mercy Wanjiku',
    role: 'Grade 4 CBC Specialist & Science Lead',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    tsc_number: 'TSC-881294',
    badge: 'Lead Educator',
    greeting: "Habari! I am Teacher Mercy. How is Liam doing with his science projects and fractions this week?"
  },
  {
    id: 'direct_brian',
    tutorName: 'Teacher Brian Kimani',
    role: 'Robotics & Cambridge Physics Specialist',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    tsc_number: 'TSC-772190',
    badge: 'Robotics Specialist',
    greeting: "Hello! Teacher Brian here. Looking forward to exploring robotics, sensors, and coding with your child."
  },
  {
    id: 'direct_sarah',
    tutorName: 'Teacher Sarah Mwangi',
    role: 'Early Years, Phonics & Literacy Lead',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    tsc_number: 'TSC-994120',
    badge: 'Literacy Specialist',
    greeting: "Jambo! Teacher Sarah here. I specialize in phonics, guided reading fluency, and handwriting confidence."
  },
  {
    id: 'direct_kevin',
    tutorName: 'Mwalimu Kevin Mwangi',
    role: 'Creative Arts & Kiswahili Lugha Specialist',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    tsc_number: 'TSC-661902',
    badge: 'Kiswahili Lead',
    greeting: "Habari za mchana! Mwalimu Kevin hapa. Tuko tayari kuboresha sarufi na hadithi za kuvutia."
  }
];

const DEFAULT_THREADS = {
  direct_steve: [
    {
      id: 1,
      senderId: 'mercy_tutor',
      senderName: 'Teacher Mercy Wanjiku',
      senderRole: 'tutor',
      text: "Habari Steve! I reviewed Liam's mechanical water filter project on his portfolio. He achieved Level 4 (EE). Truly exceptional work.",
      time: '09:15 AM'
    },
    {
      id: 2,
      senderId: 'steve_parent',
      senderName: 'Steve Kariuki (Parent)',
      senderRole: 'parent',
      text: "Thank you Teacher Mercy! He really enjoyed assembling the layers with the jiko charcoal. Will you be visiting for tomorrow's fractions lesson?",
      time: '09:20 AM'
    }
  ],
  kilimani: [
    {
      id: 1,
      senderId: 'amina_parent',
      senderName: 'Dr. Amina Patel',
      senderRole: 'parent',
      text: 'Hi Kilimani pod! The Lego robotics kits have arrived for Thursday STEM session.',
      time: 'Yesterday'
    },
    {
      id: 2,
      senderId: 'steve_parent',
      senderName: 'Steve Kariuki (Parent)',
      senderRole: 'parent',
      text: 'Awesome! Liam is excited. Should we bring our laptops or tablets?',
      time: 'Yesterday'
    }
  ]
};

export default function CommunityChat() {
  const { currentUser } = useAuth();
  const isTeacher = currentUser?.role === 'tutor';
  const isParent = currentUser?.role === 'parent';
  const isStudent = currentUser?.role === 'student';

  // Load joined hubs from localStorage
  const [joinedHubIds, setJoinedHubIds] = useState(() => {
    try {
      const saved = localStorage.getItem('somahome_parent_joined_hubs_v1');
      return saved ? JSON.parse(saved) : ['kilimani'];
    } catch {
      return ['kilimani'];
    }
  });

  // Load active direct teacher chats from localStorage
  const [activeDirectTeacherIds, setActiveDirectTeacherIds] = useState(() => {
    try {
      const saved = localStorage.getItem('somahome_parent_active_tutors_chat_v1');
      return saved ? JSON.parse(saved) : ['direct_steve'];
    } catch {
      return ['direct_steve'];
    }
  });

  // Load persistent message threads from localStorage
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('somahome_chat_threads_v5');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return DEFAULT_THREADS;
  });

  // Modals for joining hub & messaging teacher
  const [isJoinHubModalOpen, setIsJoinHubModalOpen] = useState(false);
  const [isMessageTeacherModalOpen, setIsMessageTeacherModalOpen] = useState(false);

  // Compute channels dynamically
  const buildChannelList = () => {
    const channels = [];

    // 1. Direct Teacher Threads
    if (isTeacher) {
      channels.push({
        id: 'direct_steve',
        title: 'Steve Kariuki (Liam - Grade 4 CBC)',
        subtitle: 'Parent • Wood Ave, Kilimani',
        badge: '1-on-1 Direct',
        type: 'direct'
      });
      channels.push({
        id: 'direct_amina',
        title: 'Dr. Amina Patel (Aiden - Cambridge)',
        subtitle: 'Parent • Riverside Drive',
        badge: '1-on-1 Direct',
        type: 'direct'
      });
    } else {
      activeDirectTeacherIds.forEach(id => {
        const tutor = ALL_VERIFIED_TEACHERS.find(t => t.id === id);
        if (tutor) {
          channels.push({
            id: tutor.id,
            title: tutor.tutorName,
            subtitle: `${tutor.role} • ${tutor.tsc_number}`,
            badge: tutor.badge,
            type: 'direct'
          });
        }
      });
    }

    // 2. Joined STEM Hubs & Pods
    joinedHubIds.forEach(hubId => {
      const hub = ALL_STEM_HUBS.find(h => h.id === hubId);
      if (hub) {
        channels.push({
          id: hub.id,
          title: hub.title,
          subtitle: hub.subtitle,
          badge: hub.badge,
          type: 'pod'
        });
      }
    });

    return channels.length > 0 ? channels : [
      {
        id: 'kilimani',
        title: 'Kilimani STEM Hub Channel',
        subtitle: 'Wood Avenue • 5 Families',
        badge: 'STEM Hub',
        type: 'pod'
      }
    ];
  };

  const channelList = buildChannelList();
  const [activeChannel, setActiveChannel] = useState(channelList[0]?.id || 'kilimani');
  const [inputMsg, setInputMsg] = useState('');
  const messagesEndRef = useRef(null);

  // Handle incoming target teacher navigation from Marketplace (e.g. user clicked "Message Teacher")
  useEffect(() => {
    const targetChat = localStorage.getItem('somahome_target_chat_teacher');
    if (targetChat) {
      if (!activeDirectTeacherIds.includes(targetChat)) {
        const updated = [...activeDirectTeacherIds, targetChat];
        setActiveDirectTeacherIds(updated);
        localStorage.setItem('somahome_parent_active_tutors_chat_v1', JSON.stringify(updated));
      }
      setActiveChannel(targetChat);
      localStorage.removeItem('somahome_target_chat_teacher');
    }
  }, []);

  // Sync activeChannel if invalid
  useEffect(() => {
    if (!channelList.some(c => c.id === activeChannel)) {
      setActiveChannel(channelList[0]?.id || 'kilimani');
    }
  }, [channelList.length, currentUser?.role]);

  // Save state to localStorage
  useEffect(() => {
    localStorage.setItem('somahome_chat_threads_v5', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('somahome_parent_joined_hubs_v1', JSON.stringify(joinedHubIds));
  }, [joinedHubIds]);

  useEffect(() => {
    localStorage.setItem('somahome_parent_active_tutors_chat_v1', JSON.stringify(activeDirectTeacherIds));
  }, [activeDirectTeacherIds]);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, activeChannel]);

  // Handle join a new area hub
  const handleJoinHub = (hub) => {
    if (!joinedHubIds.includes(hub.id)) {
      const updatedHubs = [...joinedHubIds, hub.id];
      setJoinedHubIds(updatedHubs);

      // Add a welcome announcement to that channel if empty
      if (!messages[hub.id]) {
        setMessages(prev => ({
          ...prev,
          [hub.id]: [
            {
              id: Date.now(),
              senderId: 'system',
              senderName: `${hub.leadTutor} (Hub Lead)`,
              senderRole: 'tutor',
              text: hub.welcomeMsg,
              time: 'Just now'
            }
          ]
        }));
      }
    }
    setActiveChannel(hub.id);
    setIsJoinHubModalOpen(false);
  };

  // Handle start talking to a new teacher
  const handleStartChatWithTeacher = (teacher) => {
    if (!activeDirectTeacherIds.includes(teacher.id)) {
      const updatedTutors = [...activeDirectTeacherIds, teacher.id];
      setActiveDirectTeacherIds(updatedTutors);

      // Pre-populate with initial greeting if no messages
      if (!messages[teacher.id]) {
        setMessages(prev => ({
          ...prev,
          [teacher.id]: [
            {
              id: Date.now(),
              senderId: teacher.id,
              senderName: teacher.tutorName,
              senderRole: 'tutor',
              text: teacher.greeting,
              time: 'Just now'
            }
          ]
        }));
      }
    }
    setActiveChannel(teacher.id);
    setIsMessageTeacherModalOpen(false);
  };

  // Handle manual message send
  const handleSend = (e) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;

    const newMsg = {
      id: Date.now(),
      senderId: currentUser?.id || currentUser?.role || 'user',
      senderName: currentUser?.name || (isTeacher ? 'Teacher Mercy Wanjiku' : 'Steve Kariuki (Parent)'),
      senderRole: currentUser?.role || 'parent',
      text: inputMsg.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => ({
      ...prev,
      [activeChannel]: [...(prev[activeChannel] || []), newMsg]
    }));

    setInputMsg('');
  };

  const activeChannelMeta = channelList.find((c) => c.id === activeChannel) || channelList[0] || {};

  return (
    <div style={{ maxWidth: '100%', margin: '0 auto' }}>
      
      {/* Top Banner: Status & Privacy Guarantees */}
      <div style={{
        background: isTeacher ? 'rgba(0, 166, 81, 0.12)' : 'rgba(56, 189, 248, 0.1)',
        border: isTeacher ? '1px solid rgba(0, 166, 81, 0.3)' : '1px solid rgba(56, 189, 248, 0.3)',
        borderRadius: '14px',
        padding: '14px 20px',
        marginBottom: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: isTeacher ? '#00A651' : '#0284C7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            color: '#FFF',
            fontSize: '0.9rem'
          }}>
            {isTeacher ? 'MW' : 'SK'}
          </div>
          <div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 800 }}>
              Live Authenticated Messaging
            </div>
            <div style={{ fontSize: '1rem', fontWeight: 800, color: '#F8FAFC' }}>
              Connected as: <span style={{ color: isTeacher ? '#34D399' : '#38BDF8' }}>{currentUser?.name || (isTeacher ? 'Teacher Mercy Wanjiku' : 'Steve Kariuki')}</span>
              <span className="glass-pill" style={{ marginLeft: '8px', fontSize: '0.68rem' }}>
                {isTeacher ? '👨‍🏫 Facilitator Account' : '👨‍👧 Parent Account'}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons: Join Hub & Message Teacher */}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          {isParent && (
            <>
              <button
                onClick={() => setIsJoinHubModalOpen(true)}
                className="btn-secondary"
                style={{ fontSize: '0.78rem', padding: '7px 14px', gap: '6px' }}
              >
                <Compass size={14} color="#38BDF8" />
                <span>🌐 Join Area STEM Hub</span>
              </button>

              <button
                onClick={() => setIsMessageTeacherModalOpen(true)}
                className="btn-primary"
                style={{ fontSize: '0.78rem', padding: '7px 14px', gap: '6px' }}
              >
                <Plus size={14} />
                <span>💬 Talk to a Teacher</span>
              </button>
            </>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            <Lock size={13} color="#10B981" />
            <span>Encrypted In-App Chat</span>
          </div>
        </div>
      </div>

      {/* Main Chat Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(240px, 280px) 1fr', gap: '16px', height: '70vh', minHeight: '480px' }}>
        
        {/* LEFT COLUMN: Channels & Conversations */}
        <div className="glass-panel" style={{ padding: '18px', display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h3 style={{ fontSize: '1rem', margin: 0, fontWeight: 800 }}>
              {isTeacher ? 'Teacher Inquiries & Pods' : 'My Pods & Facilitators'}
            </h3>
            <span className="glass-pill" style={{ fontSize: '0.68rem', color: '#10B981' }}>
              🟢 Online
            </span>
          </div>

          {/* Channel Selector */}
          <div style={{ marginBottom: '12px' }}>
            <select
              className="custom-select"
              value={activeChannel}
              onChange={(e) => setActiveChannel(e.target.value)}
              style={{ width: '100%', fontSize: '0.82rem', padding: '6px 28px 6px 8px' }}
            >
              {channelList.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.type === 'direct' ? '💬 ' : '🏡 '} {c.title}
                </option>
              ))}
            </select>
          </div>

          {/* Channel Cards Scroll Area */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1, overflowY: 'auto', paddingRight: '4px' }}>
            {channelList.map((c) => {
              const isSelected = activeChannel === c.id;
              const channelMsgs = messages[c.id] || [];
              const lastMsg = channelMsgs[channelMsgs.length - 1];

              return (
                <div
                  key={c.id}
                  onClick={() => setActiveChannel(c.id)}
                  style={{
                    background: isSelected ? 'rgba(0,166,81,0.18)' : 'rgba(255,255,255,0.03)',
                    border: isSelected ? '1.5px solid #00A651' : '1px solid var(--border-subtle)',
                    borderRadius: '10px',
                    padding: '10px 12px',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: isSelected ? '#34D399' : 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {c.title}
                    </div>
                    <span className="glass-pill" style={{ fontSize: '0.62rem', flexShrink: 0 }}>{c.badge}</span>
                  </div>

                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {c.subtitle}
                  </div>

                  {lastMsg && (
                    <div style={{
                      fontSize: '0.7rem',
                      color: 'var(--text-secondary)',
                      marginTop: '6px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      <strong>{lastMsg.senderName.split(' ')[0]}:</strong> {lastMsg.text}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Quick Action Footer in Sidebar */}
          {isParent && (
            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '12px', marginTop: '10px', display: 'flex', gap: '8px' }}>
              <button
                onClick={() => setIsJoinHubModalOpen(true)}
                className="btn-secondary"
                style={{ flex: 1, fontSize: '0.72rem', padding: '6px', justifyContent: 'center' }}
              >
                + Join Pod
              </button>
              <button
                onClick={() => setIsMessageTeacherModalOpen(true)}
                className="btn-secondary"
                style={{ flex: 1, fontSize: '0.72rem', padding: '6px', justifyContent: 'center', color: '#34D399' }}
              >
                + New Chat
              </button>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Active Chat Feed */}
        <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', height: '100%' }}>
          
          {/* Channel Header */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid var(--border-subtle)',
            paddingBottom: '12px',
            marginBottom: '14px'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#F8FAFC' }}>
                  {activeChannelMeta.title}
                </h3>
                <span className="glass-pill" style={{ color: '#38BDF8', fontSize: '0.68rem' }}>
                  {activeChannelMeta.badge || 'Active'}
                </span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                {activeChannelMeta.subtitle}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="glass-pill" style={{ fontSize: '0.7rem', color: '#10B981' }}>
                🛡️ Verified SomaHome Members
              </span>
            </div>
          </div>

          {/* Messages Stream */}
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '14px', paddingRight: '6px' }}>
            {(messages[activeChannel] || []).length === 0 ? (
              <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
                <MessageSquare size={32} style={{ opacity: 0.3, marginBottom: '8px' }} />
                <p style={{ margin: 0, fontSize: '0.85rem' }}>No messages yet in this conversation.</p>
                <p style={{ margin: '4px 0 0 0', fontSize: '0.75rem' }}>Send a message below to start talking!</p>
              </div>
            ) : (
              (messages[activeChannel] || []).map((msg) => {
                const isMe = (msg.senderRole === 'parent' && isParent) || (msg.senderRole === 'tutor' && isTeacher);

                return (
                  <div
                    key={msg.id}
                    style={{
                      alignSelf: isMe ? 'flex-end' : 'flex-start',
                      maxWidth: '75%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: isMe ? 'flex-end' : 'flex-start'
                    }}
                  >
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '3px', display: 'flex', gap: '6px', alignItems: 'center' }}>
                      <span style={{ fontWeight: 700, color: isMe ? '#38BDF8' : '#34D399' }}>{msg.senderName}</span>
                      <span>•</span>
                      <span>{msg.time}</span>
                    </div>

                    <div style={{
                      background: isMe ? 'linear-gradient(135deg, #0284C7 0%, #0369A1 100%)' : 'rgba(255, 255, 255, 0.06)',
                      color: '#F8FAFC',
                      padding: '10px 14px',
                      borderRadius: isMe ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
                      border: isMe ? 'none' : '1px solid var(--border-subtle)',
                      fontSize: '0.86rem',
                      lineHeight: 1.45,
                      boxShadow: isMe ? '0 4px 12px rgba(2,132,199,0.25)' : 'none'
                    }}>
                      {msg.text}
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Helper */}
          <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', padding: '10px 0', borderTop: '1px solid var(--border-subtle)', marginTop: '8px' }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', alignSelf: 'center', whiteSpace: 'nowrap' }}>Quick Prompt:</span>
            {[
              "Hello! Can we schedule a trial lesson?",
              "What materials are needed for this Thursday's lab?",
              "Can you share feedback on Liam's latest homework?"
            ].map((p, idx) => (
              <button
                key={idx}
                onClick={() => setInputMsg(p)}
                className="glass-pill"
                style={{ fontSize: '0.68rem', cursor: 'pointer', whiteSpace: 'nowrap', border: '1px solid rgba(255,255,255,0.1)' }}
              >
                {p}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <form onSubmit={handleSend} style={{ display: 'flex', gap: '10px' }}>
            <input
              type="text"
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              placeholder={`Write message to ${activeChannelMeta.title}...`}
              style={{
                flex: 1,
                background: 'rgba(0, 0, 0, 0.4)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '10px',
                padding: '10px 14px',
                color: '#F8FAFC',
                fontSize: '0.85rem'
              }}
            />
            <button
              type="submit"
              className="btn-primary"
              style={{ padding: '0 20px', gap: '8px' }}
            >
              <Send size={15} />
              <span>Send</span>
            </button>
          </form>

        </div>
      </div>

      {/* MODAL 1: BROWSE & JOIN AREA STEM HUBS */}
      {isJoinHubModalOpen && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.82)', backdropFilter: 'blur(10px)',
          zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
        }}
        onClick={() => setIsJoinHubModalOpen(false)}
        >
          <div style={{
            background: '#0E1524', border: '1px solid var(--border-subtle)', borderRadius: '20px',
            width: '100%', maxWidth: '680px', maxHeight: '85vh', overflowY: 'auto', padding: '26px'
          }}
          onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '14px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#F8FAFC', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Compass size={20} color="#38BDF8" />
                  <span>Discover & Join Area STEM Hubs</span>
                </h3>
                <p style={{ margin: '4px 0 0 0', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Connect with homeschool parent pods and local lead facilitators in your estate
                </p>
              </div>
              <button 
                onClick={() => setIsJoinHubModalOpen(false)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '1.2rem', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {ALL_STEM_HUBS.map(hub => {
                const isJoined = joinedHubIds.includes(hub.id);
                return (
                  <div 
                    key={hub.id}
                    style={{
                      background: isJoined ? 'rgba(0, 166, 81, 0.08)' : 'rgba(255, 255, 255, 0.02)',
                      border: isJoined ? '1.5px solid #00A651' : '1px solid var(--border-subtle)',
                      borderRadius: '14px',
                      padding: '16px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: '16px',
                      flexWrap: 'wrap'
                    }}
                  >
                    <div style={{ flex: 1, minWidth: '240px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <h4 style={{ margin: 0, fontSize: '0.98rem', color: '#F8FAFC' }}>{hub.title}</h4>
                        <span className="glass-pill" style={{ fontSize: '0.65rem' }}>{hub.estate}</span>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                        🔬 Focus: <strong>{hub.focus}</strong>
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        👨‍🏫 Lead Facilitator: <strong>{hub.leadTutor}</strong> • 👥 {hub.familiesCount} Registered Families
                      </div>
                    </div>

                    <div>
                      {isJoined ? (
                        <button
                          onClick={() => {
                            setActiveChannel(hub.id);
                            setIsJoinHubModalOpen(false);
                          }}
                          className="btn-secondary"
                          style={{ fontSize: '0.78rem', padding: '6px 14px', color: '#34D399' }}
                        >
                          ✓ Joined (Open Chat)
                        </button>
                      ) : (
                        <button
                          onClick={() => handleJoinHub(hub)}
                          className="btn-primary"
                          style={{ fontSize: '0.78rem', padding: '6px 16px', gap: '6px' }}
                        >
                          <Plus size={14} />
                          <span>Join Hub</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: MESSAGE A VERIFIED TEACHER */}
      {isMessageTeacherModalOpen && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.82)', backdropFilter: 'blur(10px)',
          zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
        }}
        onClick={() => setIsMessageTeacherModalOpen(false)}
        >
          <div style={{
            background: '#0E1524', border: '1px solid var(--border-subtle)', borderRadius: '20px',
            width: '100%', maxWidth: '620px', maxHeight: '85vh', overflowY: 'auto', padding: '26px'
          }}
          onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '14px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#F8FAFC', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Users size={20} color="#10B981" />
                  <span>Start 1-on-1 Chat with a Verified Educator</span>
                </h3>
                <p style={{ margin: '4px 0 0 0', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  All educators are TSC registered with biometric DCI police clearance
                </p>
              </div>
              <button 
                onClick={() => setIsMessageTeacherModalOpen(false)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '1.2rem', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {ALL_VERIFIED_TEACHERS.map(teacher => {
                const hasChat = activeDirectTeacherIds.includes(teacher.id);
                return (
                  <div
                    key={teacher.id}
                    style={{
                      background: 'rgba(255,255,255,0.02)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '14px',
                      padding: '14px 16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '14px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <img
                        src={teacher.avatar}
                        alt={teacher.tutorName}
                        style={{ width: '48px', height: '48px', borderRadius: '12px', objectFit: 'cover' }}
                      />
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '0.92rem', fontWeight: 700, color: '#F8FAFC' }}>
                            {teacher.tutorName}
                          </span>
                          <span className="glass-pill" style={{ fontSize: '0.62rem', color: '#10B981' }}>
                            {teacher.tsc_number}
                          </span>
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                          {teacher.role}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleStartChatWithTeacher(teacher)}
                      className="btn-primary"
                      style={{ fontSize: '0.76rem', padding: '6px 14px', gap: '6px', whiteSpace: 'nowrap' }}
                    >
                      <MessageSquare size={13} />
                      <span>{hasChat ? 'Resume Chat' : 'Start Chat'}</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
