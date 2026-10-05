import React, { useState } from 'react';
import { useTests } from '../../context/TestContext';
import { Test } from '../../types';
import { AITestGeneratorModal } from './AITestGeneratorModal';
import {
  PenTool,
  Sparkles,
  ClipboardList,
  Clock,
  Award,
  Users,
  Eye,
  Trash2,
  Edit3,
  Play,
  ArrowRight,
  BookOpen,
  Calendar,
  CalendarClock,
  AlertTriangle,
  X,
  Check,
} from 'lucide-react';

interface TeacherOverviewProps {
  onOpenCreate: (testToEdit?: Test) => void;
  onOpenGradebook: () => void;
  onPreviewAsStudent: (test: Test) => void;
}

export const TeacherOverview: React.FC<TeacherOverviewProps> = ({
  onOpenCreate,
  onOpenGradebook,
  onPreviewAsStudent,
}) => {
  const { tests, submissions, deleteTest, updateTestDeadline } = useTests();
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [deadlineModalTest, setDeadlineModalTest] = useState<Test | null>(null);
  const [newDeadlineInput, setNewDeadlineInput] = useState('');

  const subjects = ['all', ...Array.from(new Set(tests.map((t) => t.subject)))];

  const filteredTests = tests.filter((t) => {
    return subjectFilter === 'all' || t.subject === subjectFilter;
  });

  const getSubmissionsForTest = (testId: string) => {
    return submissions.filter((s) => s.testId === testId);
  };

  const formatDeadline = (isoString?: string) => {
    if (!isoString) return { text: 'No deadline set', isPast: false, isNear: false };
    const date = new Date(isoString);
    const now = new Date();
    const diffHours = (date.getTime() - now.getTime()) / (1000 * 60 * 60);

    const isPast = diffHours < 0;
    const isNear = diffHours >= 0 && diffHours <= 48; // within 48h

    const formatted = date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    return {
      text: formatted,
      isPast,
      isNear,
      diffHours,
    };
  };

  return (
    <div className="space-y-8 text-left">
      
      {/* Top Welcome & Quick Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Curriculum Tests & Assessment Hub
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Author standardized classroom tests, launch AI generation, and inspect student performance
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setAiModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 font-semibold text-xs transition-all shadow-sm cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>Generate with Vantage AI</span>
          </button>

          <button
            onClick={() => onOpenCreate()}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
          >
            <PenTool className="w-4 h-4" />
            <span>Author Custom Test</span>
          </button>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-[#0D121F] border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Total Tests
            </span>
            <BookOpen className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-2xl font-bold text-white tabular-nums mt-2">
            {tests.length}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">
            Across STEM, Humanities, and AP tracks
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[#0D121F] border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Student Submissions
            </span>
            <Users className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-white tabular-nums mt-2">
            {submissions.length}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <button
              onClick={onOpenGradebook}
              className="text-[11px] text-indigo-400 hover:text-indigo-300 font-semibold cursor-pointer"
            >
              Open Full Gradebook →
            </button>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0D121F] border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              AI Test Architect
            </span>
            <Sparkles className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-2xl font-bold text-indigo-400 mt-2">
            Gemini Flash
          </p>
          <p className="text-[11px] text-slate-500 mt-1">
            Generates distractor keys & rubrics in seconds
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {subjects.map((sub) => (
            <button
              key={sub}
              onClick={() => setSubjectFilter(sub)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer capitalize ${
                subjectFilter === sub
                  ? 'bg-slate-800 text-indigo-300 font-semibold border border-indigo-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              {sub === 'all' ? 'All Subjects' : sub}
            </button>
          ))}
        </div>

        <span className="text-xs text-slate-500">
          {filteredTests.length} Tests Configured
        </span>
      </div>

      {/* Tests Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredTests.map((test) => {
          const testSubs = getSubmissionsForTest(test.id);
          const totalPoints = test.questions.reduce((acc, q) => acc + (q.points || 0), 0);
          const avgScoreForTest =
            testSubs.length > 0
              ? Math.round(
                  testSubs.reduce((acc, s) => acc + s.percentage, 0) / testSubs.length
                )
              : null;

          return (
            <div
              key={test.id}
              className="p-6 rounded-2xl bg-[#0D121F] border border-slate-800 hover:border-slate-700/80 transition-all flex flex-col justify-between space-y-4"
            >
              <div>
                {/* Metadata Row */}
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-indigo-400 font-semibold">{test.subject}</span>
                    <span aria-hidden="true">·</span>
                    <span>{test.grade}</span>
                  </div>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider ${
                      test.status === 'published' ? 'text-emerald-400' : 'text-slate-500'
                    }`}
                  >
                    {test.status}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white tracking-tight line-clamp-1">
                  {test.title}
                </h3>
                <p className="text-xs text-slate-300 line-clamp-2 mt-1 leading-relaxed">
                  {test.description}
                </p>

                {/* Test Specs Bar */}
                <div className="flex items-center gap-4 mt-4 pt-3 border-t border-slate-800/80 text-xs text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    <span>{test.durationMinutes} mins</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <ClipboardList className="w-3.5 h-3.5 text-slate-500" />
                    <span>{test.questions.length} questions ({totalPoints} pts)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-slate-500" />
                    <span>Pass {test.passingScore}%</span>
                  </div>
                </div>

                {/* Deadline Information */}
                {(() => {
                  const dl = formatDeadline(test.deadline);
                  return (
                    <div className="mt-2.5 p-2 rounded-lg bg-slate-900/80 border border-slate-800/90 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <Calendar className={`w-3.5 h-3.5 ${dl.isPast ? 'text-rose-400' : dl.isNear ? 'text-amber-400' : 'text-indigo-400'}`} />
                        <span className="text-slate-400">Deadline:</span>
                        <span className={`font-semibold tabular-nums ${dl.isPast ? 'text-rose-400' : dl.isNear ? 'text-amber-300' : 'text-slate-200'}`}>
                          {dl.text}
                        </span>
                        {dl.isPast && (
                          <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider bg-rose-950/50 px-1.5 py-0.5 rounded border border-rose-900/60">
                            Expired
                          </span>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setDeadlineModalTest(test);
                          setNewDeadlineInput(test.deadline ? new Date(test.deadline).toISOString().slice(0, 16) : '');
                        }}
                        className="text-[11px] text-indigo-400 hover:text-indigo-300 font-medium cursor-pointer"
                      >
                        Adjust
                      </button>
                    </div>
                  );
                })()}

                {/* Submissions summary */}
                <div className="mt-2 p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-400">
                    <span className="font-semibold text-slate-200 tabular-nums">
                      {testSubs.length}
                    </span>{' '}
                    student submissions
                  </span>
                  {avgScoreForTest !== null ? (
                    <span className="text-slate-300">
                      Avg Score:{' '}
                      <span className="font-bold text-indigo-400 tabular-nums">
                        {avgScoreForTest}%
                      </span>
                    </span>
                  ) : (
                    <span className="text-slate-500 italic">No submissions yet</span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onOpenCreate(test)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-850 text-slate-300 hover:text-white text-xs font-medium border border-slate-800 cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>

                  <button
                    onClick={() => onPreviewAsStudent(test)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-850 text-indigo-300 hover:text-indigo-200 text-xs font-medium border border-slate-800 cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>Test Run</span>
                  </button>
                </div>

                <button
                  onClick={() => {
                    if (confirm(`Are you sure you want to delete "${test.title}"?`)) {
                      deleteTest(test.id);
                    }
                  }}
                  className="p-1.5 text-slate-500 hover:text-red-400 transition-colors cursor-pointer"
                  title="Delete Test"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* AI Generator Modal */}
      <AITestGeneratorModal
        isOpen={aiModalOpen}
        onClose={() => setAiModalOpen(false)}
        onTestCreated={(newTest) => {
          // Open the test builder with the new test so teacher can review/edit
          onOpenCreate(newTest);
        }}
      />

      {/* Quick Deadline Adjustment Modal */}
      {deadlineModalTest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#0D121F] border border-slate-800 rounded-2xl shadow-2xl p-6 text-left space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <CalendarClock className="w-5 h-5 text-indigo-400" />
                <h3 className="text-base font-bold text-white">Adjust Test Deadline</h3>
              </div>
              <button
                onClick={() => setDeadlineModalTest(null)}
                className="text-slate-400 hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Set or extend the submission cutoff time for{' '}
              <span className="font-semibold text-white">"{deadlineModalTest.title}"</span>.
            </p>

            <div className="space-y-3 pt-1">
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                  Cutoff Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={newDeadlineInput}
                  onChange={(e) => setNewDeadlineInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100 focus:border-indigo-500"
                />
              </div>

              {/* Quick Presets */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                <span className="text-[10px] uppercase font-bold text-slate-500 w-full mb-1">
                  Quick Extensions:
                </span>
                {[
                  { label: '+24 Hours', days: 1 },
                  { label: '+3 Days', days: 3 },
                  { label: '+1 Week', days: 7 },
                  { label: 'Clear Deadline', days: 0 },
                ].map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => {
                      if (preset.days === 0) {
                        setNewDeadlineInput('');
                      } else {
                        const d = new Date();
                        d.setDate(d.getDate() + preset.days);
                        d.setHours(23, 59, 0, 0);
                        const iso = new Date(d.getTime() - d.getTimezoneOffset() * 60000)
                          .toISOString()
                          .slice(0, 16);
                        setNewDeadlineInput(iso);
                      }
                    }}
                    className="px-2.5 py-1 rounded bg-slate-850 hover:bg-slate-800 border border-slate-800 text-[11px] text-slate-300 cursor-pointer"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setDeadlineModalTest(null)}
                className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-slate-200"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  const finalIso = newDeadlineInput
                    ? new Date(newDeadlineInput).toISOString()
                    : undefined;
                  updateTestDeadline(deadlineModalTest.id, finalIso);
                  setDeadlineModalTest(null);
                }}
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all shadow-md shadow-indigo-600/30 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Save Deadline</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
