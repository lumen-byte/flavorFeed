import express from 'express';
import { likeReel, addComment, getComments } from '../controller/social.controller.js';
import { authUserMiddleware } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/like', authUserMiddleware, likeReel);
router.post('/comment', authUserMiddleware, addComment);
router.get('/comments/:foodId', getComments);

export default router;
