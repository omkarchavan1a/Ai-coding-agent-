import React, { useState } from 'react';
import { useIDE } from '../../context/IDEContext';
import { 
  GitPullRequest, 
  X, 
  CheckCircle2
} from 'lucide-react';

export const PullRequestModal: React.FC = () => {
  const {
    isPRModalOpen,
    setIsPRModalOpen,
    activePR,
    currentBranch
  } = useIDE();

  const [prTitle, setPrTitle] = useState('feat: Autonomous Note Organization & Multi-Field Search Engine');
  const [prDescription, setPrDescription] = useState(
    `### 🎯 Summary of Changes
- **Category System**: Added \`category\` field (default: \`'General'\`) to NoteSchema.
- **Tag Management**: Added \`tags\` array supporting comma-separated inputs and native arrays with uniform lowercase normalization.
- **Search Engine**: Extended \`findAll\` to parse \`?q=\`, \`?category=\`, and \`?tag=\` query parameters with fast index matching.
- **Metadata API**: Implemented \`GET /notes/meta\` for instant retrieval of active category and tag filters.
- **Quality & Verification**: Added \`test/note.test.js\` covering 100% of new behavior while strictly preserving backwards compatibility for existing REST endpoints.

---
### 🤖 4-Agent Orchestration Audit
- **Coder Agent**: Implemented 184 lines across 4 files.
- **Reviewer Agent**: Rated architecture 94/100 (Clean MVC & SOLID).
- **Bug Hunter Agent**: Verified zero unhandled exceptions and patched ReDoS safety.
- **Git Manager Agent**: Staged, verified, and crafted this Pull Request ready for merge.`
  );

  const [isMerging, setIsMerging] = useState(false);
  const [isMerged, setIsMerged] = useState(false);

  if (!isPRModalOpen) return null;

  const handleMergePR = async () => {
    setIsMerging(true);
    await new Promise(r => setTimeout(r, 1200));
    setIsMerging(false);
    setIsMerged(true);
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-[#121215] border border-[#22222a] w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden text-xs text-[#a1a1aa] animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-4 py-3 border-b border-[#1e1e24] flex items-center justify-between bg-[#121215]">
          <div className="flex items-center space-x-2.5">
            <div className="p-1.5 rounded-md bg-[#1a1a22] border border-[#262632] text-[#f472b6]">
              <GitPullRequest className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xs font-semibold text-white">Pull Request #{activePR?.number || 101}</h2>
                <span className={`px-1.5 py-0.2 rounded text-[9px] font-mono font-medium ${
                  isMerged
                    ? 'bg-[#a855f7]/10 text-[#c084fc] border border-[#a855f7]/20'
                    : 'bg-[#10b981]/10 text-[#34d399] border border-[#10b981]/20'
                }`}>
                  {isMerged ? 'MERGED' : 'OPEN'}
                </span>
              </div>
              <p className="text-[10px] text-[#71717a] font-mono mt-0.5">
                {currentBranch} → main
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsPRModalOpen(false)}
            className="p-1 rounded hover:bg-[#1a1a22] text-[#71717a] hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* PR Content Body */}
        <div className="p-4 space-y-3 max-h-[70vh] overflow-y-auto">
          {/* PR Title Input */}
          <div className="space-y-1">
            <label className="text-[10px] font-semibold text-[#71717a] uppercase tracking-wider">Title</label>
            <input
              type="text"
              value={prTitle}
              onChange={(e) => setPrTitle(e.target.value)}
              className="w-full bg-[#0d0d0f] border border-[#202028] focus:border-[#f472b6] rounded px-2.5 py-1.5 text-xs text-white font-medium focus:outline-none"
            />
          </div>

          {/* PR Description */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[10px]">
              <label className="font-semibold text-[#71717a] uppercase tracking-wider">Description & Audit</label>
              <span className="text-[#52525b] font-mono">Markdown</span>
            </div>
            <textarea
              value={prDescription}
              onChange={(e) => setPrDescription(e.target.value)}
              rows={7}
              className="w-full bg-[#0d0d0f] border border-[#202028] focus:border-[#f472b6] rounded p-2.5 text-xs text-[#ededee] font-mono leading-relaxed focus:outline-none resize-none"
            />
          </div>

          {/* Checks & CI Verification */}
          <div className="bg-[#15151a] border border-[#202028] rounded-lg p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-medium text-[#ededee] text-xs flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#34d399]" />
                <span>4 Agent Checks Passed</span>
              </span>
              <span className="text-[#34d399] font-mono text-[10px]">4 / 4 checks green</span>
            </div>

            <div className="grid grid-cols-2 gap-1.5 text-[10px]">
              <div className="flex items-center space-x-1.5 text-[#a1a1aa]">
                <CheckCircle2 className="w-3 h-3 text-[#34d399]" />
                <span>Integration Tests: 100%</span>
              </div>
              <div className="flex items-center space-x-1.5 text-[#a1a1aa]">
                <CheckCircle2 className="w-3 h-3 text-[#34d399]" />
                <span>Quality Scorecard: Grade A+ (94/100)</span>
              </div>
              <div className="flex items-center space-x-1.5 text-[#a1a1aa]">
                <CheckCircle2 className="w-3 h-3 text-[#34d399]" />
                <span>Bug Vulnerabilities: 0 Flaws</span>
              </div>
              <div className="flex items-center space-x-1.5 text-[#a1a1aa]">
                <CheckCircle2 className="w-3 h-3 text-[#34d399]" />
                <span>Git Tree: Fast-Forward Clean</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-4 py-2.5 border-t border-[#1e1e24] bg-[#0d0d0f] flex items-center justify-between">
          <div className="flex items-center space-x-2 text-[10px] text-[#71717a] font-mono">
            <span>5 files changed</span>
            <span>•</span>
            <span className="text-[#34d399]">+184</span>
            <span className="text-[#fb7185]">-22</span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsPRModalOpen(false)}
              className="px-3 py-1 bg-[#1a1a22] hover:bg-[#22222c] text-[#a1a1aa] hover:text-white rounded text-xs transition-all"
            >
              Close
            </button>

            {!isMerged ? (
              <button
                onClick={handleMergePR}
                disabled={isMerging}
                className="px-3 py-1 bg-[#db2777] hover:bg-[#be185d] text-white font-medium rounded text-xs flex items-center space-x-1.5 transition-all"
              >
                <GitPullRequest className="w-3 h-3" />
                <span>{isMerging ? 'Merging...' : 'Merge Pull Request'}</span>
              </button>
            ) : (
              <div className="px-3 py-1 bg-[#a855f7]/10 border border-[#a855f7]/20 text-[#c084fc] font-medium rounded text-xs flex items-center space-x-1.5">
                <CheckCircle2 className="w-3 h-3" />
                <span>Merged into main</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
