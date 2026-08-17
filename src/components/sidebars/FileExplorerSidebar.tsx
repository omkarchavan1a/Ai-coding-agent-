import React, { useState } from 'react';
import { useIDE } from '../../context/IDEContext';
import { 
  Folder, 
  FolderOpen, 
  FileCode, 
  FileJson, 
  FileText, 
  Plus, 
  Trash2, 
  Search, 
  ChevronRight, 
  ChevronDown,
  FolderPlus,
  Upload,
  Download
} from 'lucide-react';

export const FileExplorerSidebar: React.FC = () => {
  const {
    projectName,
    openNewProjectModal,
    openImportProjectModal,
    openExportProjectModal,
    files,
    activeFilePath,
    openFileInTab,
    createNewFile,
    deleteFile,
    stagedFiles,
    unstagedFiles
  } = useIDE();

  const [searchQuery, setSearchQuery] = useState('');
  const [isCreatingFile, setIsCreatingFile] = useState(false);
  const [newFileName, setNewFileName] = useState('');

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFileName.trim()) {
      setIsCreatingFile(false);
      return;
    }
    createNewFile(newFileName.trim());
    setNewFileName('');
    setIsCreatingFile(false);
  };

  const getFileIcon = (fileName: string) => {
    if (fileName.endsWith('.json')) return <FileJson className="w-3.5 h-3.5 text-[#fbbf24]" />;
    if (fileName.endsWith('.md')) return <FileText className="w-3.5 h-3.5 text-[#38bdf8]" />;
    if (fileName.endsWith('.ts') || fileName.endsWith('.tsx')) return <FileCode className="w-3.5 h-3.5 text-[#60a5fa]" />;
    if (fileName.endsWith('.py')) return <FileCode className="w-3.5 h-3.5 text-[#f59e0b]" />;
    return <FileCode className="w-3.5 h-3.5 text-[#34d399]" />;
  };

  const filteredFiles = files.filter(f => 
    f.path.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col bg-[#111114] text-xs text-[#a1a1aa] select-none">
      {/* Sidebar Header */}
      <div className="h-9 px-3 border-b border-[#1e1e24] flex items-center justify-between font-medium text-[#71717a] text-[11px]">
        <span className="text-[#ededee] font-semibold text-xs">Explorer</span>
        <div className="flex items-center space-x-0.5">
          <button
            onClick={() => setIsCreatingFile(true)}
            className="p-1 rounded hover:bg-[#1c1c24] text-[#71717a] hover:text-white transition-colors"
            title="New File"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={openNewProjectModal}
            className="p-1 rounded hover:bg-[#1c1c24] text-[#71717a] hover:text-[#818cf8] transition-colors"
            title="New Project Starter"
          >
            <FolderPlus className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={openImportProjectModal}
            className="p-1 rounded hover:bg-[#1c1c24] text-[#71717a] hover:text-[#fbbf24] transition-colors"
            title="Import Project (ZIP / Folder)"
          >
            <Upload className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={openExportProjectModal}
            className="p-1 rounded hover:bg-[#1c1c24] text-[#71717a] hover:text-[#34d399] transition-colors"
            title="Export Project (ZIP / JSON)"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="p-2 border-b border-[#1e1e24]">
        <div className="relative">
          <Search className="w-3 h-3 absolute left-2.5 top-2 text-[#52525b]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search files..."
            className="w-full bg-[#15151a] border border-[#202028] rounded pl-7 pr-2 py-1 text-xs text-[#ededee] placeholder-[#52525b] focus:outline-none focus:border-[#3b3b4a]"
          />
        </div>
      </div>

      {/* Inline File Creation Input */}
      {isCreatingFile && (
        <form onSubmit={handleCreateSubmit} className="p-2 border-b border-[#202028] bg-[#15151a]">
          <div className="flex items-center space-x-1">
            <input
              type="text"
              autoFocus
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
              placeholder="e.g. app/utils/auth.js"
              className="flex-1 bg-[#0d0d0f] border border-[#6366f1] rounded px-2 py-0.5 text-xs text-white focus:outline-none"
            />
            <button
              type="submit"
              className="px-2 py-0.5 bg-[#6366f1] text-white rounded text-[10px] font-medium"
            >
              Add
            </button>
            <button
              type="button"
              onClick={() => setIsCreatingFile(false)}
              className="px-1.5 py-0.5 text-[#71717a] hover:text-white text-[10px]"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Workspace root section */}
      <div className="px-3 py-1.5 flex items-center justify-between text-[10px] font-medium text-[#71717a] border-b border-[#1a1a20]">
        <span className="truncate uppercase font-semibold text-[#a1a1aa]">{projectName}</span>
        <span className="font-mono text-[9px]">{files.length} files</span>
      </div>

      {/* File Tree List */}
      <div className="flex-1 overflow-y-auto py-1 font-mono text-xs">
        {filteredFiles.map((file) => {
          const isCurrentActive = file.path === activeFilePath;
          const isStaged = stagedFiles.includes(file.path);
          const isUnstaged = unstagedFiles.includes(file.path);
          const isModified = file.isModified || isStaged || isUnstaged;

          return (
            <div
              key={file.path}
              onClick={() => openFileInTab(file.path)}
              className={`group flex items-center justify-between px-3 py-1.5 cursor-pointer transition-colors ${
                isCurrentActive
                  ? 'bg-[#1b1b24] text-white font-medium border-l-2 border-[#818cf8]'
                  : 'hover:bg-[#16161c] text-[#a1a1aa] hover:text-[#ededee]'
              }`}
            >
              <div className="flex items-center space-x-2 truncate flex-1 min-w-0">
                {getFileIcon(file.path)}
                <span className="truncate text-[11px]">{file.path}</span>
              </div>

              {/* Status Indicator */}
              <div className="flex items-center space-x-1.5 ml-2">
                {isModified && (
                  <span
                    className={`text-[9px] font-bold px-1 rounded ${
                      isStaged
                        ? 'text-[#34d399] bg-[#10b981]/10'
                        : 'text-[#fbbf24] bg-[#f59e0b]/10'
                    }`}
                    title={isStaged ? 'Staged' : 'Modified'}
                  >
                    {isStaged ? 'S' : 'M'}
                  </span>
                )}

                {files.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteFile(file.path);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-0.5 hover:text-[#f43f5e] text-[#52525b] transition-opacity"
                    title="Delete File"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Info */}
      <div className="p-2 border-t border-[#1e1e24] bg-[#0e0e11] text-[10px] text-[#71717a] flex items-center justify-between">
        <span className="flex items-center space-x-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
          <span>Ready</span>
        </span>
        <span className="font-mono text-[9px]">UTF-8</span>
      </div>
    </div>
  );
};
