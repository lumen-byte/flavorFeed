import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import "../../App.css";
import axios from 'axios';

const PartnerLogin = () => {
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const businessEmail = e.target.businessEmail.value;
    const password = e.target.password.value;

    try {
      const response = await axios.post('http://localhost:3000/api/auth/food-partner/login', {
        email: businessEmail,
        password
      }, {
        withCredentials: true,
      });
      console.log(response.data);
      navigate('/food-partner/dashboard');
    } catch (err) {
      console.error("Login failed:", err.response?.data || err.message);
      alert("Invalid business email or password");
    }
  };

  // Fixed: Removed the second 'const PartnerLogin' declaration
  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Partner Login</h2>
        <p>Manage your restaurant portal</p>

        {/* Fixed: Added onSubmit handler */}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Business Email</label>
            {/* Fixed: Added name attribute so handleSubmit can find it */}
            <input name="businessEmail" type="email" placeholder="chef@restaurant.com" required />
          </div>
          <div className="form-group">
            <label>Password</label>
            {/* Fixed: Added name attribute */}
            <input name="password" type="password" placeholder="••••••••" required />
          </div>
          {/* Fixed: Changed type to 'submit' */}
          <button type="submit" className="auth-btn">Dashboard Login</button>
        </form>

        <div className="auth-footer">
          Become a partner? <Link to="/food-partner/register">Register Business</Link>
        </div>
      </div>
    </div>
  );
};

export default PartnerLogin;