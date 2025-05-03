
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Analysis from './pages/Analysis';
import Report from './pages/Report';
import Print from './pages/Print';
import './App.css';

// Global state to share prediction results between pages
import { PredictionProvider } from './context/PredictionContext';

function App() {
  return (
    <PredictionProvider>
      <Router>
        <div className="App">
          <Navbar />
          <div className="content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/analysis" element={<Analysis />} />
              <Route path="/report" element={<Report />} />
              <Route path="/print" element={<Print />} />
            </Routes>
          </div>
        </div>
      </Router>
    </PredictionProvider>
  );
}

export default App;
