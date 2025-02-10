import express from 'express';
import { getMessages, sendMessage, markAsRead } from '../controllers/chatController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/:conversationId', authenticateToken, getMessages);
router.post('/:conversationId', authenticateToken, sendMessage);
router.put('/:conversationId/read', authenticateToken, markAsRead);

export default router; 