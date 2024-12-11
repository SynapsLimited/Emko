// src/components/Hero.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import './../css/hero.css';
import HeroInteractive from './HeroInteractive'; // New component

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
            {isHome ? 'Mirë se vini në Emko' : title || 'Category Title or Page Title'}
          </h1>
          <p className="hero-content-description">
            {isHome
              ? 'Zbuloni produktet dhe projektet fantastike të Emkos që kanë revolucionarizuar tregun shqiptar!'
              : description || 'A brief description for non-home heroes.'}
          </p>

          {/* Only on home hero */}
          {isHome && (
            <div className="hero-bottom-buttons">
              <Link to="/projects" className="btn btn-primary">Projects</Link>
              <Link to="/contact" className="btn btn-primary">Contact</Link>
            </div>
          )}
        </div>
      </div>

      {/* Interactive Section */}
      <HeroInteractive />
    </>
  );
};

export default Hero;
