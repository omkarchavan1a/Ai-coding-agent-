import React, { useState, useRef } from 'react';
import { useIDE } from '../../context/IDEContext';
import { PROJECT_TEMPLATES } from '../../data/projectTemplates';
import { 
  X, 
  FolderPlus, 
  Upload, 
  Download, 
  FileCode, 
  CheckCircle2, 
  Sparkles, 
  FileArchive, 
  Folder, 
  FileJson, 
  FileText, 
  ArrowRight, 
  Layers, 
  RefreshCw,
  AlertCircle,
  HardDrive,
  Copy,
  Check
} from 'lucide-react';

export const ProjectModal: React.FC = () => {
  const {
    projectName,
    isProjectModalOpen,
    setIsProjectModalOpen,
    projectModalTab,
    setProjectModalTab,
    createNewProject,
    importProjectFromZip,
    importProjectFromFiles,
    importProjectFromJson,
    exportProjectZip,
    exportProjectJson,
    files
  } = useIDE();

  // New Project Form State
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('node-easy-notes-app');
  const [customProjectName, setCustomProjectName] = useState<string>('');

  // Import State
  const [importMode, setImportMode] = useState<'zip' | 'folder' | 'json'>('zip');
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isProcessingImport, setIsProcessingImport] = useState<boolean>(false);
  const [importStatusMessage, setImportStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [jsonInput, setJsonInput] = useState<string>('');

  // Export State
  const [exportCustomName, setExportCustomName] = useState<string>(projectName);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [copiedJson, setCopiedJson] = useState<boolean>(false);

  const fileInputZipRef = useRef<HTMLInputElement>(null);
  const fileInputFolderRef = useRef<HTMLInputElement>(null);

  if (!isProjectModalOpen) return null;

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = customProjectName.trim() || selectedTemplateId;
    createNewProject(selectedTemplateId, finalName);
  };

  const handleZipFileSelected = async (file: File) => {
    if (!file.name.toLowerCase().endsWith('.zip')) {
      setImportStatusMessage({ type: 'error', text: 'Please select a valid .zip archive.' });
      return;
    }

    setIsProcessingImport(true);
    setImportStatusMessage(null);

    const result = await importProjectFromZip(file);
    setIsProcessingImport(false);

    if (result.success) {
      setImportStatusMessage({ type: 'success', text: `Successfully imported ${result.count} files from ${file.name}!` });
      setTimeout(() => {
        setIsProjectModalOpen(false);
      }, 700);
    } else {
      setImportStatusMessage({ type: 'error', text: result.error || 'Failed to extract ZIP archive.' });
    }
  };

  const handleFolderFilesSelected = async (filesList: FileList | null) => {
    if (!filesList || filesList.length === 0) return;

    setIsProcessingImport(true);
    setImportStatusMessage(null);

    const result = await importProjectFromFiles(filesList);
    setIsProcessingImport(false);

    if (result.success) {
      setImportStatusMessage({ type: 'success', text: `Successfully loaded ${result.count} files into workspace!` });
      setTimeout(() => {
        setIsProjectModalOpen(false);
      }, 700);
    } else {
      setImportStatusMessage({ type: 'error', text: result.error || 'Failed to import folder files.' });
    }
  };

  const handleJsonSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jsonInput.trim()) {
      setImportStatusMessage({ type: 'error', text: 'Please paste a valid JSON project manifest.' });
      return;
    }

    const result = importProjectFromJson(jsonInput);
    if (result.success) {
      setImportStatusMessage({ type: 'success', text: `Successfully imported ${result.count} files from JSON manifest!` });
      setTimeout(() => {
        setIsProjectModalOpen(false);
      }, 700);
    } else {
      setImportStatusMessage({ type: 'error', text: result.error || 'Invalid JSON format.' });
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFiles = e.dataTransfer.files;
    if (!droppedFiles || droppedFiles.length === 0) return;

    if (droppedFiles[0].name.toLowerCase().endsWith('.zip')) {
      handleZipFileSelected(droppedFiles[0]);
    } else {
      handleFolderFilesSelected(droppedFiles);
    }
  };

  const handleExportZipTrigger = async () => {
    setIsExporting(true);
    await exportProjectZip(exportCustomName);
    setIsExporting(false);
  };

  const handleCopyJsonToClipboard = () => {
    const payload = {
      name: exportCustomName || projectName,
      exportedAt: new Date().toISOString(),
      files
    };
    navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div 
        className="w-full max-w-2xl bg-[#131317] border border-[#262632] rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="h-14 px-5 border-b border-[#202028] bg-[#17171d] flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white">Project Manager</h2>
              <p className="text-[11px] text-[#71717a]">Create, import, or export workspaces and agent configurations</p>
            </div>
          </div>

          <button
            onClick={() => setIsProjectModalOpen(false)}
            className="p-1.5 rounded-lg text-[#71717a] hover:text-white hover:bg-[#20202a] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center border-b border-[#202028] bg-[#111115] px-4 pt-2">
          <button
            onClick={() => setProjectModalTab('new')}
            className={`flex items-center space-x-2 px-4 py-2 text-xs font-medium border-b-2 transition-all ${
              projectModalTab === 'new'
                ? 'border-[#6366f1] text-white'
                : 'border-transparent text-[#71717a] hover:text-[#d4d4d8]'
            }`}
          >
            <FolderPlus className="w-3.5 h-3.5" />
            <span>New Project</span>
          </button>

          <button
            onClick={() => setProjectModalTab('import')}
            className={`flex items-center space-x-2 px-4 py-2 text-xs font-medium border-b-2 transition-all ${
              projectModalTab === 'import'
                ? 'border-[#6366f1] text-white'
                : 'border-transparent text-[#71717a] hover:text-[#d4d4d8]'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Import Project</span>
          </button>

          <button
            onClick={() => setProjectModalTab('export')}
            className={`flex items-center space-x-2 px-4 py-2 text-xs font-medium border-b-2 transition-all ${
              projectModalTab === 'export'
                ? 'border-[#6366f1] text-white'
                : 'border-transparent text-[#71717a] hover:text-[#d4d4d8]'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Project</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5">
          {/* TAB 1: NEW PROJECT */}
          {projectModalTab === 'new' && (
            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#d4d4d8] mb-1.5">
                  Project Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={customProjectName}
                    onChange={(e) => setCustomProjectName(e.target.value)}
                    placeholder={selectedTemplateId}
                    className="w-full bg-[#0d0d10] border border-[#262632] rounded-lg px-3.5 py-2 text-xs text-white placeholder-[#52525b] focus:outline-none focus:border-[#6366f1] font-mono transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#d4d4d8] mb-2">
                  Select Project Starter Template
                </label>

                <div className="grid grid-cols-1 gap-2.5">
                  {PROJECT_TEMPLATES.map((tmpl) => {
                    const isSelected = selectedTemplateId === tmpl.id;
                    return (
                      <div
                        key={tmpl.id}
                        onClick={() => setSelectedTemplateId(tmpl.id)}
                        className={`p-3 rounded-lg border cursor-pointer transition-all flex items-start justify-between ${
                          isSelected
                            ? 'bg-[#181822] border-[#6366f1] ring-1 ring-[#6366f1]/30'
                            : 'bg-[#15151a] border-[#22222a] hover:bg-[#1a1a20] hover:border-[#2d2d38]'
                        }`}
                      >
                        <div className="space-y-1 flex-1 pr-3">
                          <div className="flex items-center space-x-2">
                            <span className="font-semibold text-xs text-white">{tmpl.name}</span>
                            <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-medium ${
                              tmpl.category === 'node' ? 'bg-[#10b981]/15 text-[#34d399] border border-[#10b981]/30' :
                              tmpl.category === 'react' ? 'bg-[#38bdf8]/15 text-[#38bdf8] border border-[#38bdf8]/30' :
                              tmpl.category === 'python' ? 'bg-[#fbbf24]/15 text-[#fbbf24] border border-[#fbbf24]/30' :
                              'bg-zinc-800 text-zinc-300'
                            }`}>
                              {tmpl.category.toUpperCase()}
                            </span>
                          </div>
                          <p className="text-[11px] text-[#9ca3af] leading-relaxed">
                            {tmpl.tagline}
                          </p>
                          <div className="text-[10px] text-[#6b7280] font-mono pt-1">
                            {tmpl.files.length} files included • Ready for 4-Agent Orchestration
                          </div>
                        </div>

                        <div className="pt-0.5">
                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            isSelected ? 'border-[#6366f1] bg-[#6366f1]' : 'border-[#3f3f46]'
                          }`}>
                            {isSelected && <Check className="w-2.5 h-2.5 text-white" />}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="pt-3 border-t border-[#202028] flex items-center justify-between">
                <span className="text-[11px] text-[#71717a]">
                  Current workspace will be safely replaced with the chosen template.
                </span>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#6366f1] hover:bg-[#4f46e5] text-white font-medium rounded-lg text-xs flex items-center space-x-2 transition-all shadow-md"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#c7d2fe]" />
                  <span>Initialize Project</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: IMPORT PROJECT */}
          {projectModalTab === 'import' && (
            <div className="space-y-4">
              {/* Import Mode Selector */}
              <div className="flex items-center bg-[#0d0d10] border border-[#202028] rounded-lg p-1">
                <button
                  type="button"
                  onClick={() => { setImportMode('zip'); setImportStatusMessage(null); }}
                  className={`flex-1 py-1.5 text-xs font-medium rounded-md flex items-center justify-center space-x-1.5 transition-all ${
                    importMode === 'zip' ? 'bg-[#22222b] text-white shadow-xs' : 'text-[#71717a] hover:text-white'
                  }`}
                >
                  <FileArchive className="w-3.5 h-3.5 text-[#818cf8]" />
                  <span>ZIP Archive</span>
                </button>

                <button
                  type="button"
                  onClick={() => { setImportMode('folder'); setImportStatusMessage(null); }}
                  className={`flex-1 py-1.5 text-xs font-medium rounded-md flex items-center justify-center space-x-1.5 transition-all ${
                    importMode === 'folder' ? 'bg-[#22222b] text-white shadow-xs' : 'text-[#71717a] hover:text-white'
                  }`}
                >
                  <Folder className="w-3.5 h-3.5 text-[#fbbf24]" />
                  <span>Local Folder</span>
                </button>

                <button
                  type="button"
                  onClick={() => { setImportMode('json'); setImportStatusMessage(null); }}
                  className={`flex-1 py-1.5 text-xs font-medium rounded-md flex items-center justify-center space-x-1.5 transition-all ${
                    importMode === 'json' ? 'bg-[#22222b] text-white shadow-xs' : 'text-[#71717a] hover:text-white'
                  }`}
                >
                  <FileJson className="w-3.5 h-3.5 text-[#34d399]" />
                  <span>JSON Manifest</span>
                </button>
              </div>

              {/* Status Message */}
              {importStatusMessage && (
                <div className={`p-3 rounded-lg border flex items-center space-x-2 text-xs ${
                  importStatusMessage.type === 'success'
                    ? 'bg-[#10b981]/10 border-[#10b981]/30 text-[#34d399]'
                    : 'bg-[#f43f5e]/10 border-[#f43f5e]/30 text-[#fb7185]'
                }`}>
                  {importStatusMessage.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  )}
                  <span>{importStatusMessage.text}</span>
                </div>
              )}

              {/* ZIP Mode */}
              {importMode === 'zip' && (
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputZipRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                    isDragging
                      ? 'border-[#6366f1] bg-[#6366f1]/10'
                      : 'border-[#2e2e3a] bg-[#15151a] hover:border-[#4f46e5] hover:bg-[#181822]'
                  }`}
                >
                  <input
                    type="file"
                    ref={fileInputZipRef}
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleZipFileSelected(e.target.files[0]);
                      }
                    }}
                    accept=".zip"
                    className="hidden"
                  />
                  <div className="w-12 h-12 rounded-xl bg-[#20202a] border border-[#2d2d38] flex items-center justify-center mx-auto mb-3 text-[#818cf8]">
                    <FileArchive className="w-6 h-6" />
                  </div>
                  <h3 className="text-sm font-semibold text-white">
                    {isProcessingImport ? 'Extracting project files...' : 'Upload or Drag & Drop .zip Project'}
                  </h3>
                  <p className="text-xs text-[#71717a] mt-1 max-w-sm mx-auto">
                    Decompresses and extracts JavaScript, TypeScript, Python, JSON, Markdown, and CSS files directly into the file explorer.
                  </p>
                  <button
                    type="button"
                    className="mt-4 px-3 py-1.5 bg-[#252532] hover:bg-[#303040] text-[#ededee] text-xs font-medium rounded-lg border border-[#373748] transition-colors"
                  >
                    Browse .zip from computer
                  </button>
                </div>
              )}

              {/* Folder Mode */}
              {importMode === 'folder' && (
                <div
                  onClick={() => fileInputFolderRef.current?.click()}
                  className="border-2 border-dashed border-[#2e2e3a] bg-[#15151a] hover:border-[#fbbf24] hover:bg-[#181822] rounded-xl p-8 text-center cursor-pointer transition-all"
                >
                  <input
                    type="file"
                    ref={fileInputFolderRef}
                    onChange={(e) => handleFolderFilesSelected(e.target.files)}
                    // @ts-ignore
                    webkitdirectory=""
                    directory=""
                    multiple
                    className="hidden"
                  />
                  <div className="w-12 h-12 rounded-xl bg-[#20202a] border border-[#2d2d38] flex items-center justify-center mx-auto mb-3 text-[#fbbf24]">
                    <Folder className="w-6 h-6" />
                  </div>
                  <h3 className="text-sm font-semibold text-white">Select Folder from Local Machine</h3>
                  <p className="text-xs text-[#71717a] mt-1 max-w-sm mx-auto">
                    Recursively loads entire directory structure and opens entry files in editor tabs.
                  </p>
                  <button
                    type="button"
                    className="mt-4 px-3 py-1.5 bg-[#252532] hover:bg-[#303040] text-[#ededee] text-xs font-medium rounded-lg border border-[#373748] transition-colors"
                  >
                    Choose Directory
                  </button>
                </div>
              )}

              {/* JSON Mode */}
              {importMode === 'json' && (
                <form onSubmit={handleJsonSubmit} className="space-y-3">
                  <textarea
                    value={jsonInput}
                    onChange={(e) => setJsonInput(e.target.value)}
                    rows={6}
                    placeholder={`Paste JSON manifest, e.g.:\n{\n  "name": "my-app",\n  "files": [\n    { "path": "index.js", "content": "console.log('hi');" }\n  ]\n}`}
                    className="w-full bg-[#0d0d10] border border-[#262632] rounded-lg p-3 text-xs text-white placeholder-[#52525b] font-mono focus:outline-none focus:border-[#34d399]"
                  />
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-[#10b981] hover:bg-[#059669] text-white font-medium rounded-lg text-xs flex items-center space-x-1.5 transition-all"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Import Manifest</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* TAB 3: EXPORT PROJECT */}
          {projectModalTab === 'export' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#d4d4d8] mb-1.5">
                  Export Package Name
                </label>
                <input
                  type="text"
                  value={exportCustomName}
                  onChange={(e) => setExportCustomName(e.target.value)}
                  placeholder="project-export"
                  className="w-full bg-[#0d0d10] border border-[#262632] rounded-lg px-3.5 py-2 text-xs text-white font-mono focus:outline-none focus:border-[#6366f1]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Export Full ZIP */}
                <div className="bg-[#15151a] border border-[#242430] rounded-xl p-4 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center space-x-2 text-white font-medium text-xs mb-1">
                      <FileArchive className="w-4 h-4 text-[#818cf8]" />
                      <span>Full Project ZIP Bundle</span>
                    </div>
                    <p className="text-[11px] text-[#71717a] leading-relaxed">
                      Download all {files.length} active files, Python 4-agent orchestrator scripts, and assignment documentation.
                    </p>
                  </div>

                  <button
                    onClick={handleExportZipTrigger}
                    disabled={isExporting}
                    className="w-full py-2 bg-[#6366f1] hover:bg-[#4f46e5] text-white font-medium rounded-lg text-xs flex items-center justify-center space-x-1.5 transition-all shadow-xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{isExporting ? 'Generating ZIP...' : 'Download ZIP Archive'}</span>
                  </button>
                </div>

                {/* Export JSON Manifest */}
                <div className="bg-[#15151a] border border-[#242430] rounded-xl p-4 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center space-x-2 text-white font-medium text-xs mb-1">
                      <FileJson className="w-4 h-4 text-[#34d399]" />
                      <span>JSON Project Manifest</span>
                    </div>
                    <p className="text-[11px] text-[#71717a] leading-relaxed">
                      Single JSON file with project metadata, timestamps, and full file contents for quick sharing.
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => exportProjectJson(exportCustomName)}
                      className="flex-1 py-2 bg-[#1b1b24] hover:bg-[#252532] border border-[#2a2a38] text-[#ededee] font-medium rounded-lg text-xs flex items-center justify-center space-x-1.5 transition-all"
                    >
                      <Download className="w-3.5 h-3.5 text-[#34d399]" />
                      <span>Download JSON</span>
                    </button>
                    <button
                      onClick={handleCopyJsonToClipboard}
                      className="p-2 bg-[#1b1b24] hover:bg-[#252532] border border-[#2a2a38] text-[#71717a] hover:text-white rounded-lg transition-colors"
                      title="Copy JSON to Clipboard"
                    >
                      {copiedJson ? <Check className="w-3.5 h-3.5 text-[#34d399]" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Workspace Snapshot Summary */}
              <div className="bg-[#0e0e12] border border-[#1e1e24] rounded-lg p-3 space-y-2">
                <div className="text-[11px] font-medium text-[#ededee] flex items-center justify-between">
                  <span>Workspace Snapshot</span>
                  <span className="font-mono text-[#71717a]">{files.length} files</span>
                </div>
                <div className="max-h-28 overflow-y-auto space-y-1 font-mono text-[10px] text-[#71717a]">
                  {files.map(f => (
                    <div key={f.path} className="flex items-center justify-between hover:text-[#d4d4d8]">
                      <span className="truncate">{f.path}</span>
                      <span className="text-[#52525b] ml-2">{f.language}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
