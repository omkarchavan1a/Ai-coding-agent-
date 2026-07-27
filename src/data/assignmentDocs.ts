export interface DocSection {
  id: string;
  title: string;
  content: string;
}

export const ASSIGNMENT_DOCS: DocSection[] = [
  {
    id: 'architecture',
    title: '1. Architecture & Design Pattern',
    content: `## System Architecture

The AI Coding Agent is architected in Python 3.11+ using a modular, decoupled agent framework:

\`\`\`
+-----------------------------------------------------------------------+
|                       AI CODING AGENT ENGINE                          |
|                                                                       |
|  +--------------------+   +-------------------+   +----------------+  |
|  |   Repo Explorer    |   | File Identifier   |   | LLM Client     |  |
|  |   (AST & Tree)     |   | (MVC Map Engine)  |   | (Gemini 2.5)   |  |
|  +---------+----------+   +---------+---------+   +-------+--------+  |
|            |                        |                     |           |
|            +-------------------+----+---------------------+           |
|                                |                                      |
|                                v                                      |
|                   +---------------------------+                       |
|                   |    Execution Planner      |                       |
|                   |   (Structured Steps)     |                       |
|                   +-------------+-------------+                       |
|                                 |                                     |
|                                 v                                     |
|                   +---------------------------+                       |
|                   |     Code Modifier         |                       |
|                   |  (AST Patch & Verification)|                      |
|                   +-------------+-------------+                       |
|                                 |                                     |
|                                 v                                     |
|                   +---------------------------+                       |
|                   |     Test Runner & ToolKit |                       |
|                   |     (Automated Validation)|                       |
|                   +-------------+-------------+                       |
|                                 |                                     |
|                                 v                                     |
|                   +---------------------------+                       |
|                   |   Summarizer & Reporter   |                       |
|                   +---------------------------+                       |
+-----------------------------------------------------------------------+
\`\`\`

### Core Components
1. **Repo Explorer (\`repo_explorer.py\`)**:
   Reads \`package.json\`, inspects directory trees, identifies project architecture (Node.js/Express MVC).
2. **File Identifier**:
   Scans imports, exports, and directory layout to tag files relevant to note organization and search (\`note.model.js\`, \`note.controller.js\`, \`note.routes.js\`).
3. **Execution Planner (\`planner.py\`)**:
   Generates a safe, non-destructive step-by-step modification plan that preserves existing API contracts.
4. **Code Modifier (\`code_modifier.py\`)**:
   Applies code modifications and verifies syntax integrity before saving.
5. **ToolKit & Test Runner (\`tools.py\`)**:
   Provides safety wrappers for file operations and executes unit tests (\`node test/note.test.js\`).
6. **Summarizer (\`summarizer.py\`)**:
   Compiles a complete change log, lists modified files, and outlines trade-offs.
`
  },
  {
    id: 'workflow',
    title: '2. Agent Execution Workflow',
    content: `## 🔄 Step-by-Step Agent Execution Workflow

The agent processes the requirement:
> **"Improve the application so users can better organise and search their notes."**

### Execution Steps
1. **Repository Discovery & AST Parsing**:
   - Agent runs \`list_files()\` and \`read_file('package.json')\`.
   - Identifies framework as Express 4.x with Mongoose ODM.
   - Maps core files: \`app/models/note.model.js\`, \`app/controllers/note.controller.js\`, \`app/routes/note.routes.js\`.

2. **Automatic File Identification**:
   - Model File: Needs schema extension for \`category\` (String) and \`tags\` (Array of Strings).
   - Controller File: Needs update in \`create\` and \`update\` methods to parse tags/categories, and \`findAll\` to handle query search filters (\`?q=\`, \`?category=\`, \`?tag=\`).
   - Routes File: Needs endpoint extensions for \`/notes/search\` and \`/notes/meta\`.

3. **Plan Generation**:
   - Step 1: Update \`note.model.js\` schema & index.
   - Step 2: Update \`note.controller.js\` search & filter handlers.
   - Step 3: Update \`note.routes.js\` to register endpoints.
   - Step 4: Add \`test/note.test.js\` integration test suite.

4. **Code Modification**:
   - Edits target files in sequence.
   - Verifies syntax parsing after each edit.

5. **Automated Testing & Verification**:
   - Executes test suite: tests default schema values, tag parsing, and multi-field search logic.
   - Verifies 100% test pass rate.

6. **Summary Generation**:
   - Outputs markdown report listing changes and verifying backwards compatibility.
`
  },
  {
    id: 'exploration',
    title: '3. How Repository is Explored',
    content: `## 🔍 Repository Exploration Strategy

The agent explores codebases through a structured semantic scanner:

1. **Manifest Parsing**:
   - Inspects \`package.json\` to detect entry points (\`server.js\`), main scripts, and installed dependencies (\`express\`, \`mongoose\`).

2. **Directory Mapping & MVC Pattern Detection**:
   - Maps directory folders (\`app/models/\`, \`app/controllers/\`, \`app/routes/\`).
   - Determines that models dictate database schema, controllers dictate business logic, and routes dictate HTTP endpoints.

3. **AST & Semantic Keyword Matching**:
   - Analyzes user request ("organise and search notes").
   - Matches "organise" -> Category & Tags schema fields.
   - Matches "search" -> Query parameters (\`q\`, \`search\`, \`category\`, \`tag\`) in controller \`findAll\`.
`
  },
  {
    id: 'tradeoffs',
    title: '4. Assumptions & Trade-offs',
    content: `## ⚖️ Assumptions & Trade-offs

1. **Regex Multi-Field Search vs. Database Text Indexing**:
   - *Decision*: Used case-insensitive regular expressions (\`RegExp\`) inside controller \`findAll\` alongside Mongoose text indexing.
   - *Trade-off*: Regex search works universally across both live MongoDB databases and lightweight mock/testing memory engines without needing external database indexes during unit testing.

2. **Tag Parsing Normalization**:
   - *Decision*: Standardized tags into lowercase trimmed strings (supports arrays or comma-separated strings like \`"Work, Urgent"\`).
   - *Trade-off*: Ensures consistent search results regardless of user capitalization, while storing tags uniformly.

3. **Backwards Compatibility Preservation**:
   - *Decision*: Retained existing API contracts for \`GET /notes\`, \`POST /notes\`, \`PUT /notes/:id\`, and \`DELETE /notes/:id\`.
   - *Trade-off*: Notes created without category default to \`'General'\` and tags default to \`[]\`, ensuring zero disruption to existing legacy frontend clients.
`
  },
  {
    id: 'video_script',
    title: '5. Executive System Walkthrough Script (2-3 Minutes)',
    content: `## 🎥 2-3 Minute Executive Walkthrough Script

Use this structured script when demonstrating the autonomous AI Coding Agent!

---

### **0:00 - 0:30 | Introduction & Objective**
- **Narration**:
  > *"Hi everyone! Today I'm demonstrating our AI Coding Agent. The objective is to autonomously understand an existing repository — specifically 'node-easy-notes-app' — and implement the request: 'Improve the application so users can better organise and search their notes', with zero manual code writing."*

---

### **0:30 - 1:15 | Explore Repository & Identify Files**
- **Narration**:
  > *"First, the agent explores the repository to understand the project architecture (Express MVC). Second, it automatically identifies the relevant files: 'note.model.js', 'note.controller.js', and 'note.routes.js'."*

---

### **1:15 - 2:00 | Execution Plan & Code Modification**
- **Narration**:
  > *"Third, the agent generates a brief execution plan. Fourth, it modifies the codebase, adding category and tags to the Mongoose schema, updating the controller for search filtering, and extending routes while preserving existing functionality."*

---

### **2:00 - 3:00 | Summarise Changes & Verification**
- **Narration**:
  > *"Fifth, the agent summarises all changes made, verifying that all original endpoints remain fully functional and all automated tests pass. Thank you!"*
`
  }
];
