from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse, JSONResponse
from pathlib import Path
import json
import yaml
import pandas as pd
import io
from typing import Dict, Optional

router = APIRouter()

@router.get("/video/{video_id}/export")
async def export_annotations(
    video_id: str,
    format: str = "json"
):
    """Export annotations in various formats"""
    
    data_dir = Path(f"data/{video_id}")
    if not data_dir.exists():
        raise HTTPException(status_code=404, detail="Video data not found")
    
    # Load all annotation data
    annotations = {}
    
    pose_path = data_dir / "pose.json"
    if pose_path.exists():
        with open(pose_path, 'r') as f:
            annotations["pose"] = json.load(f)
    
    objects_path = data_dir / "objects.json"
    if objects_path.exists():
        with open(objects_path, 'r') as f:
            annotations["objects"] = json.load(f)
    
    actions_path = data_dir / "actions.json"
    if actions_path.exists():
        with open(actions_path, 'r') as f:
            annotations["actions"] = json.load(f)
    
    if format == "json":
        return export_json(annotations, video_id)
    elif format == "csv":
        return export_csv(annotations, video_id)
    elif format == "yaml":
        return export_yaml(annotations, video_id)
    else:
        raise HTTPException(status_code=400, detail=f"Unsupported format: {format}")

def export_json(annotations: Dict, video_id: str):
    """Export as JSON"""
    content = json.dumps(annotations, indent=2)
    
    return StreamingResponse(
        io.StringIO(content),
        media_type="application/json",
        headers={
            "Content-Disposition": f"attachment; filename={video_id}_annotations.json"
        }
    )

def export_csv(annotations: Dict, video_id: str):
    """Export as CSV files in a combined format"""
    output = io.StringIO()
    
    # Export pose data
    if "pose" in annotations:
        output.write("=== POSE DATA ===\n")
        pose_rows = []
        
        for frame_id, data in annotations["pose"].items():
            row = {"frame": frame_id}
            for keypoint, coords in data["keypoints"].items():
                row[f"{keypoint}_x"] = coords[0]
                row[f"{keypoint}_y"] = coords[1]
                if len(coords) > 2:
                    row[f"{keypoint}_z"] = coords[2]
            row["confidence"] = data["confidence"]
            pose_rows.append(row)
        
        if pose_rows:
            df_pose = pd.DataFrame(pose_rows)
            output.write(df_pose.to_csv(index=False))
            output.write("\n\n")
    
    # Export object data
    if "objects" in annotations:
        output.write("=== OBJECT DATA ===\n")
        object_rows = []
        
        for frame_id, objects in annotations["objects"].items():
            for obj in objects:
                object_rows.append({
                    "frame": frame_id,
                    "label": obj["label"],
                    "x1": obj["bbox"][0],
                    "y1": obj["bbox"][1],
                    "x2": obj["bbox"][2],
                    "y2": obj["bbox"][3],
                    "confidence": obj["confidence"]
                })
        
        if object_rows:
            df_objects = pd.DataFrame(object_rows)
            output.write(df_objects.to_csv(index=False))
            output.write("\n\n")
    
    # Export action data
    if "actions" in annotations:
        output.write("=== ACTION DATA ===\n")
        if annotations["actions"]:
            df_actions = pd.DataFrame(annotations["actions"])
            output.write(df_actions.to_csv(index=False))
    
    output.seek(0)
    
    return StreamingResponse(
        output,
        media_type="text/csv",
        headers={
            "Content-Disposition": f"attachment; filename={video_id}_annotations.csv"
        }
    )

def export_yaml(annotations: Dict, video_id: str):
    """Export in ROS-compatible YAML format"""
    
    ros_format = {
        "header": {
            "seq": 1,
            "stamp": {
                "secs": 0,
                "nsecs": 0
            },
            "frame_id": video_id,
            "version": "1.0"
        },
        "poses": [],
        "objects": [],
        "actions": []
    }
    
    # Convert pose data
    if "pose" in annotations:
        for frame_id, data in annotations["pose"].items():
            frame_num = int(frame_id.split("_")[1])
            ros_format["poses"].append({
                "frame": frame_num,
                "timestamp": frame_num / 30.0,  # Assuming 30 FPS
                "joints": data["keypoints"],
                "confidence": data["confidence"]
            })
    
    # Convert object data
    if "objects" in annotations:
        for frame_id, objects in annotations["objects"].items():
            frame_num = int(frame_id.split("_")[1])
            for obj in objects:
                ros_format["objects"].append({
                    "frame": frame_num,
                    "timestamp": frame_num / 30.0,
                    "class": obj["label"],
                    "bbox": {
                        "x_min": obj["bbox"][0],
                        "y_min": obj["bbox"][1],
                        "x_max": obj["bbox"][2],
                        "y_max": obj["bbox"][3]
                    },
                    "confidence": obj["confidence"]
                })
    
    # Convert action data
    if "actions" in annotations:
        for action in annotations["actions"]:
            ros_format["actions"].append({
                "action": action["label"],
                "start_time": action["start_frame"] / 30.0,
                "end_time": action["end_frame"] / 30.0,
                "start_frame": action["start_frame"],
                "end_frame": action["end_frame"],
                "confidence": action["confidence"]
            })
    
    yaml_content = yaml.dump(ros_format, default_flow_style=False, sort_keys=False)
    
    return StreamingResponse(
        io.StringIO(yaml_content),
        media_type="text/yaml",
        headers={
            "Content-Disposition": f"attachment; filename={video_id}_annotations.yaml"
        }
    )

@router.get("/video/{video_id}/export/summary")
async def export_summary(video_id: str) -> Dict:
    """Get a summary of available export data"""
    
    data_dir = Path(f"data/{video_id}")
    if not data_dir.exists():
        raise HTTPException(status_code=404, detail="Video data not found")
    
    summary = {
        "video_id": video_id,
        "available_formats": ["json", "csv", "yaml"],
        "available_data": {}
    }
    
    # Check pose data
    pose_path = data_dir / "pose.json"
    if pose_path.exists():
        with open(pose_path, 'r') as f:
            pose_data = json.load(f)
            summary["available_data"]["pose"] = {
                "frame_count": len(pose_data),
                "keypoint_count": len(next(iter(pose_data.values()))["keypoints"]) if pose_data else 0
            }
    
    # Check objects data
    objects_path = data_dir / "objects.json"
    if objects_path.exists():
        with open(objects_path, 'r') as f:
            objects_data = json.load(f)
            total_objects = sum(len(objs) for objs in objects_data.values())
            summary["available_data"]["objects"] = {
                "frame_count": len(objects_data),
                "total_detections": total_objects
            }
    
    # Check actions data
    actions_path = data_dir / "actions.json"
    if actions_path.exists():
        with open(actions_path, 'r') as f:
            actions_data = json.load(f)
            summary["available_data"]["actions"] = {
                "action_count": len(actions_data),
                "action_types": list(set(a["label"] for a in actions_data))
            }
    
    return summary