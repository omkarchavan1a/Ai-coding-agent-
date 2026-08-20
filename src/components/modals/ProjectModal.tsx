import React, { useState, useRef } from 'react';
import { useIDE } from '../../context/IDEContext';
import { PROJECT_TEMPLATES } from '../../data/projectTemplates';
import { POPULAR_GIT_PRESETS, parseGitUrl } from '../../utils/gitClone';
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
  Check,
  GitBranch,
  GitFork,
  Globe,
  Key,
  Terminal,
  Loader2,
  Lock,
  Eye,
  EyeOff
} from 'lucide-react';

export const ProjectModal: React.FC = () => {
  const {
    projectName,
    isProjectModalOpen,
    setIsProjectModalOpen,
    projectModalTab,
    setProjectModalTab,
    createNewProject,
    cloneRepository,
    isCloningRepo,
    cloneStatusMessage,
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

  // Clone Repository State
  const [cloneUrl, setCloneUrl] = useState<string>('');
  const [cloneBranch, setCloneBranch] = useState<string>('');
  const [cloneToken, setCloneToken] = useState<string>('');
  const [showToken, setShowToken] = useState<boolean>(false);
  const [cloneError, setCloneError] = useState<string | null>(null);
  const [cloneSuccess, setCloneSuccess] = useState<string | null>(null);

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

  const handleCloneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cloneUrl.trim()) {
      setCloneError('Please enter a valid Git or GitHub repository URL.');
      return;
    }

    setCloneError(null);
    setCloneSuccess(null);

    const result = await cloneRepository(cloneUrl.trim(), cloneBranch.trim() || undefined, cloneToken.trim() || undefined);

    if (result.success) {
      setCloneSuccess(`Successfully cloned ${result.repoName} (${result.count} files, branch: ${result.branch})!`);
      setTimeout(() => {
        setIsProjectModalOpen(false);
      }, 900);
    } else {
      setCloneError(result.error || 'Failed to clone repository.');
    }
  };

  const handleSelectPreset = (presetUrl: string, presetBranch?: string) => {
    setCloneUrl(presetUrl);
    if (presetBranch) setCloneBranch(presetBranch);
    setCloneError(null);
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

  const parsedUrlInfo = parseGitUrl(cloneUrl);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div 
        className="w-full max-w-2xl bg-[#131317] border border-[#262632] rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[88vh]"
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
              <p className="text-[11px] text-[#71717a]">Create, clone, import, or export repositories and workspaces</p>
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
        <div className="flex items-center border-b border-[#202028] bg-[#111115] px-4 pt-2 overflow-x-auto">
          <button
            onClick={() => setProjectModalTab('new')}
            className={`flex items-center space-x-2 px-3.5 py-2 text-xs font-medium border-b-2 transition-all shrink-0 ${
              projectModalTab === 'new'
                ? 'border-[#6366f1] text-white'
                : 'border-transparent text-[#71717a] hover:text-[#d4d4d8]'
            }`}
          >
            <FolderPlus className="w-3.5 h-3.5" />
            <span>New Project</span>
          </button>

          <button
            onClick={() => setProjectModalTab('clone')}
            className={`flex items-center space-x-2 px-3.5 py-2 text-xs font-medium border-b-2 transition-all shrink-0 ${
              projectModalTab === 'clone'
                ? 'border-[#38bdf8] text-white'
                : 'border-transparent text-[#71717a] hover:text-[#d4d4d8]'
            }`}
          >
            <GitFork className="w-3.5 h-3.5 text-[#38bdf8]" />
            <span className="flex items-center space-x-1.5">
              <span>Clone Repository</span>
              <span className="px-1.5 py-0.2 bg-[#0284c7]/20 text-[#38bdf8] text-[9px] rounded font-mono">Git</span>
            </span>
          </button>

          <button
            onClick={() => setProjectModalTab('import')}
            className={`flex items-center space-x-2 px-3.5 py-2 text-xs font-medium border-b-2 transition-all shrink-0 ${
              projectModalTab === 'import'
                ? 'border-[#6366f1] text-white'
                : 'border-transparent text-[#71717a] hover:text-[#d4d4d8]'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Import</span>
          </button>

          <button
            onClick={() => setProjectModalTab('export')}
            className={`flex items-center space-x-2 px-3.5 py-2 text-xs font-medium border-b-2 transition-all shrink-0 ${
              projectModalTab === 'export'
                ? 'border-[#6366f1] text-white'
                : 'border-transparent text-[#71717a] hover:text-[#d4d4d8]'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export</span>
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
                  Select Project Starter
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {PROJECT_TEMPLATES.map((tmpl) => {
                    const isSelected = selectedTemplateId === tmpl.id;
                    const badgeColor = 
                      tmpl.category === 'node' ? '#22c55e' :
                      tmpl.category === 'react' ? '#38bdf8' :
                      tmpl.category === 'python' ? '#f59e0b' : '#a1a1aa';
                    const entryFileName = tmpl.files[0]?.path?.split('/').pop() || 'index.js';

                    return (
                      <div
                        key={tmpl.id}
                        onClick={() => setSelectedTemplateId(tmpl.id)}
                        className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-[#1e1b4b]/40 border-[#6366f1] ring-1 ring-[#6366f1]/50'
                            : 'bg-[#15151a] border-[#242430] hover:border-[#383848] hover:bg-[#191920]'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-1.5">
                          <span className="font-semibold text-xs text-white">{tmpl.name}</span>
                          <span
                            className="text-[10px] px-2 py-0.5 rounded font-mono font-medium"
                            style={{
                              backgroundColor: `${badgeColor}15`,
                              color: badgeColor,
                              border: `1px solid ${badgeColor}30`
                            }}
                          >
                            {tmpl.category}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#71717a] leading-relaxed mb-3 line-clamp-2">
                          {tmpl.description}
                        </p>
                        <div className="flex items-center justify-between text-[10px] text-[#52525b] font-mono border-t border-[#202028] pt-2">
                          <span>{tmpl.files.length} files</span>
                          <span>Entry: {entryFileName}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end space-x-3 border-t border-[#202028]">
                <button
                  type="button"
                  onClick={() => setIsProjectModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs text-[#a1a1aa] hover:text-white hover:bg-[#1e1e24] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#6366f1] hover:bg-[#4f46e5] text-white font-medium rounded-lg text-xs flex items-center space-x-1.5 transition-all shadow-xs"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Create Workspace</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: CLONE REPOSITORY */}
          {projectModalTab === 'clone' && (
            <div className="space-y-4">
              <form onSubmit={handleCloneSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-[#d4d4d8] mb-1.5 flex items-center justify-between">
                    <span>Repository URL or GitHub Shortcode</span>
                    <span className="text-[10px] text-[#38bdf8] font-mono">Git / GitHub / GitLab</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={cloneUrl}
                      onChange={(e) => {
                        setCloneUrl(e.target.value);
                        setCloneError(null);
                      }}
                      placeholder="e.g. https://github.com/expressjs/express or owner/repo"
                      className="w-full bg-[#0d0d10] border border-[#262632] rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-[#52525b] focus:outline-none focus:border-[#38bdf8] font-mono transition-colors"
                    />
                  </div>
                  {parsedUrlInfo.isValid && (
                    <div className="mt-1.5 flex items-center space-x-2 text-[11px] text-[#71717a] font-mono">
                      <span className="text-[#38bdf8]">Detected:</span>
                      <span className="text-[#ededee]">{parsedUrlInfo.displayName}</span>
                      {parsedUrlInfo.isGitHub && (
                        <span className="px-1.5 py-0.2 bg-emerald-500/10 text-emerald-400 text-[9px] rounded">GitHub</span>
                      )}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* Branch (Optional) */}
                  <div>
                    <label className="block text-xs font-medium text-[#d4d4d8] mb-1.5 flex items-center space-x-1.5">
                      <GitBranch className="w-3.5 h-3.5 text-[#a1a1aa]" />
                      <span>Branch (Optional)</span>
                    </label>
                    <input
                      type="text"
                      value={cloneBranch}
                      onChange={(e) => setCloneBranch(e.target.value)}
                      placeholder="main / master / feature-branch"
                      className="w-full bg-[#0d0d10] border border-[#262632] rounded-lg px-3 py-2 text-xs text-white placeholder-[#52525b] focus:outline-none focus:border-[#38bdf8] font-mono"
                    />
                  </div>

                  {/* Private Token (Optional) */}
                  <div>
                    <label className="block text-xs font-medium text-[#d4d4d8] mb-1.5 flex items-center space-x-1.5">
                      <Key className="w-3.5 h-3.5 text-[#a1a1aa]" />
                      <span>GitHub Token (For Private Repos)</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showToken ? 'text' : 'password'}
                        value={cloneToken}
                        onChange={(e) => setCloneToken(e.target.value)}
                        placeholder="ghp_xxxxxxxxxxxx"
                        className="w-full bg-[#0d0d10] border border-[#262632] rounded-lg pl-3 pr-8 py-2 text-xs text-white placeholder-[#52525b] focus:outline-none focus:border-[#38bdf8] font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setShowToken(!showToken)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#71717a] hover:text-white"
                      >
                        {showToken ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Status / Error Banner */}
                {cloneError && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start space-x-2.5 text-xs text-red-400">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
                    <span>{cloneError}</span>
                  </div>
                )}

                {cloneSuccess && (
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex items-start space-x-2.5 text-xs text-emerald-400">
                    <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
                    <span>{cloneSuccess}</span>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center justify-end space-x-3 pt-2 border-t border-[#202028]">
                  <button
                    type="button"
                    onClick={() => setIsProjectModalOpen(false)}
                    className="px-4 py-2 rounded-lg text-xs text-[#a1a1aa] hover:text-white hover:bg-[#1e1e24] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isCloningRepo}
                    className="px-4 py-2 bg-[#0284c7] hover:bg-[#0369a1] text-white font-medium rounded-lg text-xs flex items-center space-x-1.5 transition-all shadow-xs disabled:opacity-50"
                  >
                    {isCloningRepo ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>{cloneStatusMessage || 'Cloning Repository...'}</span>
                      </>
                    ) : (
                      <>
                        <GitFork className="w-3.5 h-3.5" />
                        <span>Clone Repository</span>
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Quick Preset Repositories */}
              <div className="pt-3 border-t border-[#202028]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-semibold text-[#a1a1aa] uppercase tracking-wider">
                    Popular Open Source Repositories
                  </span>
                  <span className="text-[10px] text-[#71717a]">One-click clone presets</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  {POPULAR_GIT_PRESETS.map((preset) => (
                    <div
                      key={preset.id}
                      onClick={() => handleSelectPreset(`https://github.com/${preset.owner}/${preset.repo}`, preset.branch)}
                      className="p-3 bg-[#15151a] hover:bg-[#1a1a22] border border-[#242430] hover:border-[#38bdf8]/40 rounded-xl cursor-pointer transition-all group"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center space-x-1.5">
                          <span className="font-semibold text-xs text-white group-hover:text-[#38bdf8] transition-colors">
                            {preset.name}
                          </span>
                          <span className="text-[10px] text-[#71717a] font-mono">
                            {preset.owner}/{preset.repo}
                          </span>
                        </div>
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#1f1f2a] text-[#a1a1aa] font-mono">
                          ★ {preset.stars}
                        </span>
                      </div>
                      <p className="text-[10px] text-[#71717a] line-clamp-1 mb-1.5">
                        {preset.description}
                      </p>
                      <div className="flex items-center justify-between text-[9px] text-[#52525b] font-mono">
                        <span style={{ color: preset.badgeColor }}>{preset.language}</span>
                        <span className="text-[#38bdf8] group-hover:underline">Use preset →</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: IMPORT PROJECT */}
          {projectModalTab === 'import' && (
            <div className="space-y-4">
              {/* Import Mode Selector */}
              <div className="flex items-center bg-[#0d0d10] p-1 rounded-lg border border-[#262632]">
                <button
                  type="button"
                  onClick={() => setImportMode('zip')}
                  className={`flex-1 py-1.5 text-xs font-medium rounded-md flex items-center justify-center space-x-1.5 transition-all ${
                    importMode === 'zip' ? 'bg-[#20202a] text-white shadow-xs' : 'text-[#71717a] hover:text-[#d4d4d8]'
                  }`}
                >
                  <FileArchive className="w-3.5 h-3.5 text-[#818cf8]" />
                  <span>ZIP Archive</span>
                </button>
                <button
                  type="button"
                  onClick={() => setImportMode('folder')}
                  className={`flex-1 py-1.5 text-xs font-medium rounded-md flex items-center justify-center space-x-1.5 transition-all ${
                    importMode === 'folder' ? 'bg-[#20202a] text-white shadow-xs' : 'text-[#71717a] hover:text-[#d4d4d8]'
                  }`}
                >
                  <Folder className="w-3.5 h-3.5 text-[#f59e0b]" />
                  <span>Folder Directory</span>
                </button>
                <button
                  type="button"
                  onClick={() => setImportMode('json')}
                  className={`flex-1 py-1.5 text-xs font-medium rounded-md flex items-center justify-center space-x-1.5 transition-all ${
                    importMode === 'json' ? 'bg-[#20202a] text-white shadow-xs' : 'text-[#71717a] hover:text-[#d4d4d8]'
                  }`}
                >
                  <FileJson className="w-3.5 h-3.5 text-[#34d399]" />
                  <span>JSON Manifest</span>
                </button>
              </div>

              {/* Status Message */}
              {importStatusMessage && (
                <div
                  className={`p-3 rounded-lg border flex items-start space-x-2.5 text-xs ${
                    importStatusMessage.type === 'success'
                      ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                      : 'bg-red-500/10 border-red-500/20 text-red-400'
                  }`}
                >
                  {importStatusMessage.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  )}
                  <span>{importStatusMessage.text}</span>
                </div>
              )}

              {/* 1. ZIP File Upload */}
              {importMode === 'zip' && (
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputZipRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                    isDragging
                      ? 'border-[#6366f1] bg-[#6366f1]/10'
                      : 'border-[#262632] hover:border-[#3e3e50] bg-[#101014]'
                  }`}
                >
                  <input
                    type="file"
                    ref={fileInputZipRef}
                    onChange={(e) => e.target.files && e.target.files[0] && handleZipFileSelected(e.target.files[0])}
                    accept=".zip"
                    className="hidden"
                  />
                  <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-3">
                    <Upload className="w-6 h-6" />
                  </div>
                  <p className="text-xs font-medium text-white mb-1">
                    {isProcessingImport ? 'Extracting project files...' : 'Click or drag & drop project .zip archive'}
                  </p>
                  <p className="text-[11px] text-[#71717a] max-w-sm">
                    Supports any standard repository export (e.g. GitHub ZIP downloads, local projects)
                  </p>
                </div>
              )}

              {/* 2. Folder Upload */}
              {importMode === 'folder' && (
                <div
                  onClick={() => fileInputFolderRef.current?.click()}
                  className="border-2 border-dashed border-[#262632] hover:border-[#3e3e50] rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer bg-[#101014] transition-all"
                >
                  <input
                    type="file"
                    ref={fileInputFolderRef}
                    onChange={(e) => handleFolderFilesSelected(e.target.files)}
                    // @ts-ignore
                    webkitdirectory="true"
                    directory="true"
                    multiple
                    className="hidden"
                  />
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-3">
                    <Folder className="w-6 h-6" />
                  </div>
                  <p className="text-xs font-medium text-white mb-1">
                    {isProcessingImport ? 'Loading directory files...' : 'Select local folder directory'}
                  </p>
                  <p className="text-[11px] text-[#71717a] max-w-sm">
                    Imports entire folder hierarchy directly into your browser workspace
                  </p>
                </div>
              )}

              {/* 3. JSON Manifest Paste */}
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

          {/* TAB 4: EXPORT PROJECT */}
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
