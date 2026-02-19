import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useLocation } from '../context/LocationContext';
import '../styles/Navbar.css';

const Navbar = () => {
    const { user } = useAuth();
    const { cart } = useCart();
    const { location } = useLocation();
    const navigate = useNavigate();

    return (
        <nav className="navbar">
            <div className="navbar-left">
                <Link to="/" className="logo">FlavorFeed 🍔</Link>
                <div className="location-display">
                    📍 {location ? (location.address || "Current Location") : "Locating..."}
                </div>
            </div>

            <div className="navbar-right">
                {user ? (
                    <>
                        {/* Cart Icon in Navbar */}
                        <div className="nav-cart" onClick={() => navigate('/cart')}>
                            🛒
                            {cart.length > 0 && <span className="cart-badge">{cart.length}</span>}
                        </div>

                        {/* Profile Icon */}
                        <div className="nav-profile" onClick={() => navigate('/profile')}>
                            👤
                        </div>
                    </>
                ) : (
                    <Link to="/login" className="login-link">Login</Link>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
