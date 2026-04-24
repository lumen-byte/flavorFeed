import express from 'express';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.routes.js';
import foodRoutes from './routes/food.routes.js';
import socialRoutes from './routes/social.routes.js';
import orderRoutes from './routes/order.routes.js';
import chatRoutes from './routes/chat.routes.js';
import cors from 'cors';

const app = express();

app.use(cors({
    origin: function(origin, callback) {
        // Allow all origins directly
        callback(null, true);
    },
    credentials: true,
}))
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/food', foodRoutes);
app.use('/api/social', socialRoutes);
app.use('/api/order', orderRoutes);
app.use('/api/conversations', chatRoutes);

app.get('/', (req, res) => {
    res.send('Hello from the backend server!');
});

export default app;