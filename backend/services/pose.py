try:
    import cv2
    import mediapipe as mp
    MEDIAPIPE_AVAILABLE = True
except ImportError:
    MEDIAPIPE_AVAILABLE = False
import numpy as np
import json
from pathlib import Path
from typing import Dict, List, Any

class PoseExtractor:
    def __init__(self):
        if MEDIAPIPE_AVAILABLE:
            self.mp_pose = mp.solutions.pose
            self.pose = self.mp_pose.Pose(
                static_image_mode=False,
                model_complexity=2,
                smooth_landmarks=True,
                enable_segmentation=False,
                min_detection_confidence=0.5,
                min_tracking_confidence=0.5
            )
            self.mp_drawing = mp.solutions.drawing_utils
        else:
            self.pose = None
        
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
        """Extract pose keypoints from video frames"""
        cap = cv2.VideoCapture(video_path)
        pose_data = {}
        frame_count = 0
        
        try:
            while cap.isOpened():
                ret, frame = cap.read()
                if not ret:
                    break
                
                frame_count += 1
                frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
                results = self.pose.process(frame_rgb)
                
                if results.pose_landmarks:
                    frame_id = f"frame_{frame_count:03d}"
                    keypoints = {}
                    confidences = []
                    
                    height, width = frame.shape[:2]
                    
                    for idx, landmark in enumerate(results.pose_landmarks.landmark):
                        if idx < len(self.landmark_names):
                            keypoint_name = self.landmark_names[idx]
                            x = landmark.x * width
                            y = landmark.y * height
                            z = landmark.z * width  # Normalized by width for consistency
                            keypoints[keypoint_name] = [x, y, z]
                            confidences.append(landmark.visibility)
                    
                    pose_data[frame_id] = {
                        "keypoints": keypoints,
                        "confidence": float(np.mean(confidences))
                    }
        finally:
            cap.release()
        
        # Save to file
        pose_path = output_dir / "pose.json"
        with open(pose_path, 'w') as f:
            json.dump(pose_data, f, indent=2)
        
        return pose_data
    
    def extract_from_frame(self, frame: np.ndarray) -> Dict[str, Any]:
        """Extract pose from a single frame"""
        frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = self.pose.process(frame_rgb)
        
        if not results.pose_landmarks:
            return None
        
        keypoints = {}
        confidences = []
        height, width = frame.shape[:2]
        
        for idx, landmark in enumerate(results.pose_landmarks.landmark):
            if idx < len(self.landmark_names):
                keypoint_name = self.landmark_names[idx]
                x = landmark.x * width
                y = landmark.y * height
                z = landmark.z * width
                keypoints[keypoint_name] = [x, y, z]
                confidences.append(landmark.visibility)
        
        return {
            "keypoints": keypoints,
            "confidence": float(np.mean(confidences))
        }