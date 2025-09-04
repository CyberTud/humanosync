import React from 'react';
import { Routes, Route } from 'react-router-dom';
import CleanLanding from './pages/CleanLanding';
import CleanUploadPage from './pages/CleanUploadPage';
import CleanAnnotatePage from './pages/CleanAnnotatePage';
import CleanExportPage from './pages/CleanExportPage';

function App() {
  return (
    <div className="min-h-screen">
      <Routes>
        <Route path="/" element={<CleanLanding />} />
        <Route path="/upload" element={<CleanUploadPage />} />
        <Route path="/annotate/:videoId" element={<CleanAnnotatePage />} />
        <Route path="/export/:videoId" element={<CleanExportPage />} />
      </Routes>
    </div>
  );
}

export default App;