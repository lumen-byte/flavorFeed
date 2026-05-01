import React from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import BottomNav from './BottomNav';

const GlobalLayout = ({ children }) => {
    const location = useLocation();
    const isFeedPage = location.pathname === '/';

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar />

            <main 
                className="global-main-content" 
                style={{ 
                    flexGrow: 1, 
                    paddingTop: isFeedPage ? '0' : '60px' // Only reels go behind the navbar
                }}
            >
                {children}
            </main>

            <BottomNav />
        </div>
    );
};

export default GlobalLayout;
