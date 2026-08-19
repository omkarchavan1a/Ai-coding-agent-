import React, { useState } from 'react';
import { useIDE } from '../../context/IDEContext';
import { 
  Bot, 
  Code2, 
  ShieldCheck, 
  Bug, 
  GitPullRequest, 
  Play, 
  Square, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  Terminal, 
  Activity,
  Layers,
  AtSign,
  Lock,
  Unlock,
  KeyRound
} from 'lucide-react';
import { AgentRole } from '../../types';

export const MultiAgentSidebar: React.FC = () => {
  const {
    agents,
    isAnyAgentRunning,
    orchestratorProgress,
    orchestratorThought,
    runAllAgents,
    runSingleAgent,
    stopAgents,
    passcodeConfig,
    openPasscodeModal,
    setActiveBottomTab,
    setIsBottomPanelOpen
  } = useIDE();

  const [customPrompt, setCustomPrompt] = useState('');
  const [selectedAgentId, setSelectedAgentId] = useState<AgentRole | null>(null);

  const quickPrompts = [
    { title: 'Add Category & Tags', prompt: 'Add Category tags and multi-field search query filtering to the notes app.' },
    { title: 'Audit Architecture & ReDoS', prompt: 'Audit all files for clean MVC, security flaws (ReDoS), and auto-patch bugs.' },
    { title: 'Generate Automated Tests', prompt: 'Create automated unit and integration tests with 100% assertions coverage.' },
    { title: 'Stage & Create GitHub PR', prompt: 'Stage all modified files, write semantic commit, and generate GitHub PR.' }
  ];

  const getAgentIcon = (id: AgentRole) => {
    switch (id) {
      case 'coder': return <Code2 className="w-3.5 h-3.5 text-[#818cf8]" />;
      case 'reviewer': return <ShieldCheck className="w-3.5 h-3.5 text-[#34d399]" />;
      case 'bughunter': return <Bug className="w-3.5 h-3.5 text-[#fbbf24]" />;
      case 'gitmanager': return <GitPullRequest className="w-3.5 h-3.5 text-[#f472b6]" />;
    }
  };

  const handleRunAll = (promptText?: string) => {
    runAllAgents(promptText || customPrompt);
    setIsBottomPanelOpen(true);
    setActiveBottomTab('console');
  };

  return (
    <div className="h-full flex flex-col bg-[#111114] text-xs text-[#a1a1aa] select-none overflow-hidden">
      {/* Header */}
      <div className="h-9 px-3 border-b border-[#1e1e24] flex items-center justify-between font-medium text-[#71717a] text-[11px]">
        <div className="flex items-center space-x-1.5 text-[#ededee]">
          <Bot className="w-3.5 h-3.5 text-[#818cf8]" />
          <span className="font-semibold text-xs">4 Agents Composer</span>
        </div>
        <span className="px-1.5 py-0.2 rounded bg-[#1c1c24] border border-[#272732] text-[#818cf8] font-mono text-[9px]">
          Parallel
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {/* Main Composer Box (Cursor Style) */}
        <div className="bg-[#16161b] border border-[#22222a] rounded-lg p-2.5 space-y-2">
          {/* Top pills */}
          <div className="flex items-center justify-between text-[10px]">
            <div className="flex items-center space-x-1.5">
              <span className="px-1.5 py-0.5 rounded bg-[#1f1f28] text-[#d4d4d8] font-mono flex items-center space-x-1">
                <AtSign className="w-2.5 h-2.5 text-[#818cf8]" />
                <span>Codebase</span>
              </span>
              <span className="px-1.5 py-0.5 rounded bg-[#1f1f28] text-[#818cf8] font-mono">
                4 Agents
              </span>
            </div>
            <button
              onClick={() => {
                if (!passcodeConfig?.isUnlocked) {
                  openPasscodeModal('authorize');
                } else {
                  openPasscodeModal('security_info');
                }
              }}
              className={`font-mono text-[9px] px-2 py-0.5 rounded border flex items-center space-x-1 transition-colors ${
                passcodeConfig?.isUnlocked
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20'
                  : 'bg-amber-500/10 text-amber-300 border-amber-500/30 hover:bg-amber-500/20 animate-pulse'
              }`}
            >
              {passcodeConfig?.isUnlocked ? (
                <>
                  <ShieldCheck className="w-2.5 h-2.5" />
                  <span>Passcode Verified</span>
                </>
              ) : (
                <>
                  <Lock className="w-2.5 h-2.5" />
                  <span>Passcode Required</span>
                </>
              )}
            </button>
          </div>

          {/* Locked Notice Alert Banner */}
          {!passcodeConfig?.isUnlocked && (
            <div className="bg-[#241814] border border-amber-500/30 rounded p-2 flex items-center justify-between text-[11px] text-amber-200">
              <div className="flex items-center space-x-1.5 truncate">
                <Lock className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                <span className="truncate">Passcode required to start AI agents</span>
              </div>
              <button
                onClick={() => openPasscodeModal('authorize')}
                className="px-2 py-0.5 bg-amber-500 hover:bg-amber-400 text-black font-semibold rounded text-[10px] ml-1 flex-shrink-0 transition-colors cursor-pointer"
              >
                Unlock
              </button>
            </div>
          )}

          <textarea
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            placeholder="Instruct the 4 agents (e.g., 'Add multi-field search and tags, audit architecture, fix bugs, and commit')..."
            rows={3}
            className="w-full bg-transparent border-0 focus:ring-0 p-0 text-xs text-[#ededee] placeholder-[#52525b] focus:outline-none resize-none"
          />

          {/* Quick Prompts Chips */}
          <div className="pt-1 border-t border-[#1e1e26] space-y-1">
            <div className="flex flex-wrap gap-1">
              {quickPrompts.map((qp, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setCustomPrompt(qp.prompt);
                    handleRunAll(qp.prompt);
                  }}
                  className="px-2 py-0.5 bg-[#1a1a22] hover:bg-[#22222c] border border-[#262632] rounded text-[10px] text-[#a1a1aa] hover:text-[#ededee] transition-all text-left truncate max-w-full"
                >
                  {qp.title}
                </button>
              ))}
            </div>
          </div>

          {/* Run Action */}
          <div className="pt-1 flex items-center justify-between">
            <span className="text-[10px] text-[#52525b] font-mono">Press ⌘K or click Run</span>

            {isAnyAgentRunning ? (
              <button
                onClick={stopAgents}
                className="px-3 py-1 bg-[#dc2626] hover:bg-[#b91c1c] text-white font-medium rounded text-[11px] flex items-center space-x-1.5 transition-all"
              >
                <Square className="w-3 h-3 fill-current" />
                <span>Stop</span>
              </button>
            ) : (
              <button
                onClick={() => handleRunAll()}
                className={`px-3 py-1 text-white font-medium rounded text-[11px] flex items-center space-x-1.5 transition-all shadow-xs ${
                  !passcodeConfig?.isUnlocked
                    ? 'bg-amber-600 hover:bg-amber-500'
                    : 'bg-[#6366f1] hover:bg-[#4f46e5]'
                }`}
              >
                {!passcodeConfig?.isUnlocked ? (
                  <>
                    <Lock className="w-3 h-3 text-amber-200" />
                    <span>Authorize & Run</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3 h-3 text-[#c7d2fe]" />
                    <span>Run 4 Agents</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Live Execution Progress Bar */}
        {isAnyAgentRunning && (
          <div className="bg-[#16161c] border border-[#2a2a38] rounded-lg p-2.5 space-y-1.5">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-[#818cf8] font-medium flex items-center space-x-1.5">
                <Activity className="w-3 h-3 animate-spin" />
                <span>Orchestrating 4 Agents</span>
              </span>
              <span className="font-mono text-[#ededee]">{orchestratorProgress}%</span>
            </div>
            <div className="w-full h-1 bg-[#1a1a22] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#6366f1] transition-all duration-300"
                style={{ width: `${orchestratorProgress}%` }}
              />
            </div>
            <p className="text-[10px] text-[#71717a] italic truncate">{orchestratorThought}</p>
          </div>
        )}

        {/* The 4 Agent Cards */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[10px] font-semibold text-[#71717a] uppercase tracking-wider px-0.5">
            <span>Specialized Agents</span>
            <span className="text-[#10b981] font-mono text-[9px]">4 Ready</span>
          </div>

          {agents.map((agent, index) => {
            return (
              <div
                key={agent.id}
                className={`bg-[#15151a] border rounded-lg p-2.5 transition-all ${
                  agent.status === 'running'
                    ? 'border-[#6366f1]/60 bg-[#171722]'
                    : 'border-[#202028] hover:border-[#2b2b36]'
                }`}
              >
                {/* Agent Card Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="p-1 rounded bg-[#1c1c24] border border-[#272732]">
                      {getAgentIcon(agent.id)}
                    </div>
                    <div>
                      <div className="flex items-center space-x-1.5">
                        <span className="font-medium text-[#ededee] text-[11px]">{agent.name}</span>
                        <span className="text-[9px] text-[#52525b] font-mono">#{index + 1}</span>
                      </div>
                      <span className="text-[9px] text-[#71717a] block leading-tight">
                        {agent.shortTitle}
                      </span>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <span
                    className={`text-[9px] px-1.5 py-0.2 rounded font-mono font-medium ${
                      agent.status === 'running'
                        ? 'bg-[#f59e0b]/10 text-[#fbbf24] border border-[#f59e0b]/20'
                        : agent.status === 'completed'
                        ? 'bg-[#10b981]/10 text-[#34d399] border border-[#10b981]/20'
                        : 'bg-[#1a1a22] text-[#71717a]'
                    }`}
                  >
                    {agent.status.toUpperCase()}
                  </span>
                </div>

                {/* Agent Description */}
                <p className="text-[10px] text-[#a1a1aa] mt-1.5 leading-relaxed">
                  {agent.roleDescription}
                </p>

                {/* Progress if running */}
                {agent.status === 'running' && (
                  <div className="mt-2 space-y-1 bg-[#101014] p-1.5 rounded border border-[#252534]">
                    <div className="flex items-center justify-between text-[9px] text-[#818cf8]">
                      <span className="truncate">{agent.currentAction}</span>
                      <span className="font-mono">{agent.progress}%</span>
                    </div>
                    <div className="w-full h-0.5 bg-[#1e1e28] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#818cf8] transition-all duration-200"
                        style={{ width: `${agent.progress}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Metrics & Individual Trigger */}
                <div className="mt-2 pt-1.5 border-t border-[#1e1e26] flex items-center justify-between text-[10px]">
                  <div className="text-[#71717a] font-mono text-[9px]">
                    {agent.id === 'coder' && <span>+{agent.stats.linesGenerated || 142} lines</span>}
                    {agent.id === 'reviewer' && <span className="text-[#34d399]">94/100 Quality</span>}
                    {agent.id === 'bughunter' && <span>{agent.stats.bugsPatched || 2} patched</span>}
                    {agent.id === 'gitmanager' && <span>{agent.stats.commitsPushed || 6} commits</span>}
                  </div>

                  <button
                    onClick={() => runSingleAgent(agent.id, customPrompt)}
                    disabled={isAnyAgentRunning}
                    className="px-2 py-0.5 rounded bg-[#1c1c24] hover:bg-[#252532] text-[#d4d4d8] hover:text-white transition-all text-[9px] font-medium flex items-center space-x-1 border border-[#282834] disabled:opacity-50"
                  >
                    <Play className="w-2 h-2 text-[#818cf8] fill-current" />
                    <span>Run</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Passcode Security status */}
      <div className="p-2 border-t border-[#1e1e24] bg-[#0e0e11] flex items-center justify-between text-[10px]">
        <div className="flex items-center space-x-1.5 truncate text-[#71717a]">
          <span className={`w-1.5 h-1.5 rounded-full ${passcodeConfig?.isUnlocked ? 'bg-[#10b981]' : 'bg-amber-400'}`} />
          <span className="truncate">
            {passcodeConfig?.isUnlocked ? 'Security: PIN Authorized' : 'Security: PIN Locked'}
          </span>
        </div>
        <button
          onClick={() => {
            if (!passcodeConfig?.isUnlocked) {
              openPasscodeModal('authorize');
            } else {
              openPasscodeModal('security_info');
            }
          }}
          className="text-[#818cf8] hover:text-white font-medium text-[10px] ml-2 cursor-pointer"
        >
          {passcodeConfig?.isUnlocked ? 'Crypto' : 'Unlock'}
        </button>
      </div>
    </div>
  );
};
