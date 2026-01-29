import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

const PartnerLogin = () => (
  <div className="auth-page">
    <div className="auth-card">
      <h2>Partner Login</h2>
      <p>Manage your restaurant portal</p>
      <form>
        <div className="form-group">
          <label>Business Email</label>
          <input type="email" placeholder="chef@restaurant.com" />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input type="password" placeholder="••••••••" />
        </div>
        <button type="button" className="auth-btn">Dashboard Login</button>
      </form>
      <div className="auth-footer">
        Become a partner? <Link to="/food-partner/register">Register Business</Link>
      </div>
    </div>
  </div>
);
export default PartnerLogin;