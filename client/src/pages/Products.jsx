// src/components/Products.jsx

import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import './../css/products.css';
import ProductsSection from '../components/ProductsSection.jsx';
import Hero from './../components/Hero'

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
      {/* Updated Hero Component for Products Page */}
      <Hero
        type="products"
        scrollPosition={scrollPosition}
        title="Produkte"
      />

  <ProductsSection />

    </div>
  );
}

export default Products;
