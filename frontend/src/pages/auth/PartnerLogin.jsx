import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../App.css';
import axios from 'axios';
import { connectSocket } from '../../services/socket';

const PartnerLogin = () => {
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const businessEmail = e.target.businessEmail.value;
    const password = e.target.password.value;

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/food-partner/login`,
        { email: businessEmail, password },
        { withCredentials: true }
      );
      if (response.data.token) {
        localStorage.setItem('partner_token', response.data.token);
        connectSocket();
      }
      navigate('/food-partner/dashboard');
    } catch (err) {
      console.error('Login failed:', err.response?.data || err.message);
      alert('Invalid business email or password');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card animate-fade-up">
        {/* Gradient logo */}
        <div className="auth-logo">FlavorFeed</div>

        <h2>Partner Login</h2>
        <p>Manage your restaurant portal</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="partner-email">Business Email</label>
            <input
              id="partner-email"
              name="businessEmail"
              type="email"
              placeholder="chef@restaurant.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="partner-password">Password</label>
            <input
              id="partner-password"
              name="password"
              type="password"
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" className="auth-btn">Dashboard Login</button>
        </form>

        <div className="auth-divider">
          <span>OR</span>
        </div>
      </div>

      <div className="auth-footer-box">
        Become a partner?&nbsp;
        <Link to="/food-partner/register" className="auth-link">Register Business</Link>
      </div>
    </div>
  );
};

export default PartnerLogin;