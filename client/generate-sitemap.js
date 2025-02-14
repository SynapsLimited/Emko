require('dotenv').config();
const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Base domain URL (update as needed)
const baseUrl = 'https://www.emko-client.vercel.app';
// Today's date in YYYY-MM-DD format
const today = new Date().toISOString().split('T')[0];

// Import categories data
// If your file is an ES module, consider converting it to JSON or use a transpiler.
// Here we assume you have a JSON version at "data/categories.json" in the project root.
const categories = require('./data/categories.json');

async function generateSitemap() {
  const urls = [
    // Static routes
    { loc: `${baseUrl}/`, changefreq: 'daily', priority: '1.0' },
    { loc: `${baseUrl}/about`, changefreq: 'monthly', priority: '0.8' },
    { loc: `${baseUrl}/products`, changefreq: 'weekly', priority: '0.9' },
    { loc: `${baseUrl}/projects`, changefreq: 'weekly', priority: '0.9' },
    { loc: `${baseUrl}/certifications`, changefreq: 'monthly', priority: '0.8' },
    { loc: `${baseUrl}/contact`, changefreq: 'monthly', priority: '0.8' },
    { loc: `${baseUrl}/privacy-policy`, changefreq: 'yearly', priority: '0.5' }
  ];

  // Fetch dynamic product routes
  try {
    const { data: products } = await axios.get(`${process.env.REACT_APP_BASE_URL}/products`);
    console.log(`Fetched ${products.length} products`);
    products.forEach((product) => {
      if (product.slug) {
        urls.push({
          loc: `${baseUrl}/products/${product.slug}`,
          changefreq: 'weekly',
          priority: '0.7'
        });
      }
    });
  } catch (error) {
    console.error('Error fetching products:', error);
  }

  // Fetch dynamic project routes
  try {
    const { data: projects } = await axios.get(`${process.env.REACT_APP_BASE_URL}/projects`);
    console.log(`Fetched ${projects.length} projects`);
    projects.forEach((project) => {
      if (project.slug) {
        urls.push({
          loc: `${baseUrl}/projects/${project.slug}`,
          changefreq: 'weekly',
          priority: '0.7'
        });
      }
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
  }

  // Include category and subcategory pages from local categories data
  if (Array.isArray(categories)) {
    categories.forEach((category) => {
      // Category page URL: /products/category/:slug
      urls.push({
        loc: `${baseUrl}/products/category/${category.slug}`,
        changefreq: 'weekly',
        priority: '0.8'
      });

      // For each subcategory: /products/category/:category/subcategory/:subcategory
      if (Array.isArray(category.subcategories) && category.subcategories.length > 0) {
        category.subcategories.forEach((subcategory) => {
          urls.push({
            loc: `${baseUrl}/products/category/${category.slug}/subcategory/${subcategory.slug}`,
            changefreq: 'weekly',
            priority: '0.7'
          });
        });
      }
    });
  } else {
    console.warn('Categories data is not an array.');
  }

  // Build XML content
  const xmlUrls = urls
    .map(
      (urlObj) => `
  <url>
    <loc>${urlObj.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${urlObj.changefreq}</changefreq>
    <priority>${urlObj.priority}</priority>
  </url>`
    )
    .join('');

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 
                      http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
  ${xmlUrls}
</urlset>`;

  // Write the sitemap.xml to the public folder
  const sitemapPath = path.join(__dirname, 'public', 'sitemap.xml');
  fs.writeFileSync(sitemapPath, sitemapXml);
  console.log('Sitemap generated successfully at:', sitemapPath);
}

generateSitemap();
