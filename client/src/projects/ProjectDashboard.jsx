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
    <section className="bg-gray-100 min-h-screen py-12 px-4 sm:px-6 lg:px-8 mt-[10rem]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            Project Dashboard
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl">
            Manage and view all your projects in one place
          </p>
        </div>

        <div className="mb-8 text-right">
          <Link
            to="/create-project"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Create New Project
          </Link>
        </div>

        {projects.length ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map(project => (
              <div key={project.slug} className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      {project.images && project.images.length > 0 ? (
                        <img className="h-12 w-12 rounded-full" src={project.images[0]} alt={project.name} />
                      ) : (
                        <div className="h-12 w-12 rounded-full bg-gray-300 flex items-center justify-center">
                          <span className="text-gray-500 font-medium">No Image</span>
                        </div>
                      )}
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">{project.name}</dt>
                        <dd>
                          <div className="text-lg font-medium text-gray-900">{project.description}</div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-5 py-3">
                  <div className="text-sm">
                    <Link to={`/projects`} className="font-medium text-indigo-600 hover:text-indigo-500">
                      View
                    </Link>
                  </div>
                </div>
                <div className="bg-gray-50 px-5 py-3 flex justify-between">
                  <Link
                    to={`/projects/${project.slug}/edit`}
                    className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-indigo-600 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Edit
                  </Link>
                  <DeleteProject slug={project.slug} onDelete={handleDeleteProject} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center">
            <h2 className="mt-2 text-lg font-medium text-gray-900">No projects found.</h2>
            <p className="mt-1 text-sm text-gray-500">Get started by creating a new project.</p>
            <div className="mt-6">
              <Link
                to="/create-project"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Create New Project
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProjectDashboard;

