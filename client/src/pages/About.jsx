// src/pages/About.jsx

import React, { useState, useEffect } from 'react';
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
    <div className="bg-gray-50">
      <Helmet>
        <title>Emko - Rreth Nesh</title>
      </Helmet> 

      {/* New Hero Component for About Page */}
      <Hero
        type="about"
        scrollPosition={scrollPosition}
        title="Rreth Nesh"
      />

      <main className="container mx-auto px-4 py-12">
        <div className="space-y-16">
          <section className="intro-section">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="intro-text md:w-1/2 space-y-4">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Kush jemi ne?</h2>
                <p className="text-gray-600 leading-relaxed">
                  Me një përvojë të pasur dhe të gjatë në tregun shqiptar dhe rajonal si prodhues i patentuar prej 18 vitesh nga institucione ndërkombëtare, <strong>EMKO</strong> ka ndërtuar një emër të respektuar dhe një histori te gjate suksesi. Ne ofrojmë një gamë të gjerë produktesh të mobilimit të zyrave dhe institucioneve arsimore, të dizajnuara dhe prodhuara sipas standardeve më të larta të cilësisë, gjithashtu të përshtatura sipas dëshirave specifike të çdo klienti. Për ne, çdo klient është i rëndësishëm dhe kërkesat tuaja janë prioriteti ynë. Nëpërmjet zgjedhjes sonë, ju do të përfitoni jo vetëm nga cilësia e produkteve tona, por edhe nga një shërbim i shkëlqyeshëm dhe përkrahja që meritoni.
                </p>
                <a className="btn btn-primary" href="/projects">
                  Projektet tona
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
                <h2 className="text-2xl font-bold text-gray-800">Vizioni ynë</h2>
                <img
                  src="https://emkoprototip.files.wordpress.com/2023/09/binoculars.png"
                  alt="Vision Icon"
                  className="mx-auto w-16 h-16"
                />
                <p className="text-gray-600">
                  Vizioni ynë është të jemi lider në tregun shqiptar dhe internacional të mobiljeve duke ofruar produkte me kualitet të lartë dhe vlera estetike të pakrahasueshme.
                </p>
              </div>
              <div className="text-center space-y-4">
                <h2 className="text-2xl font-bold text-gray-800">Misioni ynë</h2>
                <img
                  src="https://emkoprototip.files.wordpress.com/2023/09/mission.png"
                  alt="Mission Icon"
                  className="mx-auto w-16 h-16"
                />
                <p className="text-gray-600">
                  Misioni ynë është ti përmbushim nevojat dhe kërkesat e klientëve tanë duke vënë në pah vlerat e kompanisë sonë; korrektësi, cilësi, profesionalizëm.
                </p>
              </div>
            </div>
          </section>

          <section className="values-section">
            <h1 className="text-4xl font-bold text-center text-gray-800 mb-12">Vlerat tona</h1>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: "Korrektësi",
                  icon: "https://emkoprototip.files.wordpress.com/2023/09/trust.png",
                  description: "Në EMKO, ne përqendrohemi në çdo detaj të planifikimit dhe koordinimit për të garantuar që klientët tanë të përjetojnë një nivel të lartë korrektësie në secilën porosi të realizuar. Kompania Emko është prodhues dhe përshtatet lehtë me dizajnet dhe kërkesat tuaja specifike. Me një angazhim të palëkundur për të plotësuar kërkesat tuaja, ne sigurojmë që produktet të dorëzohen në kohë dhe në përputhje me afatin e caktuar."
                },
                {
                  title: "Cilësi",
                  icon: "https://emkoprototip.files.wordpress.com/2023/09/badge.png",
                  description: "Produktet tona janë inovative dhe efikase për të kompletuar ambientet tuaja. Bashkëpunimi jonë me partnerët e njohur ndërkombëtarë, si partnerët e njohur italianë, na jep mundësinë të sjellim në treg produktet më inovative dhe të fundit në fushën e mobilimit. Ky gërshetim i përvojës sonë 25-vjeçare me patentime dhe ekspertizë ndërkombëtare siguron që ju të merrni produktet më të mira për nevojat tuaja."
                },
                {
                  title: "Profesionalizëm",
                  icon: "https://emkoprototip.files.wordpress.com/2023/09/suitcase.png",
                  description: "Një ndër pikat tona të forta është angazhimi i palëkundur ndaj cilësisë dhe shërbimit të klientit. Me çertifikatën e cilësisë UNE-EN-ISO 9001/08, ne dëshmojmë përkushtimin tonë për prodhimin dhe ofrimin e produkteve të cilësisë së lartë. Ekipi ynë profesional është gjithmonë në dispozicion tuaj për të ofruar asistencë teknike dhe zgjidhje për çdo nevojë të mobilimit."
                }
              ].map((value, index) => (
                <div key={index} className="bg-white rounded-xl shadow-lg p-6 transition duration-300 ease-in-out transform hover:-translate-y-2 hover:shadow-xl">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">{value.title}</h2>
                  <img
                    src={value.icon}
                    alt={`${value.title} Icon`}
                    className="mx-auto w-16 h-16 mb-4"
                  />
                  <p className="text-gray-600">
                    {value.description}
                  </p>
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