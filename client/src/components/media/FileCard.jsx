/**
 * Telegram File Item Card (Vector Icons Only - Lucide React)
 * Glassmorphic card for Photos, Videos, Documents, Audio, Voice, and Code
 * Directly renders real Telegram CDN photo thumbnails
 */
import React from 'react';
import {
  Image as ImageIcon,
  Video,
  FileText,
  Music,
  Mic,
  Code,
  Archive,
  Star,
  Pin,
  File
} from 'lucide-react';
import { useUIStore } from '../../store/useUIStore';
import { useAudioPlayerStore } from '../../store/useAudioPlayerStore';

export default function FileCard({ file, onContextMenu, allFiles = [] }) {
  const { openImageGallery, openVideoPlayer, openNoteEditor } = useUIStore();
  const { playTrack } = useAudioPlayerStore();
  const [imgError, setImgError] = React.useState(false);

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'PHOTO': return <ImageIcon className="w-4 h-4 text-telegram-blue" />;
      case 'VIDEO': return <Video className="w-4 h-4 text-red-500" />;
      case 'AUDIO': return <Music className="w-4 h-4 text-emerald-500" />;
      case 'VOICE': return <Mic className="w-4 h-4 text-amber-500" />;
      case 'DOCUMENT': return <FileText className="w-4 h-4 text-blue-500" />;
      case 'CODE': return <Code className="w-4 h-4 text-purple-500" />;
      case 'ARCHIVE': return <Archive className="w-4 h-4 text-orange-500" />;
      default: return <File className="w-4 h-4 text-slate-400" />;
    }
  };

  const formatSize = (bytes = 0) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  };

  const handleCardClick = () => {
    if (file.category === 'PHOTO') {
      openImageGallery(file);
    } else if (file.category === 'VIDEO') {
      openVideoPlayer(file);
    } else if (file.category === 'AUDIO' || file.category === 'VOICE') {
      const musicTracks = allFiles.filter((f) => f.category === 'AUDIO' || f.category === 'VOICE');
      playTrack(file, musicTracks);
    } else {
      openNoteEditor(file);
    }
  };

  const tagsList = React.useMemo(() => {
    try {
      if (Array.isArray(file.tags)) return file.tags;
      return JSON.parse(file.tags || '[]');
    } catch (e) {
      return [];
    }
  }, [file.tags]);

  return (
    <div
      onClick={handleCardClick}
      onContextMenu={(e) => {
        e.preventDefault();
        onContextMenu(e, file);
      }}
      className="group relative bg-telegram-light-card dark:bg-telegram-dark-card border border-telegram-light-border dark:border-telegram-dark-border rounded-2xl p-3 shadow-sm hover:shadow-telegram-card hover:border-telegram-blue/60 transition-all duration-200 cursor-pointer flex flex-col justify-between"
    >
      {/* Top badges: Favorite & Pin */}
      <div className="absolute top-3 right-3 flex items-center space-x-1 z-10">
        {file.isPinned && (
          <span className="p-1 rounded-full bg-telegram-blue/10 text-telegram-blue" title="Pinned">
            <Pin className="w-3.5 h-3.5" />
          </span>
        )}
        {file.isFavorite && (
          <span className="p-1 rounded-full bg-amber-500/10 text-amber-500" title="Favorite">
            <Star className="w-3.5 h-3.5 fill-amber-500" />
          </span>
        )}
      </div>

      {/* Media Thumbnail / Preview Box */}
      <div className="w-full h-32 rounded-xl bg-telegram-light dark:bg-telegram-dark/60 flex items-center justify-center overflow-hidden mb-3 relative group-hover:scale-[1.02] transition-transform">
        {file.category === 'PHOTO' && !imgError ? (
          <img
            src={`/api/v1/files/${file.id}/thumbnail`}
            alt={file.fileName}
            className="w-full h-full object-cover transition-transform duration-200"
            onError={() => setImgError(true)}
          />
        ) : file.category === 'PHOTO' ? (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-tr from-telegram-blue/10 to-blue-500/10 text-telegram-blue font-medium text-xs">
            <ImageIcon className="w-10 h-10 mb-1 opacity-80" />
            <span className="text-[10px] uppercase font-semibold text-slate-500">{file.extension}</span>
          </div>
        ) : file.category === 'VIDEO' ? (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-tr from-red-500/10 to-amber-500/10 text-red-500 font-medium text-xs">
            <Video className="w-10 h-10 mb-1 opacity-80" />
            <span className="text-[10px] uppercase font-semibold text-slate-500">
              {file.duration ? `${file.duration}s` : 'Video'}
            </span>
          </div>
        ) : file.category === 'AUDIO' ? (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-tr from-emerald-500/10 to-teal-500/10 text-emerald-500 font-medium text-xs">
            <Music className="w-10 h-10 mb-1 opacity-80" />
            <span className="text-[10px] uppercase font-semibold text-slate-500">Audio Track</span>
          </div>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-slate-200/50 dark:bg-slate-800/50 text-slate-500 font-medium text-xs">
            {getCategoryIcon(file.category)}
            <span className="text-[10px] uppercase font-semibold mt-1">{file.extension}</span>
          </div>
        )}
      </div>

      {/* File Info Footer */}
      <div>
        <div className="flex items-center space-x-1.5 mb-1">
          {getCategoryIcon(file.category)}
          <span className="font-semibold text-xs text-slate-800 dark:text-slate-100 truncate flex-1">
            {file.fileName}
          </span>
        </div>

        {file.caption && (
          <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mb-1">
            {file.caption}
          </p>
        )}

        {/* Tags badges */}
        {tagsList.length > 0 && (
          <div className="flex items-center flex-wrap gap-1 mt-1 mb-1.5">
            {tagsList.slice(0, 3).map((tag, idx) => (
              <span
                key={idx}
                className="text-[9px] px-1.5 py-0.5 rounded bg-telegram-blue/10 text-telegram-blue font-medium"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1 border-t border-telegram-light-border/60 dark:border-telegram-dark-border/60 pt-1.5">
          <span>{formatSize(file.fileSize)}</span>
          <span>{new Date(file.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
}
