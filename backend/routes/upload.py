from fastapi import APIRouter, File, UploadFile, HTTPException, BackgroundTasks
from fastapi.responses import FileResponse
from pathlib import Path
import uuid
import shutil
import json
from typing import Dict
import os
from services.pose_mock import PoseExtractor
from services.objects_mock import ObjectDetector
from services.actions import ActionRecognizer
import asyncio

router = APIRouter()

# Global storage for video processing status
processing_status = {}

async def process_video(video_id: str, video_path: str):
    """Background task to process video with ML models"""
    try:
        processing_status[video_id] = "processing"
        
        # Create output directory
        output_dir = Path(f"data/{video_id}")
        output_dir.mkdir(parents=True, exist_ok=True)
        
        # Extract pose
        print(f"Extracting pose for video {video_id}")
        pose_extractor = PoseExtractor()
        pose_data = await asyncio.to_thread(
            pose_extractor.extract_from_video, video_path, output_dir
        )
        
        # Extract objects
        print(f"Extracting objects for video {video_id}")
        object_detector = ObjectDetector()
        objects_data = await asyncio.to_thread(
            object_detector.extract_from_video, video_path, output_dir
        )
        
        # Extract actions
        print(f"Extracting actions for video {video_id}")
        action_recognizer = ActionRecognizer()
        actions_data = await asyncio.to_thread(
            action_recognizer.extract_from_pose_and_objects,
            pose_data, objects_data, output_dir
        )
        
        processing_status[video_id] = "completed"
        print(f"Processing completed for video {video_id}")
        
    except Exception as e:
        print(f"Error processing video {video_id}: {str(e)}")
        processing_status[video_id] = f"error: {str(e)}"

@router.post("/upload")
async def upload_video(
    background_tasks: BackgroundTasks,
    video: UploadFile = File(...)
) -> Dict:
    """Upload a video file and start processing"""
    
    # Validate file type
    allowed_extensions = ['.mp4', '.avi', '.mov']
    file_ext = Path(video.filename).suffix.lower()
    
    if file_ext not in allowed_extensions:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file type. Allowed: {', '.join(allowed_extensions)}"
        )
    
    # Generate unique ID
    video_id = str(uuid.uuid4())
    
    # Save video
    video_path = f"uploads/{video_id}{file_ext}"
    with open(video_path, "wb") as buffer:
        shutil.copyfileobj(video.file, buffer)
    
    # Start background processing
    background_tasks.add_task(process_video, video_id, video_path)
    processing_status[video_id] = "queued"
    
    return {
        "video_id": video_id,
        "filename": video.filename,
        "status": "queued",
        "message": "Video uploaded successfully. Processing started."
    }

@router.get("/video/{video_id}/status")
async def get_processing_status(video_id: str) -> Dict:
    """Get the processing status of a video"""
    
    if video_id not in processing_status:
        raise HTTPException(status_code=404, detail="Video not found")
    
    return {
        "video_id": video_id,
        "status": processing_status[video_id]
    }

@router.get("/video/{video_id}/file")
async def get_video_file(video_id: str):
    """Serve the uploaded video file"""
    
    # Look for video files with any extension
    uploads_dir = Path("uploads")
    video_files = list(uploads_dir.glob(f"{video_id}.*"))
    
    if not video_files:
        raise HTTPException(status_code=404, detail="Video file not found")
    
    video_path = video_files[0]
    
    if not video_path.exists():
        raise HTTPException(status_code=404, detail="Video file not found")
    
    return FileResponse(
        path=str(video_path),
        media_type="video/mp4",
        filename=video_path.name
    )

@router.get("/video/{video_id}/info")
async def get_video_info(video_id: str) -> Dict:
    """Get information about a processed video"""
    
    data_dir = Path(f"data/{video_id}")
    if not data_dir.exists():
        raise HTTPException(status_code=404, detail="Video data not found")
    
    # Check which files exist
    has_pose = (data_dir / "pose.json").exists()
    has_objects = (data_dir / "objects.json").exists()
    has_actions = (data_dir / "actions.json").exists()
    
    # Get frame count from pose data
    frame_count = 0
    if has_pose:
        with open(data_dir / "pose.json", 'r') as f:
            pose_data = json.load(f)
            frame_count = len(pose_data)
    
    return {
        "video_id": video_id,
        "has_pose": has_pose,
        "has_objects": has_objects,
        "has_actions": has_actions,
        "frame_count": frame_count,
        "status": processing_status.get(video_id, "unknown")
    }