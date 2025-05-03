
import React from 'react';
import { Link } from 'react-router-dom';
import { usePrediction } from '../context/PredictionContext';
import './Report.css';

const Report = () => {
  // Access our prediction context
  const { prediction, uploadedImage, patientInfo, reportDate, getDoctorsRecommendation } = usePrediction();
  
  // Helper to determine confidence text and class
  const getConfidenceInfo = (confidence) => {
    if (!confidence) return { text: 'N/A', className: '' };
    
    const percentage = (confidence * 100).toFixed(2);
    
    if (confidence >= 0.8) {
      return { text: `${percentage}% (High)`, className: 'confidence-high' };
    } else if (confidence >= 0.6) {
      return { text: `${percentage}% (Medium)`, className: 'confidence-medium' };
    } else {
      return { text: `${percentage}% (Low)`, className: 'confidence-low' };
    }
  };
  
  // If no prediction data is available
  if (!prediction) {
    return (
      <div className="report-no-data">
        <h1>No Prediction Data Available</h1>
        <p>Please analyze a retinal image first to generate a report.</p>
        <Link to="/analysis" className="analyze-button">Go to Analysis</Link>
      </div>
    );
  }
  
  // Get confidence information
  const confidenceInfo = getConfidenceInfo(prediction.confidence);
  
  // Get doctor's recommendation based on predicted disease
  const recommendation = getDoctorsRecommendation();
  
  return (
    <div className="report-page">
      <h1>Retinal Analysis Report</h1>
      
      <div className="report-container">
        <div className="report-header">
          <div className="report-title">Ophthalmology Department</div>
          <div className="report-date">Date: {reportDate}</div>
        </div>
        
        {/* Patient Information Section */}
        <div className="report-section">
          <h2>Patient Information</h2>
          <div className="report-field">
            <div className="report-label">Patient Name:</div>
            <div className="report-value">{patientInfo.name}</div>
          </div>
          <div className="report-field">
            <div className="report-label">Patient ID:</div>
            <div className="report-value">{patientInfo.id}</div>
          </div>
          <div className="report-field">
            <div className="report-label">Age:</div>
            <div className="report-value">{patientInfo.age}</div>
          </div>
          <div className="report-field">
            <div className="report-label">Gender:</div>
            <div className="report-value">{patientInfo.gender}</div>
          </div>
        </div>
        
        {/* Analysis Results Section */}
        <div className="report-section">
          <h2>Retinal Analysis Results</h2>
          
          <div className="report-field">
            <div className="report-label">Examination Date:</div>
            <div className="report-value">{reportDate}</div>
          </div>
          
          <div className="report-field">
            <div className="report-label">Disease Classification:</div>
            <div className="report-value">{prediction.class}</div>
          </div>
          
          <div className="report-field">
            <div className="report-label">Condition Detected:</div>
            <div className="report-value">{prediction.label}</div>
          </div>
          
          <div className="report-field">
            <div className="report-label">Confidence Level:</div>
            <div className={`report-value ${confidenceInfo.className}`}>
              {confidenceInfo.text}
            </div>
          </div>
          
          {/* Show the retinal image if available */}
          {uploadedImage && (
            <div className="report-field report-image-field">
              <div className="report-label">Retinal Image:</div>
              <div className="report-value">
                <img 
                  src={uploadedImage} 
                  alt="Patient's retinal scan" 
                  className="report-image" 
                />
              </div>
            </div>
          )}
        </div>
        
        {/* Doctor's Recommendation Section */}
        <div className="report-section">
          <h2>Assessment & Recommendations</h2>
          <div className="doctor-recommendation">
            {recommendation}
          </div>
        </div>
        
        {/* Doctor's Signature Section */}
        <div className="report-section signature-section">
          <div className="signature-line"></div>
          <div className="doctor-name">Dr. Sarah Johnson</div>
          <div className="doctor-title">Ophthalmologist</div>
        </div>
        
        {/* Link to Print Version */}
        <div className="report-footer">
          <Link to="/print" className="print-link">
            View Printable Version
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Report;
