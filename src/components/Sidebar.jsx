import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import UserProfilePill from '../modules/auth/UserProfilePill';
import AddChildModal from '../modules/parent/AddChildModal';
import { GraduationCap, Eye,
  Calendar, ShoppingBag, Sparkles, Award, Users, Printer,
  BookOpen, CheckSquare, Palette, Compass, Video, UserCheck, BarChart3,
  LogIn, Scale, MessageSquare, ListChecks, ChevronRight, Plus, LayoutDashboard, Clock, Send, Library, Zap, DollarSign, Share2
} from 'lucide-react';

export default function Sidebar({
  activeTab, setActiveTab,
  activeStudent, setActiveStudent,
  childrenList = [],
  onAddChild,
  onOpenPrintable,
  onOpenSEN
}) {
  const { currentUser, setIsLoginModalOpen, switchAccount } = useAuth();
  const activeRole = currentUser?.role || 'parent';
  const [isAddChildOpen, setIsAddChildOpen] = useState(false);

  // Streamlined 4-Core Parent Navigation
  const parentNavGroups = [
    {
      group: 'Homeschool OS',
      items: [
        { id: 'family_dashboard', label: 'Family Command Hub', icon: LayoutDashboard, badge: 'Overview' },
        { id: 'daily', label: "Today's 3h Lesson Plan", icon: Calendar, badge: 'Daily OS' },
        { id: 'curriculum_library', label: 'Curriculum & Syllabi Hub', icon: BookOpen, badge: 'Syllabi' },
        { id: 'marketplace', label: 'Estate Pods & Tutors', icon: Users, badge: 'Directory' },
        { id: 'report', label: 'CBC Assessment Portfolio', icon: Award, badge: 'Portfolio' },
      ]
    }
  ];

  // Pure Learner Experience
  const studentNav = [
    {
      group: 'My Quests',
      items: [
        { id: 'student_home', label: 'My Learning Missions', icon: Calendar, badge: 'Quests' },
        { id: 'tests', label: 'Quiz Arcade & XP', icon: CheckSquare, badge: 'Win XP' },
        { id: 'reading', label: 'Story Reading Room', icon: BookOpen, badge: 'Voice AI' },
        { id: 'live', label: 'Live Masterclasses', icon: Video, badge: 'Virtual' },
      ]
    }
  ];

  // Tutor / Facilitator Nav
  const tutorNav = [
    {
      group: 'Facilitator Desk',
      items: [
        { id: 'tutor_desk', label: 'Teaching Schedule & Pods', icon: Calendar, badge: 'Planner' },
        { id: 'curriculum_library', label: 'Universal Curriculum Hub', icon: BookOpen, badge: 'All Syllabi' },
        { id: 'marketplace', label: 'Client Bookings & Directory', icon: Users, badge: 'Clients' },
        { id: 'live', label: 'Live Masterclasses', icon: Video, badge: 'Host' },
      ]
    }
  ];

  // Creator / Influencer Nav
  const creatorNav = [
    {
      group: 'Creator Studio',
      items: [
        { id: 'creator_studio', label: 'Creator Studio & Bio Links', icon: Sparkles, badge: 'Bio Link' },
        { id: 'curriculum_library', label: 'Curriculum & Syllabi Hub', icon: BookOpen, badge: 'Templates' },
        { id: 'marketplace', label: 'Estate Pods Directory', icon: Users, badge: 'Directory' },
        { id: 'chat', label: 'Community & Follower Chat', icon: MessageSquare, badge: 'Inbox' },
      ]
    }
  ];

  const adminNav = [
    {
      group: 'Operations HQ',
      items: [
        { id: 'curriculum_library', label: 'Universal Curriculum Engine', icon: BookOpen, badge: 'Catalog' },
        { id: 'admin_hq', label: 'Platform Operations HQ', icon: BarChart3, badge: 'Metrics' },
        { id: 'marketplace', label: 'Tutors & Pods Directory', icon: Users, badge: 'Manage' },
      ]
    }
  ];

  let currentNavGroups = parentNavGroups;
  if (activeRole === 'student') currentNavGroups = studentNav;
  else if (activeRole === 'tutor') currentNavGroups = tutorNav;
  else if (activeRole === 'creator') currentNavGroups = creatorNav;
  else if (activeRole === 'admin') currentNavGroups = adminNav;

  return (
    <>
      <aside 
        className="app-sidebar" 
        style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'flex-start',
          height: '100vh',
          position: 'sticky',
          top: 0,
          overflowY: 'auto'
        }}
      >
        {/* Top Header & Brand */}
        <div style={{ marginBottom: '16px', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <div style={{
              width: '38px', height: '38px', borderRadius: '12px', background: '#00A651',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem',
              boxShadow: '0 4px 12px rgba(0, 166, 81, 0.35)'
            }}>
              🇰🇪
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '1.15rem', fontWeight: 900, letterSpacing: '-0.02em', color: '#FFFFFF' }}>
                  SomaHome
                </span>
                <span style={{
                  fontSize: '0.65rem', background: 'rgba(0, 166, 81, 0.2)', color: '#34D399',
                  padding: '1px 6px', borderRadius: '4px', fontWeight: 800, textTransform: 'uppercase'
                }}>
                  Kenya
                </span>
              </div>
              <p style={{ margin: '2px 0 0 0', fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                Elimu Bila Stress • Turnkey Homeschool OS
              </p>
            </div>
          </div>

          {/* User Profile Pill & Quick Role Switcher */}
          <div style={{ marginBottom: '12px' }}>
            <UserProfilePill />
          </div>

          {/* Child Selector & Add Child Panel (When logged in as parent) */}
          {activeRole === 'parent' && (
            <div style={{
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '12px',
              padding: '10px 12px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Active Learner:
                </label>
                <button
                  type="button"
                  onClick={() => setIsAddChildOpen(true)}
                  className="glass-pill"
                  style={{
                    fontSize: '0.64rem',
                    padding: '2px 7px',
                    color: '#34D399',
                    border: '1px solid rgba(0, 166, 81, 0.4)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '3px',
                    fontWeight: 700
                  }}
                  title="Add another child to your family homeschool"
                >
                  <Plus size={10} />
                  <span>Add Child</span>
                </button>
              </div>

              <select
                className="custom-select"
                value={activeStudent}
                onChange={(e) => {
                  if (e.target.value === '__add_new__') {
                    setIsAddChildOpen(true);
                  } else {
                    setActiveStudent(e.target.value);
                  }
                }}
                style={{ width: '100%', fontSize: '0.8rem', padding: '6px 28px 6px 8px' }}
              >
                {childrenList.map((child) => (
                  <option key={child.id} value={child.id}>
                    {child.curriculum === 'CBC' ? '👦' : '👧'} {child.name} — {child.grade}
                  </option>
                ))}
                <option value="__add_new__">➕ + Enroll Another Child...</option>
              </select>
            </div>
          )}
        </div>

        {/* Middle Section: Navigation Items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', flex: 1 }}>
          {currentNavGroups.map((groupObj, gIdx) => (
            <div key={gIdx} style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <div style={{
                fontSize: '0.64rem',
                color: 'var(--text-muted)',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                paddingLeft: '8px',
                marginBottom: '4px'
              }}>
                {groupObj.group}
              </div>

              {groupObj.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: isActive
                        ? 'linear-gradient(90deg, rgba(0, 166, 81, 0.22) 0%, rgba(16, 185, 129, 0.08) 100%)'
                        : 'transparent',
                      color: isActive ? '#F8FAFC' : 'var(--text-secondary)',
                      border: 'none',
                      borderLeft: isActive ? '3px solid #00A651' : '3px solid transparent',
                      borderRadius: '0 8px 8px 0',
                      padding: '8px 10px',
                      fontSize: '0.82rem',
                      fontWeight: isActive ? 700 : 500,
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
                      <Icon size={15} color={isActive ? '#34D399' : '#64748B'} />
                      <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {item.label}
                      </span>
                    </div>
                    {item.badge && (
                      <span style={{
                        fontSize: '0.62rem',
                        background: isActive ? 'rgba(0, 166, 81, 0.35)' : 'rgba(255, 255, 255, 0.05)',
                        color: isActive ? '#34D399' : 'var(--text-muted)',
                        border: isActive ? '1px solid rgba(0, 166, 81, 0.4)' : '1px solid transparent',
                        padding: '1px 6px',
                        borderRadius: '10px',
                        fontWeight: 700,
                        flexShrink: 0
                      }}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Bottom Actions Bar */}
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '8px', 
          paddingTop: '14px', 
          borderTop: '1px solid var(--border-subtle)', 
          marginTop: '16px',
          flexShrink: 0
        }}>
          <button
            onClick={onOpenPrintable}
            className="btn-secondary"
            style={{ width: '100%', fontSize: '0.8rem', padding: '8px', justifyContent: 'center', gap: '8px' }}
          >
            <Printer size={14} color="#F59E0B" />
            <span>Sunday Print Pack (12p)</span>
          </button>

          <button
            onClick={() => setIsLoginModalOpen(true)}
            className="btn-secondary"
            style={{ width: '100%', fontSize: '0.8rem', padding: '8px', justifyContent: 'center', gap: '8px', color: 'var(--text-muted)' }}
          >
            <LogIn size={14} />
            <span>Account Switcher / Register</span>
          </button>
        </div>
      </aside>

      {/* Add Child Enrollment Modal */}
      {isAddChildOpen && (
        <AddChildModal
          isOpen={isAddChildOpen}
          onClose={() => setIsAddChildOpen(false)}
          onChildAdded={onAddChild}
        />
      )}
    </>
  );
}
