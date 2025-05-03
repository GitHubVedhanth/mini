
import React, { useEffect } from 'react';
import { usePrediction } from '../context/PredictionContext';
import './Print.css';

const Print = () => {
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
  
  // Handle print functionality
  const handlePrint = () => {
    window.print();
  };
  
  // If no prediction data is available
  if (!prediction) {
    return (
      <div className="print-no-data">
        <h1>No Prediction Data Available</h1>
        <p>Please analyze a retinal image first to generate a printable report.</p>
        <a href="/analysis" className="analyze-button">Go to Analysis</a>
      </div>
    );
  }
  
  // Get confidence information
  const confidenceInfo = getConfidenceInfo(prediction.confidence);
  
  // Get doctor's recommendation based on predicted disease
  const recommendation = getDoctorsRecommendation();
  
  return (
    <div className="print-page">
      <div className="print-controls">
        <h1>Print Report</h1>
        <button onClick={handlePrint} className="print-button">
          Print Report
        </button>
      </div>
      
      <div className="print-container">
        <div className="print-header">
          <div className="hospital-info">
            <div className="hospital-name">Central Eye Hospital</div>
            <div className="hospital-address">123 Vision Street, Eyecare City</div>
            <div className="hospital-contact">Tel: (123) 456-7890 | Email: info@eyehospital.com</div>
          </div>
          <div className="report-title">Retinal Analysis Report</div>
          <div className="report-id">Report ID: RA-{Math.floor(Math.random() * 10000)}</div>
        </div>
        
        <div className="print-divider"></div>
        
        {/* Patient Information Section */}
        <div className="print-section">
          <h2>Patient Information</h2>
          <div className="print-grid">
            <div className="print-field">
              <div className="print-label">Patient Name:</div>
              <div className="print-value">{patientInfo.name}</div>
            </div>
            <div className="print-field">
              <div className="print-label">Patient ID:</div>
              <div className="print-value">{patientInfo.id}</div>
            </div>
            <div className="print-field">
              <div className="print-label">Age:</div>
              <div className="print-value">{patientInfo.age}</div>
            </div>
            <div className="print-field">
              <div className="print-label">Gender:</div>
              <div className="print-value">{patientInfo.gender}</div>
            </div>
            <div className="print-field">
              <div className="print-label">Examination Date:</div>
              <div className="print-value">{reportDate}</div>
            </div>
          </div>
        </div>
        
        {/* Analysis Results Section */}
        <div className="print-section">
          <h2>Retinal Analysis Results</h2>
          
          <div className="print-field">
            <div className="print-label">Disease Classification:</div>
            <div className="print-value">{prediction.class}</div>
          </div>
          
          <div className="print-field">
            <div className="print-label">Condition Detected:</div>
            <div className="print-value">{prediction.label}</div>
          </div>
          
          <div className="print-field">
            <div className="print-label">Confidence Level:</div>
            <div className={`print-value ${confidenceInfo.className}`}>
              {confidenceInfo.text}
            </div>
          </div>
        </div>
        
        {/* Image Section */}
        {uploadedImage && (
          <div className="print-section image-section">
            <h2>Retinal Image</h2>
            <div className="print-image-container">
              <img 
                src={uploadedImage} 
                alt="Patient's retinal scan" 
                className="print-image" 
              />
            </div>
          </div>
        )}
        
        {/* Doctor's Recommendation Section */}
        <div className="print-section">
          <h2>Assessment & Recommendations</h2>
          <div className="doctor-recommendation">
            {recommendation}
          </div>
        </div>
        
        {/* Footer with signatures */}
        <div className="print-footer">
          <div className="signature-block">
            <div className="signature-line"></div>
            <div className="signature-name">Dr. Sarah Johnson</div>
            <div className="signature-title">Ophthalmologist</div>
          </div>
          
          <div className="print-date">
            <div>Report Generated: {reportDate}</div>
          </div>
          
          <div className="signature-block">
            <div className="signature-line"></div>
            <div className="signature-name">Patient Signature</div>
            <div className="signature-title">{patientInfo.name}</div>
          </div>
        </div>
        
        <div className="print-disclaimer">
          This is a computer-generated report using AI-assisted diagnosis. 
          The results should be verified by a healthcare professional.
        </div>
      </div>
    </div>
  );
};

export default Print;
