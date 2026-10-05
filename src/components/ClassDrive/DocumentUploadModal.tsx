import React, { useState } from 'react';
import { useTests } from '../../context/TestContext';
import { ClassDocument } from '../../types';
import {
  X,
  Upload,
  FileText,
  Link as LinkIcon,
  CheckCircle2,
  AlertCircle,
  FileCode,
  FileSpreadsheet,
  Presentation,
  FolderOpen,
} from 'lucide-react';

interface DocumentUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultSubject?: string;
}

export const DocumentUploadModal: React.FC<DocumentUploadModalProps> = ({
  isOpen,
  onClose,
  defaultSubject = 'Physics',
}) => {
  const { addDocument, tests } = useTests();

  const [mode, setMode] = useState<'upload' | 'write' | 'link'>('upload');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [subject, setSubject] = useState(defaultSubject);
  const [topic, setTopic] = useState('General Reference');
  const [docType, setDocType] = useState<ClassDocument['type']>('pdf');
  const [content, setContent] = useState('');
  const [externalUrl, setExternalUrl] = useState('');
  const [linkedTestId, setLinkedTestId] = useState('');
  const [isPinned, setIsPinned] = useState(false);

  // File upload state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileBase64, setFileBase64] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!title) {
      // Auto-populate title from file name without extension
      const nameWithoutExt = file.name.replace(/\.[^/.]+$/, '');
      setTitle(nameWithoutExt);
    }

    // Determine type
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (ext === 'pdf') setDocType('pdf');
    else if (ext === 'doc' || ext === 'docx') setDocType('doc');
    else if (ext === 'xls' || ext === 'xlsx' || ext === 'csv') setDocType('sheet');
    else if (ext === 'ppt' || ext === 'pptx') setDocType('slide');
    else setDocType('note');

    setSelectedFile(file);

    const reader = new FileReader();
    reader.onload = () => {
      setFileBase64(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please provide a document title.');
      return;
    }

    let calculatedSize = '1.2 MB';
    if (selectedFile) {
      calculatedSize =
        selectedFile.size > 1024 * 1024
          ? `${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB`
          : `${Math.round(selectedFile.size / 1024)} KB`;
    }

    addDocument({
      title: title.trim(),
      description: description.trim(),
      subject,
      topic: topic.trim() || 'Class Reference',
      type: docType,
      fileSize: calculatedSize,
      content: content.trim() || undefined,
      fileData: fileBase64 || undefined,
      fileName: selectedFile?.name || undefined,
      externalUrl: externalUrl.trim() || undefined,
      isPinned,
      linkedTestId: linkedTestId || undefined,
      uploadedBy: 'Teacher',
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#0D121F] border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8 my-6 text-left">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
            <Upload className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Class Drive: Add Document
            </h2>
            <p className="text-xs text-slate-400">
              Set reference sheets, study guides, and files for students in Google Classroom style
            </p>
          </div>
        </div>

        {/* Mode Selector Tabs */}
        <div className="grid grid-cols-3 p-1 rounded-xl bg-slate-900 border border-slate-800 mb-5">
          <button
            type="button"
            onClick={() => setMode('upload')}
            className={`py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
              mode === 'upload'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload File</span>
          </button>

          <button
            type="button"
            onClick={() => setMode('write')}
            className={`py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
              mode === 'write'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Write Study Note</span>
          </button>

          <button
            type="button"
            onClick={() => setMode('link')}
            className={`py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
              mode === 'link'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <LinkIcon className="w-3.5 h-3.5" />
            <span>Drive Link</span>
          </button>
        </div>

        {error && (
          <div className="p-3 mb-4 rounded-xl bg-red-950/60 border border-red-800/60 text-red-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* File Upload Drop Area */}
          {mode === 'upload' && (
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Select File (PDF, DOCX, Spreadsheets, Slides, or Images)
              </label>
              <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-700 hover:border-indigo-500 rounded-xl bg-slate-900/60 transition-colors cursor-pointer group">
                <FolderOpen className="w-8 h-8 text-indigo-400 group-hover:scale-110 transition-transform mb-2" />
                <span className="text-xs font-semibold text-slate-200">
                  {selectedFile ? selectedFile.name : 'Click or drag file to upload'}
                </span>
                <span className="text-[11px] text-slate-500 mt-1">
                  Supports up to 25MB standard documents
                </span>
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.md,image/*"
                />
              </label>
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Document Title <span className="text-indigo-400">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. AP Physics Formula Sheet & Constants Table"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:border-indigo-500"
              required
            />
          </div>

          {/* Subject & Topic Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Class Subject</label>
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
              <label className="block text-xs font-medium text-slate-300 mb-1">Class Topic / Unit</label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Unit 1: Kinematics"
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Instructions / Description for Students
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Permitted during tests. Review before the kinematics assessment."
              className="w-full px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:border-indigo-500"
            />
          </div>

          {/* Mode 2: Write Study Note Text */}
          {mode === 'write' && (
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Note Content (Markdown, formulas, & problem outlines)
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={6}
                placeholder="Write study guide, lecture notes, or key concepts..."
                className="w-full p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:border-indigo-500 font-mono leading-relaxed"
              />
            </div>
          )}

          {/* Mode 3: External Drive URL */}
          {mode === 'link' && (
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Google Drive or Document Web URL
              </label>
              <input
                type="url"
                value={externalUrl}
                onChange={(e) => setExternalUrl(e.target.value)}
                placeholder="https://drive.google.com/file/d/..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:border-indigo-500"
              />
            </div>
          )}

          {/* Options: Link to an assessment & Pin to Stream */}
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-300 font-medium">Link to a Test (Optional):</span>
              <select
                value={linkedTestId}
                onChange={(e) => setLinkedTestId(e.target.value)}
                className="px-2.5 py-1 rounded bg-slate-950 border border-slate-800 text-xs text-slate-200"
              >
                <option value="">None (General Drive)</option>
                {tests.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.title}
                  </option>
                ))}
              </select>
            </div>

            <label className="flex items-center gap-2 cursor-pointer pt-1 text-slate-300">
              <input
                type="checkbox"
                checked={isPinned}
                onChange={(e) => setIsPinned(e.target.checked)}
                className="rounded text-indigo-600 focus:ring-indigo-500 bg-slate-950 border-slate-700"
              />
              <span>Pin to Class Stream header so students see it immediately</span>
            </label>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              <span>Add to Class Drive</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
