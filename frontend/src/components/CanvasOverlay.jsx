import React, { forwardRef, useEffect, useRef, useState } from 'react';

const SKELETON_CONNECTIONS = [
  ['nose', 'left_eye'],
  ['nose', 'right_eye'],
  ['left_eye', 'left_ear'],
  ['right_eye', 'right_ear'],
  ['nose', 'left_shoulder'],
  ['nose', 'right_shoulder'],
  ['left_shoulder', 'right_shoulder'],
  ['left_shoulder', 'left_elbow'],
  ['left_elbow', 'left_wrist'],
  ['right_shoulder', 'right_elbow'],
  ['right_elbow', 'right_wrist'],
  ['left_shoulder', 'left_hip'],
  ['right_shoulder', 'right_hip'],
  ['left_hip', 'right_hip'],
  ['left_hip', 'left_knee'],
  ['left_knee', 'left_ankle'],
  ['right_hip', 'right_knee'],
  ['right_knee', 'right_ankle']
];

const CanvasOverlay = forwardRef(({ frameData, selectedTool, currentFrame, onAnnotationEdit }, ref) => {
  const canvasRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragTarget, setDragTarget] = useState(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      const parent = canvas.parentElement;
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;
      
      const videoWidth = 640;
      const videoHeight = 480;
      const scaleX = canvas.width / videoWidth;
      const scaleY = canvas.height / videoHeight;
      setScale(Math.min(scaleX, scaleY));
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.scale(scale, scale);
      
      if (selectedTool === 'pose' && frameData?.pose) {
        drawSkeleton(ctx, frameData.pose.keypoints);
      }
      
      if (selectedTool === 'objects' && frameData?.objects) {
        drawObjects(ctx, frameData.objects);
      }
      
      if (selectedTool === 'actions' && frameData?.actions) {
        drawActionIndicator(ctx, frameData.actions, currentFrame);
      }
      
      ctx.restore();
    }
  }, [frameData, selectedTool, currentFrame, scale]);

  const drawSkeleton = (ctx, keypoints) => {
    ctx.strokeStyle = '#00ff00';
    ctx.lineWidth = 2;
    
    SKELETON_CONNECTIONS.forEach(([start, end]) => {
      if (keypoints[start] && keypoints[end]) {
        ctx.beginPath();
        ctx.moveTo(keypoints[start][0], keypoints[start][1]);
        ctx.lineTo(keypoints[end][0], keypoints[end][1]);
        ctx.stroke();
      }
    });
    
    ctx.fillStyle = '#ff0000';
    Object.entries(keypoints).forEach(([name, [x, y]]) => {
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, 2 * Math.PI);
      ctx.fill();
      
      ctx.fillStyle = 'white';
      ctx.font = '10px Arial';
      ctx.fillText(name, x + 7, y - 7);
      ctx.fillStyle = '#ff0000';
    });
  };

  const drawObjects = (ctx, objects) => {
    objects.forEach((obj) => {
      const [x1, y1, x2, y2] = obj.bbox;
      
      ctx.strokeStyle = '#00ffff';
      ctx.lineWidth = 2;
      ctx.strokeRect(x1, y1, x2 - x1, y2 - y1);
      
      ctx.fillStyle = 'rgba(0, 255, 255, 0.2)';
      ctx.fillRect(x1, y1, x2 - x1, y2 - y1);
      
      ctx.fillStyle = '#00ffff';
      ctx.fillRect(x1, y1 - 20, obj.label.length * 8 + 10, 20);
      
      ctx.fillStyle = 'black';
      ctx.font = 'bold 12px Arial';
      ctx.fillText(obj.label, x1 + 5, y1 - 5);
    });
  };

  const drawActionIndicator = (ctx, actions, frame) => {
    const currentAction = actions.find(
      action => frame >= action.start_frame && frame <= action.end_frame
    );
    
    if (currentAction) {
      ctx.fillStyle = 'rgba(255, 255, 0, 0.3)';
      ctx.fillRect(10, 10, 150, 40);
      
      ctx.fillStyle = 'black';
      ctx.font = 'bold 16px Arial';
      ctx.fillText(`Action: ${currentAction.label}`, 20, 35);
    }
  };

  const handleMouseDown = (e) => {
    if (selectedTool === 'pose' && frameData?.pose) {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / scale;
      const y = (e.clientY - rect.top) / scale;
      
      const keypoints = frameData.pose.keypoints;
      const clickedKeypoint = Object.entries(keypoints).find(([name, [kx, ky]]) => {
        const distance = Math.sqrt((x - kx) ** 2 + (y - ky) ** 2);
        return distance < 10;
      });
      
      if (clickedKeypoint) {
        setIsDragging(true);
        setDragTarget(clickedKeypoint[0]);
      }
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging && dragTarget && frameData?.pose) {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / scale;
      const y = (e.clientY - rect.top) / scale;
      
      const frameId = `frame_${String(currentFrame).padStart(3, '0')}`;
      const updatedPose = {
        ...frameData.pose,
        keypoints: {
          ...frameData.pose.keypoints,
          [dragTarget]: [x, y]
        }
      };
      
      onAnnotationEdit('pose', frameId, updatedPose);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDragTarget(null);
  };

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-full pointer-events-auto"
      style={{ pointerEvents: selectedTool === 'pose' ? 'auto' : 'none' }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    />
  );
});

CanvasOverlay.displayName = 'CanvasOverlay';

export default CanvasOverlay;