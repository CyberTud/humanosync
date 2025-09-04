import React, { useRef, useEffect, useState } from 'react';

const VideoViewer = ({ videoId, currentFrame, onFrameChange }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  
  const videoUrl = `http://localhost:8000/uploads/${videoId}.mp4`;
  const fps = 30; // Assuming 30 fps

  useEffect(() => {
    if (videoRef.current) {
      const targetTime = (currentFrame - 1) / fps;
      if (Math.abs(videoRef.current.currentTime - targetTime) > 0.1) {
        videoRef.current.currentTime = targetTime;
      }
    }
  }, [currentFrame, fps]);

  const handleTimeUpdate = () => {
    if (videoRef.current && !isPlaying) {
      const frame = Math.floor(videoRef.current.currentTime * fps) + 1;
      if (frame !== currentFrame) {
        onFrameChange(frame);
      }
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="relative bg-black rounded-lg overflow-hidden">
      <video
        ref={videoRef}
        src={videoUrl}
        className="w-full h-auto"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
      
      {/* Play/Pause Overlay */}
      <button
        onClick={togglePlayPause}
        className="absolute bottom-4 left-4 bg-white/80 hover:bg-white rounded-full p-3 transition-all"
      >
        {isPlaying ? (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
          </svg>
        )}
      </button>
    </div>
  );
};

export default VideoViewer;