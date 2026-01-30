import React, { useState } from 'react';
import axios from 'axios';
import './register.css';
import API from '../api';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    name: '',
    email: ''
  });

  const { username, password, name, email} = formData;

  const handleChange = (e) => {
    const { name, value} = e.target;
    setFormData({...formData, [name]: value})
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await API.post('/api/auth/register', formData);
      alert('User registered successfully!');

    } catch (error) {
      alert('Failed to register try again!' + (error.response ? error.response.data.message : ''));
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="wrapper">
        <div className="boxxx">
            <div className="login-header">
                <span>Register</span>
            </div>
            <div className="input">
          <label className="label" htmlFor="username">Username:</label>
           <input className="input-field"
          type="text"
          id="username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          required
            />
            </div>
           <div className="input"> 
           <label className="label" htmlFor="password">Password:</label>
           <input className="input-field"
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
           />
           </div>
          <div className="input">
           <label className="label" htmlFor="name">Name:</label>
          <input className="input-field"
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          />
          </div>
            <div className="input">
           <label className="label" htmlFor="email">Email:</label>
           <input className="input-field"
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
            />
         </div>
         <div className="input_boxxx"> 
      <button type="submit" className="input-submit">Register</button>
      </div>
      </div>
      </div>
    </form>
  );
};

export default RegisterForm;