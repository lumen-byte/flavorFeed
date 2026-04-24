import express from 'express';
import { likeReel, addComment, getComments, toggleSaveReel, toggleSaveRestaurant, getSavedItems } from '../controller/social.controller.js';
import { authUserMiddleware } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/like', authUserMiddleware, likeReel);
router.post('/comment', authUserMiddleware, addComment);
router.get('/comments/:foodId', getComments);

// Save / Bookmark routes
router.post('/save/reel', authUserMiddleware, toggleSaveReel);
router.post('/save/restaurant', authUserMiddleware, toggleSaveRestaurant);
router.get('/saved', authUserMiddleware, getSavedItems);

export default router;
