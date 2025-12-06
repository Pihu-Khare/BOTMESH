import express from 'express';
import { sendMessage, getMessages } from '../controllers/chatController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

router.post('/message', sendMessage);
router.get('/:sessionId/messages', getMessages);

export default router;
