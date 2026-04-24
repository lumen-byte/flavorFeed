import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import './ReelCard.css'; // We'll create this CSS

const ReelCard = ({ food, isActive }) => {
    const videoRef = useRef(null);
    const { addToCart } = useCart();
    const { addToast } = useToast();
    const { user } = useAuth();

    // State
    const [likes, setLikes] = useState(food.likes?.length || 0);
    const [isLiked, setIsLiked] = useState(false);
    const [showComments, setShowComments] = useState(false);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");

    useEffect(() => {
        // Check if user liked this food
        if (user && food.likes?.includes(user._id)) {
            setIsLiked(true);
        }
    }, [user, food]);

    // Auto play/pause based on active state
    useEffect(() => {
        if (!videoRef.current) return;

        if (isActive && !showComments) {
            videoRef.current.currentTime = 0;
            videoRef.current.play().catch(e => console.log("Autoplay prevented", e));
        } else {
            videoRef.current.pause();
        }
    }, [isActive, showComments]);

    const handleLike = async () => {
        if (!user) {
            addToast("Please login to like!", "info");
            return;
        }

        // Optimistic Update
        const previousLikes = likes;
        const previousIsLiked = isLiked;

        setIsLiked(!isLiked);
        setLikes(isLiked ? likes - 1 : likes + 1);

        try {
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/social/like`, { foodId: food._id }, { withCredentials: true });

            // Sync with server source of truth
            setLikes(res.data.likesCount);
            setIsLiked(res.data.isLiked);
        } catch (err) {
            // Revert on error
            setLikes(previousLikes);
            setIsLiked(previousIsLiked);
            console.error("Like error", err);
        }
    };

    const toggleComments = () => {
        setShowComments(!showComments);
        if (!showComments && comments.length === 0) {
            fetchComments();
        }
    };

    const fetchComments = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/social/comments/${food._id}`, { withCredentials: true });
            setComments(res.data.comments);
        } catch (err) {
            console.error("Fetch comments error", err);
        }
    };

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;
        if (!user) {
            addToast("Please login to comment!", "info");
            return;
        }

        try {
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/social/comment`, {
                foodId: food._id,
                text: newComment
            }, { withCredentials: true });

            setComments([res.data.comment, ...comments]);
            setNewComment("");
            addToast("Comment added!", "success"); // Added toast for success
        } catch (err) {
            console.error("Add comment error", err);
            addToast("Failed to add comment.", "error"); // Added toast for error
        }
    };

    const handleAddToCart = async () => {
        if (!user) {
            addToast("Please login to add to cart", "info");
            return;
        }
        const success = await addToCart(food._id);
        if (success) {
            addToast("Added to cart! 🛒", "success");
        } else {
            addToast("Failed to add to cart. Try logging in again.", "error");
        }
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: `Check out ${food.name} on FlavorFeed!`,
                    text: food.description,
                    url: window.location.href,
                });
            } catch (err) {
                console.log('Error sharing', err);
            }
        } else {
            // Fallback
            navigator.clipboard.writeText(window.location.href);
            alert("Link copied to clipboard!");
        }
    };

    return (
        <div className="reel-card">
            <video
                ref={videoRef}
                src={food.video ? `${food.video}?tr=w-720,q-60,f-mp4` : ''}
                poster={food.image ? `${food.image}?tr=w-720,q-50,f-webp` : ''}
                className="reel-video"
                loop
                muted={false}
                playsInline
                preload="none"
                onClick={toggleComments}
            />

            {!showComments && (
                <div className="reel-overlay">
                    <div className="reel-info">
                        <h3>{food.name}</h3>
                        <p className="food-price">₹{food.price}</p>
                        <p>{food.description}</p>
                        <small>📍 {food.foodPartner?.address}</small>
                        <br />
                        <small>By {food.foodPartner?.name}</small>
                    </div>

                    <div className="reel-actions">
                        <button className="action-btn" onClick={handleLike}>
                            {isLiked ? '❤️' : '🤍'} {likes}
                        </button>
                        <button className="action-btn" onClick={toggleComments}>
                            💬 {comments.length > 0 ? comments.length : ''}
                        </button>
                        <button className="action-btn" onClick={handleShare}>
                            ↗️
                        </button>
                        <button className="buy-btn" onClick={handleAddToCart}>
                            Add to Cart 🛒
                        </button>
                    </div>
                </div>
            )}

            {/* Comments Overlay */}
            {showComments && (
                <div className="comments-overlay">
                    <div className="comments-header">
                        <h3>Comments</h3>
                        <button onClick={toggleComments}>✖️</button>
                    </div>

                    <div className="comments-list">
                        {comments.length === 0 ? <p className="no-comments">No comments yet. Be the first!</p> : (
                            comments.map(c => (
                                <div key={c._id} className="comment-item">
                                    <strong>{c.user?.fullName || "User"}</strong>
                                    <p>{c.text}</p>
                                </div>
                            ))
                        )}
                    </div>

                    <form className="comment-form" onSubmit={handleAddComment}>
                        <input
                            type="text"
                            placeholder="Add a comment..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                        />
                        <button type="submit">Post</button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default ReelCard;
