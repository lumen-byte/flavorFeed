import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import "../../App.css";

const PartnerRegister = () => {
  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault(); 
    const restaurantName = e.target.restaurantName.value;
    const businessEmail = e.target.businessEmail.value;
    const password = e.target.password.value;
    
    try {
      const response = await axios.post('http://localhost:3000/api/auth/food-partner/register', {
        restaurantName,
        businessEmail,
        password
      }, {
        withCredentials: true,
      }); // FIXED: Added closing ); here

      console.log(response.data);
      navigate('/food-partner/login');
    } catch (err) {
      console.error("Registration failed:", err.response?.data || err.message);
      alert("Registration failed. Please try again.");
    }
  }; 

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="role-switcher">
          <Link to="/user/register" className="role-btn">As User</Link>
          <Link to="/food-partner/register" className="role-btn active">As Partner</Link>
        </div>
        <h2>Partner Register</h2>
        <p>Register your kitchen on FlavorFeed</p>
        
        {/* FIXED: Added onSubmit */}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Restaurant Name</label>
            {/* FIXED: Added name="restaurantName" */}
            <input name="restaurantName" type="text" placeholder="The Spice Hut" required />
          </div>
          <div className="form-group">
            <label>Business Email</label>
            {/* FIXED: Added name="businessEmail" */}
            <input name="businessEmail" type="email" placeholder="contact@business.com" required />
          </div>
          <div className="form-group">
            <label>Password</label>
            {/* FIXED: Added name="password" */}
            <input name="password" type="password" placeholder="••••••••" required />
          </div>
          {/* FIXED: Changed type to submit */}
          <button type="submit" className="auth-btn">Register Business</button>
        </form>
        
        <div className="auth-footer">
          Already a partner? <Link to="/food-partner/login">Partner Login</Link>
        </div>
      </div>
    </div>
  );
};

export default PartnerRegister;