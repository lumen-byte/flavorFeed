import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios'; // Fixed typo in 'axios'
import '../App.css';

const UserRegister = () => {

  // 1. Mark the function as async
  const handleSubmit = async (e) => {
    e.preventDefault();

    const fullName = e.target.fullName.value;
    const email = e.target.email.value;
    const password = e.target.password.value;

    console.log("Attempting registration for:", fullName);

    try {
      // 2. Use await with the correct backend URL
      // (Removed the leading slash before http)
      const response = await axios.post('http://localhost:3000/api/auth/user/register', {
        fullName: fullName, // Make sure this matches your backend model key
        email,
        password
      });

      console.log("Success:", response.data);
      alert(`Welcome, ${fullName}! Registration successful.`);
      
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