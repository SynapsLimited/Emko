// src/components/ContactForm.jsx
import React, { useState } from 'react';
import emailjs from 'emailjs-com';
import './../css/contact.css';
import { useTranslation } from 'react-i18next';

const ContactForm = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    email: '',
    phoneNumber: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendFormData({ ...formData });
  };

  const sendFormData = (data) => {
    const templateParams = {
      name: data.name,
      surname: data.surname,
      email: data.email,
      phoneNumber: data.phoneNumber,
      message: data.message
    };

    emailjs.send(
      process.env.REACT_APP_EMAILJS_SERVICE_ID,
      process.env.REACT_APP_EMAILJS_TEMPLATE_ID_CONTACT,
      templateParams,
      process.env.REACT_APP_EMAILJS_USER_ID
    )
      .then((response) => {
        console.log('SUCCESS!', response.status, response.text);
        alert(t('contactForm.send') + " " + t('contactForm.successMessage'));
      }, (err) => {
        console.error('FAILED...', err);
        alert(t('contactForm.errorMessage'));
      });
  };

  return (
    <section data-aos="fade-up" className="container contact-form-section">
      <form className="contact-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <input type="text" name="name" placeholder={t('contactForm.firstName')} value={formData.name} onChange={handleChange} required />
          <input type="text" name="surname" placeholder={t('contactForm.lastName')} value={formData.surname} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <input type="email" name="email" placeholder={t('contactForm.email')} value={formData.email} onChange={handleChange} required />
          <input type="text" name="phoneNumber" placeholder={t('contactForm.phone')} value={formData.phoneNumber} onChange={handleChange} required />
        </div>
        <textarea name="message" placeholder={t('contactForm.message')} value={formData.message} onChange={handleChange} required />
        <button type="submit" className="btn btn-primary btn-submit">
          {t('contactForm.send')}
        </button>
      </form>
    </section>
  );
};

export default ContactForm;
