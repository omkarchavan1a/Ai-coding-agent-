import React, { useState } from 'react';
import { useIDE } from '../../context/IDEContext';
import { 
  Sparkles, 
  X, 
  Code2, 
  ShieldCheck, 
  Bug, 
  GitPullRequest, 
  ArrowRight,
  FolderPlus,
  Upload,
  Download,
  XCircle,
  RotateCcw,
  FilePlus,
  Trash2,
  Lock,
  KeyRound,
  Key,
  GitFork,
  FlaskConical,
  BookOpen,
  FileCode,
  SplitSquareVertical,
  Layers
} from 'lucide-react';
import { AgentRole } from '../../types';

export const CommandPaletteModal: React.FC = () => {
  const {
    isCommandPaletteOpen,
    setIsCommandPaletteOpen,
    runAllAgents,
    runSingleAgent,
    activeFile,
    openNewProjectModal,
    openImportProjectModal,
    openCloneProjectModal,
    openExportProjectModal,
    passcodeConfig,
    openPasscodeModal,
    openSecurityGuideModal,
    lockSession,
    closeAllTabs,
    closeOtherTabs,
    closeSavedTabs,
    revertAllFiles,
    revertFile,
    deleteFile,
    downloadSingleFile,
    setViewMode,
    byok,
    setIsByokModalOpen
  } = useIDE();

  const [prompt, setPrompt] = useState('');

  if (!isCommandPaletteOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    runAllAgents(prompt.trim());
    setIsCommandPaletteOpen(false);
  };

  const handleQuickAction = (role: AgentRole, actionPrompt: string) => {
    runSingleAgent(role, actionPrompt);
    setIsCommandPaletteOpen(false);
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-xs z-50 flex items-start justify-center pt-20 p-4">
      <div className="bg-[#121215] border border-[#22222a] w-full max-w-xl rounded-xl shadow-2xl overflow-hidden text-xs text-[#a1a1aa] animate-in fade-in zoom-in-95 duration-150">
        {/* Search Input Bar */}
        <form onSubmit={handleSubmit} className="p-3 border-b border-[#1e1e24] flex items-center space-x-3 bg-[#121215]">
          <Sparkles className="w-4 h-4 text-[#818cf8]" />
          <input
            type="text"
            autoFocus
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={`Ask the 4 Agents or search commands...`}
            className="flex-1 bg-transparent text-xs text-white placeholder-[#52525b] focus:outline-none"
          />
          <button
            type="submit"
            className="px-2.5 py-1 bg-[#6366f1] hover:bg-[#4f46e5] text-white font-medium rounded text-xs transition-all"
          >
            Run Agents
          </button>
          <button
            type="button"
            onClick={() => setIsCommandPaletteOpen(false)}
            className="p-1 text-[#71717a] hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Action Commands */}
        <div className="p-2.5 space-y-3 max-h-[70vh] overflow-y-auto">
          {/* Workbench View Navigation */}
          <div>
            <span className="text-[10px] text-[#71717a] uppercase tracking-wider font-semibold px-1.5 block mb-1 flex items-center justify-between">
              <span>Workbench Views & Modes</span>
              <span className="text-[9px] text-[#818cf8] font-mono">6 Views</span>
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
              <button
                onClick={() => {
                  setViewMode('editor');
                  setIsCommandPaletteOpen(false);
                }}
                className="p-2 rounded-lg bg-[#15151a] hover:bg-[#1c1c24] border border-[#202028] hover:border-indigo-500/40 text-left transition-all group flex items-center space-x-2"
              >
                <Code2 className="w-3.5 h-3.5 text-indigo-400" />
                <div className="truncate">
                  <div className="font-medium text-[#ededee] text-[11px]">Code Editor</div>
                  <div className="text-[9px] text-[#71717a]">IDE Editor</div>
                </div>
              </button>

              <button
                onClick={() => {
                  setViewMode('workflow');
                  setIsCommandPaletteOpen(false);
                }}
                className="p-2 rounded-lg bg-[#15151a] hover:bg-[#1c1c24] border border-[#202028] hover:border-amber-500/40 text-left transition-all group flex items-center space-x-2"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <div className="truncate">
                  <div className="font-medium text-[#ededee] text-[11px]">Agent Workflow</div>
                  <div className="text-[9px] text-[#71717a]">5-Step Pipeline</div>
                </div>
              </button>

              <button
                onClick={() => {
                  setViewMode('sandbox');
                  setIsCommandPaletteOpen(false);
                }}
                className="p-2 rounded-lg bg-[#15151a] hover:bg-[#1c1c24] border border-[#202028] hover:border-emerald-500/40 text-left transition-all group flex items-center space-x-2"
              >
                <FlaskConical className="w-3.5 h-3.5 text-emerald-400" />
                <div className="truncate">
                  <div className="font-medium text-[#ededee] text-[11px]">REST Sandbox</div>
                  <div className="text-[9px] text-[#71717a]">Notes App Test</div>
                </div>
              </button>

              <button
                onClick={() => {
                  setViewMode('diff');
                  setIsCommandPaletteOpen(false);
                }}
                className="p-2 rounded-lg bg-[#15151a] hover:bg-[#1c1c24] border border-[#202028] hover:border-sky-500/40 text-left transition-all group flex items-center space-x-2"
              >
                <SplitSquareVertical className="w-3.5 h-3.5 text-sky-400" />
                <div className="truncate">
                  <div className="font-medium text-[#ededee] text-[11px]">Git Diffs</div>
                  <div className="text-[9px] text-[#71717a]">Code Modifications</div>
                </div>
              </button>

              <button
                onClick={() => {
                  setViewMode('python');
                  setIsCommandPaletteOpen(false);
                }}
                className="p-2 rounded-lg bg-[#15151a] hover:bg-[#1c1c24] border border-[#202028] hover:border-purple-500/40 text-left transition-all group flex items-center space-x-2"
              >
                <FileCode className="w-3.5 h-3.5 text-purple-400" />
                <div className="truncate">
                  <div className="font-medium text-[#ededee] text-[11px]">Python Source</div>
                  <div className="text-[9px] text-[#71717a]">4 Agents Code</div>
                </div>
              </button>

              <button
                onClick={() => {
                  setViewMode('docs');
                  setIsCommandPaletteOpen(false);
                }}
                className="p-2 rounded-lg bg-[#15151a] hover:bg-[#1c1c24] border border-[#202028] hover:border-rose-500/40 text-left transition-all group flex items-center space-x-2"
              >
                <BookOpen className="w-3.5 h-3.5 text-rose-400" />
                <div className="truncate">
                  <div className="font-medium text-[#ededee] text-[11px]">System Docs</div>
                  <div className="text-[9px] text-[#71717a]">Architecture & Script</div>
                </div>
              </button>
            </div>
          </div>

          {/* Bring Your Own Key (BYOK) & AI Provider */}
          <div>
            <span className="text-[10px] text-[#71717a] uppercase tracking-wider font-semibold px-1.5 block mb-1 flex items-center justify-between">
              <span>Bring Your Own Key (BYOK) & AI Provider</span>
              <span className="text-[9px] text-[#fbbf24] font-mono uppercase">{byok.provider} • {byok.selectedModel}</span>
            </span>
            <div className="space-y-1">
              <button
                id="cmd-open-byok"
                onClick={() => {
                  setIsCommandPaletteOpen(false);
                  setIsByokModalOpen(true);
                }}
                className="w-full p-2 rounded-lg bg-[#181510] hover:bg-[#251e14] border border-amber-500/30 flex items-center justify-between text-left transition-all group cursor-pointer"
              >
                <div className="flex items-center space-x-2.5">
                  <Key className="w-3.5 h-3.5 text-[#fbbf24]" />
                  <div>
                    <div className="font-medium text-[#ededee] group-hover:text-amber-200 text-[11px] flex items-center space-x-2">
                      <span>Configure Bring Your Own Key (BYOK)</span>
                      <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 text-[9px] font-mono">Custom API Keys</span>
                    </div>
                    <span className="text-[10px] text-[#8e8ea0]">
                      Configure Gemini, OpenAI (GPT-4o/o1), Anthropic (Claude 3.5 Sonnet), or local Ollama endpoints.
                    </span>
                  </div>
                </div>
                <ArrowRight className="w-3 h-3 text-amber-400 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>

          {/* Passcode Security Commands */}
          <div>
            <span className="text-[10px] text-[#71717a] uppercase tracking-wider font-semibold px-1.5 block mb-1 flex items-center justify-between">
              <span>Passcode & Cryptographic Security</span>
              <span className="text-[9px] text-emerald-400 font-mono">PBKDF2 SHA-256</span>
            </span>
            <div className="space-y-1">
              <button
                onClick={() => {
                  setIsCommandPaletteOpen(false);
                  lockSession();
                }}
                className="w-full p-2 rounded-lg bg-[#15151a] hover:bg-[#1c1c24] border border-[#202028] flex items-center justify-between text-left transition-all group"
              >
                <div className="flex items-center space-x-2.5">
                  <Lock className="w-3.5 h-3.5 text-amber-400" />
                  <div>
                    <div className="font-medium text-[#ededee] group-hover:text-white text-[11px]">
                      Lock IDE Session
                    </div>
                    <span className="text-[10px] text-[#71717a]">
                      Locks workspace immediately; requires unique passcode to decrypt and authorize.
                    </span>
                  </div>
                </div>
                <ArrowRight className="w-3 h-3 text-[#52525b] group-hover:text-white" />
              </button>

              <button
                onClick={() => {
                  setIsCommandPaletteOpen(false);
                  openPasscodeModal('change');
                }}
                className="w-full p-2 rounded-lg bg-[#15151a] hover:bg-[#1c1c24] border border-[#202028] flex items-center justify-between text-left transition-all group"
              >
                <div className="flex items-center space-x-2.5">
                  <KeyRound className="w-3.5 h-3.5 text-indigo-400" />
                  <div>
                    <div className="font-medium text-[#ededee] group-hover:text-white text-[11px]">
                      Change Unique Passcode
                    </div>
                    <span className="text-[10px] text-[#71717a]">
                      Update passcode hash, salt and encrypted database payload.
                    </span>
                  </div>
                </div>
                <ArrowRight className="w-3 h-3 text-[#52525b] group-hover:text-white" />
              </button>

              <button
                onClick={() => {
                  setIsCommandPaletteOpen(false);
                  openPasscodeModal('security_info');
                }}
                className="w-full p-2 rounded-lg bg-[#15151a] hover:bg-[#1c1c24] border border-[#202028] flex items-center justify-between text-left transition-all group"
              >
                <div className="flex items-center space-x-2.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <div>
                    <div className="font-medium text-[#ededee] group-hover:text-white text-[11px]">
                      Audit Cryptographic Storage & Hashes
                    </div>
                    <span className="text-[10px] text-[#71717a]">
                      Inspect PBKDF2 hash rounds, salt preview, and AES-256 decryption validation.
                    </span>
                  </div>
                </div>
                <ArrowRight className="w-3 h-3 text-[#52525b] group-hover:text-white" />
              </button>

              <button
                onClick={() => {
                  setIsCommandPaletteOpen(false);
                  openSecurityGuideModal();
                }}
                className="w-full p-2 rounded-lg bg-[#142018] hover:bg-[#1b2d22] border border-emerald-500/30 flex items-center justify-between text-left transition-all group"
              >
                <div className="flex items-center space-x-2.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <div>
                    <div className="font-medium text-emerald-400 group-hover:text-emerald-300 text-[11px]">
                      5-Pillar Security Guide & Interactive Bench
                    </div>
                    <span className="text-[10px] text-[#8e8ea0]">
                      Review OWASP & NIST security requirements, live checklist, and run PBKDF2 benchmarks.
                    </span>
                  </div>
                </div>
                <ArrowRight className="w-3 h-3 text-emerald-500 group-hover:text-white" />
              </button>
            </div>
          </div>

          {/* Project & Workspace Commands */}
          <div>
            <span className="text-[10px] text-[#71717a] uppercase tracking-wider font-semibold px-1.5 block mb-1">
              Project & Workspace
            </span>
            <div className="space-y-1">
              <button
                onClick={() => {
                  setIsCommandPaletteOpen(false);
                  openNewProjectModal();
                }}
                className="w-full p-2 rounded-lg bg-[#15151a] hover:bg-[#1c1c24] border border-[#202028] flex items-center justify-between text-left transition-all group"
              >
                <div className="flex items-center space-x-2.5">
                  <FolderPlus className="w-3.5 h-3.5 text-[#818cf8]" />
                  <div>
                    <div className="font-medium text-[#ededee] group-hover:text-white text-[11px]">
                      New Project Starter
                    </div>
                    <span className="text-[10px] text-[#71717a]">
                      Initialize workspace with Node, React, Python 4-Agents or Blank template.
                    </span>
                  </div>
                </div>
                <ArrowRight className="w-3 h-3 text-[#52525b] group-hover:text-white" />
              </button>

              <button
                onClick={() => {
                  setIsCommandPaletteOpen(false);
                  openCloneProjectModal();
                }}
                className="w-full p-2 rounded-lg bg-[#15151a] hover:bg-[#1c1c24] border border-[#202028] flex items-center justify-between text-left transition-all group"
              >
                <div className="flex items-center space-x-2.5">
                  <GitFork className="w-3.5 h-3.5 text-[#38bdf8]" />
                  <div>
                    <div className="font-medium text-[#ededee] group-hover:text-white text-[11px] flex items-center space-x-1.5">
                      <span>Clone Remote Git Repository</span>
                      <span className="px-1 py-0.2 bg-[#0284c7]/20 text-[#38bdf8] text-[9px] rounded font-mono">Git</span>
                    </div>
                    <span className="text-[10px] text-[#71717a]">
                      Clone any public or private GitHub / GitLab / Git repository into workspace.
                    </span>
                  </div>
                </div>
                <ArrowRight className="w-3 h-3 text-[#52525b] group-hover:text-white" />
              </button>

              <button
                onClick={() => {
                  setIsCommandPaletteOpen(false);
                  openImportProjectModal();
                }}
                className="w-full p-2 rounded-lg bg-[#15151a] hover:bg-[#1c1c24] border border-[#202028] flex items-center justify-between text-left transition-all group"
              >
                <div className="flex items-center space-x-2.5">
                  <Upload className="w-3.5 h-3.5 text-[#fbbf24]" />
                  <div>
                    <div className="font-medium text-[#ededee] group-hover:text-white text-[11px]">
                      Import Project (ZIP, Folder, JSON)
                    </div>
                    <span className="text-[10px] text-[#71717a]">
                      Decompresses .zip archives or loads local folder directories.
                    </span>
                  </div>
                </div>
                <ArrowRight className="w-3 h-3 text-[#52525b] group-hover:text-white" />
              </button>

              <button
                onClick={() => {
                  setIsCommandPaletteOpen(false);
                  openExportProjectModal();
                }}
                className="w-full p-2 rounded-lg bg-[#15151a] hover:bg-[#1c1c24] border border-[#202028] flex items-center justify-between text-left transition-all group"
              >
                <div className="flex items-center space-x-2.5">
                  <Download className="w-3.5 h-3.5 text-[#34d399]" />
                  <div>
                    <div className="font-medium text-[#ededee] group-hover:text-white text-[11px]">
                      Export Project Bundle
                    </div>
                    <span className="text-[10px] text-[#71717a]">
                      Download complete ZIP archive, agent scripts and manifest.
                    </span>
                  </div>
                </div>
                <ArrowRight className="w-3 h-3 text-[#52525b] group-hover:text-white" />
              </button>
            </div>
          </div>

          {/* Tab & File Management Commands */}
          <div>
            <span className="text-[10px] text-[#71717a] uppercase tracking-wider font-semibold px-1.5 block mb-1">
              Tabs & File Management
            </span>
            <div className="space-y-1">
              <button
                onClick={() => {
                  setIsCommandPaletteOpen(false);
                  closeAllTabs();
                }}
                className="w-full p-2 rounded-lg bg-[#15151a] hover:bg-[#1c1c24] border border-[#202028] flex items-center justify-between text-left transition-all group"
              >
                <div className="flex items-center space-x-2.5">
                  <XCircle className="w-3.5 h-3.5 text-[#fb7185]" />
                  <div>
                    <div className="font-medium text-[#fb7185] group-hover:text-white text-[11px]">
                      Close All Open Tabs
                    </div>
                    <span className="text-[10px] text-[#71717a]">
                      Removes all open temporary editor files and tabs.
                    </span>
                  </div>
                </div>
                <ArrowRight className="w-3 h-3 text-[#52525b] group-hover:text-white" />
              </button>

              <button
                onClick={() => {
                  setIsCommandPaletteOpen(false);
                  if (activeFile) closeOtherTabs(activeFile.path);
                }}
                className="w-full p-2 rounded-lg bg-[#15151a] hover:bg-[#1c1c24] border border-[#202028] flex items-center justify-between text-left transition-all group"
              >
                <div className="flex items-center space-x-2.5">
                  <X className="w-3.5 h-3.5 text-[#818cf8]" />
                  <div>
                    <div className="font-medium text-[#ededee] group-hover:text-white text-[11px]">
                      Close Other Tabs
                    </div>
                    <span className="text-[10px] text-[#71717a]">
                      Keeps only the current active file tab.
                    </span>
                  </div>
                </div>
                <ArrowRight className="w-3 h-3 text-[#52525b] group-hover:text-white" />
              </button>

              <button
                onClick={() => {
                  setIsCommandPaletteOpen(false);
                  closeSavedTabs();
                }}
                className="w-full p-2 rounded-lg bg-[#15151a] hover:bg-[#1c1c24] border border-[#202028] flex items-center justify-between text-left transition-all group"
              >
                <div className="flex items-center space-x-2.5">
                  <RotateCcw className="w-3.5 h-3.5 text-[#a1a1aa]" />
                  <div>
                    <div className="font-medium text-[#ededee] group-hover:text-white text-[11px]">
                      Close Saved / Unmodified Tabs
                    </div>
                    <span className="text-[10px] text-[#71717a]">
                      Closes tabs that do not have unsaved edits.
                    </span>
                  </div>
                </div>
                <ArrowRight className="w-3 h-3 text-[#52525b] group-hover:text-white" />
              </button>

              <button
                onClick={() => {
                  setIsCommandPaletteOpen(false);
                  revertAllFiles();
                }}
                className="w-full p-2 rounded-lg bg-[#15151a] hover:bg-[#1c1c24] border border-[#202028] flex items-center justify-between text-left transition-all group"
              >
                <div className="flex items-center space-x-2.5">
                  <RotateCcw className="w-3.5 h-3.5 text-[#fbbf24]" />
                  <div>
                    <div className="font-medium text-[#fbbf24] group-hover:text-white text-[11px]">
                      Revert All Workspace Modifications
                    </div>
                    <span className="text-[10px] text-[#71717a]">
                      Discards all uncommitted edits across all files.
                    </span>
                  </div>
                </div>
                <ArrowRight className="w-3 h-3 text-[#52525b] group-hover:text-white" />
              </button>
            </div>
          </div>

          {/* Agent Commands */}
          <div>
            <span className="text-[10px] text-[#71717a] uppercase tracking-wider font-semibold px-1.5 block mb-1">
              Autonomous Agent Actions
            </span>

            <div className="space-y-1">
              <button
                onClick={() => handleQuickAction('coder', 'Implement category and tag search filtering in controller')}
                className="w-full p-2 rounded-lg bg-[#15151a] hover:bg-[#1c1c24] border border-[#202028] flex items-center justify-between text-left transition-all group"
              >
                <div className="flex items-center space-x-2.5">
                  <Code2 className="w-3.5 h-3.5 text-[#818cf8]" />
                  <div>
                    <div className="font-medium text-[#ededee] group-hover:text-white text-[11px]">
                      Coder: Note Search & Tags Feature
                    </div>
                    <span className="text-[10px] text-[#71717a]">
                      Updates schema, controller query params & validation.
                    </span>
                  </div>
                </div>
                <ArrowRight className="w-3 h-3 text-[#52525b] group-hover:text-white" />
              </button>

              <button
                onClick={() => handleQuickAction('reviewer', 'Audit code for clean MVC, DRY & OWASP compliance')}
                className="w-full p-2 rounded-lg bg-[#15151a] hover:bg-[#1c1c24] border border-[#202028] flex items-center justify-between text-left transition-all group"
              >
                <div className="flex items-center space-x-2.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#34d399]" />
                  <div>
                    <div className="font-medium text-[#ededee] group-hover:text-white text-[11px]">
                      Reviewer: Architecture & Clean Code Audit
                    </div>
                    <span className="text-[10px] text-[#71717a]">
                      Evaluates MVC adherence and generates quality scorecard.
                    </span>
                  </div>
                </div>
                <ArrowRight className="w-3 h-3 text-[#52525b] group-hover:text-white" />
              </button>

              <button
                onClick={() => handleQuickAction('bughunter', 'Detect logic flaws, type crashes & auto-patch')}
                className="w-full p-2 rounded-lg bg-[#15151a] hover:bg-[#1c1c24] border border-[#202028] flex items-center justify-between text-left transition-all group"
              >
                <div className="flex items-center space-x-2.5">
                  <Bug className="w-3.5 h-3.5 text-[#fbbf24]" />
                  <div>
                    <div className="font-medium text-[#ededee] group-hover:text-white text-[11px]">
                      Bug Hunter: Scan for Errors & Apply Patches
                    </div>
                    <span className="text-[10px] text-[#71717a]">
                      Patches unhandled exceptions and ReDoS vulnerabilities.
                    </span>
                  </div>
                </div>
                <ArrowRight className="w-3 h-3 text-[#52525b] group-hover:text-white" />
              </button>

              <button
                onClick={() => handleQuickAction('gitmanager', 'Stage modified files, commit and create PR')}
                className="w-full p-2 rounded-lg bg-[#15151a] hover:bg-[#1c1c24] border border-[#202028] flex items-center justify-between text-left transition-all group"
              >
                <div className="flex items-center space-x-2.5">
                  <GitPullRequest className="w-3.5 h-3.5 text-[#f472b6]" />
                  <div>
                    <div className="font-medium text-[#ededee] group-hover:text-white text-[11px]">
                      Git Manager: Stage, Commit & GitHub PR
                    </div>
                    <span className="text-[10px] text-[#71717a]">
                      Stages changes, creates conventional commit, and opens PR.
                    </span>
                  </div>
                </div>
                <ArrowRight className="w-3 h-3 text-[#52525b] group-hover:text-white" />
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-3 py-2 border-t border-[#1e1e24] bg-[#0d0d0f] flex items-center justify-between text-[10px] text-[#52525b] font-mono">
          <span>Press Enter ↵ to Run</span>
          <span>Esc to Close</span>
        </div>
      </div>
    </div>
  );
};

