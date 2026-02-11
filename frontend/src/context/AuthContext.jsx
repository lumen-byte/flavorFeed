import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user is logged in (e.g. check local storage or hit /me endpoint)
        // For MVP, we'll try to persist via localStorage for now or rely on cookies + a verify endpoint.
        // Let's assume we store user info in localStorage for simplicity in this pass, 
        // or better, hit an endpoint if cookies are HttpOnly.
        // Given backend uses cookies, we should hit a /me endpoint or just check localStorage if we saved there.
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const res = await axios.post('http://localhost:3000/api/auth/user/login', { email, password }, { withCredentials: true });
            setUser(res.data.user); // Assuming API returns { user: ... }
            localStorage.setItem('user', JSON.stringify(res.data.user));
            return res.data;
        } catch (err) {
            throw err;
        }
    };

    const register = async (userData) => {
        try {
            const res = await axios.post('http://localhost:3000/api/auth/user/register', userData, { withCredentials: true });
            // Automatic login or redirect?
            return res.data;
        } catch (err) {
            throw err;
        }
    }

    const logout = () => {
        // axios.post('/api/auth/logout') ...
        setUser(null);
        localStorage.removeItem('user');
    };

    const value = {
        user,
        login,
        register,
        logout,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
