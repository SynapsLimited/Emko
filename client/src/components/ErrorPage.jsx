// src/pages/ErrorPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const ErrorPage = () => {
  const { t } = useTranslation();
  return (
    <section data-aos="fade-up" className="container error-page">
      <div className="center">
        <Link to="/" className="btn btn-primary">{t('errorPage.goHome')}</Link>
        <h3>{t('errorPage.title')}</h3>
        <p>{t('errorPage.message')}</p>
      </div>
    </section>
  );
};

export default ErrorPage;
