// src/components/Products.jsx

import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import './../css/products.css';
import ProductsSection from '../components/ProductsSection';

function Products() {
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
        <title> Emko - Produkte </title>
      </Helmet>
      {/* Hero Section */}
  <div
    className="hero-container hero-container-normal hero-container-products"
    style={{ backgroundPositionY: `${scrollPosition * 0}px` }} // Apply parallax effect
  >



      <div className="hero-content">
     {/* Text Section */}
      <h1 className="hero-title"> Produkte </h1>

    </div>
  </div>

  <ProductsSection />

    </div>
  );
}

export default Products;
