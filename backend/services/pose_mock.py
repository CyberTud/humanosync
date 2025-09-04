import numpy as np
import json
from pathlib import Path
from typing import Dict, List, Any

class PoseExtractor:
    def __init__(self):
        self.landmark_names = [
            'nose', 'left_eye_inner', 'left_eye', 'left_eye_outer',
            'right_eye_inner', 'right_eye', 'right_eye_outer', 
            'left_ear', 'right_ear', 'mouth_left', 'mouth_right',
            'left_shoulder', 'right_shoulder', 'left_elbow', 'right_elbow',
            'left_wrist', 'right_wrist', 'left_pinky', 'right_pinky',
            'left_index', 'right_index', 'left_thumb', 'right_thumb',
            'left_hip', 'right_hip', 'left_knee', 'right_knee',
            'left_ankle', 'right_ankle', 'left_heel', 'right_heel',
            'left_foot_index', 'right_foot_index'
        ]
    
    def extract_from_video(self, video_path: str, output_dir: Path) -> Dict[str, Any]:
        """Generate mock pose data for demo purposes"""
        pose_data = {}
        
        # Generate 60 frames of mock data
        for frame_num in range(1, 61):
            frame_id = f"frame_{frame_num:03d}"
            keypoints = {}
            
            # Generate mock keypoints with some variation
            base_x = 320 + np.sin(frame_num * 0.1) * 20
            base_y = 240
            
            for i, name in enumerate(self.landmark_names):
                x = base_x + np.random.uniform(-50, 50)
                y = base_y + (i * 10) + np.random.uniform(-5, 5)
                z = np.random.uniform(-10, 10)
                keypoints[name] = [float(x), float(y), float(z)]
            
            pose_data[frame_id] = {
                "keypoints": keypoints,
                "confidence": float(0.85 + np.random.uniform(0, 0.15))
            }
        
        # Save to file
        pose_path = output_dir / "pose.json"
        with open(pose_path, 'w') as f:
            json.dump(pose_data, f, indent=2)
        
        return pose_data
    
    def extract_from_frame(self, frame: np.ndarray) -> Dict[str, Any]:
        """Generate mock pose from a single frame"""
        keypoints = {}
        
        for name in self.landmark_names:
            x = np.random.uniform(100, 540)
            y = np.random.uniform(100, 380)
            z = np.random.uniform(-10, 10)
            keypoints[name] = [float(x), float(y), float(z)]
        
        return {
            "keypoints": keypoints,
            "confidence": float(0.85 + np.random.uniform(0, 0.15))
        }