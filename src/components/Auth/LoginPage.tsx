import React, { useState } from 'react';
import { useTests } from '../../context/TestContext';
import { UserRole } from '../../types';
import {
  GraduationCap,
  School,
  Lock,
  Mail,
  ArrowRight,
  UserCheck,
  Sparkles,
  AlertCircle,
  KeyRound,
  UserPlus,
  LogIn,
  ShieldCheck,
  FolderOpen,
} from 'lucide-react';

interface LoginPageProps {
  onSuccess?: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onSuccess }) => {
  const { users, login, registerUser, switchUser } = useTests();

  const [role, setRole] = useState<UserRole>('teacher');
  const [authMode, setAuthMode] = useState<'chooser' | 'signin' | 'register'>('chooser');

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('password123');
  const [name, setName] = useState('');
  const [gradeOrDept, setGradeOrDept] = useState('');
  const [error, setError] = useState<string | null>(null);

  const staffUsers = users.filter((u) => u.role === 'teacher');
  const studentUsers = users.filter((u) => u.role === 'student');

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const result = login(email, password, role);
    if (!result.success) {
      setError(result.error || 'Authentication failed');
      return;
    }

    if (onSuccess) onSuccess();
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !email.trim()) {
      setError('Please provide your full name and institutional email.');
      return;
    }

    registerUser({
      name: name.trim(),
      email: email.trim(),
      role,
      department: role === 'teacher' ? gradeOrDept || 'Department of Sciences' : undefined,
      grade: role === 'student' ? gradeOrDept || 'Grade 11 - General' : undefined,
      password: password || 'vantage123',
    });

    if (onSuccess) onSuccess();
  };

  const handleQuickSelect = (userId: string) => {
    switchUser(userId);
    if (onSuccess) onSuccess();
  };

  return (
    <div className="min-h-screen bg-[#070A0F] text-slate-100 flex flex-col justify-center items-center p-4 sm:p-6 selection:bg-indigo-600/30 selection:text-indigo-200">
      
      {/* Background radial glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-emerald-600/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="relative w-full max-w-lg bg-[#0C1019] border border-slate-800 rounded-3xl shadow-2xl overflow-hidden text-left">
        
        {/* Google Classroom styled chromatic accent strip */}
        <div className="h-1.5 w-full bg-gradient-to-r from-emerald-500 via-indigo-500 to-amber-500" />

        <div className="p-6 sm:p-8 space-y-6">
          {/* Google Classroom Header Brand */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 mb-1 shadow-lg shadow-emerald-900/20">
              <School className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center justify-center gap-2">
              <span>Vantage Classroom</span>
            </h1>
            <p className="text-xs text-slate-400">
              Google Classroom & Workspace for Education Portal
            </p>
          </div>

          {/* Role Chooser Tabs (Teacher / Faculty vs Student) */}
          <div className="grid grid-cols-2 p-1 rounded-2xl bg-slate-900/90 border border-slate-800">
            <button
              type="button"
              onClick={() => {
                setRole('teacher');
                setError(null);
              }}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                role === 'teacher'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>Teacher / Faculty</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setRole('student');
                setError(null);
              }}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                role === 'student'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <School className="w-4 h-4" />
              <span>Student</span>
            </button>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-950/60 border border-red-800/60 text-red-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* MODE 1: Google Classroom Account Chooser Dialog */}
          {authMode === 'chooser' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Choose an account to continue
                </span>
                <span className="text-[10px] text-indigo-400 font-semibold">
                  {role === 'teacher' ? 'Faculty Roster' : 'Student Roster'}
                </span>
              </div>

              {/* Account selection list */}
              <div className="space-y-2">
                {(role === 'teacher' ? staffUsers : studentUsers).map((u) => (
                  <button
                    key={u.id}
                    onClick={() => handleQuickSelect(u.id)}
                    className="w-full p-3.5 rounded-2xl bg-slate-900/80 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 flex items-center justify-between text-xs transition-all group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={u.avatar}
                        alt={u.name}
                        referrerPolicy="no-referrer"
                        className="w-10 h-10 rounded-full object-cover bg-slate-800 ring-2 ring-slate-800 group-hover:ring-indigo-500 transition-all shrink-0"
                      />
                      <div className="text-left">
                        <p className="font-semibold text-white group-hover:text-indigo-300 transition-colors">
                          {u.name}
                        </p>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {u.email}
                        </p>
                        <span className="text-[10px] text-slate-500 block">
                          {u.title || u.grade || u.department || 'Enrolled Member'}
                        </span>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
                  </button>
                ))}
              </div>

              {/* Bottom Switch to Email Signin or Register */}
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={() => setAuthMode('signin')}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  Use another account
                </button>
                <button
                  type="button"
                  onClick={() => setAuthMode('register')}
                  className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors cursor-pointer"
                >
                  Create account
                </button>
              </div>
            </div>
          )}

          {/* MODE 2: Sign In with Email & Password */}
          {authMode === 'signin' && (
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Google Workspace / Institutional Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={
                      role === 'teacher'
                        ? 'clara.vance@vantage.edu'
                        : 'alex.rivera@students.vantage.edu'
                    }
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:border-indigo-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password..."
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:border-indigo-500"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={() => setAuthMode('chooser')}
                  className="text-xs text-slate-400 hover:text-slate-200 cursor-pointer"
                >
                  ← Back to account list
                </button>
                <button
                  type="submit"
                  className={`px-6 py-2.5 rounded-xl text-white font-semibold text-xs shadow-lg transition-all flex items-center gap-2 cursor-pointer ${
                    role === 'teacher'
                      ? 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/30'
                      : 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/30'
                  }`}
                >
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* MODE 3: Create New Account */}
          {authMode === 'register' && (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Full Name <span className="text-indigo-400">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={role === 'teacher' ? 'Dr. Elizabeth Moore' : 'Jordan Chen'}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Institutional Email <span className="text-indigo-400">*</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@vantage.edu"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {role === 'teacher' ? 'Department / Subject Area' : 'Grade Level'}
                </label>
                <input
                  type="text"
                  value={gradeOrDept}
                  onChange={(e) => setGradeOrDept(e.target.value)}
                  placeholder={role === 'teacher' ? 'e.g. Physics & Astronomy' : 'e.g. Grade 11 AP'}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create password..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={() => setAuthMode('chooser')}
                  className="text-xs text-slate-400 hover:text-slate-200 cursor-pointer"
                >
                  ← Back to account list
                </button>
                <button
                  type="submit"
                  className={`px-6 py-2.5 rounded-xl text-white font-semibold text-xs shadow-lg transition-all flex items-center gap-2 cursor-pointer ${
                    role === 'teacher'
                      ? 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/30'
                      : 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/30'
                  }`}
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Register {role === 'teacher' ? 'Staff' : 'Student'}</span>
                </button>
              </div>
            </form>
          )}

          {/* Privacy & Workspace notice */}
          <div className="pt-2 text-center text-[11px] text-slate-500 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Secured institutional access · Vantage Tester & Classroom Suite</span>
          </div>
        </div>
      </div>
    </div>
  );
};
