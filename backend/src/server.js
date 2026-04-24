import app from './app.js';
import connectDB from './db/db.js';
import dotenv from 'dotenv';
import http from 'http';
import { initializeSocket } from './socket.js';
dotenv.config();
const PORT = process.env.PORT || 3000;

connectDB();

const server = http.createServer(app);
export const io = initializeSocket(server);

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});