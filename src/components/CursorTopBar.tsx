import React, { useState, useRef, useEffect } from 'react';
import { useIDE } from '../context/IDEContext';
import { 
  Sparkles, 
  Key, 
  GitBranch, 
  Play, 
  Square, 
  SplitSquareVertical, 
  Code, 
  Terminal, 
  Sidebar, 
  RefreshCw, 
  Download, 
  CheckCircle2, 
  AlertCircle,
  Command,
  ChevronDown,
  User,
  Mail,
  LogOut,
  ShieldCheck,
  FolderPlus,
  Upload,
  Layers,
  FileCode,
  FileJson
} from 'lucide-react';

export const CursorTopBar: React.FC<{ onExportZip?: () => void }> = () => {
  const {
    user,
    logout,
    setIsAuthModalOpen,
    projectName,
    openNewProjectModal,
    openImportProjectModal,
    openExportProjectModal,
    currentBranch,
    byok,
    setIsByokModalOpen,
    isAnyAgentRunning,
    runAllAgents,
    stopAgents,
    viewMode,
    setViewMode,
    isSidebarOpen,
    setIsSidebarOpen,
    isBottomPanelOpen,
    setIsBottomPanelOpen,
    setIsCommandPaletteOpen,
    resetCodebase,
    files
  } = useIDE();

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isProjectMenuOpen, setIsProjectMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const projectMenuRef = useRef<HTMLDivElement>(null);

  const modifiedCount = files.filter(f => f.isModified).length;

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
      if (projectMenuRef.current && !projectMenuRef.current.contains(e.target as Node)) {
        setIsProjectMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOutClick = async () => {
    setIsUserMenuOpen(false);
    await logout();
  };

  return (
    <header className="h-11 bg-[#0d0d0f] border-b border-[#1e1e24] flex items-center justify-between px-3 text-xs select-none text-[#a1a1aa] z-30">
      {/* Left: Window Controls & Workspace Info */}
      <div className="flex items-center space-x-3">
        {/* macOS style minimal window dots */}
        <div className="flex items-center space-x-1.5 mr-1">
          <span className="w-3 h-3 rounded-full bg-[#ff5f56]/80 hover:bg-[#ff5f56] transition-colors" />
          <span className="w-3 h-3 rounded-full bg-[#ffbd2e]/80 hover:bg-[#ffbd2e] transition-colors" />
          <span className="w-3 h-3 rounded-full bg-[#27c93f]/80 hover:bg-[#27c93f] transition-colors" />
        </div>

        {/* Project Name & Dropdown Menu */}
        <div className="relative" ref={projectMenuRef}>
          <button
            onClick={() => setIsProjectMenuOpen(!isProjectMenuOpen)}
            className="flex items-center space-x-1.5 px-2 py-1 rounded-md bg-[#141418] hover:bg-[#1b1b22] border border-[#22222a] hover:border-[#353545] text-[#ededee] transition-colors"
          >
            <Layers className="w-3.5 h-3.5 text-[#818cf8]" />
            <span className="font-semibold text-white tracking-tight">{projectName}</span>
            <ChevronDown className="w-3 h-3 text-[#71717a]" />
          </button>

          {/* Project Dropdown */}
          {isProjectMenuOpen && (
            <div className="absolute left-0 top-full mt-1.5 w-56 bg-[#16161b] border border-[#282836] rounded-xl shadow-2xl py-1.5 z-50 text-xs animate-in fade-in zoom-in-95 duration-100">
              <div className="px-3 py-1.5 text-[10px] font-semibold text-[#71717a] uppercase tracking-wider border-b border-[#22222d]">
                Project Actions
              </div>

              <button
                onClick={() => {
                  setIsProjectMenuOpen(false);
                  openNewProjectModal();
                }}
                className="w-full px-3 py-2 text-left text-[#ededee] hover:bg-[#22222e] hover:text-white flex items-center space-x-2.5 transition-colors"
              >
                <FolderPlus className="w-3.5 h-3.5 text-[#818cf8]" />
                <div className="flex-1">
                  <div className="font-medium">New Project...</div>
                  <div className="text-[10px] text-[#71717a]">Choose from starters or blank</div>
                </div>
              </button>

              <button
                onClick={() => {
                  setIsProjectMenuOpen(false);
                  openImportProjectModal();
                }}
                className="w-full px-3 py-2 text-left text-[#ededee] hover:bg-[#22222e] hover:text-white flex items-center space-x-2.5 transition-colors"
              >
                <Upload className="w-3.5 h-3.5 text-[#fbbf24]" />
                <div className="flex-1">
                  <div className="font-medium">Import Project...</div>
                  <div className="text-[10px] text-[#71717a]">ZIP archive, folder, or JSON</div>
                </div>
              </button>

              <button
                onClick={() => {
                  setIsProjectMenuOpen(false);
                  openExportProjectModal();
                }}
                className="w-full px-3 py-2 text-left text-[#ededee] hover:bg-[#22222e] hover:text-white flex items-center space-x-2.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-[#34d399]" />
                <div className="flex-1">
                  <div className="font-medium">Export Project...</div>
                  <div className="text-[10px] text-[#71717a]">Download ZIP, JSON, or diff</div>
                </div>
              </button>

              <div className="h-px bg-[#22222d] my-1" />

              <div className="px-3 py-1 text-[10px] text-[#71717a] font-mono">
                Active files: {files.length}
              </div>
            </div>
          )}
        </div>

        {/* Current Branch Pill */}
        <div className="hidden md:flex items-center space-x-1.5 px-2 py-0.5 rounded bg-[#17171c] border border-[#262630] text-[#a1a1aa]">
          <GitBranch className="w-3 h-3 text-[#71717a]" />
          <span className="font-mono text-[11px] truncate max-w-[120px] text-[#d4d4d8]">{currentBranch}</span>
          {modifiedCount > 0 && (
            <span className="w-1.5 h-1.5 rounded-full bg-[#f59e0b]" title={`${modifiedCount} files modified`} />
          )}
        </div>
      </div>

      {/* Center: Command Palette Trigger (Cursor-Style Spotlight) */}
      <div className="flex-1 max-w-lg mx-4">
        <button
          onClick={() => setIsCommandPaletteOpen(true)}
          className="w-full h-7 px-2.5 rounded-md bg-[#141418] hover:bg-[#18181f] border border-[#22222a] hover:border-[#32323e] text-[#71717a] hover:text-[#d4d4d8] transition-all flex items-center justify-between text-xs group"
        >
          <div className="flex items-center space-x-2 truncate">
            <Sparkles className="w-3.5 h-3.5 text-[#818cf8] group-hover:text-[#a5b4fc] transition-colors" />
            <span className="truncate text-[11px]">Generate with 4 Agents or search files...</span>
          </div>
          <kbd className="px-1.5 py-0.5 rounded bg-[#1d1d24] border border-[#2a2a34] text-[10px] font-mono text-[#a1a1aa] flex items-center space-x-0.5">
            <span>⌘</span>
            <span>K</span>
          </kbd>
        </button>
      </div>

      {/* Right: Actions, Project Export, BYOK Key Status, Auth & Controls */}
      <div className="flex items-center space-x-1.5">
        {/* Quick Project New / Import / Export buttons */}
        <button
          onClick={openNewProjectModal}
          className="h-7 px-2 rounded-md bg-[#141418] hover:bg-[#1c1c24] border border-[#22222a] hover:border-[#333342] text-[#ededee] flex items-center space-x-1 transition-colors text-[11px]"
          title="Create New Project"
        >
          <FolderPlus className="w-3 h-3 text-[#818cf8]" />
          <span className="hidden lg:inline">New</span>
        </button>

        <button
          onClick={openImportProjectModal}
          className="h-7 px-2 rounded-md bg-[#141418] hover:bg-[#1c1c24] border border-[#22222a] hover:border-[#333342] text-[#ededee] flex items-center space-x-1 transition-colors text-[11px]"
          title="Import ZIP or Directory"
        >
          <Upload className="w-3 h-3 text-[#fbbf24]" />
          <span className="hidden lg:inline">Import</span>
        </button>

        <button
          onClick={openExportProjectModal}
          className="h-7 px-2 rounded-md bg-[#141418] hover:bg-[#1c1c24] border border-[#22222a] hover:border-[#333342] text-[#34d399] flex items-center space-x-1 transition-colors text-[11px]"
          title="Export Project Archive or JSON"
        >
          <Download className="w-3 h-3" />
          <span className="hidden lg:inline">Export</span>
        </button>

        <div className="h-4 w-px bg-[#22222a] mx-0.5" />

        {/* User Account Dropdown Menu with Sign Out */}
        <div className="relative" ref={userMenuRef}>
          {user ? (
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="h-7 px-2 rounded-md bg-[#16161b] hover:bg-[#202028] border border-[#252530] hover:border-[#3b3b4a] flex items-center space-x-1.5 transition-all text-[11px] text-[#ededee]"
            >
              <img
                src={user.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.email}`}
                alt={user.name}
                className="w-4 h-4 rounded-full bg-[#0d0d0f]"
              />
              <span className="truncate max-w-[90px] font-medium hidden sm:inline">{user.name || user.email.split('@')[0]}</span>
              {user.isVerified ? (
                <CheckCircle2 className="w-3 h-3 text-[#34d399] flex-shrink-0" />
              ) : (
                <Mail className="w-3 h-3 text-[#fbbf24] flex-shrink-0" />
              )}
              <ChevronDown className="w-2.5 h-2.5 text-[#71717a]" />
            </button>
          ) : (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="h-7 px-2.5 rounded-md bg-[#16161b] hover:bg-[#202028] border border-[#252530] hover:border-[#3b3b4a] flex items-center space-x-1.5 transition-all text-[11px] font-medium text-[#818cf8]"
            >
              <Mail className="w-3 h-3 text-[#818cf8]" />
              <span>Verify Gmail</span>
            </button>
          )}

          {/* User Account Popover */}
          {isUserMenuOpen && user && (
            <div className="absolute right-0 top-full mt-1.5 w-64 bg-[#16161b] border border-[#282836] rounded-xl shadow-2xl py-2 z-50 text-xs animate-in fade-in zoom-in-95 duration-100">
              <div className="px-3.5 py-2 border-b border-[#22222d]">
                <div className="flex items-center space-x-2.5">
                  <img
                    src={user.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.email}`}
                    alt={user.name}
                    className="w-8 h-8 rounded-full bg-[#0d0d0f]"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-white truncate text-xs">{user.name}</div>
                    <div className="text-[10px] text-[#71717a] font-mono truncate">{user.email}</div>
                  </div>
                </div>

                <div className="mt-2 flex items-center justify-between pt-1 text-[10px]">
                  <span className="text-[#71717a]">Status:</span>
                  <span className={`px-1.5 py-0.5 rounded font-mono font-medium ${
                    user.isVerified ? 'bg-[#10b981]/15 text-[#34d399]' : 'bg-[#f59e0b]/15 text-[#fbbf24]'
                  }`}>
                    {user.isVerified ? 'VERIFIED' : 'UNVERIFIED'}
                  </span>
                </div>
              </div>

              <div className="py-1">
                <button
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    setIsAuthModalOpen(true);
                  }}
                  className="w-full px-3.5 py-2 text-left text-[#ededee] hover:bg-[#22222e] hover:text-white flex items-center space-x-2 transition-colors"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-[#34d399]" />
                  <span>Developer Account Details</span>
                </button>

                <button
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    setIsByokModalOpen(true);
                  }}
                  className="w-full px-3.5 py-2 text-left text-[#ededee] hover:bg-[#22222e] hover:text-white flex items-center space-x-2 transition-colors"
                >
                  <Key className="w-3.5 h-3.5 text-[#818cf8]" />
                  <span>BYOK & Model Settings</span>
                </button>
              </div>

              <div className="h-px bg-[#22222d] my-1" />

              {/* Sign Out Button */}
              <button
                onClick={handleSignOutClick}
                className="w-full px-3.5 py-2 text-left text-[#fb7185] hover:bg-[#f43f5e]/15 flex items-center space-x-2 transition-colors font-medium"
              >
                <LogOut className="w-3.5 h-3.5 text-[#fb7185]" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>

        {/* BYOK (Bring Your Own Key) Pill */}
        <button
          onClick={() => setIsByokModalOpen(true)}
          className={`h-7 px-2.5 rounded-md border flex items-center space-x-1.5 transition-all text-[11px] font-medium ${
            byok.isKeyVerified || byok.geminiApiKey || byok.openaiApiKey
              ? 'bg-[#121b16] border-[#1b3d2b] text-[#34d399] hover:bg-[#16271e]'
              : 'bg-[#16161b] border-[#252530] text-[#a1a1aa] hover:border-[#3b3b4a] hover:text-[#ededee]'
          }`}
          title="Bring Your Own Key (Gemini, OpenAI, Claude, Custom)"
        >
          <Key className="w-3 h-3 text-[#818cf8]" />
          <span className="truncate max-w-[100px]">
            {byok.isKeyVerified ? `${byok.selectedModel}` : 'API Key'}
          </span>
          <span className={`w-1.5 h-1.5 rounded-full ${byok.isKeyVerified ? 'bg-[#10b981]' : 'bg-[#f59e0b]'}`} />
        </button>

        {/* 4-Agent Orchestration Run Button */}
        {isAnyAgentRunning ? (
          <button
            onClick={stopAgents}
            className="h-7 px-2.5 rounded-md bg-[#dc2626] hover:bg-[#b91c1c] text-white font-medium flex items-center space-x-1.5 transition-all text-[11px]"
          >
            <Square className="w-3 h-3 fill-current" />
            <span>Stop</span>
          </button>
        ) : (
          <button
            onClick={() => runAllAgents()}
            className="h-7 px-3 rounded-md bg-[#6366f1] hover:bg-[#4f46e5] text-white font-medium flex items-center space-x-1.5 transition-all text-[11px] shadow-xs"
          >
            <Sparkles className="w-3 h-3 text-[#c7d2fe]" />
            <span>Run 4 Agents</span>
          </button>
        )}

        <div className="h-4 w-px bg-[#22222a] mx-0.5" />

        {/* View Mode Toggle: Editor vs Diff */}
        <div className="flex items-center bg-[#131317] border border-[#22222a] rounded-md p-0.5">
          <button
            onClick={() => setViewMode('editor')}
            className={`px-2 py-0.5 rounded text-[11px] transition-all flex items-center space-x-1 ${
              viewMode === 'editor' ? 'bg-[#22222b] text-white font-medium' : 'text-[#71717a] hover:text-[#d4d4d8]'
            }`}
            title="Standard Code Editor"
          >
            <Code className="w-3 h-3" />
            <span className="hidden sm:inline">Editor</span>
          </button>
          <button
            onClick={() => setViewMode('diff')}
            className={`px-2 py-0.5 rounded text-[11px] transition-all flex items-center space-x-1 ${
              viewMode === 'diff' ? 'bg-[#22222b] text-white font-medium' : 'text-[#71717a] hover:text-[#d4d4d8]'
            }`}
            title="Side-by-Side Diff Viewer"
          >
            <SplitSquareVertical className="w-3 h-3 text-[#818cf8]" />
            <span className="hidden sm:inline">Diff</span>
          </button>
        </div>

        {/* Layout Toggles */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className={`p-1.5 rounded-md border transition-colors ${
            isSidebarOpen ? 'bg-[#202028] border-[#2e2e3a] text-white' : 'bg-[#131317] border-[#22222a] text-[#71717a] hover:text-white'
          }`}
          title="Toggle Left Sidebar"
        >
          <Sidebar className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() => setIsBottomPanelOpen(!isBottomPanelOpen)}
          className={`p-1.5 rounded-md border transition-colors ${
            isBottomPanelOpen ? 'bg-[#202028] border-[#2e2e3a] text-white' : 'bg-[#131317] border-[#22222a] text-[#71717a] hover:text-white'
          }`}
          title="Toggle Bottom Terminal & Console"
        >
          <Terminal className="w-3.5 h-3.5" />
        </button>

        {/* Reset Demo */}
        <button
          onClick={resetCodebase}
          className="p-1.5 rounded-md bg-[#131317] border border-[#22222a] hover:bg-[#1d1d24] text-[#71717a] hover:text-white transition-colors"
          title="Reset Codebase to Initial State"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>
    </header>
  );
};
