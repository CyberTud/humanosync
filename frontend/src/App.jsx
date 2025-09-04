import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import UploadPage from './pages/UploadPage';
import AnnotatePage from './pages/AnnotatePage';
import ExportPage from './pages/ExportPage';

function App() {
  return (
    <div className="min-h-screen">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/annotate/:videoId" element={<AnnotatePage />} />
        <Route path="/export/:videoId" element={<ExportPage />} />
      </Routes>
    </div>
  );
}

export default App;