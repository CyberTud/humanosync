import React, { useState } from 'react';
import { Stage, Layer, Circle, Line, Text } from 'react-konva';

const SKELETON_CONNECTIONS = [
  ['nose', 'left_eye'], ['nose', 'right_eye'],
  ['left_eye', 'left_ear'], ['right_eye', 'right_ear'],
  ['left_shoulder', 'right_shoulder'],
  ['left_shoulder', 'left_elbow'], ['left_elbow', 'left_wrist'],
  ['right_shoulder', 'right_elbow'], ['right_elbow', 'right_wrist'],
  ['left_shoulder', 'left_hip'], ['right_shoulder', 'right_hip'],
  ['left_hip', 'right_hip'],
  ['left_hip', 'left_knee'], ['left_knee', 'left_ankle'],
  ['right_hip', 'right_knee'], ['right_knee', 'right_ankle']
];

const PoseOverlay = ({ frameData, frameId, onUpdate }) => {
  const [selectedKeypoint, setSelectedKeypoint] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  if (!frameData || !frameData.keypoints) {
    return null;
  }

  const keypoints = frameData.keypoints;
  const stageWidth = 800;
  const stageHeight = 600;
  const scale = 1;

  const handleKeypointDragStart = (keypointName) => {
    setSelectedKeypoint(keypointName);
    setIsDragging(true);
  };

  const handleKeypointDragEnd = (keypointName, e) => {
    const newX = e.target.x();
    const newY = e.target.y();
    
    const updatedKeypoints = {
      ...keypoints,
      [keypointName]: [newX, newY, keypoints[keypointName][2] || 0]
    };
    
    onUpdate(frameId, updatedKeypoints);
    setIsDragging(false);
  };

  const getConnectionPoints = () => {
    const points = [];
    
    SKELETON_CONNECTIONS.forEach(([start, end]) => {
      if (keypoints[start] && keypoints[end]) {
        points.push({
          points: [
            keypoints[start][0] * scale,
            keypoints[start][1] * scale,
            keypoints[end][0] * scale,
            keypoints[end][1] * scale
          ]
        });
      }
    });
    
    return points;
  };

  return (
    <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
      <Stage
        width={stageWidth}
        height={stageHeight}
        className="pointer-events-auto"
        style={{ position: 'absolute', top: 0, left: 0 }}
      >
        <Layer>
          {/* Draw skeleton connections */}
          {getConnectionPoints().map((connection, idx) => (
            <Line
              key={`connection-${idx}`}
              points={connection.points}
              stroke="#00ff00"
              strokeWidth={2}
              opacity={0.7}
            />
          ))}
          
          {/* Draw keypoints */}
          {Object.entries(keypoints).map(([name, coords]) => {
            const [x, y] = coords;
            const isSelected = selectedKeypoint === name;
            
            return (
              <React.Fragment key={name}>
                <Circle
                  x={x * scale}
                  y={y * scale}
                  radius={isSelected ? 8 : 6}
                  fill={isSelected ? "#ff0000" : "#00ff00"}
                  stroke="#ffffff"
                  strokeWidth={2}
                  draggable
                  onDragStart={() => handleKeypointDragStart(name)}
                  onDragEnd={(e) => handleKeypointDragEnd(name, e)}
                  onMouseEnter={(e) => {
                    const container = e.target.getStage().container();
                    container.style.cursor = 'pointer';
                  }}
                  onMouseLeave={(e) => {
                    const container = e.target.getStage().container();
                    container.style.cursor = 'default';
                  }}
                />
                {isSelected && (
                  <Text
                    x={x * scale + 10}
                    y={y * scale - 10}
                    text={name}
                    fontSize={12}
                    fill="#ffffff"
                    stroke="#000000"
                    strokeWidth={0.5}
                  />
                )}
              </React.Fragment>
            );
          })}
        </Layer>
      </Stage>
      
      {/* Info overlay */}
      {isDragging && (
        <div className="absolute top-4 right-4 bg-black/70 text-white p-2 rounded text-sm">
          Dragging: {selectedKeypoint}
        </div>
      )}
    </div>
  );
};

export default PoseOverlay;