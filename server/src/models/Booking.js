import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
    item: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item',
        required: true
    },
    lender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    borrower: {
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
    totalAmount: {
        type: Number,
        required: true
    },
    userReview: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review'
    },
    itemReview: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Create indexes for better query performance
bookingSchema.index({ lender: 1, status: 1 });
bookingSchema.index({ borrower: 1, status: 1 });
bookingSchema.index({ item: 1 });
bookingSchema.index({ status: 1 });

export default mongoose.models.Booking || mongoose.model('Booking', bookingSchema);
