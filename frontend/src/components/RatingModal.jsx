import React, { useState } from 'react';
import axios from 'axios';
import { useToast } from '../context/ToastContext';
import '../styles/RatingModal.css';

const RatingModal = ({ isOpen, onClose, orderId, foodPartnerName, onRatingSuccess }) => {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [reviewText, setReviewText] = useState('');
    const [loading, setLoading] = useState(false);
    const { addToast } = useToast();

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (rating === 0) {
            addToast("Please select a star rating", "info");
            return;
        }

        setLoading(true);
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/order/rate`, {
                orderId,
                rating,
                reviewText
            }, { withCredentials: true });

            addToast("Thank you for your feedback! 🌟", "success");
            onRatingSuccess(); // Refresh orders or update UI
            onClose();
        } catch (err) {
            console.error(err);
            addToast(err.response?.data?.message || "Failed to submit rating", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content rating-modal" onClick={(e) => e.stopPropagation()}>
                <h3>Rate your order from</h3>
                <h4 className="partner-name-highlight">{foodPartnerName}</h4>

                <div className="stars-container">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <span
                            key={star}
                            className={`star ${star <= (hoverRating || rating) ? 'filled' : ''}`}
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                        >
                            ★
                        </span>
                    ))}
                </div>

                <form onSubmit={handleSubmit} className="rating-form">
                    <textarea
                        placeholder="Leave a review (optional)..."
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        rows="3"
                    />

                    <div className="modal-actions">
                        <button type="button" className="cancel-btn" onClick={onClose} disabled={loading}>
                            Cancel
                        </button>
                        <button type="submit" className="confirm-btn" disabled={loading}>
                            {loading ? 'Submitting...' : 'Submit Rating'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RatingModal;
