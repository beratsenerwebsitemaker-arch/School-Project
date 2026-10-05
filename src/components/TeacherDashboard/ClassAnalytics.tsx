import React from 'react';
import { useTests } from '../../context/TestContext';
import { BarChart3, TrendingUp, AlertTriangle, Users, Award, BookOpen } from 'lucide-react';

export const ClassAnalytics: React.FC = () => {
  const { tests, submissions, users } = useTests();

  const students = users.filter((u) => u.role === 'student');

  // Distribution buckets
  const tierA = submissions.filter((s) => s.percentage >= 90).length;
  const tierB = submissions.filter((s) => s.percentage >= 80 && s.percentage < 90).length;
  const tierC = submissions.filter((s) => s.percentage >= 70 && s.percentage < 80).length;
  const tierD = submissions.filter((s) => s.percentage < 70).length;

  // Breakdown by subject
  const subjectStats: Record<string, { count: number; totalScore: number }> = {};
  submissions.forEach((s) => {
    if (!subjectStats[s.subject]) {
      subjectStats[s.subject] = { count: 0, totalScore: 0 };
    }
    subjectStats[s.subject].count += 1;
    subjectStats[s.subject].totalScore += s.percentage;
  });

  return (
    <div className="space-y-8 text-left">
      <div>
        <h1 className="text-xl font-bold text-white tracking-tight">
          Class Analytics & Psychometric Insights
        </h1>
        <p className="text-xs text-slate-400">
          Cohort performance distributions, subject mastery benchmarks, and student progression
        </p>
      </div>

      {/* Aggregate Indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-[#0D121F] border border-slate-800">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Total Evaluated
          </p>
          <p className="text-2xl font-bold text-white tabular-nums mt-1">
            {submissions.length}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">Submissions analyzed</p>
        </div>

        <div className="p-4 rounded-xl bg-[#0D121F] border border-slate-800">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Distinction Rate (90%+)
          </p>
          <p className="text-2xl font-bold text-indigo-400 tabular-nums mt-1">
            {submissions.length > 0 ? Math.round((tierA / submissions.length) * 100) : 0}%
          </p>
          <p className="text-[11px] text-slate-500 mt-1">{tierA} students achieved tier A</p>
        </div>

        <div className="p-4 rounded-xl bg-[#0D121F] border border-slate-800">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Passing Benchmark
          </p>
          <p className="text-2xl font-bold text-emerald-400 tabular-nums mt-1">
            {submissions.length > 0
              ? Math.round(((tierA + tierB + tierC) / submissions.length) * 100)
              : 0}
            %
          </p>
          <p className="text-[11px] text-slate-500 mt-1">Pass score threshold: 70%</p>
        </div>

        <div className="p-4 rounded-xl bg-[#0D121F] border border-slate-800">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Needs Intervention
          </p>
          <p className="text-2xl font-bold text-rose-400 tabular-nums mt-1">
            {tierD}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">Scores below passing bar</p>
        </div>
      </div>

      {/* Two Column Layout: Score Distribution & Subject Mastery */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Score Distribution Chart */}
        <div className="p-6 rounded-2xl bg-[#0D121F] border border-slate-800 space-y-4">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">
            Cohort Score Distribution
          </h2>
          <div className="space-y-3 pt-2">
            {[
              { label: '90% - 100% (Distinction)', count: tierA, color: 'bg-emerald-500' },
              { label: '80% - 89% (Proficient)', count: tierB, color: 'bg-indigo-500' },
              { label: '70% - 79% (Standard Pass)', count: tierC, color: 'bg-sky-500' },
              { label: 'Under 70% (Remediation)', count: tierD, color: 'bg-rose-500' },
            ].map((tier) => {
              const pct = submissions.length > 0 ? (tier.count / submissions.length) * 100 : 0;
              return (
                <div key={tier.label} className="space-y-1 text-xs">
                  <div className="flex justify-between text-slate-300">
                    <span>{tier.label}</span>
                    <span className="font-bold text-white tabular-nums">
                      {tier.count} ({Math.round(pct)}%)
                    </span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-slate-900 border border-slate-800 overflow-hidden">
                    <div
                      className={`h-full ${tier.color} transition-all duration-500 rounded-full`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Subject Mastery Performance */}
        <div className="p-6 rounded-2xl bg-[#0D121F] border border-slate-800 space-y-4">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">
            Subject Track Benchmarks
          </h2>
          <div className="space-y-3 pt-2">
            {Object.entries(subjectStats).map(([subj, stat]) => {
              const avg = Math.round(stat.totalScore / stat.count);
              return (
                <div key={subj} className="space-y-1 text-xs">
                  <div className="flex justify-between text-slate-300">
                    <span className="font-medium text-slate-200">{subj}</span>
                    <span className="font-bold text-indigo-400 tabular-nums">
                      {avg}% Avg ({stat.count} submissions)
                    </span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-slate-900 border border-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-indigo-500 transition-all duration-500 rounded-full"
                      style={{ width: `${avg}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Student Roster Performance Table */}
      <div className="p-6 rounded-2xl bg-[#0D121F] border border-slate-800 space-y-4">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider">
          Student Cohort Performance Summary
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-[10px] uppercase tracking-wider">
                <th className="py-2.5 px-3">Student Name</th>
                <th className="py-2.5 px-3">Academic Track</th>
                <th className="py-2.5 px-3">Assessments Taken</th>
                <th className="py-2.5 px-3">Average Score</th>
                <th className="py-2.5 px-3">Latest Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {students.map((student) => {
                const stuSubs = submissions.filter((s) => s.studentId === student.id);
                const avg =
                  stuSubs.length > 0
                    ? Math.round(stuSubs.reduce((acc, s) => acc + s.percentage, 0) / stuSubs.length)
                    : null;
                const latest = stuSubs[0];

                return (
                  <tr key={student.id} className="hover:bg-slate-900/60">
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <img
                          src={student.avatar}
                          alt={student.name}
                          referrerPolicy="no-referrer"
                          className="w-6 h-6 rounded-full object-cover"
                        />
                        <span className="font-semibold text-slate-200">{student.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-slate-400">{student.grade || 'Grade 11'}</td>
                    <td className="py-3 px-3 font-semibold text-white tabular-nums">
                      {stuSubs.length} tests
                    </td>
                    <td className="py-3 px-3 tabular-nums">
                      {avg !== null ? (
                        <span
                          className={`font-bold ${
                            avg >= 70 ? 'text-emerald-400' : 'text-rose-400'
                          }`}
                        >
                          {avg}%
                        </span>
                      ) : (
                        <span className="text-slate-500">—</span>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      {latest ? (
                        <span className="text-slate-300">
                          {latest.testTitle} ({latest.percentage}%)
                        </span>
                      ) : (
                        <span className="text-slate-500 italic">No activity</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
