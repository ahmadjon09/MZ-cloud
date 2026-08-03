/**
 * Telegram Cloud Storage - Main Dashboard Page
 * Connects navigation state, file queries, views, and modal overlays
 */
import React from 'react';
import { useUIStore } from '../store/useUIStore';
import { useFilesList } from '../hooks/useFiles';
import FileGrid from '../components/media/FileGrid';
import AdminPage from './AdminPage';

import TelegramGalleryModal from '../components/media/TelegramGalleryModal';
import TelegramVideoModal from '../components/media/TelegramVideoModal';
import CodeDocumentModal from '../components/media/CodeDocumentModal';
import NoteEditorModal from '../components/modals/NoteEditorModal';
import TagEditorModal from '../components/modals/TagEditorModal';
import FolderModal from '../components/modals/FolderModal';
import ShareModal from '../components/modals/ShareModal';
import SearchModal from '../components/modals/SearchModal';

export default function DashboardPage() {
  const { activeNav, activeFolderId, sortBy, sortOrder } = useUIStore();

  const queryOptions = React.useMemo(() => {
    const opts = {
      sortBy,
      sortOrder,
      limit: 100,
      offset: 0
    };

    if (activeNav === 'PHOTO' || activeNav === 'VIDEO' || activeNav === 'DOCUMENT' || activeNav === 'AUDIO' || activeNav === 'VOICE' || activeNav === 'CODE') {
      opts.category = activeNav;
    } else if (activeNav === 'FAVORITE') {
      opts.isFavorite = true;
    } else if (activeNav === 'PINNED') {
      opts.isPinned = true;
    } else if (activeNav === 'TRASH') {
      opts.isDeleted = true;
    } else if (activeNav === 'FOLDERS' && activeFolderId) {
      opts.folderId = activeFolderId;
    }

    return opts;
  }, [activeNav, activeFolderId, sortBy, sortOrder]);

  const { data, isLoading } = useFilesList(queryOptions);
  const files = data?.files || [];
  const total = data?.total || 0;

  if (activeNav === 'ADMIN') {
    return <AdminPage />;
  }

  return (
    <div className="flex-1 flex flex-col bg-telegram-light dark:bg-telegram-dark transition-colors duration-200">
      <FileGrid
        files={files}
        total={total}
        isLoading={isLoading}
        activeCategory={activeNav}
        isTrash={activeNav === 'TRASH'}
      />

      {/* Media & Action Modal Viewers */}
      <TelegramGalleryModal files={files} />
      <TelegramVideoModal />
      <CodeDocumentModal />
      <NoteEditorModal />
      <TagEditorModal />
      <FolderModal />
      <ShareModal />
      <SearchModal />
    </div>
  );
}
