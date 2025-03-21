// client/src/components/Auth/ForgotPassword.jsx
import React, { useState } from 'react';
import axios from 'axios';
import './Auth.css'; // Same styling as other auth pages

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/auth/forgot-password', { email });
      setMessage(res.data.message);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error sending reset link');
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit} className="auth-form">
        <h2 className="auth-title">Forgot Password</h2>
        <div className="input-group">
          <label>Email</label>
          <input 
            type="email" 
            placeholder="Enter your registered email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required 
          />
        </div>
        <button type="submit" className="auth-btn">Send Reset Link</button>
        {message && <p>{message}</p>}
      </form>
    </div>
  );
};

export default ForgotPassword;
