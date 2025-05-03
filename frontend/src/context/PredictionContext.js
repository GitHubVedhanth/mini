
import React, { createContext, useState, useContext, useEffect } from 'react';

// Create a context to share prediction results between pages
const PredictionContext = createContext();

// Custom hook to easily access the prediction context
export const usePrediction = () => useContext(PredictionContext);

// Provider component to wrap around our app
export const PredictionProvider = ({ children }) => {
  // State to store the prediction result
  const [prediction, setPrediction] = useState(null);
  
  // State to store the uploaded image
  const [uploadedImage, setUploadedImage] = useState(null);

  // State to check if backend is ready
  const [isBackendReady, setIsBackendReady] = useState(false);
  
  // Patient info (using dummy fixed values as specified in requirements)
  const patientInfo = {
    name: "John Doe",
    id: "PAT-12345",
    age: 45,
    gender: "Male"
  };
  
  // Current date for the report
  const reportDate = new Date().toLocaleDateString();

  // Check if backend is ready
  useEffect(() => {
    const checkBackendHealth = async () => {
      try {
        // Determine API URL based on environment
        const apiUrl = 'http://localhost:5000/health';

        const response = await fetch(apiUrl, {
          method: 'GET',
        });

        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        if (data.status === 'ready') {
          setIsBackendReady(true);
        }
      } catch (error) {
        console.error('Backend not ready yet:', error.message);
        setTimeout(checkBackendHealth, 1000); // Retry after 1 second
      }
    };

    checkBackendHealth();
  }, []);
  
  // Function to update prediction results
  const updatePrediction = (result, imageURL) => {
    setPrediction(result);
    setUploadedImage(imageURL);
  };
  
  // Generate doctor's recommendation based on disease
  const getDoctorsRecommendation = () => {
    if (!prediction) return "No prediction data available.";
    
    switch(prediction.label) {
      case "Normal":
        return "No signs of retinal disease detected. Regular annual eye check-up recommended.";
      case "Diabetic Retinopathy":
        return "Signs of diabetic retinopathy detected. Immediate consultation with ophthalmologist recommended. Blood sugar monitoring and management is crucial.";
      case "Glaucoma":
        return "Signs of glaucoma detected. Follow-up with glaucoma specialist recommended. Regular intraocular pressure monitoring needed.";
      case "Cataract":
        return "Signs of cataract detected. Consider consultation with ophthalmologist to discuss potential treatment options.";
      case "AMD":
        return "Signs of age-related macular degeneration (AMD) detected. Lifestyle modifications and AREDS supplements may be beneficial. Follow-up with retina specialist recommended.";
      default:
        return "Further evaluation by specialist recommended to confirm diagnosis and determine appropriate treatment plan.";
    }
  };

  // Values to provide to consuming components
  const value = {
    prediction,
    uploadedImage,
    patientInfo,
    reportDate,
    isBackendReady,
    updatePrediction,
    getDoctorsRecommendation
  };

  return (
    <PredictionContext.Provider value={value}>
      {children}
    </PredictionContext.Provider>
  );
};
