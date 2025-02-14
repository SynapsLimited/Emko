// src/components/Products.jsx
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import './../css/products.css';
import ProductsSection from '../components/ProductsSection.jsx';
import Hero from './../components/Hero';

function Products() {
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
        <title>{t('products.pageTitle')}</title>
        <meta name="description" content="Discover Emko's range of high-quality furniture solutions designed to meet the needs of offices and educational institutions." />
        <meta property="og:title" content={t('products.pageTitle')} />
        <meta property="og:description" content="Discover Emko's range of high-quality furniture solutions designed to meet the needs of offices and educational institutions." />
        <meta property="og:image" content="https://www.emko-client.vercel.app/assets/emko-logo.png" />
        <meta property="og:url" content="https://www.emko-client.vercel.app/products" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="canonical" href="https://www.emko-client.vercel.app/products" />
      </Helmet>
      <Hero type="products" scrollPosition={scrollPosition} title={t('products.heroTitle')} />
      <ProductsSection />
    </div>
  );
}

export default Products;
