import express from 'express';
import { addToCart, getCart, createOrder, getUserOrders } from '../controller/order.controller.js';
import { authUserMiddleware } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/cart', authUserMiddleware, addToCart);
router.get('/cart', authUserMiddleware, getCart);
router.post('/create', authUserMiddleware, createOrder);
router.get('/my-orders', authUserMiddleware, getUserOrders);

export default router;
