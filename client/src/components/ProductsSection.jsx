// src/components/ProductsSection.jsx

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import ProductItem from '../products/ProductItem';
import { useTranslation } from 'react-i18next';
import categoriesData from '../data/categories'; // Adjust the path if necessary
import { Link } from 'react-router-dom'; // Import Link for navigation

const ProductsSection = () => {
  const { i18n, t } = useTranslation();
  const currentLang = i18n.language === 'en' ? 'en' : 'sq';

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch categories (from hardcoded data)
  useEffect(() => {
    setCategories(categoriesData);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <section className="products-section bg-gray-100 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p>Loading categories...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="products-section bg-gray-100 py-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="section-subtitle text-center text-primary font-semibold mb-2">
            {t('Our Products')}
          </p>
          <h2 className="section-title text-4xl font-bold text-center mb-4">
            {t('Explore Our Categories')}
          </h2>
          <p className="section-description text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            {currentLang === 'en'
              ? "Discover our wide range of furniture solutions designed for various institutional needs. From office spaces to educational environments, we have the perfect furniture to meet your requirements."
              : "Zbuloni gamën tonë të gjerë të zgjidhjeve të mobiljeve të dizajnuara për nevoja të ndryshme institucionale. Nga hapësirat e zyrave deri te mjediset arsimore, ne kemi mobiljen perfekte për të përmbushur kërkesat tuaja."}
          </p>
        </motion.div>
        <div className="products-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => (
            <Link
              key={category.slug}
              to={`/products/category/${category.slug}`}
              className="block"
            >
              <ProductItem category={category} />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;
