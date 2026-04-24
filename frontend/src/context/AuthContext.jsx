import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

import { connectSocket, disconnectSocket } from '../services/socket';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('token');
        if (storedUser && storedToken) {
            setUser(JSON.parse(storedUser));
            connectSocket();
        } else {
            localStorage.removeItem('user');
            localStorage.removeItem('token');
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/user/login`, { email, password }, { withCredentials: true });
            setUser(res.data.user); // Assuming API returns { user: ... }
            localStorage.setItem('user', JSON.stringify(res.data.user));
            if (res.data.token) {
                localStorage.setItem('token', res.data.token);
                connectSocket();
            }
            return res.data;
        } catch (err) {
            throw err;
        }
    };

    const register = async (userData) => {
        try {
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/user/register`, userData, { withCredentials: true });
            if (res.data.token) {
                localStorage.setItem('token', res.data.token);
                localStorage.setItem('user', JSON.stringify(res.data.user));
                setUser(res.data.user);
                connectSocket();
            }
            return res.data;
        } catch (err) {
            throw err;
        }
    }

    const logout = () => {
        // axios.post('/api/auth/logout') ...
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        disconnectSocket();
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
