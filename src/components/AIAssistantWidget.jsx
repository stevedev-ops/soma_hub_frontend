import React, { useState, useEffect, useRef } from 'react';
import { 
  X, Send, Bot, User, Sparkles, RefreshCw,
  WifiOff, MessageCircle
} from 'lucide-react';
import { api } from '../services/api';

export default function AIAssistantWidget({ currentUser, activeStudent, onOpenLogin }) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [sessionId, setSessionId] = useState('');
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const messagesEndRef = useRef(null);

  const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || '254700000000';

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    let currentSession = localStorage.getItem('somahome_chat_session_id');
    if (!currentSession) {
      currentSession = 'sess_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now();
      localStorage.setItem('somahome_chat_session_id', currentSession);
    }
    setSessionId(currentSession);

    if (messages.length === 0) {
      if (currentUser) {
        const userName = currentUser.first_name || currentUser.name || currentUser.username || 'Parent';
        setMessages([
          {
            id: 'init-1',
            sender: 'BOT',
            text: `?? Jambo **${userName}**! I am **SomaBot**, your AI Homeschool Assistant.\n\nI can help you check your learner's progress, review today's lessons, examine project rubric scores, or assist with curriculum questions.\n\nHow can I help you today?`,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            metadata: { is_greeting: true }
          }
        ]);
      } else {
        setMessages([
          {
            id: 'init-1',
            sender: 'BOT',
            text: `?? Jambo & Karibu to **SomaHome Kenya**!\n\nI'm **SomaBot**, your AI Homeschool Guide. Ask me anything about:\n? **CBC & Cambridge term packages**\n? **Pricing (KES 3,500/term) & M-Pesa checkout**\n? **Homeschooling legal compliance & KNEC**\n? **Finding verified tutors in Nairobi**\n\nHow can I support your homeschooling journey?`,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            metadata: { is_greeting: true }
          }
        ]);
      }
    }
  }, [currentUser]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isLoading]);

  const handleSendMessage = async (customText = null) => {
    const textToSend = (customText || inputMessage).trim();
    if (!textToSend || isLoading) return;

    const userMsgObj = {
      id: 'msg_' + Date.now(),
      sender: 'USER',
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsgObj]);
    setInputMessage('');
    setIsLoading(true);

    if (!navigator.onLine) {
      setTimeout(() => {
        setMessages(prev => [
          ...prev,
          {
            id: 'bot_offline_' + Date.now(),
            sender: 'BOT',
            text: `?? **You appear to be offline.**\n\nYour inquiry has been cached. You can tap the **WhatsApp** button above to send this directly to our team via SMS / WhatsApp.`,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            metadata: { offline: true }
          }
        ]);
        setIsLoading(false);
      }, 500);
      return;
    }

    try {
      let data;
      if (currentUser) {
        const studentId = typeof activeStudent === 'object' ? activeStudent?.id : activeStudent;
        data = await api.sendAuthChatMessage(textToSend, sessionId, studentId, currentUser.email);
      } else {
        data = await api.sendPublicChatMessage(textToSend, sessionId, 'Guest Visitor');
      }

      const botReply = data?.response || "I'm having trouble retrieving that information right now. Please try again shortly.";
      
      const botMsgObj = {
        id: 'bot_' + Date.now(),
        sender: 'BOT',
        text: botReply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        metadata: data?.metadata || {}
      };

      setMessages(prev => [...prev, botMsgObj]);
    } catch (e) {
      setMessages(prev => [
        ...prev,
        {
          id: 'bot_err_' + Date.now(),
          sender: 'BOT',
          text: "?? Server temporarily unreachable. You can continue this conversation with our team directly on WhatsApp!",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    const newSession = 'sess_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now();
    localStorage.setItem('somahome_chat_session_id', newSession);
    setSessionId(newSession);
    setMessages([
      {
        id: 'init_reset',
        sender: 'BOT',
        text: currentUser 
          ? `Conversation restarted. How can I assist your homeschool today, **${currentUser.first_name || 'Parent'}**?`
          : "Conversation restarted. What would you like to know about SomaHome homeschooling?",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  const getWhatsAppLink = () => {
    const lastUserMsg = [...messages].reverse().find(m => m.sender === 'USER')?.text || 'Homeschool Information';
    const userLabel = currentUser ? (currentUser.first_name || currentUser.username) : 'Prospective Parent';
    const message = encodeURIComponent(
      `Hello SomaHome Team, I was chatting with SomaBot on the platform (${userLabel}).\n\nTopic: "${lastUserMsg}"\n\nPlease assist me further.`
    );
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
  };

  const quickPrompts = currentUser ? [
    { label: "?? Child progress", query: "Check my student's activity, completed lessons, and project rubric scores" },
    { label: "?? Today's plan", query: "What lessons and activities are scheduled for today?" },
    { label: "?? M-Pesa Term Fees", query: "How much are the term packages and how do I renew via M-Pesa?" },
    { label: "?? Legal & KNEC Info", query: "How do I register my child for KNEC assessments or Cambridge exams as a homeschooler?" }
  ] : [
    { label: "?? Pricing & M-Pesa", query: "How much does SomaHome cost per term and how do I pay with M-Pesa?" },
    { label: "???? CBC Guide", query: "How does the Kenya CBC curriculum work on SomaHome from Grade 1 to 9?" },
    { label: "???? Cambridge Option", query: "Do you support British Cambridge curriculum and IGCSE preparation?" },
    { label: "?? Legality in Kenya", query: "Is homeschooling legal in Kenya and how does Ministry of Education compliance work?" },
    { label: "????? Hire Tutors", query: "How do I find a private home tutor or join a learning pod in Nairobi?" }
  ];

  return (
    <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 99999, fontFamily: 'var(--font-body, system-ui, sans-serif)' }}>
      {/* Closed Floating Launcher Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            background: 'linear-gradient(135deg, #00A651 0%, #059669 100%)',
            border: '1px solid rgba(255, 255, 255, 0.25)',
            borderRadius: '9999px',
            padding: '10px 18px 10px 12px',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            cursor: 'pointer',
            boxShadow: '0 10px 30px rgba(0, 166, 81, 0.4), 0 0 20px rgba(0, 166, 81, 0.25)',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease'
          }}
        >
          <div style={{ position: 'relative', width: '38px', height: '38px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Bot size={22} color="#FFFFFF" />
            <span style={{
              position: 'absolute', top: '-2px', right: '-2px', width: '12px', height: '12px',
              borderRadius: '50%', background: '#F59E0B', border: '2px solid #00A651'
            }}></span>
          </div>

          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#D1FAE5', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Sparkles size={11} color="#FBBF24" />
              SomaBot AI
            </div>
            <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#FFFFFF', whiteSpace: 'nowrap' }}>
              {currentUser ? 'Homeschool Assistant' : 'Ask Anything ? CBC & Fees'}
            </div>
          </div>
        </button>
      )}

      {/* Expanded Chat Box Window */}
      {isOpen && (
        <div style={{
          width: '400px',
          maxWidth: 'calc(100vw - 32px)',
          height: '580px',
          maxHeight: 'calc(100vh - 48px)',
          background: '#0B1120',
          border: '1px solid rgba(0, 166, 81, 0.4)',
          borderRadius: '20px',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.9), 0 0 30px rgba(0, 166, 81, 0.15)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {/* Header */}
          <div style={{
            background: 'linear-gradient(135deg, #064E3B 0%, #065F46 50%, #0F172A 100%)',
            padding: '14px 16px',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Bot size={22} color="#A7F3D0" />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#FFFFFF' }}>SomaBot AI</span>
                  <span style={{
                    fontSize: '0.62rem', fontWeight: 800, textTransform: 'uppercase',
                    background: 'rgba(52, 211, 153, 0.2)', color: '#34D399',
                    padding: '2px 6px', borderRadius: '9999px', border: '1px solid rgba(52, 211, 153, 0.3)'
                  }}>
                    {currentUser ? (currentUser.role || 'Active Learner') : 'Guest'}
                  </span>
                </div>
                <div style={{ fontSize: '0.72rem', color: '#D1FAE5', opacity: 0.85, display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: isOnline ? '#34D399' : '#F59E0B' }}></span>
                  {isOnline 
                    ? (currentUser ? `Connected: ${currentUser.first_name || currentUser.username}` : 'Instant 24/7 Homeschool Guide')
                    : 'Offline Mode Active'
                  }
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <a
                href={getWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                title="Continue on WhatsApp"
                style={{
                  background: '#25D366', color: '#FFFFFF', borderRadius: '8px', padding: '6px 10px',
                  display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none',
                  fontSize: '0.72rem', fontWeight: 800, border: 'none'
                }}
              >
                <MessageCircle size={14} color="#FFFFFF" />
                <span>WhatsApp</span>
              </a>

              <button
                onClick={handleClearChat}
                title="Restart conversation"
                style={{ background: 'transparent', border: 'none', color: '#A7F3D0', padding: '6px', cursor: 'pointer', display: 'flex' }}
              >
                <RefreshCw size={15} />
              </button>

              <button
                onClick={() => setIsOpen(false)}
                title="Close"
                style={{ background: 'transparent', border: 'none', color: '#A7F3D0', padding: '6px', cursor: 'pointer', display: 'flex' }}
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Offline Warning Banner */}
          {!isOnline && (
            <div style={{ background: 'rgba(245, 158, 11, 0.15)', borderBottom: '1px solid rgba(245, 158, 11, 0.3)', padding: '6px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.74rem', color: '#FCD34D' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <WifiOff size={13} color="#F59E0B" />
                <span>Device is offline. Local cache ready.</span>
              </div>
              <a href={`tel:${WHATSAPP_NUMBER}`} style={{ color: '#FDE68A', textDecoration: 'underline', fontWeight: 700 }}>Call Desk</a>
            </div>
          )}

          {/* User Status Sub-Bar */}
          <div style={{ background: '#0F172A', padding: '6px 14px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.74rem' }}>
            {currentUser ? (
              <span style={{ color: '#34D399', fontWeight: 600 }}>? Live Student Progress Sync Active</span>
            ) : (
              <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                <span style={{ color: '#94A3B8' }}>Want live progress tracking?</span>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    if (onOpenLogin) onOpenLogin();
                  }}
                  style={{ background: 'transparent', border: 'none', color: '#34D399', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}
                >
                  Log In
                </button>
              </div>
            )}
          </div>

          {/* Messages Body */}
          <div style={{
            flex: 1,
            padding: '14px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            background: 'radial-gradient(ellipse at top, #0F172A 0%, #080C14 100%)'
          }}>
            {messages.map((msg) => {
              const isBot = msg.sender === 'BOT';
              return (
                <div
                  key={msg.id}
                  style={{
                    display: 'flex',
                    gap: '8px',
                    justifyContent: isBot ? 'flex-start' : 'flex-end'
                  }}
                >
                  {isBot && (
                    <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'rgba(0, 166, 81, 0.2)', border: '1px solid rgba(0, 166, 81, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                      <Bot size={16} color="#34D399" />
                    </div>
                  )}

                  <div style={{
                    maxWidth: '82%',
                    borderRadius: isBot ? '16px 16px 16px 2px' : '16px 16px 2px 16px',
                    padding: '10px 14px',
                    fontSize: '0.84rem',
                    lineHeight: '1.5',
                    background: isBot ? 'rgba(30, 41, 59, 0.9)' : '#00A651',
                    border: isBot ? '1px solid rgba(255, 255, 255, 0.08)' : 'none',
                    color: '#F8FAFC',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
                  }}>
                    <div style={{ whiteSpace: 'pre-line', wordBreak: 'break-word' }}>
                      {msg.text.split('\n\n').map((paragraph, pIdx) => (
                        <p key={pIdx} style={{ margin: '0 0 6px 0' }}>
                          {paragraph.split('\n').map((line, lIdx) => (
                            <span key={lIdx} style={{ display: 'block' }}>
                              {line.split(/(\*\*.*?\*\*)/g).map((chunk, cIdx) => {
                                if (chunk.startsWith('**') && chunk.endsWith('**')) {
                                  return <strong key={cIdx} style={{ color: isBot ? '#34D399' : '#FFFFFF', fontWeight: 700 }}>{chunk.slice(2, -2)}</strong>;
                                }
                                if (chunk.startsWith('*') && chunk.endsWith('*')) {
                                  return <em key={cIdx} style={{ color: '#CBD5E1' }}>{chunk.slice(1, -1)}</em>;
                                }
                                return chunk;
                              })}
                            </span>
                          ))}
                        </p>
                      ))}
                    </div>
                    <div style={{ fontSize: '0.62rem', color: isBot ? '#94A3B8' : '#D1FAE5', textAlign: 'right', marginTop: '4px' }}>
                      {msg.time}
                    </div>
                  </div>

                  {!isBot && (
                    <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'rgba(0, 166, 81, 0.2)', border: '1px solid rgba(0, 166, 81, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                      <User size={16} color="#34D399" />
                    </div>
                  )}
                </div>
              );
            })}

            {isLoading && (
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-start' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'rgba(0, 166, 81, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Bot size={16} color="#34D399" />
                </div>
                <div style={{ background: 'rgba(30, 41, 59, 0.9)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '16px 16px 16px 2px', padding: '10px 16px', color: '#34D399', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Sparkles size={14} color="#34D399" />
                  <span>SomaBot is thinking...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Carousel */}
          <div style={{
            background: '#0F172A',
            borderTop: '1px solid rgba(255,255,255,0.06)',
            padding: '8px 12px',
            display: 'flex',
            gap: '6px',
            overflowX: 'auto',
            whiteSpace: 'nowrap'
          }}>
            {quickPrompts.map((p, idx) => (
              <button
                key={idx}
                disabled={isLoading}
                onClick={() => handleSendMessage(p.query)}
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '9999px',
                  padding: '5px 10px',
                  color: '#CBD5E1',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <Sparkles size={10} color="#34D399" />
                <span>{p.label}</span>
              </button>
            ))}
          </div>

          {/* Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            style={{
              background: '#0B1120',
              borderTop: '1px solid rgba(255,255,255,0.08)',
              padding: '10px 12px',
              display: 'flex',
              gap: '8px',
              alignItems: 'center'
            }}
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={currentUser ? "Ask about progress, lessons, or fees..." : "Ask about CBC, fees, legal info..."}
              style={{
                flex: 1,
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: '10px',
                padding: '9px 12px',
                color: '#FFFFFF',
                fontSize: '0.84rem',
                outline: 'none'
              }}
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || isLoading}
              style={{
                background: '#00A651',
                border: 'none',
                borderRadius: '10px',
                width: '38px',
                height: '38px',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                opacity: (!inputMessage.trim() || isLoading) ? 0.5 : 1
              }}
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
