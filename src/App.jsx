import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import ParentModule from './modules/parent/ParentModule';
import StudentModule from './modules/student/StudentModule';
import TutorModule from './modules/tutor/TutorModule';
import AdminModule from './modules/admin/AdminModule';
import CreatorModule from './modules/creator/CreatorModule';
import LoginPage from './modules/auth/LoginPage';
import AddChildModal from './modules/parent/AddChildModal';
import MpesaModal from './components/MpesaModal';
import SundayPrintableModal from './components/SundayPrintableModal';
import PublicCurriculumPreviewModal from './components/PublicCurriculumPreviewModal';
import MobileBottomNav from './components/MobileBottomNav';
import { api } from './services/api';
import OnboardingWizard from './modules/parent/OnboardingWizard';
import SENSettingsModal, { applySENSettings } from './modules/parent/SENSettingsModal';
import ParentAcademy from './components/views/ParentAcademy';
import { onboardingStore, senStore } from './services/portfolioStore';
import { creatorStore } from './services/creatorStore';
import { referralAttributionStore } from './services/referralAttributionStore';

function MainApp() {
  const { currentUser, isLoginModalOpen, setIsLoginModalOpen, switchAccount } = useAuth();
  const [activeTab, setActiveTab] = useState('family_dashboard');
  const [activeStudent, setActiveStudent] = useState('liam');

  // Enrolled children managed in persistent family state
  const [childrenList, setChildrenList] = useState(() => {
    const saved = localStorage.getItem('somahome_parent_children_v3');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('somahome_parent_children_v3', JSON.stringify(childrenList));
  }, [childrenList]);

  const [isAddChildModalOpen, setIsAddChildModalOpen] = useState(false);

  const handleAddChild = (newChild) => {
    setChildrenList((prev) => [...prev, newChild]);
    setActiveStudent(newChild.id);
  };

  const [packages, setPackages] = useState([]);
  const [schedule, setSchedule] = useState(null);
  const [reportData, setReportData] = useState(null);
  const [tutors, setTutors] = useState([]);
  const [pods, setPods] = useState([]);

  // Modals & Public Shareable Link Handler
  const [selectedPackageForMpesa, setSelectedPackageForMpesa] = useState(null);
  const [isPrintableOpen, setIsPrintableOpen] = useState(false);
  const [previewTemplateId, setPreviewTemplateId] = useState(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showSEN, setShowSEN] = useState(false);

  // Check URL parameters on mount for Public Creator Template links (e.g. ?template=mama_teaches_cbc4)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    referralAttributionStore.ingestUrlParams();
    const templateParam = params.get('template') || params.get('ref_template') || params.get('preview');
    if (templateParam) {
      setPreviewTemplateId(templateParam);
    }
  }, []);

  // Apply SEN settings on mount
  useEffect(() => {
    const settings = senStore.get();
    const hasAnySen = settings.dyslexiaFont || settings.highContrast || settings.largeFonts || settings.extendedTime;
    if (hasAnySen) applySENSettings(settings);
  }, []);

  // Show onboarding wizard for new parents
  useEffect(() => {
    if (currentUser?.role === 'parent' && !onboardingStore.isDone()) {
      setTimeout(() => setShowOnboarding(true), 800);
    }
  }, [currentUser?.role]);

  // Sync active tab when user role changes
  useEffect(() => {
    if (currentUser?.role === 'student') setActiveTab('student_home');
    else if (currentUser?.role === 'tutor') setActiveTab('tutor_desk');
    else if (currentUser?.role === 'creator') setActiveTab('creator_studio');
    else if (currentUser?.role === 'admin') setActiveTab('admin_hq');
    else setActiveTab('family_dashboard');
  }, [currentUser?.role]);

  useEffect(() => {
    async function loadData() {
      const selectedChild = childrenList.find(c => c.id === activeStudent);
      const studentIdNum = selectedChild?.curriculum === 'Cambridge' ? 2 : 1;

      const [pkgs, sched, rpt, tuts, pd] = await Promise.all([
        api.getPackages(),
        api.getTodaySchedule(studentIdNum),
        api.getReportCard(),
        api.getTutors(),
        api.getPods()
      ]);
      setPackages(pkgs);
      setSchedule(sched);
      setReportData(rpt);
      setTutors(tuts);
      setPods(pd);
    }
    loadData();
  }, [activeStudent, childrenList]);

  const handleTemplateApplied = (template, childId) => {
    setPreviewTemplateId(null);
    if (childId) setActiveStudent(childId);
    setActiveTab('daily');
  };

  // Unauthenticated Gate: Open directly on the Login & Registration screen
  if (!currentUser) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg-app)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <LoginPage />
        {previewTemplateId && (
          <PublicCurriculumPreviewModal
            templateId={previewTemplateId}
            isOpen={!!previewTemplateId}
            onClose={() => setPreviewTemplateId(null)}
            onTemplateApplied={handleTemplateApplied}
            childrenList={childrenList}
          />
        )}
      </div>
    );
  }

  return (
    <div className="app-layout">
      {/* Modular Dynamic Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activeStudent={activeStudent}
        setActiveStudent={setActiveStudent}
        childrenList={childrenList}
        onAddChild={handleAddChild}
        onOpenPrintable={() => setIsPrintableOpen(true)}
        onOpenSEN={() => setShowSEN(true)}
      />

      {/* Main Content Area: Role-Based Module Rendering */}
      <main className="app-main">
        {currentUser?.role === 'parent' && (
          <ParentModule
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            schedule={schedule}
            packages={packages}
            reportData={reportData}
            tutors={tutors}
            pods={pods}
            childrenList={childrenList}
            setChildrenList={setChildrenList}
            activeStudent={activeStudent}
            setActiveStudent={setActiveStudent}
            onOpenAddChild={() => setIsAddChildModalOpen(true)}
            onOpenPrintable={() => setIsPrintableOpen(true)}
            onOpenSEN={() => setShowSEN(true)}
            onBuyPackage={(pkg) => setSelectedPackageForMpesa(pkg)}
            onOpenCreatorTemplate={(tplId) => setPreviewTemplateId(tplId)}
          />
        )}

        {currentUser?.role === 'student' && (
          <StudentModule
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        )}

        {currentUser?.role === 'tutor' && (
          <TutorModule
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            tutors={tutors}
            pods={pods}
            onSwitchToCreator={() => switchAccount('creator')}
          />
        )}

        {currentUser?.role === 'creator' && (
          <CreatorModule
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            tutors={tutors}
            pods={pods}
            onSwitchToTeacher={() => switchAccount('tutor')}
          />
        )}

        {currentUser?.role === 'admin' && (
          <AdminModule
            activeTab={activeTab}
            tutors={tutors}
            pods={pods}
          />
        )}

        <footer style={{ textAlign: 'center', marginTop: '60px', color: 'var(--text-muted)', fontSize: '0.8rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '20px' }}>
          SomaHome Kenya • Modular Turnkey Homeschool-in-a-Box & Community Platform • Aligned with KICD & Cambridge Syllabi
        </footer>
      </main>

      {/* Mobile Bottom Navigation Bar (Shown on Mobile Viewports) */}
      <MobileBottomNav activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Public Curriculum Preview & 1-Click Adopt Modal (Accessible via link without login) */}
      {previewTemplateId && (
        <PublicCurriculumPreviewModal
          templateId={previewTemplateId}
          isOpen={!!previewTemplateId}
          onClose={() => setPreviewTemplateId(null)}
          onTemplateApplied={handleTemplateApplied}
          childrenList={childrenList}
        />
      )}

      {/* Authentication & Account Switcher Modal */}
      {isLoginModalOpen && (
        <LoginPage onClose={() => setIsLoginModalOpen(false)} />
      )}

      {/* Add Child Modal */}
      {isAddChildModalOpen && (
        <AddChildModal
          isOpen={isAddChildModalOpen}
          onClose={() => setIsAddChildModalOpen(false)}
          onChildAdded={handleAddChild}
        />
      )}

      {/* M-Pesa STK Push Modal */}
      {selectedPackageForMpesa && (
        <MpesaModal
          packageData={selectedPackageForMpesa}
          onClose={() => setSelectedPackageForMpesa(null)}
          onUnlocked={() => {
            setSelectedPackageForMpesa(null);
            setActiveTab('daily');
          }}
        />
      )}

      {/* Sunday Printable Pack Modal */}
      {isPrintableOpen && (
        <SundayPrintableModal onClose={() => setIsPrintableOpen(false)} />
      )}

      {/* Onboarding Wizard */}
      {showOnboarding && (
        <OnboardingWizard onComplete={() => { setShowOnboarding(false); setActiveTab('family_dashboard'); }} />
      )}

      {/* SEN Accessibility Modal */}
      <SENSettingsModal isOpen={showSEN} onClose={() => setShowSEN(false)} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
