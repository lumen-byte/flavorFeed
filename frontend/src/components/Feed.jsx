import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import ReelCard from './ReelCard';
import './Feed.css';

const Feed = ({ type, location }) => {
    const [foods, setFoods] = useState([]);
    const [activeIndex, setActiveIndex] = useState(0);
    const containerRef = useRef(null);

    useEffect(() => {
        fetchFoods();
    }, [type, location]);

    const fetchFoods = async () => {
        try {
            const params = { type };
            if (type === 'nearby' && location) {
                params.lat = location.latitude;
                params.long = location.longitude;
            }

            const res = await axios.get('http://localhost:3000/api/food', { params });
            setFoods(res.data.foodItems);
            // Reset active index?
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
                    <p>{type === 'nearby' ? "Try enabling location" : "Check back later"}</p>
                </div>
            )}
        </div>
    );
};

export default Feed;
