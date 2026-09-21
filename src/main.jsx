import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// One-time automatic purge of legacy demo/mock data from client browser localStorage
const CLEAN_VERSION = 'somahome_clean_prod_v3';
if (!localStorage.getItem(CLEAN_VERSION)) {
  const legacyKeys = [
    'somahome_user',
    'somahome_parent_children_v3',
    'somahome_parent_children_v2',
    'somahome_planning_authority_v2',
    'somahome_teacher_assigned_students_v2',
    'somahome_teacher_pod_groups_v2',
    'somahome_teacher_schedule_slots_v2',
    'somahome_cba_rubrics_v2',
    'somahome_custom_electives_v2',
    'somahome_creator_templates_v2',
    'somahome_creator_balance_kes',
    'somahome_affiliate_conversions',
    'somahome_onboarding_done_v2'
  ];
  legacyKeys.forEach(k => localStorage.removeItem(k));
  localStorage.setItem(CLEAN_VERSION, 'true');
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
