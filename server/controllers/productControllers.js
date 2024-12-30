// server/controllers/productControllers.js

const Product = require('../models/productModel');
const User = require('../models/userModel');
const HttpError = require('../models/errorModel');
const { put } = require('@vercel/blob');
const fetch = require('node-fetch');

// Utility function to upload images to Vercel Blob
const uploadToVercelBlob = async (fileBuffer, fileName) => {
  try {
    const { url } = await put(fileName, fileBuffer, {
      access: 'public',
      token: process.env.BLOB_READ_WRITE_TOKEN,
      headers: {
        Authorization: `Bearer ${process.env.VERCEL_ACCESS_TOKEN}`,
      },
    });
    console.log('Uploaded successfully to Vercel Blob: ', url);
    return url;
  } catch (error) {
    console.error('Error uploading file to Vercel Blob:', error);
    throw new Error('Failed to upload file to Vercel Blob');
  }
};

// Utility function to delete images from Vercel Blob
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
        Authorization: `Bearer ${process.env.VERCEL_ACCESS_TOKEN}`,
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
    const { name, name_en, category, description, description_en, variations, variations_en } = req.body;

    // Validate required fields
    if (!name || !category || !description || !req.files || req.files.length === 0) {
      return next(new HttpError('Fill in all fields and upload at least one image.', 422));
    }

    // Handle variations, if provided
    const variationsArray = variations ? variations.split(',').map((v) => v.trim()) : [];
    const variationsEnArray = variations_en ? variations_en.split(',').map((v) => v.trim()) : [];

    // Upload images
    const imageUrls = [];
    for (const file of req.files) {
      const fileBuffer = file.buffer;
      const fileName = `products/${Date.now()}-${file.originalname}`;
      const imageUrl = await uploadToVercelBlob(fileBuffer, fileName);
      imageUrls.push(imageUrl);
    }

    // Save the product with the image URLs
    const newProduct = await Product.create({
      name,
      name_en,
      category,
      description,
      description_en,
      variations: variationsArray,
      variations_en: variationsEnArray,
      images: imageUrls,
      creator: req.user.id,
    });

    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Error creating product:', error);
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

    // Validate if category exists in enum
    if (!['chairs', 'tables', 'industrial-lines', 'school', 'amphitheater', 'sofas', 'mixed'].includes(category)) {
      return next(new HttpError('Invalid category.', 400));
    }

    const categoryProducts = await Product.find({ category }).sort({ createdAt: -1 });
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
    const productSlug = req.params.slug;
    const { name, name_en, category, description, description_en, variations, variations_en } = req.body;

    // Validate required fields
    if (!name || !category || !description) {
      return next(new HttpError('Fill in all fields.', 422));
    }

    const oldProduct = await Product.findOne({ slug: productSlug });
    if (!oldProduct) {
      return next(new HttpError('Product not found.', 404));
    }

    // Validate category
    if (!['chairs', 'tables', 'industrial-lines', 'school', 'amphitheater', 'sofas', 'mixed'].includes(category)) {
      return next(new HttpError('Invalid category.', 400));
    }

    // Handle variations
    const variationsArray = variations ? variations.split(',').map((v) => v.trim()) : oldProduct.variations;
    const variationsEnArray = variations_en
      ? variations_en.split(',').map((v) => v.trim())
      : oldProduct.variations_en;

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

      // Delete old images from Vercel Blob storage
      for (const imageUrl of oldProduct.images) {
        await deleteFromVercelBlob(imageUrl);
      }
    }

    // Update the product with the new data
    oldProduct.name = name;
    oldProduct.name_en = name_en;
    oldProduct.category = category;
    oldProduct.description = description;
    oldProduct.description_en = description_en;
    oldProduct.variations = variationsArray;
    oldProduct.variations_en = variationsEnArray;
    oldProduct.images = newImageUrls;

    // Save the updated product
    const updatedProduct = await oldProduct.save();

    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error('Error editing product:', error);
    return next(new HttpError(error.message || "Couldn't update product", 500));
  }
};

// ======================== Delete product
// DELETE : api/products/:slug
// PROTECTED
const deleteProduct = async (req, res, next) => {
  try {
    const productSlug = req.params.slug;

    // Find the product by slug
    const product = await Product.findOne({ slug: productSlug });

    if (!product) {
      return next(new HttpError('Product not found.', 404));
    }

    // Delete images from Vercel Blob storage
    for (const imageUrl of product.images) {
      await deleteFromVercelBlob(imageUrl);
    }

    // Delete the product from the database
    await Product.findByIdAndDelete(product._id);

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
    const product = await Product.findOne({ slug: productSlug }).populate('creator', 'name email');

    if (!product) {
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
    const product = await Product.findById(productId);

    if (!product) {
      return next(new HttpError('Product not found.', 404));
    }

    // Redirect to slug-based URL
    res.redirect(301, `/products/${product.slug}`);
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    return next(new HttpError('Product does not exist', 404));
  }
};

// ======================== Get single product (alias for getProductBySlug)
// GET : api/products/:slug
// UNPROTECTED
const getProduct = async (req, res, next) => {
  return getProductBySlug(req, res, next);
};

module.exports = {
  createProduct,
  getProducts,
  getProduct,
  getCategoryProducts,
  editProduct,
  deleteProduct,
};
