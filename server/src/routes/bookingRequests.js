import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import {
  createBookingRequest,
  getMyRequests,
  getIncomingRequests,
  updateRequestStatus
} from '../controllers/bookingRequestController.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Create a new booking request
router.post('/', createBookingRequest);

// Get my booking requests
router.get('/my-requests', getMyRequests);

// Get incoming booking requests (as an owner)
router.get('/incoming', getIncomingRequests);

// Update booking request status
router.patch('/:requestId/status', updateRequestStatus);

export default router; 