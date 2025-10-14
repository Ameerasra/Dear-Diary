import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import '../styles/Login.css';
import { motion } from "framer-motion";
import Navbar from "./Navbar";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(email, password);
    if (success) {
      navigate('/dashboard');
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="login-container">
        <Navbar />
      <div className="login-main">
        <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }} className="login-card">
          <h2 className="login-heading">Login</h2>
          {error && <p className="login-error">{error}</p>}
          <form onSubmit={handleSubmit} className="login-form">
            <div className="login-input-group" style={{ '--index': 1 }}>
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
            <div className="login-input-group" style={{ '--index': 2 }}>
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
            <button type="submit" className="login-button">Login</button>
          </form>
          <p className="login-link">
            Don’t have an account? <a href="/register">register</a>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;