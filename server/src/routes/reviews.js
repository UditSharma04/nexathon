import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import Review from '../models/Review.js';
import User from '../models/User.js';
import Item from '../models/Item.js';
import BookingRequest from '../models/BookingRequest.js';

const router = express.Router();

router.use(authenticateToken);

// Create a review
router.post('/', async (req, res) => {
  try {
    const { bookingId, rating, comment, reviewType, reviewedUser, reviewedItem } = req.body;
    const reviewerId = req.user.id;

    // Create the review
    const review = new Review({
      booking: bookingId,
      reviewer: reviewerId,
      rating,
      comment,
      reviewType,
      ...(reviewType === 'user' && { reviewedUser }),
      ...(reviewType === 'item' && { reviewedItem })
    });

    await review.save();

    // Update the booking with the review reference
    const reviewField = reviewType === 'user' ? 'userReview' : 'itemReview';
    await BookingRequest.findByIdAndUpdate(bookingId, {
      [reviewField]: review._id
    });

    // Update average rating
    if (reviewType === 'user') {
      const userReviews = await Review.find({ 
        reviewedUser,
        reviewType: 'user'
      });
      
      const averageRating = userReviews.reduce((acc, review) => acc + review.rating, 0) / userReviews.length;
      
      await User.findByIdAndUpdate(reviewedUser, {
        $set: { rating: averageRating.toFixed(1) }
      });
    } else {
      const itemReviews = await Review.find({ 
        reviewedItem,
        reviewType: 'item'
      });
      
      const averageRating = itemReviews.reduce((acc, review) => acc + review.rating, 0) / itemReviews.length;
      
      await Item.findByIdAndUpdate(reviewedItem, {
        $set: { rating: averageRating.toFixed(1) }
      });
    }

    // Return populated review
    const populatedReview = await Review.findById(review._id)
      .populate('reviewer', 'name avatar')
      .populate('reviewedUser', 'name avatar')
      .populate('reviewedItem', 'name images');

    res.status(201).json(populatedReview);
  } catch (error) {
    res.status(500).json({ message: 'Error creating review' });
  }
});

// Get reviews for an item
router.get('/item/:itemId', async (req, res) => {
  try {
    const reviews = await Review.find({ 
      reviewedItem: req.params.itemId,
      reviewType: 'item'
    })
      .populate('reviewer', 'name avatar rating')
      .sort('-createdAt');

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reviews' });
  }
});

// Get reviews for a user
router.get('/user/:userId?', async (req, res) => {
  try {
    const userId = req.params.userId || req.user.id;

    // First, get all items owned by the user
    const userItems = await Item.find({ owner: userId }).select('_id');
    const userItemIds = userItems.map(item => item._id);

    const reviews = await Review.find({ 
      $or: [
        { reviewer: userId },           // Reviews written by the user
        { reviewedUser: userId },       // Reviews about the user
        { 
          reviewType: 'item',
          reviewedItem: { $in: userItemIds }  // Reviews about user's items
        }
      ]
    })
    .populate('reviewer', 'name avatar rating')
    .populate('reviewedUser', 'name avatar')
    .populate('reviewedItem', 'name images owner')
    .populate('booking')
    .sort('-createdAt');

    // Add a field to indicate the review's relationship to the user
    const enhancedReviews = reviews.map(review => {
      const reviewObj = review.toObject();
      reviewObj.relationship = 
        review.reviewer.toString() === userId ? 'written' :
        review.reviewedUser?.toString() === userId ? 'received' :
        'item';
      return reviewObj;
    });

    res.json(enhancedReviews);
  } catch (error) {
    console.error('Error fetching user reviews:', error);
    res.status(500).json({ message: 'Error fetching reviews' });
  }
});

export default router; 