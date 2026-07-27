export interface RepoFile {
  path: string;
  content: string;
  language: string;
  isModified?: boolean;
  originalContent?: string;
}

export type AgentStage = 
  | 'idle'
  | 'exploring'
  | 'identifying'
  | 'planning'
  | 'modifying'
  | 'testing'
  | 'summarizing'
  | 'completed'
  | 'error';

export interface AgentToolCall {
  id: string;
  timestamp: string;
  tool: 'list_dir' | 'read_file' | 'search_code' | 'edit_file' | 'run_tests' | 'git_diff';
  args: Record<string, any>;
  result: string;
  status: 'success' | 'failed' | 'running';
}

export interface ExecutionPlanStep {
  id: number;
  title: string;
  description: string;
  targetFiles: string[];
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
}

export interface AgentExecutionState {
  stage: AgentStage;
  progress: number; // 0 to 100
  currentStepDescription: string;
  logs: string[];
  toolCalls: AgentToolCall[];
  plan: ExecutionPlanStep[];
  identifiedFiles: string[];
  summary: {
    overview: string;
    filesModified: string[];
    featuresAdded: string[];
    preservedFunctionality: string[];
    tradeOffs: string[];
    testResults: {
      total: number;
      passed: number;
      failed: number;
      details: string[];
    };
  } | null;
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

export interface PythonAgentFile {
  name: string;
  filename: string;
  description: string;
  content: string;
  language: string;
}
