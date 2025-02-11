import Review from '../models/Review.js';
import Booking from '../models/Booking.js';
import User from '../models/User.js';
import Item from '../models/Item.js';

export const createReview = async (req, res) => {
  try {
    const { bookingId, rating, comment, reviewType, reviewedUser, reviewedItem } = req.body;
    const reviewerId = req.user.id;

    // Find the booking
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Verify booking is completed
    if (booking.status !== 'completed') {
      return res.status(400).json({ message: 'Can only review completed bookings' });
    }

    // Check if review already exists
    const existingReview = await Review.findOne({ 
      booking: bookingId,
      reviewer: reviewerId,
      reviewType
    });
    
    if (existingReview) {
      return res.status(400).json({ message: 'Review already exists' });
    }

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

    // Update ratings based on review type
    if (reviewType === 'user') {
      // Update user's average rating
      const userReviews = await Review.find({ 
        reviewedUser,
        reviewType: 'user'
      });
      
      const averageRating = userReviews.reduce((acc, review) => acc + review.rating, 0) / userReviews.length;
      
      await User.findByIdAndUpdate(reviewedUser, {
        $set: { rating: averageRating.toFixed(1) }
      });
    } else {
      // Update item's average rating
      const itemReviews = await Review.find({ 
        reviewedItem,
        reviewType: 'item'
      });
      
      const averageRating = itemReviews.reduce((acc, review) => acc + review.rating, 0) / itemReviews.length;
      
      await Item.findByIdAndUpdate(reviewedItem, {
        $set: { rating: averageRating.toFixed(1) }
      });
    }

    // Update booking with review info
    const updateField = reviewType === 'user' ? 'userReview' : 'itemReview';
    await Booking.findByIdAndUpdate(bookingId, {
      $set: { [updateField]: review._id }
    });

    res.status(201).json(review);
  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({ message: 'Error creating review' });
  }
};

export const getItemReviews = async (req, res) => {
  try {
    const { itemId } = req.params;
    const reviews = await Review.find({ 
      reviewedItem: itemId,
      reviewType: 'item'
    })
      .populate('reviewer', 'name avatar rating')
      .populate('booking', 'startDate endDate')
      .sort('-createdAt');

    res.json(reviews);
  } catch (error) {
    console.error('Get item reviews error:', error);
    res.status(500).json({ message: 'Error fetching reviews' });
  }
};

export const getUserReviews = async (req, res) => {
  try {
    const { userId } = req.params;
    const reviews = await Review.find({ 
      reviewedUser: userId,
      reviewType: 'user'
    })
      .populate('reviewer', 'name avatar rating')
      .populate('booking', 'startDate endDate')
      .populate('reviewedItem', 'name images')
      .sort('-createdAt');

    res.json(reviews);
  } catch (error) {
    console.error('Get user reviews error:', error);
    res.status(500).json({ message: 'Error fetching reviews' });
  }
};

// Get reviews given by a user
export const getReviewsByUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const reviews = await Review.find({ reviewer: userId })
      .populate('reviewedUser', 'name avatar rating')
      .populate('reviewedItem', 'name images')
      .populate('booking', 'startDate endDate')
      .sort('-createdAt');

    res.json(reviews);
  } catch (error) {
    console.error('Get reviews by user error:', error);
    res.status(500).json({ message: 'Error fetching reviews' });
  }
}; 