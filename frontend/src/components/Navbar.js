
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  // Get current location to highlight active link
  const location = useLocation();
  
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <h2>Retinal Eye Report Viewer</h2>
      </div>
      <ul className="navbar-links">
        <li>
          <Link 
            to="/" 
            className={location.pathname === '/' ? 'active' : ''}
          >
            <i className="nav-icon home-icon"></i>
            Home
          </Link>
        </li>
        <li>
          <Link 
            to="/analysis" 
            className={location.pathname === '/analysis' ? 'active' : ''}
          >
            <i className="nav-icon analysis-icon"></i>
            Analysis
          </Link>
        </li>
        <li>
          <Link 
            to="/report" 
            className={location.pathname === '/report' ? 'active' : ''}
          >
            <i className="nav-icon report-icon"></i>
            Report
          </Link>
        </li>
        <li>
          <Link 
            to="/print" 
            className={location.pathname === '/print' ? 'active' : ''}
          >
            <i className="nav-icon print-icon"></i>
            Print
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
