from fastapi import FastAPI, File, UploadFile, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import Dict, List, Optional, Any
import json
import os
import uuid
import shutil
from pathlib import Path
import asyncio
from concurrent.futures import ProcessPoolExecutor

from routes.upload import router as upload_router
from routes.extract import router as extract_router
from routes.annotations import router as annotations_router
from routes.export import router as export_router

app = FastAPI(title="HumanoSync API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create directories
Path("uploads").mkdir(exist_ok=True)
Path("data").mkdir(exist_ok=True)

# Include routers
app.include_router(upload_router, prefix="/api")
app.include_router(extract_router, prefix="/api")
app.include_router(annotations_router, prefix="/api")
app.include_router(export_router, prefix="/api")

# Serve uploaded videos
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

@app.get("/")
async def root():
    return {"message": "HumanoSync API is running", "version": "1.0.0"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)