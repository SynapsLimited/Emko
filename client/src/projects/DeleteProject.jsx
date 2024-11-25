// src/components/DeleteProject.jsx

import React, { useContext } from 'react';
import { UserContext } from '../context/userContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const DeleteProject = ({ slug, onDelete }) => {
  const { currentUser } = useContext(UserContext);
  const token = currentUser?.token;

  const removeProject = async () => {
    if (!slug) {
      console.error('Project slug is undefined.');
      toast.error("Couldn't delete project.");
      return;
    }

    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_BASE_URL}/projects/${slug}`,
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.status === 200) {
        toast.success('Project deleted successfully.');
        if (onDelete) {
          onDelete(slug);
        }
      }
    } catch (error) {
      console.error('Error deleting project:', error);
      toast.error("Couldn't delete project.");
    }
  };

  return (
    <button
      className="btn btn-secondary"
      style={{ fontFamily: 'Righteous, sans-serif' }}
      onClick={removeProject}
    >
      Delete
    </button>
  );
};

export default DeleteProject;
