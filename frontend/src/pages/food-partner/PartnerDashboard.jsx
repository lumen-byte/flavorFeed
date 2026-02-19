import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';
import '../../styles/PartnerDashboard.css'; // We'll create this

const PartnerDashboard = () => {
    const [foodItems, setFoodItems] = useState([]);
    const navigate = useNavigate();

    const { addToast } = useToast();

    // Ideally we should have a usePartnerAuth or similar, but for now we rely on the cookie
    // and maybe a simple check.

    useEffect(() => {
        fetchMyFood();
    }, []);

    const fetchMyFood = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/food/partner/me', {
                withCredentials: true
            });
            setFoodItems(response.data.foodItems);
        } catch (err) {
            console.error("Failed to fetch food", err);
            // If 401, redirect to login
            if (err.response?.status === 401) {
                navigate('/food-partner/login');
            }
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this reel?")) return;

        try {
            await axios.delete(`http://localhost:3000/api/food/${id}`, {
                withCredentials: true
            });
            // Remove from state
            setFoodItems(prev => prev.filter(item => item._id !== id));
            addToast("Reel deleted successfully! 🗑️", "success");
        } catch (err) {
            console.error("Delete failed", err);
            addToast("Failed to delete reel", "error");
        }
    };

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <h2>Partner Dashboard 👨‍🍳</h2>
                <button className="add-btn" onClick={() => navigate('/create-food')}>
                    + Upload New Reel
                </button>
            </header>

            <div className="stats-container">
                <div className="stat-card">
                    <h3>Total Reels</h3>
                    <p>{foodItems.length}</p>
                </div>
                {/* Add more stats later */}
            </div>

            <h3>My Reels</h3>
            <div className="food-grid">
                {foodItems.length === 0 ? (
                    <p>No reels uploaded yet.</p>
                ) : (
                    foodItems.map(item => (
                        <div key={item._id} className="dashboard-food-card">
                            <video
                                src={item.video}
                                className="dashboard-video"
                                controls
                                muted={false}
                            />
                            <div className="food-info">
                                <h4>{item.name}</h4>
                                <p className="price-tag">₹{item.price}</p>
                                <p>{item.description}</p>
                            </div>
                            <div className="card-actions">
                                <button
                                    className="edit-btn"
                                    onClick={() => navigate(`/partner/edit-food/${item._id}`)} // We need to add this route
                                >
                                    ✏️ Edit
                                </button>
                                <button
                                    className="delete-btn"
                                    onClick={() => handleDelete(item._id)}
                                >
                                    🗑️ Delete
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default PartnerDashboard;
