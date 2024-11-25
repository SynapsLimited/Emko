// controllers/projectControllers.js

const Project = require('../models/projectModel');
const HttpError = require('../models/errorModel');
const { put } = require('@vercel/blob');
const fetch = require('node-fetch');

// Utility functions to upload and delete images from Vercel Blob storage
const uploadToVercelBlob = async (fileBuffer, fileName) => {
  try {
    // Upload the file buffer to Vercel Blob storage
    const { url } = await put(fileName, fileBuffer, {
      access: 'public', // Ensure the file is publicly accessible
      token: process.env.BLOB_READ_WRITE_TOKEN, // Token with read/write access
      headers: {
        Authorization: `Bearer ${process.env.VERCEL_ACCESS_TOKEN}`, // Add Vercel API token
      },
    });

    // Log the success and return the URL
    console.log('Uploaded successfully to Vercel Blob: ', url);
    return url; // Return the public URL of the uploaded file
  } catch (error) {
    console.error('Error uploading file to Vercel Blob:', error);
    throw new Error('Failed to upload file to Vercel Blob');
  }
};

const deleteFromVercelBlob = async (fileUrl) => {
  try {
    if (!fileUrl) {
      console.log('No file to delete.');
      return;
    }

    const fileName = fileUrl.split('/').pop(); // Extract file name from URL
    const response = await fetch(`https://api.vercel.com/v2/blob/files/${fileName}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${process.env.VERCEL_ACCESS_TOKEN}`, // Vercel API token for authorization
      },
    });

    if (!response.ok) {
      throw new Error('Failed to delete from Vercel Blob Storage');
    }

    console.log(`Deleted successfully from Vercel Blob: ${fileName}`);
  } catch (error) {
    console.error('Error deleting file from Vercel Blob:', error);
  }
};

// ======================== Create a project
// POST : api/projects
// PROTECTED
const createProject = async (req, res, next) => {
  try {
    const {
      name,
      name_en,
      description,
      description_en,
    } = req.body;

    if (!name || !description || !req.files || req.files.length === 0) {
      return next(new HttpError('Fill in all fields and upload at least one image.', 422));
    }

    // Upload images
    const imageUrls = [];
    for (const file of req.files) {
      const fileBuffer = file.buffer;
      const fileName = `projects/${Date.now()}-${file.originalname}`;
      const imageUrl = await uploadToVercelBlob(fileBuffer, fileName);
      imageUrls.push(imageUrl);
    }

    // Save the project with the image URLs
    const newProject = await Project.create({
      name,
      name_en,
      description,
      description_en,
      images: imageUrls,
      creator: req.user.id,
    });

    res.status(201).json(newProject);
  } catch (error) {
    return next(new HttpError(error.message || 'Something went wrong', 500));
  }
};

// ======================== Get all projects
// GET : api/projects
// UNPROTECTED
const getProjects = async (req, res, next) => {
  try {
    const projects = await Project.find().sort({ updatedAt: -1 });
    res.status(200).json(projects);
  } catch (error) {
    return next(new HttpError(error));
  }
};

// ======================== Get single project by slug
// GET : api/projects/:slug
// UNPROTECTED
const getProjectBySlug = async (req, res, next) => {
  try {
    const projectSlug = req.params.slug;
    const project = await Project.findOne({ slug: projectSlug }).populate('creator', 'name email');

    if (!project) {
      return next(new HttpError('Project not found.', 404));
    }
    res.status(200).json(project);
  } catch (error) {
    return next(new HttpError('Project does not exist', 404));
  }
};

// ======================== Edit project
// PATCH : api/projects/:slug/edit
// PROTECTED
const editProject = async (req, res, next) => {
    try {
      const projectSlug = req.params.slug;
  
      const {
        name,
        name_en,
        description,
        description_en,
        imagesToDelete, // New field from the front-end
      } = req.body;
  
      if (!name || !description) {
        return next(new HttpError('Fill in all fields.', 422));
      }
  
      const oldProject = await Project.findOne({ slug: projectSlug });
      if (!oldProject) {
        return next(new HttpError('Project not found.', 404));
      }
  
      // Parse imagesToDelete if it's a string
      let imagesToDeleteArray = [];
      if (imagesToDelete) {
        imagesToDeleteArray = JSON.parse(imagesToDelete);
      }
  
      // Remove images that are marked for deletion from oldProject.images
      let updatedImages = oldProject.images.filter(
        (imageUrl) => !imagesToDeleteArray.includes(imageUrl)
      );
  
      // Delete the images from storage
      for (const imageUrl of imagesToDeleteArray) {
        await deleteFromVercelBlob(imageUrl);
      }
  
      // Check if new images were uploaded
      if (req.files && req.files.length > 0) {
        // Upload new images
        for (const file of req.files) {
          const fileBuffer = file.buffer;
          const fileName = `projects/${Date.now()}-${file.originalname}`;
          const imageUrl = await uploadToVercelBlob(fileBuffer, fileName);
          updatedImages.push(imageUrl);
        }
      }
  
      // Update the project with the new data
      oldProject.name = name;
      oldProject.name_en = name_en;
      oldProject.description = description;
      oldProject.description_en = description_en;
      oldProject.images = updatedImages;
  
      // Save the updated project
      const updatedProject = await oldProject.save();
  
      res.status(200).json(updatedProject);
    } catch (error) {
      return next(new HttpError(error.message || "Couldn't update project", 500));
    }
  };

// ======================== Delete project
// DELETE : api/projects/:slug
// PROTECTED
const deleteProject = async (req, res, next) => {
  try {
    const projectSlug = req.params.slug;

    // Find the project by slug
    const project = await Project.findOne({ slug: projectSlug });

    if (!project) {
      return next(new HttpError('Project not found.', 404));
    }

    // Delete images from Vercel Blob storage
    for (const imageUrl of project.images) {
      await deleteFromVercelBlob(imageUrl);
    }

    // Delete the project from the database
    await Project.findByIdAndDelete(project._id);

    res.status(200).json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    return next(new HttpError("Couldn't delete project.", 400));
  }
};

module.exports = {
  createProject,
  getProjects,
  getProjectBySlug,
  editProject,
  deleteProject,
};
