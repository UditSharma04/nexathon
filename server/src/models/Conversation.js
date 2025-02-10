import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema({
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  item: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item'
  },
  messages: [{
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    content: String,
    createdAt: {
      type: Date,
      default: Date.now
    },
    read: {
      type: Boolean,
      default: false
    }
  }],
  lastMessage: {
    content: String,
    createdAt: Date
  }
}, {
  timestamps: true
});

export default mongoose.model('Conversation', conversationSchema); 