// src/products/ProductDetail.jsx

import React, { useContext, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async'; // Updated import
import Loader from '../components/Loader';
import DeleteProduct from './DeleteProduct';
import { UserContext } from '../context/userContext';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './../css/products.css'; // Ensure your CSS is correctly imported

const ProductDetail = () => {
  const { slug } = useParams(); // Extract 'slug' from URL parameters
  const { currentUser } = useContext(UserContext); // Access user context
  const { i18n } = useTranslation(); // Internationalization
  const currentLanguage = i18n.language || 'en'; // Default to 'en' if undefined

  const [product, setProduct] = useState(null); // Product data
  const [error, setError] = useState(null); // Error state
  const [isLoading, setIsLoading] = useState(false); // Loading state

  // Fetch product data using axios
  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Construct the correct API URL
        const apiUrl = `${process.env.REACT_APP_BASE_URL}/products/${slug}`;

        const response = await axios.get(apiUrl);
        setProduct(response.data);
      } catch (err) {
        console.error('Error fetching product:', err);
        if (err.response && err.response.status === 404) {
          setError('Product not found.');
        } else {
          setError('An error occurred while fetching the product.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

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

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="error text-center text-red-500">{error}</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="error text-center text-red-500">Product not found.</p>
      </div>
    );
  }

  // Determine the product name, description, and variations based on the current language
  const name =
    currentLanguage === 'en' ? product.name_en || product.name : product.name;
  const description =
    currentLanguage === 'en'
      ? product.description_en || product.description
      : product.description;
  const variations =
    currentLanguage === 'en'
      ? product.variations_en || product.variations
      : product.variations;

  const categoryName = product.category;
  const subcategoryName = product.subcategory;

  // Determine if the current user is the creator of the product
  const isCreator =
    currentUser?.id === (product.creator?._id || product.creator);

  return (
    <div className="mt-[12rem]">
      <Helmet>
        <title>
          Emko - {name} {variations.length > 0 ? `- ${variations[0]}` : ''}
        </title>
        <meta name="description" content={description} />
        <link
          rel="canonical"
          href={`https://www.emko.com.al/products/${product.slug}`}
        />
      </Helmet>
      <section
        data-aos="fade-up"
        className="container product-detail px-4 py-8 mx-auto"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-lg shadow-lg overflow-hidden"
        >
          <div className="product-detail-container md:flex">
            {/* Product Images */}
            <div className="product-detail-images md:w-1/2">
              {product.images && product.images.length > 1 ? (
                <Slider {...sliderSettings}>
                  {product.images.map((image, index) => (
                    <div key={index} className="relative w-full h-64">
                      <img
                        src={image}
                        alt={`${name} - ${index + 1}`}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  ))}
                </Slider>
              ) : product.images && product.images.length === 1 ? (
                <div className="relative w-full h-64">
                  <img
                    src={product.images[0]}
                    alt={name}
                    className="object-cover w-full h-full"
                  />
                </div>
              ) : (
                <div className="bg-gray-200 w-full h-64 flex items-center justify-center">
                  <span className="text-gray-500">No image available</span>
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="p-6 md:w-1/2">
              {/* Header with Title and Action Buttons */}
              <div className="product-detail-header mb-4">
                <h1 className="text-3xl font-bold mb-2">{name}</h1>
                {/* Only show edit and delete buttons if the current user is the product creator */}
                {isCreator && (
                  <div className="flex space-x-2 justify-center py-6">
                    <Link
                      to={`/products/${product.slug}/edit`}
                      className="btn btn-primary"
                    >
                      Edit
                    </Link>
                    <DeleteProduct slug={product.slug} />
                  </div>
                )}
              </div>

              {/* Category and Subcategory */}
              <div className="text-sm text-indigo-500 font-semibold uppercase tracking-wide mb-2">
                {categoryName} {subcategoryName && `- ${subcategoryName}`}
              </div>

              {/* Product Description */}
              <p className="text-gray-700 mb-4">{description}</p>

              {/* Product Variations */}
              {variations && variations.length > 0 && (
                <div className="mb-4">
                  <span className="font-semibold text-gray-800">Variations:</span>{' '}
                  {variations.join(', ')}
                </div>
              )}

              {/* Available Colors */}
              {product.colors && product.colors.length > 0 && (
                <div className="mb-4">
                  <span className="font-semibold text-gray-800">Available Colors:</span>
                  <div className="flex mt-2 space-x-2 justify-center">
                {product.colors.map((color, index) => (
                  <div
                    key={index}
                    className="w-6 h-6 rounded-full border border-gray-300"
                    style={{ backgroundColor: color.hex }}
                    title={currentLanguage === 'en' ? color.nameEn : color.name}
                  />
                ))}
              </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="mt-6 flex space-x-4 justify-center">
                <Link to="/products">
                  <button className="bg-primary text-white py-2 px-4 text-sm rounded-full hover:bg-primary-transparent transition-colors duration-300">
                    Back to Products
                  </button>
                </Link>
                <Link to="/">
                  <button className="bg-secondary text-white py-2 px-4  text-sm rounded-full hover:bg-secondary-transparent transition-colors duration-300">
                    Back to Home
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default ProductDetail;
