import React, { useState } from 'react';
import { Stage, Layer, Rect, Text, Transformer } from 'react-konva';

const BoundingBoxEditor = ({ objects, frameId, onUpdate }) => {
  const [selectedBox, setSelectedBox] = useState(null);
  const [isTransforming, setIsTransforming] = useState(false);
  
  const stageWidth = 800;
  const stageHeight = 600;

  const handleBoxSelect = (index) => {
    setSelectedBox(index);
  };

  const handleBoxDragEnd = (index, e) => {
    const node = e.target;
    const updatedObjects = [...objects];
    
    updatedObjects[index] = {
      ...updatedObjects[index],
      bbox: [
        node.x(),
        node.y(),
        node.x() + node.width(),
        node.y() + node.height()
      ]
    };
    
    onUpdate(frameId, updatedObjects);
  };

  const handleTransformEnd = (index, e) => {
    const node = e.target;
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();
    
    node.scaleX(1);
    node.scaleY(1);
    
    const updatedObjects = [...objects];
    updatedObjects[index] = {
      ...updatedObjects[index],
      bbox: [
        node.x(),
        node.y(),
        node.x() + node.width() * scaleX,
        node.y() + node.height() * scaleY
      ]
    };
    
    onUpdate(frameId, updatedObjects);
    setIsTransforming(false);
  };

  const handleAddBox = () => {
    const newBox = {
      label: 'new_object',
      bbox: [100, 100, 200, 200],
      confidence: 0.9
    };
    
    const updatedObjects = [...objects, newBox];
    onUpdate(frameId, updatedObjects);
    setSelectedBox(updatedObjects.length - 1);
  };

  const handleDeleteBox = () => {
    if (selectedBox !== null) {
      const updatedObjects = objects.filter((_, idx) => idx !== selectedBox);
      onUpdate(frameId, updatedObjects);
      setSelectedBox(null);
    }
  };

  const handleLabelChange = (index, newLabel) => {
    const updatedObjects = [...objects];
    updatedObjects[index].label = newLabel;
    onUpdate(frameId, updatedObjects);
  };

  const getColorForLabel = (label) => {
    const colors = {
      'person': '#3B82F6',
      'cup': '#10B981',
      'table': '#8B5CF6',
      'chair': '#F59E0B',
      'laptop': '#EF4444',
      'default': '#6B7280'
    };
    return colors[label] || colors['default'];
  };

  return (
    <div className="absolute top-0 left-0 w-full h-full">
      <Stage
        width={stageWidth}
        height={stageHeight}
        className="pointer-events-auto"
        style={{ position: 'absolute', top: 0, left: 0 }}
      >
        <Layer>
          {objects.map((obj, index) => {
            const [x1, y1, x2, y2] = obj.bbox;
            const width = x2 - x1;
            const height = y2 - y1;
            const isSelected = selectedBox === index;
            const color = getColorForLabel(obj.label);
            
            return (
              <React.Fragment key={index}>
                <Rect
                  x={x1}
                  y={y1}
                  width={width}
                  height={height}
                  fill={color}
                  opacity={0.2}
                  stroke={color}
                  strokeWidth={isSelected ? 3 : 2}
                  draggable
                  onClick={() => handleBoxSelect(index)}
                  onDragEnd={(e) => handleBoxDragEnd(index, e)}
                  onTransformStart={() => setIsTransforming(true)}
                  onTransformEnd={(e) => handleTransformEnd(index, e)}
                />
                
                {/* Label background */}
                <Rect
                  x={x1}
                  y={y1 - 20}
                  width={obj.label.length * 8 + 10}
                  height={20}
                  fill={color}
                  opacity={0.8}
                />
                
                {/* Label text */}
                <Text
                  x={x1 + 5}
                  y={y1 - 17}
                  text={obj.label}
                  fontSize={14}
                  fill="#ffffff"
                  fontStyle="bold"
                />
                
                {/* Confidence score */}
                <Text
                  x={x1 + 5}
                  y={y1 + 5}
                  text={`${(obj.confidence * 100).toFixed(0)}%`}
                  fontSize={12}
                  fill={color}
                  fontStyle="bold"
                />
                
                {isSelected && (
                  <Transformer
                    nodes={[]}
                    boundBoxFunc={(oldBox, newBox) => {
                      if (newBox.width < 20 || newBox.height < 20) {
                        return oldBox;
                      }
                      return newBox;
                    }}
                  />
                )}
              </React.Fragment>
            );
          })}
        </Layer>
      </Stage>
      
      {/* Controls overlay */}
      <div className="absolute top-4 right-4 bg-white/90 p-3 rounded shadow-lg">
        <div className="space-y-2">
          <button
            onClick={handleAddBox}
            className="w-full px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
          >
            Add Box
          </button>
          
          {selectedBox !== null && (
            <>
              <button
                onClick={handleDeleteBox}
                className="w-full px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
              >
                Delete Selected
              </button>
              
              <input
                type="text"
                value={objects[selectedBox]?.label || ''}
                onChange={(e) => handleLabelChange(selectedBox, e.target.value)}
                className="w-full px-2 py-1 border rounded text-sm"
                placeholder="Label"
              />
            </>
          )}
        </div>
        
        {isTransforming && (
          <div className="mt-2 text-xs text-gray-600">
            Resize the bounding box
          </div>
        )}
      </div>
    </div>
  );
};

export default BoundingBoxEditor;