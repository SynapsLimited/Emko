// src/App.js
import React, { useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './App.css';
import './i18n/i18n';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import CookieConsent from './components/CookieConsent';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import FixedMenu from './components/FixedMenu';
import UserProvider, { UserContext } from './context/userContext';
import LoadingScreen from './components/LoadingScreen';

import Home from './pages/Home';
import About from './pages/About';
import Products from './pages/Products';
import Projects from './pages/Projects';
import Certifications from './pages/Certifications';
import Contact from './pages/Contact';

import ScrollToTop from './components/ScrollToTop';
import Layout from './components/Layout';
import ErrorPage from './components/ErrorPage';

// User pages
import Register from './users/Register';
import Login from './users/Login';
import UserProfile from './users/UserProfile';
import Logout from './users/Logout';

// Product components & pages
import ProductCatalog from './products/ProductCatalog';
import ProductDashboard from './products/ProductDashboard';
import CreateProduct from './products/CreateProduct';
import DeleteProduct from './products/DeleteProduct';
import EditProduct from './products/EditProduct';
import ProductDetail from './products/ProductDetail';

// Project pages
import ProjectDashboard from './projects/ProjectDashboard';
import CreateProject from './projects/CreateProject';
import DeleteProject from './projects/DeleteProject';
import EditProject from './projects/EditProject';

import { Analytics } from '@vercel/analytics/react';

function App() {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true, mirror: false });
    AOS.refresh();
  }, []);

  const [currentTheme, setCurrentTheme] = useState('normal');
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setCurrentTheme(savedTheme);
    } else {
      setCurrentTheme('normal');
      localStorage.setItem('theme', 'normal');
    }
  }, []);

  const updateTheme = (themeClass) => {
    setCurrentTheme(themeClass);
    localStorage.setItem('theme', themeClass);
  };

  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  // Conditionally render Vercel Analytics based on cookie consent
  const consent = localStorage.getItem('adshCookieConsent');
  const renderAnalytics = consent === 'true';

  if (loading) return <LoadingScreen />;

  return (
    <HelmetProvider>
      <UserContext.Consumer>
        {({ currentUser }) => (
          <>
            <Navbar />
            <FixedMenu />
            <CookieConsent />
            {renderAnalytics && <Analytics />}
            <ScrollToTop />
            <Layout>
              <div className="content">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/projects" element={<Projects />} />
                  <Route path="/certifications" element={<Certifications />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/profile/:id" element={<UserProfile />} />
                  <Route path="/logout" element={<Logout />} />
                  <Route path="/products/category/:category" element={<ProductCatalog />} />
                  <Route path="/products/category/:category/subcategory/:subcategory" element={<ProductCatalog />} />
                  <Route path="/products-dashboard" element={<ProductDashboard />} />
                  <Route path="/create-product" element={<CreateProduct />} />
                  <Route path="/products/:slug/delete" element={<DeleteProduct />} />
                  <Route path="/products/:slug/edit" element={<EditProduct />} />
                  <Route path="/products/:slug" element={<ProductDetail />} />
                  <Route path="/projects-dashboard" element={<ProjectDashboard />} />
                  <Route path="/create-project" element={<CreateProject />} />
                  <Route path="/projects/:slug/delete" element={<DeleteProject />} />
                  <Route path="/projects/:slug/edit" element={<EditProject />} />
                  <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                  <Route path="*" element={<ErrorPage />} />
                </Routes>
                <ToastContainer />
              </div>
              <Footer />
            </Layout>
          </>
        )}
      </UserContext.Consumer>
    </HelmetProvider>
  );
}

export default function AppWrapper() {
  return (
    <Router>
      <UserProvider>
        <App />
      </UserProvider>
    </Router>
  );
}
