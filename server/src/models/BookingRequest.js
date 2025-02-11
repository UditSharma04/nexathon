import mongoose from 'mongoose';

const bookingRequestSchema = new mongoose.Schema({
  item: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item',
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  requester: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  totalAmount: {
    type: Number,
    required: true
  },
  period: {
    type: String,
    enum: ['hour', 'day', 'week'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'declined', 'borrowed', 'completed', 'cancelled'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded'],
    default: 'pending'
  },
  paymentDetails: {
    paymentId: String,
    amount: Number,
    method: String,
    timestamp: Date
  },
  returnConfirmation: {
    owner: {
      type: Boolean,
      default: false
    },
    requester: {
      type: Boolean,
      default: false
    }
  },
  userReview: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Review'
  },
  itemReview: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Review'
  }
}, {
  timestamps: true
});

// Create indexes for better query performance
bookingRequestSchema.index({ owner: 1, status: 1 });
bookingRequestSchema.index({ requester: 1, status: 1 });
bookingRequestSchema.index({ item: 1 });
bookingRequestSchema.index({ status: 1 });

// Remove or clean up any middleware
bookingRequestSchema.pre('save', function(next) {
  // Remove any console.log statements
  next();
});

export default mongoose.model('BookingRequest', bookingRequestSchema); 