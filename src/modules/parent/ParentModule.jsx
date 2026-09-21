import React from 'react';
import DailyOS from '../../components/DailyOS';
import BoxCatalog from '../../components/BoxCatalog';
import ReadingProgram from '../../components/views/ReadingProgram';
import RevisionTests from '../../components/views/RevisionTests';
import ScienceLab from '../../components/ScienceLab';
import ArtStudio from '../../components/views/ArtStudio';
import CommunityEvents from '../../components/views/CommunityEvents';
import LiveSessions from '../../components/views/LiveSessions';
import ReportCard from '../../components/ReportCard';
import Marketplace from '../../components/Marketplace';
import ParentAcademy from '../../components/views/ParentAcademy';
import CurriculumExplorer from '../../components/views/CurriculumExplorer';
import SundayPrepDigest from '../../components/views/SundayPrepDigest';
import DigitalEReader from '../../components/views/DigitalEReader';
import HolidayTuitionSprint from '../../components/views/HolidayTuitionSprint';

// Views & Dashboards
import FamilyCommandCenter from '../../components/views/FamilyCommandCenter';
import LegalConcierge from '../../components/views/LegalConcierge';
import TermWeeksNavigator from '../../components/views/TermWeeksNavigator';
import CommunityChat from '../../components/views/CommunityChat';
import AttendanceRegister from '../../components/views/AttendanceRegister';
import PlacementEngine from '../learning/PlacementEngine';
import { ilpStore } from '../../services/portfolioStore';

export default function ParentModule({
  activeTab,
  setActiveTab,
  schedule,
  packages,
  reportData,
  tutors,
  pods,
  childrenList = [],
  setChildrenList,
  activeStudent,
  setActiveStudent,
  onOpenAddChild,
  onOpenPrintable,
  onBuyPackage
}) {
  const currentChild = childrenList?.find(c => c.id === activeStudent) || childrenList?.[0] || { name: 'Liam Kiprop', grade: 'Grade 4 CBC' };

  const handleSelectCurriculumForStudent = (childId, pkg) => {
    if (setChildrenList) {
      setChildrenList(prev => prev.map(c => {
        if (c.id === childId) {
          return {
            ...c,
            curriculum: pkg.curriculum_code,
            grade: `${pkg.grade_level} (${pkg.curriculum_code})`
          };
        }
        return c;
      }));
    }
  };

  return (
    <div>
      {activeTab === 'family_dashboard' && (
        <FamilyCommandCenter
          childrenList={childrenList}
          onSelectChild={(childId) => setActiveStudent(childId)}
          onOpenAddChild={onOpenAddChild}
          onOpenBookTutor={() => setActiveTab('marketplace')}
          onNavigateTab={(tab) => setActiveTab(tab)}
        />
      )}

      {activeTab === 'curriculum_library' && (
        <CurriculumExplorer
          currentStudent={currentChild}
          onSelectCurriculumForStudent={handleSelectCurriculumForStudent}
          onOpenPrintable={onOpenPrintable}
        />
      )}

      {activeTab === 'ereader' && (
        <DigitalEReader />
      )}

      {activeTab === 'holiday_tuition' && (
        <HolidayTuitionSprint />
      )}

      {activeTab === 'daily' && (
        <DailyOS
          schedule={schedule}
          onOpenPrintable={onOpenPrintable}
          onOpenLab={() => setActiveTab('science')}
        />
      )}

      {activeTab === 'sunday_prep' && (
        <SundayPrepDigest />
      )}

      {activeTab === 'attendance' && (
        <AttendanceRegister
          studentName={currentChild.name}
          gradeLevel={currentChild.grade}
        />
      )}

      {activeTab === 'placement' && (
        <PlacementEngine
          activeChild={currentChild.name}
          onApplyILP={(data) => {
            ilpStore.apply(data);
            setActiveTab('daily');
          }}
        />
      )}

      {activeTab === 'weeks' && (
        <TermWeeksNavigator
          onSelectWeek={(w) => setActiveTab('daily')}
        />
      )}

      {activeTab === 'catalog' && (
        <BoxCatalog
          packages={packages}
          onBuyPackage={onBuyPackage}
        />
      )}

      {activeTab === 'chat' && (
        <CommunityChat />
      )}

      {activeTab === 'legal' && (
        <LegalConcierge />
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

      {activeTab === 'events' && (
        <CommunityEvents />
      )}

      {activeTab === 'live' && (
        <LiveSessions />
      )}

      {activeTab === 'report' && (
        <ReportCard reportData={reportData} />
      )}

      {activeTab === 'academy' && (
        <ParentAcademy />
      )}

      {activeTab === 'marketplace' && (
        <Marketplace tutors={tutors} pods={pods} onNavigateTab={(tab) => setActiveTab(tab)} />
      )}
    </div>
  );
}
