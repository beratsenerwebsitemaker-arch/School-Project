import React, { useState } from 'react';
import { TestProvider, useTests } from './context/TestContext';
import { Navbar } from './components/Navbar';
import { LoginPage } from './components/Auth/LoginPage';
import { ClassStreamView } from './components/ClassStream/ClassStreamView';
import { ClassDriveView } from './components/ClassDrive/ClassDriveView';
import { TeacherOverview } from './components/TeacherDashboard/TeacherOverview';
import { TestBuilder } from './components/TeacherDashboard/TestBuilder';
import { SubmissionsGradebook } from './components/TeacherDashboard/SubmissionsGradebook';
import { ClassAnalytics } from './components/TeacherDashboard/ClassAnalytics';
import { AITestGeneratorModal } from './components/TeacherDashboard/AITestGeneratorModal';
import { StudentOverview } from './components/StudentDashboard/StudentOverview';
import { TestRunner } from './components/StudentDashboard/TestRunner';
import { TestResultsView } from './components/StudentDashboard/TestResultsView';
import { Test, TestSubmission } from './types';

const MainApp: React.FC = () => {
  const { currentUser } = useTests();

  const [currentTab, setCurrentTab] = useState<string>('stream');
  const [editingTest, setEditingTest] = useState<Test | null>(null);
  const [activeTest, setActiveTest] = useState<Test | null>(null);
  const [viewingSubmission, setViewingSubmission] = useState<TestSubmission | null>(null);
  const [aiModalOpen, setAiModalOpen] = useState(false);

  // If not logged in, show dedicated Google Classroom styled Login Portal
  if (!currentUser) {
    return <LoginPage onSuccess={() => setCurrentTab('stream')} />;
  }

  const isTeacher = currentUser.role === 'teacher';

  const handleStartTest = (test: Test) => {
    setActiveTest(test);
    setCurrentTab('running-test');
  };

  const handleFinishTest = (submission: TestSubmission) => {
    setActiveTest(null);
    setViewingSubmission(submission);
    setCurrentTab('test-results');
  };

  const handleOpenCreate = (testToEdit?: Test) => {
    setEditingTest(testToEdit || null);
    setCurrentTab('create');
  };

  return (
    <div className="min-h-screen bg-[#080B11] text-slate-100 flex flex-col selection:bg-indigo-600/30 selection:text-indigo-200">
      
      {/* Navbar (hidden in active distraction-free exam runner) */}
      {currentTab !== 'running-test' && (
        <Navbar
          currentTab={currentTab}
          onSelectTab={(tab) => {
            setCurrentTab(tab);
            setActiveTest(null);
            setViewingSubmission(null);
          }}
        />
      )}

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {/* COMMON GOOGLE CLASSROOM TABS: STREAM & CLASS DRIVE */}
        {currentTab === 'stream' && (
          <ClassStreamView
            onGoToClasswork={() => setCurrentTab('tests')}
            onGoToDrive={() => setCurrentTab('drive')}
            onStartTest={handleStartTest}
          />
        )}

        {currentTab === 'drive' && <ClassDriveView />}

        {/* TEACHER WORKFLOWS */}
        {isTeacher ? (
          <>
            {currentTab === 'tests' && (
              <TeacherOverview
                onOpenCreate={handleOpenCreate}
                onOpenGradebook={() => setCurrentTab('gradebook')}
                onPreviewAsStudent={handleStartTest}
              />
            )}

            {currentTab === 'create' && (
              <TestBuilder
                initialTest={editingTest}
                onDone={() => {
                  setEditingTest(null);
                  setCurrentTab('tests');
                }}
                onOpenAIGenerator={() => setAiModalOpen(true)}
              />
            )}

            {currentTab === 'gradebook' && <SubmissionsGradebook />}

            {currentTab === 'analytics' && <ClassAnalytics />}
          </>
        ) : (
          /* STUDENT WORKFLOWS */
          <>
            {currentTab === 'tests' && (
              <StudentOverview
                onStartTest={handleStartTest}
                onViewSubmission={(sub) => {
                  setViewingSubmission(sub);
                  setCurrentTab('test-results');
                }}
              />
            )}

            {currentTab === 'my-grades' && (
              <StudentOverview
                onStartTest={handleStartTest}
                onViewSubmission={(sub) => {
                  setViewingSubmission(sub);
                  setCurrentTab('test-results');
                }}
              />
            )}

            {currentTab === 'running-test' && activeTest && (
              <TestRunner
                test={activeTest}
                onFinish={handleFinishTest}
                onExit={() => {
                  setActiveTest(null);
                  setCurrentTab('tests');
                }}
              />
            )}

            {currentTab === 'test-results' && viewingSubmission && (
              <TestResultsView
                submission={viewingSubmission}
                onBackToDashboard={() => {
                  setViewingSubmission(null);
                  setCurrentTab('tests');
                }}
                onRetake={() => {
                  const t = activeTest;
                  if (t) {
                    handleStartTest(t);
                  } else {
                    setCurrentTab('tests');
                  }
                }}
              />
            )}
          </>
        )}

        {/* Global AI Test Generator Modal accessible from anywhere for teachers */}
        {isTeacher && (
          <AITestGeneratorModal
            isOpen={aiModalOpen}
            onClose={() => setAiModalOpen(false)}
            onTestCreated={(newTest) => {
              setEditingTest(newTest);
              setCurrentTab('create');
            }}
          />
        )}
      </main>

      {/* Footer (strictly unobtrusive, quiet copyright & status) */}
      {currentTab !== 'running-test' && (
        <footer className="border-t border-slate-900 bg-[#07090E] py-6 text-center text-xs text-slate-500">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-400">Vantage Tester</span>
              <span aria-hidden="true">·</span>
              <span>Google Classroom & Education Assessment Suite</span>
            </div>
            <div className="text-slate-500">
              Active Session: <span className="text-slate-300 font-medium">{currentUser.name}</span> ({currentUser.role})
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

export default function App() {
  return (
    <TestProvider>
      <MainApp />
    </TestProvider>
  );
}
