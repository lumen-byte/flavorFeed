import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../App.css';
import { useAuth } from '../../context/AuthContext';

const UserLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      console.error('Login failed:', err.response?.data || err.message);
      alert('Invalid email or password');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card animate-fade-up">
        {/* Gradient logo */}
        <div className="auth-logo">FlavorFeed</div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="login-email">Email</label>
            <input
              id="login-email"
              name="email"
              type="email"
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="login-password">Password</label>
            <input
              id="login-password"
              name="password"
              type="password"
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" className="auth-btn">Sign In</button>
        </form>

        <div className="auth-divider">
          <span>OR</span>
        </div>
      </div>

      {/* Instagram-style below-card box */}
      <div className="auth-footer-box">
        New here?&nbsp;
        <Link to="/user/register" className="auth-link">Create account</Link>
      </div>
    </div>
  );
};

export default UserLogin;