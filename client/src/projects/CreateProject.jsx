// src/components/CreateProject.jsx

import React, { useState, useContext, useEffect } from 'react';
import { UserContext } from '../context/userContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const CreateProject = () => {
  const [name, setName] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [description, setDescription] = useState('');
  const [descriptionEn, setDescriptionEn] = useState('');
  const [images, setImages] = useState([]);
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

  const createProject = async e => {
    e.preventDefault();

    if (images.length === 0) {
      setError('Please upload at least one image.');
      return;
    }

    const projectData = new FormData();
    projectData.set('name', name);
    projectData.set('description', description);

    if (addTranslation) {
      projectData.set('name_en', nameEn);
      projectData.set('description_en', descriptionEn);
    }

    images.forEach(image => {
      projectData.append('images', image);
    });

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/projects`,
        projectData,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      if (response.status === 201) {
        toast.success('Project created successfully.');
        navigate('/projects-dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
      toast.error(err.response?.data?.message || 'An error occurred');
    }
  };

  const handleImageChange = e => {
    setImages([...e.target.files]);
  };

  return (
    <section data-aos="fade-up" className="create-product">
      <div className="container">
        <h2>Create Project</h2>
        {error && <p className="form-error-message">{error}</p>}
        <form className="form create-project-form" onSubmit={createProject}>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={e => setName(e.target.value)}
            autoFocus
            required
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={5}
            required
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
                onChange={e => setNameEn(e.target.value)}
              />
              <textarea
                placeholder="Description in English"
                value={descriptionEn}
                onChange={e => setDescriptionEn(e.target.value)}
                rows={5}
              />
            </>
          )}

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

export default CreateProject;
