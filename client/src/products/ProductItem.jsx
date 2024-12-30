// src/components/ProductItem.jsx

import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const ProductItem = ({ category }) => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language === 'en' ? 'en' : 'sq';

  if (!category || !category.name) return null;

  const IconComponent = category.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="product-item bg-white-transparent rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
    >
      <div className="p-6">
        {/* Removed the internal Link to prevent nested links */}
        <div className="flex items-center justify-center mb-4 transition-transform duration-300 hover:scale-110">
          {IconComponent && <IconComponent className="w-12 h-12 text-primary" />}
        </div>
        <h4 className="product-title text-xl font-semibold mb-2 text-center">
          {category.name[currentLang]}
        </h4>
        <p className="product-description text-gray-600 text-center">
          {category.description[currentLang]}
        </p>
        {category.subcategories && category.subcategories.length > 0 && (
          <div className="mt-4">
            <h5 className="text-lg font-semibold mb-2 text-center">
              {currentLang === 'en' ? 'Subcategories:' : 'Nënkategorit:'}
            </h5>
            <ul className="list-none text-center">
              {category.subcategories.map((subcategory) => (
                <li key={subcategory.slug} className="text-gray-600">
                  {subcategory.name[currentLang]}
                </li>
              ))}
            </ul>
          </div>
        )}
        <div className="mt-6 text-center">
          {/* Removed the internal Link here as well */}
          <span className="product-read-more text-primary hover:text-primary-transparent font-semibold">
            {currentLang === 'en' ? `Browse ${category.name.en} →` : `Shfleto ${category.name.sq} →`}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductItem;
