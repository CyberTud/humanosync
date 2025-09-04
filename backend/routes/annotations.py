from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from pathlib import Path
import json
from typing import Dict, List, Any, Optional

router = APIRouter()

class Keypoint(BaseModel):
    x: float
    y: float
    z: Optional[float] = None

class PoseAnnotation(BaseModel):
    keypoints: Dict[str, List[float]]
    confidence: float

class ObjectAnnotation(BaseModel):
    label: str
    bbox: List[float]
    confidence: float

class ActionAnnotation(BaseModel):
    label: str
    start_frame: int
    end_frame: int
    confidence: float

class AnnotationsUpdate(BaseModel):
    pose: Optional[Dict[str, PoseAnnotation]] = None
    objects: Optional[Dict[str, List[ObjectAnnotation]]] = None
    actions: Optional[List[ActionAnnotation]] = None

@router.post("/video/{video_id}/annotations")
async def save_annotations(video_id: str, annotations: AnnotationsUpdate) -> Dict:
    """Save edited annotations for a video"""
    
    data_dir = Path(f"data/{video_id}")
    if not data_dir.exists():
        raise HTTPException(status_code=404, detail="Video data directory not found")
    
    saved_items = []
    
    # Save pose annotations
    if annotations.pose:
        pose_path = data_dir / "pose.json"
        with open(pose_path, 'w') as f:
            json.dump(annotations.pose, f, indent=2)
        saved_items.append("pose")
    
    # Save object annotations
    if annotations.objects:
        objects_path = data_dir / "objects.json"
        with open(objects_path, 'w') as f:
            json.dump(annotations.objects, f, indent=2)
        saved_items.append("objects")
    
    # Save action annotations
    if annotations.actions:
        actions_path = data_dir / "actions.json"
        with open(actions_path, 'w') as f:
            json.dump([a.dict() for a in annotations.actions], f, indent=2)
        saved_items.append("actions")
    
    return {
        "message": "Annotations saved successfully",
        "saved": saved_items
    }

@router.put("/video/{video_id}/pose/{frame_id}")
async def update_pose_frame(
    video_id: str,
    frame_id: str,
    pose: PoseAnnotation
) -> Dict:
    """Update pose annotation for a specific frame"""
    
    pose_path = Path(f"data/{video_id}/pose.json")
    
    if not pose_path.exists():
        raise HTTPException(status_code=404, detail="Pose data not found")
    
    with open(pose_path, 'r') as f:
        pose_data = json.load(f)
    
    pose_data[frame_id] = pose.dict()
    
    with open(pose_path, 'w') as f:
        json.dump(pose_data, f, indent=2)
    
    return {"message": f"Pose updated for frame {frame_id}"}

@router.put("/video/{video_id}/objects/{frame_id}")
async def update_objects_frame(
    video_id: str,
    frame_id: str,
    objects: List[ObjectAnnotation]
) -> Dict:
    """Update object annotations for a specific frame"""
    
    objects_path = Path(f"data/{video_id}/objects.json")
    
    if not objects_path.exists():
        raise HTTPException(status_code=404, detail="Objects data not found")
    
    with open(objects_path, 'r') as f:
        objects_data = json.load(f)
    
    objects_data[frame_id] = [obj.dict() for obj in objects]
    
    with open(objects_path, 'w') as f:
        json.dump(objects_data, f, indent=2)
    
    return {"message": f"Objects updated for frame {frame_id}"}

@router.post("/video/{video_id}/actions")
async def add_action(
    video_id: str,
    action: ActionAnnotation
) -> Dict:
    """Add a new action annotation"""
    
    actions_path = Path(f"data/{video_id}/actions.json")
    
    if not actions_path.exists():
        actions_data = []
    else:
        with open(actions_path, 'r') as f:
            actions_data = json.load(f)
    
    actions_data.append(action.dict())
    
    # Sort by start frame
    actions_data.sort(key=lambda x: x['start_frame'])
    
    with open(actions_path, 'w') as f:
        json.dump(actions_data, f, indent=2)
    
    return {"message": "Action added successfully"}

@router.delete("/video/{video_id}/actions/{action_index}")
async def delete_action(video_id: str, action_index: int) -> Dict:
    """Delete an action annotation by index"""
    
    actions_path = Path(f"data/{video_id}/actions.json")
    
    if not actions_path.exists():
        raise HTTPException(status_code=404, detail="Actions data not found")
    
    with open(actions_path, 'r') as f:
        actions_data = json.load(f)
    
    if action_index < 0 or action_index >= len(actions_data):
        raise HTTPException(status_code=404, detail="Action index out of range")
    
    deleted_action = actions_data.pop(action_index)
    
    with open(actions_path, 'w') as f:
        json.dump(actions_data, f, indent=2)
    
    return {"message": f"Deleted action: {deleted_action['label']}"}