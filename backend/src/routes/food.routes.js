import express from 'express';
import { createFood } from '../controller/food.controler.js';
import { authFoodPartnerMiddleware , authUserMiddleware} from "../middlewares/auth.middleware.js";
// import { authUserMiddleware } from '../middlewares/auth.middleware.js';
// import foodController from '../controller/food.controler.js';
import { getFoodItems } from '../controller/food.controler.js';
import multer from 'multer';

const upload  = multer({
    storage: multer.memoryStorage(),
})
const router = express.Router();

router.post('/',
    authFoodPartnerMiddleware,
    upload.single("video"), createFood
);
router.get("/", getFoodItems);
export default router;