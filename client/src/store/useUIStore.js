/**
 * UI State Store (Zustand)
 * Controls navigation tabs, view modes, and modal visibility
 */
import { create } from 'zustand';

export const useUIStore = create((set) => ({
  isSidebarCollapsed: false,
  isMobileSidebarOpen: false,
  activeNav: 'ALL',       // ALL, PHOTO, VIDEO, DOCUMENT, AUDIO, VOICE, CODE, FAVORITE, PINNED, RECENT, TRASH, FOLDERS, ADMIN
  activeFolderId: null,   // null = all folders, 'ROOT' = root items, or specific UUID
  viewMode: 'grid',       // 'grid' | 'masonry' | 'list'
  sortBy: 'createdAt',    // 'createdAt' | 'fileName' | 'fileSize'
  sortOrder: 'desc',      // 'desc' | 'asc'

  // Modal control states
  searchModalOpen: false,
  activeImageModalFile: null,
  activeVideoModalFile: null,
  activeNoteModalFile: null,
  activeTagModalFile: null,
  activeFolderModalFolder: null, // null for new, folder obj for edit
  activeShareModalFile: null,
  isFolderModalOpen: false,

  setSidebarCollapsed: (val) => set({ isSidebarCollapsed: val }),
  setMobileSidebarOpen: (val) => set({ isMobileSidebarOpen: val }),
  toggleMobileSidebar: () => set((state) => ({ isMobileSidebarOpen: !state.isMobileSidebarOpen })),
  setActiveNav: (nav) => set({ activeNav: nav, activeFolderId: null, isMobileSidebarOpen: false }),
  setActiveFolderId: (id) => set({ activeNav: 'FOLDERS', activeFolderId: id, isMobileSidebarOpen: false }),
  setViewMode: (mode) => set({ viewMode: mode }),
  setSorting: (sortBy, sortOrder) => set({ sortBy, sortOrder }),

  // Modal actions
  setSearchModalOpen: (val) => set({ searchModalOpen: val }),
  openImageGallery: (file) => set({ activeImageModalFile: file }),
  closeImageGallery: () => set({ activeImageModalFile: null }),
  openVideoPlayer: (file) => set({ activeVideoModalFile: file }),
  closeVideoPlayer: () => set({ activeVideoModalFile: null }),
  openNoteEditor: (file) => set({ activeNoteModalFile: file }),
  closeNoteEditor: () => set({ activeNoteModalFile: null }),
  openTagEditor: (file) => set({ activeTagModalFile: file }),
  closeTagEditor: () => set({ activeTagModalFile: null }),
  openFolderModal: (folder = null) => set({ isFolderModalOpen: true, activeFolderModalFolder: folder }),
  closeFolderModal: () => set({ isFolderModalOpen: false, activeFolderModalFolder: null }),
  openShareModal: (file) => set({ activeShareModalFile: file }),
  closeShareModal: () => set({ activeShareModalFile: null })
}));
