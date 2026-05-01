import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../styles/CreateFood.css'; // We'll create this

const CreateFood = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData();
        formData.append('name', e.target.name.value);
        formData.append('price', e.target.price.value);
        formData.append('description', e.target.description.value);
        formData.append('video', e.target.video.files[0]);
        if (e.target.thumbnail.files[0]) {
            formData.append('thumbnail', e.target.thumbnail.files[0]);
        }

        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/food`, formData, {
                withCredentials: true,
                // Removed manual Content-Type as per best practices
            });
            alert("Reel uploaded successfully! 🎥");
            navigate('/food-partner/dashboard');
        } catch (err) {
            console.error("Upload failed:", err.response?.data || err.message);
            alert(`Failed to upload reel: ${err.response?.data?.message || err.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="create-food-page animate-fade-up">
            <div className="create-card">
                <div className="auth-logo">FlavorFeed</div>
                <h2>New Reel</h2>
                <p className="ff-meta">Share your culinary creations with the world</p>

                <form onSubmit={handleSubmit} encType="multipart/form-data">
                    <div className="form-group">
                        <label>Food Name</label>
                        <input name="name" type="text" placeholder="e.g. Truffle Mac & Cheese" required />
                    </div>

                    <div className="form-group">
                        <label>Price (₹)</label>
                        <input name="price" type="number" placeholder="199" min="1" required />
                    </div>

                    <div className="form-group">
                        <label>Description & Hashtags</label>
                        <textarea 
                            name="description" 
                            placeholder="Tell a story... #foodie #yummy" 
                            rows="4"
                            required 
                        />
                    </div>

                    <div className="form-group">
                        <label>Video Reel (Required)</label>
                        <div className="file-input-wrapper">
                            <input name="video" type="file" accept="video/*" required />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Thumbnail (Optional)</label>
                        <p className="ff-meta" style={{ marginBottom: '8px' }}>If left empty, we'll capture a frame at 2s</p>
                        <div className="file-input-wrapper">
                            <input name="thumbnail" type="file" accept="image/*" />
                        </div>
                    </div>

                    <button type="submit" className="auth-btn" disabled={loading}>
                        {loading ? "Uploading..." : "Share Reel"}
                    </button>
                    
                    <button 
                        type="button" 
                        className="btn-ghost" 
                        style={{ width: '100%', marginTop: '12px' }}
                        onClick={() => navigate('/food-partner/dashboard')}
                    >
                        Cancel
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateFood;
