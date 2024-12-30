// src/pages/Home.jsx

import React, { useEffect, useState } from 'react';
import './../css/home.css';
import StatsSection from '../components/StatsSection';
import ProductsSection from '../components/ProductsSection.jsx';
import { Helmet } from 'react-helmet-async';
import Hero from '../components/Hero'; // Import the updated Hero component

const Home = () => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

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

  // Observe when stats section comes into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    const target = document.getElementById('stats-section');
    if (target) observer.observe(target);

    return () => {
      if (target) observer.unobserve(target);
    };
  }, []);

  // Define stats data
  const stats = [
    { title: 'Klientë të kënaqur', value: 500 },
    { title: 'Vite Eksperiencë', value: 28 },
    { title: 'Projekte të realizuara', value: 100 },
    { title: 'Zyra Qendrore', value: 4 },
  ];

  return (
    <div>
      <Helmet>
        <title>Emko</title>
      </Helmet> 

      {/* New Hero Component */}
      <Hero type="home" scrollPosition={scrollPosition} />

      <main>
        {/* About Us Section */}
        <section className="about-section">
          <div className="container">
            <p className="section-subtitle">Rreth nesh</p>
            <h2 className="section-title">Pse ne jemi zgjedhja e duhur?</h2>
            <p className="section-description">
              Me një përvojë të pasur dhe të gjatë në tregun shqiptar dhe rajonal
              si prodhues i patentuar prej 18 vitesh nga institucione
              ndërkombëtare, EMKO ka ndërtuar një emër të respektuar dhe një
              histori të gjatë suksesi. Ne ofrojmë një gamë të gjerë produktesh
              të mobilimit të zyrave dhe institucioneve arsimore, të dizajnuara
              dhe prodhuara sipas standardeve më të larta të cilësisë, gjithashtu
              të përshtatura sipas dëshirave specifike të çdo klienti. Për ne,
              çdo klient është i rëndësishëm dhe kërkesat tuaja janë prioriteti
              ynë. Nëpërmjet zgjedhjes sonë, ju do të përfitoni jo vetëm nga
              cilësia e produkteve tona, por edhe nga një shërbim i shkëlqyeshëm
              dhe përkrahja që meritoni.
            </p>
            <a href="/about" className="btn btn-primary margin-top">
              Rreth Nesh
            </a>
          </div>
        </section>

        {/* Stats Section */}
        <StatsSection />

        {/* Products Section */}
        <ProductsSection />
      </main>
    </div>
  );
};

export default Home;
