import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../assets/Login.css'; // Import CSS file for styling

function Login() {
  const [email, setEmail] = useState(''); // State for email
  const [password, setPassword] = useState(''); // State for password
  const [error, setError] = useState(''); // State for error messages
  const navigate = useNavigate();


  
  // Function to handle login
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`https://qr-code-based-emergency-information.onrender.com/api/auth/login`, {
        email,
        password,
      });
      const { token, name, userDetails } = response.data;

      
  
      // Store data in localStorage
      localStorage.setItem('token', token); // Store JWT token
      localStorage.setItem('username', name); // Store username
      localStorage.setItem('userDetails', JSON.stringify(userDetails)); // Store userDetails object as a string
  
      navigate('/dashboard'); // Redirect to dashboard
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    }
  };
  
  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h2>Login</h2>
        </div>
        {error && <p className="error-text">{error}</p>}
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="options">
            <label>
              <input type="checkbox" /> Remember me
            </label>
            <a className="forgot-password" href="/forgot-password">
              Forgot your password?
            </a>
          </div>
          <button type="submit" className="btn-login">
            Sign in
          </button>
          <p className="signup-text">
            Don't have an account? <a href="/register">Sign up</a>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
