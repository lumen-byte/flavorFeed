import React, { useState } from 'react';
import { Link, useNavigate, useLocation as useRouteLocation } from 'react-router-dom';
import { useFeed } from '../context/FeedContext';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useLocation } from '../context/LocationContext';
import LocationSelector from './LocationSelector';
import '../styles/Navbar.css';

const Navbar = () => {
    const { user } = useAuth();
    const { cart } = useCart();
    const { location, fetchLocation } = useLocation();
    const { feedType, setFeedType } = useFeed();
    const routeLocation = useRouteLocation();
    const navigate = useNavigate();
    const [isLocOpen, setLocOpen] = useState(false);

    const isFeedPage = routeLocation.pathname === '/';

    return (
        <>
            <nav className="navbar">
                <div className="navbar-left">
                    <Link to="/" className="logo" style={{ color: 'var(--ff-text-primary)', textShadow: '0 1px 4px rgba(255,255,255,0.4)' }}>FlavorFeed 🍔</Link>
                    <div className="location-display" onClick={() => setLocOpen(true)} style={{ cursor: 'pointer', marginLeft: '12px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontSize: '0.65rem', color: 'var(--ff-text-primary)', fontWeight: 'bold', textTransform: 'uppercase', opacity: 0.8 }}>Delivering to</span>
                            <span style={{ fontSize: '0.9rem', color: 'var(--ff-text-primary)', fontWeight: '800', display: 'flex', alignItems: 'center' }}>
                                {location ? (location.address || "Current Location") : "Locating..."} <span style={{ fontSize: '0.7rem', marginLeft: '5px' }}>▼</span>
                            </span>
                        </div>
                    </div>
                </div>

                {isFeedPage && (
                    <div className="navbar-center-tabs">
                        <button 
                            className={feedType === 'all' ? 'active' : ''} 
                            onClick={() => setFeedType('all')}
                        >
                            For You
                        </button>
                        <div className="tab-divider"></div>
                        <button 
                            className={feedType === 'nearby' ? 'active' : ''} 
                            onClick={() => setFeedType('nearby')}
                        >
                            Nearby
                        </button>
                    </div>
                )}

                <div className="navbar-right">
                    {user ? (
                        <div className="nav-profile" onClick={() => navigate('/profile')} style={{ background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(0,0,0,0.1)' }}>
                            👤
                        </div>
                    ) : (
                        <Link to="/user/login" className="login-link" style={{ color: 'var(--ff-text-primary)' }}>Login</Link>
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
