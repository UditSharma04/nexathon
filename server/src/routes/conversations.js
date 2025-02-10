import express from 'express';
import { createConversation, getConversations } from '../controllers/conversationController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/', authenticateToken, createConversation);
router.get('/', authenticateToken, getConversations);

export default router; 