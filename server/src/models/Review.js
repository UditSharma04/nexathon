import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BookingRequest',
    required: true
  },
  reviewer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  reviewType: {
    type: String,
    enum: ['user', 'item'],
    required: true
  },
  // For user reviews
  reviewedUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  // For item reviews
  reviewedItem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item'
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500
  }
}, {
  timestamps: true
});

// Ensure either reviewedUser or reviewedItem is provided based on reviewType
reviewSchema.pre('save', function(next) {
  if (this.reviewType === 'user' && !this.reviewedUser) {
    next(new Error('reviewedUser is required for user reviews'));
  } else if (this.reviewType === 'item' && !this.reviewedItem) {
    next(new Error('reviewedItem is required for item reviews'));
  } else {
    next();
  }
});

// Indexes for better query performance
reviewSchema.index({ booking: 1 });
reviewSchema.index({ reviewer: 1 });
reviewSchema.index({ reviewedUser: 1 });
reviewSchema.index({ reviewedItem: 1 });
reviewSchema.index({ reviewType: 1 });

export default mongoose.model('Review', reviewSchema); 