import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

const PartnerRegister = () => (
  <div className="auth-page">
    <div className="auth-card">
      <div className="role-switcher">
        <Link to="/user/register" className="role-btn">As User</Link>
        <Link to="/food-partner/register" className="role-btn active">As Partner</Link>
      </div>
      <h2>Partner Register</h2>
      <p>Register your kitchen on FlavorFeed</p>
      <form>
        <div className="form-group">
          <label>Restaurant Name</label>
          <input type="text" placeholder="The Spice Hut" />
        </div>
        <div className="form-group">
          <label>Business Email</label>
          <input type="email" placeholder="contact@business.com" />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input type="password" placeholder="••••••••" />
        </div>
        <button type="button" className="auth-btn">Register Business</button>
      </form>
      <div className="auth-footer">
        Already a partner? <Link to="/food-partner/login">Partner Login</Link>
      </div>
    </div>
  </div>
);
export default PartnerRegister;