// src/components/FullCatalog.jsx

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './../css/products.css';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import SearchBar from './SearchBar';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import Hero from './../components/Hero';
import categories from '../data/categories'; // Import categories

const FullCatalog = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [scrollPosition, setScrollPosition] = useState(0);

  // Generate category translation map from categories data
  const categoryTranslationMap = categories.reduce((acc, cat) => {
    acc[cat.name_en] = cat.name;
    return acc;
  }, {});
  // Add 'All Products' translation
  categoryTranslationMap['All Products'] = 'Të gjitha produktet';

  // Determine display name for the hero section
  const lastCategoryKey = Object.keys(categoryTranslationMap).slice(-1)[0];
  const lastCategoryValue =
    currentLanguage === 'en'
      ? lastCategoryKey
      : categoryTranslationMap[lastCategoryKey];

  // Helper function to normalize text
  const normalizeText = (text) => {
    return text
      .toLowerCase()
      .replace(/ç/g, 'c')
      .replace(/ë/g, 'e');
  };

  // Fetch all products from the backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BASE_URL}/products`
        );
        const data = await response.json();

        const sortedProducts = data.sort((a, b) => {
          const nameA =
            currentLanguage === 'en' ? a.name_en || a.name : a.name;
          const nameB =
            currentLanguage === 'en' ? b.name_en || b.name : b.name;

          const nameCompare = nameA.localeCompare(nameB);
          if (nameCompare !== 0) {
            return nameCompare;
          } else {
            const variationsA =
              currentLanguage === 'en'
                ? a.variations_en || a.variations
                : a.variations;
            const variationsB =
              currentLanguage === 'en'
                ? b.variations_en || b.variations
                : b.variations;

            const variationA = variationsA[0] || '';
            const variationB = variationsB[0] || '';

            return variationA.localeCompare(variationB);
          }
        });

        setProducts(sortedProducts);
        setFilteredProducts(sortedProducts);
      } catch (error) {
        console.log(error);
      }
    };
    fetchProducts();
  }, [currentLanguage]);

  // Update filtered products based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredProducts(products);
    } else {
      const normalizedSearchQuery = normalizeText(searchQuery);

      const filtered = products.filter((product) => {
        const name =
          currentLanguage === 'en' ? product.name_en || product.name : product.name;
        const variations =
          currentLanguage === 'en'
            ? product.variations_en || product.variations
            : product.variations;

        // Combine name and variations into a single array
        const searchFields = [
          normalizeText(name),
          ...variations.map((v) => normalizeText(v)),
        ];

        // Check if any field includes the normalized search query
        return searchFields.some((field) =>
          field.includes(normalizedSearchQuery)
        );
      });
      setFilteredProducts(filtered);
    }
  }, [searchQuery, products, currentLanguage]);

  // Track scroll position for parallax effect
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

  // Slider settings for react-slick
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    adaptiveHeight: true,
    autoplay: true,
    autoplaySpeed: 2000,
  };

  // Generate suggestions based on search query
  const suggestions = [];

  if (searchQuery.trim()) {
    const normalizedSearchQuery = normalizeText(searchQuery);

    products.forEach((product) => {
      const name =
        currentLanguage === 'en' ? product.name_en || product.name : product.name;
      const variations =
        currentLanguage === 'en'
          ? product.variations_en || product.variations
          : product.variations;

      const normalizedName = normalizeText(name);
      const normalizedVariations = variations.map((v) => normalizeText(v));

      const nameMatches = normalizedName.includes(normalizedSearchQuery);
      const matchingVariations = variations.filter((variation, index) =>
        normalizedVariations[index].includes(normalizedSearchQuery)
      );

      if (nameMatches && matchingVariations.length > 0) {
        matchingVariations.forEach((variation) => {
          suggestions.push({
            product,
            displayText: `${name} - ${variation}`,
          });
        });
      } else if (nameMatches) {
        suggestions.push({
          product,
          displayText: name,
        });
      } else if (matchingVariations.length > 0) {
        matchingVariations.forEach((variation) => {
          suggestions.push({
            product,
            displayText: `${name} - ${variation}`,
          });
        });
      }
    });
  }

  // Handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    navigate(`/products/${suggestion.product.slug}`); // Using slug for routing
  };

  // Helper function to truncate description
  const truncateDescription = (text, wordLimit) => {
    const words = text.split(' ');
    if (words.length > wordLimit) {
      return words.slice(0, wordLimit).join(' ') + '...';
    }
    return text;
  };

  return (
    <div>
      <Helmet>
        <title>Emko - {lastCategoryValue}</title>
      </Helmet>

      {/* Hero Section */}
      <Hero
        type="products" // Define a type that corresponds to your CSS classes
        scrollPosition={scrollPosition}
        title={lastCategoryValue}
      />

      {/* Category Navigation Buttons */}
      <div className="category-buttons">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            to={`/products/category/${cat.slug}`} // Use slug here
            className="btn btn-primary"
          >
            {currentLanguage === 'en' ? cat.name_en : cat.name}
          </Link>
        ))}
        <Link to="/full-catalog" className="btn btn-primary">
          {currentLanguage === 'en' ? 'All Products' : categoryTranslationMap['All Products']}
        </Link>
      </div>

      {/* Download Catalog Link */}
      <div
        style={{ textAlign: 'center', marginBottom: '0px', marginTop: '40px' }}
      >
        <Link to={`/download-catalog`} className="btn btn-primary">
          Download Full Catalog
        </Link>
      </div>

      <p className="center-p">
        Browse our extensive catalog of products, sorted alphabetically for your convenience.
      </p>

      <SearchBar
        query={searchQuery}
        setQuery={setSearchQuery}
        suggestions={suggestions}
        onSuggestionClick={handleSuggestionClick}
      />

      {/* Product Catalog Section */}
      <section className="container product-catalog-section">
        <div className="product-catalog-cards">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => {
              const name =
                currentLanguage === 'en'
                  ? product.name_en || product.name
                  : product.name;
              const description =
                currentLanguage === 'en'
                  ? product.description_en || product.description
                  : product.description;
              const variations =
                currentLanguage === 'en'
                  ? product.variations_en || product.variations
                  : product.variations;

              return (
                <div className="product-catalog-card" key={product._id}>
                  {/* Image Container */}
                  <div className="product-image-container">
                    {product.images.length > 1 ? (
                      <Slider {...sliderSettings}>
                        {product.images.map((image, index) => (
                          <img key={index} src={image} alt={name} />
                        ))}
                      </Slider>
                    ) : (
                      <img src={product.images[0]} alt={name} />
                    )}
                  </div>
                  <div className="product-catalog-card-content">
                    <h3>{name}</h3>
                    {/* Variations */}
                    {variations.length > 0 && (
                      <h4>{variations.join(', ')}</h4>
                    )}
                    {/* Truncated Description */}
                    <p>{truncateDescription(description, 20)}</p>
                    {product.colors && product.colors.length > 0 && (
                      <div className='product-card-colors-spacing'>
                        <div className="product-card-colors">
                          {product.colors.slice(0, 4).map((color, index) => (
                            <div
                              key={index}
                              className="color-circle"
                              style={{ backgroundColor: color.hex }}
                            ></div>
                          ))}
                          {product.colors.length > 4 && (
                            <div className="color-circle more-colors">+</div>
                          )}
                        </div>
                      </div>
                    )}

                    <Link
                      to={`/products/${product.slug}`} // Using slug for routing
                      className="btn btn-secondary"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              );
            })
          ) : (
            <p>No products found.</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default FullCatalog;
