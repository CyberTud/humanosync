import React, { useState, useCallback } from 'react';
import axios from 'axios';

const VideoUpload = ({ onVideoUploaded }) => {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

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
      ['.mp4', '.avi', '.mov'].some(ext => file.name.endsWith(ext))
    );
    
    if (videoFile) {
      uploadVideo(videoFile);
    } else {
      setError('Please upload a valid video file (mp4, avi, or mov)');
    }
  }, []);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      uploadVideo(file);
    }
  };

  const uploadVideo = async (file) => {
    setUploading(true);
    setError(null);
    
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const response = await axios.post('http://localhost:8000/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      onVideoUploaded(response.data.video_id);
    } catch (err) {
      setError('Failed to upload video. Please try again.');
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-8">
      <div
        className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
          dragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {uploading ? (
          <div>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Uploading video...</p>
          </div>
        ) : (
          <>
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
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
            <p className="mt-2 text-sm text-gray-600">
              Drag and drop your video here, or{' '}
              <label className="text-blue-600 hover:text-blue-500 cursor-pointer">
                browse
                <input
                  type="file"
                  className="hidden"
                  accept="video/*,.mp4,.avi,.mov"
                  onChange={handleFileSelect}
                />
              </label>
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Supported formats: MP4, AVI, MOV
            </p>
          </>
        )}
        
        {error && (
          <p className="mt-4 text-red-600 text-sm">{error}</p>
        )}
      </div>
    </div>
  );
};

export default VideoUpload;