import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import Navigation from '../components/Navigation';
import api from '../services/api';

const CleanUploadPage = () => {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [processingStage, setProcessingStage] = useState('');
  const navigate = useNavigate();

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'video/*': ['.mp4', '.avi', '.mov', '.webm']
    },
    maxFiles: 1
  });

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append('video', file, file.name);
    
    // Debug: Log what we're sending
    console.log('Uploading file:', file);
    console.log('File name:', file.name);
    console.log('File type:', file.type);
    console.log('File size:', file.size);

    try {
      // Upload with progress tracking
      setProcessingStage('Uploading video...');
      
      // Use fetch instead of axios for FormData
      const response = await fetch('http://localhost:8000/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Server error:', errorData);
        throw new Error(`Upload failed: ${response.status}`);
      }
      
      const data = await response.json();
      const videoId = data.video_id || 'demo';
      
      // Simulate progress for demo
      for (let i = 0; i <= 100; i += 20) {
        setUploadProgress(i);
        await new Promise(resolve => setTimeout(resolve, 200));
      }
      
      // Simulate processing stages after upload
      setProcessingStage('Extracting pose data...');
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setProcessingStage('Detecting objects...');
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setProcessingStage('Analyzing actions...');
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setProcessingStage('Complete!');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      navigate(`/annotate/${videoId}`);
    } catch (error) {
      console.error('Upload failed:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error detail:', JSON.stringify(error.response?.data?.detail, null, 2));
      setProcessingStage('Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const removeFile = () => {
    setFile(null);
    setUploadProgress(0);
    setProcessingStage('');
  };

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold mb-4 text-center">Upload Your Video</h1>
          <p className="text-gray-600 text-center mb-12">
            Upload a video to extract pose, object, and action data for robot training.
          </p>

          {!file ? (
            <motion.div
              {...getRootProps()}
              className={`relative border-2 border-dashed rounded-2xl p-16 text-center cursor-pointer transition-all ${
                isDragActive 
                  ? 'border-black bg-gray-50' 
                  : 'border-gray-300 hover:border-gray-400 bg-white'
              }`}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <input {...getInputProps()} />
              
              <motion.div
                animate={isDragActive ? { scale: 1.1 } : { scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                <svg
                  className="mx-auto h-16 w-16 text-gray-400 mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
              </motion.div>

              <p className="text-lg font-medium mb-2">
                {isDragActive ? 'Drop your video here' : 'Drag & drop your video here'}
              </p>
              <p className="text-gray-500 text-sm">or click to browse</p>
              <p className="text-gray-400 text-xs mt-4">Supports MP4, AVI, MOV, WEBM (max 500MB)</p>
            </motion.div>
          ) : (
            <motion.div 
              className="bg-gray-50 rounded-2xl p-8"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-black text-white rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium">{file.name}</p>
                    <p className="text-sm text-gray-500">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                
                {!isUploading && (
                  <motion.button
                    onClick={removeFile}
                    className="text-gray-400 hover:text-gray-600"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </motion.button>
                )}
              </div>

              {isUploading && (
                <div className="mb-6">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">{processingStage}</span>
                    <span className="text-gray-600">{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <motion.div
                      className="h-full bg-black rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${uploadProgress}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>
              )}

              <motion.button
                onClick={handleUpload}
                disabled={isUploading}
                className={`w-full py-4 rounded-full font-medium transition-colors ${
                  isUploading 
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                    : 'bg-black text-white hover:bg-gray-900'
                }`}
                whileHover={!isUploading ? { scale: 1.01 } : {}}
                whileTap={!isUploading ? { scale: 0.99 } : {}}
              >
                {isUploading ? 'Processing...' : 'Process Video'}
              </motion.button>
            </motion.div>
          )}
        </motion.div>

        {/* Processing Steps Preview */}
        <motion.div 
          className="mt-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold text-center mb-8">What happens next?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <ProcessCard
              icon="🦴"
              title="Pose Extraction"
              description="33 keypoints tracked in 3D space"
              delay={0.3}
            />
            <ProcessCard
              icon="📦"
              title="Object Detection"
              description="Identify and track objects"
              delay={0.4}
            />
            <ProcessCard
              icon="🎬"
              title="Action Recognition"
              description="Temporal action analysis"
              delay={0.5}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const ProcessCard = ({ icon, title, description, delay }) => {
  return (
    <motion.div
      className="text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ y: -5 }}
    >
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="font-semibold mb-2">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </motion.div>
  );
};

export default CleanUploadPage;