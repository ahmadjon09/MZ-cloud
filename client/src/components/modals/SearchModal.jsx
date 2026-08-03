/**
 * Global Spotlight Search Modal (Cmd + K) - react-icons/fi
 * Instant full-text search across files, folders, extensions, captions, notes, and tags
 * 100% Mobile Responsive
 */
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  FiSearch,
  FiX,
  FiFolder,
  FiFile,
  FiImage,
  FiVideo,
  FiFileText,
  FiMusic,
  FiCode,
  FiArrowRight,
  FiCheckCircle
} from 'react-icons/fi';
import { useUIStore } from '../../store/useUIStore';
import { useGlobalSearch } from '../../hooks/useSearch';
import { useAudioPlayerStore } from '../../store/useAudioPlayerStore';

export default function SearchModal() {
  const { t } = useTranslation();
  const {
    searchModalOpen,
    setSearchModalOpen,
    setActiveFolderId,
    openImageGallery,
    openVideoPlayer,
    openNoteEditor
  } = useUIStore();
  const { playTrack } = useAudioPlayerStore();

  const [query, setQuery] = React.useState('');
  const [categoryFilter, setCategoryFilter] = React.useState('ALL');

  const { data: searchResults, isLoading } = useGlobalSearch(query, {
    category: categoryFilter
  });

  const files = searchResults?.files || [];
  const folders = searchResults?.folders || [];
  const totalCount = (files.length || 0) + (folders.length || 0);

  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchModalOpen(true);
      } else if (e.key === 'Escape' && searchModalOpen) {
        setSearchModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [searchModalOpen]);

  if (!searchModalOpen) return null;

  const handleSelectItem = (item, type) => {
    setSearchModalOpen(false);
    if (type === 'folder') {
      setActiveFolderId(item.id);
    } else {
      if (item.category === 'PHOTO') {
        openImageGallery(item);
      } else if (item.category === 'VIDEO') {
        openVideoPlayer(item);
      } else if (item.category === 'AUDIO' || item.category === 'VOICE') {
        playTrack(item, files);
      } else {
        openNoteEditor(item);
      }
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'PHOTO': return <FiImage className="w-4 h-4 text-[#2481cc]" />;
      case 'VIDEO': return <FiVideo className="w-4 h-4 text-red-500" />;
      case 'AUDIO': return <FiMusic className="w-4 h-4 text-emerald-500" />;
      case 'DOCUMENT': return <FiFileText className="w-4 h-4 text-blue-500" />;
      case 'CODE': return <FiCode className="w-4 h-4 text-purple-500" />;
      default: return <FiFile className="w-4 h-4 text-slate-400" />;
    }
  };

  const categories = [
    { id: 'ALL', label: 'All' },
    { id: 'PHOTO', label: 'Photos' },
    { id: 'VIDEO', label: 'Videos' },
    { id: 'DOCUMENT', label: 'Docs' },
    { id: 'AUDIO', label: 'Music' },
    { id: 'CODE', label: 'Code' }
  ];

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-start justify-center pt-6 sm:pt-20 px-2 sm:px-4 animate-in fade-in duration-150 font-sans"
      onClick={() => setSearchModalOpen(false)}
    >
      <div
        className="w-full max-w-lg sm:max-w-2xl bg-[#1e2329] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] sm:max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Box */}
        <div className="p-3 sm:p-4 border-b border-white/10 flex items-center space-x-3">
          <FiSearch className="w-5 h-5 text-[#2481cc] flex-shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Search files, folders, extensions, tags..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-white placeholder-slate-400 font-medium text-xs sm:text-sm focus:outline-none"
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-slate-400 hover:text-slate-200">
              <FiX className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category Filters Bar */}
        <div className="px-3 py-2 bg-[#17212b]/80 border-b border-white/10 flex items-center space-x-1.5 sm:space-x-2 overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategoryFilter(cat.id)}
              className={`px-2.5 sm:px-3 py-1 text-[11px] sm:text-xs font-semibold rounded-full transition-colors whitespace-nowrap ${
                categoryFilter === cat.id
                  ? 'bg-[#2481cc] text-white'
                  : 'text-slate-300 hover:bg-white/5'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Results Body */}
        <div className="flex-1 overflow-y-auto divide-y divide-white/5">
          {/* Empty / Initial guidance */}
          {query.trim() === '' && (
            <div className="p-6 sm:p-8 text-center text-slate-400 text-xs">
              <div className="flex items-center justify-center space-x-1.5 mb-2 text-[#2481cc] font-semibold">
                <FiCheckCircle className="w-4 h-4" />
                <span>Powered by PostgreSQL Full-Text Search + Redis Cache</span>
              </div>
              <p>Type any keyword, file extension (.pdf, .jpg), tag, or note content.</p>
            </div>
          )}

          {/* Loading */}
          {isLoading && query.trim() !== '' && (
            <div className="p-6 sm:p-8 text-center text-slate-400 text-xs">
              Searching MZ-CLOUD index...
            </div>
          )}

          {/* No results */}
          {!isLoading && query.trim() !== '' && totalCount === 0 && (
            <div className="p-6 sm:p-8 text-center text-slate-400 text-xs">
              No files or folders matched <span className="font-semibold text-slate-200">"{query}"</span>
            </div>
          )}

          {/* Matched Folders */}
          {folders.length > 0 && (
            <div className="p-2">
              <div className="px-3 py-1 text-[10px] uppercase font-bold text-slate-400">
                Folders ({folders.length})
              </div>
              {folders.map((folder) => (
                <button
                  key={folder.id}
                  onClick={() => handleSelectItem(folder, 'folder')}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-white/5 transition-colors text-left group"
                >
                  <div className="flex items-center space-x-2.5">
                    <FiFolder className="w-5 h-5 text-[#2481cc]" />
                    <div>
                      <div className="font-semibold text-xs text-white">
                        {folder.name}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {folder._count?.files || 0} files inside
                      </div>
                    </div>
                  </div>
                  <FiArrowRight className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </div>
          )}

          {/* Matched Files */}
          {files.length > 0 && (
            <div className="p-2">
              <div className="px-3 py-1 text-[10px] uppercase font-bold text-slate-400">
                Saved Messages ({files.length})
              </div>
              {files.map((file) => (
                <button
                  key={file.id}
                  onClick={() => handleSelectItem(file, 'file')}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-white/5 transition-colors text-left group"
                >
                  <div className="flex items-center space-x-3 truncate">
                    {getCategoryIcon(file.category)}
                    <div className="truncate">
                      <div className="font-semibold text-xs text-white truncate">
                        {file.fileName}
                      </div>
                      <div className="text-[10px] text-slate-400 flex items-center space-x-2">
                        <span>{file.category}</span>
                        <span>•</span>
                        <span>{new Date(file.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <FiArrowRight className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
