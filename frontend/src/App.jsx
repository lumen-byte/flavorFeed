import React from 'react';
import AppRoutes from './routes/AppRoutes';
import './App.css';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ToastProvider } from './context/ToastContext';
import { LocationProvider } from './context/LocationContext';
import { FeedProvider } from './context/FeedContext';
import ErrorBoundary from './components/ErrorBoundary';
import GlobalLayout from './components/GlobalLayout';

function App() {
  return (
    <div className="app-container">
      {/* CONCEPT: Error Boundary caught exceptions don't rip down the entire React tree */}
      <ErrorBoundary>
        <AuthProvider>
          <CartProvider>
            <ToastProvider>
              <LocationProvider>
                <FeedProvider>

                  {/* CONCEPT: GlobalLayout encapsulates fixed headers so routes don't worry about safe-areas */}
                  <GlobalLayout>
                    <AppRoutes />
                  </GlobalLayout>

                </FeedProvider>
              </LocationProvider>
            </ToastProvider>
          </CartProvider>
        </AuthProvider>
      </ErrorBoundary>
    </div>
  );
}

export default App;