import app from './app.js';
import connectDB from './db/db.js';
import dotenv from 'dotenv';
import http from 'http';
import { initializeSocket } from './socket.js';

dotenv.config();
const PORT = process.env.PORT || 3000;

// Connect to Database
connectDB();

let server;
let io;

if (!process.env.VERCEL) {
    // Only initialize Socket.io and Listen on a port if NOT on Vercel
    server = http.createServer(app);
    io = initializeSocket(server);
    
    server.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

// For Vercel, we just export the app
export default app;