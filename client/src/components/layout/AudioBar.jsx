/**
 * Persistent Bottom Audio Player Bar (Responsive & Vector Icons Only)
 * Telegram-native audio player with playback speed, repeat, shuffle, and waveform
 */
import React from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Repeat,
  Shuffle,
  Volume2,
  VolumeX,
  Maximize2,
  X,
  Music
} from 'lucide-react';
import { useAudioPlayerStore } from '../../store/useAudioPlayerStore';

export default function AudioBar() {
  const {
    currentTrack,
    isPlaying,
    playbackRate,
    isRepeat,
    isShuffle,
    togglePlayPause,
    nextTrack,
    prevTrack,
    setPlaybackRate,
    toggleRepeat,
    toggleShuffle,
    setModalOpen,
    closePlayer
  } = useAudioPlayerStore();

  const audioRef = React.useRef(null);
  const [progress, setProgress] = React.useState(0);
  const [currentTime, setCurrentTime] = React.useState(0);
  const [duration, setDuration] = React.useState(0);
  const [isMuted, setIsMuted] = React.useState(false);

  React.useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(() => {});
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrack]);

  React.useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);

  if (!currentTrack) return null;

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    const current = audioRef.current.currentTime;
    const dur = audioRef.current.duration || currentTrack.duration || 180;
    setCurrentTime(current);
    setDuration(dur);
    setProgress((current / dur) * 100);
  };

  const handleSeek = (e) => {
    if (!audioRef.current) return;
    const newProgress = Number(e.target.value);
    const dur = audioRef.current.duration || currentTrack.duration || 180;
    const seekTime = (newProgress / 100) * dur;
    audioRef.current.currentTime = seekTime;
    setProgress(newProgress);
  };

  const cycleSpeed = () => {
    const speeds = [1.0, 1.25, 1.5, 2.0, 0.5];
    const nextIndex = (speeds.indexOf(playbackRate) + 1) % speeds.length;
    setPlaybackRate(speeds[nextIndex]);
  };

  const formatTime = (secs = 0) => {
    const min = Math.floor(secs / 60);
    const sec = Math.floor(secs % 60);
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  };

  const audioSrc = currentTrack.url || 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';

  return (
    <div className="fixed bottom-0 left-0 right-0 h-16 bg-telegram-light-card/95 dark:bg-telegram-dark-card/95 backdrop-blur-md border-t border-telegram-light-border dark:border-telegram-dark-border px-3 sm:px-6 flex items-center justify-between shadow-2xl z-40">
      <audio
        ref={audioRef}
        src={audioSrc}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => {
          if (isRepeat) {
            audioRef.current.currentTime = 0;
            audioRef.current.play();
          } else {
            nextTrack();
          }
        }}
      />

      {/* Left: Track Info */}
      <div className="flex items-center space-x-3 w-40 sm:w-64 truncate">
        <div className="w-10 h-10 rounded-lg bg-telegram-blue/20 text-telegram-blue flex items-center justify-center flex-shrink-0">
          <Music className="w-5 h-5" />
        </div>
        <div className="truncate">
          <div className="font-semibold text-xs sm:text-sm text-slate-800 dark:text-slate-100 truncate">
            {currentTrack.fileName || 'Audio Track'}
          </div>
          <div className="text-[10px] sm:text-xs text-slate-400 truncate">
            {currentTrack.caption || 'Telegram Cloud Music'}
          </div>
        </div>
      </div>

      {/* Center: Player Controls & Progress */}
      <div className="flex-1 max-w-xl mx-2 sm:mx-4 flex flex-col items-center">
        <div className="flex items-center space-x-2 sm:space-x-4 mb-1">
          <button
            onClick={toggleShuffle}
            className={`hidden sm:inline-block p-1.5 rounded-full transition-colors ${
              isShuffle ? 'text-telegram-blue bg-telegram-blue/10' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Shuffle className="w-4 h-4" />
          </button>
          <button onClick={prevTrack} className="text-slate-400 hover:text-white transition-colors">
            <SkipBack className="w-4 sm:w-5 h-4 sm:h-5" />
          </button>
          <button
            onClick={togglePlayPause}
            className="w-8 sm:w-9 h-8 sm:h-9 rounded-full bg-telegram-blue hover:bg-telegram-blue-hover text-white flex items-center justify-center shadow-md transition-transform active:scale-95"
          >
            {isPlaying ? <Pause className="w-4 sm:w-5 h-4 sm:h-5" /> : <Play className="w-4 sm:w-5 h-4 sm:h-5 ml-0.5" />}
          </button>
          <button onClick={nextTrack} className="text-slate-400 hover:text-white transition-colors">
            <SkipForward className="w-4 sm:w-5 h-4 sm:h-5" />
          </button>
          <button
            onClick={toggleRepeat}
            className={`hidden sm:inline-block p-1.5 rounded-full transition-colors ${
              isRepeat ? 'text-telegram-blue bg-telegram-blue/10' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Repeat className="w-4 h-4" />
          </button>
        </div>

        {/* Seek Bar */}
        <div className="w-full flex items-center space-x-2">
          <span className="text-[10px] text-slate-400 w-7 text-right">
            {formatTime(currentTime)}
          </span>
          <input
            type="range"
            min="0"
            max="100"
            value={progress}
            onChange={handleSeek}
            className="flex-1 h-1 bg-slate-300 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-telegram-blue"
          />
          <span className="text-[10px] text-slate-400 w-7">
            {formatTime(duration)}
          </span>
        </div>
      </div>

      {/* Right: Speed, Volume, Fullscreen & Close */}
      <div className="flex items-center space-x-1 sm:space-x-2">
        <button
          onClick={cycleSpeed}
          className="px-1.5 py-0.5 sm:px-2 sm:py-1 text-[10px] sm:text-xs font-semibold rounded bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-telegram-blue hover:text-white transition-colors"
        >
          {playbackRate}x
        </button>
        <button
          onClick={() => {
            setIsMuted(!isMuted);
            if (audioRef.current) audioRef.current.muted = !isMuted;
          }}
          className="hidden sm:inline-block p-1.5 text-slate-400 hover:text-slate-200"
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
        <button
          onClick={() => setModalOpen(true)}
          title="Open Playlist & Waveform Modal"
          className="p-1.5 text-slate-400 hover:text-telegram-blue"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
        <button onClick={closePlayer} className="p-1.5 text-slate-400 hover:text-red-500">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
