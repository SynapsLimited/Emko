// src/pages/About.jsx
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import Hero from '../components/Hero';
import { useTranslation } from 'react-i18next';

const About = () => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const { t } = useTranslation();

  useEffect(() => {
    const handleScroll = () => setScrollPosition(window.pageYOffset);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="bg-gray-50">
      <Helmet>
        <title>{t('about.pageTitle')}</title>
        <meta name="description" content="Learn more about Emko, a trusted manufacturer of high-quality furniture solutions for offices and educational institutions." />
        <meta property="og:title" content={t('about.pageTitle')} />
        <meta property="og:description" content="Learn more about Emko, a trusted manufacturer of high-quality furniture solutions for offices and educational institutions." />
        <meta property="og:image" content="https://www.emko-client.vercel.app/assets/emko-logo.png" />
        <meta property="og:url" content="https://www.emko-client.vercel.app/about" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="canonical" href="https://www.emko-client.vercel.app/about" />
      </Helmet>

      <Hero type="about" scrollPosition={scrollPosition} title={t('about.heroTitle')} />

      <main className="container mx-auto px-4 py-12">
        <div className="space-y-16">
          <section className="intro-section">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="intro-text md:w-1/2 space-y-4">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">{t('about.whoAreWeTitle')}</h2>
                <p className="text-gray-600 leading-relaxed" dangerouslySetInnerHTML={{ __html: t('about.whoAreWeText') }} />
                <a className="btn btn-primary" href="/projects">
                  {t('about.projectsButton')}
                </a>
              </div>
              <div className="intro-image md:w-1/2">
                <img
                  src="https://emkoprototip.files.wordpress.com/2023/09/slider3.jpg"
                  alt="EMKO Slider"
                  className="rounded-lg shadow-xl transition duration-300 ease-in-out transform hover:scale-105"
                />
              </div>
            </div>
          </section>

          <section className="vision-mission bg-white rounded-xl shadow-lg p-8 transition duration-300 ease-in-out transform hover:-translate-y-2 hover:shadow-xl">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="text-center space-y-4">
                <h2 className="text-2xl font-bold text-gray-800">{t('about.visionTitle')}</h2>
                <img
                  src="https://emkoprototip.files.wordpress.com/2023/09/binoculars.png"
                  alt="Vision Icon"
                  className="mx-auto w-16 h-16"
                />
                <p className="text-gray-600">{t('about.visionText')}</p>
              </div>
              <div className="text-center space-y-4">
                <h2 className="text-2xl font-bold text-gray-800">{t('about.missionTitle')}</h2>
                <img
                  src="https://emkoprototip.files.wordpress.com/2023/09/mission.png"
                  alt="Mission Icon"
                  className="mx-auto w-16 h-16"
                />
                <p className="text-gray-600">{t('about.missionText')}</p>
              </div>
            </div>
          </section>

          <section className="values-section">
            <h1 className="text-4xl font-bold text-center text-gray-800 mb-12">{t('about.valuesTitle')}</h1>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: t('about.value1Title'),
                  icon: "https://emkoprototip.files.wordpress.com/2023/09/trust.png",
                  description: t('about.value1Text')
                },
                {
                  title: t('about.value2Title'),
                  icon: "https://emkoprototip.files.wordpress.com/2023/09/badge.png",
                  description: t('about.value2Text')
                },
                {
                  title: t('about.value3Title'),
                  icon: "https://emkoprototip.files.wordpress.com/2023/09/suitcase.png",
                  description: t('about.value3Text')
                }
              ].map((value, index) => (
                <div key={index} className="bg-white rounded-xl shadow-lg p-6 transition duration-300 ease-in-out transform hover:-translate-y-2 hover:shadow-xl">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">{value.title}</h2>
                  <img src={value.icon} alt={`${value.title} Icon`} className="mx-auto w-16 h-16 mb-4" />
                  <p className="text-gray-600">{value.description}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default About;
