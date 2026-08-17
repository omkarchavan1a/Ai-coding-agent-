# Cursor AI - 4 Autonomous Agents IDE & Bring Your Own Key (BYOK)

A next-generation Cursor-like AI IDE workbench where **4 specialized autonomous agents collaborate simultaneously** on your codebase, powered by a flexible **Bring Your Own Key (BYOK)** system supporting Google Gemini, OpenAI, Anthropic Claude, and local/custom LLMs.

---

## 🤖 The 4 Autonomous Agents

1. **Agent 1: Coder & Software Architect**
   - Implements requested features, creates Mongoose schemas, expands Express controllers, and generates unit test files.
   - Preserves 100% backward compatibility for existing endpoints.

2. **Agent 2: Code Reviewer & Quality Auditor**
   - Analyzes clean architecture (MVC), SOLID principles, and DRY patterns.
   - Computes a comprehensive **Clean Code Scorecard (0–100)** with sub-ratings for Cleanliness, Security, Performance, and Maintainability.
   - Provides line-by-line review annotations and architectural recommendations.

3. **Agent 3: Bug Hunter & Self-Healing Auto-Fixer**
   - Scans static AST trees and runtime traces for logic errors, uncaught exceptions, null dereferences, and security vulnerabilities (e.g. ReDoS regex injection).
   - Generates verified patch diffs with a **1-click "Apply Fix to Codebase"** and **"Auto-Fix All Issues"** engine.

4. **Agent 4: Git & GitHub Operations Manager**
   - Manages source control: stages/unstages modified files, crafts conventional semantic commit messages (`feat:`, `refactor:`, `test:`).
   - Handles branch creation & switching, simulates remote `git push` & `git pull`.
   - Generates complete **GitHub Pull Requests (PRs)** with markdown summaries, 4-agent audit reports, and automated CI check status.

---

## 🔑 Bring Your Own Key (BYOK) System

- **Google Gemini API**: Connect your free Google AI Studio key (`gemini-3.7-flash`, `gemini-3.1-pro-preview`, `gemini-2.5-flash`).
- **OpenAI API**: Connect your OpenAI key (`gpt-4o`, `gpt-4o-mini`, `o1`).
- **Anthropic Claude**: Connect your Claude key (`claude-3-5-sonnet-latest`, `claude-3-opus`).
- **Custom / Local Endpoints**: Support for local Ollama instances (`qwen2.5-coder`, `deepseek-coder`) or OpenRouter proxy URLs.
- **Key Validation**: Integrated **"Test Connection"** ping tool displaying round-trip latency in milliseconds (e.g. `✓ Connected (112ms)`).
- **Client-Side Privacy**: Keys are encrypted locally in browser `localStorage` and never exposed publicly.

---

## 💻 Cursor IDE Interface Features

- **Activity Bar**: Quick switching between File Explorer, 4-Agent Orchestrator, Code Review, Bug Hunter, Git Manager, and Settings.
- **Command Palette (`Cmd + K` / `Ctrl + K`)**: Instant Cursor-style prompt interface to dispatch directives to all 4 agents.
- **Code Editor & Diff Viewer**: Full file breadcrumbs, line numbers, inline agent suggestions, and side-by-side Before vs. After diff comparison.
- **Bottom Dock**: Real-time 4-Agents Stream, Node integration test runner (`npm test`), Git commit log, and interactive Note API testing sandbox.
- **ZIP Export**: 1-click download of the complete codebase, agent modules, and assignment submission.
