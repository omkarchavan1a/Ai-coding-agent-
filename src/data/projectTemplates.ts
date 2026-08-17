import { ProjectTemplate, RepoFile } from '../types';
import { INITIAL_TARGET_REPO_FILES } from './targetRepoData';
import { PYTHON_AGENT_FILES } from './pythonAgentSource';

// 1. Node Easy Notes App
const NODE_NOTES_TEMPLATE_FILES: RepoFile[] = INITIAL_TARGET_REPO_FILES;

// 2. Full-Stack React + TypeScript App
const REACT_VITE_TEMPLATE_FILES: RepoFile[] = [
  {
    path: 'package.json',
    language: 'json',
    content: JSON.stringify({
      name: 'react-enterprise-app',
      private: true,
      version: '1.0.0',
      type: 'module',
      scripts: {
        dev: 'vite',
        build: 'tsc -b && vite build',
        preview: 'vite preview'
      },
      dependencies: {
        react: '^19.0.0',
        'react-dom': '^19.0.0',
        'lucide-react': '^0.546.0',
        'motion': '^12.23.24'
      },
      devDependencies: {
        '@types/react': '^19.0.0',
        '@types/react-dom': '^19.0.0',
        typescript: '^5.8.0',
        vite: '^6.2.0',
        tailwindcss: '^4.0.0'
      }
    }, null, 2)
  },
  {
    path: 'src/main.tsx',
    language: 'typescript',
    content: `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`
  },
  {
    path: 'src/App.tsx',
    language: 'typescript',
    content: `import React, { useState } from 'react';
import { Sparkles, Code2, Rocket, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="min-h-screen bg-[#0d0d0f] text-white flex flex-col items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full bg-[#16161b] border border-[#262632] rounded-2xl p-8 shadow-2xl text-center space-y-6">
        <div className="inline-flex p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
          <Rocket className="w-8 h-8 animate-bounce" />
        </div>
        
        <div>
          <h1 className="text-2xl font-bold tracking-tight">React 19 + TypeScript Starter</h1>
          <p className="text-sm text-zinc-400 mt-2">
            Engineered with modern Tailwind CSS and autonomous AI code assistance.
          </p>
        </div>

        <div className="p-4 bg-[#0e0e12] rounded-xl border border-zinc-800/80 flex items-center justify-between">
          <span className="text-xs text-zinc-400 font-mono">Interactive Counter</span>
          <button
            onClick={() => setCount((c) => c + 1)}
            className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg shadow-sm transition-all"
          >
            Count is {count}
          </button>
        </div>

        <div className="flex items-center justify-center space-x-2 text-xs text-emerald-400">
          <CheckCircle2 className="w-4 h-4" />
          <span>Production Ready Environment</span>
        </div>
      </div>
    </div>
  );
}`
  },
  {
    path: 'src/index.css',
    language: 'css',
    content: `@import "tailwindcss";

body {
  margin: 0;
  background-color: #0d0d0f;
  color: #ededee;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}`
  },
  {
    path: 'README.md',
    language: 'markdown',
    content: `# React 19 + TypeScript Enterprise Starter

An ultra-fast client-side application structure with Tailwind CSS and modern React 19 features.

## Getting Started
- \`npm run dev\`: Start the local development server.
- \`npm run build\`: Compile production bundle with type checking.
`
  }
];

// 3. Autonomous 4-Agent Python AI Framework
const PYTHON_AGENTS_TEMPLATE_FILES: RepoFile[] = [
  ...PYTHON_AGENT_FILES.map(f => ({
    path: f.filename,
    language: f.language,
    content: f.content
  })),
  {
    path: 'requirements.txt',
    language: 'plaintext',
    content: `google-genai>=2.4.0
pydantic>=2.7.0
requests>=2.31.0
pytest>=8.0.0
colorama>=0.4.6`
  },
  {
    path: 'README.md',
    language: 'markdown',
    content: `# Autonomous 4-Agent Python AI System

A multi-agent development system composed of 4 specialized cooperating agents:
1. **Agent 1 (Coder & System Architect)**: Explores repository, creates execution plans, and generates code.
2. **Agent 2 (Code Reviewer & Quality Auditor)**: Conducts static analysis, security review, and clean architecture scoring.
3. **Agent 3 (Bug Hunter & Patch Specialist)**: Scans for syntax errors, logic flaws, memory leaks, and creates automated patches.
4. **Agent 4 (Git & GitHub Automation Manager)**: Stages files, crafts semantic commit messages, creates branches, and generates PRs.

## Execution
\`\`\`bash
python agent.py --prompt "Add tags and category search filter"
\`\`\`
`
  }
];

// 4. Python FastAPI Microservice Starter
const FASTAPI_TEMPLATE_FILES: RepoFile[] = [
  {
    path: 'main.py',
    language: 'python',
    content: `from fastapi import FastAPI, HTTPException, Query
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
import uuid

app = FastAPI(
    title="Cursor AI Fast Microservice",
    description="High-performance async REST API with Pydantic validation.",
    version="1.0.0"
)

class ItemModel(BaseModel):
    id: Optional[str] = Field(default_factory=lambda: str(uuid.uuid4())[:8])
    name: str
    description: Optional[str] = None
    price: float = Field(gt=0, description="The price must be greater than zero")
    tags: List[str] = []
    created_at: datetime = Field(default_factory=datetime.utcnow)

items_db: List[ItemModel] = [
    ItemModel(name="Gemini 3.7 Pro Agent", description="Autonomous reasoning model", price=0.05, tags=["ai", "gemini"]),
    ItemModel(name="Cursor IDE Key", description="Developer BYOK License", price=20.0, tags=["byok", "dev"]),
]

@app.get("/")
async def root():
    return {"message": "Cursor Fast Microservice is active", "status": "online"}

@app.get("/items", response_model=List[ItemModel])
async def get_items(q: Optional[str] = Query(None, description="Search items")):
    if q:
        return [i for i in items_db if q.lower() in i.name.lower() or any(q.lower() in t.lower() for t in i.tags)]
    return items_db

@app.post("/items", response_model=ItemModel, status_code=201)
async def create_item(item: ItemModel):
    items_db.append(item)
    return item

@app.get("/items/{item_id}", response_model=ItemModel)
async def get_item(item_id: str):
    for i in items_db:
        if i.id == item_id:
            return i
    raise HTTPException(status_code=404, detail="Item not found")`
  },
  {
    path: 'test_main.py',
    language: 'python',
    content: `from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_read_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["status"] == "online"

def test_get_items():
    response = client.get("/items")
    assert response.status_code == 200
    assert len(response.json()) >= 2

def test_create_item():
    new_item = {
        "name": "Automated Test Item",
        "description": "Created via pytest",
        "price": 12.5,
        "tags": ["testing", "python"]
    }
    response = client.post("/items", json=new_item)
    assert response.status_code == 201
    assert response.json()["name"] == "Automated Test Item"`
  },
  {
    path: 'requirements.txt',
    language: 'plaintext',
    content: `fastapi>=0.110.0
uvicorn[standard]>=0.28.0
pydantic>=2.6.0
pytest>=8.0.0
httpx>=0.27.0`
  },
  {
    path: 'README.md',
    language: 'markdown',
    content: `# FastAPI AI Microservice Starter

Async Python 3.11+ REST API structured with FastAPI, Pydantic, and pytest.

## Run Development Server
\`\`\`bash
uvicorn main:app --reload --port 8000
\`\`\`

## Run Tests
\`\`\`bash
pytest test_main.py -v
\`\`\`
`
  }
];

// 5. Blank Starter
const BLANK_TEMPLATE_FILES: RepoFile[] = [
  {
    path: 'index.js',
    language: 'javascript',
    content: `// Blank Starter Project Entry Point
console.log("Hello from your new project created with Cursor AI IDE!");
`
  },
  {
    path: 'package.json',
    language: 'json',
    content: JSON.stringify({
      name: 'my-new-project',
      version: '1.0.0',
      description: 'A new custom project created in Cursor AI IDE',
      main: 'index.js',
      scripts: {
        start: 'node index.js'
      },
      keywords: [],
      author: '',
      license: 'ISC'
    }, null, 2)
  },
  {
    path: 'README.md',
    language: 'markdown',
    content: `# My New Project

This is a clean, blank starter project ready for autonomous coding and agent collaboration.
`
  }
];

export const PROJECT_TEMPLATES: ProjectTemplate[] = [
  {
    id: 'node-easy-notes-app',
    name: 'Node.js Express Easy Notes (Enhanced)',
    tagline: 'Express + Mongoose with Tags, Categories, Search & 4-Agent Orchestrator',
    description: 'The primary production-grade Node.js notes application with MVC architecture, multi-field search query parameters, automated test suite, and 4-agent coordination.',
    category: 'node',
    icon: 'Node',
    files: NODE_NOTES_TEMPLATE_FILES
  },
  {
    id: 'react-vite-app',
    name: 'React 19 + Vite + Tailwind Starter',
    tagline: 'Modern Single Page Application with TypeScript & Lucide Icons',
    description: 'A lightning-fast frontend starter template configured with React 19, TypeScript, Lucide React icons, and utility styling.',
    category: 'react',
    icon: 'React',
    files: REACT_VITE_TEMPLATE_FILES
  },
  {
    id: 'python-4-agents',
    name: 'Autonomous 4-Agent Python System',
    tagline: 'Planner, Coder, Reviewer, Bug Hunter & Git Manager in Python 3.11+',
    description: 'Complete Python AI coding agent source code with repo explorer, execution planner, Gemini GenAI API integration, and automated tool calling.',
    category: 'python',
    icon: 'Python',
    files: PYTHON_AGENTS_TEMPLATE_FILES
  },
  {
    id: 'fastapi-backend',
    name: 'FastAPI Microservice Backend',
    tagline: 'Async Python REST API with Pydantic Models & Pytest Suite',
    description: 'High-performance Python backend template with automatic OpenAPI docs, typed schema validation, and complete test runner.',
    category: 'python',
    icon: 'FastAPI',
    files: FASTAPI_TEMPLATE_FILES
  },
  {
    id: 'blank-starter',
    name: 'Blank Project Starter',
    tagline: 'Minimal scratchpad repository with index.js and package.json',
    description: 'A clean slate repository with no pre-configured business logic, ideal for building custom utilities or prototypes from scratch.',
    category: 'blank',
    icon: 'Code',
    files: BLANK_TEMPLATE_FILES
  }
];
