import React from 'react';
import CreatorStudio from '../../components/views/CreatorStudio';
import CurriculumExplorer from '../../components/views/CurriculumExplorer';
import Marketplace from '../../components/Marketplace';
import CommunityChat from '../../components/views/CommunityChat';

export default function CreatorModule({
  activeTab,
  setActiveTab,
  tutors = [],
  pods = [],
  onSwitchToTeacher
}) {
  return (
    <div>
      {activeTab === 'creator_studio' && (
        <CreatorStudio
          onNavigateTab={(tab) => setActiveTab && setActiveTab(tab)}
          onSwitchToTeacher={onSwitchToTeacher}
        />
      )}

      {activeTab === 'curriculum_library' && (
        <CurriculumExplorer />
      )}

      {activeTab === 'marketplace' && (
        <Marketplace
          tutors={tutors}
          pods={pods}
          onNavigateTab={(tab) => setActiveTab && setActiveTab(tab)}
        />
      )}

      {activeTab === 'chat' && (
        <CommunityChat />
      )}

      {!['creator_studio', 'curriculum_library', 'marketplace', 'chat'].includes(activeTab) && (
        <CreatorStudio
          onNavigateTab={(tab) => setActiveTab && setActiveTab(tab)}
          onSwitchToTeacher={onSwitchToTeacher}
        />
      )}
    </div>
  );
}
