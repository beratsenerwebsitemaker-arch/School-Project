import React, { useState } from 'react';
import { useTests } from '../../context/TestContext';
import { ClassAnnouncement, Test, ClassDocument } from '../../types';
import {
  Megaphone,
  Send,
  Calendar,
  Clock,
  Play,
  FileText,
  Paperclip,
  CheckCircle2,
  Trash2,
  AlertCircle,
  FolderOpen,
  ArrowRight,
  BookOpen,
} from 'lucide-react';

interface ClassStreamViewProps {
  onGoToClasswork: () => void;
  onGoToDrive: () => void;
  onStartTest: (test: Test) => void;
}

export const ClassStreamView: React.FC<ClassStreamViewProps> = ({
  onGoToClasswork,
  onGoToDrive,
  onStartTest,
}) => {
  const { announcements, tests, documents, currentUser, addAnnouncement, deleteAnnouncement } =
    useTests();

  const [announcementText, setAnnouncementText] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('Physics');
  const [attachedDocId, setAttachedDocId] = useState('');
  const [attachedTestId, setAttachedTestId] = useState('');
  const [isPosting, setIsPosting] = useState(false);

  const isTeacher = currentUser?.role === 'teacher';

  const upcomingTests = tests
    .filter((t) => t.status === 'published' && t.deadline)
    .sort((a, b) => new Date(a.deadline!).getTime() - new Date(b.deadline!).getTime());

  const handlePostAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!announcementText.trim()) return;

    addAnnouncement({
      title: `${selectedSubject} Classroom Update`,
      content: announcementText.trim(),
      subject: selectedSubject,
      attachedDocIds: attachedDocId ? [attachedDocId] : undefined,
      attachedTestId: attachedTestId || undefined,
      authorName: currentUser?.name || 'Faculty Staff',
      authorRole: currentUser?.title || 'Teacher',
      authorAvatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    });

    setAnnouncementText('');
    setAttachedDocId('');
    setAttachedTestId('');
    setIsPosting(false);
  };

  return (
    <div className="space-y-6 text-left pb-16">
      
      {/* Google Classroom Style Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#172033] via-[#1E293B] to-[#121B2A] border border-slate-800 p-6 sm:p-10 shadow-2xl">
        <div className="absolute right-0 bottom-0 w-96 h-96 bg-indigo-600/10 blur-[100px] pointer-events-none rounded-full" />
        
        <div className="relative z-10 flex flex-wrap items-end justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400">
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/30">
                Vantage Classroom
              </span>
              <span>Academic Period 2026</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              AP Science & Humanities Academy
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Standardized testing, classwork deadlines, and Class Drive reference documents repository.
            </p>
          </div>

          {/* Class Code & Teacher badge */}
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-right">
              <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                Class Code
              </p>
              <p className="text-sm font-mono font-bold text-indigo-300 mt-0.5">
                vtg-8842
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Classroom Split: Left Upcoming Deadlines + Right Stream Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left Column: Upcoming Deadlines Card (Classic Google Classroom UX) */}
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-[#0D121F] border border-slate-800 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
              <h3 className="font-bold text-white uppercase tracking-wider text-[11px]">
                Upcoming Tests & Work
              </h3>
              <Calendar className="w-4 h-4 text-indigo-400" />
            </div>

            {upcomingTests.length > 0 ? (
              <div className="space-y-3">
                {upcomingTests.slice(0, 3).map((test) => {
                  const d = new Date(test.deadline!);
                  const isPast = new Date() > d;

                  return (
                    <div key={test.id} className="space-y-1">
                      <p className="font-semibold text-slate-200 line-clamp-1">
                        {test.title}
                      </p>
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                        <Clock className="w-3 h-3 text-slate-500" />
                        <span className={isPast ? 'text-rose-400 font-semibold' : 'text-slate-300'}>
                          {isPast ? 'Expired: ' : 'Due: '}
                          {d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                    </div>
                  );
                })}

                <button
                  onClick={onGoToClasswork}
                  className="w-full pt-2 text-center text-indigo-400 hover:text-indigo-300 font-semibold text-[11px] cursor-pointer block border-t border-slate-800/80"
                >
                  View All Classwork →
                </button>
              </div>
            ) : (
              <p className="text-slate-400 italic">No upcoming test deadlines.</p>
            )}
          </div>

          {/* Quick Drive Shortcuts */}
          <div className="p-5 rounded-2xl bg-[#0D121F] border border-slate-800 space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white uppercase tracking-wider text-[11px]">
                Class Drive Resources
              </span>
              <FolderOpen className="w-4 h-4 text-indigo-400" />
            </div>
            <p className="text-slate-400 text-[11px]">
              Access {documents.length} formula sheets, study guides, and lecture slides.
            </p>
            <button
              onClick={onGoToDrive}
              className="w-full py-2 rounded-xl bg-slate-900 hover:bg-slate-850 text-indigo-300 font-semibold border border-slate-800 transition-colors cursor-pointer text-center block"
            >
              Open Class Drive
            </button>
          </div>
        </div>

        {/* Right Column: Classroom Stream Posts & Announcements */}
        <div className="lg:col-span-3 space-y-5">
          
          {/* Announce to Class Bar */}
          {isTeacher ? (
            <div className="p-5 rounded-2xl bg-[#0D121F] border border-slate-800 space-y-3">
              {!isPosting ? (
                <div
                  onClick={() => setIsPosting(true)}
                  className="flex items-center gap-3 p-3 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 cursor-pointer text-xs text-slate-400 transition-colors"
                >
                  <img
                    src={currentUser?.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100'}
                    alt={currentUser?.name}
                    className="w-7 h-7 rounded-full object-cover"
                  />
                  <span>Announce something to your class or attach Drive documents...</span>
                </div>
              ) : (
                <form onSubmit={handlePostAnnouncement} className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-300">Post for:</span>
                    <select
                      value={selectedSubject}
                      onChange={(e) => setSelectedSubject(e.target.value)}
                      className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-xs text-slate-200"
                    >
                      <option value="Physics">Physics Class</option>
                      <option value="World History">World History Class</option>
                      <option value="Computer Science">Computer Science Class</option>
                      <option value="Mathematics">Mathematics Class</option>
                    </select>
                  </div>

                  <textarea
                    value={announcementText}
                    onChange={(e) => setAnnouncementText(e.target.value)}
                    rows={3}
                    placeholder="Type an announcement, instructions, or exam reminder..."
                    className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:border-indigo-500 leading-relaxed"
                    required
                  />

                  {/* Attachment selectors */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">
                        Attach Drive Document:
                      </label>
                      <select
                        value={attachedDocId}
                        onChange={(e) => setAttachedDocId(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200"
                      >
                        <option value="">None</option>
                        {documents.map((d) => (
                          <option key={d.id} value={d.id}>
                            {d.title} ({d.subject})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">
                        Attach Test / Quiz:
                      </label>
                      <select
                        value={attachedTestId}
                        onChange={(e) => setAttachedTestId(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200"
                      >
                        <option value="">None</option>
                        {tests.map((t) => (
                          <option key={t.id} value={t.id}>
                            {t.title}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                    <button
                      type="button"
                      onClick={() => setIsPosting(false)}
                      className="px-3.5 py-1.5 text-xs text-slate-400 hover:text-slate-200 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all shadow-md shadow-indigo-600/30 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Post Announcement</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-[#0D121F] border border-slate-800 text-xs text-slate-400 flex items-center gap-2">
              <Megaphone className="w-4 h-4 text-indigo-400 shrink-0" />
              <span>
                Announcements from instructors and department chairs appear in your stream.
              </span>
            </div>
          )}

          {/* Announcements Feed */}
          <div className="space-y-4">
            {announcements.map((ann) => {
              const attachedDoc = documents.find((d) => ann.attachedDocIds?.includes(d.id));
              const attachedTest = tests.find((t) => t.id === ann.attachedTestId);

              return (
                <div
                  key={ann.id}
                  className="p-6 rounded-2xl bg-[#0D121F] border border-slate-800 space-y-4 text-xs"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={ann.authorAvatar}
                        alt={ann.authorName}
                        referrerPolicy="no-referrer"
                        className="w-9 h-9 rounded-full object-cover bg-slate-800"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-200 text-sm">{ann.authorName}</span>
                          <span className="text-[10px] text-slate-500">·</span>
                          <span className="text-[10px] text-slate-400">
                            {new Date(ann.createdAt).toLocaleDateString(undefined, {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                        <span className="text-[11px] text-indigo-400 font-medium">
                          {ann.authorRole} · {ann.subject}
                        </span>
                      </div>
                    </div>

                    {isTeacher && (
                      <button
                        onClick={() => deleteAnnouncement(ann.id)}
                        className="text-slate-500 hover:text-rose-400 p-1 cursor-pointer transition-colors"
                        title="Delete announcement"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <p className="text-slate-200 text-sm leading-relaxed whitespace-pre-wrap">
                    {ann.content}
                  </p>

                  {/* Attached Resources */}
                  {(attachedDoc || attachedTest) && (
                    <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {attachedDoc && (
                        <div
                          onClick={onGoToDrive}
                          className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-indigo-500/50 flex items-center justify-between transition-colors cursor-pointer group"
                        >
                          <div className="flex items-center gap-2.5 truncate">
                            <FileText className="w-4 h-4 text-indigo-400 shrink-0" />
                            <div className="truncate">
                              <p className="font-semibold text-slate-200 group-hover:text-indigo-300 truncate">
                                {attachedDoc.title}
                              </p>
                              <p className="text-[10px] text-slate-400">Class Drive Document</p>
                            </div>
                          </div>
                          <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-indigo-400 shrink-0 ml-2" />
                        </div>
                      )}

                      {attachedTest && (
                        <div
                          onClick={() => onStartTest(attachedTest)}
                          className="p-3 rounded-xl bg-indigo-950/30 border border-indigo-800/40 hover:border-indigo-500/60 flex items-center justify-between transition-colors cursor-pointer group"
                        >
                          <div className="flex items-center gap-2.5 truncate">
                            <BookOpen className="w-4 h-4 text-indigo-400 shrink-0" />
                            <div className="truncate">
                              <p className="font-semibold text-white group-hover:text-indigo-300 truncate">
                                {attachedTest.title}
                              </p>
                              <p className="text-[10px] text-indigo-300">
                                {attachedTest.durationMinutes} mins · Start Test
                              </p>
                            </div>
                          </div>
                          <Play className="w-3.5 h-3.5 text-indigo-400 fill-current shrink-0 ml-2" />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
