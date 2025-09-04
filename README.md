# HumanoSync 🤖

Transform human demonstration videos into robot-compatible data with AI-powered extraction and annotation tools.

## 🌟 Features

### AI-Powered Extraction
- **MediaPipe Pose Estimation**: Extract 33 body keypoints in 3D
- **YOLOv8 Object Detection**: Identify and track objects in scenes
- **Action Recognition**: Temporal analysis of human movements

### Interactive Annotation Editor
- **Konva.js Canvas**: Drag-and-drop keypoint editing
- **Bounding Box Editor**: Resize and label object detections
- **Action Timeline**: Visual timeline with action segments

### Multi-Format Export
- **JSON**: Structured data for ML pipelines
- **CSV**: Tabular format for analytics
- **YAML**: ROS-compatible format for robotics

## 🛠️ Tech Stack

### Backend
- FastAPI (Python 3.8+)
- MediaPipe for pose estimation
- Ultralytics YOLOv8 for object detection
- OpenCV for video processing

### Frontend
- React 18 with React Router
- Konva.js for canvas annotations
- Tailwind CSS for styling
- Axios for API communication

## 📦 Installation

### Prerequisites
- Python 3.8+
- Node.js 14+
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Create virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Run the server:
```bash
uvicorn main:app --reload --port 8000
```

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs

## 🚀 Quick Start

1. **Upload Video**: Navigate to `/upload` and drag-drop your video file
2. **AI Processing**: Wait for automatic extraction (pose, objects, actions)
3. **Edit Annotations**: Use the annotation editor to refine results
4. **Export Data**: Download in JSON, CSV, or YAML format

## 📁 Project Structure

```
humanosync/
├── backend/
│   ├── main.py              # FastAPI application
│   ├── routes/               # API endpoints
│   │   ├── upload.py        # Video upload handling
│   │   ├── extract.py       # Data extraction endpoints
│   │   ├── annotations.py   # Annotation CRUD operations
│   │   └── export.py        # Export functionality
│   ├── services/            # ML model services
│   │   ├── pose.py          # MediaPipe pose extraction
│   │   ├── objects.py       # YOLOv8 object detection
│   │   └── actions.py       # Action recognition
│   ├── uploads/             # Uploaded videos
│   └── data/                # Processed annotations
│
├── frontend/
│   ├── src/
│   │   ├── pages/           # React pages
│   │   │   ├── LandingPage.jsx
│   │   │   ├── UploadPage.jsx
│   │   │   ├── AnnotatePage.jsx
│   │   │   └── ExportPage.jsx
│   │   ├── components/      # React components
│   │   │   ├── VideoViewer.jsx
│   │   │   ├── PoseOverlay.jsx
│   │   │   ├── BoundingBoxEditor.jsx
│   │   │   └── ActionTimeline.jsx
│   │   └── services/        # API service layer
│   └── public/
│
└── sample_data/             # Example annotations
```

## 📊 Data Formats

### Pose Data
```json
{
  "frame_001": {
    "keypoints": {
      "nose": [x, y, z],
      "left_shoulder": [x, y, z],
      ...
    },
    "confidence": 0.94
  }
}
```

### Object Data
```json
{
  "frame_001": [
    {
      "label": "cup",
      "bbox": [x1, y1, x2, y2],
      "confidence": 0.88
    }
  ]
}
```

### Action Data
```json
[
  {
    "label": "pick",
    "start_frame": 32,
    "end_frame": 58,
    "confidence": 0.92
  }
]
```

## 🔌 API Endpoints

### Upload
- `POST /api/upload` - Upload video file
- `GET /api/video/{video_id}/status` - Check processing status

### Data Extraction
- `GET /api/video/{video_id}/pose` - Get pose data
- `GET /api/video/{video_id}/objects` - Get object detections
- `GET /api/video/{video_id}/actions` - Get action timeline

### Annotations
- `POST /api/video/{video_id}/annotations` - Save all annotations
- `PUT /api/video/{video_id}/pose/{frame_id}` - Update pose frame
- `PUT /api/video/{video_id}/objects/{frame_id}` - Update objects frame

### Export
- `GET /api/video/{video_id}/export?format=json|csv|yaml` - Export data

## ⚙️ Configuration

### Environment Variables
Create a `.env` file in the root directory:

```env
REACT_APP_API_URL=http://localhost:8000
BACKEND_PORT=8000
FRONTEND_PORT=3000
```

## 🧪 Testing

### Backend Tests
```bash
cd backend
pytest tests/
```

### Frontend Tests
```bash
cd frontend
npm test
```

## 🚦 Performance Notes

- Video processing time depends on video length and resolution
- YOLOv8 model downloads on first run (~25MB)
- MediaPipe processes at ~30 FPS on modern hardware
- Recommended video resolution: 720p or lower for faster processing

## 📝 License

MIT License - See LICENSE file for details

## 🤝 Contributing

Contributions are welcome! Please read CONTRIBUTING.md for guidelines.

## 🐛 Known Issues

- Large videos (>500MB) may timeout during upload
- Some keypoints may be occluded in complex scenes
- Action recognition is rule-based (not using MMAction2 yet)

## 🔮 Future Enhancements

- [ ] MMAction2 integration for better action recognition
- [ ] 3D visualization of pose data
- [ ] Multi-video batch processing
- [ ] Cloud storage integration (S3, GCS)
- [ ] Real-time collaboration features
- [ ] Custom robot format templates
- [ ] Fine-tuned models for specific tasks

## 📧 Support

For issues and questions:
- Create an issue on GitHub
- Email: support@humanosync.ai

## 🙏 Acknowledgments

- MediaPipe team for pose estimation
- Ultralytics for YOLOv8
- Konva.js for canvas rendering
- FastAPI for the excellent framework

---

Built with ❤️ for the robotics community