import React, { useEffect, useRef } from 'react';
import { 
  X, 
  XCircle, 
  Copy, 
  Download, 
  Edit3, 
  Trash2, 
  RotateCcw, 
  SplitSquareVertical, 
  Code, 
  Layers, 
  FilePlus, 
  FolderPlus,
  ClipboardCheck,
  FileCode
} from 'lucide-react';

export interface ContextMenuPosition {
  x: number;
  y: number;
}

export interface FileContextMenuProps {
  isOpen: boolean;
  position: ContextMenuPosition;
  targetPath: string;
  isFolder?: boolean;
  isTab?: boolean;
  isModified?: boolean;
  onClose: () => void;
  onOpenInEditor?: (path: string) => void;
  onOpenInDiff?: (path: string) => void;
  onCloseTab?: (path: string) => void;
  onCloseOtherTabs?: (path: string) => void;
  onCloseAllTabs?: () => void;
  onCloseSavedTabs?: () => void;
  onRename?: (path: string, isFolder: boolean) => void;
  onDuplicate?: (path: string) => void;
  onDelete?: (path: string, isFolder: boolean) => void;
  onRevert?: (path: string) => void;
  onDownload?: (path: string) => void;
  onNewFileInFolder?: (folderPath: string) => void;
  onNewFolderInFolder?: (folderPath: string) => void;
}

export const FileContextMenu: React.FC<FileContextMenuProps> = ({
  isOpen,
  position,
  targetPath,
  isFolder = false,
  isTab = false,
  isModified = false,
  onClose,
  onOpenInEditor,
  onOpenInDiff,
  onCloseTab,
  onCloseOtherTabs,
  onCloseAllTabs,
  onCloseSavedTabs,
  onRename,
  onDuplicate,
  onDelete,
  onRevert,
  onDownload,
  onNewFileInFolder,
  onNewFolderInFolder
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
      document.addEventListener('keydown', handleEscape);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Prevent overflowing viewport
  const menuWidth = 210;
  const menuHeight = 320;
  const adjustedX = Math.min(position.x, window.innerWidth - menuWidth - 10);
  const adjustedY = Math.min(position.y, window.innerHeight - menuHeight - 10);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    onClose();
  };

  const fileName = targetPath.split('/').pop() || targetPath;

  return (
    <div
      ref={menuRef}
      style={{ top: `${adjustedY}px`, left: `${adjustedX}px` }}
      className="fixed z-50 w-52 bg-[#16161c] border border-[#282836] rounded-xl shadow-2xl py-1.5 text-xs text-[#ededee] select-none animate-in fade-in zoom-in-95 duration-100 divide-y divide-[#22222d]"
    >
      {/* Header Info */}
      <div className="px-3 py-1 text-[10px] text-[#71717a] truncate font-mono flex items-center justify-between">
        <span className="truncate max-w-[150px] font-semibold text-[#a1a1aa]">{fileName}</span>
        {isModified && <span className="text-[#fbbf24] font-medium">Modified</span>}
      </div>

      {/* Tab Management Group */}
      {isTab && (
        <div className="py-1">
          {onCloseTab && (
            <button
              onClick={() => {
                onCloseTab(targetPath);
                onClose();
              }}
              className="w-full px-3 py-1.5 text-left hover:bg-[#22222e] hover:text-white flex items-center justify-between transition-colors"
            >
              <div className="flex items-center space-x-2">
                <X className="w-3.5 h-3.5 text-[#fb7185]" />
                <span>Close Tab</span>
              </div>
            </button>
          )}

          {onCloseOtherTabs && (
            <button
              onClick={() => {
                onCloseOtherTabs(targetPath);
                onClose();
              }}
              className="w-full px-3 py-1.5 text-left hover:bg-[#22222e] hover:text-white flex items-center justify-between transition-colors"
            >
              <div className="flex items-center space-x-2">
                <XCircle className="w-3.5 h-3.5 text-[#818cf8]" />
                <span>Close Others</span>
              </div>
            </button>
          )}

          {onCloseAllTabs && (
            <button
              onClick={() => {
                onCloseAllTabs();
                onClose();
              }}
              className="w-full px-3 py-1.5 text-left hover:bg-[#22222e] hover:text-white flex items-center justify-between transition-colors"
            >
              <div className="flex items-center space-x-2">
                <X className="w-3.5 h-3.5 text-[#fb7185]" />
                <span className="font-medium text-[#fb7185]">Close All Tabs</span>
              </div>
            </button>
          )}

          {onCloseSavedTabs && (
            <button
              onClick={() => {
                onCloseSavedTabs();
                onClose();
              }}
              className="w-full px-3 py-1.5 text-left hover:bg-[#22222e] hover:text-white flex items-center justify-between transition-colors"
            >
              <div className="flex items-center space-x-2">
                <RotateCcw className="w-3.5 h-3.5 text-[#a1a1aa]" />
                <span>Close Saved</span>
              </div>
            </button>
          )}
        </div>
      )}

      {/* Editor & View Options */}
      {!isFolder && (
        <div className="py-1">
          {onOpenInEditor && (
            <button
              onClick={() => {
                onOpenInEditor(targetPath);
                onClose();
              }}
              className="w-full px-3 py-1.5 text-left hover:bg-[#22222e] hover:text-white flex items-center space-x-2 transition-colors"
            >
              <Code className="w-3.5 h-3.5 text-[#34d399]" />
              <span>Open in Editor</span>
            </button>
          )}

          {onOpenInDiff && (
            <button
              onClick={() => {
                onOpenInDiff(targetPath);
                onClose();
              }}
              className="w-full px-3 py-1.5 text-left hover:bg-[#22222e] hover:text-white flex items-center space-x-2 transition-colors"
            >
              <SplitSquareVertical className="w-3.5 h-3.5 text-[#818cf8]" />
              <span>Compare Side-by-Side Diff</span>
            </button>
          )}
        </div>
      )}

      {/* Folder Sub-actions */}
      {isFolder && (
        <div className="py-1">
          {onNewFileInFolder && (
            <button
              onClick={() => {
                onNewFileInFolder(targetPath);
                onClose();
              }}
              className="w-full px-3 py-1.5 text-left hover:bg-[#22222e] hover:text-white flex items-center space-x-2 transition-colors"
            >
              <FilePlus className="w-3.5 h-3.5 text-[#34d399]" />
              <span>New File in Folder...</span>
            </button>
          )}
          {onNewFolderInFolder && (
            <button
              onClick={() => {
                onNewFolderInFolder(targetPath);
                onClose();
              }}
              className="w-full px-3 py-1.5 text-left hover:bg-[#22222e] hover:text-white flex items-center space-x-2 transition-colors"
            >
              <FolderPlus className="w-3.5 h-3.5 text-[#fbbf24]" />
              <span>New Subfolder...</span>
            </button>
          )}
        </div>
      )}

      {/* File Modification & Duplication */}
      <div className="py-1">
        {onRename && (
          <button
            onClick={() => {
              onRename(targetPath, isFolder);
              onClose();
            }}
            className="w-full px-3 py-1.5 text-left hover:bg-[#22222e] hover:text-white flex items-center space-x-2 transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5 text-[#818cf8]" />
            <span>Rename...</span>
          </button>
        )}

        {!isFolder && onDuplicate && (
          <button
            onClick={() => {
              onDuplicate(targetPath);
              onClose();
            }}
            className="w-full px-3 py-1.5 text-left hover:bg-[#22222e] hover:text-white flex items-center space-x-2 transition-colors"
          >
            <Copy className="w-3.5 h-3.5 text-[#38bdf8]" />
            <span>Duplicate File</span>
          </button>
        )}

        {!isFolder && onDownload && (
          <button
            onClick={() => {
              onDownload(targetPath);
              onClose();
            }}
            className="w-full px-3 py-1.5 text-left hover:bg-[#22222e] hover:text-white flex items-center space-x-2 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-[#34d399]" />
            <span>Download File</span>
          </button>
        )}

        {isModified && onRevert && (
          <button
            onClick={() => {
              onRevert(targetPath);
              onClose();
            }}
            className="w-full px-3 py-1.5 text-left hover:bg-[#22222e] hover:text-[#fbbf24] flex items-center space-x-2 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#fbbf24]" />
            <span>Revert Changes</span>
          </button>
        )}
      </div>

      {/* Copy Path Group */}
      <div className="py-1">
        <button
          onClick={() => copyToClipboard(targetPath)}
          className="w-full px-3 py-1.5 text-left hover:bg-[#22222e] hover:text-white flex items-center space-x-2 transition-colors"
        >
          <ClipboardCheck className="w-3.5 h-3.5 text-[#71717a]" />
          <span>Copy Relative Path</span>
        </button>
      </div>

      {/* Delete / Remove Action */}
      {onDelete && (
        <div className="py-1">
          <button
            onClick={() => {
              onDelete(targetPath, isFolder);
              onClose();
            }}
            className="w-full px-3 py-1.5 text-left text-[#fb7185] hover:bg-[#f43f5e]/15 flex items-center space-x-2 transition-colors font-medium"
          >
            <Trash2 className="w-3.5 h-3.5 text-[#fb7185]" />
            <span>{isFolder ? 'Delete Folder' : 'Delete File'}</span>
          </button>
        </div>
      )}
    </div>
  );
};
