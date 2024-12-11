// src/components/DownloadCatalog.jsx

import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import Loader from './Loader'; // Import the Loader component
import { useTranslation } from 'react-i18next';
import categories from '../data/categories'; // Import categories

// Helper function to convert array buffer to Base64
const arrayBufferToBase64 = (buffer) => {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
};

// Helper function to add footers with page numbers aligned to the left
const addFooter = (doc) => {
  const pageCount = doc.getNumberOfPages();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const leftMargin = 20; // Define a fixed left margin

  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFont('HindSiliguriBold', 'bold'); // Use HindSiliguriBold for footers
    doc.setFontSize(10);
    // Align footer to the left using the fixed left margin
    doc.text(`Faqe ${i} nga ${pageCount}`, leftMargin, pageHeight - 10);
  }
};

// Helper function to register custom fonts
const loadFonts = async (doc) => {
  const fontBaseUrl = '/fonts/'; // Path to fonts in public folder
  const fonts = [
    // Hind Siliguri Fonts
    { name: 'HindSiliguri-Regular.ttf', fontName: 'HindSiliguriRegular', fontStyle: 'normal' },
    { name: 'HindSiliguri-Light.ttf', fontName: 'HindSiliguriLight', fontStyle: 'normal' },
    { name: 'HindSiliguri-Bold.ttf', fontName: 'HindSiliguriBold', fontStyle: 'bold' },
    { name: 'HindSiliguri-SemiBold.ttf', fontName: 'HindSiliguriSemiBold', fontStyle: 'bold' },
  ];

  for (const font of fonts) {
    try {
      const response = await fetch(`${fontBaseUrl}${font.name}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch ${font.name}`);
      }
      const buffer = await response.arrayBuffer();
      const base64 = arrayBufferToBase64(buffer);
      doc.addFileToVFS(font.name, base64);
      doc.addFont(font.name, font.fontName, font.fontStyle);
    } catch (error) {
      console.error(`Error loading font ${font.name}:`, error);
      // Throw the error to be caught in the calling function
      throw error;
    }
  }
};

// Helper function to convert image URL to data URL with optimized settings
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
    img.setAttribute('crossOrigin', 'anonymous'); // To avoid CORS issues

    // Load the image
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
      img.src = url;
    });

    // Convert desired physical size in mm to pixels
    const pxPerMm = dpi / 25.4; // pixels per mm
    const desiredWidthPx = desiredWidthMM * pxPerMm;
    const desiredHeightPx = desiredHeightMM * pxPerMm;

    // Calculate aspect ratio
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
      // Draw rounded rectangle
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

    // Fill background with white if outputFormat is JPEG to avoid black corners
    if (outputFormat.toUpperCase() === 'JPEG') {
      ctx.fillStyle = '#FFFFFF'; // White background
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // Draw the image onto the canvas with the new dimensions
    ctx.drawImage(img, 0, 0, targetWidthPx, targetHeightPx);

    // Use the specified format and quality for compression
    const dataURL = canvas.toDataURL(`image/${outputFormat}`, quality);
    return { dataURL, width: targetWidthPx, height: targetHeightPx };
  } catch (error) {
    console.error('Error loading image for PDF:', error);
    throw error;
  }
};

// Helper function to capitalize the first letter
const capitalizeFirstLetter = (string) => {
  if (!string) return '';
  return string.charAt(0).toUpperCase() + string.slice(1);
};

// Helper function to estimate the height required for a product
const estimateProductHeight = (doc, product, containerWidth, imageHeightMM, currentLanguage) => {
  let height = 0;

  // Product Name
  doc.setFont('HindSiliguriBold', 'bold');
  doc.setFontSize(16);
  const nameText = currentLanguage === 'en' ? product.name_en || product.name : product.name;
  const splitName = doc.splitTextToSize(nameText, containerWidth);
  height += splitName.length * 7 + 10; // 7mm per line + spacing

  // Product Image
  if (product.images && product.images.length > 0) {
    height += imageHeightMM + 15; // Image height + spacing
  }

  // Variations
  const variations = currentLanguage === 'en' ? product.variations_en : product.variations;
  if (variations && variations.length > 0) {
    doc.setFont('HindSiliguriRegular', 'normal');
    doc.setFontSize(14);
    const variationsText = `${variations.join(', ')}`;
    const splitVariations = doc.splitTextToSize(variationsText, containerWidth);
    height += splitVariations.length * 7 + 7; // 7mm per line + spacing
  }

  // Description
  doc.setFont('HindSiliguriLight', 'normal');
  doc.setFontSize(12);
  const descriptionText = currentLanguage === 'en' ? product.description_en || product.description : product.description;
  const splitDescription = doc.splitTextToSize(descriptionText, containerWidth);
  height += splitDescription.length * 7 + 10; // 7mm per line + spacing

  // Colors
  if (product.colors && product.colors.length > 0) {
    const colorCircleSize = 10; // Circle size
    const rowHeight = colorCircleSize + 15; // Circle size + spacing for text and between rows
    const numberOfRows = Math.ceil(product.colors.length / 3); // 3 colors per row
    height += numberOfRows * rowHeight + 10; // Total height for colors
  }

  // Additional padding at the bottom
  height += 10;

  return height;
};

// Helper function to add a cover page with additional sections
const addCoverPage = async (doc, category, categoryTranslationMap, currentLanguage) => {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20; // Fixed margin in mm
  const containerWidth = pageWidth - 2 * margin; // 170mm
  const centerX = pageWidth / 2;

  try {
    // Add logo
    const logoUrl = '/assets/emko-logo.png'; // Use emko-logo.png
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
    const imgY = pageHeight * 0.05;
    doc.addImage(dataURL, 'PNG', imgX, imgY, desiredLogoWidthMM, desiredLogoHeightMM);

    let currentY = imgY + desiredLogoHeightMM + 10;

    // Add Catalog Title (h1)
    doc.setFont('HindSiliguriBold', 'bold');
    doc.setFontSize(24);
    const titleText = category
      ? `Katalogu për ${capitalizeFirstLetter(categoryTranslationMap[category][currentLanguage])}`
      : 'Katalogu i Plotë';
    doc.text(titleText, centerX, currentY, { align: 'center' });

    currentY += 15; // Spacing after title

    // Function to add a section with centered title and paragraph
    const addSection = (title, text) => {
      // Add Section Title
      doc.setFont('HindSiliguriBold', 'bold');
      doc.setFontSize(16);
      doc.text(title, centerX, currentY, { align: 'center' });

      currentY += 7; // Spacing after section title

      // Add Section Paragraph
      doc.setFont('HindSiliguriLight', 'normal');
      doc.setFontSize(12);
      const splitText = doc.splitTextToSize(text, containerWidth);
      doc.text(splitText, centerX, currentY, { align: 'center' });

      currentY += splitText.length * 7 + 15; // Spacing after section
    };

    // Add 1st Section: Rreth Nesh
    addSection(
      'Rreth Nesh',
      'Me një përvojë të pasur dhe të gjatë në tregun shqiptar dhe rajonal si prodhues i patentuar prej 18 vitesh nga institucione ndërkombëtare, EMKO ka ndërtuar një emër të respektuar dhe një histori te gjate suksesi. Ne ofrojmë një gamë të gjerë produktesh të mobilimit të zyrave dhe institucioneve arsimore, të dizajnuara dhe prodhuar sipas standardeve më të larta të cilësisë, gjithashtu të përshtatura sipas dëshirave specifike të çdo klienti. Për ne, çdo klient është i rëndësishëm dhe kërkesat tuaja janë prioriteti ynë. Nëpërmjet zgjedhjes sonë, ju do të përfitoni jo vetëm nga cilësia e produkteve tona, por edhe nga një shërbim i shkëlqyeshëm dhe përkrahja që meritoni.'
    );

    // Add 2nd Section: Produktet
    addSection(
      'Produktet',
      'Një gamë e gjerë produktesh të përfshirë në 14 kategori për të mobiluar ambientet tuaja me shumllojshmërinë dhe kualitetin që Emko ofron.'
    );

    // Add 3rd Section: Misioni & Vizioni
    addSection(
      'Misioni & Vizioni',
      'Misioni ynë është t\'i përmbushim nevojat dhe kërkesat e klientëve tanë duke vënë në pah vlerat e kompanisë sonë; korrektësi, cilësi, profesionalizëm. Vizioni ynë është të jemi lider në tregun shqiptar dhe internacional të mobiljeve duke ofruar produkte me kualitet të lartë dhe vlera estetike të pakrahasueshme.'
    );
  } catch (error) {
    console.error('Error loading logo image:', error);
    // Proceed without the logo

    let currentY = margin + 30; // Adjust starting Y position

    // Add Catalog Title (h1)
    doc.setFont('HindSiliguriBold', 'bold');
    doc.setFontSize(24);
    const titleText = category
      ? `Katalogu për ${capitalizeFirstLetter(categoryTranslationMap[category][currentLanguage])}`
      : 'Katalogu i Plotë';
    doc.text(titleText, centerX, currentY, { align: 'center' });

    currentY += 15; // Spacing after title

    // Add sections as before
    const addSection = (title, text) => {
      // Add Section Title
      doc.setFont('HindSiliguriBold', 'bold');
      doc.setFontSize(16);
      doc.text(title, centerX, currentY, { align: 'center' });

      currentY += 7; // Spacing after section title

      // Add Section Paragraph
      doc.setFont('HindSiliguriLight', 'normal');
      doc.setFontSize(12);
      const splitText = doc.splitTextToSize(text, containerWidth);
      doc.text(splitText, centerX, currentY, { align: 'center' });

      currentY += splitText.length * 7 + 15; // Spacing after section
    };

    // Add the same sections as above
    addSection(
      'Rreth Nesh',
      'Me një përvojë të pasur dhe të gjatë në tregun shqiptar dhe rajonal si prodhues i patentuar prej 18 vitesh nga institucione ndërkombëtare, EMKO ka ndërtuar një emër të respektuar dhe një histori te gjate suksesi. Ne ofrojmë një gamë të gjerë produktesh të mobilimit të zyrave dhe institucioneve arsimore, të dizajnuara dhe prodhuar sipas standardeve më të larta të cilësisë, gjithashtu të përshtatura sipas dëshirave specifike të çdo klienti. Për ne, çdo klient është i rëndësishëm dhe kërkesat tuaja janë prioriteti ynë. Nëpërmjet zgjedhjes sonë, ju do të përfitoni jo vetëm nga cilësia e produkteve tona, por edhe nga një shërbim i shkëlqyeshëm dhe përkrahja që meritoni.'
    );

    addSection(
      'Produktet',
      'Një gamë e gjerë produktesh të përfshirë në 14 kategori për të mobiluar ambientet tuaja me shumllojshmërinë dhe kualitetin që Emko ofron.'
    );

    addSection(
      'Misioni & Vizioni',
      'Misioni ynë është t\'i përmbushim nevojat dhe kërkesat e klientëve tanë duke vënë në pah vlerat e kompanisë sonë; korrektësi, cilësi, profesionalizëm. Vizioni ynë është të jemi lider në tregun shqiptar dhe internacional të mobiljeve duke ofruar produkte me kualitet të lartë dhe vlera estetike të pakrahasueshme.'
    );
  }
};

const DownloadCatalog = () => {
  const { category } = useParams(); // Get the category slug from the URL
  const navigate = useNavigate(); // For navigation after download
  const [isLoading, setIsLoading] = useState(true); // State for loading indicator
  const downloadInitiated = useRef(false); // Ref to prevent multiple downloads

  const { i18n } = useTranslation();
  const currentLanguage = i18n.language;

  // Generate category translation map from categories data
  const categoryTranslationMap = categories.reduce((acc, cat) => {
    acc[cat.slug] = { sq: cat.name, en: cat.name_en };
    return acc;
  }, {});
  // Add 'All Products' translation
  categoryTranslationMap['all-products'] = { sq: 'Të gjitha produktet', en: 'All Products' };

  useEffect(() => {
    const fetchAndDownload = async () => {
      // Prevent multiple executions
      if (downloadInitiated.current) return;
      downloadInitiated.current = true;

      try {
        // Fetch all products
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/products`);
        if (!response.ok) {
          throw new Error(`Failed to fetch products: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();

        // Filter products by category if a category is specified
        const filteredProducts = category
        ? data.filter(
            (product) =>
              product.category &&
              product.category.toLowerCase() === categoryTranslationMap[category].en.toLowerCase()
          )
        : data;
      

        if (filteredProducts.length === 0) {
          alert(currentLanguage === 'en' ? 'No products found in this category.' : 'Nuk ka produkte në këtë kategori.');
          navigate('/full-catalog'); // Redirect to FullCatalog.jsx
          return;
        }

        // Sort products alphabetically by name in the current language
        const sortedProducts = filteredProducts.sort((a, b) => {
          const nameA = currentLanguage === 'en' ? a.name_en || a.name : a.name;
          const nameB = currentLanguage === 'en' ? b.name_en || b.name : b.name;
          return nameA.localeCompare(nameB);
        });

        // Initialize jsPDF
        const doc = new jsPDF('p', 'mm', 'a4');

        // Load custom fonts
        try {
          await loadFonts(doc);
        } catch (error) {
          console.error('Error loading fonts:', error);
          alert(
            currentLanguage === 'en'
              ? `Error loading fonts: ${error.message}. Please ensure the font files exist and try again.`
              : `Gabim gjatë ngarkimit të fonteve: ${error.message}. Ju lutemi kontrolloni që filet e fonteve ekzistojnë dhe provoni përsëri.`
          );
          navigate('/full-catalog'); // Redirect to FullCatalog.jsx
          return; // Exit the function if fonts fail to load
        }

        // Set default font to HindSiliguriRegular
        doc.setFont('HindSiliguriRegular', 'normal');

        // Add Cover Page with additional sections
        await addCoverPage(doc, category, categoryTranslationMap, currentLanguage);

        // Initialize coordinates after the cover page
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const margin = 20; // Fixed margin in mm
        const containerWidth = pageWidth - 2 * margin; // 170mm
        const centerX = pageWidth / 2;

        for (const product of sortedProducts) {
          // Add a new page for each product
          doc.addPage();

          // Desired physical size for product image
          const imageWidthMM = 150; // Adjust as needed
          const imageHeightMM = 100; // Adjust as needed

          // Estimate required height for the product
          const requiredHeight = estimateProductHeight(
            doc,
            product,
            containerWidth,
            imageHeightMM,
            currentLanguage
          );

          // Calculate starting Y position to center content vertically
          const yStart = (pageHeight - requiredHeight) / 2;
          let y = yStart;

          // Add Product Name (h3)
          doc.setFont('HindSiliguriBold', 'bold');
          doc.setFontSize(16);
          const nameText =
            currentLanguage === 'en' ? product.name_en || product.name : product.name;
          const splitName = doc.splitTextToSize(nameText, containerWidth);
          doc.text(splitName, centerX, y, { align: 'center' });
          y += splitName.length * 7 + 10;

          // Add Product Image (centered)
          if (product.images && product.images.length > 0) {
            try {
              const imgDataObj = await getImageDataUrl(
                product.images[0],
                imageWidthMM,
                imageHeightMM,
                150,
                'JPEG',
                0.85,
                0
              );
              const { dataURL } = imgDataObj;

              // Calculate centered position
              const imgX = (pageWidth - imageWidthMM) / 2;

              doc.addImage(dataURL, 'JPEG', imgX, y, imageWidthMM, imageHeightMM);
              y += imageHeightMM + 10;
            } catch (error) {
              console.error(`Error loading image for product ${product.name}:`, error);
              y += 10; // Add space if image fails to load
            }
          } else {
            y += 10; // Add space if no image
          }

          // Add Variations
          const variations =
            currentLanguage === 'en' ? product.variations_en : product.variations;
          if (variations && variations.length > 0) {
            doc.setFont('HindSiliguriRegular', 'normal');
            doc.setFontSize(14);
            doc.setTextColor(45, 56, 181); // --color-primary: #ED205A
            const variationsText = `${variations.join(', ')}`;
            const splitVariations = doc.splitTextToSize(variationsText, containerWidth);
            doc.text(splitVariations, centerX, y, { align: 'center' });
            y += splitVariations.length * 7 + 5;
            doc.setTextColor(0, 0, 0); // Reset to black
          }

          // Add Description (p)
          doc.setFont('HindSiliguriLight', 'normal');
          doc.setFontSize(12);
          const descriptionText =
            currentLanguage === 'en' ? product.description_en || product.description : product.description;
          const splitDescription = doc.splitTextToSize(descriptionText, containerWidth);
          splitDescription.forEach((line) => {
            if (y + 7 > pageHeight - margin) {
              // If the text exceeds the page height, add a new page
              doc.addPage();
              y = margin + 10; // Reset y position with top padding on new page
            }
            doc.text(line, centerX, y, { align: 'center' });
            y += 7;
          });

          // Add Colors (inside the for loop)
          if (product.colors && product.colors.length > 0) {
            const colors =
              currentLanguage === 'en'
                ? product.colors.map((c) => ({ ...c, name: c.name_en || c.name }))
                : product.colors;

            const colorsPerRow = 5; // Fixed number of colors per row
            const colorCircleSize = 10; // Circle size
            const spacingBetweenColors = 15; // Spacing between colors

            let colorY = y + 10; // Start a bit below the last y position
            let colorIndex = 0;
            const numberOfRows = Math.ceil(colors.length / colorsPerRow);

            for (let row = 0; row < numberOfRows; row++) {
              // Determine the number of colors in this row
              const colorsInThisRow = Math.min(colorsPerRow, colors.length - colorIndex);

              // Calculate total width of the colors and spacing in this row
              const totalColorsWidth =
                colorsInThisRow * colorCircleSize +
                (colorsInThisRow - 1) * spacingBetweenColors;

              // Calculate starting X position to center the colors row
              let colorX = (pageWidth - totalColorsWidth) / 2;

              for (let col = 0; col < colorsInThisRow; col++) {
                const color = colors[colorIndex];

                // Draw color circle
                doc.setFillColor(color.hex);
                doc.circle(
                  colorX + colorCircleSize / 2,
                  colorY + colorCircleSize / 2,
                  colorCircleSize / 2,
                  'F'
                );

                // Add color name below the circle, centered
                doc.setFont('HindSiliguriSemiBold', 'bold'); // Font weight 500 approximated with 'bold'
                doc.setFontSize(10); // Approximate to 1rem (~12pt)
                doc.setTextColor(0, 0, 0);
                const colorName = color.name;
                const textWidth = doc.getTextWidth(colorName);
                const textX = colorX + (colorCircleSize - textWidth) / 2;
                doc.text(
                  colorName,
                  colorX + colorCircleSize / 2,
                  colorY + colorCircleSize + 6,
                  { align: 'center' }
                );

                // Move to next color position
                colorX += colorCircleSize + spacingBetweenColors;
                colorIndex++;
              }

              // Move to next row
              colorY += colorCircleSize + 12; // Adjust spacing between rows
            }

            // Update y position after colors
            y = colorY + 10; // Adjust spacing after colors
          } else {
            y += 15; // If no colors, just add spacing
          }

          // Add additional bottom padding between products
          y += 15;
        }

        // Add footers with page numbers aligned to the left
        addFooter(doc);

        // Save the PDF
        const fileName = category
          ? `${capitalizeFirstLetter(categoryTranslationMap[category][currentLanguage])}_Katalogu.pdf`
          : `Katalogu_i_Plotë.pdf`;
        doc.save(fileName);

        // Update loading state and redirect to FullCatalog.jsx
        setIsLoading(false);
        navigate('/full-catalog'); // Redirect to FullCatalog.jsx
      } catch (error) {
        console.error('Error generating catalog PDF:', error);
        alert(
          currentLanguage === 'en'
            ? `Error generating catalog: ${error.message}. Please try again.`
            : `Gabim gjatë gjenerimit të katalogut: ${error.message}. Ju lutemi provoni përsëri.`
        );
        navigate('/full-catalog'); // Redirect to FullCatalog.jsx
      }
    };

    fetchAndDownload();
  }, [category, navigate, currentLanguage, categoryTranslationMap]);

  return (
    <div>
      {isLoading ? (
        <Loader /> // Display Loader while generating PDF
      ) : (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
          <p>{currentLanguage === 'en' ? 'Download completed.' : 'Shkarkimi u përfundua.'}</p>
        </div>
      )}
    </div>
  );
};

export default DownloadCatalog;
