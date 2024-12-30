// src/pages/ProductDashboard.js
import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/userContext';
import axios from 'axios';
import Loader from '../components/Loader';
import DeleteProduct from './DeleteProduct';
import { toast } from 'react-toastify';
import categories from '../data/categories';

const ProductDashboard = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { currentUser } = useContext(UserContext);
  const token = currentUser?.token;

  const [selectedCategory, setSelectedCategory] = useState('all-products');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        let response;
        if (selectedCategory === 'all-products') {
          response = await axios.get(`${process.env.REACT_APP_BASE_URL}/products`, {
            headers: { Authorization: `Bearer ${token}` },
          });
        } else {
          const params = {};
          if (selectedSubcategory) {
            params.subcategory = selectedSubcategory;
          }
          response = await axios.get(`${process.env.REACT_APP_BASE_URL}/products/categories/${selectedCategory}`, {
            headers: { Authorization: `Bearer ${token}` },
            params,
          });
        }

        const userProducts = response.data.filter((product) => {
          if (product.creator) {
            const creatorId =
              typeof product.creator === 'object'
                ? product.creator._id.toString()
                : product.creator.toString();
            const currentUserId = (currentUser.id || currentUser._id).toString();
            return creatorId === currentUserId;
          }
          return false;
        });

        setProducts(userProducts);
        setFilteredProducts(userProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
        toast.error('Failed to fetch products.');
      }
      setIsLoading(false);
    };
    fetchProducts();
  }, [selectedCategory, selectedSubcategory, currentUser.id, currentUser._id, token]);

  const handleCategoryChange = (e) => {
    const categorySlug = e.target.value;
    setSelectedCategory(categorySlug);
    setSelectedSubcategory('');
  };

  const handleSubcategoryChange = (e) => {
    const subcategorySlug = e.target.value;
    setSelectedSubcategory(subcategorySlug);
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <section className="bg-gray-100 min-h-screen py-12 px-4 sm:px-6 lg:px-8 pt-[12rem]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            Product Dashboard
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl">
            Manage and view all your products in one place
          </p>
        </div>

        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 sm:space-x-4 mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                <div className="w-full sm:w-48">
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    id="category"
                    value={selectedCategory}
                    onChange={handleCategoryChange}
                    className="block w-full p-2 border border-gray-300 rounded-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    <option value="all-products">All Products</option>
                    {categories.map((cat) => (
                      <option key={cat.slug} value={cat.slug}>
                        {cat.name.en}
                      </option>
                    ))}
                  </select>
                </div>

                {selectedCategory !== 'all-products' && (
                  <div className="w-full sm:w-48">
                    <label htmlFor="subcategory" className="block text-sm font-medium text-gray-700 mb-1">
                      Subcategory
                    </label>
                    <select
                      id="subcategory"
                      value={selectedSubcategory}
                      onChange={handleSubcategoryChange}
                      className="block w-full p-2 border border-gray-300 rounded-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                      <option value="">All Subcategories</option>
                      {categories
                        .find((cat) => cat.slug === selectedCategory)
                        ?.subcategories.map((sub) => (
                          <option key={sub.slug} value={sub.slug}>
                            {sub.name.en}
                          </option>
                        ))}
                    </select>
                  </div>
                )}
              </div>

              <div>
                <Link
                  to="/create-product"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-full shadow-sm text-white bg-primary hover:bg-primary-transparent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Add New Product
                </Link>
              </div>
            </div>

            {products.length ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <article
                    key={product.slug}
                    className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl"
                  >
                    <div className="relative w-full h-48">
                      {product.images && product.images.length > 0 ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="object-cover w-full h-full"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/images/placeholder.jpg'; // Replace with your placeholder image path
                          }}
                        />
                      ) : (
                        <div className="bg-gray-200 w-full h-full flex items-center justify-center">
                          <span className="text-gray-400">No image available</span>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">{product.name}</h4>
                      <div className="flex justify-between items-center mt-4">
                        <Link
                          to={`/products/${product.slug}`}
                          className="text-primary text-xs hover:text-secondary transform hover:text-sm transition-all duration-300"
                        >
                          View
                        </Link>
                        <div className="flex space-x-2">
                          <Link
                            to={`/products/${product.slug}/edit`}
                            className="btn btn-primary"
                          >
                            Edit
                          </Link>
                          <DeleteProduct slug={product.slug} />
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    vectorEffect="non-scaling-stroke"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
                  />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No products</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by creating a new product.</p>
                <div className="mt-6">
                  <Link
                    to="/create-product"
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-full text-white bg-primary hover:bg-primary-transparent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Add New Product
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductDashboard;
