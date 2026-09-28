import React from 'react';
import AdminDashboard from '../../components/views/AdminDashboard';
import LegalConcierge from '../../components/views/LegalConcierge';
import Marketplace from '../../components/Marketplace';
import CurriculumExplorer from '../../components/views/CurriculumExplorer';
import AdminAIChatLogs from '../../components/views/AdminAIChatLogs';

export default function AdminModule({ activeTab, setActiveTab, tutors = [], pods = [] }) {
  return (
    <div>
      {activeTab === 'curriculum_library' && (
        <CurriculumExplorer />
      )}

      {(activeTab === 'admin_hq' || !activeTab) && (
        <AdminDashboard setActiveTab={setActiveTab} />
      )}

      {activeTab === 'ai_logs' && (
        <AdminAIChatLogs />
      )}

      {activeTab === 'legal' && (
        <LegalConcierge />
      )}

      {activeTab === 'marketplace' && (
        <Marketplace tutors={tutors} pods={pods} />
      )}
    </div>
  );
}
