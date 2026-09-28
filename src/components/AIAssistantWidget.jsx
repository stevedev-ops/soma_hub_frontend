import React, { useState, useEffect, useRef } from 'react';
import { 
  X, Send, Bot, User, Sparkles, RefreshCw,
  WifiOff, MessageCircle
} from 'lucide-react';
import { api } from '../services/api';

// Sleek Professional Message Renderer
function FormattedMessage({ text, isUser }) {
  if (isUser) {
    return <span>{text}</span>;
  }

  // Split content by lines
  const lines = (text || '').split('\n');
  const elements = [];
  let tableRows = [];
  let inTable = false;

  const flushTable = (key) => {
    if (tableRows.length > 0) {
      const header = tableRows[0];
      const rows = tableRows.slice(1).filter(r => !r.every(c => /^[\s:-]+$/.test(c)));
      elements.push(
        <div key={`table-${key}`} style={{ overflowX: 'auto', margin: '10px 0', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.12)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'rgba(0, 166, 81, 0.2)', borderBottom: '1px solid rgba(255, 255, 255, 0.15)' }}>
                {header.map((col, ci) => (
                  <th key={ci} style={{ padding: '8px 10px', color: '#34D399', fontWeight: 600 }}>{parseInlineFormatting(col)}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, ri) => (
                <tr key={ri} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)', background: ri % 2 === 0 ? 'transparent' : 'rgba(255, 255, 255, 0.02)' }}>
                  {row.map((cell, ci) => (
                    <td key={ci} style={{ padding: '8px 10px', color: '#e2e8f0' }}>{parseInlineFormatting(cell)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      tableRows = [];
      inTable = false;
    }
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();

    // Markdown Table handling
    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      const cols = trimmed.split('|').slice(1, -1).map(c => c.trim());
      tableRows.push(cols);
      inTable = true;
      return;
    } else if (inTable) {
      flushTable(index);
    }

    if (!trimmed) {
      elements.push(<div key={index} style={{ height: '8px' }} />);
      return;
    }

    // Headers (##, ###)
    if (trimmed.startsWith('###')) {
      elements.push(
        <div key={index} style={{ fontWeight: 700, fontSize: '13px', color: '#34D399', marginTop: '10px', marginBottom: '4px' }}>
          {parseInlineFormatting(trimmed.replace(/^###\s*/, ''))}
        </div>
      );
      return;
    }
    if (trimmed.startsWith('##')) {
      elements.push(
        <div key={index} style={{ fontWeight: 700, fontSize: '14px', color: '#ffffff', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '4px', marginTop: '12px', marginBottom: '6px' }}>
          {parseInlineFormatting(trimmed.replace(/^##\s*/, ''))}
        </div>
      );
      return;
    }

    // Bullet points (•, -, *)
    if (/^[•\-*]\s+/.test(trimmed)) {
      elements.push(
        <div key={index} style={{ display: 'flex', gap: '8px', paddingLeft: '4px', margin: '3px 0' }}>
          <span style={{ color: '#00A651', fontWeight: 'bold' }}>•</span>
          <span style={{ flex: 1 }}>{parseInlineFormatting(trimmed.replace(/^[•\-*]\s+/, ''))}</span>
        </div>
      );
      return;
    }

    // Numbered list (1., 2., etc.)
    if (/^\d+\.\s+/.test(trimmed)) {
      const numMatch = trimmed.match(/^(\d+\.)\s+(.*)/);
      elements.push(
        <div key={index} style={{ display: 'flex', gap: '8px', paddingLeft: '4px', margin: '4px 0' }}>
          <span style={{ color: '#34D399', fontWeight: 600, minWidth: '18px' }}>{numMatch[1]}</span>
          <span style={{ flex: 1 }}>{parseInlineFormatting(numMatch[2])}</span>
        </div>
      );
      return;
    }

    // Standard paragraph line
    elements.push(
      <div key={index} style={{ margin: '3px 0' }}>
        {parseInlineFormatting(trimmed)}
      </div>
    );
  });

  if (inTable) {
    flushTable('end');
  }

  return <div>{elements}</div>;
}

// Parses **bold** and *italic* cleanly into styled spans
function parseInlineFormatting(str) {
  if (!str) return '';
  const parts = [];
  // Regex to match **bold** or *italic*
  const regex = /(\*\*([^*]+)\*\*)|(\*([^*]+)\*)|(__([^_]+)__)/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(str)) !== null) {
    if (match.index > lastIndex) {
      parts.push(str.substring(lastIndex, match.index));
    }
    if (match[2]) {
      // **bold**
      parts.push(<strong key={match.index} style={{ color: '#ffffff', fontWeight: 600 }}>{match[2]}</strong>);
    } else if (match[4]) {
      // *italic*
      parts.push(<em key={match.index} style={{ color: '#cbd5e1' }}>{match[4]}</em>);
    } else if (match[6]) {
      // __bold__
      parts.push(<strong key={match.index} style={{ color: '#ffffff', fontWeight: 600 }}>{match[6]}</strong>);
    }
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < str.length) {
    parts.push(str.substring(lastIndex));
  }

  return parts.length > 0 ? parts : str;
}


export default function AIAssistantWidget({ currentUser, activeStudent, onOpenLogin }) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [sessionId, setSessionId] = useState('');
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const messagesEndRef = useRef(null);

  // Sync user state from props or localStorage
  const effectiveUser = currentUser || (() => {
    try {
      const saved = localStorage.getItem('somahome_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  })();

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
      if (effectiveUser) {
        const userName = effectiveUser.first_name || effectiveUser.name || effectiveUser.username || 'Parent';
        setMessages([
          {
            id: 'init-1',
            sender: 'BOT',
            text: `👋 Jambo **${userName}**! I am **SomaBot**, your AI Homeschool Assistant.\n\nI can help you check your learner's progress, review today's lessons, examine project rubric scores, or assist with curriculum questions.\n\nHow can I help you today?`,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            metadata: { is_greeting: true }
          }
        ]);
      } else {
        setMessages([
          {
            id: 'init-1',
            sender: 'BOT',
            text: `👋 Jambo & Karibu to **SomaHome Kenya**!\n\nI'm **SomaBot**, your AI Homeschool Guide. Ask me anything about:\n• **CBC & Cambridge term packages**\n• **Pricing (KES 3,500/term) & M-Pesa checkout**\n• **Homeschooling legal compliance & KNEC**\n• **Finding verified tutors in Nairobi**\n\nHow can I support your homeschooling journey?`,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            metadata: { is_greeting: true }
          }
        ]);
      }
    }
  }, [effectiveUser]);

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
            text: `📡 **You appear to be offline.**\n\nYour inquiry has been cached. You can tap the **WhatsApp** button above to send this directly to our team via SMS / WhatsApp.`,
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
      if (effectiveUser) {
        data = await api.sendAuthChatMessage(textToSend, sessionId, activeStudent, effectiveUser);
      } else {
        data = await api.sendPublicChatMessage(textToSend, sessionId, 'Guest Visitor');
      }

      const botReply = typeof data === 'string'
        ? data
        : (data?.response || data?.message || "I'm having trouble retrieving that information right now. Please try again shortly.");
      
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
          text: "⚠️ Server temporarily unreachable. You can continue this conversation with our team directly on WhatsApp!",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const openWhatsAppHandover = () => {
    const lastUserMsg = [...messages].reverse().find(m => m.sender === 'USER')?.text || 'Homeschooling inquiry';
    const encoded = encodeURIComponent(`Hi SomaHome Team! I have a question regarding: "${lastUserMsg}"`);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`, '_blank');
  };

  const quickChips = effectiveUser ? [
    { label: "📊 Today's Progress", query: "Check my learner's recent progress and project rubrics" },
    { label: "👤 Who Am I?", query: "who am i" },
    { label: "👨‍👩‍👧‍👦 Learner Limit", query: "how many children maximum do you need?" },
    { label: "🚀 How Soma Works", query: "how do i go about soma, explain it to me" }
  ] : [
    { label: "💳 Pricing & M-Pesa", query: "What are the term package fees and how do I pay with M-Pesa?" },
    { label: "🇰🇪 CBC vs Cambridge", query: "How does Kenya CBC compare with Cambridge?" },
    { label: "👨‍👩‍👧‍👦 Learner Limit", query: "how many children maximum do you need?" },
    { label: "🚀 How It Works", query: "how do i go about soma, explain it to me" }
  ];

  return (
    <>
      {/* Floating Launcher Button */}
      <button
        onClick={() => setIsOpen(prev => !prev)}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '12px 20px',
          borderRadius: '50px',
          background: 'linear-gradient(135deg, #00A651 0%, #00803E 100%)',
          color: '#ffffff',
          border: 'none',
          boxShadow: '0 10px 25px rgba(0, 166, 81, 0.45)',
          cursor: 'pointer',
          fontWeight: 600,
          fontSize: '14px',
          transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        title="Open AI Homeschool Assistant"
      >
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <Bot size={22} color="#ffffff" />
          <span style={{
            position: 'absolute',
            top: '-2px',
            right: '-2px',
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: isOnline ? '#34D399' : '#EF4444',
            border: '2px solid #00A651'
          }} />
        </div>
        <span>{isOpen ? 'Close SomaBot' : 'Ask SomaBot AI'}</span>
      </button>

      {/* Slide-out / Pop-up Chat Window */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: '88px',
            right: '24px',
            width: '380px',
            maxWidth: 'calc(100vw - 32px)',
            height: '560px',
            maxHeight: 'calc(100vh - 120px)',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            borderRadius: '20px',
            background: 'rgba(15, 23, 42, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
            overflow: 'hidden',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            color: '#f8fafc'
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '16px 18px',
              background: 'linear-gradient(135deg, rgba(0, 166, 81, 0.25) 0%, rgba(15, 23, 42, 0.8) 100%)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: '#00A651',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(0, 166, 81, 0.4)'
                }}
              >
                <Sparkles size={18} color="#ffffff" />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '15px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>SomaBot AI</span>
                  <span style={{ fontSize: '10px', padding: '2px 6px', borderRadius: '6px', background: 'rgba(0, 166, 81, 0.3)', color: '#34D399', fontWeight: 600 }}>
                    {effectiveUser ? (effectiveUser.role || 'PARENT') : 'GUEST'}
                  </span>
                </div>
                <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                  {effectiveUser ? `Active for ${effectiveUser.first_name || effectiveUser.name || 'Parent'}` : 'Kenya Homeschool Guide'}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <button
                onClick={openWhatsAppHandover}
                style={{
                  background: 'rgba(37, 211, 102, 0.15)',
                  border: '1px solid rgba(37, 211, 102, 0.4)',
                  color: '#25D366',
                  padding: '6px 10px',
                  borderRadius: '8px',
                  fontSize: '11px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
                title="Handover conversation to WhatsApp Human Support"
              >
                <MessageCircle size={13} />
                <span>WhatsApp</span>
              </button>
              <button
                onClick={() => setIsOpen(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Offline Banner */}
          {!isOnline && (
            <div
              style={{
                background: 'rgba(239, 68, 68, 0.2)',
                borderBottom: '1px solid rgba(239, 68, 68, 0.3)',
                padding: '6px 12px',
                fontSize: '11px',
                color: '#fca5a5',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <WifiOff size={13} />
              <span>Offline mode. Inquiries will route to WhatsApp.</span>
            </div>
          )}

          {/* Quick Suggestions Bar */}
          <div
            style={{
              padding: '8px 12px',
              display: 'flex',
              gap: '6px',
              overflowX: 'auto',
              borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
              scrollbarWidth: 'none'
            }}
          >
            {quickChips.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(chip.query)}
                style={{
                  whiteSpace: 'nowrap',
                  fontSize: '11px',
                  padding: '4px 10px',
                  borderRadius: '12px',
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  color: '#cbd5e1',
                  cursor: 'pointer',
                  transition: 'background 0.15s ease'
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(0, 166, 81, 0.25)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)'}
              >
                {chip.label}
              </button>
            ))}
          </div>

          {/* Message List */}
          <div
            style={{
              flex: 1,
              padding: '16px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}
          >
            {messages.map((m) => {
              const isUser = m.sender === 'USER';
              return (
                <div
                  key={m.id}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: isUser ? 'flex-end' : 'flex-start',
                    maxWidth: '100%'
                  }}
                >
                  <div
                    style={{
                      maxWidth: '85%',
                      padding: '10px 14px',
                      borderRadius: isUser ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                      background: isUser 
                        ? 'linear-gradient(135deg, #00A651 0%, #00803E 100%)' 
                        : 'rgba(255, 255, 255, 0.07)',
                      color: '#ffffff',
                      fontSize: '13px',
                      lineHeight: '1.5',
                      wordBreak: 'break-word',
                      whiteSpace: 'pre-wrap',
                      border: isUser ? 'none' : '1px solid rgba(255, 255, 255, 0.08)',
                      boxShadow: isUser ? '0 4px 12px rgba(0, 166, 81, 0.2)' : 'none'
                    }}
                  >
                    <FormattedMessage text={m.text} isUser={isUser} />
                  </div>
                  <span style={{ fontSize: '10px', color: '#64748b', marginTop: '3px', padding: '0 4px' }}>
                    {m.time}
                  </span>
                </div>
              );
            })}

            {isLoading && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', background: 'rgba(255, 255, 255, 0.04)', borderRadius: '12px', width: 'fit-content' }}>
                <RefreshCw size={14} className="animate-spin" color="#00A651" />
                <span style={{ fontSize: '12px', color: '#94a3b8' }}>SomaBot is thinking...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <div
            style={{
              padding: '12px',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              background: 'rgba(15, 23, 42, 0.98)',
              display: 'flex',
              gap: '8px',
              alignItems: 'center'
            }}
          >
            <input
              type="text"
              value={inputMessage}
              onChange={e => setInputMessage(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') handleSendMessage();
              }}
              placeholder={effectiveUser ? "Ask about lessons, rubrics, advice..." : "Ask about CBC, pricing, tutors..."}
              style={{
                flex: 1,
                padding: '10px 14px',
                borderRadius: '12px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                color: '#ffffff',
                fontSize: '13px',
                outline: 'none',
                transition: 'border 0.2s ease'
              }}
              onFocus={e => e.currentTarget.style.borderColor = '#00A651'}
              onBlur={e => e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)'}
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={!inputMessage.trim() || isLoading}
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '12px',
                background: inputMessage.trim() && !isLoading ? '#00A651' : 'rgba(255, 255, 255, 0.1)',
                border: 'none',
                color: '#ffffff',
                cursor: inputMessage.trim() && !isLoading ? 'pointer' : 'default',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease'
              }}
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
