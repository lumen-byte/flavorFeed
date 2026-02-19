import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const { user } = useAuth();

    // Fetch cart from backend when user logs in
    useEffect(() => {
        if (user) {
            fetchCart();
        } else {
            setCart([]);
        }
    }, [user]);

    const fetchCart = async () => {
        try {
            const res = await axios.get('http://localhost:3000/api/order/cart', { withCredentials: true });
            setCart(res.data.cart);
        } catch (err) {
            console.error("Failed to fetch cart", err);
        }
    };

    const addToCart = async (foodId, quantity = 1) => {
        if (!user) {
            return false;
        }
        try {
            const res = await axios.post('http://localhost:3000/api/order/cart',
                { foodId, quantity },
                { withCredentials: true }
            );
            setCart(res.data.cart);
            return true;
        } catch (err) {
            console.error("Error adding to cart", err);
            return false;
        }
    };

    const value = {
        cart,
        addToCart,
        fetchCart
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};
