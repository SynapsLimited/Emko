// server/controllers/productControllers.js

const Product = require('../models/productModel');
const HttpError = require('../models/errorModel'); // Ensure you have an error handling model
const { put } = require('@vercel/blob');
const fetch = require('node-fetch');
const categories = require('../data/categories'); // Import categories.js
const slugify = require('slugify');

// Extract category and subcategory enums
const categoryEnum = categories.map(cat => cat.slug);

const subcategoryEnum = categories.flatMap(cat => cat.subcategories.map(sub => sub.slug));

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

// ======================== Create a product
// POST : api/products
// PROTECTED
const createProduct = async (req, res, next) => {
  try {
    const {
      name,
      name_en,
      category,
      subcategory, // Extract subcategory
      description,
      description_en,
      variations,
      variations_en,
      colors, // Add colors here
    } = req.body;

    console.log('Received Data:', {
      name,
      name_en,
      category,
      subcategory,
      description,
      description_en,
      variations,
      variations_en,
      colors,
    });

    // Detailed Logging for 'category'
    console.log(`Category received: '${category}' (Type: ${typeof category})`);
    
    // Validate required fields
    if (
      !name ||
      !category ||
      !description ||
      !req.files ||
      req.files.length === 0
    ) {
      console.log('Validation Error: Missing required fields.');
      return next(new HttpError('Fill in all required fields and upload at least one image.', 422));
    }

    // Validate category
    if (!categoryEnum.includes(category)) {
      console.log(`Validation Error: '${category}' is not a valid category.`);
      return next(new HttpError(`'${category}' is not a valid category.`, 422));
    }

    // Validate subcategory if applicable
    if (subcategory && !subcategoryEnum.includes(subcategory)) {
      console.log(`Validation Error: '${subcategory}' is not a valid subcategory.`);
      return next(new HttpError(`'${subcategory}' is not a valid subcategory.`, 422));
    }

    // Handle variations
    const variationsArray = variations
      ? variations.split(',').map((v) => v.trim())
      : [];

    const variationsEnArray = variations_en
      ? variations_en.split(',').map((v) => v.trim())
      : [];

    // Handle colors
    let colorsArray = [];
    if (colors) {
      try {
        colorsArray = JSON.parse(colors);
        if (!Array.isArray(colorsArray)) {
          throw new Error('Colors must be an array');
        }
        // Further validate each color object
        for (const color of colorsArray) {
          if (!color.name || !color.hex) {
            throw new Error('Each color must have a name and hex value');
          }
        }
      } catch (err) {
        console.log('Validation Error: Invalid colors format.');
        return next(new HttpError('Invalid colors format', 422));
      }
    }

    // Upload images
    const imageUrls = [];
    for (const file of req.files) {
      const fileBuffer = file.buffer;
      const fileName = `products/${Date.now()}-${file.originalname}`;
      const imageUrl = await uploadToVercelBlob(fileBuffer, fileName);
      imageUrls.push(imageUrl);
    }

    // Save the product with the image URLs and colors
    const newProduct = await Product.create({
      name,
      name_en,
      category,
      subcategory, // Include subcategory in the product
      description,
      description_en,
      variations: variationsArray,
      variations_en: variationsEnArray,
      images: imageUrls,
      colors: colorsArray, // Include colors in the product
      creator: req.user.id, // Assuming `req.user` is set by auth middleware
    });

    console.log('Product Created Successfully:', newProduct);

    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Error creating product:', error);
    // Check if the error is due to validation
    if (error.name === 'ValidationError') {
      return next(new HttpError(error.message, 422));
    }
    return next(new HttpError(error.message || 'Something went wrong', 500));
  }
};

// ======================== Get all products
// GET : api/products
// UNPROTECTED
const getProducts = async (req, res, next) => {
  try {
    const products = await Product.find().sort({ updatedAt: -1 });
    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return next(new HttpError(error.message || 'Something went wrong', 500));
  }
};

// ======================== Get products by Category
// GET : api/products/categories/:category
// UNPROTECTED
const getCategoryProducts = async (req, res, next) => {
  try {
    const { category } = req.params;
    const { subcategory } = req.query; // Optionally filter by subcategory

    console.log('Fetching Category Products:', { category, subcategory });

    // Validate category
    if (!categoryEnum.includes(category)) {
      console.log(`Validation Error: '${category}' is not a valid category.`);
      return next(new HttpError(`'${category}' is not a valid category.`, 422));
    }

    // Validate subcategory if provided
    if (subcategory && !subcategoryEnum.includes(subcategory)) {
      console.log(`Validation Error: '${subcategory}' is not a valid subcategory.`);
      return next(new HttpError(`'${subcategory}' is not a valid subcategory.`, 422));
    }

    let filter = { category };

    if (subcategory) {
      filter.subcategory = subcategory;
    }

    const categoryProducts = await Product.find(filter).sort({ createdAt: -1 });
    res.status(200).json(categoryProducts);
  } catch (error) {
    console.error('Error fetching category products:', error);
    return next(new HttpError(error.message || 'Something went wrong', 500));
  }
};

// ======================== Edit product
// PATCH : api/products/:slug/edit
// PROTECTED
const editProduct = async (req, res, next) => {
  try {
    const productSlug = req.params.slug; // Use slug

    const {
      name,
      name_en,
      category,
      subcategory, // Extract subcategory
      description,
      description_en,
      variations,
      variations_en,
      colors, // Add colors here
    } = req.body;

    console.log('Received Edit Data:', {
      name,
      name_en,
      category,
      subcategory,
      description,
      description_en,
      variations,
      variations_en,
      colors,
    });

    // Check required fields
    if (!name || !category || !description) {
      console.log('Validation Error: Missing required fields.');
      return next(new HttpError('Fill in all required fields.', 422));
    }

    // Validate category
    if (!categoryEnum.includes(category)) {
      console.log(`Validation Error: '${category}' is not a valid category.`);
      return next(new HttpError(`'${category}' is not a valid category.`, 422));
    }

    // Validate subcategory if applicable
    if (subcategory && !subcategoryEnum.includes(subcategory)) {
      console.log(`Validation Error: '${subcategory}' is not a valid subcategory.`);
      return next(new HttpError(`'${subcategory}' is not a valid subcategory.`, 422));
    }

    // Find the existing product
    const oldProduct = await Product.findOne({ slug: productSlug });
    if (!oldProduct) {
      console.log('Error: Product not found.');
      return next(new HttpError('Product not found.', 404));
    }

    // Handle variations
    const variationsArray = variations
      ? variations.split(',').map((v) => v.trim())
      : oldProduct.variations;
    const variationsEnArray = variations_en
      ? variations_en.split(',').map((v) => v.trim())
      : oldProduct.variations_en;

    // Handle colors
    let colorsArray = oldProduct.colors;
    if (colors) {
      try {
        colorsArray = JSON.parse(colors);
        if (!Array.isArray(colorsArray)) {
          throw new Error('Colors must be an array');
        }
        // Further validate each color object
        for (const color of colorsArray) {
          if (!color.name || !color.hex) {
            throw new Error('Each color must have a name and hex value');
          }
        }
      } catch (err) {
        console.log('Validation Error: Invalid colors format.');
        return next(new HttpError('Invalid colors format', 422));
      }
    }

    // Handle subcategory
    let newSubcategory = oldProduct.subcategory;
    if (subcategory !== undefined && subcategory !== null) {
      newSubcategory = subcategory;
    }

    let newImageUrls = oldProduct.images;
    // Check if new images were uploaded
    if (req.files && req.files.length > 0) {
      // Upload new images
      newImageUrls = [];
      for (const file of req.files) {
        const fileBuffer = file.buffer;
        const fileName = `products/${Date.now()}-${file.originalname}`;
        const imageUrl = await uploadToVercelBlob(fileBuffer, fileName);
        newImageUrls.push(imageUrl);
      }
      // Optionally delete old images from Vercel Blob storage
      for (const imageUrl of oldProduct.images) {
        await deleteFromVercelBlob(imageUrl);
      }
    }

    // Update the product with the new data
    oldProduct.name = name;
    oldProduct.name_en = name_en;
    oldProduct.category = category;
    oldProduct.subcategory = newSubcategory; // Update subcategory
    oldProduct.description = description;
    oldProduct.description_en = description_en;
    oldProduct.variations = variationsArray;
    oldProduct.variations_en = variationsEnArray;
    oldProduct.colors = colorsArray; // Update colors
    oldProduct.images = newImageUrls;

    // Save the updated product
    const updatedProduct = await oldProduct.save();

    console.log('Product Updated Successfully:', updatedProduct);

    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error('Error editing product:', error);
    // Handle validation errors
    if (error.name === 'ValidationError') {
      return next(new HttpError(error.message, 422));
    }
    return next(new HttpError(error.message || "Couldn't update product", 500));
  }
};

// ======================== Delete product
// DELETE : api/products/:slug
// PROTECTED
const deleteProduct = async (req, res, next) => {
  try {
    const productSlug = req.params.slug;

    console.log(`Attempting to delete product with slug: ${productSlug}`);

    // Find the product by slug
    const product = await Product.findOne({ slug: productSlug });
    if (!product) {
      console.log('Error: Product not found.');
      return next(new HttpError('Product not found.', 404));
    }

    // Delete images from Vercel Blob storage
    for (const imageUrl of product.images) {
      await deleteFromVercelBlob(imageUrl);
    }

    // Delete the product from the database
    await Product.findByIdAndDelete(product._id);

    console.log('Product Deleted Successfully:', productSlug);

    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    return next(new HttpError("Couldn't delete product.", 400));
  }
};

// ======================== Get single product by slug
// GET : api/products/:slug
// UNPROTECTED
const getProductBySlug = async (req, res, next) => {
  try {
    const productSlug = req.params.slug;
    console.log(`Fetching product with slug: ${productSlug}`);

    const product = await Product.findOne({ slug: productSlug }).populate('creator', 'name email');

    if (!product) {
      console.log('Error: Product not found.');
      return next(new HttpError('Product not found.', 404));
    }
    res.status(200).json(product);
  } catch (error) {
    console.error('Error fetching product by slug:', error);
    return next(new HttpError('Product does not exist', 404));
  }
};

// ======================== Get single product by ID and redirect to slug
// GET : api/products/id/:id
// UNPROTECTED
const getProductById = async (req, res, next) => {
  try {
    const productId = req.params.id;
    console.log(`Fetching product with ID: ${productId}`);

    const product = await Product.findById(productId);

    if (!product) {
      console.log('Error: Product not found.');
      return next(new HttpError('Product not found.', 404));
    }

    // Redirect to slug-based URL
    res.redirect(301, `/products/${product.slug}`);
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    return next(new HttpError('Product does not exist', 404));
  }
};

// ======================== Get single product (updated to use slug)
const getProduct = async (req, res, next) => {
  const { slug } = req.params;
  return getProductBySlug(req, res, next);
};

module.exports = {
  createProduct,
  getProducts,
  getProduct,
  getCategoryProducts,
  editProduct,
  deleteProduct,
  getProductById, // Make sure to include it
};
