import React, { useState } from 'react';
import { RepoFile } from '../types';
import { INITIAL_TARGET_REPO_FILES, MODIFIED_TARGET_REPO_FILES } from '../data/targetRepoData';
import { FileCode, ArrowRight, CheckCircle2, Copy, Check } from 'lucide-react';

export const DiffViewerTab: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<string>('app/controllers/note.controller.js');
  const [copied, setCopied] = useState(false);

  const initialFile = INITIAL_TARGET_REPO_FILES.find((f) => f.path === selectedFile) || {
    path: selectedFile,
    content: '// File was created by agent',
    language: 'javascript',
  };

  const modifiedFile = MODIFIED_TARGET_REPO_FILES.find((f) => f.path === selectedFile) || initialFile;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(modifiedFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* File Selector Bar */}
      <div className="bg-[#21222D] border border-[#2A2C3A] rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 text-white shadow-sm">
        <div>
          <h2 className="text-sm font-bold text-white flex items-center space-x-2">
            <FileCode className="w-4 h-4 text-[#ACD1FD]" />
            <span>Codebase Diff Inspector</span>
          </h2>
          <p className="text-xs text-slate-300 mt-0.5">
            Compare target repository files before vs after AI agent modifications.
          </p>
        </div>

        {/* File Dropdown / Pills */}
        <div className="flex flex-wrap gap-2">
          {MODIFIED_TARGET_REPO_FILES.map((f) => (
            <button
              key={f.path}
              onClick={() => setSelectedFile(f.path)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-medium transition-all flex items-center space-x-2 ${
                selectedFile === f.path
                  ? 'bg-[#958CE8] text-white shadow-md font-bold'
                  : 'bg-[#2A2C3A] hover:bg-[#343748] text-slate-200 border border-slate-600/50'
              }`}
            >
              <span>{f.path}</span>
              {f.isModified && (
                <span className="w-2 h-2 rounded-full bg-[#ACD1FD] inline-block" title="Modified by Agent" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Code Viewer Panel: Before vs After */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ORIGINAL / BEFORE */}
        <div className="bg-[#21222D] border border-slate-700/60 rounded-2xl overflow-hidden shadow-md flex flex-col">
          <div className="bg-[#191A23] px-4 py-3 border-b border-slate-700/60 flex items-center justify-between">
            <span className="text-xs font-bold text-rose-300 uppercase tracking-wider flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
              <span>Original File (Before)</span>
            </span>
            <span className="text-[11px] font-mono text-slate-400 bg-[#2A2C3A] px-2 py-0.5 rounded-full">{selectedFile}</span>
          </div>
          <pre className="p-4 font-mono text-xs text-slate-300 overflow-x-auto max-h-[520px] bg-[#21222D] leading-relaxed">
            <code>{initialFile.content}</code>
          </pre>
        </div>

        {/* MODIFIED / AFTER */}
        <div className="bg-[#21222D] border-2 border-[#958CE8] rounded-2xl overflow-hidden shadow-md flex flex-col">
          <div className="bg-[#191A23] px-4 py-3 border-b border-slate-700/60 flex items-center justify-between">
            <span className="text-xs font-bold text-[#ACD1FD] uppercase tracking-wider flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ACD1FD] animate-pulse" />
              <span>Agent Modified File (After)</span>
            </span>
            <button
              onClick={handleCopyCode}
              className="text-[11px] text-[#ACD1FD] hover:text-white transition-colors flex items-center space-x-1.5 bg-[#2A2C3A] px-2.5 py-1 rounded-lg"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Code'}</span>
            </button>
          </div>
          <pre className="p-4 font-mono text-xs text-emerald-300 overflow-x-auto max-h-[520px] bg-[#21222D] leading-relaxed">
            <code>{modifiedFile.content}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};
