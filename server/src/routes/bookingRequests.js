import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import {
  createBookingRequest,
  getMyRequests,
  getIncomingRequests,
  updateRequestStatus,
  updateBookingPaymentStatus
} from '../controllers/bookingRequestController.js';
import Booking from '../models/Booking.js';

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

// Update booking payment status (new route)
router.patch('/:id/payment', updateBookingPaymentStatus);

// Add this route to handle booking status updates
router.patch('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, paymentDetails, paymentStatus } = req.body;

    const booking = await Booking.findByIdAndUpdate(
      id,
      {
        status,
        paymentStatus,
        paymentDetails,
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json(booking);
  } catch (error) {
    console.error('Error updating booking status:', error);
    res.status(500).json({ message: 'Error updating booking status' });
  }
});

export default router; 