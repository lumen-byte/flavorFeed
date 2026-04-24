import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div style={{ color: 'white', padding: '20px', textAlign: 'center' }}>Loading...</div>;
    }

    return user ? <Outlet /> : <Navigate to="/user/login" replace />;
};

export default PrivateRoute;
