import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import VideoViewer from '../components/VideoViewer';
import PoseOverlay from '../components/PoseOverlay';
import BoundingBoxEditor from '../components/BoundingBoxEditor';
import ActionTimeline from '../components/ActionTimeline';
import { 
  getPose, 
  getObjects, 
  getActions, 
  saveAnnotations,
  updatePoseFrame,
  updateObjectsFrame,
  addAction,
  deleteAction
} from '../services/api';

const AnnotatePage = () => {
  const { videoId } = useParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [currentFrame, setCurrentFrame] = useState(1);
  const [totalFrames, setTotalFrames] = useState(100);
  const [selectedTool, setSelectedTool] = useState('pose');
  const [annotations, setAnnotations] = useState({
    pose: {},
    objects: {},
    actions: []
  });
  const [hasChanges, setHasChanges] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadAnnotations();
  }, [videoId]);

  const loadAnnotations = async () => {
    try {
      setLoading(true);
      const [poseData, objectsData, actionsData] = await Promise.all([
        getPose(videoId),
        getObjects(videoId),
        getActions(videoId)
      ]);
      
      setAnnotations({
        pose: poseData || {},
        objects: objectsData || {},
        actions: actionsData || []
      });
      
      // Calculate total frames
      const frameCount = Math.max(
        Object.keys(poseData || {}).length,
        Object.keys(objectsData || {}).length,
        100
      );
      setTotalFrames(frameCount);
      
      setLoading(false);
    } catch (error) {
      console.error('Error loading annotations:', error);
      setLoading(false);
    }
  };

  const handlePoseUpdate = async (frameId, updatedKeypoints) => {
    const updatedPose = {
      ...annotations.pose[frameId],
      keypoints: updatedKeypoints
    };
    
    try {
      await updatePoseFrame(videoId, frameId, updatedPose);
      setAnnotations(prev => ({
        ...prev,
        pose: {
          ...prev.pose,
          [frameId]: updatedPose
        }
      }));
      setHasChanges(true);
    } catch (error) {
      console.error('Error updating pose:', error);
    }
  };

  const handleObjectsUpdate = async (frameId, updatedObjects) => {
    try {
      await updateObjectsFrame(videoId, frameId, updatedObjects);
      setAnnotations(prev => ({
        ...prev,
        objects: {
          ...prev.objects,
          [frameId]: updatedObjects
        }
      }));
      setHasChanges(true);
    } catch (error) {
      console.error('Error updating objects:', error);
    }
  };

  const handleActionAdd = async (action) => {
    try {
      await addAction(videoId, action);
      const updatedActions = [...annotations.actions, action];
      updatedActions.sort((a, b) => a.start_frame - b.start_frame);
      
      setAnnotations(prev => ({
        ...prev,
        actions: updatedActions
      }));
      setHasChanges(true);
    } catch (error) {
      console.error('Error adding action:', error);
    }
  };

  const handleActionDelete = async (actionIndex) => {
    try {
      await deleteAction(videoId, actionIndex);
      const updatedActions = annotations.actions.filter((_, idx) => idx !== actionIndex);
      
      setAnnotations(prev => ({
        ...prev,
        actions: updatedActions
      }));
      setHasChanges(true);
    } catch (error) {
      console.error('Error deleting action:', error);
    }
  };

  const handleSaveAll = async () => {
    setSaving(true);
    try {
      await saveAnnotations(videoId, annotations);
      setHasChanges(false);
      alert('Annotations saved successfully!');
    } catch (error) {
      console.error('Error saving annotations:', error);
      alert('Error saving annotations. Please try again.');
    }
    setSaving(false);
  };

  const getCurrentFrameData = () => {
    const frameId = `frame_${String(currentFrame).padStart(3, '0')}`;
    return {
      pose: annotations.pose[frameId],
      objects: annotations.objects[frameId] || [],
      actions: annotations.actions.filter(
        action => currentFrame >= action.start_frame && currentFrame <= action.end_frame
      )
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-700 via-blue-600 to-cyan-500 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-white mx-auto mb-4"></div>
          <p className="text-xl">Loading annotations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-md p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Annotation Editor</h1>
          
          <div className="flex items-center space-x-4">
            {/* Tool Selection */}
            <div className="flex space-x-2">
              <button
                onClick={() => setSelectedTool('pose')}
                className={`px-4 py-2 rounded ${
                  selectedTool === 'pose' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                Pose
              </button>
              <button
                onClick={() => setSelectedTool('objects')}
                className={`px-4 py-2 rounded ${
                  selectedTool === 'objects' 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                Objects
              </button>
              <button
                onClick={() => setSelectedTool('actions')}
                className={`px-4 py-2 rounded ${
                  selectedTool === 'actions' 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                Actions
              </button>
            </div>
            
            {/* Action Buttons */}
            <button
              onClick={handleSaveAll}
              disabled={!hasChanges || saving}
              className={`px-6 py-2 rounded font-semibold ${
                hasChanges && !saving
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {saving ? 'Saving...' : 'Save All'}
            </button>
            
            <button
              onClick={() => navigate(`/export/${videoId}`)}
              className="px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 font-semibold"
            >
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto p-4">
        <div className="grid grid-cols-4 gap-4">
          {/* Video and Overlay Area */}
          <div className="col-span-3">
            <div className="bg-white rounded-lg shadow-lg p-4">
              <div className="relative">
                <VideoViewer
                  videoId={videoId}
                  currentFrame={currentFrame}
                  onFrameChange={setCurrentFrame}
                />
                
                {selectedTool === 'pose' && (
                  <PoseOverlay
                    frameData={getCurrentFrameData().pose}
                    frameId={`frame_${String(currentFrame).padStart(3, '0')}`}
                    onUpdate={handlePoseUpdate}
                  />
                )}
                
                {selectedTool === 'objects' && (
                  <BoundingBoxEditor
                    objects={getCurrentFrameData().objects}
                    frameId={`frame_${String(currentFrame).padStart(3, '0')}`}
                    onUpdate={handleObjectsUpdate}
                  />
                )}
              </div>
              
              {/* Frame Controls */}
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentFrame(Math.max(1, currentFrame - 1))}
                    className="p-2 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    ← Prev
                  </button>
                  <span className="px-4 py-2 bg-gray-100 rounded">
                    Frame {currentFrame} / {totalFrames}
                  </span>
                  <button
                    onClick={() => setCurrentFrame(Math.min(totalFrames, currentFrame + 1))}
                    className="p-2 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    Next →
                  </button>
                </div>
                
                <input
                  type="range"
                  min="1"
                  max={totalFrames}
                  value={currentFrame}
                  onChange={(e) => setCurrentFrame(parseInt(e.target.value))}
                  className="flex-1 mx-4"
                />
              </div>
            </div>
            
            {/* Action Timeline */}
            <div className="mt-4">
              <ActionTimeline
                actions={annotations.actions}
                currentFrame={currentFrame}
                totalFrames={totalFrames}
                onFrameChange={setCurrentFrame}
                onActionAdd={handleActionAdd}
                onActionDelete={handleActionDelete}
              />
            </div>
          </div>
          
          {/* Info Panel */}
          <div className="col-span-1">
            <InfoPanel
              frameData={getCurrentFrameData()}
              selectedTool={selectedTool}
              currentFrame={currentFrame}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const InfoPanel = ({ frameData, selectedTool, currentFrame }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      <h3 className="text-lg font-semibold mb-4">Frame {currentFrame} Info</h3>
      
      {selectedTool === 'pose' && frameData.pose && (
        <div>
          <h4 className="font-semibold mb-2">Pose Keypoints</h4>
          <div className="text-sm space-y-1 max-h-96 overflow-y-auto">
            {Object.entries(frameData.pose.keypoints).slice(0, 10).map(([key, coords]) => (
              <div key={key} className="flex justify-between text-xs">
                <span>{key}:</span>
                <span>[{coords[0].toFixed(0)}, {coords[1].toFixed(0)}]</span>
              </div>
            ))}
            {Object.keys(frameData.pose.keypoints).length > 10 && (
              <div className="text-xs text-gray-500 italic">
                +{Object.keys(frameData.pose.keypoints).length - 10} more...
              </div>
            )}
          </div>
          <div className="mt-2 text-sm">
            Confidence: {(frameData.pose.confidence * 100).toFixed(1)}%
          </div>
        </div>
      )}
      
      {selectedTool === 'objects' && (
        <div>
          <h4 className="font-semibold mb-2">Detected Objects</h4>
          {frameData.objects.length > 0 ? (
            <div className="space-y-2">
              {frameData.objects.map((obj, idx) => (
                <div key={idx} className="border-l-2 border-green-400 pl-2 text-sm">
                  <div className="font-semibold">{obj.label}</div>
                  <div className="text-xs text-gray-600">
                    Conf: {(obj.confidence * 100).toFixed(1)}%
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No objects detected</p>
          )}
        </div>
      )}
      
      {selectedTool === 'actions' && (
        <div>
          <h4 className="font-semibold mb-2">Current Actions</h4>
          {frameData.actions.length > 0 ? (
            <div className="space-y-2">
              {frameData.actions.map((action, idx) => (
                <div key={idx} className="border-l-2 border-purple-400 pl-2 text-sm">
                  <div className="font-semibold">{action.label}</div>
                  <div className="text-xs text-gray-600">
                    Frames: {action.start_frame}-{action.end_frame}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No actions at this frame</p>
          )}
        </div>
      )}
      
      <div className="mt-6 p-3 bg-gray-50 rounded">
        <h4 className="text-sm font-semibold mb-2">Keyboard Shortcuts</h4>
        <ul className="text-xs space-y-1 text-gray-600">
          <li>← → : Navigate frames</li>
          <li>Space: Play/Pause</li>
          <li>Click: Edit annotation</li>
          <li>Ctrl+S: Save changes</li>
        </ul>
      </div>
    </div>
  );
};

export default AnnotatePage;