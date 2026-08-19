import React, { useState, useRef, useEffect } from 'react';
import { useIDE } from '../context/IDEContext';
import { 
  Sparkles, 
  Key, 
  GitBranch, 
  Square, 
  SplitSquareVertical, 
  Code, 
  Terminal, 
  Sidebar, 
  RefreshCw, 
  Download, 
  ChevronDown,
  FolderPlus,
  Upload,
  Layers,
  Lock,
  Unlock,
  ShieldCheck,
  KeyRound
} from 'lucide-react';

export const CursorTopBar: React.FC<{ onExportZip?: () => void }> = () => {
  const {
    projectName,
    openNewProjectModal,
    openImportProjectModal,
    openExportProjectModal,
    passcodeConfig,
    openPasscodeModal,
    openSecurityGuideModal,
    lockSession,
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

  const [isProjectMenuOpen, setIsProjectMenuOpen] = useState(false);
  const [isPasscodeMenuOpen, setIsPasscodeMenuOpen] = useState(false);
  const projectMenuRef = useRef<HTMLDivElement>(null);
  const passcodeMenuRef = useRef<HTMLDivElement>(null);

  const modifiedCount = files.filter(f => f.isModified).length;

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (projectMenuRef.current && !projectMenuRef.current.contains(e.target as Node)) {
        setIsProjectMenuOpen(false);
      }
      if (passcodeMenuRef.current && !passcodeMenuRef.current.contains(e.target as Node)) {
        setIsPasscodeMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

        {/* Passcode Security & Lock Dropdown */}
        <div className="relative" ref={passcodeMenuRef}>
          <button
            id="btn-topbar-passcode-status"
            onClick={() => setIsPasscodeMenuOpen(!isPasscodeMenuOpen)}
            className={`h-7 px-2.5 rounded-md border flex items-center space-x-1.5 transition-all text-[11px] font-medium ${
              passcodeConfig?.hasPasscode
                ? 'bg-[#151520] border-[#29293d] text-indigo-300 hover:border-indigo-500/50 hover:bg-[#1a1a2b]'
                : 'bg-[#16161b] border-[#252530] text-[#a1a1aa] hover:border-[#3b3b4a]'
            }`}
            title="Passcode Cryptographic Protection (PBKDF2 SHA-256)"
          >
            {passcodeConfig?.isUnlocked ? (
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
            ) : (
              <Lock className="w-3 h-3 text-amber-400" />
            )}
            <span className="truncate max-w-[90px]">
              {passcodeConfig?.hasPasscode ? (passcodeConfig.developerName || 'Passcode') : 'Set Passcode'}
            </span>
            <ChevronDown className="w-2.5 h-2.5 text-[#71717a]" />
          </button>

          {isPasscodeMenuOpen && (
            <div className="absolute right-0 top-full mt-1.5 w-60 bg-[#16161b] border border-[#282836] rounded-xl shadow-2xl py-1.5 z-50 text-xs animate-in fade-in zoom-in-95 duration-100">
              <div className="px-3 py-1.5 border-b border-[#22222d] flex items-center justify-between">
                <span className="text-[10px] font-semibold text-[#8e8ea0] uppercase tracking-wider">
                  Passcode Security
                </span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                  SHA-256
                </span>
              </div>

              {passcodeConfig?.hasPasscode ? (
                <>
                  <div className="px-3 py-2 text-[11px] text-[#a1a1aa] border-b border-[#22222d] bg-[#121217]">
                    <div className="text-white font-medium truncate">{passcodeConfig.developerName}</div>
                    <div className="text-[10px] text-[#717182] font-mono truncate mt-0.5">
                      Hash: {passcodeConfig.hashPreview || 'PBKDF2 SHA-256'}
                    </div>
                  </div>

                  <button
                    id="menu-item-lock-ide"
                    onClick={() => {
                      setIsPasscodeMenuOpen(false);
                      lockSession();
                    }}
                    className="w-full px-3 py-2 text-left text-amber-300 hover:bg-[#22222e] flex items-center space-x-2 transition-colors cursor-pointer"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>Lock IDE Session</span>
                  </button>

                  <button
                    id="menu-item-change-passcode"
                    onClick={() => {
                      setIsPasscodeMenuOpen(false);
                      openPasscodeModal('change');
                    }}
                    className="w-full px-3 py-2 text-left text-[#ededee] hover:bg-[#22222e] flex items-center space-x-2 transition-colors cursor-pointer"
                  >
                    <KeyRound className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Change Passcode...</span>
                  </button>

                  <button
                    id="menu-item-crypto-info"
                    onClick={() => {
                      setIsPasscodeMenuOpen(false);
                      openPasscodeModal('security_info');
                    }}
                    className="w-full px-3 py-2 text-left text-[#ededee] hover:bg-[#22222e] flex items-center space-x-2 transition-colors cursor-pointer"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>View Cryptographic Audit</span>
                  </button>

                  <button
                    id="menu-item-security-guide"
                    onClick={() => {
                      setIsPasscodeMenuOpen(false);
                      openSecurityGuideModal();
                    }}
                    className="w-full px-3 py-2 text-left text-emerald-400 hover:bg-[#22222e] flex items-center space-x-2 transition-colors cursor-pointer border-t border-[#22222e]"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>5-Pillar Security Guide & Test Bench</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    id="menu-item-create-passcode"
                    onClick={() => {
                      setIsPasscodeMenuOpen(false);
                      openPasscodeModal('create');
                    }}
                    className="w-full px-3 py-2 text-left text-indigo-400 hover:bg-[#22222e] flex items-center space-x-2 transition-colors cursor-pointer"
                  >
                    <KeyRound className="w-3.5 h-3.5" />
                    <span>Create Unique Passcode...</span>
                  </button>

                  <button
                    id="menu-item-security-guide-empty"
                    onClick={() => {
                      setIsPasscodeMenuOpen(false);
                      openSecurityGuideModal();
                    }}
                    className="w-full px-3 py-2 text-left text-emerald-400 hover:bg-[#22222e] flex items-center space-x-2 transition-colors cursor-pointer border-t border-[#22222e]"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>5-Pillar Security Guide & Test Bench</span>
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        {/* Passcode Security & Gate Status Pill */}
        <button
          onClick={() => {
            if (!passcodeConfig?.isUnlocked) {
              openPasscodeModal('authorize');
            } else {
              openPasscodeModal('security_info');
            }
          }}
          className={`h-7 px-2.5 rounded-md border flex items-center space-x-1.5 transition-all text-[11px] font-medium ${
            passcodeConfig?.isUnlocked
              ? 'bg-[#121b16] border-[#1b3d2b] text-[#34d399] hover:bg-[#16271e]'
              : 'bg-[#221815] border-[#4a2e1d] text-amber-300 hover:bg-[#2d1f19] animate-pulse'
          }`}
          title={passcodeConfig?.isUnlocked ? "Passcode Authorized - AI Agents Unlocked" : "Passcode Locked - Click to Authorize & Start AI Agents"}
        >
          {passcodeConfig?.isUnlocked ? (
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
          ) : (
            <Lock className="w-3 h-3 text-amber-400" />
          )}
          <span className="truncate max-w-[120px]">
            {passcodeConfig?.isUnlocked ? 'Passcode Verified' : 'Passcode Required'}
          </span>
          <span className={`w-1.5 h-1.5 rounded-full ${passcodeConfig?.isUnlocked ? 'bg-[#10b981]' : 'bg-amber-400'}`} />
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
