/**
 * Workspace Storage Manager
 * 
 * Provides robust, versioned localStorage persistence and hydration for all
 * IDE workspace state:
 * - Codebase files, modifications, and active file
 * - Open tabs and editor/diff view modes
 * - 4 Autonomous agent execution logs and orchestrator status
 * - Code review scores and Bug Hunter patches
 * - Git repository commits, branches, pull requests, and staged files
 * - UI layout states (sidebar open/tab, bottom panel tab)
 * - BYOK API Keys & Usage statistics
 */

import {
  RepoFile,
  AgentInfo,
  CodeBug,
  ReviewAnnotation,
  CodeReviewScorecard,
  GitCommit,
  GitBranch,
  PullRequest,
  BYOKSettings
} from '../types';

import {
  INITIAL_TARGET_REPO_FILES
} from '../data/targetRepoData';

import {
  INITIAL_AGENTS,
  INITIAL_BYOK_SETTINGS,
  INITIAL_BUGS,
  INITIAL_REVIEWS,
  INITIAL_SCORECARD,
  INITIAL_COMMITS,
  INITIAL_BRANCHES,
  INITIAL_PULL_REQUESTS
} from '../data/agentData';

const KEYS = {
  FILES: 'ide_workspace_files_v2',
  DIFF_BASE_FILES: 'ide_workspace_diff_base_v2',
  PROJECT_NAME: 'ide_workspace_project_name_v2',
  ACTIVE_FILE: 'ide_workspace_active_file_v2',
  OPEN_TABS: 'ide_workspace_open_tabs_v2',
  VIEW_MODE: 'ide_workspace_view_mode_v2',
  UI_STATE: 'ide_workspace_ui_state_v2',
  AGENTS: 'ide_workspace_agents_v2',
  ORCHESTRATOR: 'ide_workspace_orchestrator_v2',
  BUGS: 'ide_workspace_bugs_v2',
  REVIEWS: 'ide_workspace_reviews_v2',
  SCORECARD: 'ide_workspace_scorecard_v2',
  GIT: 'ide_workspace_git_v2',
  BYOK: 'byok_settings'
};

// Safe JSON Parse helper
function safeGet<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return parsed !== null && parsed !== undefined ? parsed : fallback;
  } catch {
    return fallback;
  }
}

// Safe JSON Stringify helper
function safeSet<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn(`[WorkspaceStorage] Failed to save ${key}:`, e);
  }
}

export interface StoredUIState {
  activeSidebarTab: 'explorer' | 'agents' | 'review' | 'bugs' | 'git' | 'settings';
  isSidebarOpen: boolean;
  isBottomPanelOpen: boolean;
  activeBottomTab: 'console' | 'tests' | 'review' | 'bugs' | 'git' | 'sandbox';
}

export interface StoredGitState {
  gitCommits: GitCommit[];
  gitBranches: GitBranch[];
  currentBranch: string;
  pullRequests: PullRequest[];
  stagedFiles: string[];
  unstagedFiles: string[];
}

export interface StoredOrchestratorState {
  progress: number;
  thought: string;
}

// ==================== HYDRATION FUNCTIONS (CALLED ON INITIAL LOAD) ====================

export function loadStoredFiles(): RepoFile[] {
  const loaded = safeGet<RepoFile[] | null>(KEYS.FILES, null);
  if (Array.isArray(loaded)) {
    return loaded;
  }
  // Default to clean empty workspace on first startup
  return [];
}

export function loadStoredDiffBaseFiles(): RepoFile[] {
  const loaded = safeGet<RepoFile[] | null>(KEYS.DIFF_BASE_FILES, null);
  if (Array.isArray(loaded)) {
    return loaded;
  }
  return [];
}

export function loadStoredProjectName(): string {
  return safeGet<string>(KEYS.PROJECT_NAME, 'my-workspace');
}

export function loadStoredActiveFilePath(availableFiles: RepoFile[]): string {
  const stored = safeGet<string>(KEYS.ACTIVE_FILE, '');
  if (stored && availableFiles.some(f => f.path === stored)) {
    return stored;
  }
  return availableFiles[0]?.path || '';
}

export function loadStoredOpenTabs(availableFiles: RepoFile[]): string[] {
  const stored = safeGet<string[] | null>(KEYS.OPEN_TABS, null);
  if (Array.isArray(stored)) {
    return stored.filter(t => availableFiles.some(f => f.path === t));
  }
  // Default to no open tabs on fresh start
  return [];
}

export function loadStoredViewMode(): 'editor' | 'diff' {
  return safeGet<'editor' | 'diff'>(KEYS.VIEW_MODE, 'editor');
}

export function loadStoredUIState(): StoredUIState {
  return safeGet<StoredUIState>(KEYS.UI_STATE, {
    activeSidebarTab: 'explorer',
    isSidebarOpen: true,
    isBottomPanelOpen: true,
    activeBottomTab: 'console'
  });
}

export function loadStoredAgents(): AgentInfo[] {
  const loaded = safeGet<AgentInfo[]>(KEYS.AGENTS, INITIAL_AGENTS);
  if (Array.isArray(loaded) && loaded.length === INITIAL_AGENTS.length) {
    return loaded;
  }
  return INITIAL_AGENTS;
}

export function loadStoredOrchestrator(): StoredOrchestratorState {
  return safeGet<StoredOrchestratorState>(KEYS.ORCHESTRATOR, {
    progress: 0,
    thought: 'Ready to orchestrate 4 autonomous agents across your codebase.'
  });
}

export function loadStoredBugs(): CodeBug[] {
  const loaded = safeGet<CodeBug[]>(KEYS.BUGS, INITIAL_BUGS);
  if (Array.isArray(loaded)) {
    return loaded;
  }
  return INITIAL_BUGS;
}

export function loadStoredReviews(): ReviewAnnotation[] {
  const loaded = safeGet<ReviewAnnotation[]>(KEYS.REVIEWS, INITIAL_REVIEWS);
  if (Array.isArray(loaded)) {
    return loaded;
  }
  return INITIAL_REVIEWS;
}

export function loadStoredScorecard(): CodeReviewScorecard {
  return safeGet<CodeReviewScorecard>(KEYS.SCORECARD, INITIAL_SCORECARD);
}

export function loadStoredGitState(): StoredGitState {
  return safeGet<StoredGitState>(KEYS.GIT, {
    gitCommits: [],
    gitBranches: [{ name: 'main', isCurrent: true, lastCommitHash: 'init' }],
    currentBranch: 'main',
    pullRequests: [],
    stagedFiles: [],
    unstagedFiles: []
  });
}

export function loadStoredBYOK(): BYOKSettings {
  return safeGet<BYOKSettings>(KEYS.BYOK, INITIAL_BYOK_SETTINGS);
}

// ==================== PERSISTENCE FUNCTIONS ====================

export function persistFiles(files: RepoFile[]): void {
  safeSet(KEYS.FILES, files);
}

export function persistDiffBaseFiles(diffBaseFiles: RepoFile[]): void {
  safeSet(KEYS.DIFF_BASE_FILES, diffBaseFiles);
}

export function persistProjectName(name: string): void {
  safeSet(KEYS.PROJECT_NAME, name);
}

export function persistActiveFilePath(path: string): void {
  safeSet(KEYS.ACTIVE_FILE, path);
}

export function persistOpenTabs(tabs: string[]): void {
  safeSet(KEYS.OPEN_TABS, tabs);
}

export function persistViewMode(mode: 'editor' | 'diff'): void {
  safeSet(KEYS.VIEW_MODE, mode);
}

export function persistUIState(ui: StoredUIState): void {
  safeSet(KEYS.UI_STATE, ui);
}

export function persistAgents(agents: AgentInfo[]): void {
  safeSet(KEYS.AGENTS, agents);
}

export function persistOrchestrator(progress: number, thought: string): void {
  safeSet(KEYS.ORCHESTRATOR, { progress, thought });
}

export function persistBugs(bugs: CodeBug[]): void {
  safeSet(KEYS.BUGS, bugs);
}

export function persistReviews(reviews: ReviewAnnotation[]): void {
  safeSet(KEYS.REVIEWS, reviews);
}

export function persistScorecard(scorecard: CodeReviewScorecard): void {
  safeSet(KEYS.SCORECARD, scorecard);
}

export function persistGitState(git: StoredGitState): void {
  safeSet(KEYS.GIT, git);
}

export function persistBYOK(byok: BYOKSettings): void {
  safeSet(KEYS.BYOK, byok);
}

// ==================== RESET WORKSPACE STORAGE ====================

export function clearWorkspaceStorage(): void {
  Object.values(KEYS).forEach(k => {
    if (k !== KEYS.BYOK) {
      try {
        localStorage.removeItem(k);
      } catch {}
    }
  });
}
