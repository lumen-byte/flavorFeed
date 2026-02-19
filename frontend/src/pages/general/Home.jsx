import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Feed from '../../components/Feed';
import '../../styles/Home.css';

function Home() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('global'); // 'global' or 'nearby'
    const [location, setLocation] = useState(null);
    const [locationError, setLocationError] = useState(null);

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        if (tab === 'nearby' && !location) {
            requestLocation();
        }
    };

    const requestLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLocation(position.coords);
                    setLocationError(null);
                },
                (error) => {
                    console.error("Location error", error);
                    setLocationError("Location permission denied. Please enable it to see nearby food.");
                }
            );
        } else {
            setLocationError("Geolocation is not supported by this browser.");
        }
    };

    return (
        <div className="home-container">
            {/* Header Tabs */}
            <div className="feed-tabs">
                <button
                    className={`tab-btn ${activeTab === 'global' ? 'active' : ''}`}
                    onClick={() => handleTabChange('global')}
                >
                    World Wide 🌍
                </button>
                <div style={{ width: '1px', background: 'rgba(255,255,255,0.2)' }}></div>
                <button
                    className={`tab-btn ${activeTab === 'nearby' ? 'active' : ''}`}
                    onClick={() => handleTabChange('nearby')}
                >
                    Nearby 📍
                </button>
            </div>

            {/* Floating Cart Button */}
            <button
                className="floating-cart-btn"
                onClick={() => navigate('/cart')}
                style={{
                    position: 'fixed',
                    bottom: '20px',
                    right: '20px',
                    backgroundColor: '#ff4757',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    width: '60px',
                    height: '60px',
                    fontSize: '30px',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
                    cursor: 'pointer',
                    zIndex: 1000
                }}
            >
                🛒
            </button>

            {/* Content */}
            {
                activeTab === 'nearby' && !location ? (
                    <div className="location-request">
                        <h2>Where are you?</h2>
                        <p>{locationError || "We need your location to find delicious food near you."}</p>
                        <button className="location-btn" onClick={requestLocation}>
                            Allow Location Access
                        </button>
                    </div>
                ) : (
                    <Feed type={activeTab} location={location} />
                )
            }
        </div >
    );
}

export default Home;