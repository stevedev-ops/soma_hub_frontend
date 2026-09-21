import React from 'react';
import AdminDashboard from '../../components/views/AdminDashboard';
import LegalConcierge from '../../components/views/LegalConcierge';
import Marketplace from '../../components/Marketplace';
import CurriculumExplorer from '../../components/views/CurriculumExplorer';

export default function AdminModule({ activeTab, tutors = [], pods = [] }) {
  return (
    <div>
      {activeTab === 'curriculum_library' && (
        <CurriculumExplorer />
      )}

      {(activeTab === 'admin_hq' || !activeTab) && (
        <AdminDashboard />
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
