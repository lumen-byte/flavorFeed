import React, { useState, useEffect } from 'react';
import Feed from '../../components/Feed';
import '../../styles/Home.css';

function Home() {
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

            {/* Content */}
            {activeTab === 'nearby' && !location ? (
                <div className="location-request">
                    <h2>Where are you?</h2>
                    <p>{locationError || "We need your location to find delicious food near you."}</p>
                    <button className="location-btn" onClick={requestLocation}>
                        Allow Location Access
                    </button>
                </div>
            ) : (
                <Feed type={activeTab} location={location} />
            )}
        </div>
    );
}

export default Home;