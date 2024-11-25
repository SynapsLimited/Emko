// src/components/Footer.jsx

import React from 'react';
import './../css/footer.css';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="footer">
      <div className="container footer-container">
        <div className="footer-top">
          <img src="/assets/emko-logo.png" alt="Emko Logo" className="footer-logo" />
        </div>

        <div className="footer-bottom">
          <div className="footer-column footer-location">
            <h4>Vendndodhja</h4>
            <div className="socials-container">
            <div className="social-row">
                <img src={`${process.env.PUBLIC_URL}/assets/Europe.png`} alt="Europe" />
                <a href="https://www.google.com/maps?q=41.304489,19.744116" 
                  className="footer-link">Vaqarr, Lalm mbas AnOil, Tirana</a>
              </div>
              <div className="social-row">
                <img src={`${process.env.PUBLIC_URL}/assets/Europe.png`} alt="Europe" />
                <a href="" 
                  className="footer-link">Bulevardi Gjergj Fishta, Tirana</a>
              </div>
              <div className="social-row">
                <img src={`${process.env.PUBLIC_URL}/assets/Europe.png`} alt="Europe" />
                <a href="" 
                  className="footer-link">Pezë Helmës, Tirana</a>
              </div>

            </div>
          </div>
          <div className="footer-column footer-contact">
            <h4>Kontakt</h4>
            <div className="socials-container">
              <div className="social-row">
                <img src={`${process.env.PUBLIC_URL}/assets/phone-call.png`} alt="Phone Number" />
                <a href="tel:+355682099420" className="footer-link">+355 68 209 9420</a>
              </div>
              <div className="social-row">
                <img src={`${process.env.PUBLIC_URL}/assets/phone-call.png`} alt="Phone Number" />
                <a href="tel:+355684008000" className="footer-link">+355 68 400 8000</a>
              </div>

              <div className="social-row">
                <img src={`${process.env.PUBLIC_URL}/assets/email.png`} alt="Email" />
                <a href="mailto:infoemko@yahoo.com" className="footer-link">infoemko@yahoo.com</a>
              </div>
            </div>
          </div>
          <div className="footer-column footer-socials">
            <h4>Rrjete Sociale</h4>
            <div className="socials-container">
              <div className="social-row">
                <img src={`${process.env.PUBLIC_URL}/assets/whatsapp.png`} alt="Whatsapp" />
                <a href="" className="footer-link">WhatsApp</a>
              </div>
              <div className="social-row">
                <img src={`${process.env.PUBLIC_URL}/assets/instagram.png`} alt="Instagram" />
                <a href="https://www.instagram.com/emko.alb/" className="footer-link">Instagram</a>
              </div>
              <div className="social-row">
                <img src={`${process.env.PUBLIC_URL}/assets/facebook.png`} alt="Facebook" />
                <a href="https://www.facebook.com/emkoalbania" className="footer-link">Facebook</a>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-copy">
          <p>Copyright © Emko. Të gjitha të drejtat e rezervuara. </p>
          <p>Dizenjuar nga <a href="http://www.synapslimited.eu" className="footer-copy-designed-by-synaps">Synaps</a></p>
        </div>
        <Link to="/privacy-policy" className="privacy-policy">Termat e privatësisë</Link>

      </div>
    </footer>
  );
};

export default Footer;
