import numpy as np
import json
from pathlib import Path
from typing import Dict, List, Any

class ObjectDetector:
    def __init__(self, model_name: str = "yolov8m.pt"):
        """Mock object detector for demo purposes"""
        self.confidence_threshold = 0.5
        self.mock_objects = ['person', 'cup', 'table', 'chair', 'laptop', 'bottle', 'book']
    
    def extract_from_video(self, video_path: str, output_dir: Path) -> Dict[str, List]:
        """Generate mock object detections"""
        objects_data = {}
        
        # Generate 60 frames of mock data
        for frame_num in range(1, 61):
            frame_id = f"frame_{frame_num:03d}"
            frame_objects = []
            
            # Generate 2-4 random objects per frame
            num_objects = np.random.randint(2, 5)
            for _ in range(num_objects):
                label = np.random.choice(self.mock_objects)
                x1 = np.random.uniform(50, 400)
                y1 = np.random.uniform(50, 300)
                x2 = x1 + np.random.uniform(50, 150)
                y2 = y1 + np.random.uniform(50, 150)
                
                frame_objects.append({
                    "label": label,
                    "bbox": [float(x1), float(y1), float(x2), float(y2)],
                    "confidence": float(0.7 + np.random.uniform(0, 0.3))
                })
            
            objects_data[frame_id] = frame_objects
        
        # Save to file
        objects_path = output_dir / "objects.json"
        with open(objects_path, 'w') as f:
            json.dump(objects_data, f, indent=2)
        
        return objects_data
    
    def extract_from_frame(self, frame: np.ndarray) -> List[Dict]:
        """Generate mock objects from a single frame"""
        frame_objects = []
        
        num_objects = np.random.randint(1, 4)
        for _ in range(num_objects):
            label = np.random.choice(self.mock_objects)
            x1 = np.random.uniform(50, 400)
            y1 = np.random.uniform(50, 300)
            x2 = x1 + np.random.uniform(50, 150)
            y2 = y1 + np.random.uniform(50, 150)
            
            frame_objects.append({
                "label": label,
                "bbox": [float(x1), float(y1), float(x2), float(y2)],
                "confidence": float(0.7 + np.random.uniform(0, 0.3))
            })
        
        return frame_objects