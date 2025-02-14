// src/products/ProductDetail.jsx
import React, { useContext, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import Loader from '../components/Loader';
import DeleteProduct from './DeleteProduct';
import { UserContext } from '../context/userContext';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './../css/products.css';
import categories from '../data/categories';

const ProductDetail = () => {
  const { slug } = useParams();
  const { currentUser } = useContext(UserContext);
  const { i18n, t } = useTranslation();
  const currentLanguage = i18n.language || 'en';

  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const apiUrl = `${process.env.REACT_APP_BASE_URL}/products/${slug}`;
        const response = await axios.get(apiUrl);
        setProduct(response.data);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError(err.response && err.response.status === 404 ? 'Product not found.' : 'An error occurred while fetching the product.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

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
        <p className="error text-center text-red-500">{t('productDetail.noImage')}</p>
      </div>
    );
  }

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

  const name = currentLanguage === 'en' ? product.name_en || product.name : product.name;
  const description = currentLanguage === 'en' ? product.description_en || product.description : product.description;
  const variations = currentLanguage === 'en' ? product.variations_en || product.variations : product.variations;

  const categoryName = getCategoryName(product.category);
  const subcategoryName = product.subcategory ? getSubcategoryName(product.category, product.subcategory) : '';

  const isCreator = currentUser?.id === (product.creator?._id || product.creator);

  return (
    <div className="mt-[12rem]">
      <Helmet>
        <title>
          Emko - {name} {variations.length > 0 ? `- ${variations[0]}` : ''}
        </title>
        <meta name="description" content={description} />
        <meta property="og:title" content={`Emko - ${name}`} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content="https://www.emko-client.vercel.app/assets/emko-logo.png" />
        <meta property="og:url" content={`https://emko-serve.vercel.app/products/${product.slug}`} />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="canonical" href={`https://emko-serve.vercel.app/products/${product.slug}`} />
      </Helmet>
      <section data-aos="fade-up" className="container product-detail px-4 py-8 mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="product-detail-container md:flex">
            <div className="product-detail-images md:w-1/2">
              {product.images && product.images.length > 1 ? (
                <Slider {...sliderSettings}>
                  {product.images.map((image, index) => (
                    <div key={index} className="relative w-full h-64">
                      <img src={image} alt={`${name} - ${index + 1}`} className="object-cover w-full h-full" />
                    </div>
                  ))}
                </Slider>
              ) : product.images && product.images.length === 1 ? (
                <div className="relative w-full h-64">
                  <img src={product.images[0]} alt={name} className="object-cover w-full h-full" />
                </div>
              ) : (
                <div className="bg-gray-200 w-full h-64 flex items-center justify-center">
                  <span className="text-gray-500">{t('productDetail.noImage')}</span>
                </div>
              )}
            </div>

            <div className="p-6 md:w-1/2">
              <div className="product-detail-header mb-4">
                <h1 className="text-3xl font-bold mb-2">{name}</h1>
                {isCreator && (
                  <div className="flex space-x-2 justify-center py-6">
                    <Link to={`/products/${product.slug}/edit`} className="btn btn-primary">
                      Edit
                    </Link>
                    <DeleteProduct slug={product.slug} />
                  </div>
                )}
              </div>

              <div className="text-sm text-indigo-500 font-semibold uppercase tracking-wide mb-2">
                {categoryName} {subcategoryName && `- ${subcategoryName}`}
              </div>

              <p className="text-gray-700 mb-4">{description}</p>

              {variations && variations.length > 0 && (
                <div className="mb-4">
                  <span className="font-semibold text-gray-800">{t('productDetail.variations')}</span>{' '}
                  {variations.join(', ')}
                </div>
              )}

              {product.colors && product.colors.length > 0 && (
                <div className="mb-4">
                  <span className="font-semibold text-gray-800">{t('productDetail.availableColors')}</span>
                  <div className="flex mt-2 space-x-2 justify-center">
                    {product.colors.map((color, index) => (
                      <div key={index} className="w-6 h-6 rounded-full border border-gray-300" style={{ backgroundColor: color.hex }} />
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-6 flex space-x-4 justify-center">
                <Link to="/products/category/all">
                  <button className="bg-primary text-white py-2 px-4 text-sm rounded-full hover:bg-primary-transparent transition-colors duration-300">
                    {t('productDetail.backToProducts')}
                  </button>
                </Link>
                <Link to="/">
                  <button className="bg-secondary text-white py-2 px-4 text-sm rounded-full hover:bg-secondary-transparent transition-colors duration-300">
                    {t('productDetail.backToHome')}
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
