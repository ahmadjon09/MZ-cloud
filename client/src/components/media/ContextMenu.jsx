/**
 * Telegram Context Menu (Right-Click Menu)
 * Provides native desktop menu actions for any Saved Message / File item
 */
import React from 'react';
import {
  Eye,
  Folder as FolderIcon,
  Star,
  Pin,
  FileText,
  Tag,
  Share2,
  Download,
  Trash2,
  RotateCcw,
  XCircle
} from 'lucide-react';
import {
  useUpdateFile,
  useShareFile,
  useDeleteFile,
  useRestoreFile,
  usePermanentDeleteFile
} from '../../hooks/useFiles';
import { useUIStore } from '../../store/useUIStore';

export default function ContextMenu({ file, position, onClose }) {
  const updateFile = useUpdateFile();
  const shareFile = useShareFile();
  const deleteFile = useDeleteFile();
  const restoreFile = useRestoreFile();
  const permDeleteFile = usePermanentDeleteFile();

  const {
    openImageGallery,
    openVideoPlayer,
    openNoteEditor,
    openTagEditor,
    openShareModal
  } = useUIStore();

  React.useEffect(() => {
    const handleOutsideClick = () => onClose();
    window.addEventListener('click', handleOutsideClick);
    return () => window.removeEventListener('click', handleOutsideClick);
  }, [onClose]);

  if (!file) return null;

  const handleOpenPreview = () => {
    if (file.category === 'PHOTO') {
      openImageGallery(file);
    } else if (file.category === 'VIDEO') {
      openVideoPlayer(file);
    } else {
      openNoteEditor(file);
    }
  };

  const handleToggleFavorite = () => {
    updateFile.mutate({
      id: file.id,
      data: { isFavorite: !file.isFavorite }
    });
  };

  const handleTogglePin = () => {
    updateFile.mutate({
      id: file.id,
      data: { isPinned: !file.isPinned }
    });
  };

  const handleShare = async () => {
    const res = await shareFile.mutateAsync(file.id);
    if (res.data) {
      openShareModal(res.data);
    }
  };

  const isTrash = file.isDeleted;

  return (
    <div
      style={{ top: position.y, left: position.x }}
      className="fixed z-50 w-52 py-1.5 bg-telegram-light-card dark:bg-telegram-dark-card rounded-xl shadow-2xl border border-telegram-light-border dark:border-telegram-dark-border text-xs font-medium text-slate-700 dark:text-slate-200 animate-in fade-in zoom-in-95 duration-100"
      onClick={(e) => e.stopPropagation()}
    >
      <button
        onClick={() => { handleOpenPreview(); onClose(); }}
        className="w-full flex items-center space-x-2.5 px-3 py-2 hover:bg-telegram-blue hover:text-white transition-colors text-left"
      >
        <Eye className="w-4 h-4" />
        <span>Open / Preview</span>
      </button>

      {!isTrash && (
        <>
          <button
            onClick={() => { handleToggleFavorite(); onClose(); }}
            className="w-full flex items-center space-x-2.5 px-3 py-2 hover:bg-telegram-blue hover:text-white transition-colors text-left"
          >
            <Star className="w-4 h-4" />
            <span>{file.isFavorite ? 'Unfavorite' : 'Favorite'}</span>
          </button>

          <button
            onClick={() => { handleTogglePin(); onClose(); }}
            className="w-full flex items-center space-x-2.5 px-3 py-2 hover:bg-telegram-blue hover:text-white transition-colors text-left"
          >
            <Pin className="w-4 h-4" />
            <span>{file.isPinned ? 'Unpin from Top' : 'Pin to Top'}</span>
          </button>

          <button
            onClick={() => { openNoteEditor(file); onClose(); }}
            className="w-full flex items-center space-x-2.5 px-3 py-2 hover:bg-telegram-blue hover:text-white transition-colors text-left"
          >
            <FileText className="w-4 h-4" />
            <span>Private Notes</span>
          </button>

          <button
            onClick={() => { openTagEditor(file); onClose(); }}
            className="w-full flex items-center space-x-2.5 px-3 py-2 hover:bg-telegram-blue hover:text-white transition-colors text-left"
          >
            <Tag className="w-4 h-4" />
            <span>Manage Tags</span>
          </button>

          <button
            onClick={() => { handleShare(); onClose(); }}
            className="w-full flex items-center space-x-2.5 px-3 py-2 hover:bg-telegram-blue hover:text-white transition-colors text-left"
          >
            <Share2 className="w-4 h-4" />
            <span>Share Public Link</span>
          </button>

          <div className="my-1 border-t border-telegram-light-border dark:border-telegram-dark-border" />

          <button
            onClick={() => { deleteFile.mutate(file.id); onClose(); }}
            className="w-full flex items-center space-x-2.5 px-3 py-2 text-red-500 hover:bg-red-500 hover:text-white transition-colors text-left"
          >
            <Trash2 className="w-4 h-4" />
            <span>Move to Recycle Bin</span>
          </button>
        </>
      )}

      {isTrash && (
        <>
          <button
            onClick={() => { restoreFile.mutate(file.id); onClose(); }}
            className="w-full flex items-center space-x-2.5 px-3 py-2 text-emerald-500 hover:bg-emerald-500 hover:text-white transition-colors text-left"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Restore File</span>
          </button>

          <button
            onClick={() => {
              if (window.confirm('Delete this file permanently?')) {
                permDeleteFile.mutate(file.id);
              }
              onClose();
            }}
            className="w-full flex items-center space-x-2.5 px-3 py-2 text-red-500 hover:bg-red-500 hover:text-white transition-colors text-left"
          >
            <XCircle className="w-4 h-4" />
            <span>Delete Permanently</span>
          </button>
        </>
      )}
    </div>
  );
}
