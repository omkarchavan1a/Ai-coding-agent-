import React, { useState } from 'react';
import { useIDE } from '../../context/IDEContext';
import { 
  SplitSquareVertical, 
  ArrowLeft, 
  GitPullRequest
} from 'lucide-react';
import { INITIAL_TARGET_REPO_FILES } from '../../data/targetRepoData';

export const DiffViewerPane: React.FC = () => {
  const {
    files,
    activeFilePath,
    setActiveFilePath,
    setViewMode,
    stageFile,
    stagedFiles
  } = useIDE();

  const [selectedPath, setSelectedPath] = useState(activeFilePath || 'app/controllers/note.controller.js');

  const originalFile = INITIAL_TARGET_REPO_FILES.find(f => f.path === selectedPath) || { content: '// Original file not found' };
  const currentFile = files.find(f => f.path === selectedPath) || { content: '// Current file not found' };

  const originalLines = originalFile.content.split('\n');
  const currentLines = currentFile.content.split('\n');

  return (
    <div className="h-full flex flex-col bg-[#0f0f12] text-xs select-none">
      {/* Diff Top Control Bar */}
      <div className="h-10 bg-[#0d0d0f] border-b border-[#1e1e24] flex items-center justify-between px-3">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setViewMode('editor')}
            className="p-1 rounded bg-[#16161b] hover:bg-[#202028] text-[#a1a1aa] hover:text-white flex items-center space-x-1 transition-all border border-[#22222a]"
            title="Return to Single Editor"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="text-[11px] font-medium">Editor</span>
          </button>

          <span className="text-[#3f3f46]">|</span>

          {/* File Selector */}
          <select
            value={selectedPath}
            onChange={(e) => {
              setSelectedPath(e.target.value);
              setActiveFilePath(e.target.value);
            }}
            className="bg-[#141418] border border-[#22222a] rounded px-2 py-0.5 text-xs text-[#ededee] font-mono focus:outline-none"
          >
            {files.map(f => (
              <option key={f.path} value={f.path}>
                {f.path} {f.isModified ? '(Modified)' : ''}
              </option>
            ))}
          </select>
        </div>

        {/* Diff Stats & Stage Action */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1.5 font-mono text-[10px]">
            <span className="text-[#34d399] bg-[#10b981]/10 px-1.5 py-0.2 rounded border border-[#10b981]/20">
              +184
            </span>
            <span className="text-[#fb7185] bg-[#f43f5e]/10 px-1.5 py-0.2 rounded border border-[#f43f5e]/20">
              -22
            </span>
          </div>

          <button
            onClick={() => stageFile(selectedPath)}
            className="px-2.5 py-1 bg-[#db2777] hover:bg-[#be185d] text-white rounded text-[11px] font-medium flex items-center space-x-1 transition-all"
          >
            <GitPullRequest className="w-3 h-3" />
            <span>{stagedFiles.includes(selectedPath) ? 'Staged' : 'Stage'}</span>
          </button>
        </div>
      </div>

      {/* Pane Titles Header */}
      <div className="grid grid-cols-2 bg-[#121215] border-b border-[#1e1e24] text-[11px] font-medium text-[#71717a]">
        <div className="px-4 py-1 border-r border-[#1e1e24] flex items-center justify-between">
          <span className="text-[#fb7185]">Original Base</span>
          <span className="font-mono text-[10px] text-[#52525b]">{originalLines.length} lines</span>
        </div>
        <div className="px-4 py-1 flex items-center justify-between">
          <span className="text-[#34d399]">Modified (4 Agents)</span>
          <span className="font-mono text-[10px] text-[#52525b]">{currentLines.length} lines</span>
        </div>
      </div>

      {/* Side-by-side Diff Content */}
      <div className="flex-1 overflow-auto grid grid-cols-2 divide-x divide-[#1e1e24] font-mono text-xs leading-5">
        {/* Left: Original Code */}
        <div className="bg-[#0f0f12] overflow-x-auto">
          {originalLines.map((line, idx) => {
            const isDifferent = currentLines[idx] !== line;
            return (
              <div
                key={idx}
                className={`flex ${
                  isDifferent ? 'bg-[#f43f5e]/10 text-[#fda4af]' : 'text-[#71717a]'
                }`}
              >
                <span className="w-10 text-right pr-2 text-[#52525b] select-none bg-[#0d0d0f] text-[10px]">
                  {idx + 1}
                </span>
                <span className="pl-3 whitespace-pre">{line || ' '}</span>
              </div>
            );
          })}
        </div>

        {/* Right: Modified Code */}
        <div className="bg-[#0f0f12] overflow-x-auto">
          {currentLines.map((line, idx) => {
            const isDifferent = originalLines[idx] !== line;
            return (
              <div
                key={idx}
                className={`flex ${
                  isDifferent ? 'bg-[#10b981]/10 text-[#6ee7b7] font-medium' : 'text-[#d4d4d8]'
                }`}
              >
                <span className="w-10 text-right pr-2 text-[#52525b] select-none bg-[#0d0d0f] text-[10px]">
                  {idx + 1}
                </span>
                <span className="pl-3 whitespace-pre">{line || ' '}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
