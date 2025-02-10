import Conversation from '../models/Conversation.js';
import User from '../models/User.js';
import Chat from '../models/Chat.js';

export const createConversation = async (req, res) => {
  try {
    const { itemId, ownerId, initialMessage } = req.body;
    const currentUserId = req.user.id; // This will now be the correct MongoDB ObjectId

    // Check if conversation already exists
    const existingConversation = await Conversation.findOne({
      item: itemId,
      participants: { $all: [currentUserId, ownerId] }
    });

    if (existingConversation) {
      return res.status(200).json(existingConversation);
    }

    // Create new conversation
    const conversation = new Conversation({
      participants: [currentUserId, ownerId], // currentUserId will be valid now
      item: itemId,
      messages: [{
        sender: currentUserId,
        content: initialMessage,
        createdAt: new Date()
      }],
      lastMessage: {
        content: initialMessage,
        createdAt: new Date()
      }
    });

    await conversation.save();

    // Create a new chat with the initial message
    const chat = new Chat({
      conversation: conversation._id,
      participants: [currentUserId, ownerId],
      messages: [{
        sender: currentUserId,
        content: initialMessage,
        createdAt: new Date()
      }],
      lastMessage: {
        content: initialMessage,
        sender: currentUserId,
        timestamp: new Date()
      }
    });

    await chat.save();

    // Populate the conversation with participant and item details
    const populatedConversation = await Conversation.findById(conversation._id)
      .populate('participants', 'name email')
      .populate('item', 'name images')
      .populate('messages.sender', 'name');

    res.status(201).json(populatedConversation);
  } catch (error) {
    console.error('Create conversation error:', error);
    res.status(500).json({ message: 'Error creating conversation' });
  }
};

export const getConversations = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log('Fetching conversations for user:', userId); // Debug log

    const conversations = await Conversation.find({
      participants: userId
    })
      .populate('participants', 'name email') // Populate participant details
      .populate('item', 'name')              // Populate item details
      .sort({ updatedAt: -1 });

    console.log('Found conversations:', conversations); // Debug log
    res.json(conversations);
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({ message: 'Error fetching conversations' });
  }
}; 