// src/pages/ErrorPage.jsx

import React from 'react';
import { Link } from 'react-router-dom';

const ErrorPage = () => {
  return (
    <section data-aos="fade-up" className="container error-page">
      <div className="center">
        <Link to="/" className="btn btn-primary">Go Back Home</Link>
        <h3>Oops! Something went wrong.</h3>
        <p>We can’t seem to find the page you’re looking for. It might have been moved or deleted.</p>
      </div>
    </section>
  );
};

export default ErrorPage;
