import React, { useState } from 'react';
import { TestSubmission, Test, Question, StudentAnswer } from '../../types';
import { useTests } from '../../context/TestContext';
import {
  X,
  CheckCircle,
  XCircle,
  AlertCircle,
  Sparkles,
  Loader2,
  Save,
  Clock,
  Award,
  BookOpen,
} from 'lucide-react';

interface SubmissionReviewModalProps {
  submission: TestSubmission;
  isOpen: boolean;
  onClose: () => void;
}

export const SubmissionReviewModal: React.FC<SubmissionReviewModalProps> = ({
  submission,
  isOpen,
  onClose,
}) => {
  const { tests, updateSubmissionGrade } = useTests();
  const test = tests.find((t) => t.id === submission.testId);

  // Local state for answers grading
  const [answers, setAnswers] = useState<StudentAnswer[]>(submission.answers);
  const [overallFeedback, setOverallFeedback] = useState<string>(
    submission.overallFeedback || ''
  );
  const [aiEvaluatingIdx, setAiEvaluatingIdx] = useState<number | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!isOpen) return null;

  const handlePointChange = (idx: number, newPoints: number, maxPoints: number) => {
    const clamped = Math.max(0, Math.min(maxPoints, newPoints));
    setAnswers((prev) => {
      const copy = [...prev];
      copy[idx] = {
        ...copy[idx],
        pointsAwarded: clamped,
        isCorrect: clamped === maxPoints,
      };
      return copy;
    });
  };

  const handleCommentChange = (idx: number, comment: string) => {
    setAnswers((prev) => {
      const copy = [...prev];
      copy[idx] = {
        ...copy[idx],
        teacherComment: comment,
      };
      return copy;
    });
  };

  const handleAIAssist = async (idx: number, question: Question, studentAns: StudentAnswer) => {
    setAiEvaluatingIdx(idx);
    try {
      const res = await fetch('/api/ai/evaluate-answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionText: question.text,
          studentAnswer: studentAns.selectedAnswer,
          idealAnswer: question.correctAnswer,
          maxPoints: question.points,
        }),
      });

      if (!res.ok) throw new Error('Evaluation request failed');
      const data = await res.json();

      setAnswers((prev) => {
        const copy = [...prev];
        copy[idx] = {
          ...copy[idx],
          pointsAwarded: data.pointsAwarded ?? question.points,
          isCorrect: data.isCorrect ?? true,
          teacherComment: data.feedback || 'Evaluated with Vantage AI grading assistance.',
        };
        return copy;
      });
    } catch (e) {
      console.error('Failed AI grading:', e);
    } finally {
      setAiEvaluatingIdx(null);
    }
  };

  const handleSave = () => {
    updateSubmissionGrade(submission.id, {
      answers,
      overallFeedback,
      status: 'graded',
    });
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 800);
  };

  // Calculate current score from answers
  const currentTotal = answers.reduce((acc, a) => acc + (a.pointsAwarded || 0), 0);
  const currentPercentage = Math.round((currentTotal / submission.maxScore) * 100);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}m ${s < 10 ? '0' : ''}${s}s`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#0D121F] border border-slate-800 rounded-2xl shadow-2xl p-5 sm:p-8 my-6 text-left flex flex-col max-h-[92vh]">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Top Info */}
        <div className="border-b border-slate-800 pb-5 mb-5 shrink-0">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs text-indigo-400 mb-1">
                <span>{submission.subject}</span>
                <span aria-hidden="true">·</span>
                <span>Submitted {new Date(submission.submittedAt).toLocaleDateString()}</span>
                <span aria-hidden="true">·</span>
                <span>Time: {formatTime(submission.timeSpentSeconds)}</span>
              </div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                {submission.testTitle}
              </h2>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs text-slate-400">Student:</span>
                <span className="text-xs font-semibold text-slate-200 bg-slate-800/80 px-2 py-0.5 rounded">
                  {submission.studentName}
                </span>
              </div>
            </div>

            {/* Score Pill / Summary */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900 border border-slate-800">
              <div className="text-right">
                <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                  Total Grade
                </p>
                <p className="text-xl font-extrabold text-white tabular-nums">
                  {currentTotal} / {submission.maxScore}
                </p>
              </div>
              <div
                className={`text-sm font-bold px-2.5 py-1.5 rounded-lg tabular-nums ${
                  currentPercentage >= 70
                    ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                    : 'bg-red-500/10 border border-red-500/30 text-red-400'
                }`}
              >
                {currentPercentage}%
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable Questions Breakdown */}
        <div className="overflow-y-auto pr-2 space-y-4 flex-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Question-by-Question Evaluation & Rubric
          </p>

          {test?.questions.map((q, idx) => {
            const studentAns = answers.find((a) => a.questionId === q.id) || {
              questionId: q.id,
              selectedAnswer: 'Not answered',
              pointsAwarded: 0,
              isCorrect: false,
            };

            const isFullyCorrect = studentAns.isCorrect;
            const isShortAnswer = q.type === 'short_answer';

            return (
              <div
                key={q.id}
                className="p-4 rounded-xl bg-slate-900/70 border border-slate-800/90 text-xs space-y-3"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-300">Question {idx + 1}</span>
                      <span className="text-[11px] text-slate-500 capitalize">({q.type.replace('_', ' ')})</span>
                      {isFullyCorrect ? (
                        <span className="flex items-center gap-1 text-emerald-400 font-medium text-[11px]">
                          <CheckCircle className="w-3.5 h-3.5" /> Correct
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-rose-400 font-medium text-[11px]">
                          <XCircle className="w-3.5 h-3.5" /> Review / Incorrect
                        </span>
                      )}
                    </div>
                    <p className="text-slate-100 font-medium text-sm leading-snug">{q.text}</p>
                  </div>

                  {/* Points adjuster */}
                  <div className="flex items-center gap-1.5 shrink-0 bg-slate-950/80 border border-slate-800 p-1 rounded-lg">
                    <button
                      type="button"
                      onClick={() =>
                        handlePointChange(idx, (studentAns.pointsAwarded || 0) - 1, q.points)
                      }
                      className="w-6 h-6 rounded flex items-center justify-center bg-slate-800 hover:bg-slate-700 text-slate-200 cursor-pointer font-bold"
                    >
                      -
                    </button>
                    <span className="px-1.5 font-bold tabular-nums text-slate-100">
                      {studentAns.pointsAwarded ?? 0}
                    </span>
                    <span className="text-slate-500">/ {q.points}</span>
                    <button
                      type="button"
                      onClick={() =>
                        handlePointChange(idx, (studentAns.pointsAwarded || 0) + 1, q.points)
                      }
                      className="w-6 h-6 rounded flex items-center justify-center bg-slate-800 hover:bg-slate-700 text-slate-200 cursor-pointer font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Student Answer vs Key */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                  <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80">
                    <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-1">
                      Student's Submitted Answer:
                    </p>
                    <p className="text-slate-200 font-medium whitespace-pre-wrap">
                      {Array.isArray(studentAns.selectedAnswer)
                        ? studentAns.selectedAnswer.join(', ')
                        : String(studentAns.selectedAnswer || 'No response recorded')}
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-indigo-950/20 border border-indigo-900/40">
                    <p className="text-[10px] uppercase font-bold tracking-wider text-indigo-400 mb-1">
                      Correct Key / Rubric Guideline:
                    </p>
                    <p className="text-indigo-200 font-medium whitespace-pre-wrap">
                      {Array.isArray(q.correctAnswer)
                        ? q.correctAnswer.join(', ')
                        : q.correctAnswer}
                    </p>
                  </div>
                </div>

                {/* Explanation */}
                <p className="text-[11px] text-slate-400">
                  <span className="text-slate-300 font-semibold">Curriculum Rationale: </span>
                  {q.explanation}
                </p>

                {/* AI Grader Assist for Short Answers */}
                {isShortAnswer && (
                  <div className="pt-1 flex items-center gap-2">
                    <button
                      type="button"
                      disabled={aiEvaluatingIdx === idx}
                      onClick={() => handleAIAssist(idx, q, studentAns)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 text-xs font-medium transition-colors cursor-pointer disabled:opacity-50"
                    >
                      {aiEvaluatingIdx === idx ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>AI Analyzing Rubric...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Use Vantage AI to Grade & Generate Feedback</span>
                        </>
                      )}
                    </button>
                  </div>
                )}

                {/* Teacher Comment */}
                <div>
                  <input
                    type="text"
                    value={studentAns.teacherComment || ''}
                    onChange={(e) => handleCommentChange(idx, e.target.value)}
                    placeholder="Add teacher note or rubric remark for student..."
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:border-indigo-500"
                  />
                </div>
              </div>
            );
          })}

          {/* Overall Feedback */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <label className="block text-xs font-semibold text-slate-300">
              Overall Teacher Feedback & Summary for Student
            </label>
            <textarea
              value={overallFeedback}
              onChange={(e) => setOverallFeedback(e.target.value)}
              rows={2}
              placeholder="e.g. Excellent conceptual precision on mechanics problems. Be mindful of unit conversions on question 3."
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Modal Actions */}
        <div className="border-t border-slate-800 pt-4 mt-4 flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
          >
            {saveSuccess ? (
              <>
                <CheckCircle className="w-4 h-4 text-emerald-300" />
                <span>Gradebook Updated!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Grades & Send Feedback</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
