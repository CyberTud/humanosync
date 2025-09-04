import cv2
import numpy as np
import json
from pathlib import Path
from typing import Dict, List, Any
from ultralytics import YOLO

class ObjectDetector:
    def __init__(self, model_name: str = "yolov8m.pt"):
        """Initialize YOLOv8 model for object detection"""
        self.model = YOLO(model_name)
        self.confidence_threshold = 0.5
    
    def extract_from_video(self, video_path: str, output_dir: Path) -> Dict[str, List]:
        """Extract object detections from video frames"""
        cap = cv2.VideoCapture(video_path)
        objects_data = {}
        frame_count = 0
        
        try:
            while cap.isOpened():
                ret, frame = cap.read()
                if not ret:
                    break
                
                frame_count += 1
                frame_id = f"frame_{frame_count:03d}"
                
                # Run YOLOv8 detection
                results = self.model(frame, conf=self.confidence_threshold)
                
                frame_objects = []
                for r in results:
                    if r.boxes is not None:
                        boxes = r.boxes.xyxy.cpu().numpy()
                        classes = r.boxes.cls.cpu().numpy()
                        confidences = r.boxes.conf.cpu().numpy()
                        
                        for box, cls_id, conf in zip(boxes, classes, confidences):
                            x1, y1, x2, y2 = box
                            label = self.model.names[int(cls_id)]
                            
                            frame_objects.append({
                                "label": label,
                                "bbox": [float(x1), float(y1), float(x2), float(y2)],
                                "confidence": float(conf)
                            })
                
                objects_data[frame_id] = frame_objects
                
                # Process every 10th frame for speed in MVP
                if frame_count % 10 == 0:
                    print(f"Processed frame {frame_count}")
        
        finally:
            cap.release()
        
        # Save to file
        objects_path = output_dir / "objects.json"
        with open(objects_path, 'w') as f:
            json.dump(objects_data, f, indent=2)
        
        return objects_data
    
    def extract_from_frame(self, frame: np.ndarray) -> List[Dict]:
        """Extract objects from a single frame"""
        results = self.model(frame, conf=self.confidence_threshold)
        
        frame_objects = []
        for r in results:
            if r.boxes is not None:
                boxes = r.boxes.xyxy.cpu().numpy()
                classes = r.boxes.cls.cpu().numpy()
                confidences = r.boxes.conf.cpu().numpy()
                
                for box, cls_id, conf in zip(boxes, classes, confidences):
                    x1, y1, x2, y2 = box
                    label = self.model.names[int(cls_id)]
                    
                    frame_objects.append({
                        "label": label,
                        "bbox": [float(x1), float(y1), float(x2), float(y2)],
                        "confidence": float(conf)
                    })
        
        return frame_objects