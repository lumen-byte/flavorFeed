import express from 'express';
import { registerUser, loginUser , logoutUser , loginFoodPartner ,logoutFoodPartner ,registerFoodPartner } from '../controller/auth.controller.js';



const router = express.Router();

router.post('/user/register', registerUser);
router.post('/user/login', loginUser);
router.post('/user/logout',logoutUser);


//food partner
router.post('/food-partner/register', registerFoodPartner);
router.post('/food-partner/login', loginFoodPartner);
router.post('/food-partner/logout',logoutFoodPartner);
export default router;

