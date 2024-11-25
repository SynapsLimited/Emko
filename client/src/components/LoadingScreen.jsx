// LoadingScreen.jsx
import React from 'react';
import './../css/loadingscreen.css'; // Import your CSS styles
import logoWhite from '../assets/emko-logo.png'; // Adjust the path as necessary

function LoadingScreen() {
  return (
    <div className="loading-container">
      <div className="spinner-container">
        {/* Logo Image */}
        <img src={logoWhite} alt="Logo" className="logo-image" />

        {/* Circles */}
        <div className="outer-circle">
          <div className="inner-circle"></div>
        </div>


        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
}

export default LoadingScreen;
