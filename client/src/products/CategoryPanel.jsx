// src/components/CategoryPanel.js
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const CategoryPanel = ({
  categories,
  selectedCategory,
  selectedSubcategory,
  onSelectCategory,
  onSelectSubcategory,
  currentLanguage
}) => {
  const [expandedCategories, setExpandedCategories] = useState([]);
  const { t } = useTranslation();

  const toggleCategory = (categorySlug) => {
    setExpandedCategories((prev) =>
      prev.includes(categorySlug) ? prev.filter(slug => slug !== categorySlug) : [...prev, categorySlug]
    );
  };

  return (
    <div className="bg-gray-100 p-4 rounded-lg">
      <h2 className="text-xl font-semibold mb-4">{t('categories.title')}</h2>
      <ul>
        <li key="all-products" className="mb-2">
          <div className="flex items-center justify-between w-full text-left p-2 rounded-md hover:bg-gray-200 transition-colors duration-200">
            <button
              className={`flex-grow text-left ${selectedCategory === 'all-products' ? 'font-bold text-primary' : ''}`}
              onClick={() => onSelectCategory('all-products')}
            >
              <span className="flex items-center">{t('categories.allProducts')}</span>
            </button>
          </div>
        </li>
        {categories.map((category) => (
          <li key={category.slug} className="mb-2">
            <div className="flex items-center justify-between w-full text-left p-2 rounded-md hover:bg-gray-200 transition-colors duration-200">
              <button
                className={`flex-grow text-left ${selectedCategory === category.slug ? 'font-bold text-primary' : ''}`}
                onClick={() => onSelectCategory(category.slug)}
              >
                <span className="flex items-center">
                  <category.icon className="w-5 h-5 mr-2" />
                  {category.name[currentLanguage]}
                </span>
              </button>
              {category.subcategories.length > 0 && (
                <button
                  onClick={() => toggleCategory(category.slug)}
                  className="ml-2 p-1 rounded-full hover:bg-gray-300 transition-colors duration-200"
                >
                  {expandedCategories.includes(category.slug) ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
              )}
            </div>
            <AnimatePresence>
              {expandedCategories.includes(category.slug) && category.subcategories.length > 0 && (
                <motion.ul
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="ml-6 mt-2"
                >
                  {category.subcategories.map((subcategory) => (
                    <li key={subcategory.slug}>
                      <button
                        className={`p-2 rounded-md w-full text-left ${
                          selectedSubcategory === subcategory.slug ? 'bg-primary text-white font-bold' : 'hover:bg-gray-200'
                        } transition-colors duration-200`}
                        onClick={() => onSelectSubcategory(category.slug, subcategory.slug)}
                      >
                        {subcategory.name[currentLanguage]}
                      </button>
                    </li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoryPanel;
