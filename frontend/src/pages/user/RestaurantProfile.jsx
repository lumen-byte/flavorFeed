import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import EmptyState from '../../components/EmptyState';
import '../../styles/UserProfile.css'; // Just reuse some basic container styles for now

const RestaurantProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    return (
        <div className="profile-container" style={{ textAlign: 'center', paddingTop: '40px' }}>
            <button
                onClick={() => navigate(-1)}
                style={{
                    background: 'var(--primary)',
                    color: 'white',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '20px',
                    marginBottom: '20px',
                    cursor: 'pointer'
                }}
            >
                ← Back
            </button>
            <EmptyState
                icon="🏗️"
                title="Restaurant Profile Coming Soon!"
                subtitle={`We are building the dedicated page for restaurant ID: ${id} in Phase 3.`}
            />
        </div>
    );
};

export default RestaurantProfile;
