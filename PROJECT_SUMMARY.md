# FlavorFeed Implementation Walkthrough 🍔

## 1. Project Setup
-   **Structure**:
    -   `frontend/`: React + Vite
    -   `backend/`: Node.js + Express + MongoDB
-   **Key Dependencies**:
    -   `axios`, `react-router-dom`, `react-icons`
    -   `mongoose`, `jsonwebtoken`, `multer`, `cors`

## 2. Features Implemented

### User Features
-   **Feed**:
    -   **"For You"**: Scroll through all delicious food reels.
    -   **"Nearby"**: Toggle to see food available near your location (Geospatial queries!).
-   **Cart**:
    -   **Multi-Restaurant Support**: Order from different places.
    -   **Delivery Fee**: Fixed fee (₹40) applied *per restaurant*.
    -   **Toast Notifications**: Smooth "Added to Cart" popups instead of alerts.
-   **Profile**:
    -   View **Order History**.
    -   **Logout** functionality.
-   **Navbar**:
    -   Shows **Live Location** (Lat/Long).
    -   Cart Badge & Profile Icon.

### Partner Features
-   **Dashboard**:
    -   Manage uploaded reels.
    -   **Edit**: Update price, name, description.
    -   **Delete**: Remove old or sold-out items.
-   **Upload**:
    -   Upload video reels with price and description.

## 3. Verification & Testing

### User Flow
1.  **Login** as User.
2.  Enable **Location** in browser.
3.  Toggle **"Nearby"** on Feed to see local results.
4.  Add items to **Cart**. Verify Toast appears.
5.  Go to **Cart** -> **Checkout**. Check breakdown.
6.  Go to **Profile** to see the new order in history.

### Partner Flow
1.  **Login** as Partner.
2.  Go to **Dashboard**.
3.  **Edit** a reel's price.
4.  **Delete** a reel.

## 4. Tech Highlights
-   **MongoDB Geospatial Queries**: `$near` operator for location-based feed.
-   **Context API**: `CartContext`, `AuthContext`, `LocationContext` for global state.
-   **JWT Auth**: Secure cookie-based authentication.
