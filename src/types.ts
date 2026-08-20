export type AgentRole = 'coder' | 'reviewer' | 'bughunter' | 'gitmanager';

export type AgentStatus = 'idle' | 'running' | 'completed' | 'failed' | 'paused';

export interface AgentInfo {
  id: AgentRole;
  name: string;
  shortTitle: string;
  roleDescription: string;
  iconName: string;
  accentColor: string; // Hex or Tailwind class
  bgGradient: string;
  status: AgentStatus;
  progress: number; // 0-100
  currentAction: string;
  thoughtStream: string[];
  logs: string[];
  toolCallsCount: number;
  stats: {
    linesGenerated?: number;
    issuesFound?: number;
    bugsPatched?: number;
    commitsPushed?: number;
  };
}

export interface RepoFile {
  path: string;
  name?: string;
  content: string;
  language: string;
  isModified?: boolean;
  isNew?: boolean;
  isStaged?: boolean;
  originalContent?: string;
}

export type BugSeverity = 'critical' | 'high' | 'medium' | 'low';

export interface CodeBug {
  id: string;
  file: string;
  line: number;
  column?: number;
  severity: BugSeverity;
  type: 'syntax' | 'runtime' | 'security' | 'logic' | 'type-error' | 'performance';
  title: string;
  description: string;
  suggestedFix: string;
  patchCode?: string;
  isFixed: boolean;
}

export interface AgentExecutionState {
  stage: 'idle' | 'exploring' | 'identifying' | 'planning' | 'modifying' | 'testing' | 'completed' | 'failed';
  progress: number;
  currentStepDescription: string;
  logs: string[];
  toolCalls: any[];
  plan: ExecutionPlanStep[];
  identifiedFiles: string[];
  summary?: any;
}

export interface ReviewAnnotation {
  id: string;
  file: string;
  line: number;
  category: 'architecture' | 'clean-code' | 'security' | 'performance' | 'best-practice';
  level: 'error' | 'warning' | 'info' | 'kudos';
  title: string;
  comment: string;
  suggestion?: string;
}

export interface CodeReviewScorecard {
  overallScore: number; // 0-100
  cleanlinessScore: number;
  securityScore: number;
  performanceScore: number;
  maintainabilityScore: number;
  summary: string;
  keyStrengths: string[];
  criticalRisks: string[];
  recommendations: string[];
}

export interface GitCommit {
  id: string;
  hash: string;
  shortHash: string;
  message: string;
  author: string;
  authorEmail: string;
  timestamp: string;
  branch: string;
  filesChanged: number;
  additions: number;
  deletions: number;
  isRemotePushed: boolean;
}

export interface GitBranch {
  name: string;
  isCurrent: boolean;
  lastCommitHash: string;
  isProtected?: boolean;
}

export interface PullRequest {
  id: string;
  number: number;
  title: string;
  description: string;
  sourceBranch: string;
  targetBranch: string;
  status: 'open' | 'merged' | 'draft' | 'closed';
  author: string;
  createdAt: string;
  reviewStatus: 'approved' | 'changes_requested' | 'pending';
  checksPassed: boolean;
  diffSummary: {
    files: number;
    additions: number;
    deletions: number;
  };
}

export type LLMProvider = 'gemini' | 'openai' | 'anthropic' | 'custom';

export interface BYOKSettings {
  provider: LLMProvider;
  geminiApiKey: string;
  openaiApiKey: string;
  anthropicApiKey: string;
  customEndpoint: string;
  customApiKey: string;
  selectedModel: string;
  useCustomKey: boolean;
  isKeyVerified: boolean;
  lastPingMs?: number;
  lastVerifiedDate?: string;
  usageStats: {
    totalTokens: number;
    agentRequests: number;
    costEstimate: number;
  };
}

export interface ExecutionPlanStep {
  id: number;
  title: string;
  description: string;
  targetFiles: string[];
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
}

export interface Note {
  _id: string;
  title: string;
  content: string;
  category?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface PasscodeConfig {
  hasPasscode: boolean;
  isUnlocked: boolean;
  hint?: string;
  developerName?: string;
  createdAt?: string;
  hashAlgorithm?: string;
  hashPreview?: string; // e.g. "sha256:7f83b165...e24"
  salt?: string;
  saltPreview?: string;
  failedAttempts?: number;
  isLockedOut?: boolean;
  remainingLockoutSeconds?: number;
  database?: string;
  securityFeatures?: {
    serverValidation?: string;
    rateLimiting?: string;
    progressiveDelay?: string;
    hashAlgorithm?: string;
    storageEncryption?: string;
    timingSafe?: boolean;
    genericErrors?: boolean;
  };
}

export interface PasscodeSession {
  isUnlocked: boolean;
  sessionToken?: string;
  unlockedAt?: string;
}

export interface PythonAgentFile {
  name: string;
  filename: string;
  description: string;
  content: string;
  language: string;
}

export interface ProjectMetadata {
  name: string;
  description: string;
  version: string;
  templateId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectTemplate {
  id: string;
  name: string;
  tagline: string;
  description: string;
  category: 'node' | 'react' | 'python' | 'blank';
  icon: string;
  files: RepoFile[];
}

export type PasscodeModalMode = 'authorize' | 'create' | 'change' | 'security_info';

export interface SecurityAuditItem {
  id: string;
  title: string;
  status: 'DONE' | 'IN_PROGRESS' | 'TODO';
  details: string;
  technologies: string[];
}

export interface SecurityAuditData {
  success: boolean;
  timestamp: string;
  checklist: SecurityAuditItem[];
  metrics: {
    hasPasscode: boolean;
    isUnlocked: boolean;
    failedAttempts: number;
    isLockedOut: boolean;
    activeRateLimitedIps: number;
    algorithm: string;
    workFactor: string;
    encryption: string;
  };
}

