import React, { useState } from 'react';
import { useIDE } from '../../context/IDEContext';
import { 
  GitPullRequest, 
  GitBranch, 
  GitCommit as GitCommitIcon, 
  Plus, 
  Minus, 
  Check, 
  Sparkles, 
  ArrowUpCircle, 
  ArrowDownCircle, 
  ExternalLink,
  ChevronDown
} from 'lucide-react';

export const GitManagerSidebar: React.FC = () => {
  const {
    gitCommits,
    gitBranches,
    currentBranch,
    stagedFiles,
    unstagedFiles,
    stageFile,
    unstageFile,
    stageAllFiles,
    unstageAllFiles,
    createCommit,
    pushToRemote,
    pullFromRemote,
    switchBranch,
    createBranch,
    setIsPRModalOpen,
    openFileInTab
  } = useIDE();

  const [commitMessage, setCommitMessage] = useState('feat(notes): implement tags and multi-field search engine');
  const [isCreatingBranch, setIsCreatingBranch] = useState(false);
  const [newBranchInput, setNewBranchInput] = useState('');
  const [isBranchDropdownOpen, setIsBranchDropdownOpen] = useState(false);

  const handleGenerateAICommit = () => {
    const suggestions = [
      'feat(notes): implement category tags and multi-field search engine',
      'refactor(controller): add ReDoS regex sanitization and query builders',
      'test(notes): add unit tests for tag parsing and schema validation',
      'chore(git): stage and prepare v1.2 release pull request'
    ];
    const chosen = suggestions[Math.floor(Math.random() * suggestions.length)];
    setCommitMessage(chosen);
  };

  const handleCommitSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commitMessage.trim()) return;
    createCommit(commitMessage);
    setCommitMessage('');
  };

  const handleBranchCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBranchInput.trim()) return;
    createBranch(newBranchInput);
    setNewBranchInput('');
    setIsCreatingBranch(false);
  };

  return (
    <div className="h-full flex flex-col bg-[#111114] text-xs text-[#a1a1aa] select-none overflow-hidden">
      {/* Header */}
      <div className="h-9 px-3 border-b border-[#1e1e24] flex items-center justify-between font-medium text-[#71717a] text-[11px]">
        <div className="flex items-center space-x-1.5 text-[#ededee]">
          <GitPullRequest className="w-3.5 h-3.5 text-[#f472b6]" />
          <span className="font-semibold text-xs">Git & GitHub</span>
        </div>
        <div className="flex items-center space-x-1">
          <button
            onClick={() => pullFromRemote()}
            className="p-1 rounded hover:bg-[#1c1c24] text-[#71717a] hover:text-white"
            title="git pull"
          >
            <ArrowDownCircle className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => pushToRemote()}
            className="p-1 rounded hover:bg-[#1c1c24] text-[#71717a] hover:text-[#34d399]"
            title="git push"
          >
            <ArrowUpCircle className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {/* Branch Selector Card */}
        <div className="bg-[#15151a] border border-[#202028] rounded-lg p-2.5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-[#71717a] font-semibold uppercase tracking-wider">Branch</span>
            <button
              onClick={() => setIsCreatingBranch(!isCreatingBranch)}
              className="text-[#f472b6] hover:text-pink-300 text-[10px] flex items-center space-x-1"
            >
              <Plus className="w-3 h-3" />
              <span>New</span>
            </button>
          </div>

          <div className="relative">
            <button
              onClick={() => setIsBranchDropdownOpen(!isBranchDropdownOpen)}
              className="w-full bg-[#101014] border border-[#202028] hover:border-[#2f2f3c] rounded px-2.5 py-1 flex items-center justify-between text-[#ededee] text-xs font-mono"
            >
              <div className="flex items-center space-x-2 truncate">
                <GitBranch className="w-3 h-3 text-[#f472b6]" />
                <span className="truncate text-[11px]">{currentBranch}</span>
              </div>
              <ChevronDown className="w-3 h-3 text-[#52525b]" />
            </button>

            {isBranchDropdownOpen && (
              <div className="absolute left-0 right-0 top-full mt-1 bg-[#16161c] border border-[#262632] rounded shadow-xl z-20 py-1 font-mono text-xs">
                {gitBranches.map(b => (
                  <button
                    key={b.name}
                    onClick={() => {
                      switchBranch(b.name);
                      setIsBranchDropdownOpen(false);
                    }}
                    className={`w-full px-2.5 py-1 text-left flex items-center justify-between hover:bg-[#1f1f28] ${
                      b.name === currentBranch ? 'text-[#f472b6] font-medium bg-[#1a1a22]' : 'text-[#a1a1aa]'
                    }`}
                  >
                    <span className="truncate text-[11px]">{b.name}</span>
                    {b.name === currentBranch && <Check className="w-3 h-3 text-[#f472b6]" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {isCreatingBranch && (
            <form onSubmit={handleBranchCreateSubmit} className="pt-1 flex items-center space-x-1">
              <input
                type="text"
                autoFocus
                value={newBranchInput}
                onChange={(e) => setNewBranchInput(e.target.value)}
                placeholder="branch-name"
                className="flex-1 bg-[#0d0d0f] border border-[#f472b6]/50 rounded px-2 py-0.5 text-xs text-white focus:outline-none"
              />
              <button type="submit" className="px-2 py-0.5 bg-[#db2777] text-white rounded text-[10px] font-medium">
                Add
              </button>
            </form>
          )}
        </div>

        {/* Commit Input Box */}
        <div className="bg-[#15151a] border border-[#202028] rounded-lg p-2.5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-[#71717a] font-semibold uppercase tracking-wider">Commit</span>
            <button
              onClick={handleGenerateAICommit}
              className="text-[#818cf8] hover:text-white text-[10px] flex items-center space-x-1"
              title="Auto-Generate AI Conventional Commit"
            >
              <Sparkles className="w-2.5 h-2.5" />
              <span>AI Message</span>
            </button>
          </div>

          <form onSubmit={handleCommitSubmit} className="space-y-2">
            <textarea
              value={commitMessage}
              onChange={(e) => setCommitMessage(e.target.value)}
              placeholder="feat: commit message..."
              rows={2}
              className="w-full bg-[#101014] border border-[#202028] focus:border-[#f472b6] rounded p-2 text-xs text-[#ededee] placeholder-[#52525b] focus:outline-none resize-none font-mono"
            />

            <div className="grid grid-cols-2 gap-1.5">
              <button
                type="submit"
                disabled={stagedFiles.length === 0 && !commitMessage}
                className="py-1.5 bg-[#db2777] hover:bg-[#be185d] disabled:opacity-50 text-white font-medium rounded flex items-center justify-center space-x-1 text-xs transition-all"
              >
                <GitCommitIcon className="w-3 h-3" />
                <span>Commit</span>
              </button>

              <button
                type="button"
                onClick={() => pushToRemote()}
                className="py-1.5 bg-[#1c1c24] hover:bg-[#252532] text-[#ededee] rounded flex items-center justify-center space-x-1 text-xs border border-[#282834] transition-all"
              >
                <ArrowUpCircle className="w-3 h-3 text-[#f472b6]" />
                <span>Push</span>
              </button>
            </div>
          </form>
        </div>

        {/* GitHub Pull Request CTA */}
        <button
          onClick={() => setIsPRModalOpen(true)}
          className="w-full py-2 bg-[#1c1c24] hover:bg-[#252532] border border-[#2e2e3e] text-[#ededee] hover:text-white font-medium rounded-lg flex items-center justify-center space-x-2 transition-all text-xs"
        >
          <GitPullRequest className="w-3.5 h-3.5 text-[#f472b6]" />
          <span>Create / View GitHub PR</span>
          <ExternalLink className="w-3 h-3 text-[#71717a]" />
        </button>

        {/* Staged Changes */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[10px] text-[#71717a] font-medium px-0.5">
            <span>Staged ({stagedFiles.length})</span>
            {stagedFiles.length > 0 && (
              <button
                onClick={unstageAllFiles}
                className="text-[9px] text-[#52525b] hover:text-[#a1a1aa]"
              >
                Unstage All
              </button>
            )}
          </div>

          <div className="bg-[#15151a] border border-[#202028] rounded divide-y divide-[#1b1b22] overflow-hidden">
            {stagedFiles.length === 0 ? (
              <div className="p-2 text-center text-[#52525b] text-[10px] italic">
                No staged changes
              </div>
            ) : (
              stagedFiles.map(path => (
                <div
                  key={path}
                  onClick={() => openFileInTab(path)}
                  className="px-2 py-1 flex items-center justify-between hover:bg-[#1a1a22] cursor-pointer group font-mono text-[11px]"
                >
                  <span className="truncate text-[#34d399]">{path}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      unstageFile(path);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-0.5 hover:text-[#fbbf24] text-[#52525b]"
                    title="Unstage"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Unstaged Changes */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[10px] text-[#71717a] font-medium px-0.5">
            <span>Changes ({unstagedFiles.length})</span>
            {unstagedFiles.length > 0 && (
              <button
                onClick={stageAllFiles}
                className="text-[9px] text-[#f472b6] hover:text-pink-300"
              >
                Stage All
              </button>
            )}
          </div>

          <div className="bg-[#15151a] border border-[#202028] rounded divide-y divide-[#1b1b22] overflow-hidden">
            {unstagedFiles.length === 0 ? (
              <div className="p-2 text-center text-[#52525b] text-[10px] italic">
                Working tree clean
              </div>
            ) : (
              unstagedFiles.map(path => (
                <div
                  key={path}
                  onClick={() => openFileInTab(path)}
                  className="px-2 py-1 flex items-center justify-between hover:bg-[#1a1a22] cursor-pointer group font-mono text-[11px]"
                >
                  <span className="truncate text-[#fbbf24]">{path}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      stageFile(path);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-0.5 hover:text-[#34d399] text-[#52525b]"
                    title="Stage"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Commit History */}
        <div className="space-y-1.5">
          <span className="text-[10px] text-[#71717a] font-semibold uppercase tracking-wider block px-0.5">
            History ({gitCommits.length})
          </span>

          <div className="space-y-1.5">
            {gitCommits.map(c => (
              <div key={c.id} className="bg-[#15151a] border border-[#202028] rounded p-2 space-y-0.5">
                <div className="flex items-center justify-between text-[9px]">
                  <span className="font-mono text-[#f472b6] bg-[#f472b6]/10 px-1 rounded">
                    {c.shortHash}
                  </span>
                  <span className="text-[#52525b]">{c.timestamp}</span>
                </div>
                <p className="text-[11px] text-[#ededee] font-medium leading-snug">
                  {c.message}
                </p>
                <div className="flex items-center justify-between text-[9px] text-[#52525b] pt-0.5">
                  <span>{c.author}</span>
                  <span>+{c.additions} -{c.deletions}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
