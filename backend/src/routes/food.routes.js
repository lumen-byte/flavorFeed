import express from 'express';
// Match your exact filename (one 'l') and use * to grab the named export
import foodControler from '../controller/food.controler.js';
// Use curly braces {} because auth.middleware.js uses a named export
import { authFoodPartnerMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

// 1. Ensure it is .post (not .postt)
// 2. Use the correct middleware function name
router.post("/", authFoodPartnerMiddleware, foodControler.createFood);

export default router;