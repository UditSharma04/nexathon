import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { getUserProfile } from '../controllers/userController.js';
import User from '../models/User.js';

const router = express.Router();

// Get user profile with items and stats
router.get('/profile', authenticateToken, getUserProfile);

// Get nearby users
router.get('/nearby', authenticateToken, async (req, res, next) => {
  try {
    const { longitude, latitude, radius = 50 } = req.query;

    const nearbyUsers = await User.find({
      _id: { $ne: req.user.id }, // Exclude current user
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)]
          },
          $maxDistance: radius * 1000 // Convert km to meters
        }
      }
    }).select('name location itemsShared');

    res.json(nearbyUsers);
  } catch (error) {
    next(error);
  }
});

export default router;