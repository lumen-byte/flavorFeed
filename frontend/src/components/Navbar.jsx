import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useLocation } from '../context/LocationContext';
import LocationSelector from './LocationSelector';
import '../styles/Navbar.css';

const Navbar = () => {
    const { user } = useAuth();
    const { cart } = useCart();
    const { location, fetchLocation } = useLocation();
    const navigate = useNavigate();
    const [isLocOpen, setLocOpen] = useState(false);

    return (
        <>
            <nav className="navbar">
                <div className="navbar-left">
                    <Link to="/" className="logo">FlavorFeed 🍔</Link>
                    <div className="location-display" onClick={() => setLocOpen(true)} style={{ cursor: 'pointer' }}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontSize: '0.65rem', color: '#ff4757', fontWeight: 'bold', textTransform: 'uppercase' }}>Delivering to</span>
                            <span style={{ fontSize: '0.9rem', color: 'white', fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                                {location ? (location.address || "Current Location") : "Locating..."} <span style={{ fontSize: '0.7rem', marginLeft: '5px' }}>▼</span>
                            </span>
                        </div>
                    </div>
                </div>

                <div className="navbar-right">
                    {user ? (
                        <div className="nav-profile" onClick={() => navigate('/profile')}>
                            👤
                        </div>
                    ) : (
                        <Link to="/user/login" className="login-link">Login</Link>
                    )}
                </div>
            </nav>

            <LocationSelector
                isOpen={isLocOpen}
                onClose={() => setLocOpen(false)}
                currentLocation={location ? (location.address || "Current Location") : "Unknown"}
                onRefresh={fetchLocation}
            />
        </>
    );
};

export default Navbar;
