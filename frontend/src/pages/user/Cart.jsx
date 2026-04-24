import React, { useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';
import EmptyState from '../../components/EmptyState';
import '../../styles/Cart.css'; // We'll create this

const Cart = () => {
    const { cart, loadingCart, fetchCart } = useCart();
    const navigate = useNavigate();

    useEffect(() => {
        fetchCart();
    }, []);

    // Group items by Restaurant, memoized for performance
    const { groupedItems, subtotal, grandTotal, totalDeliveryFee } = React.useMemo(() => {
        const grouped = cart.reduce((acc, item) => {
            const partnerName = item.foodId?.foodPartner?.name || "Unknown Restaurant";
            const partnerId = item.foodId?.foodPartner?._id || "unknown";

            if (!acc[partnerId]) {
                acc[partnerId] = {
                    name: partnerName,
                    items: [],
                    subtotal: 0
                };
            }

            const price = item.foodId?.price || 0;
            const itemTotal = price * item.quantity;

            acc[partnerId].items.push(item);
            acc[partnerId].subtotal += itemTotal;

            return acc;
        }, {});

        const DELIVERY_FEE = 40;
        const totalDelFee = Object.keys(grouped).length * DELIVERY_FEE;
        const sub = cart.reduce((acc, item) => acc + (item.quantity * (item.foodId?.price || 0)), 0);
        const grand = sub + totalDelFee;

        return { groupedItems: grouped, subtotal: sub, grandTotal: grand, totalDeliveryFee: totalDelFee };
    }, [cart]);

    const DELIVERY_FEE_PER_RESTAURANT = 40;

    if (loadingCart) {
        return (
            <div className="cart-page">
                <h2>Your Cart 🛒</h2>
                <div style={{ textAlign: 'center', padding: '50px', color: '#fff' }}>
                    Loading cart items...
                </div>
            </div>
        );
    }

    return (
        <div className="cart-page">
            <h2>Your Cart 🛒</h2>
            {cart.length === 0 ? (
                <EmptyState
                    icon="🛒"
                    title="Your cart is empty"
                    subtitle="Looks like you haven't added any delicious food yet."
                    actionText="Browse Restaurants"
                    actionLink="/"
                />
            ) : (
                <div className="cart-container">
                    <div className="cart-groups">
                        {Object.entries(groupedItems).map(([partnerId, group]) => (
                            <div key={partnerId} className="restaurant-group">
                                <div className="group-header">
                                    <h3>🍽️ {group.name}</h3>
                                </div>
                                {group.items.map((item) => (
                                    <div key={item._id} className="cart-item">
                                        <div className="item-details">
                                            <h4>{item.foodId?.name || "Loading..."}</h4>
                                            <p className="item-price">₹{item.foodId?.price}</p>
                                        </div>
                                        <div className="item-actions">
                                            <span>Qty: {item.quantity}</span>
                                            <span className="item-total">₹{item.quantity * (item.foodId?.price || 0)}</span>
                                        </div>
                                    </div>
                                ))}
                                <div className="group-footer">
                                    <p>Subtotal: ₹{group.subtotal}</p>
                                    <p className="delivery-fee">Delivery Fee: ₹{DELIVERY_FEE_PER_RESTAURANT}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="cart-summary-card">
                        <h3>Order Summary</h3>
                        <div className="summary-row">
                            <span>Item Total</span>
                            <span>₹{subtotal}</span>
                        </div>
                        <div className="summary-row">
                            <span>Delivery Fees</span>
                            <span>+ ₹{totalDeliveryFee}</span>
                        </div>
                        <hr />
                        <div className="summary-row total">
                            <span>To Pay</span>
                            <span>₹{grandTotal}</span>
                        </div>
                        <button className="checkout-btn" onClick={() => navigate('/checkout')}>
                            Proceed to Checkout
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cart;
