// src/pages/Register.jsx

import React, { useState } from 'react';
import './../css/user.css'; 
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    password: '',
    password2: ''
  });

  const [error, setError] = useState('');
  const navigate = useNavigate();

  const changeInputHandler = (e) => {
    setUserData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  const registerUser = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/users/register`, userData, {
        withCredentials: true
      });
      if (response && response.data) {
        const newUser = response.data;
        if (!newUser) {
          setError("Registration failed. Please try again.");
        } else {
          navigate('/login');
        }
      } else {
        setError("An unexpected error occurred during registration.");
      }
    } catch (err) {
      if (err.response) {
        if (err.response.data && err.response.data.message) {
          setError(err.response.data.message);
        } else {
          setError(`Error ${err.response.status}: ${err.response.statusText}`);
        }
      } else if (err.request) {
        setError("Network error. Please check your connection.");
      } else {
        setError(`An unexpected error occurred: ${err.message}`);
      }
    }
  };

  return (
    <section data-aos="fade-up" className="register">
      <div className="container">
        <div className="blog-title">
          <h1>Register</h1>
        </div>
        <form className="form register-form" onSubmit={registerUser}>
          {error && <p className="form-error-message">{error}</p>}
          <input
            type="text"
            placeholder="Full Name"
            name="name"
            value={userData.name}
            onChange={changeInputHandler}
            autoFocus
          />
          <input
            type="text"
            placeholder="Email"
            name="email"
            value={userData.email}
            onChange={changeInputHandler}
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={userData.password}
            onChange={changeInputHandler}
          />
          <input
            type="password"
            placeholder="Confirm Password"
            name="password2"
            value={userData.password2}
            onChange={changeInputHandler}
          />
          <button type="submit" className="btn btn-secondary btn-submit">
            Register
          </button>
        </form>
        <small>Already have an account? <Link to="/login">Login</Link></small>
      </div>
    </section>
  );
};

export default Register;
