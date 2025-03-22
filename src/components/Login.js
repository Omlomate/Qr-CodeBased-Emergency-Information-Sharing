import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../assets/Login.css'; // Import updated CSS file for styling

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`https://qr-code-based-emergency-information.onrender.com/api/auth/login`, {
        email,
        password,
      });
      const { token, name, userDetails } = response.data;

      // Store data in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('username', name);
      localStorage.setItem('userDetails', JSON.stringify(userDetails));

      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h2>Emergency Info Sharing QR </h2>
          <p className="login-subtitle">Access your QR-based emergency information system</p>
        </div>
        {error && <p className="error-text">{error}</p>}
        <form onSubmit={handleLogin}>
          <div className="login-form-group">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="login-form-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="login-options">
            <label>
              <input type="checkbox" /> Remember me
            </label>
            <a className="forgot-password" href="/forgot-password">
              Forgot your password?
            </a>
          </div>
          <button type="submit" className="btn-login">
            Sign In
          </button>
          <p className="signup-text">
            Don’t have an account? <a href="/register">Sign up</a>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;