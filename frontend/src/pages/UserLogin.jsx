import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

const UserLogin = () => (
  <div className="auth-page">
    <div className="auth-card">
      <h2>User Login</h2>
      <p>Welcome back to FlavorFeed</p>
      <form>
        <div className="form-group">
          <label>Email</label>
          <input type="email" placeholder="Enter your email" />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input type="password" placeholder="••••••••" />
        </div>
        <button type="button" className="auth-btn">Sign In</button>
      </form>
      <div className="auth-footer">
        New here? <Link to="/user/register">Create account</Link>
      </div>
    </div>
  </div>
);
export default UserLogin;