import React, { useState } from 'react';
import { useTests } from '../../context/TestContext';
import { Test, Question, QuestionType } from '../../types';
import {
  Plus,
  Trash2,
  Save,
  ArrowLeft,
  Sparkles,
  HelpCircle,
  CheckCircle2,
  AlertCircle,
  Copy,
  Calendar,
  Clock,
} from 'lucide-react';

interface TestBuilderProps {
  initialTest?: Test | null;
  onDone: () => void;
  onOpenAIGenerator: () => void;
}

export const TestBuilder: React.FC<TestBuilderProps> = ({
  initialTest,
  onDone,
  onOpenAIGenerator,
}) => {
  const { createTest, updateTest } = useTests();

  const [title, setTitle] = useState(initialTest?.title || '');
  const [subject, setSubject] = useState(initialTest?.subject || 'Physics');
  const [grade, setGrade] = useState(initialTest?.grade || 'Grade 10');
  const [description, setDescription] = useState(initialTest?.description || '');
  const [durationMinutes, setDurationMinutes] = useState(initialTest?.durationMinutes || 20);
  const [passingScore, setPassingScore] = useState(initialTest?.passingScore || 70);
  const [deadline, setDeadline] = useState(
    initialTest?.deadline ? new Date(initialTest.deadline).toISOString().slice(0, 16) : ''
  );
  const [allowLateSubmission, setAllowLateSubmission] = useState(
    initialTest?.allowLateSubmission ?? true
  );

  const setDeadlinePreset = (daysFromNow: number | null) => {
    if (daysFromNow === null) {
      setDeadline('');
      return;
    }
    const d = new Date();
    d.setDate(d.getDate() + daysFromNow);
    d.setHours(23, 59, 0, 0);
    // Format to YYYY-MM-DDTHH:mm
    const iso = new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
    setDeadline(iso);
  };

  const [questions, setQuestions] = useState<Question[]>(
    initialTest?.questions || [
      {
        id: `q_${Date.now()}_1`,
        text: '',
        type: 'single',
        options: ['Option A', 'Option B', 'Option C', 'Option D'],
        correctAnswer: 'Option A',
        points: 5,
        explanation: '',
        difficulty: 'medium',
      },
    ]
  );

  const [validationError, setValidationError] = useState<string | null>(null);

  const handleAddQuestion = (type: QuestionType = 'single') => {
    const newQ: Question = {
      id: `q_${Date.now()}_${questions.length + 1}`,
      text: '',
      type,
      options:
        type === 'boolean'
          ? ['True', 'False']
          : type === 'short_answer'
          ? []
          : ['Option A', 'Option B', 'Option C', 'Option D'],
      correctAnswer: type === 'boolean' ? 'True' : type === 'short_answer' ? '' : 'Option A',
      points: 5,
      explanation: '',
      difficulty: 'medium',
    };
    setQuestions([...questions, newQ]);
  };

  const handleRemoveQuestion = (idx: number) => {
    if (questions.length <= 1) {
      setValidationError('A test must contain at least one question.');
      return;
    }
    setQuestions(questions.filter((_, i) => i !== idx));
  };

  const handleQuestionChange = (idx: number, patch: Partial<Question>) => {
    setQuestions((prev) => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], ...patch };
      return copy;
    });
  };

  const handleOptionChange = (qIdx: number, optIdx: number, val: string) => {
    const q = questions[qIdx];
    if (!q.options) return;
    const oldVal = q.options[optIdx];
    const newOptions = [...q.options];
    newOptions[optIdx] = val;

    let newCorrect = q.correctAnswer;
    if (q.type === 'single' || q.type === 'boolean') {
      if (newCorrect === oldVal) newCorrect = val;
    } else if (q.type === 'multiple' && Array.isArray(newCorrect)) {
      newCorrect = newCorrect.map((c) => (c === oldVal ? val : c));
    }

    handleQuestionChange(qIdx, { options: newOptions, correctAnswer: newCorrect });
  };

  const handleAddOption = (qIdx: number) => {
    const q = questions[qIdx];
    const newOpts = [...(q.options || []), `Option ${(q.options?.length || 0) + 1}`];
    handleQuestionChange(qIdx, { options: newOpts });
  };

  const handleRemoveOption = (qIdx: number, optIdx: number) => {
    const q = questions[qIdx];
    if (!q.options || q.options.length <= 2) return;
    const removedVal = q.options[optIdx];
    const newOpts = q.options.filter((_, i) => i !== optIdx);

    let newCorrect = q.correctAnswer;
    if (q.type === 'single' && newCorrect === removedVal) {
      newCorrect = newOpts[0];
    } else if (q.type === 'multiple' && Array.isArray(newCorrect)) {
      newCorrect = newCorrect.filter((c) => c !== removedVal);
    }

    handleQuestionChange(qIdx, { options: newOpts, correctAnswer: newCorrect });
  };

  const toggleMultipleCorrect = (qIdx: number, optVal: string) => {
    const q = questions[qIdx];
    const current = Array.isArray(q.correctAnswer) ? [...q.correctAnswer] : [];
    const exists = current.includes(optVal);
    const updated = exists ? current.filter((c) => c !== optVal) : [...current, optVal];
    handleQuestionChange(qIdx, { correctAnswer: updated });
  };

  const handleSave = (status: 'published' | 'draft') => {
    if (!title.trim()) {
      setValidationError('Please specify a title for the test.');
      return;
    }

    // Verify all questions have prompts
    for (let i = 0; i < questions.length; i++) {
      if (!questions[i].text.trim()) {
        setValidationError(`Question ${i + 1} has an empty prompt.`);
        return;
      }
      if (questions[i].type === 'short_answer' && !String(questions[i].correctAnswer).trim()) {
        setValidationError(`Question ${i + 1} requires a model answer/rubric.`);
        return;
      }
    }

    setValidationError(null);

    if (initialTest) {
      updateTest({
        ...initialTest,
        title: title.trim(),
        subject,
        grade,
        description: description.trim(),
        durationMinutes,
        passingScore,
        deadline: deadline ? new Date(deadline).toISOString() : undefined,
        allowLateSubmission,
        questions,
        status,
      });
    } else {
      createTest({
        title: title.trim(),
        subject,
        grade,
        description: description.trim(),
        durationMinutes,
        passingScore,
        deadline: deadline ? new Date(deadline).toISOString() : undefined,
        allowLateSubmission,
        questions,
        createdBy: 'Teacher',
        status,
      });
    }

    onDone();
  };

  const totalPoints = questions.reduce((acc, q) => acc + (q.points || 0), 0);

  return (
    <div className="space-y-6 max-w-5xl mx-auto text-left pb-16">
      
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onDone}
            className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">
              {initialTest ? 'Edit Assessment' : 'Author New School Test'}
            </h1>
            <p className="text-xs text-slate-400">
              Formulate questions, designate answer keys, and set scoring rules
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenAIGenerator}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 text-xs font-semibold transition-colors cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Generate with AI Architect</span>
          </button>

          <button
            type="button"
            onClick={() => handleSave('draft')}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-medium text-slate-300 transition-colors cursor-pointer"
          >
            Save Draft
          </button>

          <button
            type="button"
            onClick={() => handleSave('published')}
            className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Publish Test</span>
          </button>
        </div>
      </div>

      {validationError && (
        <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-800/60 text-red-200 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{validationError}</span>
        </div>
      )}

      {/* Test Meta Configuration Card */}
      <div className="p-6 rounded-2xl bg-[#0D121F] border border-slate-800 space-y-4">
        <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
          Test Parameters & Curriculum Metadata
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Assessment Title <span className="text-indigo-400">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. AP Physics 1: Kinematics & Newton's Laws"
              className="w-full px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-800 text-sm text-slate-100 placeholder-slate-500 focus:border-indigo-500"
            />
          </div>

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
            <label className="block text-xs font-medium text-slate-300 mb-1">Grade Level</label>
            <select
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:border-indigo-500"
            >
              <option value="Middle School">Middle School</option>
              <option value="Grade 9">Grade 9</option>
              <option value="Grade 10">Grade 10</option>
              <option value="Grade 11">Grade 11</option>
              <option value="Grade 12">Grade 12</option>
              <option value="Grade 11-12 (AP)">Grade 11-12 (AP Level)</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Description & Student Instructions
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              placeholder="Provide instructions, calculators permitted, syllabus references, etc."
              className="w-full px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Time Limit (Minutes)
            </label>
            <input
              type="number"
              min={1}
              max={180}
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-100 tabular-nums focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Passing Threshold (%)
            </label>
            <input
              type="number"
              min={1}
              max={100}
              value={passingScore}
              onChange={(e) => setPassingScore(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-100 tabular-nums focus:border-indigo-500"
            />
          </div>

          {/* Submission Deadline Configuration */}
          <div className="sm:col-span-2 lg:col-span-4 p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
                <Calendar className="w-4 h-4 text-indigo-400" />
                <span>Test Submission Deadline</span>
                <span className="text-[11px] font-normal text-slate-400">
                  (Students must submit test before this time)
                </span>
              </div>

              {/* Deadline Quick Presets */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] uppercase font-bold text-slate-500 mr-1">Presets:</span>
                <button
                  type="button"
                  onClick={() => setDeadlinePreset(1)}
                  className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-750 text-[11px] text-slate-300 cursor-pointer"
                >
                  +24 Hours
                </button>
                <button
                  type="button"
                  onClick={() => setDeadlinePreset(3)}
                  className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-750 text-[11px] text-slate-300 cursor-pointer"
                >
                  +3 Days
                </button>
                <button
                  type="button"
                  onClick={() => setDeadlinePreset(7)}
                  className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-750 text-[11px] text-slate-300 cursor-pointer"
                >
                  +1 Week
                </button>
                <button
                  type="button"
                  onClick={() => setDeadlinePreset(14)}
                  className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-750 text-[11px] text-slate-300 cursor-pointer"
                >
                  +2 Weeks
                </button>
                <button
                  type="button"
                  onClick={() => setDeadlinePreset(null)}
                  className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-750 text-[11px] text-rose-300 cursor-pointer"
                >
                  No Deadline
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">
                  Due Date & Time (Local Workstation Time)
                </label>
                <input
                  type="datetime-local"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:border-indigo-500"
                />
              </div>

              <div className="flex flex-col justify-end">
                <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer pb-2">
                  <input
                    type="checkbox"
                    checked={allowLateSubmission}
                    onChange={(e) => setAllowLateSubmission(e.target.checked)}
                    className="rounded text-indigo-600 focus:ring-indigo-500 bg-slate-900 border-slate-700"
                  />
                  <span>Allow submissions after deadline (flagged as "Late Submission" in gradebook)</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Questions Section Header */}
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-bold text-white">Questions Formulation</h2>
          <span className="text-xs text-slate-400">
            ({questions.length} Questions · <span className="tabular-nums font-semibold text-indigo-400">{totalPoints} Total Points</span>)
          </span>
        </div>

        {/* Add question quick menu */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => handleAddQuestion('single')}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Multiple Choice</span>
          </button>
          <button
            type="button"
            onClick={() => handleAddQuestion('multiple')}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Multi-Select</span>
          </button>
          <button
            type="button"
            onClick={() => handleAddQuestion('boolean')}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>True/False</span>
          </button>
          <button
            type="button"
            onClick={() => handleAddQuestion('short_answer')}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Short Answer</span>
          </button>
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {questions.map((q, qIdx) => (
          <div
            key={q.id || qIdx}
            className="p-5 rounded-2xl bg-[#0D121F] border border-slate-800 space-y-4 text-xs"
          >
            {/* Question Top Row */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
              <div className="flex items-center gap-3">
                <span className="font-bold text-sm text-indigo-400">
                  #{qIdx + 1}
                </span>
                <select
                  value={q.type}
                  onChange={(e) => {
                    const newType = e.target.value as QuestionType;
                    const defaultOpts =
                      newType === 'boolean'
                        ? ['True', 'False']
                        : newType === 'short_answer'
                        ? []
                        : ['Option A', 'Option B', 'Option C', 'Option D'];
                    handleQuestionChange(qIdx, {
                      type: newType,
                      options: defaultOpts,
                      correctAnswer: newType === 'boolean' ? 'True' : newType === 'short_answer' ? '' : 'Option A',
                    });
                  }}
                  className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 font-medium"
                >
                  <option value="single">Single Choice (Radio)</option>
                  <option value="multiple">Multi-Select (Checkboxes)</option>
                  <option value="boolean">True / False</option>
                  <option value="short_answer">Short Answer / Essay</option>
                </select>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-400">Points:</span>
                  <input
                    type="number"
                    min={1}
                    max={50}
                    value={q.points}
                    onChange={(e) =>
                      handleQuestionChange(qIdx, { points: Number(e.target.value) || 1 })
                    }
                    className="w-14 px-2 py-1 rounded bg-slate-900 border border-slate-800 text-slate-100 tabular-nums text-center"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => handleRemoveQuestion(qIdx)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-slate-900 transition-colors cursor-pointer"
                  title="Remove Question"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Question Text */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Question Prompt Text
              </label>
              <textarea
                value={q.text}
                onChange={(e) => handleQuestionChange(qIdx, { text: e.target.value })}
                rows={2}
                placeholder="Write the question prompt here..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:border-indigo-500"
              />
            </div>

            {/* Answer Options & Key Selection */}
            {q.type === 'single' && q.options && (
              <div className="space-y-2">
                <p className="text-[11px] text-slate-400">
                  Select the radio button next to the correct answer:
                </p>
                {q.options.map((opt, oIdx) => (
                  <div key={oIdx} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name={`correct-${q.id}`}
                      checked={q.correctAnswer === opt}
                      onChange={() => handleQuestionChange(qIdx, { correctAnswer: opt })}
                      className="text-indigo-600 focus:ring-indigo-500"
                    />
                    <input
                      type="text"
                      value={opt}
                      onChange={(e) => handleOptionChange(qIdx, oIdx, e.target.value)}
                      className="flex-1 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200"
                    />
                    {q.options!.length > 2 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveOption(qIdx, oIdx)}
                        className="text-slate-500 hover:text-red-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => handleAddOption(qIdx)}
                  className="text-xs text-indigo-400 hover:text-indigo-300 cursor-pointer pt-1"
                >
                  + Add another choice
                </button>
              </div>
            )}

            {q.type === 'multiple' && q.options && (
              <div className="space-y-2">
                <p className="text-[11px] text-slate-400">
                  Check all options that are correct answers:
                </p>
                {q.options.map((opt, oIdx) => {
                  const isChecked = Array.isArray(q.correctAnswer) && q.correctAnswer.includes(opt);
                  return (
                    <div key={oIdx} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleMultipleCorrect(qIdx, opt)}
                        className="rounded text-indigo-600 focus:ring-indigo-500"
                      />
                      <input
                        type="text"
                        value={opt}
                        onChange={(e) => handleOptionChange(qIdx, oIdx, e.target.value)}
                        className="flex-1 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200"
                      />
                      {q.options!.length > 2 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveOption(qIdx, oIdx)}
                          className="text-slate-500 hover:text-red-400"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  );
                })}
                <button
                  type="button"
                  onClick={() => handleAddOption(qIdx)}
                  className="text-xs text-indigo-400 hover:text-indigo-300 cursor-pointer pt-1"
                >
                  + Add another choice
                </button>
              </div>
            )}

            {q.type === 'boolean' && (
              <div className="flex items-center gap-6 p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                <span className="text-slate-400 font-medium">Designate Correct Key:</span>
                <label className="flex items-center gap-2 text-slate-200 cursor-pointer">
                  <input
                    type="radio"
                    name={`bool-${q.id}`}
                    value="True"
                    checked={q.correctAnswer === 'True'}
                    onChange={() => handleQuestionChange(qIdx, { correctAnswer: 'True' })}
                  />
                  <span>True</span>
                </label>
                <label className="flex items-center gap-2 text-slate-200 cursor-pointer">
                  <input
                    type="radio"
                    name={`bool-${q.id}`}
                    value="False"
                    checked={q.correctAnswer === 'False'}
                    onChange={() => handleQuestionChange(qIdx, { correctAnswer: 'False' })}
                  />
                  <span>False</span>
                </label>
              </div>
            )}

            {q.type === 'short_answer' && (
              <div>
                <label className="block text-xs font-medium text-indigo-400 mb-1">
                  Model Answer / Rubric Expectation <span className="text-indigo-400">*</span>
                </label>
                <textarea
                  value={String(q.correctAnswer || '')}
                  onChange={(e) => handleQuestionChange(qIdx, { correctAnswer: e.target.value })}
                  rows={2}
                  placeholder="Detail key terms, required statements, or numerical tolerances for full credit..."
                  className="w-full px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:border-indigo-500"
                />
              </div>
            )}

            {/* Explanation / Rationale */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Explanatory Solution (Visible to students after test)
                </label>
                <input
                  type="text"
                  value={q.explanation}
                  onChange={(e) => handleQuestionChange(qIdx, { explanation: e.target.value })}
                  placeholder="Explain why the answer is correct..."
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder-slate-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Optional Hint (Revealed on request)
                </label>
                <input
                  type="text"
                  value={q.hint || ''}
                  onChange={(e) => handleQuestionChange(qIdx, { hint: e.target.value })}
                  placeholder="e.g. Consider the normal force equation"
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder-slate-500"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Action Footer */}
      <div className="flex items-center justify-between p-4 rounded-xl bg-[#0D121F] border border-slate-800">
        <button
          type="button"
          onClick={() => handleAddQuestion('single')}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-200 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Another Question</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onDone}
            className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-slate-200 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => handleSave('published')}
            className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Publish Test to Students</span>
          </button>
        </div>
      </div>
    </div>
  );
};
