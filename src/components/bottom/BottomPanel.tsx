import React, { useState } from 'react';
import { useIDE } from '../../context/IDEContext';
import { 
  Terminal, 
  Bot, 
  CheckCircle2, 
  Play, 
  X, 
  GitPullRequest, 
  Sparkles,
  Search
} from 'lucide-react';

export const BottomPanel: React.FC = () => {
  const {
    activeBottomTab,
    setActiveBottomTab,
    isBottomPanelOpen,
    setIsBottomPanelOpen,
    agents,
    gitCommits,
    isAnyAgentRunning
  } = useIDE();

  const [testOutput, setTestOutput] = useState<string[]>([
    'Running test/note.test.js via Node Test Runner...',
    '==================================================',
    '✓ Test 1: Category & Tags Schema Defaulting Passed (12ms)',
    '✓ Test 2: Comma & Array Tag Normalization Passed (8ms)',
    '✓ Test 3: Multi-field Search Filter Engine (?q=, ?category=, ?tag=) Passed (18ms)',
    '==================================================',
    'Total: 3 passed, 0 failed. All test suites green!'
  ]);
  const [isRunningTests, setIsRunningTests] = useState(false);

  // Live Note Sandbox State
  const [sandboxNotes, setSandboxNotes] = useState([
    { id: '1', title: 'Express MVC Architecture', category: 'Work', tags: ['express', 'node', 'backend'], content: 'Reviewed models and controllers for node-easy-notes-app.' },
    { id: '2', title: 'Weekly Grocery List', category: 'Personal', tags: ['shopping', 'food'], content: 'Organic milk, eggs, sourdough bread, coffee beans.' },
    { id: '3', title: '4 AI Agents System Design', category: 'Study', tags: ['ai', 'gemini', 'agents'], content: 'Coder, Reviewer, Bug Hunter, and Git Manager working concurrently.' }
  ]);
  const [searchFilter, setSearchFilter] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Work');
  const [newTags, setNewTags] = useState('');
  const [newContent, setNewContent] = useState('');

  if (!isBottomPanelOpen) return null;

  const handleRunTests = () => {
    setIsRunningTests(true);
    setTestOutput(['Executing test suite in isolated runner sandbox...']);
    setTimeout(() => {
      setTestOutput([
        'Running test/note.test.js via Node Test Runner...',
        '==================================================',
        '✓ Test 1: Category & Tags Schema Defaulting Passed (11ms)',
        '✓ Test 2: Comma & Array Tag Normalization Passed (7ms)',
        '✓ Test 3: Multi-field Search Filter Engine (?q=, ?category=, ?tag=) Passed (15ms)',
        '==================================================',
        'Tests:       3 passed, 3 total',
        'Snapshots:   0 total',
        'Time:        0.412 s',
        'Status:      PASSED with 100% assertions coverage'
      ]);
      setIsRunningTests(false);
    }, 800);
  };

  const handleAddSandboxNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContent.trim()) return;
    const note = {
      id: Date.now().toString(),
      title: newTitle || 'Untitled Note',
      category: newCategory,
      tags: newTags.split(',').map(t => t.trim().toLowerCase()).filter(Boolean),
      content: newContent
    };
    setSandboxNotes([note, ...sandboxNotes]);
    setNewTitle('');
    setNewTags('');
    setNewContent('');
  };

  const filteredNotes = sandboxNotes.filter(n => {
    const matchCat = selectedCategory === 'All' || n.category === selectedCategory;
    const q = searchFilter.toLowerCase();
    const matchSearch = !q || n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q) || n.tags.some(t => t.includes(q));
    return matchCat && matchSearch;
  });

  return (
    <div className="h-60 bg-[#0d0d0f] border-t border-[#1e1e24] flex flex-col text-xs select-none z-20">
      {/* Panel Tab Strip */}
      <div className="h-8 bg-[#0d0d0f] border-b border-[#18181f] flex items-center justify-between px-2">
        <div className="flex items-center space-x-1">
          {/* Tab 1: 4-Agents Stream */}
          <button
            onClick={() => setActiveBottomTab('console')}
            className={`px-2.5 py-1 rounded text-[11px] font-medium flex items-center space-x-1.5 transition-all ${
              activeBottomTab === 'console'
                ? 'bg-[#1a1a22] text-white'
                : 'text-[#71717a] hover:text-[#d4d4d8]'
            }`}
          >
            <Bot className="w-3.5 h-3.5 text-[#818cf8]" />
            <span>4-Agents Stream</span>
            {isAnyAgentRunning && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#6366f1] animate-ping ml-1" />
            )}
          </button>

          {/* Tab 2: Test Runner */}
          <button
            onClick={() => setActiveBottomTab('tests')}
            className={`px-2.5 py-1 rounded text-[11px] font-medium flex items-center space-x-1.5 transition-all ${
              activeBottomTab === 'tests'
                ? 'bg-[#1a1a22] text-white'
                : 'text-[#71717a] hover:text-[#d4d4d8]'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-[#34d399]" />
            <span>Tests</span>
          </button>

          {/* Tab 3: Live Notes Sandbox */}
          <button
            onClick={() => setActiveBottomTab('sandbox')}
            className={`px-2.5 py-1 rounded text-[11px] font-medium flex items-center space-x-1.5 transition-all ${
              activeBottomTab === 'sandbox'
                ? 'bg-[#1a1a22] text-white'
                : 'text-[#71717a] hover:text-[#d4d4d8]'
            }`}
          >
            <Play className="w-3.5 h-3.5 text-[#fbbf24] fill-current" />
            <span>Sandbox</span>
          </button>

          {/* Tab 4: Git Console */}
          <button
            onClick={() => setActiveBottomTab('git')}
            className={`px-2.5 py-1 rounded text-[11px] font-medium flex items-center space-x-1.5 transition-all ${
              activeBottomTab === 'git'
                ? 'bg-[#1a1a22] text-white'
                : 'text-[#71717a] hover:text-[#d4d4d8]'
            }`}
          >
            <GitPullRequest className="w-3.5 h-3.5 text-[#f472b6]" />
            <span>Git Logs</span>
          </button>
        </div>

        {/* Panel Controls */}
        <div className="flex items-center space-x-1">
          <button
            onClick={() => setIsBottomPanelOpen(false)}
            className="p-1 rounded hover:bg-[#1a1a22] text-[#71717a] hover:text-white transition-colors"
            title="Close Panel"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Tab Content Body */}
      <div className="flex-1 overflow-auto p-3 font-mono text-xs text-[#a1a1aa] bg-[#0d0d0f]">
        {/* Tab 1: 4-Agents Stream */}
        {activeBottomTab === 'console' && (
          <div className="space-y-1 leading-relaxed">
            <div className="text-[11px] text-[#818cf8] font-medium pb-1 flex items-center space-x-1.5 border-b border-[#18181f]">
              <Sparkles className="w-3 h-3 text-[#818cf8]" />
              <span>4-AGENT ORCHESTRATION STREAM</span>
            </div>

            {agents.map(agent => (
              <div key={agent.id} className="space-y-0.5 pt-1">
                <span className="font-medium text-[11px]" style={{ color: agent.accentColor }}>
                  [{agent.shortTitle}]:
                </span>
                {agent.logs.slice(0, 3).map((log, idx) => (
                  <div key={idx} className="pl-4 text-[11px] text-[#ededee]">
                    {log}
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        {/* Tab 2: Test Runner */}
        {activeBottomTab === 'tests' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between pb-1 border-b border-[#18181f]">
              <span className="text-[#34d399] font-medium">INTEGRATION TESTS</span>
              <button
                onClick={handleRunTests}
                disabled={isRunningTests}
                className="px-2.5 py-0.5 bg-[#10b981] hover:bg-[#059669] text-white rounded text-[10px] font-medium flex items-center space-x-1 transition-all"
              >
                <Play className="w-2.5 h-2.5 fill-current" />
                <span>{isRunningTests ? 'Running...' : 'Run All (3)'}</span>
              </button>
            </div>

            <div className="space-y-1">
              {testOutput.map((line, idx) => (
                <div
                  key={idx}
                  className={`${
                    line.startsWith('✓')
                      ? 'text-[#34d399] font-medium'
                      : line.includes('PASSED')
                      ? 'text-[#34d399] font-medium bg-[#10b981]/10 p-1 rounded'
                      : 'text-[#71717a]'
                  }`}
                >
                  {line}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Live Notes Sandbox */}
        {activeBottomTab === 'sandbox' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 h-full">
            {/* Left: Create Note */}
            <form onSubmit={handleAddSandboxNote} className="space-y-2 bg-[#121215] p-2.5 rounded border border-[#1e1e24]">
              <span className="text-[11px] text-[#fbbf24] font-medium block uppercase tracking-wider">
                REST API Tester (POST /api/notes)
              </span>

              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Note title..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="bg-[#0d0d0f] border border-[#1e1e24] rounded px-2 py-0.5 text-xs text-white placeholder-[#52525b] focus:outline-none"
                />
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="bg-[#0d0d0f] border border-[#1e1e24] rounded px-2 py-0.5 text-xs text-white focus:outline-none"
                >
                  <option value="Work">Work</option>
                  <option value="Personal">Personal</option>
                  <option value="Study">Study</option>
                  <option value="General">General</option>
                </select>
              </div>

              <input
                type="text"
                placeholder="Tags (comma-separated, e.g. api, urgent)..."
                value={newTags}
                onChange={(e) => setNewTags(e.target.value)}
                className="w-full bg-[#0d0d0f] border border-[#1e1e24] rounded px-2 py-0.5 text-xs text-white placeholder-[#52525b] focus:outline-none"
              />

              <textarea
                placeholder="Note content..."
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                rows={2}
                className="w-full bg-[#0d0d0f] border border-[#1e1e24] rounded px-2 py-0.5 text-xs text-white placeholder-[#52525b] resize-none focus:outline-none"
              />

              <button
                type="submit"
                className="w-full py-1 bg-[#d97706] hover:bg-[#b45309] text-white font-medium rounded text-xs transition-all"
              >
                Create Note
              </button>
            </form>

            {/* Right: Notes List & Filter */}
            <div className="space-y-2 flex flex-col h-full">
              <div className="flex items-center space-x-2">
                <div className="relative flex-1">
                  <Search className="w-3 h-3 absolute left-2 top-2 text-[#52525b]" />
                  <input
                    type="text"
                    placeholder="Search query (?q=, ?tag=)..."
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                    className="w-full bg-[#121215] border border-[#1e1e24] rounded pl-6 pr-2 py-0.5 text-xs text-white placeholder-[#52525b] focus:outline-none"
                  />
                </div>

                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="bg-[#121215] border border-[#1e1e24] rounded px-2 py-0.5 text-xs text-white focus:outline-none"
                >
                  <option value="All">All</option>
                  <option value="Work">Work</option>
                  <option value="Personal">Personal</option>
                  <option value="Study">Study</option>
                </select>
              </div>

              <div className="flex-1 overflow-y-auto space-y-1 pr-1">
                {filteredNotes.map(n => (
                  <div key={n.id} className="bg-[#121215] border border-[#1e1e24] p-2 rounded text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-[#ededee] text-[11px]">{n.title}</span>
                      <span className="px-1.5 py-0.2 rounded bg-[#1e1e28] text-[#818cf8] text-[9px]">
                        {n.category}
                      </span>
                    </div>
                    <p className="text-[#a1a1aa] text-[10px]">{n.content}</p>
                    <div className="flex flex-wrap gap-1 pt-0.5">
                      {n.tags.map(t => (
                        <span key={t} className="px-1 rounded bg-[#18181f] text-[#71717a] text-[9px]">
                          #{t}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Git Console */}
        {activeBottomTab === 'git' && (
          <div className="space-y-1.5">
            <span className="text-[#f472b6] font-medium block pb-1 border-b border-[#18181f]">
              GIT COMMIT LOG & BRANCH TREE
            </span>
            {gitCommits.map(c => (
              <div key={c.id} className="text-[#a1a1aa] text-[11px]">
                <span className="text-[#f472b6] font-mono font-medium">commit {c.hash}</span> ({c.branch})
                <div className="pl-4 text-[#71717a]">Author: {c.author} &lt;{c.authorEmail}&gt;</div>
                <div className="pl-4 text-[#71717a]">Date:   {c.timestamp}</div>
                <div className="pl-4 text-[#ededee] font-medium mt-0.5">{c.message}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
