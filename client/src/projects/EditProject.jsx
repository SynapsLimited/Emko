// src/components/EditProject.jsx

import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { UserContext } from '../context/userContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const EditProject = () => {
  const [name, setName] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [description, setDescription] = useState('');
  const [descriptionEn, setDescriptionEn] = useState('');
  const [existingImages, setExistingImages] = useState([]);
  const [imagesToDelete, setImagesToDelete] = useState([]); // New state for images marked for deletion
  const [newImages, setNewImages] = useState([]);
  const [error, setError] = useState('');
  const [addTranslation, setAddTranslation] = useState(false);

  const navigate = useNavigate();
  const { slug } = useParams();

  const { currentUser } = useContext(UserContext);
  const token = currentUser?.token;

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  useEffect(() => {
    const getProject = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/projects/${slug}`
        );
        const project = response.data;

        setName(project.name);
        setNameEn(project.name_en || '');
        setDescription(project.description);
        setDescriptionEn(project.description_en || '');
        setExistingImages(project.images || []);

        if (project.name_en || project.description_en) {
          setAddTranslation(true);
        }
      } catch (error) {
        console.error(error);
        setError('Project not found.');
      }
    };
    getProject();
  }, [slug]);

  const editProject = async e => {
    e.preventDefault();

    const projectData = new FormData();
    projectData.set('name', name);
    projectData.set('description', description);

    if (addTranslation) {
      projectData.set('name_en', nameEn);
      projectData.set('description_en', descriptionEn);
    }

    if (newImages.length > 0) {
      newImages.forEach(image => {
        projectData.append('images', image);
      });
    }

    // Include images to delete in the request
    projectData.set('imagesToDelete', JSON.stringify(imagesToDelete));

    try {
      const response = await axios.patch(
        `${process.env.REACT_APP_BASE_URL}/projects/${slug}/edit`,
        projectData,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      if (response.status === 200) {
        toast.success('Project updated successfully.');
        navigate('/projects-dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
      toast.error(err.response?.data?.message || 'An error occurred');
    }
  };

  const handleImageChange = e => {
    setNewImages([...e.target.files]);
  };

  // Function to handle deletion of an existing image
  const handleDeleteExistingImage = (imageUrl) => {
    // Remove the image from existingImages state
    setExistingImages((prevImages) => prevImages.filter((img) => img !== imageUrl));
    // Add the image URL to imagesToDelete state
    setImagesToDelete((prevToDelete) => [...prevToDelete, imageUrl]);
  };

  return (
    <section data-aos="fade-up" className="edit-product">
      <div className="container">
        <h2>Edit Project</h2>
        {error && <p className="form-error-message">{error}</p>}
        <form className="form edit-project-form" onSubmit={editProject}>
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

          <div>
            <h4>Existing Images:</h4>
            <div className="existing-images">
              {existingImages.length > 0 ? (
                existingImages.map((imgUrl, index) => (
                  <div key={index} className="existing-image-wrapper">
                    <img
                      src={imgUrl}
                      alt={`Existing image ${index + 1}`}
                      style={{ width: '100px', marginRight: '10px' }}
                    />
                    <button
                      type="button"
                      className="delete-image-button"
                      onClick={() => handleDeleteExistingImage(imgUrl)}
                    >
                      &times;
                    </button>
                  </div>
                ))
              ) : (
                <p>No existing images.</p>
              )}
            </div>
          </div>

          <div className="custom-file-input-container">
            <input
              className="custom-file-input"
              type="file"
              onChange={handleImageChange}
              accept="image/png, image/jpeg, image/webp"
              multiple
            />
          </div>
          <button type="submit" className="btn btn-primary btn-submit">
            Update
          </button>
        </form>
      </div>
    </section>
  );
};

export default EditProject;
