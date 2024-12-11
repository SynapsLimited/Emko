// src/components/SearchBarHome.jsx

import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import './../css/searchbarhome.css';
import { useTranslation } from 'react-i18next';
import { fetchAPI } from '../utils/api'; // Import the helper

// Function to normalize text
const normalizeText = (text) => {
  return text.toLowerCase().replace(/ç/g, 'c').replace(/ë/g, 'e');
};

const SearchBarHome = () => {
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language;

  const [query, setQuery] = useState('');
  const [allProducts, setAllProducts] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Fetch all products on component mount
  useEffect(() => {
    let isMounted = true;
    fetchAPI('/products')
      .then((products) => {
        if (isMounted) {
          if (Array.isArray(products)) {
            setAllProducts(products);
          } else {
            console.error('Fetched products is not an array:', products);
            setAllProducts([]);
          }
        }
      })
      .catch((error) => {
        console.error('Error fetching products in SearchBarHome:', error);
        if (isMounted) setAllProducts([]);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  // Update suggestions based on query and language
  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }
    const normalizedQuery = normalizeText(query);
    const matchedSuggestions = [];

    allProducts.forEach((product) => {
      const name = currentLanguage === 'en' ? product.name_en || product.name : product.name;
      const variations = currentLanguage === 'en' ? product.variations_en || product.variations : product.variations;

      const normalizedName = normalizeText(name);
      const normalizedVariations = variations.map((v) => normalizeText(v));

      const nameMatches = normalizedName.includes(normalizedQuery);
      const matchingVariations = variations.filter((variation, index) =>
        normalizedVariations[index].includes(normalizedQuery)
      );

      if (nameMatches && matchingVariations.length > 0) {
        matchingVariations.forEach((variation) => {
          matchedSuggestions.push({
            product,
            displayText: `${name} - ${variation}`,
          });
        });
      } else if (nameMatches) {
        matchedSuggestions.push({
          product,
          displayText: name,
        });
      } else if (matchingVariations.length > 0) {
        matchingVariations.forEach((variation) => {
          matchedSuggestions.push({
            product,
            displayText: `${name} - ${variation}`,
          });
        });
      }
    });

    setSuggestions(matchedSuggestions);
  }, [query, allProducts, currentLanguage]);

  const handleInputChange = (e) => {
    setQuery(e.target.value);
    setShowSuggestions(true);
  };

  const handleFocus = () => {
    if (suggestions.length > 0) setShowSuggestions(true);
  };

  const handleBlur = () => {
    // Delay hiding suggestions to allow click on suggestions
    setTimeout(() => setShowSuggestions(false), 100);
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    window.location.href = `/products/${suggestion.product.slug}`;
    // Alternatively, if using React Router's navigate:
    // navigate(`/products/${suggestion.product.slug}`);
  };

  return (
    <div className="search-bar-home-container">
      <Search className="search-bar-home-icon" />
      <input
        type="search"
        className="search-bar-home-input"
        placeholder="Search products..."
        value={query}
        onChange={handleInputChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
      {showSuggestions && suggestions.length > 0 && (
        <div className="search-bar-home-suggestions">
          <ul>
            {suggestions.map((suggestion, index) => (
              <li
                key={`${suggestion.product._id}-${index}`}
                onClick={() => handleSuggestionClick(suggestion)}
                className="suggestion-item"
              >
                {suggestion.product.images && suggestion.product.images.length > 0 ? (
                  <img src={suggestion.product.images[0]} alt={suggestion.displayText} />
                ) : (
                  <div className="placeholder-image"></div> // Optional: Placeholder if image is missing
                )}
                <span>{suggestion.displayText}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchBarHome;
