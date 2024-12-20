// src/components/Hero.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import './../css/hero.css';

const Hero = ({ type = 'home', scrollPosition, title, description }) => {
  const isHome = type === 'home';

  // Define a mapping for background images if not using CSS classes
  // Alternatively, ensure CSS classes handle background images as shown above

  return (
    <>
      <div
        className={`hero-container hero-container-${type} hero-wrapper`}
        style={{ backgroundPositionY: `${scrollPosition * 0}px` }}
      >
        <div className="hero-content">
          {/* Title and description */}
          <h1 className="hero-content-title">
            {isHome ? 'Welcome to Emko' : title || 'Category Title or Page Title'}
          </h1>

        </div>
      </div>


    </>
  );
};

export default Hero;
