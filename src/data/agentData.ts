import { AgentInfo, CodeBug, ReviewAnnotation, CodeReviewScorecard, GitCommit, GitBranch, PullRequest, BYOKSettings } from '../types';

export const INITIAL_AGENTS: AgentInfo[] = [
  {
    id: 'coder',
    name: 'Coder & Architect',
    shortTitle: 'Coder Agent',
    roleDescription: 'Generates code, implements feature requirements, refactors components, and writes tests.',
    iconName: 'Code2',
    accentColor: '#6366F1',
    bgGradient: 'from-indigo-500/20 to-purple-500/10',
    status: 'idle',
    progress: 0,
    currentAction: 'Standing by for user directives...',
    thoughtStream: [
      'Initialized repository AST parser.',
      'Ready to implement features and generate code modifications.'
    ],
    logs: [
      '[Coder] Agent initialized and waiting for instructions.',
      '[Coder] Target repository analysis model ready.'
    ],
    toolCallsCount: 0,
    stats: {
      linesGenerated: 142
    }
  },
  {
    id: 'reviewer',
    name: 'Code Reviewer',
    shortTitle: 'Review Agent',
    roleDescription: 'Audits code quality, clean architecture, performance, and security vulnerabilities.',
    iconName: 'ShieldCheck',
    accentColor: '#10B981',
    bgGradient: 'from-emerald-500/20 to-teal-500/10',
    status: 'idle',
    progress: 0,
    currentAction: 'Ready to review code changes and score quality.',
    thoughtStream: [
      'Security rule engine loaded (OWASP top 10).',
      'Clean Code & SOLID compliance rules active.'
    ],
    logs: [
      '[Reviewer] Static analysis heuristics loaded.',
      '[Reviewer] Architectural standards verification active.'
    ],
    toolCallsCount: 0,
    stats: {
      issuesFound: 4
    }
  },
  {
    id: 'bughunter',
    name: 'Bug Hunter & Fixer',
    shortTitle: 'Bug Hunter',
    roleDescription: 'Scans for logic errors, runtime crashes, null dereferences, and auto-generates fixes.',
    iconName: 'Bug',
    accentColor: '#F59E0B',
    bgGradient: 'from-amber-500/20 to-orange-500/10',
    status: 'idle',
    progress: 0,
    currentAction: 'Monitoring codebase for runtime errors & type flaws.',
    thoughtStream: [
      'Exception trace analyzer standing by.',
      'Self-healing patch engine ready.'
    ],
    logs: [
      '[BugHunter] Type safety and null pointer detector ready.',
      '[BugHunter] Automated patch generator armed.'
    ],
    toolCallsCount: 0,
    stats: {
      bugsPatched: 2
    }
  },
  {
    id: 'gitmanager',
    name: 'Git & GitHub Manager',
    shortTitle: 'Git Manager',
    roleDescription: 'Handles stage, semantic commits, branch switching, push/pull, and GitHub PR creation.',
    iconName: 'GitPullRequest',
    accentColor: '#EC4899',
    bgGradient: 'from-pink-500/20 to-rose-500/10',
    status: 'idle',
    progress: 0,
    currentAction: 'Tracking git status & working tree changes.',
    thoughtStream: [
      'Local git working directory linked (branch: main).',
      'GitHub remote tracking active: origin/main.'
    ],
    logs: [
      '[GitManager] Repository git index synced.',
      '[GitManager] Semantic commit generator loaded.'
    ],
    toolCallsCount: 0,
    stats: {
      commitsPushed: 6
    }
  }
];

export const INITIAL_BYOK_SETTINGS: BYOKSettings = {
  provider: 'gemini',
  geminiApiKey: '',
  openaiApiKey: '',
  anthropicApiKey: '',
  customEndpoint: 'https://api.openai.com/v1',
  customApiKey: '',
  selectedModel: 'gemini-3.7-flash',
  useCustomKey: false,
  isKeyVerified: false,
  lastPingMs: 112,
  usageStats: {
    totalTokens: 18450,
    agentRequests: 14,
    costEstimate: 0.003
  }
};

export const INITIAL_BUGS: CodeBug[] = [
  {
    id: 'bug_1',
    file: 'app/controllers/note.controller.js',
    line: 96,
    severity: 'critical',
    type: 'runtime',
    title: 'Potential Unhandled Exception on Missing Request Body',
    description: 'Accessing req.body.content without validating that req.body exists causes a TypeError crash on malformed requests without JSON body headers.',
    suggestedFix: 'Add guard check: if (!req.body || !req.body.content) return res.status(400)...',
    patchCode: `// Fixed: Safe guard for req.body existence\nif (!req.body || !req.body.content) {\n    return res.status(400).send({ message: "Note content can not be empty" });\n}`,
    isFixed: false
  },
  {
    id: 'bug_2',
    file: 'app/controllers/note.controller.js',
    line: 348,
    severity: 'high',
    type: 'security',
    title: 'Unsanitized Regex Injection in Query Filter',
    description: 'Passing raw user input directly into new RegExp(searchTerm, "i") can result in ReDoS (Regular Expression Denial of Service) if malicious symbols like (a+)+ are supplied.',
    suggestedFix: 'Escape special regex characters using escapeRegExp helper before constructing RegExp.',
    patchCode: `// Fixed: Escape regex special characters to prevent ReDoS\nconst escapeRegex = (str) => str.replace(/[.*+?^\${}()|[\\]\\\\]/g, '\\\\$&');\nconst regex = new RegExp(escapeRegex(searchTerm), 'i');`,
    isFixed: true
  },
  {
    id: 'bug_3',
    file: 'app/models/note.model.js',
    line: 282,
    severity: 'medium',
    type: 'type-error',
    title: 'Mongoose Default Array Mutation Reference',
    description: 'Using default: [] directly can share default array instances across schema documents in older Mongoose versions.',
    suggestedFix: 'Define default as a factory function default: () => [] or validate array on initialization.',
    patchCode: `tags: {\n    type: [String],\n    default: () => []\n}`,
    isFixed: true
  },
  {
    id: 'bug_4',
    file: 'server.js',
    line: 50,
    severity: 'low',
    type: 'logic',
    title: 'Immediate Process Exit on Connection Blip',
    description: 'Calling process.exit() immediately without retry logic crashes container abruptly on transient database startup delays.',
    suggestedFix: 'Implement exponential backoff retry loop (3 retries) before terminating process.',
    patchCode: `// Retry database connection with backoff\nconst connectWithRetry = (retries = 3) => {\n    mongoose.connect(dbConfig.url, { useNewUrlParser: true })\n    .catch(err => {\n        if (retries > 0) setTimeout(() => connectWithRetry(retries - 1), 3000);\n        else process.exit(1);\n    });\n};`,
    isFixed: false
  }
];

export const INITIAL_REVIEWS: ReviewAnnotation[] = [
  {
    id: 'rev_1',
    file: 'app/controllers/note.controller.js',
    line: 305,
    category: 'clean-code',
    level: 'kudos',
    title: 'Robust Tag Normalization Helper',
    comment: 'Great implementation of parseTags utility handling both comma-separated strings and native arrays cleanly with trimmed lowercase normalization.',
    suggestion: 'Consider exporting parseTags to a dedicated /app/utils/formatters.js module for testability.'
  },
  {
    id: 'rev_2',
    file: 'app/models/note.model.js',
    line: 290,
    category: 'performance',
    level: 'info',
    title: 'Compound Text Index',
    comment: 'The compound text index on title, content, category, and tags significantly speeds up wildcard full-text queries.',
    suggestion: 'Consider adding weights to prioritize title matches (weight: 10) over content (weight: 5).'
  },
  {
    id: 'rev_3',
    file: 'app/routes/note.routes.js',
    line: 498,
    category: 'architecture',
    level: 'warning',
    title: 'Route Declaration Ordering',
    comment: 'Specific routes like /notes/search and /notes/meta must precede parameterized route /notes/:noteId to prevent route parameter collision.',
    suggestion: 'Maintain explicit ordering and consider mounting a dedicated express.Router for /api/v1/notes.'
  },
  {
    id: 'rev_4',
    file: 'test/note.test.js',
    line: 520,
    category: 'best-practice',
    level: 'kudos',
    title: 'High Test Coverage Verification',
    comment: 'Excellent integration testing covering schema defaulting, tag normalization, and multi-field query filters without heavyweight external test runners.'
  }
];

export const INITIAL_SCORECARD: CodeReviewScorecard = {
  overallScore: 94,
  cleanlinessScore: 96,
  securityScore: 92,
  performanceScore: 95,
  maintainabilityScore: 93,
  summary: 'The codebase demonstrates high cohesion and clean MVC separation. The addition of category and tag indexing expands search capabilities while strictly preserving backwards compatibility for existing REST endpoints.',
  keyStrengths: [
    'Zero-breaking change extension of existing Mongoose schema and REST endpoints.',
    'Efficient regex and text index query matching with sort ordering.',
    'Clean input normalization for multiple tag formats (arrays & comma strings).',
    'Comprehensive automated unit test suite with 100% test pass rate.'
  ],
  criticalRisks: [
    'Ensure regex queries escape user-supplied symbols to safeguard against ReDoS attacks.'
  ],
  recommendations: [
    'Extract query helper functions into a reusable QueryBuilder utility.',
    'Add pagination parameters (limit & skip) to GET /notes for scaling large collections.'
  ]
};

export const INITIAL_COMMITS: GitCommit[] = [
  {
    id: 'c_1',
    hash: 'a7b8c9d0e1f234567890abcdef1234567890abcd',
    shortHash: 'a7b8c9d',
    message: 'feat(notes): implement tags, categories and multi-field search engine',
    author: 'AI Coder Agent',
    authorEmail: 'agent-coder@aistudio.dev',
    timestamp: 'Just now',
    branch: 'feature/notes-organization-search',
    filesChanged: 5,
    additions: 184,
    deletions: 22,
    isRemotePushed: true
  },
  {
    id: 'c_2',
    hash: '8f9e0a1b2c3d4e5f67890123456789abcdef0123',
    shortHash: '8f9e0a1',
    message: 'test(notes): add automated unit test suite for tag parsing and search filters',
    author: 'AI Bug Hunter Agent',
    authorEmail: 'agent-bughunter@aistudio.dev',
    timestamp: '2 mins ago',
    branch: 'feature/notes-organization-search',
    filesChanged: 1,
    additions: 78,
    deletions: 0,
    isRemotePushed: true
  },
  {
    id: 'c_3',
    hash: 'e4f5a6b7c8d90123456789abcdef0123456789ab',
    shortHash: 'e4f5a6b',
    message: 'docs: update README with new endpoints and category search guide',
    author: 'AI Reviewer Agent',
    authorEmail: 'agent-reviewer@aistudio.dev',
    timestamp: '5 mins ago',
    branch: 'feature/notes-organization-search',
    filesChanged: 1,
    additions: 24,
    deletions: 6,
    isRemotePushed: true
  },
  {
    id: 'c_4',
    hash: '3d4e5f6a7b8c901234567890abcdef1234567890',
    shortHash: '3d4e5f6',
    message: 'refactor(controller): extract parseTags helper and apply ReDoS escaping',
    author: 'AI Coder Agent',
    authorEmail: 'agent-coder@aistudio.dev',
    timestamp: '12 mins ago',
    branch: 'feature/notes-organization-search',
    filesChanged: 2,
    additions: 38,
    deletions: 14,
    isRemotePushed: false
  },
  {
    id: 'c_5',
    hash: '1a2b3c4d5e6f7890123456789abcdef012345678',
    shortHash: '1a2b3c4',
    message: 'chore: initial commit of node-easy-notes-app base project',
    author: 'Dev Lead',
    authorEmail: 'oomkarchavan@gmail.com',
    timestamp: '2 hours ago',
    branch: 'main',
    filesChanged: 7,
    additions: 240,
    deletions: 0,
    isRemotePushed: true
  }
];

export const INITIAL_BRANCHES: GitBranch[] = [
  { name: 'feature/notes-organization-search', isCurrent: true, lastCommitHash: 'a7b8c9d' },
  { name: 'main', isCurrent: false, lastCommitHash: '1a2b3c4', isProtected: true },
  { name: 'dev', isCurrent: false, lastCommitHash: '1a2b3c4' }
];

export const INITIAL_PULL_REQUESTS: PullRequest[] = [
  {
    id: 'pr_101',
    number: 101,
    title: 'feat: Autonomous Note Organization & Multi-Field Search Engine',
    description: `### 🎯 Summary of Changes
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
- **Git Manager Agent**: Staged, verified, and crafted this Pull Request ready for merge.`,
    sourceBranch: 'feature/notes-organization-search',
    targetBranch: 'main',
    status: 'open',
    author: 'AI Coding Agent (Orchestrator)',
    createdAt: 'Just now',
    reviewStatus: 'approved',
    checksPassed: true,
    diffSummary: {
      files: 5,
      additions: 184,
      deletions: 22
    }
  }
];
