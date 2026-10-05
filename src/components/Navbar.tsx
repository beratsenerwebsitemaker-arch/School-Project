import React, { useState } from 'react';
import { useTests } from '../context/TestContext';
import {
  GraduationCap,
  BookOpen,
  PenTool,
  ClipboardCheck,
  BarChart3,
  User,
  ChevronDown,
  Check,
  LogOut,
  LogIn,
  FolderOpen,
  Megaphone,
} from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onOpenLogin?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onSelectTab, onOpenLogin }) => {
  const { currentUser, users, switchUser, logout } = useTests();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const isTeacher = currentUser?.role === 'teacher';

  const teacherNavLinks = [
    { id: 'stream', label: 'Stream', icon: Megaphone },
    { id: 'tests', label: 'Classwork & Tests', icon: BookOpen },
    { id: 'drive', label: 'Class Drive', icon: FolderOpen },
    { id: 'gradebook', label: 'Gradebook', icon: ClipboardCheck },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  ];

  const studentNavLinks = [
    { id: 'stream', label: 'Stream', icon: Megaphone },
    { id: 'tests', label: 'Classwork & Tests', icon: BookOpen },
    { id: 'drive', label: 'Class Drive', icon: FolderOpen },
    { id: 'my-grades', label: 'My Submissions', icon: ClipboardCheck },
  ];

  const navLinks = isTeacher ? teacherNavLinks : studentNavLinks;

  return (
    <header className="sticky top-0 z-40 bg-[#0B0F17]/95 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Zone 1: Single text element wordmark with domain mark */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 shadow-sm">
            <GraduationCap className="w-5 h-5" />
          </div>
          <button
            onClick={() => onSelectTab('tests')}
            className="text-lg font-bold tracking-tight text-white hover:text-indigo-300 transition-colors cursor-pointer text-left"
          >
            Vantage Tester
          </button>
        </div>

        {/* Zone 2: Clean single-line text navigation links */}
        {currentUser && (
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = currentTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => onSelectTab(link.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-slate-800/90 text-indigo-400 border border-indigo-500/30'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/60'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{link.label}</span>
                </button>
              );
            })}
          </nav>
        )}

        {/* Zone 3: Profile Switcher & Role Persona */}
        <div className="flex items-center gap-3">
          {currentUser ? (
            <>
              {/* Quick Role Indicator */}
              <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-xs text-slate-300">
                <span
                  className={`w-2 h-2 rounded-full ${
                    isTeacher ? 'bg-indigo-400' : 'bg-emerald-400'
                  }`}
                />
                <span className="font-medium capitalize">{currentUser.role} Mode</span>
              </div>

              {/* User selector dropdown */}
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2.5 p-1.5 pr-3 rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-slate-800 text-left transition-colors cursor-pointer"
                >
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    referrerPolicy="no-referrer"
                    className="w-7 h-7 rounded-full object-cover bg-slate-800"
                  />
                  <div className="hidden lg:block text-left">
                    <p className="text-xs font-semibold text-slate-200 leading-tight truncate max-w-[120px]">
                      {currentUser.name}
                    </p>
                    <p className="text-[11px] text-slate-400 leading-tight">
                      {isTeacher ? 'Teacher' : currentUser.grade || 'Student'}
                    </p>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                </button>

                {userDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setUserDropdownOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-72 bg-[#0F172A] border border-slate-800 rounded-xl shadow-2xl p-2 z-50">
                      <div className="px-3 py-2 border-b border-slate-800/80">
                        <p className="text-xs font-semibold text-slate-300">Quick Profile Switcher</p>
                        <p className="text-[11px] text-slate-500">
                          Switch between Faculty and Students instantly
                        </p>
                      </div>

                      <div className="py-1">
                        <p className="px-3 py-1 text-[10px] uppercase font-bold tracking-wider text-slate-500">
                          Faculty / Staff
                        </p>
                        {users
                          .filter((u) => u.role === 'teacher')
                          .map((u) => (
                            <button
                              key={u.id}
                              onClick={() => {
                                switchUser(u.id);
                                setUserDropdownOpen(false);
                                onSelectTab('tests');
                              }}
                              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-colors cursor-pointer ${
                                u.id === currentUser.id
                                  ? 'bg-indigo-600/20 text-indigo-300 font-medium'
                                  : 'text-slate-300 hover:bg-slate-800/70'
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <img
                                  src={u.avatar}
                                  alt={u.name}
                                  referrerPolicy="no-referrer"
                                  className="w-6 h-6 rounded-full object-cover"
                                />
                                <div className="text-left">
                                  <p className="font-medium leading-none">{u.name}</p>
                                  <p className="text-[10px] text-slate-400 mt-0.5">{u.title || 'Teacher'}</p>
                                </div>
                              </div>
                              {u.id === currentUser.id && <Check className="w-3.5 h-3.5 text-indigo-400" />}
                            </button>
                          ))}

                        <p className="px-3 pt-3 pb-1 text-[10px] uppercase font-bold tracking-wider text-slate-500">
                          Students
                        </p>
                        {users
                          .filter((u) => u.role === 'student')
                          .map((u) => (
                            <button
                              key={u.id}
                              onClick={() => {
                                switchUser(u.id);
                                setUserDropdownOpen(false);
                                onSelectTab('tests');
                              }}
                              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-colors cursor-pointer ${
                                u.id === currentUser.id
                                  ? 'bg-emerald-600/20 text-emerald-300 font-medium'
                                  : 'text-slate-300 hover:bg-slate-800/70'
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <img
                                  src={u.avatar}
                                  alt={u.name}
                                  referrerPolicy="no-referrer"
                                  className="w-6 h-6 rounded-full object-cover"
                                />
                                <div className="text-left">
                                  <p className="font-medium leading-none">{u.name}</p>
                                  <p className="text-[10px] text-slate-400 mt-0.5">{u.grade || 'Student'}</p>
                                </div>
                              </div>
                              {u.id === currentUser.id && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                            </button>
                          ))}
                      </div>

                      {/* Log Out Button */}
                      <div className="pt-2 border-t border-slate-800/80 mt-1">
                        <button
                          onClick={() => {
                            logout();
                            setUserDropdownOpen(false);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-rose-400 hover:bg-rose-950/30 transition-colors cursor-pointer"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Log Out from Session</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </>
          ) : (
            <button
              onClick={onOpenLogin}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              <span>Log In</span>
            </button>
          )}
        </div>
      </div>

      {/* Mobile navigation tab strip */}
      {currentUser && (
        <div className="md:hidden flex border-t border-slate-800/80 px-2 py-1.5 overflow-x-auto gap-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = currentTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => onSelectTab(link.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg shrink-0 ${
                  isActive
                    ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                    : 'text-slate-400'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{link.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
