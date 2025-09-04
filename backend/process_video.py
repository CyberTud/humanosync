#!/usr/bin/env python3
"""
Video Processing Pipeline for Robot Training Data Extraction
=============================================================
Processes video files to extract pose, object, and action data for robot training.

Usage:
    python process_video.py --video path/to/video.mp4 [--output output_dir]

Author: HumanoSync
Date: 2025
"""

import os
import sys
import json
import argparse
import logging
from pathlib import Path
from typing import Dict, List, Tuple, Optional, Any
import numpy as np
import cv2

# ML Libraries
try:
    import mediapipe as mp
    MEDIAPIPE_AVAILABLE = True
except ImportError:
    MEDIAPIPE_AVAILABLE = False
    print("Warning: MediaPipe not available, using mock pose estimation")

try:
    from ultralytics import YOLO
    YOLO_AVAILABLE = True
except ImportError:
    YOLO_AVAILABLE = False
    print("Warning: YOLOv8 not available, using mock object detection")

# Setup logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


class PoseExtractor:
    """Extract pose keypoints from video frames using MediaPipe."""
    
    def __init__(self):
        """Initialize MediaPipe pose estimation model."""
        if MEDIAPIPE_AVAILABLE:
            self.mp_pose = mp.solutions.pose
            self.pose = self.mp_pose.Pose(
                static_image_mode=False,
                model_complexity=2,
                min_detection_confidence=0.5,
                min_tracking_confidence=0.5
            )
            self.mp_drawing = mp.solutions.drawing_utils
        else:
            self.pose = None
            
    def extract_keypoints(self, frame: np.ndarray) -> Dict[str, Any]:
        """
        Extract pose keypoints from a single frame.
        
        Args:
            frame: Input video frame as numpy array
            
        Returns:
            Dictionary containing keypoints and confidence scores
        """
        if MEDIAPIPE_AVAILABLE and self.pose:
            # Convert BGR to RGB
            rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            results = self.pose.process(rgb_frame)
            
            if results.pose_landmarks:
                keypoints = {}
                confidences = []
                
                # MediaPipe provides 33 pose landmarks
                landmark_names = [
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
                
                for idx, landmark in enumerate(results.pose_landmarks.landmark):
                    if idx < len(landmark_names):
                        keypoints[landmark_names[idx]] = [
                            landmark.x * frame.shape[1],  # Convert to pixel coordinates
                            landmark.y * frame.shape[0],
                            landmark.z  # Depth coordinate
                        ]
                        confidences.append(landmark.visibility)
                
                return {
                    'keypoints': keypoints,
                    'confidence': np.mean(confidences) if confidences else 0.0
                }
        
        # Mock data if MediaPipe not available
        return self._mock_keypoints(frame)
    
    def _mock_keypoints(self, frame: np.ndarray) -> Dict[str, Any]:
        """Generate mock keypoints for testing."""
        h, w = frame.shape[:2]
        center_x, center_y = w // 2, h // 2
        
        keypoints = {
            'nose': [center_x, center_y - 150, 0],
            'left_shoulder': [center_x - 50, center_y - 100, 0],
            'right_shoulder': [center_x + 50, center_y - 100, 0],
            'left_elbow': [center_x - 80, center_y - 50, 0],
            'right_elbow': [center_x + 80, center_y - 50, 0],
            'left_wrist': [center_x - 100, center_y, 0],
            'right_wrist': [center_x + 100, center_y, 0],
            'left_hip': [center_x - 30, center_y + 50, 0],
            'right_hip': [center_x + 30, center_y + 50, 0],
            'left_knee': [center_x - 30, center_y + 120, 0],
            'right_knee': [center_x + 30, center_y + 120, 0],
            'left_ankle': [center_x - 30, center_y + 180, 0],
            'right_ankle': [center_x + 30, center_y + 180, 0]
        }
        
        return {
            'keypoints': keypoints,
            'confidence': 0.95
        }
    
    def close(self):
        """Clean up resources."""
        if MEDIAPIPE_AVAILABLE and self.pose:
            self.pose.close()


class ObjectDetector:
    """Detect objects in video frames using YOLOv8."""
    
    def __init__(self):
        """Initialize YOLOv8 object detection model."""
        if YOLO_AVAILABLE:
            try:
                # Load YOLOv8 model (will download if not present)
                self.model = YOLO('yolov8n.pt')  # Using nano model for speed
                logger.info("YOLOv8 model loaded successfully")
            except Exception as e:
                logger.warning(f"Failed to load YOLOv8: {e}")
                self.model = None
        else:
            self.model = None
    
    def detect_objects(self, frame: np.ndarray) -> List[Dict[str, Any]]:
        """
        Detect objects in a single frame.
        
        Args:
            frame: Input video frame as numpy array
            
        Returns:
            List of detected objects with bounding boxes and labels
        """
        if YOLO_AVAILABLE and self.model:
            results = self.model(frame, verbose=False)
            detections = []
            
            for r in results:
                if r.boxes is not None:
                    for box in r.boxes:
                        x1, y1, x2, y2 = box.xyxy[0].cpu().numpy()
                        confidence = float(box.conf[0])
                        class_id = int(box.cls[0])
                        
                        # Get class name from model
                        class_name = self.model.names[class_id]
                        
                        detections.append({
                            'label': class_name,
                            'bbox': [float(x1), float(y1), float(x2), float(y2)],
                            'confidence': confidence
                        })
            
            return detections
        
        # Mock data if YOLO not available
        return self._mock_detections(frame)
    
    def _mock_detections(self, frame: np.ndarray) -> List[Dict[str, Any]]:
        """Generate mock object detections for testing."""
        h, w = frame.shape[:2]
        
        detections = [
            {
                'label': 'person',
                'bbox': [w*0.3, h*0.2, w*0.7, h*0.8],
                'confidence': 0.92
            },
            {
                'label': 'cup',
                'bbox': [w*0.1, h*0.6, w*0.2, h*0.75],
                'confidence': 0.88
            }
        ]
        
        return detections


class ActionRecognizer:
    """Recognize actions from pose sequences."""
    
    def __init__(self):
        """Initialize action recognition."""
        self.pose_buffer = []
        self.buffer_size = 30  # 1 second at 30fps
        self.actions_detected = []
        
    def add_pose(self, frame_num: int, keypoints: Dict[str, List[float]]):
        """
        Add pose to buffer for action recognition.
        
        Args:
            frame_num: Current frame number
            keypoints: Pose keypoints for the frame
        """
        self.pose_buffer.append({
            'frame': frame_num,
            'keypoints': keypoints
        })
        
        # Keep only recent poses
        if len(self.pose_buffer) > self.buffer_size:
            self.pose_buffer.pop(0)
    
    def recognize_action(self) -> Optional[str]:
        """
        Recognize action from current pose buffer.
        
        Returns:
            Detected action label or None
        """
        if len(self.pose_buffer) < 10:
            return None
        
        # Extract features from pose sequence
        action = self._classify_action_from_poses()
        return action
    
    def _classify_action_from_poses(self) -> str:
        """
        Classify action based on pose sequence analysis.
        
        This is a rule-based classifier that analyzes pose movements.
        In production, this could be replaced with a trained model.
        """
        # Analyze movement patterns
        movements = self._analyze_movements()
        
        # Rule-based action classification
        if movements['arm_raised']:
            return 'wave'
        elif movements['walking']:
            return 'walk'
        elif movements['reaching']:
            return 'reach'
        elif movements['picking']:
            return 'pick'
        elif movements['sitting']:
            return 'sit'
        else:
            return 'stand'
    
    def _analyze_movements(self) -> Dict[str, bool]:
        """Analyze movement patterns from pose buffer."""
        if not self.pose_buffer:
            return {'arm_raised': False, 'walking': False, 'reaching': False, 
                   'picking': False, 'sitting': False}
        
        # Get first and last poses for comparison
        first_pose = self.pose_buffer[0]['keypoints']
        last_pose = self.pose_buffer[-1]['keypoints']
        
        movements = {}
        
        # Check if arm is raised (waving)
        if 'right_wrist' in last_pose and 'right_shoulder' in last_pose:
            wrist_y = last_pose['right_wrist'][1]
            shoulder_y = last_pose['right_shoulder'][1]
            movements['arm_raised'] = wrist_y < shoulder_y - 50
        else:
            movements['arm_raised'] = False
        
        # Check for walking (hip movement)
        if 'left_hip' in first_pose and 'left_hip' in last_pose:
            hip_movement = abs(first_pose['left_hip'][0] - last_pose['left_hip'][0])
            movements['walking'] = hip_movement > 30
        else:
            movements['walking'] = False
        
        # Check for reaching (arm extension)
        if 'right_wrist' in last_pose and 'right_shoulder' in last_pose:
            wrist_x = last_pose['right_wrist'][0]
            shoulder_x = last_pose['right_shoulder'][0]
            movements['reaching'] = abs(wrist_x - shoulder_x) > 100
        else:
            movements['reaching'] = False
        
        # Check for picking (hand lowered)
        if 'right_wrist' in last_pose and 'right_hip' in last_pose:
            wrist_y = last_pose['right_wrist'][1]
            hip_y = last_pose['right_hip'][1]
            movements['picking'] = wrist_y > hip_y + 50
        else:
            movements['picking'] = False
        
        # Check for sitting (hip lowered)
        if 'left_hip' in first_pose and 'left_hip' in last_pose:
            hip_drop = last_pose['left_hip'][1] - first_pose['left_hip'][1]
            movements['sitting'] = hip_drop > 50
        else:
            movements['sitting'] = False
        
        return movements
    
    def get_action_segments(self) -> List[Dict[str, Any]]:
        """
        Get detected action segments.
        
        Returns:
            List of action segments with start/end frames
        """
        # Consolidate actions into segments
        segments = []
        current_action = None
        start_frame = 0
        
        for i, action_info in enumerate(self.actions_detected):
            if action_info['action'] != current_action:
                if current_action:
                    segments.append({
                        'label': current_action,
                        'start_frame': start_frame,
                        'end_frame': action_info['frame'] - 1,
                        'confidence': 0.85
                    })
                current_action = action_info['action']
                start_frame = action_info['frame']
        
        # Add final segment
        if current_action and self.actions_detected:
            segments.append({
                'label': current_action,
                'start_frame': start_frame,
                'end_frame': self.actions_detected[-1]['frame'],
                'confidence': 0.85
            })
        
        return segments


class VideoProcessor:
    """Main video processing pipeline."""
    
    def __init__(self, video_path: str, output_dir: str = 'output'):
        """
        Initialize video processor.
        
        Args:
            video_path: Path to input video file
            output_dir: Directory to save output files
        """
        self.video_path = video_path
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(exist_ok=True)
        
        # Initialize components
        self.pose_extractor = PoseExtractor()
        self.object_detector = ObjectDetector()
        self.action_recognizer = ActionRecognizer()
        
        # Data storage
        self.pose_data = {}
        self.object_data = {}
        self.action_data = []
        
    def process(self) -> bool:
        """
        Process the entire video.
        
        Returns:
            True if processing successful, False otherwise
        """
        # Open video
        cap = cv2.VideoCapture(self.video_path)
        if not cap.isOpened():
            logger.error(f"Failed to open video: {self.video_path}")
            return False
        
        # Get video properties
        fps = cap.get(cv2.CAP_PROP_FPS)
        total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        
        logger.info(f"Processing video: {self.video_path}")
        logger.info(f"FPS: {fps}, Total frames: {total_frames}")
        
        frame_num = 0
        
        try:
            while True:
                ret, frame = cap.read()
                if not ret:
                    break
                
                # Process frame
                self._process_frame(frame, frame_num)
                
                # Log progress
                if frame_num % 30 == 0:
                    progress = (frame_num / total_frames) * 100
                    logger.info(f"Processing: {progress:.1f}% complete (frame {frame_num}/{total_frames})")
                
                frame_num += 1
                
                # Limit processing for very long videos (demo purposes)
                if frame_num >= 300:  # Process first 10 seconds at 30fps
                    logger.info("Limiting to first 300 frames for demo")
                    break
            
            # Get final action segments
            self.action_data = self.action_recognizer.get_action_segments()
            
            # Save results
            self._save_results()
            
            logger.info("Processing complete!")
            return True
            
        except Exception as e:
            logger.error(f"Error during processing: {e}")
            return False
            
        finally:
            cap.release()
            self.pose_extractor.close()
    
    def _process_frame(self, frame: np.ndarray, frame_num: int):
        """
        Process a single video frame.
        
        Args:
            frame: Video frame as numpy array
            frame_num: Current frame number
        """
        frame_key = f"frame_{frame_num:03d}"
        
        # Extract pose
        pose_result = self.pose_extractor.extract_keypoints(frame)
        self.pose_data[frame_key] = pose_result
        
        # Add pose to action recognizer
        if pose_result['keypoints']:
            self.action_recognizer.add_pose(frame_num, pose_result['keypoints'])
            
            # Recognize action
            action = self.action_recognizer.recognize_action()
            if action:
                self.action_recognizer.actions_detected.append({
                    'frame': frame_num,
                    'action': action
                })
        
        # Detect objects (sample every 5 frames to save computation)
        if frame_num % 5 == 0:
            objects = self.object_detector.detect_objects(frame)
            self.object_data[frame_key] = objects
    
    def _save_results(self):
        """Save processing results to JSON files."""
        # Save pose data
        pose_path = self.output_dir / 'pose.json'
        with open(pose_path, 'w') as f:
            json.dump(self.pose_data, f, indent=2)
        logger.info(f"Saved pose data to {pose_path}")
        
        # Save object data
        objects_path = self.output_dir / 'objects.json'
        with open(objects_path, 'w') as f:
            json.dump(self.object_data, f, indent=2)
        logger.info(f"Saved object data to {objects_path}")
        
        # Save action data
        actions_path = self.output_dir / 'actions.json'
        with open(actions_path, 'w') as f:
            json.dump(self.action_data, f, indent=2)
        logger.info(f"Saved action data to {actions_path}")
        
        # Save summary
        summary = {
            'video_path': str(self.video_path),
            'total_frames_processed': len(self.pose_data),
            'total_objects_detected': sum(len(objs) for objs in self.object_data.values()),
            'total_actions_detected': len(self.action_data),
            'output_files': {
                'pose': str(pose_path),
                'objects': str(objects_path),
                'actions': str(actions_path)
            }
        }
        
        summary_path = self.output_dir / 'summary.json'
        with open(summary_path, 'w') as f:
            json.dump(summary, f, indent=2)
        logger.info(f"Saved processing summary to {summary_path}")


def main():
    """Main entry point for the script."""
    parser = argparse.ArgumentParser(
        description='Process video to extract pose, object, and action data for robot training.'
    )
    parser.add_argument(
        '--video',
        type=str,
        required=True,
        help='Path to input video file'
    )
    parser.add_argument(
        '--output',
        type=str,
        default='output',
        help='Output directory for JSON files (default: output)'
    )
    parser.add_argument(
        '--verbose',
        action='store_true',
        help='Enable verbose logging'
    )
    
    args = parser.parse_args()
    
    # Set logging level
    if args.verbose:
        logging.getLogger().setLevel(logging.DEBUG)
    
    # Check if video file exists
    if not os.path.exists(args.video):
        logger.error(f"Video file not found: {args.video}")
        sys.exit(1)
    
    # Process video
    processor = VideoProcessor(args.video, args.output)
    success = processor.process()
    
    if success:
        logger.info(f"✅ Processing complete! Check '{args.output}' directory for results.")
        sys.exit(0)
    else:
        logger.error("❌ Processing failed!")
        sys.exit(1)


if __name__ == '__main__':
    main()