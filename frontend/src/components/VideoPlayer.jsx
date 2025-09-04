import React, { forwardRef, useEffect, useState } from 'react';

const VideoPlayer = forwardRef(({ videoId, onFrameChange, isPlaying, setIsPlaying }, ref) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const videoUrl = `http://localhost:8000/api/video/${videoId}/file`;
  
  useEffect(() => {
    if (ref.current) {
      const video = ref.current;
      
      const handleTimeUpdate = () => {
        const frame = Math.floor(video.currentTime * 30) + 1;
        onFrameChange(frame);
        setCurrentTime(video.currentTime);
      };
      
      const handleLoadedMetadata = () => {
        setDuration(video.duration);
      };
      
      video.addEventListener('timeupdate', handleTimeUpdate);
      video.addEventListener('loadedmetadata', handleLoadedMetadata);
      
      return () => {
        video.removeEventListener('timeupdate', handleTimeUpdate);
        video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      };
    }
  }, [ref, onFrameChange]);
  
  const handlePlayPause = () => {
    if (ref.current) {
      if (isPlaying) {
        ref.current.pause();
      } else {
        ref.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };
  
  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    const newTime = percentage * duration;
    
    if (ref.current) {
      ref.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };
  
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };
  
  return (
    <div className="relative">
      <video
        ref={ref}
        src={videoUrl}
        className="w-full rounded"
        crossOrigin="anonymous"
      />
      
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={handlePlayPause}
            className="text-white hover:text-blue-400 transition"
          >
            {isPlaying ? (
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" />
              </svg>
            ) : (
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
              </svg>
            )}
          </button>
          
          <div className="flex-1">
            <div
              className="bg-white/30 rounded-full h-2 cursor-pointer relative"
              onClick={handleSeek}
            >
              <div
                className="bg-blue-500 h-full rounded-full"
                style={{ width: `${(currentTime / duration) * 100}%` }}
              />
              <div
                className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow"
                style={{ left: `${(currentTime / duration) * 100}%`, marginLeft: '-8px' }}
              />
            </div>
          </div>
          
          <span className="text-white text-sm">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
        </div>
      </div>
    </div>
  );
});

VideoPlayer.displayName = 'VideoPlayer';

export default VideoPlayer;