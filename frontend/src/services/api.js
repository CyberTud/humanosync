import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Upload endpoints
export const uploadVideo = async (file) => {
  const formData = new FormData();
  formData.append('video', file);
  
  const response = await api.post('/api/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return response.data;
};

export const getProcessingStatus = async (videoId) => {
  const response = await api.get(`/api/video/${videoId}/status`);
  return response.data;
};

export const getVideoInfo = async (videoId) => {
  const response = await api.get(`/api/video/${videoId}/info`);
  return response.data;
};

// Extract endpoints
export const getPose = async (videoId) => {
  const response = await api.get(`/api/video/${videoId}/pose`);
  return response.data;
};

export const getObjects = async (videoId) => {
  const response = await api.get(`/api/video/${videoId}/objects`);
  return response.data;
};

export const getActions = async (videoId) => {
  const response = await api.get(`/api/video/${videoId}/actions`);
  return response.data;
};

export const getFrameData = async (videoId, frameNum) => {
  const response = await api.get(`/api/video/${videoId}/frame/${frameNum}`);
  return response.data;
};

// Annotation endpoints
export const saveAnnotations = async (videoId, annotations) => {
  const response = await api.post(`/api/video/${videoId}/annotations`, annotations);
  return response.data;
};

export const updatePoseFrame = async (videoId, frameId, pose) => {
  const response = await api.put(`/api/video/${videoId}/pose/${frameId}`, pose);
  return response.data;
};

export const updateObjectsFrame = async (videoId, frameId, objects) => {
  const response = await api.put(`/api/video/${videoId}/objects/${frameId}`, objects);
  return response.data;
};

export const addAction = async (videoId, action) => {
  const response = await api.post(`/api/video/${videoId}/actions`, action);
  return response.data;
};

export const deleteAction = async (videoId, actionIndex) => {
  const response = await api.delete(`/api/video/${videoId}/actions/${actionIndex}`);
  return response.data;
};

// Export endpoints
export const exportAnnotations = async (videoId, format) => {
  const response = await api.get(`/api/video/${videoId}/export`, {
    params: { format },
    responseType: format === 'json' ? 'json' : 'blob'
  });
  return response.data;
};

export const getExportSummary = async (videoId) => {
  const response = await api.get(`/api/video/${videoId}/export/summary`);
  return response.data;
};

export default api;