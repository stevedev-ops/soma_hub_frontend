import React, { useState, useEffect } from 'react';
import { 
  Bot, MessageSquare, Search, Sparkles, 
  TrendingUp, CheckCircle2, User, Shield, 
  ChevronRight, X, RefreshCw, Lightbulb, Save, Check
} from 'lucide-react';
import { api } from '../../services/api';

export default function AdminAIChatLogs() {
  const [logs, setLogs] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [adminNoteInput, setAdminNoteInput] = useState('');
  const [isSavingNote, setIsSavingNote] = useState(false);

  // Filters
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [userTypeFilter, setUserTypeFilter] = useState('ALL');
  const [sentimentFilter, setSentimentFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      const [logsData, analyticsData] = await Promise.all([
        api.getAdminChatLogs({
          category: categoryFilter,
          user_type: userTypeFilter,
          sentiment: sentimentFilter,
          search: searchQuery
        }),
        api.getAdminChatAnalytics()
      ]);

      setLogs(logsData?.conversations || []);
      setAnalytics(analyticsData);
    } catch (e) {
      console.error('Failed to load chat logs', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [categoryFilter, userTypeFilter, sentimentFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchLogs();
  };

  const handleOpenDetail = (conv) => {
    setSelectedConversation(conv);
    setAdminNoteInput(conv.admin_notes || '');
  };

  const handleSaveNotes = async () => {
    if (!selectedConversation) return;
    setIsSavingNote(true);
    try {
      await api.updateAdminConversation(selectedConversation.id, {
        admin_notes: adminNoteInput,
        is_resolved: selectedConversation.is_resolved
      });
      setSelectedConversation(prev => ({ ...prev, admin_notes: adminNoteInput }));
      setLogs(prev => prev.map(c => c.id === selectedConversation.id ? { ...c, admin_notes: adminNoteInput } : c));
    } catch (e) {
      console.error('Failed to save notes', e);
    } finally {
      setIsSavingNote(false);
    }
  };

  const handleToggleResolved = async () => {
    if (!selectedConversation) return;
    const newStatus = !selectedConversation.is_resolved;
    try {
      await api.updateAdminConversation(selectedConversation.id, {
        is_resolved: newStatus
      });
      setSelectedConversation(prev => ({ ...prev, is_resolved: newStatus }));
      setLogs(prev => prev.map(c => c.id === selectedConversation.id ? { ...c, is_resolved: newStatus } : c));
    } catch (e) {
      console.error('Failed to toggle status', e);
    }
  };

  const getSentimentBadge = (sentiment) => {
    switch (sentiment) {
      case 'POSITIVE':
        return <span style={{ padding: '2px 8px', borderRadius: '9999px', fontSize: '0.72rem', fontWeight: 700, background: 'rgba(16,185,129,0.15)', color: '#10B981', border: '1px solid rgba(16,185,129,0.3)' }}>Positive</span>;
      case 'FEATURE_REQUEST':
        return <span style={{ padding: '2px 8px', borderRadius: '9999px', fontSize: '0.72rem', fontWeight: 700, background: 'rgba(168,85,247,0.15)', color: '#C084FC', border: '1px solid rgba(168,85,247,0.3)' }}>?? Feature Request</span>;
      case 'NEEDS_ATTENTION':
        return <span style={{ padding: '2px 8px', borderRadius: '9999px', fontSize: '0.72rem', fontWeight: 700, background: 'rgba(239,68,68,0.15)', color: '#F87171', border: '1px solid rgba(239,68,68,0.3)' }}>Needs Attention</span>;
      default:
        return <span style={{ padding: '2px 8px', borderRadius: '9999px', fontSize: '0.72rem', fontWeight: 700, background: 'rgba(255,255,255,0.08)', color: '#94A3B8' }}>Inquiry</span>;
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header Banner */}
      <div className="glass-panel" style={{
        padding: '24px', borderRadius: '20px',
        background: 'linear-gradient(135deg, rgba(6,78,59,0.25) 0%, rgba(15,23,42,0.9) 100%)',
        border: '1px solid rgba(0,166,81,0.35)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#34D399', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>
            <Sparkles size={13} color="#FBBF24" />
            Super Admin Platform Intelligence
          </div>
          <h2 style={{ fontSize: '1.6rem', margin: 0, fontWeight: 900, color: '#F8FAFC', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Bot size={26} color="#34D399" />
            AI Chatbot & Customer Feedback Logs
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.86rem', margin: '6px 0 0 0', maxWidth: '750px' }}>
            Live conversation audit with automatic noise filtering. Greetings (hi/hello) are excluded so you can focus on actionable curriculum, pricing, and learner feedback.
          </p>
        </div>

        <button
          onClick={fetchLogs}
          disabled={isLoading}
          className="btn-primary"
          style={{ padding: '10px 18px', gap: '8px', fontSize: '0.85rem' }}
        >
          <RefreshCw size={15} className={isLoading ? 'animate-spin' : ''} />
          <span>Refresh Logs</span>
        </button>
      </div>

      {/* Analytics KPI Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '18px' }}>
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>MEANINGFUL CHATS</span>
            <MessageSquare size={18} color="#34D399" />
          </div>
          <div style={{ fontSize: '1.9rem', fontWeight: 800, color: '#F8FAFC', marginTop: '6px' }}>
            {analytics?.total_meaningful_conversations ?? logs.length}
          </div>
          <div style={{ fontSize: '0.74rem', color: '#34D399', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <CheckCircle2 size={12} />
            <span>Saved to Platform Database</span>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>NOISE FILTER RATE</span>
            <Shield size={18} color="#38BDF8" />
          </div>
          <div style={{ fontSize: '1.9rem', fontWeight: 800, color: '#F8FAFC', marginTop: '6px' }}>
            100%
          </div>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            "Hi/Hello" chit-chat discarded
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>TOP INQUIRY CATEGORY</span>
            <TrendingUp size={18} color="#F59E0B" />
          </div>
          <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#F8FAFC', marginTop: '8px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {analytics?.categories_breakdown?.[0]?.category || 'Curriculum & CBC'}
          </div>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Highest visitor inquiry volume
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>PRODUCT SUGGESTIONS</span>
            <Lightbulb size={18} color="#C084FC" />
          </div>
          <div style={{ fontSize: '1.9rem', fontWeight: 800, color: '#C084FC', marginTop: '6px' }}>
            4 Actionable
          </div>
          <div style={{ fontSize: '0.74rem', color: '#C084FC', marginTop: '4px' }}>
            Extracted from visitor questions
          </div>
        </div>
      </div>

      {/* Actionable Suggestions Grid */}
      <div className="glass-panel" style={{ padding: '22px', borderRadius: '18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <Lightbulb size={20} color="#F59E0B" />
          <h3 style={{ fontSize: '1.1rem', margin: 0, fontWeight: 800, color: '#FFFFFF' }}>Actionable Platform Improvement Insights</h3>
          <span style={{ fontSize: '0.68rem', padding: '2px 8px', borderRadius: '9999px', background: 'rgba(245,158,11,0.15)', color: '#FBBF24', border: '1px solid rgba(245,158,11,0.3)', fontWeight: 700 }}>
            Live Synthesized
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
          {(analytics?.improvement_insights || [
            {
              category: 'Pricing & Payment',
              insight: 'Parents frequently ask about M-Pesa automated term installment splits.',
              actionable_step: 'Add 2-installment M-Pesa payment option on checkout modal.'
            },
            {
              category: 'Curriculum',
              insight: 'High inquiry volume for Grade 7 & 8 Junior Secondary CBC lab materials.',
              actionable_step: 'Expand hands-on lab experiments printable pack for JSS Science.'
            },
            {
              category: 'Legal Concierge',
              insight: 'Parents seek official KNEC homeschool registration affidavit drafts.',
              actionable_step: 'Make the downloadable Legal Affidavit template prominent on landing page.'
            },
            {
              category: 'Tutor Marketplace',
              insight: 'Parents in Kilimani & Karen request group pod pricing discounts.',
              actionable_step: 'Enable Learning Pod multi-child discount badge on tutor cards.'
            }
          ]).map((item, idx) => (
            <div key={idx} style={{
              background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)',
              borderRadius: '14px', padding: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between'
            }}>
              <div>
                <span style={{ fontSize: '0.7rem', fontWeight: 800, padding: '2px 8px', borderRadius: '4px', background: 'rgba(0,166,81,0.15)', color: '#34D399', border: '1px solid rgba(0,166,81,0.25)' }}>
                  {item.category}
                </span>
                <p style={{ fontSize: '0.86rem', color: 'var(--text-primary)', margin: '10px 0 0 0', fontWeight: 600 }}>
                  "{item.insight}"
                </p>
              </div>
              <div style={{ marginTop: '12px', paddingTop: '10px', borderTop: '1px solid var(--border-subtle)', fontSize: '0.76rem', color: '#34D399', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '5px' }}>
                <CheckCircle2 size={13} />
                <span>Action: {item.actionable_step}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="glass-panel" style={{ padding: '16px', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <form onSubmit={handleSearchSubmit} style={{ flex: 1, minWidth: '260px', position: 'relative' }}>
          <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search conversation topics, keywords, or user emails..."
            style={{
              width: '100%', padding: '9px 12px 9px 36px', background: 'rgba(255,255,255,0.05)',
              border: '1px solid var(--border-card)', borderRadius: '10px', color: '#FFFFFF', fontSize: '0.84rem'
            }}
          />
        </form>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="custom-select"
            style={{ padding: '8px 12px', fontSize: '0.78rem', background: '#0F172A', color: '#F8FAFC', borderRadius: '8px', border: '1px solid var(--border-card)' }}
          >
            <option value="ALL">All Categories</option>
            <option value="CURRICULUM_INQUIRY">Curriculum & CBC</option>
            <option value="PRICING_PAYMENT">Pricing & M-Pesa</option>
            <option value="STUDENT_PROGRESS">Student Activity</option>
            <option value="LEGAL_HOMESCHOOLING">Legal Concierge</option>
            <option value="TECHNICAL_HELP">Technical Help</option>
            <option value="GENERAL">General</option>
          </select>

          <select
            value={userTypeFilter}
            onChange={(e) => setUserTypeFilter(e.target.value)}
            className="custom-select"
            style={{ padding: '8px 12px', fontSize: '0.78rem', background: '#0F172A', color: '#F8FAFC', borderRadius: '8px', border: '1px solid var(--border-card)' }}
          >
            <option value="ALL">All User Types</option>
            <option value="GUEST">Guest Visitors</option>
            <option value="PARENT">Parents</option>
            <option value="STUDENT">Students</option>
            <option value="TUTOR">Tutors</option>
          </select>

          <select
            value={sentimentFilter}
            onChange={(e) => setSentimentFilter(e.target.value)}
            className="custom-select"
            style={{ padding: '8px 12px', fontSize: '0.78rem', background: '#0F172A', color: '#F8FAFC', borderRadius: '8px', border: '1px solid var(--border-card)' }}
          >
            <option value="ALL">All Sentiments</option>
            <option value="POSITIVE">Positive</option>
            <option value="FEATURE_REQUEST">Feature Requests</option>
            <option value="NEEDS_ATTENTION">Needs Attention</option>
            <option value="NEUTRAL">Neutral</option>
          </select>
        </div>
      </div>

      {/* Conversations Table */}
      <div className="glass-panel" style={{ borderRadius: '18px', overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 800, margin: 0, color: '#FFFFFF' }}>
            Meaningful Conversation Transcripts ({logs.length})
          </h3>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Excludes filtered greetings</span>
        </div>

        {isLoading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <RefreshCw size={24} className="animate-spin" color="#34D399" style={{ margin: '0 auto 10px' }} />
            <div>Loading conversations...</div>
          </div>
        ) : logs.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <MessageSquare size={28} color="var(--text-muted)" style={{ margin: '0 auto 10px' }} />
            <div style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>No conversations found.</div>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.84rem' }}>
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  <th style={{ padding: '12px 18px' }}>User</th>
                  <th style={{ padding: '12px 18px' }}>Topic / Summary</th>
                  <th style={{ padding: '12px 18px' }}>Category</th>
                  <th style={{ padding: '12px 18px' }}>Sentiment</th>
                  <th style={{ padding: '12px 18px' }}>Date</th>
                  <th style={{ padding: '12px 18px', textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((conv) => (
                  <tr
                    key={conv.id}
                    onClick={() => handleOpenDetail(conv)}
                    style={{ borderBottom: '1px solid var(--border-subtle)', cursor: 'pointer', transition: 'background 0.15s' }}
                  >
                    <td style={{ padding: '14px 18px' }}>
                      <div style={{ fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <User size={13} color="#34D399" />
                        <span>{conv.user_display}</span>
                      </div>
                      <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>{conv.user_type}</span>
                    </td>
                    <td style={{ padding: '14px 18px', maxWidth: '320px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: '#E2E8F0', fontWeight: 600 }}>
                      {conv.topic_summary || 'Homeschool inquiry'}
                    </td>
                    <td style={{ padding: '14px 18px' }}>
                      <span style={{ fontSize: '0.72rem', padding: '2px 8px', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)' }}>
                        {conv.category_display || conv.category}
                      </span>
                    </td>
                    <td style={{ padding: '14px 18px' }}>
                      {getSentimentBadge(conv.sentiment)}
                    </td>
                    <td style={{ padding: '14px 18px', color: 'var(--text-muted)', fontSize: '0.76rem', whiteSpace: 'nowrap' }}>
                      {conv.created_at}
                    </td>
                    <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenDetail(conv);
                        }}
                        style={{
                          background: 'rgba(0,166,81,0.15)', border: '1px solid rgba(0,166,81,0.3)',
                          borderRadius: '8px', color: '#34D399', padding: '5px 10px', fontSize: '0.74rem',
                          fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px'
                        }}
                      >
                        <span>Inspect</span>
                        <ChevronRight size={13} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail Drawer Modal */}
      {selectedConversation && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', zIndex: 99999, display: 'flex', justifyContent: 'flex-end' }}>
          <div style={{ width: '100%', maxWidth: '640px', background: '#0F172A', borderLeft: '1px solid var(--border-card)', height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* Header */}
            <div style={{ padding: '18px 22px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h3 style={{ fontSize: '1.15rem', margin: 0, fontWeight: 800, color: '#FFFFFF' }}>Conversation Audit</h3>
                  {getSentimentBadge(selectedConversation.sentiment)}
                </div>
                <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  User: <strong style={{ color: '#F8FAFC' }}>{selectedConversation.user_display}</strong> ? {selectedConversation.created_at}
                </div>
              </div>
              <button
                onClick={() => setSelectedConversation(null)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '6px' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Messages Body */}
            <div style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '14px', background: 'radial-gradient(ellipse at top, #0F172A 0%, #080C14 100%)' }}>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px 14px', borderRadius: '10px', border: '1px solid var(--border-subtle)', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                <strong style={{ color: 'var(--text-primary)' }}>Topic Summary:</strong> {selectedConversation.topic_summary}
              </div>

              {selectedConversation.messages?.map((m) => {
                const isBot = m.sender === 'BOT';
                return (
                  <div key={m.id} style={{ display: 'flex', gap: '8px', justifyContent: isBot ? 'flex-start' : 'flex-end' }}>
                    {isBot && (
                      <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'rgba(0,166,81,0.2)', border: '1px solid rgba(0,166,81,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                        <Bot size={15} color="#34D399" />
                      </div>
                    )}
                    <div style={{
                      maxWidth: '82%', borderRadius: isBot ? '16px 16px 16px 2px' : '16px 16px 2px 16px',
                      padding: '12px 16px', fontSize: '0.84rem', lineHeight: '1.5',
                      background: isBot ? 'rgba(30,41,59,0.9)' : '#00A651',
                      border: isBot ? '1px solid rgba(255,255,255,0.08)' : 'none', color: '#F8FAFC'
                    }}>
                      <div style={{ whiteSpace: 'pre-line' }}>{m.text}</div>
                      <div style={{ fontSize: '0.62rem', color: isBot ? 'var(--text-muted)' : '#D1FAE5', textAlign: 'right', marginTop: '6px' }}>{m.created_at}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Admin Notes Footer */}
            <div style={{ padding: '18px 22px', borderTop: '1px solid var(--border-subtle)', background: '#0F172A', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <label style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                Super Admin Follow-Up Notes & Action Items:
              </label>
              <textarea
                value={adminNoteInput}
                onChange={(e) => setAdminNoteInput(e.target.value)}
                placeholder="Add platform feedback notes or internal team tasks..."
                rows={2}
                style={{
                  width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-card)',
                  borderRadius: '10px', padding: '10px 12px', color: '#FFFFFF', fontSize: '0.84rem'
                }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button
                  onClick={handleToggleResolved}
                  style={{
                    background: selectedConversation.is_resolved ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)',
                    border: selectedConversation.is_resolved ? '1px solid rgba(16,185,129,0.3)' : '1px solid rgba(245,158,11,0.3)',
                    borderRadius: '8px', color: selectedConversation.is_resolved ? '#10B981' : '#F59E0B',
                    padding: '7px 14px', fontSize: '0.76rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px'
                  }}
                >
                  <Check size={14} />
                  <span>{selectedConversation.is_resolved ? 'Marked Resolved' : 'Mark Pending'}</span>
                </button>

                <button
                  onClick={handleSaveNotes}
                  disabled={isSavingNote}
                  className="btn-primary"
                  style={{ padding: '7px 16px', fontSize: '0.78rem', gap: '6px' }}
                >
                  <Save size={14} />
                  <span>{isSavingNote ? 'Saving...' : 'Save Notes'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
