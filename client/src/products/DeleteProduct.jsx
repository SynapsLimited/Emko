// src/components/DeleteProduct.jsx

import React, { useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { UserContext } from '../context/userContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const DeleteProduct = ({ slug: propSlug }) => {
  const { slug: paramSlug } = useParams();
  const slug = propSlug || paramSlug; // Use propSlug if provided, else get from URL params

  const navigate = useNavigate();
  const { currentUser } = useContext(UserContext);
  const token = currentUser?.token;

  const removeProduct = async () => {
    if (!slug) {
      console.error('Product slug is undefined.');
      toast.error("Couldn't delete product.");
      return;
    }

    try {
      const response = await axios.delete(`${process.env.REACT_APP_BASE_URL}/products/${slug}`, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 200) {
        toast.success('Product deleted successfully.');
        navigate('/products-dashboard');
      }
    } catch (error) {
      toast.error("Couldn't delete product.");
    }
  };

  return (
    <button
      className="btn btn-secondary"
      style={{ fontFamily: 'Righteous, sans-serif' }}
      onClick={removeProduct}
    >
      Delete
    </button>
  );
};

export default DeleteProduct;
