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
  status: {
    type: String,
    enum: ['pending', 'accepted', 'declined', 'cancelled'],
    default: 'pending'
  },
  message: {
    type: String,
    required: true
  },
  totalAmount: {
    type: Number,
    required: true
  },
  requestedAt: {
    type: Date,
    default: Date.now
  },
  period: {
    type: String,
    enum: ['hour', 'day', 'week'],
    required: true
  }
}, {
  timestamps: true
});

// Create indexes
bookingRequestSchema.index({ owner: 1, status: 1 });
bookingRequestSchema.index({ requester: 1, status: 1 });
bookingRequestSchema.index({ item: 1 });

export default mongoose.model('BookingRequest', bookingRequestSchema); 