import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navigation from '../components/Navigation';

const CleanExportPage = () => {
  const { videoId } = useParams();
  const navigate = useNavigate();
  const [selectedFormat, setSelectedFormat] = useState('json');
  const [isExporting, setIsExporting] = useState(false);
  const [exportComplete, setExportComplete] = useState(false);

  const formats = [
    { 
      id: 'json', 
      name: 'JSON', 
      icon: '{ }',
      description: 'Universal format for ML pipelines',
      extension: '.json',
      size: '2.4 MB'
    },
    { 
      id: 'csv', 
      name: 'CSV', 
      icon: '▤',
      description: 'Tabular format for data analysis',
      extension: '.csv',
      size: '1.8 MB'
    },
    { 
      id: 'yaml', 
      name: 'ROS/YAML', 
      icon: '---',
      description: 'Robot Operating System compatible',
      extension: '.yaml',
      size: '2.1 MB'
    }
  ];

  const dataTypes = [
    { id: 'pose', label: 'Pose Data', icon: '🦴', checked: true },
    { id: 'objects', label: 'Object Detections', icon: '📦', checked: true },
    { id: 'actions', label: 'Action Labels', icon: '🎬', checked: true }
  ];

  const handleExport = async () => {
    setIsExporting(true);
    
    // Simulate export process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsExporting(false);
    setExportComplete(true);
    
    // Auto-download simulation
    setTimeout(() => {
      const format = formats.find(f => f.id === selectedFormat);
      console.log(`Downloading: video_${videoId}_data${format.extension}`);
    }, 500);
  };

  const handleNewProject = () => {
    navigate('/upload');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-5xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold mb-4 text-center">Export Your Data</h1>
          <p className="text-gray-600 text-center mb-12">
            Choose your format and download the processed robot training data.
          </p>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left: Format Selection */}
            <div>
              <h2 className="text-lg font-semibold mb-4">Select Format</h2>
              <div className="space-y-3">
                {formats.map((format) => (
                  <FormatCard
                    key={format.id}
                    {...format}
                    isSelected={selectedFormat === format.id}
                    onClick={() => setSelectedFormat(format.id)}
                  />
                ))}
              </div>
              
              {/* Data Types Selection */}
              <div className="mt-8">
                <h2 className="text-lg font-semibold mb-4">Include Data Types</h2>
                <div className="bg-white rounded-xl p-4 space-y-3">
                  {dataTypes.map((type) => (
                    <label
                      key={type.id}
                      className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
                    >
                      <input
                        type="checkbox"
                        defaultChecked={type.checked}
                        className="w-4 h-4 text-black focus:ring-black border-gray-300 rounded"
                      />
                      <span className="text-2xl">{type.icon}</span>
                      <span className="font-medium">{type.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Preview */}
            <div>
              <h2 className="text-lg font-semibold mb-4">Preview</h2>
              <motion.div 
                className="bg-black text-white rounded-xl p-6 font-mono text-sm overflow-auto"
                layout
              >
                <AnimatePresence mode="wait">
                  {selectedFormat === 'json' && (
                    <motion.pre
                      key="json"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="whitespace-pre"
                    >
{`{
  "video_id": "${videoId}",
  "frames": 90,
  "pose_data": {
    "frame_0": {
      "keypoints": {
        "nose": [320, 180, 0.94],
        "left_shoulder": [280, 250, 0.92],
        "right_shoulder": [360, 250, 0.91]
      }
    }
  },
  "objects": [
    {
      "frame": 0,
      "detections": [
        {"class": "cup", "bbox": [150, 300, 230, 420]}
      ]
    }
  ],
  "actions": [
    {"label": "reaching", "start": 0, "end": 30}
  ]
}`}
                    </motion.pre>
                  )}
                  
                  {selectedFormat === 'csv' && (
                    <motion.pre
                      key="csv"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="whitespace-pre"
                    >
{`frame,keypoint,x,y,z,confidence
0,nose,320,180,0,0.94
0,left_shoulder,280,250,0,0.92
0,right_shoulder,360,250,0,0.91
1,nose,322,182,0,0.93
1,left_shoulder,282,252,0,0.91
1,right_shoulder,362,252,0,0.90

frame,object_class,x1,y1,x2,y2
0,cup,150,300,230,420
0,box,350,250,450,400
1,cup,152,302,232,422`}
                    </motion.pre>
                  )}
                  
                  {selectedFormat === 'yaml' && (
                    <motion.pre
                      key="yaml"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="whitespace-pre"
                    >
{`video_id: ${videoId}
total_frames: 90
pose_data:
  frame_0:
    keypoints:
      nose: [320, 180, 0.94]
      left_shoulder: [280, 250, 0.92]
      right_shoulder: [360, 250, 0.91]
objects:
  - frame: 0
    detections:
      - class: cup
        bbox: [150, 300, 230, 420]
actions:
  - label: reaching
    start_frame: 0
    end_frame: 30`}
                    </motion.pre>
                  )}
                </AnimatePresence>
              </motion.div>
              
              {/* File Info */}
              <div className="mt-4 bg-white rounded-xl p-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">File name:</span>
                  <span className="font-mono">video_{videoId}_data{formats.find(f => f.id === selectedFormat)?.extension}</span>
                </div>
                <div className="flex justify-between items-center text-sm mt-2">
                  <span className="text-gray-600">Estimated size:</span>
                  <span className="font-medium">{formats.find(f => f.id === selectedFormat)?.size}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Export Button */}
          <div className="mt-12 text-center">
            {!exportComplete ? (
              <motion.button
                onClick={handleExport}
                disabled={isExporting}
                className={`px-12 py-4 rounded-full font-medium text-lg transition-colors ${
                  isExporting 
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                    : 'bg-black text-white hover:bg-gray-900'
                }`}
                whileHover={!isExporting ? { scale: 1.02 } : {}}
                whileTap={!isExporting ? { scale: 0.98 } : {}}
              >
                {isExporting ? (
                  <span className="flex items-center gap-3">
                    <motion.div
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    Preparing Export...
                  </span>
                ) : (
                  'Download Data'
                )}
              </motion.button>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="inline-flex items-center gap-3 text-green-600 mb-6">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-medium">Export Complete!</span>
                </div>
                
                <div className="flex justify-center gap-4">
                  <motion.button
                    onClick={handleExport}
                    className="px-6 py-3 bg-gray-100 text-black rounded-full font-medium hover:bg-gray-200"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Download Again
                  </motion.button>
                  <motion.button
                    onClick={handleNewProject}
                    className="px-6 py-3 bg-black text-white rounded-full font-medium hover:bg-gray-900"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    New Project →
                  </motion.button>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const FormatCard = ({ id, name, icon, description, extension, size, isSelected, onClick }) => {
  return (
    <motion.div
      onClick={onClick}
      className={`bg-white rounded-xl p-4 cursor-pointer transition-all border-2 ${
        isSelected ? 'border-black' : 'border-transparent hover:border-gray-200'
      }`}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center font-mono text-lg ${
            isSelected ? 'bg-black text-white' : 'bg-gray-100'
          }`}>
            {icon}
          </div>
          <div>
            <h3 className="font-semibold">{name}</h3>
            <p className="text-sm text-gray-600">{description}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm font-mono">{extension}</p>
          <p className="text-xs text-gray-500">{size}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default CleanExportPage;