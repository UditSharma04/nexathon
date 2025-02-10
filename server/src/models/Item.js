import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Item name is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: {
      values: ['tools', 'electronics', 'sports', 'camping', 'party'],
      message: '{VALUE} is not a valid category'
    }
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  period: {
    type: String,
    enum: {
      values: ['hour', 'day', 'week'],
      message: '{VALUE} is not a valid rental period'
    },
    required: [true, 'Rental period is required']
  },
  images: [{
    type: String,
    required: [true, 'At least one image is required']
  }],
  status: {
    type: String,
    enum: ['available', 'borrowed', 'maintenance'],
    default: 'available'
  },
  condition: {
    type: String,
    required: [true, 'Condition is required'],
    enum: {
      values: ['new', 'like-new', 'good', 'fair'],
      message: '{VALUE} is not a valid condition'
    }
  },
  location: {
    type: {
      type: String,
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      required: [true, 'Location coordinates are required']
    }
  },
  features: [String],
  rules: [String],
  insurance: {
    type: Number,
    required: [true, 'Insurance value is required'],
    min: [0, 'Insurance value cannot be negative']
  },
  totalBookings: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

itemSchema.index({ location: '2dsphere' });

export default mongoose.models.Item || mongoose.model('Item', itemSchema);