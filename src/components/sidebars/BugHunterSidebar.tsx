import React, { useState } from 'react';
import { useIDE } from '../../context/IDEContext';
import { 
  Bug, 
  Wrench, 
  CheckCircle2, 
  Play, 
  FileCode, 
  ArrowRight,
  AlertCircle,
  Zap
} from 'lucide-react';
import { BugSeverity } from '../../types';

export const BugHunterSidebar: React.FC = () => {
  const {
    bugs,
    applyBugFix,
    fixAllBugs,
    openFileInTab,
    runSingleAgent,
    isAnyAgentRunning
  } = useIDE();

  const [activeFilter, setActiveFilter] = useState<'all' | 'unfixed' | 'fixed'>('all');
  const [expandedBugId, setExpandedBugId] = useState<string | null>(bugs[0]?.id || null);

  const unfixedCount = bugs.filter(b => !b.isFixed).length;
  const fixedCount = bugs.filter(b => b.isFixed).length;

  const filteredBugs = bugs.filter(b => {
    if (activeFilter === 'unfixed') return !b.isFixed;
    if (activeFilter === 'fixed') return b.isFixed;
    return true;
  });

  const getSeverityBadge = (sev: BugSeverity) => {
    switch (sev) {
      case 'critical':
        return <span className="px-1.5 py-0.2 rounded bg-[#f43f5e]/10 text-[#fb7185] text-[9px] font-mono font-bold">CRITICAL</span>;
      case 'high':
        return <span className="px-1.5 py-0.2 rounded bg-[#f59e0b]/10 text-[#fbbf24] text-[9px] font-mono font-bold">HIGH</span>;
      case 'medium':
        return <span className="px-1.5 py-0.2 rounded bg-[#eab308]/10 text-[#fde047] text-[9px] font-mono font-bold">MEDIUM</span>;
      case 'low':
        return <span className="px-1.5 py-0.2 rounded bg-[#71717a]/10 text-[#a1a1aa] text-[9px] font-mono font-bold">LOW</span>;
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#111114] text-xs text-[#a1a1aa] select-none overflow-hidden">
      {/* Header */}
      <div className="h-9 px-3 border-b border-[#1e1e24] flex items-center justify-between font-medium text-[#71717a] text-[11px]">
        <div className="flex items-center space-x-1.5 text-[#ededee]">
          <Bug className="w-3.5 h-3.5 text-[#fbbf24]" />
          <span className="font-semibold text-xs">Bug Hunter</span>
        </div>
        <button
          onClick={() => runSingleAgent('bughunter')}
          disabled={isAnyAgentRunning}
          className="text-[#fbbf24] hover:text-amber-300 text-[10px] font-medium flex items-center space-x-1 disabled:opacity-50"
        >
          <Play className="w-2 h-2 fill-current" />
          <span>Scan</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {/* Banner */}
        <div className="bg-[#15151a] border border-[#202028] rounded-lg p-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-medium text-[#ededee] text-[11px] flex items-center space-x-1.5">
              <Zap className="w-3 h-3 text-[#fbbf24]" />
              <span>Self-Healing Engine</span>
            </span>
            <span className="text-[10px] text-[#71717a] font-mono">
              {unfixedCount === 0 ? 'All Patched' : `${unfixedCount} Open`}
            </span>
          </div>

          <p className="text-[10px] text-[#a1a1aa] leading-relaxed">
            Detects unhandled exceptions, query injection vectors, and ReDoS expressions.
          </p>

          {unfixedCount > 0 ? (
            <button
              onClick={fixAllBugs}
              className="w-full py-1.5 bg-[#d97706] hover:bg-[#b45309] text-white font-medium rounded text-[11px] flex items-center justify-center space-x-1.5 transition-all"
            >
              <Wrench className="w-3 h-3" />
              <span>Auto-Fix All ({unfixedCount}) Issues</span>
            </button>
          ) : (
            <div className="py-1.5 bg-[#10b981]/10 border border-[#10b981]/20 rounded text-[#34d399] font-medium text-center flex items-center justify-center space-x-1.5 text-[11px]">
              <CheckCircle2 className="w-3 h-3" />
              <span>Codebase Clean</span>
            </div>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="flex bg-[#15151a] border border-[#202028] rounded p-0.5 text-[10px]">
          <button
            onClick={() => setActiveFilter('all')}
            className={`flex-1 py-0.5 rounded text-center transition-all ${
              activeFilter === 'all' ? 'bg-[#22222b] text-white font-medium' : 'text-[#71717a] hover:text-white'
            }`}
          >
            All ({bugs.length})
          </button>
          <button
            onClick={() => setActiveFilter('unfixed')}
            className={`flex-1 py-0.5 rounded text-center transition-all ${
              activeFilter === 'unfixed' ? 'bg-[#22222b] text-[#fbbf24] font-medium' : 'text-[#71717a] hover:text-white'
            }`}
          >
            Open ({unfixedCount})
          </button>
          <button
            onClick={() => setActiveFilter('fixed')}
            className={`flex-1 py-0.5 rounded text-center transition-all ${
              activeFilter === 'fixed' ? 'bg-[#22222b] text-[#34d399] font-medium' : 'text-[#71717a] hover:text-white'
            }`}
          >
            Fixed ({fixedCount})
          </button>
        </div>

        {/* Bugs List */}
        <div className="space-y-2">
          {filteredBugs.map((bug) => {
            const isExpanded = expandedBugId === bug.id;

            return (
              <div
                key={bug.id}
                className={`bg-[#15151a] border rounded-lg p-2.5 transition-all ${
                  bug.isFixed
                    ? 'border-[#10b981]/20'
                    : 'border-[#202028] hover:border-[#2f2f3c]'
                }`}
              >
                <div
                  onClick={() => setExpandedBugId(isExpanded ? null : bug.id)}
                  className="cursor-pointer"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      {bug.isFixed ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#34d399] flex-shrink-0" />
                      ) : (
                        <AlertCircle className="w-3.5 h-3.5 text-[#fb7185] flex-shrink-0" />
                      )}
                      <span className="font-medium text-[#ededee] text-[11px] leading-snug">
                        {bug.title}
                      </span>
                    </div>
                    {getSeverityBadge(bug.severity)}
                  </div>

                  <div className="flex items-center space-x-2 mt-1 text-[10px] font-mono text-[#71717a]">
                    <FileCode className="w-3 h-3 text-[#818cf8]" />
                    <span className="truncate">{bug.file}</span>
                    <span className="text-[#52525b]">:L{bug.line}</span>
                  </div>
                </div>

                {isExpanded && (
                  <div className="mt-2 pt-2 border-t border-[#1e1e26] space-y-2">
                    <p className="text-[10px] text-[#a1a1aa] leading-relaxed">
                      {bug.description}
                    </p>

                    <div className="bg-[#101014] border border-[#1e1e26] rounded p-2 space-y-1">
                      <span className="text-[9px] text-[#818cf8] font-semibold block">Patch:</span>
                      <pre className="font-mono text-[10px] text-[#d4d4d8] overflow-x-auto p-1 bg-[#0d0d0f] rounded">
                        {bug.patchCode || bug.suggestedFix}
                      </pre>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <button
                        onClick={() => openFileInTab(bug.file)}
                        className="text-[#71717a] hover:text-white text-[10px] flex items-center space-x-1"
                      >
                        <span>Open File</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>

                      {!bug.isFixed ? (
                        <button
                          onClick={() => applyBugFix(bug.id)}
                          className="px-2 py-0.5 bg-[#d97706] hover:bg-[#b45309] text-white font-medium rounded text-[10px] flex items-center space-x-1 transition-all"
                        >
                          <Wrench className="w-3 h-3" />
                          <span>Apply Patch</span>
                        </button>
                      ) : (
                        <span className="text-[10px] text-[#34d399] font-medium flex items-center space-x-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Patched</span>
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
