// server/index.js

const express = require('express');
const cors = require('cors');
const { connect } = require('mongoose');
require('dotenv').config();
// const fileUpload = require('express-fileupload'); // Not needed since using multer

const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const projectRoutes = require('./routes/projectRoutes'); // Import project routes
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS configuration
app.use(cors({
  origin: [
    "http://localhost:3000", 
    "http://127.0.0.1:3000", 
    "https://emko-client.vercel.app",
  ], // Allow both localhost and 127.0.0.1
  credentials: true // Allow credentials (cookies, authorization headers, etc.)
}));

// Route handlers
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/projects', projectRoutes); // Add project routes

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
  })
  .catch(error => {
    console.error('MongoDB connection error:', error);
  });
