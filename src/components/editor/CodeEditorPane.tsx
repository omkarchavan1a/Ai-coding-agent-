import React, { useState } from 'react';
import { useIDE } from '../../context/IDEContext';
import { 
  FileCode, 
  FileJson, 
  FileText, 
  X, 
  Copy, 
  Check, 
  Sparkles, 
  Bot, 
  ChevronRight, 
  SplitSquareVertical
} from 'lucide-react';

export const CodeEditorPane: React.FC = () => {
  const {
    files,
    activeFilePath,
    activeFile,
    openTabs,
    setActiveFilePath,
    closeTab,
    updateFileContent,
    setViewMode,
    stagedFiles,
    unstagedFiles
  } = useIDE();

  const [copied, setCopied] = useState(false);
  const [showInlineSuggestion, setShowInlineSuggestion] = useState(true);

  if (!activeFile) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-[#0d0d0f] text-[#52525b] space-y-3 select-none">
        <Bot className="w-10 h-10 text-[#818cf8]/30 animate-pulse" />
        <p className="text-xs font-medium text-[#71717a]">Select a file from the explorer or trigger 4 Agents (⌘K)</p>
      </div>
    );
  }

  const lines = activeFile.content.split('\n');

  const handleCopy = () => {
    navigator.clipboard.writeText(activeFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getTabIcon = (path: string) => {
    if (path.endsWith('.json')) return <FileJson className="w-3.5 h-3.5 text-[#fbbf24]" />;
    if (path.endsWith('.md')) return <FileText className="w-3.5 h-3.5 text-[#38bdf8]" />;
    return <FileCode className="w-3.5 h-3.5 text-[#34d399]" />;
  };

  const isStaged = stagedFiles.includes(activeFile.path);
  const isUnstaged = unstagedFiles.includes(activeFile.path);
  const isModified = activeFile.isModified || isStaged || isUnstaged;

  return (
    <div className="h-full flex flex-col bg-[#0f0f12] text-xs select-none">
      {/* Top Tabs Bar */}
      <div className="h-9 bg-[#0d0d0f] border-b border-[#1e1e24] flex items-center justify-between px-1 overflow-x-auto no-scrollbar">
        <div className="flex items-center space-x-1">
          {openTabs.map(tabPath => {
            const isActive = tabPath === activeFilePath;
            const fileName = tabPath.split('/').pop() || tabPath;

            return (
              <div
                key={tabPath}
                onClick={() => setActiveFilePath(tabPath)}
                className={`group h-7 px-2.5 rounded-t flex items-center space-x-2 cursor-pointer text-xs transition-all ${
                  isActive
                    ? 'bg-[#0f0f12] border-t border-[#818cf8] text-[#ededee] font-medium'
                    : 'bg-transparent text-[#71717a] hover:text-[#d4d4d8] hover:bg-[#141418]'
                }`}
              >
                {getTabIcon(tabPath)}
                <span className="truncate max-w-[140px] font-mono text-[11px]">{fileName}</span>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    closeTab(tabPath);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-[#202028] text-[#71717a] hover:text-white transition-opacity"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Tab Actions */}
        <div className="flex items-center space-x-1 pr-2">
          <button
            onClick={() => setViewMode('diff')}
            className="px-2 py-0.5 rounded bg-[#16161b] hover:bg-[#202028] border border-[#22222a] text-[#a1a1aa] hover:text-white text-[11px] font-medium flex items-center space-x-1 transition-all"
            title="Inspect Side-by-Side Diff"
          >
            <SplitSquareVertical className="w-3 h-3 text-[#818cf8]" />
            <span className="hidden md:inline">Diff</span>
          </button>
        </div>
      </div>

      {/* Breadcrumb Path & File Actions */}
      <div className="h-7 px-3 bg-[#0d0d0f] border-b border-[#18181f] flex items-center justify-between text-[11px] text-[#71717a] font-mono">
        <div className="flex items-center space-x-1 truncate">
          <span>node-easy-notes-app</span>
          {activeFile.path.split('/').map((segment, idx) => (
            <React.Fragment key={idx}>
              <ChevronRight className="w-3 h-3 text-[#52525b]" />
              <span className={idx === activeFile.path.split('/').length - 1 ? 'text-[#ededee] font-medium' : ''}>
                {segment}
              </span>
            </React.Fragment>
          ))}
          {isModified && (
            <span className="ml-2 text-[9px] px-1 py-0.2 rounded bg-[#f59e0b]/10 text-[#fbbf24] font-mono">
              M
            </span>
          )}
        </div>

        <div className="flex items-center space-x-2 text-[#71717a]">
          <button
            onClick={handleCopy}
            className="hover:text-white flex items-center space-x-1 transition-colors"
            title="Copy File Content"
          >
            {copied ? <Check className="w-3 h-3 text-[#34d399]" /> : <Copy className="w-3 h-3" />}
            <span className="text-[10px]">{copied ? 'Copied' : 'Copy'}</span>
          </button>
          <span>•</span>
          <span>{lines.length} lines</span>
          <span>•</span>
          <span>{activeFile.language}</span>
        </div>
      </div>

      {/* Inline AI Status Bar */}
      {showInlineSuggestion && (
        <div className="bg-[#131317] border-b border-[#1e1e24] px-3 py-1 flex items-center justify-between text-[11px]">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-3 h-3 text-[#818cf8]" />
            <span className="text-[#a1a1aa]">
              <strong className="text-[#ededee] font-medium">4 Agents:</strong> Coder, Reviewer, Bug Hunter & Git Manager watching.
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('diff')}
              className="px-2 py-0.2 rounded bg-[#1c1c24] hover:bg-[#252532] border border-[#282834] text-[#d4d4d8] text-[10px] transition-all"
            >
              View Diff
            </button>
            <button
              onClick={() => setShowInlineSuggestion(false)}
              className="text-[#52525b] hover:text-[#a1a1aa]"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      {/* Code Text Area with Line Numbers */}
      <div className="flex-1 overflow-auto flex font-mono text-xs leading-relaxed bg-[#0f0f12]">
        {/* Line Numbers Column */}
        <div className="py-3 px-3 bg-[#0d0d0f] border-r border-[#18181f] text-right text-[#52525b] select-none font-mono text-[11px] min-w-[48px]">
          {lines.map((_, i) => (
            <div key={i} className="h-5 leading-5">
              {i + 1}
            </div>
          ))}
        </div>

        {/* Code Content Container */}
        <div className="flex-1 py-3 px-4 relative overflow-x-auto text-[#ededee]">
          <textarea
            value={activeFile.content}
            onChange={(e) => updateFileContent(activeFile.path, e.target.value)}
            spellCheck={false}
            className="w-full h-full min-h-[500px] bg-transparent text-[#ededee] font-mono text-xs leading-5 resize-none focus:outline-none selection:bg-[#6366f1]/30 whitespace-pre"
          />
        </div>
      </div>
    </div>
  );
};
