import React from 'react';
import { TestSubmission, Test, Question } from '../../types';
import { useTests } from '../../context/TestContext';
import {
  Award,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowLeft,
  RotateCcw,
  BookOpen,
  HelpCircle,
  Sparkles,
} from 'lucide-react';

interface TestResultsViewProps {
  submission: TestSubmission;
  onBackToDashboard: () => void;
  onRetake?: () => void;
}

export const TestResultsView: React.FC<TestResultsViewProps> = ({
  submission,
  onBackToDashboard,
  onRetake,
}) => {
  const { tests } = useTests();
  const test = tests.find((t) => t.id === submission.testId);

  const formatDuration = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}m ${s < 10 ? '0' : ''}${s}s`;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 text-left pb-16">
      
      {/* Navigation Top Action */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBackToDashboard}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Tests Library</span>
        </button>

        {onRetake && (
          <button
            onClick={onRetake}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 text-xs font-semibold transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Retake Assessment</span>
          </button>
        )}
      </div>

      {/* Main Score Showcase Card */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-[#0D121F] via-[#111827] to-[#0D121F] border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-6">
          <div className="space-y-2 max-w-lg">
            <div className="flex items-center gap-2 text-xs text-indigo-400 font-semibold">
              <span>{submission.subject}</span>
              <span aria-hidden="true">·</span>
              <span>Completed {new Date(submission.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              {submission.testTitle}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Assessment completed by <span className="font-semibold text-white">{submission.studentName}</span>. Review your complete solution breakdown, correct answers, and educational explanations below.
            </p>

            {submission.overallFeedback && (
              <div className="mt-3 p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-200">
                <span className="font-bold text-indigo-300">Teacher Evaluation: </span>
                {submission.overallFeedback}
              </div>
            )}
          </div>

          {/* Radial Grade Gauge Badge */}
          <div className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col items-center justify-center text-center min-w-[180px] shadow-lg">
            <div
              className={`w-20 h-20 rounded-full flex flex-col items-center justify-center border-4 ${
                submission.passed
                  ? 'border-emerald-500 text-emerald-400'
                  : 'border-rose-500 text-rose-400'
              }`}
            >
              <span className="text-2xl font-black tabular-nums tracking-tight">
                {submission.percentage}%
              </span>
            </div>

            <p className="text-xs font-bold uppercase tracking-wider mt-3">
              {submission.passed ? (
                <span className="text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> PASSED
                </span>
              ) : (
                <span className="text-rose-400 flex items-center gap-1">
                  <XCircle className="w-3.5 h-3.5" /> NEEDS REVIEW
                </span>
              )}
            </p>

            <div className="flex items-center gap-3 mt-2 text-xs text-slate-400">
              <span className="font-semibold text-slate-200 tabular-nums">
                {submission.score} / {submission.maxScore} pts
              </span>
              <span aria-hidden="true">·</span>
              <span className="tabular-nums">{formatDuration(submission.timeSpentSeconds)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Solutions & Explanations Breakdown */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight">
            Detailed Question Explanations & Solutions
          </h2>
          <p className="text-xs text-slate-400">
            Compare your chosen responses with the official answer keys and curriculum rationale
          </p>
        </div>

        <div className="space-y-4">
          {test?.questions.map((q, idx) => {
            const studentAns = submission.answers.find((a) => a.questionId === q.id) || {
              questionId: q.id,
              selectedAnswer: 'Not answered',
              isCorrect: false,
              pointsAwarded: 0,
            };

            const isCorrect = studentAns.isCorrect;

            return (
              <div
                key={q.id}
                className="p-5 rounded-2xl bg-[#0D121F] border border-slate-800 space-y-4 text-xs"
              >
                {/* Header */}
                <div className="flex items-center justify-between gap-4 pb-3 border-b border-slate-800/80">
                  <div className="flex items-center gap-2.5">
                    <span className="font-bold text-slate-200 text-sm">Question {idx + 1}</span>
                    <span className="text-slate-500 capitalize">({q.type.replace('_', ' ')})</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-300 tabular-nums">
                      {studentAns.pointsAwarded ?? 0} / {q.points} pts
                    </span>
                    {isCorrect ? (
                      <span className="flex items-center gap-1 text-emerald-400 font-semibold text-[11px] px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Correct
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-rose-400 font-semibold text-[11px] px-2 py-0.5 rounded bg-rose-500/10 border border-rose-500/30">
                        <XCircle className="w-3.5 h-3.5" /> Incorrect
                      </span>
                    )}
                  </div>
                </div>

                {/* Prompt */}
                <p className="text-slate-100 font-medium text-sm leading-snug">{q.text}</p>

                {/* Answers Side-by-side */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div
                    className={`p-3.5 rounded-xl border ${
                      isCorrect
                        ? 'bg-emerald-950/20 border-emerald-800/40 text-emerald-200'
                        : 'bg-rose-950/20 border-rose-800/40 text-rose-200'
                    }`}
                  >
                    <p className="text-[10px] uppercase font-bold tracking-wider opacity-70 mb-1">
                      Your Response:
                    </p>
                    <p className="font-medium whitespace-pre-wrap">
                      {Array.isArray(studentAns.selectedAnswer)
                        ? studentAns.selectedAnswer.join(', ')
                        : String(studentAns.selectedAnswer || 'No response recorded')}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-indigo-950/20 border border-indigo-900/40 text-indigo-200">
                    <p className="text-[10px] uppercase font-bold tracking-wider text-indigo-400 mb-1">
                      Standard Key / Rubric:
                    </p>
                    <p className="font-medium whitespace-pre-wrap">
                      {Array.isArray(q.correctAnswer)
                        ? q.correctAnswer.join(', ')
                        : q.correctAnswer}
                    </p>
                  </div>
                </div>

                {/* Educational Explanation */}
                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] text-slate-300 leading-relaxed">
                  <span className="font-bold text-slate-100 block mb-0.5">
                    Curriculum Solution & Rationale:
                  </span>
                  {q.explanation}
                </div>

                {/* Teacher Comment */}
                {studentAns.teacherComment && (
                  <div className="p-3 rounded-lg bg-indigo-950/30 border border-indigo-800/40 text-[11px] text-indigo-300">
                    <span className="font-bold">Teacher Note: </span>
                    {studentAns.teacherComment}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
