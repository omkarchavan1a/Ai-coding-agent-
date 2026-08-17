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
  LogOut
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
    openExportProjectModal,
    logout,
    user
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

          {/* Account / Sign Out */}
          {user && (
            <div>
              <span className="text-[10px] text-[#71717a] uppercase tracking-wider font-semibold px-1.5 block mb-1">
                Account
              </span>
              <button
                onClick={async () => {
                  setIsCommandPaletteOpen(false);
                  await logout();
                }}
                className="w-full p-2 rounded-lg bg-[#15151a] hover:bg-[#f43f5e]/15 border border-[#202028] hover:border-[#f43f5e]/30 flex items-center justify-between text-left transition-all group"
              >
                <div className="flex items-center space-x-2.5">
                  <LogOut className="w-3.5 h-3.5 text-[#fb7185]" />
                  <div>
                    <div className="font-medium text-[#fb7185] text-[11px]">
                      Sign Out ({user.email})
                    </div>
                    <span className="text-[10px] text-[#71717a]">
                      Clears local developer session and credentials.
                    </span>
                  </div>
                </div>
                <ArrowRight className="w-3 h-3 text-[#fb7185]" />
              </button>
            </div>
          )}
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

