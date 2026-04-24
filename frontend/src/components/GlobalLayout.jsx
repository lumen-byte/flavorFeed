import React from 'react';
import Navbar from './Navbar';
import BottomNav from './BottomNav';

// CONCEPT: Global Layout Architecture
// This wrapper ensures that our routing pages (children) are always rendered securely between the top and bottom navigation bars.
// By centralizing this, we prevent z-index wars and "content hiding under fixed headers" bugs across 50 different pages.
const GlobalLayout = ({ children }) => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar />

            {/* The main content area sits between the flex items or uses global CSS padding variables */}
            {/* In FlavorFeed, we use padding-bottom globally, so we just render children here */}
            {/* If we needed strict flex-grow, this is where we'd add <main style={{flexGrow: 1}}> */}
            <main className="global-main-content" style={{ flexGrow: 1, paddingBottom: '65px' }}>
                {children}
            </main>

            <BottomNav />
        </div>
    );
};

export default GlobalLayout;
