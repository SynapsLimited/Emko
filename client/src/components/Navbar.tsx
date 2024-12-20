// src/components/Navbar.tsx

import React, { useState, useEffect, ChangeEvent, KeyboardEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Bell, Search } from 'lucide-react';
import LatestProductModal from './LatestProductModal.tsx';
import Marquee from './Marquee.tsx';
import { useTranslation } from 'react-i18next';

// Define the Product interface
interface Color {
  hex: string;
}

interface Product {
  _id: string;
  name: string;
  name_en?: string;
  slug: string;
  images: string[];
  variations: string[];
  variations_en?: string[];
  description: string;
  description_en?: string;
  colors?: Color[];
  createdAt: string; // Ensure this field exists and is properly formatted
}

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [currentLanguage, setCurrentLanguage] = useState<string>('EN');

  // Search-related states
  const [query, setQuery] = useState<string>('');
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [suggestions, setSuggestions] = useState<{ product: Product; displayText: string }[]>([]);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);

  const { i18n } = useTranslation();
  const currentLang = i18n.language || 'en';
  const navigate = useNavigate();

  // Variants for NavLinks staggered fade-in
  const navLinkVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
      },
    }),
  };

  // Effect to handle scroll state
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Effect to fetch all products on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/products`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: Product[] = await response.json();

        if (Array.isArray(data)) {
          setAllProducts(data);
        } else {
          console.error('Fetched products is not an array:', data);
          setAllProducts([]);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        setAllProducts([]);
      }
    };
    fetchProducts();
  }, []);

  // Effect to update suggestions based on query
  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    const normalizedQuery = normalizeText(query);
    const matchedSuggestions: { product: Product; displayText: string }[] = [];

    allProducts.forEach((product) => {
      const name = currentLang === 'en' ? product.name_en || product.name : product.name;
      const variations = currentLang === 'en' ? product.variations_en || product.variations : product.variations;

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
  }, [query, allProducts, currentLang]);

  // Debugging: Log fetched products and suggestions
  useEffect(() => {
  }, [allProducts]);

  useEffect(() => {

  }, [query, suggestions]);

  // Helper function to normalize text
  const normalizeText = (text: string): string => {
    return text.toLowerCase().replace(/ç/g, 'c').replace(/ë/g, 'e');
  };

  // Event handlers for search input
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
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

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setShowSuggestions(false);
      e.preventDefault();
      if (suggestions.length > 0) {
        navigate(`/products/${suggestions[0].product.slug}`);
      }
    }
  };

  const handleSuggestionClick = (suggestion: { product: Product; displayText: string }) => {
    setQuery('');
    navigate(`/products/${suggestion.product.slug}`);
    setShowSuggestions(false);
  };

  // Function to toggle language
  const toggleLanguage = (lang: string) => {
    setCurrentLanguage(lang);
    i18n.changeLanguage(lang.toLowerCase()); // Assuming i18n is configured to handle language changes
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Top Navbar */}
      <div
        className={`bg-secondary text-white py-2 px-4 transition-all duration-300 ${
          isScrolled ? 'opacity-0 h-0 overflow-hidden -mb-[20px]' : 'opacity-100'
        }`}
      >
        <div className="container mx-auto flex items-center justify-end">
          <div className="flex items-center space-x-2 sm:space-x-4 relative">
            {/* Integrated Search Bar */}
            <div className="search-bar-container flex relative w-32 sm:w-auto">
              <Search className="search-icon absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="search"
                placeholder={currentLanguage === 'en' ? "Search..." : "Kërko..."}
                className="search-input w-full py-1 px-3 pl-8 pr-8 rounded-full text-black text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                value={query}
                onChange={handleInputChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
              />
              {showSuggestions && suggestions.length > 0 && (
                <div className="suggestions-container absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg  shadow-lg z-50">
                  <ul>
                    {suggestions.map((suggestion, index) => (
                      <li
                        key={`${suggestion.product._id}-${index}`}
                        className="suggestion-item px-4 py-2 hover:bg-gray-100 hover:rounded-lg cursor-pointer flex items-center"
                        onClick={() => handleSuggestionClick(suggestion)}
                      >
                        {suggestion.product.images && suggestion.product.images.length > 0 ? (
                          <img
                            src={suggestion.product.images[0]}
                            alt={suggestion.displayText}
                            className="suggestion-image w-8 h-8 object-cover rounded mr-2"
                          />
                        ) : (
                          <div className="suggestion-placeholder w-8 h-8 bg-gray-300 rounded mr-2"></div>
                        )}
                        <span className="suggestion-text text-sm text-gray-700">{suggestion.displayText}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Latest Product Button */}
            <motion.button
              onClick={() => setIsModalOpen(true)}
              className="bg-primary text-white p-1 sm:p-2 rounded-full hover:bg-opacity-80 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Latest Product"
            >
              <Bell size={16} />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Marquee Section */}
      <Marquee />

      {/* Bottom Navbar */}
      <nav
        className={`bg-white-transparent-navbar backdrop-blur-sm shadow-md transition-all duration-300 ${
          isScrolled ? '' : 'py-2'
        }`}
      >
        <div className="container mx-auto flex items-center justify-between px-4">
          <Link to="/" className="font-bold text-primary">
            <img className="w-[70px] h-[70px] -p-[10px]" src="/assets/emko-logo.png" alt="Logo" />
          </Link>
          <div className="hidden md:flex items-center space-x-8">
            <NavLinks />
            <div className="flex items-center space-x-2">
              <div className="h-4 w-px bg-gray-300"></div>
              <LanguageToggle currentLanguage={currentLanguage} toggleLanguage={toggleLanguage} />
            </div>
          </div>
          <button
            className="md:hidden text-primary"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Menu size={24} />
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-secondary bg-opacity-50 z-50"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween' }}
              className="fixed right-0 top-0 bottom-0 w-64 bg-white-transparent-navbar backdrop-blur-md shadow-lg flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 relative flex flex-col items-center justify-center flex-grow">
                <button
                  className="absolute top-4 right-4 text-primary"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <X size={24} />
                </button>
                <motion.div
                  className="flex flex-col items-center space-y-4 mt-8"
                  initial="hidden"
                  animate="visible"
                >
                  {NavLinkItems.map((link, index) => (
                    <motion.div
                      key={link.to}
                      custom={index}
                      variants={navLinkVariants}
                    >
                      <Link
                        to={link.to}
                        className="text-secondary hover:text-primary font-bold text-lg"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {link.name}
                      </Link>
                    </motion.div>
                  ))}
                </motion.div>
                {/* Separator Line */}
                <div className="my-6 w-full flex justify-center">
                  <span className="h-px bg-gray-300 w-3/4"></span>
                </div>
                {/* Language Toggle */}
                <LanguageToggle currentLanguage={currentLanguage} toggleLanguage={toggleLanguage} mobile />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Latest Product Modal */}
      <LatestProductModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </header>
  );
}

// Define NavLinkItems outside to use in mobile menu with indexing
const NavLinkItems = [
  { to: "/", name: "Home" },
  { to: "/about", name: "About" },
  { to: "/products", name: "Products" },
  { to: "/projects", name: "Projects" },
  { to: "/certifications", name: "Certifications" },
  { to: "/contact", name: "Contact" },
];

function NavLinks() {
  return (
    <>
      {NavLinkItems.map((link) => (
        <Link
          key={link.to}
          to={link.to}
          className="text-secondary hover:text-primary font-bold transition-colors"
        >
          {link.name}
        </Link>
      ))}
    </>
  );
}

function LanguageToggle({
  currentLanguage,
  toggleLanguage,
  mobile,
}: {
  currentLanguage: string;
  toggleLanguage: (lang: string) => void;
  mobile?: boolean;
}) {
  return (
    <div className={`flex p-[10px] space-x-2 ${mobile ? 'flex-col items-center' : 'flex-row'}`}>
      <div className="relative flex items-center">
        <motion.button
          onClick={() => toggleLanguage('AL')}
          className={`w-10 h-10 flex items-center justify-center rounded-full border-2 border-primary transition-colors relative
            ${currentLanguage === 'AL' ? 'bg-primary text-white' : 'bg-transparent text-primary'}
          `}
          whileTap={{ scale: 0.9 }}
        >
          AL
        </motion.button>
      </div>
      {mobile && (
        <div className="w-full h-px bg-gray-300 my-2"></div>
      )}
      <div className="relative flex items-center">
        <motion.button
          onClick={() => toggleLanguage('EN')}
          className={`w-10 h-10 flex items-center justify-center rounded-full border-2 border-primary transition-colors relative
            ${currentLanguage === 'EN' ? 'bg-primary text-white' : 'bg-transparent text-primary'}
          `}
          whileTap={{ scale: 0.9 }}
        >
          EN
        </motion.button>
      </div>
    </div>
  );
}
