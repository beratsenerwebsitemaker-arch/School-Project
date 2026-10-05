import React, { useState } from 'react';
import { useTests } from '../../context/TestContext';
import { Sparkles, Loader2, CheckCircle2, AlertCircle, X, HelpCircle, ArrowRight } from 'lucide-react';
import { Test, Question } from '../../types';

interface AITestGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTestCreated: (test: Test) => void;
}

export const AITestGeneratorModal: React.FC<AITestGeneratorModalProps> = ({
  isOpen,
  onClose,
  onTestCreated,
}) => {
  const { generateAITest } = useTests();

  const [topic, setTopic] = useState('');
  const [subject, setSubject] = useState('Physics');
  const [grade, setGrade] = useState('Grade 11-12 (AP)');
  const [numQuestions, setNumQuestions] = useState(5);
  const [difficulty, setDifficulty] = useState('medium');
  const [deadlineDays, setDeadlineDays] = useState<number>(7);
  const [customInstructions, setCustomInstructions] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedTest, setGeneratedTest] = useState<Test | null>(null);

  if (!isOpen) return null;

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) {
      setError('Please provide a test topic or subject matter.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let deadlineStr: string | undefined = undefined;
      if (deadlineDays > 0) {
        const d = new Date();
        d.setDate(d.getDate() + deadlineDays);
        d.setHours(23, 59, 0, 0);
        deadlineStr = d.toISOString();
      }

      const test = await generateAITest({
        topic: topic.trim(),
        subject,
        grade,
        numQuestions,
        difficulty,
        deadline: deadlineStr,
        customInstructions: customInstructions.trim(),
      });
      setGeneratedTest(test);
    } catch (err: any) {
      console.error('Test generation error:', err);
      setError('Failed to generate test. Please try again or adjust your prompt.');
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptAndOpen = () => {
    if (generatedTest) {
      onTestCreated(generatedTest);
      onClose();
    }
  };

  const promptPresets = [
    {
      title: 'AP Biology: Photosynthesis & Calvin Cycle',
      subject: 'Biology',
      grade: 'Grade 11-12 (AP)',
      prompt: 'Light-dependent reactions, Calvin cycle enzymes, photosystem I and II, and ATP synthesis in chloroplasts',
    },
    {
      title: 'AP Calculus: Derivatives & Tangent Slopes',
      subject: 'Mathematics',
      grade: 'Grade 11-12 (AP)',
      prompt: 'Product rule, quotient rule, chain rule, and finding normal and tangent lines to curves',
    },
    {
      title: 'World History: The Industrial Revolution',
      subject: 'World History',
      grade: 'Grade 10',
      prompt: 'Steam engine technological innovations, urbanization trends, child labor conditions, and rise of labor unions in 19th century Britain',
    },
    {
      title: 'Computer Science: Recursion & Binary Trees',
      subject: 'Computer Science',
      grade: 'Grade 11-12',
      prompt: 'Base cases in recursive algorithms, tree traversals (inorder, preorder, postorder), and call stack memory growth',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-[#0D121F] border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8 my-8 text-left">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Vantage AI Test Architect
            </h2>
            <p className="text-xs text-slate-400">
              Prompt Gemini to construct standardized assessments with rigorous distractors and explanations
            </p>
          </div>
        </div>

        {!generatedTest ? (
          <form onSubmit={handleGenerate} className="space-y-5">
            {error && (
              <div className="p-3 rounded-lg bg-red-950/60 border border-red-800/60 text-red-200 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Prompt presets */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-2">
                Quick Academic Presets:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {promptPresets.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setTopic(preset.prompt);
                      setSubject(preset.subject);
                      setGrade(preset.grade);
                    }}
                    className="p-2.5 rounded-lg bg-slate-900/80 hover:bg-slate-850 border border-slate-800/80 hover:border-slate-700 text-left transition-all text-xs cursor-pointer group"
                  >
                    <p className="font-semibold text-slate-200 group-hover:text-indigo-300">
                      {preset.title}
                    </p>
                    <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                      {preset.prompt}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Topic Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-1.5">
                Assessment Topic or Curriculum Standard <span className="text-indigo-400">*</span>
              </label>
              <textarea
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                rows={3}
                placeholder="e.g. Newton's laws of motion with friction and inclined planes, including calculation of normal forces and kinetic coefficients."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm text-slate-100 placeholder-slate-500"
                required
              />
            </div>

            {/* Parameters Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Subject</label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:border-indigo-500"
                >
                  <option value="Physics">Physics</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Chemistry">Chemistry</option>
                  <option value="Biology">Biology</option>
                  <option value="World History">World History</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="English Literature">English Literature</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Target Grade</label>
                <select
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:border-indigo-500"
                >
                  <option value="Middle School (Grades 6-8)">Middle School (Grades 6-8)</option>
                  <option value="Grade 9">Grade 9</option>
                  <option value="Grade 10">Grade 10</option>
                  <option value="Grade 11">Grade 11</option>
                  <option value="Grade 12">Grade 12</option>
                  <option value="Grade 11-12 (AP)">Grade 11-12 (AP Level)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Question Count</label>
                <select
                  value={numQuestions}
                  onChange={(e) => setNumQuestions(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:border-indigo-500"
                >
                  <option value={3}>3 Questions (Quick Quiz)</option>
                  <option value={4}>4 Questions (Balanced)</option>
                  <option value={5}>5 Questions (Standard Unit Test)</option>
                  <option value={6}>6 Questions (Comprehensive)</option>
                  <option value={8}>8 Questions (In-depth Exam)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Set Deadline</label>
                <select
                  value={deadlineDays}
                  onChange={(e) => setDeadlineDays(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:border-indigo-500"
                >
                  <option value={1}>Due in 24 Hours</option>
                  <option value={3}>Due in 3 Days</option>
                  <option value={7}>Due in 1 Week</option>
                  <option value={14}>Due in 2 Weeks</option>
                  <option value={0}>No Strict Deadline</option>
                </select>
              </div>
            </div>

            {/* Custom Instructions */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Pedagogical Instructions (Optional)
              </label>
              <input
                type="text"
                value={customInstructions}
                onChange={(e) => setCustomInstructions(e.target.value)}
                placeholder="e.g. Include 1 multi-step numerical calculation and 1 short-answer conceptual synthesis"
                className="w-full px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:border-indigo-500"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !topic.trim()}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs shadow-lg shadow-indigo-600/30 transition-all cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Generating Assessment...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Generate Assessment</span>
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          /* Preview of Generated Test */
          <div className="space-y-6">
            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-xs text-indigo-400 mb-1">
                    <span>{generatedTest.subject}</span>
                    <span aria-hidden="true">·</span>
                    <span>{generatedTest.grade}</span>
                    <span aria-hidden="true">·</span>
                    <span>{generatedTest.durationMinutes} mins</span>
                    <span aria-hidden="true">·</span>
                    <span>Pass: {generatedTest.passingScore}%</span>
                  </div>
                  <h3 className="text-lg font-bold text-white tracking-tight">
                    {generatedTest.title}
                  </h3>
                  <p className="text-xs text-slate-300 mt-1">
                    {generatedTest.description}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Ready to Publish</span>
                </div>
              </div>
            </div>

            {/* Questions List Preview */}
            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              <p className="text-xs font-semibold text-slate-300">
                Generated Questions ({generatedTest.questions.length}):
              </p>
              {generatedTest.questions.map((q: Question, idx: number) => (
                <div
                  key={q.id || idx}
                  className="p-3.5 rounded-lg bg-slate-900/60 border border-slate-800/80 text-xs space-y-2"
                >
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="font-semibold text-indigo-300">Question {idx + 1}</span>
                    <div className="flex items-center gap-2">
                      <span className="capitalize">{q.type.replace('_', ' ')}</span>
                      <span aria-hidden="true">·</span>
                      <span className="tabular-nums">{q.points} pts</span>
                    </div>
                  </div>
                  <p className="text-slate-100 font-medium">{q.text}</p>
                  {q.options && q.options.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
                      {q.options.map((opt, oIdx) => {
                        const isCorrect = Array.isArray(q.correctAnswer)
                          ? q.correctAnswer.includes(opt)
                          : q.correctAnswer === opt;
                        return (
                          <div
                            key={oIdx}
                            className={`p-2 rounded border text-[11px] flex items-center justify-between ${
                              isCorrect
                                ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-200'
                                : 'bg-slate-950/40 border-slate-800/60 text-slate-400'
                            }`}
                          >
                            <span>{opt}</span>
                            {isCorrect && (
                              <span className="text-[10px] font-semibold text-emerald-400">
                                Correct Key
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                  {q.type === 'short_answer' && (
                    <div className="p-2 rounded bg-slate-950/40 border border-slate-800/60 text-[11px] text-slate-400">
                      <span className="text-slate-300 font-semibold">Model Answer / Rubric: </span>
                      {q.correctAnswer}
                    </div>
                  )}
                  <p className="text-[11px] text-slate-400 italic">
                    <span className="text-slate-300 not-italic font-semibold">Explanation: </span>
                    {q.explanation}
                  </p>
                </div>
              ))}
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setGeneratedTest(null)}
                className="text-xs text-slate-400 hover:text-slate-200 underline cursor-pointer"
              >
                Regenerate or Edit Prompt
              </button>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                >
                  Discard
                </button>
                <button
                  type="button"
                  onClick={handleAcceptAndOpen}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
                >
                  <span>Publish to Tests Library</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
