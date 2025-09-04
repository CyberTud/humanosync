from fastapi import APIRouter, HTTPException
from pathlib import Path
import json
from typing import Dict, List, Any

router = APIRouter()

@router.get("/video/{video_id}/pose")
async def get_pose_data(video_id: str) -> Dict[str, Any]:
    """Get pose extraction data for a video"""
    
    pose_path = Path(f"data/{video_id}/pose.json")
    
    if not pose_path.exists():
        raise HTTPException(status_code=404, detail="Pose data not found")
    
    with open(pose_path, 'r') as f:
        pose_data = json.load(f)
    
    return pose_data

@router.get("/video/{video_id}/objects")
async def get_objects_data(video_id: str) -> Dict[str, List]:
    """Get object detection data for a video"""
    
    objects_path = Path(f"data/{video_id}/objects.json")
    
    if not objects_path.exists():
        raise HTTPException(status_code=404, detail="Objects data not found")
    
    with open(objects_path, 'r') as f:
        objects_data = json.load(f)
    
    return objects_data

@router.get("/video/{video_id}/actions")
async def get_actions_data(video_id: str) -> List[Dict]:
    """Get action recognition data for a video"""
    
    actions_path = Path(f"data/{video_id}/actions.json")
    
    if not actions_path.exists():
        raise HTTPException(status_code=404, detail="Actions data not found")
    
    with open(actions_path, 'r') as f:
        actions_data = json.load(f)
    
    return actions_data

@router.get("/video/{video_id}/frame/{frame_num}")
async def get_frame_data(video_id: str, frame_num: int) -> Dict:
    """Get all annotations for a specific frame"""
    
    frame_id = f"frame_{frame_num:03d}"
    result = {"frame": frame_num}
    
    # Get pose data
    pose_path = Path(f"data/{video_id}/pose.json")
    if pose_path.exists():
        with open(pose_path, 'r') as f:
            pose_data = json.load(f)
            if frame_id in pose_data:
                result["pose"] = pose_data[frame_id]
    
    # Get objects data
    objects_path = Path(f"data/{video_id}/objects.json")
    if objects_path.exists():
        with open(objects_path, 'r') as f:
            objects_data = json.load(f)
            if frame_id in objects_data:
                result["objects"] = objects_data[frame_id]
    
    # Get relevant actions
    actions_path = Path(f"data/{video_id}/actions.json")
    if actions_path.exists():
        with open(actions_path, 'r') as f:
            actions_data = json.load(f)
            result["actions"] = [
                action for action in actions_data
                if action["start_frame"] <= frame_num <= action["end_frame"]
            ]
    
    return result