// src/components/HeroInteractive.jsx

import React, { useState } from 'react';
import { Bell, Search, ShoppingBag } from 'lucide-react';
import SearchBarHome from './SearchBarHome';
import ProductsDropdown from './ProductsDropdown';
import LatestProductsModal from './LatestProductsModal';
import './../css/hero.css';

const HeroInteractive = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('search');

  return (
    <div className="hero-interactive-section">
      <div className="hero-interactive-content">
        {/* Icons on the left */}
        <div className="hero-interactive-icons">
          <button
            className={`hero-tab-button ${activeTab === 'search' ? 'active' : ''}`}
            onClick={() => setActiveTab('search')}
            aria-label="Search"
          >
            <Search size={24} />
          </button>
          <button
            className={`hero-tab-button ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => setActiveTab('products')}
            aria-label="Products"
          >
            <ShoppingBag size={24} />
          </button>
          <button
            className="hero-tab-button"
            onClick={() => setIsModalOpen(true)}
            aria-label="Latest Products"
          >
            <Bell size={24} />
          </button>
        </div>

        {/* SearchBar or ProductsDropdown */}
        <div className="hero-interactive-element">
          {activeTab === 'search' && <SearchBarHome />}
          {activeTab === 'products' && <ProductsDropdown />}
        </div>
      </div>
      {/* Latest Products Modal */}
      <LatestProductsModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default HeroInteractive;
