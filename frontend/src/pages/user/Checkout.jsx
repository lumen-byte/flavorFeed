import React, { useState } from 'react';
import axios from 'axios';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';
import '../../styles/Checkout.css'; // We'll create this

const Checkout = () => {
    const { cart, fetchCart } = useCart();
    const navigate = useNavigate();
    const [address, setAddress] = useState('');
    const [loading, setLoading] = useState(false);

    if (cart.length === 0) {
        navigate('/cart');
        return null;
    }

    const handleOrder = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Mock location for order
            const location = {
                type: "Point",
                coordinates: [0, 0] // Mock coordinates, ideally we get from map
            };

            await axios.post('http://localhost:3000/api/order/create', {
                address,
                location
            }, { withCredentials: true });

            alert("Order Placed Successfully! 🍔");
            fetchCart(); // Clear cart in context
            navigate('/');
        } catch (err) {
            console.error("Order failed", err);
            alert("Failed to place order. " + (err.response?.data?.message || ""));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="checkout-page">
            <h2>Checkout</h2>
            <form onSubmit={handleOrder} className="checkout-form">
                <div className="form-group">
                    <label>Delivery Address</label>
                    <textarea
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        required
                        placeholder="Enter your full address..."
                    />
                </div>
                <div className="order-summary">
                    <h3>Order Breakdown</h3>
                    {/* Calculate totals again or pass via state (re-calculating for safety) */}
                    {(() => {
                        // Grouping Logic Replicated
                        // In a real app, pass this from Cart via location.state or Context
                        const groupedItems = cart.reduce((acc, item) => {
                            const partnerId = item.foodId?.foodPartner?._id || "unknown";
                            if (!acc[partnerId]) acc[partnerId] = 0;
                            acc[partnerId]++;
                            return acc;
                        }, {});

                        const DELIVERY_FEE_PER_RESTAURANT = 40;
                        const totalDeliveryFee = Object.keys(groupedItems).length * DELIVERY_FEE_PER_RESTAURANT;
                        const subtotal = cart.reduce((acc, item) => acc + (item.quantity * (item.foodId?.price || 0)), 0);
                        const grandTotal = subtotal + totalDeliveryFee;

                        return (
                            <>
                                <div className="summary-row">
                                    <span>Item Total:</span>
                                    <span>₹{subtotal}</span>
                                </div>
                                <div className="summary-row">
                                    <span>Delivery Fees ({Object.keys(groupedItems).length} restaurants):</span>
                                    <span>₹{totalDeliveryFee}</span>
                                </div>
                                <hr style={{ borderColor: '#333', margin: '10px 0' }} />
                                <h3>Total to Pay: ₹{grandTotal}</h3>
                            </>
                        );
                    })()}
                </div>
                <button type="submit" className="place-order-btn" disabled={loading}>
                    {loading ? "Placing Order..." : "Place Order via Cash on Delivery"}
                </button>
            </form>
        </div>
    );
};

export default Checkout;
