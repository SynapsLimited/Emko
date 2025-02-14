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
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

const ProductCatalog = () => {
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language; // 'en' or 'sq'
  const navigate = useNavigate();

  const [selectedCategory, setSelectedCategory] = useState('all-products'); // Using slug
  const [selectedSubcategory, setSelectedSubcategory] = useState(''); // Using slug
  const [searchQuery, setSearchQuery] = useState('');
  const [allProducts, setAllProducts] = useState([]); // All products from API
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  // Build a translation map from categories data for easy access
  const categoryTranslationMap = useMemo(() => {
    const map = categories.reduce((acc, cat) => {
      acc[cat.slug] = { sq: cat.name.sq, en: cat.name.en };
      cat.subcategories.forEach((sub) => {
        acc[sub.slug] = { sq: sub.name.sq, en: sub.name.en };
      });
      return acc;
    }, {});
    // Add "all-products" translation manually
    map['all-products'] = { sq: 'Të gjitha produktet', en: 'All Products' };
    return map;
  }, [categories]);

  // Get the selected category data
  const selectedCategoryData = categories.find(cat => cat.slug === selectedCategory);
  // And, if a subcategory is selected, get its data
  const selectedSubcategoryData = selectedCategoryData?.subcategories.find(sub => sub.slug === selectedSubcategory);

  // Fetch all products once from your API
  useEffect(() => {
    const fetchAllProducts = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/products`);
        if (!response.ok) {
          throw new Error(`Failed to fetch products: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        setAllProducts(data);
      } catch (error) {
        console.error('Error fetching all products:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAllProducts();
  }, []);

  // Filter products based on selected category and subcategory
  useEffect(() => {
    let filtered = allProducts;
    if (selectedCategory !== 'all-products') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }
    if (selectedSubcategory) {
      filtered = filtered.filter(product => product.subcategory === selectedSubcategory);
    }
    setProducts(filtered);
    setFilteredProducts(filtered);
  }, [selectedCategory, selectedSubcategory, allProducts]);

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

  // Handlers for category and subcategory selection
  const handleCategorySelect = (categorySlug) => {
    setSelectedCategory(categorySlug);
    setSelectedSubcategory('');
  };

  const handleSubcategorySelect = (categorySlug, subcategorySlug) => {
    setSelectedCategory(categorySlug);
    setSelectedSubcategory(subcategorySlug);
  };

  // Sorting function (by category then subcategory)
  const sortProducts = (productsList) => {
    return productsList.sort((a, b) => {
      if (a.category < b.category) return -1;
      if (a.category > b.category) return 1;
      if (a.subcategory < b.subcategory) return -1;
      if (a.subcategory > b.subcategory) return 1;
      return 0;
    });
  };

  // Handler for PDF generation
  const handleGeneratePDF = async (catalogType) => {
    setIsGeneratingPDF(true);
    try {
      let productsToGenerate = [];
      if (catalogType === 'Full Catalog') {
        productsToGenerate = sortProducts([...allProducts]);
        await generatePDF(
          productsToGenerate,
          'Full_Catalog',
          null,
          categoryTranslationMap,
          currentLanguage
        );
      } else if (catalogType === 'Category Catalog' && selectedCategory && selectedCategory !== 'all-products') {
        const categoryProducts = allProducts.filter(p => p.category === selectedCategory);
        productsToGenerate = sortProducts([...categoryProducts]);
        await generateFilteredPDF(
          productsToGenerate,
          `${categoryTranslationMap[selectedCategory][currentLanguage].replace(/\s+/g, '_')}_Catalog`,
          selectedCategoryData,
          categoryTranslationMap,
          currentLanguage
        );
      } else if (catalogType === 'Subcategory Catalog' && selectedSubcategory) {
        const subcategoryProducts = allProducts.filter(p => p.subcategory === selectedSubcategory);
        productsToGenerate = sortProducts([...subcategoryProducts]);
        await generateFilteredPDF(
          productsToGenerate,
          `${categoryTranslationMap[selectedSubcategory][currentLanguage].replace(/\s+/g, '_')}_Catalog`,
          selectedSubcategoryData,
          categoryTranslationMap,
          currentLanguage
        );
      }
      navigate('/products/category/all');
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert(
        currentLanguage === 'en'
          ? 'Error generating PDF. Please try again.'
          : 'Gabim gjatë gjenerimit të PDF. Ju lutemi provoni përsëri.'
      );
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  // Helper function for local translation of a given object
  const tLocal = (translationObj) => {
    if (!translationObj) return '';
    return currentLanguage === 'en' ? translationObj.en : translationObj.sq;
  };

  return (
    <div className='pt-[12rem]'>
      <Helmet>
        <title>{`Emko - ${tLocal(categoryTranslationMap[selectedCategory] || { en: 'All Products', sq: 'Të gjitha produktet' })} Catalog`}</title>
        <meta name="description" content="Explore our comprehensive catalog of Emko products, designed for various institutional needs." />
        <meta property="og:title" content={`Emko - ${tLocal(categoryTranslationMap[selectedCategory] || { en: 'All Products', sq: 'Të gjitha produktet' })} Catalog`} />
        <meta property="og:description" content="Explore our comprehensive catalog of Emko products, designed for various institutional needs." />
        <meta property="og:image" content="https://www.emko-client.vercel.app/assets/emko-logo.png" />
        <meta property="og:url" content={`https://www.emko-client.vercel.app/products/category/${selectedCategory}`} />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="canonical" href={`https://www.emko-client.vercel.app/products/category/${selectedCategory}`} />
      </Helmet>
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
              currentLanguage={currentLanguage}
            />
          </div>
          <div className="md:w-3/4">
            <div className="mb-4">
              <h2 className="text-2xl font-semibold">
                {tLocal(categoryTranslationMap[selectedCategory] || { en: 'All Products', sq: 'Të gjitha produktet' })}
              </h2>
              {selectedSubcategory ? (
                <>
                  <p className="text-gray-600">
                    {tLocal(categoryTranslationMap[selectedSubcategory] || { en: selectedSubcategory, sq: selectedSubcategory })}
                  </p>
                  <p className="text-gray-600 mt-2">
                    {selectedSubcategoryData?.description?.[currentLanguage] || ''}
                  </p>
                </>
              ) : (
                (selectedCategory !== 'all-products') && (
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
                    ? `Download ${tLocal(categoryTranslationMap[selectedCategory])} Catalog`
                    : `Shkarko katalogun për ${tLocal(categoryTranslationMap[selectedCategory])}`}
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
                    ? `Download ${tLocal(categoryTranslationMap[selectedSubcategory])} Catalog`
                    : `Shkarko katalogun për ${tLocal(categoryTranslationMap[selectedSubcategory])}`}
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
    </div>
  );
};

export default ProductCatalog;
