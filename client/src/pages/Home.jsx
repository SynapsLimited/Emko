// src/pages/Home.jsx
import React, { useEffect, useState } from 'react';
import './../css/home.css';
import StatsSection from '../components/StatsSection';
import ProductsSection from '../components/ProductsSection.jsx';
import { Helmet } from 'react-helmet-async';
import Hero from '../components/Hero';
import { useTranslation } from 'react-i18next';

const Home = () => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const handleScroll = () => setScrollPosition(window.pageYOffset);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.1 });
    const target = document.getElementById('stats-section');
    if (target) observer.observe(target);
    return () => { if (target) observer.unobserve(target); };
  }, []);

  return (
    <div>
      <Helmet>
        <title>{t('home.pageTitle')}</title>
        <meta name="description" content="Welcome to Emko, your trusted partner for high-quality furniture solutions for offices and educational institutions." />
        <meta property="og:title" content={t('home.pageTitle')} />
        <meta property="og:description" content="Welcome to Emko, your trusted partner for high-quality furniture solutions for offices and educational institutions." />
        <meta property="og:image" content="https://www.emko-client.vercel.app/assets/emko-logo.png" />
        <meta property="og:url" content="https://www.emko-client.vercel.app/" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="canonical" href="https://www.emko-client.vercel.app/" />
      </Helmet>

      <Hero type="home" scrollPosition={scrollPosition} />

      <main>
        <section className="about-section">
          <div className="container">
            <p className="section-subtitle">{t('home.aboutSubtitle')}</p>
            <h2 className="section-title">{t('home.aboutTitle')}</h2>
            <p className="section-description">{t('home.aboutDescription')}</p>
            <a href="/about" className="btn btn-primary margin-top">
              {t('navbar.about')}
            </a>
          </div>
        </section>

        <StatsSection />
        <ProductsSection />
      </main>
    </div>
  );
};

export default Home;
