import React, { useState, useEffect } from 'react';
import { Test, Question, StudentAnswer, TestSubmission } from '../../types';
import { useTests } from '../../context/TestContext';
import {
  Clock,
  Flag,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Check,
  Send,
  HelpCircle,
  Calendar,
} from 'lucide-react';

interface TestRunnerProps {
  test: Test;
  onFinish: (submission: TestSubmission) => void;
  onExit: () => void;
}

export const TestRunner: React.FC<TestRunnerProps> = ({ test, onFinish, onExit }) => {
  const { currentUser, submitTest } = useTests();

  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [flagged, setFlagged] = useState<Record<string, boolean>>({});
  const [showHint, setShowHint] = useState<Record<string, boolean>>({});
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  // Timer in seconds
  const totalSeconds = (test.durationMinutes || 20) * 60;
  const [secondsRemaining, setSecondsRemaining] = useState(totalSeconds);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentQ = test.questions[currentIdx];

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleFinalSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleSelectSingle = (val: string) => {
    setAnswers((prev) => ({ ...prev, [currentQ.id]: val }));
  };

  const handleToggleMultiple = (val: string) => {
    const current = (answers[currentQ.id] as string[]) || [];
    const exists = current.includes(val);
    const updated = exists ? current.filter((v) => v !== val) : [...current, val];
    setAnswers((prev) => ({ ...prev, [currentQ.id]: updated }));
  };

  const handleShortAnswerChange = (val: string) => {
    setAnswers((prev) => ({ ...prev, [currentQ.id]: val }));
  };

  const toggleFlag = (qId: string) => {
    setFlagged((prev) => ({ ...prev, [qId]: !prev[qId] }));
  };

  // Grade the test
  const handleFinalSubmit = () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    const timeSpent = totalSeconds - secondsRemaining;
    const evaluatedAnswers: StudentAnswer[] = test.questions.map((q) => {
      const studentVal = answers[q.id];
      let isCorrect = false;
      let pointsAwarded = 0;

      if (q.type === 'single' || q.type === 'boolean') {
        isCorrect = studentVal === q.correctAnswer;
        pointsAwarded = isCorrect ? q.points : 0;
      } else if (q.type === 'multiple') {
        const correctList = Array.isArray(q.correctAnswer) ? q.correctAnswer : [q.correctAnswer];
        const studentList = Array.isArray(studentVal) ? studentVal : [];
        const isMatch =
          correctList.length === studentList.length &&
          correctList.every((c) => studentList.includes(c));
        isCorrect = isMatch;
        pointsAwarded = isCorrect ? q.points : 0;
      } else if (q.type === 'short_answer') {
        // Heuristic initial grading for short answers; flagged for teacher review if open-ended
        const answerText = String(studentVal || '').trim();
        const hasText = answerText.length > 10;
        isCorrect = hasText;
        pointsAwarded = hasText ? Math.round(q.points * 0.8) : 0;
      }

      return {
        questionId: q.id,
        selectedAnswer: studentVal || (q.type === 'multiple' ? [] : 'No answer provided'),
        isCorrect,
        pointsAwarded,
      };
    });

    const totalScore = evaluatedAnswers.reduce((acc, a) => acc + (a.pointsAwarded || 0), 0);
    const maxScore = test.questions.reduce((acc, q) => acc + q.points, 0);
    const percentage = Math.round((totalScore / maxScore) * 100);
    const passed = percentage >= (test.passingScore || 70);

    const studentId = currentUser ? currentUser.id : 'student-guest';
    const studentName = currentUser ? currentUser.name : 'Candidate Student';
    const studentAvatar = currentUser ? currentUser.avatar : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150';

    const submission = submitTest({
      testId: test.id,
      testTitle: test.title,
      subject: test.subject,
      studentId,
      studentName,
      studentAvatar,
      timeSpentSeconds: timeSpent,
      score: totalScore,
      maxScore,
      percentage,
      passed,
      status: test.questions.some((q) => q.type === 'short_answer') ? 'needs_review' : 'graded',
      answers: evaluatedAnswers,
    });

    onFinish(submission);
  };

  const answeredCount = test.questions.filter((q) => {
    const a = answers[q.id];
    if (Array.isArray(a)) return a.length > 0;
    return a !== undefined && String(a).trim() !== '';
  }).length;

  const isLowTime = secondsRemaining <= 180; // 3 mins

  return (
    <div className="max-w-5xl mx-auto space-y-6 text-left pb-16">
      
      {/* Test Exam Header Bar */}
      <div className="sticky top-16 z-30 p-4 rounded-2xl bg-[#0D121F]/95 backdrop-blur-md border border-slate-800 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-indigo-400 font-semibold mb-0.5">
            <span>{test.subject}</span>
            <span aria-hidden="true">·</span>
            <span>{test.grade}</span>
            {test.deadline && (
              <>
                <span aria-hidden="true">·</span>
                <span className="flex items-center gap-1 text-slate-400 font-normal">
                  <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                  <span>
                    Deadline:{' '}
                    {new Date(test.deadline).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </span>
              </>
            )}
          </div>
          <h1 className="text-base font-bold text-white tracking-tight line-clamp-1">
            {test.title}
          </h1>
        </div>

        <div className="flex items-center gap-4">
          {/* Live Countdown Timer */}
          <div
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border text-xs font-bold tabular-nums transition-colors ${
              isLowTime
                ? 'bg-red-500/10 border-red-500/40 text-red-400 animate-pulse'
                : 'bg-slate-900 border-slate-800 text-slate-200'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Time Left: {formatTimer(secondsRemaining)}</span>
          </div>

          <button
            onClick={() => setShowSubmitModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md shadow-indigo-600/30 transition-all cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Finish Test</span>
          </button>
        </div>
      </div>

      {/* Main Runner Layout: Question Grid Nav + Question Card */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left Column: Question Palette */}
        <div className="p-4 rounded-2xl bg-[#0D121F] border border-slate-800 space-y-4 h-fit">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-300">Question Palette</span>
            <span className="text-slate-400 tabular-nums">
              {answeredCount}/{test.questions.length} answered
            </span>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
            {test.questions.map((q, idx) => {
              const isAnswered =
                answers[q.id] !== undefined &&
                (Array.isArray(answers[q.id])
                  ? (answers[q.id] as string[]).length > 0
                  : String(answers[q.id]).trim() !== '');
              const isCurrent = idx === currentIdx;
              const isFlagged = flagged[q.id];

              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentIdx(idx)}
                  className={`relative h-10 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center ${
                    isCurrent
                      ? 'bg-indigo-600 text-white ring-2 ring-indigo-400'
                      : isAnswered
                      ? 'bg-slate-800 text-emerald-400 border border-emerald-500/40'
                      : 'bg-slate-900 text-slate-400 border border-slate-800 hover:bg-slate-850'
                  }`}
                >
                  <span className="tabular-nums">{idx + 1}</span>
                  {isFlagged && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-400 ring-2 ring-[#0D121F]" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Palette Legend */}
          <div className="pt-3 border-t border-slate-800 space-y-1.5 text-[11px] text-slate-400">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-slate-800 border border-emerald-500/40 text-emerald-400" />
              <span>Answered</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-indigo-600" />
              <span>Current Question</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <span>Flagged for Review</span>
            </div>
          </div>
        </div>

        {/* Right Column: Question Content Stage */}
        <div className="lg:col-span-3 space-y-6">
          <div className="p-6 sm:p-8 rounded-2xl bg-[#0D121F] border border-slate-800 space-y-6">
            
            {/* Question Header */}
            <div className="flex items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-md bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 font-bold text-xs tabular-nums">
                  Question {currentIdx + 1} of {test.questions.length}
                </span>
                <span className="text-xs text-slate-400 capitalize">
                  {currentQ.type.replace('_', ' ')}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-slate-400 tabular-nums">
                  {currentQ.points} Points
                </span>
                <button
                  onClick={() => toggleFlag(currentQ.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                    flagged[currentQ.id]
                      ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Flag className="w-3.5 h-3.5 fill-current" />
                  <span>{flagged[currentQ.id] ? 'Flagged' : 'Flag'}</span>
                </button>
              </div>
            </div>

            {/* Question Text */}
            <div className="space-y-2">
              <p className="text-base sm:text-lg font-medium text-slate-100 leading-relaxed">
                {currentQ.text}
              </p>
              {currentQ.type === 'multiple' && (
                <p className="text-xs text-indigo-400 font-medium">
                  * Select all correct options that apply
                </p>
              )}
            </div>

            {/* Answer Controls */}
            <div className="pt-2">
              {/* Single Choice Radio */}
              {currentQ.type === 'single' && currentQ.options && (
                <div className="space-y-2.5">
                  {currentQ.options.map((option, idx) => {
                    const isSelected = answers[currentQ.id] === option;
                    return (
                      <button
                        key={idx}
                        onClick={() => handleSelectSingle(option)}
                        className={`w-full p-4 rounded-xl text-left text-xs sm:text-sm font-medium transition-all flex items-center justify-between cursor-pointer border ${
                          isSelected
                            ? 'bg-indigo-950/30 border-indigo-500 text-white shadow-md shadow-indigo-600/10'
                            : 'bg-slate-900/70 border-slate-800 text-slate-300 hover:bg-slate-850 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border shrink-0 ${
                              isSelected
                                ? 'bg-indigo-600 border-indigo-500 text-white'
                                : 'bg-slate-800 border-slate-700 text-slate-400'
                            }`}
                          >
                            {String.fromCharCode(65 + idx)}
                          </span>
                          <span>{option}</span>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-indigo-400" />}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Multiple Choice Checkboxes */}
              {currentQ.type === 'multiple' && currentQ.options && (
                <div className="space-y-2.5">
                  {currentQ.options.map((option, idx) => {
                    const selectedList = (answers[currentQ.id] as string[]) || [];
                    const isSelected = selectedList.includes(option);
                    return (
                      <button
                        key={idx}
                        onClick={() => handleToggleMultiple(option)}
                        className={`w-full p-4 rounded-xl text-left text-xs sm:text-sm font-medium transition-all flex items-center justify-between cursor-pointer border ${
                          isSelected
                            ? 'bg-indigo-950/30 border-indigo-500 text-white shadow-md shadow-indigo-600/10'
                            : 'bg-slate-900/70 border-slate-800 text-slate-300 hover:bg-slate-850 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-5 h-5 rounded flex items-center justify-center border shrink-0 ${
                              isSelected
                                ? 'bg-indigo-600 border-indigo-500 text-white'
                                : 'bg-slate-800 border-slate-700'
                            }`}
                          >
                            {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                          </div>
                          <span>{option}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* True / False Cards */}
              {currentQ.type === 'boolean' && (
                <div className="grid grid-cols-2 gap-4">
                  {['True', 'False'].map((val) => {
                    const isSelected = answers[currentQ.id] === val;
                    return (
                      <button
                        key={val}
                        onClick={() => handleSelectSingle(val)}
                        className={`p-6 rounded-xl text-center font-bold text-base transition-all cursor-pointer border ${
                          isSelected
                            ? 'bg-indigo-950/40 border-indigo-500 text-white shadow-md shadow-indigo-600/20'
                            : 'bg-slate-900/70 border-slate-800 text-slate-300 hover:bg-slate-850'
                        }`}
                      >
                        {val}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Short Answer Textarea */}
              {currentQ.type === 'short_answer' && (
                <div className="space-y-2">
                  <textarea
                    value={(answers[currentQ.id] as string) || ''}
                    onChange={(e) => handleShortAnswerChange(e.target.value)}
                    rows={5}
                    placeholder="Type your complete solution or explanation here..."
                    className="w-full p-4 rounded-xl bg-slate-900 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm text-slate-100 placeholder-slate-500 leading-relaxed"
                  />
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>Write clearly with accurate vocabulary and formulas</span>
                    <span className="tabular-nums">
                      {((answers[currentQ.id] as string) || '').length} characters
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Hint Accordion */}
            {currentQ.hint && (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() =>
                    setShowHint((prev) => ({ ...prev, [currentQ.id]: !prev[currentQ.id] }))
                  }
                  className="flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer"
                >
                  <Lightbulb className="w-3.5 h-3.5" />
                  <span>{showHint[currentQ.id] ? 'Hide Hint' : 'Need a hint?'}</span>
                </button>
                {showHint[currentQ.id] && (
                  <p className="mt-2 p-3 rounded-lg bg-indigo-950/20 border border-indigo-900/30 text-xs text-indigo-200">
                    {currentQ.hint}
                  </p>
                )}
              </div>
            )}

            {/* Navigation Bottom Controls */}
            <div className="flex items-center justify-between pt-6 border-t border-slate-800">
              <button
                type="button"
                disabled={currentIdx === 0}
                onClick={() => setCurrentIdx((i) => Math.max(0, i - 1))}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-300 transition-colors disabled:opacity-40 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              {currentIdx < test.questions.length - 1 ? (
                <button
                  type="button"
                  onClick={() => setCurrentIdx((i) => Math.min(test.questions.length - 1, i + 1))}
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition-all cursor-pointer"
                >
                  <span>Next Question</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowSubmitModal(true)}
                  className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md shadow-emerald-600/30 transition-all cursor-pointer"
                >
                  <span>Review & Submit</span>
                  <CheckCircle2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Submit Confirmation Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-md bg-[#0D121F] border border-slate-800 rounded-2xl shadow-2xl p-6 text-left space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white tracking-tight">
                  Ready to Submit Test?
                </h3>
                <p className="text-xs text-slate-400">
                  Verify your responses before final grading
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between text-slate-300">
                <span>Total Questions:</span>
                <span className="font-bold text-white tabular-nums">
                  {test.questions.length}
                </span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Questions Answered:</span>
                <span className="font-bold text-emerald-400 tabular-nums">
                  {answeredCount} of {test.questions.length}
                </span>
              </div>
              {answeredCount < test.questions.length && (
                <div className="flex items-center gap-1.5 text-amber-400 pt-1 font-medium">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>
                    You have {test.questions.length - answeredCount} unanswered questions!
                  </span>
                </div>
              )}
              {Object.values(flagged).filter(Boolean).length > 0 && (
                <div className="flex items-center gap-1.5 text-indigo-300 pt-1">
                  <Flag className="w-3.5 h-3.5 shrink-0 fill-current" />
                  <span>
                    {Object.values(flagged).filter(Boolean).length} questions marked for review
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowSubmitModal(false)}
                className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
              >
                Back to Questions
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowSubmitModal(false);
                  handleFinalSubmit();
                }}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
              >
                Confirm & Submit Test
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
