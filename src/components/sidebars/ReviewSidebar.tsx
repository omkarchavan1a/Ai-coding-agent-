import React from 'react';
import { useIDE } from '../../context/IDEContext';
import { 
  ShieldCheck, 
  CheckCircle, 
  AlertTriangle, 
  Info, 
  ThumbsUp, 
  Play,
  FileCode
} from 'lucide-react';

export const ReviewSidebar: React.FC = () => {
  const {
    scorecard,
    reviews,
    openFileInTab,
    runSingleAgent,
    isAnyAgentRunning
  } = useIDE();

  const getLevelBadge = (level: string) => {
    switch (level) {
      case 'kudos':
        return (
          <span className="px-1.5 py-0.2 rounded bg-[#10b981]/10 text-[#34d399] text-[9px] font-medium flex items-center space-x-1">
            <ThumbsUp className="w-2.5 h-2.5" />
            <span>Kudos</span>
          </span>
        );
      case 'warning':
        return (
          <span className="px-1.5 py-0.2 rounded bg-[#f59e0b]/10 text-[#fbbf24] text-[9px] font-medium flex items-center space-x-1">
            <AlertTriangle className="w-2.5 h-2.5" />
            <span>Improvement</span>
          </span>
        );
      default:
        return (
          <span className="px-1.5 py-0.2 rounded bg-[#38bdf8]/10 text-[#38bdf8] text-[9px] font-medium flex items-center space-x-1">
            <Info className="w-2.5 h-2.5" />
            <span>Note</span>
          </span>
        );
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#111114] text-xs text-[#a1a1aa] select-none overflow-hidden">
      {/* Header */}
      <div className="h-9 px-3 border-b border-[#1e1e24] flex items-center justify-between font-medium text-[#71717a] text-[11px]">
        <div className="flex items-center space-x-1.5 text-[#ededee]">
          <ShieldCheck className="w-3.5 h-3.5 text-[#34d399]" />
          <span className="font-semibold text-xs">Code Reviewer</span>
        </div>
        <button
          onClick={() => runSingleAgent('reviewer')}
          disabled={isAnyAgentRunning}
          className="text-[#34d399] hover:text-emerald-300 text-[10px] font-medium flex items-center space-x-1 disabled:opacity-50"
        >
          <Play className="w-2 h-2 fill-current" />
          <span>Audit</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {/* Scorecard Summary */}
        <div className="bg-[#15151a] border border-[#202028] rounded-lg p-3 space-y-2.5">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] text-[#71717a] uppercase tracking-wider font-semibold block">Rating</span>
              <div className="flex items-baseline space-x-1">
                <span className="text-xl font-bold text-white">{scorecard.overallScore}</span>
                <span className="text-[#52525b] text-xs">/ 100</span>
              </div>
            </div>
            <div className="px-2 py-0.5 rounded bg-[#10b981]/10 border border-[#10b981]/20 text-[#34d399] font-mono text-[10px] font-semibold">
              GRADE A+
            </div>
          </div>

          {/* Sub Score Bars */}
          <div className="space-y-1.5 pt-1">
            <div>
              <div className="flex justify-between text-[10px] text-[#71717a] mb-0.5">
                <span>Clean Architecture</span>
                <span className="font-mono text-[#d4d4d8]">{scorecard.cleanlinessScore}%</span>
              </div>
              <div className="w-full h-1 bg-[#1c1c24] rounded-full overflow-hidden">
                <div className="h-full bg-[#34d399]" style={{ width: `${scorecard.cleanlinessScore}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[10px] text-[#71717a] mb-0.5">
                <span>Security & Sanitization</span>
                <span className="font-mono text-[#d4d4d8]">{scorecard.securityScore}%</span>
              </div>
              <div className="w-full h-1 bg-[#1c1c24] rounded-full overflow-hidden">
                <div className="h-full bg-[#818cf8]" style={{ width: `${scorecard.securityScore}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[10px] text-[#71717a] mb-0.5">
                <span>Query Performance</span>
                <span className="font-mono text-[#d4d4d8]">{scorecard.performanceScore}%</span>
              </div>
              <div className="w-full h-1 bg-[#1c1c24] rounded-full overflow-hidden">
                <div className="h-full bg-[#38bdf8]" style={{ width: `${scorecard.performanceScore}%` }} />
              </div>
            </div>
          </div>

          <p className="text-[11px] text-[#a1a1aa] leading-relaxed pt-1.5 border-t border-[#1e1e26]">
            {scorecard.summary}
          </p>
        </div>

        {/* Annotations */}
        <div className="space-y-2">
          <div className="text-[10px] font-semibold text-[#71717a] uppercase tracking-wider px-0.5">
            Annotations ({reviews.length})
          </div>

          {reviews.map((rev) => (
            <div
              key={rev.id}
              onClick={() => openFileInTab(rev.file)}
              className="bg-[#15151a] border border-[#202028] hover:border-[#2f2f3c] rounded-lg p-2.5 space-y-1.5 cursor-pointer transition-all group"
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-[#ededee] text-[11px] group-hover:text-white transition-colors">
                  {rev.title}
                </span>
                {getLevelBadge(rev.level)}
              </div>

              <div className="flex items-center space-x-1.5 text-[10px] font-mono text-[#71717a]">
                <FileCode className="w-3 h-3 text-[#818cf8]" />
                <span className="truncate">{rev.file}</span>
                <span className="text-[#52525b]">:L{rev.line}</span>
              </div>

              <p className="text-[10px] text-[#a1a1aa] leading-relaxed">
                {rev.comment}
              </p>

              {rev.suggestion && (
                <div className="bg-[#101014] border border-[#1e1e26] rounded p-1.5 text-[10px] text-[#c7d2fe]">
                  {rev.suggestion}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Strengths */}
        <div className="bg-[#15151a] border border-[#202028] rounded-lg p-2.5 space-y-1.5">
          <span className="font-medium text-[#ededee] text-[11px] block">Verified Strengths</span>
          <ul className="space-y-1">
            {scorecard.keyStrengths.map((str, idx) => (
              <li key={idx} className="flex items-start space-x-1.5 text-[10px] text-[#a1a1aa]">
                <CheckCircle className="w-3 h-3 text-[#34d399] flex-shrink-0 mt-0.5" />
                <span>{str}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
