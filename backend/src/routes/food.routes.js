import express from 'express';
// Match your exact filename (one 'l') and use * to grab the named export
import { createFood } from '../controller/food.controler.js';
// Use curly braces {} because auth.middleware.js uses a named export
import { authFoodPartnerMiddleware } from "../middlewares/auth.middleware.js";
// import {authMiddleware} from '../middlewares/auth.middleware.js';
import multer from 'multer';

const upload  = multer({
    storage: multer.memoryStorage(),
})
const router = express.Router();

router.post('/',
    authFoodPartnerMiddleware,
    upload.single("video"), createFood
);

export default router;