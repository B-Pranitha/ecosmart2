// src/components/Login.js
import React, { useState } from 'react';
import '../styles/Login.css';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Simple static login check (replace with Firebase later)
    if (username === 'user' && password === 'pass') {
      navigate('/home');
    } else {
      alert('Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-section">
        <div className="login-box">
          <h2>EcoSmart Login</h2>
          <form onSubmit={handleLogin}>
            <div className="input-group">
              <label htmlFor="username">Username</label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter Username"
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter Password"
                required
              />
            </div>

            <button type="submit" className="login-btn">Login</button>
          </form>

          <div className="extra-options">
            <a href="#">Forgot Password?</a>
            <p>Not registered? <a href="#">Create Account</a></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
