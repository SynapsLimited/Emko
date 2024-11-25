// src/components/CreateProduct.jsx

import React, { useState, useContext, useEffect } from 'react';
import { UserContext } from '../context/userContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import ColorSelector from './../components/ColorSelector'; // Import the ColorSelector component

const CreateProduct = () => {
  const [name, setName] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [category, setCategory] = useState('Executive Chairs');
  const [description, setDescription] = useState('');
  const [descriptionEn, setDescriptionEn] = useState('');
  const [variations, setVariations] = useState('');
  const [variationsEn, setVariationsEn] = useState('');
  const [images, setImages] = useState([]);
  const [colors, setColors] = useState([]); // Add colors state
  const [error, setError] = useState('');
  const [addTranslation, setAddTranslation] = useState(false);

  const navigate = useNavigate();

  const { currentUser } = useContext(UserContext);
  const token = currentUser?.token;

  // Redirect to login page for any user who isn't logged in
  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  const PRODUCT_CATEGORIES = [
    'Executive Chairs',
    'Plastic Chairs',
    'Waiting Chairs',
    'Utility Chairs',
    'Amphitheater',
    'Auditoriums',
    'Seminar Halls',
    'School Classes',
    'Tables',
    'Laboratories',
    'Mixed',
    'Industrial Lines',
    'Metal Cabinets',
    'Metal Shelves',
    'Wardrobes',
    'Sofas',
    'Stadiums',
  ];

  const createProduct = async (e) => {
    e.preventDefault();

    if (images.length === 0) {
      setError('Please upload at least one image.');
      return;
    }

    const productData = new FormData();
    productData.set('name', name);
    productData.set('category', category);
    productData.set('description', description);
    productData.set('variations', variations);

    if (addTranslation) {
      productData.set('name_en', nameEn);
      productData.set('description_en', descriptionEn);
      productData.set('variations_en', variationsEn);
    }

    productData.set('colors', JSON.stringify(colors)); // Include colors in the form data

    // Append images to FormData
    images.forEach((image) => {
      productData.append('images', image);
    });

    try {
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/products`, productData, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
      });
      if (response.status === 201) {
        toast.success('Product created successfully.');
        navigate('/products-dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
      toast.error(err.response?.data?.message || 'An error occurred');
    }
  };

  const handleImageChange = (e) => {
    setImages([...e.target.files]);
  };

  return (
    <section data-aos="fade-up" className="create-product">
      <div className="container">
        <h2>Create Product</h2>
        {error && <p className="form-error-message">{error}</p>}
        <form className="form create-product-form" onSubmit={createProduct}>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
            required
          />
          <select name="category" value={category} onChange={(e) => setCategory(e.target.value)} required>
            {PRODUCT_CATEGORIES.map((cat) => (
              <option key={cat}>{cat}</option>
            ))}
          </select>
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            required
          />
          <input
            type="text"
            placeholder="Variations"
            value={variations}
            onChange={(e) => setVariations(e.target.value)}
          />
          <div className="custom-checkbox-container">
            <label>
              <input
                type="checkbox"
                checked={addTranslation}
                onChange={() => setAddTranslation(!addTranslation)}
              />
              Add Translation in English
            </label>
          </div>

          {addTranslation && (
            <>
              <input
                type="text"
                placeholder="Name in English"
                value={nameEn}
                onChange={(e) => setNameEn(e.target.value)}
              />
              <textarea
                placeholder="Description in English"
                value={descriptionEn}
                onChange={(e) => setDescriptionEn(e.target.value)}
                rows={5}
              />
              <input
                type="text"
                placeholder="Variations in English"
                value={variationsEn}
                onChange={(e) => setVariationsEn(e.target.value)}
              />
            </>
          )}

          <ColorSelector colors={colors} setColors={setColors} /> {/* Add ColorSelector here */}

          <div className="custom-file-input-container">
            <input
              className="custom-file-input"
              type="file"
              onChange={handleImageChange}
              accept="image/png, image/jpeg, image/webp"
              multiple
              required
            />
          </div>
          <button type="submit" className="btn btn-primary btn-submit">
            Create
          </button>
        </form>
      </div>
    </section>
  );
};

export default CreateProduct;
