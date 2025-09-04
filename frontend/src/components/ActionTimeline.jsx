import React, { useState } from 'react';

const ActionTimeline = ({ 
  actions, 
  currentFrame, 
  totalFrames, 
  onFrameChange,
  onActionAdd,
  onActionDelete 
}) => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newAction, setNewAction] = useState({
    label: '',
    start_frame: currentFrame,
    end_frame: currentFrame + 10,
    confidence: 0.9
  });

  const handleTimelineClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    const frame = Math.max(1, Math.min(totalFrames, Math.floor(percentage * totalFrames) + 1));
    onFrameChange(frame);
  };

  const handleAddAction = () => {
    if (newAction.label && newAction.start_frame <= newAction.end_frame) {
      onActionAdd(newAction);
      setShowAddDialog(false);
      setNewAction({
        label: '',
        start_frame: currentFrame,
        end_frame: currentFrame + 10,
        confidence: 0.9
      });
    }
  };

  const getActionColor = (label) => {
    const colors = {
      'reach': '#3B82F6',
      'pick': '#10B981',
      'place': '#8B5CF6',
      'walk': '#F59E0B',
      'idle': '#6B7280'
    };
    return colors[label] || '#9333EA';
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Action Timeline</h3>
        <button
          onClick={() => setShowAddDialog(true)}
          className="px-3 py-1 bg-purple-600 text-white rounded text-sm hover:bg-purple-700"
        >
          Add Action
        </button>
      </div>
      
      <div 
        className="relative bg-gray-200 h-20 rounded cursor-pointer"
        onClick={handleTimelineClick}
      >
        {/* Action blocks */}
        {actions.map((action, idx) => {
          const startPercent = (action.start_frame / totalFrames) * 100;
          const widthPercent = ((action.end_frame - action.start_frame + 1) / totalFrames) * 100;
          const color = getActionColor(action.label);
          
          return (
            <div
              key={idx}
              className="absolute h-16 top-2 rounded flex items-center justify-center text-white text-xs font-semibold cursor-pointer hover:opacity-80"
              style={{
                left: `${startPercent}%`,
                width: `${widthPercent}%`,
                backgroundColor: color
              }}
              onClick={(e) => {
                e.stopPropagation();
                if (window.confirm(`Delete action "${action.label}"?`)) {
                  onActionDelete(idx);
                }
              }}
              title={`${action.label} (${action.start_frame}-${action.end_frame})`}
            >
              {action.label}
            </div>
          );
        })}
        
        {/* Current frame indicator */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-red-600 z-10"
          style={{ left: `${(currentFrame / totalFrames) * 100}%` }}
        >
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-red-600 text-white text-xs px-2 py-1 rounded">
            {currentFrame}
          </div>
        </div>
      </div>
      
      {/* Frame markers */}
      <div className="flex justify-between mt-2 text-xs text-gray-600">
        <span>1</span>
        <span>{Math.floor(totalFrames / 4)}</span>
        <span>{Math.floor(totalFrames / 2)}</span>
        <span>{Math.floor(3 * totalFrames / 4)}</span>
        <span>{totalFrames}</span>
      </div>
      
      {/* Add Action Dialog */}
      {showAddDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-semibold mb-4">Add New Action</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Action Label</label>
                <select
                  value={newAction.label}
                  onChange={(e) => setNewAction({...newAction, label: e.target.value})}
                  className="w-full px-3 py-2 border rounded"
                >
                  <option value="">Select action...</option>
                  <option value="reach">Reach</option>
                  <option value="pick">Pick</option>
                  <option value="place">Place</option>
                  <option value="walk">Walk</option>
                  <option value="idle">Idle</option>
                  <option value="custom">Custom</option>
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Start Frame</label>
                  <input
                    type="number"
                    value={newAction.start_frame}
                    onChange={(e) => setNewAction({...newAction, start_frame: parseInt(e.target.value)})}
                    min="1"
                    max={totalFrames}
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">End Frame</label>
                  <input
                    type="number"
                    value={newAction.end_frame}
                    onChange={(e) => setNewAction({...newAction, end_frame: parseInt(e.target.value)})}
                    min="1"
                    max={totalFrames}
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Confidence</label>
                <input
                  type="range"
                  value={newAction.confidence}
                  onChange={(e) => setNewAction({...newAction, confidence: parseFloat(e.target.value)})}
                  min="0"
                  max="1"
                  step="0.1"
                  className="w-full"
                />
                <span className="text-sm text-gray-600">{(newAction.confidence * 100).toFixed(0)}%</span>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2 mt-6">
              <button
                onClick={() => setShowAddDialog(false)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleAddAction}
                className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
              >
                Add Action
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActionTimeline;