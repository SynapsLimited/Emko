// src/pages/Certifications.jsx
'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Award,
  Shield,
  Recycle,
  Layers,
  CheckCircle,
  Zap
} from 'lucide-react';
import { Helmet } from 'react-helmet';
import '../css/certifications.css';
import Hero from './../components/Hero';
import { useTranslation } from 'react-i18next';

const Certifications = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [scrollPosition, setScrollPosition] = useState(0);
  const { t } = useTranslation();

  useEffect(() => {
    const handleScroll = () => setScrollPosition(window.pageYOffset);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const certifications = [
    {
      title: 'ISO 45001',
      description: 'Kjo çertifikatë e lëshuar nga organizata ndërkombëtare ISO konfirmon që EMKO përmbush të gjitha standartet për sigurinë, shëndetin dhe mirëqenien e puntorëve.',
      icon: <Shield className="icon" />
    },
    {
      title: 'UNI EN ISO 3834-2',
      description: 'Kjo çertifikatë konfirmon ruajtjen e standartit të cilësisë që EMKO ofron në konstrukte metalike dhe punime saldimi si në punishte ashtu edhe në vendet e instalimit në terren.',
      icon: <Award className="icon" />
    },
    {
      title: 'UNE EN ISO 9001',
      description: 'Kjo çertifikatë konfirmon kualitetin e Sistemit të Menaxhimit të Cilësisë që EMKO ofron, duke siguruar që kompania prodhon produkte me cilësi të lartë që plotësojnë nevojat e konsumatorëve.',
      icon: <CheckCircle className="icon" />
    },
    {
      title: 'EN ISO 14001',
      description: 'Kjo çertifikatë konfirmon që kompania EMKO përmbush të gjitha standartet e Sistemit të Menaxhimit për Mjedisin, të cilat sigurojnë që kompania i ka të gjitha vlerat e duhura mjedisore.',
      icon: <Recycle className="icon" />
    },
    {
      title: 'BS PAS 99',
      description: 'Kjo çertifikatë konfirmon arritjet e EMKO për Sistemin e Menaxhimit të Integruar, i cili mundëson standartizimin e proceseve dhe procedurave në një strukturë gjithëpërfshirëse që kompania të veprojë në mënyrë më efektive.',
      icon: <Layers className="icon" />
    },
    {
      title: 'UNI EN ISO 3834',
      description: 'Kjo çertifikatë konfirmon ruajtjen e standartit të cilësisë që EMKO ofron në konstrukte metalike dhe punime saldimi si në punishte ashtu edhe në vendet e instalimit në terren.',
      icon: <Zap className="icon" />
    }
  ];

  const nextSlide = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prevIndex) => (prevIndex === certifications.length - 1 ? 0 : prevIndex + 1));
  }, [certifications.length]);

  const prevSlide = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? certifications.length - 1 : prevIndex - 1));
  }, [certifications.length]);

  useEffect(() => {
    const timer = setInterval(() => nextSlide(), 4000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0
    })
  };

  return (
    <div>
      <Helmet>
        <title>{t('certifications.pageTitle')}</title>
        <meta name="description" content="Discover the international certifications held by Emko that validate our commitment to quality, safety, and environmental responsibility." />
        <meta property="og:title" content={t('certifications.pageTitle')} />
        <meta property="og:description" content="Discover the international certifications held by Emko that validate our commitment to quality, safety, and environmental responsibility." />
        <meta property="og:image" content="https://www.emko-client.vercel.app/assets/emko-logo.png" />
        <meta property="og:url" content="https://www.emko-client.vercel.app/certifications" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="canonical" href="https://www.emko-client.vercel.app/certifications" />
      </Helmet>

      <Hero type="certifications" scrollPosition={scrollPosition} title={t('certifications.heroTitle')} />

      <div className="certifications-container">
        <h2 className="certifications-title">{t('certifications.title')}</h2>
        <p className="certifications-subtitle">{t('certifications.subtitle')}</p>
        <div className="slider-container" style={{ height: '500px' }}>
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: 'spring', stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 }
              }}
              className="slider-motion-div"
            >
              <div className="slider-content">
                <div className="slider-content-top">
                  <div className="icon-container">{certifications[currentIndex].icon}</div>
                  <h3 className="certification-title">{certifications[currentIndex].title}</h3>
                </div>
                <div className="slider-content-bottom">
                  <p className="certification-description">{certifications[currentIndex].description}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
          <button onClick={prevSlide} className="slider-button slider-button-prev" aria-label={t('certifications.previous')}>
            <ChevronLeft className="slider-button-icon" />
          </button>
          <button onClick={nextSlide} className="slider-button slider-button-next" aria-label={t('certifications.next')}>
            <ChevronRight className="slider-button-icon" />
          </button>
        </div>
        <div className="slider-dots">
          {certifications.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setDirection(index > currentIndex ? 1 : -1);
                setCurrentIndex(index);
              }}
              className={`slider-dot ${index === currentIndex ? 'active' : ''}`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Certifications;
