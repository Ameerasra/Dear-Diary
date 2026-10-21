import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';
import { motion } from 'framer-motion';
import Navbar from './Navbar';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [error, setError] = useState('');
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await register(name, email, password, passwordConfirmation);
    if (success) {
      navigate('/dashboard');
    } else {
      setError('Registration failed');
    }
  };

  return (
    <div className="login-container">
      <Navbar />
      <div className="login-main">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="login-card"
        >
          <h2 className="login-heading">Register</h2>
          {error && <p className="login-error">{error}</p>}
          <form onSubmit={handleSubmit} className="login-form">
            <div className="login-input-group" style={{ '--index': 1 }}>
              <label className="login-label">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="login-input"
                placeholder="Enter your name"
              />
            </div>
            <div className="login-input-group" style={{ '--index': 2 }}>
              <label className="login-label">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="login-input"
                placeholder="Enter your email"
              />
            </div>
            <div className="login-input-group" style={{ '--index': 3 }}>
              <label className="login-label">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="login-input"
                placeholder="Enter your password"
              />
            </div>
            <div className="login-input-group" style={{ '--index': 4 }}>
              <label className="login-label">Confirm Password</label>
              <input
                type="password"
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                required
                className="login-input"
                placeholder="Confirm your password"
              />
            </div>
            <button type="submit" className="login-button">Register</button>
          </form>
          <p className="login-link">
            Already have an account? <a href="/login">Login</a>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
