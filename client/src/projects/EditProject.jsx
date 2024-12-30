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
  const [imagesToDelete, setImagesToDelete] = useState([]);
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
          `${process.env.REACT_APP_BASE_URL}/projects/${slug}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
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
  }, [slug, token]);

  const editProject = async (e) => {
    e.preventDefault();

    if (existingImages.length === 0 && newImages.length === 0) {
      setError('Please upload at least one image.');
      toast.error('Please upload at least one image.');
      return;
    }

    const projectData = new FormData();
    projectData.set('name', name);
    projectData.set('description', description);

    if (addTranslation) {
      projectData.set('name_en', nameEn);
      projectData.set('description_en', descriptionEn);
    }

    if (newImages.length > 0) {
      newImages.forEach((image) => {
        projectData.append('newImages', image); // Changed key to 'newImages' to differentiate
      });
    }

    if (imagesToDelete.length > 0) {
      projectData.set('imagesToDelete', JSON.stringify(imagesToDelete));
    }

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

  // Handle new image selections
  const handleNewImageChange = (e) => {
    const files = Array.from(e.target.files);
    const mappedFiles = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setNewImages((prevImages) => [...prevImages, ...mappedFiles]);
  };

  // Remove a new image before submission
  const removeNewImage = (index) => {
    setNewImages((prevImages) => {
      // Revoke the object URL to free memory
      URL.revokeObjectURL(prevImages[index].preview);
      return prevImages.filter((_, i) => i !== index);
    });
  };

  // Remove an existing image (marks it for deletion)
  const handleDeleteExistingImage = (imageUrl) => {
    setExistingImages((prevImages) => prevImages.filter((img) => img !== imageUrl));
    setImagesToDelete((prevToDelete) => [...prevToDelete, imageUrl]);
  };

  // Clean up object URLs when component unmounts
  useEffect(() => {
    return () => {
      newImages.forEach((image) => URL.revokeObjectURL(image.preview));
    };
  }, [newImages]);

  return (
    <section className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8 mt-[12rem]">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-8">Edit Project</h2>
        {error && <p className="text-red-600 text-center mb-4">{error}</p>}
        <form className="space-y-6" onSubmit={editProject}>
          {/* Project Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 
                         focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>

          {/* Project Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 
                         focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>

          {/* Add Translation Checkbox */}
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
              <div>
                <label htmlFor="nameEn" className="block text-sm font-medium text-gray-700">
                  Name in English
                </label>
                <input
                  type="text"
                  id="nameEn"
                  value={nameEn}
                  onChange={(e) => setNameEn(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 
                             focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="descriptionEn" className="block text-sm font-medium text-gray-700">
                  Description in English
                </label>
                <textarea
                  id="descriptionEn"
                  value={descriptionEn}
                  onChange={(e) => setDescriptionEn(e.target.value)}
                  rows={5}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 
                             focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </>
          )}

          {/* Existing Images */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Existing Images</label>
            {existingImages.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {existingImages.map((imgUrl, index) => (
                  <div key={index} className="relative">
                    <img
                      src={imgUrl}
                      alt={`Existing image ${index + 1}`}
                      className="w-full h-32 object-cover rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => handleDeleteExistingImage(imgUrl)}
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 m-1 
                                 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 
                                 focus:ring-red-500"
                      title="Remove Image"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586 
                             l4.293-4.293a1 1 0 111.414 1.414L11.414 
                             10l4.293 4.293a1 1 0 01-1.414 1.414L10 
                             11.414l-4.293 4.293a1 1 0 
                             01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 
                             010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No existing images.</p>
            )}
          </div>

          {/* Add New Images */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Add New Images</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 
                           border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                  aria-hidden="true"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 
                       01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 
                       0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 
                       015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 
                       4h.02"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="new-images"
                    className="relative cursor-pointer bg-white rounded-md font-medium 
                               text-indigo-600 hover:text-indigo-500 focus-within:outline-none 
                               focus-within:ring-2 focus-within:ring-offset-2 
                               focus-within:ring-indigo-500"
                  >
                    <span>Upload files</span>
                    <input
                      id="new-images"
                      name="new-images"
                      type="file"
                      className="sr-only"
                      onChange={handleNewImageChange}
                      accept="image/png, image/jpeg, image/webp"
                      multiple
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG, WEBP up to 10MB</p>
              </div>
            </div>
          </div>

          {/* Preview of New Images */}
          {newImages.length > 0 && (
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">New Image Previews</h3>
              <div className="grid grid-cols-2 gap-4">
                {newImages.map((imageObj, index) => (
                  <div key={index} className="relative">
                    <img
                      src={imageObj.preview}
                      alt={`New preview ${index + 1}`}
                      className="w-full h-32 object-cover rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => removeNewImage(index)}
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 m-1 
                                 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 
                                 focus:ring-red-500"
                      title="Remove Image"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586 
                             l4.293-4.293a1 1 0 111.414 1.414L11.414 
                             10l4.293 4.293a1 1 0 01-1.414 1.414L10 
                             11.414l-4.293 4.293a1 1 0 
                             01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 
                             010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent 
                         rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 
                         hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 
                         focus:ring-indigo-500"
            >
              Update Project
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default EditProject;
