import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../styles/CreateFood.css'; // Reusing styles

import { useToast } from '../../context/ToastContext';

const EditFood = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToast } = useToast();
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: ''
    });
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchFoodDetails();
    }, [id]);

    const fetchFoodDetails = async () => {
        try {
            // We can fetch from partner/me and filter, or use a new GET /api/food/:id
            // For simplicity/security, let's fetch all partner foods and find the one.
            // Or better, add GET /api/food/:id to backend if not exists, but we have getFoodItems.
            // We can just use the partner/me endpoint I made.
            const response = await axios.get('http://localhost:3000/api/food/partner/me', {
                withCredentials: true
            });
            const food = response.data.foodItems.find(f => f._id === id);

            if (food) {
                setFormData({
                    name: food.name,
                    description: food.description,
                    price: food.price
                });
            } else {
                addToast("Food not found!", "error");
                navigate('/food-partner/dashboard');
            }
        } catch (err) {
            console.error("Failed to fetch details", err);
            addToast("Error loading food details", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await axios.put(`http://localhost:3000/api/food/${id}`, formData, {
                withCredentials: true
            });
            addToast("Food updated successfully! ✅", "success");
            navigate('/food-partner/dashboard');
        } catch (err) {
            console.error("Update failed", err);
            addToast("Failed to update food", "error");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div style={{ color: 'white', padding: '20px' }}>Loading...</div>;

    return (
        <div className="create-food-container">
            <div className="create-food-card">
                <h2>Edit Reel ✏️</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Food Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Price (₹)</label>
                        <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Description (Hashtags etc.)</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button type="submit" className="upload-btn" disabled={submitting}>
                        {submitting ? "Updating..." : "Update Details"}
                    </button>

                    <button
                        type="button"
                        className="cancel-btn"
                        onClick={() => navigate('/food-partner/dashboard')}
                        style={{ marginTop: '10px', background: '#555', width: '100%', padding: '10px', border: 'none', borderRadius: '5px', color: 'white', cursor: 'pointer' }}
                    >
                        Cancel
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditFood;
