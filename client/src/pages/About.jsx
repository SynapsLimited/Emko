// src/pages/About.jsx

import React, { useState, useEffect } from 'react';
import './../css/about.css';
import { Helmet } from 'react-helmet-async';
import Hero from '../components/Hero'; // Import the updated Hero component

const About = () => {
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
        <title>Emko - Rreth Nesh</title>
      </Helmet> 

      {/* New Hero Component for About Page */}
      <Hero
        type="about"
        scrollPosition={scrollPosition}
        title="Rreth Nesh"
        description="Mësoni më shumë rreth historisë dhe vlerave tona."
      />

      <main className="main-group">
        <div className="entry-content">
          <section className="intro-section">
            <div className="intro-columns">
              <div className="intro-text">
                <h2>Kush jemi ne?</h2>
                <p>
                  Me një përvojë të pasur dhe të gjatë në tregun shqiptar dhe rajonal si prodhues i patentuar prej 18 vitesh nga institucione ndërkombëtare, <strong>EMKO</strong> ka ndërtuar një emër të respektuar dhe një histori te gjate suksesi. Ne ofrojmë një gamë të gjerë produktesh të mobilimit të zyrave dhe institucioneve arsimore, të dizajnuara dhe prodhuara sipas standardeve më të larta të cilësisë, gjithashtu të përshtatura sipas dëshirave specifike të çdo klienti. Për ne, çdo klient është i rëndësishëm dhe kërkesat tuaja janë prioriteti ynë. Nëpërmjet zgjedhjes sonë, ju do të përfitoni jo vetëm nga cilësia e produkteve tona, por edhe nga një shërbim i shkëlqyeshëm dhe përkrahja që meritoni.
                </p>
                <a className="btn btn-secondary" href="/projects">
                  Projektet tona
                </a>
              </div>
              <div className="intro-image">
                <img
                  src="https://emkoprototip.files.wordpress.com/2023/09/slider3.jpg"
                  alt="EMKO Slider"
                />
              </div>
            </div>
          </section>

          <section className="vision-mission">
            <div className="columns">
              <div className="column">
                <h2>Vizioni ynë</h2>
                <img
                  src="https://emkoprototip.files.wordpress.com/2023/09/binoculars.png"
                  alt="Vision Icon"
                />
                <p>
                  Vizioni ynë është të jemi lider në tregun shqiptar dhe internacional të mobiljeve duke ofruar produkte me kualitet të lartë dhe vlera estetike të pakrahasueshme.
                </p>
              </div>
              <div className="column">
                <h2>Misioni ynë</h2>
                <img
                  src="https://emkoprototip.files.wordpress.com/2023/09/mission.png"
                  alt="Mission Icon"
                />
                <p>
                  Misioni ynë është ti përmbushim nevojat dhe kërkesat e klientëve tanë duke vënë në pah vlerat e kompanisë sonë; korrektësi, cilësi, profesionalizëm.
                </p>
              </div>
            </div>
          </section>

          <section className="values-section">
            <h1>Vlerat tona</h1>
            <div className="columns">
              <div className="column">
                <h2>Korrektësi</h2>
                <img
                  src="https://emkoprototip.files.wordpress.com/2023/09/trust.png"
                  alt="Trust Icon"
                />
                <p>
                  Në EMKO, ne përqendrohemi në çdo detaj të planifikimit dhe koordinimit për të garantuar që klientët tanë të përjetojnë një nivel të lartë korrektësie në secilën porosi të realizuar. Kompania Emko është prodhues dhe përshtatet lehtë me dizajnet dhe kërkesat tuaja specifike. Me një angazhim të palëkundur për të plotësuar kërkesat tuaja, ne sigurojmë që produktet të dorëzohen në kohë dhe në përputhje me afatin e caktuar.
                </p>
              </div>
              <div className="column">
                <h2>Cilësi</h2>
                <img
                  src="https://emkoprototip.files.wordpress.com/2023/09/badge.png"
                  alt="Quality Icon"
                />
                <p>
                  Produktet tona janë inovative dhe efikase për të kompletuar ambientet tuaja. Bashkëpunimi jonë me partnerët e njohur ndërkombëtarë, si partnerët e njohur italianë, na jep mundësinë të sjellim në treg produktet më inovative dhe të fundit në fushën e mobilimit. Ky gërshetim i përvojës sonë 25-vjeçare me patentime dhe ekspertizë ndërkombëtare siguron që ju të merrni produktet më të mira për nevojat tuaja.
                </p>
              </div>
              <div className="column">
                <h2>Profesionalizëm</h2>
                <img
                  src="https://emkoprototip.files.wordpress.com/2023/09/suitcase.png"
                  alt="Professionalism Icon"
                />
                <p>
                  Një ndër pikat tona të forta është angazhimi i palëkundur ndaj cilësisë dhe shërbimit të klientit. Me çertifikatën e cilësisë <strong>UNE-EN-ISO 9001/08</strong>, ne dëshmojmë përkushtimin tonë për prodhimin dhe ofrimin e produkteve të cilësisë së lartë. Ekipi ynë profesional është gjithmonë në dispozicion tuaj për të ofruar asistencë teknike dhe zgjidhje për çdo nevojë të mobilimit.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default About;
