import React, { useState } from 'react';
import { useTests } from '../../context/TestContext';
import { ClassDocument } from '../../types';
import { DocumentUploadModal } from './DocumentUploadModal';
import {
  FolderOpen,
  Upload,
  Search,
  Filter,
  FileText,
  FileSpreadsheet,
  FileCode,
  FileCheck,
  ExternalLink,
  Download,
  Trash2,
  Pin,
  Eye,
  BookOpen,
  Calendar,
  User,
  X,
  Copy,
  Check,
  LayoutGrid,
  List,
} from 'lucide-react';

export const ClassDriveView: React.FC = () => {
  const { documents, currentUser, deleteDocument, tests } = useTests();

  const [search, setSearch] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<ClassDocument | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const isTeacher = currentUser?.role === 'teacher';

  const subjects = ['all', ...Array.from(new Set(documents.map((d) => d.subject)))];

  const filteredDocs = documents.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(search.toLowerCase()) ||
      (doc.description || '').toLowerCase().includes(search.toLowerCase()) ||
      (doc.topic || '').toLowerCase().includes(search.toLowerCase());
    const matchesSubject = subjectFilter === 'all' || doc.subject === subjectFilter;
    const matchesType = typeFilter === 'all' || doc.type === typeFilter;
    return matchesSearch && matchesSubject && matchesType;
  });

  const getDocTypeIcon = (type: ClassDocument['type']) => {
    switch (type) {
      case 'pdf':
        return <FileText className="w-5 h-5 text-rose-400" />;
      case 'sheet':
        return <FileSpreadsheet className="w-5 h-5 text-emerald-400" />;
      case 'slide':
        return <FileCheck className="w-5 h-5 text-amber-400" />;
      case 'note':
        return <FileCode className="w-5 h-5 text-indigo-400" />;
      default:
        return <FileText className="w-5 h-5 text-sky-400" />;
    }
  };

  const handleDownload = (doc: ClassDocument) => {
    if (doc.fileData && doc.fileName) {
      const a = document.createElement('a');
      a.href = doc.fileData;
      a.download = doc.fileName;
      a.click();
    } else if (doc.content) {
      const blob = new Blob([doc.content], { type: 'text/markdown;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${doc.title.replace(/\s+/g, '_')}.md`;
      a.click();
      URL.revokeObjectURL(url);
    } else if (doc.externalUrl) {
      window.open(doc.externalUrl, '_blank');
    }
  };

  const handleCopyContent = (doc: ClassDocument) => {
    if (doc.content) {
      navigator.clipboard.writeText(doc.content);
      setCopiedId(doc.id);
      setTimeout(() => setCopiedId(null), 1500);
    }
  };

  return (
    <div className="space-y-6 text-left pb-16">
      
      {/* Header Banner - Google Classroom Drive style */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
            <FolderOpen className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Class Drive & Document Repository
            </h1>
            <p className="text-xs text-slate-400">
              Curriculum reference sheets, study guides, and lecture materials shared by teachers
            </p>
          </div>
        </div>

        {/* Teacher Upload Action */}
        <div className="flex items-center gap-2">
          {isTeacher && (
            <button
              onClick={() => setUploadModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              <span>Add to Class Drive</span>
            </button>
          )}

          {/* View Mode Toggle */}
          <div className="flex items-center p-1 rounded-lg bg-slate-900 border border-slate-800">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded text-xs transition-colors cursor-pointer ${
                viewMode === 'grid' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded text-xs transition-colors cursor-pointer ${
                viewMode === 'list' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="p-4 rounded-xl bg-[#0D121F] border border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search documents, formula sheets, or topic units..."
            className="w-full pl-9 pr-3.5 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Subject Filter */}
          <div className="flex items-center gap-1 text-xs text-slate-400">
            <Filter className="w-3.5 h-3.5" />
            <select
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200 capitalize"
            >
              {subjects.map((sub) => (
                <option key={sub} value={sub}>
                  {sub === 'all' ? 'All Subjects' : sub}
                </option>
              ))}
            </select>
          </div>

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200"
          >
            <option value="all">All File Types</option>
            <option value="pdf">PDF Documents</option>
            <option value="doc">Word / Documents</option>
            <option value="sheet">Spreadsheets</option>
            <option value="slide">Presentations</option>
            <option value="note">Study Notes</option>
          </select>
        </div>
      </div>

      {/* Pinned Documents Section if any */}
      {filteredDocs.some((d) => d.isPinned) && (
        <div className="space-y-3">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-400 uppercase tracking-wider">
            <Pin className="w-3.5 h-3.5" />
            <span>Pinned Class Resources</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDocs
              .filter((d) => d.isPinned)
              .map((doc) => (
                <div
                  key={doc.id}
                  onClick={() => setPreviewDoc(doc)}
                  className="p-4 rounded-xl bg-slate-900/90 border border-indigo-500/30 hover:border-indigo-500/60 transition-all cursor-pointer group space-y-2.5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                        {getDocTypeIcon(doc.type)}
                      </div>
                      <div>
                        <span className="text-[10px] text-indigo-400 font-semibold block uppercase">
                          {doc.subject}
                        </span>
                        <h4 className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-1">
                          {doc.title}
                        </h4>
                      </div>
                    </div>
                    <Pin className="w-3.5 h-3.5 text-indigo-400 shrink-0 fill-current" />
                  </div>

                  <p className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed">
                    {doc.description || 'Reference document for class study.'}
                  </p>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-2 border-t border-slate-800/80">
                    <span>{doc.topic || 'General'}</span>
                    <span className="tabular-nums font-semibold">{doc.fileSize || '1.2 MB'}</span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Main Files Display */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDocs.map((doc) => {
            const linkedTest = tests.find((t) => t.id === doc.linkedTestId);

            return (
              <div
                key={doc.id}
                className="p-5 rounded-2xl bg-[#0D121F] border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-3 text-xs group"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                        {getDocTypeIcon(doc.type)}
                      </div>
                      <div>
                        <span className="text-[10px] font-semibold text-indigo-400 uppercase tracking-wider block">
                          {doc.subject}
                        </span>
                        <span className="text-[11px] text-slate-400 block">{doc.topic}</span>
                      </div>
                    </div>

                    {isTeacher && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm(`Remove "${doc.title}" from Drive?`)) {
                            deleteDocument(doc.id);
                          }
                        }}
                        className="text-slate-500 hover:text-rose-400 p-1 cursor-pointer transition-colors"
                        title="Delete Document"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <h3
                    onClick={() => setPreviewDoc(doc)}
                    className="font-bold text-white text-sm tracking-tight group-hover:text-indigo-300 transition-colors cursor-pointer line-clamp-2"
                  >
                    {doc.title}
                  </h3>

                  <p className="text-slate-300 text-xs line-clamp-2 leading-relaxed">
                    {doc.description || 'Instructional materials and study notes.'}
                  </p>

                  {linkedTest && (
                    <div className="p-1.5 rounded bg-indigo-950/30 border border-indigo-900/40 text-[10px] text-indigo-300 flex items-center gap-1">
                      <BookOpen className="w-3 h-3 shrink-0" />
                      <span className="truncate">Linked to: {linkedTest.title}</span>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <div className="text-[10px] text-slate-400">
                    <span>{doc.fileSize || 'Doc'}</span>
                    <span aria-hidden="true" className="mx-1">·</span>
                    <span>{new Date(doc.uploadedAt).toLocaleDateString()}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setPreviewDoc(doc)}
                      className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 cursor-pointer"
                      title="Open Document Preview"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDownload(doc)}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 text-[11px] font-semibold border border-indigo-500/40 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Get</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List / Table View */
        <div className="overflow-x-auto rounded-xl border border-slate-800 bg-[#0D121F]">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/80 text-slate-400 uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Document Title</th>
                <th className="py-3 px-4">Subject</th>
                <th className="py-3 px-4">Topic / Unit</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Size</th>
                <th className="py-3 px-4">Added By</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredDocs.map((doc) => (
                <tr
                  key={doc.id}
                  className="hover:bg-slate-900/60 transition-colors group cursor-pointer"
                  onClick={() => setPreviewDoc(doc)}
                >
                  <td className="py-3.5 px-4 font-semibold text-slate-200">
                    <div className="flex items-center gap-2">
                      {getDocTypeIcon(doc.type)}
                      <span className="group-hover:text-indigo-300 transition-colors">{doc.title}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-400">{doc.subject}</td>
                  <td className="py-3.5 px-4 text-slate-400">{doc.topic || 'General'}</td>
                  <td className="py-3.5 px-4 uppercase text-[10px] font-bold text-slate-400">
                    {doc.type}
                  </td>
                  <td className="py-3.5 px-4 text-slate-400 tabular-nums">{doc.fileSize || '—'}</td>
                  <td className="py-3.5 px-4 text-slate-400">{doc.uploadedBy}</td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => handleDownload(doc)}
                        className="p-1.5 rounded-lg bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600/30"
                        title="Download"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                      {isTeacher && (
                        <button
                          onClick={() => deleteDocument(doc.id)}
                          className="p-1.5 text-slate-500 hover:text-rose-400"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Document Preview Reader Modal */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-3xl bg-[#0D121F] border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8 my-6 text-left space-y-5 max-h-[90vh] flex flex-col">
            
            <button
              onClick={() => setPreviewDoc(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-200 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="border-b border-slate-800 pb-4 shrink-0">
              <div className="flex items-center gap-2 text-xs text-indigo-400 font-semibold mb-1">
                <span>{previewDoc.subject}</span>
                <span aria-hidden="true">·</span>
                <span>{previewDoc.topic || 'Reference Material'}</span>
                <span aria-hidden="true">·</span>
                <span className="uppercase">{previewDoc.type}</span>
              </div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                {previewDoc.title}
              </h2>
              <p className="text-xs text-slate-300 mt-1">
                {previewDoc.description || 'Instructional reference guide for school coursework.'}
              </p>
            </div>

            {/* Content Preview Stage */}
            <div className="flex-1 overflow-y-auto pr-2 space-y-4">
              {previewDoc.content ? (
                <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 font-mono whitespace-pre-wrap leading-relaxed">
                  {previewDoc.content}
                </div>
              ) : previewDoc.fileData ? (
                <div className="p-8 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center mx-auto">
                    {getDocTypeIcon(previewDoc.type)}
                  </div>
                  <p className="text-sm font-semibold text-white">
                    {previewDoc.fileName || previewDoc.title}
                  </p>
                  <p className="text-xs text-slate-400">
                    File uploaded to Vantage Classroom Drive ({previewDoc.fileSize || '1.4 MB'})
                  </p>
                  <button
                    onClick={() => handleDownload(previewDoc)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md shadow-indigo-600/30 transition-all cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download & Open Document</span>
                  </button>
                </div>
              ) : (
                <div className="p-8 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-3">
                  <ExternalLink className="w-8 h-8 text-indigo-400 mx-auto" />
                  <p className="text-xs text-slate-300">
                    External link to cloud document:
                  </p>
                  <a
                    href={previewDoc.externalUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-indigo-400 hover:text-indigo-300 underline font-semibold block truncate"
                  >
                    {previewDoc.externalUrl}
                  </a>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between shrink-0 text-xs text-slate-400">
              <span>Uploaded by {previewDoc.uploadedBy} on {new Date(previewDoc.uploadedAt).toLocaleDateString()}</span>
              <div className="flex items-center gap-2">
                {previewDoc.content && (
                  <button
                    onClick={() => handleCopyContent(previewDoc)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 cursor-pointer"
                  >
                    {copiedId === previewDoc.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Text</span>
                      </>
                    )}
                  </button>
                )}
                <button
                  onClick={() => handleDownload(previewDoc)}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upload Document Modal */}
      <DocumentUploadModal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
      />
    </div>
  );
};
