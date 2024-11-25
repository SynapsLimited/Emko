// src/components/CookieConsent.jsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './../css/cookieconsent.css';

const CookieConsent = () => {
  const [showConsent, setShowConsent] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('adshCookieConsent');
    if (!consent) {
      setShowConsent(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('adshCookieConsent', 'true');
    setShowConsent(false);
  };

  const declineCookies = () => {
    localStorage.setItem('adshCookieConsent', 'false');
    setShowConsent(false);
  };

  if (!showConsent) {
    return null;
  }

  return (
    <div className="cookie-consent">
      <div className="cookie-consent__content">
        <p>
          We use cookies to enhance your browsing experience, serve personalized ads or content, and analyze our traffic. By clicking "Accept", you consent to our use of cookies. You can learn more in our <Link to="/privacy-policy" className="cookie-consent__link">Privacy Policy</Link>.
        </p>
        <div className="cookie-consent__buttons">
          <button className="cookie-consent__button accept" onClick={acceptCookies}>
            Accept
          </button>
          <button className="cookie-consent__button decline" onClick={declineCookies}>
            Decline
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
