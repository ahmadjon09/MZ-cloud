/**
 * Audio Player Store (Zustand)
 * Manages persistent bottom bar audio player, queue, repeat, shuffle, and waveform
 */
import { create } from 'zustand';

export const useAudioPlayerStore = create((set, get) => ({
  currentTrack: null,
  playlist: [],
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  volume: 1.0,
  playbackRate: 1.0,
  isRepeat: false,
  isShuffle: false,
  isModalOpen: false,

  playTrack: (track, newPlaylist = []) => {
    set({
      currentTrack: track,
      playlist: newPlaylist.length > 0 ? newPlaylist : [track],
      isPlaying: true
    });
  },

  togglePlayPause: () => {
    set((state) => ({ isPlaying: !state.isPlaying }));
  },

  nextTrack: () => {
    const { currentTrack, playlist, isShuffle } = get();
    if (!currentTrack || playlist.length === 0) return;

    let nextIndex = playlist.findIndex((t) => t.id === currentTrack.id) + 1;
    if (isShuffle) {
      nextIndex = Math.floor(Math.random() * playlist.length);
    } else if (nextIndex >= playlist.length) {
      nextIndex = 0;
    }

    set({
      currentTrack: playlist[nextIndex],
      isPlaying: true,
      currentTime: 0
    });
  },

  prevTrack: () => {
    const { currentTrack, playlist } = get();
    if (!currentTrack || playlist.length === 0) return;

    let prevIndex = playlist.findIndex((t) => t.id === currentTrack.id) - 1;
    if (prevIndex < 0) prevIndex = playlist.length - 1;

    set({
      currentTrack: playlist[prevIndex],
      isPlaying: true,
      currentTime: 0
    });
  },

  setPlaybackRate: (rate) => set({ playbackRate: rate }),
  toggleRepeat: () => set((state) => ({ isRepeat: !state.isRepeat })),
  toggleShuffle: () => set((state) => ({ isShuffle: !state.isShuffle })),
  setModalOpen: (val) => set({ isModalOpen: val }),
  closePlayer: () => set({ currentTrack: null, isPlaying: false, isModalOpen: false })
}));
