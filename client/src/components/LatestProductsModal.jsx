// src/components/LatestProductsModal.jsx

import React, { useState, useEffect } from 'react';
import './../css/latestproductsmodal.css';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { fetchAPI } from '../utils/api'; // Import the helper
import Slider from 'react-slick'; // Import Slider for image carousel
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const LatestProductsModal = ({ isOpen, onClose }) => {
  const [products, setProducts] = useState([]);
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      async function fetchLatestProducts() {
        setIsLoading(true);
        setError(null);
        try {
          // Fetch the latest 10 products. Adjust the endpoint as per your API.
          const data = await fetchAPI('/products?limit=10&sort=createdAt:desc');

          // Adjust based on your API response structure
          if (Array.isArray(data)) {
            setProducts(data);
          } else if (data.products && Array.isArray(data.products)) {
            setProducts(data.products);
          } else {
            console.error('Unexpected latest products data format:', data);
            setProducts([]);
          }
        } catch (error) {
          console.error('Error fetching latest products:', error);
          setError('Failed to load latest products.');
          setProducts([]);
        } finally {
          setIsLoading(false);
        }
      }
      fetchLatestProducts();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Slider settings for react-slick
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    adaptiveHeight: true,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  // Handle click outside to close modal
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="latest-products-modal-overlay"
      role="dialog"
      aria-modal="true"
      onClick={handleOverlayClick}
    >
      <div className="latest-products-modal-content">
        <button className="modal-close-button" onClick={onClose} aria-label="Close Modal">
          &times;
        </button>
        <h3>Latest Products</h3>
        {isLoading ? (
          <p className="loading-message">Loading latest products...</p>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : (
          <ul className="latest-products-list">
            {products.length > 0 ? (
              products.map((product) => {
                const name =
                  currentLanguage === 'en' ? product.name_en || product.name : product.name;
                const description =
                  currentLanguage === 'en'
                    ? product.description_en || product.description
                    : product.description;
                const category =
                  currentLanguage === 'en'
                    ? product.category_en || product.category
                    : product.category;

                return (
                  <li key={product.id || product._id} className="latest-product-item">
                    <div className="latest-product-info-horizontal">
                      <div className="latest-product-image-container">
                        {product.images.length > 1 ? (
                          <Slider {...sliderSettings}>
                            {product.images.map((image, index) => (
                              <img
                                key={index}
                                src={image}
                                alt={name}
                                className="latest-product-image"
                              />
                            ))}
                          </Slider>
                        ) : (
                          <img
                            src={product.images[0]}
                            alt={name}
                            className="latest-product-image"
                          />
                        )}
                      </div>
                      <div className="latest-product-details">
                        <h4>{name}</h4>
                        <p className="product-category">{category}</p>
                        <p>{description}</p>
                        {product.colors && product.colors.length > 0 && (
                          <div className="product-card-colors-spacing">
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
                        <Link to={`/products/${product.slug}`} className="btn btn-secondary">
                          Read More
                        </Link>
                      </div>
                    </div>
                  </li>
                );
              })
            ) : (
              <p className="no-products-message">No latest products available.</p>
            )}
          </ul>
        )}
      </div>
    </div>
  );
};

export default LatestProductsModal;
