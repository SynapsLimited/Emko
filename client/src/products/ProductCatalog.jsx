// src/pages/ProductCatalog.jsx

import React, { useState, useEffect, useMemo } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Search, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ProductCard from './ProductCard';
import CategoryPanel from './CategoryPanel';
import { generatePDF, generateFilteredPDF } from '../utils/pdfGenerator';
import Loader from '../components/Loader';
import categories from '../data/categories';
import { useTranslation } from 'react-i18next';

const ProductCatalog = () => {
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language; // 'en' or 'sq'
  const navigate = useNavigate();

  const [selectedCategory, setSelectedCategory] = useState('all-products'); // Using slug
  const [selectedSubcategory, setSelectedSubcategory] = useState(''); // Using slug
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  // Memoize categoryTranslationMap to prevent unnecessary re-renders
  const categoryTranslationMap = useMemo(() => {
    const map = categories.reduce((acc, cat) => {
      acc[cat.slug] = { sq: cat.name.sq, en: cat.name.en };
      cat.subcategories.forEach(sub => {
        acc[sub.slug] = { sq: sub.name.sq, en: sub.name.en };
      });
      return acc;
    }, {});

    // Add 'All Products' translation
    map['all-products'] = { sq: 'Të gjitha produktet', en: 'All Products' };

    return map;
  }, [categories]);

  // Find the selected category object based on the selectedCategory slug
  const selectedCategoryData = categories.find(cat => cat.slug === selectedCategory);

  // If a subcategory is selected, find the corresponding subcategory object
  const selectedSubcategoryData = selectedCategoryData?.subcategories.find(sub => sub.slug === selectedSubcategory);

  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/products`);
        if (!response.ok) {
          throw new Error(`Failed to fetch products: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();

        let filtered = data;

        if (selectedCategory !== 'all-products') {
          // Filter by category slug
          filtered = filtered.filter(product => product.category === selectedCategory);
        }

        if (selectedSubcategory) {
          // Filter by subcategory slug
          filtered = filtered.filter(product => product.subcategory === selectedSubcategory);
        }

        setProducts(filtered);
        setFilteredProducts(filtered);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory, selectedSubcategory]);

  // Update filtered products based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredProducts(products);
    } else {
      const normalizedSearchQuery = searchQuery.toLowerCase();

      const filtered = products.filter(product => {
        const title = currentLanguage === 'en' ? (product.name_en || product.name) : product.name;
        const description = currentLanguage === 'en' ? (product.description_en || product.description) : product.description;

        return (
          title.toLowerCase().includes(normalizedSearchQuery) ||
          description.toLowerCase().includes(normalizedSearchQuery)
        );
      });

      setFilteredProducts(filtered);
    }
  }, [searchQuery, products, currentLanguage]);

  const handleCategorySelect = (categorySlug) => {
    setSelectedCategory(categorySlug);
    setSelectedSubcategory('');
  };

  const handleSubcategorySelect = (categorySlug, subcategorySlug) => {
    setSelectedCategory(categorySlug);
    setSelectedSubcategory(subcategorySlug);
  };

  const handleGeneratePDF = async (catalogType) => {
    setIsGeneratingPDF(true);
    try {
      if (catalogType === 'Full Catalog') {
        await generatePDF(
          products,
          'Full_Catalog',
          null,
          categoryTranslationMap,
          currentLanguage
        );
      } else if (catalogType === 'Category Catalog' && selectedCategory && selectedCategory !== 'all-products') {
        const categoryProducts = products.filter(p => p.category === selectedCategory);
        await generateFilteredPDF(
          categoryProducts,
          `${categoryTranslationMap[selectedCategory][currentLanguage].replace(/\s+/g, '_')}_Catalog`,
          selectedCategoryData,
          categoryTranslationMap,
          currentLanguage
        );
      } else if (catalogType === 'Subcategory Catalog' && selectedSubcategory) {
        const subcategoryProducts = products.filter(p => p.subcategory === selectedSubcategory);
        await generateFilteredPDF(
          subcategoryProducts,
          `${categoryTranslationMap[selectedSubcategory][currentLanguage].replace(/\s+/g, '_')}_Catalog`,
          selectedSubcategoryData,
          categoryTranslationMap,
          currentLanguage
        );
      }
      navigate('/products/category/all');
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert(currentLanguage === 'en' ? 'Error generating PDF. Please try again.' : 'Gabim gjatë gjenerimit të PDF. Ju lutemi provoni përsëri.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  // Helper function for translation
  const t = (translationObj) => {
    if (!translationObj) return '';
    return currentLanguage === 'en' ? translationObj.en : translationObj.sq;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">
        {currentLanguage === 'en' ? 'Our Products' : 'Produktet Tona'}
      </h1>
      <p className="text-gray-600 mb-8">
        {currentLanguage === 'en'
          ? 'Explore our wide range of high-quality furniture designed for various institutional needs. From office spaces to educational environments, we have the perfect solutions to meet your requirements.'
          : 'Eksploroni gamën tonë të gjerë të mobiljeve me cilësi të lartë, të dizajnuara për nevoja të ndryshme institucionale. Nga hapësirat e zyrave deri te ambientet arsimore, kemi zgjidhjet perfekte për t\'ju përmbushur kërkesat.'}
      </p>
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder={currentLanguage === 'en' ? 'Search products...' : 'Kërko produkte...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-2 pl-10 pr-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/4">
          <CategoryPanel
            categories={categories}
            selectedCategory={selectedCategory}
            selectedSubcategory={selectedSubcategory}
            onSelectCategory={handleCategorySelect}
            onSelectSubcategory={handleSubcategorySelect}
            currentLanguage={currentLanguage} // Pass currentLanguage
          />
        </div>
        <div className="md:w-3/4">
          <div className="mb-4">
            <h2 className="text-2xl font-semibold">
              {t(categoryTranslationMap[selectedCategory] || { en: 'All Products', sq: 'Të gjitha produktet' })}
            </h2>
            
            {selectedSubcategory ? (
              <>
                {/* Display Subcategory Name */}
                <p className="text-gray-600">
                  {t(categoryTranslationMap[selectedSubcategory] || { en: selectedSubcategory, sq: selectedSubcategory })}
                </p>
                {/* Display Subcategory Description */}
                <p className="text-gray-600 mt-2">
                  {selectedSubcategoryData?.description?.[currentLanguage] || ''}
                </p>
              </>
            ) : (
              (selectedCategory !== 'all-products') && (
                /* Display Category Description */
                <p className="text-gray-600 mt-2">
                  {selectedCategoryData?.description?.[currentLanguage] || ''}
                </p>
              )
            )}
          </div>
          <div className="mb-6 flex flex-wrap gap-4">
            <button
              onClick={() => handleGeneratePDF('Full Catalog')}
              disabled={isGeneratingPDF}
              className="flex items-center px-4 py-2 bg-primary text-white rounded-full hover:bg-primary-transparent transition-colors duration-300 disabled:opacity-50"
            >
              <Download className="w-4 h-4 mr-2" />
              {currentLanguage === 'en' ? 'Download Full Catalog' : 'Shkarko katalogun e plotë'}
            </button>
            {selectedCategory && selectedCategory !== 'all-products' && (
              <button
                onClick={() => handleGeneratePDF('Category Catalog')}
                disabled={isGeneratingPDF}
                className="flex items-center px-4 py-2 bg-secondary text-white rounded-full hover:bg-secondary-transparent transition-colors duration-300 disabled:opacity-50"
              >
                <Download className="w-4 h-4 mr-2" />
                {currentLanguage === 'en'
                  ? `Download ${t(categoryTranslationMap[selectedCategory])} Catalog`
                  : `Shkarko katalogun për ${t(categoryTranslationMap[selectedCategory])}`}
              </button>
            )}
            {selectedSubcategory && (
              <button
                onClick={() => handleGeneratePDF('Subcategory Catalog')}
                disabled={isGeneratingPDF}
                className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-full hover:bg-gray-500 transition-colors duration-300 disabled:opacity-50"
              >
                <Download className="w-4 h-4 mr-2" />
                {currentLanguage === 'en'
                  ? `Download ${t(categoryTranslationMap[selectedSubcategory])} Catalog`
                  : `Shkarko katalogun për ${t(categoryTranslationMap[selectedSubcategory])}`}
              </button>
            )}
          </div>
          {isLoading ? (
            <Loader />
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {filteredProducts.map((product, index) => (
                  <ProductCard key={product.id ? `${product.id}-${index}` : `product-${index}`} product={product} />
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600">
                {currentLanguage === 'en'
                  ? 'No products match your search criteria.'
                  : 'Nuk ka produkte që përputhen me kriteret e kërkimit tuaj.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCatalog;
