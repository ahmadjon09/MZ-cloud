/**
 * Telegram File Item Card (react-icons/fi Only)
 * Glassmorphic card for Photos, Videos, Documents, Audio, Voice, and Code
 * Directly renders real Telegram CDN photo thumbnails
 */
import React from 'react';
import {
  FiImage,
  FiVideo,
  FiFileText,
  FiMusic,
  FiMic,
  FiCode,
  FiArchive,
  FiStar,
  FiFile
} from 'react-icons/fi';
import { useUIStore } from '../../store/useUIStore';
import { useAudioPlayerStore } from '../../store/useAudioPlayerStore';

export default function FileCard({ file, onContextMenu, allFiles = [] }) {
  const { openImageGallery, openVideoPlayer, openNoteEditor } = useUIStore();
  const { playTrack } = useAudioPlayerStore();
  const [imgError, setImgError] = React.useState(false);

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'PHOTO': return <FiImage className="w-4 h-4 text-[#2481cc]" />;
      case 'VIDEO': return <FiVideo className="w-4 h-4 text-red-500" />;
      case 'AUDIO': return <FiMusic className="w-4 h-4 text-emerald-500" />;
      case 'VOICE': return <FiMic className="w-4 h-4 text-amber-500" />;
      case 'DOCUMENT': return <FiFileText className="w-4 h-4 text-blue-500" />;
      case 'CODE': return <FiCode className="w-4 h-4 text-purple-500" />;
      case 'ARCHIVE': return <FiArchive className="w-4 h-4 text-orange-500" />;
      default: return <FiFile className="w-4 h-4 text-slate-400" />;
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
      className="group relative bg-[#1e2329]/90 border border-white/10 rounded-2xl p-3 shadow-sm hover:shadow-xl hover:border-[#2481cc]/60 transition-all duration-200 cursor-pointer flex flex-col justify-between backdrop-blur-md"
    >
      {/* Top badges: Favorite */}
      <div className="absolute top-3 right-3 flex items-center space-x-1 z-10">
        {file.isFavorite && (
          <span className="p-1 rounded-full bg-amber-500/10 text-amber-500" title="Favorite">
            <FiStar className="w-3.5 h-3.5 fill-amber-500" />
          </span>
        )}
      </div>

      {/* Media Thumbnail / Preview Box */}
      <div className="w-full h-32 rounded-xl bg-[#17212b]/80 flex items-center justify-center overflow-hidden mb-3 relative group-hover:scale-[1.02] transition-transform">
        {file.category === 'PHOTO' && !imgError ? (
          <img
            src={`/api/v1/files/${file.id}/thumbnail`}
            alt={file.fileName}
            className="w-full h-full object-cover transition-transform duration-200"
            onError={() => setImgError(true)}
          />
        ) : file.category === 'PHOTO' ? (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-tr from-[#2481cc]/10 to-blue-500/10 text-[#2481cc] font-medium text-xs">
            <FiImage className="w-10 h-10 mb-1 opacity-80" />
            <span className="text-[10px] uppercase font-semibold text-slate-400">{file.extension}</span>
          </div>
        ) : file.category === 'VIDEO' ? (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-tr from-red-500/10 to-amber-500/10 text-red-500 font-medium text-xs">
            <FiVideo className="w-10 h-10 mb-1 opacity-80" />
            <span className="text-[10px] uppercase font-semibold text-slate-400">
              {file.duration ? `${file.duration}s` : 'Video'}
            </span>
          </div>
        ) : file.category === 'AUDIO' ? (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-tr from-emerald-500/10 to-teal-500/10 text-emerald-500 font-medium text-xs">
            <FiMusic className="w-10 h-10 mb-1 opacity-80" />
            <span className="text-[10px] uppercase font-semibold text-slate-400">Audio Track</span>
          </div>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-white/5 text-slate-400 font-medium text-xs">
            {getCategoryIcon(file.category)}
            <span className="text-[10px] uppercase font-semibold mt-1">{file.extension}</span>
          </div>
        )}
      </div>

      {/* File Info Footer */}
      <div>
        <div className="flex items-center space-x-1.5 mb-1">
          {getCategoryIcon(file.category)}
          <span className="font-semibold text-xs text-white truncate flex-1">
            {file.fileName}
          </span>
        </div>

        {file.caption && (
          <p className="text-[11px] text-slate-400 line-clamp-1 mb-1">
            {file.caption}
          </p>
        )}

        {/* Tags badges */}
        {tagsList.length > 0 && (
          <div className="flex items-center flex-wrap gap-1 mt-1 mb-1.5">
            {tagsList.slice(0, 3).map((tag, idx) => (
              <span
                key={idx}
                className="text-[9px] px-1.5 py-0.5 rounded bg-[#2481cc]/10 text-[#2481cc] font-medium"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1 border-t border-white/5 pt-1.5">
          <span>{formatSize(file.fileSize)}</span>
          <span>{new Date(file.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
}
