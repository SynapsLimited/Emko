// server/models/productModel.js

const { Schema, model } = require('mongoose');
const slugify = require('slugify');

const colorSchema = new Schema({
  name: { type: String, required: true },
  nameEn: { type: String },
  hex: { type: String, required: true },
});

const productSchema = new Schema(
  {
    name: { type: String, required: true },
    name_en: { type: String },
    category: {
      type: String,
      enum: ['chairs', 'tables', 'industrial-lines', 'school', 'amphitheater', 'sofas', 'mixed'],
      required: true,
      message: '{VALUE} is not a supported category.',
    },
    subcategory: {
      type: String,
      enum: ['executive-chairs', 'operative-chairs', 'waiting-chairs', 'executive-tables', 'operative-tables', 'meeting-tables'],
      required: false,
      message: '{VALUE} is not a supported subcategory.',
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
