import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { uploadVideo, getProcessingStatus } from '../services/api';

const UploadPage = () => {
  const navigate = useNavigate();
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState('');

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    const videoFile = files.find(file => 
      file.type.startsWith('video/') || 
      ['.mp4', '.avi', '.mov'].some(ext => file.name.toLowerCase().endsWith(ext))
    );
    
    if (videoFile) {
      handleUpload(videoFile);
    } else {
      setError('Please upload a valid video file (MP4, AVI, or MOV)');
    }
  }, []);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleUpload(file);
    }
  };

  const handleUpload = async (file) => {
    setUploading(true);
    setError(null);
    setProgress('Uploading video...');
    
    try {
      const response = await uploadVideo(file);
      const videoId = response.video_id;
      
      setUploading(false);
      setProcessing(true);
      setProgress('Processing video with AI models...');
      
      // Poll for processing status
      const checkStatus = async () => {
        try {
          const status = await getProcessingStatus(videoId);
          
          if (status.status === 'completed') {
            setProgress('Processing complete!');
            setTimeout(() => {
              navigate(`/annotate/${videoId}`);
            }, 1000);
          } else if (status.status.startsWith('error')) {
            setError(`Processing error: ${status.status}`);
            setProcessing(false);
          } else {
            // Continue polling
            setTimeout(checkStatus, 2000);
          }
        } catch (err) {
          console.error('Status check error:', err);
          setTimeout(checkStatus, 2000);
        }
      };
      
      setTimeout(checkStatus, 2000);
      
    } catch (err) {
      setError('Failed to upload video. Please try again.');
      console.error('Upload error:', err);
      setUploading(false);
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-700 via-blue-600 to-cyan-500 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center text-white mb-8">
          <h1 className="text-4xl font-bold mb-4">Upload Video</h1>
          <p className="text-lg opacity-90">
            Upload a video of human task demonstration for AI processing
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-2xl p-8">
          {!uploading && !processing ? (
            <div
              className={`border-4 border-dashed rounded-lg p-16 text-center transition-colors ${
                dragging 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <svg
                className="mx-auto h-16 w-16 text-gray-400 mb-4"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              
              <p className="text-xl text-gray-600 mb-4">
                Drag and drop your video here
              </p>
              
              <p className="text-gray-500 mb-4">or</p>
              
              <label className="inline-block">
                <input
                  type="file"
                  className="hidden"
                  accept="video/*,.mp4,.avi,.mov"
                  onChange={handleFileSelect}
                />
                <span className="px-6 py-3 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700">
                  Browse Files
                </span>
              </label>
              
              <p className="text-sm text-gray-500 mt-4">
                Supported formats: MP4, AVI, MOV (Max 500MB)
              </p>
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="inline-block">
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-6"></div>
                <p className="text-xl text-gray-700 mb-2">{progress}</p>
                {processing && (
                  <p className="text-sm text-gray-500">
                    This may take a few minutes depending on video length
                  </p>
                )}
              </div>
            </div>
          )}
          
          {error && (
            <div className="mt-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error}
            </div>
          )}
        </div>

        <div className="mt-8 bg-white/10 backdrop-blur-md rounded-lg p-6 text-white">
          <h3 className="text-xl font-semibold mb-3">AI Processing Pipeline</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <ProcessingStep
              icon="🧘"
              title="Pose Extraction"
              description="MediaPipe detects 33 body keypoints"
            />
            <ProcessingStep
              icon="📦"
              title="Object Detection"
              description="YOLOv8 identifies objects in scene"
            />
            <ProcessingStep
              icon="🎬"
              title="Action Recognition"
              description="Temporal analysis of movements"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const ProcessingStep = ({ icon, title, description }) => (
  <div className="text-center">
    <div className="text-3xl mb-2">{icon}</div>
    <h4 className="font-semibold mb-1">{title}</h4>
    <p className="text-sm opacity-90">{description}</p>
  </div>
);

export default UploadPage;