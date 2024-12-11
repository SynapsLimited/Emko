import React from 'react';

// ProductItem Component
const ProductItem = ({ link, imageSrc, title, description }) => (
  <div className="product-item">
    <a href={link} className="product-link">
      <img src={imageSrc} alt={title} className="product-image" />
      <h4 className="product-title">{title}</h4>
    </a>
    <p className="product-description">{description}</p>
    <a href={link} className="product-read-more">
      {title} →
    </a>
  </div>
);

// ProductsSection Component
const ProductsSection = () => {
  const products = [
    {
      link: 'products/category/executive-chairs',
      imageSrc: '../assets/2023/08/office-chairfddc.png?w=512',
      title: 'Karrige Ekzekutive',
      description:
        'Rehati dhe dizajn elegant për drejtues dhe zyra të stilit modern.',
    },
    {
      link: 'products/category/plastic-chairs',
      imageSrc: '../assets/2023/08/office-chairfddc.png?w=512',
      title: 'Karrige Plastike',
      description:
        'Praktike dhe e qëndrueshme, ideale për hapësira të brendshme dhe të jashtme.',
    },
    {
      link: 'products/category/waiting-chairs',
      imageSrc: '../assets/2023/08/office-chairfddc.png?w=512',
      title: 'Karrige Pritëse',
      description:
        'Komoditet dhe estetikë për zona pritjeje moderne.',
    },
    {
      link: 'products/category/utility-chairs',
      imageSrc: '../assets/2023/08/office-chairfddc.png?w=512',
      title: 'Karrige Utilitare',
      description:
        'Funksionale dhe të qëndrueshme për përdorim të përditshëm.',
    },
    {
      link: 'products/category/amphitheater',
      imageSrc: '../assets/2023/08/theaterfddc.png?w=512',
      title: 'Amfiteatër',
      description:
        'Opsionet e shumllojshme për amfiteatër qe EMKO ofron, me një rëndësi të theksuar tek efiçenca.',
    },
    {
      link: 'products/category/auditoriums',
      imageSrc: '../assets/2023/08/classroomfddc.png?w=512',
      title: 'Auditore',
      description:
        'Duke përdorur metodat më të reja në treg, EMKO ofron produkte auditorësh të cilat përmbushin të gjitha nevojat tuaja.',
    },
    {
      link: 'products/category/seminar-halls',
      imageSrc: '../assets/2023/08/coursefddc.png?w=512',
      title: 'Salla seminarësh',
      description:
        'EMKO mundëson një gamë të gjerë karrigesh për salla seminaresh. Të pajisura me një mbështetëse krahu dhe tavolinë shkrimi.',
    },
    {
      link: 'products/category/school-classes',
      imageSrc: '../assets/2023/08/classroom-1fddc.png?w=512',
      title: 'Klasa Shkolle',
      description:
        'EMKO ofron mobilim dhe arredim të plotë të klasave shkollore, me një koleksion të gjerë produktesh.',
    },
    {
      link: 'products/category/tables',
      imageSrc: '../assets/2023/08/tablefddc.png?w=512',
      title: 'Tavolina',
      description:
        'Prodhimet EMKO të tavolinave janë të dizenjuara për të përfshirë një rrjetë të gjërë funksionalitetesh.',
    },
    {
      link: 'products/category/laboratories',
      imageSrc: '../assets/2023/08/microscopefddc.png?w=512',
      title: 'Laboratorë',
      description:
        'Duke përdorur materiale me rezitencë ndaj elementëve kimik, EMKO ofron një linjë të gjerë mobilimi për laboratorë.',
    },
    {
      link: 'products/category/mixed',
      imageSrc: '../assets/2023/08/tribunefddc.png?w=512',
      title: 'Miks',
      description:
        'EMKO ofron një sërë produktesh të shumëanshme për të përmbushur nevojat tua.',
    },
    {
      link: 'products/category/industrial-lines',
      imageSrc: '../assets/2023/08/table-1fddc.png?w=512',
      title: 'Linja Industriale',
      description: 'Kjo linjë e re nga EMKO është një risi e pakrahasueshme në treg.',
    },
    {
      link: 'products/category/metal-cabinets',
      imageSrc: '../assets/2023/08/wardrobefddc.png?w=512',
      title: 'Dollap Metalik',
      description:
        'Duke i vënë rëndësi maksimale organizimit dhe sigurisë, EMKO ju prezanton njësitë e dollapëve metalikë.',
    },
    {
      link: 'products/category/metal-shelves',
      imageSrc: '../assets/2023/08/shelvesfddc.png?w=512',
      title: 'Skafale Metalik',
      description:
        'EMKO ofron një seri raftesh metalikë, perfekte për një organizim efikas.',
    },
    {
      link: 'products/category/wardrobes',
      imageSrc: '../assets/2023/08/wardrobe-1fddc.png?w=512',
      title: 'Dollapë',
      description:
        'Për të organizuar hapësiren tuaj, EMKO ofron një sërë modelesh për dollapë, të dizenjuar per efiçencë maksimale.',
    },
    {
      link: 'products/category/sofas',
      imageSrc: '../assets/2023/08/couchfddc.png?w=512',
      title: 'Kolltuqe',
      description:
        'Duke i përkushtuar rëndësi të madhe cilësisë dhe estetikës, EMKO prezanton ne treg linjen tonë të kolltuqeve, të krijuara për komfort maksimal.',
    },
    {
      link: 'products/category/stadiums',
      imageSrc: '../assets/2023/08/stadiumfddc.png?w=512',
      title: 'Stadiume',
      description:
        'Me një fokus në rehatësi dhe komfort, EMKO sjell në treg një seri ndenjësesh për stadiume.',
    },
  ];

  return (
    <section className="products-section">
      <div className="container">
        <p className="section-subtitle">Produktet tona</p>
        <h2 className="section-title">Cilat janë produktet tona?</h2>
        <p className="section-description">
          Një gamë e gjerë produktesh të përfshira në 17 kategori për të mobiluar ambientet
          tuaja me shumëllojshmërinë dhe kualitetin që EMKO ofron. Klikoni në një nga kategoritë e mëposhtme të shfletoni katalog-un digjital ose të shkarkoni katalog-un e zgjedhjes tuaj.
        </p>
        <div className="products-grid">
          {products.map((product, index) => (
            <ProductItem
              key={index}
              link={product.link}
              imageSrc={product.imageSrc}
              title={product.title}
              description={product.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;
