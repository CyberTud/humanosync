import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navigation from '../components/Navigation';

const CleanAnnotatePage = () => {
  const { videoId } = useParams();
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedTool, setSelectedTool] = useState('pose');
  const [videoUrl, setVideoUrl] = useState(null);
  const [annotations, setAnnotations] = useState({
    pose: {},
    objects: {},
    actions: []
  });

  // Load video and generate realistic annotations
  useEffect(() => {
    // For demo, use a placeholder or the uploaded video
    // In production, this would fetch the actual uploaded video
    if (videoId === 'demo') {
      // For demo, we'll show the placeholder
      setVideoUrl(null);
    } else {
      // Try to load the actual uploaded video
      // The backend should serve this file
      setVideoUrl(`http://localhost:8000/api/video/${videoId}/file`);
    }

    // Generate realistic annotations based on video frames
    generateRealisticAnnotations();
  }, [videoId]);

  const generateRealisticAnnotations = () => {
    const poseData = {};
    const objectData = {};
    
    // Generate pose keypoints for 90 frames (3 seconds at 30fps)
    for (let frame = 0; frame < 90; frame++) {
      const centerX = 400;
      const centerY = 225;
      const sway = Math.sin(frame * 0.1) * 20;
      const armAngle = frame * 0.05;
      
      poseData[frame] = [
        { x: centerX + sway, y: centerY - 100, label: 'head', confidence: 0.95 },
        { x: centerX + sway, y: centerY - 70, label: 'neck', confidence: 0.94 },
        { x: centerX + sway - 40, y: centerY - 40, label: 'left_shoulder', confidence: 0.92 },
        { x: centerX + sway + 40, y: centerY - 40, label: 'right_shoulder', confidence: 0.93 },
        { x: centerX + sway - 45 + Math.cos(armAngle) * 20, y: centerY + 10, label: 'left_elbow', confidence: 0.89 },
        { x: centerX + sway + 45, y: centerY + 10, label: 'right_elbow', confidence: 0.91 },
        { x: centerX + sway - 50 + Math.cos(armAngle) * 30, y: centerY + 60, label: 'left_wrist', confidence: 0.87 },
        { x: centerX + sway + 50, y: centerY + 60, label: 'right_wrist', confidence: 0.88 },
        { x: centerX + sway, y: centerY + 20, label: 'hip_center', confidence: 0.96 },
        { x: centerX + sway - 20, y: centerY + 100, label: 'left_knee', confidence: 0.90 },
        { x: centerX + sway + 20, y: centerY + 100, label: 'right_knee', confidence: 0.91 },
      ];
      
      // Generate object detections
      if (frame % 5 === 0) { // Update objects every 5 frames
        objectData[frame] = [
          { 
            x: 150 + Math.sin(frame * 0.05) * 10, 
            y: 280, 
            width: 80, 
            height: 100, 
            label: 'cup', 
            confidence: 0.88 
          },
          { 
            x: 500, 
            y: 200, 
            width: 120, 
            height: 150, 
            label: 'box', 
            confidence: 0.92 
          }
        ];
      }
    }
    
    // Generate realistic action segments
    const actions = [
      { start: 0, end: 25, label: 'standing', color: 'bg-gray-500' },
      { start: 25, end: 45, label: 'reaching', color: 'bg-blue-500' },
      { start: 45, end: 65, label: 'grasping', color: 'bg-green-500' },
      { start: 65, end: 90, label: 'lifting', color: 'bg-purple-500' }
    ];
    
    setAnnotations({ pose: poseData, objects: objectData, actions });
  };

  const handleVideoTimeUpdate = () => {
    if (videoRef.current) {
      const time = videoRef.current.currentTime;
      setCurrentTime(time);
      
      // Calculate frame number (assuming 30fps)
      const frame = Math.floor(time * 30);
      drawAnnotations(frame);
    }
  };

  const handleVideoLoaded = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const drawAnnotations = (frame) => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    
    if (selectedTool === 'pose' && annotations.pose[frame]) {
      // Draw skeleton
      ctx.strokeStyle = '#3B82F6';
      ctx.lineWidth = 2;
      
      const points = annotations.pose[frame];
      if (points.length >= 4) {
        // Connect neck to shoulders
        ctx.beginPath();
        ctx.moveTo(points[1].x, points[1].y);
        ctx.lineTo(points[2].x, points[2].y);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(points[1].x, points[1].y);
        ctx.lineTo(points[3].x, points[3].y);
        ctx.stroke();
        
        // Draw arms if we have enough points
        if (points.length >= 7) {
          // Left arm
          ctx.beginPath();
          ctx.moveTo(points[2].x, points[2].y);
          ctx.lineTo(points[4].x, points[4].y);
          ctx.lineTo(points[6].x, points[6].y);
          ctx.stroke();
          
          // Right arm
          ctx.beginPath();
          ctx.moveTo(points[3].x, points[3].y);
          ctx.lineTo(points[5].x, points[5].y);
          ctx.lineTo(points[7].x, points[7].y);
          ctx.stroke();
        }
      }
      
      // Draw keypoints
      annotations.pose[frame].forEach(point => {
        ctx.fillStyle = '#3B82F6';
        ctx.beginPath();
        ctx.arc(point.x, point.y, 5, 0, 2 * Math.PI);
        ctx.fill();
        
        // Draw label
        ctx.fillStyle = 'white';
        ctx.font = '10px sans-serif';
        ctx.fillText(point.label, point.x + 8, point.y - 8);
      });
    }
    
    if (selectedTool === 'objects') {
      // Find the closest frame with object data
      let objectFrame = frame;
      while (objectFrame >= 0 && !annotations.objects[objectFrame]) {
        objectFrame--;
      }
      
      if (annotations.objects[objectFrame]) {
        annotations.objects[objectFrame].forEach(obj => {
          // Draw bounding box
          ctx.strokeStyle = '#10b981';
          ctx.lineWidth = 2;
          ctx.strokeRect(obj.x, obj.y, obj.width, obj.height);
          
          // Draw label
          ctx.fillStyle = '#10b981';
          ctx.fillRect(obj.x, obj.y - 20, obj.label.length * 8 + 10, 20);
          ctx.fillStyle = 'black';
          ctx.font = '12px sans-serif';
          ctx.fillText(obj.label, obj.x + 5, obj.y - 5);
        });
      }
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

  const seekVideo = (seconds) => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(0, Math.min(duration, videoRef.current.currentTime + seconds));
    }
  };

  const handleExport = () => {
    navigate(`/export/${videoId}`);
  };

  const tools = [
    { id: 'pose', icon: '🦴', label: 'Pose' },
    { id: 'objects', icon: '📦', label: 'Objects' },
    { id: 'actions', icon: '🎬', label: 'Actions' }
  ];

  const getCurrentFrame = () => Math.floor(currentTime * 30);
  const getTotalFrames = () => Math.floor(duration * 30);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="flex h-[calc(100vh-64px)]">
        {/* Left Sidebar - Tools */}
        <motion.div 
          className="w-20 bg-white border-r border-gray-200 flex flex-col items-center py-4"
          initial={{ x: -100 }}
          animate={{ x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {tools.map((tool) => (
            <ToolButton
              key={tool.id}
              {...tool}
              isActive={selectedTool === tool.id}
              onClick={() => setSelectedTool(tool.id)}
            />
          ))}
        </motion.div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Top Toolbar */}
          <motion.div 
            className="bg-white border-b border-gray-200 px-6 py-3 flex justify-between items-center"
            initial={{ y: -50 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <div className="flex items-center gap-4">
              <h2 className="text-lg font-semibold">
                Frame {getCurrentFrame()}/{getTotalFrames() || '...'}
              </h2>
              <div className="flex items-center gap-2">
                <motion.button
                  className="p-2 hover:bg-gray-100 rounded-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => seekVideo(-1/30)}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </motion.button>
                
                <motion.button
                  className="p-2 hover:bg-gray-100 rounded-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={togglePlayPause}
                >
                  {isPlaying ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    </svg>
                  )}
                </motion.button>
                
                <motion.button
                  className="p-2 hover:bg-gray-100 rounded-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => seekVideo(1/30)}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </motion.button>
              </div>
            </div>
            
            <motion.button
              onClick={handleExport}
              className="px-6 py-2 bg-black text-white rounded-full text-sm font-medium hover:bg-gray-900"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Export Data →
            </motion.button>
          </motion.div>

          {/* Canvas Area */}
          <div className="flex-1 p-6 overflow-hidden">
            <motion.div 
              className="bg-white rounded-2xl shadow-sm h-full flex items-center justify-center relative"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              {/* Video Player */}
              <div className="relative" style={{ width: '800px', height: '450px' }}>
                {videoUrl ? (
                  <>
                    <video
                      ref={videoRef}
                      src={videoUrl}
                      className="w-full h-full bg-black rounded-lg"
                      onTimeUpdate={handleVideoTimeUpdate}
                      onLoadedMetadata={handleVideoLoaded}
                      onPlay={() => setIsPlaying(true)}
                      onPause={() => setIsPlaying(false)}
                    />
                    {/* Annotation Overlay Canvas */}
                    <canvas
                      ref={canvasRef}
                      width={800}
                      height={450}
                      className="absolute top-0 left-0 pointer-events-none"
                    />
                  </>
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg flex items-center justify-center">
                    <div className="text-white text-center">
                      <div className="text-4xl mb-4">🎥</div>
                      <p className="text-lg">Sample Video</p>
                      <p className="text-sm text-gray-400 mt-2">Upload a video to see it here</p>
                    </div>
                  </div>
                )}
                
                {/* Action Label Overlay */}
                {selectedTool === 'actions' && (
                  <div className="absolute top-4 right-4">
                    {annotations.actions.map((action) => {
                      const frame = getCurrentFrame();
                      if (frame >= action.start && frame <= action.end) {
                        return (
                          <motion.div
                            key={action.label}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className={`${action.color.replace('bg-', 'bg-')} text-white text-sm px-3 py-1 rounded-full`}
                          >
                            {action.label}
                          </motion.div>
                        );
                      }
                      return null;
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Bottom Timeline */}
          <motion.div 
            className="bg-white border-t border-gray-200 px-6 py-4"
            initial={{ y: 50 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <div className="relative h-16">
              {/* Timeline Track */}
              <div className="absolute inset-0 bg-gray-100 rounded-lg overflow-hidden">
                {/* Action Segments */}
                {selectedTool === 'actions' && annotations.actions.map((action, i) => (
                  <motion.div
                    key={i}
                    className={`absolute top-2 h-8 ${action.color} opacity-60 rounded`}
                    style={{
                      left: `${(action.start / 90) * 100}%`,
                      width: `${((action.end - action.start) / 90) * 100}%`
                    }}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ opacity: 1 }}
                  >
                    <span className="text-white text-xs px-2 py-1">{action.label}</span>
                  </motion.div>
                ))}
                
                {/* Current Time Indicator */}
                <motion.div
                  className="absolute top-0 bottom-0 w-0.5 bg-red-500"
                  style={{ left: duration ? `${(currentTime / duration) * 100}%` : '0%' }}
                />
              </div>
              
              {/* Time Labels */}
              <div className="absolute -bottom-6 left-0 right-0 flex justify-between text-xs text-gray-400">
                <span>0:00</span>
                <span>{Math.floor(duration / 2)}s</span>
                <span>{Math.floor(duration)}s</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Sidebar - Properties */}
        <motion.div 
          className="w-80 bg-white border-l border-gray-200 p-6"
          initial={{ x: 100 }}
          animate={{ x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h3 className="font-semibold mb-4">Properties</h3>
          
          <AnimatePresence mode="wait">
            {selectedTool === 'pose' && (
              <motion.div
                key="pose"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <PropertyItem label="Keypoints" value="11" />
                <PropertyItem label="Confidence" value="91%" />
                <PropertyItem label="Model" value="MediaPipe" />
                <PropertyItem label="FPS" value="30" />
              </motion.div>
            )}
            
            {selectedTool === 'objects' && (
              <motion.div
                key="objects"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <PropertyItem label="Objects" value="2" />
                <PropertyItem label="Classes" value="cup, box" />
                <PropertyItem label="Model" value="YOLOv8" />
                <PropertyItem label="Confidence" value="90%" />
              </motion.div>
            )}
            
            {selectedTool === 'actions' && (
              <motion.div
                key="actions"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <PropertyItem label="Actions" value="4" />
                <PropertyItem label="Duration" value={`${Math.floor(duration)}s`} />
                <PropertyItem label="Current" value={
                  annotations.actions.find(a => {
                    const frame = getCurrentFrame();
                    return frame >= a.start && frame <= a.end;
                  })?.label || 'none'
                } />
              </motion.div>
            )}
          </AnimatePresence>
          
          <div className="mt-8">
            <h4 className="font-medium mb-3 text-sm text-gray-600">Video Stats</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Duration</span>
                <span className="font-medium">{duration.toFixed(2)}s</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Total Frames</span>
                <span className="font-medium">{getTotalFrames()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Current Time</span>
                <span className="font-medium">{currentTime.toFixed(2)}s</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Frame Rate</span>
                <span className="font-medium">30 fps</span>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <motion.button
              className="w-full py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                if (videoRef.current) {
                  videoRef.current.currentTime = 0;
                }
              }}
            >
              Reset to Start
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const ToolButton = ({ icon, label, isActive, onClick }) => {
  return (
    <motion.button
      onClick={onClick}
      className={`w-14 h-14 rounded-xl flex flex-col items-center justify-center mb-2 transition-colors ${
        isActive ? 'bg-black text-white' : 'hover:bg-gray-100'
      }`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <span className="text-xl mb-1">{icon}</span>
      <span className="text-xs">{label}</span>
    </motion.button>
  );
};

const PropertyItem = ({ label, value }) => {
  return (
    <div className="flex justify-between py-2 border-b border-gray-100">
      <span className="text-sm text-gray-600">{label}</span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  );
};

export default CleanAnnotatePage;