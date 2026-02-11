import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import "../../App.css";

const PartnerRegister = () => {
  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault(); 
    
    // 1. COLLECT ALL DATA FROM FORM
    const formData = {
      restaurantName: e.target.restaurantName.value,
      businessEmail: e.target.businessEmail.value,
      password: e.target.password.value,
      phone: e.target.phone.value,
      address: e.target.address.value,
      contactName: e.target.contactName.value
    };
    
    try {
      // 2. SEND EXPANDED DATA TO BACKEND
      const response = await axios.post('http://localhost:3000/api/auth/food-partner/register', formData, {
        withCredentials: true,
      }); 

      console.log(response.data);
      navigate('/food-partner/login');
    } catch (err) {
      console.error("Registration failed:", err.response?.data || err.message);
      alert("Registration failed. Please check all fields.");
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
        
        <form onSubmit={handleSubmit}>
          {/* Restaurant / Business Name */}
          <div className="form-group">
            <label>Business Name</label>
            <input name="restaurantName" type="text" placeholder="The Spice Hut" required />
          </div>

          {/* Contact Person Name */}
          <div className="form-group">
            <label>Contact Name</label>
            <input name="contactName" type="text" placeholder="Owner or Manager Name" required />
          </div>

          {/* Business Email */}
          <div className="form-group">
            <label>Business Email</label>
            <input name="businessEmail" type="email" placeholder="contact@business.com" required />
          </div>

          {/* Phone Number */}
          <div className="form-group">
            <label>Phone Number</label>
            <input name="phone" type="tel" placeholder="+91 00000 00000" required />
          </div>

          {/* Business Address */}
          <div className="form-group">
            <label>Full Address</label>
            <input name="address" type="text" placeholder="Shop No, Street, City" required />
          </div>

          {/* Password */}
          <div className="form-group">
            <label>Password</label>
            <input name="password" type="password" placeholder="••••••••" required />
          </div>

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