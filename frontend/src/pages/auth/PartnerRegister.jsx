import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import "../../App.css";

const PartnerRegister = () => {
  const navigate = useNavigate();

  const [locationStatus, setLocationStatus] = useState("Not fetched");
  const [coords, setCoords] = useState({ lat: 0, long: 0 });

  const fetchLocation = () => {
    setLocationStatus("Fetching...");
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoords({
            lat: position.coords.latitude,
            long: position.coords.longitude
          });
          setLocationStatus("Location Acquired ✅");
        },
        (err) => {
          console.error("Location error", err);
          setLocationStatus("Location Failed ❌ - Allow Permission");
        }
      );
    } else {
      setLocationStatus("Geolocation not supported ❌");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (coords.lat === 0 && coords.long === 0) {
      const confirm = window.confirm("Location not fetched. Continue with default location?");
      if (!confirm) return;
    }

    const formData = {
      name: e.target.restaurantName.value,
      email: e.target.businessEmail.value,
      password: e.target.password.value,
      phone: e.target.phone.value,
      address: e.target.address.value,
      contactName: e.target.contactName.value,
      lat: coords.lat,
      long: coords.long
    };

    try {
      const response = await axios.post('http://localhost:3000/api/auth/food-partner/register', formData, {
        withCredentials: true,
      });

      console.log(response.data);
      alert("Registration Successful! Please login.");
      navigate('/food-partner/login');
    } catch (err) {
      console.error("Registration failed:", err.response?.data || err.message);
      alert("Registration failed: " + (err.response?.data?.message || err.message));
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

          <div className="form-group">
            <label>Location Coordinates</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button type="button" onClick={fetchLocation} className="file-btn" style={{ padding: '8px 12px', fontSize: '0.9rem' }}>
                📍 Get Current Location
              </button>
              <span style={{ fontSize: '0.9rem', color: locationStatus.includes("✅") ? "green" : "red" }}>
                {locationStatus}
              </span>
            </div>
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