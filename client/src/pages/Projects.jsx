// src/components/Projects.jsx

import React, { useEffect, useRef, useState } from 'react';
import './../css/projects.css';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import Hero from './../components/Hero'


export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const sectionRefs = useRef([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentProjectIndex, setCurrentProjectIndex] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [scrollPosition, setScrollPosition] = useState(0);

  // Fetch projects from backend
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/projects`);
        setProjects(response.data);
      } catch (err) {
        console.error('Error fetching projects:', err);
        setError('Failed to fetch projects.');
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  // Track scroll position to apply parallax effect
  useEffect(() => {
    const handleScroll = () => {
      const position = window.pageYOffset;
      setScrollPosition(position);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Intersection Observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
          }
        });
      },
      { threshold: 0.1 }
    );

    sectionRefs.current.forEach(ref => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, [projects]);

  const openModal = (projectIndex, imageIndex) => {
    setCurrentProjectIndex(projectIndex);
    setCurrentImageIndex(imageIndex);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const goToPreviousImage = () => {
    const projectImages = projects[currentProjectIndex].images;
    setCurrentImageIndex(
      prevIndex => (prevIndex - 1 + projectImages.length) % projectImages.length
    );
  };

  const goToNextImage = () => {
    const projectImages = projects[currentProjectIndex].images;
    setCurrentImageIndex(prevIndex => (prevIndex + 1) % projectImages.length);
  };

  if (loading) {
    return <div className="loader">Loading...</div>; // Or use your Loader component
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div>
      <Helmet>
        <title>Emko - Projekte</title>
      </Helmet>

      {/* Hero Section */}
      <Hero
        type="projects"
        scrollPosition={scrollPosition}
        title="Projekte"
        description="Shikoni projektet tona më të reja dhe më të suksesshme."
      />

      <div className="container">
        {projects.map((project, index) => (
          <section
            key={project.slug || index}
            ref={el => {
              sectionRefs.current[index] = el;
            }}
            className="project-section"
          >
            <h1 className="project-title">{project.name}</h1>
            <p className="project-description">{project.description}</p>
            <div className="image-grid">
              {project.images && project.images.length > 0 ? (
                project.images.map((src, imgIndex) => (
                  <div
                    key={imgIndex}
                    className={`image-wrapper ${imgIndex % 5 === 0 ? 'large' : ''}`}
                    onClick={() => openModal(index, imgIndex)}
                  >
                    <img
                      src={src}
                      alt={`${project.name} image ${imgIndex + 1}`}
                      className="project-image"
                    />
                    <div className="overlay">
                      <span>{`${project.name} #${imgIndex + 1}`}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p>No images available for this project.</p>
              )}
            </div>
          </section>
        ))}

        {modalOpen && (
          <div className="modal" onClick={closeModal}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <button className="close-button" onClick={closeModal}>
                ×
              </button>
              <button className="prev-button" onClick={goToPreviousImage}>
                ‹
              </button>
              <img
                src={
                  projects[currentProjectIndex].images[currentImageIndex]
                }
                alt="Modal"
                className="modal-image"
              />
              <button className="next-button" onClick={goToNextImage}>
                ›
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
