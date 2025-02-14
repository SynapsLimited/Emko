// src/components/Contact.jsx
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import './../css/contact.css'; 
import ContactForm from '../components/ContactForm';
import Hero from './../components/Hero';

const Contact = () => {
  const { t } = useTranslation();
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollPosition(window.pageYOffset);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div>
      <Helmet>
        <title>{t('contact.pageTitle')}</title>
        <meta name="description" content="Contact Emko for high-quality furniture solutions for your office or educational institution." />
        <meta property="og:title" content={t('contact.pageTitle')} />
        <meta property="og:description" content="Contact Emko for high-quality furniture solutions for your office or educational institution." />
        <meta property="og:image" content="https://www.emko-client.vercel.app/assets/emko-logo.png" />
        <meta property="og:url" content="https://www.emko-client.vercel.app/contact" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="canonical" href="https://www.emko-client.vercel.app/contact" />
      </Helmet>

      <Hero type="contact" scrollPosition={scrollPosition} title={t('contact.heroTitle')} />

      <div className="contact-overview-title">
        <h1>{t('contact.formTitle')}</h1>
        <p>{t('contact.formSubtitle')}</p>
      </div>

      <div className="contact-section">
        <div className="location-section">
          <section data-aos="fade-up" className="map-section">
            <div className="map-container">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d2997.2010830856407!2d19.74154107605541!3d41.30448897131043!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zNDHCsDE4JzE2LjIiTiAxOcKwNDQnMzguOCJF!5e0!3m2!1sen!2s!4v1732444953746!5m2!1sen!2s" 
                width="auto" 
                height="auto" 
                loading="lazy" 
                title={t('contact.map.iframeTitle')}
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </section>
        </div>

        <div className="form-section">
          <ContactForm />
        </div>
      </div>
    </div>
  );
};

export default Contact;
