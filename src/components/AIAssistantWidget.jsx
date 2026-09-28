import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, X, Send, Bot, User, Sparkles, 
  HelpCircle, CheckCircle2, ChevronDown, Minimize2, 
  BookOpen, CreditCard, ShieldCheck, Activity, RefreshCw,
  WifiOff, PhoneCall, ExternalLink, MessageCircle
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

  // WhatsApp Support Number for Kenya
  const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || '254700000000';

  // Network offline/online listeners
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

  // Initialize or load session
  useEffect(() => {
    let currentSession = localStorage.getItem('somahome_chat_session_id');
    if (!currentSession) {
      currentSession = 'sess_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now();
      localStorage.setItem('somahome_chat_session_id', currentSession);
    }
    setSessionId(currentSession);

    // Initial greeting based on auth state
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

  // Auto-scroll to bottom
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

    // If offline, provide immediate offline response
    if (!navigator.onLine) {
      setTimeout(() => {
        setMessages(prev => [
          ...prev,
          {
            id: 'bot_offline_' + Date.now(),
            sender: 'BOT',
            text: `?? **You appear to be offline.**\n\nYour inquiry has been cached. You can tap the **WhatsApp** button above to send this directly to our team via SMS / WhatsApp, or we will connect once your network resumes!`,
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

  // Generate WhatsApp Handover URL with pre-filled context
  const getWhatsAppLink = () => {
    const lastUserMsg = [...messages].reverse().find(m => m.sender === 'USER')?.text || 'Homeschool Information';
    const userLabel = currentUser ? (currentUser.first_name || currentUser.username) : 'Prospective Parent';
    const message = encodeURIComponent(
      `Hello SomaHome Team, I was chatting with SomaBot on the platform (${userLabel}).\n\nTopic: "${lastUserMsg}"\n\nPlease assist me further.`
    );
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
  };

  const quickPrompts = currentUser ? [
    { label: "?? Check child progress", query: "Check my student's activity, completed lessons, and project rubric scores" },
    { label: "?? What is scheduled today?", query: "What lessons and activities are scheduled for today?" },
    { label: "?? M-Pesa Term Fees", query: "How much are the term packages and how do I renew via M-Pesa?" },
    { label: "?? KNEC & MOE Legal Info", query: "How do I register my child for KNEC assessments or Cambridge exams as a homeschooler?" }
  ] : [
    { label: "?? Term Pricing & M-Pesa", query: "How much does SomaHome cost per term and how do I pay with M-Pesa?" },
    { label: "???? CBC Curriculum Guide", query: "How does the Kenya CBC curriculum work on SomaHome from Grade 1 to 9?" },
    { label: "???? Cambridge Option", query: "Do you support British Cambridge curriculum and IGCSE preparation?" },
    { label: "?? Is homeschooling legal in Kenya?", query: "Is homeschooling legal in Kenya and how does Ministry of Education compliance work?" },
    { label: "????? Hire a Verified Tutor", query: "How do I find a private home tutor or join a learning pod in Nairobi?" }
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* Closed Floating Launcher Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white px-5 py-3.5 rounded-full shadow-2xl hover:shadow-emerald-500/25 transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0 border border-emerald-400/30"
          aria-label="Open AI Assistant"
        >
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
              <Bot className="w-6 h-6 animate-pulse" />
            </div>
            <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-amber-400 border-2 border-emerald-600"></span>
            </span>
          </div>

          <div className="text-left hidden sm:block">
            <div className="text-xs font-semibold uppercase tracking-wider text-emerald-100 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-300" />
              SomaBot AI
            </div>
            <div className="text-sm font-bold text-white">
              {currentUser ? 'Homeschool Assistant' : 'Ask Anything ? CBC & Fees'}
            </div>
          </div>
        </button>
      )}

      {/* Expanded Chat Box Window */}
      {isOpen && (
        <div className="w-[380px] sm:w-[420px] h-[600px] max-h-[85vh] bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-slate-800 p-4 text-white flex items-center justify-between border-b border-white/10 shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-inner">
                <Bot className="w-6 h-6 text-emerald-200" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-base tracking-tight text-white">SomaBot AI</h3>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-200 border border-emerald-300/30">
                    {currentUser ? (currentUser.role || 'Active Learner') : 'Guest Mode'}
                  </span>
                </div>
                <p className="text-xs text-emerald-100/80 flex items-center gap-1">
                  <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
                  {isOnline 
                    ? (currentUser ? `Connected as ${currentUser.first_name || currentUser.username}` : 'Instant 24/7 Self-Hosted AI')
                    : 'Offline Mode Active'
                  }
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <a
                href={getWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                title="Continue on WhatsApp"
                className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-200 hover:bg-emerald-500 hover:text-white transition-all flex items-center gap-1 text-xs px-2"
              >
                <MessageCircle className="w-4 h-4 text-emerald-300" />
                <span className="hidden sm:inline font-medium">WhatsApp</span>
              </a>
              <button
                onClick={handleClearChat}
                title="Restart conversation"
                className="p-1.5 rounded-lg text-emerald-200 hover:text-white hover:bg-white/10 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-emerald-200 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Offline Warning Banner */}
          {!isOnline && (
            <div className="bg-amber-500/15 border-b border-amber-500/30 px-4 py-2 flex items-center justify-between text-xs text-amber-300">
              <div className="flex items-center gap-1.5">
                <WifiOff className="w-3.5 h-3.5 text-amber-400" />
                <span>Device is offline. Using local cache.</span>
              </div>
              <a
                href={`tel:${WHATSAPP_NUMBER}`}
                className="text-amber-200 underline font-semibold hover:text-white"
              >
                Call Desk
              </a>
            </div>
          )}

          {/* User Status Bar if Logged In / Guest */}
          <div className="bg-slate-800/80 px-4 py-2 border-b border-slate-700/60 flex items-center justify-between text-xs text-slate-300">
            {currentUser ? (
              <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                <Activity className="w-3.5 h-3.5 text-emerald-400" />
                Live Student Tracking Enabled
              </span>
            ) : (
              <div className="flex items-center justify-between w-full">
                <span className="text-slate-400">Want live student tracking?</span>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    if (onOpenLogin) onOpenLogin();
                  }}
                  className="text-emerald-400 hover:text-emerald-300 font-semibold underline ml-1"
                >
                  Log In
                </button>
              </div>
            )}
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-950/60 scrollbar-thin scrollbar-thumb-slate-700">
            {messages.map((msg) => {
              const isBot = msg.sender === 'BOT';
              return (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 ${isBot ? 'justify-start' : 'justify-end'}`}
                >
                  {isBot && (
                    <div className="w-7 h-7 rounded-lg bg-emerald-600/30 border border-emerald-500/30 flex items-center justify-center text-emerald-300 flex-shrink-0 mt-0.5">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                    isBot 
                      ? 'bg-slate-800/90 text-slate-100 border border-slate-700/60 rounded-tl-sm' 
                      : 'bg-emerald-600 text-white rounded-tr-sm shadow-md'
                  }`}>
                    {/* Render message text with basic bold formatting */}
                    <div className="whitespace-pre-line break-words space-y-1.5">
                      {msg.text.split('\n\n').map((paragraph, pIdx) => (
                        <p key={pIdx}>
                          {paragraph.split('\n').map((line, lIdx) => (
                            <span key={lIdx} className="block">
                              {line.split(/(\*\*.*?\*\*)/g).map((chunk, cIdx) => {
                                if (chunk.startsWith('**') && chunk.endsWith('**')) {
                                  return <strong key={cIdx} className="text-emerald-300 font-semibold">{chunk.slice(2, -2)}</strong>;
                                }
                                if (chunk.startsWith('*') && chunk.endsWith('*')) {
                                  return <em key={cIdx} className="text-slate-300">{chunk.slice(1, -1)}</em>;
                                }
                                return chunk;
                              })}
                            </span>
                          ))}
                        </p>
                      ))}
                    </div>

                    <div className={`text-[10px] mt-1 text-right ${isBot ? 'text-slate-400' : 'text-emerald-200'}`}>
                      {msg.time}
                    </div>
                  </div>

                  {!isBot && (
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-300 flex-shrink-0 mt-0.5">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              );
            })}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex gap-2.5 justify-start">
                <div className="w-7 h-7 rounded-lg bg-emerald-600/30 border border-emerald-500/30 flex items-center justify-center text-emerald-300 flex-shrink-0 mt-0.5">
                  <Bot className="w-4 h-4 animate-spin" />
                </div>
                <div className="bg-slate-800/90 border border-slate-700/60 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce"></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Carousel */}
          <div className="px-3 py-2 bg-slate-900 border-t border-slate-800 overflow-x-auto whitespace-nowrap scrollbar-none flex gap-1.5">
            {quickPrompts.map((p, idx) => (
              <button
                key={idx}
                disabled={isLoading}
                onClick={() => handleSendMessage(p.query)}
                className="text-xs px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-all flex items-center gap-1 flex-shrink-0"
              >
                <Sparkles className="w-3 h-3 text-emerald-400" />
                {p.label}
              </button>
            ))}
          </div>

          {/* Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={currentUser ? "Ask about progress, lessons, or fees..." : "Ask about CBC, fees, legal info..."}
              className="flex-1 bg-slate-800 border border-slate-700 text-white rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent placeholder-slate-400"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || isLoading}
              className="p-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:hover:bg-emerald-600 text-white rounded-xl shadow transition-colors flex items-center justify-center"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
