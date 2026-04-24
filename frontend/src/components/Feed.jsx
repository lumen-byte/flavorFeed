import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import ReelCard from './ReelCard';
import { useLocation } from '../context/LocationContext';
import './Feed.css';

const Feed = () => {
    const [foods, setFoods] = useState([]);
    const [activeIndex, setActiveIndex] = useState(0);
    const [feedType, setFeedType] = useState('all'); // 'all' or 'nearby'
    const containerRef = useRef(null);
    const { location } = useLocation();

    useEffect(() => {
        fetchFoods();
    }, [feedType, location]);

    const fetchFoods = async () => {
        try {
            const params = { type: feedType };
            if (feedType === 'nearby' && location) {
                params.lat = location.lat;
                params.long = location.long;
            }

            const res = await axios.get(`${import.meta.env.VITE_API_URL}/food`, { params });
            setFoods(res.data.foodItems);
            setActiveIndex(0);
        } catch (err) {
            console.error("Fetch feed error", err);
        }
    };

    const handleScroll = () => {
        if (containerRef.current) {
            const index = Math.round(containerRef.current.scrollTop / window.innerHeight);
            if (index !== activeIndex) {
                setActiveIndex(index);
            }
        }
    };

    return (
        <div className="feed-container" ref={containerRef} onScroll={handleScroll}>
            <div className="feed-tabs">
                <button
                    className={feedType === 'all' ? 'active' : ''}
                    onClick={() => setFeedType('all')}
                >
                    For You
                </button>
                <div className="divider">|</div>
                <button
                    className={feedType === 'nearby' ? 'active' : ''}
                    onClick={() => setFeedType('nearby')}
                >
                    Nearby 📍
                </button>
            </div>

            {foods.length > 0 ? (
                foods.map((food, index) => (
                    <ReelCard
                        key={food._id}
                        food={food}
                        isActive={index === activeIndex}
                    />
                ))
            ) : (
                <div className="no-reels">
                    <h2>No Reels Found 😢</h2>
                    <p>{feedType === 'nearby' ? "Try enabling location" : "Check back later"}</p>
                </div>
            )}
        </div>
    );
};

export default Feed;
