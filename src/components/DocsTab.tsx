import React, { useState } from 'react';
import { ASSIGNMENT_DOCS } from '../data/assignmentDocs';
import { FileText, Video, Copy, Check, ExternalLink } from 'lucide-react';

export const DocsTab: React.FC = () => {
  const [selectedDocId, setSelectedDocId] = useState<string>('architecture');
  const [copiedScript, setCopiedScript] = useState(false);

  const activeDoc = ASSIGNMENT_DOCS.find((d) => d.id === selectedDocId) || ASSIGNMENT_DOCS[0];

  const handleCopyScript = () => {
    const videoScriptDoc = ASSIGNMENT_DOCS.find((d) => d.id === 'video_script');
    if (videoScriptDoc) {
      navigator.clipboard.writeText(videoScriptDoc.content);
      setCopiedScript(true);
      setTimeout(() => setCopiedScript(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#21222D] border border-[#2A2C3A] rounded-2xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 text-white">
        <div>
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-[#ACD1FD]" />
            <h2 className="text-base font-bold text-white">
              Agent Architecture & System Documentation
            </h2>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Complete system documentation covering System Architecture, Execution Workflow, Code Exploration, Trade-offs, and Demonstration Script.
          </p>
        </div>

        <button
          onClick={handleCopyScript}
          className="px-4 py-2 bg-[#958CE8] hover:bg-[#8378E5] text-white font-semibold text-xs rounded-xl transition-all flex items-center space-x-2 shadow-md shadow-[#958CE8]/20"
        >
          {copiedScript ? <Check className="w-4 h-4 text-emerald-300" /> : <Video className="w-4 h-4" />}
          <span>{copiedScript ? 'Copied Walkthrough Script!' : 'Copy Walkthrough Script'}</span>
        </button>
      </div>

      {/* Docs Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Section Navigation Sidebar (4 cols) */}
        <div className="lg:col-span-4 space-y-2.5">
          {ASSIGNMENT_DOCS.map((doc) => (
            <button
              key={doc.id}
              onClick={() => setSelectedDocId(doc.id)}
              className={`w-full text-left p-3.5 rounded-2xl border text-xs font-bold transition-all flex items-center justify-between ${
                selectedDocId === doc.id
                  ? 'bg-[#958CE8] border-[#958CE8] text-white shadow-sm'
                  : 'bg-white border-[#DBDBE5] text-[#21222D] hover:bg-[#F4F5F8]'
              }`}
            >
              <span>{doc.title}</span>
              {doc.id === 'video_script' && (
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                  selectedDocId === doc.id ? 'bg-white text-[#21222D]' : 'bg-[#ACD1FD] text-[#21222D]'
                }`}>
                  VIDEO
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Content Viewer (8 cols) */}
        <div className="lg:col-span-8 bg-white border border-[#DBDBE5] rounded-2xl p-6 shadow-sm space-y-4 text-[#21222D]">
          <div className="border-b border-[#DBDBE5] pb-3 flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#21222D] uppercase tracking-wider">
              {activeDoc.title}
            </h3>
            <span className="text-xs text-slate-500 font-mono bg-[#F4F5F8] px-2.5 py-0.5 rounded-full border border-[#DBDBE5]">README.md Section</span>
          </div>

          <div className="text-xs text-slate-700 leading-relaxed space-y-3 font-sans whitespace-pre-wrap font-medium">
            {activeDoc.content}
          </div>
        </div>
      </div>
    </div>
  );
};
