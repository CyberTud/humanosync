import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getExportSummary, exportAnnotations } from '../services/api';

const ExportPage = () => {
  const { videoId } = useParams();
  const navigate = useNavigate();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState('json');

  useEffect(() => {
    loadSummary();
  }, [videoId]);

  const loadSummary = async () => {
    try {
      const data = await getExportSummary(videoId);
      setSummary(data);
      setLoading(false);
    } catch (error) {
      console.error('Error loading export summary:', error);
      setLoading(false);
    }
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const data = await exportAnnotations(videoId, selectedFormat);
      
      // Create download link
      let content, filename, mimeType;
      
      if (selectedFormat === 'json') {
        content = JSON.stringify(data, null, 2);
        filename = `${videoId}_annotations.json`;
        mimeType = 'application/json';
      } else if (selectedFormat === 'csv') {
        content = data;
        filename = `${videoId}_annotations.csv`;
        mimeType = 'text/csv';
      } else if (selectedFormat === 'yaml') {
        content = data;
        filename = `${videoId}_annotations.yaml`;
        mimeType = 'text/yaml';
      }
      
      const blob = new Blob([content], { type: mimeType });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      window.URL.revokeObjectURL(url);
      
      alert(`Exported successfully as ${selectedFormat.toUpperCase()}`);
    } catch (error) {
      console.error('Error exporting:', error);
      alert('Export failed. Please try again.');
    }
    setExporting(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-700 via-blue-600 to-cyan-500 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-white mx-auto mb-4"></div>
          <p className="text-xl">Loading export options...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-700 via-blue-600 to-cyan-500 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center text-white mb-8">
          <h1 className="text-4xl font-bold mb-4">Export Annotations</h1>
          <p className="text-lg opacity-90">
            Choose your export format and download the processed data
          </p>
        </div>

        {summary && (
          <div className="bg-white rounded-lg shadow-2xl p-8 mb-8">
            <h2 className="text-2xl font-semibold mb-6">Data Summary</h2>
            
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {summary.available_data.pose && (
                <SummaryCard
                  icon="🧘"
                  title="Pose Data"
                  items={[
                    `${summary.available_data.pose.frame_count} frames`,
                    `${summary.available_data.pose.keypoint_count} keypoints per frame`
                  ]}
                />
              )}
              
              {summary.available_data.objects && (
                <SummaryCard
                  icon="📦"
                  title="Object Data"
                  items={[
                    `${summary.available_data.objects.frame_count} frames`,
                    `${summary.available_data.objects.total_detections} total detections`
                  ]}
                />
              )}
              
              {summary.available_data.actions && (
                <SummaryCard
                  icon="🎬"
                  title="Action Data"
                  items={[
                    `${summary.available_data.actions.action_count} actions`,
                    `Types: ${summary.available_data.actions.action_types.join(', ')}`
                  ]}
                />
              )}
            </div>

            <h3 className="text-xl font-semibold mb-4">Export Format</h3>
            
            <div className="grid md:grid-cols-3 gap-4 mb-8">
              <FormatOption
                format="json"
                title="JSON"
                description="Machine learning ready format"
                icon="{ }"
                selected={selectedFormat === 'json'}
                onSelect={() => setSelectedFormat('json')}
              />
              
              <FormatOption
                format="csv"
                title="CSV"
                description="Spreadsheet compatible"
                icon="📊"
                selected={selectedFormat === 'csv'}
                onSelect={() => setSelectedFormat('csv')}
              />
              
              <FormatOption
                format="yaml"
                title="YAML"
                description="ROS compatible format"
                icon="🤖"
                selected={selectedFormat === 'yaml'}
                onSelect={() => setSelectedFormat('yaml')}
              />
            </div>

            <div className="flex justify-center space-x-4">
              <button
                onClick={handleExport}
                disabled={exporting}
                className={`px-8 py-3 rounded-lg font-semibold text-lg ${
                  exporting 
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {exporting ? 'Exporting...' : `Export as ${selectedFormat.toUpperCase()}`}
              </button>
              
              <button
                onClick={() => navigate(`/annotate/${videoId}`)}
                className="px-8 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold text-lg hover:bg-gray-300"
              >
                Back to Editor
              </button>
            </div>
          </div>
        )}

        <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 text-white">
          <h3 className="text-xl font-semibold mb-4">Format Details</h3>
          
          <div className="space-y-4 text-sm">
            <FormatDetail
              title="JSON Format"
              description="Structured data with nested objects for pose keypoints, object bounding boxes, and action timelines. Ideal for machine learning pipelines and custom processing."
            />
            
            <FormatDetail
              title="CSV Format"
              description="Tabular data format with separate sections for pose, objects, and actions. Compatible with Excel, Google Sheets, and data analysis tools."
            />
            
            <FormatDetail
              title="YAML Format"
              description="ROS-compatible format with timestamps and standard message structures. Ready for robotic simulation and control systems."
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const SummaryCard = ({ icon, title, items }) => (
  <div className="bg-gray-50 rounded-lg p-4">
    <div className="text-3xl mb-2">{icon}</div>
    <h4 className="font-semibold mb-2">{title}</h4>
    <ul className="text-sm text-gray-600 space-y-1">
      {items.map((item, idx) => (
        <li key={idx}>• {item}</li>
      ))}
    </ul>
  </div>
);

const FormatOption = ({ format, title, description, icon, selected, onSelect }) => (
  <div
    onClick={onSelect}
    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
      selected 
        ? 'border-blue-600 bg-blue-50' 
        : 'border-gray-200 hover:border-gray-300'
    }`}
  >
    <div className="text-2xl mb-2">{icon}</div>
    <h4 className="font-semibold">{title}</h4>
    <p className="text-sm text-gray-600">{description}</p>
  </div>
);

const FormatDetail = ({ title, description }) => (
  <div>
    <h4 className="font-semibold mb-1">{title}</h4>
    <p className="opacity-90">{description}</p>
  </div>
);

export default ExportPage;