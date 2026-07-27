import React from 'react';
import { Bot, Play, Download, RefreshCw, Code, CheckCircle, Sparkles } from 'lucide-react';

interface HeaderProps {
  isRunning: boolean;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onRunAgent: () => void;
  onExportZip: () => void;
  onResetRepo: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  isRunning,
  activeTab,
  setActiveTab,
  onRunAgent,
  onExportZip,
  onResetRepo,
}) => {
  return (
    <header className="bg-[#21222D] border-b border-[#2A2C3A] sticky top-0 z-50 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Brand Title */}
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-[#958CE8] text-white rounded-xl shadow-md flex items-center justify-center">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-lg font-bold tracking-tight text-white">AI Coding Agent</h1>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-[#ACD1FD]/20 text-[#ACD1FD] border border-[#ACD1FD]/30">
                Python 3.11+
              </span>
            </div>
            <p className="text-xs text-slate-300">
              Target Repo: <code className="text-[#ACD1FD] bg-[#191A23] px-2 py-0.5 rounded-full font-mono text-[11px]">node-easy-notes-app</code>
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center flex-wrap gap-2.5">
          <button
            onClick={onRunAgent}
            disabled={isRunning}
            className={`inline-flex items-center space-x-2 px-4 py-2 rounded-xl font-medium text-sm transition-all shadow-md ${
              isRunning
                ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                : 'bg-[#958CE8] hover:bg-[#8378E5] text-white active:scale-95 shadow-[#958CE8]/30 font-semibold'
            }`}
          >
            {isRunning ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-white" />
                <span>Executing Pipeline...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current text-white" />
                <span>Run AI Coding Agent</span>
              </>
            )}
          </button>

          <button
            onClick={onExportZip}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl font-medium text-xs bg-[#2A2C3A] hover:bg-[#343748] text-white border border-slate-600/50 transition-all active:scale-95"
            title="Download full Python 3.11 Agent & Modified Repository ZIP"
          >
            <Download className="w-3.5 h-3.5 text-[#ACD1FD]" />
            <span>Export Agent (ZIP)</span>
          </button>

          <button
            onClick={onResetRepo}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl font-medium text-xs bg-[#2A2C3A] hover:bg-[#343748] text-slate-200 border border-slate-600/50 transition-all active:scale-95"
            title="Reset repository to initial state"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-300" />
            <span>Reset Demo</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-700/50 flex space-x-1 overflow-x-auto text-xs font-medium py-1.5">
        <button
          onClick={() => setActiveTab('workbench')}
          className={`px-3.5 py-2 rounded-xl transition-all flex items-center space-x-2 whitespace-nowrap ${
            activeTab === 'workbench'
              ? 'bg-[#958CE8] text-white font-semibold shadow-sm'
              : 'text-slate-300 hover:text-white hover:bg-[#2A2C3A]'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-[#ACD1FD]" />
          <span>Agent Workflow</span>
        </button>

        <button
          onClick={() => setActiveTab('diff')}
          className={`px-3.5 py-2 rounded-xl transition-all flex items-center space-x-2 whitespace-nowrap ${
            activeTab === 'diff'
              ? 'bg-[#958CE8] text-white font-semibold shadow-sm'
              : 'text-slate-300 hover:text-white hover:bg-[#2A2C3A]'
          }`}
        >
          <Code className="w-3.5 h-3.5 text-[#ACD1FD]" />
          <span>Code Modifications</span>
        </button>

        <button
          onClick={() => setActiveTab('app_test')}
          className={`px-3.5 py-2 rounded-xl transition-all flex items-center space-x-2 whitespace-nowrap ${
            activeTab === 'app_test'
              ? 'bg-[#958CE8] text-white font-semibold shadow-sm'
              : 'text-slate-300 hover:text-white hover:bg-[#2A2C3A]'
          }`}
        >
          <CheckCircle className="w-3.5 h-3.5 text-emerald-300" />
          <span>Target App Sandbox</span>
        </button>

        <button
          onClick={() => setActiveTab('python_code')}
          className={`px-3.5 py-2 rounded-xl transition-all flex items-center space-x-2 whitespace-nowrap ${
            activeTab === 'python_code'
              ? 'bg-[#958CE8] text-white font-semibold shadow-sm'
              : 'text-slate-300 hover:text-white hover:bg-[#2A2C3A]'
          }`}
        >
          <Code className="w-3.5 h-3.5 text-amber-300" />
          <span>Python Agent Source</span>
        </button>
      </div>
    </header>
  );
};
