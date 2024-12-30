// src/utils/pdfGenerator.js

import { jsPDF } from "jspdf";
import 'jspdf-autotable'; // If you plan to use tables in your PDF

/**
 * Company Information for the Cover Page
 */
const companyInfo = {
  name: "EMKO",
  tagline: "WHERE EVERYTHING COMES TOGETHER",
  about: {
    en: "With a rich and long-standing experience in the Albanian and regional markets as a patented manufacturer for 18 years by international institutions, EMKO has built a respected name and a long history of success. We offer a wide range of office and educational institution furniture products, designed and manufactured according to the highest quality standards, also tailored to the specific desires of each client.",
    sq: "Me një përvojë të pasur dhe të gjatë në tregun shqiptar dhe rajonal si prodhues i patentuar prej 18 vitesh nga institucionet ndërkombëtare, EMKO ka ndërtuar një emër të respektuar dhe një histori të gjatë suksesi. Ne ofrojmë një gamë të gjerë produktesh të mobilimit të zyrave dhe institucioneve arsimore, të dizajnuara dhe prodhuar sipas standardeve më të larta të cilësisë, gjithashtu të përshtatura sipas dëshirave specifike të çdo klienti."
  },
  productDescription: {
    en: "A wide range of products included in 7 categories and many subcategories to furnish your spaces with the diversity and quality that Emko offers.",
    sq: "Një gamë e gjerë produktesh të përfshira në 7 kategori dhe shumë nënkategori për të mobiluar ambientet tuaja me shumllojshmërinë dhe kualitetin që Emko ofron."
  },
  mission: {
    en: "Our mission is to fulfill the needs and requirements of our clients by highlighting our company's values; integrity, quality, professionalism.",
    sq: "Misioni ynë është t'i përmbushim nevojat dhe kërkesat e klientëve tanë duke vënë në pah vlerat e kompanisë sonë; korrektësi, cilësi, profesionalizëm."
  },
  vision: {
    en: "Our vision is to be a leader in the Albanian and international furniture market by offering high-quality products and incomparable aesthetic values.",
    sq: "Vizioni ynë është të jemi lider në tregun shqiptar dhe internacional të mobiljeve duke ofruar produkte me kualitet të lartë dhe vlera estetike të pakrahasueshme."
  }
};

/**
 * Translations for fixed texts used in the PDF
 */
const translations = {
  coverTitle: {
    en: "Full Catalog",
    sq: "Katalogu i Plotë"
  },
  catalogFor: {
    en: "Catalog for",
    sq: "Katalogu për"
  },
  aboutUs: {
    en: "About Us",
    sq: "Rreth Nesh"
  },
  products: {
    en: "Products",
    sq: "Produktet"
  },
  missionAndVision: {
    en: "Mission & Vision",
    sq: "Misioni & Vizioni"
  },
  noProducts: {
    en: "No Products Available",
    sq: "Nuk ka Produkte Të Disponueshme"
  },
  variation: {
    en: "Variation",
    sq: "Variacioni"
  },
  colors: {
    en: "Colors:",
    sq: "Ngjyrat:"
  },
  page: {
    en: "Page",
    sq: "Faqe"
  }
};

/**
 * Page Dimensions and Margins (in mm)
 */
const PAGE_WIDTH = 210;
const PAGE_HEIGHT = 297;
const MARGIN = 20;
const CONTENT_WIDTH = PAGE_WIDTH - 2 * MARGIN;
const CONTENT_HEIGHT = PAGE_HEIGHT - 2 * MARGIN;

/**
 * Helper function to convert ArrayBuffer to Base64
 * @param {ArrayBuffer} buffer 
 * @returns {string} Base64 string
 */
const arrayBufferToBase64 = (buffer) => {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
};

/**
 * Helper function to load custom fonts into jsPDF
 * @param {jsPDF} doc 
 */
const loadFonts = async (doc) => {
  const fontBaseUrl = '/fonts/'; // Ensure fonts are placed in public/fonts/
  const fonts = [
    { name: 'HindSiliguri-Regular.ttf', fontName: 'HindSiliguriRegular', fontStyle: 'normal' },
    { name: 'HindSiliguri-Light.ttf', fontName: 'HindSiliguriLight', fontStyle: 'normal' },
    { name: 'HindSiliguri-Bold.ttf', fontName: 'HindSiliguriBold', fontStyle: 'bold' },
    { name: 'HindSiliguri-SemiBold.ttf', fontName: 'HindSiliguriSemiBold', fontStyle: 'bold' },
  ];

  for (const font of fonts) {
    try {
      const response = await fetch(`${fontBaseUrl}${font.name}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch font: ${font.name}`);
      }
      const buffer = await response.arrayBuffer();
      const base64 = arrayBufferToBase64(buffer);
      doc.addFileToVFS(font.name, base64);
      doc.addFont(font.name, font.fontName, font.fontStyle);
    } catch (error) {
      console.error(`Error loading font ${font.name}:`, error);
      throw error; // Propagate the error to be handled by the caller
    }
  }
};

/**
 * Helper function to convert image URL to data URL with optimized settings
 * @param {string} url - Image URL
 * @param {number} desiredWidthMM 
 * @param {number} desiredHeightMM 
 * @param {number} dpi 
 * @param {string} outputFormat - 'JPEG' or 'PNG'
 * @param {number} quality - 0 to 1
 * @param {number} borderRadius - in pixels
 * @returns {Promise<{ dataURL: string, width: number, height: number }>}
 */
const getImageDataUrl = async (
  url,
  desiredWidthMM,
  desiredHeightMM,
  dpi = 150,
  outputFormat = 'JPEG',
  quality = 0.85,
  borderRadius = 0
) => {
  try {
    const img = new Image();
    img.setAttribute('crossOrigin', 'anonymous'); // To handle CORS

    // Load the image
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
      img.src = url;
    });

    // Convert desired size from mm to pixels
    const pxPerMm = dpi / 25.4;
    const desiredWidthPx = desiredWidthMM * pxPerMm;
    const desiredHeightPx = desiredHeightMM * pxPerMm;

    // Maintain aspect ratio
    const aspectRatio = img.width / img.height;
    let targetWidthPx = desiredWidthPx;
    let targetHeightPx = desiredHeightPx;

    if (img.width > img.height) {
      targetHeightPx = desiredWidthPx / aspectRatio;
    } else {
      targetWidthPx = desiredHeightPx * aspectRatio;
    }

    // Prevent upscaling
    targetWidthPx = Math.min(targetWidthPx, img.width);
    targetHeightPx = Math.min(targetHeightPx, img.height);

    const canvas = document.createElement('canvas');
    canvas.width = targetWidthPx;
    canvas.height = targetHeightPx;
    const ctx = canvas.getContext('2d');

    if (borderRadius > 0) {
      // Draw rounded corners
      ctx.beginPath();
      ctx.moveTo(borderRadius, 0);
      ctx.lineTo(targetWidthPx - borderRadius, 0);
      ctx.quadraticCurveTo(targetWidthPx, 0, targetWidthPx, borderRadius);
      ctx.lineTo(targetWidthPx, targetHeightPx - borderRadius);
      ctx.quadraticCurveTo(targetWidthPx, targetHeightPx, targetWidthPx - borderRadius, targetHeightPx);
      ctx.lineTo(borderRadius, targetHeightPx);
      ctx.quadraticCurveTo(0, targetHeightPx, 0, targetHeightPx - borderRadius);
      ctx.lineTo(0, borderRadius);
      ctx.quadraticCurveTo(0, 0, borderRadius, 0);
      ctx.closePath();
      ctx.clip();
    }

    // Fill background with white for JPEG to avoid transparency issues
    if (outputFormat.toUpperCase() === 'JPEG') {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // Draw the image
    ctx.drawImage(img, 0, 0, targetWidthPx, targetHeightPx);

    // Get the data URL
    const dataURL = canvas.toDataURL(`image/${outputFormat}`, quality);
    return { dataURL, width: targetWidthPx, height: targetHeightPx };
  } catch (error) {
    console.error('Error loading image for PDF:', error);
    throw error;
  }
};

/**
 * Helper function to capitalize the first letter of a string
 * @param {string} string 
 * @returns {string}
 */
const capitalizeFirstLetter = (string) => {
  if (!string) return '';
  return string.charAt(0).toUpperCase() + string.slice(1);
};

/**
 * Helper function to add footers with page numbers aligned to the left
 * @param {jsPDF} doc 
 * @param {string} currentLanguage - 'en' or 'sq'
 */
const addFooter = (doc, currentLanguage) => {
  const pageCount = doc.getNumberOfPages();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const leftMargin = MARGIN; // 20mm as defined earlier

  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFont('HindSiliguriBold', 'bold');
    doc.setFontSize(10);
    const footerText = currentLanguage === 'en' 
      ? `Page ${i} of ${pageCount}` 
      : `Faqe ${i} nga ${pageCount}`;
    doc.text(footerText, leftMargin, pageHeight - 10);
  }
};

/**
 * Helper function to add a cover page with logo and company information
 * @param {jsPDF} doc 
 * @param {object} categoryOrSubcategory - Selected category or subcategory object
 * @param {object} categoryTranslationMap - Translation map for categories
 * @param {string} currentLanguage - 'en' or 'sq'
 */
const addCoverPage = async (doc, categoryOrSubcategory, categoryTranslationMap, currentLanguage) => {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const centerX = pageWidth / 2;

  try {
    // Add logo
    const logoUrl = '/assets/emko-logo.png'; // Ensure logo is in public/assets/
    const desiredLogoWidthMM = 80;
    const desiredLogoHeightMM = 60;

    const imgDataObj = await getImageDataUrl(
      logoUrl,
      desiredLogoWidthMM,
      desiredLogoHeightMM,
      150,
      'PNG',
      0.85,
      0
    );
    const { dataURL } = imgDataObj;

    // Calculate centered position
    const imgX = (pageWidth - desiredLogoWidthMM) / 2;
    const imgY = pageHeight * 0.1; // 10% from top
    doc.addImage(dataURL, 'PNG', imgX, imgY, desiredLogoWidthMM, desiredLogoHeightMM);

    let currentY = imgY + desiredLogoHeightMM + 10;

    // Add Catalog Title
    doc.setFont('HindSiliguriBold', 'bold');
    doc.setFontSize(24);

    let titleText = translations.coverTitle[currentLanguage];
    if (categoryOrSubcategory && categoryOrSubcategory.slug !== 'all-products') {
      const categoryTranslation = categoryTranslationMap[categoryOrSubcategory.slug];
      const categoryName = categoryTranslation ? capitalizeFirstLetter(categoryTranslation[currentLanguage] || categoryTranslation.en) : 'Unknown';
      titleText = `${translations.catalogFor[currentLanguage]} ${categoryName}`;
    }

    doc.text(titleText, centerX, currentY, { align: 'center' });

    currentY += 15;

    // Add Sections: About Us, Products, Mission & Vision
    const addSection = (titleKey, textObj) => {
      if (!translations[titleKey] || !textObj[currentLanguage]) return; // Prevent undefined

      doc.setFont('HindSiliguriBold', 'bold');
      doc.setFontSize(16);
      doc.text(translations[titleKey][currentLanguage], centerX, currentY, { align: 'center' });

      currentY += 7;

      doc.setFont('HindSiliguriLight', 'normal');
      doc.setFontSize(12);
      const splitText = doc.splitTextToSize(textObj[currentLanguage], CONTENT_WIDTH);
      doc.text(splitText, centerX, currentY, { align: 'center' });

      currentY += splitText.length * 7 + 15;
    };

    addSection('aboutUs', companyInfo.about);
    addSection('productDescription', companyInfo.productDescription);
    addSection('missionAndVision', {
      en: `${companyInfo.mission.en} ${companyInfo.vision.en}`,
      sq: `${companyInfo.mission.sq} ${companyInfo.vision.sq}`
    });

  } catch (error) {
    console.error('Error adding cover page:', error);
    // Proceed without logo and sections if there's an error
    doc.addPage();
    doc.setFont('HindSiliguriBold', 'bold');
    doc.setFontSize(24);
    let titleText = translations.coverTitle[currentLanguage];
    if (categoryOrSubcategory && categoryOrSubcategory.slug !== 'all-products') {
      const categoryTranslation = categoryTranslationMap[categoryOrSubcategory.slug];
      const categoryName = categoryTranslation ? capitalizeFirstLetter(categoryTranslation[currentLanguage] || categoryTranslation.en) : 'Unknown';
      titleText = `${translations.catalogFor[currentLanguage]} ${categoryName}`;
    }
    doc.text(titleText, centerX, 30, { align: 'center' });

    // Add sections without logo
    let currentY = 40;

    const addSection = (titleKey, textObj) => {
      if (!translations[titleKey] || !textObj[currentLanguage]) return; // Prevent undefined

      doc.setFont('HindSiliguriBold', 'bold');
      doc.setFontSize(16);
      doc.text(translations[titleKey][currentLanguage], centerX, currentY, { align: 'center' });

      currentY += 7;

      doc.setFont('HindSiliguriLight', 'normal');
      doc.setFontSize(12);
      const splitText = doc.splitTextToSize(textObj[currentLanguage], CONTENT_WIDTH);
      doc.text(splitText, centerX, currentY, { align: 'center' });

      currentY += splitText.length * 7 + 15;
    };

    addSection('aboutUs', companyInfo.about);
    addSection('productDescription', companyInfo.productDescription);
    addSection('missionAndVision', {
      en: `${companyInfo.mission.en} ${companyInfo.vision.en}`,
      sq: `${companyInfo.mission.sq} ${companyInfo.vision.sq}`
    });
  }
};

/**
 * Helper function to add a product's details to the PDF
 * @param {jsPDF} doc 
 * @param {object} product 
 * @param {number} startX 
 * @param {number} startY 
 * @param {number} width 
 * @param {number} height 
 * @param {string} currentLanguage - 'en' or 'sq'
 */
const addProductToPage = async (doc, product, startX, startY, width, height, currentLanguage) => {
  if (!product) return;

  let y = startY;

  // Product Name
  doc.setFont('HindSiliguriBold', 'bold');
  doc.setFontSize(16);
  const name = currentLanguage === 'en' ? (product.name_en || product.name) : product.name;
  const splitName = doc.splitTextToSize(name, width - 5);
  doc.text(splitName, startX + width / 2, y, { align: 'center' });
  y += splitName.length * 7 + 5;

  // Variation
  doc.setFont('HindSiliguriRegular', 'normal');
  doc.setFontSize(12);
  const variation = currentLanguage === 'en' ? (product.variation_en || product.variation) : product.variation;
  if (variation) {
    const variationText = `${translations.variation[currentLanguage]}: ${variation}`;
    doc.text(variationText, startX + width / 2, y, { align: 'center' });
    y += 7;
  }

  // Description
  doc.setFont('HindSiliguriLight', 'normal');
  doc.setFontSize(10);
  const description = currentLanguage === 'en' ? (product.description_en || product.description) : product.description;
  const splitDescription = doc.splitTextToSize(description, width - 10);
  doc.text(splitDescription, startX + width / 2, y, { align: 'center' });
  y += splitDescription.length * 5 + 5;

  // Product Image
  if (product.images && product.images.length > 0) {
    try {
      const imgDataObj = await getImageDataUrl(
        product.images[0],
        width - 10,
        50, // Desired height in mm
        150,
        'JPEG',
        0.85,
        0
      );
      const { dataURL } = imgDataObj;
      const imgX = startX + 5;
      const imgY = y;
      const imgWidth = width - 10;
      const imgHeight = 50;
      doc.addImage(dataURL, 'JPEG', imgX, imgY, imgWidth, imgHeight);
      y += imgHeight + 5;
    } catch (error) {
      console.error(`Error adding image for product ${product.name}:`, error);
      y += 10; // Space if image fails to load
    }
  }

  // Colors
  if (product.colors && product.colors.length > 0) {
    doc.setFont('HindSiliguriSemiBold', 'bold');
    doc.setFontSize(10);
    doc.text(translations.colors[currentLanguage], startX + width / 2, y, { align: 'center' });
    y += 5;

    const colorSize = 4;
    const colorSpacing = 2;
    const totalColorWidth = product.colors.length * (colorSize + colorSpacing) - colorSpacing;
    const colorStartX = startX + (width - totalColorWidth) / 2;

    product.colors.forEach((color, index) => {
      const x = colorStartX + index * (colorSize + colorSpacing);
      doc.setFillColor(color.hex);
      doc.circle(x + colorSize / 2, y + colorSize / 2, colorSize / 2, 'F');
    });

    y += colorSize + 5;
  }
};

/**
 * Main function to generate the PDF
 * @param {Array} products - Array of product objects
 * @param {string} catalogName - Name of the catalog (used for file naming)
 * @param {object} categoryOrSubcategory - Selected category or subcategory object
 * @param {object} categoryTranslationMap - Translation map for categories
 * @param {string} currentLanguage - 'en' or 'sq'
 */
export const generatePDF = async (products, catalogName, categoryOrSubcategory = null, categoryTranslationMap = {}, currentLanguage = 'sq') => {
  try {
    const doc = new jsPDF('p', 'mm', 'a4');

    // Load custom fonts
    await loadFonts(doc);
    doc.setFont('HindSiliguriRegular', 'normal');

    // Add Cover Page
    await addCoverPage(doc, categoryOrSubcategory, categoryTranslationMap, currentLanguage);

    // Check if there are products to add
    if (products.length === 0) {
      doc.addPage();
      doc.setFont('HindSiliguriBold', 'bold');
      doc.setFontSize(18);
      doc.text(translations.noProducts[currentLanguage], PAGE_WIDTH / 2, PAGE_HEIGHT / 2, { align: 'center' });
    } else {
      // Add products, 4 per page (2 columns x 2 rows)
      for (let i = 0; i < products.length; i += 4) {
        doc.addPage();
        const pageProducts = products.slice(i, i + 4);

        for (let j = 0; j < pageProducts.length; j++) {
          const product = pageProducts[j];
          const row = Math.floor(j / 2); // 2 columns per row
          const col = j % 2;

          const startX = MARGIN + (col * (CONTENT_WIDTH / 2));
          const startY = MARGIN + (row * (CONTENT_HEIGHT / 2));

          await addProductToPage(doc, product, startX, startY, CONTENT_WIDTH / 2, CONTENT_HEIGHT / 2, currentLanguage);
        }
      }
    }

    // Add footers with page numbers
    addFooter(doc, currentLanguage);

    // Determine the catalog name based on language and type
    let translatedCatalogName = '';
    if (categoryOrSubcategory && categoryOrSubcategory.slug !== 'all-products') {
      const categoryTranslation = categoryTranslationMap[categoryOrSubcategory.slug];
      const categoryName = categoryTranslation ? capitalizeFirstLetter(categoryTranslation[currentLanguage] || categoryTranslation.en) : 'Unknown';
      translatedCatalogName = `${companyInfo.name} - ${translations.catalogFor[currentLanguage]} ${categoryName}`;
    } else {
      translatedCatalogName = `${companyInfo.name} - ${translations.coverTitle[currentLanguage]}`;
    }

    // Replace spaces with underscores and ensure proper capitalization
    const fileName = `${translatedCatalogName.replace(/\s+/g, '_')}.pdf`;

    // Save the PDF
    doc.save(fileName);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error(`Failed to generate PDF: ${error.message || 'Unknown error'}`);
  }
};

/**
 * Function to generate a filtered PDF (e.g., category or subcategory)
 * @param {Array} products - Array of filtered product objects
 * @param {string} catalogName - Name of the catalog
 * @param {object} categoryOrSubcategory - Selected category or subcategory object
 * @param {object} categoryTranslationMap - Translation map for categories
 * @param {string} currentLanguage - 'en' or 'sq'
 */
export const generateFilteredPDF = async (products, catalogName, categoryOrSubcategory = null, categoryTranslationMap = {}, currentLanguage = 'sq') => {
  try {
    await generatePDF(products, catalogName, categoryOrSubcategory, categoryTranslationMap, currentLanguage);
  } catch (error) {
    console.error('Error generating filtered PDF:', error);
    throw error;
  }
};
