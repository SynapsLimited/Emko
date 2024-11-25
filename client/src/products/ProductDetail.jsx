// src/components/ProductDetail.jsx

import React, { useContext, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import './../css/products.css';
import Loader from '../components/Loader';
import DeleteProduct from './DeleteProduct';
import { UserContext } from '../context/userContext';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next'; // Import useTranslation

const ProductDetail = () => {
  const { slug } = useParams();
  const { currentUser } = useContext(UserContext);
  const { i18n } = useTranslation(); // Get i18n
  const currentLanguage = i18n.language; // Get current language

  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getProduct = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/products/${slug}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        setError('Product not found.');
      }
      setIsLoading(false);
    };
    getProduct();
  }, [slug]);

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <p className="error">{error}</p>;
  }

  if (!product) {
    return <p className="error">Product not found.</p>;
  }

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

  // Get product details with translation
  const name = currentLanguage === 'en' ? product.name_en || product.name : product.name;
  const description =
    currentLanguage === 'en' ? product.description_en || product.description : product.description;
  const variations =
    currentLanguage === 'en' ? product.variations_en || product.variations : product.variations;

  const categoryName = product.category;

  return (
    <div className="product-detail-section">
      <Helmet>
        <title>
          Emko - {name} {variations.length > 0 ? `- ${variations[0]}` : ''}
        </title>
        <link rel="canonical" href={`https://www.emko.com.al/products/${product.slug}`} />
      </Helmet>
      <section data-aos="fade-up" className="container product-detail">
        <div className="product-detail-container">
          <div className="product-detail-header">
            <h1>{name}</h1>

            {/* Only show edit and delete buttons if the current user is the product creator */}
            {currentUser?.id === (product.creator._id || product.creator) && (
              <div className="product-detail-buttons">
                <Link to={`/products/${product.slug}/edit`} className="btn btn-primary">
                  Edit
                </Link>
                <DeleteProduct slug={product.slug} /> {/* Updated to use slug from URL */}
              </div>
            )}
          </div>

          {/* Product images */}
          <div className="product-detail-images">
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

          {/* Product details */}
          <h3>Category: {categoryName}</h3>
          {variations.length > 0 && <h4>Variations: {variations.join(', ')}</h4>}
          <p>{description}</p>

          {/* Display colors */}
          {product.colors && product.colors.length > 0 && (
            <div className="product-colors">
              {product.colors.map((color, index) => (
                <div key={index} className="product-color-item">
                  <div
                    className="color-circle"
                    style={{ backgroundColor: color.hex }}
                  ></div>
                  <p>{currentLanguage === 'en' ? color.nameEn : color.name}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Back to products button */}
        <Link to="/full-catalog" className="btn btn-secondary product-detail-btn">
          Back to Products
        </Link>
      </section>
    </div>
  );
};

export default ProductDetail;
