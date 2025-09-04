import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navigation from '../components/Navigation';

const DemoAnnotatePage = () => {
  const { videoId } = useParams();
  const navigate = useNavigate();
  const [selectedTool, setSelectedTool] = useState('pose');
  const [currentFrame, setCurrentFrame] = useState(0);
  const [annotationData, setAnnotationData] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const videoRef = useRef(null);

  useEffect(() => {
    // Fetch video and annotation data
    fetchVideoData();
    fetchAnnotations();
  }, [videoId]);

  const fetchVideoData = async () => {
    try {
      // Get the video URL from backend
      const videoResponse = await fetch(`http://localhost:8000/api/videos/${videoId}`);
      if (videoResponse.ok) {
        const videoData = await videoResponse.json();
        setVideoUrl(`http://localhost:8000${videoData.video_url}`);
      }
    } catch (error) {
      console.error('Error fetching video:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAnnotations = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/videos/${videoId}/annotations`);
      if (response.ok) {
        const data = await response.json();
        setAnnotationData(data);
      }
    } catch (error) {
      console.error('Error fetching annotations:', error);
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="flex h-[calc(100vh-64px)]">
        {/* Left Sidebar - Tools */}
        <div className="w-20 bg-white border-r border-gray-200 flex flex-col items-center py-4">
          {tools.map((tool) => (
            <motion.button
              key={tool.id}
              onClick={() => setSelectedTool(tool.id)}
              className={`w-14 h-14 rounded-xl flex flex-col items-center justify-center mb-2 transition-colors ${
                selectedTool === tool.id ? 'bg-black text-white' : 'hover:bg-gray-100'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-xl mb-1">{tool.icon}</span>
              <span className="text-xs">{tool.label}</span>
            </motion.button>
          ))}
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Top Toolbar */}
          <div className="bg-white border-b border-gray-200 px-6 py-3 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <h2 className="text-lg font-semibold">Video Annotations - Frame {currentFrame}</h2>
            </div>
            
            <motion.button
              onClick={handleExport}
              className="px-6 py-2 bg-black text-white rounded-full text-sm font-medium hover:bg-gray-900"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Export Data →
            </motion.button>
          </div>

          {/* Visualization Area */}
          <div className="flex-1 p-6">
            <div className="bg-white rounded-2xl shadow-sm h-full p-8">
              <div className="max-w-4xl mx-auto">
                {/* Video Display */}
                <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg aspect-video mb-8 relative overflow-hidden">
                  {isLoading ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-white text-center">
                        <div className="text-2xl mb-2">Loading video...</div>
                      </div>
                    </div>
                  ) : videoUrl ? (
                    <video
                      ref={videoRef}
                      src={videoUrl}
                      controls
                      className="w-full h-full object-contain"
                      onTimeUpdate={(e) => {
                        const video = e.target;
                        const frameRate = 30; // Assuming 30fps
                        setCurrentFrame(Math.floor(video.currentTime * frameRate));
                      }}
                    >
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-white text-center">
                        <div className="text-6xl mb-4">🎥</div>
                        <p className="text-xl font-semibold mb-2">Video Preview</p>
                        <p className="text-sm text-gray-400">Upload a video to see live annotations</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Data Display */}
                {annotationData ? (
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold">
                      {selectedTool === 'pose' && 'Pose Estimation Data'}
                      {selectedTool === 'objects' && 'Object Detection Data'}
                      {selectedTool === 'actions' && 'Action Recognition Data'}
                    </h3>

                    {/* Real Data Display */}
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h4 className="font-semibold mb-4">Detected at Frame {currentFrame}:</h4>
                      
                      {selectedTool === 'pose' && annotationData.pose && (
                        <div className="space-y-2">
                          {Object.entries(annotationData.pose).slice(0, 5).map(([frameKey, frameData]) => (
                            <div key={frameKey} className="text-sm">
                              <span className="font-mono">{frameKey}:</span>
                              <span className="text-gray-600 ml-2">
                                {frameData.keypoints ? Object.keys(frameData.keypoints).length + ' keypoints detected' : 'Processing...'}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}

                      {selectedTool === 'objects' && annotationData.objects && (
                        <div className="space-y-3">
                          {Object.entries(annotationData.objects).slice(0, 5).map(([frameKey, objects]) => (
                            <div key={frameKey} className="text-sm">
                              <span className="font-mono">{frameKey}:</span>
                              {objects && objects.length > 0 ? (
                                <div className="ml-4 mt-1">
                                  {objects.map((obj, i) => (
                                    <div key={i} className="flex gap-2">
                                      <span className="text-blue-600">{obj.label}</span>
                                      <span className="text-gray-500">conf: {obj.confidence?.toFixed(2)}</span>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <span className="text-gray-500 ml-2">No objects detected</span>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {selectedTool === 'actions' && annotationData.actions && (
                        <div className="space-y-3">
                          {annotationData.actions.length > 0 ? (
                            annotationData.actions.map((action, i) => (
                              <div key={i} className="flex items-center gap-4 text-sm">
                                <span className="font-mono flex-1">{action.label}</span>
                                <span className="text-gray-600">frames {action.start_frame}-{action.end_frame}</span>
                                <span className="text-green-600">conf: {action.confidence?.toFixed(2)}</span>
                              </div>
                            ))
                          ) : (
                            <div className="text-gray-500">No actions detected</div>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="text-sm text-gray-500">
                      <p>Processing Status: {annotationData.status || 'Complete'}</p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-lg p-6">
                    <p className="text-gray-600">Processing video annotations...</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white border-t border-gray-200 px-6 py-4">
            <div className="relative h-12">
              <div className="absolute inset-0 bg-gray-100 rounded-lg overflow-hidden">
                {selectedTool === 'actions' && annotationData?.actions && (
                  <>
                    {annotationData.actions.map((action, i) => {
                      const totalFrames = annotationData.total_frames || 90;
                      const left = (action.start_frame / totalFrames) * 100;
                      const width = ((action.end_frame - action.start_frame) / totalFrames) * 100;
                      return (
                        <div
                          key={i}
                          className="absolute top-1 bottom-1 bg-blue-500 opacity-60 rounded"
                          style={{ left: `${left}%`, width: `${width}%` }}
                          title={action.label}
                        />
                      );
                    })}
                  </>
                )}
                
                {videoRef.current && (
                  <div
                    className="absolute top-0 bottom-0 w-0.5 bg-red-500"
                    style={{ 
                      left: `${(videoRef.current.currentTime / (videoRef.current.duration || 1)) * 100}%` 
                    }}
                  />
                )}
              </div>
              
              <div className="absolute -bottom-6 left-0 right-0 flex justify-between text-xs text-gray-400">
                <span>Start</span>
                <span>End</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-80 bg-white border-l border-gray-200 p-6">
          <h3 className="font-semibold mb-4">Processing Info</h3>
          
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">How it works:</h4>
              <ol className="text-sm text-blue-800 space-y-1">
                <li>1. Upload video file</li>
                <li>2. ML models process each frame</li>
                <li>3. Extract pose, objects, actions</li>
                <li>4. Export structured data</li>
              </ol>
            </div>

            <div className="border-t pt-4">
              <h4 className="font-medium mb-2">Models Used:</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Pose:</span>
                  <span className="font-mono">MediaPipe</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Objects:</span>
                  <span className="font-mono">YOLOv8</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Actions:</span>
                  <span className="font-mono">Rule-based</span>
                </div>
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="font-medium mb-2">Output Stats:</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Frames:</span>
                  <span className="font-semibold">{annotationData?.total_frames || '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Keypoints/Frame:</span>
                  <span className="font-semibold">33</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Object Classes:</span>
                  <span className="font-semibold">80+</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Actions Detected:</span>
                  <span className="font-semibold">{annotationData?.actions?.length || 0}</span>
                </div>
              </div>
            </div>

            {videoRef.current && (
              <motion.button
                onClick={() => {
                  if (videoRef.current) {
                    videoRef.current.currentTime += 1/30; // Advance by one frame (assuming 30fps)
                  }
                }}
                className="w-full py-2 bg-gray-100 rounded-lg text-sm font-medium hover:bg-gray-200"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Next Frame →
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoAnnotatePage;