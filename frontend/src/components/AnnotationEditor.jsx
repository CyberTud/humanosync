import React, { useState, useRef, useEffect } from 'react';
import VideoPlayer from './VideoPlayer';
import CanvasOverlay from './CanvasOverlay';
import ActionTimeline from './ActionTimeline';
import ExportPanel from './ExportPanel';

const AnnotationEditor = ({ videoId, annotations, onAnnotationsUpdate, onExport }) => {
  const [currentFrame, setCurrentFrame] = useState(1);
  const [selectedTool, setSelectedTool] = useState('pose');
  const [editedAnnotations, setEditedAnnotations] = useState(annotations);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    setEditedAnnotations(annotations);
  }, [annotations]);

  const handleFrameChange = (frame) => {
    setCurrentFrame(frame);
  };

  const handleAnnotationEdit = (type, frameId, data) => {
    const newAnnotations = { ...editedAnnotations };
    
    if (type === 'pose') {
      newAnnotations.pose[frameId] = data;
    } else if (type === 'objects') {
      newAnnotations.objects[frameId] = data;
    } else if (type === 'actions') {
      newAnnotations.actions = data;
    }
    
    setEditedAnnotations(newAnnotations);
  };

  const handleSave = () => {
    onAnnotationsUpdate(editedAnnotations);
    alert('Annotations saved successfully!');
  };

  const getCurrentFrameData = () => {
    const frameId = `frame_${String(currentFrame).padStart(3, '0')}`;
    return {
      pose: editedAnnotations?.pose[frameId],
      objects: editedAnnotations?.objects[frameId],
      actions: editedAnnotations?.actions
    };
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b">
        <div className="flex justify-between items-center">
          <div className="flex space-x-2">
            <button
              className={`px-4 py-2 rounded ${selectedTool === 'pose' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
              onClick={() => setSelectedTool('pose')}
            >
              Pose
            </button>
            <button
              className={`px-4 py-2 rounded ${selectedTool === 'objects' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
              onClick={() => setSelectedTool('objects')}
            >
              Objects
            </button>
            <button
              className={`px-4 py-2 rounded ${selectedTool === 'actions' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
              onClick={() => setSelectedTool('actions')}
            >
              Actions
            </button>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Save Annotations
            </button>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-4 gap-4 p-4">
        <div className="col-span-3">
          <div className="relative bg-black rounded">
            <VideoPlayer
              videoId={videoId}
              ref={videoRef}
              onFrameChange={handleFrameChange}
              isPlaying={isPlaying}
              setIsPlaying={setIsPlaying}
            />
            <CanvasOverlay
              ref={canvasRef}
              frameData={getCurrentFrameData()}
              selectedTool={selectedTool}
              currentFrame={currentFrame}
              onAnnotationEdit={handleAnnotationEdit}
            />
          </div>
          
          <ActionTimeline
            actions={editedAnnotations?.actions || []}
            currentFrame={currentFrame}
            totalFrames={60}
            onFrameChange={setCurrentFrame}
            onActionEdit={(actions) => handleAnnotationEdit('actions', null, actions)}
          />
        </div>
        
        <div className="col-span-1">
          <div className="sticky top-4">
            <AnnotationPanel
              frameData={getCurrentFrameData()}
              selectedTool={selectedTool}
              currentFrame={currentFrame}
            />
            
            <ExportPanel onExport={onExport} />
          </div>
        </div>
      </div>
    </div>
  );
};

const AnnotationPanel = ({ frameData, selectedTool, currentFrame }) => {
  return (
    <div className="bg-gray-50 rounded p-4 mb-4">
      <h3 className="font-bold mb-2">Frame {currentFrame}</h3>
      
      {selectedTool === 'pose' && frameData?.pose && (
        <div>
          <h4 className="text-sm font-semibold mb-1">Pose Keypoints</h4>
          <div className="text-xs space-y-1 max-h-48 overflow-y-auto">
            {Object.entries(frameData.pose.keypoints).map(([key, coords]) => (
              <div key={key} className="flex justify-between">
                <span>{key}:</span>
                <span>[{coords[0]}, {coords[1]}]</span>
              </div>
            ))}
          </div>
          <div className="mt-2 text-xs">
            Confidence: {frameData.pose.confidence.toFixed(2)}
          </div>
        </div>
      )}
      
      {selectedTool === 'objects' && frameData?.objects && (
        <div>
          <h4 className="text-sm font-semibold mb-1">Detected Objects</h4>
          <div className="text-xs space-y-2">
            {frameData.objects.map((obj, idx) => (
              <div key={idx} className="border-l-2 border-blue-400 pl-2">
                <div className="font-semibold">{obj.label}</div>
                <div>Box: [{obj.bbox.join(', ')}]</div>
                <div>Conf: {obj.confidence.toFixed(2)}</div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {selectedTool === 'actions' && frameData?.actions && (
        <div>
          <h4 className="text-sm font-semibold mb-1">Actions</h4>
          <div className="text-xs space-y-2">
            {frameData.actions
              .filter(action => 
                currentFrame >= action.start_frame && 
                currentFrame <= action.end_frame
              )
              .map((action, idx) => (
                <div key={idx} className="border-l-2 border-green-400 pl-2">
                  <div className="font-semibold">{action.label}</div>
                  <div>Frames: {action.start_frame}-{action.end_frame}</div>
                  <div>Conf: {action.confidence.toFixed(2)}</div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AnnotationEditor;