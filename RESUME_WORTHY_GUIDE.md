# Resume Worthy Enhancements & Edge Cases Guide

To make your **FlavorFeed** project truly stand out on a resume, you need to handle "Production-Ready" scenarios. Here are the key edge cases and advanced features to implement:

## 1. Security & Performance (Crucial for Senior Roles)
- **Rate Limiting**: Prevent one user from spamming likes or comments API. Use `express-rate-limit`.
- **Input Sanitization**: Ensure comments don't contain XSS scripts.
- **Lazy Loading**: Don't load all videos at once. Your `Feed.jsx` does this with `ReelCard` logic, but ensure `video` tag uses `loading="lazy"` equivalent or IntersectionObserver to only load source when close to viewport.
- **Video Compression**: Users upload huge files. Use `ffmpeg` on backend to compress and resize videos to 720p/1080p.

## 2. Advanced E-commerce Logic
- **Stock/Inventory Management**:
  - *Edge Case*: Two users buy the last item at the same time.
  - *Fix*: Use Database Transactions (MongoDB Sessions) to decrement stock atomically.
- **Delivery Zone Validation**:
  - *Edge Case*: User orders from a restaurant 500km away.
  - *Fix*: strictly enforce `maxDistance` in backend validation before order creation.
- **Cart Sync**:
  - *Edge Case*: User adds to cart on Mobile, then opens Desktop. Cart should sync. (We partially supported this by adding `cart` to User model, but ensure logic merges local + DB cart).

## 3. Robust Authentication
- **Session Expiry**: Handle 401 errors gracefully. If token expires, auto-logout or refresh token (Access + Refresh Token pattern).
- **Email Verification**: Don't allow fake emails. Send strict verification OTPs.

## 4. User Experience (UX) Polish
- **Skeleton Screens**: Show gray placeholders while feed/profile is loading instead of spinners.
- **Optimistic UI**: (Implemented for Likes!) Apply this to Comments too. Show comment immediately locally while it sends to server in background. Retry if fails.
- **Infinite Scroll Restoration**: If user clicks a profile then goes "Back", they should be at the same scroll position in Feed.

## 5. Social & Discovery
- **Hashtags**: Parse description for `#burger`. Make hashtags clickable to search.
- **Trending Algorithm**: Instead of random shuffle, score reels by `(likes * 2) + comments + (recency_score)`.

## 6. Payment Integration
- **Webhooks**: Don't trust client-side "Payment Successful". Wait for Stripe/Razorpay Webhook verification on backend to mark Order as "Paid".

## Recommended Next Steps for You:
1.  **Video Optimization**: It's the #1 issue in reel apps. Implement a transform step.
2.  **Payment Gateway**: Replace "Cash on Delivery" with a real test mode Payment Gateway (Stripe).
3.  **Deploy**: A live link is worth 1000 screenshots. Deploy to Vercel (Frontend) and Render/Railway (Backend).
