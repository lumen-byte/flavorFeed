import React, { useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';
import '../../styles/Cart.css'; // We'll create this

const Cart = () => {
    const { cart, fetchCart } = useCart();
    const navigate = useNavigate();

    useEffect(() => {
        fetchCart();
    }, []);

    // Mock price
    const ITEM_PRICE = 100;
    const total = cart.reduce((acc, item) => acc + (item.quantity * ITEM_PRICE), 0);

    return (
        <div className="cart-page">
            <h2>Your Cart 🛒</h2>
            {cart.length === 0 ? (
                <div className="empty-cart">
                    <p>Your cart is empty.</p>
                    <button onClick={() => navigate('/')}>Go Eat!</button>
                </div>
            ) : (
                <div className="cart-items">
                    {cart.map((item) => (
                        <div key={item._id} className="cart-item">
                            <div className="item-info">
                                <h3>{item.foodId?.name || "Loading..."}</h3>
                                <p>Qty: {item.quantity}</p>
                                <p>Price: ₹{item.quantity * ITEM_PRICE}</p>
                            </div>
                        </div>
                    ))}
                    <div className="cart-summary">
                        <h3>Total: ₹{total}</h3>
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
