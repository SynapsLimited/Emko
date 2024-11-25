// models/projectModel.js

const { Schema, model } = require('mongoose');
const slugify = require('slugify');

// Define the project schema
const projectSchema = new Schema(
  {
    name: { type: String, required: true },
    name_en: { type: String },
    description: { type: String, required: true },
    description_en: { type: String },
    creator: { type: Schema.Types.ObjectId, ref: 'User' },
    images: [{ type: String, required: true }], // Array of image URLs
    slug: { type: String, required: true, unique: true },
    previousSlugs: [{ type: String }],
  },
  { timestamps: true }
);

// Pre-validate middleware to generate or regenerate slug
projectSchema.pre('validate', async function (next) {
  if (this.isModified('name')) {
    // Generate base slug from name
    let baseSlug = slugify(this.name, { lower: true, strict: true });

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

module.exports = model('Project', projectSchema);
