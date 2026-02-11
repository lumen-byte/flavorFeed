import express from 'express';
import { addToCart, getCart, createOrder } from '../controller/order.controller.js';
import { authUserMiddleware } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/cart', authUserMiddleware, addToCart);
router.get('/cart', authUserMiddleware, getCart);
router.post('/create', authUserMiddleware, createOrder);

export default router;
