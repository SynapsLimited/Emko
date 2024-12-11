// src/components/Contact.jsx

import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import './../css/contact.css'; 
import ContactForm from '../components/ContactForm';
import Hero from './../components/Hero'


const Contact = () => {
    const { t } = useTranslation();
    const [scrollPosition, setScrollPosition] = useState(0);

    // Track scroll position to apply parallax effect
    useEffect(() => {
      const handleScroll = () => {
        const position = window.pageYOffset;
        setScrollPosition(position);
      };
  
      window.addEventListener('scroll', handleScroll);
  
      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }, []);

    return (
        <div>
              <Helmet>
    <title>Emko - Kontakt</title>
  </Helmet> 

  {/* Hero Section */}
  <Hero
        type="contact"
        scrollPosition={scrollPosition}
        title="Kontakt"
        description="Na kontaktoni për çdo pyetje ose kërkesë."
      />



            <div className="contact-overview-title">
                <h1>Vendndodhja</h1>
            </div>

            <section data-aos="fade-up" className="map-section container">
      <div className="map-container">
      <iframe src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d2997.2010830856407!2d19.74154107605541!3d41.30448897131043!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zNDHCsDE4JzE2LjIiTiAxOcKwNDQnMzguOCJF!5e0!3m2!1sen!2s!4v1732444953746!5m2!1sen!2s" 
            width="auto" 
            height="auto" 
            loading="lazy" 
            title={t('contact.map.iframeTitle')}
        ></iframe>
      </div>
    </section>

            <div className="contact-overview-title">
                <h1>Plotëso formularin</h1>
                <p>Plotëso formularin tani dhe ne do t'ju kontaktojmë brenda 24 orëve të ardhshme!</p>
            </div>

            <ContactForm />
        </div>
    );
};

export default Contact;
