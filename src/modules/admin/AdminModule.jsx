import React from 'react';
import AdminDashboard from '../../components/views/AdminDashboard';
import LegalConcierge from '../../components/views/LegalConcierge';
import Marketplace from '../../components/Marketplace';

export default function AdminModule({ activeTab, tutors, pods }) {
  return (
    <div>
      {(activeTab === 'admin_hq' || !activeTab || !['legal', 'marketplace'].includes(activeTab)) && (
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