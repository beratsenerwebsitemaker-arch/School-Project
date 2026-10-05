import React, { useState } from 'react';
import { useTests } from '../../context/TestContext';
import { TestSubmission } from '../../types';
import { SubmissionReviewModal } from './SubmissionReviewModal';
import {
  Search,
  Filter,
  Download,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  BarChart2,
  AlertCircle,
  FileSpreadsheet,
} from 'lucide-react';

export const SubmissionsGradebook: React.FC = () => {
  const { submissions, tests } = useTests();

  const [search, setSearch] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedSubmission, setSelectedSubmission] = useState<TestSubmission | null>(null);

  const subjects = ['all', ...Array.from(new Set(submissions.map((s) => s.subject)))];

  const filteredSubmissions = submissions.filter((sub) => {
    const matchesSearch =
      sub.studentName.toLowerCase().includes(search.toLowerCase()) ||
      sub.testTitle.toLowerCase().includes(search.toLowerCase());
    const matchesSubject = subjectFilter === 'all' || sub.subject === subjectFilter;
    const matchesStatus = statusFilter === 'all' || sub.status === statusFilter;
    return matchesSearch && matchesSubject && matchesStatus;
  });

  // Calculate statistics
  const totalSubmissions = submissions.length;
  const passedCount = submissions.filter((s) => s.passed).length;
  const passRate = totalSubmissions > 0 ? Math.round((passedCount / totalSubmissions) * 100) : 0;
  const avgScore =
    totalSubmissions > 0
      ? Math.round(
          submissions.reduce((acc, s) => acc + s.percentage, 0) / totalSubmissions
        )
      : 0;

  const exportCSV = () => {
    const headers = [
      'Submission ID',
      'Student Name',
      'Test Title',
      'Subject',
      'Submitted At',
      'Time Spent (s)',
      'Score',
      'Max Score',
      'Percentage',
      'Status',
    ];
    const rows = filteredSubmissions.map((s) => [
      s.id,
      `"${s.studentName}"`,
      `"${s.testTitle}"`,
      `"${s.subject}"`,
      s.submittedAt,
      s.timeSpentSeconds,
      s.score,
      s.maxScore,
      `${s.percentage}%`,
      s.status,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Vantage_Tester_Gradebook_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatDuration = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}m ${s < 10 ? '0' : ''}${s}s`;
  };

  return (
    <div className="space-y-6 text-left">
      
      {/* Top Banner & Metrics */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">
            Academic Gradebook & Student Submissions
          </h1>
          <p className="text-xs text-slate-400">
            Audit student test answers, adjust rubric marks, and track cohort mastery
          </p>
        </div>

        <button
          onClick={exportCSV}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-200 transition-colors cursor-pointer"
        >
          <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
          <span>Export CSV Report</span>
        </button>
      </div>

      {/* Aggregate KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-[#0D121F] border border-slate-800">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Total Submissions
          </p>
          <p className="text-2xl font-bold text-white tabular-nums mt-1">
            {totalSubmissions}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">
            Across {tests.length} school assessments
          </p>
        </div>

        <div className="p-4 rounded-xl bg-[#0D121F] border border-slate-800">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Cohort Average
          </p>
          <p className="text-2xl font-bold text-indigo-400 tabular-nums mt-1">
            {avgScore}%
          </p>
          <p className="text-[11px] text-slate-500 mt-1">
            Standard pass benchmark: 70%
          </p>
        </div>

        <div className="p-4 rounded-xl bg-[#0D121F] border border-slate-800">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Passing Rate
          </p>
          <p className="text-2xl font-bold text-emerald-400 tabular-nums mt-1">
            {passRate}%
          </p>
          <p className="text-[11px] text-slate-500 mt-1">
            {passedCount} of {totalSubmissions} attempts passed
          </p>
        </div>

        <div className="p-4 rounded-xl bg-[#0D121F] border border-slate-800">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Active Tests
          </p>
          <p className="text-2xl font-bold text-white tabular-nums mt-1">
            {tests.filter((t) => t.status === 'published').length}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">
            STEM & Humanities curricula
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-[#0D121F] border border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by student name or assessment title..."
            className="w-full pl-9 pr-3.5 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Subject Filter */}
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Filter className="w-3.5 h-3.5" />
            <select
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200"
            >
              {subjects.map((sub) => (
                <option key={sub} value={sub}>
                  {sub === 'all' ? 'All Subjects' : sub}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200"
          >
            <option value="all">All Statuses</option>
            <option value="graded">Graded</option>
            <option value="needs_review">Needs Review</option>
          </select>
        </div>
      </div>

      {/* Submissions Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-800 bg-[#0D121F]">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-900/80 text-slate-400 uppercase tracking-wider text-[10px]">
              <th className="py-3 px-4">Student</th>
              <th className="py-3 px-4">Assessment Title</th>
              <th className="py-3 px-4">Subject</th>
              <th className="py-3 px-4">Submitted</th>
              <th className="py-3 px-4">Time Spent</th>
              <th className="py-3 px-4">Score</th>
              <th className="py-3 px-4">Percentage</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80">
            {filteredSubmissions.length > 0 ? (
              filteredSubmissions.map((sub) => (
                <tr
                  key={sub.id}
                  className="hover:bg-slate-900/60 transition-colors group cursor-pointer"
                  onClick={() => setSelectedSubmission(sub)}
                >
                  {/* Student */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={sub.studentAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                        alt={sub.studentName}
                        referrerPolicy="no-referrer"
                        className="w-7 h-7 rounded-full object-cover bg-slate-800 shrink-0"
                      />
                      <div>
                        <p className="font-semibold text-slate-200 leading-tight">
                          {sub.studentName}
                        </p>
                        <p className="text-[10px] text-slate-400 mt-0.5">Enrolled Student</p>
                      </div>
                    </div>
                  </td>

                  {/* Title */}
                  <td className="py-3.5 px-4 font-medium text-slate-200 max-w-xs truncate">
                    {sub.testTitle}
                  </td>

                  {/* Subject */}
                  <td className="py-3.5 px-4 text-slate-400">
                    {sub.subject}
                  </td>

                  {/* Date & Deadline Timing */}
                  <td className="py-3.5 px-4 text-slate-400 tabular-nums">
                    <div>
                      {new Date(sub.submittedAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                    {sub.isLate ? (
                      <span className="inline-flex items-center text-[10px] font-bold text-amber-400 bg-amber-950/40 border border-amber-800/60 px-1.5 py-0.5 rounded mt-0.5">
                        Submitted Late
                      </span>
                    ) : (
                      <span className="text-[10px] text-emerald-400/80 mt-0.5 block">
                        On Time
                      </span>
                    )}
                  </td>

                  {/* Time Spent */}
                  <td className="py-3.5 px-4 text-slate-400 tabular-nums">
                    {formatDuration(sub.timeSpentSeconds)}
                  </td>

                  {/* Points */}
                  <td className="py-3.5 px-4 font-bold text-slate-200 tabular-nums">
                    {sub.score} / {sub.maxScore}
                  </td>

                  {/* Grade % */}
                  <td className="py-3.5 px-4 tabular-nums">
                    <span
                      className={`font-bold ${
                        sub.percentage >= 70 ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {sub.percentage}%
                    </span>
                  </td>

                  {/* Status Badge */}
                  <td className="py-3.5 px-4">
                    {sub.status === 'graded' ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Graded</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-400">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>Needs Review</span>
                      </span>
                    )}
                  </td>

                  {/* Action */}
                  <td className="py-3.5 px-4 text-right">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedSubmission(sub);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 font-semibold text-[11px] border border-indigo-500/40 transition-colors cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Review Test</span>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={9} className="py-10 text-center text-slate-500">
                  No student submissions found matching the criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Submission Review Modal */}
      {selectedSubmission && (
        <SubmissionReviewModal
          submission={selectedSubmission}
          isOpen={!!selectedSubmission}
          onClose={() => setSelectedSubmission(null)}
        />
      )}
    </div>
  );
};
