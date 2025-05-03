
import React from 'react';
import { Link } from 'react-router-dom';
import { usePrediction } from '../context/PredictionContext';
import './Home.css';

const Home = () => {
  const { isBackendReady } = usePrediction();
  
  return (
    <div className="home-container">
      <h1>Welcome to Retinal Disease Prediction</h1>
      
      {/* Backend status indicator */}
      <div className={`backend-status ${isBackendReady ? 'online' : 'offline'}`}>
        Backend Status: {isBackendReady ? 'Connected' : 'Disconnected'}
      </div>
      
      <div className="home-content">
        <div className="home-section">
          <h2>About Our Project</h2>
          <p>
            Our Retinal Disease Prediction system uses advanced image processing and machine learning 
            techniques to analyze retinal images and detect potential eye diseases with high accuracy.
          </p>
          <p>
            Early detection of retinal diseases is crucial for preventing vision loss and blindness. 
            Our tool helps healthcare professionals quickly screen patients and prioritize those 
            who need immediate specialist care.
          </p>
        </div>
        
        {/* ... keep existing code (how it works, diseases detection, CTA sections) */}
      </div>
    </div>
  );
};

export default Home;
