import React from 'react';

const ExportPanel = ({ onExport }) => {
  return (
    <div className="bg-gray-50 rounded p-4">
      <h3 className="font-bold mb-3">Export Annotations</h3>
      <div className="space-y-2">
        <button
          onClick={() => onExport('json')}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          <div className="flex items-center justify-center">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
            </svg>
            Export as JSON
          </div>
        </button>
        
        <button
          onClick={() => onExport('csv')}
          className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
        >
          <div className="flex items-center justify-center">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v1a1 1 0 001 1h4a1 1 0 001-1v-1m3-2V8a2 2 0 00-2-2H8a2 2 0 00-2 2v8m3-2h6" />
            </svg>
            Export as CSV
          </div>
        </button>
        
        <button
          onClick={() => onExport('yaml')}
          className="w-full px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
        >
          <div className="flex items-center justify-center">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
            Export as ROS YAML
          </div>
        </button>
      </div>
      
      <div className="mt-4 p-3 bg-blue-50 rounded">
        <h4 className="text-sm font-semibold mb-1">Export Formats</h4>
        <ul className="text-xs text-gray-600 space-y-1">
          <li>• <strong>JSON:</strong> Machine learning ready</li>
          <li>• <strong>CSV:</strong> Analytics & spreadsheets</li>
          <li>• <strong>YAML:</strong> ROS compatible</li>
        </ul>
      </div>
    </div>
  );
};

export default ExportPanel;