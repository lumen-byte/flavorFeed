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

        try {
            await axios.post('http://localhost:3000/api/food', formData, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            alert("Reel uploaded successfully! 🎥");
            navigate('/food-partner/dashboard');
        } catch (err) {
            console.error("Upload failed", err);
            alert("Failed to upload reel.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="create-food-page">
            <div className="create-card">
                <h2>Upload New Reel 🎬</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Food Name</label>
                        <input name="name" type="text" placeholder="Delicious Burger" required />
                    </div>

                    <div className="form-group">
                        <label>Price (₹)</label>
                        <input name="price" type="number" placeholder="150" min="1" required />
                    </div>

                    <div className="form-group">
                        <label>Description</label>
                        <textarea name="description" placeholder="Describe the ingredients..." required />
                    </div>

                    <div className="form-group">
                        <label>Video</label>
                        <input name="video" type="file" accept="video/*" required />
                    </div>

                    <button type="submit" className="upload-btn" disabled={loading}>
                        {loading ? "Uploading..." : "Upload Reel"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateFood;
