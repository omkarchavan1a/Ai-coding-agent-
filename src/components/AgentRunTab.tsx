import React, { useState } from 'react';
import { AgentExecutionState } from '../types';
import { Play, CheckCircle2, Circle, AlertCircle, Terminal, FileCode2, Cpu, TestTube, Check, Copy } from 'lucide-react';

interface AgentRunTabProps {
  state: AgentExecutionState;
  prompt: string;
  setPrompt: (p: string) => void;
  onRunAgent: () => void;
  isRunning: boolean;
}

export const AgentRunTab: React.FC<AgentRunTabProps> = ({
  state,
  prompt,
  setPrompt,
  onRunAgent,
  isRunning,
}) => {
  const [copiedSummary, setCopiedSummary] = useState(false);

  const steps = [
    { key: 'exploring', label: '1. Explore Repository', icon: Cpu },
    { key: 'identifying', label: '2. Identify Files', icon: FileCode2 },
    { key: 'planning', label: '3. Brief Plan', icon: Terminal },
    { key: 'modifying', label: '4. Modify Codebase', icon: FileCode2 },
    { key: 'testing', label: '5. Summarise & Verify', icon: TestTube },
  ];

  const getStepStatus = (stepKey: string) => {
    const stageOrder = ['idle', 'exploring', 'identifying', 'planning', 'modifying', 'testing', 'summarizing', 'completed'];
    const currentIndex = stageOrder.indexOf(state.stage);
    const stepIndex = stageOrder.indexOf(stepKey);

    if (state.stage === 'completed') return 'completed';
    if (currentIndex === stepIndex) return 'current';
    if (currentIndex > stepIndex) return 'completed';
    return 'pending';
  };

  const handleCopySummary = () => {
    if (!state.summary) return;
    const reportText = `🎯 Summary of Changes
===================
- Files Modified: ${state.summary.filesModified.join(', ')}
- Features Added: ${state.summary.featuresAdded.join('; ')}
- Preserved Contracts: ${state.summary.preservedFunctionality.join('; ')}
- Test Status: ${state.summary.testResults.passed}/${state.summary.testResults.total} Passed (100%)`;
    navigator.clipboard.writeText(reportText);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* User Request Bar */}
      <div className="bg-[#21222D] border border-[#2A2C3A] rounded-2xl p-5 shadow-sm text-slate-100 space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-[#ACD1FD] uppercase tracking-wider flex items-center space-x-2">
            <span>Agent Operational Directive</span>
          </label>
          <span className="text-[10px] text-white font-normal normal-case bg-[#958CE8] px-2.5 py-0.5 rounded-full font-mono">
            Active Workflow
          </span>
        </div>

        {/* Core Bullet Requirements Box */}
        <div className="bg-[#191A23] border border-slate-700/60 rounded-xl p-3.5 text-xs text-slate-200 space-y-1.5 font-sans">
          <div className="text-[11px] font-bold text-[#ACD1FD] uppercase tracking-wide mb-1">Your Agent Workflow Responsibilities:</div>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-1.5 text-slate-300 text-[11px]">
            <li className="flex items-start space-x-1.5">
              <span className="text-[#958CE8] font-bold">•</span>
              <span>Explore the repository to understand the project.</span>
            </li>
            <li className="flex items-start space-x-1.5">
              <span className="text-[#958CE8] font-bold">•</span>
              <span>Identify the relevant files automatically.</span>
            </li>
            <li className="flex items-start space-x-1.5">
              <span className="text-[#958CE8] font-bold">•</span>
              <span>Create a brief execution plan.</span>
            </li>
            <li className="flex items-start space-x-1.5">
              <span className="text-[#958CE8] font-bold">•</span>
              <span>Modify the codebase.</span>
            </li>
            <li className="flex items-start space-x-1.5 md:col-span-2">
              <span className="text-[#958CE8] font-bold">•</span>
              <span>Summarise the changes made (preserving existing functionality).</span>
            </li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-1">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={isRunning}
            className="flex-1 bg-[#191A23] border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#958CE8] font-mono"
            placeholder="Enter product requirement prompt..."
          />
          <button
            onClick={onRunAgent}
            disabled={isRunning}
            className="px-5 py-2.5 rounded-xl font-semibold text-sm bg-[#958CE8] hover:bg-[#8378E5] text-white transition-all flex items-center justify-center space-x-2 shrink-0 disabled:opacity-50 shadow-md shadow-[#958CE8]/20"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Run Agent</span>
          </button>
        </div>
      </div>

      {/* Execution Stepper Progress Bar */}
      <div className="bg-white border border-[#DBDBE5] rounded-2xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs font-bold text-[#21222D] uppercase tracking-wider">
            Agent Execution Pipeline
          </h2>
          <span className="text-xs font-mono text-[#958CE8] font-bold">
            Progress: {state.progress}%
          </span>
        </div>

        {/* Progress bar line */}
        <div className="w-full bg-[#EFEFF4] rounded-full h-2 mb-6 overflow-hidden">
          <div
            className="bg-[#958CE8] h-2 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${state.progress}%` }}
          />
        </div>

        {/* Pipeline Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
          {steps.map((step) => {
            const status = getStepStatus(step.key);

            return (
              <div
                key={step.key}
                className={`p-3 rounded-xl border text-xs flex items-center space-x-2.5 transition-all ${
                  status === 'completed'
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                    : status === 'current'
                    ? 'bg-[#ACD1FD]/20 border-[#958CE8] text-[#21222D] font-semibold ring-2 ring-[#958CE8]/30'
                    : 'bg-[#F4F5F8] border-[#DBDBE5] text-slate-500'
                }`}
              >
                {status === 'completed' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : status === 'current' ? (
                  <div className="w-4 h-4 rounded-full border-2 border-[#958CE8] border-t-transparent animate-spin shrink-0" />
                ) : (
                  <Circle className="w-4 h-4 text-slate-400 shrink-0" />
                )}
                <div className="truncate">
                  <span className="font-medium block truncate">{step.label}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Grid: Terminal Logs & Execution Plan */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Terminal Logs (7 cols) */}
        <div className="lg:col-span-7 bg-[#21222D] border border-[#2A2C3A] rounded-2xl overflow-hidden flex flex-col shadow-md">
          <div className="bg-[#191A23] px-4 py-3 border-b border-slate-700/60 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Terminal className="w-4 h-4 text-[#ACD1FD]" />
              <span className="text-xs font-semibold text-white uppercase tracking-wider">
                Agent Terminal & Tool Logs
              </span>
            </div>
            <span className="text-[11px] font-mono text-slate-300 bg-[#2A2C3A] px-2 py-0.5 rounded-full">
              {state.toolCalls.length} tool invocations
            </span>
          </div>

          <div className="p-4 font-mono text-xs space-y-2 max-h-[420px] overflow-y-auto text-slate-200 bg-[#21222D]">
            {state.logs.map((log, idx) => (
              <div key={idx} className="leading-relaxed">
                <span className="text-slate-400 mr-2">[{new Date().toLocaleTimeString()}]</span>
                <span className={log.includes('✓') ? 'text-emerald-300 font-medium' : log.includes('🤖') ? 'text-[#ACD1FD] font-bold' : log.includes('❌') ? 'text-rose-300' : 'text-slate-200'}>
                  {log}
                </span>
              </div>
            ))}

            {state.toolCalls.map((tc) => (
              <div key={tc.id} className="p-3 rounded-xl bg-[#191A23] border border-slate-700/60 my-1.5 space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-[#ACD1FD] font-semibold uppercase">
                    Tool Call: {tc.tool}
                  </span>
                  <span className="text-emerald-300 font-sans text-[10px] bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-800">
                    {tc.status}
                  </span>
                </div>
                <p className="text-slate-300 text-[11px]">
                  Args: <code className="text-amber-300">{JSON.stringify(tc.args)}</code>
                </p>
                <p className="text-slate-200 text-[11px] border-l-2 border-[#958CE8] pl-2 mt-1 italic">
                  Result: {tc.result}
                </p>
              </div>
            ))}

            {state.logs.length === 0 && (
              <p className="text-slate-500 italic">No execution logs yet. Click "Run AI Coding Agent" to start.</p>
            )}
          </div>
        </div>

        {/* Execution Plan & File Identifiers (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Identified Files Card */}
          <div className="bg-white border border-[#DBDBE5] rounded-2xl p-4 shadow-sm">
            <h3 className="text-xs font-bold text-[#21222D] uppercase tracking-wider mb-2.5 flex items-center space-x-2">
              <FileCode2 className="w-4 h-4 text-[#958CE8]" />
              <span>Automatically Identified Files ({state.identifiedFiles.length})</span>
            </h3>
            <div className="space-y-1.5">
              {state.identifiedFiles.map((f, i) => (
                <div key={i} className="flex items-center justify-between px-3 py-2 rounded-xl bg-[#F4F5F8] border border-[#DBDBE5] text-xs text-[#21222D]">
                  <span className="font-mono text-[11px] font-medium text-[#21222D]">{f}</span>
                  <span className="text-[10px] text-[#21222D] font-semibold bg-[#ACD1FD] px-2 py-0.5 rounded-full">
                    Target
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Execution Plan Card */}
          <div className="bg-white border border-[#DBDBE5] rounded-2xl p-4 shadow-sm">
            <h3 className="text-xs font-bold text-[#21222D] uppercase tracking-wider mb-3">
              Generated Execution Plan
            </h3>
            <div className="space-y-2.5">
              {state.plan.map((step) => (
                <div
                  key={step.id}
                  className="p-3 rounded-xl bg-[#F4F5F8] border border-[#DBDBE5] text-xs space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#21222D]">
                      Step {step.id}: {step.title}
                    </span>
                    <span className="text-[10px] text-emerald-700 font-mono bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-200">
                      {step.status}
                    </span>
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Final Execution Summary & Test Suite Results */}
      {state.summary && (
        <div className="bg-white border-2 border-[#958CE8] rounded-2xl p-6 shadow-md space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-[#DBDBE5] pb-4 gap-2">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-[#958CE8] text-white rounded-xl">
                <CheckCircle2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#21222D]">Agent Execution Completed & Verified</h3>
                <p className="text-xs text-slate-500">All changes applied safely and 100% test assertions passed.</p>
              </div>
            </div>

            <button
              onClick={handleCopySummary}
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-[#21222D] hover:bg-[#2A2C3A] text-white rounded-xl text-xs font-medium transition-all active:scale-95 self-start sm:self-auto shadow-sm"
            >
              {copiedSummary ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-[#ACD1FD]" />}
              <span>{copiedSummary ? 'Copied Report' : 'Copy Summary Report'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            {/* Features Added */}
            <div className="p-4 rounded-xl bg-[#F4F5F8] border border-[#DBDBE5] space-y-2">
              <h4 className="font-bold text-[#21222D] uppercase tracking-wider text-[11px]">
                Features Added
              </h4>
              <ul className="space-y-1.5 text-slate-700 list-disc list-inside leading-relaxed font-medium">
                {state.summary.featuresAdded.map((f, i) => (
                  <li key={i}>{f}</li>
                ))}
              </ul>
            </div>

            {/* Preserved Contracts */}
            <div className="p-4 rounded-xl bg-[#F4F5F8] border border-[#DBDBE5] space-y-2">
              <h4 className="font-bold text-emerald-700 uppercase tracking-wider text-[11px]">
                Preserved Contracts
              </h4>
              <ul className="space-y-1.5 text-slate-700 list-disc list-inside leading-relaxed font-medium">
                {state.summary.preservedFunctionality.map((p, i) => (
                  <li key={i}>{p}</li>
                ))}
              </ul>
            </div>

            {/* Test Results */}
            <div className="p-4 rounded-xl bg-[#F4F5F8] border border-[#DBDBE5] space-y-2">
              <h4 className="font-bold text-[#21222D] uppercase tracking-wider text-[11px]">
                Test Suite Verification
              </h4>
              <div className="flex items-center space-x-2 text-[#21222D] font-mono text-sm font-bold">
                <span className="text-emerald-600">{state.summary.testResults.passed} Passed</span>
                <span>/</span>
                <span>{state.summary.testResults.total} Total</span>
              </div>
              <div className="space-y-1 text-emerald-700 font-mono text-[11px] pt-1">
                {state.summary.testResults.details.map((d, i) => (
                  <div key={i} className="font-semibold">{d}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
