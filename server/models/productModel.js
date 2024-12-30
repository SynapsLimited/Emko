// server/models/productModel.js

const { Schema, model } = require('mongoose');
const slugify = require('slugify');
// const categories = require('../data/categories'); // Temporarily disable

// Hardcoded categoryEnum for testing
const categoryEnum = ['chairs', 'tables', 'industrial-lines', 'school', 'amphitheater', 'sofas', 'mixed'];

// Hardcoded subcategoryEnum for testing
const subcategoryEnum = ['executive-chairs', 'operative-chairs', 'waiting-chairs', 'executive-tables', 'operative-tables', 'meeting-tables'];

// Define the color schema
const colorSchema = new Schema({
  name: { type: String, required: true },
  nameEn: { type: String },
  hex: { type: String, required: true },
});

// Define the product schema
const productSchema = new Schema(
  {
    name: { type: String, required: true },
    name_en: { type: String },
    category: {
      type: String,
      required: true,
      enum: categoryEnum, // Enum based on hardcoded values
    },
    subcategory: {
      type: String,
      required: false, // Adjust based on requirements
      enum: subcategoryEnum, // Enum based on hardcoded values
    },
    description: { type: String, required: true },
    description_en: { type: String },
    creator: { type: Schema.Types.ObjectId, ref: 'User' },
    images: [{ type: String, required: true }], // Array of image URLs
    variations: [{ type: String }],
    variations_en: [{ type: String }],
    slug: { type: String, required: true, unique: true },
    previousSlugs: [{ type: String }],
    colors: [colorSchema], // Colors array
  },
  { timestamps: true }
);

// Pre-validate middleware to generate or regenerate slug
productSchema.pre('validate', async function (next) {
  if (this.isModified('name') || this.isModified('variations')) {
    // Generate base slug from name
    let baseSlug = slugify(this.name, { lower: true, strict: true });
    // Append the first variation if available
    if (this.variations && this.variations.length > 0) {
      baseSlug += `-${slugify(this.variations[0], { lower: true, strict: true })}`;
    }
    // Ensure slug uniqueness
    let slug = baseSlug;
    let counter = 1;
    while (await this.constructor.exists({ slug })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
    // If slug is being changed, store the old slug
    if (this.slug && this.slug !== slug) {
      this.previousSlugs.push(this.slug);
    }
    this.slug = slug;
  }
  next();
});

module.exports = model('Product', productSchema);
