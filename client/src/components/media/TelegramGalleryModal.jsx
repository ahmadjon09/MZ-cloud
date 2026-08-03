/**
 * Telegram Gallery Modal Viewer (Images & Photos) - react-icons/fi
 * Directly renders real Telegram CDN image stream with automatic URL auth parameters
 */
import React from 'react';
import {
  FiX,
  FiZoomIn,
  FiZoomOut,
  FiMaximize2,
  FiMinimize2,
  FiChevronLeft,
  FiChevronRight,
  FiInfo,
  FiFileText,
  FiTag,
  FiStar,
  FiShare2,
  FiSend
} from 'react-icons/fi';
import { useUIStore } from '../../store/useUIStore';
import { useUpdateFile, useShareFile, useSendToTelegram } from '../../hooks/useFiles';
import { getFileThumbnailUrl } from '../../services/api';

export default function TelegramGalleryModal({ files = [] }) {
  const {
    activeImageModalFile,
    closeImageGallery,
    openImageGallery,
    openNoteEditor,
    openTagEditor,
    openShareModal
  } = useUIStore();
  const updateFile = useUpdateFile();
  const shareFile = useShareFile();
  const sendToTg = useSendToTelegram();

  const [zoom, setZoom] = React.useState(1);
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const [showExif, setShowExif] = React.useState(false);
  const [imgErr, setImgErr] = React.useState(false);

  const photoList = React.useMemo(() => {
    return files.filter((f) => f.category === 'PHOTO');
  }, [files]);

  const currentIndex = React.useMemo(() => {
    if (!activeImageModalFile) return -1;
    return photoList.findIndex((f) => f.id === activeImageModalFile.id);
  }, [activeImageModalFile, photoList]);

  React.useEffect(() => {
    setImgErr(false);
    const handleKeyDown = (e) => {
      if (!activeImageModalFile) return;
      if (e.key === 'Escape') {
        closeImageGallery();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeImageModalFile, currentIndex, photoList]);

  if (!activeImageModalFile) return null;

  const handleNext = () => {
    if (photoList.length === 0) return;
    const nextIdx = (currentIndex + 1) % photoList.length;
    openImageGallery(photoList[nextIdx]);
    setZoom(1);
  };

  const handlePrev = () => {
    if (photoList.length === 0) return;
    const prevIdx = (currentIndex - 1 + photoList.length) % photoList.length;
    openImageGallery(photoList[prevIdx]);
    setZoom(1);
  };

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.5, 3));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.5, 0.5));

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const handleToggleFav = () => {
    updateFile.mutate({
      id: activeImageModalFile.id,
      data: { isFavorite: !activeImageModalFile.isFavorite }
    });
  };

  const handleShare = async () => {
    const res = await shareFile.mutateAsync(activeImageModalFile.id);
    if (res.data) {
      openShareModal(res.data);
    }
  };

  // Uses getFileThumbnailUrl to include query parameter authentication (?token=...&tgId=...)
  const photoUrl =
    activeImageModalFile.thumbnailUrl ||
    getFileThumbnailUrl(activeImageModalFile.id);

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col justify-between animate-in fade-in duration-200 font-sans">
      {/* Top Bar Controls */}
      <div className="h-16 px-6 flex items-center justify-between text-white bg-gradient-to-b from-black/60 to-transparent z-10">
        <div className="flex items-center space-x-3 truncate">
          <span className="font-semibold text-sm truncate max-w-md">
            {activeImageModalFile.fileName}
          </span>
          {currentIndex >= 0 && (
            <span className="text-xs text-slate-400">
              ({currentIndex + 1} of {photoList.length || 1})
            </span>
          )}
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={handleZoomOut}
            title="Zoom Out"
            className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-full transition-colors"
          >
            <FiZoomOut className="w-5 h-5" />
          </button>
          <span className="text-xs font-semibold w-8 text-center">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={handleZoomIn}
            title="Zoom In"
            className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-full transition-colors"
          >
            <FiZoomIn className="w-5 h-5" />
          </button>
          <button
            onClick={handleToggleFullscreen}
            title="Toggle Fullscreen"
            className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-full transition-colors"
          >
            {isFullscreen ? <FiMinimize2 className="w-5 h-5" /> : <FiMaximize2 className="w-5 h-5" />}
          </button>
          <button
            onClick={() => setShowExif(!showExif)}
            title="Toggle EXIF Details"
            className={`p-2 rounded-full transition-colors ${
              showExif ? 'text-[#2481cc] bg-white/20' : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <FiInfo className="w-5 h-5" />
          </button>
          <button
            onClick={closeImageGallery}
            className="p-2 text-slate-300 hover:text-red-500 hover:bg-white/10 rounded-full transition-colors ml-2"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Main Image Viewport with Zoom and Arrows */}
      <div className="relative flex-1 flex items-center justify-center overflow-hidden select-none">
        {photoList.length > 1 && (
          <button
            onClick={handlePrev}
            className="absolute left-4 z-20 p-3 bg-black/40 hover:bg-black/70 text-white rounded-full transition-colors shadow-lg"
          >
            <FiChevronLeft className="w-6 h-6" />
          </button>
        )}

        <div className="overflow-auto max-h-full max-w-full flex items-center justify-center p-8">
          {!imgErr ? (
            <img
              src={photoUrl}
              alt={activeImageModalFile.fileName}
              style={{ transform: `scale(${zoom})`, transition: 'transform 0.2s ease-out' }}
              className="max-h-[80vh] max-w-[85vw] object-contain rounded-lg shadow-2xl"
              onError={() => setImgErr(true)}
            />
          ) : (
            <div className="flex flex-col items-center justify-center p-12 bg-[#1e2329] rounded-2xl border border-white/10 text-center max-w-md">
              <div className="w-16 h-16 rounded-full bg-[#2481cc]/20 text-[#2481cc] flex items-center justify-center mb-4 text-2xl font-bold">
                IMG
              </div>
              <h4 className="text-white font-semibold text-sm mb-1">{activeImageModalFile.fileName}</h4>
              <p className="text-xs text-slate-400 mb-4">
                Ushbu rasm Telegram CDN da saqlanmoqda. Ko'rish yoki yuklab olish uchun quyidagi tugmani bosing:
              </p>
              <button
                onClick={() => sendToTg.mutate(activeImageModalFile.id)}
                className="px-5 py-2.5 bg-[#2481cc] hover:bg-[#2f88d2] text-white text-xs font-semibold rounded-xl shadow-md transition-all flex items-center space-x-2"
              >
                <FiSend className="w-4 h-4" />
                <span>Telegram chatingizga yuborish</span>
              </button>
            </div>
          )}
        </div>

        {photoList.length > 1 && (
          <button
            onClick={handleNext}
            className="absolute right-4 z-20 p-3 bg-black/40 hover:bg-black/70 text-white rounded-full transition-colors shadow-lg"
          >
            <FiChevronRight className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* EXIF Information Drawer */}
      {showExif && (
        <div className="absolute top-16 right-6 w-80 bg-[#1e2329]/95 border border-white/10 rounded-2xl p-5 shadow-2xl text-xs text-slate-200 z-30 animate-in slide-in-from-right duration-200">
          <h4 className="font-bold text-sm text-[#2481cc] mb-3 flex items-center space-x-1.5">
            <FiInfo className="w-4 h-4" />
            <span>EXIF & Photo Metadata</span>
          </h4>
          <div className="space-y-2 text-slate-300">
            <div className="flex justify-between">
              <span className="text-slate-400">Resolution:</span>
              <span className="font-semibold">{activeImageModalFile.width || 3840} x {activeImageModalFile.height || 2160}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">File Size:</span>
              <span className="font-semibold">{(activeImageModalFile.fileSize / 1024 / 1024).toFixed(2)} MB</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Format:</span>
              <span className="font-semibold uppercase">{activeImageModalFile.extension}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Added Date:</span>
              <span className="font-semibold">{new Date(activeImageModalFile.createdAt).toLocaleDateString()}</span>
            </div>
            {activeImageModalFile.caption && (
              <div className="pt-2 border-t border-white/10 mt-2">
                <span className="text-slate-400 block mb-1">Telegram Caption:</span>
                <p className="text-slate-200 italic">{activeImageModalFile.caption}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Bottom Actions Toolbar: Send to Telegram, Favorite, Note, Tag, Share */}
      <div className="h-16 px-6 flex items-center justify-center space-x-4 text-white bg-gradient-to-t from-black/60 to-transparent z-10">
        <button
          onClick={() => sendToTg.mutate(activeImageModalFile.id)}
          disabled={sendToTg.isPending}
          className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-[#2481cc] hover:bg-[#2f88d2] text-white transition-colors shadow-md disabled:opacity-50"
        >
          <FiSend className="w-4 h-4" />
          <span>{sendToTg.isPending ? 'Yuborilmoqda...' : 'Telegramga Yuborish'}</span>
        </button>

        <button
          onClick={handleToggleFav}
          className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
            activeImageModalFile.isFavorite
              ? 'bg-amber-500 text-white'
              : 'bg-white/10 hover:bg-white/20 text-slate-200'
          }`}
        >
          <FiStar className="w-4 h-4" />
          <span>{activeImageModalFile.isFavorite ? 'Favorited' : 'Favorite'}</span>
        </button>

        <button
          onClick={() => openNoteEditor(activeImageModalFile)}
          className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 text-slate-200 transition-colors"
        >
          <FiFileText className="w-4 h-4" />
          <span>Notes</span>
        </button>

        <button
          onClick={() => openTagEditor(activeImageModalFile)}
          className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 text-slate-200 transition-colors"
        >
          <FiTag className="w-4 h-4" />
          <span>Tags</span>
        </button>

        <button
          onClick={handleShare}
          className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 text-slate-200 transition-colors"
        >
          <FiShare2 className="w-4 h-4" />
          <span>Share Link</span>
        </button>
      </div>
    </div>
  );
}
