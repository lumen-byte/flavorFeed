import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './ReelCard.css'; // We'll create this CSS

const ReelCard = ({ food, isActive }) => {
    const videoRef = useRef(null);
    const { addToCart } = useCart();
    const { user } = useAuth();
    const [likes, setLikes] = useState(food.likes?.length || 0); // Assuming food has likes count or array
    // Since our mock backend didn't populate likes, we might need to fetch or just use 0.
    // Ideally backend should return like count and if current user liked it.

    // Auto play/pause based on active state
    useEffect(() => {
        if (isActive) {
            videoRef.current.currentTime = 0;
            videoRef.current.play().catch(e => console.log("Autoplay prevented", e));
        } else {
            videoRef.current.pause();
        }
    }, [isActive]);

    const handleLike = async () => {
        if (!user) return alert("Login to like!");
        try {
            await axios.post('http://localhost:3000/api/social/like', { foodId: food._id }, { withCredentials: true });
            setLikes(prev => prev + 1); // Optimistic update
        } catch (err) {
            console.error("Like error", err);
        }
    };

    const handleAddToCart = () => {
        addToCart(food._id, 1);
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: `Check out ${food.name} on FlavorFeed!`,
                    text: food.description,
                    url: window.location.href, // Or specific reel URL
                });
            } catch (err) {
                console.log('Error sharing', err);
            }
        } else {
            alert('Share not supported on this browser');
        }
    };

    return (
        <div className="reel-card">
            <video
                ref={videoRef}
                src={food.video}
                className="reel-video"
                loop
                muted={false} // Maybe start muted?
                playsInline
            />

            <div className="reel-overlay">
                <div className="reel-info">
                    <h3>{food.name}</h3>
                    <p>{food.description}</p>
                    <small>By {food.foodPartner?.name}</small>
                </div>

                <div className="reel-actions">
                    <button className="action-btn" onClick={handleLike}>
                        ❤️ {likes}
                    </button>
                    <button className="action-btn" onClick={() => alert("Comments comming soon!")}>
                        💬
                    </button>
                    <button className="action-btn" onClick={handleShare}>
                        ↗️
                    </button>
                    <button className="buy-btn" onClick={handleAddToCart}>
                        Add to Cart 🛒
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReelCard;
