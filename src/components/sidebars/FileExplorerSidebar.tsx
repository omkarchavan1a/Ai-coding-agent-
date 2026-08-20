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
  Download,
  RotateCcw,
  XCircle,
  Copy,
  Edit3,
  MoreVertical,
  Sparkles,
  GitFork
} from 'lucide-react';
import { FileContextMenu, ContextMenuPosition } from '../common/FileContextMenu';
import { FileOperationModal, FileModalType } from '../modals/FileOperationModal';

export const FileExplorerSidebar: React.FC = () => {
  const {
    projectName,
    openNewProjectModal,
    openImportProjectModal,
    openCloneProjectModal,
    openExportProjectModal,
    files,
    activeFilePath,
    openFileInTab,
    closeAllTabs,
    closeTab,
    closeOtherTabs,
    closeSavedTabs,
    createNewFile,
    createFolder,
    deleteFile,
    deleteFolder,
    renameFile,
    duplicateFile,
    revertFile,
    revertAllFiles,
    downloadSingleFile,
    setViewMode,
    stagedFiles,
    unstagedFiles
  } = useIDE();

  const [searchQuery, setSearchQuery] = useState('');
  const [collapsedFolders, setCollapsedFolders] = useState<Record<string, boolean>>({});

  // Context Menu State
  const [contextMenu, setContextMenu] = useState<{
    isOpen: boolean;
    position: ContextMenuPosition;
    targetPath: string;
    isFolder: boolean;
    isModified: boolean;
  }>({
    isOpen: false,
    position: { x: 0, y: 0 },
    targetPath: '',
    isFolder: false,
    isModified: false
  });

  // Modal State
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

  const getFileIcon = (fileName: string) => {
    if (fileName.endsWith('.json')) return <FileJson className="w-3.5 h-3.5 text-[#fbbf24]" />;
    if (fileName.endsWith('.md')) return <FileText className="w-3.5 h-3.5 text-[#38bdf8]" />;
    if (fileName.endsWith('.ts') || fileName.endsWith('.tsx')) return <FileCode className="w-3.5 h-3.5 text-[#60a5fa]" />;
    if (fileName.endsWith('.py')) return <FileCode className="w-3.5 h-3.5 text-[#f59e0b]" />;
    return <FileCode className="w-3.5 h-3.5 text-[#34d399]" />;
  };

  const handleContextMenu = (e: React.MouseEvent, path: string, isFolder: boolean = false) => {
    e.preventDefault();
    e.stopPropagation();
    const file = files.find(f => f.path === path);
    const isMod = !!(file?.isModified || stagedFiles.includes(path) || unstagedFiles.includes(path));

    setContextMenu({
      isOpen: true,
      position: { x: e.clientX, y: e.clientY },
      targetPath: path,
      isFolder,
      isModified: isMod
    });
  };

  const toggleFolder = (folderName: string) => {
    setCollapsedFolders(prev => ({
      ...prev,
      [folderName]: !prev[folderName]
    }));
  };

  const filteredFiles = files.filter(f => 
    f.path.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const modifiedCount = files.filter(f => f.isModified || stagedFiles.includes(f.path) || unstagedFiles.includes(f.path)).length;

  return (
    <div className="h-full flex flex-col bg-[#111114] text-xs text-[#a1a1aa] select-none">
      {/* Sidebar Header */}
      <div className="h-9 px-3 border-b border-[#1e1e24] flex items-center justify-between font-medium text-[#71717a] text-[11px]">
        <span className="text-[#ededee] font-semibold text-xs">Explorer</span>
        <div className="flex items-center space-x-0.5">
          {/* New File */}
          <button
            onClick={() => setModalState({ isOpen: true, type: 'new-file', targetPath: '', isFolder: false })}
            className="p-1 rounded hover:bg-[#1c1c24] text-[#71717a] hover:text-white transition-colors"
            title="New File..."
          >
            <Plus className="w-3.5 h-3.5 text-[#34d399]" />
          </button>

          {/* New Folder */}
          <button
            onClick={() => setModalState({ isOpen: true, type: 'new-folder', targetPath: '', isFolder: true })}
            className="p-1 rounded hover:bg-[#1c1c24] text-[#71717a] hover:text-white transition-colors"
            title="New Folder..."
          >
            <FolderPlus className="w-3.5 h-3.5 text-[#fbbf24]" />
          </button>

          {/* Close All Tabs */}
          <button
            onClick={closeAllTabs}
            className="p-1 rounded hover:bg-[#1c1c24] text-[#71717a] hover:text-[#fb7185] transition-colors"
            title="Close All Open Tabs"
          >
            <XCircle className="w-3.5 h-3.5" />
          </button>

          {/* Revert All Files */}
          {modifiedCount > 0 && (
            <button
              onClick={revertAllFiles}
              className="p-1 rounded hover:bg-[#1c1c24] text-[#fbbf24] hover:text-white transition-colors"
              title="Revert all modified files"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Project Starter */}
          <button
            onClick={openNewProjectModal}
            className="p-1 rounded hover:bg-[#1c1c24] text-[#71717a] hover:text-[#818cf8] transition-colors"
            title="New Project Starter"
          >
            <Folder className="w-3.5 h-3.5 text-[#818cf8]" />
          </button>

          {/* Clone Repository */}
          <button
            onClick={openCloneProjectModal}
            className="p-1 rounded hover:bg-[#1c1c24] text-[#71717a] hover:text-[#38bdf8] transition-colors"
            title="Clone Git / GitHub Repository"
          >
            <GitFork className="w-3.5 h-3.5 text-[#38bdf8]" />
          </button>

          {/* Import Project */}
          <button
            onClick={openImportProjectModal}
            className="p-1 rounded hover:bg-[#1c1c24] text-[#71717a] hover:text-[#fbbf24] transition-colors"
            title="Import Project (ZIP / Folder)"
          >
            <Upload className="w-3.5 h-3.5" />
          </button>

          {/* Export Project */}
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
            placeholder="Filter files in workspace..."
            className="w-full bg-[#15151a] border border-[#202028] rounded pl-7 pr-2 py-1 text-xs text-[#ededee] placeholder-[#52525b] focus:outline-none focus:border-[#3b3b4a]"
          />
        </div>
      </div>

      {/* Workspace Root Header */}
      <div 
        onContextMenu={(e) => handleContextMenu(e, '', true)}
        className="px-3 py-1.5 flex items-center justify-between text-[10px] font-medium text-[#71717a] border-b border-[#1a1a20] hover:bg-[#15151c] cursor-pointer"
      >
        <div className="flex items-center space-x-1 truncate font-semibold uppercase text-[#a1a1aa]">
          <FolderOpen className="w-3.5 h-3.5 text-[#818cf8]" />
          <span className="truncate">{projectName}</span>
        </div>
        <div className="flex items-center space-x-1.5">
          {modifiedCount > 0 && (
            <span className="px-1 py-0.2 rounded bg-[#f59e0b]/15 text-[#fbbf24] text-[9px] font-bold">
              {modifiedCount} MOD
            </span>
          )}
          <span className="font-mono text-[9px]">{files.length} files</span>
        </div>
      </div>

      {/* File Tree List */}
      <div className="flex-1 overflow-y-auto py-1 font-mono text-xs">
        {files.length === 0 ? (
          <div className="p-4 flex flex-col items-center justify-center text-center space-y-3 font-sans">
            <div className="w-9 h-9 rounded-xl bg-[#181822] border border-[#222230] flex items-center justify-center text-[#818cf8]">
              <FolderPlus className="w-4 h-4" />
            </div>
            <div className="space-y-1">
              <p className="text-[#ededee] text-[11px] font-medium">Workspace is empty</p>
              <p className="text-[#71717a] text-[10px] leading-relaxed">
                Create a new file, load a project template, or clone a remote Git repo.
              </p>
            </div>
            <div className="flex flex-col space-y-1.5 w-full pt-1">
              <button
                onClick={() => setModalState({ isOpen: true, type: 'new-file', targetPath: '', isFolder: false })}
                className="w-full py-1 px-2 rounded bg-[#1e1e28] hover:bg-[#282836] border border-[#2e2e40] text-[#ededee] text-[10px] font-medium flex items-center justify-center space-x-1.5 transition-colors"
              >
                <Plus className="w-3 h-3 text-[#34d399]" />
                <span>New File</span>
              </button>
              <button
                onClick={openCloneProjectModal}
                className="w-full py-1 px-2 rounded bg-[#0c2436] hover:bg-[#0e2f47] border border-[#164e63] text-[#38bdf8] text-[10px] font-medium flex items-center justify-center space-x-1.5 transition-colors"
              >
                <GitFork className="w-3 h-3 text-[#38bdf8]" />
                <span>Clone Git Repository</span>
              </button>
              <button
                onClick={openNewProjectModal}
                className="w-full py-1 px-2 rounded bg-[#161622] hover:bg-[#222232] border border-[#26263a] text-[#a5b4fc] text-[10px] font-medium flex items-center justify-center space-x-1.5 transition-colors"
              >
                <Sparkles className="w-3 h-3 text-[#818cf8]" />
                <span>Project Starters</span>
              </button>
            </div>
          </div>
        ) : filteredFiles.length === 0 ? (
          <div className="p-4 text-center text-[#71717a] text-[11px] font-sans">
            No files match "{searchQuery}"
          </div>
        ) : (
          filteredFiles.map((file) => {
          const isCurrentActive = file.path === activeFilePath;
          const isStaged = stagedFiles.includes(file.path);
          const isUnstaged = unstagedFiles.includes(file.path);
          const isModified = file.isModified || isStaged || isUnstaged;

          return (
            <div
              key={file.path}
              onClick={() => openFileInTab(file.path)}
              onContextMenu={(e) => handleContextMenu(e, file.path, false)}
              className={`group flex items-center justify-between px-3 py-1.5 cursor-pointer transition-colors ${
                isCurrentActive
                  ? 'bg-[#1b1b24] text-white font-medium border-l-2 border-[#818cf8]'
                  : 'hover:bg-[#16161c] text-[#a1a1aa] hover:text-[#ededee]'
              }`}
              title={`${file.path} (Right-click for menu)`}
            >
              <div className="flex items-center space-x-2 truncate flex-1 min-w-0">
                {getFileIcon(file.path)}
                <span className="truncate text-[11px]">{file.path}</span>
              </div>

              {/* Status Indicator & Hover Actions */}
              <div className="flex items-center space-x-1 ml-2">
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

                {/* Quick Hover Actions */}
                <div className="opacity-0 group-hover:opacity-100 flex items-center space-x-0.5 transition-opacity">
                  {/* Download */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      downloadSingleFile(file.path);
                    }}
                    className="p-0.5 hover:text-white text-[#71717a] rounded"
                    title="Download file"
                  >
                    <Download className="w-3 h-3" />
                  </button>

                  {/* Duplicate */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      duplicateFile(file.path);
                    }}
                    className="p-0.5 hover:text-white text-[#71717a] rounded"
                    title="Duplicate file"
                  >
                    <Copy className="w-3 h-3" />
                  </button>

                  {/* Rename */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setModalState({ isOpen: true, type: 'rename', targetPath: file.path, isFolder: false });
                    }}
                    className="p-0.5 hover:text-white text-[#71717a] rounded"
                    title="Rename file"
                  >
                    <Edit3 className="w-3 h-3" />
                  </button>

                  {/* Delete */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setModalState({ isOpen: true, type: 'delete', targetPath: file.path, isFolder: false });
                    }}
                    className="p-0.5 hover:text-[#fb7185] text-[#71717a] rounded"
                    title="Delete File"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          );
        })
        )}
      </div>

      {/* Footer Info */}
      <div className="p-2 border-t border-[#1e1e24] bg-[#0e0e11] text-[10px] text-[#71717a] flex items-center justify-between">
        <span className="flex items-center space-x-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
          <span>Workspace synced</span>
        </span>
        <span className="font-mono text-[9px]">{files.length} items</span>
      </div>

      {/* Context Menu */}
      <FileContextMenu
        isOpen={contextMenu.isOpen}
        position={contextMenu.position}
        targetPath={contextMenu.targetPath}
        isFolder={contextMenu.isFolder}
        isTab={false}
        isModified={contextMenu.isModified}
        onClose={() => setContextMenu(prev => ({ ...prev, isOpen: false }))}
        onOpenInEditor={(path) => openFileInTab(path)}
        onOpenInDiff={() => setViewMode('diff')}
        onRename={(path, isFolder) => setModalState({ isOpen: true, type: 'rename', targetPath: path, isFolder })}
        onDuplicate={(path) => duplicateFile(path)}
        onDelete={(path, isFolder) => setModalState({ isOpen: true, type: 'delete', targetPath: path, isFolder })}
        onRevert={(path) => revertFile(path)}
        onDownload={(path) => downloadSingleFile(path)}
        onNewFileInFolder={(folderPath) => setModalState({ isOpen: true, type: 'new-file', targetPath: folderPath, isFolder: true })}
        onNewFolderInFolder={(folderPath) => setModalState({ isOpen: true, type: 'new-folder', targetPath: folderPath, isFolder: true })}
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
