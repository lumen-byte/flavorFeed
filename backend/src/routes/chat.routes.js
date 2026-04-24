import express from 'express';
import { authUserMiddleware } from '../middlewares/auth.middleware.js';
import { 
  getConversations, 
  createOrGetConversation, 
  getMessages, 
  sendMessage 
} from '../controller/chat.controller.js';

const router = express.Router();

router.use(authUserMiddleware); // All chat routes require user auth

router.get('/', getConversations);
router.post('/', createOrGetConversation);
router.get('/:conversationId/messages', getMessages);
router.post('/:conversationId/messages', sendMessage);

export default router;
