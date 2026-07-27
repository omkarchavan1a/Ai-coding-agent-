import React, { useState } from 'react';
import { PYTHON_AGENT_FILES } from '../data/pythonAgentSource';
import { Code, Copy, Check, Download, FileCode } from 'lucide-react';

interface PythonCodeTabProps {
  onExportZip: () => void;
}

export const PythonCodeTab: React.FC<PythonCodeTabProps> = ({ onExportZip }) => {
  const [selectedFilename, setSelectedFilename] = useState<string>('agent.py');
  const [copied, setCopied] = useState(false);

  const selectedFile = PYTHON_AGENT_FILES.find((f) => f.filename === selectedFilename) || PYTHON_AGENT_FILES[0];

  const handleCopyCode = () => {
    navigator.clipboard.writeText(selectedFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-[#21222D] border border-[#2A2C3A] rounded-2xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 text-white">
        <div>
          <div className="flex items-center space-x-2">
            <Code className="w-5 h-5 text-[#ACD1FD]" />
            <h2 className="text-base font-bold text-white">
              Python 3.11+ AI Coding Agent Source Code
            </h2>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Complete, modular Python implementation ready for evaluation or local execution.
          </p>
        </div>

        <button
          onClick={onExportZip}
          className="px-4 py-2 bg-[#958CE8] hover:bg-[#8378E5] text-white font-semibold text-xs rounded-xl transition-all flex items-center space-x-2 shadow-md shadow-[#958CE8]/20"
        >
          <Download className="w-4 h-4" />
          <span>Export Complete Python Agent (ZIP)</span>
        </button>
      </div>

      {/* Main Source Explorer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* File Sidebar (4 cols) */}
        <div className="lg:col-span-4 space-y-2.5">
          {PYTHON_AGENT_FILES.map((file) => (
            <button
              key={file.filename}
              onClick={() => setSelectedFilename(file.filename)}
              className={`w-full text-left p-3.5 rounded-2xl border text-xs transition-all flex flex-col space-y-1 ${
                selectedFilename === file.filename
                  ? 'bg-[#958CE8] text-white font-semibold border-[#958CE8] shadow-sm'
                  : 'bg-white border-[#DBDBE5] text-[#21222D] hover:bg-[#F4F5F8]'
              }`}
            >
              <div className="flex items-center justify-between font-mono font-bold">
                <span className="flex items-center space-x-2">
                  <FileCode className={`w-4 h-4 ${selectedFilename === file.filename ? 'text-white' : 'text-[#958CE8]'}`} />
                  <span>{file.filename}</span>
                </span>
                <span className={`text-[10px] uppercase font-sans ${selectedFilename === file.filename ? 'text-white/80' : 'text-slate-400'}`}>{file.language}</span>
              </div>
              <p className={`text-[11px] line-clamp-2 ${selectedFilename === file.filename ? 'text-white/90' : 'text-slate-500'}`}>{file.description}</p>
            </button>
          ))}
        </div>

        {/* Code View Panel (8 cols) */}
        <div className="lg:col-span-8 bg-[#21222D] border border-[#2A2C3A] rounded-2xl overflow-hidden shadow-md flex flex-col">
          <div className="bg-[#191A23] px-4 py-3 border-b border-slate-700/60 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FileCode className="w-4 h-4 text-[#ACD1FD]" />
              <span className="text-xs font-mono font-bold text-white">
                {selectedFile.filename}
              </span>
            </div>

            <button
              onClick={handleCopyCode}
              className="text-xs text-[#ACD1FD] hover:text-white px-3 py-1 bg-[#2A2C3A] hover:bg-[#343748] rounded-lg transition-all flex items-center space-x-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy File'}</span>
            </button>
          </div>

          <pre className="p-4 font-mono text-xs text-slate-200 overflow-x-auto max-h-[580px] bg-[#21222D] leading-relaxed">
            <code>{selectedFile.content}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};
