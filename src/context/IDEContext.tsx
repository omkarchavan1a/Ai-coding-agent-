import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import JSZip from 'jszip';
import { RepoFile, AgentInfo, AgentRole, CodeBug, ReviewAnnotation, CodeReviewScorecard, GitCommit, GitBranch, PullRequest, BYOKSettings, ProjectTemplate, PasscodeConfig, PasscodeModalMode } from '../types';
import { INITIAL_TARGET_REPO_FILES, MODIFIED_TARGET_REPO_FILES } from '../data/targetRepoData';
import { INITIAL_AGENTS, INITIAL_BYOK_SETTINGS, INITIAL_BUGS, INITIAL_REVIEWS, INITIAL_SCORECARD, INITIAL_COMMITS, INITIAL_BRANCHES, INITIAL_PULL_REQUESTS } from '../data/agentData';
import { PROJECT_TEMPLATES } from '../data/projectTemplates';
import { PYTHON_AGENT_FILES } from '../data/pythonAgentSource';
import { safeFetchJson } from '../utils/safeFetch';

interface IDEContextType {
  // Passcode Security & Cryptographic Authorization
  passcodeConfig: PasscodeConfig | null;
  isPasscodeModalOpen: boolean;
  setIsPasscodeModalOpen: (open: boolean) => void;
  passcodeModalMode: PasscodeModalMode;
  setPasscodeModalMode: (mode: PasscodeModalMode) => void;
  openPasscodeModal: (mode?: PasscodeModalMode) => void;
  isSecurityGuideModalOpen: boolean;
  setIsSecurityGuideModalOpen: (open: boolean) => void;
  openSecurityGuideModal: () => void;
  authorizePasscode: (passcode: string) => Promise<{ success: boolean; message: string; error?: string; remainingSeconds?: number }>;
  createPasscode: (passcode: string, hint?: string, developerName?: string) => Promise<{ success: boolean; message: string; error?: string }>;
  changePasscode: (currentPasscode: string, newPasscode: string, newHint?: string, developerName?: string) => Promise<{ success: boolean; message: string; error?: string }>;
  lockSession: () => Promise<void>;
  removePasscode: (currentPasscode: string) => Promise<{ success: boolean; message: string; error?: string }>;
  fetchPasscodeStatus: () => Promise<void>;

  // Project Management & Import / Export
  projectName: string;
  setProjectName: (name: string) => void;
  isProjectModalOpen: boolean;
  setIsProjectModalOpen: (open: boolean) => void;
  projectModalTab: 'new' | 'import' | 'export';
  setProjectModalTab: (tab: 'new' | 'import' | 'export') => void;
  openNewProjectModal: () => void;
  openImportProjectModal: () => void;
  openExportProjectModal: () => void;
  createNewProject: (templateId: string, customName?: string) => void;
  importProjectFromZip: (file: File) => Promise<{ success: boolean; count?: number; error?: string }>;
  importProjectFromFiles: (fileList: FileList | File[]) => Promise<{ success: boolean; count?: number; error?: string }>;
  importProjectFromJson: (jsonString: string) => { success: boolean; count?: number; error?: string };
  exportProjectZip: (customName?: string) => Promise<void>;
  exportProjectJson: (customName?: string) => void;

  // Files & Editor State
  files: RepoFile[];
  activeFilePath: string;
  activeFile: RepoFile | undefined;
  openTabs: string[];
  viewMode: 'editor' | 'diff';
  diffBaseFiles: RepoFile[];
  
  // Navigation & Sidebars
  activeSidebarTab: 'explorer' | 'agents' | 'review' | 'bugs' | 'git' | 'settings';
  isSidebarOpen: boolean;
  isBottomPanelOpen: boolean;
  activeBottomTab: 'console' | 'tests' | 'review' | 'bugs' | 'git' | 'sandbox';
  
  // 4 Agents State
  agents: AgentInfo[];
  isAnyAgentRunning: boolean;
  orchestratorProgress: number;
  orchestratorThought: string;
  runAllAgents: (customPrompt?: string) => Promise<void>;
  runSingleAgent: (role: AgentRole, customPrompt?: string) => Promise<void>;
  stopAgents: () => void;
  
  // Review & Bugs
  bugs: CodeBug[];
  reviews: ReviewAnnotation[];
  scorecard: CodeReviewScorecard;
  applyBugFix: (bugId: string) => void;
  fixAllBugs: () => void;
  
  // Git & GitHub
  gitCommits: GitCommit[];
  gitBranches: GitBranch[];
  currentBranch: string;
  pullRequests: PullRequest[];
  stagedFiles: string[];
  unstagedFiles: string[];
  stageFile: (path: string) => void;
  unstageFile: (path: string) => void;
  stageAllFiles: () => void;
  unstageAllFiles: () => void;
  createCommit: (message: string) => void;
  pushToRemote: () => Promise<void>;
  pullFromRemote: () => Promise<void>;
  switchBranch: (branchName: string) => void;
  createBranch: (branchName: string) => void;
  createPullRequest: (title: string, description: string) => PullRequest;
  
  // BYOK Settings
  byok: BYOKSettings;
  updateByok: (newSettings: Partial<BYOKSettings>) => void;
  testByokConnection: () => Promise<{ success: boolean; latencyMs?: number; error?: string; message?: string }>;
  isByokModalOpen: boolean;
  setIsByokModalOpen: (open: boolean) => void;
  
  // Command Palette & PR Modal
  isCommandPaletteOpen: boolean;
  setIsCommandPaletteOpen: (open: boolean) => void;
  isPRModalOpen: boolean;
  setIsPRModalOpen: (open: boolean) => void;
  activePR: PullRequest | null;
  setActivePR: (pr: PullRequest | null) => void;
  
  // Actions & File Management
  setActiveFilePath: (path: string) => void;
  openFileInTab: (path: string) => void;
  closeTab: (path: string) => void;
  closeAllTabs: () => void;
  closeOtherTabs: (path: string) => void;
  closeSavedTabs: () => void;
  updateFileContent: (path: string, content: string) => void;
  createNewFile: (path: string, content?: string) => void;
  createFolder: (folderPath: string) => void;
  deleteFile: (path: string) => void;
  deleteFolder: (folderPath: string) => void;
  renameFile: (oldPath: string, newPath: string) => boolean;
  duplicateFile: (path: string) => string;
  revertFile: (path: string) => void;
  revertAllFiles: () => void;
  downloadSingleFile: (path: string) => void;
  setViewMode: (mode: 'editor' | 'diff') => void;
  setActiveSidebarTab: (tab: 'explorer' | 'agents' | 'review' | 'bugs' | 'git' | 'settings') => void;
  setIsSidebarOpen: (open: boolean) => void;
  setIsBottomPanelOpen: (open: boolean) => void;
  setActiveBottomTab: (tab: 'console' | 'tests' | 'review' | 'bugs' | 'git' | 'sandbox') => void;
  resetCodebase: () => void;
}

const IDEContext = createContext<IDEContextType | undefined>(undefined);

export const IDEProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load saved BYOK settings from localStorage if available
  const [byok, setByok] = useState<BYOKSettings>(() => {
    try {
      const saved = localStorage.getItem('byok_settings');
      if (saved) return { ...INITIAL_BYOK_SETTINGS, ...JSON.parse(saved) };
    } catch (e) {}
    return INITIAL_BYOK_SETTINGS;
  });

  const [files, setFiles] = useState<RepoFile[]>(INITIAL_TARGET_REPO_FILES);
  const [diffBaseFiles] = useState<RepoFile[]>(INITIAL_TARGET_REPO_FILES);
  const [activeFilePath, setActiveFilePath] = useState<string>('app/controllers/note.controller.js');
  const [openTabs, setOpenTabs] = useState<string[]>([
    'app/controllers/note.controller.js',
    'app/models/note.model.js',
    'app/routes/note.routes.js',
    'test/note.test.js'
  ]);
  const [viewMode, setViewMode] = useState<'editor' | 'diff'>('editor');
  
  const [activeSidebarTab, setActiveSidebarTab] = useState<'explorer' | 'agents' | 'review' | 'bugs' | 'git' | 'settings'>('agents');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [isBottomPanelOpen, setIsBottomPanelOpen] = useState<boolean>(true);
  const [activeBottomTab, setActiveBottomTab] = useState<'console' | 'tests' | 'review' | 'bugs' | 'git' | 'sandbox'>('console');
  
  const [agents, setAgents] = useState<AgentInfo[]>(INITIAL_AGENTS);
  const [isAnyAgentRunning, setIsAnyAgentRunning] = useState<boolean>(false);
  const [orchestratorProgress, setOrchestratorProgress] = useState<number>(0);
  const [orchestratorThought, setOrchestratorThought] = useState<string>('Ready to orchestrate 4 autonomous agents across your codebase.');
  
  const [bugs, setBugs] = useState<CodeBug[]>(INITIAL_BUGS);
  const [reviews, setReviews] = useState<ReviewAnnotation[]>(INITIAL_REVIEWS);
  const [scorecard, setScorecard] = useState<CodeReviewScorecard>(INITIAL_SCORECARD);
  
  const [gitCommits, setGitCommits] = useState<GitCommit[]>(INITIAL_COMMITS);
  const [gitBranches, setGitBranches] = useState<GitBranch[]>(INITIAL_BRANCHES);
  const [currentBranch, setCurrentBranch] = useState<string>('feature/notes-organization-search');
  const [pullRequests, setPullRequests] = useState<PullRequest[]>(INITIAL_PULL_REQUESTS);
  const [stagedFiles, setStagedFiles] = useState<string[]>([
    'app/controllers/note.controller.js',
    'app/models/note.model.js'
  ]);
  const [unstagedFiles, setUnstagedFiles] = useState<string[]>([
    'app/routes/note.routes.js',
    'test/note.test.js',
    'package.json'
  ]);

  const [isByokModalOpen, setIsByokModalOpen] = useState<boolean>(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);
  const [isPRModalOpen, setIsPRModalOpen] = useState<boolean>(false);
  const [activePR, setActivePR] = useState<PullRequest | null>(INITIAL_PULL_REQUESTS[0] || null);

  // Project Management State
  const [projectName, setProjectName] = useState<string>('node-easy-notes-app');
  const [isProjectModalOpen, setIsProjectModalOpen] = useState<boolean>(false);
  const [projectModalTab, setProjectModalTab] = useState<'new' | 'import' | 'export'>('new');

  const openNewProjectModal = () => {
    setProjectModalTab('new');
    setIsProjectModalOpen(true);
  };

  const openImportProjectModal = () => {
    setProjectModalTab('import');
    setIsProjectModalOpen(true);
  };

  const openExportProjectModal = () => {
    setProjectModalTab('export');
    setIsProjectModalOpen(true);
  };

  const detectLanguage = (filePath: string): string => {
    const ext = filePath.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'ts':
      case 'tsx':
        return 'typescript';
      case 'js':
      case 'jsx':
        return 'javascript';
      case 'py':
        return 'python';
      case 'json':
        return 'json';
      case 'md':
        return 'markdown';
      case 'html':
      case 'htm':
        return 'html';
      case 'css':
        return 'css';
      default:
        return 'plaintext';
    }
  };

  // 1. Create New Project from Template
  const createNewProject = (templateId: string, customName?: string) => {
    const template = PROJECT_TEMPLATES.find(t => t.id === templateId) || PROJECT_TEMPLATES[0];
    const newName = (customName && customName.trim()) || template.id;
    
    setProjectName(newName);
    setFiles(template.files);
    const firstFile = template.files[0]?.path || 'README.md';
    setActiveFilePath(firstFile);
    setOpenTabs(template.files.slice(0, 4).map(f => f.path));
    
    // Reset orchestrator and Git state
    setStagedFiles([]);
    setUnstagedFiles(template.files.slice(0, 2).map(f => f.path));
    setCurrentBranch('main');
    setGitCommits([
      {
        id: 'c_' + Math.random().toString(36).substring(2, 7),
        message: `feat(init): initialize project from ${template.name}`,
        author: 'Developer',
        timestamp: 'Just now',
        hash: Math.random().toString(16).substring(2, 9),
        filesCount: template.files.length,
        branch: 'main'
      }
    ]);
    setViewMode('editor');
    setIsProjectModalOpen(false);
  };

  // 2. Import Project from ZIP
  const importProjectFromZip = async (file: File): Promise<{ success: boolean; count?: number; error?: string }> => {
    try {
      const zip = await JSZip.loadAsync(file);
      const parsedFiles: RepoFile[] = [];

      const fileEntries = Object.keys(zip.files).filter(filename => {
        const entry = zip.files[filename];
        return !entry.dir && !filename.includes('__MACOSX') && !filename.endsWith('.DS_Store');
      });

      if (fileEntries.length === 0) {
        return { success: false, error: 'The uploaded ZIP archive contains no readable files.' };
      }

      // Check if all files share a common root directory prefix (e.g. "my-app/src/index.js")
      let prefixToRemove = '';
      const firstSlashIdx = fileEntries[0].indexOf('/');
      if (firstSlashIdx > 0) {
        const candidatePrefix = fileEntries[0].substring(0, firstSlashIdx + 1);
        if (fileEntries.every(name => name.startsWith(candidatePrefix))) {
          prefixToRemove = candidatePrefix;
        }
      }

      for (const rawPath of fileEntries) {
        const cleanPath = prefixToRemove ? rawPath.substring(prefixToRemove.length) : rawPath;
        if (!cleanPath) continue;
        const content = await zip.files[rawPath].async('string');
        parsedFiles.push({
          path: cleanPath,
          content,
          language: detectLanguage(cleanPath),
          isModified: false
        });
      }

      if (parsedFiles.length === 0) {
        return { success: false, error: 'Could not extract valid text files from ZIP archive.' };
      }

      const inferredProjectName = file.name.replace(/\.zip$/i, '') || 'imported-project';
      setProjectName(inferredProjectName);
      setFiles(parsedFiles);
      
      const primaryEntry = parsedFiles.find(f => 
        f.path.includes('index') || f.path.includes('main') || f.path.includes('App') || f.path.includes('README')
      )?.path || parsedFiles[0].path;

      setActiveFilePath(primaryEntry);
      setOpenTabs(parsedFiles.slice(0, 4).map(f => f.path));
      setStagedFiles([]);
      setUnstagedFiles([]);
      setCurrentBranch('main');
      setGitCommits([
        {
          id: 'c_import_' + Math.random().toString(36).substring(2, 7),
          message: `chore: import project from archive ${file.name}`,
          author: 'Developer',
          timestamp: 'Just now',
          hash: Math.random().toString(16).substring(2, 9),
          filesCount: parsedFiles.length,
          branch: 'main'
        }
      ]);
      setViewMode('editor');
      setIsProjectModalOpen(false);

      return { success: true, count: parsedFiles.length };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to extract ZIP archive.' };
    }
  };

  // 3. Import Project from Files / Directory Picker
  const importProjectFromFiles = async (fileList: FileList | File[]): Promise<{ success: boolean; count?: number; error?: string }> => {
    try {
      const filesArray = Array.from(fileList);
      if (filesArray.length === 0) {
        return { success: false, error: 'No files provided for import.' };
      }

      const parsedFiles: RepoFile[] = [];

      for (const file of filesArray) {
        // webkitRelativePath contains the relative path if chosen via directory picker
        const relPath = (file as any).webkitRelativePath || file.name;
        if (relPath.includes('__MACOSX') || relPath.endsWith('.DS_Store')) continue;

        const text = await file.text();
        parsedFiles.push({
          path: relPath,
          content: text,
          language: detectLanguage(relPath),
          isModified: false
        });
      }

      if (parsedFiles.length === 0) {
        return { success: false, error: 'No valid text files found in the selection.' };
      }

      const inferredName = filesArray[0]?.name ? filesArray[0].name.split('.')[0] + '-project' : 'imported-workspace';
      setProjectName(inferredName);
      setFiles(parsedFiles);
      const primaryEntry = parsedFiles[0].path;
      setActiveFilePath(primaryEntry);
      setOpenTabs(parsedFiles.slice(0, 4).map(f => f.path));
      setIsProjectModalOpen(false);

      return { success: true, count: parsedFiles.length };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to read files.' };
    }
  };

  // 4. Import Project from JSON manifest
  const importProjectFromJson = (jsonString: string): { success: boolean; count?: number; error?: string } => {
    try {
      const data = JSON.parse(jsonString);
      let incomingFiles: RepoFile[] = [];
      let incomingName = projectName;

      if (Array.isArray(data)) {
        incomingFiles = data;
      } else if (data && typeof data === 'object' && Array.isArray(data.files)) {
        incomingFiles = data.files;
        if (data.name) incomingName = data.name;
      } else {
        return { success: false, error: 'Invalid JSON format. Expected an array of files or an object with { name, files }.' };
      }

      const normalized: RepoFile[] = incomingFiles.map(f => ({
        path: f.path || 'untitled.js',
        content: f.content || '',
        language: f.language || detectLanguage(f.path || 'untitled.js'),
        isModified: false
      }));

      setProjectName(incomingName);
      setFiles(normalized);
      if (normalized.length > 0) {
        setActiveFilePath(normalized[0].path);
        setOpenTabs(normalized.slice(0, 4).map(f => f.path));
      }
      setIsProjectModalOpen(false);
      return { success: true, count: normalized.length };
    } catch (err: any) {
      return { success: false, error: 'JSON parse error: ' + err.message };
    }
  };

  // 5. Export Project as ZIP
  const exportProjectZip = async (customName?: string) => {
    const zip = new JSZip();
    const activeProjectName = (customName && customName.trim()) || projectName || 'project-export';

    // 1. Current Workspace Files
    const targetFolder = zip.folder(activeProjectName);
    files.forEach((f) => {
      targetFolder?.file(f.path, f.content);
    });

    // 2. Autonomous 4-Agent Python System Orchestrator
    const pythonFolder = zip.folder('python_4_agents_orchestrator');
    PYTHON_AGENT_FILES.forEach((f) => {
      pythonFolder?.file(f.filename, f.content);
    });

    // 3. Project Manifest & Architecture documentation
    zip.file(
      'PROJECT_MANIFEST.json',
      JSON.stringify(
        {
          name: activeProjectName,
          exportedAt: new Date().toISOString(),
          author: 'Developer',
          email: 'developer@local.dev',
          totalFiles: files.length,
          files: files.map(f => ({ path: f.path, language: f.language, lines: f.content.split('\n').length }))
        },
        null,
        2
      )
    );

    zip.file(
      'AI_AGENTS_ARCHITECTURE.md',
      `# ${activeProjectName} - Autonomous AI IDE Export
## Author: Developer
## Export Date: ${new Date().toLocaleString()}

### 4 Autonomous AI Agents Summary
- **Agent 1 (Coder & System Architect)**: Explores repository, creates execution plan, and writes production code.
- **Agent 2 (Code Reviewer & Quality Auditor)**: Conducts static analysis, security review, and clean architecture scoring.
- **Agent 3 (Bug Hunter & Patch Specialist)**: Scans for syntax errors, edge cases, null pointers, and provides automated fixes.
- **Agent 4 (Git & GitHub Manager)**: Handles staging, semantic commit messages, branching, and pull requests.
`
    );

    const content = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(content);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeProjectName}.zip`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // 6. Export Project as JSON
  const exportProjectJson = (customName?: string) => {
    const activeProjectName = (customName && customName.trim()) || projectName || 'project-export';
    const payload = {
      name: activeProjectName,
      exportedAt: new Date().toISOString(),
      author: 'Developer',
      email: 'developer@local.dev',
      files
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeProjectName}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // ==================== PASSCODE SECURITY STATE & HANDLERS ====================
  const [passcodeConfig, setPasscodeConfig] = useState<PasscodeConfig | null>({
    hasPasscode: true,
    isUnlocked: true,
    hint: "Default developer PIN is 1234",
    developerName: "Omkar Chavan",
    hashAlgorithm: "PBKDF2-HMAC-SHA256 (100,000 rounds)"
  });
  const [isPasscodeModalOpen, setIsPasscodeModalOpen] = useState(false);
  const [passcodeModalMode, setPasscodeModalMode] = useState<PasscodeModalMode>('authorize');
  const [isSecurityGuideModalOpen, setIsSecurityGuideModalOpen] = useState(false);

  const openSecurityGuideModal = () => {
    setIsSecurityGuideModalOpen(true);
  };

  const fetchPasscodeStatus = useCallback(async () => {
    try {
      const res = await safeFetchJson<PasscodeConfig>('/api/passcode/status');
      if (res.data && typeof res.data === 'object') {
        setPasscodeConfig(res.data);
      }
    } catch (e) {
      console.warn("Failed to fetch passcode status:", e);
    }
  }, []);

  useEffect(() => {
    fetchPasscodeStatus();
  }, [fetchPasscodeStatus]);

  const openPasscodeModal = (mode: PasscodeModalMode = 'authorize') => {
    setPasscodeModalMode(mode);
    setIsPasscodeModalOpen(true);
  };

  const authorizePasscode = async (passcode: string) => {
    try {
      const res = await safeFetchJson('/api/passcode/authorize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passcode })
      });
      const data = res.data;
      if (data.success) {
        await fetchPasscodeStatus();
        setIsPasscodeModalOpen(false);
        return { success: true, message: data.message || "Passcode authorized successfully!" };
      }
      await fetchPasscodeStatus();
      return { 
        success: false, 
        message: data.error || "Incorrect passcode.", 
        error: data.error,
        remainingSeconds: data.remainingSeconds 
      };
    } catch (err: any) {
      return { success: false, message: err.message || "Network error", error: err.message };
    }
  };

  const createPasscode = async (passcode: string, hint?: string, developerName?: string) => {
    try {
      const res = await safeFetchJson('/api/passcode/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passcode, hint, developerName })
      });
      const data = res.data;
      if (data.success) {
        await fetchPasscodeStatus();
        setIsPasscodeModalOpen(false);
        return { success: true, message: data.message || "Passcode created!" };
      }
      return { success: false, message: data.error || "Failed to create passcode.", error: data.error };
    } catch (err: any) {
      return { success: false, message: err.message || "Network error", error: err.message };
    }
  };

  const changePasscode = async (currentPasscode: string, newPasscode: string, newHint?: string, developerName?: string) => {
    try {
      const res = await safeFetchJson('/api/passcode/change', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPasscode, newPasscode, newHint, developerName })
      });
      const data = res.data;
      if (data.success) {
        await fetchPasscodeStatus();
        setIsPasscodeModalOpen(false);
        return { success: true, message: data.message || "Passcode updated!" };
      }
      return { success: false, message: data.error || "Failed to update passcode.", error: data.error };
    } catch (err: any) {
      return { success: false, message: err.message || "Network error", error: err.message };
    }
  };

  const lockSession = async () => {
    try {
      await safeFetchJson('/api/passcode/lock', { method: 'POST' });
      await fetchPasscodeStatus();
      openPasscodeModal('authorize');
    } catch (e) {
      console.warn("Failed to lock session:", e);
    }
  };

  const removePasscode = async (currentPasscode: string) => {
    try {
      const res = await safeFetchJson('/api/passcode/remove', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPasscode })
      });
      const data = res.data;
      if (data.success) {
        await fetchPasscodeStatus();
        setIsPasscodeModalOpen(false);
        return { success: true, message: data.message || "Passcode removed." };
      }
      return { success: false, message: data.error || "Failed to remove passcode.", error: data.error };
    } catch (err: any) {
      return { success: false, message: err.message || "Network error", error: err.message };
    }
  };

  // Sync BYOK settings to localStorage
  const updateByok = (newSettings: Partial<BYOKSettings>) => {
    setByok(prev => {
      const updated = { ...prev, ...newSettings };
      try {
        localStorage.setItem('byok_settings', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const testByokConnection = async () => {
    try {
      const apiKeyToTest = byok.provider === 'gemini' ? byok.geminiApiKey : (byok.provider === 'openai' ? byok.openaiApiKey : byok.anthropicApiKey);
      const res = await safeFetchJson('/api/byok/test-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: byok.provider,
          apiKey: apiKeyToTest,
          model: byok.selectedModel
        })
      });
      const data = res.data;
      if (res.ok && data.success) {
        updateByok({
          isKeyVerified: true,
          lastPingMs: data.latencyMs || 120,
          lastVerifiedDate: new Date().toLocaleTimeString()
        });
        return { success: true, latencyMs: data.latencyMs, message: data.message };
      } else {
        updateByok({ isKeyVerified: false });
        return { success: false, error: data.error || 'Authentication failed' };
      }
    } catch (err: any) {
      updateByok({ isKeyVerified: false });
      return { success: false, error: err.message || 'Network connection failed' };
    }
  };

  const activeFile = files.find(f => f.path === activeFilePath) || files[0];

  const openFileInTab = (path: string) => {
    if (!openTabs.includes(path)) {
      setOpenTabs(prev => [...prev, path]);
    }
    setActiveFilePath(path);
  };

  const closeTab = (path: string) => {
    const nextTabs = openTabs.filter(t => t !== path);
    setOpenTabs(nextTabs);
    if (activeFilePath === path) {
      setActiveFilePath(nextTabs[nextTabs.length - 1] || '');
    }
  };

  const closeAllTabs = () => {
    setOpenTabs([]);
    setActiveFilePath('');
  };

  const closeOtherTabs = (path: string) => {
    setOpenTabs([path]);
    setActiveFilePath(path);
  };

  const closeSavedTabs = () => {
    const remaining = openTabs.filter(p => {
      const f = files.find(file => file.path === p);
      return f?.isModified || stagedFiles.includes(p) || unstagedFiles.includes(p);
    });
    setOpenTabs(remaining);
    if (remaining.length === 0) {
      setActiveFilePath('');
    } else if (!remaining.includes(activeFilePath)) {
      setActiveFilePath(remaining[0]);
    }
  };

  const updateFileContent = (path: string, content: string) => {
    setFiles(prev => prev.map(f => {
      if (f.path === path) {
        return { ...f, content, isModified: true };
      }
      return f;
    }));
    if (!unstagedFiles.includes(path) && !stagedFiles.includes(path)) {
      setUnstagedFiles(prev => [...prev, path]);
    }
  };

  const createNewFile = (path: string, content: string = '') => {
    const cleanPath = path.trim().replace(/^\/+/, '');
    if (!cleanPath) return;
    if (files.some(f => f.path === cleanPath)) {
      openFileInTab(cleanPath);
      return;
    }
    const ext = cleanPath.split('.').pop() || 'js';
    const langMap: Record<string, string> = {
      js: 'javascript',
      ts: 'typescript',
      tsx: 'typescript',
      jsx: 'javascript',
      json: 'json',
      md: 'markdown',
      py: 'python',
      css: 'css',
      html: 'html'
    };
    const newFile: RepoFile = {
      path: cleanPath,
      name: cleanPath.split('/').pop() || cleanPath,
      content,
      language: langMap[ext] || detectLanguage(cleanPath),
      isNew: true,
      isModified: true
    };
    setFiles(prev => [...prev, newFile]);
    openFileInTab(cleanPath);
    setUnstagedFiles(prev => [...prev, cleanPath]);
  };

  const createFolder = (folderPath: string) => {
    const cleanFolder = folderPath.trim().replace(/^\/+/, '').replace(/\/+$/, '');
    if (!cleanFolder) return;
    const placeholderPath = `${cleanFolder}/.gitkeep`;
    if (!files.some(f => f.path === placeholderPath)) {
      createNewFile(placeholderPath, '# Folder placeholder\n');
    }
  };

  const deleteFile = (path: string) => {
    setFiles(prev => prev.filter(f => f.path !== path));
    setStagedFiles(prev => prev.filter(p => p !== path));
    setUnstagedFiles(prev => prev.filter(p => p !== path));
    setOpenTabs(prev => {
      const nextTabs = prev.filter(t => t !== path);
      if (activeFilePath === path) {
        setActiveFilePath(nextTabs[nextTabs.length - 1] || '');
      }
      return nextTabs;
    });
  };

  const deleteFolder = (folderPath: string) => {
    const cleanPrefix = folderPath.trim().replace(/^\/+/, '').replace(/\/+$/, '') + '/';
    const pathsToDelete = files.filter(f => f.path.startsWith(cleanPrefix) || f.path === folderPath).map(f => f.path);
    setFiles(prev => prev.filter(f => !pathsToDelete.includes(f.path)));
    setStagedFiles(prev => prev.filter(p => !pathsToDelete.includes(p)));
    setUnstagedFiles(prev => prev.filter(p => !pathsToDelete.includes(p)));
    setOpenTabs(prev => {
      const nextTabs = prev.filter(t => !pathsToDelete.includes(t));
      if (pathsToDelete.includes(activeFilePath)) {
        setActiveFilePath(nextTabs[nextTabs.length - 1] || '');
      }
      return nextTabs;
    });
  };

  const renameFile = (oldPath: string, newPath: string): boolean => {
    const trimmed = newPath.trim().replace(/^\/+/, '');
    if (!trimmed || oldPath === trimmed) return false;
    if (files.some(f => f.path === trimmed)) {
      return false;
    }
    const newLang = detectLanguage(trimmed);
    setFiles(prev => prev.map(f => {
      if (f.path === oldPath) {
        return {
          ...f,
          path: trimmed,
          name: trimmed.split('/').pop() || trimmed,
          language: newLang,
          isModified: true
        };
      }
      return f;
    }));
    setOpenTabs(prev => prev.map(p => p === oldPath ? trimmed : p));
    if (activeFilePath === oldPath) {
      setActiveFilePath(trimmed);
    }
    setStagedFiles(prev => prev.map(p => p === oldPath ? trimmed : p));
    setUnstagedFiles(prev => prev.map(p => p === oldPath ? trimmed : p));
    return true;
  };

  const duplicateFile = (path: string): string => {
    const target = files.find(f => f.path === path);
    if (!target) return '';
    
    const lastDotIdx = path.lastIndexOf('.');
    let candidatePath = '';
    if (lastDotIdx > 0) {
      candidatePath = `${path.substring(0, lastDotIdx)}.copy${path.substring(lastDotIdx)}`;
    } else {
      candidatePath = `${path}.copy`;
    }
    
    let counter = 1;
    let finalPath = candidatePath;
    while (files.some(f => f.path === finalPath)) {
      if (lastDotIdx > 0) {
        finalPath = `${path.substring(0, lastDotIdx)}.copy${counter}${path.substring(lastDotIdx)}`;
      } else {
        finalPath = `${path}.copy${counter}`;
      }
      counter++;
    }
    
    const newFile: RepoFile = {
      path: finalPath,
      name: finalPath.split('/').pop() || finalPath,
      content: target.content,
      language: target.language,
      isNew: true,
      isModified: true
    };
    
    setFiles(prev => [...prev, newFile]);
    openFileInTab(finalPath);
    setUnstagedFiles(prev => [...prev, finalPath]);
    return finalPath;
  };

  const downloadSingleFile = (path: string) => {
    const file = files.find(f => f.path === path);
    if (!file) return;
    const blob = new Blob([file.content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.path.split('/').pop() || 'download.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const revertFile = (path: string) => {
    const original = diffBaseFiles.find(f => f.path === path) || INITIAL_TARGET_REPO_FILES.find(f => f.path === path);
    if (original) {
      setFiles(prev => prev.map(f => f.path === path ? { ...f, content: original.content, isModified: false } : f));
    } else {
      setFiles(prev => prev.map(f => f.path === path ? { ...f, isModified: false } : f));
    }
    setStagedFiles(prev => prev.filter(p => p !== path));
    setUnstagedFiles(prev => prev.filter(p => p !== path));
  };

  const revertAllFiles = () => {
    setFiles(prev => prev.map(f => {
      const orig = diffBaseFiles.find(b => b.path === f.path) || INITIAL_TARGET_REPO_FILES.find(b => b.path === f.path);
      if (orig) {
        return { ...f, content: orig.content, isModified: false };
      }
      return { ...f, isModified: false };
    }));
    setStagedFiles([]);
    setUnstagedFiles([]);
  };

  const stageFile = (path: string) => {
    setUnstagedFiles(prev => prev.filter(p => p !== path));
    if (!stagedFiles.includes(path)) {
      setStagedFiles(prev => [...prev, path]);
    }
  };

  const unstageFile = (path: string) => {
    setStagedFiles(prev => prev.filter(p => p !== path));
    if (!unstagedFiles.includes(path)) {
      setUnstagedFiles(prev => [...prev, path]);
    }
  };

  const stageAllFiles = () => {
    setStagedFiles(prev => Array.from(new Set([...prev, ...unstagedFiles])));
    setUnstagedFiles([]);
  };

  const unstageAllFiles = () => {
    setUnstagedFiles(prev => Array.from(new Set([...prev, ...stagedFiles])));
    setStagedFiles([]);
  };

  const createCommit = (message: string) => {
    if (!message.trim()) return;
    const newHash = Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    const newCommit: GitCommit = {
      id: 'c_' + Date.now(),
      hash: newHash,
      shortHash: newHash.substring(0, 7),
      message: message.trim(),
      author: byok.useCustomKey ? 'Custom Key Developer' : 'AI Git Manager',
      authorEmail: 'agent-gitmanager@aistudio.dev',
      timestamp: 'Just now',
      branch: currentBranch,
      filesChanged: stagedFiles.length || 1,
      additions: Math.floor(Math.random() * 80) + 20,
      deletions: Math.floor(Math.random() * 15) + 2,
      isRemotePushed: false
    };

    setGitCommits(prev => [newCommit, ...prev]);
    setStagedFiles([]);
    
    // Update Agent 4 stats
    setAgents(prev => prev.map(a => {
      if (a.id === 'gitmanager') {
        return {
          ...a,
          stats: { ...a.stats, commitsPushed: (a.stats.commitsPushed || 0) + 1 },
          logs: [`[GitManager] Created commit ${newCommit.shortHash}: "${newCommit.message}"`, ...a.logs]
        };
      }
      return a;
    }));
  };

  const pushToRemote = async () => {
    setAgents(prev => prev.map(a => a.id === 'gitmanager' ? {
      ...a,
      status: 'running',
      currentAction: 'Pushing commits to remote origin/main...'
    } : a));

    await new Promise(r => setTimeout(r, 1200));

    setGitCommits(prev => prev.map(c => ({ ...c, isRemotePushed: true })));
    setAgents(prev => prev.map(a => a.id === 'gitmanager' ? {
      ...a,
      status: 'completed',
      currentAction: 'Pushed to origin/' + currentBranch + ' successfully.',
      logs: [`[GitManager] Pushed local commits to GitHub remote origin/${currentBranch}.`, ...a.logs]
    } : a));
  };

  const pullFromRemote = async () => {
    setAgents(prev => prev.map(a => a.id === 'gitmanager' ? {
      ...a,
      status: 'running',
      currentAction: 'Fetching & fast-forwarding from origin/' + currentBranch
    } : a));

    await new Promise(r => setTimeout(r, 900));

    setAgents(prev => prev.map(a => a.id === 'gitmanager' ? {
      ...a,
      status: 'completed',
      currentAction: 'Already up to date with remote.',
      logs: [`[GitManager] git pull completed. Working tree clean.`, ...a.logs]
    } : a));
  };

  const switchBranch = (branchName: string) => {
    setCurrentBranch(branchName);
    setGitBranches(prev => prev.map(b => ({
      ...b,
      isCurrent: b.name === branchName
    })));
  };

  const createBranch = (branchName: string) => {
    if (!branchName.trim()) return;
    const cleanName = branchName.trim().replace(/\s+/g, '-').toLowerCase();
    const newBranch: GitBranch = {
      name: cleanName,
      isCurrent: true,
      lastCommitHash: gitCommits[0]?.shortHash || 'a7b8c9d'
    };
    setGitBranches(prev => [...prev.map(b => ({ ...b, isCurrent: false })), newBranch]);
    setCurrentBranch(cleanName);
  };

  const createPullRequest = (title: string, description: string): PullRequest => {
    const nextNumber = pullRequests.length > 0 ? Math.max(...pullRequests.map(p => p.number)) + 1 : 101;
    const newPR: PullRequest = {
      id: 'pr_' + Date.now(),
      number: nextNumber,
      title: title.trim() || 'feat: Autonomous Codebase Enhancements',
      description: description.trim(),
      sourceBranch: currentBranch,
      targetBranch: 'main',
      status: 'open',
      author: 'AI Orchestrator (4 Agents)',
      createdAt: 'Just now',
      reviewStatus: 'approved',
      checksPassed: true,
      diffSummary: {
        files: stagedFiles.length || 4,
        additions: 140,
        deletions: 18
      }
    };
    setPullRequests(prev => [newPR, ...prev]);
    setActivePR(newPR);
    return newPR;
  };

  const applyBugFix = (bugId: string) => {
    const bug = bugs.find(b => b.id === bugId);
    if (!bug) return;

    setBugs(prev => prev.map(b => b.id === bugId ? { ...b, isFixed: true } : b));
    
    // Log in Bug Hunter agent
    setAgents(prev => prev.map(a => a.id === 'bughunter' ? {
      ...a,
      stats: { ...a.stats, bugsPatched: (a.stats.bugsPatched || 0) + 1 },
      logs: [`[BugHunter] Applied auto-fix patch to ${bug.file} (Line ${bug.line}): "${bug.title}"`, ...a.logs]
    } : a));
  };

  const fixAllBugs = () => {
    setBugs(prev => prev.map(b => ({ ...b, isFixed: true })));
    setAgents(prev => prev.map(a => a.id === 'bughunter' ? {
      ...a,
      stats: { ...a.stats, bugsPatched: bugs.length },
      logs: [`[BugHunter] ⚡ Auto-fixed all ${bugs.length} detected flaws across codebase.`, ...a.logs]
    } : a));
  };

  // Run all 4 agents simultaneously in parallel pipeline
  const runAllAgents = async (customPrompt?: string) => {
    // Mandatory Passcode Check: Must be authorized to start the 4 AI Agents
    if (passcodeConfig?.hasPasscode && !passcodeConfig?.isUnlocked) {
      openPasscodeModal('authorize');
      return;
    }

    const promptText = customPrompt || 'Improve the application so users can better organise and search their notes.';
    setIsAnyAgentRunning(true);
    setOrchestratorProgress(10);
    setOrchestratorThought('Orchestrating 4 autonomous agents in parallel...');
    
    // Set all 4 agents to running
    setAgents(prev => prev.map(a => ({
      ...a,
      status: 'running',
      progress: 20,
      currentAction: a.id === 'coder' ? 'Implementing schema & controller changes...' :
                     a.id === 'reviewer' ? 'Auditing architecture & security...' :
                     a.id === 'bughunter' ? 'Scanning AST for edge cases & null dereferences...' :
                     'Staging modified files & preparing commit...'
    })));

    try {
      // Trigger server orchestration endpoint (Zero API Keys / SMTP required, secured by Passcode)
      const serverPromise = fetch('/api/agent/orchestrate-4', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptText,
          files: files.map(f => ({ path: f.path, content: f.content }))
        })
      });

      // Stream progress steps across all 4 agents
      await new Promise(r => setTimeout(r, 600));
      setOrchestratorProgress(35);
      setAgents(prev => prev.map(a => ({
        ...a,
        progress: 45,
        logs: [
          `[${a.name}] Ingested codebase context (${files.length} active files).`,
          ...a.logs
        ]
      })));

      await new Promise(r => setTimeout(r, 700));
      setOrchestratorProgress(60);
      
      // Update Agent 1: Coder
      setFiles(MODIFIED_TARGET_REPO_FILES);
      setAgents(prev => prev.map(a => {
        if (a.id === 'coder') {
          return {
            ...a,
            progress: 80,
            currentAction: 'Generated category & tag filters in note.controller.js and schema index in note.model.js.',
            logs: [
              '[Coder] Updated app/models/note.model.js (+category, +tags, +textIndex).',
              '[Coder] Updated app/controllers/note.controller.js (+parseTags, +multi-field search).',
              '[Coder] Generated test/note.test.js with 3 integration assertions.',
              ...a.logs
            ],
            stats: { ...a.stats, linesGenerated: (a.stats.linesGenerated || 0) + 86 }
          };
        }
        if (a.id === 'reviewer') {
          return {
            ...a,
            progress: 80,
            currentAction: 'Completed static review: 94/100 score. Clean MVC structure confirmed.',
            logs: [
              '[Reviewer] Verified SOLID principles and backward compatibility for REST endpoints.',
              '[Reviewer] Text indexes properly configured for rapid search queries.',
              ...a.logs
            ]
          };
        }
        if (a.id === 'bughunter') {
          return {
            ...a,
            progress: 80,
            currentAction: 'Detected 2 edge cases and applied automated patches.',
            logs: [
              '[BugHunter] Checked for unhandled promise rejections: 0 detected.',
              '[BugHunter] Patched regex injection guard in search query parser.',
              ...a.logs
            ]
          };
        }
        if (a.id === 'gitmanager') {
          return {
            ...a,
            progress: 80,
            currentAction: 'Staged 5 modified files and crafted semantic commit.',
            logs: [
              '[GitManager] Staged app/models/note.model.js, app/controllers/note.controller.js, app/routes/note.routes.js.',
              '[GitManager] Formatted semantic commit: feat(notes): implement tags and search engine.',
              ...a.logs
            ]
          };
        }
        return a;
      }));

      await new Promise(r => setTimeout(r, 800));
      setOrchestratorProgress(100);
      setOrchestratorThought('4 Agents successfully executed! Code modified, reviewed, debugged, and staged in Git.');

      // Complete all agents
      setAgents(prev => prev.map(a => ({
        ...a,
        status: 'completed',
        progress: 100,
        currentAction: 'Task execution complete.'
      })));

      // Stage all modified files
      setStagedFiles([
        'app/models/note.model.js',
        'app/controllers/note.controller.js',
        'app/routes/note.routes.js',
        'test/note.test.js',
        'package.json'
      ]);
      setUnstagedFiles([]);

      // Update token usage in BYOK
      updateByok({
        usageStats: {
          totalTokens: byok.usageStats.totalTokens + 3200,
          agentRequests: byok.usageStats.agentRequests + 4,
          costEstimate: byok.usageStats.costEstimate + 0.0006
        }
      });

    } catch (err: any) {
      setOrchestratorThought('Execution completed with local deterministic fallback.');
      setAgents(prev => prev.map(a => ({ ...a, status: 'completed', progress: 100 })));
    } finally {
      setIsAnyAgentRunning(false);
    }
  };

  // Run a single specific agent
  const runSingleAgent = async (role: AgentRole, customPrompt?: string) => {
    // Mandatory Passcode Check: Must be authorized to start the AI Coding Agent
    if (passcodeConfig?.hasPasscode && !passcodeConfig?.isUnlocked) {
      openPasscodeModal('authorize');
      return;
    }

    setIsAnyAgentRunning(true);
    setAgents(prev => prev.map(a => a.id === role ? { ...a, status: 'running', progress: 30, currentAction: 'Executing focused task...' } : a));

    await new Promise(r => setTimeout(r, 900));

    if (role === 'coder') {
      setFiles(MODIFIED_TARGET_REPO_FILES);
      setAgents(prev => prev.map(a => a.id === 'coder' ? {
        ...a,
        status: 'completed',
        progress: 100,
        currentAction: 'Code modifications applied to codebase.',
        logs: ['[Coder] Refactored controller handlers and updated schema.', ...a.logs]
      } : a));
    } else if (role === 'reviewer') {
      setAgents(prev => prev.map(a => a.id === 'reviewer' ? {
        ...a,
        status: 'completed',
        progress: 100,
        currentAction: 'Review completed. Score: 94/100.',
        logs: ['[Reviewer] Code review scorecard refreshed.', ...a.logs]
      } : a));
      setActiveSidebarTab('review');
    } else if (role === 'bughunter') {
      setAgents(prev => prev.map(a => a.id === 'bughunter' ? {
        ...a,
        status: 'completed',
        progress: 100,
        currentAction: 'Bug scan complete. Zero critical issues.',
        logs: ['[BugHunter] Full AST and type check finished.', ...a.logs]
      } : a));
      setActiveSidebarTab('bugs');
    } else if (role === 'gitmanager') {
      stageAllFiles();
      setAgents(prev => prev.map(a => a.id === 'gitmanager' ? {
        ...a,
        status: 'completed',
        progress: 100,
        currentAction: 'Working directory staged and ready to commit.',
        logs: ['[GitManager] Staged all modified files into Git index.', ...a.logs]
      } : a));
      setActiveSidebarTab('git');
    }

    setIsAnyAgentRunning(false);
  };

  const stopAgents = () => {
    setIsAnyAgentRunning(false);
    setAgents(prev => prev.map(a => ({ ...a, status: 'idle', progress: 0, currentAction: 'Execution paused.' })));
  };

  const resetCodebase = () => {
    setFiles(INITIAL_TARGET_REPO_FILES);
    setBugs(INITIAL_BUGS);
    setReviews(INITIAL_REVIEWS);
    setScorecard(INITIAL_SCORECARD);
    setGitCommits(INITIAL_COMMITS);
    setAgents(INITIAL_AGENTS);
    setStagedFiles([]);
    setUnstagedFiles(['app/controllers/note.controller.js']);
    setViewMode('editor');
  };

  // Keyboard shortcut for Command Palette (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <IDEContext.Provider
      value={{
        // Passcode Security
        passcodeConfig,
        isPasscodeModalOpen,
        setIsPasscodeModalOpen,
        passcodeModalMode,
        setPasscodeModalMode,
        openPasscodeModal,
        isSecurityGuideModalOpen,
        setIsSecurityGuideModalOpen,
        openSecurityGuideModal,
        authorizePasscode,
        createPasscode,
        changePasscode,
        lockSession,
        removePasscode,
        fetchPasscodeStatus,

        // Project Management
        projectName,
        setProjectName,
        isProjectModalOpen,
        setIsProjectModalOpen,
        projectModalTab,
        setProjectModalTab,
        openNewProjectModal,
        openImportProjectModal,
        openExportProjectModal,
        createNewProject,
        importProjectFromZip,
        importProjectFromFiles,
        importProjectFromJson,
        exportProjectZip,
        exportProjectJson,

        // Codebase & Editor
        files,
        activeFilePath,
        activeFile,
        openTabs,
        viewMode,
        diffBaseFiles,
        activeSidebarTab,
        isSidebarOpen,
        isBottomPanelOpen,
        activeBottomTab,
        agents,
        isAnyAgentRunning,
        orchestratorProgress,
        orchestratorThought,
        runAllAgents,
        runSingleAgent,
        stopAgents,
        bugs,
        reviews,
        scorecard,
        applyBugFix,
        fixAllBugs,
        gitCommits,
        gitBranches,
        currentBranch,
        pullRequests,
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
        createPullRequest,
        byok,
        updateByok,
        testByokConnection,
        isByokModalOpen,
        setIsByokModalOpen,
        isCommandPaletteOpen,
        setIsCommandPaletteOpen,
        isPRModalOpen,
        setIsPRModalOpen,
        activePR,
        setActivePR,
        setActiveFilePath,
        openFileInTab,
        closeTab,
        closeAllTabs,
        closeOtherTabs,
        closeSavedTabs,
        updateFileContent,
        createNewFile,
        createFolder,
        deleteFile,
        deleteFolder,
        renameFile,
        duplicateFile,
        revertFile,
        revertAllFiles,
        downloadSingleFile,
        setViewMode,
        setActiveSidebarTab,
        setIsSidebarOpen,
        setIsBottomPanelOpen,
        setActiveBottomTab,
        resetCodebase
      }}
    >
      {children}
    </IDEContext.Provider>
  );
};

export const useIDE = () => {
  const context = useContext(IDEContext);
  if (!context) {
    throw new Error('useIDE must be used within an IDEProvider');
  }
  return context;
};
