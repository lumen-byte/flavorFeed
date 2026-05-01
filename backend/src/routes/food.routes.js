import express from 'express';
import { createFood } from '../controller/food.controler.js';
import { authFoodPartnerMiddleware, authUserMiddleware } from "../middlewares/auth.middleware.js";
// import { authUserMiddleware } from '../middlewares/auth.middleware.js';
// import foodController from '../controller/food.controler.js';
import { getFoodItems, getPartnerFoodItems, deleteFood, updateFood } from '../controller/food.controler.js';
import multer from 'multer';

const upload = multer({
    storage: multer.memoryStorage(),
})
const router = express.Router();

router.post('/',
    authFoodPartnerMiddleware,
    upload.fields([
        { name: 'video', maxCount: 1 },
        { name: 'thumbnail', maxCount: 1 }
    ]),
    createFood
);
router.get('/partner/me', authFoodPartnerMiddleware, getPartnerFoodItems);
router.delete('/:id', authFoodPartnerMiddleware, deleteFood);
router.put('/:id', authFoodPartnerMiddleware, updateFood);
router.get("/", getFoodItems);
export default router;