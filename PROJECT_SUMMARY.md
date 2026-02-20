# FlavorFeed: Project Architecture & Interview Summary 🍔📱

## 🗣️ The "Elevator Pitch" (How to introduce your project)
"FlavorFeed is a full-stack web app that mixes the TikTok video experience with a food delivery platform like Zomato. Users scroll through a vertical video feed of food reels, and if they like something, they can order it directly. I built it using the **MERN stack** (MongoDB, Express, React, Node.js). It includes a role-based login system for Users vs. Restaurants, a real-time 'Nearby' feature to find local places, and a custom video upload system."

---

## 🏗️ Technical Architecture (Explained Simply)

### 1. Frontend (React & Vite)
*   **What it does:** It's the user interface—what people click and scroll on.
*   **How you built it:** I used React to build reusable components (like the video player and shopping cart). I used the **Context API** to manage the shopping cart state. This way, if a user adds an item to their cart on a video, the cart badge in the top Navbar updates instantly without needing to pass data through every single file.

### 2. Backend (Node.js & Express)
*   **What it does:** It's the server that handles logic, routing, and security.
*   **How you built it:** I built a REST API with Express. It handles all the requests—like when a user logs in, or when a restaurant wants to upload a new reel. It uses **JWT (JSON Web Tokens)** saved in secure cookies to keep users logged in.

### 3. Database (MongoDB)
*   **What it does:** It stores all the permanent data (users, restaurants, orders).
*   **How you built it:** I chose MongoDB because it's flexible and stores data in a JSON-like format. The coolest part is the **Geospatial feature**. I save the restaurant's latitude and longitude, and when a user clicks the "Nearby" feed, MongoDB mathematically calculates which restaurants are within 10km and sends only those back to the user.

### 4. Video Storage (Cloudinary)
*   **What it does:** It hosts the actual video files so they load fast.
*   **How you built it:** I don't save video files directly in my own database because it would crash my server. Instead, when a restaurant uploads a video, my backend sends it straight to **Cloudinary** (a cloud media host). Cloudinary compresses the video so it loads faster, and gives me back a short URL link, which I save in MongoDB.

---

## 🐛 Bug Fixes to Talk About in an Interview
*Interviewers always ask "Tell me about a bug you fixed." Use these two stories:*

### Story 1: The "Too Many Requests" Video Error
*   **The Problem:** When building the video feed, I got a `429 Too Many Requests` error. The app was using too much network bandwidth because every video was trying to download at the exact same time when the page loaded.
*   **The Solution:** I fixed this by adding `preload="none"` to the HTML video tags on the frontend. This stops the videos from downloading data *until* the user actually scrolls to them and they start playing. I also told my backend to compress videos to 60% quality when restaurants upload them. This completely fixed the crashing.

### Story 2: The Login Cookie Collision
*   **The Problem:** At one point, uploading videos started failing with a `500 Internal Server Error`. The server was saying the restaurant didn't exist, even though I was logged in.
*   **The Solution:** I realized that both the standard User login and the Restaurant login were saving their JWT session under the exact same cookie name (`token`). If I logged in as a User, it overwrote my Restaurant cookie! I fixed it by renaming the restaurant cookie to `partner_token` and updating my security middleware to check for the distinct names.
