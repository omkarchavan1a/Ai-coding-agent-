import React from 'react';
import JSZip from 'jszip';
import { IDEProvider, useIDE } from './context/IDEContext';
import { CursorTopBar } from './components/CursorTopBar';
import { CursorActivityBar } from './components/CursorActivityBar';
import { FileExplorerSidebar } from './components/sidebars/FileExplorerSidebar';
import { MultiAgentSidebar } from './components/sidebars/MultiAgentSidebar';
import { ReviewSidebar } from './components/sidebars/ReviewSidebar';
import { BugHunterSidebar } from './components/sidebars/BugHunterSidebar';
import { GitManagerSidebar } from './components/sidebars/GitManagerSidebar';
import { SettingsSidebar } from './components/sidebars/SettingsSidebar';
import { CodeEditorPane } from './components/editor/CodeEditorPane';
import { DiffViewerPane } from './components/editor/DiffViewerPane';
import { BottomPanel } from './components/bottom/BottomPanel';
import { BYOKModal } from './components/modals/BYOKModal';
import { CommandPaletteModal } from './components/modals/CommandPaletteModal';
import { PullRequestModal } from './components/modals/PullRequestModal';
import { ProjectModal } from './components/modals/ProjectModal';
import { PasscodeModal } from './components/modals/PasscodeModal';
import { SecurityGuideModal } from './components/modals/SecurityGuideModal';
import { PYTHON_AGENT_FILES } from './data/pythonAgentSource';

function IDEWorkspace() {
  const {
    activeSidebarTab,
    isSidebarOpen,
    viewMode,
    files,
    passcodeConfig,
    setIsPasscodeModalOpen
  } = useIDE();

  // If IDE session is locked on startup, show passcode authorization modal automatically
  React.useEffect(() => {
    if (passcodeConfig && !passcodeConfig.isUnlocked) {
      setIsPasscodeModalOpen(true);
    }
  }, [passcodeConfig, setIsPasscodeModalOpen]);

  const handleExportZip = async () => {
    const zip = new JSZip();

    // 1. Target Repository Codebase (Current modified files)
    const targetFolder = zip.folder('node-easy-notes-app');
    files.forEach((f) => {
      targetFolder?.file(f.path, f.content);
    });

    // 2. Python Autonomous Agent System (agent.py, repo_explorer.py, planner.py, tools.py)
    const pythonFolder = zip.folder('python_4_agents_orchestrator');
    PYTHON_AGENT_FILES.forEach((f) => {
      pythonFolder?.file(f.filename, f.content);
    });

    // 3. Assignment Documentation & Architecture Notes
    zip.file(
      'AI_AGENTS_ARCHITECTURE.md',
      `# Cursor-like 4-Agent Autonomous AI IDE & BYOK Architecture
## Agents Overview
1. Agent 1 (Coder & Architect): Writes code, implements schemas, extends endpoints.
2. Agent 2 (Reviewer): Audits code quality, clean architecture (MVC), security. Score: 94/100.
3. Agent 3 (Bug Hunter): Detects runtime exceptions, regex ReDoS vulnerabilities, and generates patches.
4. Agent 4 (Git & GitHub Manager): Stages files, writes semantic commits, handles branches and GitHub Pull Requests.

## BYOK (Bring Your Own Key) Support
- Google Gemini API (gemini-3.7-flash, gemini-3.1-pro-preview)
- OpenAI API (gpt-4o, o1)
- Anthropic Claude (claude-3-5-sonnet)
- Custom / Local Endpoint (Ollama, vLLM)`
    );

    const content = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(content);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Cursor_4_Agents_AI_IDE_Submission.zip';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-[#0d0d0f] text-[#ededee] overflow-hidden font-sans select-none">
      {/* Top Cursor Header Bar */}
      <CursorTopBar onExportZip={handleExportZip} />

      {/* Main Split Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Leftmost Activity Bar (Vertical icons) */}
        <CursorActivityBar />

        {/* Expandable Activity Sidebar */}
        {isSidebarOpen && (
          <aside className="w-80 border-r border-[#1e1e24] bg-[#111114] flex flex-col z-10">
            {activeSidebarTab === 'explorer' && <FileExplorerSidebar />}
            {activeSidebarTab === 'agents' && <MultiAgentSidebar />}
            {activeSidebarTab === 'review' && <ReviewSidebar />}
            {activeSidebarTab === 'bugs' && <BugHunterSidebar />}
            {activeSidebarTab === 'git' && <GitManagerSidebar />}
            {activeSidebarTab === 'settings' && <SettingsSidebar />}
          </aside>
        )}

        {/* Center Main Stage (Editor or Diff Viewer + Bottom Panel) */}
        <main className="flex-1 flex flex-col min-w-0 bg-[#0f0f12] overflow-hidden">
          {/* Editor Area */}
          <div className="flex-1 min-h-0 relative">
            {viewMode === 'editor' ? <CodeEditorPane /> : <DiffViewerPane />}
          </div>

          {/* Bottom Terminal & Test Dock */}
          <BottomPanel />
        </main>
      </div>

      {/* Modals */}
      <PasscodeModal />
      <SecurityGuideModal />
      <BYOKModal />
      <CommandPaletteModal />
      <PullRequestModal />
      <ProjectModal />
    </div>
  );
}

export default function App() {
  return (
    <IDEProvider>
      <IDEWorkspace />
    </IDEProvider>
  );
}
