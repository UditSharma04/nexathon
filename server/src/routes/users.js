import express from 'express';
import { auth } from '../middleware/auth.js';
import User from '../models/User.js';

const router = express.Router();

router.get('/nearby', auth, async (req, res, next) => {
  try {
    const { longitude, latitude, radius = 50 } = req.query;

    const nearbyUsers = await User.find({
      _id: { $ne: req.user._id }, // Exclude current user
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