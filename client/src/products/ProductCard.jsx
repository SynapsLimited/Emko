// src/components/ProductCard.js

import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import categories from '../data/categories'; // Import categories

const ProductCard = ({ product }) => {
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language || 'en';

  // Helper functions to get category and subcategory names
  const getCategoryName = (slug) => {
    const category = categories.find(cat => cat.slug === slug);
    return category ? category.name[currentLanguage] : slug;
  };

  const getSubcategoryName = (categorySlug, subcategorySlug) => {
    const category = categories.find(cat => cat.slug === categorySlug);
    if (category && category.subcategories) {
      const subcategory = category.subcategories.find(sub => sub.slug === subcategorySlug);
      return subcategory ? subcategory.name[currentLanguage] : subcategorySlug;
    }
    return subcategorySlug;
  };

  // Determine the product name and variations based on the current language
  const name = currentLanguage === 'en' ? product.name_en || product.name : product.name;
  const variations = currentLanguage === 'en' ? product.variations_en || product.variations : product.variations;
  const truncatedVariations = variations.length > 0 ? variations.join(', ') : 'Normal';

  // Get category and subcategory names
  const categoryName = getCategoryName(product.category);
  const subcategoryName = product.subcategory ? getSubcategoryName(product.category, product.subcategory) : '';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
    >
      <div className="relative w-full h-48">
        {product.images && product.images.length > 0 ? (
          <img 
            src={product.images[0]} 
            alt={name} 
            className="object-cover w-full h-full"
          />
        ) : (
          <div className="bg-gray-200 w-full h-full flex items-center justify-center">
            <span className="text-gray-400">No image available</span>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">{name}</h3>
        {/* Display variations */}
        <p className="text-sm text-gray-600 mb-2">Variation: {truncatedVariations}</p>
        <div className="flex flex-wrap gap-2 mb-2">
          <button className="text-xs bg-secondary-transparent text-white rounded-full px-2 py-1">
            {categoryName}
          </button>
          {subcategoryName && (
            <button className="text-xs bg-green-100 text-green-800 rounded-full px-2 py-1">
              {subcategoryName}
            </button>
          )}
        </div>
        <p className="text-sm text-gray-700 mb-2">
          {product.description.split(' ').slice(0, 10).join(' ')}
          {product.description.split(' ').length > 10 ? '...' : ''}
        </p>
        <div className="flex items-center gap-2 mb-2">
          {product.colors && product.colors.slice(0, 5).map((color, index) => (
            <div
              key={index}
              className="w-5 h-5 rounded-full border border-gray-300"
              style={{ backgroundColor: color.hex }}
              title={currentLanguage === 'en' ? color.nameEn : color.name}
            />
          ))}
          {product.colors && product.colors.length > 5 && (
            <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-semibold">
              +{product.colors.length - 5}
            </div>
          )}
        </div>
        <Link to={`/products/${product.slug}`} className="btn btn-primary mt-6 text-sm w-full">
            Product Details
        </Link>
      </div>
    </motion.div>
  );
};

export default ProductCard;
