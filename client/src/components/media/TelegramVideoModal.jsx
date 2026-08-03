/**
 * Telegram Video Player Modal (MZ-CLOUD - react-icons/fi)
 * Supports Playback Speed (0.5x to 2x), Picture-in-Picture, position memory, and keyboard controls
 * Includes "Send to my Telegram" button
 */
import React from 'react';
import {
  FiX,
  FiPlay,
  FiPause,
  FiMaximize2,
  FiVolume2,
  FiVolumeX,
  FiRotateCcw,
  FiRotateCw,
  FiSend
} from 'react-icons/fi';
import { useUIStore } from '../../store/useUIStore';
import { useSendToTelegram } from '../../hooks/useFiles';

export default function TelegramVideoModal() {
  const { activeVideoModalFile, closeVideoPlayer } = useUIStore();
  const sendToTg = useSendToTelegram();
  const videoRef = React.useRef(null);

  const [isPlaying, setIsPlaying] = React.useState(true);
  const [playbackRate, setPlaybackRate] = React.useState(1.0);
  const [progress, setProgress] = React.useState(0);
  const [currentTime, setCurrentTime] = React.useState(0);
  const [duration, setDuration] = React.useState(0);
  const [isMuted, setIsMuted] = React.useState(false);

  React.useEffect(() => {
    if (videoRef.current && activeVideoModalFile) {
      const savedTime = localStorage.getItem(`tgcloud_video_pos_${activeVideoModalFile.id}`);
      if (savedTime && !isNaN(savedTime)) {
        videoRef.current.currentTime = parseFloat(savedTime);
      }
    }
  }, [activeVideoModalFile]);

  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (!activeVideoModalFile || !videoRef.current) return;
      if (e.key === 'Escape') {
        closeVideoPlayer();
      } else if (e.code === 'Space') {
        e.preventDefault();
        togglePlayPause();
      } else if (e.key === 'ArrowRight') {
        videoRef.current.currentTime = Math.min(videoRef.current.duration, videoRef.current.currentTime + 5);
      } else if (e.key === 'ArrowLeft') {
        videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - 5);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeVideoModalFile, isPlaying]);

  if (!activeVideoModalFile) return null;

  const togglePlayPause = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const current = videoRef.current.currentTime;
    const dur = videoRef.current.duration || activeVideoModalFile.duration || 120;
    setCurrentTime(current);
    setDuration(dur);
    setProgress((current / dur) * 100);

    localStorage.setItem(`tgcloud_video_pos_${activeVideoModalFile.id}`, current.toString());
  };

  const handleSeek = (e) => {
    if (!videoRef.current) return;
    const newProg = Number(e.target.value);
    const dur = videoRef.current.duration || activeVideoModalFile.duration || 120;
    const seekTime = (newProg / 100) * dur;
    videoRef.current.currentTime = seekTime;
    setProgress(newProg);
  };

  const cycleSpeed = () => {
    const speeds = [1.0, 1.25, 1.5, 2.0, 0.5];
    const nextIndex = (speeds.indexOf(playbackRate) + 1) % speeds.length;
    const newSpeed = speeds[nextIndex];
    setPlaybackRate(newSpeed);
    if (videoRef.current) {
      videoRef.current.playbackRate = newSpeed;
    }
  };

  const handlePiP = async () => {
    try {
      if (videoRef.current && document.pictureInPictureElement !== videoRef.current) {
        await videoRef.current.requestPictureInPicture();
      } else if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      }
    } catch (e) {
      // ignore
    }
  };

  const formatTime = (secs = 0) => {
    const min = Math.floor(secs / 60);
    const sec = Math.floor(secs % 60);
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  };

  const sampleVideoUrl =
    activeVideoModalFile.thumbnailUrl ||
    `/api/v1/files/${activeVideoModalFile.id}/stream`;

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between animate-in fade-in duration-200 font-sans">
      {/* Top Header */}
      <div className="h-16 px-6 flex items-center justify-between text-white bg-gradient-to-b from-black/70 to-transparent z-10">
        <div className="truncate">
          <h3 className="font-semibold text-sm truncate max-w-md">
            {activeVideoModalFile.fileName}
          </h3>
          <span className="text-xs text-slate-400">
            MZ-CLOUD Telegram CDN Player — Position Auto-Remembered
          </span>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => sendToTg.mutate(activeVideoModalFile.id)}
            disabled={sendToTg.isPending}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#2481cc] hover:bg-[#2f88d2] text-white transition-colors shadow-md disabled:opacity-50"
          >
            <FiSend className="w-4 h-4" />
            <span>{sendToTg.isPending ? 'Yuborilmoqda...' : 'Telegramga Yuborish'}</span>
          </button>
          <button
            onClick={closeVideoPlayer}
            className="p-2 text-slate-300 hover:text-red-500 hover:bg-white/10 rounded-full transition-colors"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Main Video Viewport */}
      <div className="relative flex-1 flex items-center justify-center overflow-hidden p-4">
        <video
          ref={videoRef}
          src={sampleVideoUrl}
          autoPlay
          onTimeUpdate={handleTimeUpdate}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onClick={togglePlayPause}
          className="max-h-[75vh] max-w-[90vw] rounded-xl shadow-2xl cursor-pointer"
        />
      </div>

      {/* Bottom Control Bar */}
      <div className="h-20 px-8 flex flex-col justify-center text-white bg-gradient-to-t from-black/80 to-transparent z-10 space-y-2">
        {/* Seek Bar */}
        <div className="w-full flex items-center space-x-3">
          <span className="text-xs text-slate-400 w-10 text-right">
            {formatTime(currentTime)}
          </span>
          <input
            type="range"
            min="0"
            max="100"
            value={progress}
            onChange={handleSeek}
            className="flex-1 h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#2481cc]"
          />
          <span className="text-xs text-slate-400 w-10">
            {formatTime(duration)}
          </span>
        </div>

        {/* Buttons: Play, Speed, PiP, Mute */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={togglePlayPause}
              className="p-2 rounded-full bg-[#2481cc] hover:bg-[#2f88d2] text-white transition-transform active:scale-95"
            >
              {isPlaying ? <FiPause className="w-5 h-5" /> : <FiPlay className="w-5 h-5 ml-0.5" />}
            </button>

            <button
              onClick={() => {
                if (videoRef.current) {
                  videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - 10);
                }
              }}
              className="text-slate-400 hover:text-white"
              title="-10 seconds"
            >
              <FiRotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                if (videoRef.current) {
                  videoRef.current.currentTime = Math.min(videoRef.current.duration, videoRef.current.currentTime + 10);
                }
              }}
              className="text-slate-400 hover:text-white"
              title="+10 seconds"
            >
              <FiRotateCw className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={cycleSpeed}
              className="px-2.5 py-1 text-xs font-semibold rounded bg-slate-800 text-slate-300 hover:bg-[#2481cc] hover:text-white transition-colors"
            >
              {playbackRate}x
            </button>

            <button
              onClick={handlePiP}
              title="Picture-in-Picture"
              className="p-2 text-slate-400 hover:text-white transition-colors"
            >
              <FiMaximize2 className="w-5 h-5" />
            </button>

            <button
              onClick={() => {
                setIsMuted(!isMuted);
                if (videoRef.current) videoRef.current.muted = !isMuted;
              }}
              className="p-2 text-slate-400 hover:text-white transition-colors"
            >
              {isMuted ? <FiVolumeX className="w-5 h-5" /> : <FiVolume2 className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
