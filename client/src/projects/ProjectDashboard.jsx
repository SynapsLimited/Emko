// src/components/ProjectDashboard.jsx

import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/userContext';
import axios from 'axios';
import Loader from '../components/Loader';
import DeleteProject from './DeleteProject';
import { toast } from 'react-toastify';

const ProjectDashboard = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { currentUser } = useContext(UserContext);
  const token = currentUser?.token;

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/projects`);
        const userProjects = response.data.filter(project => {
          if (project.creator) {
            const creatorId =
              typeof project.creator === 'object'
                ? project.creator._id.toString()
                : project.creator.toString();
            const currentUserId = (currentUser.id || currentUser._id).toString();
            return creatorId === currentUserId;
          }
          return false;
        });
        setProjects(userProjects);
      } catch (error) {
        console.error('Error fetching projects:', error);
        toast.error('Failed to fetch projects.');
      }
      setIsLoading(false);
    };
    fetchProjects();
  }, [currentUser.id, currentUser._id, token]);

  if (isLoading) {
    return <Loader />;
  }

  const handleDeleteProject = slugToDelete => {
    setProjects(prevProjects =>
      prevProjects.filter(project => project.slug !== slugToDelete)
    );
    toast.success('Project deleted successfully.');
  };

  return (
    <section data-aos="fade-up" className="dashboard">
      <div className="blog-title-filtered">
        <h1>Project Dashboard</h1>
      </div>

      {projects.length ? (
        <div className="container dashboard-container">
          {projects.map(project => (
            <article key={project.slug} className="dashboard-post">
              <div className="dashboard-post-info">
                <div className="dashboard-post-thumbnail">
                  {project.images && project.images.length > 0 ? (
                    <img src={project.images[0]} alt={project.name} />
                  ) : (
                    <p>No image available</p>
                  )}
                </div>
                <h4>{project.name}</h4>
              </div>
              <div className="dashboard-post-actions">
                <Link to={`/projects`} className="btn btn-primary">
                  View
                </Link>
                <Link to={`/projects/${project.slug}/edit`} className="btn btn-primary">
                  Edit
                </Link>
                <DeleteProject slug={project.slug} onDelete={handleDeleteProject} />
              </div>
            </article>
          ))}
        </div>
      ) : (
        <h2 className="center">No projects found.</h2>
      )}
    </section>
  );
};

export default ProjectDashboard;
