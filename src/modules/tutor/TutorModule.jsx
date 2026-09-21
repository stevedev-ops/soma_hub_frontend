import React from 'react';
import TutorDashboard from '../../components/views/TutorDashboard';
import LiveSessions from '../../components/views/LiveSessions';
import Marketplace from '../../components/Marketplace';
import CommunityChat from '../../components/views/CommunityChat';
import CurriculumExplorer from '../../components/views/CurriculumExplorer';
import CreatorStudio from '../../components/views/CreatorStudio';
import DigitalEReader from '../../components/views/DigitalEReader';
import HolidayTuitionSprint from '../../components/views/HolidayTuitionSprint';

export default function TutorModule({ activeTab, setActiveTab, tutors, pods, onSwitchToCreator }) {
  return (
    <div>
      {activeTab === 'creator_studio' && (
        <CreatorStudio 
          onNavigateTab={(tab) => setActiveTab && setActiveTab(tab)}
          onSwitchToTeacher={() => setActiveTab && setActiveTab('tutor_desk')}
        />
      )}

      {activeTab === 'curriculum_library' && (
        <CurriculumExplorer />
      )}

      {activeTab === 'tutor_desk' && (
        <TutorDashboard 
          onNavigateToCreator={() => {
            if (onSwitchToCreator) onSwitchToCreator();
            else if (setActiveTab) setActiveTab('creator_studio');
          }}
        />
      )}

      {activeTab === 'ereader' && (
        <DigitalEReader />
      )}

      {activeTab === 'holiday_tuition' && (
        <HolidayTuitionSprint />
      )}

      {activeTab === 'chat' && (
        <CommunityChat />
      )}

      {activeTab === 'live' && (
        <LiveSessions />
      )}

      {activeTab === 'marketplace' && (
        <Marketplace tutors={tutors} pods={pods} onNavigateTab={(tab) => setActiveTab && setActiveTab(tab)} />
      )}

      {!['creator_studio', 'curriculum_library', 'tutor_desk', 'ereader', 'holiday_tuition', 'chat', 'live', 'marketplace'].includes(activeTab) && (
        <TutorDashboard 
          onNavigateToCreator={() => {
            if (onSwitchToCreator) onSwitchToCreator();
            else if (setActiveTab) setActiveTab('creator_studio');
          }}
        />
      )}
    </div>
  );
}
