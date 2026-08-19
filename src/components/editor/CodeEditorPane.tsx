import React, { useState, useRef } from 'react';
import { useIDE } from '../../context/IDEContext';
import { 
  FileCode, 
  FileJson, 
  FileText, 
  X, 
  XCircle,
  Copy, 
  Check, 
  Sparkles, 
  Bot, 
  ChevronRight, 
  SplitSquareVertical,
  Trash2,
  Edit3,
  Download,
  RotateCcw,
  MoreHorizontal,
  FolderPlus,
  FilePlus,
  Upload,
  Plus
} from 'lucide-react';
import { FileContextMenu, ContextMenuPosition } from '../common/FileContextMenu';
import { FileOperationModal, FileModalType } from '../modals/FileOperationModal';

export const CodeEditorPane: React.FC = () => {
  const {
    files,
    activeFilePath,
    activeFile,
    openTabs,
    setActiveFilePath,
    closeTab,
    closeAllTabs,
    closeOtherTabs,
    closeSavedTabs,
    updateFileContent,
    deleteFile,
    renameFile,
    duplicateFile,
    revertFile,
    downloadSingleFile,
    createNewFile,
    setViewMode,
    stagedFiles,
    unstagedFiles,
    openNewProjectModal,
    openImportProjectModal,
    setIsCommandPaletteOpen,
    projectName
  } = useIDE();

  const [copied, setCopied] = useState(false);
  const [showInlineSuggestion, setShowInlineSuggestion] = useState(true);
  const [fileMenuOpen, setFileMenuOpen] = useState(false);
  const fileMenuRef = useRef<HTMLDivElement>(null);

  // Context Menu State
  const [contextMenu, setContextMenu] = useState<{
    isOpen: boolean;
    position: ContextMenuPosition;
    targetPath: string;
    isTab: boolean;
    isModified: boolean;
  }>({
    isOpen: false,
    position: { x: 0, y: 0 },
    targetPath: '',
    isTab: true,
    isModified: false
  });

  // Modal State for Rename / Delete / Duplicate
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    type: FileModalType;
    targetPath: string;
    isFolder: boolean;
  }>({
    isOpen: false,
    type: null,
    targetPath: '',
    isFolder: false
  });

  const handleCopy = () => {
    if (!activeFile) return;
    navigator.clipboard.writeText(activeFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getTabIcon = (path: string) => {
    if (path.endsWith('.json')) return <FileJson className="w-3.5 h-3.5 text-[#fbbf24]" />;
    if (path.endsWith('.md')) return <FileText className="w-3.5 h-3.5 text-[#38bdf8]" />;
    if (path.endsWith('.ts') || path.endsWith('.tsx')) return <FileCode className="w-3.5 h-3.5 text-[#60a5fa]" />;
    if (path.endsWith('.py')) return <FileCode className="w-3.5 h-3.5 text-[#f59e0b]" />;
    return <FileCode className="w-3.5 h-3.5 text-[#34d399]" />;
  };

  const handleTabContextMenu = (e: React.MouseEvent, tabPath: string) => {
    e.preventDefault();
    e.stopPropagation();
    const file = files.find(f => f.path === tabPath);
    const isMod = !!(file?.isModified || stagedFiles.includes(tabPath) || unstagedFiles.includes(tabPath));

    setContextMenu({
      isOpen: true,
      position: { x: e.clientX, y: e.clientY },
      targetPath: tabPath,
      isTab: true,
      isModified: isMod
    });
  };

  // If no tabs are open or no active file
  if (!activeFile || openTabs.length === 0) {
    return (
      <div className="h-full flex flex-col bg-[#0d0d0f] text-xs select-none">
        {/* Top Empty Tabs Bar */}
        <div className="h-9 bg-[#0d0d0f] border-b border-[#1e1e24] flex items-center justify-between px-3 text-[#71717a]">
          <span className="text-[11px] font-medium text-[#52525b]">No tabs open</span>
          <button
            onClick={() => {
              if (files.length > 0) {
                setActiveFilePath(files[0].path);
                useIDE();
              } else {
                setModalState({ isOpen: true, type: 'new-file', targetPath: '', isFolder: false });
              }
            }}
            className="px-2 py-0.5 rounded bg-[#16161b] hover:bg-[#202028] border border-[#22222a] text-[#ededee] text-[11px] font-medium flex items-center space-x-1 transition-colors"
          >
            <Plus className="w-3 h-3 text-[#818cf8]" />
            <span>Open File</span>
          </button>
        </div>

        {/* Empty Workspace Hero */}
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-5">
          <div className="w-12 h-12 rounded-2xl bg-[#14141c] border border-[#242434] flex items-center justify-center shadow-lg">
            <Bot className="w-6 h-6 text-[#818cf8]" />
          </div>

          <div className="space-y-1.5 max-w-sm">
            <h3 className="text-sm font-semibold text-white">All temporary files and tabs closed</h3>
            <p className="text-xs text-[#71717a]">
              Select a file from the explorer sidebar, start a new file, or ask the 4 autonomous AI agents.
            </p>
          </div>

          {/* Quick Actions Matrix */}
          <div className="grid grid-cols-2 gap-2.5 w-full max-w-md">
            <button
              onClick={() => {
                if (files.length > 0) {
                  setActiveFilePath(files[0].path);
                }
              }}
              className="p-3 rounded-xl bg-[#131318] hover:bg-[#1b1b22] border border-[#22222d] hover:border-[#353548] text-left transition-all group"
            >
              <FileCode className="w-4 h-4 text-[#34d399] mb-1.5 group-hover:scale-110 transition-transform" />
              <div className="font-medium text-white text-[11px]">Open Primary File</div>
              <div className="text-[10px] text-[#71717a] truncate">
                {files[0]?.path || 'No files available'}
              </div>
            </button>

            <button
              onClick={() => setModalState({ isOpen: true, type: 'new-file', targetPath: '', isFolder: false })}
              className="p-3 rounded-xl bg-[#131318] hover:bg-[#1b1b22] border border-[#22222d] hover:border-[#353548] text-left transition-all group"
            >
              <FilePlus className="w-4 h-4 text-[#818cf8] mb-1.5 group-hover:scale-110 transition-transform" />
              <div className="font-medium text-white text-[11px]">Create New File</div>
              <div className="text-[10px] text-[#71717a]">JS, TS, Python, JSON or Markdown</div>
            </button>

            <button
              onClick={() => setIsCommandPaletteOpen(true)}
              className="p-3 rounded-xl bg-[#131318] hover:bg-[#1b1b22] border border-[#22222d] hover:border-[#353548] text-left transition-all group"
            >
              <Sparkles className="w-4 h-4 text-[#fbbf24] mb-1.5 group-hover:scale-110 transition-transform" />
              <div className="font-medium text-white text-[11px]">Run 4 Agents (⌘K)</div>
              <div className="text-[10px] text-[#71717a]">Coder, Reviewer, BugHunter, Git</div>
            </button>

            <button
              onClick={openNewProjectModal}
              className="p-3 rounded-xl bg-[#131318] hover:bg-[#1b1b22] border border-[#22222d] hover:border-[#353548] text-left transition-all group"
            >
              <FolderPlus className="w-4 h-4 text-[#f472b6] mb-1.5 group-hover:scale-110 transition-transform" />
              <div className="font-medium text-white text-[11px]">New Project Starter</div>
              <div className="text-[10px] text-[#71717a]">Node, React, Python templates</div>
            </button>
          </div>
        </div>

        {/* Modals */}
        <FileOperationModal
          isOpen={modalState.isOpen}
          type={modalState.type}
          targetPath={modalState.targetPath}
          isFolder={modalState.isFolder}
          onClose={() => setModalState(prev => ({ ...prev, isOpen: false }))}
        />
      </div>
    );
  }

  const lines = activeFile.content.split('\n');
  const isStaged = stagedFiles.includes(activeFile.path);
  const isUnstaged = unstagedFiles.includes(activeFile.path);
  const isModified = activeFile.isModified || isStaged || isUnstaged;

  return (
    <div className="h-full flex flex-col bg-[#0f0f12] text-xs select-none">
      {/* Top Tabs Bar */}
      <div className="h-9 bg-[#0d0d0f] border-b border-[#1e1e24] flex items-center justify-between px-1 overflow-x-auto no-scrollbar">
        {/* Open Tabs List */}
        <div className="flex items-center space-x-1">
          {openTabs.map(tabPath => {
            const isActive = tabPath === activeFilePath;
            const fileName = tabPath.split('/').pop() || tabPath;
            const tabFile = files.find(f => f.path === tabPath);
            const tabModified = tabFile?.isModified || stagedFiles.includes(tabPath) || unstagedFiles.includes(tabPath);

            return (
              <div
                key={tabPath}
                onClick={() => setActiveFilePath(tabPath)}
                onContextMenu={(e) => handleTabContextMenu(e, tabPath)}
                className={`group h-7 px-2.5 rounded-t flex items-center space-x-2 cursor-pointer text-xs transition-all relative ${
                  isActive
                    ? 'bg-[#0f0f12] border-t border-[#818cf8] text-[#ededee] font-medium'
                    : 'bg-transparent text-[#71717a] hover:text-[#d4d4d8] hover:bg-[#141418]'
                }`}
                title={`${tabPath} (Right-click for options)`}
              >
                {getTabIcon(tabPath)}
                <span className="truncate max-w-[130px] font-mono text-[11px]">{fileName}</span>
                
                {tabModified && !isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#f59e0b]" title="Unsaved changes" />
                )}

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    closeTab(tabPath);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-[#202028] text-[#71717a] hover:text-white transition-opacity"
                  title="Close Tab"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Tab Toolbar Actions */}
        <div className="flex items-center space-x-1 pr-1.5 flex-shrink-0">
          {/* Close All Tabs ("Remove All Open Files") */}
          <button
            onClick={closeAllTabs}
            className="px-2 py-0.5 rounded bg-[#16161b] hover:bg-[#f43f5e]/15 border border-[#22222a] hover:border-[#f43f5e]/30 text-[#71717a] hover:text-[#fb7185] text-[11px] font-medium flex items-center space-x-1 transition-all"
            title="Remove / Close All Open Tabs"
          >
            <XCircle className="w-3 h-3" />
            <span className="hidden sm:inline">Close All</span>
          </button>

          {/* Close Others */}
          {openTabs.length > 1 && (
            <button
              onClick={() => closeOtherTabs(activeFilePath)}
              className="px-2 py-0.5 rounded bg-[#16161b] hover:bg-[#202028] border border-[#22222a] text-[#71717a] hover:text-white text-[11px] font-medium hidden md:flex items-center space-x-1 transition-all"
              title="Close Other Tabs"
            >
              <span>Close Others</span>
            </button>
          )}

          {/* Diff View Toggle */}
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
          <span className="text-[#a1a1aa] font-semibold uppercase">{projectName}</span>
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

        {/* File Actions Bar */}
        <div className="flex items-center space-x-2 text-[#71717a]">
          {/* Revert Changes */}
          {isModified && (
            <button
              onClick={() => revertFile(activeFile.path)}
              className="hover:text-[#fbbf24] flex items-center space-x-1 transition-colors"
              title="Revert file to original version"
            >
              <RotateCcw className="w-3 h-3 text-[#fbbf24]" />
              <span className="text-[10px] hidden sm:inline">Revert</span>
            </button>
          )}

          {/* Download File */}
          <button
            onClick={() => downloadSingleFile(activeFile.path)}
            className="hover:text-white flex items-center space-x-1 transition-colors"
            title="Download file"
          >
            <Download className="w-3 h-3" />
            <span className="text-[10px] hidden sm:inline">Download</span>
          </button>

          {/* Duplicate File */}
          <button
            onClick={() => duplicateFile(activeFile.path)}
            className="hover:text-white flex items-center space-x-1 transition-colors"
            title="Duplicate this file"
          >
            <Copy className="w-3 h-3" />
            <span className="text-[10px] hidden sm:inline">Duplicate</span>
          </button>

          {/* Rename File */}
          <button
            onClick={() => setModalState({ isOpen: true, type: 'rename', targetPath: activeFile.path, isFolder: false })}
            className="hover:text-white flex items-center space-x-1 transition-colors"
            title="Rename file"
          >
            <Edit3 className="w-3 h-3" />
            <span className="text-[10px] hidden sm:inline">Rename</span>
          </button>

          {/* Delete File */}
          <button
            onClick={() => setModalState({ isOpen: true, type: 'delete', targetPath: activeFile.path, isFolder: false })}
            className="hover:text-[#fb7185] flex items-center space-x-1 transition-colors"
            title="Delete file"
          >
            <Trash2 className="w-3 h-3 text-[#fb7185]" />
            <span className="text-[10px] hidden sm:inline text-[#fb7185]">Delete</span>
          </button>

          <span>•</span>

          {/* Copy Content */}
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
          <span className="uppercase">{activeFile.language}</span>
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

      {/* Right Click Context Menu */}
      <FileContextMenu
        isOpen={contextMenu.isOpen}
        position={contextMenu.position}
        targetPath={contextMenu.targetPath}
        isTab={contextMenu.isTab}
        isModified={contextMenu.isModified}
        onClose={() => setContextMenu(prev => ({ ...prev, isOpen: false }))}
        onOpenInEditor={(path) => setActiveFilePath(path)}
        onOpenInDiff={() => setViewMode('diff')}
        onCloseTab={(path) => closeTab(path)}
        onCloseOtherTabs={(path) => closeOtherTabs(path)}
        onCloseAllTabs={closeAllTabs}
        onCloseSavedTabs={closeSavedTabs}
        onRename={(path, isFolder) => setModalState({ isOpen: true, type: 'rename', targetPath: path, isFolder })}
        onDuplicate={(path) => duplicateFile(path)}
        onDelete={(path, isFolder) => setModalState({ isOpen: true, type: 'delete', targetPath: path, isFolder })}
        onRevert={(path) => revertFile(path)}
        onDownload={(path) => downloadSingleFile(path)}
      />

      {/* File Action Modal */}
      <FileOperationModal
        isOpen={modalState.isOpen}
        type={modalState.type}
        targetPath={modalState.targetPath}
        isFolder={modalState.isFolder}
        onClose={() => setModalState(prev => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
};
