import React from 'react';
import StudentDashboard from '../../components/views/StudentDashboard';
import ReadingProgram from '../../components/views/ReadingProgram';
import RevisionTests from '../../components/views/RevisionTests';
import ScienceLab from '../../components/ScienceLab';
import ArtStudio from '../../components/views/ArtStudio';
import CommunityChat from '../../components/views/CommunityChat';
import LiveSessions from '../../components/views/LiveSessions';
import DigitalEReader from '../../components/views/DigitalEReader';
import StudentShowcaseModal from './StudentShowcaseModal';

export default function StudentModule({ activeTab, setActiveTab }) {
  return (
    <div>
      {activeTab === 'student_home' && (
        <StudentDashboard
          onGoToReading={() => setActiveTab('reading')}
          onGoToQuiz={() => setActiveTab('tests')}
          onGoToChat={() => setActiveTab('chat')}
        />
      )}

      {activeTab === 'ereader' && (
        <DigitalEReader />
      )}

      {activeTab === 'showcase' && (
        <StudentShowcaseModal
          isOpen={true}
          onClose={() => setActiveTab('student_home')}
          studentName="Liam Kiprop"
          grade="Grade 4 CBC"
          isPageView={true}
        />
      )}

      {activeTab === 'chat' && (
        <CommunityChat />
      )}

      {activeTab === 'reading' && (
        <ReadingProgram />
      )}

      {activeTab === 'tests' && (
        <RevisionTests />
      )}

      {activeTab === 'science' && (
        <ScienceLab />
      )}

      {activeTab === 'art' && (
        <ArtStudio />
      )}

      {activeTab === 'live' && (
        <LiveSessions />
      )}
    </div>
  );
}
