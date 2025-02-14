// src/components/Hero.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './../css/hero.css';
import { useTranslation } from 'react-i18next';

const Hero = ({ type = 'home', scrollPosition, title, description }) => {
  const { t } = useTranslation();
  const isHome = type === 'home';

  // State to determine if device is desktop
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1025);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1025);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Determine background position based on hero type and device width
  const getBackgroundPosition = () => {
    if (!isDesktop) return 'center'; // No push on mobile or tablet
    if (type === 'home') return 'center -100px'; // Home: move up 100px
    if (type === 'projects') return 'center -200px'; // Projects: move up 200px
    return 'center';
  };

  return (
    <div
      className={`hero-container hero-container-${type} hero-wrapper`}
      style={{ backgroundPosition: getBackgroundPosition() }}
    >
      <div className="hero-content">
        <h1 className="hero-content-title">
          {isHome ? t('hero.welcome') : title || t('hero.defaultTitle')}
        </h1>
        {description && (
          <p className="hero-content-description">{description}</p>
        )}
      </div>
    </div>
  );
};

export default Hero;
