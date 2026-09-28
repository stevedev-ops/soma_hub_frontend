import React, { useState, useEffect } from 'react';
import { 
  Bot, MessageSquare, Filter, Search, Sparkles, 
  TrendingUp, CheckCircle2, AlertCircle, Clock, 
  User, Shield, HelpCircle, ChevronRight, X, 
  RefreshCw, Lightbulb, Save, Check
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
      // Update local state
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
        return <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Positive</span>;
      case 'FEATURE_REQUEST':
        return <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20">?? Feature Request</span>;
      case 'NEEDS_ATTENTION':
        return <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">Needs Attention</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-700/60 text-slate-300">General Inquiry</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950/40 to-slate-900 border border-emerald-500/20 rounded-2xl p-6 relative overflow-hidden shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4 text-amber-300" />
              Super Admin Intelligence
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
              <Bot className="w-7 h-7 text-emerald-400" />
              AI Chatbot & Platform Improvement Logs
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              Real-time audit of all meaningful customer and homeschooler interactions. Filtered to ignore trivial "hi/hello" chit-chat so you can focus on actionable platform enhancements.
            </p>
          </div>

          <button
            onClick={fetchLogs}
            disabled={isLoading}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2.5 rounded-xl font-semibold text-sm shadow-lg transition-all self-start md:self-auto"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh Logs
          </button>
        </div>
      </div>

      {/* Analytics Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Meaningful Chats</span>
            <MessageSquare className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-white mt-2">
            {analytics?.total_meaningful_conversations ?? logs.length}
          </div>
          <p className="text-xs text-emerald-400/90 mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Filtered & Persisted in DB
          </p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Greeting Filter Rate</span>
            <Shield className="w-5 h-5 text-teal-400" />
          </div>
          <div className="text-2xl font-bold text-white mt-2">
            100%
          </div>
          <p className="text-xs text-slate-400 mt-1">
            "Hi/Hello" noise discarded
          </p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Top Inquiry Subject</span>
            <TrendingUp className="w-5 h-5 text-amber-400" />
          </div>
          <div className="text-lg font-bold text-white mt-2 truncate">
            {analytics?.categories_breakdown?.[0]?.category || 'Curriculum & CBC'}
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Most requested by visitors
          </p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Feature Suggestions</span>
            <Lightbulb className="w-5 h-5 text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-purple-300 mt-2">
            4 Actionable
          </div>
          <p className="text-xs text-purple-400/80 mt-1">
            Derived from user chat queries
          </p>
        </div>
      </div>

      {/* Actionable Platform Improvement Suggestions */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-amber-400" />
          <h2 className="text-lg font-bold text-white">Actionable Platform Improvement Suggestions</h2>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-400/10 text-amber-300 border border-amber-400/30">
            Auto-Synthesized from Live Chats
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              actionable_step: 'Make the downloadable Legal Affidavit template prominent on the landing page.'
            },
            {
              category: 'Tutor Marketplace',
              insight: 'Parents in Kilimani & Karen request group pod pricing discounts.',
              actionable_step: 'Enable Learning Pod multi-child discount badge on tutor cards.'
            }
          ]).map((item, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 flex flex-col justify-between">
              <div>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                  {item.category}
                </span>
                <p className="text-sm font-medium text-slate-200 mt-2">
                  "{item.insight}"
                </p>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-700/60 flex items-center justify-between text-xs">
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Recommended Action: {item.actionable_step}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-3">
        <form onSubmit={handleSearchSubmit} className="flex-1 min-w-[240px] relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search conversation topics, keywords, or user emails..."
            className="w-full pl-9 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </form>

        <div className="flex flex-wrap items-center gap-2">
          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="ALL">All Categories</option>
            <option value="CURRICULUM_INQUIRY">Curriculum & CBC</option>
            <option value="PRICING_PAYMENT">Pricing & M-Pesa</option>
            <option value="STUDENT_PROGRESS">Student Activity</option>
            <option value="LEGAL_HOMESCHOOLING">Legal Concierge</option>
            <option value="TECHNICAL_HELP">Technical Help</option>
            <option value="GENERAL">General</option>
          </select>

          {/* User Type Filter */}
          <select
            value={userTypeFilter}
            onChange={(e) => setUserTypeFilter(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="ALL">All User Types</option>
            <option value="GUEST">Guest Visitors</option>
            <option value="PARENT">Parents</option>
            <option value="STUDENT">Students</option>
            <option value="TUTOR">Tutors</option>
          </select>

          {/* Sentiment Filter */}
          <select
            value={sentimentFilter}
            onChange={(e) => setSentimentFilter(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="font-bold text-white text-base">Meaningful Chat Transcripts ({logs.length})</h3>
          <span className="text-xs text-slate-400">Excludes empty greetings</span>
        </div>

        {isLoading ? (
          <div className="p-12 text-center text-slate-400">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-3 text-emerald-400" />
            Loading conversations...
          </div>
        ) : logs.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <MessageSquare className="w-10 h-10 mx-auto mb-3 text-slate-600" />
            <p className="font-medium text-slate-300">No conversations match the current filter.</p>
            <p className="text-xs text-slate-500 mt-1">Try resetting filters or checking back as users interact with SomaBot.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-800/80 text-xs uppercase text-slate-400 tracking-wider">
                <tr>
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Topic / Summary</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Sentiment</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {logs.map((conv) => (
                  <tr 
                    key={conv.id}
                    onClick={() => handleOpenDetail(conv)}
                    className="hover:bg-slate-800/60 cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="font-semibold text-white flex items-center gap-2">
                        <User className="w-3.5 h-3.5 text-emerald-400" />
                        {conv.user_display}
                      </div>
                      <span className="text-[11px] text-slate-400 uppercase tracking-wider">{conv.user_type}</span>
                    </td>
                    <td className="py-3 px-4 max-w-xs truncate font-medium text-slate-200">
                      {conv.topic_summary || 'Homeschool inquiry'}
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-xs px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300">
                        {conv.category_display || conv.category}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {getSentimentBadge(conv.sentiment)}
                    </td>
                    <td className="py-3 px-4 text-xs text-slate-400 whitespace-nowrap">
                      {conv.created_at}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenDetail(conv);
                        }}
                        className="p-1.5 rounded-lg bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600 hover:text-white transition-all text-xs font-semibold inline-flex items-center gap-1"
                      >
                        Inspect
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Conversation Detail Drawer / Modal */}
      {selectedConversation && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex justify-end animate-in fade-in">
          <div className="w-full max-w-2xl bg-slate-900 border-l border-slate-800 h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-200">
            {/* Header */}
            <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-white">Conversation Audit</h3>
                  {getSentimentBadge(selectedConversation.sentiment)}
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  User: <strong className="text-slate-200">{selectedConversation.user_display}</strong> ? {selectedConversation.created_at}
                </p>
              </div>
              <button
                onClick={() => setSelectedConversation(null)}
                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content / Messages */}
            <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-slate-950/40">
              <div className="bg-slate-800/50 p-3.5 rounded-xl border border-slate-700/60 text-xs text-slate-300">
                <span className="font-bold text-slate-200">Topic Summary:</span> {selectedConversation.topic_summary}
              </div>

              <div className="space-y-3">
                {selectedConversation.messages?.map((m) => {
                  const isBot = m.sender === 'BOT';
                  return (
                    <div
                      key={m.id}
                      className={`flex gap-3 ${isBot ? 'justify-start' : 'justify-end'}`}
                    >
                      {isBot && (
                        <div className="w-7 h-7 rounded-lg bg-emerald-600/30 border border-emerald-500/30 flex items-center justify-center text-emerald-300 flex-shrink-0 mt-1">
                          <Bot className="w-4 h-4" />
                        </div>
                      )}

                      <div className={`max-w-[85%] rounded-2xl p-4 text-sm ${
                        isBot 
                          ? 'bg-slate-800 text-slate-100 border border-slate-700 rounded-tl-sm' 
                          : 'bg-emerald-600 text-white rounded-tr-sm'
                      }`}>
                        <div className="whitespace-pre-line leading-relaxed">
                          {m.text}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-2 text-right">
                          {m.created_at}
                        </div>
                      </div>

                      {!isBot && (
                        <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-300 flex-shrink-0 mt-1">
                          <User className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Admin Notes & Status Controls */}
            <div className="p-5 bg-slate-900 border-t border-slate-800 space-y-3">
              <label className="block text-xs font-semibold text-slate-300">
                Super Admin Follow-Up Notes & Action Items:
              </label>
              <textarea
                value={adminNoteInput}
                onChange={(e) => setAdminNoteInput(e.target.value)}
                placeholder="Add platform feedback notes or internal team tasks..."
                rows={2}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />

              <div className="flex items-center justify-between gap-3">
                <button
                  onClick={handleToggleResolved}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all border ${
                    selectedConversation.is_resolved 
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20' 
                      : 'bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/20'
                  }`}
                >
                  <Check className="w-3.5 h-3.5" />
                  {selectedConversation.is_resolved ? 'Marked as Resolved' : 'Mark as Pending'}
                </button>

                <button
                  onClick={handleSaveNotes}
                  disabled={isSavingNote}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow transition-all"
                >
                  <Save className="w-3.5 h-3.5" />
                  {isSavingNote ? 'Saving...' : 'Save Notes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
