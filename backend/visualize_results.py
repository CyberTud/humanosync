#!/usr/bin/env python3
"""
Visualize ML processing results from JSON output files
"""

import json
import cv2
import numpy as np
from pathlib import Path
import argparse

def load_json_file(file_path):
    """Load JSON data from file"""
    with open(file_path, 'r') as f:
        return json.load(f)

def draw_pose_keypoints(frame, pose_data, frame_num):
    """Draw pose keypoints on frame"""
    frame_key = f"frame_{frame_num:03d}"
    if frame_key not in pose_data:
        return frame
    
    keypoints_dict = pose_data[frame_key].get('keypoints', {})
    
    # Convert keypoints dict to list for drawing
    keypoint_coords = {}
    
    # Draw keypoints
    for name, coords in keypoints_dict.items():
        if len(coords) >= 2:
            x = int(coords[0])
            y = int(coords[1])
            keypoint_coords[name] = (x, y)
            
            # Draw circle for keypoint
            cv2.circle(frame, (x, y), 5, (0, 255, 0), -1)
            
            # Draw label (shortened to first 5 chars)
            label = name.replace('_', ' ')[:5]
            cv2.putText(frame, label, (x+5, y-5), 
                       cv2.FONT_HERSHEY_SIMPLEX, 0.3, (0, 255, 0), 1)
    
    # Draw connections between keypoints
    connections = [
        ("left_shoulder", "right_shoulder"),
        ("left_shoulder", "left_elbow"),
        ("left_elbow", "left_wrist"),
        ("right_shoulder", "right_elbow"),
        ("right_elbow", "right_wrist"),
        ("left_shoulder", "left_hip"),
        ("right_shoulder", "right_hip"),
        ("left_hip", "right_hip"),
        ("left_hip", "left_knee"),
        ("left_knee", "left_ankle"),
        ("right_hip", "right_knee"),
        ("right_knee", "right_ankle"),
    ]
    
    for conn in connections:
        if conn[0] in keypoint_coords and conn[1] in keypoint_coords:
            pt1 = keypoint_coords[conn[0]]
            pt2 = keypoint_coords[conn[1]]
            cv2.line(frame, pt1, pt2, (0, 255, 0), 2)
    
    return frame

def draw_objects(frame, objects_data, frame_num):
    """Draw object bounding boxes on frame"""
    frame_key = f"frame_{frame_num:03d}"
    if frame_key not in objects_data:
        return frame
    
    objects = objects_data[frame_key]
    
    for obj in objects:
        bbox = obj['bbox']
        x1, y1, x2, y2 = map(int, bbox)
        
        # Draw bounding box
        cv2.rectangle(frame, (x1, y1), (x2, y2), (255, 0, 0), 2)
        
        # Draw label with confidence
        label = f"{obj['label']}: {obj['confidence']:.2f}"
        cv2.putText(frame, label, (x1, y1-10), 
                   cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 0, 0), 2)
    
    return frame

def draw_actions(frame, actions_data, frame_num):
    """Draw action labels on frame"""
    # Find active actions for this frame
    active_actions = []
    for action in actions_data:
        if action['start_frame'] <= frame_num <= action['end_frame']:
            active_actions.append(action)
    
    # Draw action labels
    y_offset = 30
    for action in active_actions:
        label = f"Action: {action['label']} ({action['confidence']:.2f})"
        cv2.putText(frame, label, (10, y_offset), 
                   cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 255), 2)
        y_offset += 30
    
    return frame

def visualize_video(video_path, output_dir, output_video=None):
    """Visualize ML processing results on video"""
    
    # Load JSON data
    pose_file = output_dir / "pose.json"
    objects_file = output_dir / "objects.json"
    actions_file = output_dir / "actions.json"
    
    pose_data = load_json_file(pose_file) if pose_file.exists() else {}
    objects_data = load_json_file(objects_file) if objects_file.exists() else {}
    actions_data = load_json_file(actions_file) if actions_file.exists() else []
    
    # Open video
    cap = cv2.VideoCapture(str(video_path))
    
    if output_video:
        # Setup video writer
        fps = cap.get(cv2.CAP_PROP_FPS)
        width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
        height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
        fourcc = cv2.VideoWriter_fourcc(*'mp4v')
        out = cv2.VideoWriter(str(output_video), fourcc, fps, (width, height))
        
        # Process all frames for output video
        frame_num = 0
        total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        
        print(f"Processing {total_frames} frames...")
        
        while True:
            ret, frame = cap.read()
            if not ret:
                break
            
            # Create display frame
            display_frame = frame.copy()
            
            # Draw annotations
            display_frame = draw_pose_keypoints(display_frame, pose_data, frame_num)
            display_frame = draw_objects(display_frame, objects_data, frame_num)
            display_frame = draw_actions(display_frame, actions_data, frame_num)
            
            # Add frame number
            cv2.putText(display_frame, f"Frame: {frame_num}", (10, frame.shape[0]-10),
                       cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)
            
            # Write to output video
            out.write(display_frame)
            
            if frame_num % 10 == 0:
                print(f"  Processed frame {frame_num}/{total_frames}")
            
            frame_num += 1
        
        out.release()
        print(f"Saved annotated video to: {output_video}")
    
    else:
        # Interactive display mode
        frame_num = 0
        print("Press 'q' to quit, 'space' to pause/resume")
        paused = False
        
        while True:
            if not paused:
                ret, frame = cap.read()
                if not ret:
                    print("End of video or restarting...")
                    cap.set(cv2.CAP_PROP_POS_FRAMES, 0)
                    frame_num = 0
                    continue
            
            # Create display frame
            display_frame = frame.copy()
            
            # Draw annotations
            display_frame = draw_pose_keypoints(display_frame, pose_data, frame_num)
            display_frame = draw_objects(display_frame, objects_data, frame_num)
            display_frame = draw_actions(display_frame, actions_data, frame_num)
            
            # Add frame number
            cv2.putText(display_frame, f"Frame: {frame_num}", (10, frame.shape[0]-10),
                       cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)
            
            # Display frame
            cv2.imshow("ML Processing Results", display_frame)
            
            # Handle key press
            key = cv2.waitKey(30 if not paused else 0) & 0xFF
            if key == ord('q'):
                break
            elif key == ord(' '):
                paused = not paused
            
            if not paused:
                frame_num += 1
        
        cv2.destroyAllWindows()
    
    # Cleanup
    cap.release()

def main():
    parser = argparse.ArgumentParser(description="Visualize ML processing results")
    parser.add_argument("--video", required=True, help="Path to input video")
    parser.add_argument("--output", required=True, help="Directory containing JSON output files")
    parser.add_argument("--save", help="Path to save annotated video (optional)")
    
    args = parser.parse_args()
    
    video_path = Path(args.video)
    output_dir = Path(args.output)
    
    if not video_path.exists():
        print(f"Error: Video file not found: {video_path}")
        return
    
    if not output_dir.exists():
        print(f"Error: Output directory not found: {output_dir}")
        return
    
    output_video = Path(args.save) if args.save else None
    
    print(f"Visualizing results from {output_dir}")
    print(f"Video: {video_path}")
    
    visualize_video(video_path, output_dir, output_video)

if __name__ == "__main__":
    main()