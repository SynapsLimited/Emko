// src/components/ProductsDropdown.jsx

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import './../css/productsdropdown.css';
import { useTranslation } from 'react-i18next';
import categories from '../data/categories'; // Import the shared categories data

const ProductsDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language;
  const dropdownRef = useRef(null);

  // Handler to close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <div className="products-dropdown-container" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="products-dropdown-button"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span>
          {currentLanguage === 'en' ? 'Select a product category' : 'Zgjidhni një kategori produkti'}
        </span>
        <ChevronDown className={`dropdown-icon ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="products-dropdown-menu">
          <div className="dropdown-menu-content">
            {categories.length > 0 ? (
              categories.map((category) => (
                <a
                  key={category.id}
                  href={`/products/category/${category.slug}`}
                  className="dropdown-menu-item"
                >
                  {currentLanguage === 'en' ? category.name_en : category.name}
                </a>
              ))
            ) : (
              <p className="no-categories">
                {currentLanguage === 'en' ? 'No categories available.' : 'Asnjë kategori në dispozicion.'}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsDropdown;
