import React, { useState, useContext, useEffect } from 'react';
import { UserContext } from '../context/userContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import ColorSelector from './../components/ColorSelector';
import categories from '../data/categories';
import Select from 'react-select';

const CreateProduct = () => {
  const [name, setName] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [category, setCategory] = useState(null);
  const [subcategory, setSubcategory] = useState(null);
  const [description, setDescription] = useState('');
  const [descriptionEn, setDescriptionEn] = useState('');
  const [variations, setVariations] = useState('');
  const [variationsEn, setVariationsEn] = useState('');
  const [images, setImages] = useState([]);
  const [colors, setColors] = useState([]);
  const [error, setError] = useState('');
  const [addTranslation, setAddTranslation] = useState(false);

  const navigate = useNavigate();

  const { currentUser } = useContext(UserContext);
  const token = currentUser?.token;

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  // Prepare options for React Select
  const categoryOptions = categories.map((cat) => ({
    value: cat.slug,
    label: (
      <div className="flex items-center">
        <cat.icon className="mr-2" />
        <span>{cat.name.en}</span>
      </div>
    ),
    data: cat, // To access subcategories
  }));

  const selectedCategoryData = category ? categories.find(cat => cat.slug === category.value) : null;

  const subcategoryOptions = selectedCategoryData
    ? selectedCategoryData.subcategories.map((sub) => ({
        value: sub.slug,
        label: (
          <div className="flex items-center">
            {/* Optionally, add subcategory icons if available */}
            {/* <sub.icon className="mr-2" /> */}
            <span>{sub.name.en}</span>
          </div>
        ),
      }))
    : [];

  const createProduct = async (e) => {
    e.preventDefault();

    // Reset error
    setError('');

    // Validation
    if (images.length === 0) {
      setError('Please upload at least one image.');
      toast.error('Please upload at least one image.');
      return;
    }

    if (!category) {
      setError('Please select a category.');
      toast.error('Please select a category.');
      return;
    }

    if (selectedCategoryData?.subcategories.length > 0 && !subcategory) {
      setError('Please select a subcategory.');
      toast.error('Please select a subcategory.');
      return;
    }

    const productData = new FormData();
    productData.set('name', name);
    productData.set('category', category.value);
    if (subcategory) {
      productData.set('subcategory', subcategory.value);
    }
    productData.set('description', description);
    productData.set('variations', variations);

    if (addTranslation) {
      productData.set('name_en', nameEn);
      productData.set('description_en', descriptionEn);
      productData.set('variations_en', variationsEn);
    }

    productData.set('colors', JSON.stringify(colors));

    images.forEach((image) => {
      productData.append('images', image);
    });

    // Log the FormData entries for debugging
    console.log('FormData Entries:');
    for (let pair of productData.entries()) {
      console.log(`${pair[0]}: ${pair[1]}`);
    }

    try {
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/products`, productData, {
        withCredentials: true,
        headers: { 
          Authorization: `Bearer ${token}`, 
          // 'Content-Type': 'multipart/form-data' // Removed this line
        },
      });
      if (response.status === 201) {
        toast.success('Product created successfully.');
        navigate('/products-dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
      toast.error(err.response?.data?.message || 'An error occurred');
      console.error('Error creating product:', err.response?.data);
    }
  };

  const handleImageChange = (e) => {
    // Convert FileList to Array
    setImages(Array.from(e.target.files));
  };

  return (
    <section className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8 mt-[10rem]">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-8">Create Product</h2>
        {error && <p className="text-red-600 text-center mb-4">{error}</p>}
        <form className="space-y-6" onSubmit={createProduct}>
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
              Category <span className="text-red-500">*</span>
            </label>
            <Select
              id="category"
              value={category}
              onChange={(selectedOption) => {
                setCategory(selectedOption);
                setSubcategory(null); // Reset subcategory on category change
              }}
              options={categoryOptions}
              className="mt-1"
              placeholder="Select Category"
              isSearchable
              required
            />
          </div>

          {/* Subcategory */}
          {selectedCategoryData && selectedCategoryData.subcategories.length > 0 && (
            <div>
              <label htmlFor="subcategory" className="block text-sm font-medium text-gray-700">
                Subcategory <span className="text-red-500">*</span>
              </label>
              <Select
                id="subcategory"
                value={subcategory}
                onChange={(selectedOption) => setSubcategory(selectedOption)}
                options={subcategoryOptions}
                className="mt-1"
                placeholder="Select Subcategory"
                isSearchable
                required
              />
            </div>
          )}

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>

          {/* Variations */}
          <div>
            <label htmlFor="variations" className="block text-sm font-medium text-gray-700">
              Variations
            </label>
            <input
              type="text"
              id="variations"
              value={variations}
              onChange={(e) => setVariations(e.target.value)}
              placeholder="Comma-separated values (e.g., Red, Blue, Green)"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          {/* Translation Option */}
          <div className="flex items-center">
            <input
              id="addTranslation"
              type="checkbox"
              checked={addTranslation}
              onChange={() => setAddTranslation(!addTranslation)}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="addTranslation" className="ml-2 block text-sm text-gray-900">
              Add Translation in English
            </label>
          </div>

          {/* Translation Fields */}
          {addTranslation && (
            <>
              {/* Name in English */}
              <div>
                <label htmlFor="nameEn" className="block text-sm font-medium text-gray-700">
                  Name in English <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="nameEn"
                  value={nameEn}
                  onChange={(e) => setNameEn(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                />
              </div>

              {/* Description in English */}
              <div>
                <label htmlFor="descriptionEn" className="block text-sm font-medium text-gray-700">
                  Description in English <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="descriptionEn"
                  value={descriptionEn}
                  onChange={(e) => setDescriptionEn(e.target.value)}
                  rows={5}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                />
              </div>

              {/* Variations in English */}
              <div>
                <label htmlFor="variationsEn" className="block text-sm font-medium text-gray-700">
                  Variations in English
                </label>
                <input
                  type="text"
                  id="variationsEn"
                  value={variationsEn}
                  onChange={(e) => setVariationsEn(e.target.value)}
                  placeholder="Comma-separated values (e.g., Red, Blue, Green)"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </>
          )}

          {/* Color Selector */}
          <ColorSelector colors={colors} setColors={setColors} />

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Product Images <span className="text-red-500">*</span></label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                {/* SVG Icon */}
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                  aria-hidden="true"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {/* Upload Instructions */}
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                  >
                    <span>Upload files</span>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      className="sr-only"
                      onChange={handleImageChange}
                      accept="image/png, image/jpeg, image/webp"
                      multiple
                      required
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG, WEBP up to 10MB each</p>
              </div>
            </div>
            {/* Display Selected Images */}
            {images.length > 0 && (
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
                {images.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`Preview ${index}`}
                      className="w-full h-32 object-cover rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const newImages = [...images];
                        newImages.splice(index, 1);
                        setImages(newImages);
                      }}
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Create Product
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default CreateProduct;
