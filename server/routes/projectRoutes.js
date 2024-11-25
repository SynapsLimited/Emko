// routes/projectRoutes.js

const { Router } = require('express');
const {
  createProject,
  getProjects,
  getProjectBySlug,
  editProject,
  deleteProject,
} = require('../controllers/projectControllers');
const authMiddleware = require('../middleware/authMiddleware');
const multer = require('multer');
const storage = multer.memoryStorage(); // Store files in memory for Vercel Blob
const upload = multer({ storage });
const router = Router();

// Routes
router.post('/', authMiddleware, upload.array('images', 10), createProject);
router.get('/', getProjects);
router.get('/:slug', getProjectBySlug); // Fetch by slug
router.patch('/:slug/edit', authMiddleware, upload.array('images', 10), editProject);
router.delete('/:slug', authMiddleware, deleteProject); // Delete by slug

module.exports = router;
