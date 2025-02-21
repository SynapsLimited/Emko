// src/components/Hero.jsx
import React from 'react';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const defaultContent = {
  home: {
    title: 'Where everything comes together',
    description:
      'With 18 years of expertise in crafting high-quality office and educational furniture, EMKO blends innovation, precision, and personalized service to transform your workspace.',
    image: '/assets/header-images/home.jpg', // update with your home image
  },
  about: {
    title: 'Discover EMKO',
    description:
      'For 18 years, EMKO has built a respected legacy in the Albanian and regional market as a patented manufacturer. We provide tailor-made, high-quality furniture solutions, placing every client’s needs at the heart of what we do.',
    image: '/assets/header-images/rreth-nesh.jpeg',
  },
  products: {
    title: 'Our Products',
    description:
      'Explore our innovative range of office and educational furniture, designed and manufactured to meet the highest quality standards and your specific requirements.',
    image: '/assets/header-images/kreu.jpeg',
  },
  projects: {
    title: 'Our Projects',
    description:
      'Discover our successful projects – including the renowned EMKO Slider – that highlight our dedication to innovation, quality, and aesthetic excellence.',
    image: '/assets/header-images/projekte.jpeg',
  },
  certifications: {
    title: 'Certifications',
    description:
      'Our commitment to accuracy, quality, and professionalism is validated by international standards, including the UNE-EN-ISO 9001/08 certification.',
    image: '/assets/header-images/certifikime.jpg',
  },
  contact: {
    title: 'Get In Touch',
    description:
      'Reach out to learn more about how EMKO’s tailored, high-quality furniture solutions can elevate your workspace.',
    image: '/assets/header-images/kontakt.jpg',
  },
};

const Hero = ({ type = 'home', scrollPosition, title, description, image }) => {
  const { t } = useTranslation();

  // Use translation keys with fallback to default content if translation is missing.
  const content = {
    title: title || t(`hero.${type}.title`) || defaultContent[type].title,
    description: description || t(`hero.${type}.description`) || defaultContent[type].description,
    image: image || defaultContent[type].image,
  };

  const isHome = type === 'home';

  return (
    <div className="pt-32">
      <section className="w-full pb-12 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center text-center lg:text-left">
            {/* Left Column: Text & Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col justify-center space-y-6"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="space-y-4"
              >
                <h1 className="text-3xl tracking-tight sm:text-5xl">
                  {content.title}
                </h1>
                <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400 mx-auto lg:mx-0">
                  {content.description}
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="flex justify-center lg:justify-start gap-4"
              >
                {isHome ? (
                  <>
                    <Link
                      to="/products"
                      className="px-6 py-3 btn btn-primary"
                    >
                      {t('navbar.products')}
                    </Link>
                    <Link
                      to="/projects"
                      className="px-6 py-3 btn btn-secondary"
                    >
                      {t('projects.heroTitle')}
                    </Link>
                  </>
                ) : (
                  <Link
                    to="/contact"
                    className="px-6 py-3 btn btn-primary"
                  >
                    {t('navbar.contact')}
                  </Link>
                )}
              </motion.div>
            </motion.div>

            {/* Right Column: Side Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mx-auto lg:mx-0"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
                className="relative shadow-lg rounded-[22px] max-w-[550px]"
              >
                <img
                  src={content.image}
                  alt={`${type} Hero Image`}
                  className="rounded-[22px] object-cover w-full aspect-[1.5/1]"
                />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

Hero.propTypes = {
  type: PropTypes.string,
  scrollPosition: PropTypes.number,
  title: PropTypes.string,
  description: PropTypes.string,
  image: PropTypes.string,
};

export default Hero;
