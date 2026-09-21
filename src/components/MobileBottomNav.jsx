import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Calendar, BookOpen, Users, Award, UserCheck, Sparkles, CheckSquare, DollarSign, MessageSquare } from 'lucide-react';

export default function MobileBottomNav({ activeTab, setActiveTab }) {
  const { currentUser } = useAuth();
  const role = currentUser?.role || 'parent';

  const navItemsByRole = {
    parent: [
      { id: 'family_dashboard', label: 'Home', icon: LayoutDashboard },
      { id: 'daily', label: 'Daily OS', icon: Calendar },
      { id: 'curriculum_library', label: 'Curriculum', icon: BookOpen },
      { id: 'marketplace', label: 'Pods & Tutors', icon: Users },
      { id: 'report', label: 'Portfolio', icon: Award },
    ],
    tutor: [
      { id: 'tutor_desk', label: 'Schedule', icon: Calendar },
      { id: 'curriculum_library', label: 'Syllabi', icon: BookOpen },
      { id: 'marketplace', label: 'Directory', icon: Users },
      { id: 'creator_studio', label: 'Creator Hub', icon: Sparkles },
    ],
    creator: [
      { id: 'creator_studio', label: 'Studio', icon: Sparkles },
      { id: 'curriculum_library', label: 'Templates', icon: BookOpen },
      { id: 'marketplace', label: 'Pods', icon: Users },
      { id: 'chat', label: 'Chat', icon: MessageSquare },
    ],
    student: [
      { id: 'student_home', label: 'Missions', icon: Calendar },
      { id: 'tests', label: 'Quiz XP', icon: CheckSquare },
      { id: 'reading', label: 'Stories', icon: BookOpen },
      { id: 'live', label: 'Live', icon: Users },
    ],
    admin: [
      { id: 'admin_hq', label: 'HQ', icon: LayoutDashboard },
      { id: 'curriculum_library', label: 'Catalog', icon: BookOpen },
      { id: 'marketplace', label: 'Directory', icon: Users },
    ]
  };

  const currentItems = navItemsByRole[role] || navItemsByRole.parent;

  return (
    <nav className="mobile-bottom-nav" style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      background: 'rgba(11, 19, 43, 0.95)',
      backdropFilter: 'blur(16px)',
      borderTop: '1px solid rgba(0, 166, 81, 0.3)',
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      padding: '8px 4px',
      zIndex: 9998
    }}>
      {currentItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;

        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            style={{
              background: 'transparent',
              border: 'none',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '3px',
              color: isActive ? '#34D399' : '#94A3B8',
              cursor: 'pointer',
              padding: '4px 8px',
              borderRadius: '8px',
              flex: 1,
              transition: 'all 0.15s ease'
            }}
          >
            <Icon size={18} color={isActive ? '#34D399' : '#94A3B8'} />
            <span style={{ fontSize: '0.64rem', fontWeight: isActive ? 800 : 500 }}>
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
