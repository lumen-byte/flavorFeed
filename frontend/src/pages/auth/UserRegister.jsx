import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../../App.css';

const UserRegister = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fullName = e.target.fullName.value;
    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      await register({ fullName, email, password });
      alert(`Welcome, ${fullName}! Registration successful. Please login.`);
      navigate('/user/login');
    } catch (error) {
      console.error('Registration error:', error.response?.data || error.message);
      alert('Registration failed. Please try again.');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card animate-fade-up">
        {/* Gradient logo */}
        <div className="auth-logo">FlavorFeed</div>

        {/* Role switcher */}
        <div className="role-switcher">
          <Link to="/user/register" className="role-btn active">As User</Link>
          <Link to="/food-partner/register" className="role-btn">As Partner</Link>
        </div>

        <h2>Create Account</h2>
        <p>Join our food community</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="reg-fullname">Full Name</label>
            <input
              id="reg-fullname"
              name="fullName"
              type="text"
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="reg-email">Email</label>
            <input
              id="reg-email"
              name="email"
              type="email"
              placeholder="name@example.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="reg-password">Password</label>
            <input
              id="reg-password"
              name="password"
              type="password"
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" className="auth-btn">Register</button>
        </form>

        <div className="auth-divider">
          <span>OR</span>
        </div>
      </div>

      {/* Below-card sign-in box */}
      <div className="auth-footer-box">
        Already have an account?&nbsp;
        <Link to="/user/login" className="auth-link">Sign in</Link>
      </div>
    </div>
  );
};

export default UserRegister;