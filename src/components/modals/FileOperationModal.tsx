import React, { useState, useEffect } from 'react';
import { useIDE } from '../../context/IDEContext';
import { 
  X, 
  Trash2, 
  Edit3, 
  FilePlus, 
  FolderPlus, 
  Copy, 
  AlertTriangle, 
  FileCode, 
  Download, 
  RotateCcw,
  Check
} from 'lucide-react';

export type FileModalType = 'delete' | 'rename' | 'new-file' | 'new-folder' | 'duplicate' | null;

interface FileOperationModalProps {
  isOpen: boolean;
  type: FileModalType;
  targetPath: string;
  isFolder?: boolean;
  onClose: () => void;
}

export const FileOperationModal: React.FC<FileOperationModalProps> = ({
  isOpen,
  type,
  targetPath,
  isFolder = false,
  onClose
}) => {
  const {
    files,
    createNewFile,
    createFolder,
    deleteFile,
    deleteFolder,
    renameFile,
    duplicateFile,
    revertFile,
    downloadSingleFile,
    projectName
  } = useIDE();

  const [inputVal, setInputVal] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const targetFile = files.find(f => f.path === targetPath);
  const fileName = targetPath.split('/').pop() || targetPath;

  useEffect(() => {
    if (isOpen) {
      setError('');
      setSuccessMsg('');
      if (type === 'rename') {
        setInputVal(targetPath);
      } else if (type === 'new-file') {
        setInputVal(isFolder ? `${targetPath}/newFile.js` : 'src/newFile.js');
      } else if (type === 'new-folder') {
        setInputVal(isFolder ? `${targetPath}/new-folder` : 'src/components');
      } else if (type === 'duplicate') {
        setInputVal('');
      }
    }
  }, [isOpen, type, targetPath, isFolder]);

  if (!isOpen || !type) return null;

  const handleDelete = () => {
    if (isFolder) {
      deleteFolder(targetPath);
    } else {
      deleteFile(targetPath);
    }
    onClose();
  };

  const handleRename = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = inputVal.trim().replace(/^\/+/, '');
    if (!clean) {
      setError('Please provide a valid file path.');
      return;
    }
    if (clean === targetPath) {
      onClose();
      return;
    }
    const success = renameFile(targetPath, clean);
    if (!success) {
      setError('A file with this name already exists in workspace.');
      return;
    }
    onClose();
  };

  const handleNewFile = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = inputVal.trim().replace(/^\/+/, '');
    if (!clean) {
      setError('Please provide a valid file name.');
      return;
    }
    if (files.some(f => f.path === clean)) {
      setError('File already exists.');
      return;
    }
    createNewFile(clean, '// ' + clean + '\n\n');
    onClose();
  };

  const handleNewFolder = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = inputVal.trim().replace(/^\/+/, '');
    if (!clean) {
      setError('Please enter a folder name.');
      return;
    }
    createFolder(clean);
    onClose();
  };

  const handleDuplicate = () => {
    duplicateFile(targetPath);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="w-full max-w-md bg-[#131317] border border-[#262633] rounded-xl shadow-2xl overflow-hidden text-xs text-[#ededee] animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#20202a] bg-[#17171d]">
          <div className="flex items-center space-x-2">
            {type === 'delete' && <Trash2 className="w-4 h-4 text-[#fb7185]" />}
            {type === 'rename' && <Edit3 className="w-4 h-4 text-[#818cf8]" />}
            {type === 'new-file' && <FilePlus className="w-4 h-4 text-[#34d399]" />}
            {type === 'new-folder' && <FolderPlus className="w-4 h-4 text-[#fbbf24]" />}
            {type === 'duplicate' && <Copy className="w-4 h-4 text-[#38bdf8]" />}

            <span className="font-semibold text-white text-sm">
              {type === 'delete' && (isFolder ? 'Delete Folder' : 'Delete File')}
              {type === 'rename' && (isFolder ? 'Rename Folder' : 'Rename File')}
              {type === 'new-file' && 'Create New File'}
              {type === 'new-folder' && 'Create New Folder'}
              {type === 'duplicate' && 'Duplicate File'}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-md text-[#71717a] hover:text-white hover:bg-[#20202a] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 space-y-3.5">
          {/* DELETE TYPE */}
          {type === 'delete' && (
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-[#fb7185]/10 border border-[#fb7185]/20 flex items-start space-x-2.5">
                <AlertTriangle className="w-4 h-4 text-[#fb7185] flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-[#ededee] font-medium">
                    Are you sure you want to permanently delete:
                  </p>
                  <p className="font-mono text-white bg-[#0f0f13] px-2 py-1 rounded border border-[#2b1f24] text-[11px] break-all">
                    {targetPath}
                  </p>
                  <p className="text-[#a1a1aa] text-[11px]">
                    {isFolder 
                      ? 'This will remove all files contained within this folder from your workspace.'
                      : 'This action will remove the file and close any active editor tabs.'}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  onClick={onClose}
                  className="px-3 py-1.5 rounded-lg bg-[#1a1a22] hover:bg-[#22222d] border border-[#2b2b38] text-[#a1a1aa] hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-3 py-1.5 rounded-lg bg-[#e11d48] hover:bg-[#be123c] text-white font-medium flex items-center space-x-1.5 transition-colors shadow-xs"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Confirm Delete</span>
                </button>
              </div>
            </div>
          )}

          {/* RENAME TYPE */}
          {type === 'rename' && (
            <form onSubmit={handleRename} className="space-y-3">
              <div>
                <label className="block text-[11px] text-[#71717a] font-medium mb-1.5">
                  Current path: <span className="font-mono text-[#ededee]">{targetPath}</span>
                </label>
                <input
                  type="text"
                  autoFocus
                  value={inputVal}
                  onChange={(e) => {
                    setInputVal(e.target.value);
                    setError('');
                  }}
                  placeholder="e.g. app/controllers/new-name.js"
                  className="w-full h-8 px-2.5 rounded-lg bg-[#0d0d10] border border-[#2b2b38] focus:border-[#818cf8] text-white font-mono text-xs focus:outline-none transition-colors"
                />
              </div>

              {error && (
                <div className="text-[#fb7185] text-[11px] flex items-center space-x-1">
                  <AlertTriangle className="w-3 h-3" />
                  <span>{error}</span>
                </div>
              )}

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3 py-1.5 rounded-lg bg-[#1a1a22] hover:bg-[#22222d] border border-[#2b2b38] text-[#a1a1aa] hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 rounded-lg bg-[#6366f1] hover:bg-[#4f46e5] text-white font-medium flex items-center space-x-1.5 transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Rename</span>
                </button>
              </div>
            </form>
          )}

          {/* NEW FILE TYPE */}
          {type === 'new-file' && (
            <form onSubmit={handleNewFile} className="space-y-3">
              <div>
                <label className="block text-[11px] text-[#71717a] font-medium mb-1.5">
                  New File Path (supports nested folders like <span className="font-mono text-[#a5b4fc]">src/api/auth.ts</span>):
                </label>
                <input
                  type="text"
                  autoFocus
                  value={inputVal}
                  onChange={(e) => {
                    setInputVal(e.target.value);
                    setError('');
                  }}
                  placeholder="e.g. app/routes/tag.routes.js"
                  className="w-full h-8 px-2.5 rounded-lg bg-[#0d0d10] border border-[#2b2b38] focus:border-[#34d399] text-white font-mono text-xs focus:outline-none transition-colors"
                />
              </div>

              {error && (
                <div className="text-[#fb7185] text-[11px] flex items-center space-x-1">
                  <AlertTriangle className="w-3 h-3" />
                  <span>{error}</span>
                </div>
              )}

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3 py-1.5 rounded-lg bg-[#1a1a22] hover:bg-[#22222d] border border-[#2b2b38] text-[#a1a1aa] hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 rounded-lg bg-[#10b981] hover:bg-[#059669] text-white font-medium flex items-center space-x-1.5 transition-colors"
                >
                  <FilePlus className="w-3.5 h-3.5" />
                  <span>Create File</span>
                </button>
              </div>
            </form>
          )}

          {/* NEW FOLDER TYPE */}
          {type === 'new-folder' && (
            <form onSubmit={handleNewFolder} className="space-y-3">
              <div>
                <label className="block text-[11px] text-[#71717a] font-medium mb-1.5">
                  New Folder Path:
                </label>
                <input
                  type="text"
                  autoFocus
                  value={inputVal}
                  onChange={(e) => {
                    setInputVal(e.target.value);
                    setError('');
                  }}
                  placeholder="e.g. app/middleware"
                  className="w-full h-8 px-2.5 rounded-lg bg-[#0d0d10] border border-[#2b2b38] focus:border-[#fbbf24] text-white font-mono text-xs focus:outline-none transition-colors"
                />
              </div>

              {error && (
                <div className="text-[#fb7185] text-[11px] flex items-center space-x-1">
                  <AlertTriangle className="w-3 h-3" />
                  <span>{error}</span>
                </div>
              )}

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3 py-1.5 rounded-lg bg-[#1a1a22] hover:bg-[#22222d] border border-[#2b2b38] text-[#a1a1aa] hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 rounded-lg bg-[#f59e0b] hover:bg-[#d97706] text-white font-medium flex items-center space-x-1.5 transition-colors"
                >
                  <FolderPlus className="w-3.5 h-3.5" />
                  <span>Create Folder</span>
                </button>
              </div>
            </form>
          )}

          {/* DUPLICATE TYPE */}
          {type === 'duplicate' && (
            <div className="space-y-3">
              <p className="text-[#ededee]">
                Create a duplicate copy of <strong className="font-mono text-white">{targetPath}</strong>?
              </p>
              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  onClick={onClose}
                  className="px-3 py-1.5 rounded-lg bg-[#1a1a22] hover:bg-[#22222d] border border-[#2b2b38] text-[#a1a1aa] hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDuplicate}
                  className="px-3.5 py-1.5 rounded-lg bg-[#38bdf8] hover:bg-[#0284c7] text-white font-medium flex items-center space-x-1.5 transition-colors"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Create Copy</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
