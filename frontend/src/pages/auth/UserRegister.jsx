import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import "../../App.css";

const UserRegister = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const fullName = e.target.fullName.value;
    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      await register({
        fullName,
        email,
        password
      });

      alert(`Welcome, ${fullName}! Registration successful. Please login.`);
      navigate('/user/login');
    } catch (error) {
      console.error("Registration error:", error.response?.data || error.message);
      alert("Registration failed. Please try again.");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="role-switcher">
          <Link to="/user/register" className="role-btn active">As User</Link>
          <Link to="/food-partner/register" className="role-btn">As Partner</Link>
        </div>

        <h2>Create Account</h2>
        <p>Join our food community</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input
              name="fullName"
              type="text"
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              name="email"
              type="email"
              placeholder="name@example.com"
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              name="password"
              type="password"
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" className="auth-btn">Register</button>
        </form>

        <div className="auth-footer">
          Already have an account? <Link to="/user/login">Login</Link>
        </div>
      </div>
    </div>
  );
};

export default UserRegister;