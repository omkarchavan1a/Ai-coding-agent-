import React from 'react';
import { useIDE } from '../context/IDEContext';
import { 
  Files, 
  Bot, 
  ShieldCheck, 
  Bug, 
  GitPullRequest, 
  Settings, 
  Key,
  Sparkles
} from 'lucide-react';

export const CursorActivityBar: React.FC = () => {
  const {
    activeSidebarTab,
    setActiveSidebarTab,
    isSidebarOpen,
    setIsSidebarOpen,
    isAnyAgentRunning,
    bugs,
    reviews,
    stagedFiles,
    unstagedFiles,
    byok,
    setIsByokModalOpen
  } = useIDE();

  const totalModifications = stagedFiles.length + unstagedFiles.length;
  const unfixedBugs = bugs.filter(b => !b.isFixed).length;

  const handleTabClick = (tab: 'explorer' | 'agents' | 'review' | 'bugs' | 'git' | 'settings') => {
    if (activeSidebarTab === tab && isSidebarOpen) {
      setIsSidebarOpen(false);
    } else {
      setActiveSidebarTab(tab);
      setIsSidebarOpen(true);
    }
  };

  return (
    <aside className="w-11 bg-[#0d0d0f] border-r border-[#1e1e24] flex flex-col items-center justify-between py-2 z-20 select-none">
      {/* Top Icons: Core IDE Activities */}
      <div className="flex flex-col items-center space-y-1 w-full">
        {/* Explorer */}
        <button
          onClick={() => handleTabClick('explorer')}
          className={`relative p-2 rounded-md transition-all ${
            activeSidebarTab === 'explorer' && isSidebarOpen
              ? 'text-white bg-[#1a1a22]'
              : 'text-[#71717a] hover:text-[#d4d4d8] hover:bg-[#141418]'
          }`}
          title="File Explorer"
        >
          <Files className="w-4 h-4" />
          {activeSidebarTab === 'explorer' && isSidebarOpen && (
            <span className="absolute left-0 top-1.5 bottom-1.5 w-0.5 bg-white rounded-r" />
          )}
        </button>

        {/* 4-Agent Orchestrator (Cursor Composer / Agents) */}
        <button
          onClick={() => handleTabClick('agents')}
          className={`relative p-2 rounded-md transition-all ${
            activeSidebarTab === 'agents' && isSidebarOpen
              ? 'text-white bg-[#1a1a22]'
              : 'text-[#71717a] hover:text-[#d4d4d8] hover:bg-[#141418]'
          }`}
          title="4 Autonomous Agents (Coder, Reviewer, Bug Hunter, Git Manager)"
        >
          <Bot className={`w-4 h-4 ${isAnyAgentRunning ? 'text-[#818cf8]' : ''}`} />
          {isAnyAgentRunning ? (
            <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-[#6366f1] animate-ping" />
          ) : (
            <span className="absolute -top-0.5 -right-0.5 px-1 py-0.2 rounded-full bg-[#6366f1] text-[8px] font-bold text-white leading-none">
              4
            </span>
          )}
          {activeSidebarTab === 'agents' && isSidebarOpen && (
            <span className="absolute left-0 top-1.5 bottom-1.5 w-0.5 bg-[#818cf8] rounded-r" />
          )}
        </button>

        {/* Code Review & Architecture */}
        <button
          onClick={() => handleTabClick('review')}
          className={`relative p-2 rounded-md transition-all ${
            activeSidebarTab === 'review' && isSidebarOpen
              ? 'text-white bg-[#1a1a22]'
              : 'text-[#71717a] hover:text-[#d4d4d8] hover:bg-[#141418]'
          }`}
          title="Code Reviewer & Quality Scorecard"
        >
          <ShieldCheck className="w-4 h-4" />
          {reviews.length > 0 && (
            <span className="absolute top-1 right-1 w-1 h-1 rounded-full bg-[#10b981]" />
          )}
          {activeSidebarTab === 'review' && isSidebarOpen && (
            <span className="absolute left-0 top-1.5 bottom-1.5 w-0.5 bg-[#10b981] rounded-r" />
          )}
        </button>

        {/* Bug Hunter & Auto-Fixer */}
        <button
          onClick={() => handleTabClick('bugs')}
          className={`relative p-2 rounded-md transition-all ${
            activeSidebarTab === 'bugs' && isSidebarOpen
              ? 'text-white bg-[#1a1a22]'
              : 'text-[#71717a] hover:text-[#d4d4d8] hover:bg-[#141418]'
          }`}
          title="Bug Hunter & Self-Healing Auto-Fixer"
        >
          <Bug className="w-4 h-4" />
          {unfixedBugs > 0 && (
            <span className="absolute -top-0.5 -right-0.5 px-1 py-0.2 rounded-full bg-[#f59e0b] text-[8px] font-bold text-black leading-none">
              {unfixedBugs}
            </span>
          )}
          {activeSidebarTab === 'bugs' && isSidebarOpen && (
            <span className="absolute left-0 top-1.5 bottom-1.5 w-0.5 bg-[#f59e0b] rounded-r" />
          )}
        </button>

        {/* Git & GitHub Manager */}
        <button
          onClick={() => handleTabClick('git')}
          className={`relative p-2 rounded-md transition-all ${
            activeSidebarTab === 'git' && isSidebarOpen
              ? 'text-white bg-[#1a1a22]'
              : 'text-[#71717a] hover:text-[#d4d4d8] hover:bg-[#141418]'
          }`}
          title="Git & GitHub Manager (Commit, Push, Pull, PRs)"
        >
          <GitPullRequest className="w-4 h-4" />
          {totalModifications > 0 && (
            <span className="absolute -top-0.5 -right-0.5 px-1 py-0.2 rounded-full bg-[#ec4899] text-[8px] font-bold text-white leading-none">
              {totalModifications}
            </span>
          )}
          {activeSidebarTab === 'git' && isSidebarOpen && (
            <span className="absolute left-0 top-1.5 bottom-1.5 w-0.5 bg-[#ec4899] rounded-r" />
          )}
        </button>
      </div>

      {/* Bottom Icons: BYOK & Settings */}
      <div className="flex flex-col items-center space-y-1 w-full">
        {/* BYOK Quick Config Button */}
        <button
          onClick={() => setIsByokModalOpen(true)}
          className={`p-2 rounded-md transition-all ${
            byok.isKeyVerified ? 'text-[#34d399] hover:bg-[#141418]' : 'text-[#f59e0b] hover:bg-[#141418]'
          }`}
          title={byok.isKeyVerified ? 'BYOK: Key Active & Verified' : 'BYOK: Configure API Key'}
        >
          <Key className="w-4 h-4" />
        </button>

        {/* Settings Tab */}
        <button
          onClick={() => handleTabClick('settings')}
          className={`relative p-2 rounded-md transition-all ${
            activeSidebarTab === 'settings' && isSidebarOpen
              ? 'text-white bg-[#1a1a22]'
              : 'text-[#71717a] hover:text-[#d4d4d8] hover:bg-[#141418]'
          }`}
          title="Cursor & AI Agent Settings"
        >
          <Settings className="w-4 h-4" />
          {activeSidebarTab === 'settings' && isSidebarOpen && (
            <span className="absolute left-0 top-1.5 bottom-1.5 w-0.5 bg-white rounded-r" />
          )}
        </button>
      </div>
    </aside>
  );
};
