# Video Processing Pipeline 🎥🤖

A comprehensive Python script for extracting pose, object, and action data from videos to train robots.

## Features

- **Pose Estimation**: Extracts 33 keypoints using MediaPipe
- **Object Detection**: Identifies objects using YOLOv8
- **Action Recognition**: Rule-based action classification from pose sequences
- **Dynamic Labels**: All labels are data-driven, not hardcoded
- **Modular Design**: Clean separation of concerns with dedicated classes
- **Production Ready**: Proper error handling, logging, and CLI interface

## Installation

### Option 1: Install ML Dependencies (Full Features)
```bash
pip install -r requirements_ml.txt
```

### Option 2: Basic Installation (Mock Mode)
```bash
pip install opencv-python numpy
```
The script will run with mock data if ML libraries are not available.

## Usage

### Basic Usage
```bash
python process_video.py --video path/to/your/video.mp4
```

### Specify Output Directory
```bash
python process_video.py --video video.mp4 --output results/
```

### Enable Verbose Logging
```bash
python process_video.py --video video.mp4 --verbose
```

## Output Files

The script generates four JSON files in the output directory:

### 1. pose.json
Contains pose keypoints for each frame:
```json
{
  "frame_001": {
    "keypoints": {
      "nose": [320.5, 180.2, 0.1],
      "left_shoulder": [280.1, 250.3, 0.2],
      "right_shoulder": [360.8, 251.1, 0.2],
      ...
    },
    "confidence": 0.95
  }
}
```

### 2. objects.json
Contains detected objects with bounding boxes:
```json
{
  "frame_001": [
    {
      "label": "person",
      "bbox": [150.2, 100.5, 450.8, 600.3],
      "confidence": 0.92
    },
    {
      "label": "cup",
      "bbox": [500.1, 300.2, 580.5, 420.8],
      "confidence": 0.88
    }
  ]
}
```

### 3. actions.json
Contains recognized action segments:
```json
[
  {
    "label": "stand",
    "start_frame": 0,
    "end_frame": 30,
    "confidence": 0.85
  },
  {
    "label": "reach",
    "start_frame": 31,
    "end_frame": 60,
    "confidence": 0.85
  },
  {
    "label": "pick",
    "start_frame": 61,
    "end_frame": 90,
    "confidence": 0.85
  }
]
```

### 4. summary.json
Contains processing summary and metadata:
```json
{
  "video_path": "path/to/video.mp4",
  "total_frames_processed": 300,
  "total_objects_detected": 450,
  "total_actions_detected": 8,
  "output_files": {
    "pose": "output/pose.json",
    "objects": "output/objects.json",
    "actions": "output/actions.json"
  }
}
```

## Architecture

```
VideoProcessor (Main Pipeline)
├── PoseExtractor (MediaPipe)
│   ├── extract_keypoints()
│   └── 33 pose landmarks
├── ObjectDetector (YOLOv8)
│   ├── detect_objects()
│   └── 80+ object classes
└── ActionRecognizer (Rule-based)
    ├── analyze_movements()
    └── Actions: stand, walk, reach, pick, wave, sit
```

## Supported Actions

The action recognizer can detect:
- **stand**: Default standing position
- **walk**: Hip movement detected
- **reach**: Arm extended forward
- **pick**: Hand lowered below hip
- **wave**: Hand raised above shoulder
- **sit**: Hip lowered significantly

## Performance Notes

- Processes ~30 FPS on modern hardware with GPU
- YOLOv8 nano model used for speed
- Object detection runs every 5 frames to save computation
- Limited to first 300 frames (10 seconds) in demo mode

## Troubleshooting

### MediaPipe Not Found
```
Warning: MediaPipe not available, using mock pose estimation
```
Solution: Install MediaPipe with `pip install mediapipe`

### YOLOv8 Not Found
```
Warning: YOLOv8 not available, using mock object detection
```
Solution: Install Ultralytics with `pip install ultralytics`

### CUDA/GPU Support
For faster processing with GPU:
```bash
pip install torch torchvision --index-url https://download.pytorch.org/whl/cu118
```

## Advanced Usage

### Process Multiple Videos
```bash
for video in *.mp4; do
    python process_video.py --video "$video" --output "results/${video%.mp4}/"
done
```

### Custom Action Recognition
Modify the `_classify_action_from_poses()` method in `ActionRecognizer` class to add custom actions.

### Integration with HumanoSync Platform
This script is designed to work with the HumanoSync web platform for visualization and editing of extracted data.

## License

MIT License - See LICENSE file for details

## Contributing

Contributions are welcome! Please ensure:
1. Code follows PEP 8 style guide
2. Add proper documentation
3. Include error handling
4. Test with various video formats

## Support

For issues or questions:
- Create an issue on GitHub
- Email: support@humanosync.ai