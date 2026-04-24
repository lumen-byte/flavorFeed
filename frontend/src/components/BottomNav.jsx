import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import '../styles/BottomNav.css';

// CONCEPT: Bottom Navigation
// This component provides quick access to core features (Home, Search, Cart)
// from the bottom of the screen, mimicking professional mobile apps like Swiggy.
// It uses `position: fixed; bottom: 0;` to stay visible while the user scrolls through reels.

const BottomNav = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { cart } = useCart();

    // CONCEPT: CSS Keyframes & Triggering Animations
    // We watch the `cart.length` property. Whenever it changes (meaning an item was added),
    // we quickly snap `isAnimating` to true, which attaches a CSS class `.bounce` to the Cart Icon.
    // After 300ms (the duration of the animation), we remove the class so it can trigger again next time.
    const [isAnimating, setIsAnimating] = React.useState(false);

    React.useEffect(() => {
        if (cart.length > 0) {
            setIsAnimating(true);
            const timer = setTimeout(() => setIsAnimating(false), 300);
            return () => clearTimeout(timer);
        }
    }, [cart.length]);

    // Helper function to check if a tab is currently active based on the URL
    const isActive = (path) => location.pathname === path;

    return (
        <div className="bottom-nav">
            {/* Home Tab */}
            <div
                className={`nav-item ${isActive('/') ? 'active' : ''}`}
                onClick={() => navigate('/')}
            >
                <div className="nav-icon">🏠</div>
                <span>Home</span>
            </div>

            {/* Search Tab (Placeholder for future feature) */}
            <div
                className={`nav-item ${isActive('/search') ? 'active' : ''}`}
                onClick={() => navigate('/search')}
            >
                <div className="nav-icon">🔍</div>
                <span>Search</span>
            </div>

            {/* Cart Tab */}
            <div
                className={`nav-item ${isActive('/cart') ? 'active' : ''}`}
                onClick={() => navigate('/cart')}
            >
                <div className={`nav-icon cart-icon-container ${isAnimating ? 'bounce' : ''}`}>
                    🛒
                    {/* // WHY: We only show the badge if there's an item in the cart to keep the UI clean */}
                    {cart.length > 0 && <span className="bottom-cart-badge">{cart.length}</span>}
                </div>
                <span>Cart</span>
            </div>
        </div>
    );
};

export default BottomNav;
