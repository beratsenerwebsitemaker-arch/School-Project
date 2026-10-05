import React, { useState } from 'react';
import { useTests } from '../../context/TestContext';
import { Test, TestSubmission } from '../../types';
import {
  BookOpen,
  Clock,
  ClipboardList,
  Award,
  Play,
  CheckCircle2,
  XCircle,
  Eye,
  Calendar,
  AlertCircle,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react';

interface StudentOverviewProps {
  onStartTest: (test: Test) => void;
  onViewSubmission: (sub: TestSubmission) => void;
}

export const StudentOverview: React.FC<StudentOverviewProps> = ({
  onStartTest,
  onViewSubmission,
}) => {
  const { tests, submissions, currentUser } = useTests();
  const [subjectFilter, setSubjectFilter] = useState('all');

  // Filter submissions by this student
  const studentSubmissions = submissions.filter((s) => s.studentId === currentUser?.id);

  // Available tests (published)
  const availableTests = tests.filter((t) => t.status === 'published');
  const subjects = ['all', ...Array.from(new Set(availableTests.map((t) => t.subject)))];

  const filteredTests = availableTests.filter((t) => {
    return subjectFilter === 'all' || t.subject === subjectFilter;
  });

  // Calculate student performance stats
  const totalCompleted = studentSubmissions.length;
  const passedCount = studentSubmissions.filter((s) => s.passed).length;
  const avgGrade =
    totalCompleted > 0
      ? Math.round(
          studentSubmissions.reduce((acc, s) => acc + s.percentage, 0) / totalCompleted
        )
      : null;

  const formatDuration = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}m ${s < 10 ? '0' : ''}${s}s`;
  };

  return (
    <div className="space-y-8 text-left">
      
      {/* Student Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 p-6 sm:p-8">
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2 text-xs text-indigo-400 font-semibold">
              <span>{currentUser?.grade || 'Standard Assessment Track'}</span>
              <span aria-hidden="true">·</span>
              <span>Academic Year 2026</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Welcome back, {currentUser?.name || 'Student'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Review assigned course assessments, take timed standardized tests, and inspect in-depth explanations for your past submissions.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-3">
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-center min-w-[100px]">
              <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                Tests Taken
              </p>
              <p className="text-2xl font-bold text-white tabular-nums mt-1">
                {totalCompleted}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-center min-w-[100px]">
              <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                Avg. Score
              </p>
              <p className="text-2xl font-bold text-indigo-400 tabular-nums mt-1">
                {avgGrade !== null ? `${avgGrade}%` : '—'}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-center min-w-[100px]">
              <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                Passing Rate
              </p>
              <p className="text-2xl font-bold text-emerald-400 tabular-nums mt-1">
                {totalCompleted > 0 ? `${Math.round((passedCount / totalCompleted) * 100)}%` : '—'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Available Tests Section */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Available Tests & Quizzes
            </h2>
            <p className="text-xs text-slate-400">
              Select an assessment to start your timed test session
            </p>
          </div>

          {/* Subject Filter */}
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
        </div>

        {/* Tests Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTests.map((test) => {
            const priorAttempt = studentSubmissions.find((s) => s.testId === test.id);
            const totalPoints = test.questions.reduce((acc, q) => acc + (q.points || 0), 0);

            return (
              <div
                key={test.id}
                className="p-5 rounded-2xl bg-[#0D121F] border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                    <span className="font-semibold text-indigo-400">{test.subject}</span>
                    <span>{test.grade}</span>
                  </div>

                  <h3 className="text-base font-bold text-white tracking-tight line-clamp-1">
                    {test.title}
                  </h3>
                  <p className="text-xs text-slate-300 line-clamp-2 mt-1 leading-relaxed">
                    {test.description}
                  </p>

                  {/* Specs */}
                  <div className="flex items-center gap-3 mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      <span>{test.durationMinutes} mins</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <ClipboardList className="w-3.5 h-3.5 text-slate-500" />
                      <span>{test.questions.length} questions ({totalPoints} pts)</span>
                    </div>
                  </div>

                  {/* Deadline Indicator */}
                  {(() => {
                    if (!test.deadline) return null;
                    const d = new Date(test.deadline);
                    const now = new Date();
                    const isPast = now > d;
                    const diffHours = (d.getTime() - now.getTime()) / (1000 * 60 * 60);
                    const isUrgent = diffHours > 0 && diffHours <= 24;

                    const formattedDate = d.toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    });

                    return (
                      <div
                        className={`mt-3 p-2 rounded-lg border text-xs flex items-center justify-between ${
                          isPast
                            ? 'bg-rose-950/30 border-rose-900/50 text-rose-300'
                            : isUrgent
                            ? 'bg-amber-950/30 border-amber-900/50 text-amber-300'
                            : 'bg-slate-900/80 border-slate-800 text-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 truncate">
                          {isPast ? (
                            <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                          ) : isUrgent ? (
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          ) : (
                            <Calendar className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                          )}
                          <span className="text-[11px] truncate">
                            {isPast ? 'Deadline Expired:' : isUrgent ? 'Due Soon:' : 'Deadline:'}{' '}
                            <span className="font-semibold tabular-nums">{formattedDate}</span>
                          </span>
                        </div>

                        {isPast && (
                          <span className="text-[10px] uppercase font-bold text-rose-400 shrink-0">
                            {test.allowLateSubmission ? 'Late Allowed' : 'Closed'}
                          </span>
                        )}
                      </div>
                    );
                  })()}

                  {priorAttempt && (
                    <div className="mt-2.5 p-2 rounded-lg bg-slate-900/70 border border-slate-800 flex items-center justify-between text-xs">
                      <span className="text-slate-400">Last Attempt:</span>
                      <span
                        className={`font-bold tabular-nums ${
                          priorAttempt.passed ? 'text-emerald-400' : 'text-rose-400'
                        }`}
                      >
                        {priorAttempt.score}/{priorAttempt.maxScore} ({priorAttempt.percentage}%)
                        {priorAttempt.isLate && (
                          <span className="text-[10px] text-amber-400 ml-1.5 font-normal">
                            (Late)
                          </span>
                        )}
                      </span>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">
                    Instructor: {test.createdBy}
                  </span>
                  {(() => {
                    const isPast = test.deadline && new Date() > new Date(test.deadline);
                    const isClosed = isPast && test.allowLateSubmission === false;

                    if (isClosed) {
                      return (
                        <button
                          disabled
                          className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-500 font-semibold text-xs cursor-not-allowed opacity-60"
                        >
                          Submission Closed
                        </button>
                      );
                    }

                    return (
                      <button
                        onClick={() => onStartTest(test)}
                        className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-white font-semibold text-xs shadow-md transition-all cursor-pointer ${
                          isPast
                            ? 'bg-amber-600 hover:bg-amber-500 shadow-amber-600/30'
                            : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/30'
                        }`}
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>
                          {priorAttempt ? 'Retake' : isPast ? 'Take Test (Late)' : 'Start Test'}
                        </span>
                      </button>
                    );
                  })()}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Past Submissions Section */}
      <div className="space-y-4 pt-4">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight">
            My Completed Tests & Results
          </h2>
          <p className="text-xs text-slate-400">
            Review detailed question solutions and teacher comments from your past test sessions
          </p>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-800 bg-[#0D121F]">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/80 text-slate-400 uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Test Title</th>
                <th className="py-3 px-4">Subject</th>
                <th className="py-3 px-4">Date Completed</th>
                <th className="py-3 px-4">Time Spent</th>
                <th className="py-3 px-4">Points</th>
                <th className="py-3 px-4">Grade</th>
                <th className="py-3 px-4">Result</th>
                <th className="py-3 px-4 text-right">Review</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {studentSubmissions.length > 0 ? (
                studentSubmissions.map((sub) => (
                  <tr
                    key={sub.id}
                    className="hover:bg-slate-900/60 transition-colors group cursor-pointer"
                    onClick={() => onViewSubmission(sub)}
                  >
                    <td className="py-3.5 px-4 font-semibold text-slate-100">
                      {sub.testTitle}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">
                      {sub.subject}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 tabular-nums">
                      {new Date(sub.submittedAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 tabular-nums">
                      {formatDuration(sub.timeSpentSeconds)}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-200 tabular-nums">
                      {sub.score} / {sub.maxScore}
                    </td>
                    <td className="py-3.5 px-4 tabular-nums">
                      <span
                        className={`font-bold ${
                          sub.percentage >= 70 ? 'text-emerald-400' : 'text-rose-400'
                        }`}
                      >
                        {sub.percentage}%
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      {sub.passed ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Passed</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-400">
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Needs Review</span>
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onViewSubmission(sub);
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 font-semibold text-[11px] border border-indigo-500/40 transition-colors cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect Explanations</span>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500">
                    You haven't completed any tests yet. Click "Start Test" above to begin your first assessment!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
