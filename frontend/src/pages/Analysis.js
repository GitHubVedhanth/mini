import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePrediction } from '../context/PredictionContext';
import './Analysis.css';

const Analysis = () => {
  // Access our prediction context
  const { updatePrediction } = usePrediction();
  
  // State for file handling and UI
  const [file, setFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  // For navigation to report page
  const navigate = useNavigate();

  // Handle file selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    
    // Reset states
    setError(null);
    setResult(null);
    
    // Validate file
    if (!selectedFile) return;
    
    // Check if file is an image
    if (!selectedFile.type.match('image.*')) {
      setError('Please select an image file.');
      return;
    }
    
    // Set the file for upload
    setFile(selectedFile);
    
    // Create and set image preview
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target.result);
    reader.readAsDataURL(selectedFile);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select an image file.');
      return;
    }

    setLoading(true);
    setError(null);

    // Create FormData for API request
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      // Make the actual API call to the backend
      const apiUrl = 'http://localhost:5000/predict';
      const response = await fetch(apiUrl, {
        method: 'POST',
        body: formData,
      });

      // Check if the response is successful
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // Parse the JSON response
      const data = await response.json();

      // Ensure the response contains the expected fields
      if (!data.class || !data.label || !data.confidence) {
        throw new Error('Invalid response format from the server.');
      }

      // Set the results in component state
      setResult(data);
      // Update the global prediction state with result and image
      updatePrediction(data, imagePreview);
    } catch (error) {
      console.error('Error:', error.message);
      setError(`An error occurred: ${error.message}. Please try again after some time.`);
    } finally {
      setLoading(false);
    }
  };

  // Handle navigation to report page
  const viewReport = () => {
    navigate('/report');
  };

  // Return JSX to display the component
  return (
    <div className="analysis-container">
      <h1>Retinal Image Analysis</h1>
      <div className="analysis-content">
        <div className="upload-section">
          <h2>Upload Retinal Image</h2>
          {/* File upload form */}
          <form onSubmit={handleSubmit}>
            <div className="file-input-container">
              <input 
                type="file" 
                id="image-upload" 
                onChange={handleFileChange}
                accept="image/*"
                disabled={loading}
              />
              <label htmlFor="image-upload" className="file-input-label">
                {file ? file.name : 'Choose an image file'}
              </label>
            </div>
            {/* Show preview if an image is selected */}
            {imagePreview && (
              <div className="image-preview">
                <h3>Image Preview:</h3>
                <img src={imagePreview} alt="Retina scan preview" />
              </div>
            )}
            {/* Error message */}
            {error && <div className="error-message">{error}</div>}
            {/* Submit button */}
            <button 
              type="submit" 
              className="analyze-button"
              disabled={!file || loading}
            >
              {loading ? 'Analyzing...' : 'Analyze Image'}
            </button>
          </form>
        </div>

        {/* Results section - only show if we have results */}
        {result && (
          <div className="result-section">
            <h2>Analysis Results</h2>
            <div className="result">
              <div className="result-item">
                <span className="result-label">Disease Class:</span>
                <span className="result-value">{result.class}</span>
              </div>
              <div className="result-item">
                <span className="result-label">Condition:</span>
                <span className="result-value">{result.label}</span>
              </div>
              <div className="result-item">
                <span className="result-label">Confidence:</span>
                <span className="result-value">
                  {(result.confidence * 100).toFixed(2)}%
                  {/* Show confidence bar */}
                  <div className="confidence-bar-container">
                    <div 
                      className="confidence-bar" 
                      style={{ width: `${result.confidence * 100}%` }}
                    ></div>
                  </div>
                </span>
              </div>
              <button 
                className="view-report-button" 
                onClick={viewReport}
              >
                View Full Report
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Analysis;