import React from 'react';
import AppRoutes from './routes/AppRoutes';
import './App.css';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ToastProvider } from './context/ToastContext';
import { LocationProvider } from './context/LocationContext';
import Navbar from './components/Navbar';

function App() {
  return (
    <div className="app-container">
      <AuthProvider>
        <CartProvider>
          <ToastProvider>
            <LocationProvider>
              <Navbar />
              <AppRoutes />
            </LocationProvider>
          </ToastProvider>
        </CartProvider>
      </AuthProvider>
    </div>
  );
}

export default App;