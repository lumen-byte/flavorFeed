import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../../styles/UserProfile.css';

const UserProfile = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        fetchOrders();
    }, [user]);

    const fetchOrders = async () => {
        try {
            const res = await axios.get('http://localhost:3000/api/order/my-orders', { withCredentials: true });
            setOrders(res.data.orders);
        } catch (err) {
            console.error("Failed to fetch orders", err);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logout(); // Assuming logout clears cookie/state
        navigate('/login');
    };

    if (loading) return <div className="loading">Loading profile...</div>;

    return (
        <div className="profile-container">
            <div className="profile-header">
                <div className="profile-info">
                    <h2>{user?.fullName}</h2>
                    <p>{user?.email}</p>
                </div>
                <button onClick={handleLogout} className="logout-btn">Logout 🚪</button>
            </div>

            <div className="orders-section">
                <h3>📜 Previous Orders</h3>
                {orders.length === 0 ? (
                    <p>No orders yet. Go eat something! 🍔</p>
                ) : (
                    <div className="orders-list">
                        {orders.map(order => (
                            <div key={order._id} className="order-card">
                                <div className="order-header">
                                    <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                                    <span className="order-status">{order.status}</span>
                                </div>
                                <div className="order-restaurant">
                                    <strong>{order.foodPartner?.name}</strong>
                                    <p>{order.foodPartner?.address}</p>
                                </div>
                                <div className="order-items">
                                    {order.items.map((item, idx) => (
                                        <div key={idx} className="order-item">
                                            <span>{item.quantity}x {item.foodId?.name}</span>
                                            <span>₹{item.price * item.quantity}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="order-total">
                                    <strong>Total: ₹{order.totalAmount}</strong>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserProfile;
